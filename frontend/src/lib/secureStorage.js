// Cognito IStorage adapter backed by iOS Keychain / Android Keystore on
// native, and localStorage on the web.
//
// amazon-cognito-identity-js requires a synchronous IStorage (getItem/setItem/
// removeItem/clear), but every Capacitor plugin is async. We bridge the gap
// with an in-memory cache that is:
//   - hydrated from native secure storage once at app boot (must be awaited
//     before React mounts so useAuth.restoreSession sees the existing tokens),
//   - read synchronously by Cognito after that,
//   - flushed back to native storage on every write, fire-and-forget.
//
// Failure mode: if the app is killed within milliseconds of a write, the
// in-memory value is lost. Worst case the user signs in again — no security
// regression vs. the current localStorage setup.

import { Capacitor } from '@capacitor/core';

const cache = new Map();
let hydrated = !Capacitor.isNativePlatform();

export async function hydrate() {
  if (hydrated) return;
  let plugin = null;
  try {
    plugin = (await import('capacitor-secure-storage-plugin')).SecureStoragePlugin;
    const { value: keys } = await plugin.keys();
    for (const key of keys) {
      try {
        const { value } = await plugin.get({ key });
        cache.set(key, value);
      } catch {
        // Key disappeared between keys() and get(), or value missing — ignore.
      }
    }
  } catch (e) {
    // First-run with no stored keys, or plugin unavailable. Safe to continue
    // with an empty cache; the user will simply be asked to sign in.
    console.warn('Secure storage hydrate skipped:', e);
  }

  // One-time migration: if Keychain is empty but localStorage still holds the
  // Cognito tokens written by an older build (before this module was wired up
  // correctly), copy them over so the user stays signed in across the upgrade.
  if (plugin && cache.size === 0) {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('CognitoIdentityServiceProvider.')) {
          const v = localStorage.getItem(k);
          if (v != null) {
            cache.set(k, v);
            plugin.set({ key: k, value: v }).catch(() => {});
          }
        }
      }
    } catch {
      // localStorage unavailable (private mode etc.) — no migration possible.
    }
  }

  hydrated = true;
}

async function flushSet(key, value) {
  const { SecureStoragePlugin } = await import('capacitor-secure-storage-plugin');
  await SecureStoragePlugin.set({ key, value });
}

async function flushRemove(key) {
  const { SecureStoragePlugin } = await import('capacitor-secure-storage-plugin');
  try { await SecureStoragePlugin.remove({ key }); } catch { /* already gone */ }
}

const nativeStorage = {
  getItem(key) {
    return cache.has(key) ? cache.get(key) : null;
  },
  setItem(key, value) {
    cache.set(key, value);
    flushSet(key, value).catch(e => console.warn('Secure storage write failed:', e));
  },
  removeItem(key) {
    cache.delete(key);
    flushRemove(key).catch(e => console.warn('Secure storage remove failed:', e));
  },
  clear() {
    // Only wipe keys we know about so we never trample unrelated entries.
    const keys = [...cache.keys()];
    cache.clear();
    Promise.all(keys.map(flushRemove)).catch(() => {});
  },
};

const webStorage = {
  getItem(key) { return localStorage.getItem(key); },
  setItem(key, value) { localStorage.setItem(key, value); },
  removeItem(key) { localStorage.removeItem(key); },
  // amazon-cognito-identity-js only iterates its own known keys in signOut and
  // never calls clear(), so a no-op here is safe — and avoids wiping unrelated
  // localStorage entries.
  clear() {},
};

export const cognitoStorage = Capacitor.isNativePlatform() ? nativeStorage : webStorage;
