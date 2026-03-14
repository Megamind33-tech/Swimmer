/**
 * SWIM 26 - Main Menu
 * Players can select play mode, venue, and environment
 */

import React, { useState } from 'react';

interface MainMenuProps {
  onPlay: (mode: 'p2p' | 'multiplayer' | 'practice', venue: string, environment: string) => void;
}

type VenueType = 'olympic' | 'game7' | 'neon' | 'sunset' | 'custom';
type EnvironmentType = 'pool' | 'locker-room' | 'training' | 'school-gym';

const VENUES: Record<VenueType, { name: string; description: string }> = {
  olympic: { name: 'Olympic Arena', description: 'World Championships' },
  game7: { name: 'Game 7', description: 'Finals Championship' },
  neon: { name: 'Neon Night', description: 'Night Invitational' },
  sunset: { name: 'Sunset', description: 'Open Air Classic' },
  custom: { name: 'Custom', description: 'Design Your Arena' },
};

const ENVIRONMENTS: Record<EnvironmentType, { name: string; description: string }> = {
  pool: { name: 'Olympic Pool', description: '50m Championship Pool' },
  'locker-room': { name: 'Locker Room', description: 'Training Area' },
  training: { name: 'Training Facility', description: 'Advanced Training' },
  'school-gym': { name: 'School Gym', description: 'Community Pool' },
};

export const MainMenu: React.FC<MainMenuProps> = ({ onPlay }) => {
  const [step, setStep] = useState<'mode' | 'venue' | 'environment'>('mode');
  const [selectedMode, setSelectedMode] = useState<'p2p' | 'multiplayer' | 'practice'>('p2p');
  const [selectedVenue, setSelectedVenue] = useState<VenueType>('game7');
  const [selectedEnvironment, setSelectedEnvironment] = useState<EnvironmentType>('pool');

  const handleModeSelect = (mode: 'p2p' | 'multiplayer' | 'practice') => {
    setSelectedMode(mode);
    setStep('venue');
  };

  const handleVenueSelect = (venue: VenueType) => {
    setSelectedVenue(venue);
    setStep('environment');
  };

  const handleStart = (env: EnvironmentType) => {
    onPlay(selectedMode, selectedVenue, env);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black z-[9997] flex items-center justify-center overflow-y-auto">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight mb-2">
            SWIM <span className="text-cyan-400">26</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 uppercase tracking-widest">
            Championship Swimming
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          <div className={`h-2 w-8 rounded-full transition-all ${step === 'mode' ? 'bg-cyan-400' : 'bg-slate-700'}`}></div>
          <div className={`h-2 w-8 rounded-full transition-all ${step === 'venue' ? 'bg-cyan-400' : 'bg-slate-700'}`}></div>
          <div className={`h-2 w-8 rounded-full transition-all ${step === 'environment' ? 'bg-cyan-400' : 'bg-slate-700'}`}></div>
        </div>

        {/* Game Mode Selection */}
        {step === 'mode' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Select Game Mode</h2>
            <button
              onClick={() => handleModeSelect('p2p')}
              className="w-full group relative px-12 py-4 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
              <span className="relative block font-bold text-lg text-white uppercase tracking-wide">
                Play vs AI
              </span>
            </button>

            <button
              onClick={() => handleModeSelect('practice')}
              className="w-full group relative px-12 py-4 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:shadow-lg group-hover:shadow-purple-500/50"></div>
              <span className="relative block font-bold text-lg text-white uppercase tracking-wide">
                Practice Mode
              </span>
            </button>

            <button
              onClick={() => handleModeSelect('multiplayer')}
              className="w-full group relative px-12 py-4 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:shadow-lg group-hover:shadow-emerald-500/50"></div>
              <span className="relative block font-bold text-lg text-white uppercase tracking-wide">
                Multiplayer
              </span>
            </button>
          </div>
        )}

        {/* Venue Selection */}
        {step === 'venue' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Select Arena</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(Object.entries(VENUES) as [VenueType, typeof VENUES['olympic']][]).map(([key, venue]) => (
                <button
                  key={key}
                  onClick={() => handleVenueSelect(key)}
                  className={`p-4 rounded-lg transition-all ${
                    selectedVenue === key
                      ? 'bg-cyan-500 text-white ring-2 ring-cyan-300'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="font-bold">{venue.name}</div>
                  <div className="text-sm opacity-80">{venue.description}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('mode')}
              className="mt-6 px-6 py-2 text-slate-400 hover:text-white transition"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Environment Selection */}
        {step === 'environment' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Select Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(Object.entries(ENVIRONMENTS) as [EnvironmentType, typeof ENVIRONMENTS['pool']][]).map(([key, env]) => (
                <button
                  key={key}
                  onClick={() => handleStart(key)}
                  className="p-4 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-emerald-600 hover:text-white transition-all hover:scale-105"
                >
                  <div className="font-bold">{env.name}</div>
                  <div className="text-sm opacity-80">{env.description}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('venue')}
              className="mt-6 px-6 py-2 text-slate-400 hover:text-white transition"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-sm text-slate-500 mt-12">
          Powered by Babylon.js • © 2026 Mosty Games
        </p>
      </div>
    </div>
  );
};

export default MainMenu;
