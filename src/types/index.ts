/**
 * SWIMMER GAME - Type Definitions
 * Centralized TypeScript interfaces for game architecture
 */

// ============================================================================
// GAME STATE & CORE TYPES
// ============================================================================

export type GameMode =
  | 'MENU'
  | 'QUICK_RACE'
  | 'CAREER'
  | 'CHAMPIONSHIP'
  | 'RANKED'
  | 'GHOST_RACE'
  | 'RIVAL_MODE'
  | 'CLUB_LEAGUE'
  | 'RELAY'
  | 'TIME_TRIAL'
  | 'TRAINING'
  | 'PAUSED';

export type GameState =
  | 'IDLE'
  | 'MENU'
  | 'LOADING'
  | 'RACING'
  | 'FINISHED'
  | 'RESULTS';

export type RaceState =
  | 'IDLE'
  | 'COUNTDOWN'
  | 'RACING'
  | 'FINISHED'
  | 'PAUSED';

export type PoolTheme =
  | 'OLYMPIC'
  | 'CHAMPIONSHIP'
  | 'NEON'
  | 'SUNSET'
  | 'CUSTOM';

export type CameraView =
  | 'DEFAULT'
  | 'AERIAL'
  | 'STARTING_BLOCK'
  | 'RACING';

export type TimeOfDay =
  | 'MORNING'
  | 'AFTERNOON'
  | 'EVENING'
  | 'NIGHT';

export type SwimmingStroke =
  | 'FREESTYLE'
  | 'BUTTERFLY'
  | 'BREASTSTROKE'
  | 'BACKSTROKE'
  | 'IM'; // Individual Medley

export type SwimmerSpecialty =
  | 'SPRINTER'
  | 'DISTANCE'
  | 'TECHNICIAN'
  | 'ALL_AROUND';

export type Rarity =
  | 'COMMON'
  | 'UNCOMMON'
  | 'RARE'
  | 'EPIC'
  | 'LEGENDARY';

// ============================================================================
// PLAYER & SWIMMER TYPES
// ============================================================================

export interface ISwimmerStats {
  speed: number;          // 1-20 (how fast base movement)
  stamina: number;        // 1-20 (oxygen capacity)
  technique: number;      // 1-20 (stroke precision)
  endurance: number;      // 1-20 (recovery rate)
  mental: number;         // 1-20 (pressure resistance)
}

export interface ISwimmerAttributes {
  height: number;         // cm (150-210)
  weight: number;         // kg (60-100)
  armSpan: number;        // cm (arm to arm span)
  strokeRate: number;     // strokes per minute
}

export interface ISwimmerPersonality {
  name: string;
  archetype: string;      // "Aggressive", "Steady", "Technical", etc.
  traits: string[];       // ["Destroyer", "Everyman", "Showstopper"]
  dialogue: string[];     // Pre/post race dialogue
  trashTalkChance: number; // 0-1.0 probability
}

export interface IAISwimmer {
  id: string;
  name: string;
  lane: number;           // 1-8
  stats: ISwimmerStats;
  attributes: ISwimmerAttributes;
  personality: ISwimmerPersonality;
  specialty: SwimmerSpecialty;
  skillTier: number;      // 1-10
  isRival?: boolean;
  rivalLevel?: number;    // How many times player raced them
}

export interface IPlayerSwimmer {
  id: string;
  name: string;
  level: number;
  xp: number;
  stats: ISwimmerStats;
  attributes: ISwimmerAttributes;
  specialty: SwimmerSpecialty;
  cosmetics: ICosmetics;
  careerTier: number;     // 1-5 (School to World)
  careerEventIndex: number; // 0-49 (which event in career)
  reputation: number;     // 0-1000
  fame: number;           // 0-500
  createdAt: number;      // timestamp
}

export interface ICosmetics {
  suitColor: string;
  suitPattern: string;
  capStyle: string;
  capColor: string;
  gogglesStyle: string;
  celebrationAnimation: string;
  equipment: string[];    // IDs of equipped gear
}

export interface IEquipment {
  id: string;
  name: string;
  type: 'SUIT' | 'CAP' | 'GOGGLES' | 'GEAR';
  rarity: Rarity;
  statBonus: Partial<ISwimmerStats>;
  icon: string;
  price: number;
}

// ============================================================================
// RACE DATA TYPES
// ============================================================================

export interface IRaceSetup {
  mode: GameMode;
  distance: number;       // 50, 100, 200, 400, 800, 1500 meters
  stroke: SwimmingStroke;
  poolTheme: PoolTheme;
  timeOfDay: TimeOfDay;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  opponents: IAISwimmer[];
}

export interface ISwimmerRaceState {
  id: string;
  name: string;
  lane: number;
  stats: ISwimmerStats;   // Swimmer's base stats
  position: number;       // meters into race (0-distance)
  velocity: number;       // current speed (units/sec)
  stamina: number;        // 0-100
  oxygen: number;         // 0-100
  diveTime: number;       // seconds in current dive
  isUnderwater: boolean;
  rotationAngle: number;  // for dive angle
  currentStrokePhase: number; // 0-1 (animation phase)
  lapCount: number;
  splitsTime: number[];   // split times per 25m
  lapTimes: number[];     // time per lap
  isDNF: boolean;         // Did Not Finish
  finishTime: number;     // total race time
  finishRank: number;     // 1st, 2nd, etc.
}

