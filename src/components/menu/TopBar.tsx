/**
 * Top Bar - Status and command layer
 * Shows player profile, currencies, inbox, notifications, settings
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
  const [notificationCount, setNotificationCount] = useState(3);
  const [inboxCount, setInboxCount] = useState(2);

  return (
    <div className="h-16 bg-gradient-to-r from-slate-800/80 to-slate-900/80 border-b border-slate-700/50 backdrop-blur px-6 flex items-center justify-between z-50">
      {/* Left Section: Profile */}
      <div className="flex items-center gap-4">
        <button
          onClick={onProfileClick}
          className="flex items-center gap-3 hover:bg-slate-700/50 px-3 py-2 rounded-lg transition-colors"
        >
          {playerAvatarUrl ? (
            <img
              src={playerAvatarUrl}
              alt={playerName}
              className="w-10 h-10 rounded-full border-2 border-cyan-400"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
              {playerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-left">
            <div className="text-sm font-bold text-white">{playerName}</div>
            <div className="text-xs text-cyan-400">Level {playerLevel}</div>
          </div>
        </button>
      </div>

      {/* Center Section: Currencies */}
      <div className="flex items-center gap-6">
        {/* Soft Currency */}
        <div className="flex items-center gap-2 bg-slate-700/30 px-4 py-2 rounded-lg border border-slate-600/30">
          <div className="w-5 h-5 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            $
          </div>
          <div className="text-sm font-bold text-white">{softCurrency.toLocaleString()}</div>
        </div>

        {/* Premium Currency */}
        <div className="flex items-center gap-2 bg-slate-700/30 px-4 py-2 rounded-lg border border-cyan-500/30">
          <div className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            ◆
          </div>
          <div className="text-sm font-bold text-cyan-400">{premiumCurrency}</div>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Bell */}
        <button
          onClick={onNotificationsClick}
          className="relative p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6 text-slate-300 hover:text-white transition-colors"
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
            <div className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {notificationCount}
            </div>
          )}
        </button>

        {/* Inbox Mail */}
        <button
          onClick={onInboxClick}
          className="relative p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6 text-slate-300 hover:text-white transition-colors"
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
            <div className="absolute top-1 right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {inboxCount}
            </div>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6 text-slate-300 hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-slate-400">Online</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
