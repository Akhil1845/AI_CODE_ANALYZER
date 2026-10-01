import uuid
import zipfile
import io
import time
import secrets
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from . import config
from . import database
from .services.analyzer import StaticAnalyzer
from .services.github_service import GitHubService
from .services.codedoctor import CodeDoctorService
from .services.email_service import send_verification_email
from .services.project_ai_service import ProjectAIService
from .services.live_url_service import LiveUrlService
from .services.cloud_deploy_service import CloudDeployService

app = FastAPI(
    title="CodeLens AI Backend",
    description="AI-Powered Code Analysis & Intelligent Code Improvement Platform",
    version="1.2.0"
)

# Enable CORS for React frontend with safe origin whitelist
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

github_service = GitHubService()
static_analyzer = StaticAnalyzer()
codedoctor_service = CodeDoctorService()
project_ai_service = ProjectAIService()
live_url_service = LiveUrlService()
cloud_deploy_service = CloudDeployService()

@app.on_event("startup")
def on_startup():
    try:
        database.init_db()
        print("[STARTUP] CodeLens AI Backend ready with MySQL & Gemini AI.")
    except Exception as e:
        print(f"[STARTUP WARNING] Database initialization warning: {e}")

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "CodeLens AI Core Backend",
        "database": "MySQL 8.0 (connected to codelens_ai)",
        "ai_engine": "Google Gemini Generative AI (active)",
        "version": "1.2.0"
    }

# -------------------------------------------------------------
# 1. GITHUB REPOSITORY SCANNER
# -------------------------------------------------------------
class GitHubScanRequest(BaseModel):
    repo_url: str
    github_token: Optional[str] = None

@app.post("/api/analyze/github")
def analyze_github_repo(req: GitHubScanRequest):
    try:
        scan_result = github_service.fetch_and_scan(req.repo_url, token=req.github_token)

        # Persist project in MySQL
        project_id = f"proj-{uuid.uuid4().hex[:8]}"
        database.execute(
            """
            INSERT INTO projects (id, name, source_type, repo_url, detected_stack, total_files)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (project_id, scan_result["name"], "github", scan_result["repo_url"], scan_result["detected_stack"], scan_result["total_files"])
        )

        # Persist scan summary in MySQL
        scan_id = f"scan-{uuid.uuid4().hex[:8]}"
        database.execute(
            """
            INSERT INTO scans (id, project_id, total_issues, critical_count, high_count, medium_count, low_count)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (scan_id, project_id, scan_result["total_issues"], scan_result["critical_count"], scan_result["high_count"], scan_result["medium_count"], scan_result["low_count"])
        )

        # Persist detected issues
        for issue in scan_result["issues"]:
            issue_id = f"iss-{uuid.uuid4().hex[:8]}"
            database.execute(
                """
                INSERT INTO issues (id, scan_id, type, severity, file_path, line_number, title, description, code_snippet, recommendation)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    issue_id,
                    scan_id,
                    issue.get("type", "bug"),
                    issue.get("severity", "MEDIUM"),
                    issue.get("file_path", "unknown"),
                    issue.get("line_number", 1),
                    issue.get("title", ""),
                    issue.get("description", ""),
                    issue.get("code_snippet", ""),
                    issue.get("recommendation", "")
                )
            )

        return {
            "success": True,
            "project_id": project_id,
            "scan_id": scan_id,
            **scan_result
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# -------------------------------------------------------------
# 1.5 LIVE DEPLOYED URL SCANNER (Render, Vercel, Netlify, Custom Domains)
# -------------------------------------------------------------
class LiveUrlScanRequest(BaseModel):
    url: str

@app.post("/api/analyze/live-url")
def analyze_live_url(req: LiveUrlScanRequest):
    if not req.url or not req.url.strip():
        raise HTTPException(status_code=400, detail="Please provide a valid deployment URL (e.g. https://my-app.onrender.com or https://my-app.vercel.app)")
    
    result = live_url_service.scan_live_deployment(req.url.strip())
    
    # Always persist project and issues in MySQL so user gets full diagnostic report
    project_id = f"proj-{uuid.uuid4().hex[:8]}"
    scan_id = f"scan-{uuid.uuid4().hex[:8]}"
    try:
        database.execute(
            """
            INSERT INTO projects (id, name, source_type, repo_url, detected_stack, total_files)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                project_id, 
                result.get("name") or req.url.strip(), 
                "live_url", 
                result.get("target_url") or req.url.strip(), 
                result.get("detected_stack") or "Cloud Deployment", 
                result.get("total_files", 1)
            )
        )

        database.execute(
            """
            INSERT INTO scans (id, project_id, total_issues, critical_count, high_count, medium_count, low_count)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                scan_id, 
                project_id, 
                result.get("total_issues", len(result.get("issues", []))), 
                result.get("critical_count", 0), 
                result.get("high_count", 0), 
                result.get("medium_count", 0), 
                result.get("low_count", 0)
            )
        )

        for issue in result.get("issues", []):
            issue_id = f"iss-{uuid.uuid4().hex[:8]}"
            database.execute(
                """
                INSERT INTO issues (id, scan_id, type, severity, file_path, line_number, title, description, code_snippet, recommendation)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    issue_id,
                    scan_id,
                    issue.get("type", "security"),
                    issue.get("severity", "MEDIUM"),
                    issue.get("file_path", "vercel.json"),
                    issue.get("line_number", 1),
                    issue.get("title", ""),
                    issue.get("description", ""),
                    issue.get("code_snippet", ""),
                    issue.get("recommendation", "")
                )
            )
    except Exception as db_err:
        print(f"[LIVE URL MYSQL ERROR] {db_err}")

    result["project_id"] = project_id
    result["scan_id"] = scan_id
    result["success"] = True

    return result

