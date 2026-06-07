import { CheckCheck, ChevronRight } from 'lucide-react';
import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';

// Modern feature-row card: white surface, accent shows up only as an icon
// badge so the row reads as a CTA rather than the previous all-peach fill
// (which felt like a warning banner).
export function BulkGrantEntry({ onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onClick} {...handlers} style={{ ...wrapStyle, ...pressedStyle }}>
      <div style={iconCircleStyle}>
        <CheckCheck size={18} color={theme.colors.accent} strokeWidth={2.4} />
      </div>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={titleStyle}>Bulk grant</div>
        <div style={subtitleStyle}>Reward multiple students at once</div>
      </div>
      <ChevronRight size={18} color={theme.colors.textFaint} />
    </button>
  );
}

const wrapStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 14px',
  background: theme.colors.surface,
  border: 'none',
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.sm,
  cursor: 'pointer',
  width: '100%',
  fontFamily: theme.font.family,
  marginBottom: 14,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease, box-shadow 0.15s ease',
};

const iconCircleStyle = {
  width: 36,
  height: 36,
  borderRadius: 18,
  background: theme.colors.accentSoft,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const titleStyle = {
  fontSize: theme.font.sizes.body,
  fontWeight: 600,
  color: theme.colors.text,
  letterSpacing: '-0.01em',
};

const subtitleStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textMuted,
  marginTop: 1,
};
