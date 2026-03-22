import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  CAREER_STAGES,
  ATHLETE_ATTRIBUTES,
  TRAINING_PHASES,
  ATHLETE_FORM,
  CAREER_RIVALS,
  LEGACY_BENCHMARKS,
  PLAYER_LEGACY,
  CAREER_SPONSORS,
  type CareerStage,
  type AthleteAttribute,
  type TrainingPhase,
  type CareerRival,
  type LegacyBenchmark,
} from '../utils/gameData'
import { ProgressBar } from '../components/ProgressBar'
import {
  TrophyIcon,
  StarIcon,
  ZapIcon,
  FlameIcon,
  TargetIcon,
  ActivityIcon,
  AwardIcon,
  UserIcon,
  CalendarIcon,
  TrendingUpIcon,
  ShieldIcon,
  ChevronRightIcon,
  LockIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon,
} from 'lucide-react'
import { PaneSwitcher, useIsLandscapeMobile } from '../ui/PaneSwitcher'

// ── Design tokens ────────────────────────────────────────────────────────────
const VOLT   = 'var(--color-volt)'
const GOLD   = '#D4A843'
const PANEL  = 'rgba(4,20,33,0.80)'
const BORDER = 'rgba(56,214,255,0.13)'

const TIER_COLORS: Record<string, string> = {
  grassroots:   '#34D399',
  junior:       '#60A5FA',
  national:     '#FBBF24',
  elite:        '#F97316',
  olympic:      '#D4A843',
  professional: '#A78BFA',
}

const TIER_LABELS: Record<string, string> = {
  grassroots:   'GRASSROOTS',
  junior:       'JUNIOR',
  national:     'NATIONAL',
  elite:        'ELITE',
  olympic:      'OLYMPIC',
  professional: 'PROFESSIONAL',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexShrink: 0 }}>
      {icon}
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.07em' }}>{title}</span>
    </div>
  )
}

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      borderRadius: '12px',
      border: `1px solid ${BORDER}`,
      background: PANEL,
      backdropFilter: 'blur(12px)',
      padding: '10px 12px',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── Pane 1: PATHWAY ──────────────────────────────────────────────────────────

function PathwayPane() {
  const [selected, setSelected] = useState<string>('JUNIOR_NATIONAL')

  const selectedStage = CAREER_STAGES.find(s => s.id === selected)

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

        {/* Career stage ladder */}
        <Panel>
          <SectionHeader icon={<TrendingUpIcon size={12} color={GOLD} />} title="CAREER PATHWAY" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {CAREER_STAGES.map((stage, i) => {
              const color  = TIER_COLORS[stage.tier]
              const isActive = stage.id === selected
              const isDone   = stage.state === 'completed'
              const isCurrent = stage.state === 'current'
              const isLocked  = stage.state === 'locked'
              return (
                <motion.button
                  key={stage.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelected(stage.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: isActive ? `rgba(${color === GOLD ? '212,168,67' : '56,214,255'},0.08)` : 'rgba(255,255,255,0.02)',
                    border: isActive ? `1px solid ${color}55` : '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '9px', padding: '7px 10px',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    opacity: isLocked ? 0.55 : 1,
                  }}
                >
                  {/* Step indicator */}
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isDone ? 'rgba(52,211,153,0.15)' : isCurrent ? `${color}22` : 'rgba(0,0,0,0.40)',
                    border: `1.5px solid ${isDone ? '#34D399' : isCurrent ? color : 'rgba(255,255,255,0.10)'}`,
                  }}>
                    {isDone
                      ? <CheckCircleIcon size={13} color="#34D399" />
                      : isLocked
                      ? <LockIcon size={11} color="rgba(255,255,255,0.30)" />
                      : <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', color: color }}>{i + 1}</span>
                    }
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '12px', color: isLocked ? 'rgba(255,255,255,0.40)' : '#F3FBFF' }}>
                        {stage.label}
                      </span>
                      {isCurrent && (
                        <span style={{ fontSize: '8px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, color: color, background: `${color}22`, padding: '1px 5px', borderRadius: '4px', letterSpacing: '0.10em' }}>NOW</span>
                      )}
                    </div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.45)', letterSpacing: '0.06em', marginTop: '1px' }}>
                      {stage.subtitle} · Ages {stage.ageRange}
                    </div>
                  </div>

                  {/* Tier tag */}
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '9px', color: color, letterSpacing: '0.12em', flexShrink: 0 }}>
                    {TIER_LABELS[stage.tier]}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </Panel>

        {/* Stage detail card */}
        {selectedStage && (
          <motion.div
            key={selectedStage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <StageDetail stage={selectedStage} />
          </motion.div>
        )}

      </div>
    </div>
  )
}

