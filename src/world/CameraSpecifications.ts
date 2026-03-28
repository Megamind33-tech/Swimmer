/**
 * SWIMMER GAME - Camera Specifications
 * Complete camera system definitions for 20 broadcast-quality camera types
 * Supports MVP (7) and Premium (20) camera packages
 */

import * as BABYLON from '@babylonjs/core';

/**
 * Camera identifier type - 20 distinct camera types
 */
export type CameraID =
  | 'CAM_01_ARENA_ESTABLISHING'
  | 'CAM_02_MARSHALLING'
  | 'CAM_03_HERO_WALKOUT'
  | 'CAM_04_LANE_PORTRAIT'
  | 'CAM_05_BLOCK_DETAIL'
  | 'CAM_06_OVERHEAD_LINEUP'
  | 'CAM_07_START_FINISH_MASTER'
  | 'CAM_08_FINISH_SLOWMO_ISO'
  | 'CAM_09_TURN_MASTER'
  | 'CAM_10_POOLSIDE_TRACKING'
  | 'CAM_11_HANDHELD_DECK_A'
  | 'CAM_12_HANDHELD_DECK_B'
  | 'CAM_13_UNDERWATER_START'
  | 'CAM_14_UNDERWATER_TURN'
  | 'CAM_15_UNDERWATER_TRACKING'
  | 'CAM_16_OVERHEAD_TRACKING'
  | 'CAM_17_CRANE_JIB'
  | 'CAM_18_FINISH_COMPRESSION'
  | 'CAM_19_SCOREBOARD_REACTION'
  | 'CAM_20_FLASH_INTERVIEW';

/**
 * Package tier for camera availability
 */
export type CameraPackage = 'MVP' | 'PREMIUM';

/**
 * Race event type for event-specific shot plans
 */
export type RaceEventType = '50M' | '100M' | '200M' | 'RELAY';

/**
 * Race phase for camera sequencing
 */
export type RacePhase = 'ENTRANCE' | 'START' | 'MID_RACE' | 'TURN' | 'FINISH' | 'POST_RACE';

/**
 * Camera specification with positioning, FOV, and behavior
 */
export interface ICameraSpec {
  id: CameraID;
  name: string;
  purpose: string;
  placement: string;
  fov: { min: number; max: number; suggested: number };
  movement: string;
  focus: string;
  use: string[];
  shotDuration: { min: number; max: number; suggested: number }; // ms
  trigger: string;
  directionNote: string;
  position: BABYLON.Vector3;
  target: BABYLON.Vector3;
  package: CameraPackage;
  transitionDuration: number; // ms
  easing: 'linear' | 'easeInOutQuad' | 'easeInQuad' | 'easeOutQuad';
}

/**
 * Complete camera specifications for all 20 cameras
 */
