/**
 * SWIMMER GAME - SchoolGymEnvironment
 * Creates a school swimming gym with basic facilities
 */

import * as BABYLON from '@babylonjs/core';
import { logger } from '../utils';

export class SchoolGymEnvironment {
  private scene: BABYLON.Scene;
  private rootNode: BABYLON.TransformNode | null = null;
  private materials: Map<string, BABYLON.StandardMaterial> = new Map();

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  /**
   * Create school gym environment
   */
  public create(): BABYLON.TransformNode {
    this.rootNode = new BABYLON.TransformNode('schoolGym', this.scene);

    this.createMaterials();
    this.createFloor();
    this.createWalls();
    this.createPool();
    this.createBleachers();
    this.createEquipmentStorage();
    this.createLighting();

    logger.log('School gym environment created');
    return this.rootNode;
  }

  /**
   * Create materials
   */
  private createMaterials(): void {
    // Polished floor
    const floorMat = new BABYLON.StandardMaterial('floorMaterial', this.scene);
    floorMat.diffuseColor = new BABYLON.Color3(0.8, 0.75, 0.7);
    floorMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    this.materials.set('floor', floorMat);

    // Wall
    const wallMat = new BABYLON.StandardMaterial('wallMaterial', this.scene);
    wallMat.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    wallMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    this.materials.set('wall', wallMat);

    // Pool water
    const waterMat = new BABYLON.StandardMaterial('waterMaterial', this.scene);
    waterMat.diffuseColor = new BABYLON.Color3(0.1, 0.5, 0.8);
    waterMat.alpha = 0.8;
    this.materials.set('water', waterMat);

    // Bleachers
    const bleacherMat = new BABYLON.StandardMaterial('bleacherMaterial', this.scene);
    bleacherMat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    this.materials.set('bleacher', bleacherMat);

    // Storage
    const storageMat = new BABYLON.StandardMaterial('storageMaterial', this.scene);
    storageMat.diffuseColor = new BABYLON.Color3(0.5, 0.3, 0.2);
    this.materials.set('storage', storageMat);
  }

  /**
   * Create floor
   */
  private createFloor(): void {
    if (!this.rootNode) return;

    const floor = BABYLON.MeshBuilder.CreateGround(
      'gymFloor',
      { width: 60, height: 50 },
      this.scene
    );
    floor.material = this.materials.get('floor');
    floor.position.y = 0;
    floor.parent = this.rootNode;
  }

  /**
   * Create walls
   */
  private createWalls(): void {
    if (!this.rootNode) return;

    const wallConfigs = [
      { pos: new BABYLON.Vector3(0, 2, -25), size: { w: 60, h: 4, d: 0.5 } },
      { pos: new BABYLON.Vector3(0, 2, 25), size: { w: 60, h: 4, d: 0.5 } },
      { pos: new BABYLON.Vector3(-30, 2, 0), size: { w: 0.5, h: 4, d: 50 } },
      { pos: new BABYLON.Vector3(30, 2, 0), size: { w: 0.5, h: 4, d: 50 } },
    ];

    wallConfigs.forEach((cfg, i) => {
      const wall = BABYLON.MeshBuilder.CreateBox(`wall_${i}`, { width: cfg.size.w, height: cfg.size.h, depth: cfg.size.d }, this.scene);
      wall.position = cfg.pos;
      wall.material = this.materials.get('wall');
      wall.parent = this.rootNode;
    });

    // Ceiling
    const ceiling = BABYLON.MeshBuilder.CreateBox('ceiling', { width: 60, height: 0.5, depth: 50 }, this.scene);
    ceiling.position = new BABYLON.Vector3(0, 4, 0);
    ceiling.material = this.materials.get('wall');
    ceiling.parent = this.rootNode;
  }

  /**
   * Create pool
   */
  private createPool(): void {
    if (!this.rootNode) return;

    // Pool basin
    const pool = BABYLON.MeshBuilder.CreateBox(
      'poolBasin',
      { width: 25, height: 1.5, depth: 30 },
      this.scene
    );
    pool.position = new BABYLON.Vector3(-5, -0.75, 0);
    const poolMat = new BABYLON.StandardMaterial('poolMat', this.scene);
    poolMat.diffuseColor = new BABYLON.Color3(0.1, 0.4, 0.6);
    pool.material = poolMat;
    pool.parent = this.rootNode;

    // Pool water surface
    const water = BABYLON.MeshBuilder.CreateGround(
      'poolWater',
      { width: 24, height: 29 },
      this.scene
    );
    water.position = new BABYLON.Vector3(-5, 0.7, 0);
    water.material = this.materials.get('water');
    water.parent = this.rootNode;

    // Lane dividers
    const laneCount = 6;
    const laneWidth = 24 / laneCount;

    for (let i = 1; i < laneCount; i++) {
      const rope = BABYLON.MeshBuilder.CreateCylinder(
        `laneRope_${i}`,
        { height: 0.1, diameter: 0.3, tessellation: 16 },
        this.scene
      );
      rope.position = new BABYLON.Vector3(-5 - 12 + i * laneWidth, 0.75, 0);
      const ropeMat = new BABYLON.StandardMaterial(`ropeMat_${i}`, this.scene);
      ropeMat.diffuseColor = new BABYLON.Color3(1, 0.8, 0);
      rope.material = ropeMat;
      rope.parent = this.rootNode;
    }

    // Starting blocks
    for (let i = 0; i < laneCount; i++) {
      const block = BABYLON.MeshBuilder.CreateBox(
        `startBlock_${i}`,
        { width: 0.8, height: 0.6, depth: 0.8 },
        this.scene
      );
      block.position = new BABYLON.Vector3(
        -5 - 12 + (i + 0.5) * laneWidth,
        0.3,
        -14.5
      );
      const blockMat = new BABYLON.StandardMaterial(`blockMat_${i}`, this.scene);
      blockMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
      block.material = blockMat;
      block.parent = this.rootNode;
    }
  }

