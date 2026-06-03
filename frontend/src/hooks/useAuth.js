// useAuth: manages the user's authentication state.
// Restores the session on mount, exposes login/logout, and persists across reloads.

import { useState, useEffect, useCallback } from 'react';
import { signIn as signInApi, completeNewPassword, restoreSession, signOut as signOutApi } from '../auth';

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

  return {
    idToken,
    email: cognitoUser?.getUsername?.() || null,
    isAuthenticated: !!idToken,
    initializing,
    signIn,
    submitNewPassword,
    signOut,
  };
}
