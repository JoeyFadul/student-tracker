import { useEffect, useState } from 'react';
import { theme } from '../../theme';

export function Sheet({ open, onClose, title, children, position = 'bottom' }) {
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

  const isTop = position === 'top';
  const enterTransform = isTop ? 'translateY(-100%)' : 'translateY(100%)';

  return (
    <div
      style={{
        ...backdropStyle,
        alignItems: isTop ? 'flex-start' : 'flex-end',
        opacity: visible ? 1 : 0,
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...sheetStyle,
          borderTopLeftRadius: isTop ? 0 : 28,
          borderTopRightRadius: isTop ? 0 : 28,
          borderBottomLeftRadius: isTop ? 28 : 0,
          borderBottomRightRadius: isTop ? 28 : 0,
          boxShadow: isTop ? '0 8px 32px rgba(28, 25, 23, 0.18)' : theme.shadow.sheet,
          paddingTop: isTop ? 'env(safe-area-inset-top)' : 0,
          transform: visible ? 'translateY(0)' : enterTransform,
        }}
        onClick={e => e.stopPropagation()}
      >
        {!isTop && (
          <div style={handleWrapStyle}>
            <div style={handleStyle} />
          </div>
        )}
        {title && <div style={{ ...titleStyle, paddingTop: isTop ? 18 : 6 }}>{title}</div>}
        <div style={{
          padding: '0 20px 20px',
          paddingBottom: isTop ? 20 : `calc(20px + ${theme.safeBottom})`,
        }}>
          {children}
        </div>
        {isTop && (
          <div style={handleBottomWrapStyle}>
            <div style={handleStyle} />
          </div>
        )}
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
  justifyContent: 'center',
  transition: 'opacity 0.22s ease',
};

const sheetStyle = {
  width: '100%',
  maxWidth: 560,
  background: theme.colors.surface,
  transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
  maxHeight: '92dvh',
  overflowY: 'auto',
};

const handleWrapStyle = {
  padding: '10px 0 6px',
  display: 'flex',
  justifyContent: 'center',
};

const handleBottomWrapStyle = {
  padding: '6px 0 12px',
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
