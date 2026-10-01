import os
import re
import io
import zipfile
import tempfile
import subprocess
import requests
from typing import Dict, Any, List, Optional
from .analyzer import StaticAnalyzer
from .. import config

class GitHubService:
    def __init__(self):
        self.default_headers = {"User-Agent": "CodeLens-AI-Observability"}
        self.analyzer = StaticAnalyzer()

    def parse_repo_url(self, url: str) -> tuple[str, str]:
        """Extracts and sanitizes owner and repo name from GitHub URL."""
        clean = url.strip().rstrip('/')
        match = re.search(r'github\.com/([^/]+)/([^/]+)', clean)
        if match:
            owner, repo = match.group(1), match.group(2).replace('.git', '')
        else:
            parts = clean.split('/')
            if len(parts) == 2:
                owner, repo = parts[0], parts[1].replace('.git', '')
            else:
                raise ValueError(f"Invalid GitHub repository URL: {url}. Expected format: https://github.com/owner/repo")
        
        # Security sanitization against directory traversal or special characters
        if not re.match(r'^[a-zA-Z0-9_\-\.]+$', owner) or not re.match(r'^[a-zA-Z0-9_\-\.]+$', repo):
            raise ValueError("Invalid characters detected in repository path.")

        return owner, repo

    def fetch_and_scan(self, repo_url: str, token: Optional[str] = None) -> Dict[str, Any]:
        """
        Production-Grade Multi-Engine GitHub Scanner:
        1. Authenticated REST API (if user provides token)
        2. High-Speed Direct Codeload Zip Streaming (Zero rate-limit, 100% resilient)
        3. Native Git Shallow Clone Engine (Local ephemeral workspace)
        """
        owner, repo = self.parse_repo_url(repo_url)
        auth_token = token or getattr(config, 'GITHUB_TOKEN', None) or os.getenv("GITHUB_TOKEN")

        # Engine 1: Authenticated GitHub REST API
        if auth_token and auth_token.strip():
            try:
                print(f"[GITHUB_SERVICE] Attempting Authenticated REST API Scan for {owner}/{repo}...")
                return self._scan_via_api(owner, repo, repo_url, auth_token.strip())
            except Exception as api_err:
                print(f"[GITHUB_SERVICE] REST API scan note: {api_err}. Falling back to Direct Archive Engine...")

        # Engine 2: High-Speed Direct Codeload Zip Streaming (Bypasses 60 req/hr rate limit)
        try:
            print(f"[GITHUB_SERVICE] Attempting High-Speed Archive Stream for {owner}/{repo}...")
            return self._scan_via_codeload(owner, repo, repo_url, auth_token)
        except Exception as zip_err:
            print(f"[GITHUB_SERVICE] Codeload stream note: {zip_err}. Falling back to Native Git Engine...")

        # Engine 3: Native Git Clone Engine (Depth 1, Single Branch)
        try:
            print(f"[GITHUB_SERVICE] Attempting Native Git Shallow Clone for {owner}/{repo}...")
            return self._scan_via_git_clone(owner, repo, repo_url, auth_token)
        except Exception as git_err:
            print(f"[GITHUB_SERVICE] Native git clone failed: {git_err}")
            raise Exception(f"Unable to access repository '{owner}/{repo}'. Please verify the repository exists and is accessible.")

    def _scan_via_codeload(self, owner: str, repo: str, repo_url: str, auth_token: Optional[str] = None) -> Dict[str, Any]:
        """Streams repository archive directly from GitHub CDN with zero REST API rate limit."""
        branches = ['main', 'master', 'HEAD']
        headers = dict(self.default_headers)
        if auth_token:
            headers["Authorization"] = f"token {auth_token}"

        content_bytes = None

        for br in branches:
            zip_url = f"https://codeload.github.com/{owner}/{repo}/zip/refs/heads/{br}"
            try:
                res = requests.get(zip_url, headers=headers, timeout=25)
                if res.status_code == 200 and len(res.content) > 100:
                    content_bytes = res.content
                    break
            except Exception:
                continue

        if not content_bytes:
            raise Exception(f"Could not download repository archive from codeload for {owner}/{repo}")

        z = zipfile.ZipFile(io.BytesIO(content_bytes))
        file_names = z.namelist()

        scannable_extensions = ('.py', '.java', '.js', '.jsx', '.ts', '.tsx', '.cpp', '.c', '.h', '.json', '.xml', '.yml', '.yaml', '.sql', '.go', '.rs')
        excluded_dirs = ('node_modules/', '.git/', 'dist/', 'build/', 'venv/', '__pycache__/', '.next/', 'target/', 'vendor/')

        target_files = []
        for name in file_names:
            if name.endswith('/'):
                continue
            if any(exc in name for exc in excluded_dirs):
                continue
            if name.lower().endswith(scannable_extensions):
                target_files.append(name)

        all_issues = []
        files_scanned = 0

        # Scan files (up to top 60 files for deep coverage)
        for fname in target_files[:60]:
            try:
                with z.open(fname) as f:
                    # Strip leading repository top-level directory (e.g. AI_CODE_ANALYZER-main/...)
                    clean_path = fname.split('/', 1)[-1] if '/' in fname else fname
                    text = f.read().decode('utf-8', errors='ignore')
                    issues = self.analyzer.analyze_file(clean_path, text)
                    all_issues.extend(issues)
                    files_scanned += 1
            except Exception:
                continue

        return self._format_result(owner, repo, repo_url, file_names, all_issues, files_scanned)

    def _scan_via_git_clone(self, owner: str, repo: str, repo_url: str, auth_token: Optional[str] = None) -> Dict[str, Any]:
        """Uses local git CLI to shallow clone the repository into an ephemeral workspace."""
        with tempfile.TemporaryDirectory() as temp_dir:
            clone_url = f"https://github.com/{owner}/{repo}.git"
            if auth_token:
                clone_url = f"https://x-access-token:{auth_token}@github.com/{owner}/{repo}.git"

            cmd = ["git", "clone", "--depth", "1", "--single-branch", clone_url, temp_dir]
            proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=35)
            if proc.returncode != 0:
                raise Exception(f"Git clone error: {proc.stderr}")

            all_issues = []
            files_scanned = 0
            total_files = 0
            scannable_extensions = ('.py', '.java', '.js', '.jsx', '.ts', '.tsx', '.cpp', '.c', '.h', '.json', '.xml', '.yml', '.yaml', '.sql', '.go', '.rs')
            excluded_dirs = {'node_modules', '.git', 'dist', 'build', 'venv', '__pycache__', '.next', 'target', 'vendor'}

            file_list = []
            for root, dirs, files in os.walk(temp_dir):
                dirs[:] = [d for d in dirs if d not in excluded_dirs]
                for file in files:
                    total_files += 1
                    rel_path = os.path.relpath(os.path.join(root, file), temp_dir).replace('\\', '/')
                    file_list.append(rel_path)
                    if file.lower().endswith(scannable_extensions) and files_scanned < 60:
                        full_path = os.path.join(root, file)
                        try:
                            with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                                content = f.read()
                                issues = self.analyzer.analyze_file(rel_path, content)
                                all_issues.extend(issues)
                                files_scanned += 1
                        except Exception:
                            continue

            return self._format_result(owner, repo, repo_url, file_list, all_issues, files_scanned)

    def _scan_via_api(self, owner: str, repo: str, repo_url: str, token: str) -> Dict[str, Any]:
        """Scans using authenticated GitHub REST API."""
        headers = dict(self.default_headers)
        headers["Authorization"] = f"token {token}"

        info_url = f"https://api.github.com/repos/{owner}/{repo}"
        res = requests.get(info_url, headers=headers, timeout=12)
        if res.status_code != 200:
            raise Exception(f"GitHub API Error: {res.status_code} - {res.json().get('message', 'Failed to fetch repo')}")

        repo_info = res.json()
        default_branch = repo_info.get("default_branch", "main")

        tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1"
        res_tree = requests.get(tree_url, headers=headers, timeout=15)
        if res_tree.status_code != 200:
            raise Exception(f"Failed to fetch repository tree: {res_tree.json().get('message')}")

        tree_data = res_tree.json().get("tree", [])
        blobs = [item for item in tree_data if item.get("type") == "blob"]
        scannable_extensions = ('.py', '.java', '.js', '.jsx', '.ts', '.tsx', '.cpp', '.c', '.h', '.json', '.xml', '.yml', '.yaml')
        target_files = [b for b in blobs if b['path'].lower().endswith(scannable_extensions)][:50]

        all_issues = []
        files_scanned = 0

        for file_node in target_files:
            file_path = file_node['path']
            raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}/{file_path}"
            raw_res = requests.get(raw_url, headers=headers, timeout=10)
            if raw_res.status_code == 200:
                content = raw_res.text
                file_issues = self.analyzer.analyze_file(file_path, content)
                all_issues.extend(file_issues)
                files_scanned += 1

        file_names = [b['path'] for b in blobs]
        return self._format_result(owner, repo, repo_url, file_names, all_issues, files_scanned)

    def _format_result(self, owner: str, repo: str, repo_url: str, file_names: List[str], all_issues: List[Dict[str, Any]], files_scanned: int) -> Dict[str, Any]:
        """Calculates stack detection and severity telemetry."""
        total_files = len(file_names)

        # Detect primary technology stack
        detected_stack = "Multi-Language"
        lower_names = [f.lower() for f in file_names]
        if any(f.endswith('.java') or 'pom.xml' in f or 'build.gradle' in f for f in lower_names):
            detected_stack = "Spring Boot / Java"
        elif any(f.endswith('.py') or 'requirements.txt' in f for f in lower_names):
            detected_stack = "Python / FastAPI"
        elif any(f.endswith(('.jsx', '.tsx', 'package.json')) for f in lower_names):
            detected_stack = "React / Node.js"
        elif any(f.endswith(('.cpp', '.cc', '.cxx', 'cmakelists.txt')) for f in lower_names):
            detected_stack = "C++ Systems"

        critical = sum(1 for i in all_issues if i['severity'] == 'CRITICAL')
        high = sum(1 for i in all_issues if i['severity'] == 'HIGH')
        medium = sum(1 for i in all_issues if i['severity'] == 'MEDIUM')
        low = sum(1 for i in all_issues if i['severity'] == 'LOW')

        return {
            "name": f"{owner}/{repo}",
            "repo_url": repo_url,
            "detected_stack": detected_stack,
            "total_files": max(total_files, files_scanned),
            "files_scanned": files_scanned,
            "total_issues": len(all_issues),
            "critical_count": critical,
            "high_count": high,
            "medium_count": medium,
            "low_count": low,
            "issues": all_issues
        }
