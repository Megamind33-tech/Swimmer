import React, { useState } from 'react';
import { useIsLandscapeMobile } from '../../hooks/useIsLandscapeMobile';
import { PaneSwitcher } from '../../ui/PaneSwitcher';
import { GameIcon } from '../../ui/GameIcon';
import { swim26Color, swim26Space, swim26Layout } from '../../theme/swim26DesignSystem';
import careerMainCardBackdropImage from '../../designs/custom_backgrounds/1UtKXnTbZwj4daOsDHH1HLUgmCfvf81V9.jpg';
import { HeroBackgroundMedia } from '../ui/MediaPrimitives';

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
  const isLandscapeMobile = useIsLandscapeMobile();
  const [activePaneId, setActivePaneId] = useState('JOURNEY');
  const [expandedTier, setExpandedTier] = useState<number>(2);

  const completedTiers = 1;
  const currentTier = 2;
  const totalTiers = 5;
  const progressPercent = ((completedTiers + 0.5) / totalTiers) * 100;

  const renderJourneyPane = () => (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full scrollbar-hide pb-24">
      {/* Main Career Card */}
      <div className="relative rounded-[24px] overflow-hidden border border-primary/25 min-h-[220px] p-8 flex items-end">
        <HeroBackgroundMedia src={careerMainCardBackdropImage} alt="Career spotlight" className="absolute inset-0 opacity-80" focalPoint="50% 35%" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/85 via-surface/45 to-surface/15" />
        <div className="relative z-10 max-w-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Main Career Card</p>
          <h2 className="font-headline text-3xl max-[900px]:text-xl font-black italic slanted uppercase text-on-surface text-glow mb-2">Road To World Championships</h2>
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface">Follow your national path, complete objectives, and unlock elite contracts.</p>
        </div>
      </div>

      {/* Season Timeline */}
      <div className="glass-panel p-6 rounded-2xl border-white/5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="font-headline text-lg font-black italic slanted uppercase text-primary text-glow">Season Timeline</h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Season 07</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
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

      {/* Tier Challenges */}
      <div className="space-y-4">
        <h2 className="font-headline text-xl font-black italic slanted uppercase text-on-surface ml-2">Tier Challenges</h2>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1">
          {CareerTiers.map((tier) => (
            <button
              key={tier.tier}
              onClick={() => setExpandedTier(expandedTier === tier.tier ? -1 : tier.tier)}
              className={`relative shrink-0 px-4 py-3 rounded-xl border font-headline font-black italic slanted uppercase text-[10px] tracking-widest transition-all duration-300 ${
                expandedTier === tier.tier 
                ? 'bg-primary/20 border-primary/50 text-primary' 
                : 'bg-white/5 border-white/5 text-on-surface-variant'
              } game-tap-feedback`}
            >
              T0{tier.tier}
            </button>
          ))}
        </div>
        <div className="grid gap-3">
          {CareerEvents.filter(e => e.tier === expandedTier).map(event => (
            <button
              key={event.id}
              onClick={() => onEventSelect?.(event.id)}
              className={`relative w-full p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group/event ${
                event.status === 'CURRENT' ? 'bg-primary/10 border-primary/40' : 'bg-white/5 border-white/5'
              } game-tap-feedback`}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center border bg-white/5 border-white/5">
                  <span className="text-primary">{event.status === 'CURRENT' ? '▶' : '✓'}</span>
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-on-surface block leading-none mb-1">{event.name}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{event.distance} • Difficulty {event.difficulty}/10</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDossierPane = () => (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full scrollbar-hide pb-24">
      {/* Circuit Status (Progress) */}
      <div className="glass-panel p-8 rounded-2xl border-white/5 overflow-hidden relative">
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-end gap-3">
            <h2 className="font-headline text-3xl font-black italic slanted uppercase text-on-surface text-glow leading-none">Circuit Status</h2>
            <span className="text-primary font-headline font-bold italic slanted text-lg pb-1">TIER {currentTier} OF {totalTiers}</span>
          </div>
          <div className="relative h-4 w-full bg-white/5 rounded-full border border-white/5 overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {CareerTiers.map((tier) => (
              <div key={tier.tier} className={`p-4 rounded-xl border ${tier.tier <= currentTier ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5 opacity-40'}`}>
                <span className="text-[8px] font-black uppercase tracking-widest text-primary mb-1 block">Tier 0{tier.tier}</span>
                <span className="text-[10px] font-bold text-on-surface line-clamp-1">{tier.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Athlete Milestones */}
      <div className="glass-panel p-8 rounded-2xl border-white/5 overflow-hidden relative">
        <h2 className="font-headline text-xl font-black italic slanted uppercase text-primary mb-8 text-glow">Athlete Milestones</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {Milestones.map((milestone) => (
            <div key={milestone.id} className={`p-6 rounded-2xl text-center border transition-all backdrop-blur-md ${milestone.achieved ? 'bg-secondary/10 border-secondary/30' : 'bg-white/5 border-white/5 opacity-40'}`}>
              <div className="text-5xl mb-4">{milestone.icon}</div>
              <div className="text-xs font-black uppercase tracking-widest text-on-surface mb-2">{milestone.name}</div>
              <div className={`text-[8px] font-black uppercase tracking-widest ${milestone.achieved ? 'text-secondary' : 'text-on-surface-variant'}`}>{milestone.achieved ? 'Unlocked' : 'Locked'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPartnersPane = () => (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full scrollbar-hide pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sponsors & Partners Panel */}
        <div className="glass-panel p-6 rounded-2xl border-white/5 relative overflow-hidden">
          <h2 className="font-headline text-xl font-black italic slanted uppercase text-primary mb-6 text-glow">Partnerships & Deals</h2>
          <div className="grid gap-4">
            {SponsorshipDeals.map((deal) => (
              <div key={deal.brand} className="relative p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all game-tap-feedback">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-on-surface">{deal.brand}</span>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded border ${deal.status === 'Active' ? 'border-primary/40 text-primary bg-primary/10' : 'border-white/10 text-on-surface-variant bg-white/5'}`}>{deal.status}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-primary font-headline font-bold italic slanted text-glow leading-none">{deal.value}</div>
                  <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">{deal.term}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coaching Panel */}
        <div className="glass-panel p-6 rounded-2xl border-white/5">
          <h2 className="font-headline text-xl font-black italic slanted uppercase text-primary mb-6 text-glow">The Coaching Unit</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {TeamContext.map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-1 block">{item.label}</span>
                <span className="text-sm font-bold text-on-surface line-clamp-1">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-primary mb-3">Unit Feedback</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed italic">"Mechanics looking solid. Focus on butterfly drag reduction in the next cycle."</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`hydro-page-shell flex-1 relative w-full h-full font-body ${isLandscapeMobile ? 'overflow-hidden' : 'overflow-y-auto'}`}
      style={{
        background: `radial-gradient(circle at 20% 10%, rgba(74, 201, 214, 0.05), transparent 25%),
          linear-gradient(180deg, #060E14 0%, ${swim26Color.bg.app} 100%)`,
      }}
    >
      <PaneSwitcher
        activePaneId={activePaneId}
        onPaneChange={setActivePaneId}
        panes={[
          {
            id: 'JOURNEY',
            label: 'Journey',
            icon: <GameIcon name="map" size={18} />,
            content: renderJourneyPane(),
          },
          {
            id: 'DOSSIER',
            label: 'Dossier',
            icon: <GameIcon name="person" size={18} />,
            content: renderDossierPane(),
          },
          {
            id: 'PARTNERS',
            label: 'Partners',
            icon: <GameIcon name="groups" size={18} />,
            content: renderPartnersPane(),
          },
        ]}
      >
        <div className="flex flex-col h-full">
          {/* Condensed Page Header */}
          <header 
            className="shrink-0 px-8 flex items-center justify-between border-b border-white/5 backdrop-blur-xl"
            style={{ 
              height: isLandscapeMobile ? '44px' : '72px',
              paddingTop: isLandscapeMobile ? 0 : swim26Layout.safe.top,
              background: 'rgba(6, 14, 20, 0.80)',
            }}
          >
            <div>
              <h1 className="font-headline text-3xl max-[900px]:text-lg font-black italic slanted uppercase text-white leading-none">Career Journey</h1>
              {!isLandscapeMobile && <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mt-1">Athlete Progression Floor</p>}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto pb-32">
            {activePaneId === 'JOURNEY' && renderJourneyPane()}
            {activePaneId === 'DOSSIER' && renderDossierPane()}
            {activePaneId === 'PARTNERS' && renderPartnersPane()}
          </div>
        </div>
      </PaneSwitcher>
    </div>
  );
};

export default CareerScreen;
