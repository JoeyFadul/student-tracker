# Well Done — Design System

**Well Done** (welldonestudent.com; App Store "Well Done Student") is a classroom positive-behavior tracker for elementary (K–5) teachers. Teachers award points to students with a tap, attach a reason ("Kindness", "Effort", …), and review per-student history and classroom trends. The core loop: **see roster → pick student(s) → award points with a reason → move on in under five seconds** — mid-lesson, one-handed, on a phone. Points reset each school year; past years stay as read-only archives. Students never log in; nothing is student-facing.

One product, one surface: an iOS app (Capacitor wrapping a React 18 + Vite SPA) that also runs as a web app. Portrait, iPhone-focused, max content width 720px.

## Sources
- Codebase: mounted local folder `student-tracker/` (frontend at `frontend/src`; all styling inline-JS from `frontend/src/theme.js` + tokens in `frontend/src/index.css`)
- GitHub: https://github.com/JoeyFadul/student-tracker — explore it for deeper context (docs/requirements/*.md are excellent, esp. `09-design-language.md` and `14-design-direction.md`)
- Design direction: "Clean Craft" (doc 14, revised 2026-07-18) with wireframes at `docs/design/wireframes-2.0.html`

## CONTENT FUNDAMENTALS
- **Voice: calm, plain, teacher-to-teacher.** Short sentences, no exclamation marks in UI chrome. Feature copy is benefit-first: "Recognize positive behavior in seconds."
- **Sentence case everywhere** — titles, buttons, labels: "Class dashboard", "Add student", "No active school year". ALL-CAPS only for tiny eyebrow/label text (11–13px, letterspaced): "POINTS EARNED", "TOTAL POINTS".
- **Second person, direct**: "your students", "Made a mistake? Undo from the toast." Never "we" in-app; marketing copy may use "We collect what we need…".
- **Positive-first vocabulary**: "Award", "Recognize", "Well done". Revoking exists but is deliberately secondary. Preset reasons: Kindness, Effort, Helping, Homework, Participation, Listening, Cleanup, Teamwork.
- **Emoji is data, not decoration** (doc 14 §7): emoji appears only as student avatars (default 🌱). All UI iconography is lucide line icons; buttons/reasons/rows are text-only.
- **Numbers are the heroes**: point totals render huge (56–64px, weight 800, rounded display face); copy around them stays small and muted.
- Ellipsis character "…" in placeholders ("Search students…", "Type a reason…"); middle dots "·" as separators ("2025–2026 · 24 students").

## VISUAL FOUNDATIONS
- **Palette: "Gunmetal & Coral"** (user-chosen, 2026-07: coolors.co/palette/2d3142-bfc0c0-ffffff-ef8354-4f5d75). All five colors do structural work: white `#FFFFFF` canvas + cards; silver `#BFC0C0` derives every neutral (fills `#ECEDEE`, hairlines `#DDDEE0`); **gunmetal `#2D3142` is chrome** — headers, tab bar, stats hero, "Owner" chips (dark chrome returns, deliberately); slate `#4F5D75` = secondary text, solid secondary buttons, revoke/negative; coral `#EF8354` strictly for actions, points, streaks, FAB. Honey and sage are retired — the palette contains no yellow/green, so **positive = coral, negative/secondary = slate**, and only destructive deletes use the derived red `#B8432D`. (Supersedes "Clean Craft" terracotta and the earlier Slate & Coral pass.)
- **Dark mode is system-follow**: the gunmetal chrome becomes the whole canvas (`#232734` bg, `#2D3142` surfaces, `#BFC0C0` muted text), coral unchanged. Token pairs live in `tokens/colors.css` under `prefers-color-scheme`.
- **Type**: default system sans; display face is `ui-rounded` where available for screen titles, big numerals, buttons. Scale 11/13/15/17/20/24/28/34/56. Hero numbers 56–64px, weight 800, tracking −0.04em — the visual signature.
- **Shape**: squircle everything. Radii 8/12/16/20/pill; sheets 24. Avatars ~38% radius (e.g. 120px avatar → 32px radius). Cards: white, 1px `--wd-border` hairline + subtle neutral shadow — bordered surfaces, not floating shadow-heavy tiles.
- **Shadows**: layered soft neutral-ink shadows (see `tokens/shape.css`); the FAB alone gets a coral glow (`--wd-shadow-fab`).
- **Spacing**: 4/8/12/16/20/24/32. Screen padding 16px; content max-width 720px centered.
- **Headers**: gunmetal band, sticky, flat with square corners and compact padding (revised 2026-07-18 — the chrome must not eat the screen); white title (24px, weight 800, display face), silver subtitle. The tab bar mirrors it (gunmetal frosted thin strip, 48px, 22px icons, square corners, coral active / silver inactive; on device it keeps only `max(inset − 20px, 0)` of safe area below the row and nudges content down `min(inset, 8px)` so the block centers optically in the visible strip) so dark chrome bookends the white canvas.
- **Backgrounds**: flat token colors only. No gradients, no textures, no illustrations, no background imagery anywhere.
- **Animation**: press = scale(0.97) via `usePressable` (transform 0.1s ease) on nearly every tappable element. Entrances: fade + small translate/scale with springy ease `cubic-bezier(0.16,1,0.3,1)`, 180–220ms. Skeleton shimmer for loading lists; spinners only inside busy controls. Celebration restraint: no confetti storms.
- **Hover** is secondary (touch-first app): photo overlays fade in, links deepen to `--wd-accent-dark`. No hover-darkening system on buttons.
- **Transparency/blur**: one place only — the tab bar (`rgba(255,255,255,0.92)` + `saturate(180%) blur(20px)`, hairline top border).
- **Tap targets** ≥44px; grant buttons 56px tall. Toasts are card-styled, bottom-center, with Undo action.
- **Imagery**: student photos only (square, object-fit cover, squircle-masked). Warm honey-soft emoji fallback tiles. No stock imagery.

