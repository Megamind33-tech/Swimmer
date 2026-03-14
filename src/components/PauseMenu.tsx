/**
 * SWIM 26 - Pause Menu
 * Pause, resume, or return to main menu during gameplay
 */

import React from 'react';

interface PauseMenuProps {
  onResume: () => void;
  onMainMenu: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onMainMenu }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] flex items-center justify-center">
      {/* Content */}
      <div className="text-center">
        <h1 className="text-6xl font-black text-white mb-12 tracking-tight">
          PAUSED
        </h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={onResume}
            className="group relative px-16 py-5 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:shadow-lg group-hover:shadow-emerald-500/50"></div>
            <span className="relative block font-bold text-2xl text-white uppercase tracking-wide">
              Resume
            </span>
          </button>

          <button
            onClick={onMainMenu}
            className="group relative px-16 py-5 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-blue-500/50"></div>
            <span className="relative block font-bold text-2xl text-white uppercase tracking-wide">
              Main Menu
            </span>
          </button>
        </div>

        <p className="text-slate-400 text-sm mt-8">Press P or ESC to resume</p>
      </div>
    </div>
  );
};

export default PauseMenu;
