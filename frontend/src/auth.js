// Auth helpers. Wraps the Cognito SDK's callback API in promises so
// components can use async/await instead of nested callbacks.

import { CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { userPool } from './config';
import { cognitoStorage } from './lib/secureStorage';

// CognitoUser does NOT inherit storage from its Pool — it only honors a
// Storage passed directly in its constructor. Without this every new
// CognitoUser falls back to localStorage even when the Pool was configured
// with our Keychain-backed adapter.
const userOpts = (Username) => ({ Username, Pool: userPool, Storage: cognitoStorage });

/**
 * Create a new account. Cognito emails a 6-digit code; the account is
 * UNCONFIRMED until confirmSignUp() is called with that code.
 */
export function signUp(email, password) {
  return new Promise((resolve, reject) => {
    const attrs = [new CognitoUserAttribute({ Name: 'email', Value: email })];
    userPool.signUp(email, password, attrs, null, (err, result) => {
      if (err) return reject(err);
      resolve({ user: result.user, userConfirmed: result.userConfirmed });
    });
  });
}

/** Confirm an UNCONFIRMED account with the emailed code. */
export function confirmSignUp(email, code) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser(userOpts(email));
    user.confirmRegistration(code, true, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

/**
 * Permanently delete the currently-signed-in Cognito user. Caller must have
 * already cleaned up their server-side data — this only removes the
 * authentication record. Uses the access token in the existing session.
 */
export function deleteCognitoUser(user) {
  return new Promise((resolve, reject) => {
    if (!user) return resolve(null);
    user.deleteUser((err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

/** Re-send the confirmation code (e.g. if the original email got lost). */
export function resendCode(email) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser(userOpts(email));
    user.resendConfirmationCode((err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

/**
 * Sign in a user. Returns one of:
 *   { type: 'success', token, user }
 *   { type: 'newPasswordRequired', user }  // Forced password change
 * Throws on auth failure.
 */
export function signIn(email, password) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser(userOpts(email));
    const auth = new AuthenticationDetails({ Username: email, Password: password });

    user.authenticateUser(auth, {
      onSuccess: (session) => {
        resolve({ type: 'success', token: session.getIdToken().getJwtToken(), user });
      },
      onFailure: (err) => reject(err),
      newPasswordRequired: () => resolve({ type: 'newPasswordRequired', user }),
    });
  });
}

/**
 * Complete a forced password change (first-time login flow).
 * Takes the Cognito user from a `newPasswordRequired` result.
 */
export function completeNewPassword(user, newPassword) {
  return new Promise((resolve, reject) => {
    user.completeNewPasswordChallenge(newPassword, {}, {
      onSuccess: (session) => resolve({ token: session.getIdToken().getJwtToken(), user }),
      onFailure: (err) => reject(err),
    });
  });
}

/**
 * Restore a session from the previous browser visit, if one exists and is valid.
 * Returns { token, user } or null.
 */
export function restoreSession() {
  return new Promise((resolve) => {
    const user = userPool.getCurrentUser();
    if (!user) return resolve(null);

    user.getSession((err, session) => {
      if (err || !session.isValid()) return resolve(null);
      resolve({ token: session.getIdToken().getJwtToken(), user });
    });
  });
}

export function signOut(user) {
  if (user) user.signOut();
}
