import React from 'react';
import { Icon } from '../icons/Icon.jsx';

// Pill search field with leading search icon — dashboard roster filter.
export function SearchBar({ value, onChange, placeholder = 'Search students…', style }) {
  return (
    <div style={{ position: 'relative', flex: 1, ...style }}>
      <Icon name="search" size={18} color="var(--wd-text-faint)"
        style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      <input type="text" placeholder={placeholder} value={value} onChange={e => onChange && onChange(e.target.value)}
        style={{
          width: '100%', padding: '12px 14px 12px 42px', fontSize: 15,
          border: 'none', borderRadius: 999, background: 'var(--wd-surface-alt)',
          color: 'var(--wd-text)', boxSizing: 'border-box', outline: 'none',
          fontFamily: 'var(--wd-font-body)', minHeight: 44, WebkitAppearance: 'none',
        }} />
    </div>
  );
}
