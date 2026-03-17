/**
 * Locker Room Screen - Premium cosmetics customization
 * 3D character viewer, outfit swapping, animations, saved looks
 */

import React, { useState } from 'react';

interface SavedLook {
  id: string;
  name: string;
  outfit: string;
  gear: string;
  walkout: string;
  celebration: string;
}

interface LockerRoomScreenProps {
  onSave?: (look: SavedLook) => void;
}

const SavedLooks: SavedLook[] = [
  {
    id: '1',
    name: 'Championship Look',
    outfit: 'Blue Racing Suit',
    gear: 'Aerodynamic Pro Cap',
    walkout: 'Confident Stride',
    celebration: 'Water Splash',
  },
  {
    id: '2',
    name: 'Night Mode',
    outfit: 'Black & Gold Suit',
    gear: 'Dark Vision Goggles',
    walkout: 'Stealth Walk',
    celebration: 'Fist Pump',
  },
  {
    id: '3',
    name: 'Casual Training',
    outfit: 'Gray Training Suit',
    gear: 'Basic Cap',
    walkout: 'Relaxed Stride',
    celebration: 'Wave',
  },
];

export const LockerRoomScreen: React.FC<LockerRoomScreenProps> = ({ onSave }) => {
  const [currentLook, setCurrentLook] = useState<SavedLook>(SavedLooks[0]);
  const [selectedOutfit, setSelectedOutfit] = useState('Blue Racing Suit');
  const [selectedGear, setSelectedGear] = useState('Aerodynamic Pro Cap');
  const [selectedWalkout, setSelectedWalkout] = useState('Confident Stride');
  const [selectedCelebration, setSelectedCelebration] = useState('Water Splash');

  const outfits = [
    { id: 'blue-suit', name: 'Blue Racing Suit', rarity: 'EPIC', preview: '🩱' },
    { id: 'black-suit', name: 'Black & Gold Suit', rarity: 'LEGENDARY', preview: '🩱' },
    { id: 'gray-suit', name: 'Gray Training Suit', rarity: 'RARE', preview: '🩱' },
    { id: 'cyan-suit', name: 'Cyan Speed Suit', rarity: 'EPIC', preview: '🩱' },
    { id: 'red-suit', name: 'Red Power Suit', rarity: 'RARE', preview: '🩱' },
    { id: 'purple-suit', name: 'Purple Elegance Suit', rarity: 'EPIC', preview: '🩱' },
  ];

  const gear = [
    { id: 'aero-cap', name: 'Aerodynamic Pro Cap', rarity: 'EPIC' },
    { id: 'dark-goggles', name: 'Dark Vision Goggles', rarity: 'RARE' },
    { id: 'basic-cap', name: 'Basic Cap', rarity: 'COMMON' },
    { id: 'speedz-goggles', name: 'SpeedZ Goggles', rarity: 'EPIC' },
    { id: 'polarized-cap', name: 'Polarized Pro Cap', rarity: 'RARE' },
  ];

  const walkouts = [
    { id: 'confident', name: 'Confident Stride', time: '3s' },
    { id: 'stealth', name: 'Stealth Walk', time: '2.5s' },
    { id: 'relaxed', name: 'Relaxed Stride', time: '3.5s' },
    { id: 'explosive', name: 'Explosive Entry', time: '2s' },
    { id: 'elegant', name: 'Elegant Walk', time: '3.5s' },
  ];

  const celebrations = [
    { id: 'splash', name: 'Water Splash', duration: '2s' },
    { id: 'fist', name: 'Fist Pump', duration: '1.5s' },
    { id: 'wave', name: 'Wave', duration: '2s' },
    { id: 'jump', name: 'Victory Jump', duration: '2.5s' },
    { id: 'spin', name: '360 Spin', duration: '2s' },
  ];

  return (
    <div className="hydro-page-shell flex-1 relative w-full h-full overflow-y-auto flex flex-col font-body">
      {/* Cinematic Header */}
      <div className="p-12 max-[900px]:p-8 bg-gradient-to-b from-primary/15 to-transparent border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between gap-8 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-12 bg-primary/40" />
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm animate-pulse">checkroom</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Biometric Fitting Laboratory</span>
              </div>
            </div>
            
            <h1 className="font-headline text-5xl max-[900px]:text-3xl font-black italic slanted uppercase text-on-surface text-glow">
              Locker Room
            </h1>
          </div>
          
          <div className="flex items-center gap-6 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
             <div className="flex flex-col text-right">
               <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Wardrobe Capacity</span>
               <span className="font-headline text-xl font-black italic slanted text-primary text-glow">12/50 Slots</span>
             </div>
             <div className="h-10 w-10 rounded-full border-2 border-primary/40 p-1">
                <div className="h-full w-full rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">dataset</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="hydro-page-content p-8 max-w-7xl mx-auto w-full space-y-12 pb-24">
        {/* Main Customization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: 3D Viewer */}
          <div className="lg:col-span-1 space-y-8">
            <div className="relative group/viewer rounded-[48px] overflow-hidden border border-white/5 bg-gradient-to-br from-white/10 to-transparent p-1 shadow-2xl">
              <div className="h-[500px] rounded-[44px] bg-surface flex flex-col items-center justify-center relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40" />
                
                <div className="relative mb-8">
                   <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
                   <span className="material-symbols-outlined text-[120px] text-primary relative z-10 text-glow">person</span>
                </div>

                <div className="text-center relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 block">Live Rendering</span>
                  <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow mb-1">{selectedOutfit}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant italic">{selectedGear}</p>
                </div>
                
                <div className="absolute top-8 right-8 flex flex-col gap-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="h-1 w-8 bg-primary/20 rounded-full" />
                   ))}
                </div>
              </div>

              {/* Environment Controls Overlay */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 p-2 rounded-2xl bg-surface/60 backdrop-blur-xl border border-white/10 scale-90 group-hover/viewer:scale-100 transition-all">
                {['Arena', 'Pool', 'Night'].map((env) => (
                  <button
                    key={env}
                    className="px-4 py-2 hover:bg-primary/20 hover:text-primary transition-all rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface"
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-2 gap-4">
               <button className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all font-headline font-black italic slanted uppercase text-[10px] tracking-widest text-on-surface-variant hover:text-primary">
                  Rotate 360
               </button>
               <button className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all font-headline font-black italic slanted uppercase text-[10px] tracking-widest text-on-surface-variant hover:text-primary">
                  Thermal View
               </button>
            </div>
          </div>

          {/* Center & Right: Customization Options */}
          <div className="lg:col-span-2 space-y-12">
            {/* Outfit Selection */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Hydro-Skin Suits</h3>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">New Arrivals: {outfits.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {outfits.map((outfit) => (
                  <button
                    key={outfit.id}
                    onClick={() => setSelectedOutfit(outfit.name)}
                    className={`group/opt relative p-6 rounded-[32px] text-left transition-all duration-500 border overflow-hidden ${
                      selectedOutfit === outfit.name
                        ? 'bg-primary/20 border-primary/40 shadow-[0_0_30px_rgba(129,236,255,0.15)]'
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-3xl border ${
                         selectedOutfit === outfit.name ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/5'
                      }`}>
                        {outfit.preview}
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                        outfit.rarity === 'LEGENDARY' ? 'border-secondary/40 text-secondary bg-secondary/10 shadow-[0_0_10px_rgba(255,215,9,0.2)]' :
                        outfit.rarity === 'EPIC' ? 'border-primary/40 text-primary bg-primary/10' : 'border-white/20 text-on-surface-variant bg-white/5'
                      }`}>
                        {outfit.rarity}
                      </span>
                    </div>
                    <div className="font-headline text-base font-black italic slanted uppercase text-on-surface mb-1 group-hover/opt:text-glow transition-all">{outfit.name}</div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 italic">Enhanced Drag Reduction +12%</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gear Selection */}
            <div className="space-y-6">
              <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Terminal Accessories</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gear.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedGear(item.name)}
                    className={`group/opt p-6 rounded-[28px] text-left transition-all duration-300 border overflow-hidden ${
                      selectedGear === item.name
                        ? 'bg-primary/20 border-primary/40'
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div className="font-headline text-sm font-black italic slanted uppercase text-on-surface mb-3 leading-tight group-hover/opt:text-primary transition-colors">{item.name}</div>
                      <span className={`text-[8px] font-black uppercase tracking-widest self-start px-2 py-1 rounded border ${
                        item.rarity === 'EPIC' ? 'border-primary/40 text-primary bg-primary/10' :
                        item.rarity === 'RARE' ? 'border-white/40 text-on-surface bg-white/10' : 'border-white/10 text-on-surface-variant bg-white/5'
                      }`}>
                        {item.rarity}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Animations Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Walkout Selection */}
               <div className="space-y-6">
                 <h3 className="font-headline text-lg font-black italic slanted uppercase text-on-surface text-glow">Entry Protocols</h3>
                 <div className="space-y-2">
                   {walkouts.map((walkout) => (
                     <button
                       key={walkout.id}
                       onClick={() => setSelectedWalkout(walkout.name)}
                       className={`w-full p-5 rounded-[20px] text-left font-headline font-black italic slanted uppercase text-[10px] tracking-widest flex items-center justify-between transition-all border ${
                         selectedWalkout === walkout.name
                           ? 'bg-primary/20 border-primary/40 text-primary'
                           : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20'
                       }`}
                     >
                       {walkout.name}
                       <span className="opacity-60">{walkout.time}</span>
                     </button>
                   ))}
                 </div>
               </div>

               {/* celebration Selection */}
               <div className="space-y-6">
                 <h3 className="font-headline text-lg font-black italic slanted uppercase text-on-surface text-glow">Victory Matrix</h3>
                 <div className="space-y-2">
                   {celebrations.map((celebration) => (
                     <button
                       key={celebration.id}
                       onClick={() => setSelectedCelebration(celebration.name)}
                       className={`w-full p-5 rounded-[20px] text-left font-headline font-black italic slanted uppercase text-[10px] tracking-widest flex items-center justify-between transition-all border ${
                         selectedCelebration === celebration.name
                           ? 'bg-primary/20 border-primary/40 text-primary'
                           : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20'
                       }`}
                     >
                       {celebration.name}
                       <span className="opacity-60">{celebration.duration}</span>
                     </button>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Saved Looks */}
        <div className="p-1 rounded-[48px] bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/5 overflow-hidden">
          <div className="p-10 rounded-[44px] bg-surface relative overflow-hidden">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow mb-8">Preset Configurations</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {SavedLooks.map((look) => (
                <button
                  key={look.id}
                  className="group/look p-6 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/40 rounded-[32px] text-left transition-all duration-500"
                >
                  <h4 className="font-headline text-sm font-black italic slanted uppercase text-on-surface mb-4 group-hover/look:text-primary transition-colors">{look.name}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
                       <span className="material-symbols-outlined text-xs">checkroom</span>
                       {look.outfit}
                    </div>
                    <div className="h-[1px] w-full bg-white/5" />
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
                       <span className="material-symbols-outlined text-xs">directions_walk</span>
                       {look.walkout}
                    </div>
                  </div>
                </button>
              ))}
              <button className="group/add p-6 bg-white/[0.03] border-2 border-dashed border-white/10 hover:border-primary/40 rounded-[32px] text-left transition-all flex items-center justify-center min-h-[160px]">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover/add:bg-primary transition-all">
                    <span className="material-symbols-outlined text-2xl group-hover/add:text-surface transition-colors">add</span>
                  </div>
                  <div className="font-headline text-[10px] font-black italic slanted uppercase tracking-widest text-on-surface-variant">Capture New State</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6">
          <button className="h-20 flex-1 px-8 rounded-[28px] bg-white/5 border border-white/10 hover:border-primary/40 transition-all font-headline font-black italic slanted uppercase text-xs tracking-widest text-on-surface-variant hover:text-on-surface">
            Reset All Parametrics
          </button>
          <button
            onClick={() => {
              const newLook: SavedLook = {
                id: Date.now().toString(),
                name: 'Custom Look',
                outfit: selectedOutfit,
                gear: selectedGear,
                walkout: selectedWalkout,
                celebration: selectedCelebration,
              };
              onSave?.(newLook);
            }}
            className="h-20 flex-1 px-8 rounded-[28px] bg-primary border border-white/20 shadow-[0_0_40px_rgba(129,236,255,0.3)] hover:shadow-[0_0_60px_rgba(129,236,255,0.5)] active:scale-95 transition-all font-headline font-black italic slanted uppercase text-xl leading-none text-surface flex items-center justify-center gap-4 group/save"
          >
            Overwrite Profile Look
            <span className="material-symbols-outlined text-3xl group-hover/save:translate-x-2 transition-transform">save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockerRoomScreen;
