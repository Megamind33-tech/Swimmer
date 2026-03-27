/**
 * PoolStructure  —  Olympic Competition Pool
 * Builds a realistic Olympic-standard competition pool basin.
 *
 * Features:
 *   ✓ White ceramic tile floor with dark grout lines
 *   ✓ FINA-standard lane lines (black, 0.25m wide)
 *   ✓ T-marks at 5m from each end (turn warning)
 *   ✓ Distance markers at 15m intervals
 *   ✓ Crosshair targets on end walls
 *   ✓ Starting block numbers (1-8)
 *   ✓ Depth markers on walls
 *   ✓ Competition touch pads
 *   ✓ Overflow gutter system
 *
 * FINA Standards:
 *   - Lane lines: 0.25m wide, continuous black
 *   - T-marks: 0.5m from end walls
 *   - Target line: 0.3m below water surface on end walls
 *   - Pool depth markers: every 0.5m depth change
 *
 * Coordinate convention:
 *   Y = 0   : deck level / water surface
 *   Y = -3  : pool floor (BASIN_DEPTH = 3 m)
 *   Z = ±25 : pool ends (50 m pool)
 *   X = ±12.5: pool sides (25 m pool)
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
  private detailMeshes: BABYLON.Mesh[] = [];
  private textures:     BABYLON.DynamicTexture[] = [];

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

    // ── 1. Materials ───────────────────────────────────────────────────────
    this.poolMaterial = matLib.poolFloor;
    this.wallMaterial = matLib.poolWall;

    // Create custom Olympic tile texture with lane lines
    const floorTex = this._createOlympicFloorTexture(scene, config);
    const floorNorm = this._createTileNormalMap(scene);
    
    this.poolMaterial.albedoTexture = floorTex;
    this.poolMaterial.bumpTexture = floorNorm;

    const copingMat  = matLib.coping;
    const gutterMat  = matLib.gutter;
    const markingMat = matLib.laneMarking;
    const padMat     = matLib.touchPad;
    const anchorMat  = matLib.stainless;

    // ── 2. Pool floor ─────────────────────────────────────────────────────
    const innerW = W - WT * 2;
    const innerL = L - WT * 2;

    this.floorMesh = BABYLON.MeshBuilder.CreateBox('poolFloor', {
      width:  innerW,
      height: 0.25,
      depth:  innerL,
    }, scene);
    this.floorMesh.position.y = -D + 0.125;
    this.floorMesh.material   = this.poolMaterial;
    this.floorMesh.parent     = this.root;

    // ── 3. Basin walls with target crosses ────────────────────────────────
    const wallDefs = [
      { n: 'wallN', w: W,  h: D, d: WT,  px: 0,       py: -D / 2, pz:  L / 2,  isEnd: true },
      { n: 'wallS', w: W,  h: D, d: WT,  px: 0,       py: -D / 2, pz: -L / 2,  isEnd: true },
      { n: 'wallE', w: WT, h: D, d: L,   px:  W / 2,  py: -D / 2, pz:  0,      isEnd: false },
      { n: 'wallW', w: WT, h: D, d: L,   px: -W / 2,  py: -D / 2, pz:  0,      isEnd: false },
    ];
    
    for (const def of wallDefs) {
      const wall = BABYLON.MeshBuilder.CreateBox(def.n, {
        width: def.w, height: def.h, depth: def.d,
      }, scene);
      wall.position = new BABYLON.Vector3(def.px, def.py, def.pz);
      wall.material = this.wallMaterial;
      wall.parent   = this.root;
      this.wallMeshes.push(wall);

      // Add target crosses on end walls
      if (def.isEnd) {
        this._buildTargetCrosses(scene, def, LC, W, D, markingMat);
      }
    }

    // ── 4. Coping edge tiles ───────────────────────────────────────────────
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

    // ── 5. Overflow gutter ─────────────────────────────────────────────────
    const GUTTER_H = 0.06;
    const gutterDefs = [
      { n: 'gutN', w: W,  h: GUTTER_H, d: WT, px: 0,       pz:  L / 2 - WT / 2 },
      { n: 'gutS', w: W,  h: GUTTER_H, d: WT, px: 0,       pz: -L / 2 + WT / 2 },
      { n: 'gutE', w: WT, h: GUTTER_H, d: innerL, px:  W / 2 - WT / 2, pz: 0   },
      { n: 'gutW', w: WT, h: GUTTER_H, d: innerL, px: -W / 2 + WT / 2, pz: 0   },
    ];
    for (const def of gutterDefs) {
      const g = BABYLON.MeshBuilder.CreateBox(def.n, {
        width: def.w, height: def.h, depth: def.d,
      }, scene);
      g.position = new BABYLON.Vector3(def.px, -GUTTER_H / 2, def.pz);
      g.material = gutterMat;
      g.parent   = this.root;
      this.detailMeshes.push(g);
    }

    // ── 6. FINA lane lines (raised from floor) ────────────────────────────
    const laneWidth = W / LC;
    const markingY  = -D + 0.25 + 0.015; // 1.5 cm above floor

    for (let lane = 0; lane < LC; lane++) {
      const laneX = -W / 2 + (lane + 0.5) * laneWidth;

      // Main lane line (continuous)
      const line = BABYLON.MeshBuilder.CreateBox(`laneLine${lane}`, {
        width:  0.25,  // FINA standard width
        height: 0.015,
        depth:  innerL - 0.5,
      }, scene);
      line.position = new BABYLON.Vector3(laneX, markingY, 0);
      line.material = markingMat;
      line.parent   = this.root;
      this.detailMeshes.push(line);

      // Cross lines at ends (perpendicular)
      for (const endZ of [-L / 2 + 2, L / 2 - 2]) {
        const crossLine = BABYLON.MeshBuilder.CreateBox(`crossLine${lane}_${endZ}`, {
          width:  laneWidth * 0.8,
          height: 0.015,
          depth:  0.25,
        }, scene);
        crossLine.position = new BABYLON.Vector3(laneX, markingY, endZ);
        crossLine.material = markingMat;
        crossLine.parent   = this.root;
        this.detailMeshes.push(crossLine);
      }
    }

    // ── 7. T-marks at 5m from each end ────────────────────────────────────
    const T_DIST    = 5.0;
    const T_BAR_W   = 0.50;
    const T_BAR_D   = 0.25;
    const T_STEM_W  = 0.25;
    const T_STEM_D  = 1.0;
    const T_HEIGHT  = 0.012;

    const tMarkEnds = [
      { zBar: -L / 2 + T_DIST, stemDir: 1 },
      { zBar:  L / 2 - T_DIST, stemDir: -1 },
    ];

    for (const end of tMarkEnds) {
      for (let lane = 0; lane < LC; lane++) {
        const laneX = -W / 2 + (lane + 0.5) * laneWidth;

        // Horizontal bar
        const bar = BABYLON.MeshBuilder.CreateBox(`tBar_${lane}_${end.zBar.toFixed(0)}`, {
          width: T_BAR_W, height: T_HEIGHT, depth: T_BAR_D,
        }, scene);
        bar.position = new BABYLON.Vector3(laneX, markingY + 0.005, end.zBar);
        bar.material = markingMat;
        bar.parent   = this.root;
        this.detailMeshes.push(bar);

        // Stem
        const stemZ = end.zBar + end.stemDir * (T_BAR_D / 2 + T_STEM_D / 2);
        const stem  = BABYLON.MeshBuilder.CreateBox(`tStem_${lane}_${end.zBar.toFixed(0)}`, {
          width: T_STEM_W, height: T_HEIGHT, depth: T_STEM_D,
        }, scene);
        stem.position = new BABYLON.Vector3(laneX, markingY + 0.005, stemZ);
        stem.material = markingMat;
        stem.parent   = this.root;
        this.detailMeshes.push(stem);
      }
    }

    // ── 8. 15m distance markers ───────────────────────────────────────────
    const DIST_MARKER_W = 0.3;
    const DIST_MARKER_H = 0.015;

    for (const markerZ of [-L / 2 + 15, L / 2 - 15, -L / 2 + 25, L / 2 - 25]) {
      // Side markers on pool floor edges
      for (const sideX of [-W / 2 + WT + 0.5, W / 2 - WT - 0.5]) {
        const marker = BABYLON.MeshBuilder.CreateBox(`distMarker_${markerZ.toFixed(0)}_${sideX.toFixed(0)}`, {
          width:  DIST_MARKER_W,
          height: DIST_MARKER_H,
          depth:  1.0,
        }, scene);
        marker.position = new BABYLON.Vector3(sideX, markingY, markerZ);
        marker.material = markingMat;
        marker.parent   = this.root;
        this.detailMeshes.push(marker);
      }
    }

    // ── 9. Competition touch pads ─────────────────────────────────────────
    const PAD_W = laneWidth * 0.80;
    const PAD_H = 0.90;
    const PAD_D = 0.04;
    const PAD_Y = -PAD_H / 2 - 0.05;

    const padEnds = [
      { pz: -L / 2 + WT / 2 + PAD_D / 2 + 0.01 },
      { pz:  L / 2 - WT / 2 - PAD_D / 2 - 0.01 },
    ];

    for (const ep of padEnds) {
      for (let lane = 0; lane < LC; lane++) {
        const laneX = -W / 2 + (lane + 0.5) * laneWidth;

        // Touch pad with lane number texture
        const padTex = this._createTouchPadTexture(scene, lane + 1);
        const padMat = new BABYLON.StandardMaterial(`padMat_${lane}`, scene);
        padMat.diffuseTexture = padTex;
        padMat.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        const pad = BABYLON.MeshBuilder.CreateBox(`touchPad_${lane}_${ep.pz.toFixed(0)}`, {
          width: PAD_W, height: PAD_H, depth: PAD_D,
        }, scene);
        pad.position = new BABYLON.Vector3(laneX, PAD_Y, ep.pz);
        pad.material = padMat;
        pad.parent   = this.root;
        this.detailMeshes.push(pad);
      }
    }

    // ── 10. Starting block number markers on deck ────────────────────────
    for (let lane = 0; lane < LC; lane++) {
      const laneX = -W / 2 + (lane + 0.5) * laneWidth;
      
      // Number plate on deck at starting end
      const numTex = this._createLaneNumberTexture(scene, lane + 1);
      const numMat = new BABYLON.StandardMaterial(`laneNumMat_${lane}`, scene);
      numMat.diffuseTexture = numTex;
      numMat.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);

      const numPlate = BABYLON.MeshBuilder.CreateBox(`laneNum_${lane}`, {
        width: 0.6,
        height: 0.02,
        depth: 0.6,
      }, scene);
      numPlate.position = new BABYLON.Vector3(laneX, 0.01, -L / 2 - 1.5);
      numPlate.material = numMat;
      numPlate.parent   = this.root;
      this.detailMeshes.push(numPlate);
    }

    // ── 11. Rope anchor posts ────────────────────────────────────────────
    const ANCHOR_D = 0.08;
    const ANCHOR_H = 0.16;
    const ANCHOR_Y = 0.04;

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

    logger.log('[PoolStructure] Built Olympic Competition Pool');
    return {
      root:         this.root,
      floorMesh:    this.floorMesh,
      wallMeshes:   this.wallMeshes,
      copingMeshes: this.copingMeshes,
      poolMaterial: this.poolMaterial,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Olympic Floor Texture with Lane Lines
  // ─────────────────────────────────────────────────────────────────────────

  private _createOlympicFloorTexture(scene: BABYLON.Scene, config: IArenaConfig): BABYLON.DynamicTexture {
    const { poolWidth: W, laneCount: LC } = config;

    // High resolution texture for the pool floor — matches SWIM26 reference image
    // Light aqua/cyan tiles, dark navy lane lines, visible grout grid
    const texW = 2048;
    const texH = 4096;  // 2:1 ratio for 25m wide × 50m long pool
    const tex = new BABYLON.DynamicTexture('olympicFloorTex', { width: texW, height: texH }, scene, true);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    // Base tile colour — light aqua (matching SWIM26 pool image)
    ctx.fillStyle = '#b8e8f4';
    ctx.fillRect(0, 0, texW, texH);

    // Subtle tile colour variation (lighter centre of each tile, gives glossy feel)
    const TILE_PX_W = texW / 25;   // 1m tiles across 25m width
    const TILE_PX_H = texH / 50;   // 1m tiles across 50m length

    for (let tx = 0; tx < 25; tx++) {
      for (let ty = 0; ty < 50; ty++) {
        const x0 = Math.round(tx * TILE_PX_W);
        const y0 = Math.round(ty * TILE_PX_H);
        const tw  = Math.round(TILE_PX_W);
        const th  = Math.round(TILE_PX_H);
        const grad = ctx.createRadialGradient(
          x0 + tw * 0.45, y0 + th * 0.38, tw * 0.05,
          x0 + tw * 0.50, y0 + th * 0.50, tw * 0.65,
        );
        grad.addColorStop(0,   'rgba(220, 248, 255, 0.28)');
        grad.addColorStop(0.6, 'rgba(184, 232, 244, 0.00)');
        grad.addColorStop(1,   'rgba(150, 210, 228, 0.10)');
        ctx.fillStyle = grad;
        ctx.fillRect(x0, y0, tw, th);
      }
    }

    // Grout lines — thin dark lines between tiles
    ctx.strokeStyle = '#6ab0c4';
    ctx.lineWidth = 3;
    for (let x = 0; x <= texW; x += TILE_PX_W) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, texH); ctx.stroke();
    }
    for (let y = 0; y <= texH; y += TILE_PX_H) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(texW, y); ctx.stroke();
    }

    // ── FINA lane lines (dark navy blue, 0.25 m wide) ──────────────────
    const laneWidth = texW / LC;
    const lineWidth = Math.max(8, texW * 0.25 / W);  // 0.25m wide

    ctx.fillStyle = '#05102a';
    for (let lane = 0; lane < LC; lane++) {
      const laneCenterX = (lane + 0.5) * laneWidth;
      ctx.fillRect(laneCenterX - lineWidth / 2, 0, lineWidth, texH);
    }

    // ── Dark edge borders (pool wall boundary lines) ────────────────────
    ctx.fillStyle = '#05102a';
    ctx.fillRect(0, 0, lineWidth * 0.6, texH);
    ctx.fillRect(texW - lineWidth * 0.6, 0, lineWidth * 0.6, texH);

    // ── T-mark cross lines at 5m from each end ──────────────────────────
    const T_DIST_PX = texH * 5 / 50;
    ctx.fillStyle = '#05102a';
    ctx.fillRect(0, texH - T_DIST_PX - lineWidth / 2, texW, lineWidth * 0.8);
    ctx.fillRect(0,              T_DIST_PX - lineWidth / 2, texW, lineWidth * 0.8);

    tex.update();
    this.textures.push(tex);
    return tex;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Tile Normal Map
  // ─────────────────────────────────────────────────────────────────────────

  private _createTileNormalMap(scene: BABYLON.Scene): BABYLON.DynamicTexture {
    const S = 512;
    const tex = new BABYLON.DynamicTexture('tileNorm', { width: S, height: S }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
    const img = ctx.createImageData(S, S);
    const d = img.data;

    const GROUT = 4;

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const idx = (y * S + x) * 4;
        let nx = 128, ny = 128;

        // Grout indentations
        if (x < GROUT) {
          nx = 128 + Math.round(30 * (1 - x / GROUT));
        } else if (x >= S - GROUT) {
          nx = 128 - Math.round(30 * (1 - (S - x) / GROUT));
        }
        if (y < GROUT) {
          ny = 128 + Math.round(30 * (1 - y / GROUT));
        } else if (y >= S - GROUT) {
          ny = 128 - Math.round(30 * (1 - (S - y) / GROUT));
        }

        d[idx]     = nx;
        d[idx + 1] = ny;
        d[idx + 2] = 255;
        d[idx + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
    tex.update();
    this.textures.push(tex);
    return tex;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Target Crosses on End Walls
  // ─────────────────────────────────────────────────────────────────────────

  private _buildTargetCrosses(
    scene:   BABYLON.Scene,
    wallDef: { w: number; h: number; d: number; px: number; pz: number },
    LC:      number,
    W:       number,
    D:       number,
    mat:     BABYLON.PBRMaterial,
  ): void {
    const laneWidth = W / LC;
    const CROSS_SIZE = 0.4;
    const CROSS_THICKNESS = 0.08;
    const CROSS_Y = -0.5;  // 0.5m below water surface

    for (let lane = 0; lane < LC; lane++) {
      const laneX = -W / 2 + (lane + 0.5) * laneWidth;
      const crossZ = wallDef.pz + (wallDef.pz > 0 ? -0.25 : 0.25);

      // Horizontal bar
      const hBar = BABYLON.MeshBuilder.CreateBox(`targetH_${lane}_${wallDef.pz.toFixed(0)}`, {
        width: CROSS_SIZE,
        height: CROSS_THICKNESS,
        depth: 0.02,
      }, scene);
      hBar.position = new BABYLON.Vector3(laneX, CROSS_Y, crossZ);
      hBar.material = mat;
      hBar.parent   = this.root;
      this.detailMeshes.push(hBar);

      // Vertical bar
      const vBar = BABYLON.MeshBuilder.CreateBox(`targetV_${lane}_${wallDef.pz.toFixed(0)}`, {
        width: CROSS_THICKNESS,
        height: CROSS_SIZE,
        depth: 0.02,
      }, scene);
      vBar.position = new BABYLON.Vector3(laneX, CROSS_Y, crossZ);
      vBar.material = mat;
      vBar.parent   = this.root;
      this.detailMeshes.push(vBar);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Touch Pad Texture with Lane Number
  // ─────────────────────────────────────────────────────────────────────────

  private _createTouchPadTexture(scene: BABYLON.Scene, laneNum: number): BABYLON.DynamicTexture {
    const tex = new BABYLON.DynamicTexture(`padTex_${laneNum}`, { width: 256, height: 384 }, scene, true);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 384);

    // Black border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 248, 376);

    // Lane number (large)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 180px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(laneNum), 128, 200);

    tex.update();
    this.textures.push(tex);
    return tex;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Lane Number Texture for Deck
  // ─────────────────────────────────────────────────────────────────────────

  private _createLaneNumberTexture(scene: BABYLON.Scene, laneNum: number): BABYLON.DynamicTexture {
    const tex = new BABYLON.DynamicTexture(`laneNumTex_${laneNum}`, { width: 128, height: 128 }, scene, true);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    // Dark background
    ctx.fillStyle = '#1a2535';
    ctx.fillRect(0, 0, 128, 128);

    // White border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 120, 120);

    // Lane number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(laneNum), 64, 64);

    tex.update();
    this.textures.push(tex);
    return tex;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────────

  public setPoolColor(_color: BABYLON.Color3): void { /* handled by ArenaMaterialLibrary */ }

  public dispose(): void {
    this.floorMesh?.dispose();
    this.wallMeshes.forEach(m => m.dispose());
    this.copingMeshes.forEach(m => m.dispose());
    this.detailMeshes.forEach(m => m.dispose());
    this.textures.forEach(t => t.dispose());
    this.root?.dispose();
    logger.log('[PoolStructure] Disposed');
  }
}
