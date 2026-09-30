# CodeLens AI — AI-Powered Code Analysis & Intelligent Code Improvement Platform

> **Your code. Understood.**

CodeLens AI is a modern developer platform designed to understand software repositories and competitive programming code. It combines **Static AST Analysis + AI Reasoning + Step-by-Step Iteration Tracing + Docker Sandbox Validation**.

---

## 🚀 Key Features

### 1. DSA & Competitive Programming Code Analyzer
* **Supported Languages**: Java, Python, C, C++
* **Target Platforms**: LeetCode, CodeChef, MentorPick, HackerRank
* **Step-by-Step Code Iteration Trace**: Traces loop counters, variable mutations, and condition evaluations step-by-step.
* **Exact Point of Failure**: Pinpoints the line number, reason for failure (TLE, Off-by-one, 32-bit integer overflow, null dereference), and breaking test case.
* **Correct Logic & Intuition**: Explains the optimal algorithmic approach (e.g. One-Pass Hash Map, Two Pointers, Safe Midpoint Binary Search) with time and space complexity comparisons ($O(N^2) \to O(N)$).
* **Runnable Verified Solution**: Generates clean, ready-to-submit code in the same language.

### 2. Multi-Theme Engine & Settings
* **Dark Professional** *(Default)*: Obsidian slate (`#090d16`) with electric indigo (`#6366f1`) and emerald badges.
* **Light Clean Studio**: Crisp white, high-contrast studio mode for well-lit workspaces.
* **Warm Amber & Sepia**: Espresso wood (`#15110d`) and terracotta to eliminate blue-light eye strain.
* **Cyber Midnight**: Synthwave fuchsia, violet, and pitch black.
* **Nordic Frost**: Arctic navy, ice blue, and calm polar tones.
* **Granular Settings**: Theme customization, font sizes, line numbers, analysis strictness, sound toggles, and data export.

### 3. Full Project Scaffolding Generator
* **Templates**:
  * Spring Boot 3 + Java 17 (REST API, JPA Entities, Maven)
  * React 19 + Vite (Modern SPA, Components)
  * Python 3 + FastAPI (Async endpoints, Pydantic)
  * Node.js + Express (REST routes, Dotenv)
  * Modern C++20 (Modular CMake structure)
* **Features**: Dockerfile, GitHub Actions CI/CD pipeline, and OpenAPI/Swagger documentation.
* **Actions**: Download as real `.ZIP` archive or send directly to CodeLens Analyzer.

### 4. Sliding History Window
* Slide-out drawer on the left side of the screen.
* Persists real code trace history and project scan results.
* Search filter, line failure tags, and 1-click re-inspection.

### 5. Authentication & User Profiles
* Built-in Sign In & Sign Up with local session management.
* Fast 1-click demo login.
* Prominent user badge and Log Out controls.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router 7, Lucide Icons, JSZip |
| **Styling** | Dynamic CSS Variables, Glassmorphism, Multi-Theme System |
| **Code Analysis** | AST Parsers, Heuristic Rule Engines, Iteration Simulator |
| **Scaffolding** | Client-side ZIP packaging via JSZip |

---

## 💻 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Akhil1845/AI_CODE_ANALYZER.git
cd AI_CODE_ANALYZER
```

### 2. Install Dependencies & Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📄 License
MIT License. Built for developers with high standards.
