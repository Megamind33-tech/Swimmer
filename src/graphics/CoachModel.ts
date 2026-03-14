/**
 * SWIMMER GAME - CoachModel
 * Procedural 3D coach model builder
 *
 * Creates a coach figure with:
 * - Different outfits (tracksuit, polo, etc.)
 * - Gesture animations (pointing, waving, arms crossed)
 * - Unique appearance per coach
 */

import * as BABYLON from '@babylonjs/core';
import { logger } from '../utils';

export interface CoachConfig {
  outfitColor?: BABYLON.Color3;
  scale?: number;
  skinTone?: BABYLON.Color3;
}

export class CoachModel {
  private mesh: BABYLON.TransformNode | null = null;
  private scene: BABYLON.Scene;

  // Body parts
  private head: BABYLON.Mesh | null = null;
  private torso: BABYLON.Mesh | null = null;
  private leftArm: BABYLON.Mesh | null = null;
  private rightArm: BABYLON.Mesh | null = null;
  private leftLeg: BABYLON.Mesh | null = null;
  private rightLeg: BABYLON.Mesh | null = null;

  // Materials
  private clothesMaterial: BABYLON.StandardMaterial | null = null;
  private skinMaterial: BABYLON.StandardMaterial | null = null;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  /**
   * Create a coach model
   */
  public create(config: CoachConfig = {}): BABYLON.TransformNode {
    const defaults: CoachConfig = {
      outfitColor: new BABYLON.Color3(0.2, 0.2, 0.2),
      scale: 1.0,
      skinTone: new BABYLON.Color3(0.95, 0.8, 0.7),
    };

    const finalConfig = { ...defaults, ...config };

    // Create main transform node
    this.mesh = new BABYLON.TransformNode('coach', this.scene);
    this.mesh.scaling = new BABYLON.Vector3(finalConfig.scale!, finalConfig.scale!, finalConfig.scale!);

    // Create materials
    this.createMaterials(finalConfig);

    // Build body parts
    this.createHead(finalConfig);
    this.createTorso(finalConfig);
    this.createArms(finalConfig);
    this.createLegs(finalConfig);

    logger.log('Coach model created');
    return this.mesh;
  }

  /**
   * Create materials
   */
  private createMaterials(config: CoachConfig): void {
    // Clothes material (tracksuit/coaching outfit)
    this.clothesMaterial = new BABYLON.StandardMaterial('clothesMaterial', this.scene);
    this.clothesMaterial.diffuseColor = config.outfitColor!;
    this.clothesMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    this.clothesMaterial.specularPower = 12;

    // Skin material
    this.skinMaterial = new BABYLON.StandardMaterial('skinMaterial', this.scene);
    this.skinMaterial.diffuseColor = config.skinTone!;
    this.skinMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    this.skinMaterial.specularPower = 8;
  }

  /**
   * Create head
   */
  private createHead(config: CoachConfig): void {
    if (!this.mesh) return;

    this.head = BABYLON.MeshBuilder.CreateSphere(
      'coachHead',
      { diameter: 0.25, segments: 16 },
      this.scene
    );
    this.head.position = new BABYLON.Vector3(0, 0.95, 0);
    this.head.material = this.skinMaterial;
    this.head.parent = this.mesh;

    // Simple facial features
    const eyes = BABYLON.MeshBuilder.CreateSphere(
      'coachEyes',
      { diameter: 0.04, segments: 8 },
      this.scene
    );
    eyes.position = new BABYLON.Vector3(0, 1.0, 0.1);
    eyes.material = new BABYLON.StandardMaterial('eyeMat', this.scene);
    (eyes.material as BABYLON.StandardMaterial).diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    eyes.parent = this.mesh;
  }

  /**
   * Create torso with coaching outfit
   */
  private createTorso(config: CoachConfig): void {
    if (!this.mesh) return;

    // Main torso (jacket)
    this.torso = BABYLON.MeshBuilder.CreateCylinder(
      'coachTorso',
      { height: 0.7, diameter: 0.38, tessellation: 12 },
      this.scene
    );
    this.torso.position = new BABYLON.Vector3(0, 0.35, 0);
    this.torso.material = this.clothesMaterial;
    this.torso.parent = this.mesh;

    // Legs (pants)
    const leftLegPants = BABYLON.MeshBuilder.CreateCylinder(
      'leftLegPants',
      { height: 0.5, diameter: 0.15, tessellation: 10 },
      this.scene
    );
    leftLegPants.position = new BABYLON.Vector3(-0.12, -0.25, 0);
    leftLegPants.material = this.clothesMaterial;
    leftLegPants.parent = this.mesh;

    const rightLegPants = BABYLON.MeshBuilder.CreateCylinder(
      'rightLegPants',
      { height: 0.5, diameter: 0.15, tessellation: 10 },
      this.scene
    );
    rightLegPants.position = new BABYLON.Vector3(0.12, -0.25, 0);
    rightLegPants.material = this.clothesMaterial;
    rightLegPants.parent = this.mesh;

    // Shoes
    const leftShoe = BABYLON.MeshBuilder.CreateBox(
      'leftShoe',
      { width: 0.15, height: 0.08, depth: 0.2 },
      this.scene
    );
    leftShoe.position = new BABYLON.Vector3(-0.12, -0.52, 0);
    leftShoe.material = new BABYLON.StandardMaterial('shoeMat', this.scene);
    (leftShoe.material as BABYLON.StandardMaterial).diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    leftShoe.parent = this.mesh;

    const rightShoe = BABYLON.MeshBuilder.CreateBox(
      'rightShoe',
      { width: 0.15, height: 0.08, depth: 0.2 },
      this.scene
    );
    rightShoe.position = new BABYLON.Vector3(0.12, -0.52, 0);
    rightShoe.material = (leftShoe.material as BABYLON.StandardMaterial);
    rightShoe.parent = this.mesh;
  }

