/**
 * ArenaMaterialLibrary  —  Phase 6 update
 * Added arenaSteel and arenaGlass materials for Phase 6 architectural additions.
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig } from '../../types';
import { getGraphicsCompatibilityProfile, logger } from '../../utils';

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
  public arenaWallLower!: BABYLON.PBRMaterial; // Dark wainscoting band
  public arenaStripe!:  BABYLON.PBRMaterial;   // Olympic blue accent stripe
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
  private _compatibility = getGraphicsCompatibilityProfile();

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
    // SWIM26-style pool: light aqua/cyan ceramic tiles matching the reference
    // image — bright crystal-clear tiles under LED floodlights, very smooth
    // glazed surface with tight grout lines creating the grid pattern.
    this.poolFloor = this._pbr('poolFloor', scene, {
      albedoTexture:        tileTex,
      albedoColor:          new BABYLON.Color3(0.78, 0.94, 0.99),  // light aqua tile tint
      metallic:             0.00,
      roughness:            0.05,   // Very smooth glazed ceramic — near-mirror reflections
      bumpTexture:          tileNorm,
      environmentIntensity: 0.20,  // Glazed tile: strong gloss from overhead LED floodlights
    });
    // uScale / vScale are applied by PoolStructure on the texture itself

    this.poolWall = this._pbr('poolWall', scene, {
      albedoColor:          new BABYLON.Color3(0.68, 0.90, 0.97),  // light cyan wall tile
      metallic:             0.00,
      roughness:            0.12,
      environmentIntensity: 0.10, // wet submerged tiles — visible sheen
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

    // ── Lane ropes — SWIM26 pool colour scheme ────────────────────────────────
    // ropeGreen slot is repurposed as the outer-lane BLUE rope (matches image)
    this.ropeGreen = this._pbr('ropeBlue', scene, {
      albedoColor: new BABYLON.Color3(0.08, 0.38, 0.92),  // bright competition blue
      metallic:    0.00,
      roughness:   0.58,
    });

    this.ropeRed = this._pbr('ropeRed', scene, {
      albedoColor: new BABYLON.Color3(0.92, 0.10, 0.10),  // vibrant competition red
      metallic:    0.00,
      roughness:   0.58,
    });

    this.ropeYellow = this._pbr('ropeYellow', scene, {
      albedoColor: new BABYLON.Color3(1.00, 0.84, 0.00),  // bright competition yellow
      metallic:    0.00,
      roughness:   0.58,
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
    // Create realistic painted wall texture
    const wallPaintTex  = this._makePaintedWallTexture(scene);
    const wallPaintNorm = useBump ? this._makePaintedWallNormal(scene) : null;
    if (wallPaintNorm) this._textures.push(wallPaintNorm);
    this._textures.push(wallPaintTex);

    this.arenaWall = this._pbr('arenaWall', scene, {
      albedoTexture:  wallPaintTex,
      albedoColor:    new BABYLON.Color3(0.92, 0.94, 0.96),
      metallic:       0.00,
      roughness:      0.72,
      bumpTexture:    wallPaintNorm,
      backFaceCulling: false,
    });

    // Lower wall wainscoting material (darker accent band)
    this.arenaWallLower = this._pbr('arenaWallLower', scene, {
      albedoColor:    new BABYLON.Color3(0.18, 0.22, 0.28),
      metallic:       0.02,
      roughness:      0.65,
      bumpTexture:    concNorm,
      backFaceCulling: false,
    });

    // Accent stripe material (Olympic blue band)
    this.arenaStripe = this._pbr('arenaStripe', scene, {
      albedoColor:    new BABYLON.Color3(0.02, 0.35, 0.65),
      metallic:       0.00,
      roughness:      0.55,
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
   * 256×256 Olympic-style pool tile — pristine white ceramic with subtle blue tint,
   * thin dark grout lines, realistic depth variation for light refraction.
   * UV-tiled via uScale/vScale by PoolStructure.
   */
  private _makeTileAlbedoTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
    const S   = 256;
    const tex = new BABYLON.DynamicTexture('poolTileTex', { width: S, height: S }, scene, true);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    // Olympic pool tile base - slightly cool white
    ctx.fillStyle = '#f0f4f8';
    ctx.fillRect(0, 0, S, S);

    // Subtle blue tint gradient (simulates pool water influence)
    const gradient = ctx.createLinearGradient(0, 0, S, S);
    gradient.addColorStop(0, 'rgba(200, 220, 240, 0.08)');
    gradient.addColorStop(0.5, 'rgba(180, 210, 235, 0.05)');
    gradient.addColorStop(1, 'rgba(200, 220, 240, 0.08)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, S, S);

    // Subtle top-left corner highlight (tile surface bevel)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(S * 0.3, 0);
    ctx.lineTo(0, S * 0.3);
    ctx.closePath();
    ctx.fill();

    // Thin dark grout lines (2px ≈ 1.5 cm at 1m tile - Olympic standard)
    const GROUT = 2;
    ctx.fillStyle = '#1a3a4a';  // Dark blue-grey grout
    ctx.fillRect(0, 0, S, GROUT);
    ctx.fillRect(0, S - GROUT, S, GROUT);
    ctx.fillRect(0, 0, GROUT, S);
    ctx.fillRect(S - GROUT, 0, GROUT, S);

    // Inner grout shadow for depth
    ctx.fillStyle = 'rgba(10, 30, 50, 0.3)';
    ctx.fillRect(GROUT, GROUT, S - GROUT * 2, 1);
    ctx.fillRect(GROUT, GROUT, 1, S - GROUT * 2);

    // Subtle surface variation for realism
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * S;
      const y = Math.random() * S;
      const r = Math.random() * 3 + 1;
      const alpha = Math.random() * 0.03 + 0.01;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    tex.update();
    return tex;
  }

  /**
   * 256×256 normal map for Olympic ceramic tile - subtle depth and surface detail.
   */
  private _makeTileNormalTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
    const S   = 256;
    const tex = new BABYLON.DynamicTexture('poolTileNorm', { width: S, height: S }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    const imageData = ctx.createImageData(S, S);
    const d = imageData.data;
    const GROUT = 3;

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const idx = (y * S + x) * 4;
        let nx = 128, ny = 128, nz = 255;

        // Grout edges - beveled normal direction
        if (x < GROUT) {
          const t = x / GROUT;
          nx = 128 + Math.round(35 * (1 - t) * (1 - t));
        }
        if (x >= S - GROUT) {
          const t = (S - 1 - x) / GROUT;
          nx = 128 - Math.round(35 * (1 - t) * (1 - t));
        }
        if (y < GROUT) {
          const t = y / GROUT;
          ny = 128 + Math.round(35 * (1 - t) * (1 - t));
        }
        if (y >= S - GROUT) {
          const t = (S - 1 - y) / GROUT;
          ny = 128 - Math.round(35 * (1 - t) * (1 - t));
        }

        // Subtle surface micro-variation
        const micro = Math.sin(x * 0.3) * Math.cos(y * 0.3) * 2;
        nx = Math.max(0, Math.min(255, nx + Math.round(micro)));
        ny = Math.max(0, Math.min(255, ny + Math.round(micro * 0.5)));

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
  // Painted Wall Texture Generator
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Creates a realistic painted indoor wall texture with subtle variations,
   * brush marks, and slight imperfections that make it look like a real
   * painted venue surface rather than a flat color.
   */
  private _makePaintedWallTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
    const S = 256;
    const tex = new BABYLON.DynamicTexture('wallPaintTex', { width: S, height: S }, scene, true);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    // Base off-white paint color (like a real indoor sports venue)
    ctx.fillStyle = '#e8ecf0';
    ctx.fillRect(0, 0, S, S);

    // Add subtle color variation (roller marks, slight unevenness)
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * S;
      const y = Math.random() * S;
      const w = Math.random() * 60 + 20;
      const h = Math.random() * 8 + 2;
      const alpha = Math.random() * 0.03 + 0.01;
      
      // Slightly lighter or darker bands (roller strokes)
      const lighter = Math.random() > 0.5;
      ctx.fillStyle = lighter 
        ? `rgba(255, 255, 255, ${alpha})`
        : `rgba(200, 210, 220, ${alpha})`;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * 0.1 - 0.05);
      ctx.fillRect(-w/2, -h/2, w, h);
      ctx.restore();
    }

    // Add very subtle speckles (paint pigment texture)
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * S;
      const y = Math.random() * S;
      const r = Math.random() * 1.5 + 0.5;
      const alpha = Math.random() * 0.04 + 0.01;
      
      ctx.fillStyle = `rgba(180, 195, 210, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Subtle vertical shadow lines (wall panel seams)
    ctx.strokeStyle = 'rgba(160, 175, 190, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < S; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, S);
      ctx.stroke();
    }

    tex.update();
    return tex;
  }

  /**
   * Normal map for painted wall - subtle surface bumps and imperfections
   */
  private _makePaintedWallNormal(scene: BABYLON.Scene): BABYLON.DynamicTexture {
    const S = 128;
    const tex = new BABYLON.DynamicTexture('wallPaintNorm', { width: S, height: S }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
    const imageData = ctx.createImageData(S, S);
    const d = imageData.data;

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const idx = (y * S + x) * 4;
        
        // Base flat normal
        let nx = 128;
        let ny = 128;
        
        // Add subtle noise for paint texture
        const noise = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 3;
        nx += noise;
        ny += noise * 0.7;
        
        // Panel seam indentations
        if (x < 2 || x > S - 3) {
          const t = x < 2 ? x / 2 : (S - x) / 3;
          nx -= 15 * (1 - t);
        }
        
        d[idx]     = Math.max(0, Math.min(255, Math.round(nx)));
        d[idx + 1] = Math.max(0, Math.min(255, Math.round(ny)));
        d[idx + 2] = 255;
        d[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    tex.update();
    return tex;
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
    mat.maxSimultaneousLights = this._compatibility.maxPbrLights;

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
