/**
 * StrokeSystem
 * Manages all 4 Olympic swimming strokes with unique mechanics
 *
 * Strokes:
 * 1. FREESTYLE (Crawl): 2 taps/cycle, 3-4s underwater, fastest
 * 2. BUTTERFLY: 1 tap/cycle, 4-5s underwater, hardest
 * 3. BREASTSTROKE: 1 tap/cycle, 2-3s underwater, easiest
 * 4. BACKSTROKE: 2 taps/cycle, 3-4s underwater, medium
 *
 * Features:
 * - Stroke rhythm calculation
 * - Stamina drain rates per stroke
 * - Breathing cycle management
 * - Turn type requirements
 * - Difficulty ratings
 *
 * Performance: <2ms per stroke calculation
 */

import { SwimmingStroke } from '../types/index';
import { EventEmitter } from '../utils/index';

export interface StrokeMetrics {
  stroke: SwimmingStroke;
  tapsPerCycle: number;
  underWaterDuration: number; // seconds
  breathingInterval: number; // cycles
  staminaDrain: number; // per tap
  difficulty: number; // 1-10
  turnType: 'TOUCH' | 'FLIP';
  maxBreathHoldDuration: number; // seconds
  speedMultiplier: number; // 1.0 = baseline
}

export interface StrokeState {
  currentStroke: SwimmingStroke;
  cycleProgress: number; // 0-1
  tapCount: number;
  isUnderwater: boolean;
  breatheNextCycle: boolean;
  cycleStartTime: number;
  totalTaps: number;
  perfectTaps: number;
  missedTaps: number;
}

export interface StrokeEvents {
  strokeChanged: SwimmingStroke;
  cycleComplete: { taps: number; accuracy: number };
  tapDetected: number;
  breathingCycleStart: void;
  breathingCycleEnd: void;
  underwaterPhaseStart: void;
  underwaterPhaseEnd: void;
  strokeDifficulty: number;
}

/**
 * StrokeSystem Class
 * Manages stroke mechanics and rhythm
 */
export class StrokeSystem extends EventEmitter<StrokeEvents> {
  private metrics: Record<SwimmingStroke, StrokeMetrics>;
  private state: StrokeState;
  private tapWindow: number = 150; // ±150ms for perfect tap
  private cycleTimer: number = 0;

  constructor() {
    super();

    // Initialize stroke metrics
    this.metrics = {
      FREESTYLE: {
        stroke: 'FREESTYLE',
        tapsPerCycle: 2,
        underWaterDuration: 3.5,
        breathingInterval: 2,
        staminaDrain: 0.5,
        difficulty: 5,
        turnType: 'TOUCH',
        maxBreathHoldDuration: 8,
        speedMultiplier: 1.0,
      },
      BUTTERFLY: {
        stroke: 'BUTTERFLY',
        tapsPerCycle: 1,
        underWaterDuration: 4.5,
        breathingInterval: 2,
        staminaDrain: 0.8,
        difficulty: 9,
        turnType: 'FLIP',
        maxBreathHoldDuration: 6,
        speedMultiplier: 0.95,
      },
      BREASTSTROKE: {
        stroke: 'BREASTSTROKE',
        tapsPerCycle: 1,
        underWaterDuration: 2.5,
        breathingInterval: 1,
        staminaDrain: 0.4,
        difficulty: 2,
        turnType: 'TOUCH',
        maxBreathHoldDuration: 4,
        speedMultiplier: 0.85,
      },
      BACKSTROKE: {
        stroke: 'BACKSTROKE',
        tapsPerCycle: 2,
        underWaterDuration: 3.5,
        breathingInterval: 2,
        staminaDrain: 0.6,
        difficulty: 6,
        turnType: 'FLIP',
        maxBreathHoldDuration: 7,
        speedMultiplier: 0.98,
      },
      IM: {
        stroke: 'IM',
        tapsPerCycle: 2,
        underWaterDuration: 3.8,
        breathingInterval: 2,
        staminaDrain: 0.65,
        difficulty: 8,
        turnType: 'FLIP',
        maxBreathHoldDuration: 6.5,
        speedMultiplier: 0.92,
      },
    };

    // Initialize state
    this.state = {
      currentStroke: 'FREESTYLE',
      cycleProgress: 0,
      tapCount: 0,
      isUnderwater: true,
      breatheNextCycle: false,
      cycleStartTime: 0,
      totalTaps: 0,
      perfectTaps: 0,
      missedTaps: 0,
    };
  }

