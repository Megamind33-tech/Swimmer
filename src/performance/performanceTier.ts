import { getGraphicsCompatibilityProfile } from '../utils';

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

  const weakCpu = signals.hardwareConcurrency <= 4;
  const lowMem = signals.deviceMemoryGB !== null && signals.deviceMemoryGB <= 3;
  const strictAndroid = compatibility.isAndroid && compatibility.mobileShaderBudget === 'strict';
  if (strictAndroid || (compatibility.isAndroid && (weakCpu || lowMem))) {
    tier = 'low';
  }

  if (signals.reducedMotion && tier === 'high') {
    tier = 'medium';
  }

  if (signals.isTouchPrimary && tier === 'high' && compatibility.mobileShaderBudget !== 'full') {
    tier = 'medium';
  }

  return tier;
}
