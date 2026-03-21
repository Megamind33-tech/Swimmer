/**
 * AppShell — Phase 3 premium game lobby shell
 *
 * Layout contract:
 *   TopUtilityBar  — 48 px, absolute top  (profile, currencies, settings, events)
 *   Content area   — fills between bars, respects safe areas and back button zone
 *   IconTabBar     — 52 px (landscape) / 60 px (portrait), absolute bottom
 *
 * Navigation: flat — every main destination reachable in ≤ 2 taps.
 *   Primary tabs (IconTabBar):
 *     career | club | scouts | training | RACE | market | rankings | style | store
 *   Top bar quick-access:
 *     Profile | Rewards | Events | Coins | Gems | Settings
 *
 * AppShell does NOT own:
 *   - PlayScreen / PreRaceSetup / RaceScene / PauseMenu / RaceResultScreen
 *     (all game-flow screens live in GameShell)
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

import { useIsLandscapeMobile }     from '../hooks/useIsLandscapeMobile';
import { CHROME, TOUCH, safeArea, BACK_BTN_TOP_OFFSET, BACK_BTN_ZONE_H } from '../ui/responsive';
import { useA11y }                  from '../context/AccessibilityContext';

// Lobby system
import { LobbyScreen }   from '../lobby/LobbyScreen';
import { TopUtilityBar } from '../lobby/TopUtilityBar';
import { IconTabBar, type LobbyTab } from '../lobby/IconTabBar';

// Page content
import { CareerMode }     from '../pages/CareerMode';
import { Championships }  from '../pages/Championships';
import { Rankings }       from '../pages/Rankings';
import { ClubManagement } from '../pages/ClubManagement';
import { TransferMarket } from '../pages/TransferMarket';
import { Scouts }         from '../pages/Scouts';
import { TrainingPage, SettingsPage } from '../pages/UtilityPages';
import { SwimmerScreen }  from '../components/menu/SwimmerScreen';
import { StoreScreen }    from '../components/menu/StoreScreen';
import { ProfilePage }    from '../pages/ProfilePage';
import { RewardsPage }    from '../pages/RewardsPage';
import appSkinBackground  from '../designs/app_skin/venue-skin.jpg';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Non-tab pages accessed via the top utility bar. */
type OverlayPage = 'settings' | 'profile' | 'rewards' | 'championships' | null;

