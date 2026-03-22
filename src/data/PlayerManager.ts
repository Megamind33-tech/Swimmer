/**
 * SWIMMER GAME - PlayerManager
 * Player progression, persistence, and data management
 *
 * Responsibilities:
 * - Swimmer creation and customization
 * - Stat growth and progression
 * - Cosmetics ownership and unlocking
 * - Career progression tracking
 * - Reputation and fame systems
 * - Local data persistence (localStorage/IndexedDB)
 * - Cloud save sync coordination
 * - Skill tree progression
 */

import {
  IPlayerSwimmer,
  ISwimmerStats,
  ISwimmerAttributes,
  ICosmetics,
  IEquipment,
  SwimmerSpecialty,
  ICareerEvent,
  IRival,
  Rarity,
  ICloudSyncData,
} from '../types';
import { storage, logger, levelFromXp, deepClone } from '../utils';
import { applyTrainingSession, createDevelopmentProfile, ensureDevelopment, recoverAthlete, type TrainingFocus, type TrainingSessionResult } from '../utils/trainingSystem';

// Default stats for each specialty
const SPECIALTY_STAT_BONUSES: Record<SwimmerSpecialty, Partial<ISwimmerStats>> = {
  SPRINTER: { speed: 3, stamina: -2 },
  DISTANCE: { stamina: 4, speed: -1 },
  TECHNICIAN: { technique: 2 },
  ALL_AROUND: {}, // No bonuses
};

// Career events (simplified - 50 total events)
const CAREER_EVENTS: ICareerEvent[] = [];

// Initialize career events
function initializeCareerEvents() {
  let eventIndex = 0;

  // Tier 1: School (10 events, 50-200m freestyle)
  for (let i = 0; i < 10; i++) {
    CAREER_EVENTS.push({
      id: `career_${eventIndex}`,
      index: eventIndex,
      tier: 1,
      name: `School Championship - Event ${i + 1}`,
      description: 'Compete at your local school pool',
      distance: i % 3 === 0 ? 50 : i % 3 === 1 ? 100 : 200,
      stroke: 'FREESTYLE',
      opponents: ['AI_1', 'AI_2', 'AI_3'],
      minDifficulty: 1,
      difficulty: 2,
      rewards: {
        xp: 50,
        currency: 100,
        unlocksNextEvent: true,
      },
    });
    eventIndex++;
  }

  // Tier 2: Junior (10 events, all strokes)
  const juniorStrokes = ['FREESTYLE', 'BUTTERFLY', 'BREASTSTROKE', 'BACKSTROKE'];
  for (let i = 0; i < 10; i++) {
    CAREER_EVENTS.push({
      id: `career_${eventIndex}`,
      index: eventIndex,
      tier: 2,
      name: `Junior Championship - ${juniorStrokes[i % 4]}`,
      description: 'Compete at regional junior competitions',
      distance: 100 + i * 20,
      stroke: (juniorStrokes[i % 4] as any) || 'FREESTYLE',
      opponents: ['AI_2', 'AI_3', 'AI_4', 'AI_5'],
      minDifficulty: 2,
      difficulty: 4,
      rewards: {
        xp: 100,
        currency: 200,
        unlocksNextEvent: true,
      },
    });
    eventIndex++;
  }

  // Tier 3: Regional (10 events)
  for (let i = 0; i < 10; i++) {
    CAREER_EVENTS.push({
      id: `career_${eventIndex}`,
      index: eventIndex,
      tier: 3,
      name: `Regional Championship - Event ${i + 1}`,
      description: 'Compete at regional level competitions',
      distance: 200 + i * 50,
      stroke: (juniorStrokes[i % 4] as any) || 'FREESTYLE',
      opponents: ['AI_3', 'AI_4', 'AI_5', 'AI_6'],
      minDifficulty: 3,
      difficulty: 6,
      rewards: {
        xp: 150,
        currency: 300,
        unlocksNextEvent: true,
      },
    });
    eventIndex++;
  }

  // Tier 4: National (10 events)
  for (let i = 0; i < 10; i++) {
    CAREER_EVENTS.push({
      id: `career_${eventIndex}`,
      index: eventIndex,
      tier: 4,
      name: `National Championship - Event ${i + 1}`,
      description: 'Compete at the national championship',
      distance: 200 + i * 100,
      stroke: (juniorStrokes[i % 4] as any) || 'FREESTYLE',
      opponents: ['AI_5', 'AI_6', 'AI_7', 'AI_8'],
      minDifficulty: 4,
      difficulty: 8,
      rewards: {
        xp: 200,
        currency: 500,
        unlocksNextEvent: true,
      },
    });
    eventIndex++;
  }

  // Tier 5: World (10 events)
  for (let i = 0; i < 10; i++) {
    CAREER_EVENTS.push({
      id: `career_${eventIndex}`,
      index: eventIndex,
      tier: 5,
      name: `World Championship - Event ${i + 1}`,
      description: 'Compete at the world championship',
      distance: 1500,
      stroke: (juniorStrokes[i % 4] as any) || 'FREESTYLE',
      opponents: ['AI_6', 'AI_7', 'AI_8'],
      minDifficulty: 5,
      difficulty: 10,
      rewards: {
        xp: 300,
        currency: 1000,
        unlocksNextEvent: false,
      },
    });
    eventIndex++;
  }
}

