/**
 * SWIM 26 - Main Menu
 * Players can select play mode and start the game
 */

import React from 'react';

interface MainMenuProps {
  onPlay: (mode: 'p2p' | 'multiplayer' | 'practice') => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onPlay }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black z-[9997] flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-6">
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight mb-2">
            SWIM <span className="text-cyan-400">26</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 uppercase tracking-widest">
            Championship Swimming
          </p>
        </div>

        {/* Menu Options */}
        <div className="flex flex-col gap-4 mb-12">
          <button
            onClick={() => onPlay('p2p')}
            className="group relative px-12 py-4 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
            {/* Content */}
            <span className="relative block font-bold text-lg text-white uppercase tracking-wide">
              Play vs AI
            </span>
          </button>

          <button
            onClick={() => onPlay('practice')}
            className="group relative px-12 py-4 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/50"></div>
            {/* Content */}
            <span className="relative block font-bold text-lg text-white uppercase tracking-wide">
              Practice Mode
            </span>
          </button>

          <button
            onClick={() => onPlay('multiplayer')}
            className="group relative px-12 py-4 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-emerald-500/50"></div>
            {/* Content */}
            <span className="relative block font-bold text-lg text-white uppercase tracking-wide">
              Multiplayer
            </span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-slate-500">
          Powered by Babylon.js • © 2026 Mosty Games
        </p>
      </div>
    </div>
  );
};

export default MainMenu;
