import React from 'react';

import { HOME_EVENTS, ROSTER_HIGHLIGHTS, SWIMMERS, USER_DATA } from '../utils/gameData';

interface LobbyScreenProps {
  onStartRace: () => void;
  onNavigate: (tab: string) => void;
}

type IconName = 'flag' | 'pulse' | 'medal' | 'target' | 'squad' | 'market';

function InlineIcon({ name, size = 16 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'flag':
      return <svg {...common}><path d="M4 13V2.8" /><path d="M4.4 3.2h6l-1.5 2.3 1.5 2.3h-6Z" /></svg>;
    case 'pulse':
      return <svg {...common}><path d="M2.4 8h2.2l1.2-2.3 2.1 4.7 1.7-3h3.9" /></svg>;
    case 'medal':
      return <svg {...common}><circle cx="8" cy="9.3" r="2.5" /><path d="M6.4 2.8 8 5l1.6-2.2" /><path d="M5.4 2.8h1l1.6 2.2 1.6-2.2h1" /></svg>;
    case 'target':
      return <svg {...common}><circle cx="8" cy="8" r="4.8" /><circle cx="8" cy="8" r="2.2" /><path d="M8 1.8v2" /><path d="M14.2 8h-2" /></svg>;
    case 'squad':
      return <svg {...common}><circle cx="5.4" cy="5.2" r="1.8" /><circle cx="10.8" cy="5.8" r="1.5" /><path d="M2.9 12.4c.5-1.8 1.8-2.8 3.9-2.8 2 0 3.3 1 3.8 2.8" /></svg>;
    case 'market':
      return <svg {...common}><path d="M2.8 4.8h10.4L12.1 10H3.9Z" /><path d="M5.4 4.8V3.4h5.2v1.4" /></svg>;
    default:
      return null;
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
  );
}

