/**
 * Top Bar - SWIM 26 Material Design 3
 * Shows player profile, currencies with new dark theme design
 */

import React, { useState } from 'react';

interface TopBarProps {
  playerLevel: number;
  playerName: string;
  softCurrency: number;
  premiumCurrency: number;
  playerAvatarUrl?: string;
  onProfileClick?: () => void;
  onInboxClick?: () => void;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  playerLevel,
  playerName,
  softCurrency,
  premiumCurrency,
  playerAvatarUrl,
  onProfileClick,
  onInboxClick,
  onSettingsClick,
  onNotificationsClick,
}) => {
  const [notificationCount] = useState(3);

  return (
    <header className="h-14 max-[900px]:h-10 bg-black/70 backdrop-blur-md border-b border-white/10 px-3 max-[900px]:px-1.5 flex items-center justify-between z-50 sticky top-0">
      {/* Left Section: Logo & Profile */}
      <div className="flex items-center gap-1.5 max-[900px]:gap-1">
        {/* Game Logo */}
        <div className="flex items-center gap-2 max-[900px]:gap-0">
          <span className="material-symbols-outlined text-white text-2xl max-[900px]:text-xl" style={{fontVariationSettings: "'FILL' 1"}}>
            waves
          </span>
          <h1 className="font-headline font-bold text-xl max-[900px]:text-sm tracking-tighter uppercase italic text-glow">SWIM26</h1>
        </div>

        {/* Profile Button */}
        <button
          onClick={onProfileClick}
          className="flex items-center gap-2 hover:bg-surface-container-high transition-colors px-1.5 py-1 rounded-full group"
        >
          {playerAvatarUrl ? (
            <img
              src={playerAvatarUrl}
              alt={playerName}
              className="w-10 h-10 rounded-full border-2 border-primary group-hover:border-primary-fixed"
            />
          ) : (
            <div className="w-10 h-10 max-[900px]:w-8 max-[900px]:h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {playerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-on-surface">{playerName}</div>
            <div className="text-[10px] text-primary uppercase font-bold">Lvl {playerLevel}</div>
          </div>
        </button>
      </div>

      {/* Center Section: Currencies */}
      <div className="flex items-center gap-1.5 max-[900px]:gap-1">
        {/* Gold Currency */}
        <div className="bg-black/55 px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
          <span className="text-[10px] font-bold text-white/60 max-[900px]:hidden">Gold</span>
          <span className="font-headline font-bold text-on-surface">{softCurrency.toLocaleString()}</span>
        </div>

        {/* Premium Currency (SP) */}
        <div className="bg-black/55 px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
          <span className="text-[10px] font-bold text-white/60 max-[900px]:hidden">SP</span>
          <span className="font-headline font-bold text-primary-fixed">{premiumCurrency}</span>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-0.5">
        {/* Notifications Bell */}
        <button
          onClick={onNotificationsClick}
          className="relative p-1.5 max-[900px]:p-1 hover:bg-white/10 rounded-full transition-colors group"
        >
          <span className="material-symbols-outlined text-white group-hover:text-white transition-colors">
            notifications
          </span>
          {notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center text-white text-xs font-bold">
              {notificationCount}
            </div>
          )}
        </button>

        {/* Inbox */}
        <button
          onClick={onInboxClick}
          className="relative p-1.5 max-[900px]:p-1 hover:bg-white/10 rounded-full transition-colors group"
        >
          <span className="material-symbols-outlined text-white group-hover:text-white transition-colors">
            mail
          </span>
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="p-1.5 max-[900px]:p-1 hover:bg-white/10 rounded-full transition-colors group"
        >
          <span className="material-symbols-outlined text-white group-hover:text-white transition-colors group-hover:rotate-90 duration-300">
            settings
          </span>
        </button>

        {/* Connection Status */}
        <div className="hidden md:flex items-center gap-2 ml-1 pl-1 border-l border-white/10">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-[10px] text-on-surface-variant font-bold">ONLINE</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
