/**
 * Left Navigation Rail - Core menu tabs
 * Home, Play, Career, Swimmer, Club, Live Events, Social, Store
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
  icon: React.ReactNode;
  tooltip: string;
}

const NavItems: NavItem[] = [
  {
    id: 'HOME',
    label: 'Home',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M9 21h6a2 2 0 002-2V9l-7-4-7 4v10a2 2 0 002 2z" />
      </svg>
    ),
    tooltip: 'Main Hub',
  },
  {
    id: 'PLAY',
    label: 'Play',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    tooltip: 'Game Modes',
  },
  {
    id: 'CAREER',
    label: 'Career',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    tooltip: 'Career Journey',
  },
  {
    id: 'SWIMMER',
    label: 'Swimmer',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    tooltip: 'Athlete Profile',
  },
  {
    id: 'CLUB',
    label: 'Club',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    tooltip: 'Club HQ',
  },
  {
    id: 'LIVE_EVENTS',
    label: 'Events',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    tooltip: 'Live Events',
  },
  {
    id: 'SOCIAL',
    label: 'Social',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zM5 20a3 3 0 015.856-1.487M5 10a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    tooltip: 'Friends & Rivals',
  },
  {
    id: 'STORE',
    label: 'Store',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    tooltip: 'Shop',
  },
];

export const LeftNavigationRail: React.FC<LeftNavigationRailProps> = ({
  currentScreen,
  onScreenChange,
}) => {
  return (
    <div className="w-24 bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-r border-slate-700/50 flex flex-col items-center py-4 gap-2 overflow-y-auto">
      {NavItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onScreenChange(item.id)}
          className={`relative w-16 h-16 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-200 group ${
            currentScreen === item.id
              ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
          title={item.tooltip}
        >
          {item.icon}
          <span className="text-xs font-semibold text-center leading-tight">{item.label}</span>

          {/* Tooltip on hover */}
          <div className="absolute left-full ml-2 bg-slate-950 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {item.tooltip}
          </div>

          {/* Active indicator */}
          {currentScreen === item.id && (
            <div className="absolute inset-0 rounded-lg border-2 border-cyan-300"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default LeftNavigationRail;
