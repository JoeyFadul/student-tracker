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

// Pinning the body stops DOM scrolling, but iOS WKWebView still has native
// touch-pan paths CSS can't reach (e.g. the keyboard-avoidance content inset
// makes the whole web layer draggable while the keyboard is up). A cancelled
// touchmove is the one veto WebKit always honors, so while locked we kill any
// touch gesture that isn't inside a scroller sitting above the lock (the
// sheet panel, an overflowing textarea) — those keep their native scroll, and
// their overscroll-behavior: contain stops chaining at the edges.
function onLockedTouchMove(e) {
  let el = e.target instanceof Element ? e.target : null;
  while (el && el !== document.body) {
    if (el.scrollHeight > el.clientHeight) {
      const { overflowY } = getComputedStyle(el);
      if (overflowY === 'auto' || overflowY === 'scroll') return;
    }
    el = el.parentElement;
  }
  e.preventDefault();
}

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
    // Must be non-passive: document-level touchmove listeners default to
    // passive, and a passive listener can't preventDefault.
    document.addEventListener('touchmove', onLockedTouchMove, { passive: false });
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
    document.removeEventListener('touchmove', onLockedTouchMove);
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
