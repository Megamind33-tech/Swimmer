/**
 * SWIMMER GAME - RaceEngine
 * Core race physics and mechanics
 *
 * Responsibilities:
 * - Race state management and progression
 * - Swimmer physics (movement, stamina, oxygen)
 * - Input processing (tap timing, dive angle, breathing)
 * - Stroke mechanics (rhythm, breathing, turn timing)
 * - AI opponent behavior and pacing
 * - Difficulty scaling and difficulty calculations
 * - Race progression (countdown, racing, finish detection)
 */

import {
  ISwimmerRaceState,
  IRaceState,
  IRaceSetup,
  IAISwimmer,
  IInputEvent,
  SwimmingStroke,
  RaceState,
} from '../types';
import { clamp, logger } from '../utils';

// Race physics constants
const RACE_PHYSICS = {
  POOL_LENGTH: 50, // meters
  POOL_WIDTH: 25,
  START_DISTANCE: 0, // meters from start
  FINISH_DISTANCE: 50, // meters from start
  DIVE_DURATION: 0.6, // seconds
  DIVE_ANGLE_MIN: -45, // degrees
  DIVE_ANGLE_MAX: -15,
  DIVE_DEPTH_MODIFIER: 0.1, // how much angle affects speed
  UNDERWATER_MAX_TIME: 15, // seconds max breath hold

  // Stamina system
  BASE_STAMINA: 100,
  STAMINA_STROKE_DRAIN: 0.5, // per stroke tap
  STAMINA_UNDERWATER_DRAIN: 0.7,
  STAMINA_SPRINT_DRAIN: 2.0,
  STAMINA_RECOVERY_RATE: 0.5, // per second at surface
  STAMINA_CRITICAL_THRESHOLD: 25, // below this = severe penalty

  // Oxygen system
  BASE_OXYGEN: 100,
  OXYGEN_UNDERWATER_DRAIN: 1.0, // per second underwater
  OXYGEN_SURFACE_RECOVERY: 1.0,
  OXYGEN_HOLD_BREATH_PENALTY: 1.5, // multiplier for forced breath hold

  // Stroke mechanics
  STROKE_RHYTHM_WINDOW_MS: 150, // ±ms around beat
  STROKE_PERFECT_BONUS: 1.1, // 10% speed
  STROKE_GOOD_BONUS: 0.95, // -5% speed
  STROKE_MISSED_PENALTY: 0.85, // -15% speed
  TURN_WINDOW_MS: 200, // ±ms to touch wall
  TURN_MOMENTUM_BONUS: 1.1, // 10% speed after turn

  // Speed modifiers
  BASE_SPEED: 2.0, // meters per second (varies by swimmer)
  SPRINT_BOOST: 1.2, // 20% speed increase

  // Difficulty modifiers
  EASY_DIFFICULTY: 0.85,
  HARD_DIFFICULTY: 1.15,
};

interface IStrokeMetrics {
  beatsPerSecond: number;
  underWaterDuration: number;
  breathingFrequency: number; // every N strokes
  turnDistance: number; // 25m for 50m pool
}

// Stroke timing and mechanics
const STROKE_MECHANICS: Record<SwimmingStroke, IStrokeMetrics> = {
  FREESTYLE: {
    beatsPerSecond: 1.5, // 1.5 arm rotations per second
    underWaterDuration: 3.5,
    breathingFrequency: 2.5, // every 2-3 strokes
    turnDistance: 25,
  },
  BUTTERFLY: {
    beatsPerSecond: 1.0, // 1 full cycle per second
    underWaterDuration: 5.0, // longer underwater phase
    breathingFrequency: 2.0, // every 2 cycles
    turnDistance: 25,
  },
  BREASTSTROKE: {
    beatsPerSecond: 1.2,
    underWaterDuration: 2.0, // shorter underwater
    breathingFrequency: 1.0, // breathe every stroke
    turnDistance: 25,
  },
  BACKSTROKE: {
    beatsPerSecond: 1.5,
    underWaterDuration: 3.5,
    breathingFrequency: 2.0, // every 2 strokes
    turnDistance: 25,
  },
  IM: {
    beatsPerSecond: 1.25, // average
    underWaterDuration: 4.0, // average
    breathingFrequency: 2.0,
    turnDistance: 25,
  },
};

