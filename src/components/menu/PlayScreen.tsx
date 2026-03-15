/**
 * Play Screen - SWIM 26 Game Mode Selection
 * Choose between different racing modes
 */

import React from 'react';

interface GameModeCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  rewards: string;
  playerCount?: string;
  color: string;
}

interface PlayScreenProps {
  onModeSelect?: (modeId: string) => void;
}

const GameModes: GameModeCard[] = [
  {
    id: 'quick-race',
    name: 'Quick Race',
    description: 'Fast race setup with instant matches',
    icon: 'play_arrow',
    difficulty: 'NORMAL',
    rewards: '100 XP, 500 Coins',
    playerCount: '4.2K playing',
    color: 'from-secondary-fixed to-secondary-fixed-dim',
  },
  {
    id: 'career-race',
    name: 'Career Race',
    description: 'Continue your career progression',
    icon: 'emoji_events',
    difficulty: 'HARD',
    rewards: '250 XP, 2000 Coins',
    color: 'from-primary-fixed to-primary-dim',
  },
  {
    id: 'ranked-match',
    name: 'Ranked Match',
    description: 'Competitive multiplayer battles',
    icon: 'leaderboard',
    difficulty: 'HARD',
    rewards: '300 XP, 3000 Coins',
    playerCount: '12.5K playing',
    color: 'from-error to-error-dim',
  },
  {
    id: 'time-trial',
    name: 'Time Trial',
    description: 'Solo challenge for best times',
    icon: 'schedule',
    difficulty: 'NORMAL',
    rewards: '150 XP, 1000 Coins',
    color: 'from-tertiary-fixed to-tertiary-dim',
  },
  {
    id: 'relay-mode',
    name: 'Relay Mode',
    description: 'Team-based swimming relay',
    icon: 'groups',
    difficulty: 'HARD',
    rewards: '400 XP, 4000 Coins',
    playerCount: '8.3K playing',
    color: 'from-secondary to-secondary-dim',
  },
  {
    id: 'ghost-race',
    name: 'Ghost Race',
    description: 'Race against your best times',
    icon: 'history',
    difficulty: 'EASY',
    rewards: '50 XP, 250 Coins',
    color: 'from-outline-variant to-outline',
  },
];

export const PlayScreen: React.FC<PlayScreenProps> = ({ onModeSelect }) => {
  return (
    <div className="flex-1 relative w-full h-full overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-outline-variant/20">
        <h1 className="font-headline text-4xl font-bold italic uppercase text-primary mb-2">Game Modes</h1>
        <p className="text-on-surface-variant text-sm">Select a game mode to start racing</p>
      </div>

      {/* Game Modes Grid */}
      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
        {GameModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeSelect?.(mode.id)}
            className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 h-48"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-90 group-hover:opacity-100`} />

            {/* Glass overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Content */}
            <div className="relative h-full flex flex-col p-4 justify-between z-10">
              {/* Icon & Title */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-2xl text-white">
                    {mode.icon}
                  </span>
                  <div className="text-left">
                    <h3 className="font-headline text-lg font-bold text-white uppercase">{mode.name}</h3>
                    <p className="text-[10px] text-white/70 uppercase tracking-tighter">{mode.difficulty}</p>
                  </div>
                </div>
                <p className="text-xs text-white/80">{mode.description}</p>
              </div>

              {/* Stats Footer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-white/70 uppercase font-bold">REWARDS</span>
                  <span className="text-white font-bold">{mode.rewards}</span>
                </div>
                {mode.playerCount && (
                  <div className="flex items-center gap-1 text-[10px] text-white/60">
                    <span className="material-symbols-outlined text-sm">person</span>
                    {mode.playerCount}
                  </div>
                )}
              </div>
            </div>

            {/* Hover Shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayScreen;
