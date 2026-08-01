import { useEffect } from 'react';

// Lock body scroll while a modal/sheet is open. A fixed-position backdrop does
// NOT stop iOS WKWebView from scrolling the page behind it on touchmove — the
// scroll "chains" through to the body. Pinning the body with position: fixed is
// the reliable stop; we stash the scroll offset in `top` and restore it on
// release so the page doesn't jump to the top when the sheet closes.
//
// Reference-counted so nested sheets (e.g. CustomAmountSheet inside
// BulkGrantSheet) don't release the lock when only the inner one closes.

let lockCount = 0;
let savedScrollY = 0;

function applyLock() {
  if (lockCount === 0) {
    savedScrollY = window.scrollY;
    const s = document.body.style;
    s.position = 'fixed';
    s.top = `-${savedScrollY}px`;
    s.left = '0';
    s.right = '0';
    s.width = '100%';
    s.overflow = 'hidden';
  }
  lockCount += 1;
}

function releaseLock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    const s = document.body.style;
    s.position = '';
    s.top = '';
    s.left = '';
    s.right = '';
    s.width = '';
    s.overflow = '';
    window.scrollTo(0, savedScrollY);
  }
}

export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    applyLock();
    return releaseLock;
  }, [active]);
}
