## 2024-05-18 - Missing Accessibility on Custom Navigation Components
**Learning:** Custom application navigation often omits necessary ARIA labels and keyboard focus indicators, making the primary method of traversing the app invisible to screen readers and difficult for keyboard users to interact with.
**Action:** When creating or auditing custom navigation bars, ensure `aria-label` and `title` attributes are present on all icon-only or visually-hidden text buttons, and that standard keyboard focus styles (e.g., `focus-visible:ring-2`) are applied.
