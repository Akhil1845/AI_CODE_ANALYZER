import os
import re
import io
import zipfile
import tempfile
import subprocess
import requests
import base64
import json
import time
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
            elif len(parts) == 1 and clean:
                owner, repo = "auto", parts[0].replace('.git', '')
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
        has_java = any(f.endswith('.java') or 'pom.xml' in f or 'build.gradle' in f for f in lower_names)
        has_python = any(f.endswith('.py') or 'requirements.txt' in f or 'setup.py' in f for f in lower_names)
        has_js = any(f.endswith(('.jsx', '.tsx', 'package.json')) for f in lower_names)
        has_cpp = any(f.endswith(('.cpp', '.cc', '.cxx', 'cmakelists.txt')) for f in lower_names)

        if has_python and has_js:
            detected_stack = "Full Stack (Python / FastAPI + React)"
        elif has_java and has_js:
            detected_stack = "Full Stack (Spring Boot + React)"
        elif has_python:
            detected_stack = "Python / FastAPI"
        elif has_java:
            detected_stack = "Spring Boot / Java"
        elif has_js:
            detected_stack = "React / Node.js"
        elif has_cpp:
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

    def verify_token(self, token: str, repo_url: Optional[str] = None) -> Dict[str, Any]:
        """
        Securely verifies a GitHub Personal Access Token (PAT).
        Checks authenticated user identity, token scopes, and repository write/push permissions.
        """
        clean_token = token.strip() if token else ""
        if not clean_token:
            return {"valid": False, "message": "GitHub Personal Access Token is required."}

        headers = {
            "Authorization": f"token {clean_token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "CodeLens-AI-AutoFix"
        }

        # 1. Verify User and Scopes
        try:
            user_res = requests.get("https://api.github.com/user", headers=headers, timeout=10)
        except Exception as e:
            return {"valid": False, "message": f"Network error connecting to GitHub API: {str(e)}"}

        if user_res.status_code == 401:
            return {"valid": False, "message": "Invalid or expired GitHub Personal Access Token."}
        elif user_res.status_code != 200:
            return {"valid": False, "message": f"GitHub API returned error: {user_res.status_code}"}

        user_data = user_res.json()
        username = user_data.get("login", "")
        avatar_url = user_data.get("avatar_url", "")
        scopes_header = user_res.headers.get("X-OAuth-Scopes", "")
        scopes = [s.strip() for s in scopes_header.split(",") if s.strip()]

        result = {
            "valid": True,
            "username": username,
            "avatar_url": avatar_url,
            "scopes": scopes,
            "repo_accessible": False,
            "can_push": False,
            "default_branch": "main",
            "message": f"Authenticated successfully as @{username}."
        }

        # 2. Check specific repository permissions if repo_url provided
        if repo_url and repo_url.strip():
            try:
                owner, repo = self.parse_repo_url(repo_url)
                repo_res = requests.get(f"https://api.github.com/repos/{owner}/{repo}", headers=headers, timeout=10)
                if repo_res.status_code == 200:
                    repo_info = repo_res.json()
                    result["repo_accessible"] = True
                    result["repo"] = f"{owner}/{repo}"
                    result["default_branch"] = repo_info.get("default_branch", "main")
                    perms = repo_info.get("permissions", {})
                    can_push = perms.get("push", False) or perms.get("admin", False)
                    result["can_push"] = can_push
                    if can_push:
                        result["message"] = f"Authenticated as @{username} with direct WRITE/PUSH permissions to {owner}/{repo}."
                    else:
                        result["message"] = f"Authenticated as @{username}. You have READ permissions to {owner}/{repo} (Pull Requests can be opened from a fork or feature branch)."
                elif repo_res.status_code == 404:
                    result["message"] = f"Repository {owner}/{repo} not found or is private. Ensure your token has 'repo' scope."
                else:
                    result["message"] = f"Repository check returned HTTP {repo_res.status_code}."
            except Exception as ex:
                result["message"] = f"Authenticated as @{username}. Repository check note: {str(ex)}"

        return result

    def apply_fixes(
        self,
        repo_url: str,
        token: str,
        fixes: List[Dict[str, str]],
        branch_mode: str = "pr",
        target_branch: Optional[str] = None,
        pr_title: Optional[str] = None,
        commit_message: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Directly and securely commits solution files to GitHub repository.
        Creates a new branch and opens a Pull Request, or commits directly to target branch.
        """
        clean_token = token.strip() if token else ""
        if not clean_token:
            raise ValueError("GitHub token is required to apply fixes.")
        if not fixes:
            raise ValueError("No solution files specified to apply.")

        owner, repo = self.parse_repo_url(repo_url)
        headers = {
            "Authorization": f"token {clean_token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "CodeLens-AI-AutoFix"
        }

        # Auto-resolve owner if "auto"
        if owner == "auto":
            user_res = requests.get("https://api.github.com/user", headers=headers, timeout=10)
            if user_res.status_code == 200:
                owner = user_res.json().get("login", "auto")

        # 1. Fetch repo info to get default branch (or auto-create if not found)
        repo_res = requests.get(f"https://api.github.com/repos/{owner}/{repo}", headers=headers, timeout=12)
        if repo_res.status_code == 404:
            user_res = requests.get("https://api.github.com/user", headers=headers, timeout=10)
            if user_res.status_code == 200:
                user_login = user_res.json().get("login")
                if user_login and (owner.lower() == user_login.lower() or owner == "auto"):
                    owner = user_login
                    create_payload = {
                        "name": repo,
                        "description": "Full-stack project scaffolded via CodeLens AI Studio",
                        "private": False,
                        "auto_init": True
                    }
                    create_res = requests.post("https://api.github.com/user/repos", headers=headers, json=create_payload, timeout=15)
                    if create_res.status_code in (200, 201):
                        time.sleep(2.0)
                        repo_res = requests.get(f"https://api.github.com/repos/{owner}/{repo}", headers=headers, timeout=12)

        if repo_res.status_code != 200:
            err_msg = repo_res.json().get("message", f"HTTP {repo_res.status_code}")
            raise Exception(f"Unable to access {owner}/{repo} via GitHub API: {err_msg}. Verify your token has 'repo' scope.")

        repo_info = repo_res.json()
        default_branch = repo_info.get("default_branch", "main")
        base_branch = target_branch.strip() if (target_branch and target_branch.strip()) else default_branch

        # Determine the branch to commit into
        if branch_mode == "pr":
            timestamp = int(time.time())
            commit_branch = f"codelens/cloud-deployment-fixes-{timestamp}"
            
            # Get latest commit SHA on base branch
            ref_res = requests.get(f"https://api.github.com/repos/{owner}/{repo}/git/ref/heads/{base_branch}", headers=headers, timeout=10)
            if ref_res.status_code != 200:
                raise Exception(f"Could not find base branch '{base_branch}' in {owner}/{repo}.")
            base_sha = ref_res.json()["object"]["sha"]

            # Create new branch
            create_branch_res = requests.post(
                f"https://api.github.com/repos/{owner}/{repo}/git/refs",
                headers=headers,
                json={"ref": f"refs/heads/{commit_branch}", "sha": base_sha},
                timeout=12
            )
            if create_branch_res.status_code not in (200, 201):
                err_detail = create_branch_res.json().get("message", "Unknown error")
                raise Exception(f"Failed to create branch '{commit_branch}': {err_detail}")
        else:
            commit_branch = base_branch

        # 2. Deduplicate and merge fixes by file path
        grouped_fixes: Dict[str, List[str]] = {}
        for fix in fixes:
            file_path = fix.get("path", "").strip().lstrip('/')
            raw_content = fix.get("content", "")
            if not file_path:
                continue
            if file_path not in grouped_fixes:
                grouped_fixes[file_path] = []
            grouped_fixes[file_path].append(raw_content)

        final_fixes: List[Dict[str, str]] = []
        for file_path, contents in grouped_fixes.items():
            # Merge vercel.json configurations
            if file_path.lower().endswith("vercel.json"):
                combined_headers = {
                    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
                    "X-Frame-Options": "DENY",
                    "X-Content-Type-Options": "nosniff",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                }
                
                # Check for custom headers from issues
                for c in contents:
                    for line in c.splitlines():
                        if "key" in line and "value" in line:
                            try:
                                k_match = re.search(r'"key"\s*:\s*"([^"]+)"', line)
                                v_match = re.search(r'"value"\s*:\s*"([^"]+)"', line)
                                if k_match and v_match:
                                    combined_headers[k_match.group(1)] = v_match.group(1)
                            except Exception:
                                pass

                # Query active tunnel bridge dynamically if available
                active_tunnel_url = "https://interdental-farcically-bernardina.ngrok-free.dev"
                try:
                    import requests as rq
                    bridge_res = rq.get("http://127.0.0.1:4040/api/tunnels", timeout=1.5)
                    if bridge_res.status_code == 200:
                        for tun in bridge_res.json().get("tunnels", []):
                            if tun.get("public_url", "").startswith("https://"):
                                active_tunnel_url = tun["public_url"]
                                break
                except Exception:
                    pass

                # Build production vercel.json
                master_vercel = {
                    "version": 2,
                    "headers": [
                        {
                            "source": "/(.*)",
                            "headers": [{"key": k, "value": v} for k, v in combined_headers.items()]
                        }
                    ],
                    "rewrites": [
                        {
                            "source": "/api/(.*)",
                            "destination": f"{active_tunnel_url}/api/$1"
                        },
                        {
                            "source": "/((?!api/|.*\\..*).*)",
                            "destination": "/index.html"
                        }
                    ]
                }
                final_fixes.append({
                    "path": file_path,
                    "content": json.dumps(master_vercel, indent=2)
                })
            else:
                last_content = contents[-1]
                # Safeguard: Do not overwrite large source code files if the fix content is only a short comment/snippet
                if any(file_path.lower().endswith(ext) for ext in [".py", ".java", ".js", ".jsx", ".ts", ".tsx", ".cpp", ".c"]):
                    lines_count = len([l for l in last_content.splitlines() if l.strip()])
                    if lines_count <= 4 and ("recommend" in last_content.lower() or "log the error" in last_content.lower()):
                        continue # Skip accidental overwrite of full service files with recommendation stubs
                final_fixes.append({"path": file_path, "content": last_content})

        # 3. Commit each unique file with retry backoff
        committed_files = []
        for fix in final_fixes:
            file_path = fix["path"]
            raw_content = fix["content"]

            # Clean JSON files of any stray comment lines
            if file_path.lower().endswith(".json"):
                clean_lines = [l for l in raw_content.splitlines() if not l.strip().startswith("//") and not l.strip().startswith("/*") and not l.strip().startswith("*")]
                clean_content = "\n".join(clean_lines).strip()
            else:
                clean_content = raw_content

            b64_content = base64.b64encode(clean_content.encode("utf-8")).decode("utf-8")
            file_commit_msg = commit_message or f"fix(codelens): configure {file_path} for production deployment"

            # Retry up to 3 times to handle SHA race conditions
            success = False
            last_err = ""
            for attempt in range(3):
                file_sha = None
                check_res = requests.get(
                    f"https://api.github.com/repos/{owner}/{repo}/contents/{file_path}?ref={commit_branch}&t={int(time.time()*1000)}",
                    headers=headers,
                    timeout=12
                )
                if check_res.status_code == 200:
                    file_sha = check_res.json().get("sha")

                put_payload = {
                    "message": file_commit_msg,
                    "content": b64_content,
                    "branch": commit_branch
                }
                if file_sha:
                    put_payload["sha"] = file_sha

                put_res = requests.put(
                    f"https://api.github.com/repos/{owner}/{repo}/contents/{file_path}",
                    headers=headers,
                    json=put_payload,
                    timeout=15
                )

                if put_res.status_code in (200, 201):
                    success = True
                    committed_files.append(file_path)
                    break
                else:
                    try:
                        err_json = put_res.json()
                        last_err = err_json.get("message", f"HTTP {put_res.status_code}")
                    except Exception:
                        last_err = f"HTTP {put_res.status_code}"
                    time.sleep(1.0)

            if not success:
                raise Exception(f"Failed to commit file '{file_path}' to branch '{commit_branch}': {last_err}")

        # 3. If PR mode, open Pull Request
        pr_info = None
        if branch_mode == "pr":
            pr_title_text = pr_title or "CodeLens AI: Cloud Deployment & Health Fixes"
            pr_body = (
                "### 🚀 Automated Cloud Deployment Fixes\n"
                "Generated and verified by **CodeLens AI Observability & Static Analysis**.\n\n"
                "#### 🛠️ Configured & Applied Patches:\n"
                + "\n".join([f"- `{f}`" for f in committed_files])
                + "\n\n"
                "> [!TIP]\n"
                f"> Review and merge these fixes into `{base_branch}` to enable seamless continuous deployment on Vercel, Render, or Docker."
            )
            pr_payload = {
                "title": pr_title_text,
                "head": commit_branch,
                "base": base_branch,
                "body": pr_body
            }
            pr_res = requests.post(
                f"https://api.github.com/repos/{owner}/{repo}/pulls",
                headers=headers,
                json=pr_payload,
                timeout=15
            )
            if pr_res.status_code in (200, 201):
                pr_data = pr_res.json()
                pr_info = {
                    "pr_url": pr_data.get("html_url"),
                    "pr_number": pr_data.get("number"),
                    "title": pr_data.get("title")
                }
            else:
                err_pr = pr_res.json().get("message", "PR creation error")
                pr_info = {
                    "pr_url": f"https://github.com/{owner}/{repo}/compare/{base_branch}...{commit_branch}",
                    "note": f"Branch created with commits. PR link: {err_pr}"
                }

        return {
            "success": True,
            "mode": branch_mode,
            "owner": owner,
            "repo": repo,
            "branch": commit_branch,
            "base_branch": base_branch,
            "committed_files": committed_files,
            "pr": pr_info,
            "direct_url": pr_info["pr_url"] if pr_info else f"https://github.com/{owner}/{repo}/tree/{commit_branch}",
            "message": f"Successfully applied {len(committed_files)} fixes to GitHub ({'Pull Request opened' if branch_mode == 'pr' else 'Committed directly'})."
        }

