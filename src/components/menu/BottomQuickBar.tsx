/**
 * Bottom Quick Bar - SWIM 26 Material Design 3
 * Quick access to game modes and features
 */

import React from 'react';

interface BottomQuickBarProps {
  onScreenChange?: (screen: string) => void;
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
  onQuickRaceClick,
  onTrainingClick,
  onRankedClick,
  onLockerRoomClick,
  onReplaysClick,
  onRewardsClick,
}) => {
  const quickActions: QuickAction[] = [
    { id: 'quick-race', label: 'Quick Race', icon: 'play_arrow', onClick: onQuickRaceClick },
    { id: 'training', label: 'Training', icon: 'fitness_center', onClick: onTrainingClick },
    { id: 'ranked', label: 'Ranked', icon: 'leaderboard', onClick: onRankedClick },
    { id: 'locker-room', label: 'Locker', icon: 'checkroom', onClick: onLockerRoomClick },
    { id: 'replays', label: 'Replays', icon: 'replay', onClick: onReplaysClick },
    { id: 'rewards', label: 'Rewards', icon: 'card_giftcard', onClick: onRewardsClick },
  ];

  return (
    <nav className="h-20 bg-surface-container/50 backdrop-blur-md border-t border-outline-variant/20 px-4 flex items-center justify-center gap-2 sticky bottom-0 z-50">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className="group flex flex-col items-center gap-1 px-4 py-2 hover:bg-surface-container-high transition-colors rounded-lg flex-1"
        >
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
            {action.icon}
          </span>
          <span className="text-[10px] font-bold text-on-surface-variant group-hover:text-primary transition-colors uppercase tracking-tighter">
            {action.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomQuickBar;
