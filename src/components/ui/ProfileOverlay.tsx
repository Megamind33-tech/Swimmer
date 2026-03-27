import React from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { X, User, Trophy, Calendar, Waves } from 'lucide-react';

export const ProfileOverlay = () => {
  const { state, closeOverlay, formatBudget } = useGameStore();

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 pointer-events-auto" onClick={closeOverlay}>
      <div className="absolute inset-0 bg-[#020b14]/85 backdrop-blur-sm" />
      <div className="relative bg-[#0a192f] border border-[#1E3A57] w-full max-w-[380px] animate-slide shadow-[0_20px_60px_rgba(0,0,0,0.8)]" onClick={(e) => e.stopPropagation()}>
        
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#18C8F0] z-10" />
        
        <button onClick={closeOverlay} className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center bg-[#112240] border border-[#1E3A57] rounded-sm btn-mech">
          <X size={16} className="text-[#9EB2C7]" />
        </button>

        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-[80px] h-[80px] border-3 border-[#18C8F0] p-1 rounded-full mb-4">
            <div className="w-full h-full bg-[#112240] rounded-full flex items-center justify-center">
              <User size={32} className="text-[#18C8F0]" />
            </div>
          </div>
          <h2 className="font-bebas text-3xl text-[#F3F7FC] tracking-widest">PLAYER ONE</h2>
          <p className="font-rajdhani text-xs font-bold text-[#9EB2C7] uppercase tracking-widest">HEAD COACH</p>
        </div>

        <div className="px-4 pb-4 grid grid-cols-2 gap-3">
          <div className="bg-[#020b14] border border-[#1E3A57] p-3 rounded-sm flex flex-col items-center">
            <Trophy size={16} className="text-[#FFB800] mb-1" />
            <span className="text-[9px] uppercase font-bold text-[#71859C] tracking-widest">POINTS</span>
            <span className="font-rajdhani text-xl font-bold text-[#F3F7FC]">{state.points.toLocaleString()}</span>
          </div>
          <div className="bg-[#020b14] border border-[#1E3A57] p-3 rounded-sm flex flex-col items-center">
            <Waves size={16} className="text-[#18C8F0] mb-1" />
            <span className="text-[9px] uppercase font-bold text-[#71859C] tracking-widest">BUDGET</span>
            <span className="font-rajdhani text-xl font-bold text-[#18C8F0]">{formatBudget(state.budget)}</span>
          </div>
          <div className="bg-[#020b14] border border-[#1E3A57] p-3 rounded-sm flex flex-col items-center">
            <Calendar size={16} className="text-[#C8FF00] mb-1" />
            <span className="text-[9px] uppercase font-bold text-[#71859C] tracking-widest">SEASON</span>
            <span className="font-rajdhani text-xl font-bold text-[#F3F7FC]">WK {state.seasonWeek}</span>
          </div>
          <div className="bg-[#020b14] border border-[#1E3A57] p-3 rounded-sm flex flex-col items-center">
            <User size={16} className="text-[#9EB2C7] mb-1" />
            <span className="text-[9px] uppercase font-bold text-[#71859C] tracking-widest">SQUAD</span>
            <span className="font-rajdhani text-xl font-bold text-[#F3F7FC]">{state.squad.length}</span>
          </div>
        </div>

        <div className="px-4 pb-4">
          <button onClick={closeOverlay} className="w-full h-[44px] bg-[#112240] text-[#F3F7FC] border border-[#1E3A57] rounded-sm font-barlow text-[12px] font-extrabold uppercase tracking-widest btn-mech hover:bg-[#1E3A57] transition-colors">
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
