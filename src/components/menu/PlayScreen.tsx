/**
 * Play Screen - Game Mode Selection with Broadcast Aesthetic
 * Glassmorphic cards with neon accents, biome textures, and ripple effects
 */

import React, { useRef, useState } from 'react';

interface GameModeCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  rewards: string;
  playerCount?: string;
  accentColor: string; // Neon accent color class
  biomeClass: string; // Biome texture class
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
    accentColor: 'border-blue-400/60',
    biomeClass: 'biome-quick-race',
  },
  {
    id: 'career-race',
    name: 'Career Race',
    description: 'Continue your career progression',
    icon: 'emoji_events',
    difficulty: 'HARD',
    rewards: '250 XP, 2000 Coins',
    accentColor: 'border-purple-400/60',
    biomeClass: 'biome-career-race',
  },
  {
    id: 'ranked-match',
    name: 'Ranked Match',
    description: 'Competitive multiplayer battles',
    icon: 'leaderboard',
    difficulty: 'HARD',
    rewards: '300 XP, 3000 Coins',
    playerCount: '12.5K playing',
    accentColor: 'border-red-400/60',
    biomeClass: 'biome-ranked-match',
  },
  {
    id: 'time-trial',
    name: 'Time Trial',
    description: 'Solo challenge for best times',
    icon: 'schedule',
    difficulty: 'NORMAL',
    rewards: '150 XP, 1000 Coins',
    accentColor: 'border-green-400/60',
    biomeClass: 'biome-time-trial',
  },
  {
    id: 'relay-mode',
    name: 'Relay Mode',
    description: 'Team-based swimming relay',
    icon: 'groups',
    difficulty: 'HARD',
    rewards: '400 XP, 4000 Coins',
    playerCount: '8.3K playing',
    accentColor: 'border-cyan-400/60',
    biomeClass: 'biome-relay-mode',
  },
  {
    id: 'ghost-race',
    name: 'Ghost Race',
    description: 'Race against your best times',
    icon: 'history',
    difficulty: 'EASY',
    rewards: '50 XP, 250 Coins',
    accentColor: 'border-yellow-400/60',
    biomeClass: 'biome-ghost-race',
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY':
      return 'text-green-300 border-green-400/70 bg-green-400/15 shadow-[0_0_8px_rgba(74,222,128,0.4)] font-mono-data tracking-widest';
    case 'NORMAL':
      return 'text-blue-300 border-blue-400/70 bg-blue-400/15 shadow-[0_0_8px_rgba(96,165,250,0.4)] font-mono-data tracking-widest';
    case 'HARD':
      return 'text-red-300 border-red-400/70 bg-red-400/15 shadow-[0_0_8px_rgba(248,113,113,0.4)] font-mono-data tracking-widest';
    default:
      return 'text-white/60 border-white/20 bg-white/5 font-mono-data tracking-widest';
  }
};

export const PlayScreen: React.FC<PlayScreenProps> = ({ onModeSelect }) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; cardId: string }>>([]);
  const [ignitedCard, setIgnitedCard] = useState<string | null>(null);
  const rippleIdRef = useRef(0);

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>, cardId: string) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Trigger ignition effect
    setIgnitedCard(cardId);
    setTimeout(() => setIgnitedCard(null), 600);

    const rippleId = rippleIdRef.current++;
    setRipples((prev) => [...prev, { id: rippleId, x, y, cardId }]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);
  };

  return (
    <div className="flex-1 relative w-full h-full overflow-y-auto flex flex-col safe-zone-x">
      {/* Header */}
      <div className="p-8 max-[900px]:p-5 border-b border-neon-cyan/20 bg-gradient-to-r from-broadcast-overlay via-neon-cyan/5 to-broadcast-overlay">
        <h1 className="font-din text-5xl max-[900px]:text-3xl font-black italic uppercase text-white mb-2 drop-shadow-[0_0_12px_rgba(0,255,255,0.3)]">
          Game Modes
        </h1>
        <p className="text-on-surface-variant text-base font-barlow font-bold">Select a game mode to start racing</p>
      </div>

      {/* Game Modes Grid */}
      <div className="flex-1 p-6 max-[900px]:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-max overflow-y-auto">
        {GameModes.map((mode) => {
          const diffColor = getDifficultyColor(mode.difficulty);

          return (
            <button
              key={mode.id}
              onClick={(e) => {
                handleRipple(e, mode.id);
                onModeSelect?.(mode.id);
              }}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 active:animate-squash-stretch h-56 glass-card-elevated border-2 ${mode.accentColor} hover:border-neon-cyan/80 skew-container ${mode.biomeClass} ${ignitedCard === mode.id ? 'ignite' : ''}`}
            >
              {/* Biome texture background - layered beneath overlays */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-broadcast-overlay/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Speed line texture */}
              <div className="absolute inset-0 speed-lines opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>

              {/* Content */}
              <div className="relative h-full flex flex-col p-6 max-[900px]:p-5 justify-between z-10">
                {/* Icon & Title Section */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`material-symbols-outlined text-4xl text-neon-cyan drop-shadow-[0_0_12px_rgba(0,255,255,0.5)] group-hover:scale-110 transition-transform`}>
                      {mode.icon}
                    </span>
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="font-din text-xl max-[900px]:text-lg font-black text-white uppercase tracking-wider leading-tight drop-shadow-[0_0_8px_rgba(0,255,255,0.2)]">
                        {mode.name}
                      </h3>
                      <div className={`text-[10px] font-barlow font-bold uppercase tracking-widest mt-1 px-2 py-1 rounded border w-fit ${diffColor}`}>
                        {mode.difficulty}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs max-[900px]:text-[11px] font-barlow font-bold text-white/85 leading-relaxed">
                    {mode.description}
                  </p>
                </div>

                {/* Stats Footer */}
                <div className="space-y-2 border-t border-neon-cyan/20 pt-3 mt-3">
                  {/* Rewards */}
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-white/70 font-barlow font-bold uppercase tracking-wider">Rewards</span>
                    <span className="text-neon-cyan font-din font-bold drop-shadow-[0_0_6px_rgba(0,255,255,0.4)]">
                      {mode.rewards}
                    </span>
                  </div>

                  {/* Player Count */}
                  {mode.playerCount && (
                    <div className="flex items-center gap-2 text-[10px] text-white/70 font-barlow font-bold">
                      <span className="material-symbols-outlined text-sm text-neon-cyan/60">
                        person
                      </span>
                      <span className="text-neon-cyan/80">{mode.playerCount}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ripple Effects */}
              {ripples.map((ripple) => (
                ripple.cardId === mode.id && (
                  <div
                    key={ripple.id}
                    className="absolute rounded-full bg-neon-cyan/40 pointer-events-none"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: '20px',
                      height: '20px',
                      transform: 'translate(-50%, -50%)',
                      animation: 'ripple-wave 0.6s cubic-bezier(0.4, 0, 0.6, 1) forwards',
                      boxShadow: '0 0 20px rgba(0, 255, 255, 0.6)',
                    }}
                  />
                )
              ))}

              {/* Hover glow effect */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/20 to-neon-cyan/0 opacity-0 group-hover:opacity-50 blur-xl -z-10 transition-opacity duration-300" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlayScreen;
