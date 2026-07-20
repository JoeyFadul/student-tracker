import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';

// Pressable pill action — the dashboard's Class point / Select / select-all
// controls. Distinct from Chip, which is a non-interactive status span. Keeps
// a 44px tap target even though the label is small.
export function ActionChip({
  icon,
  children,
  tone = 'neutral',
  active = false,
  disabled = false,
  onClick,
  ariaLabel,
}) {
  const { handlers, pressedStyle } = usePressable();
  const palette = active ? tones.accent : tones[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...handlers}
      style={{
        ...baseStyle,
        ...palette,
        ...(disabled ? disabledStyle : pressedStyle),
      }}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

const tones = {
  neutral: { background: theme.colors.surfaceAlt, color: theme.colors.textMuted },
  accent: { background: theme.colors.accentSoft, color: theme.colors.accentDark },
};

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  minHeight: 44,
  padding: '0 16px',
  borderRadius: theme.radius.pill,
  border: 'none',
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  fontFamily: theme.font.family,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease, background 0.15s ease',
};

const disabledStyle = { opacity: 0.5, cursor: 'default' };
