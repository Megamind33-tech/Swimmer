import React, { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  ActivityIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
  CalendarIcon,
  CrownIcon,
  FlameIcon,
  GaugeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SwordsIcon,
  TrophyIcon,
  WavesIcon,
  ZapIcon,
} from 'lucide-react'
import { PaneSwitcher, useIsLandscapeMobile } from '../ui/PaneSwitcher'
import { ProgressBar } from '../components/ProgressBar'
import { useTrainingEngineState } from '../hooks/useTrainingEngineState'
import { SponsorPanel } from './ProfilePage'
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
const PANEL = 'rgba(4,20,33,0.76)'
const PANEL_BORDER = 'rgba(56,214,255,0.13)'

const panelStyle: React.CSSProperties = {
  borderRadius: '14px',
  border: `1px solid ${PANEL_BORDER}`,
  background: PANEL,
  backdropFilter: 'blur(12px)',
}

export function CareerMode() {
  const isLandscape = useIsLandscapeMobile()
  const { state: athleteState, dispatch: athleteDispatch } = useAthleteCareer()
  const [selectedFocus, setSelectedFocus] = useState(athleteState.trainingFocusId ?? PLAYER_WEEKLY_FOCUS[0]?.id ?? '')
  const { selectedDrill, cyclePhase, setCyclePhaseId, sessionActive } = useTrainingEngineState()

  const activeFocus = useMemo(
    () => PLAYER_WEEKLY_FOCUS.find((focus) => focus.id === selectedFocus) ?? PLAYER_WEEKLY_FOCUS[0],
    [selectedFocus],
  )

  // Derive career stages status from live state
  const stagesWithStatus = useMemo(() => {
    const stageOrder = PLAYER_CAREER_STAGES.map((s) => s.id)
    const currentIdx = stageOrder.indexOf(athleteState.careerStageId)
    return PLAYER_CAREER_STAGES.map((stage, idx) => ({
      ...stage,
      status: idx < currentIdx ? 'completed' as const : idx === currentIdx ? 'current' as const : 'locked' as const,
    }))
  }, [athleteState.careerStageId])

  // Derive live career metrics from athlete state
  const liveCareerMetrics = useMemo(() => [
    { label: 'Readiness', value: `${athleteState.readiness}%`, accent: '#36C690', hint: athleteState.readiness >= 80 ? 'Peak lane-feel window.' : 'Build up before your next race.' },
    { label: 'Coach Trust', value: `${athleteState.coachTrust}`, accent: '#81ECFF', hint: athleteState.coachTrust >= 80 ? 'Unlocks tactical freedom and first-choice event selection.' : 'Complete training sessions to build trust.' },
    { label: 'Momentum', value: athleteState.momentum >= 0 ? `+${athleteState.momentum}` : `${athleteState.momentum}`, accent: athleteState.momentum >= 0 ? '#D4A843' : '#F87171', hint: athleteState.momentum > 10 ? 'Positive streak amplifying performance.' : athleteState.momentum < 0 ? 'Negative run — refocus on recovery.' : 'Stable form baseline.' },
    { label: 'Reputation', value: `${athleteState.reputation}`, accent: '#D4A843', hint: 'Federation and media visibility score.' },
  ], [athleteState])

  const currentStageIndex = stagesWithStatus.findIndex((stage) => stage.status === 'current')
  const completedStages = stagesWithStatus.filter((stage) => stage.status === 'completed').length
  const stageProgress = Math.round(((completedStages + 0.65) / stagesWithStatus.length) * 100)

  const leftColumn = (
    <div style={{ width: '250px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div
        style={{
          ...panelStyle,
          padding: isLandscape ? '10px 12px' : '14px 16px',
          background: 'linear-gradient(145deg, rgba(18,45,68,0.98) 0%, rgba(7,18,28,0.92) 100%)',
          border: '1px solid rgba(129,236,255,0.18)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
          <div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(129,236,255,0.72)', fontWeight: 800 }}>
              Player Career
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isLandscape ? '24px' : '30px', letterSpacing: '0.04em', color: '#F3FBFF', lineHeight: 1, marginTop: '4px' }}>
              Growth Is The Game
            </div>
          </div>
          <div style={{ minWidth: '58px', textAlign: 'right' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', color: GOLD, lineHeight: 1 }}>{Math.floor(athleteState.xp / 500) + 1}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(212,168,67,0.72)', fontWeight: 700 }}>Level</div>
          </div>
        </div>

        <div style={{ marginTop: isLandscape ? '10px' : '12px' }}>
          <ProgressBar progress={athleteState.xp % 500} max={500} color="bg-[#0D7C66]" showLabel />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', marginTop: isLandscape ? '10px' : '12px' }}>
          {liveCareerMetrics.map((metric) => (
            <div key={metric.label} style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '9px 10px' }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(169,211,231,0.55)' }}>{metric.label}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', lineHeight: 1, color: metric.accent, marginTop: '4px' }}>{metric.value}</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', lineHeight: 1.35, color: 'rgba(169,211,231,0.62)', marginTop: '4px' }}>{metric.hint}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexShrink: 0 }}>
          <WavesIcon size={13} color={AQUA} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Career Ladder</span>
          <span style={{ marginLeft: 'auto', fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: GOLD, fontWeight: 700 }}>{stageProgress}% COMPLETE</span>
        </div>
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '7px', paddingRight: '2px' }}>
          {stagesWithStatus.map((stage) => {
            const isCurrent = stage.status === 'current'
            const isDone = stage.status === 'completed'
            return (
              <div
                key={stage.id}
                style={{
                  borderRadius: '10px',
                  border: isCurrent
                    ? '1px solid rgba(212,168,67,0.34)'
                    : isDone
                      ? '1px solid rgba(54,198,144,0.28)'
                      : `1px solid ${PANEL_BORDER}`,
                  background: isCurrent
                    ? 'linear-gradient(135deg, rgba(212,168,67,0.14) 0%, rgba(255,255,255,0.03) 100%)'
                    : isDone
                      ? 'rgba(54,198,144,0.06)'
                      : 'rgba(255,255,255,0.03)',
                  padding: '9px 10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isCurrent ? 'rgba(212,168,67,0.18)' : isDone ? 'rgba(54,198,144,0.14)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', color: isCurrent ? GOLD : isDone ? SUCCESS : 'rgba(255,255,255,0.38)' }}>{stage.order}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{stage.name}</span>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '9px', letterSpacing: '0.12em', color: isCurrent ? GOLD : isDone ? SUCCESS : 'rgba(169,211,231,0.35)' }}>{stage.tierLabel.toUpperCase()}</span>
                    </div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', lineHeight: 1.35, color: 'rgba(169,211,231,0.60)', marginTop: '3px' }}>{stage.summary}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gap: '4px', marginTop: '8px' }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: AQUA }}><strong style={{ color: '#F3FBFF' }}>Pressure:</strong> {stage.pressure}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.68)' }}><strong style={{ color: '#F3FBFF' }}>Growth reward:</strong> {stage.growthReward}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const rightColumn = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
      <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '10px', color: GOLD, textTransform: 'uppercase', letterSpacing: '0.16em' }}>Current pressure zone</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isLandscape ? '22px' : '28px', letterSpacing: '0.04em', color: '#F3FBFF', lineHeight: 1 }}>Regional Age-Group Beast Run</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', lineHeight: 1.45, color: 'rgba(169,211,231,0.72)', marginTop: '6px', maxWidth: '760px' }}>
              This is not a bland ladder anymore: every week now asks you to peak intelligently, protect readiness, and convert momentum into selection leverage.
            </div>
          </div>
          <div style={{ display: 'grid', gap: '6px', minWidth: isLandscape ? '160px' : '210px' }}>
            <div style={{ borderRadius: '10px', border: '1px solid rgba(212,168,67,0.24)', background: 'rgba(212,168,67,0.08)', padding: '8px 10px' }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(212,168,67,0.72)', fontWeight: 800 }}>Current stage</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: GOLD, lineHeight: 1, marginTop: '2px' }}>{stagesWithStatus[currentStageIndex]?.name ?? 'Regional Age-Group'}</div>
            </div>
            <div style={{ borderRadius: '10px', border: '1px solid rgba(54,198,144,0.22)', background: 'rgba(54,198,144,0.06)', padding: '8px 10px' }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(54,198,144,0.80)', fontWeight: 800 }}>Growth trigger</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: '#F3FBFF', lineHeight: 1.4, marginTop: '3px' }}>Hit the B cut and win the relay-anchor vote.</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '10px', minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0, minHeight: 0 }}>
          <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <GaugeIcon size={13} color={AQUA} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Weekly Growth Focus</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isLandscape ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
              {PLAYER_WEEKLY_FOCUS.map((focus) => {
                const active = focus.id === activeFocus.id
                return (
                  <button
                    key={focus.id}
                    onClick={() => { setSelectedFocus(focus.id); athleteDispatch({ type: 'ATHLETE_SET_TRAINING_FOCUS', focusId: focus.id as any }) }}
                    style={{
                      textAlign: 'left',
                      borderRadius: '10px',
                      border: active ? '1px solid rgba(129,236,255,0.36)' : '1px solid rgba(255,255,255,0.07)',
                      background: active ? 'linear-gradient(135deg, rgba(129,236,255,0.12) 0%, rgba(255,255,255,0.04) 100%)' : 'rgba(255,255,255,0.03)',
                      padding: '10px 11px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{focus.title}</div>
                      {active && <BadgeCheckIcon size={14} color={AQUA} />}
                    </div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', lineHeight: 1.35, color: 'rgba(169,211,231,0.66)', marginTop: '5px' }}>{focus.effect}</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', letterSpacing: '0.10em', color: SUCCESS, marginTop: '8px' }}>{focus.gain.toUpperCase()}</div>
                  </button>
                )
              })}
            </div>

            <div style={{ marginTop: '10px', borderRadius: '10px', border: '1px solid rgba(248,113,113,0.20)', background: 'rgba(248,113,113,0.05)', padding: '10px 11px', display: 'grid', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FlameIcon size={13} color={ALERT} />
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '11px', color: '#F3FBFF' }}>Chosen risk profile</span>
              </div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.74)' }}>{activeFocus.risk}</div>
            </div>

            <div style={{ marginTop: '10px', borderRadius: '10px', border: '1px solid rgba(56,214,255,0.18)', background: 'rgba(56,214,255,0.05)', padding: '10px 11px', display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '11px', color: '#F3FBFF' }}>Training Engine Sync</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: AQUA, marginTop: '2px' }}>{selectedDrill.label} · {cyclePhase.name}</div>
                </div>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: sessionActive ? SUCCESS : GOLD, letterSpacing: '0.10em' }}>{sessionActive ? 'SESSION LIVE' : 'PLAN READY'}</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {TRAINING_CYCLE_PHASES.map((phase) => {
                  const active = phase.id === cyclePhase.id
                  return (
                    <button key={phase.id} onClick={() => setCyclePhaseId(phase.id)} style={{ padding: '5px 8px', minHeight: '34px', borderRadius: '8px', cursor: 'pointer', background: active ? 'rgba(56,214,255,0.12)' : 'rgba(255,255,255,0.03)', border: active ? '1px solid rgba(56,214,255,0.28)' : '1px solid rgba(255,255,255,0.06)', fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: active ? AQUA : 'rgba(169,211,231,0.50)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {phase.name}
                    </button>
                  )
                })}
              </div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.68)' }}>{cyclePhase.focus}</div>
            </div>
          </div>

          <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <CalendarIcon size={13} color={GOLD} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Pressure Meet Chain</span>
            </div>
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '7px', paddingRight: '2px' }}>
              {PLAYER_CAREER_EVENTS.map((event, index) => {
                const isCurrent = index === 3
                const isUnlocked = index <= 4
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    style={{
                      borderRadius: '10px',
                      border: isCurrent ? '1px solid rgba(212,168,67,0.32)' : isUnlocked ? '1px solid rgba(129,236,255,0.16)' : '1px solid rgba(255,255,255,0.06)',
                      background: isCurrent ? 'linear-gradient(135deg, rgba(212,168,67,0.12) 0%, rgba(255,255,255,0.03) 100%)' : isUnlocked ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)',
                      padding: '10px 11px',
                      opacity: isUnlocked ? 1 : 0.58,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{event.name}</span>
                          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '9px', color: isCurrent ? GOLD : AQUA, letterSpacing: '0.10em' }}>TIER {event.tier}</span>
                        </div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', lineHeight: 1.35, color: 'rgba(169,211,231,0.66)', marginTop: '4px' }}>{event.description}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF' }}>{event.distance}M</div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: GOLD, fontWeight: 700 }}>XP {event.rewards.xp}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '7px', marginTop: '8px' }}>
                      <MiniPill icon={<ZapIcon size={11} color={SUCCESS} />} label={`Diff ${event.difficulty}/10`} />
                      <MiniPill icon={<ShieldCheckIcon size={11} color={AQUA} />} label={`${event.opponents.length} rivals`} />
                      <MiniPill icon={<ArrowRightIcon size={11} color={GOLD} />} label={isCurrent ? 'Current gate' : isUnlocked ? 'Unlocked' : 'Locked'} />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0, minHeight: 0 }}>
          <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <TrophyIcon size={13} color={GOLD} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Cardinal Growth Objectives</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PLAYER_SEASON_OBJECTIVES.map((objective) => (
                <div key={objective.id} style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '10px 11px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{objective.title}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.64)', marginTop: '4px' }}>{objective.targetLabel}</div>
                    </div>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', color: GOLD, letterSpacing: '0.08em' }}>{objective.reward}</span>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <ProgressBar progress={objective.progress} max={100} color="bg-[#D4A843]" showLabel />
                  </div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: AQUA, marginTop: '5px' }}>{objective.pressure}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <SwordsIcon size={13} color={ALERT} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Rivals & Story Pressure</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {athleteState.rivals.map((rival) => (
                <div key={rival.id} style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '10px 11px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{rival.name}</div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', letterSpacing: '0.10em', color: rival.intensity === 'peak' ? GOLD : rival.intensity === 'heated' ? ALERT : AQUA }}>{rival.title.toUpperCase()}</div>
                    </div>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{rival.intensity}</span>
                  </div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.68)', lineHeight: 1.4, marginTop: '5px' }}>{rival.taunt ?? `W${rival.wins} / L${rival.losses}`}</div>
                </div>
              ))}
            </div>
          </div>

          <SponsorPanel
            sponsors={athleteState.sponsors.filter(s => s.status === 'active' || s.status === 'offered').map(s => ({
              id: s.id,
              name: s.brand,
              logo: '🤝',
              tier: s.valueCoins >= 10000 ? 'Title' as const : s.valueCoins >= 6000 ? 'Gold' as const : 'Silver' as const,
              value: `${s.valueCoins.toLocaleString()} coins`,
              category: s.status === 'offered' ? 'Pending offer' : 'Active',
              bonus: s.condition,
            }))}
            title="PLAYER CAREER SPONSORS"
            compact
          />

          <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <CrownIcon size={13} color={GOLD} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Why this career feels addictive now</span>
            </div>
            <div style={{ display: 'grid', gap: '6px' }}>
              {[
                'Every meet advances at least one long-loop axis: cuts, rankings, rivalry, trust, or sponsorship.',
                'Failure no longer kills momentum — it reroutes you into last-chance qualifiers, relay races, and revenge arcs.',
                'Growth is visible every week through readiness, trust, momentum, and stage progression rather than only raw XP.',
              ].map((line) => (
                <div key={line} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                  <SparklesIcon size={12} color={SUCCESS} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.70)', lineHeight: 1.45 }}>{line}</div>
                </div>
              ))}
            </div>
          </div>
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
          icon: <ActivityIcon size={12} />,
          content: <div style={{ position: 'absolute', inset: 0, padding: '8px', overflowY: 'auto' }}>{leftColumn}</div>,
        },
        {
          id: 'grind',
          label: 'GRIND',
          icon: <FlameIcon size={12} />,
          content: <div style={{ position: 'absolute', inset: 0, padding: '8px', overflowY: 'auto' }}>{rightColumn}</div>,
        },
      ]}
    >
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', gap: '10px', padding: '10px', minHeight: 0 }}
      >
        {leftColumn}
        {rightColumn}
      </motion.div>
    </PaneSwitcher>
  )
}

function MiniPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ borderRadius: '999px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.20)', padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
      {icon}
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.70)', fontWeight: 700 }}>{label}</span>
    </div>
  )
}