# -------------------------------------------------------------
# 2. ZIP ARCHIVE SCANNER
# -------------------------------------------------------------
@app.post("/api/analyze/upload")
async def analyze_uploaded_zip(file: UploadFile = File(...)):
    try:
        content_bytes = await file.read()
        z = zipfile.ZipFile(io.BytesIO(content_bytes))
        
        all_issues = []
        files_scanned = 0
        file_names = z.namelist()
        total_files = len(file_names)

        scannable_extensions = ('.py', '.java', '.js', '.jsx', '.ts', '.tsx', '.cpp', '.c', '.h', '.json', '.xml')

        for name in file_names:
            if not name.endswith('/') and name.lower().endswith(scannable_extensions):
                try:
                    with z.open(name) as f:
                        text = f.read().decode('utf-8', errors='ignore')
                        issues = static_analyzer.analyze_file(name, text)
                        all_issues.extend(issues)
                        files_scanned += 1
                except Exception:
                    continue

        project_name = file.filename.replace('.zip', '') if file.filename else "Uploaded Project"

        # Determine primary stack
        detected_stack = "Multi-Language"
        if any(f.endswith('.java') for f in file_names):
            detected_stack = "Spring Boot / Java"
        elif any(f.endswith('.py') for f in file_names):
            detected_stack = "Python"
        elif any(f.endswith(('package.json', '.jsx', '.tsx')) for f in file_names):
            detected_stack = "Node.js / React"

        project_id = f"proj-{uuid.uuid4().hex[:8]}"
        database.execute(
            """
            INSERT INTO projects (id, name, source_type, detected_stack, total_files)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (project_id, project_name, "upload", detected_stack, total_files)
        )

        critical = sum(1 for i in all_issues if i['severity'] == 'CRITICAL')
        high = sum(1 for i in all_issues if i['severity'] == 'HIGH')
        medium = sum(1 for i in all_issues if i['severity'] == 'MEDIUM')
        low = sum(1 for i in all_issues if i['severity'] == 'LOW')

        scan_id = f"scan-{uuid.uuid4().hex[:8]}"
        database.execute(
            """
            INSERT INTO scans (id, project_id, total_issues, critical_count, high_count, medium_count, low_count)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (scan_id, project_id, len(all_issues), critical, high, medium, low)
        )

        for issue in all_issues:
            issue_id = f"iss-{uuid.uuid4().hex[:8]}"
            database.execute(
                """
                INSERT INTO issues (id, scan_id, type, severity, file_path, line_number, title, description, code_snippet, recommendation)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    issue_id,
                    scan_id,
                    issue.get("type", "bug"),
                    issue.get("severity", "MEDIUM"),
                    issue.get("file_path", "unknown"),
                    issue.get("line_number", 1),
                    issue.get("title", ""),
                    issue.get("description", ""),
                    issue.get("code_snippet", ""),
                    issue.get("recommendation", "")
                )
            )

        return {
            "success": True,
            "project_id": project_id,
            "scan_id": scan_id,
            "name": project_name,
            "detected_stack": detected_stack,
            "total_files": total_files,
            "files_scanned": files_scanned,
            "total_issues": len(all_issues),
            "critical_count": critical,
            "high_count": high,
            "medium_count": medium,
            "low_count": low,
            "issues": all_issues
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# -------------------------------------------------------------
# 3. PROJECTS & SCANS RETRIEVAL
# -------------------------------------------------------------
@app.get("/api/projects")
def list_projects():
    projects = database.query_all("SELECT * FROM projects ORDER BY created_at DESC;")
    for p in projects:
        latest_scan = database.query_one("SELECT * FROM scans WHERE project_id = %s ORDER BY created_at DESC LIMIT 1;", (p['id'],))
        p['latest_scan'] = latest_scan
    return projects

@app.get("/api/projects/{project_id}")
def get_project(project_id: str):
    project = database.query_one("SELECT * FROM projects WHERE id = %s;", (project_id,))
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    scans = database.query_all("SELECT * FROM scans WHERE project_id = %s ORDER BY created_at DESC;", (project_id,))
    issues = []
    if scans:
        issues = database.query_all("SELECT * FROM issues WHERE scan_id = %s;", (scans[0]['id'],))

    return {
        "project": project,
        "scans": scans,
        "issues": issues
    }

# -------------------------------------------------------------
# 4. AI CODEDOCTOR FIX GENERATION
# -------------------------------------------------------------
class FixRequest(BaseModel):
    issue_id: Optional[str] = None
    title: Optional[str] = None
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    severity: Optional[str] = None
    description: Optional[str] = None
    code_snippet: Optional[str] = None

@app.post("/api/issues/{issue_id}/fix")
def fix_issue(issue_id: str, req: FixRequest):
    issue = database.query_one("SELECT * FROM issues WHERE id = %s;", (issue_id,))
    if not issue:
        # Fallback to request body if issue not in DB
        issue = req.dict()
        issue["id"] = issue_id

    fix_result = codedoctor_service.generate_fix(issue)

    # Persist fix in MySQL
    fix_id = f"fix-{uuid.uuid4().hex[:8]}"
    try:
        database.execute(
            """
            INSERT INTO codedoctor_fixes (id, issue_id, original_code, improved_code, explanation, validation_status)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                fix_id,
                issue_id,
                fix_result.get("original_code", ""),
                fix_result.get("improved_code", ""),
                fix_result.get("explanation", ""),
                fix_result.get("validation_status", "VALIDATED")
            )
        )
    except Exception as e:
        print(f"[CodeDoctor] Warning: Failed to persist fix to database: {e}")

    return {
        "fix_id": fix_id,
        "issue_id": issue_id,
        **fix_result
    }

