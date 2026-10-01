import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Box, 
  Download, 
  FileCode, 
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
  ShieldCheck,
  Compass,
  Zap,
  Layers,
  Sparkle,
  Paintbrush,
  Tv,
  Check,
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
  { id: 'react', name: 'React 19 (JSX)', desc: 'Modular component with hooks' },
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

const NAVBAR_OPTIONS = [
  { id: 'sticky-glass', name: 'Sticky Glassmorphism', desc: 'Frosted blur with subtle border on scroll' },
  { id: 'floating-pill', name: 'Floating Capsule Pill', desc: 'Centered floating island header' },
  { id: 'minimal', name: 'Minimal Borderless', desc: 'Clean transparent header without lines' },
  { id: 'banner', name: 'With Announcement Bar', desc: 'Top alert bar + navigation' },
  { id: 'none', name: 'No Navbar', desc: 'Standalone centered canvas' }
];

const SIDEBAR_OPTIONS = [
  { id: 'none', name: 'No Sidebar (Full Width)', desc: 'Clean, open-space canvas' },
  { id: 'left-full', name: 'Left Expanded Sidebar', desc: 'Full icons with text labels & user profile' },
  { id: 'left-slim', name: 'Left Slim Icon Dock', desc: 'Compact 60px icon rail' },
  { id: 'right-drawer', name: 'Right Action Drawer', desc: 'Slide-out utility panel' }
];

const ANIMATION_OPTIONS = [
  { id: 'ambient-glow', name: 'Ambient Glowing Orbs', desc: 'Soft pulsating neon spheres' },
  { id: 'grid-mesh', name: 'Cyberpunk Grid Mesh', desc: 'Geometric subtle vector grid' },
  { id: 'particle-stars', name: 'Cosmic Particle Glow', desc: 'Subtle twinkling points' },
  { id: 'minimal-static', name: 'Clean Static (No Motion)', desc: 'Fast, high-contrast flat layout' }
];

