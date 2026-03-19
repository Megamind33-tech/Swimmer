# SWIM26 Global UI Design System

This document defines the production UI system for SWIM26 before any individual screen redesign. It is written for Babylon.js-driven mobile game menus and overlays rendered in landscape orientation only.

## 1. System Operating Constraints

- **Primary target orientation:** landscape only.
- **Viewport classes:**
  - **L-Compact:** 568–667 px height band with 896–1138 px width band.
  - **L-Standard:** 668–767 px height band with 1139–1334 px width band.
  - **L-Wide:** 768–900 px height band with 1335–1600 px width band.
- **Reference layout frame:** `1366 × 768`.
- **Minimum supported touch target:** `44 × 44 px`; preferred primary target is `52 × 52 px`.
- **Maximum simultaneous priority zones:** 4.
  1. top utility bar
  2. primary hero / active progression zone
  3. secondary content rail / module stack
  4. persistent bottom navigation
- **No floating orphan elements:** every chip, badge, CTA, timer, or profile node must be anchored to a parent panel edge, grid line, or fixed nav rail.

## 2. Layout Grid

### 2.1 Landscape Safe Frame

Use a 12-column grid inside a safe content frame.

| Token | Value | Rule |
|---|---:|---|
| `layout.safe.left` | `24px` | Minimum inset from left device edge. Increase to `32px` in L-Wide. |
| `layout.safe.right` | `24px` | Mirrors left safe inset. |
| `layout.safe.top` | `18px` | Minimum top inset for camera cutouts and browser chrome protection. |
| `layout.safe.bottom` | `16px` | Bottom inset beneath bottom nav shadow footprint. |
| `layout.grid.columns` | `12` | Global desktop-style logic adapted for landscape mobile. |
| `layout.grid.gutter` | `16px` | Standard horizontal space between modules. |
| `layout.grid.rowGap` | `16px` | Standard vertical separation between stacked sections. |
| `layout.grid.maxWidth` | `1440px` | Content stops widening past this width and recenters. |

### 2.2 Primary Alignment Rules

#### Top utility bar
- **Width / height relationship:** full safe-frame width × fixed height token.
- **Padding logic:** horizontal safe inset; internal child gap uses `space.md`.
- **Alignment logic:** three-zone structure: left = profile block, center = screen or mode context, right = currencies + utilities.
- **Active / inactive state logic:** active utility items use filled accent container; inactive items use neutral ghost container.
- **Visual priority:** Level 2.
- **Containment method:** anchored full-width top panel with bottom divider and elevation level 1.

#### Hero area
- **Width / height relationship:** `7/12` to `8/12` columns in two-column layouts, `100%` width in single-column compact layouts; target height `0.34–0.42` of safe content height.
- **Padding logic:** `space.lg` horizontal + `space.lg` vertical on standard; `space.md` on compact.
- **Alignment logic:** left-aligned content block with optional right-aligned media/stat stack; all hero internals snap to column edges.
- **Active / inactive state logic:** hero is always the active content anchor for the screen; secondary hero actions can rest or emphasize based on focus.
- **Visual priority:** Level 1.
- **Containment method:** elevated hero shell with reinforced border, inner gradient scrim, and bounded media mask.

#### Side modules / secondary rail
- **Width / height relationship:** `4/12` to `5/12` columns beside hero, or full-width stacked cards under hero on compact widths.
- **Padding logic:** panel shell `space.md`, nested card padding `space.sm` or `space.md` based on density.
- **Alignment logic:** modules align top edges with hero top or hero baseline; cards stack with fixed row gap.
- **Active / inactive state logic:** one side module can be selected via accent rail and strong outline; others remain neutral.
- **Visual priority:** Level 3.
- **Containment method:** modular card stack with shared parent rail or explicit vertical rhythm.

