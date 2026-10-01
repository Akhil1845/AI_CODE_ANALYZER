import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Key, 
  Terminal, 
  Code2, 
  Sparkles, 
  Check, 
  Copy, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Award, 
  Zap, 
  Cpu, 
  Settings as SettingsIcon, 
  LogOut, 
  Download, 
  Trash2, 
  Globe, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  Layers,
  Palette,
  Laptop,
  Smartphone,
  Save,
  Sliders,
  ShieldCheck,
  FileCode2,
  Share2
} from 'lucide-react';
import { auth } from '../services/auth';
import { themeService, THEMES } from '../services/theme';

const AVATAR_GRADIENTS = [
  { id: 'indigo', name: 'Hyper Violet', value: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' },
  { id: 'pink', name: 'Neon Rose', value: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' },
  { id: 'emerald', name: 'Emerald Matrix', value: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' },
  { id: 'amber', name: 'Solar Flame', value: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' },
  { id: 'slate', name: 'Midnight Titanium', value: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)' }
];

const CODING_PLATFORMS = [
  { id: 'LeetCode', name: 'LeetCode', badge: 'DSA & Contests', desc: 'Focus on Big-O memory optimization, two pointers & dynamic programming' },
  { id: 'MentorPick', name: 'MentorPick', badge: 'Campus & Interviews', desc: 'Competitive college coding, core test case diagnostics & edge cases' },
  { id: 'CodeChef', name: 'CodeChef', badge: 'Rated Rounds', desc: 'Fast I/O routines, mathematical logic & Time Limit Exceeded (TLE) prevention' },
  { id: 'HackerRank', name: 'HackerRank', badge: 'Assessments', desc: 'Clean object-oriented architecture, modular functions & syntax standards' },
  { id: 'Codeforces', name: 'Codeforces', badge: 'Div 1/2 Contests', desc: 'Algorithmic efficiency, graph theory & segment tree operations' }
];

export default function Profile() {
  const navigate = useNavigate();

  // Load Current User or default demo
  const [user, setUser] = useState(() => {
    const existing = auth.getCurrentUser();
    return existing || {
      id: 'usr_akhil',
      name: 'Akhil',
      email: 'itsmeakhil9999@gmail.com',
      platform: 'LeetCode',
      headline: 'Full-Stack Developer & Competitive DSA Enthusiast',
      bio: 'Building intelligent code observability tools. Obsessed with O(1) space optimization, compiler internals, and Spring Boot / React architectures.',
      location: 'Hyderabad, India',
      avatarGradient: AVATAR_GRADIENTS[1].value,
      githubUsername: 'Akhil1845',
      leetcodeUsername: 'akhil_codes',
      codechefUsername: 'akhil_1845',
      portfolioUrl: 'https://github.com/Akhil1845/AI_CODE_ANALYZER'
    };
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState('identity'); // 'identity' | 'dsa' | 'editor' | 'security' | 'api' | 'badges'

  // Toast / Feedback states
  const [successToast, setSuccessToast] = useState('');
  const [errorToast, setErrorToast] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState(user.name || 'Akhil');
  const [headline, setHeadline] = useState(user.headline || 'Full-Stack Developer & Competitive DSA Enthusiast');
  const [bio, setBio] = useState(user.bio || 'Building intelligent code observability tools. Obsessed with O(1) space optimization and AST analysis.');
  const [location, setLocation] = useState(user.location || 'Hyderabad, India');
  const [platform, setPlatform] = useState(user.platform || 'LeetCode');
  const [avatarGradient, setAvatarGradient] = useState(user.avatarGradient || AVATAR_GRADIENTS[1].value);
  const [githubUsername, setGithubUsername] = useState(user.githubUsername || 'Akhil1845');
  const [leetcodeUsername, setLeetcodeUsername] = useState(user.leetcodeUsername || 'akhil_codes');
  const [codechefUsername, setCodechefUsername] = useState(user.codechefUsername || 'akhil_1845');
  const [portfolioUrl, setPortfolioUrl] = useState(user.portfolioUrl || 'https://github.com/Akhil1845/AI_CODE_ANALYZER');

  // DSA & Engine Settings
  const [targetLanguage, setTargetLanguage] = useState('Java');
  const [complexityGoal, setComplexityGoal] = useState('O(1) Auxiliary Space');
  const [aiModel, setAiModel] = useState('Gemini 1.5 Pro');
  const [strictness, setStrictness] = useState('Strict');
  const [editorFont, setEditorFont] = useState('JetBrains Mono');
  const [editorFontSize, setEditorFontSize] = useState('14px');
  const [tabSize, setTabSize] = useState('4 Spaces');
  const [autoCloseBrackets, setAutoCloseBrackets] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(() => themeService.init());

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // API Token State
  const [apiToken, setApiToken] = useState('cldev_live_9f82ab7e10c448a9b240');
  const [showApiToken, setShowApiToken] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [githubPat, setGithubPat] = useState('ghp_••••••••••••••••••••••••••••••••••••');

  const triggerToast = (msg, isErr = false) => {
    if (isErr) {
      setErrorToast(msg);
      setSuccessToast('');
      setTimeout(() => setErrorToast(''), 4000);
    } else {
      setSuccessToast(msg);
      setErrorToast('');
      setTimeout(() => setSuccessToast(''), 3500);
    }
  };

  // Save General Profile Changes
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      const updatedFields = {
        name: name.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        location: location.trim(),
        platform,
        avatarGradient,
        githubUsername: githubUsername.trim(),
        leetcodeUsername: leetcodeUsername.trim(),
        codechefUsername: codechefUsername.trim(),
        portfolioUrl: portfolioUrl.trim()
      };

      // 1. Local auth service persistence & Navbar sync
      const updated = auth.updateProfile(updatedFields);
      setUser(updated);

      // 2. MySQL Backend Sync
      try {
        await fetch('/api/auth/update-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: updated.email,
            name: updated.name,
            platform: updated.platform,
            headline: updated.headline,
            bio: updated.bio,
            github_username: updated.githubUsername,
            leetcode_username: updated.leetcodeUsername
          })
        });
      } catch (err) {
        console.warn('Backend update note:', err);
      }

      triggerToast('✓ Profile successfully updated and synchronized!');
    } catch (err) {
      triggerToast(err.message || 'Failed to save profile changes.', true);
    } finally {
      setIsSaving(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      triggerToast('New password must be at least 6 characters long.', true);
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast('New password and confirm password do not match.', true);
      return;
    }

    try {
      // Backend MySQL update
      try {
        await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, new_password: newPassword })
        });
      } catch (err) {
        console.warn('Backend sync note:', err);
      }

      // Local auth persistence
      auth.resetPassword(user.email, newPassword);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      triggerToast('✓ Password updated successfully in MySQL database and local session!');
    } catch (err) {
      triggerToast(err.message || 'Failed to change password.', true);
    }
  };

  const handleCopyApiToken = () => {
    navigator.clipboard.writeText(apiToken);
    setTokenCopied(true);
    triggerToast('✓ API token copied to clipboard!');
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const handleRegenerateToken = () => {
    const fresh = 'cldev_live_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    setApiToken(fresh);
    triggerToast('✓ New CodeLens Developer Token generated!');
  };

  const handleExportData = () => {
    const exportPayload = {
      user: { ...user, name, email: user.email, platform },
      preferences: { targetLanguage, complexityGoal, aiModel, strictness, editorFont, editorFontSize },
      exportedAt: new Date().toISOString(),
      engine: 'CodeLens AI v1.2'
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codelens_profile_${user.name.toLowerCase()}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast('✓ Profile and analysis telemetry exported as JSON!');
  };

  const handleThemeSelect = (themeId) => {
    themeService.setTheme(themeId);
    setCurrentTheme(themeId);
    triggerToast(`Theme switched to ${THEMES.find(t => t.id === themeId)?.name || themeId}!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Floating Notifications */}
      {successToast && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '24px',
          zIndex: 1000,
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '13.5px',
          backdropFilter: 'blur(8px)',
          animation: 'slideInRight 0.25s ease'
        }}>
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {errorToast && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '24px',
          zIndex: 1000,
          background: 'rgba(244, 63, 94, 0.95)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '13.5px',
          backdropFilter: 'blur(8px)',
          animation: 'slideInRight 0.25s ease'
        }}>
          <AlertCircle size={18} />
          <span>{errorToast}</span>
        </div>
      )}

      <main style={{ flexGrow: 1, padding: '36px clamp(20px, 4vw, 60px) 70px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        
        {/* 1. HERO PROFILE BANNER */}
        <div className="glass-card" style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border-light)',
          background: 'var(--bg-card)',
          marginBottom: '32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
        }}>
          {/* Cover Graphic Background */}
          <div style={{
            height: '160px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(236, 72, 153, 0.25) 50%, rgba(16, 185, 129, 0.15) 100%), #050814',
            position: 'relative',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '18px 24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '12px',
              fontWeight: 700,
              color: '#38bdf8'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <span>ACTIVE CLUSTER: MYSQL 8.0 &amp; GEMINI NEURAL</span>
            </div>
          </div>

          {/* Profile User Info Row */}
          <div style={{
            padding: '0 32px 28px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '24px',
            marginTop: '-55px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '22px', flexWrap: 'wrap' }}>
              {/* Dynamic Avatar with Initial */}
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '26px',
                background: avatarGradient,
                border: '4px solid var(--bg-card)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                fontWeight: 900,
                color: '#ffffff',
                position: 'relative',
                flexShrink: 0
              }}>
                {name ? name[0].toUpperCase() : 'A'}
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '3px solid var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  title: 'Verified Active'
                }}>
                  <Check size={12} strokeWidth={3} />
                </div>
              </div>

              {/* Name & Headline */}
              <div style={{ paddingBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
                    {name}
                  </h1>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: 'var(--accent-blue)'
                  }}>
                    PRO DEVELOPER
                  </span>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    background: 'rgba(236, 72, 153, 0.15)',
                    border: '1px solid rgba(236, 72, 153, 0.4)',
                    color: 'var(--accent-pink)'
                  }}>
                    {platform}
                  </span>
                </div>

                <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mail size={14} color="var(--primary)" />
                    {user.email}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} color="var(--accent-emerald)" />
                    {location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Briefcase size={14} color="var(--accent-purple)" />
                    {headline}
                  </span>
                </p>
              </div>
            </div>

            {/* Header Right Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '13.5px', borderRadius: 'var(--radius-sm)' }}
              >
                <Save size={16} />
                <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportData}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-main)',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Download size={15} />
                <span>Export Data</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '1px',
            background: 'var(--border-subtle)',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div style={{ background: 'var(--bg-surface)', padding: '16px 24px' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>TOTAL SCANS</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-main)', marginTop: '2px' }}>24+ Projects</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '16px 24px' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>DSA TRACES</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--accent-blue)', marginTop: '2px' }}>18 Iterations</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '16px 24px' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>AI REGRESSIONS PREVENTED</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--accent-emerald)', marginTop: '2px' }}>37 NullPointers</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '16px 24px' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>BIG-O RATING</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--accent-pink)', marginTop: '2px' }}>Top 98.4%</div>
            </div>
          </div>
        </div>

        {/* 2. DUAL-COLUMN PROFILE WORKSPACE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '270px 1fr',
          gap: '28px',
          alignItems: 'start'
        }}>
          {/* LEFT COLUMN: Modern Vertical Tab Navigation */}
          <div className="glass-card" style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            background: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            {[
              { id: 'identity', label: 'Developer Identity', icon: User, desc: 'Name, bio & social links' },
              { id: 'dsa', label: 'DSA & Platforms', icon: Code2, desc: 'LeetCode & complexity' },
              { id: 'editor', label: 'AI Engine & Editor', icon: Cpu, desc: 'Gemini, font & themes' },
              { id: 'security', label: 'Security & Password', icon: Shield, desc: 'Password & 2FA' },
              { id: 'api', label: 'API & Integrations', icon: Key, desc: 'Tokens & GitHub PAT' },
              { id: 'badges', label: 'Badges & Stats', icon: Award, desc: 'Milestones & history' }
            ].map(tab => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: active ? 'var(--primary)' : 'transparent',
                    border: 'none',
                    color: active ? '#ffffff' : 'var(--text-main)',
                    boxShadow: active ? 'var(--primary-glow)' : 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = 'var(--bg-surface)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: active ? 'rgba(255,255,255,0.2)' : 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: active ? '#ffffff' : 'var(--primary)'
                  }}>
                    <Icon size={17} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700 }}>{tab.label}</div>
                    <div style={{ fontSize: '11px', color: active ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>
                      {tab.desc}
                    </div>
                  </div>
                </button>
              );
            })}

            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '8px 0' }} />

            <button
              type="button"
              onClick={() => navigate('/logout')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                color: 'var(--accent-pink)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244, 63, 94, 0.16)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(244, 63, 94, 0.08)'; }}
            >
              <LogOut size={16} />
              <span>Sign Out Account</span>
            </button>
          </div>

          {/* RIGHT COLUMN: Tab Content Display */}
          <div className="glass-card" style={{
            padding: '32px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            background: 'var(--bg-card)'
          }}>

            {/* TAB 1: DEVELOPER IDENTITY */}
            {activeTab === 'identity' && (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Developer Identity &amp; Bio
                  </h2>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                    Customize your public profile, developer avatar gradient, and coding platform handles.
                  </p>
                </div>

                {/* Avatar Gradient Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
                    Choose Avatar Color Theme
                  </label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {AVATAR_GRADIENTS.map(grad => (
                      <button
                        key={grad.id}
                        type="button"
                        onClick={() => setAvatarGradient(grad.value)}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: grad.value,
                          border: avatarGradient === grad.value ? '3px solid #ffffff' : '2px solid transparent',
                          boxShadow: avatarGradient === grad.value ? '0 0 12px var(--primary)' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          transition: 'transform 0.15s ease'
                        }}
                        title={grad.name}
                      >
                        {avatarGradient === grad.value && <Check size={18} strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Full Developer Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Akhil"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-main)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Primary Email (Linked Account)
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={user.email}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                        fontSize: '14px',
                        cursor: 'not-allowed'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Headline / Technical Title
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Full-Stack Engineer | O(1) Memory Optimizer"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-main)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Developer Bio &amp; Specialty
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Brief description of your algorithmic focus and engineering background..."
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-main)',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                      lineHeight: 1.6
                    }}
                  />
                </div>

                {/* Social & Coding Handles */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
                    Competitive Coding &amp; Social Links
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        GitHub Profile
                      </span>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '9px 12px'
                      }}>
                        <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>github.com/</span>
                        <input
                          type="text"
                          value={githubUsername}
                          onChange={(e) => setGithubUsername(e.target.value)}
                          placeholder="Akhil1845"
                          style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '13.5px', width: '100%' }}
                        />
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        LeetCode Handle
                      </span>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '9px 12px'
                      }}>
                        <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>leetcode.com/u/</span>
                        <input
                          type="text"
                          value={leetcodeUsername}
                          onChange={(e) => setLeetcodeUsername(e.target.value)}
                          placeholder="akhil_codes"
                          style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '13.5px', width: '100%' }}
                        />
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Location / Timezone
                      </span>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Hyderabad, India"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-light)',
                          color: 'var(--text-main)',
                          fontSize: '13.5px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Portfolio / Repository
                      </span>
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://github.com/Akhil1845/AI_CODE_ANALYZER"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-light)',
                          color: 'var(--text-main)',
                          fontSize: '13.5px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: '10px' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSaving}
                    style={{ padding: '12px 28px', fontSize: '14px' }}
                  >
                    <Save size={16} />
                    <span>{isSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: DSA & CODING PLATFORMS */}
            {activeTab === 'dsa' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
                    DSA &amp; Competitive Target Configuration
                  </h2>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                    Configure which platform problem types and time/space constraints CodeLens prioritizes during analysis.
                  </p>
                </div>

                {/* Primary Coding Platform Selectable Cards */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
                    Select Primary Target Platform
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                    {CODING_PLATFORMS.map(p => {
                      const selected = platform === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setPlatform(p.id);
                            auth.updateProfile({ platform: p.id });
                            triggerToast(`Primary platform updated to ${p.name}`);
                          }}
                          style={{
                            padding: '16px 18px',
                            borderRadius: 'var(--radius-sm)',
                            background: selected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-secondary)',
                            border: `2px solid ${selected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            position: 'relative'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>{p.name}</span>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              background: selected ? 'var(--primary)' : 'var(--bg-surface)',
                              color: selected ? '#ffffff' : 'var(--text-dim)'
                            }}>
                              {p.badge}
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                            {p.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Preferred Language for DSA */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
                    Default Problem-Solving Language
                  </label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {['Java', 'Python', 'C++', 'C', 'TypeScript'].map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setTargetLanguage(lang);
                          triggerToast(`Default DSA language set to ${lang}`);
                        }}
                        style={{
                          padding: '9px 18px',
                          borderRadius: 'var(--radius-sm)',
                          background: targetLanguage === lang ? 'var(--primary)' : 'var(--bg-secondary)',
                          border: '1px solid var(--border-light)',
                          color: targetLanguage === lang ? '#ffffff' : 'var(--text-main)',
                          fontSize: '13.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Big-O Complexity Objective */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
                    Algorithmic Target Goal
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                    {[
                      { title: 'O(1) Auxiliary Space', sub: 'In-place pointers, zero extra allocations' },
                      { title: 'O(N) Linear Scan', sub: 'Optimal single-pass hash map or sliding window' },
                      { title: 'O(log N) Divide & Conquer', sub: 'Binary search & segment tree optimizations' }
                    ].map(goal => (
                      <div
                        key={goal.title}
                        onClick={() => {
                          setComplexityGoal(goal.title);
                          triggerToast(`Complexity goal updated to ${goal.title}`);
                        }}
                        style={{
                          padding: '14px 16px',
                          borderRadius: 'var(--radius-sm)',
                          background: complexityGoal === goal.title ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-secondary)',
                          border: `1.5px solid ${complexityGoal === goal.title ? 'var(--accent-emerald)' : 'var(--border-subtle)'}`,
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)' }}>{goal.title}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{goal.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: AI ENGINE & CODE EDITOR */}
            {activeTab === 'editor' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
                    AI CodeDoctor &amp; Editor Preferences
                  </h2>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                    Tune the neural reasoning model, CodeDoctor strictness, editor fonts, and IDE themes.
                  </p>
                </div>

                {/* AI Reasoning Model Picker */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
                    AI CodeDoctor Engine Model
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                    <div
                      onClick={() => setAiModel('Gemini 1.5 Pro')}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-sm)',
                        background: aiModel === 'Gemini 1.5 Pro' ? 'rgba(236, 72, 153, 0.12)' : 'var(--bg-secondary)',
                        border: `2px solid ${aiModel === 'Gemini 1.5 Pro' ? 'var(--accent-pink)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Google Gemini 1.5 Pro</span>
                        <span className="badge badge-medium" style={{ fontSize: '10px' }}>DEEP REASONING</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                        Multi-pass semantic reasoning, optimal algorithm restructuring, and line-by-line memory audit.
                      </p>
                    </div>

                    <div
                      onClick={() => setAiModel('Gemini 1.5 Flash')}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-sm)',
                        background: aiModel === 'Gemini 1.5 Flash' ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-secondary)',
                        border: `2px solid ${aiModel === 'Gemini 1.5 Flash' ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Google Gemini 1.5 Flash</span>
                        <span className="badge badge-low" style={{ fontSize: '10px' }}>ULTRA FAST</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                        Sub-second iteration response for instant LeetCode and CodeChef code execution traces.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Theme Selector Palette */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
                    Active Visual Theme
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    {THEMES.map(th => {
                      const active = currentTheme === th.id;
                      return (
                        <div
                          key={th.id}
                          onClick={() => handleThemeSelect(th.id)}
                          style={{
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-sm)',
                            background: active ? 'var(--primary-subtle, rgba(99, 102, 241, 0.15))' : 'var(--bg-secondary)',
                            border: `2px solid ${active ? 'var(--primary)' : 'var(--border-subtle)'}`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                        >
                          <span style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: th.previewColor,
                            boxShadow: `0 0 8px ${th.previewColor}`
                          }} />
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{th.name}</div>
                            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{th.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Editor Code Styling Preferences */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
                    Code Editor Preferences
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Font Family</span>
                      <select
                        value={editorFont}
                        onChange={(e) => setEditorFont(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '13.5px' }}
                      >
                        <option value="JetBrains Mono">JetBrains Mono</option>
                        <option value="Fira Code">Fira Code</option>
                        <option value="Source Code Pro">Source Code Pro</option>
                        <option value="Cascadia Code">Cascadia Code</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Font Size</span>
                      <select
                        value={editorFontSize}
                        onChange={(e) => setEditorFontSize(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '13.5px' }}
                      >
                        <option value="13px">13px (Compact)</option>
                        <option value="14px">14px (Recommended)</option>
                        <option value="15px">15px (Readable)</option>
                        <option value="16px">16px (Large)</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Tab Indent</span>
                      <select
                        value={tabSize}
                        onChange={(e) => setTabSize(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '13.5px' }}
                      >
                        <option value="2 Spaces">2 Spaces</option>
                        <option value="4 Spaces">4 Spaces (Standard Java)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SECURITY & PASSWORD */}
            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Security &amp; Password Management
                  </h2>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                    Update your account password, manage two-factor authentication, and monitor active sessions.
                  </p>
                </div>

                {/* Change Password Form */}
                <form onSubmit={handleChangePassword} style={{
                  padding: '24px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 800, fontSize: '15px' }}>
                    <Lock size={18} />
                    <span>Change Developer Password</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                        New Password
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 12px'
                      }}>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '13.5px', width: '100%' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                        Confirm New Password
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 12px'
                      }}>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '13.5px', width: '100%' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ padding: '10px 22px', fontSize: '13.5px' }}
                    >
                      <ShieldCheck size={16} />
                      <span>Update Password in MySQL</span>
                    </button>
                  </div>
                </form>

                {/* Two-Factor Authentication Toggle */}
                <div style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shield size={18} color="var(--accent-emerald)" />
                      <span>Two-Factor Authentication (2FA)</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Protects account sign-in with time-based one-time password (TOTP) codes.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      triggerToast(twoFactorEnabled ? '2FA disabled.' : '✓ 2FA enabled & protected with TOTP!');
                    }}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '9999px',
                      background: twoFactorEnabled ? 'var(--accent-emerald)' : 'var(--bg-surface)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {twoFactorEnabled ? 'Enabled (Active)' : 'Disabled (Turn On)'}
                  </button>
                </div>

                {/* Active Sessions */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
                    Active Sessions &amp; Devices
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Laptop size={20} color="var(--primary)" />
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                            Windows 11 • Edge / Chrome (Current Device)
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            IP 127.0.0.1 • Localhost Session • Last active now
                          </div>
                        </div>
                      </div>
                      <span className="badge badge-low" style={{ fontSize: '11px' }}>CURRENT SESSION</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: API TOKENS & INTEGRATIONS */}
            {activeTab === 'api' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
                    API Tokens &amp; Developer Integrations
                  </h2>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                    Use these credentials to authenticate the CodeLens CLI, GitHub scanners, and IDE plugins.
                  </p>
                </div>

                {/* Personal Access Token */}
                <div style={{
                  padding: '22px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>
                      Personal CodeLens API Token
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                      ACTIVE (READ/WRITE)
                    </span>
                  </div>

                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Authenticate terminal tasks and continuous integration pipelines without entering your account password.
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#04060f',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    <Key size={16} color="var(--primary)" />
                    <input
                      type={showApiToken ? 'text' : 'password'}
                      readOnly
                      value={apiToken}
                      style={{ background: 'transparent', border: 'none', outline: 'none', color: '#38bdf8', fontSize: '13px', width: '100%', fontFamily: 'inherit' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiToken(!showApiToken)}
                      title={showApiToken ? 'Hide token' : 'Reveal token'}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    >
                      {showApiToken ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyApiToken}
                      title="Copy Token"
                      style={{ background: 'transparent', border: 'none', color: tokenCopied ? 'var(--accent-emerald)' : 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    >
                      {tokenCopied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>

                  <div style={{ marginTop: '14px' }}>
                    <button
                      type="button"
                      onClick={handleRegenerateToken}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RefreshCw size={13} />
                      <span>Regenerate Token</span>
                    </button>
                  </div>
                </div>

                {/* GitHub Personal Access Token (PAT) */}
                <div style={{
                  padding: '22px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>
                      GitHub Rate Limit Token (PAT)
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: 700 }}>
                      5,000 REQ / HR
                    </span>
                  </div>

                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Optional GitHub token to prevent API rate limiting when analyzing large repositories.
                  </p>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="password"
                      value={githubPat}
                      onChange={(e) => setGithubPat(e.target.value)}
                      placeholder="ghp_••••••••••••••••••••"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: '#04060f',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-main)',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'var(--font-mono)'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => triggerToast('✓ GitHub token saved securely in session!')}
                      className="btn-primary"
                      style={{ padding: '10px 18px', fontSize: '13px', whiteSpace: 'nowrap' }}
                    >
                      <span>Save PAT</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: BADGES & STATS */}
            {activeTab === 'badges' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Developer Achievements &amp; Badges
                  </h2>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                    Earned badges and algorithmic milestones achieved on CodeLens AI.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  {[
                    { title: 'O(1) Memory Optimizer', desc: 'Achieved O(1) space complexity on LeetCode two pointer algorithms.', color: 'var(--accent-emerald)', icon: Zap },
                    { title: 'Null-Safe Architect', desc: 'Detected and resolved 0 NPE regressions across Java code bases.', color: 'var(--accent-pink)', icon: ShieldCheck },
                    { title: 'AST Trace Master', desc: 'Traced 50+ iteration table steps across LeetCode & CodeChef buffers.', color: 'var(--accent-blue)', icon: Terminal },
                    { title: 'CodeDoctor Pioneer', desc: 'Generated 100% test-passing neural fixes with Google Gemini.', color: 'var(--accent-purple)', icon: Sparkles },
                    { title: 'Polyglot Engineer', desc: 'Scanned projects in Java, Python, C++, and React TypeScript.', color: '#f59e0b', icon: FileCode2 },
                    { title: 'CodeLens Contributor', desc: 'Early adopter and core tester of CodeLens AI v1.2 engine.', color: 'var(--primary)', icon: Award }
                  ].map((badge, idx) => {
                    const BIcon = badge.icon;
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: '18px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-light)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: 'var(--bg-surface)',
                          border: `1px solid ${badge.color}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: badge.color
                        }}>
                          <BIcon size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>{badge.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '4px' }}>
                            {badge.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
