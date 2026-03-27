/**
 * ArenaArchitecture  —  Phase 6
 * Builds everything above deck level: arena envelope, bleachers, roof trusses,
 * light rig housings, clerestory windows, event branding, and scoreboard.
 *
 * Phase 6 additions over Phase 3:
 *   ✓ Roof truss system — Vierendeel-style steel trusses spanning arena width,
 *       spaced along pool length at flood-light rows and near ends.
 *       Makes the venue read instantly as a sports hall, not an empty box.
 *   ✓ Light rig housings — dark box fixtures hanging below each truss at the
 *       four flood-light X positions, giving the overhead lights a physical source.
 *   ✓ Clerestory window band — tinted glass panels on upper long side walls
 *       (MEDIUM/HIGH) — suggests daylight contribution and adds wall depth.
 *   ✓ Event branding banner — 20 m × 4 m DynamicTexture panel at north pool
 *       end (finish line side), competition identity and venue professionalism.
 *   ✓ Scoreboard backing frame — structural steel surround behind the
 *       existing emissive scoreboard panel, anchors it visually.
 *   ✓ qualityTier parameter added to build() — gates expensive detail.
 *
 * Coordinate convention (shared across all arena modules):
 *   Y = 0    : deck level / water surface
 *   Y = -3   : pool floor
 *   Z = ±25  : pool ends (50 m pool)
 *   X = ±12.5: pool sides (25 m pool)
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig } from '../../types';
import { logger } from '../../utils';
import { ArenaMaterialLibrary } from './ArenaMaterialLibrary';

export class ArenaArchitecture {
  private root:               BABYLON.TransformNode | null = null;
  private meshes:             BABYLON.Mesh[] = [];
  private scoreboard:         BABYLON.Mesh | null = null;
  private scoreboardTexture:  BABYLON.DynamicTexture | null = null;

  // Phase 6 additions — tracked separately for clean disposal
  private trussBeams:         BABYLON.Mesh[] = [];
  private lightHousings:      BABYLON.Mesh[] = [];
  private windowPanels:       BABYLON.Mesh[] = [];
  private brandingMeshes:     BABYLON.Mesh[] = [];
  private bannerTexture:      BABYLON.DynamicTexture | null = null;

  // How far the arena envelope extends beyond the deck on each axis
  static readonly ARENA_MARGIN_X = 22;
  static readonly ARENA_MARGIN_Z = 22;

  build(
    scene:       BABYLON.Scene,
    config:      IArenaConfig,
    matLib:      ArenaMaterialLibrary,
    qualityTier: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM',
  ): BABYLON.TransformNode {
    const { poolLength: L, poolWidth: W, arenaHeight: AH } = config;

    const AW = W + ArenaArchitecture.ARENA_MARGIN_X * 2; // arena total width  = 69 m
    const AL = L + ArenaArchitecture.ARENA_MARGIN_Z * 2; // arena total depth  = 94 m

    this.root = new BABYLON.TransformNode('ArenaArchitecture', scene);

    // ── Materials (from shared library) ───────────────────────────────────
    const ceilingMat   = matLib.arenaCeiling;
    const wallMat      = matLib.arenaWall;
    const wallLowerMat = matLib.arenaWallLower;  // Dark wainscoting
    const stripeMat    = matLib.arenaStripe;     // Olympic blue accent
    const columnMat    = matLib.column;
    const bleacherMat  = matLib.bleacher;
    const seatMat      = matLib.seat;
    const steelMat     = matLib.arenaSteel;  // Phase 6
    const glassMat     = matLib.arenaGlass;  // Phase 6

    // ── Ceiling ───────────────────────────────────────────────────────────
    const ceiling = BABYLON.MeshBuilder.CreateBox('arenaCeiling', {
      width: AW + 2, height: 1.8, depth: AL + 2,
    }, scene);
    ceiling.position.y = AH + 0.9;
    ceiling.material   = ceilingMat;
    ceiling.parent     = this.root;
    this.meshes.push(ceiling);

    // ── Perimeter walls with wainscoting and accent stripes ─────────────────
    const WALL_LOWER_H = 2.4;  // Wainscoting height
    const STRIPE_H     = 0.25; // Accent stripe thickness
    
    const wallDefs = [
      { name: 'arenaWallN', w: AW,  h: AH, d: 1.2, px: 0,       pz:  AL / 2,  side: 'N' },
      { name: 'arenaWallS', w: AW,  h: AH, d: 1.2, px: 0,       pz: -AL / 2,  side: 'S' },
      { name: 'arenaWallE', w: 1.2, h: AH, d: AL,  px:  AW / 2, pz: 0,        side: 'E' },
      { name: 'arenaWallW', w: 1.2, h: AH, d: AL,  px: -AW / 2, pz: 0,        side: 'W' },
    ];
    
    for (const def of wallDefs) {
      // Main upper wall (painted light color)
      const upperH = def.h - WALL_LOWER_H;
      const upper = BABYLON.MeshBuilder.CreateBox(`${def.name}_upper`, {
        width: def.w, height: upperH, depth: def.d,
      }, scene);
      upper.position = new BABYLON.Vector3(def.px, WALL_LOWER_H + upperH / 2, def.pz);
      upper.material = wallMat;
      upper.parent   = this.root;
      this.meshes.push(upper);

      // Lower wainscoting (dark band)
      const lower = BABYLON.MeshBuilder.CreateBox(`${def.name}_lower`, {
        width: def.w, height: WALL_LOWER_H, depth: def.d * 0.5,
      }, scene);
      lower.position = new BABYLON.Vector3(def.px, WALL_LOWER_H / 2, def.pz);
      lower.material = wallLowerMat;
      lower.parent   = this.root;
      this.meshes.push(lower);

      // Accent stripe at wainscoting top
      const stripe = BABYLON.MeshBuilder.CreateBox(`${def.name}_stripe`, {
        width: def.w * 1.001, height: STRIPE_H, depth: def.d * 0.6,
      }, scene);
      stripe.position = new BABYLON.Vector3(def.px, WALL_LOWER_H + STRIPE_H / 2, def.pz);
      stripe.material = stripeMat;
      stripe.parent   = this.root;
      this.meshes.push(stripe);

      // Lane number signage on side walls (E and W)
      if (def.side === 'E' || def.side === 'W') {
        this._buildLaneSignage(scene, def, AW, AL, config, stripeMat);
      }
    }

    // ── Support columns along both long sides ─────────────────────────────
    const COL_SPACING = 10;
    const COL_SIDE_X  = W / 2 + 14;
    const numCols     = Math.max(2, Math.round(L / COL_SPACING) + 1);

    for (const sideSign of [-1, 1]) {
      for (let ci = 0; ci < numCols; ci++) {
        const colZ = -L / 2 + ci * (L / (numCols - 1));
        const col  = BABYLON.MeshBuilder.CreateCylinder(`col${sideSign}_${ci}`, {
          diameter:     0.80,
          height:       AH,
          tessellation: 10,
        }, scene);
        col.position = new BABYLON.Vector3(sideSign * COL_SIDE_X, AH / 2, colZ);
        col.material = columnMat;
        col.parent   = this.root;
        this.meshes.push(col);
      }
    }

    // ── Side bleachers (stepped rows, long sides) ─────────────────────────
    const SIDE_ROWS   = 10;
    const ROW_DEPTH   = 1.0;
    const ROW_HEIGHT  = 0.50;
    const SEAT_WIDTH  = 0.72;
    const DECK_MARGIN = 12; // matches PoolDeck.DECK_MARGIN

    for (const baseSign of [-1, 1]) {
      const baseX = baseSign * (W / 2 + DECK_MARGIN - 1);

      for (let row = 0; row < SIDE_ROWS; row++) {
        const stepX  = baseX + baseSign * row * ROW_DEPTH;
        const riserH = (row + 1) * ROW_HEIGHT;

        const riser = BABYLON.MeshBuilder.CreateBox(`sideRiser${baseSign}_${row}`, {
          width:  ROW_DEPTH,
          height: riserH,
          depth:  L + 6,
        }, scene);
        riser.position = new BABYLON.Vector3(stepX, riserH / 2, 0);
        riser.material = bleacherMat;
        riser.parent   = this.root;
        this.meshes.push(riser);

        // Seat tops on each riser (skip on LOW to reduce mesh count)
        if (qualityTier !== 'LOW') {
          const seatCount = Math.floor((L + 6) / SEAT_WIDTH);
          for (let si = 0; si < seatCount; si++) {
            const sz   = -(L + 6) / 2 + (si + 0.5) * SEAT_WIDTH;
            const seat = BABYLON.MeshBuilder.CreateBox(`sideSeat${baseSign}_${row}_${si}`, {
              width:  SEAT_WIDTH - 0.06,
              height: 0.09,
              depth:  ROW_DEPTH * 0.78,
            }, scene);
            seat.position = new BABYLON.Vector3(stepX, riserH + 0.045, sz);
            seat.material = seatMat;
            seat.parent   = this.root;
            this.meshes.push(seat);
          }
        }
      }
    }

    // ── End bleachers (north + south short ends) ──────────────────────────
    const END_ROWS = 6;
    const endDefs  = [
      { dir:  1, baseZ:  L / 2 + DECK_MARGIN - 1 },
      { dir: -1, baseZ: -(L / 2 + DECK_MARGIN - 1) },
    ];
    for (const ep of endDefs) {
      for (let row = 0; row < END_ROWS; row++) {
        const stepZ  = ep.baseZ + ep.dir * row * ROW_DEPTH;
        const riserH = (row + 1) * ROW_HEIGHT;
        const riser  = BABYLON.MeshBuilder.CreateBox(`endRiser${ep.dir}_${row}`, {
          width:  W + 26,
          height: riserH,
          depth:  ROW_DEPTH,
        }, scene);
        riser.position = new BABYLON.Vector3(0, riserH / 2, stepZ);
        riser.material = bleacherMat;
        riser.parent   = this.root;
        this.meshes.push(riser);
      }
    }

    // ── Scoreboard + surround ─────────────────────────────────────────────
    this._buildScoreboard(scene, config, steelMat);

    // ─── Phase 6 additions ────────────────────────────────────────────────
    this._buildRoofTrusses(scene, config, AW, AH, steelMat, qualityTier);
    this._buildLightHousings(scene, config, AH, steelMat, qualityTier);
    if (qualityTier !== 'LOW') {
      this._buildClerestoryWindows(scene, AW, AL, AH, glassMat);
    }
    this._buildEventBranding(scene, config);

    logger.log(`[ArenaArchitecture] Built Phase 6 (quality=${qualityTier})`);
    return this.root!;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 6: Roof trusses
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Vierendeel roof trusses spanning arena width (X direction), spaced along
   * pool length (Z direction).
   *
   * Each truss:
   *   • Top chord  — horizontal beam at y = AH - 3.0 (sits just below ceiling)
   *   • Bottom chord — horizontal beam at y = AH - 5.8 (flood-light level)
   *   • 3 web posts — vertical struts connecting chords at ±AW/3 and centre
   *
   * HIGH/MEDIUM: 4 trusses (2 above flood-light rows + 2 near pool ends)
   * LOW:         2 trusses at flood-light rows only
   *
   * The bottom chord aligns with the overhead flood lights (y = AH - 6) so the
   * light rig housings appear to hang directly off the truss structure.
   */
  private _buildRoofTrusses(
    scene:       BABYLON.Scene,
    config:      IArenaConfig,
    AW:          number,
    AH:          number,
    mat:         BABYLON.PBRMaterial,
    qualityTier: 'LOW' | 'MEDIUM' | 'HIGH',
  ): void {
    const L = config.poolLength;

    const TOP_Y    = AH - 3.0;  // top chord centre Y
    const BOT_Y    = AH - 5.8;  // bottom chord centre Y
    const TRUSS_H  = TOP_Y - BOT_Y; // = 2.8 m

    const CHORD_W  = 0.40; // chord section size
    const POST_W   = 0.30; // web post section size

    // Z positions: 2 trusses above flood lights (Z=±L/4), 2 near ends (Z=±3L/8)
    const trussZs = qualityTier === 'LOW'
      ? [-L / 4, L / 4]
      : [-L * 3 / 8, -L / 4, L / 4, L * 3 / 8];

    for (const tz of trussZs) {
      // Top chord
      const top = BABYLON.MeshBuilder.CreateBox(`trussTop_${tz.toFixed(0)}`, {
        width: AW, height: CHORD_W, depth: CHORD_W,
      }, scene);
      top.position = new BABYLON.Vector3(0, TOP_Y, tz);
      top.material = mat;
      top.parent   = this.root;
      this.trussBeams.push(top);

      // Bottom chord
      const bot = BABYLON.MeshBuilder.CreateBox(`trussBot_${tz.toFixed(0)}`, {
        width: AW, height: CHORD_W * 0.85, depth: CHORD_W * 0.85,
      }, scene);
      bot.position = new BABYLON.Vector3(0, BOT_Y, tz);
      bot.material = mat;
      bot.parent   = this.root;
      this.trussBeams.push(bot);

      // 3 vertical web posts at centre and ±AW/3
      const postXs = [0, -AW / 3, AW / 3];
      for (const px of postXs) {
        const post = BABYLON.MeshBuilder.CreateBox(
          `trussPost_${tz.toFixed(0)}_${px.toFixed(0)}`, {
            width:  POST_W,
            height: TRUSS_H,
            depth:  POST_W,
          }, scene);
        post.position = new BABYLON.Vector3(px, (TOP_Y + BOT_Y) / 2, tz);
        post.material = mat;
        post.parent   = this.root;
        this.trussBeams.push(post);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 6: Light rig housings
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Box-shaped fixture housings hanging below the truss bottom chords.
   * Placed at the same X positions as the overhead SpotLights defined in
   * ArenaLighting (±poolWidth×0.15 and ±poolWidth×0.41).
   *
   * Only built for the two trusses directly above the flood light rows
   * (Z = ±L/4) so every housing has a real light below it.
   * On LOW quality, no housings are built.
   */
  private _buildLightHousings(
    scene:       BABYLON.Scene,
    config:      IArenaConfig,
    AH:          number,
    mat:         BABYLON.PBRMaterial,
    qualityTier: 'LOW' | 'MEDIUM' | 'HIGH',
  ): void {
    if (qualityTier === 'LOW') return;

    const { poolLength: L, poolWidth: W } = config;
    const HOUSING_Y = AH - 5.8 - 0.22; // hang below bottom chord

    // X positions matching ArenaLighting flood positions (±W×0.41, ±W×0.15)
    const housingXs  = [-W * 0.41, -W * 0.15, W * 0.15, W * 0.41];
    // Only on the trusses above flood light rows
    const housingZs  = [-L / 4, L / 4];

    for (const hz of housingZs) {
      for (const hx of housingXs) {
        const housing = BABYLON.MeshBuilder.CreateBox(
          `lightHousing_${hx.toFixed(0)}_${hz.toFixed(0)}`, {
            width:  0.80,
            height: 0.40,
            depth:  0.60,
          }, scene);
        housing.position = new BABYLON.Vector3(hx, HOUSING_Y, hz);
        housing.material = mat;
        housing.parent   = this.root;
        this.lightHousings.push(housing);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 6: Clerestory window band
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Tinted glass panels on the upper section of the east and west long walls.
   * Positioned just inside the wall surface at y = AH - 9 to AH - 5 (4 m band).
   * Suggests high windows that admit natural daylight — reinforces the indoor
   * natatorium feel without requiring a fully modelled window system.
   *
   * 5 panels per side, each ~8 m wide, with narrow steel mullions between them.
   * Built only on MEDIUM / HIGH quality.
   */
  private _buildClerestoryWindows(
    scene:  BABYLON.Scene,
    AW:     number,
    AL:     number,
    AH:     number,
    mat:    BABYLON.PBRMaterial,
  ): void {
    const WIN_H   = 4.0;              // window band height
    const WIN_Y   = AH - 7.0;        // centre Y of window band
    const WIN_W   = 8.0;             // each panel width
    const WIN_T   = 0.12;            // panel thickness
    const INNER_X = AW / 2 - 0.66;  // just inside wall inner face

    const panelCount = 5;
    // Distribute panels evenly across middle 80% of wall length
    const span    = AL * 0.80;
    const spacing = span / (panelCount - 1);
    const startZ  = -span / 2;

    for (const sideSign of [-1, 1]) {
      for (let pi = 0; pi < panelCount; pi++) {
        const pz = startZ + pi * spacing;

        const panel = BABYLON.MeshBuilder.CreateBox(
          `clerestory_${sideSign}_${pi}`, {
            width:  WIN_T,
            height: WIN_H,
            depth:  WIN_W,
          }, scene);
        panel.position = new BABYLON.Vector3(sideSign * INNER_X, WIN_Y, pz);
        panel.material = mat;
        panel.parent   = this.root;
        this.windowPanels.push(panel);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Lane number signage on side walls
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Builds lane number signage on the East and West arena walls.
   * Creates large visible numbers 1-8 corresponding to the pool lanes,
   * positioned to be visible from broadcast cameras and spectators.
   */
  private _buildLaneSignage(
    scene:     BABYLON.Scene,
    wallDef:   { name: string; w: number; h: number; d: number; px: number; pz: number; side: string },
    AW:        number,
    AL:        number,
    config:    IArenaConfig,
    accentMat: BABYLON.PBRMaterial,
  ): void {
    const { poolWidth: W, laneCount: LC } = config;
    const laneWidth = W / LC;
    const SIGN_H = 1.8;   // Sign height
    const SIGN_W = 1.2;   // Sign width
    const SIGN_Y = 4.5;   // Height on wall

    // Calculate the wall offset (how far the wall is from pool center)
    const wallX = wallDef.px;
    const signDepth = wallDef.side === 'E' ? -0.3 : 0.3; // Offset slightly inward from wall

    // Create lane number signs
    for (let lane = 0; lane < LC; lane++) {
      const laneX = -W / 2 + (lane + 0.5) * laneWidth;
      
      // Create textured sign with lane number
      const signTex = this._createLaneNumberTexture(scene, lane + 1);
      const signMat = new BABYLON.StandardMaterial(`laneSignMat_${lane}`, scene);
      signMat.emissiveTexture = signTex;
      signMat.emissiveColor = new BABYLON.Color3(0.9, 0.95, 1.0);
      signMat.backFaceCulling = false;

      const sign = BABYLON.MeshBuilder.CreateBox(`laneSign_${wallDef.side}_${lane + 1}`, {
        width: SIGN_W,
        height: SIGN_H,
        depth: 0.08,
      }, scene);

      sign.position = new BABYLON.Vector3(wallX + signDepth, SIGN_Y, laneX);
      sign.material = signMat;
      sign.parent = this.root;
      this.brandingMeshes.push(sign);
    }
  }

  /**
   * Creates a dynamic texture with the lane number displayed prominently.
   * Olympic-style design with bold white numbers on dark blue background.
   */
  private _createLaneNumberTexture(scene: BABYLON.Scene, laneNum: number): BABYLON.DynamicTexture {
    const tex = new BABYLON.DynamicTexture(`laneNumTex_${laneNum}`, { width: 128, height: 192 }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    // Dark Olympic blue background
    ctx.fillStyle = '#0a2540';
    ctx.fillRect(0, 0, 128, 192);

    // White border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, 116, 180);

    // Lane number - large bold white text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 100px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(laneNum), 64, 96);

    // "LANE" label at bottom
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.fillStyle = '#55aaff';
    ctx.fillText('LANE', 64, 170);

    tex.update();
    return tex;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 6: Event branding
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Large event banner at the north end wall (finish-line side), visible from
   * the broadcast side-camera looking down the pool.
   * A 20 m × 4 m DynamicTexture panel with competition identity text:
   *   "WORLD AQUATICS" (primary)   "SWIMMING CHAMPIONSHIPS" (secondary)
   *
   * The banner is mounted on the inside face of the north end bleacher/wall,
   * above head height, facing south (camera direction for finish coverage).
   *
   * A matching but slightly smaller banner is placed at the south end (start)
   * facing north.
   */
  private _buildEventBranding(
    scene:  BABYLON.Scene,
    config: IArenaConfig,
  ): void {
    const { poolLength: L } = config;
    const MARGIN = ArenaArchitecture.ARENA_MARGIN_Z;

    this.bannerTexture = this._makeBannerTexture(scene);

    const bannerMat = new BABYLON.StandardMaterial('bannerMat', scene);
    bannerMat.emissiveTexture = this.bannerTexture;
    bannerMat.emissiveColor   = new BABYLON.Color3(1, 1, 1);
    bannerMat.backFaceCulling = false;

    // North end: finish side — primary broadcast view, full 20 m banner
    const bannerN = BABYLON.MeshBuilder.CreateBox('eventBannerN', {
      width:  20.0,
      height:  4.0,
      depth:   0.15,
    }, scene);
    bannerN.position = new BABYLON.Vector3(0, 7.0, L / 2 + MARGIN * 0.55);
    bannerN.material = bannerMat;
    bannerN.parent   = this.root;
    this.brandingMeshes.push(bannerN);

    // South end: start side — slightly smaller, mirrors the north
    const bannerS = BABYLON.MeshBuilder.CreateBox('eventBannerS', {
      width:  16.0,
      height:  3.4,
      depth:   0.15,
    }, scene);
    bannerS.position  = new BABYLON.Vector3(0, 6.5, -(L / 2 + MARGIN * 0.55));
    bannerS.rotation.y = Math.PI; // face inward
    bannerS.material  = bannerMat;
    bannerS.parent    = this.root;
    this.brandingMeshes.push(bannerS);
  }

  /**
   * Competition event banner DynamicTexture.
   * Dark navy background, bold white/cyan text — instantly reads as elite
   * competition venue without relying on external assets.
   */
  private _makeBannerTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
    const W   = 1024;
    const H   = 204;
    const tex = new BABYLON.DynamicTexture('bannerTex', { width: W, height: H }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    // Background — dark competition navy
    ctx.fillStyle = '#04101e';
    ctx.fillRect(0, 0, W, H);

    // Top accent stripe — brand blue
    ctx.fillStyle = '#0066cc';
    ctx.fillRect(0, 0, W, 14);

    // Bottom accent stripe
    ctx.fillRect(0, H - 14, W, 14);

    // Primary text — organisation name
    ctx.fillStyle = '#ffffff';
    ctx.font      = 'bold 72px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WORLD AQUATICS', W / 2, H * 0.38);

    // Secondary text — event name
    ctx.fillStyle = '#55bbff';
    ctx.font      = 'bold 40px Arial, sans-serif';
    ctx.fillText('SWIMMING CHAMPIONSHIPS', W / 2, H * 0.72);

    tex.update();
    return tex;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Scoreboard + structural surround
  // ─────────────────────────────────────────────────────────────────────────

  private _buildScoreboard(
    scene:    BABYLON.Scene,
    config:   IArenaConfig,
    steelMat: BABYLON.PBRMaterial,
  ): void {
    const L = config.poolLength;
    const SB_Z = L / 2 + 2.5;

    // Backing frame — dark steel surround, slightly larger than the LED panel
    const frame = BABYLON.MeshBuilder.CreateBox('scoreboardFrame', {
      width:  23.5,
      height: 11.2,
      depth:  0.45,
    }, scene);
    frame.position = new BABYLON.Vector3(0, 14, SB_Z + 0.30);
    frame.material = steelMat;
    frame.parent   = this.root;
    this.meshes.push(frame);

    // LED display panel
    this.scoreboard = BABYLON.MeshBuilder.CreateBox('scoreboard', {
      width: 22, height: 10, depth: 0.8,
    }, scene);
    this.scoreboard.position = new BABYLON.Vector3(0, 14, SB_Z);

    this.scoreboardTexture = new BABYLON.DynamicTexture(
      'scoreboardTex', { width: 1024, height: 512 }, scene);
    this._clearScoreboard();

    const sbMat = new BABYLON.StandardMaterial('scoreboardMat', scene);
    sbMat.emissiveTexture = this.scoreboardTexture;
    sbMat.emissiveColor   = new BABYLON.Color3(1, 1, 1);
    this.scoreboard.material = sbMat;
    this.scoreboard.parent   = this.root;
    this.meshes.push(this.scoreboard);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Scoreboard content helpers
  // ─────────────────────────────────────────────────────────────────────────

  private _clearScoreboard(): void {
    if (!this.scoreboardTexture) return;
    const ctx = this.scoreboardTexture.getContext() as unknown as CanvasRenderingContext2D;
    ctx.fillStyle = '#010b14';
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = '#00e5ff';
    ctx.font      = 'bold 64px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SWIMMER', 512, 120);
    this.scoreboardTexture.update();
  }

  public updateScoreboard(
    leaderboard: Array<{ rank: number; name: string; time: number }>,
  ): void {
    if (!this.scoreboardTexture) return;
    const ctx = this.scoreboardTexture.getContext() as unknown as CanvasRenderingContext2D;

    ctx.fillStyle = '#010b14';
    ctx.fillRect(0, 0, 1024, 512);

    ctx.fillStyle = '#00e5ff';
    ctx.font      = 'bold 40px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('RESULTS', 40, 60);

    const medals = ['#FFD700', '#C0C0C0', '#CD7F32'];
    leaderboard.slice(0, 3).forEach((entry, i) => {
      const y = 120 + i * 120;
      ctx.fillStyle = medals[i] ?? '#ffffff';
      ctx.font      = 'bold 44px monospace';
      ctx.fillText(`${entry.rank}. ${entry.name}`, 40, y);
      ctx.fillStyle = '#ffffff';
      ctx.font      = '34px monospace';
      ctx.fillText(entry.time.toFixed(2) + 's', 40, y + 52);
    });

    this.scoreboardTexture.update();
  }

  public getScoreboard(): BABYLON.Mesh | null { return this.scoreboard; }

  // ─────────────────────────────────────────────────────────────────────────
  // Dispose
  // ─────────────────────────────────────────────────────────────────────────

  public dispose(): void {
    this.scoreboardTexture?.dispose();
    this.bannerTexture?.dispose();
    this.meshes.forEach(m => m.dispose());
    this.trussBeams.forEach(m => m.dispose());
    this.lightHousings.forEach(m => m.dispose());
    this.windowPanels.forEach(m => m.dispose());
    this.brandingMeshes.forEach(m => m.dispose());
    this.root?.dispose();
    logger.log('[ArenaArchitecture] Disposed');
  }
}
