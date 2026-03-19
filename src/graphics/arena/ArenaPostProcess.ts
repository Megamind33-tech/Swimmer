/**
 * ArenaPostProcess  —  Phase 8
 * Post-processing and color grading for the competition arena.
 *
 * Strategy (least-overhead-first — mobile-safe):
 *
 *   ALL tiers  : scene.imageProcessingConfiguration
 *                Sets contrast, exposure, and (HIGH only) ACES tone-mapping
 *                directly on the scene IP config object.  This runs INSIDE
 *                the PBR/Standard material fragment shader — zero extra render
 *                target, zero extra screen pass.  Works with any active camera.
 *
 *   MED / HIGH : DefaultRenderingPipeline with hdr=false (LDR render path).
 *                Added ONLY for FXAA (MED+HIGH) and restrained bloom (HIGH).
 *                hdr=false keeps it off a 16-bit buffer — saves GPU memory
 *                and bandwidth vs the full HDR pipeline.
 *
 *                imageProcessingEnabled is set to FALSE on the pipeline so
 *                it does NOT double-apply the contrast/exposure we already
 *                configured on scene.imageProcessingConfiguration above.
 *
 *   Bloom (HIGH only):
 *     weight=0.10, threshold=0.64, kernel=24, scale=0.5
 *     Very restrained — adds halation on the overhead flood fixtures and
 *     water-surface specular without making the scene feel like a game show.
 *     Bloom threshold of 0.64 activates on directly-lit bright surfaces and
 *     the water surface, not on general ambient fill.
 *
 * Color grading rationale (competition natatorium):
 *   - High-CRI LED floodlights produce clean, punchy whites.
 *   - Slight contrast lift (1.04–1.08) separates dark lane markings from
 *     light tile and dark water from bright coping.
 *   - Slight exposure boost (1.06) compensates for Babylon's default dark
 *     tone — indoor arenas are very brightly lit.
 *   - ACES tone mapping (HIGH) prevents highlight clip on specular water
 *     surface and scoreboard emissive.
 *   - Gentle saturation boost (8–12 units) makes the FINA rope colours
 *     (red / yellow / green) and pool water more vivid without looking neon.
 *
 * Build this module AFTER CameraSupport so all cameras can be passed in.
 * Call applyQualityPreset() at runtime when the user changes quality.
 */

import * as BABYLON from '@babylonjs/core';
import { logger } from '../../utils';

export class ArenaPostProcess {

  private _pipeline: BABYLON.DefaultRenderingPipeline | null = null;

