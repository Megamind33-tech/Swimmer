## 2026-04-24 - Semantic Accessibility on Interactive UI
**Learning:** Custom UI components built with `div` or `button` lacking proper semantics (like ARIA roles, checked states, labels) hide critical functionality from screen reader users. Specifically, custom toggles and icon-only buttons need explicit ARIA hints, and decorative elements inside buttons should be hidden.
**Action:** When building interactive components, always ensure semantic equivalents exist (e.g., `role="switch"` on toggles) and explicitly label icon-only elements.
