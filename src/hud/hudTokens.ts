/**
 * hudTokens — shared visual constants for all race HUD widgets
 *
 * Separate from lobby tokens so the HUD can evolve independently.
 * Every HUD widget imports from here instead of hardcoding values.
 *
 * Design language:
 *   - Translucent dark panels (no flat opaque blocks)
 *   - Aqua (#38D6FF) for player-owned state: stamina, position, progress
 *   - Gold (#FFD76A) for rank / achievement highlights
 *   - Warning amber (#FFC247) for mid-stamina / off-rhythm states
 *   - Danger red (#FF5D73) for critical stamina / disqualification risk
 *   - Success green (#37E28D) for PBs, good turns, perfect starts
 */

// ─────────────────────────────────────────────────────────────────────────────
// Panel surfaces
// ─────────────────────────────────────────────────────────────────────────────

export const HUD_PANEL = {
  background:    'rgba(4, 20, 33, 0.74)',
  border:        '1px solid rgba(56, 214, 255, 0.15)',
  backdropFilter:'blur(10px)',
  borderRadius:  '10px',
} as const;

/** Brighter panel for top-center timer (needs strong contrast) */
export const HUD_PANEL_STRONG = {
  background:    'rgba(4, 20, 33, 0.88)',
  border:        '1px solid rgba(56, 214, 255, 0.22)',
  backdropFilter:'blur(12px)',
  borderRadius:  '10px',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────────────────────────────────────

export const HUD_COLOR = {
  aqua:          '#38D6FF',
  aquaGlow:      'rgba(56, 214, 255, 0.70)',
  cyanGlow:      '#7AE8FF',

  gold:          '#FFD76A',
  goldGlow:      'rgba(255, 215, 106, 0.65)',

  warning:       '#FFC247',
  warningGlow:   'rgba(255, 194, 71, 0.65)',

  danger:        '#FF5D73',
  dangerGlow:    'rgba(255, 93, 115, 0.65)',

  success:       '#37E28D',
  successGlow:   'rgba(55, 226, 141, 0.65)',

  textPrimary:   '#F3FBFF',
  textSecondary: '#A9D3E7',
  textMuted:     'rgba(169, 211, 231, 0.45)',
  bgDeep:        '#041421',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Typography
// ─────────────────────────────────────────────────────────────────────────────

export const HUD_FONT = {
  /** Bebas Neue — large impact numbers: timer, countdown, position */
  impact: "'Bebas Neue', Impact, 'Arial Narrow', sans-serif",
  /** Rajdhani — labels, short readouts, widget titles */
  label:  "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Stamina color thresholds
// ─────────────────────────────────────────────────────────────────────────────

export function staminaColor(pct: number): string {
  if (pct > 55) return HUD_COLOR.aqua;
  if (pct > 25) return HUD_COLOR.warning;
  return HUD_COLOR.danger;
}

export function staminaGlow(pct: number): string {
  if (pct > 55) return HUD_COLOR.aquaGlow;
  if (pct > 25) return HUD_COLOR.warningGlow;
  return HUD_COLOR.dangerGlow;
}

// ─────────────────────────────────────────────────────────────────────────────
// Ordinal helper
// ─────────────────────────────────────────────────────────────────────────────

export function ordinal(n: number): string {
  const map = ['', '1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH'];
  return map[n] ?? `${n}TH`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Time formatter — mm:ss.cc (centiseconds)
// ─────────────────────────────────────────────────────────────────────────────

export function formatRaceTime(ms: number): string {
  const totalSec = ms / 1000;
  const mins  = Math.floor(totalSec / 60);
  const secs  = Math.floor(totalSec % 60);
  const cents = Math.floor((ms % 1000) / 10);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(cents).padStart(2, '0')}`;
}
