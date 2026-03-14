/**
 * SWIMMER GAME - GameManager
 * Core game state machine and coordinator
 *
 * Responsibilities:
 * - Game state management (MENU, LOADING, RACING, RESULTS)
 * - Mode switching (Quick Race, Career, Ranked, etc.)
 * - Event dispatching (onRaceComplete, onLevelUp, etc.)
 * - Game lifecycle (init, update, pause, resume)
 * - Communication hub between modules
 */

import {
  GameState,
  GameMode,
  IRaceSetup,
  IRaceResult,
  IRaceState,
  IPlayerSwimmer,
  IGameSettings,
  RaceState,
  ICareerEvent,
} from '../types';
import { EventEmitter, logger } from '../utils';

// Event types that GameManager can emit
export interface IGameManagerEvents {
  gameStateChanged: { newState: GameState; prevState: GameState };
  modeChanged: { newMode: GameMode; prevMode: GameMode };
  raceStarted: { setup: IRaceSetup };
  raceUpdated: { raceState: IRaceState };
  raceFinished: { result: IRaceResult };
  playerLeveledUp: { level: number; xpGained: number };
  careerEventUnlocked: { event: ICareerEvent };
  settingsChanged: { key: keyof IGameSettings; value: any };
  playerDataChanged: { player: IPlayerSwimmer };
  paused: never;
  resumed: never;
  error: { message: string; code: string };
}

export class GameManager {
  // Game state
  private gameState: GameState = 'IDLE';
  private currentMode: GameMode = 'MENU';
  private player: IPlayerSwimmer | null = null;
  private isOnline: boolean = true;
  private isPaused: boolean = false;

  // Race state
  private currentRaceSetup: IRaceSetup | null = null;
  private currentRaceState: IRaceState | null = null;

  // Settings
  private settings: IGameSettings = {
    difficulty: 'NORMAL',
    soundEnabled: true,
    musicEnabled: true,
    hapticFeedback: true,
    qualityTier: 'MEDIUM',
    fpsTarget: 30,
    language: 'en',
  };

  // Event emitter for decoupled communication
  private events = new EventEmitter<IGameManagerEvents>();

  // Lifecycle tracking
  private initTime: number = 0;
  private deltaTime: number = 0;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;

  constructor() {
    logger.log('GameManager initialized');
    this.initTime = Date.now();
    this.lastFrameTime = performance.now();
  }

  // ============================================================================
  // INITIALIZATION & LIFECYCLE
  // ============================================================================

  /**
   * Initialize game manager with player data
   */
  public async init(player: IPlayerSwimmer, onlineStatus: boolean): Promise<void> {
    try {
      this.setGameState('LOADING');
      this.player = player;
      this.isOnline = onlineStatus;

      logger.log('GameManager initialized with player:', player.name);
      this.setGameState('MENU');
    } catch (error) {
      this.emit('error', {
        message: 'Failed to initialize GameManager',
        code: 'INIT_ERROR',
      });
      throw error;
    }
  }

  /**
   * Main game update loop (called every frame)
   */
  public update(): void {
    const now = performance.now();
    this.deltaTime = (now - this.lastFrameTime) / 1000; // Convert to seconds
    this.lastFrameTime = now;
    this.frameCount++;

    // Update race if in progress
    if (this.gameState === 'RACING' && this.currentRaceState) {
      this.currentRaceState.currentTime = now - this.currentRaceState.startTime;
      this.emit('raceUpdated', { raceState: this.currentRaceState });
    }
  }

  /**
   * Pause game
   */
  public pause(): void {
    if (this.gameState === 'RACING') {
      this.isPaused = true;
      this.emit('paused', undefined);
      logger.log('Game paused');
    }
  }

  /**
   * Resume game
   */
  public resume(): void {
    if (this.isPaused) {
      this.isPaused = false;
      this.lastFrameTime = performance.now();
      this.emit('resumed', undefined);
      logger.log('Game resumed');
    }
  }

  /**
   * Shutdown and cleanup
   */
  public shutdown(): void {
    this.events.clear();
    this.player = null;
    this.currentRaceSetup = null;
    this.currentRaceState = null;
    logger.log('GameManager shutdown');
  }

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * Set game state
   */
  private setGameState(newState: GameState): void {
    const prevState = this.gameState;
    if (prevState === newState) return;

    this.gameState = newState;
    logger.log(`Game state: ${prevState} -> ${newState}`);

    this.emit('gameStateChanged', {
      newState,
      prevState,
    });
  }

  /**
   * Get current game state
   */
  public getGameState(): GameState {
    return this.gameState;
  }

  // ============================================================================
  // MODE MANAGEMENT
  // ============================================================================

  /**
   * Switch to a game mode
   */
  public switchMode(mode: GameMode): void {
    const prevMode = this.currentMode;
    if (prevMode === mode) return;

    this.currentMode = mode;
    logger.log(`Game mode: ${prevMode} -> ${mode}`);

    this.emit('modeChanged', {
      newMode: mode,
      prevMode,
    });

    this.setGameState('MENU');
  }

  /**
   * Get current mode
   */
  public getMode(): GameMode {
    return this.currentMode;
  }

  // ============================================================================
  // RACE MANAGEMENT
  // ============================================================================

  /**
   * Start a race with given setup
   */
  public startRace(setup: IRaceSetup): void {
    if (this.gameState === 'RACING') {
      logger.warn('Race already in progress, cannot start new race');
      return;
    }

    this.currentRaceSetup = setup;
    this.setGameState('RACING');

    // Initialize race state
    this.currentRaceState = {
      state: 'COUNTDOWN',
      startTime: performance.now(),
      currentTime: 0,
      countdownValue: 3,
      swimmers: [],
      leaderboard: [],
      isFinished: false,
      winnerId: '',
    };

    logger.log('Race started:', setup);
    this.emit('raceStarted', { setup });
  }

