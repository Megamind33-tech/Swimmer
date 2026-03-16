/**
 * Home Screen - Game-Focused Broadcast Aesthetic
 * Championship display with glassmorphic cards and neon accents
 */

import React, { useState, useRef } from 'react';
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
    <div className="flex-1 relative w-full h-full overflow-y-auto flex flex-col font-body">
      <div className="relative z-10 flex-1 flex flex-col overflow-y-auto p-5 gap-4 min-h-0 pb-5">
        {/* Championship Hero Strip - Enhanced Glassmorphic */}
        <div className="glass-card overflow-hidden w-full flex-[1.25] min-h-[230px] group transition-all duration-300 rounded-2xl relative">
          {/* Header with Live Badge */}
          <div className="px-6 py-4 bg-gradient-to-r from-surface-high/60 via-primary/5 to-transparent border-b border-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface tracking-widest text-glow">
                Championship Season 7
              </h2>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(129,236,255,1)]"></span>
                <span className="text-[10px] text-primary font-black uppercase tracking-widest">Live Event</span>
              </div>
            </div>
          </div>

          {/* Hero Content Grid */}
          <div className="grid grid-cols-[1fr_240px] items-stretch min-h-[160px]">
            <div className="p-8 bg-gradient-to-r from-surface-high/40 to-transparent flex flex-col justify-center">
              <div className="flex items-center justify-between gap-4 mb-2">
                <p className="text-4xl font-headline font-black italic slanted uppercase leading-tight text-on-surface text-glow">
                  Start Race
                </p>
                <button
                  onClick={onPlayClick}
                  className="h-14 w-14 rounded-2xl border border-primary/40 bg-primary/10 hover:bg-primary/20 hover:border-primary/60 flex items-center justify-center transition-all duration-300 active:scale-90 group/btn shadow-xl shadow-primary/5"
                  aria-label="Play start race"
                >
                  <span className="material-symbols-outlined text-primary text-3xl text-glow group-hover/btn:scale-110 transition-transform">
                    play_arrow
                  </span>
                </button>
              </div>
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                <span className="w-4 h-[1px] bg-primary/40"></span>
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
        <div className="glass-card border-none rounded-xl px-6 py-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent group hover:bg-primary/15 transition-all duration-300 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(129,236,255,1)]" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary text-glow">Live Race Wire</p>
              <p className="text-sm font-semibold text-on-surface">Rival Queue Active • 126 swimmers searching now</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded border border-primary/20 bg-primary/5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">Broadcast</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-20 flex-1 flex gap-4 min-h-[190px]">
          <button
            onClick={onPlayClick}
            className="flex-1 group relative px-8 py-6 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] active:scale-95 glass-card border-white/5 hover:border-primary/40 shadow-xl"
          >
            {/* Background Image */}
            <img
              src={p2pQuickMatchImage}
              alt="P2P Quick matches"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 brightness-50"
            />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-1">PVP Arena</p>
                  <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow leading-none">
                    Multiplayer
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-xl border border-primary/40 bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                  <span className="material-symbols-outlined text-primary text-2xl text-glow">
                    groups
                  </span>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={onCareerClick}
            className="w-48 group relative px-6 py-6 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] active:scale-95 glass-card border-white/5 hover:border-secondary/40 shadow-xl"
          >
            <div className="relative h-full flex flex-col items-center justify-center text-center gap-3">
              <div className="h-16 w-16 rounded-full border border-secondary/40 bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-all shadow-lg shadow-secondary/5">
                <span className="material-symbols-outlined text-secondary text-3xl gold-glow" style={{ fontVariationSettings: "'FILL' 1" }}>
                  emoji_events
                </span>
              </div>
              <div>
                <p className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] mb-0.5">Progress</p>
                <h3 className="font-headline text-lg font-black italic slanted uppercase text-on-surface leading-none">
                  Career
                </h3>
              </div>
            </div>
          </button>
        </div>

        {/* Mobile Action Hub - Hydro Kinetic Refinement */}
        <div className="hidden max-[900px]:flex h-16 glass-panel rounded-2xl items-center justify-around px-4 border border-white/10">
          <button onClick={onPlayClick} className="flex flex-col items-center gap-1 group">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">play_arrow</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary/80">Race</span>
          </button>
          <button onClick={onCareerClick} className="flex flex-col items-center gap-1 group">
            <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">fitness_center</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary/80">Train</span>
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
  const [completedObjectives, setCompletedObjectives] = useState<Set<number>>(new Set([2]));
  const [splashingObjective, setSplashingObjective] = useState<number | null>(null);
  const splashRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const dailyObjectives = [
    { id: 1, name: 'Complete 2 sprint races', progress: 1, total: 2, icon: 'play_arrow' },
    { id: 2, name: 'Perform 3 perfect turns', progress: 3, total: 3, icon: 'edit' },
    { id: 3, name: 'Train endurance once', progress: 0, total: 1, icon: 'fitness_center' },
    { id: 4, name: 'Beat one rival ghost', progress: 0, total: 1, icon: 'emoji_events' },
  ];

  const activeEvents = [
    { name: 'World Sprint Cup', time: '05:14:22', timeMs: 514220, urgency: 'normal' as const },
    { name: 'Butterfly Challenge', time: '2d 14h', timeMs: null, urgency: 'normal' as const },
  ];

  const isComplete = (obj: typeof dailyObjectives[0]) => obj.progress >= obj.total;
  const progressPercent = (progress: number, total: number) => Math.min((progress / total) * 100, 100);

  const getIconColorClass = (obj: typeof dailyObjectives[0]) => {
    if (completedObjectives.has(obj.id)) {
      return 'icon-progress-complete';
    } else if (obj.progress > 0) {
      return 'icon-progress-active';
    }
    return 'icon-progress-grey';
  };

  const handleObjectiveClick = (obj: typeof dailyObjectives[0]) => {
    if (isComplete(obj) && !completedObjectives.has(obj.id)) {
      setSplashingObjective(obj.id);
      setCompletedObjectives((prev) => new Set([...prev, obj.id]));
      setTimeout(() => setSplashingObjective(null), 600);
    }
  };

  return (
    <div className="space-y-4 safe-zone">
      {/* Daily Objectives - Hydro Pane */}
      <div className="glass-panel p-6 rounded-2xl group hover:border-primary/40 transition-all duration-300">
        <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-5 text-glow">
          Daily Objectives
        </h3>
        <div className="space-y-3">
          {dailyObjectives.map((obj) => {
            const isCompleted = completedObjectives.has(obj.id);
            const fillPercent = progressPercent(obj.progress, obj.total);

            return (
              <div
                key={obj.id}
                ref={(el) => {
                  if (el) splashRefs.current[obj.id] = el;
                }}
                onClick={() => handleObjectiveClick(obj)}
                className={`relative flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isCompleted
                    ? 'bg-secondary/10 border-secondary/30 hover:border-secondary/50'
                    : 'bg-white/5 border-white/5 hover:border-primary/30 hover:bg-white/10'
                }`}
              >
                {/* Icon with Glass Look */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative h-10 w-10 rounded-lg bg-surface-highest/50 flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all">
                    <span
                      className={`material-symbols-outlined text-2xl shrink-0 transition-all duration-300 ${
                        isCompleted ? 'text-secondary gold-glow' : 'text-primary/70 group-hover:text-primary'
                      }`}
                      style={{ fontVariationSettings: isCompleted ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {obj.icon}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-bold truncate transition-colors duration-300 ${
                        isCompleted ? 'text-secondary/90' : 'text-on-surface'
                      }`}
                    >
                      {obj.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      {isCompleted ? 'Objective Complete' : `${obj.progress} / ${obj.total} Progress`}
                    </span>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="relative h-1.5 w-16 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      isCompleted ? 'bg-secondary shadow-[0_0_10px_rgba(255,215,9,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(129,236,255,0.5)]'
                    }`}
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Events - Floating Cards */}
      <div className="glass-panel p-6 rounded-2xl group hover:border-primary/40 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-16 -translate-y-16" />
        
        <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-5 text-glow">
          Active Events
        </h3>
        <div className="space-y-4">
          {activeEvents.map((event, idx) => (
            <div
              key={idx}
              className="relative p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all duration-300 group/card overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-on-surface group-hover/card:text-primary transition-colors">{event.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-8 bg-primary/30 rounded-full" />
                    <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-black">Season Series</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="text-primary font-headline font-bold italic slanted text-glow">
                    {event.time}
                  </div>
                  <div className="text-[8px] uppercase tracking-tighter text-on-surface-variant font-bold">Ends In</div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000" />
            </div>
          ))}
        </div>
      </div>
      </div>
    );
};

export default HomeScreen;
