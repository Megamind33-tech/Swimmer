/**
 * App.tsx Integration Tests
 * Tests that verify the app works correctly with integrated modules
 */

import { GameManager } from '../core/GameManager';
import { PlayerManager } from '../data/PlayerManager';
import { RivalSystem } from '../gameplay/RivalSystem';
import { RaceEngine } from '../core/RaceEngine';

describe('App.tsx Module Integration', () => {
  describe('Hook Initialization', () => {
    test('GameManager initializes without errors', () => {
      const manager = new GameManager();
      expect(manager).toBeDefined();
      expect(manager.getGameState()).toBe('IDLE');
    });

    test('PlayerManager initializes without errors', () => {
      const manager = new PlayerManager();
      expect(manager).toBeDefined();
      expect(manager.getPlayer()).toBeNull(); // No player yet
    });

    test('RivalSystem initializes without errors', () => {
      const system = new RivalSystem();
      expect(system).toBeDefined();
      expect(system.getAllRivals().length).toBe(16);
    });
  });

  describe('Full Game Flow Simulation', () => {
    test('Should create player and initialize game', async () => {
      const pmgr = new PlayerManager();
      const gmgr = new GameManager();

      // Create a player
      const player = pmgr.createPlayer('Test Player', 'SPRINTER', {
        height: 185,
        weight: 80,
        armSpan: 188,
        strokeRate: 92,
      });

      expect(player).toBeDefined();
      expect(player.name).toBe('Test Player');
      expect(player.level).toBe(1);
      expect(player.xp).toBe(0);

      // Initialize game manager with player
      await gmgr.init(player, true);
      expect(gmgr.getPlayer()).toBeDefined();
      expect(gmgr.getGameState()).toBe('MENU');
    });

    test('Should allow mode switching', async () => {
      const gmgr = new GameManager();
      const pmgr = new PlayerManager();

      const player = pmgr.createPlayer('Mode Test', 'ALL_AROUND', {
        height: 180,
        weight: 75,
        armSpan: 182,
        strokeRate: 90,
      });

      await gmgr.init(player, true);

      // Test mode switching
      gmgr.switchMode('QUICK_RACE');
      expect(gmgr.getMode()).toBe('QUICK_RACE');

      gmgr.switchMode('CAREER');
      expect(gmgr.getMode()).toBe('CAREER');

      gmgr.switchMode('RANKED');
      expect(gmgr.getMode()).toBe('RANKED');
    });

    test('Should progress player through levels with XP', async () => {
      const gmgr = new GameManager();
      const pmgr = new PlayerManager();

      const player = pmgr.createPlayer('XP Test', 'DISTANCE', {
        height: 175,
        weight: 70,
        armSpan: 177,
        strokeRate: 88,
      });

      await gmgr.init(player, true);

      let levelUpCount = 0;
      gmgr.on('playerLeveledUp', () => {
        levelUpCount++;
      });

      // Add XP to level up
      gmgr.addXp(100); // Should trigger level 2
      let currentPlayer = gmgr.getPlayer();
      expect(currentPlayer!.level).toBe(2);
      expect(levelUpCount).toBe(1);

      // Add more XP
      gmgr.addXp(150); // Should trigger level 3
      currentPlayer = gmgr.getPlayer();
      expect(currentPlayer!.level).toBe(3);
      expect(levelUpCount).toBe(2);
    });

    test('Should track reputation and fame', async () => {
      const gmgr = new GameManager();
      const pmgr = new PlayerManager();

      const player = pmgr.createPlayer('Rep Test', 'TECHNICIAN', {
        height: 188,
        weight: 85,
        armSpan: 190,
        strokeRate: 94,
      });

      await gmgr.init(player, true);

      gmgr.addReputation(250);
      let currentPlayer = gmgr.getPlayer();
      expect(currentPlayer!.reputation).toBe(250);

      gmgr.addFame(100);
      currentPlayer = gmgr.getPlayer();
      expect(currentPlayer!.fame).toBe(100);

      // Test clamping
      gmgr.addReputation(1000); // Push over max of 1000
      currentPlayer = gmgr.getPlayer();
      expect(currentPlayer!.reputation).toBeLessThanOrEqual(1000);
    });
  });

  describe('Rival System Integration', () => {
    test('Should unlock rivals based on player level', () => {
      const rsys = new RivalSystem();
      const gmgr = new GameManager();
      const pmgr = new PlayerManager();

      const player = pmgr.createPlayer('Rival Test', 'SPRINTER', {
        height: 180,
        weight: 75,
        armSpan: 182,
        strokeRate: 90,
      });

      // Level 1 player should have fewer unlocked rivals
      const unlockedL1 = rsys.getUnlockedRivals(1);
      expect(unlockedL1.length).toBeLessThan(16);

      // Level 50 player should have more
      const unlockedL50 = rsys.getUnlockedRivals(50);
      expect(unlockedL50.length).toBeGreaterThan(unlockedL1.length);

      // Level 100 should have all rivals
      const unlockedL100 = rsys.getUnlockedRivals(100);
      expect(unlockedL100.length).toBe(16);
    });

    test('Should select appropriate rival for player level', () => {
      const rsys = new RivalSystem();

      const rivalL5 = rsys.selectRival(5);
      expect(rivalL5).toBeDefined();
      expect(rivalL5!.unlockLevel).toBeLessThanOrEqual(5);

      const rivalL50 = rsys.selectRival(50);
      expect(rivalL50).toBeDefined();
      expect(rivalL50!.unlockLevel).toBeLessThanOrEqual(50);
    });

    test('Should track race outcomes against rivals', () => {
      const rsys = new RivalSystem();
      const rivalId = 'rival_1';

      // Win against rival
      rsys.recordRaceOutcome(rivalId, true);
      let record = rsys.getRivalryRecord(rivalId);
      expect(record.wins).toBe(1);
      expect(record.losses).toBe(0);

      // Lose against rival
      rsys.recordRaceOutcome(rivalId, false);
      record = rsys.getRivalryRecord(rivalId);
      expect(record.wins).toBe(1);
      expect(record.losses).toBe(1);
      expect(record.ratio).toBeCloseTo(0.5, 1);
    });
  });

  describe('Race Engine Integration', () => {
    test('Should initialize race with AI swimmers', () => {
      const setup = {
        mode: 'QUICK_RACE' as const,
        distance: 50,
        stroke: 'FREESTYLE' as const,
        poolTheme: 'OLYMPIC' as const,
        timeOfDay: 'AFTERNOON' as const,
        difficulty: 'NORMAL' as const,
        opponents: [
          {
            id: 'ai_1',
            name: 'Test Swimmer',
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
            specialty: 'ALL_AROUND' as const,
            skillTier: 2,
          },
        ],
      };

      const engine = new RaceEngine(setup);
      const raceState = engine.getRaceState();

      expect(raceState).toBeDefined();
      expect(raceState.swimmers.length).toBe(1);
      expect(raceState.state).toBe('IDLE');
    });

    test('Should progress race through countdown and racing states', () => {
      const setup = {
        mode: 'QUICK_RACE' as const,
        distance: 50,
        stroke: 'FREESTYLE' as const,
        poolTheme: 'OLYMPIC' as const,
        timeOfDay: 'AFTERNOON' as const,
        difficulty: 'NORMAL' as const,
        opponents: [],
      };

      const engine = new RaceEngine(setup);

      // Start countdown
      engine.startCountdown();
      let raceState = engine.getRaceState();
      expect(raceState.state).toBe('COUNTDOWN');

      // Update multiple times to progress countdown
      for (let i = 0; i < 200; i++) {
        engine.update(0.016); // 60 FPS delta
      }

      // Race should have started
      raceState = engine.getRaceState();
      expect(raceState.state).toMatch(/COUNTDOWN|RACING/);
    });
  });

  describe('State Consistency', () => {
    test('Should maintain state consistency through rapid updates', async () => {
      const gmgr = new GameManager();
      const pmgr = new PlayerManager();

      const player = pmgr.createPlayer('Stress Test', 'ALL_AROUND', {
        height: 182,
        weight: 78,
        armSpan: 184,
        strokeRate: 91,
      });

      await gmgr.init(player, true);

      // Rapid updates
      for (let i = 0; i < 100; i++) {
        gmgr.addXp(10);
        gmgr.addReputation(5);
        gmgr.addFame(2);
      }

      const currentPlayer = gmgr.getPlayer();
      expect(currentPlayer!.reputation).toBeLessThanOrEqual(1000);
      expect(currentPlayer!.fame).toBeLessThanOrEqual(500);
      expect(currentPlayer!.level).toBeGreaterThan(1);
    });

    test('Should preserve player data across save/load', () => {
      const pmgr = new PlayerManager();

      // Create and save player
      const created = pmgr.createPlayer('Save Test', 'DISTANCE', {
        height: 180,
        weight: 75,
        armSpan: 182,
        strokeRate: 90,
      });

      expect(created).toBeDefined();
      expect(created.name).toBe('Save Test');

      // Load player
      const loaded = pmgr.loadPlayer();
      expect(loaded).toBeDefined();
      expect(loaded!.name).toBe('Save Test');
      expect(loaded!.id).toBe(created.id);
    });
  });

  describe('Error Handling', () => {
    test('Should handle null player gracefully', async () => {
      const gmgr = new GameManager();

      // Try operations without player
      expect(() => {
        gmgr.addXp(100);
      }).not.toThrow();

      expect(() => {
        gmgr.addReputation(50);
      }).not.toThrow();

      expect(() => {
        gmgr.addFame(25);
      }).not.toThrow();

      expect(gmgr.getPlayer()).toBeNull();
    });

    test('Should handle invalid mode switches safely', async () => {
      const gmgr = new GameManager();
      const pmgr = new PlayerManager();

      const player = pmgr.createPlayer('Error Test', 'SPRINTER', {
        height: 185,
        weight: 80,
        armSpan: 188,
        strokeRate: 92,
      });

      await gmgr.init(player, true);

      // Switch to same mode twice (second should be ignored)
      let switchCount = 0;
      gmgr.on('modeChanged', () => {
        switchCount++;
      });

      gmgr.switchMode('QUICK_RACE');
      gmgr.switchMode('QUICK_RACE'); // Should not trigger another event

      expect(switchCount).toBe(1);
    });
  });

  describe('Performance', () => {
    test('Should initialize game manager in <5ms', () => {
      const start = performance.now();
      const gmgr = new GameManager();
      const end = performance.now();

      expect(end - start).toBeLessThan(5);
    });

    test('Should create player in <2ms', () => {
      const pmgr = new PlayerManager();

      const start = performance.now();
      pmgr.createPlayer('Perf Test', 'ALL_AROUND', {
        height: 180,
        weight: 75,
        armSpan: 182,
        strokeRate: 90,
      });
      const end = performance.now();

      expect(end - start).toBeLessThan(2);
    });

    test('Should process 100 XP updates in <20ms', async () => {
      const gmgr = new GameManager();
      const pmgr = new PlayerManager();

      const player = pmgr.createPlayer('Perf XP', 'ALL_AROUND', {
        height: 180,
        weight: 75,
        armSpan: 182,
        strokeRate: 90,
      });

      await gmgr.init(player, true);

      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        gmgr.addXp(10);
      }
      const end = performance.now();

      expect(end - start).toBeLessThan(20);
    });
  });
});

// Export mock implementation for testing
export { GameManager, PlayerManager, RivalSystem, RaceEngine };
