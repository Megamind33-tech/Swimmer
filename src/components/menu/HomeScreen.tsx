/**
 * Home Screen - SWIM 26 Material Design 3
 * Main hub with featured season, stats, and quick actions
 */

import React, { useState } from 'react';
import { IPlayerSwimmer } from '../../types';

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
      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col overflow-y-auto p-6 gap-8">
        {/* Featured Season Card */}
        <div className="glass-panel p-6 border-l-4 border-primary rounded-lg max-w-2xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-headline text-2xl font-bold italic uppercase text-primary mb-2">
                Championship Season 7
              </h2>
              <p className="text-on-surface-variant text-sm">National Trials Finals - 2 races left before qualification</p>
            </div>
            <div className="bg-error/30 border border-error px-3 py-1 rounded-full">
              <p className="text-error text-xs font-bold uppercase">LIVE</p>
            </div>
          </div>
          <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-center">
            <span className="text-on-surface-variant text-xs font-bold uppercase">SEASON ENDS IN</span>
            <span className="font-headline text-primary text-lg font-bold">12d 5h 22m</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
          {/* Global Rank Card */}
          <div className="glass-panel p-4 border-l-4 border-primary rounded-lg">
            <p className="text-primary text-xs font-bold uppercase mb-2">Global Rank</p>
            <p className="text-on-surface text-2xl font-headline font-bold">#1,234</p>
            <div className="mt-2 text-primary/60 text-xs">↑ 45 positions</div>
          </div>

          {/* Win Streak Card */}
          <div className="glass-panel p-4 border-l-4 border-secondary rounded-lg">
            <p className="text-secondary text-xs font-bold uppercase mb-2">Win Streak</p>
            <p className="text-on-surface text-2xl font-headline font-bold">7x</p>
            <div className="mt-2 text-secondary/60 text-xs">🔥 ON FIRE!</div>
          </div>

          {/* Personal Best Card */}
          <div className="glass-panel p-4 border-l-4 border-tertiary-fixed rounded-lg">
            <p className="text-tertiary-fixed text-xs font-bold uppercase mb-2">Personal Best</p>
            <p className="text-on-surface text-2xl font-headline font-bold">51.23s</p>
            <div className="mt-2 text-tertiary-fixed/60 text-xs">FREESTYLE</div>
          </div>
        </div>

        {/* Daily Objectives */}
        <div className="glass-panel p-4 border-l-4 border-secondary rounded-lg max-w-2xl">
          <h3 className="text-secondary text-xs font-bold uppercase mb-4">Daily Objectives</h3>
          <div className="space-y-3">
            {[
              { name: 'Complete 2 sprint races', progress: 1, total: 2 },
              { name: 'Perform 3 perfect turns', progress: 2, total: 3 },
              { name: 'Train endurance once', progress: 0, total: 1 },
            ].map((obj, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">{obj.name}</span>
                  <span className="text-on-surface-variant">{obj.progress}/{obj.total}</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-secondary to-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(obj.progress / obj.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed at Bottom */}
      <div className="relative z-20 px-6 pb-6 space-y-3">
        {/* PRIMARY: Start Race */}
        <button
          onClick={onPlayClick}
          onMouseEnter={() => setIsPlayHovering(true)}
          onMouseLeave={() => setIsPlayHovering(false)}
          className="w-full group relative px-6 py-5 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95"
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-r from-primary via-primary-dim to-primary-fixed transition-all duration-300 ${
            isPlayHovering ? 'opacity-100 shadow-2xl shadow-primary/60' : 'opacity-90'
          }`} />

          {/* Content */}
          <div className="relative flex items-center justify-between">
            <div className="text-left">
              <div className="font-headline text-xl font-black text-on-primary uppercase tracking-wider">
                START RACE
              </div>
              <div className="text-sm text-on-primary/80 font-bold mt-1">
                Enter Championship • Instant Matchmaking
              </div>
            </div>
            <span className="material-symbols-outlined text-on-primary text-3xl transition-transform duration-300" style={{fontVariationSettings: "'FILL' 1"}}>
              play_arrow
            </span>
          </div>
        </button>

        {/* SECONDARY: Career Path */}
        <button
          onClick={onCareerClick}
          className="w-full group relative px-6 py-4 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 border-2 border-primary/40 glass-panel"
        >
          <span className="relative flex items-center justify-between font-headline text-lg text-on-surface uppercase tracking-wider font-bold">
            <span>Continue Career</span>
            <span className="group-hover:translate-y-1 transition-transform duration-300">
              <span className="material-symbols-outlined">expand_more</span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

/**
 * Right Utility Panel for Home Screen
 */
export const HomeRightPanel: React.FC = () => {
  const dailyObjectives = [
    { id: 1, name: 'Complete 2 sprint races', progress: 1, total: 2 },
    { id: 2, name: 'Perform 3 perfect turns', progress: 2, total: 3 },
    { id: 3, name: 'Train endurance once', progress: 0, total: 1 },
    { id: 4, name: 'Beat one rival ghost', progress: 0, total: 1 },
  ];

  return (
    <div className="space-y-4">
      {/* Daily Objectives - Compact */}
      <div className="glass-panel p-4 border-l-4 border-secondary rounded-lg hover:border-primary/40 transition-all">
        <h3 className="text-xs font-black text-secondary uppercase tracking-wider mb-3">Daily Objectives</h3>
        <div className="space-y-2">
          {dailyObjectives.map((obj) => (
            <div key={obj.id} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">{obj.name}</span>
                <span className="text-on-surface-variant">{obj.progress}/{obj.total}</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-secondary to-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(obj.progress / obj.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Events */}
      <div className="glass-panel p-4 border-l-4 border-primary rounded-lg hover:border-primary/40 transition-all">
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

      {/* Season Pass Progress */}
      <div className="glass-panel p-4 border-l-4 border-tertiary-fixed rounded-lg hover:border-primary/40 transition-all">
        <h3 className="text-xs font-black text-tertiary-fixed uppercase tracking-wider mb-3">Season Pass</h3>
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-on-surface-variant">Tier 28 / 50</span>
            <span className="text-tertiary-fixed font-bold">56%</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-tertiary-fixed to-primary h-2 rounded-full transition-all duration-500"
              style={{ width: '56%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
