import React, { useState } from 'react'
import { motion } from 'motion/react'
import { TrophyIcon, MedalIcon, ChevronUpIcon, ChevronDownIcon, MinusIcon } from 'lucide-react'

const AQUA = 'var(--color-volt)'
const GOLD = 'var(--color-volt)'
const SILVER = '#A8B2BD'
const BRONZE = '#CD7F32'
const PANEL = 'rgba(4,20,33,0.76)'
const PANEL_BORDER = 'rgba(56,214,255,0.13)'

type RankCategory = 'global' | 'national' | 'club'

const RANK_CATEGORIES: { id: RankCategory; label: string }[] = [
  { id: 'global',   label: 'GLOBAL'   },
  { id: 'national', label: 'NATIONAL' },
  { id: 'club',     label: 'CLUB'     },
]

interface RankEntry {
  rank:   number;
  name:   string;
  club:   string;
  ovr:    number;
  points: number;
  change: 'up' | 'down' | 'same';
  isPlayer?: boolean;
}

const GLOBAL_RANKINGS: RankEntry[] = [
  { rank: 1,  name: 'A. Thorpe',   club: 'Sydney Sharks',   ovr: 98, points: 12840, change: 'same' },
  { rank: 2,  name: 'M. Phelps',   club: 'Baltimore Blaze', ovr: 97, points: 12310, change: 'up'   },
  { rank: 3,  name: 'C. le Clos',  club: 'Cape Cobras',     ovr: 95, points: 11980, change: 'down' },
  { rank: 4,  name: 'K. Dressel',  club: 'Gator Swim Club', ovr: 94, points: 11450, change: 'up'   },
  { rank: 5,  name: 'A. Sullivan', club: 'Aqua Dragons',    ovr: 92, points: 11100, change: 'up'   },
  { rank: 6,  name: 'R. Dreyer',   club: 'Nordic Waves',    ovr: 91, points: 10870, change: 'down' },
  { rank: 7,  name: 'T. Nakamura', club: 'Tokyo Tsunamis',  ovr: 90, points: 10540, change: 'same' },
  { rank: 8,  name: 'YOU',         club: 'Aqua Dragons',    ovr: 87, points: 9820,  change: 'up', isPlayer: true },
  { rank: 9,  name: 'P. Morozov',  club: 'Moscow Manta',    ovr: 86, points: 9650,  change: 'down' },
  { rank: 10, name: 'L. Santos',   club: 'Rio Reef',        ovr: 85, points: 9310,  change: 'same' },
]

const NATIONAL_RANKINGS: RankEntry[] = [
  { rank: 1,  name: 'C. Harris',  club: 'Aqua Dragons',    ovr: 93, points: 8400, change: 'same' },
  { rank: 2,  name: 'J. Blake',   club: 'London Lanes',    ovr: 91, points: 8100, change: 'up'   },
  { rank: 3,  name: 'S. Moore',   club: 'Manchester Mako', ovr: 89, points: 7850, change: 'down' },
  { rank: 4,  name: 'YOU',        club: 'Aqua Dragons',    ovr: 87, points: 7420, change: 'up', isPlayer: true },
  { rank: 5,  name: 'T. Evans',   club: 'Bristol Barracuda', ovr: 85, points: 7200, change: 'same' },
]

const CLUB_RANKINGS: RankEntry[] = [
  { rank: 1, name: 'C. Harris',  club: 'Aqua Dragons', ovr: 93, points: 5200, change: 'same' },
  { rank: 2, name: 'M. Webb',    club: 'Aqua Dragons', ovr: 90, points: 4980, change: 'up'   },
  { rank: 3, name: 'YOU',        club: 'Aqua Dragons', ovr: 87, points: 4620, change: 'up', isPlayer: true },
  { rank: 4, name: 'A. Price',   club: 'Aqua Dragons', ovr: 84, points: 4310, change: 'down' },
  { rank: 5, name: 'D. Walsh',   club: 'Aqua Dragons', ovr: 82, points: 4050, change: 'same' },
]

