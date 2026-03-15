/**
 * Bottom Quick Bar - SWIM 26 Material Design 3
 * Quick access to game modes and features
 */

import React from 'react';
import type { MenuScreen } from './GlobalMenuLayout';

interface BottomQuickBarProps {
  onScreenChange?: (screen: MenuScreen) => void;
  onQuickRaceClick?: () => void;
  onTrainingClick?: () => void;
  onRankedClick?: () => void;
  onLockerRoomClick?: () => void;
  onReplaysClick?: () => void;
  onRewardsClick?: () => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  onClick?: () => void;
}

export const BottomQuickBar: React.FC<BottomQuickBarProps> = ({
  onScreenChange,
  onQuickRaceClick,
  onTrainingClick,
  onRankedClick,
  onLockerRoomClick,
  onReplaysClick,
  onRewardsClick,
}) => {
  const defaultActionRoute: Record<string, MenuScreen> = {
    'quick-race': 'PLAY',
    training: 'CAREER',
    ranked: 'PLAY',
    'locker-room': 'LOCKER_ROOM',
    replays: 'LIVE_EVENTS',
    rewards: 'REWARDS',
  };

  const quickActions: QuickAction[] = [
    { id: 'quick-race', label: 'Quick Race', icon: 'play_arrow', onClick: onQuickRaceClick },
    { id: 'training', label: 'Training', icon: 'fitness_center', onClick: onTrainingClick },
    { id: 'ranked', label: 'Ranked', icon: 'leaderboard', onClick: onRankedClick },
    { id: 'locker-room', label: 'Locker', icon: 'checkroom', onClick: onLockerRoomClick },
    { id: 'replays', label: 'Replays', icon: 'replay', onClick: onReplaysClick },
    { id: 'rewards', label: 'Rewards', icon: 'card_giftcard', onClick: onRewardsClick },
  ];

  return (
    <nav className="h-20 max-[900px]:h-16 bg-black/60 backdrop-blur-md border-t border-white/10 px-2 max-[900px]:px-1 flex items-center justify-center gap-1 sticky bottom-0 z-50">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() => {
            action.onClick?.();
            if (!action.onClick && onScreenChange) {
              onScreenChange(defaultActionRoute[action.id]);
            }
          }}
          className="group flex flex-col items-center justify-center gap-1 px-2 py-2 hover:bg-white/10 transition-colors rounded-lg flex-1 border border-transparent hover:border-white/10"
        >
          <span className="material-symbols-outlined text-white/70 group-hover:text-primary-fixed transition-colors max-[900px]:text-base">
            {action.icon}
          </span>
          <span className="text-[10px] max-[900px]:text-[9px] font-bold text-white/70 group-hover:text-primary-fixed transition-colors uppercase tracking-tighter">
            {action.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomQuickBar;
