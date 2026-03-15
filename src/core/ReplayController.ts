/**
 * ReplayController
 * Manages playback of recorded race replays with dynamic camera
 *
 * Responsibilities:
 * - Play back recorded race frames
 * - Control playback speed (normal, slow, fast, frame-by-frame)
 * - Focus on dramatic moments automatically
 * - Manage dynamic camera angles during replay
 * - Skip to highlights of the race
 * - Pause/resume functionality
 */

import { EventEmitter } from '../utils/index';
import { IRaceReplay, ISwimmerReplayFrame, IRaceReplayEvent } from './RaceRecorder';

export interface IReplayPlayheadState {
  currentTime: number;
  isPlaying: boolean;
  speed: number; // 1x, 2x, 0.5x, etc
  isFinished: boolean;
}

export interface ReplayControllerEvents {
  replayStart: IRaceReplay;
  replayFrameUpdate: { time: number; swimmers: ISwimmerReplayFrame[] };
  replayEventTriggered: IRaceReplayEvent;
  replayDramaticMoment: IRaceReplayEvent;
  replayPaused: number;
  replayResumed: number;
  replayEnded: void;
  replaySpeedChanged: number;
}

export type ReplayPlayMode = 'normal' | 'highlights' | 'final_moments' | 'underwater_focus';

export interface IReplayCamera {
  focusSwimmerId?: string; // focus on specific swimmer
  focusOnLeader: boolean; // follow current leader
  showCompetitors: boolean; // include other swimmers in frame
  dynamicAngle: 'follow' | 'overhead' | 'side' | 'finish';
  cameraDistance: number;
  lookAhead: number;
}

/**
 * ReplayController - Manages race replay playback
 */
export class ReplayController extends EventEmitter<ReplayControllerEvents> {
  private replay: IRaceReplay | null = null;
  private currentTime: number = 0;
  private isPlaying: boolean = false;
  private playSpeed: number = 1;
  private lastFrameTime: number = 0;
  private playMode: ReplayPlayMode = 'normal';
  private cameraConfig: IReplayCamera = {
    focusOnLeader: true,
    showCompetitors: true,
    dynamicAngle: 'follow',
    cameraDistance: 20,
    lookAhead: 15,
  };
  private highlightIndex: number = 0;
  private processedEvents: Set<number> = new Set();
  private processedDramaticMoments: Set<number> = new Set();

  /**
   * Load replay data
   */
  public loadReplay(replay: IRaceReplay): void {
    this.replay = replay;
    this.currentTime = 0;
    this.isPlaying = false;
    this.playSpeed = 1;
    this.highlightIndex = 0;
    this.processedEvents.clear();
    this.processedDramaticMoments.clear();
    this.emit('replayStart', replay);
  }

  /**
   * Start playing replay
   */
  public play(): void {
    if (!this.replay) return;
    this.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.emit('replayResumed', this.currentTime);
  }

  /**
   * Pause replay
   */
  public pause(): void {
    this.isPlaying = false;
    this.emit('replayPaused', this.currentTime);
  }

  /**
   * Set playback speed (0.5, 1, 1.5, 2, etc)
   */
  public setPlaySpeed(speed: number): void {
    this.playSpeed = Math.max(0.25, Math.min(4, speed)); // clamp between 0.25x and 4x
    this.emit('replaySpeedChanged', this.playSpeed);
  }

  /**
   * Seek to specific time
   */
  public seekTo(time: number): void {
    if (!this.replay) return;
    this.currentTime = Math.max(0, Math.min(time, this.replay.duration));
    this.processedEvents.clear();
    this.processedDramaticMoments.clear();
    this.updateFrame();
  }

  /**
   * Skip to next dramatic moment
   */
  public skipToNextHighlight(): void {
    if (!this.replay || this.replay.dramaticMoments.length === 0) return;

    const remainingMoments = this.replay.dramaticMoments.filter(m => m.timestamp > this.currentTime);
    if (remainingMoments.length > 0) {
      this.seekTo(remainingMoments[0].timestamp);
    }
  }

  /**
   * Skip to previous dramatic moment
   */
  public skipToPreviousHighlight(): void {
    if (!this.replay || this.replay.dramaticMoments.length === 0) return;

    const previousMoments = this.replay.dramaticMoments.filter(m => m.timestamp <= this.currentTime);
    if (previousMoments.length > 1) {
      this.seekTo(previousMoments[previousMoments.length - 2].timestamp);
    }
  }

  /**
   * Play highlights-only mode (skips between dramatic moments)
   */
  public playHighlights(): void {
    if (!this.replay || this.replay.dramaticMoments.length === 0) return;

    this.playMode = 'highlights';
    this.highlightIndex = 0;

    if (this.replay.dramaticMoments.length > 0) {
      this.seekTo(this.replay.dramaticMoments[0].timestamp);
      this.play();
    }
  }

