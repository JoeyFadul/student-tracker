import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';

const MIN_HIT = 44; // Apple HIG / CLAUDE.md minimum tap target

// Round icon-only button. The visible circle stays `size`, but the tappable
// area is expanded to ≥44px via a transparent hit box with a negative margin —
// so the touch target is compliant without growing the compact chrome.
export function IconButton({ icon, onClick, ariaLabel, tone = 'surface', size = 36 }) {
  const { handlers, pressedStyle } = usePressable();
  const hit = Math.max(MIN_HIT, size);
  const inset = (hit - size) / 2;
  return (
    <button
      onClick={onClick}
      {...handlers}
      aria-label={ariaLabel}
      style={{ ...hitStyle, width: hit, height: hit, margin: -inset }}
    >
      <span
        style={{
          ...circleStyle,
          ...tones[tone],
          width: size,
          height: size,
          borderRadius: size / 2,
          ...pressedStyle,
        }}
      >
        {icon}
      </span>
    </button>
  );
}

const tones = {
  surface: { background: theme.colors.surface, boxShadow: theme.shadow.sm },
};

const hitStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  flexShrink: 0,
};

const circleStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.1s ease',
};
