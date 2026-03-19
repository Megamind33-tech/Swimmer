import React, { useState } from 'react';
import {
  swim26Boundary,
  swim26Color,
  swim26Components,
  swim26Layout,
  swim26Size,
  swim26Space,
  swim26StateRules,
  swim26Type,
} from '../theme/swim26DesignSystem';

type MarketTier = 'ALL' | 'LOCAL' | 'CONTINENTAL' | 'INTERNATIONAL';
type ContractStatus = 'free' | 'attached';

interface MarketAthlete {
  id: string;
  name: string;
  age: number;
  ovr: number;
  stroke: string;
  nationality: string;
  flag: string;
  club: string;
  status: ContractStatus;
  price: number;
  tier: Exclude<MarketTier, 'ALL'>;
  portraitBg: string;
  portraitEmoji: string;
}

const athletes: MarketAthlete[] = [
  // LOCAL
  {
    id: 'l1',
    name: 'D. Okafor',
    age: 22,
    ovr: 84,
    stroke: 'Freestyle',
    nationality: 'Nigeria',
    flag: '🇳🇬',
    club: 'Lagos Aquatics',
    status: 'free',
    price: 420000,
    tier: 'LOCAL',
    portraitBg: 'linear-gradient(160deg, #1a3a28 0%, #0c1f18 100%)',
    portraitEmoji: '🏊',
  },
  {
    id: 'l2',
    name: 'A. Mensah',
    age: 19,
    ovr: 79,
    stroke: 'Breaststroke',
    nationality: 'Ghana',
    flag: '🇬🇭',
    club: 'Accra Swim FC',
    status: 'attached',
    price: 310000,
    tier: 'LOCAL',
    portraitBg: 'linear-gradient(160deg, #2e1f0a 0%, #1a1005 100%)',
    portraitEmoji: '🏊',
  },
  {
    id: 'l3',
    name: 'T. Banda',
    age: 24,
    ovr: 87,
    stroke: 'Butterfly',
    nationality: 'Zambia',
    flag: '🇿🇲',
    club: 'Lusaka Waves',
    status: 'free',
    price: 680000,
    tier: 'LOCAL',
    portraitBg: 'linear-gradient(160deg, #1e3040 0%, #0d1a24 100%)',
    portraitEmoji: '🏊',
  },
  {
    id: 'l4',
    name: 'S. Ndlovu',
    age: 21,
    ovr: 82,
    stroke: 'IM',
    nationality: 'Zimbabwe',
    flag: '🇿🇼',
    club: 'Harare Marlins',
    status: 'attached',
    price: 495000,
    tier: 'LOCAL',
    portraitBg: 'linear-gradient(160deg, #2a1a30 0%, #160e1a 100%)',
    portraitEmoji: '🏊',
  },

  // CONTINENTAL
  {
    id: 'c1',
    name: 'N. El-Sayed',
    age: 26,
    ovr: 91,
    stroke: 'Medley',
    nationality: 'Egypt',
    flag: '🇪🇬',
    club: 'Cairo Pharaohs SC',
    status: 'attached',
    price: 1850000,
    tier: 'CONTINENTAL',
    portraitBg: 'linear-gradient(160deg, #3a2a08 0%, #1e1504 100%)',
    portraitEmoji: '🏊',
  },
  {
    id: 'c2',
    name: 'F. Diallo',
    age: 23,
    ovr: 88,
    stroke: 'Freestyle',
    nationality: 'Senegal',
    flag: '🇸🇳',
    club: 'Dakar Sprint Club',
    status: 'free',
    price: 920000,
    tier: 'CONTINENTAL',
    portraitBg: 'linear-gradient(160deg, #0e2a1e 0%, #071510 100%)',
    portraitEmoji: '🏊',
  },
  {
    id: 'c3',
    name: 'R. Abebe',
    age: 20,
    ovr: 85,
    stroke: 'Distance',
    nationality: 'Ethiopia',
    flag: '🇪🇹',
    club: 'Addis Aqua FC',
    status: 'free',
    price: 730000,
    tier: 'CONTINENTAL',
    portraitBg: 'linear-gradient(160deg, #1a2e3a 0%, #0c1820 100%)',
    portraitEmoji: '🏊',
  },
  {
    id: 'c4',
    name: 'L. Kofi',
    age: 28,
    ovr: 93,
    stroke: 'Butterfly',
    nationality: 'Kenya',
    flag: '🇰🇪',
    club: 'Nairobi Rift Swim',
    status: 'attached',
    price: 2400000,
    tier: 'CONTINENTAL',
    portraitBg: 'linear-gradient(160deg, #301a08 0%, #180c04 100%)',
    portraitEmoji: '🏊',
  },

  // INTERNATIONAL
  {
    id: 'i1',
    name: 'C. Rousseau',
    age: 25,
    ovr: 96,
    stroke: 'Freestyle',
    nationality: 'France',
    flag: '🇫🇷',
    club: 'Paris Natation Elite',
    status: 'attached',
    price: 5200000,
    tier: 'INTERNATIONAL',
    portraitBg: 'linear-gradient(160deg, #0c1f3a 0%, #060e1c 100%)',
    portraitEmoji: '🏊',
  },
  {
    id: 'i2',
    name: 'M. Svensson',
    age: 22,
    ovr: 92,
    stroke: 'Breaststroke',
    nationality: 'Sweden',
    flag: '🇸🇪',
    club: 'Stockholm Aquatics',
    status: 'free',
    price: 3100000,
    tier: 'INTERNATIONAL',
    portraitBg: 'linear-gradient(160deg, #1a2a3e 0%, #0c1620 100%)',
    portraitEmoji: '🏊',
  },
  {
    id: 'i3',
    name: 'Y. Tanaka',
    age: 27,
    ovr: 98,
    stroke: 'IM',
    nationality: 'Japan',
    flag: '🇯🇵',
    club: 'Tokyo Dolphins',
    status: 'attached',
    price: 8800000,
    tier: 'INTERNATIONAL',
    portraitBg: 'linear-gradient(160deg, #3a0c10 0%, #1c0608 100%)',
    portraitEmoji: '🏊',
  },
  {
    id: 'i4',
    name: 'B. Carvalho',
    age: 21,
    ovr: 89,
    stroke: 'Sprint',
    nationality: 'Brazil',
    flag: '🇧🇷',
    club: 'Rio Aqua Stars',
    status: 'free',
    price: 1650000,
    tier: 'INTERNATIONAL',
    portraitBg: 'linear-gradient(160deg, #0e2e14 0%, #071608 100%)',
    portraitEmoji: '🏊',
  },
];

