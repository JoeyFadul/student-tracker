# 14 · 2.0 Design Direction — "Warm Craft"

Chosen 2026-07-04 (with system-follow dark mode). Evolution, not
revolution: keep the warm terracotta identity teachers already know,
replace the dated parts (dark navy headers, three-mood inconsistency,
flat gray background) with a coherent warm-paper system.

**Wireframes:** [`docs/design/wireframes-2.0.html`](../design/wireframes-2.0.html)
— open in any browser. Six frames: Dashboard, Student Profile, Award
sheet, Stats, Settings, Dashboard (dark).

## Palette

### Light ("paper")

| Token | Value | Use |
|---|---|---|
| `bg` | `#FAF7F2` | App background — warm paper, replaces cool gray `#F4F5F7` |
| `surface` | `#FFFFFF` | Cards |
| `surfaceAlt` | `#F1ECE3` | Inputs, chips, secondary fills |
| `ink` | `#2A2521` | Primary text (warm near-black) |
| `inkMuted` / `inkFaint` | `#6E655C` / `#9C938A` | Secondary / tertiary text |
| `border` | `#EAE3D8` | Hairlines |
| `accent` | `#E05B35` (soft `#FBEAE2`, deep `#B94A2C`) | Terracotta — actions, points, FAB |
| `sage` | `#7A9E7E` (soft `#E7F0E7`) | Success, positive deltas |
| `honey` | `#F4C95D` (soft `#FBF3DE`) | Streaks, celebrations, stat highlights |
| `danger` | `#B3372B` (soft `#F7E3DF`) | Destructive — deeper than accent so they never read as the same red |

### Dark ("evening") — warm charcoal, not blue-black

| Token | Value |
|---|---|
| `bg` | `#1E1B17` |
| `surface` / `surfaceAlt` | `#2A2620` / `#353028` |
| `ink` / `inkMuted` | `#F5EFE7` / `#A89E92` |
| `accent` | `#F0714A` (brightened for contrast) |
| `sage` / `honey` | `#8FB694` / `#F6D174` |
| `border` | `rgba(245,239,231,0.08)` |

Implementation: `theme.js` becomes token pairs resolved by
`prefers-color-scheme` (CSS variables at `:root`, since styling is
inline-JS today — expose as `var(--ink)` etc. so dark mode needs no JS
re-render). The Phase-0 `navyCard` tokens are retired; **dark navy exits
the system entirely** — headers become light paper with large ink type.

## Typography & shape

- **Display: rounded.** `ui-rounded` (SF Pro Rounded on iOS) for big
  numerals, screen titles, and buttons — the single biggest "feels new"
  lever, and it suits an elementary app without being childish. Body
  stays SF Pro Text. Keep the existing size scale (doc 09).
- **Large-title headers**, iOS-style: title lives in the scroll content
  (big, ink-on-paper), collapsing to a compact bar on scroll. Replaces
  the fixed dark-navy header band.
- **Squircle everything**: avatars at ~38% radius, cards 20–24, primary
  buttons pill. Shadows get softer and singular (one shadow level per
  elevation, warm-tinted: `rgba(42,37,33,…)`).

## Signature patterns

1. **Tab bar: carried over from v1 unchanged.** The v1 bar already has
   the right treatment — full-width, frosted blur, hairline top border,
   active tab indicated by icon/label color alone (accent vs. muted),
   no filled highlight. Two alternatives were considered and rejected:
   a floating pill dock (fashion-over-function for a mid-lesson
   utility) and a tinted active-tab background (visual noise; Joey
   prefers the colorless treatment). Only change in 2.0: tokens come
   from the new palette, so the bar gets light/dark variants for free.
2. **Bento stats** — Stats rebuilds as a 2-column bento grid on light
   paper: big total card (honey), avg + on-streak tiles (sage), top
   reasons bars. Kills the last dark screen.
3. **Celebration restraint** — honey-colored micro-burst on streak
   milestones and grant confirmation; no confetti storms (positive-first,
   not toy-like — decisions B3/B4).
4. **Press feel** — keep `usePressable` scale, add spring easing and
   Capacitor haptics on grant commit.
5. **Attribution chips** (item 1.8) — tiny `inkFaint` initials chip on
   activity rows, multi-teacher rooms only.
6. **Photo-first avatars** with warm `honeySoft` emoji fallback tiles
   (replaces the old tier-tinted backgrounds).
7. **Emoji discipline** — emoji is *data, not decoration*: it appears
   only as student avatars (product content). All UI iconography is
   lucide line icons (tab bar, flame, camera, etc., as in v1); reason
   buttons, settings rows, chips, and buttons are text-only. Rationale:
   decorative emoji reads as clutter, renders inconsistently across OS
   versions, and teacher-typed custom reasons (item 1.5) would look
   broken next to emoji-prefixed presets.

## What this changes in the plan

- Phase 0.2's "one light theme" call is confirmed and extended: tokens
  become light/dark **pairs** from the start (decision: dark mode is
  system-follow in 2.0). Add dark-mode verification to the Phase 0 exit
  checklist for the kit components.
- Phase 1 screen rebuilds follow these wireframes; treat
  `wireframes-2.0.html` as the reference until higher-fidelity mockups
  exist.
- No new scope items — this restyles surfaces already being rebuilt.
