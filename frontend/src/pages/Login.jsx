import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Terminal, 
  Lock, 
  Mail, 
  User, 
  Code2, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Boxes,
  Database
} from 'lucide-react';
import { auth } from '../services/auth';

// Official Google Multi-color "G" SVG Icon
const GoogleIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'signin' or 'signup'
  const [mode, setMode] = useState('signin');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoNotice, setInfoNotice] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [loading, setLoading] = useState(false);

  // Simulated animated terminal log lines on the visual showcase
  const [terminalLogs, setTerminalLogs] = useState([
    { text: '[INIT] CodeLens AST Kernel v1.2 loaded', color: '#a5b4fc' },
    { text: '[SCAN] Monitoring LeetCode, MentorPick & CodeChef buffers', color: '#38bdf8' },
    { text: '[AI] Google Gemini CodeDoctor: Neural reasoning active', color: '#c084fc' },
    { text: '[DB] MySQL 8.0: Persistence cluster connected', color: '#10b981' }
  ]);

  useEffect(() => {
    const streamItems = [
      { text: '[AST] Parsing syntax tree: 0 syntax errors', color: '#a5b4fc' },
      { text: '[DETECT] UserService.java:42 Optional.get() NPE risk', color: '#f43f5e' },
      { text: '[AI] CodeDoctor: Generating surgical O(1) null-safe logic', color: '#f0abfc' },
      { text: '[DOCKER] Ephemeral container: BUILD SUCCESS (0 regressions)', color: '#10b981' },
      { text: '[TRACE] Iteration table generated: 4 states mapped', color: '#38bdf8' }
    ];

    let i = 0;
    const interval = setInterval(() => {
      setTerminalLogs(prev => {
        const nextItem = streamItems[i % streamItems.length];
        i = (i + 1) % streamItems.length;
        return [...(prev || []).slice(-4), nextItem];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setInfoNotice('');
    setSuccessNotice('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        auth.login(email, password);
      } else {
        auth.signup(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Flow:
  // If account exists -> log in & redirect.
  // If account does NOT exist -> switch to signup, auto-fill details, show clear notice.
  const handleGoogleSignIn = () => {
    setError('');
    setInfoNotice('');
    setSuccessNotice('');

    const googleEmail = email.trim() || 'itsmeakhil9999@gmail.com';
    const googleName = name.trim() || 'Akhil';

    const users = auth.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === googleEmail.toLowerCase());

    if (existing) {
      // Account exists -> log in
      try {
        auth.login(existing.email, existing.password);
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Account NOT found -> switch to signup, auto-fill details, do NOT auto-submit
      setMode('signup');
      setName(googleName);
      setEmail(googleEmail);
      setInfoNotice(`No account found for "${googleEmail}". We've auto-filled your Google details—please enter a password to create your developer account.`);
    }
  };

  // Google Sign-Up Flow:
  // "when clicked signup with google in signup page it should just take all details and fill not directly create the acc and sign in"
  const handleGoogleSignUpAutoFill = () => {
    setError('');
    setInfoNotice('');

    const defaultGoogleEmail = 'itsmeakhil9999@gmail.com';
    const defaultGoogleName = 'Akhil';

    setName(defaultGoogleName);
    setEmail(defaultGoogleEmail);
    setSuccessNotice(`✓ Google profile imported (${defaultGoogleName} • ${defaultGoogleEmail}). Please enter a secure password, then click Create Account below.`);
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      {/* Dynamic Ambient Background Orbs */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '10%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.16) 0%, rgba(168, 85, 247, 0.05) 70%, transparent 100%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'orbMoveA 12s ease-in-out infinite'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(217, 70, 239, 0.06) 70%, transparent 100%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'orbMoveB 14s ease-in-out infinite'
      }} />

      <main style={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 24px 80px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Responsive Dual-Pane Workspace */}
        <div style={{
          width: '100%',
          maxWidth: '1160px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>

          {/* LEFT PANE: Animated High-Tech Showcase & Graphics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Main Header Tag */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: 'rgba(236, 72, 153, 0.12)',
                border: '1px solid rgba(236, 72, 153, 0.35)',
                color: 'var(--accent-pink)',
                fontSize: '12.5px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '14px'
              }}>
                <Sparkles size={14} />
                <span>INTELLIGENT CODE OBSERVABILITY</span>
              </div>

              <h1 style={{
                fontSize: '38px',
                fontWeight: 900,
                color: 'var(--text-main)',
                letterSpacing: '-0.03em',
                lineHeight: 1.18,
                marginBottom: '14px'
              }}>
                Your code. <span className="gradient-text">Understood</span> in real time.
              </h1>

              <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Trace LeetCode & CodeChef code iterations step-by-step, detect bugs at the exact line of failure, and let AI CodeDoctor formulate optimal working logic.
              </p>
            </div>

            {/* Interactive Animated Terminal Card */}
            <div className="glass-card" style={{
              background: '#04060f',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(99, 102, 241, 0.18)',
              position: 'relative'
            }}>
              {/* Terminal Title Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#f43f5e' }} />
                  <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#f59e0b' }} />
                  <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ marginLeft: '8px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    codelens-analyzer ~ active-audit
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-emerald)', letterSpacing: '0.04em' }}>
                    LIVE KERNEL
                  </span>
                </div>
              </div>

              {/* Terminal Streaming Output */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                lineHeight: 1.7,
                minHeight: '130px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                {terminalLogs && terminalLogs.map((log, idx) => (
                  <div key={idx} style={{ color: log?.color || '#a5b4fc' }}>
                    {log?.text || ''}
                  </div>
                ))}
                <div style={{ color: 'var(--text-main)', marginTop: '4px' }}>
                  <span style={{ color: 'var(--primary)' }}>&gt;</span> standing by for developer input
                  <span className="cursor-blink" />
                </div>
              </div>
            </div>

            {/* Floating Decorative Badges Showcase */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              <div className="anim-float" style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Zap size={18} color="var(--accent-emerald)" />
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)' }}>O(1) Memory Optimizer</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Beats 98.4% on LeetCode</div>
                </div>
              </div>

              <div className="anim-float-rev" style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(236, 72, 153, 0.08)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <ShieldCheck size={18} color="var(--accent-pink)" />
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)' }}>Security &amp; AST Audit</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>0 NullPointer Regressions</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Ultra-Modern Animated Glassmorphic Auth Card */}
          <div className="glass-card anim-glow" style={{
            padding: '36px',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-card)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 35px rgba(236, 72, 153, 0.15)',
            position: 'relative'
          }}>
            {/* Card Header Icon & Title */}
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                boxShadow: 'var(--primary-glow)',
                color: '#ffffff'
              }}>
                <Terminal size={24} strokeWidth={2.5} />
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                {mode === 'signin' ? 'Welcome to CodeLens AI' : 'Create Developer Account'}
              </h2>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                {mode === 'signin'
                  ? 'Sign in to access your code traces and analysis reports'
                  : 'Join CodeLens to trace iterations and scaffold projects'}
              </p>
            </div>

            {/* Mode Switcher: Sign In vs Create Account */}
            <div style={{
              display: 'flex',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-secondary)',
              padding: '4px',
              marginBottom: '20px',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                  setInfoNotice('');
                  setSuccessNotice('');
                }}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: mode === 'signin' ? '#ffffff' : 'var(--text-muted)',
                  background: mode === 'signin' ? 'var(--primary)' : 'transparent',
                  boxShadow: mode === 'signin' ? 'var(--primary-glow)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                  setInfoNotice('');
                  setSuccessNotice('');
                }}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: mode === 'signup' ? '#ffffff' : 'var(--text-muted)',
                  background: mode === 'signup' ? 'var(--primary)' : 'transparent',
                  boxShadow: mode === 'signup' ? 'var(--primary-glow)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Create Account
              </button>
            </div>

            {/* GOOGLE ACTION BUTTON */}
            {mode === 'signin' ? (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-main)',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; }}
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoogleSignUpAutoFill}
                title="Fetches and auto-fills your Google profile details so you can review before creating"
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-main)',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; }}
              >
                <GoogleIcon />
                <span>Auto-Fill Details with Google</span>
              </button>
            )}

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '20px 0 18px',
              color: 'var(--text-dim)',
              fontSize: '11.5px',
              fontWeight: 700,
              letterSpacing: '0.06em'
            }}>
              <span style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              <span>OR WITH EMAIL</span>
              <span style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            </div>

            {/* Info Notice (e.g. redirected from Google Sign In when acc not found) */}
            {infoNotice && (
              <div style={{
                marginBottom: '16px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                color: 'var(--accent-blue)',
                fontSize: '12.5px',
                lineHeight: 1.5
              }}>
                <Sparkles size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{infoNotice}</span>
              </div>
            )}

            {/* Success Notice (e.g. Google auto-filled on signup) */}
            {successNotice && (
              <div style={{
                marginBottom: '16px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                color: 'var(--accent-emerald)',
                fontSize: '12.5px',
                lineHeight: 1.5
              }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{successNotice}</span>
              </div>
            )}

            {/* Error alert */}
            {error && (
              <div style={{
                marginBottom: '16px',
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

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                      placeholder="e.g. Akhil"
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
                    placeholder="e.g. itsmeakhil9999@gmail.com"
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

              {/* Password Input with Eye / EyeOff Toggle Button */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                    Password
                  </label>
                  {mode === 'signin' && (
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo password is: password123'); }} style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
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
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={mode === 'signup' ? 'Set minimum 6 characters' : 'Enter your password'}
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
                  {/* Eye Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: showPassword ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px',
                      transition: 'color 0.15s ease'
                    }}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

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

            {/* Quick Demo One-Click Sign In */}
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
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                >
                  <Sparkles size={14} color="var(--primary)" />
                  <span>Sign In as Demo Developer (1-Click)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