  /**
   * Create arms for gesturing
   */
  private createArms(config: CoachConfig): void {
    if (!this.mesh) return;

    // Left arm
    this.leftArm = BABYLON.MeshBuilder.CreateCylinder(
      'coachLeftArm',
      { height: 0.5, diameter: 0.1, tessellation: 10 },
      this.scene
    );
    this.leftArm.position = new BABYLON.Vector3(-0.22, 0.5, 0);
    this.leftArm.rotation.z = Math.PI / 4;
    this.leftArm.material = this.skinMaterial;
    this.leftArm.parent = this.mesh;

    // Left hand
    const leftHand = BABYLON.MeshBuilder.CreateSphere(
      'coachLeftHand',
      { diameter: 0.08, segments: 8 },
      this.scene
    );
    leftHand.position = new BABYLON.Vector3(-0.35, 0.25, 0);
    leftHand.material = this.skinMaterial;
    leftHand.parent = this.mesh;

    // Right arm
    this.rightArm = BABYLON.MeshBuilder.CreateCylinder(
      'coachRightArm',
      { height: 0.5, diameter: 0.1, tessellation: 10 },
      this.scene
    );
    this.rightArm.position = new BABYLON.Vector3(0.22, 0.5, 0);
    this.rightArm.rotation.z = -Math.PI / 4;
    this.rightArm.material = this.skinMaterial;
    this.rightArm.parent = this.mesh;

    // Right hand
    const rightHand = BABYLON.MeshBuilder.CreateSphere(
      'coachRightHand',
      { diameter: 0.08, segments: 8 },
      this.scene
    );
    rightHand.position = new BABYLON.Vector3(0.35, 0.25, 0);
    rightHand.material = this.skinMaterial;
    rightHand.parent = this.mesh;
  }

  /**
   * Create legs
   */
  private createLegs(config: CoachConfig): void {
    if (!this.mesh) return;

    this.leftLeg = BABYLON.MeshBuilder.CreateCylinder(
      'coachLeftLeg',
      { height: 0.45, diameter: 0.12, tessellation: 10 },
      this.scene
    );
    this.leftLeg.position = new BABYLON.Vector3(-0.12, -0.25, 0);
    this.leftLeg.material = this.clothesMaterial;
    this.leftLeg.parent = this.mesh;

    this.rightLeg = BABYLON.MeshBuilder.CreateCylinder(
      'coachRightLeg',
      { height: 0.45, diameter: 0.12, tessellation: 10 },
      this.scene
    );
    this.rightLeg.position = new BABYLON.Vector3(0.12, -0.25, 0);
    this.rightLeg.material = this.clothesMaterial;
    this.rightLeg.parent = this.mesh;
  }

  /**
   * Set gesture pose (pointing, waving, encouraging)
   */
  public setPoseEncouraging(): void {
    if (!this.leftArm || !this.rightArm) return;

    // Both arms raised in encouragement
    this.leftArm.rotation.z = -Math.PI / 3;
    this.rightArm.rotation.z = Math.PI / 3;
  }

  /**
   * Set gesture pose (pointing at swimmer)
   */
  public setPosePointing(): void {
    if (!this.leftArm || !this.rightArm) return;

    // One arm pointing, other at side
    this.leftArm.rotation.z = Math.PI / 2.5;
    this.rightArm.rotation.z = 0;
  }

  /**
   * Set pose (arms crossed - strict coach)
   */
  public setPoseStrict(): void {
    if (!this.leftArm || !this.rightArm) return;

    // Arms crossed
    this.leftArm.rotation.z = Math.PI / 2;
    this.rightArm.rotation.z = Math.PI / 2;
  }

  /**
   * Set relaxed pose
   */
  public setPoseRelaxed(): void {
    if (!this.leftArm || !this.rightArm) return;

    // Relaxed stance
    this.leftArm.rotation.z = Math.PI / 6;
    this.rightArm.rotation.z = -Math.PI / 6;
  }

  /**
   * Get all meshes
   */
  public getAllMeshes(): BABYLON.Mesh[] {
    const meshes: BABYLON.Mesh[] = [];
    if (this.head) meshes.push(this.head);
    if (this.torso) meshes.push(this.torso);
    if (this.leftArm) meshes.push(this.leftArm);
    if (this.rightArm) meshes.push(this.rightArm);
    if (this.leftLeg) meshes.push(this.leftLeg);
    if (this.rightLeg) meshes.push(this.rightLeg);
    return meshes;
  }

  /**
   * Get root mesh
   */
  public getMesh(): BABYLON.TransformNode | null {
    return this.mesh;
  }

  /**
   * Dispose
   */
  public dispose(): void {
    if (this.mesh) {
      this.mesh.dispose();
    }
  }
}

export default CoachModel;
