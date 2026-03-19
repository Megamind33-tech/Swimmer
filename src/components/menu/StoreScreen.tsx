import React, { useMemo, useRef, useState } from 'react';
import {
  swim26Boundary,
  swim26Color,
  swim26Components,
  swim26Layout,
  swim26Size,
  swim26Space,
  swim26StateRules,
  swim26Type,
} from '../../theme/swim26DesignSystem';

type TopCategory = 'RECOMMENDED' | 'SCORES_GEMS' | 'EXCHANGES' | 'GOLD' | 'BRONZE' | 'SILVER';
type SubCategory = 'FEATURED' | 'MONTHLY_SUPPLY_CARD' | 'RESOURCE' | 'OLYMPIADS_STORY' | 'BEST_SELLER' | 'PREMIUM_PASS' | 'COMMONWEALTH';

type PriceKind = 'premium' | 'sports' | 'cash';
type ProductKind = 'standard' | 'featured' | 'limited' | 'resource';

interface StoreProduct {
  id: string;
  topCategory: TopCategory;
  subCategory: SubCategory;
  title: string;
  subtitle?: string;
  artwork: string;
  badge?: string;
  priceLabel: string;
  priceKind: PriceKind;
  limit?: string;
  expiry?: string;
  valueNote?: string;
  kind: ProductKind;
}

interface StoreScreenProps {
  playerPremiumCurrency?: number;
  playerCoins?: number;
}

const topCategories: { id: TopCategory; label: string; badge?: string }[] = [
  { id: 'RECOMMENDED', label: 'Recommended' },
  { id: 'SCORES_GEMS', label: 'Swim Scores\n& Gems', badge: '3' },
  { id: 'EXCHANGES', label: 'Exchanges' },
  { id: 'GOLD', label: 'Gold' },
  { id: 'BRONZE', label: 'Bronze' },
  { id: 'SILVER', label: 'Silver', badge: 'NEW' },
];

const subCategories: { id: SubCategory; label: string }[] = [
  { id: 'FEATURED', label: 'Featured' },
  { id: 'MONTHLY_SUPPLY_CARD', label: 'Monthly Supply' },
  { id: 'RESOURCE', label: 'Resource' },
  { id: 'OLYMPIADS_STORY', label: "Olympiad's Story" },
  { id: 'BEST_SELLER', label: 'Best Seller' },
  { id: 'PREMIUM_PASS', label: 'Premium Pass' },
  { id: 'COMMONWEALTH', label: 'Commonwealth' },
];

const products: StoreProduct[] = [
  {
    id: 'p1',
    topCategory: 'RECOMMENDED',
    subCategory: 'FEATURED',
    title: 'Champion Launch Bundle',
    subtitle: 'Premium seasonal entry bundle',
    artwork: '🏆',
    badge: '300% VALUE',
    priceLabel: '$19.99',
    priceKind: 'cash',
    limit: '1 per account',
    expiry: 'Ends in 18H',
    valueNote: 'Includes 4,000 Gems + score boosters',
    kind: 'featured',
  },
  {
    id: 'p2',
    topCategory: 'SCORES_GEMS',
    subCategory: 'BEST_SELLER',
    title: 'Gem Vault',
    subtitle: '4,500 Gems',
    artwork: '◆',
    badge: '20% OFF',
    priceLabel: '$9.99',
    priceKind: 'cash',
    limit: 'Daily 2',
    valueNote: 'Bonus +600 gems included',
    kind: 'featured',
  },
  {
    id: 'p3',
    topCategory: 'EXCHANGES',
    subCategory: 'RESOURCE',
    title: 'Energy Conversion Pack',
    subtitle: 'Turns score fragments into boosts',
    artwork: '⚡',
    badge: 'LATEST',
    priceLabel: '1,200 SS',
    priceKind: 'sports',
    expiry: 'Refresh in 42M',
    valueNote: 'Limit 3 today',
    kind: 'resource',
  },
  {
    id: 'p4',
    topCategory: 'GOLD',
    subCategory: 'RESOURCE',
    title: 'Gold Reserve Case',
    subtitle: '80,000 club gold',
    artwork: '◉',
    badge: '50% OFF',
    priceLabel: '◆ 320',
    priceKind: 'premium',
    limit: 'Weekly 5',
    kind: 'standard',
  },
  {
    id: 'p5',
    topCategory: 'BRONZE',
    subCategory: 'COMMONWEALTH',
    title: 'Bronze Travel Pack',
    subtitle: 'Commonwealth route starter',
    artwork: '🧳',
    priceLabel: '4,000 SS',
    priceKind: 'sports',
    limit: '2 remaining',
    kind: 'standard',
  },
  {
    id: 'p6',
    topCategory: 'SILVER',
    subCategory: 'MONTHLY_SUPPLY_CARD',
    title: 'Supply Card Plus',
    subtitle: '30-day income stream',
    artwork: '🪪',
    badge: 'BEST SELLER',
    priceLabel: '$4.99',
    priceKind: 'cash',
    expiry: 'Monthly reset',
    valueNote: 'Daily gems + training keys',
    kind: 'limited',
  },
  {
    id: 'p7',
    topCategory: 'RECOMMENDED',
    subCategory: 'PREMIUM_PASS',
    title: 'Premium Pass Upgrade',
    subtitle: 'Unlock 50 reward tiers',
    artwork: '✦',
    badge: 'LATEST',
    priceLabel: '◆ 999',
    priceKind: 'premium',
    expiry: 'Season 26',
    kind: 'limited',
  },
  {
    id: 'p8',
    topCategory: 'SCORES_GEMS',
    subCategory: 'OLYMPIADS_STORY',
    title: 'Olympiad Story Set',
    subtitle: 'Narrative cosmetics + score drops',
    artwork: '📖',
    badge: '300% VALUE',
    priceLabel: '$14.99',
    priceKind: 'cash',
    limit: '1 remaining',
    kind: 'featured',
  },
];

