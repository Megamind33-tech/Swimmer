/**
 * SWIMMER GAME - SwimmerManager
 * Manages all 8 swimmers in the pool with different colors and positions
 *
 * Responsibilities:
 * - Create and position 8 swimmers (one per lane)
 * - Manage individual swimmer colors and customization
 * - Handle swimmer animations
 * - Synchronize with game state
 */

import * as BABYLON from '@babylonjs/core';
import SwimmerModel, { SwimmerConfig } from './SwimmerModel';
import { logger } from '../utils';

export interface SwimmerInstance {
  model: SwimmerModel;
  mesh: BABYLON.TransformNode;
  laneIndex: number;
  config: SwimmerConfig;
}

export class SwimmerManager {
  private scene: BABYLON.Scene;
  private swimmers: Map<number, SwimmerInstance> = new Map();
  private poolWidth: number = 25;
  private laneCount: number = 8;

  // Default color palette for swimmers
  private colorPalette: BABYLON.Color3[] = [
    new BABYLON.Color3(0.0, 0.2, 0.8),   // Blue
    new BABYLON.Color3(0.8, 0.0, 0.0),   // Red
    new BABYLON.Color3(0.0, 0.0, 0.0),   // Black
    new BABYLON.Color3(0.0, 0.6, 0.0),   // Green
    new BABYLON.Color3(1.0, 1.0, 0.0),   // Yellow
    new BABYLON.Color3(0.7, 0.0, 0.7),   // Purple
    new BABYLON.Color3(1.0, 0.5, 0.0),   // Orange
    new BABYLON.Color3(1.0, 0.2, 0.7),   // Pink
  ];

  private capColors: BABYLON.Color3[] = [
    new BABYLON.Color3(1.0, 1.0, 1.0),   // White
    new BABYLON.Color3(1.0, 1.0, 1.0),   // White
    new BABYLON.Color3(1.0, 1.0, 1.0),   // White
    new BABYLON.Color3(1.0, 1.0, 1.0),   // White
    new BABYLON.Color3(0.0, 0.0, 0.0),   // Black
    new BABYLON.Color3(1.0, 1.0, 1.0),   // White
    new BABYLON.Color3(0.0, 0.0, 0.0),   // Black
    new BABYLON.Color3(1.0, 1.0, 1.0),   // White
  ];

  constructor(scene: BABYLON.Scene, poolWidth: number = 25, laneCount: number = 8) {
    this.scene = scene;
    this.poolWidth = poolWidth;
    this.laneCount = laneCount;
  }

  /**
   * Initialize all 8 swimmers in their lanes
   */
  public initialize(): void {
    logger.log(`SwimmerManager initializing ${this.laneCount} swimmers`);

    for (let lane = 0; lane < this.laneCount; lane++) {
      this.createSwimmerAtLane(lane);
    }

    logger.log(`SwimmerManager initialized with ${this.swimmers.size} swimmers`);
  }

  /**
   * Create a single swimmer at a specific lane
   */
  private createSwimmerAtLane(laneIndex: number): void {
    // Calculate lane position
    const laneX = -this.poolWidth / 2 + (laneIndex * this.poolWidth) / (this.laneCount - 1);

    // Create swimmer with color palette
    const config: SwimmerConfig = {
      suitColor: this.colorPalette[laneIndex],
      capColor: this.capColors[laneIndex],
      goggleColor: new BABYLON.Color3(0.1, 0.1, 0.1),
      scale: 1.0 + (Math.random() * 0.2 - 0.1), // Slight height variation
      skinTone: new BABYLON.Color3(0.95, 0.8, 0.7),
    };

    const swimmer = new SwimmerModel(this.scene);
    const mesh = swimmer.create(config);

    // Position swimmer in lane at starting position (ready to dive)
    mesh.position = new BABYLON.Vector3(laneX, 0.2, -24);
    mesh.rotation = new BABYLON.Vector3(Math.PI / 6, 0, 0); // Lean forward diving position

    const instance: SwimmerInstance = {
      model: swimmer,
      mesh: mesh,
      laneIndex: laneIndex,
      config: config,
    };

    this.swimmers.set(laneIndex, instance);
    logger.log(`Swimmer ${laneIndex} created at lane ${laneIndex}`);
  }

