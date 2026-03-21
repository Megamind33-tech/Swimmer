/**
 * TopUtilityBar — top HUD strip across the lobby
 *
 * Layout (left → right):
 *   [ProfileBadge] ·· spacer ·· [🪙 Coins] [💎 Gems] [⚙ Settings]
 *
 * Height: 48px, fixed to absolute top, z-index: menu (70)
 * Background: deep glass with backdrop-blur and subtle aqua border-bottom
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, UserRound, Gift, Trophy } from 'lucide-react';
import { ProfileBadge } from './ProfileBadge';
import { lobby } from '../theme/tokens';
import { USER_DATA } from '../utils/gameData';

function useIsLandscapeMobile(): boolean {
  const [v, setV] = useState(
    () => window.innerHeight <= 500 && window.innerWidth > window.innerHeight,
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-height: 500px) and (orientation: landscape)');
    const handler = (e: MediaQueryListEvent) => setV(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return v;
}

// ─────────────────────────────────────────────────────────────────────────────
// Currency badge
// ─────────────────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

interface CurrencyBadgeProps {
  icon: string;
  value: number;
  color: string;
  onAdd?: () => void;
  'aria-label'?: string;
}

const CurrencyBadge: React.FC<CurrencyBadgeProps> = ({ icon, value, color, onAdd, 'aria-label': ariaLabel }) => (
  <motion.div
    aria-label={ariaLabel}
    whileTap={onAdd ? { scale: 0.95 } : undefined}
    onClick={onAdd}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      background: 'rgba(4,20,33,0.65)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: '100px',
      padding: '3px 10px 3px 6px',
      cursor: onAdd ? 'pointer' : 'default',
      flexShrink: 0,
    }}
  >
    <span style={{ fontSize: '14px', lineHeight: 1 }}>{icon}</span>
    <span
      style={{
        fontFamily: "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: '12px',
        color,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '0.02em',
        lineHeight: 1,
      }}
    >
      {formatCurrency(value)}
    </span>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// TopUtilityBar
// ─────────────────────────────────────────────────────────────────────────────

interface TopUtilityBarProps {
  onSettings: () => void;
  onProfile?: () => void;
  onRewards?: () => void;
  onNavigate?: (tab: string) => void;
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({ onSettings, onProfile, onRewards, onNavigate }) => {
  const isLandscape = useIsLandscapeMobile();
  const barH = isLandscape ? 40 : 48;
  const btnH = isLandscape ? 26 : 30;
  const iconSz = isLandscape ? 11 : 12;
  const txtSz = isLandscape ? '9px' : '10px';

  return (
  <div
    className="swim26-top-bar"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: `${barH}px`,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: isLandscape ? '8px' : '12px',
      paddingRight: isLandscape ? '6px' : '10px',
      gap: isLandscape ? '5px' : '8px',
      zIndex: 70,
      background: 'rgba(4,20,33,0.88)',
      borderBottom: `1px solid ${lobby.panelBorder}`,
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
    }}
  >
    <ProfileBadge />

    {/* Spacer */}
    <div style={{ flex: 1 }} />

    {/* Championships quick-access */}
    {onNavigate && (
      <motion.button
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.08 }}
        onClick={() => onNavigate('championships')}
        title="Championships"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          height: `${btnH}px`,
          paddingInline: isLandscape ? '7px' : '10px',
          borderRadius: '8px',
          border: '1px solid rgba(204,255,0,0.22)',
          background: 'rgba(204,255,0,0.07)',
          color: lobby.gold,
          cursor: 'pointer',
          flexShrink: 0,
          fontFamily: "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: txtSz,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
        }}
      >
        <Trophy size={iconSz} />
        {!isLandscape && 'Events'}
      </motion.button>
    )}

    {/* Profile button */}
    <motion.button
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      onClick={onProfile}
      title="Player Profile"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        height: `${btnH}px`,
        paddingInline: isLandscape ? '7px' : '10px',
        borderRadius: '8px',
        border: '1px solid rgba(204,255,0,0.22)',
        background: 'rgba(204,255,0,0.07)',
        color: lobby.cyanGlow,
        cursor: 'pointer',
        flexShrink: 0,
        fontFamily: "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: txtSz,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
      }}
    >
      <UserRound size={iconSz} />
      {!isLandscape && 'Profile'}
    </motion.button>

    {/* Rewards button */}
    <motion.button
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      onClick={onRewards}
      title="Rewards"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        height: `${btnH}px`,
        paddingInline: isLandscape ? '7px' : '10px',
        borderRadius: '8px',
        border: '1px solid rgba(204,255,0,0.22)',
        background: 'rgba(204,255,0,0.07)',
        color: lobby.gold,
        cursor: 'pointer',
        flexShrink: 0,
        fontFamily: "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: txtSz,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
      }}
    >
      <Gift size={iconSz} />
      {!isLandscape && 'Rewards'}
    </motion.button>

    <CurrencyBadge
      icon="🪙"
      value={USER_DATA.currencies.coins}
      color={lobby.gold}
      aria-label={`${USER_DATA.currencies.coins} Coins`}
    />
    <CurrencyBadge
      icon="💎"
      value={USER_DATA.currencies.gems}
      color={lobby.cyanGlow}
      aria-label={`${USER_DATA.currencies.gems} Gems`}
    />

    {/* Settings button */}
    <motion.button
      aria-label="Settings"
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      onClick={onSettings}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.06)',
        color: lobby.textSecondary,
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <Settings size={isLandscape ? 12 : 14} />
    </motion.button>
  </div>
  );
};
