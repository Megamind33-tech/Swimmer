/**
 * PoolWater  —  Phase 4
 * Competition-grade animated water surface.
 *
 * Problem with Phase 3:
 *   - Flat PBRMaterial, alpha=0.82, but environmentIntensity=0 → zero reflections
 *   - No bumpTexture → perfectly smooth, looks like glass not water
 *   - update() was a no-op → completely static
 *   - No distortion of underwater tiles → fake see-through effect
 *   - No caustic lighting on pool floor
 *
 * Phase 4 solution by quality tier:
 *
 *   HIGH   — Babylon WaterMaterial with 512×512 reflection + refraction render
 *             targets. Procedural wave normal map (multi-octave sin field).
 *             Caustic overlay mesh on pool floor (additive emissive, UV-scrolled).
 *             Fresnel-correct mixing (reflective at glancing angles, transparent
 *             when looking straight down).
 *
 *   MEDIUM — WaterMaterial with 256×256 render targets. Both reflection and
 *             refraction active but at half resolution. No caustics.
 *             bumpHeight reduced for slightly smoother appearance.
 *
 *   LOW    — PBRMaterial with procedural wave normal map manually UV-scrolled
 *             in update(). No render targets — zero extra render passes.
 *             Suitable for mobile devices.
 *
 * ArenaManager must call setupRenderTargets(scene) AFTER all other geometry
 * modules have completed their build() calls. This populates the WaterMaterial
 * reflection and refraction render lists with the full scene.
 *
 * Competition pool characteristics encoded here:
 *   - No ocean swell — waveHeight=0, very low windForce
 *   - Small ripples — waveLength=0.5, bumpHeight ≤ 0.12
 *   - Slow drift — waveSpeed=0.25, windDirection diagonal
 *   - Highly transparent — colorBlendFactor=0.12 (mostly see-through to tiles)
 *   - Fresnel: reflective from side cameras, transparent from top camera
 */

import * as BABYLON from '@babylonjs/core';
import { WaterMaterial } from '@babylonjs/materials';
import { IArenaConfig } from '../../types';
import { logger } from '../../utils';

const BASIN_DEPTH    = 3.0;   // m  (matches PoolStructure.BASIN_DEPTH)
const WALL_THICKNESS = 0.4;   // m  (matches PoolStructure.WALL_THICKNESS)

/** Y position of the water surface mesh — shared with UnderwaterEffects. */
export const WATER_SURFACE_Y = 0.02;

export class PoolWater {

  // ── Meshes ────────────────────────────────────────────────────────────────
  private waterMesh:   BABYLON.Mesh | null = null;
  private causticMesh: BABYLON.Mesh | null = null;

  // ── Materials — HIGH/MEDIUM use WaterMaterial, LOW uses PBRMaterial ───────
  private waterMat: WaterMaterial          | null = null;
  private lowMat:   BABYLON.PBRMaterial    | null = null;

  // ── Owned textures (disposed by this class) ───────────────────────────────
  private _waveBumpTex:  BABYLON.DynamicTexture | null = null;
  private _causticTex:   BABYLON.DynamicTexture | null = null;
  private _causticMat:   BABYLON.StandardMaterial | null = null;

  // ── Animation accumulators ────────────────────────────────────────────────
  private _normScrollU = 0; // LOW quality: manual UV scroll of wave normal map
  private _normScrollV = 0;
  private _causticU    = 0; // caustic overlay UV drift
  private _causticV    = 0;
  private _idleTime    = 0; // accumulator for sinusoidal idle speed modulation

  // ── State ─────────────────────────────────────────────────────────────────
  private _tier: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
  private _themeColor = new BABYLON.Color3(0.0, 0.40, 0.80); // OLYMPIC default

  // ─────────────────────────────────────────────────────────────────────────
  // Build
  // ─────────────────────────────────────────────────────────────────────────

