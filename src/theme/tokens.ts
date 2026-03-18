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
  /** Neon cyan — primary race action, progress, interactive highlights */
  primary: {
    DEFAULT: '#00E5FF',
    dim:     '#00B2CC',
    deep:    '#006B80',
    glow:    'rgba(0, 229, 255, 0.25)',
    glowStrong: 'rgba(0, 229, 255, 0.55)',
  },

  /** Gold — XP, achievements, rankings, season rewards */
  gold: {
    DEFAULT: '#D4A843',
    light:   '#F5C842',
    dark:    '#A67C00',
    glow:    'rgba(212, 168, 67, 0.35)',
    glowStrong: 'rgba(212, 168, 67, 0.65)',
  },

  /** Red — danger, disqualification, critical stamina warning */
  danger: {
    DEFAULT: '#EF4444',
    dark:    '#B91C1C',
    glow:    'rgba(239, 68, 68, 0.35)',
  },

  /** Green — pool action, PLAY button, success states */
  action: {
    DEFAULT: '#0D7C66',
    light:   '#10A37F',
    dark:    '#065A46',
    glow:    'rgba(13, 124, 102, 0.45)',
  },

  /** Surfaces — dark navy-black game background layers */
  surface: {
    base:    '#050B14',   // deepest background / vignette
    low:     '#080F1C',   // panel base
    mid:     '#0A1628',   // cards, drawers
    high:    '#111D2E',   // elevated elements
    highest: '#1B2838',   // top surface chips, badges
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

  /** Race HUD — stamina states */
  stamina: {
    high:   '#00E5FF',   // > 60 %
    mid:    '#D4A843',   // 20–60 %
    low:    '#EF4444',   // < 20 %
  },

  /** Backdrop overlays */
  overlay: {
    dark:   'rgba(5, 11, 20, 0.72)',
    darker: 'rgba(5, 11, 20, 0.88)',
    pause:  'rgba(5, 11, 20, 0.80)',
    tinted: 'rgba(10, 22, 40, 0.80)',
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
  sm:   '8px',
  md:   '12px',
  lg:   '16px',
  xl:   '20px',
  '2xl':'24px',
  '3xl':'32px',
  full: '9999px',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SHADOWS & GLOWS
// ─────────────────────────────────────────────────────────────────────────────

export const shadows = {
  /** Neon primary glow — on interactive elements, selected states */
  glowPrimary:  '0 0 12px rgba(0, 229, 255, 0.45)',
  glowPrimaryLg:'0 0 30px rgba(0, 229, 255, 0.35)',

  /** Gold glow — XP, achievements, first-place */
  glowGold:     '0 0 12px rgba(212, 168, 67, 0.50)',
  glowGoldLg:   '0 0 30px rgba(212, 168, 67, 0.40)',

  /** Danger glow — low stamina, warnings */
  glowDanger:   '0 0 12px rgba(239, 68, 68, 0.50)',

  /** Action glow — PLAY button */
  glowAction:   '0 0 18px rgba(13, 124, 102, 0.55)',

  /** Elevation shadows */
  card:         '0 4px 24px rgba(0, 0, 0, 0.40)',
  elevated:     '0 8px 40px rgba(0, 0, 0, 0.55)',

  /** Inner highlight — top edge of raised panels */
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
 * Phase 2 premium lobby colors.
 * These replace generic surface/text tokens in lobby-specific components.
 * Rules:
 *   - bgDeep  → deepest scene layer, vignette edges
 *   - bgOcean → mid panels, cards
 *   - bgPanel → glass overlays (semi-transparent)
 *   - aqua    → primary action, active states, glow source
 *   - cyanGlow → lighter glow highlight, XP bar fill end
 */
export const lobby = {
  bgDeep:        '#041421',
  bgOcean:       '#06263A',
  bgPanel:       'rgba(4, 20, 33, 0.76)',
  textPrimary:   '#F3FBFF',
  textSecondary: '#A9D3E7',
  aqua:          '#38D6FF',
  cyanGlow:      '#7AE8FF',
  warning:       '#FFC247',
  danger:        '#FF5D73',
  success:       '#37E28D',
  gold:          '#FFD76A',

  // Derived alpha variants
  aquaGlow:      'rgba(56, 214, 255, 0.40)',
  aquaSubtle:    'rgba(56, 214, 255, 0.10)',
  aquaBorder:    'rgba(56, 214, 255, 0.20)',
  panelBorder:   'rgba(56, 214, 255, 0.12)',
  goldGlow:      'rgba(255, 215, 106, 0.35)',
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

  // Lobby theme (Phase 2)
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
}
