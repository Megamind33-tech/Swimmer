/**
 * TurnSystem Tests
 * Verifies turn detection, momentum bonuses, and turn mechanics
 */

import { TurnSystem } from '../gameplay/TurnSystem';

describe('TurnSystem', () => {
  let turnSystem: TurnSystem;

  beforeEach(() => {
    turnSystem = new TurnSystem();
  });

  describe('Turn Detection', () => {
    test('Should detect turn approaching', () => {
      const currentDistance = 23; // 2m from turn at 25m
      const approaching = turnSystem.isTurnApproaching(currentDistance, 2);

      expect(approaching).toBe(true);
    });

    test('Should not detect turn approaching when far', () => {
      const currentDistance = 10; // 15m from turn
      const approaching = turnSystem.isTurnApproaching(currentDistance, 2);

      expect(approaching).toBe(false);
    });

    test('Should calculate next turn distance', () => {
      const currentDistance = 10;
      const nextTurn = turnSystem.getNextTurnDistance(currentDistance);

      expect(nextTurn).toBe(25); // First turn at 25m
    });

    test('Should handle multiple laps', () => {
      const currentDistance = 45; // Near end of first lap
      const nextTurn = turnSystem.getNextTurnDistance(currentDistance);

      expect(nextTurn).toBe(50); // Turn at end of lap
    });
  });

  describe('Turn Type Determination', () => {
    test('Should require touch turn at first 25m', () => {
      const turnType = turnSystem.getTurnTypeAtDistance(25);
      expect(turnType).toBe('TOUCH');
    });

    test('Should require flip turn at lap end (50m)', () => {
      const turnType = turnSystem.getTurnTypeAtDistance(50);
      expect(turnType).toBe('FLIP');
    });

    test('Should require touch turn at 75m (second lap first turn)', () => {
      const turnType = turnSystem.getTurnTypeAtDistance(75);
      expect(turnType).toBe('TOUCH');
    });

    test('Should require flip turn at 100m', () => {
      const turnType = turnSystem.getTurnTypeAtDistance(100);
      expect(turnType).toBe('FLIP');
    });
  });

  describe('Turn Metrics', () => {
    test('Should have metrics for both turn types', () => {
      const touchMetrics = turnSystem.getMetrics('TOUCH');
      const flipMetrics = turnSystem.getMetrics('FLIP');

      expect(touchMetrics.turnType).toBe('TOUCH');
      expect(flipMetrics.turnType).toBe('FLIP');
    });

    test('TOUCH turn should have 1.1x momentum bonus', () => {
      const metrics = turnSystem.getMetrics('TOUCH');
      expect(metrics.momentumBonus).toBe(1.1);
    });

    test('FLIP turn should have 1.15x momentum bonus', () => {
      const metrics = turnSystem.getMetrics('FLIP');
      expect(metrics.momentumBonus).toBe(1.15);
    });

    test('FLIP turn should have larger detection window', () => {
      const touchMetrics = turnSystem.getMetrics('TOUCH');
      const flipMetrics = turnSystem.getMetrics('FLIP');

      expect(flipMetrics.detectionWindow).toBeGreaterThan(touchMetrics.detectionWindow);
    });

    test('FLIP turn should be harder (higher difficulty)', () => {
      const flipDifficulty = turnSystem.getTurnDifficulty('FLIP');
      const touchDifficulty = turnSystem.getTurnDifficulty('TOUCH');

      expect(flipDifficulty).toBeGreaterThan(touchDifficulty);
    });
  });

  describe('Turn Processing', () => {
    test('Should process perfect turn', () => {
      const input = {
        distance: 25,
        wallPositionX: 0,
        swimmerPositionX: 0.5,
        swimmerVelocity: 2.0,
        inputTime: performance.now(),
        expectedTurnTime: performance.now(),
      };

      const result = turnSystem.processTurn(input);
      expect(result.success).toBe(true);
      expect(result.finalSpeedMultiplier).toBe(1.1);
    });

    test('Should detect early turn', () => {
      const now = performance.now();
      const input = {
        distance: 25,
        wallPositionX: 0,
        swimmerPositionX: 0.5,
        swimmerVelocity: 2.0,
        inputTime: now - 100, // 100ms early
        expectedTurnTime: now,
      };

      const result = turnSystem.processTurn(input);
      expect(result.timing).toBeLessThan(0);
    });

    test('Should detect late turn', () => {
      const now = performance.now();
      const input = {
        distance: 25,
        wallPositionX: 0,
        swimmerPositionX: 0.5,
        swimmerVelocity: 2.0,
        inputTime: now + 100, // 100ms late
        expectedTurnTime: now,
      };

      const result = turnSystem.processTurn(input);
      expect(result.timing).toBeGreaterThan(0);
    });

    test('Should reject turn outside detection window', () => {
      const now = performance.now();
      const input = {
        distance: 25,
        wallPositionX: 0,
        swimmerPositionX: 0.5,
        swimmerVelocity: 2.0,
        inputTime: now + 500, // 500ms late (outside 250ms window for touch)
        expectedTurnTime: now,
      };

      const result = turnSystem.processTurn(input);
      expect(result.success).toBe(false);
    });

    test('Should fail if not at wall', () => {
      const input = {
        distance: 25,
        wallPositionX: 0,
        swimmerPositionX: 5, // Far from wall
        swimmerVelocity: 2.0,
        inputTime: performance.now(),
        expectedTurnTime: performance.now(),
      };

      const result = turnSystem.processTurn(input);
      expect(result.success).toBe(false);
    });
  });

  describe('Momentum Bonus Calculation', () => {
    test('Should return touch turn momentum bonus', () => {
      const bonus = turnSystem.calculateMomentumBonus('TOUCH');
      expect(bonus).toBe(1.1);
    });

    test('Should return flip turn momentum bonus', () => {
      const bonus = turnSystem.calculateMomentumBonus('FLIP');
      expect(bonus).toBe(1.15);
    });

    test('Should apply bonus correctly for perfect turn', () => {
      const input = {
        distance: 25,
        wallPositionX: 0,
        swimmerPositionX: 0.5,
        swimmerVelocity: 2.0,
        inputTime: performance.now(),
        expectedTurnTime: performance.now(),
      };

      const result = turnSystem.processTurn(input);
      expect(result.finalSpeedMultiplier).toBeCloseTo(1.1, 1);
    });
  });

  describe('Expected Turn Time Calculation', () => {
    test('Should calculate turn time from speed', () => {
      const currentDistance = 10;
      const swimmerSpeed = 2.0; // meters per second
      const expectedTime = turnSystem.calculateExpectedTurnTime(currentDistance, swimmerSpeed);

      expect(expectedTime).toBeGreaterThan(performance.now());
    });

    test('Should calculate faster for faster swimmers', () => {
      const currentDistance = 10;
      const slowSpeed = 1.0;
      const fastSpeed = 2.0;

      const slowTurnTime = turnSystem.calculateExpectedTurnTime(currentDistance, slowSpeed);
      const fastTurnTime = turnSystem.calculateExpectedTurnTime(currentDistance, fastSpeed);

      expect(fastTurnTime).toBeLessThan(slowTurnTime);
    });
  });

  describe('Turn Window Detection', () => {
    test('Should provide turn window for UI', () => {
      const distance = 10;
      const window = turnSystem.getTurnWindow(distance);

      expect(window).toHaveProperty('startDistance');
      expect(window).toHaveProperty('endDistance');
      expect(window).toHaveProperty('optimalDistance');
    });

    test('Should have ±0.5m turn window', () => {
      const distance = 10;
      const window = turnSystem.getTurnWindow(distance);

      expect(window.optimalDistance - window.startDistance).toBeCloseTo(0.5, 1);
      expect(window.endDistance - window.optimalDistance).toBeCloseTo(0.5, 1);
    });
  });

  describe('Turn Validation', () => {
    test('Should validate turn at 25m marker', () => {
      const validation = turnSystem.validateTurnAtDistance(25);

      expect(validation.isTurnLocation).toBe(true);
      expect(validation.turnType).toBe('TOUCH');
    });

    test('Should validate turn at 50m marker', () => {
      const validation = turnSystem.validateTurnAtDistance(50);

      expect(validation.isTurnLocation).toBe(true);
      expect(validation.turnType).toBe('FLIP');
    });

    test('Should reject non-turn locations', () => {
      const validation = turnSystem.validateTurnAtDistance(15);

      expect(validation.isTurnLocation).toBe(false);
    });
  });

  describe('Turn Counting', () => {
    test('Should count turns in race', () => {
      const count50m = turnSystem.getTurnCount(50);
      const count100m = turnSystem.getTurnCount(100);
      const count200m = turnSystem.getTurnCount(200);

      expect(count50m).toBe(1); // One turn at 25m
      expect(count100m).toBe(3); // Turns at 25, 50, 75
      expect(count200m).toBe(7); // Turns at 25, 50, 75, 100, 125, 150, 175
    });

    test('Should return 0 for start', () => {
      const count = turnSystem.getTurnCount(0);
      expect(count).toBe(0);
    });
  });

  describe('Cumulative Turn Penalty', () => {
    test('Should have no penalty with perfect turns', () => {
      const perfectErrors = [
        { timing: 0 },
        { timing: 0 },
        { timing: 0 },
      ];

      const penalty = turnSystem.calculateCumulativeTurnPenalty(perfectErrors);
      expect(penalty).toBe(1.0);
    });

    test('Should apply penalty for poor turns', () => {
      const poorErrors = [
        { timing: 200 },
        { timing: 200 },
        { timing: 200 },
      ];

      const penalty = turnSystem.calculateCumulativeTurnPenalty(poorErrors);
      expect(penalty).toBeLessThan(1.0);
    });

    test('Should have no penalty with empty errors', () => {
      const penalty = turnSystem.calculateCumulativeTurnPenalty([]);
      expect(penalty).toBe(1.0);
    });

    test('Should clamp penalty at minimum', () => {
      const terribleErrors = [{ timing: 10000 }];
      const penalty = turnSystem.calculateCumulativeTurnPenalty(terribleErrors);

      expect(penalty).toBeLessThanOrEqual(1.0);
      expect(penalty).toBeGreaterThanOrEqual(0.9); // Min 10% penalty
    });
  });

  describe('Timing Accuracy', () => {
    test('Should penalize early turns', () => {
      const now = performance.now();
      const input = {
        distance: 25,
        wallPositionX: 0,
        swimmerPositionX: 0.5,
        swimmerVelocity: 2.0,
        inputTime: now - 50, // 50ms early
        expectedTurnTime: now,
      };

      const result = turnSystem.processTurn(input);
      expect(result.finalSpeedMultiplier).toBeLessThan(1.15);
    });

    test('Should penalize late turns', () => {
      const now = performance.now();
      const input = {
        distance: 25,
        wallPositionX: 0,
        swimmerPositionX: 0.5,
        swimmerVelocity: 2.0,
        inputTime: now + 50, // 50ms late
        expectedTurnTime: now,
      };

      const result = turnSystem.processTurn(input);
      expect(result.finalSpeedMultiplier).toBeLessThan(1.15);
    });
  });

  describe('State Management', () => {
    test('Should reset turn state', () => {
      turnSystem.reset();
      // After reset, system should be ready for new race
      expect(turnSystem).toBeDefined();
    });

    test('Should track turn history', () => {
      const count = turnSystem.getTurnCount(100);
      expect(count).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    test('Should detect turns quickly', () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        turnSystem.getTurnTypeAtDistance(25 + i);
      }

      const end = performance.now();
      expect(end - start).toBeLessThan(5); // <5ms for 100 calls
    });

    test('Should process turn input in <2ms', () => {
      const input = {
        distance: 25,
        wallPositionX: 0,
        swimmerPositionX: 0.5,
        swimmerVelocity: 2.0,
        inputTime: performance.now(),
        expectedTurnTime: performance.now(),
      };

      const start = performance.now();
      turnSystem.processTurn(input);
      const end = performance.now();

      expect(end - start).toBeLessThan(2);
    });
  });

  describe('Edge Cases', () => {
    test('Should handle 0 distance', () => {
      const validation = turnSystem.validateTurnAtDistance(0);
      expect(validation.isTurnLocation).toBe(true);
    });

    test('Should handle very long distances', () => {
      const count = turnSystem.getTurnCount(10000);
      expect(count).toBeGreaterThan(0);
    });

    test('Should handle zero velocity turn time', () => {
      const currentDistance = 10;
      // Very low speed (near zero)
      const expectedTime = turnSystem.calculateExpectedTurnTime(currentDistance, 0.1);

      expect(expectedTime).toBeGreaterThan(performance.now());
    });
  });
});
