/**
 * GameIcon — Safe icon replacement for all Material Symbols usage.
 *
 * Maps Material icon names to Unicode / emoji characters so no external
 * font dependency is required.  Every icon is rendered in a <span> with
 * an explicit fontSize so it never inherits wrong sizes from its parent.
 */

import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Glyph map — add new entries here when a new icon name is needed
// ─────────────────────────────────────────────────────────────────────────────

const ICON_GLYPHS: Record<string, string> = {
  // ── Required replacements (from task spec) ──────────────────────────────
  play_arrow:    '▶',
  chevron_right: '›',
  emoji_events:  '🏆',
  leaderboard:   '📊',
  timer:         '⏱',
  groups:        '👥',
  history:       '🔄',
  radar:         '📡',
  rocket_launch: '🚀',

  // ── Navigation & UI ─────────────────────────────────────────────────────
  home:               '⌂',
  person:             '👤',
  person_4:           '👤',
  account_circle:     '◉',
  menu:               '☰',
  settings:           '⚙',
  notifications:      '🔔',
  notifications_active: '🔔',
  mail:               '✉',
  send:               '➤',
  filter_list:        '≡',
  arrow_forward:      '→',
  open_in_new:        '↗',
  close:              '✕',
  refresh:            '↺',
  replay:             '↺',

  // ── Sports & Game ───────────────────────────────────────────────────────
  crown:             '👑',
  military_tech:     '🏅',
  sports_score:      '🏅',
  trending_up:       '↗',
  star:              '★',
  stars:             '✦',
  verified:          '✓',
  flag:              '⚑',
  speed:             '⚡',
  biometrics:        '◉',
  fitness_center:    '💪',

  // ── Commerce & Rewards ──────────────────────────────────────────────────
  monetization_on:   '◈',
  card_giftcard:     '🎁',
  checkroom:         '🧢',
  shopping_bag:      '🛍',

  // ── Media & Actions ─────────────────────────────────────────────────────
  play_circle:       '⏵',
  pause:             '⏸',
  schedule:          '⏰',
  touch_app:         '☝',
  waves:             '〜',

  // ── Social ──────────────────────────────────────────────────────────────
  chat:              '💬',
  hub:               '⊕',
  public:            '🌐',

  // ── Misc ────────────────────────────────────────────────────────────────
  nights_stay:          '☾',
  broadcast_on_home:    '⊕',
  edit:                 '✏',
  home_max:             '⌂',
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface GameIconProps {
  /** Material icon name, e.g. "play_arrow" */
  name: string;
  /** Font size in px (default 24). Always applied explicitly. */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function GameIcon({ name, size = 24, className, style }: GameIconProps) {
  const glyph = ICON_GLYPHS[name] ?? '◻';
  return (
    <span
      className={className}
      style={{
        fontSize: `${size}px`,
        lineHeight: 1,
        display: 'inline-block',
        fontStyle: 'normal',
        ...style,
      }}
      aria-hidden
    >
      {glyph}
    </span>
  );
}

export default GameIcon;
