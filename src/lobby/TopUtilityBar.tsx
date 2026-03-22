/**
 * TopUtilityBar — top HUD strip across the lobby
 *
 * Layout (left → right):
 *   [ProfileBadge] ·· spacer ·· [Events] [Profile] [Rewards] [🪙] [💎] [⚙]
 *
 * Phase 3 improvements:
 *   - All buttons now 44 px minimum touch target height (previously 26 px in landscape)
 *   - Settings button expanded to 44 × 44 px
 *   - Bar height kept at 48 px in both orientations — no compression
 *   - Removed local useIsLandscapeMobile duplicate
 *
 * Phase 4 improvements:
 *   - Short labels always shown in landscape (EVNT / PRO / RWRD)
 *   - Buttons no longer drop to icon-only in landscape
 *
 * Phase 7 improvements:
 *   - Reads reducedMotion and highContrast from A11yContext
 *   - Border and background lifted under high contrast
 *
 * Phase 8 improvements:
 *   - Proper aria-label on every button (replacing title-only fallback)
 *   - CurrencyBadge uses role="status" for screen-reader announcements
 *   - Focus-visible outlines via className (CSS in index.css)
 */

import React from 'react';
import { motion } from 'motion/react';
import { Settings, UserRound, Gift, Trophy } from 'lucide-react';

import { ProfileBadge } from './ProfileBadge';
import { lobby } from '../theme/tokens';
import { USER_DATA } from '../utils/gameData';
import { useIsLandscapeMobile } from '../hooks/useIsLandscapeMobile';
import { CHROME, TOUCH, safeArea } from '../ui/responsive';
import { useA11y } from '../context/AccessibilityContext';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

// ─────────────────────────────────────────────────────────────────────────────
// CurrencyBadge
// ─────────────────────────────────────────────────────────────────────────────

interface CurrencyBadgeProps {
  icon:          string;
  value:         number;
  color:         string;
  compact?:      boolean;
  'aria-label'?: string;
}

