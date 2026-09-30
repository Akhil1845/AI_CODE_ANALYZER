// CodeLens AI - Professional Multi-Theme System
// Supports: Dark Professional, Light Clean, Warm Amber, Cyber Neon, and Nord Arctic

export const THEMES = [
  {
    id: 'dark-pro',
    name: 'Dark Professional',
    description: 'JetBrains & Linear inspired deep slate with electric indigo accents',
    colors: ['#090d16', '#1e2942', '#6366f1', '#10b981'],
    type: 'dark'
  },
  {
    id: 'light',
    name: 'Light Clean',
    description: 'Crisp, high-legibility studio theme for well-lit environments',
    colors: ['#f8fafc', '#ffffff', '#4f46e5', '#0f172a'],
    type: 'light'
  },
  {
    id: 'warm',
    name: 'Warm Amber & Sepia',
    description: 'Cozy espresso and terracotta palette that eliminates blue light eye fatigue',
    colors: ['#15110d', '#231d16', '#d97706', '#faf4ed'],
    type: 'dark'
  },
  {
    id: 'cyber',
    name: 'Cyber Midnight',
    description: 'Synthwave fuchsia, violet, and deep pitch black with glowing neon badges',
    colors: ['#05060d', '#11152a', '#ec4899', '#a855f7'],
    type: 'dark'
  },
  {
    id: 'nord',
    name: 'Nordic Frost',
    description: 'Cool Arctic navy, icy cyan, and calm polar tones',
    colors: ['#0e141f', '#1a2336', '#38bdf8', '#88c0d0'],
    type: 'dark'
  }
];

const THEME_STORAGE_KEY = 'codelens_theme';

export const themeService = {
  getTheme() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'dark-pro';
    } catch {
      return 'dark-pro';
    }
  },

  setTheme(themeId) {
    const valid = THEMES.find(t => t.id === themeId);
    const chosen = valid ? valid.id : 'dark-pro';

    try {
      localStorage.setItem(THEME_STORAGE_KEY, chosen);
    } catch (e) {
      console.warn(e);
    }

    document.documentElement.setAttribute('data-theme', chosen);
    window.dispatchEvent(new CustomEvent('codelens-theme-change', { detail: chosen }));
    return chosen;
  },

  init() {
    const saved = this.getTheme();
    document.documentElement.setAttribute('data-theme', saved);
    return saved;
  }
};
