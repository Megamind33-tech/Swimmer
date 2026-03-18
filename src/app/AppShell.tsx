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
 * AppShell does NOT own:
 *   - PlayScreen / PreRaceSetup / RaceScene / PauseMenu / RaceResultScreen
 *     (all game-flow screens live in GameShell)
 *
 * AppShell exposes onPlay so GameShell can trigger the race.
 *
 * Anti-patterns deliberately avoided:
 *   ✗ Full-page scroll
 *   ✗ <header>/<footer> web structure
 *   ✗ SaaS dashboard card grids
 *   ✗ Marketing hero sections
 *   ✗ Nested page trees requiring > 2 taps to reach a destination
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

// Lobby system (Phase 2)
import { LobbyScreen }    from '../lobby/LobbyScreen';
import { TopUtilityBar }  from '../lobby/TopUtilityBar';
import { IconTabBar, type LobbyTab } from '../lobby/IconTabBar';

// Page content
import { CareerMode }     from '../pages/CareerMode';
import { Championships }  from '../pages/Championships';
import {
  TrainingPage,
  SettingsPage,
} from '../pages/UtilityPages';
import { SwimmerScreen }  from '../components/menu/SwimmerScreen';
import { StoreScreen }    from '../components/menu/StoreScreen';

// Dev inspector
import { BrowserToolkit } from '../components/BrowserToolkit';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Settings is not a tab — it's accessed via the top utility bar. */
type OverlayPage = 'settings' | null;

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
    case 'training': return <TrainingPage />;
    case 'rankings': return <Championships />;
    case 'style':    return <SwimmerScreen />;
    case 'store':    return <StoreScreen />;
    default:         return <LobbyScreen onStartRace={onPlay} onNavigate={onNavigate} />;
  }
}

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
    if (['race','career','training','rankings','style','store'].includes(dest)) {
      handleTabChange(dest as LobbyTab);
    }
  };

  const openSettings  = () => setOverlayPage('settings');
  const closeOverlay  = () => setOverlayPage(null);

  return (
    <div
      className="w-full h-full relative overflow-hidden select-none"
      style={{ background: '#041421' }}  /* lobbyBgDeep fallback */
    >
      {/* ── Persistent top bar ── */}
      <TopUtilityBar onSettings={openSettings} />

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
            bottom:   '56px',
            left:     0,
            right:    0,
            overflow: 'hidden',
          }}
        >
          {overlayPage === 'settings' ? (
            <SettingsPage />
          ) : (
            renderTab(activeTab, onPlay, handleNavigate)
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Settings back-tap close area (tap outside settings to dismiss) ── */}
      {overlayPage === 'settings' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={closeOverlay}
          style={{
            position:   'absolute',
            top:        '48px',
            right:      0,
            bottom:     '56px',
            width:      '32px',
            background: 'transparent',
            border:     'none',
            cursor:     'pointer',
            zIndex:     65,
          }}
          aria-label="Close settings"
        />
      )}

      {/* ── Dev inspector ── */}
      <BrowserToolkit
        activeTab={activeTab}
        utilityPage={overlayPage}
        onOpenTab={handleTabChange}
        onOpenUtility={(p) => p === 'settings' ? openSettings() : undefined}
        onCloseUtility={closeOverlay}
      />

      {/* ── Persistent bottom tab bar ── */}
      <IconTabBar
        activeTab={overlayPage ? activeTab : activeTab}
        onChange={handleTabChange}
      />
    </div>
  );
};

export default AppShell;
