import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Terminal, Lock, Mail, User, Code2, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { auth } from '../services/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'signin' or 'signup'
  const [mode, setMode] = useState('signin');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [platform, setPlatform] = useState('LeetCode');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        auth.login(email, password);
      } else {
        auth.signup(name, email, password, platform);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFastDemoLogin = () => {
    setEmail('demo@codelens.ai');
    setPassword('password123');
    try {
      auth.login('demo@codelens.ai', 'password123');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        position: 'relative'
      }}>
        <div className="glass-card" style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px',
          border: '1px solid var(--border-light)',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: 'var(--primary-glow)',
              color: '#ffffff'
            }}>
              <Terminal size={24} strokeWidth={2.5} />
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', marginBottom: '6px' }}>
              {mode === 'signin' ? 'Welcome to CodeLens AI' : 'Create Developer Account'}
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
              {mode === 'signin'
                ? 'Sign in to access your code traces and analysis reports'
                : 'Join CodeLens to trace code iterations and scaffold repositories'}
            </p>
          </div>

          {/* Mode Tabs: Unified Sign In / Create Account */}
          <div style={{
            display: 'flex',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            padding: '4px',
            marginBottom: '22px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                color: mode === 'signin' ? '#ffffff' : 'var(--text-muted)',
                background: mode === 'signin' ? 'var(--primary)' : 'transparent',
                boxShadow: mode === 'signin' ? 'var(--primary-glow)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                color: mode === 'signup' ? '#ffffff' : 'var(--text-muted)',
                background: mode === 'signup' ? 'var(--primary)' : 'transparent',
                boxShadow: mode === 'signup' ? 'var(--primary-glow)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Create Account
            </button>
          </div>

          {/* Error alert */}
          {error && (
            <div style={{
              marginBottom: '18px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--accent-pink)',
              fontSize: '13px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Unified Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px'
                }}>
                  <User size={16} color="var(--primary)" />
                  <input
                    type="text"
                    required
                    placeholder="Ada Lovelace"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-main)',
                      fontSize: '14px',
                      width: '100%'
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px'
              }}>
                <Mail size={16} color="var(--primary)" />
                <input
                  type="email"
                  required
                  placeholder="developer@codelens.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-main)',
                    fontSize: '14px',
                    width: '100%'
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Password
                </label>
                {mode === 'signin' && (
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo password is: password123'); }} style={{ fontSize: '12px', color: 'var(--primary)' }}>
                    Forgot password?
                  </a>
                )}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px'
              }}>
                <Lock size={16} color="var(--primary)" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-main)',
                    fontSize: '14px',
                    width: '100%'
                  }}
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Primary Platform
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 14px'
                }}>
                  <Code2 size={16} color="var(--primary)" />
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-main)',
                      fontSize: '13.5px',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="LeetCode" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>LeetCode</option>
                    <option value="MentorPick" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>MentorPick</option>
                    <option value="CodeChef" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>CodeChef</option>
                    <option value="HackerRank" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>HackerRank</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '6px', padding: '12px' }}
            >
              <span>{loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Free Account')}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo One-Click Fill */}
          {mode === 'signin' && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={handleFastDemoLogin}
                style={{
                  width: '100%',
                  padding: '9px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-main)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={14} color="var(--primary)" />
                <span>Sign In as Demo Developer (1-Click)</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
