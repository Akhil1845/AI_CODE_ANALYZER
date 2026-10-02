import os
import json
import re
import time
import requests
from typing import Dict, Any, List, Optional
from urllib.parse import urlparse
from .live_url_service import LiveUrlService

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
        else:
            return {"valid": False, "message": f"Unsupported cloud platform '{platform}'. Supported: vercel, render."}

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
        except Exception:
            pass

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
            detected_port = 8089
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
                "ENTRYPOINT [\"java\", \"-Dserver.port=${PORT:-8089}\", \"-jar\", \"app.jar\"]\n"
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
        env_vars: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Creates a new Web Service on Render using the Render REST API.
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
        if env_vars:
            payload["serviceDetails"]["envVars"] = env_vars

        # 3. Create service via Render API
        create_res = requests.post("https://api.render.com/v1/services", headers=headers, json=payload, timeout=20)
        if create_res.status_code not in (200, 201):
            err_msg = create_res.json().get("message", f"HTTP {create_res.status_code}")
            raise Exception(f"Failed to create Render Web Service: {err_msg}")

        s_data = create_res.json().get("service", {})
        s_id = s_data.get("id", "")
        s_url = s_data.get("serviceDetails", {}).get("url", f"https://{clean_name}.onrender.com")

        return {
            "success": True,
            "service_id": s_id,
            "service_name": clean_name,
            "cloud_backend_url": s_url,
            "dashboard_url": f"https://dashboard.render.com/web/{s_id}",
            "message": f"Cloud Web Service '{clean_name}' created on Render. Auto-build initiated from repository!"
        }

