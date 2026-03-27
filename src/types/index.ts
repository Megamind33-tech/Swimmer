/**
 * SWIMMER GAME - Type Definitions
 * Centralized TypeScript interfaces for game architecture
 */

// ============================================================================
// CORE TYPES
// ============================================================================

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
  | 'RACING'
  | 'UNDERWATER';

export type TimeOfDay =
  | 'MORNING'
  | 'AFTERNOON'
  | 'EVENING'
  | 'NIGHT';

// ============================================================================
// SWIMMER TYPES
// ============================================================================

export interface ISwimmerStats {
  speed: number;
  stamina: number;
  technique: number;
  endurance: number;
  mental: number;
}

export interface ISwimmerRaceState {
  id: string;
  name: string;
  lane: number;
  stats: ISwimmerStats;
  position: number;
  velocity: number;
  stamina: number;
  oxygen: number;
  diveTime: number;
  isUnderwater: boolean;
  rotationAngle: number;
  currentStrokePhase: number;
  lapCount: number;
  splitsTime: number[];
  lapTimes: number[];
  isDNF: boolean;
  finishTime: number;
  finishRank: number;
}

// ============================================================================
// ARENA & GRAPHICS TYPES
// ============================================================================

export interface IArenaConfig {
  theme: PoolTheme;
  timeOfDay: TimeOfDay;
  poolLength: number;
  poolWidth: number;
  laneCount: number;
  arenaHeight: number;
  customColors?: {
    pool: string;
    walls: string;
    deck: string;
    seats: string;
    lights: string;
  };
}

// ============================================================================
// CAMERA & BROADCAST TYPES
// ============================================================================

export type CameraPackageTier = 'MVP' | 'PREMIUM';
export type RaceEventTypeEnum = '50M' | '100M' | '200M' | 'RELAY';
export type CameraInputWindowType = 'DIVE' | 'TURN' | 'FINISH' | 'RELAY' | 'STROKE';

export interface IBroadcastCameraStatus {
  isActive: boolean;
  currentCameraId: string | null;
  raceEventType: RaceEventTypeEnum;
  packageTier: CameraPackageTier;
  isInInputWindow: boolean;
}
