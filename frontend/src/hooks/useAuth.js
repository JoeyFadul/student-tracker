// useAuth: manages the user's authentication state.
// Restores the session on mount, exposes login/logout, and persists across reloads.

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  signIn as signInApi,
  completeNewPassword,
  restoreSession,
  signOut as signOutApi,
  signUp as signUpApi,
  confirmSignUp as confirmSignUpApi,
  resendCode as resendCodeApi,
  forgotPassword as forgotPasswordApi,
  confirmForgotPassword as confirmForgotPasswordApi,
  deleteCognitoUser,
} from '../auth';

// JWT exp is seconds-since-epoch; we use milliseconds throughout the hook.
// Returns the expiry timestamp in ms, or null if the token can't be decoded.
function getTokenExpMs(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

// Refresh 5 minutes before expiry, but never schedule sooner than 5 seconds
// or later than the actual exp. Also the threshold for the foreground-resume
// check below — if we're within this window of expiry on resume, refresh now.
const REFRESH_LEAD_MS = 5 * 60 * 1000;

// User-scoped state (currently just the remembered active classroom id) lives
// in localStorage under a wd: prefix. Cognito's signOut clears its own token
// keys but knows nothing about ours, so without this sweep the next account to
// sign in would inherit the previous user's active classroom and fire a 403.
function clearLocalUserState() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith('wd:')) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
  } catch { /* storage unavailable (private mode, quota) — nothing to clean */ }
}

export function useAuth() {
  const [idToken, setIdToken] = useState(null);
  const [cognitoUser, setCognitoUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On mount, try to restore a previous session from localStorage
  useEffect(() => {
    restoreSession()
      .then(result => {
        if (result) {
          setIdToken(result.token);
          setCognitoUser(result.user);
        }
      })
      .finally(() => setInitializing(false));
  }, []);

  const handleLoginSuccess = useCallback((token, user) => {
    setIdToken(token);
    setCognitoUser(user);
  }, []);

  const signIn = useCallback(async (email, password) => {
    const result = await signInApi(email, password);
    if (result.type === 'success') {
      handleLoginSuccess(result.token, result.user);
    }
    return result; // caller handles newPasswordRequired
  }, [handleLoginSuccess]);

  const submitNewPassword = useCallback(async (user, newPassword) => {
    const { token } = await completeNewPassword(user, newPassword);
    handleLoginSuccess(token, user);
  }, [handleLoginSuccess]);

  const signOut = useCallback(() => {
    signOutApi(cognitoUser);
    clearLocalUserState();
    setIdToken(null);
    setCognitoUser(null);
  }, [cognitoUser]);

  // Single in-flight refresh promise so a timer-fire and a visibilitychange
  // landing on the same window don't double-call getSession().
  const refreshInFlight = useRef(null);
  const refreshSession = useCallback(() => {
    if (!cognitoUser) return Promise.resolve(null);
    if (refreshInFlight.current) return refreshInFlight.current;
    refreshInFlight.current = new Promise((resolve) => {
      cognitoUser.getSession((err, session) => {
        refreshInFlight.current = null;
        if (err || !session?.isValid?.()) {
          // Refresh token itself is no longer valid — kick the user to the
          // login screen rather than leaving them stuck on 401s.
          signOutApi(cognitoUser);
          clearLocalUserState();
          setIdToken(null);
          setCognitoUser(null);
          resolve(null);
          return;
        }
        const fresh = session.getIdToken().getJwtToken();
        setIdToken(fresh);
        resolve(fresh);
      });
    });
    return refreshInFlight.current;
  }, [cognitoUser]);

  // Proactive timer: fire a refresh 5 minutes before the current token's
  // exp. On iOS the timer can be suspended while the app is backgrounded;
  // the visibilitychange effect below covers the resume path.
  useEffect(() => {
    if (!idToken) return;
    const expMs = getTokenExpMs(idToken);
    if (!expMs) return;
    const delay = Math.max(5_000, expMs - Date.now() - REFRESH_LEAD_MS);
    const t = setTimeout(refreshSession, delay);
    return () => clearTimeout(t);
  }, [idToken, refreshSession]);

  // Foreground-resume: when the document becomes visible again, refresh if
  // the current token will expire within the lead window. visibilitychange
  // fires both on web tab focus and on iOS WKWebView resume from background.
  useEffect(() => {
    if (!idToken) return;
    const onVisible = () => {
      if (document.hidden) return;
      const expMs = getTokenExpMs(idToken);
      if (!expMs) return;
      if (expMs - Date.now() < REFRESH_LEAD_MS) refreshSession();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [idToken, refreshSession]);

  // Signup → emails a code. Caller advances to a verify step.
  const signUp = useCallback((email, password) => signUpApi(email, password), []);

  // Confirms the account. Caller is expected to immediately call signIn()
  // with the same credentials so the user is dropped straight into the app.
  const confirmSignUp = useCallback((email, code) => confirmSignUpApi(email, code), []);

  const resendCode = useCallback((email) => resendCodeApi(email), []);

  const forgotPassword = useCallback((email) => forgotPasswordApi(email), []);

  const confirmForgotPassword = useCallback(
    (email, code, newPassword) => confirmForgotPasswordApi(email, code, newPassword),
    []
  );

  // Two-step account deletion: 1) backend tears down every classroom this
  // user owns and detaches them from any they joined as a member; 2) the
  // Cognito identity is removed. Caller passes the api client because the
  // hook can't know it on its own. On success, local auth state clears so
  // the app falls back to the login screen.
  const deleteAccount = useCallback(async (api) => {
    if (api) await api.deleteAccount();
    await deleteCognitoUser(cognitoUser);
    clearLocalUserState();
    setIdToken(null);
    setCognitoUser(null);
  }, [cognitoUser]);

  return {
    idToken,
    email: cognitoUser?.getUsername?.() || null,
    isAuthenticated: !!idToken,
    initializing,
    signIn,
    submitNewPassword,
    signOut,
    signUp,
    confirmSignUp,
    resendCode,
    forgotPassword,
    confirmForgotPassword,
    deleteAccount,
  };
}
