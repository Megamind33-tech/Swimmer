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
                className="bg-gradient-to-br from-yellow-600/30 to-amber-600/20 rounded-lg overflow-hidden border-2 border-yellow-500/50 hover:border-yellow-500 transition-all"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="text-5xl">{item.icon}</div>
                    {item.tag && (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-black rounded-full">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">{item.name}</h3>
                    <p className="text-sm text-slate-300">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-yellow-500/30">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold ${
                        item.rarity === 'LEGENDARY'
                          ? 'bg-yellow-500/30 text-yellow-300'
                          : 'bg-purple-500/30 text-purple-300'
                      }`}
                    >
                      {item.rarity}
                    </span>
                    <button
                      onClick={() => handlePurchase(item)}
                      className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:shadow-lg hover:shadow-yellow-500/50 rounded-lg text-white font-bold transition-all flex items-center gap-2"
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
                className="bg-slate-700/50 rounded-lg overflow-hidden border border-slate-600/30 hover:border-slate-500/50 transition-all hover:bg-slate-600/50"
              >
                <div className="h-40 bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                  <div className="text-6xl">{item.icon}</div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-sm">{item.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-600/30">
                    <span
                      className={`text-xs px-2 py-1 rounded font-bold ${
                        item.rarity === 'EPIC'
                          ? 'bg-purple-500/30 text-purple-300'
                          : item.rarity === 'LEGENDARY'
                          ? 'bg-yellow-500/30 text-yellow-300'
                          : 'bg-blue-500/30 text-blue-300'
                      }`}
                    >
                      {item.rarity}
                    </span>
                    <button
                      onClick={() => handlePurchase(item)}
                      className="px-3 py-1 bg-cyan-500/30 hover:bg-cyan-500/50 rounded text-xs font-bold text-cyan-300 transition-colors"
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
            <div className="bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-lg p-8 border border-blue-500/30">
              <h3 className="text-2xl font-black text-white mb-3">Premium Season Pass</h3>
              <p className="text-slate-300 mb-6">Unlock 50 premium tiers with exclusive rewards</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {['Exclusive Cosmetics', '2x XP Boost', 'Premium Currency', 'Seasonal Weapon'].map((benefit) => (
                  <div key={benefit} className="bg-blue-500/20 rounded p-3 text-center">
                    <div className="text-sm font-bold text-white">{benefit}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handlePurchase({ id: 'season-pass', name: 'Premium Season Pass', description: '', price: 999, currency: 'PREMIUM', rarity: 'EPIC', icon: '⭐' })}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/50 rounded-lg text-white font-black text-lg transition-all"
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
                className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-lg p-6 border border-purple-500/30"
              >
                <h3 className="text-xl font-black text-white mb-2">{bundle.name}</h3>
                <p className="text-sm text-slate-300 mb-4">{bundle.items}</p>
                <button
                  onClick={() => handlePurchase({ id: bundle.id, name: bundle.name, description: bundle.items, price: bundle.price, currency: 'PREMIUM', rarity: 'EPIC', icon: '📦' })}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 rounded-lg text-white font-bold transition-all"
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
                className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg overflow-hidden border border-slate-600/30 hover:border-slate-500/50 transition-all"
              >
                <div className="h-40 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                  <div className="text-6xl animate-bounce">{item.icon}</div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-sm">{item.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handlePurchase(item)}
                    className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/30 rounded text-xs font-bold text-white transition-all"
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
          <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
            <h3 className="text-xl font-black text-white mb-4">Event Shop - Sprint Cup</h3>
            <p className="text-slate-400 mb-4">Limited-time items available during current event</p>
            <div className="space-y-3">
              {[
                { name: 'Sprint Boost Pack', cost: '500 Event Tokens' },
                { name: 'Exclusive Sprint Suit', cost: '1000 Event Tokens' },
                { name: 'VIP Event Pass', cost: '2000 Event Tokens' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-600/50 p-4 rounded-lg">
                  <div className="font-bold text-white">{item.name}</div>
                  <button className="px-4 py-2 bg-yellow-500/30 hover:bg-yellow-500/50 rounded text-yellow-300 font-bold text-sm transition-colors">
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
    <div className="w-full h-full overflow-y-auto p-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with Currency Display */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Store</h1>
            <p className="text-slate-400">Premium cosmetics and season pass</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg border border-cyan-500/50">
              <div className="text-xs text-cyan-200">Premium Currency</div>
              <div className="text-2xl font-black text-white">◆ {playerPremiumCurrency}</div>
            </div>
            <div className="px-4 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-lg border border-yellow-500/50">
              <div className="text-xs text-yellow-200">Coins</div>
              <div className="text-2xl font-black text-white">$ {playerCoins.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Notification */}
        {purchaseMessage && (
          <div className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-300 font-bold">
            ✓ {purchaseMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold uppercase text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
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
