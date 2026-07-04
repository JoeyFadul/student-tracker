# 13 · Phase 0 Technical Spec — Foundations

Implementable spec for scope items 0.1–0.3 ([doc 11](11-redesign-scope.md)).
Ground rule for the whole phase: **behavior parity** — when Phase 0 lands,
the app does exactly what v1 does, on routes and a consolidated kit. Visual
changes wait for Phase 1 so regressions stay attributable.

**Recommended order: 0.0 → 0.3 → 0.2 → 0.1** (harness first so every
subsequent PR can carry tests per `CLAUDE.md`; purge next so there's less
to migrate; kit swaps are local and low-risk; routing is the big-bang
`App.jsx` restructure and goes last, moving already-consolidated screens).

**Branching:** feature branch `redesign/phase-0`, one PR per work item
(P0.3, P0.2, P0.1). Main stays App-Store-shippable throughout. CI gates:
`npm run lint --prefix frontend` and `sam validate --lint` (unchanged).

---

## P0.0 — Test harness (½–1 day)

Prerequisite for the testing rules in `CLAUDE.md` (repo root). The repo
currently has **zero** test infrastructure.

1. **Frontend:** Vitest + React Testing Library + jsdom;
   `npm test` / `npm run test:watch` scripts in `frontend/package.json`.
2. **Backend:** Vitest in `backend/` with the DynamoDB/S3 clients mocked
   (`aws-sdk-client-mock`); `npm test` script.
3. **E2E:** Playwright against `vite dev` with the API mocked at the
   network layer (`page.route`); smoke specs: login gate renders, roster
   lists students, grant + undo round-trip. Budget: <1 min total.
4. **CI:** add `npm test` (frontend + backend) and the Playwright smoke
   job to `pr.yml`.
5. **Seed tests** proving the harness works and covering the riskiest
   existing logic: `computeStreak` (backend), `sortStudents`,
   `suggestYearLabel`/`deriveYearOptions`, `ReasonPicker` (tap-to-commit
   + 50-char cap), and one backend authorization test (non-member → 403).

**Verify:** `npm test` green in both packages locally and in CI; a
deliberately broken assertion fails CI.

---

## P0.3 — Vestigial-code purge (½ day)

Per decisions B3 (tiers deleted) and doc-10 A15–A18. All deletions, no new
surface:

1. **Delete `frontend/src/lib/tiers.js`** and every `getTier` call site:
   - `dashboard/StudentListItem.jsx` — avatar `background: tier.bg` → new
     token `theme.colors.avatarBg` (add `avatarBg: '#fef3c7'` to `theme.js`
     — the current default-tier value, so nothing changes visually). Remove
     the tier-chip block in the sub-row (streak chip stays).
   - `profile/ProfileHero.jsx` — same background swap; remove tier chip and
     `TierIcon` (streak chip stays).
   - `dashboard/BulkGrantSheet.jsx` (`Avatar`) and `archive/YearArchive.jsx`
     (`StudentRow`) — same background swap.
   - Check `archive/YearStudentDetail.jsx` for a `getTier` import and treat
     identically.
2. **Delete `components/dashboard/TopReasonsCard.jsx`** (unused since the
   stats screen grew its own dark variant).
3. **`lib/avatars.js`** — delete `AVATAR_CHOICES`; keep `DEFAULT_AVATAR`.
4. **`profile/QuickGrantRow.jsx`** — decision B5-adjacent cleanup (doc-12,
   A18): the Award/Revoke toggle is intentional on all paths. Delete the
   stale "Grant-only" comment; `allowRevoke` is now always true, so remove
   the state/prop entirely and let `ReasonPrompt`/`ReasonPicker` always
   render the toggle.

**Verify:** roster, profile, bulk sheet, and archive render identically
(avatar backgrounds unchanged); grant + revoke still work from 1/2/5 and
custom paths.

---

## P0.2 — Component kit consolidation (~2–3 days)

Styling stays inline-JS off `theme.js` — no CSS framework migration in
Phase 0. The work is extraction and de-duplication into `components/ui/`.

### Theme resolution (the one visual decision Phase 0 makes)

Adopt **one light system**: warm-light surfaces app-wide, dark navy
(`headerDark`) reserved for screen headers and *accent cards* — no more
full-dark screens. Concretely: `theme.dark` shrinks from "alternate app
theme" to a `navyCard` token set used by the Stats hero card; the Stats
*page* background becomes standard light in Phase 1 when that screen is
rebuilt (Phase 0 only relabels tokens, it does not restyle Stats — parity
rule). If Phase 1 mockups argue for keeping a dark analytics mood, this is
a token rename away from reversal.

### New/consolidated components

| Component | Replaces / absorbs | Contract |
|---|---|---|
| `ConfirmDialog` | `DeleteConfirmModal`, `DeleteYearModal`, `DeleteClassroomModal`, `DeleteAccountModal` chrome, **both `window.confirm()` calls** (`ClassroomSection` remove-member, `SchoolYearSection` end-year) | `{title, body, confirmLabel, destructive?, requireTypedText?, onConfirm, onClose}`; async-aware (busy state on confirm). Typed-confirm variant covers delete-account/delete-year. |
| `Avatar` | 4 duplicate implementations (StudentListItem, ProfileHero, BulkGrantSheet, YearArchive) | `{student, size, radius?}`; renders photo → emoji → 🌱 fallback (FR-ST-5) on `avatarBg`. One place to change when photos/emoji evolve. |
| `Skeleton` primitives | `DashboardSkeleton` (generalize) | `Skeleton.Row`, `Skeleton.Card`, `Skeleton.Stat`; every data-loading surface gets one in Phase 1 — Phase 0 just makes them available and swaps the archive's "Loading…" text and the stats pop-in. |
| `EmptyState` | `NoYearEmptyState` layout, archive/roster empty texts | `{icon, title, hint, action?}`. |
| `ListRow` / `ListGroup` | `SettingsRow` + the hand-rolled member/past-year rows | Icon + label/value + trailing affordance, grouped-card chrome. |
| `IconButton` | 3+ local `HeaderIconButton`/`CancelButton` clones | `{icon, onClick, ariaLabel, tone?}` with `usePressable` baked in. |
| `Chip` | streak chip (2 places), read-only banner, delta pill | `{icon?, children, tone}`. |
| Header unification | `AppHeader` + `ScreenHeader` → one `AppHeader` | `{title, subtitle?, left?, action?}` — already nearly true; kill the straggler. |

