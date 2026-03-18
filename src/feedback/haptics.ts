/**
 * haptics — navigator.vibrate patterns
 *
 * All patterns are short and purposeful (not intrusive).
 * Silently no-ops on devices that don't support vibration.
 */

function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(pattern); } catch { /* not supported */ }
  }
}

/** Quick tap confirmation — button press, menu select */
export function triggerLightHaptic(): void { vibrate(12); }

/** Stronger press — action confirm, join race */
export function triggerMediumHaptic(): void { vibrate(22); }

/** Success pattern — race win, PB, achievement */
export function triggerSuccessHaptic(): void { vibrate([10, 50, 20]); }

/** Warning pattern — low stamina, danger zone */
export function triggerWarningHaptic(): void { vibrate([20, 40, 20, 40, 20]); }
