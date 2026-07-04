# 12 · 2.0 Product Decisions

Answers to the Part B questions from [doc 10](10-ux-debt-and-open-questions.md),
decided 2026-07-04. These are settled for 2.0 — reopen deliberately, not
casually.

| # | Question | Decision | Consequences |
|---|---|---|---|
| B1 | Who sees the screen? | **Teacher-only in 2.0.** No projector/class-screen mode. | No realtime requirements; visual scale stays handheld. Class screen remains a future idea, not a design constraint. |
| B2 | Comparison stance | **Archives-only ranking.** Live year never ranks students. | Sort-by-points stays; no ranks, podiums, or leaderboard views on live data. Dashboard/stats visuals are per-student and whole-class only. |
| B3 | What do points buy? | **Pure counter — delete tiers.** Points are recognition, not currency. | Phase 0.3 tier deletion confirmed. Profile hero designs around points + streak only. No milestone/reward settings surface. |
| B4 | Negative behavior tracking | **Stay positive-first.** Revoke remains a secondary toggle for corrections. | Reason presets and custom reasons (1.5) are positive-framed. No negative analytics. Revoke survives (paired with event deletion, 1.4, as the two correction paths). |
| B5 | Attribution | **Record author on new events; show subtly.** Chip only in multi-teacher classrooms; historical events stay unattributed. | New scope item 1.8. Event rows must reserve room for an author chip. Backend stamps caller email on writes (single + bulk). |
| B6 | Parent-facing exports | **Defer past 2.0.** | First flagship post-2.0 feature. No new privacy surface in the redesign. |
| B7 | Offline | **Graceful failure only.** No offline grant queue. | Scope item 2.2 as written: detection, legible disabled states, retries. |
| B8 | Roster across years | **Persistent roster + year-start review.** | Confirms the lightweight review in 1.7 (bump grades, remove departed students when starting a year). No per-year enrollment model. |
| B9 | Platform ambition | **iPhone-first; iPad layout in Phase 2.** No Android in 2.0. | Item 2.3 stays, stays last, stays first to slip. |
| B10 | Naming | **Keep current naming.** | "Well Done" brand and reason vocabulary stay. One small open item: optionally shorten the iOS home-screen label from "Well Done Student" (truncates ~12–14 chars) to "Well Done" — one-line `Info.plist` change, decide before the next App Store build. |

## Net effect on scope (doc 11)

- **Added:** 1.8 — event attribution (S: backend stamp + conditional chip).
- **Confirmed as-is:** 0.3 tier deletion, 1.7 roster review, 2.2 offline
  baseline, 2.3 iPad placement, all "explicitly out of scope" items.
- **Design constraints unlocked:** profile hero = points + streak (no tier
  chip slot); no live-rank visuals anywhere; event row layout includes an
  optional author chip; grant sheet keeps Award/Revoke toggle with
  positive-first framing.
