import React from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { Eye, Battery } from 'lucide-react';

export const SquadScreen = () => {
  const { state, openOverlay, recoverAthlete } = useGameStore();

  return (
    <div className="p-3 h-full overflow-y-auto no-scrollbar animate-slide pb-16 landscape:pb-3 pointer-events-auto">
      <div className="flex flex-wrap justify-between items-end mb-4 gap-3">
        <div>
          <span className="text-[10px] font-extrabold text-[#18C8F0] tracking-[0.2em] uppercase">TEAM ROSTER</span>
          <h1 className="font-bebas text-3xl landscape:text-4xl leading-none text-[#F3F7FC] drop-shadow-md mt-0.5">ACTIVE SQUAD</h1>
        </div>
        <div className="flex items-center gap-3 bg-[#0a192f]/80 border border-[#1E3A57] px-3 py-1.5 rounded-sm">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-[#9EB2C7] tracking-widest">CAPACITY</span>
            <span className="font-rajdhani text-sm font-bold text-[#F3F7FC]">{state.squad.length}/15</span>
          </div>
          <div className="w-[1px] h-6 bg-[#1E3A57]"></div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-[#9EB2C7] tracking-widest">AVG OVR</span>
            <span className="font-rajdhani text-sm font-bold text-[#FFB800]">{Math.round(state.squad.reduce((s,a) => s+a.ovr, 0) / state.squad.length)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] landscape:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
        {state.squad.map((athlete) => {
          const isElite = athlete.ovr >= 90;
          const accentColor = isElite ? '#FFB800' : '#18C8F0';
          
          return (
            <div key={athlete.id} className="bg-[#0a192f] border border-[#1E3A57] rounded-sm flex flex-col relative overflow-hidden group shadow-md hover:border-[#1E3A57]/80" style={{ borderTopWidth: '3px', borderTopColor: accentColor }}>
              <div className="relative w-full aspect-[3/4] landscape:aspect-square overflow-hidden bg-[#020b14]">
                <img src={athlete.img} className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-500" alt={athlete.name} />
                <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-[#0a192f] via-[#0a192f]/80 to-transparent z-10 pointer-events-none" />
                
                <div className="absolute top-1.5 left-1.5 z-20 flex flex-col items-start pointer-events-none">
                  <span className="font-bebas text-3xl landscape:text-2xl leading-none" style={{ color: accentColor }}>{athlete.ovr}</span>
                  <span className="font-rajdhani text-[9px] font-bold text-[#F3F7FC] uppercase bg-[#020b14]/60 px-1 py-0.5 rounded-sm mt-0.5 backdrop-blur-sm border border-[#1E3A57]/50">{athlete.spec}</span>
                </div>

                <div className="absolute top-1.5 right-1.5 z-20 pointer-events-none">
                  {athlete.role === 'PROSPECT' ? (
                     <span className="text-[8px] uppercase font-bold text-[#C8FF00] tracking-widest bg-[#020b14]/80 px-1 py-0.5 rounded-sm backdrop-blur-sm border border-[#C8FF00]/30 flex items-center gap-0.5">
                       <Eye size={8} /> WATCH
                     </span>
                  ) : (
                     <span className="text-[8px] uppercase font-bold text-[#9EB2C7] tracking-widest bg-[#020b14]/80 px-1 py-0.5 rounded-sm backdrop-blur-sm border border-[#1E3A57]/50">
                       {athlete.role}
                     </span>
                  )}
                </div>
                
                <div className="absolute bottom-1.5 left-1.5 right-1.5 z-20 flex flex-col pointer-events-none">
                  <span className="font-rajdhani text-[8px] font-bold text-[#9EB2C7] uppercase">{athlete.country}</span>
                  <span className="font-barlow text-[12px] font-extrabold text-[#F3F7FC] tracking-wide leading-none uppercase truncate">{athlete.name}</span>
                  <div className="mt-1.5">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[8px] uppercase font-bold text-[#9EB2C7] flex items-center gap-0.5">
                        <Battery size={8} className={athlete.stamina < 50 ? "text-[#FF5A5F]" : "text-[#C8FF00]"} /> {athlete.stamina}%
                      </span>
                    </div>
                    <div className="h-1 w-full bg-[#112240] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${athlete.stamina < 50 ? 'bg-[#FF5A5F]' : 'bg-[#C8FF00]'}`} style={{ width: `${athlete.stamina}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-1.5 bg-[#0a192f] z-20 mt-auto flex gap-1.5">
                <button onClick={() => openOverlay('athlete-detail', athlete.id)} className="flex-1 h-[30px] bg-[#112240] text-[#F3F7FC] border border-[#1E3A57] rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-[#1E3A57] btn-mech flex items-center justify-center transition-colors">
                  DETAILS
                </button>
                {athlete.stamina < 80 && (
                  <button onClick={() => recoverAthlete(athlete.id)} className="flex-1 h-[30px] bg-[#18C8F0]/10 text-[#18C8F0] border border-[#18C8F0]/30 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-[#18C8F0]/20 btn-mech flex items-center justify-center transition-colors">
                    RECOVER
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SquadScreen;
