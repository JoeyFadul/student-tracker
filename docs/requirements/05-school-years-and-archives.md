# 05 · School Years & Archives

The school year is the app's clock. Points only accrue inside an active
year; ending a year freezes its data into a read-only archive.

## Year lifecycle

- **FR-YR-1** At most one active year per classroom. Every point event is
  stamped with the year it happened in.
- **FR-YR-2** Starting a year: user picks a label from a generated dropdown
  (academic years around today, e.g. "2025–2026", plus "Summer YYYY"
  options; July is the rollover month). **No free-text labels.**
- **FR-YR-3** Starting a new year while one is active: auto-ends the current
  year and **resets every student's points to 0**. The start sheet shows an
  explicit warning ("…will end 2025–2026 and reset every student's points
  to 0. Past points will stay viewable as an archive.").
- **FR-YR-4** Ending a year (without starting a new one) stamps `endedAt`
  and leaves the classroom with **no active year**. Students and their
  lifetime records persist; the roster carries over into whatever year is
  started next. Confirmation is a browser `confirm()` today.
- **FR-YR-5** With no active year: granting points is blocked server-side
  (400 "No active school year") and the whole Students tab is replaced by
  an empty state (FR-NAV-6). Streaks all read 0.
- **FR-YR-6** Deleting a year (owner only, typed confirm modal): permanently
  removes the year and **all its events**. If it was the active year, each
  student's current points are decremented by that year's contribution and
  the classroom drops to no-active-year. Not undoable.
- **FR-YR-7** Year management lives at Settings → School year: current-year
  card (label, start date, End/Delete actions), Start button, and a "Past
  years" list (newest first, date ranges) that opens archives.
- **FR-YR-8** The no-year empty state on the Students tab is the intended
  onboarding moment for a new classroom: it directs to Settings to start
  the first year. **[Observed quirk]** A brand-new user must discover this
  detour before they can do anything — a prime 2.0 onboarding fix.

## Archives

- **FR-AR-1** Tapping a past year opens a read-only archive of that year:
  students **ranked by points earned in that year** (recomputed from the
  year's events, not the live points field), with rank numbers and an
  explicit "Read-only" banner.
- **FR-AR-2** Archive membership rule: a student appears in a year's archive
  iff they have ≥1 event in that year. Students added later don't bleed
  into old archives; students soft-deleted later **do** still appear
  (see FR-ST-8).
- **FR-AR-3** Tapping an archived student shows their profile for that year:
  photo/avatar, grade, that year's point total, and full activity history
  (paginated, same 30-per-page mechanism as live profiles).
- **FR-AR-4** No mutation of any kind inside archives — no grants, edits,
  notes, or photo changes. Streaks are not shown (they're a current-year
  concept).
- **FR-AR-5** Archive data is fetched fresh per visit (no local caching).
