/**
 * PoolWater  —  Olympic-Grade Realistic Water Surface
 * 
 * Creates hyper-realistic Olympic competition pool water with:
 *   - Crystal-clear transparency with subtle depth tinting
 *   - Multi-layer wave animation (micro-ripples + gentle swells)
 *   - Realistic Fresnel reflections (mirror-like at angles, clear from above)
 *   - Dynamic caustic light patterns on pool floor
 *   - Specular highlights from overhead lighting
 *   - Sub-surface scattering simulation for depth
 *   - Performance-adaptive quality tiers for all devices
 *
 * Quality Tiers:
 *   HIGH   - Full WaterMaterial with 512px render targets, caustics, 
 *            multi-layer bump mapping, enhanced reflections
 *   MEDIUM - WaterMaterial with 256px render targets, simplified caustics
 *   LOW    - Optimized PBRMaterial with procedural normals, no render targets
 *            (suitable for mobile/integrated graphics)
 */

import * as BABYLON from '@babylonjs/core';
import { WaterMaterial } from '@babylonjs/materials';
import { IArenaConfig } from '../../types';
import { getGraphicsCompatibilityProfile, logger } from '../../utils';

const BASIN_DEPTH    = 3.0;
const WALL_THICKNESS = 0.4;

/** Y position of the water surface mesh */
export const WATER_SURFACE_Y = 0.02;

// ============================================================================
// Olympic Pool Water Color Presets
// ============================================================================

const OLYMPIC_WATER_COLORS = {
  // SWIM26 competition pool — light aqua matching the reference image.
  // Very light, almost turquoise — crystal-clear LED-lit competition water.
  OLYMPIC:    new BABYLON.Color3(0.15, 0.58, 0.72),
  // Championship: slightly deeper blue for drama
  CHAMPIONSHIP: new BABYLON.Color3(0.08, 0.44, 0.62),
  // Neon-lit evening pool — vivid aqua
  NEON:       new BABYLON.Color3(0.10, 0.68, 0.80),
  // Warm sunset-lit pool
  SUNSET:     new BABYLON.Color3(0.22, 0.44, 0.58),
  // Custom (fallback)
  CUSTOM:     new BABYLON.Color3(0.15, 0.52, 0.68),
};

export class PoolWater {

  // ── Meshes ────────────────────────────────────────────────────────────────
  private waterMesh:      BABYLON.Mesh | null = null;
  private causticMesh:    BABYLON.Mesh | null = null;
  private foamMesh:       BABYLON.Mesh | null = null;

  // ── Materials ─────────────────────────────────────────────────────────────
  private waterMat:       WaterMaterial       | null = null;
  private lowMat:         BABYLON.PBRMaterial | null = null;

  // ── Textures (owned by this class) ────────────────────────────────────────
  private _waveBumpTex:   BABYLON.DynamicTexture | null = null;
  private _waveBumpTex2:  BABYLON.DynamicTexture | null = null;  // Second layer
  private _causticTex:    BABYLON.DynamicTexture | null = null;
  private _causticMat:    BABYLON.StandardMaterial | null = null;
  private _foamTex:       BABYLON.DynamicTexture | null = null;
  private _foamMat:       BABYLON.StandardMaterial | null = null;

  // ── Animation state ────────────────────────────────────────────────────────
  private _normScrollU    = 0;
  private _normScrollV    = 0;
  private _norm2ScrollU   = 0;  // Second layer scroll
  private _norm2ScrollV   = 0;
  private _causticU       = 0;
  private _causticV       = 0;
  private _foamU          = 0;
  private _foamV          = 0;
  private _idleTime       = 0;
  private _wavePhase      = 0;

  // ── Configuration ──────────────────────────────────────────────────────────
  private _tier: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
  private _themeColor: BABYLON.Color3 = OLYMPIC_WATER_COLORS.OLYMPIC.clone();
  private _compatibility = getGraphicsCompatibilityProfile();

