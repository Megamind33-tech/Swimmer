import React, { useState } from 'react';
import { Timer, Sparkles, Loader2, Zap, ChevronRight, TrendingUp } from 'lucide-react';

export const RaceCard = ({ onRace, arenaBg }: { onRace: () => void, arenaBg: string | null }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);

  const generateBriefing = async () => {
    setIsAiLoading(true);
    setTimeout(() => {
      const tips = [
        "Focus on breakout speed off the wall and maintain a 58 SPM stroke rate.",
        "Opponent weakness: CHALMERS tires after 75m. Save your surge for the final 25.",
        "Water temperature is 26.2°C — optimal. Expect slightly faster split times.",
        "Coach analysis: your technique efficiency dropped 3% last meet. Focus on catch phase.",
      ];
      setAiBriefing(tips[Math.floor(Math.random() * tips.length)]);
      setIsAiLoading(false);
    }, 800);
  };

  return (
    <div className="relative bg-[#0a192f] border border-[#1E3A57] rounded-sm min-h-[160px] landscape:min-h-[140px] p-3 grid grid-rows-[auto_1fr_auto] overflow-hidden group shadow-lg">
      <div className="absolute inset-0 z-0">
        {arenaBg ? (
          <img src={arenaBg} className="w-full h-full object-cover opacity-20 mix-blend-screen" alt="Arena bg"/>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0a192f] to-[#020b14]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/70 to-transparent" />
        <div className="absolute inset-0 lane-stripes pointer-events-none" />
      </div>

      <div className="absolute right-[-10px] bottom-[10px] font-bebas text-[100px] landscape:text-[80px] text-[#18C8F0] opacity-5 pointer-events-none z-0 leading-none">100M</div>

      <div className="relative z-10 flex flex-wrap justify-between items-start mb-2 gap-2">
        <div>
          <span className="flex items-center gap-1 text-[10px] font-extrabold text-[#18C8F0] tracking-[0.2em] uppercase">
            <Timer size={10}/> NEXT EVENT
          </span>
          <h2 className="font-bebas text-2xl landscape:text-3xl leading-none text-[#F3F7FC] mt-0.5 tracking-wide drop-shadow-md">100M FREE — ELITE OPEN</h2>
        </div>
        <button onClick={generateBriefing} disabled={isAiLoading}
          className="bg-[#112240] border border-[#18C8F0]/30 px-2 py-1.5 flex items-center gap-1.5 btn-mech rounded-sm text-[#18C8F0] hover:bg-[#18C8F0]/10 shrink-0">
          {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          <span className="font-barlow text-[10px] font-extrabold tracking-widest uppercase">COACH INTEL</span>
        </button>
      </div>

      <div className="relative z-10 flex flex-col">
        {aiBriefing && (
          <div className="mb-2 bg-[#020b14]/80 border-l-2 border-[#18C8F0] p-2 animate-slide backdrop-blur-sm rounded-r-sm">
            <p className="font-rajdhani text-[11px] font-bold text-[#F3F7FC] italic tracking-wide">{aiBriefing}</p>
          </div>
        )}
        <div className="flex flex-wrap gap-4 mb-auto pb-2 border-b border-[#1E3A57]/40">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-[#9EB2C7] uppercase tracking-wider">Personal Best</span>
            <span className="font-rajdhani text-xl font-bold text-[#F3F7FC]">00:47.88</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-[#9EB2C7] uppercase tracking-wider">Meet Record</span>
            <span className="font-rajdhani text-xl font-bold text-[#FFB800]">00:46.91</span>
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-2 flex items-end">
        <button onClick={onRace}
          className="bg-[#F3F7FC] text-[#0a192f] btn-primary-clip h-[44px] w-full sm:w-auto px-6 flex items-center justify-center gap-2 uppercase font-extrabold text-[14px] font-barlow tracking-[0.1em] btn-mech shadow-[0_4px_15px_rgba(243,247,252,0.2)]">
          <Zap size={16} fill="currentColor"/> ENTER HEAT
        </button>
      </div>
    </div>
  );
};

export const ClubCard = ({ title, value, label, secondaryText, accent, actionLabel, icon: Icon, bgImage, onClick }: any) => (
  <div onClick={onClick} className="relative bg-[#020b14] border border-[#1E3A57] rounded-sm flex flex-col overflow-hidden group shadow-lg min-h-[160px] landscape:min-h-[140px] cursor-pointer transition-all duration-300 hover:border-white/30 btn-mech">
    <div className="absolute inset-0 z-0">
      {bgImage ? (
        <img src={bgImage} className="w-full h-full object-cover opacity-40 mix-blend-screen group-hover:scale-105 group-hover:opacity-60 transition-all duration-700 ease-out" alt={title}/>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#0a192f] to-[#020b14]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020b14] via-[#020b14]/70 to-transparent" />
      <div className="absolute inset-0 lane-stripes opacity-20 pointer-events-none" />
    </div>

    <div className="absolute top-0 left-0 w-full h-[3px] z-10" style={{ backgroundColor: accent }} />

    <div className="relative z-10 p-3 flex flex-col h-full">
      <div className="flex justify-between items-start mb-auto">
        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#020b14]/70 backdrop-blur-md border border-[#1E3A57]/60 rounded-sm">
          {Icon && <Icon size={10} style={{ color: accent }} />}
          <span className="font-barlow text-[9px] font-extrabold text-[#F3F7FC] uppercase tracking-widest leading-none">{title}</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
      </div>

      <div className="mt-4 relative">
        <h3 className="font-bebas text-4xl landscape:text-5xl leading-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] group-hover:translate-x-1 transition-transform duration-300" style={{ color: accent }}>
          {value}
        </h3>
        <p className="font-barlow text-sm font-extrabold text-[#F3F7FC] uppercase tracking-wide leading-tight drop-shadow-md mt-0.5">{label}</p>
        {secondaryText && (
          <p className="font-rajdhani text-[10px] font-bold text-[#9EB2C7] uppercase mt-0.5 flex items-center gap-1">
             <TrendingUp size={9} style={{ color: accent }} /> {secondaryText}
          </p>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-[#1E3A57]/50 flex items-center justify-between group-hover:border-[#1E3A57] transition-colors">
        <span className="font-rajdhani text-[11px] font-bold text-[#F3F7FC] uppercase tracking-widest">{actionLabel}</span>
        <div className="w-5 h-5 rounded-full bg-[#112240] flex items-center justify-center group-hover:bg-[#F3F7FC] transition-colors">
          <ChevronRight size={12} className="text-[#18C8F0] group-hover:text-[#020b14] transition-colors" />
        </div>
      </div>
    </div>
  </div>
);