#### Bottom navigation
- **Width / height relationship:** full safe-frame width × fixed nav height.
- **Padding logic:** outer padding uses `space.sm` vertical and `space.md` horizontal; each item gets equal width.
- **Alignment logic:** horizontally centered, equalized 5-slot or 4-slot distribution; label baselines align across all items.
- **Active / inactive state logic:** active item uses accent icon, filled top indicator, brighter label; inactive item stays muted but readable.
- **Visual priority:** Level 2.
- **Containment method:** docked panel with strong top border and opaque surface to prevent blending into the scene.

### 2.3 Canonical Screen Region Map

| Region | Grid Span | Height Behavior | Notes |
|---|---|---|---|
| `region.topBar` | `1 / -1` | Fixed | Must always exist on menu screens. |
| `region.heroPrimary` | `1 / span 8` | Flexible, min `224px`, max `320px` | Primary engagement target. |
| `region.sideRail` | `9 / -1` | Matches hero or exceeds by max 1 stacked module | Secondary progression / offers / quick actions. |
| `region.contentBand` | `1 / -1` | Auto-fill | For rows beneath hero. |
| `region.bottomNav` | `1 / -1` | Fixed | Persistent navigation shell. |

## 3. Spacing Scale

Spacing is a hard token system. No ad hoc values are allowed outside these tokens.

| Token | Value | Use Cases |
|---|---:|---|
| `space.xs` | `6px` | icon-label micro gap, badge inset, internal divider breathing room |
| `space.sm` | `10px` | compact card padding, chip horizontal inset, tight utility spacing |
| `space.md` | `16px` | default panel padding, standard card gap, top-bar group spacing |
| `space.lg` | `24px` | hero/card padding, section separation, button horizontal padding |
| `space.xl` | `32px` | major section offset, hero media split, wide CTA grouping |

### 3.1 Required Application Rules

| UI usage | Required token |
|---|---|
| panel padding | `space.md` default, `space.lg` for hero and modal panels |
| card padding | `space.sm` for compact cards, `space.md` for standard cards |
| gap between cards | `space.md` |
| gap between icon and label | `space.xs` for badges/tabs, `space.sm` for buttons/nav |
| button internal padding | `space.sm` vertical + `space.lg` horizontal for standard buttons |
| top bar item spacing | `space.md` between major groups, `space.sm` within groups |
| bottom navigation spacing | `space.sm` internal item gap; `space.md` outer content inset |

## 4. Sizing Scale

### 4.1 Structural Heights and Control Sizes

| Token | Value | Rule |
|---|---:|---|
| `size.topBar.height` | `72px` | Fixed shell height for all menu screens. |
| `size.bottomNav.height` | `86px` | Fixed anchored nav height including active indicator band. |
| `size.icon.xs` | `14px` | Metadata, badges, inline status icons. |
| `size.icon.sm` | `18px` | Chips, compact buttons, list metadata. |
| `size.icon.md` | `22px` | Utility buttons, currency chips, nav icons on compact devices. |
| `size.icon.lg` | `28px` | Hero support actions, featured modules. |
| `size.icon.xl` | `36px` | Hero glyphs or major promotional surfaces only. |
| `size.touch.min` | `44px` | Minimum touch target. |
| `size.touch.preferred` | `52px` | Preferred target for primary interactive controls. |

### 4.2 Card and Module Dimensions

| Token | Value |
|---|---:|
| `size.card.small.w` | `180px` |
| `size.card.small.h` | `108px` |
| `size.card.medium.w` | `240px` |
| `size.card.medium.h` | `144px` |
| `size.card.large.w` | `320px` |
| `size.card.large.h` | `188px` |
| `size.card.hero.minW` | `560px` |
| `size.card.hero.maxW` | `920px` |
| `size.card.hero.h` | `260px` |
| `size.profileBlock.w` | `220px` |
| `size.profileBlock.h` | `56px` |
| `size.currencyCounter.w` | `124px` |
| `size.currencyCounter.h` | `40px` |
| `size.statusChip.h` | `28px` |
| `size.badge.h` | `20px` |
| `size.tab.h` | `42px` |

### 4.3 Button Tiers

