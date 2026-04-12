## 2024-04-12 - Icon-only buttons lacking ARIA labels
**Learning:** Icon-only buttons (like the close overlay or dismiss notification buttons) currently lack `aria-label` attributes, and `title` attributes. Adding these to elements improves accessibility significantly without visual changes.
**Action:** Adding `aria-label` and `title` to the close overlay buttons in `AthleteDetailOverlay.tsx`, `NotificationToast.tsx`, `ProfileOverlay.tsx`, `ProspectNegotiateOverlay.tsx`, and the avatar button in `TopHUD.tsx`.
