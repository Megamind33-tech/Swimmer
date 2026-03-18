/**
 * PoolStructure
 * Builds the physical shell of the competition pool:
 *   - pool floor (basin bottom)
 *   - four basin walls
 *   - coping edge tiles around the perimeter
 *
 * AUDIT ISSUES FIXED HERE:
 *   - Old code used a single solid box for the whole pool, hiding interior
 *   - Wall thickness was only 0.3 m (visually thin on close cameras)
 *   - No coping / gutter edge detail at all
 *   - Material was fully opaque solid blue — no tiling, no depth gradient
 *
 * Phase 2 will add:
 *   - Tile UV texture with grout lines
 *   - Black cross / T-mark decals at lane ends
 *   - Depth gradient on walls (lighter at top, darker at bottom)
 *   - Gutter channel mesh (overflow gutter around top edge)
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig } from '../../types';
import { logger } from '../../utils';

export interface IPoolStructureHandles {
  root: BABYLON.TransformNode;
  floorMesh: BABYLON.Mesh;
  wallMeshes: BABYLON.Mesh[];
  copingMeshes: BABYLON.Mesh[];
  poolMaterial: BABYLON.StandardMaterial;
}

export class PoolStructure {
  private root: BABYLON.TransformNode | null = null;
  private floorMesh: BABYLON.Mesh | null = null;
  private wallMeshes: BABYLON.Mesh[] = [];
  private copingMeshes: BABYLON.Mesh[] = [];
  private poolMaterial: BABYLON.StandardMaterial | null = null;

  // ─── Standard competition pool geometry constants ─────────────────────────
  static readonly BASIN_DEPTH     = 3.0;   // metres below deck (y=0)
  static readonly WALL_THICKNESS  = 0.4;
  static readonly COPING_OVERHANG = 0.30;  // coping tile width on each side
  static readonly COPING_HEIGHT   = 0.14;

  build(scene: BABYLON.Scene, config: IArenaConfig): IPoolStructureHandles {
    const L  = config.poolLength;
    const W  = config.poolWidth;
    const D  = PoolStructure.BASIN_DEPTH;
    const WT = PoolStructure.WALL_THICKNESS;
    const CW = PoolStructure.COPING_OVERHANG;
    const CH = PoolStructure.COPING_HEIGHT;

    this.root = new BABYLON.TransformNode('PoolStructure', scene);

    // ── Pool tile material ────────────────────────────────────────────────
    this.poolMaterial = new BABYLON.StandardMaterial('poolMat', scene);
    this.poolMaterial.diffuseColor  = new BABYLON.Color3(0.0, 0.30, 0.70);
    this.poolMaterial.specularColor = new BABYLON.Color3(0.6, 0.8, 1.0);
    this.poolMaterial.specularPower = 64;
    // Phase 2: replace diffuseColor with a tiled texture + normal map

    // ── Basin floor ───────────────────────────────────────────────────────
    this.floorMesh = BABYLON.MeshBuilder.CreateBox('poolFloor', {
      width:  W - WT * 2,
      height: 0.25,
      depth:  L - WT * 2,
    }, scene);
    this.floorMesh.position.y = -D + 0.12;
    this.floorMesh.material   = this.poolMaterial;
    this.floorMesh.parent     = this.root;

    // ── Basin walls (4 sides) ─────────────────────────────────────────────
    const wallDefs = [
      { name: 'wallN', w: W,  h: D, d: WT,  px: 0,      py: -D / 2, pz:  L / 2 },
      { name: 'wallS', w: W,  h: D, d: WT,  px: 0,      py: -D / 2, pz: -L / 2 },
      { name: 'wallE', w: WT, h: D, d: L,   px:  W / 2, py: -D / 2, pz: 0      },
      { name: 'wallW', w: WT, h: D, d: L,   px: -W / 2, py: -D / 2, pz: 0      },
    ];

    for (const def of wallDefs) {
      const wall = BABYLON.MeshBuilder.CreateBox(def.name, {
        width: def.w, height: def.h, depth: def.d,
      }, scene);
      wall.position = new BABYLON.Vector3(def.px, def.py, def.pz);
      wall.material = this.poolMaterial;
      wall.parent   = this.root;
      this.wallMeshes.push(wall);
    }

    // ── Coping edge tiles ─────────────────────────────────────────────────
    const copingMat = new BABYLON.StandardMaterial('copingMat', scene);
    copingMat.diffuseColor  = new BABYLON.Color3(0.90, 0.92, 0.94);
    copingMat.specularColor = new BABYLON.Color3(0.50, 0.50, 0.50);
    copingMat.specularPower = 32;

    const copingDefs = [
      { name: 'copN', w: W + CW * 2, h: CH, d: CW, px: 0,          pz:  L / 2 + CW / 2 },
      { name: 'copS', w: W + CW * 2, h: CH, d: CW, px: 0,          pz: -L / 2 - CW / 2 },
      { name: 'copE', w: CW,         h: CH, d: L,   px:  W / 2 + CW / 2, pz: 0          },
      { name: 'copW', w: CW,         h: CH, d: L,   px: -W / 2 - CW / 2, pz: 0          },
    ];

    for (const def of copingDefs) {
      const cop = BABYLON.MeshBuilder.CreateBox(def.name, {
        width: def.w, height: def.h, depth: def.d,
      }, scene);
      cop.position = new BABYLON.Vector3(def.px, CH / 2, def.pz);
      cop.material = copingMat;
      cop.parent   = this.root;
      this.copingMeshes.push(cop);
    }

    logger.log('[PoolStructure] Built');
    return {
      root:         this.root,
      floorMesh:    this.floorMesh,
      wallMeshes:   this.wallMeshes,
      copingMeshes: this.copingMeshes,
      poolMaterial: this.poolMaterial,
    };
  }

  /** Recolour the pool basin (driven by ArenaAtmosphere theme changes). */
  public setPoolColor(color: BABYLON.Color3): void {
    if (this.poolMaterial) this.poolMaterial.diffuseColor = color;
  }

  public dispose(): void {
    this.floorMesh?.dispose();
    this.wallMeshes.forEach(m => m.dispose());
    this.copingMeshes.forEach(m => m.dispose());
    this.poolMaterial?.dispose();
    this.root?.dispose();
    logger.log('[PoolStructure] Disposed');
  }
}
