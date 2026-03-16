/**
 * Top Bar - Broadcast HUD Design
 * Sleek translucent glass HUD with neon accents and high-contrast information
 */

import React, { useMemo, useState } from 'react';

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

  const levelProgress = useMemo(() => {
    const remainder = playerLevel % 10;
    return remainder === 0 ? 100 : remainder * 10;
  }, [playerLevel]);

  return (
    <header className="h-20 bg-gradient-to-b from-[#0f1d34]/95 to-[#091427]/95 backdrop-blur-md border-b border-white/15 px-6 flex items-center justify-between z-50 sticky top-0 shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
      {/* Left Section: Logo & Profile */}
      <div className="flex items-center gap-6">
        {/* Game Logo */}
        <div className="flex items-center gap-2 drop-shadow-[0_0_12px_rgba(120,169,255,0.2)]">
          <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            waves
          </span>
          <h1 className="font-headline font-bold text-2xl tracking-tighter uppercase italic text-glow">SWIM26</h1>
        </div>

        {/* Profile Button - Slanted Nameplate */}
        <button
          onClick={onProfileClick}
          className="flex items-center gap-3 hover:bg-white/10 transition-colors px-3 py-2 rounded-full group border border-transparent hover:border-white/15"
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
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {playerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-left hidden sm:block min-w-[150px]">
            <div className="text-base font-black italic text-white leading-tight">{playerName}</div>
            <div className="text-[12px] text-cyan-200 uppercase font-black tracking-wide">Lvl {playerLevel}</div>
            <div className="mt-1.5 h-1.5 rounded-full bg-white/15 border border-cyan-200/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-200 shadow-[0_0_12px_rgba(45,212,191,0.85)] animate-pulse"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </button>
      </div>

      {/* Center Section: Level & Currencies HUD */}
      <div className="flex items-center gap-4">
        {/* Level Display - Centered */}
        <div className="relative px-6 py-2 glass-card rounded-xl border border-neon-cyan/25 group hover:border-neon-cyan/40 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-neon-cyan/5">
          <div className="text-center">
            <div className="text-[10px] font-barlow font-bold text-white uppercase tracking-wider">Rank</div>
            <div className="text-lg font-mono-timer text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
              #{((playerLevel * 42) % 1000).toString().padStart(3, '0')}
            </div>
          </div>
        </div>

        {/* Gold Currency - High Contrast */}
        <div className="relative px-5 py-2 rounded-xl border border-yellow-500/40 bg-yellow-500/8 group hover:border-yellow-400/60 hover:bg-yellow-500/15 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-yellow-500/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-yellow-400 text-lg drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">
              coin
            </span>
            <div>
              <div className="text-[8px] font-barlow font-bold text-yellow-300 uppercase tracking-wider">Gold</div>
              <div className="text-sm font-mono-timer text-yellow-200 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]">
                {softCurrency.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Currency - Neon Cyan */}
        <div className="relative px-5 py-2 rounded-xl border border-neon-cyan/40 bg-neon-cyan/8 group hover:border-neon-cyan/60 hover:bg-neon-cyan/15 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-neon-cyan/10 hover:shadow-lg hover:shadow-neon-cyan/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neon-cyan text-lg drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">
              star
            </span>
            <div>
              <div className="text-[8px] font-barlow font-bold text-neon-cyan uppercase tracking-wider">SP</div>
              <div className="text-sm font-mono-timer text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
                {premiumCurrency}
              </div>
            </div>
          </div>
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

        {/* Connection Status */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/20">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-[10px] text-white font-bold">ONLINE</span>
        </div>

        {isNotificationsOpen && (
          <div className="absolute right-0 top-14 w-96 max-[900px]:w-72 rounded-2xl glass-card border border-neon-cyan/25 shadow-[0_20px_60px_rgba(0,255,255,0.15)] p-4 z-[60] backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black font-din italic-header uppercase tracking-wider text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">
                Notifications
              </span>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="text-[10px] px-3 py-1 rounded-lg border border-neon-cyan/25 text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all duration-300 backdrop-blur-sm"
              >
                Collapse
              </button>
            </div>
            <div className="space-y-1.5">
              {notificationItems.map((item) => (
                <div
                  key={item}
                  className="text-[11px] text-white/85 bg-neon-cyan/8 border border-neon-cyan/15 rounded-lg px-3 py-2 hover:border-neon-cyan/35 transition-all duration-300 backdrop-blur-sm"
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
