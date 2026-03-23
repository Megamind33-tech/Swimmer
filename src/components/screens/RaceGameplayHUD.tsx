/**
 * RaceGameplayHUD — Static demo screen
 *
 * Mobile-responsive: matches the same breakpoint contract as the main HUD.
 *   - Portrait  ≤ 480px: stroke zones compressed, progress bar + status hidden
 *   - Landscape ≤ 896px: modest size reduction
 *   - Tablet / Desktop: full sizing
 */

import React from 'react';

export const RaceGameplayHUD: React.FC = () => {
  return (
    <div className="bg-background text-on-surface font-body overflow-hidden h-screen w-screen dark">
      {/* ── Pool Background ────────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 bg-[#061B2E]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A2E4A]/80 via-[#0D3A5C]/40 to-background/90" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_80%_40%_at_50%_60%,rgba(24,200,240,0.3),transparent)]" />
        {/* Lane lines */}
        <div className="absolute inset-0 flex flex-col justify-around opacity-[0.04] pointer-events-none">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-full h-px bg-white" />
          ))}
        </div>
      </div>

      {/* ── HUD Overlay ────────────────────────────────────────────────────── */}
      <div className="relative z-10 h-full w-full flex flex-col justify-between p-3 sm:p-6 pb-8 sm:pb-10">

        {/* ── TOP HUD ──────────────────────────────────────────────────────── */}
        <header className="flex justify-between items-start gap-2 sm:gap-4">

          {/* Split Timer & Rank */}
          <div className="glass-panel p-2 sm:p-4 flex flex-col gap-1 -skew-x-12 border-l-4 border-primary">
            <div className="flex items-center gap-1 sm:gap-2">
              <span style={{ fontSize: '18px', lineHeight: 1, display: 'inline-block' }} className="text-secondary">⏱</span>
              <span className="font-headline italic text-lg sm:text-2xl tracking-tighter text-on-surface">00:24.82</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-label text-[9px] sm:text-[10px] tracking-widest text-on-surface-variant uppercase">SPLIT</span>
              <span className="font-headline italic text-secondary text-base sm:text-xl">2nd</span>
            </div>
          </div>

          {/* Race Progress Bar — hidden on portrait phones */}
          <div className="swim26-race-progress hidden sm:flex flex-1 max-w-xl glass-panel h-10 sm:h-14 -skew-x-12 relative items-center px-3 sm:px-6 overflow-hidden">
            <div className="absolute inset-0 bg-surface-container-low/40" />
            <div className="w-full h-1.5 bg-surface-container-highest relative">
              <div className="absolute h-full bg-secondary shadow-[0_0_15px_rgba(195,244,0,0.5)]" style={{ width: '48%' }} />
              <div className="absolute h-4 w-1 bg-primary -top-1.5" style={{ left: '52%' }} />
              <div className="absolute h-4 w-1 bg-on-surface-variant -top-1.5 opacity-50" style={{ left: '45%' }} />
            </div>
            <div className="absolute bottom-1 right-3 sm:right-6 flex items-baseline gap-1">
              <span className="font-headline italic text-base sm:text-lg">24</span>
              <span className="font-label text-[10px] text-on-surface-variant">/ 50m</span>
            </div>
          </div>

          {/* User Status — hidden on portrait phones */}
          <div className="swim26-user-status hidden sm:flex glass-panel px-3 sm:px-6 py-2 skew-x-12 border-r-4 border-secondary items-center gap-2 sm:gap-3">
            <div className="text-right">
              <p className="font-label text-[9px] sm:text-[10px] tracking-[0.2em] text-on-surface-variant">STATUS</p>
              <p className="font-headline italic text-lg sm:text-xl text-on-surface">LVL 99</p>
            </div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-container flex items-center justify-center -skew-x-12 rounded">
              <span style={{ fontSize: '20px', lineHeight: 1, display: 'inline-block' }} className="text-on-primary-container">👤</span>
            </div>
          </div>
        </header>

        {/* ── Central HUD Brackets ─────────────────────────────────────────── */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-40 sm:w-96 sm:h-64 pointer-events-none">
          <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-secondary/50" />
          <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-secondary/50" />
          <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-secondary/50" />
          <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-secondary/50" />
          <div className="absolute left-1/2 bottom-0 h-10 sm:h-16 w-[1px] bg-gradient-to-t from-secondary to-transparent" />
        </div>

        {/* ── Bottom Controls & Meters ─────────────────────────────────────── */}
        <footer className="swim26-controls-gap flex justify-between items-end gap-2 sm:gap-12">

          {/* Left Stroke Control */}
          <div
            className="swim26-stroke-btn swim26-stroke-zone glass-panel border-t-4 border-primary/30 flex flex-col items-center justify-center active:bg-primary/20 transition-colors relative overflow-hidden"
            style={{ minWidth: '72px' }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <span style={{ fontSize: '36px', lineHeight: 1, display: 'inline-block' }} className="text-primary">☝</span>
            </div>
            <p className="font-label text-[9px] sm:text-[10px] tracking-[0.3em] text-primary mb-2">L STROKE</p>
            <div className="w-8 sm:w-12 h-1 bg-primary/20 overflow-hidden">
              <div className="h-full bg-primary w-1/2" />
            </div>
          </div>

          {/* Center: Stamina Ring + Power Gauge */}
          <div className="flex-1 flex flex-col items-center justify-end pb-1 sm:pb-4 gap-3 sm:gap-6">
            {/* Circular Stamina Meter */}
            <div className="relative w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8" />
                <circle
                  className="text-secondary"
                  cx="64" cy="64"
                  fill="transparent"
                  r="58"
                  stroke="currentColor"
                  strokeDasharray="364"
                  strokeDashoffset="100"
                  strokeWidth="8"
                  style={{ filter: 'drop-shadow(0 0 10px #bfcafd)' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-headline italic text-xl sm:text-3xl text-on-surface">72%</span>
                <span className="font-label text-[7px] sm:text-[8px] tracking-widest text-on-surface-variant">STAMINA</span>
              </div>
            </div>

            {/* Stroke Power Gauge */}
            <div className="w-full max-w-xs sm:max-w-md flex flex-col gap-1 sm:gap-2">
              <div className="flex justify-between items-end px-1 sm:px-2">
                <span className="font-label text-[9px] sm:text-[10px] tracking-widest text-primary">POWER</span>
                <span className="font-headline italic text-sm sm:text-lg text-primary">MAX</span>
              </div>
              <div className="h-3 sm:h-4 bg-surface-container-highest flex p-0.5 -skew-x-12">
                <div className="h-full bg-primary w-[85%] shadow-[0_0_15px_rgba(0,212,236,0.3)]" />
                <div className="h-full bg-white/10 w-[15%] ml-0.5" />
              </div>
            </div>
          </div>

          {/* Right Stroke Control */}
          <div
            className="swim26-stroke-btn swim26-stroke-zone glass-panel border-t-4 border-secondary/30 flex flex-col items-center justify-center active:bg-secondary/20 transition-colors relative overflow-hidden"
            style={{ minWidth: '72px' }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <span style={{ fontSize: '36px', lineHeight: 1, display: 'inline-block' }} className="text-secondary">☝</span>
            </div>
            <p className="font-label text-[9px] sm:text-[10px] tracking-[0.3em] text-secondary mb-2">R STROKE</p>
            <div className="w-8 sm:w-12 h-1 bg-secondary/20 overflow-hidden">
              <div className="h-full bg-secondary w-3/4" />
            </div>
          </div>
        </footer>
      </div>

      {/* ── Performance Ticker ───────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest/80 h-6 border-t border-outline-variant/15 overflow-hidden flex items-center z-40">
        <div className="flex whitespace-nowrap gap-8 sm:gap-12 px-4 animate-ticker">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-secondary rounded-full flex-shrink-0" />
            <span className="font-label text-[9px] sm:text-[10px] tracking-tighter text-on-surface-variant uppercase">LANE 4: MCKENZIE (USA) — 0.2s LEAD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
            <span className="font-label text-[9px] sm:text-[10px] tracking-tighter text-on-surface-variant uppercase">SWIM26 CHAMPIONSHIP SERIES — SEMI FINAL 1</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-error rounded-full flex-shrink-0" />
            <span className="font-label text-[9px] sm:text-[10px] tracking-tighter text-on-surface-variant uppercase">LANE 1: DISQUALIFIED — EARLY START</span>
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-secondary rounded-full flex-shrink-0" />
            <span className="font-label text-[9px] sm:text-[10px] tracking-tighter text-on-surface-variant uppercase">LANE 4: MCKENZIE (USA) — 0.2s LEAD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
            <span className="font-label text-[9px] sm:text-[10px] tracking-tighter text-on-surface-variant uppercase">SWIM26 CHAMPIONSHIP SERIES — SEMI FINAL 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceGameplayHUD;
