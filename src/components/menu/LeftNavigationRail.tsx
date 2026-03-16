/**
 * Left Navigation Rail - Game-Focused Vertical Tab Bar
 * Oversized icons with neon cyan active states and broadcast aesthetic
 */

import React, { useState } from 'react';
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
    <nav className="relative w-28 bg-broadcast-overlay/80 backdrop-blur-xl border-r border-neon-cyan/20 flex flex-col items-center py-4 gap-3 overflow-y-auto overscroll-contain sticky left-0 top-16 self-start h-[calc(100dvh-9rem)] shadow-[8px_0_40px_rgba(0,255,255,0.15)] skew-container">
      {NavItems.map((item) => {
        const isActive = currentScreen === item.id;
        const isHovered = hoveredItem === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onScreenChange(item.id)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={(e) => handleMouseMove(e, item.id)}
            className={`relative w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group border-2 overflow-hidden ${
              isActive
                ? 'neon-stroke-active state-active bg-neon-cyan/10 animate-neon-glow'
                : 'border-white/20 state-inactive hover:border-neon-cyan/50 hover:bg-neon-cyan/5'
            } active:animate-squash-stretch`}
            title={item.label}
            style={{
              '--tilt-x': `${tiltX}deg`,
              '--tilt-y': `${tiltY}deg`,
            } as React.CSSProperties}
          >
            {/* Background glow on hover */}
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-transparent rounded-xl"></div>
            )}

            {/* Icon */}
            <span className={`material-symbols-outlined text-5xl transition-all duration-300 relative z-10 ${
              isActive
                ? 'text-neon-cyan drop-shadow-[0_0_12px_rgba(0,255,255,0.6)]'
                : 'text-white group-hover:text-neon-cyan group-hover:drop-shadow-[0_0_12px_rgba(0,255,255,0.4)]'
            }`}>
              {item.icon}
            </span>

            {/* Label */}
            <span className={`text-[8px] font-bold font-barlow text-center leading-tight transition-all duration-300 relative z-10 ${
              isActive ? 'text-neon-cyan' : 'text-white'
            }`}>
              {item.label}
            </span>

            {/* Active indicator glow */}
            {isActive && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-neon-cyan to-neon-cyan/30 rounded-r-full shadow-[0_0_10px_rgba(0,255,255,0.6)]"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default LeftNavigationRail;
