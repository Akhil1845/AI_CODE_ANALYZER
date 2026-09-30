import React, { useState, useEffect } from 'react';
import { X, Palette, Check, Sun, Moon, Sparkles, Coffee, Shield, Trash2, LogOut, User } from 'lucide-react';
import { THEMES, themeService } from '../services/theme';
import { auth } from '../services/auth';
import { storage } from '../services/storage';

export default function SettingsModal({ isOpen, onClose }) {
  const [currentTheme, setCurrentTheme] = useState(themeService.getTheme());
  const [currentUser, setCurrentUser] = useState(auth.getCurrentUser());

  useEffect(() => {
    setCurrentTheme(themeService.getTheme());
    setCurrentUser(auth.getCurrentUser());

    const handleThemeChange = (e) => setCurrentTheme(e.detail);
    window.addEventListener('codelens-theme-change', handleThemeChange);
    return () => window.removeEventListener('codelens-theme-change', handleThemeChange);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectTheme = (themeId) => {
    themeService.setTheme(themeId);
    setCurrentTheme(themeId);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your code analysis history?')) {
      storage.clearAll();
      window.location.reload();
    }
  };

  const handleLogout = () => {
    auth.logout();
    setCurrentUser(null);
    onClose();
    window.location.href = '/';
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} onClick={onClose}>
      <div
        className="glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '32px',
          border: '1px solid var(--border-light)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Palette size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
                Appearance &amp; Settings
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Customize your visual theme and preferences
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'var(--bg-surface)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: Themes */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px', letterSpacing: '0.04em' }}>
            SELECT VISUAL THEME
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {THEMES.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectTheme(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--bg-surface)' : 'var(--bg-secondary)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Color Swatch Circle */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 6px',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)'
                    }}>
                      {t.colors.map((c, i) => (
                        <span key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
                      ))}
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {t.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {t.description}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Account Status & Logout */}
        <div style={{ marginBottom: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px', letterSpacing: '0.04em' }}>
            ACCOUNT &amp; SESSION
          </label>

          {currentUser ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#ffffff'
                }}>
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{currentUser.email} • {currentUser.platform || 'LeetCode'}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="btn-secondary"
                style={{ padding: '6px 14px', fontSize: '12.5px', color: 'var(--accent-pink)', borderColor: 'rgba(244, 63, 94, 0.4)' }}
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Guest Session Active
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  Not currently signed in
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a
                  href="/login"
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => onClose()}
                >
                  Sign In
                </a>
                <a
                  href="/logout"
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--accent-pink)', borderColor: 'rgba(244, 63, 94, 0.4)', textDecoration: 'none' }}
                  onClick={() => onClose()}
                >
                  <LogOut size={13} />
                  <span>Log Out</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Data Management */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>Clear Local History</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Delete all saved code trace records</div>
          </div>

          <button
            type="button"
            onClick={handleClearHistory}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: 'var(--accent-pink)',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            <Trash2 size={14} />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
