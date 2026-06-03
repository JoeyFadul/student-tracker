import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';

const variants = {
  primary:       { background: theme.colors.accent,     color: '#fff',                 border: 'none' },
  secondary:     { background: theme.colors.accentSoft, color: theme.colors.accentDark, border: 'none' },
  tertiary:      { background: 'transparent',           color: theme.colors.text,       border: 'none' },
  outline:       { background: theme.colors.surface,    color: theme.colors.text,       border: `1px solid ${theme.colors.border}` },
  success:       { background: theme.colors.success,    color: '#fff',                 border: 'none' },
  danger:        { background: theme.colors.danger,     color: '#fff',                 border: 'none' },
  dangerSoft:    { background: theme.colors.dangerSoft, color: theme.colors.danger,    border: 'none' },
};

const sizes = {
  sm: { padding: '8px 14px',  fontSize: 13, minHeight: 36, borderRadius: theme.radius.md },
  md: { padding: '11px 18px', fontSize: 15, minHeight: 44, borderRadius: theme.radius.md },
  lg: { padding: '14px 20px', fontSize: 16, minHeight: 52, borderRadius: theme.radius.lg },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon = null,
  iconRight = null,
  onClick,
  type = 'button',
  ...rest
}) {
  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;
  const { handlers, pressedStyle } = usePressable();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...handlers}
      style={{
        ...variantStyle,
        ...sizeStyle,
        ...pressedStyle,
        width: fullWidth ? '100%' : 'auto',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontFamily: theme.font.family,
        transition: 'transform 0.1s ease, opacity 0.15s ease, background 0.15s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
