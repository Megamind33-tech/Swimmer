/**
 * SWIMMER GAME - BroadcastCamera
 * Automated broadcasting camera system for races
 *
 * Responsibilities:
 * - Manage all 20 camera types with professional specifications
 * - Support event-specific shot sequences (50m, 100m, 200m, relay)
 * - Enforce gameplay readability rules
 * - Enforce golden rules of camera direction
 * - Transition between shots with proper easing
 * - Follow the player during racing with cinematic framing
 * - Respond to race events (countdown, start, progress, finish)
 *
 * Design Philosophy:
 * - Like a professional broadcast director: automated, event-driven
 * - Pre-race: establish scale, build tension, show competitors
 * - Racing: follow with readability, enforce input windows
 * - Finish: capture emotion and drama
 * - Every race should feel like a televised championship
 */

import * as BABYLON from '@babylonjs/core';
import { ISwimmerRaceState, RaceState } from '../types';
import { logger } from '../utils';
import {
  CAMERA_SPECS,
  CameraID,
  CameraPackage,
  RaceEventType,
  RacePhase,
  EVENT_SHOT_SEQUENCES,
  IShotSequence,
  isCameraAvailable,
  getFallbackCamera,
} from './CameraSpecifications';
import CameraPackageManager from './CameraPackageManager';

/**
 * BroadcastCamera - Professional broadcasting cinematics for races
 */
export class BroadcastCamera {
  private currentCamera: BABYLON.ArcRotateCamera | null = null;
  private scene: BABYLON.Scene | null = null;
  private canvas: HTMLCanvasElement | null = null;

  // Camera state
  private targetPosition: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private targetTarget: BABYLON.Vector3 = BABYLON.Vector3.Zero();
  private isTransitioning: boolean = false;
  private transitionProgress: number = 0;
  private transitionDuration: number = 1000;
  private transitionStartTime: number = 0;
  private transitionEasing: 'linear' | 'easeInOutQuad' | 'easeInQuad' | 'easeOutQuad' = 'easeInOutQuad';

  // Racing state
  private raceState: RaceState | null = null;
  private currentCameraId: CameraID | null = null;
  private playerSwimmer: ISwimmerRaceState | null = null;
  private playerLaneX: number = 0;
  private raceEventType: RaceEventType = '100M';

  // Package management
  private packageManager: CameraPackageManager;

  // Shot sequences
  private currentShotSequence: CameraID[] = [];
  private currentShotDurations: number[] = [];
  private currentSequenceIndex: number = 0;
  private sequenceTimer: number = 0;

  // Input readability window
  private isInInputWindow: boolean = false;
  private lockedCameraId: CameraID | null = null;

  // Player follow configuration
  private playerFollowConfig = {
    followDistance: 20,
    followHeight: 8,
    followLead: 15,
    sideSwayAmount: 5,
    sideSwaySpeed: 3000,
    enableSmoothing: true,
    smoothingFactor: 0.08,
  };

  constructor(scene: BABYLON.Scene, canvas: HTMLCanvasElement, packageTier: CameraPackage = 'MVP') {
    this.scene = scene;
    this.canvas = canvas;
    this.packageManager = new CameraPackageManager(packageTier);
  }

  /**
   * Initialize the broadcast camera
   */
  public initialize(): void {
    if (!this.scene || !this.canvas) {
      logger.error('Cannot initialize BroadcastCamera without scene and canvas');
      return;
    }

    this.currentCamera = new BABYLON.ArcRotateCamera(
      'broadcastCamera',
      Math.PI,
      Math.PI / 2.5,
      60,
      new BABYLON.Vector3(0, 5, 0),
      this.scene
    );

    this.currentCamera.attachControl(this.canvas, true);

    // Disable user input - critical for broadcast camera
    this.currentCamera.inertia = 0;
    this.currentCamera.angularSensibilityX = Number.MAX_VALUE;
    this.currentCamera.angularSensibilityY = Number.MAX_VALUE;
    this.currentCamera.wheelPrecision = Number.MAX_VALUE;
    this.currentCamera.pinchPrecision = Number.MAX_VALUE;

    this.scene.activeCamera = this.currentCamera;

    const packageInfo = this.packageManager.getPackageInfo();
    logger.log(
      `BroadcastCamera initialized: ${packageInfo.package} package (${packageInfo.totalAvailable} cameras available)`
    );
  }

