/**
 * SWIMMER-THREE — Typography Token System
 *
 * All font families, sizes, weights, and line-heights in one place.
 * No font-size or font-family should be set outside of this file.
 *
 * Font stack decisions:
 *   headline  — condensed/italic sports-bold (system fallback: Impact)
 *   body      — legible sans for menus and UI prose (system: -apple-system)
 *   mono      — fixed-width for race times, split data (system: monospace)
 *   label     — small caps tracking-heavy for HUD badges and labels
 *
 * Usage:
 *   import { fontFamily, fontSize, fontWeight } from '../theme/typography'
 *   style={{ fontFamily: fontFamily.headline, fontSize: fontSize.hud.timer }}
 */

// ─────────────────────────────────────────────────────────────────────────────
// FONT FAMILIES
// ─────────────────────────────────────────────────────────────────────────────

export const fontFamily = {
  /**
   * Headlines, mode names, race results, scores.
   * Italic + condensed gives the sports-broadcast aesthetic.
   * Falls back to Impact (widely installed, similar visual weight).
   */
  headline: [
    '"Barlow Condensed"',
    '"Arial Narrow"',
    'Impact',
    'system-ui',
    'sans-serif',
  ].join(', '),

  /**
   * Body copy in menus, card descriptions, tooltips.
   * Must be legible at 11–13 px on mobile screens.
   */
  body: [
    '"Inter"',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'system-ui',
    'sans-serif',
  ].join(', '),

  /**
   * Race timer, split times, lap distances, XP values.
   * Tabular numerals (tnum feature) prevent layout shift as numbers change.
   */
  mono: [
    '"JetBrains Mono"',
    '"Fira Mono"',
    '"Courier New"',
    'monospace',
  ].join(', '),

  /**
   * HUD micro-labels, badge text, tracking-heavy uppercase captions.
   * Uses system sans — these are always ≤ 10 px so legibility > style.
   */
  label: [
    '"Inter"',
    '-apple-system',
    'system-ui',
    'sans-serif',
  ].join(', '),
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FONT WEIGHTS
// ─────────────────────────────────────────────────────────────────────────────

export const fontWeight = {
  regular: 400,
  medium:  500,
  bold:    700,
  black:   900,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FONT SIZES  (px values — rem is avoided for game UI predictability)
// ─────────────────────────────────────────────────────────────────────────────

export const fontSize = {
  /** HUD elements — race-critical, must be readable at a glance */
  hud: {
    timer:      '22px',   // main race clock
    rank:       '14px',   // position badge (1st / 2nd …)
    distance:   '15px',   // "48 / 100m"
    label:      '8px',    // HUD micro-labels ("STAMINA", "LEFT")
    ticker:     '8px',    // ticker strip text
    countdown:  '80px',   // 3-2-1 countdown
  },

  /** Menu / App UI */
  ui: {
    hero:    '32px',   // hero titles on home screen
    title:   '24px',   // section headings
    heading: '18px',   // card headings
    body:    '13px',   // standard body copy
    small:   '11px',   // secondary copy
    micro:   '9px',    // badges, tags, pill labels
    nano:    '8px',    // tab labels, sub-labels
  },

  /** Score / Stat display — large numerics */
  stat: {
    xl:  '48px',   // podium first-place time
    lg:  '32px',   // result rank
    md:  '24px',   // reward amounts
    sm:  '18px',   // live leaderboard times
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// LINE HEIGHTS
// ─────────────────────────────────────────────────────────────────────────────

export const lineHeight = {
  tight:   1.1,   // headlines, counters
  snug:    1.25,  // card titles
  normal:  1.5,   // body copy
  relaxed: 1.7,   // help/tooltip text
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// LETTER SPACING
// ─────────────────────────────────────────────────────────────────────────────

export const letterSpacing = {
  tight:  '-0.02em',   // large headlines (optical correction)
  normal: '0em',
  wide:   '0.08em',    // label text
  wider:  '0.15em',    // badge caps
  widest: '0.3em',     // HUD micro-labels (e.g. "STAMINA")
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSED TEXT STYLES  (ready-to-spread objects)
// ─────────────────────────────────────────────────────────────────────────────

export const textStyle = {
  /** Big italic sports title — mode names, race result headings */
  headlineLg: {
    fontFamily:    fontFamily.headline,
    fontSize:      fontSize.ui.hero,
    fontWeight:    fontWeight.black,
    fontStyle:     'italic' as const,
    letterSpacing: letterSpacing.tight,
    lineHeight:    lineHeight.tight,
    textTransform: 'uppercase' as const,
  },

  /** Section heading — card titles, screen names */
  headlineMd: {
    fontFamily:    fontFamily.headline,
    fontSize:      fontSize.ui.title,
    fontWeight:    fontWeight.black,
    fontStyle:     'italic' as const,
    letterSpacing: letterSpacing.tight,
    lineHeight:    lineHeight.tight,
    textTransform: 'uppercase' as const,
  },

  /** Race timer readout */
  hudTimer: {
    fontFamily:    fontFamily.mono,
    fontSize:      fontSize.hud.timer,
    fontWeight:    fontWeight.black,
    letterSpacing: letterSpacing.normal,
    lineHeight:    lineHeight.tight,
    fontVariantNumeric: 'tabular-nums' as const,
  },

  /** HUD micro-label (e.g. "STAMINA", "LANE 4") */
  hudLabel: {
    fontFamily:    fontFamily.label,
    fontSize:      fontSize.hud.label,
    fontWeight:    fontWeight.bold,
    letterSpacing: letterSpacing.widest,
    lineHeight:    lineHeight.normal,
    textTransform: 'uppercase' as const,
  },

  /** Body copy in menus */
  body: {
    fontFamily:    fontFamily.body,
    fontSize:      fontSize.ui.body,
    fontWeight:    fontWeight.regular,
    letterSpacing: letterSpacing.normal,
    lineHeight:    lineHeight.normal,
  },

  /** Badge / pill text */
  badge: {
    fontFamily:    fontFamily.label,
    fontSize:      fontSize.ui.micro,
    fontWeight:    fontWeight.black,
    letterSpacing: letterSpacing.wider,
    lineHeight:    lineHeight.tight,
    textTransform: 'uppercase' as const,
  },
} as const;
