# 01 · Product Overview

## What it is

**Well Done** (App Store display name "Well Done Student", bundle
`com.welldonestudent.app`) is a classroom positive-behavior tracker for
elementary teachers. Teachers award points to students with a tap, attach a
reason ("Kindness", "Effort", …), and review per-student history and
classroom-level trends. Points reset each school year; past years remain
viewable as read-only archives.

The core loop the entire app serves: **see roster → pick student(s) → award
points with a reason → move on in under five seconds.** A teacher does this
mid-lesson, one-handed, on a phone. Every 2.0 decision should be weighed
against that loop's speed.

## Users

- **Primary: the classroom teacher (owner).** Creates the classroom, owns
  its data, invites co-teachers. Grades K–5 (grade options stop at 5th).
- **Secondary: co-teacher (member).** Invited by email; can do everything
  day-to-day (manage students, award points, start/end years) but cannot
  rename/delete the classroom, manage members, or delete years.
- **Not a user: students.** Students never log in and have no accounts;
  they exist only as records. Nothing in the app is student-facing today
  (a projector/"class screen" mode is a recurring 2.0 idea, not current
  behavior).

## Platforms & distribution

- iOS app via Capacitor 5 wrapping a React 18 + Vite SPA (App Store;
  portrait-only, iPhone-focused, `LSApplicationCategoryType` = education).
- The same SPA runs as a web app (welldonestudent.com hosts legal pages;
  the app itself is served for browser use).
- Native surface is thin: secure storage for tokens, camera/photo library
  (student photos), status bar, splash, keyboard, browser plugins.

## Backend shape (constrains what UX can promise)

- AWS serverless: HTTP API Gateway + single Node.js 22 Lambda + one
  DynamoDB single-table + S3 for photos + Cognito for identity.
- All reads are request/response — **no push, no realtime, no offline
  queue.** Two teachers using the same classroom see each other's changes
  only on refetch (screen entry or pull-to-refresh).
- Photos are stored privately in S3 and served via presigned URLs (8 h
  read TTL, 24 h browser cache). Upload URLs live 5 minutes.
- API throttling: 50 req/s, burst 100. Reason strings capped at 50 chars
  server-side.

## Product principles evident in v1 (keep or consciously drop)

1. **Tap-count minimalism** — awarding a preset amount+reason is 3 taps
   from the roster (student → amount → reason; reason tap commits, no
   confirm).
2. **Everything undoable in the moment** — every grant (single or bulk)
   surfaces an Undo toast; there is no other way to correct mistakes
   besides that toast window.
3. **Positive-first** — presets are all positive behaviors; revoking is
   possible but deliberately secondary (a toggle, never the default).
4. **Data outlives the year** — ending a year freezes it as an archive;
   deleting a student is soft (they persist in archives of years they
   participated in).
5. **No gamification pressure** — a tier/reward system ("Two Dollars",
   "Five Dollars", "Well Done" at 30/60/90 points) was built and then
   intentionally disabled; only the day-streak flame survives.

## Glossary

| Term | Meaning |
|---|---|
| Classroom | Tenant/container: students, events, years, members. |
| Member | A teacher with access to a classroom; role `owner` or `member`. |
| School year | Labeled period (e.g. "2025–2026"); at most one active per classroom. |
| Event | One point grant/revocation: delta, reason, timestamp, yearId. |
| Points | Denormalized sum of active-year deltas on the student profile. |
| Streak | Consecutive calendar days (ending today/yesterday) with ≥1 positive event in the active year. |
| Archive | Read-only view of a past year; points recomputed from that year's events. |
