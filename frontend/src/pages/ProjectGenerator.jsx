import React, { useState, useEffect } from 'react';
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
  Clock,
  History,
  FileText,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { projectGenerator } from '../services/projectGenerator';
import { api } from '../services/api';

const STACKS = [
  { id: 'react', name: 'React 19 + Vite', badge: 'Frontend', desc: 'SPA with Tailwind CSS & modular components' },
  { id: 'spring-boot', name: 'Spring Boot 3 (Java 17)', badge: 'Backend', desc: 'Spring Data JPA & Maven REST API' },
  { id: 'fastapi', name: 'Python 3 + FastAPI', badge: 'Python', desc: 'Async REST API with Pydantic validation' },
  { id: 'node', name: 'Node.js + Express', badge: 'Full-Stack', desc: 'Lightweight REST API service with CORS' },
  { id: 'cpp', name: 'Modern C++20 (CMake)', badge: 'System', desc: 'Modular CMake project with unit testing' }
];

const SINGLE_PAGE_FRAMEWORKS = [
  { id: 'react', name: 'React 19 (JSX)', desc: 'Interactive component with hooks' },
  { id: 'html', name: 'HTML5 + Tailwind', desc: 'Zero-config standalone webpage' },
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

  // Prompt / Idea
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

  // States
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

  // Build History (Pages & Projects Built)
  const [buildHistory, setBuildHistory] = useState([
    {
      id: 'build-1',
      mode: 'single',
      title: 'AI SaaS Landing Page',
      timestamp: 'Just now',
      tag: 'React 19 + Tailwind',
      prompt: 'SaaS landing page with sticky navbar, hero section, 3 feature cards, and pricing tiers.'
    }
  ]);
  const [activeBuildId, setActiveBuildId] = useState('build-1');

  const fileKeys = Object.keys(projectFiles);
  const activeFile = selectedFile && projectFiles[selectedFile] ? selectedFile : fileKeys[0];

  // Auto-generate starter single page on initial load
  useEffect(() => {
    if (!singlePageResult) {
      handleGenerateSinglePage(false);
    }
  }, []);

  // Handle AI Single Page Generation
  const handleGenerateSinglePage = async (withAI = true) => {
    setGenerating(true);
    setGenStatusText('1. Synthesizing component layout...');
    try {
      let result = null;
      if (withAI) {
        setTimeout(() => setGenStatusText('2. Applying modern Tailwind styles...'), 1200);
        setTimeout(() => setGenStatusText('3. Assembling interactive live canvas...'), 2400);
        result = await projectGenerator.generateAISinglePage(prompt, singleFramework, singleStyle);
      } else {
        result = {
          title: 'CodeLens AI SaaS Landing Page',
          description: 'High-converting dark glassmorphic landing page with hero, features, and pricing.',
          filename: singleFramework === 'html' ? 'index.html' : 'LandingPage.jsx',
          features: ['Sticky Glass Header', 'Dynamic Hero Section', '3-Column Metric Cards', 'Pricing Tiers'],
          code: `import React, { useState } from 'react';\n\nexport default function LandingPage() {\n  return (\n    <div className="min-h-screen bg-[#070913] text-white flex flex-col justify-between">\n      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between backdrop-blur-md">\n        <div className="flex items-center gap-3">\n          <div className="w-9 h-9 rounded-lg bg-pink-500 flex items-center justify-center font-bold">⚡</div>\n          <span className="font-extrabold text-lg">CodeLens<span className="text-pink-500">.ai</span></span>\n        </div>\n        <button className="bg-pink-600 px-5 py-2 rounded-lg font-bold hover:bg-pink-500 transition">Get Started</button>\n      </header>\n      <main className="max-w-5xl mx-auto px-6 py-20 text-center">\n        <h1 className="text-6xl font-black mb-6">Build Faster with <span className="text-pink-500">Neural Precision</span></h1>\n        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">Scaffold full-stack repositories and standalone interfaces with AI acceleration.</p>\n        <button className="bg-gradient-to-r from-pink-500 to-indigo-600 px-8 py-4 rounded-xl font-extrabold text-lg shadow-xl shadow-pink-500/25">Launch Studio &rarr;</button>\n      </main>\n      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">\n        © 2026 CodeLens AI. All rights reserved.\n      </footer>\n    </div>\n  );\n}`,
          preview_html: `<!DOCTYPE html><html><head><meta charset="utf-8"><script src="https://cdn.tailwindcss.com"></script><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;900&display=swap" rel="stylesheet"><style>body{font-family:'Plus Jakarta Sans',sans-serif;background:#070913;color:#fff;}.glass{background:rgba(17,24,39,0.7);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.08);}</style></head><body class="min-h-screen flex flex-col justify-between"><header class="border-b border-white/10 glass sticky top-0 px-8 py-5 flex items-center justify-between z-50"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center font-black shadow-lg shadow-pink-500/30">⚡</div><span class="font-extrabold text-xl">CodeLens<span class="text-pink-500">.ai</span></span></div><div class="flex items-center gap-4"><button class="text-sm font-bold text-slate-300 hover:text-white px-3 py-1.5">Sign In</button><button class="text-sm font-bold bg-gradient-to-r from-pink-500 to-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-pink-500/25 hover:opacity-95 transition">Get Started</button></div></header><main class="max-w-5xl mx-auto px-6 py-20 text-center"><div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-pink-500/30 text-pink-400 text-xs font-bold uppercase mb-8">✨ INTELLIGENT COMPONENT ENGINE</div><h1 class="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">Build Faster with <span class="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Neural Velocity.</span></h1><p class="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">Scaffold full-stack repositories and standalone interfaces with AI acceleration in seconds.</p><button class="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 font-extrabold text-white text-base shadow-xl shadow-pink-500/30 hover:scale-105 transition transform">Launch Workspace &rarr;</button><div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-16"><div class="glass p-6 rounded-2xl"><div class="text-2xl mb-3">⚡</div><h3 class="font-extrabold text-lg text-white mb-2">Instant Scaffolding</h3><p class="text-sm text-slate-400">Generate full projects and single page apps from plain English ideas.</p></div><div class="glass p-6 rounded-2xl"><div class="text-2xl mb-3">🛡️</div><h3 class="font-extrabold text-lg text-white mb-2">2FA Security</h3><p class="text-sm text-slate-400">Production-ready cryptographic verification flow built right in.</p></div><div class="glass p-6 rounded-2xl"><div class="text-2xl mb-3">📊</div><h3 class="font-extrabold text-lg text-white mb-2">AST Code Doctor</h3><p class="text-sm text-slate-400">Inspect code iteratively with zero syntax regressions.</p></div></div></main><footer class="border-t border-white/10 glass py-6 text-center text-xs text-slate-500">© 2026 CodeLens AI. All rights reserved.</footer></body></html>`
        };
      }

      setSinglePageResult(result);
      setPreviewTab('preview');

      // Add to Build History
      const newBuildId = 'build-' + Date.now();
      setBuildHistory(prev => [
        {
          id: newBuildId,
          mode: 'single',
          title: result.title || 'Generated Single Page',
          timestamp: 'Just now',
          tag: singleFramework.toUpperCase(),
          prompt: prompt.slice(0, 75) + '...',
          result: result
        },
        ...prev.filter(b => b.id !== newBuildId).slice(0, 7)
      ]);
      setActiveBuildId(newBuildId);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  // Handle Full Project Generation with AI
  const handleGenerateFullProject = async () => {
    setGenerating(true);
    setGenStatusText('1. Scaffolding project directory tree...');
    try {
      setTimeout(() => setGenStatusText('2. Injecting domain models & routes with AI...'), 1500);
      const baseFiles = projectGenerator.generateFiles({
        name,
        stack,
        database,
        includeDocker,
        includeCi,
        includeSwagger: true
      });

      let aiCustomFiles = {};
      try {
        aiCustomFiles = await projectGenerator.generateAIFullProject(prompt, name, stack, database);
      } catch (_) {}

      const combined = { ...baseFiles, ...aiCustomFiles };
      setProjectFiles(combined);
      setSelectedFile(Object.keys(combined)[0]);

      // Add to Build History
      const newBuildId = 'proj-' + Date.now();
      setBuildHistory(prev => [
        {
          id: newBuildId,
          mode: 'project',
          title: name || 'Custom Project',
          timestamp: 'Just now',
          tag: stack.toUpperCase(),
          prompt: prompt.slice(0, 75) + '...',
          files: combined
        },
        ...prev.filter(b => b.id !== newBuildId).slice(0, 7)
      ]);
      setActiveBuildId(newBuildId);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  // Switch to a previous build from History
  const handleSelectBuild = (item) => {
    setActiveBuildId(item.id);
    setGenMode(item.mode);
    if (item.mode === 'single' && item.result) {
      setSinglePageResult(item.result);
      setPreviewTab('preview');
    } else if (item.mode === 'project' && item.files) {
      setProjectFiles(item.files);
      setSelectedFile(Object.keys(item.files)[0]);
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
      'Include dark glassmorphic cards, glowing neon hover states, and smooth CSS micro-interactions.',
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
        top: '6%',
        left: '20%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(99, 102, 241, 0.03) 70%, transparent 100%)',
        filter: 'blur(95px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <main style={{ flexGrow: 1, padding: '24px 0 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '1720px', margin: '0 auto', padding: '0 24px' }}>

          {/* TOP BAR / STUDIO TITLE */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: 'var(--primary-glow)'
              }}>
                <Wand2 size={20} />
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
                  Project &amp; Page Studio
                </h1>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Prompt-driven AI code generator &bull; Side-by-side live canvas
                </div>
              </div>
            </div>

            {/* Top Scope Switcher Pills */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-secondary)',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                type="button"
                onClick={() => setGenMode('single')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  background: genMode === 'single' ? 'var(--primary)' : 'transparent',
                  color: genMode === 'single' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: genMode === 'single' ? '0 2px 10px rgba(236,72,153,0.3)' : 'none'
                }}
              >
                <Layout size={15} />
                <span>Single Page Component</span>
              </button>

              <button
                type="button"
                onClick={() => setGenMode('project')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  background: genMode === 'project' ? 'var(--primary)' : 'transparent',
                  color: genMode === 'project' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: genMode === 'project' ? '0 2px 10px rgba(236,72,153,0.3)' : 'none'
                }}
              >
                <Box size={15} />
                <span>Full Project Repository</span>
              </button>
            </div>
          </div>

          {/* DUAL-PANE SIDE-BY-SIDE STUDIO WORKSPACE */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(380px, 460px) 1fr',
            gap: '24px',
            alignItems: 'start'
          }}>

            {/* ======================================================== */}
            {/* LEFT COLUMN: Controls, Prompt Input, Options, & Builds   */}
            {/* ======================================================== */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Prompt Input Deck */}
              <div className="glass-card" style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} color="var(--primary)" />
                    <span>Your Prompt or Idea</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    title="Enhance prompt with AI architectural specs"
                    style={{
                      background: 'rgba(236, 72, 153, 0.1)',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                      color: 'var(--accent-pink)',
                      padding: '3px 9px',
                      borderRadius: '5px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Wand2 size={11} />
                    <span>Enhance</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Dark-themed crypto portfolio dashboard with live tickers, chart container, and transaction history..."
                  style={{
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    color: 'var(--text-main)',
                    fontSize: '13.5px',
                    lineHeight: 1.5,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    marginBottom: '12px'
                  }}
                />

                {/* Quick Inspiration Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {PROMPT_INSPIRATIONS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(item.prompt)}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '9999px',
                        padding: '4px 9px',
                        color: 'var(--text-muted)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Configuration Options */}
                {genMode === 'single' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
                        Framework
                      </label>
                      <select
                        value={singleFramework}
                        onChange={(e) => setSingleFramework(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '8px 10px',
                          color: 'var(--text-main)',
                          fontSize: '12.5px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {SINGLE_PAGE_FRAMEWORKS.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
                        Design Theme
                      </label>
                      <select
                        value={singleStyle}
                        onChange={(e) => setSingleStyle(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '8px 10px',
                          color: 'var(--text-main)',
                          fontSize: '12.5px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {STYLES.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
                          Tech Stack
                        </label>
                        <select
                          value={stack}
                          onChange={(e) => setStack(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            color: 'var(--text-main)',
                            fontSize: '12.5px',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {STACKS.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
                          Database
                        </label>
                        <select
                          value={database}
                          onChange={(e) => setDatabase(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            color: 'var(--text-main)',
                            fontSize: '12.5px',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="postgres">PostgreSQL</option>
                          <option value="mysql">MySQL 8.0</option>
                          <option value="sqlite">SQLite 3</option>
                          <option value="mongodb">MongoDB</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Project name (e.g. user-service)"
                        style={{
                          width: '100%',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: 'var(--text-main)',
                          fontSize: '12.5px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={genMode === 'single' ? () => handleGenerateSinglePage(true) : handleGenerateFullProject}
                  disabled={generating || !prompt.trim()}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 800, borderRadius: 'var(--radius-sm)' }}
                >
                  {generating ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>{genStatusText || 'Synthesizing with AI...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      <span>{genMode === 'single' ? 'Generate Single Page UI' : 'Scaffold Full Project Repository'}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>

              {/* BUILT PAGES & PROJECTS SIDE-LIST */}
              <div className="glass-card" style={{
                padding: '18px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <History size={14} color="var(--primary)" />
                    <span>Pages &amp; Projects Built ({buildHistory.length})</span>
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Click to view</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {buildHistory.map((item) => {
                    const isSelected = activeBuildId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectBuild(item)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: isSelected ? 'var(--bg-secondary)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: item.mode === 'single' ? 'rgba(236,72,153,0.15)' : 'rgba(99,102,241,0.15)',
                            color: item.mode === 'single' ? 'var(--accent-pink)' : 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {item.mode === 'single' ? <Layout size={14} /> : <Box size={14} />}
                          </div>
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {item.tag} &bull; {item.timestamp}
                            </div>
                          </div>
                        </div>

                        <ChevronRight size={14} color={isSelected ? 'var(--primary)' : 'var(--text-dim)'} />
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: The Built Canvas / Live View / Code Studio */}
            {/* ======================================================== */}
            <div style={{ position: 'sticky', top: '90px' }}>
              <div className="glass-card" style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                background: '#070912',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
              }}>

                {/* Canvas Top Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  {/* Left Title Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e' }} />
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                    </div>

                    <div style={{ height: '16px', width: '1px', background: 'var(--border-subtle)', margin: '0 4px' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-medium" style={{ fontSize: '10px', padding: '2px 6px' }}>
                        {genMode === 'single' ? 'SINGLE PAGE' : 'FULL REPO'}
                      </span>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)' }}>
                        {genMode === 'single' ? (singlePageResult?.title || 'Preview Canvas') : (name || 'Project Scaffold')}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions & Viewport Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    
                    {/* If Single Page: Toggle Live Preview vs Source Code */}
                    {genMode === 'single' && (
                      <div style={{
                        display: 'flex',
                        background: 'var(--bg-secondary)',
                        padding: '3px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        <button
                          type="button"
                          onClick={() => setPreviewTab('preview')}
                          style={{
                            padding: '5px 11px',
                            borderRadius: '4px',
                            background: previewTab === 'preview' ? 'var(--primary)' : 'transparent',
                            color: previewTab === 'preview' ? '#fff' : 'var(--text-muted)',
                            border: 'none',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <Eye size={13} /> Live Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewTab('code')}
                          style={{
                            padding: '5px 11px',
                            borderRadius: '4px',
                            background: previewTab === 'code' ? 'var(--primary)' : 'transparent',
                            color: previewTab === 'code' ? '#fff' : 'var(--text-muted)',
                            border: 'none',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <Code2 size={13} /> Source Code
                        </button>
                      </div>
                    )}

                    {/* Viewport switchers in Live Preview mode */}
                    {genMode === 'single' && previewTab === 'preview' && (
                      <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-subtle)', padding: '2px' }}>
                        <button
                          type="button"
                          onClick={() => setViewportMode('desktop')}
                          title="Desktop (100%)"
                          style={{
                            padding: '5px 8px',
                            background: viewportMode === 'desktop' ? 'var(--bg-surface)' : 'transparent',
                            color: viewportMode === 'desktop' ? 'var(--primary)' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Monitor size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewportMode('tablet')}
                          title="Tablet (768px)"
                          style={{
                            padding: '5px 8px',
                            background: viewportMode === 'tablet' ? 'var(--bg-surface)' : 'transparent',
                            color: viewportMode === 'tablet' ? 'var(--primary)' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Tablet size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewportMode('mobile')}
                          title="Mobile (375px)"
                          style={{
                            padding: '5px 8px',
                            background: viewportMode === 'mobile' ? 'var(--bg-surface)' : 'transparent',
                            color: viewportMode === 'mobile' ? 'var(--primary)' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Smartphone size={14} />
                        </button>
                      </div>
                    )}

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyCode(genMode === 'single' ? (singlePageResult?.code || singlePageResult?.preview_html) : projectFiles[activeFile])}
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
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {copied ? <CheckCheck size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    {/* Download Button */}
                    {genMode === 'single' ? (
                      <button
                        type="button"
                        onClick={handleDownloadSinglePage}
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '6px' }}
                      >
                        <Download size={13} />
                        <span>{downloadSuccess ? 'Downloaded!' : 'Download File'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleDownloadZip}
                        disabled={generating}
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '6px' }}
                      >
                        <Download size={13} />
                        <span>{downloadSuccess ? 'Downloaded .ZIP!' : 'Download .ZIP'}</span>
                      </button>
                    )}

                    {/* Send to Analyzer Button (For Projects) */}
                    {genMode === 'project' && (
                      <button
                        type="button"
                        onClick={handleSendToAnalyzer}
                        disabled={generating}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                      >
                        <Play size={12} fill="currentColor" color="var(--primary)" />
                        <span>Analyze</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Canvas Main Body */}
                {genMode === 'single' ? (
                  /* SINGLE PAGE CANVAS */
                  previewTab === 'preview' ? (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      background: '#04060d',
                      padding: '16px 0',
                      minHeight: '660px',
                      overflowX: 'auto'
                    }}>
                      <iframe
                        title="AI Live Single Page Canvas"
                        srcDoc={singlePageResult?.preview_html || singlePageResult?.code}
                        style={{
                          width: viewportMode === 'mobile' ? '375px' : (viewportMode === 'tablet' ? '768px' : '100%'),
                          maxWidth: '100%',
                          height: '660px',
                          borderRadius: viewportMode === 'desktop' ? '0' : '8px',
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
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      color: 'var(--text-main)',
                      height: '660px',
                      overflowY: 'auto',
                      margin: 0
                    }}>
                      <code>{singlePageResult?.code || singlePageResult?.preview_html}</code>
                    </pre>
                  )
                ) : (
                  /* FULL PROJECT MULTI-FILE CANVAS */
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '260px 1fr',
                    minHeight: '660px'
                  }}>
                    {/* Left: Project File Tree */}
                    <div style={{
                      background: 'rgba(10, 15, 29, 0.7)',
                      borderRight: '1px solid var(--border-subtle)',
                      padding: '12px',
                      maxHeight: '660px',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '0.05em', marginBottom: '8px', padding: '0 6px' }}>
                        EXPLORER &bull; {fileKeys.length} FILES
                      </div>
                      {fileKeys.map((filePath) => {
                        const isCur = activeFile === filePath;
                        return (
                          <div
                            key={filePath}
                            onClick={() => setSelectedFile(filePath)}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '6px',
                              background: isCur ? 'var(--bg-surface)' : 'transparent',
                              color: isCur ? 'var(--text-main)' : 'var(--text-muted)',
                              fontWeight: isCur ? 700 : 500,
                              border: isCur ? '1px solid var(--border-accent)' : '1px solid transparent',
                              fontSize: '12px',
                              fontFamily: 'var(--font-mono)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '7px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            <FileCode size={14} color={isCur ? 'var(--primary)' : 'var(--text-dim)'} />
                            <span>{filePath}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right: Code Viewer */}
                    <pre style={{
                      background: 'var(--bg-code)',
                      padding: '20px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      color: 'var(--text-main)',
                      maxHeight: '660px',
                      overflowY: 'auto',
                      margin: 0
                    }}>
                      <code>{projectFiles[activeFile]}</code>
                    </pre>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
