import React from 'react'
import { motion } from 'motion/react'
import { ACHIEVEMENTS, CAREER_TRACK, HOME_EVENTS } from '../utils/gameData'
import { ProgressBar } from '../components/ProgressBar'
import { TrophyIcon, MedalIcon, StarIcon, LockIcon, CalendarIcon, TimerResetIcon, SparklesIcon } from 'lucide-react'

const AQUA = '#38D6FF'
const GOLD = '#D4A843'
const PANEL = 'rgba(4,20,33,0.76)'
const PANEL_BORDER = 'rgba(56,214,255,0.13)'

export function CareerMode() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      style={{ position: 'absolute', inset: 0, display: 'flex', gap: '10px', padding: '10px' }}
    >
      {/* ── LEFT COLUMN ── */}
      <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Season card */}
        <div style={{ borderRadius: '14px', border: `1px solid rgba(212,168,67,0.25)`, background: 'linear-gradient(135deg, rgba(42,31,12,0.90) 0%, rgba(26,19,8,0.90) 100%)', backdropFilter: 'blur(12px)', padding: '14px 16px' }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(212,168,67,0.60)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '8px' }}>Current Season</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', color: '#F3FBFF', lineHeight: 1, letterSpacing: '0.04em' }}>S4</span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: GOLD, letterSpacing: '0.06em', marginBottom: '4px' }}>PRO LEAGUE</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <StatRow label="WINS"    value="142" icon={<TrophyIcon size={13} color={GOLD} />} />
            <StatRow label="MEDALS"  value="86"  icon={<MedalIcon  size={13} color="rgba(169,211,231,0.70)" />} />
            <StatRow label="RECORDS" value="12"  icon={<StarIcon   size={13} color={GOLD} />} />
          </div>
        </div>

        {/* Next unlock */}
        <div style={{ borderRadius: '14px', border: '1px solid rgba(167,139,250,0.25)', background: 'linear-gradient(135deg, rgba(88,28,135,0.40) 0%, rgba(11,17,32,0.90) 100%)', backdropFilter: 'blur(12px)', padding: '14px 16px' }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(167,139,250,0.60)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px' }}>Next Unlock</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(0,0,0,0.40)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LockIcon size={18} color="rgba(255,255,255,0.35)" />
            </div>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', color: '#F3FBFF', letterSpacing: '0.04em' }}>Olympic Pool</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: GOLD, marginTop: '3px' }}>Unlocks at Level 35</div>
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div style={{ flex: 1, borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '14px 16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', flexShrink: 0 }}>
            <CalendarIcon size={13} color={GOLD} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', color: '#F3FBFF', letterSpacing: '0.06em' }}>ROADMAP</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {CAREER_TRACK.map((item) => {
              const stateColor = item.state === 'Current' ? GOLD : item.state === 'Completed' ? '#34D399' : 'rgba(255,255,255,0.25)'
              return (
                <div key={item.id} style={{ borderRadius: '10px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.03)', padding: '8px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '12px', color: '#F3FBFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.event}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.45)', textTransform: 'uppercase', letterSpacing: '0.10em', marginTop: '2px' }}>{item.week} · {item.stage}</div>
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: stateColor, letterSpacing: '0.10em', flexShrink: 0 }}>{item.state.toUpperCase()}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
        {/* Featured events */}
        <div style={{ borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '14px 16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <TrophyIcon size={14} color={GOLD} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', color: '#F3FBFF', letterSpacing: '0.06em' }}>FEATURED EVENTS</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {HOME_EVENTS.map((event) => (
              <div key={event.id} style={{ borderRadius: '12px', border: `1px solid ${PANEL_BORDER}`, background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)', padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: GOLD, letterSpacing: '0.14em' }}>{event.status}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TimerResetIcon size={11} color={GOLD} />
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px', color: 'rgba(169,211,231,0.70)' }}>{event.time}</span>
                  </div>
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1.1, marginBottom: '6px' }}>{event.name}</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.55)', marginBottom: '10px', lineHeight: 1.4 }}>{event.reward}</div>
                <button style={{ height: '28px', paddingInline: '12px', borderRadius: '7px', cursor: 'pointer', background: 'rgba(56,214,255,0.08)', border: `1px solid rgba(56,214,255,0.20)`, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: AQUA }}>
                  Enter Race
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div style={{ flex: 1, borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '14px 16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexShrink: 0 }}>
            <StarIcon size={14} color={GOLD} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', color: '#F3FBFF', letterSpacing: '0.06em' }}>MILESTONES</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ACHIEVEMENTS.map((ach, i) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{ padding: '10px 12px', borderRadius: '10px', border: ach.completed ? '1px solid rgba(52,211,153,0.25)' : `1px solid ${PANEL_BORDER}`, background: ach.completed ? 'rgba(52,211,153,0.06)' : 'rgba(56,214,255,0.03)', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: ach.completed ? 'rgba(52,211,153,0.15)' : 'rgba(0,0,0,0.35)', border: ach.completed ? '1px solid rgba(52,211,153,0.30)' : '1px solid rgba(255,255,255,0.06)' }}>
                  {ach.completed
                    ? <SparklesIcon size={15} color="#34D399" />
                    : <StarIcon   size={15} color="rgba(255,255,255,0.30)" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '13px', color: '#F3FBFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ach.title}</span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', color: GOLD, background: 'rgba(212,168,67,0.10)', padding: '2px 8px', borderRadius: '5px', flexShrink: 0 }}>{ach.reward}</span>
                  </div>
                  <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.55)', marginBottom: '6px', lineHeight: 1.4 }}>{ach.desc}</p>
                  <ProgressBar progress={ach.progress} max={ach.max} color={ach.completed ? 'bg-[#0D7C66]' : 'bg-[#D4A843]'} showLabel />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function StatRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', background: 'rgba(0,0,0,0.25)', padding: '7px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon}
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px', color: 'rgba(255,255,255,0.70)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>{label}</span>
      </div>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: '#F3FBFF', letterSpacing: '0.04em' }}>{value}</span>
    </div>
  )
}
