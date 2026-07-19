import React from 'react';

const tones = {
  neutral: { background: 'var(--wd-surface-alt)', color: 'var(--wd-text-muted)' },
  danger:  { background: 'var(--wd-danger-soft)', color: 'var(--wd-danger)' },
  accent:  { background: 'var(--wd-accent-soft)', color: 'var(--wd-accent-dark)' },
  slate:   { background: 'var(--wd-slate-soft)', color: 'var(--wd-slate)' },
  gunmetal:{ background: 'var(--wd-gunmetal)', color: 'var(--wd-on-dark)' },
  success: { background: 'var(--wd-success-soft)', color: 'var(--wd-accent-dark)' },
  honey:   { background: 'var(--wd-slate-soft)', color: 'var(--wd-slate)' },
};

// Small pill for status/metadata: streak flames, deltas, read-only badges.
export function Chip({ icon, children, tone = 'neutral', style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px',
      borderRadius: 999, fontSize: 13, fontWeight: 600,
      ...(tones[tone] || tones.neutral), ...style,
    }}>
      {icon}<span>{children}</span>
    </span>
  );
}
