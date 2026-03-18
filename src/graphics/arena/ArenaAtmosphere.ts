/**
 * ArenaAtmosphere
 * Controls scene-level ambient settings that affect the whole environment:
 *   - clear colour / background
 *   - fog colour & density
 *   - pool water colour mapping per theme
 *
 * Separating this from ArenaLighting keeps "paint the air" concerns distinct
 * from "place light sources" concerns.
 *
 * Phase 2 will add:
 *   - Sky dome mesh (HDR sky texture or procedural gradient)
 *   - Lens-flare on flood lights
 *   - Heat-haze / humidity post-process on high quality
 *   - God-rays / volumetric light shaft on NIGHT / EVENING
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

// Per-theme sky/ambient background (affects clear colour + fog)
const CLEAR_COLORS: Record<PoolTheme, BABYLON.Color4> = {
  OLYMPIC:      new BABYLON.Color4(0.06, 0.08, 0.14, 1),
  CHAMPIONSHIP: new BABYLON.Color4(0.04, 0.06, 0.12, 1),
  NEON:         new BABYLON.Color4(0.00, 0.04, 0.12, 1),
  SUNSET:       new BABYLON.Color4(0.16, 0.07, 0.03, 1),
  CUSTOM:       new BABYLON.Color4(0.07, 0.09, 0.12, 1),
};

export class ArenaAtmosphere {

  build(scene: BABYLON.Scene, config: IArenaConfig): void {
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
    scene.fogDensity = 0.004;

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
