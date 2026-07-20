# 10 · UX Debt & Open Questions for 2.0

The honest list. Part A is friction observed in the current build; Part B
is decisions 2.0 has to make explicitly. Nothing here is sorted by
priority — that's the first 2.0 planning exercise.

## A. Known debt in v1

### Structural
1. **No routing.** Navigation is component state in `App.jsx`: no deep
   links, no restore-after-reload, no swipe-back, tab taps nuke context.
   Any 2.0 IA work should start by introducing real navigation primitives.
2. **Archive burial.** Archives live 3 levels deep under Settings — a
   *data* feature filed under *configuration*. Teachers looking for "last
   year's class" won't look in Settings.
3. **Onboarding dead-ends into Settings.** New classroom → empty Students
   tab → "go to Settings to start a year" → come back. The first-run path
   should be one guided flow (create classroom → name year → add
   students).
4. **iPad is a stretched phone.** Single 720 px column, portrait-only.
   Teachers with iPads at their desk get no benefit from the screen.

### Flow friction
5. **Students can't be renamed** (FR-ST-9). API supports it; no UI exposes
   it. Same for grade changes at promotion time. *Fixed by 2.0 item 1.1
   (pencil in the profile header).*
6. **No roster import.** 25 students = 25 modal round-trips (FR-ST-3).
7. **No select-all in bulk mode** (FR-PT-8). "Whole class earned a point"
   — the most common bulk case — is N taps. *Fixed by 2.0 item 1.2:
   select-all chip + one-tap "Class point" shortcut on the roster.*
8. **Undo is a ~few-seconds toast** and the only correction mechanism
   (FR-PT-9). Noticing a mistake a minute later means it's permanent
   (backend could fix it; no UI).
9. **Reasons are hardcoded** (FR-PT-5). Every classroom economy is
   different; teachers will want custom reasons/values, and the analytics
   only get better with reasons teachers actually mean.
10. **Search/sort don't persist**, and sort default is "recently added",
    which stops being useful after setup week.

### Inconsistency / polish
11. Two confirmation systems: custom modals vs. two leftover browser
    `confirm()` dialogs (end year, remove member) — jarring inside the
    native app.
12. Light app / dark Stats tab / dark headers: three moods with no stated
    system (see doc 09).
13. Error handling is banner-only, generic, and unlocalized; no offline
    detection or retry affordances anywhere (classrooms are Wi-Fi
    dead-zone territory).
14. Loading affordances vary: skeleton (roster) vs spinner (archive) vs
    nothing (stats numbers pop in).

### Dead / vestigial code to resolve
15. Tier system disabled in place (FR-PT-13) — money-named thresholds.
16. `AVATAR_CHOICES` emoji palette never got a picker (FR-ST-6).
17. `dashboard/TopReasonsCard.jsx` unused (doc 08).
18. Award/Revoke toggle appears on paths a comment says it shouldn't
    (FR-PT-4).

## B. Questions 2.0 must answer

> **Resolved 2026-07-04** — decisions recorded in
> [12-product-decisions](12-product-decisions.md). Kept here for the
> reasoning behind each question.

1. **Who sees the screen?** v1 is teacher-only. Is there a
   projector/"class view" mode (students watching totals live)? That
   single decision drives visual scale, leaderboard ethics, and realtime
   requirements.
2. **Is comparison a feature or a harm?** Today ranking exists only in
   archives. Live leaderboards motivate some classrooms and hurt others —
   pick a stance, or make it a per-classroom setting.
3. **What do points buy?** Tiers/rewards were shelved. If 2.0 revives
   redemption (class store, privileges), it needs spend/balance mechanics,
   not just an accumulating counter.
4. **Negative behavior tracking?** Revoke exists but is buried, and all
   presets are positive. Is that a value statement (keep) or a gap (add
   negative reasons + separate analytics)?
5. **Multi-teacher maturity.** Attribution on events (FR-CL-13), real
   invites (FR-CL-10), ownership transfer (FR-AU-13), member permissions
   for year lifecycle (FR-CL-8) — v1's collaboration is trust-everyone.
   Does 2.0 formalize it?
6. **Parent-facing output?** Reports/exports (per-student summary for
   conferences) would be the first artifact leaving the app — big value,
   new privacy surface.
7. **Offline behavior.** Queue-and-sync grants, or keep online-only and
   just fail gracefully? Classroom connectivity argues for at least a
   grant queue.
8. **Per-year roster vs. persistent roster.** Today students persist
   across years with points reset. Real classrooms turn over annually —
   should starting a year prompt roster review (promote grades,
   archive departed students)?
9. **Platform ambition.** iPhone-first stays? iPad layout? Android
   (Capacitor makes it cheap-ish)? Web as first-class?
10. **Naming.** The tier system, the app title ("Well Done" vs "Well Done
    Student"), and reason vocabulary all carry v1 history — a 2.0 rebrand
    pass should decide these together.
