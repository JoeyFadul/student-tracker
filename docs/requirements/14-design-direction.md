# 14 · 2.0 Design Direction — "Gunmetal & Coral"

**Source of truth: the design-system package at
[`docs/design/design-system/`](../design/design-system/)** — tokens
(`tokens/*.css`), component specs (`components/*`), an interactive
recreation of every screen (`ui_kits/app/`), brand assets, and voice
guidelines. This doc records the direction's history and the decisions
that shaped it; when they disagree, the design system wins.

## History

| Date | Direction | Note |
|---|---|---|
| 2026-07-04 | "Warm Craft" | Warm-paper canvas, terracotta accent, honey/sage support colors |
| 2026-07-18 | "Clean Craft" | Canvas neutralized to near-white; warm cast read as peach |
| 2026-07-18 | **"Gunmetal & Coral"** | Owner-chosen palette ([coolors](https://coolors.co/palette/2d3142-bfc0c0-ffffff-ef8354-4f5d75)) packaged as a full design system; adopted in `redesign/phase-0` |

## The palette, structurally

All five colors do work — nothing is decorative:

- **White `#FFFFFF`** — canvas and cards (cards: hairline border + subtle
  gunmetal-ink shadow).
- **Silver `#BFC0C0`** — derives every neutral: fills `#ECEDEE`,
  hairlines `#DDDEE0`, inactive tabs, avatar tiles.
- **Gunmetal `#2D3142`** — primary text, and **chrome**: header band,
  tab bar, stats hero. Bars are thin and flat — square corners, compact
  padding, 24px title, 56px tab bar (Joey, 2026-07-18: the original 24px
  rounded corners and large-title band read as bulky and intrusive);
  only the stats hero card keeps rounded corners.
- **Slate `#4F5D75`** — secondary text, secondary fills, on-streak tile.
- **Coral `#EF8354`** — strictly meaningful: actions, points, streaks,
  FAB. Positive = coral. Destructive = derived red `#B8432D`.

Honey and sage are **retired** — no yellow/green in the system. Their
tokens survive as aliases (mapped to silver/slate) so old call sites
render correctly. Dark mode is system-follow: gunmetal becomes the
canvas (`#232734` bg, `#2D3142` surfaces), coral unchanged.

## Decisions reversed from earlier passes (deliberate)

1. **Dark chrome returns.** Warm/Clean Craft retired the dark header
   band; Gunmetal & Coral brings it back as the system's signature —
   gunmetal header + gunmetal frosted tab bar bookending the white
   canvas. Status bar text is white again (`Style.Dark`).
2. **The v1 tab bar treatment is replaced** (was: carried over
   unchanged). Now gunmetal frosted, rounded top corners, coral active /
   silver inactive.

## Carried forward unchanged

Rounded display face (`ui-rounded`) for titles/numerals/buttons; big
numbers as heroes (56–64px, weight 800); squircle shapes (avatars ~38%
radius); `usePressable` press feel; celebration restraint; emoji is
data (student avatars only), lucide icons for all UI; sentence case;
positive-first vocabulary. Full rules: design-system `readme.md`.

## Known package quirks

The design-system `readme.md` has two stale prose lines from the
prior pass (white tab-bar blur, honey avatar tiles); the tokens and kit
components are authoritative — the bar is gunmetal-frosted and avatar
tiles are silver.
