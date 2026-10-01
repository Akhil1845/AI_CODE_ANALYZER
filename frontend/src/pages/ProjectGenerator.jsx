import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Box, 
  Download, 
  FileCode, 
  Check, 
  Sparkles, 
  FolderTree, 
  ArrowRight, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Play,
  Copy,
  Layout,
  Globe,
  Palette,
  Wand2,
  RefreshCw,
  Eye,
  Code2,
  Monitor,
  Tablet,
  Smartphone,
  CheckCheck,
  ChevronRight,
  Database,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { projectGenerator } from '../services/projectGenerator';
import { api } from '../services/api';

const STACKS = [
  { id: 'spring-boot', name: 'Spring Boot 3 + Java 17', badge: 'Java Enterprise', desc: 'Robust Spring Data JPA & Maven REST API architecture' },
  { id: 'react', name: 'React 19 + Vite', badge: 'Modern Frontend', desc: 'High-speed SPA with Tailwind CSS and modular component tree' },
  { id: 'fastapi', name: 'Python 3 + FastAPI', badge: 'Async Python', desc: 'Asynchronous REST microservice with Pydantic validation' },
  { id: 'node', name: 'Node.js + Express', badge: 'Full-Stack JS', desc: 'Lightweight RESTful API service with CORS and environment configs' },
  { id: 'cpp', name: 'Modern C++20 (CMake)', badge: 'System C++', desc: 'Modular CMake project with structured headers and unit testing' }
];

const SINGLE_PAGE_FRAMEWORKS = [
  { id: 'react', name: 'React 19 (JSX)', desc: 'Modern component with hooks & state' },
  { id: 'html', name: 'HTML5 + Tailwind CSS', desc: 'Self-contained zero-config webpage' },
  { id: 'vue', name: 'Vue 3 Single File', desc: 'Composition API component' }
];

const STYLES = [
  { id: 'modern-dark', name: 'Dark Glassmorphism', desc: 'Deep cosmic backdrop with glowing neon glass cards' },
  { id: 'clean-saas', name: 'Modern SaaS Minimal', desc: 'High-contrast typography with clean borders & metrics' },
  { id: 'cyberpunk', name: 'Cyberpunk Grid', desc: 'Electric pink & cyan accents with terminal aesthetic' }
];

const PROMPT_INSPIRATIONS = [
  { label: '✨ AI SaaS Landing Page', prompt: 'Create a high-converting, dark-themed SaaS landing page for an AI code observability platform. Include a sticky navbar, interactive hero with code preview, 3 feature cards, pricing tiers (Starter, Pro, Enterprise), and FAQ accordion.' },
  { label: '📊 Crypto Portfolio Dashboard', prompt: 'Build a dark glassmorphic cryptocurrency analytics dashboard with a portfolio balance card, live BTC/ETH price tickers with 24h change indicators, a recent transaction list, and quick buy/sell action buttons.' },
  { label: '🛍️ E-Commerce Product Showcase', prompt: 'Generate a modern e-commerce product detail page for premium mechanical keyboards. Include an interactive image gallery, color variant selector, stock status, reviews breakdown, and an animated Add to Cart drawer.' },
  { label: '🔐 Glassmorphic Auth Portal', prompt: 'Build a modern dual-tab authentication screen (Sign In & Sign Up) with floating ambient background orbs, social login buttons (Google & GitHub), password strength meter, and terms agreement toggle.' },
  { label: '💼 Developer Portfolio', prompt: 'Create an ultra-sleek developer portfolio for a Full-Stack & AI Engineer. Features an animated hero introduction, interactive tech stack tags, project showcase cards with github links, and a contact form.' }
];