initializeCareerEvents();

function calculatePlayerOvr(stats: ISwimmerStats): number {
  return Math.round(
    stats.speed * 4.8 +
      stats.stamina * 4.6 +
      stats.technique * 4.4 +
      stats.endurance * 3.8 +
      stats.mental * 2.4
  );
}

function ensureDevelopmentPlayer(player: IPlayerSwimmer): IPlayerSwimmer {
  const normalized = ensureDevelopment({
    id: player.id,
    name: player.name,
    ovr: calculatePlayerOvr(player.stats),
    stats: {
      speed: player.stats.speed * 5,
      stamina: player.stats.stamina * 5,
      technique: player.stats.technique * 5,
      endurance: player.stats.endurance * 5,
      mental: player.stats.mental * 5,
    },
    development: player.development,
  }, player.development?.age ?? 18);

  return {
    ...player,
    stats: {
      speed: Math.round(normalized.stats.speed) / 5,
      stamina: Math.round(normalized.stats.stamina) / 5,
      technique: Math.round(normalized.stats.technique) / 5,
      endurance: Math.round(normalized.stats.endurance) / 5,
      mental: Math.round(normalized.stats.mental) / 5,
    },
    development: normalized.development,
  };
}

export class PlayerManager {
  private player: IPlayerSwimmer | null = null;
  private cosmetics: Map<string, IEquipment> = new Map();
  private rivals: Map<string, IRival> = new Map();
  private lastSyncTime: number = 0;

  constructor() {
    logger.log('PlayerManager initialized');
  }

  // ============================================================================
  // PLAYER CREATION
  // ============================================================================

  /**
   * Create a new player swimmer
   */
  public createPlayer(
    name: string,
    specialty: SwimmerSpecialty,
    attributes: ISwimmerAttributes
  ): IPlayerSwimmer {
    const baseStats: ISwimmerStats = {
      speed: 8,
      stamina: 8,
      technique: 8,
      endurance: 8,
      mental: 5,
    };

    // Apply specialty bonuses
    const bonuses = SPECIALTY_STAT_BONUSES[specialty];
    const stats: ISwimmerStats = {
      speed: baseStats.speed + (bonuses.speed || 0),
      stamina: baseStats.stamina + (bonuses.stamina || 0),
      technique: baseStats.technique + (bonuses.technique || 0),
      endurance: baseStats.endurance + (bonuses.endurance || 0),
      mental: baseStats.mental,
    };

    this.player = {
      id: `player_${Date.now()}`,
      name,
      level: 1,
      xp: 0,
      stats,
      attributes,
      specialty,
      cosmetics: {
        suitColor: '#0066CC',
        suitPattern: 'solid',
        capStyle: 'standard',
        capColor: '#FF6600',
        gogglesStyle: 'standard',
        celebrationAnimation: 'waves',
        equipment: [],
      },
      careerTier: 1,
      careerEventIndex: 0,
      reputation: 0,
      fame: 0,
      development: createDevelopmentProfile(18, calculatePlayerOvr(stats)),
      createdAt: Date.now(),
    };

    this.savePlayer();
    logger.log('Player created:', this.player.name);

    return deepClone(this.player);
  }

