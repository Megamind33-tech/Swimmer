/**
 * IconTabBar — bottom icon-first navigation for the game lobby
 *
 * 6 destinations: Race · Career · Training · Rankings · Style · Store
 * (Settings lives in TopUtilityBar — always accessible in ≤ 1 tap)
 *
 * Layout rules:
 *   - Icon is the primary element (20px, outlined lucide)
 *   - Label is secondary: 8px Rajdhani uppercase, concise
 *   - Active: aqua icon + aqua indicator line at top + glow
 *   - Inactive: textSecondary at 45% opacity
 *   - layoutId on indicator for smooth cross-tab animation
 *   - Height: 56px absolute bottom, z-index: menu (70)
 *   - Backdrop blur: 16px (same as top bar)
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Waves,
  Trophy,
  Zap,
  BarChart2,
  Shirt,
  ShoppingBag,
} from 'lucide-react';
import { lobby } from '../theme/tokens';

// ─────────────────────────────────────────────────────────────────────────────
// Tab definition
// ─────────────────────────────────────────────────────────────────────────────

export type LobbyTab = 'race' | 'career' | 'training' | 'rankings' | 'style' | 'store';

interface TabDef {
  id:    LobbyTab;
  icon:  React.ReactNode;
  label: string;
}

const TABS: TabDef[] = [
  { id: 'race',     icon: <Waves     size={20} />, label: 'RACE'   },
  { id: 'career',   icon: <Trophy    size={20} />, label: 'CAREER' },
  { id: 'training', icon: <Zap       size={20} />, label: 'TRAIN'  },
  { id: 'rankings', icon: <BarChart2 size={20} />, label: 'RANK'   },
  { id: 'style',    icon: <Shirt     size={20} />, label: 'STYLE'  },
  { id: 'store',    icon: <ShoppingBag size={20} />, label: 'STORE' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface IconTabBarProps {
  activeTab: LobbyTab;
  onChange:  (tab: LobbyTab) => void;
}

export const IconTabBar: React.FC<IconTabBarProps> = ({ activeTab, onChange }) => (
  <div
    style={{
      position:          'absolute',
      bottom:            0,
      left:              0,
      right:             0,
      height:            '56px',
      display:           'flex',
      zIndex:            70,
      background:        'rgba(4,20,33,0.94)',
      borderTop:         `1px solid ${lobby.panelBorder}`,
      backdropFilter:    'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}
  >
    {TABS.map((tab) => {
      const isActive = activeTab === tab.id;

      return (
        <motion.button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          whileTap={{ scale: 0.88 }}
          style={{
            flex:           1,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '3px',
            cursor:         'pointer',
            background:     'transparent',
            border:         'none',
            padding:        0,
            position:       'relative',
            color:          isActive ? lobby.aqua : `rgba(169,211,231,0.42)`,
            transition:     'color 0.18s ease',
            userSelect:     'none',
            WebkitUserSelect: 'none',
          }}
        >
          {/* Active indicator — aqua top line, animated across tabs */}
          {isActive && (
            <motion.div
              layoutId="lobby-tab-indicator"
              style={{
                position:     'absolute',
                top:          0,
                left:         '18%',
                right:        '18%',
                height:       '2px',
                borderRadius: '0 0 2px 2px',
                background:   lobby.aqua,
                boxShadow:    `0 0 10px rgba(56,214,255,0.90), 0 0 20px rgba(56,214,255,0.45)`,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}

          {/* Icon */}
          <span
            style={{
              filter:     isActive ? 'drop-shadow(0 0 6px rgba(56,214,255,0.80))' : 'none',
              transition: 'filter 0.18s ease',
              lineHeight: 1,
            }}
          >
            {tab.icon}
          </span>

          {/* Label */}
          <span
            style={{
              fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
              fontWeight:    700,
              fontSize:      '8px',
              letterSpacing: '0.10em',
              lineHeight:    1,
            }}
          >
            {tab.label}
          </span>
        </motion.button>
      );
    })}
  </div>
);
