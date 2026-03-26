import { getGraphicsCompatibilityProfile } from '../utils';
import type { PerformancePreset } from './performancePreset';

export type RuntimePerformanceTier = 'high' | 'medium' | 'low';

interface RuntimeSignals {
  reducedMotion: boolean;
  hardwareConcurrency: number;
  deviceMemoryGB: number | null;
  isTouchPrimary: boolean;
}

function readSignals(): RuntimeSignals {
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hardwareConcurrency = typeof navigator !== 'undefined'
    ? Math.max(1, navigator.hardwareConcurrency || 2)
    : 2;

  // Chrome/Android-specific, undefined elsewhere.
  const deviceMemoryGB = typeof navigator !== 'undefined'
    // @ts-expect-error Non-standard browser API used as a soft signal only.
    && typeof navigator.deviceMemory === 'number'
    // @ts-expect-error Non-standard browser API used as a soft signal only.
    ? Number(navigator.deviceMemory)
    : null;

  const isTouchPrimary = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;

  return { reducedMotion, hardwareConcurrency, deviceMemoryGB, isTouchPrimary };
}

export function detectRuntimePerformanceTier(): RuntimePerformanceTier {
  const compatibility = getGraphicsCompatibilityProfile();
  const signals = readSignals();

  let tier: RuntimePerformanceTier =
    compatibility.recommendedQualityTier === 'HIGH'
      ? 'high'
      : compatibility.recommendedQualityTier === 'LOW'
        ? 'low'
        : 'medium';

  // Conservative downgrade for weak Android + constrained CPU/RAM.
  const weakCpu = signals.hardwareConcurrency <= 4;
  const lowMem = signals.deviceMemoryGB !== null && signals.deviceMemoryGB <= 3;
  const strictAndroid = compatibility.isAndroid && compatibility.mobileShaderBudget === 'strict';
  if (strictAndroid || (compatibility.isAndroid && (weakCpu || lowMem))) {
    tier = 'low';
  }

  // Prefer stability when users request reduced motion.
  if (signals.reducedMotion && tier === 'high') {
    tier = 'medium';
  }

  // Touch-first devices should avoid defaulting to "high" unless clearly capable.
  if (signals.isTouchPrimary && tier === 'high' && compatibility.mobileShaderBudget !== 'full') {
    tier = 'medium';
  }

  return tier;
}

export function resolvePerformancePreset(base: PerformancePreset): PerformancePreset {
  const tier = detectRuntimePerformanceTier();

  if (tier === 'low') {
    return {
      ...base,
      postProcessQuality: 'low',
      reducedEffects: true,
      reducedMotion: true,
      lowEndMode: true,
      timerHz: Math.min(base.timerHz, 24),
      cosmeticHz: Math.min(base.cosmeticHz, 10),
    };
  }

  if (tier === 'medium') {
    return {
      ...base,
      postProcessQuality: base.postProcessQuality === 'high' ? 'medium' : base.postProcessQuality,
      reducedEffects: base.reducedEffects,
      reducedMotion: base.reducedMotion,
      lowEndMode: base.lowEndMode,
      timerHz: Math.min(base.timerHz, 30),
      cosmeticHz: Math.min(base.cosmeticHz, 15),
    };
  }

  return base;
}

