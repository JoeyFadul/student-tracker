import { Component } from 'react';
import { theme } from '../../theme';

// Last-resort catch for render errors anywhere in the tree. Without this a
// single uncaught error unmounts the whole app to a blank white screen —
// indistinguishable from a crash to the user (and to App Review). Reloading
// restarts the app from the persisted session, so the user lands back where
// auth restore puts them rather than losing everything.
export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Render error caught by ErrorBoundary:', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={titleStyle}>Something went wrong</div>
          <div style={bodyStyle}>
            An unexpected error occurred. Your data is safe — reload to pick up
            where you left off.
          </div>
          <button style={buttonStyle} onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      </div>
    );
  }
}

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  background: theme.colors.bg,
  fontFamily: theme.font.family,
};

const cardStyle = {
  width: '100%',
  maxWidth: 380,
  background: theme.colors.surface,
  padding: 32,
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.md,
  textAlign: 'center',
};

const titleStyle = {
  fontSize: theme.font.sizes.title3,
  fontWeight: 700,
  color: theme.colors.text,
  marginBottom: 8,
};

const bodyStyle = {
  fontSize: theme.font.sizes.body,
  color: theme.colors.textMuted,
  marginBottom: 20,
  lineHeight: 1.4,
};

const buttonStyle = {
  background: theme.colors.accent,
  color: '#FFFFFF',
  border: 'none',
  borderRadius: theme.radius.md,
  padding: '12px 28px',
  fontSize: theme.font.sizes.body,
  fontWeight: 600,
  fontFamily: 'inherit',
  cursor: 'pointer',
};
