/**
 * Play Screen - Game mode selection hub
 * Large animated cards showing all playable modes
 */

import React from 'react';

interface GameModeCard {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  rewards: string;
  entryCost?: string;
  estimatedTime: string;
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
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    difficulty: 'NORMAL',
    rewards: '100 XP, 500 Coins',
    estimatedTime: '5-7 min',
    playerCount: '4.2K playing',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'career-race',
    name: 'Career Race',
    description: 'Continue your career progression',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    difficulty: 'HARD',
    rewards: '250 XP, 2000 Coins',
    estimatedTime: '8-10 min',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'ranked-match',
    name: 'Ranked Match',
    description: 'Competitive multiplayer battles',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    difficulty: 'HARD',
    rewards: '300 XP, 3000 Coins',
    estimatedTime: '8-12 min',
    playerCount: '12.5K playing',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'time-trial',
    name: 'Time Trial',
    description: 'Solo challenge for best times',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    difficulty: 'NORMAL',
    rewards: '150 XP, 1000 Coins',
    estimatedTime: '5-10 min',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'relay-mode',
    name: 'Relay Mode',
    description: 'Team-based swimming relay',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zM5 20a3 3 0 015.856-1.487M5 10a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    difficulty: 'HARD',
    rewards: '400 XP, 4000 Coins',
    estimatedTime: '10-15 min',
    playerCount: '8.3K playing',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'rival-match',
    name: 'Rival Match',
    description: 'Story rivalry with stakes',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    difficulty: 'HARD',
    rewards: '350 XP, 3500 Coins',
    estimatedTime: '8-12 min',
    color: 'from-rose-500 to-pink-500',
  },
  {
    id: 'ghost-challenge',
    name: 'Ghost Challenge',
    description: 'Race against saved runs',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M7 12a5 5 0 1110 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    difficulty: 'NORMAL',
    rewards: '200 XP, 1500 Coins',
    estimatedTime: '5-8 min',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'club-league',
    name: 'Club League',
    description: 'Contribute to club ranking',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    difficulty: 'NORMAL',
    rewards: '180 XP, 1200 Coins',
    estimatedTime: '6-9 min',
    playerCount: '6.1K playing',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    id: 'tournament',
    name: 'Tournament',
    description: 'Structured elimination event',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    difficulty: 'HARD',
    rewards: '500 XP, 5000 Coins',
    estimatedTime: '20-30 min',
    playerCount: '3.5K playing',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'open-water',
    name: 'Open Water',
    description: 'Special rule-set mode',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    difficulty: 'HARD',
    rewards: '400 XP, 4500 Coins',
    estimatedTime: '15-20 min',
    playerCount: '2.8K playing',
    color: 'from-teal-500 to-green-500',
  },
];

export const PlayScreen: React.FC<PlayScreenProps> = ({ onModeSelect }) => {
  return (
    <div className="w-full min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-2">Game Modes</h1>
        <p className="text-slate-400">Choose your next challenge</p>
      </div>

      {/* Game Mode Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {GameModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeSelect?.(mode.id)}
            className="group relative h-80 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-6">
              {/* Top Section: Icon & Title */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="text-white opacity-80 group-hover:opacity-100 transition-opacity">
                    {mode.icon}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      mode.difficulty === 'EASY'
                        ? 'bg-emerald-500/50 text-emerald-200'
                        : mode.difficulty === 'NORMAL'
                        ? 'bg-yellow-500/50 text-yellow-200'
                        : 'bg-red-500/50 text-red-200'
                    }`}
                  >
                    {mode.difficulty}
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-black text-white">{mode.name}</h3>
                  <p className="text-sm text-gray-200 mt-1">{mode.description}</p>
                </div>
              </div>

              {/* Bottom Section: Info & Stats */}
              <div className="space-y-3">
                {/* Entry Cost */}
                {mode.entryCost && (
                  <div className="flex items-center justify-between text-xs text-gray-200">
                    <span>Entry Cost:</span>
                    <span className="font-bold">{mode.entryCost}</span>
                  </div>
                )}

                {/* Estimated Time */}
                <div className="flex items-center justify-between text-xs text-gray-200">
                  <span>Duration:</span>
                  <span className="font-bold">{mode.estimatedTime}</span>
                </div>

                {/* Player Count */}
                {mode.playerCount && (
                  <div className="flex items-center justify-between text-xs text-gray-200">
                    <span>Players:</span>
                    <span className="font-bold text-cyan-300">{mode.playerCount}</span>
                  </div>
                )}

                {/* Rewards */}
                <div className="pt-3 border-t border-white/20">
                  <div className="text-xs text-gray-300 mb-1">Rewards</div>
                  <div className="text-sm font-bold text-white">{mode.rewards}</div>
                </div>
              </div>
            </div>

            {/* Hover Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayScreen;