  /**
   * Set current stroke
   */
  public setStroke(stroke: SwimmingStroke): void {
    const previousStroke = this.state.currentStroke;
    this.state.currentStroke = stroke;
    this.state.tapCount = 0;
    this.state.cycleProgress = 0;

    // Emit events (actual subscribers would be attached in game loop)
    this.emit('strokeChanged', stroke);
    this.emit('strokeDifficulty', this.metrics[stroke].difficulty);

    // Reset tap counter
    this.state.totalTaps = 0;
    this.state.perfectTaps = 0;
    this.state.missedTaps = 0;
  }

  /**
   * Get current stroke metrics
   */
  public getMetrics(stroke?: SwimmingStroke): StrokeMetrics {
    const targetStroke = stroke || this.state.currentStroke;
    return this.metrics[targetStroke];
  }

  /**
   * Get all stroke metrics
   */
  public getAllMetrics(): Record<SwimmingStroke, StrokeMetrics> {
    return { ...this.metrics };
  }

  /**
   * Register tap input
   */
  public registerTap(tapTime: number): {
    isAccurate: boolean;
    accuracy: number;
  } {
    const currentMetrics = this.metrics[this.state.currentStroke];
    const expectedTapTime = this.calculateExpectedTapTime();
    const timeDiff = Math.abs(tapTime - expectedTapTime);
    const isAccurate = timeDiff <= this.tapWindow;

    const accuracy = Math.max(0, 100 - (timeDiff / this.tapWindow) * 100);

    this.state.totalTaps++;
    if (isAccurate) {
      this.state.perfectTaps++;
    } else {
      this.state.missedTaps++;
    }

    this.emit('tapDetected', accuracy);

    // Check if cycle complete
    if (this.state.tapCount >= currentMetrics.tapsPerCycle) {
      this.completeCycle();
    }

    return {
      isAccurate,
      accuracy,
    };
  }

  /**
   * Calculate expected tap time based on cycle progress
   */
  private calculateExpectedTapTime(): number {
    const currentMetrics = this.metrics[this.state.currentStroke];
    const cycleTime = this.calculateCycleTime();
    const tapInterval = cycleTime / currentMetrics.tapsPerCycle;

    return (this.state.tapCount + 1) * tapInterval;
  }

  /**
   * Calculate total cycle time
   */
  public calculateCycleTime(): number {
    const metrics = this.metrics[this.state.currentStroke];
    // Cycle time = underwater duration + breathing + arm recovery
    // Approximate: 3-5 seconds depending on stroke
    return metrics.underWaterDuration + 1.5; // 1.5s for recovery/breathing
  }

  /**
   * Update stroke cycle progress
   */
  public updateCycleProgress(deltaTime: number): number {
    const cycleTime = this.calculateCycleTime();
    this.cycleTimer += deltaTime;

    const progress = (this.cycleTimer % cycleTime) / cycleTime;
    this.state.cycleProgress = progress;

    // Detect underwater phase
    const metrics = this.metrics[this.state.currentStroke];
    const underwaterEnd = metrics.underWaterDuration / cycleTime;
    const wasUnderwater = this.state.isUnderwater;

    this.state.isUnderwater = progress < underwaterEnd;

    if (!wasUnderwater && this.state.isUnderwater) {
      this.emit('underwaterPhaseStart', undefined);
    } else if (wasUnderwater && !this.state.isUnderwater) {
      this.emit('underwaterPhaseEnd', undefined);
    }

    return progress;
  }

