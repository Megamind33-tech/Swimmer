/**
 * ArenaArchitecture
 * Builds everything above the deck level: arena envelope, stepped bleachers,
 * support columns, and the scoreboard.
 *
 * AUDIT ISSUES FIXED HERE:
 *   - Old code created a hallMesh and immediately set isVisible = false.
 *     The arena had literally no visible walls, ceiling, or structure.
 *     All geometry is now visible.
 *   - Bleachers were flat horizontal slabs (no stepped structure, no seats).
 *     Replaced with proper stepped risers + individual seat tiles.
 *   - No support columns existed at all.
 *   - Arena walls were never created.
 *   - Scoreboard was at a fine position but had no backing structure.
 *
 * Phase 2 will add:
 *   - Window bands / clerestory openings in side walls (light shafts)
 *   - Roof truss geometry (steel lattice overhead)
 *   - Spectator crowd imposters (billboard sprites in seats)
 *   - Animated scoreboard dynamic texture fed from live race data
 *   - Banner / sponsor board meshes on arena walls
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig } from '../../types';
import { logger } from '../../utils';

export class ArenaArchitecture {
  private root:      BABYLON.TransformNode | null = null;
  private meshes:    BABYLON.Mesh[] = [];
  private scoreboard: BABYLON.Mesh | null = null;
  private scoreboardTexture: BABYLON.DynamicTexture | null = null;

  // How far the arena envelope extends beyond the deck on each axis
  static readonly ARENA_MARGIN_X = 22;
  static readonly ARENA_MARGIN_Z = 22;

  build(scene: BABYLON.Scene, config: IArenaConfig): BABYLON.TransformNode {
    const { poolLength: L, poolWidth: W, arenaHeight: AH } = config;

    const AW = W + ArenaArchitecture.ARENA_MARGIN_X * 2; // arena total width
    const AL = L + ArenaArchitecture.ARENA_MARGIN_Z * 2; // arena total depth

    this.root = new BABYLON.TransformNode('ArenaArchitecture', scene);

    // ── Materials ─────────────────────────────────────────────────────────
    const ceilingMat = new BABYLON.StandardMaterial('ceilingMat', scene);
    ceilingMat.diffuseColor    = new BABYLON.Color3(0.88, 0.90, 0.90);
    ceilingMat.backFaceCulling = false;

    const wallMat = new BABYLON.StandardMaterial('arenaWallMat', scene);
    wallMat.diffuseColor    = new BABYLON.Color3(0.78, 0.80, 0.82);
    wallMat.backFaceCulling = false;

    const columnMat = new BABYLON.StandardMaterial('columnMat', scene);
    columnMat.diffuseColor  = new BABYLON.Color3(0.70, 0.72, 0.75);
    columnMat.specularColor = new BABYLON.Color3(0.10, 0.10, 0.10);

    const bleacherMat = new BABYLON.StandardMaterial('bleacherMat', scene);
    bleacherMat.diffuseColor  = new BABYLON.Color3(0.18, 0.20, 0.24);
    bleacherMat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

    const seatMat = new BABYLON.StandardMaterial('seatMat', scene);
    seatMat.diffuseColor = new BABYLON.Color3(0.06, 0.22, 0.58); // Olympic blue seats

    // ── Ceiling ───────────────────────────────────────────────────────────
    const ceiling = BABYLON.MeshBuilder.CreateBox('arenaCeiling', {
      width: AW + 2, height: 1.8, depth: AL + 2,
    }, scene);
    ceiling.position.y = AH + 0.9;
    ceiling.material   = ceilingMat;
    ceiling.parent     = this.root;
    this.meshes.push(ceiling);

    // ── Perimeter walls (4 sides, visible from inside) ────────────────────
    const wallDefs = [
      { name: 'arenaWallN', w: AW,  h: AH, d: 1.2, px: 0,      pz:  AL / 2 },
      { name: 'arenaWallS', w: AW,  h: AH, d: 1.2, px: 0,      pz: -AL / 2 },
      { name: 'arenaWallE', w: 1.2, h: AH, d: AL,  px:  AW / 2, pz: 0       },
      { name: 'arenaWallW', w: 1.2, h: AH, d: AL,  px: -AW / 2, pz: 0       },
    ];
    for (const def of wallDefs) {
      const wall = BABYLON.MeshBuilder.CreateBox(def.name, {
        width: def.w, height: def.h, depth: def.d,
      }, scene);
      wall.position = new BABYLON.Vector3(def.px, def.h / 2, def.pz);
      wall.material = wallMat;
      wall.parent   = this.root;
      this.meshes.push(wall);
    }

    // ── Support columns along both long sides ────────────────────────────
    const COL_SPACING  = 10;
    const COL_SIDE_X   = W / 2 + 14;
    const numCols      = Math.max(2, Math.round(L / COL_SPACING) + 1);

    for (const sideSign of [-1, 1]) {
      for (let ci = 0; ci < numCols; ci++) {
        const colZ = -L / 2 + ci * (L / (numCols - 1));
        const col  = BABYLON.MeshBuilder.CreateCylinder(`col${sideSign}_${ci}`, {
          diameter:    0.80,
          height:      AH,
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
    const ROW_DEPTH   = 1.0;   // depth per row step
    const ROW_HEIGHT  = 0.50;  // vertical rise per row
    const SEAT_WIDTH  = 0.72;
    const DECK_MARGIN = 12;    // matches PoolDeck.DECK_MARGIN

    for (const baseSign of [-1, 1]) {
      const baseX = baseSign * (W / 2 + DECK_MARGIN - 1);

      for (let row = 0; row < SIDE_ROWS; row++) {
        const stepX = baseX + baseSign * row * ROW_DEPTH;
        const riserH = (row + 1) * ROW_HEIGHT;

        // Stepped concrete riser
        const riser = BABYLON.MeshBuilder.CreateBox(`sideRiser${baseSign}_${row}`, {
          width:  ROW_DEPTH,
          height: riserH,
          depth:  L + 6,
        }, scene);
        riser.position = new BABYLON.Vector3(stepX, riserH / 2, 0);
        riser.material = bleacherMat;
        riser.parent   = this.root;
        this.meshes.push(riser);

        // Seat tops on each riser
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

    // ── Scoreboard ────────────────────────────────────────────────────────
    this.scoreboard = BABYLON.MeshBuilder.CreateBox('scoreboard', {
      width: 22, height: 10, depth: 0.8,
    }, scene);
    this.scoreboard.position = new BABYLON.Vector3(0, 14, L / 2 + 2.5);

    this.scoreboardTexture = new BABYLON.DynamicTexture('scoreboardTex',
      { width: 1024, height: 512 }, scene);
    this._clearScoreboard();

    const sbMat = new BABYLON.StandardMaterial('scoreboardMat', scene);
    sbMat.emissiveTexture = this.scoreboardTexture;
    sbMat.emissiveColor   = new BABYLON.Color3(1, 1, 1);
    this.scoreboard.material = sbMat;
    this.scoreboard.parent   = this.root;
    this.meshes.push(this.scoreboard);

    logger.log('[ArenaArchitecture] Built');
    return this.root;
  }

  // ─── Scoreboard helpers ───────────────────────────────────────────────────

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

  public dispose(): void {
    this.scoreboardTexture?.dispose();
    this.meshes.forEach(m => m.dispose());
    this.root?.dispose();
    logger.log('[ArenaArchitecture] Disposed');
  }
}
