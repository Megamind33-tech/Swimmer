import React, { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  ActivityIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  CircleIcon,
  CrownIcon,
  FlameIcon,
  GaugeIcon,
  LockIcon,
  ShieldCheckIcon,
  StarIcon,
  SwordsIcon,
  TimerIcon,
  TrophyIcon,
  UserIcon,
  WavesIcon,
  ZapIcon,
} from 'lucide-react'
import { PaneSwitcher, useIsLandscapeMobile } from '../ui/PaneSwitcher'
import { ProgressBar } from '../components/ProgressBar'
import { useTrainingEngineState } from '../hooks/useTrainingEngineState'
import {
  PLAYER_CAREER_EVENTS,
  PLAYER_CAREER_STAGES,
  PLAYER_SEASON_OBJECTIVES,
  PLAYER_WEEKLY_FOCUS,
} from '../utils/careerModeData'
import { TRAINING_CYCLE_PHASES } from '../utils/trainingEngineData'
import { useAthleteCareer } from '../context/CareerSaveContext'

const GOLD = '#D4A843'
const AQUA = '#81ECFF'
const SUCCESS = '#36C690'
const ALERT = '#F87171'
const PANEL = 'rgba(4,20,33,0.82)'
const PANEL_BORDER = 'rgba(56,214,255,0.13)'

const panelStyle: React.CSSProperties = {
  borderRadius: '14px',
  border: `1px solid ${PANEL_BORDER}`,
  background: PANEL,
  backdropFilter: 'blur(12px)',
}

const FORM_COLOR: Record<string, string> = {
  peak: '#D4A843',
  hot: '#36C690',
  normal: '#81ECFF',
  cold: '#F87171',
}

// Personal best times per event for display
const PERSONAL_BESTS: Record<string, string> = {
  '50m Freestyle': '22.41',
  '100m Freestyle': '48.94',
  '200m Freestyle': '1:47.82',
}

