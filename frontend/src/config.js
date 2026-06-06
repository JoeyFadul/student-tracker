// Centralized config: environment variables and Cognito user pool singleton.
// Importing from here ensures we never re-read process.env at runtime.

import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { cognitoStorage } from './lib/secureStorage';

export const API_URL = import.meta.env.VITE_API_URL;
export const USER_POOL_ID = import.meta.env.VITE_USER_POOL_ID;
export const USER_POOL_CLIENT_ID = import.meta.env.VITE_USER_POOL_CLIENT_ID;

// Sanity check at startup — fail fast with a clear message if env vars are missing
if (!API_URL || !USER_POOL_ID || !USER_POOL_CLIENT_ID) {
  console.error('Missing required env vars:', { API_URL, USER_POOL_ID, USER_POOL_CLIENT_ID });
  throw new Error('Missing required VITE_* environment variables. Check your .env file.');
}

// Storage routes Cognito's id/access/refresh tokens to iOS Keychain on native,
// localStorage on the web. main.jsx awaits hydrate() before this module's
// consumers (useAuth) read from the pool, so reads here are always sync.
export const userPool = new CognitoUserPool({
  UserPoolId: USER_POOL_ID,
  ClientId: USER_POOL_CLIENT_ID,
  Storage: cognitoStorage,
});
