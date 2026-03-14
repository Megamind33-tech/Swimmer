/**
 * SWIMMER GAME - WarmupSystem
 * Manages pre-race warm-up animations and behaviors for swimmers
 */

import * as BABYLON from '@babylonjs/core';

export type WarmupType =
  | 'arm-circles'
  | 'leg-stretches'
  | 'neck-rolls'
  | 'jumping-jacks'
  | 'pool-walk'
  | 'breathing-exercises'
  | 'dynamic-stretches'
  | 'mental-focus';

export interface WarmupAction {
  type: WarmupType;
  duration: number; // in seconds
  intensity: number; // 0-1
  rotation?: BABYLON.Vector3;
  position?: BABYLON.Vector3;
}

export interface WarmupSequence {
  swimmerId: number;
  actions: WarmupAction[];
  currentActionIndex: number;
  startTime: number;
  isComplete: boolean;
}

export class WarmupSystem {
  private scene: BABYLON.Scene;
  private warmupSequences: Map<number, WarmupSequence> = new Map();

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  /**
   * Generate a unique warm-up sequence based on personality and confidence
   */
  public generateWarmupSequence(
    swimmerId: number,
    personality: {
      warmupIntensity: number;
      confidence: number;
      nervousness: number;
    }
  ): WarmupSequence {
    const actions: WarmupAction[] = [];
    const intensity = personality.warmupIntensity;
    const nervousness = personality.nervousness;

    // More nervous swimmers do more stretching
    if (nervousness > 0.3) {
      actions.push(
        { type: 'neck-rolls', duration: 2, intensity: 0.5 },
        { type: 'breathing-exercises', duration: 2, intensity: 0.6 },
        { type: 'dynamic-stretches', duration: 3, intensity: 0.5 }
      );
    }

    // All swimmers do arm circles
    actions.push({
      type: 'arm-circles',
      duration: 2 + intensity * 2,
      intensity: 0.4 + intensity * 0.5,
    });

    // High intensity swimmers do more active warm-ups
    if (intensity > 0.7) {
      actions.push(
        { type: 'jumping-jacks', duration: 2, intensity: 0.8 },
        { type: 'pool-walk', duration: 3, intensity: 0.9 },
        { type: 'dynamic-stretches', duration: 2, intensity: 0.9 }
      );
    } else {
      actions.push(
        { type: 'leg-stretches', duration: 2, intensity: 0.5 },
        { type: 'pool-walk', duration: 2, intensity: 0.6 }
      );
    }

    // Confident swimmers end with mental focus
    if (personality.confidence > 0.8) {
      actions.push({ type: 'mental-focus', duration: 2, intensity: 0.7 });
    }

    const sequence: WarmupSequence = {
      swimmerId: swimmerId,
      actions: actions,
      currentActionIndex: 0,
      startTime: performance.now() / 1000,
      isComplete: false,
    };

    this.warmupSequences.set(swimmerId, sequence);
    return sequence;
  }

  /**
   * Update warm-up animations
   */
  public update(
    mesh: BABYLON.TransformNode | null,
    swimmerId: number,
    deltaTime: number
  ): {
    currentAction: WarmupAction | null;
    isComplete: boolean;
    progress: number; // 0-1
  } {
    const sequence = this.warmupSequences.get(swimmerId);

    if (!sequence || !mesh) {
      return { currentAction: null, isComplete: true, progress: 1 };
    }

    const now = performance.now() / 1000;
    let totalTime = 0;
    let currentTime = 0;

    // Calculate total warm-up duration
    const totalDuration = sequence.actions.reduce((sum, action) => sum + action.duration, 0);

    // Find current action
    for (let i = 0; i < sequence.actions.length; i++) {
      const action = sequence.actions[i];
      currentTime = totalTime;
      totalTime += action.duration;

      if (now - sequence.startTime < totalTime) {
        sequence.currentActionIndex = i;

        const actionProgress = (now - sequence.startTime - currentTime) / action.duration;
        const progress = (currentTime + actionProgress * action.duration) / totalDuration;

        // Apply animation
        this.applyWarmupAnimation(mesh, action, actionProgress);

        return {
          currentAction: action,
          isComplete: false,
          progress: progress,
        };
      }
    }

    // Warm-up complete
    sequence.isComplete = true;
    mesh.rotation = new BABYLON.Vector3(Math.PI / 6, 0, 0); // Return to ready position
    return { currentAction: null, isComplete: true, progress: 1 };
  }

  /**
   * Apply warm-up animation to mesh
   */
  private applyWarmupAnimation(
    mesh: BABYLON.TransformNode,
    action: WarmupAction,
    progress: number
  ): void {
    switch (action.type) {
      case 'arm-circles':
        // Rotate arms in circles
        mesh.rotation = new BABYLON.Vector3(
          Math.PI / 8,
          Math.sin(progress * Math.PI * 4) * 0.3,
          Math.cos(progress * Math.PI * 4) * 0.5
        );
        break;

      case 'leg-stretches':
        // Bend forward and back
        mesh.rotation = new BABYLON.Vector3(
          Math.PI / 8 - Math.sin(progress * Math.PI) * 0.4,
          0,
          0
        );
        break;

      case 'neck-rolls':
        // Rotate head/neck
        mesh.rotation = new BABYLON.Vector3(
          Math.PI / 8,
          Math.cos(progress * Math.PI * 2) * 0.3,
          Math.sin(progress * Math.PI * 2) * 0.2
        );
        break;

      case 'jumping-jacks':
        // Up and down motion
        const jumpHeight = Math.abs(Math.sin(progress * Math.PI * 2)) * 0.3;
        mesh.position.y = jumpHeight;
        mesh.rotation = new BABYLON.Vector3(Math.PI / 6, 0, 0);
        break;

      case 'pool-walk':
        // Walk along the pool
        const walkDistance = progress * 2;
        mesh.position.z += (walkDistance - (mesh as any).lastWalkDistance || 0) * 0.01;
        (mesh as any).lastWalkDistance = walkDistance;
        mesh.rotation = new BABYLON.Vector3(Math.PI / 8, Math.sin(progress * Math.PI * 2) * 0.1, 0);
        break;

      case 'breathing-exercises':
        // Expand and contract (breathing motion)
        const breatheScale = 1 + Math.sin(progress * Math.PI * 2) * 0.1;
        mesh.scaling = new BABYLON.Vector3(1, breatheScale, 1);
        mesh.rotation = new BABYLON.Vector3(Math.PI / 8, 0, 0);
        break;

      case 'dynamic-stretches':
        // Alternating side stretches
        const stretchAngle = Math.sin(progress * Math.PI * 2) * 0.3;
        mesh.rotation = new BABYLON.Vector3(Math.PI / 8, 0, stretchAngle);
        break;

      case 'mental-focus':
        // Stillness and focus (slight swaying)
        const sway = Math.sin(progress * Math.PI * 2) * 0.05;
        mesh.rotation = new BABYLON.Vector3(Math.PI / 6, sway, 0);
        break;
    }
  }

  /**
   * Get warm-up sequence for swimmer
   */
  public getSequence(swimmerId: number): WarmupSequence | undefined {
    return this.warmupSequences.get(swimmerId);
  }

  /**
   * Clear warm-up
   */
  public clearWarmup(swimmerId: number): void {
    this.warmupSequences.delete(swimmerId);
  }

  /**
   * Clear all warm-ups
   */
  public clearAll(): void {
    this.warmupSequences.clear();
  }
}

export default WarmupSystem;
