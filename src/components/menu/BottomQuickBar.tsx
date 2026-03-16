/**
 * Power Hub - Game-Focused Bottom-Right Action Cluster
 * Primary action buttons with magnetic effects and broadcast aesthetic
 */

import React, { useState } from 'react';

interface BottomQuickBarProps {
  onScreenChange?: (screen: string) => void;
  onQuickRaceClick?: () => void;
  onTrainingClick?: () => void;
  onRankedClick?: () => void;
  onLockerRoomClick?: () => void;
  onReplaysClick?: () => void;
  onRewardsClick?: () => void;
}

interface PrimaryAction {
  id: string;
  label: string;
  icon: string;
  size: 'large' | 'small';
  onClick?: () => void;
  route?: string;
}

export const BottomQuickBar: React.FC<BottomQuickBarProps> = (props) => {
  const { onScreenChange } = props;
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const defaultActionRoute: Record<string, string> = {
    'quick-race': 'PLAY',
    'ranked': 'PLAY',
    'locker-room': 'SWIMMER',
    'replays': 'LIVE_EVENTS',
    'rewards': 'STORE',
  };

  const primaryActions: PrimaryAction[] = [
    { id: 'quick-race', label: 'QUICK RACE', icon: 'play_arrow', size: 'large', onClick: props.onQuickRaceClick },
    { id: 'ranked', label: 'RANKED', icon: 'leaderboard', size: 'large', onClick: props.onRankedClick },
  ];

  const secondaryActions: PrimaryAction[] = [
    { id: 'locker-room', label: 'Locker', icon: 'checkroom', size: 'small', onClick: props.onLockerRoomClick },
    { id: 'replays', label: 'Replays', icon: 'replay', size: 'small', onClick: props.onReplaysClick },
    { id: 'rewards', label: 'Rewards', icon: 'card_giftcard', size: 'small', onClick: props.onRewardsClick },
  ];

  const handleActionClick = (action: PrimaryAction) => {
    setActiveButton(action.id);
    setTimeout(() => setActiveButton(null), 150);

    action.onClick?.();
    if (!action.onClick && onScreenChange && action.route) {
      onScreenChange(action.route);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-3 safe-zone">
      {/* Primary Actions - Large Prominent Buttons */}
      <div className="flex flex-col gap-3">
        {primaryActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick({...action, route: defaultActionRoute[action.id]})}
            className={`group relative flex flex-col items-center justify-center gap-1 px-6 py-4 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
              action.id === 'quick-race'
                ? 'border-neon-cyan bg-gradient-to-br from-neon-cyan/20 to-neon-cyan/5 neon-glow-cyan hover:neon-stroke-active'
                : 'border-neon-cyan/60 bg-neon-cyan/10 hover:border-neon-cyan hover:neon-glow-cyan'
            } ${activeButton === action.id ? 'animate-squash-stretch' : 'hover:scale-105'} active:scale-95`}
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Icon */}
            <span className="material-symbols-outlined text-4xl text-neon-cyan drop-shadow-[0_0_12px_rgba(0,255,255,0.6)] relative z-10 group-hover:scale-110 transition-transform">
              {action.icon}
            </span>

            {/* Label */}
            <span className="text-xs font-bold font-din text-neon-cyan text-center leading-tight relative z-10 uppercase tracking-wider">
              {action.label}
            </span>

            {/* Depth shadow */}
            <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] pointer-events-none"></div>
          </button>
        ))}
      </div>

      {/* Secondary Actions - Clustered Small Buttons */}
      <div className="flex gap-2 flex-wrap justify-end max-w-[200px]">
        {secondaryActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick({...action, route: defaultActionRoute[action.id]})}
            className={`group relative w-12 h-12 flex items-center justify-center rounded-lg border border-white/30 glass-card hover:glass-card-elevated transition-all duration-300 ${
              activeButton === action.id ? 'animate-squash-stretch' : 'hover:scale-105'
            } active:scale-95`}
            title={action.label}
          >
            {/* Icon */}
            <span className="material-symbols-outlined text-xl text-white group-hover:text-neon-cyan transition-colors drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">
              {action.icon}
            </span>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-broadcast-overlay/95 border border-neon-cyan/30 rounded text-[8px] font-bold text-neon-cyan whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {action.label}
            </div>
          </button>
        ))}
      </div>

      {/* Power Hub glow accent */}
      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-neon-cyan/0 to-neon-cyan/10 -z-10 blur-xl"></div>
    </div>
  );
};

export default BottomQuickBar;