  /**
   * Complete a cycle
   */
  private completeCycle(): void {
    const cycleAccuracy = this.state.perfectTaps / this.state.totalTaps;
    this.emit('cycleComplete', {
      taps: this.state.perfectTaps,
      accuracy: cycleAccuracy,
    });

    // Reset tap counter for next cycle
    this.state.tapCount = 0;
  }

  /**
   * Get breathing interval in taps
   */
  public getBreathingInterval(): number {
    const metrics = this.metrics[this.state.currentStroke];
    return metrics.breathingInterval;
  }

  /**
   * Should breathe this cycle
   */
  public shouldBreathe(): boolean {
    const breathingInterval = this.getBreathingInterval();
    // Breathing every N cycles
    return (Math.floor(this.cycleTimer / this.calculateCycleTime()) %
      breathingInterval) === 0;
  }

  /**
   * Get stamina drain for current stroke
   */
  public getStaminaDrain(): number {
    const metrics = this.metrics[this.state.currentStroke];
    return metrics.staminaDrain;
  }

  /**
   * Get speed multiplier for current stroke
   */
  public getSpeedMultiplier(): number {
    const metrics = this.metrics[this.state.currentStroke];
    return metrics.speedMultiplier;
  }

  /**
   * Get difficulty of current stroke
   */
  public getDifficulty(): number {
    const metrics = this.metrics[this.state.currentStroke];
    return metrics.difficulty;
  }

  /**
   * Get required turn type
   */
  public getTurnType(): 'TOUCH' | 'FLIP' {
    const metrics = this.metrics[this.state.currentStroke];
    return metrics.turnType;
  }

  /**
   * Get max breath hold duration
   */
  public getMaxBreathHoldDuration(): number {
    const metrics = this.metrics[this.state.currentStroke];
    return metrics.maxBreathHoldDuration;
  }

  /**
   * Get current stroke state
   */
  public getState(): StrokeState {
    return { ...this.state };
  }

  /**
   * Get current accuracy percentage
   */
  public getAccuracy(): number {
    if (this.state.totalTaps === 0) return 100;
    return (this.state.perfectTaps / this.state.totalTaps) * 100;
  }

  /**
   * Get stroke ranking by difficulty
   */
  public getRankingByDifficulty(): Array<{
    stroke: SwimmingStroke;
    difficulty: number;
  }> {
    const strokes: SwimmingStroke[] = ['BREASTSTROKE', 'FREESTYLE', 'BACKSTROKE', 'BUTTERFLY'];
    return strokes
      .map((stroke) => ({
        stroke,
        difficulty: this.metrics[stroke].difficulty,
      }))
      .sort((a, b) => a.difficulty - b.difficulty);
  }

  /**
   * Check if stroke is valid for distance
   */
  public isStrokeValidForDistance(stroke: SwimmingStroke, distance: number): boolean {
    // All strokes valid for all distances in this implementation
    // Could be expanded for specific event restrictions
    return true;
  }

  /**
   * Get recommended breathing pattern
   */
  public getRecommendedBreathingPattern(): {
    interval: number;
    description: string;
  } {
    const metrics = this.metrics[this.state.currentStroke];

    const patterns = {
      FREESTYLE: { interval: 2, description: 'Every 2nd arm cycle' },
      BUTTERFLY: { interval: 2, description: 'Every 2 full cycles' },
      BREASTSTROKE: { interval: 1, description: 'Every cycle (mandatory)' },
      BACKSTROKE: { interval: 2, description: 'Every 2nd arm cycle' },
    };

    return patterns[this.state.currentStroke];
  }

  /**
   * Reset state
   */
  public reset(): void {
    this.state = {
      currentStroke: this.state.currentStroke,
      cycleProgress: 0,
      tapCount: 0,
      isUnderwater: true,
      breatheNextCycle: false,
      cycleStartTime: 0,
      totalTaps: 0,
      perfectTaps: 0,
      missedTaps: 0,
    };
    this.cycleTimer = 0;
  }
}

export default StrokeSystem;
