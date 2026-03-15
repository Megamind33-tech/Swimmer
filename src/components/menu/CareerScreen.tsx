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
    <div className="w-full h-full overflow-y-auto p-8 space-y-8 bg-surface">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-slide-in-down">
          <h1 className="text-5xl font-black text-primary mb-2 text-glow">Career Journey</h1>
          <p className="text-on-surface-variant text-lg">Your path to becoming a championship swimmer</p>
        </div>

        {/* Overall Progress */}
        <div className="glass-panel rounded-full p-8 border border-primary/30 kinetic-border animate-slide-in-left shadow-lg shadow-primary/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-on-background text-lg">Career Progression</span>
              <span className="text-sm text-primary font-bold bg-primary/20 px-3 py-1 rounded-full">{currentTier}/{totalTiers}</span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-4 overflow-hidden border border-primary/20">
              <div
                className="bg-gradient-to-r from-primary via-secondary to-primary h-4 rounded-full transition-all duration-500 shadow-lg shadow-primary/50"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-5 gap-2 text-xs text-on-surface-variant mt-4">
              {CareerTiers.map((tier) => (
                <div key={tier.tier} className="text-center p-2 bg-surface-container/30 rounded-lg border border-outline/20">
                  <div className="text-xs font-bold">{tier.name}</div>
                  <div className="text-primary text-xs">{tier.events} Events</div>
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
                  ? 'glass-panel border-primary/60 kinetic-border shadow-lg shadow-primary/20'
                  : 'glass-panel border-outline/30 hover:border-primary/30 hover:shadow-md hover:shadow-primary/10'
              }`}
            >
              {/* Tier Header */}
              <button
                onClick={() => setExpandedTier(expandedTier === tier.tier ? -1 : tier.tier)}
                className={`w-full px-6 py-4 flex items-center justify-between text-left transition-all ${
                  expandedTier === tier.tier ? 'bg-primary/10' : 'hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${tier.color} border-2 border-primary/50 shadow-lg shadow-primary/20`}></div>
                  <div>
                    <h3 className="font-bold text-on-background text-lg">Tier {tier.tier}: {tier.name}</h3>
                    <p className="text-sm text-on-surface-variant">{tier.events} Events</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {idx <= completedTiers && (
                    <span className="text-lg text-secondary bg-secondary/20 px-3 py-1 rounded-full">✓</span>
                  )}
                  <svg
                    className={`w-6 h-6 text-primary transition-transform ${
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
                <div className="border-t border-outline/30 p-6 space-y-3 bg-surface-container/30">
                  {CareerEvents.filter((e) => e.tier === tier.tier).map((event) => (
                    <button
                      key={event.id}
                      onClick={() => onEventSelect?.(event.id)}
                      className={`w-full px-4 py-4 rounded-lg text-left transition-all border backdrop-blur-sm ${
                        event.status === 'CURRENT'
                          ? 'bg-primary/20 border-primary/50 hover:bg-primary/30 hover:shadow-lg hover:shadow-primary/20 kinetic-border'
                          : event.status === 'COMPLETED'
                          ? 'bg-secondary/15 border-secondary/40 hover:bg-secondary/25 kinetic-border'
                          : 'bg-surface-container/20 border-outline/20 opacity-50 hover:opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-on-background text-lg">
                            {event.status === 'CURRENT' && '▶ '}
                            {event.status === 'COMPLETED' && '✓ '}
                            {event.status === 'LOCKED' && '🔒 '}
                            {event.name}
                          </div>
                          <div className="text-xs text-on-surface-variant">{event.distance} • Difficulty: {event.difficulty}/10</div>
                        </div>
                        {event.reward && (
                          <div className="text-right">
                            <div className="text-xs text-secondary font-bold">{event.reward.xp} XP</div>
                            <div className="text-xs text-primary font-bold">{event.reward.coins} Coins</div>
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
        <div className="glass-panel rounded-lg p-8 border border-secondary/40 kinetic-border animate-slide-in-right shadow-lg shadow-secondary/10">
          <h2 className="text-3xl font-black text-secondary mb-8 text-glow">Milestones</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-6 rounded-lg text-center border transition-all backdrop-blur-sm ${
                  milestone.achieved
                    ? 'bg-secondary/20 border-secondary/50 shadow-lg shadow-secondary/20'
                    : 'bg-surface-container/20 border-outline/30 opacity-50'
                }`}
              >
                <div className="text-4xl mb-3">{milestone.icon}</div>
                <div className="text-sm font-bold text-on-background">{milestone.name}</div>
                {milestone.achieved && (
                  <div className="text-xs text-secondary mt-3 font-bold">✓ Achieved</div>
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