  /**
   * Finish current race with results
   */
  public finishRace(result: IRaceResult): void {
    if (this.gameState !== 'RACING') {
      logger.warn('No race in progress, cannot finish race');
      return;
    }

    // Update player data with rewards
    if (this.player) {
      const prevLevel = this.player.level;
      this.player.xp += result.xpEarned;

      // Check for level up
      const xpNeeded = this.calculateXpForLevel(this.player.level);
      if (this.player.xp >= xpNeeded) {
        this.player.level++;
        this.player.xp -= xpNeeded;
        logger.log(`Player leveled up to ${this.player.level}!`);
        this.emit('playerLeveledUp', {
          level: this.player.level,
          xpGained: result.xpEarned,
        });
      }

      // Update career progress
      if (result.mode === 'CAREER') {
        this.player.careerEventIndex++;
        const nextEvent = this.getCareerEventAt(this.player.careerEventIndex);
        if (nextEvent) {
          this.emit('careerEventUnlocked', { event: nextEvent });
        }
      }

      this.emit('playerDataChanged', { player: this.player });
    }

    this.setGameState('RESULTS');
    this.emit('raceFinished', { result });

    logger.log('Race finished:', result);
  }

  /**
   * Get current race state
   */
  public getRaceState(): IRaceState | null {
    return this.currentRaceState;
  }

  /**
   * Get current race setup
   */
  public getRaceSetup(): IRaceSetup | null {
    return this.currentRaceSetup;
  }

  // ============================================================================
  // PLAYER MANAGEMENT
  // ============================================================================

  /**
   * Set player
   */
  public setPlayer(player: IPlayerSwimmer): void {
    this.player = player;
    this.emit('playerDataChanged', { player });
  }

  /**
   * Get player
   */
  public getPlayer(): IPlayerSwimmer | null {
    return this.player;
  }

  /**
   * Add XP to player
   */
  public addXp(amount: number): void {
    if (!this.player) return;

    const prevLevel = this.player.level;
    this.player.xp += amount;

    const xpNeeded = this.calculateXpForLevel(this.player.level);
    if (this.player.xp >= xpNeeded) {
      this.player.level++;
      this.player.xp -= xpNeeded;
      logger.log(`Player leveled up to ${this.player.level}!`);
      this.emit('playerLeveledUp', {
        level: this.player.level,
        xpGained: amount,
      });
    }

    this.emit('playerDataChanged', { player: this.player });
  }

  /**
   * Add reputation to player
   */
  public addReputation(amount: number): void {
    if (!this.player) return;

    this.player.reputation = Math.min(1000, this.player.reputation + amount);
    this.emit('playerDataChanged', { player: this.player });
  }

  /**
   * Add fame to player
   */
  public addFame(amount: number): void {
    if (!this.player) return;

    this.player.fame = Math.min(500, this.player.fame + amount);
    this.emit('playerDataChanged', { player: this.player });
  }

  // ============================================================================
  // SETTINGS
  // ============================================================================

  /**
   * Update a setting
   */
  public updateSetting<K extends keyof IGameSettings>(key: K, value: IGameSettings[K]): void {
    this.settings[key] = value;
    logger.log(`Setting updated: ${String(key)} = ${value}`);
    this.emit('settingsChanged', { key, value });
  }

  /**
   * Get all settings
   */
  public getSettings(): IGameSettings {
    return { ...this.settings };
  }

  /**
   * Get specific setting
   */
  public getSetting<K extends keyof IGameSettings>(key: K): IGameSettings[K] {
    return this.settings[key];
  }

  // ============================================================================
  // CONNECTIVITY
  // ============================================================================

  /**
   * Set online status
   */
  public setOnlineStatus(isOnline: boolean): void {
    this.isOnline = isOnline;
    logger.log(`Online status: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
  }

  /**
   * Get online status
   */
  public isOnlineStatus(): boolean {
    return this.isOnline;
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  /**
   * Subscribe to game event
   */
  public on<K extends keyof IGameManagerEvents>(
    event: K,
    callback: (data: IGameManagerEvents[K]) => void
  ): () => void {
    return this.events.on(event, callback);
  }

  /**
   * Emit game event (internal)
   */
  private emit<K extends keyof IGameManagerEvents>(event: K, data: IGameManagerEvents[K]): void {
    this.events.emit(event, data);
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Calculate XP required for next level
   */
  private calculateXpForLevel(level: number): number {
    if (level <= 5) return 100;
    if (level <= 10) return 150;
    if (level <= 20) return 250;
    if (level <= 30) return 400;
    if (level <= 50) return 750;
    return 1500;
  }

  /**
   * Get career event at index
   */
  private getCareerEventAt(index: number): ICareerEvent | null {
    // TODO: Load from career events database
    // For now, return null as placeholder
    return null;
  }

  /**
   * Get delta time (time since last frame in seconds)
   */
  public getDeltaTime(): number {
    return this.deltaTime;
  }

  /**
   * Get frame count
   */
  public getFrameCount(): number {
    return this.frameCount;
  }

  /**
   * Get elapsed time since initialization (in seconds)
   */
  public getElapsedTime(): number {
    return (Date.now() - this.initTime) / 1000;
  }

  /**
   * Is game paused
   */
  public isPausedStatus(): boolean {
    return this.isPaused;
  }
}

// Export singleton instance
export const gameManager = new GameManager();

export default gameManager;