| Token | Width Logic | Height |
|---|---|---:|
| `size.button.compact` | auto, min `92px` | `40px` |
| `size.button.standard` | auto, min `132px` | `48px` |
| `size.button.cta` | auto, min `188px` | `56px` |

### 4.4 Section Dimensional Relationships

#### Top bar profile block
- **Approximate width and height relationship:** `220 × 56 px`, avatar area consumes ~`23%` width.
- **Padding logic:** `space.sm` horizontal, `space.xs` vertical.
- **Alignment logic:** avatar left, text stack center-left, status chevron or level right.
- **Active / inactive state logic:** never visually “inactive”; can enter pressed state only.
- **Visual priority:** Level 2.
- **Containment method:** compact bordered panel clipped to medium radius.

#### Hero card
- **Approximate width and height relationship:** width `2.15–3.55×` height, default `640–920 × 260 px`.
- **Padding logic:** outer `space.lg`; internal block gap `space.md`; CTA row top margin `space.lg`.
- **Alignment logic:** content aligns to left 55–62% of card, media/ornament aligns right 38–45%.
- **Active / inactive state logic:** active hero uses accent edge, richer overlay contrast, and elevated CTA; inactive hero variant drops to standard panel border.
- **Visual priority:** Level 1.
- **Containment method:** large reinforced surface with image mask, scrim layer, and content-safe inset.

#### Side module card
- **Approximate width and height relationship:** `240–320 × 144–188 px`.
- **Padding logic:** `space.md` all sides.
- **Alignment logic:** top-left title block, bottom-right secondary stat or action.
- **Active / inactive state logic:** active module gets left accent rail or outer ring; inactive uses secondary surface only.
- **Visual priority:** Level 3.
- **Containment method:** standard panel shell, optional internal divider.

#### Bottom nav item
- **Approximate width and height relationship:** equal-width slot within `86px` nav shell; icon stack uses ~`70%` of slot height.
- **Padding logic:** `space.xs` between icon and label, `space.sm` top inset.
- **Alignment logic:** strict vertical center, icon centered over label.
- **Active / inactive state logic:** active label at 100% opacity and accent; inactive at 62% opacity.
- **Visual priority:** Level 2.
- **Containment method:** item sits inside shared nav dock; selected item also receives local top marker.

## 5. Boundary System

All components must read as contained modules over the background. Surface contrast must win over scene art.

### 5.1 Border and Radius Tokens

| Token | Value | Rule |
|---|---:|---|
| `boundary.border.thin` | `1px` | Default cards, chips, utility buttons. |
| `boundary.border.strong` | `2px` | Active panels, hero shells, selected tabs. |
| `boundary.radius.sm` | `10px` | Chips, badges, utility buttons. |
| `boundary.radius.md` | `14px` | Standard cards, tabs, segmented items. |
| `boundary.radius.lg` | `18px` | Hero cards, modals, bottom nav shell. |
| `boundary.radius.pill` | `999px` | Currency chips, countdown chips, micro badges. |

### 5.2 Surface Opacity Tokens

| Token | Value |
|---|---:|
| `surface.opacity.primary` | `0.94` |
| `surface.opacity.secondary` | `0.88` |
| `surface.opacity.tertiary` | `0.78` |
| `surface.opacity.overlayCard` | `0.72` |

### 5.3 Divider, Elevation, and State Treatments

| Token | Value | Rule |
|---|---:|---|
| `boundary.divider.default` | `1px solid rgba(255,255,255,0.10)` | Internal section splits. |
| `boundary.divider.emphasis` | `1px solid rgba(74, 201, 214, 0.24)` | Accent-driven section splits. |
| `elevation.level0` | `none` | Flat chips in dense lists only. |
| `elevation.level1` | `0 4px 12px rgba(0,0,0,0.24)` | Top bar, bottom nav, standard cards. |
| `elevation.level2` | `0 8px 20px rgba(0,0,0,0.32)` | Hero cards, active mode cards. |
| `elevation.level3` | `0 12px 28px rgba(0,0,0,0.42)` | Modal / featured promotional surfaces. |
| `shadow.intensity.active` | `+18% alpha over base level` | Only for selected/active modules. |