## ICONOGRAPHY
- **Icon system: lucide** (lucide-react in the app), stroke icons, strokeWidth 2 (2.4 active tab, 2.5 emphasis), sizes 12–26.
- Tab bar icons: Users (Students), BarChart3 (Stats), Settings (Settings). Other recurring glyphs: Flame (streak), Plus/Minus (award/revoke), Check, ChevronRight/Down/Left, Search, ArrowUpDown, X, Camera, MoreHorizontal, LogOut, TrendingUp, Loader2.
- In this kit: `components/icons/Icon.jsx` inlines the lucide path data actually used (same 24×24 viewBox, stroke-based). For anything else, load lucide from CDN — match stroke style.
- No icon font, no PNG icons. Emoji only as student-avatar data. `assets/icons.svg` is the app's public sprite; `assets/favicon.svg` and `assets/app-icon.png` (white star on coral, regenerated for Slate & Coral) are the marks. Splash screens: `assets/splash.png` (light) and `assets/splash-dark.png` (gunmetal), star-grid motif, no wordmark. Originals as provided by the owner live in `uploads/`.
- **Logo**: the star app icon is the only mark. There is no wordmark file — render "Well Done" in the rounded display face where a wordmark would go.

## Fonts caveat
By owner decision (2026-07), the system uses the default platform sans — no webfonts, nothing to upload. `--wd-font-body` is the native system stack; `--wd-font-display` prefers `ui-rounded` (rounded numerals on Apple devices) and degrades to the same sans elsewhere. If a consistent cross-platform rounded display face is ever wanted, **Nunito** (Google Fonts) is the nearest match.

## Index
- `styles.css` → `tokens/` (colors, typography, shape, base)
- `assets/` — favicon.svg, icons.svg, app-icon.png, splash.png, splash-dark.png
- `guidelines/` — foundation specimen cards
- `components/` — reusable primitives (source of truth: `frontend/src/components/ui/`)
  - `actions/` Button, IconButton, Fab · `forms/` Input, Textarea, Select, SearchBar · `display/` Card, Chip, Avatar, EmptyState, ErrorBanner, Skeleton · `overlays/` Sheet, Toast · `navigation/` AppHeader, TabBar · `icons/` Icon
- `ui_kits/app/` — interactive recreation of the app (Dashboard, Student profile, Award flow, Stats, Settings)
- `templates/` — (none yet)
- `SKILL.md` — agent skill entry point

### Intentional additions
- `Icon` — wrapper inlining the lucide glyphs the app uses (the app imports lucide-react, which can't ship here).
- `Fab` — extracted from `AddStudentButton` (app hard-codes it per-screen); same 56px orange-glow circle.

### Omissions
- `ErrorBoundary`, `PullIndicator`, `FullPageMessage`, `ConfirmDialog`, `CustomAmountSheet`, `Modal` — logic-heavy or trivial compositions of `Sheet`/`Button`; recreate in-situ from the patterns here. No tier/reward UI (intentionally disabled in product).
