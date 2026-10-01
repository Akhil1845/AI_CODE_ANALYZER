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
  ArrowRight, 
  Play,
  Copy,
  Layout,
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
  History,
  Sliders,
  ExternalLink,
  ShieldCheck
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

const PAGE_ARCHETYPES = [
  { 
    id: 'auth', 
    name: 'Auth & Sign In', 
    icon: '🔐', 
    desc: 'Dual-tab Login, Sign Up, OAuth & 2FA',
    defaultSections: ['navbar', 'hero', 'footer'],
    defaultPrompt: 'Build a creative login and signup page with a sticky glass navbar, animated ambient background orbs, email and password inputs with reveal eye toggle, and social sign in buttons.'
  },
  { 
    id: 'landing', 
    name: 'SaaS Landing Page', 
    icon: '🚀', 
    desc: 'Hero showcase, bento grid & conversion CTA',
    defaultSections: ['navbar', 'hero', 'features', 'pricing', 'footer'],
    defaultPrompt: 'Create a high-converting, dark-themed SaaS landing page for an AI code observability platform with sticky navbar, hero section, 3 feature cards, pricing tiers, and FAQ accordion.'
  },
  { 
    id: 'dashboard', 
    name: 'Analytics Dashboard', 
    icon: '📊', 
    desc: 'Telemetry KPI cards, SVG charts & logs',
    defaultSections: ['navbar', 'kpi', 'features', 'footer'],
    defaultPrompt: 'Build a dark glassmorphic observability analytics dashboard with a cluster telemetry overview, 4 real-time KPI metric cards, and a recent deployment activity table.'
  },
  { 
    id: 'ecommerce', 
    name: 'E-Commerce Store', 
    icon: '🛒', 
    desc: 'Product cards, filter tags & cart counter',
    defaultSections: ['navbar', 'features', 'footer'],
    defaultPrompt: 'Generate a modern e-commerce storefront for developer hardware gear with category filter pills, product grid with price tags, star ratings, and an interactive Add to Cart counter.'
  },
  { 
    id: 'pricing', 
    name: 'Pricing Matrix', 
    icon: '💎', 
    desc: '3 Tier cards, billing switch & features',
    defaultSections: ['navbar', 'pricing', 'faq', 'footer'],
    defaultPrompt: 'Build a high-conversion pricing comparison matrix with monthly and annual billing toggle, 3 tier cards with a highlighted Pro plan, and comprehensive feature checklists.'
  },
  { 
    id: 'portfolio', 
    name: 'Developer Portfolio', 
    icon: '💼', 
    desc: 'Hero bio, tech stack tags & project cards',
    defaultSections: ['hero', 'features', 'footer'],
    defaultPrompt: 'Create an ultra-sleek developer portfolio with an animated hero statement, interactive tech stack tags, project showcase cards with live demo links, and a clean contact form.'
  }
];

const AVAILABLE_SECTIONS = [
  { id: 'navbar', label: 'Sticky Glass Navbar' },
  { id: 'hero', label: 'Hero Banner' },
  { id: 'features', label: 'Feature Bento Grid' },
  { id: 'kpi', label: 'KPI Metric Cards' },
  { id: 'pricing', label: 'Pricing Table' },
  { id: 'testimonials', label: 'Social Proof' },
  { id: 'faq', label: 'FAQ Accordion' },
  { id: 'footer', label: 'Modern Footer' }
];

