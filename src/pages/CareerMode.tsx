import React from 'react'
import { motion } from 'motion/react'
import { ACHIEVEMENTS, CAREER_TRACK, HOME_EVENTS, CAREER_SPONSORS } from '../utils/gameData'
import { ProgressBar } from '../components/ProgressBar'
import { TrophyIcon, MedalIcon, StarIcon, LockIcon, CalendarIcon, TimerResetIcon, SparklesIcon } from 'lucide-react'
import { SponsorPanel } from './ProfilePage'
import { PaneSwitcher } from '../ui/PaneSwitcher'

const AQUA = 'var(--color-volt)'
const GOLD = 'var(--color-volt)'
const PANEL = 'rgba(4,20,33,0.76)'
const PANEL_BORDER = 'rgba(56,214,255,0.13)'

export function CareerMode() {
  // ── Left column ────────────────────────────────────────────────────────────
  const leftColumn = (
    <div style={{ width: '200px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Season card */}
      <div style={{ borderRadius: '12px', border: `1px solid rgba(212,168,67,0.25)`, background: 'linear-gradient(135deg, rgba(42,31,12,0.90) 0%, rgba(26,19,8,0.90) 100%)', backdropFilter: 'blur(12px)', padding: '10px 12px' }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(212,168,67,0.60)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '5px' }}>Current Season</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '8px' }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', color: '#F3FBFF', lineHeight: 1, letterSpacing: '0.04em' }}>S4</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', color: GOLD, letterSpacing: '0.06em', marginBottom: '2px' }}>PRO LEAGUE</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <StatRow label="WINS"    value="142" icon={<TrophyIcon size={12} color={GOLD} />} />
          <StatRow label="MEDALS"  value="86"  icon={<MedalIcon  size={12} color="rgba(169,211,231,0.70)" />} />
          <StatRow label="RECORDS" value="12"  icon={<StarIcon   size={12} color={GOLD} />} />
        </div>
      </div>

      {/* Next unlock */}
      <div style={{ borderRadius: '12px', border: '1px solid rgba(167,139,250,0.25)', background: 'linear-gradient(135deg, rgba(88,28,135,0.40) 0%, rgba(11,17,32,0.90) 100%)', backdropFilter: 'blur(12px)', padding: '10px 12px' }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(167,139,250,0.60)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '8px' }}>Next Unlock</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,0,0,0.40)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <LockIcon size={15} color="rgba(255,255,255,0.35)" />
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.04em' }}>Olympic Pool</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: GOLD, marginTop: '2px' }}>Unlocks at Level 35</div>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div style={{ flex: 1, borderRadius: '12px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '10px 12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', flexShrink: 0 }}>
          <CalendarIcon size={12} color={GOLD} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.06em' }}>ROADMAP</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {CAREER_TRACK.map((item) => {
            const stateColor = item.state === 'Current' ? GOLD : item.state === 'Completed' ? '#34D399' : 'rgba(255,255,255,0.25)'
            return (
              <div key={item.id} style={{ borderRadius: '8px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.03)', padding: '6px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px', color: '#F3FBFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.event}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.45)', textTransform: 'uppercase', letterSpacing: '0.10em', marginTop: '1px' }}>{item.week} · {item.stage}</div>
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '9px', color: stateColor, letterSpacing: '0.10em', flexShrink: 0 }}>{item.state.toUpperCase()}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  // ── Right column ───────────────────────────────────────────────────────────
  const rightColumn = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
      {/* Featured events */}
      <div style={{ borderRadius: '12px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '10px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
          <TrophyIcon size={12} color={GOLD} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.06em' }}>FEATURED EVENTS</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {HOME_EVENTS.map((event) => (
            <div key={event.id} style={{ borderRadius: '10px', border: `1px solid ${PANEL_BORDER}`, background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)', padding: '9px 11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '9px', color: GOLD, letterSpacing: '0.14em' }}>{event.status}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <TimerResetIcon size={10} color={GOLD} />
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.70)' }}>{event.time}</span>
                </div>
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1.1, marginBottom: '4px' }}>{event.name}</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.55)', marginBottom: '7px', lineHeight: 1.3 }}>{event.reward}</div>
              <button style={{ minHeight: '44px', paddingInline: '10px', paddingBlock: '8px', borderRadius: '6px', cursor: 'pointer', background: 'rgba(56,214,255,0.08)', border: `1px solid rgba(56,214,255,0.20)`, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: AQUA, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Enter Race
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsors */}
      <SponsorPanel sponsors={CAREER_SPONSORS} title="CAREER SPONSORS" compact />

      {/* Milestones */}
      <div style={{ flex: 1, borderRadius: '12px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '10px 12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', flexShrink: 0 }}>
          <StarIcon size={12} color={GOLD} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.06em' }}>MILESTONES</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {ACHIEVEMENTS.map((ach, i) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{ padding: '8px 10px', borderRadius: '9px', border: ach.completed ? '1px solid rgba(52,211,153,0.25)' : `1px solid ${PANEL_BORDER}`, background: ach.completed ? 'rgba(52,211,153,0.06)' : 'rgba(56,214,255,0.03)', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: ach.completed ? 'rgba(52,211,153,0.15)' : 'rgba(0,0,0,0.35)', border: ach.completed ? '1px solid rgba(52,211,153,0.30)' : '1px solid rgba(255,255,255,0.06)' }}>
                {ach.completed
                  ? <SparklesIcon size={13} color="#34D399" />
                  : <StarIcon   size={13} color="rgba(255,255,255,0.30)" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '3px' }}>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '12px', color: '#F3FBFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ach.title}</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', color: GOLD, background: 'rgba(212,168,67,0.10)', padding: '1px 6px', borderRadius: '4px', flexShrink: 0 }}>{ach.reward}</span>
                </div>
                <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.55)', marginBottom: '5px', lineHeight: 1.3 }}>{ach.desc}</p>
                <ProgressBar progress={ach.progress} max={ach.max} color={ach.completed ? 'bg-[#0D7C66]' : 'bg-[#D4A843]'} showLabel />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <PaneSwitcher
      panes={[
        {
          id: 'season',
          label: 'SEASON',
          icon: <CalendarIcon size={12} />,
          content: (
            <div style={{ position: 'absolute', inset: 0, padding: '8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {leftColumn.props.children}
            </div>
          ),
        },
        {
          id: 'events',
          label: 'EVENTS',
          icon: <TrophyIcon size={12} />,
          content: (
            <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
              <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {rightColumn.props.children}
              </div>
            </div>
          ),
        },
      ]}
    >
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', gap: '8px', padding: '8px' }}
      >
        {leftColumn}
        {rightColumn}
      </motion.div>
    </PaneSwitcher>
  )
}

function StatRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', background: 'rgba(0,0,0,0.25)', padding: '5px 8px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        {icon}
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(255,255,255,0.70)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>{label}</span>
      </div>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: '#F3FBFF', letterSpacing: '0.04em' }}>{value}</span>
    </div>
  )
}