function StageDetail({ stage }: { stage: CareerStage }) {
  const color = TIER_COLORS[stage.tier]
  const isLocked = stage.state === 'locked'
  return (
    <Panel style={{ borderColor: `${color}33` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: '#F3FBFF', letterSpacing: '0.05em', lineHeight: 1.1 }}>
            {stage.label}
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: color, marginTop: '2px' }}>
            {stage.realWorldEquivalent}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: color, lineHeight: 1 }}>
            {stage.qualifyingTime}
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.50)', marginTop: '1px' }}>
            {stage.qualifyingLabel}
          </div>
        </div>
      </div>

      {/* Gate requirement */}
      <div style={{ background: isLocked ? 'rgba(0,0,0,0.35)' : `${color}11`, borderRadius: '8px', padding: '7px 10px', marginBottom: '10px', border: `1px solid ${isLocked ? 'rgba(255,255,255,0.06)' : `${color}33`}` }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.60)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '3px' }}>
          {isLocked ? 'UNLOCK REQUIREMENT' : stage.state === 'current' ? 'CURRENT GOAL' : 'COMPLETED'}
        </div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', color: isLocked ? 'rgba(255,255,255,0.50)' : '#F3FBFF' }}>
          {isLocked ? <LockIcon size={10} style={{ display: 'inline', marginRight: '4px' }} /> : null}
          {stage.gate}
        </div>
      </div>

      {/* Rewards */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.60)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '5px' }}>
          STAGE REWARDS
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {stage.rewards.map((r, i) => (
            <span key={i} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: color, background: `${color}15`, border: `1px solid ${color}33`, padding: '2px 8px', borderRadius: '5px' }}>
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Legacy points */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <StarIcon size={11} color={GOLD} />
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: GOLD }}>
          {stage.legacyPoints.toLocaleString()} Legacy Points on completion
        </span>
      </div>
    </Panel>
  )
}

// ── Pane 2: DEVELOP ──────────────────────────────────────────────────────────

function DevelopPane() {
  const [activeAttr, setActiveAttr] = useState<string | null>(null)
  const isLandscape = useIsLandscapeMobile()

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

        {/* Form & Fitness */}
        <Panel>
          <SectionHeader icon={<ActivityIcon size={12} color="#34D399" />} title="ATHLETE FORM" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
            <FormStat label="FORM" value={ATHLETE_FORM.form} max={100} color="#34D399" />
            <FormStat label="FATIGUE" value={ATHLETE_FORM.fatigue} max={100} color="#F97316" invert />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <FormStat label="PEAK POTENTIAL" value={ATHLETE_FORM.peakForm} max={100} color={GOLD} />
            <FormStat label="TRAINING LOAD" value={ATHLETE_FORM.trainingLoad} max={100} color="#A78BFA" />
          </div>
          <div style={{ marginTop: '8px', padding: '6px 8px', borderRadius: '7px', background: 'rgba(56,214,255,0.05)', border: `1px solid ${BORDER}` }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.60)' }}>
              <ClockIcon size={10} style={{ display: 'inline', marginRight: '4px' }} />
              {ATHLETE_FORM.weeksToNextMeet} weeks to next major meet · Current phase: {' '}
            </span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: VOLT }}>
              {ATHLETE_FORM.currentPhase.replace('_', ' ')}
            </span>
          </div>
        </Panel>

        {/* Attributes */}
        <Panel>
          <SectionHeader icon={<ZapIcon size={12} color={VOLT} />} title="ATHLETE ATTRIBUTES" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {ATHLETE_ATTRIBUTES.map((attr) => (
              <AttributeRow
                key={attr.id}
                attr={attr}
                active={activeAttr === attr.id}
                onPress={() => setActiveAttr(activeAttr === attr.id ? null : attr.id)}
              />
            ))}
          </div>
        </Panel>

        {/* Training Phases */}
        <Panel>
          <SectionHeader icon={<CalendarIcon size={12} color={GOLD} />} title="PERIODIZATION" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {TRAINING_PHASES.map((phase) => (
              <TrainingPhaseRow key={phase.id} phase={phase} compact={isLandscape} />
            ))}
          </div>
        </Panel>

      </div>
    </div>
  )
}