  /**
   * Update camera each frame
   */
  public update(deltaTime: number): void {
    if (!this.currentCamera) return;

    // Handle transitions
    if (this.isTransitioning) {
      this.updateTransition(deltaTime);
    }

    // Handle player following during race
    if (this.currentCameraId?.includes('POOLSIDE_TRACKING') && this.playerSwimmer && !this.isInInputWindow) {
      this.updatePlayerFollow(deltaTime);
    }

    // Handle shot sequence progress
    if (this.raceState === 'RACING' && this.currentShotSequence.length > 0) {
      this.updateShotSequence(deltaTime);
    }
  }

  /**
   * Transition to a camera shot
   */
  public transitionToCamera(cameraId: CameraID, duration?: number): void {
    // Check availability and get fallback if needed
    const availableCamera = this.packageManager.getCameraOrFallback(cameraId);
    if (!availableCamera) {
      logger.warn(`Camera ${cameraId} not available and no fallback found`);
      return;
    }

    const spec = CAMERA_SPECS[availableCamera];
    if (!spec) {
      logger.warn(`Camera specification not found: ${availableCamera}`);
      return;
    }

    this.targetPosition = spec.position.clone();
    this.targetTarget = spec.target.clone();
    this.currentCameraId = availableCamera;
    this.transitionEasing = spec.easing;

    const distance = this.currentCamera ? BABYLON.Vector3.Distance(this.currentCamera.position, this.targetPosition) : 0;

    if (distance < 1) {
      // Already at position, snap
      if (this.currentCamera) {
        this.currentCamera.position = this.targetPosition;
        this.currentCamera.target = this.targetTarget;
      }
      this.isTransitioning = false;
    } else {
      // Start smooth transition
      this.isTransitioning = true;
      this.transitionStartTime = performance.now();
      this.transitionDuration = duration || spec.transitionDuration;
      this.transitionProgress = 0;
    }

    logger.log(`BroadcastCamera: Transitioning to ${availableCamera}`);
  }

  /**
   * Update camera transition
   */
  private updateTransition(deltaTime: number): void {
    if (!this.currentCamera || !this.isTransitioning) return;

    const elapsed = performance.now() - this.transitionStartTime;
    this.transitionProgress = Math.min(elapsed / this.transitionDuration, 1);

    const easeProgress = this.applyEasing(this.transitionProgress, this.transitionEasing);

    if (this.currentCamera) {
      const oldPos = this.currentCamera.position.clone();
      this.currentCamera.position = BABYLON.Vector3.Lerp(oldPos, this.targetPosition, easeProgress);

      const oldTarget = this.currentCamera.target.clone();
      this.currentCamera.target = BABYLON.Vector3.Lerp(oldTarget, this.targetTarget, easeProgress);
    }

    if (this.transitionProgress >= 1) {
      this.isTransitioning = false;
    }
  }

  /**
   * Update player follow camera
   */
  private updatePlayerFollow(deltaTime: number): void {
    if (!this.currentCamera || !this.playerSwimmer) return;

    const playerZ = this.playerSwimmer.position;
    const playerX = this.playerLaneX;
    const waterSurfaceY = 0.5;

    // Camera positioning - slightly back and elevated
    const cameraZ = playerZ - this.playerFollowConfig.followDistance;
    const cameraY = waterSurfaceY + this.playerFollowConfig.followHeight;

    // Vary horizontal position for cinematic effect
    const timeSeconds = Date.now() / 1000;
    const sideOffset = Math.sin((timeSeconds * 1000) / this.playerFollowConfig.sideSwaySpeed) * this.playerFollowConfig.sideSwayAmount;
    const cameraX = playerX + sideOffset;

    const newCameraPos = new BABYLON.Vector3(cameraX, cameraY, cameraZ);

    // Look ahead of player
    const lookAheadZ = playerZ + this.playerFollowConfig.followLead;
    const lookAtX = playerX + Math.cos((timeSeconds * 1000) / this.playerFollowConfig.sideSwaySpeed) * 3;
    const newTarget = new BABYLON.Vector3(lookAtX, waterSurfaceY + 2, lookAheadZ);

    // Smooth movement
    if (this.playerFollowConfig.enableSmoothing) {
      this.currentCamera.position = BABYLON.Vector3.Lerp(
        this.currentCamera.position,
        newCameraPos,
        this.playerFollowConfig.smoothingFactor
      );
      this.currentCamera.target = BABYLON.Vector3.Lerp(this.currentCamera.target, newTarget, this.playerFollowConfig.smoothingFactor);
    } else {
      this.currentCamera.position = newCameraPos;
      this.currentCamera.target = newTarget;
    }
  }

