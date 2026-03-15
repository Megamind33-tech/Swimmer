/**
 * Career Screen - Athlete journey and progression
 * Career ladder, current event, coach notes, media attention, milestones
 */

import React, { useState } from 'react';

interface CareerEvent {
  id: string;
  index: number;
  tier: number;
  name: string;
  distance: string;
  difficulty: number;
  status: 'COMPLETED' | 'CURRENT' | 'LOCKED';
  reward?: { xp: number; coins: number };
}

interface CareerScreenProps {
  onEventSelect?: (eventId: string) => void;
}

const CareerTiers = [
  { tier: 1, name: 'School Meets', color: 'from-blue-400 to-cyan-400', events: 5 },
  { tier: 2, name: 'Junior Championships', color: 'from-cyan-400 to-green-400', events: 8 },
  { tier: 3, name: 'National Qualifiers', color: 'from-yellow-400 to-orange-400', events: 10 },
  { tier: 4, name: 'National Championships', color: 'from-orange-400 to-red-400', events: 12 },
  { tier: 5, name: 'World Championships', color: 'from-purple-400 to-pink-400', events: 15 },
];

const CareerEvents: CareerEvent[] = [
  { id: '1', index: 1, tier: 1, name: '50M Freestyle Local', distance: '50m', difficulty: 1, status: 'COMPLETED', reward: { xp: 100, coins: 500 } },
  { id: '2', index: 2, tier: 1, name: '100M Freestyle Regional', distance: '100m', difficulty: 2, status: 'COMPLETED', reward: { xp: 150, coins: 750 } },
  { id: '3', index: 3, tier: 2, name: 'Butterfly Sprint', distance: '100m', difficulty: 3, status: 'COMPLETED', reward: { xp: 200, coins: 1000 } },
  { id: '4', index: 4, tier: 2, name: 'Medley Challenge', distance: '200m', difficulty: 4, status: 'CURRENT', reward: { xp: 250, coins: 1500 } },
  { id: '5', index: 5, tier: 3, name: 'National Trials - Heats', distance: '100m', difficulty: 5, status: 'LOCKED' },
  { id: '6', index: 6, tier: 3, name: 'National Trials - Finals', distance: '100m', difficulty: 6, status: 'LOCKED' },
  { id: '7', index: 7, tier: 4, name: 'Continental Cup', distance: '200m', difficulty: 7, status: 'LOCKED' },
  { id: '8', index: 8, tier: 5, name: 'World Championship Final', distance: '200m', difficulty: 9, status: 'LOCKED' },
];

const Milestones = [
  { id: 1, name: 'First Medal', icon: '🏅', achieved: true },
  { id: 2, name: 'First Sponsorship', icon: '💰', achieved: true },
  { id: 3, name: 'Win vs Rival', icon: '⚔️', achieved: false },
  { id: 4, name: 'National Title', icon: '👑', achieved: false },
  { id: 5, name: 'World Record', icon: '🌍', achieved: false },
];

export const CareerScreen: React.FC<CareerScreenProps> = ({ onEventSelect }) => {
  const [expandedTier, setExpandedTier] = useState<number>(2);

  const completedTiers = 1;
  const currentTier = 2;
  const totalTiers = 5;
  const progressPercent = ((completedTiers + 0.5) / totalTiers) * 100;

  return (
    <div className="w-full h-full overflow-y-auto p-8 space-y-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Career Journey</h1>
          <p className="text-slate-400">Your path to becoming a championship swimmer</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-6 border border-slate-600/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Career Progression</span>
              <span className="text-sm text-cyan-400 font-bold">{currentTier}/{totalTiers}</span>
            </div>
            <div className="w-full bg-slate-600/50 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-5 gap-2 text-xs text-slate-400 mt-2">
              {CareerTiers.map((tier) => (
                <div key={tier.tier} className="text-center">
                  <div className="text-xs font-bold">{tier.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Career Ladder */}
        <div className="space-y-4">
          {CareerTiers.map((tier, idx) => (
            <div
              key={tier.tier}
              className={`rounded-lg border transition-all ${
                expandedTier === tier.tier
                  ? 'border-cyan-500/50 bg-slate-700/50'
                  : 'border-slate-600/30 bg-slate-800/30 hover:bg-slate-800/50'
              }`}
            >
              {/* Tier Header */}
              <button
                onClick={() => setExpandedTier(expandedTier === tier.tier ? -1 : tier.tier)}
                className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${
                  expandedTier === tier.tier ? 'bg-slate-700/50' : 'hover:bg-slate-700/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${tier.color}`}></div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Tier {tier.tier}: {tier.name}</h3>
                    <p className="text-sm text-slate-400">{tier.events} Events</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {idx <= completedTiers && (
                    <span className="text-lg">✓</span>
                  )}
                  <svg
                    className={`w-6 h-6 text-slate-400 transition-transform ${
                      expandedTier === tier.tier ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </button>

              {/* Events List (Expanded) */}
              {expandedTier === tier.tier && (
                <div className="border-t border-slate-600/30 p-6 space-y-2">
                  {CareerEvents.filter((e) => e.tier === tier.tier).map((event) => (
                    <button
                      key={event.id}
                      onClick={() => onEventSelect?.(event.id)}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-all border ${
                        event.status === 'CURRENT'
                          ? 'bg-cyan-500/20 border-cyan-500/50 hover:bg-cyan-500/30'
                          : event.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-slate-600/20 border-slate-600/30 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white">
                            {event.status === 'CURRENT' && '▶ '}
                            {event.status === 'COMPLETED' && '✓ '}
                            {event.status === 'LOCKED' && '🔒 '}
                            {event.name}
                          </div>
                          <div className="text-xs text-slate-400">{event.distance} • Difficulty: {event.difficulty}/10</div>
                        </div>
                        {event.reward && (
                          <div className="text-right">
                            <div className="text-xs text-emerald-400">{event.reward.xp} XP</div>
                            <div className="text-xs text-yellow-400">{event.reward.coins} Coins</div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/30">
          <h2 className="text-2xl font-black text-white mb-6">Milestones</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-4 rounded-lg text-center border transition-all ${
                  milestone.achieved
                    ? 'bg-purple-500/30 border-purple-500/50'
                    : 'bg-slate-600/20 border-slate-600/30 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{milestone.icon}</div>
                <div className="text-sm font-bold text-white">{milestone.name}</div>
                {milestone.achieved && (
                  <div className="text-xs text-purple-300 mt-2">Achieved</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerScreen;