export const CAMERA_SPECS: Record<CameraID, ICameraSpec> = {
  'CAM_01_ARENA_ESTABLISHING': {
    id: 'CAM_01_ARENA_ESTABLISHING',
    name: 'Arena Establishing Wide',
    purpose: 'Open the event with scale and prestige',
    placement: 'High above the pool, centered or slightly diagonal',
    fov: { min: 70, max: 85, suggested: 75 },
    movement: 'Slow crane drift or slow digital push',
    focus: 'Full pool, scoreboard, crowd, lighting, lane symmetry',
    use: ['Finals intro', 'Championship start', 'Post-medal outro'],
    shotDuration: { min: 2500, max: 4000, suggested: 3000 },
    trigger: 'Before swimmer walkouts or after returning from menu/loading',
    directionNote: 'This shot says, "this is a major event."',
    position: new BABYLON.Vector3(0, 50, 0),
    target: new BABYLON.Vector3(0, 0, 0),
    package: 'PREMIUM',
    transitionDuration: 1000,
    easing: 'easeInOutQuad',
  },

  'CAM_02_MARSHALLING': {
    id: 'CAM_02_MARSHALLING',
    name: 'Marshalling / Tunnel Camera',
    purpose: 'Capture pre-race tension before athletes step out',
    placement: 'Behind the walkout point or in corridor/tunnel',
    fov: { min: 45, max: 60, suggested: 52 },
    movement: 'Soft handheld or stabilized shoulder feel',
    focus: 'Faces, breathing, coach last words, goggles, towels, shadows',
    use: ['Pre-race build-up', 'Rivalry beat', 'Semifinal/final intros'],
    shotDuration: { min: 1500, max: 3000, suggested: 2000 },
    trigger: 'When athlete intro begins',
    directionNote: 'Use darker lighting and tighter sound design here.',
    position: new BABYLON.Vector3(-15, 2, -30),
    target: new BABYLON.Vector3(0, 1, -5),
    package: 'PREMIUM',
    transitionDuration: 800,
    easing: 'easeInOutQuad',
  },

  'CAM_03_HERO_WALKOUT': {
    id: 'CAM_03_HERO_WALKOUT',
    name: 'Hero Walkout Camera',
    purpose: 'Make the swimmer feel like a superstar',
    placement: 'Low-to-mid height, in front of swimmer, moving backward',
    fov: { min: 40, max: 55, suggested: 47 },
    movement: 'Smooth steadicam-style backpedal',
    focus: 'Face, chest, cap, flag/club branding, confident walk',
    use: ['Main athlete entrance'],
    shotDuration: { min: 2500, max: 5000, suggested: 3500 },
    trigger: 'Athlete leaves marshalling area',
    directionNote: 'Slight side drift makes it feel more expensive.',
    position: new BABYLON.Vector3(-5, 2, -20),
    target: new BABYLON.Vector3(0, 1.5, 0),
    package: 'MVP',
    transitionDuration: 600,
    easing: 'easeInOutQuad',
  },

  'CAM_04_LANE_PORTRAIT': {
    id: 'CAM_04_LANE_PORTRAIT',
    name: 'Lane Introduction Portrait',
    purpose: 'Athlete identity close-up during name call',
    placement: 'Deck height, three-quarter front angle',
    fov: { min: 25, max: 40, suggested: 32 },
    movement: 'Mostly static, tiny push-in',
    focus: 'Eyes, jaw tension, goggles adjustment, deep breath',
    use: ['Lane-by-lane intro'],
    shotDuration: { min: 1000, max: 2000, suggested: 1500 },
    trigger: 'Commentator/announcer intro',
    directionNote: 'This is where rival personality is built.',
    position: new BABYLON.Vector3(8, 2, -10),
    target: new BABYLON.Vector3(0, 1.5, -5),
    package: 'PREMIUM',
    transitionDuration: 500,
    easing: 'easeInOutQuad',
  },

  'CAM_05_BLOCK_DETAIL': {
    id: 'CAM_05_BLOCK_DETAIL',
    name: 'Block Detail / Macro Insert',
    purpose: 'Emphasize readiness and tension',
    placement: 'Very low near starting block',
    fov: { min: 20, max: 35, suggested: 27 },
    movement: 'Static or micro slide',
    focus: 'Toes on edge, fingers curling on block, water drip, calf tension',
    use: ['Just before "take your marks"'],
    shotDuration: { min: 300, max: 800, suggested: 500 },
    trigger: 'Final pre-start beats',
    directionNote: 'Never overuse; this is spice.',
    position: new BABYLON.Vector3(0, 0.5, -8),
    target: new BABYLON.Vector3(0, 0.3, -6),
    package: 'PREMIUM',
    transitionDuration: 300,
    easing: 'linear',
  },

  'CAM_06_OVERHEAD_LINEUP': {
    id: 'CAM_06_OVERHEAD_LINEUP',
    name: 'Overhead Lineup Camera',
    purpose: 'Give complete race geography before the start',
    placement: 'High centered top-down or steep overhead',
    fov: { min: 60, max: 75, suggested: 67 },
    movement: 'Static or slow push-in',
    focus: 'All lanes, lane numbers, symmetry, field layout',
    use: ['Final pre-start shot'],
    shotDuration: { min: 1500, max: 2500, suggested: 2000 },
    trigger: 'On "take your marks"',
    directionNote: 'Perfect for showing all competitors at once.',
    position: new BABYLON.Vector3(0, 35, -10),
    target: new BABYLON.Vector3(0, 0, 20),
    package: 'MVP',
    transitionDuration: 800,
    easing: 'easeInOutQuad',
  },

  'CAM_07_START_FINISH_MASTER': {
    id: 'CAM_07_START_FINISH_MASTER',
    name: 'Start/Finish Master Camera',
    purpose: 'The main broadcast race view',
    placement: 'High on the start/finish side, centered on the pool',
    fov: { min: 24, max: 32, suggested: 28 },
    movement: 'Mostly locked, with subtle pan/track bias',
    focus: 'All lanes, leaders, race order, readable spacing',
    use: ['Default race camera for most live action'],
    shotDuration: { min: 2000, max: 6000, suggested: 3500 },
    trigger: 'Start of race, middle coverage, final fallback view',
    directionNote: 'This is the safest and most important camera in the game.',
    position: new BABYLON.Vector3(0, 15, -25),
    target: new BABYLON.Vector3(0, 2, 10),
    package: 'MVP',
    transitionDuration: 1000,
    easing: 'easeInOutQuad',
  },

  'CAM_08_FINISH_SLOWMO_ISO': {
    id: 'CAM_08_FINISH_SLOWMO_ISO',
    name: 'Start/Finish Slow-Mo ISO',
    purpose: 'Isolate the finish and give replay value',
    placement: 'Lower than the master, still aligned with start/finish',
    fov: { min: 15, max: 24, suggested: 19 },
    movement: 'Static or tiny pan corrections',
    focus: 'Winner, wall touch, shoulder line, finish precision',
    use: ['Replay', 'Dramatic finish', 'Close result'],
    shotDuration: { min: 800, max: 1500, suggested: 1200 },
    trigger: 'Final meters or result confirmation',
    directionNote: 'Best used at the wall, not as a main live view.',
    position: new BABYLON.Vector3(2, 8, 35),
    target: new BABYLON.Vector3(0, 1.5, 20),
    package: 'PREMIUM',
    transitionDuration: 800,
    easing: 'easeInOutQuad',
  },

  'CAM_09_TURN_MASTER': {
    id: 'CAM_09_TURN_MASTER',
    name: 'Turn Master Camera',
    purpose: 'Dramatize wall approach and turn timing',
    placement: 'Opposite end of the pool, aligned with the turning wall',
    fov: { min: 24, max: 34, suggested: 29 },
    movement: 'Small pan/tilt corrections',
    focus: 'Wall rush, flip timing, touch, push-off',
    use: ['100m+', 'Medley', 'Relay exchanges near wall'],
    shotDuration: { min: 800, max: 2000, suggested: 1400 },
    trigger: '6–8m before wall',
    directionNote: 'Cut in late so the wall arrives fast.',
    position: new BABYLON.Vector3(0, 15, 30),
    target: new BABYLON.Vector3(0, 2, 10),
    package: 'PREMIUM',
    transitionDuration: 600,
    easing: 'easeInOutQuad',
  },

  'CAM_10_POOLSIDE_TRACKING': {
    id: 'CAM_10_POOLSIDE_TRACKING',
    name: 'Pool-Deck Tracking Camera',
    purpose: 'Provide kinetic race-follow coverage',
    placement: 'On the main camera side, moving parallel to the pool',
    fov: { min: 35, max: 50, suggested: 42 },
    movement: 'Smooth lateral tracking',
    focus: 'Leader pack, side profile, overtakes, stroke cadence',
    use: ['Primary cinematic gameplay follow'],
    shotDuration: { min: 2000, max: 5000, suggested: 3500 },
    trigger: 'After breakout, leader change, final push',
    directionNote: "This should feel like the game's signature live camera.",
    position: new BABYLON.Vector3(20, 6, 0),
    target: new BABYLON.Vector3(-5, 2, 10),
    package: 'MVP',
    transitionDuration: 1000,
    easing: 'easeInOutQuad',
  },

  'CAM_11_HANDHELD_DECK_A': {
    id: 'CAM_11_HANDHELD_DECK_A',
    name: 'RF Handheld Deck A',
    purpose: 'Close-ups before and after the race',
    placement: 'Pool deck near start/finish',
    fov: { min: 45, max: 60, suggested: 52 },
    movement: 'Stabilized handheld',
    focus: 'Walkouts, prep, coach reactions, winner celebration',
    use: ['Intros and post-race emotion'],
    shotDuration: { min: 1000, max: 3000, suggested: 2000 },
    trigger: 'Pre-start, touch, scoreboard look, celebration',
    directionNote: '',
    position: new BABYLON.Vector3(10, 2, -20),
    target: new BABYLON.Vector3(0, 1, 0),
    package: 'PREMIUM',
    transitionDuration: 600,
    easing: 'easeInOutQuad',
  },

  'CAM_12_HANDHELD_DECK_B': {
    id: 'CAM_12_HANDHELD_DECK_B',
    name: 'RF Handheld Deck B',
    purpose: 'Support deck drama and relay focus',
    placement: 'Mobile on pool deck, able to hit exchange and exit positions',
    fov: { min: 35, max: 55, suggested: 45 },
    movement: 'Handheld or monopod feel',
    focus: 'Outgoing relay swimmer, teammates, rival reaction, interviews',
    use: ['Relay mode and emotional coverage'],
    shotDuration: { min: 1000, max: 2500, suggested: 1750 },
    trigger: 'Relay exchanges, upset wins, disqualifications, interviews',
    directionNote: '',
    position: new BABYLON.Vector3(-12, 2, 20),
    target: new BABYLON.Vector3(0, 1.5, 30),
    package: 'PREMIUM',
    transitionDuration: 600,
    easing: 'easeInOutQuad',
  },

  'CAM_13_UNDERWATER_START': {
    id: 'CAM_13_UNDERWATER_START',
    name: 'Underwater Start Camera',
    purpose: 'Make the dive and breakout feel elite',
    placement: 'Submerged at the start end',
    fov: { min: 45, max: 60, suggested: 52 },
    movement: 'Static or slight pan',
    focus: 'Entries, streamline, bubbles, underwater kicks',
    use: ['Start replay or very short live accent'],
    shotDuration: { min: 500, max: 1000, suggested: 750 },
    trigger: 'On start signal',
    directionNote: '',
    position: new BABYLON.Vector3(0, -1, -10),
    target: new BABYLON.Vector3(0, -0.5, 10),
    package: 'PREMIUM',
    transitionDuration: 400,
    easing: 'easeInOutQuad',
  },

  'CAM_14_UNDERWATER_TURN': {
    id: 'CAM_14_UNDERWATER_TURN',
    name: 'Underwater Turn Camera',
    purpose: 'Show push-off and underwater discipline after turn',
    placement: 'Submerged near the turn wall',
    fov: { min: 45, max: 60, suggested: 52 },
    movement: 'Static',
    focus: 'Flip, wall plant, streamline, breakout',
    use: ['Turn replay or very short live accent'],
    shotDuration: { min: 500, max: 1000, suggested: 750 },
    trigger: 'Immediately after wall contact',
    directionNote: '',
    position: new BABYLON.Vector3(0, -1, 35),
    target: new BABYLON.Vector3(0, -0.5, 15),
    package: 'MVP',
    transitionDuration: 400,
    easing: 'easeInOutQuad',
  },

  'CAM_15_UNDERWATER_TRACKING': {
    id: 'CAM_15_UNDERWATER_TRACKING',
    name: 'Underwater Rail / Tracking Camera',
    purpose: 'Premium signature underwater race shot',
    placement: 'Submerged tracking system along pool length',
    fov: { min: 35, max: 50, suggested: 42 },
    movement: 'Lateral or front-tracking',
    focus: 'Bodyline, kick, glide, underwater speed, leader separation',
    use: ['Starts, turns, special replay, ultra-premium finals presentation'],
    shotDuration: { min: 600, max: 1200, suggested: 900 },
    trigger: 'Breakout, key mid-race insert, world-record moment',
    directionNote: '',
    position: new BABYLON.Vector3(15, -1, 0),
    target: new BABYLON.Vector3(-5, -0.5, 15),
    package: 'PREMIUM',
    transitionDuration: 800,
    easing: 'easeInOutQuad',
  },

  'CAM_16_OVERHEAD_TRACKING': {
    id: 'CAM_16_OVERHEAD_TRACKING',
    name: 'Overhead Tracking Camera',
    purpose: 'Tactical clarity and relay precision',
    placement: 'Above pool on overhead track',
    fov: { min: 55, max: 70, suggested: 62 },
    movement: 'Full-length track',
    focus: 'Lane geometry, exchange spacing, clean tactical view',
    use: ['Relay exchange', 'Tutorial mode', 'Major replay', 'Special intro montage'],
    shotDuration: { min: 800, max: 2000, suggested: 1400 },
    trigger: 'Relay exchange windows, false start replays, lead change replay',
    directionNote: '',
    position: new BABYLON.Vector3(0, 40, 0),
    target: new BABYLON.Vector3(0, 0, 0),
    package: 'PREMIUM',
    transitionDuration: 1000,
    easing: 'easeInOutQuad',
  },

  'CAM_17_CRANE_JIB': {
    id: 'CAM_17_CRANE_JIB',
    name: 'Crane / Jib Camera',
    purpose: 'Prestige and visual sweep',
    placement: 'Near start/finish or medal area',
    fov: { min: 60, max: 80, suggested: 70 },
    movement: 'Rising arc or descending sweep',
    focus: 'Starting blocks, dais, warm-up zone, celebration zone',
    use: ['Show openers', 'Transitions', 'Medal sequence'],
    shotDuration: { min: 2000, max: 4000, suggested: 3000 },
    trigger: 'Event open, final touch, podium reveal',
    directionNote: '',
    position: new BABYLON.Vector3(5, 5, -20),
    target: new BABYLON.Vector3(0, 0, 0),
    package: 'PREMIUM',
    transitionDuration: 2000,
    easing: 'easeInOutQuad',
  },

  'CAM_18_FINISH_COMPRESSION': {
    id: 'CAM_18_FINISH_COMPRESSION',
    name: 'Finish Compression Camera',
    purpose: 'Maximize tension in the final meters',
    placement: 'At or just behind the finish wall, looking down the lanes',
    fov: { min: 14, max: 20, suggested: 17 },
    movement: 'Almost none',
    focus: 'Fingertips, wall, lane race, last stroke',
    use: ['Final 7.5–12m and touch'],
    shotDuration: { min: 800, max: 1500, suggested: 1150 },
    trigger: 'Race enters finish threshold',
    directionNote: 'Use when the finish is close or dramatic.',
    position: new BABYLON.Vector3(0, 5, 38),
    target: new BABYLON.Vector3(0, 0.5, 20),
    package: 'MVP',
    transitionDuration: 400,
    easing: 'easeInOutQuad',
  },

  'CAM_19_SCOREBOARD_REACTION': {
    id: 'CAM_19_SCOREBOARD_REACTION',
    name: 'Scoreboard Reaction Camera',
    purpose: 'Capture the most authentic post-race emotion',
    placement: 'Side-front low angle near finish',
    fov: { min: 30, max: 45, suggested: 37 },
    movement: 'Small push-in',
    focus: 'Athlete lifting head, looking to board, breathing, disbelief or joy',
    use: ['Immediately after touch'],
    shotDuration: { min: 1500, max: 3000, suggested: 2250 },
    trigger: 'First head-up after finish',
    directionNote: 'Do not cut away too quickly.',
    position: new BABYLON.Vector3(8, 2, 35),
    target: new BABYLON.Vector3(0, 1, 20),
    package: 'MVP',
    transitionDuration: 600,
    easing: 'easeInOutQuad',
  },

  'CAM_20_FLASH_INTERVIEW': {
    id: 'CAM_20_FLASH_INTERVIEW',
    name: 'Flash Interview / Exit Camera',
    purpose: 'Create a professional sports-broadcast ending beat',
    placement: 'Athlete exit path or mixed-zone equivalent',
    fov: { min: 35, max: 50, suggested: 42 },
    movement: 'Light handheld',
    focus: 'Winner walk-off, rival reaction, coach embrace, short interview',
    use: ['Major wins', 'Finals', 'Story moments'],
    shotDuration: { min: 2000, max: 5000, suggested: 3500 },
    trigger: 'After result lock or podium transition',
    directionNote: '',
    position: new BABYLON.Vector3(-10, 2, 25),
    target: new BABYLON.Vector3(0, 1, 5),
    package: 'PREMIUM',
    transitionDuration: 800,
    easing: 'easeInOutQuad',
  },
};