### 5.4 Highlight and Selection Rules

- **Highlighted state treatment:** add `2px` accent border on the anchor edge plus low-opacity accent wash (`8–10%`).
- **Selected state treatment:** swap to strong border token, increase text contrast to primary, and add `elevation.level2` minimum.
- **Active module outline treatment:** outer stroke `2px` in `color.accent.primary` at `80%` opacity for active modules; never use diffuse glow.
- **Disabled treatment:** keep structure visible, reduce fill contrast by `18%`, text to disabled token, remove strong shadow.
- **Locked treatment:** overlay top-right lock badge, reduce saturation by `22%`, maintain readable title at `85%` opacity.

## 6. Color Tokens

Palette direction: premium sports presentation with deep navy / graphite foundation, aquatic teal identity, restrained gold premium accents, emerald progression, and coral urgency.

| Token | Value | Usage |
|---|---:|---|
| `color.bg.app` | `#07131C` | Root app background behind all surfaces. |
| `color.surface.primary` | `rgba(13, 27, 39, 0.94)` | Primary panels and nav shells. |
| `color.surface.secondary` | `rgba(20, 38, 54, 0.90)` | Secondary cards and stacked modules. |
| `color.surface.tertiary` | `rgba(28, 50, 69, 0.82)` | Hover/raised inset zones and tabs. |
| `color.text.primary` | `#F4FAFF` | Main titles and readable primary copy. |
| `color.text.secondary` | `rgba(228, 239, 247, 0.76)` | Secondary labels and supporting info. |
| `color.text.disabled` | `rgba(196, 208, 219, 0.42)` | Disabled labels and unavailable metadata. |
| `color.accent.primary` | `#4AC9D6` | Swim identity accent, active borders, selected icons. |
| `color.accent.secondary` | `#1E8FA3` | Secondary active states, segmented fills, subtle progress. |
| `color.feedback.success` | `#36C690` | Positive progression, upgraded states, confirmed rewards. |
| `color.feedback.warning` | `#FF9E57` | Time-sensitive or caution states. |
| `color.feedback.alert` | `#F06A5F` | Urgent error / lock / deadline state. |
| `color.featured.premium` | `#D6B45A` | Featured packs, premium events, top-rank highlights. |
| `color.divider` | `rgba(255,255,255,0.10)` | Divider and border default. |
| `color.overlay.dim` | `rgba(3, 10, 16, 0.62)` | Scene dim behind modals and hero text. |

### 6.1 Color Usage Rules

- Use `color.accent.primary` for selection and swim-brand identity only; do not flood entire panels with it.
- Use `color.featured.premium` only where the feature has economy or prestige weight.
- Use `color.feedback.warning` for countdown urgency, low inventory, limited-time promotions.
- Use `color.feedback.alert` for destructive actions, expired states, and blocked progression.
- Never pair more than one accent-colored border within the same module.

## 7. Typography System

Typography must remain legible in mobile landscape at arm’s-length viewing distance.

| Style Token | Size | Weight | Case | Line Height | Letter Spacing | Rule |
|---|---:|---:|---|---:|---:|---|
| `type.displayHeading` | `34px` | `800` | Uppercase or title case for brand hero only | `38px` | `-0.02em` | Max 2 lines. |
| `type.screenTitle` | `24px` | `700` | Title case preferred | `28px` | `-0.01em` | Top-bar center or hero title support. |
| `type.sectionTitle` | `18px` | `700` | Title case | `22px` | `0em` | Section labels, side modules. |
| `type.cardTitle` | `16px` | `600` | Title case | `20px` | `0em` | Standard card heading. |
| `type.buttonLabel` | `15px` | `700` | Uppercase for CTA, title case for standard | `16px` | `0.04em` CTA / `0.01em` standard | Single line only. |
| `type.tabLabel` | `13px` | `600` | Title case | `16px` | `0.02em` | Keep under 14 characters. |
| `type.metadata` | `12px` | `500` | Sentence or uppercase micro labels | `15px` | `0.03em` if uppercase | Use for timers, tags, context. |
| `type.helper` | `11px` | `500` | Sentence case | `14px` | `0.01em` | Secondary explanation only. |
| `type.numeric` | `20px` | `700` | Tabular numerals | `22px` | `-0.01em` | Currency and countdown emphasis. |

