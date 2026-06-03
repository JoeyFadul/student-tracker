import { theme } from '../../theme';

export function ScreenHeader({ title, subtitle, action }) {
  return (
    <header style={wrapStyle}>
      <div>
        <h1 style={titleStyle}>{title}</h1>
        {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
      </div>
      {action}
    </header>
  );
}

const wrapStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: 18,
  paddingTop: 4,
};

const titleStyle = {
  fontSize: theme.font.sizes.largeTitle,
  fontWeight: 700,
  color: theme.colors.text,
  margin: 0,
  letterSpacing: '-0.025em',
  lineHeight: 1.1,
};

const subtitleStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textMuted,
  marginTop: 4,
};
