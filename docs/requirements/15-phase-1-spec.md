# 15 · Phase 1 Spec — Warm Craft + Core-Loop Features

Phase 0 (foundations) is done: routes, kit, tokens, tests. Phase 1 delivers
the visible redesign (doc 14, wireframes) and scope items 1.1–1.8 (doc 11).
Same rules: branch `redesign/phase-0` continues (rename on PR merge),
tests ship with features, every chunk leaves the app shippable.

## Chunk A — the skin (global visual swap)

One commit that makes every screen Warm Craft without changing layout:

1. Token values → doc-14 palette in `index.css` (shipped as "paper",
   revised twice on 2026-07-18: Clean Craft neutrals, then the
   **Gunmetal & Coral** design-system values — see doc 14 history
   table). Cards/rows gain a 1px `border` hairline with `shadow.sm`;
   headers/tab bar/stats hero are gunmetal chrome.
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

## Chunk B — screen alignment to the design-system kit ✅

The kit (`ui_kits/app/`) is a restyled recreation of the app, so most
of frame-level "rebuild" landed with the token/chrome adoption. The
remaining deltas shipped one screen per commit, e2e untouched:
Dashboard (soft-coral bulk entry band; select footer collapses to a
single "Award to N students" action, cancel via header X), Profile
(Activity above Notes; "Only you can see these" notes subtitle),
Settings (slate icon tiles incl. detail screens; accent kept only on
the active-classroom marker). Dead `DangerZone` removed.

## Chunk C — dark mode ✅ (shipped with the Gunmetal & Coral adoption)

`prefers-color-scheme` block landed in index.css with the design-system
dark values (gunmetal canvas). Remaining: device verification pass of
kit components in both schemes.

## Chunk D — features, in order

| # | Item | Note |
|---|---|---|
| 1.1 ✅ | Edit student name/grade | Shipped: pencil in the profile header → edit modal; PATCH now validates name/grade (doc 06 FR-ST-9) |
| 1.2 ✅ | Select-all + class point | Shipped: roster action row (Class point + Select) replaces the bulk-entry band; "Select all/Deselect all" toggle in select mode; Class point opens the shared reason menu → +1 to the whole class (doc 07 FR-PT-8/8b). Frontend-only, reuses bulk-points |
| 1.3 ✅ | Sort/search persistence | Shipped: `useDashboardPrefs(cid)` hook persists sort + search per classroom (`wd:sort:`/`wd:search:` localStorage); default flipped to A–Z (doc 06 FR-RO-3). Frontend-only |
| 1.8 ✅ | Event attribution | Shipped: backend stamps `grantedBy` on every grant (single + bulk); activity credits co-teacher grants inline (email local-part), viewer's own hidden so no member-count needed (doc 04 FR-CL-13). Additive backend field — v1 unaffected |
| 1.4 ✅ | Per-event delete | Shipped: per-row trash on active-year activity → ConfirmDialog → existing `DELETE /events/{ts}` (reverses points, roster + profile); archives read-only (gated on onDeleteEvent). Frontend-only (doc 07 FR-PT-9, doc 10 A8) |
| 1.5 ✅ | Custom reasons | Shipped: `reasons` on classroom META (additive, seeded with presets), owner-only `PUT /reasons`; Settings → Reasons manage screen (add/rename/remove); `useReasons` feeds the grant pickers; top-reasons needs no change (aggregates strings). Reorder deferred. Doc 07 FR-PT-5 |
| 1.6 ✅ | Roster paste-import | Shipped: "Many" mode in the Add modal (textarea + shared grade) → parseRoster → sequential creates. Frontend-only (doc 06 FR-ST-3) |
| 1.7 | Guided first-run | create classroom → start year → paste roster → dashboard; year-start roster review (B8) |

## Exit criteria

Every screen matches the design-system UI kit (`docs/design/
design-system/ui_kits/app/`) in light and dark; features 1.1–1.8
shipped with tests; no hex literals outside index.css; doc 02/06/07
updated for new flows; full parity pass of unchanged behaviors on device.
