import re
import time
import requests
import json
import logging
from typing import Dict, Any, List, Optional
from .project_ai_service import ProjectAIService
from .. import config

logger = logging.getLogger(__name__)

class LiveUrlService:
    """
    Advanced Cloud Deployment & Infrastructure Auditor for Render, Vercel, Netlify, AWS, and Custom Domains.
    Performs multi-layer security probes, HTTP status inspection, SPA client-side routing validation,
    security headers audit, CORS policy verification, production source map exposure checks,
    bundled JavaScript credential hunting, and generates production-ready code & config solutions.
    """

    def __init__(self):
        self.ai_service = ProjectAIService()
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 CodeLens-SecurityAudit/2.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
        }

    def sanitize_url(self, raw_url: str) -> str:
        clean = raw_url.strip()
        if not clean.startswith(("http://", "https://")):
            clean = "https://" + clean
        return clean.rstrip('/')

    def detect_platform(self, url: str, server_header: str, headers: Dict[str, str]) -> str:
        u = url.lower()
        s = server_header.lower()
        if "vercel" in u or "vercel" in s or "x-vercel-id" in headers:
            return "Vercel Edge Network"
        if "onrender.com" in u or "render" in s or "x-render-origin-server" in headers:
            return "Render Cloud Service"
        if "netlify" in u or "netlify" in s or "x-nf-request-id" in headers:
            return "Netlify Cloud Platform"
        if "cloudflare" in s or "cf-ray" in headers:
            return "Cloudflare Edge"
        if "aws" in s or "cloudfront" in s or "x-amz-cf-id" in headers:
            return "AWS CloudFront / ECS"
        return f"{server_header or 'Cloud Edge'} Deployment"

    def scan_live_deployment(self, target_url: str) -> Dict[str, Any]:
        url = self.sanitize_url(target_url)
        issues: List[Dict[str, Any]] = []

        start_time = time.time()
        try:
            res = requests.get(url, headers=self.headers, timeout=20, allow_redirects=True)
            latency_ms = round((time.time() - start_time) * 1000, 1)
        except requests.exceptions.SSLError as ssl_err:
            return self._build_offline_error(url, f"SSL/TLS Certificate Handshake Failed: {str(ssl_err)}")
        except requests.exceptions.ConnectionError:
            return self._build_offline_error(url, f"Unable to reach deployment host at '{url}'. Please verify domain DNS resolution, platform build status, and active deployment on Render/Vercel.")
        except requests.exceptions.Timeout:
            return self._build_offline_error(url, f"Probe connection timed out (>20s). If deployed on Render free tier, the instance may be in sleep/cold-start state, or the application crashed on startup.")
        except Exception as e:
            return self._build_offline_error(url, f"Probe connection error: {str(e)}")

        server_header = res.headers.get("Server", "Cloud Edge")
        content_type = res.headers.get("Content-Type", "")
        status_code = res.status_code
        platform_name = self.detect_platform(url, server_header, {k.lower(): v for k, v in res.headers.items()})
        is_vercel = "Vercel" in platform_name
        is_render = "Render" in platform_name

        # -------------------------------------------------------------
        # 1. HTTP STATUS & ENTRYPOINT ROUTING INSPECTION
        # -------------------------------------------------------------
        if status_code >= 500:
            issues.append({
                "type": "bug",
                "severity": "CRITICAL",
                "file_path": "backend/app/main.py",
                "line_number": 1,
                "title": f"Live Deployment Server Error (HTTP {status_code})",
                "description": f"The deployed application returned HTTP {status_code} ({res.reason}). The backend crashed during startup, port binding failed, or unhandled database connection exception occurred.",
                "code_snippet": f"HTTP/1.1 {status_code} {res.reason}\nHost: {url}\nService failed to handle incoming requests.",
                "recommendation": """# backend/app/main.py - Ensure graceful port binding & database startup
import os
import uvicorn
from fastapi import FastAPI

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    try:
        # Initialize database with retry loop
        pass
    except Exception as e:
        print(f"[CRITICAL] Startup error: {e}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)"""
            })
        elif status_code == 404:
            issues.append({
                "type": "bug",
                "severity": "HIGH",
                "file_path": "vercel.json" if is_vercel else "render.yaml",
                "line_number": 1,
                "title": "404 Not Found on Root Entrypoint (Missing Build Output Route)",
                "description": "The deployment target returns 404 Not Found on the root URL. The cloud host output directory does not match the build directory (e.g. dist / build) or index.html is missing.",
                "code_snippet": f"GET / HTTP/1.1 -> 404 Not Found at {url}\nCloud provider cannot locate entrypoint index.html.",
                "recommendation": """// vercel.json (Ensure publish directory and root rewrites are configured)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}""" if is_vercel else """# Render Dashboard Settings:
# Build Command: npm run build
# Publish Directory: dist
# Rewrites: Source: /* -> Destination: /index.html -> Action: Rewrite"""
            })

        # -------------------------------------------------------------
        # 1.5 SPA CLIENT-SIDE DEEP-LINK ROUTING TEST
        # -------------------------------------------------------------
        try:
            spa_test_url = f"{url}/codelens-spa-test-deep-link"
            spa_res = requests.get(spa_test_url, headers=self.headers, timeout=6)
            if spa_res.status_code == 404 and status_code == 200:
                issues.append({
                    "type": "bug",
                    "severity": "HIGH",
                    "file_path": "vercel.json" if is_vercel else "render.yaml",
                    "line_number": 1,
                    "title": "SPA Client-Side Deep Link 404 Failure on Refresh",
                    "description": "Navigating directly to subpaths (e.g. /dashboard, /profile) or refreshing the browser produces HTTP 404 Not Found because the cloud host has no rewrite rule pointing non-file requests back to index.html.",
                    "code_snippet": f"GET /codelens-spa-test-deep-link HTTP/1.1 -> 404 Not Found\nDirect subpath navigation fails on browser reload.",
                    "recommendation": """// vercel.json (Single-Page Application SPA rewrite for React/Vue)
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}""" if is_vercel else """# Render Static Site Configuration:
# In Render Dashboard -> Redirects/Rewrites:
# Source: /*
# Destination: /index.html
# Action: Rewrite"""
                })
        except Exception as e:
            logger.debug(f"SPA deep link probe skipped: {e}")

        # -------------------------------------------------------------
        # 2. STRICT SECURITY HEADERS AUDIT & PLATFORM-SPECIFIC PATCHES
        # -------------------------------------------------------------
        missing_headers = []
        if "Strict-Transport-Security" not in res.headers:
            missing_headers.append("Strict-Transport-Security")
        if "Content-Security-Policy" not in res.headers:
            missing_headers.append("Content-Security-Policy")
        if "X-Frame-Options" not in res.headers:
            missing_headers.append("X-Frame-Options")
        if "X-Content-Type-Options" not in res.headers:
            missing_headers.append("X-Content-Type-Options")
        if "Referrer-Policy" not in res.headers:
            missing_headers.append("Referrer-Policy")

        if missing_headers:
            header_fix_json = {
                "source": "/(.*)",
                "headers": [
                    {"key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload"},
                    {"key": "X-Frame-Options", "value": "DENY"},
                    {"key": "X-Content-Type-Options", "value": "nosniff"},
                    {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"},
                    {"key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()"},
                    {"key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:;"}
                ]
            }

            if "Strict-Transport-Security" in missing_headers:
                issues.append({
                    "type": "security",
                    "severity": "CRITICAL",
                    "file_path": "vercel.json" if is_vercel else "backend/app/main.py",
                    "line_number": 1,
                    "title": "Missing HSTS Header (HTTP Strict Transport Security)",
                    "description": "The deployment does not enforce Strict-Transport-Security. Attackers can execute SSL-stripping man-in-the-middle attacks to downgrade HTTPS traffic to unencrypted HTTP.",
                    "code_snippet": f"HTTP Response Headers from {server_header}:\nStrict-Transport-Security: (Header Missing)",
                    "recommendation": json.dumps({"headers": [header_fix_json]}, indent=2) if is_vercel else """# FastAPI Security Middleware
from starlette.middleware.base import BaseHTTPMiddleware

class HstsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers['Strict-Transport-Security'] = 'max-age=63072000; includeSubDomains; preload'
        return response

app.add_middleware(HstsMiddleware)"""
                })

            if "Content-Security-Policy" in missing_headers:
                issues.append({
                    "type": "security",
                    "severity": "HIGH",
                    "file_path": "vercel.json" if is_vercel else "index.html",
                    "line_number": 1,
                    "title": "Missing Content-Security-Policy (CSP) Defense",
                    "description": "Lack of Content-Security-Policy allows unrestricted execution of malicious inline scripts, cross-site scripting (XSS) payload injection, and unauthorized data exfiltration.",
                    "code_snippet": f"HTTP Response Headers:\nContent-Security-Policy: (Header Missing)",
                    "recommendation": """<!-- In index.html <head> (or via vercel.json / server headers) -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:;">"""
                })

            if "X-Frame-Options" in missing_headers:
                issues.append({
                    "type": "security",
                    "severity": "MEDIUM",
                    "file_path": "vercel.json" if is_vercel else "backend/app/main.py",
                    "line_number": 1,
                    "title": "Missing X-Frame-Options Header (Clickjacking Vulnerability)",
                    "description": "The web page can be embedded within an invisible iframe on malicious third-party websites, allowing attackers to hijack user clicks and execute unauthorized actions.",
                    "code_snippet": f"X-Frame-Options: (Header Missing)\nPage permits arbitrary third-party iframe embedding.",
                    "recommendation": """// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}""" if is_vercel else """# In FastAPI or Express:
# response.headers['X-Frame-Options'] = 'DENY'"""
                })

            if "X-Content-Type-Options" in missing_headers:
                issues.append({
                    "type": "security",
                    "severity": "MEDIUM",
                    "file_path": "vercel.json" if is_vercel else "backend/app/main.py",
                    "line_number": 1,
                    "title": "Missing X-Content-Type-Options Header (MIME-Sniffing Risk)",
                    "description": "Without 'X-Content-Type-Options: nosniff', browsers may attempt to MIME-sniff responses, allowing malicious user-uploaded text files to execute as executable JavaScript.",
                    "code_snippet": f"X-Content-Type-Options: (Header Missing)\nBrowser MIME-sniffing protection disabled.",
                    "recommendation": """// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}"""
                })

        # -------------------------------------------------------------
        # 3. CORS PREFLIGHT & CREDENTIAL ISOLATION PROBE
        # -------------------------------------------------------------
        try:
            cors_res = requests.options(url, headers={**self.headers, "Origin": "https://attacker-exploit.evil.com"}, timeout=6)
            acao = cors_res.headers.get("Access-Control-Allow-Origin", "")
            acac = cors_res.headers.get("Access-Control-Allow-Credentials", "")
            if acao == "*" and acac.lower() == "true":
                issues.append({
                    "type": "security",
                    "severity": "CRITICAL",
                    "file_path": "backend/app/main.py",
                    "line_number": 1,
                    "title": "Insecure Wildcard CORS with Allowed Credentials Enabled",
                    "description": "The deployment allows arbitrary origins (*) while accepting authentication cookies/tokens. Any malicious site can read authenticated user private responses.",
                    "code_snippet": f"Access-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true",
                    "recommendation": """# backend/app/main.py - Whitelist authorized domain origins
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://my-frontend.vercel.app",
        "https://my-app.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)"""
                })
        except Exception as e:
            logger.debug(f"CORS probe skipped: {e}")

        # -------------------------------------------------------------
        # 4. DOM RECON, SCRIPT BUNDLES & PRODUCTION SOURCE MAPS
        # -------------------------------------------------------------
        html_text = res.text or ""

        # Check for mixed content
        if url.startswith("https://"):
            insecure_assets = re.findall(
                r'<(?:script|link|img|iframe)[^>]+(?:src|href)=["\'](http://[^"\']+)["\']',
                html_text,
                re.IGNORECASE
            )
            if insecure_assets:
                issues.append({
                    "type": "security",
                    "severity": "HIGH",
                    "file_path": "index.html",
                    "line_number": 1,
                    "title": "Mixed Content: Insecure HTTP Assets Loaded over HTTPS",
                    "description": f"Detected {len(insecure_assets)} unencrypted resources loaded over plain HTTP, violating browser secure context and breaking padlock security.",
                    "code_snippet": f"Found plain HTTP resource: {insecure_assets[0][:80]}...",
                    "recommendation": """<!-- Upgrade all asset protocols to HTTPS -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?..." />
<!-- Or use protocol-relative URL: //cdn.example.com/asset.js -->"""
                })

        # Locate script bundles
        raw_scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html_text, re.IGNORECASE)
        script_urls = []
        for src in raw_scripts:
            if src.startswith("//"):
                src = "https:" + src
            elif src.startswith("/"):
                src = url + src
            elif not src.startswith("http"):
                src = f"{url}/{src}"
            script_urls.append(src)

        # Inspect up to 6 main JavaScript chunks
        sampled_scripts = script_urls[:6]
        for s_url in sampled_scripts:
            try:
                js_res = requests.get(s_url, headers=self.headers, timeout=6)
                if js_res.status_code == 200:
                    js_code = js_res.text

                    # Leaked Secrets
                    secret_matches = re.findall(r'(AIza[0-9A-Za-z-_]{35}|sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36})', js_code)
                    if secret_matches:
                        issues.append({
                            "type": "security",
                            "severity": "CRITICAL",
                            "file_path": s_url.split('/')[-1] or "bundled_script.js",
                            "line_number": 1,
                            "title": "Exposed Secret API Key Detected in Client JavaScript Bundle",
                            "description": "Client-side production JavaScript bundle contains unmasked private API keys or tokens. Anyone inspecting browser DevTools can steal and abuse these credentials.",
                            "code_snippet": f"Leaked key pattern: {secret_matches[0][:8]}... in {s_url.split('/')[-1]}",
                            "recommendation": """// 1. Immediately rotate the leaked secret key in the provider console.
// 2. Remove the key from frontend code and .env client variables (e.g. VITE_* or REACT_APP_*).
// 3. Make the API call from a backend proxy endpoint:
const response = await fetch('/api/secure-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});"""
                        })

                    # Public Source Maps (.map)
                    map_url = s_url + ".map"
                    try:
                        map_check = requests.head(map_url, headers=self.headers, timeout=4)
                        if map_check.status_code == 200:
                            issues.append({
                                "type": "quality",
                                "severity": "MEDIUM",
                                "file_path": "vite.config.js",
                                "line_number": 1,
                                "title": "Public Source Maps (.map) Exposed in Production",
                                "description": "Production source maps (.map files) are publicly accessible, allowing competitors or malicious actors to reconstruct your original unminified source code, proprietary algorithms, and comments.",
                                "code_snippet": f"Source map publicly accessible at:\n{map_url}",
                                "recommendation": """// vite.config.js - Disable source maps in production build
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false // Set to false to prevent source map generation
  }
});"""
                            })
                    except Exception as e:
                        logger.debug(f"Source map check skipped for {map_url}: {e}")
            except Exception:
                continue

        # -------------------------------------------------------------
        # 5. RENDER FREE TIER COLD START / LATENCY AUDIT
        # -------------------------------------------------------------
        if is_render and latency_ms > 2500:
            issues.append({
                "type": "performance",
                "severity": "HIGH",
                "file_path": ".github/workflows/render-keepalive.yml",
                "line_number": 1,
                "title": f"High Latency / Render Free Instance Spin-Down Delay ({latency_ms}ms)",
                "description": f"The deployment took {latency_ms}ms to respond. On Render's free tier, web services spin down after 15 minutes of inactivity, causing 50+ second cold-start delays or gateway timeouts for visitors.",
                "code_snippet": f"HTTP Response Latency: {latency_ms}ms on {url}\nService was sleeping and required a cold start.",
                "recommendation": """# .github/workflows/render-keepalive.yml
# Free automated GitHub Action ping to prevent Render free instance spin-down
name: Render Service Keep Alive
on:
  schedule:
    - cron: '*/14 * * * *' # Fires every 14 minutes
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Live Service
        run: curl -sSf \"""" + url + """/api/health\" || true"""
            })

        # -------------------------------------------------------------
        # 6. GEMINI AI CODE DOCTOR SYNTHESIS
        # -------------------------------------------------------------
        ai_summary = self._synthesize_ai_audit(url, status_code, server_header, latency_ms, issues, platform_name)

        critical_count = sum(1 for i in issues if i["severity"] == "CRITICAL")
        high_count = sum(1 for i in issues if i["severity"] == "HIGH")
        medium_count = sum(1 for i in issues if i["severity"] == "MEDIUM")
        low_count = sum(1 for i in issues if i["severity"] == "LOW")

        return {
            "success": True,
            "target_url": url,
            "name": re.sub(r'https?://', '', url).split('/')[0],
            "detected_stack": platform_name,
            "latency_ms": latency_ms,
            "status_code": status_code,
            "total_files": len(script_urls) + 1,
            "files_scanned": len(sampled_scripts) + 1,
            "total_issues": len(issues),
            "critical_count": critical_count,
            "high_count": high_count,
            "medium_count": medium_count,
            "low_count": low_count,
            "issues": issues,
            "ai_summary": ai_summary
        }

    def _synthesize_ai_audit(self, url: str, status_code: int, server: str, latency: float, issues: List[Dict[str, Any]], platform: str) -> str:
        prompt = f"""
Audit Target: {url}
Cloud Platform: {platform}
HTTP Status: {status_code}
Server / Cloud Host: {server}
Latency: {latency}ms
Detected Vulnerabilities & Issues Count: {len(issues)}
Issue List:
{json.dumps([{"title": i["title"], "severity": i["severity"], "file": i["file_path"]} for i in issues[:8]], indent=2)}

Provide a concise 2-3 paragraph executive security & reliability assessment for this live deployment with immediate action steps.
"""
        system_instruction = "You are CodeLens AI Senior Cloud Infrastructure & Security Auditor. Provide a sharp, executive diagnostic."
        res = self.ai_service._call_gemini(system_instruction, prompt, timeout=10)
        if res:
            return res.strip()
        return f"Live deployment at {url} responded with status {status_code} in {latency}ms on {platform}. Identified {len(issues)} architectural and security findings requiring remediation."

    def _build_offline_error(self, url: str, error_msg: str) -> Dict[str, Any]:
        is_render = "onrender.com" in url.lower()
        is_vercel = "vercel" in url.lower()
        platform_name = "Render Cloud Service" if is_render else ("Vercel Edge Network" if is_vercel else "Live Cloud Host")

        return {
            "success": False,
            "target_url": url,
            "name": re.sub(r'https?://', '', url).split('/')[0],
            "detected_stack": platform_name,
            "latency_ms": 0,
            "status_code": 0,
            "total_files": 1,
            "files_scanned": 1,
            "total_issues": 2,
            "critical_count": 1,
            "high_count": 1,
            "medium_count": 0,
            "low_count": 0,
            "error": error_msg,
            "ai_summary": f"Cloud deployment probe to {url} failed. Error: {error_msg}. Follow the troubleshooting steps below to verify cloud host status.",
            "issues": [
                {
                    "type": "bug",
                    "severity": "CRITICAL",
                    "file_path": "render.yaml" if is_render else "vercel.json",
                    "line_number": 1,
                    "title": "Cloud Deployment Host Unreachable or Cold-Start Timeout",
                    "description": f"Could not establish a connection to '{url}'. {error_msg}. The deployment may be asleep (Render free tier spin-down), building, or DNS records have not propagated.",
                    "code_snippet": f"Connection to {url} failed.\nError details: {error_msg}",
                    "recommendation": """# Troubleshooting Checklist:
# 1. Open your Render or Vercel dashboard and verify the service status is 'Live' / 'Active'.
# 2. Check the platform runtime logs:
#    - For Render: Click your service -> 'Logs' to see startup crashes or port binding errors.
#    - For Vercel: Click deployment -> 'Functions' / 'Runtime Logs'.
# 3. Ensure your server binds to 0.0.0.0 and uses the dynamic PORT environment variable:
#    PORT = int(os.environ.get("PORT", 8000))
#    uvicorn.run(app, host="0.0.0.0", port=PORT)"""
                },
                {
                    "type": "security",
                    "severity": "HIGH",
                    "file_path": "DNS & SSL Configuration",
                    "line_number": 1,
                    "title": "SSL/TLS Handshake or Domain DNS Propagation Pending",
                    "description": "HTTPS connection could not be established securely. If you recently connected a custom domain, SSL certificate generation may take up to 24 hours.",
                    "code_snippet": f"curl -Iv {url}\nSSL certificate verification or domain DNS lookup failed.",
                    "recommendation": """# Verify DNS Records for your cloud host:
# For Vercel custom domain: Add CNAME record pointing to 'cname.vercel-dns.com'
# For Render custom domain: Add CNAME record pointing to your onrender.com address
# Verify with command: dig +short yourdomain.com"""
                }
            ]
        }
