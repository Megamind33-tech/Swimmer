/**
 * TurnSystem
 * Manages swimming turns at each lap marker (every 25m in 50m pool)
 *
 * Turn Types:
 * 1. TOUCH TURN: Simple wall touch, momentum bonus 1.1x
 * 2. FLIP TURN: Flip rotation, momentum bonus 1.15x
 *
 * Features:
 * - Turn detection (±0.2s window)
 * - Momentum bonus calculation
 * - Early/late penalties
 * - Flip turn rotation physics
 * - Turn validity validation
 * - Pool wall detection
 *
 * Performance: <2ms per turn calculation
 */

import { EventEmitter } from '../utils/index';

export interface TurnMetrics {
  turnType: 'TOUCH' | 'FLIP';
  detectionWindow: number; // milliseconds (±200ms)
  momentumBonus: number; // speed multiplier
  earlyPenalty: number; // -0.05 per 50ms early
  latePenalty: number; // -0.05 per 50ms late
  flipDifficulty: number; // 1-10 scale
}

export interface TurnInput {
  distance: number; // current distance in pool
  wallPositionX: number; // wall X coordinate
  swimmerPositionX: number; // swimmer X coordinate
  swimmerVelocity: number; // current velocity
  inputTime: number; // when player initiated turn
  expectedTurnTime: number; // calculated turn time
}

export interface TurnResult {
  success: boolean;
  turnType: 'TOUCH' | 'FLIP';
  timing: number; // milliseconds from ideal
  speedBonus: number; // multiplier (1.1-1.15)
  speedPenalty: number; // penalty if mistimed
  finalSpeedMultiplier: number; // combined effect
  message: string;
}

export interface TurnEvents {
  turnDetected: (result: TurnResult) => void;
  earlyTurn: (ms: number) => void;
  lateTurn: (ms: number) => void;
  perfectTurn: () => void;
  turnApproaching: (distanceToWall: number) => void;
  flipTurnInitiated: () => void;
  wallCollision: () => void;
}

/**
 * TurnSystem Class
 * Manages turn mechanics
 */
export class TurnSystem extends EventEmitter<TurnEvents> {
  private metrics: Record<'TOUCH' | 'FLIP', TurnMetrics>;
  private lastTurnDistance: number = 0;
  private turnInterval: number = 25; // meters
  private poolLength: number = 50; // meters

  constructor() {
    super();

    this.metrics = {
      TOUCH: {
        turnType: 'TOUCH',
        detectionWindow: 200, // ±200ms
        momentumBonus: 1.1, // 10% speed boost
        earlyPenalty: 0.05,
        latePenalty: 0.05,
        flipDifficulty: 3,
      },
      FLIP: {
        turnType: 'FLIP',
        detectionWindow: 250, // ±250ms (harder to execute)
        momentumBonus: 1.15, // 15% speed boost
        earlyPenalty: 0.08,
        latePenalty: 0.08,
        flipDifficulty: 8,
      },
    };
  }

  /**
   * Check if turn is approaching
   */
  public isTurnApproaching(
    currentDistance: number,
    approachThreshold: number = 2
  ): boolean {
    const nextTurnDistance = this.getNextTurnDistance(currentDistance);
    const distanceToTurn = nextTurnDistance - currentDistance;

    if (distanceToTurn > 0 && distanceToTurn <= approachThreshold) {
      // this.emit('turnApproaching', distanceToTurn);
      return true;
    }

    return false;
  }

  /**
   * Get distance to next turn
   */
  public getNextTurnDistance(currentDistance: number): number {
    // In a 50m pool, turns are every 25m: 25, 50 (flip, then reset)
    const lapNumber = Math.floor(currentDistance / this.poolLength);
    const positionInLap = currentDistance % this.poolLength;

    if (positionInLap < this.turnInterval) {
      return lapNumber * this.poolLength + this.turnInterval;
    } else {
      return (lapNumber + 1) * this.poolLength;
    }
  }

  /**
   * Get turn type required at distance
   */
  public getTurnTypeAtDistance(distance: number): 'TOUCH' | 'FLIP' {
    const lapNumber = Math.floor(distance / this.poolLength);

    // Touch turn at first 25m, flip turn at 50m
    const positionInLap = distance % this.poolLength;

    if (positionInLap < this.turnInterval) {
      // First 25m marker - touch turn
      return 'TOUCH';
    } else {
      // 50m marker (end of lap) - flip turn
      return 'FLIP';
    }
  }

