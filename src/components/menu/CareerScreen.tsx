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





const SponsorshipDeals = [
  { brand: 'AquaPulse', status: 'Active', value: '5,000 coins / week', term: 'Ends in 3 weeks' },
  { brand: 'BlueCurrent Energy', status: 'Incoming', value: '8,500 coins + 150 SP', term: 'Unlock at Tier 3' },
  { brand: 'ProLane Gear', status: 'Negotiation', value: '12,000 coins + suit bonus', term: 'Need 2 podium finishes' },
];

const Partners = [
  { name: 'National Swim Federation', role: 'National Team Pathway', state: 'Aligned' },
  { name: 'HydroLab Performance', role: 'Sports Science Partner', state: 'Active' },
  { name: 'WaveLens Media', role: 'Career Coverage', state: 'Prospecting' },
];

const CoachingUnit = [
  { name: 'Coach Banda', focus: 'Sprint Mechanics', level: 'Elite' },
  { name: 'Coach Ndlovu', focus: 'Turns & Underwater', level: 'Senior' },
  { name: 'Dr. Phiri', focus: 'Recovery & Conditioning', level: 'Performance' },
];

const TeamContext = [
  { label: 'Club', value: 'Lusaka Dolphins' },
  { label: 'Role', value: 'Lead Freestyle Swimmer' },
  { label: 'Nation', value: 'Zambia National Team' },
  { label: 'Season Objective', value: 'Qualify for World Championships' },
];


const SeasonCalendar = [
  { week: 'Week 2', event: 'Regional Meet', stage: 'Club Duty', state: 'Completed' },
  { week: 'Week 4', event: 'National Championship', stage: 'National Duty', state: 'Current' },
  { week: 'Week 8', event: 'World Qualifier', stage: 'National Duty', state: 'Upcoming' },
  { week: 'Week 10', event: 'Continental Cup', stage: 'Club + Nation', state: 'Locked' },
];

const UpcomingGames = [
  { id: 'up-1', name: 'Regional Meet - Week 2', mode: 'Club Duty', status: 'Next' },
  { id: 'up-2', name: 'National Championship - Week 4', mode: 'National Duty', status: 'Priority' },
  { id: 'up-3', name: 'World Qualifier - Week 8', mode: 'National Duty', status: 'Locked' },
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
    <div className="w-full h-full overflow-y-auto p-8 space-y-8 bg-surface relative">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-slide-in-down">
          <h1 className="text-5xl font-black text-primary mb-2 text-glow">Career Journey</h1>
          <p className="text-on-surface-variant text-lg">Your path to becoming a championship swimmer</p>
        </div>


        {/* Career Management Hub */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="glass-panel rounded-lg p-4 border border-secondary/35 kinetic-border shadow-lg shadow-secondary/10">
            <h2 className="text-2xl font-black text-secondary text-glow mb-3">Sponsors & Partners</h2>
            <div className="space-y-2">
              {SponsorshipDeals.map((deal) => (
                <div key={deal.brand} className="bg-surface-container/40 border border-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-on-background">{deal.brand}</div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase ${
                      deal.status === 'Active' ? 'bg-secondary/30 text-secondary' : deal.status === 'Incoming' ? 'bg-primary/30 text-primary-fixed' : 'bg-amber-500/25 text-amber-300'
                    }`}>{deal.status}</span>
                  </div>
                  <div className="text-xs mt-1 text-on-surface-variant">{deal.value}</div>
                  <div className="text-[11px] mt-1 text-white/70">{deal.term}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              {Partners.map((partner) => (
                <div key={partner.name} className="bg-surface-container/30 border border-white/10 rounded-lg px-3 py-2 text-xs">
                  <div className="font-bold text-white">{partner.name}</div>
                  <div className="text-white/70">{partner.role}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-lg p-4 border border-primary/30 kinetic-border shadow-lg shadow-primary/10 space-y-3">
            <h2 className="text-2xl font-black text-primary text-glow">Club, Coaches & Fixtures</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {TeamContext.map((item) => (
                <div key={item.label} className="bg-surface-container/40 border border-white/10 rounded-lg px-3 py-2">
                  <span className="text-white/70">{item.label}:</span> <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-secondary mb-2">Coaching Team</h3>
              <div className="space-y-2">
                {CoachingUnit.map((coach) => (
                  <div key={coach.name} className="bg-surface-container/40 border border-white/10 rounded-lg px-3 py-2 text-xs">
                    <div className="font-bold text-white">{coach.name} · <span className="text-secondary">{coach.level}</span></div>
                    <div className="text-white/75">{coach.focus}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-secondary mb-2">Games to Take Part In</h3>
              <div className="space-y-2">
                {UpcomingGames.map((game) => (
                  <button key={game.id} onClick={() => onEventSelect?.(game.id)} className="w-full text-left bg-surface-container/40 border border-white/10 rounded-lg px-3 py-2 hover:border-primary/40 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-white">{game.name}</span>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-primary/25 text-primary-fixed font-black uppercase">{game.status}</span>
                    </div>
                    <div className="text-xs text-white/70">{game.mode}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Career Calendar / Season Timeline */}
        <div className="glass-panel rounded-lg p-4 border border-primary/30 kinetic-border shadow-lg shadow-primary/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-black text-primary text-glow">Career Calendar</h2>
            <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary-fixed font-black uppercase">Season 1</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
            {SeasonCalendar.map((item) => (
              <div key={item.week} className="bg-surface-container/40 border border-white/10 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black uppercase text-secondary">{item.week}</span>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase ${
                    item.state === 'Current'
                      ? 'bg-primary/30 text-primary-fixed'
                      : item.state === 'Completed'
                      ? 'bg-secondary/30 text-secondary'
                      : item.state === 'Upcoming'
                      ? 'bg-amber-500/25 text-amber-300'
                      : 'bg-white/10 text-white/70'
                  }`}>{item.state}</span>
                </div>
                <div className="text-sm font-bold text-white">{item.event}</div>
                <div className="text-xs text-white/70 mt-1">{item.stage}</div>
              </div>
            ))}
          </div>
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
