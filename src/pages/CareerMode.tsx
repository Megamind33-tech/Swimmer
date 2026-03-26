import React, { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  ActivityIcon,
  BadgeCheckIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CircleIcon,
  FlameIcon,
  GaugeIcon,
  LockIcon,
  StarIcon,
  SwordsIcon,
  TimerIcon,
  TrophyIcon,
  UserIcon,
  WavesIcon,
  ZapIcon,
} from 'lucide-react'
import { PaneSwitcher } from '../ui/PaneSwitcher'
import { useTrainingEngineState } from '../hooks/useTrainingEngineState'
import {
  PLAYER_CAREER_EVENTS,
  PLAYER_CAREER_STAGES,
  PLAYER_SEASON_OBJECTIVES,
  PLAYER_WEEKLY_FOCUS,
} from '../utils/careerModeData'
import { TRAINING_CYCLE_PHASES } from '../utils/trainingEngineData'
import { useAthleteCareer } from '../context/CareerSaveContext'
import athletePortrait from '../designs/custom_models/athlete-01.png'
import poolBackdrop from '../designs/championship-pool-bg.jpg'

const AQUA = '#18C8F0'
const VOLT = '#C8FF00'
const GOLD = '#FFB800'
const SUCCESS = '#36C690'
const ALERT = '#FF5A5F'

const FORM_COLOR: Record<string, string> = {
  peak: GOLD,
  hot: SUCCESS,
  normal: AQUA,
  cold: ALERT,
}

const PERSONAL_BESTS: Record<string, string> = {
  '50M FREE': '22.41',
  '100M FREE': '48.94',
  '200M FREE': '1:47.82',
}

