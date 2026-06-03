// LoginScreen: handles both standard sign-in and the first-time password change flow.
// All Cognito interaction is delegated to the useAuth hook.

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ErrorBanner } from '../ui/ErrorBanner';

export function LoginScreen({ onSignIn, onSubmitNewPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pendingUser, setPendingUser] = useState(null); // set when forced password change is needed
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const result = await onSignIn(email, password);
      if (result.type === 'newPasswordRequired') {
        setPendingUser(result.user);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await onSubmitNewPassword(pendingUser, newPassword);
    } catch (err) {
      setError(err.message || 'Password change failed');
      setBusy(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Well Done</h1>
        <p style={subtitleStyle}>Sign in to your classroom</p>

        {pendingUser ? (
          <form onSubmit={handlePasswordChange}>
            <p style={hintStyle}>Set a new password to continue.</p>
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={busy} fullWidth>
              {busy ? 'Setting…' : 'Set password & sign in'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignIn}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={busy} fullWidth>
              {busy ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        )}

        <ErrorBanner message={error} onDismiss={() => setError('')} />
      </div>
    </div>
  );
}

const containerStyle = {
  minHeight: '100vh',
  background: '#F4F5F7',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif',
};

const cardStyle = {
  width: '100%',
  maxWidth: 380,
  background: '#FFFFFF',
  padding: 32,
  borderRadius: 24,
  boxShadow: '0 2px 8px rgba(28, 25, 23, 0.06), 0 1px 2px rgba(28, 25, 23, 0.04)',
};

const titleStyle = {
  fontSize: 32,
  fontWeight: 700,
  color: '#1c1917',
  margin: '0 0 4px',
  letterSpacing: '-0.02em',
};

const subtitleStyle = {
  fontSize: 15,
  color: '#78716C',
  margin: '0 0 24px',
};

const hintStyle = {
  fontSize: 14,
  color: '#78716C',
  marginBottom: 14,
};
