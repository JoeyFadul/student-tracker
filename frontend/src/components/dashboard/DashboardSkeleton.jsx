import { theme } from '../../theme';

export function DashboardSkeleton() {
  return (
    <>
      <style>{shimmerKeyframes}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={rowStyle}>
            <div style={avatarStyle} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ ...lineStyle, width: '55%', height: 14 }} />
              <div style={{ ...lineStyle, width: '30%', height: 10 }} />
            </div>
            <div style={{ ...lineStyle, width: 40, height: 22 }} />
          </div>
        ))}
      </div>
    </>
  );
}

const shimmerKeyframes = `
@keyframes wd-shimmer {
  0%   { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}
`;

const shimmerStyle = {
  background: `linear-gradient(90deg, ${theme.colors.surfaceAlt} 0%, #efe7d8 50%, ${theme.colors.surfaceAlt} 100%)`,
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

const lineStyle = {
  borderRadius: 6,
  ...shimmerStyle,
};
