import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search as SearchIcon, Clock, Lock } from 'lucide-react'
import {
  swim26Boundary,
  swim26Color,
  swim26Components,
  swim26Layout,
  swim26Size,
  swim26Space,
  swim26StateRules,
  swim26Type,
} from '../theme/swim26DesignSystem'

type ScoutTier = 'ALL' | 'EUROPE' | 'AMERICAS' | 'ASIA'
type ScoutSortKey = 'cost' | 'region' | 'status'

interface ScoutRegion {
  id: string
  region: string
  type: string
  time: string
  cost: number
  active: boolean
  locked: boolean
  portraitBg: string
  emoji: string
  flag: string
  tier: Exclude<ScoutTier, 'ALL'>
}

const SCOUTS: ScoutRegion[] = [
  {
    id: 'europe',
    region: 'Europe',
    type: 'Technique',
    time: '02:15:30',
    cost: 50000,
    active: true,
    locked: false,
    portraitBg: 'linear-gradient(160deg, #0c1f3a 0%, #060e1c 100%)',
    emoji: '🔭',
    flag: '🇪🇺',
    tier: 'EUROPE',
  },
  {
    id: 'americas',
    region: 'Americas',
    type: 'Speed',
    time: '--:--:--',
    cost: 75000,
    active: false,
    locked: false,
    portraitBg: 'linear-gradient(160deg, #1a3a28 0%, #0c1f18 100%)',
    emoji: '🌎',
    flag: '🌎',
    tier: 'AMERICAS',
  },
  {
    id: 'asia',
    region: 'Asia',
    type: 'Endurance',
    time: '--:--:--',
    cost: 60000,
    active: false,
    locked: true,
    portraitBg: 'linear-gradient(160deg, #2a1a30 0%, #160e1a 100%)',
    emoji: '🌏',
    flag: '🌏',
    tier: 'ASIA',
  },
]

const SCOUT_TIERS: { id: ScoutTier; label: string }[] = [
  { id: 'ALL', label: 'All Regions' },
  { id: 'EUROPE', label: 'Europe' },
  { id: 'AMERICAS', label: 'Americas' },
  { id: 'ASIA', label: 'Asia' },
]

const SCOUT_SORT: { key: ScoutSortKey; label: string }[] = [
  { key: 'cost', label: 'Scout cost (Low → High)' },
  { key: 'region', label: 'Region (A → Z)' },
  { key: 'status', label: 'Status (Active first)' },
]

const panelStyle: React.CSSProperties = {
  borderRadius: swim26Boundary.radius.md,
  border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
  background: swim26Color.surface.secondary,
  boxShadow: swim26Boundary.elevation.level1,
}

const iconButtonStyle: React.CSSProperties = {
  width: swim26Components.utilityIconButton.preferredSize,
  height: swim26Components.utilityIconButton.preferredSize,
  borderRadius: swim26Boundary.radius.sm,
  border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
  background: swim26Color.surface.secondary,
  color: swim26Color.text.secondary,
  display: 'grid',
  placeItems: 'center',
  boxShadow: swim26Boundary.elevation.level1,
  cursor: 'pointer',
  flexShrink: 0,
}

function formatScoutCost(cost: number): string {
  if (cost >= 1_000_000) return `${(cost / 1_000_000).toFixed(1)}M`
  if (cost >= 1_000) return `${(cost / 1_000).toFixed(0)}K`
  return `${cost}`
}

