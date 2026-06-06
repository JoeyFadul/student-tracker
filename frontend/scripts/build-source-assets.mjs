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

// Navy from theme.colors.headerDark; a warm gold/amber for the star.
// Gold is chosen over the theme accent orange because "gold star" is the
// universal teacher-reward symbol — using #FBBF24 (modern amber-400) keeps
// the tone classic but reads cleanly against the navy.
const NAVY = '#0E1729';
const GOLD = '#FBBF24';
const WHITE = '#FFFFFF';

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif';

// SVG path for a regular n-pointed star centered at (cx, cy) with the top
// point at angle -90°. innerR / outerR ≈ 0.382 gives the classic 5-point
// silhouette (golden-ratio proportions).
function starPath(cx, cy, outerR, innerR = outerR * 0.382, points = 5) {
  const step = Math.PI / points;
  const start = -Math.PI / 2;
  const cmds = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = start + i * step;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    cmds.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  cmds.push('Z');
  return cmds.join(' ');
}

const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="${NAVY}"/>
  <path d="${starPath(512, 540, 380)}" fill="${GOLD}"/>
</svg>
`;

// Splash is 2732x2732 (Capacitor's recommended source size — iOS crops the
// center to fit any device aspect). Star sits above center so the wordmark
// has room beneath.
const splashSvg = `
<svg width="2732" height="2732" viewBox="0 0 2732 2732" xmlns="http://www.w3.org/2000/svg">
  <rect width="2732" height="2732" fill="${NAVY}"/>
  <path d="${starPath(1366, 1220, 440)}" fill="${GOLD}"/>
  <text x="1366" y="1820"
        font-family='${FONT}' font-size="120" font-weight="600"
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
