import React, { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowUpIcon,
  BadgeDollarSignIcon,
  Building2Icon,
  CheckCircle2Icon,
  CrownIcon,
  DumbbellIcon,
  FlameIcon,
  HandshakeIcon,
  ShieldIcon,
  TargetIcon,
  TrendingUpIcon,
  UserPlusIcon,
  Users2Icon,
  WavesIcon,
  ZapIcon,
} from 'lucide-react'
import { PaneSwitcher } from '../ui/PaneSwitcher'
import { useTrainingEngineState } from '../hooks/useTrainingEngineState'
import { CLUB_PHILOSOPHIES, CLUB_PROJECTS } from '../utils/careerModeData'
import { CLUB_TRAINING_GROUPS } from '../utils/trainingEngineData'
import { useClubCareer } from '../context/CareerSaveContext'
import { CLUB_SPONSORS, USER_DATA } from '../utils/gameData'
import poolBackdrop from '../designs/championship-pool-bg.jpg'
import athletePortrait from '../designs/custom_models/athlete-06.png'

const AQUA = '#18C8F0'
const VOLT = '#C8FF00'
const GOLD = '#FFB800'
const GREEN = '#3FE098'
const SUCCESS = '#36C690'
const ALERT = '#FF5A5F'

const BOARD_TARGETS = [
  { id: 'bt1', label: 'FINISH TOP 4 IN REGIONAL CUP', met: true, progress: 100 },
  { id: 'bt2', label: 'QUALIFY 1 ATHLETE FOR NATIONAL TRIALS', met: true, progress: 100 },
  { id: 'bt3', label: 'PROMOTE 1 ACADEMY PROSPECT', met: false, progress: 62 },
  { id: 'bt4', label: 'SECURE 2 ACTIVE SPONSOR DEALS', met: false, progress: 54 },
]

