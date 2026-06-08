import { useEffect, useRef, useState } from 'react';

const THRESHOLD = 70;
const MAX_PULL = 110;
const DRAG_RATIO = 0.5;

// Pull-to-refresh that mutates the DOM directly during the gesture instead
// of going through React state. The hook exposes a contentRef (the element
// that follows the finger via translate3d — GPU-accelerated, no layout) and
// a spinnerRef (opacity tracks pull progress). React state is only flipped
// at the start/end of the refresh so the visual gesture itself causes zero
// re-renders.
export function usePullToRefresh(onRefresh, enabled = true) {
  const contentRef = useRef(null);
  const spinnerRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let startY = null;
    let currentPull = 0;
    let isRefreshing = false;

    const apply = (pullY, animate = false) => {
      const c = contentRef.current;
      const s = spinnerRef.current;
      if (c) {
        c.style.transition = animate
          ? 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)'
          : 'none';
        c.style.transform = `translate3d(0, ${pullY}px, 0)`;
      }
      if (s) {
        const progress = Math.min(1, pullY / THRESHOLD);
        s.style.transition = animate ? 'opacity 0.22s ease' : 'none';
        s.style.opacity = String(progress);
      }
    };

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
        apply(0);
        return;
      }
      const dy = e.touches[0].clientY - startY;
      if (dy <= 0) {
        startY = null;
        currentPull = 0;
        apply(0);
        return;
      }
      // Suppress the browser's elastic bounce so we drive the gesture.
      e.preventDefault();
      currentPull = Math.min(MAX_PULL, dy * DRAG_RATIO);
      apply(currentPull);
    };

    const onEnd = async () => {
      if (isRefreshing || startY == null) return;
      startY = null;
      if (currentPull >= THRESHOLD) {
        isRefreshing = true;
        currentPull = THRESHOLD;
        apply(THRESHOLD, true);
        setRefreshing(true);
        try {
          await onRefresh?.();
        } finally {
          isRefreshing = false;
          currentPull = 0;
          apply(0, true);
          setRefreshing(false);
        }
      } else {
        currentPull = 0;
        apply(0, true);
      }
    };

    // touchstart can stay passive (we never preventDefault there).
    window.addEventListener('touchstart', onStart, { passive: true });
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

  return { contentRef, spinnerRef, refreshing };
}