/**
 * MVP camera package (7 cameras for first playable version)
 */
export const MVP_CAMERAS: CameraID[] = [
  'CAM_03_HERO_WALKOUT',
  'CAM_06_OVERHEAD_LINEUP',
  'CAM_07_START_FINISH_MASTER',
  'CAM_10_POOLSIDE_TRACKING',
  'CAM_14_UNDERWATER_TURN',
  'CAM_18_FINISH_COMPRESSION',
  'CAM_19_SCOREBOARD_REACTION',
];

/**
 * Premium package additions (13 additional cameras)
 */
export const PREMIUM_ADDITIONAL_CAMERAS: CameraID[] = [
  'CAM_01_ARENA_ESTABLISHING',
  'CAM_02_MARSHALLING',
  'CAM_04_LANE_PORTRAIT',
  'CAM_05_BLOCK_DETAIL',
  'CAM_08_FINISH_SLOWMO_ISO',
  'CAM_09_TURN_MASTER',
  'CAM_11_HANDHELD_DECK_A',
  'CAM_12_HANDHELD_DECK_B',
  'CAM_13_UNDERWATER_START',
  'CAM_15_UNDERWATER_TRACKING',
  'CAM_16_OVERHEAD_TRACKING',
  'CAM_17_CRANE_JIB',
  'CAM_20_FLASH_INTERVIEW',
];

