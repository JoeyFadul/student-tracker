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

    // Default value so CSS var() resolves before any keyboard event fires.
    document.documentElement.style.setProperty('--kb-height', '0px');

    // Native resize bakes the offset into the WebView frame but the
    // resize animation fires at keyboard-show-completion, ~1s after the
    // keyboard starts sliding in — feels choppy. Take manual control:
    // keep the WebView at full height and surface the keyboard height
    // as a CSS variable. keyboardWillShow fires at the START of the
    // iOS keyboard animation, so a CSS transition that matches iOS's
    // easing curve will run in sync with the keyboard.
    await Keyboard.setResizeMode({ mode: KeyboardResize.None });

    Keyboard.addListener('keyboardWillShow', (info) => {
      document.documentElement.style.setProperty('--kb-height', `${info.keyboardHeight}px`);
    });
    Keyboard.addListener('keyboardWillHide', () => {
      document.documentElement.style.setProperty('--kb-height', '0px');
    });
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
