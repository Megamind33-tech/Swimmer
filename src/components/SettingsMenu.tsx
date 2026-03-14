/**
 * SWIM 26 - Settings Menu
 * Configure arena, environment, time of day, lighting, etc.
 */

import React, { useState } from 'react';

interface SettingsMenuProps {
  onBack: () => void;
  onPlay: (mode: 'p2p' | 'multiplayer' | 'practice', venue: string, environment: string) => void;
}

type VenueType = 'olympic' | 'game7' | 'neon' | 'sunset' | 'custom';
type EnvironmentType = 'pool' | 'locker-room' | 'training' | 'school-gym';
type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

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

const TIMES_OF_DAY: Record<TimeOfDay, { name: string; description: string }> = {
  morning: { name: 'Morning', description: 'Bright daylight' },
  afternoon: { name: 'Afternoon', description: 'Peak sunlight' },
  evening: { name: 'Evening', description: 'Golden hour' },
  night: { name: 'Night', description: 'Artificial lighting' },
};

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ onBack, onPlay }) => {
  const [selectedMode, setSelectedMode] = useState<'p2p' | 'multiplayer' | 'practice'>('p2p');
  const [selectedVenue, setSelectedVenue] = useState<VenueType>('game7');
  const [selectedEnvironment, setSelectedEnvironment] = useState<EnvironmentType>('pool');
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>('afternoon');

  const handlePlay = () => {
    onPlay(selectedMode, selectedVenue, selectedEnvironment);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black z-[9997] flex items-center justify-center overflow-y-auto">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6 py-12 w-full">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-white tracking-tight mb-2">
            Settings
          </h1>
          <p className="text-slate-400 uppercase tracking-widest">
            Configure your swimming experience
          </p>
        </div>

        {/* Settings Grid */}
        <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4">
          {/* Game Mode */}
          <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">Game Mode</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['p2p', 'practice', 'multiplayer'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`py-3 px-4 rounded-lg transition-all font-semibold ${
                    selectedMode === mode
                      ? 'bg-cyan-500 text-white ring-2 ring-cyan-300'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {mode === 'p2p' && 'Play vs AI'}
                  {mode === 'practice' && 'Practice'}
                  {mode === 'multiplayer' && 'Multiplayer'}
                </button>
              ))}
            </div>
          </div>

          {/* Arena/Venue */}
          <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">Select Arena</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(Object.entries(VENUES) as [VenueType, typeof VENUES['olympic']][]).map(([key, venue]) => (
                <button
                  key={key}
                  onClick={() => setSelectedVenue(key)}
                  className={`p-4 rounded-lg transition-all ${
                    selectedVenue === key
                      ? 'bg-cyan-500 text-white ring-2 ring-cyan-300'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="font-bold text-lg">{venue.name}</div>
                  <div className="text-sm opacity-80">{venue.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Environment/Location */}
          <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">Select Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(Object.entries(ENVIRONMENTS) as [EnvironmentType, typeof ENVIRONMENTS['pool']][]).map(([key, env]) => (
                <button
                  key={key}
                  onClick={() => setSelectedEnvironment(key)}
                  className={`p-4 rounded-lg transition-all ${
                    selectedEnvironment === key
                      ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="font-bold text-lg">{env.name}</div>
                  <div className="text-sm opacity-80">{env.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time of Day / Lighting */}
          <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">Lighting & Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(Object.entries(TIMES_OF_DAY) as [TimeOfDay, typeof TIMES_OF_DAY['afternoon']][]).map(([key, time]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTime(key)}
                  className={`p-4 rounded-lg transition-all ${
                    selectedTime === key
                      ? 'bg-purple-500 text-white ring-2 ring-purple-300'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="font-bold text-lg">{time.name}</div>
                  <div className="text-sm opacity-80">{time.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">Summary</h2>
            <div className="space-y-2 text-slate-300">
              <p>
                <span className="text-slate-400">Game Mode:</span>{' '}
                <span className="text-cyan-400 font-semibold">
                  {selectedMode === 'p2p' && 'Play vs AI'}
                  {selectedMode === 'practice' && 'Practice'}
                  {selectedMode === 'multiplayer' && 'Multiplayer'}
                </span>
              </p>
              <p>
                <span className="text-slate-400">Arena:</span>{' '}
                <span className="text-cyan-400 font-semibold">{VENUES[selectedVenue].name}</span>
              </p>
              <p>
                <span className="text-slate-400">Location:</span>{' '}
                <span className="text-cyan-400 font-semibold">{ENVIRONMENTS[selectedEnvironment].name}</span>
              </p>
              <p>
                <span className="text-slate-400">Lighting:</span>{' '}
                <span className="text-cyan-400 font-semibold">{TIMES_OF_DAY[selectedTime].name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-12 sticky bottom-0">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-4 rounded-lg bg-slate-700 text-white font-bold uppercase transition-all hover:bg-slate-600"
          >
            ← Back to Menu
          </button>
          <button
            onClick={handlePlay}
            className="flex-1 group relative px-6 py-4 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:shadow-lg group-hover:shadow-emerald-500/50"></div>
            <span className="relative block font-bold text-xl text-white uppercase tracking-wide">
              Play
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
