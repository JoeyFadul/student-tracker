// Native platform setup. Imports are dynamic so the web build doesn't pull
// in the Capacitor runtime, and so this whole module is a no-op outside of
// the native iOS/Android shells.

import { Capacitor } from '@capacitor/core';
import { installFocusScroll, scrollFocusedIntoView } from './lib/keyboardScroll';

export async function setupNative() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    // Headers are a gunmetal band (Gunmetal & Coral), so the system clock,
    // battery, and signal icons render in white. Style.Dark = "dark
    // background" = light text.
    await StatusBar.setStyle({ style: Style.Dark });
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
      // Body padding (index.css) grows with --kb-height, giving full-page
      // forms room to scroll; rAF lets that reflow land before we lift the
      // focused field above the keyboard.
      requestAnimationFrame(() => scrollFocusedIntoView());
    });
    Keyboard.addListener('keyboardWillHide', () => {
      document.documentElement.style.setProperty('--kb-height', '0px');
    });

    // Focus moving between fields while the keyboard stays open doesn't refire
    // keyboardWillShow, so keep the focused field visible on those changes too.
    installFocusScroll();
  } catch (e) {
    console.warn('Keyboard setup skipped:', e);
  }

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    // launchAutoHide is false in capacitor.config.json so we control the
    // dismissal here. Hold the splash a bit after the bundle is ready so
    // the auth restore + initial fetches have a chance to land — without
    // this delay the splash hides before the dashboard data is in, and
    // the user sees a brief Loading… state.
    await new Promise(resolve => setTimeout(resolve, 1500));
    await SplashScreen.hide({ fadeOutDuration: 350 });
  } catch (e) {
    console.warn('SplashScreen.hide skipped:', e);
  }
}
