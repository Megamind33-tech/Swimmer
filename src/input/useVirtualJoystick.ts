/**
 * useVirtualJoystick — Pointer Events-based virtual joystick hook
 *
 * Returns:
 *   handlers    — spread onto the joystick container div
 *   knobOffset  — { x, y } pixel offset from center for the knob element
 *   vector      — normalised JoystickVector (-1..1 per axis)
 *   active      — whether a finger is currently pressing the joystick
 *
 * Design:
 *   - Uses Pointer Events (unified touch + mouse + stylus)
 *   - setPointerCapture so the knob tracks across the entire screen
 *   - Dead zone: 8% of travel radius (prevents drift from loose placement)
 *   - Knob travel radius: 45% of the joystick container size
 *   - Emits JoystickVector to InputManager on every pointermove
 *
 * No DOM refs needed — all state via React.
 */

import { useState, useCallback, useRef } from 'react';
import type React from 'react';
import { JoystickVector, JOYSTICK_NEUTRAL } from './inputTypes';

export interface VirtualJoystickOptions {
  /** Joystick container diameter in px */
  size:       number;
  /** 0.0–1.0 fraction of radius below which x,y are clamped to 0 (dead zone) */
  deadZone?:  number;
  /** Called every frame with new vector while active */
  onMove?:    (v: JoystickVector) => void;
  /** Called when joystick is released */
  onRelease?: () => void;
}

export interface VirtualJoystickResult {
  /** Spread onto the outer container div */
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp:   (e: React.PointerEvent) => void;
    onPointerCancel:(e: React.PointerEvent)=> void;
  };
  /** Pixel offset to apply as `transform: translate(${x}px, ${y}px)` on the knob */
  knobOffset: { x: number; y: number };
  /** Normalised direction vector */
  vector:     JoystickVector;
  /** True while a pointer is active */
  active:     boolean;
}

export function useVirtualJoystick({
  size,
  deadZone = 0.08,
  onMove,
  onRelease,
}: VirtualJoystickOptions): VirtualJoystickResult {
  const [vector,     setVector]     = useState<JoystickVector>(JOYSTICK_NEUTRAL);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const [active,     setActive]     = useState(false);

  // We store origin in a ref (not state) so pointermove never closes over stale origin
  const originRef    = useRef({ x: 0, y: 0 });
  const activeRef    = useRef(false);
  const capturedIdRef= useRef<number | null>(null);

  // Max travel from center in pixels
  const travelRadius = (size / 2) * 0.45;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only respond to primary pointer (first finger)
    if (activeRef.current) return;
    activeRef.current = true;
    capturedIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);

    // The origin is the center of the joystick container
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    originRef.current = {
      x: rect.left + rect.width  / 2,
      y: rect.top  + rect.height / 2,
    };

    setActive(true);
    setKnobOffset({ x: 0, y: 0 });
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!activeRef.current || e.pointerId !== capturedIdRef.current) return;

    const dx = e.clientX - originRef.current.x;
    const dy = e.clientY - originRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clampedDist = Math.min(dist, travelRadius);
    const angle = Math.atan2(dy, dx);

    // Clamped pixel offsets for knob rendering
    const ox = Math.cos(angle) * clampedDist;
    const oy = Math.sin(angle) * clampedDist;
    setKnobOffset({ x: ox, y: oy });

    // Normalise to -1..1 with dead zone
    const rawMag = clampedDist / travelRadius;
    const mag    = rawMag < deadZone ? 0 : (rawMag - deadZone) / (1 - deadZone);
    const nx     = mag > 0 ? Math.cos(angle) * mag : 0;
    const ny     = mag > 0 ? Math.sin(angle) * mag : 0;

    const vec: JoystickVector = {
      x: nx, y: ny, magnitude: mag, angle, active: true,
    };
    setVector(vec);
    onMove?.(vec);
  }, [travelRadius, deadZone, onMove]);

  const release = useCallback(() => {
    if (!activeRef.current) return;
    activeRef.current = false;
    capturedIdRef.current = null;
    setActive(false);
    setKnobOffset({ x: 0, y: 0 });
    setVector(JOYSTICK_NEUTRAL);
    onRelease?.();
  }, [onRelease]);

  return {
    handlers: {
      onPointerDown:   handlePointerDown,
      onPointerMove:   handlePointerMove,
      onPointerUp:     release,
      onPointerCancel: release,
    },
    knobOffset,
    vector,
    active,
  };
}
