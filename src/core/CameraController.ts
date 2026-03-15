/**
 * CameraController
 * Bridge between RaceController and arena camera systems
 *
 * Responsibilities:
 * - Listen to race events from RaceController
 * - Update ArenaManager with race state
 * - Manage camera mode (broadcast vs manual)
 * - Coordinate camera and race lifecycle
 * - Handle camera-specific events (turns, finishes, etc)
 * - Manage event-specific camera shot plans
 */

import { RaceController } from './RaceController';
import { ArenaManager } from '../graphics/ArenaManager';
import { ISwimmerRaceState, RaceState } from '../types';
import { RaceEventType } from '../graphics/CameraSpecifications';
import { logger } from '../utils';

export class CameraController {
  private raceController: RaceController;
  private arenaManager: ArenaManager | null = null;
  private playerSwimmer: ISwimmerRaceState | null = null;
  private raceEventType: RaceEventType = '100M';
  private playerLaneX: number = 0;

  constructor(raceController: RaceController) {
    this.raceController = raceController;
    this.setupListeners();
  }

  /**
   * Set the arena manager
   */
  public setArenaManager(arenaManager: ArenaManager): void {
    this.arenaManager = arenaManager;
  }

  /**
   * Setup listeners to RaceController events
   */
  private setupListeners(): void {
    // Listen to race start
    this.raceController.on('raceStart', (setup) => {
      this.onRaceStart(setup);
    });

    // Listen to camera event type (race distance)
    this.raceController.on('cameraEventType', (eventType) => {
      this.onCameraEventType(eventType);
    });

    // Listen to countdown
    this.raceController.on('raceCountdown', (count) => {
      this.onCountdown(count);
    });

    // Listen to race begin
    this.raceController.on('raceBegin', () => {
      this.onRaceBegin();
    });

    // Listen to race progress
    this.raceController.on('raceProgress', (data) => {
      this.onRaceProgress(data);
    });

    // Listen to swimmer finished
    this.raceController.on('swimmerFinished', (data) => {
      this.onSwimmerFinished(data);
    });

    // Listen to race finished
    this.raceController.on('raceFinished', (state) => {
      this.onRaceFinished(state);
    });

    // Listen to pause
    this.raceController.on('racePaused', (time) => {
      this.onRacePaused(time);
    });

    // Listen to resume
    this.raceController.on('raceResumed', (time) => {
      this.onRaceResumed(time);
    });

    // Camera-specific events
    this.raceController.on('turnApproach', (data) => {
      this.onTurnApproach(data);
    });

    this.raceController.on('turnContact', (data) => {
      this.onTurnContact(data);
    });

    this.raceController.on('finishThreshold', (data) => {
      this.onFinishThreshold(data);
    });
  }

  /**
   * Called when race starts (countdown begins)
   */
  private onRaceStart(setup: any): void {
    if (!this.arenaManager) return;

    // Enable broadcast mode
    this.arenaManager.enableBroadcastMode();
    logger.log('CameraController: Race started - broadcast mode enabled');
  }

  /**
   * Called when camera event type is determined
   */
  private onCameraEventType(eventType: 'RACE_DISTANCE_50M' | 'RACE_DISTANCE_100M' | 'RACE_DISTANCE_200M' | 'RACE_DISTANCE_RELAY'): void {
    // Convert to RaceEventType
    const typeMap = {
      'RACE_DISTANCE_50M': '50M' as RaceEventType,
      'RACE_DISTANCE_100M': '100M' as RaceEventType,
      'RACE_DISTANCE_200M': '200M' as RaceEventType,
      'RACE_DISTANCE_RELAY': 'RELAY' as RaceEventType,
    };

    this.raceEventType = typeMap[eventType];

    // Tell broadcast camera about the event type
    if (this.arenaManager && this.arenaManager.getBroadcastCamera()) {
      this.arenaManager.getBroadcastCamera().setRaceEventType(this.raceEventType);
      logger.log(`CameraController: Event type set to ${this.raceEventType}`);
    }
  }

  /**
   * Called on countdown tick
   */
  private onCountdown(count: number): void {
    if (!this.arenaManager) return;

    const raceState = this.raceController.getRaceState();
    if (!raceState || raceState.swimmers.length === 0) return;

    // Find the player swimmer (first one for now, can be improved)
    this.playerSwimmer = raceState.swimmers[0];
    this.playerLaneX = -12.5 + (this.playerSwimmer.lane * (25 / 7));

    // Update camera with countdown state
    this.arenaManager.updateBroadcastCameraRace('COUNTDOWN', this.playerSwimmer);
  }