interface AppShellProps {
  /** Called when player taps START RACE — hands off to GameShell */
  onPlay: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab → page map
// ─────────────────────────────────────────────────────────────────────────────

function renderTab(
  tab: LobbyTab,
  onPlay: () => void,
  onNavigate: (t: string) => void,
  onBack?: () => void,
): React.ReactNode {
  switch (tab) {
    case 'race':     return <LobbyScreen onStartRace={onPlay} onNavigate={onNavigate} />;
    case 'career':   return <CareerMode />;
    case 'club':     return <ClubManagement />;
    case 'scouts':   return <Scouts />;
    case 'market':   return <TransferMarket />;
    case 'rankings': return <Rankings />;
    case 'training': return <TrainingPage />;
    case 'style':    return <SwimmerScreen />;
    case 'store':    return <StoreScreen onBack={onBack} />;
    default:         return <LobbyScreen onStartRace={onPlay} onNavigate={onNavigate} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Back button
// ─────────────────────────────────────────────────────────────────────────────

interface BackButtonProps {
  label:         string;
  onClick:       () => void;
  reducedMotion: boolean;
  highContrast:  boolean;
}

const BackButton: React.FC<BackButtonProps> = ({
  label,
  onClick,
  reducedMotion,
  highContrast,
}) => (
  <motion.button
    initial={reducedMotion ? false : { opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
    transition={{ duration: reducedMotion ? 0 : 0.18 }}
    whileTap={reducedMotion ? undefined : { scale: 0.92 }}
    onClick={onClick}
    aria-label={`Back to ${label}`}
    className="swim26-back-button"
    style={{
      position:       'absolute',
      /* Sits just below the top bar — uses safe-area-inset-left to avoid notch */
      top:            `${CHROME.topBar.normal + BACK_BTN_TOP_OFFSET}px`,
      left:           `max(10px, ${safeArea.left})`,
      zIndex:         68,
      display:        'flex',
      alignItems:     'center',
      gap:            '5px',
      /* minHeight ensures the touch target meets the 44 px minimum */
      minHeight:      `${TOUCH.minimum}px`,
      paddingInline:  '12px',
      borderRadius:   '10px',
      background:     highContrast
        ? 'rgba(2,10,20,0.95)'
        : 'rgba(4,20,33,0.85)',
      border: `1px solid ${highContrast
        ? 'rgba(56,214,255,0.45)'
        : 'rgba(56,214,255,0.20)'}`,
      backdropFilter:      'blur(12px)',
      WebkitBackdropFilter:'blur(12px)',
      cursor:         'pointer',
      userSelect:     'none',
      WebkitUserSelect:'none',
      /* Focus-visible ring */
      outline:        'none',
    }}
  >
    <ChevronLeft size={16} color={highContrast ? '#A9D3E7' : 'rgba(169,211,231,0.80)'} />
    <span
      style={{
        fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
        fontWeight:    700,
        fontSize:      '11px',
        letterSpacing: '0.10em',
        color:         highContrast ? '#D0EAF7' : 'rgba(169,211,231,0.80)',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  </motion.button>
);

// ─────────────────────────────────────────────────────────────────────────────
// AppShell
// ─────────────────────────────────────────────────────────────────────────────

export const AppShell: React.FC<AppShellProps> = ({ onPlay }) => {
  const [activeTab,   setActiveTab]   = useState<LobbyTab>('race');
  const [overlayPage, setOverlayPage] = useState<OverlayPage>(null);

  const isLandscapeMobile = useIsLandscapeMobile();
  const { settings: a11y } = useA11y();
  const { reducedMotion, highContrast } = a11y;

  const topBarH    = CHROME.topBar.normal; // 48 px — never compressed
  const bottomBarH = isLandscapeMobile
    ? CHROME.bottomBar.landscape  // 52 px
    : CHROME.bottomBar.normal;    // 60 px

  const handleTabChange = (tab: LobbyTab) => {
    setOverlayPage(null);
    setActiveTab(tab);
  };

  const handleNavigate = (dest: string) => {
    if (dest === 'championships') { setOverlayPage('championships'); return; }
    if (['race','career','club','scouts','market','rankings','training','style','store'].includes(dest)) {
      handleTabChange(dest as LobbyTab);
    }
  };

  const goToLobby         = () => handleTabChange('race');
  const openSettings      = () => setOverlayPage('settings');
  const openProfile       = () => setOverlayPage('profile');
  const openRewards       = () => setOverlayPage('rewards');
  const closeOverlay      = () => setOverlayPage(null);

  /** Store manages its own back button */
  const isStoreFullscreen = activeTab === 'store' && overlayPage === null;
  /** Lobby tab with no overlay — show top + bottom chrome */
  const isLobby           = activeTab === 'race' && overlayPage === null;
  const hideChrome        = !isLobby;
  const showBack          = hideChrome && !isStoreFullscreen;

  return (
    <div
      className="w-full h-full relative overflow-hidden select-none"
      style={{ background: 'var(--lobby-venue-ocean-radial)' }}
    >
      {/* Venue photo background — subtle texture */}
      <img
        src={appSkinBackground}
        alt=""
        aria-hidden
        style={{
          position:   'absolute',
          inset:      0,
          width:      '100%',
          height:     '100%',
          objectFit:  'cover',
          opacity:    0.12,
          mixBlendMode:'overlay',
          filter:     'saturate(0.9) contrast(1.05)',
          pointerEvents:'none',
          zIndex:     0,
        }}
      />
      {/* Dark overlay */}
      <div
        aria-hidden
        style={{
          position:     'absolute',
          inset:        0,
          background:   highContrast ? 'rgba(0,0,0,0.60)' : 'rgba(0,0,0,0.45)',
          pointerEvents:'none',
          zIndex:       0,
        }}
      />

      {/* ── Persistent top bar (lobby only) ── */}
      {!hideChrome && (
        <TopUtilityBar
          onSettings={openSettings}
          onProfile={openProfile}
          onRewards={openRewards}
          onNavigate={handleNavigate}
        />
      )}

      {/* ── Back button ── */}
      <AnimatePresence>
        {showBack && (
          <BackButton
            key="app-back"
            label="Lobby"
            onClick={overlayPage !== null ? closeOverlay : goToLobby}
            reducedMotion={reducedMotion}
            highContrast={highContrast}
          />
        )}
      </AnimatePresence>

      {/* ── Main content area ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={overlayPage ?? activeTab}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? false : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.18 }}
          style={{
            position: 'absolute',
            top:      hideChrome ? 0 : `${topBarH}px`,
            bottom:   hideChrome ? 0 : `${bottomBarH}px`,
            left:     0,
            right:    0,
            overflow: 'hidden',
            /*
             * When the back button is visible, reserve BACK_BTN_ZONE_H (96 px)
             * from the top so the button never covers interactive page content.
             * BACK_BTN_ZONE_H = topBar (48) + offset (4) + minTouchTarget (44)
             */
            paddingTop: showBack ? `${BACK_BTN_ZONE_H}px` : undefined,
            boxSizing:  'border-box',
          }}
        >
          {overlayPage === 'settings'      ? <SettingsPage /> :
           overlayPage === 'profile'       ? <ProfilePage />  :
           overlayPage === 'rewards'       ? <RewardsPage />  :
           overlayPage === 'championships' ? <Championships /> :
           renderTab(activeTab, onPlay, handleNavigate, goToLobby)}
        </motion.div>
      </AnimatePresence>

      {/* ── Overlay side-tap close area (right edge) ── */}
      {overlayPage !== null && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={closeOverlay}
          aria-label="Close overlay"
          style={{
            position:  'absolute',
            top:       0,
            right:     0,
            bottom:    0,
            width:     `${TOUCH.minimum}px`,
            background:'transparent',
            border:    'none',
            cursor:    'pointer',
            zIndex:    65,
          }}
        />
      )}

      {/* ── Persistent bottom tab bar (lobby only) ── */}
      {!hideChrome && (
        <IconTabBar activeTab={activeTab} onChange={handleTabChange} />
      )}
    </div>
  );
};

export default AppShell;
