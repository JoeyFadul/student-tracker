import { theme } from '../../theme';

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div style={wrapStyle}>
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} style={dismissStyle} aria-label="Dismiss error">×</button>
      )}
    </div>
  );
}

const wrapStyle = {
  padding: '12px 16px',
  background: theme.colors.dangerSoft,
  color: theme.colors.danger,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 500,
  borderRadius: theme.radius.md,
  marginBottom: 14,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
};

const dismissStyle = {
  background: 'none',
  border: 'none',
  color: theme.colors.danger,
  cursor: 'pointer',
  fontSize: 20,
  lineHeight: 1,
  padding: '0 4px',
  fontFamily: theme.font.family,
};
