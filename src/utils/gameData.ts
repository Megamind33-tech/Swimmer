export type Stroke = 'Freestyle' | 'Butterfly' | 'Backstroke' | 'Breaststroke' | 'IM'

export interface Swimmer {
  id: string
  name: string
  ovr: number
  stroke: Stroke
  country: string
  image?: string
  stats: {
    speed: number
    stamina: number
    technique: number
    turn: number
  }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface MarketListing {
  id: string
  swimmer: Swimmer
  price: number
  timeLeft: string
  trend: 'up' | 'down' | 'stable'
}

export interface ClubEvent {
  id: string
  name: string
  type: string
  time: string
  prize: string
  location: string
}

export interface RosterHighlight {
  id: string
  swimmerId: string
  role: string
  age: number
  weeklyWage: string
  morale: 'High' | 'Steady' | 'Rising'
}

export interface HomeEvent {
  id: string
  name: string
  status: string
  reward: string
  time: string
}

export const USER_DATA = {
  username: 'Megamind',
  level: 32,
  xp: 2267,
  maxXp: 2400,
  currencies: {
    coins: 269939317,
    gems: 4701,
    tokens: 0,
  },
  clubOvr: 113,
}

export const SWIMMERS: Swimmer[] = [
  {
    id: '1',
    name: 'M. Phelps',
    ovr: 117,
    stroke: 'Butterfly',
    country: '🇺🇸',
    image: 'https://cdn.magicpatterns.com/uploads/1GH2axoEyedt1b1AdbeYsJ/f69bd7aa-4d90-481c-9c00-a06d0997952a.png',
    stats: { speed: 118, stamina: 115, technique: 119, turn: 116 },
    rarity: 'legendary',
  },
  {
    id: '2',
    name: 'A. Peaty',
    ovr: 115,
    stroke: 'Breaststroke',
    country: '🇬🇧',
    image: 'https://cdn.magicpatterns.com/uploads/aVy78rzUDhdGWkRAwVkFUp/watermark-removed-6.png',
    stats: { speed: 116, stamina: 112, technique: 118, turn: 110 },
    rarity: 'legendary',
  },
  {
    id: '3',
    name: 'K. Ledecky',
    ovr: 116,
    stroke: 'Freestyle',
    country: '🇺🇸',
    image: 'https://cdn.magicpatterns.com/uploads/dfVB3BXqEa5Ba9FJbw3fiJ/watermark-removed-2.png',
    stats: { speed: 115, stamina: 120, technique: 117, turn: 114 },
    rarity: 'legendary',
  },
  {
    id: '4',
    name: 'S. Marchand',
    ovr: 114,
    stroke: 'IM',
    country: '🇫🇷',
    image: 'https://cdn.magicpatterns.com/uploads/9h8SigoRrrB1hoF2hjcbdC/watermark-removed-8.png',
    stats: { speed: 113, stamina: 116, technique: 115, turn: 118 },
    rarity: 'epic',
  },
  {
    id: '5',
    name: 'K. Chalmers',
    ovr: 112,
    stroke: 'Freestyle',
    country: '🇦🇺',
    stats: { speed: 117, stamina: 108, technique: 110, turn: 112 },
    rarity: 'epic',
  },
]

export const MARKET_LISTINGS: MarketListing[] = [
  { id: 'm1', swimmer: SWIMMERS[3], price: 45000000, timeLeft: '2h 15m', trend: 'up' },
  { id: 'm2', swimmer: SWIMMERS[4], price: 32000000, timeLeft: '45m', trend: 'down' },
  { id: 'm3', swimmer: { ...SWIMMERS[1], ovr: 110, rarity: 'epic' }, price: 28500000, timeLeft: '1h 30m', trend: 'stable' },
]

export const ACHIEVEMENTS = [
  { id: 'a1', title: 'Speed Demon', desc: 'Win 50m Freestyle 100 times', progress: 85, max: 100, reward: '500 Gems' },
  { id: 'a2', title: 'Endurance Master', desc: 'Complete 10 Marathon Swims', progress: 4, max: 10, reward: 'Epic Pack' },
  { id: 'a3', title: 'Market Mogul', desc: 'Earn 100M coins from transfers', progress: 100, max: 100, reward: 'Title: Trader', completed: true },
]

export const HOME_EVENTS: HomeEvent[] = [
  { id: 'h1', name: 'World Sprint Cup', status: 'LIVE NOW', reward: '750 XP + Elite Pack', time: 'Ends in 2h' },
  { id: 'h2', name: 'Relay Trials', status: 'UP NEXT', reward: '500 XP + 1 Scout', time: 'Starts in 5h' },
  { id: 'h3', name: 'National League Heat', status: 'REGISTER', reward: 'Club Rep + 40K', time: 'Tomorrow' },
]

export const ROSTER_HIGHLIGHTS: RosterHighlight[] = [
  { id: 'r1', swimmerId: '1', role: 'Captain • Butterfly Lead', age: 28, weeklyWage: '120K / week', morale: 'High' },
  { id: 'r2', swimmerId: '3', role: 'Freestyle Anchor', age: 27, weeklyWage: '110K / week', morale: 'Rising' },
  { id: 'r3', swimmerId: '4', role: 'IM Specialist', age: 22, weeklyWage: '74K / week', morale: 'Steady' },
]

export const CLUB_OBJECTIVES = [
  'Reach Top 8 in National League',
  'Win one Regional Cup event this week',
  'Maintain team morale above 85%',
]

export const CLUB_UPCOMING_EVENTS: ClubEvent[] = [
  { id: 'c1', name: 'Regional Cup Finals', type: 'CLUB DUTY', time: 'FRI 19:00', prize: '180K + 900 XP', location: 'Cape Town Aquatic Center' },
  { id: 'c2', name: 'Pro Relay Showcase', type: 'SPONSOR EVENT', time: 'SAT 13:30', prize: 'Brand Rep + 75K', location: 'Lusaka National Pool' },
  { id: 'c3', name: 'National League Heat', type: 'LEAGUE', time: 'SUN 16:00', prize: 'League Points', location: 'Johannesburg Arena' },
]

export const CAREER_TRACK = [
  { id: 'ct1', week: 'Week 2', event: 'Regional Meet', stage: 'Club Duty', state: 'Completed' },
  { id: 'ct2', week: 'Week 4', event: 'National Championship', stage: 'National Duty', state: 'Current' },
  { id: 'ct3', week: 'Week 8', event: 'World Qualifier', stage: 'National Duty', state: 'Upcoming' },
]

export interface Sponsor {
  id: string
  name: string
  logo: string
  tier: 'Title' | 'Gold' | 'Silver'
  value: string
  category: string
  bonus: string
}

export const CAREER_SPONSORS: Sponsor[] = [
  { id: 'cs1', name: 'Speedo', logo: '🌊', tier: 'Title', value: '120K/yr', category: 'Apparel', bonus: '+5% XP on race wins' },
  { id: 'cs2', name: 'TYR Sport', logo: '⚡', tier: 'Gold', value: '60K/yr', category: 'Equipment', bonus: '+3% stamina recovery' },
  { id: 'cs3', name: 'Nike', logo: '✔', tier: 'Silver', value: '35K/yr', category: 'Footwear', bonus: '+2% split bonus' },
]

export const CLUB_SPONSORS: Sponsor[] = [
  { id: 'cls1', name: 'Adidas', logo: '🔶', tier: 'Title', value: '250K/yr', category: 'Apparel', bonus: '+8% team OVR boost' },
  { id: 'cls2', name: 'Red Bull', logo: '🐂', tier: 'Gold', value: '100K/yr', category: 'Energy', bonus: '+5% race intensity' },
  { id: 'cls3', name: 'Omega', logo: '⌚', tier: 'Gold', value: '80K/yr', category: 'Timekeeping', bonus: 'Official timing partner' },
  { id: 'cls4', name: 'Gatorade', logo: '🥤', tier: 'Silver', value: '40K/yr', category: 'Nutrition', bonus: '+3% endurance training' },
]

export const PLAYER_SPONSORS: Sponsor[] = [
  { id: 'ps1', name: 'Arena', logo: '🏊', tier: 'Title', value: '90K/yr', category: 'Swimwear', bonus: '+6% technique rating' },
  { id: 'ps2', name: 'Finis', logo: '🌀', tier: 'Gold', value: '45K/yr', category: 'Training Gear', bonus: '+4% drill efficiency' },
  { id: 'ps3', name: 'Garmin', logo: '📡', tier: 'Silver', value: '25K/yr', category: 'Wearables', bonus: 'Live biometric tracking' },
]

// ── Career Mode: Stage Progression ──────────────────────────────────────────

export type CareerStageId =
  | 'CLUB'
  | 'JUNIOR_REGIONAL'
  | 'JUNIOR_NATIONAL'
  | 'SENIOR_PRO'
  | 'OLYMPIC_TRIALS'
  | 'WORLD_CHAMPS'
  | 'OLYMPICS'
  | 'ISL_PRO'

export interface CareerStage {
  id: CareerStageId
  label: string
  subtitle: string
  ageRange: string
  realWorldEquivalent: string
  qualifyingTime: string       // e.g. "47.50 (100m Free)"
  qualifyingLabel: string      // label for the time standard
  gate: string                 // what the player must achieve to unlock
  state: 'locked' | 'available' | 'current' | 'completed'
  tier: 'grassroots' | 'junior' | 'national' | 'elite' | 'olympic' | 'professional'
  legacyPoints: number         // points awarded on completion
  rewards: string[]
}

export const CAREER_STAGES: CareerStage[] = [
  {
    id: 'CLUB',
    label: 'Club Level',
    subtitle: 'Local Invitational Meets',
    ageRange: '8–13',
    realWorldEquivalent: 'Bronze / Silver Champs',
    qualifyingTime: '58.00',
    qualifyingLabel: '100m Free (qualifying)',
    gate: 'Complete 5 club races',
    state: 'completed',
    tier: 'grassroots',
    legacyPoints: 50,
    rewards: ['Home Pool Unlocked', '+10 Power', '+10 Stamina'],
  },
  {
    id: 'JUNIOR_REGIONAL',
    label: 'Junior Regional',
    subtitle: 'Junior Olympics & Zones',
    ageRange: '12–16',
    realWorldEquivalent: 'USA Swimming Zones / JOs',
    qualifyingTime: '53.20',
    qualifyingLabel: '100m Free (JO standard)',
    gate: 'Post sub-53.20 in 100m Free',
    state: 'completed',
    tier: 'junior',
    legacyPoints: 150,
    rewards: ['Regional Medal Rack', 'First Sponsor Offer', '+15 Technique'],
  },
  {
    id: 'JUNIOR_NATIONAL',
    label: 'Junior Nationals',
    subtitle: 'Speedo Junior Nationals',
    ageRange: '14–18',
    realWorldEquivalent: 'USA Swimming Junior Nationals',
    qualifyingTime: '49.80',
    qualifyingLabel: '100m Free (Junior Nationals cut)',
    gate: 'Finish top-12 at a Futures meet',
    state: 'current',
    tier: 'junior',
    legacyPoints: 300,
    rewards: ['National Kit', 'Elite Training Facility', 'TYR Sponsorship'],
  },
  {
    id: 'SENIOR_PRO',
    label: 'Pro Swim Series',
    subtitle: 'TYR Pro Swim Series',
    ageRange: '16–24',
    realWorldEquivalent: 'Pro Swim Series / US Nationals',
    qualifyingTime: '47.80',
    qualifyingLabel: '100m Free (Senior cut)',
    gate: 'Post sub-49.00 + top-8 at Junior Nationals',
    state: 'available',
    tier: 'national',
    legacyPoints: 600,
    rewards: ['Olympic-size Pool Access', 'Speedo Pro Deal', 'Altitude Camp'],
  },
  {
    id: 'OLYMPIC_TRIALS',
    label: 'Olympic Trials',
    subtitle: 'The Selection Race',
    ageRange: '18–28',
    realWorldEquivalent: 'US Olympic Swimming Trials',
    qualifyingTime: '47.02',
    qualifyingLabel: '100m Free (Trials qualifier)',
    gate: 'Rank top-16 at US Nationals',
    state: 'locked',
    tier: 'elite',
    legacyPoints: 1500,
    rewards: ['Olympic Ring Badge', 'National Anthem Moment', 'Major Endorsement Offer'],
  },
  {
    id: 'WORLD_CHAMPS',
    label: 'World Championships',
    subtitle: 'World Aquatics Championships',
    ageRange: '18–30',
    realWorldEquivalent: 'World Aquatics Championships (Fukuoka / Singapore)',
    qualifyingTime: '47.02',
    qualifyingLabel: '100m Free (A standard / OQT)',
    gate: 'Post OQT A standard',
    state: 'locked',
    tier: 'elite',
    legacyPoints: 2000,
    rewards: ['World Medal', 'Historic Record Plaque', 'Premium Sponsor Tier'],
  },
  {
    id: 'OLYMPICS',
    label: 'Olympic Games',
    subtitle: 'LA28 Summer Olympics',
    ageRange: '18–32',
    realWorldEquivalent: 'LA 2028 Summer Olympic Games',
    qualifyingTime: '47.02',
    qualifyingLabel: '100m Free (LA28 A standard)',
    gate: 'Finish top-2 at Olympic Trials + post A standard',
    state: 'locked',
    tier: 'olympic',
    legacyPoints: 5000,
    rewards: ['Olympic Gold Medal', 'Hall of Fame Nomination', 'Phelps Rival Unlocked'],
  },
  {
    id: 'ISL_PRO',
    label: 'ISL Professional',
    subtitle: 'International Swimming League',
    ageRange: '20–35',
    realWorldEquivalent: 'ISL Season 5 (2026 relaunch)',
    qualifyingTime: '47.50',
    qualifyingLabel: '100m Free (ISL franchise draft)',
    gate: 'Earn Olympic medal or post top-3 at World Champs',
    state: 'locked',
    tier: 'professional',
    legacyPoints: 3000,
    rewards: ['ISL Franchise Jersey', 'Season Prize Pool Share', 'GOAT Title Eligible'],
  },
]

// ── Career Mode: Athlete Attributes ─────────────────────────────────────────

export interface AthleteAttribute {
  id: string
  label: string
  shortLabel: string
  value: number        // 0–100
  max: number
  description: string
  trainingDrill: string
  color: string
}

export const ATHLETE_ATTRIBUTES: AthleteAttribute[] = [
  {
    id: 'power',
    label: 'Stroke Power',
    shortLabel: 'PWR',
    value: 72,
    max: 100,
    description: 'Explosive force per stroke cycle. Dominates sprint events.',
    trainingDrill: 'Resistance Band Sprints',
    color: '#F97316',
  },
  {
    id: 'efficiency',
    label: 'Stroke Efficiency',
    shortLabel: 'EFF',
    value: 68,
    max: 100,
    description: 'Distance per stroke & DPS. Critical for distance events.',
    trainingDrill: 'Catch-Up Drill / DPS Sets',
    color: '#38D6FF',
  },
  {
    id: 'turn',
    label: 'Turn Speed',
    shortLabel: 'TRN',
    value: 65,
    max: 100,
    description: 'Flip turn execution and underwater streamline.',
    trainingDrill: 'Underwater Dolphin Kick Sets',
    color: '#A78BFA',
  },
  {
    id: 'start',
    label: 'Start Reaction',
    shortLabel: 'STR',
    value: 70,
    max: 100,
    description: 'Reaction time and entry angle off the block.',
    trainingDrill: 'Block Start Repetitions',
    color: '#FBBF24',
  },
  {
    id: 'stamina',
    label: 'Stamina',
    shortLabel: 'STA',
    value: 75,
    max: 100,
    description: 'Aerobic capacity and lactate threshold for longer distances.',
    trainingDrill: 'Threshold Pace Sets',
    color: '#34D399',
  },
  {
    id: 'focus',
    label: 'Mental Focus',
    shortLabel: 'FOC',
    value: 62,
    max: 100,
    description: 'Race strategy execution and pressure performance.',
    trainingDrill: 'Visualisation & Race Pace',
    color: '#F472B6',
  },
]

// ── Career Mode: Training Phases (Periodization) ────────────────────────────

export type TrainingPhaseId = 'PREP' | 'COMPETITION' | 'PEAK' | 'RECOVERY'

export interface TrainingPhase {
  id: TrainingPhaseId
  label: string
  emoji: string
  duration: string
  description: string
  volumeLevel: 'Very High' | 'High' | 'Medium' | 'Low'
  intensityLevel: 'Low' | 'Medium' | 'High' | 'Very High'
  attributeBonus: string
  fatigueRate: 'High' | 'Medium' | 'Low' | 'Negative'  // Negative = recovering
  formEffect: string
  current?: boolean
  weekNumber?: number
}

export const TRAINING_PHASES: TrainingPhase[] = [
  {
    id: 'PREP',
    label: 'Preparation',
    emoji: '🏗',
    duration: '8–10 weeks',
    description: 'High-volume aerobic base. Build endurance, refine technique, and lay the fitness foundation.',
    volumeLevel: 'Very High',
    intensityLevel: 'Low',
    attributeBonus: '+8 Stamina, +5 Efficiency',
    fatigueRate: 'High',
    formEffect: 'Form drops short-term, base rises',
    weekNumber: 3,
  },
  {
    id: 'COMPETITION',
    label: 'Competition',
    emoji: '⚡',
    duration: '6–8 weeks',
    description: 'Race-specificity increases. Speed work and event-specific training dominate.',
    volumeLevel: 'High',
    intensityLevel: 'High',
    attributeBonus: '+6 Power, +4 Start',
    fatigueRate: 'Medium',
    formEffect: 'Form climbs steadily',
    current: true,
    weekNumber: 7,
  },
  {
    id: 'PEAK',
    label: 'Peak / Taper',
    emoji: '🎯',
    duration: '10–14 days',
    description: 'Volume drops 40–60%. Intensity stays high. The body supercompensates into peak form.',
    volumeLevel: 'Low',
    intensityLevel: 'Very High',
    attributeBonus: '+10 all stats (temporary)',
    fatigueRate: 'Negative',
    formEffect: 'Peak Form Window opens',
  },
  {
    id: 'RECOVERY',
    label: 'Recovery',
    emoji: '🌊',
    duration: '2–3 weeks',
    description: 'Active recovery, reflection, and preparation for the next macrocycle.',
    volumeLevel: 'Low',
    intensityLevel: 'Low',
    attributeBonus: 'Fatigue cleared',
    fatigueRate: 'Negative',
    formEffect: 'Resets to baseline',
  },
]

// ── Career Mode: Form & Fitness ──────────────────────────────────────────────

export const ATHLETE_FORM = {
  fatigue: 42,         // 0–100, higher = more tired
  form: 71,            // 0–100, current race readiness
  peakForm: 89,        // theoretical peak when fully tapered
  trainingLoad: 68,    // 0–100, weekly training volume
  currentPhase: 'COMPETITION' as TrainingPhaseId,
  weeksToNextMeet: 6,
  tapering: false,
}

// ── Career Mode: Rival System ────────────────────────────────────────────────

export interface CareerRival {
  id: string
  name: string
  country: string
  flag: string
  careerStage: CareerStageId
  ovr: number
  speciality: string
  personalBest: string
  relationship: 'nemesis' | 'rival' | 'close' | 'fading'
  head2head: { wins: number; losses: number }
  lastResult: string
  quote: string
}

export const CAREER_RIVALS: CareerRival[] = [
  {
    id: 'rv1',
    name: 'T. Kluge',
    country: 'Germany',
    flag: '🇩🇪',
    careerStage: 'JUNIOR_NATIONAL',
    ovr: 84,
    speciality: '100m Freestyle',
    personalBest: '49.42',
    relationship: 'nemesis',
    head2head: { wins: 3, losses: 5 },
    lastResult: 'Lost by 0.08s at Junior Nationals',
    quote: '"He always finds another gear in the final 10m."',
  },
  {
    id: 'rv2',
    name: 'J. Proud',
    country: 'Great Britain',
    flag: '🇬🇧',
    careerStage: 'SENIOR_PRO',
    ovr: 91,
    speciality: '50m & 100m Freestyle',
    personalBest: '47.31',
    relationship: 'rival',
    head2head: { wins: 1, losses: 2 },
    lastResult: 'Beat at Pro Swim Series Austin',
    quote: '"The sprint lane is mine."',
  },
  {
    id: 'rv3',
    name: 'K. Dressel Jr.',
    country: 'USA',
    flag: '🇺🇸',
    careerStage: 'OLYMPIC_TRIALS',
    ovr: 97,
    speciality: 'Butterfly & Freestyle',
    personalBest: '46.80',
    relationship: 'rival',
    head2head: { wins: 0, losses: 1 },
    lastResult: 'Lost at Olympic Trials (0.14s)',
    quote: '"Two go in, one goes to the Games."',
  },
  {
    id: 'rv4',
    name: 'M. Phelps',
    country: 'USA',
    flag: '🇺🇸',
    careerStage: 'OLYMPICS',
    ovr: 117,
    speciality: 'All Events — GOAT',
    personalBest: '44.71',
    relationship: 'nemesis',
    head2head: { wins: 0, losses: 0 },
    lastResult: 'The benchmark. 23 Olympic golds.',
    quote: '"There will be no ceiling on what you can achieve."',
  },
]

// ── Career Mode: Legacy & GOAT Rankings ─────────────────────────────────────

export interface LegacyBenchmark {
  id: string
  name: string
  country: string
  flag: string
  olympicGolds: number
  worldTitles: number
  worldRecords: number
  legacyScore: number
  era: string
  status: 'legend' | 'active' | 'your-goal'
}

export const LEGACY_BENCHMARKS: LegacyBenchmark[] = [
  {
    id: 'lg1',
    name: 'M. Phelps',
    country: 'USA',
    flag: '🇺🇸',
    olympicGolds: 23,
    worldTitles: 33,
    worldRecords: 29,
    legacyScore: 9800,
    era: '2000–2016',
    status: 'legend',
  },
  {
    id: 'lg2',
    name: 'K. Ledecky',
    country: 'USA',
    flag: '🇺🇸',
    olympicGolds: 10,
    worldTitles: 21,
    worldRecords: 14,
    legacyScore: 8200,
    era: '2012–present',
    status: 'active',
  },
  {
    id: 'lg3',
    name: 'C. Dressel',
    country: 'USA',
    flag: '🇺🇸',
    olympicGolds: 7,
    worldTitles: 13,
    worldRecords: 5,
    legacyScore: 7100,
    era: '2017–present',
    status: 'active',
  },
  {
    id: 'lg4',
    name: 'I. Thorpe',
    country: 'Australia',
    flag: '🇦🇺',
    olympicGolds: 5,
    worldTitles: 11,
    worldRecords: 13,
    legacyScore: 6800,
    era: '2000–2012',
    status: 'legend',
  },
  {
    id: 'lg5',
    name: 'M. Spitz',
    country: 'USA',
    flag: '🇺🇸',
    olympicGolds: 9,
    worldTitles: 0,
    worldRecords: 7,
    legacyScore: 6500,
    era: '1968–1972',
    status: 'legend',
  },
]

export const PLAYER_LEGACY = {
  name: 'Megamind',
  flag: '🌍',
  olympicGolds: 0,
  worldTitles: 0,
  worldRecords: 0,
  legacyScore: 1050,
  careerStage: 'JUNIOR_NATIONAL' as CareerStageId,
  totalRaces: 214,
  personalBest: '49.63',
  accolades: [
    { id: 'ac1', label: 'Junior Regional Champion', year: 'Season 2', icon: '🥇' },
    { id: 'ac2', label: 'Fastest Junior Time — 100m Free', year: 'Season 3', icon: '⚡' },
    { id: 'ac3', label: 'First Sponsor Deal (TYR)', year: 'Season 3', icon: '💼' },
  ],
}
