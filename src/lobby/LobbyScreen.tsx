import React, { useMemo } from 'react'

import { useAthleteCareer, useClubCareer } from '../context/CareerSaveContext'
import { PLAYER_CAREER_EVENTS } from '../utils/careerModeData'

interface LobbyScreenProps {
  onStartRace: () => void
  onNavigate: (tab: string) => void
}

type IconName = 'flag' | 'medal' | 'squad' | 'market'

function InlineIcon({ name, size = 16 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  switch (name) {
    case 'flag': return <svg {...common}><path d="M4 13V2.8" /><path d="M4.4 3.2h6l-1.5 2.3 1.5 2.3h-6Z" /></svg>
    case 'medal': return <svg {...common}><circle cx="8" cy="9.3" r="2.5" /><path d="M6.4 2.8 8 5l1.6-2.2" /><path d="M5.4 2.8h1l1.6 2.2 1.6-2.2h1" /></svg>
    case 'squad': return <svg {...common}><circle cx="5.4" cy="5.2" r="1.8" /><circle cx="10.8" cy="5.8" r="1.5" /><path d="M2.9 12.4c.5-1.8 1.8-2.8 3.9-2.8 2 0 3.3 1 3.8 2.8" /></svg>
    case 'market': return <svg {...common}><path d="M2.8 4.8h10.4L12.1 10H3.9Z" /><path d="M5.4 4.8V3.4h5.2v1.4" /></svg>
    default: return null
  }
}

function StreamlineSwimmer() {
  return (
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" aria-hidden>
      <ellipse cx="108" cy="20" rx="8" ry="9" fill="rgba(24,200,240,0.4)"/>
      <rect x="101" y="17" width="5" height="4" rx="1.5" fill="rgba(24,200,240,0.6)"/>
      <rect x="108" y="17" width="5" height="4" rx="1.5" fill="rgba(24,200,240,0.6)"/>
      <path d="M100 20 C80 20 40 18 8 20" stroke="rgba(24,200,240,0.35)" strokeWidth="5" strokeLinecap="round"/>
      <path d="M100 18 C90 15 70 13 4 16" stroke="rgba(24,200,240,0.28)" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M12 22 C8 26 4 30 2 34" stroke="rgba(24,200,240,0.22)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M10 20 C6 24 3 28 1 28" stroke="rgba(24,200,240,0.18)" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

function formatCompactNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`
  return `${value}`
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ onStartRace, onNavigate }) => {
  const { state: athleteState } = useAthleteCareer()
  const { state: clubState } = useClubCareer()

  const nextRace = PLAYER_CAREER_EVENTS[athleteState.currentEventIdx] ?? PLAYER_CAREER_EVENTS[0]

  const rosterByOvr = useMemo(
    () => [...clubState.roster].sort((a, b) => b.ovr - a.ovr),
    [clubState.roster],
  )

  const leadSwimmer = rosterByOvr[0]
  const highlightedRoster = rosterByOvr.slice(0, 2)
  const nextCompetition = clubState.competitions.find((competition) => !competition.entered) ?? clubState.competitions[0]
  const featuredCompetitions = clubState.competitions.slice(0, 2)
  const availableTargets = clubState.transferTargets.filter((target) => target.available)
  const topTarget = [...availableTargets].sort((a, b) => b.ovr - a.ovr)[0] ?? clubState.transferTargets[0]

  const clubOvr = rosterByOvr.length > 0
    ? Math.round(rosterByOvr.reduce((sum, athlete) => sum + athlete.ovr, 0) / rosterByOvr.length)
    : 0
  const level = Math.floor(athleteState.xp / 500) + 1
  const rewardLine = `${nextRace.rewards.xp} XP · $${formatCompactNumber(nextRace.rewards.currency)}`
  const competitionCountdown = nextCompetition
    ? nextCompetition.week <= clubState.currentWeek
      ? 'READY NOW'
      : `WEEK ${nextCompetition.week}`
    : 'NO EVENT'
  const marketMeter = clubState.transferTargets.length > 0
    ? `${Math.round((availableTargets.length / clubState.transferTargets.length) * 100)}%`
    : '0%'

  return (
    <div className="swim26-lobby-board">
      <section className="card swim26-card--aqua swim26-lobby-hero">
        <div className="pool-bg" aria-hidden />
        <div className="swim26-lobby-swimmer swim26-lobby-swimmer--streamline"><StreamlineSwimmer /></div>

        <div className="card-content swim26-stack-sm">
          <div className="swim26-chip-group">
            <span className="swim26-status-pill" style={{ borderColor: 'rgba(63,224,152,0.45)', color: '#3FE098' }}>WEEK {athleteState.currentWeek}</span>
            <span className="swim26-status-pill" style={{ borderColor: 'rgba(255,184,0,0.35)', color: '#FFB800' }}>{clubState.clubName.toUpperCase()}</span>
          </div>

          <div>
            <div className="swim26-overline">RACE CONTROL</div>
            <div className="swim26-hero-title swim26-lobby-title">{nextRace.distance}M {nextRace.stroke}</div>
            <div className="swim26-meta-line">
              <span>CLUB OVR {clubOvr}</span>
              <span>LEVEL {level}</span>
              <span>XP {athleteState.xp % 500}/500</span>
            </div>
          </div>

          <div className="swim26-copy-strip swim26-copy-strip--two">
            <div>
              <span className="swim26-muted-label">FEATURED EVENT</span>
              <p>{nextRace.name}</p>
            </div>
            <div>
              <span className="swim26-muted-label">REWARD LINE</span>
              <p>{rewardLine}</p>
            </div>
            <div>
              <span className="swim26-muted-label">PACE CALL</span>
              <p>{leadSwimmer ? `${leadSwimmer.name} leads the active squad at ${leadSwimmer.ovr} OVR with ${leadSwimmer.readiness}% readiness.` : 'Build your club roster to unlock squad insights.'}</p>
            </div>
          </div>

          <div className="swim26-mini-stat-grid swim26-mini-stat-grid--four">
            <div className="swim26-mini-stat"><div className="swim26-mini-stat__value" style={{ color: '#18C8F0' }}>{athleteState.currentWeek}</div><div className="swim26-mini-stat__label">WEEK</div></div>
            <div className="swim26-mini-stat"><div className="swim26-mini-stat__value" style={{ color: '#FFB800' }}>{nextRace.distance}</div><div className="swim26-mini-stat__label">EVENT</div></div>
            <div className="swim26-mini-stat"><div className="swim26-mini-stat__value" style={{ color: '#3FE098' }}>{athleteState.readiness}%</div><div className="swim26-mini-stat__label">READY</div></div>
            <div className="swim26-mini-stat"><div className="swim26-mini-stat__value" style={{ color: '#C8FF00' }}>{athleteState.momentum >= 0 ? `+${athleteState.momentum}` : athleteState.momentum}</div><div className="swim26-mini-stat__label">MOM</div></div>
          </div>
        </div>

        <div className="cta-band">
          <div className="swim26-lobby-cta-row">
            <button className="swim26-btn swim26-btn-primary" onClick={onStartRace}>RACE NOW</button>
            <button className="swim26-btn swim26-btn-secondary" onClick={() => onNavigate('career')}>VIEW SQUAD</button>
          </div>
        </div>
      </section>

      <section className="card swim26-card--gold swim26-lobby-side-card">
        <div className="card-content swim26-stack-sm">
          <div className="swim26-section-head">
            <div>
              <div className="swim26-overline">NEXT CLUB EVENT</div>
              <div className="swim26-card-title">{nextCompetition?.name ?? 'NO COMPETITION SET'}</div>
            </div>
            <InlineIcon name="flag" />
          </div>
          <div className="swim26-goal-block">
            <div className="swim26-goal-row"><span className="swim26-goal-title">STATUS</span><span className="swim26-goal-reward">{nextCompetition?.entered ? 'ENTERED' : 'OPEN'}</span></div>
            <div className="swim26-muted-line">{competitionCountdown} · lineup {nextCompetition?.lineup.length ?? 0}</div>
          </div>
          <div className="swim26-goal-block">
            <div className="swim26-goal-row"><span className="swim26-goal-title">STAKES</span><span className="swim26-goal-reward">{clubState.prestige} PRE</span></div>
            <div className="swim26-muted-line">{nextCompetition?.stakes ?? 'No competition stakes available.'}</div>
          </div>
        </div>
        <div className="cta-band"><button className="swim26-btn swim26-btn-secondary" onClick={() => onNavigate('championships')}>ENTER HEAT</button></div>
      </section>

      <div className="swim26-lobby-lower-grid">
        <section className="card swim26-card--volt swim26-lobby-card">
          <div className="card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">SQUAD CORE</div>
                <div className="swim26-card-title">LINEUP FORM</div>
              </div>
              <InlineIcon name="squad" />
            </div>
            <div className="swim26-list-stack">
              {highlightedRoster.map((swimmer) => (
                <div className="swim26-list-row" key={swimmer.id}>
                  <div className="swim26-list-row__body">
                    <div className="swim26-list-row__title">{swimmer.name}</div>
                    <div className="swim26-list-row__meta">{swimmer.stroke} · morale {swimmer.morale}%</div>
                  </div>
                  <div className="swim26-value-stack">
                    <span className="swim26-hero-value-sm" style={{ color: '#FFB800' }}>{swimmer.ovr}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-secondary" onClick={() => onNavigate('career')}>VIEW SQUAD</button></div>
        </section>

        <section className="card swim26-card--gold swim26-lobby-card">
          <div className="card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">LIVE FEED</div>
                <div className="swim26-card-title">EVENT BOARD</div>
              </div>
              <InlineIcon name="medal" />
            </div>
            <div className="swim26-list-stack">
              {featuredCompetitions.map((event) => (
                <div className="swim26-goal-block" key={event.id}>
                  <div className="swim26-goal-row"><span className="swim26-goal-title">{event.name}</span><span className="swim26-goal-reward">W{event.week}</span></div>
                  <div className="swim26-muted-line">{event.entered ? 'ENTERED' : 'OPEN'} · {event.stakes}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-ghost" onClick={() => onNavigate('championships')}>ENTER HEAT</button></div>
        </section>

        <section className="card swim26-card--green swim26-lobby-card">
          <div className="card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">TRANSFER SIGNAL</div>
                <div className="swim26-card-title">MARKET WATCH</div>
              </div>
              <InlineIcon name="market" />
            </div>
            <div className="swim26-goal-block">
              <div className="swim26-goal-row"><span className="swim26-goal-title">HOT NAME</span><span className="swim26-goal-reward">{topTarget?.ovr ?? '--'} OVR</span></div>
              <div className="swim26-muted-line">{topTarget ? `${topTarget.name} · $${formatCompactNumber(topTarget.price)}` : 'No live targets in the scouting lane.'}</div>
            </div>
            <div className="swim26-goal-block">
              <div className="swim26-goal-row"><span className="swim26-goal-title">SCOUT NETWORK</span><span className="swim26-goal-reward">{availableTargets.length}/{clubState.transferTargets.length}</span></div>
              <div className="swim26-meter"><div className="swim26-meter__fill" style={{ width: marketMeter, background: '#3FE098' }} /></div>
            </div>
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-primary" onClick={() => onNavigate('market')}>SCOUT / SIGN</button></div>
        </section>
      </div>
    </div>
  )
}

export default LobbyScreen
