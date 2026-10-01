// CodeLens AI - Comprehensive User Settings Service
// Manages Appearance, Editor, DSA Preferences, API, Sound, and Data Backup

const SETTINGS_KEY = 'codelens_user_settings';

export const DEFAULT_SETTINGS = {
  // Appearance
  theme: 'dark-pro',
  density: 'comfortable', // 'comfortable' | 'compact'
  animations: true,
  glassmorphism: true,

  // Editor
  fontFamily: 'Fira Code', // 'Fira Code' | 'JetBrains Mono' | 'Source Code Pro' | 'Consolas'
  fontSize: '14px', // '12px' | '14px' | '16px' | '18px'
  tabSize: 4, // 2 | 4
  showLineNumbers: true,

  // Analysis & DSA
  defaultPlatform: 'LeetCode', // 'LeetCode' | 'MentorPick' | 'CodeChef' | 'HackerRank'
  defaultLanguage: 'Java', // 'Java' | 'Python' | 'C++' | 'C'
  autoTraceOnPaste: true,
  strictComplexity: true,
  edgeCaseSensitivity: 'high', // 'standard' | 'high'

  // Notifications & Sound
  soundEffects: false,
  showTelemetry: true,

  // API & Sandbox
  apiUrl: 'http://localhost:8080/api',
  dockerTimeoutSeconds: 60,
  aiProvider: 'ast-builtin' // 'ast-builtin' | 'gemini' | 'openai' | 'ollama'
};

export const settingsService = {
  getSettings() {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) return { ...DEFAULT_SETTINGS };
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  },

  updateSetting(key, value) {
    const current = this.getSettings();
    const updated = { ...current, [key]: value };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    window.dispatchEvent(new CustomEvent('codelens-settings-change', { detail: updated }));
    return updated;
  },

  updateAll(newSettings) {
    const merged = { ...DEFAULT_SETTINGS, ...newSettings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('codelens-settings-change', { detail: merged }));
    return merged;
  },

  resetDefaults() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    window.dispatchEvent(new CustomEvent('codelens-settings-change', { detail: DEFAULT_SETTINGS }));
    return DEFAULT_SETTINGS;
  },

  exportSettingsAndHistoryJson() {
    const settings = this.getSettings();
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem('codelens_user_analyses') || '[]');
    } catch (e) {
      console.warn('Failed to parse cached history JSON:', e);
      history = [];
    }
    return JSON.stringify({ settings, history, exportedAt: new Date().toISOString() }, null, 2);
  }
};
