/**
 * Store Screen — Game UI premium marketplace
 * Compact fixed layout, no scrolling, game font + color system.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBagIcon, StarIcon, TagIcon, ZapIcon, PackageIcon, CalendarIcon } from 'lucide-react';

const AQUA        = '#38D6FF';
const GOLD        = '#D4A843';
const PANEL       = 'rgba(4,20,33,0.76)';
const PANEL_BORDER = 'rgba(56,214,255,0.13)';

type StoreTab = 'FEATURED' | 'COSMETICS' | 'SEASON_PASS' | 'BUNDLES' | 'CELEBRATION' | 'EVENT_SHOP';

interface StoreItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  currency: 'PREMIUM' | 'COINS';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  icon: string;
  tag?: string;
}

const FEATURED: StoreItem[] = [
  { id: 'f1', name: 'Championship Bundle', desc: 'Suit + Cap + Goggles + Victory Pose', price: 1999, currency: 'PREMIUM', rarity: 'LEGENDARY', icon: '👑', tag: 'LIMITED' },
  { id: 'f2', name: 'Premium Season Pass',  desc: '50 exclusive reward tiers',          price: 999,  currency: 'PREMIUM', rarity: 'EPIC',      icon: '⭐', tag: 'NEW' },
  { id: 'f3', name: 'Neon Cyber Suit',      desc: 'Futuristic racing suit + LED FX',     price: 500,  currency: 'PREMIUM', rarity: 'EPIC',      icon: '🩱' },
  { id: 'f4', name: 'Gold Elite Suit',      desc: 'Premium gold suit for champions',     price: 800,  currency: 'PREMIUM', rarity: 'LEGENDARY', icon: '🩱' },
];

const COSMETICS: StoreItem[] = [
  { id: 'c1', name: 'Neon Cyber Suit',    desc: 'Futuristic suit with LED FX',       price: 500,  currency: 'PREMIUM', rarity: 'EPIC',      icon: '🩱' },
  { id: 'c2', name: 'Gold Elite Suit',    desc: 'Champion gold racing suit',         price: 800,  currency: 'PREMIUM', rarity: 'LEGENDARY', icon: '🩱' },
  { id: 'c3', name: 'Dragon Cap',         desc: 'Legendary dragon racing cap',       price: 300,  currency: 'PREMIUM', rarity: 'RARE',      icon: '🎩' },
  { id: 'c4', name: 'Vision Pro Goggles', desc: 'Advanced goggles with HUD display', price: 350,  currency: 'PREMIUM', rarity: 'EPIC',      icon: '🔍' },
  { id: 'c5', name: 'Shadow Gloves',      desc: 'Grip gloves for open water',        price: 200,  currency: 'COINS',   rarity: 'RARE',      icon: '🧤' },
  { id: 'c6', name: 'Hydro Fins',         desc: 'Speed fins for underwater kicks',   price: 450,  currency: 'PREMIUM', rarity: 'EPIC',      icon: '🦶' },
];

const CELEBRATIONS: StoreItem[] = [
  { id: 'cel1', name: 'Victory Fireworks', desc: 'Spectacular fireworks animation', price: 250, currency: 'PREMIUM', rarity: 'EPIC',   icon: '🎆' },
  { id: 'cel2', name: 'Champion Poses',    desc: '5 premium victory poses',         price: 400, currency: 'PREMIUM', rarity: 'EPIC',   icon: '💪' },
  { id: 'cel3', name: 'Elite Walkout',     desc: 'Premium pool walkout animation',  price: 200, currency: 'PREMIUM', rarity: 'RARE',   icon: '🚶' },
  { id: 'cel4', name: 'Wave Celebration',  desc: 'Water splash victory move',       price: 150, currency: 'COINS',   rarity: 'COMMON', icon: '🌊' },
];

const RARITY_STYLES: Record<string, { border: string; label: string; bg: string }> = {
  LEGENDARY: { border: 'rgba(212,168,67,0.35)',   label: GOLD,   bg: 'rgba(212,168,67,0.08)' },
  EPIC:      { border: 'rgba(167,139,250,0.30)',   label: '#A78BFA', bg: 'rgba(88,28,135,0.10)' },
  RARE:      { border: 'rgba(56,214,255,0.25)',    label: AQUA,  bg: 'rgba(56,214,255,0.06)' },
  COMMON:    { border: 'rgba(255,255,255,0.10)',   label: 'rgba(169,211,231,0.55)', bg: 'rgba(255,255,255,0.03)' },
};

interface StoreScreenProps {
  playerPremiumCurrency?: number;
  playerCoins?: number;
}

const TABS: { id: StoreTab; label: string; icon: React.ReactNode }[] = [
  { id: 'FEATURED',    label: 'FEATURED',  icon: <StarIcon    size={11} /> },
  { id: 'COSMETICS',   label: 'COSMETICS', icon: <TagIcon     size={11} /> },
  { id: 'SEASON_PASS', label: 'SEASON',    icon: <StarIcon    size={11} /> },
  { id: 'BUNDLES',     label: 'BUNDLES',   icon: <PackageIcon size={11} /> },
  { id: 'CELEBRATION', label: 'VICTORY',   icon: <ZapIcon     size={11} /> },
  { id: 'EVENT_SHOP',  label: 'EVENTS',    icon: <CalendarIcon size={11} /> },
];

export const StoreScreen: React.FC<StoreScreenProps> = ({
  playerPremiumCurrency = 250,
  playerCoins = 5000,
}) => {
  const [activeTab, setActiveTab] = useState<StoreTab>('FEATURED');
  const [toast, setToast] = useState<string | null>(null);

  const buy = (name: string) => {
    setToast(`Purchased: ${name}`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px' }}>
      {/* ── Header ── */}
      <div style={{ borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(14px)', padding: '10px 14px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBagIcon size={14} color={AQUA} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#F3FBFF', letterSpacing: '0.06em' }}>PREMIUM <span style={{ color: AQUA }}>STORE</span></span>
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '2px' }}>Global Marketplace</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <CurrencyBadge icon={<span style={{ fontFamily: "'Bebas Neue'", fontSize: '12px', color: AQUA, lineHeight: 1 }}>◆</span>} value={playerPremiumCurrency} label="Diamonds" color={AQUA} />
          <CurrencyBadge icon={<span style={{ fontFamily: "'Bebas Neue'", fontSize: '11px', color: GOLD, lineHeight: 1 }}>C</span>} value={playerCoins} label="Coins" color={GOLD} />
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1, height: '30px', borderRadius: '8px', cursor: 'pointer', background: active ? 'rgba(56,214,255,0.14)' : 'rgba(255,255,255,0.04)', border: active ? `1px solid rgba(56,214,255,0.40)` : `1px solid ${PANEL_BORDER}`, fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.10em', color: active ? AQUA : 'rgba(169,211,231,0.50)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 0.15s', boxShadow: active ? '0 0 10px rgba(56,214,255,0.15)' : 'none' }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(14px)', overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16 }}
            style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '12px' }}
          >
            {renderContent(activeTab, buy)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{ position: 'absolute', bottom: '74px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, background: 'rgba(4,20,33,0.95)', border: `1px solid rgba(56,214,255,0.35)`, borderRadius: '10px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 24px rgba(56,214,255,0.20)', backdropFilter: 'blur(12px)', whiteSpace: 'nowrap' }}
          >
            <ShoppingBagIcon size={14} color={AQUA} />
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '13px', color: '#F3FBFF' }}>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Tab content renderers
// ─────────────────────────────────────────────────────────

