/**
 * Broadcast Camera Integration Example
 *
 * This file demonstrates how to integrate the BroadcastCamera system
 * with a race to provide automated cinematics instead of player-controlled camera.
 *
 * Usage in a race component:
 * 1. Create RaceController and ArenaManager
 * 2. Create CameraController and link them
 * 3. Start race - broadcast camera automatically takes over
 * 4. Race events trigger camera transitions
 */

import { RaceController } from '../core/RaceController';
import { CameraController } from '../core/CameraController';
import { ArenaManager } from '../graphics/ArenaManager';
import { IRaceSetup } from '../types';

/**
 * Example: Complete race with broadcast camera
 */
export async function setupRaceWithBroadcastCamera(
  canvas: HTMLCanvasElement,
  raceSetup: IRaceSetup
): Promise<{
  raceController: RaceController;
  cameraController: CameraController;
  arenaManager: ArenaManager;
}> {
  // 1. Initialize Arena (with canvas)
  const arenaManager = new ArenaManager(canvas);
  await arenaManager.initialize();

  // 2. Create RaceController
  const raceController = new RaceController();

  // 3. Create CameraController to bridge them
  const cameraController = new CameraController(raceController);
  cameraController.setArenaManager(arenaManager);

  // 4. Setup race event listeners
  raceController.on('raceStart', () => {
    console.log('🎥 Broadcast camera mode activated!');
    console.log('📹 Countdown sequence starting...');
  });

  raceController.on('raceBegin', () => {
    console.log('🏊 Race started - camera following player');
  });

  raceController.on('raceProgress', (data) => {
    console.log(`📊 ${data.leader} is leading at ${data.leaderPosition.toFixed(1)}m`);
  });

  raceController.on('raceFinished', (state) => {
    console.log('🏁 Race finished!');
    console.log(`🥇 Winner: ${state.winnerId}`);
  });

  // 5. Initialize and start race
  raceController.initializeRace(raceSetup);

  // 6. Start game loop
  let lastTime = performance.now();

  const gameLoop = () => {
    const now = performance.now();
    const deltaTime = now - lastTime;
    lastTime = now;

    // Update race state each frame
    raceController.updateRace(deltaTime);

    // Continue loop until race ends
    if (!raceController.isRaceFinished()) {
      requestAnimationFrame(gameLoop);
    } else {
      console.log('✅ Race complete');
      cleanup(cameraController, arenaManager);
    }
  };

  // Start the game loop
  requestAnimationFrame(gameLoop);

  return { raceController, cameraController, arenaManager };
}

/**
 * Cleanup resources after race
 */
function cleanup(
  cameraController: CameraController,
  arenaManager: ArenaManager
): void {
  cameraController.disableBroadcastMode();
  cameraController.cleanup();
  // Don't dispose arena yet if it's being reused
}

/**
 * Example: Customize broadcast camera behavior
 */
export function customizeBroadcastCamera(arenaManager: ArenaManager): void {
  const broadcastCamera = arenaManager.getBroadcastCamera();
  if (!broadcastCamera) return;

  // Configure camera following behavior
  broadcastCamera.setConfig({
    followDistance: 25, // Further back
    followHeight: 12, // Higher up for better overview
    followLead: 20, // Look further ahead
    transitionSpeed: 0.016,
    enableSmoothing: true,
  });

  console.log('✅ Broadcast camera configured');
}

/**
 * Example: Handle race phases manually
 */
export function exampleManualRaceHandling(): void {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  // Create components
  const raceController = new RaceController();
  const arenaManager = new ArenaManager(canvas);
  const cameraController = new CameraController(raceController);
  cameraController.setArenaManager(arenaManager);

  // Listen to specific events
  raceController.on('raceCountdown', (count) => {
    switch (count) {
      case 3:
        console.log('3️⃣ Three seconds...');
        break;
      case 2:
        console.log('2️⃣ Two seconds...');
        break;
      case 1:
        console.log('1️⃣ One second...');
        break;
      case 0:
        console.log('🔔 GO!');
        break;
    }
  });

  raceController.on('swimmerFinished', (data) => {
    console.log(
      `🏊 ${data.name} finished in ${data.time.toFixed(2)}ms (Rank: ${data.rank})`
    );
  });

  // At race end
  raceController.on('raceFinished', (state) => {
    // Save results
    const results = state.leaderboard.map((entry) => ({
      rank: entry.rank,
      name: entry.name,
      time: entry.time,
    }));

    console.log('🏆 Final Results:', results);

    // Camera is now showing finish angle - can hold it or disable
    setTimeout(() => {
      cameraController.disableBroadcastMode();
      console.log('Camera returned to manual control');
    }, 3000);
  });
}

/**
 * Integration points with race component:
 *
 * 1. SETUP PHASE (before race starts)
 *    - Create ArenaManager and initialize it
 *    - Create RaceController
 *    - Create CameraController to link them
 *
 * 2. COUNTDOWN PHASE (3 second countdown)
 *    - Camera shows dramatic shot sequence
 *    - Automatic transitions between shots
 *    - No player input accepted
 *
 * 3. RACING PHASE (race is active)
 *    - Camera follows player automatically
 *    - Updates position based on player movement
 *    - Cinematic framing with look-ahead
 *
 * 4. FINISH PHASE (race is complete)
 *    - Camera shows dramatic finish angle
 *    - Can show replay camera angles
 *    - Then return to manual control if needed
 *
 * CLEANUP
 * - Disable broadcast mode
 * - Cleanup camera controller
 * - Optionally dispose arena or reuse it
 */
