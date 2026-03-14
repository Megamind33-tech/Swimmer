/**
 * SWIMMER GAME - TrainingFacilityEnvironment
 * Creates a dry land training facility with equipment
 */

import * as BABYLON from '@babylonjs/core';
import { logger } from '../utils';

export class TrainingFacilityEnvironment {
  private scene: BABYLON.Scene;
  private rootNode: BABYLON.TransformNode | null = null;
  private materials: Map<string, BABYLON.StandardMaterial> = new Map();

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  /**
   * Create entire training facility
   */
  public create(): BABYLON.TransformNode {
    this.rootNode = new BABYLON.TransformNode('trainingFacility', this.scene);

    this.createMaterials();
    this.createFloor();
    this.createWalls();
    this.createWeights();
    this.createTreadmills();
    this.createStretchingArea();
    this.createPullDownMachines();
    this.createLighting();

    logger.log('Training facility environment created');
    return this.rootNode;
  }

  /**
   * Create materials
   */
  private createMaterials(): void {
    // Rubber floor
    const rubberMat = new BABYLON.StandardMaterial('rubberMaterial', this.scene);
    rubberMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    rubberMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    this.materials.set('rubber', rubberMat);

    // Wall
    const wallMat = new BABYLON.StandardMaterial('wallMaterial', this.scene);
    wallMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    this.materials.set('wall', wallMat);

    // Metal
    const metalMat = new BABYLON.StandardMaterial('metalMaterial', this.scene);
    metalMat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    metalMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    metalMat.specularPower = 16;
    this.materials.set('metal', metalMat);

    // Equipment color
    const equipMat = new BABYLON.StandardMaterial('equipMaterial', this.scene);
    equipMat.diffuseColor = new BABYLON.Color3(0.9, 0.1, 0.1);
    equipMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    this.materials.set('equipment', equipMat);
  }

  /**
   * Create floor
   */
  private createFloor(): void {
    if (!this.rootNode) return;

    const floor = BABYLON.MeshBuilder.CreateGround(
      'trainingFloor',
      { width: 50, height: 40 },
      this.scene
    );
    floor.material = this.materials.get('rubber');
    floor.position.y = 0;
    floor.parent = this.rootNode;
  }

  /**
   * Create walls
   */
  private createWalls(): void {
    if (!this.rootNode) return;

    // All walls
    const walls = [
      { pos: new BABYLON.Vector3(0, 1.5, -20), size: { w: 50, h: 3, d: 0.5 } }, // Front
      { pos: new BABYLON.Vector3(0, 1.5, 20), size: { w: 50, h: 3, d: 0.5 } }, // Back
      { pos: new BABYLON.Vector3(-25, 1.5, 0), size: { w: 0.5, h: 3, d: 40 } }, // Left
      { pos: new BABYLON.Vector3(25, 1.5, 0), size: { w: 0.5, h: 3, d: 40 } }, // Right
    ];

    walls.forEach((wall, i) => {
      const mesh = BABYLON.MeshBuilder.CreateBox(`wall_${i}`, { width: wall.size.w, height: wall.size.h, depth: wall.size.d }, this.scene);
      mesh.position = wall.pos;
      mesh.material = this.materials.get('wall');
      mesh.parent = this.rootNode;
    });

    // Ceiling
    const ceiling = BABYLON.MeshBuilder.CreateBox('ceiling', { width: 50, height: 0.3, depth: 40 }, this.scene);
    ceiling.position = new BABYLON.Vector3(0, 3, 0);
    ceiling.material = this.materials.get('wall');
    ceiling.parent = this.rootNode;
  }

