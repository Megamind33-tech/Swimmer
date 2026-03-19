/**
 * hudTokens — shared visual constants for all race HUD widgets
 *
 * Design language: SWIM26 Sports Broadcast Standard (FC 26 / EA Sports aesthetic)
 *   - Hard-edged black panels — no translucent colored glass
 *   - Volt Yellow (#CCFF00) — player-owned state: active, 1st place, highlights
 *   - White (#FFFFFF) — primary readouts, mid-state indicators
 *   - Flat Red (#FF003C) — critical stamina / danger states only
 *   - NO glows. NO neon. NO caustics. NO colored transparent overlays.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Panel surfaces — opaque, hard-edged broadcast panels
// ─────────────────────────────────────────────────────────────────────────────

export const HUD_PANEL = {
  background:    'rgba(10, 10, 10, 0.90)',
  border:        '1px solid rgba(255, 255, 255, 0.12)',
  backdropFilter:'blur(8px)',
  borderRadius:  '0px',
} as const;

/** Strong panel for top-center timer — maximum contrast */
export const HUD_PANEL_STRONG = {
  background:    '#0A0A0A',
  border:        '1px solid rgba(255, 255, 255, 0.18)',
  backdropFilter:'blur(10px)',
  borderRadius:  '0px',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Colors — Broadcast standard palette
// ─────────────────────────────────────────────────────────────────────────────

export const HUD_COLOR = {
  /** High-vis Volt Yellow — active states, 1st place, player highlights */
  volt:          '#CCFF00',
  voltDim:       'rgba(204, 255, 0, 0.55)',

  /** Primary text — pure white */
  white:         '#FFFFFF',

  /** Secondary / muted text */
  grey:          '#888888',

  /** Flat stark red — critical danger only, no glow */
  danger:        '#FF003C',

  // ── Legacy aliases kept so un-migrated components compile ─────────────────
  /** @deprecated Use volt or white */
  aqua:          '#FFFFFF',
  /** @deprecated No glows in broadcast standard */
  aquaGlow:      'rgba(255, 255, 255, 0)',
  /** @deprecated Use white */
  cyanGlow:      '#FFFFFF',
  /** @deprecated Use volt */
  gold:          '#CCFF00',
  /** @deprecated No glows */
  goldGlow:      'rgba(204, 255, 0, 0)',
  /** @deprecated Use white for mid-state */
  warning:       '#FFFFFF',
  /** @deprecated No glows */
  warningGlow:   'rgba(255, 255, 255, 0)',
  /** @deprecated No glows */
  dangerGlow:    'rgba(255, 0, 60, 0)',
  /** @deprecated Use volt */
  success:       '#CCFF00',
  /** @deprecated No glows */
  successGlow:   'rgba(204, 255, 0, 0)',

  // ── Text hierarchy ─────────────────────────────────────────────────────────
  textPrimary:   '#FFFFFF',
  textSecondary: '#888888',
  textMuted:     'rgba(255, 255, 255, 0.40)',

  // ── Backgrounds ────────────────────────────────────────────────────────────
  bgDeep:        '#0A0A0A',
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
// Stamina color thresholds — no glows, flat colors only
// ─────────────────────────────────────────────────────────────────────────────

export function staminaColor(pct: number): string {
  if (pct > 55) return HUD_COLOR.volt;    // Healthy — high-vis volt yellow
  if (pct > 25) return HUD_COLOR.white;   // Mid — neutral white
  return HUD_COLOR.danger;                // Critical — flat stark red
}

/** @deprecated No glows in broadcast standard. Always returns 'none'. */
export function staminaGlow(_pct: number): string {
  return 'none';
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
