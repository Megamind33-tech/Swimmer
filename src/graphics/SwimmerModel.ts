/**
 * SWIMMER GAME - SwimmerModel (Refined)
 * Procedural 3D swimmer model builder with realistic proportions
 *
 * Creates a realistic swimmer with:
 * - Proper anatomical proportions
 * - Separate arm segments for realistic animation
 * - Detailed leg geometry for flutter kick
 * - Swimming cap and goggles
 * - Customizable colors and materials
 */

import * as BABYLON from '@babylonjs/core';
import { logger } from '../utils';

export interface SwimmerConfig {
  suitColor?: BABYLON.Color3;
  capColor?: BABYLON.Color3;
  goggleColor?: BABYLON.Color3;
  scale?: number;
  skinTone?: BABYLON.Color3;
}

export class SwimmerModel {
  private mesh: BABYLON.TransformNode | null = null;
  private scene: BABYLON.Scene;

  // Body parts (for animation)
  private head: BABYLON.Mesh | null = null;
  private torso: BABYLON.Mesh | null = null;
  private pelvis: BABYLON.Mesh | null = null;

  // Arms (separated for realistic animation)
  private leftShoulder: BABYLON.Mesh | null = null;
  private leftUpperArm: BABYLON.Mesh | null = null;
  private leftForearm: BABYLON.Mesh | null = null;
  private leftHand: BABYLON.Mesh | null = null;

  private rightShoulder: BABYLON.Mesh | null = null;
  private rightUpperArm: BABYLON.Mesh | null = null;
  private rightForearm: BABYLON.Mesh | null = null;
  private rightHand: BABYLON.Mesh | null = null;

  // Legs (separated for flutter kick)
  private leftHip: BABYLON.Mesh | null = null;
  private leftThigh: BABYLON.Mesh | null = null;
  private leftCalf: BABYLON.Mesh | null = null;
  private leftFoot: BABYLON.Mesh | null = null;

  private rightHip: BABYLON.Mesh | null = null;
  private rightThigh: BABYLON.Mesh | null = null;
  private rightCalf: BABYLON.Mesh | null = null;
  private rightFoot: BABYLON.Mesh | null = null;

  // Accessories
  private cap: BABYLON.Mesh | null = null;
  private goggles: BABYLON.Mesh | null = null;

  // Cached materials
  private suitMaterial: BABYLON.StandardMaterial | null = null;
  private capMaterial: BABYLON.StandardMaterial | null = null;
  private goggleMaterial: BABYLON.StandardMaterial | null = null;
  private skinMaterial: BABYLON.StandardMaterial | null = null;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  /**
   * Create a swimmer model with customizable appearance
   */
  public create(config: SwimmerConfig = {}): BABYLON.TransformNode {
    const defaults: SwimmerConfig = {
      suitColor: new BABYLON.Color3(0.0, 0.2, 0.8), // Blue suit
      capColor: new BABYLON.Color3(1.0, 1.0, 1.0),  // White cap
      goggleColor: new BABYLON.Color3(0.1, 0.1, 0.1), // Black goggles
      scale: 1.0,
      skinTone: new BABYLON.Color3(0.95, 0.8, 0.7), // Natural skin tone
    };

    const finalConfig = { ...defaults, ...config };

    // Create main transform node for the swimmer
    this.mesh = new BABYLON.TransformNode('swimmer', this.scene);
    this.mesh.scaling = new BABYLON.Vector3(finalConfig.scale!, finalConfig.scale!, finalConfig.scale!);

    // Create materials
    this.createMaterials(finalConfig);

    // Build body parts
    this.createHead(finalConfig);
    this.createTorso(finalConfig);
    this.createPelvis(finalConfig);
    this.createArms(finalConfig);
    this.createLegs(finalConfig);
    this.createCap(finalConfig);
    this.createGoggles(finalConfig);

    logger.log('Refined swimmer model created');
    return this.mesh;
  }

