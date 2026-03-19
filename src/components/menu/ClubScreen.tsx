/**
 * Club Screen - Dynasty builder
 * Club overview + management sub-pages accessed only within club section
 */

import React, { useMemo, useState } from 'react';
import { GameIcon } from '../../ui/GameIcon';
import miaPhiriAthleteImage from '../../designs/835_mia_phiri_news.png_1/screen.png';
import staffManagementReferenceImage from '../../designs/staff_management_mentors/screen.png';
import clubBackdropImage from '../../designs/custom_backgrounds/1UtKXnTbZwj4daOsDHH1HLUgmCfvf81V9.jpg';
import scoutingBackdropImage from '../../designs/custom_backgrounds/1dLNpgVzO02ceJe0YsHoa4tMHenXscN9M.jpg';
import athlete01Image from '../../designs/custom_models/athlete-01.png';
import athlete02Image from '../../designs/custom_models/athlete-02.png';
import athlete03Image from '../../designs/custom_models/athlete-03.png';
import athlete04Image from '../../designs/custom_models/athlete-04.png';
import athlete05Image from '../../designs/custom_models/athlete-05.png';
import athlete06Image from '../../designs/custom_models/athlete-06.png';
import athlete07Image from '../../designs/custom_models/athlete-07.png';
import athlete08Image from '../../designs/custom_models/athlete-08.png';
import athlete09Image from '../../designs/custom_models/athlete-09.png';
import athlete10Image from '../../designs/custom_models/athlete-10.png';
import athlete11Image from '../../designs/custom_models/athlete-11.png';
import { AthletePortraitMedia } from '../ui/MediaPrimitives';

type ClubTab = 'OVERVIEW' | 'FACILITIES' | 'ROSTER' | 'RELAY' | 'STAFF' | 'BRANDING';
type ClubSubPage =
  | 'START_PATH'
  | 'CLUB_SETUP'
  | 'TEAM_OPERATIONS'
  | 'CLUB_COMPETITIONS'
  | 'STAFF_MANAGEMENT'
  | 'PLAYER_MANAGEMENT'
  | 'SPONSORS'
  | 'UPCOMING_EVENTS'
  | 'LEAGUES_TOURNAMENTS'
  | 'SCOUTING'
  | 'FUNDING';

type ManagerMode = 'OWNER' | 'HIRED';

interface AthleteProfile {
  id: string;
  name: string;
  age: number;
  level: number;
  specialty: string;
  nationality: string;
  marketValue: string;
  weeklyWage: string;
  joinDate: string;
  image: string;
  portraitFocalPoint?: string;
  relayPosition?: number;
}

interface ClubScreenProps {
  clubName?: string;
  onLaunchArenaRace?: () => void;
}

const scoutingAthletes: AthleteProfile[] = [
  { id: 'athlete-01', name: 'Chipo Banda', age: 19, level: 86, specialty: 'Freestyle', nationality: 'Zambia', marketValue: '1,200,000', weeklyWage: '18,500', joinDate: 'Jun 03, 2026', image: athlete01Image, portraitFocalPoint: '50% 18%' },
  { id: 'athlete-02', name: 'Natasha Phiri', age: 20, level: 84, specialty: 'Butterfly', nationality: 'Zambia', marketValue: '1,050,000', weeklyWage: '16,400', joinDate: 'Jun 03, 2026', image: athlete02Image, portraitFocalPoint: '50% 18%' },
  { id: 'athlete-03', name: 'Amahle Dlamini', age: 18, level: 82, specialty: 'Backstroke', nationality: 'South Africa', marketValue: '980,000', weeklyWage: '14,900', joinDate: 'Jun 03, 2026', image: athlete03Image, portraitFocalPoint: '50% 22%' },
  { id: 'athlete-04', name: 'Selma Ndeitunga', age: 21, level: 88, specialty: 'Medley', nationality: 'Namibia', marketValue: '1,450,000', weeklyWage: '21,300', joinDate: 'Jun 03, 2026', image: athlete04Image, portraitFocalPoint: '50% 20%' },
  { id: 'athlete-05', name: 'Thoko Mvula', age: 19, level: 83, specialty: 'Breaststroke', nationality: 'Malawi', marketValue: '1,000,000', weeklyWage: '15,600', joinDate: 'Jun 03, 2026', image: athlete05Image, portraitFocalPoint: '50% 18%' },
  { id: 'athlete-06', name: 'Hana Bekele', age: 20, level: 85, specialty: 'Freestyle', nationality: 'Ethiopia', marketValue: '1,180,000', weeklyWage: '17,900', joinDate: 'Jun 03, 2026', image: athlete06Image, portraitFocalPoint: '50% 19%' },
  { id: 'athlete-07', name: 'Tariro Moyo', age: 22, level: 89, specialty: 'Sprint', nationality: 'Zimbabwe', marketValue: '1,620,000', weeklyWage: '24,800', joinDate: 'Jun 03, 2026', image: athlete07Image, portraitFocalPoint: '50% 16%' },
  { id: 'athlete-08', name: 'Lin Xia', age: 19, level: 81, specialty: 'Backstroke', nationality: 'China', marketValue: '920,000', weeklyWage: '13,800', joinDate: 'Jun 03, 2026', image: athlete08Image, portraitFocalPoint: '50% 18%' },
  { id: 'athlete-09', name: 'Megan Carter', age: 20, level: 87, specialty: 'Butterfly', nationality: 'United States', marketValue: '1,360,000', weeklyWage: '20,500', joinDate: 'Jun 03, 2026', image: athlete09Image, portraitFocalPoint: '50% 18%' },
  { id: 'athlete-10', name: 'Imani Clarke', age: 18, level: 80, specialty: 'Distance', nationality: 'Canada', marketValue: '890,000', weeklyWage: '12,700', joinDate: 'Jun 03, 2026', image: athlete10Image, portraitFocalPoint: '50% 18%' },
  { id: 'athlete-11', name: 'Nour El-Sayed', age: 21, level: 90, specialty: 'Medley', nationality: 'Egypt', marketValue: '1,780,000', weeklyWage: '27,000', joinDate: 'Jun 03, 2026', image: athlete11Image, portraitFocalPoint: '50% 18%' },
];

const initialRosterIds = ['athlete-01', 'athlete-02', 'athlete-03', 'athlete-04'];

