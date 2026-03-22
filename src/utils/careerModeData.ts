import type { ICareerEvent } from '../types'

export type CareerStage = {
  id: string
  order: number
  name: string
  tierLabel: string
  summary: string
  pressure: string
  focus: string
  status: 'completed' | 'current' | 'locked'
  growthReward: string
}

export type WeeklyFocus = {
  id: string
  title: string
  effect: string
  risk: string
  gain: string
}

export type PlayerCareerMetric = {
  label: string
  value: string
  accent: string
  hint: string
}

export type SeasonObjective = {
  id: string
  title: string
  progress: number
  targetLabel: string
  reward: string
  pressure: string
}

export type RivalBeat = {
  id: string
  rival: string
  title: string
  note: string
  intensity: 'stable' | 'heated' | 'peak'
}

export type ClubGrowthMetric = {
  label: string
  value: string
  accent: string
  hint: string
}

export type ClubPhilosophy = {
  id: string
  title: string
  doctrine: string
  upside: string
  tradeoff: string
}

export type ClubProject = {
  id: string
  title: string
  owner: string
  eta: string
  impact: string
  status: 'ahead' | 'tracking' | 'risk'
}

export type StaffUnit = {
  id: string
  name: string
  role: string
  boost: string
  chemistry: string
}

export const PLAYER_CAREER_METRICS: PlayerCareerMetric[] = [
  { label: 'Readiness', value: '91%', accent: '#36C690', hint: 'Perfect lane-feel window after two disciplined recovery days.' },
  { label: 'Coach Trust', value: '87', accent: '#81ECFF', hint: 'Unlocks tactical freedom and first-choice event selection.' },
  { label: 'Selection Odds', value: 'Top 3', accent: '#D4A843', hint: 'Currently seeded inside the national relay conversation.' },
  { label: 'Momentum', value: '+14%', accent: '#F87171', hint: 'Recent PB streak is amplifying sponsor and media heat.' },
]

export const PLAYER_CAREER_STAGES: CareerStage[] = [
  {
    id: 'school',
    order: 1,
    name: 'School Circuit',
    tierLabel: 'Foundation',
    summary: 'District invitationals, school finals, and the first pressure swims that define your identity.',
    pressure: 'Race clean under noise and build a repeatable stroke foundation.',
    focus: 'Starts, turns, and confidence.',
    status: 'completed',
    growthReward: '+Technique floor + rival origin',
  },
  {
    id: 'club',
    order: 2,
    name: 'Local Club Circuit',
    tierLabel: 'Structure',
    summary: 'Club invitationals and weekend time trials where volume meets discipline.',
    pressure: 'Choose between sprint upside and all-around event flexibility.',
    focus: 'Training consistency and event identity.',
    status: 'completed',
    growthReward: '+Readiness ceiling + sponsor visibility',
  },
  {
    id: 'regional',
    order: 3,
    name: 'Regional Age-Group',
    tierLabel: 'Climb',
    summary: 'The first real ladder: seeding pressure, relay selection, and ranking visibility.',
    pressure: 'Survive travel fatigue while proving you belong at finals level.',
    focus: 'Heats-to-finals management and relay trust.',
    status: 'current',
    growthReward: '+Ranking entry + federation attention',
  },
  {
    id: 'junior-elite',
    order: 4,
    name: 'Junior Elite',
    tierLabel: 'Prospect',
    summary: 'Junior nationals and showcase meets where the game starts remembering your name.',
    pressure: 'Specialize without burning out.',
    focus: 'Taper timing and event load discipline.',
    status: 'locked',
    growthReward: '+Media + gear offers + rival escalation',
  },
  {
    id: 'national',
    order: 5,
    name: 'National Pathway',
    tierLabel: 'Selection',
    summary: 'National qualifiers, camp invites, and ruthless cut standards.',
    pressure: 'Time standards matter more than vibes.',
    focus: 'Peak on command.',
    status: 'locked',
    growthReward: '+National team access + bigger sponsorships',
  },
  {
    id: 'high-performance',
    order: 6,
    name: 'High Performance Squad',
    tierLabel: 'Elite',
    summary: 'College or pro-club level intensity where every block is optimized.',
    pressure: 'Balance heavy training, brand commitments, and race freshness.',
    focus: 'Load management and race composure.',
    status: 'locked',
    growthReward: '+Staff specialists + advanced training plans',
  },
  {
    id: 'selection',
    order: 7,
    name: 'International Selection',
    tierLabel: 'Trials',
    summary: 'One-chance swims, relay politics, and ruthless lane assignments.',
    pressure: 'Everything you built gets judged in one session.',
    focus: 'Nerves, execution, and proving range.',
    status: 'locked',
    growthReward: '+National colors + relay anchor role',
  },
  {
    id: 'global',
    order: 8,
    name: 'Global Stage',
    tierLabel: 'Legacy',
    summary: 'Continental and world-stage finals where legacy, records, and immortality begin.',
    pressure: 'Peak against the fastest field on earth.',
    focus: 'Records, podiums, and career-defining moments.',
    status: 'locked',
    growthReward: '+Legacy arcs + world ranking chase',
  },
]

