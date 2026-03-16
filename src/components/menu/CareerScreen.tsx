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
    <div className="w-full h-full overflow-y-auto p-8 max-[1024px]:p-5 space-y-6 max-[1024px]:space-y-4 relative safe-zone-x">
      <div className="max-w-5xl mx-auto space-y-6 max-[1024px]:space-y-4 max-[1024px]:max-w-[68vw] max-[1024px]:mx-auto">
        {/* Header */}
        <div className="animate-slide-in-down bg-gradient-to-r from-broadcast-overlay via-neon-cyan/5 to-broadcast-overlay p-6 rounded-2xl border border-neon-cyan/20">
          <h1 className="text-5xl max-[1024px]:text-3xl font-din font-black text-white mb-2 drop-shadow-[0_0_12px_rgba(0,255,255,0.3)]">
            Career Journey
          </h1>
          <p className="text-white/80 text-lg max-[1024px]:text-sm font-barlow font-bold">
            Your path to becoming a championship swimmer
          </p>
        </div>


        {/* Career Management Hub */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="glass-card-elevated rounded-2xl p-6 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 group skew-container">
            <h2 className="text-2xl font-din font-black text-neon-cyan mb-4 drop-shadow-[0_0_12px_rgba(0,255,255,0.4)]">
              Sponsors & Partners
            </h2>
            <div className="space-y-3">
              {SponsorshipDeals.map((deal) => (
                <div key={deal.brand} className="bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl p-3 hover:border-neon-cyan/50 transition-all duration-300">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="font-bold font-barlow text-white">{deal.brand}</div>
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-black uppercase ${
                      deal.status === 'Active' ? 'bg-green-400/30 text-green-300 border border-green-400/40' : deal.status === 'Incoming' ? 'bg-blue-400/30 text-blue-300 border border-blue-400/40' : 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                    }`}>{deal.status}</span>
                  </div>
                  <div className="text-xs font-barlow font-bold text-neon-cyan drop-shadow-[0_0_4px_rgba(0,255,255,0.4)]">{deal.value}</div>
                  <div className="text-[11px] mt-1 text-white/70">{deal.term}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-neon-cyan/20 pt-4">
              {Partners.map((partner) => (
                <div key={partner.name} className="bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl px-3 py-2 text-xs hover:border-neon-cyan/40 transition-all">
                  <div className="font-bold font-barlow text-white">{partner.name}</div>
                  <div className="text-neon-cyan/80 text-[10px] mt-1">{partner.role}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card-elevated rounded-2xl p-6 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 group skew-container space-y-4">
            <h2 className="text-2xl font-din font-black text-neon-cyan drop-shadow-[0_0_12px_rgba(0,255,255,0.4)]">
              Club, Coaches & Fixtures
            </h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {TeamContext.map((item) => (
                <div key={item.label} className="bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg px-3 py-2 hover:border-neon-cyan/40 transition-all">
                  <span className="text-white/70 font-barlow text-[10px]">{item.label}</span>
                  <div className="font-bold text-white mt-1 text-sm">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-neon-cyan/20 pt-4">
              <h3 className="text-sm font-barlow font-black uppercase tracking-wider text-neon-cyan mb-3 drop-shadow-[0_0_4px_rgba(0,255,255,0.4)]">
                Coaching Team
              </h3>
              <div className="space-y-2">
                {CoachingUnit.map((coach) => (
                  <div key={coach.name} className="bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg px-3 py-2 text-xs hover:border-neon-cyan/40 transition-all">
                    <div className="font-bold font-barlow text-white">{coach.name} <span className="text-neon-cyan/80">• {coach.level}</span></div>
                    <div className="text-white/75 text-[10px] mt-1">{coach.focus}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-neon-cyan/20 pt-4">
              <h3 className="text-sm font-barlow font-black uppercase tracking-wider text-neon-cyan mb-3 drop-shadow-[0_0_4px_rgba(0,255,255,0.4)]">
                Games to Take Part In
              </h3>
              <div className="space-y-2">
                {UpcomingGames.map((game) => (
                  <button key={game.id} onClick={() => onEventSelect?.(game.id)} className="w-full text-left bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg px-3 py-2 hover:border-neon-cyan/50 transition-all active:animate-squash-stretch">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold font-barlow text-white">{game.name}</span>
                      <span className="text-[10px] px-2 py-1 rounded-lg bg-neon-cyan/20 text-neon-cyan font-black uppercase border border-neon-cyan/30">{game.status}</span>
                    </div>
                    <div className="text-xs text-white/70 mt-1">{game.mode}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Career Calendar / Season Timeline */}
        <div className="glass-card-elevated rounded-2xl p-6 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 skew-container">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-din font-black text-neon-cyan drop-shadow-[0_0_12px_rgba(0,255,255,0.4)]">
              Career Calendar
            </h2>
            <span className="text-xs px-3 py-1 rounded-full bg-neon-cyan/20 text-neon-cyan font-black uppercase border border-neon-cyan/30">Season 1</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
            {SeasonCalendar.map((item) => (
              <div key={item.week} className="bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg p-3 hover:border-neon-cyan/50 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black uppercase text-neon-cyan/80 font-barlow">{item.week}</span>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase ${
                    item.state === 'Current'
                      ? 'bg-neon-cyan/30 text-neon-cyan border border-neon-cyan/40'
                      : item.state === 'Completed'
                      ? 'bg-green-400/20 text-green-300 border border-green-400/40'
                      : item.state === 'Upcoming'
                      ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40'
                      : 'bg-white/10 text-white/70 border border-white/10'
                  }`}>{item.state}</span>
                </div>
                <div className="text-sm font-bold font-barlow text-white">{item.event}</div>
                <div className="text-xs text-white/70 mt-1 font-barlow">{item.stage}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Progress */}
        <div className="glass-card-elevated rounded-2xl p-8 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 skew-container">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold font-barlow text-white text-lg">Career Progression</span>
              <span className="text-sm text-neon-cyan font-bold bg-neon-cyan/20 px-3 py-1 rounded-full border border-neon-cyan/30 drop-shadow-[0_0_4px_rgba(0,255,255,0.4)]">{currentTier}/{totalTiers}</span>
            </div>
            <div className="w-full bg-neon-cyan/10 rounded-full h-4 overflow-hidden border border-neon-cyan/30">
              <div
                className="bg-gradient-to-r from-neon-cyan via-cyan-400 to-neon-cyan h-4 rounded-full transition-all duration-500 shadow-lg shadow-neon-cyan/50"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-5 gap-2 text-xs mt-4">
              {CareerTiers.map((tier) => (
                <div key={tier.tier} className="text-center p-2 bg-neon-cyan/5 rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all">
                  <div className="text-xs font-bold font-barlow text-white">{tier.name}</div>
                  <div className="text-neon-cyan text-xs font-barlow">{tier.events} Events</div>
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
              className={`rounded-2xl border transition-all ${
                expandedTier === tier.tier
                  ? 'glass-card-elevated border-neon-cyan/60 hover:border-neon-cyan/80 shadow-lg shadow-neon-cyan/20'
                  : 'glass-card-elevated border-neon-cyan/30 hover:border-neon-cyan/50 hover:shadow-md hover:shadow-neon-cyan/10'
              }`}
            >
              {/* Tier Header */}
              <button
                onClick={() => setExpandedTier(expandedTier === tier.tier ? -1 : tier.tier)}
                className={`w-full px-6 max-[1024px]:px-2 py-4 flex items-center justify-between text-left transition-all gap-2 ${
                  expandedTier === tier.tier ? 'bg-neon-cyan/10' : 'hover:bg-neon-cyan/5'
                }`}
              >
                <div className="flex items-center gap-4 max-[1024px]:gap-2">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${tier.color} border-2 border-neon-cyan/50 shadow-lg shadow-neon-cyan/20`}></div>
                  <div>
                    <h3 className="font-bold font-barlow text-white text-lg max-[1024px]:text-base">Tier {tier.tier}: {tier.name}</h3>
                    <p className="text-sm text-neon-cyan/70 font-barlow">{tier.events} Events</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 max-[1024px]:gap-2">
                  {idx <= completedTiers && (
                    <span className="text-lg text-green-400 bg-green-400/20 px-3 py-1 rounded-full border border-green-400/40 font-bold">✓</span>
                  )}
                  <svg
                    className={`w-6 h-6 text-neon-cyan transition-transform ${
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
                <div className="border-t border-neon-cyan/20 p-6 max-[1024px]:p-3 space-y-3 bg-neon-cyan/5">
                  {CareerEvents.filter((e) => e.tier === tier.tier).map((event) => (
                    <button
                      key={event.id}
                      onClick={() => onEventSelect?.(event.id)}
                      className={`w-full px-4 max-[1024px]:px-2 py-4 rounded-lg text-left transition-all border backdrop-blur-sm active:animate-squash-stretch ${
                        event.status === 'CURRENT'
                          ? 'bg-neon-cyan/20 border-neon-cyan/50 hover:bg-neon-cyan/30 hover:shadow-lg hover:shadow-neon-cyan/20'
                          : event.status === 'COMPLETED'
                          ? 'bg-green-400/15 border-green-400/40 hover:bg-green-400/25'
                          : 'bg-white/5 border-white/10 opacity-50 hover:opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold font-barlow text-white text-lg">
                            {event.status === 'CURRENT' && '▶ '}
                            {event.status === 'COMPLETED' && '✓ '}
                            {event.status === 'LOCKED' && '🔒 '}
                            {event.name}
                          </div>
                          <div className="text-xs text-white/70 font-barlow">{event.distance} • Difficulty: {event.difficulty}/10</div>
                        </div>
                        {event.reward && (
                          <div className="text-right">
                            <div className="text-xs text-yellow-400 font-bold font-barlow">{event.reward.xp} XP</div>
                            <div className="text-xs text-neon-cyan font-bold font-barlow drop-shadow-[0_0_4px_rgba(0,255,255,0.4)]">{event.reward.coins} Coins</div>
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
        <div className="glass-card-elevated rounded-2xl p-8 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 skew-container">
          <h2 className="text-3xl font-din font-black text-neon-cyan mb-8 drop-shadow-[0_0_12px_rgba(0,255,255,0.4)]">Milestones</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-6 rounded-2xl text-center border transition-all backdrop-blur-sm ${
                  milestone.achieved
                    ? 'bg-neon-cyan/20 border-neon-cyan/50 shadow-lg shadow-neon-cyan/20 hover:border-neon-cyan/70'
                    : 'bg-white/5 border-white/10 opacity-50 hover:opacity-70'
                }`}
              >
                <div className="text-4xl mb-3">{milestone.icon}</div>
                <div className="text-sm font-bold font-barlow text-white">{milestone.name}</div>
                {milestone.achieved && (
                  <div className="text-xs text-neon-cyan mt-3 font-bold font-barlow drop-shadow-[0_0_4px_rgba(0,255,255,0.4)]">✓ Achieved</div>
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
