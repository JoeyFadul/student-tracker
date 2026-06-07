import { Loader2 } from 'lucide-react';
import { theme } from '../../theme';

// Pull-to-refresh visual. Renders a fixed-height "well" between the sticky
// header and the content; height tracks the pull distance from usePullToRefresh.
// While dragging, the spinner glyph rotates proportionally to pull progress.
// Once refreshing, the existing global .spin CSS animation takes over.
export function PullIndicator({ pullY, refreshing, threshold = 70 }) {
  const progress = Math.min(1, pullY / threshold);
  return (
    <div
      aria-hidden
      style={{
        height: pullY,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: refreshing ? 'none' : 'height 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none',
      }}
    >
      <Loader2
        size={22}
        color={theme.colors.textMuted}
        strokeWidth={2.5}
        className={refreshing ? 'spin' : ''}
        style={{
          opacity: progress,
          transform: refreshing ? undefined : `rotate(${progress * 270}deg)`,
          transition: refreshing ? 'none' : 'opacity 0.15s ease, transform 0.05s linear',
        }}
      />
    </div>
  );
}
