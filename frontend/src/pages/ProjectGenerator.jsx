import React, { useState, useRef } from 'react';
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
  Maximize2,
  KeyRound,
  Rocket,
  BarChart3,
  ShoppingBag,
  Gem,
  Briefcase,
  FileCode2,
  Users,
  CreditCard,
  Lock,
  Shield,
  Tag,
  CornerDownLeft,
  CheckCircle2,
  Layers3,
  Workflow,
  GitPullRequest,
  Key,
  Loader2,
  AlertTriangle,
  X,
  Cloud,
  Globe,
  Server,
  UploadCloud,
  EyeOff
} from 'lucide-react';
import { projectGenerator } from '../services/projectGenerator';
import { api } from '../services/api';

const STACKS = [
  { id: 'react', name: 'React 19 + Vite', badge: 'Frontend', desc: 'SPA with Tailwind CSS, modular components & hooks' },
  { id: 'spring-boot', name: 'Spring Boot 3 (Java 17)', badge: 'Backend', desc: 'Spring Data JPA, Maven wrapper & REST API' },
  { id: 'fastapi', name: 'Python 3 + FastAPI', badge: 'Python', desc: 'Async REST API with Pydantic validation & OpenAPI' },
  { id: 'node', name: 'Node.js + Express', badge: 'Full-Stack', desc: 'Lightweight REST API service with CORS & JSON body' },
  { id: 'cpp', name: 'Modern C++20 (CMake)', badge: 'System', desc: 'Modular CMake project with unit testing harness' }
];

const SINGLE_PAGE_FRAMEWORKS = [
  { id: 'react', name: 'React 19 (JSX)', desc: 'Modular component with state & hooks' },
  { id: 'html', name: 'HTML5 + Tailwind', desc: 'Zero-config standalone web page' },
  { id: 'vue', name: 'Vue 3 Single File', desc: 'Composition API component' }
];

const PAGE_ARCHETYPES = [
  { 
    id: 'auth', 
    name: 'Auth & 2FA Portal', 
    iconKey: 'KeyRound',
    accentColor: '#c084fc',
    accentBg: 'rgba(168, 85, 247, 0.12)',
    accentBorder: 'rgba(168, 85, 247, 0.35)',
    desc: 'Dual-tab Login, Sign Up, 2FA OTP & OAuth integrations',
    defaultSections: ['navbar', 'hero', 'form', 'footer'],
    defaultPrompt: 'Build a creative login and signup page with a sticky glass navbar, animated ambient background orbs, email and password inputs with reveal eye toggle, and social sign in buttons.'
  },
  { 
    id: 'landing', 
    name: 'SaaS Landing Page', 
    iconKey: 'Rocket',
    accentColor: '#38bdf8',
    accentBg: 'rgba(56, 189, 248, 0.12)',
    accentBorder: 'rgba(56, 189, 248, 0.35)',
    desc: 'Hero showcase, bento grid & conversion CTA elements',
    defaultSections: ['navbar', 'hero', 'features', 'pricing', 'cta', 'footer'],
    defaultPrompt: 'Create a high-converting, dark-themed SaaS landing page for an AI code observability platform with sticky navbar, hero section, 3 feature cards, pricing tiers, and FAQ accordion.'
  },
  { 
    id: 'dashboard', 
    name: 'Analytics Dashboard', 
    iconKey: 'BarChart3',
    accentColor: '#34d399',
    accentBg: 'rgba(16, 185, 129, 0.12)',
    accentBorder: 'rgba(16, 185, 129, 0.35)',
    desc: 'Cluster telemetry, 4 real-time KPI metrics & audit logs',
    defaultSections: ['navbar', 'kpi', 'chart', 'table', 'footer'],
    defaultPrompt: 'Build a dark glassmorphic observability analytics dashboard with a cluster telemetry overview, 4 real-time KPI metric cards, and a recent deployment activity table.'
  },
  { 
    id: 'ecommerce', 
    name: 'E-Commerce Storefront', 
    iconKey: 'ShoppingBag',
    accentColor: '#fbbf24',
    accentBg: 'rgba(245, 158, 11, 0.12)',
    accentBorder: 'rgba(245, 158, 11, 0.35)',
    desc: 'Product cards, category pills & dynamic cart counter',
    defaultSections: ['navbar', 'hero', 'features', 'cta', 'footer'],
    defaultPrompt: 'Generate a modern e-commerce storefront for developer hardware gear with category filter pills, product grid with price tags, star ratings, and an interactive Add to Cart counter.'
  },
  { 
    id: 'pricing', 
    name: 'Pricing Matrix', 
    iconKey: 'Gem',
    accentColor: '#f472b6',
    accentBg: 'rgba(236, 72, 153, 0.12)',
    accentBorder: 'rgba(236, 72, 153, 0.35)',
    desc: '3 Tier cards, annual billing toggle & comparison matrix',
    defaultSections: ['navbar', 'hero', 'pricing', 'faq', 'footer'],
    defaultPrompt: 'Build a high-conversion pricing comparison matrix with monthly and annual billing toggle, 3 tier cards with a highlighted Pro plan, and comprehensive feature checklists.'
  },
  { 
    id: 'portfolio', 
    name: 'Developer Portfolio', 
    iconKey: 'Briefcase',
    accentColor: '#fb7185',
    accentBg: 'rgba(244, 63, 94, 0.12)',
    accentBorder: 'rgba(244, 63, 94, 0.35)',
    desc: 'Hero statement, tech stack tags & interactive showcase',
    defaultSections: ['hero', 'features', 'form', 'footer'],
    defaultPrompt: 'Create an ultra-sleek developer portfolio with an animated hero statement, interactive tech stack tags, project showcase cards with live demo links, and a clean contact form.'
  },
  { 
    id: 'docs', 
    name: 'API Documentation', 
    iconKey: 'FileCode2',
    accentColor: '#38bdf8',
    accentBg: 'rgba(14, 165, 233, 0.12)',
    accentBorder: 'rgba(14, 165, 233, 0.35)',
    desc: 'Nested sidebar tree, REST endpoints table & code blocks',
    defaultSections: ['navbar', 'features', 'table', 'footer'],
    defaultPrompt: 'Generate a high-density developer API documentation screen with nested sidebar navigation, REST endpoints table, code snippets with copy button, and request payload examples.'
  },
  { 
    id: 'admin', 
    name: 'Admin User Directory', 
    iconKey: 'Users',
    accentColor: '#818cf8',
    accentBg: 'rgba(99, 102, 241, 0.12)',
    accentBorder: 'rgba(99, 102, 241, 0.35)',
    desc: 'Searchable table, role chips, invite modal & user audit',
    defaultSections: ['navbar', 'kpi', 'table', 'footer'],
    defaultPrompt: 'Create an enterprise admin user management dashboard with search and role filters, user list table with status chips, invite modal button, and account deletion safeguard.'
  }
];

// Helper to render Lucide SVG Icon for archetype
const renderArchetypeIcon = (iconKey, size = 18, color = 'currentColor') => {
  switch (iconKey) {
    case 'KeyRound': return <KeyRound size={size} color={color} />;
    case 'Rocket': return <Rocket size={size} color={color} />;
    case 'BarChart3': return <BarChart3 size={size} color={color} />;
    case 'ShoppingBag': return <ShoppingBag size={size} color={color} />;
    case 'Gem': return <Gem size={size} color={color} />;
    case 'Briefcase': return <Briefcase size={size} color={color} />;
    case 'FileCode2': return <FileCode2 size={size} color={color} />;
    case 'Users': return <Users size={size} color={color} />;
    default: return <Layout size={size} color={color} />;
  }
};

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

// Prompt Inspiration Chips
const PROMPT_SUGGESTIONS = [
  { label: '✦ Auth with 2FA & OAuth', archetype: 'auth', prompt: 'Build a creative login and signup page with a sticky glass navbar, animated ambient background orbs, email and password inputs with reveal eye toggle, and social sign in buttons.' },
  { label: '✦ Dark SaaS Hero with Bento Grid', archetype: 'landing', prompt: 'Create a high-converting, dark-themed SaaS landing page for an AI code observability platform with sticky navbar, hero section, 3 feature cards, pricing tiers, and FAQ accordion.' },
  { label: '✦ Real-Time Metrics & Telemetry', archetype: 'dashboard', prompt: 'Build a dark glassmorphic observability analytics dashboard with a cluster telemetry overview, 4 real-time KPI metric cards, and a recent deployment activity table.' },
  { label: '✦ Developer Gear E-Commerce', archetype: 'ecommerce', prompt: 'Generate a modern e-commerce storefront for developer hardware gear with category filter pills, product grid with price tags, star ratings, and an interactive Add to Cart counter.' },
  { label: '✦ High-Conversion Pricing Matrix', archetype: 'pricing', prompt: 'Build a high-conversion pricing comparison matrix with monthly and annual billing toggle, 3 tier cards with a highlighted Pro plan, and comprehensive feature checklists.' }
];

