/**
 * useCameraToggle — camera view cycling with InputManager integration
 *
 * Cycles through CameraView in the order defined by CAMERA_VIEW_CYCLE:
 *   DEFAULT → RACING → AERIAL → SIDE → DEFAULT …
 *
 * Sources that trigger a cycle:
 *   1. Calling toggle() directly (from the camera button in the HUD)
 *   2. 'cameraToggle' InputAction emitted by InputManager (C key / RB gamepad)
 *
 * Usage:
 *   const { view, toggle, label } = useCameraToggle();
 *
 *   // In JSX:
 *   <button onClick={toggle}>{label}</button>   // shows "CAM", "RACE", "TOP", "SIDE"
 */

import { useState, useEffect, useCallback } from 'react';
import type { CameraView } from './inputTypes';
import { CAMERA_VIEW_CYCLE, CAMERA_VIEW_LABEL } from './inputTypes';
import { getInputManager } from './InputManager';

export interface UseCameraToggleResult {
  /** Current camera view */
  view:   CameraView;
  /** Cycle to the next view */
  toggle: () => void;
  /** Short display label for the current view */
  label:  string;
}

export function useCameraToggle(): UseCameraToggleResult {
  const [view, setView] = useState<CameraView>(CAMERA_VIEW_CYCLE[0]);

  const toggle = useCallback(() => {
    setView((prev) => {
      const idx  = CAMERA_VIEW_CYCLE.indexOf(prev);
      const next = CAMERA_VIEW_CYCLE[(idx + 1) % CAMERA_VIEW_CYCLE.length];
      return next;
    });
  }, []);

  // Subscribe to InputManager for keyboard / gamepad cameraToggle events
  useEffect(() => {
    const manager = getInputManager();
    const unsub   = manager.subscribe((event) => {
      if (event.action === 'cameraToggle') toggle();
    });
    return unsub;
  }, [toggle]);

  return {
    view,
    toggle,
    label: CAMERA_VIEW_LABEL[view],
  };
}
