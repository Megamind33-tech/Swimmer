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
    <div className="flex-1 relative w-full h-full overflow-y-auto flex flex-col font-body">
      {/* Cinematic Header */}
      <div className="p-8 max-[900px]:p-5 bg-gradient-to-b from-primary/10 to-transparent border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[1px] w-12 bg-primary/40" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Athlete Dossier</span>
            <span className="h-[1px] w-12 bg-primary/40" />
          </div>
          
          <h1 className="font-headline text-5xl max-[900px]:text-3xl font-black italic slanted uppercase text-on-surface text-glow mb-2">
            Career Journey
          </h1>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">analytics</span>
            Track your ascension through the world rankings
          </p>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-8 pb-12">
        {/* Career Management Hub */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Sponsors & Partners Panel */}
          <div className="glass-panel p-6 rounded-2xl group border-white/5 hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-primary">handshake</span>
            </div>
            
            <h2 className="font-headline text-xl font-black italic slanted uppercase text-primary mb-6 text-glow">
              Partnerships & Deals
            </h2>
            
            <div className="grid gap-4">
              {SponsorshipDeals.map((deal) => (
                <div key={deal.brand} className="relative p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group/item">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-on-surface group-hover/item:text-primary transition-colors">{deal.brand}</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                      deal.status === 'Active' ? 'border-primary/40 text-primary bg-primary/10' : 'border-white/10 text-on-surface-variant bg-white/5'
                    }`}>
                      {deal.status}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-primary font-headline font-bold italic slanted text-glow leading-none">
                      {deal.value}
                    </div>
                    <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">
                      {deal.term}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coaching & Fixtures Panel */}
          <div className="glass-panel p-6 rounded-2xl group border-white/5 hover:border-primary/30 transition-all duration-500">
            <h2 className="font-headline text-xl font-black italic slanted uppercase text-primary mb-6 text-glow">
              The Coaching Unit
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {TeamContext.map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-1 block">{item.label}</span>
                    <span className="text-sm font-bold text-on-surface line-clamp-1">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 relative overflow-hidden group/coach">
                <div className="relative z-10">
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-primary mb-3">Priority Objectives</h3>
                  <div className="space-y-3">
                    {UpcomingGames.map((game) => (
                      <button 
                        key={game.id} 
                        onClick={() => onEventSelect?.(game.id)}
                        className="w-full flex items-center justify-between group/row"
                      >
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-bold text-on-surface group-hover/row:text-primary transition-colors">{game.name}</span>
                          <span className="text-[9px] font-bold text-on-surface-variant">{game.mode}</span>
                        </div>
                        <span className="material-symbols-outlined text-primary opacity-0 group-hover/row:opacity-100 transition-all translate-x-2 group-hover/row:translate-x-0">
                          chevron_right
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Career Calendar / Season Timeline */}
        <div className="glass-panel p-6 rounded-2xl group border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden relative">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h2 className="font-headline text-xl font-black italic slanted uppercase text-primary text-glow">
              Season Timeline
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">Season 07</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 relative z-10">
            {SeasonCalendar.map((item) => (
              <div key={item.week} className="relative p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group/item">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant font-bold">{item.week}</span>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                    item.state === 'Current' ? 'border-primary/40 text-primary bg-primary/10' : 'border-white/10 text-on-surface-variant bg-white/5'
                  }`}>
                    {item.state}
                  </span>
                </div>
                <div className="text-sm font-bold text-on-surface group-hover/item:text-primary transition-colors mb-1">{item.event}</div>
                <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{item.stage}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Progress */}
        <div className="glass-panel p-8 rounded-2xl group border-white/5 hover:border-primary/20 transition-all duration-500 overflow-hidden relative">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-end gap-3 mb-4">
                <h2 className="font-headline text-4xl font-black italic slanted uppercase text-on-surface text-glow leading-none">
                  Circuit Status
                </h2>
                <span className="text-primary font-headline font-bold italic slanted text-lg pb-1">TIER {currentTier} OF {totalTiers}</span>
              </div>
              
              <div className="relative h-4 w-full bg-white/5 rounded-full border border-white/5 overflow-hidden">
                <div 
                  className="h-full bg-primary shadow-[0_0_20px_rgba(129,236,255,0.6)] transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {CareerTiers.map((tier) => (
                <div key={tier.tier} className={`p-3 rounded-xl border transition-all duration-300 ${
                  tier.tier <= currentTier ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5 opacity-40'
                }`}>
                  <span className="text-[8px] font-black uppercase tracking-widest text-primary mb-1 block">Tier 0{tier.tier}</span>
                  <span className="text-[10px] font-bold text-on-surface line-clamp-1">{tier.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Career Ladder */}
        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface mb-6 ml-2">
            Tier Challenges
          </h2>
          
          {CareerTiers.map((tier, idx) => {
            const isExpanded = expandedTier === tier.tier;
            const isCompleted = idx < completedTiers;
            const isCurrent = tier.tier === currentTier;

            return (
              <div
                key={tier.tier}
                className={`rounded-2xl border transition-all duration-500 overflow-hidden ${
                  isExpanded 
                    ? 'glass-panel border-primary/40 bg-primary/5 shadow-2xl' 
                    : 'glass-panel border-white/5 hover:border-white/10'
                }`}
              >
                {/* Tier Header */}
                <button
                  onClick={() => setExpandedTier(isExpanded ? -1 : tier.tier)}
                  className={`w-full px-6 py-5 flex items-center justify-between transition-all group/tier ${
                    isExpanded ? 'bg-primary/5' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all duration-500 ${
                      isExpanded ? 'bg-primary/20 border-primary/40' : 'bg-surface-high border-white/5'
                    }`}>
                      <span className={`material-symbols-outlined text-2xl ${
                        isCompleted ? 'text-secondary gold-glow' : isCurrent ? 'text-primary' : 'text-on-surface-variant'
                      }`}>
                        {isCompleted ? 'stars' : isCurrent ? 'swimming' : 'lock'}
                      </span>
                    </div>
                    
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Tier 0{tier.tier}</span>
                        {isCompleted && <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-secondary/40 text-secondary bg-secondary/10">Mastered</span>}
                      </div>
                      <h3 className="font-headline text-xl font-black italic slanted uppercase text-on-surface group-hover/tier:text-glow transition-all">
                        {tier.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block mb-0.5">Progression</span>
                      <span className="text-xs font-bold text-on-surface">5/10 Events</span>
                    </div>
                    <span className={`material-symbols-outlined transition-transform duration-500 text-primary ${isExpanded ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </button>

                {/* Events List */}
                <div 
                  className={`transition-all duration-500 ease-in-out ${
                    isExpanded ? 'max-h-[1000px] opacity-100 p-6' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="grid gap-3">
                    {CareerEvents.filter((e) => e.tier === tier.tier).map((event) => (
                      <button
                        key={event.id}
                        onClick={() => onEventSelect?.(event.id)}
                        className={`relative w-full p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group/event ${
                          event.status === 'CURRENT'
                            ? 'bg-primary/10 border-primary/40'
                            : event.status === 'COMPLETED'
                            ? 'bg-secondary/10 border-secondary/20 opacity-80'
                            : 'bg-white/5 border-white/5 opacity-40 grayscale pointer-events-none'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center border transition-all ${
                            event.status === 'CURRENT' ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/5'
                          }`}>
                            <span className="material-symbols-outlined text-xl">
                              {event.status === 'CURRENT' ? 'play_arrow' : event.status === 'COMPLETED' ? 'check' : 'lock'}
                            </span>
                          </div>
                          
                          <div className="text-left">
                            <span className="text-sm font-bold text-on-surface group-hover/event:text-primary transition-colors block leading-none mb-1">
                              {event.name}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
                              {event.distance} • Difficulty {event.difficulty}/10
                            </span>
                          </div>
                        </div>

                        {event.reward && (
                          <div className="flex items-center gap-4 text-right">
                            <div className="hidden sm:flex flex-col items-end">
                              <span className="text-[8px] font-black uppercase text-on-surface-variant">Reward Pool</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-secondary uppercase italic slanted gold-glow">{event.reward.coins} Coins</span>
                                <span className="text-[10px] font-black text-primary uppercase italic slanted text-glow">{event.reward.xp} XP</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {event.status === 'CURRENT' && (
                          <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-xl" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestones */}
        <div className="glass-panel p-8 rounded-2xl group border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden relative">
          <h2 className="font-headline text-xl font-black italic slanted uppercase text-primary mb-8 text-glow">
            Athlete Milestones
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {Milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-6 rounded-2xl text-center border transition-all duration-500 backdrop-blur-md group/stone ${
                  milestone.achieved
                    ? 'bg-secondary/10 border-secondary/30 shadow-lg shadow-secondary/10 hover:border-secondary/60'
                    : 'bg-white/5 border-white/5 opacity-40 grayscale hover:opacity-60 hover:grayscale-0'
                }`}
              >
                <div className="text-5xl mb-4 group-hover/stone:scale-110 transition-transform duration-500">{milestone.icon}</div>
                <div className="text-xs font-black uppercase tracking-widest text-on-surface mb-2">{milestone.name}</div>
                {milestone.achieved ? (
                  <div className="text-[8px] font-black uppercase tracking-widest text-secondary gold-glow">Unlocked</div>
                ) : (
                  <div className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant">Locked</div>
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