function FreestyleSwimmer() {
  return (
    <svg width="90" height="130" viewBox="0 0 90 130" fill="none" aria-hidden>
      <ellipse cx="45" cy="20" rx="10" ry="12" fill="rgba(24,200,240,0.4)"/>
      <rect x="36" y="17" width="7" height="5" rx="2" fill="rgba(24,200,240,0.6)"/>
      <rect x="47" y="17" width="7" height="5" rx="2" fill="rgba(24,200,240,0.6)"/>
      <line x1="43" y1="19" x2="47" y2="19" stroke="rgba(24,200,240,0.5)" strokeWidth="1"/>
      <path d="M45 32 C48 55 50 85 44 125" stroke="rgba(24,200,240,0.35)" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M45 38 C55 36 70 30 82 26" stroke="rgba(24,200,240,0.3)" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M45 42 C35 50 18 56 6 54" stroke="rgba(24,200,240,0.22)" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M50 110 C54 118 58 124 62 128" stroke="rgba(24,200,240,0.28)" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M44 115 C40 122 36 126 32 128" stroke="rgba(24,200,240,0.22)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ onStartRace, onNavigate }) => {
  const leadSwimmer = SWIMMERS[0];
  const upcomingEvent = HOME_EVENTS[0];

  return (
    <div className="swim26-lobby-grid">
      <section className="card swim26-card--aqua swim26-lobby-hero">
        <div className="pool-bg" aria-hidden />
        <div className="swim26-lobby-swimmer swim26-lobby-swimmer--streamline"><StreamlineSwimmer /></div>
        <div className="swim26-lobby-swimmer swim26-lobby-swimmer--freestyle"><FreestyleSwimmer /></div>

        <div className="card-content swim26-stack-sm">
          <div className="swim26-chip-group">
            <span className="swim26-status-pill" style={{ borderColor: 'rgba(63,224,152,0.45)', color: '#3FE098' }}>LIVE SEASON</span>
            <span className="swim26-status-pill" style={{ borderColor: 'rgba(255,184,0,0.35)', color: '#FFB800' }}>WORLD TOUR HUB</span>
          </div>

          <div>
            <div className="swim26-overline">RACE CONTROL</div>
            <div className="swim26-hero-title swim26-lobby-title">SWIM26 NEXT HEAT</div>
            <div className="swim26-meta-line">
              <span>CLUB OVR {USER_DATA.clubOvr}</span>
              <span>LEVEL {USER_DATA.level}</span>
              <span>XP {USER_DATA.xp}/{USER_DATA.maxXp}</span>
            </div>
          </div>

          <div className="swim26-copy-strip">
            <div>
              <span className="swim26-muted-label">FEATURED EVENT</span>
              <p>{upcomingEvent.name}</p>
            </div>
            <div>
              <span className="swim26-muted-label">REWARD LINE</span>
              <p>{upcomingEvent.reward}</p>
            </div>
            <div>
              <span className="swim26-muted-label">PACE CALL</span>
              <p>{leadSwimmer.name} leads the sprint block with {leadSwimmer.ovr} OVR form.</p>
            </div>
          </div>

          <div className="swim26-mini-stat-grid swim26-mini-stat-grid--four">
            <div className="swim26-mini-stat"><div className="swim26-mini-stat__value" style={{ color: '#18C8F0' }}>4</div><div className="swim26-mini-stat__label">LANE</div></div>
            <div className="swim26-mini-stat"><div className="swim26-mini-stat__value" style={{ color: '#FFB800' }}>48.94</div><div className="swim26-mini-stat__label">PB</div></div>
            <div className="swim26-mini-stat"><div className="swim26-mini-stat__value" style={{ color: '#3FE098' }}>89%</div><div className="swim26-mini-stat__label">READY</div></div>
            <div className="swim26-mini-stat"><div className="swim26-mini-stat__value" style={{ color: '#C8FF00' }}>2H</div><div className="swim26-mini-stat__label">TO GUN</div></div>
          </div>
        </div>

        <div className="cta-band">
          <div className="swim26-lobby-cta-row">
            <button className="swim26-btn swim26-btn-primary" onClick={onStartRace}>RACE NOW</button>
            <button className="swim26-btn swim26-btn-secondary" onClick={() => onNavigate('career')}>VIEW SQUAD</button>
          </div>
        </div>
      </section>

      <div className="swim26-lobby-side">
        <section className="card swim26-card--gold swim26-lobby-event-card">
          <div className="card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">NEXT EVENT</div>
                <div className="swim26-card-title">{upcomingEvent.name}</div>
              </div>
              <InlineIcon name="flag" />
            </div>
            <div className="swim26-goal-block">
              <div className="swim26-goal-row"><span className="swim26-goal-title">STATUS</span><span className="swim26-goal-reward">{upcomingEvent.status}</span></div>
              <div className="swim26-muted-line">{upcomingEvent.time}</div>
            </div>
            <div className="swim26-goal-block">
              <div className="swim26-goal-row"><span className="swim26-goal-title">PAYDAY</span><span className="swim26-goal-reward">750 XP</span></div>
              <div className="swim26-muted-line">Elite pack chance + sponsor exposure.</div>
            </div>
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-secondary" onClick={() => onNavigate('championships')}>ENTER HEAT</button></div>
        </section>

        <section className="card swim26-card--danger swim26-alert-card">
          <div className="card-content swim26-stack-sm">
            <div className="swim26-section-head">
              <div>
                <div className="swim26-overline">BOARD TARGET</div>
                <div className="swim26-card-title">PODIUM PUSH</div>
              </div>
              <InlineIcon name="target" />
            </div>
            <div className="swim26-goal-block">
              <div className="swim26-goal-row"><span className="swim26-goal-title">TOP 4 NATIONAL LEAGUE</span><span className="swim26-goal-reward">78%</span></div>
              <div className="swim26-meter"><div className="swim26-meter__fill" style={{ width: '78%', background: '#FF5A5F' }} /></div>
            </div>
            <div className="swim26-muted-line">Rivals are closing on relay points. Lock race entries this week.</div>
          </div>
          <div className="cta-band"><button className="swim26-btn swim26-btn-ghost" onClick={() => onNavigate('club')}>REVIEW TARGETS</button></div>
        </section>
      </div>

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
            {ROSTER_HIGHLIGHTS.slice(0, 3).map((entry) => {
              const swimmer = SWIMMERS.find((item) => item.id === entry.swimmerId);
              if (!swimmer) return null;
              return (
                <div className="swim26-list-row" key={entry.id}>
                  <div className="swim26-list-row__body">
                    <div className="swim26-list-row__title">{swimmer.name}</div>
                    <div className="swim26-list-row__meta">{entry.role} · {entry.morale}</div>
                  </div>
                  <div className="swim26-value-stack">
                    <span className="swim26-hero-value-sm" style={{ color: '#FFB800' }}>{swimmer.ovr}</span>
                    <span className="swim26-muted-label">OVR</span>
                  </div>
                </div>
              );
            })}
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
            {HOME_EVENTS.map((event) => (
              <div className="swim26-goal-block" key={event.id}>
                <div className="swim26-goal-row"><span className="swim26-goal-title">{event.name}</span><span className="swim26-goal-reward">{event.time}</span></div>
                <div className="swim26-muted-line">{event.status} · {event.reward}</div>
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
          <div className="swim26-copy-strip">
            <div>
              <span className="swim26-muted-label">HOT NAME</span>
              <p>S. Marchand · 114 OVR IM star available for approach.</p>
            </div>
            <div>
              <span className="swim26-muted-label">WINDOW</span>
              <p>2 active sprint targets · budget line stable.</p>
            </div>
          </div>
          <div className="swim26-goal-block">
            <div className="swim26-goal-row"><span className="swim26-goal-title">SCOUT NETWORK</span><span className="swim26-goal-reward">READY</span></div>
            <div className="swim26-meter"><div className="swim26-meter__fill" style={{ width: '64%', background: '#3FE098' }} /></div>
          </div>
        </div>
        <div className="cta-band"><button className="swim26-btn swim26-btn-primary" onClick={() => onNavigate('market')}>SCOUT / SIGN</button></div>
      </section>
    </div>
  );
};

export default LobbyScreen;