export interface IRaceState {
  state: RaceState;
  startTime: number;
  currentTime: number;
  countdownValue: number; // 3, 2, 1, 0
  swimmers: ISwimmerRaceState[];
  leaderboard: Array<{
    rank: number;
    name: string;
    time: number;
    pace: number;
  }>;
  isFinished: boolean;
  winnerId: string;
}

export interface IRaceResult {
  mode: GameMode;
  distance: number;
  stroke: SwimmingStroke;
  playerRank: number;
  playerTime: number;
  opponentResults: Array<{
    name: string;
    rank: number;
    time: number;
  }>;
  xpEarned: number;
  currencyEarned: number;
  cosmetics: string[];    // IDs dropped
  achievementsUnlocked: string[];
  createdAt: number;
}

// ============================================================================
// PROGRESSION & CAREER TYPES
// ============================================================================

export interface ICareerEvent {
  id: string;
  index: number;          // 0-49
  tier: number;           // 1-5 (School to World)
  name: string;
  description: string;
  distance: number;
  stroke: SwimmingStroke;
  opponents: string[];    // AI swimmer names
  minDifficulty: number;
  difficulty: number;     // 1-10
  rewards: {
    xp: number;
    currency: number;
    cosmetics?: string[];
    unlocksNextEvent: boolean;
  };
}

export interface ISkillTree {
  name: string;
  tier: number;
  nodes: Array<{
    id: string;
    name: string;
    description: string;
    bonus: Partial<ISwimmerStats>;
    unlockedAt: number;   // player level
  }>;
}

export interface IRival {
  id: string;
  name: string;
  stats: ISwimmerStats;
  personality: ISwimmerPersonality;
  specialty: SwimmerSpecialty;
  skillTier: number;
  racesAgainstPlayer: number;
  playerWins: number;
  difficulty: number;
  unlockLevel: number;    // player level to unlock
  nemesisReward?: string; // cosmetic ID
}

// ============================================================================
// GAME MANAGER STATE
// ============================================================================

export interface IGameManager {
  gameState: GameState;
  currentMode: GameMode;
  player: IPlayerSwimmer | null;
  isOnline: boolean;
  settings: IGameSettings;

  // Methods (optional for typing)
  switchMode: (mode: GameMode) => void;
  startRace: (setup: IRaceSetup) => void;
  finishRace: (result: IRaceResult) => void;
}

export interface IGameSettings {
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticFeedback: boolean;
  qualityTier: 'LOW' | 'MEDIUM' | 'HIGH';
  fpsTarget: number;
  language: string;
}

// ============================================================================
// ARENA & GRAPHICS TYPES
// ============================================================================

export interface IArenaConfig {
  theme: PoolTheme;
  timeOfDay: TimeOfDay;
  poolLength: number;     // 50m standard
  poolWidth: number;      // 25m
  laneCount: number;      // 8
  arenaHeight: number;
  customColors?: {
    pool: string;
    walls: string;
    deck: string;
    seats: string;
    lights: string;
  };
}

export interface ICameraConfig {
  view: CameraView;
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  zoom: number;
  rotationSpeed: number;
}

export interface ILightingConfig {
  timeOfDay: TimeOfDay;
  ambientIntensity: number;
  ambientColor: { r: number; g: number; b: number };
  fogDensity: number;
}

// ============================================================================
// INPUT & CONTROL TYPES
// ============================================================================

export interface IInputEvent {
  type: 'TAP' | 'HOLD' | 'DRAG' | 'SWIPE' | 'DOUBLE_TAP';
  timestamp: number;
  x: number;
  y: number;
  duration?: number;
  intensity?: number;     // for pressure-sensitive
}

export interface ITapWindow {
  start: number;          // relative ms
  end: number;            // relative ms
  perfectCenter: number;  // ms where it's perfect
  tolerance: number;      // ±ms
}

// ============================================================================
// NETWORKING & DATA SYNC TYPES
// ============================================================================

export interface ICloudSyncData {
  playerData: IPlayerSwimmer;
  careerProgress: {
    tier: number;
    eventIndex: number;
    completedEvents: number[];
  };
  rivals: Array<{
    rivalId: string;
    racesAgainst: number;
    wins: number;
  }>;
  cosmetics: string[];
  lastSync: number;
}

export interface ILeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  level: number;
  bestTime: number;
  distance: number;
  stroke: SwimmingStroke;
  timestamp: number;
}

// ============================================================================
// ACHIEVEMENT & REWARD TYPES
// ============================================================================

export interface IAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;      // Description of how to unlock
  xpReward: number;
  cosmetics?: string[];
}

export interface IDailyQuest {
  id: string;
  date: string;           // YYYY-MM-DD
  objective: string;
  raceCount: number;
  distance: number;
  stroke?: SwimmingStroke;
  xpReward: number;
  currencyReward: number;
  isComplete: boolean;
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================
// All types are exported individually above
// Usage: import { GameMode, IPlayerSwimmer, ... } from '../types'