  /**
   * Create materials for different body parts
   */
  private createMaterials(config: SwimmerConfig): void {
    // Suit material
    this.suitMaterial = new BABYLON.StandardMaterial('suitMaterial', this.scene);
    this.suitMaterial.diffuse = config.suitColor!;
    this.suitMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    this.suitMaterial.specularPower = 24;
    this.suitMaterial.alpha = 0.95;

    // Cap material
    this.capMaterial = new BABYLON.StandardMaterial('capMaterial', this.scene);
    this.capMaterial.diffuse = config.capColor!;
    this.capMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    this.capMaterial.specularPower = 12;

    // Goggle material (lens)
    this.goggleMaterial = new BABYLON.StandardMaterial('goggleMaterial', this.scene);
    this.goggleMaterial.diffuse = config.goggleColor!;
    this.goggleMaterial.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    this.goggleMaterial.specularPower = 48;
    this.goggleMaterial.alpha = 0.7;

    // Skin material
    this.skinMaterial = new BABYLON.StandardMaterial('skinMaterial', this.scene);
    this.skinMaterial.diffuse = config.skinTone!;
    this.skinMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    this.skinMaterial.specularPower = 16;
  }

  /**
   * Create head (improved)
   */
  private createHead(config: SwimmerConfig): void {
    if (!this.mesh) return;

    // Main head
    this.head = BABYLON.MeshBuilder.CreateSphere(
      'head',
      { diameter: 0.22, segments: 24 },
      this.scene
    );
    this.head.position = new BABYLON.Vector3(0, 1.0, 0);
    this.head.material = this.skinMaterial;
    this.head.parent = this.mesh;
  }

  /**
   * Create torso (realistic proportions)
   */
  private createTorso(config: SwimmerConfig): void {
    if (!this.mesh) return;

    // Main torso - ellipsoid shape
    this.torso = BABYLON.MeshBuilder.CreateCylinder(
      'torso',
      { height: 0.8, diameter: 0.32, tessellation: 20 },
      this.scene
    );
    this.torso.position = new BABYLON.Vector3(0, 0.35, 0);
    this.torso.scaling = new BABYLON.Vector3(0.95, 1.0, 0.75);
    this.torso.material = this.suitMaterial;
    this.torso.parent = this.mesh;

    // Chest definition
    const chest = BABYLON.MeshBuilder.CreateSphere(
      'chest',
      { diameter: 0.35, segments: 16 },
      this.scene
    );
    chest.position = new BABYLON.Vector3(0, 0.5, 0);
    chest.scaling = new BABYLON.Vector3(1.0, 0.8, 0.7);
    chest.material = this.suitMaterial;
    chest.parent = this.mesh;
  }

  /**
   * Create pelvis (lower body foundation)
   */
  private createPelvis(config: SwimmerConfig): void {
    if (!this.mesh) return;

    this.pelvis = BABYLON.MeshBuilder.CreateCylinder(
      'pelvis',
      { height: 0.3, diameter: 0.28, tessellation: 16 },
      this.scene
    );
    this.pelvis.position = new BABYLON.Vector3(0, -0.05, 0);
    this.pelvis.material = this.suitMaterial;
    this.pelvis.parent = this.mesh;
  }

