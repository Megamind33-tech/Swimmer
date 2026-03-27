import React from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { X, Lock, Search, Zap } from 'lucide-react';

export const ProspectNegotiateOverlay = () => {
  const { state, closeOverlay, signProspect, scoutProspect } = useGameStore();
  const prospect = state.prospects.find(p => p.id === state.selectedProspectId);
  if (!prospect) return null;

  const isScouted = prospect.scouted;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 pointer-events-auto" onClick={closeOverlay}>
      <div className="absolute inset-0 bg-[#020b14]/85 backdrop-blur-sm" />
      <div className="relative bg-[#0a192f] border border-[#1E3A57] w-full max-w-[420px] max-h-[90vh] overflow-y-auto no-scrollbar animate-slide shadow-[0_20px_60px_rgba(0,0,0,0.8)]" onClick={(e) => e.stopPropagation()}>
        
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C8FF00] z-10" />
        
        <button onClick={closeOverlay} className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center bg-[#112240] border border-[#1E3A57] rounded-sm btn-mech hover:bg-[#1E3A57] transition-colors">
          <X size={16} className="text-[#9EB2C7]" />
        </button>

        <div className="relative h-[180px] overflow-hidden">
          {isScouted && prospect.img ? (
            <img src={prospect.img} className="w-full h-full object-cover object-top" alt={prospect.name || 'Prospect'} />
          ) : (
            <div className="w-full h-full bg-[#112240] flex items-center justify-center lane-stripes">
              <Lock size={48} className="text-[#1E3A57]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/40 to-transparent" />
          <div className="absolute bottom-4 left-4 z-10">
            <h2 className="font-barlow text-xl font-extrabold text-[#F3F7FC] uppercase tracking-wide">{prospect.name || "CLASSIFIED ATHLETE"}</h2>
            <p className="font-rajdhani text-xs font-bold text-[#9EB2C7] uppercase tracking-widest">{prospect.region} • {prospect.spec}</p>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#020b14] border border-[#1E3A57] p-3 rounded-sm">
              <span className="text-[9px] uppercase font-bold text-[#71859C] tracking-widest">EST OVERALL</span>
              <p className="font-rajdhani text-2xl font-bold text-[#F3F7FC]">{prospect.estOvr}</p>
            </div>
            <div className="bg-[#020b14] border border-[#1E3A57] p-3 rounded-sm">
              <span className="text-[9px] uppercase font-bold text-[#71859C] tracking-widest">TRANSFER FEE</span>
              <p className="font-rajdhani text-2xl font-bold text-[#C8FF00]">{prospect.cost}</p>
            </div>
          </div>

          <div className="bg-[#020b14] border border-[#1E3A57] p-3 rounded-sm">
            <span className="text-[9px] uppercase font-bold text-[#71859C] tracking-widest">STATUS</span>
            <p className="font-rajdhani text-lg font-bold text-[#F3F7FC] flex items-center gap-2 mt-1">
              {prospect.signed ? (
                <><Zap size={14} className="text-[#C8FF00]" /> SIGNED TO YOUR ROSTER</>
              ) : isScouted ? (
                <><Search size={14} className="text-[#18C8F0]" /> FULLY SCOUTED — READY TO NEGOTIATE</>
              ) : (
                <><Lock size={14} className="text-[#FF5A5F]" /> UNDISCLOSED — REQUIRES SCOUTING</>
              )}
            </p>
          </div>

          <div className="flex gap-3 mt-2">
            {!prospect.signed && (
              isScouted ? (
                <button onClick={() => signProspect(prospect.id)} className="flex-1 h-[48px] bg-[#C8FF00]/15 text-[#C8FF00] border border-[#C8FF00]/40 rounded-sm font-barlow text-[13px] font-extrabold uppercase tracking-widest btn-mech flex items-center justify-center gap-2 hover:bg-[#C8FF00]/25 transition-colors">
                  <Zap size={16} /> SIGN — {prospect.cost}
                </button>
              ) : (
                <button onClick={() => scoutProspect(prospect.id)} className="flex-1 h-[48px] bg-[#18C8F0]/15 text-[#18C8F0] border border-[#18C8F0]/40 rounded-sm font-barlow text-[13px] font-extrabold uppercase tracking-widest btn-mech flex items-center justify-center gap-2 hover:bg-[#18C8F0]/25 transition-colors">
                  <Search size={16} /> SCOUT — $75K
                </button>
              )
            )}
            <button onClick={closeOverlay} className="flex-1 h-[48px] bg-[#112240] text-[#F3F7FC] border border-[#1E3A57] rounded-sm font-barlow text-[13px] font-extrabold uppercase tracking-widest btn-mech flex items-center justify-center hover:bg-[#1E3A57] transition-colors">
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