  /**
   * Get a swimmer by lane index
   */
  public getSwimmer(laneIndex: number): SwimmerInstance | undefined {
    return this.swimmers.get(laneIndex);
  }

  /**
   * Get all swimmers
   */
  public getAllSwimmers(): SwimmerInstance[] {
    return Array.from(this.swimmers.values());
  }

  /**
   * Update swimmer position (for racing)
   */
  public updateSwimmerPosition(
    laneIndex: number,
    position: BABYLON.Vector3,
    rotation?: BABYLON.Vector3
  ): void {
    const swimmer = this.swimmers.get(laneIndex);
    if (!swimmer) return;

    swimmer.mesh.position = position;
    if (rotation) {
      swimmer.mesh.rotation = rotation;
    }
  }

  /**
   * Update swimmer animation state
   */
  public updateSwimmerAnimation(
    laneIndex: number,
    animationState: 'idle' | 'diving' | 'freestyle' | 'butterfly' | 'breaststroke' | 'backstroke' | 'turning' | 'finished'
  ): void {
    const swimmer = this.swimmers.get(laneIndex);
    if (!swimmer || !swimmer.mesh) return;

    // Apply basic rotations based on stroke
    switch (animationState) {
      case 'idle':
        swimmer.mesh.rotation = new BABYLON.Vector3(0, 0, 0);
        break;
      case 'diving':
        swimmer.mesh.rotation = new BABYLON.Vector3(Math.PI / 4, 0, 0);
        break;
      case 'freestyle':
      case 'butterfly':
      case 'breaststroke':
        swimmer.mesh.rotation = new BABYLON.Vector3(-Math.PI / 6, 0, 0);
        break;
      case 'backstroke':
        swimmer.mesh.rotation = new BABYLON.Vector3(Math.PI / 3, 0, 0);
        break;
      case 'turning':
        swimmer.mesh.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
        break;
      case 'finished':
        swimmer.mesh.rotation = new BABYLON.Vector3(0, 0, 0);
        break;
    }
  }

  /**
   * Change a swimmer's suit color
   */
  public setSwimmerSuitColor(laneIndex: number, color: BABYLON.Color3): void {
    const swimmer = this.swimmers.get(laneIndex);
    if (!swimmer) return;

    swimmer.model.setSuitColor(color);
    swimmer.config.suitColor = color;
  }

  /**
   * Change a swimmer's cap color
   */
  public setSwimmerCapColor(laneIndex: number, color: BABYLON.Color3): void {
    const swimmer = this.swimmers.get(laneIndex);
    if (!swimmer) return;

    swimmer.model.setCapColor(color);
    swimmer.config.capColor = color;
  }

  /**
   * Get all swimmers as array for rendering
   */
  public getSwimmerMeshes(): BABYLON.TransformNode[] {
    return Array.from(this.swimmers.values()).map((s) => s.mesh);
  }

  /**
   * Reset all swimmers to starting position
   */
  public resetAll(): void {
    this.swimmers.forEach((swimmer, laneIndex) => {
      const laneX =
        -this.poolWidth / 2 +
        (laneIndex * this.poolWidth) / (this.laneCount - 1);

      swimmer.mesh.position = new BABYLON.Vector3(laneX, 0.2, -24);
      swimmer.mesh.rotation = new BABYLON.Vector3(Math.PI / 6, 0, 0);
    });

    logger.log('All swimmers reset to starting position');
  }

  /**
   * Dispose of all swimmers
   */
  public dispose(): void {
    this.swimmers.forEach((swimmer) => {
      swimmer.model.dispose();
    });
    this.swimmers.clear();
    logger.log('SwimmerManager disposed');
  }
}

export default SwimmerManager;
