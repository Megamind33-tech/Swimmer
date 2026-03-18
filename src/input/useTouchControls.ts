/**
 * useTouchControls — master input hook for the race HUD
 *
 * Composes all input sub-hooks into a single interface consumed by RaceScene
 * and StrokeControls. Also subscribes to the InputManager singleton so that
 * keyboard and gamepad events flow through the same output surface.
 *
 * Returned shape:
 *   joystick      — { handlers, knobOffset, vector, active }  (useVirtualJoystick)
 *   buttons       — { states, press, release }                (useActionButtons)
 *   buffer        — { push, wasPressed, recent, … }           (useInputBuffer)
 *   gestureLock   — { tryLock, unlock, isLocked, … }          (useGestureLock)
 *   camera        — { view, toggle, label }                   (useCameraToggle)
 *   device        — currently active InputDevice
 *   onStroke      — convenience: push + press in one call
 *
 * Usage:
 *   const controls = useTouchControls({ preset, onPause });
 *   // Pass controls.joystick.handlers to the joystick container div
 *   // Pass controls.buttons.press/release to stroke buttons
 */

import { useEffect, useCallback } from 'react';
import type { ControlsPreset, InputAction, InputDevice, JoystickVector } from './inputTypes';
import { useVirtualJoystick }  from './useVirtualJoystick';
import { useActionButtons }    from './useActionButtons';
import { useInputBuffer }      from './useInputBuffer';
import { useGestureLock }      from './useGestureLock';
import { useCameraToggle }     from './useCameraToggle';
import { getInputManager }     from './InputManager';
import { useRef, useState }    from 'react';

export interface UseTouchControlsOptions {
  preset:   ControlsPreset;
  /** Called when pause action fires from any device */
  onPause?: () => void;
  /** Called on every joystickMove event (touch OR keyboard/gamepad) */
  onJoystick?: (v: JoystickVector) => void;
}

export interface UseTouchControlsResult {
  joystick:    ReturnType<typeof useVirtualJoystick>;
  buttons:     ReturnType<typeof useActionButtons>;
  buffer:      ReturnType<typeof useInputBuffer>;
  gestureLock: ReturnType<typeof useGestureLock>;
  camera:      ReturnType<typeof useCameraToggle>;
  /** Active input device (updates on any event) */
  device:      InputDevice;
  /**
   * Convenience: push action into buffer AND mark button pressed.
   * Use this in touch button onPointerDown handlers so the buffer and
   * visual state stay in sync without two separate calls.
   */
  onStroke: (action: InputAction) => void;
}

export function useTouchControls({
  preset,
  onPause,
  onJoystick,
}: UseTouchControlsOptions): UseTouchControlsResult {
  const [device, setDevice] = useState<InputDevice>('touch');

  // ── Sub-hooks ──────────────────────────────────────────────────────────────

  const joystick = useVirtualJoystick({
    size:      preset.joystickSize,
    deadZone:  0.08,
    onMove:    onJoystick,
  });

  const buttons = useActionButtons({
    hapticEnabled:    preset.hapticEnabled,
    audioCuesEnabled: preset.audioCuesEnabled,
  });

  const buffer      = useInputBuffer();
  const gestureLock = useGestureLock();
  const camera      = useCameraToggle();

  // ── InputManager subscription ─────────────────────────────────────────────

  const onPauseRef   = useRef(onPause);
  const onJoystickRef = useRef(onJoystick);
  onPauseRef.current    = onPause;
  onJoystickRef.current = onJoystick;

  useEffect(() => {
    const manager = getInputManager();

    const unsub = manager.subscribe((event) => {
      // Track active device
      setDevice(event.device);

      // Push everything into the buffer
      buffer.push(event.action, event.device);

      switch (event.action) {
        case 'pause':
          onPauseRef.current?.();
          break;

        case 'joystickMove':
          if (event.value && typeof event.value === 'object') {
            onJoystickRef.current?.(event.value as JoystickVector);
          }
          break;

        case 'strokeLeft':
        case 'strokeRight':
        case 'sprint':
        case 'contextAction':
          // Mirror keyboard/gamepad presses into button visual state
          buttons.press(event.action);
          // Auto-release after a short window (keyboard doesn't fire pointerup)
          setTimeout(() => buttons.release(event.action), 180);
          break;

        default:
          break;
      }
    });

    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — manager singleton is stable

  // ── Convenience ───────────────────────────────────────────────────────────

  const onStroke = useCallback((action: InputAction) => {
    buffer.push(action, 'touch');
    buttons.press(action);
  }, [buffer, buttons]);

  return {
    joystick,
    buttons,
    buffer,
    gestureLock,
    camera,
    device,
    onStroke,
  };
}