export const PLAYER_WEEKLY_FOCUS: WeeklyFocus[] = [
  {
    id: 'sharpness',
    title: 'Race Sharpness Block',
    effect: 'Boost split precision and breakout rhythm for the next championship session.',
    risk: 'Higher fatigue carryover if you also enter relay duty.',
    gain: '+6% finals execution',
  },
  {
    id: 'volume',
    title: 'Heavy Load Camp',
    effect: 'Accelerate long-term stamina and unlock a deeper endurance ceiling.',
    risk: 'Selection odds dip this week unless you protect taper timing.',
    gain: '+4 long-term stamina cap',
  },
  {
    id: 'technique',
    title: 'Technique Rebuild',
    effect: 'Fix turn leakage and underwater discipline before tougher fields arrive.',
    risk: 'Short-term race pace feels flat until the next peak cycle.',
    gain: '+5 turn consistency',
  },
]

export const PLAYER_SEASON_OBJECTIVES: SeasonObjective[] = [
  {
    id: 'cut',
    title: 'Hit the National Trials B Cut in 100m Freestyle',
    progress: 92,
    targetLabel: '48.94 / 48.70 target',
    reward: 'Trials invite + 12,000 XP',
    pressure: 'One clean back-half split finishes the job.',
  },
  {
    id: 'relay',
    title: 'Secure anchor spot on the regional relay quartet',
    progress: 74,
    targetLabel: 'Coach trust 87 / 95 target',
    reward: 'Relay chemistry bonus + sponsor lift',
    pressure: 'Needs another clutch finish and no false-start scares.',
  },
  {
    id: 'brand',
    title: 'Convert surge in form into a premium gear sponsorship',
    progress: 58,
    targetLabel: '2 podiums / 4 target',
    reward: 'Custom suit set + recovery bonus',
    pressure: 'Media visibility is rising; now cash it in.',
  },
]

export const PLAYER_RIVAL_BEATS: RivalBeat[] = [
  {
    id: 'rv1',
    rival: 'Amara Dube',
    title: 'Regional sprint nemesis',
    note: 'Beaten you out of the blocks twice, but your back-half speed is now trending better.',
    intensity: 'heated',
  },
  {
    id: 'rv2',
    rival: 'Mina Okafor',
    title: 'Relay anchor challenger',
    note: 'Coach trusts her starts more, but your underwater splits are climbing fast.',
    intensity: 'stable',
  },
  {
    id: 'rv3',
    rival: 'Jules Laurent',
    title: 'Future junior-elite benchmark',
    note: 'Not in your lane yet — exactly the kind of ghost target that keeps the grind meaningful.',
    intensity: 'peak',
  },
]

