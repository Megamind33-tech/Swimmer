/**
 * GameButtons — reusable lobby-grade CTA buttons
 *
 * PrimaryButton  — full aqua, dark text, Bebas Neue label, glow shadow
 * SecondaryButton — glass outline, aqua text, same font rhythm
 *
 * Rules:
 *   - Never use standard web button styling (rounded-md, bg-blue-500, etc.)
 *   - Always use Bebas Neue for label text
 *   - Min height 44px (WCAG touch target)
 *   - Tactile feedback: scale on whileTap
 */

import React from 'react';
import { motion } from 'motion/react';
import { lobby } from '../theme/tokens';

export interface GameButtonProps {
  /** Icon element rendered left of the label */
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  /** Optional: override default width (defaults to auto / shrink-to-content) */
  fullWidth?: boolean;
  disabled?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Primary — solid aqua fill, highest visual weight
// ─────────────────────────────────────────────────────────────────────────────

export const PrimaryButton: React.FC<GameButtonProps> = ({
  icon,
  label,
  onClick,
  fullWidth = false,
  disabled = false,
}) => (
  <motion.button
    whileTap={{ scale: 0.94 }}
    whileHover={{ scale: 1.03, boxShadow: '0 0 28px rgba(56,214,255,0.55), 0 2px 10px rgba(0,0,0,0.5)' }}
    onClick={onClick}
    disabled={disabled}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '7px',
      height: '44px',
      padding: '0 22px',
      width: fullWidth ? '100%' : 'auto',
      borderRadius: '10px',
      border: 'none',
      background: disabled
        ? 'rgba(56,214,255,0.25)'
        : 'linear-gradient(140deg, #38D6FF 0%, #1dc3ee 100%)',
      color: lobby.bgDeep,
      fontFamily: "'Bebas Neue', Impact, 'Arial Narrow', sans-serif",
      fontSize: '20px',
      letterSpacing: '0.06em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      flexShrink: 0,
      boxShadow: disabled
        ? 'none'
        : '0 0 20px rgba(56,214,255,0.38), 0 2px 8px rgba(0,0,0,0.45)',
      transition: 'opacity 0.15s',
      opacity: disabled ? 0.5 : 1,
      userSelect: 'none',
      WebkitUserSelect: 'none',
    }}
  >
    {icon}
    {label}
  </motion.button>
);

// ─────────────────────────────────────────────────────────────────────────────
// Secondary — glass outline, aqua-tinted, lower visual weight
// ─────────────────────────────────────────────────────────────────────────────

export const SecondaryButton: React.FC<GameButtonProps> = ({
  icon,
  label,
  onClick,
  fullWidth = false,
  disabled = false,
}) => (
  <motion.button
    whileTap={{ scale: 0.94 }}
    whileHover={{ scale: 1.03 }}
    onClick={onClick}
    disabled={disabled}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '7px',
      height: '44px',
      padding: '0 18px',
      width: fullWidth ? '100%' : 'auto',
      borderRadius: '10px',
      border: `1px solid ${disabled ? 'rgba(56,214,255,0.18)' : 'rgba(56,214,255,0.38)'}`,
      background: 'rgba(56,214,255,0.08)',
      color: disabled ? 'rgba(56,214,255,0.4)' : lobby.aqua,
      fontFamily: "'Bebas Neue', Impact, 'Arial Narrow', sans-serif",
      fontSize: '20px',
      letterSpacing: '0.06em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      flexShrink: 0,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      transition: 'opacity 0.15s',
      opacity: disabled ? 0.5 : 1,
      userSelect: 'none',
      WebkitUserSelect: 'none',
    }}
  >
    {icon}
    {label}
  </motion.button>
);

// ─────────────────────────────────────────────────────────────────────────────
// IconActionButton — small square icon-only button (utility bar, card actions)
// ─────────────────────────────────────────────────────────────────────────────

export interface IconActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  label?: string; // aria-label / tooltip
  variant?: 'ghost' | 'glass';
  size?: number;
}

export const IconActionButton: React.FC<IconActionButtonProps> = ({
  icon,
  onClick,
  label,
  variant = 'ghost',
  size = 32,
}) => (
  <motion.button
    whileTap={{ scale: 0.88 }}
    whileHover={{ scale: 1.06 }}
    onClick={onClick}
    aria-label={label}
    style={{
      width: size,
      height: size,
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: variant === 'glass'
        ? '1px solid rgba(255,255,255,0.12)'
        : '1px solid rgba(255,255,255,0.08)',
      background: variant === 'glass'
        ? 'rgba(255,255,255,0.07)'
        : 'transparent',
      color: lobby.textSecondary,
      backdropFilter: variant === 'glass' ? 'blur(8px)' : 'none',
      userSelect: 'none',
      WebkitUserSelect: 'none',
    }}
  >
    {icon}
  </motion.button>
);
