import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useClubCareer } from '../context/CareerSaveContext'

type MarketTier = 'ALL' | 'LOCAL' | 'CONTINENTAL' | 'INTERNATIONAL'
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
  available: boolean
  price: number
  tier: Exclude<MarketTier, 'ALL'>
  portraitBg: string
  portraitEmoji: string
}

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

function getMarketTier(ovr: number): Exclude<MarketTier, 'ALL'> {
  if (ovr >= 92) return 'INTERNATIONAL'
  if (ovr >= 84) return 'CONTINENTAL'
  return 'LOCAL'
}

function getPortraitBg(tier: Exclude<MarketTier, 'ALL'>): string {
  switch (tier) {
    case 'INTERNATIONAL': return 'linear-gradient(160deg, #3a0c10 0%, #1c0608 100%)'
    case 'CONTINENTAL': return 'linear-gradient(160deg, #0c1f3a 0%, #060e1c 100%)'
    case 'LOCAL':
    default: return 'linear-gradient(160deg, #1e3040 0%, #0d1a24 100%)'
  }
}

function AthleteCard({ athlete, affordable, signed, onSign }: { athlete: MarketAthlete; affordable: boolean; signed: boolean; onSign: () => void; key?: React.Key }) {
  const ovrTone = tierColor(athlete.ovr)
  const actionLabel = signed ? 'SIGNED' : affordable ? 'SIGN' : 'SHORT FUNDS'

  return (
    <article className={`swim26-market-card ${signed ? 'is-signed' : ''}`}>
      <div className="swim26-market-card__art" style={{ background: athlete.portraitBg }}>
        <div className="swim26-market-card__ovr" style={{ color: ovrTone }}>{athlete.ovr}</div>
        <div className="swim26-market-card__flag">{athlete.flag}</div>
        <div className="swim26-market-card__status" style={{ color: athlete.available ? '#3FE098' : '#FFB800' }}>{athlete.available ? 'AVAILABLE' : 'SIGNED'}</div>
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
          <div className="swim26-goal-row"><span className="swim26-goal-title">NATION</span><span className="swim26-goal-reward">{athlete.flag}</span></div>
          <div className="swim26-muted-line">{athlete.club}</div>
        </div>
        <div className="swim26-goal-block">
          <div className="swim26-goal-row"><span className="swim26-goal-title">PRICE</span><span className="swim26-goal-reward">{formatPrice(athlete.price)}</span></div>
          <div className="swim26-muted-line">{athlete.nationality} · {signed ? 'ALREADY ON YOUR CLUB' : affordable ? 'READY FOR APPROACH' : 'BUDGET TOO LOW'}</div>
        </div>
      </div>
      <div className="cta-band"><button className={`swim26-btn ${signed ? 'swim26-btn-secondary' : affordable ? 'swim26-btn-primary' : 'swim26-btn-ghost'} swim26-btn--full primary-cta`} onClick={onSign} disabled={signed || !affordable}>{actionLabel}</button></div>
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
  const { state: clubState, dispatch } = useClubCareer()
  const [activeTier, setActiveTier] = useState<MarketTier>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('ovr')
  const [showSortMenu, setShowSortMenu] = useState(false)

  const athletes = useMemo<MarketAthlete[]>(
    () => clubState.transferTargets.map((target) => {
      const tier = getMarketTier(target.ovr)
      return {
        id: target.id,
        name: target.name,
        age: target.age,
        ovr: target.ovr,
        stroke: target.stroke,
        nationality: target.country,
        flag: target.country,
        club: `${tier.toLowerCase()} circuit target`,
        available: target.available,
        price: target.price,
        tier,
        portraitBg: getPortraitBg(tier),
        portraitEmoji: '🏊',
      }
    }),
    [clubState.transferTargets],
  )

  const handleSign = (athlete: MarketAthlete) => {
    if (!athlete.available || athlete.price > clubState.budget) return
    dispatch({ type: 'CLUB_SIGN_PLAYER', athleteId: athlete.id })
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

  const signedCount = athletes.filter((athlete) => !athlete.available).length

  return (
    <div className="swim26-market-page swim26-column-stack swim26-page-pattern swim26-page-pattern--list">
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
              { label: 'AVAILABLE', value: athletes.filter((a) => a.available).length, accent: '#C8FF00' },
              { label: 'SIGNED', value: signedCount, accent: '#18C8F0' },
              { label: 'BUDGET', value: formatPrice(clubState.budget), accent: '#FFB800' },
              { label: 'TOTAL', value: athletes.length, accent: '#F3F7FC' },
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
            <AthleteCard
              key={athlete.id}
              athlete={athlete}
              signed={!athlete.available}
              affordable={athlete.price <= clubState.budget}
              onSign={() => handleSign(athlete)}
            />
          ))
        )}
      </section>
    </div>
  )
}

export default TransferMarket
