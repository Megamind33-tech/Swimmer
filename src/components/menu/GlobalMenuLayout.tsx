/**
 * SWIM 26 - Global Menu Layout (New Design)
 * Professional AAA menu framework with Material Design 3 dark theme
 */

import React, { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { LeftNavigationRail } from './LeftNavigationRail';
import { BottomQuickBar } from './BottomQuickBar';
import championshipPoolBg from '../../designs/championship-pool-bg.jpg';

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
    <div className="w-screen h-dvh text-white overflow-hidden flex flex-col vignette" style={{
      backgroundImage: `url(${championshipPoolBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      {/* Background Overlay Layers with Pool Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Pool image base - already applied via inline styles above */}

        {/* Blurred overlay layer for depth - applied as blur filter to the entire bg */}
        <div className="absolute inset-0 backdrop-blur-[40px]"></div>

        {/* Teal color overlay - enhance night aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-br from-pool-teal/40 via-pool-dark/30 to-pool-navy/50"></div>

        {/* Additional navy overlay for deeper night effect */}
        <div className="absolute inset-0 bg-pool-navy/20"></div>

        {/* Bokeh particles floating on top */}
        <div className="absolute top-1/4 right-1/5 w-96 h-96 bg-pool-teal/15 rounded-full blur-3xl animate-parallax-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-parallax-float" style={{animationDelay: '-4s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-neon-cyan/5 rounded-full blur-3xl animate-parallax-float" style={{animationDelay: '-2s'}}></div>

        {/* Lens flares - neon cyan for dramatic effect */}
        <div className="absolute top-20 right-1/3 w-64 h-64 bg-gradient-to-br from-neon-cyan/20 to-transparent rounded-full blur-2xl animate-parallax-float"></div>
        <div className="absolute bottom-1/3 left-1/6 w-80 h-80 bg-gradient-to-tr from-neon-cyan/10 to-transparent rounded-full blur-3xl animate-parallax-float" style={{animationDelay: '-6s'}}></div>
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
        <div className="flex-1 flex overflow-hidden gap-3 px-2 py-2 safe-zone-x">
          {/* Left Navigation Rail */}
          <LeftNavigationRail
            currentScreen={currentScreen}
            onScreenChange={onScreenChange}
          />

          {/* Center Content Area - Full width or flex */}
          <div className={`${showRightPanel ? 'flex-1' : 'flex-1'} overflow-y-auto rounded-xl border border-white/10 glass-card`}>
            {children}
          </div>

          {/* Right Utility Panel - Only on HOME */}
          {showRightPanel && (
            <div className="w-72 glass-card overflow-y-auto p-4 space-y-4 shadow-[-10px_0_25px_rgba(0,0,0,0.3)]">
              {rightPanel}
            </div>
          )}
        </div>

        {/* Bottom Quick Bar */}
        <BottomQuickBar onScreenChange={onScreenChange} />

        {/* Live Ticker */}
        <div className="relative z-[70] h-12 bg-broadcast-overlay border-t border-white/10 flex items-center overflow-hidden">
          <div className="flex items-center h-full whitespace-nowrap animate-ticker-scroll font-barlow font-bold text-neon-cyan">
            <span className="mr-12">🔴 LIVE</span>
            <span className="mr-12">Global High Scores: #1 Alex Chen - 1:42.35</span>
            <span className="mr-12">Club News: SWIM26 Championship Finals - May 15th</span>
            <span className="mr-12">New Event: Butterfly Masters Race - Compete Now</span>
            <span className="mr-12">🔴 LIVE</span>
            <span className="mr-12">Global High Scores: #1 Alex Chen - 1:42.35</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalMenuLayout;
