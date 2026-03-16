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
    <div className="menu-safe-zone w-screen h-dvh bg-surface text-on-surface overflow-hidden flex flex-col font-body selection:bg-primary/30">
      {/* Cinematic Performance Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src={poolNightBackground}
          alt="Performance Arena"
          className="absolute inset-0 h-full w-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/40 via-surface/80 to-surface" />
        <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent opacity-50" />
        
        {/* Kinetic Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(129,236,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(129,236,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      {/* Primary Command Interface */}
      <div className="relative z-10 flex flex-col h-full min-h-0">
        <TopBar
          playerLevel={playerLevel}
          playerName={playerName}
          softCurrency={softCurrency}
          premiumCurrency={premiumCurrency}
          playerAvatarUrl={playerAvatarUrl}
        />

        {/* Global Interaction Deck */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          <LeftNavigationRail
            currentScreen={currentScreen}
            onScreenChange={onScreenChange}
          />

          {/* Active Viewport Area */}
          <main className="flex-1 flex flex-col min-w-0 min-h-0 py-6 pr-10">
            <div className="flex-1 min-h-0 flex gap-6">
               <div className="flex-1 min-h-0 overflow-y-auto rounded-[40px] border border-white/5 bg-surface/40 backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-all duration-500">
                 {children}
               </div>

               {/* Auxiliary Telemetry Panel - Only on HOME */}
               {showRightPanel && (
                 <aside className="w-[380px] rounded-[40px] bg-surface/20 border border-white/5 backdrop-blur-xl overflow-y-auto p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                   {rightPanel}
                 </aside>
               )}
            </div>
          </main>
        </div>

        <BottomQuickBar onScreenChange={onScreenChange} />
      </div>
    </div>
  );
};

export default GlobalMenuLayout;
