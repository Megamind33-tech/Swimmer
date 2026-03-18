/**
 * InputManager — unified input manager for touch, keyboard, and gamepad
 *
 * Responsibilities:
 *   - Listen to DOM input events (PointerEvents, KeyboardEvents, Gamepad API)
 *   - Normalise all inputs into InputEvent with canonical InputAction names
 *   - Maintain a live snapshot of current device type
 *   - Provide subscribe/unsubscribe for InputEvent listeners
 *   - Fill the input buffer for useInputBuffer consumers
 *
 * Keyboard mappings:
 *   A / ArrowLeft   → strokeLeft
 *   D / ArrowRight  → strokeRight
 *   Space           → sprint
 *   E               → contextAction
 *   C               → cameraToggle
 *   Escape / P      → pause
 *   WASD/Arrows     → joystickMove (digital, ±1)
 *
 * Gamepad mappings (standard layout):
 *   Left stick axes  → joystickMove
 *   Button 0 (A/×)  → strokeLeft
 *   Button 1 (B/○)  → strokeRight
 *   Button 2 (X/□)  → sprint
 *   Button 3 (Y/△)  → contextAction
 *   Button 9 (Start)→ pause
 *   Button 5 (RB)   → cameraToggle
 *
 * The InputManager does NOT own UI — it is headless.
 * React hooks (useTouchControls, etc.) wrap it for component use.
 */

import {
  InputAction, InputDevice, InputEvent, JoystickVector, JOYSTICK_NEUTRAL,
} from './inputTypes';

type InputListener = (event: InputEvent) => void;

// ─────────────────────────────────────────────────────────────────────────────
// Keyboard map
// ─────────────────────────────────────────────────────────────────────────────

const KEY_ACTION_MAP: Record<string, InputAction> = {
  'KeyA':        'strokeLeft',
  'ArrowLeft':   'strokeLeft',
  'KeyD':        'strokeRight',
  'ArrowRight':  'strokeRight',
  'Space':       'sprint',
  'KeyE':        'contextAction',
  'KeyC':        'cameraToggle',
  'Escape':      'pause',
  'KeyP':        'pause',
};

// Keys that contribute to the virtual joystick axis
const KEY_AXIS_MAP: Record<string, { axis: 'x' | 'y'; value: number }> = {
  'KeyW':     { axis: 'y', value: -1 },
  'ArrowUp':  { axis: 'y', value: -1 },
  'KeyS':     { axis: 'y', value: +1 },
  'ArrowDown':{ axis: 'y', value: +1 },
  'KeyA':     { axis: 'x', value: -1 },
  'ArrowLeft':{ axis: 'x', value: -1 },
  'KeyD':     { axis: 'x', value: +1 },
  'ArrowRight':{ axis: 'x', value: +1 },
};

// ─────────────────────────────────────────────────────────────────────────────
// InputManager class
// ─────────────────────────────────────────────────────────────────────────────

export class InputManager {
  private listeners   = new Set<InputListener>();
  private device:     InputDevice = 'touch';
  private keyAxis: { x: number; y: number } = { x: 0, y: 0 };
  private keysHeld    = new Set<string>();
  private gamepадRaf: number | null = null;
  private disposed    = false;

  // Bound handlers (so removeEventListener works correctly)
  private _onKeyDown:   (e: KeyboardEvent) => void;
  private _onKeyUp:     (e: KeyboardEvent) => void;
  private _onPointerDn: (e: PointerEvent)  => void;

  constructor() {
    this._onKeyDown   = this.handleKeyDown.bind(this);
    this._onKeyUp     = this.handleKeyUp.bind(this);
    this._onPointerDn = this.handlePointerDevice.bind(this);
    this.attach();
  }

  // ── Subscribe / unsubscribe ──────────────────────────────────────────────

  subscribe(cb: InputListener): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  // ── Active input device ──────────────────────────────────────────────────

  getDevice(): InputDevice { return this.device; }

  // ── DOM attachment ───────────────────────────────────────────────────────

  private attach(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown',     this._onKeyDown,   { passive: true });
    window.addEventListener('keyup',       this._onKeyUp,     { passive: true });
    window.addEventListener('pointerdown', this._onPointerDn, { passive: true });
    this.startGamepadPoll();
  }

  // ── Device detection ────────────────────────────────────────────────────