  /**
   * Load player from storage
   */
  public loadPlayer(): IPlayerSwimmer | null {
    const saved = storage.get<IPlayerSwimmer>('player_data');
    if (saved) {
      this.player = ensureDevelopmentPlayer(saved);
      logger.log('Player loaded:', this.player.name);
      return deepClone(this.player);
    }
    return null;
  }

  /**
   * Get current player
   */
  public getPlayer(): IPlayerSwimmer | null {
    return this.player ? deepClone(this.player) : null;
  }

  /**
   * Save player to storage
   */
  private savePlayer(): void {
    if (!this.player) return;
    this.player = ensureDevelopmentPlayer(this.player);
    storage.set('player_data', this.player);
  }

  /**
   * Set current player state directly
   */
  public setPlayer(player: IPlayerSwimmer): void {
    this.player = ensureDevelopmentPlayer(player);
    this.savePlayer();
  }

  // ============================================================================
  // STAT PROGRESSION
  // ============================================================================

  /**
   * Add XP to player and handle leveling
   */
  public addXp(amount: number): { leveledUp: boolean; newLevel: number } {
    if (!this.player) return { leveledUp: false, newLevel: 1 };

    const prevLevel = this.player.level;
    this.player.xp += amount;

    const { level } = levelFromXp(this.player.xp);
    const leveledUp = level > prevLevel;

    if (leveledUp) {
      this.player.level = level;
      this.applyLevelUpBonus(prevLevel, level);
    }

    this.savePlayer();

    return { leveledUp, newLevel: this.player.level };
  }

  /**
   * Apply stat bonuses on level up
   */
  private applyLevelUpBonus(fromLevel: number, toLevel: number): void {
    if (!this.player) return;

    for (let level = fromLevel + 1; level <= toLevel; level++) {
      // Base stat gain
      this.player.stats.speed += 0.5;
      this.player.stats.stamina += 0.5;
      this.player.stats.technique += 0.5;
      this.player.stats.endurance += 0.5;

      // Specialty bonus (double stat gain)
      if (this.player.specialty === 'SPRINTER') {
        this.player.stats.speed += 1.0;
      } else if (this.player.specialty === 'DISTANCE') {
        this.player.stats.stamina += 1.0;
      } else if (this.player.specialty === 'TECHNICIAN') {
        this.player.stats.technique += 1.0;
      }

      // Random stat (encourages build variation)
      const randomStat = ['speed', 'stamina', 'technique', 'endurance'][
        Math.floor(Math.random() * 4)
      ] as keyof ISwimmerStats;
      this.player.stats[randomStat] += 0.25;

      // Clamp stats to max
      this.clampStats(this.player);
    }
  }

  /**
   * Clamp stats to max based on specialty
   */
  private clampStats(player: IPlayerSwimmer): void {
    const maxSpeed = player.specialty === 'SPRINTER' ? 20 : player.specialty === 'DISTANCE' ? 10 : 15;
    const maxStamina = player.specialty === 'DISTANCE' ? 20 : player.specialty === 'SPRINTER' ? 10 : 15;
    const maxTechnique = player.specialty === 'TECHNICIAN' ? 18 : 15;

    player.stats.speed = Math.min(maxSpeed, Math.max(1, player.stats.speed));
    player.stats.stamina = Math.min(maxStamina, Math.max(1, player.stats.stamina));
    player.stats.technique = Math.min(maxTechnique, Math.max(1, player.stats.technique));
    player.stats.endurance = Math.min(18, Math.max(1, player.stats.endurance));
    player.stats.mental = Math.min(15, Math.max(1, player.stats.mental));
  }


