/**
 * SWIM 26 - Global Menu Layout
 * Premium AAA menu framework with top bar, left nav, right panel, bottom quick bar
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
  return (
    <div className="w-screen h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black overflow-hidden flex flex-col">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
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

        {/* Middle Section: Left Nav + Center Content + Right Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Rail */}
          <LeftNavigationRail
            currentScreen={currentScreen}
            onScreenChange={onScreenChange}
          />

          {/* Center Content Area */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Right Utility Panel */}
          {rightPanel && (
            <div className="w-64 bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-l border-slate-700/50 overflow-y-auto p-4 space-y-6">
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
