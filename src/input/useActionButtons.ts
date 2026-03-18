/**
 * useActionButtons — button state management with haptic + audio feedback
 *
 * Each button goes through three phases on press:
 *   1. pressed=true, flash=true (immediate, < 16ms)
 *   2. flash=false after FLASH_MS (visual confirmation window)
 *   3. pressed=false on pointerup/cancel
 *
 * Haptic: navigator.vibrate(12) called on press if hapticEnabled
 * Audio:  short Web Audio oscillator click on press if audioCuesEnabled
 *
 * Returns:
 *   states    — Record of button id → { pressed, flash, pressedAt }
 *   press(id) — call on pointerdown
 *   release(id)—call on pointerup/cancel
 */

import { useState, useRef, useCallback } from 'react';
import type { InputAction } from './inputTypes';

const FLASH_MS = 130;

export interface ButtonState {
  pressed:   boolean;
  flash:     boolean;
  pressedAt: number;
}

export type ButtonStates = Partial<Record<InputAction, ButtonState>>;

export interface UseActionButtonsOptions {
  hapticEnabled:    boolean;
  audioCuesEnabled: boolean;
}

export interface UseActionButtonsResult {
  states:  ButtonStates;
  press:   (id: InputAction) => void;
  release: (id: InputAction) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Haptic helper
// ─────────────────────────────────────────────────────────────────────────────

function triggerHaptic(ms = 12): void {
  try {
    if ('vibrate' in navigator) navigator.vibrate(ms);
  } catch { /* not available */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Audio helper — tiny Web Audio oscillator click
// ─────────────────────────────────────────────────────────────────────────────

let _audioCtx: AudioContext | null = null;

function playClick(type: InputAction): void {
  try {
    if (!_audioCtx) _audioCtx = new AudioContext();
    const ctx  = _audioCtx;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Different frequencies for different actions
    const freq = type === 'sprint' ? 480 : type === 'contextAction' ? 660 : 540;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch { /* AudioContext not available */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useActionButtons({
  hapticEnabled,
  audioCuesEnabled,
}: UseActionButtonsOptions): UseActionButtonsResult {
  const [states, setStates] = useState<ButtonStates>({});
  const flashTimers = useRef<Map<InputAction, ReturnType<typeof setTimeout>>>(new Map());

  const press = useCallback((id: InputAction) => {
    // Feedback
    if (hapticEnabled)    triggerHaptic(12);
    if (audioCuesEnabled) playClick(id);

    // Clear existing flash timer
    const existing = flashTimers.current.get(id);
    if (existing) clearTimeout(existing);

    // Set pressed + flash immediately
    setStates((prev) => ({
      ...prev,
      [id]: { pressed: true, flash: true, pressedAt: performance.now() },
    }));

    // Clear flash after FLASH_MS
    const timer = setTimeout(() => {
      setStates((prev) => {
        const entry = prev[id];
        if (!entry) return prev;
        return { ...prev, [id]: { ...entry, flash: false } };
      });
      flashTimers.current.delete(id);
    }, FLASH_MS);

    flashTimers.current.set(id, timer);
  }, [hapticEnabled, audioCuesEnabled]);

  const release = useCallback((id: InputAction) => {
    setStates((prev) => {
      const entry = prev[id];
      if (!entry) return prev;
      return { ...prev, [id]: { ...entry, pressed: false } };
    });
  }, []);

  return { states, press, release };
}
