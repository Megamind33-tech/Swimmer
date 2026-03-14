/**
 * SWIMMER GAME - BroadcastCamera
 * Automated broadcasting camera system for races
 *
 * Responsibilities:
 * - Manage camera views like a broadcasting camera (not player-controlled)
 * - Define and transition between dynamic shots based on race phase
 * - Follow the player during racing with cinematic framing
 * - Respond to race events (countdown, start, progress, finish)
 * - Handle smooth camera transitions
 *
 * Design Philosophy:
 * - Like entering a stadium: you can't control the broadcast camera
 * - System manages camera automatically based on race state
 * - Pre-race: wide shots, starting block focus
 * - Racing: follow player with leading framing
 * - Finish: dramatic angles showing winner
 */

import * as BABYLON from '@babylonjs/core';
import { CameraView, ISwimmerRaceState, RaceState } from '../types';
import { logger } from '../utils';

export type ShotType = 'STARTING_BLOCK' | 'AERIAL_OVERVIEW' | 'PLAYER_FOLLOW' | 'WIDE_SHOT' | 'FINISH_CAM' | 'STARTING_BLOCK_CLOSE';

export interface ICameraShot {
  type: ShotType;
  position: BABYLON.Vector3;
  target: BABYLON.Vector3;
  duration: number; // transition duration in ms
}

export interface IBroadcastCameraConfig {
  followDistance: number; // distance behind player
  followHeight: number; // height above water
  followLead: number; // how far ahead to look
  transitionSpeed: number; // camera lerp speed
  enableSmoothing: boolean;
}

