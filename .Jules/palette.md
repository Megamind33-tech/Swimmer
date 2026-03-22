## 2024-03-20 - Adding ARIA labels to currency badges
**Learning:** In a highly visual lobby UI (like TopUtilityBar), decorative or icon-based currency indicators need descriptive aria-labels. Screen readers would otherwise just read out the numbers (e.g. "100K 100K") without specifying what currency they represent.
**Action:** When adding or modifying compact stat indicators (like Coins and Gems badges), ensure the aria-label explicitly states the value and the type of stat being represented.

## 2024-05-17 - Adding ARIA labels to utility icon buttons
**Learning:** Utility icon-only buttons (like Search, Filter, Settings) in top headers often lack ARIA labels, titles, and keyboard focus states. Without them, screen readers cannot describe the button's action and keyboard navigation is invisible.
**Action:** Consistently apply `aria-label`, `title` (for tooltips), and `focus-visible` ring styling to all icon-only utility buttons across HUD and store interfaces.
## 2024-05-24 - Interactive Element Focus Pattern
**Learning:** The application uses `#D4A843` (gold) as a primary accent color for active/highlighted states (e.g., OVR ratings, active events). For interactive elements on dark backgrounds, a standard white focus ring can be jarring.
**Action:** Establish `focus-visible:ring-2 focus-visible:ring-[#D4A843] focus-visible:outline-none` as the standard reusable focus state pattern for highly interactive dark-themed components (like SideMenu and HUD elements) across the design system to maintain thematic consistency while providing clear accessibility focus.
