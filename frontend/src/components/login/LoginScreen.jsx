// LoginScreen: signin / signup / verify / forgot / forgotConfirm flows.
// All modes share the same card chrome so the visual stays steady — only
// the form swaps.
//
//   signin        → email + password → onSignIn(). Forced-password-change
//                   branch is preserved from the legacy admin-create flow.
//   signup        → email + password + confirm → onSignUp() emails a
//                   6-digit code, then mode advances to verify.
//   verify        → code input → onConfirmSignUp() then auto-onSignIn()
//                   using the password we still hold in state.
//   forgot        → email → onForgotPassword() emails a 6-digit code,
//                   then mode advances to forgotConfirm.
//   forgotConfirm → code + new password → onConfirmForgotPassword() then
//                   auto-onSignIn() with the new password.

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ErrorBanner } from '../ui/ErrorBanner';

export function LoginScreen({
  onSignIn,
  onSubmitNewPassword,
  onSignUp,
  onConfirmSignUp,
  onResendCode,
  onForgotPassword,
  onConfirmForgotPassword,
}) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'verify' | 'forgot' | 'forgotConfirm'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingUser, setPendingUser] = useState(null);
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const flipTo = (next) => {
    setMode(next);
    setError(''); setInfo('');
    setCode('');
    if (next === 'signup') setConfirmPassword('');
    if (next === 'forgot' || next === 'signin') setNewPassword('');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const result = await onSignIn(email, password);
      if (result.type === 'newPasswordRequired') {
        setPendingUser(result.user);
      }
    } catch (err) {
      // Signed up but never entered the code (e.g. quit the app first) —
      // Cognito refuses to authenticate until the email is confirmed.
      // Send a fresh code and route them to the verify step instead of
      // dead-ending on the error banner.
      if (err.code === 'UserNotConfirmedException') {
        try { await onResendCode(email); } catch { /* verify screen has its own Resend */ }
        flipTo('verify');
        setInfo(`Your email isn't verified yet. We sent a new 6-digit code to ${email}.`);
      } else {
        setError(err.message || 'Sign in failed');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setBusy(true);
    try {
      await onSignUp(email, password);
      setMode('verify');
      setInfo(`We emailed a 6-digit code to ${email}.`);
    } catch (err) {
      setError(err.message || 'Sign up failed');
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await onConfirmSignUp(email, code.trim());
      // Auto-sign-in using the password still in state so the user lands
      // on the onboarding screen instead of having to type credentials
      // again immediately after verifying.
      await onSignIn(email, password);
    } catch (err) {
      setError(err.message || 'Verification failed');
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

  const handleResend = async () => {
    setError(''); setInfo('');
    try {
      await onResendCode(email);
      setInfo('A new code is on its way.');
    } catch (err) {
      setError(err.message || 'Resend failed');
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    setBusy(true);
    try {
      await onForgotPassword(email);
      setMode('forgotConfirm');
      setInfo(`We emailed a 6-digit code to ${email}.`);
    } catch (err) {
      setError(err.message || 'Could not start password reset');
    } finally {
      setBusy(false);
    }
  };

  const handleForgotConfirm = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await onConfirmForgotPassword(email, code.trim(), newPassword);
      // Drop them straight into the app with the brand-new password so
      // they don't have to re-type it on the signin screen.
      await onSignIn(email, newPassword);
    } catch (err) {
      setError(err.message || 'Could not reset password');
      setBusy(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Well Done</h1>
        <p style={subtitleStyle}>
          {mode === 'signin' && 'Sign in to your classroom'}
          {mode === 'signup' && 'Create your teacher account'}
          {mode === 'verify' && 'Verify your email'}
          {mode === 'forgot' && 'Reset your password'}
          {mode === 'forgotConfirm' && 'Enter your reset code'}
        </p>

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
        ) : mode === 'signin' ? (
          <form onSubmit={handleSignIn}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              autoCapitalize="off"
              autoCorrect="off"
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
            <div style={footerStyle}>
              <button type="button" onClick={() => flipTo('forgot')} style={linkStyle}>
                Forgot password?
              </button>
            </div>
            <div style={footerStyle}>
              New here?{' '}
              <button type="button" onClick={() => flipTo('signup')} style={linkStyle}>
                Create an account
              </button>
            </div>
          </form>
        ) : mode === 'signup' ? (
          <form onSubmit={handleSignUp}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              autoCapitalize="off"
              autoCorrect="off"
            />
            <Input
              type="password"
              placeholder="Password (12+ chars, mixed case, number, symbol)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={12}
            />
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={busy} fullWidth>
              {busy ? 'Creating…' : 'Create account'}
            </Button>
            <div style={footerStyle}>
              Already have an account?{' '}
              <button type="button" onClick={() => flipTo('signin')} style={linkStyle}>
                Sign in
              </button>
            </div>
          </form>
        ) : mode === 'verify' ? (
          <form onSubmit={handleVerify}>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              placeholder="6-digit code"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              autoFocus
            />
            <Button type="submit" disabled={busy || code.trim().length === 0} fullWidth>
              {busy ? 'Verifying…' : 'Verify & sign in'}
            </Button>
            <div style={footerStyle}>
              Didn't get the code?{' '}
              <button type="button" onClick={handleResend} style={linkStyle}>
                Resend
              </button>
            </div>
          </form>
        ) : mode === 'forgot' ? (
          <form onSubmit={handleForgot}>
            <p style={hintStyle}>Enter your email and we'll send a 6-digit code to reset your password.</p>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              autoCapitalize="off"
              autoCorrect="off"
            />
            <Button type="submit" disabled={busy || email.trim().length === 0} fullWidth>
              {busy ? 'Sending…' : 'Send reset code'}
            </Button>
            <div style={footerStyle}>
              <button type="button" onClick={() => flipTo('signin')} style={linkStyle}>
                Back to sign in
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotConfirm}>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              placeholder="6-digit code"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              autoFocus
            />
            <Input
              type="password"
              placeholder="New password (12+ chars, mixed case, number, symbol)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={12}
            />
            <Button type="submit" disabled={busy || code.trim().length === 0 || newPassword.length < 12} fullWidth>
              {busy ? 'Resetting…' : 'Reset & sign in'}
            </Button>
            <div style={footerStyle}>
              Didn't get the code?{' '}
              <button type="button" onClick={async () => {
                setError(''); setInfo('');
                try {
                  await onForgotPassword(email);
                  setInfo('A new code is on its way.');
                } catch (err) {
                  setError(err.message || 'Resend failed');
                }
              }} style={linkStyle}>
                Resend
              </button>
            </div>
          </form>
        )}

        {info && !error && <div style={infoStyle}>{info}</div>}
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

const footerStyle = {
  fontSize: 14,
  color: '#78716C',
  marginTop: 14,
  textAlign: 'center',
};

const linkStyle = {
  background: 'transparent',
  border: 'none',
  padding: 0,
  color: '#E4572E',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'inherit',
  textDecoration: 'underline',
};

const infoStyle = {
  marginTop: 12,
  padding: '10px 14px',
  background: '#ECEEF2',
  color: '#1C1917',
  borderRadius: 12,
  fontSize: 13,
};
