/**
 * ArenaManager  (orchestrator — Phase 1 refactor)
 * ─────────────────────────────────────────────────────────────────────────────
 * This class is the single public entry-point used by RaceScene.tsx and the
 * rest of the game.  Its job is now to *coordinate* the modular sub-systems
 * rather than contain all the geometry and logic itself.
 *
 * Sub-systems (all in src/graphics/arena/):
 *   ArenaRoot                — Engine + Scene + render loop
 *   PerformanceQualityManager— Device tier detection + runtime preset switching
 *   ArenaAtmosphere          — Clear colour, fog, pool theme palette
 *   PoolStructure            — Basin floor, walls, coping edge
 *   PoolWater                — Water surface mesh + future WaterMaterial hook
 *   PoolDeck                 — Wet-area concrete surround
 *   LaneSystem               — Lane ropes, float discs, FINA colours
 *   StartingBlocks           — Per-lane starting block assemblies
 *   ArenaArchitecture        — Walls, ceiling, stepped bleachers, columns
 *   ArenaLighting            — Ambient + key + flood lights + shadows
 *   CameraSupport            — 4 static ArcRotateCameras (DEFAULT/AERIAL/etc.)
 *   BroadcastCamera          — 20-shot broadcast camera system (unchanged)
 *
 * PUBLIC API is backward-compatible with the original ArenaManager so all
 * existing call-sites (RaceScene.tsx, BroadcastCamera.ts, GameManager.ts)
 * continue to work without modification.
 */

import * as BABYLON from '@babylonjs/core';
import {
  IArenaConfig,
  CameraView,
  PoolTheme,
  TimeOfDay,
  RaceState,
  ISwimmerRaceState,
} from '../types';
import { logger, isMobileDevice } from '../utils';
import { BroadcastCamera } from './BroadcastCamera';

// Arena sub-systems
import { ArenaRoot }                 from './arena/ArenaRoot';
import { PerformanceQualityManager } from './arena/PerformanceQualityManager';
import { ArenaAtmosphere }           from './arena/ArenaAtmosphere';
import { ArenaMaterialLibrary }      from './arena/ArenaMaterialLibrary';
import { PoolStructure }             from './arena/PoolStructure';
import { PoolWater }                 from './arena/PoolWater';
import { PoolDeck }                  from './arena/PoolDeck';
import { LaneSystem }                from './arena/LaneSystem';
import { StartingBlocks }            from './arena/StartingBlocks';
import { ArenaArchitecture }         from './arena/ArenaArchitecture';
import { ArenaLighting }             from './arena/ArenaLighting';
import { CameraSupport }             from './arena/CameraSupport';
import { UnderwaterEffects }         from './arena/UnderwaterEffects';
import { ArenaPostProcess }          from './arena/ArenaPostProcess';
import { ArenaOptimizer }            from './arena/ArenaOptimizer';

export class ArenaManager {
  // ── Infrastructure ──────────────────────────────────────────────────────
  private canvas: HTMLCanvasElement | null = null;

  // ── Sub-systems (set during initialize) ─────────────────────────────────
  private arenaRoot:      ArenaRoot                  | null = null;
  private qualityMgr:     PerformanceQualityManager  | null = null;
  private atmosphere:     ArenaAtmosphere             | null = null;
  private matLib:         ArenaMaterialLibrary        | null = null;
  private poolStructure:  PoolStructure               | null = null;
  private poolWater:      PoolWater                   | null = null;
  private poolDeck:       PoolDeck                    | null = null;
  private laneSystem:     LaneSystem                  | null = null;
  private startingBlocks: StartingBlocks              | null = null;
  private architecture:   ArenaArchitecture           | null = null;
  private lighting:       ArenaLighting               | null = null;
  private cameraSupport:  CameraSupport               | null = null;
  private broadcastCamera: BroadcastCamera            | null = null;
  private underwaterFX:   UnderwaterEffects           | null = null;
  private postProcess:    ArenaPostProcess            | null = null;

  private isBroadcastMode = false;

