import { useEffect, useMemo, useState } from 'react'
import { TRAINING_CYCLE_PHASES, TRAINING_DRILLS } from '../utils/trainingEngineData'

const STORAGE_KEY = 'swim26_training_engine_state'

type TrainingEngineState = {
  selectedDrillId: string
  cyclePhaseId: string
  sessionActive: boolean
}

const DEFAULT_STATE: TrainingEngineState = {
  selectedDrillId: TRAINING_DRILLS[0]?.id ?? 'starts',
  cyclePhaseId: TRAINING_CYCLE_PHASES[1]?.id ?? 'sharpen',
  sessionActive: false,
}

function loadState(): TrainingEngineState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

export function useTrainingEngineState() {
  const [state, setState] = useState<TrainingEngineState>(loadState)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const selectedDrill = useMemo(
    () => TRAINING_DRILLS.find((drill) => drill.id === state.selectedDrillId) ?? TRAINING_DRILLS[0],
    [state.selectedDrillId],
  )

  const cyclePhase = useMemo(
    () => TRAINING_CYCLE_PHASES.find((phase) => phase.id === state.cyclePhaseId) ?? TRAINING_CYCLE_PHASES[0],
    [state.cyclePhaseId],
  )

  return {
    ...state,
    selectedDrill,
    cyclePhase,
    setSelectedDrillId: (selectedDrillId: string) => setState((current) => ({ ...current, selectedDrillId })),
    setCyclePhaseId: (cyclePhaseId: string) => setState((current) => ({ ...current, cyclePhaseId })),
    setSessionActive: (sessionActive: boolean | ((current: boolean) => boolean)) => setState((current) => ({ ...current, sessionActive: typeof sessionActive === 'function' ? sessionActive(current.sessionActive) : sessionActive })),
  }
}

export default useTrainingEngineState
