// Rasterizes inline SVGs into the source PNGs that @capacitor/assets reads
// from resources/. Run via `npm run assets:source`. Re-run any time you
// want to regenerate the placeholders (or swap in real artwork by replacing
// resources/icon-only.png and resources/splash.png directly).

import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'resources');

// Navy from theme.colors.headerDark; accent from theme.colors.accent.
const NAVY = '#0E1729';
const ACCENT = '#E4572E';
const WHITE = '#FFFFFF';

// Logo: an "A+" mark — universal symbol for top marks in school. The "A" is
// the volumetric anchor in white; the "+" sits at the upper-right shoulder
// in the accent orange so the composition reads as a single graded stamp.
const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif';

const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="${NAVY}"/>
  <text x="440" y="740"
        font-family='${FONT}' font-size="620" font-weight="800"
        fill="${WHITE}" text-anchor="middle">A</text>
  <text x="730" y="450"
        font-family='${FONT}' font-size="280" font-weight="800"
        fill="${ACCENT}" text-anchor="middle">+</text>
</svg>
`;

// Splash is 2732x2732 (Capacitor's recommended source size — iOS crops the
// center to fit any device aspect). Mark sits above center so the wordmark
// fits cleanly underneath.
const splashSvg = `
<svg width="2732" height="2732" viewBox="0 0 2732 2732" xmlns="http://www.w3.org/2000/svg">
  <rect width="2732" height="2732" fill="${NAVY}"/>
  <text x="1235" y="1420"
        font-family='${FONT}' font-size="720" font-weight="800"
        fill="${WHITE}" text-anchor="middle">A</text>
  <text x="1570" y="1080"
        font-family='${FONT}' font-size="320" font-weight="800"
        fill="${ACCENT}" text-anchor="middle">+</text>
  <text x="1366" y="1780"
        font-family='${FONT}' font-size="118" font-weight="600"
        fill="${WHITE}" text-anchor="middle" letter-spacing="-2">Well Done</text>
</svg>
`;

await mkdir(OUT_DIR, { recursive: true });

await sharp(Buffer.from(iconSvg)).png().toFile(resolve(OUT_DIR, 'icon-only.png'));
await sharp(Buffer.from(splashSvg)).png().toFile(resolve(OUT_DIR, 'splash.png'));
// Dark splash variant — same image, since the design already lives on a dark
// background. iOS uses splash-dark.png in dark mode contexts.
await sharp(Buffer.from(splashSvg)).png().toFile(resolve(OUT_DIR, 'splash-dark.png'));

console.log('Wrote', OUT_DIR);
