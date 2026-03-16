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

export const BottomQuickBar: React.FC<BottomQuickBarProps> = (props) => {
  const { onScreenChange } = props;
  const defaultActionRoute: Record<string, MenuScreen> = {
    'quick-race': 'PLAY',
    training: 'CAREER',
    ranked: 'PLAY',
    'locker-room': 'SWIMMER',
    replays: 'LIVE_EVENTS',
    rewards: 'STORE',
  };

  const quickActions: QuickAction[] = [
    { id: 'quick-race', label: 'Quick Race', icon: 'play_arrow', onClick: props.onQuickRaceClick },
    { id: 'training', label: 'Training', icon: 'fitness_center', onClick: props.onTrainingClick },
    { id: 'ranked', label: 'Ranked', icon: 'leaderboard', onClick: props.onRankedClick },
    { id: 'locker-room', label: 'Locker', icon: 'checkroom', onClick: props.onLockerRoomClick },
    { id: 'replays', label: 'Replays', icon: 'replay', onClick: props.onReplaysClick },
    { id: 'rewards', label: 'Rewards', icon: 'card_giftcard', onClick: props.onRewardsClick },
  ];

  return (
    <nav className="h-20 min-h-20 shrink-0 bg-gradient-to-t from-[#070f1f]/98 to-[#0a162b]/98 backdrop-blur-md border-t-2 border-white/20 px-4 flex items-center justify-center gap-2 sticky bottom-0 z-[70] shadow-[0_-10px_24px_rgba(0,0,0,0.45)]">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() => {
            action.onClick?.();
            if (!action.onClick && onScreenChange) {
              onScreenChange(defaultActionRoute[action.id]);
            }
          }}
          className="group flex flex-col items-center gap-1 px-4 py-2 hover:bg-white/10 transition-colors rounded-lg flex-1 border border-transparent hover:border-white/15"
        >
          <span className="material-symbols-outlined text-white group-hover:text-white transition-colors">
            {action.icon}
          </span>
          <span className="text-[10px] font-bold text-white group-hover:text-white transition-colors uppercase tracking-tighter">
            {action.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomQuickBar;
