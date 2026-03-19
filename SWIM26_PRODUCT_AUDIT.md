# SWIM26 Product UI Consistency Audit

## Objective

Unify the SWIM26 Home, League, Exchange, Store, and Popup surfaces into one premium mobile sports-game system with shared measurable rules for layout, spacing, sizing, boundaries, color usage, typography, buttons, cards, navigation, and state logic.

## Audit Findings and Corrections

### 1. Layout consistency

#### Inconsistencies found
- Home used a different containment model from League, Exchange, Store, and Popups: free-form Tailwind feature cards instead of a structured hero band plus supporting modules.
- Home used mixed glassmorphism language while the newer product surfaces used framed panel containment with measurable panel padding and border logic.
- Product-level pages used different assumptions for primary content priority:
  - League and Exchange = left rail + main feed + support rail.
  - Store = header + filter bars + product grid.
  - Home = decorative cards without explicit hero/content/support hierarchy.

#### Corrections
- Home now uses the same structure as the rest of the product:
  - **Primary hero band** for the highest-priority action.
  - **Secondary module cards** for alternate routes.
  - **Utility panel** for objectives/events.
- Primary content should always occupy **60–70% of horizontal attention**.
- Support modules should live in **24–34% side containment** or a smaller secondary grid, never float without a parent frame.

### 2. Spacing consistency

#### Inconsistencies found
- Home used mixed paddings (`p-8`, `p-4`, `gap-4`, `mb-5`) that did not map to SWIM26 token spacing.
- Store and Exchange mixed 36px, 40px, 44px, 48px, and 56px button heights without role-based reasoning.
- Similar cards sometimes used different internal spacing even when their information density was equivalent.

#### Corrections
- Standardize spacing tiers:
  - **Outer shell padding:** 24px horizontal, 18px top, 16px bottom.
  - **Primary section padding:** 24px.
  - **Secondary/internal card padding:** 16px.
  - **Tight grouping:** 10px.
  - **Module-to-module gap:** 16px.
- Only three CTA heights are allowed:
  - **40px tertiary**
  - **48px standard/secondary**
  - **56px primary/confirm**

### 3. Sizing consistency

#### Inconsistencies found
- Home feature modules did not follow the same measurable size logic as Store/League/Exchange.
- Store product CTAs were shorter than comparable secondary actions elsewhere.
- Some list/support buttons used smaller radii and heights than visually equivalent controls.

#### Corrections
- Standardize control sizes:
  - **Header icon button:** 48×48.
  - **Standard icon container:** 44×44.
  - **Status chip:** 28px height.
  - **Tab strip:** 42px height.
  - **Primary CTA:** 56px height.
  - **Secondary CTA:** 48px height.
- Hero cards should target an approximate **1.7–2.1:1 width-to-height ratio**.
- Feed rows should stay near **88px min height**.

### 4. Boundary consistency

#### Inconsistencies found
- Home relied on mixed Tailwind radii and weaker containment than the other product surfaces.
- Some smaller buttons used `radius.sm` while adjacent primary cards used `radius.md` or custom values.
- Overlay frame radius sat outside the main page panel rhythm.

#### Corrections
- Standardize boundary roles:
  - **Shell/frame:** 18px radius.
  - **Internal cards/subpanels:** 14px radius.
  - **Micro controls/icon buttons:** 10px radius.
  - **Pills/chips:** full pill radius.
- Use thin borders for normal containment and strong borders only for premium, active, or modal emphasis.

### 5. Color token consistency

#### Inconsistencies found
- Home overused custom blue values instead of SWIM26 accent tokens.
- Several modules used direct inline RGBA values without a consistent accent hierarchy.
- Product surfaces occasionally drifted between “cyan-led” and “gold-led” emphasis without role definition.

#### Corrections
- Role-based color usage:
  - **Cyan** = active, live, actionable, navigation-selected.
  - **Gold** = premium, rank prestige, featured rewards.
  - **Green** = completion/success.
  - **Orange/Red** = countdown urgency, alerts, limited windows.
- Any alternate accent must still preserve dark-surface containment and the same border opacity rhythm.

### 6. Typography consistency

#### Inconsistencies found
- Home used headline treatments that did not map cleanly to tokenized screen/section/card hierarchy.
- Body text sizes on some cards drifted between 12px, 13px, and 14px without density logic.

