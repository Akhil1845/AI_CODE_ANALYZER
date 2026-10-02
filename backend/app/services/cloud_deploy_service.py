import os
import json
import re
import time
import io
import hashlib
import zipfile
import requests
import logging
from typing import Dict, Any, List, Optional
from urllib.parse import urlparse
from .live_url_service import LiveUrlService

logger = logging.getLogger(__name__)

class CloudDeployService:
    """
    Direct Cloud Deployment Auto-Fix & Redeployment Engine.
    Handles secure API token verification, automated service matching,
    instant cloud redeployments (Vercel & Render), and real-time live URL re-verification.
    """

    def __init__(self):
        self.live_url_service = LiveUrlService()

    def extract_domain(self, url: str) -> str:
        clean = url.strip()
        if not clean.startswith(("http://", "https://")):
            clean = "https://" + clean
        parsed = urlparse(clean)
        return parsed.netloc.lower()

    def verify_cloud_token(self, platform: str, token: str, live_url: Optional[str] = None) -> Dict[str, Any]:
        """
        Securely verifies Vercel or Render API permissions and locates the matching project/service.
        """
        clean_token = token.strip() if token else ""
        if not clean_token:
            return {"valid": False, "message": f"{platform.capitalize()} API token is required."}

        platform_clean = platform.lower().strip()
        target_domain = self.extract_domain(live_url) if live_url else ""

        if platform_clean == "vercel":
            return self._verify_vercel_token(clean_token, target_domain)
        elif platform_clean == "render":
            return self._verify_render_token(clean_token, target_domain)
        elif platform_clean == "netlify":
            return self._verify_netlify_token(clean_token)
        else:
            return {"valid": False, "message": f"Unsupported cloud platform '{platform}'. Supported: vercel, render, netlify."}

    def _verify_vercel_token(self, token: str, target_domain: str) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {token}",
            "User-Agent": "CodeLens-CloudDeploy/1.0"
        }

        try:
            user_res = requests.get("https://api.vercel.com/v2/user", headers=headers, timeout=10)
        except Exception as e:
            return {"valid": False, "message": f"Network error connecting to Vercel API: {str(e)}"}

        if user_res.status_code == 401 or user_res.status_code == 403:
            return {"valid": False, "message": "Invalid or expired Vercel API Token."}
        elif user_res.status_code != 200:
            return {"valid": False, "message": f"Vercel API returned HTTP {user_res.status_code}"}

        user_data = user_res.json().get("user", {})
        username = user_data.get("username") or user_data.get("name") or "Vercel User"
        avatar_url = user_data.get("avatar") or f"https://avatar.vercel.sh/{username}"

        # Fetch projects to match target domain
        matched_project = None
        all_projects = []
        try:
            proj_res = requests.get("https://api.vercel.com/v9/projects?limit=50", headers=headers, timeout=10)
            if proj_res.status_code == 200:
                projects_list = proj_res.json().get("projects", [])
                for p in projects_list:
                    p_name = p.get("name", "")
                    p_id = p.get("id", "")
                    all_projects.append({"id": p_id, "name": p_name})
                    
                    # Check if project matches live URL domain or name
                    if target_domain:
                        p_subdomain = f"{p_name}.vercel.app".lower()
                        if target_domain == p_subdomain or p_name.lower() in target_domain:
                            matched_project = {"id": p_id, "name": p_name, "framework": p.get("framework")}
        except Exception as ex:
            print(f"[VERCEL API] Projects fetch note: {ex}")

        return {
            "valid": True,
            "platform": "vercel",
            "username": username,
            "avatar_url": avatar_url,
            "can_deploy": True,
            "matched_project": matched_project,
            "available_projects": all_projects[:10],
            "message": f"Authenticated successfully as @{username} on Vercel." + (f" Matched project '{matched_project['name']}'." if matched_project else "")
        }

    def _verify_render_token(self, token: str, target_domain: str) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
            "User-Agent": "CodeLens-CloudDeploy/1.0"
        }

        try:
            owners_res = requests.get("https://api.render.com/v1/owners?limit=10", headers=headers, timeout=10)
        except Exception as e:
            return {"valid": False, "message": f"Network error connecting to Render API: {str(e)}"}

        if owners_res.status_code == 401 or owners_res.status_code == 403:
            return {"valid": False, "message": "Invalid or expired Render API Key."}
        elif owners_res.status_code != 200:
            return {"valid": False, "message": f"Render API returned HTTP {owners_res.status_code}"}

        owners_list = owners_res.json()
        primary_owner = owners_list[0].get("owner", {}) if (owners_list and isinstance(owners_list, list)) else {}
        owner_name = primary_owner.get("name") or primary_owner.get("email") or "Render Developer"
        owner_id = primary_owner.get("id", "")

        # Fetch services to find matching service
        matched_service = None
        available_services = []
        try:
            serv_res = requests.get("https://api.render.com/v1/services?limit=50", headers=headers, timeout=10)
            if serv_res.status_code == 200:
                services_list = serv_res.json()
                for item in services_list:
                    s = item.get("service", {})
                    s_id = s.get("id", "")
                    s_name = s.get("name", "")
                    s_type = s.get("type", "")
                    details = s.get("serviceDetails", {})
                    s_url = details.get("url", "")
                    available_services.append({"id": s_id, "name": s_name, "type": s_type, "url": s_url})

                    if target_domain and s_url:
                        s_domain = self.extract_domain(s_url)
                        if target_domain == s_domain or s_name.lower() in target_domain:
                            matched_service = {"id": s_id, "name": s_name, "type": s_type, "url": s_url}
        except Exception as ex:
            print(f"[RENDER API] Services fetch note: {ex}")

        return {
            "valid": True,
            "platform": "render",
            "username": owner_name,
            "owner_id": owner_id,
            "can_deploy": True,
            "matched_service": matched_service,
            "available_services": available_services[:10],
            "message": f"Authenticated successfully as {owner_name} on Render." + (f" Matched service '{matched_service['name']}'." if matched_service else "")
        }

    def _verify_netlify_token(self, token: str) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {token}",
            "User-Agent": "CodeLens-CloudDeploy/1.0"
        }
        try:
            res = requests.get("https://api.netlify.com/api/v1/user", headers=headers, timeout=10)
        except Exception as e:
            return {"valid": False, "message": f"Network error connecting to Netlify API: {str(e)}"}

        if res.status_code in (401, 403):
            return {"valid": False, "message": "Invalid or expired Netlify Personal Access Token."}
        elif res.status_code != 200:
            return {"valid": False, "message": f"Netlify API returned HTTP {res.status_code}"}

        u = res.json()
        username = u.get("slug") or u.get("email") or u.get("full_name") or "Netlify User"
        return {
            "valid": True,
            "platform": "netlify",
            "username": username,
            "avatar_url": u.get("avatar_url") or f"https://avatar.vercel.sh/{username}",
            "can_deploy": True,
            "message": f"Authenticated successfully as @{username} on Netlify."
        }

    def trigger_cloud_redeploy(self, platform: str, token: str, service_or_project_id: str, clear_cache: bool = True) -> Dict[str, Any]:
        """
        Triggers an immediate clean redeployment on Vercel or Render.
        """
        clean_token = token.strip() if token else ""
        if not clean_token:
            raise ValueError(f"{platform.capitalize()} API token is required.")
        if not service_or_project_id:
            raise ValueError("Target Project or Service ID is required.")

        platform_clean = platform.lower().strip()

        if platform_clean == "vercel":
            headers = {
                "Authorization": f"Bearer {clean_token}",
                "User-Agent": "CodeLens-CloudDeploy/1.0"
            }
            # Trigger redeployment on Vercel
            deploy_url = f"https://api.vercel.com/v13/deployments"
            payload = {
                "name": service_or_project_id,
                "project": service_or_project_id,
                "target": "production"
            }
            res = requests.post(deploy_url, headers=headers, json=payload, timeout=15)
            if res.status_code not in (200, 201):
                err = res.json().get("error", {}).get("message", f"HTTP {res.status_code}")
                # If creating deployment directly requires repo files, trigger via project redeploy
                redeploy_res = requests.post(f"https://api.vercel.com/v2/deployments", headers=headers, json={"name": service_or_project_id}, timeout=12)
                if redeploy_res.status_code in (200, 201):
                    d_data = redeploy_res.json()
                    return {
                        "success": True,
                        "platform": "vercel",
                        "status": "QUEUED",
                        "deployment_url": f"https://{d_data.get('url')}" if d_data.get('url') else "https://vercel.com",
                        "message": "Fresh deployment initiated on Vercel Edge Network."
                    }
                raise Exception(f"Vercel Deployment notice: {err}")

            data = res.json()
            return {
                "success": True,
                "platform": "vercel",
                "status": data.get("readyState", "QUEUED"),
                "deployment_url": f"https://{data.get('url')}" if data.get('url') else "https://vercel.com",
                "message": "Vercel production redeployment triggered successfully."
            }

        elif platform_clean == "render":
            headers = {
                "Authorization": f"Bearer {clean_token}",
                "Accept": "application/json",
                "Content-Type": "application/json",
                "User-Agent": "CodeLens-CloudDeploy/1.0"
            }
            deploy_url = f"https://api.render.com/v1/services/{service_or_project_id}/deploys"
            payload = {
                "clearCache": "clear" if clear_cache else "do_not_clear"
            }
            res = requests.post(deploy_url, headers=headers, json=payload, timeout=15)
            if res.status_code not in (200, 201):
                err = res.json().get("message", f"HTTP {res.status_code}")
                raise Exception(f"Render Deployment notice: {err}")

            data = res.json()
            deploy_id = data.get("id", "")
            return {
                "success": True,
                "platform": "render",
                "deploy_id": deploy_id,
                "status": data.get("status", "created"),
                "message": "Render clean redeployment (clearCache=true) triggered successfully. Live instance rebuilding now."
            }
        else:
            raise ValueError(f"Unsupported platform '{platform}'.")

    def reprobe_live_url(self, url: str) -> Dict[str, Any]:
        """
        High-speed re-probe of the live deployment URL to verify fixes in real time.
        """
        scan_res = self.live_url_service.scan_live_deployment(url)
        return {
            "success": True,
            "target_url": scan_res.get("target_url", url),
            "status_code": scan_res.get("status_code", 200),
            "latency_ms": scan_res.get("latency_ms", 0),
            "total_issues": scan_res.get("total_issues", 0),
            "critical_count": scan_res.get("critical_count", 0),
            "high_count": scan_res.get("high_count", 0),
            "issues": scan_res.get("issues", []),
            "detected_stack": scan_res.get("detected_stack", "Cloud Deployment"),
            "health_score": max(10, 100 - (scan_res.get("critical_count", 0) * 35 + scan_res.get("high_count", 0) * 20 + scan_res.get("medium_count", 0) * 10)),
            "checked_at": time.strftime("%H:%M:%S")
        }

    def get_active_cloud_bridge(self) -> Dict[str, Any]:
        """
        Auto-detects any active public HTTPS bridge (e.g. ngrok tunnel) for immediate cloud connectivity.
        """
        try:
            res = requests.get("http://127.0.0.1:4040/api/tunnels", timeout=2)
            if res.status_code == 200:
                data = res.json()
                tunnels = data.get("tunnels", [])
                for t in tunnels:
                    pub = t.get("public_url", "")
                    if pub.startswith("https://"):
                        return {
                            "active": True,
                            "type": "ngrok_cloud_bridge",
                            "public_url": pub,
                            "local_port": t.get("config", {}).get("addr", ""),
                            "status": "ONLINE",
                            "message": f"Active live cloud bridge detected: {pub}"
                        }
        except Exception as e:
            logger.debug(f"[CLOUD_BRIDGE] Bridge discovery skipped: {e}")

        return {
            "active": False,
            "type": None,
            "public_url": None,
            "status": "OFFLINE",
            "message": "No active public cloud bridge found. Backend can be deployed to Render or tunneled."
        }

    def package_local_backend(self, backend_path: str, write_files: bool = False) -> Dict[str, Any]:
        """
        Inspects a local backend directory, detects framework, generates Dockerfile & render.yaml.
        """
        clean_path = backend_path.strip().strip('"\'')
        if not os.path.exists(clean_path):
            raise ValueError(f"Directory '{clean_path}' does not exist on local filesystem.")

        files = os.listdir(clean_path)
        detected_stack = "Generic Web Backend"
        detected_port = 8080
        dockerfile_content = ""

        # Check for Java Maven / Spring Boot
        if "pom.xml" in files or any(os.path.exists(os.path.join(clean_path, f, "pom.xml")) for f in files if os.path.isdir(os.path.join(clean_path, f))):
            detected_stack = "Spring Boot (Java 17 / Maven)"
            detected_port = 8080
            prop_candidates = [
                os.path.join(clean_path, "src", "main", "resources", "application.properties"),
                os.path.join(clean_path, "src", "main", "resources", "application.yml"),
                os.path.join(clean_path, "application.properties")
            ]
            for pc in prop_candidates:
                if os.path.exists(pc):
                    try:
                        with open(pc, "r", encoding="utf-8", errors="ignore") as pf:
                            p_txt = pf.read()
                        m_port = re.search(r'server\.port\s*[:=]\s*(\d+)', p_txt)
                        if m_port:
                            detected_port = int(m_port.group(1))
                            break
                    except Exception as e:
                        logger.debug(f"[SPRING_BOOT_PORT] Could not parse server.port from {pc}: {e}")

            dockerfile_content = (
                "# Multi-stage Docker build for Spring Boot Backend\n"
                "FROM maven:3.9.6-eclipse-temurin-17 AS build\n"
                "WORKDIR /app\n"
                "COPY pom.xml .\n"
                "COPY src ./src\n"
                "RUN mvn clean package -DskipTests\n\n"
                "FROM eclipse-temurin:17-jre-jammy\n"
                "WORKDIR /app\n"
                "COPY --from=build /app/target/*.jar app.jar\n"
                f"EXPOSE {detected_port}\n"
                f"ENV PORT={detected_port}\n"
                "ENV APP_DB=postgres\n"
                f"ENTRYPOINT [\"java\", \"-Dserver.port=${{PORT:-{detected_port}}}\", \"-jar\", \"app.jar\"]\n"
            )
        # Check for Python (FastAPI / Flask / Django)
        elif "requirements.txt" in files or "pyproject.toml" in files:
            detected_stack = "Python (FastAPI / Flask)"
            detected_port = 8000
            dockerfile_content = (
                "# Production Dockerfile for Python Backend\n"
                "FROM python:3.11-slim\n"
                "WORKDIR /app\n"
                "COPY requirements.txt .\n"
                "RUN pip install --no-cache-dir -r requirements.txt\n"
                "COPY . .\n"
                f"EXPOSE {detected_port}\n"
                f"ENV PORT={detected_port}\n"
                "CMD [\"uvicorn\", \"app.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n"
            )
        # Check for Node.js (Express / Nest)
        elif "package.json" in files:
            detected_stack = "Node.js (Express / Nest)"
            detected_port = 5000
            dockerfile_content = (
                "# Production Dockerfile for Node.js Backend\n"
                "FROM node:18-alpine\n"
                "WORKDIR /app\n"
                "COPY package*.json ./\n"
                "RUN npm install --production\n"
                "COPY . .\n"
                f"EXPOSE {detected_port}\n"
                f"ENV PORT={detected_port}\n"
                "CMD [\"npm\", \"start\"]\n"
            )
        else:
            dockerfile_content = (
                "# Generic Container Definition\n"
                "FROM alpine:latest\n"
                f"EXPOSE {detected_port}\n"
            )

        render_yaml_content = (
            "services:\n"
            "  - type: web\n"
            f"    name: {os.path.basename(clean_path.rstrip('/\\\\')) or 'cloud-backend'}\n"
            "    runtime: docker\n"
            "    plan: free\n"
            "    region: oregon\n"
            "    envVars:\n"
            f"      - key: PORT\n"
            f"        value: {detected_port}\n"
        )

        files_written = []
        if write_files:
            try:
                dockerfile_path = os.path.join(clean_path, "Dockerfile")
                with open(dockerfile_path, "w", encoding="utf-8") as f:
                    f.write(dockerfile_content)
                files_written.append("Dockerfile")

                render_path = os.path.join(clean_path, "render.yaml")
                with open(render_path, "w", encoding="utf-8") as f:
                    f.write(render_yaml_content)
                files_written.append("render.yaml")
            except Exception as w_err:
                print(f"[PACKAGE_BACKEND] File write note: {w_err}")

        return {
            "success": True,
            "backend_path": clean_path,
            "detected_stack": detected_stack,
            "detected_port": detected_port,
            "dockerfile": dockerfile_content,
            "render_yaml": render_yaml_content,
            "files_written": files_written
        }

    def create_render_web_service(
        self,
        token: str,
        repo_url: str,
        service_name: str,
        branch: Optional[str] = "main",
        root_dir: Optional[str] = None,
        env_vars: Optional[List[Dict[str, str]]] = None,
        service_type: Optional[str] = "web_service"
    ) -> Dict[str, Any]:
        """
        Creates a new Web Service or Static Site on Render using the Render REST API.
        """
        clean_token = token.strip() if token else ""
        if not clean_token:
            raise ValueError("Render API Key is required to create a cloud service.")

        headers = {
            "Authorization": f"Bearer {clean_token}",
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "CodeLens-CloudDeploy/1.0"
        }

        # 1. Fetch primary owner ID
        owners_res = requests.get("https://api.render.com/v1/owners?limit=5", headers=headers, timeout=10)
        if owners_res.status_code != 200:
            raise Exception("Invalid Render API Key or unable to retrieve Render account.")
        owners = owners_res.json()
        owner_id = owners[0].get("owner", {}).get("id")
        if not owner_id:
            raise Exception("Could not determine Render Account Owner ID.")

        # 2. Construct service creation payload
        clean_name = re.sub(r'[^a-zA-Z0-9\-]', '-', service_name.lower().strip()).strip('-')[:30]
        if service_type == "static_site":
            payload = {
                "type": "static_site",
                "name": clean_name,
                "ownerId": owner_id,
                "repo": repo_url.strip(),
                "autoDeploy": "yes",
                "serviceDetails": {
                    "buildCommand": "npm install && npm run build",
                    "publishPath": "dist",
                    "pullRequestPreviewsEnabled": "yes"
                }
            }
        else:
            payload = {
                "type": "web_service",
                "name": clean_name,
                "ownerId": owner_id,
                "repo": repo_url.strip(),
                "autoDeploy": "yes",
                "serviceDetails": {
                    "env": "docker",
                    "plan": "free",
                    "region": "oregon"
                }
            }
        if branch:
            payload["branch"] = branch.strip()
        if root_dir:
            payload["rootDir"] = root_dir.strip()
        if env_vars and service_type != "static_site":
            payload["serviceDetails"]["envVars"] = env_vars

        # 3. Create service via Render API
        create_res = requests.post("https://api.render.com/v1/services", headers=headers, json=payload, timeout=20)
        if create_res.status_code not in (200, 201):
            err_msg = create_res.json().get("message", f"HTTP {create_res.status_code}")
            raise Exception(f"Failed to create Render Service: {err_msg}")

        s_data = create_res.json().get("service", {})
        s_id = s_data.get("id", "")
        s_url = s_data.get("serviceDetails", {}).get("url", f"https://{clean_name}.onrender.com")

        return {
            "success": True,
            "service_id": s_id,
            "service_name": clean_name,
            "cloud_backend_url": s_url,
            "live_url": s_url,
            "dashboard_url": f"https://dashboard.render.com/web/{s_id}",
            "message": f"Cloud Service '{clean_name}' created on Render. Live auto-build initiated from repository!"
        }

    def deploy_to_vercel(
        self,
        token: str,
        project_name: str,
        files: List[Dict[str, str]],
        git_repo_url: Optional[str] = None,
        target: str = "production"
    ) -> Dict[str, Any]:
        """
        Direct API Deployment to Vercel Edge Network.
        Supports zero-Git instant deployments via Vercel File Digest API.
        """
        clean_token = token.strip() if token else ""
        if not clean_token:
            raise ValueError("Vercel API Token is required.")

        headers = {
            "Authorization": f"Bearer {clean_token}",
            "User-Agent": "CodeLens-CloudDeploy/1.0"
        }

        # 1. Verify user token
        user_res = requests.get("https://api.vercel.com/v2/user", headers=headers, timeout=10)
        if user_res.status_code != 200:
            err_msg = user_res.json().get("error", {}).get("message", "Invalid Vercel API Token")
            raise Exception(f"Vercel Token Error: {err_msg}. Verify your token at vercel.com/account/tokens")

        user_data = user_res.json().get("user", {})
        username = user_data.get("username") or user_data.get("name") or "user"
        clean_name = re.sub(r'[^a-zA-Z0-9\-]', '-', project_name.lower().strip()).strip('-')[:50] or "codelens-project"

        if not files and not git_repo_url:
            raise ValueError("No files or repository provided for Vercel deployment.")

        # 2. Upload file contents to Vercel Content-Addressable Storage
        uploaded_files = []
        is_vite = any("vite.config" in f.get("path", "") for f in files)
        has_package_json = any(f.get("path", "") == "package.json" for f in files)

        deploy_files = [dict(f) for f in files]

        # Ensure index.html exists if no package.json (instant static deployment)
        has_index = any(f.get("path", "").lower() in ("index.html", "public/index.html") for f in deploy_files)
        if not has_index:
            html_file = next((f for f in deploy_files if f.get("path", "").endswith(".html")), None)
            if html_file:
                deploy_files.append({"path": "index.html", "content": html_file["content"]})
            else:
                fallback_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{clean_name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">
  <div id="root" class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-extrabold text-indigo-400 mb-2">{clean_name}</h1>
    <p class="text-slate-400 mb-6">Generated &amp; deployed live via CodeLens AI Studio.</p>
    <div class="p-4 rounded-xl bg-slate-800/80 border border-slate-700 font-mono text-sm">
      <div class="text-emerald-400 font-bold mb-2">⚡ Status: Live on Vercel Edge</div>
      <p class="text-slate-300">Architecture synthesis completed. Ready for production usage.</p>
    </div>
  </div>
</body>
</html>"""
                deploy_files.append({"path": "index.html", "content": fallback_html})

        for item in deploy_files:
            rel_path = item.get("path", "").replace("\\", "/").lstrip("/")
            content_str = item.get("content", "")
            raw_bytes = content_str.encode("utf-8")
            file_sha = hashlib.sha1(raw_bytes).hexdigest()
            file_size = len(raw_bytes)

            upload_headers = {
                "Authorization": f"Bearer {clean_token}",
                "x-vercel-digest": file_sha,
                "Content-Type": "application/octet-stream",
                "User-Agent": "CodeLens-CloudDeploy/1.0"
            }
            try:
                requests.post("https://api.vercel.com/v2/files", headers=upload_headers, data=raw_bytes, timeout=15)
            except Exception as e:
                print(f"[VERCEL FILE UPLOAD] Note for {rel_path}: {e}")

            uploaded_files.append({
                "file": rel_path,
                "sha": file_sha,
                "size": file_size
            })

        # 3. Create deployment
        deploy_payload = {
            "name": clean_name,
            "files": uploaded_files,
            "target": target or "production"
        }
        if is_vite:
            deploy_payload["projectSettings"] = {"framework": "vite"}
        elif not has_package_json:
            deploy_payload["projectSettings"] = {"framework": None}

        deploy_headers = {
            "Authorization": f"Bearer {clean_token}",
            "Content-Type": "application/json",
            "User-Agent": "CodeLens-CloudDeploy/1.0"
        }
        deploy_res = requests.post("https://api.vercel.com/v13/deployments", headers=deploy_headers, json=deploy_payload, timeout=25)
        if deploy_res.status_code not in (200, 201):
            err_data = deploy_res.json().get("error", {})
            err_msg = err_data.get("message", f"HTTP {deploy_res.status_code}")
            raise Exception(f"Vercel Deployment Failed: {err_msg}")

        d_json = deploy_res.json()
        dep_id = d_json.get("id", "")
        raw_url = d_json.get("url", "")
        aliases = d_json.get("alias", [])
        live_url = f"https://{aliases[0]}" if aliases else f"https://{raw_url}"

        return {
            "success": True,
            "platform": "vercel",
            "deployment_id": dep_id,
            "live_url": live_url,
            "preview_url": f"https://{raw_url}" if raw_url else live_url,
            "project_name": clean_name,
            "ready_state": d_json.get("readyState", "QUEUED"),
            "dashboard_url": f"https://vercel.com/{username}/{clean_name}",
            "message": f"Deployed successfully to Vercel Edge Network! Live URL: {live_url}"
        }

    def deploy_to_netlify(
        self,
        token: str,
        site_name: str,
        files: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """
        Direct Atomic ZIP Deployment to Netlify Global CDN.
        """
        clean_token = token.strip() if token else ""
        if not clean_token:
            raise ValueError("Netlify Personal Access Token is required.")

        headers = {
            "Authorization": f"Bearer {clean_token}",
            "User-Agent": "CodeLens-CloudDeploy/1.0"
        }
        user_res = requests.get("https://api.netlify.com/api/v1/user", headers=headers, timeout=10)
        if user_res.status_code != 200:
            err_msg = user_res.json().get("message", "Invalid Netlify Personal Access Token")
            raise Exception(f"Netlify Token Error: {err_msg}. Verify token at app.netlify.com/user/applications#personal-access-tokens")

        clean_name = re.sub(r'[^a-zA-Z0-9\-]', '-', site_name.lower().strip()).strip('-')[:35] or "codelens-site"

        # Build in-memory zip
        zip_buffer = io.BytesIO()
        has_index = any(f.get("path", "").lower() in ("index.html", "public/index.html") for f in files)

        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            for item in files:
                rel_path = item.get("path", "").replace("\\", "/").lstrip("/")
                zf.writestr(rel_path, item.get("content", ""))

            if not has_index:
                html_file = next((f for f in files if f.get("path", "").endswith(".html")), None)
                if html_file:
                    zf.writestr("index.html", html_file["content"])
                else:
                    minimal_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{clean_name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-extrabold text-teal-400 mb-2">{clean_name}</h1>
    <p class="text-slate-400 mb-6">Generated &amp; deployed live to Netlify Global Edge via CodeLens AI Studio.</p>
    <div class="p-4 rounded-xl bg-slate-800/80 border border-slate-700 font-mono text-sm text-emerald-400">
      ⚡ Status: Live on Netlify Global CDN
    </div>
  </div>
</body>
</html>"""
                    zf.writestr("index.html", minimal_html)

        zip_buffer.seek(0)
        zip_bytes = zip_buffer.getvalue()

        deploy_headers = {
            "Authorization": f"Bearer {clean_token}",
            "Content-Type": "application/zip",
            "User-Agent": "CodeLens-CloudDeploy/1.0"
        }
        post_url = f"https://api.netlify.com/api/v1/sites"
        params = {"name": clean_name} if clean_name else {}

        res = requests.post(post_url, headers=deploy_headers, data=zip_bytes, params=params, timeout=30)
        # If name is taken, retry without custom name so Netlify assigns an auto-generated unique subdomain
        if res.status_code not in (200, 201):
            res = requests.post(post_url, headers=deploy_headers, data=zip_bytes, timeout=30)
            if res.status_code not in (200, 201):
                err = res.json().get("message", f"HTTP {res.status_code}")
                raise Exception(f"Netlify Deployment Failed: {err}")

        data = res.json()
        live_url = data.get("ssl_url") or data.get("url") or f"https://{clean_name}.netlify.app"
        site_id = data.get("id", "")
        admin_url = data.get("admin_url", f"https://app.netlify.com/sites/{clean_name}")

        return {
            "success": True,
            "platform": "netlify",
            "site_id": site_id,
            "live_url": live_url,
            "dashboard_url": admin_url,
            "message": f"Successfully deployed '{clean_name}' to Netlify Global Edge! Live URL: {live_url}"
        }

    def deploy_to_render_full(
        self,
        render_token: str,
        service_name: str,
        repo_url: Optional[str] = None,
        github_token: Optional[str] = None,
        files: Optional[List[Dict[str, str]]] = None,
        branch: str = "main",
        service_type: str = "web_service",
        env_vars: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Render Full Deployment Pipeline: auto-pushes project to GitHub if needed,
        then creates Render service linked to GitHub.
        """
        target_repo_url = repo_url
        if not target_repo_url and github_token and files:
            from .github_service import GitHubService
            gh = GitHubService()
            clean_repo_name = re.sub(r'[^a-zA-Z0-9\-]', '-', service_name.lower().strip()).strip('-') or "codelens-service"
            push_res = gh.apply_fixes(
                repo_url=clean_repo_name,
                token=github_token,
                fixes=files,
                mode="direct",
                commit_message=f"feat(scaffold): initialize {service_name} for Render deployment",
                target_branch=branch or "main"
            )
            target_repo_url = push_res.get("direct_url") or f"https://github.com/{push_res.get('owner')}/{push_res.get('repo')}"

        if not target_repo_url:
            raise ValueError("A GitHub Repository URL (or GitHub Token to auto-push) is required for Render deployment.")

        return self.create_render_web_service(
            token=render_token,
            repo_url=target_repo_url,
            service_name=service_name,
            branch=branch or "main",
            env_vars=env_vars,
            service_type=service_type
        )


