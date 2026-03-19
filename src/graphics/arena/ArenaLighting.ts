/**
 * ArenaLighting  —  Phase 5
 * Professional indoor natatorium lighting rig.
 *
 * Phase 3 audit problems fixed here:
 *   - HemisphericLight.specular = 0.8 → flat white specular on everything.
 *     Reduced to 0.25: ambient contributes only soft fill, direct lights
 *     own all specular character.
 *   - DirectionalLight direction (-0.3, -1, -0.4) — angled like outdoor sun.
 *     Corrected to nearly-vertical (-0.05, -1, 0.05): overhead fixture array
 *     simulation → short, straight-down shadows under starting blocks.
 *   - Only 4 SpotLights, disabled on LOW.  Expanded to 8 in two rows with
 *     better lateral coverage across all lanes.
 *   - addShadowCaster() was never called from ArenaManager → no shadow casters
 *     registered → shadow map was never used.  New configureShadowsForScene()
 *     auto-scans scene.meshes and registers casters/receivers.
 *   - All materials had environmentIntensity = 0 → no IBL at all.
 *     New buildEnvironmentProbe() creates a ReflectionProbe for IBL once all
 *     geometry is in the scene; ArenaMaterialLibrary activates non-zero env
 *     intensities via applyEnvironmentTexture().
 *
 * Phase 5 lighting rig:
 *   1. HemisphericLight   — soft ambient fill / sky contribution per time-of-day
 *   2. DirectionalLight   — primary key light, nearly vertical, shadow caster
 *   3. 8× SpotLight       — overhead flood array (2 rows × 4, MEDIUM / HIGH)
 *   4. 2× PointLight      — side-bleacher bounce fill (HIGH only)
 *   5. 1× PointLight      — ceiling indirect bounce (MEDIUM / HIGH)
 *   6. ShadowGenerator    — on key DirectionalLight (none on LOW)
 *   7. ReflectionProbe    — scene-capture cube map for IBL (MEDIUM / HIGH)
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig, TimeOfDay } from '../../types';
import { logger } from '../../utils';

interface TimeConfig {
  ambientDiffuse:    BABYLON.Color3;
  ambientGround:     BABYLON.Color3;
  ambientIntensity:  number;
  keyColor:          BABYLON.Color3;
  keyIntensity:      number;
  // Overhead flood fixtures — remain near-constant, only slight variation
  floodColor:        BABYLON.Color3;
  floodIntensity:    number;
}

// ── Time-of-day configurations ────────────────────────────────────────────────
// Indoor arena: flood fixtures always on at competition level.
// Hemi/key represent daylight through high clerestory windows.
// NIGHT = no window contribution, full artificial (drama + maximum contrast).
const TIME_CONFIGS: Record<TimeOfDay, TimeConfig> = {
  MORNING: {
    ambientDiffuse:   new BABYLON.Color3(1.00, 0.96, 0.88), // warm morning window
    ambientGround:    new BABYLON.Color3(0.50, 0.52, 0.54), // concrete floor bounce
    ambientIntensity: 0.54,
    keyColor:         new BABYLON.Color3(0.88, 0.93, 1.00), // cool morning overhead
    keyIntensity:     0.68,
    floodColor:       new BABYLON.Color3(1.00, 0.97, 0.93),
    floodIntensity:   0.52,
  },
  AFTERNOON: {
    ambientDiffuse:   new BABYLON.Color3(1.00, 1.00, 1.00), // full neutral daylight
    ambientGround:    new BABYLON.Color3(0.54, 0.56, 0.58),
    ambientIntensity: 0.68,
    keyColor:         new BABYLON.Color3(0.98, 1.00, 1.00), // neutral overhead
    keyIntensity:     0.88,
    floodColor:       new BABYLON.Color3(1.00, 0.98, 0.94),
    floodIntensity:   0.58,
  },
  EVENING: {
    ambientDiffuse:   new BABYLON.Color3(0.95, 0.82, 0.62), // warm late light tint
    ambientGround:    new BABYLON.Color3(0.46, 0.44, 0.42),
    ambientIntensity: 0.40,
    keyColor:         new BABYLON.Color3(0.98, 0.98, 0.96), // artificial dominant
    keyIntensity:     0.92,
    floodColor:       new BABYLON.Color3(1.00, 0.97, 0.90), // warm stadium lamps
    floodIntensity:   0.65,
  },
  NIGHT: {
    // No daylight — pure artificial. Cool exterior sky bleeds in through windows.
    ambientDiffuse:   new BABYLON.Color3(0.58, 0.70, 0.90),
    ambientGround:    new BABYLON.Color3(0.38, 0.42, 0.46),
    ambientIntensity: 0.26,
    keyColor:         new BABYLON.Color3(0.98, 0.98, 0.96), // pure white LED
    keyIntensity:     0.96,
    floodColor:       new BABYLON.Color3(1.00, 0.98, 0.92), // high-CRI stadium LEDs
    floodIntensity:   0.72,
  },
};

// ── Shadow-caster and receiver name patterns ──────────────────────────────────
// Meshes whose names START WITH any of these strings get shadow treatment.
// Conservative list — only meshes that have meaningful silhouettes.
//
// Corrected in Phase 6: names must match what the builder actually creates —
//   StartingBlocks: blockPedestal0, blockPlatform0, legFront0, legBack0
//   ArenaArchitecture columns: col1_0, col-1_0
//   PoolDeck wet zones: wetN, wetS, wetE, wetW  (not 'wetZone')
const SHADOW_CASTER_PREFIXES  = ['blockPedestal', 'blockPlatform', 'legFront', 'legBack', 'col'];
const SHADOW_RECEIVER_PREFIXES = ['poolFloor', 'deckSlab', 'wet'];

export class ArenaLighting {
  private hemiLight:         BABYLON.HemisphericLight | null = null;
  private keyLight:          BABYLON.DirectionalLight  | null = null;
  private floodLights:       BABYLON.SpotLight[]  = [];
  private sideBouncePoints:  BABYLON.PointLight[] = [];
  private ceilBouncePoint:   BABYLON.PointLight   | null = null;
  private shadowGenerator:   BABYLON.ShadowGenerator | null = null;
  private envProbe:          BABYLON.ReflectionProbe | null = null;

  private allLights: BABYLON.Light[] = [];
  private _qualityTier: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

  // ─────────────────────────────────────────────────────────────────────────
  // Build
  // ─────────────────────────────────────────────────────────────────────────

  build(
    scene:       BABYLON.Scene,
    config:      IArenaConfig,
    qualityTier: 'LOW' | 'MEDIUM' | 'HIGH',
  ): void {
    this._qualityTier = qualityTier;
    const { poolLength: L, poolWidth: W, arenaHeight: AH } = config;

    // ── 1. Hemispheric ambient ────────────────────────────────────────────
    // Represents diffuse sky / venue bounce. specular intentionally low:
    // ambient should not create fake specular highlights on every surface.
    this.hemiLight = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);
    this.hemiLight.specular = new BABYLON.Color3(0.25, 0.25, 0.25);
    this.allLights.push(this.hemiLight);

    // ── 2. Directional key light — shadow caster ──────────────────────────
    // Direction nearly vertical: simulates an overhead fixture array, NOT
    // an outdoor sun angle.  Slight offsets prevent perfectly flat shadows.
    this.keyLight = new BABYLON.DirectionalLight(
      'keyLight',
      new BABYLON.Vector3(-0.05, -1, 0.05),  // ≈ vertical with tiny offset
      scene,
    );
    this.keyLight.position = new BABYLON.Vector3(W * 0.1, AH, L * 0.05);
    this.allLights.push(this.keyLight);

    // ── 3. Overhead flood SpotLights — 8 in two rows ─────────────────────
    // Row A: Z = -L/4  (south quarter)
    // Row B: Z = +L/4  (north quarter)
    // Each row: 4 fixtures at X = ±W×0.15 and ±W×0.41 for lane coverage
    // Enabled on MEDIUM and HIGH; halved on LOW via applyQualityPreset().
    if (qualityTier !== 'LOW') {
      const floodY = AH - 6; // position a little below ceiling for realistic hang
      const floodXs = [-W * 0.41, -W * 0.15, W * 0.15, W * 0.41];
      const floodZs = [-L * 0.25,  L * 0.25];

      for (const fz of floodZs) {
        for (const fx of floodXs) {
          const spot = new BABYLON.SpotLight(
            `flood_${fx.toFixed(0)}_${fz.toFixed(0)}`,
            new BABYLON.Vector3(fx, floodY, fz),
            new BABYLON.Vector3(0, -1, 0),   // straight down
            Math.PI / 3,    // 60° cone (tighter than Phase 3's 82°)
            2.5,            // sharper falloff inside cone (was 1.4)
            scene,
          );
          this.floodLights.push(spot);
          this.allLights.push(spot);
        }
      }
    }

    // ── 4. Side-bleacher bounce PointLights (HIGH only) ──────────────────
    // Low intensity, wide range — fills under-bleacher shadow and prevents
    // the pool sides from being fully unlit.
    if (qualityTier === 'HIGH') {
      const sideX = W * 0.5 + 18;  // well into bleacher zone
      const sideY = AH * 0.28;
      const sidePositions = [
        new BABYLON.Vector3(-sideX, sideY,  0),
        new BABYLON.Vector3( sideX, sideY,  0),
      ];
      for (let si = 0; si < sidePositions.length; si++) {
        const pt = new BABYLON.PointLight(`sideBounce${si}`, sidePositions[si], scene);
        pt.intensity = 0.12;
        pt.diffuse   = new BABYLON.Color3(0.92, 0.90, 0.88);
        pt.specular  = new BABYLON.Color3(0.20, 0.20, 0.20); // minimal specular
        this.sideBouncePoints.push(pt);
        this.allLights.push(pt);
      }
    }

    // ── 5. Ceiling indirect bounce PointLight (MEDIUM / HIGH) ────────────
    // Simulates light reflected back from the white ceiling — provides top-
    // down soft fill that keeps the upper halves of columns / walls readable.
    if (qualityTier !== 'LOW') {
      this.ceilBouncePoint = new BABYLON.PointLight(
        'ceilBounce',
        new BABYLON.Vector3(0, AH * 0.88, 0),
        scene,
      );
      this.ceilBouncePoint.intensity = 0.07;
      this.ceilBouncePoint.diffuse   = new BABYLON.Color3(0.95, 0.97, 1.00);
      this.ceilBouncePoint.specular  = new BABYLON.Color3(0, 0, 0); // no specular
      this.allLights.push(this.ceilBouncePoint);
    }

    // ── 6. Shadow generator on key light ─────────────────────────────────
    // Larger maps and better filtering than Phase 3.
    // On HIGH: BESM (Blur Exponential Shadow Map) — soft, film-like.
    // On MEDIUM: Poisson PCF — lighter, still soft.
    if (qualityTier === 'HIGH') {
      this.shadowGenerator = new BABYLON.ShadowGenerator(2048, this.keyLight);
      this.shadowGenerator.useBlurExponentialShadowMap = true;
      this.shadowGenerator.blurKernel  = 24;
      this.shadowGenerator.bias        = 0.00004;
      this.shadowGenerator.normalBias  = 0.004;
    } else if (qualityTier === 'MEDIUM') {
      this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.keyLight);
      this.shadowGenerator.usePoissonSampling = true;
      this.shadowGenerator.bias               = 0.00005;
    }

    // Apply initial time-of-day
    this.applyTimeOfDay(config.timeOfDay);

    logger.log(`[ArenaLighting] Built Phase 5 (quality=${qualityTier}, floods=${this.floodLights.length})`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Post-build configuration — called by ArenaManager after all geometry built
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Auto-registers shadow casters and receivers from the full scene mesh list.
   * Must be called AFTER all geometry modules have built so scene.meshes is
   * complete.  Safe to call on LOW quality (no-op: no shadow generator).
   */
  public configureShadowsForScene(scene: BABYLON.Scene): void {
    if (!this.shadowGenerator) return;

    let casterCount   = 0;
    let receiverCount = 0;

    for (const mesh of scene.meshes) {
      const name = mesh.name;

      const isCaster = SHADOW_CASTER_PREFIXES.some(p => name.startsWith(p));
      if (isCaster) {
        this.shadowGenerator.addShadowCaster(mesh, true);
        mesh.receiveShadows = true; // casters also receive (self-shadow on blocks)
        casterCount++;
      }

      const isReceiver = SHADOW_RECEIVER_PREFIXES.some(p => name.startsWith(p));
      if (isReceiver && !isCaster) {
        mesh.receiveShadows = true;
        receiverCount++;
      }
    }

    logger.log(`[ArenaLighting] Shadows configured: ${casterCount} casters, ${receiverCount} receivers`);
  }

  /**
   * Builds a single-shot ReflectionProbe for scene-accurate IBL.
   * The probe captures one cube map on the first frame, then stops refreshing
   * (venue structure is static).  Returns the cube texture so ArenaManager
   * can assign it to scene.environmentTexture.
   *
   * Excluded meshes (pass water surface + caustic overlay) to prevent feedback.
   * Resolution: 128 px per face on HIGH, 64 px on MEDIUM.
   */
  public buildEnvironmentProbe(
    scene:        BABYLON.Scene,
    excludeMeshes: BABYLON.AbstractMesh[],
  ): BABYLON.BaseTexture | null {
    if (this._qualityTier === 'LOW') return null;

    const res   = this._qualityTier === 'HIGH' ? 128 : 64;
    this.envProbe = new BABYLON.ReflectionProbe('arenaProbe', res, scene);

    // Exclude water surface (and caustic overlay) — prevents IBL feedback
    const excludeSet = new Set<BABYLON.AbstractMesh>(excludeMeshes);
    for (const m of scene.meshes) {
      if (!excludeSet.has(m)) {
        this.envProbe.renderList!.push(m);
      }
    }

    // Positioned at pool-centre, 6 m above water — captures ceiling, walls,
    // bleachers in all 6 cube faces from a realistic vantage point.
    this.envProbe.position = new BABYLON.Vector3(0, 6, 0);

    // Render once and cache — venue is static, no need to refresh every frame
    this.envProbe.refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;

    logger.log(`[ArenaLighting] Environment probe built (${res}px, ${this.envProbe.renderList!.length} meshes)`);
    return this.envProbe.cubeTexture;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────────

  public applyTimeOfDay(time: TimeOfDay): void {
    const cfg = TIME_CONFIGS[time];

    if (this.hemiLight) {
      this.hemiLight.diffuse    = cfg.ambientDiffuse;
      this.hemiLight.groundColor = cfg.ambientGround;
      this.hemiLight.intensity   = cfg.ambientIntensity;
    }

    if (this.keyLight) {
      this.keyLight.diffuse   = cfg.keyColor;
      this.keyLight.specular  = cfg.keyColor; // specular matches diffuse for key light
      this.keyLight.intensity = cfg.keyIntensity;
    }

    for (const spot of this.floodLights) {
      spot.diffuse   = cfg.floodColor;
      spot.specular  = new BABYLON.Color3(1.0, 1.0, 1.0); // crisp white specular
      spot.intensity = cfg.floodIntensity;
    }

    logger.log(`[ArenaLighting] Time of day → ${time}`);
  }

  /**
   * Register a single mesh as a shadow caster+receiver.
   * Kept for external callers (e.g. swimmer meshes added at race start).
   */
  public addShadowCaster(mesh: BABYLON.AbstractMesh): void {
    if (this.shadowGenerator) {
      this.shadowGenerator.addShadowCaster(mesh, true);
      mesh.receiveShadows = true;
    }
  }

  public applyQualityPreset(
    qualityTier: 'LOW' | 'MEDIUM' | 'HIGH',
    scene:       BABYLON.Scene,
  ): void {
    scene.shadowsEnabled = qualityTier !== 'LOW';
    // Enable/disable flood lights according to tier
    this.floodLights.forEach(l => l.setEnabled(qualityTier !== 'LOW'));
    this.sideBouncePoints.forEach(l => l.setEnabled(qualityTier === 'HIGH'));
    this.ceilBouncePoint?.setEnabled(qualityTier !== 'LOW');
    logger.log(`[ArenaLighting] Quality preset → ${qualityTier}`);
  }

  public getShadowGenerator(): BABYLON.ShadowGenerator | null { return this.shadowGenerator; }
  public getHemiLight():       BABYLON.HemisphericLight | null { return this.hemiLight; }
  public getLights(): BABYLON.Light[] { return [...this.allLights]; }
  public getEnvProbe(): BABYLON.ReflectionProbe | null { return this.envProbe; }

  public dispose(): void {
    this.shadowGenerator?.dispose();
    this.envProbe?.dispose();
    this.allLights.forEach(l => l.dispose());
    this.floodLights      = [];
    this.sideBouncePoints = [];
    this.allLights        = [];
    logger.log('[ArenaLighting] Disposed');
  }
}
