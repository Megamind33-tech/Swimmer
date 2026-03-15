/**
 * SWIM 26 - Global Menu Layout (New Design)
 * Professional AAA menu framework with Material Design 3 dark theme
 */

import React, { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { LeftNavigationRail } from './LeftNavigationRail';
import { BottomQuickBar } from './BottomQuickBar';

export type MenuScreen =
  | 'HOME'
  | 'PLAY'
  | 'CAREER'
  | 'SWIMMER'
  | 'CLUB'
  | 'LIVE_EVENTS'
  | 'SOCIAL'
  | 'STORE'
  | 'LOCKER_ROOM'
  | 'REWARDS'
  | 'PRE_RACE'
  | 'SETTINGS'
  | 'POST_GAME';

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
  onProfileClick?: () => void;
  onInboxClick?: () => void;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
  onQuickRaceClick?: () => void;
  onTrainingClick?: () => void;
  onRankedClick?: () => void;
  onLockerRoomClick?: () => void;
  onReplaysClick?: () => void;
  onRewardsClick?: () => void;
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
  onProfileClick,
  onInboxClick,
  onSettingsClick,
  onNotificationsClick,
  onQuickRaceClick,
  onTrainingClick,
  onRankedClick,
  onLockerRoomClick,
  onReplaysClick,
  onRewardsClick,
}) => {
  const showRightPanel = currentScreen === 'HOME' && rightPanel;

  return (
    <div className="app-race-theme w-screen h-dvh bg-background text-on-surface overflow-hidden flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-slate-900/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <TopBar
          playerLevel={playerLevel}
          playerName={playerName}
          softCurrency={softCurrency}
          premiumCurrency={premiumCurrency}
          playerAvatarUrl={playerAvatarUrl}
          onProfileClick={onProfileClick}
          onInboxClick={onInboxClick}
          onSettingsClick={onSettingsClick}
          onNotificationsClick={onNotificationsClick}
        />

        <div className="flex-1 flex overflow-hidden gap-2 px-2 py-2 max-[1024px]:px-0 max-[1024px]:py-0">
          <div>
            <LeftNavigationRail currentScreen={currentScreen} onScreenChange={onScreenChange} />
          </div>

          <div className="flex-1 overflow-y-auto max-[1024px]:px-2 max-[1024px]:pt-2">{children}</div>

          {showRightPanel && (
            <div className="w-72 bg-black/45 backdrop-blur-md border-l border-white/10 overflow-y-auto p-3 space-y-3 max-[1024px]:hidden">
              {rightPanel}
            </div>
          )}
        </div>

        {showRightPanel && (
          <div className="hidden max-[1024px]:block border-t border-white/10 bg-black/45 px-2 py-2 max-h-44 overflow-y-auto">
            {rightPanel}
          </div>
        )}

        <BottomQuickBar
          onScreenChange={onScreenChange}
          onQuickRaceClick={onQuickRaceClick}
          onTrainingClick={onTrainingClick}
          onRankedClick={onRankedClick}
          onLockerRoomClick={onLockerRoomClick}
          onReplaysClick={onReplaysClick}
          onRewardsClick={onRewardsClick}
        />
      </div>
    </div>
  );
};

export default GlobalMenuLayout;
