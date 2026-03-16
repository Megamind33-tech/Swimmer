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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notificationItems = [
    'League finals registration closes in 2h',
    'Your rival challenged you to a sprint rematch',
    'Daily reward crate is ready to claim',
  ];

  return (
    <header className="h-16 bg-gradient-to-b from-[#0f1d34]/95 to-[#091427]/95 backdrop-blur-md border-b border-white/15 px-6 flex items-center justify-between z-50 sticky top-0 shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
      {/* Left Section: Logo & Profile */}
      <div className="flex items-center gap-6">
        {/* Game Logo */}
        <div className="flex items-center gap-2 drop-shadow-[0_0_12px_rgba(120,169,255,0.2)]">
          <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            waves
          </span>
          <h1 className="font-headline font-bold text-2xl tracking-tighter uppercase italic text-glow">SWIM26</h1>
        </div>

        {/* Profile Button */}
        <button
          onClick={onProfileClick}
          className="flex items-center gap-3 hover:bg-white/10 transition-colors px-3 py-2 rounded-full group border border-transparent hover:border-white/15"
        >
          {playerAvatarUrl ? (
            <img
              src={playerAvatarUrl}
              alt={playerName}
              className="w-10 h-10 rounded-full border-2 border-primary group-hover:border-primary-fixed"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {playerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-white">{playerName}</div>
            <div className="text-[10px] text-white uppercase font-bold">Lvl {playerLevel}</div>
          </div>
        </button>
      </div>

      {/* Center Section: Currencies */}
      <div className="flex items-center gap-3">
        {/* Gold Currency */}
        <div className="bg-[#050b17]/80 px-4 py-1 rounded-full flex items-center gap-2 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="text-xs font-bold text-white">Gold</span>
          <span className="font-headline font-bold text-white">{softCurrency.toLocaleString()}</span>
        </div>

        {/* Premium Currency (SP) */}
        <div className="bg-[#050b17]/80 px-4 py-1 rounded-full flex items-center gap-2 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="text-xs font-bold text-white">SP</span>
          <span className="font-headline font-bold text-white">{premiumCurrency}</span>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="relative flex items-center gap-2">
        {/* Notifications Bell */}
        <button
          onClick={() => {
            setIsNotificationsOpen((prev) => !prev);
            onNotificationsClick?.();
          }}
          className="relative p-2 hover:bg-white/10 rounded-full transition-colors group"
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
          className="relative p-2 hover:bg-white/10 rounded-full transition-colors group"
        >
          <span className="material-symbols-outlined text-white group-hover:text-white transition-colors">
            mail
          </span>
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="p-2 hover:bg-white/10 rounded-full transition-colors group"
        >
          <span className="material-symbols-outlined text-white group-hover:text-white transition-colors group-hover:rotate-90 duration-300">
            settings
          </span>
        </button>

        {/* Connection Status */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/20">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-[10px] text-white font-bold">ONLINE</span>
        </div>

        {isNotificationsOpen && (
          <div className="absolute right-0 top-14 w-80 max-[900px]:w-64 rounded-lg border border-white/20 bg-[#081326]/95 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.45)] p-3 z-[60]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wide text-cyan-200">Notifications</span>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="text-[10px] px-2 py-1 rounded border border-white/25 text-white hover:bg-white/10"
              >
                Collapse
              </button>
            </div>
            <div className="space-y-1.5">
              {notificationItems.map((item) => (
                <div key={item} className="text-[11px] text-white/90 bg-white/5 border border-white/10 rounded px-2 py-1.5">
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
