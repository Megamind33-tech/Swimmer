/**
 * SWIMMER-THREE — Centralized Icon Registry
 *
 * All icons used throughout the game pass through this file.
 * No component may import an icon library directly — import from here instead.
 *
 * Rules:
 *   1. One icon family only: lucide-react (already installed).
 *      Custom SVGs are added as local components below.
 *   2. Every icon is given a semantic alias that describes its GAME meaning,
 *      not the graphic shape (e.g. Career not Trophy).
 *   3. All icons accept the same size/color props for consistency.
 *   4. Custom SVG icons live in this file; never scatter inline SVGs.
 *
 * Usage:
 *   import { GameIcon } from '../theme/icons'
 *   <GameIcon name="Career" size={20} className="text-gold" />
 */

import React from 'react';
import {
  // Navigation
  Home,
  Trophy,
  Shield,
  Search,
  ShoppingCart,
  Medal,
  // Actions
  Play,
  Pause,
  RotateCcw,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  // HUD
  Timer,
  Zap,
  // Social
  Users,
  Mail,
  MessageSquare,
  // Management
  Calendar,
  Gift,
  Star,
  Award,
  Settings,
  // Currency
  Plus,
  Coins,
  Gem,
  // Status
  CheckCircle,
  AlertTriangle,
  Info,
  // Misc
  Flag,
  Globe,
  BarChart2,
  type LucideIcon,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// ICON MAP — semantic name → Lucide component
// ─────────────────────────────────────────────────────────────────────────────

const iconMap = {
  // ── Navigation ──────────────────────────────────────────────────────────
  Home,
  Career:           Trophy,
  Club:             Shield,
  Scouts:           Search,
  Market:           ShoppingCart,
  Championships:    Medal,

  // ── Core Actions ────────────────────────────────────────────────────────
  Play,
  Pause,
  Replay:           RotateCcw,
  Close:            X,
  Forward:          ChevronRight,
  Back:             ChevronLeft,
  Continue:         ArrowRight,

  // ── Race HUD ────────────────────────────────────────────────────────────
  Timer,
  Stamina:          Zap,

  // ── Social ──────────────────────────────────────────────────────────────
  Friends:          Users,
  Inbox:            Mail,
  Chat:             MessageSquare,

  // ── Management / Menu ───────────────────────────────────────────────────
  Events:           Calendar,
  Rewards:          Gift,
  StarPass:         Star,
  Bonus:            Award,
  Settings,

  // ── Currency ────────────────────────────────────────────────────────────
  AddCurrency:      Plus,
  Coins,
  Gems:             Gem,

  // ── Status ──────────────────────────────────────────────────────────────
  Success:          CheckCircle,
  Warning:          AlertTriangle,
  Info,

  // ── Race ────────────────────────────────────────────────────────────────
  FinishFlag:       Flag,
  GlobalRank:       Globe,
  Stats:            BarChart2,
} as const;

export type IconName = keyof typeof iconMap;

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM SVG ICONS  (not available in Lucide)
// ─────────────────────────────────────────────────────────────────────────────

interface SvgProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

/** Water wave — used for pool/swim themed contexts */
export const WaveIcon: React.FC<SvgProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...props}>
    <path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
  </svg>
);

/** Swimmer silhouette — player avatar, swimmer cards */
export const SwimmerIcon: React.FC<SvgProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="19" cy="4" r="2" />
    <path d="M2 14c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0" />
    <path d="M16 6l-4 5-3 1" />
    <path d="M12 11l2 4" />
  </svg>
);

/** Stopwatch — race splits, PB tracking */
export const StopwatchIcon: React.FC<SvgProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="13" r="8" />
    <polyline points="12 9 12 13 15 13" />
    <line x1="9" y1="2" x2="15" y2="2" />
    <line x1="12" y1="2" x2="12" y2="5" />
  </svg>
);

/** Rotate device icon — used in LandscapeGuard overlay */
export const RotateDeviceIcon: React.FC<SvgProps> = ({ size = 64, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Phone portrait outline */}
    <rect x="22" y="8" width="20" height="32" rx="3" />
    <line x1="29" y1="35" x2="35" y2="35" />
    {/* Rotate arrow */}
    <path d="M12 44 C12 55 22 58 32 56" strokeDasharray="4 3" />
    <polyline points="30 52 35 56 30 60" />
    {/* Phone landscape (destination) */}
    <rect x="8" y="42" width="32" height="20" rx="3" opacity="0.45" />
    <line x1="11" y1="52" x2="14" y2="52" opacity="0.45" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED GameIcon COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface GameIconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  /** aria-label for accessibility — defaults to the icon name */
  label?: string;
}

export const GameIcon: React.FC<GameIconProps> = ({
  name,
  size = 20,
  className,
  style,
  label,
}) => {
  const LucideComponent = iconMap[name] as LucideIcon;
  return (
    <LucideComponent
      size={size}
      className={className}
      style={style}
      aria-label={label ?? name}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS — re-export the map for any edge-cases requiring direct access
// ─────────────────────────────────────────────────────────────────────────────

export { iconMap };
export type { LucideIcon };
