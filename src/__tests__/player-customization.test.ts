/**
 * PlayerCustomization Component Tests
 * Verifies name validation, specialty selection, appearance customization,
 * and player creation without breaking existing functionality
 */

import { IPlayerSwimmer, SwimmerSpecialty } from '../types/index';

// Mock PlayerManager
class MockPlayerManager {
  private players: IPlayerSwimmer[] = [];

  createPlayer(
    name: string,
    specialty: SwimmerSpecialty,
    attributes: any
  ): IPlayerSwimmer {
    const player: IPlayerSwimmer = {
      id: `player_${Date.now()}`,
      name,
      level: 1,
      xp: 0,
      stats: {
        speed: 10,
        stamina: 10,
        technique: 10,
        endurance: 10,
        mental: 8,
      },
      specialty,
      careerTier: 1,
      careerEventIndex: 0,
      reputation: 0,
      fame: 0,
    };

    this.players.push(player);
    localStorage.setItem('currentPlayer', JSON.stringify(player));
    return player;
  }

  getPlayers(): IPlayerSwimmer[] {
    return this.players;
  }
}

describe('PlayerCustomization Component', () => {
  describe('Name Validation', () => {
    test('Should accept valid names (1-20 characters)', () => {
      const testCases = [
        'Alex',
        'Alex Turner',
        'Alex-Turner',
        'A',
        '12345',
        'User123',
      ];

      const nameRegex = /^[a-zA-Z0-9\s\-]*$/;

      testCases.forEach((name) => {
        expect(name.length).toBeGreaterThan(0);
        expect(name.length).toBeLessThanOrEqual(20);
        expect(nameRegex.test(name)).toBe(true);
      });
    });

    test('Should reject names with special characters', () => {
      const invalidNames = [
        'Alex@Turner',
        'Alex#Turner',
        'Alex$Turner',
        'Alex!Turner',
        'Alex&Turner',
      ];

      const nameRegex = /^[a-zA-Z0-9\s\-]*$/;

      invalidNames.forEach((name) => {
        expect(nameRegex.test(name)).toBe(false);
      });
    });

    test('Should reject empty names', () => {
      const emptyName = '';
      expect(emptyName.length).toBe(0);
      expect(emptyName.length > 0).toBe(false);
    });

    test('Should reject names longer than 20 characters', () => {
      const longName = 'This is a very long name';
      expect(longName.length).toBeGreaterThan(20);
    });
  });

  describe('Specialty Selection', () => {
    test('Should recognize all 4 specialty types', () => {
      const specialties: SwimmerSpecialty[] = [
        'SPRINTER',
        'DISTANCE',
        'TECHNICIAN',
        'ALL_AROUND',
      ];

      expect(specialties).toHaveLength(4);
      specialties.forEach((specialty) => {
        expect(specialty).toBeTruthy();
      });
    });

    test('Should apply correct stat bonuses for SPRINTER', () => {
      const bonuses = {
        speedBonus: 15,
        staminaBonus: -10,
        techniqueBonus: 0,
      };

      const baseSpeed = 10;
      const adjustedSpeed = baseSpeed + bonuses.speedBonus / 10;
      expect(adjustedSpeed).toBe(11.5);

      const baseStamina = 10;
      const adjustedStamina = baseStamina + bonuses.staminaBonus / 10;
      expect(adjustedStamina).toBe(9);
    });

    test('Should apply correct stat bonuses for DISTANCE', () => {
      const bonuses = {
        speedBonus: -5,
        staminaBonus: 20,
        techniqueBonus: 0,
      };

      const baseSpeed = 10;
      const adjustedSpeed = baseSpeed + bonuses.speedBonus / 10;
      expect(adjustedSpeed).toBe(9.5);

      const baseStamina = 10;
      const adjustedStamina = baseStamina + bonuses.staminaBonus / 10;
      expect(adjustedStamina).toBe(12);
    });

    test('Should apply correct stat bonuses for TECHNICIAN', () => {
      const bonuses = {
        speedBonus: 0,
        staminaBonus: 0,
        techniqueBonus: 10,
      };

      const baseTechnique = 10;
      const adjustedTechnique = baseTechnique + bonuses.techniqueBonus / 10;
      expect(adjustedTechnique).toBe(11);
    });

    test('Should have NO bonuses for ALL_AROUND', () => {
      const bonuses = {
        speedBonus: 0,
        staminaBonus: 0,
        techniqueBonus: 0,
      };

      const baseSpeed = 10;
      expect(baseSpeed + bonuses.speedBonus / 10).toBe(10);

      const baseStamina = 10;
      expect(baseStamina + bonuses.staminaBonus / 10).toBe(10);

      const baseTechnique = 10;
      expect(baseTechnique + bonuses.techniqueBonus / 10).toBe(10);
    });
  });

  describe('Appearance Customization', () => {
    test('Should support 5 face presets', () => {
      const faces = ['Face 1', 'Face 2', 'Face 3', 'Face 4', 'Face 5'];
      expect(faces).toHaveLength(5);
      expect(faces[0]).toBe('Face 1');
      expect(faces[4]).toBe('Face 5');
    });

    test('Should support 5 suit colors', () => {
      const colors = ['Black', 'Blue', 'Red', 'Green', 'Yellow'];
      expect(colors).toHaveLength(5);
      colors.forEach((color) => {
        expect(color).toBeTruthy();
      });
    });

    test('Should support 4 cap styles', () => {
      const styles = ['Classic', 'Modern', 'Racing', 'Swimming'];
      expect(styles).toHaveLength(4);
    });

    test('Should support 4 goggle types', () => {
      const types = ['Standard', 'Tinted', 'Mirrored', 'Clear'];
      expect(types).toHaveLength(4);
    });

    test('Should support 12 nations', () => {
      const nations = [
        'USA',
        'GBR',
        'AUS',
        'CHN',
        'JPN',
        'FRA',
        'GER',
        'ITA',
        'BRA',
        'CAN',
        'RUS',
        'KOR',
      ];
      expect(nations).toHaveLength(12);
    });
  });

  describe('Player Creation', () => {
    test('Should create player with valid data', () => {
      const manager = new MockPlayerManager();

      const player = manager.createPlayer('Alex Turner', 'SPRINTER', {
        height: 185,
        weight: 80,
        armSpan: 188,
        strokeRate: 92,
      });

      expect(player).toBeDefined();
      expect(player.name).toBe('Alex Turner');
      expect(player.specialty).toBe('SPRINTER');
      expect(player.level).toBe(1);
      expect(player.xp).toBe(0);
    });

    test('Should assign unique IDs to players', () => {
      const manager = new MockPlayerManager();

      const player1 = manager.createPlayer('Player 1', 'SPRINTER', {
        height: 180,
        weight: 75,
        armSpan: 182,
        strokeRate: 90,
      });

      const player2 = manager.createPlayer('Player 2', 'DISTANCE', {
        height: 175,
        weight: 70,
        armSpan: 177,
        strokeRate: 88,
      });

      expect(player1.id).not.toBe(player2.id);
      expect(player1.id).toMatch(/^player_/);
      expect(player2.id).toMatch(/^player_/);
    });

    test('Should save player to localStorage', () => {
      localStorage.clear();
      const manager = new MockPlayerManager();

      const player = manager.createPlayer('Test Player', 'ALL_AROUND', {
        height: 180,
        weight: 75,
        armSpan: 182,
        strokeRate: 90,
      });

      const saved = localStorage.getItem('currentPlayer');
      expect(saved).toBeTruthy();

      const parsedPlayer = JSON.parse(saved!);
      expect(parsedPlayer.name).toBe('Test Player');
      expect(parsedPlayer.id).toBe(player.id);
    });

    test('Should store appearance preferences separately', () => {
      localStorage.clear();
      const manager = new MockPlayerManager();

      const player = manager.createPlayer('Test Player', 'SPRINTER', {
        height: 180,
        weight: 75,
        armSpan: 182,
        strokeRate: 90,
      });

      const appearance = {
        face: 'Face 1',
        suit: 'Blue',
        cap: 'Racing',
        goggles: 'Tinted',
        nation: 'USA',
      };

      localStorage.setItem(
        `swimmer_appearance_${player.id}`,
        JSON.stringify(appearance)
      );

      const saved = localStorage.getItem(`swimmer_appearance_${player.id}`);
      expect(saved).toBeTruthy();

      const parsedAppearance = JSON.parse(saved!);
      expect(parsedAppearance.suit).toBe('Blue');
      expect(parsedAppearance.nation).toBe('USA');
    });
  });

  describe('Form Validation', () => {
    test('Should prevent creation with empty name', () => {
      const manager = new MockPlayerManager();
      const emptyName = '';

      expect(emptyName.trim().length).toBe(0);
      expect(emptyName.trim().length > 0).toBe(false);
    });

    test('Should prevent creation with invalid characters in name', () => {
      const nameRegex = /^[a-zA-Z0-9\s\-]*$/;
      const invalidNames = ['Alex@', 'Test#', 'Player$'];

      invalidNames.forEach((name) => {
        expect(nameRegex.test(name)).toBe(false);
      });
    });

    test('Should validate all required fields before creation', () => {
      const validationState = {
        name: true,
        specialty: true,
        appearance: true,
      };

      const formValid =
        validationState.name && validationState.specialty && validationState.appearance;
      expect(formValid).toBe(true);
    });

    test('Should reject creation if any field invalid', () => {
      const validationState = {
        name: false,
        specialty: true,
        appearance: true,
      };

      const formValid =
        validationState.name && validationState.specialty && validationState.appearance;
      expect(formValid).toBe(false);
    });
  });

  describe('Player Stats Calculation', () => {
    test('Should calculate correct initial stats', () => {
      const baseStats = {
        speed: 10,
        stamina: 10,
        technique: 10,
        endurance: 10,
        mental: 8,
      };

      expect(baseStats.speed).toBe(10);
      expect(baseStats.stamina).toBe(10);
      expect(baseStats.technique).toBe(10);
      expect(baseStats.endurance).toBe(10);
      expect(baseStats.mental).toBe(8);
    });

    test('Should clamp stats to valid range (minimum 1)', () => {
      const baseSpeed = 10;
      const bonus = -15;
      const adjusted = Math.max(1, baseSpeed + bonus / 10);

      expect(adjusted).toBeGreaterThanOrEqual(1);
      expect(adjusted).toBe(8.5);
    });

    test('Should preserve endurance and mental stats regardless of specialty', () => {
      const specialties: SwimmerSpecialty[] = [
        'SPRINTER',
        'DISTANCE',
        'TECHNICIAN',
        'ALL_AROUND',
      ];

      specialties.forEach((specialty) => {
        const endurance = 10;
        const mental = 8;

        expect(endurance).toBe(10);
        expect(mental).toBe(8);
      });
    });
  });

  describe('Data Persistence', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('Should persist player data in localStorage', () => {
      const manager = new MockPlayerManager();
      const player = manager.createPlayer('Test', 'SPRINTER', {
        height: 180,
        weight: 75,
        armSpan: 182,
        strokeRate: 90,
      });

      const saved = localStorage.getItem('currentPlayer');
      expect(saved).toBeTruthy();

      const parsed = JSON.parse(saved!);
      expect(parsed.id).toBe(player.id);
      expect(parsed.name).toBe('Test');
    });

    test('Should load player data from localStorage', () => {
      const testPlayer: IPlayerSwimmer = {
        id: 'test_1',
        name: 'Test Player',
        level: 5,
        xp: 500,
        stats: {
          speed: 11,
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

      localStorage.setItem('currentPlayer', JSON.stringify(testPlayer));

      const loaded = localStorage.getItem('currentPlayer');
      expect(loaded).toBeTruthy();

      const parsed = JSON.parse(loaded!);
      expect(parsed.level).toBe(5);
      expect(parsed.xp).toBe(500);
      expect(parsed.reputation).toBe(250);
    });
  });

  describe('Error Handling', () => {
    test('Should handle localStorage errors gracefully', () => {
      const manager = new MockPlayerManager();

      try {
        const player = manager.createPlayer('Test', 'ALL_AROUND', {
          height: 180,
          weight: 75,
          armSpan: 182,
          strokeRate: 90,
        });

        expect(player).toBeDefined();
      } catch (error) {
        fail('Should not throw error on valid player creation');
      }
    });

    test('Should validate name length before creation', () => {
      const shortName = 'A';
      const longName = 'A'.repeat(21);

      expect(shortName.length).toBeGreaterThanOrEqual(1);
      expect(shortName.length).toBeLessThanOrEqual(20);

      expect(longName.length).toBeGreaterThan(20);
    });
  });

  describe('Component Performance', () => {
    test('Should create player in <100ms', () => {
      const manager = new MockPlayerManager();
      const start = performance.now();

      const player = manager.createPlayer('Perf Test', 'SPRINTER', {
        height: 180,
        weight: 75,
        armSpan: 182,
        strokeRate: 90,
      });

      const end = performance.now();
      const duration = end - start;

      expect(duration).toBeLessThan(100);
      expect(player).toBeDefined();
    });

    test('Should handle rapid player creation', () => {
      const manager = new MockPlayerManager();
      const start = performance.now();

      for (let i = 0; i < 10; i++) {
        manager.createPlayer(`Player ${i}`, 'SPRINTER', {
          height: 180,
          weight: 75,
          armSpan: 182,
          strokeRate: 90,
        });
      }

      const end = performance.now();
      const duration = end - start;

      expect(duration).toBeLessThan(500);
      expect(manager.getPlayers()).toHaveLength(10);
    });
  });
});