const DATA: Record<RankCategory, RankEntry[]> = {
  global:   GLOBAL_RANKINGS,
  national: NATIONAL_RANKINGS,
  club:     CLUB_RANKINGS,
}

function rankColor(rank: number) {
  if (rank === 1) return GOLD
  if (rank === 2) return SILVER
  if (rank === 3) return BRONZE
  return 'rgba(169,211,231,0.55)'
}

function ChangeIcon({ change }: { change: RankEntry['change'] }) {
  if (change === 'up')   return <ChevronUpIcon   size={12} color="#34D399" />
  if (change === 'down') return <ChevronDownIcon size={12} color="#F87171" />
  return <MinusIcon size={12} color="rgba(169,211,231,0.35)" />
}

export function Rankings() {
  const [category, setCategory] = useState<RankCategory>('global')
  const rows = DATA[category]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}
    >
      {/* Header */}
      <div className="swim26-rankings-header" style={{ borderRadius: '14px', border: `1px solid rgba(212,168,67,0.25)`, background: 'linear-gradient(135deg, rgba(28,22,8,0.92) 0%, rgba(17,13,3,0.92) 100%)', backdropFilter: 'blur(14px)', padding: '10px 14px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <TrophyIcon size={22} color={GOLD} strokeWidth={1.5} style={{ filter: `drop-shadow(0 0 10px rgba(212,168,67,0.55))`, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: '#F3FBFF', letterSpacing: '0.06em', lineHeight: 1 }}>LEADERBOARD</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(232,224,208,0.60)', marginTop: '1px' }}>Season 26 · Week 8</div>
        </div>
        {/* Player rank badge */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(56,214,255,0.65)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>YOUR RANK</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: AQUA, lineHeight: 1, filter: `drop-shadow(0 0 8px rgba(56,214,255,0.50))` }}>#{rows.find(r => r.isPlayer)?.rank ?? '—'}</div>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        {RANK_CATEGORIES.map(cat => {
          const active = category === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                flex: 1, minHeight: '44px', border: `1px solid ${active ? 'rgba(56,214,255,0.40)' : PANEL_BORDER}`,
                borderRadius: '10px', background: active ? 'rgba(56,214,255,0.10)' : PANEL,
                backdropFilter: 'blur(8px)', cursor: 'pointer',
                fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.10em',
                color: active ? AQUA : 'rgba(169,211,231,0.55)',
              }}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Rankings list */}
      <div style={{ flex: 1, borderRadius: '16px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(14px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 60px 70px 24px', gap: '8px', padding: '8px 16px', borderBottom: '1px solid rgba(56,214,255,0.08)' }}>
          {['#', 'SWIMMER', 'OVR', 'PTS', ''].map(h => (
            <span key={h} style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '0.14em', color: 'rgba(169,211,231,0.40)', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {rows.map((entry, i) => {
            const isPlayer = entry.isPlayer
            return (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  display: 'grid', gridTemplateColumns: '40px 1fr 60px 70px 24px', gap: '8px',
                  padding: '10px 16px', alignItems: 'center',
                  background: isPlayer ? 'rgba(56,214,255,0.07)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  borderLeft: isPlayer ? `3px solid ${AQUA}` : '3px solid transparent',
                }}
              >
                {/* Rank */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {entry.rank <= 3 ? (
                    <MedalIcon size={18} color={rankColor(entry.rank)} />
                  ) : (
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: rankColor(entry.rank) }}>{entry.rank}</span>
                  )}
                </div>
                {/* Name + club */}
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '13px', color: isPlayer ? AQUA : '#F3FBFF', letterSpacing: '0.04em' }}>{entry.name}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.45)', letterSpacing: '0.06em' }}>{entry.club}</div>
                </div>
                {/* OVR */}
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: 'rgba(232,224,208,0.80)', letterSpacing: '0.04em' }}>{entry.ovr}</div>
                {/* Points */}
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: isPlayer ? AQUA : '#F3FBFF', letterSpacing: '0.04em' }}>{entry.points.toLocaleString()}</div>
                {/* Change */}
                <ChangeIcon change={entry.change} />
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
