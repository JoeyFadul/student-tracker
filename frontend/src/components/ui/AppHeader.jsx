import { theme } from '../../theme';

// Light large-title header on paper — the dark navy band retired with the
// Warm Craft pass (docs/requirements/14).
export function AppHeader({ title, subtitle, action, left }) {
  return (
    <header style={wrapStyle}>
      <div style={innerStyle}>
        {left && <div style={{ flexShrink: 0 }}>{left}</div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={titleStyle}>{title}</h1>
          {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    </header>
  );
}

const wrapStyle = {
  width: '100%',
  paddingTop: 'env(safe-area-inset-top)',
  // Sticky to the top of the scroll viewport so the title/back button/avatar
  // stay visible while the content scrolls underneath. zIndex sits between
  // scrolling content (0) and modal surfaces (200) so it can't ever cover
  // an open sheet.
  position: 'sticky',
  top: 0,
  zIndex: 100,
  background: theme.colors.bg,
};

const innerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '18px 20px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
};

const titleStyle = {
  fontSize: 30,
  fontWeight: 800,
  color: theme.colors.text,
  margin: 0,
  letterSpacing: '-0.02em',
  lineHeight: 1.1,
  fontFamily: theme.font.display,
};

const subtitleStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textMuted,
  marginTop: 4,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
