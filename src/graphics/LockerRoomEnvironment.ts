/**
 * SWIMMER GAME - LockerRoomEnvironment
 * Creates a realistic locker room with benches, lockers, showers, etc.
 */

import * as BABYLON from '@babylonjs/core';
import { logger } from '../utils';

export class LockerRoomEnvironment {
  private scene: BABYLON.Scene;
  private rootNode: BABYLON.TransformNode | null = null;
  private materials: Map<string, BABYLON.StandardMaterial> = new Map();

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  /**
   * Create the entire locker room
   */
  public create(): BABYLON.TransformNode {
    this.rootNode = new BABYLON.TransformNode('lockerRoom', this.scene);

    this.createMaterials();
    this.createFloor();
    this.createWalls();
    this.createLockers();
    this.createBenches();
    this.createShowers();
    this.createWhirlpool();
    this.createLighting();

    logger.log('Locker room environment created');
    return this.rootNode;
  }

  /**
   * Create materials
   */
  private createMaterials(): void {
    // Tile floor
    const tileMat = new BABYLON.StandardMaterial('tileMaterial', this.scene);
    tileMat.diffuse = new BABYLON.Color3(0.7, 0.7, 0.7);
    tileMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    tileMat.specularPower = 16;
    this.materials.set('tile', tileMat);

    // Locker metal
    const metalMat = new BABYLON.StandardMaterial('metalMaterial', this.scene);
    metalMat.diffuse = new BABYLON.Color3(0.4, 0.4, 0.4);
    metalMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    metalMat.specularPower = 32;
    this.materials.set('metal', metalMat);

    // Wood bench
    const woodMat = new BABYLON.StandardMaterial('woodMaterial', this.scene);
    woodMat.diffuse = new BABYLON.Color3(0.6, 0.4, 0.2);
    woodMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    woodMat.specularPower = 8;
    this.materials.set('wood', woodMat);

    // Wall
    const wallMat = new BABYLON.StandardMaterial('wallMaterial', this.scene);
    wallMat.diffuse = new BABYLON.Color3(0.85, 0.85, 0.85);
    wallMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    this.materials.set('wall', wallMat);

    // Ceramic (showers)
    const ceramicMat = new BABYLON.StandardMaterial('ceramicMaterial', this.scene);
    ceramicMat.diffuse = new BABYLON.Color3(0.9, 0.9, 0.9);
    ceramicMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    ceramicMat.specularPower = 20;
    this.materials.set('ceramic', ceramicMat);
  }

