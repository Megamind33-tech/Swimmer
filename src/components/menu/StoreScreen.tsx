import React, { useMemo, useRef, useState } from 'react';
import { useIsLandscapeMobile } from '../../hooks/useIsLandscapeMobile';
import { motion } from 'motion/react';
import { ChevronLeft, Search, SlidersHorizontal } from 'lucide-react';
import {
  swim26Boundary,
  swim26Color,
  swim26Space,
  swim26Type,
} from '../../theme/swim26DesignSystem';
import { USER_DATA } from '../../utils/gameData';

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
  onBack?: () => void;
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

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export const StoreScreen: React.FC<StoreScreenProps> = ({
  playerPremiumCurrency = USER_DATA.currencies.gems,
  playerCoins = USER_DATA.currencies.coins,
  onBack,
}) => {
  const [activeTopCategory, setActiveTopCategory] = useState<TopCategory>('RECOMMENDED');
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>('FEATURED');
  const subScrollRef = useRef<HTMLDivElement>(null);
  const isMobileLandscape = useIsLandscapeMobile();

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
        background: `radial-gradient(circle at 20% 10%, rgba(74, 201, 214, 0.10), transparent 22%),
          radial-gradient(circle at 78% 8%, rgba(214, 180, 90, 0.10), transparent 18%),
          linear-gradient(180deg, #09151E 0%, ${swim26Color.bg.app} 54%, #061018 100%)`,
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

      {/* ── Integrated Store Header ── */}
      <div
        style={{
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
          background: 'rgba(4, 20, 33, 0.95)',
          borderBottom: '1px solid rgba(74, 201, 214, 0.18)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '0 12px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {/* Back button */}
        {onBack && (
          <motion.button
            aria-label="Back to Lobby"
            title="Back to Lobby"
            whileTap={{ scale: 0.90 }}
            onClick={onBack}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A843] focus-visible:ring-offset-2 focus-visible:ring-offset-[#041421]"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: '5px 10px 5px 6px',
              minHeight: '44px',
              borderRadius: '8px',
              background: 'rgba(4,20,33,0.80)',
              border: '1px solid rgba(56,214,255,0.20)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={14} color="rgba(169,211,231,0.80)" />
            <span style={{
              fontFamily: "'Rajdhani', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: '9px',
              letterSpacing: '0.12em',
              color: 'rgba(169,211,231,0.80)',
              textTransform: 'uppercase',
            }}>
              Lobby
            </span>
          </motion.button>
        )}

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Rajdhani', system-ui, sans-serif",
            fontWeight: 900,
            fontSize: '17px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#ffffff',
            lineHeight: 1,
          }}>
            Premium Store
          </div>
          <div style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: swim26Color.accent.primary,
            lineHeight: 1,
            marginTop: '2px',
          }}>
            PREMIUM RETAIL FLOOR
          </div>
        </div>

        {/* Currency badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(4,20,33,0.65)',
            border: '1px solid rgba(74,201,214,0.30)',
            borderRadius: '100px',
            padding: '3px 8px 3px 6px',
          }}>
            <span style={{ fontSize: '12px', lineHeight: 1 }}>💎</span>
            <span style={{
              fontFamily: "'Rajdhani', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: '11px',
              color: swim26Color.accent.primary,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {formatCurrency(playerPremiumCurrency)}
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(4,20,33,0.65)',
            border: '1px solid rgba(212,168,67,0.30)',
            borderRadius: '100px',
            padding: '3px 8px 3px 6px',
          }}>
            <span style={{ fontSize: '12px', lineHeight: 1 }}>🪙</span>
            <span style={{
              fontFamily: "'Rajdhani', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: '11px',
              color: '#D4A843',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {formatCurrency(playerCoins)}
            </span>
          </div>
          <motion.button
            aria-label="Search Store"
            title="Search Store"
            whileTap={{ scale: 0.90 }}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38D6FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#041421]"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Search size={13} color="rgba(169,211,231,0.70)" />
          </motion.button>
          <motion.button
            aria-label="Filter Options"
            title="Filter Options"
            whileTap={{ scale: 0.90 }}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38D6FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#041421]"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <SlidersHorizontal size={13} color="rgba(169,211,231,0.70)" />
          </motion.button>
        </div>
      </div>

      {/* ── Top Category Tab Bar ── */}
      <div
        style={{
          flexShrink: 0,
          position: 'relative',
          zIndex: 9,
          background: 'rgba(6, 18, 30, 0.90)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          gap: 0,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          paddingInline: '8px',
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
                border: 'none',
                background: 'transparent',
                color: active ? swim26Color.text.primary : swim26Color.text.secondary,
                minWidth: 72,
                minHeight: 44,
                padding: '0 12px',
                fontSize: 11,
                fontWeight: 700,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '13px',
                whiteSpace: 'pre-line',
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
            >
              {/* Active underline */}
              {active && (
                <motion.span
                  layoutId="store-top-tab"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '15%',
                    right: '15%',
                    height: 2,
                    borderRadius: '2px 2px 0 0',
                    background: swim26Color.accent.primary,
                    boxShadow: `0 0 8px ${swim26Color.accent.primary}`,
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span style={{ display: 'block' }}>{category.label}</span>
              {category.badge ? (
                <span
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 4,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 999,
                    background: category.badge === 'NEW' ? swim26Color.feedback.success : swim26Color.feedback.alert,
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                    fontSize: 8,
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
          gap: '6px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          padding: '7px 10px',
          background: 'rgba(6, 18, 30, 0.70)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
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
                minHeight: 44,
                padding: '0 11px',
                borderRadius: swim26Boundary.radius.pill,
                border: active
                  ? `1.5px solid rgba(74, 201, 214, 0.80)`
                  : `1px solid rgba(255,255,255,0.12)`,
                background: active ? 'rgba(74, 201, 214, 0.12)' : 'rgba(255,255,255,0.04)',
                color: active ? swim26Color.accent.primary : swim26Color.text.secondary,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
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
          padding: `${swim26Space.md}px 10px`,
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
              gridTemplateColumns: isMobileLandscape ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
              gap: '10px',
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
  );
};

// ─── OVR value mapping per kind ───────────────────────────────────────────────
function kindOvr(product: StoreProduct): number {
  if (product.kind === 'featured') return 117;
  if (product.kind === 'limited')  return 114;
  if (product.kind === 'resource') return 110;
  return 108;
}

// ─── Card rarity palette ──────────────────────────────────────────────────────
function rarityPalette(product: StoreProduct) {
  if (product.kind === 'featured') {
    return {
      bg: 'linear-gradient(175deg, #C8972A 0%, #8B6118 38%, #1E1408 100%)',
      border: 'rgba(212,168,67,0.65)',
      accent: '#D4A843',
      glow: 'rgba(212,168,67,0.30)',
    };
  }
  if (product.kind === 'limited') {
    return {
      bg: 'linear-gradient(175deg, #7B4FBE 0%, #4A2580 38%, #120820 100%)',
      border: 'rgba(155,107,212,0.65)',
      accent: '#B488F0',
      glow: 'rgba(155,107,212,0.30)',
    };
  }
  if (product.kind === 'resource') {
    return {
      bg: 'linear-gradient(175deg, #1E6E7A 0%, #0D4250 38%, #041218 100%)',
      border: 'rgba(74,201,214,0.55)',
      accent: 'var(--color-volt)',
      glow: 'rgba(74,201,214,0.25)',
    };
  }
  // standard
  return {
    bg: 'linear-gradient(175deg, #1C3A56 0%, #0D1F30 50%, #06111C 100%)',
    border: 'rgba(56,160,200,0.40)',
    accent: '#38A0C8',
    glow: 'rgba(56,160,200,0.18)',
  };
}

// ─── Price kind icon ──────────────────────────────────────────────────────────
function priceIcon(kind: PriceKind) {
  if (kind === 'cash')    return '💵';
  if (kind === 'premium') return '💎';
  return '🏅';
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
const ProductCard: React.FC<{ product: StoreProduct }> = ({ product }) => {
  const pal = rarityPalette(product);
  const ovr = kindOvr(product);

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      style={{
        borderRadius: 12,
        border: `2px solid ${pal.border}`,
        background: pal.bg,
        boxShadow: `0 4px 18px ${pal.glow}, 0 1px 0 rgba(255,255,255,0.08) inset`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        aspectRatio: '3/4',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      {/* Top row: OVR + price icon */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '7px 7px 0',
      }}>
        <div style={{ textAlign: 'center', lineHeight: 1 }}>
          <div style={{
            fontFamily: "'Rajdhani', system-ui, sans-serif",
            fontWeight: 900,
            fontSize: 18,
            color: '#ffffff',
            lineHeight: 1,
            textShadow: '0 1px 4px rgba(0,0,0,0.80)',
          }}>
            {ovr}
          </div>
          <div style={{
            fontFamily: "'Rajdhani', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 7,
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: '0.08em',
            marginTop: 1,
          }}>
            OVR
          </div>
        </div>
        <span style={{ fontSize: 14, lineHeight: 1 }}>{priceIcon(product.priceKind)}</span>
      </div>

      {/* Badge (if any) */}
      {product.badge && (
        <div style={{
          position: 'absolute',
          top: 6,
          left: '50%',
          transform: 'translateX(-50%)',
          background: product.badge.includes('OFF')
            ? 'rgba(220,60,60,0.90)'
            : product.badge.includes('VALUE')
              ? 'rgba(190,140,30,0.90)'
              : 'rgba(50,50,80,0.85)',
          color: '#fff',
          fontSize: 7,
          fontWeight: 800,
          letterSpacing: '0.08em',
          padding: '2px 6px',
          borderRadius: 4,
          whiteSpace: 'nowrap',
        }}>
          {product.badge}
        </div>
      )}

      {/* Artwork area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 36,
        paddingTop: 4,
        opacity: 0.92,
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.60))',
      }}>
        {product.artwork}
      </div>

      {/* Bottom info panel */}
      <div style={{
        background: 'rgba(0,0,0,0.55)',
        borderTop: `1px solid ${pal.border}`,
        padding: '5px 7px 6px',
      }}>
        {/* Title */}
        <div style={{
          fontFamily: "'Rajdhani', system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 11,
          color: '#ffffff',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.2,
        }}>
          {product.title}
        </div>

        {/* Sub-row: category label + price */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 3,
          gap: 4,
        }}>
          <span style={{
            fontFamily: "'Rajdhani', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 8,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {product.topCategory.replace(/_/g, ' ')}
          </span>
          <span style={{
            fontFamily: "'Rajdhani', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 10,
            color: pal.accent,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {product.priceLabel}
          </span>
        </div>

        {/* Expiry / limit hint */}
        {(product.expiry || product.limit) && (
          <div style={{
            marginTop: 2,
            fontSize: 7,
            color: product.expiry ? 'rgba(255,200,80,0.80)' : 'rgba(255,255,255,0.40)',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {product.expiry ?? product.limit}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StoreScreen;
