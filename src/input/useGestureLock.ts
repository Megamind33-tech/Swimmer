/**
 * useGestureLock — multi-touch zone ownership registry
 *
 * Prevents two fingers accidentally activating two zones simultaneously
 * (e.g. joystick + stroke button fighting over the same pointerId).
 *
 * How it works:
 *   - Each interactive zone (joystick, strokeLeft, strokeRight, sprint…)
 *     calls tryLock(zoneId, pointerId) on pointerdown.
 *   - If the pointerId is already owned by another zone, tryLock returns false
 *     and the zone must ignore that pointer.
 *   - When the pointer is released, the zone calls unlock(pointerId).
 *   - isLocked(zoneId, pointerId) lets a zone check mid-gesture whether it
 *     still owns the pointer (guards against race conditions on cancel).
 *
 * Usage:
 *   const { tryLock, unlock, isLocked, clear } = useGestureLock();
 *
 *   // In zone A pointerdown:
 *   if (!tryLock('joystick', e.pointerId)) return; // another zone owns it
 *
 *   // In zone A pointerup/cancel:
 *   unlock(e.pointerId);
 */

import { useRef, useCallback } from 'react';
import type { GestureLockEntry } from './inputTypes';

export interface UseGestureLockResult {
  /**
   * Attempt to claim a pointerId for zoneId.
   * Returns true if claim succeeded (or zoneId already owns it).
   * Returns false if a *different* zone already owns the pointer.
   */
  tryLock:  (zoneId: string, pointerId: number) => boolean;
  /** Release a pointer — called on pointerup / pointercancel */
  unlock:   (pointerId: number) => void;
  /** Check whether zoneId currently owns pointerId */
  isLocked: (zoneId: string, pointerId: number) => boolean;
  /** Release all locks for a zone (e.g. on component unmount) */
  releaseZone: (zoneId: string) => void;
  /** Wipe all locks — use on race end / HUD unmount */
  clear:    () => void;
}

export function useGestureLock(): UseGestureLockResult {
  // Map from pointerId → GestureLockEntry
  const locks = useRef<Map<number, GestureLockEntry>>(new Map());

  const tryLock = useCallback((zoneId: string, pointerId: number): boolean => {
    const existing = locks.current.get(pointerId);

    if (!existing) {
      // Free — claim it
      locks.current.set(pointerId, {
        zoneId,
        pointerId,
        lockedAt: performance.now(),
      });
      return true;
    }

    // Already owned by this zone — re-entrant claim is fine
    if (existing.zoneId === zoneId) return true;

    // Owned by a different zone — deny
    return false;
  }, []);

  const unlock = useCallback((pointerId: number) => {
    locks.current.delete(pointerId);
  }, []);

  const isLocked = useCallback((zoneId: string, pointerId: number): boolean => {
    const entry = locks.current.get(pointerId);
    return entry?.zoneId === zoneId;
  }, []);

  const releaseZone = useCallback((zoneId: string) => {
    locks.current.forEach((entry, pointerId) => {
      if (entry.zoneId === zoneId) locks.current.delete(pointerId);
    });
  }, []);

  const clear = useCallback(() => {
    locks.current.clear();
  }, []);

  return { tryLock, unlock, isLocked, releaseZone, clear };
}
