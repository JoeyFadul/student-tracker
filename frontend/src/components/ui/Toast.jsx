import { useEffect } from 'react';

export function Toast({ message, actionLabel, onAction, onDismiss, durationMs = 6000 }) {
  useEffect(() => {
    const id = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(id);
  }, [onDismiss, durationMs]);

  return (
    <div style={wrapStyle} role="status">
      <span style={{ flex: 1 }}>{message}</span>
      {actionLabel && (
        <button onClick={onAction} style={actionStyle}>{actionLabel}</button>
      )}
      <button onClick={onDismiss} style={closeStyle} aria-label="Dismiss">×</button>
    </div>
  );
}

const wrapStyle = {
  position: 'fixed',
  bottom: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 16px',
  background: '#1c1917',
  color: '#fff',
  borderRadius: 12,
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  fontSize: 14,
  zIndex: 1000,
  maxWidth: 'calc(100% - 32px)',
};

const actionStyle = {
  background: 'transparent',
  border: '1px solid #57534e',
  color: '#fbbf24',
  padding: '4px 12px',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const closeStyle = {
  background: 'transparent',
  border: 'none',
  color: '#a8a29e',
  fontSize: 20,
  cursor: 'pointer',
  padding: 0,
  lineHeight: 1,
};