const TIERS: { id: MarketTier; label: string }[] = [
  { id: 'ALL', label: 'All Players' },
  { id: 'LOCAL', label: 'Local' },
  { id: 'CONTINENTAL', label: 'Continental' },
  { id: 'INTERNATIONAL', label: 'International' },
];

const panelStyle: React.CSSProperties = {
  borderRadius: swim26Boundary.radius.md,
  border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
  background: swim26Color.surface.secondary,
  boxShadow: swim26Boundary.elevation.level1,
};

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
};

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `$${(price / 1_000).toFixed(0)}K`;
  return `$${price}`;
}

function OvrTierColor(ovr: number): string {
  if (ovr >= 95) return swim26Color.featured.premium;
  if (ovr >= 90) return '#b06aff';
  if (ovr >= 85) return swim26Color.accent.primary;
  return swim26Color.text.secondary;
}

function AthleteCard({ athlete, signed, onSign }: { athlete: MarketAthlete; signed: boolean; onSign: () => void }) {
  const ovrColor = OvrTierColor(athlete.ovr);
  const isFree = athlete.status === 'free';

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
      }}
    >
      {/* Portrait area */}
      <div
        style={{
          position: 'relative',
          background: athlete.portraitBg,
          height: 180,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        {/* Shimmer overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(13,27,39,0.82) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Athlete silhouette / artwork */}
        <div
          style={{
            fontSize: 96,
            lineHeight: 1,
            userSelect: 'none',
            marginBottom: 8,
            opacity: 0.85,
          }}
        >
          {athlete.portraitEmoji}
        </div>

        {/* OVR badge – top left */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'rgba(6,20,30,0.88)',
            border: `1.5px solid ${ovrColor}`,
            borderRadius: swim26Boundary.radius.sm,
            padding: '3px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            lineHeight: 1,
            backdropFilter: 'blur(4px)',
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: ovrColor,
              letterSpacing: '-0.02em',
              fontStyle: 'italic',
            }}
          >
            {athlete.ovr}
          </span>
          <span style={{ fontSize: 8, fontWeight: 800, color: swim26Color.text.secondary, letterSpacing: '0.06em' }}>
            OVR
          </span>
        </div>

        {/* Flag – top right */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 34,
            height: 34,
            borderRadius: swim26Boundary.radius.sm,
            background: 'rgba(6,20,30,0.72)',
            border: `1px solid rgba(255,255,255,0.14)`,
            display: 'grid',
            placeItems: 'center',
            fontSize: 20,
            backdropFilter: 'blur(4px)',
          }}
        >
          {athlete.flag}
        </div>

        {/* Status badge – bottom left */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            padding: '2px 8px',
            borderRadius: swim26Boundary.radius.pill,
            background: isFree ? 'rgba(54, 198, 144, 0.18)' : 'rgba(255, 158, 87, 0.16)',
            border: `1px solid ${isFree ? 'rgba(54,198,144,0.40)' : 'rgba(255,158,87,0.36)'}`,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.07em',
            color: isFree ? swim26Color.feedback.success : swim26Color.feedback.warning,
          }}
        >
          {isFree ? 'FREE AGENT' : 'CONTRACTED'}
        </div>
      </div>

      {/* Card info */}
      <div style={{ padding: '12px 14px 14px' }}>
        {/* Name + age */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '-0.01em',
              color: swim26Color.text.primary,
              textTransform: 'uppercase',
            }}
          >
            {athlete.name}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: swim26Color.text.secondary,
              letterSpacing: '0.05em',
            }}
          >
            AGE {athlete.age}
          </span>
        </div>

        {/* Stroke */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: swim26Color.accent.primary,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          {athlete.stroke}
        </div>

        {/* Club */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 8px',
            borderRadius: swim26Boundary.radius.sm,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid rgba(255,255,255,0.07)`,
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 12, opacity: 0.6 }}>🏟</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: swim26Color.text.secondary,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {athlete.club}
          </span>
        </div>

        {/* Price + Buy */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, color: swim26Color.text.secondary, letterSpacing: '0.06em', marginBottom: 1 }}>
              TRANSFER FEE
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 900,
                fontStyle: 'italic',
                color: isFree ? swim26Color.feedback.success : swim26Color.featured.premium,
                letterSpacing: '-0.01em',
              }}
            >
              {isFree ? 'Free' : formatPrice(athlete.price)}
            </div>
          </div>

          <button
            onClick={onSign}
            disabled={signed}
            style={{
              padding: '9px 18px',
              borderRadius: swim26Boundary.radius.md,
              border: signed
                ? '1px solid rgba(54,198,144,0.40)'
                : `1px solid ${swim26Color.accent.primary}`,
              background: signed
                ? 'rgba(54,198,144,0.12)'
                : swim26Color.accent.primary,
              color: signed ? swim26Color.feedback.success : '#06202A',
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: signed ? 'default' : 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            {signed ? '✓ Signed' : 'Sign Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TransferMarket() {
  const [activeTier, setActiveTier] = useState<MarketTier>('ALL');
  const [signedIds, setSignedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = athletes.filter((a) => {
    const matchesTier = activeTier === 'ALL' || a.tier === activeTier;
    const matchesSearch =
      searchQuery.trim() === '' ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.stroke.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.nationality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const handleSign = (id: string) => {
    setSignedIds((prev) => new Set(prev).add(id));
  };

  const tierCounts: Record<MarketTier, number> = {
    ALL: athletes.length,
    LOCAL: athletes.filter((a) => a.tier === 'LOCAL').length,
    CONTINENTAL: athletes.filter((a) => a.tier === 'CONTINENTAL').length,
    INTERNATIONAL: athletes.filter((a) => a.tier === 'INTERNATIONAL').length,
  };

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
      {/* Subtle scanline texture */}
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
          gridTemplateRows: 'auto auto auto 1fr',
          gap: swim26Space.md,
        }}
      >
        {/* ── HEADER ── */}
        <header
          style={{
            ...panelStyle,
            borderRadius: swim26Boundary.radius.lg,
            background: swim26Color.surface.primary,
            display: 'grid',
            gridTemplateColumns: '48px minmax(0, 1fr) auto',
            alignItems: 'center',
            columnGap: swim26Space.md,
            padding: `0 ${swim26Space.md}px`,
            height: swim26Size.topBar.height,
          }}
        >
          <button style={{ ...iconButtonStyle, width: 48, color: swim26Color.text.primary }}>←</button>

          <div style={{ display: 'grid', rowGap: 2, minWidth: 0 }}>
            <div
              style={{
                color: swim26Color.accent.primary,
                fontSize: swim26Type.metadata.fontSize,
                fontWeight: 700,
                letterSpacing: '0.09em',
              }}
            >
              TRANSFER MARKET
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
              Sign Players
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: swim26Space.sm }}>
            {/* Search input inline */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 12px',
                height: swim26Components.utilityIconButton.preferredSize,
                borderRadius: swim26Boundary.radius.sm,
                border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
                background: swim26Color.surface.secondary,
                boxShadow: swim26Boundary.elevation.level1,
              }}
            >
              <span style={{ fontSize: swim26Size.icon.md, color: swim26Color.text.secondary, lineHeight: 1 }}>⌕</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, stroke, nation…"
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: swim26Color.text.primary,
                  fontSize: swim26Type.helper.fontSize,
                  width: 160,
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <button aria-label="Filters" style={iconButtonStyle}>
              <span style={{ fontSize: swim26Size.icon.md }}>☰</span>
            </button>
          </div>
        </header>

        {/* ── STATS ROW ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: swim26Space.sm,
          }}
        >
          {[
            { label: 'Available', value: athletes.filter((a) => a.status === 'free').length, accent: swim26Color.feedback.success },
            { label: 'Contracted', value: athletes.filter((a) => a.status === 'attached').length, accent: swim26Color.feedback.warning },
            { label: 'Signed by You', value: signedIds.size, accent: swim26Color.accent.primary },
            { label: 'Total Listed', value: athletes.length, accent: swim26Color.text.secondary },
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
              <div style={{ fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary, letterSpacing: '0.05em' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, fontStyle: 'italic', color: stat.accent, lineHeight: 1 }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── TIER FILTER TABS ── */}
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
          {TIERS.map((tier) => {
            const active = activeTier === tier.id;
            return (
              <button
                key={tier.id}
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
                  {tierCounts[tier.id]} PLAYERS
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── PLAYER GRID ── */}
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
              No players found matching your search.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: swim26Space.md,
              }}
            >
              {filtered.map((athlete) => (
                <AthleteCard
                  key={athlete.id}
                  athlete={athlete}
                  signed={signedIds.has(athlete.id)}
                  onSign={() => handleSign(athlete.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