const COLOR_THEMES = [
  { id: 'pink-indigo', name: 'Electric Pink & Violet', bg: '#070913', primary: '#ec4899', secondary: '#8b5cf6', preview: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
  { id: 'cyan-blue', name: 'Cyber Cyan & Cobalt', bg: '#060d17', primary: '#06b6d4', secondary: '#3b82f6', preview: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
  { id: 'emerald-mint', name: 'Emerald Matrix & Mint', bg: '#06110d', primary: '#10b981', secondary: '#34d399', preview: 'linear-gradient(135deg, #10b981, #34d399)' },
  { id: 'amber-orange', name: 'Sunset Flame & Amber', bg: '#120c06', primary: '#f59e0b', secondary: '#ef4444', preview: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { id: 'aurora-purple', name: 'Deep Aurora & Indigo', bg: '#080816', primary: '#6366f1', secondary: '#a855f7', preview: 'linear-gradient(135deg, #6366f1, #a855f7)' },
  { id: 'monochrome', name: 'Monochrome Silver', bg: '#090a0f', primary: '#f1f5f9', secondary: '#94a3b8', preview: 'linear-gradient(135deg, #f1f5f9, #94a3b8)' }
];

const BG_TONES = [
  { id: 'cosmic-dark', name: 'Cosmic Dark Navy (#070913)' },
  { id: 'pitch-black', name: 'Pure Pitch Black (#030712)' },
  { id: 'charcoal-slate', name: 'Charcoal Slate (#0f172a)' },
  { id: 'light-enterprise', name: 'Light Enterprise (#f8fafc)' }
];

const AVAILABLE_SECTIONS = [
  { id: 'navbar', label: 'Sticky Glass Navbar' },
  { id: 'hero', label: 'Hero Header' },
  { id: 'features', label: 'Feature Bento Grid' },
  { id: 'kpi', label: 'KPI Metric Cards' },
  { id: 'pricing', label: 'Pricing Table' },
  { id: 'testimonials', label: 'Social Proof' },
  { id: 'faq', label: 'FAQ Accordion' },
  { id: 'footer', label: 'Modern Footer' }
];

export default function ProjectGenerator() {
  const navigate = useNavigate();

  // Mode: 'single' (Single Page / Component) or 'project' (Full Project Repository)
  const [genMode, setGenMode] = useState('single');

  // Archetype & Options
  const [pageArchetype, setPageArchetype] = useState('auth');
  const [selectedSections, setSelectedSections] = useState(['navbar', 'hero', 'footer']);
  const [colorAccent, setColorAccent] = useState('pink-indigo');
  const [bgTone, setBgTone] = useState('cosmic-dark');
  const [navbarStyle, setNavbarStyle] = useState('sticky-glass');
  const [sidebarStyle, setSidebarStyle] = useState('none');
  const [animationStyle, setAnimationStyle] = useState('ambient-glow');
  const [brandName, setBrandName] = useState('');
  const [typography, setTypography] = useState('modern-sans');

  // Prompt / Idea
  const [prompt, setPrompt] = useState('Build a creative login and signup page with a sticky glass navbar, animated ambient background orbs, email and password inputs with reveal eye toggle, and social sign in buttons.');

  // Single Page Configs
  const [singleFramework, setSingleFramework] = useState('react');
  const [previewTab, setPreviewTab] = useState('preview'); // 'preview' or 'code'
  const [viewportMode, setViewportMode] = useState('desktop'); // 'desktop', 'tablet', 'mobile'

  // Full Project Configs
  const [name, setName] = useState('codelens-service');
  const [stack, setStack] = useState('react');
  const [database, setDatabase] = useState('postgres');
  const [includeDocker, setIncludeDocker] = useState(true);
  const [includeCi, setIncludeCi] = useState(true);

  // Active Options Accordion Tab on Left
  const [activeTabSection, setActiveTabSection] = useState('archetype'); // 'archetype', 'layout', 'design', 'sections'

  // States
  const [generating, setGenerating] = useState(false);
  const [genStatusText, setGenStatusText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Single Page Result: Starts NULL so no page is auto-rendered on initial load!
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

  // Build History
  const [buildHistory, setBuildHistory] = useState([]);
  const [activeBuildId, setActiveBuildId] = useState(null);

  const fileKeys = Object.keys(projectFiles);
  const activeFile = selectedFile && projectFiles[selectedFile] ? selectedFile : fileKeys[0];

  // When user clicks an archetype card
  const handleSelectArchetype = (arch) => {
    setPageArchetype(arch.id);
    setPrompt(arch.defaultPrompt);
    if (arch.defaultSections) {
      setSelectedSections(arch.defaultSections);
    }
    if (arch.id === 'dashboard') {
      setSidebarStyle('left-full');
    } else {
      setSidebarStyle('none');
    }
  };

  // Toggle section checkbox
  const handleToggleSection = (secId) => {
    setSelectedSections(prev => 
      prev.includes(secId) ? prev.filter(s => s !== secId) : [...prev, secId]
    );
  };

  // Handle AI Single Page Generation
  const handleGenerateSinglePage = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setGenStatusText('1. Analyzing layout & modular options...');
    try {
      setTimeout(() => setGenStatusText('2. Applying styling, navbar & animations...'), 1000);
      setTimeout(() => setGenStatusText('3. Assembling interactive live preview...'), 2000);
      const result = await projectGenerator.generateAISinglePage({
        prompt,
        framework: singleFramework,
        style: 'modern-dark',
        page_type: pageArchetype,
        sections: selectedSections,
        color_accent: colorAccent,
        brand_name: brandName,
        navbar_style: navbarStyle,
        sidebar_style: sidebarStyle,
        animation_style: animationStyle,
        bg_tone: bgTone,
        typography
      });

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

  const selectedThemeObj = COLOR_THEMES.find(t => t.id === colorAccent) || COLOR_THEMES[0];
  const selectedArchObj = PAGE_ARCHETYPES.find(a => a.id === pageArchetype) || PAGE_ARCHETYPES[0];

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
            marginBottom: '22px',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: 'var(--primary-glow)'
              }}>
                <Wand2 size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
                  Project &amp; Single Page Studio
                </h1>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Step 1: Select scope &bull; Step 2: Configure options &bull; Step 3: Generate &amp; preview live
                </div>
              </div>
            </div>

            {/* Scope Switcher: Single Page vs Full Project */}
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
                  padding: '8px 18px',
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
                  padding: '8px 18px',
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
            gridTemplateColumns: 'minmax(440px, 500px) 1fr',
            gap: '24px',
            alignItems: 'start'
          }}>

            {/* ======================================================== */}
            {/* LEFT COLUMN: Controls, Modular Options, Prompt & History */}
            {/* ======================================================== */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* MAIN CONFIGURATION CARD */}
              <div className="glass-card" style={{
                padding: '22px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)'
              }}>

                {/* Prompt or Idea Input */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={13} color="var(--primary)" />
                      <span>{genMode === 'single' ? 'Your Prompt / Custom Specification' : 'Project Idea / Specification'}</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleEnhancePrompt}
                      title="Enrich prompt with production architectural details"
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
                      <span>Enhance Idea</span>
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what to build (e.g. Creative login and signup page with sticky glass navbar, animated ambient background orbs, email and password inputs with reveal eye toggle)..."
                    style={{
                      width: '100%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '11px 13px',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      lineHeight: 1.5,
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* IF SINGLE PAGE: TABBED MODULAR CONFIGURATOR */}
                {genMode === 'single' ? (
                  <div>
                    {/* Navigation Pills to Switch Sub-Panels */}
                    <div style={{
                      display: 'flex',
                      background: 'var(--bg-secondary)',
                      padding: '3px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '16px',
                      gap: '2px'
                    }}>
                      <button
                        type="button"
                        onClick={() => setActiveTabSection('archetype')}
                        style={{
                          flex: 1,
                          padding: '6px 4px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: 'none',
                          background: activeTabSection === 'archetype' ? 'var(--bg-surface)' : 'transparent',
                          color: activeTabSection === 'archetype' ? 'var(--primary)' : 'var(--text-muted)',
                          boxShadow: activeTabSection === 'archetype' ? '0 1px 4px rgba(0,0,0,0.4)' : 'none'
                        }}
                      >
                        1. Type
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTabSection('layout')}
                        style={{
                          flex: 1,
                          padding: '6px 4px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: 'none',
                          background: activeTabSection === 'layout' ? 'var(--bg-surface)' : 'transparent',
                          color: activeTabSection === 'layout' ? 'var(--primary)' : 'var(--text-muted)',
                          boxShadow: activeTabSection === 'layout' ? '0 1px 4px rgba(0,0,0,0.4)' : 'none'
                        }}
                      >
                        2. Nav &amp; Side
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTabSection('design')}
                        style={{
                          flex: 1,
                          padding: '6px 4px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: 'none',
                          background: activeTabSection === 'design' ? 'var(--bg-surface)' : 'transparent',
                          color: activeTabSection === 'design' ? 'var(--primary)' : 'var(--text-muted)',
                          boxShadow: activeTabSection === 'design' ? '0 1px 4px rgba(0,0,0,0.4)' : 'none'
                        }}
                      >
                        3. Colors &amp; FX
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTabSection('sections')}
                        style={{
                          flex: 1,
                          padding: '6px 4px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: 'none',
                          background: activeTabSection === 'sections' ? 'var(--bg-surface)' : 'transparent',
                          color: activeTabSection === 'sections' ? 'var(--primary)' : 'var(--text-muted)',
                          boxShadow: activeTabSection === 'sections' ? '0 1px 4px rgba(0,0,0,0.4)' : 'none'
                        }}
                      >
                        4. Sections
                      </button>
                    </div>

                    {/* SUB-PANEL 1: ARCHETYPE & FRAMEWORK */}
                    {activeTabSection === 'archetype' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                            SELECT PAGE ARCHETYPE
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {PAGE_ARCHETYPES.map((arch) => {
                              const isSelected = pageArchetype === arch.id;
                              return (
                                <button
                                  key={arch.id}
                                  type="button"
                                  onClick={() => handleSelectArchetype(arch)}
                                  style={{
                                    padding: '10px 6px',
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
                                  <span style={{ fontSize: '11px', fontWeight: isSelected ? 800 : 600 }}>{arch.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
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
                                outline: 'none'
                              }}
                            >
                              {SINGLE_PAGE_FRAMEWORKS.map(f => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                              Brand / Product Name
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
                                padding: '7px 10px',
                                color: 'var(--text-main)',
                                fontSize: '12px',
                                outline: 'none'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-PANEL 2: NAVBAR & SIDEBAR CUSTOMIZATION */}
                    {activeTabSection === 'layout' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                            NAVBAR STYLE
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                            {NAVBAR_OPTIONS.map((nav) => {
                              const isSel = navbarStyle === nav.id;
                              return (
                                <button
                                  key={nav.id}
                                  type="button"
                                  onClick={() => setNavbarStyle(nav.id)}
                                  style={{
                                    padding: '8px 10px',
                                    borderRadius: '6px',
                                    textAlign: 'left',
                                    background: isSel ? 'rgba(236, 72, 153, 0.12)' : 'var(--bg-secondary)',
                                    border: `1px solid ${isSel ? 'var(--primary)' : 'var(--border-subtle)'}`,
                                    color: isSel ? '#fff' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '11.5px',
                                    fontWeight: isSel ? 700 : 500
                                  }}
                                >
                                  {nav.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                            SIDEBAR LAYOUT
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                            {SIDEBAR_OPTIONS.map((side) => {
                              const isSel = sidebarStyle === side.id;
                              return (
                                <button
                                  key={side.id}
                                  type="button"
                                  onClick={() => setSidebarStyle(side.id)}
                                  style={{
                                    padding: '8px 10px',
                                    borderRadius: '6px',
                                    textAlign: 'left',
                                    background: isSel ? 'rgba(236, 72, 153, 0.12)' : 'var(--bg-secondary)',
                                    border: `1px solid ${isSel ? 'var(--primary)' : 'var(--border-subtle)'}`,
                                    color: isSel ? '#fff' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '11.5px',
                                    fontWeight: isSel ? 700 : 500
                                  }}
                                >
                                  {side.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-PANEL 3: COLORS & ANIMATION EFFECTS */}
                    {activeTabSection === 'design' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                            ACCENT COLOR PALETTE
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                            {COLOR_THEMES.map((theme) => {
                              const isSel = colorAccent === theme.id;
                              return (
                                <button
                                  key={theme.id}
                                  type="button"
                                  onClick={() => setColorAccent(theme.id)}
                                  style={{
                                    padding: '7px 8px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: isSel ? 'rgba(236, 72, 153, 0.15)' : 'var(--bg-secondary)',
                                    border: `1px solid ${isSel ? 'var(--primary)' : 'var(--border-subtle)'}`,
                                    color: isSel ? '#fff' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                    fontWeight: isSel ? 700 : 500
                                  }}
                                >
                                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: theme.preview, flexShrink: 0 }} />
                                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{theme.name.split(' ')[0]}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                            ANIMATIONS &amp; VISUAL EFFECTS
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                            {ANIMATION_OPTIONS.map((anim) => {
                              const isSel = animationStyle === anim.id;
                              return (
                                <button
                                  key={anim.id}
                                  type="button"
                                  onClick={() => setAnimationStyle(anim.id)}
                                  style={{
                                    padding: '7px 9px',
                                    borderRadius: '6px',
                                    textAlign: 'left',
                                    background: isSel ? 'rgba(236, 72, 153, 0.12)' : 'var(--bg-secondary)',
                                    border: `1px solid ${isSel ? 'var(--primary)' : 'var(--border-subtle)'}`,
                                    color: isSel ? '#fff' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                    fontWeight: isSel ? 700 : 500
                                  }}
                                >
                                  {anim.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                              Canvas Backdrop
                            </label>
                            <select
                              value={bgTone}
                              onChange={(e) => setBgTone(e.target.value)}
                              style={{
                                width: '100%',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '6px',
                                padding: '6px 8px',
                                color: 'var(--text-main)',
                                fontSize: '11px',
                                outline: 'none'
                              }}
                            >
                              {BG_TONES.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                              Typography
                            </label>
                            <select
                              value={typography}
                              onChange={(e) => setTypography(e.target.value)}
                              style={{
                                width: '100%',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '6px',
                                padding: '6px 8px',
                                color: 'var(--text-main)',
                                fontSize: '11px',
                                outline: 'none'
                              }}
                            >
                              <option value="modern-sans">Plus Jakarta Sans</option>
                              <option value="inter">Inter (SaaS Standard)</option>
                              <option value="tech-mono">JetBrains Mono</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-PANEL 4: MODULAR SECTIONS TO INCLUDE */}
                    {activeTabSection === 'sections' && (
                      <div style={{ marginBottom: '18px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                          TOGGLE COMPONENT SECTIONS
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {AVAILABLE_SECTIONS.map((sec) => {
                            const isChecked = selectedSections.includes(sec.id);
                            return (
                              <button
                                key={sec.id}
                                type="button"
                                onClick={() => handleToggleSection(sec.id)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  background: isChecked ? 'rgba(236, 72, 153, 0.12)' : 'var(--bg-secondary)',
                                  border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border-subtle)'}`,
                                  color: isChecked ? '#fff' : 'var(--text-muted)',
                                  transition: 'all 0.12s ease'
                                }}
                              >
                                <span style={{
                                  width: '13px',
                                  height: '13px',
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
                  </div>
                ) : (
                  /* FULL PROJECT CONFIGURATION PANEL */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
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
                  onClick={genMode === 'single' ? handleGenerateSinglePage : handleGenerateFullProject}
                  disabled={generating || !prompt.trim()}
                  className="btn-primary"
                  style={{ width: '100%', padding: '13px', fontSize: '14px', fontWeight: 800, borderRadius: 'var(--radius-sm)' }}
                >
                  {generating ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>{genStatusText || 'Generating with AI...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>{genMode === 'single' ? 'Generate Single Page UI' : 'Scaffold Full Project Repository'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* BUILT PAGES & PROJECTS SIDE-LIST */}
              {buildHistory.length > 0 && (
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
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Click to view</span>
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
              )}

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
                        {genMode === 'single' ? (singlePageResult?.title || 'Interactive Canvas') : (name || 'Project Scaffold')}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions & Viewport Controls (Shown when result is available) */}
                  {singlePageResult && genMode === 'single' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      
                      {/* Toggle Live Preview vs Source Code */}
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

                      {/* Viewport switchers in Live Preview mode */}
                      {previewTab === 'preview' && (
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

                      {/* Copy Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyCode(singlePageResult?.code || singlePageResult?.preview_html)}
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
                      <button
                        type="button"
                        onClick={handleDownloadSinglePage}
                        className="btn-primary"
                        style={{ padding: '5px 12px', fontSize: '11.5px', borderRadius: '6px' }}
                      >
                        <Download size={12} />
                        <span>{downloadSuccess ? 'Downloaded!' : 'Download File'}</span>
                      </button>
                    </div>
                  )}

                  {/* Project Mode Actions */}
                  {genMode === 'project' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(projectFiles[activeFile])}
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
                        <span>{copied ? 'Copied' : 'Copy File'}</span>
                      </button>

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
                    </div>
                  )}
                </div>

                {/* Canvas Main Body */}
                {genMode === 'single' ? (
                  /* SINGLE PAGE CANVAS */
                  singlePageResult ? (
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
                    /* INITIAL CLEAN BLUEPRINT PLACEHOLDER (NOT auto-rendering any page!) */
                    <div style={{
                      minHeight: '680px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px 24px',
                      background: 'radial-gradient(circle at 50% 35%, rgba(236,72,153,0.06) 0%, #070913 70%)',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Decorative grid pattern */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                        opacity: 0.3,
                        pointerEvents: 'none'
                      }} />

                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        marginBottom: '18px',
                        boxShadow: '0 0 35px rgba(236, 72, 153, 0.2)'
                      }}>
                        {selectedArchObj.icon}
                      </div>

                      <div className="badge badge-medium" style={{ marginBottom: '12px', fontSize: '11px', padding: '3px 10px' }}>
                        STUDIO CANVAS READY
                      </div>

                      <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                        Configure Your Architecture &amp; Generate
                      </h2>

                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '440px', lineHeight: 1.6, marginBottom: '28px' }}>
                        Select your archetype, navbar, colors, and animations on the left, refine your prompt, then click <strong style={{ color: '#fff' }}>Generate Single Page UI</strong> to view your interactive live preview here.
                      </p>

                      {/* Active Configuration Blueprint Badges */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '8px',
                        maxWidth: '520px',
                        marginBottom: '32px'
                      }}>
                        <div style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '11.5px',
                          color: 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{ color: 'var(--primary)' }}>●</span> Archetype: <strong>{selectedArchObj.name}</strong>
                        </div>

                        <div style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '11.5px',
                          color: 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedThemeObj.preview }} />
                          Color: <strong>{selectedThemeObj.name.split(' ')[0]}</strong>
                        </div>

                        <div style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '11.5px',
                          color: 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span>📌</span> Navbar: <strong>{navbarStyle}</strong>
                        </div>

                        <div style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '11.5px',
                          color: 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span>✨</span> FX: <strong>{animationStyle}</strong>
                        </div>
                      </div>

                      {/* Instant Generate Button */}
                      <button
                        type="button"
                        onClick={handleGenerateSinglePage}
                        disabled={generating || !prompt.trim()}
                        className="btn-primary"
                        style={{ padding: '12px 28px', fontSize: '14px', borderRadius: '8px' }}
                      >
                        <Sparkles size={16} />
                        <span>Generate Single Page UI &rarr;</span>
                      </button>
                    </div>
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
