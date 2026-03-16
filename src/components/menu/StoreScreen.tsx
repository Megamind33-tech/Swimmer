/**
 * Store Screen - Premium marketplace
 * Cosmetics, Season Pass, Sponsorship Bundles, Equipment, Celebration Packs
 */

import React, { useState } from 'react';

type StoreTab = 'FEATURED' | 'COSMETICS' | 'SEASON_PASS' | 'BUNDLES' | 'CELEBRATION' | 'EVENT_SHOP';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'PREMIUM' | 'EVENT_TOKEN' | 'COINS';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  icon: string;
  tag?: string;
}

interface StoreScreenProps {
  playerPremiumCurrency?: number;
  playerCoins?: number;
}

const FeaturedItems: StoreItem[] = [
  {
    id: 'featured-1',
    name: 'Championship Bundle',
    description: 'Complete outfit for champions - Suit + Cap + Goggles + Victory Pose',
    price: 1999,
    currency: 'PREMIUM',
    rarity: 'LEGENDARY',
    icon: '👑',
    tag: 'LIMITED',
  },
  {
    id: 'featured-2',
    name: 'Premium Season Pass',
    description: 'Unlock 50 exclusive tiers with premium rewards',
    price: 999,
    currency: 'PREMIUM',
    rarity: 'EPIC',
    icon: '⭐',
    tag: 'NEW',
  },
];

const CosmeticItems: StoreItem[] = [
  {
    id: 'suit-1',
    name: 'Neon Cyber Suit',
    description: 'Futuristic racing suit with LED effects',
    price: 500,
    currency: 'PREMIUM',
    rarity: 'EPIC',
    icon: '🩱',
  },
  {
    id: 'suit-2',
    name: 'Gold Elite Suit',
    description: 'Premium gold racing suit for champions',
    price: 800,
    currency: 'PREMIUM',
    rarity: 'LEGENDARY',
    icon: '🩱',
  },
  {
    id: 'cap-1',
    name: 'Dragon Cap',
    description: 'Legendary dragon-themed racing cap',
    price: 300,
    currency: 'PREMIUM',
    rarity: 'RARE',
    icon: '🎩',
  },
  {
    id: 'goggles-1',
    name: 'Vision Pro Max',
    description: 'Advanced goggles with HUD display',
    price: 350,
    currency: 'PREMIUM',
    rarity: 'EPIC',
    icon: '🔍',
  },
];

const CelebrationPacks: StoreItem[] = [
  {
    id: 'celebration-1',
    name: 'Victory Fireworks',
    description: 'Spectacular fireworks celebration animation',
    price: 250,
    currency: 'PREMIUM',
    rarity: 'EPIC',
    icon: '🎆',
  },
  {
    id: 'celebration-2',
    name: 'Champion Pose Pack',
    description: 'Premium victory pose animations (5 poses)',
    price: 400,
    currency: 'PREMIUM',
    rarity: 'EPIC',
    icon: '💪',
  },
  {
    id: 'celebration-3',
    name: 'Elite Walkout',
    description: 'Premium pool walkout animation',
    price: 200,
    currency: 'PREMIUM',
    rarity: 'RARE',
    icon: '🚶',
  },
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'LEGENDARY':
      return 'bg-purple-400/20 text-purple-300 border border-purple-400/40';
    case 'EPIC':
      return 'bg-blue-400/20 text-blue-300 border border-blue-400/40';
    case 'RARE':
      return 'bg-green-400/20 text-green-300 border border-green-400/40';
    default:
      return 'bg-white/10 text-white/70 border border-white/20';
  }
};