  build(
    scene:       BABYLON.Scene,
    config:      IArenaConfig,
    qualityTier: 'LOW' | 'MEDIUM' | 'HIGH',
  ): BABYLON.Mesh {
    this._tier = qualityTier;

    // Surface mesh — subdivisions give WaterMaterial vertex geometry to work with
    const subs = qualityTier === 'HIGH' ? 48 : qualityTier === 'MEDIUM' ? 24 : 12;
    this.waterMesh = BABYLON.MeshBuilder.CreateGround('poolWater', {
      width:        config.poolWidth,
      height:       config.poolLength,
      subdivisions: subs,
    }, scene);
    // Sit 2 cm above the pool wall top to avoid z-fighting with coping
    this.waterMesh.position.y = 0.02;
    this.waterMesh.isPickable = false;

    if (qualityTier === 'LOW') {
      this._buildLow(scene);
    } else {
      this._buildMedHigh(scene, qualityTier);
    }

    // Caustic overlay: MED/HIGH — visible pool-floor light refraction pattern.
    // MEDIUM uses reduced alpha for performance; HIGH uses full brightness.
    if (qualityTier !== 'LOW') {
      this._buildCausticOverlay(scene, config, qualityTier);
    }

    logger.log(`[PoolWater] Built Phase 4 (${qualityTier})`);
    return this.waterMesh;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // setupRenderTargets — called by ArenaManager after all scene geometry is built
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Populates the WaterMaterial reflection and refraction render lists.
   * Must be called after all arena geometry modules complete build().
   * No-op on LOW quality (no WaterMaterial render targets).
   */
  public setupRenderTargets(scene: BABYLON.Scene): void {
    if (!this.waterMat) return;

    const water = this.waterMat;

    // Exclude the water surface itself from its own render targets
    const exclude = new Set<BABYLON.AbstractMesh>(
      [this.waterMesh].filter(Boolean) as BABYLON.AbstractMesh[],
    );

    // Every other mesh participates in both reflection and refraction.
    // Adding to both lets the refraction show tiles/lanes and the
    // reflection show the ceiling / bleachers / arena structure.
    for (const m of scene.meshes) {
      if (!exclude.has(m)) {
        water.addToRenderList(m);
      }
    }

    logger.log(`[PoolWater] Render targets populated (${scene.meshes.length - exclude.size} meshes)`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Update (called every render frame by ArenaManager)
  // ─────────────────────────────────────────────────────────────────────────

  public update(deltaMs: number): void {
    const dt = deltaMs / 1000; // convert to seconds
    this._idleTime += dt;

    // Sinusoidal speed modulator — creates a gentle "breathing" rhythm to the
    // water's idle animation without requiring race state awareness here.
    const idleModU = 1.0 + 0.28 * Math.sin(this._idleTime * 0.38);
    const idleModV = 1.0 + 0.22 * Math.sin(this._idleTime * 0.29 + 1.4);

    // LOW quality: manually scroll normal map UV since PBRMaterial has no
    // built-in wave animation.  WaterMaterial does this internally for MED/HIGH.
    if (this._tier === 'LOW' && this._waveBumpTex) {
      this._normScrollU += 0.012 * dt * idleModU;
      this._normScrollV += 0.008 * dt * idleModV;
      this._waveBumpTex.uOffset = this._normScrollU;
      this._waveBumpTex.vOffset = this._normScrollV;
    }

    // Caustic UV drift — two independent sine-modulated axes break up regularity
    if (this._causticTex) {
      this._causticU += 0.034 * dt * idleModU;
      this._causticV += 0.021 * dt * idleModV;
      this._causticTex.uOffset = this._causticU;
      this._causticTex.vOffset = this._causticV;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Quality-tier build helpers
  // ─────────────────────────────────────────────────────────────────────────

  /** LOW: PBRMaterial with scrolling wave normal map — zero extra render passes. */
  private _buildLow(scene: BABYLON.Scene): void {
    this._waveBumpTex = this._makeWaveNormalMap(scene, 128);
    this._waveBumpTex.uScale = 5;
    this._waveBumpTex.vScale = 10;

    const mat                    = new BABYLON.PBRMaterial('waterLowMat', scene);
    mat.albedoColor              = this._themeColor.clone();
    mat.metallic                 = 0.0;
    mat.roughness                = 0.06;   // near-mirror: specular highlights from flood lights
    mat.alpha                    = 0.88;
    mat.transparencyMode         = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;
    mat.backFaceCulling          = false;  // visible from underwater camera
    mat.bumpTexture              = this._waveBumpTex;
    mat.environmentIntensity     = 0;      // no HDR env texture

    this.lowMat              = mat;
    this.waterMesh!.material = mat;
  }

  /**
   * MEDIUM/HIGH: Babylon WaterMaterial.
   * Creates planar reflection (MirrorTexture) and refraction (RenderTargetTexture).
   * waveHeight=0 keeps the geometry flat — all motion comes from normal map animation.
   */
  private _buildMedHigh(
    scene: BABYLON.Scene,
    tier:  'MEDIUM' | 'HIGH',
  ): void {
    const rtRes               = tier === 'HIGH' ? 512 : 256;
    this._waveBumpTex         = this._makeWaveNormalMap(scene, 256);
    this._waveBumpTex.uScale  = 5;
    this._waveBumpTex.vScale  = 10;

    const water = new WaterMaterial('waterMat', scene,
      new BABYLON.Vector2(rtRes, rtRes));

    water.bumpTexture      = this._waveBumpTex;

    // ── Competition pool settings ──────────────────────────────────────
    // Indoor natatorium — almost no surface disturbance except lane turbulence.
    water.windForce        = 0.28;         // very gentle (no outdoor wind)
    water.waveHeight       = 0.0;          // no vertex displacement — pool is flat
    water.windDirection    = new BABYLON.Vector2(0.5, 0.5); // diagonal drift
    water.waterColor       = this._themeColor.clone();
    water.colorBlendFactor = 0.12;         // 88% see-through to tiles, 12% water tint
    water.bumpHeight       = tier === 'HIGH' ? 0.12 : 0.08; // subtle ripple distortion
    water.waveLength       = 0.50;         // small ripples, not ocean swells
    water.waveSpeed        = 0.25;         // slow — indoor pool is calm

    // Two-layer bump: second offset pass breaks up the regular grid pattern
    // and creates the irregular inter-lapping ripple typical of pool water
    water.bumpSuperimpose  = true;

    // Physically correct Fresnel: near-mirror from side cameras, transparent
    // from top-down race camera — accurate for competition pool
    water.fresnelSeparate  = true;

    water.backFaceCulling  = false;        // underwater camera views underside

    this.waterMat            = water;
    this.waterMesh!.material = water;
  }

  /**
   * Caustic light overlay on pool floor.
   * A flat mesh above the floor with an additive emissive caustic DynamicTexture.
   * UV-scrolled each frame in update() to simulate refracted light movement.
   * Only built for HIGH quality tier.
   */
  /**
   * Pool-floor caustic overlay.  MEDIUM uses smaller texture + reduced alpha.
   * HIGH uses full 256px texture + higher alpha for more visible light refraction.
   */
  private _buildCausticOverlay(
    scene:  BABYLON.Scene,
    config: IArenaConfig,
    tier:   'MEDIUM' | 'HIGH' = 'HIGH',
  ): void {
    const innerW = config.poolWidth  - WALL_THICKNESS * 2;
    const innerL = config.poolLength - WALL_THICKNESS * 2;

    this.causticMesh = BABYLON.MeshBuilder.CreateGround('causticOverlay', {
      width: innerW, height: innerL, subdivisions: 1,
    }, scene);
    // Just above pool floor surface — inside the water column
    this.causticMesh.position.y = -BASIN_DEPTH + 0.28;
    this.causticMesh.isPickable = false;

    const texSize = tier === 'HIGH' ? 256 : 128;
    this._causticTex         = this._makeCausticTexture(scene, texSize);
    this._causticTex.uScale  = 2.5;  // repeat pattern several times across pool length
    this._causticTex.vScale  = 5.0;

    this._causticMat = new BABYLON.StandardMaterial('causticMat', scene);
    this._causticMat.emissiveTexture = this._causticTex;
    this._causticMat.emissiveColor   = new BABYLON.Color3(0.48, 0.76, 1.0); // cool pool-blue
    // Additive blending: caustic rings add luminance onto tile texture below
    this._causticMat.alphaMode       = BABYLON.Engine.ALPHA_ADD;
    this._causticMat.alpha           = tier === 'HIGH' ? 0.22 : 0.10;
    this._causticMat.disableLighting = true;  // emissive-only — not affected by lights
    this._causticMat.backFaceCulling = false;

    this.causticMesh.material = this._causticMat;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Procedural texture generators
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Wave normal map — multi-octave sin-field height function → finite-difference
   * normals encoded as RGB.
   *
   * Four overlapping sine waves at different frequencies and orientations create
   * a natural-looking ripple pattern that tiles without obvious seaming at the
   * low bumpHeight values used for pool water.
   *
   * Used by:
   *   WaterMaterial.bumpTexture  — animated internally by WaterMaterial UV scroll
   *   PBRMaterial.bumpTexture    — UV-scrolled manually in update() (LOW tier)
   */
  private _makeWaveNormalMap(scene: BABYLON.Scene, S: number): BABYLON.DynamicTexture {
    const tex = new BABYLON.DynamicTexture(`waveNorm${S}`, { width: S, height: S }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
    const img = ctx.createImageData(S, S);
    const d   = img.data;

    // Height field: superposition of 4 sine waves at different frequencies
    // and orientations — produces a natural cross-hatched ripple pattern
    const hf = (u: number, v: number): number =>
      0.50 * Math.sin(u * Math.PI * 4.0 + v * Math.PI * 2.3)
    + 0.25 * Math.sin(u * Math.PI * 7.1 - v * Math.PI * 5.2)
    + 0.15 * Math.sin(u * Math.PI * 11.3 + v * Math.PI * 7.8)
    + 0.10 * Math.sin(u * Math.PI * 2.9  + v * Math.PI * 13.1);

    const STEP     = 1;
    const STRENGTH = 60; // gradient scale — lower = flatter normals (more subtle ripple)

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const hL = hf((x - STEP) / S, y / S);
        const hR = hf((x + STEP) / S, y / S);
        const hU = hf(x / S, (y - STEP) / S);
        const hD = hf(x / S, (y + STEP) / S);

        // Tangent-space normal from finite-difference gradient
        const nx = Math.round(128 + (hL - hR) * STRENGTH);
        const ny = Math.round(128 + (hU - hD) * STRENGTH);
        const i  = (y * S + x) * 4;

        d[i]     = Math.max(0, Math.min(255, nx)); // R → tangent X
        d[i + 1] = Math.max(0, Math.min(255, ny)); // G → tangent Y
        d[i + 2] = 255;                             // B → normal Z (always up)
        d[i + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
    tex.update();
    return tex;
  }

  /**
   * Caustic pattern: multiple circular wave sources create bright concentric
   * rings that interfere.  Where peaks from different sources overlap, the
   * intensity is high (bright caustic spot).  Between peaks: dark.
   *
   * 7 sources spread across the texture create a realistic non-uniform distribution.
   * UV scrolled in update() to give the illusion of moving refracted light.
   */
  private _makeCausticTexture(scene: BABYLON.Scene, S: number): BABYLON.DynamicTexture {
    const tex = new BABYLON.DynamicTexture(`causticTex${S}`, { width: S, height: S }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
    const img = ctx.createImageData(S, S);
    const d   = img.data;

    // [cx, cy, amplitude] — positions in normalised [0,1] texture space
    const SOURCES: Array<[number, number, number]> = [
      [0.22, 0.28, 1.00],
      [0.72, 0.22, 0.90],
      [0.48, 0.68, 0.85],
      [0.18, 0.72, 0.75],
      [0.82, 0.65, 0.80],
      [0.38, 0.42, 0.65],
      [0.65, 0.48, 0.70],
    ];
    const FREQ      = 16;   // ring frequency — more rings = smaller caustic cells
    const THRESHOLD = 0.55; // only render peaks, not the full wave — keeps it sparse

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const u = x / S;
        const v = y / S;
        let val = 0;

        for (const [sx, sy, amp] of SOURCES) {
          const dist = Math.sqrt((u - sx) ** 2 + (v - sy) ** 2);
          val       += amp * Math.sin(dist * FREQ * Math.PI * 2);
        }
        val /= SOURCES.length; // normalise to approximately [-1, 1]

        // Threshold: only bright peaks become visible caustic spots
        const peak       = Math.abs(val);
        const brightness = peak > THRESHOLD
          ? Math.round(((peak - THRESHOLD) / (1 - THRESHOLD)) * 255)
          : 0;

        const i = (y * S + x) * 4;
        d[i] = d[i + 1] = d[i + 2] = brightness;
        d[i + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
    tex.update();
    return tex;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────────

  public setColor(color: BABYLON.Color3): void {
    this._themeColor = color.clone();
    if (this.waterMat) {
      this.waterMat.waterColor = color.clone();
    } else if (this.lowMat) {
      this.lowMat.albedoColor = color;
    }
  }

  public getMesh(): BABYLON.Mesh | null { return this.waterMesh; }

  public dispose(): void {
    this.waterMesh?.dispose();
    this.causticMesh?.dispose();
    this.waterMat?.dispose();
    this.lowMat?.dispose();
    this._waveBumpTex?.dispose();
    this._causticTex?.dispose();
    this._causticMat?.dispose();
    logger.log('[PoolWater] Disposed');
  }
}
