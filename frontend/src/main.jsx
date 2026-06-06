import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { setupNative } from './native';
import { hydrate as hydrateSecureStorage } from './lib/secureStorage';
import './index.css';

// Hydrate the in-memory cache from native secure storage BEFORE mounting,
// otherwise useAuth.restoreSession will read an empty cache and force a
// re-login. On the web this resolves synchronously (no-op) — only the iOS
// native shell pays the ~50ms read cost.
async function boot() {
  await hydrateSecureStorage();
  setupNative();
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

boot();
