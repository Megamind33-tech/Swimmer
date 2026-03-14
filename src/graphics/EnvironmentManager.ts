/**
 * SWIMMER GAME - EnvironmentManager
 * Manages switching between different environment scenes
 * Handles pool, locker room, training facility, and school gym
 */

import * as BABYLON from '@babylonjs/core';
import LockerRoomEnvironment from './LockerRoomEnvironment';
import TrainingFacilityEnvironment from './TrainingFacilityEnvironment';
import SchoolGymEnvironment from './SchoolGymEnvironment';
import { logger } from '../utils';

export type EnvironmentType = 'pool' | 'locker-room' | 'training' | 'school-gym';

export interface EnvironmentConfig {
  enableLighting?: boolean;
  enableFog?: boolean;
  cameraPosition?: BABYLON.Vector3;
  skyColor?: BABYLON.Color4;
}

export class EnvironmentManager {
  private scene: BABYLON.Scene;
  private currentEnvironment: EnvironmentType = 'pool';
  private environments: Map<EnvironmentType, BABYLON.TransformNode | null> = new Map();
  private environmentInstances: Map<EnvironmentType, any> = new Map();
  private poolArenaNode: BABYLON.TransformNode | null = null;

  // Environment references
  private lockerRoom: LockerRoomEnvironment | null = null;
  private trainingFacility: TrainingFacilityEnvironment | null = null;
  private schoolGym: SchoolGymEnvironment | null = null;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.initializeEnvironments();
  }

  /**
   * Initialize environment creators (lazy loading)
   */
  private initializeEnvironments(): void {
    // Don't create environments upfront - defer until needed
    logger.log('EnvironmentManager initialized with lazy loading');
  }

  /**
   * Lazy initialize environment on first access
   */
  private ensureEnvironmentCreated(type: EnvironmentType): void {
    if (type === 'locker-room' && !this.lockerRoom) {
      this.lockerRoom = new LockerRoomEnvironment(this.scene);
      this.environmentInstances.set('locker-room', this.lockerRoom);
    } else if (type === 'training' && !this.trainingFacility) {
      this.trainingFacility = new TrainingFacilityEnvironment(this.scene);
      this.environmentInstances.set('training', this.trainingFacility);
    } else if (type === 'school-gym' && !this.schoolGym) {
      this.schoolGym = new SchoolGymEnvironment(this.scene);
      this.environmentInstances.set('school-gym', this.schoolGym);
    }
  }

  /**
   * Create and switch to environment
   */
  public switchToEnvironment(
    environmentType: EnvironmentType,
    config: EnvironmentConfig = {}
  ): void {
    if (this.currentEnvironment === environmentType) {
      logger.warn(`Already in ${environmentType} environment`);
      return;
    }

    // Clean up previous environment if needed
    this.hideAllEnvironments();

    logger.log(`Switching to environment: ${environmentType}`);

    let environment: BABYLON.TransformNode | null = null;

    switch (environmentType) {
      case 'locker-room':
        this.ensureEnvironmentCreated('locker-room');
        if (!this.environments.has('locker-room')) {
          environment = this.lockerRoom!.create();
          this.environments.set('locker-room', environment);
        } else {
          environment = this.environments.get('locker-room')!;
        }
        this.showEnvironment(environment);
        break;

      case 'training':
        this.ensureEnvironmentCreated('training');
        if (!this.environments.has('training')) {
          environment = this.trainingFacility!.create();
          this.environments.set('training', environment);
        } else {
          environment = this.environments.get('training')!;
        }
        this.showEnvironment(environment);
        break;

      case 'school-gym':
        this.ensureEnvironmentCreated('school-gym');
        if (!this.environments.has('school-gym')) {
          environment = this.schoolGym!.create();
          this.environments.set('school-gym', environment);
        } else {
          environment = this.environments.get('school-gym')!;
        }
        this.showEnvironment(environment);
        break;

      case 'pool':
      default:
        // Pool is main racing environment
        if (this.poolArenaNode) {
          this.poolArenaNode.setEnabled(true);
        }
        logger.log('Returning to pool racing environment');
        break;
    }

    this.currentEnvironment = environmentType;
    this.applyEnvironmentConfig(config);
  }

  /**
   * Hide all environments
   */
  private hideAllEnvironments(): void {
    this.environments.forEach((env, type) => {
      if (env && type !== 'pool') {
        // Hide non-pool environments
        env.setEnabled(false);
      }
    });
    // Pool is handled separately
    if (this.poolArenaNode) {
      this.poolArenaNode.setEnabled(false);
    }
  }

  /**
   * Show specific environment
   */
  private showEnvironment(environment: BABYLON.TransformNode): void {
    environment.setEnabled(true);
  }

  /**
   * Apply configuration to environment
   */
  private applyEnvironmentConfig(config: EnvironmentConfig): void {
    if (config.skyColor) {
      this.scene.clearColor = config.skyColor;
    }

    if (config.enableFog !== undefined) {
      if (config.enableFog) {
        this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        this.scene.fogDensity = 0.005;
      } else {
        this.scene.fogMode = BABYLON.Scene.FOGMODE_NONE;
      }
    }

    if (config.cameraPosition) {
      // Camera position would be applied by camera controller
    }
  }

  /**
   * Get current environment type
   */
  public getCurrentEnvironment(): EnvironmentType {
    return this.currentEnvironment;
  }

  /**
   * Get all available environments
   */
  public getAvailableEnvironments(): EnvironmentType[] {
    return ['pool', 'locker-room', 'training', 'school-gym'];
  }

  /**
   * Check if environment is loaded
   */
  public isEnvironmentLoaded(environmentType: EnvironmentType): boolean {
    return this.environments.has(environmentType);
  }

  /**
   * Get environment root node
   */
  public getEnvironmentRoot(environmentType: EnvironmentType): BABYLON.TransformNode | null {
    return this.environments.get(environmentType) || null;
  }

  /**
   * Register the pool arena node for management
   */
  public registerPoolArena(node: BABYLON.TransformNode): void {
    this.poolArenaNode = node;
    this.environments.set('pool', node);
    logger.log('Pool arena registered with EnvironmentManager');
  }

  /**
   * Dispose all environments
   */
  public dispose(): void {
    this.environments.forEach((env) => {
      if (env) {
        env.dispose();
      }
    });
    this.environments.clear();

    if (this.lockerRoom) this.lockerRoom.dispose();
    if (this.trainingFacility) this.trainingFacility.dispose();
    if (this.schoolGym) this.schoolGym.dispose();

    this.environmentInstances.clear();
  }
}

export default EnvironmentManager;
