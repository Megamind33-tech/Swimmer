/**
 * Top Bar - Premium AAA status and command layer
 * Shows player profile, currencies, inbox, notifications, settings with smooth animations
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
  const [inboxCount] = useState(2);

  return (
    <div className="h-16 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 border-b border-cyan-500/10 backdrop-blur-md px-8 flex items-center justify-between z-50 shadow-lg">
      {/* Left Section: Logo/Branding */}
      <div className="flex items-center gap-8">
        {/* Game Logo/Name */}
        <div className="text-white font-black text-xl tracking-wider hidden sm:flex">
          SWIM <span className="text-cyan-400">26</span>
        </div>

        {/* Profile Button */}
        <button
          onClick={onProfileClick}
          className="flex items-center gap-3 hover:bg-cyan-500/10 px-4 py-2 rounded-lg transition-all duration-300 hover:border border-cyan-500/30 group"
        >
          {playerAvatarUrl ? (
            <img
              src={playerAvatarUrl}
              alt={playerName}
              className="w-10 h-10 rounded-full border-2 border-cyan-400 shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-shadow"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-shadow">
              {playerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-left">
            <div className="text-sm font-bold text-white">{playerName}</div>
            <div className="text-xs text-cyan-400/80">LV {playerLevel}</div>
          </div>
        </button>
      </div>

      {/* Center Section: Currencies */}
      <div className="flex items-center gap-4">
        {/* Soft Currency */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300">
          <div className="w-5 h-5 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
            $
          </div>
          <div className="text-sm font-bold text-amber-300">{softCurrency.toLocaleString()}</div>
        </div>

        {/* Premium Currency */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/10 px-4 py-2 rounded-lg border border-cyan-500/40 hover:border-cyan-500/70 transition-all duration-300">
          <div className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-cyan-500/50">
            ◆
          </div>
          <div className="text-sm font-bold text-cyan-300">{premiumCurrency}</div>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications Bell */}
        <button
          onClick={onNotificationsClick}
          className="relative p-2.5 hover:bg-cyan-500/20 rounded-lg transition-all duration-300 group border border-transparent hover:border-cyan-500/30"
        >
          <svg
            className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {notificationCount > 0 && (
            <div className="absolute top-0 right-0 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-black animate-bounce shadow-lg shadow-red-500/50">
              {notificationCount}
            </div>
          )}
        </button>

        {/* Inbox Mail */}
        <button
          onClick={onInboxClick}
          className="relative p-2.5 hover:bg-emerald-500/20 rounded-lg transition-all duration-300 group border border-transparent hover:border-emerald-500/30"
        >
          <svg
            className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {inboxCount > 0 && (
            <div className="absolute top-0 right-0 w-5 h-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-black animate-bounce shadow-lg shadow-emerald-500/50">
              {inboxCount}
            </div>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="p-2.5 hover:bg-purple-500/20 rounded-lg transition-all duration-300 group border border-transparent hover:border-purple-500/30"
        >
          <svg
            className="w-6 h-6 text-slate-400 group-hover:text-purple-400 transition-colors duration-300 group-hover:rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ transitionDuration: '300ms' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* Connection Status */}
        <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-700/50">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
          <span className="text-xs text-slate-400 font-medium">Online</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden.sm\\:flex {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default TopBar;
