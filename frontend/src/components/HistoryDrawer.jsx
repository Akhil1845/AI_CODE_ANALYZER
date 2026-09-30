import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  X, 
  Trash2, 
  ArrowUpRight, 
  Search, 
  Code2, 
  Bug, 
  Clock, 
  ChevronRight,
  Sparkles,
  FileCode
} from 'lucide-react';
import { storage } from '../services/storage';

export default function HistoryDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAnalyses(storage.getAnalyses());
    }
  }, [isOpen]);

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
    onClose();
    // navigate to code-analyzer or dashboard
    navigate('/code-analyzer');
  };

  const filtered = analyses.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.language && a.language.toLowerCase().includes(search.toLowerCase())) ||
    (a.platform && a.platform.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 998,
            transition: 'opacity 0.25s ease'
          }}
        />
      )}

      {/* Left Sliding Drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: '390px',
          maxWidth: '85vw',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-light)',
          boxShadow: '10px 0 40px rgba(0, 0, 0, 0.6)',
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
                {analyses.length} real submissions recorded
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
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
              onClick={() => { onClose(); navigate('/dashboard'); }}
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
