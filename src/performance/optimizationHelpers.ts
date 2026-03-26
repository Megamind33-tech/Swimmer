/**
 * optimizationHelpers — game performance utilities
 *
 * Call-once helpers that prepare the app for peak performance before/during a race.
 * All functions are safe to call multiple times (idempotent).
 */

import type React from 'react';
import type { PerformancePreset } from './performancePreset';

let prewarmPromise: Promise<void> | null = null;

// ─────────────────────────────────────────────────────────────────────────────
// Asset prewarming
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prewarm latency-sensitive assets before the race starts.
 *   - Unlocks the Web Audio context early (avoids 50-200ms first-sound delay)
 *   - Waits for fonts to be ready (prevents layout shifts in HUD)
 *   - Requests a high-priority animation frame to warm up the compositor
 */
export async function prewarmCriticalAssets(): Promise<void> {
  if (prewarmPromise) return prewarmPromise;

  prewarmPromise = (async () => {
  // Unlock AudioContext before first user sound (must be called in a user gesture)
  let ctx: AudioContext | null = null;
  try {
    ctx = new AudioContext();
    if (ctx.state === 'suspended') await ctx.resume();
    // Create and immediately stop a silent oscillator to warm up the audio graph
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.001);
  } catch { /* AudioContext not available */ }
  finally {
    // Avoid leaking a live context across repeated race entry/exit cycles.
    try { await ctx?.close(); } catch { /* */ }
  }

  // Wait for web fonts so HUD text doesn't flash unstyled
  try { await document.fonts.ready; } catch { /* */ }

  // Warm up compositor with a no-op rAF
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  })();

  return prewarmPromise;
}

/**
 * Force the browser to resolve HUD font metrics and lay out critical HUD containers
 * before the race starts. Prevents first-frame layout jank.
 *
 * Accepts an array of DOM element IDs or class names to force-measure.
 */
export function cacheHudTextures(hudRootSelector = '#hud-root'): void {
  try {
    const el = document.querySelector(hudRootSelector);
    if (el) {
      // Trigger a forced layout reflow so subsequent frames reuse cached geometry
      void (el as HTMLElement).offsetHeight;
    }
  } catch { /* DOM not ready */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Throttling utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a throttled version of `fn` that fires at most `hz` times per second.
 * Uses `performance.now()` for sub-millisecond precision.
 *
 * @example
 *   const throttledSetStamina = throttleTelemetryUpdates(setStamina, 15);
 *   // In rAF loop:
 *   throttledSetStamina(newStamina);  // fires at most 15x/second
 */
export function throttleTelemetryUpdates<T>(fn: (value: T) => void, hz: number): (value: T) => void {
  const interval = 1000 / hz;
  let   lastCall = 0;
  return (value: T) => {
    const now = performance.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn(value);
    }
  };
}

/**
 * Batches multiple React state-setter calls into a single synchronous block
 * so React 18 auto-batching groups them into one re-render.
 *
 * Thin wrapper that makes the intent explicit at call sites.
 *
 * @example
 *   batchNonCriticalState(() => {
 *     setStamina(s);
 *     setOxygen(o);
 *     setRhythm(r);
 *   });
 */
export function batchNonCriticalState(updates: () => void): void {
  // React 18 already batches inside rAF callbacks automatically.
  // This wrapper exists for clarity + future React < 18 compat.
  updates();
}

// ─────────────────────────────────────────────────────────────────────────────
// DOM-level effect reduction
// ─────────────────────────────────────────────────────────────────────────────

const REDUCED_FX_ATTR  = 'data-perf-mode';
const REDUCED_FX_VALUE = 'reduced';
const LOW_END_VALUE    = 'low';

/**
 * Adds `data-perf-mode="reduced"` to `<html>`.
 * Disables backdrop-filter, box-shadow, and expensive CSS animations via the
 * `.reduced-fx` CSS classes defined in `index.css`.
 *
 * This is the single most impactful mobile GPU optimization — backdrop-filter
 * can consume 30-50% of a mid-range mobile GPU's frame budget.
 */
export function enableReducedFxMode(): void {
  document.documentElement.setAttribute(REDUCED_FX_ATTR, REDUCED_FX_VALUE);
}

/**
 * Enables low-end mode: reduced-fx + stops all CSS caustic animations,
 * sets `data-perf-mode="low"` which CSS uses to strip nearly all effects.
 */
export function degradeEffectsOnLowEnd(): void {
  document.documentElement.setAttribute(REDUCED_FX_ATTR, LOW_END_VALUE);
  // Also honour prefers-reduced-motion
  document.documentElement.style.setProperty('--motion-scale', '0');
}

/** Remove all performance degradation attributes */
export function restoreFullEffects(): void {
  document.documentElement.removeAttribute(REDUCED_FX_ATTR);
  document.documentElement.style.removeProperty('--motion-scale');
}

/**
 * Apply the user's PerformancePreset to the document root.
 * Call once when loading into a race.
 */
export function applyPerformancePreset(preset: PerformancePreset): void {
  if (preset.lowEndMode) {
    degradeEffectsOnLowEnd();
  } else if (preset.reducedEffects) {
    enableReducedFxMode();
  } else {
    restoreFullEffects();
  }

  if (preset.reducedMotion) {
    document.documentElement.setAttribute('data-reduced-motion', 'true');
  } else {
    document.documentElement.removeAttribute('data-reduced-motion');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// React memo helper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * memoizeStaticPanels — identity utility for documenting that a component
 * is wrapped in React.memo because its props rarely change.
 *
 * Provides a named wrapper so intent is clear in code review.
 * Actual memoization is done by passing the component through React.memo.
 *
 * @example
 *   export const LaneRadar = memoizeStaticPanel(LaneRadarInner);
 */
export function memoizeStaticPanel<T extends object>(
  component: React.ComponentType<T>,
): React.MemoExoticComponent<React.ComponentType<T>> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { memo } = require('react') as typeof import('react');
  return memo(component);
}
