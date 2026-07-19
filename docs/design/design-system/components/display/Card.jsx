import React from 'react';

// Bordered white surface — 1px hairline + subtle shadow, radius 20.
export function Card({ title, subtitle, children, padding = 20, style, ...rest }) {
  return (
    <div style={{
      background: 'var(--wd-surface)', border: '1px solid var(--wd-border)',
      borderRadius: 20, padding, boxShadow: 'var(--wd-shadow-sm)', marginBottom: 14, ...style,
    }} {...rest}>
      {(title || subtitle) && (
        <div style={{ marginBottom: 14 }}>
          {title && <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--wd-text)', letterSpacing: '-0.01em' }}>{title}</div>}
          {subtitle && <div style={{ fontSize: 13, color: 'var(--wd-text-muted)', marginTop: 2 }}>{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
