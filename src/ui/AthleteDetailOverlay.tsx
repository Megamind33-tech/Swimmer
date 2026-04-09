import React from 'react';
import { useGameStore } from '../gameplay/useGameStore';
import { X, Battery, TrendingUp, Zap } from 'lucide-react';

export const AthleteDetailOverlay = () => {
  const { state, closeOverlay, recoverAthlete } = useGameStore();
  const athlete = state.squad.find(a => a.id === state.selectedAthleteId);
  if (!athlete) return null;

  const accentColor = athlete.ovr >= 90 ? '#FFB800' : '#18C8F0';

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 pointer-events-auto" onClick={closeOverlay}>
      <div className="absolute inset-0 bg-[#020b14]/85 backdrop-blur-sm" />
      <div className="relative bg-[#0a192f] border border-[#1E3A57] w-full max-w-[480px] max-h-[90vh] overflow-y-auto no-scrollbar animate-slide shadow-[0_20px_60px_rgba(0,0,0,0.8)]" onClick={(e) => e.stopPropagation()}>
        
        <div className="absolute top-0 left-0 right-0 h-[3px] z-10" style={{ backgroundColor: accentColor }} />
        
        <button
          onClick={closeOverlay}
          className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center bg-[#112240] border border-[#1E3A57] rounded-sm btn-mech hover:bg-[#1E3A57] transition-colors focus-visible:ring-2 focus-visible:ring-[#D4A843] focus-visible:outline-none"
          aria-label="Close details"
          title="Close details"
        >
          <X size={16} className="text-[#9EB2C7]" />
        </button>

        <div className="relative h-[200px] overflow-hidden">
          <img src={athlete.img} className="w-full h-full object-cover object-top" alt={athlete.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/60 to-transparent" />
          <div className="absolute bottom-4 left-4 z-10">
            <span className="font-bebas text-5xl leading-none" style={{ color: accentColor }}>{athlete.ovr}</span>
            <h2 className="font-barlow text-2xl font-extrabold text-[#F3F7FC] uppercase tracking-wide">{athlete.name}</h2>
            <p className="font-rajdhani text-xs font-bold text-[#9EB2C7] uppercase tracking-widest">{athlete.country} • {athlete.spec}</p>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'SPEED', value: athlete.speed.toFixed(2), unit: 'm/s' },
              { label: 'TECHNIQUE', value: athlete.technique, unit: '' },
              { label: 'ENDURANCE', value: athlete.endurance, unit: '' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#020b14] border border-[#1E3A57] p-3 flex flex-col items-center rounded-sm">
                <span className="text-[9px] uppercase font-bold text-[#71859C] tracking-widest">{stat.label}</span>
                <span className="font-rajdhani text-2xl font-bold text-[#F3F7FC]">{stat.value}<span className="text-xs text-[#71859C]">{stat.unit}</span></span>
              </div>
            ))}
          </div>

          <div className="bg-[#020b14] border border-[#1E3A57] p-3 rounded-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase font-bold text-[#9EB2C7] tracking-widest flex items-center gap-1">
                <Battery size={12} className={athlete.stamina < 50 ? "text-[#FF5A5F]" : "text-[#C8FF00]"} /> STAMINA
              </span>
              <span className="font-rajdhani text-sm font-bold text-[#F3F7FC]">{athlete.stamina}%</span>
            </div>
            <div className="h-2 w-full bg-[#112240] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${athlete.stamina < 50 ? 'bg-[#FF5A5F]' : 'bg-[#C8FF00]'}`} style={{ width: `${athlete.stamina}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#020b14] border border-[#1E3A57] p-3 rounded-sm">
              <span className="text-[9px] uppercase font-bold text-[#71859C] tracking-widest">FORM</span>
              <p className={`font-rajdhani text-lg font-bold ${athlete.form === 'PEAK' ? 'text-[#C8FF00]' : athlete.form === 'GOOD' ? 'text-[#18C8F0]' : 'text-[#FF5A5F]'}`}>{athlete.form}</p>
            </div>
            <div className="bg-[#020b14] border border-[#1E3A57] p-3 rounded-sm">
              <span className="text-[9px] uppercase font-bold text-[#71859C] tracking-widest">ROLE</span>
              <p className="font-rajdhani text-lg font-bold text-[#F3F7FC]">{athlete.role}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            {athlete.stamina < 80 && (
              <button onClick={() => recoverAthlete(athlete.id)} className="flex-1 h-[48px] bg-[#18C8F0]/15 text-[#18C8F0] border border-[#18C8F0]/40 rounded-sm font-barlow text-[13px] font-extrabold uppercase tracking-widest btn-mech flex items-center justify-center gap-2 hover:bg-[#18C8F0]/25 transition-colors">
                <TrendingUp size={16} /> RECOVER — $50K
              </button>
            )}
            <button onClick={closeOverlay} className="flex-1 h-[48px] bg-[#112240] text-[#F3F7FC] border border-[#1E3A57] rounded-sm font-barlow text-[13px] font-extrabold uppercase tracking-widest btn-mech flex items-center justify-center hover:bg-[#1E3A57] transition-colors">
              DISMISS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
