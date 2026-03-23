import React from 'react'
import { PaneSwitcher } from '../ui/PaneSwitcher'

const FEATURED_EVENTS = [
  { id: 'global-cup', title: "GLOBAL CUP '26", tag: 'LIVE NOW', joined: '64 / 100', countdown: 'Ends in 2d 14h', reward: 'Elite medal pool · 750 XP · sponsor spotlight' },
  { id: 'relay-night', title: 'RELAY NIGHT', tag: 'UP NEXT', joined: '18 CLUBS', countdown: 'Tomorrow 20:00', reward: 'Club chemistry boost · bonus rep' },
  { id: 'trials', title: 'NATIONAL TRIALS', tag: 'QUALIFIER', joined: 'Heat locked', countdown: 'Week 6', reward: 'Selection points · prestige spike' },
]

const UPCOMING_EVENTS = [
  { id: 'sprint', title: 'SPRINT SERIES', type: 'FREESTYLE ONLY', req: 'OVR 100+', time: '5H', status: 'FASTEST LANES' },
  { id: 'medley', title: 'ENDURANCE TEST', type: 'MEDLEY', req: 'LEVEL 20+', time: 'TOMORROW', status: 'LONG COURSE' },
  { id: 'rookie', title: 'ROOKIE CUP', type: 'ALL STROKES', req: 'MAX OVR 90', time: '3D', status: 'ACADEMY OPEN' },
  { id: 'pro', title: 'PRO RELAY', type: 'TEAM ENTRY', req: '4 ACTIVE', time: 'SAT', status: 'SPONSOR NIGHT' },
]

function FeaturedHero() {
  const primary = FEATURED_EVENTS[0]

  return (
    <section className="swim26-card swim26-card--gold swim26-champs-hero">
      <div className="card-content swim26-stack-sm">
        <div className="swim26-chip-group">
          <span className="swim26-status-pill" style={{ borderColor: 'rgba(255,90,95,0.45)', color: '#FF5A5F' }}>{primary.tag}</span>
          <span className="swim26-status-pill" style={{ borderColor: 'rgba(200,255,0,0.35)', color: '#C8FF00' }}>FEATURED BOARD</span>
        </div>
        <div className="swim26-section-head">
          <div>
            <div className="swim26-overline">CHAMPIONSHIPS</div>
            <div className="swim26-card-title swim26-card-title--lg">{primary.title}</div>
          </div>
          <div className="swim26-hero-value-sm" style={{ color: '#FFB800' }}>🏆</div>
        </div>
        <div className="swim26-copy-strip">
          <div>
            <span className="swim26-muted-label">FIELD</span>
            <p>{primary.joined} joined across the featured bracket.</p>
          </div>
          <div>
            <span className="swim26-muted-label">WINDOW</span>
            <p>{primary.countdown}</p>
          </div>
          <div>
            <span className="swim26-muted-label">REWARD</span>
            <p>{primary.reward}</p>
          </div>
        </div>
      </div>
      <div className="cta-band"><button className="swim26-btn swim26-btn-primary">ENTER HEAT</button></div>
    </section>
  )
}

function FeaturedSupport() {
  return (
    <div className="swim26-card-grid swim26-card-grid--compact">
      {FEATURED_EVENTS.slice(1).map((event) => (
        <section key={event.id} className="swim26-card swim26-card--aqua">
          <div className="swim26-card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">EVENT CARD</div>
                <div className="swim26-card-title">{event.title}</div>
              </div>
              <span className="swim26-goal-reward">{event.countdown}</span>
            </div>
            <div className="swim26-goal-block">
              <div className="swim26-goal-row"><span className="swim26-goal-title">STATUS</span><span className="swim26-goal-reward">{event.tag}</span></div>
              <div className="swim26-muted-line">{event.reward}</div>
            </div>
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-secondary">ENTER HEAT</button></div>
        </section>
      ))}
    </div>
  )
}

function UpcomingGrid() {
  return (
    <div className="swim26-card-grid swim26-champs-grid">
      {UPCOMING_EVENTS.map((event) => (
        <section key={event.id} className="swim26-card swim26-card--neutral">
          <div className="swim26-card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">UPCOMING</div>
                <div className="swim26-card-title">{event.title}</div>
              </div>
              <span className="swim26-goal-reward">{event.time}</span>
            </div>
            <div className="swim26-goal-block">
              <div className="swim26-goal-row"><span className="swim26-goal-title">TYPE</span><span className="swim26-goal-reward">{event.type}</span></div>
              <div className="swim26-muted-line">{event.status}</div>
            </div>
            <div className="swim26-goal-block">
              <div className="swim26-goal-row"><span className="swim26-goal-title">ENTRY</span><span className="swim26-goal-reward">{event.req}</span></div>
            </div>
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-ghost">ENTER HEAT</button></div>
        </section>
      ))}
    </div>
  )
}

export function Championships() {
  const featuredContent = (
    <div className="swim26-pane-scroll swim26-column-stack">
      <FeaturedHero />
      <FeaturedSupport />
      <UpcomingGrid />
    </div>
  )

  const upcomingContent = (
    <div className="swim26-pane-scroll swim26-column-stack">
      <UpcomingGrid />
      <FeaturedSupport />
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
        <div className="swim26-pane-scroll swim26-column-stack">
          <FeaturedHero />
          <FeaturedSupport />
        </div>
        <div className="swim26-pane-scroll swim26-column-stack">
          <UpcomingGrid />
        </div>
      </div>
    </PaneSwitcher>
  )
}

export default Championships
