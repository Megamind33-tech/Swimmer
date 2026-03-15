/**
 * Home Screen - Main menu hub
 * Center hero panel with featured swimmer, season banner, main CTA button
 * Right panel with stat line, daily objectives, season pass, etc.
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
  const [selectedStroke, setSelectedStroke] = useState<string>('FREESTYLE');

  // Sample stat line data
  const statLineData = {
    currentRank: '#1,234',
    personalBest: '00:51.23',
    winStreak: 7,
    worldRanking: '#12,450',
    clubRanking: '#1',
    favoredStroke: 'FREESTYLE',
  };

  // Sample daily objectives
  const dailyObjectives = [
    { id: 1, name: 'Complete 2 sprint races', progress: 1, total: 2, completed: false },
    { id: 2, name: 'Perform 3 perfect turns', progress: 2, total: 3, completed: false },
    { id: 3, name: 'Train endurance once', progress: 0, total: 1, completed: false },
    { id: 4, name: 'Beat one rival ghost', progress: 0, total: 1, completed: false },
  ];

  // Sample active events
  const activeEvents = [
    { name: 'World Sprint Cup', timeLeft: '05:14:22', reward: '500 XP' },
    { name: 'Butterfly Challenge', timeLeft: '2d 14h', reward: '1000 Coins' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Hero Panel */}
      <div className="relative z-10 max-w-2xl w-full space-y-8">
        {/* Season Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 shadow-2xl shadow-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white mb-2">CHAMPIONSHIP SEASON 7</h2>
              <p className="text-purple-100">National trials finals - 2 races left before qualification</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-100">Season Ends In</div>
              <div className="text-3xl font-black text-white">12d 5h</div>
            </div>
          </div>
        </div>

        {/* Featured Swimmer Card */}
        <div className="bg-gradient-to-b from-slate-700/80 to-slate-800/80 rounded-lg overflow-hidden border border-slate-600/50 shadow-2xl">
          {/* 3D Swimmer Placeholder */}
          <div className="w-full h-64 bg-gradient-to-b from-slate-600 to-slate-700 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-6xl font-black">
                {player?.name.charAt(0).toUpperCase() || 'A'}
              </div>
              <p className="text-slate-300 text-sm">3D Swimmer Animation</p>
              <p className="text-slate-400 text-xs">Babylon.js Scene</p>
            </div>
          </div>

          {/* Swimmer Info */}
          <div className="p-6 space-y-4">
            <div>
              <h1 className="text-3xl font-black text-white mb-1">{player?.name || 'Elite Athlete'}</h1>
              <p className="text-cyan-400 font-bold">Level {player?.level || 1} • Freestyle Specialist</p>
            </div>

            {/* Stroke Selection */}
            <div className="grid grid-cols-4 gap-2">
              {['FREESTYLE', 'BUTTERFLY', 'BREASTSTROKE', 'BACKSTROKE'].map((stroke) => (
                <button
                  key={stroke}
                  onClick={() => setSelectedStroke(stroke)}
                  className={`px-3 py-2 rounded text-xs font-bold uppercase transition-all ${
                    selectedStroke === stroke
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                      : 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/50'
                  }`}
                >
                  {stroke.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main CTA Button */}
        <div className="space-y-3">
          <button
            onClick={onPlayClick}
            className="w-full group relative px-8 py-6 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:shadow-2xl group-hover:shadow-emerald-500/50 transition-all"></div>
            <span className="relative block font-black text-2xl text-white uppercase tracking-wider">
              RACE NOW
            </span>
            <span className="relative block text-sm text-emerald-100 mt-1">Enter Championship • 2 races left</span>
          </button>

          <button
            onClick={onCareerClick}
            className="w-full group relative px-8 py-4 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50"
          >
            <span className="relative block font-bold text-lg text-white uppercase tracking-wide">
              Continue Career
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Right Utility Panel for Home Screen
 */
export const HomeRightPanel: React.FC = () => {
  const statLineData = {
    currentRank: '#1,234',
    personalBest: '00:51.23',
    winStreak: 7,
    worldRanking: '#12,450',
    clubRanking: '#1',
    favoredStroke: 'FREESTYLE',
  };

  const dailyObjectives = [
    { id: 1, name: 'Sprint races', progress: 1, total: 2 },
    { id: 2, name: 'Perfect turns', progress: 2, total: 3 },
    { id: 3, name: 'Endurance train', progress: 0, total: 1 },
    { id: 4, name: 'Rival ghost', progress: 0, total: 1 },
  ];

  const activeEvents = [
    { name: 'Sprint Cup', timer: '05:14:22' },
    { name: 'Butterfly', timer: '2d 14h' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Line */}
      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
        <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-3">Stat Line</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Global Rank</span>
            <span className="font-bold text-white">{statLineData.worldRanking}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Personal Best</span>
            <span className="font-bold text-cyan-400">{statLineData.personalBest}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Win Streak</span>
            <span className="font-bold text-emerald-400">{statLineData.winStreak}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Favored Stroke</span>
            <span className="font-bold text-white">{statLineData.favoredStroke}</span>
          </div>
        </div>
      </div>

      {/* Daily Objectives */}
      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
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
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${(obj.progress / obj.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Event Countdowns */}
      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
        <h3 className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-3">Active Events</h3>
        <div className="space-y-2">
          {activeEvents.map((event, idx) => (
            <div key={idx} className="bg-slate-600/30 rounded p-2 text-xs">
              <div className="font-bold text-white">{event.name}</div>
              <div className="text-yellow-400 font-mono text-xs">{event.timer}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Season Pass Progress */}
      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
        <h3 className="text-xs font-black text-blue-400 uppercase tracking-wider mb-3">Season Pass</h3>
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-300">Tier 28 / 50</span>
            <span className="text-blue-400 font-bold">56%</span>
          </div>
          <div className="w-full bg-slate-600/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
              style={{ width: '56%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Sponsor Objective */}
      <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-lg p-4 border border-amber-500/30">
        <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2">Sponsor Mission</h3>
        <p className="text-xs text-slate-300 mb-2">Win 3 butterfly events to unlock exclusive gear</p>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Progress:</span>
          <span className="font-bold text-amber-400">1 / 3</span>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