const sponsorCards = [
  { logo: 'AP', name: 'AquaPulse', deal: '50,000 / season', status: 'Active' },
  { logo: 'BC', name: 'BlueCurrent', deal: '75,000 + gear', status: 'Incoming' },
  { logo: 'WL', name: 'WaveLens', deal: 'Media rights bonus', status: 'Negotiation' },
];

const detailedSponsorOffers = [
  {
    logo: 'AP',
    name: 'AquaPulse Energy',
    years: 3,
    value: '240,000',
    targets: ['Reach Top 8 in National League', 'Win 1 Regional Cup race', 'Post 2 branded social clips/month'],
    dynamicTerms: 'Bonus +20,000 if your relay reaches podium in 2 consecutive rounds.',
    status: 'Active',
  },
  {
    logo: 'BC',
    name: 'BlueCurrent Tech',
    years: 2,
    value: '180,000 + gear kit',
    targets: ['Develop two U19 talents to rating 80+', 'Appear in 1 partner showcase event', 'Finish season with positive team morale'],
    dynamicTerms: 'Contract extends +1 year automatically if all performance targets are completed.',
    status: 'Offer',
  },
  {
    logo: 'WL',
    name: 'WaveLens Media',
    years: 4,
    value: '320,000 + media rights',
    targets: ['Qualify for World Tour finals', 'Minimum 70% win rate in home events', 'Publish 4 coach insight interviews'],
    dynamicTerms: 'Payout drops by 15% for every missed quarter target, but rebounds with win streaks.',
    status: 'Negotiation',
  },
];

const longTermStaff = [
  {
    name: 'David Marsh',
    role: 'Head Coach',
    age: 49,
    experience: '17 seasons',
    contract: '2 years 8 months',
    advantage: '+8% sprint block efficiency',
  },
  {
    name: 'Teri McKeever',
    role: 'Technical Director',
    age: 45,
    experience: '14 seasons',
    contract: '1 year 4 months',
    advantage: '+6% stroke consistency for U21',
  },
  {
    name: 'Bob Bowman',
    role: 'Performance Lead',
    age: 52,
    experience: '21 seasons',
    contract: '3 years 2 months',
    advantage: '+5% race-day stamina retention',
  },
];

const competitionCards = [
  {
    title: 'P2P League Round 6',
    mode: 'P2P League',
    entry: '120 points',
    reward: '12,000 + sponsor bonus',
    schedule: 'Tonight • 19:30',
    pool: 'National Aquatic Arena',
  },
  {
    title: 'Continental Knockout',
    mode: 'P2P Tournament',
    entry: '80 points',
    reward: '8,500 + contract boost',
    schedule: 'Tomorrow • 21:00',
    pool: 'Blue Wave Stadium',
  },
  {
    title: 'Coach Challenge Tour',
    mode: 'AI Tour',
    entry: '35 points',
    reward: '2,700 + youth XP',
    schedule: 'Open this week',
    pool: 'Riverfront Complex',
  },
];

const coachCards = [
  { name: 'David Marsh', role: 'Head Coach', level: 'Elite' },
  { name: 'Bob Bowman', role: 'Strength Coach', level: 'Senior' },
  { name: 'Teri McKeever', role: 'Assistant Coach', level: 'Senior' },
];

const emblemOptions = ['Wave Crest', 'Aqua Eagle', 'Blue Shark', 'Hydra Spear'];

const baseRoutes: { key: ClubSubPage; title: string; description: string; icon: string }[] = [
  { key: 'TEAM_OPERATIONS', title: 'Team Operations', description: 'Invest in facilities, players, gear, training, and scouting.', icon: 'monitoring' },
  { key: 'STAFF_MANAGEMENT', title: 'Staff Management', description: 'Hire/fire coaches and mentors for your club system.', icon: 'badge' },
  { key: 'PLAYER_MANAGEMENT', title: 'Player Management', description: 'Manage contracts, earnings, and squad plans.', icon: 'groups' },
  { key: 'SPONSORS', title: 'Sponsors & Partners', description: 'Sign and manage sponsor/partner deals.', icon: 'handshake' },
  { key: 'UPCOMING_EVENTS', title: 'Upcoming Events', description: 'See events and register entries in advance.', icon: 'event' },
  { key: 'LEAGUES_TOURNAMENTS', title: 'Leagues & Tournaments', description: 'Join P2P/PvE tournaments, leagues, and tours.', icon: 'emoji_events' },
  { key: 'SCOUTING', title: 'Transfers & Scouts', description: 'Buy from clubs, scout talent, and sign future stars.', icon: 'travel_explore' },
  { key: 'FUNDING', title: 'Funding & Finance', description: 'Track team/player earnings and source funding.', icon: 'payments' },
  { key: 'CLUB_COMPETITIONS', title: 'Club Competitions', description: 'Launch arena races for tournaments/leagues.', icon: 'sports_score' },
];

