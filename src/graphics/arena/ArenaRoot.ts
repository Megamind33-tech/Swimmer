/**
 * ArenaRoot
 * Owns the Babylon.js Engine + Scene lifecycle and the render loop.
 * All other arena modules receive the scene from here — nothing else
 * should create an Engine or Scene directly.
 */

import * as BABYLON from '@babylonjs/core';
import { getGraphicsCompatibilityProfile, logger } from '../../utils';

export class ArenaRoot {
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;

  private renderLoopId: number | null = null;
  private isRendering = false;
  private frameCount = 0;
  private lastFrameTime = 0;
  private frameSkipInterval = 0; // 0 = every frame, 1 = every other, etc.

  private onRenderCallbacks: Array<(deltaMs: number) => void> = [];

  constructor(canvas: HTMLCanvasElement, qualityTier: 'LOW' | 'MEDIUM' | 'HIGH') {
    const compatibility = getGraphicsCompatibilityProfile();

    // Debug: Log canvas dimensions on Android
    if (compatibility.isAndroid) {
      logger.log(`[ArenaRoot] Android detected. Canvas: ${canvas.width}x${canvas.height}, Parent: ${canvas.parentElement?.getBoundingClientRect().width}x${canvas.parentElement?.getBoundingClientRect().height}`);
    }

    // Ensure canvas has valid dimensions before creating engine
    if (canvas.width === 0 || canvas.height === 0) {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect && rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        logger.log(`[ArenaRoot] Resized canvas to ${canvas.width}x${canvas.height}`);
      }
    }

    this.engine = new BABYLON.Engine(canvas, true, {
      antialias: qualityTier === 'HIGH' && compatibility.antialias,
      adaptToDeviceRatio: true,
      preserveDrawingBuffer: false,
    });

    if (!this.engine) {
      throw new Error('[ArenaRoot] Failed to create Babylon.js Engine - WebGL may not be supported');
    }

    if (compatibility.isAndroid && compatibility.mobileShaderBudget !== 'full') {
      this.engine.setHardwareScalingLevel(qualityTier === 'LOW' ? 1.4 : 1.15);
    }

    this.scene = new BABYLON.Scene(this.engine);

    // Interim clear colour — ArenaAtmosphere.build() sets the theme-correct
    // value immediately after.  Set a fallback here so the first frame before
    // ArenaAtmosphere runs isn't a default grey flash.
    this.scene.clearColor = new BABYLON.Color4(0.06, 0.08, 0.12, 1);

    // Force initial resize to ensure canvas dimensions are synced
    // This is critical on Android where CSS-only sizing can cause 0x0 canvas
    this.engine.resize();

    // Fog is owned entirely by ArenaAtmosphere (Phase 7: sets FOGMODE_EXP2 +
    // density + colour at build time and when the theme changes).
    // Do NOT set fogMode / fogDensity here — ArenaAtmosphere will override
    // them and having FOGMODE_EXP set here produces wrong per-frame haze
    // until ArenaAtmosphere.build() runs (first few frames on init).
    // scene.fogMode defaults to FOGMODE_NONE until ArenaAtmosphere sets it.
  }

  // ─── Accessors ───────────────────────────────────────────────────────────

  public getEngine(): BABYLON.Engine { return this.engine; }
  public getScene(): BABYLON.Scene  { return this.scene;  }

  // ─── Render-loop control ─────────────────────────────────────────────────

  /** Register a per-frame callback (deltaMs = milliseconds since last frame). */
  public onRender(callback: (deltaMs: number) => void): void {
    this.onRenderCallbacks.push(callback);
  }

  public setFrameSkipInterval(interval: number): void {
    this.frameSkipInterval = interval;
  }

  public startRenderLoop(): void {
    if (this.isRendering) return;
    this.isRendering = true;
    this.lastFrameTime = performance.now();

    const loop = () => {
      this.frameCount++;
      const now = performance.now();
      const dt  = now - this.lastFrameTime;
      this.lastFrameTime = now;

      // Frame-skip: render every (frameSkipInterval+1)th frame on low-end hardware
      if (
        this.frameSkipInterval > 0 &&
        this.frameCount % (this.frameSkipInterval + 1) !== 0
      ) {
        this.renderLoopId = requestAnimationFrame(loop);
        return;
      }

      for (const cb of this.onRenderCallbacks) cb(dt);
      this.scene.render();

      this.renderLoopId = requestAnimationFrame(loop);
    };

    loop();
    logger.log('[ArenaRoot] Render loop started');
  }

  public stopRenderLoop(): void {
    if (this.renderLoopId !== null) {
      cancelAnimationFrame(this.renderLoopId);
      this.renderLoopId = null;
    }
    this.isRendering = false;
    logger.log('[ArenaRoot] Render loop stopped');
  }

  public isRenderingActive(): boolean { return this.isRendering; }

  public resize(): void { this.engine.resize(); }

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  public dispose(): void {
    this.stopRenderLoop();
    this.onRenderCallbacks = [];
    this.scene.dispose();
    this.engine.dispose();
    logger.log('[ArenaRoot] Disposed');
  }
}
