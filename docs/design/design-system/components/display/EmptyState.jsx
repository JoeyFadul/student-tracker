import React from 'react';

// Card-style empty state: icon in a soft accent circle, title, hint, action.
export function EmptyState({ icon, title, hint, action, style }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      padding: '40px 24px', background: 'var(--wd-surface)', borderRadius: 20,
      boxShadow: 'var(--wd-shadow-md)', ...style,
    }}>
      {icon && <div style={{ width: 72, height: 72, borderRadius: 36, background: 'var(--wd-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>{icon}</div>}
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--wd-text)', margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
      {hint && <p style={{ fontSize: 15, color: 'var(--wd-text-muted)', margin: '8px 0 22px', lineHeight: 1.5, maxWidth: 320 }}>{hint}</p>}
      {action}
    </div>
  );
}
