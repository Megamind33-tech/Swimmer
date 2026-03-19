/**
 * TopUtilityBar — top HUD strip across the lobby
 *
 * Layout (left → right):
 *   [ProfileBadge] ·· spacer ·· [🪙 Coins] [💎 Gems] [⚙ Settings]
 *
 * Height: 48px, fixed to absolute top, z-index: menu (70)
 * Background: deep glass with backdrop-blur and subtle aqua border-bottom
 */

import React from 'react';
import { motion } from 'motion/react';
import { Settings, UserRound, Gift } from 'lucide-react';
import { ProfileBadge } from './ProfileBadge';
import { lobby } from '../theme/tokens';
import { USER_DATA } from '../utils/gameData';

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
}

const CurrencyBadge: React.FC<CurrencyBadgeProps> = ({ icon, value, color, onAdd }) => (
  <motion.div
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
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({ onSettings, onProfile, onRewards }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '12px',
      paddingRight: '10px',
      gap: '8px',
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

    {/* Profile button */}
    <motion.button
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      onClick={onProfile}
      title="Player Profile"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        height: '30px',
        paddingInline: '10px',
        borderRadius: '8px',
        border: '1px solid rgba(56,214,255,0.22)',
        background: 'rgba(56,214,255,0.07)',
        color: lobby.cyanGlow,
        cursor: 'pointer',
        flexShrink: 0,
        fontFamily: "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: '10px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
      }}
    >
      <UserRound size={12} />
      Profile
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
        gap: '5px',
        height: '30px',
        paddingInline: '10px',
        borderRadius: '8px',
        border: '1px solid rgba(212,168,67,0.28)',
        background: 'rgba(212,168,67,0.08)',
        color: lobby.gold,
        cursor: 'pointer',
        flexShrink: 0,
        fontFamily: "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: '10px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
      }}
    >
      <Gift size={12} />
      Rewards
    </motion.button>

    <CurrencyBadge
      icon="🪙"
      value={USER_DATA.currencies.coins}
      color={lobby.gold}
    />
    <CurrencyBadge
      icon="💎"
      value={USER_DATA.currencies.gems}
      color={lobby.cyanGlow}
    />

    {/* Settings button */}
    <motion.button
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
      <Settings size={14} />
    </motion.button>
  </div>
);
