/**
 * PoolDeck
 * The wet-area concrete surround between the pool edge and the bleacher base.
 *
 * AUDIT ISSUES FIXED HERE:
 *   - Old code used a single 80×100 flat ground — far larger than needed,
 *     no anti-slip texture, no gutter channel, no drain detail.
 *   - Deck size is now calculated relative to poolWidth/poolLength so it
 *     scales correctly with non-standard pool configs.
 *
 * Phase 2 will add:
 *   - Non-slip grip-tile texture (PBR normal map)
 *   - Recessed gutter channel mesh around pool edge (3 cm deep drainage slot)
 *   - Lane-number painted markings on deck behind starting blocks
 *   - Wet-floor specular variation (puddle micro-reflections)
 */

import * as BABYLON from '@babylonjs/core';
import { IArenaConfig } from '../../types';
import { logger } from '../../utils';

export class PoolDeck {
  private deckMesh: BABYLON.Mesh | null = null;
  private material:  BABYLON.StandardMaterial | null = null;

  // Deck extends this many metres beyond each pool edge
  static readonly DECK_MARGIN = 12;

  build(scene: BABYLON.Scene, config: IArenaConfig): BABYLON.Mesh {
    const M  = PoolDeck.DECK_MARGIN;
    const dW = config.poolWidth  + M * 2;
    const dL = config.poolLength + M * 2;

    this.material = new BABYLON.StandardMaterial('deckMat', scene);
    // Slightly warm light-grey — matches competition pool deck photographs
    this.material.diffuseColor  = new BABYLON.Color3(0.82, 0.84, 0.86);
    this.material.specularColor = new BABYLON.Color3(0.22, 0.22, 0.22);
    this.material.specularPower = 12;
    // Phase 2: diffuseTexture = non-slip tile texture with UV tiling

    this.deckMesh = BABYLON.MeshBuilder.CreateGround('poolDeck', {
      width:        dW,
      height:       dL,
      subdivisions: 2,
    }, scene);
    this.deckMesh.position.y = 0;
    this.deckMesh.material   = this.material;

    logger.log('[PoolDeck] Built');
    return this.deckMesh;
  }

  public dispose(): void {
    this.deckMesh?.dispose();
    this.material?.dispose();
    logger.log('[PoolDeck] Disposed');
  }
}
