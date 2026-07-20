# 04 · Classrooms & Collaboration

A classroom is the tenant boundary: students, events, school years, and
membership all hang off it. Every API call is authorized by membership;
non-members get 403 regardless of what they request.

## Lifecycle

- **FR-CL-1** A user with zero classrooms is forced into a create-classroom
  onboarding screen (name field, e.g. "Mrs. Smith's 3rd Grade"). Sign-out is
  the only escape.
- **FR-CL-2** Creating a classroom makes the creator its **owner** —
  atomically (classroom meta + owner membership are one transaction; no
  orphaned classrooms).
- **FR-CL-3** Users can belong to many classrooms and create more at any
  time (Settings → Classroom → switcher sheet → "New classroom").
- **FR-CL-4** Exactly one classroom is **active** at a time per device;
  the choice persists locally (`wd:activeClassroomId`) and survives
  relaunch. Everything in the app (roster, stats, settings header) is
  scoped to the active classroom. If the remembered id is no longer valid,
  the app falls back to the first classroom.
- **FR-CL-5** Rename classroom: owner only. Renames propagate to every
  member's classroom list.
- **FR-CL-6** Delete classroom: owner only, behind a confirm modal. Deletes
  everything — students, events, years, and every member's link to it.
  Members find it gone on next load with no notification.

## Roles & permissions

| Capability | Owner | Member |
|---|---|---|
| See roster, archives, stats | ✓ | ✓ |
| Add/edit/delete students, photos, notes | ✓ | ✓ |
| Grant/revoke points (single + bulk), undo | ✓ | ✓ |
| Start / end school year | ✓ | ✓ |
| Delete a school year | ✓ | — |
| Rename / delete classroom | ✓ | — |
| Invite / remove members | ✓ | — |

- **FR-CL-7** Roles are exactly `owner` (creator, exactly one, cannot be
  removed or transferred) and `member`. There is no read-only role.
- **FR-CL-8** **[Observed quirk]** Members can start/end school years — an
  action as destructive as anything owner-gated (it zeroes all points).
  Revisit the permission split in 2.0.

## Inviting co-teachers

- **FR-CL-9** Owner invites by email (Settings → Classroom → "Invite a
  teacher"). The invite is **silent and immediate**: a membership row is
  written; there is no email notification, no accept/decline, no pending
  state. The invitee sees the classroom on their next sign-in/classroom
  refresh. UI copy sets this expectation ("They'll see this classroom the
  next time they sign in.").
- **FR-CL-10** **[Observed quirk]** The invited email doesn't need an
  existing account — inviting a typo'd address creates a dangling
  membership silently. No validation, no resend/revoke-invite UX (removal
  is the only cleanup).
- **FR-CL-11** Member list shows each teacher's email + role. Owner can
  remove any member (browser `confirm()` today); removal is immediate and
  silent for the removed teacher. The owner cannot be removed.

## Collaboration semantics

- **FR-CL-12** No realtime sync: concurrent edits follow last-write-wins at
  the API; co-teachers see each other's activity only after a refetch
  (screen entry or pull-to-refresh). Point grants are atomic server-side,
  so totals never corrupt — they can only be momentarily stale on the
  other device.
- **FR-CL-13** Points events carry an author (2.0 item 1.8): every grant
  (single, bulk, class point) stamps `grantedBy` = the caller's email
  server-side. Activity history credits a co-teacher — "· by <name>"
  (email local-part) — only on events granted by someone *other than* the
  current viewer, so single-teacher rooms and your own grants stay clean
  and no member-count lookup is needed. Events written before 1.8 have no
  `grantedBy` and show nothing. (Student *edits* still carry no author.)
