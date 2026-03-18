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
      <div style={{ borderRadius: '16px', border: `1px solid rgba(212,168,67,0.30)`, background: 'linear-gradient(135deg, rgba(42,31,12,0.92) 0%, rgba(17,13,3,0.92) 100%)', backdropFilter: 'blur(14px)', padding: '18px 22px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        {/* Gold glow */}
        <div style={{ position: 'absolute', right: 0, top: 0, width: '200px', height: '200px', borderRadius: '50%', background: GOLD, opacity: 0.08, filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-block', background: '#C41E3A', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', letterSpacing: '0.14em', padding: '3px 10px', borderRadius: '6px', marginBottom: '10px', animation: 'countdown-pulse 1.8s ease-in-out infinite' }}>
              LIVE NOW
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '6px' }}>GLOBAL CUP '26</h2>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', color: 'rgba(232,224,208,0.75)', maxWidth: '360px', marginBottom: '14px', lineHeight: 1.5 }}>
              Compete against the top 100 clubs worldwide for exclusive legendary rewards.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UsersIcon size={14} color={GOLD} />
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '13px', color: 'rgba(255,255,255,0.80)' }}>64 / 100 Joined</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CalendarIcon size={14} color={GOLD} />
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '13px', color: 'rgba(255,255,255,0.80)' }}>Ends in 2d 14h</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <TrophyIcon size={72} color={GOLD} strokeWidth={1.5} style={{ filter: `drop-shadow(0 0 18px rgba(212,168,67,0.55))` }} />
            <button style={{ height: '40px', paddingInline: '24px', borderRadius: '10px', cursor: 'pointer', background: '#F3FBFF', border: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.10em', color: '#041421', boxShadow: '0 0 20px rgba(243,251,255,0.25)' }}>
              ENTER TOURNAMENT
            </button>
          </div>
        </div>
      </div>

      {/* ── Upcoming events ── */}
      <div style={{ flex: 1, borderRadius: '16px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(14px)', padding: '16px 18px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: '#F3FBFF', letterSpacing: '0.06em', marginBottom: '12px', flexShrink: 0 }}>
          UPCOMING EVENTS
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', minHeight: 0 }}>
          {UPCOMING_EVENTS.map((ev) => (
            <motion.div
              key={ev.title}
              whileTap={{ scale: 0.98 }}
              style={{ borderRadius: '12px', border: `1px solid ${ev.border}`, background: `linear-gradient(135deg, rgba(56,214,255,0.06) 0%, rgba(4,20,33,0.70) 100%)`, padding: '14px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}
            >
              {/* Time tag */}
              <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.50)', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(255,255,255,0.65)', padding: '4px 10px', borderBottomLeftRadius: '10px', letterSpacing: '0.08em' }}>
                {ev.time}
              </div>

              <div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1, marginTop: '16px', marginBottom: '4px' }}>{ev.title}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', color: ev.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{ev.type}</div>
              </div>

              <div style={{ marginTop: '12px', padding: '7px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>REQ</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: '#F3FBFF', letterSpacing: '0.04em' }}>{ev.req}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
