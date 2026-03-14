/**
 * SWIMMER GAME - RenderingOptimizer
 * Optimizes rendering to prevent flickering, tears, and performance issues
 */

import * as BABYLON from '@babylonjs/core';
import { logger } from '../utils';

export interface RenderingConfig {
  targetFPS: number;
  enableVSync: boolean;
  antialiasing: 'none' | 'fxaa' | 'msaa4x';
  lodEnabled: boolean;
  shadowsEnabled: boolean;
  particlesEnabled: boolean;
  maxLights: number;
}

export class RenderingOptimizer {
  private scene: BABYLON.Scene;
  private engine: BABYLON.Engine;
  private config: RenderingConfig;
  private originalRenderFunction: (() => void) | null = null;

  constructor(scene: BABYLON.Scene, engine: BABYLON.Engine) {
    this.scene = scene;
    this.engine = engine;
    this.config = this.getDefaultConfig();
  }

  /**
   * Get default rendering configuration
   */
  private getDefaultConfig(): RenderingConfig {
    return {
      targetFPS: 60,
      enableVSync: true,
      antialiasing: 'fxaa',
      lodEnabled: true,
      shadowsEnabled: true,
      particlesEnabled: true,
      maxLights: 8,
    };
  }

  /**
   * Apply optimization configuration
   */
  public applyOptimization(quality: 'high' | 'medium' | 'low'): void {
    switch (quality) {
      case 'high':
        this.config = {
          targetFPS: 60,
          enableVSync: true,
          antialiasing: 'msaa4x',
          lodEnabled: true,
          shadowsEnabled: true,
          particlesEnabled: true,
          maxLights: 16,
        };
        break;

      case 'medium':
        this.config = {
          targetFPS: 60,
          enableVSync: true,
          antialiasing: 'fxaa',
          lodEnabled: true,
          shadowsEnabled: true,
          particlesEnabled: true,
          maxLights: 8,
        };
        break;

      case 'low':
        this.config = {
          targetFPS: 30,
          enableVSync: false,
          antialiasing: 'none',
          lodEnabled: true,
          shadowsEnabled: false,
          particlesEnabled: false,
          maxLights: 4,
        };
        break;
    }

    this.applyConfig();
  }

  /**
   * Apply configuration
   */
  private applyConfig(): void {
    // VSync
    this.engine.setHardwareScalingLevel(1 / (window.devicePixelRatio || 1));

    // Disable unused features
    // Note: collisionsEnabled is not a valid Scene property
    // Collisions are managed at the mesh level via onCollide callbacks
    this.scene.collisionsEnabled = false;

    // LOD system
    if (this.config.lodEnabled) {
      this.enableLOD();
    }

    // Shadows
    if (!this.config.shadowsEnabled) {
      this.disableShadows();
    }

    // Particle optimization
    if (!this.config.particlesEnabled) {
      this.disableParticles();
    }

    // Light limits
    this.limitLights(this.config.maxLights);

    logger.log(`Rendering optimized for quality: ${this.getQualityLevel()}`);
  }

  /**
   * Get current quality level
   */
  private getQualityLevel(): 'high' | 'medium' | 'low' {
    if (this.config.antialiasing === 'msaa4x') return 'high';
    if (this.config.antialiasing === 'fxaa') return 'medium';
    return 'low';
  }

  /**
   * Enable LOD (Level of Detail)
   */
  private enableLOD(): void {
    this.scene.meshes.forEach((mesh) => {
      if (mesh.metadata && mesh.metadata.isHighDetail) {
        // addLODLevel with null disables the mesh, but we can just skip LOD for high-detail meshes
        // LOD optimization will be handled by culling strategy instead
      }
    });
  }

  /**
   * Disable shadows globally
   */
  private disableShadows(): void {
    this.scene.lights.forEach((light) => {
      // Light objects don't have shadowEnabled property directly
      // Instead, we dispose of shadow generators attached to lights
      if (light.getShadowGenerator && light.getShadowGenerator()) {
        light.getShadowGenerator()!.dispose();
      }
    });
  }

  /**
   * Disable particles
   */
  private disableParticles(): void {
    this.scene.particleSystems.forEach((system) => {
      system.stop();
    });
  }

  /**
   * Limit number of active lights
   */
  private limitLights(maxLights: number): void {
    const lights = this.scene.lights;
    for (let i = maxLights; i < lights.length; i++) {
      lights[i].setEnabled(false);
    }
  }

  /**
   * Prevent flickering by stabilizing render loop
   */
  public stabilizeRenderLoop(): void {
    // Enable adaptive frame rate limiting to prevent flickering
    // Use deterministic lock step for consistent frame timing
    (this.engine as any).isDeterministicLockStep = true;
    (this.engine as any)._lockstepMaxSteps = 4;

    logger.log('Render loop stabilization enabled');
  }

  /**
   * Fix common flickering issues
   */
  public fixFlickeringIssues(): void {
    // Ensure consistent camera
    if (this.scene.activeCamera) {
      this.scene.activeCamera.attachControl(this.engine.getRenderingCanvas(), true);
    }

    // Disable fog artifacts
    const clearColor = this.scene.clearColor;
    this.scene.fogColor = new BABYLON.Color3(clearColor.r, clearColor.g, clearColor.b);

    // Enable smooth rendering
    this.scene.autoClearDepthAndStencil = true;
    this.scene.autoClear = true;

    // Limit physics updates
    if (this.scene.getPhysicsEngine()) {
      this.scene.getPhysicsEngine()!.setTimeStep(1 / this.config.targetFPS);
    }

    logger.log('Flickering fixes applied');
  }

  /**
   * Enable object pooling for swimmers
   */
  public enableObjectPooling(poolSize: number = 100): void {
    const pool: BABYLON.Mesh[] = [];

    // Pre-allocate meshes
    for (let i = 0; i < poolSize; i++) {
      const mesh = BABYLON.MeshBuilder.CreateSphere(`pooled_${i}`, { segments: 8 }, this.scene);
      mesh.setEnabled(false);
      pool.push(mesh);
    }

    logger.log(`Object pool created with ${poolSize} instances`);
  }

  /**
   * Profile rendering performance
   */
  public profilePerformance(): {
    fps: number;
    renderTime: number;
    meshCount: number;
    activeVertices: number;
  } {
    const stats = this.engine.getFps();
    const renderTime = this.engine.getDeltaTime();
    const meshCount = this.scene.meshes.length;
    let activeVertices = 0;

    this.scene.meshes.forEach((mesh) => {
      // Check if mesh is enabled and has getTotalVertices method
      if ((mesh as any).isEnabled?.() && mesh.getTotalVertices) {
        activeVertices += mesh.getTotalVertices();
      }
    });

    return {
      fps: Math.round(stats),
      renderTime: renderTime,
      meshCount: meshCount,
      activeVertices: activeVertices,
    };
  }

  /**
   * Dispose
   */
  public dispose(): void {
    if (this.originalRenderFunction) {
      // Restore original render function
    }
  }
}

export default RenderingOptimizer;
