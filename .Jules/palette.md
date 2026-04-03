## 2025-04-03 - Icon-only Navigation Accessibility
**Learning:** Navigation and HUD buttons using only icons lacked explicit ARIA labels, titles, and keyboard focus indicators, making them difficult for screen readers and keyboard users to interpret.
**Action:** Applied `aria-label`, `title`, and standard `focus-visible:ring-2` focus states to all global navigation and profile buttons.
