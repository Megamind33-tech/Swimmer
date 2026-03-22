/**
 * IconTabBar — Game HUD bottom navigation
 *
 * Layout: Left 4 tabs | Centre RACE button (raised) | Right 4 tabs
 * Aesthetic: broadcast sports, deep gradient, volt active glow
 *
 * Phase 3 improvements:
 *   - Minimum 44 px touch target on all nav tabs (portrait + landscape)
 *   - Race button: 56 × 48 px (landscape) / 64 × 56 px (portrait)
 *   - Removed local useIsLandscapeMobile duplicate — imports shared hook
 *
 * Phase 4 improvements:
 *   - Labels always visible (short form in landscape) — no icon-only navigation
 *   - aria-label on every tab button for screen-reader clarity
 *
 * Phase 7 improvements:
 *   - Reads reducedMotion and highContrast from A11yContext
 *   - Pulse ring disabled when reducedMotion is on
 *   - Tab indicator animation disabled when reducedMotion is on
 *   - Contrast of borders, backgrounds, and text lifted in high-contrast mode
 *
 * Phase 8 improvements:
 *   - aria-pressed on each tab and the Race button
 *   - aria-label on the Race button
 *   - role="tablist" on left and right tab groups
 *   - Focus-visible outlines via className (CSS in index.css)
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Play, Medal, Shield, Search, ShoppingCart,
  Trophy, ShoppingBag, Target, Shirt,
} from 'lucide-react';

import { useIsLandscapeMobile } from '../hooks/useIsLandscapeMobile';
import { CHROME, TOUCH, safeArea } from '../ui/responsive';
import { useA11y } from '../context/AccessibilityContext';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type LobbyTab =
  | 'race' | 'career' | 'club' | 'scouts' | 'market'
  | 'rankings' | 'store' | 'training' | 'style';

interface TabDef {
  id:     LobbyTab;
  icon:   React.ElementType;
  label:  string;
  /** Abbreviated form shown in landscape (max 5 chars) */
  short:  string;
  badge?: string;
}

const LEFT_TABS: TabDef[] = [
  { id: 'career',   icon: Medal,        label: 'CAREER',   short: 'CREER' },
  { id: 'club',     icon: Shield,       label: 'CLUB',     short: 'CLUB'  },
  { id: 'scouts',   icon: Search,       label: 'SCOUTS',   short: 'SCOUT', badge: 'NEW' },
  { id: 'training', icon: Target,       label: 'TRAIN',    short: 'TRAIN' },
];

const RIGHT_TABS: TabDef[] = [
  { id: 'market',   icon: ShoppingCart, label: 'MARKET',   short: 'MRKT'  },
  { id: 'rankings', icon: Trophy,       label: 'RANK',     short: 'RANK'  },
  { id: 'style',    icon: Shirt,        label: 'STYLE',    short: 'STYLE' },
  { id: 'store',    icon: ShoppingBag,  label: 'STORE',    short: 'STORE' },
];

interface IconTabBarProps {
  activeTab: LobbyTab;
  onChange:  (tab: LobbyTab) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// NavTab
// ─────────────────────────────────────────────────────────────────────────────

interface NavTabProps {
  tab: TabDef;
  isActive: boolean;
  onChange: (id: LobbyTab) => void;
  isLandscape: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}

const NavTab: React.FC<NavTabProps> = ({
  tab,
  isActive,
  onChange,
  isLandscape,
  reducedMotion,
  highContrast,
}) => {
  const Icon    = tab.icon;
  const iconSz  = isLandscape ? 14 : 16;
  /* Show abbreviated label in landscape to keep the tab readable but compact */
  const label   = isLandscape ? tab.short : tab.label;

  return (
    <motion.button
      onClick={() => onChange(tab.id)}
      whileTap={reducedMotion ? undefined : { scale: 0.95 }}
      className="swim26-nav-tab"
      aria-label={tab.label}
      aria-pressed={isActive}
      style={{
        flex:           1,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            isLandscape ? '2px' : '3px',
        cursor:         'pointer',
        background:     isActive
          ? (highContrast ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.05)')
          : 'transparent',
        border: isActive
          ? `1px solid ${highContrast ? 'rgba(204,255,0,0.45)' : 'rgba(204,255,0,0.20)'}`
          : '1px solid transparent',
        borderRadius:   '10px',
        padding:        '4px 2px',
        /* Minimum touch-target height per WCAG 2.5.5 */
        minHeight:      `${TOUCH.minimum}px`,
        position:       'relative',
        userSelect:     'none',
        WebkitUserSelect:'none',
        outline:        'none',
      }}
    >
      {/* Active indicator bar at top */}
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
            background:   'var(--color-volt)',
          }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 350, damping: 30 }
          }
        />
      )}

      {/* Icon + optional badge */}
      <div style={{ position: 'relative' }}>
        <Icon
          size={iconSz}
          style={{
            color: isActive
              ? '#ffffff'
              : (highContrast ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.40)'),
            transition: reducedMotion ? 'none' : 'color 0.18s ease',
          }}
        />
        {tab.badge && (
          <span
            aria-label={tab.badge}
            style={{
              position:      'absolute',
              top:           '-4px',
              right:         '-8px',
              background:    '#C41E3A',
              color:         '#fff',
              fontSize:      '7px',
              fontWeight:    900,
              fontFamily:    "'Rajdhani', sans-serif",
              letterSpacing: '0.08em',
              padding:       '1px 4px',
              borderRadius:  '100px',
              /* Respect reduced motion */
              animation:     reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite',
            }}
          >
            {tab.badge}
          </span>
        )}
      </div>

      {/* Label — always shown; abbreviated in landscape */}
      <span
        className="swim26-nav-tab-label"
        style={{
          fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
          fontWeight:    800,
          fontSize:      isLandscape ? '7px' : '8px',
          letterSpacing: '0.12em',
          lineHeight:    1,
          color: isActive
            ? '#ffffff'
            : (highContrast ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.38)'),
          transition: reducedMotion ? 'none' : 'color 0.18s ease',
        }}
      >
        {label}
      </span>
    </motion.button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// IconTabBar
