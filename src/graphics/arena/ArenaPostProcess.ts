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
import { getGraphicsCompatibilityProfile, logger } from '../../utils';

export class ArenaPostProcess {

  private _pipeline: BABYLON.DefaultRenderingPipeline | null = null;
  private _compatibility = getGraphicsCompatibilityProfile();

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

    // Contrast: SWIM26 pool tiles are very light (aqua/white) — slight contrast
    // lift separates the navy lane lines from the aqua tiles for photorealism.
    ip.contrast = qualityTier === 'HIGH'   ? 1.10
                : qualityTier === 'MEDIUM' ? 1.05
                : 1.02;

    // Exposure: SWIM26 venue uses high-output LED floods — bright, punchy.
    // Boost slightly to match the reference image brightness level.
    ip.exposure = qualityTier === 'HIGH' ? 1.12 : 1.08;

    // ACES tone mapping (HIGH only) — S-curve that prevents highlight clipping
    // on the bright aqua tiles and water surface while keeping mid-tones clean.
    ip.toneMappingEnabled = qualityTier === 'HIGH';
    if (qualityTier === 'HIGH') {
      ip.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
    }

    // Saturation boost — vivid lane rope colours (blue/red/yellow), punchy aqua
    // pool tiles.  SWIM26 palette is more vivid than classic Olympic grey pools.
    ip.colorCurvesEnabled = qualityTier !== 'LOW';
    if (qualityTier !== 'LOW') {
      const curves = ip.colorCurves ?? new BABYLON.ColorCurves();
      // +12 (MED) / +18 (HIGH) — vivid competition colours without neon look
      curves.globalSaturation = qualityTier === 'HIGH' ? 18 : 12;
      // Slight cool shift (+1.5) to reinforce the aqua/blue water palette
      curves.globalHue = -1.5;
      // Shadows: slight blue lift (like light bouncing off the water surface)
      curves.shadowsHue        = 220;
      curves.shadowsSaturation = qualityTier === 'HIGH' ? 8 : 4;
      ip.colorCurves = curves;
    }

    // ── 2. DefaultRenderingPipeline — MED / HIGH only ─────────────────────
    // hdr=false  : LDR render path — avoids allocating a 16-bit framebuffer.
    //              Saves 2× GPU memory vs the HDR pipeline.  Bloom operates
    //              on clamped LDR values which is slightly less accurate but
    //              completely imperceptible for our restrained bloom settings.
    // Guard: skip the full pipeline when the render target is very small
    // (< 256px on either axis).  Bloom + FXAA on a tiny framebuffer wastes
    // bandwidth, can produce artifacts, and provides no visible benefit.
    // Image processing (contrast/exposure) still applies via scene config above.
    const rw = scene.getEngine().getRenderWidth();
    const rh = scene.getEngine().getRenderHeight();
    const tooSmall = rw < 256 || rh < 256;

    if (
      qualityTier !== 'LOW' &&
      cameras.length > 0 &&
      !tooSmall &&
      this._compatibility.enablePostProcessPipeline
    ) {
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

      // ── Bloom (HIGH + MEDIUM) ─────────────────────────────────────────
      // SWIM26 pool has very bright LED floodlights and light aqua tiles
      // that create natural halation — especially on the water surface and
      // bright lane rope floats.  Slightly more pronounced than before to
      // match the photorealistic reference image glow.
      this._pipeline.bloomEnabled = true; // enabled for both MEDIUM and HIGH
      if (qualityTier === 'HIGH') {
        this._pipeline.bloomWeight    = 0.14;  // subtle but perceptible LED halation
        this._pipeline.bloomThreshold = 0.60;  // activates on aqua tiles + water glints
        this._pipeline.bloomKernel    = 32;    // slightly wider — soft photorealistic glow
        this._pipeline.bloomScale     = 0.50;
      } else if (qualityTier === 'MEDIUM') {
        this._pipeline.bloomWeight    = 0.08;
        this._pipeline.bloomThreshold = 0.68;
        this._pipeline.bloomKernel    = 16;
        this._pipeline.bloomScale     = 0.50;
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
