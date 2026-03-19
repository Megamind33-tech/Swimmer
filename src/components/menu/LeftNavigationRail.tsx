/**
 * Left Navigation Rail - Game-Focused Vertical Tab Bar
 * Oversized icons with neon cyan active states and broadcast aesthetic
 */

import React, { useState } from 'react';
import { MenuScreen } from './GlobalMenuLayout';
import { GameIcon } from '../../ui/GameIcon';

interface LeftNavigationRailProps {
  currentScreen: MenuScreen;
  onScreenChange: (screen: MenuScreen) => void;
}

interface NavItem {
  id: MenuScreen;
  label: string;
  icon: string;
}

const NavItems: NavItem[] = [
  { id: 'HOME', label: 'Home', icon: 'home' },
  { id: 'PLAY', label: 'Play', icon: 'play_arrow' },
  { id: 'CAREER', label: 'Career', icon: 'emoji_events' },
  { id: 'SWIMMER', label: 'Profile', icon: 'person' },
  { id: 'CLUB', label: 'Club', icon: 'groups' },
  { id: 'LIVE_EVENTS', label: 'Events', icon: 'public' },
  { id: 'SOCIAL', label: 'Social', icon: 'chat' },
  { id: 'STORE', label: 'Store', icon: 'shopping_bag' },
];

export const LeftNavigationRail: React.FC<LeftNavigationRailProps> = ({
  currentScreen,
  onScreenChange,
}) => {
  const [hoveredItem, setHoveredItem] = useState<MenuScreen | null>(null);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, itemId: MenuScreen) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / rect.height;
    const y = (e.clientX - rect.left - rect.width / 2) / rect.width;
    setTiltX(x * 8);
    setTiltY(y * 8);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setTiltX(0);
    setTiltY(0);
  };

  return (
    <nav className="menu-left-rail relative w-28 bg-surface/40 backdrop-blur-3xl border-r border-white/5 flex flex-col items-center py-10 gap-3 sticky left-0 top-24 self-start h-[calc(100dvh-6rem)] z-20 font-headline overflow-hidden">
      {/* Decorative Navigation Line */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary via-transparent to-transparent opacity-20" />
      <div className="menu-left-rail-scroll flex w-full min-h-0 flex-1 flex-col items-center gap-3 overflow-y-auto overflow-x-hidden px-2 pb-6">
        {NavItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`relative w-20 h-20 flex flex-col items-center justify-center gap-1 transition-all duration-500 group ${
                isActive
                  ? 'text-primary scale-110'
                  : 'text-on-surface-variant hover:text-on-surface hover:scale-105'
              } active:scale-95`}
            >
              {/* Vector Active Indicator */}
              {isActive && (
                <>
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rotate-45 border-l-4 border-t-4 border-primary shadow-[-5px_-5px_20px_rgba(129,236,255,0.4)] rounded-tl-xl animate-pulse" />
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20 blur-sm" />
                </>
              )}

              {/* Slanted Speed Line Background (Hover) */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent -skew-x-12 rounded-2xl scale-x-0 group-hover:scale-x-100 origin-left`} />

              <GameIcon name={item.icon} size={36} className={`mb-1 transition-all duration-500 ${
                isActive ? 'text-primary text-glow' : 'opacity-60 group-hover:opacity-100'
              }`} />

              <span className={`text-[9px] font-black uppercase tracking-[0.2em] text-center leading-tight transition-all duration-500 ${
                isActive ? 'text-primary text-glow opacity-100' : 'opacity-40 group-hover:opacity-80'
              }`}>
                {item.label}
              </span>

              {/* Selection Dot */}
              {isActive && (
                <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary shadow-[0_0_8px_rgba(129,236,255,1)]" />
              )}
            </button>
          );
        })}

        {/* Footer Visual Accent */}
        <div className="mt-auto pt-10 px-4 w-full">
          <div className="h-40 w-full rounded-full bg-gradient-to-t from-primary/10 to-transparent flex flex-col items-center justify-end pb-8">
            <span style={{fontSize:'36px', lineHeight:1, display:'inline-block'}} className="text-primary/20 animate-pulse">📡</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LeftNavigationRail;
