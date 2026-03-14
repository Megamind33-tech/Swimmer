/**
 * RaceController
 * Orchestrates the complete race flow from setup through completion
 *
 * Responsibilities:
 * - Initialize race state from RaceSetup
 * - Coordinate RaceEngine, TouchControls, and StrokeSystem
 * - Update swimmer positions every frame
 * - Detect finish conditions (all swimmers at distance or DNF)
 * - Emit race events (start, progress, finish, DNF)
 * - Calculate final rankings and times
 * - Clean up resources on race end
 *
 * Performance: <5ms per frame update on target devices
 */

import { EventEmitter } from '../utils/index';
import { RaceEngine } from './RaceEngine';
import { IRaceSetup, IRaceState, ISwimmerRaceState, RaceState } from '../types/index';

export interface RaceControllerEvents {
  raceStart: IRaceSetup;
  raceCountdown: number;
  raceBegin: void;
  raceProgress: { leader: string; leaderPosition: number; time: number };
  swimmerFinished: { name: string; rank: number; time: number };
  raceFinished: IRaceState;
  racePaused: number;
  raceResumed: number;
  error: string;
}

/**
 * RaceController Class
 * Core race orchestration system
 */
export class RaceController extends EventEmitter<RaceControllerEvents> {
  private raceEngine: RaceEngine;
  private raceState: IRaceState | null = null;
  private raceSetup: IRaceSetup | null = null;
  private countdownTimer: number = 0;
  private countdownValue: number = 3;
  private isCountdownRunning: boolean = false;
  private isPaused: boolean = false;
  private pausedTime: number = 0;
  private frameCount: number = 0;
  private lastUpdateTime: number = 0;

  constructor() {
    super();
    // RaceEngine will be initialized when initializeRace is called with setup
    this.raceEngine = null as any;
  }

