/**
 * Left Navigation Rail - SWIM 26 Material Design 3
 * Core menu tabs with new design
 */

import React from 'react';
import { MenuScreen } from './GlobalMenuLayout';

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
  return (
    <nav className="w-full h-full min-h-0 bg-black/45 backdrop-blur-md border-r border-white/10 flex flex-col items-center py-2 max-[900px]:py-1 gap-1 overflow-y-auto overscroll-contain touch-pan-y [scrollbar-width:thin]">
      {NavItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onScreenChange(item.id)}
          className={`relative w-12 h-12 max-[900px]:w-9 max-[900px]:h-9 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-300 group border ${
            currentScreen === item.id
              ? 'bg-primary/25 text-primary-fixed border-primary/60 scale-100 shadow-[0_0_18px_rgba(15,98,254,0.35)]'
              : 'text-white/70 hover:text-primary-fixed hover:bg-white/10 border-transparent'
          } active:scale-95`}
          title={item.label}
        >
          <span className="material-symbols-outlined text-xl max-[900px]:text-lg transition-transform duration-300 group-hover:scale-110">
            {item.icon}
          </span>
          <span className="sr-only">{item.label}</span>

          {/* Active indicator bar */}
          {currentScreen === item.id && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-fixed rounded-r-full"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default LeftNavigationRail;
