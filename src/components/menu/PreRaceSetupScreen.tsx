/**
 * Pre-Race Setup Screen - Race configuration
 * Swimmer selection, event setup, opponents, rewards, confirmation
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
    <div className="w-full h-full overflow-y-auto p-8 max-[900px]:p-4 space-y-8 relative safe-zone-x">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-broadcast-overlay via-neon-cyan/5 to-broadcast-overlay p-6 rounded-2xl border border-neon-cyan/20">
          <h1 className="text-5xl max-[900px]:text-3xl font-din font-black text-white mb-2 drop-shadow-[0_0_12px_rgba(0,255,255,0.3)]">{mode} Setup</h1>
          <p className="text-white/80 text-base font-barlow font-bold">Configure your race and prepare for battle</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Race Configuration */}
          <div className="space-y-6">
            {/* Distance Selection */}
            <div className="glass-card-elevated rounded-2xl p-6 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 skew-container">
              <h3 className="text-xl font-din font-black text-neon-cyan mb-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">Distance</h3>
              <div className="grid grid-cols-3 gap-2">
                {distances.map((dist) => (
                  <button
                    key={dist}
                    onClick={() => setSelectedDistance(dist)}
                    className={`px-4 py-3 rounded-xl font-bold uppercase text-sm transition-all active:animate-squash-stretch ${
                      selectedDistance === dist
                        ? 'bg-neon-cyan/30 text-neon-cyan border-2 border-neon-cyan shadow-lg shadow-neon-cyan/30 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]'
                        : 'bg-neon-cyan/5 text-white/70 border border-neon-cyan/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/10'
                    }`}
                  >
                    {dist}
                  </button>
                ))}
              </div>
            </div>

            {/* Stroke Selection */}
            <div className="glass-card-elevated rounded-2xl p-6 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 skew-container">
              <h3 className="text-xl font-din font-black text-neon-cyan mb-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">Stroke</h3>
              <div className="grid grid-cols-2 gap-2">
                {strokes.map((stroke) => (
                  <button
                    key={stroke}
                    onClick={() => setSelectedStroke(stroke)}
                    className={`px-4 py-3 rounded-xl font-bold text-sm transition-all active:animate-squash-stretch ${
                      selectedStroke === stroke
                        ? 'bg-neon-cyan/30 text-neon-cyan border-2 border-neon-cyan shadow-lg shadow-neon-cyan/30 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]'
                        : 'bg-neon-cyan/5 text-white/70 border border-neon-cyan/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/10'
                    }`}
                  >
                    {stroke}
                  </button>
                ))}
              </div>
            </div>

            {/* Venue Selection */}
            <div className="glass-card-elevated rounded-2xl p-6 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 skew-container">
              <h3 className="text-xl font-din font-black text-neon-cyan mb-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">Venue</h3>
              <div className="space-y-2">
                {venues.map((venue) => (
                  <button
                    key={venue.id}
                    onClick={() => setSelectedVenue(venue.id)}
                    className={`w-full px-4 py-3 rounded-xl text-left font-bold transition-all active:animate-squash-stretch ${
                      selectedVenue === venue.id
                        ? 'bg-neon-cyan/30 text-neon-cyan border-2 border-neon-cyan shadow-lg shadow-neon-cyan/30'
                        : 'bg-neon-cyan/5 text-white/70 border border-neon-cyan/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/10'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-barlow">{venue.name}</span>
                      <span className="text-xs opacity-75 font-barlow">{venue.weather}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Opponents & Summary */}
          <div className="space-y-6">
            {/* Swimmer Summary */}
            <div className="glass-card-elevated rounded-2xl p-6 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 skew-container">
              <h3 className="text-xl font-din font-black text-neon-cyan mb-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">Your Swimmer</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-cyan-400 flex items-center justify-center text-white font-din font-black text-2xl shadow-lg shadow-neon-cyan/40">
                    A
                  </div>
                  <div>
                    <div className="font-bold font-barlow text-white">Elite Swimmer</div>
                    <div className="text-sm text-neon-cyan font-barlow font-bold drop-shadow-[0_0_4px_rgba(0,255,255,0.4)]">Level 45</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neon-cyan/20">
                  <div className="text-xs bg-neon-cyan/5 p-2 rounded-lg border border-neon-cyan/20">
                    <div className="text-white/70 font-barlow text-[10px]">Speed</div>
                    <div className="font-bold text-neon-cyan text-lg font-barlow">18 / 20</div>
                  </div>
                  <div className="text-xs bg-neon-cyan/5 p-2 rounded-lg border border-neon-cyan/20">
                    <div className="text-white/70 font-barlow text-[10px]">Endurance</div>
                    <div className="font-bold text-neon-cyan text-lg font-barlow">17 / 20</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opponents */}
            <div className="glass-card-elevated rounded-2xl p-6 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 skew-container">
              <h3 className="text-xl font-din font-black text-neon-cyan mb-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">Opponents</h3>
              <div className="space-y-2">
                {opponents.map((opp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl p-3 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all"
                  >
                    <div>
                      <div className="font-bold font-barlow text-white text-sm">{opp.name}</div>
                      <div className="text-xs text-white/70 font-barlow">{opp.specialty}</div>
                    </div>
                    <div className="text-sm font-bold text-neon-cyan font-barlow drop-shadow-[0_0_4px_rgba(0,255,255,0.4)]">{opp.rank}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Race Summary */}
            <div className="glass-card-elevated rounded-2xl p-6 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 skew-container">
              <h3 className="text-xl font-din font-black text-neon-cyan mb-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">Race Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70 font-barlow">Mode:</span>
                  <span className="font-bold font-barlow text-white">{mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70 font-barlow">Distance:</span>
                  <span className="font-bold font-barlow text-white">{selectedDistance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70 font-barlow">Stroke:</span>
                  <span className="font-bold font-barlow text-white">{selectedStroke}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-neon-cyan/20">
                  <span className="text-white/70 font-barlow">Est. Reward:</span>
                  <span className="font-bold text-yellow-400 font-barlow drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]">150 XP • 1000 Coins</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 max-w-5xl mx-auto">
          <button
            onClick={onCancel}
            disabled={isStarting}
            className="flex-1 px-8 py-4 rounded-2xl bg-neon-cyan/10 hover:bg-neon-cyan/20 border-2 border-neon-cyan/30 hover:border-neon-cyan/60 text-white font-bold font-barlow uppercase transition-all duration-300 hover:scale-105 active:scale-95 active:animate-squash-stretch disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="flex-1 group relative px-8 py-4 rounded-2xl overflow-hidden text-white font-bold font-barlow uppercase transition-all duration-300 hover:scale-105 active:scale-95 active:animate-squash-stretch disabled:opacity-50 disabled:cursor-not-allowed border-2 border-neon-cyan/50 hover:border-neon-cyan"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/30 via-neon-cyan/20 to-neon-cyan/30 group-hover:opacity-110 transition-opacity duration-300"></div>

            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-r from-white to-transparent transition-all duration-500"></div>

            {/* Loading animation */}
            {isStarting && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent animate-pulse"></div>
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
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-0 group-hover:opacity-50 blur-sm transition-all duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreRaceSetupScreen;
