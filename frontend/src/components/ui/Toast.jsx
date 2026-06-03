import { useEffect } from 'react';
import { theme } from '../../theme';

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
  bottom: `calc(${theme.tabBarHeight}px + 16px + ${theme.safeBottom})`,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 16px',
  background: theme.colors.text,
  color: '#fff',
  borderRadius: theme.radius.pill,
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  fontSize: theme.font.sizes.footnote,
  fontWeight: 500,
  zIndex: 300,
  maxWidth: 'calc(100% - 32px)',
};

const actionStyle = {
  background: 'transparent',
  border: 'none',
  color: theme.colors.accent,
  padding: '0 8px',
  fontSize: theme.font.sizes.footnote,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: theme.font.family,
  WebkitTapHighlightColor: 'transparent',
};

const closeStyle = {
  background: 'transparent',
  border: 'none',
  color: '#a8a29e',
  fontSize: 20,
  cursor: 'pointer',
  padding: 0,
  lineHeight: 1,
  fontFamily: theme.font.family,
};
