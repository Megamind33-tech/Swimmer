## 2024-03-20 - Adding ARIA labels to currency badges
**Learning:** In a highly visual lobby UI (like TopUtilityBar), decorative or icon-based currency indicators need descriptive aria-labels. Screen readers would otherwise just read out the numbers (e.g. "100K 100K") without specifying what currency they represent.
**Action:** When adding or modifying compact stat indicators (like Coins and Gems badges), ensure the aria-label explicitly states the value and the type of stat being represented.

## 2024-05-17 - Adding ARIA labels to utility icon buttons
**Learning:** Utility icon-only buttons (like Search, Filter, Settings) in top headers often lack ARIA labels, titles, and keyboard focus states. Without them, screen readers cannot describe the button's action and keyboard navigation is invisible.
**Action:** Consistently apply `aria-label`, `title` (for tooltips), and `focus-visible` ring styling to all icon-only utility buttons across HUD and store interfaces.

## 2024-10-25 - Accessibility improvements for "Back" buttons in sub-screens
**Learning:** Back buttons containing text combined with icons (e.g. `<ChevronLeft /> Lobby`) in complex UI layers (like `StoreScreen`) might still be opaque to screen readers if the visual text ("Lobby") lacks context, or if keyboard navigation gets lost without focus indicators.
**Action:** Ensure that *all* navigational buttons, not just icon-only ones, have explicit `aria-label` and `title` attributes (e.g., "Back to Lobby") and implement the standard `focus-visible` ring convention (`focus-visible:ring-[#D4A843]`) so keyboard users can navigate complex, multi-layered interfaces.
