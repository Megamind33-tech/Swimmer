/**
 * StartingBlocks
 * Competition starting blocks — one per lane, at the south end of the pool.
 *
 * AUDIT ISSUES FIXED HERE:
 *   - Old code placed blocks with   blockX = -poolWidth/2 + lane * poolWidth/(laneCount-1)
 *     which differs from the rope spacing formula (÷ laneCount), so blocks
 *     didn't align with lane centres.  Now uses LaneSystem.getLaneCenterX().
 *   - Blocks were simple grey boxes (0.8×0.8×0.6) with no visual detail.
 *     Now a two-piece assembly: dark pedestal + yellow anti-slip platform.
 *   - Single material instance created per lane (8 identical materials) —
 *     refactored to 2 shared materials.
 *
 * Phase 2 will add:
 *   - Angled forward-lean on pedestal (realistic ISL-style block profile)
 *   - Backstroke grab handles (rear-facing bars)
 *   - Lane-number dynamic texture on front face
 *   - Anti-slip texture on yellow platform surface
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig } from '../../types';
import { LaneSystem } from './LaneSystem';
import { logger } from '../../utils';

export class StartingBlocks {
  private root:    BABYLON.TransformNode | null = null;
  private meshes:  BABYLON.AbstractMesh[] = [];

  build(scene: BABYLON.Scene, config: IArenaConfig): BABYLON.TransformNode {
    const { poolLength: L, laneCount: LC } = config;

    this.root = new BABYLON.TransformNode('StartingBlocks', scene);

    // ── Shared materials (one of each, instanced across lanes) ────────────
    const pedestalMat = new BABYLON.StandardMaterial('startPedestalMat', scene);
    pedestalMat.diffuseColor  = new BABYLON.Color3(0.20, 0.20, 0.22);
    pedestalMat.specularColor = new BABYLON.Color3(0.08, 0.08, 0.08);

    const platformMat = new BABYLON.StandardMaterial('startPlatformMat', scene);
    platformMat.diffuseColor  = new BABYLON.Color3(1.00, 0.82, 0.00); // ISL yellow
    platformMat.specularColor = new BABYLON.Color3(0.15, 0.15, 0.10);

    // Blocks sit on the deck just behind the south pool wall
    const blockZ = -L / 2 - 0.55;

    for (let lane = 0; lane < LC; lane++) {
      const laneX = LaneSystem.getLaneCenterX(lane, config);

      // Pedestal base (dark metal/plastic structure)
      const pedestal = BABYLON.MeshBuilder.CreateBox(`blockPedestal${lane}`, {
        width:  0.56,
        height: 0.50,
        depth:  0.44,
      }, scene);
      pedestal.position = new BABYLON.Vector3(laneX, 0.25, blockZ);
      pedestal.material = pedestalMat;
      pedestal.parent   = this.root;
      this.meshes.push(pedestal);

      // Top platform — slight forward tilt like a real ISL block
      const platform = BABYLON.MeshBuilder.CreateBox(`blockPlatform${lane}`, {
        width:  0.52,
        height: 0.06,
        depth:  0.40,
      }, scene);
      platform.position = new BABYLON.Vector3(laneX, 0.530, blockZ);
      platform.rotation.x = -0.10;   // ~6° forward lean
      platform.material   = platformMat;
      platform.parent     = this.root;
      this.meshes.push(platform);

      // Front number plate (thin box — Phase 2 adds dynamic lane-number texture)
      const plate = BABYLON.MeshBuilder.CreateBox(`blockPlate${lane}`, {
        width:  0.28,
        height: 0.22,
        depth:  0.02,
      }, scene);
      plate.position = new BABYLON.Vector3(laneX, 0.28, blockZ - 0.23);
      plate.material = platformMat;
      plate.parent   = this.root;
      this.meshes.push(plate);
    }

    logger.log('[StartingBlocks] Built');
    return this.root;
  }

  public getMeshes(): BABYLON.AbstractMesh[] { return this.meshes; }

  public dispose(): void {
    this.meshes.forEach(m => m.dispose());
    this.root?.dispose();
    logger.log('[StartingBlocks] Disposed');
  }
}
