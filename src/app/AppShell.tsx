/**
 * AppShell — Phase 2 premium game lobby shell
 *
 * Entry experience is now a landscape game lobby, not a website.
 *
 * Layout contract:
 *   TopUtilityBar  — 48px, absolute top   (profile, currencies, settings)
 *   Content area   — fills between bars, no scroll, occupies absolute inset
 *   IconTabBar     — 56px, absolute bottom (6 icon-first tabs)
 *
 * Navigation: flat — every main destination reachable in ≤ 2 taps.
 *   Primary tabs (IconTabBar):
 *     race | career | training | rankings | style | store
 *   Settings: via TopUtilityBar gear icon (1 tap)
 *
 * Back button: shown whenever the active tab is not 'race' or settings overlay
 * is open. Tapping returns to the race/lobby tab.
 *
 * AppShell does NOT own:
 *   - PlayScreen / PreRaceSetup / RaceScene / PauseMenu / RaceResultScreen
 *     (all game-flow screens live in GameShell)
 *
 * AppShell exposes onPlay so GameShell can trigger the race.
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

// Lobby system (Phase 2)
import { LobbyScreen }    from '../lobby/LobbyScreen';
import { TopUtilityBar }  from '../lobby/TopUtilityBar';
import { IconTabBar, type LobbyTab } from '../lobby/IconTabBar';

// Page content
import { CareerMode }       from '../pages/CareerMode';
import { Championships }    from '../pages/Championships';
import { Rankings }         from '../pages/Rankings';
import { ClubManagement }   from '../pages/ClubManagement';
import { TransferMarket }   from '../pages/TransferMarket';
import { Scouts }           from '../pages/Scouts';
import {
  TrainingPage,
  SettingsPage,
} from '../pages/UtilityPages';
import { SwimmerScreen }  from '../components/menu/SwimmerScreen';
import { StoreScreen }    from '../components/menu/StoreScreen';
import { ProfilePage }    from '../pages/ProfilePage';
import { RewardsPage }    from '../pages/RewardsPage';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Non-tab pages accessed via the top utility bar. */
type OverlayPage = 'settings' | 'profile' | 'rewards' | null;

interface AppShellProps {
  /** Called when player taps START RACE — hands off to GameShell */
  onPlay: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab → page map
// ─────────────────────────────────────────────────────────────────────────────

function renderTab(tab: LobbyTab, onPlay: () => void, onNavigate: (t: string) => void): React.ReactNode {
  switch (tab) {
    case 'race':     return <LobbyScreen onStartRace={onPlay} onNavigate={onNavigate} />;
    case 'career':   return <CareerMode />;
    case 'club':     return <ClubManagement />;
    case 'scouts':   return <Scouts />;
    case 'market':   return <TransferMarket />;
    case 'rankings': return <Rankings />;
    case 'training': return <TrainingPage />;
    case 'style':    return <SwimmerScreen />;
    case 'store':    return <StoreScreen />;
    default:         return <LobbyScreen onStartRace={onPlay} onNavigate={onNavigate} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab display labels (for back button context)
// ─────────────────────────────────────────────────────────────────────────────

const TAB_LABELS: Record<LobbyTab, string> = {
  race:     'Lobby',
  career:   'Career',
  club:     'Club',
  scouts:   'Scouts',
  market:   'Market',
  rankings: 'Rankings',
  training: 'Training',
  style:    'Customise',
  store:    'Store',
};

// ─────────────────────────────────────────────────────────────────────────────
// Back button component
// ─────────────────────────────────────────────────────────────────────────────

interface BackButtonProps {
  label?: string;
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ label = 'Back', onClick }) => (
  <motion.button
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.18 }}
    whileTap={{ scale: 0.90 }}
    onClick={onClick}
    aria-label={`Go back from ${label}`}
    style={{
      position:       'absolute',
      top:            '54px',         /* just below TopUtilityBar (48px) + 6px gap */
      left:           '10px',
      zIndex:         68,
      display:        'flex',
      alignItems:     'center',
      gap:            '4px',
      padding:        '5px 11px 5px 8px',
      borderRadius:   '10px',
      background:     'rgba(4,20,33,0.85)',
      border:         '1px solid rgba(56,214,255,0.20)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      cursor:         'pointer',
      userSelect:     'none',
      WebkitUserSelect: 'none',
    }}
  >
    <ChevronLeft size={14} color="rgba(169,211,231,0.80)" />
    <span
      style={{
        fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
        fontWeight:    700,
        fontSize:      '10px',
        letterSpacing: '0.10em',
        color:         'rgba(169,211,231,0.80)',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  </motion.button>
);

// ─────────────────────────────────────────────────────────────────────────────
// AppShell component
// ─────────────────────────────────────────────────────────────────────────────

export const AppShell: React.FC<AppShellProps> = ({ onPlay }) => {
  const [activeTab,    setActiveTab]    = useState<LobbyTab>('race');
  const [overlayPage,  setOverlayPage]  = useState<OverlayPage>(null);

  const handleTabChange = (tab: LobbyTab) => {
    setOverlayPage(null);
    setActiveTab(tab);
  };

  const handleNavigate = (dest: string) => {
    // Allow LobbyScreen quick-access buttons to change tabs
    if (['race','career','club','scouts','market','rankings','training','style','store'].includes(dest)) {
      handleTabChange(dest as LobbyTab);
    }
  };

  const goToLobby     = () => handleTabChange('race');
  const openSettings  = () => setOverlayPage('settings');
  const openProfile   = () => setOverlayPage('profile');
  const openRewards   = () => setOverlayPage('rewards');
  const closeOverlay  = () => setOverlayPage(null);

  // Show back button when: not on the race tab OR any overlay is open
  const showBack = activeTab !== 'race' || overlayPage !== null;
  const backLabel = overlayPage ? overlayPage.charAt(0).toUpperCase() + overlayPage.slice(1) : TAB_LABELS[activeTab];

  return (
    <div
      className="w-full h-full relative overflow-hidden select-none"
      style={{ background: '#041421' }}  /* lobbyBgDeep fallback */
    >
      {/* ── Persistent top bar ── */}
      <TopUtilityBar onSettings={openSettings} onProfile={openProfile} onRewards={openRewards} />

      {/* ── Back button (shown when not on race tab or in settings) ── */}
      <AnimatePresence>
        {showBack && (
          <BackButton
            key="app-back"
            label="Lobby"
            onClick={overlayPage !== null ? closeOverlay : goToLobby}
          />
        )}
      </AnimatePresence>

      {/* ── Main content area ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={overlayPage ?? activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'absolute',
            top:      '48px',
            bottom:   '60px',
            left:     0,
            right:    0,
            overflow: 'hidden',
          }}
        >
          {overlayPage === 'settings' ? (
            <SettingsPage />
          ) : overlayPage === 'profile' ? (
            <ProfilePage />
          ) : overlayPage === 'rewards' ? (
            <RewardsPage />
          ) : (
            renderTab(activeTab, onPlay, handleNavigate)
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Overlay side-tap close area ── */}
      {overlayPage !== null && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={closeOverlay}
          style={{
            position:   'absolute',
            top:        '48px',
            right:      0,
            bottom:     '60px',
            width:      '32px',
            background: 'transparent',
            border:     'none',
            cursor:     'pointer',
            zIndex:     65,
          }}
          aria-label="Close overlay"
        />
      )}

      {/* ── Persistent bottom tab bar ── */}
      <IconTabBar
        activeTab={overlayPage ? activeTab : activeTab}
        onChange={handleTabChange}
      />
    </div>
  );
};

export default AppShell;
