/**
 * Pre-Race Setup Screen - Race configuration
 * Swimmer selection, event setup, opponents, rewards, confirmatio n
 */

import React, { useState } from 'react';

interface PreRaceSetupScreenProps {
  mode?: string;
  onConfirmRace?: () => void;
  onCancel?: () => void;
}

export const PreRaceSetupScreen: React.FC<PreRaceSetupScreenProps> = ({
  mode = 'Quick Race',
  onConfirmRace,
  onCancel,
}) => {
  const [selectedDistance, setSelectedDistance] = useState('100M');
  const [selectedStroke, setSelectedStroke] = useState('FREESTYLE');
  const [selectedVenue, setSelectedVenue] = useState('olympic');
  const [isStarting, setIsStarting] = useState(false);

  const distances = ['50M', '100M', '200M', '400M', '800M', '1500M'];
  const strokes = ['FREESTYLE', 'BUTTERFLY', 'BREASTSTROKE', 'BACKSTROKE', 'IM'];
  const venues = [
    { id: 'olympic', name: 'Olympic Arena', weather: 'Clear' },
    { id: 'training', name: 'Training Facility', weather: 'Indoor' },
    { id: 'championship', name: 'Championship Pool', weather: 'Clear' },
    { id: 'neon', name: 'Neon District', weather: 'Night' },
  ];

  const opponents = [
    { name: 'Kaito M.', rank: '#45', specialty: 'Freestyler' },
    { name: 'Luna S.', rank: '#123', specialty: 'Distance' },
    { name: 'Alex J.', rank: '#89', specialty: 'Technician' },
    { name: 'Mira P.', rank: '#234', specialty: 'Sprinter' },
  ];

  return (
    <div className="w-full h-full p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">{mode} Setup</h1>
          <p className="text-slate-400">Configure your race</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Race Configuration */}
          <div className="space-y-6">
            {/* Distance Selection */}
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
              <h3 className="text-lg font-black text-white mb-4">Distance</h3>
              <div className="grid grid-cols-3 gap-2">
                {distances.map((dist) => (
                  <button
                    key={dist}
                    onClick={() => setSelectedDistance(dist)}
                    className={`px-4 py-3 rounded-lg font-bold uppercase text-sm transition-all ${
                      selectedDistance === dist
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/50'
                    }`}
                  >
                    {dist}
                  </button>
                ))}
              </div>
            </div>

            {/* Stroke Selection */}
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
              <h3 className="text-lg font-black text-white mb-4">Stroke</h3>
              <div className="grid grid-cols-2 gap-2">
                {strokes.map((stroke) => (
                  <button
                    key={stroke}
                    onClick={() => setSelectedStroke(stroke)}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      selectedStroke === stroke
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/50'
                    }`}
                  >
                    {stroke}
                  </button>
                ))}
              </div>
            </div>

            {/* Venue Selection */}
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
              <h3 className="text-lg font-black text-white mb-4">Venue</h3>
              <div className="space-y-2">
                {venues.map((venue) => (
                  <button
                    key={venue.id}
                    onClick={() => setSelectedVenue(venue.id)}
                    className={`w-full px-4 py-3 rounded-lg text-left font-bold transition-all ${
                      selectedVenue === venue.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-slate-600/30 text-slate-300 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{venue.name}</span>
                      <span className="text-xs opacity-75">{venue.weather}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Opponents & Summary */}
          <div className="space-y-6">
            {/* Swimmer Summary */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg p-6 border border-cyan-500/30">
              <h3 className="text-lg font-black text-cyan-400 mb-4">Your Swimmer</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-black text-2xl">
                    A
                  </div>
                  <div>
                    <div className="font-bold text-white">Elite Swimmer</div>
                    <div className="text-sm text-cyan-400">Level 45</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-600/50">
                  <div className="text-xs">
                    <div className="text-slate-400">Speed</div>
                    <div className="font-bold text-white text-lg">18 / 20</div>
                  </div>
                  <div className="text-xs">
                    <div className="text-slate-400">Endurance</div>
                    <div className="font-bold text-white text-lg">17 / 20</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opponents */}
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
              <h3 className="text-lg font-black text-white mb-4">Opponents</h3>
              <div className="space-y-2">
                {opponents.map((opp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-slate-600/30 rounded p-3 hover:bg-slate-600/50 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{opp.name}</div>
                      <div className="text-xs text-slate-400">{opp.specialty}</div>
                    </div>
                    <div className="text-sm font-bold text-cyan-400">{opp.rank}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Race Summary */}
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg p-6 border border-blue-500/30">
              <h3 className="text-lg font-black text-white mb-4">Race Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Mode:</span>
                  <span className="font-bold text-white">{mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Distance:</span>
                  <span className="font-bold text-white">{selectedDistance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Stroke:</span>
                  <span className="font-bold text-white">{selectedStroke}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-blue-500/30">
                  <span className="text-slate-300">Est. Reward:</span>
                  <span className="font-bold text-emerald-400">150 XP • 1000 Coins</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 max-w-4xl mx-auto">
          <button
            onClick={onCancel}
            disabled={isStarting}
            className="flex-1 px-8 py-4 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500 text-white font-bold uppercase transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setIsStarting(true);
              setTimeout(() => {
                onConfirmRace?.();
              }, 300);
            }}
            disabled={isStarting}
            className="flex-1 group relative px-8 py-4 rounded-lg overflow-hidden text-white font-bold uppercase transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 group-hover:opacity-110 transition-opacity duration-300"></div>

            {/* Animated shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-white to-transparent transition-all duration-500"></div>

            {/* Loading animation */}
            {isStarting && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            )}

            {/* Content */}
            <span className="relative flex items-center justify-center gap-2">
              {isStarting ? (
                <>
                  <span>Loading Race...</span>
                  <span className="inline-block animate-spin">⚡</span>
                </>
              ) : (
                <>
                  <span>Start Race</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </>
              )}
            </span>

            {/* Bottom glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-50 blur-sm transition-all duration-300"></div>
          </button>
        </div>

        <style>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PreRaceSetupScreen;
