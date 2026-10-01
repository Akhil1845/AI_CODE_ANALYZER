import os
import json
import requests
import re
from typing import Dict, Any, List, Optional
from .. import config

class ProjectAIService:
    """
    AI Project & Single Page Generator powered by Google Gemini 3.5 Flash.
    Generates production-grade full projects and standalone single-page components
    from natural language user prompts and ideas.
    """

    def __init__(self):
        self.api_key = config.GEMINI_API_KEY
        self.model = config.GEMINI_MODEL or "models/gemini-3.5-flash"

    def _call_gemini(self, system_instruction: str, user_prompt: str, timeout: int = 25) -> Optional[str]:
        if not self.api_key:
            return None
        url = f"https://generativelanguage.googleapis.com/v1beta/{self.model}:generateContent?key={self.api_key}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"{system_instruction}\n\nUSER PROMPT / IDEA:\n{user_prompt}"}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.4,
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
                print(f"[GEMINI WARNING] Status {res.status_code}: {res.text[:200]}")
        except Exception as e:
            print(f"[GEMINI ERROR] Request failed: {e}")
        return None

    def generate_single_page(self, prompt: str, framework: str = "react", style: str = "modern-dark") -> Dict[str, Any]:
        """
        Generates a standalone, beautifully designed single-page application or component.
        Returns live preview HTML and full source code.
        """
        system_instruction = f"""
You are CodeLens AI Senior Frontend Architect.
Generate a complete, modern, gorgeous, production-grade standalone single-page UI based on the user's idea.
Target framework: {framework} (if React, provide clean React JSX; if HTML, provide modern HTML5).
Design aesthetic: {style} (Dark mode, sleek typography, gradients, glassmorphism, responsive).

Return your response strictly as a JSON object with this exact schema:
{{
  "title": "Descriptive Page Title (e.g. AI SaaS Landing Page)",
  "description": "Brief 1-sentence summary of what was generated",
  "filename": "e.g. LandingPage.jsx or index.html",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "code": "Full, complete, beautifully indented source code for the page or component",
  "preview_html": "A self-contained, fully working HTML document with Tailwind CSS CDN (<script src='https://cdn.tailwindcss.com'></script>), FontAwesome or Lucide icons, responsive layout, and beautiful styling so it can be previewed directly inside an iframe."
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
                return parsed
            except Exception as e:
                print(f"[JSON PARSE ERROR] {e}")

        # Fallback dynamic generator if AI is unavailable or prompt is basic
        return self._generate_fallback_single_page(prompt, framework, style)

    def _generate_fallback_single_page(self, prompt: str, framework: str, style: str) -> Dict[str, Any]:
        clean_title = prompt.strip().title() if prompt else "Modern Web Application"
        html_code = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{clean_title}</title>
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
        <span class="text-xl font-extrabold tracking-tight text-white">{clean_title.split(' ')[0]}<span class="text-pink-500">.ai</span></span>
      </div>
      <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
        <a href="#features" class="hover:text-white transition">Features</a>
        <a href="#analytics" class="hover:text-white transition">Observability</a>
        <a href="#pricing" class="hover:text-white transition">Pricing</a>
      </nav>
      <div class="flex items-center gap-4">
        <button class="text-sm font-bold text-slate-300 hover:text-white px-4 py-2">Sign In</button>
        <button class="text-sm font-bold bg-gradient-to-r from-pink-500 to-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-pink-500/25 hover:opacity-95 transition">Get Started</button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="flex-grow flex items-center justify-center px-6 py-20 relative overflow-hidden">
    <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none"></div>
    <div class="absolute -bottom-40 right-10 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>

    <div class="max-w-5xl mx-auto text-center relative z-10">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-pink-500/30 text-pink-400 text-xs font-bold tracking-wide uppercase mb-8">
        <span>✨ NEXT-GEN ARCHITECTURE</span>
      </div>

      <h1 class="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight md:leading-none mb-6">
        {clean_title}: <span class="gradient-text">Engineered for Velocity.</span>
      </h1>

      <p class="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
        {prompt or "High-performance interface generated seamlessly by CodeLens AI with responsive design and modern UX standards."}
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
          <p class="text-sm text-slate-400">AI static AST code inspection formulated with Google Gemini 3.5.</p>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-white/10 glass py-8">
    <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
      <p>&copy; 2026 {clean_title}. All rights reserved.</p>
      <p>Generated by CodeLens AI Scaffold Engine</p>
    </div>
  </footer>
</body>
</html>"""

        return {
            "title": clean_title,
            "description": f"Standalone responsive {clean_title} with dark mode and glassmorphism styling.",
            "filename": "index.html" if framework == "html" else f"{clean_title.replace(' ', '')}.jsx",
            "features": ["Responsive Layout", "Tailwind CSS Integration", "Dark Mode Glassmorphism", "Hero + Feature Cards"],
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