export class RaceEngine {
  private raceState: IRaceState;
  private setup: IRaceSetup;
  private swimmers: Map<string, ISwimmerRaceState> = new Map();

  // Mechanics tracking
  private currentStrokeIndex: Map<string, number> = new Map(); // Which stroke in sequence
  private lastStrokeTapTime: Map<string, number> = new Map();
  private diveAngle: number = -30; // Default dive angle
  private isCountingDown: boolean = false;
  private countdownStartTime: number = 0;

  // Input buffering
  private inputBuffer: IInputEvent[] = [];

  constructor(setup: IRaceSetup) {
    this.setup = setup;

    // Initialize race state
    this.raceState = {
      state: 'IDLE',
      startTime: Date.now(),
      currentTime: 0,
      countdownValue: 3,
      swimmers: [],
      leaderboard: [],
      isFinished: false,
      winnerId: '',
    };

    // Initialize swimmers
    for (const aiSwimmer of setup.opponents) {
      const swimmerState: ISwimmerRaceState = {
        id: aiSwimmer.id,
        name: aiSwimmer.name,
        lane: aiSwimmer.lane,
        stats: aiSwimmer.stats,
        position: 0,
        velocity: 0,
        stamina: RACE_PHYSICS.BASE_STAMINA,
        oxygen: RACE_PHYSICS.BASE_OXYGEN,
        diveTime: 0,
        isUnderwater: false,
        rotationAngle: 0,
        currentStrokePhase: 0,
        lapCount: 0,
        splitsTime: [],
        lapTimes: [],
        isDNF: false,
        finishTime: 0,
        finishRank: 0,
      };

      this.swimmers.set(aiSwimmer.id, swimmerState);
      this.raceState.swimmers.push(swimmerState);
      this.currentStrokeIndex.set(aiSwimmer.id, 0);
      this.lastStrokeTapTime.set(aiSwimmer.id, 0);
    }

    logger.log('RaceEngine initialized with', setup.opponents.length, 'swimmers');
  }

  // ============================================================================
  // RACE LIFECYCLE
  // ============================================================================

  /**
   * Start countdown to race
   */
  public startCountdown(): void {
    if (this.isCountingDown) return;

    this.isCountingDown = true;
    this.countdownStartTime = performance.now();
    this.raceState.state = 'COUNTDOWN';
    this.raceState.countdownValue = 3;

    logger.log('Race countdown started');
  }

  /**
   * Start the actual race (after countdown)
   */
  public startRace(): void {
    this.raceState.state = 'RACING';
    this.raceState.startTime = performance.now();

    // All swimmers begin diving
    for (const [id, swimmer] of this.swimmers) {
      swimmer.diveTime = 0;
      swimmer.isUnderwater = true;
      swimmer.position = 0;
    }

    logger.log('Race started!');
  }

  /**
   * Finish the race
   */
  public finishRace(): void {
    this.raceState.state = 'FINISHED';
    this.raceState.isFinished = true;

    // Determine winner
    const finished = Array.from(this.swimmers.values())
      .filter((s) => !s.isDNF)
      .sort((a, b) => a.finishTime - b.finishTime);

    finished.forEach((swimmer, index) => {
      swimmer.finishRank = index + 1;
    });

    if (finished.length > 0) {
      this.raceState.winnerId = finished[0].id;
    }

    logger.log('Race finished! Winner:', this.raceState.winnerId);
  }

  /**
   * Main update loop
   */
  public update(deltaTime: number): void {
    if (this.raceState.state === 'IDLE') return;

    this.raceState.currentTime = performance.now() - this.raceState.startTime;

    // Update countdown
    if (this.raceState.state === 'COUNTDOWN') {
      this.updateCountdown();
      return;
    }

    if (this.raceState.state !== 'RACING') return;

    // Process input buffer
    this.processInputBuffer();

    // Update each swimmer
    for (const [id, swimmer] of this.swimmers) {
      this.updateSwimmer(swimmer, deltaTime);
    }

    // Check for finish
    this.checkFinishLine();

    // Update leaderboard
    this.updateLeaderboard();
  }

  // ============================================================================
  // COUNTDOWN MANAGEMENT
  // ============================================================================

  private updateCountdown(): void {
    const elapsedMs = performance.now() - this.countdownStartTime;
    const elapsedSecs = elapsedMs / 1000;

    this.raceState.countdownValue = Math.max(0, 3 - elapsedSecs);

    if (elapsedSecs >= 3) {
      this.startRace();
    }
  }