Existing `Button`, `Input`, `Card`, `Sheet`, `Modal`, `Toast`,
`PullIndicator`, `TabBar` are already kit-shaped — keep, but route all
confirm-flows through `ConfirmDialog` (which composes `Modal`).

### Loading vocabulary (rule, enforced in review)

Skeleton for anything that loads *content*; spinner only *inside a control*
that's busy (button label swap, photo-upload overlay); `Toast` for
outcomes. No bare "Loading…" text.

**Verify:** every confirm flow still confirms (member remove, end year,
delete student/year/classroom/account); visual diff of roster/profile/
settings is nil-to-negligible.

---

## P0.1 — Routing (~3–5 days)

### Choice: `react-router` v7, **hash-based** (`createHashRouter`)

Rationale: WKWebView under Capacitor serves the SPA from a custom scheme;
hash routing needs zero server/scheme fallback config, survives reload at
any depth, and works identically on static web hosting. Web URL aesthetics
(`/#/students/…`) are an acceptable cost; swapping to browser history on
web later is contained in one factory call.

### Route map

```
/login                                  unauthenticated only
/onboarding                             authed, zero classrooms
/students                               Dashboard (default redirect target)
/students/:studentId                    StudentProfile
/stats                                  StatsScreen
/settings                               SettingsScreen
/settings/classroom                     ClassroomDetailScreen
/settings/school-year                   SchoolYearDetailScreen
/settings/school-year/archive/:yearId   YearArchive
/settings/school-year/archive/:yearId/students/:studentId   YearStudentDetail
```

Archive lives under settings in Phase 0 (parity); Phase 2.1 re-parents it
by moving two route entries — that's the payoff of doing this now.

### Guards & layout

- `RootGate` (replaces the gate chain in `App.jsx`): auth initializing →
  splash; unauthed → redirect `/login`; authed+no-classroom → redirect
  `/onboarding`; else render `AppLayout`.
- `AppLayout`: providers (api client, classrooms, students, school-year —
  today's `AuthedApp` state, moved to context) + `<Outlet/>` + `TabBar`.
- `TabBar` becomes `NavLink`-driven. **Tab behavior change (the one
  deliberate non-parity item, per scope 0.1):** each tab remembers its
  last route; tapping an inactive tab restores it, tapping the active tab
  pops to its root. Implemented as a small `lastPathByTab` ref in
  `AppLayout` — no extra library.

### State migration

- `selectedStudent` → route param. `StudentProfile` fetches by
  `:studentId` on mount (today's `openStudent` GET), rendering the kit
  skeleton while loading. Grant/undo/notes/photo handlers move from
  `App.jsx` into the profile route (or a `useStudentProfile` hook);
  the Toast stays global (in `AppLayout`).
- `archiveYear` object → `:yearId` param; `YearArchive` resolves the year
  from the already-loaded `useSchoolYear().years` (fallback: refetch).
- `settingsScreen` state → real routes (delete the enum).
- Reload/deep-link now restores any screen (auth session + hash survive);
  `wd:activeClassroomId` keeps classroom context.

### Back navigation & scroll

- All back-chevrons become `navigate(-1)`; hardware/browser back works for
  free from history.
- iOS swipe-back: enable WKWebView's native gesture with
  `allowsBackForwardNavigationGestures = true` on the bridge webview (one
  line in `AppDelegate`/bridge config). Verify the snapshot animation is
  acceptable for hash navigation on device; if it looks wrong, ship
  Phase 0 with buttons-only back and revisit an in-app edge-swipe in
  Phase 1. Do not build a custom gesture system in Phase 0.
- Scroll: replace the `window.scrollTo` effect with router
  `ScrollRestoration` (top on push, restored on back).

**Verify (device, not just simulator):** deep-link reload to a student
profile and an archived student; tab memory; back from every screen;
undo-toast after navigating away from a profile; sign-out from a deep
route lands on `/login` with state fully torn down (the AuthedApp-unmount
guarantee must survive the restructure — keep authed providers strictly
inside `RootGate`'s authed branch).

---

## Exit checklist (Phase 0 done means)

- [ ] Zero references to tiers, `AVATAR_CHOICES`, `TopReasonsCard`.
- [ ] Zero `window.confirm` calls; one `ConfirmDialog`.
- [ ] One `Avatar`, one `AppHeader`, skeletons available everywhere.
- [ ] Every screen reachable by URL; reload restores it.
- [ ] Tab bar preserves per-tab context; active-tab tap pops to root.
- [ ] Manual parity pass on device: all doc-03→08 flows behave as documented.
- [ ] `npm test` green in frontend and backend; Playwright smoke passing in CI.
- [ ] `npm run lint --prefix frontend` and `sam validate --lint` clean.
