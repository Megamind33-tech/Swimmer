/**
 * PoolDeck  —  Phase 2
 * The wet-area concrete surround between the pool edge and the bleacher base.
 *
 * Phase 2 additions over Phase 1:
 *   ✓ Deck slab with visible thickness — a proper 0.45 m concrete slab whose
 *       slab-edge face is readable from side cameras and low poolside angles
 *   ✓ Wet-zone material band — a slightly darker 1.5 m strip along every
 *       pool edge to suggest the constantly-wet splash zone
 *   ✓ Pool ladders — two recessed entry/exit ladders on the east long side
 *       (two vertical rails + four rungs each, stainless steel material)
 *   ✓ Drain-grate strips — thin dark boxes every 3 m along the wet zone,
 *       suggesting drainage channels at deck level
 *
 * Phase 3 will add:
 *   - Non-slip grip-tile PBR texture on deck surface
 *   - Lane-number painted markings behind starting blocks
 *   - Puddle / wet-floor specular map near pool edge
 *   - True gutter recess flush with coping inner edge
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig } from '../../types';
import { logger } from '../../utils';

export class PoolDeck {
  static readonly DECK_MARGIN   = 12;   // deck extends this far beyond pool on each side (m)
  static readonly SLAB_THICKNESS = 0.45; // visible slab depth (m)

  private deckSlab:     BABYLON.Mesh   | null = null;
  private wetZoneMeshes: BABYLON.Mesh[] = [];
  private ladderMeshes:  BABYLON.Mesh[] = [];
  private drainMeshes:   BABYLON.Mesh[] = [];

  private deckMat:    BABYLON.StandardMaterial | null = null;
  private wetMat:     BABYLON.StandardMaterial | null = null;
  private ladderMat:  BABYLON.StandardMaterial | null = null;
  private drainMat:   BABYLON.StandardMaterial | null = null;

  build(scene: BABYLON.Scene, config: IArenaConfig): BABYLON.TransformNode {
    const { poolLength: L, poolWidth: W } = config;
    const M  = PoolDeck.DECK_MARGIN;
    const ST = PoolDeck.SLAB_THICKNESS;

    const root = new BABYLON.TransformNode('PoolDeck', scene);

    // ── Materials ──────────────────────────────────────────────────────────

    // Main deck: competition-pool light concrete grey
    this.deckMat = new BABYLON.StandardMaterial('deckMat', scene);
    this.deckMat.diffuseColor  = new BABYLON.Color3(0.80, 0.82, 0.84);
    this.deckMat.specularColor = new BABYLON.Color3(0.20, 0.20, 0.20);
    this.deckMat.specularPower = 10;

    // Slab-edge face: slightly darker — shaded underside of concrete slab
    const slabEdgeMat = new BABYLON.StandardMaterial('slabEdgeMat', scene);
    slabEdgeMat.diffuseColor  = new BABYLON.Color3(0.62, 0.64, 0.66);
    slabEdgeMat.specularColor = new BABYLON.Color3(0.08, 0.08, 0.08);

    // Wet zone: slightly darker / more saturated grey to suggest wet concrete
    this.wetMat = new BABYLON.StandardMaterial('wetDeckMat', scene);
    this.wetMat.diffuseColor  = new BABYLON.Color3(0.66, 0.70, 0.74);
    this.wetMat.specularColor = new BABYLON.Color3(0.35, 0.35, 0.35);
    this.wetMat.specularPower = 28; // wetter = more specular

    // Ladder rails + rungs: brushed stainless steel
    this.ladderMat = new BABYLON.StandardMaterial('ladderMat', scene);
    this.ladderMat.diffuseColor  = new BABYLON.Color3(0.72, 0.74, 0.76);
    this.ladderMat.specularColor = new BABYLON.Color3(0.85, 0.85, 0.85);
    this.ladderMat.specularPower = 96;

    // Drain grate strips: near-black cast iron
    this.drainMat = new BABYLON.StandardMaterial('drainMat', scene);
    this.drainMat.diffuseColor  = new BABYLON.Color3(0.10, 0.10, 0.11);
    this.drainMat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

    // ── 1. Main deck slab (box with visible thickness) ─────────────────────
    // Top face at y = 0 (deck level), bottom face at y = -ST.
    // Dimensions encompass the full deck footprint MINUS the pool opening.
    // We approximate the pool hole by using a single full slab — the pool
    // basin meshes at lower y simply sit inside it.
    const deckW = W + M * 2;
    const deckL = L + M * 2;

    this.deckSlab = BABYLON.MeshBuilder.CreateBox('deckSlab', {
      width:  deckW,
      height: ST,
      depth:  deckL,
    }, scene);
    this.deckSlab.position.y = -ST / 2; // top face sits at y = 0
    this.deckSlab.material   = this.deckMat;
    this.deckSlab.parent     = root;

    // ── 2. Wet zone bands along each pool edge ─────────────────────────────
    // A 1.5 m wide slightly darker strip on the four deck faces immediately
    // adjacent to the pool.  Sits on top of the deck slab (y = 0.002 to avoid
    // z-fighting with the deck top face).
    const WZ     = 1.5;  // wet-zone width
    const WZ_Y   = 0.004; // float above deck to prevent z-fighting
    const WZ_T   = 0.01;  // thickness of wet-zone box

    const wetDefs = [
      // North strip (along north side of pool, running east-west)
      { n: 'wetN', w: W, h: WZ_T, d: WZ, px: 0,       pz:  L / 2 + WZ / 2 },
      // South strip
      { n: 'wetS', w: W, h: WZ_T, d: WZ, px: 0,       pz: -L / 2 - WZ / 2 },
      // East strip (running north-south the full pool length)
      { n: 'wetE', w: WZ, h: WZ_T, d: L, px:  W / 2 + WZ / 2, pz: 0       },
      // West strip
      { n: 'wetW', w: WZ, h: WZ_T, d: L, px: -W / 2 - WZ / 2, pz: 0       },
    ];

    for (const def of wetDefs) {
      const wz = BABYLON.MeshBuilder.CreateBox(def.n, {
        width: def.w, height: def.h, depth: def.d,
      }, scene);
      wz.position = new BABYLON.Vector3(def.px, WZ_Y, def.pz);
      wz.material = this.wetMat;
      wz.parent   = root;
      this.wetZoneMeshes.push(wz);
    }

    // ── 3. Drain grate strips in wet zone ─────────────────────────────────
    // A 0.12 m wide × 0.6 m long dark bar every ~3 m along the long-side
    // wet zones, suggesting drainage channel grates.
    const GRATE_SPACING = 3.0;
    const GRATE_W       = 0.12;
    const GRATE_L       = 0.55;
    const GRATE_T       = 0.015;
    const grateCount    = Math.floor(L / GRATE_SPACING);
    const GRATE_Y       = WZ_Y + GRATE_T / 2;

    for (const sideX of [W / 2 + WZ / 2, -(W / 2 + WZ / 2)]) {
      for (let gi = 0; gi < grateCount; gi++) {
        const gz = -L / 2 + (gi + 0.5) * (L / grateCount);

        const grate = BABYLON.MeshBuilder.CreateBox(`drain_${sideX.toFixed(0)}_${gi}`, {
          width: GRATE_W, height: GRATE_T, depth: GRATE_L,
        }, scene);
        grate.position = new BABYLON.Vector3(sideX, GRATE_Y, gz);
        grate.material = this.drainMat;
        grate.parent   = root;
        this.drainMeshes.push(grate);
      }
    }

    // ── 4. Pool ladders on east long side ─────────────────────────────────
    // Two ladder pairs at z = ±L/4 (quarter-pool positions).
    // Each ladder: 2 vertical rails + 4 rungs.
    // Rails sit 2 cm off the pool wall inner face so they're not buried.
    const LADDER_Z_POSITIONS = [-L / 4, L / 4];
    const RAIL_X      = W / 2 - 0.02;   // 2 cm from inner east wall face
    const RAIL_SPREAD = 0.40;            // distance between the two parallel rails
    const RAIL_DIAM   = 0.040;
    const RAIL_TOP    =  0.50;           // rails extend above deck for hand-grip
    const RAIL_BOT    = -2.60;           // bottom above pool floor
    const RAIL_H      = RAIL_TOP - RAIL_BOT;

    const RUNG_DIAM   = 0.028;
    const RUNG_W      = RAIL_SPREAD - RAIL_DIAM;
    const RUNG_COUNT  = 4;
    const RUNG_STEP   = (RAIL_BOT + 0.3 - (-0.3)) / -(RUNG_COUNT - 1);

    for (const lz of LADDER_Z_POSITIONS) {
      // Two vertical rails (+Z and -Z offset from centre)
      for (const railZOff of [-RAIL_SPREAD / 2, RAIL_SPREAD / 2]) {
        const rail = BABYLON.MeshBuilder.CreateCylinder(
          `laderRail_${lz.toFixed(0)}_${railZOff.toFixed(2)}`,
          { diameter: RAIL_DIAM, height: RAIL_H, tessellation: 8 },
          scene,
        );
        rail.position = new BABYLON.Vector3(RAIL_X, (RAIL_TOP + RAIL_BOT) / 2, lz + railZOff);
        rail.material = this.ladderMat;
        rail.parent   = root;
        this.ladderMeshes.push(rail);
      }

      // Horizontal rungs
      for (let ri = 0; ri < RUNG_COUNT; ri++) {
        // Space rungs evenly from just below deck to ~80% down
        const ry = RAIL_TOP - 0.30 - ri * Math.abs(RUNG_STEP);

        const rung = BABYLON.MeshBuilder.CreateCylinder(
          `ladderRung_${lz.toFixed(0)}_${ri}`,
          { diameter: RUNG_DIAM, height: RUNG_W, tessellation: 6 },
          scene,
        );
        rung.rotation.z = Math.PI / 2; // lay horizontal
        rung.position   = new BABYLON.Vector3(RAIL_X, ry, lz);
        rung.material   = this.ladderMat;
        rung.parent     = root;
        this.ladderMeshes.push(rung);
      }
    }

    logger.log('[PoolDeck] Built (Phase 2)');
    return root;
  }

  public dispose(): void {
    this.deckSlab?.dispose();
    this.wetZoneMeshes.forEach(m => m.dispose());
    this.ladderMeshes.forEach(m => m.dispose());
    this.drainMeshes.forEach(m => m.dispose());
    this.deckMat?.dispose();
    this.wetMat?.dispose();
    this.ladderMat?.dispose();
    this.drainMat?.dispose();
    logger.log('[PoolDeck] Disposed');
  }
}