  /**
   * Create arms with proper segments for animation
   */
  private createArms(config: SwimmerConfig): void {
    if (!this.mesh) return;

    // LEFT ARM
    // Shoulder
    this.leftShoulder = BABYLON.MeshBuilder.CreateSphere(
      'leftShoulder',
      { diameter: 0.15, segments: 12 },
      this.scene
    );
    this.leftShoulder.position = new BABYLON.Vector3(-0.18, 0.65, 0);
    this.leftShoulder.material = this.skinMaterial;
    this.leftShoulder.parent = this.mesh;

    // Upper arm
    this.leftUpperArm = BABYLON.MeshBuilder.CreateCylinder(
      'leftUpperArm',
      { height: 0.35, diameter: 0.12, tessellation: 12 },
      this.scene
    );
    this.leftUpperArm.position = new BABYLON.Vector3(-0.25, 0.5, 0);
    this.leftUpperArm.rotation.z = Math.PI / 5;
    this.leftUpperArm.material = this.skinMaterial;
    this.leftUpperArm.parent = this.mesh;

    // Forearm
    this.leftForearm = BABYLON.MeshBuilder.CreateCylinder(
      'leftForearm',
      { height: 0.32, diameter: 0.1, tessellation: 12 },
      this.scene
    );
    this.leftForearm.position = new BABYLON.Vector3(-0.42, 0.2, 0);
    this.leftForearm.rotation.z = Math.PI / 3;
    this.leftForearm.material = this.skinMaterial;
    this.leftForearm.parent = this.mesh;

    // Hand
    this.leftHand = BABYLON.MeshBuilder.CreateBox(
      'leftHand',
      { width: 0.1, height: 0.08, depth: 0.15 },
      this.scene
    );
    this.leftHand.position = new BABYLON.Vector3(-0.5, 0.0, 0.05);
    this.leftHand.material = this.skinMaterial;
    this.leftHand.parent = this.mesh;

    // RIGHT ARM
    // Shoulder
    this.rightShoulder = BABYLON.MeshBuilder.CreateSphere(
      'rightShoulder',
      { diameter: 0.15, segments: 12 },
      this.scene
    );
    this.rightShoulder.position = new BABYLON.Vector3(0.18, 0.65, 0);
    this.rightShoulder.material = this.skinMaterial;
    this.rightShoulder.parent = this.mesh;

    // Upper arm
    this.rightUpperArm = BABYLON.MeshBuilder.CreateCylinder(
      'rightUpperArm',
      { height: 0.35, diameter: 0.12, tessellation: 12 },
      this.scene
    );
    this.rightUpperArm.position = new BABYLON.Vector3(0.25, 0.5, 0);
    this.rightUpperArm.rotation.z = -Math.PI / 5;
    this.rightUpperArm.material = this.skinMaterial;
    this.rightUpperArm.parent = this.mesh;

    // Forearm
    this.rightForearm = BABYLON.MeshBuilder.CreateCylinder(
      'rightForearm',
      { height: 0.32, diameter: 0.1, tessellation: 12 },
      this.scene
    );
    this.rightForearm.position = new BABYLON.Vector3(0.42, 0.2, 0);
    this.rightForearm.rotation.z = -Math.PI / 3;
    this.rightForearm.material = this.skinMaterial;
    this.rightForearm.parent = this.mesh;

    // Hand
    this.rightHand = BABYLON.MeshBuilder.CreateBox(
      'rightHand',
      { width: 0.1, height: 0.08, depth: 0.15 },
      this.scene
    );
    this.rightHand.position = new BABYLON.Vector3(0.5, 0.0, 0.05);
    this.rightHand.material = this.skinMaterial;
    this.rightHand.parent = this.mesh;
  }