  // ============================================================================
  // SWIMMER UPDATES
  // ============================================================================

  private updateSwimmer(swimmer: ISwimmerRaceState, deltaTime: number): void {
    if (swimmer.isDNF) return;

    // Update dive phase
    if (swimmer.diveTime < RACE_PHYSICS.DIVE_DURATION) {
      this.updateDivePhase(swimmer, deltaTime);
      return;
    }

    // Update underwater phase
    if (swimmer.isUnderwater) {
      this.updateUnderwater(swimmer, deltaTime);
      return;
    }

    // Update surface phase (normal racing)
    this.updateSurface(swimmer, deltaTime);

    // Update stamina/oxygen recovery
    this.updateRecovery(swimmer, deltaTime);

    // Check for DNF conditions
    if (swimmer.stamina <= 0 || swimmer.oxygen <= 0) {
      swimmer.isDNF = true;
      logger.log(`${swimmer.name} DNF - stamina/oxygen depleted`);
    }
  }

  private updateDivePhase(swimmer: ISwimmerRaceState, deltaTime: number): void {
    swimmer.diveTime += deltaTime;

    // Dive propels forward
    const diveSpeed = 3.0 * (1 + this.diveAngle / 45); // Deeper angle = faster
    swimmer.position += diveSpeed * deltaTime;

    // Rotation during dive
    swimmer.rotationAngle = (swimmer.diveTime / RACE_PHYSICS.DIVE_DURATION) * 90; // 0->90 degrees

    // Drain oxygen during dive
    swimmer.oxygen -= RACE_PHYSICS.OXYGEN_UNDERWATER_DRAIN * deltaTime;

    if (swimmer.diveTime >= RACE_PHYSICS.DIVE_DURATION) {
      swimmer.diveTime = 0;
      swimmer.isUnderwater = false;
    }
  }

  private updateUnderwater(swimmer: ISwimmerRaceState, deltaTime: number): void {
    // Underwater kicking propels forward
    const underwaterSpeed = 2.5;
    swimmer.position += underwaterSpeed * deltaTime;

    // Drain oxygen quickly underwater
    swimmer.oxygen -= RACE_PHYSICS.OXYGEN_UNDERWATER_DRAIN * deltaTime * 1.5;

    // Drain stamina for kicking
    swimmer.stamina -= RACE_PHYSICS.STAMINA_UNDERWATER_DRAIN * deltaTime;

    // Must surface if oxygen critical
    if (swimmer.oxygen <= 0) {
      swimmer.isUnderwater = false;
      swimmer.oxygen = Math.min(20, swimmer.oxygen + 20); // Gulp of air
    }
  }

  private updateSurface(swimmer: ISwimmerRaceState, deltaTime: number): void {
    // Base speed from swimmer stats
    const baseSpeed = RACE_PHYSICS.BASE_SPEED + swimmer.stats.speed * 0.1;
    let currentSpeed = baseSpeed;

    // Apply stamina penalty
    if (swimmer.stamina < RACE_PHYSICS.STAMINA_CRITICAL_THRESHOLD) {
      currentSpeed *= 0.7; // 30% slowdown when critical
    }

    // Move forward
    swimmer.position += currentSpeed * deltaTime;

    // Update current stroke phase
    const strokeMetrics = STROKE_MECHANICS[this.setup.stroke];
    swimmer.currentStrokePhase = (swimmer.currentStrokePhase + strokeMetrics.beatsPerSecond * deltaTime) % 1;

    // Drain stamina per stroke
    swimmer.stamina -= RACE_PHYSICS.STAMINA_STROKE_DRAIN * deltaTime;
  }

  private updateRecovery(swimmer: ISwimmerRaceState, deltaTime: number): void {
    const strokeMetrics = STROKE_MECHANICS[this.setup.stroke];

    // Recovery stamina at surface
    swimmer.stamina = Math.min(
      RACE_PHYSICS.BASE_STAMINA,
      swimmer.stamina + RACE_PHYSICS.STAMINA_RECOVERY_RATE * deltaTime
    );

    // Recovery oxygen at surface
    swimmer.oxygen = Math.min(
      RACE_PHYSICS.BASE_OXYGEN,
      swimmer.oxygen + RACE_PHYSICS.OXYGEN_SURFACE_RECOVERY * deltaTime * 0.5
    );
  }

