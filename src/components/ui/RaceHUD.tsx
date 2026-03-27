import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { Waves, Activity, Zap } from 'lucide-react';

export const RaceHUD = ({ onBack }: { onBack: () => void }) => {
  const { state, dispatch, stroke, breathe, surge } = useGameStore();
  const race = state.race;
  const tickRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Start race on mount
  useEffect(() => {
    dispatch({ type: 'RACE_START' });
  }, [dispatch]);

  // Race tick loop
  useEffect(() => {
    if (!race.active || race.finished) return;
    lastTimeRef.current = performance.now();
    
    const tick = () => {
      const now = performance.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      dispatch({ type: 'RACE_TICK', dt });
      tickRef.current = requestAnimationFrame(tick);
    };
    tickRef.current = requestAnimationFrame(tick);
    return () => { if (tickRef.current) cancelAnimationFrame(tickRef.current); };
  }, [race.active, race.finished, dispatch]);

  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = t % 60;
    return `${String(mins).padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`;
  };

  // Build live leaderboard
  const allSwimmers = [
    { name: 'YOU', nat: 'PLY', distance: race.distance, isPlayer: true },
    ...race.opponents.map(o => ({ name: o.name, nat: o.nat, distance: o.distance, isPlayer: false })),
  ].sort((a, b) => b.distance - a.distance);

  const playerRank = allSwimmers.findIndex(s => s.isPlayer) + 1;
  const leader = allSwimmers[0];

  return (
    <div className="fixed inset-0 z-[200] bg-transparent animate-slide overflow-hidden pointer-events-none">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#020b14]/60 via-transparent to-[#020b14]/80" />
      </div>

      {/* TOP BROADCAST STRIP */}
      <div className="absolute top-2 landscape:top-3 left-0 right-0 px-3 flex items-start justify-between z-30 pointer-events-none">
        
        {/* Network & Event Chyron */}
        <div className="flex items-stretch h-7 shadow-[0_8px_20px_rgba(0,0,0,0.6)] pointer-events-auto">
          <div className="bg-[#FF5A5F] px-2 flex items-center justify-center skew-x-[-12deg] ml-1 border border-[#FF5A5F]">
             <div className="w-1.5 h-1.5 bg-[#F3F7FC] rounded-full animate-pulse mr-1 skew-x-[12deg]"></div>
             <span className="font-bebas text-sm text-[#F3F7FC] skew-x-[12deg] tracking-widest leading-none mt-0.5">LIVE</span>
          </div>
          <div className="bg-[#F3F7FC] px-2 flex items-center justify-center skew-x-[-12deg] -ml-1.5 z-10">
             <span className="font-bebas text-sm text-[#0a192f] skew-x-[12deg] tracking-widest leading-none mt-0.5">TITAN<span className="text-[#18C8F0]">NET</span></span>
          </div>
          <div className="bg-[#020b14]/90 backdrop-blur-md px-3 flex items-center border-y border-r border-[#1E3A57] skew-x-[-12deg] -ml-1.5 z-0 relative overflow-hidden">
             <div className="absolute inset-0 lane-stripes opacity-30 skew-x-[12deg]"></div>
             <span className="relative font-barlow text-[9px] font-extrabold text-[#F3F7FC] tracking-[0.15em] uppercase skew-x-[12deg]">100M FREE • WORLD FINAL</span>
          </div>
        </div>

        {/* Live Clock & Abort */}
        <div className="flex items-stretch h-7 shadow-[0_8px_20px_rgba(0,0,0,0.6)] pointer-events-auto">
          <button onClick={onBack} className="bg-[#112240]/80 hover:bg-[#1E3A57] backdrop-blur-md px-2 flex items-center justify-center skew-x-[-12deg] border border-[#1E3A57] z-20 transition-colors btn-mech mr-[-6px]">
            <span className="font-barlow text-[8px] font-extrabold text-[#9EB2C7] tracking-widest uppercase skew-x-[12deg]">ABORT</span>
          </button>
          <div className="bg-[#020b14]/95 backdrop-blur-md px-3 flex items-center border border-[#1E3A57] skew-x-[-12deg] z-0">
             <span className="font-rajdhani text-xl font-bold text-[#F3F7FC] tracking-wider leading-none w-[70px] text-right skew-x-[12deg]">{formatTime(race.timer)}</span>
          </div>
        </div>
      </div>

      {/* LEFT: Live Timing Board */}
      <div className="absolute left-2 top-[44px] landscape:top-[48px] w-[130px] landscape:w-[150px] flex flex-col z-30 pointer-events-none">
        <div className="bg-[#020b14]/90 backdrop-blur-md border border-[#1E3A57] shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
          <div className="bg-[#112240] px-2 py-1 border-b border-[#1E3A57] flex items-center justify-between">
            <span className="font-barlow text-[8px] font-extrabold text-[#18C8F0] tracking-[0.15em] uppercase">LIVE POSITIONS</span>
            <Activity size={8} className="text-[#18C8F0]" />
          </div>
          <div className="flex flex-col">
            {allSwimmers.slice(0, 6).map((s, i) => (
              <div key={i} className={`flex items-center px-1.5 py-1.5 border-b border-[#1E3A57]/50 ${s.isPlayer ? 'bg-[#18C8F0]/15 border-l-2 border-l-[#18C8F0]' : 'border-l-2 border-l-transparent'}`}>
                <span className={`font-rajdhani text-[11px] font-bold w-3 text-center ${i === 0 ? 'text-[#FFB800]' : 'text-[#71859C]'}`}>{i + 1}</span>
                <span className={`font-barlow text-[10px] font-extrabold uppercase ml-1.5 flex-1 truncate ${s.isPlayer ? 'text-[#F3F7FC]' : 'text-[#9EB2C7]'}`}>{s.name}</span>
                <span className="font-rajdhani text-[10px] font-bold text-[#C8FF00] ml-1">{s.distance.toFixed(1)}m</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CENTER: Distance + Stamina HUD */}
      <div className="absolute left-1/2 top-[25%] landscape:top-[20%] -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center">
         <div className="flex items-center gap-3 bg-[#020b14]/60 backdrop-blur-md px-4 py-1.5 border-y border-[#1E3A57]/50">
            <span className="font-bebas text-3xl landscape:text-4xl text-[#F3F7FC] tracking-widest">{race.distance.toFixed(1)}<span className="text-lg text-[#71859C]">m</span></span>
            <div className="w-[1px] h-6 bg-[#1E3A57]" />
            <div className="flex flex-col w-[90px] landscape:w-[110px]">
               <div className="flex justify-between text-[8px] font-bold uppercase tracking-[0.15em] mb-0.5">
                 <span className={race.stamina < 30 ? "text-[#FF5A5F]" : "text-[#18C8F0]"}>O2 LEVEL</span>
                 <span className="text-[#F3F7FC]">{Math.round(race.stamina)}%</span>
               </div>
               <div className="h-1.5 w-full bg-[#112240] overflow-hidden">
                 <div className={`h-full transition-all duration-200 ${race.stamina < 30 ? 'bg-[#FF5A5F]' : race.surgeActive ? 'bg-[#C8FF00]' : 'bg-[#18C8F0]'}`} style={{ width: `${race.stamina}%` }} />
               </div>
            </div>
         </div>
         {race.surgeActive && (
           <div className="mt-1 px-3 py-0.5 bg-[#C8FF00]/20 border border-[#C8FF00]/40 animate-pulse">
             <span className="font-barlow text-[10px] font-extrabold text-[#C8FF00] tracking-[0.2em] uppercase">⚡ SURGE ACTIVE</span>
           </div>
         )}
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="absolute bottom-3 landscape:bottom-2 left-3 right-3 flex justify-between items-end z-40 pointer-events-none">
        
        {/* Rank indicator */}
        <div className="pointer-events-none flex flex-col items-center">
          <div className="bg-[#020b14]/80 backdrop-blur-md border border-[#1E3A57] px-3 py-2 flex flex-col items-center">
            <span className="text-[8px] uppercase font-bold text-[#71859C] tracking-widest">POSITION</span>
            <span className={`font-bebas text-4xl leading-none ${playerRank === 1 ? 'text-[#FFB800]' : 'text-[#F3F7FC]'}`}>{playerRank}</span>
            <span className="text-[8px] uppercase font-bold text-[#71859C] tracking-widest">OF {allSwimmers.length}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2 landscape:gap-4 pointer-events-auto">
          
          {/* BREATHE */}
          <button onClick={breathe} className="flex flex-col items-center group btn-mech mb-4 landscape:mb-8">
            <div className="w-[44px] h-[44px] landscape:w-[52px] landscape:h-[52px] rounded-full bg-[#112240]/90 border-2 border-[#1E3A57] flex items-center justify-center shadow-lg group-active:border-[#18C8F0] group-active:scale-95 transition-all">
              <Activity size={20} className="text-[#18C8F0]" />
            </div>
            <span className="mt-1 font-barlow text-[8px] font-extrabold text-[#18C8F0] tracking-widest uppercase bg-[#020b14]/70 px-1.5 py-0.5 rounded-sm border border-[#1E3A57]">BREATHE</span>
          </button>

          {/* STROKE CYCLE — Main Action */}
          <button onClick={stroke} className="flex flex-col items-center group active:scale-[0.97] transition-transform">
            <div className="relative w-[90px] h-[90px] landscape:w-[110px] landscape:h-[110px] rounded-full border-[3px] border-[#112240] bg-[#020b14]/80 backdrop-blur-md flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
               <div className="absolute inset-2 rounded-full border-[6px] border-[#1E3A57] pointer-events-none" />
               <svg className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] transform pointer-events-none" style={{ transform: `rotate(${race.strokeCount * 30}deg)` }}>
                  <circle cx="50%" cy="50%" r="44%" stroke="#F3F7FC" strokeWidth="6" fill="none" strokeDasharray="80 300" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
               </svg>
               <div className="w-[40px] h-[40px] landscape:w-[48px] landscape:h-[48px] rounded-full bg-gradient-to-t from-[#112240] to-[#1E3A57] border border-[#9EB2C7]/30 flex items-center justify-center shadow-inner group-active:bg-[#1E3A57]">
                 <Waves size={20} className="text-[#F3F7FC]" />
               </div>
            </div>
            <div className="mt-1.5 flex flex-col items-center">
              <span className="font-barlow text-[11px] landscape:text-[13px] font-extrabold text-[#F3F7FC] tracking-[0.15em] uppercase">STROKE</span>
              <span className="font-rajdhani text-[8px] font-bold text-[#C8FF00] tracking-widest uppercase">×{race.strokeCount}</span>
            </div>
          </button>

          {/* SURGE */}
          <button onClick={surge} disabled={race.surgeActive || race.surgeCooldown > 0 || race.stamina < 25}
            className="flex flex-col items-center group btn-mech mb-4 landscape:mb-8 disabled:opacity-30">
            <div className={`w-[44px] h-[44px] landscape:w-[52px] landscape:h-[52px] rounded-full bg-[#112240]/90 border-2 flex items-center justify-center shadow-lg transition-all ${
              race.surgeActive ? 'border-[#C8FF00] shadow-[0_0_15px_rgba(200,255,0,0.4)]' : 'border-[#1E3A57] group-active:border-[#C8FF00]'
            } group-active:scale-95`}>
              <Zap size={20} className="text-[#C8FF00] fill-current opacity-80" />
            </div>
            <span className="mt-1 font-barlow text-[8px] font-extrabold text-[#C8FF00] tracking-widest uppercase bg-[#020b14]/70 px-1.5 py-0.5 rounded-sm border border-[#C8FF00]/30">SURGE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaceHUD;
