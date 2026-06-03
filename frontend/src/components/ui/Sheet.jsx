import { useEffect, useState } from 'react';
import { theme } from '../../theme';

export function Sheet({ open, onClose, title, children }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const id = setTimeout(() => setMounted(false), 220);
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

  return (
    <div style={{ ...backdropStyle, opacity: visible ? 1 : 0 }} onClick={onClose}>
      <div
        style={{
          ...sheetStyle,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={handleWrapStyle}>
          <div style={handleStyle} />
        </div>
        {title && <div style={titleStyle}>{title}</div>}
        <div style={{ padding: '0 20px 20px', paddingBottom: `calc(20px + ${theme.safeBottom})` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const backdropStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(28, 25, 23, 0.4)',
  zIndex: 200,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  transition: 'opacity 0.22s ease',
};

const sheetStyle = {
  width: '100%',
  maxWidth: 560,
  background: theme.colors.surface,
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  boxShadow: theme.shadow.sheet,
  transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
  maxHeight: '92dvh',
  overflowY: 'auto',
};

const handleWrapStyle = {
  padding: '10px 0 6px',
  display: 'flex',
  justifyContent: 'center',
};

const handleStyle = {
  width: 36,
  height: 4,
  background: '#d6d3d1',
  borderRadius: 999,
};

const titleStyle = {
  padding: '6px 20px 14px',
  fontSize: theme.font.sizes.title3,
  fontWeight: 700,
  color: theme.colors.text,
  letterSpacing: '-0.01em',
};