### 7.1 Typography Hierarchy Logic

- Hero titles must outscale section titles by at least `1.4×`.
- Currency and score numbers can match `type.screenTitle` weight but use numeric tabular glyphs.
- Metadata labels must never exceed `70%` of the card title size.
- Button labels should remain horizontally centered even when icons are present; use fixed icon slot width to avoid visual drift.

## 8. Reusable Components

### 8.1 Top Bar Profile Block
- **Dimensions:** `220 × 56 px`.
- **Padding:** `space.sm` horizontal, `space.xs` vertical.
- **Text hierarchy:** player name uses `type.cardTitle`; club/level metadata uses `type.helper`.
- **Icon placement:** avatar `40 × 40 px` leading; optional league icon trailing at `18 px`.
- **Active / inactive / disabled / locked:**
  - active press: surface shifts to tertiary, border accent at 45%.
  - inactive: standard primary surface.
  - disabled: not allowed for profile block.
  - locked: not allowed.
- **Width and height relationship:** `3.9:1`.
- **Alignment logic:** horizontal row; avatar and text vertically centered.
- **Visual priority:** Level 2.
- **Containment:** bordered compact panel.

### 8.2 Currency Chip
- **Dimensions:** `124 × 40 px` each; can collapse to `104 × 36 px` in dense bars.
- **Padding:** `space.sm` horizontal, `space.xs` vertical.
- **Text hierarchy:** amount uses `type.numeric` scaled to `18 px`; label/icon uses `type.metadata`.
- **Icon placement:** leading icon in `20 px` slot.
- **States:**
  - active: premium currency can highlight with featured border.
  - inactive: standard secondary surface.
  - disabled: dimmed only in store lockouts.
  - locked: overlay lock badge if currency source unavailable.
- **Visual priority:** Level 2.
- **Containment:** pill or rounded-rect shell with thin border.

### 8.3 Utility Icon Button
- **Dimensions:** `44 × 44 px` minimum, preferred `48 × 48 px`.
- **Padding:** implicit through fixed square.
- **Text hierarchy:** icon only; tooltip optional outside button.
- **Icon placement:** centered `22 px` icon.
- **States:**
  - active: tertiary fill + accent icon.
  - inactive: primary surface + secondary text icon.
  - disabled: muted icon, no shadow.
  - locked: lock glyph overlay at bottom-right.
- **Containment:** compact rounded-rect with thin border.

### 8.4 Hero Event Card
- **Dimensions:** width `560–920 px`, height `260 px`.
- **Padding:** `space.lg` all around.
- **Text hierarchy:** eyebrow metadata, display heading, supporting helper line, CTA row.
- **Icon/media placement:** right-side artwork or emblem column capped at 42% width.
- **States:**
  - active: strong accent rail, `elevation.level2`, high-contrast overlay.
  - inactive: secondary surface with default border.
  - disabled: no CTA, reduced overlay contrast.
  - locked: lock chip near title; CTA replaced by requirement text.
- **Visual priority:** Level 1.
- **Containment:** large card shell with image mask and overlay dim.

### 8.5 Secondary Mode Card
- **Dimensions:** `240–320 × 144–188 px`.
- **Padding:** `space.md`.
- **Text hierarchy:** title, short descriptor, stat or availability marker.
- **Icon placement:** top-right or leading left icon `28 px`; never center-floating.
- **States:** active = accent border + raised; inactive = neutral; disabled = dim + no shadow; locked = lock badge + desaturated art.
- **Visual priority:** Level 3.
- **Containment:** standard rounded panel.