export const PLAYER_CAREER_EVENTS: ICareerEvent[] = [
  {
    id: 'pc_01',
    index: 0,
    tier: 1,
    name: 'District 50m Freestyle Final',
    description: 'Your first big lane. Prove you can handle noise and close fast.',
    distance: 50,
    stroke: 'FREESTYLE',
    opponents: ['A. Dube', 'L. Nkomo', 'S. Banda'],
    minDifficulty: 1,
    difficulty: 2,
    rewards: { xp: 90, currency: 300, unlocksNextEvent: true },
  },
  {
    id: 'pc_02',
    index: 1,
    tier: 1,
    name: 'School Championship 100m Freestyle',
    description: 'Win your lane or hit the qualifying split to earn your club move.',
    distance: 100,
    stroke: 'FREESTYLE',
    opponents: ['A. Dube', 'J. Phiri', 'R. Evans'],
    minDifficulty: 1,
    difficulty: 3,
    rewards: { xp: 120, currency: 420, unlocksNextEvent: true },
  },
  {
    id: 'pc_03',
    index: 2,
    tier: 2,
    name: 'Club Time Trial Under Lights',
    description: 'Small venue, huge pressure: coaches only care about your split discipline.',
    distance: 100,
    stroke: 'FREESTYLE',
    opponents: ['M. Okafor', 'Z. Cole', 'T. Mensah'],
    minDifficulty: 2,
    difficulty: 4,
    rewards: { xp: 150, currency: 550, unlocksNextEvent: true },
  },
  {
    id: 'pc_04',
    index: 3,
    tier: 3,
    name: 'Regional Heats — 100m Freestyle',
    description: 'Qualify cleanly in the morning, then survive the reset before finals.',
    distance: 100,
    stroke: 'FREESTYLE',
    opponents: ['A. Dube', 'M. Okafor', 'J. Laurent'],
    minDifficulty: 3,
    difficulty: 5,
    rewards: { xp: 210, currency: 760, unlocksNextEvent: true },
  },
  {
    id: 'pc_05',
    index: 4,
    tier: 3,
    name: 'Regional Finals — Relay Anchor Trial',
    description: 'One race decides whether you become the closer everyone trusts.',
    distance: 100,
    stroke: 'FREESTYLE',
    opponents: ['M. Okafor', 'A. Dube', 'K. Hart'],
    minDifficulty: 3,
    difficulty: 6,
    rewards: { xp: 260, currency: 900, cosmetics: ['anchor_cap'], unlocksNextEvent: true },
  },
  {
    id: 'pc_06',
    index: 5,
    tier: 4,
    name: 'Junior Elite Showcase',
    description: 'First real media meet. Hit the cut and your career accelerates.',
    distance: 200,
    stroke: 'FREESTYLE',
    opponents: ['J. Laurent', 'Y. Petrov', 'N. Silva'],
    minDifficulty: 4,
    difficulty: 7,
    rewards: { xp: 320, currency: 1100, unlocksNextEvent: true },
  },
  {
    id: 'pc_07',
    index: 6,
    tier: 5,
    name: 'National Championships B Final',
    description: 'Maybe not the medal race yet, but it is the swim that gets selectors talking.',
    distance: 100,
    stroke: 'FREESTYLE',
    opponents: ['D. Reyes', 'K. Inoue', 'M. Okafor'],
    minDifficulty: 5,
    difficulty: 8,
    rewards: { xp: 420, currency: 1500, unlocksNextEvent: true },
  },
  {
    id: 'pc_08',
    index: 7,
    tier: 7,
    name: 'National Trials Night Final',
    description: 'The one-swim selection gamble: either touch first enough, or watch the roster close.',
    distance: 100,
    stroke: 'FREESTYLE',
    opponents: ['D. Reyes', 'K. Inoue', 'L. Maric'],
    minDifficulty: 6,
    difficulty: 9,
    rewards: { xp: 600, currency: 2200, cosmetics: ['national_blade_suit'], unlocksNextEvent: true },
  },
  {
    id: 'pc_09',
    index: 8,
    tier: 8,
    name: 'World Championship Semi-Final',
    description: 'No easy lanes now. Peak, or disappear from the story.',
    distance: 100,
    stroke: 'FREESTYLE',
    opponents: ['L. Maric', 'D. Reyes', 'H. Carter'],
    minDifficulty: 7,
    difficulty: 10,
    rewards: { xp: 900, currency: 3500, cosmetics: ['legacy_finisher_fx'], unlocksNextEvent: false },
  },
]

export const CLUB_GROWTH_METRICS: ClubGrowthMetric[] = [
  { label: 'Club Prestige', value: '74', accent: '#D4A843', hint: 'High enough to attract premium junior prospects.' },
  { label: 'Academy Output', value: '3 rising', accent: '#36C690', hint: 'Three swimmers are trending toward senior-squad promotion.' },
  { label: 'Relay Synergy', value: '88%', accent: '#81ECFF', hint: 'Your medley group is nearly stable enough for national qualification.' },
  { label: 'Cash Runway', value: '17 weeks', accent: '#F87171', hint: 'Good, but another facility upgrade will force smarter scheduling.' },
]

