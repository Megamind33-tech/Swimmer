/**
 * useRaceState — ref-first race simulation with throttled React display state
 *
 * Problem solved:
 *   The naive approach calls 6+ React setStates per rAF frame (60fps), causing
 *   ~360 individual state updates/second even with React 18 auto-batching.
 *   At 60fps each batched update still triggers a full HUDRoot re-render tree.
 *
 * Solution:
 *   1. All simulation values live in a single mutable `sim` ref (60fps accuracy)
 *   2. Two throttled React state slices drive the HUD display:
 *        timerDisplay  — elapsedMs + distanceM     (default 30 Hz)
 *        cosmeticDisplay — stamina/oxygen/rhythm/position (default 15 Hz)
 *   3. The caller's rAF loop mutates `sim.current` and calls `commitDisplay()`
 *      once per tick; `commitDisplay` decides whether to push to React state.
 *
 * Result:
 *   - React re-renders drop from 60/s → 30/s (50% reduction)
 *   - With React.memo on HUD widgets: stamina/rhythm widgets only re-render at 15Hz
 *   - Timer widget re-renders at 30Hz; other widgets are skipped if props unchanged
 *
 * Usage:
 *   const { sim, timerDisplay, cosmeticDisplay, commitDisplay } = useRaceState(preset);
 *
 *   // In rAF tick:
 *   sim.current.elapsed = performance.now() - startTime;
 *   sim.current.stamina = Math.max(0, sim.current.stamina - 0.018);
 *   // ...other simulation...
 *   commitDisplay();
 *
 *   // Pass to HUD:
 *   <HUDRoot elapsedMs={timerDisplay.elapsedMs} stamina={cosmeticDisplay.stamina} ... />
 */

import React, { useRef, useState, useCallback } from 'react';
import type { PerformancePreset } from './performancePreset';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Mutable simulation state — lives in a ref, never triggers re-renders */
export interface RaceSimState {
  elapsed:  number;  // ms since race start
  stamina:  number;  // 0-100
  oxygen:   number;  // 0-100
  rhythm:   number;  // 0-100
  distance: number;  // metres completed
  position: number;  // 1-8
}

/** Timer display state — updated at timerHz (default 30fps) */
export interface TimerDisplayState {
  elapsedMs: number;
  distanceM: number;
}

/** Cosmetic display state — updated at cosmeticHz (default 15fps) */
export interface CosmeticDisplayState {
  stamina:  number;
  oxygen:   number;
  rhythm:   number;
  position: number;
}

export interface UseRaceStateResult {
  /** Mutable ref — update freely in rAF without causing re-renders */
  sim:            React.MutableRefObject<RaceSimState>;
  /** Throttled React state for timer + distance */
  timerDisplay:   TimerDisplayState;
  /** Throttled React state for stamina/oxygen/rhythm/position */
  cosmeticDisplay: CosmeticDisplayState;
  /**
   * Call once per rAF tick after updating sim.current.
   * Pushes sim values → React display state when their throttle intervals elapse.
   */
  commitDisplay:  () => void;
  /** Reset all sim + display state (call when re-starting a race) */
  resetState:     () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_SIM: RaceSimState = {
  elapsed: 0, stamina: 100, oxygen: 100, rhythm: 75, distance: 0, position: 4,
};

export function useRaceState(preset: Pick<PerformancePreset, 'timerHz' | 'cosmeticHz'>): UseRaceStateResult {
  const { timerHz, cosmeticHz } = preset;

  // Simulation ref — mutated every 16ms, never causes a re-render
  const sim = useRef<RaceSimState>({ ...INITIAL_SIM });

  // Throttled display state — cause React re-renders at the specified Hz
  const [timerDisplay, setTimerDisplay] = useState<TimerDisplayState>({
    elapsedMs: 0,
    distanceM: 0,
  });

  const [cosmeticDisplay, setCosmeticDisplay] = useState<CosmeticDisplayState>({
    stamina: 100, oxygen: 100, rhythm: 75, position: 4,
  });

  // Last-update timestamps for each throttle bucket
  const lastTimerMs    = useRef(0);
  const lastCosmeticMs = useRef(0);

  const timerInterval    = 1000 / timerHz;    // e.g. 33ms @ 30Hz
  const cosmeticInterval = 1000 / cosmeticHz; // e.g. 67ms @ 15Hz

  const commitDisplay = useCallback(() => {
    const now = performance.now();
    const s   = sim.current;

    // Timer group: elapsedMs + distanceM
    if (now - lastTimerMs.current >= timerInterval) {
      lastTimerMs.current = now;
      setTimerDisplay({ elapsedMs: s.elapsed, distanceM: s.distance });
    }

    // Cosmetic group: stamina / oxygen / rhythm / position
    if (now - lastCosmeticMs.current >= cosmeticInterval) {
      lastCosmeticMs.current = now;
      setCosmeticDisplay({
        stamina:  s.stamina,
        oxygen:   s.oxygen,
        rhythm:   s.rhythm,
        position: s.position,
      });
    }
  }, [timerInterval, cosmeticInterval]);

  const resetState = useCallback(() => {
    sim.current = { ...INITIAL_SIM };
    lastTimerMs.current    = 0;
    lastCosmeticMs.current = 0;
    setTimerDisplay({ elapsedMs: 0, distanceM: 0 });
    setCosmeticDisplay({ stamina: 100, oxygen: 100, rhythm: 75, position: 4 });
  }, []);

  return { sim, timerDisplay, cosmeticDisplay, commitDisplay, resetState };
}
