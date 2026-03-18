/**
 * PoolWater
 * Renders the water surface inside the competition pool.
 *
 * AUDIT ISSUES FIXED HERE:
 *   - Old code animated water by rotating the whole mesh on Z
 *     (waterMesh.rotation.z += 0.001) — this spins the geometry,
 *     which is visually wrong and doesn't simulate waves at all.
 *     The animation has been removed in Phase 1.
 *   - Material was StandardMaterial with alpha 0.9 — fine as a
 *     placeholder, but no reflections, no refraction, no caustics.
 *   - Specular power was 64; raised to 128 for a sharper highlight.
 *   - Water sits at y=0.02 (just above pool rim) — correct.
 *
 * Phase 2 will replace this with Babylon's WaterMaterial for:
 *   - Real-time reflection (sky, bleachers)
 *   - Refraction (view through to pool bottom)
 *   - Animated wave normal map
 *   - Swimmer-generated ripple particles
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig } from '../../types';
import { logger } from '../../utils';

export class PoolWater {
  private waterMesh: BABYLON.Mesh | null = null;
  private material:  BABYLON.PBRMaterial | null = null;

  build(
    scene: BABYLON.Scene,
    config: IArenaConfig,
    qualityTier: 'LOW' | 'MEDIUM' | 'HIGH',
  ): BABYLON.Mesh {
    // Higher subdivision = smoother wave geometry in Phase 4 (WaterMaterial)
    const subs = qualityTier === 'HIGH' ? 64 : qualityTier === 'MEDIUM' ? 32 : 16;

    this.waterMesh = BABYLON.MeshBuilder.CreateGround('poolWater', {
      width:        config.poolWidth,
      height:       config.poolLength,
      subdivisions: subs,
    }, scene);

    // Water surface level: y=0 is the top of the pool basin walls
    this.waterMesh.position.y = 0.02;

    // Phase 3: PBRMaterial — physically-correct translucent water surface
    // metallic=0 (water is dielectric), roughness=0.04 (near-mirror reflections),
    // alpha=0.82 (see-through to pool floor), ALPHABLEND for correct sorting.
    this.material = new BABYLON.PBRMaterial('waterMat', scene);
    this.material.albedoColor          = new BABYLON.Color3(0.0, 0.40, 0.80);
    this.material.metallic             = 0.0;
    this.material.roughness            = 0.04;
    this.material.alpha                = 0.82;
    this.material.transparencyMode     = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;
    this.material.backFaceCulling      = false;
    this.material.environmentIntensity = 0; // no HDR env texture in this project

    this.waterMesh.material = this.material;

    logger.log('[PoolWater] Built (Phase 3 — PBRMaterial)');
    return this.waterMesh;
  }

  /**
   * Called every render frame.
   * Phase 1: no-op (removed the broken mesh-rotation animation).
   * Phase 2: tick WaterMaterial wave offset, add ripple particles.
   */
  public update(_deltaMs: number): void {
    // intentionally empty until Phase 2
  }

  public setColor(color: BABYLON.Color3): void {
    if (this.material) this.material.albedoColor = color;
  }

  public getMesh(): BABYLON.Mesh | null { return this.waterMesh; }

  public dispose(): void {
    this.waterMesh?.dispose();
    this.material?.dispose();
    logger.log('[PoolWater] Disposed');
  }
}
