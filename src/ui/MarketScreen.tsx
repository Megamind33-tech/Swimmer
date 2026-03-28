import React from 'react';
import { useGameStore } from '../gameplay/useGameStore';
import { Search, Lock, User } from 'lucide-react';

export const MarketScreen = () => {
  const { state, openOverlay, scoutProspect } = useGameStore();

  return (
    <div className="p-3 h-full overflow-y-auto no-scrollbar animate-slide pb-16 landscape:pb-3 pointer-events-auto">
      <div className="flex flex-wrap justify-between items-end mb-4 gap-3">
        <div>
          <span className="text-[10px] font-extrabold text-[#C8FF00] tracking-[0.2em] uppercase">GLOBAL NETWORK</span>
          <h1 className="font-bebas text-3xl landscape:text-4xl leading-none text-[#F3F7FC] drop-shadow-md mt-0.5">TRANSFER MARKET</h1>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] landscape:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
        {state.prospects.filter(p => !p.signed).map((p) => {
          const isScouted = p.scouted;
          
          return (
            <div key={p.id} className="bg-[#0a192f] border border-[#1E3A57] rounded-sm flex flex-col relative overflow-hidden group shadow-md hover:border-[#C8FF00]/60 transition-colors" style={{ borderTopWidth: '3px', borderTopColor: '#C8FF00' }}>
              <div className="relative w-full aspect-[3/4] landscape:aspect-square overflow-hidden bg-[#020b14]">
                {!isScouted || !p.img ? (
                   <div className="w-full h-full flex items-center justify-center bg-[#112240] relative">
                     <div className="absolute inset-0 lane-stripes opacity-20 pointer-events-none" />
                     <User size={48} className="text-[#1E3A57] opacity-50" />
                   </div>
                ) : (
                   <img src={p.img} className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                )}
                
                <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-[#0a192f] via-[#0a192f]/80 to-transparent z-10 pointer-events-none" />
                
                <div className="absolute top-1.5 left-1.5 z-20 pointer-events-none">
                  <span className="text-[8px] uppercase font-bold text-[#C8FF00] tracking-widest bg-[#020b14]/80 px-1 py-0.5 rounded-sm backdrop-blur-sm border border-[#C8FF00]/30 flex items-center gap-0.5">
                    {!isScouted ? <Lock size={8}/> : <Search size={8}/>} {!isScouted ? 'SECURE' : 'SCOUTED'}
                  </span>
                </div>
                
                <div className="absolute bottom-1.5 left-1.5 right-1.5 z-20 flex flex-col pointer-events-none">
                  <span className="font-rajdhani text-[8px] font-bold text-[#9EB2C7] uppercase">{p.region} • {p.spec}</span>
                  <span className="font-barlow text-[12px] font-extrabold text-[#F3F7FC] tracking-wide leading-none uppercase truncate">{p.name || "UNKNOWN"}</span>
                  <div className="mt-1.5 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase font-bold text-[#71859C]">OVR</span>
                      <span className="font-rajdhani text-sm leading-none font-bold text-[#F3F7FC]">{p.estOvr}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[8px] uppercase font-bold text-[#71859C]">FEE</span>
                      <span className="font-rajdhani text-sm leading-none font-bold text-[#C8FF00]">{p.cost}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-1.5 bg-[#0a192f] z-20 mt-auto flex">
                <button
                  onClick={() => isScouted ? openOverlay('prospect-negotiate', undefined, p.id) : scoutProspect(p.id)}
                  className="w-full h-[30px] bg-[#112240] text-[#F3F7FC] border border-[#1E3A57] rounded-sm text-[10px] font-bold uppercase tracking-widest hover:border-[#C8FF00]/50 hover:text-[#C8FF00] btn-mech flex items-center justify-center transition-colors"
                >
                  {!isScouted ? 'SCOUT — $75K' : 'NEGOTIATE'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketScreen;
