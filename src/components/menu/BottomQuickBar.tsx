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
    <nav className="h-20 max-[1024px]:h-16 bg-black/60 backdrop-blur-md border-t border-white/10 px-2 max-[1024px]:px-1 flex items-center justify-start max-[1024px]:overflow-x-auto max-[1024px]:[-ms-overflow-style:none] max-[1024px]:[scrollbar-width:none] max-[1024px]:[&::-webkit-scrollbar]:hidden gap-1 sticky bottom-0 z-50">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() => {
            action.onClick?.();
            if (!action.onClick && onScreenChange) {
              onScreenChange(defaultActionRoute[action.id]);
            }
          }}
          className="group flex flex-col items-center justify-center gap-1 px-2 py-2 hover:bg-white/10 transition-colors rounded-lg flex-1 min-w-[88px] max-[1024px]:flex-none max-[1024px]:min-w-[92px] border border-transparent hover:border-white/10"
        >
          <span className="material-symbols-outlined text-white/70 group-hover:text-primary-fixed transition-colors max-[1024px]:text-base">
            {action.icon}
          </span>
          <span className="text-[10px] max-[1024px]:text-[9px] font-bold text-white/70 group-hover:text-primary-fixed transition-colors uppercase tracking-tighter">
            {action.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomQuickBar;