const CurrencyBadge: React.FC<CurrencyBadgeProps> = ({
  icon,
  value,
  color,
  compact = false,
  'aria-label': ariaLabel,
}) => (
  <div
    role="status"
    aria-label={ariaLabel}
    aria-live="polite"
    style={{
      display:     'flex',
      alignItems:  'center',
      gap:         '4px',
      background:  'rgba(4,20,33,0.65)',
      border:      '1px solid rgba(255,255,255,0.09)',
      borderRadius:'100px',
      padding:     compact ? '3px 6px' : '3px 10px 3px 6px',
      flexShrink:  0,
      userSelect:  'none',
    }}
  >
    <span style={{ fontSize: compact ? '12px' : '14px', lineHeight: 1 }}>{icon}</span>
    {!compact && (
      <span
        style={{
          fontFamily:          "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
          fontWeight:          700,
          fontSize:            '12px',
          color,
          fontVariantNumeric:  'tabular-nums',
          letterSpacing:       '0.02em',
          lineHeight:          1,
        }}
      >
        {formatCurrency(value)}
      </span>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// TopUtilityBar
// ─────────────────────────────────────────────────────────────────────────────

interface TopUtilityBarProps {
  onSettings:   () => void;
  onProfile?:   () => void;
  onRewards?:   () => void;
  onNavigate?:  (tab: string) => void;
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({
  onSettings,
  onProfile,
  onRewards,
  onNavigate,
}) => {
  const isLandscape = useIsLandscapeMobile();
  const { settings: a11y } = useA11y();
  const { reducedMotion, highContrast } = a11y;

  /* Bar height: always 48 px — never compress it.
   * Shrinking the bar below 48 px causes buttons to fall under the 44 px
   * minimum touch target, which is the root cause of landscape usability issues. */
  const barH   = CHROME.topBar.normal; // 48 px
  const btnH   = TOUCH.minimum;        // 44 px touch target height
  const iconSz = isLandscape ? 13 : 14;

  /* Shared button style — reduces repetition */
  const btnBase: React.CSSProperties = {
    display:       'flex',
    alignItems:    'center',
    gap:           '5px',
    height:        `${btnH}px`,
    paddingInline: isLandscape ? '8px' : '11px',
    borderRadius:  '8px',
    border:        `1px solid ${highContrast
      ? 'rgba(204,255,0,0.45)'
      : 'rgba(204,255,0,0.22)'}`,
    background:    highContrast
      ? 'rgba(204,255,0,0.12)'
      : 'rgba(204,255,0,0.07)',
    cursor:        'pointer',
    flexShrink:    0,
    fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
    fontWeight:    700,
    fontSize:      isLandscape ? '9px' : '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    userSelect:    'none',
    outline:       'none',
  };

  return (
    <div
      className="swim26-top-bar"
      style={{
        position:             'absolute',
        top:                  0,
        left:                 0,
        right:                0,
        height:               `${barH}px`,
        display:              'flex',
        alignItems:           'center',
        /* Respect device notch on the left and right */
        paddingLeft:          `max(12px, ${safeArea.left})`,
        paddingRight:         `max(10px, ${safeArea.right})`,
        gap:                  isLandscape ? '5px' : '8px',
        zIndex:               70,
        overflow:             'hidden',
        background:           highContrast
          ? 'rgba(2,10,20,0.97)'
          : 'rgba(4,20,33,0.88)',
        borderBottom:         `1px solid ${highContrast
          ? 'rgba(56,214,255,0.35)'
          : lobby.panelBorder}`,
        backdropFilter:       'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxSizing:            'border-box',
      }}
    >
      <ProfileBadge />
      <div style={{ flex: 1 }} />

      {/* Championships / Events quick-access */}
      {onNavigate && (
        <motion.button
          whileTap={reducedMotion ? undefined : { scale: 0.88 }}
          whileHover={reducedMotion ? undefined : { scale: 1.05 }}
          onClick={() => onNavigate('championships')}
          aria-label="Championships and events"
          className="swim26-utility-btn"
          style={{ ...btnBase, color: lobby.gold }}
        >
          <Trophy size={iconSz} />
          {/* Always show a label — abbreviated in landscape */}
          <span>{isLandscape ? 'EVNT' : 'Events'}</span>
        </motion.button>
      )}

      {/* Profile */}
      <motion.button
        whileTap={reducedMotion ? undefined : { scale: 0.88 }}
        whileHover={reducedMotion ? undefined : { scale: 1.05 }}
        onClick={onProfile}
        aria-label="Player profile"
        className="swim26-utility-btn"
        style={{ ...btnBase, color: lobby.cyanGlow }}
      >
        <UserRound size={iconSz} />
        <span>{isLandscape ? 'PRO' : 'Profile'}</span>
      </motion.button>

      {/* Rewards */}
      <motion.button
        whileTap={reducedMotion ? undefined : { scale: 0.88 }}
        whileHover={reducedMotion ? undefined : { scale: 1.05 }}
        onClick={onRewards}
        aria-label="Rewards"
        className="swim26-utility-btn"
        style={{ ...btnBase, color: lobby.gold }}
      >
        <Gift size={iconSz} />
        <span>{isLandscape ? 'RWRD' : 'Rewards'}</span>
      </motion.button>

      {/* Currency displays — icon-only in landscape to save horizontal space */}
      <CurrencyBadge
        icon="🪙"
        value={USER_DATA.currencies.coins}
        color={lobby.gold}
        compact={isLandscape}
        aria-label={`${USER_DATA.currencies.coins} Coins`}
      />
      <CurrencyBadge
        icon="💎"
        value={USER_DATA.currencies.gems}
        color={lobby.cyanGlow}
        compact={isLandscape}
        aria-label={`${USER_DATA.currencies.gems} Gems`}
      />

      {/* Settings */}
      <motion.button
        aria-label="Settings"
        whileTap={reducedMotion ? undefined : { scale: 0.88 }}
        whileHover={reducedMotion ? undefined : { scale: 1.05 }}
        onClick={onSettings}
        className="swim26-utility-btn"
        style={{
          width:          `${TOUCH.minimum}px`,
          height:         `${TOUCH.minimum}px`,
          borderRadius:   '8px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          border:         `1px solid ${highContrast
            ? 'rgba(255,255,255,0.30)'
            : 'rgba(255,255,255,0.10)'}`,
          background:     highContrast
            ? 'rgba(255,255,255,0.12)'
            : 'rgba(255,255,255,0.06)',
          color:          highContrast ? '#ffffff' : lobby.textSecondary,
          cursor:         'pointer',
          flexShrink:     0,
          userSelect:     'none',
          outline:        'none',
        }}
      >
        <Settings size={isLandscape ? 14 : 16} />
      </motion.button>
    </div>
  );
};
