import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';

// Round icon-only button. `tone` picks the chrome it sits on:
//   surface    — light circle on page content
//   headerDark — translucent circle on the dark header band
export function IconButton({ icon, onClick, ariaLabel, tone = 'surface', size = 36 }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      onClick={onClick}
      {...handlers}
      aria-label={ariaLabel}
      style={{
        ...baseStyle,
        ...tones[tone],
        width: size,
        height: size,
        borderRadius: size / 2,
        ...pressedStyle,
      }}
    >
      {icon}
    </button>
  );
}

const tones = {
  surface: { background: theme.colors.surface, boxShadow: theme.shadow.sm },
  headerDark: { background: 'rgba(255,255,255,0.08)' },
};

const baseStyle = {
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
  flexShrink: 0,
};
