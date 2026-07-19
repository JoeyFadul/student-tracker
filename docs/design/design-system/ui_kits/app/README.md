# Well Done — app UI kit

Interactive recreation of the Well Done iOS app (390×780 frame), composed from the design-system bundle (`window.WellDoneDesignSystem_96828f`).

Flows: sign in → dashboard roster (search, sort, bulk-select mode) → tap a student → profile (hero points, quick grant 1/2/5/… → reason sheet → undo toast) → Stats bento → Settings.

Files: `index.html` shell + state · `Screens1.jsx` Login, Dashboard, StudentListItem, SortControl · `Screens2.jsx` Profile, ReasonSheet, QuickGrantRow, Stats, Settings · `data.js` sample roster.

Source of truth: `student-tracker/frontend/src/components/*` — values copied exactly (56px rows, radius 20 cards, 64px hero, honey bento). Not recreated: onboarding, archives, custom-amount sheet, add/delete-student modals (see repo).
