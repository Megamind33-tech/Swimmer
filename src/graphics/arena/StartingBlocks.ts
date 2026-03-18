/**
 * StartingBlocks  —  Phase 2
 * Competition starting blocks — one per lane, at the south end of the pool.
 *
 * Phase 1 (kept):
 *   - Correct lane-centre X positions via LaneSystem.getLaneCenterX()
 *   - Two-piece assembly: dark pedestal + ISL-yellow anti-slip platform
 *   - Shared materials (2 total, not 8)
 *   - Front lane-number plate
 *
 * Phase 2 additions:
 *   ✓ Diagonal support legs — two angled cylinders per block visible from
 *       broadcast side-camera, giving the block its characteristic "A-frame"
 *       profile instead of looking like a plain box
 *   ✓ Backstroke grab handles — two horizontal stainless bars behind the
 *       pedestal, protruding toward the pool; required equipment for
 *       backstroke starts
 *   ✓ Block number plate with per-lane DynamicTexture showing the lane number
 *
 * Phase 3 will add:
 *   - Anti-slip grip texture on yellow platform
 *   - Omega timer socket detail on front of pedestal
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig } from '../../types';
import { LaneSystem } from './LaneSystem';
import { logger } from '../../utils';

export class StartingBlocks {
  private root:   BABYLON.TransformNode | null = null;
  private meshes: BABYLON.AbstractMesh[]       = [];

  // Lane-number textures kept for disposal
  private lanePlateTextures: BABYLON.DynamicTexture[] = [];

  build(scene: BABYLON.Scene, config: IArenaConfig): BABYLON.TransformNode {
    const { poolLength: L, laneCount: LC } = config;

    this.root = new BABYLON.TransformNode('StartingBlocks', scene);

    // ── Shared materials ──────────────────────────────────────────────────
    const pedestalMat = new BABYLON.StandardMaterial('startPedestalMat', scene);
    pedestalMat.diffuseColor  = new BABYLON.Color3(0.18, 0.18, 0.20);
    pedestalMat.specularColor = new BABYLON.Color3(0.10, 0.10, 0.10);

    const platformMat = new BABYLON.StandardMaterial('startPlatformMat', scene);
    platformMat.diffuseColor  = new BABYLON.Color3(1.00, 0.82, 0.00); // ISL yellow
    platformMat.specularColor = new BABYLON.Color3(0.15, 0.15, 0.10);
    platformMat.specularPower = 20;

    // Stainless steel for grab handles and leg supports
    const stainlessMat = new BABYLON.StandardMaterial('blockStainlessMat', scene);
    stainlessMat.diffuseColor  = new BABYLON.Color3(0.72, 0.74, 0.76);
    stainlessMat.specularColor = new BABYLON.Color3(0.85, 0.85, 0.85);
    stainlessMat.specularPower = 96;

    // Blocks sit on the deck behind the south pool wall
    const blockZ = -L / 2 - 0.55;

    for (let lane = 0; lane < LC; lane++) {
      const laneX = LaneSystem.getLaneCenterX(lane, config);

      // ── Pedestal ────────────────────────────────────────────────────────
      const pedestal = BABYLON.MeshBuilder.CreateBox(`blockPedestal${lane}`, {
        width:  0.56,
        height: 0.50,
        depth:  0.44,
      }, scene);
      pedestal.position = new BABYLON.Vector3(laneX, 0.25, blockZ);
      pedestal.material = pedestalMat;
      pedestal.parent   = this.root;
      this.meshes.push(pedestal);

      // ── Top platform (slight forward lean, ISL profile) ──────────────
      const platform = BABYLON.MeshBuilder.CreateBox(`blockPlatform${lane}`, {
        width:  0.52,
        height: 0.06,
        depth:  0.40,
      }, scene);
      platform.position   = new BABYLON.Vector3(laneX, 0.530, blockZ);
      platform.rotation.x = -0.10; // ~6° forward lean
      platform.material   = platformMat;
      platform.parent     = this.root;
      this.meshes.push(platform);

      // ── Diagonal A-frame support legs ───────────────────────────────
      // Two angled cylinders that form the characteristic A-frame silhouette
      // of modern ISL-style blocks, clearly visible from broadcast side camera.
      //
      //  Front leg: leans forward (south, toward pool end)
      //  Back leg:  leans rearward (north, away from pool)
      //  Both legs converge at base-plate level (y ≈ 0)

      const LEG_DIAM  = 0.040;
      const LEG_H     = 0.56;  // length of leg cylinder
      const LEG_ANGLE = 0.38;  // radians ≈ 22°

      for (const [legName, leanZ] of [
        [`legFront${lane}`, -LEG_ANGLE],  // leans toward pool (south = -Z)
        [`legBack${lane}`,   LEG_ANGLE],  // leans away from pool (north = +Z)
      ] as [string, number][]) {
        const leg = BABYLON.MeshBuilder.CreateCylinder(legName, {
          diameter:    LEG_DIAM,
          height:      LEG_H,
          tessellation: 7,
        }, scene);
        leg.rotation.x = leanZ;
        // Centre the leg vertically on the pedestal height
        leg.position = new BABYLON.Vector3(
          laneX,
          0.26,
          blockZ,
        );
        leg.material = stainlessMat;
        leg.parent   = this.root;
        this.meshes.push(leg);
      }

      // ── Backstroke grab handles ─────────────────────────────────────
      // Two horizontal stainless bars on the pool-facing side (south) of the
      // pedestal, protruding ~0.22 m toward the water.
      // Upper handle: ~40 cm above deck (hand grip)
      // Lower handle: ~20 cm above deck (foot grip)
      const HANDLE_DIAM  = 0.028;
      const HANDLE_REACH = 0.22; // how far the handle sticks out from pedestal
      const HANDLE_DIAM_H = 0.008; // horizontal clearance piece

      for (const [handleName, handleY] of [
        [`handleUp${lane}`,  0.40],
        [`handleLow${lane}`, 0.18],
      ] as [string, number][]) {
        // Horizontal bar sticking out from front face of pedestal toward pool
        const handle = BABYLON.MeshBuilder.CreateCylinder(handleName, {
          diameter:    HANDLE_DIAM,
          height:      HANDLE_REACH,
          tessellation: 7,
        }, scene);
        handle.rotation.x = Math.PI / 2; // lay horizontally in Z direction
        handle.position   = new BABYLON.Vector3(
          laneX,
          handleY,
          blockZ - 0.22 - HANDLE_REACH / 2, // front of pedestal + reach
        );
        handle.material = stainlessMat;
        handle.parent   = this.root;
        this.meshes.push(handle);
      }

      // ── Lane-number plate with DynamicTexture ───────────────────────
      // Each block face shows its lane number (1-indexed for display).
      const plateTex = this._makeLaneNumberTexture(scene, lane + 1);
      this.lanePlateTextures.push(plateTex);

      const plateMat = new BABYLON.StandardMaterial(`blockPlateMat${lane}`, scene);
      plateMat.emissiveTexture = plateTex;
      plateMat.emissiveColor   = new BABYLON.Color3(1, 1, 1);

      const plate = BABYLON.MeshBuilder.CreateBox(`blockPlate${lane}`, {
        width:  0.30,
        height: 0.24,
        depth:  0.025,
      }, scene);
      plate.position = new BABYLON.Vector3(laneX, 0.28, blockZ - 0.225);
      plate.material = plateMat;
      plate.parent   = this.root;
      this.meshes.push(plate);
    }

    logger.log('[StartingBlocks] Built (Phase 2)');
    return this.root;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Creates a small DynamicTexture displaying the lane number on a
   * dark background (Omega-style timing panel aesthetic).
   */
  private _makeLaneNumberTexture(scene: BABYLON.Scene, laneNum: number): BABYLON.DynamicTexture {
    const tex = new BABYLON.DynamicTexture(
      `laneNumTex_${laneNum}`,
      { width: 128, height: 96 },
      scene,
      false,
    );
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    // Dark background
    ctx.fillStyle = '#0a0e14';
    ctx.fillRect(0, 0, 128, 96);

    // Lane number — large bright digits
    ctx.fillStyle = '#f5f0e0';
    ctx.font      = 'bold 64px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(laneNum), 64, 50);

    tex.update();
    return tex;
  }

  public getMeshes(): BABYLON.AbstractMesh[] { return this.meshes; }

  public dispose(): void {
    this.lanePlateTextures.forEach(t => t.dispose());
    this.meshes.forEach(m => m.dispose());
    this.root?.dispose();
    logger.log('[StartingBlocks] Disposed');
  }
}