export default function ProjectGenerator() {
  const navigate = useNavigate();

  // Mode: 'single' (Single Page / Component) or 'project' (Full Project Repository)
  const [genMode, setGenMode] = useState('single');

  // Common Prompt State
  const [prompt, setPrompt] = useState('Create a high-converting, dark-themed SaaS landing page for an AI code observability platform with sticky navbar, hero section, 3 feature cards, pricing tiers, and FAQ accordion.');

  // Single Page Configs
  const [singleFramework, setSingleFramework] = useState('react');
  const [singleStyle, setSingleStyle] = useState('modern-dark');
  const [previewTab, setPreviewTab] = useState('preview'); // 'preview' or 'code'
  const [viewportMode, setViewportMode] = useState('desktop'); // 'desktop', 'tablet', 'mobile'

  // Full Project Configs
  const [name, setName] = useState('codelens-service');
  const [stack, setStack] = useState('react');
  const [database, setDatabase] = useState('postgres');
  const [includeDocker, setIncludeDocker] = useState(true);
  const [includeCi, setIncludeCi] = useState(true);
  const [includeSwagger, setIncludeSwagger] = useState(true);

  // Results & Loading States
  const [generating, setGenerating] = useState(false);
  const [genStatusText, setGenStatusText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Single Page Result
  const [singlePageResult, setSinglePageResult] = useState(null);

  // Full Project Files Map
  const [projectFiles, setProjectFiles] = useState(() => projectGenerator.generateFiles({
    name: 'codelens-service',
    stack: 'react',
    database: 'postgres',
    includeDocker: true,
    includeCi: true,
    includeSwagger: true
  }));

  const fileKeys = Object.keys(projectFiles);
  const activeFile = selectedFile && projectFiles[selectedFile] ? selectedFile : fileKeys[0];

  // Auto-generate fallback single page on initial load if null
  React.useEffect(() => {
    if (!singlePageResult) {
      const initial = projectGenerator.generateAISinglePage
        ? null
        : null;
      // Load default starter single page
      handleGenerateSinglePage(false);
    }
  }, []);

  // Handle AI Single Page Generation
  const handleGenerateSinglePage = async (withAI = true) => {
    setGenerating(true);
    setGenStatusText('1. Formulating component architecture...');
    try {
      if (withAI) {
        setTimeout(() => setGenStatusText('2. Synthesizing responsive styles & layout...'), 1200);
        setTimeout(() => setGenStatusText('3. Finalizing interactive UI sandbox preview...'), 2400);
        const res = await projectGenerator.generateAISinglePage(prompt, singleFramework, singleStyle);
        setSinglePageResult(res);
      } else {
        // Fallback instant preview
        setSinglePageResult({
          title: 'CodeLens AI SaaS Landing Page',
          description: 'High-converting dark glassmorphic landing page with hero, features, and pricing.',
          filename: singleFramework === 'html' ? 'index.html' : 'LandingPage.jsx',
          features: ['Sticky Glass Header', 'Dynamic Hero Section', '3-Column Metric Cards', 'Pricing Tiers'],
          code: `import React, { useState } from 'react';\n\nexport default function LandingPage() {\n  return (\n    <div className="min-h-screen bg-[#070913] text-white flex flex-col justify-between">\n      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between backdrop-blur-md">\n        <div className="flex items-center gap-3">\n          <div className="w-9 h-9 rounded-lg bg-pink-500 flex items-center justify-center font-bold">⚡</div>\n          <span className="font-extrabold text-lg">CodeLens<span className="text-pink-500">.ai</span></span>\n        </div>\n        <button className="bg-pink-600 px-5 py-2 rounded-lg font-bold hover:bg-pink-500 transition">Get Started</button>\n      </header>\n      <main className="max-w-5xl mx-auto px-6 py-20 text-center">\n        <h1 className="text-6xl font-black mb-6">Build Faster with <span className="text-pink-500">Neural Precision</span></h1>\n        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">Scaffold full-stack repositories and standalone interfaces with AI acceleration.</p>\n        <button className="bg-gradient-to-r from-pink-500 to-indigo-600 px-8 py-4 rounded-xl font-extrabold text-lg shadow-xl shadow-pink-500/25">Launch Studio &rarr;</button>\n      </main>\n      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">\n        © 2026 CodeLens AI. All rights reserved.\n      </footer>\n    </div>\n  );\n}`,
          preview_html: `<!DOCTYPE html><html><head><meta charset="utf-8"><script src="https://cdn.tailwindcss.com"></script><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;900&display=swap" rel="stylesheet"><style>body{font-family:'Plus Jakarta Sans',sans-serif;background:#070913;color:#fff;}.glass{background:rgba(17,24,39,0.7);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.08);}</style></head><body class="min-h-screen flex flex-col justify-between"><header class="border-b border-white/10 glass sticky top-0 px-8 py-5 flex items-center justify-between z-50"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center font-black shadow-lg shadow-pink-500/30">⚡</div><span class="font-extrabold text-xl">CodeLens<span class="text-pink-500">.ai</span></span></div><div class="flex items-center gap-4"><button class="text-sm font-bold text-slate-300 hover:text-white px-3 py-1.5">Sign In</button><button class="text-sm font-bold bg-gradient-to-r from-pink-500 to-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-pink-500/25 hover:opacity-95 transition">Get Started</button></div></header><main class="max-w-5xl mx-auto px-6 py-20 text-center"><div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-pink-500/30 text-pink-400 text-xs font-bold uppercase mb-8">✨ INTELLIGENT COMPONENT ENGINE</div><h1 class="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">Build Faster with <span class="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Neural Velocity.</span></h1><p class="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">Scaffold full-stack repositories and standalone interfaces with AI acceleration in seconds.</p><button class="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 font-extrabold text-white text-base shadow-xl shadow-pink-500/30 hover:scale-105 transition transform">Launch Workspace &rarr;</button><div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-16"><div class="glass p-6 rounded-2xl"><div class="text-2xl mb-3">⚡</div><h3 class="font-extrabold text-lg text-white mb-2">Instant Scaffolding</h3><p class="text-sm text-slate-400">Generate full projects and single page apps from plain English ideas.</p></div><div class="glass p-6 rounded-2xl"><div class="text-2xl mb-3">🛡️</div><h3 class="font-extrabold text-lg text-white mb-2">2FA Security</h3><p class="text-sm text-slate-400">Production-ready cryptographic verification flow built right in.</p></div><div class="glass p-6 rounded-2xl"><div class="text-2xl mb-3">📊</div><h3 class="font-extrabold text-lg text-white mb-2">AST Code Doctor</h3><p class="text-sm text-slate-400">Inspect code iteratively with zero syntax regressions.</p></div></div></main><footer class="border-t border-white/10 glass py-6 text-center text-xs text-slate-500">© 2026 CodeLens AI. All rights reserved.</footer></body></html>`
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  // Handle Full Project Generation with AI
  const handleGenerateFullProject = async () => {
    setGenerating(true);
    setGenStatusText('1. Synthesizing full-stack repository structure...');
    try {
      setTimeout(() => setGenStatusText('2. Crafting domain models & API routes with AI...'), 1500);
      const baseFiles = projectGenerator.generateFiles({
        name,
        stack,
        database,
        includeDocker,
        includeCi,
        includeSwagger
      });

      // Call AI to inject custom domain files tailored to the prompt
      let aiCustomFiles = {};
      try {
        aiCustomFiles = await projectGenerator.generateAIFullProject(prompt, name, stack, database);
      } catch (_) {}

      const combined = { ...baseFiles, ...aiCustomFiles };
      setProjectFiles(combined);
      setSelectedFile(Object.keys(combined)[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  // Download Single Page
  const handleDownloadSinglePage = () => {
    if (!singlePageResult) return;
    const blob = new Blob([singlePageResult.code || singlePageResult.preview_html], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = singlePageResult.filename || 'SinglePage.jsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  // Download Full Project ZIP
  const handleDownloadZip = async () => {
    setGenerating(true);
    try {
      const blob = await projectGenerator.createZipBlob(projectFiles);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name || 'project'}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      alert('Failed to compile ZIP: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Send to CodeLens Project Analyzer
  const handleSendToAnalyzer = async () => {
    setGenerating(true);
    try {
      const blob = await projectGenerator.createZipBlob(projectFiles);
      const zipFile = new File([blob], `${name}.zip`, { type: 'application/zip' });
      await api.uploadProject(zipFile);
      navigate('/analyzer');
    } catch (err) {
      navigate('/analyzer');
    } finally {
      setGenerating(false);
    }
  };

  // Copy Code
  const handleCopyCode = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // AI Prompt Enhancer helper
  const handleEnhancePrompt = () => {
    if (!prompt.trim()) return;
    const enhancements = [
      'Include responsive dark glassmorphic cards, glowing neon hover states, and smooth CSS micro-interactions.',
      'Add a sticky glass navbar, dynamic hero with gradient typography, 3 feature showcase cards, and interactive CTA buttons.',
      'Incorporate clean TypeScript interfaces, state management hooks, and production-grade accessibility attributes.'
    ];
    setPrompt(prev => `${prev.trim()} ${enhancements[Math.floor(Math.random() * enhancements.length)]}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>
      <Navbar />

      {/* Dynamic Ambient Background Glows */}
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '20%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(99, 102, 241, 0.04) 70%, transparent 100%)',
        filter: 'blur(90px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <main style={{ flexGrow: 1, padding: '42px 0 85px', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

          {/* PAGE HERO HEADER */}
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 36px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(236, 72, 153, 0.12)',
              border: '1px solid rgba(236, 72, 153, 0.35)',
              color: 'var(--accent-pink)',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: '16px'
            }}>
              <Sparkles size={14} />
              <span>AI ARCHITECT & NEURAL CODE GENERATOR</span>
            </div>

            <h1 style={{
              fontSize: '44px',
              fontWeight: 900,
              color: 'var(--text-main)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '14px'
            }}>
              What do you want to <span className="gradient-text">build?</span>
            </h1>

            <p style={{ fontSize: '16.5px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto' }}>
              Describe your idea in plain English. Generate standalone, live-previewable <strong>Single Pages</strong> or scaffold complete, production-ready <strong>Full Projects</strong> with zero boilerplate.
            </p>
          </div>

          {/* MODE SELECTOR: SINGLE PAGE vs FULL PROJECT */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            maxWidth: '720px',
            margin: '0 auto 32px'
          }}>
            <button
              type="button"
              onClick={() => setGenMode('single')}
              style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: genMode === 'single' ? 'var(--bg-surface)' : 'var(--bg-secondary)',
                border: `2px solid ${genMode === 'single' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                boxShadow: genMode === 'single' ? '0 0 25px rgba(236, 72, 153, 0.22)' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: genMode === 'single' ? 'var(--primary)' : 'var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0
              }}>
                <Layout size={20} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '3px' }}>
                  Single Page / Component
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Landing Page, Dashboard View, Pricing, Auth Screen with <strong>Live Preview</strong>.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setGenMode('project')}
              style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: genMode === 'project' ? 'var(--bg-surface)' : 'var(--bg-secondary)',
                border: `2px solid ${genMode === 'project' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                boxShadow: genMode === 'project' ? '0 0 25px rgba(99, 102, 241, 0.22)' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: genMode === 'project' ? 'var(--accent-purple)' : 'var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0
              }}>
                <Box size={20} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '3px' }}>
                  Full Project Scaffold
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Full repository with backend, frontend, database, Docker &amp; CI/CD (.ZIP).
                </div>
              </div>
            </button>
          </div>

          {/* MAIN PROMPT & IDEA INPUT CARD */}
          <div className="glass-card" style={{
            background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.8) 0%, rgba(11, 15, 25, 0.95) 100%)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '28px',
            marginBottom: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <label style={{
                fontSize: '14.5px',
                fontWeight: 800,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Wand2 size={16} color="var(--primary)" />
                <span>Describe your Idea or Prompt</span>
              </label>

              <button
                type="button"
                onClick={handleEnhancePrompt}
                title="AI will augment your prompt with technical architectural requirements"
                style={{
                  background: 'rgba(236, 72, 153, 0.1)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  color: 'var(--accent-pink)',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Sparkles size={13} />
                <span>Enhance with AI</span>
              </button>
            </div>

            {/* Prompt Textarea */}
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a sleek dark glassmorphism SaaS landing page for an AI developer platform with hero section, live code trace widget, 3 pricing tiers, and modern testimonials..."
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px',
                color: 'var(--text-main)',
                fontSize: '14.5px',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                marginBottom: '16px'
              }}
            />

            {/* Quick Inspiration Chips */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                PROMPT INSPIRATIONS &amp; TEMPLATES:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {PROMPT_INSPIRATIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(item.prompt)}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '9999px',
                      padding: '5px 12px',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-main)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CONFIGURATIONS: SINGLE PAGE vs FULL PROJECT */}
            {genMode === 'single' ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '18px',
                paddingTop: '18px',
                borderTop: '1px solid var(--border-subtle)',
                marginBottom: '24px'
              }}>
                {/* Single Page Framework */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Target Framework
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {SINGLE_PAGE_FRAMEWORKS.map((f) => (
                      <div
                        key={f.id}
                        onClick={() => setSingleFramework(f.id)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: singleFramework === f.id ? 'var(--bg-surface)' : 'var(--bg-secondary)',
                          border: `1px solid ${singleFramework === f.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>{f.name}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{f.desc}</div>
                        </div>
                        {singleFramework === f.id && <Check size={16} color="var(--primary)" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Single Page Design Aesthetic */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Design Aesthetic
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {STYLES.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setSingleStyle(s.id)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: singleStyle === s.id ? 'var(--bg-surface)' : 'var(--bg-secondary)',
                          border: `1px solid ${singleStyle === s.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>{s.name}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{s.desc}</div>
                        </div>
                        {singleStyle === s.id && <Check size={16} color="var(--primary)" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Full Project Configurations */
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                paddingTop: '18px',
                borderTop: '1px solid var(--border-subtle)',
                marginBottom: '24px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Technology Stack
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {STACKS.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setStack(s.id)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: stack === s.id ? 'var(--bg-surface)' : 'var(--bg-secondary)',
                          border: `1px solid ${stack === s.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>{s.name}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{s.desc}</div>
                        </div>
                        {stack === s.id && <Check size={16} color="var(--primary)" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Project Identifier &amp; Storage
                  </label>
                  <div style={{ marginBottom: '14px' }}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. cloud-metrics-api"
                      style={{
                        width: '100%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 14px',
                        color: 'var(--text-main)',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Database Driver
                    </label>
                    <select
                      value={database}
                      onChange={(e) => setDatabase(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 14px',
                        color: 'var(--text-main)',
                        fontSize: '13.5px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="postgres">PostgreSQL 16</option>
                      <option value="mysql">MySQL 8.0</option>
                      <option value="sqlite">SQLite 3 (Embedded)</option>
                      <option value="mongodb">MongoDB</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-main)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={includeDocker}
                        onChange={(e) => setIncludeDocker(e.target.checked)}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span>Include Multi-Stage Dockerfile</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-main)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={includeCi}
                        onChange={(e) => setIncludeCi(e.target.checked)}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span>Include GitHub Actions CI/CD</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* GENERATION ACTION TRIGGER */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={genMode === 'single' ? () => handleGenerateSinglePage(true) : handleGenerateFullProject}
                disabled={generating || !prompt.trim()}
                className="btn-primary"
                style={{
                  padding: '14px 28px',
                  fontSize: '15px',
                  fontWeight: 800,
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)'
                }}
              >
                {generating ? (
                  <>
                    <RefreshCw size={17} className="animate-spin" />
                    <span>{genStatusText || 'Generating with Gemini AI...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    <span>{genMode === 'single' ? 'Generate Single Page UI with AI' : 'Scaffold Full Project Repository'}</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Powered by Google Gemini 3.5 &bull; Real-time synthesis
              </span>
            </div>
          </div>

          {/* RESULTS DISPLAY SECTION */}
          {genMode === 'single' ? (
            /* SINGLE PAGE RESULTS VIEW */
            singlePageResult && (
              <div className="glass-card" style={{
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                background: '#090d16'
              }}>
                {/* Result Header Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-high" style={{ fontSize: '11px' }}>AI GENERATED</span>
                      <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                        {singlePageResult.title}
                      </h2>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {singlePageResult.description} &bull; <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{singlePageResult.filename}</span>
                    </div>
                  </div>

                  {/* Actions & Viewport Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Preview / Code View Toggle */}
                    <div style={{
                      display: 'flex',
                      background: 'var(--bg-secondary)',
                      padding: '3px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <button
                        type="button"
                        onClick={() => setPreviewTab('preview')}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: previewTab === 'preview' ? 'var(--primary)' : 'transparent',
                          color: previewTab === 'preview' ? '#fff' : 'var(--text-muted)',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Eye size={14} /> Live Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTab('code')}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: previewTab === 'code' ? 'var(--primary)' : 'transparent',
                          color: previewTab === 'code' ? '#fff' : 'var(--text-muted)',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Code2 size={14} /> Source Code
                      </button>
                    </div>

                    {/* Viewport size buttons if in preview mode */}
                    {previewTab === 'preview' && (
                      <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', padding: '3px' }}>
                        <button
                          type="button"
                          onClick={() => setViewportMode('desktop')}
                          title="Desktop View (100%)"
                          style={{
                            padding: '6px 9px',
                            background: viewportMode === 'desktop' ? 'var(--bg-surface)' : 'transparent',
                            color: viewportMode === 'desktop' ? 'var(--primary)' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          <Monitor size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewportMode('tablet')}
                          title="Tablet View (768px)"
                          style={{
                            padding: '6px 9px',
                            background: viewportMode === 'tablet' ? 'var(--bg-surface)' : 'transparent',
                            color: viewportMode === 'tablet' ? 'var(--primary)' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          <Tablet size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewportMode('mobile')}
                          title="Mobile View (375px)"
                          style={{
                            padding: '6px 9px',
                            background: viewportMode === 'mobile' ? 'var(--bg-surface)' : 'transparent',
                            color: viewportMode === 'mobile' ? 'var(--primary)' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          <Smartphone size={15} />
                        </button>
                      </div>
                    )}

                    {/* Download & Copy Buttons */}
                    <button
                      type="button"
                      onClick={() => handleCopyCode(singlePageResult.code || singlePageResult.preview_html)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-main)',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {copied ? <CheckCheck size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                      <span>{copied ? 'Copied' : 'Copy Code'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadSinglePage}
                      style={{
                        padding: '7px 16px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--primary)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: 'var(--primary-glow)'
                      }}
                    >
                      <Download size={14} />
                      <span>{downloadSuccess ? 'Downloaded!' : 'Download File'}</span>
                    </button>
                  </div>
                </div>

                {/* Content View: Iframe Preview vs Code Pre */}
                {previewTab === 'preview' ? (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    background: '#04060d',
                    borderRadius: 'var(--radius-sm)',
                    padding: '20px 0',
                    border: '1px solid var(--border-subtle)',
                    overflowX: 'auto'
                  }}>
                    <iframe
                      title="AI Single Page Preview"
                      srcDoc={singlePageResult.preview_html || singlePageResult.code}
                      style={{
                        width: viewportMode === 'mobile' ? '375px' : (viewportMode === 'tablet' ? '768px' : '100%'),
                        maxWidth: '100%',
                        height: '620px',
                        borderRadius: '8px',
                        border: viewportMode === 'desktop' ? 'none' : '1px solid rgba(255,255,255,0.15)',
                        boxShadow: viewportMode === 'desktop' ? 'none' : '0 20px 50px rgba(0,0,0,0.8)',
                        background: '#ffffff',
                        transition: 'width 0.3s ease'
                      }}
                      sandbox="allow-scripts"
                    />
                  </div>
                ) : (
                  <pre style={{
                    background: 'var(--bg-code)',
                    padding: '20px',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-subtle)',
                    maxHeight: '620px',
                    overflowY: 'auto',
                    margin: 0
                  }}>
                    <code>{singlePageResult.code || singlePageResult.preview_html}</code>
                  </pre>
                )}
              </div>
            )
          ) : (
            /* FULL PROJECT REPOSITORY EXPLORER */
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '16px',
                marginBottom: '18px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FolderTree size={20} color="var(--primary)" />
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      Repository Explorer: <span style={{ color: 'var(--primary)' }}>{name}</span>
                    </h3>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      {fileKeys.length} files scaffolded &bull; Ready for deployment
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(projectFiles[activeFile])}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-main)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy File'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadZip}
                    disabled={generating}
                    className="btn-primary"
                    style={{ padding: '8px 18px', fontSize: '13px' }}
                  >
                    <Download size={14} />
                    <span>{downloadSuccess ? `Downloaded ${name}.zip!` : 'Download Project (.ZIP)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendToAnalyzer}
                    disabled={generating}
                    className="btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    <Play size={13} fill="currentColor" color="var(--primary)" />
                    <span>Analyze in CodeLens</span>
                  </button>
                </div>
              </div>

              {/* Split Explorer */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '280px 1fr',
                gap: '16px',
                alignItems: 'start'
              }}>
                {/* File List Tree */}
                <div style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  padding: '10px',
                  maxHeight: '520px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {fileKeys.map((filePath) => {
                    const isCur = activeFile === filePath;
                    return (
                      <div
                        key={filePath}
                        onClick={() => setSelectedFile(filePath)}
                        style={{
                          padding: '9px 12px',
                          borderRadius: '6px',
                          background: isCur ? 'var(--bg-surface)' : 'transparent',
                          color: isCur ? 'var(--text-main)' : 'var(--text-muted)',
                          fontWeight: isCur ? 700 : 500,
                          border: isCur ? '1px solid var(--border-accent)' : '1px solid transparent',
                          fontSize: '12.5px',
                          fontFamily: 'var(--font-mono)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        <FileCode size={15} color={isCur ? 'var(--primary)' : 'var(--text-dim)'} />
                        <span>{filePath}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Code Viewer */}
                <pre style={{
                  background: 'var(--bg-code)',
                  padding: '18px',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-subtle)',
                  maxHeight: '520px',
                  overflowY: 'auto',
                  margin: 0
                }}>
                  <code>{projectFiles[activeFile]}</code>
                </pre>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
