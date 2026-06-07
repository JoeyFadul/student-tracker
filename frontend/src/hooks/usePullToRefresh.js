import { useEffect, useState } from 'react';

const THRESHOLD = 70;     // px the user has to pull (after damping) before release triggers a refresh
const MAX_PULL = 110;     // visual ceiling so the indicator can't grow forever
const DRAG_RATIO = 0.5;   // damping — every px the finger moves grows the indicator by half

// Generic pull-to-refresh wired to the window scroll. Listens at the
// document level instead of a specific scroll container so it works with
// the existing screen layout (sticky AppHeader + document-body scroll)
// without requiring a wrapper element. onRefresh can be sync or async; the
// indicator stays in the "refreshing" state until it resolves.
export function usePullToRefresh(onRefresh, enabled = true) {
  const [{ pullY, refreshing }, setState] = useState({ pullY: 0, refreshing: false });

  useEffect(() => {
    if (!enabled) return;
    let startY = null;
    let currentPull = 0;
    let isRefreshing = false;

    const onStart = (e) => {
      if (isRefreshing) return;
      if (window.scrollY > 0) return;
      startY = e.touches[0].clientY;
    };

    const onMove = (e) => {
      if (isRefreshing || startY == null) return;
      if (window.scrollY > 0) {
        startY = null;
        currentPull = 0;
        setState(s => (s.pullY === 0 ? s : { ...s, pullY: 0 }));
        return;
      }
      const dy = e.touches[0].clientY - startY;
      if (dy <= 0) {
        // User reversed direction — abort.
        startY = null;
        currentPull = 0;
        setState(s => (s.pullY === 0 ? s : { ...s, pullY: 0 }));
        return;
      }
      // Eat the scroll bounce so the page itself doesn't elastic-scroll
      // while we're driving the indicator.
      e.preventDefault();
      currentPull = Math.min(MAX_PULL, dy * DRAG_RATIO);
      setState(s => ({ ...s, pullY: currentPull }));
    };

    const onEnd = async () => {
      if (isRefreshing || startY == null) return;
      startY = null;
      if (currentPull >= THRESHOLD) {
        isRefreshing = true;
        currentPull = THRESHOLD;
        setState({ pullY: THRESHOLD, refreshing: true });
        try {
          await onRefresh?.();
        } finally {
          isRefreshing = false;
          currentPull = 0;
          setState({ pullY: 0, refreshing: false });
        }
      } else {
        currentPull = 0;
        setState(s => (s.pullY === 0 ? s : { ...s, pullY: 0 }));
      }
    };

    window.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [enabled, onRefresh]);

  return { pullY, refreshing, threshold: THRESHOLD };
}