const shellPanel: React.CSSProperties = {
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
  flexShrink: 0,
  boxShadow: swim26Boundary.elevation.level1,
};

export const StoreScreen: React.FC<StoreScreenProps> = ({
  playerPremiumCurrency = 250,
  playerCoins = 5000,
}) => {
  const [activeTopCategory, setActiveTopCategory] = useState<TopCategory>('RECOMMENDED');
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>('FEATURED');
  const subScrollRef = useRef<HTMLDivElement>(null);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const topMatches = product.topCategory === activeTopCategory || activeTopCategory === 'RECOMMENDED';
      const subMatches = product.subCategory === activeSubCategory || activeSubCategory === 'FEATURED';
      if (activeTopCategory === 'RECOMMENDED' && activeSubCategory === 'FEATURED') return true;
      return topMatches && subMatches;
    });
  }, [activeTopCategory, activeSubCategory]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 20% 18%, rgba(74, 201, 214, 0.10), transparent 22%), radial-gradient(circle at 78% 16%, rgba(214, 180, 90, 0.10), transparent 18%), linear-gradient(180deg, #09151E 0%, ${swim26Color.bg.app} 54%, #061018 100%)`,
        color: swim26Color.text.primary,
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Subtle scanline overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.16,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.022) 16%, transparent 16.4%, transparent 38%, rgba(255,255,255,0.016) 38.2%, transparent 39%, transparent 62%, rgba(255,255,255,0.02) 62.4%, transparent 63%, transparent 100%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          minHeight: 0,
          padding: `${swim26Layout.safe.top}px ${swim26Layout.safe.right}px 0 ${swim26Layout.safe.left}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: swim26Space.sm,
          maxWidth: swim26Layout.grid.maxWidth,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* ── Header ── */}
        <header
          style={{
            ...shellPanel,
            borderRadius: swim26Boundary.radius.lg,
            background: swim26Color.surface.primary,
            display: 'flex',
            alignItems: 'center',
            gap: swim26Space.md,
            padding: `0 ${swim26Space.md}px`,
            height: swim26Size.topBar.height,
            flexShrink: 0,
          }}
        >
          <button style={{ ...iconButtonStyle, color: swim26Color.text.primary }}>←</button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: swim26Type.metadata.fontSize,
                color: swim26Color.accent.primary,
                fontWeight: 700,
                letterSpacing: '0.08em',
                lineHeight: '14px',
              }}
            >
              PREMIUM RETAIL FLOOR
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: swim26Type.screenTitle.fontSize,
                lineHeight: `${swim26Type.screenTitle.lineHeight}px`,
                fontWeight: swim26Type.screenTitle.fontWeight,
                letterSpacing: swim26Type.screenTitle.letterSpacing,
              }}
            >
              Store
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: swim26Space.sm, flexShrink: 0 }}>
            <CurrencyPill label="Gems" value={`◆ ${playerPremiumCurrency.toLocaleString()}`} accent={swim26Color.accent.primary} />
            <CurrencyPill label="Scores" value={`${playerCoins.toLocaleString()} SS`} accent={swim26Color.featured.premium} />
            {(['⌕', '☰'] as const).map((icon) => (
              <button key={icon} style={iconButtonStyle}>{icon}</button>
            ))}
          </div>
        </header>

        {/* ── Top Category Tab Bar ── */}
        <div
          style={{
            ...shellPanel,
            background: swim26Color.surface.primary,
            padding: `${swim26Space.xs}px`,
            flexShrink: 0,
            display: 'flex',
            gap: swim26Space.xs,
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {topCategories.map((category) => {
            const active = activeTopCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveTopCategory(category.id)}
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  borderRadius: swim26Boundary.radius.sm,
                  border: active ? swim26StateRules.active.border : '1px solid transparent',
                  background: active ? 'rgba(74, 201, 214, 0.10)' : 'transparent',
                  color: active ? swim26Color.text.primary : swim26Color.text.secondary,
                  minWidth: 96,
                  height: 56,
                  padding: `0 ${swim26Space.md}px`,
                  fontSize: 12,
                  fontWeight: 700,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: '15px',
                  whiteSpace: 'pre-line',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '20%',
                    right: '20%',
                    height: 3,
                    borderRadius: 999,
                    background: active ? swim26Color.accent.primary : 'transparent',
                  }}
                />
                <span style={{ display: 'block' }}>{category.label}</span>
                {category.badge ? (
                  <span
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      minWidth: 18,
                      height: 18,
                      borderRadius: 999,
                      background: category.badge === 'NEW' ? swim26Color.feedback.success : swim26Color.feedback.alert,
                      color: '#fff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                  >
                    {category.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* ── Sub-category Chip Strip ── */}
        <div
          ref={subScrollRef}
          style={{
            flexShrink: 0,
            display: 'flex',
            gap: swim26Space.sm,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            paddingBottom: 2,
          }}
        >
          {subCategories.map((sub) => {
            const active = activeSubCategory === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubCategory(sub.id)}
                style={{
                  flexShrink: 0,
                  height: 36,
                  padding: `0 ${swim26Space.md}px`,
                  borderRadius: swim26Boundary.radius.pill,
                  border: active
                    ? `2px solid rgba(74, 201, 214, 0.80)`
                    : `1px solid rgba(255,255,255,0.14)`,
                  background: active ? 'rgba(74, 201, 214, 0.12)' : 'rgba(255,255,255,0.04)',
                  color: active ? swim26Color.accent.primary : swim26Color.text.secondary,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                }}
              >
                {sub.label}
              </button>
            );
          })}
        </div>

        {/* ── Product Grid ── */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            paddingBottom: swim26Space.md,
          }}
        >
          {visibleProducts.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: swim26Color.text.secondary,
                fontSize: 14,
              }}
            >
              No products in this category
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: swim26Space.md,
                alignContent: 'start',
              }}
            >
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer Notice ── */}
      <div
        style={{
          flexShrink: 0,
          borderTop: `1px solid ${swim26Color.divider}`,
          background: 'rgba(255,255,255,0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${swim26Space.sm}px ${swim26Layout.safe.right + swim26Space.md}px`,
          color: swim26Color.text.secondary,
          fontSize: swim26Type.helper.fontSize,
          gap: swim26Space.lg,
          minHeight: 40,
        }}
      >
        <span>Offers refresh daily at 00:00 UTC. Regional pricing and limit rules apply.</span>
        <span style={{ flexShrink: 0 }}>Tap any product card for expanded details.</span>
      </div>
    </div>
  );
};

