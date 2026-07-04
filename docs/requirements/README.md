# Well Done — As-Built Requirements (v1.x baseline)

Reverse-engineered requirements for the shipping app, written as the baseline
for the 2.0 redesign. Each document describes **what the product does today
and the rules it enforces**, independent of how the current UI happens to
render it — so 2.0 can rethink the experience without silently dropping
behavior teachers rely on.

Requirement IDs (`FR-XX-n`) are stable handles for redesign discussions
("does 2.0 keep FR-PT-4?"). Anything marked **[Observed quirk]** is current
behavior that may be a bug or accident rather than intent — decide
deliberately in 2.0.

| Doc | Area |
|---|---|
| [01-product-overview](01-product-overview.md) | Product, users, platforms, tech constraints |
| [02-navigation-and-ia](02-navigation-and-ia.md) | Screen inventory, navigation model |
| [03-auth-and-account](03-auth-and-account.md) | Sign-in/up, sessions, account deletion |
| [04-classrooms-and-collaboration](04-classrooms-and-collaboration.md) | Classrooms, members, roles |
| [05-school-years-and-archives](05-school-years-and-archives.md) | Year lifecycle, archives |
| [06-roster-management](06-roster-management.md) | Students, photos, notes |
| [07-points-awarding-and-history](07-points-awarding-and-history.md) | The core loop: grant/revoke, reasons, undo, streaks |
| [08-stats-and-insights](08-stats-and-insights.md) | Stats tab, analytics |
| [09-design-language](09-design-language.md) | Current visual system |
| [10-ux-debt-and-open-questions](10-ux-debt-and-open-questions.md) | Known pain points + questions 2.0 must answer |
| [11-redesign-scope](11-redesign-scope.md) | Prioritized 2.0 scope: phases, sizes, cut lines |
| [12-product-decisions](12-product-decisions.md) | Settled answers to the doc-10 Part B questions |
| [13-phase-0-spec](13-phase-0-spec.md) | Implementable spec for Phase 0 (purge, kit, routing) |
| [14-design-direction](14-design-direction.md) | "Warm Craft" visual system + dark mode (wireframes in `docs/design/`) |

Source of truth used: `frontend/src` (React SPA), `backend/index.js` (Lambda
API), `template.yaml` (infra), as of July 2026 (post App Store build 3).