  /**
   * Apply a focused training session to the current player
   */
  public applyTrainingBlock(focus: TrainingFocus, minutes: number): TrainingSessionResult<any> | null {
    if (!this.player) return null;

    const normalizedPlayer = ensureDevelopmentPlayer(this.player);
    const result = applyTrainingSession({
      id: normalizedPlayer.id,
      name: normalizedPlayer.name,
      ovr: calculatePlayerOvr(normalizedPlayer.stats),
      stats: {
        speed: normalizedPlayer.stats.speed * 5,
        stamina: normalizedPlayer.stats.stamina * 5,
        technique: normalizedPlayer.stats.technique * 5,
        endurance: normalizedPlayer.stats.endurance * 5,
        mental: normalizedPlayer.stats.mental * 5,
      },
      development: normalizedPlayer.development,
    }, focus, minutes);

    this.player = ensureDevelopmentPlayer({
      ...normalizedPlayer,
      stats: {
        speed: result.athlete.stats.speed / 5,
        stamina: result.athlete.stats.stamina / 5,
        technique: result.athlete.stats.technique / 5,
        endurance: result.athlete.stats.endurance / 5,
        mental: result.athlete.stats.mental / 5,
      },
      development: result.athlete.development,
    });
    this.savePlayer();

    return { ...result, athlete: deepClone(this.player) };
  }

  /**
   * Recover the current player between sessions/races
   */
  public recoverPlayer(hours: number): IPlayerSwimmer | null {
    if (!this.player) return null;

    const normalizedPlayer = ensureDevelopmentPlayer(this.player);
    const recovered = recoverAthlete({
      id: normalizedPlayer.id,
      name: normalizedPlayer.name,
      ovr: calculatePlayerOvr(normalizedPlayer.stats),
      stats: {
        speed: normalizedPlayer.stats.speed * 5,
        stamina: normalizedPlayer.stats.stamina * 5,
        technique: normalizedPlayer.stats.technique * 5,
        endurance: normalizedPlayer.stats.endurance * 5,
        mental: normalizedPlayer.stats.mental * 5,
      },
      development: normalizedPlayer.development,
    }, hours);

    this.player = ensureDevelopmentPlayer({
      ...normalizedPlayer,
      stats: {
        speed: recovered.stats.speed / 5,
        stamina: recovered.stats.stamina / 5,
        technique: recovered.stats.technique / 5,
        endurance: recovered.stats.endurance / 5,
        mental: recovered.stats.mental / 5,
      },
      development: recovered.development,
    });
    this.savePlayer();
    return deepClone(this.player);
  }

  // ============================================================================
  // CAREER PROGRESSION
  // ============================================================================

  /**
   * Get career event at index
   */
  public getCareerEvent(index: number): ICareerEvent | null {
    if (index < 0 || index >= CAREER_EVENTS.length) return null;
    return deepClone(CAREER_EVENTS[index]);
  }

  /**
   * Get all career events for a tier
   */
  public getCareerEventsByTier(tier: number): ICareerEvent[] {
    return CAREER_EVENTS.filter((e) => e.tier === tier).map((e) => deepClone(e));
  }

  /**
   * Complete a career event
   */
  public completeCareerEvent(eventIndex: number): void {
    if (!this.player) return;

    const event = this.getCareerEvent(eventIndex);
    if (!event) return;

    this.player.careerEventIndex = Math.max(this.player.careerEventIndex, eventIndex + 1);
    this.player.careerTier = event.tier;

    this.savePlayer();
    logger.log('Career event completed:', event.name);
  }

  /**
   * Get next unplayed career event
   */
  public getNextCareerEvent(): ICareerEvent | null {
    if (!this.player) return null;
    return this.getCareerEvent(this.player.careerEventIndex);
  }

  // ============================================================================
  // REPUTATION & FAME
  // ============================================================================

  /**
   * Add reputation (from wins)
   */
  public addReputation(amount: number): void {
    if (!this.player) return;

    this.player.reputation = Math.min(1000, this.player.reputation + amount);
    this.savePlayer();
  }

  /**
   * Add fame (from high placements)
   */
  public addFame(amount: number): void {
    if (!this.player) return;

    this.player.fame = Math.min(500, this.player.fame + amount);
    this.savePlayer();
  }

  /**
   * Get reputation tier
   */
  public getReputationTier(): string {
    if (!this.player) return 'Unknown';

    if (this.player.reputation >= 750) return 'Elite';
    if (this.player.reputation >= 500) return 'International';
    if (this.player.reputation >= 250) return 'National';
    if (this.player.reputation >= 100) return 'Regional';
    if (this.player.reputation >= 50) return 'Local';
    return 'Rookie';
  }

  // ============================================================================
  // COSMETICS & EQUIPMENT
  // ============================================================================

