/**
 * SWIMMER GAME - ArenaManager
 * Babylon.js 3D scene management
 *
 * Responsibilities:
 * - Scene initialization and setup
 * - Venue theming (5 themes with color/lighting variations)
 * - Camera perspectives (4 views)
 * - Lighting and time-of-day system
 * - Water material and caustics
 * - Scoreboard rendering
 * - Performance optimization (LOD, render targets)
 */

import * as BABYLON from '@babylonjs/core';
import {
  IArenaConfig,
  ICameraConfig,
  ILightingConfig,
  PoolTheme,
  CameraView,
  TimeOfDay,
  RaceState,
  ISwimmerRaceState,
} from '../types';
import { logger, isMobileDevice, getDeviceQualityTier } from '../utils';
import { BroadcastCamera } from './BroadcastCamera';

export class ArenaManager {
  private scene: BABYLON.Scene | null = null;
  private engine: BABYLON.Engine | null = null;
  private canvas: HTMLCanvasElement | null = null;

  // Mesh references
  private poolMesh: BABYLON.Mesh | null = null;
  private waterMesh: BABYLON.Mesh | null = null;
  private arenaMesh: BABYLON.TransformNode | null = null;
  private scoreboard: BABYLON.Mesh | null = null;
  private startingBlocks: BABYLON.AbstractMesh[] = [];

  // Camera references
  private cameras: Map<CameraView, BABYLON.ArcRotateCamera> = new Map();
  private currentCamera: BABYLON.ArcRotateCamera | null = null;
  private broadcastCamera: BroadcastCamera | null = null;
  private isBroadcastMode: boolean = false;

  // Lighting
  private lights: BABYLON.Light[] = [];
  private glowyLights: BABYLON.Light[] = [];

  // Materials
  private waterMaterial: BABYLON.Material | null = null;
  private poolMaterial: BABYLON.Material | null = null;

  // Quality settings
  private qualityTier: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
  private isMobile: boolean = false;

  // Arena configuration
  private arenaConfig: IArenaConfig = {
    theme: 'OLYMPIC',
    timeOfDay: 'AFTERNOON',
    poolLength: 50,
    poolWidth: 25,
    laneCount: 8,
    arenaHeight: 45,
  };

  // Rendering state
  private isRendering: boolean = false;
  private renderLoopId: number | null = null;

  constructor(canvasElement: HTMLCanvasElement | string) {
    // Get canvas element
    if (typeof canvasElement === 'string') {
      this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    } else {
      this.canvas = canvasElement;
    }

    if (!this.canvas) {
      throw new Error('Canvas element not found');
    }

    // Detect device capabilities
    this.isMobile = isMobileDevice();
    this.qualityTier = getDeviceQualityTier();

    logger.log(`ArenaManager initialized (${this.qualityTier} quality, mobile: ${this.isMobile})`);
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize Babylon.js engine and scene
   */
  public async initialize(): Promise<void> {
    if (!this.canvas) {
      throw new Error('Canvas not available');
    }

    // Create engine
    this.engine = new BABYLON.Engine(this.canvas, true, {
      antialias: this.qualityTier === 'HIGH',
      adaptToDeviceRatio: true,
      preserveDrawingBuffer: false,
    });

    // Create scene
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.15, 1);
    // Note: collisionsEnabled and physicsEnabled are not valid Scene properties
    // Physics is managed through the physics engine, not scene-level flags

    // Setup environment
    await this.createArena();
    this.createLighting();
    this.createCameras();
    this.createWater();
    this.createScoreboard();

    // Apply initial theme
    this.setTheme(this.arenaConfig.theme);

    // Initialize broadcast camera (but don't activate it yet)
    if (this.canvas) {
      this.broadcastCamera = new BroadcastCamera(this.scene, this.canvas);
      this.broadcastCamera.initialize();
    }

    // Start render loop
    this.startRenderLoop();

    logger.log('ArenaManager initialized successfully');
  }