// ── Region card — layout parity with TransferMarket AthleteCard ───────────────
function ScoutRegionCard({
  scout,
  onDeploy,
}: {
  scout: ScoutRegion
  onDeploy: () => void
  key?: React.Key
}) {
  const isLive = scout.active
  const isLocked = scout.locked

  return (
    <div
      style={{
        ...panelStyle,
        background: 'linear-gradient(180deg, rgba(20, 38, 54, 0.96) 0%, rgba(13, 27, 39, 0.97) 100%)',
        borderRadius: swim26Boundary.radius.lg,
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: '1fr auto',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        border: isLive
          ? `1.5px solid rgba(74,201,214,0.45)`
          : panelStyle.border,
      }}
    >
      <div
        style={{
          position: 'relative',
          background: scout.portraitBg,
          height: 126,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(13,27,39,0.82) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            fontSize: 67,
            lineHeight: 1,
            userSelect: 'none',
            marginBottom: 6,
            opacity: 0.85,
          }}
        >
          {scout.emoji}
        </div>

        {/* Cost badge — top left (mirrors OVR badge) */}
        <div
          style={{
            position: 'absolute',
            top: 7,
            left: 7,
            background: 'rgba(6,20,30,0.88)',
            border: `1.5px solid ${swim26Color.accent.primary}`,
            borderRadius: swim26Boundary.radius.sm,
            padding: '2px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            lineHeight: 1,
            backdropFilter: 'blur(4px)',
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: swim26Color.accent.primary,
              letterSpacing: '-0.02em',
              fontStyle: 'italic',
            }}
          >
            {formatScoutCost(scout.cost)}
          </span>
          <span
            style={{
              fontSize: 7,
              fontWeight: 800,
              color: swim26Color.text.secondary,
              letterSpacing: '0.06em',
            }}
          >
            COST
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 7,
            right: 7,
            width: 24,
            height: 24,
            borderRadius: swim26Boundary.radius.sm,
            background: 'rgba(6,20,30,0.72)',
            border: '1px solid rgba(255,255,255,0.14)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 14,
            backdropFilter: 'blur(4px)',
          }}
        >
          {scout.flag}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 7,
            left: 7,
            padding: '2px 6px',
            borderRadius: swim26Boundary.radius.pill,
            background: isLocked
              ? 'rgba(255, 158, 87, 0.16)'
              : isLive
                ? 'rgba(74, 201, 214, 0.18)'
                : 'rgba(54, 198, 144, 0.18)',
            border: `1px solid ${
              isLocked
                ? 'rgba(255,158,87,0.36)'
                : isLive
                  ? 'rgba(74,201,214,0.40)'
                  : 'rgba(54,198,144,0.40)'
            }`,
            fontSize: 7,
            fontWeight: 800,
            letterSpacing: '0.07em',
            color: isLocked
              ? swim26Color.feedback.warning
              : isLive
                ? swim26Color.accent.primary
                : swim26Color.feedback.success,
          }}
        >
          {isLocked ? 'LOCKED' : isLive ? 'SCAN ACTIVE' : 'AVAILABLE'}
        </div>
      </div>

      <div style={{ padding: '8px 10px 10px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 2,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '-0.01em',
              color: swim26Color.text.primary,
              textTransform: 'uppercase',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '72%',
            }}
          >
            {scout.region}
          </span>
          <span
            style={{
              fontSize: 8,
              fontWeight: 700,
              color: swim26Color.text.secondary,
              letterSpacing: '0.05em',
              flexShrink: 0,
            }}
          >
            SECTOR
          </span>
        </div>

        <div
          style={{
            fontSize: 8,
            fontWeight: 800,
            color: swim26Color.accent.primary,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {scout.type}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 6px',
            borderRadius: swim26Boundary.radius.sm,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            marginBottom: 7,
          }}
        >
          <SearchIcon size={10} color={swim26Color.text.secondary} strokeWidth={2.5} style={{ opacity: 0.7 }} />
          <span
            style={{
              fontSize: 8,
              fontWeight: 700,
              color: swim26Color.text.secondary,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Talent search · {scout.tier}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 6,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 7,
                fontWeight: 700,
                color: swim26Color.text.secondary,
                letterSpacing: '0.06em',
                marginBottom: 1,
              }}
            >
              {isLive ? 'TIME LEFT' : 'SCOUT BUDGET'}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 900,
                fontStyle: 'italic',
                color: isLive ? swim26Color.accent.primary : swim26Color.featured.premium,
                letterSpacing: '-0.01em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {isLive ? scout.time : `${formatScoutCost(scout.cost)} C`}
            </div>
          </div>

          {isLive ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 10px',
                borderRadius: swim26Boundary.radius.md,
                border: `1px solid rgba(74,201,214,0.40)`,
                background: 'rgba(74,201,214,0.10)',
                color: swim26Color.accent.primary,
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: '0.05em',
                flexShrink: 0,
              }}
            >
              <Clock size={12} strokeWidth={2.5} />
              LIVE
            </div>
          ) : isLocked ? (
            <button
              type="button"
              disabled
              style={{
                padding: '6px 13px',
                borderRadius: swim26Boundary.radius.md,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: swim26Color.text.secondary,
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'not-allowed',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                minHeight: swim26Size.touch.min,
              }}
            >
              <Lock size={12} strokeWidth={2.5} />
              Locked
            </button>
          ) : (
            <button
              type="button"
              onClick={onDeploy}
              style={{
                padding: '6px 13px',
                borderRadius: swim26Boundary.radius.md,
                border: `1px solid ${swim26Color.accent.primary}`,
                background: swim26Color.accent.primary,
                color: '#06202A',
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flexShrink: 0,
                minHeight: swim26Size.touch.min,
              }}
            >
              Deploy
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ScoutSortMenu({
  activeSort,
  onSelect,
  onClose,
}: {
  activeSort: ScoutSortKey
  onSelect: (k: ScoutSortKey) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 6,
        minWidth: 200,
        borderRadius: swim26Boundary.radius.md,
        border: `1px solid ${swim26Color.divider}`,
        background: '#0d1f2d',
        boxShadow: '0 8px 32px rgba(0,0,0,0.60)',
        zIndex: 200,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '8px 12px 6px',
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: '0.10em',
          color: swim26Color.text.secondary,
          textTransform: 'uppercase',
          borderBottom: `1px solid ${swim26Color.divider}`,
        }}
      >
        Sort by
      </div>
      {SCOUT_SORT.map((opt) => {
        const isActive = activeSort === opt.key
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => {
              onSelect(opt.key)
              onClose()
            }}
            style={{
              width: '100%',
              padding: '9px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: isActive ? 'rgba(74,201,214,0.10)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? swim26Color.accent.primary : swim26Color.text.primary,
              fontSize: 11,
              fontWeight: isActive ? 800 : 600,
              letterSpacing: '0.02em',
              textAlign: 'left',
              transition: 'background 0.15s',
            }}
          >
            {opt.label}
            {isActive && <span style={{ fontSize: 12, color: swim26Color.accent.primary }}>✓</span>}
          </button>
        )
      })}
    </div>
  )
}

