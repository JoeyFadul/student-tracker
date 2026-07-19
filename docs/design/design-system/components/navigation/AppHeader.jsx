import React from 'react';

// Gunmetal chrome header — compact flat band (square corners, tight
// padding — revised 2026-07-18: the band must not eat the screen), white
// title in the rounded display face, silver subtitle.
export function AppHeader({ title, subtitle, action, left, sticky = true }) {
  return (
    <header style={{
      width: '100%', paddingTop: 'env(safe-area-inset-top)',
      position: sticky ? 'sticky' : 'relative', top: sticky ? 0 : undefined,
      zIndex: 100, background: 'var(--wd-gunmetal)',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '12px 20px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        {left && <div style={{ flexShrink: 0 }}>{left}</div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--wd-on-dark)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1, fontFamily: 'var(--wd-font-display)' }}>{title}</h1>
          {subtitle && <div style={{ fontSize: 13, color: 'var(--wd-on-dark-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</div>}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    </header>
  );
}
