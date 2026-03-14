/**
 * SWIMMER GAME - SwimmerModel
 * Procedural 3D swimmer model builder
 *
 * Creates a styled but realistic swimmer using Babylon.js primitives:
 * - Head, torso, arms, legs
 * - Swimming cap and goggles
 * - Customizable colors and materials
 * - Ready for animation keyframes
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
  private leftArm: BABYLON.Mesh | null = null;
  private rightArm: BABYLON.Mesh | null = null;
  private leftLeg: BABYLON.Mesh | null = null;
  private rightLeg: BABYLON.Mesh | null = null;
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
    this.createArms(finalConfig);
    this.createLegs(finalConfig);
    this.createCap(finalConfig);
    this.createGoggles(finalConfig);

    logger.log('Swimmer model created');
    return this.mesh;
  }

  /**
   * Create materials for different body parts
   */
  private createMaterials(config: SwimmerConfig): void {
    // Suit material
    this.suitMaterial = new BABYLON.StandardMaterial('suitMaterial', this.scene);
    this.suitMaterial.diffuse = config.suitColor!;
    this.suitMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    this.suitMaterial.specularPower = 16;

    // Cap material
    this.capMaterial = new BABYLON.StandardMaterial('capMaterial', this.scene);
    this.capMaterial.diffuse = config.capColor!;
    this.capMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    this.capMaterial.specularPower = 8;

    // Goggle material
    this.goggleMaterial = new BABYLON.StandardMaterial('goggleMaterial', this.scene);
    this.goggleMaterial.diffuse = config.goggleColor!;
    this.goggleMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    this.goggleMaterial.specularPower = 32;
    this.goggleMaterial.alpha = 0.8;

    // Skin material
    this.skinMaterial = new BABYLON.StandardMaterial('skinMaterial', this.scene);
    this.skinMaterial.diffuse = config.skinTone!;
    this.skinMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    this.skinMaterial.specularPower = 8;
  }

  /**
   * Create head
   */
  private createHead(config: SwimmerConfig): void {
    if (!this.mesh) return;

    // Head sphere
    this.head = BABYLON.MeshBuilder.CreateSphere(
      'head',
      { diameter: 0.5, segments: 16 },
      this.scene
    );
    this.head.position = new BABYLON.Vector3(0, 0.8, 0);
    this.head.material = this.skinMaterial;
    this.head.parent = this.mesh;
  }

  /**
   * Create torso (main body)
   */
  private createTorso(config: SwimmerConfig): void {
    if (!this.mesh) return;

    // Main torso - elongated cylinder
    this.torso = BABYLON.MeshBuilder.CreateCylinder(
      'torso',
      { height: 0.7, diameter: 0.35, tessellation: 16 },
      this.scene
    );
    this.torso.position = new BABYLON.Vector3(0, 0.35, 0);
    this.torso.material = this.suitMaterial;
    this.torso.parent = this.mesh;

    // Pelvis - smaller cylinder
    const pelvis = BABYLON.MeshBuilder.CreateCylinder(
      'pelvis',
      { height: 0.25, diameter: 0.3, tessellation: 16 },
      this.scene
    );
    pelvis.position = new BABYLON.Vector3(0, 0.0, 0);
    pelvis.material = this.suitMaterial;
    pelvis.parent = this.mesh;
  }

  /**
   * Create arms
   */
  private createArms(config: SwimmerConfig): void {
    if (!this.mesh) return;

    // Left arm
    this.leftArm = BABYLON.MeshBuilder.CreateCylinder(
      'leftArm',
      { height: 0.6, diameter: 0.12, tessellation: 12 },
      this.scene
    );
    this.leftArm.position = new BABYLON.Vector3(-0.25, 0.5, 0);
    this.leftArm.rotation = new BABYLON.Vector3(0, 0, Math.PI / 4);
    this.leftArm.material = this.skinMaterial;
    this.leftArm.parent = this.mesh;

    // Left hand
    const leftHand = BABYLON.MeshBuilder.CreateSphere(
      'leftHand',
      { diameter: 0.12, segments: 8 },
      this.scene
    );
    leftHand.position = new BABYLON.Vector3(-0.45, 0.15, 0);
    leftHand.material = this.skinMaterial;
    leftHand.parent = this.mesh;

    // Right arm
    this.rightArm = BABYLON.MeshBuilder.CreateCylinder(
      'rightArm',
      { height: 0.6, diameter: 0.12, tessellation: 12 },
      this.scene
    );
    this.rightArm.position = new BABYLON.Vector3(0.25, 0.5, 0);
    this.rightArm.rotation = new BABYLON.Vector3(0, 0, -Math.PI / 4);
    this.rightArm.material = this.skinMaterial;
    this.rightArm.parent = this.mesh;

    // Right hand
    const rightHand = BABYLON.MeshBuilder.CreateSphere(
      'rightHand',
      { diameter: 0.12, segments: 8 },
      this.scene
    );
    rightHand.position = new BABYLON.Vector3(0.45, 0.15, 0);
    rightHand.material = this.skinMaterial;
    rightHand.parent = this.mesh;
  }

  /**
   * Create legs
   */
  private createLegs(config: SwimmerConfig): void {
    if (!this.mesh) return;

    // Left leg
    this.leftLeg = BABYLON.MeshBuilder.CreateCylinder(
      'leftLeg',
      { height: 0.5, diameter: 0.1, tessellation: 12 },
      this.scene
    );
    this.leftLeg.position = new BABYLON.Vector3(-0.1, -0.15, 0);
    this.leftLeg.material = this.suitMaterial;
    this.leftLeg.parent = this.mesh;

    // Left foot
    const leftFoot = BABYLON.MeshBuilder.CreateBox(
      'leftFoot',
      { width: 0.15, height: 0.08, depth: 0.25 },
      this.scene
    );
    leftFoot.position = new BABYLON.Vector3(-0.1, -0.45, 0);
    leftFoot.material = this.suitMaterial;
    leftFoot.parent = this.mesh;

    // Right leg
    this.rightLeg = BABYLON.MeshBuilder.CreateCylinder(
      'rightLeg',
      { height: 0.5, diameter: 0.1, tessellation: 12 },
      this.scene
    );
    this.rightLeg.position = new BABYLON.Vector3(0.1, -0.15, 0);
    this.rightLeg.material = this.suitMaterial;
    this.rightLeg.parent = this.mesh;

    // Right foot
    const rightFoot = BABYLON.MeshBuilder.CreateBox(
      'rightFoot',
      { width: 0.15, height: 0.08, depth: 0.25 },
      this.scene
    );
    rightFoot.position = new BABYLON.Vector3(0.1, -0.45, 0);
    rightFoot.material = this.suitMaterial;
    rightFoot.parent = this.mesh;
  }

  /**
   * Create swimming cap
   */
  private createCap(config: SwimmerConfig): void {
    if (!this.mesh) return;

    // Cap covers upper head
    this.cap = BABYLON.MeshBuilder.CreateSphere(
      'cap',
      { diameter: 0.52, segments: 16 },
      this.scene
    );
    this.cap.position = new BABYLON.Vector3(0, 0.85, 0);
    this.cap.scaling = new BABYLON.Vector3(1.0, 0.7, 1.0);
    this.cap.material = this.capMaterial;
    this.cap.parent = this.mesh;
  }

  /**
   * Create goggles
   */
  private createGoggles(config: SwimmerConfig): void {
    if (!this.mesh) return;

    // Left goggle lens
    this.goggles = BABYLON.MeshBuilder.CreateSphere(
      'leftGoggle',
      { diameter: 0.15, segments: 8 },
      this.scene
    );
    this.goggles.position = new BABYLON.Vector3(-0.1, 0.85, 0.22);
    this.goggles.material = this.goggleMaterial;
    this.goggles.parent = this.mesh;

    // Right goggle lens
    const rightGoggle = BABYLON.MeshBuilder.CreateSphere(
      'rightGoggle',
      { diameter: 0.15, segments: 8 },
      this.scene
    );
    rightGoggle.position = new BABYLON.Vector3(0.1, 0.85, 0.22);
    rightGoggle.material = this.goggleMaterial;
    rightGoggle.parent = this.mesh;

    // Goggle strap (simple box)
    const goggleStrap = BABYLON.MeshBuilder.CreateBox(
      'goggleStrap',
      { width: 0.3, height: 0.03, depth: 0.05 },
      this.scene
    );
    goggleStrap.position = new BABYLON.Vector3(0, 0.82, 0.15);
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
      leftArm: this.leftArm,
      rightArm: this.rightArm,
      leftLeg: this.leftLeg,
      rightLeg: this.rightLeg,
      cap: this.cap,
      goggles: this.goggles,
    };
  }

  /**
   * Get all meshes (for adding to render lists)
   */
  public getAllMeshes(): BABYLON.Mesh[] {
    const meshes: BABYLON.Mesh[] = [];
    if (this.head) meshes.push(this.head);
    if (this.torso) meshes.push(this.torso);
    if (this.leftArm) meshes.push(this.leftArm);
    if (this.rightArm) meshes.push(this.rightArm);
    if (this.leftLeg) meshes.push(this.leftLeg);
    if (this.rightLeg) meshes.push(this.rightLeg);
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