export function Scouts() {
  const [activeTier, setActiveTier] = useState<ScoutTier>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<ScoutSortKey>('cost')
  const [showSortMenu, setShowSortMenu] = useState(false)

  const [isRevealing, setIsRevealing] = useState(false)
  const [activeRegion, setActiveRegion] = useState<string | null>(null)

  const handleDeploy = (region: string) => {
    setActiveRegion(region)
    setIsRevealing(true)
    setTimeout(() => setIsRevealing(false), 3000)
  }

  const tierCounts: Record<ScoutTier, number> = {
    ALL: SCOUTS.length,
    EUROPE: SCOUTS.filter((s) => s.tier === 'EUROPE').length,
    AMERICAS: SCOUTS.filter((s) => s.tier === 'AMERICAS').length,
    ASIA: SCOUTS.filter((s) => s.tier === 'ASIA').length,
  }

  const filtered = SCOUTS.filter((s) => {
    const matchesTier = activeTier === 'ALL' || s.tier === activeTier
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      q === '' ||
      s.region.toLowerCase().includes(q) ||
      s.type.toLowerCase().includes(q) ||
      s.tier.toLowerCase().includes(q)
    return matchesTier && matchesSearch
  }).sort((a, b) => {
    switch (sortKey) {
      case 'cost':
        return a.cost - b.cost
      case 'region':
        return a.region.localeCompare(b.region)
      case 'status':
        return Number(b.active) - Number(a.active) || Number(a.locked) - Number(b.locked)
      default:
        return 0
    }
  })

  const activeSortLabel = SCOUT_SORT.find((o) => o.key === sortKey)?.label ?? ''

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        background: `radial-gradient(circle at 18% 18%, rgba(74, 201, 214, 0.10), transparent 22%), radial-gradient(circle at 78% 14%, rgba(214, 180, 90, 0.08), transparent 18%), linear-gradient(180deg, #09161F 0%, ${swim26Color.bg.app} 54%, #061018 100%)`,
        color: swim26Color.text.primary,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.12,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.022) 16%, transparent 16.4%, transparent 62%, rgba(255,255,255,0.018) 62.4%, transparent 63%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100%',
          padding: `${swim26Layout.safe.top}px ${swim26Layout.safe.right}px ${swim26Layout.safe.bottom}px ${swim26Layout.safe.left}px`,
          maxWidth: swim26Layout.grid.maxWidth,
          margin: '0 auto',
          boxSizing: 'border-box',
          display: 'grid',
          gridTemplateRows: 'auto auto auto auto 1fr',
          gap: swim26Space.md,
        }}
      >
        <header
          style={{
            ...panelStyle,
            borderRadius: swim26Boundary.radius.lg,
            background: swim26Color.surface.primary,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            alignItems: 'center',
            columnGap: swim26Space.md,
            padding: `0 ${swim26Space.md}px`,
            height: swim26Size.topBar.height,
          }}
        >
          <div style={{ display: 'grid', rowGap: 2, minWidth: 0 }}>
            <div
              style={{
                color: swim26Color.accent.primary,
                fontSize: swim26Type.metadata.fontSize,
                fontWeight: 700,
                letterSpacing: '0.09em',
              }}
            >
              GLOBAL SCOUTING
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: swim26Type.screenTitle.fontSize,
                lineHeight: `${swim26Type.screenTitle.lineHeight}px`,
                fontWeight: swim26Type.screenTitle.fontWeight,
                letterSpacing: swim26Type.screenTitle.letterSpacing,
                fontStyle: 'italic',
              }}
            >
              Find Talent
            </h1>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              aria-label="Sort options"
              onClick={() => setShowSortMenu((v) => !v)}
              style={{
                ...iconButtonStyle,
                background: showSortMenu ? 'rgba(74,201,214,0.14)' : swim26Color.surface.secondary,
                border: showSortMenu
                  ? `1px solid ${swim26Color.accent.primary}`
                  : `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
                color: showSortMenu ? swim26Color.accent.primary : swim26Color.text.secondary,
              }}
            >
              <span style={{ fontSize: swim26Size.icon.md }}>☰</span>
            </button>
            {showSortMenu && (
              <ScoutSortMenu
                activeSort={sortKey}
                onSelect={setSortKey}
                onClose={() => setShowSortMenu(false)}
              />
            )}
          </div>
        </header>

        <div
          style={{
            ...panelStyle,
            borderRadius: swim26Boundary.radius.lg,
            background: swim26Color.surface.primary,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: `0 ${swim26Space.md}px`,
            height: 42,
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: swim26Color.text.secondary,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ⌕
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by region, focus type, or sector…"
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: swim26Color.text.primary,
              fontSize: 13,
              fontFamily: 'inherit',
              letterSpacing: '0.01em',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: swim26Color.text.secondary,
                fontSize: 16,
                lineHeight: 1,
                padding: 0,
                flexShrink: 0,
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: swim26Space.sm,
          }}
        >
          {[
            { label: 'Scouts Sent', value: '14', accent: swim26Color.accent.primary },
            { label: 'Prospects Found', value: '9', accent: swim26Color.feedback.success },
            { label: 'Signed', value: '3', accent: swim26Color.featured.premium },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                ...panelStyle,
                padding: `${swim26Space.sm}px ${swim26Space.md}px`,
                background: swim26Color.surface.primary,
                display: 'grid',
                gap: 3,
              }}
            >
              <div
                style={{
                  fontSize: swim26Type.helper.fontSize,
                  color: swim26Color.text.secondary,
                  letterSpacing: '0.05em',
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  fontStyle: 'italic',
                  color: stat.accent,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <nav
          style={{
            ...panelStyle,
            borderRadius: swim26Boundary.radius.lg,
            background: swim26Color.surface.primary,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: swim26Space.xs,
            padding: swim26Space.xs,
          }}
        >
          {SCOUT_TIERS.map((tier) => {
            const active = activeTier === tier.id
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setActiveTier(tier.id)}
                style={{
                  position: 'relative',
                  borderRadius: swim26Boundary.radius.md,
                  border: active ? swim26StateRules.active.border : '1px solid transparent',
                  background: active ? 'rgba(74, 201, 214, 0.10)' : 'transparent',
                  color: active ? swim26Color.text.primary : swim26Color.text.secondary,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: swim26Type.buttonLabel.fontSize,
                  fontWeight: swim26Type.buttonLabel.fontWeight,
                  letterSpacing: '0.03em',
                  minHeight: swim26Size.tab.height,
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  gap: 2,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '20%',
                    right: '20%',
                    height: 2.5,
                    borderRadius: 999,
                    background: active ? swim26Color.accent.primary : 'transparent',
                    transition: 'background 0.18s',
                  }}
                />
                <span>{tier.label}</span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: active ? swim26Color.accent.primary : swim26Color.text.secondary,
                    letterSpacing: '0.06em',
                    opacity: 0.8,
                  }}
                >
                  {tier.id === 'ALL'
                    ? `${tierCounts[tier.id]} SECTORS`
                    : `${tierCounts[tier.id]} ${tierCounts[tier.id] === 1 ? 'SECTOR' : 'SECTORS'}`}
                </span>
              </button>
            )
          })}
        </nav>

        {searchQuery || sortKey !== 'cost' ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              color: swim26Color.text.secondary,
              marginTop: -swim26Space.sm,
            }}
          >
            {sortKey !== 'cost' && (
              <span>
                Sorted by{' '}
                <strong style={{ color: swim26Color.accent.primary }}>{activeSortLabel}</strong>
              </span>
            )}
            {searchQuery && (
              <span>
                {sortKey !== 'cost' ? '· ' : ''}
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} for{' '}
                <strong style={{ color: swim26Color.text.primary }}>&quot;{searchQuery}&quot;</strong>
              </span>
            )}
          </div>
        ) : null}

        <section>
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: `${swim26Space.xl}px 0`,
                color: swim26Color.text.secondary,
                fontSize: swim26Type.cardTitle.fontSize,
                fontWeight: 600,
              }}
            >
              No regions match your search.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
                gap: swim26Space.md,
              }}
            >
              {filtered.map((scout) => (
                <ScoutRegionCard key={scout.id} scout={scout} onDeploy={() => handleDeploy(scout.region)} />
              ))}
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {isRevealing && (
          <motion.div
            key="scan-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Scouting in progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: swim26Space.md,
              boxSizing: 'border-box',
              background: 'rgba(3, 10, 16, 0.78)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              style={{
                ...panelStyle,
                borderRadius: swim26Boundary.radius.lg,
                background: swim26Color.surface.primary,
                border: `1px solid ${swim26Color.accent.primary}`,
                boxShadow: swim26Boundary.elevation.level2,
                padding: swim26Space.lg,
                maxWidth: 320,
                width: '100%',
                textAlign: 'center',
              }}
            >
              <SearchIcon
                size={40}
                color={swim26Color.accent.primary}
                strokeWidth={2}
                style={{ marginBottom: swim26Space.sm }}
              />
              <div
                style={{
                  fontSize: swim26Type.sectionTitle.fontSize,
                  fontWeight: 800,
                  fontStyle: 'italic',
                  letterSpacing: '0.06em',
                  color: swim26Color.text.primary,
                }}
              >
                SCAN RUNNING
              </div>
              <div
                style={{
                  marginTop: swim26Space.sm,
                  fontSize: swim26Type.helper.fontSize,
                  color: swim26Color.text.secondary,
                  letterSpacing: '0.08em',
                }}
              >
                {activeRegion?.toUpperCase() ?? '—'} · PROSPECT POOL
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
