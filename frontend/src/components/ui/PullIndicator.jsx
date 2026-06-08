import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { theme } from '../../theme';

// Absolutely-positioned spinner that lives at top:-32 *inside* the pull
// content wrapper. Hidden above the visible area at rest; as the wrapper
// translates down on a pull, the spinner slides into the gap. usePullToRefresh
// mutates the wrapper's opacity through this component's forwarded ref so the
// fade-in stays in sync with the finger without re-rendering React.
export const PullIndicator = forwardRef(function PullIndicator({ refreshing }, ref) {
  return (
    <div
      ref={ref}
      aria-hidden
      style={wrapStyle}
    >
      <Loader2
        size={22}
        color={theme.colors.textMuted}
        strokeWidth={2.5}
        className={refreshing ? 'spin' : ''}
      />
    </div>
  );
});

const wrapStyle = {
  position: 'absolute',
  top: -36,
  left: '50%',
  marginLeft: -11,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  pointerEvents: 'none',
};