/**
 * Event-specific shot sequences
 */
export interface IShotSequence {
  cameras: CameraID[];
  durations: number[]; // duration for each camera in sequence
}

export const EVENT_SHOT_SEQUENCES: Record<RaceEventType, Record<RacePhase, IShotSequence>> = {
  '50M': {
    ENTRANCE: {
      cameras: ['CAM_01_ARENA_ESTABLISHING', 'CAM_03_HERO_WALKOUT', 'CAM_04_LANE_PORTRAIT', 'CAM_05_BLOCK_DETAIL', 'CAM_06_OVERHEAD_LINEUP'],
      durations: [2500, 2500, 1000, 500, 1500],
    },
    START: {
      cameras: ['CAM_07_START_FINISH_MASTER', 'CAM_13_UNDERWATER_START', 'CAM_10_POOLSIDE_TRACKING'],
      durations: [1000, 750, 1500],
    },
    // 50 M is very short — spend most of it on the tracking shot
    MID_RACE: {
      cameras: ['CAM_10_POOLSIDE_TRACKING', 'CAM_07_START_FINISH_MASTER', 'CAM_10_POOLSIDE_TRACKING'],
      durations: [5000, 2000, 5000],
    },
    TURN: {
      cameras: [],
      durations: [],
    },
    FINISH: {
      cameras: ['CAM_18_FINISH_COMPRESSION', 'CAM_08_FINISH_SLOWMO_ISO'],
      durations: [1000, 2000],
    },
    POST_RACE: {
      cameras: ['CAM_19_SCOREBOARD_REACTION', 'CAM_11_HANDHELD_DECK_A', 'CAM_12_HANDHELD_DECK_B', 'CAM_20_FLASH_INTERVIEW'],
      durations: [2000, 1500, 1500, 3000],
    },
  },
  '100M': {
    ENTRANCE: {
      cameras: ['CAM_01_ARENA_ESTABLISHING', 'CAM_03_HERO_WALKOUT', 'CAM_04_LANE_PORTRAIT', 'CAM_06_OVERHEAD_LINEUP'],
      durations: [2000, 2500, 1500, 1500],
    },
    START: {
      cameras: ['CAM_07_START_FINISH_MASTER', 'CAM_13_UNDERWATER_START', 'CAM_10_POOLSIDE_TRACKING'],
      durations: [1000, 750, 2000],
    },
    // Poolside tracking is the dominant shot; wide master for context; overhead for variety
    MID_RACE: {
      cameras: ['CAM_10_POOLSIDE_TRACKING', 'CAM_07_START_FINISH_MASTER', 'CAM_10_POOLSIDE_TRACKING', 'CAM_16_OVERHEAD_TRACKING', 'CAM_10_POOLSIDE_TRACKING'],
      durations: [4500, 2000, 4500, 2000, 4500],
    },
    TURN: {
      cameras: ['CAM_09_TURN_MASTER', 'CAM_14_UNDERWATER_TURN', 'CAM_10_POOLSIDE_TRACKING'],
      durations: [800, 750, 2500],
    },
    FINISH: {
      cameras: ['CAM_18_FINISH_COMPRESSION', 'CAM_07_START_FINISH_MASTER'],
      durations: [1000, 1000],
    },
    POST_RACE: {
      cameras: ['CAM_19_SCOREBOARD_REACTION', 'CAM_11_HANDHELD_DECK_A', 'CAM_20_FLASH_INTERVIEW'],
      durations: [2000, 1500, 3000],
    },
  },
  '200M': {
    ENTRANCE: {
      cameras: ['CAM_01_ARENA_ESTABLISHING', 'CAM_02_MARSHALLING', 'CAM_03_HERO_WALKOUT', 'CAM_04_LANE_PORTRAIT', 'CAM_06_OVERHEAD_LINEUP'],
      durations: [2500, 2000, 2500, 1500, 1500],
    },
    START: {
      cameras: ['CAM_07_START_FINISH_MASTER', 'CAM_13_UNDERWATER_START', 'CAM_10_POOLSIDE_TRACKING'],
      durations: [1000, 500, 2500],
    },
    MID_RACE: {
      cameras: ['CAM_10_POOLSIDE_TRACKING', 'CAM_07_START_FINISH_MASTER', 'CAM_10_POOLSIDE_TRACKING', 'CAM_16_OVERHEAD_TRACKING', 'CAM_10_POOLSIDE_TRACKING', 'CAM_15_UNDERWATER_TRACKING', 'CAM_10_POOLSIDE_TRACKING'],
      durations: [4000, 2000, 4000, 1800, 4000, 1200, 4000],
    },
    TURN: {
      cameras: ['CAM_09_TURN_MASTER', 'CAM_14_UNDERWATER_TURN', 'CAM_10_POOLSIDE_TRACKING'],
      durations: [900, 700, 3000],
    },
    FINISH: {
      cameras: ['CAM_18_FINISH_COMPRESSION', 'CAM_07_START_FINISH_MASTER'],
      durations: [1200, 1000],
    },
    POST_RACE: {
      cameras: ['CAM_19_SCOREBOARD_REACTION', 'CAM_11_HANDHELD_DECK_A', 'CAM_12_HANDHELD_DECK_B'],
      durations: [2500, 1500, 2000],
    },
  },
  'RELAY': {
    ENTRANCE: {
      cameras: ['CAM_01_ARENA_ESTABLISHING', 'CAM_03_HERO_WALKOUT', 'CAM_12_HANDHELD_DECK_B', 'CAM_06_OVERHEAD_LINEUP'],
      durations: [2000, 2000, 2000, 1500],
    },
    START: {
      cameras: ['CAM_07_START_FINISH_MASTER', 'CAM_13_UNDERWATER_START', 'CAM_10_POOLSIDE_TRACKING'],
      durations: [1000, 500, 2000],
    },
    MID_RACE: {
      cameras: ['CAM_10_POOLSIDE_TRACKING', 'CAM_07_START_FINISH_MASTER', 'CAM_10_POOLSIDE_TRACKING', 'CAM_16_OVERHEAD_TRACKING', 'CAM_10_POOLSIDE_TRACKING'],
      durations: [4500, 2000, 4500, 1800, 4500],
    },
    TURN: {
      cameras: ['CAM_16_OVERHEAD_TRACKING', 'CAM_09_TURN_MASTER', 'CAM_14_UNDERWATER_TURN', 'CAM_10_POOLSIDE_TRACKING'],
      durations: [1000, 800, 700, 2500],
    },
    FINISH: {
      cameras: ['CAM_18_FINISH_COMPRESSION'],
      durations: [1200],
    },
    POST_RACE: {
      cameras: ['CAM_19_SCOREBOARD_REACTION', 'CAM_11_HANDHELD_DECK_A', 'CAM_12_HANDHELD_DECK_B', 'CAM_17_CRANE_JIB'],
      durations: [2000, 1500, 2000, 3000],
    },
  },
};

