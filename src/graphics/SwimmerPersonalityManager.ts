/**
 * SWIMMER GAME - SwimmerPersonalityManager
 * Integrates all personality, clothing, and behavior systems for swimmers
 */

import * as BABYLON from '@babylonjs/core';
import SwimmerModel from './SwimmerModel';
import CoachModel from './CoachModel';
import DialogueSystem from './DialogueSystem';
import WarmupSystem, { WarmupSequence } from './WarmupSystem';
import { SwimmerProfile, CoachProfile } from './SwimmerProfile';
import { logger } from '../utils';

export interface SwimmerEntity {
  profile: SwimmerProfile;
  mesh: BABYLON.TransformNode;
  model: SwimmerModel;
  coach?: {
    mesh: BABYLON.TransformNode;
    model: CoachModel;
  };
  warmupSequence?: WarmupSequence;
  currentDialogue?: string;
}

export class SwimmerPersonalityManager {
  private scene: BABYLON.Scene;
  private swimmers: Map<number, SwimmerEntity> = new Map();
  private dialogueSystem: DialogueSystem;
  private warmupSystem: WarmupSystem;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.dialogueSystem = new DialogueSystem(scene);
    this.warmupSystem = new WarmupSystem(scene);
  }

  /**
   * Create a personalized swimmer with clothing, coach, and personality
   */
  public createPersonalizedSwimmer(profile: SwimmerProfile): SwimmerEntity {
    logger.log(`Creating personalized swimmer: ${profile.name}`);

    // Create swimmer model with clothing colors
    const swimmerModel = new SwimmerModel(this.scene);
    const mesh = swimmerModel.create({
      suitColor: profile.clothing.suitColor,
      capColor: profile.clothing.capColor,
      goggleColor: profile.clothing.gogglesColor,
      scale: 1.0 + (Math.random() * 0.15 - 0.075),
      skinTone: profile.clothing.skinTone,
    });

    const entity: SwimmerEntity = {
      profile: profile,
      mesh: mesh,
      model: swimmerModel,
    };

    // Create coach
    if (profile.coach) {
      const coachModel = new CoachModel(this.scene);
      const coachMesh = coachModel.create({
        outfitColor: profile.coach.color,
        scale: 0.9,
        skinTone: new BABYLON.Color3(0.9, 0.75, 0.65),
      });

      entity.coach = {
        mesh: coachMesh,
        model: coachModel,
      };

      // Position coach near swimmer's lane
      coachMesh.position = new BABYLON.Vector3(
        mesh.position.x - 0.5,
        0,
        mesh.position.z - 3
      );

      // Set coach pose based on personality
      if (profile.coach.style === 'drill-sergeant') {
        coachModel.setPoseStrict();
      } else if (profile.coach.style === 'motivator') {
        coachModel.setPoseEncouraging();
      } else if (profile.coach.style === 'technical') {
        coachModel.setPosePointing();
      } else {
        coachModel.setPoseRelaxed();
      }
    }

    this.swimmers.set(profile.id, entity);
    return entity;
  }

  /**
   * Start warm-up for a swimmer
   */
  public startWarmup(swimmerId: number): void {
    const entity = this.swimmers.get(swimmerId);
    if (!entity) return;

    // Generate warm-up sequence
    const sequence = this.warmupSystem.generateWarmupSequence(swimmerId, {
      warmupIntensity: entity.profile.personality.warmupIntensity,
      confidence: entity.profile.personality.confidence,
      nervousness: entity.profile.personality.nervousness,
    });

    entity.warmupSequence = sequence;

    // Show initial dialogue
    const quote =
      entity.profile.warmupQuotes[Math.floor(Math.random() * entity.profile.warmupQuotes.length)];
    this.showSwimmerDialogue(swimmerId, quote);

    logger.log(`Started warm-up for swimmer ${swimmerId}`);
  }

  /**
   * Update warm-up animation
   */
  public updateWarmup(swimmerId: number, deltaTime: number): { isComplete: boolean; progress: number } {
    const entity = this.swimmers.get(swimmerId);
    if (!entity || !entity.mesh) {
      return { isComplete: true, progress: 1 };
    }

    const result = this.warmupSystem.update(entity.mesh, swimmerId, deltaTime);

    // Show dialogue based on current action
    if (result.currentAction && !entity.currentDialogue) {
      const personalityType = entity.profile.personality.type;

      if (personalityType === 'nervous' && result.currentAction.type === 'breathing-exercises') {
        const quote =
          entity.profile.nervousQuotes[Math.floor(Math.random() * entity.profile.nervousQuotes.length)];
        this.showSwimmerDialogue(swimmerId, quote);
      }

      if (personalityType === 'confident' && result.currentAction.type === 'mental-focus') {
        const quote =
          entity.profile.motivationalQuotes[Math.floor(Math.random() * entity.profile.motivationalQuotes.length)];
        this.showSwimmerDialogue(swimmerId, quote);
      }
    }

    // Show coach encouragement
    if (result.progress > 0.5 && result.progress < 0.6 && entity.coach) {
      const coachQuote =
        entity.profile.coach.quotes[Math.floor(Math.random() * entity.profile.coach.quotes.length)];
      this.showCoachDialogue(swimmerId, coachQuote);
    }

    return { isComplete: result.isComplete, progress: result.progress };
  }

  /**
   * Show swimmer dialogue
   */
  public showSwimmerDialogue(swimmerId: number, text: string, duration: number = 2.5): void {
    const entity = this.swimmers.get(swimmerId);
    if (!entity || !entity.mesh) return;

    const position = entity.mesh.position.clone();
    this.dialogueSystem.showDialogue(`swimmer_${swimmerId}`, text, position, duration, 'swimmer');
    entity.currentDialogue = text;

    // Clear after duration
    setTimeout(() => {
      if (entity.currentDialogue === text) {
        entity.currentDialogue = undefined;
      }
    }, duration * 1000);
  }

  /**
   * Show coach dialogue
   */
  public showCoachDialogue(swimmerId: number, text: string, duration: number = 3): void {
    const entity = this.swimmers.get(swimmerId);
    if (!entity || !entity.coach || !entity.coach.mesh) return;

    const position = entity.coach.mesh.position.clone();
    this.dialogueSystem.showDialogue(`coach_${swimmerId}`, text, position, duration, 'coach');
  }

  /**
   * Get swimmer entity
   */
  public getSwimmer(swimmerId: number): SwimmerEntity | undefined {
    return this.swimmers.get(swimmerId);
  }

  /**
   * Get all swimmers
   */
  public getAllSwimmers(): SwimmerEntity[] {
    return Array.from(this.swimmers.values());
  }

  /**
   * Update all systems
   */
  public update(): void {
    this.dialogueSystem.update();
  }

  /**
   * Get dialogue system
   */
  public getDialogueSystem(): DialogueSystem {
    return this.dialogueSystem;
  }

  /**
   * Dispose all resources
   */
  public dispose(): void {
    for (const entity of this.swimmers.values()) {
      if (entity.model) {
        entity.model.dispose();
      }
      if (entity.coach && entity.coach.model) {
        entity.coach.model.dispose();
      }
    }
    this.swimmers.clear();
    this.dialogueSystem.dispose();
    this.warmupSystem.clearAll();
  }
}

export default SwimmerPersonalityManager;
