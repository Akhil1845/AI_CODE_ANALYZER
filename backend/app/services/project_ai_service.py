import os
import json
import requests
import re
from typing import Dict, Any, List, Optional
from .. import config

class ProjectAIService:
    """
    AI Project & Single Page Generator powered by Google Gemini.
    Generates production-grade standalone single pages and full-stack project repositories
    from natural language user ideas with rich modular configuration options.
    """

    def __init__(self):
        self.api_key = config.GEMINI_API_KEY
        self.primary_model = config.GEMINI_MODEL or "models/gemini-flash-lite-latest"
        self.candidate_models = [
            self.primary_model,
            "models/gemini-flash-lite-latest",
            "models/gemini-3.5-flash-lite",
            "models/gemini-3.1-flash-lite"
        ]

    def _call_gemini(self, system_instruction: str, user_prompt: str, timeout: int = 15) -> Optional[str]:
        if not self.api_key:
            return None

        tried = set()
        for model in self.candidate_models:
            if model in tried:
                continue
            tried.add(model)
            url = f"https://generativelanguage.googleapis.com/v1beta/{model}:generateContent?key={self.api_key}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": f"{system_instruction}\n\nUSER PROMPT / IDEA:\n{user_prompt}"}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.35,
                    "maxOutputTokens": 4096
                }
            }
            try:
                res = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=timeout)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            return parts[0].get("text", "")
                else:
                    print(f"[GEMINI FAIL] Model {model} status {res.status_code}: {res.text[:120]}")
            except Exception as e:
                print(f"[GEMINI FAIL] Model {model} request failed: {e}")

        return None

    def _extract_brand_name(self, prompt: str, archetype: str) -> str:
        """
        Derives a concise, professional 1-2 word brand name rather than dumping the user's prompt text.
        """
        # Look for explicit brand naming like "named X" or "called X"
        match = re.search(r'(?:named|called|for)\s+([A-Za-z0-9_]{3,20})', prompt, re.IGNORECASE)
        if match:
            candidate = match.group(1).capitalize()
            if candidate.lower() not in ['a', 'an', 'the', 'my', 'creative', 'modern', 'new']:
                return candidate

        defaults = {
            "auth": "NexusAuth",
            "dashboard": "PulseMetrics",
            "ecommerce": "ApexStore",
            "pricing": "CloudScale",
            "portfolio": "DevSphere",
            "landing": "NovaCloud",
            "docs": "DocuPulse"
        }
        return defaults.get(archetype, "Aura")

    def _detect_archetype(self, prompt: str, page_type: str = "auto") -> str:
        if page_type and page_type not in ["auto", ""]:
            return page_type.lower()
        lower = prompt.lower()
        if any(w in lower for w in ["login", "signup", "sign up", "sign in", "signin", "auth", "register", "password", "2fa"]):
            return "auth"
        if any(w in lower for w in ["dashboard", "analytics", "admin", "metrics", "kpi", "chart", "telemetry"]):
            return "dashboard"
        if any(w in lower for w in ["store", "ecommerce", "e-commerce", "shop", "product", "cart", "checkout"]):
            return "ecommerce"
        if any(w in lower for w in ["pricing", "plans", "tier", "subscription", "billing"]):
            return "pricing"
        if any(w in lower for w in ["portfolio", "resume", "personal site", "developer portfolio"]):
            return "portfolio"
        if any(w in lower for w in ["docs", "documentation", "api doc", "guide"]):
            return "docs"
        return "landing"

    def generate_single_page(
        self,
        prompt: str,
        framework: str = "react",
        style: str = "modern-dark",
        page_type: str = "auto",
        sections: Optional[List[str]] = None,
        color_accent: str = "pink-indigo",
        custom_color: Optional[str] = None,
        brand_name: Optional[str] = None,
        navbar_style: str = "sticky-glass",
        sidebar_style: str = "none",
        animation_style: str = "ambient-glow",
        hover_fx: str = "neon-pulse",
        bg_tone: str = "cosmic-dark",
        typography: str = "modern-sans",
        button_shape: str = "rounded-xl",
        glass_intensity: str = "deep-frosted"
    ) -> Dict[str, Any]:
        """
        Generates a standalone, beautifully designed single-page application or component.
        Guarantees that the raw user prompt is NEVER dumped as the h1 or title.
        """
        archetype = self._detect_archetype(prompt, page_type)
        brand = brand_name.strip() if brand_name and brand_name.strip() else self._extract_brand_name(prompt, archetype)

        sections_desc = f"Include these sections: {', '.join(sections)}." if sections else "Include modern intuitive sections appropriate for this archetype."
        effective_color = f"Custom Hex {custom_color}" if custom_color else color_accent

        system_instruction = f"""
You are CodeLens AI Senior Frontend Architect.
Generate a complete, modern, gorgeous, production-grade standalone single-page UI based on the user's idea.
Target framework: {framework} (if React, provide clean React JSX component; if HTML, provide modern HTML5).
Archetype / Page Type: {archetype.upper()} ({sections_desc})
Design aesthetic: {style} ({bg_tone} background, {typography} font family, {glass_intensity} glassmorphism, buttons: {button_shape}).
Brand name: {brand}
Color Accent: {effective_color}
Navbar Configuration: {navbar_style} (e.g. sticky glassmorphic or floating pill or minimal or none)
Sidebar Configuration: {sidebar_style} (e.g. none or collapsible left navigation dock)
Visual Animations & Effects: {animation_style} with hover effects: {hover_fx}

CRITICAL RULES:
1. NEVER use the user's raw prompt text as the page heading (h1), hero title, or placeholder text. Always synthesize realistic, professional, domain-appropriate copy (e.g., if Auth: 'Sign In to Your Workspace', 'Enterprise Single Sign-On'; if Dashboard: 'Real-Time Observability', etc.).
2. If Archetype is AUTH: You MUST render a true, interactive dual-tab Login & Sign Up card with working JavaScript tab switching ('Sign In' vs 'Sign Up'), email input, password with show/hide eye toggle, remember me checkbox, forgot password link, social login buttons (Google, GitHub), and the selected navbar style.
3. If Archetype is DASHBOARD: Render an analytics dashboard with sidebar navigation, metric KPI cards, SVG activity charts, and recent activity table.
4. If Archetype is ECOMMERCE: Render product showcase cards, rating stars, price tags, and interactive Add to Cart toast.
5. If Archetype is PRICING: Render tier comparison cards, monthly/annual toggle, feature checkmarks, and CTA buttons.
6. The 'preview_html' field MUST be a self-contained, fully working HTML document with Tailwind CSS CDN (<script src="https://cdn.tailwindcss.com"></script>), Google Fonts, embedded JavaScript for interactive toggles/tabs, and beautiful styling so it can be previewed directly inside an iframe.

Return your response strictly as a JSON object with this exact schema:
{{
  "title": "A concise 2-3 word product title (e.g. {brand} Suite)",
  "description": "Brief 1-sentence summary of what was generated",
  "filename": "{'index.html' if framework == 'html' else brand + 'Page.jsx'}",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
  "code": "Full, complete, beautifully formatted source code for the component",
  "preview_html": "A self-contained, fully working HTML document with Tailwind CSS CDN, interactive JS, and beautiful styling for direct iframe preview."
}}
Do NOT wrap the response in markdown blocks. Return ONLY the raw JSON string.
"""
        response_text = self._call_gemini(system_instruction, prompt)
        if response_text:
            cleaned = response_text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            try:
                parsed = json.loads(cleaned.strip())
                if isinstance(parsed, dict) and "preview_html" in parsed:
                    # Sanity check: Ensure raw prompt was not dumped into title
                    if prompt.lower() in parsed.get("title", "").lower() and len(prompt) > 20:
                        parsed["title"] = f"{brand} Portal"
                    return parsed
            except Exception as e:
                print(f"[JSON PARSE ERROR] {e}")

        # Dynamic fallback handcrafted generator tailored to the exact archetype
        return self._generate_archetype_fallback(archetype, brand, framework, style, color_accent, navbar_style, sidebar_style)

    def _generate_archetype_fallback(
        self,
        archetype: str,
        brand: str,
        framework: str,
        style: str,
        color_accent: str,
        navbar_style: str = "sticky-glass",
        sidebar_style: str = "none"
    ) -> Dict[str, Any]:
        """
        Generates handcrafted, ultra-responsive, beautiful templates tailored to the exact archetype.
        Guarantees 100% reliability with ZERO raw prompt text in headings.
        """
        if archetype == "auth":
            return self._build_auth_page(brand, framework, style)
        elif archetype == "dashboard":
            return self._build_dashboard_page(brand, framework, style)
        elif archetype == "ecommerce":
            return self._build_ecommerce_page(brand, framework, style)
        elif archetype == "pricing":
            return self._build_pricing_page(brand, framework, style)
        elif archetype == "portfolio":
            return self._build_portfolio_page(brand, framework, style)
        else:
            return self._build_landing_page(brand, framework, style)

    def _build_auth_page(self, brand: str, framework: str, style: str) -> Dict[str, Any]:
        title = f"{brand} Auth Portal"
        desc = "Modern dual-tab authentication portal with glassmorphism, social sign-in, and password toggle."
        html_code = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {{ font-family: 'Plus Jakarta Sans', sans-serif; background: #070913; color: #f8fafc; }}
    .glass-card {{ background: rgba(17, 24, 39, 0.75); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); }}
    .glass-nav {{ background: rgba(7, 9, 19, 0.85); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); }}
    .gradient-btn {{ background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #38bdf8 100%); }}
    .glow-orb {{ position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; }}
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between relative overflow-x-hidden selection:bg-pink-500 selection:text-white">
  
  <!-- Ambient Background Glows -->
  <div class="glow-orb w-[550px] h-[550px] bg-pink-500/15 -top-20 -left-20"></div>
  <div class="glow-orb w-[600px] h-[600px] bg-indigo-600/15 -bottom-20 -right-20"></div>

  <!-- Sticky Glass Navbar -->
  <header class="glass-nav sticky top-0 z-50 px-6 py-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-pink-500/30">
          ⚡
        </div>
        <span class="text-xl font-extrabold tracking-tight text-white">{brand}<span class="text-pink-500">.io</span></span>
      </div>
      <div class="flex items-center gap-4 text-xs font-semibold text-slate-300">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 256-Bit SSL Secured
        </span>
      </div>
    </div>
  </header>

  <!-- Auth Card Container -->
  <main class="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
    <div class="w-full max-w-md glass-card rounded-2xl p-8 shadow-2xl shadow-black/80">
      
      <!-- Tab Switcher -->
      <div class="flex rounded-xl bg-slate-900/80 p-1.5 border border-white/5 mb-8">
        <button id="tab-login" onclick="switchAuthTab('login')" class="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md">
          Sign In
        </button>
        <button id="tab-signup" onclick="switchAuthTab('signup')" class="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all text-slate-400 hover:text-white">
          Sign Up
        </button>
      </div>

      <!-- Sign In Form -->
      <div id="form-login">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-black text-white">Welcome Back</h2>
          <p class="text-xs text-slate-400 mt-1">Enter your credentials to access your account</p>
        </div>

        <!-- Social Sign-in Buttons -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <button type="button" class="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/10 hover:border-pink-500/50 bg-slate-900/60 text-xs font-bold text-slate-200 hover:bg-slate-800 transition">
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/></svg>
            Google
          </button>
          <button type="button" class="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/10 hover:border-pink-500/50 bg-slate-900/60 text-xs font-bold text-slate-200 hover:bg-slate-800 transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </button>
        </div>

        <div class="flex items-center gap-3 my-5">
          <div class="flex-grow h-px bg-white/10"></div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">or with email</span>
          <div class="flex-grow h-px bg-white/10"></div>
        </div>

        <form onsubmit="event.preventDefault(); alert('Sign In successful (Demo)');" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
            <input type="email" required placeholder="alex@company.com" class="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition">
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-bold text-slate-300">Password</label>
              <a href="#" class="text-xs font-semibold text-pink-400 hover:text-pink-300">Forgot?</a>
            </div>
            <div class="relative">
              <input id="login-pwd" type="password" required placeholder="••••••••••••" class="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition pr-10">
              <button type="button" onclick="togglePassword('login-pwd')" class="absolute right-3 top-3.5 text-slate-400 hover:text-white text-xs">👁️</button>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <input type="checkbox" id="remember" class="rounded accent-pink-500">
            <label for="remember" class="text-xs text-slate-400 select-none">Remember this device for 30 days</label>
          </div>

          <button type="submit" class="w-full py-3.5 rounded-xl gradient-btn font-extrabold text-sm text-white shadow-lg shadow-pink-500/25 hover:opacity-95 transition transform hover:scale-[1.01] active:scale-[0.99] mt-2">
            Sign In &rarr;
          </button>
        </form>
      </div>

      <!-- Sign Up Form (Hidden by default) -->
      <div id="form-signup" class="hidden">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-black text-white">Create Account</h2>
          <p class="text-xs text-slate-400 mt-1">Get started with your free 14-day pro trial</p>
        </div>

        <form onsubmit="event.preventDefault(); alert('Account created successfully (Demo)');" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
            <input type="text" required placeholder="Alex Mercer" class="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">Work Email</label>
            <input type="email" required placeholder="alex@company.com" class="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">Create Password</label>
            <div class="relative">
              <input id="signup-pwd" type="password" required placeholder="Minimum 8 characters" class="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition pr-10">
              <button type="button" onclick="togglePassword('signup-pwd')" class="absolute right-3 top-3.5 text-slate-400 hover:text-white text-xs">👁️</button>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <input type="checkbox" id="terms" required class="rounded accent-pink-500">
            <label for="terms" class="text-xs text-slate-400 select-none">I accept the Terms of Service & Privacy Policy</label>
          </div>

          <button type="submit" class="w-full py-3.5 rounded-xl gradient-btn font-extrabold text-sm text-white shadow-lg shadow-pink-500/25 hover:opacity-95 transition transform hover:scale-[1.01] active:scale-[0.99] mt-2">
            Create Account &rarr;
          </button>
        </form>
      </div>

    </div>
  </main>

  <!-- Footer -->
  <footer class="glass-nav py-4 px-6 text-center text-xs text-slate-500 relative z-10">
    &copy; 2026 {brand} Systems Inc. All rights reserved. &bull; Enterprise 2FA Guard Active
  </footer>

  <script>
    function switchAuthTab(tab) {{
      const loginForm = document.getElementById('form-login');
      const signupForm = document.getElementById('form-signup');
      const tabLogin = document.getElementById('tab-login');
      const tabSignup = document.getElementById('tab-signup');

      if (tab === 'login') {{
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        tabLogin.className = 'flex-1 py-2.5 rounded-lg text-sm font-bold transition-all bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md';
        tabSignup.className = 'flex-1 py-2.5 rounded-lg text-sm font-bold transition-all text-slate-400 hover:text-white';
      }} else {{
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        tabSignup.className = 'flex-1 py-2.5 rounded-lg text-sm font-bold transition-all bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md';
        tabLogin.className = 'flex-1 py-2.5 rounded-lg text-sm font-bold transition-all text-slate-400 hover:text-white';
      }}
    }}

    function togglePassword(id) {{
      const el = document.getElementById(id);
      el.type = el.type === 'password' ? 'text' : 'password';
    }}
  </script>
</body>
</html>"""
        return {
            "title": title,
            "description": desc,
            "filename": "AuthPortal.jsx" if framework == "react" else "index.html",
            "features": ["Dual-Tab Sign In & Sign Up", "Sticky Glass Navbar", "Social OAuth (Google & GitHub)", "Password Visibility Toggle", "Ambient Background Orbs"],
            "code": html_code,
            "preview_html": html_code
        }

    def _build_dashboard_page(self, brand: str, framework: str, style: str) -> Dict[str, Any]:
        title = f"{brand} Observability Dashboard"
        desc = "Modern real-time metrics dashboard with telemetry KPI cards, SVG charts, and audit activity table."
        html_code = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {{ font-family: 'Plus Jakarta Sans', sans-serif; background: #060813; color: #f8fafc; }}
    .glass {{ background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); }}
  </style>
</head>
<body class="min-h-screen flex selection:bg-pink-500 selection:text-white">
  <!-- Sidebar -->
  <aside class="w-64 border-r border-white/10 glass hidden lg:flex flex-col justify-between p-6">
    <div>
      <div class="flex items-center gap-3 mb-10">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center font-black text-white">⚡</div>
        <span class="text-xl font-extrabold text-white">{brand}<span class="text-pink-500">.ai</span></span>
      </div>
      <nav class="space-y-2">
        <a href="#" class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500/20 to-indigo-600/20 text-white font-bold border border-pink-500/30 text-sm">📊 Overview</a>
        <a href="#" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-semibold text-sm transition">⚡ Deployments</a>
        <a href="#" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-semibold text-sm transition">🛡️ Security Guard</a>
        <a href="#" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-semibold text-sm transition">⚙️ Cluster Settings</a>
      </nav>
    </div>
    <div class="glass p-4 rounded-xl border border-white/5">
      <div class="text-xs font-bold text-slate-400 uppercase mb-1">Global Health</div>
      <div class="text-sm font-extrabold text-emerald-400 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> 99.98% Operational
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 flex flex-col min-w-0">
    <!-- Topbar -->
    <header class="h-18 px-8 py-4 border-b border-white/10 glass flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-extrabold text-white">Cluster Telemetry</h1>
        <span class="px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold">Production v3.2</span>
      </div>
      <div class="flex items-center gap-4">
        <input type="text" placeholder="Search metrics, logs..." class="bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500">
        <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">AK</div>
      </div>
    </header>

    <!-- Dashboard Body -->
    <div class="p-8 space-y-8 flex-1 overflow-y-auto">
      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="glass p-6 rounded-2xl">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Invocations</div>
          <div class="text-3xl font-black text-white mb-2">1,428,902</div>
          <div class="text-xs font-bold text-emerald-400 flex items-center gap-1">&uarr; +14.8% vs last week</div>
        </div>
        <div class="glass p-6 rounded-2xl">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">P99 Latency</div>
          <div class="text-3xl font-black text-white mb-2">18.4ms</div>
          <div class="text-xs font-bold text-emerald-400 flex items-center gap-1">&darr; -3.2ms optimized</div>
        </div>
        <div class="glass p-6 rounded-2xl">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Error Budget</div>
          <div class="text-3xl font-black text-white mb-2">0.002%</div>
          <div class="text-xs font-bold text-slate-400">Within SLO limits</div>
        </div>
        <div class="glass p-6 rounded-2xl">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Nodes</div>
          <div class="text-3xl font-black text-white mb-2">24 / 24</div>
          <div class="text-xs font-bold text-emerald-400">All regions healthy</div>
        </div>
      </div>

      <!-- Activity Table -->
      <div class="glass rounded-2xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-white">Recent Cluster Deployments</h2>
          <button class="text-xs font-bold text-pink-400 hover:text-pink-300">View All Logs &rarr;</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="border-b border-white/10 text-slate-400 uppercase tracking-wider">
              <tr>
                <th class="py-3 px-4">Service</th>
                <th class="py-3 px-4">Commit</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">Latency</th>
                <th class="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 font-medium text-slate-200">
              <tr>
                <td class="py-3.5 px-4 font-bold text-white">auth-gateway-edge</td>
                <td class="py-3.5 px-4 font-mono text-pink-400">#4f981c</td>
                <td class="py-3.5 px-4"><span class="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold">Live</span></td>
                <td class="py-3.5 px-4">12ms</td>
                <td class="py-3.5 px-4 text-slate-400">2 mins ago</td>
              </tr>
              <tr>
                <td class="py-3.5 px-4 font-bold text-white">ast-analyzer-worker</td>
                <td class="py-3.5 px-4 font-mono text-pink-400">#8a213e</td>
                <td class="py-3.5 px-4"><span class="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold">Live</span></td>
                <td class="py-3.5 px-4">24ms</td>
                <td class="py-3.5 px-4 text-slate-400">14 mins ago</td>
              </tr>
              <tr>
                <td class="py-3.5 px-4 font-bold text-white">otp-relay-smtp</td>
                <td class="py-3.5 px-4 font-mono text-pink-400">#9c011a</td>
                <td class="py-3.5 px-4"><span class="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold">Live</span></td>
                <td class="py-3.5 px-4">16ms</td>
                <td class="py-3.5 px-4 text-slate-400">32 mins ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</body>
</html>"""
        return {
            "title": title,
            "description": desc,
            "filename": "Dashboard.jsx" if framework == "react" else "index.html",
            "features": ["Sidebar Navigation", "4 Real-Time KPI Metric Cards", "Live Cluster Status Indicators", "Audit Deployment Table", "P99 Telemetry Metrics"],
            "code": html_code,
            "preview_html": html_code
        }

    def _build_pricing_page(self, brand: str, framework: str, style: str) -> Dict[str, Any]:
        title = f"{brand} Transparent Pricing"
        desc = "Interactive pricing table with billing frequency switch, tiered feature matrix, and FAQ accordion."
        html_code = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {{ font-family: 'Plus Jakarta Sans', sans-serif; background: #070913; color: #f8fafc; }}
    .glass {{ background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); }}
    .popular-glow {{ box-shadow: 0 0 50px -10px rgba(236, 72, 153, 0.4); border-color: rgba(236, 72, 153, 0.5); }}
  </style>
</head>
<body class="min-h-screen py-16 px-6 max-w-6xl mx-auto flex flex-col justify-center selection:bg-pink-500 selection:text-white">
  
  <div class="text-center max-w-2xl mx-auto mb-12">
    <div class="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-wider mb-4">
      Flexible Plans for Every Team
    </div>
    <h1 class="text-4xl md:text-5xl font-black text-white mb-4">Predictable Pricing, Zero Surprises</h1>
    <p class="text-slate-400 text-base">Scale effortlessly from side project prototypes to high-concurrency production.</p>
  </div>

  <!-- Pricing Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
    <!-- Starter -->
    <div class="glass p-8 rounded-2xl flex flex-col justify-between">
      <div>
        <div class="text-lg font-bold text-white mb-2">Hobby Starter</div>
        <p class="text-xs text-slate-400 mb-6">For individual developers testing features</p>
        <div class="text-4xl font-black text-white mb-6">$0<span class="text-xs font-semibold text-slate-400"> / forever</span></div>
        <ul class="space-y-3 text-xs text-slate-300 font-medium mb-8">
          <li class="flex items-center gap-2 text-emerald-400">✓ Up to 3 single pages / month</li>
          <li class="flex items-center gap-2 text-emerald-400">✓ Standard Gemini Flash models</li>
          <li class="flex items-center gap-2 text-emerald-400">✓ Community support</li>
        </ul>
      </div>
      <button class="w-full py-3 rounded-xl glass border border-white/10 text-xs font-bold text-white hover:bg-white/5 transition">
        Start Free
      </button>
    </div>

    <!-- Pro (Popular) -->
    <div class="glass p-8 rounded-2xl popular-glow flex flex-col justify-between relative bg-gradient-to-b from-slate-900/90 to-pink-950/20">
      <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-pink-600 text-white font-black text-[10px] uppercase tracking-wider shadow-lg">
        Most Popular
      </div>
      <div>
        <div class="text-lg font-bold text-white mb-2">Professional</div>
        <p class="text-xs text-slate-400 mb-6">For teams deploying high-velocity apps</p>
        <div class="text-4xl font-black text-white mb-6">$29<span class="text-xs font-semibold text-slate-400"> / seat / month</span></div>
        <ul class="space-y-3 text-xs text-slate-200 font-medium mb-8">
          <li class="flex items-center gap-2 text-emerald-400">✓ Unlimited full projects & single pages</li>
          <li class="flex items-center gap-2 text-emerald-400">✓ Dedicated low-latency AI tier</li>
          <li class="flex items-center gap-2 text-emerald-400">✓ Live preview & ZIP downloads</li>
          <li class="flex items-center gap-2 text-emerald-400">✓ 2FA identity challenge integration</li>
        </ul>
      </div>
      <button class="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 font-extrabold text-xs text-white shadow-lg shadow-pink-500/25 hover:opacity-95 transition">
        Upgrade to Pro &rarr;
      </button>
    </div>

    <!-- Enterprise -->
    <div class="glass p-8 rounded-2xl flex flex-col justify-between">
      <div>
        <div class="text-lg font-bold text-white mb-2">Custom Enterprise</div>
        <p class="text-xs text-slate-400 mb-6">For scale-ups with strict compliance</p>
        <div class="text-4xl font-black text-white mb-6">$99<span class="text-xs font-semibold text-slate-400"> / month</span></div>
        <ul class="space-y-3 text-xs text-slate-300 font-medium mb-8">
          <li class="flex items-center gap-2 text-emerald-400">✓ Custom VPC & on-premise execution</li>
          <li class="flex items-center gap-2 text-emerald-400">✓ 99.99% uptime SLA</li>
          <li class="flex items-center gap-2 text-emerald-400">✓ Dedicated Slack channel & architect</li>
        </ul>
      </div>
      <button class="w-full py-3 rounded-xl glass border border-white/10 text-xs font-bold text-white hover:bg-white/5 transition">
        Talk to Sales
      </button>
    </div>
  </div>

  <div class="text-center text-xs text-slate-500">
    All transactions are encrypted with 256-bit AES. Cancel anytime with 1 click.
  </div>
</body>
</html>"""
        return {
            "title": title,
            "description": desc,
            "filename": "Pricing.jsx" if framework == "react" else "index.html",
            "features": ["3 Tier Pricing Cards", "Highlighted Most Popular Tier", "Feature Comparison Checkmarks", "High-Conversion CTA"],
            "code": html_code,
            "preview_html": html_code
        }

    def _build_ecommerce_page(self, brand: str, framework: str, style: str) -> Dict[str, Any]:
        title = f"{brand} Storefront"
        desc = "Modern e-commerce product catalog with interactive filter pills, star ratings, and shopping cart counter."
        html_code = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {{ font-family: 'Plus Jakarta Sans', sans-serif; background: #070913; color: #f8fafc; }}
    .glass {{ background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); }}
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between selection:bg-pink-500 selection:text-white">
  <!-- Navbar -->
  <header class="border-b border-white/10 glass sticky top-0 z-50 px-8 py-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center font-black text-white">🛍️</div>
        <span class="text-xl font-extrabold text-white">{brand}<span class="text-pink-500">Store</span></span>
      </div>
      <div class="flex items-center gap-4">
        <button onclick="alert('Cart opened (Demo)')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-white hover:border-pink-500/50">
          <span>🛒 Cart</span>
          <span id="cart-count" class="w-5 h-5 rounded-full bg-pink-600 flex items-center justify-center text-[10px]">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Products Grid -->
  <main class="max-w-6xl mx-auto px-6 py-12 flex-grow">
    <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-black text-white">Engineered Hardware & Gear</h1>
        <p class="text-xs text-slate-400 mt-1">High-performance tools for engineers and creators</p>
      </div>
      <div class="flex items-center gap-2 text-xs">
        <button class="px-3.5 py-1.5 rounded-full bg-pink-600 text-white font-bold">All Items</button>
        <button class="px-3.5 py-1.5 rounded-full glass text-slate-400 hover:text-white">Keyboards</button>
        <button class="px-3.5 py-1.5 rounded-full glass text-slate-400 hover:text-white">Audio</button>
        <button class="px-3.5 py-1.5 rounded-full glass text-slate-400 hover:text-white">Accessories</button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="glass rounded-2xl overflow-hidden p-5 flex flex-col justify-between">
        <div class="h-44 bg-slate-900/80 rounded-xl mb-4 flex items-center justify-center text-4xl">⌨️</div>
        <div>
          <div class="text-xs text-pink-400 font-bold uppercase tracking-wider mb-1">Peripherals</div>
          <h3 class="text-base font-extrabold text-white mb-1">CyberDeck Pro Ortholinear</h3>
          <div class="text-xs text-amber-400 mb-4">★★★★★ <span class="text-slate-400">(48 reviews)</span></div>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-white/5">
          <span class="text-xl font-black text-white">$189</span>
          <button onclick="addToCart()" class="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-600 text-xs font-bold text-white hover:opacity-90">Add to Cart</button>
        </div>
      </div>

      <div class="glass rounded-2xl overflow-hidden p-5 flex flex-col justify-between">
        <div class="h-44 bg-slate-900/80 rounded-xl mb-4 flex items-center justify-center text-4xl">🎧</div>
        <div>
          <div class="text-xs text-pink-400 font-bold uppercase tracking-wider mb-1">Acoustics</div>
          <h3 class="text-base font-extrabold text-white mb-1">Neural ANC Studio Monitor</h3>
          <div class="text-xs text-amber-400 mb-4">★★★★★ <span class="text-slate-400">(92 reviews)</span></div>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-white/5">
          <span class="text-xl font-black text-white">$249</span>
          <button onclick="addToCart()" class="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-600 text-xs font-bold text-white hover:opacity-90">Add to Cart</button>
        </div>
      </div>

      <div class="glass rounded-2xl overflow-hidden p-5 flex flex-col justify-between">
        <div class="h-44 bg-slate-900/80 rounded-xl mb-4 flex items-center justify-center text-4xl">⚡</div>
        <div>
          <div class="text-xs text-pink-400 font-bold uppercase tracking-wider mb-1">Power</div>
          <h3 class="text-base font-extrabold text-white mb-1">GaN 140W Rapid Dock</h3>
          <div class="text-xs text-amber-400 mb-4">★★★★☆ <span class="text-slate-400">(31 reviews)</span></div>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-white/5">
          <span class="text-xl font-black text-white">$79</span>
          <button onclick="addToCart()" class="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-600 text-xs font-bold text-white hover:opacity-90">Add to Cart</button>
        </div>
      </div>
    </div>
  </main>

  <footer class="border-t border-white/10 glass py-6 text-center text-xs text-slate-500">
    &copy; 2026 {brand} Commerce. Worldwide Express Shipping Available.
  </footer>

  <script>
    let count = 0;
    function addToCart() {{
      count++;
      document.getElementById('cart-count').innerText = count;
    }}
  </script>
</body>
</html>"""
        return {
            "title": title,
            "description": desc,
            "filename": "Storefront.jsx" if framework == "react" else "index.html",
            "features": ["Product Cards Grid", "Interactive Cart Counter", "Category Filter Pills", "Star Rating Breakdown"],
            "code": html_code,
            "preview_html": html_code
        }

    def _build_portfolio_page(self, brand: str, framework: str, style: str) -> Dict[str, Any]:
        title = f"{brand} Engineering Portfolio"
        desc = "Sleek developer portfolio with project showcases, interactive tech stack tags, and contact modal."
        html_code = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {{ font-family: 'Plus Jakarta Sans', sans-serif; background: #070913; color: #f8fafc; }}
    .glass {{ background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); }}
  </style>
</head>
<body class="min-h-screen py-16 px-6 max-w-4xl mx-auto selection:bg-pink-500 selection:text-white">
  <!-- Hero -->
  <div class="glass p-8 md:p-12 rounded-3xl mb-12 relative overflow-hidden">
    <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold w-fit mb-6">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Available for Select Contracts
    </div>
    <h1 class="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
      Designing &amp; Scaling <span class="bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">Intelligent Systems.</span>
    </h1>
    <p class="text-slate-400 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
      Full-Stack &amp; AI Systems Engineer specializing in zero-latency distributed architectures, AST code analyzers, and intuitive high-velocity interfaces.
    </p>
    <div class="flex flex-wrap gap-2 text-xs font-mono font-semibold">
      <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-pink-400">React 19</span>
      <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-indigo-400">FastAPI</span>
      <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-emerald-400">TypeScript</span>
      <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-cyan-400">Docker</span>
      <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-amber-400">Google Gemini</span>
    </div>
  </div>

  <!-- Featured Projects -->
  <h2 class="text-2xl font-black text-white mb-6">Featured Deployments</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
    <div class="glass p-6 rounded-2xl">
      <div class="text-xs text-pink-400 font-bold uppercase mb-2">Static Analysis Engine</div>
      <h3 class="text-lg font-bold text-white mb-2">CodeLens AST Doctor</h3>
      <p class="text-xs text-slate-400 leading-relaxed mb-4">High-throughput code inspection platform with AST visualization and automated fix suggestions.</p>
      <div class="flex items-center gap-3 text-xs font-bold">
        <a href="#" class="text-white hover:text-pink-400">Live Demo &rarr;</a>
        <a href="#" class="text-slate-500 hover:text-slate-300">GitHub</a>
      </div>
    </div>

    <div class="glass p-6 rounded-2xl">
      <div class="text-xs text-indigo-400 font-bold uppercase mb-2">Security Relay</div>
      <h3 class="text-lg font-bold text-white mb-2">Cryptographic 2FA Guard</h3>
      <p class="text-xs text-slate-400 leading-relaxed mb-4">Zero-leak multi-factor authentication with SMTP TLS relays and single-use signed tokens.</p>
      <div class="flex items-center gap-3 text-xs font-bold">
        <a href="#" class="text-white hover:text-pink-400">Live Demo &rarr;</a>
        <a href="#" class="text-slate-500 hover:text-slate-300">GitHub</a>
      </div>
    </div>
  </div>

  <footer class="text-center text-xs text-slate-500 border-t border-white/10 pt-8">
    &copy; 2026 {brand}. Open to collaborative research and development.
  </footer>
</body>
</html>"""
        return {
            "title": title,
            "description": desc,
            "filename": "Portfolio.jsx" if framework == "react" else "index.html",
            "features": ["Personal Hero Statement", "Interactive Tech Stack Badges", "Project Showcase Cards", "Clean Minimal Aesthetic"],
            "code": html_code,
            "preview_html": html_code
        }

    def _build_landing_page(self, brand: str, framework: str, style: str) -> Dict[str, Any]:
        title = f"{brand} Cloud Platform"
        desc = "Modern SaaS landing page with sticky glass navbar, hero showcase, and 3-column feature bento cards."
        html_code = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body {{ font-family: 'Plus Jakarta Sans', sans-serif; background: #070913; color: #f8fafc; }}
    .gradient-text {{ background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }}
    .glass {{ background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); }}
    .glow {{ box-shadow: 0 0 40px -10px rgba(99, 102, 241, 0.3); }}
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between selection:bg-pink-500 selection:text-white">
  <!-- Navbar -->
  <header class="border-b border-white/10 glass sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-pink-500/30">
          ⚡
        </div>
        <span class="text-xl font-extrabold tracking-tight text-white">{brand}<span class="text-pink-500">.ai</span></span>
      </div>
      <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
        <a href="#features" class="hover:text-white transition">Architecture</a>
        <a href="#features" class="hover:text-white transition">Observability</a>
        <a href="#features" class="hover:text-white transition">Pricing</a>
      </nav>
      <div class="flex items-center gap-4">
        <button class="text-sm font-bold text-slate-300 hover:text-white px-4 py-2">Sign In</button>
        <button class="text-sm font-bold bg-gradient-to-r from-pink-500 to-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-pink-500/25 hover:opacity-95 transition">Get Started</button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="flex-grow flex items-center justify-center px-6 py-20 relative overflow-hidden">
    <div class="max-w-5xl mx-auto text-center relative z-10">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-pink-500/30 text-pink-400 text-xs font-bold tracking-wide uppercase mb-8">
        <span>✨ NEXT-GEN ARCHITECTURE ENGINE</span>
      </div>

      <h1 class="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight md:leading-none mb-6">
        Intelligent Systems: <span class="gradient-text">Engineered for Velocity.</span>
      </h1>

      <p class="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
        Build, scaffold, and inspect full-stack applications with AI precision, instant previews, and zero boilerplate friction.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <button class="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 font-extrabold text-white text-base shadow-xl shadow-pink-500/30 hover:scale-105 transition transform">
          Launch Workspace &rarr;
        </button>
        <button class="w-full sm:w-auto px-8 py-4 rounded-xl glass border border-white/10 font-bold text-slate-300 hover:text-white hover:bg-white/5 transition">
          View Documentation
        </button>
      </div>

      <!-- Feature Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div class="glass p-6 rounded-2xl glow">
          <div class="text-2xl mb-3">⚡</div>
          <h3 class="font-extrabold text-lg text-white mb-2">Real-Time Sync</h3>
          <p class="text-sm text-slate-400">Zero-latency state distribution with optimistic client-side execution.</p>
        </div>
        <div class="glass p-6 rounded-2xl glow">
          <div class="text-2xl mb-3">🛡️</div>
          <h3 class="font-extrabold text-lg text-white mb-2">Cryptographic Guard</h3>
          <p class="text-sm text-slate-400">2FA OTP identity challenge and single-use signed token verification.</p>
        </div>
        <div class="glass p-6 rounded-2xl glow">
          <div class="text-2xl mb-3">📊</div>
          <h3 class="font-extrabold text-lg text-white mb-2">Neural CodeDoctor</h3>
          <p class="text-sm text-slate-400">AI static AST code inspection formulated with high-speed Gemini Flash models.</p>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-white/10 glass py-8">
    <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
      <p>&copy; 2026 {brand}. All rights reserved.</p>
      <p>Powered by CodeLens AI Scaffold Engine</p>
    </div>
  </footer>
</body>
</html>"""
        return {
            "title": title,
            "description": desc,
            "filename": "LandingPage.jsx" if framework == "react" else "index.html",
            "features": ["Sticky Glass Header", "Bento Feature Grid", "High-Converting CTA", "Dark Mode Glassmorphism"],
            "code": html_code,
            "preview_html": html_code
        }

    def generate_full_project(self, prompt: str, name: str, stack: str, database: str = "postgres") -> Dict[str, str]:
        """
        Uses Gemini to generate tailored, domain-specific code files based on the user's idea
        and merges them into the full project repository.
        """
        system_instruction = f"""
You are CodeLens AI Senior Solution Architect.
The user wants to generate a complete project named "{name}" using stack "{stack}" and database "{database}".
Idea/Specification: "{prompt}"

Generate 3 to 5 domain-specific core code files tailored to their exact idea.
Return your answer strictly as a JSON object mapping relative file paths to their complete, working code content:
{{
  "src/models/Item.java": "complete code here",
  "src/controllers/ItemController.java": "complete code here",
  "README.md": "# Project Title\\n\\nDetailed setup instructions..."
}}
Do NOT wrap the response in markdown blocks. Return ONLY the raw JSON string.
"""
        response_text = self._call_gemini(system_instruction, prompt)
        if response_text:
            cleaned = response_text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            try:
                parsed = json.loads(cleaned.strip())
                if isinstance(parsed, dict):
                    return parsed
            except Exception as e:
                print(f"[JSON PARSE ERROR] {e}")

        # Default domain enhancement
        return {
            "README.md": f"# {name}\n\nGenerated by CodeLens AI based on your specification:\n> {prompt}\n\n## Tech Stack\n- Framework: {stack}\n- Database: {database}\n\n## Getting Started\nRun `npm install` or `mvn clean install` to start development.\n"
        }
