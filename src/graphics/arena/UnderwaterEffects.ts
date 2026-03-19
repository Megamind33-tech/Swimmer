/**
 * UnderwaterEffects  —  Phase 7
 * Manages the visual transition when the active camera crosses the water surface.
 *
 * Above water  → normal scene fog + clearColor set by ArenaAtmosphere.
 * Below water  → dense blue-green EXP2 fog, dark clearColor, depth PointLight.
 *
 * Three quality-tiered features:
 *   ALL tiers  : smooth fog/clearColor lerp on camera Y crossing WATER_SURFACE_Y
 *   MED / HIGH : depth PointLight inside water column (blue-cyan pool-floor fill)
 *   HIGH only  : bubble ParticleSystem at pool floor corners (start/stop per camera)
 *
 * ArenaManager wires this into the render loop and calls syncAboveWaterState()
 * after any theme or time-of-day change so the "restore" targets stay current.
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig } from '../../types';
import { logger } from '../../utils';

// Must match PoolWater.WATER_SURFACE_Y
const WATER_Y       = 0.02;
// Pool floor Y (matches PoolStructure BASIN_DEPTH = 3.0)
const POOL_FLOOR_Y  = -2.90;
// Seconds to complete the above ↔ below transition
const TRANSITION_S  = 0.40;

// Underwater target state (applied when t → 1)
const UNDER_CLEAR   = new BABYLON.Color4(0.00, 0.04, 0.11, 1.0);  // deep pool blue
const UNDER_FOG     = new BABYLON.Color3(0.01, 0.06, 0.16);        // dark water blue
const UNDER_DENSITY = 0.068;  // EXP2 — ~10 m effective visibility in pool water

export class UnderwaterEffects {

  private _tier: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';

  // Smooth transition state: 0 = fully above water, 1 = fully below
  private _t           = 0;
  private _underwater  = false;

  // Stored above-water scene state (refreshed by syncAboveWaterState)
  private _aboveClear   = new BABYLON.Color4(0.06, 0.08, 0.14, 1);
  private _aboveFog     = new BABYLON.Color3(0.06, 0.08, 0.14);
  private _aboveDensity = 0.006;

  // Scene lighting inside the water column — always-on, simulates depth attenuation
  private _depthLight: BABYLON.PointLight | null = null;

  // Bubble particle systems (HIGH only) — activated when camera is near/in water
  private _bubbleSystems: BABYLON.ParticleSystem[] = [];
  private _bubbleTex:     BABYLON.DynamicTexture   | null = null;
  private _bubblesActive  = false;

  // ─────────────────────────────────────────────────────────────────────────
  // Build
  // ─────────────────────────────────────────────────────────────────────────

  public build(
    scene:       BABYLON.Scene,
    config:      IArenaConfig,
    qualityTier: 'LOW' | 'MEDIUM' | 'HIGH',
  ): void {
    this._tier = qualityTier;

    // Guarantee EXP2 fog mode is active (ArenaAtmosphere also sets this,
    // but build order is not guaranteed — belt-and-suspenders here)
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;

    // ── Depth PointLight — simulates light absorption inside the water column ─
    // Slightly below surface, limited range (just reaches pool floor at -3 m).
    // Blue-cyan: water absorbs red wavelengths first → cool appearance.
    // Always active (not just when camera is underwater) — it's part of the
    // pool's lighting environment.
    if (qualityTier !== 'LOW') {
      this._depthLight = new BABYLON.PointLight(
        'waterDepthLight',
        new BABYLON.Vector3(0, -0.80, 0),  // 80 cm below surface: mid-water
        scene,
      );
      this._depthLight.diffuse   = new BABYLON.Color3(0.28, 0.68, 1.00); // pool-water cyan
      this._depthLight.specular  = new BABYLON.Color3(0.08, 0.35, 0.65);
      this._depthLight.intensity = 0.26;
      this._depthLight.range     = 5.80;   // reaches floor at -3 m with ~55% falloff
    }

    // ── Bubble ParticleSystem — pool floor corners, HIGH only ─────────────
    if (qualityTier === 'HIGH') {
      this._bubbleTex = this._makeBubbleTexture(scene);

      const { poolWidth: W, poolLength: L } = config;
      const corners = [
        new BABYLON.Vector3(-W * 0.44, POOL_FLOOR_Y, -L * 0.44),
        new BABYLON.Vector3( W * 0.44, POOL_FLOOR_Y, -L * 0.44),
        new BABYLON.Vector3(-W * 0.44, POOL_FLOOR_Y,  L * 0.44),
        new BABYLON.Vector3( W * 0.44, POOL_FLOOR_Y,  L * 0.44),
      ];

      for (let i = 0; i < corners.length; i++) {
        this._bubbleSystems.push(
          this._makeBubbleSystem(scene, `bubbles_${i}`, corners[i]),
        );
      }
    }

    logger.log(`[UnderwaterEffects] Built (tier=${qualityTier})`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Sync — call after any theme or time-of-day change while above water
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Snapshot the scene's current fog / clearColor as the "above water" baseline.
   * ArenaManager calls this after ArenaAtmosphere.applyTheme() and any call
   * that changes scene.fogDensity / scene.fogColor / scene.clearColor.
   */
  public syncAboveWaterState(scene: BABYLON.Scene): void {
    // Only update baseline when not transitioning into underwater
    // (prevents overwriting baseline mid-dive)
    if (this._t < 0.05) {
      this._aboveClear   = scene.clearColor.clone();
      this._aboveFog     = scene.fogColor.clone();
      this._aboveDensity = scene.fogDensity;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Update — called every frame by ArenaManager render loop
  // ─────────────────────────────────────────────────────────────────────────

  public update(
    scene:    BABYLON.Scene,
    cameraY:  number,
    deltaMs:  number,
  ): void {
    const dt      = deltaMs / 1000;
    const target  = cameraY < WATER_Y ? 1 : 0;

    if ((target === 1) !== this._underwater) {
      this._underwater = target === 1;
    }

    // Advance blend value toward target
    const speed = 1 / TRANSITION_S;
    if (target > this._t) {
      this._t = Math.min(1, this._t + speed * dt);
    } else if (target < this._t) {
      this._t = Math.max(0, this._t - speed * dt);
    }

    // Interpolate scene state
    if (this._t > 0 || this._underwater) {
      this._applyBlend(scene, this._t);
    }

    // Bubble activation: start/stop based on camera proximity to surface
    if (this._bubbleSystems.length > 0) {
      const nearWater = cameraY < WATER_Y + 1.5;
      if (nearWater && !this._bubblesActive) {
        this._bubbleSystems.forEach(ps => ps.start());
        this._bubblesActive = true;
      } else if (!nearWater && this._bubblesActive) {
        this._bubbleSystems.forEach(ps => ps.stop());
        this._bubblesActive = false;
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Internal helpers
  // ─────────────────────────────────────────────────────────────────────────

  private _applyBlend(scene: BABYLON.Scene, t: number): void {
    const s = this._smoothstep(t);

    scene.clearColor = new BABYLON.Color4(
      this._lerp(this._aboveClear.r, UNDER_CLEAR.r, s),
      this._lerp(this._aboveClear.g, UNDER_CLEAR.g, s),
      this._lerp(this._aboveClear.b, UNDER_CLEAR.b, s),
      1,
    );

    scene.fogColor = new BABYLON.Color3(
      this._lerp(this._aboveFog.r, UNDER_FOG.r, s),
      this._lerp(this._aboveFog.g, UNDER_FOG.g, s),
      this._lerp(this._aboveFog.b, UNDER_FOG.b, s),
    );

    scene.fogDensity = this._lerp(this._aboveDensity, UNDER_DENSITY, s);
  }

  private _lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  // Smoothstep: ease-in-out for less jarring fog transitions
  private _smoothstep(t: number): number {
    return t * t * (3 - 2 * t);
  }

  // ── Bubble texture — 32×32 radial soft-edged circle ─────────────────────

  private _makeBubbleTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
    const S   = 32;
    const tex = new BABYLON.DynamicTexture('bubbleTex', { width: S, height: S }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, S, S);
    const grad = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    grad.addColorStop(0,    'rgba(210, 235, 255, 0.90)');
    grad.addColorStop(0.45, 'rgba(185, 220, 255, 0.60)');
    grad.addColorStop(0.78, 'rgba(160, 205, 255, 0.25)');
    grad.addColorStop(1,    'rgba(140, 195, 255, 0.00)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, S, S);
    tex.update();
    return tex;
  }

  // ── Bubble particle system — rising from one pool-floor corner ───────────

  private _makeBubbleSystem(
    scene:    BABYLON.Scene,
    name:     string,
    position: BABYLON.Vector3,
  ): BABYLON.ParticleSystem {
    const ps = new BABYLON.ParticleSystem(name, 60, scene);

    ps.particleTexture = this._bubbleTex!;
    ps.blendMode       = BABYLON.ParticleSystem.BLENDMODE_ADD; // additive = subtle luminous glow

    // Point emitter at pool floor corner
    ps.emitter = position.clone();

    // Rise gently upward with small horizontal wobble
    ps.direction1      = new BABYLON.Vector3(-0.18, 0.65, -0.18);
    ps.direction2      = new BABYLON.Vector3( 0.18, 1.05,  0.18);
    ps.minEmitPower    = 0.30;
    ps.maxEmitPower    = 0.52;
    ps.updateSpeed     = 0.016;

    // Particle size — small spherical bubbles
    ps.minSize    = 0.022;
    ps.maxSize    = 0.060;

    // Lifetime: long enough to travel 2.5–3 m from floor to surface
    ps.minLifeTime = 5.5;
    ps.maxLifeTime = 8.5;

    // Emit rate: very restrained — small cluster per corner
    ps.emitRate = 3;

    // Slow initial rotation
    ps.minInitialRotation = -Math.PI;
    ps.maxInitialRotation =  Math.PI;
    ps.minAngularSpeed    = -0.30;
    ps.maxAngularSpeed    =  0.30;

    // Colour over life: cool white-blue, fade out at surface
    ps.color1    = new BABYLON.Color4(0.82, 0.93, 1.00, 0.75);
    ps.color2    = new BABYLON.Color4(0.70, 0.88, 1.00, 0.45);
    ps.colorDead = new BABYLON.Color4(0.60, 0.82, 1.00, 0.00);

    // Don't auto-start — update() manages start/stop
    ps.stop();

    return ps;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Dispose
  // ─────────────────────────────────────────────────────────────────────────

  public dispose(): void {
    this._depthLight?.dispose();
    this._bubbleSystems.forEach(ps => ps.dispose());
    this._bubbleSystems = [];
    this._bubbleTex?.dispose();
    logger.log('[UnderwaterEffects] Disposed');
  }
}
