import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Palette, 
  Check, 
  Trash2, 
  LogOut, 
  User, 
  Settings as SettingsIcon,
  Code2,
  Cpu,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Sliders,
  Terminal,
  Zap,
  Box
} from 'lucide-react';
import { THEMES, themeService } from '../services/theme';
import { auth } from '../services/auth';
import { storage } from '../services/storage';
import { settingsService, DEFAULT_SETTINGS } from '../services/settingsService';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState(settingsService.getSettings());
  const [currentUser, setCurrentUser] = useState(auth.getCurrentUser());
  const [exportMessage, setExportMessage] = useState('');

  useEffect(() => {
    setSettings(settingsService.getSettings());
    setCurrentUser(auth.getCurrentUser());

    const handleThemeChange = (e) => {
      setSettings(prev => ({ ...prev, theme: e.detail }));
    };
    const handleSettingsChange = (e) => setSettings(e.detail);

    window.addEventListener('codelens-theme-change', handleThemeChange);
    window.addEventListener('codelens-settings-change', handleSettingsChange);
    return () => {
      window.removeEventListener('codelens-theme-change', handleThemeChange);
      window.removeEventListener('codelens-settings-change', handleSettingsChange);
    };
  }, []);

  const handleUpdate = (key, value) => {
    const updated = settingsService.updateSetting(key, value);
    setSettings(updated);
    if (key === 'theme') {
      themeService.setTheme(value);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Restore all settings to default values?')) {
      const def = settingsService.resetDefaults();
      themeService.setTheme(def.theme);
      setSettings(def);
    }
  };

  const handleExportData = () => {
    const dataStr = settingsService.exportSettingsAndHistoryJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codelens-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMessage('Backup downloaded successfully!');
    setTimeout(() => setExportMessage(''), 3000);
  };

  const handleClearHistory = () => {
    if (confirm('Permanently delete all stored code trace history?')) {
      storage.clearAll();
      alert('Analysis history cleared.');
      window.location.reload();
    }
  };

  const handleLogout = () => {
    auth.logout();
    setCurrentUser(null);
    window.location.href = '/';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '42px 0 85px' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <SettingsIcon size={22} />
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Preferences &amp; System Settings
              </h1>
            </div>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              Configure your visual appearance, editor fonts, DSA analyzer rules, API sandbox, and backups.
            </p>
          </div>

          {/* Settings Tabs Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '240px 1fr',
            gap: '24px',
            alignItems: 'start'
          }}>
            {/* Left Nav Menu */}
            <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { id: 'appearance', label: 'Appearance & Themes', icon: Palette },
                { id: 'editor', label: 'Code Editor & Fonts', icon: Code2 },
                { id: 'dsa', label: 'DSA & Analysis Rules', icon: Zap },
                { id: 'api', label: 'API & Sandbox Container', icon: Cpu },
                { id: 'account', label: 'Account & Session', icon: User },
                { id: 'backup', label: 'Data, Backup & Export', icon: Sliders }
              ].map(tab => {
                const Icon = tab.icon;
                const isCur = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: isCur ? 'var(--primary)' : 'transparent',
                      color: isCur ? '#ffffff' : 'var(--text-main)',
                      fontWeight: isCur ? 700 : 500,
                      fontSize: '13.5px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Tab Content Panels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* TAB 1: APPEARANCE */}
              {activeTab === 'appearance' && (
                <div className="glass-card" style={{ padding: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Visual Theme
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    Select your preferred color palette across the entire platform:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                    {THEMES.map((t) => {
                      const isSelected = settings.theme === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => handleUpdate('theme', t.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            borderRadius: 'var(--radius-md)',
                            background: isSelected ? 'var(--bg-surface)' : 'var(--bg-secondary)',
                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ display: 'flex', gap: '4px', padding: '4px 6px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                              {t.colors.map((c, i) => (
                                <span key={i} style={{ width: '13px', height: '13px', borderRadius: '50%', background: c }} />
                              ))}
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{t.name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.description}</div>
                            </div>
                          </div>
                          {isSelected && <Check size={16} color="var(--primary)" strokeWidth={3} />}
                        </div>
                      );
                    })}
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
                    Layout &amp; Performance
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>UI Density</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Adjust spacing of tables and cards</div>
                      </div>
                      <select
                        value={settings.density}
                        onChange={(e) => handleUpdate('density', e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
                      >
                        <option value="comfortable">Comfortable</option>
                        <option value="compact">Compact (High Density)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>Glassmorphism &amp; Blur Effects</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Disable on lower-spec hardware for maximum FPS</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.glassmorphism}
                        onChange={(e) => handleUpdate('glassmorphism', e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CODE EDITOR & FONTS */}
              {activeTab === 'editor' && (
                <div className="glass-card" style={{ padding: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '18px' }}>
                    Code Editor Preferences
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>Font Family</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Monospaced typeface for code editor and diff viewer</div>
                      </div>
                      <select
                        value={settings.fontFamily}
                        onChange={(e) => handleUpdate('fontFamily', e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
                      >
                        <option value="Fira Code">Fira Code (Ligatures)</option>
                        <option value="JetBrains Mono">JetBrains Mono</option>
                        <option value="Source Code Pro">Source Code Pro</option>
                        <option value="Consolas">Consolas</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>Font Size</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Editor code text size</div>
                      </div>
                      <select
                        value={settings.fontSize}
                        onChange={(e) => handleUpdate('fontSize', e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
                      >
                        <option value="12px">12px (Compact)</option>
                        <option value="14px">14px (Default)</option>
                        <option value="16px">16px (Large)</option>
                        <option value="18px">18px (Presentation)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>Tab Indentation Width</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Number of spaces per tab</div>
                      </div>
                      <select
                        value={settings.tabSize}
                        onChange={(e) => handleUpdate('tabSize', parseInt(e.target.value, 10))}
                        style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
                      >
                        <option value={2}>2 spaces</option>
                        <option value={4}>4 spaces</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>Show Line Numbers</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Display gutter numbers beside code</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showLineNumbers}
                        onChange={(e) => handleUpdate('showLineNumbers', e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DSA & ANALYSIS RULES */}
              {activeTab === 'dsa' && (
                <div className="glass-card" style={{ padding: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '18px' }}>
                    Competitive Programming &amp; DSA Rules
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>Default Problem Platform</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pre-selected in Code Analyzer</div>
                      </div>
                      <select
                        value={settings.defaultPlatform}
                        onChange={(e) => handleUpdate('defaultPlatform', e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
                      >
                        <option value="LeetCode">LeetCode</option>
                        <option value="MentorPick">MentorPick</option>
                        <option value="CodeChef">CodeChef</option>
                        <option value="HackerRank">HackerRank</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>Default Coding Language</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pre-selected language for snippets</div>
                      </div>
                      <select
                        value={settings.defaultLanguage}
                        onChange={(e) => handleUpdate('defaultLanguage', e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
                      >
                        <option value="Java">Java</option>
                        <option value="Python">Python</option>
                        <option value="C++">C++</option>
                        <option value="C">C</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>Strict Complexity Evaluation</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Flag O(N²) solutions as critical bottlenecks on N ≥ 10⁵</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.strictComplexity}
                        onChange={(e) => handleUpdate('strictComplexity', e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>Auto-Trace Iterations on Paste</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Immediately analyze when pasting code from clipboard</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.autoTraceOnPaste}
                        onChange={(e) => handleUpdate('autoTraceOnPaste', e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: API & DOCKER SANDBOX */}
              {activeTab === 'api' && (
                <div className="glass-card" style={{ padding: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '18px' }}>
                    API Endpoint &amp; Sandbox Configuration
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                        Spring Boot Backend API URL
                      </label>
                      <input
                        type="text"
                        value={settings.apiUrl}
                        onChange={(e) => handleUpdate('apiUrl', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-main)' }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>Docker Sandbox Timeout</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Maximum test execution runtime in container</div>
                      </div>
                      <select
                        value={settings.dockerTimeoutSeconds}
                        onChange={(e) => handleUpdate('dockerTimeoutSeconds', parseInt(e.target.value, 10))}
                        style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
                      >
                        <option value={30}>30 seconds</option>
                        <option value={60}>60 seconds (Standard)</option>
                        <option value={120}>120 seconds (Large repos)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>AI Reasoning Engine</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Engine powering CodeDoctor refactors</div>
                      </div>
                      <select
                        value={settings.aiProvider}
                        onChange={(e) => handleUpdate('aiProvider', e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
                      >
                        <option value="ast-builtin">Local AST Analyzer + CodeDoctor (Active)</option>
                        <option value="gemini">Google Gemini 1.5 Pro</option>
                        <option value="openai">OpenAI GPT-4o</option>
                        <option value="ollama">Local Ollama LLM</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ACCOUNT */}
              {activeTab === 'account' && (
                <div className="glass-card" style={{ padding: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '18px' }}>
                    Account &amp; Session Management
                  </h3>

                  {currentUser ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                          {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>{currentUser.name}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{currentUser.email} • Primary: {currentUser.platform || 'LeetCode'}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="btn-secondary"
                        style={{ padding: '10px 18px', color: 'var(--accent-pink)', borderColor: 'rgba(244, 63, 94, 0.4)', width: 'fit-content' }}
                      >
                        <LogOut size={16} />
                        <span>Log Out of CodeLens</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: '24px', textAlign: 'center' }}>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>You are currently browsing as a guest.</p>
                      <a href="/login" className="btn-primary" style={{ padding: '10px 20px' }}>Sign In</a>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: BACKUP & DATA */}
              {activeTab === 'backup' && (
                <div className="glass-card" style={{ padding: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '18px' }}>
                    Data, Export &amp; Backup
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>Export Data to JSON</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Download all your preferences and code trace history</div>
                      </div>
                      <button type="button" onClick={handleExportData} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12.5px' }}>
                        <Download size={14} />
                        <span>Export Backup</span>
                      </button>
                    </div>

                    {exportMessage && (
                      <div style={{ fontSize: '13px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                        ✓ {exportMessage}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>Reset All Settings to Factory Default</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Restore default theme, fonts, and rules</div>
                      </div>
                      <button type="button" onClick={handleResetDefaults} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12.5px' }}>
                        <RefreshCw size={14} />
                        <span>Reset Defaults</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-pink)' }}>Clear All Code Analysis Records</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Permanently erase your trace history</div>
                      </div>
                      <button type="button" onClick={handleClearHistory} style={{ padding: '8px 14px', borderRadius: '6px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.35)', color: 'var(--accent-pink)', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>
                        <Trash2 size={14} />
                        <span>Clear History</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