  /**
   * Called when race actually begins (after countdown)
   */
  private onRaceBegin(): void {
    if (!this.arenaManager) return;

    const raceState = this.raceController.getRaceState();
    if (!raceState || raceState.swimmers.length === 0) return;

    this.playerSwimmer = raceState.swimmers[0];
    this.playerLaneX = -12.5 + (this.playerSwimmer.lane * (25 / 7));

    // Switch camera to follow mode
    this.arenaManager.updateBroadcastCameraRace('RACING', this.playerSwimmer);
    logger.log('CameraController: Race began - following player');
  }

  /**
   * Called on race progress updates
   */
  private onRaceProgress(data: {
    leader: string;
    leaderPosition: number;
    time: number;
  }): void {
    if (!this.arenaManager) return;

    // Update camera with progress info
    this.arenaManager.notifyBroadcastCameraProgress(data);
  }

  /**
   * Called when a swimmer finishes
   */
  private onSwimmerFinished(data: {
    name: string;
    rank: number;
    time: number;
  }): void {
    if (!this.arenaManager) return;

    this.arenaManager.notifyBroadcastCameraFinish(data);
  }

  /**
   * Called when race finishes
   */
  private onRaceFinished(state: any): void {
    if (!this.arenaManager) return;

    // Show finish camera
    this.arenaManager.updateBroadcastCameraRace('FINISHED', this.playerSwimmer || undefined);
    logger.log('CameraController: Race finished');
  }

  /**
   * Called when race is paused
   */
  private onRacePaused(time: number): void {
    logger.log('CameraController: Race paused');
  }

  /**
   * Called when race is resumed
   */
  private onRaceResumed(time: number): void {
    logger.log('CameraController: Race resumed');
  }

  /**
   * Called when swimmer approaches turn wall (6-8m away)
   */
  private onTurnApproach(data: { swimmerId: string; distanceToWall: number; wallPosition: number }): void {
    if (!this.arenaManager || !this.playerSwimmer) return;

    // Only respond for player swimmer
    if (data.swimmerId !== this.playerSwimmer.id) return;

    const broadcastCamera = this.arenaManager.getBroadcastCamera();
    if (broadcastCamera) {
      broadcastCamera.onTurnApproach(data.distanceToWall);
      logger.log(`CameraController: Turn approach detected (${data.distanceToWall.toFixed(2)}m away)`);
    }
  }

  /**
   * Called when swimmer touches the turn wall
   */
  private onTurnContact(data: { swimmerId: string; position: number }): void {
    if (!this.arenaManager || !this.playerSwimmer) return;

    // Only respond for player swimmer
    if (data.swimmerId !== this.playerSwimmer.id) return;

    const broadcastCamera = this.arenaManager.getBroadcastCamera();
    if (broadcastCamera) {
      broadcastCamera.onTurnContact();
      logger.log('CameraController: Turn contact detected');
    }
  }

  /**
   * Called when swimmer enters finish threshold (final 12m)
   */
  private onFinishThreshold(data: { swimmerId: string; distanceToWall: number; wallPosition: number }): void {
    if (!this.arenaManager || !this.playerSwimmer) return;

    // Only respond for player swimmer
    if (data.swimmerId !== this.playerSwimmer.id) return;

    const broadcastCamera = this.arenaManager.getBroadcastCamera();
    if (broadcastCamera) {
      broadcastCamera.onFinishThreshold(data.distanceToWall);
      logger.log(`CameraController: Finish threshold detected (${data.distanceToWall.toFixed(2)}m away)`);
    }
  }

  /**
   * Disable broadcast mode (return to manual camera control)
   */
  public disableBroadcastMode(): void {
    if (!this.arenaManager) return;

    this.arenaManager.disableBroadcastMode();
    logger.log('CameraController: Broadcast mode disabled');
  }

  /**
   * Get current race event type
   */
  public getRaceEventType(): RaceEventType {
    return this.raceEventType;
  }

  /**
   * Cleanup
   */
  public cleanup(): void {
    this.playerSwimmer = null;
    logger.log('CameraController cleaned up');
  }
}

export default CameraController;
