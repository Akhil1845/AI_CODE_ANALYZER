import requests
import re
from typing import Dict, Any, List
from .analyzer import StaticAnalyzer
from .. import config

class GitHubService:
    def __init__(self):
        self.headers = {"User-Agent": "CodeLens-AI"}
        if config.GITHUB_TOKEN:
            self.headers["Authorization"] = f"token {config.GITHUB_TOKEN}"
        self.analyzer = StaticAnalyzer()

    def parse_repo_url(self, url: str) -> tuple[str, str]:
        """Extracts owner and repo name from GitHub URL or owner/repo format."""
        clean = url.strip().rstrip('/')
        match = re.search(r'github\.com/([^/]+)/([^/]+)', clean)
        if match:
            return match.group(1), match.group(2).replace('.git', '')
        parts = clean.split('/')
        if len(parts) == 2:
            return parts[0], parts[1]
        raise ValueError(f"Invalid GitHub repository URL: {url}. Expected format: https://github.com/owner/repo")

    def fetch_and_scan(self, repo_url: str) -> Dict[str, Any]:
        owner, repo = self.parse_repo_url(repo_url)

        # 1. Fetch Repository Info
        info_url = f"https://api.github.com/repos/{owner}/{repo}"
        res = requests.get(info_url, headers=self.headers, timeout=12)
        if res.status_code != 200:
            raise Exception(f"GitHub API Error: {res.status_code} - {res.json().get('message', 'Repository not found or private')}")

        repo_info = res.json()
        default_branch = repo_info.get("default_branch", "main")
        primary_lang = repo_info.get("language", "Unknown")

        # 2. Fetch Git Tree
        tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1"
        res_tree = requests.get(tree_url, headers=self.headers, timeout=15)
        if res_tree.status_code != 200:
            raise Exception(f"Failed to fetch repository tree: {res_tree.json().get('message')}")

        tree_data = res_tree.json().get("tree", [])
        blobs = [item for item in tree_data if item.get("type") == "blob"]

        total_files = len(blobs)
        scannable_extensions = ('.py', '.java', '.js', '.jsx', '.ts', '.tsx', '.cpp', '.c', '.h', '.json', '.xml', '.yml', '.yaml')
        
        target_files = [b for b in blobs if b['path'].lower().endswith(scannable_extensions)][:30] # Scan top 30 source files

        all_issues = []
        files_scanned = 0

        for file_node in target_files:
            file_path = file_node['path']
            # Fetch raw content
            raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}/{file_path}"
            raw_res = requests.get(raw_url, headers=self.headers, timeout=10)
            if raw_res.status_code == 200:
                content = raw_res.text
                file_issues = self.analyzer.analyze_file(file_path, content)
                all_issues.extend(file_issues)
                files_scanned += 1

        # Calculate severity metrics
        critical = sum(1 for i in all_issues if i['severity'] == 'CRITICAL')
        high = sum(1 for i in all_issues if i['severity'] == 'HIGH')
        medium = sum(1 for i in all_issues if i['severity'] == 'MEDIUM')
        low = sum(1 for i in all_issues if i['severity'] == 'LOW')

        return {
            "name": f"{owner}/{repo}",
            "repo_url": repo_url,
            "detected_stack": primary_lang or "Multi-Language",
            "total_files": total_files,
            "files_scanned": files_scanned,
            "total_issues": len(all_issues),
            "critical_count": critical,
            "high_count": high,
            "medium_count": medium,
            "low_count": low,
            "issues": all_issues
        }
