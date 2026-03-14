/**
 * Unit tests for GameManager
 */

import { GameManager } from '../GameManager';
import { IPlayerSwimmer } from '../../types';

describe('GameManager', () => {
  let gameManager: GameManager;
  let mockPlayer: IPlayerSwimmer;

  beforeEach(() => {
    gameManager = new GameManager();
    mockPlayer = {
      id: 'test_player',
      name: 'Test Swimmer',
      level: 1,
      xp: 0,
      stats: { speed: 8, stamina: 8, technique: 8, endurance: 8, mental: 5 },
      attributes: { height: 180, weight: 75, armSpan: 182, strokeRate: 90 },
      specialty: 'ALL_AROUND',
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
      createdAt: Date.now(),
    };
  });

  describe('Initialization', () => {
    it('should initialize without errors', () => {
      expect(gameManager).toBeDefined();
      expect(gameManager.getGameState()).toBe('IDLE');
    });

    it('should initialize with player data', async () => {
      await gameManager.init(mockPlayer, true);
      expect(gameManager.getPlayer()).not.toBeNull();
      expect(gameManager.getGameState()).toBe('MENU');
    });

    it('should track online status', async () => {
      await gameManager.init(mockPlayer, true);
      expect(gameManager.isOnlineStatus()).toBe(true);

      gameManager.setOnlineStatus(false);
      expect(gameManager.isOnlineStatus()).toBe(false);
    });
  });

  describe('Mode Management', () => {
    it('should switch game modes', async () => {
      await gameManager.init(mockPlayer, true);

      gameManager.switchMode('QUICK_RACE');
      expect(gameManager.getMode()).toBe('QUICK_RACE');

      gameManager.switchMode('CAREER');
      expect(gameManager.getMode()).toBe('CAREER');
    });

    it('should not switch to same mode twice', async () => {
      await gameManager.init(mockPlayer, true);

      let changeCount = 0;
      gameManager.on('modeChanged', () => {
        changeCount++;
      });

      gameManager.switchMode('QUICK_RACE');
      gameManager.switchMode('QUICK_RACE'); // Same mode

      expect(changeCount).toBe(1); // Only one change event
    });
  });

  describe('Progression System', () => {
    it('should add XP without leveling up', async () => {
      await gameManager.init(mockPlayer, true);

      gameManager.addXp(50);
      const player = gameManager.getPlayer();
      expect(player!.xp).toBe(50);
      expect(player!.level).toBe(1);
    });

    it('should level up when XP threshold met', async () => {
      await gameManager.init(mockPlayer, true);

      let levelUpCount = 0;
      gameManager.on('playerLeveledUp', () => {
        levelUpCount++;
      });

      // Level 1 requires 100 XP
      gameManager.addXp(100);
      const player = gameManager.getPlayer();
      expect(player!.level).toBe(2);
      expect(levelUpCount).toBe(1);
    });

    it('should track reputation correctly', async () => {
      await gameManager.init(mockPlayer, true);

      gameManager.addReputation(100);
      let player = gameManager.getPlayer();
      expect(player!.reputation).toBe(100);

      gameManager.addReputation(950); // Push over max
      player = gameManager.getPlayer();
      expect(player!.reputation).toBe(1000); // Clamped to max
    });

    it('should track fame correctly', async () => {
      await gameManager.init(mockPlayer, true);

      gameManager.addFame(50);
      let player = gameManager.getPlayer();
      expect(player!.fame).toBe(50);

      gameManager.addFame(500); // Push over max
      player = gameManager.getPlayer();
      expect(player!.fame).toBe(500); // Clamped to max
    });
  });

  describe('Settings', () => {
    it('should update settings', async () => {
      await gameManager.init(mockPlayer, true);

      gameManager.updateSetting('difficulty', 'HARD');
      expect(gameManager.getSetting('difficulty')).toBe('HARD');
    });

    it('should return all settings', async () => {
      await gameManager.init(mockPlayer, true);

      const settings = gameManager.getSettings();
      expect(settings).toBeDefined();
      expect(settings.difficulty).toBeDefined();
      expect(settings.soundEnabled).toBeDefined();
    });
  });

  describe('Events', () => {
    it('should emit and listen to events', async () => {
      await gameManager.init(mockPlayer, true);

      let eventFired = false;
      const unsubscribe = gameManager.on('gameStateChanged', (data) => {
        eventFired = true;
        expect(data.newState).toBeDefined();
      });

      gameManager.switchMode('QUICK_RACE'); // Triggers mode change

      expect(eventFired).toBe(true);
      unsubscribe(); // Clean up
    });
  });

  describe('Lifecycle', () => {
    it('should track time correctly', async () => {
      const startTime = gameManager.getElapsedTime();
      expect(startTime).toBeGreaterThanOrEqual(0);
    });

    it('should shutdown gracefully', async () => {
      await gameManager.init(mockPlayer, true);
      gameManager.shutdown();

      // After shutdown, player should be null
      expect(gameManager.getPlayer()).toBeNull();
    });
  });
});
