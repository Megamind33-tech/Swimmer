/**
 * PoolStructure  —  Phase 2
 * Builds the physical shell of the competition pool basin.
 *
 * Phase 2 additions over Phase 1:
 *   ✓ Procedural tile DynamicTexture on pool floor (grout-line grid, 1 m tiles)
 *   ✓ Separate wall material with subtle depth-gradient emissive (upper wall brighter)
 *   ✓ Overflow gutter channel — dark capping strip at pool rim, visible from
 *       poolside and underwater cameras
 *   ✓ Lane centre lines — thin dark boxes on pool floor, one per lane
 *   ✓ T-marks — black cross pairs at 5 m from each end wall, per lane
 *   ✓ Turn-wall touch pads — white rectangular panels flush with each end wall,
 *       one per lane, at competition depth (~1 m below surface)
 *   ✓ Rope anchor posts — small stainless cylinders at pool ends for each
 *       lane rope, so ropes look physically terminated
 *
 * Coordinate convention (shared across all arena modules):
 *   Y = 0   : deck level / water surface / top of pool walls
 *   Y = -3  : pool floor  (BASIN_DEPTH = 3 m)
 *   Z = ±25 : pool ends (50 m pool, poolLength / 2)
 *   X = ±12.5: pool sides (25 m pool, poolWidth / 2)
 *
 * Phase 3 will add:
 *   - PBR tile texture with normal map (replace DynamicTexture flat colour)
 *   - Depth-gradient vertex colour on walls (lighter top, darker bottom)
 *   - Gutter true recess (geometry cut via separate slab approach)
 *   - Shadow receiving on pool floor
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig } from '../../types';
import { logger } from '../../utils';
import { ArenaMaterialLibrary } from './ArenaMaterialLibrary';

export interface IPoolStructureHandles {
  root:         BABYLON.TransformNode;
  floorMesh:    BABYLON.Mesh;
  wallMeshes:   BABYLON.Mesh[];
  copingMeshes: BABYLON.Mesh[];
  poolMaterial: BABYLON.PBRMaterial;
}

export class PoolStructure {
  // ── Shared geometry constants ─────────────────────────────────────────────
  static readonly BASIN_DEPTH    = 3.0;  // m below deck
  static readonly WALL_THICKNESS = 0.4;  // m
  static readonly COPING_WIDTH   = 0.30; // overhang beyond pool wall
  static readonly COPING_HEIGHT  = 0.14; // m

  // ── Private state ─────────────────────────────────────────────────────────
  private root:         BABYLON.TransformNode | null = null;
  private floorMesh:    BABYLON.Mesh          | null = null;
  private wallMeshes:   BABYLON.Mesh[] = [];
  private copingMeshes: BABYLON.Mesh[] = [];
  private detailMeshes: BABYLON.Mesh[] = []; // markings, pads, anchors

  private poolMaterial:  BABYLON.PBRMaterial | null = null;
  private wallMaterial:  BABYLON.PBRMaterial | null = null;

  // ─────────────────────────────────────────────────────────────────────────
  build(scene: BABYLON.Scene, config: IArenaConfig, matLib: ArenaMaterialLibrary): IPoolStructureHandles {
    const { poolLength: L, poolWidth: W, laneCount: LC } = config;
    const D  = PoolStructure.BASIN_DEPTH;
    const WT = PoolStructure.WALL_THICKNESS;
    const CW = PoolStructure.COPING_WIDTH;
    const CH = PoolStructure.COPING_HEIGHT;

    this.root = new BABYLON.TransformNode('PoolStructure', scene);

    // ── 1. Materials (from shared library) ───────────────────────────────

    this.poolMaterial = matLib.poolFloor;
    this.wallMaterial = matLib.poolWall;

    // UV tiling: 1 texture repeat per metre → tile count = inner dimension
    const innerW = W - WT * 2;
    const innerL = L - WT * 2;
    if (matLib.poolFloor.albedoTexture) {
      matLib.poolFloor.albedoTexture.uScale = Math.round(innerW); // ~24 for 25 m pool
      matLib.poolFloor.albedoTexture.vScale = Math.round(innerL); // ~49 for 50 m pool
    }

    const copingMat   = matLib.coping;
    const gutterMat   = matLib.gutter;
    const markingMat  = matLib.laneMarking;
    const padMat      = matLib.touchPad;
    const anchorMat   = matLib.stainless;

    // ── 2. Pool floor ─────────────────────────────────────────────────────
    this.floorMesh = BABYLON.MeshBuilder.CreateBox('poolFloor', {
      width:  innerW,
      height: 0.25,
      depth:  innerL,
    }, scene);
    this.floorMesh.position.y = -D + 0.125; // top face at y = -D + 0.25 … ≈ -2.75
    this.floorMesh.material   = this.poolMaterial;
    this.floorMesh.parent     = this.root;

    // ── 3. Basin walls (4 sides) ─────────────────────────────────────────
    const wallDefs = [
      { n: 'wallN', w: W,  h: D, d: WT,  px: 0,       py: -D / 2, pz:  L / 2 },
      { n: 'wallS', w: W,  h: D, d: WT,  px: 0,       py: -D / 2, pz: -L / 2 },
      { n: 'wallE', w: WT, h: D, d: L,   px:  W / 2,  py: -D / 2, pz:  0     },
      { n: 'wallW', w: WT, h: D, d: L,   px: -W / 2,  py: -D / 2, pz:  0     },
    ];
    for (const def of wallDefs) {
      const wall = BABYLON.MeshBuilder.CreateBox(def.n, {
        width: def.w, height: def.h, depth: def.d,
      }, scene);
      wall.position = new BABYLON.Vector3(def.px, def.py, def.pz);
      wall.material = this.wallMaterial;
      wall.parent   = this.root;
      this.wallMeshes.push(wall);
    }

    // ── 4. Coping edge tiles ─────────────────────────────────────────────
    const copingDefs = [
      { n: 'copN', w: W + CW * 2, h: CH, d: CW, px: 0,             pz:  L / 2 + CW / 2 },
      { n: 'copS', w: W + CW * 2, h: CH, d: CW, px: 0,             pz: -L / 2 - CW / 2 },
      { n: 'copE', w: CW,         h: CH, d: L,   px:  W / 2 + CW / 2, pz: 0             },
      { n: 'copW', w: CW,         h: CH, d: L,   px: -W / 2 - CW / 2, pz: 0             },
    ];
    for (const def of copingDefs) {
      const cop = BABYLON.MeshBuilder.CreateBox(def.n, {
        width: def.w, height: def.h, depth: def.d,
      }, scene);
      cop.position = new BABYLON.Vector3(def.px, CH / 2, def.pz);
      cop.material = copingMat;
      cop.parent   = this.root;
      this.copingMeshes.push(cop);
    }

    // ── 5. Overflow gutter channel ───────────────────────────────────────
    // A dark capping strip over the top of each wall — the overflow gutter
    // is not visible from above (hidden under coping) but reads from poolside
    // and underwater cameras as a distinct drainage channel.
    const GUTTER_H = 0.06;
    const GUTTER_INSET = WT; // gutter covers full wall-top width
    const gutterDefs = [
      { n: 'gutN', w: W,  h: GUTTER_H, d: GUTTER_INSET, px: 0,       pz:  L / 2 - WT / 2 },
      { n: 'gutS', w: W,  h: GUTTER_H, d: GUTTER_INSET, px: 0,       pz: -L / 2 + WT / 2 },
      { n: 'gutE', w: GUTTER_INSET, h: GUTTER_H, d: innerL, px:  W / 2 - WT / 2, pz: 0   },
      { n: 'gutW', w: GUTTER_INSET, h: GUTTER_H, d: innerL, px: -W / 2 + WT / 2, pz: 0   },
    ];
    for (const def of gutterDefs) {
      const g = BABYLON.MeshBuilder.CreateBox(def.n, {
        width: def.w, height: def.h, depth: def.d,
      }, scene);
      // Sit the gutter so its top face is flush with deck (y = 0) and it
      // plunges slightly into the wall top — creates shadow without geometry cuts
      g.position = new BABYLON.Vector3(def.px, -GUTTER_H / 2, def.pz);
      g.material = gutterMat;
      g.parent   = this.root;
      this.detailMeshes.push(g);
    }

    // ── 6. Lane centre lines on pool floor ───────────────────────────────
    // Thin dark stripe down the middle of each lane, running full pool length.
    // Sits 0.02 m above the floor top to prevent z-fighting.
    const laneWidth  = W / LC;
    const markingY   = -D + 0.25 + 0.02; // 2 cm above floor surface
    const markingLen = innerL - 0.1;      // leave small gap at each end

    for (let lane = 0; lane < LC; lane++) {
      const laneX = -W / 2 + (lane + 0.5) * laneWidth;

      const line = BABYLON.MeshBuilder.CreateBox(`laneLine${lane}`, {
        width:  0.20,
        height: 0.01,
        depth:  markingLen,
      }, scene);
      line.position = new BABYLON.Vector3(laneX, markingY, 0);
      line.material = markingMat;
      line.parent   = this.root;
      this.detailMeshes.push(line);
    }

    // ── 7. T-marks at 5 m from each end wall ────────────────────────────
    // Standard FINA T-mark: horizontal bar + stem pointing into pool.
    // One T per lane per end = 2 × LC total T-marks (each T = 2 boxes).
    const T_DIST    = 5.0;   // metres from end wall
    const T_BAR_W   = 0.60;  // horizontal bar width
    const T_BAR_D   = 0.18;  // bar depth (fore-aft)
    const T_STEM_W  = 0.18;  // stem width
    const T_STEM_D  = 0.90;  // stem depth (pointing into pool)
    const T_HEIGHT  = 0.012; // very flat

    const tMarkEnds = [
      { zBar: -L / 2 + T_DIST,              stemDir:  1 }, // south end, stem points north
      { zBar:  L / 2 - T_DIST,              stemDir: -1 }, // north end, stem points south
    ];

    for (const end of tMarkEnds) {
      for (let lane = 0; lane < LC; lane++) {
        const laneX = -W / 2 + (lane + 0.5) * laneWidth;

        // Horizontal bar
        const bar = BABYLON.MeshBuilder.CreateBox(`tBar_${lane}_${end.zBar.toFixed(0)}`, {
          width: T_BAR_W, height: T_HEIGHT, depth: T_BAR_D,
        }, scene);
        bar.position = new BABYLON.Vector3(laneX, markingY, end.zBar);
        bar.material = markingMat;
        bar.parent   = this.root;
        this.detailMeshes.push(bar);

        // Stem (attached to bar, extending into pool)
        const stemZ = end.zBar + end.stemDir * (T_BAR_D / 2 + T_STEM_D / 2);
        const stem  = BABYLON.MeshBuilder.CreateBox(`tStem_${lane}_${end.zBar.toFixed(0)}`, {
          width: T_STEM_W, height: T_HEIGHT, depth: T_STEM_D,
        }, scene);
        stem.position = new BABYLON.Vector3(laneX, markingY, stemZ);
        stem.material = markingMat;
        stem.parent   = this.root;
        this.detailMeshes.push(stem);
      }
    }

    // ── 8. Turn-wall touch pads ──────────────────────────────────────────
    // White Omega-style panels flush against the end walls, one per lane.
    // Positioned between the surface and 1.5 m depth (competition spec).
    const PAD_W    = laneWidth * 0.72;  // slightly narrower than lane width
    const PAD_H    = 0.90;              // m tall
    const PAD_D    = 0.04;              // thickness
    const PAD_Y    = -PAD_H / 2 - 0.05; // top edge 5 cm below water surface

    const padEnds = [
      { pz: -L / 2 + WT / 2 + PAD_D / 2 + 0.01 }, // south end inner face
      { pz:  L / 2 - WT / 2 - PAD_D / 2 - 0.01 }, // north end inner face
    ];

    for (const ep of padEnds) {
      for (let lane = 0; lane < LC; lane++) {
        const laneX = -W / 2 + (lane + 0.5) * laneWidth;

        const pad = BABYLON.MeshBuilder.CreateBox(`touchPad_${lane}_${ep.pz.toFixed(0)}`, {
          width: PAD_W, height: PAD_H, depth: PAD_D,
        }, scene);
        pad.position = new BABYLON.Vector3(laneX, PAD_Y, ep.pz);
        pad.material = padMat;
        pad.parent   = this.root;
        this.detailMeshes.push(pad);
      }
    }

    // ── 9. Rope anchor posts at pool ends ────────────────────────────────
    // Small stainless cylinders terminating each lane rope at both walls.
    // There are (LC - 1) lane ropes, positioned between lanes.
    const ANCHOR_D  = 0.08; // diameter
    const ANCHOR_H  = 0.16;
    const ANCHOR_Y  = 0.04; // flush with rope height

    const anchorEnds = [-L / 2, L / 2];
    for (const az of anchorEnds) {
      for (let rope = 1; rope < LC; rope++) {
        const ropeX = -W / 2 + rope * laneWidth;

        const anchor = BABYLON.MeshBuilder.CreateCylinder(
          `ropeAnchor_r${rope}_z${az.toFixed(0)}`,
          { diameter: ANCHOR_D, height: ANCHOR_H, tessellation: 8 },
          scene,
        );
        anchor.position = new BABYLON.Vector3(ropeX, ANCHOR_Y, az);
        anchor.material = anchorMat;
        anchor.parent   = this.root;
        this.detailMeshes.push(anchor);
      }
    }

    logger.log('[PoolStructure] Built (Phase 2)');
    return {
      root:         this.root,
      floorMesh:    this.floorMesh,
      wallMeshes:   this.wallMeshes,
      copingMeshes: this.copingMeshes,
      poolMaterial: this.poolMaterial,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * No-op in Phase 3 — theme colour is applied by ArenaMaterialLibrary.applyTheme().
   * Kept for backward-compatibility with ArenaManager._applyThemeInternal().
   */
  public setPoolColor(_color: BABYLON.Color3): void { /* handled by ArenaMaterialLibrary */ }

  public dispose(): void {
    this.floorMesh?.dispose();
    this.wallMeshes.forEach(m => m.dispose());
    this.copingMeshes.forEach(m => m.dispose());
    this.detailMeshes.forEach(m => m.dispose());
    // Materials are owned by ArenaMaterialLibrary — do not dispose here
    this.root?.dispose();
    logger.log('[PoolStructure] Disposed');
  }
}