  /**
   * Add cosmetic/equipment to player inventory
   */
  public unlockCosmetic(cosmetic: IEquipment): void {
    if (!this.player) return;

    this.cosmetics.set(cosmetic.id, cosmetic);
    this.player.cosmetics.equipment.push(cosmetic.id);

    this.savePlayer();
    logger.log('Cosmetic unlocked:', cosmetic.name);
  }

  /**
   * Equip a cosmetic
   */
  public equipCosmetic(cosmetic: IEquipment): void {
    if (!this.player) return;

    if (!this.cosmetics.has(cosmetic.id)) {
      logger.warn('Cosmetic not owned:', cosmetic.id);
      return;
    }

    // Apply stat bonuses
    if (cosmetic.statBonus) {
      Object.entries(cosmetic.statBonus).forEach(([key, value]) => {
        const stat = key as keyof ISwimmerStats;
        if (this.player!.stats[stat]) {
          this.player!.stats[stat] += value as number;
        }
      });
    }

    this.savePlayer();
    logger.log('Cosmetic equipped:', cosmetic.name);
  }

  /**
   * Get owned cosmetics
   */
  public getOwnedCosmetics(): IEquipment[] {
    return Array.from(this.cosmetics.values());
  }

  // ============================================================================
  // RIVALS
  // ============================================================================

  /**
   * Register a rival
   */
  public setRival(rival: IRival): void {
    this.rivals.set(rival.id, rival);
  }

  /**
   * Get rival by ID
   */
  public getRival(rivalId: string): IRival | null {
    return this.rivals.get(rivalId) || null;
  }

  /**
   * Get all unlocked rivals
   */
  public getUnlockedRivals(): IRival[] {
    if (!this.player) return [];

    return Array.from(this.rivals.values()).filter((rival) => rival.unlockLevel <= this.player!.level);
  }

  /**
   * Update rival record after race
   */
  public updateRivalRecord(rivalId: string, playerWon: boolean): void {
    const rival = this.rivals.get(rivalId);
    if (!rival || !this.player) return;

    rival.racesAgainstPlayer++;
    if (playerWon) {
      rival.playerWins++;
    }
  }

  // ============================================================================
  // CLOUD SYNC
  // ============================================================================

  /**
   * Prepare data for cloud sync
   */
  public getPrepareForSync(): ICloudSyncData | null {
    if (!this.player) return null;

    return {
      playerData: deepClone(this.player),
      careerProgress: {
        tier: this.player.careerTier,
        eventIndex: this.player.careerEventIndex,
        completedEvents: [], // TODO: Track which events completed
      },
      rivals: Array.from(this.rivals.values()).map((rival) => ({
        rivalId: rival.id,
        racesAgainst: rival.racesAgainstPlayer,
        wins: rival.playerWins,
      })),
      cosmetics: Array.from(this.cosmetics.keys()),
      lastSync: Date.now(),
    };
  }

  /**
   * Apply cloud sync data
   */
  public applySyncData(syncData: ICloudSyncData): void {
    if (syncData.playerData) {
      this.player = syncData.playerData;
      this.savePlayer();
    }

    this.lastSyncTime = syncData.lastSync;
    logger.log('Cloud sync applied');
  }

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  /**
   * Export player data (for backup/sharing)
   */
  public exportData(): string {
    const data = {
      player: this.player,
      cosmetics: Array.from(this.cosmetics.values()),
      rivals: Array.from(this.rivals.values()),
      exportDate: new Date().toISOString(),
    };

    return JSON.stringify(data);
  }

  /**
   * Import player data
   */
  public importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      this.player = data.player;
      this.cosmetics.clear();
      (data.cosmetics || []).forEach((cosmetic: IEquipment) => {
        this.cosmetics.set(cosmetic.id, cosmetic);
      });

      this.rivals.clear();
      (data.rivals || []).forEach((rival: IRival) => {
        this.rivals.set(rival.id, rival);
      });

      this.savePlayer();
      logger.log('Player data imported successfully');

      return true;
    } catch (error) {
      logger.error('Failed to import player data:', error);
      return false;
    }
  }

  /**
   * Clear all player data
   */
  public resetAll(): void {
    this.player = null;
    this.cosmetics.clear();
    this.rivals.clear();
    storage.remove('player_data');
    logger.log('All player data cleared');
  }
}

export const playerManager = new PlayerManager();

export default playerManager;
