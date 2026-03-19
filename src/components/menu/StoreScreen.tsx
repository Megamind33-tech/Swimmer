import React, { useMemo, useState } from 'react';
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
  { id: 'SCORES_GEMS', label: 'SWIM SCORES & Gems', badge: '3' },
  { id: 'EXCHANGES', label: 'Exchanges' },
  { id: 'GOLD', label: 'Gold' },
  { id: 'BRONZE', label: 'Bronze' },
  { id: 'SILVER', label: 'Silver', badge: 'NEW' },
];

const subCategories: { id: SubCategory; label: string }[] = [
  { id: 'FEATURED', label: 'Featured' },
  { id: 'MONTHLY_SUPPLY_CARD', label: 'Monthly Supply Card' },
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
  boxShadow: swim26Boundary.elevation.level1,
};

export const StoreScreen: React.FC<StoreScreenProps> = ({
  playerPremiumCurrency = 250,
  playerCoins = 5000,
}) => {
  const [activeTopCategory, setActiveTopCategory] = useState<TopCategory>('RECOMMENDED');
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>('FEATURED');

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
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.16,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.022) 16%, transparent 16.4%, transparent 38%, rgba(255,255,255,0.016) 38.2%, transparent 39%, transparent 62%, rgba(255,255,255,0.02) 62.4%, transparent 63%, transparent 100%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          padding: `${swim26Layout.safe.top}px ${swim26Layout.safe.right}px ${swim26Layout.safe.bottom}px ${swim26Layout.safe.left}px`,
          display: 'grid',
          gridTemplateRows: `${swim26Size.topBar.height}px 50px minmax(0, 1fr) 42px`,
          gap: swim26Space.md,
          maxWidth: swim26Layout.grid.maxWidth,
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <header
          style={{
            ...shellPanel,
            borderRadius: swim26Boundary.radius.lg,
            background: swim26Color.surface.primary,
            display: 'grid',
            gridTemplateColumns: '88px minmax(260px, 1fr) auto',
            alignItems: 'center',
            columnGap: swim26Space.md,
            padding: `0 ${swim26Space.md}px`,
          }}
        >
          <button style={{ ...iconButtonStyle, width: 48, color: swim26Color.text.primary }}>←</button>

          <div style={{ display: 'grid', rowGap: 4 }}>
            <div style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.accent.primary, fontWeight: 700, letterSpacing: '0.08em' }}>
              PREMIUM RETAIL FLOOR
            </div>
            <h1 style={{ margin: 0, fontSize: swim26Type.screenTitle.fontSize, lineHeight: `${swim26Type.screenTitle.lineHeight}px`, fontWeight: swim26Type.screenTitle.fontWeight, letterSpacing: swim26Type.screenTitle.letterSpacing }}>
              Store
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: swim26Space.sm }}>
            <CurrencyPill label="Gems" value={`◆ ${playerPremiumCurrency.toLocaleString()}`} accent={swim26Color.accent.primary} />
            <CurrencyPill label="Scores" value={`${playerCoins.toLocaleString()} SS`} accent={swim26Color.featured.premium} />
            {['⌕', '☰'].map((icon) => (
              <button key={icon} style={iconButtonStyle}>{icon}</button>
            ))}
          </div>
        </header>

        <div
          style={{
            ...shellPanel,
            background: swim26Color.surface.primary,
            padding: swim26Space.xs,
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gap: swim26Space.xs,
            alignItems: 'stretch',
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
                  borderRadius: swim26Boundary.radius.sm,
                  border: active ? swim26StateRules.active.border : '1px solid transparent',
                  background: active ? 'rgba(74, 201, 214, 0.10)' : 'transparent',
                  color: active ? swim26Color.text.primary : swim26Color.text.secondary,
                  display: 'grid',
                  placeItems: 'center',
                  padding: `0 ${swim26Space.sm}px`,
                  fontSize: 12,
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '16%',
                    right: '16%',
                    height: 3,
                    borderRadius: 999,
                    background: active ? swim26Color.accent.primary : 'transparent',
                  }}
                />
                <span>{category.label}</span>
                {category.badge ? (
                  <span
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 8,
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

        <div style={{ minHeight: 0, display: 'grid', gridTemplateColumns: '220px minmax(0, 1fr)', gap: swim26Space.md }}>
          <aside
            style={{
              ...shellPanel,
              background: swim26Color.surface.primary,
              padding: swim26Space.sm,
              display: 'grid',
              gap: swim26Space.xs,
              alignContent: 'start',
            }}
          >
            {subCategories.map((subCategory) => {
              const active = activeSubCategory === subCategory.id;
              return (
                <button
                  key={subCategory.id}
                  onClick={() => setActiveSubCategory(subCategory.id)}
                  style={{
                    borderRadius: swim26Boundary.radius.md,
                    border: active ? swim26StateRules.active.border : `1px solid transparent`,
                    background: active ? 'rgba(74, 201, 214, 0.10)' : 'rgba(255,255,255,0.02)',
                    color: active ? swim26Color.text.primary : swim26Color.text.secondary,
                    minHeight: swim26Size.buttons.standard.height,
                    padding: `0 ${swim26Space.md}px`,
                    textAlign: 'left',
                    fontSize: swim26Type.tabLabel.fontSize,
                    fontWeight: swim26Type.tabLabel.fontWeight,
                    letterSpacing: swim26Type.tabLabel.letterSpacing,
                    boxShadow: active ? swim26Boundary.elevation.level1 : 'none',
                  }}
                >
                  {subCategory.label}
                </button>
              );
            })}
          </aside>

          <section
            style={{
              ...shellPanel,
              padding: swim26Space.md,
              minHeight: 0,
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: swim26Space.md,
              alignContent: 'start',
            }}
          >
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        </div>

        <footer
          style={{
            ...shellPanel,
            background: 'rgba(255,255,255,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${swim26Space.md}px`,
            color: swim26Color.text.secondary,
            fontSize: swim26Type.helper.fontSize,
          }}
        >
          <span>Offers refresh daily at 00:00 UTC. Regional pricing and limit rules apply.</span>
          <span>Tap any product card for expanded details.</span>
        </footer>
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
      }}
    >
      <span style={{ fontSize: 10, lineHeight: '12px', color: swim26Color.text.secondary }}>{label}</span>
      <span style={{ fontSize: 16, lineHeight: '16px', fontWeight: 800, color: accent }}>{value}</span>
    </div>
  );
}