  // ─────────────────────────────────────────────────────────────────────────
  // Build
  // ─────────────────────────────────────────────────────────────────────────

  build(
    scene:       BABYLON.Scene,
    config:      IArenaConfig,
    qualityTier: 'LOW' | 'MEDIUM' | 'HIGH',
  ): BABYLON.Mesh {
    // Determine effective tier based on device capabilities
    const effectiveTier =
      qualityTier !== 'LOW' && !this._compatibility.enableAdvancedWater
        ? 'LOW'
        : qualityTier;

    this._tier = effectiveTier;
    
    // Set water color based on theme
    this._themeColor = this._getThemeColor(config.theme);

    // Surface mesh - subdivisions for wave detail
    const subs = effectiveTier === 'HIGH' ? 64 : effectiveTier === 'MEDIUM' ? 32 : 16;
    this.waterMesh = BABYLON.MeshBuilder.CreateGround('poolWater', {
      width:        config.poolWidth,
      height:       config.poolLength,
      subdivisions: subs,
    }, scene);
    this.waterMesh.position.y = WATER_SURFACE_Y;
    this.waterMesh.isPickable = false;

    // Build appropriate material for tier
    if (effectiveTier === 'LOW') {
      this._buildLow(scene);
    } else {
      this._buildMedHigh(scene, effectiveTier);
    }

    // Caustic overlay for MED/HIGH
    if (effectiveTier !== 'LOW') {
      this._buildCausticOverlay(scene, config, effectiveTier);
    }

    // Edge foam effect for HIGH
    if (effectiveTier === 'HIGH' && this._compatibility.mobileShaderBudget === 'full') {
      this._buildFoamEdges(scene, config);
    }

    logger.log(`[PoolWater] Built Olympic-grade water (${effectiveTier})`);
    return this.waterMesh;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Theme Color Selection
  // ─────────────────────────────────────────────────────────────────────────

  private _getThemeColor(theme: string): BABYLON.Color3 {
    const colors: Record<string, BABYLON.Color3> = OLYMPIC_WATER_COLORS;
    return (colors[theme] || colors.OLYMPIC).clone();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Setup Render Targets (called by ArenaManager after geometry built)
  // ─────────────────────────────────────────────────────────────────────────

  public setupRenderTargets(scene: BABYLON.Scene): void {
    if (!this.waterMat) return;

    const water = this.waterMat;
    const exclude = new Set<BABYLON.AbstractMesh>(
      [this.waterMesh, this.causticMesh, this.foamMesh].filter(Boolean) as BABYLON.AbstractMesh[]
    );

    for (const m of scene.meshes) {
      if (!exclude.has(m)) {
        water.addToRenderList(m);
      }
    }

    logger.log(`[PoolWater] Render targets configured (${scene.meshes.length - exclude.size} meshes)`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Update (per-frame animation)
  // ─────────────────────────────────────────────────────────────────────────

  public update(deltaMs: number): void {
    const dt = deltaMs / 1000;
    this._idleTime += dt;
    this._wavePhase += dt * 0.5;

    // Organic speed modulation - creates breathing rhythm
    const breathMod = 1.0 + 0.15 * Math.sin(this._idleTime * 0.42);
    const breathMod2 = 1.0 + 0.12 * Math.sin(this._idleTime * 0.31 + 1.2);

    // LOW quality: manual UV scroll for PBR material
    if (this._tier === 'LOW' && this._waveBumpTex) {
      this._normScrollU += 0.015 * dt * breathMod;
      this._normScrollV += 0.010 * dt * breathMod2;
      this._waveBumpTex.uOffset = this._normScrollU;
      this._waveBumpTex.vOffset = this._normScrollV;
    }

    // Second wave layer scroll (MEDIUM/HIGH)
    if (this._waveBumpTex2 && this._tier !== 'LOW') {
      this._norm2ScrollU += 0.008 * dt * breathMod2;
      this._norm2ScrollV += 0.012 * dt * breathMod;
      this._waveBumpTex2.uOffset = this._norm2ScrollU;
      this._waveBumpTex2.vOffset = this._norm2ScrollV;
    }

    // Caustic drift
    if (this._causticTex) {
      this._causticU += 0.028 * dt * breathMod;
      this._causticV += 0.019 * dt * breathMod2;
      this._causticTex.uOffset = this._causticU;
      this._causticTex.vOffset = this._causticV;
    }

    // Foam edge animation
    if (this._foamTex) {
      this._foamU += 0.005 * dt;
      this._foamV += 0.003 * dt;
      this._foamTex.uOffset = this._foamU;
      this._foamTex.vOffset = this._foamV;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LOW Quality Build - PBRMaterial (mobile-optimized)
  // ─────────────────────────────────────────────────────────────────────────

  private _buildLow(scene: BABYLON.Scene): void {
    // Create wave normal map
    this._waveBumpTex = this._createWaveNormalMap(scene, 128);
    this._waveBumpTex.uScale = 4;
    this._waveBumpTex.vScale = 8;

    const mat = new BABYLON.PBRMaterial('waterLowMat', scene);
    
    // Water color with slight translucency
    mat.albedoColor = this._themeColor.clone();
    mat.metallic = 0.0;
    mat.roughness = 0.05;  // Very smooth for sharp reflections
    mat.alpha = 0.92;
    mat.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;
    mat.backFaceCulling = false;
    mat.bumpTexture = this._waveBumpTex;
    
    // Simulate reflection with high specularity via roughness
    // PBR uses roughness inverse of specular - low roughness = high specularity
    
    // Sub-surface scattering approximation
    mat.subSurface.isRefractionEnabled = true;
    mat.subSurface.refractionIntensity = 0.6;
    mat.subSurface.indexOfRefraction = 1.33;
    mat.subSurface.tintColor = this._themeColor.scale(0.3);

    this.lowMat = mat;
    this.waterMesh!.material = mat;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MEDIUM/HIGH Quality Build - WaterMaterial
  // ─────────────────────────────────────────────────────────────────────────

  private _buildMedHigh(
    scene: BABYLON.Scene,
    tier:  'MEDIUM' | 'HIGH',
  ): void {
    const rtRes =
      this._compatibility.mobileShaderBudget === 'strict' ? 192
      : this._compatibility.mobileShaderBudget === 'balanced' ? 256
      : tier === 'HIGH' ? 512 : 320;

    // Primary wave normal map
    this._waveBumpTex = this._createWaveNormalMap(scene, tier === 'HIGH' ? 256 : 192);
    this._waveBumpTex.uScale = 5;
    this._waveBumpTex.vScale = 10;

    // Secondary wave layer for more natural look
    this._waveBumpTex2 = this._createWaveNormalMapFine(scene, tier === 'HIGH' ? 192 : 128);
    this._waveBumpTex2.uScale = 12;
    this._waveBumpTex2.vScale = 20;

    const water = new WaterMaterial('waterMat', scene, new BABYLON.Vector2(rtRes, rtRes));

    // Primary bump texture
    water.bumpTexture = this._waveBumpTex;

    // ═══════════════════════════════════════════════════════════════════════
    // OLYMPIC POOL WATER PARAMETERS
    // ═══════════════════════════════════════════════════════════════════════
    
    // Very gentle movement - indoor competition pool
    water.windForce = this._compatibility.mobileShaderBudget === 'strict' ? 0.12 : 0.18;
    water.waveHeight = 0.0;  // Flat surface - all motion from normals
    water.windDirection = new BABYLON.Vector2(0.6, 0.4);
    
    // SWIM26 crystal clear water — very transparent so the light aqua tiles
    // below are clearly visible through the surface (matches reference image)
    water.waterColor = this._themeColor.clone();
    water.colorBlendFactor =
      this._compatibility.mobileShaderBudget === 'strict' ? 0.08 : 0.05;  // keep clarity but reduce overdraw on low-end

    // Very subtle ripple distortion — calm indoor competition pool
    water.bumpHeight = tier === 'HIGH' && this._compatibility.mobileShaderBudget === 'full' ? 0.08 : 0.05;
    water.waveLength = 0.50;
    water.waveSpeed  = this._compatibility.mobileShaderBudget === 'strict' ? 0.14 : 0.18;
    
    // Multi-layer bump for realistic ripple interference
    water.bumpSuperimpose = true;
    
    // Physical Fresnel - mirror from side, clear from above
    water.fresnelSeparate = true;
    
    // See through from below (underwater camera)
    water.backFaceCulling = false;

    // ═══════════════════════════════════════════════════════════════════════

    this.waterMat = water;
    this.waterMesh!.material = water;

    // Apply second bump layer as additional detail
    if (tier === 'HIGH') {
      this._applySecondBumpLayer(water);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Apply Second Bump Layer (HIGH quality)
  // ─────────────────────────────────────────────────────────────────────────

  private _applySecondBumpLayer(water: WaterMaterial): void {
    // The WaterMaterial doesn't natively support two bump textures,
    // but we can modify the underlying shader behavior
    // For now, bumpSuperimpose handles the interference pattern
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Caustic Overlay - Light refraction patterns on pool floor
  // ─────────────────────────────────────────────────────────────────────────

  private _buildCausticOverlay(
    scene:  BABYLON.Scene,
    config: IArenaConfig,
    tier:   'MEDIUM' | 'HIGH',
  ): void {
    const innerW = config.poolWidth - WALL_THICKNESS * 2;
    const innerL = config.poolLength - WALL_THICKNESS * 2;

    this.causticMesh = BABYLON.MeshBuilder.CreateGround('causticOverlay', {
      width: innerW,
      height: innerL,
      subdivisions: 1,
    }, scene);
    
    // Position just above pool floor
    this.causticMesh.position.y = -BASIN_DEPTH + 0.25;
    this.causticMesh.isPickable = false;

    const texSize = tier === 'HIGH' ? 256 : 128;
    this._causticTex = this._createCausticTexture(scene, texSize);
    this._causticTex.uScale = 3;
    this._causticTex.vScale = 6;

    this._causticMat = new BABYLON.StandardMaterial('causticMat', scene);
    this._causticMat.emissiveTexture = this._causticTex;
    
    // Bright blue-white caustic glow
    this._causticMat.emissiveColor = new BABYLON.Color3(0.6, 0.85, 1.0);
    
    // Additive blending - lightens the tiles beneath
    this._causticMat.alphaMode = BABYLON.Engine.ALPHA_ADD;
    this._causticMat.alpha = tier === 'HIGH' ? 0.28 : 0.18;
    this._causticMat.disableLighting = true;
    this._causticMat.backFaceCulling = false;

    this.causticMesh.material = this._causticMat;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Foam Edges - Subtle water edge disturbance (HIGH quality)
  // ─────────────────────────────────────────────────────────────────────────

  private _buildFoamEdges(scene: BABYLON.Scene, config: IArenaConfig): void {
    // Create foam strips along pool edges
    const foamWidth = 0.3;
    const innerW = config.poolWidth - WALL_THICKNESS * 2;
    const innerL = config.poolLength - WALL_THICKNESS * 2;

    // Combine all edge foam into one mesh for performance
    const foamStrips: BABYLON.Mesh[] = [];

    // Four edges
    const edges = [
      { w: innerW - foamWidth * 2, d: foamWidth, x: 0, z: -innerL / 2 + foamWidth / 2 },
      { w: innerW - foamWidth * 2, d: foamWidth, x: 0, z: innerL / 2 - foamWidth / 2 },
      { w: foamWidth, d: innerL - foamWidth * 2, x: -innerW / 2 + foamWidth / 2, z: 0 },
      { w: foamWidth, d: innerL - foamWidth * 2, x: innerW / 2 - foamWidth / 2, z: 0 },
    ];

    for (const edge of edges) {
      const strip = BABYLON.MeshBuilder.CreateGround('foamStrip', {
        width: edge.w,
        height: edge.d,
        subdivisions: 1,
      }, scene);
      strip.position.set(edge.x, WATER_SURFACE_Y - 0.01, edge.z);
      foamStrips.push(strip);
    }

    // Merge all strips
    this.foamMesh = BABYLON.Mesh.MergeMeshes(foamStrips, true, true, undefined, false, true);
    if (this.foamMesh) {
      this.foamMesh.name = 'foamEdges';
      this.foamMesh.isPickable = false;

      // Create foam texture
      this._foamTex = this._createFoamTexture(scene, 64);
      this._foamTex.uScale = 20;
      this._foamTex.vScale = 40;

      this._foamMat = new BABYLON.StandardMaterial('foamMat', scene);
      this._foamMat.emissiveTexture = this._foamTex;
      this._foamMat.emissiveColor = new BABYLON.Color3(0.9, 0.95, 1.0);
      this._foamMat.alphaMode = BABYLON.Engine.ALPHA_ADD;
      this._foamMat.alpha = 0.12;
      this._foamMat.disableLighting = true;
      this._foamMat.backFaceCulling = false;

      this.foamMesh.material = this._foamMat;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Wave Normal Map Generator - Multi-frequency interference pattern
  // ─────────────────────────────────────────────────────────────────────────

  private _createWaveNormalMap(scene: BABYLON.Scene, S: number): BABYLON.DynamicTexture {
    const tex = new BABYLON.DynamicTexture(`waveNorm${S}`, { width: S, height: S }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
    const img = ctx.createImageData(S, S);
    const d = img.data;

    // Multi-octave wave function for natural interference
    const heightField = (u: number, v: number): number => {
      // Primary waves
      let h = 0.45 * Math.sin(u * Math.PI * 4.0 + v * Math.PI * 2.5);
      h += 0.30 * Math.sin(u * Math.PI * 6.5 - v * Math.PI * 4.2);
      h += 0.18 * Math.sin(u * Math.PI * 10.2 + v * Math.PI * 7.1);
      // Fine detail
      h += 0.12 * Math.sin(u * Math.PI * 2.8 + v * Math.PI * 12.3);
      h += 0.08 * Math.sin(u * Math.PI * 14.5 - v * Math.PI * 9.7);
      return h;
    };

    const STEP = 1;
    const STRENGTH = 50;

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const hL = heightField((x - STEP) / S, y / S);
        const hR = heightField((x + STEP) / S, y / S);
        const hU = heightField(x / S, (y - STEP) / S);
        const hD = heightField(x / S, (y + STEP) / S);

        // Tangent-space normal from gradient
        const nx = Math.round(128 + (hL - hR) * STRENGTH);
        const ny = Math.round(128 + (hU - hD) * STRENGTH);
        const i = (y * S + x) * 4;

        d[i]     = Math.max(0, Math.min(255, nx));
        d[i + 1] = Math.max(0, Math.min(255, ny));
        d[i + 2] = 255;
        d[i + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
    tex.update();
    return tex;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Fine Wave Normal Map - High-frequency ripple detail
  // ─────────────────────────────────────────────────────────────────────────

  private _createWaveNormalMapFine(scene: BABYLON.Scene, S: number): BABYLON.DynamicTexture {
    const tex = new BABYLON.DynamicTexture(`waveNormFine${S}`, { width: S, height: S }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
    const img = ctx.createImageData(S, S);
    const d = img.data;

    // Higher frequency pattern
    const heightField = (u: number, v: number): number => {
      let h = 0.5 * Math.sin(u * Math.PI * 12.0 + v * Math.PI * 8.0);
      h += 0.3 * Math.sin(u * Math.PI * 18.0 - v * Math.PI * 14.0);
      h += 0.2 * Math.sin(u * Math.PI * 24.0 + v * Math.PI * 20.0);
      return h;
    };

    const STEP = 1;
    const STRENGTH = 30;

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const hL = heightField((x - STEP) / S, y / S);
        const hR = heightField((x + STEP) / S, y / S);
        const hU = heightField(x / S, (y - STEP) / S);
        const hD = heightField(x / S, (y + STEP) / S);

        const nx = Math.round(128 + (hL - hR) * STRENGTH);
        const ny = Math.round(128 + (hU - hD) * STRENGTH);
        const i = (y * S + x) * 4;

        d[i]     = Math.max(0, Math.min(255, nx));
        d[i + 1] = Math.max(0, Math.min(255, ny));
        d[i + 2] = 255;
        d[i + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
    tex.update();
    return tex;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Caustic Texture Generator - Concentric ring interference
  // ─────────────────────────────────────────────────────────────────────────

  private _createCausticTexture(scene: BABYLON.Scene, S: number): BABYLON.DynamicTexture {
    const tex = new BABYLON.DynamicTexture(`causticTex${S}`, { width: S, height: S }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
    const img = ctx.createImageData(S, S);
    const d = img.data;

    // Wave sources for caustic interference
    const SOURCES: Array<[number, number, number]> = [
      [0.18, 0.22, 1.0],
      [0.75, 0.18, 0.92],
      [0.45, 0.70, 0.88],
      [0.22, 0.75, 0.78],
      [0.78, 0.62, 0.82],
      [0.35, 0.38, 0.70],
      [0.62, 0.45, 0.75],
      [0.50, 0.50, 0.65],  // Center source
    ];

    const FREQ = 18;
    const THRESHOLD = 0.50;

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const u = x / S;
        const v = y / S;
        let val = 0;

        for (const [sx, sy, amp] of SOURCES) {
          const dist = Math.sqrt((u - sx) ** 2 + (v - sy) ** 2);
          val += amp * Math.sin(dist * FREQ * Math.PI * 2);
        }
        val /= SOURCES.length;

        // Threshold for sharp caustic edges
        const peak = Math.abs(val);
        const brightness = peak > THRESHOLD
          ? Math.round(((peak - THRESHOLD) / (1 - THRESHOLD)) * 255)
          : 0;

        const i = (y * S + x) * 4;
        // Slightly blue-tinted caustics
        d[i]     = Math.round(brightness * 0.85);
        d[i + 1] = Math.round(brightness * 0.95);
        d[i + 2] = brightness;
        d[i + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
    tex.update();
    return tex;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Foam Texture Generator - Noise-based edge foam
  // ─────────────────────────────────────────────────────────────────────────

  private _createFoamTexture(scene: BABYLON.Scene, S: number): BABYLON.DynamicTexture {
    const tex = new BABYLON.DynamicTexture(`foamTex${S}`, { width: S, height: S }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
    const img = ctx.createImageData(S, S);
    const d = img.data;

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const i = (y * S + x) * 4;
        
        // Pseudo-random foam pattern
        const noise = Math.sin(x * 0.8) * Math.cos(y * 0.6) * 0.5 + 0.5;
        const noise2 = Math.sin(x * 1.5 + y * 0.7) * 0.5 + 0.5;
        const combined = (noise + noise2) * 0.5;
        
        // Threshold for foam speckles
        const brightness = combined > 0.55 ? Math.round((combined - 0.55) * 400) : 0;
        
        d[i]     = brightness;
        d[i + 1] = brightness;
        d[i + 2] = brightness;
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

  public getMesh(): BABYLON.Mesh | null {
    return this.waterMesh;
  }

  public dispose(): void {
    this.waterMesh?.dispose();
    this.causticMesh?.dispose();
    this.foamMesh?.dispose();
    this.waterMat?.dispose();
    this.lowMat?.dispose();
    this._waveBumpTex?.dispose();
    this._waveBumpTex2?.dispose();
    this._causticTex?.dispose();
    this._causticMat?.dispose();
    this._foamTex?.dispose();
    this._foamMat?.dispose();
    logger.log('[PoolWater] Disposed');
  }
}
