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
    <div className="w-full h-full overflow-y-auto p-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Locker Room</h1>
          <p className="text-slate-400">Customize your athlete's look</p>
        </div>

        {/* Main Customization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: 3D Viewer */}
          <div className="lg:col-span-1">
            {/* 3D Character Viewer Placeholder */}
            <div className="bg-gradient-to-b from-slate-600 to-slate-700 rounded-lg h-96 flex flex-col items-center justify-center border border-slate-600/50 space-y-4">
              <div className="text-8xl">👤</div>
              <p className="text-slate-300 text-center px-4">
                <span className="block font-bold mb-1">{selectedOutfit}</span>
                <span className="text-sm text-slate-400">{selectedGear}</span>
              </p>
            </div>

            {/* Lighting & Environment Controls */}
            <div className="mt-4 space-y-2">
              <label className="text-sm text-slate-300">Environment</label>
              <div className="grid grid-cols-3 gap-2">
                {['Arena', 'Pool', 'Night'].map((env) => (
                  <button
                    key={env}
                    className="px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded text-xs font-bold text-white transition-colors"
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center & Right: Customization Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Outfit Selection */}
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
              <h3 className="text-xl font-black text-white mb-4">Racing Suits</h3>
              <div className="grid grid-cols-2 gap-3">
                {outfits.map((outfit) => (
                  <button
                    key={outfit.id}
                    onClick={() => setSelectedOutfit(outfit.name)}
                    className={`p-4 rounded-lg text-left transition-all border ${
                      selectedOutfit === outfit.name
                        ? 'bg-cyan-500/30 border-cyan-500/50'
                        : 'bg-slate-600/30 border-slate-600/30 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{outfit.preview}</div>
                    <div className="font-bold text-white text-sm">{outfit.name}</div>
                    <span
                      className={`text-xs px-2 py-1 rounded mt-2 inline-block font-bold ${
                        outfit.rarity === 'LEGENDARY'
                          ? 'bg-yellow-500/30 text-yellow-300'
                          : outfit.rarity === 'EPIC'
                          ? 'bg-purple-500/30 text-purple-300'
                          : 'bg-blue-500/30 text-blue-300'
                      }`}
                    >
                      {outfit.rarity}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gear Selection */}
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
              <h3 className="text-xl font-black text-white mb-4">Gear & Accessories</h3>
              <div className="grid grid-cols-2 gap-3">
                {gear.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedGear(item.name)}
                    className={`p-4 rounded-lg text-left transition-all border ${
                      selectedGear === item.name
                        ? 'bg-cyan-500/30 border-cyan-500/50'
                        : 'bg-slate-600/30 border-slate-600/30 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="font-bold text-white text-sm">{item.name}</div>
                    <span
                      className={`text-xs px-2 py-1 rounded mt-2 inline-block font-bold ${
                        item.rarity === 'EPIC'
                          ? 'bg-purple-500/30 text-purple-300'
                          : item.rarity === 'RARE'
                          ? 'bg-blue-500/30 text-blue-300'
                          : 'bg-slate-500/30 text-slate-300'
                      }`}
                    >
                      {item.rarity}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Walkout Animation */}
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
              <h3 className="text-xl font-black text-white mb-4">Walkout Animation</h3>
              <div className="space-y-2">
                {walkouts.map((walkout) => (
                  <button
                    key={walkout.id}
                    onClick={() => setSelectedWalkout(walkout.name)}
                    className={`w-full px-4 py-3 rounded-lg text-left font-bold flex items-center justify-between transition-all border ${
                      selectedWalkout === walkout.name
                        ? 'bg-cyan-500/30 border-cyan-500/50 text-white'
                        : 'bg-slate-600/30 border-slate-600/30 text-slate-300 hover:bg-slate-600/50'
                    }`}
                  >
                    {walkout.name}
                    <span className="text-sm opacity-75">{walkout.time}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Celebration Animation */}
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
              <h3 className="text-xl font-black text-white mb-4">Victory Celebration</h3>
              <div className="space-y-2">
                {celebrations.map((celebration) => (
                  <button
                    key={celebration.id}
                    onClick={() => setSelectedCelebration(celebration.name)}
                    className={`w-full px-4 py-3 rounded-lg text-left font-bold flex items-center justify-between transition-all border ${
                      selectedCelebration === celebration.name
                        ? 'bg-cyan-500/30 border-cyan-500/50 text-white'
                        : 'bg-slate-600/30 border-slate-600/30 text-slate-300 hover:bg-slate-600/50'
                    }`}
                  >
                    {celebration.name}
                    <span className="text-sm opacity-75">{celebration.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Saved Looks */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/30">
          <h3 className="text-xl font-black text-white mb-4">Saved Looks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SavedLooks.map((look) => (
              <button
                key={look.id}
                className="p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg border border-purple-500/50 text-left transition-all"
              >
                <div className="font-bold text-white mb-2">{look.name}</div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div>🩱 {look.outfit}</div>
                  <div>🏊 {look.walkout}</div>
                  <div>🎉 {look.celebration}</div>
                </div>
              </button>
            ))}
            <button className="p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600/30 text-left transition-all flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">+</div>
                <div className="font-bold text-white">Save New Look</div>
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 px-6 py-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white font-bold uppercase transition-all">
            Reset to Default
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
            className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/50 rounded-lg text-white font-bold uppercase transition-all"
          >
            Save Look
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockerRoomScreen;
