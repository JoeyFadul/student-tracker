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

const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="${NAVY}"/>
  <circle cx="512" cy="512" r="300" stroke="${ACCENT}" stroke-width="14" fill="none" opacity="0.55"/>
  <path d="M 360 540 L 470 660 L 690 380"
        stroke="${WHITE}" stroke-width="74" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>
`;

// Splash is 2732x2732 (Capacitor's recommended source size — iOS crops the
// center to fit any device aspect). Mark sits above center so the wordmark
// fits cleanly underneath.
const splashSvg = `
<svg width="2732" height="2732" viewBox="0 0 2732 2732" xmlns="http://www.w3.org/2000/svg">
  <rect width="2732" height="2732" fill="${NAVY}"/>
  <g transform="translate(1366, 1240)">
    <circle r="280" stroke="${ACCENT}" stroke-width="13" fill="none" opacity="0.55"/>
    <path d="M -130 30 L -25 145 L 195 -115"
          stroke="${WHITE}" stroke-width="60" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <text x="1366" y="1750" font-family="-apple-system, system-ui, sans-serif"
        font-size="116" font-weight="600" fill="${WHITE}" text-anchor="middle"
        letter-spacing="-2">Well Done</text>
</svg>
`;

await mkdir(OUT_DIR, { recursive: true });

await sharp(Buffer.from(iconSvg)).png().toFile(resolve(OUT_DIR, 'icon-only.png'));
await sharp(Buffer.from(splashSvg)).png().toFile(resolve(OUT_DIR, 'splash.png'));
// Dark splash variant — same image, since the design already lives on a dark
// background. iOS uses splash-dark.png in dark mode contexts.
await sharp(Buffer.from(splashSvg)).png().toFile(resolve(OUT_DIR, 'splash-dark.png'));

console.log('Wrote', OUT_DIR);
