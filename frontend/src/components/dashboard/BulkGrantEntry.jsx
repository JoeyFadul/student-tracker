import { UserPlus } from 'lucide-react';
import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';

// Soft-coral entry band into select mode (design-system kit): accent
// carries the meaning, single centered line, no card chrome.
export function BulkGrantEntry({ onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onClick} {...handlers} style={{ ...wrapStyle, ...pressedStyle }}>
      <UserPlus size={16} strokeWidth={2.2} />
      Award to multiple students
    </button>
  );
}

const wrapStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  width: '100%',
  padding: '12px 16px',
  marginBottom: 14,
  background: theme.colors.accentSoft,
  border: 'none',
  borderRadius: theme.radius.lg,
  color: theme.colors.accentDark,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: theme.font.family,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
};
