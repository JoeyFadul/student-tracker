import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { theme } from '../../theme';

// All popups in the app render through here. Layout is a centered modal —
// vertically centered between the top of the screen and either the bottom
// of the viewport or the top of the soft keyboard, whichever is higher.
// The latter is wired via the --kb-height CSS variable that native.js sets
// from Capacitor's keyboardWillShow/Hide events.
export function Sheet({ open, onClose, title, children }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const id = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!mounted) return null;

  // Portal to <body> so the backdrop's position: fixed is always positioned
  // relative to the viewport, not the nearest transformed ancestor. Without
  // this, a Sheet rendered inside another Sheet (e.g. CustomAmountSheet
  // inside BulkGrantSheet) inherits the parent sheet's transform as its
  // containing block and ends up sized to the parent panel instead of the
  // screen.
  return createPortal(
    <div
      style={{ ...backdropStyle, opacity: visible ? 1 : 0 }}
      onClick={onClose}
    >
      <div
        style={{
          ...sheetStyle,
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.95)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {title && <div style={titleStyle}>{title}</div>}
        <div style={contentStyle}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Breathing room kept between the panel and the edges of the available band
// (status bar above, keyboard/home-indicator below) so it never touches them.
const GUTTER = 12;

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  // Bottom inset is the keyboard height. native.js updates --kb-height via
  // keyboardWillShow/Hide so the centered modal pops up between the top of
  // the screen and the top of the keyboard whenever one is open.
  bottom: 'var(--kb-height, 0px)',
  background: 'rgba(0, 0, 0, 0.4)',
  zIndex: 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  // Pad by the safe-area insets so centering happens between the status bar
  // and the keyboard/home-indicator, never underneath them. Horizontal 16px
  // gives the panel its side gutters (replacing its old width calc).
  padding: `calc(env(safe-area-inset-top) + ${GUTTER}px) 16px calc(env(safe-area-inset-bottom) + ${GUTTER}px)`,
  transition: 'opacity 0.22s ease, bottom 0.25s cubic-bezier(0.17, 0.59, 0.4, 0.77)',
};

const sheetStyle = {
  width: '100%',
  maxWidth: 480,
  // Cap against the *available* band, not the whole screen: full height minus
  // the keyboard minus both safe-area insets minus the gutters. Without the
  // --kb-height term a keyboard-up panel overflows equally top and bottom and
  // the top spills behind the status bar. Content scrolls inside instead.
  maxHeight: `calc(100dvh - var(--kb-height, 0px) - env(safe-area-inset-top) - env(safe-area-inset-bottom) - ${GUTTER * 2}px)`,
  background: theme.colors.surface,
  borderRadius: 24,
  boxShadow: theme.shadow.lg,
  overflowY: 'auto',
  transition: 'opacity 0.18s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
};

const titleStyle = {
  padding: '20px 20px 12px',
  fontSize: theme.font.sizes.title3,
  fontWeight: 700,
  color: theme.colors.text,
  letterSpacing: '-0.01em',
};

const contentStyle = {
  padding: '0 20px 20px',
};
