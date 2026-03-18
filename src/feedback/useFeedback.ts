/**
 * useFeedback — unified audio + haptic hook
 *
 * Returns stable callbacks for every feedback primitive.
 * Respects `hapticEnabled` and `audioCuesEnabled` from ControlsPreset
 * so the user's settings are honoured without callers needing to check.
 *
 * Usage:
 *   const fb = useFeedback(preset);
 *   fb.playUiTap();
 *   fb.triggerSuccessHaptic();
 */

import { useCallback } from 'react';
import type { ControlsPreset } from '../input/inputTypes';

import {
  playUiTap         as _tap,
  playUiConfirm     as _confirm,
  playUiBack        as _back,
  playCountdownBeep as _beep,
  playFinishImpact  as _finish,
} from './audioEngine';

import {
  triggerLightHaptic   as _light,
  triggerMediumHaptic  as _medium,
  triggerSuccessHaptic as _success,
  triggerWarningHaptic as _warning,
} from './haptics';

export interface UseFeedbackResult {
  // ── Audio ────────────────────────────────────────────────────────────────
  playUiTap:         () => void;
  playUiConfirm:     () => void;
  playUiBack:        () => void;
  /** Pass isFinalGo=true for the GO! beat */
  playCountdownBeep: (isFinalGo?: boolean) => void;
  playFinishImpact:  () => void;

  // ── Haptic ───────────────────────────────────────────────────────────────
  triggerLightHaptic:   () => void;
  triggerMediumHaptic:  () => void;
  triggerSuccessHaptic: () => void;
  triggerWarningHaptic: () => void;
}

export function useFeedback(
  preset: Pick<ControlsPreset, 'hapticEnabled' | 'audioCuesEnabled'>,
): UseFeedbackResult {
  const a = preset.audioCuesEnabled;
  const h = preset.hapticEnabled;

  const playUiTap         = useCallback(() => { if (a) _tap();         }, [a]);
  const playUiConfirm     = useCallback(() => { if (a) _confirm();     }, [a]);
  const playUiBack        = useCallback(() => { if (a) _back();        }, [a]);
  const playCountdownBeep = useCallback((isFinalGo = false) => { if (a) _beep(isFinalGo); }, [a]);
  const playFinishImpact  = useCallback(() => { if (a) _finish();      }, [a]);

  const triggerLightHaptic   = useCallback(() => { if (h) _light();   }, [h]);
  const triggerMediumHaptic  = useCallback(() => { if (h) _medium();  }, [h]);
  const triggerSuccessHaptic = useCallback(() => { if (h) _success(); }, [h]);
  const triggerWarningHaptic = useCallback(() => { if (h) _warning(); }, [h]);

  return {
    playUiTap,
    playUiConfirm,
    playUiBack,
    playCountdownBeep,
    playFinishImpact,
    triggerLightHaptic,
    triggerMediumHaptic,
    triggerSuccessHaptic,
    triggerWarningHaptic,
  };
}