/**
 * BroadcastCamera - Automated cinematics for races
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

  // Racing state
  private raceState: RaceState | null = null;
  private currentShotType: ShotType = 'STARTING_BLOCK';
  private playerSwimmer: ISwimmerRaceState | null = null;
  private playerLaneX: number = 0; // x position of player's lane

  // Configuration
  private config: IBroadcastCameraConfig = {
    followDistance: 20, // 20m behind player
    followHeight: 8, // 8m above water
    followLead: 15, // look 15m ahead
    transitionSpeed: 0.016, // 60fps
    enableSmoothing: true,
  };

  // Pre-defined shots for different race phases
  private shots: Map<ShotType, ICameraShot> = new Map([
    ['STARTING_BLOCK', {
      type: 'STARTING_BLOCK',
      position: new BABYLON.Vector3(0, 3, -30),
      target: new BABYLON.Vector3(0, 0, -10),
      duration: 500,
    }],
    ['STARTING_BLOCK_CLOSE', {
      type: 'STARTING_BLOCK_CLOSE',
      position: new BABYLON.Vector3(5, 2.5, -28),
      target: new BABYLON.Vector3(0, 1, -12),
      duration: 800,
    }],
    ['AERIAL_OVERVIEW', {
      type: 'AERIAL_OVERVIEW',
      position: new BABYLON.Vector3(0, 50, -5),
      target: new BABYLON.Vector3(0, 0, 10),
      duration: 1200,
    }],
    ['WIDE_SHOT', {
      type: 'WIDE_SHOT',
      position: new BABYLON.Vector3(10, 15, -35),
      target: new BABYLON.Vector3(0, 5, 5),
      duration: 1000,
    }],
    ['FINISH_CAM', {
      type: 'FINISH_CAM',
      position: new BABYLON.Vector3(0, 8, 35),
      target: new BABYLON.Vector3(0, 2, 0),
      duration: 800,
    }],
  ]);

  // Shot sequence during different phases
  private shotSequences: Map<RaceState, ShotType[]> = new Map([
    ['COUNTDOWN', ['STARTING_BLOCK', 'STARTING_BLOCK_CLOSE', 'AERIAL_OVERVIEW']],
    ['RACING', ['PLAYER_FOLLOW']],
    ['FINISHED', ['FINISH_CAM']],
  ]);

  private shotSequenceIndex: number = 0;
  private sequenceTimer: number = 0;

  constructor(scene: BABYLON.Scene, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.canvas = canvas;
  }

  /**
   * Initialize the broadcast camera
   */
  public initialize(): void {
    if (!this.scene || !this.canvas) {
      logger.error('Cannot initialize BroadcastCamera without scene and canvas');
      return;
    }

    // Create the camera with position that won't receive user input
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
    this.currentCamera.inertia = 0; // no momentum
    this.currentCamera.angularSensibilityX = Number.MAX_VALUE; // disable mouse/touch control
    this.currentCamera.angularSensibilityY = Number.MAX_VALUE; // disable mouse/touch control
    this.currentCamera.wheelPrecision = Number.MAX_VALUE; // disable wheel zoom
    this.currentCamera.pinchPrecision = Number.MAX_VALUE; // disable pinch zoom

    // Set camera as active
    this.scene.activeCamera = this.currentCamera;

    // Initialize to starting block shot
    this.transitionToShot('STARTING_BLOCK', 0);

    logger.log('BroadcastCamera initialized (broadcast mode - user input disabled)');
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
    if (this.currentShotType === 'PLAYER_FOLLOW' && this.playerSwimmer) {
      this.updatePlayerFollow(deltaTime);
    }

    // Handle shot sequence progress (for countdown sequence)
    if (this.raceState === 'COUNTDOWN') {
      this.updateShotSequence(deltaTime);
    }
  }

  /**
   * Transition to a new shot
   */
  private transitionToShot(shotType: ShotType, overrideDuration?: number): void {
    const shot = this.shots.get(shotType);
    if (!shot) {
      logger.warn(`Shot type not found: ${shotType}`);
      return;
    }

    // If we're already at this position, snap there
    const distance = BABYLON.Vector3.Distance(
      this.currentCamera?.position || BABYLON.Vector3.Zero(),
      shot.position
    );

    this.targetPosition = shot.position;
    this.targetTarget = shot.target;
    this.currentShotType = shotType;

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
      this.transitionDuration = overrideDuration || shot.duration;
      this.transitionProgress = 0;
    }

    logger.log(`Broadcasting shot: ${shotType}`);
  }

  /**
   * Update camera transition
   */
  private updateTransition(deltaTime: number): void {
    if (!this.currentCamera || !this.isTransitioning) return;

    const elapsed = performance.now() - this.transitionStartTime;
    this.transitionProgress = Math.min(elapsed / this.transitionDuration, 1);

    // Easing function for smooth transitions
    const easeProgress = this.easeInOutQuad(this.transitionProgress);

    if (this.currentCamera) {
      // Lerp position
      const oldPos = this.currentCamera.position.clone();
      this.currentCamera.position = BABYLON.Vector3.Lerp(
        oldPos,
        this.targetPosition,
        easeProgress
      );

      // Lerp target
      const oldTarget = this.currentCamera.target.clone();
      this.currentCamera.target = BABYLON.Vector3.Lerp(
        oldTarget,
        this.targetTarget,
        easeProgress
      );
    }

    if (this.transitionProgress >= 1) {
      this.isTransitioning = false;
    }
  }

  /**
   * Update player following camera
   */
  private updatePlayerFollow(deltaTime: number): void {
    if (!this.currentCamera || !this.playerSwimmer) return;

    // Calculate player position on the water surface
    const playerZ = this.playerSwimmer.position - (this.config.followDistance);
    const playerX = this.playerLaneX;
    const waterSurfaceY = 0.5;

    // Camera position: behind player, elevated
    const cameraZ = playerZ - this.config.followDistance;
    const cameraY = waterSurfaceY + this.config.followHeight;

    const newCameraPos = new BABYLON.Vector3(playerX, cameraY, cameraZ);

    // Look ahead of player
    const lookAheadZ = this.playerSwimmer.position + this.config.followLead;
    const newTarget = new BABYLON.Vector3(playerX, waterSurfaceY + 2, lookAheadZ);

    // Smooth movement
    if (this.config.enableSmoothing) {
      const smoothness = 0.1; // 0-1, higher = more responsive
      this.currentCamera.position = BABYLON.Vector3.Lerp(
        this.currentCamera.position,
        newCameraPos,
        smoothness
      );
      this.currentCamera.target = BABYLON.Vector3.Lerp(
        this.currentCamera.target,
        newTarget,
        smoothness
      );
    } else {
      this.currentCamera.position = newCameraPos;
      this.currentCamera.target = newTarget;
    }
  }

  /**
   * Progress through shot sequence (for countdown)
   */
  private updateShotSequence(deltaTime: number): void {
    const shots = this.shotSequences.get('COUNTDOWN');
    if (!shots || shots.length === 0) return;

    // Auto-progress through shots during countdown
    const currentShot = shots[this.shotSequenceIndex];
    const shot = this.shots.get(currentShot as ShotType);

    if (shot) {
      this.sequenceTimer += deltaTime;
      if (this.sequenceTimer >= shot.duration) {
        this.shotSequenceIndex = (this.shotSequenceIndex + 1) % shots.length;
        this.sequenceTimer = 0;

        const nextShot = shots[this.shotSequenceIndex];
        this.transitionToShot(nextShot as ShotType);
      }
    }
  }

  /**
   * Handle race state change (called from RaceController)
   */
  public onRaceStateChange(newState: RaceState, playerSwimmer?: ISwimmerRaceState): void {
    this.raceState = newState;

    if (playerSwimmer) {
      this.playerSwimmer = playerSwimmer;
      this.playerLaneX = -12.5 + (playerSwimmer.lane * (25 / 7)); // Calculate x from lane
    }

    // Reset sequence for new state
    this.shotSequenceIndex = 0;
    this.sequenceTimer = 0;

    switch (newState) {
      case 'COUNTDOWN':
        // Start shot sequence
        this.transitionToShot('STARTING_BLOCK', 0);
        logger.log('BroadcastCamera: Countdown started - showing starting block');
        break;

      case 'RACING':
        // Switch to player follow
        this.currentShotType = 'PLAYER_FOLLOW';
        logger.log('BroadcastCamera: Race started - following player');
        break;

      case 'FINISHED':
        // Show dramatic finish shot
        this.transitionToShot('FINISH_CAM', 1500);
        logger.log('BroadcastCamera: Race finished - finish camera');
        break;

      default:
        break;
    }
  }

  /**
   * Handle race progress event (for dynamic shots)
   */
  public onRaceProgress(data: { leader: string; leaderPosition: number; time: number }): void {
    // Could add more dynamic shots based on race progress
    // For now, stay in follow mode during racing
  }

  /**
   * Handle swimmer finish event
   */
  public onSwimmerFinished(data: { name: string; rank: number; time: number }): void {
    // Could pan to finished swimmer
  }

  /**
   * Get current shot type
   */
  public getCurrentShot(): ShotType {
    return this.currentShotType;
  }

  /**
   * Configure camera behavior
   */
  public setConfig(config: Partial<IBroadcastCameraConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Ease function for smooth transitions
   */
  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
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
