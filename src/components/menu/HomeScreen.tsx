/**
 * Home Screen - Professional FC26-style main menu
 * Hero-focused design with athlete imagery, smooth animations, landscape-optimized
 */

import React, { useState, useEffect } from 'react';
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
  const [selectedStroke, setSelectedStroke] = useState<string>('FREESTYLE');
  const [isHovering, setIsHovering] = useState<string | null>(null);

  // Animated background effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center relative w-full h-full overflow-hidden">
      {/* Dynamic Background with Animation */}
      <div className="absolute inset-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"></div>

        {/* Animated light orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animation: 'float 10s ease-in-out infinite reverse' }}></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" style={{ animation: 'float 12s ease-in-out infinite' }}></div>
      </div>

      {/* Main Hero Section - Landscape Optimized */}
      <div className="relative z-20 w-full h-full flex items-center justify-between px-12 py-8 max-w-7xl mx-auto">

        {/* Left Hero Section - Athlete Imagery Area */}
        <div className="flex-1 h-full flex items-center justify-center relative group">
          {/* Hero Image Container */}
          <div className="relative w-full h-full max-w-md max-h-96 rounded-xl overflow-hidden shadow-2xl border border-cyan-500/30 bg-gradient-to-br from-blue-900/50 to-slate-900/50 backdrop-blur-sm transition-all duration-500 group-hover:border-cyan-400/60 group-hover:shadow-2xl group-hover:shadow-cyan-500/40">
            {/* Gradient overlay for athlete image area */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

            {/* Placeholder for athlete image - this would be replaced with actual image */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-600/20 to-blue-600/20">
              <div className="text-center">
                <div className="w-40 h-40 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-cyan-500/50">
                  {player?.name.charAt(0).toUpperCase() || 'A'}
                </div>
                <p className="text-cyan-300 font-bold text-sm">Elite Athlete</p>
              </div>
            </div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:via-cyan-500/5 group-hover:to-cyan-500/0 transition-all duration-500 z-5"></div>
          </div>
        </div>

        {/* Right Content Section - Menu & Info */}
        <div className="flex-1 h-full flex flex-col justify-between relative z-20 pl-12">

          {/* Top Section - Season & Stats */}
          <div className="space-y-6">
            {/* Main Heading */}
            <div className="space-y-2 animate-fade-in">
              <h1 className="text-5xl font-black text-white leading-tight">
                CHAMPIONSHIP
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  SEASON 7
                </span>
              </h1>
              <p className="text-blue-300/80 text-lg font-medium">National trials finals approaching</p>
            </div>

            {/* Stroke Selection - Horizontal */}
            <div className="flex gap-3 mt-6">
              {['FREESTYLE', 'BUTTERFLY', 'BREASTSTROKE', 'BACKSTROKE'].map((stroke) => (
                <button
                  key={stroke}
                  onClick={() => setSelectedStroke(stroke)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 border ${
                    selectedStroke === stroke
                      ? 'bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/50 scale-105'
                      : 'bg-slate-800/40 text-slate-300 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  {stroke.slice(0, 3)}
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-all">
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Global Rank</p>
                <p className="text-cyan-400 text-2xl font-black">#1,234</p>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-slate-700/50 hover:border-purple-500/30 transition-all">
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Win Streak</p>
                <p className="text-purple-400 text-2xl font-black">7x</p>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-slate-700/50 hover:border-emerald-500/30 transition-all">
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Personal Best</p>
                <p className="text-emerald-400 text-2xl font-black">51.23s</p>
              </div>
            </div>
          </div>

          {/* Bottom Section - CTAs */}
          <div className="space-y-4 pb-4">
            {/* Primary CTA - RACE NOW */}
            <button
              onClick={onPlayClick}
              onMouseEnter={() => setIsHovering('play')}
              onMouseLeave={() => setIsHovering(null)}
              className="w-full group relative px-8 py-5 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-100 group-hover:opacity-110 transition-all duration-300"></div>

              {/* Animated shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-white to-transparent transition-all duration-500"></div>

              {/* Content */}
              <div className="relative flex items-center justify-between">
                <div className="text-left">
                  <span className="block font-black text-2xl text-white uppercase tracking-wider">
                    RACE NOW
                  </span>
                  <span className="block text-sm text-emerald-100 font-medium mt-1">2 races until qualification</span>
                </div>
                <div className="text-3xl group-hover:translate-x-2 transition-transform duration-300">→</div>
              </div>

              {/* Bottom glow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-50 blur-sm transition-all duration-300"></div>
            </button>

            {/* Secondary CTA - Career */}
            <button
              onClick={onCareerClick}
              onMouseEnter={() => setIsHovering('career')}
              onMouseLeave={() => setIsHovering(null)}
              className="w-full group relative px-8 py-4 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-cyan-500/50 bg-gradient-to-r from-slate-800/40 to-slate-900/40 hover:from-cyan-500/20 hover:to-blue-500/20 backdrop-blur-sm"
            >
              <span className="relative block font-bold text-lg text-white uppercase tracking-wider flex items-center justify-between">
                <span>Continue Career</span>
                <span className="group-hover:translate-x-2 transition-transform duration-300">↓</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-10px); }
          75% { transform: translateY(-20px) translateX(10px); }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        /* Responsive adjustments */
        @media (max-width: 1280px) {
          .text-5xl { font-size: 3rem; }
        }

        @media (max-aspect-ratio: 16/9) {
          .text-5xl { font-size: 2.5rem; }
          .text-2xl { font-size: 1.5rem; }
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
