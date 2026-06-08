import { Capacitor } from '@capacitor/core';

// Opens an external URL. On native iOS the WebView's origin is
// capacitor://localhost, so window.open of an https URL either no-ops or
// tries to navigate the app itself — Capacitor's Browser plugin opens it
// in SFSafariViewController instead, which is the expected iOS behavior.
// On the web we fall back to a plain new-tab window.open. The plugin is
// dynamically imported so it doesn't get bundled into the web build.
export async function openUrl(url) {
  if (Capacitor.isNativePlatform()) {
    try {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url });
      return;
    } catch (e) {
      console.warn('Capacitor Browser open failed, falling back to window.open:', e);
    }
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}
