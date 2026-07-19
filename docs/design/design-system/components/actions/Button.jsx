import React, { useState } from 'react';

// Press feedback used everywhere in the app (usePressable): scale(0.97).
export function usePressable() {
  const [pressed, setPressed] = useState(false);
  const handlers = {
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    onTouchStart: () => setPressed(true),
    onTouchEnd: () => setPressed(false),
    onTouchCancel: () => setPressed(false),
  };
  return { pressed, handlers, pressedStyle: pressed ? { transform: 'scale(0.97)' } : {} };
}

const variants = {
  primary:    { background: 'var(--wd-accent)', color: '#fff', border: 'none' },
  secondary:  { background: 'var(--wd-slate)', color: '#fff', border: 'none' },
  tertiary:   { background: 'transparent', color: 'var(--wd-text)', border: 'none' },
  outline:    { background: 'var(--wd-surface)', color: 'var(--wd-text)', border: '1.5px solid var(--wd-border)' },
  gunmetal:   { background: 'var(--wd-gunmetal)', color: '#fff', border: 'none' },
  success:    { background: 'var(--wd-accent)', color: '#fff', border: 'none' },
  danger:     { background: 'var(--wd-danger)', color: '#fff', border: 'none' },
  dangerSoft: { background: 'var(--wd-danger-soft)', color: 'var(--wd-danger)', border: 'none' },
};

const sizes = {
  sm: { padding: '8px 14px', fontSize: 13, minHeight: 36, borderRadius: 12 },
  md: { padding: '11px 18px', fontSize: 15, minHeight: 44, borderRadius: 12 },
  lg: { padding: '14px 20px', fontSize: 16, minHeight: 52, borderRadius: 16 },
};

export function Button({ children, variant = 'primary', size = 'md', fullWidth = false, disabled = false, icon = null, iconRight = null, onClick, type = 'button', style, ...rest }) {
  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;
  const { handlers, pressedStyle } = usePressable();
  return (
    <button type={type} onClick={onClick} disabled={disabled} {...handlers}
      style={{
        ...variantStyle, ...sizeStyle, ...pressedStyle,
        width: fullWidth ? '100%' : 'auto',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: 'var(--wd-font-body)',
        transition: 'transform 0.1s ease, opacity 0.15s ease, background 0.15s ease',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }} {...rest}>
      {icon}{children}{iconRight}
    </button>
  );
}
