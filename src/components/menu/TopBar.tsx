/**
 * Top Bar - Broadcast HUD Design
 * Sleek translucent glass HUD with neon accents and high-contrast information
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
    <header className="h-16 bg-broadcast-overlay/90 backdrop-blur-xl border-b border-neon-cyan/20 px-6 flex items-center justify-between z-50 sticky top-0 shadow-[0_8px_40px_rgba(0,255,255,0.15)] safe-zone-x">
      {/* Left Section: Profile with Slanted Nameplate */}
      <div className="flex items-center gap-4">
        {/* Game Logo */}
        <div className="flex items-center gap-2 drop-shadow-[0_0_16px_rgba(0,255,255,0.3)]">
          <span className="material-symbols-outlined text-neon-cyan text-3xl animate-live-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
            waves
          </span>
          <h1 className="font-din font-bold text-2xl tracking-tighter uppercase italic text-neon-cyan drop-shadow-[0_0_12px_rgba(0,255,255,0.5)]">
            SWIM26
          </h1>
        </div>

        {/* Profile Button - Slanted Nameplate */}
        <button
          onClick={onProfileClick}
          className="relative group flex items-center gap-3 px-4 py-2 transition-all duration-300 skew-12-reverse"
        >
          {/* Slanted glass background */}
          <div className="absolute inset-0 glass-card-elevated rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>

          {/* Avatar */}
          {playerAvatarUrl ? (
            <img
              src={playerAvatarUrl}
              alt={playerName}
              className="w-10 h-10 rounded-lg border-2 border-neon-cyan group-hover:border-neon-cyan group-hover:shadow-[0_0_12px_rgba(0,255,255,0.6)]"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/40 to-neon-cyan/20 flex items-center justify-center text-neon-cyan font-bold text-sm border border-neon-cyan/50">
              {playerName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Profile Info */}
          <div className="text-left hidden sm:block relative z-10">
            <div className="text-xs font-bold font-barlow text-white uppercase tracking-wider">{playerName}</div>
            <div className="text-[9px] text-neon-cyan font-bold uppercase tracking-wider drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]">
              LVL {playerLevel}
            </div>
          </div>
        </button>
      </div>

      {/* Center Section: Level & Currencies HUD */}
      <div className="flex items-center gap-4">
        {/* Level Display - Centered */}
        <div className="relative px-6 py-2 glass-card-elevated rounded-xl border border-neon-cyan/30 group hover:border-neon-cyan transition-all duration-300">
          <div className="text-center">
            <div className="text-[10px] font-barlow font-bold text-white uppercase tracking-wider">Rank</div>
            <div className="text-lg font-din font-bold text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]">
              #{(playerLevel * 42) % 1000}
            </div>
          </div>
        </div>

        {/* Gold Currency - High Contrast */}
        <div className="relative px-5 py-2 rounded-lg border-2 border-yellow-500/60 bg-yellow-500/10 group hover:border-yellow-400 hover:bg-yellow-500/20 transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-yellow-400 text-lg drop-shadow-[0_0_8px_rgba(250,200,0,0.6)]">
              coin
            </span>
            <div>
              <div className="text-[8px] font-barlow font-bold text-yellow-300 uppercase tracking-wider">Gold</div>
              <div className="text-sm font-din font-bold text-yellow-100">
                {softCurrency.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Currency - Neon Cyan */}
        <div className="relative px-5 py-2 rounded-lg neon-stroke-active group hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neon-cyan text-lg drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
              star
            </span>
            <div>
              <div className="text-[8px] font-barlow font-bold text-neon-cyan uppercase tracking-wider">SP</div>
              <div className="text-sm font-din font-bold text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]">
                {premiumCurrency}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Status & Actions */}
      <div className="relative flex items-center gap-3">
        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/40">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-live-pulse"></div>
          <span className="text-[10px] font-bold font-barlow text-red-400 uppercase tracking-wider">LIVE</span>
        </div>

        {/* Notifications */}
        <button
          onClick={() => {
            setIsNotificationsOpen((prev) => !prev);
            onNotificationsClick?.();
          }}
          className="relative p-2 hover:bg-neon-cyan/10 rounded-lg transition-all duration-300 group border border-transparent hover:border-neon-cyan/30"
        >
          <span className="material-symbols-outlined text-white group-hover:text-neon-cyan transition-colors drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">
            notifications
          </span>
          {notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-[0_0_8px_rgba(255,0,0,0.6)]">
              {notificationCount}
            </div>
          )}
        </button>

        {/* Inbox */}
        <button
          onClick={onInboxClick}
          className="p-2 hover:bg-neon-cyan/10 rounded-lg transition-all duration-300 group border border-transparent hover:border-neon-cyan/30"
        >
          <span className="material-symbols-outlined text-white group-hover:text-neon-cyan transition-colors drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">
            mail
          </span>
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="p-2 hover:bg-neon-cyan/10 rounded-lg transition-all duration-300 group border border-transparent hover:border-neon-cyan/30"
        >
          <span className="material-symbols-outlined text-white group-hover:text-neon-cyan transition-colors group-hover:rotate-90 duration-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">
            settings
          </span>
        </button>

        {isNotificationsOpen && (
          <div className="absolute right-0 top-14 w-96 max-[900px]:w-72 rounded-xl glass-card-elevated border border-neon-cyan/20 shadow-[0_20px_60px_rgba(0,255,255,0.2)] p-4 z-[60]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black font-din uppercase tracking-wider text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
                Notifications
              </span>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="text-[10px] px-3 py-1 rounded border border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300"
              >
                Collapse
              </button>
            </div>
            <div className="space-y-2">
              {notificationItems.map((item) => (
                <div
                  key={item}
                  className="text-[11px] text-white/90 bg-neon-cyan/10 border border-neon-cyan/20 rounded-lg px-3 py-2 hover:border-neon-cyan/50 transition-all duration-300"
                >
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
