/**
 * ArenaMaterialLibrary  —  Phase 6 update
 * Added arenaSteel and arenaGlass materials for Phase 6 architectural additions.
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig } from '../../types';
import { logger } from '../../utils';

// PoolTheme colour table — same palette as ArenaAtmosphere uses
const THEME_WATER_COLORS: Record<string, BABYLON.Color3> = {
  OLYMPIC:      new BABYLON.Color3(0.04, 0.32, 0.72),
  CHAMPIONSHIP: new BABYLON.Color3(0.02, 0.40, 0.60),
  NEON:         new BABYLON.Color3(0.00, 0.80, 0.70),
  SUNSET:       new BABYLON.Color3(0.25, 0.30, 0.60),
  CUSTOM:       new BABYLON.Color3(0.04, 0.32, 0.72),
};

export class ArenaMaterialLibrary {
  // ── Pool basin ─────────────────────────────────────────────────────────────
  public poolFloor!:    BABYLON.PBRMaterial; // glazed ceramic tile
  public poolWall!:     BABYLON.PBRMaterial; // tiled wall (tinted by theme)
  public coping!:       BABYLON.PBRMaterial; // brushed stone pool edge
  public gutter!:       BABYLON.PBRMaterial; // overflow drainage channel
  public laneMarking!:  BABYLON.PBRMaterial; // epoxy painted lines on floor
  public touchPad!:     BABYLON.PBRMaterial; // competition rubber turn pad
  public stainless!:    BABYLON.PBRMaterial; // brushed stainless (shared across modules)

  // ── Pool deck ──────────────────────────────────────────────────────────────
  public deckDry!:      BABYLON.PBRMaterial; // anti-slip dry concrete
  public deckWet!:      BABYLON.PBRMaterial; // splash-wet zone near pool
  public drainGrate!:   BABYLON.PBRMaterial; // cast-iron drain grate

  // ── Starting blocks ────────────────────────────────────────────────────────
  public blockPedestal!: BABYLON.PBRMaterial; // coated steel structure
  public blockPlatform!: BABYLON.PBRMaterial; // anti-slip yellow rubber

  // ── Lane system ────────────────────────────────────────────────────────────
  public ropeGreen!:    BABYLON.PBRMaterial;
  public ropeRed!:      BABYLON.PBRMaterial;
  public ropeYellow!:   BABYLON.PBRMaterial;
  public flagPole!:     BABYLON.PBRMaterial; // anodized aluminium
  public flagLine!:     BABYLON.PBRMaterial; // nylon rope
  public pennant!:      BABYLON.PBRMaterial[]; // [red, yellow, blue, green]

  // ── Arena architecture ─────────────────────────────────────────────────────
  public arenaWall!:    BABYLON.PBRMaterial;
  public arenaCeiling!: BABYLON.PBRMaterial;
  public column!:       BABYLON.PBRMaterial;
  public bleacher!:     BABYLON.PBRMaterial;
  public seat!:         BABYLON.PBRMaterial;

  // ── Phase 6 additions ──────────────────────────────────────────────────────
  public arenaSteel!:   BABYLON.PBRMaterial; // dark structural steel (trusses, rigs)
  public arenaGlass!:   BABYLON.PBRMaterial; // tinted clerestory glazing

  // ── Internal ───────────────────────────────────────────────────────────────
  private _allMaterials: BABYLON.PBRMaterial[] = [];
  private _textures:     BABYLON.BaseTexture[] = [];

  // ─────────────────────────────────────────────────────────────────────────
  // Build
  // ─────────────────────────────────────────────────────────────────────────

  public build(
    scene:       BABYLON.Scene,
    _config:     IArenaConfig,
    qualityTier: 'LOW' | 'MEDIUM' | 'HIGH',
  ): void {
    const useBump = qualityTier !== 'LOW';

    // Procedural textures ─────────────────────────────────────────────────────
    const tileTex   = this._makeTileAlbedoTexture(scene);
    const tileNorm  = useBump ? this._makeTileNormalTexture(scene) : null;
    const concNorm  = useBump ? this._makeConcreteNormalTexture(scene) : null;

    if (tileNorm)  this._textures.push(tileNorm);
    if (concNorm)  this._textures.push(concNorm);
    this._textures.push(tileTex);

    // ── Pool basin ────────────────────────────────────────────────────────────
    this.poolFloor = this._pbr('poolFloor', scene, {
      albedoTexture:        tileTex,
      albedoColor:          new BABYLON.Color3(1, 1, 1),
      metallic:             0.00,
      roughness:            0.10,
      bumpTexture:          tileNorm,
      environmentIntensity: 0.06, // glazed tile: subtle gloss under overhead lights
    });
    // uScale / vScale are applied by PoolStructure on the texture itself

    this.poolWall = this._pbr('poolWall', scene, {
      albedoColor:          new BABYLON.Color3(0.04, 0.32, 0.72), // OLYMPIC default
      metallic:             0.00,
      roughness:            0.18,
      environmentIntensity: 0.04, // wet submerged tiles catch slight reflection
    });

    this.coping = this._pbr('coping', scene, {
      albedoColor:  new BABYLON.Color3(0.90, 0.92, 0.94),
      metallic:     0.00,
      roughness:    0.52,
      bumpTexture:  concNorm,
    });

    this.gutter = this._pbr('gutter', scene, {
      albedoColor: new BABYLON.Color3(0.05, 0.06, 0.08),
      metallic:    0.02,
      roughness:   0.78,
    });

    this.laneMarking = this._pbr('laneMarking', scene, {
      albedoColor:   new BABYLON.Color3(0.02, 0.04, 0.18),
      emissiveColor: new BABYLON.Color3(0.01, 0.02, 0.08),
      metallic:      0.00,
      roughness:     0.35,
    });

    this.touchPad = this._pbr('touchPad', scene, {
      albedoColor: new BABYLON.Color3(0.95, 0.96, 0.95),
      metallic:    0.00,
      roughness:   0.62,
    });

    this.stainless = this._pbr('stainless', scene, {
      albedoColor:          new BABYLON.Color3(0.72, 0.74, 0.76),
      metallic:             0.88,
      roughness:            0.22,
      environmentIntensity: 0.38, // brushed stainless — pool ladders, handles, anchors
    });

    // ── Pool deck ─────────────────────────────────────────────────────────────
    this.deckDry = this._pbr('deckDry', scene, {
      albedoColor:  new BABYLON.Color3(0.80, 0.82, 0.84),
      metallic:     0.00,
      roughness:    0.88,
      bumpTexture:  concNorm,
    });

    this.deckWet = this._pbr('deckWet', scene, {
      albedoColor:          new BABYLON.Color3(0.66, 0.70, 0.74),
      metallic:             0.00,
      roughness:            0.42,
      environmentIntensity: 0.10, // wet concrete splash zone — visible sheen
    });

    this.drainGrate = this._pbr('drainGrate', scene, {
      albedoColor: new BABYLON.Color3(0.10, 0.10, 0.11),
      metallic:    0.05,
      roughness:   0.80,
    });

    // ── Starting blocks ───────────────────────────────────────────────────────
    this.blockPedestal = this._pbr('blockPedestal', scene, {
      albedoColor: new BABYLON.Color3(0.18, 0.18, 0.20),
      metallic:    0.12,
      roughness:   0.68,
    });

    this.blockPlatform = this._pbr('blockPlatform', scene, {
      albedoColor: new BABYLON.Color3(1.00, 0.82, 0.00), // ISL yellow
      metallic:    0.00,
      roughness:   0.95,
    });

    // ── Lane ropes ────────────────────────────────────────────────────────────
    this.ropeGreen = this._pbr('ropeGreen', scene, {
      albedoColor: new BABYLON.Color3(0.08, 0.65, 0.15),
      metallic:    0.00,
      roughness:   0.65,
    });

    this.ropeRed = this._pbr('ropeRed', scene, {
      albedoColor: new BABYLON.Color3(0.88, 0.12, 0.12),
      metallic:    0.00,
      roughness:   0.65,
    });

    this.ropeYellow = this._pbr('ropeYellow', scene, {
      albedoColor: new BABYLON.Color3(1.00, 0.82, 0.00),
      metallic:    0.00,
      roughness:   0.65,
    });

    this.flagPole = this._pbr('flagPole', scene, {
      albedoColor:          new BABYLON.Color3(0.22, 0.22, 0.24),
      metallic:             0.55,
      roughness:            0.38,
      environmentIntensity: 0.22, // anodized aluminium pole
    });

    this.flagLine = this._pbr('flagLine', scene, {
      albedoColor: new BABYLON.Color3(0.88, 0.88, 0.85),
      metallic:    0.00,
      roughness:   0.72,
    });

    const pennantDefs: Array<[string, BABYLON.Color3]> = [
      ['pennantRed',    new BABYLON.Color3(1.00, 0.15, 0.15)],
      ['pennantYellow', new BABYLON.Color3(1.00, 0.85, 0.00)],
      ['pennantBlue',   new BABYLON.Color3(0.10, 0.55, 1.00)],
      ['pennantGreen',  new BABYLON.Color3(0.15, 0.75, 0.20)],
    ];
    this.pennant = pennantDefs.map(([name, color]) =>
      this._pbr(name, scene, { albedoColor: color, metallic: 0.00, roughness: 0.65 }),
    );

    // ── Arena architecture ────────────────────────────────────────────────────
    this.arenaWall = this._pbr('arenaWall', scene, {
      albedoColor:  new BABYLON.Color3(0.78, 0.80, 0.82),
      metallic:     0.00,
      roughness:    0.78,
      bumpTexture:  concNorm,
      backFaceCulling: false,
    });

    this.arenaCeiling = this._pbr('arenaCeiling', scene, {
      albedoColor:  new BABYLON.Color3(0.88, 0.90, 0.90),
      metallic:     0.00,
      roughness:    0.82,
      backFaceCulling: false,
    });

    this.column = this._pbr('column', scene, {
      albedoColor:          new BABYLON.Color3(0.70, 0.72, 0.75),
      metallic:             0.15,
      roughness:            0.62,
      environmentIntensity: 0.06, // slightly polished concrete column
    });

    this.bleacher = this._pbr('bleacher', scene, {
      albedoColor: new BABYLON.Color3(0.18, 0.20, 0.24),
      metallic:    0.00,
      roughness:   0.90,
    });

    this.seat = this._pbr('seat', scene, {
      albedoColor: new BABYLON.Color3(0.06, 0.22, 0.58), // Olympic blue
      metallic:    0.00,
      roughness:   0.60,
    });

    // ── Phase 6: structural steel + glazing ───────────────────────────────────
    // arenaSteel: painted structural steel for roof trusses and light rigs.
    // Visible overhead — dark charcoal with slight metallic sheen.
    this.arenaSteel = this._pbr('arenaSteel', scene, {
      albedoColor:          new BABYLON.Color3(0.20, 0.22, 0.24),
      metallic:             0.18,
      roughness:            0.58,
      environmentIntensity: 0.05,
    });

    // arenaGlass: dark tinted glazing for clerestory window bands.
    // Semi-transparent, cool blue-grey — suggests natural light entry.
    this.arenaGlass = this._pbr('arenaGlass', scene, {
      albedoColor:          new BABYLON.Color3(0.18, 0.26, 0.42),
      metallic:             0.0,
      roughness:            0.05,
      backFaceCulling:      false,
    });
    // Transparency applied after construction (PBR supports it)
    this.arenaGlass.alpha            = 0.40;
    this.arenaGlass.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;

    logger.log(`[ArenaMaterialLibrary] Built (quality: ${qualityTier}, bump: ${useBump})`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Theme
  // ─────────────────────────────────────────────────────────────────────────

  public applyTheme(theme: string): void {
    const color = THEME_WATER_COLORS[theme] ?? THEME_WATER_COLORS['OLYMPIC'];
    if (this.poolWall) {
      this.poolWall.albedoColor = color;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Environment probe
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * After ArenaLighting.buildEnvironmentProbe() has captured the scene,
   * call this with the resulting cube texture to activate scene-accurate IBL
   * on all materials that have environmentIntensity > 0.
   */
  public applyEnvironmentTexture(scene: BABYLON.Scene, envTex: BABYLON.BaseTexture): void {
    scene.environmentTexture = envTex;
    logger.log('[ArenaMaterialLibrary] Environment texture applied');
  }

  /**
   * Freeze all PBR materials that will never change after the initial build.
   * Frozen materials skip per-frame uniform re-upload, which saves measurable
   * CPU time with 20+ materials each being checked every frame.
   *
   * Call this AFTER ArenaManager._applyThemeInternal() has set poolWall's
   * albedoColor, so the correct theme colour is baked in before the freeze.
   *
   * Excluded: poolWall — its albedoColor changes when setTheme() is called.
   * All other materials are authored once and never mutated at runtime.
   */
  public freezeStaticMaterials(): void {
    let count = 0;
    for (const mat of this._allMaterials) {
      if (mat.name === 'poolWall') continue;
      mat.freeze();
      count++;
    }
    logger.log(`[ArenaMaterialLibrary] Frozen ${count} static PBR materials`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Procedural textures
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * 128×128 single ceramic pool tile — light blue-white body, grout border,
   * inner bevel highlight.  UV-tiled via uScale/vScale by PoolStructure.
   */
  private _makeTileAlbedoTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
    const S   = 128;
    const tex = new BABYLON.DynamicTexture('poolTileTex', { width: S, height: S }, scene, true);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    ctx.fillStyle = '#c4e0f0';
    ctx.fillRect(0, 0, S, S);

    // Subtle top-left bevel highlight
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(3, 3, S / 2, S / 2);

    // Grout border — 3 px ≈ 2.3 cm at 1 m tile
    const GROUT = 3;
    ctx.fillStyle = '#4a7890';
    ctx.fillRect(0,         0,         S,     GROUT);
    ctx.fillRect(0,         S - GROUT, S,     GROUT);
    ctx.fillRect(0,         0,         GROUT, S);
    ctx.fillRect(S - GROUT, 0,         GROUT, S);

    tex.update();
    return tex;
  }

  /**
   * 128×128 normal map for ceramic tile.
   */
  private _makeTileNormalTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
    const S   = 128;
    const tex = new BABYLON.DynamicTexture('poolTileNorm', { width: S, height: S }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    const imageData = ctx.createImageData(S, S);
    const d = imageData.data;
    const GROUT = 4;

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const idx = (y * S + x) * 4;
        let nx = 128, ny = 128, nz = 255;

        if (x < GROUT)           nx = 128 + Math.round(28 * (1 - x / GROUT));
        if (x >= S - GROUT)      nx = 128 - Math.round(28 * (1 - (S - 1 - x) / GROUT));
        if (y < GROUT)           ny = 128 + Math.round(28 * (1 - y / GROUT));
        if (y >= S - GROUT)      ny = 128 - Math.round(28 * (1 - (S - 1 - y) / GROUT));

        d[idx]     = nx;
        d[idx + 1] = ny;
        d[idx + 2] = nz;
        d[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    tex.update();
    return tex;
  }

  /**
   * 128×128 normal map for concrete surfaces.
   */
  private _makeConcreteNormalTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
    const S   = 128;
    const tex = new BABYLON.DynamicTexture('concreteNorm', { width: S, height: S }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    const imageData = ctx.createImageData(S, S);
    const d = imageData.data;

    const height = (x: number, y: number): number => {
      const fx = x / S * 8;
      const fy = y / S * 8;
      const ix = Math.floor(fx);
      const iy = Math.floor(fy);
      const tx = fx - ix;
      const ty = fy - iy;
      const sx = tx * tx * (3 - 2 * tx);
      const sy = ty * ty * (3 - 2 * ty);
      const h00 = this._hash(ix,     iy);
      const h10 = this._hash(ix + 1, iy);
      const h01 = this._hash(ix,     iy + 1);
      const h11 = this._hash(ix + 1, iy + 1);
      return h00 * (1 - sx) * (1 - sy)
           + h10 *      sx  * (1 - sy)
           + h01 * (1 - sx) *      sy
           + h11 *      sx  *      sy;
    };

    const STEP = 1;
    const STRENGTH = 40;

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const hL = height(x - STEP, y);
        const hR = height(x + STEP, y);
        const hU = height(x, y - STEP);
        const hD = height(x, y + STEP);

        const nx = Math.round(128 + (hL - hR) * STRENGTH);
        const ny = Math.round(128 + (hU - hD) * STRENGTH);
        const nz = 255;

        const idx = (y * S + x) * 4;
        d[idx]     = Math.max(0, Math.min(255, nx));
        d[idx + 1] = Math.max(0, Math.min(255, ny));
        d[idx + 2] = nz;
        d[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    tex.update();
    return tex;
  }

  private _hash(ix: number, iy: number): number {
    const s = Math.sin(ix * 12.9898 + iy * 78.233) * 43758.5453;
    return s - Math.floor(s);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PBR factory helper
  // ─────────────────────────────────────────────────────────────────────────

  private _pbr(
    name:  string,
    scene: BABYLON.Scene,
    opts: {
      albedoColor?:          BABYLON.Color3;
      albedoTexture?:        BABYLON.BaseTexture | null;
      emissiveColor?:        BABYLON.Color3;
      metallic:              number;
      roughness:             number;
      bumpTexture?:          BABYLON.BaseTexture | null;
      backFaceCulling?:      boolean;
      environmentIntensity?: number;
    },
  ): BABYLON.PBRMaterial {
    const mat = new BABYLON.PBRMaterial(name, scene);

    if (opts.albedoColor)   mat.albedoColor   = opts.albedoColor;
    if (opts.albedoTexture) mat.albedoTexture  = opts.albedoTexture;
    if (opts.emissiveColor) mat.emissiveColor  = opts.emissiveColor;
    if (opts.bumpTexture)   mat.bumpTexture    = opts.bumpTexture;

    mat.metallic             = opts.metallic;
    mat.roughness            = opts.roughness;
    mat.environmentIntensity = opts.environmentIntensity ?? 0;

    if (opts.backFaceCulling !== undefined) {
      mat.backFaceCulling = opts.backFaceCulling;
    }

    this._allMaterials.push(mat);
    return mat;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Dispose
  // ─────────────────────────────────────────────────────────────────────────

  public dispose(): void {
    this._allMaterials.forEach(m => m.dispose());
    this._textures.forEach(t => t.dispose());
    this._allMaterials = [];
    this._textures     = [];
    logger.log('[ArenaMaterialLibrary] Disposed');
  }
}
