/**
 * performancePreset — quality/performance settings with localStorage persistence
 *
 * Separate from ControlsPreset (input settings). These settings govern:
 *   - Rendering quality (post-process, effects)
 *   - React update throttle rates
 *   - CSS animation toggles
 *   - Low-end device compensations
 *
 * Storage key: "swimmer_perf_v1"
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type PostProcessQuality = 'high' | 'medium' | 'low' | 'off';

export interface PerformancePreset {
  // Rendering
  postProcessQuality: PostProcessQuality;
  /** Disable shadows, particles, bloom in Babylon scene */
  reducedEffects:     boolean;
  /** Respect prefers-reduced-motion + stop CSS caustics/pulses */
  reducedMotion:      boolean;
  /** Aggressive low-end mode: 30fps Babylon target, no backdrop-filter, simple HUD */
  lowEndMode:         boolean;

  // HUD update rates (Hz)
  /** How often race timer / distance update in React (default 30) */
  timerHz:    number;
  /** How often stamina/oxygen/rhythm/position update in React (default 15) */
  cosmeticHz: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_PERFORMANCE_PRESET: PerformancePreset = {
  postProcessQuality: 'medium',
  reducedEffects:     false,
  reducedMotion:      false,
  lowEndMode:         false,
  timerHz:            30,
  cosmeticHz:         15,
};

// ─────────────────────────────────────────────────────────────────────────────
// Persistence
// ─────────────────────────────────────────────────────────────────────────────

const KEY = 'swimmer_perf_v1';

export function loadPerformancePreset(): PerformancePreset {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_PERFORMANCE_PRESET };
    return { ...DEFAULT_PERFORMANCE_PRESET, ...(JSON.parse(raw) as Partial<PerformancePreset>) };
  } catch {
    return { ...DEFAULT_PERFORMANCE_PRESET };
  }
}

export function savePerformancePreset(p: PerformancePreset): void {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* storage blocked */ }
}

export function resetPerformancePreset(): PerformancePreset {
  try { localStorage.removeItem(KEY); } catch { /* */ }
  return { ...DEFAULT_PERFORMANCE_PRESET };
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-detect: suggest lowEndMode based on hardware
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a performance preset auto-configured for the current device.
 * Respects any user-saved overrides on top.
 */
export function detectAndLoadPreset(): PerformancePreset {
  const saved    = loadPerformancePreset();
  const hasTouch = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;
  const lowRAM   = typeof navigator !== 'undefined'
    // @ts-expect-error — deviceMemory is non-standard but available on Chrome/Android
    && typeof navigator.deviceMemory === 'number' && (navigator.deviceMemory as number) <= 2;
  const reducedMotionPref = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    ...DEFAULT_PERFORMANCE_PRESET,
    // Auto-detect suggestions (only if user hasn't overridden)
    lowEndMode:      saved.lowEndMode     !== false ? saved.lowEndMode     : (hasTouch && lowRAM),
    reducedMotion:   saved.reducedMotion  !== false ? saved.reducedMotion  : reducedMotionPref,
    reducedEffects:  saved.reducedEffects !== false ? saved.reducedEffects : (hasTouch && lowRAM),
    // Merge saved overrides
    ...saved,
  };
}
