import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { setupNative } from './native';
import { hydrate as hydrateSecureStorage } from './lib/secureStorage';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
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
    <StrictMode>
      <ErrorBoundary>{root}</ErrorBoundary>
    </StrictMode>
  );
}

// If boot itself fails, React never mounts — and on native the splash screen
// never auto-hides (launchAutoHide is false), so without this handler the
// user is stuck on the splash forever. Hide it and show a bare-DOM fallback
// that doesn't depend on React having loaded.
boot().catch(async (err) => {
  console.error('Boot failed:', err);
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide({ fadeOutDuration: 0 });
  } catch { /* web, or plugin unavailable — nothing to hide */ }

  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:#FAFAFA;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Inter',system-ui,sans-serif;text-align:center;">
        <div>
          <div style="font-size:20px;font-weight:700;color:#18181B;margin-bottom:8px;">Something went wrong</div>
          <div style="font-size:15px;color:#6B7280;margin-bottom:20px;">The app couldn't start. Please try again.</div>
          <button id="boot-retry" style="background:#E05B35;color:#fff;border:none;border-radius:12px;padding:12px 28px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;">Reload</button>
        </div>
      </div>`;
    document.getElementById('boot-retry')?.addEventListener('click', () => window.location.reload());
  }
});
