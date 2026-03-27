import React from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { Trophy, Medal, X } from 'lucide-react';

export const RaceResultOverlay = ({ onExit }: { onExit: () => void }) => {
  const { state, resetRace } = useGameStore();
  const race = state.race;

  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = t % 60;
    return `${String(mins).padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`;
  };

  const allResults = [
    { name: 'YOU', time: race.finalTime, rank: 0, isPlayer: true },
    ...race.opponents.map(o => ({ name: o.name, time: o.finished ? o.finalTime : 999, rank: 0, isPlayer: false })),
  ].sort((a, b) => a.time - b.time).map((r, i) => ({ ...r, rank: i + 1 }));

  const playerResult = allResults.find(r => r.isPlayer)!;
  const isGold = playerResult.rank === 1;
  const pointsEarned = Math.max(0, (6 - playerResult.rank) * 50);

  const handleExit = () => { resetRace(); onExit(); };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 pointer-events-auto">
      <div className="absolute inset-0 bg-[#020b14]/90 backdrop-blur-md" />
      <div className="relative bg-[#0a192f] border border-[#1E3A57] w-full max-w-[500px] max-h-[90vh] overflow-y-auto no-scrollbar animate-slide shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        
        <div className={`absolute top-0 left-0 right-0 h-[4px] z-10 ${isGold ? 'bg-[#FFB800]' : 'bg-[#18C8F0]'}`} />

        <div className="p-6 text-center">
          <div className={`inline-flex items-center justify-center w-[80px] h-[80px] rounded-full border-4 mb-4 ${isGold ? 'border-[#FFB800] bg-[#FFB800]/10' : 'border-[#18C8F0] bg-[#18C8F0]/10'}`}>
            {isGold ? <Trophy size={36} className="text-[#FFB800]" /> : <Medal size={36} className="text-[#18C8F0]" />}
          </div>
          <h1 className="font-bebas text-5xl text-[#F3F7FC] tracking-widest">{isGold ? 'GOLD MEDAL' : `${playerResult.rank}${['ST','ND','RD','TH','TH','TH'][playerResult.rank-1]} PLACE`}</h1>
          <p className="font-rajdhani text-lg font-bold text-[#9EB2C7] mt-1">100M FREESTYLE — WORLD FINAL</p>
          <p className="font-rajdhani text-4xl font-bold text-[#F3F7FC] mt-3 drop-shadow-lg">{formatTime(race.finalTime)}</p>
        </div>

        <div className="px-4 pb-2">
          <div className="bg-[#020b14] border border-[#1E3A57] rounded-sm overflow-hidden">
            <div className="bg-[#112240] px-4 py-2 flex items-center justify-between border-b border-[#1E3A57]">
              <span className="font-barlow text-[10px] font-extrabold text-[#18C8F0] tracking-[0.2em] uppercase">OFFICIAL RESULTS</span>
            </div>
            {allResults.map((r) => (
              <div key={r.name} className={`flex items-center px-4 py-3 border-b border-[#1E3A57]/30 ${r.isPlayer ? 'bg-[#18C8F0]/10 border-l-2 border-l-[#18C8F0]' : 'border-l-2 border-l-transparent'}`}>
                <span className={`font-rajdhani text-lg font-bold w-8 ${r.rank === 1 ? 'text-[#FFB800]' : 'text-[#71859C]'}`}>{r.rank}</span>
                <span className={`font-barlow text-[13px] font-extrabold uppercase flex-1 ${r.isPlayer ? 'text-[#F3F7FC]' : 'text-[#9EB2C7]'}`}>{r.name}</span>
                <span className="font-rajdhani text-[14px] font-bold text-[#F3F7FC]">{r.time < 999 ? formatTime(r.time) : 'DNF'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <div className="bg-[#020b14] border border-[#1E3A57] p-3 rounded-sm flex justify-between items-center">
            <span className="font-rajdhani text-sm font-bold text-[#9EB2C7] uppercase tracking-widest">POINTS EARNED</span>
            <span className="font-rajdhani text-xl font-bold text-[#C8FF00]">+{pointsEarned} PTS</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#020b14] border border-[#1E3A57] p-2 rounded-sm">
              <span className="text-[8px] uppercase font-bold text-[#71859C] tracking-widest block">STROKES</span>
              <span className="font-rajdhani text-lg font-bold text-[#F3F7FC]">{race.strokeCount}</span>
            </div>
            <div className="bg-[#020b14] border border-[#1E3A57] p-2 rounded-sm">
              <span className="text-[8px] uppercase font-bold text-[#71859C] tracking-widest block">BREATHS</span>
              <span className="font-rajdhani text-lg font-bold text-[#F3F7FC]">{race.breathCount}</span>
            </div>
            <div className="bg-[#020b14] border border-[#1E3A57] p-2 rounded-sm">
              <span className="text-[8px] uppercase font-bold text-[#71859C] tracking-widest block">SURGES</span>
              <span className="font-rajdhani text-lg font-bold text-[#F3F7FC]">{race.surgeCount}</span>
            </div>
          </div>
          <button onClick={handleExit} className="w-full h-[52px] bg-[#F3F7FC] text-[#0a192f] btn-primary-clip font-bebas text-xl tracking-[0.1em] btn-mech shadow-[0_4px_20px_rgba(243,247,252,0.3)] mt-2">
            RETURN TO HUB
          </button>
        </div>
      </div>
    </div>
  );
};
