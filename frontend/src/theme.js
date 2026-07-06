// Color tokens resolve through CSS variables (defined in index.css) so a
// future color-scheme swap — Phase 1's palette and dark mode — changes
// variable values only, with no JS re-render. Values today are identical
// to the pre-variable palette.
export const theme = {
  colors: {
    bg: 'var(--wd-bg)',
    surface: 'var(--wd-surface)',
    surfaceAlt: 'var(--wd-surface-alt)',
    accent: 'var(--wd-accent)',
    accentSoft: 'var(--wd-accent-soft)',
    accentDark: 'var(--wd-accent-dark)',
    text: 'var(--wd-text)',
    textMuted: 'var(--wd-text-muted)',
    textFaint: 'var(--wd-text-faint)',
    border: 'var(--wd-border)',
    success: 'var(--wd-success)',
    successSoft: 'var(--wd-success-soft)',
    danger: 'var(--wd-danger)',
    dangerSoft: 'var(--wd-danger-soft)',
    warning: 'var(--wd-warning)',
    avatarBg: 'var(--wd-avatar-bg)',
    shimmerMid: 'var(--wd-shimmer-mid)',
    headerDark: 'var(--wd-header-dark)',
    headerDarkText: 'var(--wd-header-dark-text)',
    headerDarkMuted: 'var(--wd-header-dark-muted)',
  },
  // Dark palette for the Stats screen. Phase 1 retires this along with the
  // dark screen itself (docs/requirements/14) — not worth tokenizing.
  dark: {
    bg: '#0E1729',
    surface: '#1A2440',
    surfaceAlt: '#243056',
    text: '#FFFFFF',
    textMuted: '#9CA3B8',
    textFaint: '#6B7390',
    border: 'rgba(255, 255, 255, 0.08)',
    accent: '#FF6B3D',
    accentSoft: 'rgba(255, 107, 61, 0.16)',
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  shadow: {
    sm: '0 1px 2px rgba(15, 23, 42, 0.04)',
    md: '0 2px 8px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.04)',
    lg: '0 10px 28px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)',
    sheet: '0 -8px 32px rgba(15, 23, 42, 0.12)',
    fab: '0 6px 20px rgba(228, 87, 46, 0.36)',
  },
  font: {
    family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif',
    display: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif',
    sizes: {
      caption: 11,
      footnote: 13,
      body: 15,
      heading: 17,
      title3: 20,
      title2: 24,
      title1: 28,
      largeTitle: 34,
      hero: 56,
    },
  },
  tabBarHeight: 64,
  safeBottom: 'env(safe-area-inset-bottom)',
};
