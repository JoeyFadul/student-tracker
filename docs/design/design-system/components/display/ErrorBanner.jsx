import React from 'react';

export function ErrorBanner({ message, onDismiss, style }) {
  if (!message) return null;
  return (
    <div style={{
      padding: '12px 16px', background: 'var(--wd-danger-soft)', color: 'var(--wd-danger)',
      fontSize: 13, fontWeight: 500, borderRadius: 12, marginBottom: 14,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, ...style,
    }}>
      <span>{message}</span>
      {onDismiss && <button onClick={onDismiss} aria-label="Dismiss error" style={{ background: 'none', border: 'none', color: 'var(--wd-danger)', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 4px', fontFamily: 'inherit' }}>×</button>}
    </div>
  );
}
