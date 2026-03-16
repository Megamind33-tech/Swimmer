/**
 * Top Bar - SWIM 26 Material Design 3
 * Shows player profile, currencies with new dark theme design
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

      {/* Center Section: Currencies */}
      <div className="flex items-center gap-3">
        {/* Gold Currency */}
        <div className="relative overflow-hidden px-4 py-2 rounded-xl border border-amber-300/35 bg-gradient-to-br from-[#2b2414]/85 via-[#1b1a17]/88 to-[#1a1410]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_8px_16px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.06)_0_2px,transparent_2px_8px)] opacity-25" />
          <div className="relative flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-300 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            <div className="leading-tight">
              <div className="text-[10px] font-bold text-amber-200 uppercase">Gold</div>
              <div className="font-black italic text-2xl tracking-tight text-white">{softCurrency.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Premium Currency (SP) */}
        <div className="relative overflow-hidden px-4 py-2 rounded-xl border border-cyan-300/35 bg-gradient-to-br from-[#122634]/88 via-[#0f1a27]/88 to-[#101927]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_8px_16px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.05)_0_2px,transparent_2px_9px)] opacity-25" />
          <div className="relative flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-200 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            <div className="leading-tight">
              <div className="text-[10px] font-bold text-cyan-100 uppercase">SP</div>
              <div className="font-black italic text-2xl tracking-tight text-white">{premiumCurrency}</div>
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
