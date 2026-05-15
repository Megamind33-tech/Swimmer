## 2026-05-15 - Accessible Custom Toggles
**Learning:** Custom toggle visuals built with generic elements (like `<button>` and `<div>`) are not inherently recognized as toggles by screen readers.
**Action:** Always add `role="switch"` and `aria-checked` to the button element, and use `aria-hidden="true"` on the nested visual styling elements to prevent redundant or confusing screen reader announcements.
