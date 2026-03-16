/**
 * Home Screen - SWIM 26 Material Design 3
 * Main hub with featured season, stats, and quick actions
 */

import React from 'react';
import { IPlayerSwimmer } from '../../types';
import miaPhiriAthleteImage from '../../designs/835_mia_phiri_news.png_1/screen.png';
import p2pQuickMatchImage from '../../designs/doh9161_copy.width_800.jpg/screen.png';

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
  return (
    <div className="flex-1 relative w-full h-full overflow-y-auto flex flex-col">
      <div className="relative z-10 flex-1 flex flex-col overflow-y-auto p-4 max-[900px]:p-2.5 gap-2 max-[900px]:gap-2 min-h-0 pb-3">
        {/* Championship Hero Strip */}
        <div className="glass-panel border border-primary/30 rounded-lg overflow-hidden w-full flex-[1.25] min-h-[230px] max-[900px]:min-h-[170px]">
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
                <button
                  onClick={onPlayClick}
                  className="h-11 w-11 max-[900px]:h-11 max-[900px]:w-11 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 flex items-center justify-center transition-colors"
                  aria-label="Play start race"
                >
                  <span className="material-symbols-outlined text-white">play_arrow</span>
                </button>
              </div>
              <p className="text-sm max-[900px]:text-[11px] font-semibold text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">Enter Championship • Instant Matchmaking</p>
            </div>

            <div className="relative bg-gradient-to-l from-primary/25 via-primary/10 to-transparent">
              <img src={miaPhiriAthleteImage} alt="Championship athlete" className="h-full w-full object-cover object-top opacity-50" />
            </div>
          </div>
        </div>


        {/* Live Race Wire */}
        <div className="glass-panel border border-cyan-300/25 rounded-lg px-4 max-[900px]:px-3 py-3 max-[900px]:py-2 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent">
          <div className="flex items-center justify-between gap-3 max-[900px]:gap-2">
            <div>
              <p className="text-[11px] max-[900px]:text-[9px] font-black uppercase tracking-wider text-cyan-200">Live Race Wire</p>
              <p className="text-sm max-[900px]:text-[10px] font-semibold text-white">Rival Queue Active • 126 swimmers searching now</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 animate-pulse" />
              <span className="text-[11px] max-[900px]:text-[9px] font-black uppercase text-cyan-100">Broadcast Live</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-20 flex-1 flex">
        <button
          onClick={onPlayClick}
          className="w-full h-full group relative px-6 max-[900px]:px-3 py-5 max-[900px]:py-4 min-h-[190px] max-[900px]:min-h-[130px] rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.01] active:scale-95 border border-white/20"
        >
          <img
            src={p2pQuickMatchImage}
            alt="P2P Quick matches"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/65 group-hover:from-black/70 group-hover:via-black/35 group-hover:to-black/60 transition-colors" />

          <span className="relative flex items-center justify-between font-headline text-2xl max-[900px]:text-base text-white uppercase tracking-wider font-bold">
            <span>P2P Quick matches</span>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">groups</span>
              <span className="h-11 w-11 max-[900px]:h-11 max-[900px]:w-11 rounded-full bg-white/15 border border-white/35 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl max-[900px]:text-lg">play_arrow</span>
              </span>
            </span>
          </span>
        </button>
        </div>

        {/* Mobile 19.5:9 Action Hub */}
        <div className="action-hub-shell hidden max-[900px]:flex">
          <div className="action-hub-arc">
            <button
              onClick={onPlayClick}
              className="action-hub-button action-hub-primary"
              aria-label="Start quick race"
            >
              <span className="material-symbols-outlined text-[22px]">play_arrow</span>
              <span className="text-[10px] font-black uppercase tracking-wide">Quick Race</span>
            </button>
            <button
              onClick={onCareerClick}
              className="action-hub-button action-hub-secondary"
              aria-label="Open training"
            >
              <span className="material-symbols-outlined text-[22px]">fitness_center</span>
              <span className="text-[10px] font-black uppercase tracking-wide">Training</span>
            </button>
          </div>
        </div>
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
