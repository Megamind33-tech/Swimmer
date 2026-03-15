/**
 * Club Screen - Dynasty builder
 * Club overview + management sub-pages accessed only within club section
 */

import React, { useMemo, useState } from 'react';
import miaPhiriAthleteImage from '../../designs/835_mia_phiri_news.png_1/screen.png';

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

interface ClubMember {
  id: string;
  name: string;
  level: number;
  specialty: string;
  joinDate: string;
  nationality: string;
  wage: string;
  relayPosition?: number;
}

interface ClubScreenProps {
  clubName?: string;
  onLaunchArenaRace?: () => void;
}

const ClubMembers: ClubMember[] = [
  { id: '1', name: 'Lane Master', level: 45, specialty: 'Freestyle', joinDate: 'Mar 1, 2025', nationality: 'Zambia', wage: '14,000', relayPosition: 1 },
  { id: '2', name: 'James Chen', level: 42, specialty: 'Butterfly', joinDate: 'Jan 15, 2025', nationality: 'China', wage: '11,200', relayPosition: 2 },
  { id: '3', name: 'Maya Patel', level: 39, specialty: 'Breaststroke', joinDate: 'Feb 20, 2025', nationality: 'India', wage: '9,500', relayPosition: 3 },
  { id: '4', name: 'Alex Wilson', level: 41, specialty: 'Backstroke', joinDate: 'Dec 10, 2024', nationality: 'USA', wage: '10,800', relayPosition: 4 },
];

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
  { key: 'SCOUTING', title: 'Scouting Market', description: 'Scout and recruit talent worldwide.', icon: 'travel_explore' },
  { key: 'FUNDING', title: 'Funding & Finance', description: 'Track team/player earnings and source funding.', icon: 'payments' },
  { key: 'CLUB_COMPETITIONS', title: 'Club Competitions', description: 'Launch arena races for tournaments/leagues.', icon: 'sports_score' },
];

