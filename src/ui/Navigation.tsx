import React from 'react';
import { useGameStore } from '../gameplay/useGameStore';
import { Monitor, Users, Globe, Sliders } from 'lucide-react';

export const Navigation = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const navItems = [
    { id: 'hub', icon: Monitor, label: 'HUB' },
    { id: 'squad', icon: Users, label: 'SQUAD' },
    { id: 'network', icon: Globe, label: 'NETWORK' },
    { id: 'system', icon: Sliders, label: 'SYSTEM' },
  ];

  return (
    <>
      {/* Side Nav — landscape desktop */}
      <nav className="hidden landscape:flex fixed left-0 top-[44px] bottom-0 w-[56px] border-r border-[#1E3A57]/50 bg-[#0a192f]/95 backdrop-blur-md flex-col items-center py-4 gap-4 z-[90]">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              aria-label={item.label} title={item.label}
              className={`w-[40px] h-[40px] flex flex-col items-center justify-center transition-all rounded-lg relative btn-mech ${
                isActive ? 'text-[#18C8F0] bg-[#112240]' : 'text-[#71859C] hover:text-[#F3F7FC] hover:bg-[#112240]/50'
              }`}>
              {isActive && <div aria-hidden="true" className="absolute left-[-8px] w-[3px] h-6 rounded-r-md bg-[#18C8F0] shadow-[0_0_10px_rgba(24,200,240,0.6)]" />}
              <item.icon aria-hidden="true" size={18} className={isActive ? 'drop-shadow-[0_0_8px_rgba(24,200,240,0.4)]' : ''} />
            </button>
          );
        })}
      </nav>

      {/* Bottom Nav — portrait mobile */}
      <nav className="landscape:hidden fixed bottom-0 left-0 right-0 h-[52px] border-t border-[#1E3A57]/50 bg-[#0a192f]/95 backdrop-blur-md flex justify-around items-center px-1 z-[90] safe-zone">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all btn-mech relative ${
                isActive ? 'text-[#18C8F0]' : 'text-[#71859C]'
              }`}>
              <item.icon aria-hidden="true" size={18} className={isActive ? 'mb-0.5' : 'mb-0.5'} />
              <span className={`text-[8px] font-bold uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{item.label}</span>
              {isActive && <div aria-hidden="true" className="absolute bottom-0 w-6 h-[3px] rounded-t-md bg-[#18C8F0]" />}
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Navigation;
