/**
 * Home Screen - SWIM 26 Material Design 3
 * Main hub with featured season, stats, and quick actions
 */

import React, { useState } from 'react';
import { IPlayerSwimmer } from '../../types';
import miaPhiriAthleteImage from '../../designs/835_mia_phiri_news.png_1/screen.png';

interface HomeScreenProps {
  player?: IPlayerSwimmer;
  onPlayClick?: () => void;
  onCareerClick?: () => void;
}


export const HomeScreen: React.FC<HomeScreenProps> = ({
  player,
  onPlayClick,
  onCareerClick,
}) => {
  const [isPlayHovering, setIsPlayHovering] = useState(false);

  return (
    <div className="flex-1 relative w-full h-full overflow-hidden flex flex-col">
      <div className="relative z-10 flex-1 flex flex-col overflow-y-auto p-6 max-[900px]:p-3 gap-4 max-[900px]:gap-2">
        {/* Championship Hero Strip */}
        <div className="glass-panel border border-primary/30 rounded-lg overflow-hidden w-full">
          <div className="px-4 max-[900px]:px-3 py-3 max-[900px]:py-2 bg-gradient-to-r from-black/65 via-primary/30 to-black/55 border-b border-white/15">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-headline text-[25px] max-[1100px]:text-2xl max-[900px]:text-sm font-black italic uppercase text-white tracking-wide leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
                CHAMPIONSHIP SEASON 7
              </h2>
              <span className="px-3 max-[900px]:px-2 py-1 rounded-full border border-white/70 text-white text-xs max-[900px]:text-[9px] font-black uppercase shrink-0">LIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_220px] max-[900px]:grid-cols-[1fr_120px] items-stretch min-h-[152px] max-[900px]:min-h-[112px]">
            <div className="p-4 max-[900px]:p-3 bg-gradient-to-r from-black/55 via-black/35 to-transparent flex flex-col justify-center">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-3xl max-[900px]:text-lg font-black uppercase leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">START RACE</p>
              </div>
              <p className="text-sm max-[900px]:text-[11px] font-semibold text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">Enter Championship • Instant Matchmaking</p>
            </div>

            <div className="relative bg-gradient-to-l from-primary/25 via-primary/10 to-transparent">
              <img src={miaPhiriAthleteImage} alt="Championship athlete" className="h-full w-full object-cover object-top opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-20 px-6 max-[900px]:px-3 pb-6 max-[900px]:pb-2 space-y-2">
        <button
          onClick={onPlayClick}
          onMouseEnter={() => setIsPlayHovering(true)}
          onMouseLeave={() => setIsPlayHovering(false)}
          className="w-full group relative px-6 max-[900px]:px-3 py-4 max-[900px]:py-2.5 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.01] active:scale-95"
        >
          <div className={`absolute inset-0 bg-gradient-to-r from-primary via-primary-dim to-primary-fixed transition-all duration-300 ${
            isPlayHovering ? 'opacity-100 shadow-2xl shadow-primary/60' : 'opacity-90'
          }`} />

          <div className="relative flex items-center justify-between">
            <div className="text-left">
              <div className="font-headline text-xl max-[900px]:text-sm font-black text-white uppercase tracking-wider">Start Race</div>
              <div className="text-sm max-[900px]:text-[10px] text-white/90 font-bold mt-1">Enter Championship • Instant Matchmaking</div>
            </div>
            <span className="material-symbols-outlined text-white text-3xl max-[900px]:text-xl" style={{fontVariationSettings: "'FILL' 1"}}>
              play_arrow
            </span>
          </div>
        </button>

        <button
          onClick={onCareerClick}
          className="w-full group relative px-6 max-[900px]:px-3 py-3 max-[900px]:py-2.5 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.01] active:scale-95 border-2 border-primary/40 glass-panel"
        >
          <span className="relative flex items-center justify-between font-headline text-lg max-[900px]:text-sm text-white uppercase tracking-wider font-bold">
            <span>Continue Career</span>
            <span className="material-symbols-outlined">expand_more</span>
          </span>
        </button>
      </div>
    </div>
  );
};

interface HomeRightPanelProps {
  onOpenShop?: () => void;
  onOpenShopItem?: (itemId: string) => void;
}

export const HomeRightPanel: React.FC<HomeRightPanelProps> = () => {
  const dailyObjectives = [
    { id: 1, name: 'Complete 2 sprint races', progress: 1, total: 2 },
    { id: 2, name: 'Perform 3 perfect turns', progress: 2, total: 3 },
    { id: 3, name: 'Train endurance once', progress: 0, total: 1 },
    { id: 4, name: 'Beat one rival ghost', progress: 0, total: 1 },
  ];

  return (
    <div className="space-y-4">
      <div className="glass-panel p-4 border-l-4 border-secondary rounded-lg">
        <h3 className="text-xs font-black text-secondary uppercase tracking-wider mb-3">Daily Objectives</h3>
        <div className="space-y-2">
          {dailyObjectives.map((obj) => (
            <div key={obj.id} className="flex items-center justify-between text-sm">
              <span className="text-on-surface-variant">{obj.name}</span>
              <span className="text-on-surface-variant font-semibold">{obj.progress}/{obj.total}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-4 border-l-4 border-primary rounded-lg">
        <h3 className="text-xs font-black text-primary uppercase tracking-wider mb-3">Active Events</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant text-sm">World Sprint Cup</span>
            <span className="text-primary font-mono text-xs font-bold">05:14:22</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant text-sm">Butterfly Challenge</span>
            <span className="text-primary font-mono text-xs font-bold">2d 14h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