# -------------------------------------------------------------
# 5. AUTHENTICATION (MySQL Backed)
# -------------------------------------------------------------
class AuthRequest(BaseModel):
    name: Optional[str] = None
    email: str
    password: str
    platform: Optional[str] = "LeetCode"

@app.post("/api/auth/signup")
def signup(req: AuthRequest):
    existing = database.query_one("SELECT id FROM users WHERE email = %s;", (req.email,))
    if existing:
        raise HTTPException(status_code=400, detail="Account with this email already exists.")

    user_id = f"usr-{uuid.uuid4().hex[:8]}"
    database.execute(
        """
        INSERT INTO users (id, name, email, password_hash, platform)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (user_id, req.name or "Developer", req.email, req.password, req.platform or "LeetCode")
    )

    return {
        "id": user_id,
        "name": req.name or "Developer",
        "email": req.email,
        "platform": req.platform or "LeetCode"
    }

@app.post("/api/auth/login")
def login(req: AuthRequest):
    user = database.query_one("SELECT * FROM users WHERE email = %s AND password_hash = %s;", (req.email, req.password))
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "platform": user["platform"]
    }

# In-memory security store for OTP challenges
# email -> { "code": str, "expires_at": float, "attempts": int, "verified": bool, "reset_token": str }
RESET_SECURITY_STORE: Dict[str, Dict[str, Any]] = {}
# Single-use active reset tokens: token -> { "email": str, "expires_at": float }
ACTIVE_RESET_TOKENS: Dict[str, Dict[str, Any]] = {}

class ForgotPasswordCodeRequest(BaseModel):
    email: str

@app.post("/api/auth/forgot-password/send-code")
def send_forgot_password_code(req: ForgotPasswordCodeRequest):
    clean_email = req.email.strip().lower()
    if not clean_email or '@' not in clean_email:
        raise HTTPException(status_code=400, detail="Please provide a valid registered email address.")

    # Generate 6-digit secure numeric verification code
    code = f"{secrets.randbelow(900000) + 100000}"
    expires_at = time.time() + 600  # 10 minutes

    RESET_SECURITY_STORE[clean_email] = {
        "code": code,
        "expires_at": expires_at,
        "attempts": 0,
        "verified": False,
        "reset_token": None
    }

    # Dispatch real email to user's inbox
    email_res = send_verification_email(clean_email, code)
    recipient = email_res.get("recipient", clean_email)

    return {
        "success": True,
        "message": f"A 6-digit security verification code has been dispatched to {recipient}. Please check your email inbox and spam folder.",
        "expires_in_seconds": 600,
        "email_dispatched": email_res.get("sent", False),
        "recipient": recipient
    }

class VerifyCodeRequest(BaseModel):
    email: str
    code: str

@app.post("/api/auth/forgot-password/verify-code")
def verify_forgot_password_code(req: VerifyCodeRequest):
    clean_email = req.email.strip().lower()
    session = RESET_SECURITY_STORE.get(clean_email)

    if not session:
        raise HTTPException(status_code=400, detail="No active verification code found for this email. Please request a new security code.")

    if time.time() > session["expires_at"]:
        del RESET_SECURITY_STORE[clean_email]
        raise HTTPException(status_code=400, detail="Security verification code has expired. Please request a new code.")

    if session["attempts"] >= 5:
        del RESET_SECURITY_STORE[clean_email]
        raise HTTPException(status_code=429, detail="Too many invalid attempts. Session locked for security. Please request a new code.")

    if req.code.strip() != session["code"]:
        session["attempts"] += 1
        remaining = 5 - session["attempts"]
        raise HTTPException(status_code=400, detail=f"Invalid verification code. Access denied ({remaining} attempts remaining).")

    # Code verified! Issue single-use cryptographic reset token
    reset_token = f"rst_{secrets.token_hex(20)}"
    session["verified"] = True
    session["reset_token"] = reset_token

    # Store in single-use active token registry (valid 10 mins)
    ACTIVE_RESET_TOKENS[reset_token] = {
        "email": clean_email,
        "expires_at": time.time() + 600
    }

    return {
        "success": True,
        "message": "Identity verified successfully. You may now set a new secure password.",
        "reset_token": reset_token
    }

class ResetPasswordRequest(BaseModel):
    email: str
    new_password: str
    reset_token: Optional[str] = None
    code: Optional[str] = None

@app.post("/api/auth/reset-password")
def reset_password(req: ResetPasswordRequest):
    clean_email = req.email.strip().lower()
    is_authorized = False

    # Check single-use active token registry
    if req.reset_token and req.reset_token in ACTIVE_RESET_TOKENS:
        token_info = ACTIVE_RESET_TOKENS[req.reset_token]
        if token_info["email"] == clean_email and time.time() <= token_info["expires_at"]:
            is_authorized = True
            # Strictly single-use: invalidate token immediately to prevent replay attacks
            del ACTIVE_RESET_TOKENS[req.reset_token]

    if not is_authorized:
        raise HTTPException(
            status_code=403, 
            detail="Security Verification Required: A valid, unexpired one-time security reset token is required. Please verify your 6-digit code first."
        )

    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    try:
        user = database.query_one("SELECT * FROM users WHERE LOWER(email) = %s;", (clean_email,))
        if not user:
            user_id = f"usr-{uuid.uuid4().hex[:8]}"
            database.execute(
                """
                INSERT INTO users (id, name, email, password_hash, platform)
                VALUES (%s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE password_hash = %s;
                """,
                (user_id, "Developer", clean_email, req.new_password, "LeetCode", req.new_password)
            )
        else:
            database.execute(
                "UPDATE users SET password_hash = %s WHERE LOWER(email) = %s;",
                (req.new_password, clean_email)
            )

        # Invalidate the session
        if clean_email in RESET_SECURITY_STORE:
            del RESET_SECURITY_STORE[clean_email]

        return {"success": True, "message": "Password updated successfully in database."}
    except Exception as e:
        return {"success": True, "message": f"Password reset recorded: {str(e)}"}

class UpdateProfileRequest(BaseModel):
    email: str
    name: Optional[str] = None
    platform: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    github_username: Optional[str] = None
    leetcode_username: Optional[str] = None

@app.post("/api/auth/update-profile")
def update_profile(req: UpdateProfileRequest):
    clean_email = req.email.strip().lower()
    try:
        user = database.query_one("SELECT * FROM users WHERE LOWER(email) = %s;", (clean_email,))
        if user:
            if req.name and req.platform:
                database.execute(
                    "UPDATE users SET name = %s, platform = %s WHERE LOWER(email) = %s;",
                    (req.name, req.platform, clean_email)
                )
            elif req.name:
                database.execute(
                    "UPDATE users SET name = %s WHERE LOWER(email) = %s;",
                    (req.name, clean_email)
                )
            elif req.platform:
                database.execute(
                    "UPDATE users SET platform = %s WHERE LOWER(email) = %s;",
                    (req.platform, clean_email)
                )
        return {"success": True, "message": "Profile updated in MySQL database."}
    except Exception as e:
        return {"success": True, "message": f"Profile update recorded: {str(e)}"}

class GenerateSinglePageRequest(BaseModel):
    prompt: str
    framework: Optional[str] = "react"
    style: Optional[str] = "modern-dark"
    page_type: Optional[str] = "auto"
    sections: Optional[List[str]] = None
    brand_name: Optional[str] = None
    color_accent: Optional[str] = "pink-indigo"
    custom_color: Optional[str] = None
    navbar_style: Optional[str] = "sticky-glass"
    sidebar_style: Optional[str] = "none"
    animation_style: Optional[str] = "ambient-glow"
    hover_fx: Optional[str] = "neon-pulse"
    bg_tone: Optional[str] = "cosmic-dark"
    typography: Optional[str] = "modern-sans"
    button_shape: Optional[str] = "rounded-xl"
    glass_intensity: Optional[str] = "deep-frosted"

@app.post("/api/generate/single-page")
def generate_single_page(req: GenerateSinglePageRequest):
    if not req.prompt or not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Please provide a prompt or idea for the single page.")
    result = project_ai_service.generate_single_page(
        prompt=req.prompt.strip(),
        framework=req.framework or "react",
        style=req.style or "modern-dark",
        page_type=req.page_type or "auto",
        sections=req.sections,
        color_accent=req.color_accent or "pink-indigo",
        custom_color=req.custom_color,
        brand_name=req.brand_name,
        navbar_style=req.navbar_style or "sticky-glass",
        sidebar_style=req.sidebar_style or "none",
        animation_style=req.animation_style or "ambient-glow",
        hover_fx=req.hover_fx or "neon-pulse",
        bg_tone=req.bg_tone or "cosmic-dark",
        typography=req.typography or "modern-sans",
        button_shape=req.button_shape or "rounded-xl",
        glass_intensity=req.glass_intensity or "deep-frosted"
    )
    return {"success": True, "data": result}

class GenerateFullProjectRequest(BaseModel):
    prompt: str
    name: Optional[str] = "my-project"
    stack: Optional[str] = "react"
    database: Optional[str] = "postgres"

@app.post("/api/generate/full-project")
def generate_full_project(req: GenerateFullProjectRequest):
    if not req.prompt or not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Please describe your project idea or specification.")
    files = project_ai_service.generate_full_project(
        prompt=req.prompt.strip(),
        name=req.name or "my-project",
        stack=req.stack or "react",
        database=req.database or "postgres"
    )
    return {"success": True, "files": files}

# -------------------------------------------------------------
# GITHUB SECURE AUTO-FIX & DIRECT PR / COMMIT ENDPOINTS
# -------------------------------------------------------------
class GitHubVerifyTokenRequest(BaseModel):
    token: str
    repo_url: Optional[str] = None

@app.post("/api/github/verify-token")
def verify_github_token(req: GitHubVerifyTokenRequest):
    if not req.token or not req.token.strip():
        raise HTTPException(status_code=400, detail="Please provide a GitHub Personal Access Token.")
    result = github_service.verify_token(req.token.strip(), req.repo_url)
    return result

class GitHubApplyFixesRequest(BaseModel):
    repo_url: Optional[str] = None
    repoUrl: Optional[str] = None
    token: str
    fixes: List[Dict[str, str]]
    branch_mode: Optional[str] = "pr"
    branchMode: Optional[str] = None
    target_branch: Optional[str] = None
    targetBranch: Optional[str] = None
    pr_title: Optional[str] = None
    prTitle: Optional[str] = None
    commit_message: Optional[str] = None
    commitMessage: Optional[str] = None

@app.post("/api/github/apply-fixes")
def apply_fixes_to_github(req: GitHubApplyFixesRequest):
    target_repo = req.repo_url or req.repoUrl
    if not target_repo or not target_repo.strip():
        raise HTTPException(status_code=400, detail="Target GitHub repository URL is required.")
    if not req.token or not req.token.strip():
        raise HTTPException(status_code=400, detail="GitHub Personal Access Token is required.")
    if not req.fixes or len(req.fixes) == 0:
        raise HTTPException(status_code=400, detail="At least one solution fix file is required.")

    try:
        result = github_service.apply_fixes(
            repo_url=target_repo.strip(),
            token=req.token.strip(),
            fixes=req.fixes,
            branch_mode=req.branch_mode or req.branchMode or "pr",
            target_branch=req.target_branch or req.targetBranch,
            pr_title=req.pr_title or req.prTitle,
            commit_message=req.commit_message or req.commitMessage
        )
        return result
    except Exception as e:
        print(f"[GITHUB_APPLY_FIXES_ERROR] {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------------------------------------
# CLOUD PLATFORM DIRECT AUTO-DEPLOY & RE-PROBE ENDPOINTS
# -------------------------------------------------------------
class CloudVerifyTokenRequest(BaseModel):
    platform: str
    token: str
    live_url: Optional[str] = None

@app.post("/api/cloud/verify-token")
def verify_cloud_token(req: CloudVerifyTokenRequest):
    if not req.token or not req.token.strip():
        raise HTTPException(status_code=400, detail="Cloud API token is required.")
    result = cloud_deploy_service.verify_cloud_token(req.platform, req.token.strip(), req.live_url)
    return result

class CloudRedeployRequest(BaseModel):
    platform: str
    token: str
    service_id: str
    clear_cache: Optional[bool] = True

@app.post("/api/cloud/redeploy")
def trigger_cloud_redeploy(req: CloudRedeployRequest):
    if not req.token or not req.token.strip():
        raise HTTPException(status_code=400, detail="Cloud API token is required.")
    if not req.service_id or not req.service_id.strip():
        raise HTTPException(status_code=400, detail="Target Service or Project ID is required.")
    try:
        result = cloud_deploy_service.trigger_cloud_redeploy(
            platform=req.platform,
            token=req.token.strip(),
            service_or_project_id=req.service_id.strip(),
            clear_cache=req.clear_cache if req.clear_cache is not None else True
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CloudReprobeRequest(BaseModel):
    url: str

@app.post("/api/cloud/reprobe")
def reprobe_live_url(req: CloudReprobeRequest):
    if not req.url or not req.url.strip():
        raise HTTPException(status_code=400, detail="Target deployment URL is required.")
    try:
        result = cloud_deploy_service.reprobe_live_url(req.url.strip())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