  /**
   * Play final moments before race finish
   */
  public playFinalMoments(): void {
    if (!this.replay) return;

    // Show the last 15 seconds of the race
    const finalMomentStart = Math.max(0, this.replay.duration - 15000);
    this.playMode = 'final_moments';
    this.seekTo(finalMomentStart);
    this.play();
  }

  /**
   * Focus replay on underwater moments
   */
  public focusOnUnderwater(): void {
    if (!this.replay) return;

    this.playMode = 'underwater_focus';
    const underwaterMoments = this.replay.dramaticMoments.filter(m => m.type === 'underwater' || m.type === 'highlight');

    if (underwaterMoments.length > 0) {
      this.seekTo(underwaterMoments[0].timestamp);
      this.play();
    }
  }

  /**
   * Update replay frame (called every frame)
   */
  public update(deltaTime: number): void {
    if (!this.isPlaying || !this.replay) return;

    const now = performance.now();
    const elapsed = (now - this.lastFrameTime) * this.playSpeed;
    this.lastFrameTime = now;

    this.currentTime += elapsed;

    // Check if replay finished
    if (this.currentTime >= this.replay.duration) {
      this.currentTime = this.replay.duration;
      this.isPlaying = false;
      this.emit('replayEnded', undefined);
      return;
    }

    // Handle highlights mode - auto-skip to next dramatic moment
    if (this.playMode === 'highlights' && this.replay.dramaticMoments.length > 0) {
      const currentMoment = this.replay.dramaticMoments[this.highlightIndex];
      if (this.currentTime > currentMoment.timestamp + 3000) {
        // Spent 3 seconds on this moment
        this.highlightIndex++;
        if (this.highlightIndex < this.replay.dramaticMoments.length) {
          this.seekTo(this.replay.dramaticMoments[this.highlightIndex].timestamp);
        } else {
          this.isPlaying = false;
          this.emit('replayEnded', undefined);
          return;
        }
      }
    }

    this.updateFrame();
  }

  /**
   * Update to current frame
   */
  private updateFrame(): void {
    if (!this.replay) return;

    // Get swimmers at current time
    const swimmers = this.getSwimmersAtTime(this.currentTime);
    if (swimmers.length > 0) {
      this.emit('replayFrameUpdate', {
        time: this.currentTime,
        swimmers,
      });
    }

    // Emit triggered events
    for (const event of this.replay.events) {
      const eventIndex = this.replay.events.indexOf(event);
      if (!this.processedEvents.has(eventIndex) && event.timestamp <= this.currentTime) {
        this.processedEvents.add(eventIndex);
        this.emit('replayEventTriggered', event);
      }
    }

    // Emit dramatic moments
    for (const moment of this.replay.dramaticMoments) {
      const momentIndex = this.replay.dramaticMoments.indexOf(moment);
      if (!this.processedDramaticMoments.has(momentIndex) && moment.timestamp <= this.currentTime && moment.timestamp > this.currentTime - 100) {
        this.processedDramaticMoments.add(momentIndex);
        this.emit('replayDramaticMoment', moment);
      }
    }
  }

  /**
   * Get swimmers at specific replay time
   */
  public getSwimmersAtTime(replayTime: number): ISwimmerReplayFrame[] {
    if (!this.replay) return [];

    for (const segment of this.replay.frames) {
      if (segment.startTime <= replayTime && replayTime <= segment.endTime) {
        return segment.swimmers;
      }
    }
    return [];
  }

  /**
   * Get current playhead state
   */
  public getPlayheadState(): IReplayPlayheadState {
    return {
      currentTime: this.currentTime,
      isPlaying: this.isPlaying,
      speed: this.playSpeed,
      isFinished: !this.isPlaying && this.currentTime >= (this.replay?.duration ?? 0),
    };
  }

  /**
   * Configure camera for replay
   */
  public setCameraConfig(config: Partial<IReplayCamera>): void {
    this.cameraConfig = { ...this.cameraConfig, ...config };
  }

  /**
   * Get camera configuration
   */
  public getCameraConfig(): IReplayCamera {
    return { ...this.cameraConfig };
  }

  /**
   * Get current replay data
   */
  public getReplay(): IRaceReplay | null {
    return this.replay;
  }

  /**
   * Get dramatic moments for UI (highlights button)
   */
  public getDramaticMoments(): IRaceReplayEvent[] {
    return this.replay?.dramaticMoments ?? [];
  }

  /**
   * Get progress percentage
   */
  public getProgress(): number {
    if (!this.replay) return 0;
    return (this.currentTime / this.replay.duration) * 100;
  }
}

export default ReplayController;
