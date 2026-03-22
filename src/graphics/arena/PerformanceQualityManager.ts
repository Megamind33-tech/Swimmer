/**
 * PerformanceQualityManager
 * Detects device capability tier and applies runtime quality presets.
 *
 * Separating this from ArenaRoot means the quality system can be swapped or
 * extended (e.g. with a PerformanceMonitor that auto-degrades during a race)
 * without touching scene setup code.
 *
 * Quality tiers
 * ─────────────
 *   HIGH   — full resolution, 4× MSAA, shadows, flood spots, particles
 *   MEDIUM — full resolution, shadows, flood spots, no MSAA upgrade
 *   LOW    — half resolution (hardware scaling 2×), ~30 fps (frame skip),
 *            shadows off, flood spots off, particles off
 *
 * Phase 2 will add:
 *   - Auto-degradation: monitor FPS and step down quality if < 30 fps
 *   - LOD switching on swimmer and bleacher geometry
 *   - Texture streaming / mipmaps
 */

import * as BABYLON from '@babylonjs/core';
import { getDeviceQualityTier, getGraphicsCompatibilityProfile, logger } from '../../utils';

export type QualityPreset = 'high' | 'medium' | 'low';

export class PerformanceQualityManager {
  private qualityTier: 'LOW' | 'MEDIUM' | 'HIGH';
  private compatibility = getGraphicsCompatibilityProfile();

  constructor() {
    this.qualityTier = getDeviceQualityTier();
    logger.log(`[PerformanceQualityManager] Device tier detected: ${this.qualityTier}`);
  }

  // ─── Accessors ────────────────────────────────────────────────────────────

  public getQualityTier(): 'LOW' | 'MEDIUM' | 'HIGH' { return this.qualityTier; }

  /** Recommended frame-skip interval for the current tier (0 = every frame). */
  public getFrameSkipInterval(): number {
    return this.qualityTier === 'LOW' ? 1 : 0;
  }

  // ─── Preset application ───────────────────────────────────────────────────

  /**
   * Apply a quality preset at runtime.
   * The caller is responsible for telling ArenaLighting to also update its
   * flood lights and shadow state (via ArenaLighting.applyQualityPreset).
   *
   * @returns new frameSkipInterval so ArenaRoot can update its loop
   */
  public applyPreset(
    preset:  QualityPreset,
    engine:  BABYLON.Engine,
    scene:   BABYLON.Scene,
  ): number {
    switch (preset) {
      case 'high':
        this.qualityTier = 'HIGH';
        engine.setHardwareScalingLevel(1);
        scene.shadowsEnabled   = true;
        scene.particlesEnabled = true;
        logger.log('[PerformanceQualityManager] → high');
        return 0;

      case 'medium':
        this.qualityTier = 'MEDIUM';
        engine.setHardwareScalingLevel(
          this.compatibility.isAndroid && this.compatibility.mobileShaderBudget !== 'full' ? 1.15 : 1,
        );
        scene.shadowsEnabled   = true;
        scene.particlesEnabled = true;
        logger.log('[PerformanceQualityManager] → medium');
        return 0;

      case 'low':
        this.qualityTier = 'LOW';
        engine.setHardwareScalingLevel(
          this.compatibility.isAndroid ? 1.4 : 2,
        );
        scene.shadowsEnabled   = false;
        scene.particlesEnabled = false;
        logger.log('[PerformanceQualityManager] → low');
        return 1;  // render every other frame ≈ 30 fps
    }
  }
}
