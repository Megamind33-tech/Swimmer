/**
 * LaneSystem  —  Phase 2
 * Competition lane ropes with float discs, FINA colour coding, and
 * backstroke warning flags.
 *
 * Phase 1 (kept unchanged):
 *   - FINA-coded lane ropes (green / red / yellow)
 *   - Float discs every ~2 m
 *   - Static getLaneCenterX() / getRopeX() utilities
 *
 * Phase 2 additions:
 *   ✓ Backstroke warning flags — FINA requires flags 5 m from each end wall,
 *       1.8 m above the water surface.  Two support poles stand just outside
 *       the pool on each short side, with a thin rope connecting them.
 *   ✓ Pole + flag-rope geometry for both ends of the pool
 *
 * Phase 3 will add:
 *   - False-start recall rope (hinged, animated to drop)
 *   - 15 m marker buoy on lane ropes (backstroke turn cue)
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

    // Phase 2: backstroke warning flag installations at both ends
    this._buildBackstrokeFlags(scene, config);

    logger.log('[LaneSystem] Built (Phase 2)');
    return this.root;
  }

  // ─── Phase 2: backstroke warning flags ──────────────────────────────────

  /**
   * Builds the two backstroke warning flag installations.
   * FINA rule SW 6.5: flags suspended 5 m from each end wall,
   * 1.8 m above the water surface.
   *
   * Geometry per installation:
   *   • 2 vertical poles (one each side of pool) — thin dark aluminium cylinders
   *   • 1 horizontal flag rope connecting the poles at the required height
   *   • A row of small colourful pennant boxes along the rope for visibility
   */
  private _buildBackstrokeFlags(
    scene:  BABYLON.Scene,
    config: IArenaConfig,
  ): void {
    const { poolLength: L, poolWidth: W } = config;

    // FINA backstroke flag distance: 5 m from each end wall
    const FLAG_DIST   = 5.0;
    const FLAG_HEIGHT = 1.8;  // m above water (y = 0)

    // Pole geometry
    const POLE_DIAM   = 0.060;
    const POLE_HEIGHT = 2.20; // extends slightly above flag line
    const POLE_Y      = POLE_HEIGHT / 2; // base at y = 0

    // Poles sit just outside the pool — 1.5 m beyond each long side
    const POLE_OFFSET = W / 2 + 1.50;

    // Pennant dimensions
    const PENNANT_W   = 0.30;
    const PENNANT_H   = 0.18;
    const PENNANT_T   = 0.02;

    const poleMat = new BABYLON.StandardMaterial('flagPoleMat', scene);
    poleMat.diffuseColor  = new BABYLON.Color3(0.22, 0.22, 0.24);
    poleMat.specularColor = new BABYLON.Color3(0.15, 0.15, 0.15);

    const ropeMat = new BABYLON.StandardMaterial('flagRopeMat', scene);
    ropeMat.diffuseColor = new BABYLON.Color3(0.88, 0.88, 0.85);

    // Pennant colours cycle for visibility
    const pennantColors = [
      new BABYLON.Color3(1.00, 0.15, 0.15), // red
      new BABYLON.Color3(1.00, 0.85, 0.00), // yellow
      new BABYLON.Color3(0.10, 0.55, 1.00), // blue
      new BABYLON.Color3(0.15, 0.75, 0.20), // green
    ];

    const flagEnds = [
      -L / 2 + FLAG_DIST, // south flag installation
       L / 2 - FLAG_DIST, // north flag installation
    ];

    for (const fz of flagEnds) {
      // Left and right poles (east and west sides of pool)
      for (const poleX of [-POLE_OFFSET, POLE_OFFSET]) {
        const pole = BABYLON.MeshBuilder.CreateCylinder(
          `flagPole_${fz.toFixed(0)}_${poleX.toFixed(0)}`,
          { diameter: POLE_DIAM, height: POLE_HEIGHT, tessellation: 8 },
          scene,
        );
        pole.position = new BABYLON.Vector3(poleX, POLE_Y, fz);
        pole.material = poleMat;
        pole.parent   = this.root;
        this.meshes.push(pole);
      }

      // Connecting flag rope (thin tube across pool at flag height)
      const ropeSpan = POLE_OFFSET * 2;
      const flagRope = BABYLON.MeshBuilder.CreateTube(
        `flagRope_${fz.toFixed(0)}`,
        {
          path: [
            new BABYLON.Vector3(-POLE_OFFSET, FLAG_HEIGHT, fz),
            new BABYLON.Vector3( POLE_OFFSET, FLAG_HEIGHT, fz),
          ],
          radius:      0.010,
          tessellation: 5,
          updatable:   false,
        },
        scene,
      );
      flagRope.material = ropeMat;
      flagRope.parent   = this.root;
      this.meshes.push(flagRope);

      // Pennants hanging from the rope — spaced every 0.4 m
      const pennantCount  = Math.floor(ropeSpan / 0.40) - 1;
      const pennantSpacing = ropeSpan / (pennantCount + 1);

      for (let pi = 0; pi < pennantCount; pi++) {
        const px   = -POLE_OFFSET + (pi + 1) * pennantSpacing;
        const col  = pennantColors[pi % pennantColors.length];

        const pennantMat = new BABYLON.StandardMaterial(
          `pennantMat_${fz.toFixed(0)}_${pi}`,
          scene,
        );
        pennantMat.diffuseColor  = col;
        pennantMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        const pennant = BABYLON.MeshBuilder.CreateBox(
          `pennant_${fz.toFixed(0)}_${pi}`,
          { width: PENNANT_W, height: PENNANT_H, depth: PENNANT_T },
          scene,
        );
        // Hang below the rope: top edge touches the rope, droops down
        pennant.position = new BABYLON.Vector3(
          px,
          FLAG_HEIGHT - PENNANT_H / 2,
          fz,
        );
        pennant.material = pennantMat;
        pennant.parent   = this.root;
        this.meshes.push(pennant);
      }
    }
  }

  public dispose(): void {
    this.meshes.forEach(m => m.dispose());
    this.root?.dispose();
    logger.log('[LaneSystem] Disposed');
  }
}
