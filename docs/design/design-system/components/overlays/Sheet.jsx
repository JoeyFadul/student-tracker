import React, { useEffect, useState } from 'react';

// The one popup surface: centered modal panel over a dim backdrop.
// (App name "Sheet" is historical — layout is a centered modal.)
// `inline` renders without fixed positioning for previews/cards.
export function Sheet({ open = true, onClose, title, children, inline = false }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) requestAnimationFrame(() => setVisible(true));
    else setVisible(false);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: inline ? 'relative' : 'fixed', inset: inline ? undefined : 0,
      background: 'rgba(0,0,0,0.4)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.22s ease', opacity: visible ? 1 : 0,
      minHeight: inline ? 320 : undefined, width: inline ? '100%' : undefined,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'calc(100% - 32px)', maxWidth: 480, maxHeight: '85dvh',
        background: 'var(--wd-surface)', borderRadius: 24, boxShadow: 'var(--wd-shadow-lg)',
        overflowY: 'auto', transition: 'opacity 0.18s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1)',
        opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(0.95)',
      }}>
        {title && <div style={{ padding: '20px 20px 12px', fontSize: 20, fontWeight: 700, color: 'var(--wd-text)', letterSpacing: '-0.01em' }}>{title}</div>}
        <div style={{ padding: '0 20px 20px' }}>{children}</div>
      </div>
    </div>
  );
}
