import React from 'react';

export const RaceGameplayHUD: React.FC = () => {
  return (
    <div className="bg-background text-on-surface font-body overflow-hidden h-screen w-screen selection:bg-secondary selection:text-on-secondary dark" style={{backgroundImage: 'none'}}>
      {/* 3D Game Environment Simulation (Background) */}
      <div className="fixed inset-0 z-0">
        <img
          alt="3D swimming pool underwater view with sunlight"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-biYLaIRlJjylXssBLD8jfx8_t-j-azL_8XTPHtTcSZwCghswashxyRHi2r5jdCeeFybwruSiAszyb-TAyYimQvgadNc4Aj6zHdUwkUbpB566prNXyj0N99XDLQyAvU0XlkRk0Zlo4kYzPBQ60zvWdJ9o2FAvkyJQAV5gwcCPGCJXb7SBWwIk7QmfR3L9PKiQ91nwATVUojbpGol_kh7kzgrvijnwO8aYQI8HCgflqXjezxeExrSwFKarrBdHlNcxF3cesWh5fUX0"
        />
        {/* Water Distortion/Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background/80"></div>
      </div>

      {/* HUD Overlay Layer */}
      <div className="relative z-10 h-full w-full flex flex-col justify-between p-6">
        {/* Top HUD: Progress & Race Info */}
        <header className="flex justify-between items-start gap-4">
          {/* Split Timer & Rank */}
          <div className="glass-panel p-4 flex flex-col gap-1 -skew-x-12 border-l-4 border-primary" style={{background: 'rgba(38, 38, 38, 0.6)', backdropFilter: 'blur(20px)'}}>
            <div className="flex items-center gap-2">
              <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className="text-secondary">⏱</span>
              <span className="font-headline italic text-2xl tracking-tighter">00:24.82</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">CURRENT SPLIT</span>
              <span className="font-headline italic text-secondary text-xl">2nd</span>
            </div>
          </div>

          {/* Race Progress Bar */}
          <div className="flex-1 max-w-xl glass-panel h-14 -skew-x-12 relative flex items-center px-6 overflow-hidden" style={{background: 'rgba(38, 38, 38, 0.6)', backdropFilter: 'blur(20px)'}}>
            <div className="absolute inset-0 bg-surface-container-low/40"></div>
            {/* Track */}
            <div className="w-full h-1.5 bg-surface-container-highest relative">
              {/* Swimmer Progress Marker */}
              <div className="absolute h-full bg-secondary shadow-[0_0_15px_rgba(195,244,0,0.5)]" style={{width: '48%'}}></div>
              {/* Competitor Markers */}
              <div className="absolute h-4 w-1 bg-primary -top-1.5" style={{left: '52%'}}></div>
              <div className="absolute h-4 w-1 bg-on-surface-variant -top-1.5 opacity-50" style={{left: '45%'}}></div>
            </div>
            <div className="absolute bottom-1 right-6 flex items-baseline gap-1">
              <span className="font-headline italic text-lg">24</span>
              <span className="font-label text-[10px] text-on-surface-variant">/ 50m</span>
            </div>
          </div>

          {/* User Status / Shared Component Logic (LVL 99) */}
          <div className="glass-panel px-6 py-2 skew-x-12 border-r-4 border-secondary" style={{background: 'rgba(38, 38, 38, 0.6)', backdropFilter: 'blur(20px)'}}>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-label text-[10px] tracking-[0.2em] text-on-surface-variant">STATUS</p>
                <p className="font-headline italic text-xl">LVL 99</p>
              </div>
              <div className="h-10 w-10 bg-primary-container flex items-center justify-center -skew-x-12">
                <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className="text-on-primary-container">👤</span>
              </div>
            </div>
          </div>
        </header>

        {/* Central Action: HUD Brackets (Focus HUD) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 pointer-events-none">
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary/50"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-secondary/50"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-secondary/50"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary/50"></div>
          {/* Velocity Vector Line */}
          <div className="absolute left-1/2 bottom-0 h-16 w-[1px] bg-gradient-to-t from-secondary to-transparent"></div>
        </div>

        {/* Bottom Controls & Meters */}
        <footer className="flex justify-between items-end gap-12 h-48">
          {/* Left: Stroke Control (Rhythm Area) */}
          <div className="h-full w-48 glass-panel border-t-4 border-primary/30 flex flex-col items-center justify-center group active:bg-primary/20 transition-colors" style={{background: 'rgba(38, 38, 38, 0.6)', backdropFilter: 'blur(20px)'}}>
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span style={{fontSize:'60px', lineHeight:1, display:'inline-block'}} className="text-primary">☝</span>
            </div>
            <p className="font-label text-[10px] tracking-[0.3em] text-primary mb-2">LEFT STROKE</p>
            <div className="w-12 h-1 bg-primary/20 overflow-hidden">
              <div className="h-full bg-primary w-1/2"></div>
            </div>
          </div>

          {/* Center: Power & Stamina Meters */}
          <div className="flex-1 flex flex-col items-center justify-end pb-4 gap-6">
            {/* Circular Stamina Meter */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* SVG Circle */}
              <svg className="w-full h-full -rotate-90">
                <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-secondary shadow-[0_0_10px_#c3f400]" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364" strokeDashoffset="100" strokeWidth="8"></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-headline italic text-3xl">72%</span>
                <span className="font-label text-[8px] tracking-widest text-on-surface-variant">STAMINA</span>
              </div>
            </div>

            {/* Stroke Power Gauge */}
            <div className="w-full max-w-md flex flex-col gap-2">
              <div className="flex justify-between items-end px-2">
                <span className="font-label text-[10px] tracking-widest text-primary">POWER OUTPUT</span>
                <span className="font-headline italic text-lg text-primary">MAX STRETCH</span>
              </div>
              <div className="h-4 bg-surface-container-highest flex p-0.5 -skew-x-12">
                <div className="h-full bg-primary w-[85%] shadow-[0_0_15px_rgba(0,212,236,0.3)]"></div>
                <div className="h-full bg-white/10 w-[15%] ml-0.5"></div>
              </div>
            </div>
          </div>

          {/* Right: Stroke Control (Rhythm Area) */}
          <div className="h-full w-48 glass-panel border-t-4 border-secondary/30 flex flex-col items-center justify-center group active:bg-secondary/20 transition-colors" style={{background: 'rgba(38, 38, 38, 0.6)', backdropFilter: 'blur(20px)'}}>
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span style={{fontSize:'60px', lineHeight:1, display:'inline-block'}} className="text-secondary">☝</span>
            </div>
            <p className="font-label text-[10px] tracking-[0.3em] text-secondary mb-2">RIGHT STROKE</p>
            <div className="w-12 h-1 bg-secondary/20 overflow-hidden">
              <div className="h-full bg-secondary w-3/4"></div>
            </div>
          </div>
        </footer>

        {/* Interaction Cues (Floating labels) */}
        <div className="absolute left-1/2 top-2/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
          <p className="font-headline italic text-secondary text-4xl uppercase tracking-tighter opacity-80 animate-pulse">Perfect Timing!</p>
          <p className="font-label text-[10px] tracking-[0.5em] text-white/50">+25% VELOCITY BURST</p>
        </div>
      </div>

      {/* Performance Ticker (Signature Component) */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest h-6 border-t border-outline-variant/15 overflow-hidden flex items-center z-50">
        <div className="flex whitespace-nowrap gap-12 px-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-secondary"></span>
            <span className="font-label text-[10px] tracking-tighter text-on-surface-variant uppercase">LANE 4: MCKENZIE (USA) - 0.2s LEAD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary"></span>
            <span className="font-label text-[10px] tracking-tighter text-on-surface-variant uppercase">SWIM26 CHAMPIONSHIP SERIES - SEMI FINAL 1</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-error"></span>
            <span className="font-label text-[10px] tracking-tighter text-on-surface-variant uppercase">LANE 1: DISQUALIFIED - EARLY START</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-secondary"></span>
            <span className="font-label text-[10px] tracking-tighter text-on-surface-variant uppercase">CURRENT WIND: 0.0m/s</span>
          </div>
        </div>
      </div>

      <style>{`
        .glass-panel {
          background: rgba(38, 38, 38, 0.6);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
};
