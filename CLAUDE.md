# Well Done — Engineering Rules

Classroom points tracker. React 18 + Vite SPA in `frontend/` (Capacitor iOS
wrapper), single Lambda API in `backend/index.js`, SAM `template.yaml`,
DynamoDB single-table. 2.0 redesign in progress: requirements, scope, and
design tokens live in `docs/requirements/` (start at its README).

These rules apply to ALL code written or delivered in this repo.

## Workflow & delivery

- Never commit directly to `main`. Feature branch + PR per work item.
- Before every push: `npm run lint --prefix frontend` and
  `sam validate --lint` must pass locally (CI also runs frontend build and
  `sam build` — keep all green).
- Run the relevant test suites before pushing. A red test blocks the push;
  fix or explicitly surface it — never skip or silence.
- Verify changes by actually running the app (browser or device) before
  calling work done, and state what was verified.
- When behavior changes, update the matching doc in `docs/requirements/`
  in the same PR — those docs are the source of truth for 2.0.
- Small PRs, one concern each. Commit messages explain *why*.

## Testing (required, not optional)

- Harness: Vitest + React Testing Library (frontend), Vitest (backend),
  Playwright for E2E smoke. Standing it up is Phase 0 item P0.0
  (`docs/requirements/13-phase-0-spec.md`); every rule below applies from
  the moment it exists.
- Every new/changed module in `frontend/src/lib/` or `frontend/src/hooks/`,
  and every new/changed backend route, ships **unit tests in the same PR**.
- Bug fixes ship a regression test that fails before the fix.
- Test behavior through public interfaces (rendered output, API
  responses), not implementation details. Don't chase coverage of trivial
  JSX; do cover logic, edge cases, and permission checks.
- E2E smoke suite stays under a minute: login gate, roster render (mocked
  API), grant + undo flow. Runs in CI on PRs.

## Frontend patterns

- Small reusable components: one exported component per file. If a JSX
  pattern appears twice, extract it to `components/ui/` before the third
  use.
- Nothing hardcoded: colors/spacing/radii/shadows come from theme tokens
  only — no hex or themable px literals outside `theme.js`. Environment
  config via `config.js`. Magic numbers get named constants.
- All HTTP goes through the `api.js` client; data fetching lives in
  `hooks/`; components stay presentational.
- Reuse before writing: check `components/ui/`, `hooks/`, `lib/` first.
- Emoji is data (student avatars only), never decoration. UI icons are
  lucide-react only.
- Icon-only buttons require `aria-label`; interactive tap targets ≥ 44px.
- Comments only for non-obvious constraints — never narration of what the
  code does.

## Backend rules

- Every route enforces classroom membership; owner-only mutations follow
  the permission table in `docs/requirements/04`.
- Multi-item writes are atomic (`TransactWrite`, ≤100 ops per chunk, meta
  deletes last so retries stay safe).
- Never echo internal error details (SDK messages, keys, table names) to
  clients — log server-side with requestId, return generic errors.
- New or changed routes: update the route-map comment at the top of
  `backend/index.js` and the relevant requirements doc.
- Validation exists on both sides but the server is authoritative (e.g.
  50-char reason cap); keep client and server limits in sync.

## Definition of done

Lint clean · tests written and passing · app verified running · docs
updated · no dead code introduced or left behind.