  /**
   * Create bleachers
   */
  private createBleachers(): void {
    if (!this.rootNode) return;

    const rowCount = 8;
    const seatsPerRow = 20;

    for (let row = 0; row < rowCount; row++) {
      const zPos = 8 + row * 1.5;

      for (let seat = 0; seat < seatsPerRow; seat++) {
        const xPos = -19 + (seat * 1.9);

        const seatBox = BABYLON.MeshBuilder.CreateBox(
          `seat_${row}_${seat}`,
          { width: 0.6, height: 0.4, depth: 0.6 },
          this.scene
        );
        seatBox.position = new BABYLON.Vector3(xPos, row * 0.7 + 0.5, zPos);
        seatBox.material = this.materials.get('bleacher');
        seatBox.parent = this.rootNode;
      }
    }
  }

  /**
   * Create equipment storage area
   */
  private createEquipmentStorage(): void {
    if (!this.rootNode) return;

    // Storage shed
    const shed = BABYLON.MeshBuilder.CreateBox(
      'equipmentShed',
      { width: 8, height: 3, depth: 6 },
      this.scene
    );
    shed.position = new BABYLON.Vector3(22, 1.5, -15);
    shed.material = this.materials.get('storage');
    shed.parent = this.rootNode;

    // Doors
    const door1 = BABYLON.MeshBuilder.CreateBox(
      'door1',
      { width: 1.8, height: 2.5, depth: 0.2 },
      this.scene
    );
    door1.position = new BABYLON.Vector3(20, 1.5, -12.2);
    const doorMat = new BABYLON.StandardMaterial('doorMat', this.scene);
    doorMat.diffuseColor = new BABYLON.Color3(0.3, 0.2, 0.1);
    door1.material = doorMat;
    door1.parent = this.rootNode;

    const door2 = BABYLON.MeshBuilder.CreateBox('door2', { width: 1.8, height: 2.5, depth: 0.2 }, this.scene);
    door2.position = new BABYLON.Vector3(24, 1.5, -12.2);
    door2.material = doorMat;
    door2.parent = this.rootNode;

    // Equipment racks inside
    const rackCount = 4;
    for (let i = 0; i < rackCount; i++) {
      const rack = BABYLON.MeshBuilder.CreateBox(
        `rack_${i}`,
        { width: 2, height: 2, depth: 1 },
        this.scene
      );
      rack.position = new BABYLON.Vector3(18 + i * 2.5, 1, -15);
      const rackMat = new BABYLON.StandardMaterial(`rackMat_${i}`, this.scene);
      rackMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
      rack.material = rackMat;
      rack.parent = this.rootNode;
    }
  }

  /**
   * Create lighting
   */
  private createLighting(): void {
    if (!this.rootNode) return;

    const gridSize = 3;
    const spacing = 20;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const xPos = -20 + i * spacing;
        const zPos = -15 + j * spacing;

        const lightSphere = BABYLON.MeshBuilder.CreateSphere(
          `gymLight_${i}_${j}`,
          { diameter: 0.6, segments: 16 },
          this.scene
        );
        lightSphere.position = new BABYLON.Vector3(xPos, 3.8, zPos);
        const lightMat = new BABYLON.StandardMaterial(`lightMat_${i}_${j}`, this.scene);
        lightMat.emissiveColor = new BABYLON.Color3(1, 1, 0.95);
        lightSphere.material = lightMat;
        lightSphere.parent = this.rootNode;

        const pointLight = new BABYLON.PointLight(
          `gymPointLight_${i}_${j}`,
          lightSphere.position,
          this.scene
        );
        pointLight.range = 30;
        pointLight.intensity = 0.7;
      }
    }
  }

  /**
   * Get root node
   */
  public getRoot(): BABYLON.TransformNode | null {
    return this.rootNode;
  }

  /**
   * Dispose
   */
  public dispose(): void {
    if (this.rootNode) {
      this.rootNode.dispose();
    }
    this.materials.forEach((mat) => mat.dispose());
    this.materials.clear();
  }
}

export default SchoolGymEnvironment;
