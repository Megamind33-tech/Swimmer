/**
 * Race Replay System Example
 *
 * This example demonstrates how to use the comprehensive race replay system
 * with dynamic broadcast camera for underwater capture and dynamic angles.
 *
 * The replay system includes:
 * - Frame-by-frame race recording (positions, underwater status, stamina)
 * - Automatic detection of dramatic moments (overtakes, underwater sequences)
 * - Multiple playback modes (normal, highlights, final moments, underwater focus)
 * - Dynamic broadcast camera with multiple viewing angles
 * - Replay UI with controls for speed, seeking, and mode selection
 */

import { RaceController } from '../core/RaceController';
import { ReplayController } from '../core/ReplayController';
import { BroadcastCamera } from '../graphics/BroadcastCamera';
import { RaceRecorder, IRaceReplay } from '../core/RaceRecorder';
import React from 'react';
import RaceReplayScreen from '../components/RaceReplayScreen';

/**
 * Example 1: Basic Replay Workflow
 * Shows how to record a race and access replay data
 */
export class BasicReplayExample {
  private raceController: RaceController;
  private replayData: IRaceReplay | null = null;

  constructor() {
    this.raceController = new RaceController();

    // Subscribe to replay recording event
    this.raceController.on('replayRecorded', (replay: IRaceReplay) => {
      this.replayData = replay;
      console.log('Race replay recorded:', {
        duration: replay.duration,
        frameCount: replay.frames.length,
        dramaticMoments: replay.dramaticMoments.length,
      });
    });
  }

  /**
   * Start a race - this will automatically record all race data
   */
  public startRace(setup: any): void {
    this.raceController.initializeRace(setup);

    // Race will be recorded automatically
    // When race finishes, replayRecorded event fires with the full replay data
  }

  /**
   * Get recorded replay data
   */
  public getReplayData(): IRaceReplay | null {
    return this.replayData;
  }
}

/**
 * Example 2: Replay Playback with Controls
 * Shows how to play back a race with speed control and seeking
 */
export class ReplayPlaybackExample {
  private replayController: ReplayController;

  constructor(replay: IRaceReplay) {
    this.replayController = new ReplayController();
    this.replayController.loadReplay(replay);

    // Subscribe to frame updates to update graphics
    this.replayController.on('replayFrameUpdate', (data) => {
      console.log(`Current time: ${data.time}ms`);
      console.log('Swimmers:', data.swimmers.map(s => ({
        name: s.name,
        position: s.position,
        isUnderwater: s.isUnderwater,
      })));
    });

    // Subscribe to dramatic moments
    this.replayController.on('replayDramaticMoment', (moment) => {
      console.log(`Dramatic moment: ${moment.type} at ${moment.timestamp}ms`);
      console.log(`Swimmer: ${moment.swimmerName}`);
    });
  }

  /**
   * Start normal playback
   */
  public play(): void {
    this.replayController.play();
  }

  /**
   * Pause replay
   */
  public pause(): void {
    this.replayController.pause();
  }

  /**
   * Change playback speed
   */
  public setSpeed(speed: number): void {
    this.replayController.setPlaySpeed(speed);
    // Speed can be 0.25x to 4x
  }

  /**
   * Seek to specific time
   */
  public seekTo(timeMs: number): void {
    this.replayController.seekTo(timeMs);
  }

  /**
   * Jump to next dramatic moment
   */
  public skipToNextHighlight(): void {
    this.replayController.skipToNextHighlight();
  }

  /**
   * Update frame (call this in your game loop)
   */
  public update(deltaTime: number): void {
    this.replayController.update(deltaTime);
  }
}

/**
 * Example 3: Dynamic Broadcast Camera During Replay
 * Shows how the camera rotates between different angles
 */
export class DynamicBroadcastCameraExample {
  private broadcastCamera: BroadcastCamera;
  private replay: IRaceReplay;

  constructor(scene: any, canvas: HTMLCanvasElement, replay: IRaceReplay) {
    this.replay = replay;
    this.broadcastCamera = new BroadcastCamera(scene, canvas);
    this.broadcastCamera.initialize();
  }

  /**
   * During normal racing, the camera rotates between different shots
   * to provide broadcast-style coverage
   *
   * Rotation sequence (every 5 seconds):
   * 1. PLAYER_FOLLOW - Follow player closely while capturing competitors
   * 2. WIDE_SHOT - Wide view of the entire pool
   * 3. COMPETITORS_FOCUS - Focus on competitors and standings
   * 4. SIDE_FOLLOW - Side perspective of the race
   */
  public enableDynamicBroadcasting(): void {
    // Enable automatic shot rotation every 5 seconds
    this.broadcastCamera.enableDynamicShotRotation(5000);

    // The camera will now cycle through different angles automatically
    // during the racing phase
  }

  /**
   * For replay of exciting moments, manually control camera
   */
  public replayUnderwaterMoment(): void {
    // Focus on underwater perspective
    this.broadcastCamera.focusOnUnderwater();
    // Camera is now at underwater angle showing the swimmer's POV
  }

  /**
   * Show the finish line in a dramatic way
   */
  public replayFinishLine(duration: number = 2000): void {
    // Dramatic angle at finish line
    this.broadcastCamera.focusOnFinishLine(duration);
  }

  /**
   * Pan to show a specific swimmer's lane
   */
  public panToSwimmer(laneX: number): void {
    this.broadcastCamera.panToSwimmer(laneX, 1500);
  }

