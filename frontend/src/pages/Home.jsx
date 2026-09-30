import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';
import { 
  Bug, 
  ShieldAlert, 
  Zap, 
  Layers, 
  ArrowRight, 
  FileSearch,
  Box
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Layers,
      iconColor: '#ec4899',
      badgeText: 'Auto-Detect',
      title: 'Automatic Project Detection',
      description: 'Understands your project structure, language, and build tools automatically by parsing manifest configurations.',
      bullets: [
        'Inspects pom.xml, build.gradle, package.json, requirements.txt',
        'Recognizes React, Node.js, Spring Boot, Java, and Python',
        'Maps multi-module dependencies and directory hierarchy'
      ],
      highlightCode: 'Detected: Spring Boot 3.2.0 • Java 17 • Maven'
    },
    {
      icon: Bug,
      iconColor: '#f43f5e',
      badgeText: 'Bug Agent',
      title: 'Deep Bug Detection Agent',
      description: 'Scans for subtle runtime exceptions, logical errors, infinite loops, and unchecked null references that break production.',
      bullets: [
        'Null pointer dereference possibilities',
        'Resource leaks (unclosed streams, file handles)',
        'Uncaught async rejections and missing error handlers',
        'Unreachable statements and infinite loop hazards'
      ],
      highlightCode: 'Line 42: Unchecked Optional.get() without check'
    },
    {
      icon: ShieldAlert,
      iconColor: '#d946ef',
      badgeText: 'Security Agent',
      title: 'Security & Secret Analysis',
      description: 'Audits source code for dangerous vulnerabilities, hardcoded credentials, SQL injection, and insecure API handling.',
      bullets: [
        'Hardcoded API keys, JWT secrets, and database passwords',
        'SQL & NoSQL injection vulnerability patterns',
        'Unsafe deserialization and arbitrary script execution',
        'Sensitive data leakage in logging filters'
      ],
      highlightCode: 'Critical: Secret key string literal committed'
    },
    {
      icon: Zap,
      iconColor: '#38bdf8',
      badgeText: 'Performance Agent',
      title: 'Performance & Bottleneck Hunter',
      description: 'Identifies expensive CPU cycles, N+1 query loops, unmemoized React rerenders, and redundant computations.',
      bullets: [
        'N+1 ORM database queries inside loops',
        'Unnecessary object instantiation inside hot loops',
        'Unoptimized React components missing useMemo/useCallback',
        'Memory accumulation in global caches'
      ],
      highlightCode: 'N+1 Query: 501 SQL queries executed sequentially'
    },
    {
      icon: FileSearch,
      iconColor: '#a855f7',
      badgeText: 'Quality Agent',
      title: 'Code Quality & Maintainability',
      description: 'Measures cyclomatic complexity, dead code, duplicated logic, and monolithic god-functions that impede team velocity.',
      bullets: [
        'Cyclomatic complexity measurement (> 15 flag)',
        'Duplicate blocks & copy-pasted implementations',
        'Violations of single-responsibility principle',
        'Swallowed exceptions and silent catch blocks'
      ],
      highlightCode: 'Complexity: 24 (High) in processStudentData()'
    },
    {
      icon: Box,
      iconColor: '#f43f5e',
      badgeText: 'Docker Sandbox',
      title: 'AI CodeDoctor & Fix Validation',
      description: 'Generates targeted code repairs with context awareness, then validates fixes in an isolated Docker container before suggesting them.',
      bullets: [
        'Context-aware patch generation (imports + scope)',
        'Spins up ephemeral Docker container for compilation',
        'Runs project test suites to prevent regressions',
        'Calculates Before vs After diff verification'
      ],
      highlightCode: '✓ Sandbox: 18/18 tests passed · 0 regressions'
    }
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'Upload Project ZIP',
      desc: 'Drop your full repository archive (.zip). CodeLens AI validates structure, unpacks files, and catalogs all source trees.'
    },
    {
      num: '02',
      title: 'Project & Stack Detection',
      desc: 'Determines the framework, language version (e.g. Java 17, Spring Boot, React 19), dependencies, and entrypoints.'
    },
    {
      num: '03',
      title: 'Dual AST & AI Scan',
      desc: 'Static AST parsers and AI agents evaluate code for bugs, security leaks, latency bottlenecks, and quality issues.'
    },
    {
      num: '04',
      title: 'AI CodeDoctor Reasoning',
      desc: 'Produces human-readable explanations of why the issue exists and formulates a surgical, context-aware code fix.'
    },
    {
      num: '05',
      title: 'Sandbox Validation',
      desc: 'The patch is tested inside a temporary container to compile and run tests. Only verified fixes are recommended.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flexGrow: 1 }}>
        <Hero />

        {/* Workflow Section */}
        <section id="workflow" style={{
          padding: '80px 0',
          background: 'rgba(9, 13, 26, 0.75)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 52px' }}>
              <span className="badge badge-high" style={{ marginBottom: '14px' }}>
                END-TO-END PIPELINE
              </span>
              <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '14px' }}>
                How CodeLens AI Works
              </h2>
              <p style={{ fontSize: '16.5px', color: '#94a3b8' }}>
                Traditional linters stop at cryptic warnings. Chatbots guess without knowing your project. CodeLens AI executes a validated loop:
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '20px'
            }}>
              {workflowSteps.map((step) => (
                <div key={step.num} className="glass-card" style={{
                  padding: '24px',
                  position: 'relative',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{
                    fontSize: '30px',
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '12px'
                  }}>
                    {step.num}
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.55 }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section style={{ padding: '95px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px' }}>
              <span className="badge badge-critical" style={{ marginBottom: '14px' }}>
                MULTI-AGENT CAPABILITIES
              </span>
              <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '14px' }}>
                Engineered for High-Velocity Teams
              </h2>
              <p style={{ fontSize: '16.5px', color: '#94a3b8' }}>
                Comprehensive multi-dimensional analysis combining AST static verification with deep AI code repair.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px'
            }}>
              {features.map((feat, idx) => (
                <FeatureCard key={idx} {...feat} />
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section style={{ padding: '60px 0 95px' }}>
          <div className="container">
            <div className="glass-card" style={{
              padding: '65px 40px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(15, 21, 43, 0.95) 0%, rgba(20, 10, 32, 0.9) 50%, rgba(9, 13, 26, 0.95) 100%)',
              border: '1px solid rgba(236, 72, 153, 0.4)',
              boxShadow: '0 25px 60px -15px rgba(4, 5, 10, 0.95), 0 0 35px rgba(236, 72, 153, 0.2)'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '450px',
                height: '220px',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none'
              }} />

              <h2 style={{ fontSize: '40px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '16px' }}>
                Analyze your repository in seconds
              </h2>
              <p style={{ fontSize: '17.5px', color: '#94a3b8', maxWidth: '620px', margin: '0 auto 34px' }}>
                Upload your project ZIP, discover lurking vulnerabilities, and let AI CodeDoctor formulate verified fixes.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/analyzer" className="btn-primary" style={{ padding: '14px 34px', fontSize: '15px' }}>
                  <span>Launch Analyzer</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/analysis/proj-12345" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '15px' }}>
                  <span>View Sample Report</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
