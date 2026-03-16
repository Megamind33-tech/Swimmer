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
      return 'text-green-200 border-green-400/80 bg-gradient-to-br from-green-400/25 to-green-400/10 shadow-[0_0_12px_rgba(74,222,128,0.6),inset_0_0_8px_rgba(74,222,128,0.2)] font-mono-data tracking-widest font-bold';
    case 'NORMAL':
      return 'text-blue-200 border-blue-400/80 bg-gradient-to-br from-blue-400/25 to-blue-400/10 shadow-[0_0_12px_rgba(96,165,250,0.6),inset_0_0_8px_rgba(96,165,250,0.2)] font-mono-data tracking-widest font-bold';
    case 'HARD':
      return 'text-red-200 border-red-400/80 bg-gradient-to-br from-red-400/25 to-red-400/10 shadow-[0_0_12px_rgba(248,113,113,0.6),inset_0_0_8px_rgba(248,113,113,0.2)] font-mono-data tracking-widest font-bold';
    default:
      return 'text-white/70 border-white/30 bg-white/8 font-mono-data tracking-widest font-bold';
  }
};

const getDifficultyBadgeIcon = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY':
      return '◆';
    case 'NORMAL':
      return '◆◆';
    case 'HARD':
      return '◆◆◆';
    default:
      return '◆';
  }
};

const getIllustrationPattern = (modeId: string) => {
  // Return SVG pattern data for each game mode
  switch (modeId) {
    case 'quick-race':
      // Ripple circles pattern
      return 'radial-gradient(circle at 50% 50%, rgba(0,255,255,0.08) 0%, rgba(0,255,255,0.04) 15%, transparent 30%), radial-gradient(circle at 70% 30%, rgba(0,255,255,0.06) 0%, transparent 25%)';
    case 'career-race':
      // Ascending ladder pattern
      return 'repeating-linear-gradient(0deg, rgba(255,200,100,0.06) 0px, rgba(255,200,100,0.06) 20px, transparent 20px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,200,100,0.04) 0px, rgba(255,200,100,0.04) 1px, transparent 1px, transparent 20px)';
    case 'ranked-match':
      // Crown/trophy pattern
      return 'conic-gradient(from 0deg at 50% 50%, rgba(255,215,0,0.08) 0deg, rgba(255,215,0,0.04) 180deg, rgba(255,215,0,0.08) 360deg)';
    case 'time-trial':
      // Stopwatch pattern
      return 'radial-gradient(circle at 50% 40%, rgba(0,255,255,0.08) 0%, rgba(0,255,255,0.02) 50%), radial-gradient(circle at 50% 60%, rgba(0,255,255,0.06) 0%, transparent 40%)';
    case 'relay-mode':
      // Converging arrows pattern
      return 'linear-gradient(45deg, rgba(0,255,255,0.06) 0%, transparent 50%), linear-gradient(-45deg, rgba(0,255,255,0.06) 0%, transparent 50%)';
    case 'ghost-race':
      // Reflection/mirror pattern
      return 'linear-gradient(0deg, transparent 40%, rgba(0,255,255,0.08) 45%, rgba(0,255,255,0.08) 55%, transparent 60%)';
    default:
      return 'rgba(0,255,255,0.05)';
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

              {/* Illustration Background */}
              <div
                className="absolute top-0 left-0 right-0 h-24 opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                style={{
                  background: getIllustrationPattern(mode.id),
                  pointerEvents: 'none',
                }}
              />

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
                      <div className={`text-[9px] font-barlow font-bold uppercase tracking-widest mt-1 px-3 py-1.5 rounded-lg border-2 w-fit ${diffColor}`}>
                        <span className="mr-1">{getDifficultyBadgeIcon(mode.difficulty)}</span>
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
