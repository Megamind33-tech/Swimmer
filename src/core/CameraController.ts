/**
 * CameraController
 * Bridge between RaceController and arena camera systems
 *
 * Responsibilities:
 * - Listen to race events from RaceController
 * - Update ArenaManager with race state
 * - Manage camera mode (broadcast vs manual)
 * - Coordinate camera and race lifecycle
 */

import { RaceController } from './RaceController';
import { ArenaManager } from '../graphics/ArenaManager';
import { ISwimmerRaceState, RaceState } from '../types';
import { logger } from '../utils';

export class CameraController {
  private raceController: RaceController;
  private arenaManager: ArenaManager | null = null;
  private playerSwimmer: ISwimmerRaceState | null = null;

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
      this.onRaceStart();
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
  }

  /**
   * Called when race starts (countdown begins)
   */
  private onRaceStart(): void {
    if (!this.arenaManager) return;

    // Enable broadcast mode
    this.arenaManager.enableBroadcastMode();
    logger.log('CameraController: Race started - broadcast mode enabled');
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
   * Disable broadcast mode (return to manual camera control)
   */
  public disableBroadcastMode(): void {
    if (!this.arenaManager) return;

    this.arenaManager.disableBroadcastMode();
    logger.log('CameraController: Broadcast mode disabled');
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
