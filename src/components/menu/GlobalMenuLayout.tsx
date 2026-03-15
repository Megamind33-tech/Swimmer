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
    <div className="w-screen h-screen bg-background text-on-surface overflow-hidden flex flex-col">
      {/* Background Gradient Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-tertiary/5 rounded-full blur-3xl"></div>
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
        <div className="flex-1 flex overflow-hidden gap-4 px-2">
          {/* Left Navigation Rail */}
          <LeftNavigationRail
            currentScreen={currentScreen}
            onScreenChange={onScreenChange}
          />

          {/* Center Content Area - Full width or flex */}
          <div className={`${showRightPanel ? 'flex-1' : 'flex-1'} overflow-y-auto`}>
            {children}
          </div>

          {/* Right Utility Panel - Only on HOME */}
          {showRightPanel && (
            <div className="w-72 bg-surface-container/50 backdrop-blur-md border-l border-outline-variant/20 overflow-y-auto p-4 space-y-4">
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