#### Corrections
- Typography rules:
  - **Screen title:** 24/28, weight 700.
  - **Display title / hero headline:** 34/38, weight 800.
  - **Section title:** 18/22, weight 700.
  - **Card title:** 16/20, weight 600–700.
  - **Body support:** 13–14/18–20.
  - **Metadata:** 12/15, uppercase or semi-uppercase.
  - **Helper:** 11/14.

### 7. Button consistency

#### Inconsistencies found
- Equivalent “inspect / buy / navigate / continue” actions did not share height, radius, or letter-spacing.
- Home used class-based CTA styling while the rest of the product used tokenized inline styles.
- Store card CTA was undersized relative to Exchange and Popup actions.

#### Corrections
- Buttons must be standardized by role, not by page:
  - **Primary:** filled, 56px height, highest contrast.
  - **Secondary:** outlined/wash, 48px height.
  - **Tertiary:** low-emphasis, 40px height.
- “Back” is always secondary.
- “Buy / Inspect / Manage / Invite / Open” only become primary when they advance the main user journey for that surface.

### 8. Card template consistency

#### Inconsistencies found
- Home feature cards were visually richer but structurally disconnected from Store, League, and Exchange card templates.
- Product cards and utility cards did not always share the same top/meta/body/footer rhythm.

#### Corrections
- Standardize all cards around one structure:
  1. **Eyebrow/meta row**
  2. **Primary title/value**
  3. **Support text or art zone**
  4. **State/CTA footer**
- Variant-specific visuals are allowed, but card scaffolding must stay stable.

### 9. Navigation consistency

#### Inconsistencies found
- Home did not expose the same clear route hierarchy as League/Store/Exchange.
- Top-level tabs and mode switches used similar visuals but were not always driven by the same height and active-state logic.

#### Corrections
- Navigation rules:
  - **Top bar = global orientation**
  - **Tab strip = local mode/category**
  - **Side rail = secondary taxonomy**
  - **Bottom nav = persistent product route**
- Active nav state always requires:
  - accent border or outline
  - accent wash
  - stronger text color
  - optional top indicator bar only for tab strips, not arbitrary card buttons

### 10. State logic consistency

#### Inconsistencies found
- Pages used similar but not identical logic for active, unread, locked, cooldown, and premium states.
- Store and Exchange had action sizing differences that weakened state trust.
- Home had no explicit inactive/active module state system beyond decorative treatment.

#### Corrections
- Product states must behave the same everywhere:
  - **Active/selected:** cyan border, accent wash, level-2 elevation.
  - **Unread/new/live:** accent border plus accent wash, never only text color.
  - **Locked:** lowered opacity, reduced saturation, neutral border.
  - **Cooldown:** warning/orange metadata, subdued button.
  - **Claimed/completed:** gold or green confirmation treatment, never plain grey.

## Surface-Level Implementation Rules

### Home
- **Width/height relationship:** primary hero band spans the full available width, with the active route split approximately **55/45** between visual hero and control detail. Secondary route cards sit in a **3-column grid**.
- **Padding logic:** 24px shell padding, 24px hero panel padding, 16px internal panel padding.
- **Alignment logic:** all hero content bottom-aligns over media; detail panels top-align title and description, bottom-align action row.
- **Active/inactive state logic:** inactive routes stay contained inside subpanels; the selected route expands into the hero/detail split.
- **Visual priority level:** hero = priority 1, secondary routes = priority 2, objective/event utility = priority 3.
- **Containment method:** full shell panel > internal subpanel > chip/button.

### League
- **Width/height relationship:** left summary rail should occupy roughly **32–36%**; right feed/content column should occupy **64–68%**.
- **Padding logic:** 24px rail and content padding, 16px for stat modules/feed rows.
- **Alignment logic:** summary rail stacks top-to-bottom with fixed internal sections; feed column follows header, tabs, then scroll region.
- **Active/inactive state logic:** tab selection uses accent border + accent wash; unread feed items use the same accent-wash pattern as live cards.
- **Visual priority level:** summary identity + live feed are priority 1; stat tiles and supporting notices are priority 2.
- **Containment method:** championship/club identity shell, then stat tiles, then feed cards.

