/**
 * SWIM 26 - Global Menu Layout (New Design)
 * Professional AAA menu framework with Material Design 3 dark theme
 */

import React, { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { LeftNavigationRail } from './LeftNavigationRail';
import { BottomQuickBar } from './BottomQuickBar';

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
    <div className="w-screen h-screen bg-[#060b14] text-white overflow-hidden flex flex-col">
      {/* Background Gradient Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Bar */}
        <TopBar
          playerLevel={playerLevel}
          playerName={playerName}
          softCurrency={softCurrency}
          premiumCurrency={premiumCurrency}
          playerAvatarUrl={playerAvatarUrl}
        />

        {/* Middle Section: Left Nav + Center Content + Right Panel (Landscape) */}
        <div className="flex-1 flex overflow-hidden gap-3 px-2 py-2">
          {/* Left Navigation Rail */}
          <LeftNavigationRail
            currentScreen={currentScreen}
            onScreenChange={onScreenChange}
          />

          {/* Center Content Area - Full width or flex */}
          <div className={`${showRightPanel ? 'flex-1' : 'flex-1'} overflow-y-auto rounded-xl border border-white/10 bg-gradient-to-b from-[#0c1830]/70 to-[#081326]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.35)]`}>
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
