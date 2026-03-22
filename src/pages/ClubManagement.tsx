import React, { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  ActivityIcon,
  ArrowUpRightIcon,
  BadgeDollarSignIcon,
  Building2Icon,
  CalendarIcon,
  CrownIcon,
  DumbbellIcon,
  HandshakeIcon,
  ShieldIcon,
  SparklesIcon,
  TargetIcon,
  Users2Icon,
  WavesIcon,
} from 'lucide-react'
import { SwimmerCard } from '../components/SwimmerCard'
import { SponsorPanel } from './ProfilePage'
import { CLUB_SPONSORS, SWIMMERS, USER_DATA, type Swimmer } from '../utils/gameData'
import { useClubRoster, type SignedAthlete } from '../utils/clubRoster'
import { getReadinessLabel } from '../utils/trainingSystem'
import { PaneSwitcher, useIsLandscapeMobile } from '../ui/PaneSwitcher'
import { useTrainingEngineState } from '../hooks/useTrainingEngineState'
import {
  CLUB_ACADEMY_WAVE,
  CLUB_COMPETITION_CALENDAR,
  CLUB_GROWTH_METRICS,
  CLUB_PHILOSOPHIES,
  CLUB_PROJECTS,
  CLUB_STAFF_UNITS,
} from '../utils/careerModeData'
import { CLUB_TRAINING_GROUPS } from '../utils/trainingEngineData'

const AQUA = '#81ECFF'
const GOLD = '#D4A843'
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

function toSwimmerCard(a: SignedAthlete): Swimmer {
  return {
    id: a.id,
    name: a.name,
    ovr: a.ovr,
    stroke: a.stroke as any,
    country: a.flag,
    stats: { speed: a.ovr, stamina: a.ovr, technique: a.ovr, turn: a.ovr },
    rarity: a.ovr >= 95 ? 'legendary' : a.ovr >= 88 ? 'epic' : a.ovr >= 82 ? 'rare' : 'common' as const,
  }
}

