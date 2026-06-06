// Native platform setup. Imports are dynamic so the web build doesn't pull
// in the Capacitor runtime, and so this whole module is a no-op outside of
// the native iOS/Android shells.

import { Capacitor } from '@capacitor/core';

export async function setupNative() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    // Our top AppHeader is dark navy on every screen, so the system clock,
    // battery, and signal icons need to render in light/white text.
    await StatusBar.setStyle({ style: Style.Light });
  } catch (e) {
    console.warn('StatusBar setup skipped:', e);
  }

  try {
    const { Keyboard, KeyboardResize } = await import('@capacitor/keyboard');
    // Resize the WebView when the keyboard opens so the keyboard doesn't sit
    // over inputs (the Add Student form opens from the top so this matters
    // less, but bulk grant sheets and others still benefit).
    await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
  } catch (e) {
    console.warn('Keyboard setup skipped:', e);
  }

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    // launchAutoHide is false in capacitor.config.json so we control the
    // dismissal here, right after the WebView and our setup are ready. No
    // flicker between splash and app content.
    await SplashScreen.hide({ fadeOutDuration: 250 });
  } catch (e) {
    console.warn('SplashScreen.hide skipped:', e);
  }
}