export function CareerMode() {
  const isLandscape = useIsLandscapeMobile()
  const { state: athleteState, dispatch: athleteDispatch } = useAthleteCareer()
  const [selectedFocus, setSelectedFocus] = useState(athleteState.trainingFocusId ?? PLAYER_WEEKLY_FOCUS[0]?.id ?? '')
  const [focusConfirmed, setFocusConfirmed] = useState(false)
  const { selectedDrill, cyclePhase, setCyclePhaseId, sessionActive } = useTrainingEngineState()

  const activeFocus = useMemo(
    () => PLAYER_WEEKLY_FOCUS.find((focus) => focus.id === selectedFocus) ?? PLAYER_WEEKLY_FOCUS[0],
    [selectedFocus],
  )

  const stagesWithStatus = useMemo(() => {
    const stageOrder = PLAYER_CAREER_STAGES.map((s) => s.id)
    const currentIdx = stageOrder.indexOf(athleteState.careerStageId)
    return PLAYER_CAREER_STAGES.map((stage, idx) => ({
      ...stage,
      status: idx < currentIdx ? 'completed' as const : idx === currentIdx ? 'current' as const : 'locked' as const,
    }))
  }, [athleteState.careerStageId])

  const currentStageIndex = stagesWithStatus.findIndex((s) => s.status === 'current')
  const currentStage = stagesWithStatus[currentStageIndex]
  const completedCount = stagesWithStatus.filter((s) => s.status === 'completed').length
  const stageProgress = Math.round(((completedCount + 0.65) / stagesWithStatus.length) * 100)

  const nextEvent = PLAYER_CAREER_EVENTS[athleteState.currentEventIdx] ?? PLAYER_CAREER_EVENTS[0]
  const formColor = FORM_COLOR[athleteState.form] ?? AQUA

  // Stats for athlete profile
  const statsRow = [
    { label: 'SPD', value: athleteState.speed },
    { label: 'STM', value: athleteState.stamina },
    { label: 'TEC', value: athleteState.technique },
    { label: 'MNT', value: athleteState.mental },
    { label: 'TRN', value: athleteState.turns },
  ]

  // ─── LADDER PANE ────────────────────────────────────────────────────────────
  const ladderPane = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Player card */}
      <div style={{
        ...panelStyle,
        padding: '14px 16px',
        background: 'linear-gradient(145deg, rgba(18,45,68,0.98) 0%, rgba(7,18,28,0.92) 100%)',
        border: '1px solid rgba(129,236,255,0.18)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(129,236,255,0.10)',
              border: `2px solid ${formColor}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <UserIcon size={22} color={formColor} />
            </div>
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(129,236,255,0.65)', fontWeight: 800 }}>Player Career</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#F3FBFF', lineHeight: 1 }}>Your Athlete</div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', fontWeight: 800, color: formColor, textTransform: 'uppercase', letterSpacing: '0.10em' }}>{athleteState.form.toUpperCase()} FORM</span>
                <span style={{ color: 'rgba(129,236,255,0.3)' }}>·</span>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.65)' }}>Week {athleteState.currentWeek}/{athleteState.totalWeeks}</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '34px', color: GOLD, lineHeight: 1 }}>{Math.floor(athleteState.xp / 500) + 1}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(212,168,67,0.70)', fontWeight: 700 }}>LEVEL</div>
          </div>
        </div>

        {/* XP bar */}
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.55)', fontWeight: 700, textTransform: 'uppercase' }}>XP</span>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: GOLD }}>{athleteState.xp % 500} / 500</span>
          </div>
          <ProgressBar progress={athleteState.xp % 500} max={500} color="bg-[#D4A843]" />
        </div>

        {/* Attribute stats */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
          {statsRow.map((stat) => (
            <div key={stat.label} style={{ flex: 1, background: 'rgba(0,0,0,0.25)', borderRadius: '8px', padding: '6px 4px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: stat.value >= 80 ? SUCCESS : stat.value >= 65 ? AQUA : 'rgba(169,211,231,0.60)', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '8px', color: 'rgba(169,211,231,0.50)', fontWeight: 700, letterSpacing: '0.08em', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
        {[
          { label: 'Readiness', value: `${athleteState.readiness}%`, color: athleteState.readiness >= 80 ? SUCCESS : GOLD },
          { label: 'Trust', value: `${athleteState.coachTrust}`, color: AQUA },
          { label: 'Momentum', value: athleteState.momentum >= 0 ? `+${athleteState.momentum}` : `${athleteState.momentum}`, color: athleteState.momentum >= 0 ? SUCCESS : ALERT },
          { label: 'Rep', value: `${athleteState.reputation}`, color: GOLD },
        ].map((m) => (
          <div key={m.label} style={{ ...panelStyle, padding: '8px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: m.color, lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '8px', color: 'rgba(169,211,231,0.50)', textTransform: 'uppercase', letterSpacing: '0.10em', fontWeight: 700, marginTop: '3px' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Personal bests */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <TimerIcon size={13} color={AQUA} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Personal Bests</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {Object.entries(PERSONAL_BESTS).map(([event, time]) => (
            <div key={event} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 8px', borderRadius: '7px', background: 'rgba(129,236,255,0.04)' }}>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.75)', fontWeight: 700 }}>{event}</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', color: AQUA, letterSpacing: '0.06em' }}>{time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Career path */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <WavesIcon size={13} color={AQUA} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Career Path</span>
          <span style={{ marginLeft: 'auto', fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: GOLD, fontWeight: 700 }}>{stageProgress}%</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {stagesWithStatus.map((stage) => {
            const isCurrent = stage.status === 'current'
            const isDone = stage.status === 'completed'
            return (
              <div key={stage.id} style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 9px',
                borderRadius: '9px',
                border: isCurrent ? '1px solid rgba(212,168,67,0.32)' : isDone ? '1px solid rgba(54,198,144,0.18)' : '1px solid rgba(255,255,255,0.04)',
                background: isCurrent ? 'rgba(212,168,67,0.08)' : isDone ? 'rgba(54,198,144,0.05)' : 'transparent',
                opacity: isDone || isCurrent ? 1 : 0.55,
              }}>
                <div style={{ flexShrink: 0 }}>
                  {isDone ? <CheckCircle2Icon size={14} color={SUCCESS} /> : isCurrent ? <FlameIcon size={14} color={GOLD} /> : <CircleIcon size={14} color="rgba(169,211,231,0.25)" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '11px', color: isCurrent ? GOLD : isDone ? SUCCESS : 'rgba(169,211,231,0.55)' }}>{stage.name}</span>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '8px', color: 'rgba(169,211,231,0.35)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>{stage.tierLabel}</span>
                  </div>
                </div>
                {isCurrent && <ChevronRightIcon size={12} color={GOLD} />}
                {stage.status === 'locked' && <LockIcon size={11} color="rgba(169,211,231,0.25)" />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  // ─── GRIND PANE ─────────────────────────────────────────────────────────────
  const grindPane = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Next race card */}
      {nextEvent && (
        <div style={{
          ...panelStyle,
          padding: '14px 16px',
          background: 'linear-gradient(135deg, rgba(212,168,67,0.12) 0%, rgba(4,20,33,0.90) 100%)',
          border: '1px solid rgba(212,168,67,0.30)',
        }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: GOLD, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '4px' }}>
            Next Race · Tier {nextEvent.tier}
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#F3FBFF', lineHeight: 1, letterSpacing: '0.04em' }}>{nextEvent.name}</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.72)', marginTop: '5px', lineHeight: 1.4 }}>{nextEvent.description}</div>

          <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
            <StatChip icon={<WavesIcon size={11} color={AQUA} />} label={`${nextEvent.distance}m ${nextEvent.stroke.toLowerCase()}`} />
            <StatChip icon={<ZapIcon size={11} color={GOLD} />} label={`Diff ${nextEvent.difficulty}/10`} />
            <StatChip icon={<TrophyIcon size={11} color={SUCCESS} />} label={`${nextEvent.rewards.xp} XP`} />
            <StatChip icon={<SwordsIcon size={11} color={ALERT} />} label={`${nextEvent.opponents.length} rivals`} />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button style={{
              flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer',
              background: GOLD, border: 'none',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', color: '#0A1628', letterSpacing: '0.08em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}>
              <ZapIcon size={14} color="#0A1628" />
              RACE NOW
            </button>
            <button style={{
              padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
              fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.70)', fontWeight: 700,
            }}>
              WARM UP
            </button>
          </div>
        </div>
      )}

      {/* Season objectives */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <TrophyIcon size={13} color={GOLD} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Season Objectives</span>
          <span style={{ marginLeft: 'auto', fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.45)', fontWeight: 700 }}>W{athleteState.currentWeek}/{athleteState.totalWeeks}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PLAYER_SEASON_OBJECTIVES.map((obj) => {
            const done = obj.progress >= 100
            return (
              <div key={obj.id} style={{
                borderRadius: '10px',
                border: done ? '1px solid rgba(54,198,144,0.28)' : obj.progress >= 75 ? '1px solid rgba(212,168,67,0.24)' : '1px solid rgba(255,255,255,0.06)',
                background: done ? 'rgba(54,198,144,0.06)' : 'rgba(255,255,255,0.03)',
                padding: '10px 11px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {done ? <CheckCircle2Icon size={12} color={SUCCESS} /> : <ActivityIcon size={12} color={GOLD} />}
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '11px', color: '#F3FBFF' }}>{obj.title}</span>
                    </div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.60)', marginTop: '3px' }}>{obj.targetLabel}</div>
                  </div>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: GOLD, fontWeight: 800, textAlign: 'right', flexShrink: 0, lineHeight: 1.3 }}>{obj.reward}</span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <ProgressBar progress={obj.progress} max={100} color={done ? 'bg-[#36C690]' : 'bg-[#D4A843]'} showLabel />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Weekly training focus */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <GaugeIcon size={13} color={AQUA} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>This Week's Focus</span>
          {focusConfirmed && (
            <span style={{ marginLeft: 'auto', fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: SUCCESS, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em' }}>
              ✓ LOCKED IN
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {PLAYER_WEEKLY_FOCUS.map((focus) => {
            const active = focus.id === activeFocus.id
            return (
              <button
                key={focus.id}
                onClick={() => { setSelectedFocus(focus.id); setFocusConfirmed(false); athleteDispatch({ type: 'ATHLETE_SET_TRAINING_FOCUS', focusId: focus.id as any }) }}
                style={{
                  textAlign: 'left', borderRadius: '10px', padding: '9px 11px', cursor: 'pointer',
                  border: active ? '1px solid rgba(129,236,255,0.36)' : '1px solid rgba(255,255,255,0.07)',
                  background: active ? 'linear-gradient(135deg, rgba(129,236,255,0.10) 0%, rgba(0,0,0,0) 100%)' : 'rgba(255,255,255,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: active ? '#F3FBFF' : 'rgba(169,211,231,0.60)' }}>{focus.title}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: SUCCESS, letterSpacing: '0.08em' }}>{focus.gain}</span>
                    {active && <BadgeCheckIcon size={13} color={AQUA} />}
                  </div>
                </div>
                {active && (
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.65)', marginTop: '4px', lineHeight: 1.35 }}>{focus.effect}</div>
                )}
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setFocusConfirmed(true)}
          disabled={focusConfirmed}
          style={{
            width: '100%', marginTop: '10px', padding: '10px', borderRadius: '10px', cursor: focusConfirmed ? 'default' : 'pointer',
            background: focusConfirmed ? 'rgba(54,198,144,0.12)' : 'rgba(129,236,255,0.10)',
            border: focusConfirmed ? '1px solid rgba(54,198,144,0.30)' : '1px solid rgba(129,236,255,0.30)',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.10em',
            color: focusConfirmed ? SUCCESS : AQUA,
          }}
        >
          {focusConfirmed ? '✓ FOCUS CONFIRMED' : 'CONFIRM THIS WEEK\'S FOCUS'}
        </button>

        {/* Training phase chips */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
          {TRAINING_CYCLE_PHASES.map((phase) => {
            const active = phase.id === cyclePhase.id
            return (
              <button key={phase.id} onClick={() => setCyclePhaseId(phase.id)} style={{
                padding: '4px 8px', borderRadius: '6px', cursor: 'pointer',
                background: active ? 'rgba(56,214,255,0.12)' : 'rgba(255,255,255,0.03)',
                border: active ? '1px solid rgba(56,214,255,0.28)' : '1px solid rgba(255,255,255,0.06)',
                fontFamily: "'Rajdhani', sans-serif", fontSize: '9px',
                color: active ? AQUA : 'rgba(169,211,231,0.40)', textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                {phase.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Rivals */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <SwordsIcon size={13} color={ALERT} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Rivals</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {athleteState.rivals.map((rival) => (
            <div key={rival.id} style={{
              borderRadius: '10px', padding: '10px 11px',
              border: rival.intensity === 'peak' ? '1px solid rgba(212,168,67,0.28)' : rival.intensity === 'heated' ? '1px solid rgba(248,113,113,0.22)' : '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{rival.name}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.55)', marginTop: '1px' }}>{rival.title}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: SUCCESS, lineHeight: 1 }}>{rival.wins}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '8px', color: 'rgba(169,211,231,0.45)', fontWeight: 700 }}>W</div>
                    </div>
                    <div style={{ color: 'rgba(129,236,255,0.3)', fontFamily: "'Bebas Neue', sans-serif" }}>-</div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: ALERT, lineHeight: 1 }}>{rival.losses}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '8px', color: 'rgba(169,211,231,0.45)', fontWeight: 700 }}>L</div>
                    </div>
                  </div>
                </div>
              </div>
              {rival.lastResult && (
                <div style={{ marginTop: '5px', fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: rival.lastResult === 'won' ? SUCCESS : ALERT }}>
                  Last meet: {rival.lastResult === 'won' ? '✓ Beat them' : '✗ Lost to them'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active sponsors */}
      {athleteState.sponsors.filter((s) => s.status === 'active' || s.status === 'offered').length > 0 && (
        <div style={{ ...panelStyle, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <StarIcon size={13} color={GOLD} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Sponsors</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {athleteState.sponsors.filter((s) => s.status === 'active' || s.status === 'offered').map((sp) => (
              <div key={sp.id} style={{
                borderRadius: '10px', padding: '9px 11px',
                border: sp.status === 'offered' ? '1px solid rgba(212,168,67,0.30)' : '1px solid rgba(54,198,144,0.20)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
              }}>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{sp.brand}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.58)', marginTop: '2px' }}>{sp.condition}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: sp.status === 'offered' ? GOLD : SUCCESS }}>{sp.valueCoins.toLocaleString()}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '8px', color: 'rgba(169,211,231,0.45)', textTransform: 'uppercase' }}>
                    {sp.status === 'offered' ? 'OFFERED' : `${sp.weeksLeft}w left`}
                  </div>
                </div>
                {sp.status === 'offered' && (
                  <button style={{
                    padding: '6px 10px', borderRadius: '8px', cursor: 'pointer',
                    background: GOLD, border: 'none',
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', color: '#0A1628', letterSpacing: '0.06em',
                  }}>ACCEPT</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Race chain */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <CalendarIcon size={13} color={GOLD} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Race Calendar</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {PLAYER_CAREER_EVENTS.slice(0, 6).map((event, index) => {
            const isDone = index < athleteState.currentEventIdx
            const isCurrent = index === athleteState.currentEventIdx
            const isLocked = index > athleteState.currentEventIdx
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: '9px',
                  border: isCurrent ? '1px solid rgba(212,168,67,0.30)' : isDone ? '1px solid rgba(54,198,144,0.16)' : '1px solid rgba(255,255,255,0.04)',
                  background: isCurrent ? 'rgba(212,168,67,0.07)' : 'rgba(255,255,255,0.02)',
                  opacity: isLocked ? 0.55 : 1,
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  {isDone ? <CheckCircle2Icon size={14} color={SUCCESS} /> : isCurrent ? <ZapIcon size={14} color={GOLD} /> : <LockIcon size={13} color="rgba(169,211,231,0.25)" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '11px', color: isCurrent ? '#F3FBFF' : isDone ? SUCCESS : 'rgba(169,211,231,0.55)' }}>{event.name}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.45)', marginTop: '1px' }}>{event.distance}m · Tier {event.tier}</div>
                </div>
                {isCurrent && (
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: GOLD, letterSpacing: '0.08em', flexShrink: 0 }}>NEXT</span>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <PaneSwitcher
      panes={[
        {
          id: 'ladder',
          label: 'LADDER',
          icon: <WavesIcon size={12} />,
          content: <div style={{ position: 'absolute', inset: 0, padding: '10px', overflowY: 'auto' }}>{ladderPane}</div>,
        },
        {
          id: 'grind',
          label: 'GRIND',
          icon: <FlameIcon size={12} />,
          content: <div style={{ position: 'absolute', inset: 0, padding: '10px', overflowY: 'auto' }}>{grindPane}</div>,
        },
      ]}
    >
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        style={{
          position: 'absolute', inset: 0,
          display: 'grid', gridTemplateColumns: '300px 1fr',
          gap: '10px', padding: '10px', minHeight: 0, overflow: 'hidden',
        }}
      >
        <div style={{ overflowY: 'auto' }}>{ladderPane}</div>
        <div style={{ overflowY: 'auto' }}>{grindPane}</div>
      </motion.div>
    </PaneSwitcher>
  )
}

function StatChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '4px 8px', borderRadius: '999px',
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(0,0,0,0.25)',
    }}>
      {icon}
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.75)', fontWeight: 700 }}>{label}</span>
    </div>
  )
}
