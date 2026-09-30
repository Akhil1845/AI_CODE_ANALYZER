import React from 'react';

export default function FeatureCard({
  icon: Icon,
  iconColor = '#ec4899',
  badgeText,
  title,
  description,
  bullets = [],
  highlightCode
}) {
  return (
    <div className="glass-card" style={{
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)'
    }}>
      {/* Top row with icon & badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: 'rgba(9, 13, 26, 0.95)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(168, 85, 247, 0.2)'
        }}>
          {Icon && <Icon size={24} color={iconColor} />}
        </div>

        {badgeText && (
          <span className="badge badge-high" style={{ fontSize: '10.5px' }}>
            {badgeText}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '19px',
        fontWeight: 800,
        color: '#ffffff',
        marginBottom: '10px',
        letterSpacing: '-0.02em'
      }}>
        {title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '14.5px',
        color: '#94a3b8',
        lineHeight: 1.6,
        marginBottom: '20px',
        flexGrow: 1
      }}>
        {description}
      </p>

      {/* Code preview or bullets */}
      {highlightCode && (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          background: '#04050a',
          padding: '10px 14px',
          borderRadius: '8px',
          border: '1px solid rgba(217, 70, 239, 0.3)',
          color: '#f0abfc',
          marginBottom: '16px',
          boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.8)'
        }}>
          {highlightCode}
        </div>
      )}

      {bullets && bullets.length > 0 && (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {bullets.map((b, idx) => (
            <li key={idx} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '13px',
              color: '#cbd5e1'
            }}>
              <span style={{ color: iconColor, fontWeight: 800 }}>•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
