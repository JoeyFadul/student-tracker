# 02 · Navigation & Information Architecture

## Screen inventory (as built)

```
Unauthenticated
└── Login card (modes: signin · signup · verify · forgot · forgotConfirm · forced-new-password)

Authenticated, no classroom
└── Create Classroom (onboarding; sign-out escape hatch)

Authenticated, has classroom          ← persistent bottom tab bar (64pt + safe area)
├── Students tab (Dashboard)
│   ├── Search + sort controls
│   ├── Bulk-select mode (header morphs, footer appears)
│   │   └── Bulk Grant sheet → Custom Amount sheet
│   ├── Add Student modal
│   └── [tap row] → Student Profile (overlay)
│       ├── Photo upload (hero avatar tap)
│       ├── Quick grant row → Reason sheet / Custom Amount sheet
│       ├── Notes editor (inline card)
│       ├── Activity history (infinite scroll)
│       └── Delete Student modal
├── Stats tab (dark themed)
└── Settings tab
    ├── Classroom detail (sub-screen)
    │   ├── Classroom switcher sheet (switch + create)
    │   ├── Invite Teacher sheet
    │   └── Delete Classroom modal
    ├── School Year detail (sub-screen)
    │   ├── Start Year sheet
    │   ├── Delete Year modal
    │   └── [tap past year] → Year Archive (overlay)
    │       └── [tap student] → Archived Student Detail
    ├── Privacy Policy / Terms (external browser)
    ├── Sign out
    └── Delete Account modal
```

## Navigation model & rules

- **FR-NAV-1** Three top tabs: Students, Stats, Settings. Tapping any tab
  resets all overlay/sub-screen state (closes profile, archive, settings
  sub-screens) — tabs always land on their root.
- **FR-NAV-2** Student Profile and Year Archive render as full screens *over*
  the active tab; the tab bar stays visible and functional beneath them.
- **FR-NAV-3** Navigation is pure component state — there is **no router, no
  URLs, no deep links, no browser/system back integration, and no swipe-back
  gesture**. Back is always an explicit chevron button. State is lost on
  reload (except auth session and active-classroom id).
- **FR-NAV-4** Every screen change scrolls to top instantly.
- **FR-NAV-5** Gate screens take over the entire app in priority order:
  auth loading → login → classroom loading → **first-run wizard** → main
  app. The first-run wizard (2.0 item 1.7) is a 3-step guided flow for a
  user with no classroom — create classroom → start the school year →
  paste the roster (optional) → land on a populated dashboard — so a new
  teacher never dead-ends on an empty Students tab. It provisions via the
  raw API client and refreshes the classroom list only at the end, so the
  "has classroom → main app" redirect fires once everything is in place.
- **FR-NAV-6** If the classroom has no active school year, the Students tab
  is replaced by an empty state that routes to Settings (see FR-YR-8). The
  Stats tab stays reachable but shows zeros.
- **FR-NAV-7** Modal vocabulary: centered modal for destructive confirms and
  create-student; bottom sheet for pickers/flows (reason, amounts, bulk,
  switcher, invite, start-year); toast (bottom, above tab bar) for
  grant feedback with Undo.
- **FR-NAV-8** Archives are reachable *only* via Settings → School year →
  past year row. (Depth of this path is a known complaint — see doc 10.)

## Layout constraints

- Single-column, content max-width 720 px centered (feels fine on phone;
  iPad is just a stretched phone layout — no adaptive layout exists).
- Portrait-only on iOS.
- Bottom padding everywhere accounts for tab bar (64) + safe-area inset;
  bulk-select mode swaps the tab bar for a selection footer.