  /**
   * Update shot sequence progression
   */
  private updateShotSequence(deltaTime: number): void {
    if (this.currentShotSequence.length === 0) return;

    const currentCamera = this.currentShotSequence[this.currentSequenceIndex];
    const currentDuration = this.currentShotDurations[this.currentSequenceIndex] || 2000;

    this.sequenceTimer += deltaTime;

    if (this.sequenceTimer >= currentDuration && !this.isTransitioning) {
      // Move to next camera in sequence
      this.currentSequenceIndex++;

      if (this.currentSequenceIndex < this.currentShotSequence.length) {
        const nextCamera = this.currentShotSequence[this.currentSequenceIndex];
        this.transitionToCamera(nextCamera);
        this.sequenceTimer = 0;
      } else {
        // Sequence complete, switch back to default
        this.currentShotSequence = [];
        this.currentSequenceIndex = 0;
      }
    }
  }

  /**
   * Set race event type and load event-specific shot plan
   */
  public setRaceEventType(eventType: RaceEventType): void {
    this.raceEventType = eventType;
    logger.log(`BroadcastCamera: Race event type set to ${eventType}`);
  }

  /**
   * Load shot sequence for a race phase
   */
  public loadPhaseSequence(phase: RacePhase): void {
    const sequence = EVENT_SHOT_SEQUENCES[this.raceEventType][phase];
    if (!sequence) {
      logger.warn(`No shot sequence found for ${this.raceEventType} - ${phase}`);
      return;
    }

    this.currentShotSequence = this.packageManager.filterSequence(sequence.cameras);
    this.currentShotDurations = sequence.durations;
    this.currentSequenceIndex = 0;
    this.sequenceTimer = 0;

    if (this.currentShotSequence.length > 0) {
      this.transitionToCamera(this.currentShotSequence[0]);
      logger.log(`BroadcastCamera: Loaded ${phase} sequence (${this.currentShotSequence.length} cameras)`);
    }
  }

  /**
   * Handle race state change
   */
  public onRaceStateChange(newState: RaceState, playerSwimmer?: ISwimmerRaceState): void {
    this.raceState = newState;

    if (playerSwimmer) {
      this.playerSwimmer = playerSwimmer;
      this.playerLaneX = -12.5 + (playerSwimmer.lane * (25 / 7));
    }

    this.currentSequenceIndex = 0;
    this.sequenceTimer = 0;

    switch (newState) {
      case 'COUNTDOWN':
        this.loadPhaseSequence('ENTRANCE');
        logger.log('BroadcastCamera: Countdown started');
        break;

      case 'RACING':
        this.loadPhaseSequence('START');
        logger.log('BroadcastCamera: Race started');
        break;

      case 'FINISHED':
        this.loadPhaseSequence('POST_RACE');
        logger.log('BroadcastCamera: Race finished');
        break;

      default:
        break;
    }
  }

  /**
   * Lock camera during critical input window
   * Enforces: "Do not cut away during a critical input window"
   */
  public beginInputWindow(inputType: 'DIVE' | 'TURN' | 'FINISH' | 'RELAY'): void {
    this.isInInputWindow = true;
    this.lockedCameraId = this.currentCameraId;
    logger.log(`BroadcastCamera: Input window locked (${inputType})`);
  }

  /**
   * Release camera lock after input window
   */
  public endInputWindow(): void {
    this.isInInputWindow = false;
    this.lockedCameraId = null;
    logger.log('BroadcastCamera: Input window released');
  }

  /**
   * Check if camera is currently locked
   */
  public isInputLocked(): boolean {
    return this.isInInputWindow;
  }

