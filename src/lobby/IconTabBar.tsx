/**
 * IconTabBar — Game HUD bottom navigation
 *
 * Layout: Left 4 tabs | Centre RACE button (raised) | Right 4 tabs
 * Aesthetic: broadcast sports, deep gradient, gold active glow
 * Matches BottomNav design language used across the game.
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Medal,
  Shield,
  Search,
  ShoppingCart,
  Trophy,
  ShoppingBag,
  Target,
  Shirt,
} from 'lucide-react';

export type LobbyTab =
  | 'race'
  | 'career'
  | 'club'
  | 'scouts'
  | 'market'
  | 'rankings'
  | 'store'
  | 'training'
  | 'style';

interface TabDef {
  id:    LobbyTab;
  icon:  React.ElementType;
  label: string;
  badge?: string;
}

const LEFT_TABS: TabDef[] = [
  { id: 'career',   icon: Medal,         label: 'CAREER'  },
  { id: 'club',     icon: Shield,        label: 'CLUB'    },
  { id: 'scouts',   icon: Search,        label: 'SCOUTS', badge: 'NEW' },
  { id: 'training', icon: Target,        label: 'TRAIN'   },
];

const RIGHT_TABS: TabDef[] = [
  { id: 'market',   icon: ShoppingCart,  label: 'MARKET'  },
  { id: 'rankings', icon: Trophy,        label: 'RANK'    },
  { id: 'style',    icon: Shirt,         label: 'STYLE'   },
  { id: 'store',    icon: ShoppingBag,   label: 'STORE'   },
];

interface IconTabBarProps {
  activeTab: LobbyTab;
  onChange:  (tab: LobbyTab) => void;
}

function NavTab({
  tab,
  isActive,
  onChange,
}: {
  tab: TabDef;
  isActive: boolean;
  onChange: (id: LobbyTab) => void;
}) {
  const Icon = tab.icon;
  return (
    <motion.button
      key={tab.id}
      onClick={() => onChange(tab.id)}
      whileTap={{ scale: 0.95 }}
      style={{
        flex:           1,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '3px',
        cursor:         'pointer',
        background:     isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
        border:         isActive ? '1px solid rgba(212,168,67,0.20)' : '1px solid transparent',
        borderRadius:   '10px',
        padding:        '4px 2px',
        position:       'relative',
        userSelect:     'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Gold top-line indicator */}
      {isActive && (
        <motion.div
          layoutId="game-tab-indicator"
          style={{
            position:     'absolute',
            top:          0,
            left:         '20%',
            right:        '20%',
            height:       '2px',
            borderRadius: '0 0 3px 3px',
            background:   '#D4A843',
            boxShadow:    '0 0 10px rgba(212,168,67,0.70), 0 0 20px rgba(212,168,67,0.35)',
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}

      {/* Icon */}
      <div style={{ position: 'relative' }}>
        <Icon
          size={15}
          style={{
            color:  isActive ? '#ffffff' : 'rgba(255,255,255,0.40)',
            filter: isActive ? 'drop-shadow(0 0 6px rgba(212,168,67,0.80))' : 'none',
            transition: 'color 0.18s ease, filter 0.18s ease',
          }}
        />
        {tab.badge && (
          <span style={{
            position:     'absolute',
            top:          '-4px',
            right:        '-8px',
            background:   '#C41E3A',
            color:        '#fff',
            fontSize:     '6px',
            fontWeight:   900,
            fontFamily:   "'Rajdhani', sans-serif",
            letterSpacing:'0.08em',
            padding:      '1px 4px',
            borderRadius: '100px',
            animation:    'pulse 2s ease-in-out infinite',
          }}>
            {tab.badge}
          </span>
        )}
      </div>

      {/* Label */}
      <span style={{
        fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
        fontWeight:    800,
        fontSize:      '8px',
        letterSpacing: '0.14em',
        lineHeight:    1,
        color:         isActive ? '#ffffff' : 'rgba(255,255,255,0.38)',
        transition:    'color 0.18s ease',
      }}>
        {tab.label}
      </span>
    </motion.button>
  );
}

export const IconTabBar: React.FC<IconTabBarProps> = ({ activeTab, onChange }) => {
  const raceActive = activeTab === 'race';

  return (
    <div
      style={{
        position:             'absolute',
        bottom:               0,
        left:                 0,
        right:                0,
        height:               '60px',
        zIndex:               70,
        background:           'linear-gradient(to top, #050B14 0%, rgba(10,22,40,0.96) 100%)',
        borderTop:            '1px solid rgba(255,255,255,0.08)',
        backdropFilter:       'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display:              'flex',
        alignItems:           'center',
        justifyContent:       'center',
        paddingInline:        '6px',
        gap:                  '4px',
      }}
    >
      {/* Scanline HUD accent */}
      <div style={{
        position:   'absolute',
        top:        0,
        left:       0,
        right:      0,
        height:     '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.30) 30%, rgba(212,168,67,0.30) 70%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Left 4 tabs */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', height: '46px' }}>
        {LEFT_TABS.map(tab => (
          <NavTab key={tab.id} tab={tab} isActive={activeTab === tab.id} onChange={onChange} />
        ))}
      </div>

      {/* Centre RACE button — raised and prominent */}
      <motion.button
        onClick={() => onChange('race')}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        style={{
          position:     'relative',
          width:        '60px',
          height:       '56px',
          marginTop:    '-10px',
          borderRadius: '14px',
          background:   raceActive
            ? 'linear-gradient(to bottom, #0F9A7E, #076B52)'
            : 'linear-gradient(to bottom, #0D7C66, #065A46)',
          border:       '1px solid rgba(13,124,102,0.70)',
          boxShadow:    raceActive
            ? '0 0 24px rgba(13,124,102,0.70), 0 4px 16px rgba(0,0,0,0.50)'
            : '0 0 18px rgba(13,124,102,0.45), 0 4px 12px rgba(0,0,0,0.40)',
          display:      'flex',
          flexDirection:'column',
          alignItems:   'center',
          justifyContent:'center',
          gap:          '2px',
          cursor:       'pointer',
          flexShrink:   0,
          userSelect:   'none',
          WebkitUserSelect: 'none',
        }}
        aria-label="Race"
      >
        <Play size={22} fill="white" color="white" />
        <span style={{
          fontFamily:    "'Rajdhani', sans-serif",
          fontWeight:    900,
          fontSize:      '8px',
          letterSpacing: '0.18em',
          color:         '#ffffff',
        }}>
          RACE
        </span>
        {/* Pulse ring */}
        <span style={{
          position:      'absolute',
          inset:         0,
          borderRadius:  '14px',
          background:    '#0D7C66',
          opacity:       raceActive ? 0.25 : 0.15,
          animation:     'ping 2s cubic-bezier(0,0,0.2,1) infinite',
          pointerEvents: 'none',
        }} />
      </motion.button>

      {/* Right 4 tabs */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', height: '46px' }}>
        {RIGHT_TABS.map(tab => (
          <NavTab key={tab.id} tab={tab} isActive={activeTab === tab.id} onChange={onChange} />
        ))}
      </div>
    </div>
  );
};

export default IconTabBar;
