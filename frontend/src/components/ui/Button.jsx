// Button: variants for the three contexts we use (primary, secondary, danger),
// plus sizes and an optional icon. All buttons in the app should use this.

const variants = {
  primary: {
    background: '#1c1917', color: '#fff', border: 'none',
  },
  secondary: {
    background: '#fff', color: '#1c1917', border: '1px solid #e7e2d8',
  },
  success: {
    background: '#16a34a', color: '#fff', border: 'none',
  },
  danger: {
    background: '#dc2626', color: '#fff', border: 'none',
  },
  dangerOutline: {
    background: '#fff', color: '#dc2626', border: '1px solid #fca5a5',
  },
};

const sizes = {
  sm: { padding: '8px 16px', fontSize: 14 },
  md: { padding: '12px 16px', fontSize: 15 },
  lg: { padding: '14px 16px', fontSize: 16 },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon = null,
  onClick,
  type = 'button',
  ...rest
}) {
  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variantStyle,
        ...sizeStyle,
        width: fullWidth ? '100%' : 'auto',
        borderRadius: 10,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontFamily: 'inherit',
      }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
