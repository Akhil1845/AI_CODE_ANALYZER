import React from 'react';
import { Terminal, GitBranch, Cpu, Box, Database, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(4, 5, 10, 0.95)',
      padding: '52px 0 34px',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}>
          {/* Brand info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f43f5e 0%, #a855f7 50%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(244, 63, 94, 0.45)'
              }}>
                <Terminal size={18} color="#ffffff" />
              </div>
              <span style={{ fontSize: '19px', fontWeight: 900, color: '#ffffff' }}>
                CodeLens<span style={{ color: '#ec4899' }}>.AI</span>
              </span>
            </div>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '300px' }}>
              AI-Powered Code Analysis & Intelligent Code Improvement Platform. Upload ZIP → Static AST Scan → AI CodeDoctor → Docker Sandbox Validation.
            </p>
          </div>

          {/* Architecture Stack */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#f0abfc', marginBottom: '14px', letterSpacing: '0.06em' }}>
              SYSTEM ARCHITECTURE
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px', color: '#cbd5e1' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={14} color="#ec4899" />
                <span>Frontend: React 19 + Vite</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={14} color="#a855f7" />
                <span>Backend: Spring Boot 3 + Java 17 + MySQL</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={14} color="#3b82f6" />
                <span>Analyzer: Python AST / Heuristic Engine</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box size={14} color="#d946ef" />
                <span>Validator: Docker Isolated Sandbox</span>
              </li>
            </ul>
          </div>

          {/* Core Analysis Agents */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#f0abfc', marginBottom: '14px', letterSpacing: '0.06em' }}>
              INTELLIGENT AGENTS
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px', color: '#cbd5e1' }}>
              <li>🐛 Bug Detection Agent</li>
              <li>🔐 Security Vulnerability & Secret Agent</li>
              <li>⚡ Performance & Latency Optimizer</li>
              <li>🧹 Code Quality & Cyclomatic Complexity</li>
              <li>🩺 AI CodeDoctor (LLM Contextual Fixes)</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#f0abfc', marginBottom: '14px', letterSpacing: '0.06em' }}>
              RESOURCES
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px', color: '#cbd5e1' }}>
              <li>
                <a href="#workflow" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>How it Works</a>
              </li>
              <li>
                <a href="/dashboard" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>Analysis History</a>
              </li>
              <li>
                <a href="/analyzer" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>Upload Project</a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                  <GitBranch size={14} color="#ec4899" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748b',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            © {new Date().getFullYear()} CodeLens AI. Built for developers with high standards.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f0abfc', fontWeight: 600 }}>
            <span>Your code. Understood.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
