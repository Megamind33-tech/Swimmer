/**
 * inputTypes — unified type system for all game input
 *
 * Covers: touch (primary), keyboard (fallback), gamepad (optional polling)
 *
 * Design rules:
 *   - Every action has one canonical name regardless of input device
 *   - Joystick output is always a normalised -1..1 vector (device-agnostic)
 *   - Button states are boolean — debounce/timing lives in the manager
 *   - No hardcoded pixel values — all sizing comes from ControlsPreset
 */

// ─────────────────────────────────────────────────────────────────────────────
// Device / Action
// ─────────────────────────────────────────────────────────────────────────────

export type InputDevice = 'touch' | 'keyboard' | 'gamepad';

export type InputAction =
  | 'strokeLeft'      // primary left-arm stroke / left tap
  | 'strokeRight'     // primary right-arm stroke / right tap
  | 'sprint'          // burst speed, costs stamina
  | 'contextAction'   // changes meaning with race state (dive, tuck, push)
  | 'pause'           // pause race
  | 'cameraToggle'    // cycle through camera views
  | 'joystickMove';   // continuous axis — carries JoystickVector as payload

// ─────────────────────────────────────────────────────────────────────────────
// Joystick
// ─────────────────────────────────────────────────────────────────────────────

export interface JoystickVector {
  x:         number;   // -1.0 (left) → +1.0 (right)
  y:         number;   // -1.0 (up)   → +1.0 (down)
  magnitude: number;   // 0.0 → 1.0
  angle:     number;   // radians, 0 = right, π/2 = down
  active:    boolean;
}

export const JOYSTICK_NEUTRAL: JoystickVector = {
  x: 0, y: 0, magnitude: 0, angle: 0, active: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// Camera views
// ─────────────────────────────────────────────────────────────────────────────

export type CameraView = 'DEFAULT' | 'AERIAL' | 'RACING' | 'SIDE';

export const CAMERA_VIEW_CYCLE: CameraView[] = ['DEFAULT', 'RACING', 'AERIAL', 'SIDE'];

export const CAMERA_VIEW_LABEL: Record<CameraView, string> = {
  DEFAULT: 'CAM',
  RACING:  'RACE',
  AERIAL:  'TOP',
  SIDE:    'SIDE',
};

// ─────────────────────────────────────────────────────────────────────────────
// Button state
// ─────────────────────────────────────────────────────────────────────────────

export interface ActionButtonState {
  pressed:   boolean;
  pressedAt: number;  // performance.now() timestamp
  flash:     boolean; // visual flash active
}

export type ActionButtonMap = Record<InputAction, ActionButtonState>;

// ─────────────────────────────────────────────────────────────────────────────
// Controls preset (user settings)
// ─────────────────────────────────────────────────────────────────────────────

export interface ControlsPreset {
  /** Virtual joystick diameter in pixels (100–180) */
  joystickSize:      number;
  /** Action button size in pixels (72–120) */
  buttonSize:        number;
  /** Which hand holds the joystick. 'right' = joystick BL, buttons BR (default) */
  handedness:        'left' | 'right';
  /** Global HUD scale multiplier (0.75–1.5) */
  hudScale:          number;
  /** Camera pan speed multiplier (0.2–2.0) */
  cameraSensitivity: number;
  /** Trigger navigator.vibrate on button press */
  hapticEnabled:     boolean;
  /** Play Web Audio click on button press */
  audioCuesEnabled:  boolean;
}

export const DEFAULT_CONTROLS_PRESET: ControlsPreset = {
  joystickSize:      130,
  buttonSize:        82,
  handedness:        'right',
  hudScale:          1.0,
  cameraSensitivity: 1.0,
  hapticEnabled:     true,
  audioCuesEnabled:  true,
};

// ─────────────────────────────────────────────────────────────────────────────
// Normalised input event (emitted from InputManager)
// ─────────────────────────────────────────────────────────────────────────────

export interface InputEvent {
  action:    InputAction;
  device:    InputDevice;
  timestamp: number;
  value?:    JoystickVector | number;  // joystick: vector; button: 1.0
}

// ─────────────────────────────────────────────────────────────────────────────
// Gesture lock entry
// ─────────────────────────────────────────────────────────────────────────────

export interface GestureLockEntry {
  zoneId:    string;
  pointerId: number;
  lockedAt:  number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Buffered input entry
// ─────────────────────────────────────────────────────────────────────────────

export interface BufferedInput {
  action:    InputAction;
  timestamp: number;
  device:    InputDevice;
}
