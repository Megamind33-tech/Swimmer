## 2026-04-02 - Missing ARIA Labels on Close Buttons
**Learning:** Icon-only close buttons in modals/overlays (like ProspectNegotiateOverlay, AthleteDetailOverlay, ProfileOverlay) were missing ARIA labels, which causes screen readers to announce them incorrectly.
**Action:** Always add aria-label and ensure focus states are accessible (e.g. using focus-visible:ring-2 focus-visible:ring-[#D4A843] focus-visible:outline-none) when adding icon-only buttons.
