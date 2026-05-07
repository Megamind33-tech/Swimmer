import React from 'react';
import { useGameStore } from '../gameplay/useGameStore';
import { Waves, Calendar, Trophy, User } from 'lucide-react';

export const TopHUD = ({ avatarImg }: { avatarImg: string | null }) => {
  const { state, formatBudget, openOverlay } = useGameStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-[48px] landscape:h-[44px] bg-[#0a192f]/95 border-b border-[#1E3A57] backdrop-blur-md flex items-center px-3 gap-3 z-100">
      <div className="flex items-center gap-2 pr-3 border-r border-[#1E3A57]/50 h-full py-2 shrink-0">
        <Waves size={20} className="text-[#18C8F0]" />
        <span className="font-bebas text-xl tracking-wider text-[#F3F7FC]">SWIM<span className="text-[#18C8F0]">26</span></span>
      </div>

      <div className="hidden sm:flex gap-4">
        <div className="flex flex-col justify-center">
          <span className="text-[9px] uppercase font-bold text-[#9EB2C7] tracking-widest leading-none">Season</span>
          <div className="flex items-center gap-1 mt-0.5">
            <Calendar size={10} className="text-[#F3F7FC]" />
            <span className="font-rajdhani text-xs font-bold text-[#F3F7FC]">WEEK {state.seasonWeek}</span>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-[9px] uppercase font-bold text-[#9EB2C7] tracking-widest leading-none">Budget</span>
          <span className="font-rajdhani text-xs font-bold text-[#18C8F0] mt-0.5">{formatBudget(state.budget)}</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-[#112240] px-2 py-1 border border-[#1E3A57]/50 rounded-sm">
          <Trophy size={12} className="text-[#FFB800]" />
          <span className="font-rajdhani font-bold text-[#F3F7FC] text-xs">{state.points.toLocaleString()} PTS</span>
        </div>
        
        <button onClick={() => openOverlay('profile')} aria-label="Player Profile" title="Player Profile" className="w-[36px] h-[36px] border-2 border-[#18C8F0] p-0.5 cursor-pointer rounded-full overflow-hidden btn-mech shrink-0">
          {avatarImg ? (
            <img src={avatarImg} alt="Player" className="w-full h-full object-cover rounded-full" />
          ) : (
            <div className="w-full h-full bg-[#112240] flex items-center justify-center rounded-full"><User size={16} className="text-[#18C8F0]" aria-hidden="true" /></div>
          )}
        </button>
      </div>
    </header>
  );
};

export default TopHUD;
