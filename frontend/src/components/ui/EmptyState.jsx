import { theme } from '../../theme';

// Card-style empty state: icon in a soft circle, title, hint, optional
// action button.
export function EmptyState({ icon, title, hint, action }) {
  return (
    <div style={wrapStyle}>
      {icon && <div style={iconCircleStyle}>{icon}</div>}
      <h2 style={titleStyle}>{title}</h2>
      {hint && <p style={bodyStyle}>{hint}</p>}
      {action}
    </div>
  );
}

const wrapStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '40px 24px',
  background: theme.colors.surface,
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.md,
};

const iconCircleStyle = {
  width: 72,
  height: 72,
  borderRadius: 36,
  background: theme.colors.accentSoft,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 18,
};

const titleStyle = {
  fontSize: theme.font.sizes.title3,
  fontWeight: 700,
  color: theme.colors.text,
  margin: 0,
  letterSpacing: '-0.01em',
};

const bodyStyle = {
  fontSize: theme.font.sizes.body,
  color: theme.colors.textMuted,
  margin: '8px 0 22px',
  lineHeight: 1.5,
  maxWidth: 320,
};
