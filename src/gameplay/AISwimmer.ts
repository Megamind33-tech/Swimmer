/**
 * AISwimmer
 * AI opponent behavior engine
 *
 * Features:
 * - Pacing strategies (aggressive, steady, conservative)
 * - Skill-based performance variation
 * - Reaction to player position
 * - Fatigue simulation
 * - Turn timing
 * - Stamina management
 *
 * Performance: <3ms per update per opponent
 */

import { IAISwimmer, ISwimmerRaceState } from '../types/index';

export interface AIBehavior {
  pacingStrategy: 'AGGRESSIVE' | 'STEADY' | 'CONSERVATIVE';
  startBurst: number; // 0-1.0, how hard to start
  endKick: number; // 0-1.0, how hard to finish
  reactivity: number; // 0-1.0, how fast to react to player
  consistency: number; // 0-1.0, how consistent pace is
}

/**
 * AISwimmer Class
 * Manages AI swimmer behavior during races
 */
export class AISwimmer {
  private swimmer: IAISwimmer;
  private behavior: AIBehavior;
  private raceState: ISwimmerRaceState;
  private lastPositionUpdate: number = 0;
  private targetPace: number = 0;
  private currentPace: number = 0;
  private paceVariation: number = 0;
  private errorMargin: number = 0;

  constructor(
    swimmer: IAISwimmer,
    raceDistance: number
  ) {
    this.swimmer = swimmer;
    this.raceState = {
      id: swimmer.id,
      name: swimmer.name,
      lane: 1,
      stats: swimmer.stats,
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
    };

    // Determine behavior based on skill tier
    this.behavior = this.calculateBehavior(swimmer.skillTier);

    // Calculate target pace (m/s)
    this.targetPace = this.calculateTargetPace(swimmer, raceDistance);
    this.currentPace = 0;

    // Random variation for realism
    this.paceVariation = 0;
    this.errorMargin = (1 - this.behavior.consistency) * 0.3; // up to 30% variation
  }

  /**
   * Calculate behavior based on skill tier (1-10)
   */
  private calculateBehavior(skillTier: number): AIBehavior {
    // Unskilled AI (1-3): Conservative, inconsistent
    if (skillTier <= 3) {
      return {
        pacingStrategy: 'CONSERVATIVE',
        startBurst: 0.5,
        endKick: 0.3,
        reactivity: 0.3,
        consistency: 0.5,
      };
    }

    // Intermediate AI (4-6): Steady, somewhat consistent
    if (skillTier <= 6) {
      return {
        pacingStrategy: 'STEADY',
        startBurst: 0.6,
        endKick: 0.6,
        reactivity: 0.6,
        consistency: 0.7,
      };
    }

    // Advanced AI (7-8): Aggressive, consistent
    if (skillTier <= 8) {
      return {
        pacingStrategy: 'AGGRESSIVE',
        startBurst: 0.8,
        endKick: 0.7,
        reactivity: 0.8,
        consistency: 0.85,
      };
    }

    // Elite AI (9-10): Very aggressive, extremely consistent
    return {
      pacingStrategy: 'AGGRESSIVE',
      startBurst: 0.95,
      endKick: 0.95,
      reactivity: 0.95,
      consistency: 0.95,
    };
  }

  /**
   * Calculate target pace based on stats and race distance
   */
  private calculateTargetPace(swimmer: IAISwimmer, raceDistance: number): number {
    // Base pace from speed stat (1-20 scale)
    const basePace = (swimmer.stats.speed / 10) * 2.5; // 0.25 m/s to 5 m/s

    // Distance modifier (longer distances = slightly slower)
    const distanceModifier = raceDistance > 200 ? 0.95 : raceDistance > 100 ? 0.98 : 1.0;

    // Specialty modifier
    const specialtyModifier = swimmer.specialty === 'SPRINTER' ? 1.1 : swimmer.specialty === 'DISTANCE' ? 0.95 : 1.0;

    return basePace * distanceModifier * specialtyModifier;
  }