function FormStat({ label, value, max, color, invert }: { label: string; value: number; max: number; color: string; invert?: boolean }) {
  const displayVal = invert ? max - value : value
  const pct = (value / max) * 100
  return (
    <div style={{ background: 'rgba(0,0,0,0.30)', borderRadius: '8px', padding: '7px 9px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(169,211,231,0.55)', letterSpacing: '0.12em' }}>{label}</span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color, lineHeight: 1 }}>{value}</span>
      </div>
      <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ height: '100%', borderRadius: '2px', width: `${pct}%`, background: color, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  )
}

function AttributeRow({ attr, active, onPress }: { attr: AthleteAttribute; active: boolean; onPress: () => void }) {
  const pct = (attr.value / attr.max) * 100
  return (
    <div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onPress}
        style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px',
            color: attr.color, letterSpacing: '0.10em',
            background: `${attr.color}18`, border: `1px solid ${attr.color}33`,
            padding: '1px 5px', borderRadius: '4px', flexShrink: 0,
          }}>{attr.shortLabel}</span>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '12px', color: '#F3FBFF', flex: 1 }}>{attr.label}</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: attr.color, lineHeight: 1 }}>{attr.value}</span>
        </div>
        <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ height: '100%', borderRadius: '3px', background: `linear-gradient(90deg, ${attr.color}99, ${attr.color})` }}
          />
        </div>
      </motion.button>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: '6px', padding: '8px 10px', borderRadius: '8px', background: `${attr.color}0D`, border: `1px solid ${attr.color}28` }}>
              <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.70)', lineHeight: 1.4, marginBottom: '5px' }}>
                {attr.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FlameIcon size={10} color={attr.color} />
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: attr.color }}>
                  Training: {attr.trainingDrill}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TrainingPhaseRow({ phase, compact }: { phase: TrainingPhase; compact?: boolean }) {
  const isCurrent = phase.current
  const colors: Record<string, string> = {
    PREP: '#60A5FA',
    COMPETITION: '#F97316',
    PEAK: GOLD,
    RECOVERY: '#34D399',
  }
  const color = colors[phase.id] || VOLT
  return (
    <div style={{
      borderRadius: '8px', border: isCurrent ? `1px solid ${color}55` : `1px solid ${BORDER}`,
      background: isCurrent ? `${color}0A` : 'rgba(255,255,255,0.02)',
      padding: compact ? '6px 8px' : '7px 10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px' }}>{phase.emoji}</span>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '12px', color: isCurrent ? '#F3FBFF' : 'rgba(255,255,255,0.60)' }}>
            {phase.label}
          </span>
          {isCurrent && (
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '9px', color, background: `${color}22`, padding: '1px 5px', borderRadius: '4px', letterSpacing: '0.10em' }}>
              ACTIVE · WK {phase.weekNumber}
            </span>
          )}
        </div>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.45)' }}>{phase.duration}</span>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <PhaseTag label="VOL" value={phase.volumeLevel} color={color} />
        <PhaseTag label="INT" value={phase.intensityLevel} color={color} />
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.55)', flex: 1, lineHeight: 1.3 }}>
          {phase.formEffect}
        </span>
      </div>
    </div>
  )
}

function PhaseTag({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center', flexShrink: 0 }}>
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(169,211,231,0.45)', letterSpacing: '0.10em' }}>{label}</span>
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', color, background: `${color}18`, padding: '1px 4px', borderRadius: '3px' }}>{value}</span>
    </div>
  )
}

// ── Pane 3: RIVALS ───────────────────────────────────────────────────────────

