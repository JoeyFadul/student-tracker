# 08 · Stats & Insights

The Stats tab is the app's only analytics surface. It is intentionally
lightweight — and visually distinct (the one dark-themed screen).

## Current behavior

- **FR-SS-1** Hero card: **total points** across the classroom (active
  year), student count, **average per student** (rounded), and **"on
  streak"** count (students with streak > 1).
- **FR-SS-2** **Top reasons** card: positive-event reason frequency over
  the **last 30 days** (fixed window, no picker), scoped to the active
  year. API returns top 10; UI renders top 5 as horizontal proportion
  bars with counts. Card hides entirely when there's no data.
- **FR-SS-3** All numbers derive from the roster payload already in memory
  plus one top-reasons request — the tab has no other queries. Totals are
  as fresh as the last roster fetch.
- **FR-SS-4** No active year → header says so; totals show zeros.

## What v1 deliberately does not have (2.0 candidates, not bugs)

- Per-student trends over time (points-per-week, momentum).
- Class trend charts / calendar heatmaps.
- Reason breakdown per student, or negative-reason analytics.
- Any leaderboard on the live year (ranking exists only in archives —
  possibly a deliberate anti-comparison choice; confirm before changing).
- Time-window controls, per-grade filters.
- Export/reporting (CSV, PDF for parent-teacher conferences). Frequently
  the most-requested "grown-up" feature for this category.
- Cross-year comparisons.

## Dead code note

`components/dashboard/TopReasonsCard.jsx` is a light-themed duplicate of
the stats card that is no longer imported anywhere — the dashboard once
showed top reasons inline. Delete or consciously revive in 2.0.