export function ClubManagement() {
  const { state: clubState, dispatch: clubDispatch } = useClubCareer()
  const [selectedPhilosophyId, setSelectedPhilosophyId] = useState(clubState.philosophyId ?? CLUB_PHILOSOPHIES[0]?.id ?? '')
  const [enteredComps, setEnteredComps] = useState<Set<string>>(new Set(clubState.competitions.filter((comp) => comp.entered).map((comp) => comp.id)))
  const { cyclePhase } = useTrainingEngineState()

  const selectedPhilosophy = useMemo(
    () => CLUB_PHILOSOPHIES.find((item) => item.id === selectedPhilosophyId) ?? CLUB_PHILOSOPHIES[0],
    [selectedPhilosophyId],
  )

  const roster = clubState.roster
  const clubOvr = roster.length > 0
    ? Math.round(roster.reduce((sum, swimmer) => sum + swimmer.ovr, 0) / roster.length)
    : USER_DATA.clubOvr

  const weeklyBalance = clubState.weeklyIncome - clubState.weeklyWages
  const academyAthletes = roster.filter((athlete) => athlete.isAcademy)
  const activeRoster = roster.filter((athlete) => !athlete.isAcademy)
  const fatiguedCount = roster.filter((athlete) => athlete.readiness < 70).length
  const injuredCount = roster.filter((athlete) => athlete.form === 'cold').length
  const availableStaff = clubState.staff.filter((staff) => !staff.hired)
  const hiredStaff = clubState.staff.filter((staff) => staff.hired)
  const activeTargets = clubState.transferTargets.filter((target) => target.available)
  const nextCompetition = clubState.competitions.find((comp) => enteredComps.has(comp.id)) ?? clubState.competitions[0]

  const toggleComp = (id: string) => {
    setEnteredComps((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const overviewPane = (
    <div className="hq-overview-grid">
      <section className="swim26-card swim26-card--gold swim26-card--hero">
        <div className="swim26-card-content swim26-stack-sm">
          <div className="swim26-hero-grid">
            <div className="swim26-img-container landscape env">
              <img src={poolBackdrop} alt="Club pool backdrop" />
              <div className="img-overlay-bottom" />
              <div className="img-text-content">
                <div className="swim26-overline">CLUB MANAGEMENT</div>
                <div className="swim26-hero-title">{clubState.clubName}</div>
                <div className="swim26-meta-line">
                  <span>SEASON {clubState.season}</span>
                  <span>WEEK {clubState.currentWeek}/{clubState.totalWeeks}</span>
                </div>
              </div>
            </div>

            <div className="swim26-stack-sm">
              <div className="swim26-inline-split">
                <div>
                  <div className="swim26-overline">CLUB OVR</div>
                  <div className="swim26-hero-value" style={{ color: GOLD }}>{clubOvr}</div>
                </div>
                <div className="swim26-chip-group">
                  <StatChip label="BUDGET" value={`$${Math.round(clubState.budget / 1000)}K`} accent={SUCCESS} />
                  <StatChip label="BALANCE" value={`${weeklyBalance >= 0 ? '+' : ''}${Math.round(weeklyBalance / 1000)}K`} accent={weeklyBalance >= 0 ? GREEN : ALERT} />
                </div>
              </div>

              <div className="swim26-mini-stat-grid swim26-mini-stat-grid--four">
                <div className="swim26-mini-stat"><div className="swim26-mini-stat__value" style={{ color: GOLD }}>{clubState.prestige}</div><div className="swim26-mini-stat__label">PRESTIGE</div></div>
                <div className="swim26-mini-stat"><div className="swim26-mini-stat__value" style={{ color: AQUA }}>{activeRoster.length}</div><div className="swim26-mini-stat__label">ACTIVE</div></div>
                <div className="swim26-mini-stat"><div className="swim26-mini-stat__value" style={{ color: GREEN }}>{hiredStaff.length}</div><div className="swim26-mini-stat__label">STAFF</div></div>
                <div className="swim26-mini-stat"><div className="swim26-mini-stat__value" style={{ color: VOLT }}>{clubState.pendingDecisions.length}</div><div className="swim26-mini-stat__label">URGENT</div></div>
              </div>
            </div>
          </div>
        </div>
        <span className="card-ghost-num">{clubOvr}</span>
      </section>

      <div className="swim26-column-stack">
        <section className="swim26-card swim26-card--gold">
          <div className="swim26-card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">BOARD CONFIDENCE</div>
                <div className="swim26-card-title">MANDATE</div>
              </div>
              <TargetIcon size={16} color={GOLD} />
            </div>
            <div className="swim26-list-stack">
              {BOARD_TARGETS.map((target) => (
                <div key={target.id} className="swim26-goal-block">
                  <div className="swim26-goal-row">
                    <span className="swim26-goal-title">{target.label}</span>
                    {target.met ? <CheckCircle2Icon size={14} color={SUCCESS} /> : <span className="swim26-goal-reward">{target.progress}%</span>}
                  </div>
                  <Meter value={target.progress} max={100} accent={target.met ? SUCCESS : GOLD} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="swim26-card swim26-card--neutral">
          <div className="swim26-card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">NEXT FIXTURE</div>
                <div className="swim26-card-title">RACE WEEK</div>
              </div>
              <CrownIcon size={16} color={AQUA} />
            </div>
            <div className="swim26-copy-strip">
              <div>
                <span className="swim26-muted-label">EVENT</span>
                <p>{nextCompetition?.name ?? 'REGIONAL CUP HEAT'}</p>
              </div>
              <div>
                <span className="swim26-muted-label">STAKES</span>
                <p>{nextCompetition?.stakes ?? 'PRESTIGE · SPONSOR EXPOSURE'}</p>
              </div>
            </div>
            <div className="swim26-meta-line">
              <span>WEEK {nextCompetition?.week ?? clubState.currentWeek}</span>
              <span>{enteredComps.has(nextCompetition?.id ?? '') ? 'ENTERED' : 'NOT ENTERED'}</span>
              <span>{cyclePhase.name.toUpperCase()}</span>
            </div>
          </div>
          <div className="cta-band">
            <button className="swim26-btn swim26-btn-primary primary-cta">OPEN CLUB</button>
          </div>
        </section>
      </div>
    </div>
  )

  const dynastyPane = (
    <div className="swim26-column-stack">
      <div className="club-card-grid">
        <section className="club-card" style={{ ['--card-accent' as any]: GOLD }}>
          <div className="card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">CLUB OVERVIEW</div>
                <div className="swim26-card-title">{clubState.clubName}</div>
              </div>
              <ShieldIcon size={16} color={GOLD} />
            </div>
            <div className="swim26-inline-split">
              <div className="swim26-hero-value" style={{ color: GOLD }}>{clubOvr}</div>
              <div className="swim26-value-stack">
                <span className="swim26-muted-label">RECORD</span>
                <span className="swim26-list-row__title">12 / 3 / 2</span>
              </div>
            </div>
            <Meter value={78} max={100} accent={GOLD} />
            <div className="swim26-muted-line">BOARD CONFIDENCE · STRONG SPONSOR MOMENTUM</div>
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-secondary">OPEN CLUB</button></div>
        </section>

        <section className="club-card" style={{ ['--card-accent' as any]: AQUA }}>
          <div className="card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">SQUAD DEPTH</div>
                <div className="swim26-card-title">ACTIVE UNIT</div>
              </div>
              <Users2Icon size={16} color={AQUA} />
            </div>
            <StatusRow label="AVAILABLE" value={activeRoster.length} accent={AQUA} />
            <StatusRow label="FATIGUED" value={fatiguedCount} accent={GOLD} />
            <StatusRow label="INJURED" value={injuredCount} accent={ALERT} />
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-secondary">VIEW SQUAD</button></div>
        </section>

        <section className="club-card" style={{ ['--card-accent' as any]: VOLT }}>
          <div className="card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">TRANSFER MARKET</div>
                <div className="swim26-card-title">FEATURED RECRUIT</div>
              </div>
              <UserPlusIcon size={16} color={VOLT} />
            </div>
            {activeTargets[0] ? (
              <>
                <div className="swim26-transfer-feature">
                  <div>
                    <div className="swim26-list-row__title">{activeTargets[0].name}</div>
                    <div className="swim26-list-row__meta">{activeTargets[0].stroke.toUpperCase()} · AGE {activeTargets[0].age}</div>
                  </div>
                  <div className="swim26-hero-value-sm" style={{ color: GOLD }}>{activeTargets[0].ovr}</div>
                </div>
                <div className="swim26-meta-line"><span>${Math.round(activeTargets[0].price / 1000)}K</span><span>${Math.round(activeTargets[0].weeklyWage / 1000)}K/WK</span><span>{activeTargets.length} LIVE</span></div>
              </>
            ) : <div className="swim26-muted-line">NO LIVE TARGETS</div>}
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-primary primary-cta">SCOUT / SIGN</button></div>
        </section>

        <section className="club-card" style={{ ['--card-accent' as any]: GREEN }}>
          <div className="card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">FACILITIES</div>
                <div className="swim26-card-title">UPGRADE LANES</div>
              </div>
              <Building2Icon size={16} color={GREEN} />
            </div>
            {clubState.facilities.slice(0, 3).map((facility) => (
              <div key={facility.type} className="swim26-facility-row">
                <div>
                  <div className="swim26-list-row__title">{facility.type.toUpperCase()}</div>
                  <div className="swim26-list-row__meta">{facility.effect}</div>
                </div>
                <div className="swim26-facility-upgrade">
                  <span>L{facility.level}</span>
                  <ArrowUpIcon size={14} />
                </div>
              </div>
            ))}
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-secondary">UPGRADE</button></div>
        </section>

        <section className="club-card" style={{ ['--card-accent' as any]: GOLD }}>
          <div className="card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">BOARD TARGETS</div>
                <div className="swim26-card-title">PRESSURE BOARD</div>
              </div>
              <TargetIcon size={16} color={GOLD} />
            </div>
            {BOARD_TARGETS.slice(0, 3).map((target) => (
              <div key={target.id} className="swim26-goal-block">
                <div className="swim26-goal-row"><span className="swim26-goal-title">{target.label}</span><span className="swim26-goal-reward">{target.progress}%</span></div>
                <Meter value={target.progress} max={100} accent={target.met ? SUCCESS : GOLD} />
              </div>
            ))}
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-secondary">REVIEW TARGETS</button></div>
        </section>

        <section className="club-card" style={{ ['--card-accent' as any]: '#1E3A57' }}>
          <div className="card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">TRAINING PHILOSOPHY</div>
                <div className="swim26-card-title">{selectedPhilosophy.title}</div>
              </div>
              <FlameIcon size={16} color={AQUA} />
            </div>
            <div className="swim26-copy-strip">
              <div><span className="swim26-muted-label">UPSIDE</span><p>{selectedPhilosophy.upside}</p></div>
              <div><span className="swim26-muted-label">TRADEOFF</span><p>{selectedPhilosophy.tradeoff}</p></div>
            </div>
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-ghost">ADJUST</button></div>
        </section>
      </div>

      <section className="swim26-card swim26-card--aqua">
        <div className="swim26-card-content swim26-stack-sm">
          <div className="swim26-section-head">
            <div>
              <div className="swim26-overline">TRANSFER BOARD</div>
              <div className="swim26-card-title">RECRUIT LANE</div>
            </div>
            <UserPlusIcon size={16} color={VOLT} />
          </div>
          <div className="swim26-transfer-grid">
            {activeTargets.slice(0, 4).map((target) => (
              <article key={target.id} className="swim26-portrait-tile">
                <div className="swim26-img-container portrait">
                  <img src={athletePortrait} alt={`${target.name} recruit portrait`} />
                  <div className="img-overlay-bottom" />
                  <div className="img-text-content">
                    <div className="swim26-tile-title">{target.name}</div>
                    <div className="swim26-meta-line swim26-meta-line--nowrap"><span>{target.stroke.toUpperCase()}</span><span>OVR {target.ovr}</span></div>
                  </div>
                </div>
                <div className="swim26-tile-body">
                  <div className="swim26-meta-line"><span>AGE {target.age}</span><span>${Math.round(target.price / 1000)}K</span></div>
                  <button className="swim26-btn swim26-btn-primary swim26-btn--full primary-cta">SIGN</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="swim26-card swim26-card--neutral">
        <div className="swim26-card-content swim26-stack-sm">
          <div className="swim26-section-head">
            <div>
              <div className="swim26-overline">CLUB DOCTRINE</div>
              <div className="swim26-card-title">SELECT IDENTITY</div>
            </div>
            <ZapIcon size={16} color={AQUA} />
          </div>
          <div className="swim26-card-grid swim26-card-grid--compact">
            {CLUB_PHILOSOPHIES.map((philosophy) => {
              const active = philosophy.id === selectedPhilosophy.id
              return (
                <button
                  key={philosophy.id}
                  type="button"
                  className={`swim26-phase-card ${active ? 'is-active' : ''}`}
                  onClick={() => {
                    setSelectedPhilosophyId(philosophy.id)
                    clubDispatch({ type: 'CLUB_SET_PHILOSOPHY', philosophyId: philosophy.id as any })
                  }}
                >
                  <div className="swim26-phase-card__title">{philosophy.title}</div>
                  <div className="swim26-phase-card__meta">{philosophy.doctrine}</div>
                  <div className="swim26-phase-card__copy">{philosophy.upside}</div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="swim26-card swim26-card--gold">
        <div className="swim26-card-content swim26-stack-sm">
          <div className="swim26-section-head">
            <div>
              <div className="swim26-overline">COMPETITIONS</div>
              <div className="swim26-card-title">ENTRY BOARD</div>
            </div>
            <WavesIcon size={16} color={GOLD} />
          </div>
          <div className="swim26-calendar-grid">
            {clubState.competitions.map((event) => {
              const entered = enteredComps.has(event.id)
              return (
                <div key={event.id} className={`swim26-calendar-card ${entered ? 'is-current' : ''}`}>
                  <div className="swim26-calendar-top">
                    {entered ? <CheckCircle2Icon size={14} color={SUCCESS} /> : <BadgeDollarSignIcon size={14} color={GOLD} />}
                    <span>W{event.week}</span>
                  </div>
                  <div className="swim26-list-row__title">{event.name}</div>
                  <div className="swim26-list-row__meta">{event.stakes}</div>
                  <button className="swim26-btn swim26-btn-ghost swim26-btn--full" onClick={() => toggleComp(event.id)}>
                    {entered ? 'WITHDRAW' : 'ENTER HEAT'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="swim26-card-grid">
        <section className="swim26-card swim26-card--gold">
          <div className="swim26-card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">PARTNERS</div>
                <div className="swim26-card-title">SPONSOR TRACK</div>
              </div>
              <HandshakeIcon size={16} color={SUCCESS} />
            </div>
            <div className="swim26-list-stack">
              {CLUB_SPONSORS.slice(0, 4).map((sponsor) => (
                <div key={sponsor.id} className="swim26-split-row">
                  <span>{sponsor.name}</span>
                  <strong>{sponsor.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="swim26-card swim26-card--aqua">
          <div className="swim26-card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">STAFF ROOM</div>
                <div className="swim26-card-title">SPECIALISTS</div>
              </div>
              <DumbbellIcon size={16} color={AQUA} />
            </div>
            <div className="swim26-list-stack">
              {clubState.staff.slice(0, 4).map((staff) => (
                <div key={staff.id} className="swim26-versus-row">
                  <div>
                    <div className="swim26-list-row__title">{staff.name}</div>
                    <div className="swim26-list-row__meta">{staff.role} · {staff.boost}</div>
                  </div>
                  <div className="swim26-versus-score"><span>L{staff.level}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-secondary">ADJUST</button></div>
        </section>

        <section className="swim26-card swim26-card--danger">
          <div className="swim26-card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">PROJECTS</div>
                <div className="swim26-card-title">GROWTH TRACK</div>
              </div>
              <TrendingUpIcon size={16} color={ALERT} />
            </div>
            <div className="swim26-list-stack">
              {CLUB_PROJECTS.map((project) => (
                <div key={project.id} className="swim26-goal-block">
                  <div className="swim26-goal-row"><span className="swim26-goal-title">{project.title}</span><span className="swim26-goal-reward">{project.status.toUpperCase()}</span></div>
                  <div className="swim26-muted-line">{project.owner} · {project.eta}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="swim26-card swim26-card--neutral">
          <div className="swim26-card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">GROUP LOAD</div>
                <div className="swim26-card-title">TRAINING UNITS</div>
              </div>
              <FlameIcon size={16} color={AQUA} />
            </div>
            <div className="swim26-list-stack">
              {CLUB_TRAINING_GROUPS.map((group) => (
                <div key={group.id} className="swim26-goal-block">
                  <div className="swim26-goal-row"><span className="swim26-goal-title">{group.name}</span><span className="swim26-goal-reward">{group.currentLoad}</span></div>
                  <div className="swim26-muted-line">{group.payoff}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )

  return (
    <PaneSwitcher
      panes={[
        {
          id: 'hq',
          label: 'HQ',
          icon: <Building2Icon size={12} />,
          content: <div className="swim26-pane-scroll">{overviewPane}</div>,
        },
        {
          id: 'dynasty',
          label: 'DYNASTY',
          icon: <CrownIcon size={12} />,
          content: <div className="swim26-pane-scroll">{dynastyPane}</div>,
        },
      ]}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        className="swim26-page-shell swim26-page-pattern swim26-page-pattern--split"
      >
        <div className="swim26-pane-scroll">{overviewPane}</div>
        <div className="swim26-pane-scroll">{dynastyPane}</div>
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

function StatusRow({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="swim26-status-row">
      <span>{label}</span>
      <strong style={{ color: accent }}>{value}</strong>
    </div>
  )
}
