import { useEffect, useState, useCallback } from 'react';
import { theme } from '../../theme';

// Bottom-center toast styled as a card so it matches the rest of the surfaces
// in the app. When `delta` is provided we render the same kind of +N / -N
// chip the activity history uses, so users see the same visual element they
// just added to the log.
export function Toast({ message, delta, actionLabel, onAction, onDismiss, durationMs = 4500 }) {
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Slide in on the next frame so the transition has an initial state to
  // animate from. Without rAF the inserted DOM already has the final values.
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const close = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onDismiss, 180);
  }, [exiting, onDismiss]);

  useEffect(() => {
    const id = setTimeout(close, durationMs);
    return () => clearTimeout(id);
  }, [close, durationMs]);

  const handleAction = () => {
    onAction?.();
    close();
  };

  const showBadge = typeof delta === 'number';
  const isPositive = showBadge && delta > 0;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        ...wrapStyle,
        transform: (entered && !exiting) ? 'translate(-50%, 0)' : 'translate(-50%, 18px)',
        opacity: (entered && !exiting) ? 1 : 0,
      }}
    >
      {showBadge && (
        <div style={{
          ...badgeStyle,
          color: isPositive ? theme.colors.success : theme.colors.danger,
          background: isPositive ? theme.colors.successSoft : theme.colors.dangerSoft,
        }}>
          {isPositive ? '+' : ''}{delta}
        </div>
      )}
      <span style={messageStyle}>{message}</span>
      {actionLabel && (
        <button onClick={handleAction} style={actionStyle} type="button">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

const wrapStyle = {
  position: 'fixed',
  bottom: `calc(${theme.tabBarHeight}px + 14px + ${theme.safeBottom})`,
  left: '50%',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: 10,
  paddingRight: 14,
  background: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.lg,
  fontFamily: theme.font.family,
  fontSize: theme.font.sizes.footnote,
  zIndex: 300,
  // Slightly inset from the screen edges; cap so it doesn't look stretched
  // on iPad / wide windows.
  maxWidth: 'min(calc(100% - 24px), 460px)',
  // Soft, bouncy ease for the slide-up — matches the existing Sheet/modal
  // affordances elsewhere.
  transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease',
};

const badgeStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 40,
  height: 32,
  padding: '0 10px',
  borderRadius: theme.radius.pill,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 700,
  letterSpacing: '-0.01em',
  flexShrink: 0,
};

const messageStyle = {
  flex: 1,
  color: theme.colors.text,
  fontWeight: 500,
  letterSpacing: '-0.005em',
  lineHeight: 1.3,
};

const actionStyle = {
  background: 'transparent',
  border: 'none',
  color: theme.colors.accent,
  padding: '6px 8px',
  margin: '-6px -4px -6px 0',
  fontSize: theme.font.sizes.footnote,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: theme.font.family,
  WebkitTapHighlightColor: 'transparent',
  flexShrink: 0,
};