export const ClubScreen: React.FC<ClubScreenProps> = ({ clubName = 'Aqua Dragons', onLaunchArenaRace }) => {
  const [activeTab, setActiveTab] = useState<ClubTab>('OVERVIEW');
  const [activeSubPage, setActiveSubPage] = useState<ClubSubPage | null>(null);
  const [managerMode, setManagerMode] = useState<ManagerMode | null>('OWNER');
  const [rosterMembers, setRosterMembers] = useState<AthleteProfile[]>(() => scoutingAthletes.filter((athlete) => initialRosterIds.includes(athlete.id)).map((athlete, index) => ({ ...athlete, relayPosition: index + 1 })));
  const [careerStarterId, setCareerStarterId] = useState<string>(scoutingAthletes[0]?.id ?? '');
  const [clubSetup, setClubSetup] = useState({ name: 'Aqua Dragons', city: 'Lusaka', nation: 'Zambia', emblem: 'Wave Crest' });

  const relayOrder = useMemo(() => rosterMembers.slice(0, 4).map((member) => member.id), [rosterMembers]);
  const signedAthleteIds = useMemo(() => new Set(rosterMembers.map((member) => member.id)), [rosterMembers]);

  const signAthlete = (athlete: AthleteProfile) => {
    setRosterMembers((current) => {
      if (current.some((member) => member.id === athlete.id)) return current;
      const relayPosition = current.length < 4 ? current.length + 1 : undefined;
      return [...current, { ...athlete, joinDate: 'Jun 09, 2026', relayPosition }];
    });
  };

  const tabs: { id: ClubTab; label: string; icon: string }[] = [
    { id: 'OVERVIEW', label: 'Overview', icon: 'home' },
    { id: 'FACILITIES', label: 'Facilities', icon: 'apartment' },
    { id: 'ROSTER', label: 'Roster', icon: 'groups' },
    { id: 'RELAY', label: 'Relay', icon: 'bolt' },
    { id: 'STAFF', label: 'Staff', icon: 'badge' },
    { id: 'BRANDING', label: 'Branding', icon: 'palette' },
  ];

  const managementRoutes = useMemo(() => {
    if (!managerMode) {
      return [
        {
          key: 'START_PATH' as ClubSubPage,
          title: 'Create Club / Get Hired',
          description: 'Choose your journey: own a club or start as hired amateur manager.',
          icon: 'account_tree',
        },
      ];
    }
    return baseRoutes;
  }, [managerMode]);

  const commonSubHeader = (title: string) => (
    <div className="flex items-center justify-between gap-3 mb-4">
      <h2 className="text-2xl font-black text-primary">{title}</h2>
      <button onClick={() => setActiveSubPage(null)} className="px-4 py-2 rounded-lg border border-white/20 bg-slate-800/60 font-bold uppercase text-xs">
        Back to Club Hub
      </button>
    </div>
  );

  const renderSubPage = () => {
    if (!activeSubPage) return null;

    switch (activeSubPage) {
      case 'START_PATH':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-headline text-4xl font-black italic slanted uppercase text-on-surface text-glow mb-4">Choose Your Destiny</h2>
              <p className="text-on-surface-variant font-bold uppercase tracking-[0.2em] text-[11px]">Choose your career trajectory in the professional aquatic league</p>
            </div>
            
            <div className="p-6 rounded-[32px] border border-white/10 bg-white/5 max-w-4xl mx-auto">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-4">Career Starter Athletes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {scoutingAthletes.slice(0, 6).map((athlete) => (
                  <button
                    key={athlete.id}
                    onClick={() => setCareerStarterId(athlete.id)}
                    className={`p-2 rounded-2xl border transition-all ${careerStarterId === athlete.id ? 'border-primary bg-primary/15' : 'border-white/10 bg-white/5 hover:border-primary/40'}`}
                  >
                    <img src={athlete.image} alt={athlete.name} className="h-16 w-full rounded-xl object-contain bg-black/30 mb-2" />
                    <div className="text-[8px] font-black uppercase tracking-tight text-on-surface">{athlete.name}</div>
                    <div className="text-[8px] font-bold uppercase text-primary">{athlete.nationality}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Owner Path */}
              <div className="group/path relative p-10 rounded-[48px] border border-primary/20 bg-primary/5 hover:border-primary/60 transition-all duration-700 flex flex-col items-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover/path:opacity-100 transition-opacity" />
                <span style={{fontSize:'70px', lineHeight:1, display:'inline-block'}} className="text-primary text-glow mb-8 group-hover/path:scale-110 transition-transform duration-700">💧</span>
                
                <h3 className="font-headline text-3xl font-black italic slanted uppercase text-on-surface mb-2">Dynasty Founder</h3>
                <p className="text-on-surface-variant text-sm mb-10 leading-relaxed max-w-xs uppercase font-bold tracking-tight italic">Build an empire from zero. Full creative control. Total organizational responsibility.</p>
                
                <ul className="text-[10px] font-black uppercase tracking-widest text-primary/70 space-y-4 mb-12 flex-1">
                  <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Comprehensive Club Customization</li>
                  <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Sponsor Priority Protocol</li>
                  <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Academy Starter Infrastructure</li>
                </ul>

                <button onClick={() => setActiveSubPage('CLUB_SETUP')} className="w-full relative group/btn">
                  <div className="absolute inset-0 bg-primary blur-xl opacity-20 group-hover/btn:opacity-40 transition-all" />
                  <div className="relative h-16 bg-primary border border-primary/50 text-surface font-headline font-black italic slanted uppercase text-sm tracking-widest rounded-2xl flex items-center justify-center gap-3 group-hover/btn:bg-white transition-colors">
                    Initialize Protocol
                    <span style={{fontSize:'14px', lineHeight:1, display:'inline-block'}}>🚀</span>
                  </div>
                </button>
              </div>

              {/* Hired Path */}
              <div className="group/path relative p-10 rounded-[48px] border border-secondary/20 bg-secondary/5 hover:border-secondary/60 transition-all duration-700 flex flex-col items-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 to-transparent opacity-0 group-hover/path:opacity-100 transition-opacity" />
                <span style={{fontSize:'70px', lineHeight:1, display:'inline-block'}} className="text-secondary gold-glow mb-8 group-hover/path:scale-110 transition-transform duration-700">🏅</span>
                
                <h3 className="font-headline text-3xl font-black italic slanted uppercase text-on-surface mb-2">Professional Agent</h3>
                <p className="text-on-surface-variant text-sm mb-10 leading-relaxed max-w-xs uppercase font-bold tracking-tight italic">Join established organizations. Meet corporate objectives. Climb the global ladder.</p>
                
                <ul className="text-[10px] font-black uppercase tracking-widest text-secondary/70 space-y-4 mb-12 flex-1">
                  <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-secondary" /> High-Stakes Career Progression</li>
                  <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-secondary" /> Direct Performance Incentives</li>
                  <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-secondary" /> Elite Club Vacancy Search</li>
                </ul>

                <button 
                  onClick={() => {
                    setManagerMode('HIRED');
                    setActiveSubPage(null);
                  }}
                  className="w-full relative group/btn"
                >
                  <div className="absolute inset-0 bg-secondary blur-xl opacity-20 group-hover/btn:opacity-40 transition-all" />
                  <div className="relative h-16 bg-secondary border border-secondary/50 text-surface font-headline font-black italic slanted uppercase text-sm tracking-widest rounded-2xl flex items-center justify-center gap-3 group-hover/btn:bg-white transition-colors">
                    Join Selection
                    <span style={{fontSize:'14px', lineHeight:1, display:'inline-block'}}>🔍</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      case 'CLUB_SETUP':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Identity Form */}
              <div className="p-10 rounded-[40px] border border-white/5 bg-white/5 space-y-8">
                <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Identity Protocol</h3>
                
                <div className="space-y-6">
                  {(['name', 'city', 'nation'] as const).map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] px-2">{field} Information</label>
                      <input
                        value={clubSetup[field]}
                        onChange={(e) => setClubSetup((prev) => ({ ...prev, [field]: e.target.value }))}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-on-surface font-bold focus:border-primary/50 focus:bg-white/10 transition-all outline-none"
                        placeholder={`Enter ${field}...`}
                      />
                    </div>
                  ))}
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] px-2">Visual Hallmark</label>
                    <div className="grid grid-cols-2 gap-3">
                      {emblemOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => setClubSetup((prev) => ({ ...prev, emblem: option }))}
                          className={`h-12 rounded-xl border font-headline font-black italic slanted uppercase text-[10px] tracking-widest transition-all ${clubSetup.emblem === option ? 'border-primary bg-primary/20 text-primary text-glow shadow-[0_0_15px_rgba(129,236,255,0.2)]' : 'border-white/10 bg-white/5 text-on-surface-variant hover:border-white/20'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Starter Pack */}
              <div className="space-y-8">
                <div className="p-10 rounded-[40px] border border-secondary/20 bg-secondary/5 space-y-6">
                  <h3 className="font-headline text-xl font-black italic slanted uppercase text-secondary gold-glow">Sponsorship Seed</h3>
                  <div className="space-y-3">
                    {sponsorCards.slice(0, 2).map((s) => (
                      <div key={s.name} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center font-black text-secondary group-hover:bg-secondary group-hover:text-surface transition-all">{s.logo}</div>
                          <div className="text-[11px] font-black uppercase text-on-surface tracking-tight">{s.name}</div>
                        </div>
                        <span className="font-headline text-lg font-black italic slanted text-secondary gold-glow">{s.deal.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-10 rounded-[40px] border border-primary/20 bg-primary/5 space-y-6 flex-1">
                  <h3 className="font-headline text-xl font-black italic slanted uppercase text-primary text-glow">Academy Core</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {scoutingAthletes.slice(0, 2).map((athlete) => (
                      <div key={athlete.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center group">
                        <img src={athlete.image} alt={athlete.name} className="w-16 h-16 rounded-2xl object-contain bg-black/30 mx-auto mb-3 border border-white/10 group-hover:border-primary/50 transition-all" />
                        <div className="text-[9px] font-black uppercase text-on-surface tracking-widest mb-1">{athlete.name}</div>
                        <div className="text-[8px] font-bold text-primary uppercase tracking-widest">POT: {athlete.level + 3}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setManagerMode('OWNER');
                setActiveSubPage(null);
              }}
              className="w-full mt-8 relative group/confirm"
            >
              <div className="absolute inset-0 bg-primary blur-2xl opacity-10 group-hover/confirm:opacity-40 transition-all duration-700" />
              <div className="relative h-20 bg-primary/10 border-2 border-primary/40 hover:border-primary hover:bg-primary/20 rounded-[28px] flex items-center justify-center gap-4 transition-all duration-300">
                <span className="font-headline text-2xl font-black italic slanted uppercase text-primary text-glow">Finalize Dynasty Credentials</span>
                <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className="text-primary">✓</span>
              </div>
            </button>
          </div>
        );
      case 'TEAM_OPERATIONS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Invest Facilities', text: 'Upgrade pool, gym, recovery labs', icon: 'apartment' },
                { title: 'Invest Players', text: 'Contracts, wage adjustments, renewals', icon: 'payments' },
                { title: 'Gear Program', text: 'Suit tech and equipment quality', icon: 'apparel' },
                { title: 'Train Players', text: 'Specialized weekly training blocks', icon: 'fitness_center' },
                { title: 'Scout Talent', text: 'Global scouting assignments', icon: 'travel_explore' },
                { title: 'Earnings Control', text: 'Team and player earning distribution', icon: 'monitoring' },
              ].map((op) => (
                <div key={op.title} className="group/op relative p-8 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/40 transition-all duration-500 overflow-hidden">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover/op:bg-primary group-hover/op:text-surface transition-all">
                      <span style={{fontSize:'20px', lineHeight:1, display:'inline-block'}} className="text-primary">⚙</span>
                    </div>
                    <h4 className="font-headline text-base font-black italic slanted uppercase text-on-surface">{op.title}</h4>
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-tight leading-relaxed">{op.text}</p>
                </div>
              ))}
            </div>

            {managerMode === 'OWNER' && (
              <div className="p-10 rounded-[40px] border border-red-500/20 bg-red-500/5 space-y-6">
                <div className="flex items-center gap-4 text-red-400">
                  <span style={{fontSize:'30px', lineHeight:1, display:'inline-block'}} className="animate-pulse">⚠</span>
                  <div>
                    <h3 className="font-headline text-xl font-black italic slanted uppercase">Liquidate Assets</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-300 opacity-60">High-risk organizational termination protocol</p>
                  </div>
                </div>
                <p className="text-on-surface-variant text-[11px] uppercase font-bold leading-relaxed max-w-2xl">Liquidation will terminate all current contracts, sell facilities at market minimum, and reset your club credentials. You will return to the Selection Screen to choose a new career trajectory.</p>
                <button
                  onClick={() => {
                    setManagerMode('HIRED');
                    setActiveSubPage('START_PATH');
                  }}
                  className="px-8 h-14 bg-red-500/10 border border-red-500/40 hover:bg-red-500 hover:text-surface font-headline font-black italic slanted uppercase text-xs tracking-[0.2em] rounded-2xl transition-all"
                >
                  Confirm Asset Liquidation
                </button>
              </div>
            )}
          </div>
        );
      case 'CLUB_COMPETITIONS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-8">
              <div className="space-y-4">
                <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Available Operations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {competitionCards.map((item) => (
                    <div key={item.title} className="group/comp relative p-6 rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/40 transition-all duration-500 overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em]">{item.mode} Protocol</span>
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      </div>
                      <h4 className="font-headline text-lg font-black italic slanted uppercase text-on-surface mb-1 group-hover/comp:text-glow transition-all">{item.title}</h4>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-6">{item.pool}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="block text-[7px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Entry Value</span>
                          <span className="font-headline text-sm font-black italic slanted text-on-surface">{item.entry}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="block text-[7px] font-black text-secondary/60 uppercase tracking-widest mb-1">Potential Reward</span>
                          <span className="font-headline text-sm font-black italic slanted text-secondary gold-glow">{item.reward.split(' ')[0]}</span>
                        </div>
                      </div>

                      <button onClick={onLaunchArenaRace} className="w-full h-12 rounded-xl bg-primary/10 border border-primary/30 hover:bg-primary hover:text-surface font-headline font-black italic slanted uppercase text-xs tracking-widest transition-all">
                        Initialize Race
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow opacity-60">Status Matrix</h3>
                <div className="p-8 rounded-[40px] border border-secondary/20 bg-secondary/5 space-y-6">
                  <h4 className="font-headline text-xl font-black italic slanted uppercase text-secondary gold-glow">Rotation Status</h4>
                  <div className="space-y-3">
                    {[
                      'Daily Cycle: 2 P2P Operations + 1 AI Scenario',
                      'Weekly Directive: 220 Cumulative Points',
                      'Season Multiplier: Active for National League',
                    ].map((text, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant group">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_10px_rgba(255,215,9,1)]" />
                        {text}
                      </div>
                    ))}
                  </div>
                  <button onClick={onLaunchArenaRace} className="w-full h-16 rounded-2xl bg-secondary/10 border-2 border-secondary/40 hover:border-secondary hover:bg-secondary/20 font-headline font-black italic slanted uppercase text-sm tracking-widest text-secondary gold-glow transition-all">
                    Launch Featured Scenario
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'STAFF_MANAGEMENT':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative overflow-hidden rounded-[36px] border border-primary/20 bg-surface/30">
              <img src={staffManagementReferenceImage} alt="Staff management operations" className="h-56 w-full object-cover object-top opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/50 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Club Department</p>
                <h3 className="font-headline text-3xl font-black italic slanted uppercase text-on-surface text-glow">Staff & Mentors Control</h3>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">This view now lives under Club as requested.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">External Consultation</h3>
                <div className="space-y-3">
                  {['Sprint Block Mastery • 120K', 'Precision Stroke Matrix • 95K', 'Endurance Calibration • 110K'].map((s) => (
                    <div key={s} className="group/hire p-5 rounded-[24px] border border-white/5 bg-white/5 hover:border-primary/40 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={miaPhiriAthleteImage} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-on-surface italic">{s}</span>
                      </div>
                      <button className="h-10 px-6 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary hover:text-surface font-headline font-black italic slanted uppercase text-[10px] tracking-widest text-primary transition-all">
                        Hire Consultant
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Operational Staff</h3>
                <div className="space-y-4">
                  {longTermStaff.map((c) => (
                    <div key={c.name} className="group/staff p-6 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <img src={miaPhiriAthleteImage} className="w-14 h-14 rounded-2xl object-cover border border-white/10" />
                          <div>
                            <h4 className="font-headline text-base font-black italic slanted uppercase text-on-surface">{c.name}</h4>
                            <p className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em]">{c.role} • {c.experience}</p>
                          </div>
                        </div>
                        <button className="h-8 px-4 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-surface text-[9px] font-black uppercase text-red-400 transition-all">
                          Release
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div><span className="block text-[7px] font-black text-on-surface-variant uppercase mb-1">Status</span><span className="text-[10px] font-bold text-on-surface">{c.contract}</span></div>
                        <div><span className="block text-[7px] font-black text-on-surface-variant uppercase mb-1">Experience</span><span className="text-[10px] font-bold text-on-surface">{c.age} Cycles</span></div>
                        <div><span className="block text-[7px] font-black text-secondary/60 uppercase mb-1">Benefit</span><span className="text-[10px] font-bold text-secondary gold-glow">{c.advantage.split(' ')[0]}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'PLAYER_MANAGEMENT':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Athlete Coordination</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rosterMembers.map((player) => (
                <div key={player.id} className="group/play relative p-8 rounded-[40px] border border-white/5 bg-white/5 hover:border-primary/40 transition-all duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                      <img src={player.image} alt={player.name} className="w-20 h-20 rounded-[24px] object-cover border-2 border-white/10 group-hover/play:border-primary/50 transition-all" />
                      <div>
                        <h4 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface group-hover/play:text-glow transition-all">{player.name}</h4>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em]">{player.nationality} • {player.specialty} • AGE {player.age} Specialist</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] font-black text-primary/60 uppercase tracking-widest mb-1">Weekly Wage</span>
                      <span className="font-headline text-xl font-black italic slanted text-on-surface">{player.weeklyWage}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button className="h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500/20 hover:border-amber-500/50 font-headline font-black italic slanted uppercase text-[10px] tracking-widest text-on-surface-variant hover:text-amber-400 transition-all">
                      Renew Contract
                    </button>
                    <button className="h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 font-headline font-black italic slanted uppercase text-[10px] tracking-widest text-on-surface-variant hover:text-red-400 transition-all">
                      Negotiate Transfer
                    </button>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                    <h5 className="text-[9px] font-black uppercase text-primary tracking-[0.4em] mb-4">Operational Directives</h5>
                    <ul className="space-y-3">
                      {detailedSponsorOffers[0].targets.map((target, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-tight text-on-surface-variant group/item">
                          <span className="h-1 w-1 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors" />
                          {target}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'SPONSORS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Sponsorship Portfolio</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {detailedSponsorOffers.map((s) => (
                <div key={s.name} className="group/offer relative p-8 rounded-[40px] border border-white/5 bg-white/5 hover:border-secondary/40 transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/offer:opacity-10 transition-opacity">
                    <span style={{fontSize:'120px', lineHeight:1, display:'inline-block'}} className="text-secondary">✓</span>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-8">
                      <div className="h-16 w-16 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center font-headline text-2xl font-black italic slanted text-secondary gold-glow group-hover/offer:bg-secondary group-hover/offer:text-surface transition-all">
                        {s.logo}
                      </div>
                      <div>
                        <h4 className="font-headline text-xl font-black italic slanted uppercase text-on-surface mb-1">{s.name}</h4>
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] font-body italic">{s.status} Protocol • Tier 1</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <span className="block text-[7px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Seasonal Yield</span>
                        <span className="font-headline text-xl font-black italic slanted text-secondary gold-glow">{s.value}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <span className="block text-[7px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Contract Tenure</span>
                        <span className="font-headline text-xl font-black italic slanted text-on-surface">{s.years}</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <h5 className="text-[9px] font-black uppercase text-on-surface-variant tracking-[0.4em]">Objective Matrix</h5>
                      <div className="grid gap-2">
                        {s.targets.map((target, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[9px] font-bold uppercase tracking-tight text-on-surface-variant">
                            <span className="h-1 w-1 rounded-full bg-secondary/40" />
                            {target}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="w-full h-14 rounded-2xl bg-secondary/10 border border-secondary/30 hover:bg-secondary hover:text-surface font-headline font-black italic slanted uppercase text-xs tracking-widest text-secondary gold-glow transition-all">
                      Finalize Agreement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'UPCOMING_EVENTS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Event Horizon</h3>
            <div className="space-y-4">
              {[
                { name: 'Regional Meet - Week 2', time: 'In 2 Days', type: 'Qualifier Protocol', prize: '120K Coins' },
                { name: 'National Championship - Week 4', time: 'In 5 Days', type: 'Major Event', prize: '350K Coins' },
                { name: 'World Qualifier - Week 8', time: 'In 12 Days', type: 'Elite Scenario', prize: 'Unique Gear' },
              ].map((event) => (
                <div key={event.name} className="group/event flex items-center gap-8 p-6 rounded-[32px] border border-white/5 bg-white/5 hover:border-primary/40 transition-all">
                  <div className="flex flex-col items-center min-w-[80px]">
                    <span className="font-headline text-3xl font-black italic slanted text-primary group-hover/event:text-glow transition-all">{event.time.split(' ')[1]}</span>
                    <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest">{event.time.split(' ').slice(0, 1).join('')}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="h-[1px] w-4 bg-primary/40" />
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest">{event.type}</span>
                    </div>
                    <h4 className="font-headline text-xl font-black italic slanted uppercase text-on-surface">{event.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Projected Gain</span>
                    <span className="font-headline text-lg font-black italic slanted text-secondary gold-glow">{event.prize}</span>
                  </div>
                  <button onClick={onLaunchArenaRace} className="h-10 px-6 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary hover:text-surface font-headline font-black italic slanted uppercase text-[10px] tracking-widest text-primary transition-all">
                    Initialize
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'LEAGUES_TOURNAMENTS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Global Standings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'National League', rank: 'Rank 6', status: 'Active', reward: 'Elite Badge' },
                { name: 'Regional Cup', rank: 'Semifinal', status: 'In Progress', reward: 'Tech Suit' },
                { name: 'Elite Invitational', rank: 'Qualifier', status: 'Upcoming', reward: '500K Coins' },
              ].map((league) => (
                <div key={league.name} className="group/league relative p-8 rounded-[32px] border border-white/5 bg-white/5 hover:border-primary/40 transition-all duration-500 overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">{league.rank}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${league.status === 'Active' ? 'bg-primary animate-pulse' : 'bg-on-surface-variant/40'}`} />
                  </div>
                  <h4 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface mb-2">{league.name}</h4>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-tight mb-8">Next Milestone: {league.reward}</p>
                  
                  <button onClick={onLaunchArenaRace} className="w-full h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/50 font-headline font-black italic slanted uppercase text-[10px] tracking-widest text-on-surface-variant hover:text-primary transition-all">
                    Register Protocol
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'SCOUTING':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden rounded-[36px] border border-primary/10 p-6">
            <img src={scoutingBackdropImage} alt="Scout background" className="absolute inset-0 h-full w-full object-cover pointer-events-none" />
            <div className="relative z-10 space-y-8">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Transfers & Scouting Market</h3>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
              <div className="p-8 rounded-[32px] border border-white/5 bg-white/5 space-y-8">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Transfer Filters</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Age Bracket', value: 'U18-U21' },
                    { label: 'Geographic Sector', value: 'Africa/Europe' },
                    { label: 'Technical Specialty', value: 'Freestyle' },
                  ].map((f) => (
                    <div key={f.label} className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <span className="block text-[7px] font-black text-on-surface-variant uppercase mb-1">{f.label}</span>
                      <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">{f.value}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full h-14 rounded-2xl bg-primary/10 border border-primary/30 hover:bg-primary hover:text-surface font-headline font-black italic slanted uppercase text-[10px] tracking-widest text-primary transition-all">
                  Refresh Market
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-white/10 bg-black/40">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-secondary">Transfer Exchange</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">Sign swimmers directly from other clubs or shortlist prospects for negotiation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {scoutingAthletes.map((athlete) => {
                  const isSigned = signedAthleteIds.has(athlete.id);
                  return (
                    <div key={athlete.id} className="group/prospect p-2.5 md:p-4 rounded-[24px] border border-white/5 bg-white/5 hover:border-primary/40 transition-all duration-300">
                      <div className="relative mb-3">
                        <AthletePortraitMedia src={athlete.image} alt={athlete.name} fit="contain" className="w-full h-20 md:h-28 rounded-xl border border-white/10 bg-black/35 group-hover/prospect:border-primary/50 transition-all" focalPoint={athlete.portraitFocalPoint ?? '50% 20%'} />
                        <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-lg bg-surface/80 backdrop-blur-md border border-white/10 font-headline font-black italic slanted text-primary text-[9px]">
                          OVR {athlete.level}
                        </div>
                      </div>
                      <div className="text-xs font-black italic slanted uppercase text-on-surface">{athlete.name}</div>
                      <div className="mt-2 text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">{athlete.nationality} • Age {athlete.age}</div>
                      <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-primary">{athlete.specialty}</div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[8px] font-black uppercase tracking-wider">
                        <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                          <span className="block text-on-surface-variant">Worth</span>
                          <span className="text-secondary">${athlete.marketValue}</span>
                        </div>
                        <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                          <span className="block text-on-surface-variant">Weekly</span>
                          <span className="text-primary">${athlete.weeklyWage}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => signAthlete(athlete)}
                        disabled={isSigned}
                        className={`mt-3 w-full h-7 rounded-lg text-[8px] font-black uppercase transition-all ${isSigned ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 cursor-default' : 'bg-secondary/10 border border-secondary/20 hover:bg-secondary hover:text-surface text-secondary'}`}
                      >
                        {isSigned ? 'Signed' : 'Sign Athlete'}
                      </button>
                    </div>
                  );
                })}
              </div>
              </div>
            </div>
            </div>
          </div>
        );
      case 'FUNDING':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Treasury Matrix</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 rounded-[40px] border border-emerald-500/20 bg-emerald-500/5 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className="text-emerald-400">↗</span>
                  </div>
                  <h4 className="font-headline text-xl font-black italic slanted uppercase text-emerald-400 text-glow">Yield Channels</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Sponsorship Yield', value: '+85,000' },
                    { label: 'Scenario Payouts', value: '+42,000' },
                    { label: 'Global Licensing', value: '+18,000' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant font-body">{item.label}</span>
                      <span className="font-headline text-lg font-black italic slanted text-emerald-400">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-10 rounded-[40px] border border-red-500/20 bg-red-500/5 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                    <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className="text-red-400">↘</span>
                  </div>
                  <h4 className="font-headline text-xl font-black italic slanted uppercase text-red-400 text-glow">Operational Cost</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Athlete Payroll', value: '-39,000' },
                    { label: 'Operational Staff', value: '-14,000' },
                    { label: 'Infrastructure Maint', value: '-8,000' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant font-body">{item.label}</span>
                      <span className="font-headline text-lg font-black italic slanted text-red-400">{item.value}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full h-14 rounded-2xl bg-primary/10 border border-primary/30 hover:bg-primary hover:text-surface font-headline font-black italic slanted uppercase text-xs tracking-widest text-primary transition-all">
                  Inject Liquidity
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'OVERVIEW':
        return (
          <div className="space-y-8">
            {/* Team Identity Panel */}
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 relative overflow-hidden group/identity">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover/identity:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 flex items-center justify-between gap-12 flex-wrap">
                <div className="flex items-center gap-8">
                  <div className="h-24 w-24 rounded-[32px] bg-primary/20 border border-primary/40 flex items-center justify-center shadow-[0_0_30px_rgba(129,236,255,0.2)] group-hover/identity:scale-105 transition-transform duration-500">
                    <span style={{fontSize:'48px', lineHeight:1, display:'inline-block'}} className="text-primary text-glow">💧</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.4em]">Established Jan 2024</span>
                    </div>
                    <h2 className="font-headline text-4xl font-black italic slanted uppercase text-on-surface mb-1">{clubName}</h2>
                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest italic group-hover:text-glow transition-all">Regional Powerhouse • {clubSetup.city}, {clubSetup.nation}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {sponsorCards.map((s) => (
                    <div key={s.name} className="px-5 py-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 hover:border-primary/30 transition-all group/sponsor">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-black text-[10px] text-primary group-hover/sponsor:bg-primary group-hover/sponsor:text-surface transition-colors">{s.logo}</div>
                      <div className="text-[11px] font-bold text-on-surface truncate max-w-[80px]">{s.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Management Hub Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {managementRoutes.map((route) => (
                <button
                  key={route.key}
                  onClick={() => setActiveSubPage(route.key)}
                  className="group/route relative text-left p-8 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/40 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover/route:opacity-5 transition-opacity duration-500">
                    <span style={{fontSize:'100px', lineHeight:1, display:'inline-block'}} className="text-primary">⚙</span>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover/route:bg-primary/30 group-hover/route:border-primary/50 transition-all">
                        <span style={{fontSize:'20px', lineHeight:1, display:'inline-block'}} className="text-primary">⚙</span>
                      </div>
                    </div>
                    <h3 className="font-headline text-xl font-black italic slanted uppercase text-on-surface mb-2 group-hover/route:text-glow transition-all">{route.title}</h3>
                    <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed uppercase tracking-tight">{route.description}</p>
                    
                    <div className="mt-8 flex items-center gap-2 opacity-0 -translate-x-4 group-hover/route:opacity-100 group-hover/route:translate-x-0 transition-all duration-500">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">Access Protocol</span>
                      <span style={{fontSize:'14px', lineHeight:1, display:'inline-block'}} className="text-primary">→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 'FACILITIES':
        return (
          <div className="space-y-8">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Infrastructure Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Olympic Pool', lv: 3, icon: 'pool', desc: 'Main training arena with precision timing' },
                { name: 'Training Gym', lv: 2, icon: 'fitness_center', desc: 'High-performance strength matrix' },
                { name: 'Recovery Lab', lv: 1, icon: 'medical_services', desc: 'Cryogenic and hydrotherapy systems' },
                { name: 'Nutrition Center', lv: 2, icon: 'restaurant', desc: 'Metabolic fuel optimization' },
              ].map((f) => (
                <div key={f.name} className="group/fac relative p-6 rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/40 transition-all duration-500 overflow-hidden">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover/fac:bg-primary/30 transition-all">
                      <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className="text-primary">⚙</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-headline text-lg font-black italic slanted uppercase text-on-surface">{f.name}</h4>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Lv {f.lv}</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-tight mb-4">{f.desc}</p>
                      
                      {/* Progress Bar */}
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary shadow-[0_0_10px_rgba(129,236,255,1)]" style={{ width: `${f.lv * 25}%` }} />
                      </div>
                    </div>
                  </div>
                  
                  <button className="mt-6 w-full h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/50 text-[10px] font-black uppercase tracking-widest transition-all">
                    Initiate Upgrade
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'ROSTER':
        return (
          <div className="space-y-8">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Active Roster</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rosterMembers.map((member) => (
                <div key={member.id} className="group/member relative p-5 rounded-3xl border border-white/5 bg-white/5 hover:border-primary/40 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <AthletePortraitMedia src={member.image} alt={member.name} fit="contain" className="w-14 h-14 rounded-xl border border-white/10 bg-black/35 group-hover/member:border-primary/50 transition-colors" focalPoint={member.portraitFocalPoint ?? '50% 20%'} />
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-surface border border-white/10 flex items-center justify-center">
                        <span className="text-[10px] font-black italic slanted text-primary">{member.level}</span>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-headline text-base font-black italic slanted uppercase text-on-surface truncate">{member.name}</h4>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{member.nationality} • {member.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest">
                    <span className="text-on-surface-variant italic">Relay Position</span>
                    <span className="text-primary text-glow">#{member.relayPosition ?? '-'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'RELAY':
        return (
          <div className="space-y-8">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Relay Formation</h3>
            <div className="grid gap-3">
              {relayOrder.map((id, idx) => {
                const member = rosterMembers.find((m) => m.id === id);
                return (
                  <div key={id} className="group/leg flex items-center gap-6 p-4 rounded-2xl border border-white/5 bg-white/5 hover:border-primary/40 transition-all">
                    <div className="h-10 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-headline font-black italic slanted text-primary">
                      L{idx + 1}
                    </div>
                    <img src={member?.image ?? miaPhiriAthleteImage} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                    <div className="flex-1">
                      <div className="text-xs font-black italic slanted uppercase text-on-surface">{member?.name}</div>
                      <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{member?.specialty} Strategy Matrix</div>
                    </div>
                    <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className="text-on-surface-variant opacity-0 group-hover/leg:opacity-100 transition-opacity">⠿</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'STAFF':
        return (
          <div className="space-y-8">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Staff Deck</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coachCards.map((c) => (
                <div key={c.name} className="group/staff p-5 rounded-[24px] border border-white/5 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-5">
                  <img src={miaPhiriAthleteImage} className="w-16 h-16 rounded-[20px] object-cover border border-white/10 group-hover/staff:border-primary/50 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-headline text-lg font-black italic slanted uppercase text-on-surface truncate">{c.name}</h4>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3 italic">{c.role} • {c.level}</p>
                    <button className="h-8 px-4 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/30 text-[9px] font-black italic slanted uppercase text-primary transition-all">
                      Apply Branding System
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'BRANDING':
        return (
          <div className="space-y-8">
             <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Identity & Branding</h3>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
               <div className="p-8 rounded-[32px] border border-white/5 bg-white/5">
                 <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.4em] mb-6">Emblem Gallery</h4>
                 <div className="grid grid-cols-2 gap-3">
                   {emblemOptions.map((e) => (
                     <div key={e} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 text-[10px] font-black italic slanted uppercase text-on-surface transition-all cursor-pointer">
                       {e}
                     </div>
                   ))}
                 </div>
               </div>
               <div className="p-8 rounded-[32px] border border-white/5 bg-white/5">
                 <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.4em] mb-6">Partner Integration</h4>
                 <div className="flex gap-4 flex-wrap">
                   {sponsorCards.map((s) => (
                     <div key={s.logo} className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-xl text-primary text-glow shadow-[0_0_15px_rgba(129,236,255,0.1)]">
                       {s.logo}
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="hydro-page-shell flex-1 relative w-full h-full overflow-y-auto flex flex-col font-body">
      <img src={clubBackdropImage} alt="Club background" className="absolute inset-0 h-full w-full object-cover pointer-events-none" />
      {/* Cinematic Club Header */}
      <div className="p-8 max-[900px]:p-5 bg-gradient-to-b from-primary/10 to-transparent border-b border-white/5 relative overflow-hidden z-10">
        <div className="absolute top-0 right-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-end justify-between gap-8 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-12 bg-primary/40" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Athlete Dynasty Hub</span>
            </div>
            
            <h1 className="font-headline text-5xl max-[900px]:text-3xl font-black italic slanted uppercase text-on-surface text-glow mb-2">
              {activeSubPage ? activeSubPage.replace(/_/g, ' ') : clubName}
            </h1>
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest italic">
              {activeSubPage ? 'System Configuration & Management' : 'Managing the future of professional aquatic sports'}
            </p>
          </div>

          {!activeSubPage && (
            <div className="flex gap-12 max-[900px]:gap-6">
              <div className="text-right">
                <span className="block text-[8px] font-black text-primary/60 uppercase tracking-widest mb-1">Global Standing</span>
                <span className="font-headline text-3xl font-black italic slanted text-on-surface text-glow">#14</span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] font-black text-secondary/60 uppercase tracking-widest mb-1">Treasury</span>
                <span className="font-headline text-3xl font-black italic slanted text-secondary gold-glow">450K</span>
              </div>
            </div>
          )}
          
          {activeSubPage && (
            <button 
              onClick={() => setActiveSubPage(null)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3 group"
            >
              <span style={{fontSize:'14px', lineHeight:1, display:'inline-block'}} className="group-hover:-translate-x-1 transition-transform">←</span>
              <span className="font-headline font-black italic slanted uppercase text-[10px] tracking-widest">Return to Hub</span>
            </button>
          )}
        </div>
      </div>

      <div className="hydro-page-content p-6 max-w-7xl mx-auto w-full space-y-8 pb-12 relative z-10">
        {/* Navigation — main tabs or sub-page module selector */}
        {!activeSubPage ? (
          <div className="flex gap-2 flex-wrap items-center">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-3 rounded-xl font-headline font-black italic slanted uppercase text-[11px] tracking-wider transition-all duration-300 overflow-hidden border ${
                    isActive
                      ? 'bg-primary/20 border-primary/40 text-primary text-glow shadow-[0_0_20px_rgba(129,236,255,0.2)]'
                      : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/10 hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <GameIcon name={tab.icon} size={18} />
                    {tab.label}
                  </div>
                  {isActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />}
                </button>
              );
            })}
          </div>
        ) : (
          /* Sub-page module selector — scrollable horizontal command rail */
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none items-center">
            {managementRoutes.map((route) => {
              const isActive = activeSubPage === route.key;
              return (
                <button
                  key={route.key}
                  onClick={() => setActiveSubPage(route.key)}
                  className={`relative flex-shrink-0 px-4 py-2.5 rounded-xl font-headline font-black italic slanted uppercase text-[10px] tracking-wider transition-all duration-300 overflow-hidden border ${
                    isActive
                      ? 'bg-primary/20 border-primary/50 text-primary text-glow shadow-[0_0_16px_rgba(129,236,255,0.25)]'
                      : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-primary/20 hover:text-on-surface hover:bg-white/10'
                  }`}
                >
                  <div className="relative z-10 flex items-center gap-1.5">
                    {isActive && <span className="h-1 w-1 rounded-full bg-primary shadow-[0_0_6px_rgba(129,236,255,1)]" />}
                    {route.title}
                  </div>
                  {isActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Display Panel */}
        <div className="min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeSubPage ? renderSubPage() : renderTab()}
        </div>
      </div>
    </div>
  );
};

export default ClubScreen;
