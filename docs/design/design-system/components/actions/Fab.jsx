import React from 'react';
import { usePressable } from './Button.jsx';
import { Icon } from '../icons/Icon.jsx';

// 56px floating action button with the orange glow — "Add student".
// App positions it fixed above the tab bar (bottom: tabBar + 20, right: 20).
export function Fab({ icon, onClick, ariaLabel = 'Add student', fixed = true, style }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onClick} aria-label={ariaLabel} title={ariaLabel} {...handlers}
      style={{
        position: fixed ? 'fixed' : 'relative',
        bottom: fixed ? 'calc(var(--wd-tab-bar-height) + 20px + env(safe-area-inset-bottom))' : undefined,
        right: fixed ? 20 : undefined,
        width: 56, height: 56, borderRadius: 28,
        background: 'var(--wd-accent)', color: '#fff', border: 'none',
        boxShadow: 'var(--wd-shadow-fab)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40,
        transition: 'transform 0.1s ease, box-shadow 0.15s ease',
        WebkitTapHighlightColor: 'transparent',
        ...pressedStyle, ...style,
      }}>
      {icon || <Icon name="plus" size={26} strokeWidth={2.5} />}
    </button>
  );
}
