import { Plus } from 'lucide-react';
import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';

export function AddStudentButton({ onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      onClick={onClick}
      title="Add student"
      aria-label="Add student"
      {...handlers}
      style={{ ...buttonStyle, ...pressedStyle }}
    >
      <Plus size={26} strokeWidth={2.5} />
    </button>
  );
}

const buttonStyle = {
  position: 'fixed',
  bottom: `calc(${theme.tabBarHeight}px + 20px + ${theme.safeBottom})`,
  right: 20,
  width: 56,
  height: 56,
  borderRadius: 28,
  background: theme.colors.accent,
  color: '#fff',
  border: 'none',
  boxShadow: theme.shadow.fab,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 40,
  transition: 'transform 0.1s ease, box-shadow 0.15s ease',
  WebkitTapHighlightColor: 'transparent',
};
