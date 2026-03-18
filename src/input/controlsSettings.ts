/**
 * controlsSettings — localStorage persistence for ControlsPreset
 *
 * Provides load / save / reset helpers so user settings survive
 * page reloads without a backend.
 *
 * Storage key: "swimmer_controls_v1"
 *
 * Usage:
 *   import { loadPreset, savePreset, resetPreset } from './controlsSettings';
 *   const preset = loadPreset();          // always returns a full preset
 *   savePreset({ ...preset, hudScale: 1.2 });
 *   const fresh = resetPreset();          // clears storage + returns default
 */

import type { ControlsPreset } from './inputTypes';
import { DEFAULT_CONTROLS_PRESET } from './inputTypes';

const STORAGE_KEY = 'swimmer_controls_v1';

// ─────────────────────────────────────────────────────────────────────────────
// Load
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load the saved preset from localStorage.
 * Merges with DEFAULT_CONTROLS_PRESET so new fields added in future
 * versions are always present even if the stored object predates them.
 * Returns DEFAULT_CONTROLS_PRESET if nothing is stored or parsing fails.
 */
export function loadPreset(): ControlsPreset {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONTROLS_PRESET };
    const parsed = JSON.parse(raw) as Partial<ControlsPreset>;
    return { ...DEFAULT_CONTROLS_PRESET, ...parsed };
  } catch {
    return { ...DEFAULT_CONTROLS_PRESET };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Save
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Persist the given preset to localStorage.
 * Silently ignores errors (e.g. private browsing with storage blocked).
 */
export function savePreset(preset: ControlsPreset): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preset));
  } catch { /* storage unavailable */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Reset
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clear the stored preset and return the default.
 */
export function resetPreset(): ControlsPreset {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* storage unavailable */ }
  return { ...DEFAULT_CONTROLS_PRESET };
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation helpers (clamp values to safe ranges)
// ─────────────────────────────────────────────────────────────────────────────

export function clampPreset(p: ControlsPreset): ControlsPreset {
  return {
    ...p,
    joystickSize:      clamp(p.joystickSize,      100, 180),
    buttonSize:        clamp(p.buttonSize,          72, 120),
    hudScale:          clamp(p.hudScale,           0.75, 1.5),
    cameraSensitivity: clamp(p.cameraSensitivity,  0.2, 2.0),
  };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