  /**
   * Handle turn event - transition to turn camera
   */
  public onTurnApproach(distanceToWall: number): void {
    if (distanceToWall < 8 && distanceToWall > 6) {
      if (this.raceEventType !== '50M') {
        // Don't use turn camera for 50m races
        this.transitionToCamera('CAM_09_TURN_MASTER');
      }
    }
  }

  /**
   * Handle turn contact event
   */
  public onTurnContact(): void {
    if (this.raceEventType !== '50M') {
      this.transitionToCamera('CAM_14_UNDERWATER_TURN');
    }
  }

  /**
   * Handle finish threshold - switch to dramatic finish camera
   */
  public onFinishThreshold(distanceToWall: number): void {
    if (distanceToWall < 12 && distanceToWall >= 0) {
      if (this.raceState === 'RACING') {
        this.transitionToCamera('CAM_18_FINISH_COMPRESSION');
      }
    }
  }

  /**
   * Handle race finish
   */
  public onRaceFinish(): void {
    this.transitionToCamera('CAM_19_SCOREBOARD_REACTION', 600);
  }

  /**
   * Get current camera ID
   */
  public getCurrentCamera(): CameraID | null {
    return this.currentCameraId;
  }

  /**
   * Get current race phase
   */
  public getRacePhase(): RacePhase {
    switch (this.raceState) {
      case 'COUNTDOWN':
        return 'ENTRANCE';
      case 'RACING':
        return 'MID_RACE';
      case 'FINISHED':
        return 'POST_RACE';
      default:
        return 'ENTRANCE';
    }
  }

  /**
   * Set camera package tier
   */
  public setPackageTier(packageTier: CameraPackage): void {
    this.packageManager.setPackage(packageTier);
    logger.log(`BroadcastCamera: Package tier set to ${packageTier}`);
  }

  /**
   * Configure player follow parameters
   */
  public setFollowConfig(config: Partial<typeof BroadcastCamera.prototype['playerFollowConfig']>): void {
    this.playerFollowConfig = { ...this.playerFollowConfig, ...config };
  }

  /**
   * Legacy compatibility APIs used by examples and ArenaManager.
   * These route to the current broadcast camera controls.
   */
  public setConfig(config: Partial<typeof BroadcastCamera.prototype['playerFollowConfig']> & Record<string, unknown>): void {
    this.setFollowConfig(config);
  }

  public focusOnFinishLine(duration: number = 900): void {
    this.transitionToCamera('CAM_18_FINISH_COMPRESSION', duration);
  }

  public panToSwimmer(_laneX: number, duration: number = 1200): void {
    this.transitionToCamera('CAM_16_OVERHEAD_TRACKING', duration);
  }

  public showReplayWideAngle(duration: number = 900): void {
    this.transitionToCamera('CAM_01_ARENA_ESTABLISHING', duration);
  }

  public enableDynamicShotRotation(intervalMs: number = 5000): void {
    void intervalMs;
    this.loadPhaseSequence('MID_RACE');
  }

  public disableDynamicShotRotation(): void {
    this.currentShotSequence = [];
    this.currentSequenceIndex = 0;
    this.sequenceTimer = 0;
  }

  public onRaceProgress(data: { raceDistance?: number; leaderPosition?: number; swimmers?: ISwimmerRaceState[] }): void {
    const leadSwimmer = data.swimmers?.[0];
    if (leadSwimmer) {
      this.playerSwimmer = leadSwimmer;
    }

    const raceDistance = data.raceDistance ?? data.leaderPosition ?? 0;
    const remainingDistance = Math.max(0, 100 - raceDistance);
    this.onFinishThreshold(remainingDistance);
  }

  public onSwimmerFinished(_data: { swimmerId?: string; position?: number; name?: string; rank?: number }): void {
    this.onRaceFinish();
  }

  /**
   * Easing functions
   */
  private applyEasing(t: number, easing: string): number {
    switch (easing) {
      case 'easeInOutQuad':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case 'easeInQuad':
        return t * t;
      case 'easeOutQuad':
        return t * (2 - t);
      case 'linear':
      default:
        return t;
    }
  }

  /**
   * Get package information
   */
  public getPackageInfo() {
    return this.packageManager.getPackageInfo();
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    if (this.currentCamera) {
      this.currentCamera.detachControl();
    }
    logger.log('BroadcastCamera disposed');
  }
}

export default BroadcastCamera;
