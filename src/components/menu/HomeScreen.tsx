/**
 * Home Screen - Game-Focused Broadcast Aesthetic
 * Championship display with glassmorphic cards and neon accents
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
    <div className="flex-1 relative w-full h-full overflow-y-auto flex flex-col safe-zone-x">
      <div className="relative z-10 flex-1 flex flex-col overflow-y-auto p-4 max-[900px]:p-2.5 gap-3 max-[900px]:gap-2 min-h-0 pb-3">
        {/* Championship Hero Strip - Enhanced Glassmorphic with Water Theme */}
        <div className="glass-card overflow-hidden w-full flex-[1.25] min-h-[230px] max-[900px]:min-h-[170px] group hover:border-neon-cyan/40 transition-all duration-300 skew-container border border-neon-cyan/25 shadow-lg shadow-neon-cyan/10 rounded-2xl wave-container">
          {/* Wave effect on hover */}
          <div className="wave-element"></div>

          {/* Header with Live Badge */}
          <div className="px-6 max-[900px]:px-4 py-4 max-[900px]:py-3 bg-gradient-to-r from-broadcast-overlay/60 via-neon-cyan/8 to-broadcast-overlay/60 border-b border-neon-cyan/15 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-din text-[25px] max-[1100px]:text-2xl max-[900px]:text-sm font-black italic-header uppercase text-white tracking-wider leading-tight drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                CHAMPIONSHIP SEASON 7
              </h2>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-cyan/40 bg-neon-cyan/8 animate-live-pulse backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span>
                <span className="text-xs text-neon-cyan font-bold font-mono uppercase tracking-wider">LIVE</span>
              </div>
            </div>
          </div>

          {/* Hero Content Grid */}
          <div className="grid grid-cols-[1fr_220px] max-[900px]:grid-cols-[1fr_120px] items-stretch min-h-[152px] max-[900px]:min-h-[112px]">
            <div className="p-6 max-[900px]:p-4 bg-gradient-to-r from-broadcast-overlay/50 via-neon-cyan/3 to-transparent flex flex-col justify-center backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4 mb-3">
                <p className="text-3xl max-[900px]:text-lg font-din font-black italic-header uppercase leading-tight text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                  START RACE
                </p>
                <button
                  onClick={onPlayClick}
                  className="h-12 w-12 max-[900px]:h-10 max-[900px]:w-10 rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 hover:bg-neon-cyan/20 hover:border-neon-cyan/60 flex items-center justify-center transition-all duration-300 active:animate-squash-stretch group/btn backdrop-blur-sm shadow-lg shadow-neon-cyan/5"
                  aria-label="Play start race"
                >
                  <span className="material-symbols-outlined text-neon-cyan text-2xl drop-shadow-[0_0_8px_rgba(0,255,255,0.4)] group-hover/btn:scale-110 transition-transform">
                    play_arrow
                  </span>
                </button>
              </div>
              <p className="text-sm max-[900px]:text-[11px] font-barlow font-bold text-white/90">
                Enter Championship • Instant Matchmaking
              </p>
            </div>

            {/* Hero Image */}
            <div className="relative bg-gradient-to-l from-neon-cyan/20 via-neon-cyan/10 to-transparent overflow-hidden">
              <img
                src={miaPhiriAthleteImage}
                alt="Championship athlete"
                className="h-full w-full object-cover object-top opacity-70 group-hover:opacity-90 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-broadcast-overlay/20"></div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="wave-divider"></div>

        {/* Live Race Wire - Broadcast Ticker Style */}
        <div className="glass-card-elevated border-2 border-neon-cyan/40 rounded-xl px-6 max-[900px]:px-4 py-3 max-[900px]:py-2.5 bg-gradient-to-r from-neon-cyan/10 via-neon-cyan/5 to-transparent group hover:border-neon-cyan/70 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] transition-all duration-300 wave-hover">
          <div className="flex items-center justify-between gap-3 max-[900px]:gap-2">
            <div className="flex-1">
              <p className="text-[11px] max-[900px]:text-[9px] font-barlow font-black uppercase tracking-wider text-neon-cyan drop-shadow-[0_0_6px_rgba(0,255,255,0.5)]">
                Live Race Wire
              </p>
              <p className="text-sm max-[900px]:text-[10px] font-barlow font-bold text-white/90">
                Rival Queue Active • 126 swimmers searching now
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 px-3 py-1 rounded-lg bg-neon-cyan/20 border border-neon-cyan/30">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-live-pulse" />
              <span className="text-[11px] max-[900px]:text-[9px] font-bold font-barlow uppercase text-neon-cyan tracking-wider">
                Broadcast
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-20 flex-1 flex">
          <button
            onClick={onPlayClick}
            className="w-full h-full group relative px-8 max-[900px]:px-5 py-6 max-[900px]:py-4 min-h-[190px] max-[900px]:min-h-[130px] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-neon-cyan/25 glass-card skew-container-reverse active:animate-squash-stretch shadow-lg shadow-neon-cyan/5 hover:shadow-lg hover:shadow-neon-cyan/15 wave-container"
          >
            {/* Wave effect on hover */}
            <div className="wave-element"></div>
            {/* Background Image */}
            <img
              src={p2pQuickMatchImage}
              alt="P2P Quick matches"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-broadcast-overlay/85 via-broadcast-overlay/60 to-broadcast-overlay/75 group-hover:from-broadcast-overlay/80 group-hover:via-broadcast-overlay/50 group-hover:to-broadcast-overlay/70 transition-colors" />

            {/* Speed line texture */}
            <div className="absolute inset-0 speed-lines opacity-30 group-hover:opacity-50 transition-opacity"></div>

            {/* Content */}
            <span className="relative flex items-center justify-between font-din text-2xl max-[900px]:text-base text-white uppercase tracking-wider font-black">
              <span className="drop-shadow-[0_0_12px_rgba(0,255,255,0.3)]">P2P Quick Matches</span>
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
                  groups
                </span>
                <span className="h-10 w-10 max-[900px]:h-9 max-[900px]:w-9 rounded-xl neon-stroke flex items-center justify-center group-hover:neon-stroke-active transition-all duration-300">
                  <span className="material-symbols-outlined text-neon-cyan text-xl max-[900px]:text-lg drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]">
                    play_arrow
                  </span>
                </span>
              </span>
            </span>
          </button>
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
    { id: 1, name: 'Complete 2 sprint races', progress: 1, total: 2, icon: 'play_arrow' },
    { id: 2, name: 'Perform 3 perfect turns', progress: 2, total: 3, icon: 'edit' },
    { id: 3, name: 'Train endurance once', progress: 0, total: 1, icon: 'fitness_center' },
    { id: 4, name: 'Beat one rival ghost', progress: 0, total: 1, icon: 'emoji_events' },
  ];

  const activeEvents = [
    { name: 'World Sprint Cup', time: '05:14:22' },
    { name: 'Butterfly Challenge', time: '2d 14h' },
  ];

  return (
    <div className="space-y-4 safe-zone">
      {/* Daily Objectives */}
      <div className="glass-card p-5 border border-neon-cyan/25 rounded-2xl group hover:border-neon-cyan/40 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-neon-cyan/5 wave-hover">
        <h3 className="text-xs font-din font-black text-neon-cyan uppercase tracking-wider mb-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">
          Daily Objectives
        </h3>
        <div className="space-y-3">
          {dailyObjectives.map((obj) => (
            <div key={obj.id} className="flex items-center justify-between p-2 rounded-lg bg-neon-cyan/8 border border-neon-cyan/15 hover:border-neon-cyan/35 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="material-symbols-outlined text-neon-cyan text-lg shrink-0">
                  {obj.icon}
                </span>
                <span className="text-sm font-barlow font-bold text-white/85 truncate">
                  {obj.name}
                </span>
              </div>
              <span className="text-xs font-mono-data text-neon-cyan ml-2 shrink-0 drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">
                {obj.progress}/{obj.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Events */}
      <div className="glass-card p-5 border border-neon-cyan/25 rounded-2xl group hover:border-neon-cyan/40 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-neon-cyan/5 wave-hover">
        <h3 className="text-xs font-din font-black text-neon-cyan uppercase tracking-wider mb-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">
          Active Events
        </h3>
        <div className="space-y-2">
          {activeEvents.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg bg-neon-cyan/8 border border-neon-cyan/15 hover:border-neon-cyan/35 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="text-sm font-barlow font-bold text-white/85">{event.name}</span>
              <span className="text-xs font-mono-timer text-neon-cyan drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">
                {event.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
