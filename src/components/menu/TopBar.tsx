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
    <header className="h-16 bg-surface-container/80 backdrop-blur-md border-b border-outline-variant/20 px-6 flex items-center justify-between z-50 sticky top-0">
      {/* Left Section: Logo & Profile */}
      <div className="flex items-center gap-6">
        {/* Game Logo */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>
            waves
          </span>
          <h1 className="font-headline font-bold text-2xl tracking-tighter uppercase italic text-glow">SWIM26</h1>
        </div>

        {/* Profile Button */}
        <button
          onClick={onProfileClick}
          className="flex items-center gap-3 hover:bg-surface-container-high transition-colors px-3 py-2 rounded-full group"
        >
          {playerAvatarUrl ? (
            <img
              src={playerAvatarUrl}
              alt={playerName}
              className="w-10 h-10 rounded-full border-2 border-primary group-hover:border-primary-fixed"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
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
      <div className="flex items-center gap-3">
        {/* Gold Currency */}
        <div className="bg-surface-container-highest/60 px-4 py-1 rounded-full flex items-center gap-2 border border-outline-variant/30">
          <span className="text-xs font-bold text-on-surface-variant">Gold</span>
          <span className="font-headline font-bold text-on-surface">{softCurrency.toLocaleString()}</span>
        </div>

        {/* Premium Currency (SP) */}
        <div className="bg-surface-container-highest/60 px-4 py-1 rounded-full flex items-center gap-2 border border-outline-variant/30">
          <span className="text-xs font-bold text-on-surface-variant">SP</span>
          <span className="font-headline font-bold text-primary">{premiumCurrency}</span>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications Bell */}
        <button
          onClick={onNotificationsClick}
          className="relative p-2 hover:bg-surface-container-high rounded-full transition-colors group"
        >
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
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
          className="relative p-2 hover:bg-surface-container-high rounded-full transition-colors group"
        >
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
            mail
          </span>
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="p-2 hover:bg-surface-container-high rounded-full transition-colors group"
        >
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors group-hover:rotate-90 duration-300">
            settings
          </span>
        </button>

        {/* Connection Status */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-outline-variant/30">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
          <span className="text-[10px] text-on-surface-variant font-bold">ONLINE</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
