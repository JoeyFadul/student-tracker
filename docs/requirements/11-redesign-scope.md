# 11 · 2.0 Redesign Scope (prioritized)

Part A of [doc 10](10-ux-debt-and-open-questions.md), turned into an ordered
plan. Part B questions stay out of scope here — where a debt fix touches a
Part B decision, the dependency is called out rather than answered.

**Prioritization lens** (in order): does it protect or speed up the core
loop (roster → student → points in <5 s)? · how often does a teacher hit
it? · does anything else build on it? Effort is sized S/M/L relative to
this codebase.

---

## Phase 0 — Foundations (nothing else starts until these do)

These don't ship user value by themselves; they make every later item
cheaper and are brutally expensive to retrofit.

| # | Item | Size | Debt | Why first |
|---|---|---|---|---|
| 0.1 | **Real navigation.** Introduce a router (URL-backed even inside Capacitor): routes for tabs, student profile, archives, settings sub-screens. Deep links, state restore on reload, iOS swipe-back, tab-tap preserving context within a tab. | L | A1 | Every IA change in later phases (archive move, onboarding flow, iPad split-view) assumes routes exist. Retrofitting a router after screens are rebuilt means rebuilding twice. |
| 0.2 | **2.0 component kit.** Consolidate to one confirmation pattern (kill both `confirm()` calls), one loading vocabulary (skeletons everywhere data loads), one theme decision (resolve the light-app/dark-stats/dark-header three-way split into a stated system), extracted from `theme.js` into real components. | M | A11, A12, A14 | Screens get rebuilt once, on the new kit — not rebuilt then re-skinned. This *is* the redesign's visual foundation. |
| 0.3 | **Vestigial-code resolution.** Delete `dashboard/TopReasonsCard.jsx`; delete `AVATAR_CHOICES` or commit to a picker (recommend: delete — photos + 🌱 cover the need); delete tier code from list/profile/bulk paths (revival, if ever, is a Part B/3 reward-system decision and shouldn't haunt the new components); make Award/Revoke placement deliberate (recommend: keep the toggle on all paths — it matches observed use — and update the stale comment). | S | A15–A18 | Half hour of decisions that otherwise get re-litigated inside every rebuilt screen. |

**Exit criteria:** app behaves identically to v1 but on routes and the new
kit. This is deliberately a refactor phase — visual changes land in Phase 1
so regressions are attributable.

---

## Phase 1 — Core loop & roster (the redesign's user-facing payload)

Ordered within phase; 1.1–1.3 are small enough to also ship early.

| # | Item | Size | Debt | Notes |
|---|---|---|---|---|
| 1.1 | **Edit student name & grade.** Edit affordance on the profile (API already supports it). | S | A5 | Worst gap : effort ratio in the app. |
| 1.2 | **Select-all / whole-class grant.** "All" chip in bulk-select; consider a one-tap "class point" shortcut on the dashboard header. | S | A7 | The most common bulk case becomes 2 taps. |
| 1.3 | **Sort/search persistence + default.** Persist per classroom (`wd:*`); change default from "recently added" to A–Z after roster age > ~2 weeks, or just default A–Z. | S | A10 | |
| 1.4 | **Grant corrections beyond the toast.** Per-event delete (swipe or overflow menu) in Activity History, with confirm. Backend endpoint already exists (`DELETE /events/{ts}`). Keeps FR-PT-9's toast as the fast path. | M | A8 | Do before custom reasons — correction UX informs how history rows render. |
| 1.5 | **Custom reasons.** Per-classroom reason list (add/rename/archive/reorder), seeded with the current 8 presets; grant sheet and top-reasons analytics read from it. Needs small backend addition (reason list on classroom). | M–L | A9 | Touches the grant sheet redesign — design them together. Keep 50-char cap and tap-to-commit (FR-PT-3). |
| 1.6 | **Roster import / fast add.** Minimum: multi-line paste ("one name per line") creating N students. Stretch: CSV. Photos stay per-student afterwards. | M | A6 | Seasonal (setup week) but decisive for adoption and reviews. |
| 1.7 | **Guided first-run.** One flow: create classroom → pick year label → add students (via 1.6) → land on live roster. Replaces the Settings detour (FR-YR-8). Also covers the new-year rollover moment with a roster-review prompt — *lightweight version only* (confirmed by decision B8). | M | A3 | Depends on 0.1 (flow routes) and 1.6. |
| 1.8 | **Event attribution.** Stamp new point events with the granting teacher (from JWT claims, single + bulk paths); show an author chip on activity rows only in multi-teacher classrooms. Historical events stay unattributed. Added by decision B5. | S | — | Design event rows (1.4) with the chip slot from the start. |

**Exit criteria:** a new teacher goes from install to granting points
without touching Settings; an existing teacher can fix any mistake
(name, grade, wrong grant) without deleting anything.

---

## Phase 2 — Reach & resilience

| # | Item | Size | Debt | Notes |
|---|---|---|---|---|
| 2.1 | **Archives out of Settings.** Surface past years from the Students tab (e.g., year switcher in the dashboard header, or a "Past years" row). Settings keeps year *management* (start/end/delete); browsing moves to where the data lives. | S–M | A2 | Cheap once 0.1 exists. |
| 2.2 | **Error & connectivity baseline.** Offline detection with a persistent banner, retry buttons on failed loads, human error copy, disabled-not-broken grant buttons while offline. Explicitly *not* an offline queue — that's Part B/7; this just makes failure legible. | M | A13 | |
| 2.3 | **iPad / adaptive layout.** Two-pane (roster + profile) on regular width; enable landscape. | L | A4 | Biggest effort, most severable. Gate on Part B/9 (platform ambition) before starting. |

---

## Cut lines & sequencing notes

- **If scope pressure hits:** 2.3 slips first, then 2.2, then 1.6-stretch
  (CSV). Phases 0 and 1.1–1.5 *are* the redesign — cutting there means not
  doing 2.0.
- **Ship-early candidates (don't need 2.0):** 1.1, 1.2, 1.3, and the
  `confirm()` replacements from 0.2 are safe on the current 1.x codebase
  if a maintenance release happens before the redesign lands.
- **Part B gates: all resolved** — see [doc 12](12-product-decisions.md).
  Net effect: tiers deleted for good (B3), no live-rank visuals anywhere
  (B2), attribution added as item 1.8 (B5), everything else confirmed
  as scoped.
- **Explicitly out of scope for 2.0** (confirmed by decisions B1/B6/B7/B9):
  realtime sync, offline queue, parent-facing exports, Android,
  class-screen mode.
