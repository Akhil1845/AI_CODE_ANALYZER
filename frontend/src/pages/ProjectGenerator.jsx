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
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  FolderTree,
  Maximize2
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
    name: 'Auth & 2FA Portal', 
    icon: '🔐', 
    desc: 'Dual-tab Login, Sign Up, 2FA OTP & OAuth',
    defaultSections: ['navbar', 'hero', 'form', 'footer'],
    defaultPrompt: 'Build a creative login and signup page with a sticky glass navbar, animated ambient background orbs, email and password inputs with reveal eye toggle, and social sign in buttons.'
  },
  { 
    id: 'landing', 
    name: 'SaaS Landing Page', 
    icon: '🚀', 
    desc: 'Hero showcase, bento grid & conversion CTA',
    defaultSections: ['navbar', 'hero', 'features', 'pricing', 'cta', 'footer'],
    defaultPrompt: 'Create a high-converting, dark-themed SaaS landing page for an AI code observability platform with sticky navbar, hero section, 3 feature cards, pricing tiers, and FAQ accordion.'
  },
  { 
    id: 'dashboard', 
    name: 'Analytics Dashboard', 
    icon: '📊', 
    desc: 'Telemetry KPI cards, SVG charts & logs',
    defaultSections: ['navbar', 'kpi', 'chart', 'table', 'footer'],
    defaultPrompt: 'Build a dark glassmorphic observability analytics dashboard with a cluster telemetry overview, 4 real-time KPI metric cards, and a recent deployment activity table.'
  },
  { 
    id: 'ecommerce', 
    name: 'E-Commerce Storefront', 
    icon: '🛒', 
    desc: 'Product cards, filter tags & cart counter',
    defaultSections: ['navbar', 'hero', 'features', 'cta', 'footer'],
    defaultPrompt: 'Generate a modern e-commerce storefront for developer hardware gear with category filter pills, product grid with price tags, star ratings, and an interactive Add to Cart counter.'
  },
  { 
    id: 'pricing', 
    name: 'Pricing Matrix', 
    icon: '💎', 
    desc: '3 Tier cards, billing switch & features',
    defaultSections: ['navbar', 'hero', 'pricing', 'faq', 'footer'],
    defaultPrompt: 'Build a high-conversion pricing comparison matrix with monthly and annual billing toggle, 3 tier cards with a highlighted Pro plan, and comprehensive feature checklists.'
  },
  { 
    id: 'portfolio', 
    name: 'Developer Portfolio', 
    icon: '💼', 
    desc: 'Hero bio, tech stack tags & project cards',
    defaultSections: ['hero', 'features', 'form', 'footer'],
    defaultPrompt: 'Create an ultra-sleek developer portfolio with an animated hero statement, interactive tech stack tags, project showcase cards with live demo links, and a clean contact form.'
  },
  {
    id: 'docs',
    name: 'API Documentation',
    icon: '📑',
    desc: 'Sidebar tree, code blocks & endpoints',
    defaultSections: ['navbar', 'features', 'table', 'footer'],
    defaultPrompt: 'Generate a high-density developer API documentation screen with nested sidebar navigation, REST endpoints table, code snippets with copy button, and request payload examples.'
  },
  {
    id: 'admin',
    name: 'Admin User Directory',
    icon: '🏢',
    desc: 'Searchable table, role badges & actions',
    defaultSections: ['navbar', 'kpi', 'table', 'footer'],
    defaultPrompt: 'Create an enterprise admin user management dashboard with search and role filters, user list table with status chips, invite modal button, and account deletion safeguard.'
  }
];

