/**
 * Integration tests for module interactions
 */

import { GameManager } from '../core/GameManager';
import { RaceEngine } from '../core/RaceEngine';
import { PlayerManager } from '../data/PlayerManager';
import { RivalSystem } from '../gameplay/RivalSystem';
import { IRaceSetup, IPlayerSwimmer } from '../types';

describe('Module Integration Tests', () => {
  let gameManager: GameManager;
  let playerManager: PlayerManager;
  let rivalSystem: RivalSystem;
  let mockPlayer: IPlayerSwimmer;

  beforeEach(() => {
    gameManager = new GameManager();
    playerManager = new PlayerManager();
    rivalSystem = new RivalSystem();

    // Create test player
    mockPlayer = playerManager.createPlayer('Integration Test', 'SPRINTER', {
      height: 185,
      weight: 80,
      armSpan: 188,
      strokeRate: 92,
    });
  });

  describe('GameManager + PlayerManager Integration', () => {
    it('should initialize game with player manager', async () => {
      await gameManager.init(mockPlayer, true);

      const player = gameManager.getPlayer();
      expect(player).not.toBeNull();
      expect(player!.name).toBe('Integration Test');
    });

    it('should sync player progression between managers', async () => {
      await gameManager.init(mockPlayer, true);

      // Add XP through GameManager
      gameManager.addXp(100);

      const updated = gameManager.getPlayer();
      expect(updated!.level).toBe(2);
    });

    it('should handle reputation changes across managers', async () => {
      await gameManager.init(mockPlayer, true);

      gameManager.addReputation(250);
      const player = gameManager.getPlayer();
      expect(player!.reputation).toBeGreaterThanOrEqual(250);
    });
  });

  describe('RivalSystem Integration', () => {
    it('should load all rivals correctly', () => {
      const rivals = rivalSystem.getAllRivals();
      expect(rivals.length).toBe(16);
    });

    it('should unlock rivals based on player level', async () => {
      await gameManager.init(mockPlayer, true);

      const unlockedAt5 = rivalSystem.getUnlockedRivals(5);
      const unlockedAt50 = rivalSystem.getUnlockedRivals(50);

      expect(unlockedAt50.length).toBeGreaterThan(unlockedAt5.length);
    });

    it('should provide rival difficulty multiplier', () => {
      const rival = rivalSystem.getRival('rival_1');
      const multiplier = rivalSystem.getDifficultyMultiplier('rival_1');

      expect(rival).not.toBeNull();
      expect(multiplier).toBeGreaterThan(0.5);
      expect(multiplier).toBeLessThan(1.5);
    });

    it('should track rivalry records', () => {
      rivalSystem.recordRaceOutcome('rival_1', true);
      rivalSystem.recordRaceOutcome('rival_1', false);
      rivalSystem.recordRaceOutcome('rival_1', true);

      const record = rivalSystem.getRivalryRecord('rival_1');
      expect(record.wins).toBe(2);
      expect(record.losses).toBe(1);
      expect(record.ratio).toBeCloseTo(0.667, 2);
    });

    it('should advance rivalry arcs', () => {
      const arcBefore = rivalSystem.getRivalArc('rival_1');
      rivalSystem.advanceRivalArc('rival_1', true);
      const arcAfter = rivalSystem.getRivalArc('rival_1');

      expect(arcAfter).toBeGreaterThan(arcBefore);
    });
  });

  describe('Race Engine Integration', () => {
    it('should initialize race with opponents', () => {
      const setup: IRaceSetup = {
        mode: 'QUICK_RACE',
        distance: 50,
        stroke: 'FREESTYLE',
        poolTheme: 'OLYMPIC',
        timeOfDay: 'AFTERNOON',
        difficulty: 'NORMAL',
        opponents: [
          {
            id: 'ai_1',
            name: 'Test Opponent',
            lane: 1,
            stats: { speed: 8, stamina: 8, technique: 8, endurance: 8, mental: 5 },
            attributes: { height: 180, weight: 75, armSpan: 182, strokeRate: 90 },
            personality: {
              name: 'Test',
              archetype: 'Test',
              traits: ['Test'],
              dialogue: ['Test'],
              trashTalkChance: 0.5,
            },
            specialty: 'ALL_AROUND',
            skillTier: 2,
          },
        ],
      };

      const engine = new RaceEngine(setup);
      const raceState = engine.getRaceState();

      expect(raceState).toBeDefined();
      expect(raceState.swimmers.length).toBe(1);
    });

    it('should progress race countdown', () => {
      const setup: IRaceSetup = {
        mode: 'QUICK_RACE',
        distance: 50,
        stroke: 'FREESTYLE',
        poolTheme: 'OLYMPIC',
        timeOfDay: 'AFTERNOON',
        difficulty: 'NORMAL',
        opponents: [],
      };

      const engine = new RaceEngine(setup);
      engine.startCountdown();

      const raceState = engine.getRaceState();
      expect(raceState.state).toBe('COUNTDOWN');
    });

    it('should handle race updates', () => {
      const setup: IRaceSetup = {
        mode: 'QUICK_RACE',
        distance: 50,
        stroke: 'FREESTYLE',
        poolTheme: 'OLYMPIC',
        timeOfDay: 'AFTERNOON',
        difficulty: 'NORMAL',
        opponents: [],
      };

      const engine = new RaceEngine(setup);

      // Update should not throw errors
      engine.update(0.016); // ~60FPS delta time

      expect(engine.getRaceState()).toBeDefined();
    });
  });

  describe('Cross-Module Event Flow', () => {
    it('should emit events through managers', async () => {
      await gameManager.init(mockPlayer, true);

      let eventCount = 0;
      gameManager.on('playerDataChanged', () => {
        eventCount++;
      });

      gameManager.addXp(50);
      expect(eventCount).toBeGreaterThan(0);
    });

    it('should handle mode switching with player data', async () => {
      await gameManager.init(mockPlayer, true);

      gameManager.switchMode('QUICK_RACE');
      expect(gameManager.getMode()).toBe('QUICK_RACE');
      expect(gameManager.getPlayer()).not.toBeNull();
    });
  });

  describe('Data Consistency', () => {
    it('should maintain player data consistency through updates', async () => {
      await gameManager.init(mockPlayer, true);

      const before = gameManager.getPlayer();
      const initialReputation = before!.reputation;

      gameManager.addReputation(100);

      const after = gameManager.getPlayer();
      expect(after!.reputation).toBe(initialReputation + 100);
    });

    it('should not corrupt player data on rapid updates', async () => {
      await gameManager.init(mockPlayer, true);

      for (let i = 0; i < 100; i++) {
        gameManager.addXp(10);
        gameManager.addReputation(1);
        gameManager.addFame(1);
      }

      const player = gameManager.getPlayer();
      expect(player!.reputation).toBeLessThanOrEqual(1000);
      expect(player!.fame).toBeLessThanOrEqual(500);
      expect(player!.level).toBeGreaterThanOrEqual(1);
    });
  });
});
