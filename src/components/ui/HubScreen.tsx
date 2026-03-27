import React from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { RaceCard, ClubCard } from './Cards';
import { Medal, Activity, TrendingUp } from 'lucide-react';

export const HubScreen = ({ onRace, assets, setActiveTab }: { onRace: () => void, assets: any, setActiveTab: (t: string) => void }) => {
  const { state, authorizeFunding } = useGameStore();

  return (
    <div className="p-3 grid grid-cols-1 landscape:grid-cols-[1.2fr_1fr] gap-3 h-full overflow-y-auto no-scrollbar animate-slide pb-16 landscape:pb-3 pointer-events-auto">
      <div className="flex flex-col gap-3">
        <RaceCard onRace={onRace} arenaBg={assets?.arenaBg} />
        
        <div className="grid grid-cols-2 gap-3">
           <ClubCard 
             title="Team Status" value={String(state.squad.length)} 
             label={`Roster: ${state.squad.length} Athletes`}
             secondaryText="View Squad →"
             accent="#FFB800" actionLabel="Manage Squad" icon={Medal}
             bgImage="https://images.unsplash.com/photo-1563299796-17596c35a7fc?auto=format&fit=crop&w=600&q=80"
             onClick={() => setActiveTab('squad')}
           />
           <ClubCard 
             title="Readiness" 
             value={`${state.squad.filter(a => a.stamina >= 80).length}/${state.squad.length}`}
             label="Swimmers Optimized"
             secondaryText={`${state.squad.filter(a => a.stamina < 50).length} Require Rehab`}
             accent="#18C8F0" actionLabel="Medical Staff" icon={Activity}
             bgImage="https://images.unsplash.com/photo-1517344884509-a0c97ea11cb7?auto=format&fit=crop&w=600&q=80"
             onClick={() => setActiveTab('squad')}
           />
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
         <div className="bg-[#0a192f] border border-[#1E3A57] rounded-sm p-2.5 relative grid grid-rows-[auto_1fr_auto] h-full min-h-[140px] shadow-lg overflow-hidden group">
            <div className="absolute inset-0 z-0 overflow-hidden">
              {assets?.arenaBg ? (
                <img src={assets?.arenaBg} className="w-full h-full object-cover opacity-20 filter sepia-[0.2] hue-rotate-[180deg] scale-105 group-hover:scale-110 transition-transform duration-1000" alt="Facility"/>
              ) : <div className="w-full h-full bg-[#112240]" />}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020b14] via-[#020b14]/80 to-transparent" />
            </div>

            <div className="relative z-10">
              <span className="text-[9px] font-extrabold text-[#18C8F0] uppercase tracking-[0.2em] mb-0.5 block">CLUB FACILITIES</span>
              <h2 className="font-bebas text-2xl landscape:text-3xl text-[#F3F7FC] leading-none drop-shadow-md">AQUATIC CENTER <span className="text-[#9EB2C7]">LV.{state.facilityLevel}</span></h2>
            </div>

            <div className="relative z-10 flex flex-col justify-center">
              <div className="mt-2 bg-[#020b14]/80 border border-[#1E3A57] p-1.5 rounded-sm backdrop-blur-md">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-[#F3F7FC] mb-0.5">
                  <span>UPGRADE</span>
                  <span className="text-[#18C8F0]">{state.facilityProgress}%</span>
                </div>
                <div className="h-1 bg-[#112240] w-full rounded-full overflow-hidden">
                  <div className="h-full bg-[#18C8F0] rounded-full shadow-[0_0_8px_rgba(24,200,240,0.5)] transition-all duration-500" style={{ width: `${state.facilityProgress}%` }} />
                </div>
              </div>
            </div>

            <div className="relative z-20 mt-2 flex justify-between items-end gap-2">
              <p className="font-barlow text-[11px] text-[#F3F7FC] font-bold flex items-center gap-1"><TrendingUp size={12} className="text-[#18C8F0]"/> +2.4% RECOVERY</p>
              <button onClick={authorizeFunding} className="bg-[#18C8F0] text-[#020b14] btn-primary-clip h-[36px] px-4 text-[11px] font-bold uppercase tracking-widest btn-mech shadow-[0_4px_15px_rgba(24,200,240,0.2)]">
                FUND — $200K
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default HubScreen;
