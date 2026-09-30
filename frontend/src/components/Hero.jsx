import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Bug, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  Play
} from 'lucide-react';

export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      padding: '75px 0 65px',
      overflow: 'hidden'
    }}>
      {/* Background radial glow effects - dark pink, purple & dark blue */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '20%',
        width: '550px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.22) 0%, rgba(217, 70, 239, 0.12) 50%, transparent 75%)',
        filter: 'blur(75px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        top: '-60px',
        right: '20%',
        width: '550px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, rgba(147, 51, 234, 0.18) 50%, transparent 75%)',
        filter: 'blur(80px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      <div className="container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '890px',
          margin: '0 auto'
        }}>
          {/* Tagline Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 18px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(168, 85, 247, 0.18) 50%, rgba(37, 99, 235, 0.15) 100%)',
            border: '1px solid rgba(236, 72, 153, 0.4)',
            boxShadow: '0 0 20px rgba(236, 72, 153, 0.25)',
            marginBottom: '28px',
            fontSize: '13px',
            color: '#f0abfc',
            fontWeight: 700
          }}>
            <Sparkles size={15} color="#ec4899" />
            <span>Static Analysis + AI Reasoning + Docker Sandbox Validation</span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: '58px',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
            marginBottom: '22px'
          }}>
            Your code.{' '}
            <span className="gradient-text">Understood.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '19px',
            lineHeight: 1.65,
            color: '#94a3b8',
            marginBottom: '38px',
            maxWidth: '750px'
          }}>
            Analyze normal Java, Python, C, and C++ code from <strong>LeetCode, MentorPick, &amp; CodeChef</strong>. See the full step-by-step code iteration trace, discover exactly where and why it fails, and get the optimal working logic.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '52px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Link to="/code-analyzer" className="btn-primary" style={{ padding: '14px 30px', fontSize: '15px' }}>
              <span>Paste &amp; Trace DSA Code</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/analyzer" className="btn-secondary" style={{ padding: '14px 26px', fontSize: '15px' }}>
              <span>Upload Project ZIP</span>
            </Link>
          </div>

          {/* Workflow Sequence Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '13px',
            color: '#64748b',
            fontWeight: 600,
            marginBottom: '52px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <span style={{ color: '#ffffff' }}>Workflow:</span>
            <span className="badge badge-category" style={{ borderColor: 'rgba(236, 72, 153, 0.4)' }}>1. Upload ZIP</span>
            <span style={{ color: '#ec4899' }}>→</span>
            <span className="badge badge-category" style={{ borderColor: 'rgba(168, 85, 247, 0.4)' }}>2. AST Scan</span>
            <span style={{ color: '#a855f7' }}>→</span>
            <span className="badge badge-category" style={{ borderColor: 'rgba(59, 130, 246, 0.4)' }}>3. AI Reasoning</span>
            <span style={{ color: '#3b82f6' }}>→</span>
            <span className="badge badge-high">4. CodeDoctor Fix</span>
            <span style={{ color: '#d946ef' }}>→</span>
            <span className="badge" style={{ background: 'rgba(217, 70, 239, 0.2)', color: '#f0abfc', border: '1px solid rgba(217, 70, 239, 0.5)', boxShadow: '0 0 12px rgba(217, 70, 239, 0.35)' }}>
              5. Sandbox Validate
            </span>
          </div>
        </div>

        {/* Live CodeDoctor Hero Showcase Card */}
        <div className="glass-card" style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '24px',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          boxShadow: '0 20px 50px -15px rgba(4, 5, 10, 0.95), 0 0 30px rgba(147, 51, 234, 0.2)'
        }}>
          {/* Window Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '14px',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f43f5e', boxShadow: '0 0 8px #f43f5e' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 8px #a855f7' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' }} />
              <span style={{ marginLeft: '12px', fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                UserService.java &nbsp;•&nbsp; CodeLens AI CodeDoctor
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-critical" style={{ fontSize: '11px' }}>
                <Bug size={12} />
                High Severity Bug
              </span>
            </div>
          </div>

          {/* Interactive Comparison Split */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '16px'
          }}>
            {/* Left: Original Code with Detection (Dark Pink / Black) */}
            <div style={{
              background: 'rgba(3, 4, 8, 0.85)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              padding: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#fb7185', letterSpacing: '0.04em' }}>
                  DETECTED VULNERABILITY (LINE 42)
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                  AST: NPE_UNCHECKED_OPTIONAL
                </span>
              </div>

              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: 1.6,
                color: '#f87171',
                margin: 0
              }}>
                <code>
                  {`// ❌ Dangerous direct unwrap
User user = repository.findById(userId).get();
return new UserProfile(user.getName());`}
                </code>
              </pre>

              <div style={{
                marginTop: '14px',
                padding: '10px 12px',
                borderRadius: '6px',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                fontSize: '12px',
                color: '#fda4af'
              }}>
                <strong>Why it fails:</strong> Calling <code>.get()</code> without checking throws <code>NoSuchElementException</code> on absent database keys.
              </div>
            </div>

            {/* Right: AI CodeDoctor Patch + Sandbox Validation (Purple / Dark Blue) */}
            <div style={{
              background: 'rgba(3, 4, 8, 0.85)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(217, 70, 239, 0.4)',
              padding: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#f0abfc', letterSpacing: '0.04em' }}>
                  AI CODEDOCTOR REFACTOR
                </span>
                <span className="badge badge-high" style={{ fontSize: '10px' }}>
                  Validated
                </span>
              </div>

              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: 1.6,
                color: '#d8b4fe',
                margin: 0
              }}>
                <code>
                  {`// ✓ Safe fallback with proper exception
User user = repository.findById(userId)
    .orElseThrow(() -> new UserNotFoundException(userId));
return new UserProfile(user.getName());`}
                </code>
              </pre>

              <div style={{
                marginTop: '14px',
                padding: '10px 12px',
                borderRadius: '6px',
                background: 'rgba(147, 51, 234, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                fontSize: '12px',
                color: '#e9d5ff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} color="#d946ef" />
                <span><strong>Docker Sandbox Verified:</strong> 18/18 Unit Tests Passed. Clean exit.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Ecosystem Bar */}
        <div style={{
          marginTop: '52px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#64748b',
            marginBottom: '16px',
            fontWeight: 700
          }}>
            Multi-Language Project Detection & Analysis Engines
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {['React / Vite', 'Java / Spring Boot', 'Python 3', 'Node.js / Express', 'TypeScript', 'MySQL / JPA', 'Docker Containers'].map((tech) => (
              <span key={tech} style={{
                padding: '7px 15px',
                borderRadius: '8px',
                background: 'rgba(15, 21, 43, 0.7)',
                border: '1px solid var(--border-subtle)',
                fontSize: '13px',
                color: '#cbd5e1',
                fontWeight: 600,
                transition: 'border-color 0.2s',
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