  // ============================================================================
  // TURN DETECTION & MECHANICS
  // ============================================================================

  private checkTurnLine(position: number): boolean {
    const metersIntoPools = position % RACE_PHYSICS.POOL_LENGTH;
    return Math.abs(metersIntoPools - RACE_PHYSICS.POOL_LENGTH) < 0.5 ||
           Math.abs(metersIntoPools) < 0.5;
  }

  // ============================================================================
  // FINISH LINE DETECTION
  // ============================================================================

  private checkFinishLine(): void {
    let allFinished = true;

    for (const [id, swimmer] of this.swimmers) {
      if (swimmer.isDNF) continue;

      if (swimmer.position >= this.setup.distance && swimmer.finishTime === 0) {
        swimmer.finishTime = this.raceState.currentTime / 1000; // Convert to seconds
        logger.log(`${swimmer.name} finished in ${swimmer.finishTime.toFixed(2)}s`);
      }

      if (swimmer.finishTime === 0) {
        allFinished = false;
      }
    }

    if (allFinished) {
      this.finishRace();
    }
  }

  // ============================================================================
  // LEADERBOARD MANAGEMENT
  // ============================================================================

  private updateLeaderboard(): void {
    this.raceState.leaderboard = Array.from(this.swimmers.values())
      .sort((a, b) => b.position - a.position)
      .map((swimmer, index) => ({
        rank: index + 1,
        name: swimmer.name,
        time: this.raceState.currentTime / 1000,
        pace: swimmer.position / Math.max(0.1, this.raceState.currentTime / 1000),
      }));
  }

  // ============================================================================
  // INPUT HANDLING
  // ============================================================================

  /**
   * Buffer an input event (processed in next update)
   */
  public queueInput(event: IInputEvent): void {
    this.inputBuffer.push(event);
  }

  /**
   * Process all buffered inputs
   */
  private processInputBuffer(): void {
    while (this.inputBuffer.length > 0) {
      const event = this.inputBuffer.shift()!;
      this.processInput(event);
    }
  }

  /**
   * Process a single input event
   */
  private processInput(event: IInputEvent): void {
    const now = performance.now();

    switch (event.type) {
      case 'TAP':
        this.handleTap();
        break;
      case 'HOLD':
        this.handleHold(event.duration || 0);
        break;
      case 'DOUBLE_TAP':
        this.handleDoubleTap();
        break;
      case 'DRAG':
        this.handleDrag(event.y); // Dive angle control
        break;
      case 'SWIPE':
        this.handleSwipe(event);
        break;
    }
  }

  private handleTap(): void {
    // Player taps - register stroke rhythm input
    // This would update stroke timing accuracy
  }

  private handleHold(duration: number): void {
    // Player holds - for breathing/underwater kicking
  }

  private handleDoubleTap(): void {
    // Player double taps - sprint burst
  }

  private handleDrag(yOffset: number): void {
    // Dive angle control (drag up/down changes angle)
    this.diveAngle = clamp(this.diveAngle + yOffset * 0.1, RACE_PHYSICS.DIVE_ANGLE_MIN, RACE_PHYSICS.DIVE_ANGLE_MAX);
  }

  private handleSwipe(event: IInputEvent): void {
    // Swipe for various actions
  }

  // ============================================================================
  // STATE QUERIES
  // ============================================================================

  /**
   * Get current race state
   */
  public getRaceState(): IRaceState {
    return { ...this.raceState };
  }

  /**
   * Get specific swimmer state
   */
  public getSwimmerState(swimmerId: string): ISwimmerRaceState | undefined {
    return this.swimmers.get(swimmerId);
  }

  /**
   * Get all swimmers
   */
  public getAllSwimmers(): ISwimmerRaceState[] {
    return Array.from(this.swimmers.values());
  }

  /**
   * Get current race state enum
   */
  public getRaceStateType(): RaceState {
    return this.raceState.state;
  }

  /**
   * Is race finished
   */
  public isRaceFinished(): boolean {
    return this.raceState.isFinished;
  }

  /**
   * Get current leaderboard
   */
  public getLeaderboard() {
    return [...this.raceState.leaderboard];
  }
}

export default RaceEngine;