  /**
   * Create legs with proper segments for flutter kick
   */
  private createLegs(config: SwimmerConfig): void {
    if (!this.mesh) return;

    // LEFT LEG
    // Hip joint
    this.leftHip = BABYLON.MeshBuilder.CreateSphere(
      'leftHip',
      { diameter: 0.12, segments: 10 },
      this.scene
    );
    this.leftHip.position = new BABYLON.Vector3(-0.1, -0.1, 0);
    this.leftHip.material = this.skinMaterial;
    this.leftHip.parent = this.mesh;

    // Thigh
    this.leftThigh = BABYLON.MeshBuilder.CreateCylinder(
      'leftThigh',
      { height: 0.45, diameter: 0.13, tessellation: 12 },
      this.scene
    );
    this.leftThigh.position = new BABYLON.Vector3(-0.1, -0.35, 0);
    this.leftThigh.material = this.suitMaterial;
    this.leftThigh.parent = this.mesh;

    // Calf
    this.leftCalf = BABYLON.MeshBuilder.CreateCylinder(
      'leftCalf',
      { height: 0.4, diameter: 0.11, tessellation: 12 },
      this.scene
    );
    this.leftCalf.position = new BABYLON.Vector3(-0.1, -0.65, 0);
    this.leftCalf.material = this.suitMaterial;
    this.leftCalf.parent = this.mesh;

    // Foot (flipper-like)
    this.leftFoot = BABYLON.MeshBuilder.CreateBox(
      'leftFoot',
      { width: 0.18, height: 0.1, depth: 0.28 },
      this.scene
    );
    this.leftFoot.position = new BABYLON.Vector3(-0.1, -0.88, 0);
    this.leftFoot.material = this.suitMaterial;
    this.leftFoot.parent = this.mesh;

    // RIGHT LEG
    // Hip joint
    this.rightHip = BABYLON.MeshBuilder.CreateSphere(
      'rightHip',
      { diameter: 0.12, segments: 10 },
      this.scene
    );
    this.rightHip.position = new BABYLON.Vector3(0.1, -0.1, 0);
    this.rightHip.material = this.skinMaterial;
    this.rightHip.parent = this.mesh;

    // Thigh
    this.rightThigh = BABYLON.MeshBuilder.CreateCylinder(
      'rightThigh',
      { height: 0.45, diameter: 0.13, tessellation: 12 },
      this.scene
    );
    this.rightThigh.position = new BABYLON.Vector3(0.1, -0.35, 0);
    this.rightThigh.material = this.suitMaterial;
    this.rightThigh.parent = this.mesh;

    // Calf
    this.rightCalf = BABYLON.MeshBuilder.CreateCylinder(
      'rightCalf',
      { height: 0.4, diameter: 0.11, tessellation: 12 },
      this.scene
    );
    this.rightCalf.position = new BABYLON.Vector3(0.1, -0.65, 0);
    this.rightCalf.material = this.suitMaterial;
    this.rightCalf.parent = this.mesh;

    // Foot (flipper-like)
    this.rightFoot = BABYLON.MeshBuilder.CreateBox(
      'rightFoot',
      { width: 0.18, height: 0.1, depth: 0.28 },
      this.scene
    );
    this.rightFoot.position = new BABYLON.Vector3(0.1, -0.88, 0);
    this.rightFoot.material = this.suitMaterial;
    this.rightFoot.parent = this.mesh;
  }

  /**
   * Create swimming cap
   */
  private createCap(config: SwimmerConfig): void {
    if (!this.mesh) return;

    // Cap covers upper head
    this.cap = BABYLON.MeshBuilder.CreateSphere(
      'cap',
      { diameter: 0.25, segments: 20 },
      this.scene
    );
    this.cap.position = new BABYLON.Vector3(0, 1.08, 0);
    this.cap.scaling = new BABYLON.Vector3(1.05, 0.75, 1.0);
    this.cap.material = this.capMaterial;
    this.cap.parent = this.mesh;
  }

  /**
   * Create goggles (improved)
   */
  private createGoggles(config: SwimmerConfig): void {
    if (!this.mesh) return;

    // Left goggle lens
    this.goggles = BABYLON.MeshBuilder.CreateSphere(
      'leftGoggle',
      { diameter: 0.12, segments: 12 },
      this.scene
    );
    this.goggles.position = new BABYLON.Vector3(-0.08, 1.0, 0.18);
    this.goggles.material = this.goggleMaterial;
    this.goggles.parent = this.mesh;

    // Right goggle lens
    const rightGoggle = BABYLON.MeshBuilder.CreateSphere(
      'rightGoggle',
      { diameter: 0.12, segments: 12 },
      this.scene
    );
    rightGoggle.position = new BABYLON.Vector3(0.08, 1.0, 0.18);
    rightGoggle.material = this.goggleMaterial;
    rightGoggle.parent = this.mesh;

    // Goggle bridge
    const goggleBridge = BABYLON.MeshBuilder.CreateBox(
      'goggleBridge',
      { width: 0.18, height: 0.04, depth: 0.08 },
      this.scene
    );
    goggleBridge.position = new BABYLON.Vector3(0, 1.0, 0.16);
    goggleBridge.material = this.capMaterial;
    goggleBridge.parent = this.mesh;

    // Goggle strap
    const goggleStrap = BABYLON.MeshBuilder.CreateCylinder(
      'goggleStrap',
      { height: 0.28, diameter: 0.04, tessellation: 8 },
      this.scene
    );
    goggleStrap.position = new BABYLON.Vector3(0, 0.95, 0.1);
    goggleStrap.rotation.z = Math.PI / 2;
    goggleStrap.material = this.capMaterial;
    goggleStrap.parent = this.mesh;
  }

