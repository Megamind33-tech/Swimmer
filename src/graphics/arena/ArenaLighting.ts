/**
 * ArenaLighting
 * All lights, shadows, and time-of-day adjustments for the competition arena.
 *
 * AUDIT ISSUES FIXED HERE:
 *   - Old code had only 1 HemisphericLight + 1 PointLight — flat, shadowless.
 *   - scene.shadowsEnabled was set to true but no ShadowGenerator existed,
 *     so the flag did nothing.
 *   - Time-of-day only changed the hemispheric light's specular (not diffuse),
 *     making the effect nearly invisible.
 *   - No flood lights → pool had uniform brightness with no stadium drama.
 *
 * New lighting rig:
 *   1. HemisphericLight  — soft ambient fill
 *   2. DirectionalLight  — key light from above (+ shadow generator)
 *   3. 4× SpotLight      — overhead arena floods (disabled on LOW quality)
 *
 * Phase 2 will add:
 *   - Caustic light projector (animated caustic texture on pool floor)
 *   - IES spotlight profiles for realistic stadium fixture falloff
 *   - Per-swimmer point light to enhance swimmer visibility
 *   - Dynamic shadow map resolution scaling with quality preset
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig, TimeOfDay } from '../../types';
import { logger } from '../../utils';

interface TimeConfig {
  ambientDiffuse:   BABYLON.Color3;
  ambientGround:    BABYLON.Color3;
  ambientIntensity: number;
  keyColor:         BABYLON.Color3;
  keyIntensity:     number;
}

const TIME_CONFIGS: Record<TimeOfDay, TimeConfig> = {
  MORNING: {
    ambientDiffuse:   new BABYLON.Color3(1.00, 0.93, 0.80),
    ambientGround:    new BABYLON.Color3(0.40, 0.50, 0.60),
    ambientIntensity: 0.75,
    keyColor:         new BABYLON.Color3(0.60, 0.70, 1.00),
    keyIntensity:     0.45,
  },
  AFTERNOON: {
    ambientDiffuse:   new BABYLON.Color3(1.00, 1.00, 1.00),
    ambientGround:    new BABYLON.Color3(0.50, 0.55, 0.60),
    ambientIntensity: 1.00,
    keyColor:         new BABYLON.Color3(0.95, 0.98, 1.00),
    keyIntensity:     0.60,
  },
  EVENING: {
    ambientDiffuse:   new BABYLON.Color3(1.00, 0.55, 0.28),
    ambientGround:    new BABYLON.Color3(0.30, 0.20, 0.40),
    ambientIntensity: 0.60,
    keyColor:         new BABYLON.Color3(0.40, 0.30, 0.70),
    keyIntensity:     0.30,
  },
  NIGHT: {
    ambientDiffuse:   new BABYLON.Color3(0.18, 0.20, 0.45),
    ambientGround:    new BABYLON.Color3(0.08, 0.10, 0.18),
    ambientIntensity: 0.25,
    keyColor:         new BABYLON.Color3(0.25, 0.35, 0.65),
    keyIntensity:     0.20,
  },
};

export class ArenaLighting {
  private hemiLight:       BABYLON.HemisphericLight | null = null;
  private keyLight:        BABYLON.DirectionalLight | null = null;
  private floodLights:     BABYLON.SpotLight[] = [];
  private shadowGenerator: BABYLON.ShadowGenerator | null = null;

  private allLights: BABYLON.Light[] = [];

  build(
    scene:        BABYLON.Scene,
    config:       IArenaConfig,
    qualityTier:  'LOW' | 'MEDIUM' | 'HIGH',
  ): void {
    const { poolLength: L, poolWidth: W, arenaHeight: AH } = config;

    // 1. Hemispheric ambient ─────────────────────────────────────────────
    this.hemiLight = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);
    this.hemiLight.specular = new BABYLON.Color3(0.8, 0.8, 0.8);
    this.allLights.push(this.hemiLight);

    // 2. Directional key light ───────────────────────────────────────────
    this.keyLight = new BABYLON.DirectionalLight(
      'keyLight',
      new BABYLON.Vector3(-0.3, -1.0, -0.4),
      scene,
    );
    this.keyLight.position = new BABYLON.Vector3(0, AH - 2, 0);
    this.allLights.push(this.keyLight);

    // 3. Overhead flood spots (medium/high only) ─────────────────────────
    if (qualityTier !== 'LOW') {
      const floodPositions = [
        new BABYLON.Vector3(-W / 3, AH - 4, -L / 4),
        new BABYLON.Vector3( W / 3, AH - 4, -L / 4),
        new BABYLON.Vector3(-W / 3, AH - 4,  L / 4),
        new BABYLON.Vector3( W / 3, AH - 4,  L / 4),
      ];
      for (let fi = 0; fi < floodPositions.length; fi++) {
        const spot = new BABYLON.SpotLight(
          `flood${fi}`,
          floodPositions[fi],
          new BABYLON.Vector3(0, -1, 0),
          Math.PI / 2.2,
          1.4,
          scene,
        );
        spot.intensity = 0.32;
        spot.diffuse   = new BABYLON.Color3(1.0, 0.97, 0.92);
        spot.specular  = new BABYLON.Color3(1.0, 1.00, 0.92);
        this.floodLights.push(spot);
        this.allLights.push(spot);
      }
    }

    // 4. Shadow generator on key light ───────────────────────────────────
    if (qualityTier === 'HIGH') {
      this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.keyLight);
      this.shadowGenerator.useBlurExponentialShadowMap = true;
      this.shadowGenerator.blurKernel = 16;
    } else if (qualityTier === 'MEDIUM') {
      this.shadowGenerator = new BABYLON.ShadowGenerator(512, this.keyLight);
      this.shadowGenerator.useExponentialShadowMap = true;
    }

    this.applyTimeOfDay(config.timeOfDay);
    logger.log(`[ArenaLighting] Built (quality=${qualityTier})`);
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  public applyTimeOfDay(time: TimeOfDay): void {
    const cfg = TIME_CONFIGS[time];

    if (this.hemiLight) {
      this.hemiLight.diffuse   = cfg.ambientDiffuse;
      this.hemiLight.groundColor = cfg.ambientGround;
      this.hemiLight.intensity   = cfg.ambientIntensity;
    }

    if (this.keyLight) {
      this.keyLight.diffuse   = cfg.keyColor;
      this.keyLight.intensity = cfg.keyIntensity;
    }

    logger.log(`[ArenaLighting] Time of day → ${time}`);
  }

  /**
   * Register a mesh to cast and receive shadows.
   * Safe to call even when no shadow generator exists (LOW quality).
   */
  public addShadowCaster(mesh: BABYLON.AbstractMesh): void {
    if (this.shadowGenerator) {
      this.shadowGenerator.addShadowCaster(mesh, true);
      mesh.receiveShadows = true;
    }
  }

  public applyQualityPreset(
    qualityTier: 'LOW' | 'MEDIUM' | 'HIGH',
    scene: BABYLON.Scene,
  ): void {
    const hasShadows = qualityTier !== 'LOW';
    scene.shadowsEnabled = hasShadows;
    this.floodLights.forEach(l => l.setEnabled(qualityTier !== 'LOW'));
    logger.log(`[ArenaLighting] Quality preset → ${qualityTier}`);
  }

  public getShadowGenerator(): BABYLON.ShadowGenerator | null { return this.shadowGenerator; }
  public getLights(): BABYLON.Light[] { return [...this.allLights]; }

  public dispose(): void {
    this.shadowGenerator?.dispose();
    this.allLights.forEach(l => l.dispose());
    this.floodLights = [];
    this.allLights   = [];
    logger.log('[ArenaLighting] Disposed');
  }
}
