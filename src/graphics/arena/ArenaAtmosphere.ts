/**
 * ArenaAtmosphere  —  Phase 7 update
 * Controls scene-level ambient settings that affect the whole environment:
 *   - clear colour / background
 *   - fog mode (EXP2), colour & density — now quality-tier scaled
 *   - pool water colour mapping per theme
 *
 * Phase 7 changes:
 *   - scene.fogMode is now explicitly FOGMODE_EXP2 (was FOGMODE_NONE — fog was
 *     silently disabled because the mode was never set).
 *   - Fog density is scaled by quality tier to simulate humid natatorium haze:
 *       LOW  0.005 — barely visible, mobile-safe
 *       MED  0.006 — subtle depth recession
 *       HIGH 0.008 — perceptible humid haze on far bleachers / upper walls
 *   - build() now accepts optional qualityTier for the above.
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig, PoolTheme } from '../../types';
import { logger } from '../../utils';

// Per-theme water colour (used by PoolWater and pool structure to stay in sync)
const WATER_COLORS: Record<PoolTheme, BABYLON.Color3> = {
  OLYMPIC:      new BABYLON.Color3(0.00, 0.30, 0.70),
  CHAMPIONSHIP: new BABYLON.Color3(0.04, 0.18, 0.52),
  NEON:         new BABYLON.Color3(0.00, 0.90, 0.90),
  SUNSET:       new BABYLON.Color3(0.75, 0.30, 0.05),
  CUSTOM:       new BABYLON.Color3(0.25, 0.42, 0.62),
};

// Per-theme sky/ambient background (affects clear colour + fog).
// SWIM26 venue: bright indoor natatorium with large clerestory windows.
// Background is a pale cool white-blue (like looking at a white concrete
// ceiling under bright LED floodlights) — matches reference image brightness.
const CLEAR_COLORS: Record<PoolTheme, BABYLON.Color4> = {
  OLYMPIC:      new BABYLON.Color4(0.72, 0.80, 0.88, 1),  // light indoor sky
  CHAMPIONSHIP: new BABYLON.Color4(0.65, 0.72, 0.84, 1),
  NEON:         new BABYLON.Color4(0.60, 0.76, 0.90, 1),
  SUNSET:       new BABYLON.Color4(0.80, 0.72, 0.60, 1),
  CUSTOM:       new BABYLON.Color4(0.70, 0.78, 0.86, 1),
};

// Fog density per quality tier — above-water natatorium haze.
// EXP2 formula: factor = exp(-(density * distance)²)
// At 80 m with HIGH density 0.008: factor ≈ 0.66 → 34% haze (distant bleachers)
// At 80 m with LOW  density 0.005: factor ≈ 0.85 → 15% haze (mobile-safe)
const FOG_DENSITY: Record<'LOW' | 'MEDIUM' | 'HIGH', number> = {
  LOW:    0.005,
  MEDIUM: 0.006,
  HIGH:   0.008,
};

export class ArenaAtmosphere {

  private _qualityTier: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';

  build(
    scene:       BABYLON.Scene,
    config:      IArenaConfig,
    qualityTier: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM',
  ): void {
    this._qualityTier = qualityTier;
    // EXP2 must be set before applyTheme — otherwise fogDensity has no effect
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    this.applyTheme(scene, config.theme);
    logger.log('[ArenaAtmosphere] Built');
  }

  /**
   * Apply a pool theme to the scene.
   * Returns the matching water colour so callers can update PoolWater/PoolStructure.
   */
  public applyTheme(scene: BABYLON.Scene, theme: PoolTheme): BABYLON.Color3 {
    const cc = CLEAR_COLORS[theme];
    scene.clearColor = cc;
    scene.fogColor   = new BABYLON.Color3(cc.r, cc.g, cc.b);
    scene.fogDensity = FOG_DENSITY[this._qualityTier];
    // Guarantee EXP2 mode is set — applyTheme may be called standalone
    // (e.g. from ArenaManager.setTheme) so we re-assert the mode here.
    scene.fogMode    = BABYLON.Scene.FOGMODE_EXP2;

    logger.log(`[ArenaAtmosphere] Theme → ${theme}`);
    return WATER_COLORS[theme].clone();
  }

  /** Look up the water colour for a theme without mutating the scene. */
  public static getWaterColor(theme: PoolTheme): BABYLON.Color3 {
    return WATER_COLORS[theme].clone();
  }

  public dispose(): void {
    logger.log('[ArenaAtmosphere] Disposed');
  }
}