### 8.6 Store Item Card
- **Dimensions:** `220 × 188 px` compact or `260 × 208 px` featured.
- **Padding:** `space.md`; price row gets `space.sm` top separation.
- **Text hierarchy:** item title, rarity/benefit metadata, price numeric.
- **Icon placement:** top media block `72–96 px` high; price chip bottom-right.
- **States:** featured uses premium accent; inactive neutral; disabled purchase dims price; locked shows unlock criteria ribbon.
- **Visual priority:** Level 3, or Level 2 when featured.
- **Containment:** card with internal media frame and footer divider.

### 8.7 Reward Card
- **Dimensions:** `200 × 128 px` or `220 × 140 px`.
- **Padding:** `space.md`.
- **Text hierarchy:** reward type metadata, reward name/value, claim state helper text.
- **Icon placement:** centered reward icon in upper half; status chip bottom-left.
- **States:** claimable active accent; claimed muted tertiary; disabled for unavailable tiers; locked with overlay.
- **Visual priority:** Level 3.
- **Containment:** compact panel with bottom action strip.

### 8.8 Info Panel
- **Dimensions:** fluid width, min height `104 px`.
- **Padding:** `space.md` default, `space.lg` if modal-like.
- **Text hierarchy:** section title, body/helper, optional stat row.
- **Icon placement:** optional leading icon or top-right utility action.
- **States:** active only when selected from a tab/segment; otherwise neutral.
- **Visual priority:** Level 3.
- **Containment:** secondary panel with visible divider treatment.

### 8.9 Tab Group
- **Dimensions:** container height `42 px`; each tab min width `96 px`.
- **Padding:** outer `space.xs`; tab internal horizontal `space.md`.
- **Text hierarchy:** `type.tabLabel` only.
- **Icon placement:** optional leading `16 px` icon.
- **States:**
  - active: filled tertiary/primary-accent blend, strong border.
  - inactive: transparent over shared container.
  - disabled: muted text and no press feedback.
  - locked: lock icon before label.
- **Visual priority:** Level 3.
- **Containment:** shared segmented shell.

### 8.10 Segmented Control
- **Dimensions:** height `40 px`, segment min width `80 px`.
- **Padding:** `space.xs` outer, `space.sm` segment inset.
- **Text hierarchy:** short labels only.
- **Icon placement:** optional icon preceding text by `space.xs`.
- **States:** active segment uses accent fill; inactive uses transparent fill; disabled dims group; locked segment uses lock icon.
- **Visual priority:** Level 4.
- **Containment:** unified pill or rounded group.

### 8.11 CTA Button Variants

#### Primary CTA
- **Dimensions:** min `188 × 56 px`.
- **Padding:** `space.sm` vertical, `space.lg` horizontal.
- **Text hierarchy:** uppercase `type.buttonLabel`.
- **Icon placement:** optional leading `18 px` icon in fixed slot.
- **States:** active = accent fill, dark text or dark border; inactive = not applicable; disabled = muted fill and disabled text; locked = replace icon with lock and suppress press.
- **Visual priority:** Level 1 or 2 depending on location.
- **Containment:** filled rounded-rect with strong border.

#### Secondary CTA
- **Dimensions:** min `132 × 48 px`.
- **Padding:** `space.sm` vertical, `space.md` horizontal.
- **States:** outlined neutral by default; active hover/press becomes tertiary fill.
- **Visual priority:** Level 2.
- **Containment:** bordered shell.

#### Tertiary / Ghost CTA
- **Dimensions:** min `92 × 40 px`.
- **Padding:** `space.xs` vertical, `space.sm` horizontal.
- **States:** text-led; active adds tertiary fill. For overflow actions only.
- **Visual priority:** Level 4.
- **Containment:** transparent with subtle edge on press.