### Exchange
- **Width/height relationship:** **23/47/30** split between guide rail, main conversion rail, and support options.
- **Padding logic:** 24px for primary route cards/guide rail, 16px for input/output/internal modules.
- **Alignment logic:** conversion cards use left-to-right transformation logic: inputs → convert node → output.
- **Active/inactive state logic:** selected route uses level-2 emphasis; locked side options reduce opacity and switch to neutral/disabled button state.
- **Visual priority level:** selected conversion card = priority 1, guide/context rail = priority 2, quick routes = priority 3.
- **Containment method:** full route card containing fixed input/output subframes.

### Store
- **Width/height relationship:** left filter rail should remain near **220px fixed width**; product grid occupies the remainder in a **3-column** scalable grid.
- **Padding logic:** 24px for shell/header, 16px for product cards, 10px for tab-strip internals.
- **Alignment logic:** top taxonomy tabs align evenly; subcategory rail is vertical; product cards use title → art → price/action → metadata footer.
- **Active/inactive state logic:** active categories use accent outline and wash; products differentiate premium/resource/featured through border and wash, not layout changes.
- **Visual priority level:** top category selection = priority 1 for navigation, featured product cards = priority 1 for merchandising, other products = priority 2.
- **Containment method:** page shell > category rails > standardized product cards.

### Popup / Offer Overlay
- **Width/height relationship:** centered popup should sit at roughly **70–78% of viewport width** on wide layouts; anchored monetization sheets use narrower widths and stronger footer action emphasis.
- **Padding logic:** 24px modal shell padding, 16px card and progression subpanel padding.
- **Alignment logic:** header top-aligns title/subtitle/timer; content scrolls internally; CTA row anchors to the bottom.
- **Active/inactive state logic:** reward tile, progression node, and CTA state logic must match page-level state definitions.
- **Visual priority level:** title + CTA = priority 1, progression path/reward cards = priority 2, footnote copy = priority 3.
- **Containment method:** dim layer > modal frame > subpanel > reward tile > chip/button.

## Babylon.js UI Layer Rules

### Global rules
- Use a **12-column virtual layout grid** for full-screen pages, with 24px-equivalent safe margins and 16px gutters.
- Preserve exactly three panel depths:
  - **Depth 1:** shell frames and major surfaces.
  - **Depth 2:** internal subpanels and action modules.
  - **Depth 3:** chips, icons, and local controls.
- Do not introduce page-specific radii outside the approved set: **10 / 14 / 18 / pill**.

### Containers
- Every Babylon GUI container should declare:
  - width ratio
  - min height
  - padding
  - background surface tier
  - border opacity
  - interaction state map
- Avoid floating standalone text on the scene; all text belongs to a container, card, band, or chip.

### Text
- Convert typography into explicit Babylon text styles:
  - `displayHeading`
  - `screenTitle`
  - `sectionTitle`
  - `cardTitle`
  - `metadata`
  - `helper`
- Use uppercase only for metadata/tabs/labels, not for full paragraphs.

### Buttons
- Babylon buttons must implement the same 3-role system:
  - `primary`
  - `secondary`
  - `tertiary`
- Buttons must expose state maps for:
  - default
  - hover/focus
  - pressed
  - disabled
  - locked
  - success/claimed

### Cards
- Babylon card templates must be reusable prefabs:
  - `heroCard`
  - `summaryRailCard`
  - `feedRowCard`
  - `productCard`
  - `rewardCard`
  - `supportOptionCard`
- Each prefab should preserve the same internal spacing and section order regardless of content theme.

### Navigation
- Use one unified active-state shader or border treatment for:
  - tab buttons
  - side taxonomy buttons
  - bottom route selectors
- Only tab strips should use a top accent indicator bar.

### State logic
- Define one central state map:
  - `default`
  - `active`
  - `inactive`
  - `unread`
  - `live`
  - `locked`
  - `cooldown`
  - `claimed`
  - `premium`
- All Babylon widgets should consume that state map rather than page-local color logic.

## Production-Ready Standard

The product is considered unified when every surface:
- shares the same shell/frame language,
- uses one spacing ladder,
- resolves buttons by action role instead of page,
- keeps state meaning consistent,
- and can be rebuilt in Babylon.js from reusable templates without inventing new one-off measurements.