  // ─────────────────────────────────────────────────────────────────────────
  // Build
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Configures color grading and (MED/HIGH) the render pipeline.
   * @param cameras All CameraSupport cameras — the pipeline is attached to
   *                each of them.  May be empty on LOW (IP config has no
   *                dependency on cameras).
   */
  public build(
    scene:       BABYLON.Scene,
    cameras:     BABYLON.Camera[],
    qualityTier: 'LOW' | 'MEDIUM' | 'HIGH',
  ): void {

    // ── 1. Image processing — all tiers, zero render target overhead ──────
    // Runs inside PBR/Standard material shaders.  No extra screen pass.
    const ip = scene.imageProcessingConfiguration;
    ip.isEnabled = true;

    // Contrast: competition arena benefits from a small lift.
    // 1.00 = neutral.  1.08 separates dark/mid tones for HIGH clarity.
    ip.contrast = qualityTier === 'HIGH' ? 1.08
                : qualityTier === 'MEDIUM' ? 1.04
                : 1.02;

    // Exposure: indoor venue with high-output LED floods — compensate for
    // Babylon's default dark-ish output.
    ip.exposure = 1.06;

    // ACES tone mapping (HIGH only) — maps HDR linear radiance into a
    // pleasing S-curve that preserves mid-tone detail and rolls off highlights
    // rather than clipping.  On LDR (no HDR pipeline) it still adds the
    // characteristic shoulder that makes the scene feel "film-like".
    ip.toneMappingEnabled = qualityTier === 'HIGH';
    if (qualityTier === 'HIGH') {
      // TONEMAPPING_ACES = 1 in Babylon.js ImageProcessingConfiguration
      ip.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
    }

    // Saturation boost — competition venue: vivid FINA rope colours, punchy
    // pool blue without going into arcade territory.
    ip.colorCurvesEnabled = qualityTier !== 'LOW';
    if (qualityTier !== 'LOW') {
      const curves = ip.colorCurves ?? new BABYLON.ColorCurves();
      // globalSaturation: range −100 to +100, 0 = neutral.
      // +10 (MED) / +14 (HIGH) — noticeably more vivid but not garish.
      curves.globalSaturation = qualityTier === 'HIGH' ? 14 : 10;
      // globalHue: slight +2 warmth takes the cool-white LEDs from clinical
      // fluorescent to proper competition-grade tungsten-halogen feel.
      curves.globalHue = 2;
      ip.colorCurves = curves;
    }

    // ── 2. DefaultRenderingPipeline — MED / HIGH only ─────────────────────
    // hdr=false  : LDR render path — avoids allocating a 16-bit framebuffer.
    //              Saves 2× GPU memory vs the HDR pipeline.  Bloom operates
    //              on clamped LDR values which is slightly less accurate but
    //              completely imperceptible for our restrained bloom settings.
    if (qualityTier !== 'LOW' && cameras.length > 0) {
      this._pipeline = new BABYLON.DefaultRenderingPipeline(
        'arenaPipeline',
        false,       // hdr = false: use LDR path for mobile performance
        scene,
        cameras,
      );

      // Disable pipeline image processing — we already applied it above via
      // scene.imageProcessingConfiguration (material shader path).
      // If left true, contrast/exposure would be applied twice.
      this._pipeline.imageProcessingEnabled = false;

      // ── FXAA (MED + HIGH) ────────────────────────────────────────────
      // Single-pass post-process.  Smooths shader jaggies on the water
      // surface and tile grout lines that hardware MSAA cannot reach.
      this._pipeline.fxaaEnabled = true;

      // ── Bloom (HIGH only) ────────────────────────────────────────────
      // Very restrained settings.  Goal: the LED flood housings and the
      // water surface specular should have a barely-perceptible halation —
      // enough to feel like real light scatter, not a neon sign.
      this._pipeline.bloomEnabled = qualityTier === 'HIGH';
      if (qualityTier === 'HIGH') {
        this._pipeline.bloomWeight    = 0.10;  // 10% contribution — subtle
        this._pipeline.bloomThreshold = 0.64;  // activates on bright surfaces only
        this._pipeline.bloomKernel    = 24;    // tight kernel: no spreading halos
        this._pipeline.bloomScale     = 0.50;  // half-resolution bloom texture
      }
    }

    logger.log(
      `[ArenaPostProcess] Built (tier=${qualityTier}, cameras=${cameras.length}, ` +
      `bloom=${qualityTier === 'HIGH'}, fxaa=${qualityTier !== 'LOW'})`,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Runtime camera management
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Add a camera to the pipeline after initial build (e.g. BroadcastCamera).
   * No-op if the pipeline hasn't been created (LOW quality).
   */
  public addCamera(camera: BABYLON.Camera): void {
    this._pipeline?.addCamera(camera);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Runtime quality preset change
  // ─────────────────────────────────────────────────────────────────────────

  public applyQualityPreset(
    tier:    'LOW' | 'MEDIUM' | 'HIGH',
    scene:   BABYLON.Scene,
    cameras: BABYLON.Camera[],
  ): void {
    this.dispose();
    this.build(scene, cameras, tier);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Dispose
  // ─────────────────────────────────────────────────────────────────────────

  public dispose(): void {
    this._pipeline?.dispose();
    this._pipeline = null;
    logger.log('[ArenaPostProcess] Disposed');
  }
}
