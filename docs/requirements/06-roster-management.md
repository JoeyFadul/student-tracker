# 06 · Roster Management

## The roster (Students tab / Dashboard)

- **FR-RO-1** Header: classroom name, active year label, student count.
- **FR-RO-2** Each student row: avatar (photo or emoji), name, points (big,
  right-aligned), streak flame + count when streak > 1, chevron. (A tier
  chip slot exists but tiers are disabled — see FR-PT-12.)
- **FR-RO-3** Live name search (case-insensitive substring) and sort:
  **A–Z** (default) · Recent (creation date) · points High · points Low.
  Both the sort choice and the current search persist per classroom (2.0
  item 1.3, `wd:sort:<cid>` / `wd:search:<cid>` in localStorage), so they
  survive navigating into a profile (the Dashboard unmounts) and app
  restarts; they're cleared on sign-out with the other `wd:` keys. The
  default changed from Recent to A–Z (FR-A10) because Recent aged badly
  after setup week.
- **FR-RO-4** Pull-to-refresh refetches the roster (custom implementation,
  spinner above content). This is the only manual sync affordance.
- **FR-RO-5** Floating "+" button opens Add Student. Roster loading shows a
  skeleton, not a spinner.

## Creating a student

- **FR-ST-1** Fields: **name (required)** — single free-text field, no
  first/last split; **grade** — dropdown K, 1st–5th, defaults 3rd;
  **photo (optional)** — camera or library, previewed in the modal.
- **FR-ST-2** Creation is optimistic about photos: the record is created
  immediately with the default 🌱 emoji avatar and appears in the roster;
  the photo uploads in the background and pops in when ready. Upload
  failure leaves the emoji and shows an error banner — the student is
  still created.
- **FR-ST-3** Roster paste-import (2.0 item 1.6): the Add modal has a
  "Many" mode — a textarea of names (one per line, blanks dropped,
  duplicates kept, never split on commas) plus one grade applied to all →
  creates a student per line (default emoji, no photos). Creation is
  sequential over the existing create path, so a partial failure still
  lands the earlier names and surfaces the error. The single-student form
  (with photo) is the other mode. Replaces the old one-modal-per-student
  slog for setup week.

## Photos & avatars

- **FR-ST-4** Photos are compressed client-side (camera output 3–10 MB →
  ~80–200 KB JPEG) then uploaded straight to S3 via presigned URL; the
  student record stores only the S3 key. Served back as presigned GETs
  (8 h TTL) with 24 h immutable browser caching; each new upload gets a
  fresh random key so URLs never go stale-but-wrong.
- **FR-ST-5** Every student always renders *something*: photo if set, else
  their emoji, else the default 🌱. Changing a photo: tap the profile hero
  avatar (camera overlay on hover/tap; spinner while uploading). Photos
  can be replaced but **not removed** back to emoji in the UI.
- **FR-ST-6** A 16-emoji avatar palette exists in code (`AVATAR_CHOICES`)
  but **no picker UI was ever wired up** — students get 🌱 or a photo.
  2.0 decision: build the picker or drop the concept.
- **FR-ST-7** Security invariant to preserve: photo keys are validated
  server-side to belong to that exact classroom+student (cross-tenant
  guard), and upload URLs are only issued for existing students.

## Editing & deleting

- **FR-ST-8** Delete student (trash icon on profile, confirm modal) is a
  **soft delete**: the student vanishes from the roster and current-year
  operations, but remains visible in archives of years where they had
  events (mid-year transfers stay in the record). There is no restore UI.
- **FR-ST-9** Name and grade are editable after creation (2.0 item 1.1):
  a pencil in the profile header opens an edit modal with the same name
  field and grade select as Add. Name is required and trimmed on both
  sides (the server rejects blank or non-string names; grade must be a
  string). A legacy student with no grade gets a "No grade" option so
  opening the editor never silently rewrites data, and Save stays
  disabled until something actually changes.

## Notes

- **FR-ST-10** One free-text private note per student, on the profile.
  Explicit Save/Cancel (deliberately not blur-autosave — iOS WKWebView
  fires spurious blurs, and autosave clobbered drafts). Empty state shows
  an "Add a note" prompt; filled state shows prose with a pencil to edit.
- **FR-ST-11** Notes are per-student, not per-year: they carry across years
  and are invisible in archives. Plain text only, no length cap, no
  timestamps, no author attribution.