  /**
   * Create floor with tiles
   */
  private createFloor(): void {
    if (!this.rootNode) return;

    const floor = BABYLON.MeshBuilder.CreateGround(
      'lockerRoomFloor',
      { width: 40, height: 30 },
      this.scene
    );
    floor.material = this.materials.get('tile');
    floor.position.y = 0;
    floor.parent = this.rootNode;

    // Add tile grid texture
    const floorTexture = new BABYLON.DynamicTexture('floorTex', 512, this.scene);
    const ctx = floorTexture.getContext() as any;
    ctx.fillStyle = '#b0b0b0';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 2;

    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        ctx.strokeRect(i * 32, j * 32, 32, 32);
      }
    }
    floorTexture.update();

    const floorMat = new BABYLON.StandardMaterial('floorMat', this.scene);
    floorMat.diffuse = new BABYLON.Color3(0.75, 0.75, 0.75);
    floorMat.diffuseTexture = floorTexture;
    floor.material = floorMat;
  }

  /**
   * Create walls
   */
  private createWalls(): void {
    if (!this.rootNode) return;

    // Front wall
    const frontWall = BABYLON.MeshBuilder.CreateBox(
      'frontWall',
      { width: 40, height: 3, depth: 0.5 },
      this.scene
    );
    frontWall.position = new BABYLON.Vector3(0, 1.5, -15);
    frontWall.material = this.materials.get('wall');
    frontWall.parent = this.rootNode;

    // Back wall
    const backWall = BABYLON.MeshBuilder.CreateBox(
      'backWall',
      { width: 40, height: 3, depth: 0.5 },
      this.scene
    );
    backWall.position = new BABYLON.Vector3(0, 1.5, 15);
    backWall.material = this.materials.get('wall');
    backWall.parent = this.rootNode;

    // Left wall
    const leftWall = BABYLON.MeshBuilder.CreateBox(
      'leftWall',
      { width: 0.5, height: 3, depth: 30 },
      this.scene
    );
    leftWall.position = new BABYLON.Vector3(-20, 1.5, 0);
    leftWall.material = this.materials.get('wall');
    leftWall.parent = this.rootNode;

    // Right wall
    const rightWall = BABYLON.MeshBuilder.CreateBox(
      'rightWall',
      { width: 0.5, height: 3, depth: 30 },
      this.scene
    );
    rightWall.position = new BABYLON.Vector3(20, 1.5, 0);
    rightWall.material = this.materials.get('wall');
    rightWall.parent = this.rootNode;

    // Ceiling
    const ceiling = BABYLON.MeshBuilder.CreateBox(
      'ceiling',
      { width: 40, height: 0.3, depth: 30 },
      this.scene
    );
    ceiling.position = new BABYLON.Vector3(0, 3, 0);
    ceiling.material = this.materials.get('wall');
    ceiling.parent = this.rootNode;
  }

  /**
   * Create rows of lockers
   */
  private createLockers(): void {
    if (!this.rootNode) return;

    const lockerWidth = 0.8;
    const lockerHeight = 2;
    const lockerDepth = 0.5;
    const loversPerRow = 12;
    const rows = 2;

    for (let row = 0; row < rows; row++) {
      const zPos = -8 + row * 5;

      for (let i = 0; i < loversPerRow; i++) {
        const xPos = -20 + (i * 3.5);

        // Locker body
        const locker = BABYLON.MeshBuilder.CreateBox(
          `locker_${row}_${i}`,
          { width: lockerWidth, height: lockerHeight, depth: lockerDepth },
          this.scene
        );
        locker.position = new BABYLON.Vector3(xPos, lockerHeight / 2 + 0.2, zPos);
        locker.material = this.materials.get('metal');
        locker.parent = this.rootNode;

        // Locker door
        const door = BABYLON.MeshBuilder.CreateBox(
          `lockerDoor_${row}_${i}`,
          { width: lockerWidth - 0.05, height: lockerHeight - 0.1, depth: 0.05 },
          this.scene
        );
        door.position = new BABYLON.Vector3(xPos, lockerHeight / 2 + 0.2, zPos + lockerDepth / 2);
        const doorMat = new BABYLON.StandardMaterial(`doorMat_${row}_${i}`, this.scene);
        doorMat.diffuse = new BABYLON.Color3(0.2 + Math.random() * 0.4, 0.2, 0.4);
        door.material = doorMat;
        door.parent = this.rootNode;
      }
    }
  }

  /**
   * Create benches
   */
  private createBenches(): void {
    if (!this.rootNode) return;

    const benchCount = 4;
    for (let i = 0; i < benchCount; i++) {
      const zPos = -10 + i * 7;

      // Bench seat
      const benchTop = BABYLON.MeshBuilder.CreateBox(
        `benchTop_${i}`,
        { width: 30, height: 0.3, depth: 1.5 },
        this.scene
      );
      benchTop.position = new BABYLON.Vector3(0, 0.5, zPos);
      benchTop.material = this.materials.get('wood');
      benchTop.parent = this.rootNode;

      // Bench legs
      for (let j = 0; j < 4; j++) {
        const xOffset = j < 2 ? -14 : 14;
        const zOffset = j % 2 === 0 ? -0.7 : 0.7;

        const leg = BABYLON.MeshBuilder.CreateCylinder(
          `benchLeg_${i}_${j}`,
          { height: 0.4, diameter: 0.1 },
          this.scene
        );
        leg.position = new BABYLON.Vector3(xOffset, 0.2, zPos + zOffset);
        leg.material = this.materials.get('wood');
        leg.parent = this.rootNode;
      }
    }
  }

  /**
   * Create shower area
   */
  private createShowers(): void {
    if (!this.rootNode) return;

    const showerCount = 8;
    const showerSpacing = 4;

    for (let i = 0; i < showerCount; i++) {
      const xPos = -14 + i * showerSpacing;

      // Shower stall
      const stall = BABYLON.MeshBuilder.CreateBox(
        `showerStall_${i}`,
        { width: 1.8, height: 2.5, depth: 1.5 },
        this.scene
      );
      stall.position = new BABYLON.Vector3(xPos, 1.25, 12);
      stall.material = this.materials.get('ceramic');
      stall.parent = this.rootNode;

      // Shower head (cylinder)
      const showerHead = BABYLON.MeshBuilder.CreateCylinder(
        `showerHead_${i}`,
        { height: 0.2, diameter: 0.3 },
        this.scene
      );
      showerHead.position = new BABYLON.Vector3(xPos, 2.2, 12);
      const headMat = new BABYLON.StandardMaterial(`headMat_${i}`, this.scene);
      headMat.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
      showerHead.material = headMat;
      showerHead.parent = this.rootNode;

      // Shower pipe
      const pipe = BABYLON.MeshBuilder.CreateCylinder(
        `showerPipe_${i}`,
        { height: 0.8, diameter: 0.05 },
        this.scene
      );
      pipe.position = new BABYLON.Vector3(xPos, 2.4, 12);
      pipe.material = headMat;
      pipe.parent = this.rootNode;
    }
  }

  /**
   * Create whirlpool/ice bath area
   */
  private createWhirlpool(): void {
    if (!this.rootNode) return;

    // Whirlpool tub
    const tub = BABYLON.MeshBuilder.CreateCylinder(
      'whirlpoolTub',
      { height: 1.2, diameter: 3, tessellation: 32 },
      this.scene
    );
    tub.position = new BABYLON.Vector3(-15, 0.6, 0);
    const tubMat = new BABYLON.StandardMaterial('tubMat', this.scene);
    tubMat.diffuse = new BABYLON.Color3(0.3, 0.3, 0.3);
    tub.material = tubMat;
    tub.parent = this.rootNode;

    // Water surface
    const water = BABYLON.MeshBuilder.CreateCylinder(
      'whirlpoolWater',
      { height: 0.05, diameter: 2.8, tessellation: 32 },
      this.scene
    );
    water.position = new BABYLON.Vector3(-15, 1.15, 0);
    const waterMat = new BABYLON.StandardMaterial('waterMat', this.scene);
    waterMat.diffuse = new BABYLON.Color3(0.1, 0.5, 0.7);
    waterMat.alpha = 0.7;
    water.material = waterMat;
    water.parent = this.rootNode;

    // Ice bath
    const iceTub = BABYLON.MeshBuilder.CreateCylinder(
      'iceBathTub',
      { height: 1.2, diameter: 2.5, tessellation: 32 },
      this.scene
    );
    iceTub.position = new BABYLON.Vector3(15, 0.6, 0);
    iceTub.material = tubMat;
    iceTub.parent = this.rootNode;

    // Ice water
    const ice = BABYLON.MeshBuilder.CreateCylinder(
      'iceBathWater',
      { height: 0.05, diameter: 2.3, tessellation: 32 },
      this.scene
    );
    ice.position = new BABYLON.Vector3(15, 1.15, 0);
    const iceMat = new BABYLON.StandardMaterial('iceMat', this.scene);
    iceMat.diffuse = new BABYLON.Color3(0.7, 0.9, 1.0);
    iceMat.alpha = 0.8;
    ice.material = iceMat;
    ice.parent = this.rootNode;
  }

  /**
   * Create lighting
   */
  private createLighting(): void {
    if (!this.rootNode) return;

    // Ceiling lights
    const lightCount = 6;
    const lightSpacing = 8;

    for (let i = 0; i < lightCount; i++) {
      const xPos = -15 + i * lightSpacing;

      const lightSphere = BABYLON.MeshBuilder.CreateSphere(
        `lockerRoomLight_${i}`,
        { diameter: 0.5, segments: 16 },
        this.scene
      );
      lightSphere.position = new BABYLON.Vector3(xPos, 2.8, 0);
      const lightMat = new BABYLON.StandardMaterial(`lightMat_${i}`, this.scene);
      lightMat.emissiveColor = new BABYLON.Color3(1, 1, 0.9);
      lightSphere.material = lightMat;
      lightSphere.parent = this.rootNode;

      // Point light
      const pointLight = new BABYLON.PointLight(`lockerRoomPointLight_${i}`, lightSphere.position, this.scene);
      pointLight.range = 20;
      pointLight.intensity = 0.6;
      pointLight.parent = lightSphere;
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

export default LockerRoomEnvironment;