  /**
   * Create the main swimming pool arena
   */
  private async createArena(): Promise<void> {
    if (!this.scene) return;

    this.arenaMesh = new BABYLON.TransformNode('arena', this.scene);

    // Pool - 50m x 25m x 3m deep
    const poolMesh = BABYLON.MeshBuilder.CreateBox(
      'pool',
      {
        width: this.arenaConfig.poolWidth,
        height: 3,
        depth: this.arenaConfig.poolLength,
      },
      this.scene
    );
    poolMesh.position.y = -1.5;
    poolMesh.parent = this.arenaMesh;
    this.poolMesh = poolMesh;

    // Pool material
    const poolMaterial = new BABYLON.StandardMaterial('poolMaterial', this.scene);
    (poolMaterial as any).diffuseColor = new BABYLON.Color3(0.0, 0.3, 0.7);
    poolMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
    poolMaterial.specularPower = 32;
    poolMesh.material = poolMaterial;
    this.poolMaterial = poolMaterial;

    // Pool walls
    const wallThickness = 0.3;
    const walls = [
      // North wall
      BABYLON.MeshBuilder.CreateBox(
        'wallN',
        { width: this.arenaConfig.poolWidth, height: 3, depth: wallThickness },
        this.scene
      ),
      // South wall
      BABYLON.MeshBuilder.CreateBox(
        'wallS',
        { width: this.arenaConfig.poolWidth, height: 3, depth: wallThickness },
        this.scene
      ),
      // East wall
      BABYLON.MeshBuilder.CreateBox(
        'wallE',
        { width: wallThickness, height: 3, depth: this.arenaConfig.poolLength },
        this.scene
      ),
      // West wall
      BABYLON.MeshBuilder.CreateBox(
        'wallW',
        { width: wallThickness, height: 3, depth: this.arenaConfig.poolLength },
        this.scene
      ),
    ];

    walls[0].position = new BABYLON.Vector3(0, -1.5, this.arenaConfig.poolLength / 2);
    walls[1].position = new BABYLON.Vector3(0, -1.5, -this.arenaConfig.poolLength / 2);
    walls[2].position = new BABYLON.Vector3(this.arenaConfig.poolWidth / 2, -1.5, 0);
    walls[3].position = new BABYLON.Vector3(-this.arenaConfig.poolWidth / 2, -1.5, 0);

    walls.forEach((wall) => {
      wall.material = poolMaterial;
      wall.parent = this.arenaMesh;
    });

    // Arena building (hall)
    const hallMesh = BABYLON.MeshBuilder.CreateBox(
      'hall',
      {
        width: 100,
        height: this.arenaConfig.arenaHeight,
        depth: 140,
      },
      this.scene
    );
    hallMesh.position.y = this.arenaConfig.arenaHeight / 2 - 2;
    hallMesh.isVisible = false; // Use as invisible container
    hallMesh.parent = this.arenaMesh;

    // Deck around pool
    const deckMaterial = new BABYLON.StandardMaterial('deckMaterial', this.scene);
    (deckMaterial as any).diffuseColor = new BABYLON.Color3(0.85, 0.85, 0.85);
    deckMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);

    const deck = BABYLON.MeshBuilder.CreateGround(
      'deck',
      { width: 80, height: 100, subdivisions: 2 },
      this.scene
    );
    deck.position.y = 0;
    deck.material = deckMaterial;
    deck.parent = this.arenaMesh;

    // Starting blocks (8 lanes)
    for (let lane = 0; lane < this.arenaConfig.laneCount; lane++) {
      const blockX = -this.arenaConfig.poolWidth / 2 + (lane * this.arenaConfig.poolWidth) / (this.arenaConfig.laneCount - 1);
      const blockMaterial = new BABYLON.StandardMaterial(`blockMat${lane}`, this.scene);
      (blockMaterial as any).diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);

