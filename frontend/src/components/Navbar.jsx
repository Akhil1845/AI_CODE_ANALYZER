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

  const navLinks = [
    { path: '/', label: 'Overview' },
    { path: '/code-analyzer', label: 'DSA Analyzer' },
    { path: '/project-generator', label: 'Project Generator' },
    { path: '/analyzer', label: 'Project Scan' },
    { path: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <>
      <header style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--header-bg)',
        backdropFilter: 'blur(24px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'background-color 0.25s ease'
      }}>
        {/* Spacious, wide navbar wrapper */}
        <div style={{
          width: '100%',
          maxWidth: '1680px',
          margin: '0 auto',
          padding: '0 clamp(24px, 4vw, 56px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px'
        }}>
          {/* 1. Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--primary-glow)',
              color: '#ffffff'
            }}>
              <Terminal size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-main)'
                }}>
                  CodeLens<span style={{ color: 'var(--primary)' }}>.AI</span>
                </span>
                <span className="badge badge-medium" style={{ fontSize: '10px', padding: '2px 7px' }}>
                  v1.2
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.02em', fontWeight: 500 }}>
                Your code. Understood.
              </div>
            </div>
          </Link>

          {/* 2. Spacious Center Navigation (Clean text links with indicator bar) */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '36px'
          }}>
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    position: 'relative',
                    padding: '8px 2px',
                    fontSize: '14.5px',
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--text-main)' : 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = 'var(--text-main)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      borderRadius: '2px',
                      background: 'var(--primary)',
                      boxShadow: '0 0 10px var(--primary)'
                    }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Spacious Right Controls (Theme, Settings, Auth) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Minimal Ghost Theme Switcher */}
            <button
              type="button"
              onClick={handleCycleTheme}
              title={`Active Theme: ${currentThemeObj.name} (Click to switch)`}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Palette size={18} color="var(--primary)" />
            </button>

            {/* Minimal Ghost Settings Gear */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              title="Preferences & Settings"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <SettingsIcon size={18} />
            </button>

            {/* Subtle Vertical Divider */}
            <div style={{
              width: '1px',
              height: '24px',
              background: 'var(--border-subtle)',
              margin: '0 4px'
            }} />

            {/* Authentication Controls: Spacious & Balanced */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#ffffff'
                  }}>
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {currentUser.name}
                  </span>
                </div>

                <Link
                  to="/logout"
                  title="Sign out of CodeLens"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-muted)',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent-pink)';
                    e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link
                  to="/login"
                  className="btn-primary"
                  style={{
                    padding: '9px 22px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/logout"
                  title="Go to Log Out Page"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-muted)',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent-pink)';
                    e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Left Edge Cursor Hover Activated History Drawer (hidden on auth pages) */}
      {location.pathname !== '/login' && location.pathname !== '/logout' && <HistoryDrawer />}
    </>
  );
}
