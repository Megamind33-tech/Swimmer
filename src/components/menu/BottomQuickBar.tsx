/**
 * Power Hub - Game-Focused Bottom-Right Action Cluster
 * Primary action buttons with magnetic effects and broadcast aesthetic
 */

import React from 'react';
import type { MenuScreen } from './GlobalMenuLayout';
import { GameIcon } from '../../ui/GameIcon';
import splashActionImage from '../../designs/doh9161_copy.width_800.jpg/screen.png';
import raceActionImage from '../../designs/race_gameplay_interface/screen.png';
import championshipActionImage from '../../designs/national_championships/screen.png';
import trainingActionImage from '../../designs/training_center/screen.png';

interface BottomQuickBarProps {
  onScreenChange?: (screen: string) => void;
  onQuickRaceClick?: () => void;
  onTrainingClick?: () => void;
  onRankedClick?: () => void;
  onLockerRoomClick?: () => void;
  onReplaysClick?: () => void;
  onRewardsClick?: () => void;
}

interface PrimaryAction {
  id: string;
  label: string;
  icon: string;
  image: string;
  overlayClass: string;
  onClick?: () => void;
  route?: string;
}

export const BottomQuickBar: React.FC<BottomQuickBarProps> = (props) => {
  const { onScreenChange } = props;
  const defaultActionRoute: Record<string, MenuScreen> = {
    'quick-race': 'PLAY',
    training: 'CAREER',
    ranked: 'PLAY',
    'locker-room': 'SWIMMER',
    replays: 'LIVE_EVENTS',
    rewards: 'STORE',
  };

  const quickActions: PrimaryAction[] = [
    {
      id: 'quick-race',
      label: 'Quick Race',
      icon: 'sports_score',
      image: raceActionImage,
      overlayClass: 'from-cyan-500/65 via-blue-600/40 to-slate-900/80',
      onClick: props.onQuickRaceClick,
    },
    {
      id: 'training',
      label: 'Training',
      icon: 'fitness_center',
      image: trainingActionImage,
      overlayClass: 'from-orange-500/70 via-amber-500/45 to-slate-900/80',
      onClick: props.onTrainingClick,
    },
    {
      id: 'ranked',
      label: 'Ranked',
      icon: 'leaderboard',
      image: championshipActionImage,
      overlayClass: 'from-sky-400/75 via-blue-500/45 to-slate-900/80',
      onClick: props.onRankedClick,
    },
    {
      id: 'locker-room',
      label: 'Locker',
      icon: 'checkroom',
      image: splashActionImage,
      overlayClass: 'from-violet-500/65 via-purple-600/45 to-slate-900/80',
      onClick: props.onLockerRoomClick,
    },
    {
      id: 'replays',
      label: 'Replays',
      icon: 'replay',
      image: raceActionImage,
      overlayClass: 'from-emerald-500/65 via-teal-500/45 to-slate-900/80',
      onClick: props.onReplaysClick,
    },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: 'card_giftcard',
      image: championshipActionImage,
      overlayClass: 'from-pink-500/65 via-fuchsia-500/45 to-slate-900/80',
      onClick: props.onRewardsClick,
    },
  ];

  return (
    <nav className="menu-bottom-bar h-24 bg-surface/60 backdrop-blur-3xl border-t border-white/5 px-6 flex items-center justify-center gap-4 z-40 font-headline overflow-hidden">
      {/* Structural Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="menu-bottom-actions relative z-10 flex w-full items-center justify-center gap-4 overflow-x-auto overflow-y-hidden pb-1">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => {
              action.onClick?.();
              if (!action.onClick && onScreenChange) {
                onScreenChange(defaultActionRoute[action.id]);
              }
            }}
            className="group relative h-16 flex-1 min-w-[120px] max-w-[200px] overflow-hidden -skew-x-12 border border-white/10 hover:border-primary/40 transition-all duration-500 hover:scale-105 active:scale-95 group"
          >
          {/* Action Image & Gradient HUD */}
          <div className="absolute inset-0 skew-x-12 scale-125 group-hover:scale-110 transition-transform duration-700">
             <img src={action.image} alt={action.label} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500" />
          </div>
          <div className={`absolute inset-0 bg-gradient-to-br ${action.overlayClass} opacity-60 group-hover:opacity-40 transition-opacity`} />
          
          {/* Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />

          {/* Label Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 skew-x-12 z-20">
             <GameIcon name={action.icon} size={24} className="text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] group-hover:text-glow transition-all" />
             <span className="text-[10px] font-black italic slanted uppercase tracking-[0.2em] text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
                {action.label}
             </span>
          </div>

          {/* Luminous Interaction State */}
          <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_15px_rgba(129,236,255,1)]" />
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomQuickBar;