export const ClubScreen: React.FC<ClubScreenProps> = ({ clubName = 'Aqua Dragons', onLaunchArenaRace }) => {
  const [activeTab, setActiveTab] = useState<ClubTab>('OVERVIEW');
  const [activeSubPage, setActiveSubPage] = useState<ClubSubPage | null>(null);
  const [managerMode, setManagerMode] = useState<ManagerMode | null>(null);
  const [relayOrder] = useState<string[]>(['1', '2', '3', '4']);
  const [clubSetup, setClubSetup] = useState({ name: 'Aqua Dragons', city: 'Lusaka', nation: 'Zambia', emblem: 'Wave Crest' });

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
          <div className="space-y-4">
            {commonSubHeader('Choose Club Career Path')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel rounded-lg p-5 border border-primary/35 space-y-3">
                <h3 className="text-xl font-black text-white">Create Your Club</h3>
                <p className="text-sm text-white/75">Start from scratch, build identity, sign prospects, and grow ranks.</p>
                <ul className="text-xs text-white/80 space-y-1 list-disc ml-4">
                  <li>Customize club profile and emblem</li>
                  <li>Receive starter sponsorship offers</li>
                  <li>Sign 2 free teen prospects</li>
                </ul>
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => setActiveSubPage('CLUB_SETUP')} className="px-4 py-2 rounded-lg bg-primary/35 font-bold">
                    Create Club
                  </button>
                  <span className="text-[11px] text-white/65">Build from zero with sponsor + academy starter pack.</span>
                </div>
              </div>
              <div className="glass-panel rounded-lg p-5 border border-secondary/35 space-y-3">
                <h3 className="text-xl font-black text-white">Find a Club to Manage</h3>
                <p className="text-sm text-white/75">Join as amateur manager and climb to elite clubs.</p>
                <ul className="text-xs text-white/80 space-y-1 list-disc ml-4">
                  <li>Start with lower-table clubs</li>
                  <li>Meet board objectives</li>
                  <li>Earn promotion offers</li>
                </ul>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setManagerMode('HIRED');
                      setActiveSubPage(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-secondary/35 font-bold"
                  >
                    Find Club
                  </button>
                  <span className="text-[11px] text-white/65">Browse vacancies, negotiate contract, and start with existing roster.</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'CLUB_SETUP':
        return (
          <div className="space-y-4">
            {commonSubHeader('Create Club Setup')}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass-panel rounded-lg p-4 border border-primary/30 space-y-3">
                {(['name', 'city', 'nation'] as const).map((field) => (
                  <label key={field} className="block text-sm">
                    <div className="font-bold uppercase text-xs mb-1">{field}</div>
                    <input
                      value={clubSetup[field]}
                      onChange={(e) => setClubSetup((prev) => ({ ...prev, [field]: e.target.value }))}
                      className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </label>
                ))}
                <div>
                  <div className="font-bold uppercase text-xs mb-1">Emblem</div>
                  <div className="grid grid-cols-2 gap-2">
                    {emblemOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => setClubSetup((prev) => ({ ...prev, emblem: option }))}
                        className={`px-3 py-2 rounded-lg border text-xs font-bold ${clubSetup.emblem === option ? 'border-primary bg-primary/20' : 'border-white/20 bg-slate-900/40'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="glass-panel rounded-lg p-4 border border-secondary/30">
                  <h3 className="font-black mb-2">Starter Sponsorship Offers</h3>
                  {sponsorCards.slice(0, 2).map((s) => (
                    <div key={s.name} className="bg-slate-800/60 border border-white/10 rounded-lg p-2 mb-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-primary/30 flex items-center justify-center font-black text-xs">{s.logo}</div>
                      <div className="text-xs"><div className="font-bold">{s.name}</div><div className="text-white/70">{s.deal}</div></div>
                    </div>
                  ))}
                </div>
                <div className="glass-panel rounded-lg p-4 border border-primary/30">
                  <h3 className="font-black mb-2">Sign 2 Free Teen Prospects</h3>
                  {[1, 2].map((idx) => (
                    <div key={idx} className="bg-slate-800/60 border border-white/10 rounded-lg p-2 mb-2 flex items-center gap-2">
                      <img src={miaPhiriAthleteImage} alt="Teen prospect" className="w-9 h-9 rounded object-cover" />
                      <div className="text-xs"><div className="font-bold">Teen Prospect #{idx}</div><div className="text-white/70">Potential 82-90</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setManagerMode('OWNER');
                setActiveSubPage(null);
              }}
              className="px-4 py-2 rounded-lg bg-primary/35 font-bold"
            >
              Confirm Club Creation
            </button>
          </div>
        );
      case 'TEAM_OPERATIONS':
        return (
          <div className="space-y-4">
            {commonSubHeader('Team Operations')}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {[
                ['Invest Facilities', 'Upgrade pool, gym, recovery labs'],
                ['Invest Players', 'Contracts, wage adjustments, renewals'],
                ['Gear Program', 'Suit tech and equipment quality'],
                ['Train Players', 'Specialized weekly training blocks'],
                ['Scout Talent', 'Global scouting assignments'],
                ['Earnings Control', 'Team and player earning distribution'],
              ].map(([title, text]) => (
                <div key={title} className="glass-panel rounded-lg p-4 border border-white/15">
                  <div className="font-black text-white">{title}</div>
                  <div className="text-xs text-white/70 mt-1">{text}</div>
                </div>
              ))}
            </div>
            {managerMode === 'OWNER' && (
              <button
                onClick={() => {
                  setManagerMode('HIRED');
                  setActiveSubPage('START_PATH');
                }}
                className="px-4 py-2 rounded-lg bg-red-500/30 font-bold"
              >
                Sell Team & Get Hired
              </button>
            )}
          </div>
        );
      case 'CLUB_COMPETITIONS':
        return (
          <div className="space-y-4">
            {commonSubHeader('Club Competitions')}
            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {competitionCards.map((item) => (
                  <div key={item.title} className="glass-panel rounded-lg p-4 border border-white/15">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="text-sm font-black text-white">{item.title}</div>
                      <span className="text-[10px] px-2 py-1 rounded bg-primary/25 border border-primary/40 uppercase font-black">{item.mode}</span>
                    </div>
                    <div className="space-y-1 text-xs text-white/75 mb-3">
                      <div className="flex justify-between"><span>Entry</span><span>{item.entry}</span></div>
                      <div className="flex justify-between"><span>Reward</span><span>{item.reward}</span></div>
                      <div className="flex justify-between"><span>Schedule</span><span>{item.schedule}</span></div>
                      <div className="flex justify-between"><span>Pool</span><span>{item.pool}</span></div>
                    </div>
                    <button onClick={onLaunchArenaRace} className="px-3 py-1 rounded bg-primary/35 text-xs font-black uppercase">
                      Enter Race
                    </button>
                  </div>
                ))}
              </div>
              <div className="glass-panel rounded-lg p-4 border border-secondary/30">
                <h3 className="font-black mb-2 text-white">Competition Rotation</h3>
                <div className="space-y-2 text-xs text-white/80">
                  <div className="bg-slate-800/60 border border-white/10 rounded p-2">Daily: 2 P2P races + 1 AI tour available</div>
                  <div className="bg-slate-800/60 border border-white/10 rounded p-2">Weekly objective: earn 220 points to unlock elite tier</div>
                  <div className="bg-slate-800/60 border border-white/10 rounded p-2">Season reward booster active for National League matches</div>
                </div>
                <button onClick={onLaunchArenaRace} className="mt-3 w-full px-3 py-2 rounded bg-secondary/35 text-xs font-black uppercase">Enter Featured Race</button>
              </div>
            </div>
          </div>
        );
      case 'STAFF_MANAGEMENT':
        return (
          <div className="space-y-4">
            {commonSubHeader('Staff Management')}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="glass-panel rounded-lg p-4 border border-primary/20">
                <h3 className="font-black mb-2">Available Mentors</h3>
                {['Sprint Mentor • 120,000', 'Technique Mentor • 95,000', 'Endurance Mentor • 110,000'].map((s) => (
                  <div key={s} className="bg-slate-800/60 border border-white/10 rounded-lg p-2 mb-2 flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2"><img src={miaPhiriAthleteImage} className="w-9 h-9 rounded object-cover" /><span className="text-xs font-bold">{s}</span></div>
                    <button className="text-xs bg-primary/30 px-2 py-1 rounded font-black">Hire</button>
                  </div>
                ))}
              </div>
              <div className="glass-panel rounded-lg p-4 border border-secondary/20">
                <h3 className="font-black mb-2">Current Staff</h3>
                {longTermStaff.map((c) => (
                  <div key={c.name} className="bg-slate-800/60 border border-white/10 rounded-lg p-3 mb-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img src={miaPhiriAthleteImage} className="w-10 h-10 rounded object-cover" />
                        <div className="text-xs">
                          <div className="font-bold">{c.name}</div>
                          <div className="text-white/70">{c.role}</div>
                        </div>
                      </div>
                      <button className="text-xs bg-red-500/30 px-2 py-1 rounded font-black">Release</button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 text-[11px] text-white/75">
                      <div>Age: <span className="font-bold text-white">{c.age}</span></div>
                      <div>Experience: <span className="font-bold text-white">{c.experience}</span></div>
                      <div>Contract Left: <span className="font-bold text-white">{c.contract}</span></div>
                      <div className="col-span-2">Advantage: <span className="font-bold text-secondary-fixed">{c.advantage}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'PLAYER_MANAGEMENT':
        return (
          <div className="space-y-4">
            {commonSubHeader('Player Management')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ClubMembers.map((player) => (
                <div key={player.id} className="glass-panel rounded-lg p-3 border border-white/15">
                  <div className="flex items-center gap-3">
                    <img src={miaPhiriAthleteImage} alt={player.name} className="w-14 h-14 rounded object-cover" />
                    <div className="min-w-0">
                      <div className="font-black text-white truncate">{player.name}</div>
                      <div className="text-xs text-white/70">{player.nationality} • {player.specialty}</div>
                      <div className="text-xs text-white/70">Wage: {player.wage}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs bg-amber-500/25 px-2 py-1 rounded font-black">Renew</button>
                    <button className="text-xs bg-red-500/30 px-2 py-1 rounded font-black">Transfer/Fire</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'SPONSORS':
        return (
          <div className="space-y-4">
            {commonSubHeader('Sponsors & Partners')}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {detailedSponsorOffers.map((s) => (
                <div key={s.name} className="glass-panel rounded-lg p-4 border border-white/15">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded bg-primary/30 flex items-center justify-center font-black">{s.logo}</div>
                    <div className="font-bold">{s.name}</div>
                    </div>
                    <div className="text-[10px] px-2 py-1 rounded bg-secondary/20 border border-secondary/40 font-black uppercase">{s.status}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/75 mb-2">
                    <div>Years: <span className="text-white font-bold">{s.years}</span></div>
                    <div>Value: <span className="text-white font-bold">{s.value}</span></div>
                  </div>
                  <div className="text-[11px] text-white/90 font-bold mb-1">Targets</div>
                  <ul className="space-y-1 mb-2 list-disc ml-4 text-[11px] text-white/75">
                    {s.targets.map((target) => (
                      <li key={target}>{target}</li>
                    ))}
                  </ul>
                  <div className="text-[11px] p-2 rounded bg-slate-900/55 border border-white/10 text-white/80">Dynamic term: {s.dynamicTerms}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'UPCOMING_EVENTS':
        return (
          <div className="space-y-4">
            {commonSubHeader('Upcoming Events')}
            <div className="glass-panel rounded-lg p-4 border border-white/15 space-y-2">
              {['Regional Meet - Week 2', 'National Championship - Week 4', 'World Qualifier - Week 8'].map((event) => (
                <div key={event} className="bg-slate-800/60 border border-white/10 rounded-lg p-3 flex justify-between items-center">
                  <div className="font-bold text-sm">{event}</div>
                  <button className="text-xs bg-primary/30 px-3 py-1 rounded font-black">Enter</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'LEAGUES_TOURNAMENTS':
        return (
          <div className="space-y-4">
            {commonSubHeader('Leagues & Tournaments')}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {['National League • Rank 6', 'Regional Cup • Semifinal', 'Elite Invitational • Qualifier'].map((league) => (
                <div key={league} className="glass-panel rounded-lg p-4 border border-white/15">
                  <div className="font-bold text-sm">{league}</div>
                  <div className="text-xs text-white/70 mt-1">Entry points and rewards tracked</div>
                  <button className="text-xs bg-primary/30 px-3 py-1 rounded font-black mt-3">Compete</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'SCOUTING':
        return (
          <div className="space-y-4">
            {commonSubHeader('Scouting Market')}
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-3">
              <div className="glass-panel rounded-lg p-4 border border-white/15">
                <div className="font-black mb-2">Filters</div>
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-800/60 rounded p-2">Age: U18-U21</div>
                  <div className="bg-slate-800/60 rounded p-2">Region: Africa/Europe</div>
                  <div className="bg-slate-800/60 rounded p-2">Stroke: Freestyle</div>
                </div>
                <button className="mt-3 w-full bg-primary/35 rounded-lg py-2 font-black text-xs">Hire Scout</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Sophia Chen 91', 'Marta Nkomo 89', 'Irene Kole 88', 'Aya Khan 90', 'Saran Bhean 91', 'Prilia Karei 92'].map((p) => (
                  <div key={p} className="glass-panel rounded-lg p-3 border border-primary/20">
                    <img src={miaPhiriAthleteImage} className="w-full h-16 rounded object-cover mb-2" />
                    <div className="text-xs font-black">{p}</div>
                    <button className="mt-2 text-xs bg-secondary/30 px-2 py-1 rounded font-black">Shortlist</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'FUNDING':
        return (
          <div className="space-y-4">
            {commonSubHeader('Funding & Finance')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="glass-panel rounded-lg p-4 border border-yellow-500/30">
                <h3 className="font-black mb-2">Club Earnings</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Sponsorship</span><span className="font-black text-emerald-300">+85,000</span></div>
                  <div className="flex justify-between"><span>Prize Winnings</span><span className="font-black text-emerald-300">+42,000</span></div>
                  <div className="flex justify-between"><span>Ticket/Media</span><span className="font-black text-emerald-300">+18,000</span></div>
                </div>
              </div>
              <div className="glass-panel rounded-lg p-4 border border-red-500/30">
                <h3 className="font-black mb-2">Team & Player Outgoings</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Player Wages</span><span className="font-black text-red-300">-39,000</span></div>
                  <div className="flex justify-between"><span>Staff Wages</span><span className="font-black text-red-300">-14,000</span></div>
                  <div className="flex justify-between"><span>Facilities</span><span className="font-black text-red-300">-8,000</span></div>
                </div>
                <button className="mt-3 px-3 py-1 bg-primary/30 rounded text-xs font-black">Source New Funding</button>
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
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg p-5 border border-cyan-500/30">
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4 items-center">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">{clubName}</h2>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                    <div>Founded: Jan 15, 2024</div>
                    <div>National Rank: #14</div>
                    <div>Team Budget: 450,000 Coins</div>
                    <div>Manager Mode: {managerMode ?? 'NEW / RESET'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sponsorCards.map((s) => (
                    <div key={s.name} className="bg-slate-900/50 rounded-lg p-2 text-center border border-white/10">
                      <div className="w-8 h-8 mx-auto rounded bg-primary/30 flex items-center justify-center font-black text-xs">{s.logo}</div>
                      <div className="text-[10px] mt-1 font-bold truncate">{s.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {managementRoutes.map((route) => (
                <button key={route.key} onClick={() => setActiveSubPage(route.key)} className="text-left glass-panel rounded-lg p-4 border border-white/15 hover:border-primary/45 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-primary-fixed">{route.icon}</span>
                    <div className="font-black text-white text-base">{route.title}</div>
                  </div>
                  <div className="text-xs text-white/70">{route.description}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 'FACILITIES':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['Olympic Pool Lv3', 'Training Gym Lv2', 'Recovery Lab Lv1', 'Nutrition Center Lv2'].map((f) => (
              <div key={f} className="glass-panel rounded-lg p-4 border border-white/15">
                <div className="font-black">{f}</div>
                <div className="text-xs text-white/70 mt-1">Investment needed for next upgrade</div>
                <button className="text-xs bg-primary/30 px-3 py-1 rounded font-black mt-2">Invest</button>
              </div>
            ))}
          </div>
        );
      case 'ROSTER':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ClubMembers.map((member) => (
              <div key={member.id} className="glass-panel rounded-lg p-3 border border-white/15">
                <div className="flex items-center gap-3">
                  <img src={miaPhiriAthleteImage} alt={member.name} className="w-14 h-14 rounded object-cover" />
                  <div className="min-w-0">
                    <div className="font-black truncate">{member.name}</div>
                    <div className="text-xs text-white/70">{member.nationality} • {member.specialty}</div>
                    <div className="text-xs text-white/70">Contract wage: {member.wage}</div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <span>Level {member.level}</span>
                  <span>Relay #{member.relayPosition ?? '-'}</span>
                </div>
              </div>
            ))}
          </div>
        );
      case 'RELAY':
        return (
          <div className="glass-panel rounded-lg p-4 border border-white/15 space-y-2">
            {relayOrder.map((id, idx) => (
              <div key={id} className="bg-slate-700/50 rounded p-2 flex items-center gap-2">
                <img src={miaPhiriAthleteImage} className="w-8 h-8 rounded object-cover" />
                <div className="text-sm">Leg {idx + 1}: {ClubMembers.find((m) => m.id === id)?.name}</div>
              </div>
            ))}
          </div>
        );
      case 'STAFF':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {coachCards.map((c) => (
              <div key={c.name} className="glass-panel rounded-lg p-3 border border-white/15 flex items-center gap-3">
                <img src={miaPhiriAthleteImage} className="w-12 h-12 rounded object-cover" />
                <div>
                  <div className="font-black text-sm">{c.name}</div>
                  <div className="text-xs text-white/70">{c.role} • {c.level}</div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'BRANDING':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="glass-panel rounded-lg p-4 border border-white/15">
              <h3 className="font-black mb-2">Club Emblem</h3>
              <div className="grid grid-cols-2 gap-2">
                {emblemOptions.map((e) => <div key={e} className="bg-slate-800/60 rounded p-2 text-xs font-bold">{e}</div>)}
              </div>
            </div>
            <div className="glass-panel rounded-lg p-4 border border-white/15">
              <h3 className="font-black mb-2">Sponsor Logos</h3>
              <div className="flex gap-2">
                {sponsorCards.map((s) => <div key={s.logo} className="w-10 h-10 rounded bg-primary/30 flex items-center justify-center font-black">{s.logo}</div>)}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-8 space-y-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Club HQ</h1>
          <p className="text-slate-400">Manage your swimming club and dynasty</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveSubPage(null);
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold uppercase text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              <span className="material-symbols-outlined">{tab.icon}</span>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div>{activeSubPage ? renderSubPage() : renderTab()}</div>
      </div>
    </div>
  );
};

export default ClubScreen;