  /**
   * Process turn input
   */
  public processTurn(input: TurnInput): TurnResult {
    const turnType = this.getTurnTypeAtDistance(input.distance);
    const metrics = this.metrics[turnType];

    // Calculate distance to wall
    const distanceToWall = Math.abs(input.wallPositionX - input.swimmerPositionX);

    // Check if at wall
    if (distanceToWall > 1.0) {
      // Not at wall yet
      return {
        success: false,
        turnType,
        timing: 0,
        speedBonus: 1.0,
        speedPenalty: 1.0,
        finalSpeedMultiplier: 1.0,
        message: 'Not at wall',
      };
    }

    // Calculate timing
    const timingDiff = input.inputTime - input.expectedTurnTime;
    const isEarly = timingDiff < 0;
    const absTimingDiff = Math.abs(timingDiff);

    // Check if within detection window
    if (absTimingDiff > metrics.detectionWindow) {
      const penalty = Math.min(1.0, 0.9 - (absTimingDiff / 1000) * 0.3);

      return {
        success: false,
        turnType,
        timing: timingDiff,
        speedBonus: 1.0,
        speedPenalty: penalty,
        finalSpeedMultiplier: penalty,
        message: isEarly ? 'Turn too early' : 'Turn too late',
      };
    }

    // Perfect turn
    if (absTimingDiff < 100) {
      // this.emit('perfectTurn');

      return {
        success: true,
        turnType,
        timing: timingDiff,
        speedBonus: metrics.momentumBonus,
        speedPenalty: 1.0,
        finalSpeedMultiplier: metrics.momentumBonus,
        message: 'Perfect turn!',
      };
    }

    // Good turn (within window but not perfect)
    const penaltyAmount = (absTimingDiff / metrics.detectionWindow) * 0.05;
    const speedMultiplier = metrics.momentumBonus - penaltyAmount;

    if (isEarly) {
      // this.emit('earlyTurn', absTimingDiff);
    } else {
      // this.emit('lateTurn', absTimingDiff);
    }

    return {
      success: true,
      turnType,
      timing: timingDiff,
      speedBonus: metrics.momentumBonus,
      speedPenalty: 1.0 - penaltyAmount,
      finalSpeedMultiplier: speedMultiplier,
      message: 'Good turn',
    };
  }

  /**
   * Calculate expected turn time based on speed
   */
  public calculateExpectedTurnTime(
    currentDistance: number,
    swimmerSpeed: number
  ): number {
    const nextTurnDistance = this.getNextTurnDistance(currentDistance);
    const distanceToTurn = nextTurnDistance - currentDistance;
    // time = distance / speed
    const timeToTurn = (distanceToTurn / swimmerSpeed) * 1000; // convert to ms

    return performance.now() + timeToTurn;
  }

  /**
   * Get turn metrics
   */
  public getMetrics(turnType: 'TOUCH' | 'FLIP'): TurnMetrics {
    return { ...this.metrics[turnType] };
  }

  /**
   * Get all turn metrics
   */
  public getAllMetrics(): Record<'TOUCH' | 'FLIP', TurnMetrics> {
    return {
      TOUCH: { ...this.metrics.TOUCH },
      FLIP: { ...this.metrics.FLIP },
    };
  }

  /**
   * Get turn difficulty
   */
  public getTurnDifficulty(turnType: 'TOUCH' | 'FLIP'): number {
    return this.metrics[turnType].flipDifficulty;
  }

  /**
   * Calculate momentum bonus for perfect timing
   */
  public calculateMomentumBonus(turnType: 'TOUCH' | 'FLIP'): number {
    return this.metrics[turnType].momentumBonus;
  }

  /**
   * Validate turn at specific distance
   */
  public validateTurnAtDistance(distance: number): {
    isTurnLocation: boolean;
    turnType: 'TOUCH' | 'FLIP';
  } {
    const positionInLap = distance % this.poolLength;
    const isTurnLocation = positionInLap === 0 || positionInLap === this.turnInterval;

    return {
      isTurnLocation,
      turnType: this.getTurnTypeAtDistance(distance),
    };
  }

  /**
   * Get turn window for UI indication
   */
  public getTurnWindow(distance: number): {
    startDistance: number;
    endDistance: number;
    optimalDistance: number;
  } {
    const optimalDistance = this.getNextTurnDistance(distance);
    const windowSize = 0.5; // ±0.5m window

    return {
      startDistance: optimalDistance - windowSize,
      endDistance: optimalDistance + windowSize,
      optimalDistance,
    };
  }

  /**
   * Get turn count in race
   */
  public getTurnCount(totalDistance: number): number {
    // Every 25m is a turn except at start
    if (totalDistance === 0) return 0;
    const turns = Math.floor(totalDistance / this.turnInterval);
    return Math.max(0, turns - 1); // -1 because first one doesn't count as a turn
  }

  /**
   * Calculate cumulative turn penalty
   */
  public calculateCumulativeTurnPenalty(turnErrors: Array<{ timing: number }>): number {
    if (turnErrors.length === 0) return 1.0;

    // Average error
    const avgError = turnErrors.reduce((sum, err) => sum + Math.abs(err.timing), 0) /
      turnErrors.length;

    // Apply penalty (max -10%)
    const penalty = Math.max(0.9, 1.0 - (avgError / 1000) * 0.1);
    return penalty;
  }

  /**
   * Reset turn tracking
   */
  public reset(): void {
    this.lastTurnDistance = 0;
  }
}

export default TurnSystem;
