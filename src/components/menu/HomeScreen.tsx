/**
 * Home Screen - FC26-inspired premium swimming menu
 * Hero player showcase with Division Rivals styling, premium cards, cinematic atmosphere
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
    <div className="flex-1 relative w-full h-full overflow-hidden">
      {/* Premium Cinematic Background */}
      <div className="absolute inset-0">
        {/* Dynamic gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950 to-slate-950"></div>

        {/* Animated stadium lights */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite' }}></div>

        {/* Stadium floor gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      {/* Main Content - Landscape Layout */}
      <div className="relative z-20 h-full flex items-center px-8 py-6">

        {/* LEFT: Hero Player Showcase */}
        <div className="flex-1 h-full flex flex-col items-center justify-center">
          {/* Hero Card Container */}
          <div className="relative w-full max-w-xs h-96 group">
            {/* Premium Card Frame */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-600/30 via-slate-900/60 to-black rounded-2xl border-2 border-yellow-500/40 shadow-2xl shadow-yellow-500/30 overflow-hidden">

              {/* Backdrop Image Area */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-900/40 flex items-center justify-center">
                {/* Player Placeholder - Use actual image here */}
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-yellow-400 via-cyan-500 to-blue-600 flex items-center justify-center text-white text-7xl font-black shadow-2xl shadow-yellow-500/60 animate-pulse">
                    {player?.name.charAt(0).toUpperCase() || 'S'}
                  </div>
                </div>
              </div>

              {/* Gold Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              {/* Hero Info Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                {/* Player Name */}
                <div>
                  <h2 className="text-2xl font-black text-yellow-300 tracking-wider">{player?.name || 'ELITE SWIMMER'}</h2>
                  <p className="text-cyan-300 font-bold text-sm">LEVEL {player?.level || 1}</p>
                </div>

                {/* Division Badge */}
                <div className="flex gap-2 items-center">
                  <div className="px-3 py-1 bg-gradient-to-r from-yellow-500/80 to-yellow-600/60 rounded-lg border border-yellow-400/60">
                    <p className="text-white font-black text-xs">ELITE DIVISION</p>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-purple-600/60 to-pink-600/60 rounded-lg border border-purple-400/40">
                    <p className="text-white font-bold text-xs">RANK #1,234</p>
                  </div>
                </div>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-40 bg-gradient-to-r from-transparent via-white to-transparent group-hover:animate-pulse transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        {/* RIGHT: Menu Content */}
        <div className="flex-1 h-full flex flex-col justify-between pl-12">

          {/* Top Section - Featured Season */}
          <div className="space-y-8">
            {/* Season Banner - Premium Card */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-600/30 to-purple-600/20 p-6 shadow-xl shadow-yellow-500/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-black text-yellow-300 uppercase tracking-wider">Championship Season 7</h3>
                  <div className="px-3 py-1 bg-red-600/50 rounded-lg border border-red-500/60">
                    <p className="text-white text-xs font-black">LIVE</p>
                  </div>
                </div>
                <p className="text-slate-200 text-sm font-medium">National Trials Finals - 2 races left before qualification</p>
                <div className="mt-4 pt-4 border-t border-yellow-500/30 flex justify-between items-center">
                  <span className="text-slate-300 text-xs font-bold">SEASON ENDS IN</span>
                  <span className="text-yellow-300 font-black text-lg">12d 5h 22m</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid - Premium Cards */}
            <div className="grid grid-cols-3 gap-3">
              {/* Global Rank Card */}
              <div className="bg-gradient-to-br from-cyan-600/30 to-cyan-900/20 rounded-xl p-4 border border-cyan-500/40 backdrop-blur-sm shadow-lg">
                <p className="text-cyan-400 text-xs font-bold uppercase mb-2">Global Rank</p>
                <p className="text-cyan-200 text-2xl font-black">#1,234</p>
                <div className="mt-2 text-cyan-500/60 text-xs">↑ 45 positions</div>
              </div>

              {/* Win Streak Card */}
              <div className="bg-gradient-to-br from-purple-600/30 to-purple-900/20 rounded-xl p-4 border border-purple-500/40 backdrop-blur-sm shadow-lg">
                <p className="text-purple-400 text-xs font-bold uppercase mb-2">Win Streak</p>
                <p className="text-purple-200 text-2xl font-black">7x</p>
                <div className="mt-2 text-purple-500/60 text-xs">🔥 ON FIRE!</div>
              </div>

              {/* Personal Best Card */}
              <div className="bg-gradient-to-br from-emerald-600/30 to-emerald-900/20 rounded-xl p-4 border border-emerald-500/40 backdrop-blur-sm shadow-lg">
                <p className="text-emerald-400 text-xs font-bold uppercase mb-2">Personal Best</p>
                <p className="text-emerald-200 text-2xl font-black">51.23s</p>
                <div className="mt-2 text-emerald-500/60 text-xs">FREESTYLE</div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Premium CTAs */}
          <div className="space-y-3">
            {/* PRIMARY: Race Now - Cinematic Button */}
            <button
              onClick={onPlayClick}
              onMouseEnter={() => setIsPlayHovering(true)}
              onMouseLeave={() => setIsPlayHovering(false)}
              className="w-full group relative px-6 py-5 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
            >
              {/* Premium gradient - Gold to Cyan */}
              <div className={`absolute inset-0 bg-gradient-to-r from-yellow-500 via-cyan-500 to-blue-600 transition-all duration-300 ${
                isPlayHovering ? 'opacity-100 shadow-2xl shadow-yellow-500/60' : 'opacity-90'
              }`}></div>

              {/* Shine animation */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-r from-white via-transparent to-transparent animate-pulse"></div>

              {/* Content */}
              <div className="relative flex items-center justify-between">
                <div className="text-left">
                  <div className="font-black text-2xl text-white uppercase tracking-wider leading-tight">RACE NOW</div>
                  <div className="text-sm text-yellow-100 font-bold mt-1">Enter Championship • Instant Matchmaking</div>
                </div>
                <div className={`text-4xl font-black text-white transition-transform duration-300 ${isPlayHovering ? 'translate-x-2' : ''}`}>▶</div>
              </div>

              {/* Glow bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-70 blur-sm transition-all"></div>
            </button>

            {/* SECONDARY: Career Path */}
            <button
              onClick={onCareerClick}
              className="w-full group relative px-6 py-4 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-purple-500/60 bg-gradient-to-r from-purple-900/40 to-slate-900/40 hover:from-purple-600/30 hover:to-slate-800/30 backdrop-blur-sm shadow-lg"
            >
              <span className="relative flex items-center justify-between font-bold text-lg text-white uppercase tracking-wider">
                <span>Continue Career</span>
                <span className="group-hover:translate-y-1 transition-transform duration-300 text-2xl">↓</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
      `}</style>
    </div>
  );
};

/**
 * Right Utility Panel for Home Screen - Landscape variant
 * Optimized for side-by-side display on wider screens
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
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-slate-700/50 hover:border-purple-500/30 transition-all">
        <h3 className="text-xs font-black text-purple-400 uppercase tracking-wider mb-3">Daily Objectives</h3>
        <div className="space-y-2">
          {dailyObjectives.map((obj) => (
            <div key={obj.id} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">{obj.name}</span>
                <span className="text-slate-400">{obj.progress}/{obj.total}</span>
              </div>
              <div className="w-full bg-slate-600/50 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(obj.progress / obj.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Events */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-slate-700/50 hover:border-amber-500/30 transition-all">
        <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3">Active Events</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">World Sprint Cup</span>
            <span className="text-amber-400 font-mono text-xs font-bold">05:14:22</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">Butterfly Challenge</span>
            <span className="text-amber-400 font-mono text-xs font-bold">2d 14h</span>
          </div>
        </div>
      </div>

      {/* Season Pass Progress */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-slate-700/50 hover:border-blue-500/30 transition-all">
        <h3 className="text-xs font-black text-blue-400 uppercase tracking-wider mb-3">Season Pass</h3>
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-300">Tier 28 / 50</span>
            <span className="text-blue-400 font-bold">56%</span>
          </div>
          <div className="w-full bg-slate-600/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: '56%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
