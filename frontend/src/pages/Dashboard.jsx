import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Layers, 
  Bug, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  ArrowUpRight, 
  Plus, 
  Search, 
  FileCode,
  AlertTriangle,
  Code2,
  Trash2,
  Play
} from 'lucide-react';
import { storage } from '../services/storage';

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load REAL analyses only - zero fake mock data
    const realData = storage.getAnalyses();
    setAnalyses(realData);
    setLoading(false);
  }, []);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Delete this analysis record?')) {
      const updated = storage.deleteAnalysis(id);
      setAnalyses(updated);
    }
  };

  const totalAnalyses = analyses.length;
  const criticalCount = analyses.filter(a => a.result?.primaryIssue?.severity === 'CRITICAL').length;
  const highCount = analyses.filter(a => a.result?.primaryIssue?.severity === 'HIGH').length;
  const totalBugs = analyses.filter(a => a.result?.primaryIssue?.type?.includes('BOUNDS') || a.result?.primaryIssue?.type?.includes('NULL')).length;
  const totalTLE = analyses.filter(a => a.result?.primaryIssue?.type?.includes('TIME_LIMIT') || a.result?.primaryIssue?.type?.includes('INFINITE')).length;
  const totalOverflow = analyses.filter(a => a.result?.primaryIssue?.type?.includes('OVERFLOW')).length;
  const totalQuality = analyses.filter(a => a.result?.primaryIssue?.type?.includes('LOGIC') || a.result?.primaryIssue?.type?.includes('EDGE')).length;

  const filteredAnalyses = analyses.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.language && a.language.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (a.platform && a.platform.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '42px 0 85px' }}>
        <div className="container">
          {/* Top Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '34px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h1 style={{ fontSize: '34px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                Your Real Analysis Dashboard
              </h1>
              <p style={{ fontSize: '15px', color: '#94a3b8' }}>
                Tracks only your genuine submissions, code iteration traces, and detected errors.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/code-analyzer" className="btn-primary" style={{ padding: '11px 22px', fontSize: '14px' }}>
                <Code2 size={16} />
                <span>Paste & Analyze Code</span>
              </Link>
              <Link to="/analyzer" className="btn-secondary" style={{ padding: '11px 20px', fontSize: '14px' }}>
                <Plus size={16} />
                <span>Upload Project ZIP</span>
              </Link>
            </div>
          </div>

          {/* Stats Summary Grid (Real user metrics only) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
            marginBottom: '32px'
          }}>
            <div className="glass-card" style={{ padding: '22px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 700 }}>Total Analyzed</span>
                <Code2 size={18} color="#a855f7" />
              </div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {totalAnalyses}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                {totalAnalyses === 0 ? 'No submissions yet' : 'Real user submissions recorded'}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '22px', border: '1px solid rgba(244, 63, 94, 0.35)', boxShadow: totalAnalyses > 0 ? '0 0 20px rgba(244, 63, 94, 0.15)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 700 }}>Critical / High Issues</span>
                <AlertTriangle size={18} color="#ec4899" />
              </div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#f43f5e', fontFamily: 'var(--font-mono)' }}>
                {criticalCount + highCount}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                <span style={{ color: '#fb7185', fontWeight: 700 }}>{criticalCount} Critical</span> • {highCount} High
              </div>
            </div>

            <div className="glass-card" style={{ padding: '22px', border: '1px solid rgba(217, 70, 239, 0.35)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 700 }}>TLE / Infinite Loop Risks</span>
                <Zap size={18} color="#d946ef" />
              </div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#f0abfc', fontFamily: 'var(--font-mono)' }}>
                {totalTLE}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Time complexity bottlenecks detected
              </div>
            </div>

            <div className="glass-card" style={{ padding: '22px', border: '1px solid rgba(59, 130, 246, 0.35)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 700 }}>Overflow / Bounds Errors</span>
                <FileCode size={18} color="#38bdf8" />
              </div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#93c5fd', fontFamily: 'var(--font-mono)' }}>
                {totalBugs + totalOverflow}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Off-by-one, overflow & null dereferences
              </div>
            </div>
          </div>

          {/* Issue Category Distribution Card (Real counts) */}
          <div className="glass-card" style={{ padding: '26px', marginBottom: '32px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                Real Issue Category Breakdown
              </h3>
              <span style={{ fontSize: '12px', color: '#f0abfc', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                ONLY FROM YOUR ANALYZED CODE
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(9, 13, 26, 0.85)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb7185', marginBottom: '8px' }}>
                  <Bug size={17} />
                  <span style={{ fontSize: '13.5px', fontWeight: 700 }}>Off-By-One & Bounds</span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {totalBugs}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Array index exceptions</div>
              </div>

              <div style={{ background: 'rgba(9, 13, 26, 0.85)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(236, 72, 153, 0.35)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f472b6', marginBottom: '8px' }}>
                  <ShieldAlert size={17} />
                  <span style={{ fontSize: '13.5px', fontWeight: 700 }}>Integer Overflow</span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {totalOverflow}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Midpoint & 32-bit wrap bugs</div>
              </div>

              <div style={{ background: 'rgba(9, 13, 26, 0.85)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.35)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', marginBottom: '8px' }}>
                  <Zap size={17} />
                  <span style={{ fontSize: '13.5px', fontWeight: 700 }}>TLE / Quadratic Loops</span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {totalTLE}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>O(N²) bottlenecks on N=10⁵</div>
              </div>

              <div style={{ background: 'rgba(9, 13, 26, 0.85)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(168, 85, 247, 0.35)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', marginBottom: '8px' }}>
                  <FileCode size={17} />
                  <span style={{ fontSize: '13.5px', fontWeight: 700 }}>Edge Case & Logic</span>
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {totalQuality}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Empty inputs & unhandled states</div>
              </div>
            </div>
          </div>

          {/* Submissions / Analyses Table */}
          <div className="glass-card" style={{ padding: '26px', border: '1px solid var(--border-subtle)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '22px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff' }}>
                Your Real Analysis History
              </h3>

              {/* Search input */}
              {analyses.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(9, 13, 26, 0.9)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '7px 14px',
                  width: '270px'
                }}>
                  <Search size={15} color="#ec4899" />
                  <input
                    type="text"
                    placeholder="Search your code analyses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#ffffff',
                      fontSize: '13px',
                      width: '100%'
                    }}
                  />
                </div>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                Loading your history...
              </div>
            ) : analyses.length === 0 ? (
              /* Clean Empty State - ZERO FAKE DATA */
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(217, 70, 239, 0.12)',
                  border: '1px solid rgba(217, 70, 239, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                  boxShadow: '0 0 20px rgba(217, 70, 239, 0.2)'
                }}>
                  <Code2 size={30} color="#ec4899" />
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  No Code Analyses Yet
                </h4>
                <p style={{ fontSize: '14.5px', color: '#94a3b8', maxWidth: '480px', marginBottom: '24px', lineHeight: 1.6 }}>
                  You don't have any saved analysis records yet. Paste a Java, Python, C, or C++ snippet from LeetCode, CodeChef, or MentorPick to see real iteration traces and pinpoint exact bug points.
                </p>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Link to="/code-analyzer" className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px' }}>
                    <Play size={16} fill="currentColor" />
                    <span>Paste LeetCode / MentorPick Code</span>
                  </Link>
                  <Link to="/analyzer" className="btn-secondary" style={{ padding: '12px 22px', fontSize: '14px' }}>
                    <span>Scan Project Archive</span>
                  </Link>
                </div>
              </div>
            ) : filteredAnalyses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                No submissions match your search query.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredAnalyses.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 22px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(9, 13, 26, 0.85)',
                      border: '1px solid var(--border-subtle)',
                      transition: 'border-color 0.2s',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '16.5px', fontWeight: 800, color: '#ffffff' }}>
                          {a.name}
                        </span>
                        <span className="badge badge-high" style={{ fontSize: '10.5px' }}>
                          {a.language}
                        </span>
                        <span className="badge badge-category" style={{ fontSize: '10.5px' }}>
                          {a.platform}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12.5px', color: '#94a3b8' }}>
                        <span style={{ color: '#f87171', fontWeight: 600 }}>
                          Issue: {a.result?.primaryIssue?.title || 'Analyzed'}
                        </span>
                        <span>•</span>
                        <span>Fails at Line {a.result?.primaryIssue?.line || 1}</span>
                        <span>•</span>
                        <span>{new Date(a.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Link
                        to="/code-analyzer"
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                      >
                        <span>Re-inspect Code</span>
                        <ArrowUpRight size={14} />
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(a.id, e)}
                        title="Delete record"
                        style={{
                          padding: '8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(244, 63, 94, 0.1)',
                          border: '1px solid rgba(244, 63, 94, 0.3)',
                          color: '#fb7185',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