  /**
   * Show wide angle for dramatic moments
   */
  public showWideReplayAngle(): void {
    this.broadcastCamera.showReplayWideAngle();
  }
}

/**
 * Example 4: Replay Mode with Highlights
 * Shows how to use different replay viewing modes
 */
export class HighlightsReplayExample {
  private replayController: ReplayController;

  constructor(replay: IRaceReplay) {
    this.replayController = new ReplayController();
    this.replayController.loadReplay(replay);
  }

  /**
   * Play only the highlights - skips to dramatic moments automatically
   * Includes: overtakes, extended underwater sequences, close finishes
   */
  public playHighlights(): void {
    this.replayController.playHighlights();
    // Spends ~3 seconds on each dramatic moment, then auto-advances
  }

  /**
   * Show the final 15 seconds of the race leading to finish
   */
  public playFinalMoments(): void {
    this.replayController.playFinalMoments();
  }

  /**
   * Focus on all underwater moments
   */
  public focusOnUnderwaterSequences(): void {
    this.replayController.focusOnUnderwater();
  }

  /**
   * Get all dramatic moments for UI display
   */
  public getDramaticMoments() {
    return this.replayController.getDramaticMoments();
  }
}

/**
 * Example 5: React Component Integration
 * Shows how to use the replay UI component in React
 */
export function ReplayScreenExample({ replay, onClose }: { replay: IRaceReplay; onClose: () => void }) {
  const broadcastCameraRef = React.useRef<BroadcastCamera>(null);

  return (
    <RaceReplayScreen
      replay={replay}
      onReplayEnd={onClose}
      onBackToResults={onClose}
      broadcastCameraRef={broadcastCameraRef}
    />
  );
}

/**
 * Example 6: Complete Race + Replay Workflow
 * Full integration of recording, finishing, and replaying a race
 */
export class CompleteRaceReplayWorkflow {
  private raceController: RaceController;
  private replayController: ReplayController | null = null;
  private broadcastCamera: BroadcastCamera;
  private currentReplay: IRaceReplay | null = null;

  constructor(scene: any, canvas: HTMLCanvasElement) {
    this.raceController = new RaceController();
    this.broadcastCamera = new BroadcastCamera(scene, canvas);
    this.broadcastCamera.initialize();

    // When race finishes, capture the replay
    this.raceController.on('raceFinished', (raceState) => {
      console.log('Race finished! Starting replay...');
      this.startReplay();
    });

    // Handle replay recorded event
    this.raceController.on('replayRecorded', (replay: IRaceReplay) => {
      this.currentReplay = replay;
    });
  }

  /**
   * Start a new race
   */
  public startNewRace(setup: any): void {
    this.raceController.initializeRace(setup);
    this.broadcastCamera.enableDynamicShotRotation(5000);
  }

  /**
   * Update race and camera each frame
   */
  public update(deltaTime: number): void {
    this.raceController.updateRace(deltaTime);
    this.broadcastCamera.update(deltaTime);

    if (this.replayController) {
      this.replayController.update(deltaTime);
    }
  }

  /**
   * Start replaying the finished race
   */
  private startReplay(): void {
    if (!this.currentReplay) return;

    this.replayController = new ReplayController();
    this.replayController.loadReplay(this.currentReplay);
    this.replayController.play();

    // Optionally disable dynamic rotation and control camera manually for replay
    this.broadcastCamera.disableDynamicShotRotation();
  }

  /**
   * Show highlights
   */
  public playHighlightsReel(): void {
    if (this.replayController) {
      this.replayController.playHighlights();
    }
  }

  /**
   * Get current replay data (for UI display)
   */
  public getReplayData(): IRaceReplay | null {
    return this.currentReplay;
  }

  /**
   * Get replay controller for direct control
   */
  public getReplayController(): ReplayController | null {
    return this.replayController;
  }
}

/**
 * Dramatic Moments Detected Automatically
 *
 * The RaceRecorder automatically detects:
 *
 * 1. OVERTAKE - When one swimmer passes another
 *    - Tracked from moment of passing to full lane transition
 *
 * 2. UNDERWATER - When a swimmer begins a dive
 *    - Initial dive recorded
 *
 * 3. HIGHLIGHT - Extended underwater sequences (>1 second)
 *    - Extended underwater sequences marked as highlights
 *
 * 4. FINISH - When any swimmer completes the race
 *    - Final position and time recorded
 *
 * These moments are automatically added to replay.dramaticMoments array
 * and can be used for highlights reel or UI notifications
 */

/**
 * Camera Angles Available
 *
 * Static pre-defined shots:
 * - STARTING_BLOCK: Wide shot of starting blocks
 * - STARTING_BLOCK_CLOSE: Close-up on blocks
 * - AERIAL_OVERVIEW: High aerial view
 * - WIDE_SHOT: Medium wide view of entire pool
 * - FINISH_CAM: View of finish area
 * - FINISH_LINE_CAM: Dramatic finish line angle
 * - COMPETITORS_FOCUS: Focus on competitor lanes
 * - SIDE_FOLLOW: Side perspective follow
 * - UNDERWATER_PERSPECTIVE: Underwater camera angle
 *
 * Dynamic follow (automatic):
 * - PLAYER_FOLLOW: Follows player with sway to capture competitors
 *   - Camera oscillates side-to-side
 *   - Follows at 20m distance
 *   - Looks 15m ahead
 *   - Captures multiple swimmers in frame
 */
