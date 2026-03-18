/**
 * AppShell — Non-race menu and lobby shell
 *
 * Owns everything that is NOT the Babylon.js race scene:
 *   - Global navigation (TopBar, BottomNav)
 *   - All lobby/management pages (home, career, club, scouts, market, champs)
 *   - Utility pages (friends, inbox, settings, training, events, rewards, pass, bonus)
 *   - Background theming (locker-room backdrop)
 *
 * AppShell does NOT own:
 *   - PlayScreen (game-mode picker) — game flow, lives in GameShell
 *   - PreRaceSetupScreen — game flow, lives in GameShell
 *   - RaceScene (Babylon canvas) — game flow, lives in GameShell
 *   - PauseMenu / RaceResultScreen — game flow, lives in GameShell
 *
 * AppShell exposes onPlay so GameShell can trigger the race flow.
 *
 * Layout contract (landscape mobile):
 *   TopBar     — h-14, absolute top
 *   Content    — between TopBar and BottomNav, scrollable only within the content area
 *   BottomNav  — h-16, absolute bottom
 *   SideMenu   — absolute left, between TopBar and BottomNav (home screen only)
 *
 * Anti-patterns deliberately avoided:
 *   ✗ Full-page scroll
 *   ✗ <header>/<footer> web structure
 *   ✗ SaaS dashboard card grids
 *   ✗ Marketing hero sections
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { BrowserToolkit } from '../components/BrowserToolkit';
import { HomePage } from '../pages/HomePage';
import { CareerMode } from '../pages/CareerMode';
import { ClubManagement } from '../pages/ClubManagement';
import { Scouts } from '../pages/Scouts';
import { TransferMarket } from '../pages/TransferMarket';
import { Championships } from '../pages/Championships';
import {
  BonusMissionsPage,
  EventsPage,
  FriendsPage,
  InboxPage,
  RewardsPage,
  SettingsPage,
  StarPassPage,
  TrainingPage,
} from '../pages/UtilityPages';
import lockerRoomBackground from '../designs/locker_room_custom/screen.png';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type MainTab =
  | 'home'
  | 'career'
  | 'club'
  | 'scouts'
  | 'market'
  | 'champs';

export type UtilityPage =
  | 'friends'
  | 'inbox'
  | 'settings'
  | 'training'
  | 'events'
  | 'rewards'
  | 'pass'
  | 'bonus';

interface AppShellProps {
  /** Called when player taps PLAY — hands off to GameShell for race flow */
  onPlay: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Page renderer
// ─────────────────────────────────────────────────────────────────────────────

function usePage(onPlay: () => void) {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [utilityPage, setUtilityPage] = useState<UtilityPage | null>(null);

  const openTab = (tab: string) => {
    setUtilityPage(null);
    setActiveTab(tab as MainTab);
  };

  const openUtility = (page: string) => setUtilityPage(page as UtilityPage);
  const closeUtility = () => setUtilityPage(null);

  const getPage = (): { key: string; node: React.ReactNode } => {
    // Utility pages take priority over tab pages
    if (utilityPage) {
      switch (utilityPage) {
        case 'friends':  return { key: 'friends',  node: <FriendsPage /> };
        case 'inbox':    return { key: 'inbox',    node: <InboxPage /> };
        case 'settings': return { key: 'settings', node: <SettingsPage /> };
        case 'training': return { key: 'training', node: <TrainingPage /> };
        case 'events':   return { key: 'events',   node: <EventsPage /> };
        case 'rewards':  return { key: 'rewards',  node: <RewardsPage /> };
        case 'pass':     return { key: 'pass',     node: <StarPassPage /> };
        case 'bonus':    return { key: 'bonus',    node: <BonusMissionsPage /> };
      }
    }

    switch (activeTab) {
      case 'home':   return { key: 'home',   node: <HomePage onSideMenuSelect={openUtility} onPlay={onPlay} /> };
      case 'career': return { key: 'career', node: <CareerMode /> };
      case 'club':   return { key: 'club',   node: <ClubManagement /> };
      case 'scouts': return { key: 'scouts', node: <Scouts /> };
      case 'market': return { key: 'market', node: <TransferMarket /> };
      case 'champs': return { key: 'champs', node: <Championships /> };
      default:       return { key: 'home',   node: <HomePage onSideMenuSelect={openUtility} onPlay={onPlay} /> };
    }
  };

  return { activeTab, openTab, utilityPage, openUtility, closeUtility, getPage };
}

// ─────────────────────────────────────────────────────────────────────────────
// AppShell component
// ─────────────────────────────────────────────────────────────────────────────

export const AppShell: React.FC<AppShellProps> = ({ onPlay }) => {
  const {
    activeTab,
    openTab,
    utilityPage,
    openUtility,
    closeUtility,
    getPage,
  } = usePage(onPlay);

  const currentPage = getPage();

  return (
    <div className="w-full h-full relative overflow-hidden font-sans select-none">
      {/*
        Background layer
        ─────────────────────────────────────────────────────────────────────
        The locker-room background is a single image that covers the
        entire shell.  It is NOT a scrollable page background — it is
        fixed artwork that the UI sits on top of.
      */}
      <img
        src={lockerRoomBackground}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {/* Dark tint over the background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--color-overlay-dark, rgba(5,11,20,0.72))' }}
      />

      {/*
        TopBar — player profile, currencies, utility shortcuts
        h-14 absolute top. Content area starts at top-14.
      */}
      <TopBar
        onOpenFriends={() => openUtility('friends')}
        onOpenInbox={() => openUtility('inbox')}
        onOpenSettings={() => openUtility('settings')}
      />

      {/*
        Page content area
        Fills between TopBar (top-14) and BottomNav (bottom-16).
        Each page component is responsible for NOT overflowing this area.
        AnimatePresence handles crossfade between tab switches.
      */}
      <AnimatePresence mode="wait">
        <React.Fragment key={currentPage.key}>
          {currentPage.node}
        </React.Fragment>
      </AnimatePresence>

      {/*
        Development inspector — remove in production build
        See FUTURE_WORK.md: "Remove BrowserToolkit from production build"
      */}
      <BrowserToolkit
        activeTab={activeTab}
        utilityPage={utilityPage}
        onOpenTab={openTab}
        onOpenUtility={openUtility}
        onCloseUtility={closeUtility}
      />

      {/*
        BottomNav — primary navigation rail
        h-16 absolute bottom. Contains PLAY button (raised, green).
      */}
      <BottomNav
        activeTab={activeTab}
        onChange={openTab}
        onPlay={onPlay}
      />
    </div>
  );
};

export default AppShell;