      const block = BABYLON.MeshBuilder.CreateBox(
        `startBlock${lane}`,
        { width: 0.8, height: 0.8, depth: 0.6 },
        this.scene
      );
      block.position = new BABYLON.Vector3(blockX, 0.4, -this.arenaConfig.poolLength / 2 - 1);
      block.material = blockMaterial;
      block.parent = this.arenaMesh;
      this.startingBlocks.push(block);
    }

    logger.log('Arena created');
  }

  /**
   * Create lighting system
   */
  private createLighting(): void {
    if (!this.scene) return;

    // Hemispheric light (ambient)
    const hemiLight = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0, 1, 0), this.scene);
    hemiLight.intensity = 0.7;
    hemiLight.diffuseColor = new BABYLON.Color3(1, 0.9, 0.7);
    this.lights.push(hemiLight);

    // Point light for intensity
    const pointLight = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 30, 0), this.scene);
    pointLight.range = 100;
    pointLight.intensity = 0.6;
    this.lights.push(pointLight);

    // Fog (subtle)
    this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    this.scene.fogColor = BABYLON.Color3.FromHexString('#1a1a1f');
    this.scene.fogDensity = 0.005;

    logger.log('Lighting created');
  }

  /**
   * Create camera views
   */
  private createCameras(): void {
    if (!this.scene || !this.canvas) return;

    const views: Array<[CameraView, BABYLON.Vector3, BABYLON.Vector3]> = [
      ['DEFAULT', new BABYLON.Vector3(0, 20, -40), new BABYLON.Vector3(0, 5, 0)],
      ['AERIAL', new BABYLON.Vector3(0, 60, 0), new BABYLON.Vector3(0, 0, 0)],
      ['STARTING_BLOCK', new BABYLON.Vector3(0, 3, -30), new BABYLON.Vector3(0, 0, -10)],
      ['RACING', new BABYLON.Vector3(0, 10, -20), new BABYLON.Vector3(0, 5, 0)],
    ];

    views.forEach(([name, position, target]) => {
      const camera = new BABYLON.ArcRotateCamera(
        `camera_${name}`,
        Math.PI,
        Math.PI / 2.5,
        60,
        target,
        this.scene!
      );

      camera.attachControl(this.canvas!, true);
      camera.wheelPrecision = 20;
      // Use correct ArcRotateCamera sensitivity property names
      camera.angularSensibility = 1000;
      camera.inertia = 0.7;
      camera.lowerRadiusLimit = 10;
      camera.upperRadiusLimit = 100;

      this.cameras.set(name, camera);
    });

    // Set default camera
    this.setCamera('DEFAULT');
  }

  /**
   * Set active camera view
   */
  public setCamera(view: CameraView): void {
    if (!this.scene) return;

    const camera = this.cameras.get(view);
    if (!camera) {
      logger.warn('Camera view not found:', view);
      return;
    }

    this.scene.activeCamera = camera;
    this.currentCamera = camera;
    logger.log('Camera set to:', view);
  }

  /**
   * Create water material
   */
  private createWater(): void {
    if (!this.scene || !this.poolMesh) return;

    // Water plane
    const waterPlane = BABYLON.MeshBuilder.CreateGround(
      'water',
      {
        width: this.arenaConfig.poolWidth,
        height: this.arenaConfig.poolLength,
        subdivisions: this.qualityTier === 'HIGH' ? 64 : 32,
      },
      this.scene
    );
    waterPlane.position.y = 0.1;

    // Water material
    const waterMaterial = new BABYLON.StandardMaterial('waterMaterial', this.scene);
    (waterMaterial as any).diffuseColor = new BABYLON.Color3(0.0, 0.4, 0.8);
    waterMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
    waterMaterial.specularPower = 64;
    waterMaterial.alpha = 0.9;

    waterPlane.material = waterMaterial;
    this.waterMesh = waterPlane;
    this.waterMaterial = waterMaterial;

    logger.log('Water created');
  }

  /**
   * Create scoreboard display
   */
  private createScoreboard(): void {
    if (!this.scene) return;

    const scoreboard = BABYLON.MeshBuilder.CreateBox(
      'scoreboard',
      { width: 24, height: 12, depth: 1 },
      this.scene
    );

    scoreboard.position = new BABYLON.Vector3(0, 15, this.arenaConfig.poolLength / 2 + 5);

    // Scoreboard material with dynamic texture
    const dynamicTexture = new BABYLON.DynamicTexture('scoreboardTexture', 1024, this.scene);
    const ctx = dynamicTexture.getContext() as any as CanvasRenderingContext2D;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1024, 512);

    dynamicTexture.update();

    const scoreboardMaterial = new BABYLON.StandardMaterial('scoreboardMaterial', this.scene);
    scoreboardMaterial.emissiveTexture = dynamicTexture;
    scoreboardMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

    scoreboard.material = scoreboardMaterial;
    this.scoreboard = scoreboard;

    logger.log('Scoreboard created');
  }

  /**
   * Update scoreboard display
   */
  public updateScoreboard(leaderboard: Array<{ rank: number; name: string; time: number }>): void {
    if (!this.scoreboard || !this.scoreboard.material) return;

    const material = this.scoreboard.material as BABYLON.StandardMaterial;
    const texture = material.emissiveTexture as BABYLON.DynamicTexture;

    if (!texture) return;

    const ctx = texture.getContext() as any as CanvasRenderingContext2D;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1024, 512);

    // Draw leaderboard
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'left';

    leaderboard.slice(0, 3).forEach((entry, index) => {
      const y = 80 + index * 120;
      const color = ['#FFD700', '#C0C0C0', '#CD7F32'][index]; // Gold, Silver, Bronze

      ctx.fillStyle = color;
      ctx.fillText(`${entry.rank}. ${entry.name}`, 50, y);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '36px Arial';
      ctx.fillText(entry.time.toFixed(2) + 's', 50, y + 60);
    });

    texture.update();
  }

  /**
   * Set theme (color scheme)
   */
  public setTheme(theme: PoolTheme): void {
    this.arenaConfig.theme = theme;

    if (!this.poolMaterial) return;

    const themes: Record<PoolTheme, BABYLON.Color3> = {
      OLYMPIC: new BABYLON.Color3(0.0, 0.3, 0.7),
      CHAMPIONSHIP: new BABYLON.Color3(0.1, 0.2, 0.5),
      NEON: new BABYLON.Color3(0.0, 1.0, 1.0),
      SUNSET: new BABYLON.Color3(1.0, 0.5, 0.0),
      CUSTOM: new BABYLON.Color3(0.5, 0.5, 0.5),
    };

    if (this.poolMaterial) {
      (this.poolMaterial as any).diffuseColor = themes[theme];
    }

    logger.log('Theme set to:', theme);
  }

  /**
   * Set time of day (lighting variation)
   */
  public setTimeOfDay(time: TimeOfDay): void {
    this.arenaConfig.timeOfDay = time;

    if (this.lights.length === 0) return;

    const lightConfigs: Record<TimeOfDay, { color: BABYLON.Color3; intensity: number }> = {
      MORNING: { color: new BABYLON.Color3(1, 0.9, 0.7), intensity: 0.8 },
      AFTERNOON: { color: new BABYLON.Color3(1, 1, 1), intensity: 1.0 },
      EVENING: { color: new BABYLON.Color3(1, 0.5, 0.3), intensity: 0.6 },
      NIGHT: { color: new BABYLON.Color3(0.2, 0.2, 0.5), intensity: 0.2 },
    };

    const config = lightConfigs[time];
    this.lights[0].diffuseColor = config.color;
    this.lights[0].intensity = config.intensity;

    logger.log('Time of day set to:', time);
  }

  // ============================================================================
  // RENDERING
  // ============================================================================

  /**
   * Start render loop
   */
  private startRenderLoop(): void {
    if (!this.engine) return;

    this.isRendering = true;
    let frameCount = 0;
    let lastFrameTime = performance.now();

    const renderLoop = () => {
      frameCount++;
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;
      lastFrameTime = currentTime;

      if (this.scene) {
        // Update water animation (simple)
        if (this.waterMesh && frameCount % 2 === 0) {
          this.waterMesh.rotation.z += 0.001;
        }

        // Update broadcast camera if active
        if (this.isBroadcastMode && this.broadcastCamera) {
          this.broadcastCamera.update(deltaTime);
        }

        this.scene.render();
      }

      this.renderLoopId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    logger.log('Render loop started');
  }

  /**
   * Stop render loop
   */
  public stopRenderLoop(): void {
    if (this.renderLoopId !== null) {
      cancelAnimationFrame(this.renderLoopId);
      this.isRendering = false;
      this.renderLoopId = null;
      logger.log('Render loop stopped');
    }
  }

  /**
   * Resize canvas when window resizes
   */
  public resize(): void {
    if (this.engine) {
      this.engine.resize();
    }
  }

  // ============================================================================
  // BROADCAST CAMERA CONTROL
  // ============================================================================

  /**
   * Enable broadcast camera mode (for races)
   */
  public enableBroadcastMode(): void {
    if (!this.broadcastCamera || !this.scene) return;

    this.isBroadcastMode = true;
    this.scene.activeCamera = this.broadcastCamera['currentCamera'];
    logger.log('Broadcast camera mode enabled');
  }

  /**
   * Disable broadcast camera mode (return to manual control)
   */
  public disableBroadcastMode(): void {
    if (!this.scene) return;

    this.isBroadcastMode = false;
    this.scene.activeCamera = this.currentCamera;
    logger.log('Broadcast camera mode disabled');
  }

  /**
   * Update broadcast camera with race state
   */
  public updateBroadcastCameraRace(
    raceState: RaceState,
    playerSwimmer?: ISwimmerRaceState
  ): void {
    if (!this.broadcastCamera) return;

    this.broadcastCamera.onRaceStateChange(raceState, playerSwimmer);
  }

  /**
   * Notify broadcast camera of race progress
   */
  public notifyBroadcastCameraProgress(data: {
    leader: string;
    leaderPosition: number;
    time: number;
  }): void {
    if (!this.broadcastCamera) return;

    this.broadcastCamera.onRaceProgress(data);
  }

  /**
   * Notify broadcast camera of swimmer finish
   */
  public notifyBroadcastCameraFinish(data: {
    name: string;
    rank: number;
    time: number;
  }): void {
    if (!this.broadcastCamera) return;

    this.broadcastCamera.onSwimmerFinished(data);
  }

  /**
   * Get broadcast camera instance
   */
  public getBroadcastCamera(): BroadcastCamera | null {
    return this.broadcastCamera;
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  /**
   * Dispose of all resources
   */
  public dispose(): void {
    this.stopRenderLoop();

    if (this.broadcastCamera) {
      this.broadcastCamera.dispose();
    }

    if (this.scene) {
      this.scene.dispose();
    }

    if (this.engine) {
      this.engine.dispose();
    }

    logger.log('ArenaManager disposed');
  }

  // ============================================================================
  // GETTERS
  // ============================================================================

  public getScene(): BABYLON.Scene | null {
    return this.scene;
  }

  public getEngine(): BABYLON.Engine | null {
    return this.engine;
  }

  public getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  public getArenaConfig(): IArenaConfig {
    return { ...this.arenaConfig };
  }

  public getQualityTier(): 'LOW' | 'MEDIUM' | 'HIGH' {
    return this.qualityTier;
  }

  public isRenderingActive(): boolean {
    return this.isRendering;
  }
}

export default ArenaManager;