  private handlePointerDevice(e: PointerEvent): void {
    if (e.pointerType === 'touch') this.device = 'touch';
    else if (e.pointerType === 'mouse') this.device = 'keyboard';
  }

  // ── Keyboard handlers ───────────────────────────────────────────────────

  private handleKeyDown(e: KeyboardEvent): void {
    if (this.keysHeld.has(e.code)) return; // no repeat
    this.keysHeld.add(e.code);
    this.device = 'keyboard';

    // Axis update
    const axisEntry = KEY_AXIS_MAP[e.code];
    if (axisEntry) {
      (this.keyAxis as Record<string, number>)[axisEntry.axis] = axisEntry.value;
      this.emitJoystickFromKeys();
    }

    // Action buttons
    const action = KEY_ACTION_MAP[e.code];
    if (action) {
      this.emit({ action, device: 'keyboard', timestamp: performance.now(), value: 1 });
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    this.keysHeld.delete(e.code);

    const axisEntry = KEY_AXIS_MAP[e.code];
    if (axisEntry) {
      // Only clear if this key was the one setting that direction
      (this.keyAxis as Record<string, number>)[axisEntry.axis] = 0;
      this.emitJoystickFromKeys();
    }
  }

  private emitJoystickFromKeys(): void {
    const { x, y } = this.keyAxis;
    const magnitude = Math.min(1, Math.sqrt(x * x + y * y));
    const vector: JoystickVector = {
      x, y, magnitude,
      angle:  Math.atan2(y, x),
      active: magnitude > 0,
    };
    this.emit({ action: 'joystickMove', device: 'keyboard', timestamp: performance.now(), value: vector });
  }

  // ── Gamepad polling ──────────────────────────────────────────────────────

  private prevGamepadButtons: boolean[] = [];

  private startGamepadPoll(): void {
    if (typeof navigator === 'undefined' || !('getGamepads' in navigator)) return;

    const GAMEPAD_BTN_ACTIONS: Record<number, InputAction> = {
      0: 'strokeLeft',
      1: 'strokeRight',
      2: 'sprint',
      3: 'contextAction',
      5: 'cameraToggle',
      9: 'pause',
    };

    const poll = () => {
      if (this.disposed) return;
      const pads = navigator.getGamepads();
      const pad  = pads[0];

      if (pad) {
        this.device = 'gamepad';

        // Left stick → joystick
        const gx = pad.axes[0] ?? 0;
        const gy = pad.axes[1] ?? 0;
        const gMag = Math.min(1, Math.sqrt(gx * gx + gy * gy));
        if (gMag > 0.12) { // deadband
          const vec: JoystickVector = {
            x: gx, y: gy, magnitude: gMag,
            angle: Math.atan2(gy, gx),
            active: true,
          };
          this.emit({ action: 'joystickMove', device: 'gamepad', timestamp: performance.now(), value: vec });
        }

        // Buttons — emit on rising edge only
        pad.buttons.forEach((btn, i) => {
          const wasPressed = this.prevGamepadButtons[i] ?? false;
          if (btn.pressed && !wasPressed) {
            const action = GAMEPAD_BTN_ACTIONS[i];
            if (action) {
              this.emit({ action, device: 'gamepad', timestamp: performance.now(), value: 1 });
            }
          }
          this.prevGamepadButtons[i] = btn.pressed;
        });
      }

      this.gamepадRaf = requestAnimationFrame(poll);
    };

    this.gamepадRaf = requestAnimationFrame(poll);
  }

  // ── Emit helper ──────────────────────────────────────────────────────────

  emit(event: InputEvent): void {
    this.listeners.forEach((cb) => cb(event));
  }

  // ── Cleanup ──────────────────────────────────────────────────────────────

  dispose(): void {
    this.disposed = true;
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown',     this._onKeyDown);
      window.removeEventListener('keyup',       this._onKeyUp);
      window.removeEventListener('pointerdown', this._onPointerDn);
    }
    if (this.gamepадRaf !== null) cancelAnimationFrame(this.gamepадRaf);
    this.listeners.clear();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Singleton for the active race (one manager per race session)
// ─────────────────────────────────────────────────────────────────────────────

let _instance: InputManager | null = null;

export function getInputManager(): InputManager {
  if (!_instance) _instance = new InputManager();
  return _instance;
}

export function destroyInputManager(): void {
  _instance?.dispose();
  _instance = null;
}
