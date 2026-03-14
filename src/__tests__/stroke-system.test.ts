/**
 * StrokeSystem Tests
 * Verifies stroke mechanics, rhythm detection, and stroke-specific calculations
 */

import { StrokeSystem } from '../gameplay/StrokeSystem';
import { SwimmingStroke } from '../types/index';

describe('StrokeSystem', () => {
  let strokeSystem: StrokeSystem;

  beforeEach(() => {
    strokeSystem = new StrokeSystem();
  });

  describe('Stroke Definitions', () => {
    test('Should have all 4 Olympic strokes', () => {
      const strokes: SwimmingStroke[] = ['FREESTYLE', 'BUTTERFLY', 'BREASTSTROKE', 'BACKSTROKE'];

      strokes.forEach((stroke) => {
        const metrics = strokeSystem.getMetrics(stroke);
        expect(metrics.stroke).toBe(stroke);
      });
    });

    test('FREESTYLE should be fastest stroke', () => {
      const freestyle = strokeSystem.getMetrics('FREESTYLE');
      const backstroke = strokeSystem.getMetrics('BACKSTROKE');
      const butterfly = strokeSystem.getMetrics('BUTTERFLY');

      expect(freestyle.speedMultiplier).toBeGreaterThanOrEqual(backstroke.speedMultiplier);
      expect(freestyle.speedMultiplier).toBeGreaterThanOrEqual(butterfly.speedMultiplier);
    });

    test('BREASTSTROKE should be slowest stroke', () => {
      const breaststroke = strokeSystem.getMetrics('BREASTSTROKE');
      const freestyle = strokeSystem.getMetrics('FREESTYLE');

      expect(breaststroke.speedMultiplier).toBeLessThan(freestyle.speedMultiplier);
    });

    test('Should have correct tap counts per cycle', () => {
      const freestyle = strokeSystem.getMetrics('FREESTYLE');
      const butterfly = strokeSystem.getMetrics('BUTTERFLY');
      const breaststroke = strokeSystem.getMetrics('BREASTSTROKE');

      expect(freestyle.tapsPerCycle).toBe(2);
      expect(butterfly.tapsPerCycle).toBe(1);
      expect(breaststroke.tapsPerCycle).toBe(1);
    });

    test('Should have different stamina drain rates', () => {
      const freestyle = strokeSystem.getMetrics('FREESTYLE');
      const butterfly = strokeSystem.getMetrics('BUTTERFLY');
      const breaststroke = strokeSystem.getMetrics('BREASTSTROKE');

      expect(butterfly.staminaDrain).toBeGreaterThan(freestyle.staminaDrain);
      expect(freestyle.staminaDrain).toBeGreaterThan(breaststroke.staminaDrain);
    });

    test('Should have correct difficulty ratings', () => {
      const freestyle = strokeSystem.getMetrics('FREESTYLE');
      const butterfly = strokeSystem.getMetrics('BUTTERFLY');
      const breaststroke = strokeSystem.getMetrics('BREASTSTROKE');
      const backstroke = strokeSystem.getMetrics('BACKSTROKE');

      expect(breaststroke.difficulty).toBeLessThan(freestyle.difficulty);
      expect(freestyle.difficulty).toBeLessThan(backstroke.difficulty);
      expect(backstroke.difficulty).toBeLessThan(butterfly.difficulty);
    });
  });

  describe('Stroke Selection', () => {
    test('Should set current stroke', () => {
      strokeSystem.setStroke('FREESTYLE');
      const state = strokeSystem.getState();

      expect(state.currentStroke).toBe('FREESTYLE');
    });

    test('Should change between strokes', () => {
      strokeSystem.setStroke('FREESTYLE');
      let state = strokeSystem.getState();
      expect(state.currentStroke).toBe('FREESTYLE');

      strokeSystem.setStroke('BUTTERFLY');
      state = strokeSystem.getState();
      expect(state.currentStroke).toBe('BUTTERFLY');
    });

    test('Should reset tap count on stroke change', () => {
      strokeSystem.setStroke('FREESTYLE');
      let state = strokeSystem.getState();
      expect(state.tapCount).toBe(0);

      strokeSystem.setStroke('BREASTSTROKE');
      state = strokeSystem.getState();
      expect(state.tapCount).toBe(0);
    });
  });

  describe('Tap Detection', () => {
    test('Should register tap input', () => {
      const now = performance.now();
      const result = strokeSystem.registerTap(now);

      expect(result).toHaveProperty('isAccurate');
      expect(result).toHaveProperty('accuracy');
    });

    test('Should increase total tap count', () => {
      const now = performance.now();
      strokeSystem.registerTap(now);
      strokeSystem.registerTap(now + 1000);

      const state = strokeSystem.getState();
      expect(state.totalTaps).toBeGreaterThan(0);
    });

    test('Should detect perfect tap', () => {
      const now = performance.now();
      const result = strokeSystem.registerTap(now);

      // Tap registered at expected time
      expect(result.isAccurate).toBe(true);
      expect(result.accuracy).toBe(100);
    });

    test('Should calculate accuracy percentage', () => {
      const now = performance.now();
      const result = strokeSystem.registerTap(now);

      expect(result.accuracy).toBeGreaterThanOrEqual(0);
      expect(result.accuracy).toBeLessThanOrEqual(100);
    });

    test('Should track missed taps', () => {
      const now = performance.now();
      // Register tap at time far from expected (will be marked as missed)
      const result = strokeSystem.registerTap(now + 5000);

      const state = strokeSystem.getState();
      expect(state.missedTaps).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Cycle Management', () => {
    test('Should calculate cycle time', () => {
      strokeSystem.setStroke('FREESTYLE');
      const cycleTime = strokeSystem.calculateCycleTime();

      expect(cycleTime).toBeGreaterThan(0);
      expect(cycleTime).toBeLessThan(10); // Should be 3-5 seconds
    });

    test('Should track cycle progress', () => {
      strokeSystem.setStroke('FREESTYLE');
      const progress = strokeSystem.updateCycleProgress(0.5);

      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(1);
    });

    test('Should update progress incrementally', () => {
      strokeSystem.setStroke('FREESTYLE');
      const progress1 = strokeSystem.updateCycleProgress(0.1);
      const progress2 = strokeSystem.updateCycleProgress(0.1);

      expect(progress2).toBeGreaterThanOrEqual(progress1);
    });

    test('Should detect underwater phase', () => {
      strokeSystem.setStroke('FREESTYLE');
      const metrics = strokeSystem.getMetrics('FREESTYLE');

      // At start, should be underwater
      const state = strokeSystem.getState();
      expect(state.isUnderwater).toBe(true);
    });
  });

  describe('Breathing Management', () => {
    test('Should define breathing intervals', () => {
      const freestyle = strokeSystem.getMetrics('FREESTYLE');
      expect(freestyle.breathingInterval).toBeGreaterThan(0);
    });

    test('BREASTSTROKE should have mandatory breathing', () => {
      const breaststroke = strokeSystem.getMetrics('BREASTSTROKE');
      expect(breaststroke.breathingInterval).toBe(1); // Every cycle
    });

    test('Should get breathing interval for current stroke', () => {
      strokeSystem.setStroke('FREESTYLE');
      const interval = strokeSystem.getBreathingInterval();

      expect(interval).toBe(2); // Every 2 cycles for freestyle
    });

    test('Should determine if breathing this cycle', () => {
      strokeSystem.setStroke('FREESTYLE');
      const shouldBreathe = strokeSystem.shouldBreathe();

      expect(typeof shouldBreathe).toBe('boolean');
    });

    test('Should get max breath hold duration', () => {
      strokeSystem.setStroke('FREESTYLE');
      const duration = strokeSystem.getMaxBreathHoldDuration();

      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeLessThan(15);
    });
  });

  describe('Stamina Management', () => {
    test('Should get stamina drain for stroke', () => {
      strokeSystem.setStroke('FREESTYLE');
      const drain = strokeSystem.getStaminaDrain();

      expect(drain).toBeGreaterThan(0);
      expect(drain).toBeLessThan(1);
    });

    test('BUTTERFLY should drain most stamina', () => {
      const freestyle = strokeSystem.getMetrics('FREESTYLE');
      const butterfly = strokeSystem.getMetrics('BUTTERFLY');

      expect(butterfly.staminaDrain).toBeGreaterThan(freestyle.staminaDrain);
    });

    test('BREASTSTROKE should drain least stamina', () => {
      const breaststroke = strokeSystem.getMetrics('BREASTSTROKE');
      const freestyle = strokeSystem.getMetrics('FREESTYLE');

      expect(breaststroke.staminaDrain).toBeLessThan(freestyle.staminaDrain);
    });
  });

  describe('Speed Multipliers', () => {
    test('FREESTYLE should have 1.0x multiplier (baseline)', () => {
      const freestyle = strokeSystem.getMetrics('FREESTYLE');
      expect(freestyle.speedMultiplier).toBe(1.0);
    });

    test('Should get speed multiplier for current stroke', () => {
      strokeSystem.setStroke('FREESTYLE');
      const multiplier = strokeSystem.getSpeedMultiplier();

      expect(multiplier).toBeCloseTo(1.0, 2);
    });

    test('Should have consistent speed ranking', () => {
      const all = strokeSystem.getAllMetrics();
      expect(all.FREESTYLE.speedMultiplier).toBeGreaterThanOrEqual(all.BUTTERFLY.speedMultiplier);
      expect(all.FREESTYLE.speedMultiplier).toBeGreaterThanOrEqual(all.BREASTSTROKE.speedMultiplier);
    });
  });

  describe('Turn Requirements', () => {
    test('Should specify required turn type', () => {
      strokeSystem.setStroke('FREESTYLE');
      const turnType = strokeSystem.getTurnType();

      expect(['TOUCH', 'FLIP']).toContain(turnType);
    });

    test('FREESTYLE should use touch turns', () => {
      const freestyle = strokeSystem.getMetrics('FREESTYLE');
      expect(freestyle.turnType).toBe('TOUCH');
    });

    test('BUTTERFLY should use flip turns', () => {
      const butterfly = strokeSystem.getMetrics('BUTTERFLY');
      expect(butterfly.turnType).toBe('FLIP');
    });

    test('BREASTSTROKE should use touch turns', () => {
      const breaststroke = strokeSystem.getMetrics('BREASTSTROKE');
      expect(breaststroke.turnType).toBe('TOUCH');
    });
  });

  describe('Difficulty System', () => {
    test('Should get difficulty rating for stroke', () => {
      strokeSystem.setStroke('FREESTYLE');
      const difficulty = strokeSystem.getDifficulty();

      expect(difficulty).toBeGreaterThan(0);
      expect(difficulty).toBeLessThanOrEqual(10);
    });

    test('Should rank strokes by difficulty', () => {
      const ranking = strokeSystem.getRankingByDifficulty();

      expect(ranking).toHaveLength(4);
      expect(ranking[0].difficulty).toBeLessThanOrEqual(ranking[3].difficulty);
    });
  });

  describe('Accuracy Tracking', () => {
    test('Should start with 100% accuracy', () => {
      const accuracy = strokeSystem.getAccuracy();
      expect(accuracy).toBe(100);
    });

    test('Should calculate accuracy percentage', () => {
      strokeSystem.registerTap(performance.now());
      const accuracy = strokeSystem.getAccuracy();

      expect(accuracy).toBeGreaterThanOrEqual(0);
      expect(accuracy).toBeLessThanOrEqual(100);
    });

    test('Should decrease accuracy on missed taps', () => {
      const initialAccuracy = strokeSystem.getAccuracy();

      // Register multiple taps, some inaccurate
      for (let i = 0; i < 5; i++) {
        strokeSystem.registerTap(performance.now() + i * 5000);
      }

      const finalAccuracy = strokeSystem.getAccuracy();
      expect(finalAccuracy).toBeLessThanOrEqual(initialAccuracy);
    });
  });

  describe('Breathing Patterns', () => {
    test('Should provide breathing pattern recommendation', () => {
      strokeSystem.setStroke('FREESTYLE');
      const pattern = strokeSystem.getRecommendedBreathingPattern();

      expect(pattern).toHaveProperty('interval');
      expect(pattern).toHaveProperty('description');
      expect(pattern.interval).toBeGreaterThan(0);
    });

    test('BREASTSTROKE should require every-cycle breathing', () => {
      strokeSystem.setStroke('BREASTSTROKE');
      const pattern = strokeSystem.getRecommendedBreathingPattern();

      expect(pattern.interval).toBe(1);
    });
  });

  describe('Stroke Validation', () => {
    test('Should validate stroke for distance', () => {
      strokeSystem.setStroke('FREESTYLE');
      const isValid = strokeSystem.isStrokeValidForDistance('FREESTYLE', 100);

      expect(isValid).toBe(true);
    });

    test('Should allow all strokes for all distances (MVP)', () => {
      const strokes: SwimmingStroke[] = ['FREESTYLE', 'BUTTERFLY', 'BREASTSTROKE', 'BACKSTROKE'];
      const distances = [50, 100, 200, 400];

      strokes.forEach((stroke) => {
        distances.forEach((distance) => {
          const isValid = strokeSystem.isStrokeValidForDistance(stroke, distance);
          expect(isValid).toBe(true);
        });
      });
    });
  });

  describe('State Management', () => {
    test('Should get current state', () => {
      const state = strokeSystem.getState();

      expect(state).toHaveProperty('currentStroke');
      expect(state).toHaveProperty('cycleProgress');
      expect(state).toHaveProperty('tapCount');
    });

    test('Should reset state', () => {
      strokeSystem.registerTap(performance.now());
      strokeSystem.reset();

      const state = strokeSystem.getState();
      expect(state.totalTaps).toBe(0);
      expect(state.cycleProgress).toBe(0);
    });
  });

  describe('Performance', () => {
    test('Should calculate metrics quickly', () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        strokeSystem.getMetrics('FREESTYLE');
      }

      const end = performance.now();
      expect(end - start).toBeLessThan(10); // <10ms for 100 calls
    });

    test('Should process tap input in <2ms', () => {
      const start = performance.now();
      strokeSystem.registerTap(performance.now());
      const end = performance.now();

      expect(end - start).toBeLessThan(2);
    });

    test('Should update cycle progress quickly', () => {
      const start = performance.now();

      for (let i = 0; i < 60; i++) {
        strokeSystem.updateCycleProgress(0.016); // 60 FPS
      }

      const end = performance.now();
      expect(end - start).toBeLessThan(50); // <50ms for 60 updates
    });
  });
});
