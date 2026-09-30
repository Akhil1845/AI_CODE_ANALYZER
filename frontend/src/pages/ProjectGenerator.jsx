import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Box, 
  Download, 
  FileCode, 
  Check, 
  Sparkles, 
  FolderTree, 
  ArrowRight, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Play,
  Copy
} from 'lucide-react';
import { projectGenerator } from '../services/projectGenerator';
import { api } from '../services/api';

const STACKS = [
  { id: 'spring-boot', name: 'Spring Boot 3 + Java 17', badge: 'Java', desc: 'Enterprise REST API with Spring Data JPA and Maven' },
  { id: 'react', name: 'React 19 + Vite', badge: 'Frontend', desc: 'Modern high-performance SPA scaffolding' },
  { id: 'fastapi', name: 'Python 3 + FastAPI', badge: 'Python', desc: 'High-speed asynchronous Python REST API with Pydantic' },
  { id: 'node', name: 'Node.js + Express', badge: 'Node', desc: 'Lightweight RESTful API service with CORS and Dotenv' },
  { id: 'cpp', name: 'Modern C++20 (CMake)', badge: 'C++', desc: 'Modular CMake project with structured includes and unit tests' }
];

export default function ProjectGenerator() {
  const navigate = useNavigate();
  const [name, setName] = useState('student-service');
  const [stack, setStack] = useState('spring-boot');
  const [database, setDatabase] = useState('postgres');
  const [includeDocker, setIncludeDocker] = useState(true);
  const [includeCi, setIncludeCi] = useState(true);
  const [includeSwagger, setIncludeSwagger] = useState(true);

  const [selectedFile, setSelectedFile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate current files
  const files = projectGenerator.generateFiles({
    name,
    stack,
    database,
    includeDocker,
    includeCi,
    includeSwagger
  });

  const fileKeys = Object.keys(files);
  const activeFile = selectedFile && files[selectedFile] ? selectedFile : fileKeys[0];

  const handleDownloadZip = async () => {
    setGenerating(true);
    try {
      const blob = await projectGenerator.createZipBlob(files);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name || 'project'}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      alert('Failed to compile ZIP: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSendToAnalyzer = async () => {
    setGenerating(true);
    try {
      const blob = await projectGenerator.createZipBlob(files);
      const zipFile = new File([blob], `${name}.zip`, { type: 'application/zip' });
      // Call api upload and route to Analyzer
      await api.uploadProject(zipFile);
      navigate('/analyzer');
    } catch (err) {
      navigate('/analyzer');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyFileContent = () => {
    if (files[activeFile]) {
      navigator.clipboard.writeText(files[activeFile]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '42px 0 85px' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 36px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-accent)',
              color: 'var(--primary)',
              fontSize: '12.5px',
              fontWeight: 700,
              marginBottom: '16px'
            }}>
              <Box size={15} />
              <span>Full Repository Scaffolding Engine</span>
            </div>

            <h1 style={{ fontSize: '38px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Project Generator
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Configure and scaffold production-ready Java Spring Boot, React, Python FastAPI, Node.js, and C++ projects. Preview code in real-time or download as a ready-to-run ZIP archive.
            </p>
          </div>

          {/* Configuration Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {/* Left: Stack & Name Configuration */}
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '18px' }}>
                1. Select Technology Stack
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {STACKS.map((s) => {
                  const isSelected = stack === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setStack(s.id)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'var(--bg-surface)' : 'var(--bg-secondary)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                          {s.name}
                        </span>
                        <span className="badge badge-medium" style={{ fontSize: '10px' }}>
                          {s.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {s.desc}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Project Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Project Name / Artifact ID
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. user-management-api"
                  style={{
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    color: 'var(--text-main)',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Right: Architecture & Features */}
            <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '18px' }}>
                  2. Database &amp; Cloud Features
                </h3>

                {/* Database selection */}
                {(stack === 'spring-boot' || stack === 'fastapi' || stack === 'node') && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Primary Database Driver
                    </label>
                    <select
                      value={database}
                      onChange={(e) => setDatabase(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 14px',
                        color: 'var(--text-main)',
                        fontSize: '13.5px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="postgres">PostgreSQL 16</option>
                      <option value="mysql">MySQL 8.0</option>
                      <option value="sqlite">SQLite 3 (Embedded)</option>
                      <option value="mongodb">MongoDB</option>
                    </select>
                  </div>
                )}

                {/* Checkbox Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-main)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={includeDocker}
                      onChange={(e) => setIncludeDocker(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                    <span>Include Multi-Stage <strong>Dockerfile</strong> for Containerization</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-main)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={includeCi}
                      onChange={(e) => setIncludeCi(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                    <span>Include <strong>GitHub Actions CI/CD</strong> workflow pipeline</span>
                  </label>

                  {stack === 'spring-boot' && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-main)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={includeSwagger}
                        onChange={(e) => setIncludeSwagger(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                      />
                      <span>Include <strong>OpenAPI / Swagger UI</strong> Documentation</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Download / Generate Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={generating}
                  className="btn-primary"
                  style={{ flexGrow: 1, padding: '12px 20px', fontSize: '14px' }}
                >
                  {downloadSuccess ? (
                    <>
                      <Check size={16} />
                      <span>Downloaded {name}.zip!</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      <span>Download Project (.ZIP)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendToAnalyzer}
                  disabled={generating}
                  className="btn-secondary"
                  style={{ padding: '12px 18px', fontSize: '14px' }}
                >
                  <Play size={15} fill="currentColor" color="var(--primary)" />
                  <span>Analyze in CodeLens</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Multi-File Explorer */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '14px',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FolderTree size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                  Scaffolded File Structure ({fileKeys.length} files generated)
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Viewing: {activeFile}
                </span>

                <button
                  type="button"
                  onClick={handleCopyFileContent}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-main)',
                    fontSize: '11.5px',
                    cursor: 'pointer'
                  }}
                >
                  {copied ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Split Explorer */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '260px 1fr',
              gap: '16px',
              alignItems: 'start'
            }}>
              {/* File List Tree */}
              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                padding: '10px',
                maxHeight: '440px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                {fileKeys.map((filePath) => {
                  const isCur = activeFile === filePath;
                  return (
                    <div
                      key={filePath}
                      onClick={() => setSelectedFile(filePath)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: isCur ? 'var(--bg-surface)' : 'transparent',
                        color: isCur ? 'var(--text-main)' : 'var(--text-muted)',
                        fontWeight: isCur ? 700 : 500,
                        border: isCur ? '1px solid var(--border-accent)' : '1px solid transparent',
                        fontSize: '12.5px',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      <FileCode size={14} color={isCur ? 'var(--primary)' : 'var(--text-dim)'} />
                      <span>{filePath}</span>
                    </div>
                  );
                })}
              </div>

              {/* Code Viewer */}
              <pre style={{
                background: 'var(--bg-code)',
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: 1.6,
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                maxHeight: '440px',
                overflowY: 'auto',
                margin: 0
              }}>
                <code>{files[activeFile]}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
