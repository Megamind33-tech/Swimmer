## 2024-05-18 - Improve icon accessibility and add switch roles
**Learning:** Found a recurring pattern where icon-only buttons lacked proper semantic structure (`aria-label` / `title`), and custom visual toggles were missing standard a11y properties (`role="switch"`, `aria-checked`). Also, adding `aria-hidden="true"` to nested decorative SVGs ensures cleaner screen reader output.
**Action:** Applied standard a11y properties to toggles and icon-only close/profile buttons. Ensure future custom toggle controls always include the correct switch role rather than behaving just as standard buttons.