  /**
   * Create weight equipment area
   */
  private createWeights(): void {
    if (!this.rootNode) return;

    // Dumbbell rack
    const rackCount = 3;
    for (let rack = 0; rack < rackCount; rack++) {
      const rackZ = -10 + rack * 10;

      // Rack frame
      const frame = BABYLON.MeshBuilder.CreateBox(
        `dumbbell_frame_${rack}`,
        { width: 2, height: 1.8, depth: 0.8 },
        this.scene
      );
      frame.position = new BABYLON.Vector3(-15, 0.9, rackZ);
      frame.material = this.materials.get('metal');
      frame.parent = this.rootNode;

      // Dumbbells
      for (let i = 0; i < 8; i++) {
        const weight = BABYLON.MeshBuilder.CreateCylinder(
          `dumbbell_${rack}_${i}`,
          { height: 0.3, diameter: 0.05 + i * 0.02 },
          this.scene
        );
        weight.position = new BABYLON.Vector3(
          -15 + (i % 4) * 0.5 - 0.75,
          1.2 + Math.floor(i / 4) * 0.6,
          rackZ
        );
        weight.rotation.z = Math.PI / 2;
        const weightMat = new BABYLON.StandardMaterial(`weight_${rack}_${i}`, this.scene);
        weightMat.diffuseColor = new BABYLON.Color3(
          Math.min(1, 0.1 + i * 0.1),
          0.1,
          0.1
        );
        weight.material = weightMat;
        weight.parent = this.rootNode;
      }
    }

    // Barbell rack
    const barbellFrame = BABYLON.MeshBuilder.CreateBox(
      'barbell_frame',
      { width: 2.5, height: 2, depth: 0.8 },
      this.scene
    );
    barbellFrame.position = new BABYLON.Vector3(10, 1, 0);
    barbellFrame.material = this.materials.get('metal');
    barbellFrame.parent = this.rootNode;

    // Barbells on rack
    for (let i = 0; i < 4; i++) {
      const barbell = BABYLON.MeshBuilder.CreateCylinder(
        `barbell_${i}`,
        { height: 0.1, diameter: 0.04, tessellation: 12 },
        this.scene
      );
      barbell.position = new BABYLON.Vector3(10 + (i - 1.5) * 0.7, 1.7 - i * 0.4, 0);
      barbell.rotation.z = Math.PI / 2;
      const barbellMat = new BABYLON.StandardMaterial(`barbellMat_${i}`, this.scene);
      barbellMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
      barbell.material = barbellMat;
      barbell.parent = this.rootNode;
    }
  }

  /**
   * Create treadmills
   */
  private createTreadmills(): void {
    if (!this.rootNode) return;

    const treadmillCount = 4;
    for (let i = 0; i < treadmillCount; i++) {
      const xPos = -10 + i * 5;

      // Treadmill frame
      const frame = BABYLON.MeshBuilder.CreateBox(
        `treadmill_frame_${i}`,
        { width: 0.9, height: 1.2, depth: 2.2 },
        this.scene
      );
      frame.position = new BABYLON.Vector3(xPos, 0.6, 10);
      frame.material = this.materials.get('metal');
      frame.parent = this.rootNode;

      // Running deck
      const deck = BABYLON.MeshBuilder.CreateBox(
        `treadmill_deck_${i}`,
        { width: 0.8, height: 0.1, depth: 1.8 },
        this.scene
      );
      deck.position = new BABYLON.Vector3(xPos, 1, 10);
      const deckMat = new BABYLON.StandardMaterial(`deckMat_${i}`, this.scene);
      deckMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      deck.material = deckMat;
      deck.parent = this.rootNode;

      // Console
      const console = BABYLON.MeshBuilder.CreateBox(
        `treadmill_console_${i}`,
        { width: 0.7, height: 0.4, depth: 0.3 },
        this.scene
      );
      console.position = new BABYLON.Vector3(xPos, 1.4, 9.3);
      const consoleMat = new BABYLON.StandardMaterial(`consoleMat_${i}`, this.scene);
      consoleMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      console.material = consoleMat;
      console.parent = this.rootNode;
    }
  }

