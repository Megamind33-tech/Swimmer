/**
 * SWIM 26 - Global Menu Layout (New Design)
 * Professional AAA menu framework with Material Design 3 dark theme
 */

import React, { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { LeftNavigationRail } from './LeftNavigationRail';
import { BottomQuickBar } from './BottomQuickBar';
import poolNightBackground from '../../designs/swim_26_main_menu/screen.png';

export type MenuScreen = 'HOME' | 'PLAY' | 'CAREER' | 'SWIMMER' | 'CLUB' | 'LIVE_EVENTS' | 'SOCIAL' | 'STORE';

interface GlobalMenuLayoutProps {
  currentScreen: MenuScreen;
  onScreenChange: (screen: MenuScreen) => void;
  children: ReactNode;
  rightPanel?: ReactNode;
  playerLevel?: number;
  playerName?: string;
  softCurrency?: number;
  premiumCurrency?: number;
  playerAvatarUrl?: string;
}

export const GlobalMenuLayout: React.FC<GlobalMenuLayoutProps> = ({
  currentScreen,
  onScreenChange,
  children,
  rightPanel,
  playerLevel = 1,
  playerName = 'Swimmer',
  softCurrency = 0,
  premiumCurrency = 0,
  playerAvatarUrl,
}) => {
  // Show right panel only on HOME screen to maximize hero area
  const showRightPanel = currentScreen === 'HOME' && rightPanel;

  return (
    <div className="menu-safe-zone w-screen h-dvh bg-[#060b14] text-white overflow-hidden flex flex-col">
      {/* Cinematic Pool Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src={poolNightBackground}
          alt="Olympic pool at night"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-70 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020812]/58 via-[#041223]/52 to-[#041223]/62" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#02101f]/42 via-transparent to-[#062031]/45" />

        <div className="ambient-bokeh absolute left-[8%] top-[16%] h-24 w-24 rounded-full bg-cyan-200/20 blur-2xl" />
        <div className="ambient-bokeh absolute left-[35%] top-[10%] h-16 w-16 rounded-full bg-white/20 blur-xl [animation-delay:1.1s]" />
        <div className="ambient-bokeh absolute right-[14%] top-[22%] h-20 w-20 rounded-full bg-sky-200/20 blur-2xl [animation-delay:2s]" />
        <div className="ambient-bokeh absolute right-[28%] bottom-[16%] h-24 w-24 rounded-full bg-cyan-100/15 blur-2xl [animation-delay:2.8s]" />

        <div className="ambient-flare absolute -left-24 top-1/4 h-52 w-52 rounded-full bg-cyan-300/18 blur-3xl" />
        <div className="ambient-flare absolute right-[-7rem] bottom-1/4 h-64 w-64 rounded-full bg-teal-300/14 blur-3xl [animation-delay:1.7s]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col h-full min-h-0">
        {/* Top Bar */}
        <TopBar
          playerLevel={playerLevel}
          playerName={playerName}
          softCurrency={softCurrency}
          premiumCurrency={premiumCurrency}
          playerAvatarUrl={playerAvatarUrl}
        />

        {/* Middle Section: Left Nav + Center Content + Right Panel (Landscape) */}
        <div className="flex-1 flex min-h-0 overflow-hidden gap-3 px-2 py-2 max-[900px]:px-1.5 max-[900px]:pb-1">
          {/* Left Navigation Rail */}
          <LeftNavigationRail
            currentScreen={currentScreen}
            onScreenChange={onScreenChange}
          />

          {/* Center Content Area - Full width or flex */}
          <div className={`${showRightPanel ? 'flex-1' : 'flex-1'} min-h-0 overflow-y-auto rounded-xl border border-white/10 bg-gradient-to-b from-[#0c1830]/70 to-[#081326]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.35)]`}>
            {children}
          </div>

          {/* Right Utility Panel - Only on HOME */}
          {showRightPanel && (
            <div className="w-72 bg-[#0a1426]/75 backdrop-blur-md border-l border-white/10 overflow-y-auto p-4 space-y-4 shadow-[-10px_0_25px_rgba(0,0,0,0.3)]">
              {rightPanel}
            </div>
          )}
        </div>

        {/* Bottom Quick Bar */}
        <BottomQuickBar onScreenChange={onScreenChange} />
      </div>
    </div>
  );
};

export default GlobalMenuLayout;
