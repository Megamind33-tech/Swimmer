/**
 * SWIM 26 - Global Menu Layout (New Design)
 * Professional AAA menu framework with Material Design 3 dark theme
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { TopBar } from './TopBar';
import { LeftNavigationRail } from './LeftNavigationRail';
import { BottomQuickBar } from './BottomQuickBar';
import poolNightBackground from '../../designs/locker_room_custom/screen.png';

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

  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [utilityMode, setUtilityMode] = useState<'content' | 'utility'>('content');

  useEffect(() => {
    const evaluate = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setIsMobileLandscape(isLandscape && window.innerWidth <= 1023);
    };

    evaluate();
    window.addEventListener('resize', evaluate);
    window.addEventListener('orientationchange', evaluate);

    return () => {
      window.removeEventListener('resize', evaluate);
      window.removeEventListener('orientationchange', evaluate);
    };
  }, []);

  useEffect(() => {
    if (!isMobileLandscape) {
      setUtilityMode('content');
    }
  }, [isMobileLandscape, currentScreen]);

  const showDesktopUtility = Boolean(currentScreen === 'HOME' && rightPanel && !isMobileLandscape);
  const showMobileUtilitySwitch = Boolean(currentScreen === 'HOME' && rightPanel && isMobileLandscape);

  return (
    <div className="menu-safe-zone menu-shell menu-shell-grid w-screen h-dvh bg-surface text-on-surface overflow-hidden font-body selection:bg-primary/30">
      {/* Cinematic Performance Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src={poolNightBackground}
          alt="Performance Arena"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Primary Command Interface */}
      <div className="relative z-10 contents">
        <TopBar
          playerLevel={playerLevel}
          playerName={playerName}
          softCurrency={softCurrency}
          premiumCurrency={premiumCurrency}
          playerAvatarUrl={playerAvatarUrl}
        />

        {/* Global Interaction Deck */}
        <div className="menu-content-grid min-h-0 overflow-hidden">
          <LeftNavigationRail
            currentScreen={currentScreen}
            onScreenChange={onScreenChange}
          />

          {/* Active Viewport Area */}
          <main className="menu-main-frame menu-main-content flex flex-col min-w-0 min-h-0 py-6 pr-10">
            {showMobileUtilitySwitch && (
              <div className="menu-utility-switch mb-2 inline-flex items-center rounded-xl border border-white/10 bg-surface/40 p-1 self-end">
                <button
                  onClick={() => setUtilityMode('content')}
                  className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${utilityMode === 'content' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant'}`}
                >
                  Content
                </button>
                <button
                  onClick={() => setUtilityMode('utility')}
                  className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${utilityMode === 'utility' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant'}`}
                >
                  Utility
                </button>
              </div>
            )}

            <div className="menu-main-columns flex-1 min-h-0 flex gap-6 relative">
               <div className={`menu-primary-surface menu-page-surface flex-1 min-h-0 overflow-y-auto rounded-[40px] border border-white/5 bg-surface/40 backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-all duration-500 ${utilityMode === 'utility' ? 'menu-mobile-hidden' : ''}`}>
                 {children}
               </div>

               {showDesktopUtility && (
                 <aside className="menu-aux-surface menu-utility-surface w-[380px] rounded-[40px] bg-surface/20 border border-white/5 backdrop-blur-xl overflow-y-auto p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                   {rightPanel}
                 </aside>
               )}

               {showMobileUtilitySwitch && (
                 <aside className={`menu-utility-drawer menu-utility-surface w-full rounded-[24px] bg-surface/40 border border-white/10 backdrop-blur-xl overflow-y-auto p-3 shadow-[0_20px_60px_rgba(0,0,0,0.3)] ${utilityMode === 'utility' ? 'is-open' : ''}`}>
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