### 8.12 Notification Badge
- **Dimensions:** dot `10 px`; count badge `18–22 px` height.
- **Padding:** count badge horizontal `space.xs`.
- **Text hierarchy:** `type.helper` or `10 px` numeric bold.
- **Icon placement:** anchored top-right outside parent icon’s visual mass by `-2 px` to `-4 px`.
- **States:** active only; disabled badges are not shown.
- **Visual priority:** Level 2 by color contrast, Level 4 structurally.
- **Containment:** pill or circular badge with alert or premium fill.

### 8.13 Countdown Chip
- **Dimensions:** height `28 px`, min width `72 px`.
- **Padding:** `space.xs` vertical, `space.sm` horizontal.
- **Text hierarchy:** numeric uses `type.metadata` bold; optional icon `14 px`.
- **Icon placement:** leading clock icon or trailing urgent glyph.
- **States:** neutral = secondary surface; warning = warning border/fill wash; expired = alert surface.
- **Visual priority:** Level 2 when attached to hero, Level 3 elsewhere.
- **Containment:** pill shell.

### 8.14 Bottom Nav Item
- **Dimensions:** slot width = `20–25%` of nav width depending on 4 or 5 items; height lives inside `86 px` shell.
- **Padding:** top `space.sm`, bottom `space.xs`.
- **Text hierarchy:** icon first, `type.helper`/`12 px` label second.
- **Icon placement:** centered above label; icon size `24 px` standard.
- **States:**
  - active: icon accent, label primary, top indicator bar `3 px`, optional subtle tertiary tile.
  - inactive: icon/text secondary.
  - disabled: muted and non-interactive.
  - locked: lock badge overlay over icon, label still legible.
- **Visual priority:** Level 2.
- **Containment:** slot within anchored nav shell.

## 9. Navigation System

### 9.1 Top Utility Bar Structure

Top bar is a three-zone persistent frame.

| Zone | Width Rule | Contents |
|---|---|---|
| `nav.top.left` | `22–28%` | profile block or back navigation cluster |
| `nav.top.center` | `32–40%` | screen title, season/event context, tabs if needed |
| `nav.top.right` | `32–40%` | currencies, notifications, settings, inbox |

Rules:
- Use `justify-between` at zone level, not per individual control.
- Right-zone utility buttons appear after currencies, never before them.
- If top bar is dense, collapse low-priority items into a single overflow utility button once right-zone width exceeds `40%`.

### 9.2 Persistent Bottom Navigation Structure

- Use 4 items when the app flow is depth-heavy; use 5 items when store/social/rewards all need first-level access.
- Equal slot widths only. No oversized center notch unless the whole system is built around a single primary action.
- Navigation shell remains opaque enough to separate from background scene art.

### 9.3 State Styling

- **Active:** icon `color.accent.primary`, label `color.text.primary`, top indicator `3 px`, local tile `color.surface.tertiary` at `72%` opacity.
- **Inactive:** icon and label `color.text.secondary`, no tile, borderless.
- **Pressed:** temporary tile brighten `+6%` luminance.
- **Disabled:** icon/label `color.text.disabled`, no indicator.

### 9.4 Notification Dot Placement

- Dot anchors to icon container top-right corner with local offset `x: +5 px`, `y: -1 px`.
- Dot must not shift icon alignment within the nav slot.

### 9.5 Icon-to-Label Alignment

- Icon box height `24 px`; label area height `14–16 px`.
- Total stack gap = `space.xs`.
- Label baseline should align to a shared baseline across all nav items.

### 9.6 Selected Tab Emphasis

- Selected tabs use filled tertiary surface plus `2 px` accent outline.
- Unselected tabs stay text-first with transparent fill.
- When tabs sit inside the top bar, selected state must remain visible against the top bar surface by increasing local contrast, not by increasing saturation beyond the system palette.

## 10. Background System

Backgrounds support content but never compete with it.

### 10.1 Rendering Rules

- Base layer: deep navy to graphite gradient, top-left darker than bottom-right.
- Mid layer: subtle aquatic lane-line motifs or blurred venue geometry at `6–10%` contrast.
- Lighting layer: soft spot or stadium wash behind hero zones only, capped at `14%` highlight gain.
- Motion layer: if animated, drift speed must remain below `12 px/sec` equivalent to avoid perceived UI instability.

