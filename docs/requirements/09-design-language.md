# 09 · Design Language (as built)

Not a spec to preserve — a record of what exists so 2.0 changes are
deliberate. All styling is inline-JS from a single `theme.js`; there is no
CSS framework, no component library, and (almost) no global CSS.

## Palette

| Role | Value | Notes |
|---|---|---|
| App background | `#F4F5F7` | Cool light gray |
| Surface / cards | `#FFFFFF` + soft shadows | Borderless cards, radius 16–20 |
| Accent | `#E4572E` (soft `#FDEDE5`, dark `#C4421F`) | Warm orange — brand color; grant buttons, FAB, selection |
| Text | `#1C1917` / muted `#6B7280` / faint `#9CA3AF` | |
| Success / danger | `#16A34A` / `#DC2626` (+ soft tints) | Delta pills, destructive actions |
| Header dark | `#0E1729` | Screen headers are dark navy against the light body |
| Dark surface set | `#0E1729` bg, `#1A2440` surface, accent `#FF6B3D` | Stats tab only |

Two intentional moods: warm/light for the daily surfaces, dark navy for
headers and the analytics tab. Whether that split survives 2.0 is an open
design question (doc 10).

## Type & shape

- System font stack (SF Pro on iOS); display variant for big numbers.
- Size scale: 11 / 13 / 15 / 17 / 20 / 24 / 28 / 34 / 56. Hero numbers
  (points, totals) render at 56–64 with tight letter-spacing and weight
  800 — big numbers are the visual signature of the app.
- Radii: 8 / 12 / 16 / 20 / pill. Cards and buttons are generously rounded.
- Shadows: layered soft shadows; the FAB gets an orange glow.

## Interaction patterns

- **Pressable scale** — nearly every tappable element scales slightly on
  press (`usePressable`), standing in for native touch feedback.
- **Tap targets** ≥ 40–56 px on primary actions; grant buttons 56 px tall.
- **Bottom sheets** for flows, **centered modals** for confirms, **toast**
  (with Undo) for outcomes. Destructive confirms are custom modals *except*
  two legacy browser `confirm()` calls (end year, remove member).
- **Skeleton** for roster loading; spinners elsewhere; custom
  pull-to-refresh with GPU-driven transform.
- Emoji as data (avatars 🌱, flame icon for streaks via lucide icons).
- Icons: lucide-react throughout.

## Platform accommodations worth keeping

- Safe-area insets respected at top/bottom (`env(safe-area-inset-*)`).
- `WebkitTapHighlightColor: transparent` everywhere; no 300 ms-tap issues.
- Photo cache-stabilization: presigned URLs are rewritten to a
  session-stable form so navigation doesn't re-download every avatar
  (WKWebView cache heuristics).
- Status bar / splash handled via Capacitor plugins.

## Accessibility state

Thin but not absent: aria-labels on icon buttons, native `<select>`
overlays for pickers (real system controls), text at ≥11 px. **No
dynamic-type support, no VoiceOver audit, contrast unaudited (muted grays
on white are borderline).** 2.0 should treat a11y as a first-class
requirement rather than inherited behavior.
