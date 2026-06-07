// useAuth: manages the user's authentication state.
// Restores the session on mount, exposes login/logout, and persists across reloads.

import { useState, useEffect, useCallback } from 'react';
import {
  signIn as signInApi,
  completeNewPassword,
  restoreSession,
  signOut as signOutApi,
  signUp as signUpApi,
  confirmSignUp as confirmSignUpApi,
  resendCode as resendCodeApi,
} from '../auth';

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
    setIdToken(null);
    setCognitoUser(null);
  }, [cognitoUser]);

  // Signup → emails a code. Caller advances to a verify step.
  const signUp = useCallback((email, password) => signUpApi(email, password), []);

  // Confirms the account. Caller is expected to immediately call signIn()
  // with the same credentials so the user is dropped straight into the app.
  const confirmSignUp = useCallback((email, code) => confirmSignUpApi(email, code), []);

  const resendCode = useCallback((email) => resendCodeApi(email), []);

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
  };
}
