/**
 * LifeguardStands  —  SWIM26 Competition Pool
 *
 * Photorealistic lifeguard / official chair stands placed at each end of the
 * pool deck, matching the reference SWIM26 image.
 *
 * Each stand assembly:
 *   • 4 diagonal tubular frame legs (anodized aluminium, white)
 *   • 2 horizontal cross-braces (lower + upper)
 *   • Flat seat platform at ~1.8 m height
 *   • Padded backrest panel
 *   • Footrest bar at mid-height
 *   • 3-step access ladder on rear
 *
 * Two stands per pool end (at each corner beside lane 1 and lane 8).
 * Positioned just outside the pool coping edge, on the pool deck.
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig } from '../../types';
import { logger } from '../../utils';

export class LifeguardStands {
  private root:   BABYLON.TransformNode | null = null;
  private meshes: BABYLON.Mesh[]              = [];

  // Shared stand materials (white anodized frame + navy blue seat)
  private frameMat:   BABYLON.PBRMaterial | null = null;
  private seatMat:    BABYLON.PBRMaterial | null = null;
  private ladderMat:  BABYLON.PBRMaterial | null = null;
  private cushionMat: BABYLON.PBRMaterial | null = null;

  build(scene: BABYLON.Scene, config: IArenaConfig): BABYLON.TransformNode {
    const { poolLength: L, poolWidth: W } = config;

    this.root = new BABYLON.TransformNode('LifeguardStands', scene);

    // ── Materials ─────────────────────────────────────────────────────────
    this.frameMat = new BABYLON.PBRMaterial('standFrame', scene);
    this.frameMat.albedoColor          = new BABYLON.Color3(0.92, 0.93, 0.95);  // near white
    this.frameMat.metallic             = 0.72;
    this.frameMat.roughness            = 0.28;
    this.frameMat.environmentIntensity = 0.30;

    this.seatMat = new BABYLON.PBRMaterial('standSeat', scene);
    this.seatMat.albedoColor  = new BABYLON.Color3(0.04, 0.12, 0.40);  // navy blue
    this.seatMat.metallic     = 0.00;
    this.seatMat.roughness    = 0.85;

    this.ladderMat = new BABYLON.PBRMaterial('standLadder', scene);
    this.ladderMat.albedoColor          = new BABYLON.Color3(0.82, 0.84, 0.86);
    this.ladderMat.metallic             = 0.80;
    this.ladderMat.roughness            = 0.25;
    this.ladderMat.environmentIntensity = 0.28;

    this.cushionMat = new BABYLON.PBRMaterial('standCushion', scene);
    this.cushionMat.albedoColor = new BABYLON.Color3(0.05, 0.15, 0.48); // medium blue
    this.cushionMat.metallic    = 0.00;
    this.cushionMat.roughness   = 0.90;

    // ── Stand positions ───────────────────────────────────────────────────
    // One stand on each side at the starting (south) end, just beyond the
    // coping edge.  Mirror positions on north (finish) end.
    const COPING = 0.60;     // coping edge offset
    const STAND_OFFSET_X = W / 2 + COPING + 1.2;
    const STAND_Z_SOUTH  = -L / 2 - COPING - 1.0;
    const STAND_Z_NORTH  =  L / 2 + COPING + 1.0;

    const positions: Array<[number, number, number]> = [
      // South end (starting side) — both sides
      [-STAND_OFFSET_X, 0, STAND_Z_SOUTH],
      [ STAND_OFFSET_X, 0, STAND_Z_SOUTH],
      // North end (finish side) — both sides
      [-STAND_OFFSET_X, 0, STAND_Z_NORTH],
      [ STAND_OFFSET_X, 0, STAND_Z_NORTH],
    ];

    for (const [px, py, pz] of positions) {
      this._buildStand(scene, new BABYLON.Vector3(px, py, pz));
    }

    logger.log('[LifeguardStands] Built 4 competition official stands');
    return this.root;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Build one stand assembly at world position `origin` (base of stand)
  // ─────────────────────────────────────────────────────────────────────────

  private _buildStand(scene: BABYLON.Scene, origin: BABYLON.Vector3): void {
    const SEAT_H    = 1.85;   // seat height above deck
    const STAND_W   = 0.80;   // footprint width (X)
    const STAND_D   = 0.65;   // footprint depth (Z)
    const TUBE_DIAM = 0.040;  // frame tube diameter
    const TESS      = 8;      // cylinder tessellation

    const addCyl = (
      name:   string,
      from:   BABYLON.Vector3,
      to:     BABYLON.Vector3,
      mat:    BABYLON.PBRMaterial,
      diam  = TUBE_DIAM,
    ) => {
      const delta  = to.subtract(from);
      const length = delta.length();
      const mid    = BABYLON.Vector3.Lerp(from, to, 0.5).add(origin);

      const cyl = BABYLON.MeshBuilder.CreateCylinder(name, {
        diameter:    diam,
        height:      length,
        tessellation: TESS,
      }, scene);

      // Orient cylinder from → to
      const axis = delta.normalize();
      // Babylon cylinders point along Y by default
      const up   = new BABYLON.Vector3(0, 1, 0);
      const angle = Math.acos(BABYLON.Vector3.Dot(up, axis));
      const cross = BABYLON.Vector3.Cross(up, axis);
      if (cross.length() > 0.001) {
        cyl.rotationQuaternion = BABYLON.Quaternion.RotationAxis(cross.normalize(), angle);
      }

      cyl.position = mid;
      cyl.material = mat;
      cyl.parent   = this.root;
      this.meshes.push(cyl);
    };

    // ── 4 outer legs (A-frame, splayed out) ─────────────────────────────
    const hw = STAND_W / 2;
    const hd = STAND_D / 2;

    // Bottom corners (on deck) → top inner rail (at seat level)
    const legTops: Array<[number, number, number]> = [
      [-hw * 0.5, SEAT_H,  hd * 0.5],
      [ hw * 0.5, SEAT_H,  hd * 0.5],
      [-hw * 0.5, SEAT_H, -hd * 0.5],
      [ hw * 0.5, SEAT_H, -hd * 0.5],
    ];
    const legBots: Array<[number, number, number]> = [
      [-hw,       0,  hd],
      [ hw,       0,  hd],
      [-hw,       0, -hd],
      [ hw,       0, -hd],
    ];
    const legNames = ['legFL', 'legFR', 'legBL', 'legBR'];

    for (let i = 0; i < 4; i++) {
      addCyl(
        `${legNames[i]}_${origin.x.toFixed(0)}`,
        new BABYLON.Vector3(...legBots[i]),
        new BABYLON.Vector3(...legTops[i]),
        this.frameMat!,
      );
    }

    // ── Lower cross-brace (X direction, at ~0.4 m height) ────────────────
    const BRACE_Y = 0.40;
    addCyl(
      `braceXF_${origin.x.toFixed(0)}`,
      new BABYLON.Vector3(-hw, BRACE_Y,  hd),
      new BABYLON.Vector3( hw, BRACE_Y,  hd),
      this.frameMat!,
    );
    addCyl(
      `braceXB_${origin.x.toFixed(0)}`,
      new BABYLON.Vector3(-hw, BRACE_Y, -hd),
      new BABYLON.Vector3( hw, BRACE_Y, -hd),
      this.frameMat!,
    );
    // Cross diagonal brace
    addCyl(
      `braceDiag_${origin.x.toFixed(0)}`,
      new BABYLON.Vector3(-hw, BRACE_Y, -hd),
      new BABYLON.Vector3( hw, BRACE_Y,  hd),
      this.frameMat!,
    );

    // ── Upper rail at seat level ─────────────────────────────────────────
    addCyl(
      `railF_${origin.x.toFixed(0)}`,
      new BABYLON.Vector3(-hw * 0.5, SEAT_H,  hd * 0.5),
      new BABYLON.Vector3( hw * 0.5, SEAT_H,  hd * 0.5),
      this.frameMat!,
    );
    addCyl(
      `railB_${origin.x.toFixed(0)}`,
      new BABYLON.Vector3(-hw * 0.5, SEAT_H, -hd * 0.5),
      new BABYLON.Vector3( hw * 0.5, SEAT_H, -hd * 0.5),
      this.frameMat!,
    );
    addCyl(
      `railL_${origin.x.toFixed(0)}`,
      new BABYLON.Vector3(-hw * 0.5, SEAT_H,  hd * 0.5),
      new BABYLON.Vector3(-hw * 0.5, SEAT_H, -hd * 0.5),
      this.frameMat!,
    );
    addCyl(
      `railR_${origin.x.toFixed(0)}`,
      new BABYLON.Vector3( hw * 0.5, SEAT_H,  hd * 0.5),
      new BABYLON.Vector3( hw * 0.5, SEAT_H, -hd * 0.5),
      this.frameMat!,
    );

    // ── Seat platform (flat slab) ─────────────────────────────────────────
    const seat = BABYLON.MeshBuilder.CreateBox(`seat_${origin.x.toFixed(0)}`, {
      width:  STAND_W * 0.90,
      height: 0.040,
      depth:  STAND_D * 0.80,
    }, scene);
    seat.position = new BABYLON.Vector3(origin.x, origin.y + SEAT_H + 0.020, origin.z);
    seat.material = this.seatMat!;
    seat.parent   = this.root;
    this.meshes.push(seat);

    // ── Seat cushion ──────────────────────────────────────────────────────
    const cushion = BABYLON.MeshBuilder.CreateBox(`cushion_${origin.x.toFixed(0)}`, {
      width:  STAND_W * 0.85,
      height: 0.055,
      depth:  STAND_D * 0.72,
    }, scene);
    cushion.position = new BABYLON.Vector3(origin.x, origin.y + SEAT_H + 0.070, origin.z);
    cushion.material = this.cushionMat!;
    cushion.parent   = this.root;
    this.meshes.push(cushion);

    // ── Backrest panel ────────────────────────────────────────────────────
    const BACK_H      = 0.55;
    const BACK_RISE_Y = SEAT_H + BACK_H / 2 + 0.12;
    const backrest = BABYLON.MeshBuilder.CreateBox(`backrest_${origin.x.toFixed(0)}`, {
      width:  STAND_W * 0.85,
      height: BACK_H,
      depth:  0.040,
    }, scene);
    backrest.position = new BABYLON.Vector3(origin.x, origin.y + BACK_RISE_Y, origin.z + hd * 0.45);
    backrest.material = this.cushionMat!;
    backrest.parent   = this.root;
    this.meshes.push(backrest);

    // ── Backrest posts ────────────────────────────────────────────────────
    for (const bpx of [-hw * 0.35, hw * 0.35]) {
      addCyl(
        `backPost_${origin.x.toFixed(0)}_${bpx.toFixed(2)}`,
        new BABYLON.Vector3(bpx, SEAT_H,  hd * 0.45),
        new BABYLON.Vector3(bpx, SEAT_H + BACK_H + 0.18, hd * 0.45),
        this.frameMat!,
      );
    }

    // ── Rear access ladder (3 rungs) ──────────────────────────────────────
    const LADDER_X   = 0;
    const LADDER_Z   = -hd - 0.05;
    const RUNG_DIAM  = 0.028;
    const RAIL_DIAM  = 0.032;

    // Two vertical rail tubes
    for (const rlx of [-0.16, 0.16]) {
      addCyl(
        `ladRail_${origin.x.toFixed(0)}_${rlx.toFixed(2)}`,
        new BABYLON.Vector3(LADDER_X + rlx, 0.15, LADDER_Z),
        new BABYLON.Vector3(LADDER_X + rlx, SEAT_H, LADDER_Z),
        this.ladderMat!,
        RAIL_DIAM,
      );
    }

    // Three rungs
    const rungYs = [0.30, 0.72, 1.18];
    for (let ri = 0; ri < rungYs.length; ri++) {
      addCyl(
        `rung_${origin.x.toFixed(0)}_${ri}`,
        new BABYLON.Vector3(LADDER_X - 0.16, rungYs[ri], LADDER_Z),
        new BABYLON.Vector3(LADDER_X + 0.16, rungYs[ri], LADDER_Z),
        this.ladderMat!,
        RUNG_DIAM,
      );
    }

    // ── Base rubber feet (prevent z-fighting with deck) ──────────────────
    for (const [bfx, bfz] of legBots) {
      const foot = BABYLON.MeshBuilder.CreateCylinder(
        `foot_${origin.x.toFixed(0)}_${bfx.toFixed(2)}`,
        { diameter: 0.10, height: 0.025, tessellation: 8 },
        scene,
      );
      foot.position = new BABYLON.Vector3(origin.x + bfx, origin.y + 0.012, origin.z + bfz);
      foot.material = this.seatMat!;
      foot.parent   = this.root;
      this.meshes.push(foot);
    }
  }

  public dispose(): void {
    this.meshes.forEach(m => m.dispose());
    this.frameMat?.dispose();
    this.seatMat?.dispose();
    this.ladderMat?.dispose();
    this.cushionMat?.dispose();
    this.root?.dispose();
    logger.log('[LifeguardStands] Disposed');
  }
}
