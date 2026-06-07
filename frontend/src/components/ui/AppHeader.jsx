import { theme } from '../../theme';

export function AppHeader({ title, subtitle, action, left, dark = true }) {
  const styles = dark ? darkStyles : lightStyles;
  return (
    <header style={styles.wrap}>
      <div style={styles.inner}>
        {left && <div style={styles.left}>{left}</div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={styles.title}>{title}</h1>
          {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
        </div>
        {action && <div style={styles.action}>{action}</div>}
      </div>
    </header>
  );
}

const baseWrap = {
  width: '100%',
  paddingTop: 'env(safe-area-inset-top)',
  // Sticky to the top of the scroll viewport so the title/back button/avatar
  // stay visible while the content scrolls underneath. zIndex sits between
  // scrolling content (0) and modal surfaces (200) so it can't ever cover
  // an open sheet.
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const baseInner = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '18px 20px 22px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
};

const darkStyles = {
  wrap: {
    ...baseWrap,
    background: theme.colors.headerDark,
  },
  inner: baseInner,
  left: { flexShrink: 0 },
  action: { flexShrink: 0 },
  title: {
    fontSize: theme.font.sizes.title1,
    fontWeight: 700,
    color: theme.colors.headerDarkText,
    margin: 0,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    fontFamily: theme.font.display,
  },
  subtitle: {
    fontSize: theme.font.sizes.footnote,
    color: theme.colors.headerDarkMuted,
    marginTop: 4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};

const lightStyles = {
  wrap: {
    ...baseWrap,
    background: theme.colors.bg,
  },
  inner: baseInner,
  left: { flexShrink: 0 },
  action: { flexShrink: 0 },
  title: {
    fontSize: theme.font.sizes.title1,
    fontWeight: 700,
    color: theme.colors.text,
    margin: 0,
    letterSpacing: '-0.02em',
    fontFamily: theme.font.display,
  },
  subtitle: {
    fontSize: theme.font.sizes.footnote,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
};
