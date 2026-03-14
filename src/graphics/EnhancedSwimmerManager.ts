/**
 * SWIMMER GAME - EnhancedSwimmerManager
 * Integrates SwimmerPersonalityManager with SwimmerManager
 * Handles personality, clothing, coaches, warm-ups, and dialogue
 */

import * as BABYLON from '@babylonjs/core';
import SwimmerManager from './SwimmerManager';
import SwimmerPersonalityManager from './SwimmerPersonalityManager';
import SWIMMER_PROFILES, { SwimmerProfile } from './SwimmerProfile';
import { logger } from '../utils';

export class EnhancedSwimmerManager {
  private scene: BABYLON.Scene;
  private swimmerManager: SwimmerManager;
  private personalityManager: SwimmerPersonalityManager;
  private swimmerProfiles: Map<number, SwimmerProfile> = new Map();
  private warmupActive: boolean = false;
  private warmupStartTime: number = 0;
  private laneCount: number;

  constructor(scene: BABYLON.Scene, poolWidth: number, laneCount: number) {
    this.scene = scene;
    this.laneCount = laneCount;
    this.swimmerManager = new SwimmerManager(scene, poolWidth, laneCount);
    this.personalityManager = new SwimmerPersonalityManager(scene);
    this.initializeProfiles();
  }

  /**
   * Initialize swimmer profiles
   */
  private initializeProfiles(): void {
    SWIMMER_PROFILES.forEach((profile) => {
      this.swimmerProfiles.set(profile.id, profile);
    });
    logger.log(`Initialized ${this.swimmerProfiles.size} swimmer profiles`);
  }

  /**
   * Initialize all swimmers with personality
   */
  public async initialize(): Promise<void> {
    try {
      // Initialize base swimmer manager
      await this.swimmerManager.initialize();
      logger.log('SwimmerManager initialized');

      // Apply personality to each swimmer
      for (let i = 0; i < this.laneCount; i++) {
        const profile = this.swimmerProfiles.get(i);
        if (profile) {
          this.applyPersonalityToSwimmer(i, profile);
        }
      }

      logger.log('EnhancedSwimmerManager initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize EnhancedSwimmerManager:', error);
      throw error;
    }
  }

  /**
   * Apply personality profile to swimmer
   */
  private applyPersonalityToSwimmer(laneIndex: number, profile: SwimmerProfile): void {
    const swimmerInstance = this.swimmerManager.getSwimmer(laneIndex);
    if (!swimmerInstance) return;

    // Update swimmer colors from profile
    this.swimmerManager.setSwimmerSuitColor(laneIndex, profile.clothing.suitColor);

    // Create personalized entity with coach
    const entity = this.personalityManager.createPersonalizedSwimmer(profile);

    logger.log(
      `Applied personality to swimmer ${profile.id} (${profile.name}) - Coach: ${profile.coach.name}`
    );
  }

  /**
   * Start warm-up sequence for all swimmers
   */
  public startWarmup(): void {
    if (this.warmupActive) {
      logger.warn('Warm-up already in progress');
      return;
    }

    this.warmupActive = true;
    this.warmupStartTime = performance.now() / 1000;

    // Start warm-up for each swimmer
    for (let i = 0; i < this.laneCount; i++) {
      this.personalityManager.startWarmup(i);
    }

    logger.log('Warm-up sequence started for all swimmers');
  }

  /**
   * Update warm-up animations
   */
  public updateWarmup(): {
    allComplete: boolean;
    avgProgress: number;
  } {
    if (!this.warmupActive) {
      return { allComplete: true, avgProgress: 1 };
    }

    let totalProgress = 0;
    let completeCount = 0;

    for (let i = 0; i < this.laneCount; i++) {
      const result = this.personalityManager.updateWarmup(i, 0.016); // ~60fps deltaTime
      totalProgress += result.progress;

      if (result.isComplete) {
        completeCount++;
      }
    }

    const avgProgress = totalProgress / this.laneCount;
    const allComplete = completeCount === this.laneCount;

    if (allComplete) {
      this.warmupActive = false;
      logger.log('Warm-up sequence completed');
    }

    return { allComplete, avgProgress };
  }

  /**
   * Check if warm-up is active
   */
  public isWarmupActive(): boolean {
    return this.warmupActive;
  }

  /**
   * Get swimmer profile by lane
   */
  public getSwimmerProfile(laneIndex: number): SwimmerProfile | undefined {
    return this.swimmerProfiles.get(laneIndex);
  }

  /**
   * Get all swimmer profiles
   */
  public getAllSwimmerProfiles(): SwimmerProfile[] {
    return Array.from(this.swimmerProfiles.values());
  }

  /**
   * Show dialogue from swimmer
   */
  public showSwimmerDialogue(laneIndex: number, text: string, duration?: number): void {
    this.personalityManager.showSwimmerDialogue(laneIndex, text, duration);
  }

  /**
   * Show dialogue from coach
   */
  public showCoachDialogue(laneIndex: number, text: string, duration?: number): void {
    this.personalityManager.showCoachDialogue(laneIndex, text, duration);
  }

  /**
   * Get personality manager for direct access
   */
  public getPersonalityManager(): SwimmerPersonalityManager {
    return this.personalityManager;
  }

  /**
   * Get base swimmer manager for direct access
   */
  public getBaseSwimmerManager(): SwimmerManager {
    return this.swimmerManager;
  }

  /**
   * Update all systems
   */
  public update(): void {
    this.personalityManager.update();
  }

  /**
   * Dispose all resources
   */
  public dispose(): void {
    this.personalityManager.dispose();
    this.swimmerManager.dispose();
    this.swimmerProfiles.clear();
  }
}

export default EnhancedSwimmerManager;
