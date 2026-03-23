import React, { useMemo } from 'react'
import { useClubCareer } from '../context/CareerSaveContext'
import { PaneSwitcher } from '../ui/PaneSwitcher'

function competitionTag(currentWeek: number, week: number, entered: boolean) {
  if (entered) return 'ENTERED'
  if (week <= currentWeek) return 'LIVE NOW'
  return 'UP NEXT'
}

export function Championships() {
  const { state: clubState, dispatch } = useClubCareer()

  const competitions = useMemo(
    () => [...clubState.competitions].sort((a, b) => a.week - b.week),
    [clubState.competitions],
  )

  const primary = competitions.find((competition) => !competition.entered) ?? competitions[0]
  const supportEvents = competitions.filter((competition) => competition.id !== primary?.id).slice(0, 2)
  const upcomingEvents = competitions.slice(0, 4)
  const defaultLineup = clubState.roster.slice(0, 4).map((athlete) => athlete.id)

  const enterCompetition = (compId: string) => {
    const competition = clubState.competitions.find((entry) => entry.id === compId)
    if (!competition) return
    if (competition.lineup.length === 0 && defaultLineup.length > 0) {
      dispatch({ type: 'CLUB_SET_COMPETITION_LINEUP', compId, lineup: defaultLineup })
    }
    if (!competition.entered) {
      dispatch({ type: 'CLUB_ENTER_COMPETITION', compId })
    }
  }

  const featuredContent = (
    <div className="swim26-pane-scroll swim26-column-stack">
      {primary && (
        <section className="swim26-card swim26-card--gold swim26-champs-hero">
          <div className="card-content swim26-stack-sm">
            <div className="swim26-chip-group">
              <span className="swim26-status-pill" style={{ borderColor: 'rgba(255,90,95,0.45)', color: '#FF5A5F' }}>{competitionTag(clubState.currentWeek, primary.week, primary.entered)}</span>
              <span className="swim26-status-pill" style={{ borderColor: 'rgba(200,255,0,0.35)', color: '#C8FF00' }}>CLUB SCHEDULE</span>
            </div>
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">CHAMPIONSHIPS</div>
                <div className="swim26-card-title swim26-card-title--lg">{primary.name}</div>
              </div>
              <div className="swim26-hero-value-sm" style={{ color: '#FFB800' }}>🏆</div>
            </div>
            <div className="swim26-copy-strip">
              <div>
                <span className="swim26-muted-label">LINEUP</span>
                <p>{primary.lineup.length}/4 swimmers locked for this meet.</p>
              </div>
              <div>
                <span className="swim26-muted-label">WINDOW</span>
                <p>Week {primary.week} · Season {clubState.season}</p>
              </div>
              <div>
                <span className="swim26-muted-label">REWARD</span>
                <p>{primary.stakes}</p>
              </div>
            </div>
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-primary" onClick={() => enterCompetition(primary.id)}>{primary.entered ? 'ENTERED' : 'ENTER HEAT'}</button></div>
        </section>
      )}

      <div className="swim26-card-grid swim26-card-grid--compact">
        {supportEvents.map((event) => (
          <section key={event.id} className="swim26-card swim26-card--aqua">
            <div className="swim26-card-content swim26-stack-sm">
              <div className="swim26-section-head">
                <div>
                  <div className="swim26-overline">EVENT CARD</div>
                  <div className="swim26-card-title">{event.name}</div>
                </div>
                <span className="swim26-goal-reward">W{event.week}</span>
              </div>
              <div className="swim26-goal-block">
                <div className="swim26-goal-row"><span className="swim26-goal-title">STATUS</span><span className="swim26-goal-reward">{competitionTag(clubState.currentWeek, event.week, event.entered)}</span></div>
                <div className="swim26-muted-line">{event.stakes}</div>
              </div>
            </div>
            <div className="cta-band"><button className="swim26-btn swim26-btn-secondary" onClick={() => enterCompetition(event.id)}>{event.entered ? 'ENTERED' : 'ENTER HEAT'}</button></div>
          </section>
        ))}
      </div>

      <div className="swim26-card-grid swim26-champs-grid">
        {upcomingEvents.map((event) => (
          <section key={event.id} className="swim26-card swim26-card--neutral">
            <div className="swim26-card-content swim26-stack-sm">
              <div className="swim26-section-head">
                <div>
                  <div className="swim26-overline">UPCOMING</div>
                  <div className="swim26-card-title">{event.name}</div>
                </div>
                <span className="swim26-goal-reward">W{event.week}</span>
              </div>
              <div className="swim26-goal-block">
                <div className="swim26-goal-row"><span className="swim26-goal-title">STATUS</span><span className="swim26-goal-reward">{competitionTag(clubState.currentWeek, event.week, event.entered)}</span></div>
                <div className="swim26-muted-line">{event.stakes}</div>
              </div>
              <div className="swim26-goal-block">
                <div className="swim26-goal-row"><span className="swim26-goal-title">ENTRY</span><span className="swim26-goal-reward">{event.lineup.length}/4</span></div>
              </div>
            </div>
            <div className="cta-band"><button className="swim26-btn swim26-btn-ghost" onClick={() => enterCompetition(event.id)}>{event.entered ? 'ENTERED' : 'ENTER HEAT'}</button></div>
          </section>
        ))}
      </div>
    </div>
  )

  const upcomingContent = (
    <div className="swim26-pane-scroll swim26-column-stack">
      <div className="swim26-card-grid swim26-champs-grid">
        {upcomingEvents.map((event) => (
          <section key={event.id} className="swim26-card swim26-card--neutral">
            <div className="swim26-card-content swim26-stack-sm">
              <div className="swim26-section-head">
                <div>
                  <div className="swim26-overline">SEASON BOARD</div>
                  <div className="swim26-card-title">{event.name}</div>
                </div>
                <span className="swim26-goal-reward">W{event.week}</span>
              </div>
              <div className="swim26-goal-block">
                <div className="swim26-goal-row"><span className="swim26-goal-title">LINEUP</span><span className="swim26-goal-reward">{event.lineup.length}/4</span></div>
                <div className="swim26-muted-line">{event.stakes}</div>
              </div>
            </div>
            <div className="cta-band"><button className="swim26-btn swim26-btn-secondary" onClick={() => enterCompetition(event.id)}>{event.entered ? 'ENTERED' : 'ENTER HEAT'}</button></div>
          </section>
        ))}
      </div>
    </div>
  )

  return (
    <PaneSwitcher
      panes={[
        { id: 'featured', label: 'FEATURED', icon: <span aria-hidden>🏆</span>, content: featuredContent },
        { id: 'upcoming', label: 'UPCOMING', icon: <span aria-hidden>🗓</span>, content: upcomingContent },
      ]}
    >
      <div className="swim26-page-shell swim26-page-shell--single">
        <div className="swim26-pane-scroll swim26-column-stack">{featuredContent}</div>
        <div className="swim26-pane-scroll swim26-column-stack">{upcomingContent}</div>
      </div>
    </PaneSwitcher>
  )
}

export default Championships