function ProductCard({ product }: { product: StoreProduct }) {
  const featured = product.kind === 'featured';
  const limited = product.kind === 'limited';
  const resource = product.kind === 'resource';

  const borderColor = featured
    ? 'rgba(214, 180, 90, 0.26)'
    : limited
      ? 'rgba(74, 201, 214, 0.24)'
      : 'rgba(255,255,255,0.10)';

  const priceColor = product.priceKind === 'cash'
    ? swim26Color.featured.premium
    : product.priceKind === 'premium'
      ? swim26Color.accent.primary
      : swim26Color.text.primary;

  return (
    <div
      style={{
        ...shellPanel,
        minHeight: featured ? 248 : 224,
        padding: swim26Space.md,
        border: `${swim26Boundary.border.thin}px solid ${borderColor}`,
        background: featured
          ? 'linear-gradient(180deg, rgba(20, 38, 54, 0.94) 0%, rgba(13, 27, 39, 0.94) 100%)'
          : resource
            ? 'linear-gradient(180deg, rgba(28, 50, 69, 0.70) 0%, rgba(13, 27, 39, 0.92) 100%)'
            : swim26Color.surface.secondary,
        display: 'grid',
        gridTemplateRows: 'auto minmax(92px, 1fr) auto',
        gap: swim26Space.md,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: swim26Space.sm, alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: swim26Type.cardTitle.fontSize, lineHeight: '20px', fontWeight: 700 }}>{product.title}</div>
          {product.subtitle ? <div style={{ marginTop: 4, fontSize: 12, lineHeight: '16px', color: swim26Color.text.secondary }}>{product.subtitle}</div> : null}
        </div>
        {product.badge ? (
          <span
            style={{
              height: swim26Size.badge.height,
              padding: `0 ${swim26Space.sm}px`,
              borderRadius: swim26Boundary.radius.pill,
              background: product.badge.includes('OFF') ? 'rgba(240, 106, 95, 0.16)' : product.badge.includes('VALUE') ? 'rgba(214, 180, 90, 0.16)' : 'rgba(74, 201, 214, 0.14)',
              color: product.badge.includes('OFF') ? swim26Color.feedback.alert : product.badge.includes('VALUE') ? swim26Color.featured.premium : swim26Color.accent.primary,
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

      <div
        style={{
          borderRadius: swim26Boundary.radius.md,
          border: `${swim26Boundary.border.thin}px solid rgba(255,255,255,0.08)`,
          background: 'rgba(255,255,255,0.03)',
          display: 'grid',
          placeItems: 'center',
          minHeight: featured ? 104 : 88,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          fontSize: featured ? 44 : 34,
        }}
      >
        {product.artwork}
      </div>

      <div style={{ display: 'grid', gap: swim26Space.sm }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: swim26Space.sm, alignItems: 'center' }}>
          <div style={{ display: 'grid', gap: 2 }}>
            <div style={{ fontSize: 18, lineHeight: '20px', fontWeight: 800, color: priceColor }}>{product.priceLabel}</div>
            {product.valueNote ? <div style={{ fontSize: 11, lineHeight: '14px', color: swim26Color.text.secondary }}>{product.valueNote}</div> : null}
          </div>
          <button
            style={{
              minWidth: swim26Size.buttons.standard.minWidth,
              minHeight: swim26Size.buttons.standard.height,
              borderRadius: swim26Boundary.radius.md,
              border: `${swim26Boundary.border.thin}px solid ${priceColor}55`,
              background: `${priceColor}18`,
              color: priceColor,
              fontSize: swim26Type.buttonLabel.fontSize,
              fontWeight: swim26Type.buttonLabel.fontWeight,
              letterSpacing: '0.02em',
            }}
          >
            Buy
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: swim26Space.sm, flexWrap: 'wrap' }}>
          {product.limit ? <span style={{ fontSize: 11, lineHeight: '14px', color: swim26Color.text.secondary }}>{product.limit}</span> : <span />}
          {product.expiry ? <span style={{ fontSize: 11, lineHeight: '14px', color: swim26Color.feedback.warning }}>{product.expiry}</span> : null}
        </div>
      </div>
    </div>
  );
}

export default StoreScreen;