// ─────────────────────────────────────────────────────────────────────────────

export const IconTabBar: React.FC<IconTabBarProps> = ({ activeTab, onChange }) => {
  const raceActive   = activeTab === 'race';
  const isLandscape  = useIsLandscapeMobile();
  const { settings: a11y } = useA11y();
  const { reducedMotion, highContrast } = a11y;

  const barH      = isLandscape ? CHROME.bottomBar.landscape : CHROME.bottomBar.normal;
  /* Race button large enough to be a primary CTA */
  const raceBtnW  = isLandscape ? 56 : 64;
  const raceBtnH  = isLandscape ? TOUCH.minimum + 4 : TOUCH.primary; // 48 / 56
  const raceBtnMT = isLandscape ? -6 : -10;
  /* Tab rows: minimum 44 px so every tab meets the touch target floor */
  const tabH      = Math.max(TOUCH.minimum, barH - 8);

  return (
    <div
      className="swim26-bottom-tab-bar"
      style={{
        position:             'absolute',
        bottom:               0,
        left:                 0,
        right:                0,
        height:               `${barH}px`,
        /* Respect home-indicator bar on notched devices */
        paddingBottom:        safeArea.bottom,
        zIndex:               70,
        background:           highContrast
          ? 'rgba(2,10,20,0.98)'
          : 'linear-gradient(to top, #050B14 0%, rgba(10,22,40,0.96) 100%)',
        borderTop:            `1px solid ${highContrast
          ? 'rgba(255,255,255,0.20)'
          : 'rgba(255,255,255,0.08)'}`,
        backdropFilter:       'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display:              'flex',
        alignItems:           'center',
        justifyContent:       'center',
        paddingInline:        '6px',
        gap:                  '4px',
        boxSizing:            'border-box',
      }}
    >
      {/* Scanline HUD accent */}
      <div
        aria-hidden
        style={{
          position:      'absolute',
          top:           0,
          left:          0,
          right:         0,
          height:        '1px',
          background:    'linear-gradient(90deg, transparent 0%, rgba(204,255,0,0.30) 30%, rgba(204,255,0,0.30) 70%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Left 4 tabs */}
      <div
        role="tablist"
        aria-label="Left navigation"
        style={{
          flex:                1,
          display:             'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap:                 '2px',
          height:              `${tabH}px`,
        }}
      >
        {LEFT_TABS.map(tab => (
          <React.Fragment key={tab.id}>
          <NavTab
            tab={tab}
            isActive={activeTab === tab.id}
            onChange={onChange}
            isLandscape={isLandscape}
            reducedMotion={reducedMotion}
            highContrast={highContrast}
          />
          </React.Fragment>
        ))}
      </div>

      {/* Centre RACE button — raised and prominent */}
      <motion.button
        onClick={() => onChange('race')}
        whileTap={reducedMotion ? undefined : { scale: 0.92 }}
        whileHover={reducedMotion ? undefined : { scale: 1.05 }}
        className="swim26-race-btn"
        aria-label="Race — go to lobby"
        aria-pressed={raceActive}
        style={{
          position:       'relative',
          width:          `${raceBtnW}px`,
          height:         `${raceBtnH}px`,
          marginTop:      `${raceBtnMT}px`,
          borderRadius:   '14px',
          background:     raceActive
            ? 'linear-gradient(to bottom, var(--color-volt), var(--color-primary-dim))'
            : 'linear-gradient(to bottom, rgba(204,255,0,0.25), rgba(204,255,0,0.08))',
          border:         `1px solid ${highContrast
            ? 'rgba(204,255,0,0.80)'
            : 'rgba(204,255,0,0.55)'}`,
          boxShadow:      raceActive
            ? '0 4px 16px rgba(0,0,0,0.55)'
            : '0 4px 12px rgba(0,0,0,0.40)',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '2px',
          cursor:         'pointer',
          flexShrink:     0,
          userSelect:     'none',
          WebkitUserSelect:'none',
          outline:        'none',
        }}
      >
        <Play size={isLandscape ? 20 : 24} fill="white" color="white" />
        <span
          style={{
            fontFamily:    "'Rajdhani', sans-serif",
            fontWeight:    900,
            fontSize:      isLandscape ? '8px' : '9px',
            letterSpacing: '0.18em',
            color:         '#ffffff',
          }}
        >
          RACE
        </span>

        {/* Pulse ring — disabled in reduced-motion mode */}
        {!reducedMotion && (
          <span
            aria-hidden
            style={{
              position:      'absolute',
              inset:         0,
              borderRadius:  '14px',
              background:    'var(--color-volt)',
              opacity:       raceActive ? 0.25 : 0.15,
              animation:     'ping 2s cubic-bezier(0,0,0.2,1) infinite',
              pointerEvents: 'none',
            }}
          />
        )}
      </motion.button>

      {/* Right 4 tabs */}
      <div
        role="tablist"
        aria-label="Right navigation"
        style={{
          flex:                1,
          display:             'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap:                 '2px',
          height:              `${tabH}px`,
        }}
      >
        {RIGHT_TABS.map(tab => (
          <React.Fragment key={tab.id}>
          <NavTab
            tab={tab}
            isActive={activeTab === tab.id}
            onChange={onChange}
            isLandscape={isLandscape}
            reducedMotion={reducedMotion}
            highContrast={highContrast}
          />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default IconTabBar;
