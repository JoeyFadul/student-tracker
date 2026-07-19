import React from 'react';

export function Label({ children }) {
  return <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--wd-text-muted)', marginBottom: 6 }}>{children}</label>;
}

export const inputBaseStyle = {
  width: '100%', padding: '14px 16px', fontSize: 15,
  border: 'none', borderRadius: 12, marginBottom: 14, boxSizing: 'border-box',
  fontFamily: 'var(--wd-font-body)', background: 'var(--wd-surface-alt)',
  color: 'var(--wd-text)', outline: 'none', WebkitAppearance: 'none',
};

export function Input({ label, style, ...inputProps }) {
  return (
    <>
      {label && <Label>{label}</Label>}
      <input {...inputProps} style={{ ...inputBaseStyle, ...style }} />
    </>
  );
}