export function ClubManagement() {
  const signedAthletes = useClubRoster()
  const isLandscape = useIsLandscapeMobile()
  const [selectedPhilosophyId, setSelectedPhilosophyId] = useState(CLUB_PHILOSOPHIES[0]?.id ?? '')
  const { selectedDrill, cyclePhase, sessionActive } = useTrainingEngineState()

  const selectedPhilosophy = useMemo(
    () => CLUB_PHILOSOPHIES.find((item) => item.id === selectedPhilosophyId) ?? CLUB_PHILOSOPHIES[0],
    [selectedPhilosophyId],
  )

  const relayScore = selectedPhilosophy.id === 'relay-factory' ? '94%' : selectedPhilosophy.id === 'sprint-lab' ? '86%' : '88%'
  const academyBias = selectedPhilosophy.id === 'endurance-engine' ? 'Distance wave' : selectedPhilosophy.id === 'relay-factory' ? 'Balanced relay wave' : 'Explosive sprint wave'

  const leftColumn = (
    <div style={{ width: '248px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div
        style={{
          ...panelStyle,
          padding: isLandscape ? '10px 12px' : '14px 16px',
          background: 'linear-gradient(145deg, rgba(31,30,15,0.96) 0%, rgba(8,17,28,0.92) 100%)',
          border: '1px solid rgba(212,168,67,0.18)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
          <div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(212,168,67,0.72)', fontWeight: 800 }}>
              Club / Coaching Career
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isLandscape ? '24px' : '30px', letterSpacing: '0.04em', color: '#F3FBFF', lineHeight: 1, marginTop: '4px' }}>
              Build A Dynasty, Not A Menu
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: GOLD, lineHeight: 1 }}>{USER_DATA.clubOvr}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(212,168,67,0.72)', fontWeight: 700 }}>Club OVR</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', marginTop: isLandscape ? '10px' : '12px' }}>
          {CLUB_GROWTH_METRICS.map((metric) => (
            <div key={metric.label} style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '9px 10px' }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(169,211,231,0.55)' }}>{metric.label}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', lineHeight: 1, color: metric.accent, marginTop: '4px' }}>{metric.value}</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', lineHeight: 1.35, color: 'rgba(169,211,231,0.62)', marginTop: '4px' }}>{metric.hint}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <TargetIcon size={13} color={AQUA} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Club Philosophy</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CLUB_PHILOSOPHIES.map((philosophy) => {
            const active = philosophy.id === selectedPhilosophy.id
            return (
              <button
                key={philosophy.id}
                onClick={() => setSelectedPhilosophyId(philosophy.id)}
                style={{
                  textAlign: 'left',
                  borderRadius: '10px',
                  border: active ? '1px solid rgba(129,236,255,0.34)' : '1px solid rgba(255,255,255,0.06)',
                  background: active ? 'linear-gradient(135deg, rgba(129,236,255,0.12) 0%, rgba(255,255,255,0.04) 100%)' : 'rgba(255,255,255,0.03)',
                  padding: '10px 11px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{philosophy.title}</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', lineHeight: 1.35, color: 'rgba(169,211,231,0.66)', marginTop: '5px' }}>{philosophy.doctrine}</div>
              </button>
            )
          })}
        </div>
        <div style={{ marginTop: '10px', borderRadius: '10px', border: '1px solid rgba(54,198,144,0.22)', background: 'rgba(54,198,144,0.05)', padding: '10px 11px' }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '11px', color: '#F3FBFF' }}>Doctrine effect</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: SUCCESS, marginTop: '4px' }}>{selectedPhilosophy.upside}</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.68)', marginTop: '3px' }}>{selectedPhilosophy.tradeoff}</div>
        </div>
      </div>

      <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <WavesIcon size={13} color={GOLD} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Academy Wave</span>
          <span style={{ marginLeft: 'auto', fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: AQUA, fontWeight: 700 }}>{academyBias}</span>
        </div>
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '2px' }}>
          {CLUB_ACADEMY_WAVE.map((prospect) => (
            <div key={prospect.name} style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '10px 11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{prospect.name}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: GOLD, letterSpacing: '0.10em' }}>AGE {prospect.age}</div>
                </div>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: SUCCESS, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{prospect.readiness}</span>
              </div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', lineHeight: 1.4, color: 'rgba(169,211,231,0.68)', marginTop: '5px' }}>{prospect.profile}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const rightColumn = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
      <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: GOLD, textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 800 }}>Coaching command layer</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isLandscape ? '22px' : '28px', letterSpacing: '0.04em', color: '#F3FBFF', lineHeight: 1 }}>A real club ladder, not generic transfer spam</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', lineHeight: 1.45, color: 'rgba(169,211,231,0.72)', marginTop: '6px', maxWidth: '760px' }}>
              Club mode now revolves around identity, athlete development, relay chemistry, staff leverage, and calendar pressure. Your growth comes from the program you build.
            </div>
          </div>
          <div style={{ display: 'grid', gap: '6px', minWidth: isLandscape ? '170px' : '220px' }}>
            <InfoStat title="Relay edge" value={relayScore} accent={AQUA} />
            <InfoStat title="Current doctrine" value={selectedPhilosophy.title} accent={SUCCESS} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.12fr 0.88fr', gap: '10px', minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0, minHeight: 0 }}>
          <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Users2Icon size={13} color={AQUA} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Staff Engine</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isLandscape ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
              {CLUB_STAFF_UNITS.map((staff) => (
                <div key={staff.id} style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '10px 11px' }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{staff.name}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: GOLD, letterSpacing: '0.10em', marginTop: '2px' }}>{staff.role.toUpperCase()}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: SUCCESS, marginTop: '6px', lineHeight: 1.35 }}>{staff.boost}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.66)', marginTop: '5px', lineHeight: 1.35 }}>{staff.chemistry}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Building2Icon size={13} color={GOLD} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Growth Projects</span>
            </div>
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '2px' }}>
              {CLUB_PROJECTS.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  style={{
                    borderRadius: '10px',
                    border: project.status === 'ahead' ? '1px solid rgba(54,198,144,0.26)' : project.status === 'risk' ? '1px solid rgba(248,113,113,0.24)' : '1px solid rgba(255,255,255,0.06)',
                    background: project.status === 'ahead' ? 'rgba(54,198,144,0.06)' : project.status === 'risk' ? 'rgba(248,113,113,0.05)' : 'rgba(255,255,255,0.03)',
                    padding: '10px 11px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{project.title}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.60)', marginTop: '3px' }}>{project.owner} • {project.eta}</div>
                    </div>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: project.status === 'ahead' ? SUCCESS : project.status === 'risk' ? ALERT : AQUA, letterSpacing: '0.10em' }}>{project.status.toUpperCase()}</span>
                  </div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', lineHeight: 1.4, color: 'rgba(169,211,231,0.70)', marginTop: '6px' }}>{project.impact}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <DumbbellIcon size={13} color={AQUA} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Training Engine Merge</span>
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ borderRadius: '10px', border: '1px solid rgba(56,214,255,0.18)', background: 'rgba(56,214,255,0.05)', padding: '10px 11px' }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>Live shared program state</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: AQUA, marginTop: '4px' }}>{selectedDrill.label} • {cyclePhase.name}</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.68)', marginTop: '5px', lineHeight: 1.4 }}>{cyclePhase.focus}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: sessionActive ? SUCCESS : GOLD, letterSpacing: '0.10em', marginTop: '6px' }}>{sessionActive ? 'ATHLETES CURRENTLY IN SESSION' : 'SESSION SLOT OPEN'}</div>
              </div>
              {CLUB_TRAINING_GROUPS.map((group) => (
                <div key={group.id} style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '10px 11px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{group.name}</div>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: AQUA, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{group.currentLoad}</span>
                  </div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.66)', marginTop: '5px', lineHeight: 1.35 }}>{group.purpose}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: SUCCESS, marginTop: '5px' }}>{group.payoff}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <ShieldIcon size={13} color={AQUA} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Core Squad & New Signings</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
              {SWIMMERS.slice(0, 4).map((swimmer, i) => (
                <motion.div key={swimmer.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} style={{ flexShrink: 0 }}>
                  <SwimmerCard swimmer={swimmer} size="sm" />
                </motion.div>
              ))}
              {signedAthletes.map((athlete, i) => (
                <motion.div key={athlete.id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} style={{ flexShrink: 0 }}>
                  <SwimmerCard swimmer={toSwimmerCard(athlete)} size="sm" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
          <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <CalendarIcon size={13} color={GOLD} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Meet Calendar Decisions</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {CLUB_COMPETITION_CALENDAR.map((event) => (
                <div key={event.id} style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '10px 11px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{event.name}</div>
                    <ArrowUpRightIcon size={14} color={AQUA} />
                  </div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: GOLD, marginTop: '4px' }}>{event.stakes}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.68)', marginTop: '5px', lineHeight: 1.4 }}>{event.decision}</div>
                </div>
              ))}
            </div>
          </div>

          <SponsorPanel sponsors={CLUB_SPONSORS} title="CLUB PARTNERS & FUNDING" compact />

          <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <CrownIcon size={13} color={GOLD} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Why this mode now feels beast-level</span>
            </div>
            <div style={{ display: 'grid', gap: '6px' }}>
              {[
                'Your club identity changes what kind of athletes, staff synergies, and race outcomes you produce.',
                'Academy growth, relay chemistry, and facility investment matter as much as raw roster star power.',
                'Calendar choices create real tradeoffs between prestige, fatigue, cashflow, and long-term dynasty growth.',
              ].map((line) => (
                <div key={line} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                  <SparklesIcon size={12} color={SUCCESS} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.70)', lineHeight: 1.45 }}>{line}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...panelStyle, padding: isLandscape ? '10px 12px' : '14px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
              <MiniInsight icon={<DumbbellIcon size={13} color={AQUA} />} title="Training bias" value={selectedPhilosophy.title} />
              <MiniInsight icon={<HandshakeIcon size={13} color={SUCCESS} />} title="Sponsor pull" value={selectedPhilosophy.id === 'relay-factory' ? 'Community-friendly' : 'Performance-first'} />
              <MiniInsight icon={<BadgeDollarSignIcon size={13} color={GOLD} />} title="Budget play" value="Upgrade recovery before another mega signing" />
              <MiniInsight icon={<ActivityIcon size={13} color={ALERT} />} title="Risk watch" value="Heavy meet clustering next 2 weeks" />
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
          id: 'hq',
          label: 'HQ',
          icon: <Building2Icon size={12} />,
          content: <div style={{ position: 'absolute', inset: 0, padding: '8px', overflowY: 'auto' }}>{leftColumn}</div>,
        },
        {
          id: 'dynasty',
          label: 'DYNASTY',
          icon: <CrownIcon size={12} />,
          content: <div style={{ position: 'absolute', inset: 0, padding: '8px', overflowY: 'auto' }}>{rightColumn}</div>,
        },
      ]}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', gap: '10px', padding: '10px', minHeight: 0 }}
      >
        {leftColumn}
        {rightColumn}
      </motion.div>
    </PaneSwitcher>
  )
}

function InfoStat({ title, value, accent }: { title: string; value: string; accent: string }) {
  return (
    <div style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '8px 10px' }}>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800 }}>{title}</div>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: accent, marginTop: '3px' }}>{value}</div>
    </div>
  )
}

function MiniInsight({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '10px 11px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
        {icon}
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.56)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800 }}>{title}</span>
      </div>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: '#F3FBFF', lineHeight: 1.35 }}>{value}</div>
    </div>
  )
}
