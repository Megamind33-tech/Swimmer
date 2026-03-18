/**
 * LaneSystem
 * Competition lane ropes with float discs and correct FINA colour coding.
 *
 * AUDIT ISSUES FIXED HERE:
 *   - Old code placed ropes using (lane * poolWidth / laneCount) which gave
 *     correct rope spacing, but starting blocks used (lane * poolWidth /
 *     (laneCount-1)), creating a mismatch between rope and block positions.
 *     LaneSystem now exports a static getLaneCenterX() used by StartingBlocks
 *     too, so both derive from the same formula.
 *   - Old ropes had no float discs — just thin plain tubes.
 *   - Alternating red/white colouring was arbitrary; replaced with
 *     FINA-standard scheme (outer lanes green, mid-pool red, centre yellow).
 *   - Rope radius reduced from 0.03 to 0.025 m (more realistic).
 *
 * Phase 2 will add:
 *   - T-mark decals on pool floor (black cross at 5 m from each end)
 *   - 15 m backstroke flags on rope supports
 *   - False-start rope geometry
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig } from '../../types';
import { logger } from '../../utils';

// FINA-style rope colours by position (index 0 = rope between lanes 1 & 2)
//   Lanes 1-2  outer boundary  → green
//   Lanes 2-3                  → red
//   Lanes 3-4                  → red
//   Lanes 4-5  centre          → yellow
//   Lanes 5-6                  → yellow
//   Lanes 6-7                  → red
//   Lanes 7-8  outer boundary  → green
const ROPE_COLORS = [
  new BABYLON.Color3(0.08, 0.65, 0.15), // green
  new BABYLON.Color3(0.88, 0.12, 0.12), // red
  new BABYLON.Color3(0.88, 0.12, 0.12), // red
  new BABYLON.Color3(1.00, 0.82, 0.00), // yellow
  new BABYLON.Color3(1.00, 0.82, 0.00), // yellow
  new BABYLON.Color3(0.88, 0.12, 0.12), // red
  new BABYLON.Color3(0.08, 0.65, 0.15), // green
];

export class LaneSystem {
  private root: BABYLON.TransformNode | null = null;
  private meshes: BABYLON.Mesh[] = [];

  // ─── Static utility ───────────────────────────────────────────────────────

  /**
   * World-space X for the centre of lane `lane` (0-indexed).
   * Used by StartingBlocks and camera helpers so all systems agree on geometry.
   */
  static getLaneCenterX(lane: number, config: IArenaConfig): number {
    const laneWidth = config.poolWidth / config.laneCount;
    return -config.poolWidth / 2 + (lane + 0.5) * laneWidth;
  }

  /** World-space X for the rope *between* lane `i` and lane `i+1` (0-indexed). */
  static getRopeX(i: number, config: IArenaConfig): number {
    const laneWidth = config.poolWidth / config.laneCount;
    return -config.poolWidth / 2 + (i + 1) * laneWidth;
  }

  // ─── Build ────────────────────────────────────────────────────────────────

  build(scene: BABYLON.Scene, config: IArenaConfig): BABYLON.TransformNode {
    const { poolLength: L, poolWidth: W, laneCount: LC } = config;
    const laneWidth = W / LC;

    this.root = new BABYLON.TransformNode('LaneSystem', scene);

    // Create (laneCount - 1) ropes between lanes
    for (let i = 1; i < LC; i++) {
      const ropeX = -W / 2 + i * laneWidth;
      const color = ROPE_COLORS[Math.min(i - 1, ROPE_COLORS.length - 1)];

      // ── Main rope tube ──────────────────────────────────────────────────
      const ropeMat = new BABYLON.StandardMaterial(`ropeMat${i}`, scene);
      ropeMat.diffuseColor  = color;
      ropeMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);

      const rope = BABYLON.MeshBuilder.CreateTube(`laneRope${i}`, {
        path: [
          new BABYLON.Vector3(ropeX, 0.04, -L / 2),
          new BABYLON.Vector3(ropeX, 0.04,  L / 2),
        ],
        radius:      0.025,
        tessellation: 6,
        updatable:   false,
      }, scene);
      rope.material = ropeMat;
      rope.parent   = this.root;
      this.meshes.push(rope);

      // ── Float discs every ~2 m for segmented appearance ─────────────────
      const floatMat = new BABYLON.StandardMaterial(`floatMat${i}`, scene);
      floatMat.diffuseColor = color;

      const floatSpacing = 2.0;
      const floatCount   = Math.max(1, Math.floor((L - 2) / floatSpacing));

      for (let f = 0; f < floatCount; f++) {
        const fz = -L / 2 + (f + 1) * (L / (floatCount + 1));

        const disc = BABYLON.MeshBuilder.CreateCylinder(`disc${i}_${f}`, {
          diameter:    0.14,
          height:      0.08,
          tessellation: 8,
        }, scene);
        disc.rotation.z = Math.PI / 2;
        disc.position   = new BABYLON.Vector3(ropeX, 0.04, fz);
        disc.material   = floatMat;
        disc.parent     = this.root;
        this.meshes.push(disc);
      }
    }

    logger.log('[LaneSystem] Built');
    return this.root;
  }

  public dispose(): void {
    this.meshes.forEach(m => m.dispose());
    this.root?.dispose();
    logger.log('[LaneSystem] Disposed');
  }
}
