import React from 'react';

// Card-styled toast, bottom-center, with optional delta pill and Undo action.
// Every grant surfaces one — the toast IS the undo mechanism.
export function Toast({ message, delta, actionLabel, onAction, inline = false, style }) {
  const showBadge = typeof delta === 'number';
  const isPositive = showBadge && delta > 0;
  return (
    <div role="status" style={{
      position: inline ? 'relative' : 'fixed',
      bottom: inline ? undefined : 'calc(var(--wd-tab-bar-height) + 14px + env(safe-area-inset-bottom))',
      left: inline ? undefined : '50%',
      transform: inline ? undefined : 'translateX(-50%)',
      display: 'inline-flex', alignItems: 'center', gap: 12, padding: 10, paddingRight: 14,
      background: 'var(--wd-surface)', border: '1px solid var(--wd-border)', borderRadius: 20,
      boxShadow: 'var(--wd-shadow-lg)', fontFamily: 'var(--wd-font-body)', fontSize: 13, zIndex: 300,
      maxWidth: 'min(calc(100% - 24px), 460px)', ...style,
    }}>
      {showBadge && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, height: 32,
          padding: '0 10px', borderRadius: 999, fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em', flexShrink: 0,
          color: isPositive ? 'var(--wd-success)' : 'var(--wd-danger)',
          background: isPositive ? 'var(--wd-success-soft)' : 'var(--wd-danger-soft)',
        }}>{isPositive ? '+' : ''}{delta}</div>
      )}
      <span style={{ flex: 1, color: 'var(--wd-text)', fontWeight: 500, letterSpacing: '-0.005em', lineHeight: 1.3 }}>{message}</span>
      {actionLabel && (
        <button onClick={onAction} type="button" style={{
          background: 'transparent', border: 'none', color: 'var(--wd-accent)', padding: '6px 8px',
          margin: '-6px -4px -6px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'inherit', WebkitTapHighlightColor: 'transparent', flexShrink: 0,
        }}>{actionLabel}</button>
      )}
    </div>
  );
}
