/**
 * Bottom Quick Bar - High-frequency actions
 * Quick Race, Training, Ranked, Locker Room, Replays, Rewards
 */

import React from 'react';

interface BottomQuickBarProps {
  onScreenChange?: (screen: string) => void;
  onQuickRaceClick?: () => void;
  onTrainingClick?: () => void;
  onRankedClick?: () => void;
  onLockerRoomClick?: () => void;
  onReplaysClick?: () => void;
  onRewardsClick?: () => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

export const BottomQuickBar: React.FC<BottomQuickBarProps> = ({
  onScreenChange,
  onQuickRaceClick,
  onTrainingClick,
  onRankedClick,
  onLockerRoomClick,
  onReplaysClick,
  onRewardsClick,
}) => {
  const quickActions: QuickAction[] = [
    {
      id: 'quick-race',
      label: 'Quick Race',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-500',
      onClick: onQuickRaceClick,
    },
    {
      id: 'training',
      label: 'Training',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
      onClick: onTrainingClick,
    },
    {
      id: 'ranked',
      label: 'Ranked',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
      onClick: onRankedClick,
    },
    {
      id: 'locker-room',
      label: 'Locker',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'from-orange-500 to-red-500',
      onClick: onLockerRoomClick,
    },
    {
      id: 'replays',
      label: 'Replays',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M7 12a5 5 0 1110 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-indigo-500 to-purple-500',
      onClick: onReplaysClick,
    },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-yellow-500 to-amber-500',
      onClick: onRewardsClick,
    },
  ];

  return (
    <div className="h-20 bg-gradient-to-t from-slate-800/90 to-slate-900/80 border-t border-slate-700/50 backdrop-blur px-6 flex items-center justify-center gap-3 z-50">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={`group relative px-4 py-3 rounded-lg overflow-hidden transition-all duration-200 hover:scale-110 hover:shadow-lg flex flex-col items-center gap-1 min-w-max`}
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-80 group-hover:opacity-100 transition-opacity`}></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-1">
            <span className="text-white">{action.icon}</span>
            <span className="text-xs font-semibold text-white">{action.label}</span>
          </div>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
        </button>
      ))}
    </div>
  );
};

export default BottomQuickBar;