  /**
   * Get the root mesh
   */
  public getMesh(): BABYLON.TransformNode | null {
    return this.mesh;
  }

  /**
   * Get body parts for animation
   */
  public getBodyParts() {
    return {
      head: this.head,
      torso: this.torso,
      pelvis: this.pelvis,
      leftShoulder: this.leftShoulder,
      leftUpperArm: this.leftUpperArm,
      leftForearm: this.leftForearm,
      leftHand: this.leftHand,
      rightShoulder: this.rightShoulder,
      rightUpperArm: this.rightUpperArm,
      rightForearm: this.rightForearm,
      rightHand: this.rightHand,
      leftHip: this.leftHip,
      leftThigh: this.leftThigh,
      leftCalf: this.leftCalf,
      leftFoot: this.leftFoot,
      rightHip: this.rightHip,
      rightThigh: this.rightThigh,
      rightCalf: this.rightCalf,
      rightFoot: this.rightFoot,
      cap: this.cap,
      goggles: this.goggles,
    };
  }

  /**
   * Get all meshes (for adding to render lists)
   */
  public getAllMeshes(): BABYLON.Mesh[] {
    const meshes: BABYLON.Mesh[] = [];

    // Head and torso
    if (this.head) meshes.push(this.head);
    if (this.torso) meshes.push(this.torso);
    if (this.pelvis) meshes.push(this.pelvis);

    // Left arm
    if (this.leftShoulder) meshes.push(this.leftShoulder);
    if (this.leftUpperArm) meshes.push(this.leftUpperArm);
    if (this.leftForearm) meshes.push(this.leftForearm);
    if (this.leftHand) meshes.push(this.leftHand);

    // Right arm
    if (this.rightShoulder) meshes.push(this.rightShoulder);
    if (this.rightUpperArm) meshes.push(this.rightUpperArm);
    if (this.rightForearm) meshes.push(this.rightForearm);
    if (this.rightHand) meshes.push(this.rightHand);

    // Left leg
    if (this.leftHip) meshes.push(this.leftHip);
    if (this.leftThigh) meshes.push(this.leftThigh);
    if (this.leftCalf) meshes.push(this.leftCalf);
    if (this.leftFoot) meshes.push(this.leftFoot);

    // Right leg
    if (this.rightHip) meshes.push(this.rightHip);
    if (this.rightThigh) meshes.push(this.rightThigh);
    if (this.rightCalf) meshes.push(this.rightCalf);
    if (this.rightFoot) meshes.push(this.rightFoot);

    // Accessories
    if (this.cap) meshes.push(this.cap);
    if (this.goggles) meshes.push(this.goggles);

    return meshes;
  }

  /**
   * Change suit color
   */
  public setSuitColor(color: BABYLON.Color3): void {
    if (this.suitMaterial) {
      this.suitMaterial.diffuse = color;
    }
  }

  /**
   * Change cap color
   */
  public setCapColor(color: BABYLON.Color3): void {
    if (this.capMaterial) {
      this.capMaterial.diffuse = color;
    }
  }

  /**
   * Change goggle color
   */
  public setGoggleColor(color: BABYLON.Color3): void {
    if (this.goggleMaterial) {
      this.goggleMaterial.diffuse = color;
    }
  }

  /**
   * Clone this swimmer (for instancing)
   */
  public clone(config: SwimmerConfig = {}): BABYLON.TransformNode {
    const clonedModel = new SwimmerModel(this.scene);
    return clonedModel.create(config);
  }

  /**
   * Dispose of all meshes
   */
  public dispose(): void {
    if (this.mesh) {
      this.mesh.dispose();
    }
  }
}

export default SwimmerModel;
