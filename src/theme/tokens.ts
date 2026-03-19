/**
 * SWIMMER-THREE — Design Token System
 * Single source of truth for all visual constants.
 *
 * Usage (TypeScript):
 *   import { colors, hud, control } from '../theme/tokens'
 *   const bg = colors.surface.high
 *
 * Usage (CSS custom properties):
 *   The tokens are also injected as CSS variables in index.css via
 *   injectCSSTokens() called once at boot.
 *   Access in CSS: var(--color-primary)
 *
 * Rules:
 *   - Never hardcode a hex color outside of this file.
 *   - Never use Tailwind arbitrary values ([#xxx]) outside of this file.
 *   - All alpha variants are expressed as rgba() strings.
 */

// ─────────────────────────────────────────────────────────────────────────────
// COLOR PALETTE
// ─────────────────────────────────────────────────────────────────────────────

export const colors = {
  /** Volt Yellow — primary accent: active states, highlights, 1st place */
  primary: {
    DEFAULT: '#CCFF00',
    dim:     '#AADD00',
    deep:    '#667A00',
    glow:    'rgba(204, 255, 0, 0)',   // No glows in broadcast standard
    glowStrong: 'rgba(204, 255, 0, 0)',
  },

  /** Gold (alias → volt) — rankings, achievements */
  gold: {
    DEFAULT: '#CCFF00',
    light:   '#DDFF33',
    dark:    '#AADD00',
    glow:    'rgba(204, 255, 0, 0)',
    glowStrong: 'rgba(204, 255, 0, 0)',
  },

  /** Red — danger, disqualification, critical stamina warning — flat, no glow */
  danger: {
    DEFAULT: '#FF003C',
    dark:    '#CC0030',
    glow:    'rgba(255, 0, 60, 0)',
  },

  /** Action — PLAY button, pool CTA */
  action: {
    DEFAULT: '#CCFF00',
    light:   '#DDFF33',
    dark:    '#AADD00',
    glow:    'rgba(204, 255, 0, 0)',
  },

  /** Surfaces — carbon-black game background layers */
  surface: {
    base:    '#0A0A0A',   // deepest background
    low:     '#111111',   // panel base
    mid:     '#1A1A1A',   // cards, drawers (graphite)
    high:    '#222222',   // elevated elements
    highest: '#2A2A2A',   // top surface chips, badges
  },

  /** Text hierarchy */
  text: {
    primary:   '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.70)',
    muted:     'rgba(255, 255, 255, 0.45)',
    faint:     'rgba(255, 255, 255, 0.20)',
  },

  /** Borders */
  border: {
    subtle:  'rgba(255, 255, 255, 0.08)',
    soft:    'rgba(255, 255, 255, 0.15)',
    visible: 'rgba(255, 255, 255, 0.25)',
  },

  /** Race HUD — stamina states (flat, no glow) */
  stamina: {
    high:   '#CCFF00',   // > 55% — volt yellow
    mid:    '#FFFFFF',   // 25–55% — white
    low:    '#FF003C',   // < 25% — flat red
  },

  /** Backdrop overlays — monochromatic only */
  overlay: {
    dark:   'rgba(0, 0, 0, 0.72)',
    darker: 'rgba(0, 0, 0, 0.88)',
    pause:  'rgba(0, 0, 0, 0.80)',
    tinted: 'rgba(10, 10, 10, 0.80)',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SPACING
// ─────────────────────────────────────────────────────────────────────────────

/** Base 4 px grid. All layout spacing should use these values. */
export const spacing = {
  0:  '0px',
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// BORDER RADII
// ─────────────────────────────────────────────────────────────────────────────

export const radii = {
  sm:   '0px',
  md:   '0px',
  lg:   '0px',
  xl:   '0px',
  '2xl':'0px',
  '3xl':'0px',
  full: '9999px',  // Kept only for pill badges where strictly needed
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SHADOWS & GLOWS
// ─────────────────────────────────────────────────────────────────────────────

export const shadows = {
  /** @deprecated No neon glows in broadcast standard */
  glowPrimary:  'none',
  glowPrimaryLg:'none',

  /** @deprecated No neon glows in broadcast standard */
  glowGold:     'none',
  glowGoldLg:   'none',

  /** @deprecated No neon glows in broadcast standard */
  glowDanger:   'none',

  /** @deprecated No neon glows in broadcast standard */
  glowAction:   'none',

  /** Hard structural elevation shadows — monochromatic only */
  card:         '0 4px 24px rgba(0, 0, 0, 0.60)',
  elevated:     '0 8px 40px rgba(0, 0, 0, 0.75)',

  /** Inner highlight — subtle top-edge on raised panels */
  insetTop:     'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// HUD SIZING TOKENS  (landscape mobile, 375 × 667 viewport minimum target)
// ─────────────────────────────────────────────────────────────────────────────

export const hud = {
  /** Top bar: timer, rank, pause button */
  topBarHeight:    '52px',
  topBarPaddingX:  '12px',
  topBarPaddingY:  '8px',

  /** Lane progress bar */
  progressBarHeight: '12px',
  progressBarRadius: '6px',

  /** Stamina ring */
  staminaRingSize:  '80px',
  staminaRingStroke:'7px',

  /** Ticker strip at bottom */
  tickerHeight:     '20px',

  /** Bottom stroke zone */
  strokeZoneHeight: '96px',
  strokeZoneWidth:  '144px',

  /** Countdown text size */
  countdownFontSize:'80px',

  /** Competitor marker width */
  rivalMarkerWidth: '4px',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CONTROL SIZING TOKENS  (WCAG 2.5.5 minimum 44 × 44 px touch target)
// ─────────────────────────────────────────────────────────────────────────────

export const control = {
  /** Minimum touch target (WCAG) */
  minTapSize:    '44px',

  /** Primary action buttons (CTA) */
  btnHeightLg:   '56px',
  btnHeightMd:   '44px',
  btnHeightSm:   '36px',

  /** Icon buttons */
  iconBtnSize:   '40px',
  iconBtnRadius: '12px',

  /** Bottom nav tab */
  navTabHeight:  '56px',

  /** PLAY center button — raised pill */
  playBtnWidth:  '64px',
  playBtnHeight: '68px',

  /** Card heights in menus */
  eventCardHeight: '120px',
  modeCardHeight:  '256px',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Z-INDEX STACK
// ─────────────────────────────────────────────────────────────────────────────

export const zIndex = {
  scene:       0,    // Babylon.js canvas
  hudBase:     50,   // HUD elements that sit above scene
  hudOverlay:  60,   // Pause, countdown flash, combo overlays
  menu:        70,   // App-level menus
  modal:       80,   // Dialogs, confirmation sheets
  landscape:   90,   // Landscape guard (must be above everything)
  toast:       100,  // Transient notifications
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// LOBBY THEME — Phase 2 aquatic game lobby palette
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Broadcast lobby colors — flat, high-contrast Sports Broadcast standard.
 * Rules:
 *   - bgDeep  → carbon black base
 *   - bgPanel → opaque graphite panels (no colored glass)
 *   - volt    → primary action, active states (no glow)
 *   - white   → primary text
 *   - danger  → flat stark red (#FF003C)
 */
export const lobby = {
  bgDeep:        '#0A0A0A',
  bgOcean:       '#1A1A1A',
  bgPanel:       'rgba(10, 10, 10, 0.88)',
  textPrimary:   '#FFFFFF',
  textSecondary: '#888888',
  aqua:          '#CCFF00',    // Legacy alias → volt yellow
  cyanGlow:      '#CCFF00',    // Legacy alias → volt yellow
  warning:       '#FFFFFF',    // White for mid-states
  danger:        '#FF003C',    // Flat stark red
  success:       '#CCFF00',    // Volt for success
  gold:          '#CCFF00',    // Volt for gold/ranking

  // Border & overlay alphas — monochromatic only
  aquaGlow:      'rgba(204, 255, 0, 0)',    // No colored glows
  aquaSubtle:    'rgba(255, 255, 255, 0.06)',
  aquaBorder:    'rgba(255, 255, 255, 0.14)',
  panelBorder:   'rgba(255, 255, 255, 0.10)',
  goldGlow:      'rgba(204, 255, 0, 0)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CSS CUSTOM PROPERTY INJECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Call once at app boot (in main.tsx) to write all tokens as CSS custom
 * properties on :root.  Components can then use var(--token-name) in
 * inline styles or global CSS without importing the TS module.
 */
export function injectCSSTokens(): void {
  const root = document.documentElement;

  // Colors
  root.style.setProperty('--color-primary',          colors.primary.DEFAULT);
  root.style.setProperty('--color-primary-dim',       colors.primary.dim);
  root.style.setProperty('--color-primary-glow',      colors.primary.glow);
  root.style.setProperty('--color-gold',              colors.gold.DEFAULT);
  root.style.setProperty('--color-gold-glow',         colors.gold.glow);
  root.style.setProperty('--color-danger',            colors.danger.DEFAULT);
  root.style.setProperty('--color-action',            colors.action.DEFAULT);
  root.style.setProperty('--color-action-dark',       colors.action.dark);
  root.style.setProperty('--color-surface-base',      colors.surface.base);
  root.style.setProperty('--color-surface-mid',       colors.surface.mid);
  root.style.setProperty('--color-surface-high',      colors.surface.high);
  root.style.setProperty('--color-surface-highest',   colors.surface.highest);
  root.style.setProperty('--color-text-primary',      colors.text.primary);
  root.style.setProperty('--color-text-secondary',    colors.text.secondary);
  root.style.setProperty('--color-text-muted',        colors.text.muted);
  root.style.setProperty('--color-border-subtle',     colors.border.subtle);
  root.style.setProperty('--color-border-soft',       colors.border.soft);
  root.style.setProperty('--color-overlay-dark',      colors.overlay.dark);

  // HUD
  root.style.setProperty('--hud-top-bar-height',      hud.topBarHeight);
  root.style.setProperty('--hud-stamina-ring-size',   hud.staminaRingSize);
  root.style.setProperty('--hud-stroke-zone-height',  hud.strokeZoneHeight);
  root.style.setProperty('--hud-ticker-height',       hud.tickerHeight);

  // Controls
  root.style.setProperty('--control-min-tap',         control.minTapSize);
  root.style.setProperty('--control-btn-lg',          control.btnHeightLg);
  root.style.setProperty('--control-nav-tab',         control.navTabHeight);
  root.style.setProperty('--control-play-btn-width',  control.playBtnWidth);

  // Shadows
  root.style.setProperty('--shadow-glow-primary',     shadows.glowPrimary);
  root.style.setProperty('--shadow-glow-gold',        shadows.glowGold);
  root.style.setProperty('--shadow-card',             shadows.card);

  // Z-index
  root.style.setProperty('--z-hud',                  String(zIndex.hudBase));
  root.style.setProperty('--z-menu',                 String(zIndex.menu));
  root.style.setProperty('--z-landscape',            String(zIndex.landscape));

  // Lobby theme
  root.style.setProperty('--lobby-bg-deep',          lobby.bgDeep);
  root.style.setProperty('--lobby-bg-ocean',         lobby.bgOcean);
  root.style.setProperty('--lobby-bg-panel',         lobby.bgPanel);
  root.style.setProperty('--lobby-text-primary',     lobby.textPrimary);
  root.style.setProperty('--lobby-text-secondary',   lobby.textSecondary);
  root.style.setProperty('--lobby-aqua',             lobby.aqua);
  root.style.setProperty('--lobby-cyan-glow',        lobby.cyanGlow);
  root.style.setProperty('--lobby-warning',          lobby.warning);
  root.style.setProperty('--lobby-danger',           lobby.danger);
  root.style.setProperty('--lobby-success',          lobby.success);
  root.style.setProperty('--lobby-gold',             lobby.gold);
  root.style.setProperty('--lobby-aqua-glow',        lobby.aquaGlow);
  root.style.setProperty('--lobby-aqua-subtle',      lobby.aquaSubtle);
  root.style.setProperty('--lobby-aqua-border',      lobby.aquaBorder);
  root.style.setProperty('--lobby-panel-border',     lobby.panelBorder);

  // Broadcast standard accent
  root.style.setProperty('--color-volt',             '#CCFF00');
  root.style.setProperty('--color-broadcast-red',    '#FF003C');
  root.style.setProperty('--color-carbon',           '#0A0A0A');
  root.style.setProperty('--color-graphite',         '#1A1A1A');
}
