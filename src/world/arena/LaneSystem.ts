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
import { ArenaMaterialLibrary } from './ArenaMaterialLibrary';

// SWIM26 pool lane rope colours — matches reference image exactly:
//   Outer lanes (1 and 8): blue/white alternating
//   Middle lanes (2-3, 6-7): red/white alternating
//   Centre lanes (4-5): yellow/white alternating
// FINA-style rope colours by position (index 0 = rope between lanes 1 & 2)
//   Lanes 1-2  outer boundary  → blue
//   Lanes 2-3                  → red
//   Lanes 3-4                  → red
//   Lanes 4-5  centre          → yellow
//   Lanes 5-6                  → yellow
//   Lanes 6-7                  → red
//   Lanes 7-8  outer boundary  → green
const ROPE_COLORS = [
  new BABYLON.Color3(0.08, 0.40, 0.90), // blue (outer — matches SWIM26 image)
  new BABYLON.Color3(0.92, 0.12, 0.12), // red
  new BABYLON.Color3(0.92, 0.12, 0.12), // red
  new BABYLON.Color3(1.00, 0.82, 0.00), // yellow (centre)
  new BABYLON.Color3(1.00, 0.82, 0.00), // yellow (centre)
  new BABYLON.Color3(0.92, 0.12, 0.12), // red
  new BABYLON.Color3(0.08, 0.40, 0.90), // blue (outer — matches SWIM26 image)
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

  build(scene: BABYLON.Scene, config: IArenaConfig, matLib: ArenaMaterialLibrary): BABYLON.TransformNode {
    const { poolLength: L, poolWidth: W, laneCount: LC } = config;
    const laneWidth = W / LC;

    this.root = new BABYLON.TransformNode('LaneSystem', scene);

    // Map rope index to shared PBR material (blue / red / yellow — SWIM26 scheme)
    const ropeMatForIndex = (i: number): BABYLON.PBRMaterial => {
      const c = ROPE_COLORS[Math.min(i - 1, ROPE_COLORS.length - 1)];
      if (c === ROPE_COLORS[0] || c === ROPE_COLORS[6]) return matLib.ropeGreen; // outer = blue (reused green slot)
      if (c === ROPE_COLORS[3] || c === ROPE_COLORS[4]) return matLib.ropeYellow;
      return matLib.ropeRed;
    };

    // Create (laneCount - 1) ropes between lanes
    for (let i = 1; i < LC; i++) {
      const ropeX  = -W / 2 + i * laneWidth;
      const ropeMat = ropeMatForIndex(i);

      // ── Main rope cable (thin inner line) ───────────────────────────────
      const rope = BABYLON.MeshBuilder.CreateTube(`laneRope${i}`, {
        path: [
          new BABYLON.Vector3(ropeX, 0.04, -L / 2),
          new BABYLON.Vector3(ropeX, 0.04,  L / 2),
        ],
        radius:      0.015,  // Thinner inner cable
        tessellation: 6,
        updatable:   false,
      }, scene);
      rope.material = matLib.flagLine;  // Dark thin cable
      rope.parent   = this.root;
      this.meshes.push(rope);

      // ── Float discs with FINA color pattern ─────────────────────────────
      // Each disc alternates color for visibility
      const floatSpacing = 0.5;  // 0.5m spacing for more detailed appearance
      const floatCount   = Math.floor(L / floatSpacing);

      for (let f = 0; f < floatCount; f++) {
        const fz = -L / 2 + (f + 0.5) * floatSpacing;
        
        // Skip 15m marker positions (will be added separately)
        if (Math.abs(Math.abs(fz) - (L / 2 - 15)) < 0.5) continue;

        // Disc with alternating colors per segment
        const discMat = this._getFloatMaterial(scene, i, f, matLib);
        
        const disc = BABYLON.MeshBuilder.CreateCylinder(`disc${i}_${f}`, {
          diameter:    0.12,  // 12cm diameter (FINA standard)
          height:      0.10,  // 10cm thick
          tessellation: 12,
        }, scene);
        disc.rotation.z = Math.PI / 2;
        disc.position   = new BABYLON.Vector3(ropeX, 0.04, fz);
        disc.material   = discMat;
        disc.parent     = this.root;
        this.meshes.push(disc);
      }
    }

    // Phase 2: backstroke warning flag installations at both ends
    this._buildBackstrokeFlags(scene, config, matLib);

    // Phase 6: 15 m turn-marker buoys on every lane rope
    this._build15mMarkers(scene, config);

    logger.log('[LaneSystem] Built Phase 6');
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
    scene:   BABYLON.Scene,
    config:  IArenaConfig,
    matLib:  ArenaMaterialLibrary,
  ): void {
    const { poolLength: L, poolWidth: W } = config;

    const FLAG_DIST   = 5.0;
    const FLAG_HEIGHT = 1.8;
    const POLE_DIAM   = 0.060;
    const POLE_HEIGHT = 2.20;
    const POLE_Y      = POLE_HEIGHT / 2;
    const POLE_OFFSET = W / 2 + 1.50;
    const PENNANT_W   = 0.30;
    const PENNANT_H   = 0.18;
    const PENNANT_T   = 0.02;

    const flagEnds = [
      -L / 2 + FLAG_DIST,
       L / 2 - FLAG_DIST,
    ];

    for (const fz of flagEnds) {
      for (const poleX of [-POLE_OFFSET, POLE_OFFSET]) {
        const pole = BABYLON.MeshBuilder.CreateCylinder(
          `flagPole_${fz.toFixed(0)}_${poleX.toFixed(0)}`,
          { diameter: POLE_DIAM, height: POLE_HEIGHT, tessellation: 8 },
          scene,
        );
        pole.position = new BABYLON.Vector3(poleX, POLE_Y, fz);
        pole.material = matLib.flagPole;
        pole.parent   = this.root;
        this.meshes.push(pole);
      }

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
      flagRope.material = matLib.flagLine;
      flagRope.parent   = this.root;
      this.meshes.push(flagRope);

      const pennantCount   = Math.floor(ropeSpan / 0.40) - 1;
      const pennantSpacing = ropeSpan / (pennantCount + 1);

      for (let pi = 0; pi < pennantCount; pi++) {
        const px = -POLE_OFFSET + (pi + 1) * pennantSpacing;

        const pennant = BABYLON.MeshBuilder.CreateBox(
          `pennant_${fz.toFixed(0)}_${pi}`,
          { width: PENNANT_W, height: PENNANT_H, depth: PENNANT_T },
          scene,
        );
        pennant.position = new BABYLON.Vector3(px, FLAG_HEIGHT - PENNANT_H / 2, fz);
        pennant.material = matLib.pennant[pi % matLib.pennant.length];
        pennant.parent   = this.root;
        this.meshes.push(pennant);
      }
    }
  }

  // ─── Phase 6: 15 m turn markers ──────────────────────────────────────────

  /**
   * World Aquatics SW 6.4 requires a distinctive mark at 15 m from each end
   * wall on every lane rope — used by backstroke swimmers to judge when to
   * begin their surfacing sequence after a turn or start.
   *
   * Implemented as a larger yellow/white disc on every rope at
   * Z = ±(L/2 − 15), clearly distinct from the standard float discs.
   */
  private _build15mMarkers(scene: BABYLON.Scene, config: IArenaConfig): void {
    const { poolLength: L, poolWidth: W, laneCount: LC } = config;
    const laneWidth = W / LC;

    // Yellow material for 15 m markers — brighter than standard floats
    const markerMat = new BABYLON.StandardMaterial('marker15m', scene);
    markerMat.diffuseColor  = new BABYLON.Color3(1.0, 0.88, 0.05);
    markerMat.emissiveColor = new BABYLON.Color3(0.3, 0.26, 0.01);

    const markerZs = [-(L / 2 - 15),  L / 2 - 15];

    for (let i = 1; i < LC; i++) {
      const ropeX = -W / 2 + i * laneWidth;

      for (const mz of markerZs) {
        // Larger disc — visually distinct from standard 0.14 m rope floats
        const marker = BABYLON.MeshBuilder.CreateCylinder(`marker15m_${i}_${mz.toFixed(0)}`, {
          diameter:     0.22,
          height:       0.10,
          tessellation: 10,
        }, scene);
        marker.rotation.z = Math.PI / 2;
        marker.position   = new BABYLON.Vector3(ropeX, 0.05, mz);
        marker.material   = markerMat;
        marker.parent     = this.root;
        this.meshes.push(marker);
      }
    }
  }

  // ─── Float material helper ──────────────────────────────────────────────────

  /**
   * Returns the appropriate material for a float disc based on its position.
   * Creates alternating color patterns for better visibility.
   */
  private _getFloatMaterial(
    scene:  BABYLON.Scene,
    ropeIndex: number,
    floatIndex: number,
    matLib: ArenaMaterialLibrary,
  ): BABYLON.Material {
    // Determine base color from rope position
    const c = ROPE_COLORS[Math.min(ropeIndex - 1, ROPE_COLORS.length - 1)];
    
    // Create segments: 5m of each color alternating
    // This creates the distinctive FINA lane rope appearance
    const segmentLength = 5;  // 5m segments
    const segmentIndex = Math.floor(floatIndex / 10);  // 10 floats per segment
    
    // Every other segment is white for visibility
    if (segmentIndex % 2 === 0) {
      return matLib.ropeRed;    // Red floats
    } else if (segmentIndex % 4 === 1) {
      return matLib.ropeYellow; // Yellow floats
    } else {
      return matLib.ropeGreen;  // Green floats
    }
  }

  public dispose(): void {
    this.meshes.forEach(m => m.dispose());
    this.root?.dispose();
    logger.log('[LaneSystem] Disposed');
  }
}
