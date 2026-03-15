/**
 * Race Gameplay HUD - SWIM 26 Material Design 3
 * On-screen HUD during active race with stroke controls and meters
 */

import React, { useState } from 'react';

interface RaceGameplayHUDProps {
  currentTime?: string;
  currentPosition?: number;
  totalDistance?: number;
  stamina?: number;
  power?: number;
  onPause?: () => void;
  onFinish?: () => void;
}

export const RaceGameplayHUD: React.FC<RaceGameplayHUDProps> = ({
  currentTime = '00:24.82',
  currentPosition = 2,
  totalDistance = 24,
  stamina = 72,
  power = 85,
  onPause,
  onFinish,
}) => {
  const [showControls, setShowControls] = useState(true);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-6">
      {/* Top HUD: Progress & Race Info */}
      <div className="flex justify-between items-start gap-4 pointer-events-auto">
        {/* Split Timer & Rank */}
        <div className="glass-panel p-4 flex flex-col gap-1 skew-12 border-l-4 border-primary">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>
              schedule
            </span>
            <span className="font-headline italic text-2xl text-on-surface tracking-tighter">{currentTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">CURRENT SPLIT</span>
            <span className="font-headline italic text-secondary text-xl">{currentPosition}nd</span>
          </div>
        </div>

        {/* Race Progress Bar */}
        <div className="flex-1 max-w-xl glass-panel h-14 skew-12 relative flex items-center px-6 overflow-hidden">
          <div className="absolute inset-0 bg-surface-container-low/40" />
          <div className="w-full h-1.5 bg-surface-container-highest relative">
            {/* Swimmer Progress Marker */}
            <div className="absolute h-full bg-secondary shadow-[0_0_15px_rgba(191,202,253,0.5)]" style={{width: `${(totalDistance / 50) * 100}%`}} />
            {/* Competitor Markers */}
            <div className="absolute h-4 w-1 bg-primary -top-1.5" style={{left: '52%'}} />
            <div className="absolute h-4 w-1 bg-on-surface-variant -top-1.5 opacity-50" style={{left: '45%'}} />
          </div>
          <div className="absolute bottom-1 right-6 flex items-baseline gap-1">
            <span className="font-headline italic text-lg">{totalDistance}</span>
            <span className="font-label text-[10px] text-on-surface-variant">/ 50m</span>
          </div>
        </div>

        {/* User Status */}
        <div className="glass-panel px-6 py-2 skew-12 border-r-4 border-secondary pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-label text-[10px] tracking-[0.2em] text-on-surface-variant">STATUS</p>
              <p className="font-headline italic text-xl text-on-surface">LVL 99</p>
            </div>
            <div className="h-10 w-10 bg-primary-container flex items-center justify-center -skew-x-12 rounded">
              <span className="material-symbols-outlined text-on-primary-container">person</span>
            </div>
          </div>
        </div>
      </div>

      {/* Central Action: HUD Brackets (Focus HUD) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 pointer-events-none">
        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary/50" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-secondary/50" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-secondary/50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary/50" />
        {/* Velocity Vector Line */}
        <div className="absolute left-1/2 bottom-0 h-16 w-[1px] bg-gradient-to-t from-secondary to-transparent" />
      </div>

      {/* Bottom Controls & Meters */}
      {showControls && (
        <div className="flex justify-between items-end gap-12 h-48 pointer-events-auto">
          {/* Left: Stroke Control */}
          <div className="h-full w-48 glass-panel border-t-4 border-primary/30 flex flex-col items-center justify-center group active:bg-primary/20 transition-colors">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="material-symbols-outlined text-6xl text-primary">touch_app</span>
            </div>
            <p className="font-label text-[10px] tracking-[0.3em] text-primary mb-2">LEFT STROKE</p>
            <div className="w-12 h-1 bg-primary/20 overflow-hidden">
              <div className="h-full bg-primary w-1/2" />
            </div>
          </div>

          {/* Center: Power & Stamina Meters */}
          <div className="flex-1 flex flex-col items-center justify-end pb-4 gap-6">
            {/* Circular Stamina Meter */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8" />
                <circle
                  className="text-secondary"
                  cx="64"
                  cy="64"
                  fill="transparent"
                  r="58"
                  stroke="currentColor"
                  strokeDasharray="364"
                  strokeDashoffset={Math.max(0, 364 - (stamina / 100) * 364)}
                  strokeWidth="8"
                  style={{filter: 'drop-shadow(0 0 10px #bfcafd)'}}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-headline italic text-3xl text-on-surface">{stamina}%</span>
                <span className="font-label text-[8px] tracking-widest text-on-surface-variant">STAMINA</span>
              </div>
            </div>

            {/* Stroke Power Gauge */}
            <div className="w-full max-w-md flex flex-col gap-2">
              <div className="flex justify-between items-end px-2">
                <span className="font-label text-[10px] tracking-widest text-primary">POWER OUTPUT</span>
                <span className="font-headline italic text-lg text-primary">MAX STRETCH</span>
              </div>
              <div className="h-4 bg-surface-container-highest flex p-0.5 skew-12">
                <div className="h-full bg-primary w-[85%] shadow-[0_0_15px_rgba(129,236,255,0.3)]" />
                <div className="h-full bg-white/10 w-[15%] ml-0.5" />
              </div>
            </div>
          </div>

          {/* Right: Stroke Control */}
          <div className="h-full w-48 glass-panel border-t-4 border-secondary/30 flex flex-col items-center justify-center group active:bg-secondary/20 transition-colors">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="material-symbols-outlined text-6xl text-secondary">touch_app</span>
            </div>
            <p className="font-label text-[10px] tracking-[0.3em] text-secondary mb-2">RIGHT STROKE</p>
            <div className="w-12 h-1 bg-secondary/20 overflow-hidden">
              <div className="h-full bg-secondary w-3/4" />
            </div>
          </div>
        </div>
      )}

      {/* Performance Ticker at Bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest/80 h-6 border-t border-outline-variant/15 overflow-hidden flex items-center z-40 pointer-events-auto">
        <div className="flex whitespace-nowrap gap-12 px-4 animate-scroll">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-secondary rounded-full" />
            <span className="font-label text-[10px] tracking-tighter text-on-surface-variant uppercase">LANE 4: MCKENZIE (USA) - 0.2s LEAD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full" />
            <span className="font-label text-[10px] tracking-tighter text-on-surface-variant uppercase">SWIM26 CHAMPIONSHIP SERIES - SEMI FINAL 1</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-error rounded-full" />
            <span className="font-label text-[10px] tracking-tighter text-on-surface-variant uppercase">LANE 1: DISQUALIFIED - EARLY START</span>
          </div>
        </div>
      </div>

      {/* Pause/Finish Buttons - Top Right */}
      <div className="fixed top-6 right-6 flex gap-2 pointer-events-auto z-50">
        <button
          onClick={onPause}
          className="glass-panel px-4 py-2 rounded-lg border-l-4 border-primary hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-primary">pause</span>
        </button>
        <button
          onClick={onFinish}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg hover:bg-primary-dim transition-colors font-bold text-sm uppercase"
        >
          Finish
        </button>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RaceGameplayHUD;
