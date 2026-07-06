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
    honey: 'var(--wd-honey)',
    honeySoft: 'var(--wd-honey-soft)',
    honeyInk: 'var(--wd-honey-ink)',
    surfaceTranslucent: 'var(--wd-surface-translucent)',
    avatarBg: 'var(--wd-avatar-bg)',
    shimmerMid: 'var(--wd-shimmer-mid)',
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  // Warm-tinted (ink-based) shadows per doc 14.
  shadow: {
    sm: '0 1px 2px rgba(42, 37, 33, 0.05)',
    md: '0 2px 8px rgba(42, 37, 33, 0.06), 0 1px 2px rgba(42, 37, 33, 0.04)',
    lg: '0 10px 28px rgba(42, 37, 33, 0.09), 0 2px 6px rgba(42, 37, 33, 0.05)',
    sheet: '0 -8px 32px rgba(42, 37, 33, 0.14)',
    fab: '0 6px 20px rgba(224, 91, 53, 0.36)',
  },
  font: {
    family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif',
    // Rounded display for titles and big numerals — SF Pro Rounded on iOS,
    // graceful fallback elsewhere. Doc 14's "single biggest feels-new lever".
    display: 'ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
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