function CurrencyPill({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      style={{
        minWidth: 104,
        height: swim26Size.currencyCounter.height,
        borderRadius: swim26Boundary.radius.pill,
        border: `${swim26Boundary.border.thin}px solid ${accent}44`,
        background: 'rgba(255,255,255,0.04)',
        padding: `0 ${swim26Space.sm}px`,
        display: 'grid',
        alignContent: 'center',
        justifyItems: 'end',
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 10, lineHeight: '12px', color: swim26Color.text.secondary }}>{label}</span>
      <span style={{ fontSize: 16, lineHeight: '18px', fontWeight: 800, color: accent }}>{value}</span>
    </div>
  );
}

function ProductCard({ product }: { product: StoreProduct }) {
  const featured = product.kind === 'featured';
  const limited = product.kind === 'limited';
  const resource = product.kind === 'resource';

  const borderColor = featured
    ? 'rgba(214, 180, 90, 0.30)'
    : limited
      ? 'rgba(74, 201, 214, 0.28)'
      : 'rgba(255,255,255,0.12)';

  const priceColor =
    product.priceKind === 'cash'
      ? swim26Color.featured.premium
      : product.priceKind === 'premium'
        ? swim26Color.accent.primary
        : swim26Color.text.primary;

  const buyBg =
    product.priceKind === 'cash'
      ? 'rgba(214, 180, 90, 0.22)'
      : product.priceKind === 'premium'
        ? 'rgba(74, 201, 214, 0.20)'
        : 'rgba(255,255,255,0.12)';

  const buyBorder =
    product.priceKind === 'cash'
      ? `1px solid rgba(214, 180, 90, 0.50)`
      : product.priceKind === 'premium'
        ? `1px solid rgba(74, 201, 214, 0.50)`
        : `1px solid rgba(255,255,255,0.22)`;

  return (
    <div
      style={{
        borderRadius: swim26Boundary.radius.md,
        border: `${swim26Boundary.border.thin}px solid ${borderColor}`,
        background: featured
          ? 'linear-gradient(160deg, rgba(30, 52, 72, 0.97) 0%, rgba(13, 27, 39, 0.97) 100%)'
          : resource
            ? 'linear-gradient(160deg, rgba(28, 50, 69, 0.92) 0%, rgba(13, 27, 39, 0.95) 100%)'
            : swim26Color.surface.secondary,
        boxShadow: featured ? swim26Boundary.elevation.level2 : swim26Boundary.elevation.level1,
        display: 'flex',
        flexDirection: 'column',
        padding: swim26Space.md,
        gap: swim26Space.md,
        minHeight: 240,
      }}
    >
      {/* Card top: title + badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: swim26Space.sm }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: swim26Type.cardTitle.fontSize,
              lineHeight: '20px',
              fontWeight: 700,
              color: swim26Color.text.primary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.title}
          </div>
          {product.subtitle ? (
            <div
              style={{
                marginTop: 4,
                fontSize: 12,
                lineHeight: '16px',
                color: swim26Color.text.secondary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {product.subtitle}
            </div>
          ) : null}
        </div>
        {product.badge ? (
          <span
            style={{
              flexShrink: 0,
              height: swim26Size.badge.height,
              padding: `0 ${swim26Space.sm}px`,
              borderRadius: swim26Boundary.radius.pill,
              background: product.badge.includes('OFF')
                ? 'rgba(240, 106, 95, 0.18)'
                : product.badge.includes('VALUE')
                  ? 'rgba(214, 180, 90, 0.18)'
                  : 'rgba(74, 201, 214, 0.14)',
              color: product.badge.includes('OFF')
                ? swim26Color.feedback.alert
                : product.badge.includes('VALUE')
                  ? swim26Color.featured.premium
                  : swim26Color.accent.primary,
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: 10,
              fontWeight: 800,
              whiteSpace: 'nowrap',
            }}
          >
            {product.badge}
          </span>
        ) : null}
      </div>

      {/* Artwork area */}
      <div
        style={{
          flex: 1,
          borderRadius: swim26Boundary.radius.md,
          border: `1px solid rgba(255,255,255,0.08)`,
          background: 'rgba(255,255,255,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 80,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          fontSize: featured ? 44 : 34,
        }}
      >
        {product.artwork}
      </div>

      {/* Value note */}
      {product.valueNote ? (
        <div
          style={{
            fontSize: 11,
            lineHeight: '15px',
            color: swim26Color.text.secondary,
            textAlign: 'center',
          }}
        >
          {product.valueNote}
        </div>
      ) : null}

      {/* Price row + Buy CTA */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: swim26Space.sm,
        }}
      >
        <div>
          <div style={{ fontSize: 20, lineHeight: '22px', fontWeight: 800, color: priceColor }}>
            {product.priceLabel}
          </div>
          <div style={{ display: 'flex', gap: swim26Space.sm, marginTop: 3, flexWrap: 'wrap' }}>
            {product.limit ? (
              <span style={{ fontSize: 10, lineHeight: '13px', color: swim26Color.text.secondary }}>
                {product.limit}
              </span>
            ) : null}
            {product.expiry ? (
              <span style={{ fontSize: 10, lineHeight: '13px', color: swim26Color.feedback.warning }}>
                {product.expiry}
              </span>
            ) : null}
          </div>
        </div>

        <button
          style={{
            flexShrink: 0,
            height: 40,
            minWidth: 72,
            borderRadius: swim26Boundary.radius.md,
            border: buyBorder,
            background: buyBg,
            color: priceColor,
            fontSize: swim26Type.buttonLabel.fontSize,
            fontWeight: swim26Type.buttonLabel.fontWeight,
            letterSpacing: '0.04em',
          }}
        >
          Buy
        </button>
      </div>
    </div>
  );
}

export default StoreScreen;
