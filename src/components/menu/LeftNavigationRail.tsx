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
    <nav className="w-20 bg-surface-container/40 backdrop-blur-md border-r border-outline-variant/20 flex flex-col items-center py-4 gap-1 overflow-y-auto sticky left-0 top-16">
      {NavItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onScreenChange(item.id)}
          className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-300 group border ${
            currentScreen === item.id
              ? 'bg-primary/20 text-primary border-primary/40 scale-100'
              : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high border-transparent'
          } active:scale-95`}
          title={item.label}
        >
          <span className="material-symbols-outlined text-2xl transition-transform duration-300 group-hover:scale-110">
            {item.icon}
          </span>
          <span className="text-[10px] font-bold text-center leading-tight">{item.label}</span>

          {/* Active indicator bar */}
          {currentScreen === item.id && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default LeftNavigationRail;
