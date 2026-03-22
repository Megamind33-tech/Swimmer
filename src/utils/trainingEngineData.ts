import React from 'react'
import {
  ActivityIcon,
  GaugeIcon,
  HeartPulseIcon,
  TargetIcon,
  TimerResetIcon,
} from 'lucide-react'

export const TRAINING_AQUA = 'var(--color-volt)'
export const TRAINING_GOLD = 'var(--color-volt)'

export interface DrillImpact {
  label: string
  value: number
  max: number
}

export interface Drill {
  id: string
  label: string
  icon: React.ReactNode
  stat: string
  delta: string
  color: string
  desc: string
  sets: number
  reps: string
  rest: string
  impact: DrillImpact[]
}

export interface TrainingCyclePhase {
  id: string
  name: string
  load: string
  readiness: string
  focus: string
  risk: string
}

export interface TrainingGroup {
  id: string
  name: string
  purpose: string
  currentLoad: string
  payoff: string
}

export const TRAINING_DRILLS: Drill[] = [
  {
    id: 'starts', label: 'STARTS', icon: React.createElement(GaugeIcon, { size: 16 }), stat: 'Reaction', delta: '+0.8%',
    color: TRAINING_AQUA, desc: 'Explosive block departure. Trains fast-twitch fibers for sub-0.6s entry.',
    sets: 6, reps: '×1 dive', rest: '90s',
    impact: [
      { label: 'Start Reaction', value: 18, max: 20 },
      { label: 'Underwater Power', value: 14, max: 20 },
    ],
  },
  {
    id: 'turns', label: 'TURNS', icon: React.createElement(ActivityIcon, { size: 16 }), stat: 'Turn Speed', delta: '+1.2%',
    color: '#A78BFA', desc: 'Flip-turn mechanics with flip angle optimization and push-off power.',
    sets: 8, reps: '×4 turns', rest: '60s',
    impact: [
      { label: 'Turn Speed', value: 16, max: 20 },
      { label: 'Endurance', value: 12, max: 20 },
    ],
  },
  {
    id: 'stroke', label: 'STROKE RATE', icon: React.createElement(TimerResetIcon, { size: 16 }), stat: 'Efficiency', delta: '+0.6%',
    color: '#34D399', desc: 'Stroke cycle drills with cadence metronome. Target 48–52 strokes/min.',
    sets: 4, reps: '200m', rest: '120s',
    impact: [
      { label: 'Endurance', value: 17, max: 20 },
      { label: 'Mental Comp', value: 14, max: 20 },
    ],
  },
  {
    id: 'endurance', label: 'ENDURANCE', icon: React.createElement(HeartPulseIcon, { size: 16 }), stat: 'VO2 Max', delta: '+2.1%',
    color: '#F87171', desc: 'Lactate threshold sets. Builds aerobic base for 400m+ events.',
    sets: 3, reps: '400m', rest: '180s',
    impact: [
      { label: 'Endurance', value: 17, max: 20 },
      { label: 'Finish Burst', value: 15, max: 20 },
    ],
  },
  {
    id: 'pace', label: 'PACE', icon: React.createElement(TargetIcon, { size: 16 }), stat: 'Split Ctrl', delta: '+1.4%',
    color: TRAINING_GOLD, desc: 'Even-split and negative-split strategy. Trains race-day pacing judgment.',
    sets: 5, reps: '100m', rest: '90s',
    impact: [
      { label: 'Mental Comp', value: 16, max: 20 },
      { label: 'Endurance', value: 13, max: 20 },
    ],
  },
  {
    id: 'power', label: 'POWER', icon: React.createElement(GaugeIcon, { size: 16 }), stat: 'Peak Force', delta: '+1.7%',
    color: '#FB923C', desc: 'Resistance band + pull-buoy sets for peak propulsion force.',
    sets: 5, reps: '50m', rest: '60s',
    impact: [
      { label: 'Underwater Power', value: 17, max: 20 },
      { label: 'Finish Burst', value: 18, max: 20 },
    ],
  },
]

export const TRAINING_DRILL_STATS = [
  { label: 'SPEED DRILL', icon: React.createElement(GaugeIcon, { size: 12 }), value: 'Lv. 7', color: TRAINING_AQUA },
  { label: 'TECHNIQUE', icon: React.createElement(TargetIcon, { size: 12 }), value: 'Lv. 6', color: '#A78BFA' },
  { label: 'ENDURANCE', icon: React.createElement(HeartPulseIcon, { size: 12 }), value: 'Lv. 8', color: '#F87171' },
  { label: 'POWER', icon: React.createElement(GaugeIcon, { size: 12 }), value: 'Lv. 5', color: '#FB923C' },
]

export const TRAINING_CYCLE_PHASES: TrainingCyclePhase[] = [
  {
    id: 'build',
    name: 'Build Block',
    load: 'High volume',
    readiness: '78%',
    focus: 'Grow engine, add training tolerance, and unlock stronger endurance ceilings.',
    risk: 'Race sharpness suffers if you stack too many starts and relay duties.',
  },
  {
    id: 'sharpen',
    name: 'Sharpen Block',
    load: 'Race-specific',
    readiness: '88%',
    focus: 'Convert fitness into race pace, reaction time, and split control.',
    risk: 'Fatigue spikes if athletes double up on power and turn work without recovery.',
  },
  {
    id: 'taper',
    name: 'Taper Window',
    load: 'Reduced volume',
    readiness: '93%',
    focus: 'Protect freshness so the next pressure swim lands in the peak zone.',
    risk: 'Too much rest can flatten feel and confidence before the meet.',
  },
]

export const CLUB_TRAINING_GROUPS: TrainingGroup[] = [
  {
    id: 'sprint-core',
    name: 'Sprint Core',
    purpose: '50m/100m specialists hunting clean starts and brutal close speed.',
    currentLoad: 'High neural load',
    payoff: 'Best group for televised finals and sponsor-facing race nights.',
  },
  {
    id: 'relay-unit',
    name: 'Relay Unit',
    purpose: 'Takeover timing, chemistry, and pressure-proof relay exchanges.',
    currentLoad: 'Medium race rehearsal',
    payoff: 'Raises club prestige faster than isolated individual wins.',
  },
  {
    id: 'engine-room',
    name: 'Engine Room',
    purpose: 'Aerobic base work for medley and distance swimmers.',
    currentLoad: 'High aerobic volume',
    payoff: 'Creates the long-term backbone of a real dynasty.',
  },
]
