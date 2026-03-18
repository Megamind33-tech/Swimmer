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
        // Side-pool tracking position, mid-height
        alpha:  -Math.PI / 2,
        beta:   Math.PI / 3.2,
        radius: 32,
        target: new BABYLON.Vector3(0, 1, 0),
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

      cam.lowerRadiusLimit  = 8;
      cam.upperRadiusLimit  = 130;
      cam.wheelPrecision    = 20;
      cam.angularSensibilityX = 1200;
      cam.angularSensibilityY = 1200;
      cam.inertia           = 0.70;
      cam.minZ              = 0.5;
      cam.maxZ              = 1200;

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

  public dispose(): void {
    this.cameras.forEach(c => c.dispose());
    this.cameras.clear();
    logger.log('[CameraSupport] Disposed');
  }
}
