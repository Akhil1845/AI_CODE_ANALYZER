import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  X, 
  Trash2, 
  ArrowUpRight, 
  Search, 
  Bug, 
  Clock, 
  ChevronRight
} from 'lucide-react';
import { storage } from '../services/storage';

export default function HistoryDrawer() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [analyses, setAnalyses] = useState([]);
  const [search, setSearch] = useState('');
  const [isNearEdge, setIsNearEdge] = useState(false);
  const closeTimeoutRef = useRef(null);

  // Load history whenever opened
  useEffect(() => {
    if (isOpen) {
      setAnalyses(storage.getAnalyses());
    }
  }, [isOpen]);

  // Global mouse move listener for edge detection:
  // When cursor moves within 18px of the screen's left edge, immediately slide open!
  useEffect(() => {
    const handleMouseMove = (e) => {
      // If mouse is within 18px of the left edge and drawer is not open
      if (e.clientX <= 18) {
        setIsNearEdge(true);
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setIsOpen(true);
      } else if (e.clientX > 420 && isOpen) {
        // If mouse moved far away from open drawer
        handleMouseLeave();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsNearEdge(false);
    }, 250);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = storage.deleteAnalysis(id);
    setAnalyses(updated);
  };

  const handleClearAll = () => {
    if (confirm('Clear all your code analysis history?')) {
      storage.clearAll();
      setAnalyses([]);
    }
  };

  const handleItemClick = (analysis) => {
    setIsOpen(false);
    navigate('/code-analyzer');
  };

  const filtered = analyses.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.language && a.language.toLowerCase().includes(search.toLowerCase())) ||
    (a.platform && a.platform.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {/* Invisible Left Edge Hover Detection Zone (Activates when cursor moves to the edge) */}
      <div
        onMouseEnter={handleMouseEnter}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: '20px',
          zIndex: 996,
          cursor: 'pointer'
        }}
      />

      {/* Subtle Glowing Left Edge Indicator Tab */}
      {!isOpen && (
        <div
          onMouseEnter={handleMouseEnter}
          style={{
            position: 'fixed',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderLeft: 'none',
            padding: '10px 6px',
            borderTopRightRadius: '10px',
            borderBottomRightRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            zIndex: 995,
            cursor: 'pointer',
            boxShadow: '4px 0 16px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s ease',
            opacity: isNearEdge ? 1 : 0.75
          }}
          title="Move cursor to edge to view Analysis History"
        >
          <History size={16} color="var(--primary)" />
          <span style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: 'var(--text-muted)'
          }}>
            HISTORY
          </span>
        </div>
      )}

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          onMouseEnter={handleMouseLeave}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(5px)',
            zIndex: 998,
            transition: 'opacity 0.25s ease'
          }}
        />
      )}

      {/* Left Sliding Menu Window */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: '400px',
          maxWidth: '85vw',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-light)',
          boxShadow: '10px 0 45px rgba(0, 0, 0, 0.65)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '20px 22px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <History size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                Analysis History
              </h3>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Auto-slides when cursor moves to the left edge
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              padding: '6px',
              borderRadius: '6px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        {analyses.length > 0 && (
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px'
            }}>
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search history by problem / stack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  fontSize: '12.5px',
                  width: '100%'
                }}
              />
            </div>
          </div>
        )}

        {/* History List */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {analyses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--text-muted)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                color: 'var(--text-dim)'
              }}>
                <Clock size={24} />
              </div>
              <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                No History Yet
              </div>
              <p style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                Paste code in the DSA Code Analyzer or scan a project to populate your history.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
              No matches found for "{search}".
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-medium" style={{ fontSize: '10px', padding: '2px 7px' }}>
                      {item.language}
                    </span>
                    <span className="badge badge-category" style={{ fontSize: '10px', padding: '2px 7px' }}>
                      {item.platform}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    title="Delete item"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: '2px'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px', lineHeight: 1.3 }}>
                  {item.name}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--accent-pink)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <Bug size={11} />
                  <span>Fails at Line {item.result?.primaryIssue?.line || 1}: {item.result?.primaryIssue?.title}</span>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                  {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Actions */}
        {analyses.length > 0 && (
          <div style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button
              type="button"
              onClick={handleClearAll}
              style={{
                fontSize: '12px',
                color: 'var(--accent-pink)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600
              }}
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>

            <button
              type="button"
              onClick={() => { setIsOpen(false); navigate('/dashboard'); }}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              <span>View Dashboard</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