// 18+ Comprehensive Color Palettes
const COLOR_THEMES = [
  // Neon & Cyber
  { id: 'pink-indigo', group: 'Neon & Cyber', name: 'Electric Pink & Violet', primary: '#ec4899', secondary: '#8b5cf6', preview: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
  { id: 'cyan-blue', group: 'Neon & Cyber', name: 'Cyber Cyan & Cobalt', primary: '#06b6d4', secondary: '#3b82f6', preview: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
  { id: 'matrix-lime', group: 'Neon & Cyber', name: 'Matrix Neon Lime', primary: '#10b981', secondary: '#22c55e', preview: 'linear-gradient(135deg, #10b981, #22c55e)' },
  { id: 'synthwave-magenta', group: 'Neon & Cyber', name: 'Synthwave Magenta', primary: '#d946ef', secondary: '#8b5cf6', preview: 'linear-gradient(135deg, #d946ef, #8b5cf6)' },
  { id: 'tokyo-neon', group: 'Neon & Cyber', name: 'Tokyo Neon Rose', primary: '#f43f5e', secondary: '#fb7185', preview: 'linear-gradient(135deg, #f43f5e, #fb7185)' },
  { id: 'cyber-gold', group: 'Neon & Cyber', name: 'Cyber Gold Flame', primary: '#eab308', secondary: '#f97316', preview: 'linear-gradient(135deg, #eab308, #f97316)' },

  // Modern SaaS & Tech
  { id: 'hyperion-indigo', group: 'Modern SaaS', name: 'Hyperion Blurple', primary: '#6366f1', secondary: '#4f46e5', preview: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  { id: 'deep-ocean', group: 'Modern SaaS', name: 'Deep Ocean Blue', primary: '#2563eb', secondary: '#1d4ed8', preview: 'linear-gradient(135deg, #2563eb, #1d4ed8)' },
  { id: 'nordic-emerald', group: 'Modern SaaS', name: 'Nordic Emerald', primary: '#059669', secondary: '#10b981', preview: 'linear-gradient(135deg, #059669, #10b981)' },
  { id: 'sunset-blaze', group: 'Modern SaaS', name: 'Sunset Amber Blaze', primary: '#f97316', secondary: '#ef4444', preview: 'linear-gradient(135deg, #f97316, #ef4444)' },
  { id: 'crimson-wine', group: 'Modern SaaS', name: 'Crimson Wine', primary: '#e11d48', secondary: '#be123c', preview: 'linear-gradient(135deg, #e11d48, #be123c)' },
  { id: 'teal-pulse', group: 'Modern SaaS', name: 'Teal Pulse Wave', primary: '#14b8a6', secondary: '#06b6d4', preview: 'linear-gradient(135deg, #14b8a6, #06b6d4)' },

  // Luxury & Monochrome
  { id: 'monochrome-titanium', group: 'Luxury Minimal', name: 'Monochrome Titanium', primary: '#f8fafc', secondary: '#94a3b8', preview: 'linear-gradient(135deg, #f8fafc, #94a3b8)' },
  { id: 'champagne-gold', group: 'Luxury Minimal', name: 'Champagne Gold', primary: '#f59e0b', secondary: '#78350f', preview: 'linear-gradient(135deg, #f59e0b, #78350f)' },
  { id: 'aurora-tri', group: 'Luxury Minimal', name: 'Midnight Aurora Tri-Tone', primary: '#ec4899', secondary: '#38bdf8', preview: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #38bdf8 100%)' },
  { id: 'holographic-prism', group: 'Luxury Minimal', name: 'Holographic Prism', primary: '#06b6d4', secondary: '#facc15', preview: 'linear-gradient(135deg, #06b6d4 0%, #ec4899 50%, #facc15 100%)' },
  { id: 'slate-steel', group: 'Luxury Minimal', name: 'Slate Steel Grey', primary: '#64748b', secondary: '#475569', preview: 'linear-gradient(135deg, #64748b, #475569)' },
  { id: 'emerald-gold', group: 'Luxury Minimal', name: 'Emerald & Gold Luxury', primary: '#10b981', secondary: '#fbbf24', preview: 'linear-gradient(135deg, #10b981, #fbbf24)' }
];

const BG_TONES = [
  { id: 'cosmic-dark', name: 'Cosmic Dark Navy (#070913)' },
  { id: 'pitch-black', name: 'OLED Pitch Black (#000000)' },
  { id: 'charcoal-slate', name: 'Charcoal Slate (#0f172a)' },
  { id: 'deep-space', name: 'Deep Space Navy (#0a0f1d)' },
  { id: 'cyber-metal', name: 'Cyber Metal Zinc (#18181b)' },
  { id: 'light-enterprise', name: 'Light Modern Enterprise (#f8fafc)' }
];

// 10 Distinct Navbar Variations
const NAVBAR_OPTIONS = [
  { id: 'sticky-glass', name: 'Sticky Glassmorphism', desc: 'Frosted blur with subtle hairline border on scroll' },
  { id: 'floating-pill', name: 'Floating Capsule Pill', desc: 'Centered rounded-full floating island header' },
  { id: 'minimal', name: 'Minimal Borderless', desc: 'Clean transparent header without dividing borders' },
  { id: 'banner', name: 'With Announcement Bar', desc: 'Top alert promo ribbon on top + navigation' },
  { id: 'search-cmd', name: 'Search-First Command Bar', desc: 'Center search input with Ctrl+K shortcut badge' },
  { id: 'split-hamburger', name: 'Split Minimal Hamburger', desc: 'Logo left, full-screen slide hamburger drawer right' },
  { id: 'mega-nav', name: 'Enterprise Mega-Nav', desc: 'Multi-category dropdown columns for solutions' },
  { id: 'ecommerce-nav', name: 'E-Commerce Commercial Nav', desc: 'Category links, currency picker, Cart badge' },
  { id: 'devops-bar', name: 'DevOps Terminal Header', desc: 'Monospace prompt, git branch tag, cluster status indicator' },
  { id: 'none', name: 'No Navbar (Clean Canvas)', desc: 'Standalone centered screen with no top bar' }
];

// 8 Distinct Sidebar Variations
const SIDEBAR_OPTIONS = [
  { id: 'none', name: 'No Sidebar (Full Width Canvas)', desc: 'Clean open-space edge-to-edge layout' },
  { id: 'left-full', name: 'Left Expanded Modern Tree', desc: 'Full icons with text labels & user profile badge' },
  { id: 'left-slim', name: 'Left Slim Icon Dock (64px)', desc: 'Compact icon rail with tooltips on hover' },
  { id: 'left-floating', name: 'Left Floating Glass Island', desc: 'Detached rounded glass dock with blur' },
  { id: 'right-drawer', name: 'Right Utility Action Drawer', desc: 'Slide-out utility inspector for telemetry/filters' },
  { id: 'file-tree', name: 'IDE File Explorer Tree', desc: 'Nested folder hierarchy with file status dots' },
  { id: 'ai-copilot', name: 'Embedded AI Copilot Drawer', desc: 'Chat assistant sidebar panel' },
  { id: 'dual-deck', name: 'Double-Deck Dual Sidebar', desc: 'Primary slim rail + secondary expandable submenu' }
];

// Visual FX & Animations
const BG_ANIMATIONS = [
  { id: 'ambient-glow', name: 'Ambient Glowing Orbs', desc: 'Soft pulsating neon gradient spheres' },
  { id: 'grid-mesh', name: 'Cyberpunk Perspective Grid', desc: 'Geometric vector grid receding into horizon' },
  { id: 'particle-stars', name: 'Cosmic Particle Constellation', desc: 'Subtle twinkling star points' },
  { id: 'aurora-wave', name: 'Aurora Wave Gradient', desc: 'Shifting multicolored ribbon wave' },
  { id: 'dot-matrix', name: 'Technical Dot Matrix', desc: 'High-tech precision dot canvas' },
  { id: 'minimal-static', name: 'Clean Static (Zero Motion)', desc: 'High-performance flat layout' }
];

const HOVER_FX = [
  { id: 'neon-pulse', name: 'Neon Glow Pulse on Hover' },
  { id: 'lift-3d', name: 'Smooth 3D Lift & Elevation' },
  { id: 'border-shimmer', name: 'Glass Border Shimmer Highlight' },
  { id: 'flat-subtle', name: 'Subtle Flat Shift (No Motion)' }
];

// 12 Modular Section Blocks
const MODULAR_SECTIONS = [
  { id: 'navbar', label: 'Navbar Header' },
  { id: 'hero', label: 'Hero Banner' },
  { id: 'features', label: 'Feature Bento Grid' },
  { id: 'kpi', label: 'KPI Metric Cards' },
  { id: 'chart', label: 'Chart / Graph Container' },
  { id: 'pricing', label: 'Pricing Table' },
  { id: 'testimonials', label: 'Social Proof Marquee' },
  { id: 'faq', label: 'FAQ Accordion' },
  { id: 'form', label: 'Interactive Form / Auth' },
  { id: 'table', label: 'Audit Log / Data Table' },
  { id: 'cta', label: 'Call To Action Banner' },
  { id: 'footer', label: 'Multi-Column Footer' }
];

export default function ProjectGenerator() {
  const navigate = useNavigate();

  // Mode: 'single' (Single Page / Component) or 'project' (Full Project Repository)
  const [genMode, setGenMode] = useState('single');

  // Archetype & Options
  const [pageArchetype, setPageArchetype] = useState('auth');
  const [selectedSections, setSelectedSections] = useState(['navbar', 'hero', 'form', 'footer']);
  const [colorAccent, setColorAccent] = useState('pink-indigo');
  const [customColor, setCustomColor] = useState('');
  const [useCustomColor, setUseCustomColor] = useState(false);
  const [bgTone, setBgTone] = useState('cosmic-dark');
  const [navbarStyle, setNavbarStyle] = useState('sticky-glass');
  const [sidebarStyle, setSidebarStyle] = useState('none');
  const [animationStyle, setAnimationStyle] = useState('ambient-glow');
  const [hoverFx, setHoverFx] = useState('neon-pulse');
  const [brandName, setBrandName] = useState('');
  const [typography, setTypography] = useState('modern-sans');
  const [buttonShape, setButtonShape] = useState('rounded-xl');
  const [glassIntensity, setGlassIntensity] = useState('deep-frosted');

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

  // Active Options Tab on Left
  const [activeTabSection, setActiveTabSection] = useState('archetype'); 
  // 'archetype', 'colors', 'navbar', 'sidebar', 'animations', 'sections', 'styling'

  // States
  const [generating, setGenerating] = useState(false);
  const [genStatusText, setGenStatusText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Single Page Result: Starts NULL so NO page is auto-rendered on initial load!
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

  // When user selects an archetype card
  const handleSelectArchetype = (arch) => {
    setPageArchetype(arch.id);
    setPrompt(arch.defaultPrompt);
    if (arch.defaultSections) {
      setSelectedSections(arch.defaultSections);
    }
    if (arch.id === 'dashboard' || arch.id === 'admin') {
      setSidebarStyle('left-full');
    } else if (arch.id === 'docs') {
      setSidebarStyle('file-tree');
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

  const handleSelectAllSections = () => {
    setSelectedSections(MODULAR_SECTIONS.map(s => s.id));
  };

  const handleResetSections = () => {
    const arch = PAGE_ARCHETYPES.find(a => a.id === pageArchetype);
    if (arch?.defaultSections) {
      setSelectedSections(arch.defaultSections);
    }
  };

  // Handle AI Single Page Generation
  const handleGenerateSinglePage = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setGenStatusText('1. Synthesizing archetype & modular parameters...');
    try {
      setTimeout(() => setGenStatusText('2. Applying palette, navbar & animation shaders...'), 1100);
      setTimeout(() => setGenStatusText('3. Assembling interactive responsive UI...'), 2200);
      const result = await projectGenerator.generateAISinglePage({
        prompt,
        framework: singleFramework,
        style: 'modern-dark',
        page_type: pageArchetype,
        sections: selectedSections,
        color_accent: colorAccent,
        custom_color: useCustomColor && customColor ? customColor : null,
        brand_name: brandName,
        navbar_style: navbarStyle,
        sidebar_style: sidebarStyle,
        animation_style: animationStyle,
        hover_fx: hoverFx,
        bg_tone: bgTone,
        typography,
        button_shape: buttonShape,
        glass_intensity: glassIntensity
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
        ...prev.filter(b => b.id !== newBuildId).slice(0, 9)
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
        ...prev.filter(b => b.id !== newBuildId).slice(0, 9)
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
  const selectedNavbarObj = NAVBAR_OPTIONS.find(n => n.id === navbarStyle) || NAVBAR_OPTIONS[0];
  const selectedSidebarObj = SIDEBAR_OPTIONS.find(s => s.id === sidebarStyle) || SIDEBAR_OPTIONS[0];

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
        <div style={{ width: '100%', maxWidth: '1740px', margin: '0 auto', padding: '0 24px' }}>

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
                  Deep customizer: 18+ palettes, 10 navbar styles, 8 sidebars, visual FX &amp; modular blocks
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
            gridTemplateColumns: 'minmax(460px, 520px) 1fr',
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

                {/* IF SINGLE PAGE: TABBED DEEP CONFIGURATOR */}
                {genMode === 'single' ? (
                  <div>
                    {/* Navigation Pills to Switch Sub-Panels */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      background: 'var(--bg-secondary)',
                      padding: '3px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '16px',
                      gap: '3px'
                    }}>
                      {[
                        { id: 'archetype', label: '1. Archetype' },
                        { id: 'colors', label: '2. Colors' },
                        { id: 'navbar', label: '3. Navbar' },
                        { id: 'sidebar', label: '4. Sidebar' },
                        { id: 'animations', label: '5. Animations' },
                        { id: 'sections', label: '6. Sections' },
                        { id: 'styling', label: '7. Styles' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTabSection(tab.id)}
                          style={{
                            flex: '1 1 auto',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: 'none',
                            background: activeTabSection === tab.id ? 'var(--primary)' : 'transparent',
                            color: activeTabSection === tab.id ? '#fff' : 'var(--text-muted)',
                            boxShadow: activeTabSection === tab.id ? '0 1px 4px rgba(236,72,153,0.3)' : 'none',
                            transition: 'all 0.12s ease'
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* SUB-PANEL 1: ARCHETYPES & SCOPE */}
                    {activeTabSection === 'archetype' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                            SELECT PAGE ARCHETYPE ({PAGE_ARCHETYPES.length})
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
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
                                  <span style={{ fontSize: '20px' }}>{arch.icon}</span>
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

                    {/* SUB-PANEL 2: 18+ COLOR PALETTES & BACKDROP */}
                    {activeTabSection === 'colors' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                              CURATED ACCENT PALETTES ({COLOR_THEMES.length})
                            </label>
                            <span style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>Select to apply</span>
                          </div>

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '6px',
                            maxHeight: '180px',
                            overflowY: 'auto',
                            paddingRight: '4px'
                          }}>
                            {COLOR_THEMES.map((theme) => {
                              const isSel = colorAccent === theme.id && !useCustomColor;
                              return (
                                <button
                                  key={theme.id}
                                  type="button"
                                  onClick={() => { setColorAccent(theme.id); setUseCustomColor(false); }}
                                  style={{
                                    padding: '6px 8px',
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
                                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{theme.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Custom Hex Color Picker */}
                        <div style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="color"
                              value={customColor || '#ec4899'}
                              onChange={(e) => { setCustomColor(e.target.value); setUseCustomColor(true); }}
                              style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'transparent' }}
                            />
                            <div>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>Custom Hex Accent</div>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Pick any custom color</div>
                            </div>
                          </div>

                          <input
                            type="text"
                            value={customColor}
                            onChange={(e) => { setCustomColor(e.target.value); setUseCustomColor(true); }}
                            placeholder="#ec4899"
                            style={{
                              width: '85px',
                              background: 'var(--bg-secondary)',
                              border: `1px solid ${useCustomColor ? 'var(--primary)' : 'var(--border-subtle)'}`,
                              borderRadius: '6px',
                              padding: '5px 8px',
                              fontSize: '11.5px',
                              fontFamily: 'monospace',
                              color: 'var(--text-main)',
                              outline: 'none'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase' }}>
                            CANVAS BACKDROP TONE
                          </label>
                          <select
                            value={bgTone}
                            onChange={(e) => setBgTone(e.target.value)}
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
                          >
                            {BG_TONES.map(b => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* SUB-PANEL 3: 10 NAVBAR ARCHITECTURES */}
                    {activeTabSection === 'navbar' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                            NAVBAR LAYOUT PRESET ({NAVBAR_OPTIONS.length})
                          </div>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '6px',
                            maxHeight: '230px',
                            overflowY: 'auto',
                            paddingRight: '4px'
                          }}>
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
                                    background: isSel ? 'rgba(236, 72, 153, 0.15)' : 'var(--bg-secondary)',
                                    border: `1px solid ${isSel ? 'var(--primary)' : 'var(--border-subtle)'}`,
                                    color: isSel ? '#fff' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px'
                                  }}
                                >
                                  <div style={{ fontSize: '11.5px', fontWeight: isSel ? 800 : 600 }}>{nav.name}</div>
                                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', lineHeight: 1.3 }}>{nav.desc}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-PANEL 4: 8 SIDEBAR ARCHITECTURES */}
                    {activeTabSection === 'sidebar' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                            SIDEBAR LAYOUT PRESET ({SIDEBAR_OPTIONS.length})
                          </div>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '6px',
                            maxHeight: '230px',
                            overflowY: 'auto',
                            paddingRight: '4px'
                          }}>
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
                                    background: isSel ? 'rgba(236, 72, 153, 0.15)' : 'var(--bg-secondary)',
                                    border: `1px solid ${isSel ? 'var(--primary)' : 'var(--border-subtle)'}`,
                                    color: isSel ? '#fff' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px'
                                  }}
                                >
                                  <div style={{ fontSize: '11.5px', fontWeight: isSel ? 800 : 600 }}>{side.name}</div>
                                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', lineHeight: 1.3 }}>{side.desc}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-PANEL 5: ANIMATIONS & VISUAL FX */}
                    {activeTabSection === 'animations' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                            BACKGROUND SHADER &amp; FX
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                            {BG_ANIMATIONS.map((anim) => {
                              const isSel = animationStyle === anim.id;
                              return (
                                <button
                                  key={anim.id}
                                  type="button"
                                  onClick={() => setAnimationStyle(anim.id)}
                                  style={{
                                    padding: '8px 10px',
                                    borderRadius: '6px',
                                    textAlign: 'left',
                                    background: isSel ? 'rgba(236, 72, 153, 0.15)' : 'var(--bg-secondary)',
                                    border: `1px solid ${isSel ? 'var(--primary)' : 'var(--border-subtle)'}`,
                                    color: isSel ? '#fff' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px'
                                  }}
                                >
                                  <div style={{ fontSize: '11.5px', fontWeight: isSel ? 800 : 600 }}>{anim.name}</div>
                                  <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{anim.desc}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                            CARD &amp; BUTTON HOVER EFFECTS
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                            {HOVER_FX.map((h) => {
                              const isSel = hoverFx === h.id;
                              return (
                                <button
                                  key={h.id}
                                  type="button"
                                  onClick={() => setHoverFx(h.id)}
                                  style={{
                                    padding: '7px 9px',
                                    borderRadius: '6px',
                                    textAlign: 'left',
                                    background: isSel ? 'rgba(236, 72, 153, 0.15)' : 'var(--bg-secondary)',
                                    border: `1px solid ${isSel ? 'var(--primary)' : 'var(--border-subtle)'}`,
                                    color: isSel ? '#fff' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                    fontWeight: isSel ? 700 : 500
                                  }}
                                >
                                  {h.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-PANEL 6: 12 MODULAR SECTIONS */}
                    {activeTabSection === 'sections' && (
                      <div style={{ marginBottom: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            COMPONENT SECTIONS ({selectedSections.length}/{MODULAR_SECTIONS.length})
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={handleSelectAllSections}
                              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Select All
                            </button>
                            <span style={{ color: 'var(--border-subtle)' }}>|</span>
                            <button
                              type="button"
                              onClick={handleResetSections}
                              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              Reset
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                          {MODULAR_SECTIONS.map((sec) => {
                            const isChecked = selectedSections.includes(sec.id);
                            return (
                              <button
                                key={sec.id}
                                type="button"
                                onClick={() => handleToggleSection(sec.id)}
                                style={{
                                  padding: '7px 8px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
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
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sec.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* SUB-PANEL 7: STYLING & SHAPE */}
                    {activeTabSection === 'styling' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
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
                              padding: '7px 9px',
                              color: 'var(--text-main)',
                              fontSize: '11.5px',
                              outline: 'none'
                            }}
                          >
                            <option value="modern-sans">Plus Jakarta Sans</option>
                            <option value="inter">Inter (SaaS Standard)</option>
                            <option value="tech-mono">JetBrains Mono (Hacker)</option>
                            <option value="space-grotesk">Space Grotesk (Cyber)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                            Button Shape
                          </label>
                          <select
                            value={buttonShape}
                            onChange={(e) => setButtonShape(e.target.value)}
                            style={{
                              width: '100%',
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '6px',
                              padding: '7px 9px',
                              color: 'var(--text-main)',
                              fontSize: '11.5px',
                              outline: 'none'
                            }}
                          >
                            <option value="rounded-xl">Rounded-xl (Modern 12px)</option>
                            <option value="pill">Pill (Full 9999px)</option>
                            <option value="soft">Soft Minimal (6px)</option>
                            <option value="sharp">Sharp Geometric (0px)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                            Glass Intensity
                          </label>
                          <select
                            value={glassIntensity}
                            onChange={(e) => setGlassIntensity(e.target.value)}
                            style={{
                              width: '100%',
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '6px',
                              padding: '7px 9px',
                              color: 'var(--text-main)',
                              fontSize: '11.5px',
                              outline: 'none'
                            }}
                          >
                            <option value="deep-frosted">Deep Frosted (24px Blur)</option>
                            <option value="subtle-tint">Subtle Tint (8px Blur)</option>
                            <option value="solid-dark">Solid Opaque (0px Blur)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                            Theme Style
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
                              fontSize: '11.5px',
                              outline: 'none'
                            }}
                          >
                            <option value="react">React 19 Component</option>
                            <option value="html">Standalone HTML5</option>
                            <option value="vue">Vue 3 SFC</option>
                          </select>
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
                      <span>{genStatusText || 'Compiling UI architecture...'}</span>
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
                        {genMode === 'single' ? (singlePageResult?.title || 'Interactive Canvas Studio') : (name || 'Project Scaffold')}
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
                    /* EXPANDED MASTER BLUEPRINT PLACEHOLDER (Waiting for User to Select & Click Generate) */
                    <div style={{
                      minHeight: '680px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px 24px',
                      background: 'radial-gradient(circle at 50% 30%, rgba(236,72,153,0.07) 0%, #070913 70%)',
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
                        width: '68px',
                        height: '68px',
                        borderRadius: '18px',
                        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                        border: '1px solid rgba(236, 72, 153, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '30px',
                        marginBottom: '16px',
                        boxShadow: '0 0 40px rgba(236, 72, 153, 0.25)'
                      }}>
                        {selectedArchObj.icon}
                      </div>

                      <div className="badge badge-medium" style={{ marginBottom: '12px', fontSize: '11px', padding: '3px 12px' }}>
                        STUDIO CANVAS &bull; ARCHITECTURE READY
                      </div>

                      <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                        Configure Your Architecture &amp; Generate
                      </h2>

                      <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '520px', lineHeight: 1.6, marginBottom: '26px' }}>
                        Select your archetype, color theme, navbar style, sidebar layout, and modular blocks on the left. Then click <strong style={{ color: '#fff' }}>Generate Single Page UI</strong> to synthesize and display the live preview.
                      </p>

                      {/* Live Selected Architecture Matrix */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                        maxWidth: '620px',
                        width: '100%',
                        marginBottom: '30px',
                        textAlign: 'left'
                      }}>
                        <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Archetype</div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedArchObj.name}</div>
                        </div>

                        <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Palette</div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: useCustomColor ? customColor : selectedThemeObj.preview }} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{useCustomColor ? customColor : selectedThemeObj.name.split(' ')[0]}</span>
                          </div>
                        </div>

                        <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Navbar Style</div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedNavbarObj.name}</div>
                        </div>

                        <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Sidebar</div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedSidebarObj.name}</div>
                        </div>

                        <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Animation FX</div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{animationStyle}</div>
                        </div>

                        <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Active Blocks</div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-emerald)' }}>{selectedSections.length} of {MODULAR_SECTIONS.length} Sections</div>
                        </div>
                      </div>

                      {/* Primary Generate Button inside Canvas */}
                      <button
                        type="button"
                        onClick={handleGenerateSinglePage}
                        disabled={generating || !prompt.trim()}
                        className="btn-primary"
                        style={{ padding: '13px 32px', fontSize: '14px', borderRadius: '8px', boxShadow: '0 4px 25px rgba(236, 72, 153, 0.4)' }}
                      >
                        <Sparkles size={16} />
                        <span>Generate Single Page UI Now &rarr;</span>
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
