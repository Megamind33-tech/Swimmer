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

  // SWIM26 branding — separate disposal list
  private swim26Textures:     BABYLON.DynamicTexture[] = [];
  private timingBoardTextures: BABYLON.DynamicTexture[] = [];

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
    this._buildSWIM26Branding(scene, config);
    this._buildTimingDisplayBoards(scene, config, steelMat);

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
  // SWIM26 Branding — back wall logo (matches reference image exactly)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Builds the prominent SWIM26 logo on the back (north finish) wall,
   * exactly as shown in the reference image:
   *   - Light grey/white painted wall surface
   *   - "SWIM26" dark navy lettering with swimmer silhouette icon
   *   - Centered, high on the wall, visible from the full pool length
   *
   * Also places a smaller sponsor banner at the south (start) end.
   */
  private _buildSWIM26Branding(
    scene:  BABYLON.Scene,
    config: IArenaConfig,
  ): void {
    const { poolLength: L } = config;
    const MARGIN = ArenaArchitecture.ARENA_MARGIN_Z;

    // ── Main SWIM26 logo on north (finish) wall ───────────────────────────
    const logoTex = this._makeSwim26LogoTexture(scene);
    this.swim26Textures.push(logoTex);

    const logoMat = new BABYLON.StandardMaterial('swim26LogoMat', scene);
    logoMat.emissiveTexture = logoTex;
    logoMat.emissiveColor   = new BABYLON.Color3(1, 1, 1);
    logoMat.backFaceCulling = false;
    logoMat.disableLighting = true;

    // Large logo panel on the north wall — 12 m wide, 4 m tall
    const logoPanel = BABYLON.MeshBuilder.CreateBox('swim26Logo', {
      width:  12.0,
      height:  4.0,
      depth:   0.12,
    }, scene);
    logoPanel.position = new BABYLON.Vector3(0, 11.0, L / 2 + MARGIN * 0.55);
    logoPanel.material = logoMat;
    logoPanel.parent   = this.root;
    this.brandingMeshes.push(logoPanel);

    // ── SWIM26 sponsor strip along the top of the pool side walls ─────────
    const stripTex = this._makeSwim26StripTexture(scene);
    this.swim26Textures.push(stripTex);

    const stripMat = new BABYLON.StandardMaterial('swim26StripMat', scene);
    stripMat.emissiveTexture = stripTex;
    stripMat.emissiveColor   = new BABYLON.Color3(1, 1, 1);
    stripMat.backFaceCulling = false;
    stripMat.disableLighting = true;

    // Lane rope banners along the pool top edge (2 long sides)
    const { poolWidth: W } = config;
    const AW = W + ArenaArchitecture.ARENA_MARGIN_X * 2;

    for (const sideZ of [-1, 1]) {
      const strip = BABYLON.MeshBuilder.CreateBox(`swim26Strip_${sideZ}`, {
        width:  L * 0.80,
        height: 0.80,
        depth:  0.08,
      }, scene);
      strip.position = new BABYLON.Vector3(0, 4.2, sideZ * (W / 2 + 0.60));
      strip.material = stripMat;
      strip.parent   = this.root;
      this.brandingMeshes.push(strip);
    }

    // ── South (start) end — matching smaller brand banner ─────────────────
    const startBannerTex = this._makeSwim26StartBannerTexture(scene);
    this.swim26Textures.push(startBannerTex);

    const startBannerMat = new BABYLON.StandardMaterial('swim26StartMat', scene);
    startBannerMat.emissiveTexture = startBannerTex;
    startBannerMat.emissiveColor   = new BABYLON.Color3(1, 1, 1);
    startBannerMat.backFaceCulling = false;
    startBannerMat.disableLighting = true;

    const startBanner = BABYLON.MeshBuilder.CreateBox('swim26StartBanner', {
      width:  10.0,
      height:  3.2,
      depth:   0.12,
    }, scene);
    startBanner.position  = new BABYLON.Vector3(0, 10.0, -(L / 2 + MARGIN * 0.55));
    startBanner.rotation.y = Math.PI;
    startBanner.material  = startBannerMat;
    startBanner.parent    = this.root;
    this.brandingMeshes.push(startBanner);
  }

  /**
   * SWIM26 main logo texture.
   * Recreates the branding from the reference image:
   *   - White/light-grey background
   *   - Dark navy "SWIM26" wordmark (bold, wide tracking)
   *   - Stylised swimmer silhouette between "SWIM" and "26"
   */
  private _makeSwim26LogoTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
    const W   = 1024;
    const H   = 340;
    const tex = new BABYLON.DynamicTexture('swim26LogoTex', { width: W, height: H }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    // Background — clean white (matches the light arena wall)
    ctx.fillStyle = '#f0f2f4';
    ctx.fillRect(0, 0, W, H);

    // Draw swimmer silhouette icon (stylised, matches logo in image)
    this._drawSwimmerIcon(ctx, W / 2, H / 2 - 20, 64);

    // "SWIM" — left of icon
    ctx.fillStyle    = '#0a1428';
    ctx.font         = 'bold 130px "Arial Black", Arial, sans-serif';
    ctx.textAlign    = 'right';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '2px';
    ctx.fillText('SWIM', W / 2 - 62, H / 2 - 12);

    // "26." — right of icon (slightly different weight)
    ctx.fillStyle    = '#0a1428';
    ctx.font         = 'bold 130px "Arial Black", Arial, sans-serif';
    ctx.textAlign    = 'left';
    ctx.fillText('26.', W / 2 + 56, H / 2 - 12);

    // Registered trademark symbol
    ctx.font      = '28px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0a1428';
    ctx.fillText('™', W / 2 + 240, H / 2 - 72);

    tex.update();
    return tex;
  }

  /**
   * Draw a stylised swimmer silhouette icon (diver/freestyle position)
   * matching the SWIM26 logo graphic in the reference image.
   */
  private _drawSwimmerIcon(
    ctx:   CanvasRenderingContext2D,
    cx:    number,
    cy:    number,
    size:  number,
  ): void {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#0a1428';

    // Body — elongated ellipse at diving angle
    ctx.save();
    ctx.rotate(-0.35);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.42, size * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Head — small circle at the front
    ctx.beginPath();
    ctx.arc(size * 0.32, -size * 0.28, size * 0.10, 0, Math.PI * 2);
    ctx.fill();

    // Arms — extended forward (two thin arcs)
    ctx.save();
    ctx.rotate(-0.30);
    ctx.beginPath();
    ctx.moveTo(size * 0.20, -size * 0.04);
    ctx.bezierCurveTo(size * 0.40, -size * 0.16, size * 0.55, -size * 0.22, size * 0.65, -size * 0.18);
    ctx.lineWidth = size * 0.07;
    ctx.strokeStyle = '#0a1428';
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    // Legs — trailing behind
    ctx.save();
    ctx.rotate(-0.30);
    ctx.beginPath();
    ctx.moveTo(-size * 0.35, size * 0.02);
    ctx.bezierCurveTo(-size * 0.50, size * 0.14, -size * 0.55, size * 0.20, -size * 0.62, size * 0.12);
    ctx.lineWidth = size * 0.06;
    ctx.strokeStyle = '#0a1428';
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  /**
   * Long horizontal strip texture for poolside sponsor signage ("SWIM26 | SWIM26 |…")
   */
  private _makeSwim26StripTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
    const W   = 2048;
    const H   = 128;
    const tex = new BABYLON.DynamicTexture('swim26StripTex', { width: W, height: H }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    // Navy blue background strip
    ctx.fillStyle = '#04101e';
    ctx.fillRect(0, 0, W, H);

    // Top + bottom white accent lines
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0,      W, 6);
    ctx.fillRect(0, H - 6, W, 6);

    // Repeating SWIM26 text
    ctx.fillStyle = '#ffffff';
    ctx.font      = 'bold 56px Arial, sans-serif';
    ctx.textBaseline = 'middle';
    const repeat = 6;
    const step   = W / repeat;
    for (let i = 0; i < repeat; i++) {
      ctx.textAlign = 'center';
      ctx.fillText('SWIM26', step * (i + 0.5), H / 2);
    }

    tex.update();
    return tex;
  }

  /**
   * South-end start banner ("SWIM26" on dark navy — matches competitor banners in image)
   */
  private _makeSwim26StartBannerTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
    const W   = 1024;
    const H   = 320;
    const tex = new BABYLON.DynamicTexture('swim26StartBannerTex', { width: W, height: H }, scene, false);
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    ctx.fillStyle = '#04101e';
    ctx.fillRect(0, 0, W, H);

    // Accent stripes
    ctx.fillStyle = '#1155cc';
    ctx.fillRect(0, 0,      W, 12);
    ctx.fillRect(0, H - 12, W, 12);

    ctx.fillStyle    = '#ffffff';
    ctx.font         = 'bold 120px "Arial Black", Arial, sans-serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SWIM26', W / 2, H * 0.42);

    ctx.font      = 'bold 36px Arial, sans-serif';
    ctx.fillStyle = '#55aaff';
    ctx.fillText('COMPETITION SWIMMING', W / 2, H * 0.76);

    tex.update();
    return tex;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Timing Display Boards (above starting blocks)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Per-lane timing display boards mounted above the starting block end,
   * exactly as visible in the reference image:
   *   - Blue rectangular panels, one per lane
   *   - Shows lane number ("26" styling) and "SWIM26" branding
   *   - Mounted on stainless steel frames about 2.2 m above deck level
   *
   * These are the white/blue boards visible just behind the starting blocks.
   */
  private _buildTimingDisplayBoards(
    scene:    BABYLON.Scene,
    config:   IArenaConfig,
    steelMat: BABYLON.PBRMaterial,
  ): void {
    const { poolLength: L, poolWidth: W, laneCount: LC } = config;
    const laneWidth = W / LC;

    // Display board dimensions — matches image proportions
    const BOARD_W  = laneWidth * 0.82;
    const BOARD_H  = 0.50;
    const BOARD_D  = 0.08;
    const BOARD_Y  = 2.40;   // height above deck
    const BOARD_Z  = -L / 2 - 0.30;  // just behind starting block

    // Support post height
    const POST_H   = BOARD_Y + BOARD_H / 2;
    const POST_DIAM = 0.04;

    for (let lane = 0; lane < LC; lane++) {
      const laneX = -W / 2 + (lane + 0.5) * laneWidth;

      // ── Support post ──────────────────────────────────────────────────
      const post = BABYLON.MeshBuilder.CreateCylinder(
        `timingPost_${lane}`,
        { diameter: POST_DIAM, height: POST_H, tessellation: 8 },
        scene,
      );
      post.position = new BABYLON.Vector3(laneX, POST_H / 2, BOARD_Z);
      post.material = steelMat;
      post.parent   = this.root;
      this.meshes.push(post);

      // ── Display board panel ───────────────────────────────────────────
      const boardTex = this._makeTimingBoardTexture(scene, lane + 1);
      this.timingBoardTextures.push(boardTex);

      const boardMat = new BABYLON.StandardMaterial(`timingBoardMat_${lane}`, scene);
      boardMat.emissiveTexture = boardTex;
      boardMat.emissiveColor   = new BABYLON.Color3(1, 1, 1);
      boardMat.disableLighting = true;

      const board = BABYLON.MeshBuilder.CreateBox(`timingBoard_${lane}`, {
        width:  BOARD_W,
        height: BOARD_H,
        depth:  BOARD_D,
      }, scene);
      board.position = new BABYLON.Vector3(laneX, BOARD_Y, BOARD_Z);
      board.material = boardMat;
      board.parent   = this.root;
      this.meshes.push(board);

      // Horizontal cross-bar connecting post to board edges
      const bar = BABYLON.MeshBuilder.CreateBox(`timingBar_${lane}`, {
        width:  BOARD_W,
        height: POST_DIAM,
        depth:  POST_DIAM,
      }, scene);
      bar.position = new BABYLON.Vector3(laneX, BOARD_Y - BOARD_H / 2 - POST_DIAM / 2, BOARD_Z);
      bar.material = steelMat;
      bar.parent   = this.root;
      this.meshes.push(bar);
    }
  }

  /**
   * Per-lane timing board texture — matches the blue SWIM26-branded boards
   * visible above starting blocks in the reference image.
   */
  private _makeTimingBoardTexture(scene: BABYLON.Scene, laneNum: number): BABYLON.DynamicTexture {
    const TW = 512;
    const TH = 256;
    const tex = new BABYLON.DynamicTexture(
      `timingBoardTex_${laneNum}`, { width: TW, height: TH }, scene, false,
    );
    const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;

    // Navy blue background
    ctx.fillStyle = '#04101e';
    ctx.fillRect(0, 0, TW, TH);

    // Top accent stripe — bright blue
    ctx.fillStyle = '#1a5aee';
    ctx.fillRect(0, 0, TW, 18);
    ctx.fillRect(0, TH - 18, TW, 18);

    // SWIM26 brand (top small text)
    ctx.fillStyle    = '#aaccff';
    ctx.font         = 'bold 32px Arial, sans-serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('SWIM26', TW / 2, 26);

    // Large lane number — bright white, bold
    ctx.fillStyle    = '#ffffff';
    ctx.font         = 'bold 150px "Arial Black", Arial, sans-serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(laneNum), TW / 2, TH / 2 + 14);

    // Lane label at bottom
    ctx.fillStyle    = '#6699cc';
    ctx.font         = 'bold 26px Arial, sans-serif';
    ctx.textBaseline = 'bottom';
    ctx.fillText('LANE', TW / 2, TH - 24);

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
    this.swim26Textures.forEach(t => t.dispose());
    this.timingBoardTextures.forEach(t => t.dispose());
    this.meshes.forEach(m => m.dispose());
    this.trussBeams.forEach(m => m.dispose());
    this.lightHousings.forEach(m => m.dispose());
    this.windowPanels.forEach(m => m.dispose());
    this.brandingMeshes.forEach(m => m.dispose());
    this.root?.dispose();
    logger.log('[ArenaArchitecture] Disposed');
  }
}