const STYLES = [
  { id: 'modern-dark', name: 'Dark Glassmorphism' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon' },
  { id: 'clean-saas', name: 'Clean Modern Minimal' },
  { id: 'light-enterprise', name: 'Light Enterprise' }
];

const COLOR_THEMES = [
  { id: 'pink-indigo', name: 'Electric Pink', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
  { id: 'cyan-blue', name: 'Cyber Cyan', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
  { id: 'emerald-mint', name: 'Emerald Matrix', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  { id: 'amber-orange', name: 'Sunset Amber', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' }
];

export default function ProjectGenerator() {
  const navigate = useNavigate();

  // Mode: 'single' (Single Page / Component) or 'project' (Full Project Repository)
  const [genMode, setGenMode] = useState('single');

  // Archetype & Options
  const [pageArchetype, setPageArchetype] = useState('auth');
  const [selectedSections, setSelectedSections] = useState(['navbar', 'hero', 'footer']);
  const [colorAccent, setColorAccent] = useState('pink-indigo');
  const [brandName, setBrandName] = useState('');

  // Prompt / Idea
  const [prompt, setPrompt] = useState('Build a creative login and signup page with a sticky glass navbar, animated ambient background orbs, email and password inputs with reveal eye toggle, and social sign in buttons.');

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
      id: 'build-init',
      mode: 'single',
      title: 'NexusAuth Portal',
      timestamp: 'Initial load',
      tag: 'AUTH (React)',
      prompt: 'Build a creative login and signup page with sticky glass navbar.'
    }
  ]);
  const [activeBuildId, setActiveBuildId] = useState('build-init');

  const fileKeys = Object.keys(projectFiles);
  const activeFile = selectedFile && projectFiles[selectedFile] ? selectedFile : fileKeys[0];

  // Auto-generate starter single page on initial load
  useEffect(() => {
    if (!singlePageResult) {
      handleGenerateSinglePage(false);
    }
  }, []);

  // When user selects an archetype card
  const handleSelectArchetype = (arch) => {
    setPageArchetype(arch.id);
    setPrompt(arch.defaultPrompt);
    if (arch.defaultSections) {
      setSelectedSections(arch.defaultSections);
    }
  };

  // Toggle section checkbox
  const handleToggleSection = (secId) => {
    setSelectedSections(prev => 
      prev.includes(secId) ? prev.filter(s => s !== secId) : [...prev, secId]
    );
  };

  // Handle AI Single Page Generation
  const handleGenerateSinglePage = async (withAI = true) => {
    setGenerating(true);
    setGenStatusText('1. Designing UI architecture...');
    try {
      let result = null;
      if (withAI) {
        setTimeout(() => setGenStatusText('2. Applying Tailwind styles & interactions...'), 1100);
        setTimeout(() => setGenStatusText('3. Assembling live responsive preview...'), 2200);
        result = await projectGenerator.generateAISinglePage({
          prompt,
          framework: singleFramework,
          style: singleStyle,
          page_type: pageArchetype,
          sections: selectedSections,
          color_accent: colorAccent,
          brand_name: brandName
        });
      } else {
        // High-end default starter
        result = {
          title: 'NexusAuth Portal',
          description: 'Modern dual-tab authentication portal with glassmorphism, social sign-in, and password toggle.',
          filename: singleFramework === 'html' ? 'index.html' : 'AuthPortal.jsx',
          features: ['Dual-Tab Sign In & Sign Up', 'Sticky Glass Navbar', 'Social OAuth (Google & GitHub)', 'Password Visibility Toggle', 'Ambient Background Orbs'],
          code: `import React, { useState } from 'react';\n\nexport default function AuthPortal() {\n  const [tab, setTab] = useState('login');\n  const [showPassword, setShowPassword] = useState(false);\n  return (\n    <div className="min-h-screen bg-[#070913] text-white flex flex-col justify-between relative overflow-hidden">\n      {/* Navbar */}\n      <header className="sticky top-0 z-50 px-6 py-4 backdrop-blur-xl border-b border-white/10 flex justify-between items-center">\n        <div className="flex items-center gap-2 font-black text-xl">\n          <span className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-sm">⚡</span>\n          Nexus<span className="text-pink-500">Auth</span>\n        </div>\n        <span className="text-xs text-emerald-400 font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">256-Bit SSL</span>\n      </header>\n      {/* Center Auth Card */}\n      <main className="flex-1 flex items-center justify-center p-6">\n        <div className="w-full max-w-md bg-slate-900/80 border border-white/10 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl">\n          <div className="flex bg-slate-950/80 p-1 rounded-xl mb-6">\n            <button onClick={() => setTab('login')} className={\`flex-1 py-2 font-bold text-sm rounded-lg \${tab === 'login' ? 'bg-pink-600 text-white' : 'text-slate-400'}\`}>Sign In</button>\n            <button onClick={() => setTab('signup')} className={\`flex-1 py-2 font-bold text-sm rounded-lg \${tab === 'signup' ? 'bg-pink-600 text-white' : 'text-slate-400'}\`}>Sign Up</button>\n          </div>\n          <h2 className="text-2xl font-black mb-2">{tab === 'login' ? 'Welcome Back' : 'Create Account'}</h2>\n          <p className="text-xs text-slate-400 mb-6">Enter your details to access your workspace</p>\n          <form className="space-y-4">\n            <div>\n              <label className="block text-xs font-bold mb-1">Email</label>\n              <input type="email" placeholder="alex@company.com" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />\n            </div>\n            <div>\n              <label className="block text-xs font-bold mb-1">Password</label>\n              <div className="relative">\n                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white pr-10" />\n                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-xs text-slate-400">👁️</button>\n              </div>\n            </div>\n            <button type="button" className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-xl font-black text-sm text-white shadow-lg">Continue &rarr;</button>\n          </form>\n        </div>\n      </main>\n      <footer className="py-4 text-center text-xs text-slate-500 border-t border-white/10">\n        © 2026 NexusAuth Systems Inc. All rights reserved.\n      </footer>\n    </div>\n  );\n}`,
          preview_html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>NexusAuth Portal</title><script src="https://cdn.tailwindcss.com"></script><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet"><style>body{font-family:'Plus Jakarta Sans',sans-serif;background:#070913;color:#f8fafc;}.glass{background:rgba(17,24,39,0.75);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);}</style></head><body class="min-h-screen flex flex-col justify-between relative overflow-hidden selection:bg-pink-500 selection:text-white"><div class="absolute w-[500px] h-[500px] bg-pink-500/15 -top-20 -left-20 rounded-full blur-[120px] pointer-events-none"></div><div class="absolute w-[500px] h-[500px] bg-indigo-600/15 -bottom-20 -right-20 rounded-full blur-[120px] pointer-events-none"></div><header class="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/10"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-pink-500/30">⚡</div><span class="text-xl font-extrabold text-white">Nexus<span class="text-pink-500">Auth</span></span></div><span class="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">256-Bit SSL Secured</span></header><main class="flex-grow flex items-center justify-center px-4 py-12 relative z-10"><div class="w-full max-w-md glass rounded-2xl p-8 shadow-2xl"><div class="flex rounded-xl bg-slate-900 p-1 border border-white/5 mb-6"><button id="tab-login" onclick="setTab('login')" class="flex-1 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow">Sign In</button><button id="tab-signup" onclick="setTab('signup')" class="flex-1 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-white">Sign Up</button></div><div id="view-login"><h2 class="text-2xl font-black text-white mb-1">Welcome Back</h2><p class="text-xs text-slate-400 mb-6">Enter your credentials to access your account</p><div class="space-y-4"><div><label class="block text-xs font-bold text-slate-300 mb-1">Email</label><input type="email" placeholder="alex@company.com" class="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500"></div><div><label class="block text-xs font-bold text-slate-300 mb-1">Password</label><div class="relative"><input id="p-login" type="password" placeholder="••••••••" class="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500 pr-10"><button type="button" onclick="togglePass('p-login')" class="absolute right-3 top-3.5 text-xs text-slate-400">👁️</button></div></div><button onclick="alert('Signed In (Demo)')" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 font-extrabold text-sm text-white shadow-lg shadow-pink-500/25 hover:opacity-95 transition">Sign In &rarr;</button></div></div><div id="view-signup" class="hidden"><h2 class="text-2xl font-black text-white mb-1">Create Account</h2><p class="text-xs text-slate-400 mb-6">Start your 14-day free trial</p><div class="space-y-4"><div><label class="block text-xs font-bold text-slate-300 mb-1">Full Name</label><input type="text" placeholder="Alex Mercer" class="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"></div><div><label class="block text-xs font-bold text-slate-300 mb-1">Work Email</label><input type="email" placeholder="alex@company.com" class="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"></div><button onclick="alert('Account Created (Demo)')" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 font-extrabold text-sm text-white shadow-lg shadow-pink-500/25 hover:opacity-95 transition">Create Account &rarr;</button></div></div></div></main><footer class="border-t border-white/10 glass py-4 text-center text-xs text-slate-500">© 2026 NexusAuth Systems Inc. All rights reserved.</footer><script>function setTab(t){if(t==='login'){document.getElementById('view-login').classList.remove('hidden');document.getElementById('view-signup').classList.add('hidden');document.getElementById('tab-login').className='flex-1 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow';document.getElementById('tab-signup').className='flex-1 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-white';}else{document.getElementById('view-login').classList.add('hidden');document.getElementById('view-signup').classList.remove('hidden');document.getElementById('tab-signup').className='flex-1 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow';document.getElementById('tab-login').className='flex-1 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-white';}}function togglePass(id){var el=document.getElementById(id);el.type=el.type==='password'?'text':'password';}</script></body></html>`
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
          title: result.title || 'Generated UI',
          timestamp: 'Just now',
          tag: `${pageArchetype.toUpperCase()} (${singleFramework.toUpperCase()})`,
          prompt: prompt.slice(0, 65) + '...',
          result: result
        },
        ...prev.filter(b => b.id !== newBuildId).slice(0, 7)
      ]);
      setActiveBuildId(newBuildId);
    } catch (err) {
      console.error(err);
      alert('Generation error: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Handle Full Project Generation with AI
  const handleGenerateFullProject = async () => {
    setGenerating(true);
    setGenStatusText('1. Scaffolding project directory tree...');
    try {
      setTimeout(() => setGenStatusText('2. Injecting domain models & routes with AI...'), 1400);
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
          prompt: prompt.slice(0, 65) + '...',
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

  // Open Preview in Full Window
  const handleOpenInNewWindow = () => {
    if (!singlePageResult?.preview_html) return;
    const blob = new Blob([singlePageResult.preview_html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
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
      'Incorporate dark glassmorphic cards, glowing neon hover states, and smooth CSS micro-interactions.',
      'Add a sticky glass navbar, dynamic hero with gradient typography, 3 feature showcase cards, and interactive CTA buttons.',
      'Include responsive form inputs, password reveal toggle, social OAuth buttons, and clean TypeScript-ready JSX.'
    ];
    setPrompt(prev => `${prev.trim()} ${enhancements[Math.floor(Math.random() * enhancements.length)]}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>
      <Navbar />

      {/* Dynamic Ambient Background Glows */}
      <div style={{
        position: 'absolute',
        top: '4%',
        left: '18%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, rgba(99, 102, 241, 0.02) 70%, transparent 100%)',
        filter: 'blur(90px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <main style={{ flexGrow: 1, padding: '24px 0 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '1720px', margin: '0 auto', padding: '0 24px' }}>

          {/* TOP BAR / STUDIO HEADER */}
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
                width: '40px',
                height: '40px',
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
                <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
                  Project &amp; Single Page Studio
                </h1>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Architect UI pages &amp; repositories &bull; Live side-by-side interactive canvas
                </div>
              </div>
            </div>

            {/* Scope Switcher Pills: Single Page vs Full Project */}
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
                <span>Single Page Builder</span>
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

          {/* DUAL-PANE WORKSPACE */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(420px, 480px) 1fr',
            gap: '24px',
            alignItems: 'start'
          }}>

            {/* ======================================================== */}
            {/* LEFT COLUMN: Controls, Modular Options, Prompt & History */}
            {/* ======================================================== */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* MAIN CONFIGURATION CARD */}
              <div className="glass-card" style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)'
              }}>

                {/* 1. Page Archetype Selection (If Single Page Mode) */}
                {genMode === 'single' && (
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        1. Select Page Archetype
                      </label>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Choose layout style</span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px'
                    }}>
                      {PAGE_ARCHETYPES.map((arch) => {
                        const isSelected = pageArchetype === arch.id;
                        return (
                          <button
                            key={arch.id}
                            type="button"
                            onClick={() => handleSelectArchetype(arch)}
                            style={{
                              padding: '10px 8px',
                              borderRadius: '8px',
                              background: isSelected ? 'rgba(236, 72, 153, 0.15)' : 'var(--bg-secondary)',
                              border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                              color: isSelected ? '#fff' : 'var(--text-muted)',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '4px',
                              textAlign: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span style={{ fontSize: '18px' }}>{arch.icon}</span>
                            <span style={{ fontSize: '11.5px', fontWeight: isSelected ? 800 : 600 }}>{arch.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Prompt or Idea Input */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={13} color="var(--primary)" />
                      <span>{genMode === 'single' ? '2. Your Prompt or Idea' : '1. Project Specification'}</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleEnhancePrompt}
                      title="Enrich prompt with production architectural details"
                      style={{
                        background: 'rgba(236, 72, 153, 0.1)',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                        color: 'var(--accent-pink)',
                        padding: '3px 8px',
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
                      <span>AI Enhance</span>
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what to build or customize (e.g. Creative login with glass card, sticky navbar, show/hide password, and ambient background)..."
                    style={{
                      width: '100%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 12px',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      lineHeight: 1.5,
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* 3. Modular Sections Checkboxes (If Single Page Mode) */}
                {genMode === 'single' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                      3. Modular Sections to Include
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {AVAILABLE_SECTIONS.map((sec) => {
                        const isChecked = selectedSections.includes(sec.id);
                        return (
                          <button
                            key={sec.id}
                            type="button"
                            onClick={() => handleToggleSection(sec.id)}
                            style={{
                              padding: '5px 9px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: isChecked ? 'rgba(236, 72, 153, 0.12)' : 'var(--bg-secondary)',
                              border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border-subtle)'}`,
                              color: isChecked ? '#fff' : 'var(--text-muted)',
                              transition: 'all 0.12s ease'
                            }}
                          >
                            <span style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '3px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isChecked ? 'var(--primary)' : 'transparent',
                              border: `1px solid ${isChecked ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`,
                              color: '#fff',
                              fontSize: '9px'
                            }}>
                              {isChecked && '✓'}
                            </span>
                            <span>{sec.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. Fine-Tuning Options Grid */}
                {genMode === 'single' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
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
                          padding: '7px 9px',
                          color: 'var(--text-main)',
                          fontSize: '12px',
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
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
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
                          padding: '7px 9px',
                          color: 'var(--text-main)',
                          fontSize: '12px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {STYLES.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
                        Color Accent
                      </label>
                      <select
                        value={colorAccent}
                        onChange={(e) => setColorAccent(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '7px 9px',
                          color: 'var(--text-main)',
                          fontSize: '12px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {COLOR_THEMES.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
                        Custom Brand Name
                      </label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="e.g. NexusAuth (Optional)"
                        style={{
                          width: '100%',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '7px 9px',
                          color: 'var(--text-main)',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  /* Full Project Configuration Options */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
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
                            padding: '7px 9px',
                            color: 'var(--text-main)',
                            fontSize: '12px',
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
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
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
                            padding: '7px 9px',
                            color: 'var(--text-main)',
                            fontSize: '12px',
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
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
                        Repository / Service Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Project name (e.g. auth-gateway)"
                        style={{
                          width: '100%',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '7px 10px',
                          color: 'var(--text-main)',
                          fontSize: '12px',
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
                  style={{ width: '100%', padding: '12px', fontSize: '13.5px', fontWeight: 800, borderRadius: 'var(--radius-sm)' }}
                >
                  {generating ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>{genStatusText || 'Generating with AI...'}</span>
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
                padding: '16px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <History size={13} color="var(--primary)" />
                    <span>Pages &amp; Projects Built ({buildHistory.length})</span>
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>1-click view</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {buildHistory.map((item) => {
                    const isSelected = activeBuildId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectBuild(item)}
                        style={{
                          padding: '9px 12px',
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
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            background: item.mode === 'single' ? 'rgba(236,72,153,0.15)' : 'rgba(99,102,241,0.15)',
                            color: item.mode === 'single' ? 'var(--accent-pink)' : 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {item.mode === 'single' ? <Layout size={13} /> : <Box size={13} />}
                          </div>
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                              {item.tag} &bull; {item.timestamp}
                            </div>
                          </div>
                        </div>

                        <ChevronRight size={13} color={isSelected ? 'var(--primary)' : 'var(--text-dim)'} />
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: The Built Canvas / Live View / Code Studio */}
            {/* ======================================================== */}
            <div style={{ position: 'sticky', top: '80px' }}>
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
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'rgba(15, 23, 42, 0.65)',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  {/* Left: Window Chrome & Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f43f5e' }} />
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b' }} />
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981' }} />
                    </div>

                    <div style={{ height: '14px', width: '1px', background: 'var(--border-subtle)', margin: '0 2px' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <span className="badge badge-medium" style={{ fontSize: '9.5px', padding: '2px 6px' }}>
                        {genMode === 'single' ? pageArchetype.toUpperCase() : 'REPO'}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
                        {genMode === 'single' ? (singlePageResult?.title || 'Preview Canvas') : (name || 'Project Scaffold')}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions & Viewport Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    
                    {/* If Single Page: Toggle Live Preview vs Source Code */}
                    {genMode === 'single' && (
                      <div style={{
                        display: 'flex',
                        background: 'var(--bg-secondary)',
                        padding: '2px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        <button
                          type="button"
                          onClick={() => setPreviewTab('preview')}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            background: previewTab === 'preview' ? 'var(--primary)' : 'transparent',
                            color: previewTab === 'preview' ? '#fff' : 'var(--text-muted)',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={12} /> Live Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewTab('code')}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            background: previewTab === 'code' ? 'var(--primary)' : 'transparent',
                            color: previewTab === 'code' ? '#fff' : 'var(--text-muted)',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Code2 size={12} /> Source Code
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
                            padding: '4px 7px',
                            background: viewportMode === 'desktop' ? 'var(--bg-surface)' : 'transparent',
                            color: viewportMode === 'desktop' ? 'var(--primary)' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Monitor size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewportMode('tablet')}
                          title="Tablet (768px)"
                          style={{
                            padding: '4px 7px',
                            background: viewportMode === 'tablet' ? 'var(--bg-surface)' : 'transparent',
                            color: viewportMode === 'tablet' ? 'var(--primary)' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Tablet size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewportMode('mobile')}
                          title="Mobile (375px)"
                          style={{
                            padding: '4px 7px',
                            background: viewportMode === 'mobile' ? 'var(--bg-surface)' : 'transparent',
                            color: viewportMode === 'mobile' ? 'var(--primary)' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Smartphone size={13} />
                        </button>
                      </div>
                    )}

                    {/* Open In New Tab Button */}
                    {genMode === 'single' && (
                      <button
                        type="button"
                        onClick={handleOpenInNewWindow}
                        title="Open full page in new browser window"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-light)',
                          color: 'var(--text-muted)',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <ExternalLink size={12} />
                        <span>Pop Out</span>
                      </button>
                    )}

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyCode(genMode === 'single' ? (singlePageResult?.code || singlePageResult?.preview_html) : projectFiles[activeFile])}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-main)',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {copied ? <CheckCheck size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    {/* Download Button */}
                    {genMode === 'single' ? (
                      <button
                        type="button"
                        onClick={handleDownloadSinglePage}
                        className="btn-primary"
                        style={{ padding: '5px 12px', fontSize: '11.5px', borderRadius: '6px' }}
                      >
                        <Download size={12} />
                        <span>{downloadSuccess ? 'Downloaded!' : 'Download File'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleDownloadZip}
                        disabled={generating}
                        className="btn-primary"
                        style={{ padding: '5px 12px', fontSize: '11.5px', borderRadius: '6px' }}
                      >
                        <Download size={12} />
                        <span>{downloadSuccess ? 'Downloaded .ZIP!' : 'Download .ZIP'}</span>
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
                      padding: '12px 0',
                      minHeight: '680px',
                      overflowX: 'auto'
                    }}>
                      <iframe
                        title="AI Live Single Page Canvas"
                        srcDoc={singlePageResult?.preview_html || singlePageResult?.code}
                        style={{
                          width: viewportMode === 'mobile' ? '375px' : (viewportMode === 'tablet' ? '768px' : '100%'),
                          maxWidth: '100%',
                          height: '680px',
                          borderRadius: viewportMode === 'desktop' ? '0' : '8px',
                          border: viewportMode === 'desktop' ? 'none' : '1px solid rgba(255,255,255,0.15)',
                          boxShadow: viewportMode === 'desktop' ? 'none' : '0 20px 50px rgba(0,0,0,0.8)',
                          background: '#070913',
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
                      fontSize: '12.5px',
                      lineHeight: 1.6,
                      color: 'var(--text-main)',
                      height: '680px',
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
                    minHeight: '680px'
                  }}>
                    {/* Left: Project File Tree */}
                    <div style={{
                      background: 'rgba(10, 15, 29, 0.7)',
                      borderRight: '1px solid var(--border-subtle)',
                      padding: '12px',
                      maxHeight: '680px',
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
                      fontSize: '12.5px',
                      lineHeight: 1.6,
                      color: 'var(--text-main)',
                      maxHeight: '680px',
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
