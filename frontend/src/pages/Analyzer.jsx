import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UploadBox from '../components/UploadBox';
import { 
  Terminal, 
  CheckCircle2, 
  Loader2
} from 'lucide-react';

export default function Analyzer() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [detectedProject, setDetectedProject] = useState(null);

  const steps = [
    { title: 'Project Extraction & File Indexing', desc: 'Unpacking ZIP archive, resolving paths and ignored files...' },
    { title: 'Tech Stack & Dependency Detection', desc: 'Parsing build files, manifest files, and framework configurations...' },
    { title: 'Static AST & Heuristic Rule Analysis', desc: 'Executing Bug Detection, Security Audits, and Complexity metrics...' },
    { title: 'AI CodeDoctor Reasoning & Context Enrichment', desc: 'Mapping root causes and preparing candidate fix recommendations...' },
    { title: 'Sandbox Environment Preparation', desc: 'Configuring ephemeral Docker container for fix validation tests...' }
  ];

  const handleUploadSuccess = async (uploadResult) => {
    setDetectedProject(uploadResult);
    setAnalyzing(true);
    setLogs([
      `[INFO] Received archive: ${uploadResult.projectName}.zip (${(uploadResult.sizeBytes / 1024).toFixed(1)} KB)`,
      `[INFO] Unpacking files into ephemeral workspace...`
    ]);

    const simulateStage = (stepIndex, logMessages, delayMs) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setCurrentStep(stepIndex);
          setLogs((prev) => [...prev, ...logMessages]);
          resolve();
        }, delayMs);
      });
    };

    try {
      await simulateStage(0, [
        `[SCAN] 147 files indexed across 12 packages`,
        `[AST] Syntax tree generation completed (0 parsing errors)`
      ], 900);

      await simulateStage(1, [
        `[DETECT] Primary Tech Stack: ${uploadResult.detectedStack || 'Spring Boot 3 + Java 17'}`,
        `[DETECT] Build tool: Maven (pom.xml) • Database: MySQL 8.0 • ORM: Spring Data JPA`
      ], 1100);

      await simulateStage(2, [
        `[AGENT] 🐛 Bug Detection Agent: 8 issues flagged (Potential NPEs, unclosed streams)`,
        `[AGENT] 🔐 Security Agent: 5 issues flagged (Hardcoded secrets, unsanitized SQL)`,
        `[AGENT] ⚡ Performance Agent: 6 issues flagged (N+1 query loops, unindexed filters)`,
        `[AGENT] 🧹 Quality Agent: 5 issues flagged (High cyclomatic complexity in service tier)`
      ], 1400);

      await simulateStage(3, [
        `[AI] AI CodeDoctor: Formulating surgical contextual fixes for 24 detected issues...`,
        `[AI] Context window mapped: Method signatures, JPA entities, and enclosing scopes`
      ], 1300);

      await simulateStage(4, [
        `[DOCKER] Sandbox template provisioned: openjdk:17-alpine-gradle`,
        `[READY] Analysis pipeline complete. Generated comprehensive report.`
      ], 900);

      setTimeout(() => {
        navigate(`/analysis/${uploadResult.projectId || 'proj-12345'}`);
      }, 1200);

    } catch (err) {
      console.error(err);
      setLogs((prev) => [...prev, `[ERROR] Analysis interrupted: ${err.message}`]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '50px 0 85px' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
            <span className="badge badge-high" style={{ marginBottom: '12px' }}>
              PROJECT WORKSPACE
            </span>
            <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Upload & Scan Your Repository
            </h1>
            <p style={{ fontSize: '16.5px', color: '#94a3b8' }}>
              Drop your project archive (.zip) below. CodeLens AI automatically detects your stack, executes static AST checks, and invokes AI CodeDoctor.
            </p>
          </div>

          {!analyzing ? (
            <UploadBox onUploadSuccess={handleUploadSuccess} />
          ) : (
            /* Live Analysis Progress Display */
            <div className="glass-card" style={{
              maxWidth: '850px',
              margin: '0 auto',
              padding: '38px',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              boxShadow: '0 20px 50px -10px rgba(4, 5, 10, 0.95), 0 0 30px rgba(236, 72, 153, 0.18)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '20px',
                marginBottom: '28px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
                      Analyzing: {detectedProject?.projectName || 'Project'}
                    </h2>
                    <span className="badge badge-high">
                      {detectedProject?.detectedStack || 'Detecting Stack'}
                    </span>
                  </div>
                  <p style={{ fontSize: '13.5px', color: '#94a3b8' }}>
                    Running multi-agent static analysis pipeline and preparing AI recommendations
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ec4899' }}>
                  <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>Active Scan</span>
                </div>
              </div>

              {/* Progress Steps list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {steps.map((step, idx) => {
                  const isDone = currentStep > idx;
                  const isCurrent = currentStep === idx;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-md)',
                        background: isCurrent
                          ? 'rgba(236, 72, 153, 0.14)'
                          : isDone
                          ? 'rgba(168, 85, 247, 0.08)'
                          : 'rgba(9, 13, 26, 0.7)',
                        border: isCurrent
                          ? '1px solid rgba(236, 72, 153, 0.55)'
                          : isDone
                          ? '1px solid rgba(168, 85, 247, 0.35)'
                          : '1px solid var(--border-subtle)',
                        boxShadow: isCurrent ? '0 0 16px rgba(236, 72, 153, 0.25)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ marginTop: '2px' }}>
                        {isDone ? (
                          <CheckCircle2 size={18} color="#d946ef" />
                        ) : isCurrent ? (
                          <Loader2 size={18} color="#ec4899" style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: '1px solid #64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            color: '#64748b'
                          }}>
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div style={{ flexGrow: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: isCurrent ? '#ffffff' : isDone ? '#f0abfc' : '#94a3b8'
                        }}>
                          {step.title}
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Terminal Logs Window */}
              <div style={{
                background: '#030408',
                border: '1px solid rgba(37, 51, 94, 0.7)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                lineHeight: 1.6,
                maxHeight: '190px',
                overflowY: 'auto',
                boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.8)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', marginBottom: '8px', fontSize: '11px', fontWeight: 600 }}>
                  <Terminal size={12} color="#ec4899" />
                  <span>ANALYSIS AGENT TELEMETRY</span>
                </div>
                {logs.map((log, i) => (
                  <div key={i} style={{
                    color: log.includes('ERROR') ? '#f43f5e' : log.includes('AGENT') ? '#f0abfc' : log.includes('DETECT') ? '#38bdf8' : '#cbd5e1'
                  }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
