import React from 'react'
import { motion } from 'motion/react'
import { TrophyIcon, CalendarIcon, UsersIcon } from 'lucide-react'

const AQUA = '#38D6FF'
const GOLD = '#D4A843'
const PANEL = 'rgba(4,20,33,0.76)'
const PANEL_BORDER = 'rgba(56,214,255,0.13)'

const UPCOMING_EVENTS = [
  { title: 'Sprint Series',   type: 'Freestyle Only', req: 'OVR 100+',   time: 'Starts in 5h',  accent: '#38D6FF', border: 'rgba(56,214,255,0.25)' },
  { title: 'Endurance Test',  type: 'Medley',         req: 'Level 20+',  time: 'Tomorrow',      accent: '#A78BFA', border: 'rgba(167,139,250,0.25)' },
  { title: 'Rookie Cup',      type: 'All Strokes',    req: 'Max OVR 90', time: 'Starts in 3d',  accent: '#34D399', border: 'rgba(52,211,153,0.25)' },
]

export function Championships() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}
    >
      {/* ── Featured championship ── */}
      <div style={{ borderRadius: '14px', border: `1px solid rgba(212,168,67,0.30)`, background: 'linear-gradient(135deg, rgba(42,31,12,0.92) 0%, rgba(17,13,3,0.92) 100%)', backdropFilter: 'blur(14px)', padding: '12px 16px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        {/* Gold glow */}
        <div style={{ position: 'absolute', right: 0, top: 0, width: '160px', height: '160px', borderRadius: '50%', background: GOLD, opacity: 0.08, filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'inline-block', background: '#C41E3A', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', letterSpacing: '0.14em', padding: '2px 8px', borderRadius: '5px', marginBottom: '6px', animation: 'countdown-pulse 1.8s ease-in-out infinite' }}>
              LIVE NOW
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '5px' }}>GLOBAL CUP '26</h2>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(232,224,208,0.75)', marginBottom: '8px', lineHeight: 1.4 }}>
              Compete against the top 100 clubs worldwide for exclusive legendary rewards.
            </p>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <UsersIcon size={12} color={GOLD} />
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px', color: 'rgba(255,255,255,0.80)' }}>64 / 100 Joined</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CalendarIcon size={12} color={GOLD} />
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px', color: 'rgba(255,255,255,0.80)' }}>Ends in 2d 14h</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <TrophyIcon size={44} color={GOLD} strokeWidth={1.5} style={{ filter: `drop-shadow(0 0 14px rgba(212,168,67,0.55))` }} />
            <button style={{ height: '30px', paddingInline: '16px', borderRadius: '8px', cursor: 'pointer', background: '#F3FBFF', border: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.10em', color: '#041421', boxShadow: '0 0 14px rgba(243,251,255,0.25)', whiteSpace: 'nowrap' }}>
              ENTER TOURNAMENT
            </button>
          </div>
        </div>
      </div>

      {/* ── Upcoming events ── */}
      <div style={{ flex: 1, borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(14px)', padding: '10px 14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: '#F3FBFF', letterSpacing: '0.06em', marginBottom: '8px', flexShrink: 0 }}>
          UPCOMING EVENTS
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', minHeight: 0 }}>
          {UPCOMING_EVENTS.map((ev) => (
            <motion.div
              key={ev.title}
              whileTap={{ scale: 0.98 }}
              style={{ borderRadius: '10px', border: `1px solid ${ev.border}`, background: `linear-gradient(135deg, rgba(56,214,255,0.06) 0%, rgba(4,20,33,0.70) 100%)`, padding: '10px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}
            >
              {/* Time tag */}
              <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.50)', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(255,255,255,0.65)', padding: '3px 8px', borderBottomLeftRadius: '8px', letterSpacing: '0.08em' }}>
                {ev.time}
              </div>

              <div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '17px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1, marginTop: '14px', marginBottom: '3px' }}>{ev.title}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: ev.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{ev.type}</div>
              </div>

              <div style={{ marginTop: '8px', padding: '5px 10px', borderRadius: '7px', background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '9px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>REQ</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.04em' }}>{ev.req}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