  /**
   * Update AI swimmer position each frame
   */
  public update(
    deltaTime: number,
    playerPosition: number,
    raceDistance: number,
    currentTime: number
  ): void {
    // Calculate phase in race (0-1)
    const raceProgress = Math.min(1, this.raceState.position / raceDistance);

    // Adjust pace based on race phase
    let paceMultiplier = 1.0;

    // Start burst (first 10% of race)
    if (raceProgress < 0.1) {
      paceMultiplier = 0.8 + this.behavior.startBurst * 0.5;
    }
    // End kick (last 10% of race)
    else if (raceProgress > 0.9) {
      paceMultiplier = 0.9 + this.behavior.endKick * 0.4;
    }
    // React to player position
    else if (Math.abs(this.raceState.position - playerPosition) < 5) {
      // Player is close, increase intensity
      paceMultiplier = 1.0 + this.behavior.reactivity * 0.2;
    }

    // Add pace variation (realistic inconsistency)
    this.paceVariation += (Math.random() - 0.5) * this.errorMargin * 0.1;
    this.paceVariation = Math.max(-this.errorMargin, Math.min(this.errorMargin, this.paceVariation));

    // Calculate current pace
    this.currentPace = this.targetPace * paceMultiplier * (1 + this.paceVariation);

    // Stamina drain
    const baseDrain = 0.5; // base drain per second
    const staminaDrain = baseDrain * (1 + (this.currentPace / this.targetPace - 1) * 0.5); // more speed = more drain
    this.raceState.stamina = Math.max(0, this.raceState.stamina - (staminaDrain * deltaTime) / 1000);

    // If stamina too low, slow down
    if (this.raceState.stamina < 20) {
      this.currentPace *= 0.7;
      this.raceState.stamina = Math.min(100, this.raceState.stamina + (0.5 * deltaTime) / 1000);
    }

    // Update position
    this.raceState.position += (this.currentPace * deltaTime) / 1000;
    this.raceState.velocity = this.currentPace;

    // Recover oxygen at surface
    if (!this.raceState.isUnderwater) {
      this.raceState.oxygen = Math.min(100, this.raceState.oxygen + (1.0 * deltaTime) / 1000);
    } else {
      this.raceState.diveTime += deltaTime / 1000;
      this.raceState.oxygen = Math.max(0, this.raceState.oxygen - (0.5 * deltaTime) / 1000);
    }

    // Force surface if oxygen critical
    if (this.raceState.oxygen < 10) {
      this.raceState.isUnderwater = false;
    }

    // Check if finished
    if (this.raceState.position >= raceDistance && !this.raceState.isDNF && this.raceState.finishTime === 0) {
      this.raceState.finishTime = currentTime;
    }
  }

  /**
   * Get current race state
   */
  public getRaceState(): ISwimmerRaceState {
    return this.raceState;
  }

  /**
   * Get AI swimmer info
   */
  public getSwimmer(): IAISwimmer {
    return this.swimmer;
  }

  /**
   * Get current pace
   */
  public getCurrentPace(): number {
    return this.currentPace;
  }

  /**
   * Get target pace
   */
  public getTargetPace(): number {
    return this.targetPace;
  }

  /**
   * Get behavior
   */
  public getBehavior(): AIBehavior {
    return this.behavior;
  }

  /**
   * Set lane
   */
  public setLane(lane: number): void {
    this.raceState.lane = lane;
  }

  /**
   * Mark as DNF
   */
  public markDNF(time: number): void {
    this.raceState.isDNF = true;
    this.raceState.finishTime = time;
  }

  /**
   * Reset for new race
   */
  public reset(): void {
    this.raceState.position = 0;
    this.raceState.velocity = 0;
    this.raceState.stamina = 100;
    this.raceState.oxygen = 100;
    this.raceState.diveTime = 0;
    this.raceState.isUnderwater = false;
    this.raceState.rotationAngle = 0;
    this.raceState.currentStrokePhase = 0;
    this.raceState.lapCount = 0;
    this.raceState.splitsTime = [];
    this.raceState.lapTimes = [];
    this.raceState.isDNF = false;
    this.raceState.finishTime = 0;
    this.raceState.finishRank = 0;
    this.paceVariation = 0;
  }
}

export default AISwimmer;
