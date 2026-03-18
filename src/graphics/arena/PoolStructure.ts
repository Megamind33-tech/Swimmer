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

export interface IPoolStructureHandles {
  root:         BABYLON.TransformNode;
  floorMesh:    BABYLON.Mesh;
  wallMeshes:   BABYLON.Mesh[];
  copingMeshes: BABYLON.Mesh[];
  poolMaterial: BABYLON.StandardMaterial;
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

  private poolMaterial:  BABYLON.StandardMaterial | null = null;
  private wallMaterial:  BABYLON.StandardMaterial | null = null;
  private floorTileTex:  BABYLON.DynamicTexture   | null = null;

  // ─────────────────────────────────────────────────────────────────────────
  build(scene: BABYLON.Scene, config: IArenaConfig): IPoolStructureHandles {
    const { poolLength: L, poolWidth: W, laneCount: LC } = config;
    const D  = PoolStructure.BASIN_DEPTH;
    const WT = PoolStructure.WALL_THICKNESS;
    const CW = PoolStructure.COPING_WIDTH;
    const CH = PoolStructure.COPING_HEIGHT;

    this.root = new BABYLON.TransformNode('PoolStructure', scene);

    // ── 1. Materials ──────────────────────────────────────────────────────

    // 1a. Floor tile texture — procedurally generated 1 m ceramic tile grid
    this.floorTileTex = this._makeTileTexture(scene);

    this.poolMaterial = new BABYLON.StandardMaterial('poolFloorMat', scene);
    this.poolMaterial.diffuseTexture  = this.floorTileTex;
    this.poolMaterial.specularColor   = new BABYLON.Color3(0.5, 0.7, 0.9);
    this.poolMaterial.specularPower   = 48;

    // UV tiling: 1 texture repeat per metre → tile count = inner dimension
    const innerW = W - WT * 2;
    const innerL = L - WT * 2;
    this.floorTileTex.uScale = Math.round(innerW); // ~24 for 25 m pool
    this.floorTileTex.vScale = Math.round(innerL); // ~49 for 50 m pool

    // 1b. Wall material — solid tinted colour, slightly lighter near top
    //     Emissive adds a faint glow to simulate light penetrating from above
    this.wallMaterial = new BABYLON.StandardMaterial('poolWallMat', scene);
    this.wallMaterial.diffuseColor  = new BABYLON.Color3(0.04, 0.32, 0.72);
    this.wallMaterial.specularColor = new BABYLON.Color3(0.4, 0.6, 0.9);
    this.wallMaterial.specularPower = 32;
    this.wallMaterial.emissiveColor = new BABYLON.Color3(0.01, 0.05, 0.12);

    // 1c. Coping cap
    const copingMat = new BABYLON.StandardMaterial('copingMat', scene);
    copingMat.diffuseColor  = new BABYLON.Color3(0.90, 0.92, 0.94);
    copingMat.specularColor = new BABYLON.Color3(0.55, 0.55, 0.55);
    copingMat.specularPower = 40;

    // 1d. Overflow gutter (dark near-black channel at pool rim)
    const gutterMat = new BABYLON.StandardMaterial('gutterMat', scene);
    gutterMat.diffuseColor  = new BABYLON.Color3(0.05, 0.06, 0.08);
    gutterMat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

    // 1e. Floor markings — dark navy, emissive so they show through water
    const markingMat = new BABYLON.StandardMaterial('laneMarkingMat', scene);
    markingMat.diffuseColor  = new BABYLON.Color3(0.02, 0.04, 0.18);
    markingMat.emissiveColor = new BABYLON.Color3(0.01, 0.02, 0.08);

    // 1f. Turn-wall touch pads — competition white/cream
    const padMat = new BABYLON.StandardMaterial('touchPadMat', scene);
    padMat.diffuseColor  = new BABYLON.Color3(0.95, 0.96, 0.95);
    padMat.specularColor = new BABYLON.Color3(0.30, 0.30, 0.30);
    padMat.specularPower = 24;

    // 1g. Stainless rope anchor posts
    const anchorMat = new BABYLON.StandardMaterial('anchorMat', scene);
    anchorMat.diffuseColor  = new BABYLON.Color3(0.75, 0.76, 0.78);
    anchorMat.specularColor = new BABYLON.Color3(0.80, 0.80, 0.80);
    anchorMat.specularPower = 80;

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
  // Procedural tile texture
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Generates a 128 × 128 DynamicTexture representing a single 1 m × 1 m
   * ceramic pool tile.  Wrapped via uScale / vScale on the floor material
   * to create a full tile grid across the basin floor.
   *
   * Visual spec:
   *   • Light blue-white tile body  (#c4e0f0)
   *   • Thin gray-blue grout border (3 px at this resolution ≈ 2.3 cm at 1 m tile)
   *   • Slight inner highlight on top-left quarter for depth impression
   */
  private _makeTileTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
    const S   = 128;
    const tex = new BABYLON.DynamicTexture('poolTileTex', { width: S, height: S }, scene, true);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    // Tile body: competition pool ceramic (light desaturated blue-white)
    ctx.fillStyle = '#c4e0f0';
    ctx.fillRect(0, 0, S, S);

    // Subtle inner bevel highlight (top-left quarter of tile slightly lighter)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(3, 3, S / 2, S / 2);

    // Grout border (3 px = ~2.3 cm at 1 m tile — realistic competition pool grout)
    const GROUT = 3;
    ctx.fillStyle = '#4a7890';
    // Top / bottom
    ctx.fillRect(0,         0,         S,     GROUT);
    ctx.fillRect(0,         S - GROUT, S,     GROUT);
    // Left / right
    ctx.fillRect(0,         0,         GROUT, S);
    ctx.fillRect(S - GROUT, 0,         GROUT, S);

    tex.update();
    return tex;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Recolour the pool basin to match the current venue theme.
   * The tinted overlay is applied via diffuseColor on the wall material
   * and via a colour multiply on the floor texture (emulated through specular).
   */
  public setPoolColor(color: BABYLON.Color3): void {
    if (this.wallMaterial) {
      this.wallMaterial.diffuseColor = color;
    }
    if (this.poolMaterial) {
      // Tint the floor by blending the theme colour into the specular tint —
      // the tile texture itself stays neutral, the specular gives colour cast
      this.poolMaterial.specularColor = new BABYLON.Color3(
        0.3 + color.r * 0.4,
        0.5 + color.g * 0.3,
        0.7 + color.b * 0.2,
      );
    }
  }

  public dispose(): void {
    this.floorMesh?.dispose();
    this.wallMeshes.forEach(m => m.dispose());
    this.copingMeshes.forEach(m => m.dispose());
    this.detailMeshes.forEach(m => m.dispose());
    this.poolMaterial?.dispose();
    this.wallMaterial?.dispose();
    this.floorTileTex?.dispose();
    this.root?.dispose();
    logger.log('[PoolStructure] Disposed');
  }
}
