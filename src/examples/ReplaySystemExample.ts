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
   * During normal racing, the camera follows event-specific sequences
   * to provide professional broadcast-style coverage
   *
   * Sequence depends on race event type:
   * - 50m: Minimal cuts (CAM 07 → CAM 13 → CAM 10 → CAM 18)
   * - 100m: Turn sequence included (CAM 07 → CAM 09 → CAM 14 → CAM 10)
   * - 200m: Multiple turns (CAM 07 → CAM 10 with turn sequences)
   * - Relay: Exchange-driven (CAM 16 overlay for exchange verification)
   *
   * Event-driven responses:
   * - Turn approach (6-8m): CAM 09 (Turn Master)
   * - Turn contact: CAM 14 (Underwater Turn)
   * - Final 12m: CAM 18 (Finish Compression)
   */
  public enableDynamicBroadcasting(): void {
    // The camera will use event-specific shot sequences based on race distance
    // and automatically respond to dramatic moments (turns, finishes, overtakes)
    // See CAMERA_PLAN.md for complete 20-camera specification
  }

  /**
   * For replay of exciting moments, use professional camera angles
   *
   * Replay camera priority (from CAMERA_PLAN.md):
   * 1. CAM 08 - Slow-Mo ISO for finish precision
   * 2. CAM 13 - Underwater Start for entries & breakouts
   * 3. CAM 14 - Underwater Turn for push-off discipline
   * 4. CAM 15 - Underwater Tracking for elite bodyline
   * 5. CAM 16 - Overhead Tracking for tactical view
   * 6. CAM 18 - Finish Compression for photo finishes
   *
   * Example: Use CAM 14 (Underwater Turn) for dramatic turn replays
   */
  public replayUnderwaterMoment(): void {
    // Transition to underwater turn camera for dramatic replay
    this.broadcastCamera.transitionToCamera('CAM_14_UNDERWATER_TURN', 800);
    // Camera shows push-off discipline and streamline quality
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
 * Professional Camera Package (20 Cameras - CAM 01 to CAM 20)
 *
 * MVP Package (7 cameras - first playable):
 * - CAM 03: Hero Walkout - Athlete entrance (40-55° FOV)
 * - CAM 06: Overhead Lineup - Pre-start race geography (60-75° FOV)
 * - CAM 07: Start/Finish Master - Main broadcast race view (24-32° FOV)
 * - CAM 10: Pool-Deck Tracking - Cinematic race follow (35-50° FOV)
 * - CAM 14: Underwater Turn - Turn dynamics (45-60° FOV)
 * - CAM 18: Finish Compression - Final meters drama (14-20° FOV)
 * - CAM 19: Scoreboard Reaction - Post-race emotion (30-45° FOV)
 *
 * Premium Package (13 additional cameras):
 * - CAM 01: Arena Establishing (70-85° FOV) - Championship scale
 * - CAM 02: Marshalling Camera (45-60° FOV) - Pre-race tension
 * - CAM 04: Lane Portrait (25-40° FOV) - Athlete close-ups
 * - CAM 05: Block Detail (20-35° FOV) - Readiness macro inserts
 * - CAM 08: Finish Slow-Mo ISO (15-24° FOV) - Replay precision
 * - CAM 09: Turn Master (24-34° FOV) - Wall approach drama
 * - CAM 11: Handheld Deck A (45-60° FOV) - Walkouts & prep
 * - CAM 12: Handheld Deck B (35-55° FOV) - Relay coverage
 * - CAM 13: Underwater Start (45-60° FOV) - Entry & breakout
 * - CAM 15: Underwater Tracking (35-50° FOV) - Premium signature shot
 * - CAM 16: Overhead Tracking (55-70° FOV) - Relay precision
 * - CAM 17: Crane/Jib (60-80° FOV) - Prestige sweeps
 * - CAM 20: Flash Interview (35-50° FOV) - Winner reactions
 *
 * For complete specifications, see CAMERA_PLAN.md
 */
