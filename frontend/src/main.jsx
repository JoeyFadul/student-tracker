import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { setupNative } from './native';
import { hydrate as hydrateSecureStorage } from './lib/secureStorage';
import './index.css';

// Path-based routing for two standalone legal pages that have to be
// reachable by App Store reviewers (and anyone with the URL) without
// signing in. CloudFront falls back to /index.html on 404, so a direct
// visit to /privacy lands here, this picks the right component, and
// react-markdown renders it. Both components are dynamically imported so
// the legal pages are their own bundle chunks — no impact on app load.
function pickRoot(pathname) {
  const p = pathname.replace(/\/+$/, '').toLowerCase();
  if (p === '/privacy') {
    return import('./legal/PrivacyPolicy').then(m => <m.PrivacyPolicy />);
  }
  if (p === '/terms') {
    return import('./legal/TermsOfService').then(m => <m.TermsOfService />);
  }
  return null;
}

async function boot() {
  await hydrateSecureStorage();
  setupNative();

  // Skip the React app entirely on the legal routes — they don't need
  // auth, the tab bar, or any of the app shell.
  const legal = await pickRoot(window.location.pathname);
  const root = legal ?? <App />;

  createRoot(document.getElementById('root')).render(
    <StrictMode>{root}</StrictMode>
  );
}

boot();
