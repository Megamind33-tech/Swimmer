/**
 * ArenaOptimizer  —  Phase 8
 * One-shot static scene optimizations applied after all arena geometry is
 * built and the post-build passes (shadows, env probe, underwater) are done.
 *
 * Three passes — all safe to run after scene.meshes is complete:
 *
 * 1. setPickability
 *    All arena meshes are set to isPickable=false.  No arena geometry is
 *    ever raycasted against at runtime (swimmers are separate), so disabling
 *    pickability removes those meshes from Babylon's per-frame pick checks.
 *
 * 2. freezeStaticMeshes
 *    All current scene meshes get mesh.freezeWorldMatrix().  This prevents
 *    Babylon from recomputing the world matrix (a matrix multiply per mesh
 *    per frame) on geometry that never moves.  With 500–700 arena meshes at
 *    build time, this saves hundreds of matrix multiplications per frame.
 *    Swimmer meshes are added AFTER the optimizer runs and are therefore
 *    unaffected.
 *
 * 3. mergeDetailMeshes  (LOW quality only)
 *    Groups high-count detail mesh sets (float discs, drain grates, T-marks,
 *    lane lines, rope anchors, 15 m markers) by material reference.  Meshes
 *    that share the same material are merged into a single draw call using
 *    BABYLON.Mesh.MergeMeshes.
 *
 *    Expected draw-call reduction on LOW (50 m / 8-lane pool):
 *      Float discs   ~175 meshes → 3  (green / red / yellow groups)
 *      Drain grates  ~34         → 1
 *      T-marks       ~32         → 1  (all share laneMarking material)
 *      Lane lines      8         → merged into above (same material)
 *      Rope anchors   14         → 1
 *      15 m markers   16         → 1
 *    Total saved: ~265 draw calls; scene goes from ~600 to ~335.
 *
 *    Merge is only run at build time.  Switching quality to LOW after
 *    starting on MEDIUM/HIGH will not merge meshes retroactively — this
 *    is an acceptable limitation (do the big win at startup for mobile).
 *
 * Material freezing is handled separately by
 * ArenaMaterialLibrary.freezeStaticMaterials() so that it runs AFTER the
 * initial theme is applied (theme sets poolWall.albedoColor which must
 * happen before freeze locks the material state).
 */

import * as BABYLON from '@babylonjs/core';
import { logger } from '../../utils';

// ── Eligible prefixes for LOD mesh merging ────────────────────────────────
// Only detail meshes with many instances per material are listed.
// Structural meshes (walls, columns, trusses) are already few in count and
// benefit more from world-matrix freeze than from geometry merging.
const MERGE_ELIGIBLE_PREFIXES: string[] = [
  'disc',           // lane rope float discs  (disc${ropeIdx}_${floatIdx})
  'drain_',         // pool-deck drain grates  (drain_${sideX}_${gi})
  'tBar_',          // FINA T-mark horizontal bars
  'tStem_',         // FINA T-mark stems
  'laneLine',       // pool-floor lane centre stripes
  'ropeAnchor_',    // stainless rope-end anchor posts
  'marker15m_',     // 15 m backstroke-turn marker discs
  'gutN',           // overflow gutter channel (4 pieces)
  'gutS',
  'gutE',
  'gutW',
];

export class ArenaOptimizer {

  /**
   * Run all optimization passes.
   * Call this after every post-build scene step is complete and before
   * the first render frame.
   */
  static optimize(
    scene:       BABYLON.Scene,
    qualityTier: 'LOW' | 'MEDIUM' | 'HIGH',
  ): void {
    // Order matters: set pickability first (before freeze so bounding
    // info is still live), then freeze (cheap), then merge (destructive).
    ArenaOptimizer._setPickability(scene);
    ArenaOptimizer._freezeStaticMeshes(scene);

    if (qualityTier === 'LOW') {
      ArenaOptimizer._mergeDetailMeshes(scene);
    }

    logger.log(`[ArenaOptimizer] Optimization complete (tier=${qualityTier})`);
  }

  // ─── Pass 1: pickability ─────────────────────────────────────────────────

  private static _setPickability(scene: BABYLON.Scene): void {
    // Snap isPickable to false on all arena geometry.
    // Swimmer meshes are not yet in the scene (added at race start),
    // so they will default to isPickable=true — correct behaviour.
    for (const mesh of scene.meshes) {
      mesh.isPickable = false;
    }
    logger.log(`[ArenaOptimizer] Set ${scene.meshes.length} meshes non-pickable`);
  }

  // ─── Pass 2: world matrix freeze ─────────────────────────────────────────

  private static _freezeStaticMeshes(scene: BABYLON.Scene): void {
    // All arena meshes that exist at optimize time are static — they never
    // translate, rotate, or scale.  Freezing their world matrix prevents
    // Babylon from recomputing it every frame.
    //
    // UV animation (water normal map, caustic scroll) is handled through
    // texture.uOffset/vOffset — it does NOT require a world matrix update.
    // So caustic overlay and water surface are safe to freeze too.
    let count = 0;
    for (const mesh of scene.meshes) {
      mesh.freezeWorldMatrix();
      count++;
    }
    logger.log(`[ArenaOptimizer] Froze ${count} mesh world matrices`);
  }

  // ─── Pass 3: detail mesh merging (LOW quality only) ───────────────────────

  private static _mergeDetailMeshes(scene: BABYLON.Scene): void {
    // Collect eligible meshes grouped by their material's uniqueId.
    // Meshes within the same group share the same material → can be merged
    // into a single draw call.
    const byMat = new Map<number, BABYLON.Mesh[]>();

    for (const node of scene.meshes) {
      if (!(node instanceof BABYLON.Mesh)) continue;
      if (node.name.startsWith('merged_'))   continue; // already merged
      if (!node.material)                     continue;
      if (!(node.getTotalVertices() > 0))     continue; // skip degenerate

      const eligible = MERGE_ELIGIBLE_PREFIXES.some(p => node.name.startsWith(p));
      if (!eligible) continue;

      const id = node.material.uniqueId;
      if (!byMat.has(id)) byMat.set(id, []);
      byMat.get(id)!.push(node);
    }

    let savedCalls = 0;

    for (const [, group] of byMat) {
      if (group.length < 2) continue;

      const mat  = group[0].material!;
      const name = `merged_${mat.name}`;

      try {
        const merged = BABYLON.Mesh.MergeMeshes(
          group,
          true,   // disposeSource: free the originals after merge
          true,   // allow32BitsIndices: needed when total vertex count > 65k
          undefined,
          false,
          false,
        );

        if (merged) {
          merged.name     = name;
          merged.material = mat;
          merged.isPickable = false;
          merged.freezeWorldMatrix();
          savedCalls += group.length - 1;
          logger.log(
            `[ArenaOptimizer] Merged ${group.length} → 1 for mat="${mat.name}" (−${group.length - 1} draw calls)`,
          );
        }
      } catch (err) {
        // Non-critical: incompatible vertex data (e.g. missing UV channel).
        // Log and continue — the unmerged meshes remain functional.
        logger.warn(`[ArenaOptimizer] Merge skipped for mat="${mat.name}": ${err}`);
      }
    }

    logger.log(`[ArenaOptimizer] Detail merge saved ~${savedCalls} draw calls`);
  }
}
