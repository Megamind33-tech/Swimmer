/**
 * SWIM 26 - Main Menu
 * Simple menu with Play, Settings, and Quit
 */

import React, { useState } from 'react';

interface MainMenuProps {
  onPlay: () => void;
  onSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onPlay, onSettings }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = () => {
    setIsLoading(true);
    onPlay();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black z-[9997] flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-6">
        <div className="mb-16">
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight mb-2">
            SWIM <span className="text-cyan-400">26</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 uppercase tracking-widest">
            Championship Swimming
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handlePlay}
            disabled={isLoading}
            className="group relative px-16 py-5 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:shadow-lg group-hover:shadow-emerald-500/50"></div>
            <span className="relative flex items-center justify-center gap-3 font-bold text-2xl text-white uppercase tracking-wide">
              {isLoading ? (
                <>
                  <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Play'
              )}
            </span>
          </button>

          <button
            onClick={onSettings}
            className="group relative px-16 py-5 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-blue-500/50"></div>
            <span className="relative block font-bold text-2xl text-white uppercase tracking-wide">
              Settings
            </span>
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="group relative px-16 py-5 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600 group-hover:shadow-lg group-hover:shadow-slate-700/50"></div>
            <span className="relative block font-bold text-2xl text-white uppercase tracking-wide">
              Quit
            </span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-slate-500 mt-16">
          Powered by Babylon.js • © 2026 Mosty Games
        </p>
      </div>
    </div>
  );
};

export default MainMenu;
