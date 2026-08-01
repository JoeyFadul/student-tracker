// With Capacitor KeyboardResize.None the WebView stays full-height when the
// soft keyboard opens, so iOS won't auto-scroll a focused field above it and a
// field near the bottom of a full-page form ends up hidden behind the keyboard.
// index.css reserves scroll room (body padding grows with --kb-height); these
// helpers lift the focused field into the visible band above the keyboard.
// native.js owns the Capacitor wiring and calls in here.

const EDITABLE = /^(INPUT|TEXTAREA)$/;

// Read the keyboard height native.js publishes as an inline custom property.
function keyboardOpen(doc) {
  return parseInt(doc.documentElement.style.getPropertyValue('--kb-height'), 10) > 0;
}

export function scrollFocusedIntoView(doc = document) {
  const el = doc.activeElement;
  if (el && EDITABLE.test(el.tagName)) {
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}

// Moving focus between fields while the keyboard is already open doesn't refire
// keyboardWillShow, so re-lift on focus changes too. Gated on the keyboard
// actually being open so it's inert on desktop and when the keyboard is down.
export function installFocusScroll(doc = document) {
  const onFocusIn = () => {
    if (keyboardOpen(doc)) scrollFocusedIntoView(doc);
  };
  doc.addEventListener('focusin', onFocusIn);
  return () => doc.removeEventListener('focusin', onFocusIn);
}

// With the accessory bar hidden there's no Done button, so make tap-outside
// dismissal deterministic: any tap that lands outside the focused field (and
// isn't another editable/select, which manage focus themselves) blurs it and
// drops the keyboard. WebKit sometimes does this on its own for clickable
// targets, but not reliably for plain containers — this makes it a rule.
// Capture phase so a sheet's stopPropagation can't shield it.
export function installTapDismiss(doc = document) {
  const onTouchEnd = (e) => {
    if (!keyboardOpen(doc)) return;
    const focused = doc.activeElement;
    if (!focused || !EDITABLE.test(focused.tagName)) return;
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (focused.contains(t)) return; // caret repositioning inside the field
    if (t.closest('input, textarea, select, label')) return; // focus moves itself
    focused.blur();
  };
  doc.addEventListener('touchend', onTouchEnd, true);
  return () => doc.removeEventListener('touchend', onTouchEnd, true);
}
