import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LogOut, CheckCircle2, ArrowRight, Shield, Terminal } from 'lucide-react';
import { auth } from '../services/auth';

export default function Logout() {
  useEffect(() => {
    // Perform real logout
    auth.logout();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        position: 'relative'
      }}>
        <div className="glass-card" style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid var(--border-light)',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.14)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'var(--accent-pink)'
          }}>
            <LogOut size={26} />
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
            You've been signed out
          </h1>

          <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
            Your session has been securely ended. Your local code trace analyses and generated project history remain safely saved on your browser storage.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/login" className="btn-primary" style={{ padding: '12px', fontSize: '14px' }}>
              <span>Sign In Again</span>
              <ArrowRight size={16} />
            </Link>

            <Link to="/" className="btn-secondary" style={{ padding: '12px', fontSize: '14px' }}>
              <span>Return to Overview</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
