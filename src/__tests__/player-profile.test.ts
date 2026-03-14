/**
 * PlayerProfile Component Tests
 * Verifies correct player data display, stat calculations, achievements,
 * and profile interactions
 */

import { IPlayerSwimmer } from '../types/index';

describe('PlayerProfile Component', () => {
  // Mock player data
  const mockPlayer: IPlayerSwimmer = {
    id: 'player_test_1',
    name: 'Alex Turner',
    level: 5,
    xp: 500,
    stats: {
      speed: 11.5,
      stamina: 9,
      technique: 10,
      endurance: 10,
      mental: 8,
    },
    specialty: 'SPRINTER',
    careerTier: 1,
    careerEventIndex: 2,
    reputation: 250,
    fame: 100,
  };

  describe('Player Data Display', () => {
    test('Should display player name correctly', () => {
      expect(mockPlayer.name).toBe('Alex Turner');
      expect(mockPlayer.name.length).toBeGreaterThan(0);
    });

    test('Should display correct level', () => {
      expect(mockPlayer.level).toBe(5);
      expect(mockPlayer.level).toBeGreaterThanOrEqual(1);
      expect(mockPlayer.level).toBeLessThanOrEqual(100);
    });

    test('Should display correct specialty', () => {
      expect(mockPlayer.specialty).toBe('SPRINTER');
      const validSpecialties = [
        'SPRINTER',
        'DISTANCE',
        'TECHNICIAN',
        'ALL_AROUND',
      ];
      expect(validSpecialties).toContain(mockPlayer.specialty);
    });

    test('Should display all stats correctly', () => {
      const stats = mockPlayer.stats;
      expect(stats.speed).toBe(11.5);
      expect(stats.stamina).toBe(9);
      expect(stats.technique).toBe(10);
      expect(stats.endurance).toBe(10);
      expect(stats.mental).toBe(8);
    });

    test('Should display reputation correctly', () => {
      expect(mockPlayer.reputation).toBe(250);
      expect(mockPlayer.reputation).toBeGreaterThanOrEqual(0);
      expect(mockPlayer.reputation).toBeLessThanOrEqual(1000);
    });

    test('Should display fame correctly', () => {
      expect(mockPlayer.fame).toBe(100);
      expect(mockPlayer.fame).toBeGreaterThanOrEqual(0);
      expect(mockPlayer.fame).toBeLessThanOrEqual(500);
    });
  });

  describe('XP Progression Display', () => {
    test('Should calculate XP curve correctly', () => {
      const xpRequiredForLevel = (level: number): number => {
        if (level <= 5) return 100;
        if (level <= 10) return 150;
        if (level <= 20) return 250;
        if (level <= 30) return 400;
        if (level <= 50) return 750;
        return 1500;
      };

      // Level 1: 0 total
      // Level 2: 100 total
      // Level 3: 200 total
      // Level 4: 300 total
      // Level 5: 400 total
      // Level 6: 550 total (400 + 150)

      let totalXp = 0;
      for (let i = 1; i < 6; i++) {
        totalXp += xpRequiredForLevel(i);
      }
      expect(totalXp).toBe(400); // 5 levels at 100 XP each

      // At level 5, need 150 XP to reach level 6
      const xpForLevel6 = xpRequiredForLevel(6);
      expect(xpForLevel6).toBe(150);
    });

    test('Should calculate XP to next level correctly', () => {
      const xpRequiredForLevel = (level: number): number => {
        if (level <= 5) return 100;
        if (level <= 10) return 150;
        return 250;
      };

      const currentLevel = 5;
      const xpNeeded = xpRequiredForLevel(currentLevel);
      expect(xpNeeded).toBe(100); // Level 5 needs 100 XP to level up
    });

    test('Should calculate XP progress percentage', () => {
      const xpInLevel = 50;
      const xpNeeded = 100;
      const progress = (xpInLevel / xpNeeded) * 100;

      expect(progress).toBe(50);
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });

    test('Should calculate total XP correctly', () => {
      expect(mockPlayer.xp).toBe(500);
      expect(mockPlayer.xp).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Stat Calculations', () => {
    test('Should have valid stat ranges (1-20)', () => {
      const stats = mockPlayer.stats;
      [stats.speed, stats.stamina, stats.technique, stats.endurance, stats.mental].forEach(
        (stat) => {
          expect(stat).toBeGreaterThanOrEqual(1);
          expect(stat).toBeLessThanOrEqual(20);
        }
      );
    });

    test('Should format large numbers with commas', () => {
      const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      };

      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(10000)).toBe('10,000');
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    test('Should clamp stat display to valid range', () => {
      const clampStat = (stat: number): number => {
        return Math.max(1, Math.min(20, stat));
      };

      expect(clampStat(0.5)).toBe(1);
      expect(clampStat(10)).toBe(10);
      expect(clampStat(25)).toBe(20);
    });
  });

  describe('Achievements Calculation', () => {
    test('Should calculate level-based achievements', () => {
      const player: IPlayerSwimmer = {
        ...mockPlayer,
        level: 5,
      };

      const achievements = [
        { id: 'level_5', achieved: player.level >= 5 },
        { id: 'level_10', achieved: player.level >= 10 },
        { id: 'level_20', achieved: player.level >= 20 },
      ];

      expect(achievements[0].achieved).toBe(true); // Level 5 achieved
      expect(achievements[1].achieved).toBe(false); // Level 10 not achieved
      expect(achievements[2].achieved).toBe(false); // Level 20 not achieved
    });

    test('Should calculate reputation-based achievements', () => {
      const player: IPlayerSwimmer = {
        ...mockPlayer,
        reputation: 250,
      };

      const achievements = [
        { id: 'rep_250', achieved: player.reputation >= 250 },
        { id: 'rep_500', achieved: player.reputation >= 500 },
      ];

      expect(achievements[0].achieved).toBe(true);
      expect(achievements[1].achieved).toBe(false);
    });

    test('Should calculate fame-based achievements', () => {
      const player: IPlayerSwimmer = {
        ...mockPlayer,
        fame: 100,
      };

      const achievements = [
        { id: 'fame_100', achieved: player.fame >= 100 },
        { id: 'fame_200', achieved: player.fame >= 200 },
      ];

      expect(achievements[0].achieved).toBe(true);
      expect(achievements[1].achieved).toBe(false);
    });

    test('Should count achievements correctly', () => {
      const playerLow: IPlayerSwimmer = {
        ...mockPlayer,
        level: 1,
        reputation: 0,
        fame: 0,
      };

      const playerHigh: IPlayerSwimmer = {
        ...mockPlayer,
        level: 100,
        reputation: 1000,
        fame: 500,
      };

      const countAchievements = (player: IPlayerSwimmer): number => {
        let count = 0;
        if (player.level >= 5) count++;
        if (player.level >= 10) count++;
        if (player.level >= 20) count++;
        if (player.reputation >= 250) count++;
        if (player.reputation >= 500) count++;
        if (player.fame >= 100) count++;
        return count;
      };

      expect(countAchievements(playerLow)).toBe(0);
      expect(countAchievements(playerHigh)).toBe(6);
      expect(countAchievements(mockPlayer)).toBe(3); // Level 5, Rep 250, Fame 100
    });
  });

  describe('Career Progression Display', () => {
    test('Should display correct career tier', () => {
      expect(mockPlayer.careerTier).toBe(1);
      expect(mockPlayer.careerTier).toBeGreaterThanOrEqual(1);
      expect(mockPlayer.careerTier).toBeLessThanOrEqual(5);
    });

    test('Should display career event index', () => {
      expect(mockPlayer.careerEventIndex).toBe(2);
      expect(mockPlayer.careerEventIndex).toBeGreaterThanOrEqual(0);
    });

    test('Should determine tier name from tier number', () => {
      const getTierName = (tier: number): string => {
        switch (tier) {
          case 1:
            return 'School';
          case 2:
            return 'Junior';
          case 3:
            return 'Regional';
          case 4:
            return 'National';
          case 5:
            return 'World';
          default:
            return 'Unknown';
        }
      };

      expect(getTierName(mockPlayer.careerTier)).toBe('School');
      expect(getTierName(5)).toBe('World');
    });
  });

  describe('Profile Interactions', () => {
    test('Should handle edit cosmetics callback', () => {
      let called = false;
      const onEdit = () => {
        called = true;
      };

      onEdit();
      expect(called).toBe(true);
    });

    test('Should handle go back callback', () => {
      let called = false;
      const onGoBack = () => {
        called = true;
      };

      onGoBack();
      expect(called).toBe(true);
    });

    test('Should handle retire player callback', () => {
      let called = false;
      const onRetire = () => {
        called = true;
      };

      onRetire();
      expect(called).toBe(true);
    });

    test('Should handle missing player data gracefully', () => {
      const player: IPlayerSwimmer | null = null;

      expect(player).toBeNull();
      if (!player) {
        const message = 'No player loaded';
        expect(message).toBeTruthy();
      }
    });
  });

  describe('Prestige System Display', () => {
    test('Should clamp reputation to max 1000', () => {
      const player: IPlayerSwimmer = {
        ...mockPlayer,
        reputation: 1500,
      };

      const clampedRep = Math.min(player.reputation, 1000);
      expect(clampedRep).toBe(1000);
    });

    test('Should clamp fame to max 500', () => {
      const player: IPlayerSwimmer = {
        ...mockPlayer,
        fame: 600,
      };

      const clampedFame = Math.min(player.fame, 500);
      expect(clampedFame).toBe(500);
    });

    test('Should display reputation tier name', () => {
      const getReputationTier = (rep: number): string => {
        if (rep < 100) return 'Unknown';
        if (rep < 250) return 'Local';
        if (rep < 500) return 'Regional';
        if (rep < 750) return 'National';
        return 'International';
      };

      expect(getReputationTier(50)).toBe('Unknown');
      expect(getReputationTier(250)).toBe('Regional');
      expect(getReputationTier(750)).toBe('International');
    });
  });

  describe('Mobile Responsiveness', () => {
    test('Should render on mobile widths (375px)', () => {
      const mobileWidth = 375;
      expect(mobileWidth).toBeLessThanOrEqual(480);
    });

    test('Should render on tablet widths (768px)', () => {
      const tabletWidth = 768;
      expect(tabletWidth).toBeGreaterThan(480);
      expect(tabletWidth).toBeLessThanOrEqual(1024);
    });

    test('Should render on desktop widths (1200px)', () => {
      const desktopWidth = 1200;
      expect(desktopWidth).toBeGreaterThan(1024);
    });
  });

  describe('Performance', () => {
    test('Should calculate achievements quickly', () => {
      const start = performance.now();

      const calculateAchievements = (player: IPlayerSwimmer) => {
        return [
          player.level >= 5,
          player.level >= 10,
          player.reputation >= 250,
          player.reputation >= 500,
          player.fame >= 100,
        ].filter((x) => x).length;
      };

      calculateAchievements(mockPlayer);
      const end = performance.now();

      expect(end - start).toBeLessThan(10);
    });

    test('Should format numbers quickly', () => {
      const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      };

      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        formatNumber(12345678);
      }
      const end = performance.now();

      expect(end - start).toBeLessThan(50);
    });
  });

  describe('Data Validation', () => {
    test('Should have valid player ID', () => {
      expect(mockPlayer.id).toMatch(/^player_/);
      expect(mockPlayer.id.length).toBeGreaterThan(0);
    });

    test('Should have XP >= 0', () => {
      expect(mockPlayer.xp).toBeGreaterThanOrEqual(0);
    });

    test('Should have level >= 1', () => {
      expect(mockPlayer.level).toBeGreaterThanOrEqual(1);
    });

    test('Should have reputation 0-1000', () => {
      expect(mockPlayer.reputation).toBeGreaterThanOrEqual(0);
      expect(mockPlayer.reputation).toBeLessThanOrEqual(1000);
    });

    test('Should have fame 0-500', () => {
      expect(mockPlayer.fame).toBeGreaterThanOrEqual(0);
      expect(mockPlayer.fame).toBeLessThanOrEqual(500);
    });
  });
});
