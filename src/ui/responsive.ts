/**
 * responsive.ts — Shared responsive design constants
 *
 * Single source of truth for:
 *   - Viewport breakpoints
 *   - Touch target sizes (WCAG 2.5.5 / Apple HIG)
 *   - Shell chrome heights
 *   - Safe-area inset references
 *   - Named spacing values
 *
 * Import this instead of writing magic numbers in component files.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Breakpoints
// ─────────────────────────────────────────────────────────────────────────────

export const BREAKPOINTS = {
  /** Max viewport height (px) that triggers mobile-landscape compact mode */
  landscapeMobileMaxH: 500,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Touch target sizes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Minimum interactive hit-area dimensions in pixels.
 *
 * Rules:
 *   primary  — Race CTA, large primary actions: 56 px
 *   standard — Nav tabs, toolbar buttons:       48 px
 *   minimum  — Absolute floor for ANY control:  44 px
 *
 * Important: these are the TOUCH AREA sizes, not the visual sizes.
 * Buttons can look smaller visually while their padding extends the tap zone.
 */
export const TOUCH = {
  primary:  56,
  standard: 48,
  minimum:  44,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Shell chrome heights
// ─────────────────────────────────────────────────────────────────────────────

export const CHROME = {
  topBar: {
    /** Never shrink the top bar in landscape — keeps buttons comfortably tappable */
    normal:    48,
    landscape: 48,
  },
  bottomBar: {
    normal:    60,
    /** Slightly reduced in landscape to reclaim vertical space, still ≥ touch.minimum */
    landscape: 52,
  },
  paneBar: {
    /** PaneSwitcher tab strip — always 44 px so tabs meet the minimum touch target */
    height: 44,
  },
} as const;

/** Gap (px) between the top bar bottom edge and the back button top edge */
export const BACK_BTN_TOP_OFFSET = 4;

/**
 * Full zone reserved for the back button when visible.
 * = topBar.normal + BACK_BTN_TOP_OFFSET + minimum touch height
 */
export const BACK_BTN_ZONE_H =
  CHROME.topBar.normal + BACK_BTN_TOP_OFFSET + TOUCH.minimum; // 96 px

// ─────────────────────────────────────────────────────────────────────────────
// Safe-area inset CSS references
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use these in `padding` / `margin` / `max()` expressions so UI never
 * sits behind notches, home-indicator bars, or camera cutouts.
 *
 * Example:
 *   paddingLeft: `max(12px, ${safeArea.left})`
 *   paddingBottom: safeArea.bottom
 */
export const safeArea = {
  top:    'max(env(safe-area-inset-top, 0px), var(--vv-offset-top, 0px))',
  bottom: 'max(env(safe-area-inset-bottom, 0px), var(--vv-offset-bottom, 0px))',
  left:   'max(env(safe-area-inset-left, 0px), var(--vv-offset-left, 0px))',
  right:  'max(env(safe-area-inset-right, 0px), var(--vv-offset-right, 0px))',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Spacing
// ─────────────────────────────────────────────────────────────────────────────

export const SPACING = {
  barPadH:    { normal: '12px', landscape: '10px' },
  itemGap:    { normal: '8px',  landscape: '6px'  },
  contentPad: '12px',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Transitions
// ─────────────────────────────────────────────────────────────────────────────

export const TRANSITION_DURATIONS = {
  /** Standard screen-to-screen fade duration */
  screenFade: 0.3,
  /** Quick UI hover/tap feedback */
  quick:      0.14,
  /** Smooth page entry animations */
  entry:      0.45,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Focus ring token
// ─────────────────────────────────────────────────────────────────────────────

/** CSS value for a consistent focus-visible outline across the shell */
export const FOCUS_RING = '2px solid rgba(204,255,0,0.85)' as const;
export const FOCUS_RING_OFFSET = '2px' as const;
