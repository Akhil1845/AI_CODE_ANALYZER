import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Terminal, Code2, LogOut, Settings as SettingsIcon, Palette, Box } from 'lucide-react';
import { auth } from '../services/auth';
import { themeService, THEMES } from '../services/theme';
import SettingsModal from './SettingsModal';
import HistoryDrawer from './HistoryDrawer';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark-pro');

  useEffect(() => {
    setCurrentTheme(themeService.init());
    setCurrentUser(auth.getCurrentUser());

    const handleThemeChange = (e) => setCurrentTheme(e.detail);
    window.addEventListener('codelens-theme-change', handleThemeChange);
    return () => window.removeEventListener('codelens-theme-change', handleThemeChange);
  }, [location.pathname]);

  const handleCycleTheme = () => {
    const currentIndex = THEMES.findIndex(t => t.id === currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    const nextTheme = THEMES[nextIndex].id;
    themeService.setTheme(nextTheme);
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const currentThemeObj = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  return (
    <>
      <header style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--header-bg)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'background-color 0.25s ease'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px'
        }}>
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--primary-glow)',
              color: '#ffffff'
            }}>
              <Terminal size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '19px',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-main)'
                }}>
                  CodeLens<span style={{ color: 'var(--primary)' }}>.AI</span>
                </span>
                <span className="badge badge-medium" style={{ fontSize: '10px' }}>
                  v1.2
                </span>
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', letterSpacing: '0.02em', fontWeight: 500 }}>
                Your code. Understood.
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link
              to="/"
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13.5px',
                fontWeight: 600,
                color: isActive('/') ? 'var(--text-main)' : 'var(--text-muted)',
                background: isActive('/') ? 'var(--bg-surface)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
            >
              Overview
            </Link>

            <Link
              to="/code-analyzer"
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13.5px',
                fontWeight: 700,
                color: isActive('/code-analyzer') ? '#ffffff' : 'var(--primary)',
                background: isActive('/code-analyzer') ? 'var(--primary)' : 'rgba(99, 102, 241, 0.12)',
                border: '1px solid ' + (isActive('/code-analyzer') ? 'transparent' : 'var(--border-accent)'),
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <Code2 size={15} />
              <span>DSA Analyzer</span>
            </Link>

            <Link
              to="/project-generator"
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13.5px',
                fontWeight: 600,
                color: isActive('/project-generator') ? 'var(--text-main)' : 'var(--text-muted)',
                background: isActive('/project-generator') ? 'var(--bg-surface)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <Box size={15} color="var(--primary)" />
              <span>Project Generator</span>
            </Link>

            <Link
              to="/analyzer"
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13.5px',
                fontWeight: 600,
                color: isActive('/analyzer') ? 'var(--text-main)' : 'var(--text-muted)',
                background: isActive('/analyzer') ? 'var(--bg-surface)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
            >
              Project Scan
            </Link>

            <Link
              to="/dashboard"
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13.5px',
                fontWeight: 600,
                color: isActive('/dashboard') ? 'var(--text-main)' : 'var(--text-muted)',
                background: isActive('/dashboard') ? 'var(--bg-surface)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
            >
              Dashboard
            </Link>
          </nav>

          {/* Right Controls: Theme, Settings, Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Quick Theme Cycle Button */}
            <button
              type="button"
              onClick={handleCycleTheme}
              title={`Active Theme: ${currentThemeObj.name}. Click to switch.`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Palette size={14} color="var(--primary)" />
              <span>{currentThemeObj.name.split(' ')[0]}</span>
            </button>

            {/* Settings Gear Modal */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              title="Settings & Preferences"
              style={{
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <SettingsIcon size={16} />
            </button>

            {/* Authentication Controls: Sign In & Log Out always accessible */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#ffffff'
                  }}>
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {currentUser.name}
                  </span>
                </div>

                <Link
                  to="/logout"
                  title="Log Out of CodeLens"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(244, 63, 94, 0.12)',
                    border: '1px solid rgba(244, 63, 94, 0.35)',
                    color: 'var(--accent-pink)',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  to="/login"
                  className="btn-primary"
                  style={{ padding: '7px 14px', fontSize: '13px' }}
                >
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/logout"
                  title="Log Out / End Session"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(244, 63, 94, 0.12)',
                    border: '1px solid rgba(244, 63, 94, 0.35)',
                    color: 'var(--accent-pink)',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Left Edge Cursor Hover Activated History Drawer */}
      <HistoryDrawer />
    </>
  );
}
