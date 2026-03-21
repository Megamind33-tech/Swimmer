/**
 * CameraSupport
 * Manages the four static ArcRotateCameras used for manual / overview shots.
 * The BroadcastCamera system is separate (BroadcastCamera.ts) and takes over
 * scene.activeCamera during race sequences.
 *
 * AUDIT ISSUES FIXED HERE:
 *   - Old code attached ALL four cameras to the canvas simultaneously,
 *     causing competing input handlers. Now only the active camera is attached.
 *   - Camera positions were set via position Vector3 but ArcRotateCamera
 *     uses alpha/beta/radius — the position values were ignored. Fixed by
 *     using proper alpha/beta/radius for each view.
 *   - minZ was not set → near-clip artifacts when very close to geometry.
 *   - maxZ was not set → far-clip issues with large arena at 100+ m.
 *
 * Phase 2 will add:
 *   - Smooth animated transitions between static views
 *   - Dynamic FOV adjustment for screen aspect ratio
 */

import * as BABYLON from '@babylonjs/core';
import { CameraView, IArenaConfig } from '../../types';
import { logger } from '../../utils';

interface CamDef {
  view:   CameraView;
  alpha:  number;   // azimuth  (radians)
  beta:   number;   // elevation (radians, 0=top, π/2=horizon)
  radius: number;   // distance from target (metres)
  target: BABYLON.Vector3;
}

export class CameraSupport {
  private cameras:     Map<CameraView, BABYLON.ArcRotateCamera> = new Map();
  private currentView: CameraView = 'DEFAULT';

  /** Default FOV (radians) — Babylon.js default for ArcRotateCamera. */
  private static readonly BASE_FOV = 0.8;

  /**
   * Compute a responsive FOV so the full pool remains visible on small or
   * narrow screens.  Wider aspect ratios keep the base FOV; narrower ones
   * (small phones in landscape, or portrait tablets) get a proportionally
   * wider FOV so geometry isn't cropped.
   *
   * The reference aspect ratio is 16:9 (≈1.78).  Screens narrower than that
   * receive a FOV bump.  The value is clamped to [BASE_FOV, 1.2] so it never
   * becomes a fisheye on extremely narrow viewports.
   */
  public static responsiveFOV(canvas: HTMLCanvasElement): number {
    const w = canvas.clientWidth  || 1;
    const h = canvas.clientHeight || 1;
    const aspect = w / h;
    const refAspect = 16 / 9;

    if (aspect >= refAspect) return CameraSupport.BASE_FOV;

    // Scale FOV inversely with aspect ratio shrinkage
    const fov = CameraSupport.BASE_FOV * (refAspect / aspect);
    return Math.min(fov, 1.2); // cap to prevent fisheye
  }

  build(
    scene:  BABYLON.Scene,
    canvas: HTMLCanvasElement,
    config: IArenaConfig,
  ): void {
    const L = config.poolLength;

    const defs: CamDef[] = [
      {
        view:   'DEFAULT',
        // Slightly behind the starting-block end, elevated — classic TV master
        alpha:  -Math.PI / 2,
        beta:   Math.PI / 3.5,
        radius: 58,
        target: new BABYLON.Vector3(0, 2, 0),
      },
      {
        view:   'AERIAL',
        // Near-top-down, slightly tilted south for better depth perspective
        alpha:  -Math.PI / 2,
        beta:   0.14,
        radius: 85,
        target: new BABYLON.Vector3(0, 0, 0),
      },
      {
        view:   'STARTING_BLOCK',
        // Low, tight on the starting blocks end
        alpha:  -Math.PI / 2,
        beta:   Math.PI / 2.1,
        radius: 20,
        target: new BABYLON.Vector3(0, 1, -L / 2),
      },
      {
        view:   'RACING',
        // Side-pool tracking position, mid-height — optimised for lane readability
        alpha:  -Math.PI / 2,
        beta:   Math.PI / 3.2,
        radius: 32,
        target: new BABYLON.Vector3(0, 1, 0),
      },
      {
        view:   'UNDERWATER',
        // Camera sits ~1 m below the water surface, looking up toward the surface.
        // Reveals the underside of the water mesh (backFaceCulling=false on water mat),
        // lane ropes, and swimmer silhouettes against the lit surface above.
        // target.y = 2 (above surface) pulls the look-direction steeply upward.
        alpha:  -Math.PI / 2,
        beta:   1.88,     // ≈107.7° — camera below surface, looking up
        radius: 10,
        target: new BABYLON.Vector3(0, 2.0, 0),
      },
    ];

    for (const def of defs) {
      const cam = new BABYLON.ArcRotateCamera(
        `cam_${def.view}`,
        def.alpha,
        def.beta,
        def.radius,
        def.target,
        scene,
      );

      cam.lowerRadiusLimit    = 8;
      cam.upperRadiusLimit    = 130;
      cam.wheelPrecision      = 20;
      cam.angularSensibilityX = 1200;
      cam.angularSensibilityY = 1200;
      cam.inertia             = 0.70;
      // Underwater camera needs tighter near-clip to avoid clipping pool geometry
      // at close range (wall at ~0.5 m when looking sideways from inside pool).
      cam.minZ = def.view === 'UNDERWATER' ? 0.15 : 0.5;
      cam.maxZ = 1200;

      // Responsive FOV for small / narrow screens
      cam.fov = CameraSupport.responsiveFOV(canvas);

      this.cameras.set(def.view, cam);
    }

    this.setCamera('DEFAULT', scene, canvas);
    logger.log('[CameraSupport] Built');
  }

  // ─── Camera switching ─────────────────────────────────────────────────────

  public setCamera(
    view:   CameraView,
    scene:  BABYLON.Scene,
    canvas: HTMLCanvasElement,
  ): void {
    const next = this.cameras.get(view);
    if (!next) {
      logger.warn('[CameraSupport] Unknown view:', view);
      return;
    }

    // Detach all then attach only the active one
    this.cameras.forEach(c => c.detachControl());
    next.attachControl(canvas, true);
    scene.activeCamera = next;
    this.currentView   = view;

    logger.log('[CameraSupport] Active camera →', view);
  }

  public getCamera(view: CameraView): BABYLON.ArcRotateCamera | undefined {
    return this.cameras.get(view);
  }

  public getCurrentView(): CameraView { return this.currentView; }

  /** Recompute FOV for all cameras after a viewport resize. */
  public updateFOV(canvas: HTMLCanvasElement): void {
    const fov = CameraSupport.responsiveFOV(canvas);
    this.cameras.forEach(c => { c.fov = fov; });
  }

  /** Return all built cameras — used by ArenaPostProcess to attach the pipeline. */
  public getCameras(): BABYLON.ArcRotateCamera[] {
    return Array.from(this.cameras.values());
  }

  public dispose(): void {
    this.cameras.forEach(c => c.dispose());
    this.cameras.clear();
    logger.log('[CameraSupport] Disposed');
  }
}
