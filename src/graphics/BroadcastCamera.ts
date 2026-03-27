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
  private shotBasePosition: BABYLON.Vector3 | null = null;
  private shotBaseTarget: BABYLON.Vector3 | null = null;
  private shotMotionTime: number = 0;

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

  // Live swimmer position — updated every frame by the race loop
  private playerDistance: number = 0;
  private playerLane: number = 4;

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

    // Disable user input - critical for broadcast camera
    this.currentCamera.inertia = 0;
    this.currentCamera.angularSensibilityX = Number.MAX_VALUE;
    this.currentCamera.angularSensibilityY = Number.MAX_VALUE;
    this.currentCamera.wheelPrecision = Number.MAX_VALUE;
    this.currentCamera.pinchPrecision = Number.MAX_VALUE;
    this.currentCamera.detachControl();

    const packageInfo = this.packageManager.getPackageInfo();
    logger.log(
      `BroadcastCamera initialized: ${packageInfo.package} package (${packageInfo.totalAvailable} cameras available)`
    );
  }

  /**
   * Activate the broadcast camera only when broadcast mode is explicitly enabled.
   */
  public activate(): void {
    if (!this.scene || !this.currentCamera) return;

    // Ensure first activation always starts from a valid in-arena race shot.
    // This prevents falling back to ArcRotate defaults that can point into fog
    // or exterior walls before race-state sequencing kicks in.
    if (!this.currentCameraId) {
      const openingCamera = this.packageManager.getCameraOrFallback('CAM_10_POOLSIDE_TRACKING');
      if (openingCamera) {
        const spec = CAMERA_SPECS[openingCamera];
        this.currentCamera.position = spec.position.clone();
        this.currentCamera.target = spec.target.clone();
        this.currentCamera.fov = BABYLON.Tools.ToRadians(spec.fov.suggested);
        this.currentCameraId = openingCamera;
        this.isTransitioning = false;
        this.captureShotBase(this.currentCamera.position, this.currentCamera.target);
      }
    }

    this.currentCamera.detachControl();
    this.scene.activeCamera = this.currentCamera;
  }

  /**
   * Deactivate any broadcast-camera control bindings.
   */
  public deactivate(): void {
    this.currentCamera?.detachControl();
  }

  /**
   * Expose the underlying Babylon camera so ArenaManager can register it with
   * post-processing pipelines without activating it.
   */
  public getCameraInstance(): BABYLON.ArcRotateCamera | null {
    return this.currentCamera;
  }

  /**
   * Update camera each frame
   */
  public update(deltaTime: number): void {
    if (!this.currentCamera) return;

    const isPoolsideFollow = this.currentCameraId === 'CAM_10_POOLSIDE_TRACKING';
    const isOverheadFollow = this.currentCameraId === 'CAM_16_OVERHEAD_TRACKING';
    const isFollowCamera   = isPoolsideFollow || isOverheadFollow;

    if (isFollowCamera) {
      // Follow cameras own the camera transform every frame.
      // Cancel any pending transition so it doesn't fight the follow lerp.
      this.isTransitioning = false;
      if (!this.isInInputWindow) {
        if (isOverheadFollow) {
          this.updateOverheadFollow(deltaTime);
        } else {
          this.updatePlayerFollow(deltaTime);
        }
      }
    } else {
      // Non-follow cameras: run transitions then idle motion
      if (this.isTransitioning) {
        this.updateTransition(deltaTime);
      } else if (!this.isInInputWindow) {
        this.applyCinematicIdleMotion(deltaTime);
      }
    }

    // Shot sequence progresses during countdown + race.
    // Countdown keeps rotating "entrance" shots so players can appreciate
    // full-arena scale before the race starts.
    if (
      (this.raceState === 'RACING' || this.raceState === 'COUNTDOWN') &&
      this.currentShotSequence.length > 0
    ) {
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

    if (this.currentCamera) {
      this.currentCamera.fov = BABYLON.Tools.ToRadians(spec.fov.suggested);
    }

    const distance = this.currentCamera ? BABYLON.Vector3.Distance(this.currentCamera.position, this.targetPosition) : 0;

    if (distance < 1) {
      // Already at position, snap
      if (this.currentCamera) {
        this.currentCamera.position = this.targetPosition;
        this.currentCamera.target = this.targetTarget;
        this.captureShotBase(this.currentCamera.position, this.currentCamera.target);
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
      this.captureShotBase(this.targetPosition, this.targetTarget);
    }
  }

  // ── Swimmer world-space helpers ──────────────────────────────────────────

  /**
   * Convert race distance (0-100 m) to world-space Z coordinate.
   * Pool runs from Z = -25 (start/blocks) to Z = +25 (far wall).
   * Lap 0 goes forward (+Z), lap 1 comes back (-Z), etc.
   */
  private distanceToWorldZ(distance: number): number {
    const halfPool  = 25;   // pool is 50 m centred at origin
    const posInLap  = distance % 50;
    const lap       = Math.floor(distance / 50);
    return lap % 2 === 0
      ? -halfPool + posInLap   // heading toward far wall
      : halfPool  - posInLap;  // heading back to start
  }

  /**
   * Returns +1 when swimmer is heading toward far wall, -1 heading back.
   */
  private getSwimmerDirection(distance: number): number {
    return Math.floor(distance / 50) % 2 === 0 ? 1 : -1;
  }

  /**
   * Convert lane number (0-7) to pool-side X world coordinate.
   * Pool is 25 m wide (-12.5 → +12.5), using the same formula as the rest
   * of the codebase: -12.5 + lane * (25/7).
   */
  private laneToWorldX(lane: number): number {
    return -12.5 + lane * (25 / 7);
  }

  // ── TV-style follow camera implementations ────────────────────────────────

  /**
   * Poolside dolly/tracking camera (CAM_10).
   *
   * Replicates the signature Olympic broadcast shot:
   *  • Camera sits on the right-side pool deck (~20 m from pool centre),
   *    elevated ~5 m on a camera platform.
   *  • Slides longitudinally (Z axis) with the swimmer — trails slightly
   *    so the swimmer appears in the leading third of the frame.
   *  • Camera target is pointed well ahead of the swimmer so the viewer
   *    always sees where the swimmer is going.
   *  • Subtle micro-bob simulates the handheld/dolly organic feel.
   */
  private updatePlayerFollow(deltaTime: number): void {
    if (!this.currentCamera) return;

    const distance    = this.playerSwimmer?.position ?? this.playerDistance;
    const lane        = this.playerSwimmer?.lane      ?? this.playerLane;

    const swimmerZ    = this.distanceToWorldZ(distance);
    const swimmerDir  = this.getSwimmerDirection(distance);
    const swimmerX    = this.laneToWorldX(lane);

    // ── Camera position ────────────────────────────────────────────────────
    // Right-side pool deck, elevated platform.  Camera trails the swimmer
    // slightly so the athlete sits in the leading portion of the frame.
    const DECK_X      =  20.5;   // right-side pool deck
    const DECK_Y      =   4.8;   // camera platform height (m)
    const TRAIL_Z     =  -4.5 * swimmerDir;   // trail behind swimmer

    // Subtle vertical micro-bob — organic dolly feel
    const bob         = Math.sin(Date.now() / 2200) * 0.07;

    const targetPos = new BABYLON.Vector3(
      DECK_X,
      DECK_Y + bob,
      swimmerZ + TRAIL_Z,
    );

    // ── Camera target (look-at point) ──────────────────────────────────────
    // Aim well ahead of the swimmer in the direction of travel.
    // This keeps open water in the leading part of the frame — exactly
    // how broadcast directors frame it on TV.
    const LOOK_AHEAD  = 10 * swimmerDir;

    const targetLookAt = new BABYLON.Vector3(
      swimmerX,
      0.25,                    // just above the water line
      swimmerZ + LOOK_AHEAD,
    );

    // ── Smooth dt-based exponential lerp ──────────────────────────────────
    // Responsive enough to never visibly lose the swimmer; smooth enough
    // to feel like a real dolly rig rather than a snapping cut.
    const dtSec   = Math.min(deltaTime / 1000, 0.1);
    const posAlpha = 1.0 - Math.exp(-dtSec * 9.0);
    const tgtAlpha = 1.0 - Math.exp(-dtSec * 11.0);

    this.currentCamera.position = BABYLON.Vector3.Lerp(
      this.currentCamera.position, targetPos,    posAlpha,
    );
    this.currentCamera.target = BABYLON.Vector3.Lerp(
      this.currentCamera.target,   targetLookAt, tgtAlpha,
    );
  }

  /**
   * Overhead tracking camera (CAM_16).
   *
   * High crane-style shot looking directly down the pool at the swimmer.
   * Gives the viewer tactical clarity of lane separation and race order.
   */
  private updateOverheadFollow(deltaTime: number): void {
    if (!this.currentCamera) return;

    const distance   = this.playerSwimmer?.position ?? this.playerDistance;
    const lane       = this.playerSwimmer?.lane      ?? this.playerLane;

    const swimmerZ   = this.distanceToWorldZ(distance);
    const swimmerDir = this.getSwimmerDirection(distance);
    const swimmerX   = this.laneToWorldX(lane);

    // Camera: high above the pool, slightly behind the swimmer
    const CRANE_Y    = 38;
    const TRAIL_Z    = -6 * swimmerDir;

    const targetPos = new BABYLON.Vector3(
      swimmerX * 0.25,      // slight X offset to keep framing balanced
      CRANE_Y,
      swimmerZ + TRAIL_Z,
    );

    // Look at a point slightly ahead at water level
    const targetLookAt = new BABYLON.Vector3(
      swimmerX,
      0,
      swimmerZ + 10 * swimmerDir,
    );

    const dtSec    = Math.min(deltaTime / 1000, 0.1);
    const alpha    = 1.0 - Math.exp(-dtSec * 7.0);

    this.currentCamera.position = BABYLON.Vector3.Lerp(
      this.currentCamera.position, targetPos,    alpha,
    );
    this.currentCamera.target = BABYLON.Vector3.Lerp(
      this.currentCamera.target,   targetLookAt, alpha,
    );
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
      } else if (this.raceState === 'COUNTDOWN' && this.currentShotSequence.length > 0) {
        // During pre-race countdown we continuously loop wide/hero shots.
        this.currentSequenceIndex = 0;
        this.transitionToCamera(this.currentShotSequence[0]);
        this.sequenceTimer = 0;
      } else {
        // Sequence complete, switch back to default for non-countdown states.
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
   * Receive live swimmer position every race tick.
   * Called by the game loop so the follow cameras always have fresh data.
   */
  public updateSwimmerPosition(distance: number, lane: number): void {
    this.playerDistance = distance;
    this.playerLane     = lane;
    // Also keep the legacy playerSwimmer.position in sync if present
    if (this.playerSwimmer) {
      this.playerSwimmer.position = distance;
      this.playerSwimmer.lane     = lane;
    }
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
   * Snapshot the base framing whenever we land on a new shot.
   */
  private captureShotBase(position: BABYLON.Vector3, target: BABYLON.Vector3): void {
    this.shotBasePosition = position.clone();
    this.shotBaseTarget = target.clone();
    this.shotMotionTime = 0;
  }

  /**
   * Subtle drift to avoid static-photo feeling on broadcast wide shots.
   */
  private applyCinematicIdleMotion(deltaTime: number): void {
    if (!this.currentCamera || !this.shotBasePosition || !this.shotBaseTarget) return;
    if (this.currentCameraId?.includes('UNDERWATER')) return;

    this.shotMotionTime += Math.max(deltaTime, 0) / 1000;
    const t = this.shotMotionTime;

    this.currentCamera.position = new BABYLON.Vector3(
      this.shotBasePosition.x + Math.sin(t * 0.40) * 0.65,
      this.shotBasePosition.y + Math.sin(t * 0.72) * 0.16,
      this.shotBasePosition.z + Math.cos(t * 0.30) * 0.55,
    );
    this.currentCamera.target = new BABYLON.Vector3(
      this.shotBaseTarget.x + Math.sin(t * 0.48) * 0.35,
      this.shotBaseTarget.y + Math.cos(t * 0.65) * 0.10,
      this.shotBaseTarget.z + Math.sin(t * 0.34) * 0.30,
    );
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
