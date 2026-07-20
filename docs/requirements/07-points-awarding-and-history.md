# 07 · Points, Awarding & History

This is the product's heart. Speed rules everything here.

## Single-student grant (from profile)

- **FR-PT-1** Quick amounts **1 · 2 · 5** as large buttons plus a "…"
  custom-amount option (numeric sheet, any positive integer, no upper cap).
- **FR-PT-2** Picking an amount opens the **reason sheet**: a grid of the
  classroom's reasons — seeded with *Kindness, Effort, Helping, Homework,
  Participation, Listening, Cleanup, Teamwork* and editable per classroom
  (2.0 item 1.5, see FR-PT-5) — plus "+ Other reason…" which expands an
  inline free-text field (50-char max with live counter; also enforced
  server-side).
- **FR-PT-3** **Tapping a preset reason commits immediately** — no confirm
  step. (Custom text has an explicit Award button.) Fast path: student →
  amount → reason = granted.
- **FR-PT-4** The reason sheet includes an **Award / Revoke** toggle
  (default Award). Revoke applies −amount with the same reason mechanics.
  **[Observed quirk]** A code comment says the 1/2/5 buttons were meant to
  be award-only (revoke reserved for the custom flow), but the toggle
  currently shows on both paths. Decide the intent in 2.0.
- **FR-PT-5** Reasons are per-classroom and customizable (2.0 item 1.5).
  Stored on the classroom META as `reasons` (a `PUT /classrooms/{cid}/
  reasons` replaces the list, **owner-only**; server trims to 50 chars,
  de-dupes case-insensitively, caps at 30). Managed in Settings → Reasons
  (owner-only entry); the grant pickers read the classroom's list via
  `useReasons`, falling back to the seed presets on load error. Absent
  `reasons` = the seed presets (no migration for existing classrooms).
  Renaming/removing a reason only changes future pickers — past events
  keep their stored reason string (so analytics/history are never
  rewritten).
- **FR-PT-6** Empty reason falls back to "Points awarded" / "Points
  removed".

## Bulk grant (from roster)

- **FR-PT-7** A "Select" chip in the roster action row switches to
  selection mode: checkboxes on rows, header shows count, footer with a
  single "Award to N students" action (cancel is the header X). It opens
  the bulk sheet: overlapping-avatar strip of the selection (+N overflow),
  amount chips 1/2/5/custom, Award/Revoke toggle, same reason grid. One
  event per student, all stamped with the same timestamp; writes are
  atomic in chunks of 50 students.
- **FR-PT-8** Select-all (2.0 item 1.2): in selection mode a "Select all"
  chip selects every student currently visible (respecting an active
  search filter) and flips to "Deselect all"; selections outside the
  filtered view are preserved across the toggle.
- **FR-PT-8b** Class point (2.0 item 1.2): a "＋ Class point" chip in the
  roster action row is the fast path to reward the whole class. Tapping it
  opens the same quick reason menu (ReasonPrompt) used for single grants,
  titled for the class ("Class point · N students"); picking a reason
  awards **+1 to every student** with that reason. It reuses the bulk-grant
  path, so it carries the same optimistic update and Undo toast as any
  other grant, and always targets the full roster (not the filtered view).
  Amount is fixed at +1 — the select-all path covers other amounts and
  revoke.

## Feedback & undo

- **FR-PT-9** Every grant (single or bulk) raises a toast: delta + student
  name (or "N students") + **Undo**. Undo deletes the just-written
  event(s) and restores points, including in the open profile's local
  state. The toast is the *fast* correction path; for corrections noticed
  later, each activity row also has a delete affordance (2.0 item 1.4) →
  ConfirmDialog → `DELETE /events/{ts}`, which reverses the points when
  the event's year is still active. Archives are read-only (no delete
  affordance).
- **FR-PT-10** Grants update the UI optimistically from the API response
  (points bump + history row appended locally; no refetch round-trip).
- **FR-PT-11** Undo after a year rollover is safe by design: events are
  removed, but point reversal only applies if the event's year is still
  the active year (server-enforced).

## Streaks & tiers

- **FR-PT-12** **Streak** = consecutive calendar days with ≥1 positive
  event in the *active year*, counting back from today (or yesterday, so a
  streak isn't "broken" before the school day starts). Shown as a flame
  chip (roster + profile) only when > 1. Computed server-side per fetch;
  device-timezone quirk: days are UTC-bucketed.
- **FR-PT-13** **Tiers are built but disabled.** Thresholds 30/60/90 named
  "Two Dollars" / "Five Dollars" / "Well Done" (real-money classroom
  rewards) with icons and colors; `getTier()` currently pins everyone to
  the default tier so no chips render. 2.0 must decide: revive (maybe
  teacher-configurable, non-monetary), or delete.

## Activity history

- **FR-PT-14** Profile shows the active year's events, newest first:
  reason, relative date (Today / Yesterday / N days ago / "Mar 4"), and a
  ±delta pill (green positive, red negative). 30 per page with automatic
  infinite scroll (sentinel-based). In multi-teacher rooms a co-teacher's
  grant is credited inline on the date row ("· by <name>", the email
  local-part); your own grants and single-teacher rooms show nothing
  (2.0 item 1.8).
- **FR-PT-15** History is year-scoped — switching/ending years changes what
  the profile shows; archives show the archived year's history.
- **FR-PT-16** Events store: delta, reason, timestamp, yearId, and
  **grantedBy** (the granting teacher's email, stamped server-side — 2.0
  item 1.8, see FR-CL-13). No edit capability — events are
  append-and-delete only. `grantedBy` is additive: events written before
  1.8 simply lack it and render without attribution.

## Integrity rules (server-enforced, must survive any redesign)

- Grant = atomic transaction (points increment + event write succeed or
  fail together); same for bulk chunks and all undo paths.
- No grants without an active year (400).
- Points field is denormalized current-year truth; archive totals are
  always recomputed from events.