### 10.2 Allowed Treatments

- soft aquatic gradients
- lane-line motifs
- blurred stadium seating or pool architecture
- diffused rim lighting behind featured modules
- subtle particulate bloom kept behind overlays

### 10.3 Prohibited Treatments

- high-contrast wave textures directly behind text
- bright neon cyan/purple gradients
- hard spotlight blooms under nav items
- detail-rich photos without dim/scrim containment
- multiple competing vignette centers

### 10.4 Readability Enforcement

- Any text-bearing module must sit over a local surface or scrim with effective contrast ratio target `≥ 4.5:1` for body text and `≥ 3:1` for large display text.
- If background image detail exceeds medium complexity, add a local `color.overlay.dim` scrim at `45–62%` under text content.

## 11. Responsive Rules

### 11.1 Hero and Module Width Rules

| Rule | Compact | Standard | Wide |
|---|---|---|---|
| hero min width | `520px` | `600px` | `680px` |
| hero max width | `100%` of content band | `820px` | `920px` |
| side module min width | `220px` | `240px` | `280px` |
| card shrink floor | `92%` of spec width`*` | `100%` | `100–110%` |

`*` Below the shrink floor, cards must reflow rather than continue compressing.

### 11.2 Shrink and Reflow Behavior

- If total top bar content exceeds safe width, first reduce inter-group spacing from `space.md` to `space.sm`, then collapse low-priority utilities.
- If hero + side rail cannot maintain `layout.grid.gutter`, stack the side rail below the hero.
- Cards can shorten title line length before reducing tap target or padding.
- Bottom nav labels can reduce from `12 px` to `11 px` on compact widths, but icon size cannot drop below `22 px`.

### 11.3 Touch and Text Rules

- Minimum touch target remains `44 × 44 px` in all breakpoints.
- Preferred text scaling range: `0.92–1.00` relative to reference. Do not exceed `1.05` in landscape; instead reflow modules.
- Numeric counters may truncate with locale-safe abbreviations after `7` characters.

### 11.4 Dense Top Bar Handling

- Priority order for retention: profile block > premium currency > core soft currency > notifications > settings > overflow extras.
- Screen title can compress into a shorter label or logo lockup once the center zone drops below `220 px`.
- Avoid squeezing all top-bar children equally; compress optional utilities first.

### 11.5 No Dead Space / No Overlap Rules

- Empty horizontal space inside the content band should not exceed one unused grid column when actionable modules exist.
- No panel may overlap the persistent bottom nav or top bar.
- All hero art must clip inside card bounds; decorative elements may bleed internally, never beyond the card mask.
- No element may approach closer than `layout.safe.left/right` to the viewport edge.
- No text may render under floating system cutout regions or browser overlays.

## 12. Babylon.js UI Layer Implementation Guidance

### 12.1 Architecture

- Treat the Babylon scene as the background plane.
- Render menu UI in a DOM or GUI layer with explicit z-bands:
  - `z.scene = 0`
  - `z.backgroundScrim = 10`
  - `z.surface = 20`
  - `z.nav = 30`
  - `z.modal = 40`
  - `z.toast = 50`
- Scene lighting and post-process must never alter UI token colors directly.

### 12.2 Implementation Rules

- Export tokens as shared constants and CSS variables.
- Every reusable component should receive only token references, not raw pixel literals.
- Use container queries or viewport-class props to switch between `L-Compact`, `L-Standard`, and `L-Wide` layout behavior.
- Preserve deterministic sizing for in-game overlays so animated counters and timers do not cause layout shift.

### 12.3 Production Checklist

Before redesigning any single screen, confirm that:
- grid frame tokens exist
- spacing tokens are imported everywhere
- card/button/nav sizes are pulled from one source
- all selected states use the same accent logic
- all disabled/locked states follow the same contrast logic
- top bar and bottom nav are persistent system components
- background contrast is subordinate to content modules

