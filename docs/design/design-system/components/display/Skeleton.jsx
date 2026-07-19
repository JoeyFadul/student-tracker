import React from 'react';

// Loading skeletons. Rule: skeletons for anything that loads content;
// spinners only inside busy controls. Uses the wd-shimmer keyframes from base.css.
const shimmerStyle = {
  background: 'linear-gradient(90deg, var(--wd-surface-alt) 0%, var(--wd-shimmer-mid) 50%, var(--wd-surface-alt) 100%)',
  backgroundSize: '400px 100%',
  animation: 'wd-shimmer 1.4s ease-in-out infinite',
};

export function Skeleton({ width = '100%', height = 14, radius = 6, style }) {
  return <div style={{ ...shimmerStyle, width, height, borderRadius: radius, ...style }} />;
}

// Card-shaped row matching StudentListItem's silhouette.
export function SkeletonRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px 14px 16px', background: 'var(--wd-surface)', borderRadius: 20, boxShadow: 'var(--wd-shadow-md)' }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, flexShrink: 0, ...shimmerStyle }} />
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
