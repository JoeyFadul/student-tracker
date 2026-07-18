import { theme } from '../../theme';

export function Card({ title, subtitle, children, padding = 20, style, ...rest }) {
  return (
    <div
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.xl,
        padding,
        boxShadow: theme.shadow.sm,
        marginBottom: 14,
        ...style,
      }}
      {...rest}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: 14 }}>
          {title && (
            <div style={{
              fontSize: theme.font.sizes.heading,
              fontWeight: 600,
              color: theme.colors.text,
              letterSpacing: '-0.01em',
            }}>
              {title}
            </div>
          )}
          {subtitle && (
            <div style={{
              fontSize: theme.font.sizes.footnote,
              color: theme.colors.textMuted,
              marginTop: 2,
            }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
