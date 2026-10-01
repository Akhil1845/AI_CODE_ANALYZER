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
