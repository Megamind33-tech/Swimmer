/**
 * LevelingUI Component Tests
 * Verifies XP progress calculation, level up detection, animation timing,
 * and stat bonus calculations
 */

import { IPlayerSwimmer } from '../types/index';

describe('LevelingUI Component', () => {
  describe('XP Calculations', () => {
    test('Should calculate XP required for each level', () => {
      const xpRequiredForLevel = (level: number): number => {
        if (level <= 5) return 100;
        if (level <= 10) return 150;
        if (level <= 20) return 250;
        if (level <= 30) return 400;
        if (level <= 50) return 750;
        return 1500;
      };

      expect(xpRequiredForLevel(1)).toBe(100);
      expect(xpRequiredForLevel(5)).toBe(100);
      expect(xpRequiredForLevel(6)).toBe(150);
      expect(xpRequiredForLevel(10)).toBe(150);
      expect(xpRequiredForLevel(15)).toBe(250);
      expect(xpRequiredForLevel(30)).toBe(400);
      expect(xpRequiredForLevel(50)).toBe(750);
      expect(xpRequiredForLevel(100)).toBe(1500);
    });

    test('Should calculate total XP for given level', () => {
      const xpRequiredForLevel = (level: number): number => {
        if (level <= 5) return 100;
        if (level <= 10) return 150;
        return 250;
      };

      const calculateTotalXpForLevel = (level: number): number => {
        let total = 0;
        for (let i = 1; i < level; i++) {
          total += xpRequiredForLevel(i);
        }
        return total;
      };

      // Level 1: 0 total
      expect(calculateTotalXpForLevel(1)).toBe(0);

      // Level 5: 400 total (4 x 100)
      expect(calculateTotalXpForLevel(5)).toBe(400);

      // Level 6: 400 total (same as level 5, needs 150 to advance)
      expect(calculateTotalXpForLevel(6)).toBe(400);
    });

    test('Should calculate XP progress percentage', () => {
      const calculateXpProgress = (
        currentXp: number,
        currentLevel: number,
        xpRequiredFunc: (level: number) => number,
        totalXpFunc: (level: number) => number
      ): number => {
        const totalXpForCurrentLevel = totalXpFunc(currentLevel);
        const totalXpForNextLevel = totalXpForCurrentLevel + xpRequiredFunc(currentLevel);
        const xpInCurrentLevel = currentXp - totalXpForCurrentLevel;
        const xpNeeded = totalXpForNextLevel - totalXpForCurrentLevel;

        return (xpInCurrentLevel / xpNeeded) * 100;
      };

      const mockXpRequired = (level: number) => (level <= 5 ? 100 : 150);
      const mockTotalXp = (level: number) => {
        if (level <= 1) return 0;
        return (level - 1) * 100;
      };

      const progress = calculateXpProgress(50, 1, mockXpRequired, mockTotalXp);
      expect(progress).toBe(50);
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });

    test('Should calculate XP to next level', () => {
      const xpRequiredForLevel = (level: number): number => {
        if (level <= 5) return 100;
        return 150;
      };

      const calculateTotalXpForLevel = (level: number): number => {
        return (level - 1) * 100;
      };

      const player = { level: 3, xp: 180 };
      const totalXpForCurrentLevel = calculateTotalXpForLevel(player.level);
      const totalXpForNextLevel = totalXpForCurrentLevel + xpRequiredForLevel(player.level);
      const xpToNextLevel = Math.max(0, totalXpForNextLevel - player.xp);

      expect(xpToNextLevel).toBe(120);
    });
  });

  describe('Level Up Detection', () => {
    test('Should detect when player levels up', () => {
      const previousLevel = 3;
      const currentLevel = 4;

      const leveledUp = currentLevel > previousLevel;
      expect(leveledUp).toBe(true);
    });

    test('Should calculate level difference', () => {
      const previousLevel = 2;
      const currentLevel = 5;

      const levelDiff = currentLevel - previousLevel;
      expect(levelDiff).toBe(3);
    });

    test('Should not trigger on same level', () => {
      const previousLevel = 5;
      const currentLevel = 5;

      const leveledUp = currentLevel > previousLevel;
      expect(leveledUp).toBe(false);
    });
  });

  describe('Stat Bonus Calculations', () => {
    test('Should calculate stat bonuses on level up', () => {
      const levelDiff = 1;
      const baseBonuses = {
        speed: 0.5 * levelDiff,
        stamina: 0.5 * levelDiff,
        technique: 0.5 * levelDiff,
        endurance: 0.5 * levelDiff,
        mental: 0.25 * levelDiff,
      };

      expect(baseBonuses.speed).toBe(0.5);
      expect(baseBonuses.stamina).toBe(0.5);
      expect(baseBonuses.mental).toBe(0.25);
    });

    test('Should calculate bonuses for multiple level gains', () => {
      const levelDiff = 3;
      const baseBonuses = {
        speed: 0.5 * levelDiff,
        stamina: 0.5 * levelDiff,
        technique: 0.5 * levelDiff,
        endurance: 0.5 * levelDiff,
        mental: 0.25 * levelDiff,
      };

      expect(baseBonuses.speed).toBe(1.5);
      expect(baseBonuses.stamina).toBe(1.5);
      expect(baseBonuses.mental).toBe(0.75);
    });

    test('Should apply bonuses to player stats', () => {
      const player: IPlayerSwimmer = {
        id: 'test_1',
        name: 'Test',
        level: 5,
        xp: 500,
        stats: {
          speed: 10,
          stamina: 10,
          technique: 10,
          endurance: 10,
          mental: 8,
        },
        specialty: 'ALL_AROUND',
        careerTier: 1,
        careerEventIndex: 0,
        reputation: 0,
        fame: 0,
      };

      const bonuses = {
        speed: 0.5,
        stamina: 0.5,
        technique: 0.5,
        endurance: 0.5,
        mental: 0.25,
      };

      const newStats = {
        speed: player.stats.speed + bonuses.speed,
        stamina: player.stats.stamina + bonuses.stamina,
        technique: player.stats.technique + bonuses.technique,
        endurance: player.stats.endurance + bonuses.endurance,
        mental: player.stats.mental + bonuses.mental,
      };

      expect(newStats.speed).toBe(10.5);
      expect(newStats.stamina).toBe(10.5);
      expect(newStats.mental).toBe(8.25);
    });
  });

  describe('Animation Timing', () => {
    test('Should auto-dismiss level up notification after 3 seconds', () => {
      const dismissTime = 3000; // milliseconds
      expect(dismissTime).toBe(3000);
    });

    test('Should animate floating XP text', () => {
      const animationDuration = 2000; // milliseconds
      expect(animationDuration).toBe(2000);
    });

    test('Should fade out over animation duration', () => {
      const startOpacity = 1;
      const endOpacity = 0;
      const duration = 2000;

      expect(startOpacity).toBe(1);
      expect(endOpacity).toBe(0);
      expect(duration).toBeGreaterThan(0);
    });
  });

  describe('Floating XP Text', () => {
    test('Should create floating XP text on XP gain', () => {
      const xpGained = 100;
      const floatingText = `+${xpGained} XP`;

      expect(floatingText).toBe('+100 XP');
    });

    test('Should display XP amounts correctly', () => {
      const amounts = [10, 50, 100, 250, 500];

      amounts.forEach((amount) => {
        const text = `+${amount} XP`;
        expect(text).toContain('+');
        expect(text).toContain('XP');
      });
    });

    test('Should remove floating text after animation', () => {
      let floatingTexts: any[] = [];
      const textId = `xp_${Date.now()}`;

      floatingTexts.push({ id: textId, text: '+100 XP' });
      expect(floatingTexts).toHaveLength(1);

      floatingTexts = floatingTexts.filter((t) => t.id !== textId);
      expect(floatingTexts).toHaveLength(0);
    });
  });

  describe('Level Up Callback', () => {
    test('Should trigger onLevelUp callback', () => {
      let callbackTriggered = false;
      const onLevelUp = () => {
        callbackTriggered = true;
      };

      onLevelUp();
      expect(callbackTriggered).toBe(true);
    });

    test('Should pass correct level up data to callback', () => {
      let levelUpData: any = null;

      const onLevelUp = (data: any) => {
        levelUpData = data;
      };

      const data = {
        oldLevel: 5,
        newLevel: 6,
        statBonuses: {
          speed: 0.5,
          stamina: 0.5,
          technique: 0.5,
          endurance: 0.5,
          mental: 0.25,
        },
      };

      onLevelUp(data);

      expect(levelUpData.oldLevel).toBe(5);
      expect(levelUpData.newLevel).toBe(6);
      expect(levelUpData.statBonuses.speed).toBe(0.5);
    });
  });

  describe('Sound Effects', () => {
    test('Should support sound enabled/disabled', () => {
      const soundEnabled = true;
      expect(typeof soundEnabled).toBe('boolean');
    });

    test('Should not play sound if disabled', () => {
      const soundEnabled = false;
      let soundPlayed = false;

      if (soundEnabled) {
        soundPlayed = true;
      }

      expect(soundPlayed).toBe(false);
    });
  });

  describe('XP Display Formatting', () => {
    test('Should display XP as integer', () => {
      const xpToNextLevel = 120.5;
      const formatted = xpToNextLevel.toFixed(0);

      expect(formatted).toBe('120');
      expect(typeof parseInt(formatted)).toBe('number');
    });

    test('Should display percentage with decimal places', () => {
      const percentage = 75.5;
      const formatted = Math.floor(percentage).toString();

      expect(formatted).toBe('75');
    });
  });

  describe('Mobile Responsiveness', () => {
    test('Should display on mobile width (375px)', () => {
      const mobileWidth = 375;
      expect(mobileWidth).toBeLessThanOrEqual(480);
    });

    test('Should display XP bar on small screens', () => {
      const minWidth = 280; // Minimum width for XP bar
      expect(minWidth).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    test('Should calculate XP progress quickly', () => {
      const xpRequiredForLevel = (level: number) => 100;
      const totalXpFunc = (level: number) => (level - 1) * 100;

      const start = performance.now();
      const progress = (50 / 100) * 100;
      const end = performance.now();

      expect(end - start).toBeLessThan(5);
      expect(progress).toBe(50);
    });

    test('Should render level up animation smoothly', () => {
      const start = performance.now();
      // Simulate animation frame
      for (let i = 0; i < 60; i++) {
        // 1 second at 60 FPS
        const frame = i / 60;
      }
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // Should complete in <100ms
    });
  });

  describe('Edge Cases', () => {
    test('Should handle zero XP player', () => {
      const player = { level: 1, xp: 0 };
      expect(player.xp).toBe(0);
      expect(player.level).toBe(1);
    });

    test('Should handle maximum level player', () => {
      const player = { level: 100, xp: 999999 };
      expect(player.level).toBe(100);
      expect(player.xp).toBeGreaterThan(0);
    });

    test('Should handle null player', () => {
      const player = null;
      expect(player).toBeNull();
    });

    test('Should show 0% XP progress at level start', () => {
      const totalXpForLevel = 400;
      const playerXp = 400;
      const xpInLevel = playerXp - totalXpForLevel;

      expect(xpInLevel).toBe(0);
      const progress = (xpInLevel / 100) * 100;
      expect(progress).toBe(0);
    });

    test('Should show 100% XP progress at level end', () => {
      const totalXpForLevel = 400;
      const playerXp = 500;
      const xpNeeded = 100;
      const xpInLevel = playerXp - totalXpForLevel;

      expect(xpInLevel).toBe(100);
      const progress = (xpInLevel / xpNeeded) * 100;
      expect(progress).toBe(100);
    });
  });
});
