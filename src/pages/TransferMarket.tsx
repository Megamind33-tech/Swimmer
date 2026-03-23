import React, { useEffect, useRef, useState } from 'react'
import { signAthlete, useSignedIds } from '../utils/clubRoster'

type MarketTier = 'ALL' | 'LOCAL' | 'CONTINENTAL' | 'INTERNATIONAL'
type ContractStatus = 'free' | 'attached'
type SortKey = 'ovr' | 'price' | 'age' | 'name'

interface MarketAthlete {
  id: string
  name: string
  age: number
  ovr: number
  stroke: string
  nationality: string
  flag: string
  club: string
  status: ContractStatus
  price: number
  tier: Exclude<MarketTier, 'ALL'>
  portraitBg: string
  portraitEmoji: string
}

const athletes: MarketAthlete[] = [
  { id: 'l1', name: 'D. Okafor', age: 22, ovr: 84, stroke: 'Freestyle', nationality: 'Nigeria', flag: '🇳🇬', club: 'Lagos Aquatics', status: 'free', price: 420000, tier: 'LOCAL', portraitBg: 'linear-gradient(160deg, #1a3a28 0%, #0c1f18 100%)', portraitEmoji: '🏊' },
  { id: 'l2', name: 'A. Mensah', age: 19, ovr: 79, stroke: 'Breaststroke', nationality: 'Ghana', flag: '🇬🇭', club: 'Accra Swim FC', status: 'attached', price: 310000, tier: 'LOCAL', portraitBg: 'linear-gradient(160deg, #2e1f0a 0%, #1a1005 100%)', portraitEmoji: '🏊' },
  { id: 'l3', name: 'T. Banda', age: 24, ovr: 87, stroke: 'Butterfly', nationality: 'Zambia', flag: '🇿🇲', club: 'Lusaka Waves', status: 'free', price: 680000, tier: 'LOCAL', portraitBg: 'linear-gradient(160deg, #1e3040 0%, #0d1a24 100%)', portraitEmoji: '🏊' },
  { id: 'l4', name: 'S. Ndlovu', age: 21, ovr: 82, stroke: 'IM', nationality: 'Zimbabwe', flag: '🇿🇼', club: 'Harare Marlins', status: 'attached', price: 495000, tier: 'LOCAL', portraitBg: 'linear-gradient(160deg, #2a1a30 0%, #160e1a 100%)', portraitEmoji: '🏊' },
  { id: 'c1', name: 'N. El-Sayed', age: 26, ovr: 91, stroke: 'Medley', nationality: 'Egypt', flag: '🇪🇬', club: 'Cairo Pharaohs SC', status: 'attached', price: 1850000, tier: 'CONTINENTAL', portraitBg: 'linear-gradient(160deg, #3a2a08 0%, #1e1504 100%)', portraitEmoji: '🏊' },
  { id: 'c2', name: 'F. Diallo', age: 23, ovr: 88, stroke: 'Freestyle', nationality: 'Senegal', flag: '🇸🇳', club: 'Dakar Sprint Club', status: 'free', price: 920000, tier: 'CONTINENTAL', portraitBg: 'linear-gradient(160deg, #0e2a1e 0%, #071510 100%)', portraitEmoji: '🏊' },
  { id: 'c3', name: 'R. Abebe', age: 20, ovr: 85, stroke: 'Distance', nationality: 'Ethiopia', flag: '🇪🇹', club: 'Addis Aqua FC', status: 'free', price: 730000, tier: 'CONTINENTAL', portraitBg: 'linear-gradient(160deg, #1a2e3a 0%, #0c1820 100%)', portraitEmoji: '🏊' },
  { id: 'c4', name: 'L. Kofi', age: 28, ovr: 93, stroke: 'Butterfly', nationality: 'Kenya', flag: '🇰🇪', club: 'Nairobi Rift Swim', status: 'attached', price: 2400000, tier: 'CONTINENTAL', portraitBg: 'linear-gradient(160deg, #301a08 0%, #180c04 100%)', portraitEmoji: '🏊' },
  { id: 'i1', name: 'C. Rousseau', age: 25, ovr: 96, stroke: 'Freestyle', nationality: 'France', flag: '🇫🇷', club: 'Paris Natation Elite', status: 'attached', price: 5200000, tier: 'INTERNATIONAL', portraitBg: 'linear-gradient(160deg, #0c1f3a 0%, #060e1c 100%)', portraitEmoji: '🏊' },
  { id: 'i2', name: 'M. Svensson', age: 22, ovr: 92, stroke: 'Breaststroke', nationality: 'Sweden', flag: '🇸🇪', club: 'Stockholm Aquatics', status: 'free', price: 3100000, tier: 'INTERNATIONAL', portraitBg: 'linear-gradient(160deg, #1a2a3e 0%, #0c1620 100%)', portraitEmoji: '🏊' },
  { id: 'i3', name: 'Y. Tanaka', age: 27, ovr: 98, stroke: 'IM', nationality: 'Japan', flag: '🇯🇵', club: 'Tokyo Dolphins', status: 'attached', price: 8800000, tier: 'INTERNATIONAL', portraitBg: 'linear-gradient(160deg, #3a0c10 0%, #1c0608 100%)', portraitEmoji: '🏊' },
  { id: 'i4', name: 'B. Carvalho', age: 21, ovr: 89, stroke: 'Sprint', nationality: 'Brazil', flag: '🇧🇷', club: 'Rio Aqua Stars', status: 'free', price: 1650000, tier: 'INTERNATIONAL', portraitBg: 'linear-gradient(160deg, #0e2e14 0%, #071608 100%)', portraitEmoji: '🏊' },
]

