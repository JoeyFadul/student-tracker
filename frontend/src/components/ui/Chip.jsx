import { theme } from '../../theme';

// Small pill for status/metadata: streak flames, deltas, read-only badges.
export function Chip({ icon, children, tone = 'neutral', style }) {
  return (
    <span style={{ ...baseStyle, ...tones[tone], ...style }}>
      {icon}
      <span>{children}</span>
    </span>
  );
}

const tones = {
  neutral: { background: theme.colors.surfaceAlt, color: theme.colors.textMuted },
  danger:  { background: theme.colors.dangerSoft, color: theme.colors.danger },
  accent:  { background: theme.colors.accentSoft, color: theme.colors.accentDark },
  success: { background: theme.colors.successSoft, color: theme.colors.success },
};

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '6px 12px',
  borderRadius: theme.radius.pill,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
};
