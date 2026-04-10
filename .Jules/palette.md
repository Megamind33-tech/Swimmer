## 2024-05-15 - Add ARIA Labels to Icon-Only Buttons
**Learning:** Found multiple instances of navigation and HUD buttons containing only icons without textual labels or standard aria-labels. This pattern is common in AAA game UI but breaks basic accessibility standards.
**Action:** Always verify icon-only interactive elements contain screen-reader friendly `aria-label` attributes and optionally `title` for mouse tooltip support.