export const CLUB_PHILOSOPHIES: ClubPhilosophy[] = [
  {
    id: 'sprint-lab',
    title: 'Sprint Lab',
    doctrine: 'Build explosive starters, dominant turns, and brutal 50/100m closers.',
    upside: '+Blocks, turns, and sponsor appeal for televised events.',
    tradeoff: 'Distance swimmers develop slower and burn out faster under overload.',
  },
  {
    id: 'relay-factory',
    title: 'Relay Factory',
    doctrine: 'Recruit specialists that become greater together than alone.',
    upside: '+Chemistry, relay confidence, and club prestige spikes.',
    tradeoff: 'Individual superstar ceilings arrive more slowly.',
  },
  {
    id: 'endurance-engine',
    title: 'Endurance Engine',
    doctrine: 'Outlast everyone through aerobic volume and ruthless consistency.',
    upside: '+Long-term stamina curves and depth across the roster.',
    tradeoff: 'Slow starts make headline results harder early in the save.',
  },
]

export const CLUB_STAFF_UNITS: StaffUnit[] = [
  {
    id: 'staff_1',
    name: 'Coach Nia Tembo',
    role: 'Head Coach',
    boost: '+6% clutch execution in finals sessions',
    chemistry: 'Connects instantly with sprinters and confident young leaders.',
  },
  {
    id: 'staff_2',
    name: 'Dr. Elias Mensah',
    role: 'Performance Scientist',
    boost: '+8 readiness retention during compressed calendars',
    chemistry: 'Best when the club is balancing heavy growth with careful tapering.',
  },
  {
    id: 'staff_3',
    name: 'Marta Volkov',
    role: 'Academy Director',
    boost: '+10% chance of prospect over-performance',
    chemistry: 'Pairs perfectly with youth-heavy club saves.',
  },
]

export const CLUB_PROJECTS: ClubProject[] = [
  {
    id: 'project_1',
    title: 'National Relay Qualification Push',
    owner: 'Senior Squad',
    eta: '2 meet windows',
    impact: 'Unlocks prestige, sponsor leverage, and bigger meet invites.',
    status: 'ahead',
  },
  {
    id: 'project_2',
    title: 'Under-18 Sprint Academy Buildout',
    owner: 'Academy Staff',
    eta: '5 weeks',
    impact: 'Creates a pipeline of cheap, high-upside 50/100m specialists.',
    status: 'tracking',
  },
  {
    id: 'project_3',
    title: 'Recovery Suite Upgrade',
    owner: 'Operations',
    eta: 'Budget review pending',
    impact: 'Reduces burnout and supports dual-meet weekends.',
    status: 'risk',
  },
]

export const CLUB_ACADEMY_WAVE = [
  {
    name: 'Tapiwa Ncube',
    age: 16,
    profile: 'Explosive flyer with raw turns and fearless racing habits.',
    readiness: 'Promotion watch',
  },
  {
    name: 'Lina Sissoko',
    age: 17,
    profile: 'IM technician whose training scores keep beating her race expectations.',
    readiness: 'Needs race reps',
  },
  {
    name: 'Eva Carter',
    age: 15,
    profile: 'Distance engine with elite recovery traits and a huge long-term ceiling.',
    readiness: 'Future cornerstone',
  },
]

export const CLUB_COMPETITION_CALENDAR = [
  {
    id: 'club_cal_1',
    name: 'Regional Cup Round 6',
    stakes: 'Protect Top 4 prestige points',
    decision: 'Rest stars or secure the bag now?',
  },
  {
    id: 'club_cal_2',
    name: 'National Relay Trials',
    stakes: 'Club-defining exposure and federation respect',
    decision: 'Prioritize chemistry or stack pure speed?',
  },
  {
    id: 'club_cal_3',
    name: 'Sponsor Showcase Night',
    stakes: 'Funding for the recovery suite upgrade',
    decision: 'Send stars for optics or prospects for development?',
  },
]
