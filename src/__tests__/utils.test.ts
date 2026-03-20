/**
 * Unit tests for utility functions
 */

import { randomBetween, randomInt, weightedRandom } from '../utils/index';

describe('Utility Functions', () => {
  describe('randomBetween', () => {
    const originalRandom = Math.random;

    afterEach(() => {
      Math.random = originalRandom;
    });

    it('should return the min value when Math.random() is 0', () => {
      Math.random = () => 0;
      expect(randomBetween(10, 20)).toBe(10);
    });

    it('should return the max value when Math.random() is 0.999999', () => {
      Math.random = () => 0.999999;
      expect(randomBetween(10, 20)).toBeCloseTo(19.99999, 5);
    });

    it('should return a value within the range', () => {
      const result = randomBetween(5, 10);
      expect(result).toBeGreaterThanOrEqual(5);
      expect(result).toBeLessThan(10);
    });

    it('should handle negative ranges', () => {
      Math.random = () => 0.5;
      expect(randomBetween(-10, -5)).toBe(-7.5);
    });
  });

  describe('randomInt', () => {
    const originalRandom = Math.random;

    afterEach(() => {
      Math.random = originalRandom;
    });

    it('should return the min value when Math.random() is 0', () => {
      Math.random = () => 0;
      expect(randomInt(1, 10)).toBe(1);
    });

    it('should return the max value when Math.random() is 0.999999', () => {
      // randomInt(min, max) calls randomBetween(min, max + 1)
      // Math.floor(0.999999 * (11 - 1) + 1) = Math.floor(9.99999 + 1) = Math.floor(10.99999) = 10
      Math.random = () => 0.999999;
      expect(randomInt(1, 10)).toBe(10);
    });

    it('should return an integer', () => {
      const result = randomInt(1, 100);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should handle single-value range', () => {
      expect(randomInt(5, 5)).toBe(5);
    });

    it('should handle negative ranges', () => {
      Math.random = () => 0.5;
      // randomInt(-10, -5) calls randomBetween(-10, -4)
      // Math.floor(0.5 * (-4 - (-10)) + (-10)) = Math.floor(0.5 * 6 - 10) = Math.floor(3 - 10) = -7
      expect(randomInt(-10, -5)).toBe(-7);
    });
  });

  describe('weightedRandom', () => {
    const items = [
      { item: 'A', weight: 1 },
      { item: 'B', weight: 3 },
      { item: 'C', weight: 6 },
    ];
    // Total weight = 10

    const originalRandom = Math.random;

    afterEach(() => {
      Math.random = originalRandom;
    });

    it('should select the first item when random is low', () => {
      Math.random = () => 0.05; // 0.05 * 10 = 0.5 (within first weight 1)
      expect(weightedRandom(items)).toBe('A');
    });

    it('should select the second item when random is in the middle', () => {
      Math.random = () => 0.25; // 0.25 * 10 = 2.5 (1 < 2.5 <= 1+3)
      expect(weightedRandom(items)).toBe('B');
    });

    it('should select the last item when random is high', () => {
      Math.random = () => 0.9; // 0.9 * 10 = 9.0 (4 < 9.0 <= 10)
      expect(weightedRandom(items)).toBe('C');
    });

    it('should return the last item if random exceeds total weight due to rounding', () => {
      Math.random = () => 0.999999;
      expect(weightedRandom(items)).toBe('C');
    });
  });
});
