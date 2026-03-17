/**
 * Store Screen - Premium marketplace
 * Cosmetics, Season Pass, Sponsorship Bundles, Equipment, Celebration Packs
 */

import React, { useState } from 'react';
import marketplaceBackdropImage from '../../designs/custom_backgrounds/1dLNpgVzO02ceJe0YsHoa4tMHenXscN9M.jpg';
import { HeroBackgroundMedia } from '../ui/MediaPrimitives';

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
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {FeaturedItems.map((item) => (
                <div
                  key={item.id}
                  className="group/featured relative h-[400px] rounded-[40px] overflow-hidden border border-white/10 hover:border-primary/40 transition-all duration-700 shadow-2xl"
                >
                  {/* Background Image/Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface/40 to-transparent z-0" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,236,255,0.15),transparent)] opacity-0 group-hover/featured:opacity-100 transition-opacity duration-700" />
                  
                  {/* Content Overlays */}
                  <div className="absolute top-0 right-0 p-8 z-10">
                    {item.tag && (
                      <span className="px-4 py-2 bg-secondary/20 text-secondary font-headline font-black italic slanted uppercase text-[10px] tracking-widest border border-secondary/40 gold-glow rounded-full">
                        {item.tag} Offer
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end p-10 z-20">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`text-[9px] font-black italic slanted uppercase tracking-[0.4em] px-3 py-1 rounded bg-white/5 border border-white/10 ${item.rarity === 'LEGENDARY' ? 'text-secondary border-secondary/30 gold-glow' : 'text-primary border-primary/30 text-glow'}`}>
                        {item.rarity} Bundle
                      </span>
                    </div>
                    
                    <h3 className="font-headline text-4xl font-black italic slanted uppercase text-on-surface text-glow mb-2 group-hover/featured:scale-105 transition-transform duration-700 origin-left">
                      {item.name}
                    </h3>
                    <p className="text-on-surface-variant text-sm mb-8 leading-relaxed max-w-sm">{item.description}</p>
                    
                    <button
                      onClick={() => handlePurchase(item)}
                      className="w-full relative group/buy"
                    >
                      <div className="absolute inset-0 bg-primary blur-xl opacity-20 group-hover/buy:opacity-40 transition-all duration-500" />
                      <div className="relative h-14 bg-white/5 border border-white/10 group-hover/buy:border-primary group-hover/buy:bg-primary/20 rounded-2xl flex items-center justify-between px-8 transition-all duration-300">
                        <span className="font-headline font-black italic slanted uppercase text-xs tracking-widest group-hover/buy:text-primary transition-colors">Acquire Assets</span>
                        <span className="font-headline font-black italic slanted text-xl text-primary text-glow flex items-center gap-2 tracking-tighter">
                          <span className="material-symbols-outlined text-[18px]">diamond</span>
                          {item.price}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'COSMETICS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow mb-2">
              Visual Adjustments
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CosmeticItems.map((item) => (
                <div
                  key={item.id}
                  className="group/cos rounded-3xl overflow-hidden border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="h-44 relative overflow-hidden bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/cos:opacity-100 transition-opacity duration-500" />
                    <span className="text-6xl group-hover/cos:scale-110 transition-transform duration-500 drop-shadow-2xl">{item.icon}</span>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                        item.rarity === 'LEGENDARY' ? 'bg-secondary/20 text-secondary border border-secondary/30' : 
                        item.rarity === 'EPIC' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/10 text-on-surface-variant'
                      }`}>
                        {item.rarity}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-on-surface mb-4 truncate">{item.name}</h4>
                    
                    <button
                      onClick={() => handlePurchase(item)}
                      className="w-full flex items-center justify-between group/buy-cos"
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant group-hover/buy-cos:text-primary transition-colors">Purchase</span>
                      <div className="flex items-center gap-1 text-primary font-headline font-black italic slanted text-sm">
                        <span className="material-symbols-outlined text-xs">diamond</span>
                        {item.price}
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'SEASON_PASS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="group/pass relative overflow-hidden rounded-[40px] border border-white/10 bg-surface shadow-2xl">
              {/* Season Banner */}
              <div className="h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-surface to-surface z-0" />
                <div className="absolute inset-0 flex items-center px-12 z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="h-8 w-1 bg-secondary shadow-[0_0_15px_rgba(255,215,9,0.5)]" />
                      <span className="font-headline text-3xl font-black italic slanted uppercase text-on-surface text-glow">Season 04: Velocity</span>
                    </div>
                    <p className="text-on-surface-variant font-bold max-w-lg italic uppercase tracking-wider text-[11px]">Deploy the premium battle infrastructure to access top-tier rewards</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined text-[160px] text-secondary">military_tech</span>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="p-12 border-t border-white/5 bg-white/[0.02]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  {[
                    { title: 'Exclusive Assets', icon: 'auto_awesome' },
                    { title: '2x Speed Matrix', icon: 'bolt' },
                    { title: 'Diamond Reserves', icon: 'diamond' },
                    { title: 'Elite Gear', icon: 'checkroom' },
                  ].map((benefit) => (
                    <div key={benefit.title} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-secondary/30 transition-all group/benefit">
                      <span className="material-symbols-outlined text-secondary/60 group-hover/benefit:text-secondary transition-colors mb-4 block text-3xl">{benefit.icon}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant leading-tight block">{benefit.title}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePurchase({ id: 'season-pass', name: 'Premium Season Pass', description: '', price: 999, currency: 'PREMIUM', rarity: 'EPIC', icon: '⭐' })}
                  className="w-full relative group/buy-pass"
                >
                  <div className="absolute inset-0 bg-secondary blur-2xl opacity-10 group-hover/buy-pass:opacity-30 transition-all duration-700" />
                  <div className="relative h-20 bg-secondary/10 border-2 border-secondary/40 hover:border-secondary hover:bg-secondary/20 rounded-[24px] flex items-center justify-center gap-6 transition-all duration-300">
                    <span className="font-headline text-2xl font-black italic slanted uppercase text-secondary gold-glow">Unlock Access Node</span>
                    <div className="h-8 w-[1px] bg-secondary/30" />
                    <div className="flex items-center gap-3 font-headline text-2xl font-black italic slanted text-secondary gold-glow">
                      <span className="material-symbols-outlined text-2xl">diamond</span>
                      999
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      case 'BUNDLES':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow mb-2">
              Strategic Packages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  id: 'bundle-1',
                  name: 'Apex Starter Kit',
                  items: 'Hydro Suit + Neon Cap + Goggles',
                  price: 1200,
                  rarity: 'EPIC',
                },
                {
                  id: 'bundle-2',
                  name: 'Grand Prix Collection',
                  items: 'Full Kinetic Cosmetics + Walkout + Victory Celebration',
                  price: 2500,
                  rarity: 'LEGENDARY',
                },
              ].map((bundle) => (
                <div
                  key={bundle.id}
                  className="group/bundle relative p-8 rounded-[32px] border border-white/10 bg-white/5 hover:border-primary/40 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <span className="material-symbols-outlined text-[100px] text-primary">inventory_2</span>
                  </div>
                  
                  <div className="relative z-10">
                    <span className={`text-[8px] font-black italic slanted uppercase tracking-[0.4em] px-2 py-1 rounded bg-white/5 border border-white/10 mb-4 inline-block ${bundle.rarity === 'LEGENDARY' ? 'text-secondary border-secondary/30' : 'text-primary border-primary/30'}`}>
                      {bundle.rarity} Multi-Pack
                    </span>
                    <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface mb-2 group-hover/bundle:text-glow transition-all">{bundle.name}</h3>
                    <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider mb-8">{bundle.items}</p>
                    
                    <button
                      onClick={() => handlePurchase({ id: bundle.id, name: bundle.name, description: bundle.items, price: bundle.price, currency: 'PREMIUM', rarity: 'EPIC', icon: '📦' })}
                      className="w-full h-14 rounded-2xl bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary flex items-center justify-between px-6 transition-all group/buy-b"
                    >
                      <span className="font-headline font-black italic slanted uppercase text-[10px] tracking-widest text-on-surface-variant group-hover/buy-b:text-primary transition-colors">Acquire Bundle</span>
                      <div className="flex items-center gap-2 text-primary font-headline text-xl font-black italic slanted">
                        <span className="material-symbols-outlined text-sm">diamond</span>
                        {bundle.price}
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'CELEBRATION':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow mb-2">
              Victory Protocols
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CelebrationPacks.map((item) => (
                <div
                  key={item.id}
                  className="group/cel rounded-3xl overflow-hidden border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="h-44 relative overflow-hidden bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/cel:opacity-100 transition-opacity duration-500" />
                    <span className="text-6xl group-hover/cel:scale-110 transition-transform duration-500 drop-shadow-2xl">{item.icon}</span>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-sm font-bold text-on-surface mb-1 truncate">{item.name}</h4>
                    <p className="text-[10px] text-on-surface-variant mb-4 line-clamp-2 leading-tight uppercase font-bold tracking-tight">{item.description}</p>
                    
                    <button
                      onClick={() => handlePurchase(item)}
                      className="w-full flex items-center justify-between group/buy-cel"
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant group-hover/buy-cel:text-primary transition-colors">Equip Anim</span>
                      <div className="flex items-center gap-1 text-primary font-headline font-black italic slanted text-sm">
                        <span className="material-symbols-outlined text-xs">diamond</span>
                        {item.price}
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'EVENT_SHOP':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative p-8 rounded-[40px] border border-secondary/20 bg-secondary/5 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <span className="material-symbols-outlined text-[120px] text-secondary">flash_on</span>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-[1px] w-12 bg-secondary/40" />
                  <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em]">Limited Event: Sprint Cup</span>
                </div>
                <h3 className="font-headline text-3xl font-black italic slanted uppercase text-on-surface text-glow mb-6">Redeem Event Tokens</h3>
                
                <div className="grid gap-3">
                  {[
                    { name: 'Sprint Boost Pack', cost: '500 Tokens', icon: 'bolt' },
                    { name: 'Exclusive Sprint Suit', cost: '1000 Tokens', icon: 'apparel' },
                    { name: 'VIP Event Pass Extension', cost: '2000 Tokens', icon: 'confirmation_number' },
                  ].map((item, idx) => (
                    <div key={idx} className="group/ev flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/40 transition-all flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-secondary text-xl">{item.icon}</span>
                        </div>
                        <span className="font-headline text-lg font-black italic slanted uppercase text-on-surface group-hover/ev:text-glow transition-all">{item.name}</span>
                      </div>
                      <button className="h-12 px-6 rounded-xl bg-secondary/20 border border-secondary/40 hover:bg-secondary hover:text-surface font-headline font-black italic slanted uppercase text-xs tracking-widest text-secondary transition-all">
                        Redeem: {item.cost}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="hydro-page-shell flex-1 relative w-full h-full overflow-y-auto flex flex-col font-body">
      {/* Cinematic Store Header */}
      <div className="p-8 max-[900px]:p-5 bg-gradient-to-b from-primary/10 to-transparent border-b border-white/5 relative overflow-hidden">
        <HeroBackgroundMedia src={marketplaceBackdropImage} alt="Global marketplace background" className="absolute inset-0 pointer-events-none opacity-85" focalPoint="50% 35%" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/68 via-surface/28 to-surface/45 pointer-events-none" />
        <div className="absolute top-0 right-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-end justify-between gap-8 flex-wrap">
          <div className="p-4 rounded-2xl bg-surface/40 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-12 bg-primary/40" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Global Marketplace</span>
            </div>
            
            <h1 className="font-headline text-5xl max-[900px]:text-3xl font-black italic slanted uppercase text-on-surface text-glow mb-2">
              Premium Store
            </h1>
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Equip your athlete with the finest Hydro-Kinetic gear</p>
          </div>

          <div className="flex gap-4">
            <div className="relative group/coin pt-4">
              <span className="absolute top-0 left-0 text-[8px] font-black text-primary/60 uppercase tracking-widest group-hover/coin:text-primary transition-colors">Premium Diamonds</span>
              <div className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-2xl flex items-center gap-3 shadow-[0_0_20px_rgba(129,236,255,0.1)] group-hover/coin:border-primary/50 transition-all">
                <span className="material-symbols-outlined text-primary text-glow text-xl">diamond</span>
                <span className="font-headline text-2xl font-black italic slanted text-primary text-glow">{playerPremiumCurrency}</span>
                <button className="ml-2 h-6 w-6 rounded-lg bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            <div className="relative group/coin pt-4">
              <span className="absolute top-0 left-0 text-[8px] font-black text-secondary/60 uppercase tracking-widest group-hover/coin:text-secondary transition-colors">Athlete Coins</span>
              <div className="px-6 py-3 bg-secondary/10 border border-secondary/30 rounded-2xl flex items-center gap-3 shadow-[0_0_20px_rgba(255,215,9,0.1)] group-hover/coin:border-secondary/50 transition-all">
                <span className="material-symbols-outlined text-secondary gold-glow text-xl">payments</span>
                <span className="font-headline text-2xl font-black italic slanted text-secondary gold-glow">{playerCoins.toLocaleString()}</span>
                <button className="ml-2 h-6 w-6 rounded-lg bg-secondary/20 flex items-center justify-center hover:bg-secondary/40 transition-colors">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hydro-page-content page-template-store p-6 max-w-7xl mx-auto w-full space-y-8 pb-12">
        {/* Tab Navigation */}
        <div className="flex gap-2 flex-wrap items-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-xl font-headline font-black italic slanted uppercase text-[11px] tracking-wider transition-all duration-300 overflow-hidden border ${
                  isActive 
                    ? 'bg-primary/20 border-primary/40 text-primary text-glow shadow-[0_0_20px_rgba(129,236,255,0.2)]' 
                    : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/10 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2 relative z-10">
                  <span className="material-symbols-outlined text-[18px]">{isActive ? 'radio_button_checked' : 'radio_button_unchecked'}</span>
                  {tab.label}
                </div>
                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />}
              </button>
            );
          })}
        </div>

        {/* Purchase Notification */}
        {purchaseMessage && (
          <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right duration-500">
            <div className="p-4 bg-primary/20 border border-primary/40 rounded-2xl flex items-center gap-4 backdrop-blur-xl shadow-2xl">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                <span className="material-symbols-outlined text-white">shopping_bag</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">Transaction Success</span>
                <span className="text-sm font-bold text-on-surface">{purchaseMessage}</span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Content Panel */}
        <div className="min-h-[600px] relative">
          <div className="absolute -top-4 -right-4 p-8 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[240px] text-primary">
              {activeTab === 'FEATURED' ? 'grade' : activeTab === 'COSMETICS' ? 'apparel' : activeTab === 'SEASON_PASS' ? 'military_tech' : activeTab === 'BUNDLES' ? 'inventory_2' : activeTab === 'CELEBRATION' ? 'celebration' : 'event'}
            </span>
          </div>
          
          <div className="relative z-10 h-full">
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreScreen;