export const StoreScreen: React.FC<StoreScreenProps> = ({
  playerPremiumCurrency = 250,
  playerCoins = 5000,
}) => {
  const [activeTab, setActiveTab] = useState<StoreTab>('FEATURED');
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  const tabs: { id: StoreTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'FEATURED',
      label: 'Featured',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    },
    {
      id: 'COSMETICS',
      label: 'Cosmetics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'SEASON_PASS',
      label: 'Pass',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'BUNDLES',
      label: 'Bundles',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      id: 'CELEBRATION',
      label: 'Celebrations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M7 12a5 5 0 1110 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'EVENT_SHOP',
      label: 'Events',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  const handlePurchase = (item: StoreItem) => {
    setPurchaseMessage(`Purchased: ${item.name}`);
    setTimeout(() => setPurchaseMessage(null), 3000);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'FEATURED':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FeaturedItems.map((item) => (
              <div
                key={item.id}
                className="glass-card-elevated rounded-2xl overflow-hidden border-2 border-neon-cyan/40 hover:border-neon-cyan/70 shadow-lg shadow-neon-cyan/20 hover:shadow-lg hover:shadow-neon-cyan/40 transition-all skew-container"
              >
                <div className="p-6 space-y-4 bg-gradient-to-br from-neon-cyan/10 to-broadcast-overlay/40">
                  <div className="flex items-start justify-between">
                    <div className="text-6xl">{item.icon}</div>
                    {item.tag && (
                      <span className="px-3 py-1 bg-yellow-400/30 text-yellow-300 text-xs font-black rounded-full border border-yellow-400/40">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-din font-black text-white mb-1 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">{item.name}</h3>
                    <p className="text-sm text-white/70 font-barlow">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-neon-cyan/20">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${getRarityColor(item.rarity)}`}>
                      {item.rarity}
                    </span>
                    <button
                      onClick={() => handlePurchase(item)}
                      className="px-6 py-2 bg-neon-cyan/30 hover:bg-neon-cyan/40 hover:shadow-lg hover:shadow-neon-cyan/60 rounded-lg text-neon-cyan font-bold font-barlow transition-all flex items-center gap-2 border-2 border-neon-cyan/50 active:animate-squash-stretch drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]"
                    >
                      <span>◆ {item.price}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'COSMETICS':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CosmeticItems.map((item) => (
              <div
                key={item.id}
                className="glass-card-elevated rounded-2xl overflow-hidden border border-neon-cyan/30 hover:border-neon-cyan/60 shadow-lg shadow-neon-cyan/10 hover:shadow-lg hover:shadow-neon-cyan/20 transition-all skew-container"
              >
                <div className="h-40 bg-gradient-to-br from-neon-cyan/15 to-neon-cyan/5 flex items-center justify-center">
                  <div className="text-6xl">{item.icon}</div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold font-din text-white text-sm drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">{item.name}</h3>
                    <p className="text-xs text-white/70 mt-1 font-barlow">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-neon-cyan/20">
                    <span className={`text-xs px-2 py-1 rounded-lg font-bold ${getRarityColor(item.rarity)}`}>
                      {item.rarity}
                    </span>
                    <button
                      onClick={() => handlePurchase(item)}
                      className="px-3 py-1 bg-neon-cyan/20 hover:bg-neon-cyan/40 rounded-lg text-xs font-bold text-neon-cyan font-barlow transition-colors border border-neon-cyan/30 active:animate-squash-stretch"
                    >
                      ◆ {item.price}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'SEASON_PASS':
        return (
          <div className="space-y-6">
            <div className="glass-card-elevated rounded-2xl p-8 border border-neon-cyan/30 hover:border-neon-cyan/60 shadow-lg shadow-neon-cyan/20 bg-gradient-to-br from-neon-cyan/10 to-broadcast-overlay/40 skew-container">
              <h3 className="text-3xl font-din font-black text-neon-cyan mb-4 drop-shadow-[0_0_12px_rgba(0,255,255,0.4)]">Premium Season Pass</h3>
              <p className="text-white/80 mb-6 text-lg font-barlow font-bold">Unlock 50 premium tiers with exclusive rewards</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {['Exclusive Cosmetics', '2x XP Boost', 'Premium Currency', 'Seasonal Weapon'].map((benefit) => (
                  <div key={benefit} className="glass-card-elevated rounded-2xl p-4 text-center border border-neon-cyan/30 hover:border-neon-cyan/50">
                    <div className="text-sm font-bold font-barlow text-white">{benefit}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handlePurchase({ id: 'season-pass', name: 'Premium Season Pass', description: '', price: 999, currency: 'PREMIUM', rarity: 'EPIC', icon: '⭐' })}
                className="w-full px-6 py-4 bg-neon-cyan/30 hover:bg-neon-cyan/40 hover:shadow-lg hover:shadow-neon-cyan/60 rounded-2xl text-neon-cyan font-black font-barlow text-lg transition-all border-2 border-neon-cyan/50 active:animate-squash-stretch drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]"
              >
                Unlock Pass - ◆ 999
              </button>
            </div>
          </div>
        );
      case 'BUNDLES':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                id: 'bundle-1',
                name: 'Starter Bundle',
                items: 'Suit + Cap + Goggles',
                price: 1200,
              },
              {
                id: 'bundle-2',
                name: 'Champion Bundle',
                items: 'Full cosmetics + Walkout + Celebration',
                price: 2500,
              },
            ].map((bundle) => (
              <div
                key={bundle.id}
                className="glass-card-elevated rounded-2xl p-6 border border-neon-cyan/30 hover:border-neon-cyan/60 shadow-lg shadow-neon-cyan/15 hover:shadow-lg hover:shadow-neon-cyan/30 transition-all bg-gradient-to-br from-neon-cyan/10 to-broadcast-overlay/40 skew-container"
              >
                <h3 className="text-2xl font-din font-black text-white mb-2 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">{bundle.name}</h3>
                <p className="text-sm text-white/80 mb-4 font-barlow font-bold">{bundle.items}</p>
                <button
                  onClick={() => handlePurchase({ id: bundle.id, name: bundle.name, description: bundle.items, price: bundle.price, currency: 'PREMIUM', rarity: 'EPIC', icon: '📦' })}
                  className="w-full px-4 py-3 bg-neon-cyan/30 hover:bg-neon-cyan/40 hover:shadow-lg hover:shadow-neon-cyan/60 rounded-2xl text-neon-cyan font-bold font-barlow transition-all border-2 border-neon-cyan/50 active:animate-squash-stretch drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]"
                >
                  Buy Bundle - ◆ {bundle.price}
                </button>
              </div>
            ))}
          </div>
        );
      case 'CELEBRATION':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CelebrationPacks.map((item) => (
              <div
                key={item.id}
                className="glass-card-elevated rounded-2xl overflow-hidden border border-neon-cyan/30 hover:border-neon-cyan/60 shadow-lg shadow-neon-cyan/15 hover:shadow-lg hover:shadow-neon-cyan/30 transition-all skew-container"
              >
                <div className="h-40 bg-gradient-to-br from-neon-cyan/15 to-neon-cyan/5 flex items-center justify-center">
                  <div className="text-6xl animate-bounce">{item.icon}</div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold font-din text-white text-sm drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">{item.name}</h3>
                    <p className="text-xs text-white/70 mt-1 font-barlow">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handlePurchase(item)}
                    className="w-full px-3 py-2 bg-neon-cyan/20 hover:bg-neon-cyan/40 hover:shadow-lg hover:shadow-neon-cyan/50 rounded-lg text-xs font-bold text-neon-cyan font-barlow transition-all border border-neon-cyan/30 active:animate-squash-stretch"
                  >
                    ◆ {item.price}
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'EVENT_SHOP':
        return (
          <div className="glass-card-elevated rounded-2xl p-6 border border-neon-cyan/30 hover:border-neon-cyan/60 shadow-lg shadow-neon-cyan/15 bg-gradient-to-br from-neon-cyan/10 to-broadcast-overlay/40 skew-container">
            <h3 className="text-2xl font-din font-black text-neon-cyan mb-2 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">Event Shop - Sprint Cup</h3>
            <p className="text-white/80 mb-6 text-sm font-barlow font-bold">Limited-time items available during current event</p>
            <div className="space-y-3">
              {[
                { name: 'Sprint Boost Pack', cost: '500 Event Tokens' },
                { name: 'Exclusive Sprint Suit', cost: '1000 Event Tokens' },
                { name: 'VIP Event Pass', cost: '2000 Event Tokens' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between glass-card-elevated p-4 rounded-lg border border-neon-cyan/30 hover:border-neon-cyan/50">
                  <div className="font-bold font-din text-white text-lg drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">{item.name}</div>
                  <button className="px-4 py-2 bg-neon-cyan/20 hover:bg-neon-cyan/40 rounded-lg text-neon-cyan font-bold font-barlow text-sm transition-colors border border-neon-cyan/30 active:animate-squash-stretch">
                    {item.cost}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-8 max-[900px]:p-4 space-y-8 relative safe-zone-x">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with Currency Display */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl max-[900px]:text-3xl font-din font-black text-white mb-2 drop-shadow-[0_0_12px_rgba(0,255,255,0.3)]">Store</h1>
            <p className="text-white/80 text-lg max-[900px]:text-sm font-barlow font-bold">Premium cosmetics and season pass</p>
          </div>
          <div className="flex gap-4 max-[900px]:flex-col max-[900px]:gap-2">
            <div className="glass-card-elevated px-5 py-4 bg-gradient-to-br from-neon-cyan/20 to-neon-cyan/5 rounded-2xl border border-neon-cyan/50 shadow-lg shadow-neon-cyan/20">
              <div className="text-xs text-neon-cyan font-bold uppercase font-barlow drop-shadow-[0_0_4px_rgba(0,255,255,0.4)]">Premium Currency</div>
              <div className="text-2xl max-[900px]:text-lg font-din font-black text-neon-cyan drop-shadow-[0_0_6px_rgba(0,255,255,0.4)]">◆ {playerPremiumCurrency}</div>
            </div>
            <div className="glass-card-elevated px-5 py-4 bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 rounded-2xl border border-yellow-400/50 shadow-lg shadow-yellow-400/20">
              <div className="text-xs text-yellow-300 font-bold uppercase font-barlow drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]">Coins</div>
              <div className="text-2xl max-[900px]:text-lg font-din font-black text-yellow-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]">$ {playerCoins.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Notification */}
        {purchaseMessage && (
          <div className="px-6 py-3 glass-card-elevated bg-green-400/20 border border-green-400/60 rounded-2xl text-green-300 font-bold shadow-lg shadow-green-400/20 font-barlow">
            ✓ {purchaseMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-3 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold font-barlow uppercase text-sm transition-all border ${
                activeTab === tab.id
                  ? 'bg-neon-cyan/30 text-neon-cyan shadow-lg shadow-neon-cyan/40 border-neon-cyan/60 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]'
                  : 'glass-card-elevated text-white/70 border-neon-cyan/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/10'
              }`}
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>{renderTab()}</div>
      </div>
    </div>
  );
};

export default StoreScreen;