  /**
   * Create stretching area with mats
   */
  private createStretchingArea(): void {
    if (!this.rootNode) return;

    const matCount = 6;
    for (let i = 0; i < matCount; i++) {
      const xPos = -12 + i * 5;

      // Yoga mat
      const mat = BABYLON.MeshBuilder.CreateGround(
        `stretchMat_${i}`,
        { width: 1, height: 2 },
        this.scene
      );
      mat.position = new BABYLON.Vector3(xPos, 0.01, -12);
      const matMat = new BABYLON.StandardMaterial(`matMat_${i}`, this.scene);
      matMat.diffuseColor = new BABYLON.Color3(0.2 + Math.random() * 0.3, 0.5, 0.2);
      mat.material = matMat;
      mat.parent = this.rootNode;
    }

    // Stretching bar
    const bar = BABYLON.MeshBuilder.CreateCylinder(
      'stretchBar',
      { height: 0.1, diameter: 0.04, tessellation: 16 },
      this.scene
    );
    bar.position = new BABYLON.Vector3(0, 1.5, -12);
    bar.rotation.z = Math.PI / 2;
    bar.scaling = new BABYLON.Vector3(15, 1, 1);
    const barMat = new BABYLON.StandardMaterial('barMat', this.scene);
    barMat.diffuseColor = new BABYLON.Color3(0.4, 0.2, 0.1);
    bar.material = barMat;
    bar.parent = this.rootNode;
  }

  /**
   * Create lat pulldown and cable machines
   */
  private createPullDownMachines(): void {
    if (!this.rootNode) return;

    const machineCount = 3;
    for (let i = 0; i < machineCount; i++) {
      const xPos = -15 + i * 12;

      // Machine frame
      const frame = BABYLON.MeshBuilder.CreateBox(
        `machine_frame_${i}`,
        { width: 1.2, height: 2.2, depth: 1.2 },
        this.scene
      );
      frame.position = new BABYLON.Vector3(xPos, 1.1, -8);
      frame.material = this.materials.get('equipment');
      frame.parent = this.rootNode;

      // Weight stack
      const weights = BABYLON.MeshBuilder.CreateBox(
        `machine_weights_${i}`,
        { width: 0.8, height: 1.8, depth: 0.8 },
        this.scene
      );
      weights.position = new BABYLON.Vector3(xPos, 1.0, -7);
      const weightsMat = new BABYLON.StandardMaterial(`weightsMat_${i}`, this.scene);
      weightsMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
      weights.material = weightsMat;
      weights.parent = this.rootNode;

      // Seat
      const seat = BABYLON.MeshBuilder.CreateCylinder(
        `machine_seat_${i}`,
        { height: 0.4, diameter: 0.8, tessellation: 16 },
        this.scene
      );
      seat.position = new BABYLON.Vector3(xPos, 0.5, -9);
      const seatMat = new BABYLON.StandardMaterial(`seatMat_${i}`, this.scene);
      seatMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      seat.material = seatMat;
      seat.parent = this.rootNode;

      // Cable
      const cable = BABYLON.MeshBuilder.CreateTube(
        `cable_${i}`,
        {
          path: [
            new BABYLON.Vector3(xPos, 2.0, -8),
            new BABYLON.Vector3(xPos, 0.3, -9),
          ],
          radius: 0.03,
          updatable: false,
        },
        this.scene
      );
      const cableMat = new BABYLON.StandardMaterial(`cableMat_${i}`, this.scene);
      cableMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      cable.material = cableMat;
      cable.parent = this.rootNode;
    }
  }

  /**
   * Create lighting
   */
  private createLighting(): void {
    if (!this.rootNode) return;

    const lights = [
      new BABYLON.Vector3(-15, 2.5, -10),
      new BABYLON.Vector3(0, 2.5, 0),
      new BABYLON.Vector3(15, 2.5, 10),
    ];

    lights.forEach((pos, i) => {
      const light = new BABYLON.PointLight(`trainingLight_${i}`, pos, this.scene);
      light.range = 25;
      light.intensity = 0.8;
    });
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

export default TrainingFacilityEnvironment;