  /**
   * Initialize race with setup configuration
   */
  public initializeRace(setup: IRaceSetup): IRaceState {
    try {
      this.raceSetup = setup;

      // Initialize RaceEngine with setup
      this.raceEngine = new RaceEngine(setup);

      // Initialize race state
      this.raceState = {
        state: 'COUNTDOWN',
        startTime: performance.now(),
        currentTime: 0,
        countdownValue: 3,
        swimmers: setup.opponents.map((opponent, index) => ({
          id: opponent.id,
          name: opponent.name,
          lane: opponent.lane || (index + 1),
          stats: opponent.stats,
          position: 0,
          velocity: 0,
          stamina: 100,
          oxygen: 100,
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
        })),
        leaderboard: [],
        isFinished: false,
        winnerId: '',
      };

      this.isCountdownRunning = true;
      this.countdownValue = 3;
      this.countdownTimer = 0;
      this.frameCount = 0;
      this.lastUpdateTime = performance.now();
      this.isPaused = false;

      this.emit('raceStart', setup);

      return this.raceState;
    } catch (error) {
      const message = `Race initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.emit('error', message);
      throw error;
    }
  }

  /**
   * Update race state per frame
   */
  public updateRace(deltaTime: number): void {
    if (!this.raceState) return;
    if (this.isPaused) return;

    const currentTime = performance.now();
    this.lastUpdateTime = currentTime;

    // Handle countdown
    if (this.isCountdownRunning) {
      this.countdownTimer += deltaTime;

      if (this.countdownTimer >= 1000) {
        this.countdownValue--;
        this.emit('raceCountdown', this.countdownValue);

        if (this.countdownValue < 0) {
          this.isCountdownRunning = false;
          this.raceState.state = 'RACING';
          this.raceState.startTime = currentTime;
          this.emit('raceBegin', undefined);
          this.countdownTimer = 0;
          return;
        }

        this.countdownTimer = 0;
      }

      return;
    }

    // Race is active
    this.raceState.currentTime = currentTime - this.raceState.startTime;

    // Update each swimmer
    let finishedCount = 0;
    let leaderPosition = 0;
    let leaderName = '';

    for (let i = 0; i < this.raceState.swimmers.length; i++) {
      const swimmer = this.raceState.swimmers[i];

      if (swimmer.isDNF) {
        finishedCount++;
        continue;
      }

      // Update swimmer position (simulated based on stats and stroke)
      // In Week 5, this will integrate actual RaceEngine and TouchControls
      const baseSpeed = (swimmer.stats.speed / 10) * 2.5; // m/s
      const staminaMultiplier = Math.max(0.3, swimmer.stamina / 100); // 0.3x to 1.0x
      const speed = baseSpeed * staminaMultiplier;

      swimmer.position += (speed * deltaTime) / 1000;
      swimmer.velocity = speed;
      swimmer.stamina = Math.max(0, swimmer.stamina - 0.5 * deltaTime / 1000); // drain stamina
      swimmer.oxygen = Math.min(100, swimmer.oxygen + 0.2 * deltaTime / 1000); // recover oxygen

      // Check if finished
      if (swimmer.position >= this.raceSetup!.distance) {
        if (swimmer.finishTime === 0) {
          swimmer.finishTime = this.raceState.currentTime;
          swimmer.finishRank = finishedCount + 1;
          finishedCount++;
          this.emit('swimmerFinished', {
            name: swimmer.name,
            rank: swimmer.finishRank,
            time: swimmer.finishTime,
          });
        }
      } else {
        // Track leader
        if (swimmer.position > leaderPosition) {
          leaderPosition = swimmer.position;
          leaderName = swimmer.name;
        }
      }
    }

    // Emit progress update (every 500ms)
    this.frameCount++;
    if (this.frameCount % 10 === 0) {
      this.emit('raceProgress', {
        leader: leaderName,
        leaderPosition: leaderPosition,
        time: this.raceState.currentTime,
      });
    }

    // Check if race is finished (all swimmers finished or DNF'd)
    if (finishedCount === this.raceState.swimmers.length) {
      this.finishRace();
    }
  }

  /**
   * Finish the race and calculate final rankings
   */
  private finishRace(): void {
    if (!this.raceState) return;

    this.raceState.state = 'FINISHED';
    this.raceState.isFinished = true;

    // Sort swimmers by finish position
    const finishedSwimmers = this.raceState.swimmers
      .filter((s) => !s.isDNF && s.finishTime > 0)
      .sort((a, b) => a.finishTime - b.finishTime);

    // Assign final ranks
    finishedSwimmers.forEach((swimmer, index) => {
      swimmer.finishRank = index + 1;
    });

    // Set winner
    if (finishedSwimmers.length > 0) {
      this.raceState.winnerId = finishedSwimmers[0].id;
    }

    // Build leaderboard
    this.raceState.leaderboard = finishedSwimmers.map((swimmer) => ({
      rank: swimmer.finishRank,
      name: swimmer.name,
      time: swimmer.finishTime,
      pace: swimmer.finishTime > 0 ? (this.raceSetup!.distance / (swimmer.finishTime / 1000)) * 0.5 : 0, // simplified pace
    }));

    this.emit('raceFinished', this.raceState);
  }

  /**
   * Pause the race
   */
  public pauseRace(): void {
    this.isPaused = true;
    this.pausedTime = this.raceState?.currentTime || 0;
    this.emit('racePaused', this.pausedTime);
  }

  /**
   * Resume the race
   */
  public resumeRace(): void {
    this.isPaused = false;
    this.emit('raceResumed', this.pausedTime);
  }

  /**
   * Get current race state
   */
  public getRaceState(): IRaceState | null {
    return this.raceState;
  }

  /**
   * Get race setup
   */
  public getRaceSetup(): IRaceSetup | null {
    return this.raceSetup;
  }

  /**
   * Check if countdown is active
   */
  public isCountingDown(): boolean {
    return this.isCountdownRunning;
  }

  /**
   * Get countdown value (3, 2, 1, 0)
   */
  public getCountdownValue(): number {
    return this.countdownValue;
  }

  /**
   * Check if race is active
   */
  public isRaceActive(): boolean {
    return this.raceState?.state === 'RACING';
  }

  /**
   * Check if race is finished
   */
  public isRaceFinished(): boolean {
    return this.raceState?.state === 'FINISHED';
  }

  /**
   * Mark a swimmer as DNF (Did Not Finish)
   */
  public markSwimmerDNF(swimmerId: string, reason: string): void {
    if (!this.raceState) return;

    const swimmer = this.raceState.swimmers.find((s) => s.id === swimmerId);
    if (swimmer) {
      swimmer.isDNF = true;
      swimmer.finishTime = this.raceState.currentTime;
      this.emit('swimmerFinished', {
        name: swimmer.name + ' (DNF)',
        rank: 0,
        time: swimmer.finishTime,
      });
    }
  }

  /**
   * Cleanup and reset
   */
  public cleanup(): void {
    this.raceState = null;
    this.raceSetup = null;
    this.isCountdownRunning = false;
    this.isPaused = false;
    this.frameCount = 0;
  }
}

export default RaceController;
