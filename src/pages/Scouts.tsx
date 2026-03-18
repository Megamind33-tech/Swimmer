import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapPinIcon, SearchIcon, ClockIcon, LockIcon } from 'lucide-react'

const AQUA = '#38D6FF'
const GOLD = '#D4A843'
const PANEL = 'rgba(4,20,33,0.76)'
const PANEL_BORDER = 'rgba(56,214,255,0.13)'
const PURPLE = '#A78BFA'

const SCOUTS = [
  { region: 'Europe',   type: 'Technique Focus',  time: '02:15:30', cost: 50000, accent: AQUA,   border: 'rgba(56,214,255,0.25)',   active: true,  locked: false },
  { region: 'Americas', type: 'Speed Focus',       time: '--:--:--', cost: 75000, accent: PURPLE, border: 'rgba(167,139,250,0.25)',  active: false, locked: false },
  { region: 'Asia',     type: 'Endurance Focus',   time: '--:--:--', cost: 60000, accent: GOLD,   border: 'rgba(212,168,67,0.20)',   active: false, locked: true  },
]

export function Scouts() {
  const [isRevealing, setIsRevealing] = useState(false)
  const [activeRegion, setActiveRegion] = useState<string | null>(null)

  const handleScout = (region: string) => {
    setActiveRegion(region)
    setIsRevealing(true)
    setTimeout(() => setIsRevealing(false), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'absolute', inset: 0, display: 'flex', gap: '10px', padding: '10px' }}
    >
      {/* ── LEFT: Active Missions ── */}
      <div style={{ width: '190px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '12px 14px', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: '#F3FBFF', letterSpacing: '0.06em' }}>SCOUTING</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.50)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '2px' }}>Active Missions</div>
        </div>

        <div style={{ flex: 1, borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
          {SCOUTS.map((scout) => (
            <ScoutCard
              key={scout.region}
              {...scout}
              onStart={() => handleScout(scout.region)}
            />
          ))}
        </div>

        {/* Stats */}
        <div style={{ borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '12px 14px', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <StatRow label="SCOUTS SENT" value="14" />
            <StatRow label="FOUND" value="9" />
            <StatRow label="SIGNED" value="3" />
          </div>
        </div>
      </div>

      {/* ── RIGHT: Scout Reveal ── */}
      <div style={{ flex: 1, borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: '300px', height: '300px', borderRadius: '50%', background: PURPLE, opacity: 0.04, filter: 'blur(80px)', pointerEvents: 'none' }} />

        <AnimatePresence mode="wait">
          {isRevealing ? (
            <motion.div
              key="revealing"
              initial={{ scale: 0.6, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.7 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 2 }}
            >
              <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: PURPLE, opacity: 0.30, filter: 'blur(60px)', pointerEvents: 'none' }} />
              <div style={{ width: '180px', height: '240px', borderRadius: '16px', border: `2px solid ${PURPLE}`, background: `linear-gradient(135deg, rgba(88,28,135,0.60) 0%, rgba(4,14,26,0.92) 100%)`, boxShadow: `0 0 40px rgba(167,139,250,0.35)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', zIndex: 1 }}>
                <SearchIcon size={36} color={PURPLE} style={{ marginBottom: '12px', animation: 'pulse 1.2s ease-in-out infinite' }} />
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#F3FBFF', letterSpacing: '0.06em', textAlign: 'center' }}>SCOUTING...</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', color: 'rgba(167,139,250,0.75)', marginTop: '8px', textAlign: 'center' }}>Searching {activeRegion} region</div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
            >
              <MapPinIcon size={52} color="rgba(169,211,231,0.15)" />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: 'rgba(169,211,231,0.30)', letterSpacing: '0.06em' }}>SELECT A REGION</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Start a scouting mission</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

interface ScoutCardProps {
  region: string
  type: string
  time: string
  cost: number
  accent: string
  border: string
  active?: boolean
  locked?: boolean
  onStart?: () => void
}

function ScoutCard({ region, type, time, cost, accent, border, active, locked, onStart }: ScoutCardProps) {
  return (
    <div style={{ borderRadius: '10px', border: `1px solid ${locked ? 'rgba(255,255,255,0.05)' : active ? border : PANEL_BORDER}`, background: active ? `rgba(56,214,255,0.05)` : 'rgba(0,0,0,0.20)', padding: '10px 12px', position: 'relative', overflow: 'hidden', opacity: locked ? 0.45 : 1 }}>
      {locked && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.50)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <LockIcon size={12} color="rgba(255,255,255,0.40)" />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.40)', letterSpacing: '0.10em' }}>LOCKED</span>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: '#F3FBFF', letterSpacing: '0.04em' }}>{region}</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '2px' }}>{type}</div>
        </div>
        <MapPinIcon size={14} color={active ? accent : 'rgba(169,211,231,0.30)'} />
      </div>
      {active ? (
        <div style={{ borderRadius: '7px', background: 'rgba(0,0,0,0.40)', border: `1px solid ${PANEL_BORDER}`, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ClockIcon size={11} color={GOLD} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: '#F3FBFF', letterSpacing: '0.08em' }}>{time}</span>
        </div>
      ) : (
        <button
          onClick={onStart}
          disabled={locked}
          style={{ width: '100%', height: '28px', borderRadius: '7px', cursor: locked ? 'not-allowed' : 'pointer', background: `rgba(56,214,255,0.10)`, border: `1px solid rgba(56,214,255,0.25)`, fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', letterSpacing: '0.10em', color: AQUA, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          START · {(cost / 1000).toFixed(0)}K C
        </button>
      )}
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', borderRadius: '7px', background: 'rgba(0,0,0,0.20)', border: `1px solid ${PANEL_BORDER}` }}>
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.55)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>{label}</span>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: '#F3FBFF', letterSpacing: '0.04em' }}>{value}</span>
    </div>
  )
}
