import { CheckCheck, ChevronRight } from 'lucide-react';
import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';

export function BulkGrantEntry({ onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onClick} {...handlers} style={{ ...wrapStyle, ...pressedStyle }}>
      <div style={iconCircleStyle}>
        <CheckCheck size={18} color={theme.colors.accentDark} strokeWidth={2.4} />
      </div>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={titleStyle}>Bulk grant</div>
        <div style={subtitleStyle}>Reward multiple students at once</div>
      </div>
      <ChevronRight size={18} color={theme.colors.textMuted} />
    </button>
  );
}

const wrapStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '14px 16px',
  background: theme.colors.accentSoft,
  border: 'none',
  borderRadius: theme.radius.xl,
  cursor: 'pointer',
  width: '100%',
  fontFamily: theme.font.family,
  marginBottom: 14,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease, background 0.15s ease',
};

const iconCircleStyle = {
  width: 36,
  height: 36,
  borderRadius: 18,
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const titleStyle = {
  fontSize: theme.font.sizes.body,
  fontWeight: 600,
  color: theme.colors.accentDark,
  letterSpacing: '-0.01em',
};

const subtitleStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.accentDark,
  opacity: 0.75,
  marginTop: 1,
};