function RivalsPane() {
  const [selected, setSelected] = useState<string>(CAREER_RIVALS[0].id)
  const rival = CAREER_RIVALS.find(r => r.id === selected)!

  const relColors: Record<string, string> = {
    nemesis: '#EF4444',
    rival:   '#F97316',
    close:   '#FBBF24',
    fading:  '#34D399',
  }

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

        {/* Rival selector */}
        <Panel>
          <SectionHeader icon={<ShieldIcon size={12} color="#EF4444" />} title="CAREER RIVALS" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {CAREER_RIVALS.map((r) => {
              const stage = CAREER_STAGES.find(s => s.id === r.careerStage)
              const color = relColors[r.relationship]
              const isActive = r.id === selected
              return (
                <motion.button
                  key={r.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelected(r.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '9px',
                    background: isActive ? `${color}0D` : 'rgba(255,255,255,0.02)',
                    border: isActive ? `1px solid ${color}44` : `1px solid ${BORDER}`,
                    borderRadius: '9px', padding: '7px 10px',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                  }}
                >
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${color}18`, border: `1.5px solid ${color}44`,
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', color,
                  }}>
                    {r.flag}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '12px', color: '#F3FBFF' }}>{r.name}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.45)' }}>
                      {r.speciality} · OVR {r.ovr}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '9px', color, letterSpacing: '0.12em' }}>
                      {r.relationship.toUpperCase()}
                    </div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.50)' }}>
                      {stage?.label}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </Panel>

        {/* Rival detail */}
        <AnimatePresence mode="wait">
          <motion.div key={rival.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RivalDetail rival={rival} relColors={relColors} />
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  )
}

function RivalDetail({ rival, relColors }: { rival: CareerRival; relColors: Record<string, string> }) {
  const color = relColors[rival.relationship]
  const total = rival.head2head.wins + rival.head2head.losses
  const winPct = total > 0 ? Math.round((rival.head2head.wins / total) * 100) : 0

  return (
    <Panel style={{ borderColor: `${color}33` }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}18`, border: `2px solid ${color}44`, fontSize: '22px' }}>
          {rival.flag}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1 }}>
            {rival.name}
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: color, marginTop: '2px' }}>
            {rival.country} · {rival.speciality}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', color, lineHeight: 1 }}>{rival.ovr}</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.45)' }}>OVR</div>
        </div>
      </div>

      {/* PB */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <ClockIcon size={11} color={color} />
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.70)' }}>Personal Best: </span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: '#F3FBFF' }}>{rival.personalBest}</span>
      </div>

      {/* H2H */}
      <div style={{ background: 'rgba(0,0,0,0.30)', borderRadius: '9px', padding: '8px 10px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.55)', letterSpacing: '0.12em', marginBottom: '6px' }}>
          HEAD TO HEAD
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#34D399', lineHeight: 1 }}>{rival.head2head.wins}</span>
          <div style={{ flex: 1 }}>
            <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${winPct}%`, background: 'linear-gradient(90deg, #34D399, #10B981)' }} />
            </div>
          </div>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#EF4444', lineHeight: 1 }}>{rival.head2head.losses}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: '#34D399' }}>YOUR WINS</span>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: '#EF4444' }}>LOSSES</span>
        </div>
      </div>

      {/* Last result */}
      <div style={{ marginBottom: '8px', padding: '6px 9px', borderRadius: '7px', background: `${color}0D`, border: `1px solid ${color}28` }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.55)', letterSpacing: '0.10em', marginBottom: '2px' }}>LAST ENCOUNTER</div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', color: '#F3FBFF' }}>{rival.lastResult}</div>
      </div>

      {/* Quote */}
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.45)', fontStyle: 'italic', lineHeight: 1.5 }}>
        {rival.quote}
      </div>
    </Panel>
  )
}

// ── Pane 4: LEGACY ───────────────────────────────────────────────────────────

function LegacyPane() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

        {/* Player legacy card */}
        <Panel style={{ borderColor: `${GOLD}44`, background: 'linear-gradient(135deg, rgba(42,31,12,0.85) 0%, rgba(4,20,33,0.85) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#F3FBFF', letterSpacing: '0.05em', lineHeight: 1 }}>
                {PLAYER_LEGACY.name}
              </div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: GOLD, marginTop: '2px' }}>
                {CAREER_STAGES.find(s => s.id === PLAYER_LEGACY.careerStage)?.label}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: GOLD, lineHeight: 1 }}>
                {PLAYER_LEGACY.legacyScore.toLocaleString()}
              </div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.50)' }}>LEGACY PTS</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px', marginBottom: '10px' }}>
            <StatBox label="OLYMPIC GOLDS" value={String(PLAYER_LEGACY.olympicGolds)} color={GOLD} />
            <StatBox label="WORLD TITLES" value={String(PLAYER_LEGACY.worldTitles)} color="#60A5FA" />
            <StatBox label="WORLD RECORDS" value={String(PLAYER_LEGACY.worldRecords)} color="#34D399" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <StatBox label="TOTAL RACES" value={String(PLAYER_LEGACY.totalRaces)} color="rgba(169,211,231,0.70)" />
            <StatBox label="PERSONAL BEST" value={PLAYER_LEGACY.personalBest} color={VOLT} />
          </div>
        </Panel>

        {/* Accolades */}
        <Panel>
          <SectionHeader icon={<AwardIcon size={12} color={GOLD} />} title="ACCOLADES" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {PLAYER_LEGACY.accolades.map((a) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '7px 9px', borderRadius: '8px', background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.18)' }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{a.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '12px', color: '#F3FBFF' }}>{a.label}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.45)' }}>{a.year}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* GOAT rankings */}
        <Panel>
          <SectionHeader icon={<TrophyIcon size={12} color={GOLD} />} title="GOAT RANKINGS" />
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.45)', marginBottom: '8px' }}>
            Surpass each legend to climb the all-time rankings
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {/* Player row */}
            <GoatRow rank={6} benchmark={{
              id: 'you', name: PLAYER_LEGACY.name, flag: PLAYER_LEGACY.flag, country: 'Your Career',
              olympicGolds: PLAYER_LEGACY.olympicGolds, worldTitles: PLAYER_LEGACY.worldTitles,
              worldRecords: PLAYER_LEGACY.worldRecords, legacyScore: PLAYER_LEGACY.legacyScore,
              era: 'Present', status: 'your-goal',
            }} isPlayer />
            {[...LEGACY_BENCHMARKS].sort((a, b) => b.legacyScore - a.legacyScore).map((b, i) => (
              <GoatRow key={b.id} rank={i + 1} benchmark={b} />
            ))}
          </div>
        </Panel>

      </div>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: 'rgba(0,0,0,0.30)', borderRadius: '8px', padding: '6px 8px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '8px', color: 'rgba(169,211,231,0.45)', letterSpacing: '0.12em', marginTop: '2px' }}>{label}</div>
    </div>
  )
}

function GoatRow({ rank, benchmark, isPlayer }: { rank: number; benchmark: LegacyBenchmark; isPlayer?: boolean }) {
  const statusColors: Record<string, string> = {
    legend: GOLD,
    active: '#34D399',
    'your-goal': VOLT,
  }
  const color = statusColors[benchmark.status] || GOLD
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 9px',
      borderRadius: '8px',
      background: isPlayer ? 'rgba(56,214,255,0.07)' : 'rgba(255,255,255,0.02)',
      border: isPlayer ? `1px solid ${VOLT}44` : `1px solid ${BORDER}`,
    }}>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: rank <= 3 ? GOLD : 'rgba(169,211,231,0.35)', width: '20px', textAlign: 'center', flexShrink: 0 }}>
        #{rank}
      </span>
      <span style={{ fontSize: '14px', flexShrink: 0 }}>{benchmark.flag}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '12px', color: isPlayer ? VOLT : '#F3FBFF' }}>{benchmark.name}</div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.45)' }}>
          {benchmark.olympicGolds} OG · {benchmark.worldTitles} WT · {benchmark.worldRecords} WR
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color, lineHeight: 1 }}>
          {benchmark.legacyScore.toLocaleString()}
        </div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.40)' }}>{benchmark.era}</div>
      </div>
    </div>
  )
}

// ── Root Component ────────────────────────────────────────────────────────────

export function CareerMode() {
  return (
    <PaneSwitcher
      panes={[
        {
          id: 'pathway',
          label: 'PATHWAY',
          icon: <TrendingUpIcon size={12} />,
          content: <PathwayPane />,
        },
        {
          id: 'develop',
          label: 'DEVELOP',
          icon: <ZapIcon size={12} />,
          content: <DevelopPane />,
        },
        {
          id: 'rivals',
          label: 'RIVALS',
          icon: <ShieldIcon size={12} />,
          content: <RivalsPane />,
        },
        {
          id: 'legacy',
          label: 'LEGACY',
          icon: <StarIcon size={12} />,
          content: <LegacyPane />,
        },
      ]}
    >
      {/* Desktop two-column layout */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', gap: '8px', padding: '8px' }}
      >
        {/* Left: Pathway + Rivals */}
        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          <PathwayPane />
        </div>
        {/* Right: Develop + Legacy */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0, overflowY: 'auto' }}>
          <DevelopPane />
        </div>
      </motion.div>
    </PaneSwitcher>
  )
}