const TIERS: { id: MarketTier; label: string }[] = [
  { id: 'ALL', label: 'ALL' },
  { id: 'LOCAL', label: 'LOCAL' },
  { id: 'CONTINENTAL', label: 'CONTINENTAL' },
  { id: 'INTERNATIONAL', label: 'INTERNATIONAL' },
]

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'ovr', label: 'OVR HIGH → LOW' },
  { key: 'price', label: 'PRICE LOW → HIGH' },
  { key: 'age', label: 'AGE YOUNG → OLD' },
  { key: 'name', label: 'NAME A → Z' },
]

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`
  if (price >= 1_000) return `$${Math.round(price / 1_000)}K`
  return `$${price}`
}

function tierColor(ovr: number): string {
  if (ovr >= 95) return '#FFB800'
  if (ovr >= 90) return '#C8FF00'
  if (ovr >= 85) return '#18C8F0'
  return '#9EB2C7'
}

function AthleteCard({ athlete, signed, onSign }: { athlete: MarketAthlete; signed: boolean; onSign: () => void; key?: React.Key }) {
  const free = athlete.status === 'free'
  const ovrTone = tierColor(athlete.ovr)

  return (
    <article className={`swim26-market-card ${signed ? 'is-signed' : ''}`}>
      <div className="swim26-market-card__art" style={{ background: athlete.portraitBg }}>
        <div className="swim26-market-card__ovr" style={{ color: ovrTone }}>{athlete.ovr}</div>
        <div className="swim26-market-card__flag">{athlete.flag}</div>
        <div className="swim26-market-card__status" style={{ color: free ? '#3FE098' : '#FFB800' }}>{free ? 'FREE' : 'ATTACHED'}</div>
        <div className="swim26-market-card__emoji">{athlete.portraitEmoji}</div>
      </div>
      <div className="card-content swim26-stack-sm">
        <div className="swim26-section-head">
          <div>
            <div className="swim26-card-title">{athlete.name}</div>
            <div className="swim26-list-row__meta">{athlete.stroke.toUpperCase()} · AGE {athlete.age}</div>
          </div>
          <div className="swim26-value-stack">
            <span className="swim26-muted-label">TIER</span>
            <span className="swim26-goal-reward">{athlete.tier}</span>
          </div>
        </div>
        <div className="swim26-goal-block">
          <div className="swim26-goal-row"><span className="swim26-goal-title">CLUB</span><span className="swim26-goal-reward">{athlete.flag}</span></div>
          <div className="swim26-muted-line">{athlete.club}</div>
        </div>
        <div className="swim26-goal-block">
          <div className="swim26-goal-row"><span className="swim26-goal-title">PRICE</span><span className="swim26-goal-reward">{free ? 'FREE' : formatPrice(athlete.price)}</span></div>
          <div className="swim26-muted-line">{athlete.nationality} · {signed ? 'SIGNED BY YOU' : 'READY FOR APPROACH'}</div>
        </div>
      </div>
      <div className="cta-band"><button className={`swim26-btn ${signed ? 'swim26-btn-secondary' : 'swim26-btn-primary'} swim26-btn--full`} onClick={onSign} disabled={signed}>{signed ? 'SIGNED' : free ? 'SIGN' : 'APPROACH'}</button></div>
    </article>
  )
}

function SortMenu({ activeSort, onSelect, onClose }: { activeSort: SortKey; onSelect: (k: SortKey) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div ref={ref} className="swim26-market-sort-menu">
      {SORT_OPTIONS.map((opt) => (
        <button key={opt.key} className={`swim26-market-sort-option ${activeSort === opt.key ? 'is-active' : ''}`} onClick={() => { onSelect(opt.key); onClose() }}>
          <span>{opt.label}</span>
          {activeSort === opt.key && <span>✓</span>}
        </button>
      ))}
    </div>
  )
}

export function TransferMarket() {
  const [activeTier, setActiveTier] = useState<MarketTier>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('ovr')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const signedIds = useSignedIds()

  const handleSign = (athlete: MarketAthlete) => {
    signAthlete({
      id: athlete.id,
      name: athlete.name,
      age: athlete.age,
      ovr: athlete.ovr,
      stroke: athlete.stroke,
      nationality: athlete.nationality,
      flag: athlete.flag,
      club: athlete.club,
      status: athlete.status,
      price: athlete.price,
      tier: athlete.tier,
    })
  }

  const tierCounts: Record<MarketTier, number> = {
    ALL: athletes.length,
    LOCAL: athletes.filter((a) => a.tier === 'LOCAL').length,
    CONTINENTAL: athletes.filter((a) => a.tier === 'CONTINENTAL').length,
    INTERNATIONAL: athletes.filter((a) => a.tier === 'INTERNATIONAL').length,
  }

  const filtered = athletes
    .filter((athlete) => {
      const matchesTier = activeTier === 'ALL' || athlete.tier === activeTier
      const query = searchQuery.trim().toLowerCase()
      const matchesQuery = query === '' || [athlete.name, athlete.stroke, athlete.nationality, athlete.club].some((value) => value.toLowerCase().includes(query))
      return matchesTier && matchesQuery
    })
    .sort((a, b) => {
      switch (sortKey) {
        case 'ovr': return b.ovr - a.ovr
        case 'price': return a.price - b.price
        case 'age': return a.age - b.age
        case 'name': return a.name.localeCompare(b.name)
      }
    })

  const signedCount = signedIds.size

  return (
    <div className="swim26-market-page swim26-column-stack">
      <section className="swim26-card swim26-card--gold swim26-market-hero">
        <div className="swim26-card-content swim26-stack-sm">
          <div className="swim26-section-head">
            <div>
              <div className="swim26-overline">TRANSFER MARKET</div>
              <div className="swim26-card-title swim26-card-title--lg">SIGN PLAYERS</div>
            </div>
            <div className="swim26-market-sort-wrap">
              <button className="swim26-market-sort-trigger" onClick={() => setShowSortMenu((value) => !value)}>☰</button>
              {showSortMenu && <SortMenu activeSort={sortKey} onSelect={setSortKey} onClose={() => setShowSortMenu(false)} />}
            </div>
          </div>

          <div className="swim26-market-search">
            <span aria-hidden>⌕</span>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="SEARCH BY NAME, STROKE, NATIONALITY OR CLUB" />
          </div>

          <div className="swim26-market-stats">
            {[
              { label: 'AVAILABLE', value: athletes.filter((a) => a.status === 'free').length, accent: '#C8FF00' },
              { label: 'CONTRACTED', value: athletes.filter((a) => a.status === 'attached').length, accent: '#F3F7FC' },
              { label: 'SIGNED', value: signedCount, accent: '#18C8F0' },
              { label: 'TOTAL', value: athletes.length, accent: '#FFB800' },
            ].map((stat) => (
              <div className="swim26-mini-stat" key={stat.label}>
                <div className="swim26-mini-stat__label">{stat.label}</div>
                <div className="swim26-mini-stat__value" style={{ color: stat.accent }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="swim26-card swim26-card--volt">
        <div className="swim26-card-content swim26-stack-sm">
          <div className="swim26-market-filters">
            {TIERS.map((tier) => {
              const active = tier.id === activeTier
              return (
                <button key={tier.id} className={`swim26-market-filter ${active ? 'is-active' : ''}`} onClick={() => setActiveTier(tier.id)}>
                  <span>{tier.label}</span>
                  <strong>{tierCounts[tier.id]}</strong>
                </button>
              )
            })}
          </div>
          <div className="swim26-meta-line">
            <span>{SORT_OPTIONS.find((option) => option.key === sortKey)?.label ?? 'OVR HIGH → LOW'}</span>
            {searchQuery && <span>{filtered.length} MATCHES FOR “{searchQuery.toUpperCase()}”</span>}
          </div>
        </div>
      </section>

      <section className="swim26-market-grid">
        {filtered.length === 0 ? (
          <div className="swim26-card swim26-card--danger">
            <div className="swim26-card-content swim26-stack-sm">
              <div className="swim26-card-title">NO TARGETS FOUND</div>
              <div className="swim26-muted-line">Adjust your lane filters or clear the search query.</div>
            </div>
          </div>
        ) : (
          filtered.map((athlete) => (
            <AthleteCard key={athlete.id} athlete={athlete} signed={signedIds.has(athlete.id)} onSign={() => handleSign(athlete)} />
          ))
        )}
      </section>
    </div>
  )
}

export default TransferMarket
