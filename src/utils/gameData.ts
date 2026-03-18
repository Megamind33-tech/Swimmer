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
