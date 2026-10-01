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
    Live Cloud Deployment Scanner for Render, Vercel, Netlify, AWS, and Custom Domains.
    Audits live SSL/TLS, Security Headers, Leaked Environment Variables & API Keys in bundled JS,
    CORS Misconfigurations, Mixed Content, and synthesizes deep AI CodeDoctor remediation.
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

    def scan_live_deployment(self, target_url: str) -> Dict[str, Any]:
        url = self.sanitize_url(target_url)
        issues: List[Dict[str, Any]] = []

        start_time = time.time()
        try:
            res = requests.get(url, headers=self.headers, timeout=14, allow_redirects=True)
            latency_ms = round((time.time() - start_time) * 1000, 1)
        except requests.exceptions.SSLError as ssl_err:
            return self._build_offline_error(url, f"SSL/TLS Handshake Failed: {str(ssl_err)}")
        except requests.exceptions.ConnectionError:
            return self._build_offline_error(url, f"Unable to reach deployment host at '{url}'. Please verify domain DNS and cloud deployment status.")
        except Exception as e:
            return self._build_offline_error(url, f"Probe connection timed out or failed: {str(e)}")

        server_header = res.headers.get("Server", "Cloud Edge")
        content_type = res.headers.get("Content-Type", "")
        status_code = res.status_code

        # 1. HTTP Status Inspection
        if status_code >= 500:
            issues.append({
                "type": "bug",
                "severity": "CRITICAL",
                "file_path": url,
                "line_number": 1,
                "title": f"Live Deployment Server Error (HTTP {status_code})",
                "description": f"The deployed application on Render/Vercel returned a 5xx Server Error response. The backend service may have crashed or unhandled exception during bootstrap.",
                "code_snippet": f"HTTP/1.1 {status_code} {res.reason}",
                "recommendation": "Check cloud platform logs (e.g. `vercel logs` or Render Service Console) for runtime crash stack traces."
            })
        elif status_code == 404:
            issues.append({
                "type": "bug",
                "severity": "HIGH",
                "file_path": url,
                "line_number": 1,
                "title": "404 Not Found on Root Entrypoint",
                "description": "The deployment target returns 404 Not Found. SPA single-page routing or static export root directory is misconfigured.",
                "code_snippet": f"HTTP/1.1 404 Not Found at {url}",
                "recommendation": "Configure rewrite rules (e.g., vercel.json routes: source: '/(.*)', destination: '/index.html' or Render redirect rewrite)."
            })

        # 2. Strict Security Headers Audit
        sec_headers = {
            "Strict-Transport-Security": (
                "CRITICAL",
                "Missing HSTS Header (HTTP Strict Transport Security)",
                "Allows attackers to downgrade HTTPS connections to unencrypted HTTP via SSL-stripping MITM attacks.",
                "Add header: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload"
            ),
            "Content-Security-Policy": (
                "HIGH",
                "Missing Content-Security-Policy (CSP)",
                "Lack of CSP allows unrestricted execution of malicious inline scripts and cross-site scripting (XSS) payload injection.",
                "Configure a strict CSP policy restricting script-src, object-src, and default-src."
            ),
            "X-Frame-Options": (
                "MEDIUM",
                "Missing X-Frame-Options (Clickjacking Risk)",
                "The web page can be embedded within an invisible iframe on malicious third-party websites, exposing users to UI redress/clickjacking.",
                "Add header: X-Frame-Options: DENY or SAMEORIGIN."
            ),
            "X-Content-Type-Options": (
                "MEDIUM",
                "Missing X-Content-Type-Options Header",
                "Browsers may attempt MIME-sniffing on executable responses, allowing text files to execute as JavaScript.",
                "Add header: X-Content-Type-Options: nosniff."
            ),
            "Referrer-Policy": (
                "LOW",
                "Missing Referrer-Policy Header",
                "Outbound HTTP requests may leak sensitive query parameters and URL tokens in the Referer header.",
                "Add header: Referrer-Policy: strict-origin-when-cross-origin."
            )
        }

        for header_name, (sev, title, desc, fix) in sec_headers.items():
            if header_name not in res.headers:
                issues.append({
                    "type": "security",
                    "severity": sev,
                    "file_path": "HTTP Response Headers",
                    "line_number": 1,
                    "title": title,
                    "description": desc,
                    "code_snippet": f"Header '{header_name}' was not returned by {server_header}.",
                    "recommendation": fix
                })

        # 3. CORS Preflight Probe
        try:
            cors_res = requests.options(url, headers={**self.headers, "Origin": "https://attacker-domain.evil.com"}, timeout=6)
            acao = cors_res.headers.get("Access-Control-Allow-Origin", "")
            acac = cors_res.headers.get("Access-Control-Allow-Credentials", "")
            if acao == "*" and acac.lower() == "true":
                issues.append({
                    "type": "security",
                    "severity": "CRITICAL",
                    "file_path": "CORS Policy",
                    "line_number": 1,
                    "title": "Insecure Wildcard CORS with Allowed Credentials",
                    "description": "The deployment allows arbitrary origins (*) while accepting authentication cookies/credentials. Any malicious site can read authenticated user data.",
                    "code_snippet": f"Access-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true",
                    "recommendation": "Explicitly whitelist authorized frontend origins instead of using wildcard '*'."
                })
        except Exception as e:
            logger.debug(f"CORS preflight probe skipped: {e}")

        # 4. DOM & Bundled JavaScript Inspection
        html_text = res.text or ""

        # Check for mixed content (HTTP assets on HTTPS host)
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
                    "description": f"Loaded {len(insecure_assets)} unencrypted resources over plain HTTP, breaking browser HTTPS padlock guarantee.",
                    "code_snippet": insecure_assets[0][:80] + "...",
                    "recommendation": "Upgrade all asset URLs to protocol-relative (//) or HTTPS."
                })

        # Check script bundles for leaked secrets and exposed source maps
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

        # Inspect up to 5 main JS chunks for credential leaks
        sampled_scripts = script_urls[:5]
        for s_url in sampled_scripts:
            try:
                js_res = requests.get(s_url, headers=self.headers, timeout=6)
                if js_res.status_code == 200:
                    js_code = js_res.text
                    
                    # Pattern 1: Exposed API Keys
                    secret_matches = re.findall(r'(AIza[0-9A-Za-z-_]{35}|sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36})', js_code)
                    if secret_matches:
                        issues.append({
                            "type": "security",
                            "severity": "CRITICAL",
                            "file_path": s_url.split('/')[-1] or s_url,
                            "line_number": 1,
                            "title": "Hardcoded Secret Key Leaked in Production Bundle",
                            "description": "Production JavaScript chunk contains unmasked API credentials or private tokens bundled during client-side build.",
                            "code_snippet": f"Found key pattern: {secret_matches[0][:8]}... in {s_url.split('/')[-1]}",
                            "recommendation": "Rotate leaked credentials immediately and ensure keys are accessed only from a backend proxy."
                        })

                    # Pattern 2: Exposed .map Source Map File
                    map_url = s_url + ".map"
                    try:
                        map_check = requests.head(map_url, headers=self.headers, timeout=4)
                        if map_check.status_code == 200:
                            issues.append({
                                "type": "quality",
                                "severity": "MEDIUM",
                                "file_path": map_url.split('/')[-1],
                                "line_number": 1,
                                "title": "Public Source Maps (.map) Exposed in Production",
                                "description": "Production source maps allow any competitor or attacker to reconstruct original unminified TypeScript/React source code.",
                                "code_snippet": f"Publicly accessible: {map_url}",
                                "recommendation": "Set `productionSourceMap: false` or `build.sourcemap: false` in vite.config.js / next.config.js."
                            })
                    except Exception as e:
                        logger.debug(f"Source map check skipped for {map_url}: {e}")
            except Exception:
                continue

        # 5. Google Gemini AI CodeDoctor Deep Synthesis
        ai_summary = self._synthesize_ai_audit(url, status_code, server_header, latency_ms, issues)

        critical_count = sum(1 for i in issues if i["severity"] == "CRITICAL")
        high_count = sum(1 for i in issues if i["severity"] == "HIGH")
        medium_count = sum(1 for i in issues if i["severity"] == "MEDIUM")
        low_count = sum(1 for i in issues if i["severity"] == "LOW")

        return {
            "success": True,
            "target_url": url,
            "name": re.sub(r'https?://', '', url).split('/')[0],
            "detected_stack": f"{server_header} Cloud Deployment",
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

    def _synthesize_ai_audit(self, url: str, status_code: int, server: str, latency: float, issues: List[Dict[str, Any]]) -> str:
        prompt = f"""
Audit Target: {url}
HTTP Status: {status_code}
Server / Cloud Host: {server}
Latency: {latency}ms
Detected Vulnerabilities & Issues Count: {len(issues)}
Issue List:
{json.dumps([{"title": i["title"], "severity": i["severity"]} for i in issues[:6]], indent=2)}

Provide a concise 2-3 paragraph executive security & reliability assessment for this live deployment with immediate action steps.
"""
        system_instruction = "You are CodeLens AI Senior Cloud Infrastructure & Security Auditor. Provide a sharp, executive diagnostic."
        res = self.ai_service._call_gemini(system_instruction, prompt, timeout=10)
        if res:
            return res.strip()
        return f"Live deployment at {url} responded with status {status_code} in {latency}ms on {server}. Identified {len(issues)} security and architectural findings requiring remediation."

    def _build_offline_error(self, url: str, error_msg: str) -> Dict[str, Any]:
        return {
            "success": False,
            "target_url": url,
            "name": url,
            "detected_stack": "Unknown Cloud Deployment",
            "total_files": 0,
            "files_scanned": 0,
            "total_issues": 1,
            "critical_count": 1,
            "high_count": 0,
            "medium_count": 0,
            "low_count": 0,
            "error": error_msg,
            "issues": [
                {
                    "type": "bug",
                    "severity": "CRITICAL",
                    "file_path": url,
                    "line_number": 1,
                    "title": "Deployment Host Unreachable",
                    "description": error_msg,
                    "code_snippet": f"Connection to {url} failed.",
                    "recommendation": "Verify that your Render or Vercel deployment is active, DNS records have propagated, and SSL certs are issued."
                }
            ]
        }