// Cloud Deployment Platforms Specification
const DEPLOY_PLATFORMS = [
  {
    id: 'vercel',
    name: 'Vercel',
    badge: 'Instant Edge / Zero-Git',
    iconText: '▲',
    color: '#ffffff',
    gradient: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(15,23,42,0.9) 100%)',
    border: 'rgba(255, 255, 255, 0.25)',
    glow: 'rgba(255, 255, 255, 0.15)',
    desc: 'Instant direct API deployment to Vercel Global Edge Network with live SSL URL.',
    tokenName: 'Vercel API Token',
    tokenUrl: 'https://vercel.com/account/tokens',
    tokenStorageKey: 'codelens_vercel_token',
    directDeploy: true
  },
  {
    id: 'render',
    name: 'Render',
    badge: 'Fullstack / Docker & Web',
    iconText: '⬡',
    color: '#00e599',
    gradient: 'linear-gradient(135deg, rgba(0, 229, 153, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
    border: 'rgba(0, 229, 153, 0.4)',
    glow: 'rgba(0, 229, 153, 0.2)',
    desc: 'Provisions automated Docker container or static service on Render linked to GitHub.',
    tokenName: 'Render API Key',
    tokenUrl: 'https://dashboard.render.com/u/settings#api-keys',
    tokenStorageKey: 'codelens_render_token',
    directDeploy: false
  },
  {
    id: 'netlify',
    name: 'Netlify',
    badge: 'Instant Atomic ZIP / Edge',
    iconText: '◈',
    color: '#00c7b7',
    gradient: 'linear-gradient(135deg, rgba(0, 199, 183, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
    border: 'rgba(0, 199, 183, 0.4)',
    glow: 'rgba(0, 199, 183, 0.2)',
    desc: 'Direct atomic ZIP deployment to Netlify Global CDN. Live in under 5 seconds.',
    tokenName: 'Netlify Access Token',
    tokenUrl: 'https://app.netlify.com/user/applications#personal-access-tokens',
    tokenStorageKey: 'codelens_netlify_token',
    directDeploy: true
  },
  {
    id: 'railway',
    name: 'Railway',
    badge: 'Container & PaaS',
    iconText: '🚂',
    color: '#c084fc',
    gradient: 'linear-gradient(135deg, rgba(192, 132, 252, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
    border: 'rgba(192, 132, 252, 0.4)',
    glow: 'rgba(192, 132, 252, 0.2)',
    desc: 'Containerized cloud infrastructure deployment via Railway CLI or 1-Click template.',
    tokenName: 'Railway Template Deploy',
    tokenUrl: 'https://railway.app/new',
    tokenStorageKey: 'codelens_railway_token',
    directDeploy: false
  }
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

  // Active Options Tab in Studio Deck
  const [activeTabSection, setActiveTabSection] = useState('archetype'); 
  // 'archetype', 'colors', 'navbar', 'sidebar', 'animations', 'sections', 'styling'

  // States
  const [generating, setGenerating] = useState(false);
  const [genStatusText, setGenStatusText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Single Page Result: Starts NULL so NO page is auto-rendered on initial load
  const [singlePageResult, setSinglePageResult] = useState(null);
  const canvasRef = useRef(null);

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

  // GitHub Push Modal States
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [githubRepoInput, setGithubRepoInput] = useState('');
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('codelens_github_pat') || '');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [rememberToken, setRememberToken] = useState(true);
  const [targetBranch, setTargetBranch] = useState('main');
  const [branchMode, setBranchMode] = useState('direct');
  const [pushCommitMsg, setPushCommitMsg] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [pushProgress, setPushProgress] = useState('');
  const [pushError, setPushError] = useState('');
  const [pushResult, setPushResult] = useState(null);

  // Cloud Deployment Modal States (Vercel, Render, Netlify, Railway)
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployPlatform, setDeployPlatform] = useState('vercel');
  const [deployProjectName, setDeployProjectName] = useState('');
  const [deployToken, setDeployToken] = useState('');
  const [showDeployTokenInput, setShowDeployTokenInput] = useState(false);
  const [deployRememberToken, setDeployRememberToken] = useState(true);
  const [deployServiceType, setDeployServiceType] = useState('web_service');
  const [deployGitHubRepo, setDeployGitHubRepo] = useState('');
  const [deployGitHubToken, setDeployGitHubToken] = useState(() => localStorage.getItem('codelens_github_pat') || '');
  const [showDeployGhTokenInput, setShowDeployGhTokenInput] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState('');
  const [deployError, setDeployError] = useState('');
  const [deployResult, setDeployResult] = useState(null);

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

      // Smoothly scroll down to the canvas
      setTimeout(() => {
        canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
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

      // Smoothly scroll down to project repo view
      setTimeout(() => {
        canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
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
    setTimeout(() => {
      canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
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

  // Open GitHub Push Modal
  const handleOpenGitHubModal = () => {
    if (!githubRepoInput) {
      setGithubRepoInput(name || 'codelens-project');
    }
    if (!pushCommitMsg) {
      setPushCommitMsg(`feat(scaffold): initialize ${name || 'project'} full-stack architecture via CodeLens AI`);
    }
    setPushError('');
    setPushResult(null);
    setShowGitHubModal(true);
  };

  // Push Scaffolded Code to GitHub
  const handlePushToGitHub = async () => {
    if (!githubRepoInput || !githubRepoInput.trim()) {
      setPushError('Please enter a target repository name (e.g. my-app) or full GitHub URL.');
      return;
    }
    if (!githubToken || !githubToken.trim()) {
      setPushError('GitHub Personal Access Token is required to commit to GitHub.');
      return;
    }

    setIsPushing(true);
    setPushProgress('Connecting to GitHub API...');
    setPushError('');
    setPushResult(null);

    try {
      if (rememberToken) {
        localStorage.setItem('codelens_github_pat', githubToken.trim());
      }

      // Convert current project files or single page result into fix items
      const filesToPush = genMode === 'single' && singlePageResult
        ? [{ path: singlePageResult.filename || 'src/App.jsx', content: singlePageResult.code }]
        : Object.entries(projectFiles).map(([path, content]) => ({ path, content }));

      if (filesToPush.length === 0) {
        throw new Error('No files to push. Please scaffold a project first.');
      }

      setPushProgress(`Packaging ${filesToPush.length} project files...`);
      await new Promise(r => setTimeout(r, 400));

      setPushProgress(`Pushing to repository '${githubRepoInput.trim()}'...`);

      const result = await api.applyFixesToGitHub({
        repoUrl: githubRepoInput.trim(),
        token: githubToken.trim(),
        fixes: filesToPush,
        branchMode,
        targetBranch: targetBranch || 'main',
        prTitle: `CodeLens AI: Scaffold ${name || 'project'} (${filesToPush.length} files)`,
        commitMessage: pushCommitMsg || `feat(scaffold): initialize ${name || 'project'} full-stack architecture via CodeLens AI`
      });

      setPushResult(result);
    } catch (err) {
      setPushError(err.message || 'Failed to push project to GitHub.');
    } finally {
      setIsPushing(false);
      setPushProgress('');
    }
  };

  // Open Cloud Deployment Modal
  const handleOpenDeployModal = () => {
    const fallbackName = name || (singlePageResult?.filename ? singlePageResult.filename.replace(/\.[^/.]+$/, "") : 'codelens-app');
    const sanitizedName = fallbackName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/^-+|-+$/g, '') || 'codelens-app';
    setDeployProjectName(sanitizedName);
    
    // Auto-load token for current selected platform
    const savedToken = localStorage.getItem(`codelens_${deployPlatform}_token`) || '';
    setDeployToken(savedToken);

    // If project has been pushed or repo exists, prefill GitHub repo
    if (pushResult?.repo_url || pushResult?.direct_url) {
      setDeployGitHubRepo(pushResult.direct_url || pushResult.repo_url);
    } else if (githubRepoInput) {
      setDeployGitHubRepo(githubRepoInput);
    } else {
      setDeployGitHubRepo(sanitizedName);
    }

    setDeployError('');
    setDeployResult(null);
    setShowDeployModal(true);
  };

  const handleSelectDeployPlatform = (platId) => {
    setDeployPlatform(platId);
    const savedToken = localStorage.getItem(`codelens_${platId}_token`) || '';
    setDeployToken(savedToken);
    setDeployError('');
  };

  const handleExecuteDeployment = async () => {
    if (deployPlatform === 'railway') {
      const repoTarget = deployGitHubRepo.startsWith('http') 
        ? deployGitHubRepo 
        : `https://github.com/Akhil1845/${deployGitHubRepo}`;
      window.open(`https://railway.app/new/template?template=${encodeURIComponent(repoTarget)}`, '_blank');
      return;
    }

    if (!deployToken || !deployToken.trim()) {
      setDeployError(`Please provide your ${deployPlatform.toUpperCase()} API token/key.`);
      return;
    }

    if (!deployProjectName || !deployProjectName.trim()) {
      setDeployError('Please enter a project name.');
      return;
    }

    if (deployPlatform === 'render' && !deployGitHubRepo.trim() && !deployGitHubToken.trim()) {
      setDeployError('Render builds from Git. Please provide a GitHub repository URL or a GitHub Personal Access Token to auto-publish.');
      return;
    }

    setIsDeploying(true);
    setDeployProgress(`Connecting to ${deployPlatform.toUpperCase()} Cloud API & validating credentials...`);
    setDeployError('');
    setDeployResult(null);

    try {
      if (deployRememberToken) {
        localStorage.setItem(`codelens_${deployPlatform}_token`, deployToken.trim());
        if (deployGitHubToken) {
          localStorage.setItem('codelens_github_pat', deployGitHubToken.trim());
        }
      }

      const filesToDeploy = genMode === 'single' && singlePageResult
        ? [
            { path: 'index.html', content: singlePageResult.preview_html || singlePageResult.code },
            { path: singlePageResult.filename || 'src/App.jsx', content: singlePageResult.code }
          ]
        : Object.entries(projectFiles).map(([path, content]) => ({ path, content }));

      if (filesToDeploy.length === 0) {
        throw new Error('No files available to deploy. Please generate or scaffold a project first.');
      }

      setDeployProgress(`Packaging ${filesToDeploy.length} files and provisioning cloud deployment on ${deployPlatform.toUpperCase()}...`);

      const res = await api.deployProjectToCloud({
        platform: deployPlatform,
        token: deployToken.trim(),
        projectName: deployProjectName.trim(),
        files: filesToDeploy,
        repoUrl: deployGitHubRepo.trim() || null,
        githubToken: deployGitHubToken.trim() || null,
        serviceType: deployServiceType,
        target: 'production'
      });

      setDeployResult(res);
    } catch (err) {
      setDeployError(err.message || `Failed to deploy to ${deployPlatform}`);
    } finally {
      setIsDeploying(false);
      setDeployProgress('');
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
        top: '2%',
        left: '20%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.03) 60%, transparent 100%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <main style={{ flexGrow: 1, padding: '28px 0 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '1740px', margin: '0 auto', padding: '0 24px' }}>

          {/* STUDIO HEADER & SCOPE SWITCHER */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '20px',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818cf8',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                marginBottom: '8px'
              }}>
                <Sparkles size={11} />
                <span>AI APPLICATION &amp; UI STUDIO</span>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 4px 0' }}>
                Interface &amp; Scaffold Studio
              </h1>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                Prompt, customize, and synthesize production-grade user interfaces, modular design components, or full-stack architectures.
              </div>
            </div>

            {/* Scope Switcher: Single Page vs Full Project */}
            <div style={{
              display: 'flex',
              background: 'rgba(15, 23, 42, 0.7)',
              padding: '4px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(12px)'
            }}>
              <button
                type="button"
                onClick={() => setGenMode('single')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  background: genMode === 'single' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
                  color: genMode === 'single' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: genMode === 'single' ? '0 2px 12px rgba(99, 102, 241, 0.4)' : 'none'
                }}
              >
                <Layout size={15} />
                <span>Single Page &amp; UI Canvas</span>
              </button>

              <button
                type="button"
                onClick={() => setGenMode('project')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  background: genMode === 'project' ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' : 'transparent',
                  color: genMode === 'project' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: genMode === 'project' ? '0 2px 12px rgba(236, 72, 153, 0.4)' : 'none'
                }}
              >
                <Box size={15} />
                <span>Full Project Scaffolding</span>
              </button>
            </div>
          </div>

          {/* STACKED WORKSPACE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* MAIN CONFIGURATION CARD */}
            <div style={{
              background: 'linear-gradient(180deg, rgba(20, 28, 48, 0.65) 0%, rgba(12, 18, 33, 0.8) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>

              {/* 1. THE AI OMNIBAR */}
              <div style={{
                background: 'rgba(10, 15, 28, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.5)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}>
                      <Sparkles size={13} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {genMode === 'single' ? 'AI PROMPT & COMPONENT SPECIFICATION' : 'FULL-STACK REPOSITORY SPECIFICATION'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    title="Enrich prompt with production architectural details"
                    style={{
                      background: 'rgba(236, 72, 153, 0.12)',
                      border: '1px solid rgba(236, 72, 153, 0.35)',
                      color: '#f472b6',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Wand2 size={12} />
                    <span>Enhance Prompt</span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault();
                      if (genMode === 'single') handleGenerateSinglePage();
                      else handleGenerateFullProject();
                    }
                  }}
                  placeholder="Describe your interface, components, styling, or architecture in natural language..."
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    lineHeight: 1.6,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    padding: 0,
                    margin: 0
                  }}
                />

                {/* Omnibar Action Controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  {/* Left Parameter Pills */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {genMode === 'single' ? (
                      <>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          padding: '4px 10px'
                        }}>
                          <Code2 size={13} color="#38bdf8" />
                          <select
                            value={singleFramework}
                            onChange={(e) => setSingleFramework(e.target.value)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#e2e8f0',
                              fontSize: '12px',
                              fontWeight: 700,
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            {SINGLE_PAGE_FRAMEWORKS.map(f => (
                              <option key={f.id} value={f.id} style={{ background: '#0f172a', color: '#ffffff' }}>{f.name}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          padding: '4px 10px'
                        }}>
                          <Tag size={12} color="#94a3b8" />
                          <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            placeholder="Brand / Product Name (Optional)"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#e2e8f0',
                              fontSize: '12px',
                              outline: 'none',
                              width: '180px'
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          padding: '4px 10px'
                        }}>
                          <FolderTree size={13} color="#38bdf8" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Service Name (e.g. auth-gateway)"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#e2e8f0',
                              fontSize: '12px',
                              outline: 'none',
                              width: '180px',
                              fontFamily: 'var(--font-mono)'
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right: Primary Generate Button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {singlePageResult && genMode === 'single' && (
                      <button
                        type="button"
                        onClick={() => canvasRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        style={{
                          padding: '9px 16px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '8px',
                          color: '#e2e8f0',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Eye size={13} color="#38bdf8" />
                        <span>View Canvas</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleOpenGitHubModal}
                      title="Push scaffolded project directly to GitHub repository"
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(52, 211, 153, 0.35)',
                        color: '#34d399',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <GitPullRequest size={14} />
                      <span>Push to GitHub</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenDeployModal}
                      title="Deploy project to Vercel, Render, Netlify, or Railway"
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
                        border: '1px solid rgba(168, 85, 247, 0.5)',
                        color: '#c084fc',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                        boxShadow: '0 2px 12px rgba(168, 85, 247, 0.2)'
                      }}
                    >
                      <Zap size={14} color="#e879f9" />
                      <span>Deploy to Cloud</span>
                    </button>

                    <button
                      type="button"
                      onClick={genMode === 'single' ? handleGenerateSinglePage : handleGenerateFullProject}
                      disabled={generating || !prompt.trim()}
                      style={{
                        padding: '10px 22px',
                        borderRadius: '8px',
                        background: generating 
                          ? 'rgba(99, 102, 241, 0.4)' 
                          : 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: (generating || !prompt.trim()) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 18px rgba(99, 102, 241, 0.4)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {generating ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>{genStatusText || 'Compiling Architecture...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          <span>{genMode === 'single' ? 'Generate Single Page UI' : 'Scaffold Full Project'}</span>
                          <span style={{
                            background: 'rgba(255,255,255,0.2)',
                            fontSize: '10px',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            marginLeft: '2px'
                          }}>
                            Ctrl+↵
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Inspiration Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', padding: '0 2px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>
                  Suggestions:
                </span>
                {PROMPT_SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(item.prompt);
                      setPageArchetype(item.archetype);
                      const arch = PAGE_ARCHETYPES.find(a => a.id === item.archetype);
                      if (arch?.defaultSections) setSelectedSections(arch.defaultSections);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#94a3b8',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.12s ease'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* 2. CUSTOMIZER TABS & DEEP CONTROLS */}
              {genMode === 'single' ? (
                <div>
                  {/* Clean Tab Pills Navigation */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    background: 'rgba(15, 23, 42, 0.65)',
                    padding: '4px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    marginBottom: '18px',
                    gap: '4px'
                  }}>
                    {[
                      { id: 'archetype', label: 'Archetype Presets', count: '8', icon: <Layout size={13} /> },
                      { id: 'colors', label: 'Palette & Theme', count: '18+', icon: <Palette size={13} /> },
                      { id: 'navbar', label: 'Navbar Style', count: '10', icon: <Tv size={13} /> },
                      { id: 'sidebar', label: 'Sidebar Layout', count: '8', icon: <Layers size={13} /> },
                      { id: 'animations', label: 'Visual FX & Motion', count: '6', icon: <Zap size={13} /> },
                      { id: 'sections', label: 'Modular Blocks', count: `${selectedSections.length}/12`, icon: <Box size={13} /> },
                      { id: 'styling', label: 'Typography & Shape', icon: <Sliders size={13} /> }
                    ].map((tab) => {
                      const isAct = activeTabSection === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTabSection(tab.id)}
                          style={{
                            flex: '1 1 auto',
                            padding: '8px 12px',
                            borderRadius: '7px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: isAct ? '1px solid rgba(99, 102, 241, 0.45)' : '1px solid transparent',
                            background: isAct ? 'rgba(99, 102, 241, 0.16)' : 'transparent',
                            color: isAct ? '#ffffff' : '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.12s ease'
                          }}
                        >
                          <span style={{ color: isAct ? '#818cf8' : '#64748b' }}>{tab.icon}</span>
                          <span>{tab.label}</span>
                          {tab.count && (
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              background: isAct ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.06)',
                              color: isAct ? '#a5b4fc' : '#64748b',
                              padding: '1px 5px',
                              borderRadius: '10px'
                            }}>
                              {tab.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* SUB-PANEL 1: ARCHETYPES (Balanced 4x2 Responsive Grid) */}
                  {activeTabSection === 'archetype' && (
                    <div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '12px'
                      }}>
                        {PAGE_ARCHETYPES.map((arch) => {
                          const isSelected = pageArchetype === arch.id;
                          return (
                            <button
                              key={arch.id}
                              type="button"
                              onClick={() => handleSelectArchetype(arch)}
                              style={{
                                position: 'relative',
                                padding: '14px 16px',
                                borderRadius: '12px',
                                background: isSelected 
                                  ? `linear-gradient(135deg, ${arch.accentBg} 0%, rgba(15, 23, 42, 0.6) 100%)` 
                                  : 'rgba(15, 23, 42, 0.4)',
                                border: `1px solid ${isSelected ? arch.accentColor : 'rgba(255, 255, 255, 0.08)'}`,
                                boxShadow: isSelected 
                                  ? `0 0 20px ${arch.accentBg}, inset 0 0 12px ${arch.accentBg}` 
                                  : 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: '10px',
                                textAlign: 'left',
                                transition: 'all 0.18s ease',
                                backdropFilter: 'blur(12px)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <div style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '9px',
                                  background: arch.accentBg,
                                  border: `1px solid ${arch.accentBorder}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: arch.accentColor
                                }}>
                                  {renderArchetypeIcon(arch.iconKey, 18, arch.accentColor)}
                                </div>
                                {isSelected ? (
                                  <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    color: arch.accentColor,
                                    background: arch.accentBg,
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    border: `1px solid ${arch.accentBorder}`
                                  }}>
                                    <Check size={11} /> Selected
                                  </span>
                                ) : null}
                              </div>

                              <div>
                                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#ffffff', marginBottom: '3px' }}>
                                  {arch.name}
                                </div>
                                <div style={{ fontSize: '11.5px', color: '#94a3b8', lineHeight: 1.4 }}>
                                  {arch.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SUB-PANEL 2: 18+ COLOR PALETTES & BACKDROP */}
                  {activeTabSection === 'colors' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            CURATED ACCENT PALETTES ({COLOR_THEMES.length})
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>Select to apply instantly</span>
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                          gap: '8px',
                          maxHeight: '320px',
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
                                  padding: '10px 12px',
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  background: isSel ? 'rgba(99, 102, 241, 0.16)' : 'rgba(15, 23, 42, 0.5)',
                                  border: `1px solid ${isSel ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                                  color: isSel ? '#ffffff' : '#94a3b8',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: isSel ? 800 : 500,
                                  transition: 'all 0.12s ease'
                                }}
                              >
                                <span style={{
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '50%',
                                  background: theme.preview,
                                  flexShrink: 0,
                                  boxShadow: isSel ? '0 0 10px rgba(99, 102, 241, 0.6)' : 'none'
                                }} />
                                <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{theme.name}</div>
                                  <div style={{ fontSize: '10px', color: '#64748b' }}>{theme.group}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Hex Color Picker */}
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="color"
                            value={customColor || '#ec4899'}
                            onChange={(e) => { setCustomColor(e.target.value); setUseCustomColor(true); }}
                            style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'transparent' }}
                          />
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>Custom Hex Accent</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Specify any brand hex code for buttons &amp; badges</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input
                            type="text"
                            value={customColor}
                            onChange={(e) => { setCustomColor(e.target.value); setUseCustomColor(true); }}
                            placeholder="#ec4899"
                            style={{
                              width: '100px',
                              background: 'rgba(0,0,0,0.4)',
                              border: `1px solid ${useCustomColor ? '#818cf8' : 'rgba(255, 255, 255, 0.1)'}`,
                              borderRadius: '6px',
                              padding: '7px 10px',
                              fontSize: '12px',
                              fontFamily: 'var(--font-mono)',
                              color: '#ffffff',
                              outline: 'none'
                            }}
                          />

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>Backdrop:</span>
                            <select
                              value={bgTone}
                              onChange={(e) => setBgTone(e.target.value)}
                              style={{
                                background: 'rgba(0,0,0,0.4)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '6px',
                                padding: '6px 10px',
                                color: '#ffffff',
                                fontSize: '12px',
                                outline: 'none'
                              }}
                            >
                              {BG_TONES.map(b => (
                                <option key={b.id} value={b.id} style={{ background: '#0f172a' }}>{b.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-PANEL 3: 10 NAVBAR ARCHITECTURES */}
                  {activeTabSection === 'navbar' && (
                    <div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '10px'
                      }}>
                        {NAVBAR_OPTIONS.map((nav) => {
                          const isSel = navbarStyle === nav.id;
                          return (
                            <button
                              key={nav.id}
                              type="button"
                              onClick={() => setNavbarStyle(nav.id)}
                              style={{
                                padding: '12px 14px',
                                borderRadius: '10px',
                                textAlign: 'left',
                                background: isSel ? 'rgba(99, 102, 241, 0.16)' : 'rgba(15, 23, 42, 0.5)',
                                border: `1px solid ${isSel ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                                color: isSel ? '#ffffff' : '#94a3b8',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                transition: 'all 0.12s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <span style={{ fontSize: '12.5px', fontWeight: isSel ? 800 : 700, color: isSel ? '#ffffff' : '#cbd5e1' }}>
                                  {nav.name}
                                </span>
                                {isSel && <Check size={13} color="#818cf8" />}
                              </div>
                              <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.35 }}>
                                {nav.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SUB-PANEL 4: 8 SIDEBAR ARCHITECTURES */}
                  {activeTabSection === 'sidebar' && (
                    <div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '10px'
                      }}>
                        {SIDEBAR_OPTIONS.map((side) => {
                          const isSel = sidebarStyle === side.id;
                          return (
                            <button
                              key={side.id}
                              type="button"
                              onClick={() => setSidebarStyle(side.id)}
                              style={{
                                padding: '12px 14px',
                                borderRadius: '10px',
                                textAlign: 'left',
                                background: isSel ? 'rgba(99, 102, 241, 0.16)' : 'rgba(15, 23, 42, 0.5)',
                                border: `1px solid ${isSel ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                                color: isSel ? '#ffffff' : '#94a3b8',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                transition: 'all 0.12s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <span style={{ fontSize: '12.5px', fontWeight: isSel ? 800 : 700, color: isSel ? '#ffffff' : '#cbd5e1' }}>
                                  {side.name}
                                </span>
                                {isSel && <Check size={13} color="#818cf8" />}
                              </div>
                              <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.35 }}>
                                {side.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SUB-PANEL 5: ANIMATIONS & VISUAL FX */}
                  {activeTabSection === 'animations' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          BACKGROUND SHADER &amp; AMBIENCE
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                          {BG_ANIMATIONS.map((anim) => {
                            const isSel = animationStyle === anim.id;
                            return (
                              <button
                                key={anim.id}
                                type="button"
                                onClick={() => setAnimationStyle(anim.id)}
                                style={{
                                  padding: '12px 14px',
                                  borderRadius: '10px',
                                  textAlign: 'left',
                                  background: isSel ? 'rgba(99, 102, 241, 0.16)' : 'rgba(15, 23, 42, 0.5)',
                                  border: `1px solid ${isSel ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                                  color: isSel ? '#ffffff' : '#94a3b8',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '4px',
                                  transition: 'all 0.12s ease'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                  <span style={{ fontSize: '12.5px', fontWeight: isSel ? 800 : 700, color: isSel ? '#ffffff' : '#cbd5e1' }}>
                                    {anim.name}
                                  </span>
                                  {isSel && <Check size={13} color="#818cf8" />}
                                </div>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>{anim.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          CARD &amp; BUTTON HOVER EFFECTS
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                          {HOVER_FX.map((h) => {
                            const isSel = hoverFx === h.id;
                            return (
                              <button
                                key={h.id}
                                type="button"
                                onClick={() => setHoverFx(h.id)}
                                style={{
                                  padding: '10px 14px',
                                  borderRadius: '8px',
                                  textAlign: 'left',
                                  background: isSel ? 'rgba(99, 102, 241, 0.16)' : 'rgba(15, 23, 42, 0.5)',
                                  border: `1px solid ${isSel ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                                  color: isSel ? '#ffffff' : '#94a3b8',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: isSel ? 800 : 600,
                                  transition: 'all 0.12s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between'
                                }}
                              >
                                <span>{h.name}</span>
                                {isSel && <Check size={13} color="#818cf8" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-PANEL 6: 12 MODULAR SECTIONS */}
                  {activeTabSection === 'sections' && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          ACTIVE COMPONENT BLOCKS ({selectedSections.length}/{MODULAR_SECTIONS.length})
                        </span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            type="button"
                            onClick={handleSelectAllSections}
                            style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Select All
                          </button>
                          <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                          <button
                            type="button"
                            onClick={handleResetSections}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Reset to Archetype Defaults
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                        {MODULAR_SECTIONS.map((sec) => {
                          const isChecked = selectedSections.includes(sec.id);
                          return (
                            <button
                              key={sec.id}
                              type="button"
                              onClick={() => handleToggleSection(sec.id)}
                              style={{
                                padding: '10px 14px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: isChecked ? 'rgba(99, 102, 241, 0.14)' : 'rgba(15, 23, 42, 0.5)',
                                border: `1px solid ${isChecked ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                                color: isChecked ? '#ffffff' : '#94a3b8',
                                transition: 'all 0.12s ease'
                              }}
                            >
                              <span style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isChecked ? '#6366f1' : 'transparent',
                                border: `1px solid ${isChecked ? '#6366f1' : 'rgba(255,255,255,0.2)'}`,
                                color: '#ffffff',
                                fontSize: '10px'
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                      <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                          TYPOGRAPHY FAMILY
                        </label>
                        <select
                          value={typography}
                          onChange={(e) => setTypography(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            padding: '9px 12px',
                            color: '#ffffff',
                            fontSize: '12.5px',
                            outline: 'none'
                          }}
                        >
                          <option value="modern-sans" style={{ background: '#0f172a' }}>Plus Jakarta Sans (Modern Clean)</option>
                          <option value="inter" style={{ background: '#0f172a' }}>Inter (SaaS Standard)</option>
                          <option value="tech-mono" style={{ background: '#0f172a' }}>JetBrains Mono (Developer Pro)</option>
                          <option value="space-grotesk" style={{ background: '#0f172a' }}>Space Grotesk (Cyber Futuristic)</option>
                        </select>
                      </div>

                      <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                          BUTTON GEOMETRY
                        </label>
                        <select
                          value={buttonShape}
                          onChange={(e) => setButtonShape(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            padding: '9px 12px',
                            color: '#ffffff',
                            fontSize: '12.5px',
                            outline: 'none'
                          }}
                        >
                          <option value="rounded-xl" style={{ background: '#0f172a' }}>Rounded-xl (Modern 12px)</option>
                          <option value="pill" style={{ background: '#0f172a' }}>Pill (Full 9999px Capsule)</option>
                          <option value="soft" style={{ background: '#0f172a' }}>Soft Minimal (6px Rounded)</option>
                          <option value="sharp" style={{ background: '#0f172a' }}>Sharp Geometric (0px)</option>
                        </select>
                      </div>

                      <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                          GLASS INTENSITY
                        </label>
                        <select
                          value={glassIntensity}
                          onChange={(e) => setGlassIntensity(e.target.value)}
                          style={{
                            width: '100%',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            padding: '9px 12px',
                            color: '#ffffff',
                            fontSize: '12.5px',
                            outline: 'none'
                          }}
                        >
                          <option value="deep-frosted" style={{ background: '#0f172a' }}>Deep Frosted Blur (24px + Border Aura)</option>
                          <option value="minimal-glass" style={{ background: '#0f172a' }}>Minimal Subtle Blur (8px Glass)</option>
                          <option value="solid-dark" style={{ background: '#0f172a' }}>Solid Opaque Dark (Zero Transparency)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* FULL PROJECT REPOSITORY CONTROLS */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    SELECT FULL-STACK BACKBONE ({STACKS.length} Supported Stacks)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                    {STACKS.map((s) => {
                      const isSel = stack === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setStack(s.id)}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '12px',
                            textAlign: 'left',
                            background: isSel ? 'rgba(236, 72, 153, 0.16)' : 'rgba(15, 23, 42, 0.5)',
                            border: `1px solid ${isSel ? '#ec4899' : 'rgba(255, 255, 255, 0.08)'}`,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#ffffff' }}>{s.name}</span>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              background: isSel ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255,255,255,0.06)',
                              color: isSel ? '#f472b6' : '#94a3b8',
                              padding: '2px 8px',
                              borderRadius: '12px'
                            }}>
                              {s.badge}
                            </span>
                          </div>
                          <span style={{ fontSize: '11.5px', color: '#94a3b8', lineHeight: 1.4 }}>{s.desc}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Database & Extra Options */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '14px',
                    padding: '16px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                        DATABASE ENGINE
                      </label>
                      <select
                        value={database}
                        onChange={(e) => setDatabase(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: '#ffffff',
                          fontSize: '12.5px',
                          outline: 'none'
                        }}
                      >
                        <option value="postgres" style={{ background: '#0f172a' }}>PostgreSQL (Production Default)</option>
                        <option value="mysql" style={{ background: '#0f172a' }}>MySQL 8.0</option>
                        <option value="sqlite" style={{ background: '#0f172a' }}>SQLite 3 (Zero Setup Embedded)</option>
                        <option value="mongodb" style={{ background: '#0f172a' }}>MongoDB (NoSQL Document)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                        DEVOPS MANIFESTS
                      </span>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '4px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ffffff', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={includeDocker}
                            onChange={(e) => setIncludeDocker(e.target.checked)}
                          />
                          <span>Production Dockerfile</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ffffff', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={includeCi}
                            onChange={(e) => setIncludeCi(e.target.checked)}
                          />
                          <span>GitHub Actions CI/CD</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* BUILT PAGES & PROJECTS HORIZONTAL HISTORY BAR */}
            {buildHistory.length > 0 && (
              <div style={{
                padding: '12px 18px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                overflowX: 'auto',
                backdropFilter: 'blur(12px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#ffffff', flexShrink: 0 }}>
                  <History size={14} color="#818cf8" />
                  <span>Recent Builds ({buildHistory.length}):</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '2px 0' }}>
                  {buildHistory.map((item) => {
                    const isSelected = activeBuildId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectBuild(item)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isSelected ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                          color: isSelected ? '#ffffff' : '#94a3b8',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {item.mode === 'single' ? <Layout size={12} /> : <Box size={12} />}
                        <span>{item.title}</span>
                        <span style={{ fontSize: '10.5px', opacity: 0.75 }}>&bull; {item.tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* INTERACTIVE PREVIEW CANVAS & CODE VIEWER */}
            <div ref={canvasRef} style={{ width: '100%', scrollMarginTop: '80px' }}>
              <div style={{
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: '#070912',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.65)'
              }}>

                {/* Canvas Browser Chrome Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(15, 23, 42, 0.75)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  {/* Left: Window Controls & Simulated Browser Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e' }} />
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(0,0,0,0.4)',
                      padding: '4px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      fontSize: '12px',
                      color: '#94a3b8',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      <Lock size={11} color="#34d399" />
                      <span>https://studio.codelens.ai/preview/{genMode === 'single' ? pageArchetype : name}</span>
                    </div>
                  </div>

                  {/* Right Actions & Viewport Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {singlePageResult && genMode === 'single' && (
                      <>
                        {/* Toggle Live Preview vs Source Code */}
                        <div style={{
                          display: 'flex',
                          background: 'rgba(0,0,0,0.4)',
                          padding: '2px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                          <button
                            type="button"
                            onClick={() => setPreviewTab('preview')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '6px',
                              background: previewTab === 'preview' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                              color: previewTab === 'preview' ? '#ffffff' : '#94a3b8',
                              border: previewTab === 'preview' ? '1px solid rgba(99, 102, 241, 0.5)' : 'none',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <Eye size={13} />
                            <span>Preview</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewTab('code')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '6px',
                              background: previewTab === 'code' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                              color: previewTab === 'code' ? '#ffffff' : '#94a3b8',
                              border: previewTab === 'code' ? '1px solid rgba(99, 102, 241, 0.5)' : 'none',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <Code2 size={13} />
                            <span>Source</span>
                          </button>
                        </div>

                        {/* Viewport switchers in Live Preview mode */}
                        {previewTab === 'preview' && (
                          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '2px' }}>
                            <button
                              type="button"
                              onClick={() => setViewportMode('desktop')}
                              title="Desktop (100%)"
                              style={{
                                padding: '5px 9px',
                                background: viewportMode === 'desktop' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                                color: viewportMode === 'desktop' ? '#818cf8' : '#94a3b8',
                                border: 'none',
                                borderRadius: '6px',
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
                                padding: '5px 9px',
                                background: viewportMode === 'tablet' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                                color: viewportMode === 'tablet' ? '#818cf8' : '#94a3b8',
                                border: 'none',
                                borderRadius: '6px',
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
                                padding: '5px 9px',
                                background: viewportMode === 'mobile' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                                color: viewportMode === 'mobile' ? '#818cf8' : '#94a3b8',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <Smartphone size={14} />
                            </button>
                          </div>
                        )}

                        {/* Open In New Tab Button */}
                        <button
                          type="button"
                          onClick={handleOpenInNewWindow}
                          title="Open full page in new window"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <ExternalLink size={12} />
                          <span>Fullscreen</span>
                        </button>

                        {/* Copy Code */}
                        <button
                          type="button"
                          onClick={() => handleCopyCode(singlePageResult.code || singlePageResult.preview_html)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {copied ? <CheckCheck size={12} color="#34d399" /> : <Copy size={12} />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>

                        {/* Download File */}
                        <button
                          type="button"
                          onClick={handleDownloadSinglePage}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            color: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          <Download size={12} />
                          <span>{downloadSuccess ? 'Downloaded!' : 'Export File'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleOpenGitHubModal}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            color: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
                          }}
                        >
                          <GitPullRequest size={13} />
                          <span>Push to GitHub</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleOpenDeployModal}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 15px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                            border: 'none',
                            color: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 0 18px rgba(139, 92, 246, 0.45)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Zap size={13} />
                          <span>Deploy to Cloud</span>
                        </button>
                      </>
                    )}

                    {genMode === 'project' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(projectFiles[activeFile])}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {copied ? <CheckCheck size={12} color="#34d399" /> : <Copy size={12} />}
                          <span>{copied ? 'Copied' : 'Copy File'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadZip}
                          disabled={generating}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                            border: 'none',
                            color: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          <Download size={12} />
                          <span>{downloadSuccess ? 'Downloaded ZIP!' : 'Download .ZIP'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleOpenGitHubModal}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 15px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            color: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
                          }}
                        >
                          <GitPullRequest size={13} />
                          <span>Push to GitHub</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleOpenDeployModal}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 16px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                            border: 'none',
                            color: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 0 20px rgba(139, 92, 246, 0.45)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Zap size={13} />
                          <span>Deploy to Cloud</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Canvas Main Body */}
                {genMode === 'single' ? (
                  singlePageResult ? (
                    previewTab === 'preview' ? (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        background: '#04060d',
                        padding: '16px 0',
                        minHeight: '700px',
                        overflowX: 'auto'
                      }}>
                        <iframe
                          title="AI Live Single Page Canvas"
                          srcDoc={singlePageResult?.preview_html || singlePageResult?.code}
                          style={{
                            width: viewportMode === 'mobile' ? '375px' : (viewportMode === 'tablet' ? '768px' : '100%'),
                            maxWidth: '100%',
                            height: '700px',
                            borderRadius: viewportMode === 'desktop' ? '0' : '10px',
                            border: viewportMode === 'desktop' ? 'none' : '1px solid rgba(255,255,255,0.15)',
                            boxShadow: viewportMode === 'desktop' ? 'none' : '0 20px 50px rgba(0,0,0,0.8)',
                            background: '#070913',
                            transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                          sandbox="allow-scripts"
                        />
                      </div>
                    ) : (
                      <pre style={{
                        background: '#060910',
                        padding: '24px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        lineHeight: 1.65,
                        color: '#f8fafc',
                        height: '700px',
                        overflowY: 'auto',
                        margin: 0
                      }}>
                        <code>{singlePageResult?.code || singlePageResult?.preview_html}</code>
                      </pre>
                    )
                  ) : (
                    /* CLEAN MODERN BLUEPRINT STUDIO PLACEHOLDER */
                    <div style={{
                      minHeight: '440px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '52px 24px',
                      background: 'radial-gradient(circle at 50% 35%, rgba(99,102,241,0.06) 0%, #070913 70%)',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                        opacity: 0.3,
                        pointerEvents: 'none'
                      }} />

                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: selectedArchObj.accentBg,
                        border: `1px solid ${selectedArchObj.accentBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: selectedArchObj.accentColor,
                        marginBottom: '18px',
                        boxShadow: `0 0 30px ${selectedArchObj.accentBg}`
                      }}>
                        {renderArchetypeIcon(selectedArchObj.iconKey, 28, selectedArchObj.accentColor)}
                      </div>

                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '3px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#94a3b8',
                        marginBottom: '10px'
                      }}>
                        <span>INTERACTIVE CANVAS READY</span>
                      </div>

                      <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                        Ready to Synthesize {selectedArchObj.name}
                      </h2>

                      <p style={{ fontSize: '13.5px', color: '#94a3b8', maxWidth: '580px', lineHeight: 1.6, marginBottom: '24px' }}>
                        Your configuration is loaded. Click <strong style={{ color: '#ffffff' }}>Generate Single Page UI</strong> to synthesize and preview your fully responsive component canvas.
                      </p>

                      {/* Architecture Summary Matrix */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '10px',
                        maxWidth: '780px',
                        width: '100%',
                        marginBottom: '28px',
                        textAlign: 'left'
                      }}>
                        <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Archetype</div>
                          <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedArchObj.name}</div>
                        </div>

                        <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Palette</div>
                          <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: useCustomColor ? customColor : selectedThemeObj.preview }} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{useCustomColor ? customColor : selectedThemeObj.name.split(' ')[0]}</span>
                          </div>
                        </div>

                        <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Navbar</div>
                          <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedNavbarObj.name}</div>
                        </div>

                        <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Blocks Active</div>
                          <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#34d399' }}>{selectedSections.length} of {MODULAR_SECTIONS.length} Sections</div>
                        </div>
                      </div>

                      {/* Primary Generate Button inside Canvas */}
                      <button
                        type="button"
                        onClick={handleGenerateSinglePage}
                        disabled={generating || !prompt.trim()}
                        style={{
                          padding: '13px 32px',
                          fontSize: '14px',
                          fontWeight: 800,
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                          border: 'none',
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 25px rgba(99, 102, 241, 0.45)'
                        }}
                      >
                        <Sparkles size={16} />
                        <span>Generate Single Page UI Now</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  )
                ) : (
                  /* FULL PROJECT MULTI-FILE CANVAS */
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '270px 1fr',
                    minHeight: '700px'
                  }}>
                    {/* Left: Project File Tree */}
                    <div style={{
                      background: 'rgba(10, 15, 29, 0.75)',
                      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '14px',
                      maxHeight: '700px',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '10px', padding: '0 6px' }}>
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
                              borderRadius: '7px',
                              background: isCur ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                              color: isCur ? '#ffffff' : '#94a3b8',
                              fontWeight: isCur ? 700 : 500,
                              border: isCur ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                              fontSize: '12px',
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
                            <FileCode size={14} color={isCur ? '#818cf8' : '#64748b'} />
                            <span>{filePath}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right: Code Viewer */}
                    <pre style={{
                      background: '#060910',
                      padding: '24px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      lineHeight: 1.65,
                      color: '#f8fafc',
                      maxHeight: '700px',
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

      {/* GITHUB PUSH MODAL */}
      {showGitHubModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0d111d',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '620px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 22px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(15, 23, 42, 0.8)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <GitPullRequest size={18} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    Push Project to GitHub
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Publish your scaffolded code into a new or existing repository
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGitHubModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {pushResult ? (
                <div style={{ textAlign: 'center', padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
                  }}>
                    <CheckCircle2 size={32} color="#ffffff" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: '0 0 6px' }}>
                      {pushResult.mode === 'pr' ? 'Pull Request Created Successfully!' : 'Project Published to GitHub!'}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                      Pushed <strong>{pushResult.committed_files?.length || 0} files</strong> to branch <code style={{ color: '#38bdf8' }}>{pushResult.branch || 'main'}</code> in <code style={{ color: '#38bdf8' }}>{pushResult.owner}/{pushResult.repo}</code>.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
                    <a
                      href={pushResult.direct_url || pushResult.repo_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                      }}
                    >
                      <span>Open on GitHub</span>
                      <ExternalLink size={14} />
                    </a>

                    <button
                      type="button"
                      onClick={() => navigate(`/analyzer?mode=github&repo=${encodeURIComponent(pushResult?.direct_url || pushResult?.repo_url || '')}`)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Scan in CodeLens AI
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowGitHubModal(false)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      Close
                    </button>
                  </div>

                  <div style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    fontSize: '12px',
                    color: '#94a3b8'
                  }}>
                    <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>Committed Files:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                      {pushResult.committed_files?.map(f => (
                        <span key={f} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 7px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Security Note */}
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '12px',
                    color: '#cbd5e1'
                  }}>
                    <Lock size={14} color="#34d399" style={{ flexShrink: 0 }} />
                    <span>Zero Data Retention: Personal Access Tokens are never stored on external databases and are used solely for direct TLS calls to GitHub API.</span>
                  </div>

                  {/* Target Repository Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#f8fafc', marginBottom: '5px' }}>
                      Target GitHub Repository Name or URL
                    </label>
                    <input
                      type="text"
                      value={githubRepoInput}
                      onChange={(e) => setGithubRepoInput(e.target.value)}
                      placeholder="e.g. codelens-service or https://github.com/your-username/your-repo"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'var(--font-mono)'
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                      Tip: Enter a repository name like <code>{name || 'my-app'}</code> (CodeLens will automatically create it on your GitHub account) or a full repository URL.
                    </span>
                  </div>

                  {/* GitHub Token Input */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#f8fafc' }}>
                        GitHub Personal Access Token (PAT)
                      </label>
                      <a
                        href="https://github.com/settings/tokens/new?scopes=repo&description=CodeLens%20Project%20Push"
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '11px', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span>Generate Token (repo scope)</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0 12px'
                    }}>
                      <Key size={14} color="#64748b" style={{ marginRight: '8px' }} />
                      <input
                        type={showTokenInput ? 'text' : 'password'}
                        value={githubToken}
                        onChange={(e) => {
                          setGithubToken(e.target.value);
                          if (rememberToken) localStorage.setItem('codelens_github_pat', e.target.value);
                        }}
                        placeholder="ghp_••••••••••••••••••••••••••••••••"
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '12.5px',
                          outline: 'none',
                          padding: '10px 0',
                          fontFamily: 'var(--font-mono)'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowTokenInput(!showTokenInput)}
                        style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', fontSize: '11px' }}
                      >
                        {showTokenInput ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  {/* Commit Branch & Options */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#cbd5e1' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="pushBranchMode"
                          checked={branchMode === 'direct'}
                          onChange={() => setBranchMode('direct')}
                        />
                        <span>Commit directly to <strong>{targetBranch || 'main'}</strong></span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="pushBranchMode"
                          checked={branchMode === 'pr'}
                          onChange={() => setBranchMode('pr')}
                        />
                        <span>Create Pull Request</span>
                      </label>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={rememberToken}
                        onChange={(e) => setRememberToken(e.target.checked)}
                      />
                      <span>Remember token</span>
                    </label>
                  </div>

                  {/* Commit Message */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                      Commit Message
                    </label>
                    <input
                      type="text"
                      value={pushCommitMsg}
                      onChange={(e) => setPushCommitMsg(e.target.value)}
                      placeholder="feat(scaffold): initialize architecture via CodeLens AI"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#ffffff',
                        fontSize: '12px',
                        outline: 'none',
                        fontFamily: 'var(--font-mono)'
                      }}
                    />
                  </div>

                  {/* Files Preview */}
                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    padding: '10px 14px'
                  }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Files to be Committed ({genMode === 'single' ? 1 : Object.keys(projectFiles).length} files):</span>
                      <span style={{ color: '#34d399' }}>Ready to push</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '90px', overflowY: 'auto' }}>
                      {genMode === 'single' ? (
                        <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                          {singlePageResult?.filename || 'src/App.jsx'}
                        </span>
                      ) : (
                        Object.keys(projectFiles).map(f => (
                          <span key={f} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                            {f}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Progress Banner */}
                  {isPushing && (
                    <div style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#38bdf8',
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Loader2 size={16} className="spin" />
                      <span>{pushProgress || 'Connecting to GitHub API and creating files...'}</span>
                    </div>
                  )}

                  {/* Error Banner */}
                  {pushError && (
                    <div style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#f87171',
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}>
                      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>Push Error:</strong> {pushError}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <button
                      type="button"
                      disabled={isPushing || !githubToken}
                      onClick={handlePushToGitHub}
                      style={{
                        flex: 1,
                        padding: '12px 20px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '13.5px',
                        fontWeight: 800,
                        cursor: (isPushing || !githubToken) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                        opacity: (isPushing || !githubToken) ? 0.6 : 1
                      }}
                    >
                      {isPushing ? (
                        <>
                          <Loader2 size={16} className="spin" />
                          <span>Pushing to GitHub...</span>
                        </>
                      ) : (
                        <>
                          <GitPullRequest size={16} />
                          <span>Authorize &amp; Push to GitHub</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGitHubModal(false)}
                      style={{
                        padding: '12px 18px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#94a3b8',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CLOUD DEPLOYMENT MODAL (Vercel, Render, Netlify, Railway) */}
      {showDeployModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0a0e1a',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
                }}>
                  <Zap size={20} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Deploy to Cloud Platform
                    <span style={{ fontSize: '10px', background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.4)', color: '#d8b4fe', padding: '1px 8px', borderRadius: '12px', fontWeight: 700 }}>
                      MULTI-CLOUD
                    </span>
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Provision live cloud hosting on Vercel, Render, Netlify, or Railway
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDeployModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '22px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {deployResult ? (
                /* SUCCESS CELEBRATION DASHBOARD */
                <div style={{ textAlign: 'center', padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 35px rgba(16, 185, 129, 0.55)'
                  }}>
                    <CheckCircle2 size={36} color="#ffffff" />
                  </div>

                  <div>
                    <h3 style={{ fontSize: '21px', fontWeight: 900, color: '#ffffff', margin: '0 0 6px' }}>
                      Deployment Live on {deployResult.platform?.toUpperCase() || deployPlatform.toUpperCase()}!
                    </h3>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: 1.5, maxWidth: '520px' }}>
                      {deployResult.message || 'Cloud deployment provisioned and building automatically.'}
                    </p>
                  </div>

                  {/* Live URL Highlight Card */}
                  <div style={{
                    width: '100%',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Production Live URL
                    </div>
                    <a
                      href={deployResult.live_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: '15px',
                        fontWeight: 800,
                        color: '#ffffff',
                        fontFamily: 'var(--font-mono)',
                        textDecoration: 'underline',
                        wordBreak: 'break-all'
                      }}
                    >
                      {deployResult.live_url}
                    </a>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
                      <a
                        href={deployResult.live_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: '8px 18px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff',
                          fontSize: '12.5px',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
                        }}
                      >
                        <span>Visit Live Site</span>
                        <ExternalLink size={13} />
                      </a>

                      {deployResult.dashboard_url && (
                        <a
                          href={deployResult.dashboard_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#e2e8f0',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>{deployPlatform.toUpperCase()} Dashboard</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Connect to CodeLens AI Audit */}
                  <div style={{
                    width: '100%',
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#c7d2fe' }}>
                        Run CodeLens AI Observability Scan
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                        Probe security headers, SSL status, and cold-start latency now
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/analyzer?target=live&url=${encodeURIComponent(deployResult.live_url)}`)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: '#ffffff',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
                      }}
                    >
                      <Sparkles size={13} />
                      <span>Audit Live Deployment</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowDeployModal(false)}
                    style={{
                      padding: '8px 24px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#94a3b8',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: '4px'
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* DEPLOY CONFIGURATION FORM */
                <>
                  {/* Platform Selector Grid */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#cbd5e1', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      1. Select Target Cloud Platform:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '8px' }}>
                      {DEPLOY_PLATFORMS.map((plat) => {
                        const isSelected = deployPlatform === plat.id;
                        return (
                          <div
                            key={plat.id}
                            onClick={() => handleSelectDeployPlatform(plat.id)}
                            style={{
                              background: isSelected ? plat.gradient : 'rgba(255, 255, 255, 0.03)',
                              border: isSelected ? `1.5px solid ${plat.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '10px',
                              padding: '12px 14px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              position: 'relative',
                              transition: 'all 0.15s ease',
                              boxShadow: isSelected ? `0 0 15px ${plat.glow}` : 'none'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '15px', fontWeight: 900, color: plat.color }}>
                                {plat.iconText} {plat.name}
                              </span>
                              {isSelected && <Check size={14} color={plat.color} />}
                            </div>
                            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                              {plat.badge}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Platform Info Banner */}
                  {(() => {
                    const currentPlat = DEPLOY_PLATFORMS.find(p => p.id === deployPlatform) || DEPLOY_PLATFORMS[0];
                    return (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: '#94a3b8'
                      }}>
                        <span>{currentPlat.desc}</span>
                        <a
                          href={currentPlat.tokenUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: '#38bdf8',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700,
                            flexShrink: 0
                          }}
                        >
                          <span>Get {currentPlat.tokenName.split(' ')[0]} Key</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    );
                  })()}

                  {/* Project / Service Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                      Project / App Name on Cloud
                    </label>
                    <input
                      type="text"
                      value={deployProjectName}
                      onChange={(e) => setDeployProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      placeholder="e.g. codelens-service"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'var(--font-mono)'
                      }}
                    />
                  </div>

                  {/* API Token Input (except for Railway 1-click) */}
                  {deployPlatform !== 'railway' && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
                          {deployPlatform.toUpperCase()} API Token
                        </label>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          Saved locally in your browser
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        padding: '0 12px'
                      }}>
                        <Key size={14} color="#64748b" style={{ marginRight: '8px' }} />
                        <input
                          type={showDeployTokenInput ? 'text' : 'password'}
                          value={deployToken}
                          onChange={(e) => {
                            setDeployToken(e.target.value);
                            if (deployRememberToken) localStorage.setItem(`codelens_${deployPlatform}_token`, e.target.value);
                          }}
                          placeholder={deployPlatform === 'render' ? 'rnd_••••••••••••••••••••' : (deployPlatform === 'vercel' ? '••••••••••••••••••••••••' : 'nfp_••••••••••••••••••••')}
                          style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: '#ffffff',
                            fontSize: '12.5px',
                            outline: 'none',
                            padding: '10px 0',
                            fontFamily: 'var(--font-mono)'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowDeployTokenInput(!showDeployTokenInput)}
                          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', fontSize: '11px' }}
                        >
                          {showDeployTokenInput ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Render Specific Settings */}
                  {deployPlatform === 'render' && (
                    <div style={{
                      background: 'rgba(0, 229, 153, 0.05)',
                      border: '1px solid rgba(0, 229, 153, 0.2)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#00e599', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Server size={14} />
                        <span>Render Service Architecture:</span>
                      </div>

                      <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: '#cbd5e1' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="renderServiceType"
                            checked={deployServiceType === 'web_service'}
                            onChange={() => setDeployServiceType('web_service')}
                          />
                          <span>Web Service (Docker Backend)</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="renderServiceType"
                            checked={deployServiceType === 'static_site'}
                            onChange={() => setDeployServiceType('static_site')}
                          />
                          <span>Static Site (React/Vite)</span>
                        </label>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                          GitHub Repository URL or Name (Render pulls from Git):
                        </label>
                        <input
                          type="text"
                          value={deployGitHubRepo}
                          onChange={(e) => setDeployGitHubRepo(e.target.value)}
                          placeholder="e.g. codelens-service or https://github.com/..."
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            fontSize: '12px',
                            outline: 'none',
                            fontFamily: 'var(--font-mono)'
                          }}
                        />
                      </div>

                      {/* If user needs GitHub Token to auto-push for Render */}
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                          GitHub PAT (to auto-push repository before deploying):
                        </label>
                        <input
                          type={showDeployGhTokenInput ? 'text' : 'password'}
                          value={deployGitHubToken}
                          onChange={(e) => {
                            setDeployGitHubToken(e.target.value);
                            if (deployRememberToken) localStorage.setItem('codelens_github_pat', e.target.value);
                          }}
                          placeholder="ghp_••••••••••••••••••••••••••••••••"
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            fontSize: '12px',
                            outline: 'none',
                            fontFamily: 'var(--font-mono)'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Remember Token Checkbox */}
                  {deployPlatform !== 'railway' && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={deployRememberToken}
                        onChange={(e) => setDeployRememberToken(e.target.checked)}
                      />
                      <span>Remember API key securely in browser</span>
                    </label>
                  )}

                  {/* Files Manifest Preview */}
                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    padding: '10px 14px'
                  }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Files Ready to Deploy ({genMode === 'single' ? (singlePageResult ? 2 : 0) : Object.keys(projectFiles).length} files):</span>
                      <span style={{ color: '#38bdf8' }}>
                        {deployPlatform === 'vercel' ? 'Zero-Git Instant Upload' : (deployPlatform === 'netlify' ? 'Atomic ZIP Bundle' : 'Git Synchronized')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '80px', overflowY: 'auto' }}>
                      {genMode === 'single' ? (
                        <>
                          <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                            index.html
                          </span>
                          <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                            {singlePageResult?.filename || 'src/App.jsx'}
                          </span>
                        </>
                      ) : (
                        Object.keys(projectFiles).map(f => (
                          <span key={f} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                            {f}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Progress Banner */}
                  {isDeploying && (
                    <div style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(168, 85, 247, 0.15)',
                      border: '1px solid rgba(168, 85, 247, 0.4)',
                      color: '#d8b4fe',
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Loader2 size={16} className="spin" />
                      <span>{deployProgress || 'Provisioning cloud infrastructure and triggering deployment...'}</span>
                    </div>
                  )}

                  {/* Error Banner */}
                  {deployError && (
                    <div style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#f87171',
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}>
                      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>Deployment Error:</strong> {deployError}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <button
                      type="button"
                      disabled={isDeploying || (deployPlatform !== 'railway' && !deployToken)}
                      onClick={handleExecuteDeployment}
                      style={{
                        flex: 1,
                        padding: '13px 22px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '13.5px',
                        fontWeight: 800,
                        cursor: (isDeploying || (deployPlatform !== 'railway' && !deployToken)) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 25px rgba(139, 92, 246, 0.45)',
                        opacity: (isDeploying || (deployPlatform !== 'railway' && !deployToken)) ? 0.6 : 1
                      }}
                    >
                      {isDeploying ? (
                        <>
                          <Loader2 size={16} className="spin" />
                          <span>Deploying to {deployPlatform.toUpperCase()}...</span>
                        </>
                      ) : (
                        <>
                          <Zap size={16} />
                          <span>
                            {deployPlatform === 'railway' 
                              ? 'Open Railway 1-Click Deploy ↗' 
                              : `Authorize & Deploy to ${deployPlatform.toUpperCase()}`}
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowDeployModal(false)}
                      style={{
                        padding: '12px 18px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#94a3b8',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
