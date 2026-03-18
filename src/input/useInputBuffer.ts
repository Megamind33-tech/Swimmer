/**
 * useInputBuffer — ring buffer for recent input events
 *
 * Stores up to BUFFER_SIZE recent inputs with timestamps.
 * Consumers can query "was action X pressed in the last N ms?"
 * Useful for:
 *   - Combo detection (sprint + stroke = burst mode)
 *   - Timing windows (perfect start, perfect turn)
 *   - Replay of missed inputs (input forgiveness)
 *
 * Usage:
 *   const { push, wasPressed, flushOlderThan, recent } = useInputBuffer();
 *   push({ action: 'strokeLeft', timestamp: now, device: 'touch' });
 *   const hit = wasPressed('strokeLeft', 150); // in last 150ms?
 */

import { useRef, useCallback } from 'react';
import type { BufferedInput, InputAction, InputDevice } from './inputTypes';

const BUFFER_SIZE = 24;

export interface UseInputBufferResult {
  /** Add an input to the buffer */
  push:           (action: InputAction, device?: InputDevice) => void;
  /** Check if action was pressed within windowMs milliseconds */
  wasPressed:     (action: InputAction, windowMs?: number) => boolean;
  /** Get last N inputs matching action */
  recent:         (action?: InputAction, count?: number) => BufferedInput[];
  /** Remove entries older than cutoff */
  flushOlderThan: (ms: number) => void;
  /** Clear entire buffer */
  clear:          () => void;
}

export function useInputBuffer(): UseInputBufferResult {
  const buffer = useRef<BufferedInput[]>([]);

  const push = useCallback((action: InputAction, device: InputDevice = 'touch') => {
    const entry: BufferedInput = { action, device, timestamp: performance.now() };
    buffer.current.push(entry);
    if (buffer.current.length > BUFFER_SIZE) {
      buffer.current.shift();
    }
  }, []);

  const wasPressed = useCallback((action: InputAction, windowMs = 200): boolean => {
    const now     = performance.now();
    const cutoff  = now - windowMs;
    return buffer.current.some(
      (e) => e.action === action && e.timestamp >= cutoff,
    );
  }, []);

  const recent = useCallback((action?: InputAction, count = 8): BufferedInput[] => {
    const filtered = action
      ? buffer.current.filter((e) => e.action === action)
      : [...buffer.current];
    return filtered.slice(-count);
  }, []);

  const flushOlderThan = useCallback((ms: number) => {
    const cutoff = performance.now() - ms;
    buffer.current = buffer.current.filter((e) => e.timestamp >= cutoff);
  }, []);

  const clear = useCallback(() => {
    buffer.current = [];
  }, []);

  return { push, wasPressed, recent, flushOlderThan, clear };
}