export function CareerMode() {
  const { state: athleteState, dispatch: athleteDispatch } = useAthleteCareer()
  const [selectedFocus, setSelectedFocus] = useState(athleteState.trainingFocusId ?? PLAYER_WEEKLY_FOCUS[0]?.id ?? '')
  const [focusConfirmed, setFocusConfirmed] = useState(false)
  const { cyclePhase, setCyclePhaseId, selectedDrill, sessionActive } = useTrainingEngineState()

  const activeFocus = useMemo(
    () => PLAYER_WEEKLY_FOCUS.find((focus) => focus.id === selectedFocus) ?? PLAYER_WEEKLY_FOCUS[0],
    [selectedFocus],
  )

  const nextEvent = PLAYER_CAREER_EVENTS[athleteState.currentEventIdx] ?? PLAYER_CAREER_EVENTS[0]
  const formColor = FORM_COLOR[athleteState.form] ?? AQUA

  const stagesWithStatus = useMemo(() => {
    const stageOrder = PLAYER_CAREER_STAGES.map((stage) => stage.id)
    const currentIdx = stageOrder.indexOf(athleteState.careerStageId)
    return PLAYER_CAREER_STAGES.map((stage, idx) => ({
      ...stage,
      status: idx < currentIdx ? 'completed' as const : idx === currentIdx ? 'current' as const : 'locked' as const,
    }))
  }, [athleteState.careerStageId])

  const currentStage = stagesWithStatus.find((stage) => stage.status === 'current') ?? stagesWithStatus[0]
  const completedCount = stagesWithStatus.filter((stage) => stage.status === 'completed').length
  const stageProgress = Math.round(((completedCount + 0.65) / stagesWithStatus.length) * 100)

  const statsRow = [
    { label: 'SPD', value: athleteState.speed },
    { label: 'STM', value: athleteState.stamina },
    { label: 'TEC', value: athleteState.technique },
    { label: 'MNT', value: athleteState.mental },
    { label: 'TRN', value: athleteState.turns },
  ]

  const rivals = athleteState.rivals.slice(0, 3)
  const sponsorCards = athleteState.sponsors.filter((sponsor) => sponsor.status === 'active' || sponsor.status === 'offered').slice(0, 3)
  const raceCalendar = PLAYER_CAREER_EVENTS.slice(0, 6)

  const overviewPane = (
    <div className="swim26-column-stack">
      <section className="swim26-card swim26-card--aqua swim26-card--hero">
        <div className="swim26-card-content swim26-stack-sm">
          <div className="swim26-hero-grid">
            <div className="swim26-img-container portrait swim26-athlete-frame">
              <img src={athletePortrait} alt="Career athlete portrait" />
              <div className="img-overlay-bottom" />
              <div className="img-text-content">
                <div className="swim26-overline">ATHLETE CAREER</div>
                <div className="swim26-hero-title">YOUR ATHLETE</div>
                <div className="swim26-meta-line">
                  <span style={{ color: formColor }}>{athleteState.form.toUpperCase()} FORM</span>
                  <span>WEEK {athleteState.currentWeek}/{athleteState.totalWeeks}</span>
                </div>
              </div>
            </div>

            <div className="swim26-stack-sm">
              <div className="swim26-inline-split">
                <div>
                  <div className="swim26-overline">LEVEL</div>
                  <div className="swim26-hero-value" style={{ color: GOLD }}>{Math.floor(athleteState.xp / 500) + 1}</div>
                </div>
                <div className="swim26-chip-group">
                  <StatChip label="READINESS" value={`${athleteState.readiness}%`} accent={athleteState.readiness >= 80 ? SUCCESS : GOLD} />
                  <StatChip label="TRUST" value={`${athleteState.coachTrust}`} accent={AQUA} />
                </div>
              </div>

              <div className="swim26-progress-block">
                <div className="swim26-inline-split swim26-overline-row">
                  <span>XP TO NEXT LEVEL</span>
                  <span>{athleteState.xp % 500}/500</span>
                </div>
                <Meter value={athleteState.xp % 500} max={500} accent={GOLD} />
              </div>

              <div className="swim26-mini-stat-grid swim26-mini-stat-grid--five">
                {statsRow.map((stat) => (
                  <div key={stat.label} className="swim26-mini-stat">
                    <div className="swim26-mini-stat__value" style={{ color: stat.value >= 80 ? SUCCESS : stat.value >= 65 ? AQUA : '#9EB2C7' }}>{stat.value}</div>
                    <div className="swim26-mini-stat__label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <span className="card-ghost-num">{Math.floor(athleteState.xp / 500) + 1}</span>
      </section>

      <section className="swim26-card swim26-card--gold">
        <div className="swim26-card-content swim26-stack-sm">
          <div className="swim26-section-head">
            <div>
              <div className="swim26-overline">CAREER PATH</div>
              <div className="swim26-card-title">{currentStage.name}</div>
            </div>
            <div className="swim26-value-stack">
              <span className="swim26-hero-value-sm" style={{ color: GOLD }}>{stageProgress}%</span>
              <span className="swim26-muted-label">LADDER</span>
            </div>
          </div>

          <div className="swim26-copy-strip">
            <div>
              <span className="swim26-muted-label">PRESSURE</span>
              <p>{currentStage.pressure}</p>
            </div>
            <div>
              <span className="swim26-muted-label">FOCUS</span>
              <p>{currentStage.focus}</p>
            </div>
          </div>

          <div className="swim26-list-stack">
            {stagesWithStatus.map((stage) => {
              const tone = stage.status === 'current' ? GOLD : stage.status === 'completed' ? SUCCESS : '#71859C'
              return (
                <div key={stage.id} className="swim26-list-row">
                  <div className="swim26-list-row__icon">
                    {stage.status === 'completed' ? <CheckCircle2Icon size={14} color={SUCCESS} /> : stage.status === 'current' ? <FlameIcon size={14} color={GOLD} /> : <LockIcon size={13} color="#71859C" />}
                  </div>
                  <div className="swim26-list-row__body">
                    <div className="swim26-list-row__title" style={{ color: tone }}>{stage.name}</div>
                    <div className="swim26-list-row__meta">{stage.tierLabel} · {stage.growthReward}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="swim26-card swim26-card--aqua">
        <div className="swim26-card-content swim26-stack-sm">
          <div className="swim26-section-head">
            <div>
              <div className="swim26-overline">PERSONAL BESTS</div>
              <div className="swim26-card-title">PB BOARD</div>
            </div>
            <TimerIcon size={16} color={AQUA} />
          </div>
          <div className="swim26-list-stack">
            {Object.entries(PERSONAL_BESTS).map(([event, time]) => (
              <div key={event} className="swim26-split-row">
                <span>{event}</span>
                <strong>{time}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )

  const racePane = (
    <div className="swim26-column-stack">
      {nextEvent && (
        <section className="race-card swim26-race-card card-with-cta">
          <div className="swim26-img-container landscape env swim26-race-art">
            <img src={poolBackdrop} alt="Championship pool backdrop" />
            <div className="img-overlay-full" />
          </div>
          <span className="race-card-ghost">{nextEvent.distance}</span>
          <div className="race-card-content swim26-stack-sm">
            <div>
              <div className="swim26-overline">NEXT RACE</div>
              <div className="swim26-card-title swim26-card-title--lg">{nextEvent.distance}M {nextEvent.stroke}</div>
              <div className="swim26-meta-line swim26-meta-line--nowrap">
                <span>WEEK {athleteState.currentWeek}</span>
                <span>HEAT 1</span>
                <span>LANE 4</span>
                <span>TIER {nextEvent.tier}</span>
              </div>
            </div>

            <div className="swim26-race-middle">
              <div className="swim26-race-pb">
                <div className="swim26-overline">PLAYER PB</div>
                <div className="swim26-hero-value" style={{ color: GOLD }}>{PERSONAL_BESTS['100M FREE'] ?? '48.94'}</div>
                <div className="swim26-muted-line">Readiness {athleteState.readiness}% · Momentum {athleteState.momentum >= 0 ? '+' : ''}{athleteState.momentum}</div>
              </div>
              <div className="swim26-list-stack">
                {rivals.map((rival) => (
                  <div key={rival.id} className="rival-row">
                    <span className="rival-name">{rival.name}</span>
                    <span className="rival-time">{49 + rival.losses}.{(30 + rival.wins * 2).toString().padStart(2, '0')}</span>
                  </div>
                ))}
              </div>
              <div className="swim26-readiness-strip">
                <StatusPill label={cyclePhase.name.toUpperCase()} accent={AQUA} />
                <StatusPill label={selectedDrill?.label ?? 'PACE SET'} accent={VOLT} />
                <StatusPill label={sessionActive ? 'SESSION LIVE' : 'READY'} accent={sessionActive ? ALERT : SUCCESS} />
              </div>
            </div>
          </div>
          <div className="race-card-cta cta-band">
            <button className="swim26-btn swim26-btn-primary primary-cta">RACE NOW</button>
          </div>
        </section>
      )}

      <div className="swim26-card-grid">
        <section className="swim26-card swim26-card--gold">
          <div className="swim26-card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">SEASON TARGETS</div>
                <div className="swim26-card-title">OBJECTIVES</div>
              </div>
              <TrophyIcon size={16} color={GOLD} />
            </div>
            <div className="swim26-list-stack">
              {PLAYER_SEASON_OBJECTIVES.map((objective) => (
                <div key={objective.id} className="swim26-goal-block">
                  <div className="swim26-goal-row">
                    <span className="swim26-goal-title">{objective.title}</span>
                    <span className="swim26-goal-reward">{objective.reward}</span>
                  </div>
                  <div className="swim26-muted-line">{objective.targetLabel}</div>
                  <Meter value={objective.progress} max={100} accent={objective.progress >= 100 ? SUCCESS : GOLD} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="swim26-card swim26-card--aqua">
          <div className="swim26-card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">TRAINING PHILOSOPHY</div>
                <div className="swim26-card-title">THIS WEEK</div>
              </div>
              <GaugeIcon size={16} color={AQUA} />
            </div>

            <div className="swim26-choice-stack">
              {PLAYER_WEEKLY_FOCUS.map((focus) => {
                const active = focus.id === activeFocus.id
                return (
                  <button
                    key={focus.id}
                    type="button"
                    className={`swim26-choice-card ${active ? 'is-active' : ''}`}
                    onClick={() => {
                      setSelectedFocus(focus.id)
                      setFocusConfirmed(false)
                      athleteDispatch({ type: 'ATHLETE_SET_TRAINING_FOCUS', focusId: focus.id as any })
                    }}
                  >
                    <div className="swim26-choice-header">
                      <span>{focus.title}</span>
                      {active ? <BadgeCheckIcon size={14} color={AQUA} /> : <CircleIcon size={12} color="#71859C" />}
                    </div>
                    <div className="swim26-choice-meta">{focus.gain} · {focus.risk}</div>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="cta-band">
            <button
              className={`swim26-btn ${focusConfirmed ? 'swim26-btn-secondary' : 'swim26-btn-primary'} primary-cta`}
              onClick={() => setFocusConfirmed(true)}
              disabled={focusConfirmed}
            >
              {focusConfirmed ? 'FOCUS LOCKED' : 'CONFIRM FOCUS'}
            </button>
          </div>
        </section>

        <section className="swim26-card swim26-card--danger">
          <div className="swim26-card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">RIVAL PRESSURE</div>
                <div className="swim26-card-title">LANE THREATS</div>
              </div>
              <SwordsIcon size={16} color={ALERT} />
            </div>
            <div className="swim26-list-stack">
              {athleteState.rivals.map((rival) => (
                <div key={rival.id} className="swim26-versus-row">
                  <div>
                    <div className="swim26-list-row__title">{rival.name}</div>
                    <div className="swim26-list-row__meta">{rival.title}</div>
                  </div>
                  <div className="swim26-versus-score">
                    <span>{rival.wins}</span>
                    <span>-</span>
                    <span>{rival.losses}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="swim26-card swim26-card--gold">
          <div className="swim26-card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">SPONSOR TRACK</div>
                <div className="swim26-card-title">ACTIVE DEALS</div>
              </div>
              <StarIcon size={16} color={GOLD} />
            </div>
            <div className="swim26-list-stack">
              {sponsorCards.map((sponsor) => (
                <div key={sponsor.id} className="swim26-goal-block">
                  <div className="swim26-goal-row">
                    <span className="swim26-goal-title">{sponsor.brand}</span>
                    <span className="swim26-goal-reward">{sponsor.valueCoins.toLocaleString()}</span>
                  </div>
                  <div className="swim26-muted-line">{sponsor.condition}</div>
                  <Meter value={sponsor.conditionProgress} max={100} accent={sponsor.status === 'offered' ? GOLD : SUCCESS} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="swim26-card swim26-card--neutral">
        <div className="swim26-card-content swim26-stack-sm">
          <div className="swim26-section-head">
            <div>
              <div className="swim26-overline">RACE CALENDAR</div>
              <div className="swim26-card-title">QUALIFYING CHAIN</div>
            </div>
            <CalendarIcon size={16} color={AQUA} />
          </div>
          <div className="swim26-calendar-grid">
            {raceCalendar.map((event, index) => {
              const done = index < athleteState.currentEventIdx
              const isCurrent = index === athleteState.currentEventIdx
              return (
                <div key={event.id} className={`swim26-calendar-card ${isCurrent ? 'is-current' : ''} ${done ? 'is-done' : ''}`}>
                  <div className="swim26-calendar-top">
                    {done ? <CheckCircle2Icon size={14} color={SUCCESS} /> : isCurrent ? <ZapIcon size={14} color={GOLD} /> : <LockIcon size={13} color="#71859C" />}
                    <span>W{athleteState.currentWeek + index}</span>
                  </div>
                  <div className="swim26-list-row__title">{event.name}</div>
                  <div className="swim26-list-row__meta">{event.distance}M · TIER {event.tier}</div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="cta-band">
          <button className="swim26-btn swim26-btn-ghost">ENTER HEAT</button>
        </div>
      </section>

      <section className="swim26-card swim26-card--aqua">
        <div className="swim26-card-content swim26-stack-sm">
          <div className="swim26-section-head">
            <div>
              <div className="swim26-overline">TRAINING BLOCK</div>
              <div className="swim26-card-title">CYCLE PHASES</div>
            </div>
            <ActivityIcon size={16} color={AQUA} />
          </div>
          <div className="swim26-card-grid swim26-card-grid--compact">
            {TRAINING_CYCLE_PHASES.map((phase) => {
              const active = phase.id === cyclePhase.id
              return (
                <button
                  key={phase.id}
                  type="button"
                  className={`swim26-phase-card ${active ? 'is-active' : ''}`}
                  onClick={() => setCyclePhaseId(phase.id)}
                >
                  <div className="swim26-phase-card__title">{phase.name}</div>
                  <div className="swim26-phase-card__meta">{phase.load}</div>
                  <div className="swim26-phase-card__copy">{phase.focus}</div>
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )

  return (
    <PaneSwitcher
      panes={[
        {
          id: 'overview',
          label: 'LADDER',
          icon: <WavesIcon size={12} />,
          content: <div className="swim26-pane-scroll">{overviewPane}</div>,
        },
        {
          id: 'race',
          label: 'GRIND',
          icon: <FlameIcon size={12} />,
          content: <div className="swim26-pane-scroll">{racePane}</div>,
        },
      ]}
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="swim26-page-shell"
      >
        <div className="swim26-pane-scroll">{overviewPane}</div>
        <div className="swim26-pane-scroll">{racePane}</div>
      </motion.div>
    </PaneSwitcher>
  )
}

function Meter({ value, max, accent }: { value: number; max: number; accent: string }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)))
  return (
    <div className="swim26-meter">
      <div className="swim26-meter__fill" style={{ width: `${pct}%`, background: accent }} />
    </div>
  )
}

function StatChip({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="swim26-stat-chip">
      <span className="swim26-stat-chip__label">{label}</span>
      <strong className="swim26-stat-chip__value" style={{ color: accent }}>{value}</strong>
    </div>
  )
}

function StatusPill({ label, accent }: { label: string; accent: string }) {
  return <span className="swim26-status-pill" style={{ borderColor: `${accent}66`, color: accent }}>{label}</span>
}