function renderContent(tab: StoreTab, buy: (name: string) => void): React.ReactNode {
  switch (tab) {
    case 'FEATURED':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {FEATURED.map((item) => <ItemCard key={item.id} item={item} onBuy={buy} featured />)}
        </div>
      );
    case 'COSMETICS':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {COSMETICS.map((item) => <ItemCard key={item.id} item={item} onBuy={buy} />)}
        </div>
      );
    case 'SEASON_PASS':
      return <SeasonPassContent buy={buy} />;
    case 'BUNDLES':
      return <BundlesContent buy={buy} />;
    case 'CELEBRATION':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {CELEBRATIONS.map((item) => <ItemCard key={item.id} item={item} onBuy={buy} />)}
        </div>
      );
    case 'EVENT_SHOP':
      return <EventShopContent />;
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────
// Item Card
// ─────────────────────────────────────────────────────────

function ItemCard({ item, onBuy, featured }: { item: StoreItem; onBuy: (name: string) => void; featured?: boolean }) {
  const rs = RARITY_STYLES[item.rarity] ?? RARITY_STYLES.COMMON;
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      style={{ borderRadius: '12px', border: `1px solid ${rs.border}`, background: rs.bg, padding: featured ? '14px' : '10px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', overflow: 'hidden' }}
    >
      {item.tag && (
        <div style={{ position: 'absolute', top: '8px', right: '8px', background: item.tag === 'LIMITED' ? 'rgba(196,30,58,0.90)' : 'rgba(13,124,102,0.90)', borderRadius: '5px', padding: '2px 7px', fontFamily: "'Bebas Neue', sans-serif", fontSize: '9px', letterSpacing: '0.12em', color: '#fff' }}>
          {item.tag}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ fontSize: featured ? '28px' : '22px', lineHeight: 1 }}>{item.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: featured ? '16px' : '14px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: rs.label, letterSpacing: '0.10em', marginTop: '2px', textTransform: 'uppercase' }}>{item.rarity}</div>
        </div>
      </div>
      {featured && (
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.60)', lineHeight: 1.4 }}>{item.desc}</div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: item.currency === 'PREMIUM' ? AQUA : GOLD, letterSpacing: '0.04em', textShadow: item.currency === 'PREMIUM' ? '0 0 8px rgba(56,214,255,0.40)' : '0 0 8px rgba(212,168,67,0.40)' }}>{item.price.toLocaleString()}</span>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.45)', textTransform: 'uppercase' }}>{item.currency === 'PREMIUM' ? '◆' : 'C'}</span>
        </div>
        <button
          onClick={() => onBuy(item.name)}
          style={{ height: '26px', paddingInline: '12px', borderRadius: '7px', cursor: 'pointer', background: item.currency === 'PREMIUM' ? 'rgba(56,214,255,0.12)' : 'rgba(212,168,67,0.12)', border: `1px solid ${item.currency === 'PREMIUM' ? 'rgba(56,214,255,0.30)' : 'rgba(212,168,67,0.30)'}`, fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.10em', color: item.currency === 'PREMIUM' ? AQUA : GOLD }}
        >
          BUY
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// Season Pass
// ─────────────────────────────────────────────────────────

function SeasonPassContent({ buy }: { buy: (name: string) => void }) {
  const benefits = [
    { label: 'Exclusive Assets',  icon: '✦' },
    { label: '2× XP Boost',       icon: '⚡' },
    { label: 'Diamond Reserves',  icon: '◆' },
    { label: 'Elite Gear Bundle',  icon: '🎽' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Banner */}
      <div style={{ borderRadius: '12px', border: `1px solid rgba(212,168,67,0.28)`, background: 'linear-gradient(135deg, rgba(42,31,12,0.90) 0%, rgba(11,17,32,0.92) 100%)', padding: '14px 18px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 0, top: 0, width: '160px', height: '160px', borderRadius: '50%', background: GOLD, opacity: 0.06, filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', fontWeight: 700, color: 'rgba(212,168,67,0.60)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '4px' }}>Season Pass</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1 }}>SEASON 04: <span style={{ color: GOLD }}>VELOCITY</span></div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(232,224,208,0.60)', marginTop: '4px', marginBottom: '14px' }}>Deploy the premium infrastructure — unlock top-tier rewards</div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          {benefits.map((b) => (
            <div key={b.label} style={{ flex: 1, borderRadius: '10px', border: `1px solid rgba(212,168,67,0.18)`, background: 'rgba(212,168,67,0.05)', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '16px' }}>{b.icon}</span>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', fontWeight: 700, color: 'rgba(212,168,67,0.70)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>{b.label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => buy('Premium Season Pass')}
          style={{ width: '100%', height: '38px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(212,168,67,0.15)', border: `1.5px solid rgba(212,168,67,0.45)`, fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', letterSpacing: '0.10em', color: GOLD, boxShadow: '0 0 16px rgba(212,168,67,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
        >
          UNLOCK ACCESS · <span style={{ color: AQUA }}>◆ 999</span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Bundles
// ─────────────────────────────────────────────────────────

function BundlesContent({ buy }: { buy: (name: string) => void }) {
  const bundles = [
    { id: 'b1', name: 'Apex Starter Kit',      items: 'Hydro Suit · Neon Cap · Goggles',                         price: 1200, rarity: 'EPIC' as const },
    { id: 'b2', name: 'Grand Prix Collection', items: 'Full Kinetic Cosmetics · Walkout · Victory Celebration',   price: 2500, rarity: 'LEGENDARY' as const },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
      {bundles.map((b) => {
        const rs = RARITY_STYLES[b.rarity];
        return (
          <motion.div key={b.id} whileHover={{ scale: 1.01 }} style={{ borderRadius: '12px', border: `1px solid ${rs.border}`, background: rs.bg, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', fontWeight: 700, color: rs.label, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '4px' }}>{b.rarity} BUNDLE</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1 }}>{b.name}</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.55)', marginTop: '5px', lineHeight: 1.4 }}>{b.items}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: AQUA, letterSpacing: '0.04em', textShadow: '0 0 10px rgba(56,214,255,0.40)' }}>◆ {b.price.toLocaleString()}</span>
              <button onClick={() => buy(b.name)} style={{ height: '30px', paddingInline: '16px', borderRadius: '8px', cursor: 'pointer', background: 'rgba(56,214,255,0.10)', border: `1px solid rgba(56,214,255,0.30)`, fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', letterSpacing: '0.10em', color: AQUA }}>
                ACQUIRE
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Event Shop
// ─────────────────────────────────────────────────────────

function EventShopContent() {
  const items = [
    { name: 'Sprint Boost Pack',       cost: '500 Tokens' },
    { name: 'Exclusive Sprint Suit',   cost: '1,000 Tokens' },
    { name: 'VIP Event Pass',          cost: '2,000 Tokens' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ borderRadius: '10px', border: `1px solid rgba(212,168,67,0.20)`, background: 'rgba(212,168,67,0.05)', padding: '10px 14px', marginBottom: '4px' }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', fontWeight: 700, color: 'rgba(212,168,67,0.60)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '3px' }}>Limited Event</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#F3FBFF', letterSpacing: '0.04em' }}>SPRINT CUP <span style={{ color: GOLD }}>TOKEN SHOP</span></div>
      </div>
      {items.map((item) => (
        <div key={item.name} style={{ borderRadius: '10px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.03)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '13px', color: '#F3FBFF' }}>{item.name}</span>
          <button style={{ height: '28px', paddingInline: '14px', borderRadius: '8px', cursor: 'pointer', background: 'rgba(212,168,67,0.12)', border: `1px solid rgba(212,168,67,0.30)`, fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.10em', color: GOLD, whiteSpace: 'nowrap' }}>
            {item.cost}
          </button>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Currency Badge
// ─────────────────────────────────────────────────────────

function CurrencyBadge({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
  return (
    <div style={{ borderRadius: '9px', border: `1px solid rgba(56,214,255,0.18)`, background: 'rgba(0,0,0,0.30)', padding: '5px 10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', fontWeight: 700, color: `${color}90`, textTransform: 'uppercase', letterSpacing: '0.10em' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {icon}
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color, letterSpacing: '0.04em', textShadow: `0 0 8px ${color}40` }}>{value.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default StoreScreen;
