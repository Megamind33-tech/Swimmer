import React, { useState } from 'react'
import { motion } from 'motion/react'
import { MARKET_LISTINGS } from '../utils/gameData'
import { SwimmerCard } from '../components/SwimmerCard'
import { SearchIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon, SlidersHorizontalIcon } from 'lucide-react'

const AQUA = '#38D6FF'
const GOLD = '#D4A843'
const PANEL = 'rgba(4,20,33,0.76)'
const PANEL_BORDER = 'rgba(56,214,255,0.13)'

export function TransferMarket() {
  const [search, setSearch] = useState('')

  const filtered = MARKET_LISTINGS.filter((l) =>
    l.swimmer.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px' }}
    >
      {/* ── Top bar ── */}
      <div style={{ borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '10px 14px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#F3FBFF', letterSpacing: '0.06em', lineHeight: 1 }}>TRANSFER <span style={{ color: GOLD }}>MARKET</span></div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.50)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '2px' }}>{MARKET_LISTINGS.length} active listings</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <SearchIcon size={12} color="rgba(169,211,231,0.45)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ height: '30px', paddingLeft: '28px', paddingRight: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.35)', border: `1px solid rgba(56,214,255,0.18)`, outline: 'none', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '12px', color: '#F3FBFF', width: '180px', letterSpacing: '0.04em' }}
            />
          </div>
          <button style={{ height: '30px', paddingInline: '12px', borderRadius: '8px', cursor: 'pointer', background: 'rgba(56,214,255,0.08)', border: `1px solid rgba(56,214,255,0.20)`, display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: AQUA }}>
            <SlidersHorizontalIcon size={11} />
            FILTERS
          </button>
        </div>
      </div>

      {/* ── Listings grid ── */}
      <div style={{ flex: 1, overflow: 'hidden', borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '10px' }}>
        <div style={{ height: '100%', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', alignContent: 'start' }}>
          {filtered.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.01 }}
              style={{ borderRadius: '12px', border: `1px solid ${PANEL_BORDER}`, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(4,20,33,0.70) 100%)', padding: '10px', display: 'flex', gap: '10px', cursor: 'pointer', transition: 'border-color 0.2s' }}
            >
              <div style={{ flexShrink: 0 }}>
                <SwimmerCard swimmer={listing.swimmer} size="sm" />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px', marginBottom: '3px' }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '13px', color: '#F3FBFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{listing.swimmer.name}</div>
                    <TrendIcon trend={listing.trend} />
                  </div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.50)' }}>
                    Ends: <span style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#F3FBFF', letterSpacing: '0.04em', fontSize: '12px' }}>{listing.timeLeft}</span>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '8px', color: '#041421' }}>C</span>
                    </div>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: GOLD, letterSpacing: '0.04em', textShadow: '0 0 8px rgba(212,168,67,0.40)' }}>{listing.price.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      style={{ flex: 1, height: '26px', borderRadius: '7px', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.15)`, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(169,211,231,0.80)' }}
                    >
                      BID
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      style={{ flex: 1, height: '26px', borderRadius: '7px', cursor: 'pointer', background: 'rgba(13,124,102,0.30)', border: `1px solid rgba(13,124,102,0.60)`, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '0.10em', textTransform: 'uppercase', color: '#34D399' }}
                    >
                      BUY
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up')   return <TrendingUpIcon   size={13} color="#EF4444" />
  if (trend === 'down') return <TrendingDownIcon size={13} color="#34D399" />
  return <MinusIcon size={13} color="rgba(169,211,231,0.40)" />
}