  // ── Arena configuration (matches original defaults) ──────────────────────
  private arenaConfig: IArenaConfig = {
    theme:       'OLYMPIC',
    timeOfDay:   'AFTERNOON',
    poolLength:  50,
    poolWidth:   25,
    laneCount:   8,
    arenaHeight: 45,
  };

  // ────────────────────────────────────────────────────────────────────────
  constructor(canvasElement: HTMLCanvasElement | string) {
    if (typeof canvasElement === 'string') {
      this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    } else {
      this.canvas = canvasElement;
    }

    if (!this.canvas) {
      throw new Error('[ArenaManager] Canvas element not found');
    }

    logger.log(
      `[ArenaManager] Created (mobile: ${isMobileDevice()})`,
    );
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  public async initialize(): Promise<void> {
    if (!this.canvas) throw new Error('[ArenaManager] Canvas not available');

    // ── 1. Quality detection ──────────────────────────────────────────────
    this.qualityMgr = new PerformanceQualityManager();
    const qt = this.qualityMgr.getQualityTier();

    // ── 2. Engine + Scene ─────────────────────────────────────────────────
    this.arenaRoot = new ArenaRoot(this.canvas, qt);
    const scene    = this.arenaRoot.getScene();

    // ── 3. Atmosphere (clear colour + fog) ───────────────────────────────
    this.atmosphere = new ArenaAtmosphere();
    this.atmosphere.build(scene, this.arenaConfig, qt);

    // ── 4. Material library (PBR materials + procedural textures) ────────
    this.matLib = new ArenaMaterialLibrary();
    this.matLib.build(scene, this.arenaConfig, qt);

    // ── 5. Lighting (before geometry so shadow casters can be registered) ─
    this.lighting = new ArenaLighting();
    this.lighting.build(scene, this.arenaConfig, qt);

    // ── 6. Pool structure ─────────────────────────────────────────────────
    this.poolStructure = new PoolStructure();
    this.poolStructure.build(scene, this.arenaConfig, this.matLib);

    // ── 7. Water surface ──────────────────────────────────────────────────
    this.poolWater = new PoolWater();
    this.poolWater.build(scene, this.arenaConfig, qt);

    // ── 8. Deck ───────────────────────────────────────────────────────────
    this.poolDeck = new PoolDeck();
    this.poolDeck.build(scene, this.arenaConfig, this.matLib);

    // ── 9. Lane system ────────────────────────────────────────────────────
    this.laneSystem = new LaneSystem();
    this.laneSystem.build(scene, this.arenaConfig, this.matLib);

    // ── 10. Starting blocks ───────────────────────────────────────────────
    this.startingBlocks = new StartingBlocks();
    this.startingBlocks.build(scene, this.arenaConfig, this.matLib);

    // ── 11. Arena architecture (walls, bleachers, trusses, branding) ─────
    this.architecture = new ArenaArchitecture();
    this.architecture.build(scene, this.arenaConfig, this.matLib, qt);

    // ── 12. Post-build scene configuration (needs full scene.meshes) ─────
    //   a) Water render targets: reflection + refraction lists populated
    this.poolWater?.setupRenderTargets(scene);

    //   b) Shadow casters + receivers: scan scene meshes by name pattern
    this.lighting?.configureShadowsForScene(scene);

    //   c) Environment probe: one-shot IBL cube capture for metallic surfaces.
    //      Exclude water + caustic meshes to prevent render target feedback.
    const waterMesh   = this.poolWater?.getMesh() ?? null;
    const excludeMeshes: BABYLON.AbstractMesh[] = waterMesh ? [waterMesh] : [];
    // Also exclude any mesh named 'causticOverlay'
    scene.meshes
      .filter(m => m.name === 'causticOverlay')
      .forEach(m => excludeMeshes.push(m));

    const envTex = this.lighting?.buildEnvironmentProbe(scene, excludeMeshes) ?? null;
    if (envTex && this.matLib) {
      this.matLib.applyEnvironmentTexture(scene, envTex);
    }

    //   d) Underwater volume effects: depth fog transition + caustic depth light
    //      + bubble particles. Snapshot above-water state as baseline for lerp.
    this.underwaterFX = new UnderwaterEffects();
    this.underwaterFX.build(scene, this.arenaConfig, qt);
    this.underwaterFX.syncAboveWaterState(scene);

    //   e) Static scene optimization — freeze transforms, pickability, and
    //      (LOW only) merge high-count detail mesh groups.
    //      Run AFTER all geometry + post-build passes so scene.meshes is final.
    ArenaOptimizer.optimize(scene, qt);

    // ── 13. Static cameras ────────────────────────────────────────────────
    this.cameraSupport = new CameraSupport();
    this.cameraSupport.build(scene, this.canvas, this.arenaConfig);

    // ── 14. Post-processing pipeline ─────────────────────────────────────
    // Built AFTER cameras so all camera instances can be attached.
    // imageProcessing (contrast/exposure) applies globally; FXAA and bloom
    // attach per-camera through the DefaultRenderingPipeline.
    this.postProcess = new ArenaPostProcess();
    this.postProcess.build(scene, this.cameraSupport.getCameras(), qt);

    // ── 15. Broadcast camera (dormant until enableBroadcastMode) ─────────
    this.broadcastCamera = new BroadcastCamera(scene, this.canvas);
    this.broadcastCamera.initialize();

    // ── 16. Apply initial theme ───────────────────────────────────────────
    this._applyThemeInternal(this.arenaConfig.theme);

    // ── 17. Freeze static PBR materials ──────────────────────────────────
    // Must run AFTER _applyThemeInternal() has set poolWall.albedoColor so the
    // correct theme colour is baked into the frozen material state.
    this.matLib?.freezeStaticMaterials();

    // ── 18. Register water update in render loop ─────────────────────────
    this.arenaRoot.onRender((dt) => {
      this.poolWater?.update(dt);

      // Underwater volume: transition fog/clearColor based on active camera Y
      if (this.underwaterFX && this.arenaRoot) {
        const cam  = this.arenaRoot.getScene().activeCamera;
        const camY = cam ? (cam as BABYLON.ArcRotateCamera).position.y : 10;
        this.underwaterFX.update(this.arenaRoot.getScene(), camY, dt);
      }

      if (this.isBroadcastMode && this.broadcastCamera) {
        this.broadcastCamera.update(dt);
      }
    });

    // ── 19. Start render loop ────────────────────────────────────────────
    this.arenaRoot.setFrameSkipInterval(this.qualityMgr.getFrameSkipInterval());
    this.arenaRoot.startRenderLoop();

    logger.log('[ArenaManager] Initialized successfully');
  }

  // ============================================================================
  // THEME & LIGHTING
  // ============================================================================

  public setTheme(theme: PoolTheme): void {
    this.arenaConfig.theme = theme;
    this._applyThemeInternal(theme);
  }

  private _applyThemeInternal(theme: PoolTheme): void {
    if (!this.atmosphere || !this.arenaRoot) return;

    const scene      = this.arenaRoot.getScene();
    const waterColor = this.atmosphere.applyTheme(scene, theme);

    this.poolWater?.setColor(waterColor);
    this.matLib?.applyTheme(theme);
    this.poolStructure?.setPoolColor(waterColor); // no-op in Phase 3; kept for safety

    // Resync above-water fog baseline so UnderwaterEffects restores correctly
    this.underwaterFX?.syncAboveWaterState(scene);
  }

  public setTimeOfDay(time: TimeOfDay): void {
    this.arenaConfig.timeOfDay = time;
    this.lighting?.applyTimeOfDay(time);
  }

  // ============================================================================
  // CAMERAS
  // ============================================================================

  public setCamera(view: CameraView): void {
    if (!this.cameraSupport || !this.arenaRoot || !this.canvas) return;
    this.cameraSupport.setCamera(view, this.arenaRoot.getScene(), this.canvas);
  }

  // ============================================================================
  // SCOREBOARD
  // ============================================================================

  public updateScoreboard(
    leaderboard: Array<{ rank: number; name: string; time: number }>,
  ): void {
    this.architecture?.updateScoreboard(leaderboard);
  }

  // ============================================================================
  // BROADCAST CAMERA
  // ============================================================================

  public enableBroadcastMode(): void {
    if (!this.broadcastCamera || !this.arenaRoot) return;
    this.isBroadcastMode = true;
    // Let the broadcast camera set scene.activeCamera on next update tick
    logger.log('[ArenaManager] Broadcast mode enabled');
  }

  public disableBroadcastMode(): void {
    if (!this.arenaRoot || !this.cameraSupport || !this.canvas) return;
    this.isBroadcastMode = false;
    // Restore the static camera that was active before broadcast
    this.cameraSupport.setCamera(
      this.cameraSupport.getCurrentView(),
      this.arenaRoot.getScene(),
      this.canvas,
    );
    logger.log('[ArenaManager] Broadcast mode disabled');
  }

  public updateBroadcastCameraRace(
    raceState:      RaceState,
    playerSwimmer?: ISwimmerRaceState,
  ): void {
    this.broadcastCamera?.onRaceStateChange(raceState, playerSwimmer);
  }

  public notifyBroadcastCameraProgress(data: {
    leader: string;
    leaderPosition: number;
    time: number;
  }): void {
    this.broadcastCamera?.onRaceProgress(data);
  }

  public notifyBroadcastCameraFinish(data: {
    name: string;
    rank: number;
    time: number;
  }): void {
    this.broadcastCamera?.onSwimmerFinished(data);
  }

  public getBroadcastCamera(): BroadcastCamera | null {
    return this.broadcastCamera;
  }

  // ============================================================================
  // QUALITY PRESET (runtime)
  // ============================================================================

  public setQualityPreset(preset: 'high' | 'medium' | 'low'): void {
    if (!this.qualityMgr || !this.arenaRoot) return;

    const engine = this.arenaRoot.getEngine();
    const scene  = this.arenaRoot.getScene();

    const skipInterval = this.qualityMgr.applyPreset(preset, engine, scene);
    this.arenaRoot.setFrameSkipInterval(skipInterval);

    const qt = this.qualityMgr.getQualityTier();
    this.lighting?.applyQualityPreset(qt, scene);

    // Rebuild post-processing for the new tier (FXAA / bloom on / off)
    const cameras = this.cameraSupport?.getCameras() ?? [];
    this.postProcess?.applyQualityPreset(qt, scene, cameras);

    logger.log(`[ArenaManager] Quality preset → ${preset}`);
  }

  // ============================================================================
  // RENDER LOOP
  // ============================================================================

  public stopRenderLoop(): void {
    this.arenaRoot?.stopRenderLoop();
  }

  public resize(): void {
    this.arenaRoot?.resize();

    // Recompute camera FOV for the new viewport dimensions
    if (this.cameraSupport && this.canvas) {
      this.cameraSupport.updateFOV(this.canvas);
    }
  }

  public isRenderingActive(): boolean {
    return this.arenaRoot?.isRenderingActive() ?? false;
  }

  // ============================================================================
  // GETTERS
  // ============================================================================

  public getScene():       BABYLON.Scene        | null { return this.arenaRoot?.getScene()  ?? null; }
  public getEngine():      BABYLON.Engine       | null { return this.arenaRoot?.getEngine() ?? null; }
  public getCanvas():      HTMLCanvasElement    | null { return this.canvas; }
  public getArenaConfig(): IArenaConfig               { return { ...this.arenaConfig }; }
  public getQualityTier(): 'LOW' | 'MEDIUM' | 'HIGH' {
    return this.qualityMgr?.getQualityTier() ?? 'MEDIUM';
  }

  // ============================================================================
  // DISPOSE
  // ============================================================================

  public dispose(): void {
    this.broadcastCamera?.dispose();
    this.postProcess?.dispose();
    this.cameraSupport?.dispose();
    this.underwaterFX?.dispose();
    this.lighting?.dispose();
    this.architecture?.dispose();
    this.startingBlocks?.dispose();
    this.laneSystem?.dispose();
    this.poolDeck?.dispose();
    this.poolWater?.dispose();
    this.poolStructure?.dispose();
    this.matLib?.dispose();          // after all geometry modules
    this.atmosphere?.dispose();
    this.arenaRoot?.dispose();
    logger.log('[ArenaManager] Disposed');
  }
}

export default ArenaManager;
