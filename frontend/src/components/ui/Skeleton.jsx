import { theme } from '../../theme';

// Loading-skeleton primitives. Rule from CLAUDE.md: skeletons for anything
// that loads content; spinners only inside busy controls.

export function SkeletonBlock({ width = '100%', height = 14, radius = 6, style }) {
  return (
    <>
      <style>{shimmerKeyframes}</style>
      <div style={{ ...shimmerStyle, width, height, borderRadius: radius, ...style }} />
    </>
  );
}

// Card-shaped row matching StudentListItem's silhouette: avatar + two
// lines + trailing figure.
export function SkeletonRow() {
  return (
    <div style={rowStyle}>
      <style>{shimmerKeyframes}</style>
      <div style={avatarStyle} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ ...shimmerStyle, width: '55%', height: 14, borderRadius: 6 }} />
        <div style={{ ...shimmerStyle, width: '30%', height: 10, borderRadius: 6 }} />
      </div>
      <div style={{ ...shimmerStyle, width: 40, height: 22, borderRadius: 6 }} />
    </div>
  );
}

export function SkeletonList({ count = 5, gap = 10, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>
      {Array.from({ length: count }, (_, i) => <SkeletonRow key={i} />)}
    </div>
  );
}

const shimmerKeyframes = `
@keyframes wd-shimmer {
  0%   { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}
`;

const shimmerStyle = {
  background: `linear-gradient(90deg, ${theme.colors.surfaceAlt} 0%, ${theme.colors.shimmerMid} 50%, ${theme.colors.surfaceAlt} 100%)`,
  backgroundSize: '400px 100%',
  animation: 'wd-shimmer 1.4s ease-in-out infinite',
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 14px 14px 16px',
  background: theme.colors.surface,
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.md,
};

const avatarStyle = {
  width: 56,
  height: 56,
  borderRadius: theme.radius.lg,
  flexShrink: 0,
  ...shimmerStyle,
};
