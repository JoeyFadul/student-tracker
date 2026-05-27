// Card: the standard rounded-rectangle container used throughout the app.
// Accepts an optional title and renders children with consistent padding.

export function Card({ title, children, style, ...rest }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 20,
        padding: 20,
        border: '1px solid #e7e2d8',
        marginBottom: 16,
        ...style,
      }}
      {...rest}
    >
      {title && (
        <div style={{
          fontSize: 16,
          fontWeight: 600,
          color: '#1c1917',
          marginBottom: 12,
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
