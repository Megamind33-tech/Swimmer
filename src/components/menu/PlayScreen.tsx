/**
 * Play Screen - Game Mode Selection with Broadcast Aesthetic
 * Glassmorphic cards with neon accents, biome textures, and ripple effects
 */

import React, { useRef, useState } from 'react';
import { getDifficultyColor, getDifficultyBadgeIcon } from '../../utils/difficultyUtils';

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
  const [ignitedCard, setIgnitedCard] = useState<string | null>(null);

  const handleModeClick = (modeId: string) => {
    setIgnitedCard(modeId);
    setTimeout(() => {
      setIgnitedCard(null);
      onModeSelect?.(modeId);
    }, 400);
  };

  return (
    <div className="flex-1 relative w-full h-full overflow-y-auto flex flex-col font-body">
      {/* Cinematic Header */}
      <div className="p-8 max-[900px]:p-5 bg-gradient-to-b from-primary/10 to-transparent border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[1px] w-12 bg-primary/40" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Arena Selection</span>
            <span className="h-[1px] w-12 bg-primary/40" />
          </div>
          
          <h1 className="font-headline text-5xl max-[900px]:text-3xl font-black italic slanted uppercase text-on-surface text-glow mb-2">
            Game Modes
          </h1>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">explore</span>
            Select your discipline to begin the circuit
          </p>
        </div>
      </div>

      {/* Game Modes Grid */}
      <div className="flex-1 p-6 max-[900px]:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max overflow-y-auto pb-12">
        {GameModes.map((mode) => {
          const diffColor = getDifficultyColor(mode.difficulty);

          return (
            <button
              key={mode.id}
              onClick={() => handleModeClick(mode.id)}
              className={`group relative h-64 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-95 glass-card border-white/5 hover:border-primary/40 ${ignitedCard === mode.id ? 'animate-pulse ring-4 ring-primary/40' : ''}`}
            >
              {/* Card Background Layer */}
              <div className={`absolute inset-0 bg-surface-high/40 group-hover:bg-primary/5 transition-colors duration-500`} />
              
              {/* Biome Texture Logic replacement with stylized gradients */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                <div 
                  className="w-full h-full"
                  style={{
                    background: getIllustrationPattern(mode.id),
                    backgroundSize: '40px 40px',
                  }}
                />
              </div>

              {/* Speed lines */}
              <div className="absolute inset-0 speed-lines opacity-10 group-hover:opacity-30 pointer-events-none" />

              {/* Content Box */}
              <div className="relative h-full flex flex-col p-6 z-10">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-4">
                  <div className="h-14 w-14 rounded-xl bg-surface-highest/60 border border-white/5 group-hover:border-primary/30 flex items-center justify-center transition-all duration-500 shadow-lg shadow-black/20">
                    <span className="material-symbols-outlined text-3xl text-primary/80 group-hover:text-primary transition-colors text-glow">
                      {mode.icon}
                    </span>
                  </div>
                  
                  <div className={`px-2 py-1 rounded border ${diffColor} bg-black/20 backdrop-blur-sm`}>
                    <span className="text-[9px] font-black uppercase tracking-widest">{mode.difficulty}</span>
                  </div>
                </div>

                <div className="flex-1 text-left">
                  <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface mb-1 group-hover:text-glow transition-all">
                    {mode.name}
                  </h3>
                  <p className="text-xs font-bold text-on-surface-variant leading-relaxed max-w-[90%]">
                    {mode.description}
                  </p>
                </div>

                {/* Footer Stats - Broadcast Style */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-widest text-on-surface-variant font-bold mb-0.5">Potential Rewards</span>
                    <span className="text-[10px] font-black italic slanted text-primary text-glow uppercase">{mode.rewards}</span>
                  </div>
                  
                  {mode.playerCount && (
                    <div className="text-right">
                      <span className="text-[8px] uppercase tracking-widest text-on-surface-variant font-bold block mb-0.5">Active Swimmers</span>
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="w-1 h-1 rounded-full bg-primary animate-pulse shadow-[0_0_4px_rgba(129,236,255,1)]" />
                        <span className="text-[10px] font-bold text-on-surface font-mono-data">{mode.playerCount.split(' ')[0]}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Glow Ripple */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-1000 -z-10" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlayScreen;
