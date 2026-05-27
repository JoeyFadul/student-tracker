// ErrorBanner: dismissible inline error display. Used for non-blocking API failures.

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div style={{
      padding: 12,
      background: '#fef2f2',
      color: '#dc2626',
      fontSize: 13,
      borderRadius: 10,
      marginBottom: 14,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: '#dc2626',
            cursor: 'pointer',
            fontSize: 18,
            lineHeight: 1,
            padding: '0 4px',
          }}
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
}
