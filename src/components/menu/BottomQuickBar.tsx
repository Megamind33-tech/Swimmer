/**
 * Bottom Quick Bar - SWIM 26 Material Design 3
 * Quick access to game modes and features
 */

import React from 'react';
import type { MenuScreen } from './GlobalMenuLayout';
import splashActionImage from '../../designs/doh9161_copy.width_800.jpg/screen.png';
import raceActionImage from '../../designs/race_gameplay_interface/screen.png';
import championshipActionImage from '../../designs/national_championships/screen.png';
import trainingActionImage from '../../designs/training_center/screen.png';

interface BottomQuickBarProps {
  onScreenChange?: (screen: MenuScreen) => void;
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
  icon: string;
  image: string;
  overlayClass: string;
  onClick?: () => void;
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

  const quickActions: QuickAction[] = [
    {
      id: 'quick-race',
      label: 'Quick Race',
      icon: 'play_arrow',
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
    <nav className="h-20 min-h-20 shrink-0 bg-gradient-to-t from-[#070f1f]/98 to-[#0a162b]/98 backdrop-blur-md border-t-2 border-white/20 px-3 max-[900px]:px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-2 flex items-center justify-center gap-2 sticky bottom-0 z-[70] shadow-[0_-10px_24px_rgba(0,0,0,0.45)] skew-x-[-6deg] max-[900px]:overflow-x-auto max-[900px]:justify-start">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() => {
            action.onClick?.();
            if (!action.onClick && onScreenChange) {
              onScreenChange(defaultActionRoute[action.id]);
            }
          }}
          className="group relative overflow-hidden flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg h-14 min-h-[44px] min-w-[74px] skew-x-[6deg] flex-1 max-[900px]:flex-none max-[900px]:w-[92px] border border-white/20 transition-all duration-300 hover:scale-[1.05] hover:brightness-125"
        >
          <img src={action.image} alt={`${action.label} action`} className="absolute inset-0 h-full w-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-br ${action.overlayClass}`} />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(-20deg,rgba(255,255,255,0.12)_0_2px,transparent_2px_10px)] opacity-20 group-hover:opacity-30" />

          <span className="relative material-symbols-outlined text-white group-hover:text-white transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
            {action.icon}
          </span>
          <span className="relative text-[10px] font-bold text-white group-hover:text-white transition-colors uppercase tracking-tighter drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
            {action.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomQuickBar;