/**
 * Get cameras available for a specific package
 */
export function getAvailableCameras(packageTier: CameraPackage): CameraID[] {
  if (packageTier === 'PREMIUM') {
    return [...MVP_CAMERAS, ...PREMIUM_ADDITIONAL_CAMERAS];
  }
  return MVP_CAMERAS;
}

/**
 * Check if a camera is available in the current package
 */
export function isCameraAvailable(cameraId: CameraID, packageTier: CameraPackage): boolean {
  return getAvailableCameras(packageTier).includes(cameraId);
}

/**
 * Get fallback camera if primary is not available
 */
export function getFallbackCamera(cameraId: CameraID, packageTier: CameraPackage): CameraID | null {
  if (isCameraAvailable(cameraId, packageTier)) {
    return cameraId;
  }

  // Define fallback chains
  const fallbacks: Record<CameraID, CameraID> = {
    'CAM_01_ARENA_ESTABLISHING': 'CAM_06_OVERHEAD_LINEUP',
    'CAM_02_MARSHALLING': 'CAM_03_HERO_WALKOUT',
    'CAM_04_LANE_PORTRAIT': 'CAM_03_HERO_WALKOUT',
    'CAM_05_BLOCK_DETAIL': 'CAM_06_OVERHEAD_LINEUP',
    'CAM_08_FINISH_SLOWMO_ISO': 'CAM_18_FINISH_COMPRESSION',
    'CAM_09_TURN_MASTER': 'CAM_07_START_FINISH_MASTER',
    'CAM_11_HANDHELD_DECK_A': 'CAM_19_SCOREBOARD_REACTION',
    'CAM_12_HANDHELD_DECK_B': 'CAM_19_SCOREBOARD_REACTION',
    'CAM_13_UNDERWATER_START': 'CAM_07_START_FINISH_MASTER',
    'CAM_15_UNDERWATER_TRACKING': 'CAM_10_POOLSIDE_TRACKING',
    'CAM_16_OVERHEAD_TRACKING': 'CAM_06_OVERHEAD_LINEUP',
    'CAM_17_CRANE_JIB': 'CAM_01_ARENA_ESTABLISHING',
    'CAM_20_FLASH_INTERVIEW': 'CAM_19_SCOREBOARD_REACTION',
    // MVP cameras don't need fallbacks
    'CAM_03_HERO_WALKOUT': cameraId,
    'CAM_06_OVERHEAD_LINEUP': cameraId,
    'CAM_07_START_FINISH_MASTER': cameraId,
    'CAM_10_POOLSIDE_TRACKING': cameraId,
    'CAM_14_UNDERWATER_TURN': cameraId,
    'CAM_18_FINISH_COMPRESSION': cameraId,
    'CAM_19_SCOREBOARD_REACTION': cameraId,
  };

  const fallback = fallbacks[cameraId];
  return fallback && isCameraAvailable(fallback, packageTier) ? fallback : null;
}

export default CAMERA_SPECS;
