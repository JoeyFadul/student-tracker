import React from 'react';

// Gunmetal chrome header — dark band, white large-title in the rounded
// display face, silver subtitle. The signature of the Gunmetal & Coral system.
export function AppHeader({ title, subtitle, action, left, sticky = true }) {
  return (
    <header style={{
      width: '100%', paddingTop: 'env(safe-area-inset-top)',
      position: sticky ? 'sticky' : 'relative', top: sticky ? 0 : undefined,
      zIndex: 100, background: 'var(--wd-gunmetal)',
      borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '22px 20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        {left && <div style={{ flexShrink: 0 }}>{left}</div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--wd-on-dark)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1, fontFamily: 'var(--wd-font-display)' }}>{title}</h1>
          {subtitle && <div style={{ fontSize: 13, color: 'var(--wd-on-dark-muted)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</div>}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    </header>
  );
}
