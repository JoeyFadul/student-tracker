import React from 'react';
import { usePressable } from './Button.jsx';

// Round icon-only button on a soft surface circle.
export function IconButton({ icon, onClick, ariaLabel, size = 36, style }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onClick} {...handlers} aria-label={ariaLabel}
      style={{
        background: 'var(--wd-surface)', boxShadow: 'var(--wd-shadow-sm)',
        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
        transition: 'transform 0.1s ease', flexShrink: 0,
        width: size, height: size, borderRadius: size / 2,
        ...pressedStyle, ...style,
      }}>
      {icon}
    </button>
  );
}
