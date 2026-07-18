# 15 · Phase 1 Spec — Warm Craft + Core-Loop Features

Phase 0 (foundations) is done: routes, kit, tokens, tests. Phase 1 delivers
the visible redesign (doc 14, wireframes) and scope items 1.1–1.8 (doc 11).
Same rules: branch `redesign/phase-0` continues (rename on PR merge),
tests ship with features, every chunk leaves the app shippable.

## Chunk A — the skin (global visual swap)

One commit that makes every screen Warm Craft without changing layout:

1. Token values → doc-14 palette in `index.css` (shipped as "paper"
   `#FAF7F2`/`#2A2521`; revised 2026-07-18 to the Clean Craft neutrals —
   bg `#FAFAFA`, ink `#18181B`, accent `#E05B35` unchanged, sage success,
   honey highlight, brick danger). New tokens: `honey`, `honeySoft`,
   `surfaceTranslucent`. Cards/rows gain a 1px `border` hairline with
   `shadow.sm`.
2. **Navy retired**: `headerDark*` tokens deleted; `AppHeader` becomes a
   single light treatment (paper bg, 30px rounded-display ink title);
   header icon buttons flip to surface tone with ink glyphs; status bar
   text flips dark (`Style.Light`); `theme-color` → paper.
3. `font.display` → `ui-rounded` (SF Pro Rounded on iOS) for titles and
   big numerals.
4. Shadows warm-tinted; FAB/grant glows re-derived from the new accent.
5. **Stats rebuilt light** (bento per wireframe frame 4): honey hero
   card, sage on-streak tile, light top-reasons card. `theme.dark`
   deleted — the last dark surface is gone.
6. Hardcoded-color cleanup rides along: LoginScreen and ConfirmDialog
   literals → tokens (CLAUDE.md rule).

## Chunk B — screen rebuilds (wireframes 1–3, 5)

Dashboard (kicker + big title block, year chip, honey streak chips),
Student Profile (centered hero per frame 2), award sheet polish (frame 3),
Settings (frame 5, no icon tiles — emoji rule). Component-level work,
one screen per commit, e2e untouched.

## Chunk C — dark mode (neutral charcoal)

`prefers-color-scheme` block in index.css with doc-14 dark values; audit
remaining translucent/literal colors; verify kit components in both
schemes (doc-14 addition to exit checklist).

## Chunk D — features, in order

| # | Item | Note |
|---|---|---|
| 1.1 | Edit student name/grade | Edit affordance on profile hero (frame 2 pencil); PATCH exists |
| 1.2 | Select-all + class point | "All" chip in select mode; dashboard shortcut chip (frame 1) |
| 1.3 | Sort/search persistence | `wd:` localStorage, per classroom; default A–Z |
| 1.8 | Event attribution | Backend stamps `grantedBy` (single+bulk); chip in multi-teacher rooms; ride the 1.4 row redesign |
| 1.4 | Per-event delete | Row affordance + ConfirmDialog; `DELETE /events/{ts}` exists |
| 1.5 | Custom reasons | Classroom reason list (backend: `REASONS` item on classroom); manage UI in Settings; grant sheet + top-reasons read it |
| 1.6 | Roster paste-import | Multi-line paste in Add flow → N creates |
| 1.7 | Guided first-run | create classroom → start year → paste roster → dashboard; year-start roster review (B8) |

## Exit criteria

Every screen matches wireframe intent in light and dark; features 1.1–1.8
shipped with tests; no hex literals outside index.css; doc 02/06/07
updated for new flows; full parity pass of unchanged behaviors on device.
