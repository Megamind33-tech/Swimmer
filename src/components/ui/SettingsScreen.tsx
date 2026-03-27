import React from 'react';
import { useGameStore, GameSettings } from '../../hooks/useGameStore';
import { Volume2, Monitor, Gamepad2 } from 'lucide-react';

export const SettingsScreen = ({ onEngineQuality }: { onEngineQuality?: (preset: 'high' | 'medium' | 'low') => void }) => {
  const { state, toggleSetting } = useGameStore();
  const s = state.settings;

  const handleToggle = (key: keyof GameSettings) => {
    toggleSetting(key);
    // Wire engine-affecting settings
    if (key === 'fps60' && onEngineQuality) {
      onEngineQuality(!s.fps60 ? 'high' : 'medium');
    }
    if (key === 'waterCaustics' && onEngineQuality) {
      onEngineQuality(!s.waterCaustics ? 'medium' : 'low');
    }
  };

  const sections = [
    {
      icon: Monitor, label: 'DISPLAY & HUD', color: '#18C8F0',
      items: [
        { key: 'fps60' as keyof GameSettings, label: '60 FPS PERFORMANCE MODE', state: s.fps60 },
        { key: 'advancedSplits' as keyof GameSettings, label: 'SHOW ADVANCED SPLIT TIMES', state: s.advancedSplits },
        { key: 'waterCaustics' as keyof GameSettings, label: 'DYNAMIC WATER CAUSTICS', state: s.waterCaustics },
        { key: 'colorblind' as keyof GameSettings, label: 'COLORBLIND MODE', state: s.colorblind },
      ]
    },
    {
      icon: Volume2, label: 'AUDIO & HAPTICS', color: '#C8FF00',
      items: [
        { key: 'arenaAmbience' as keyof GameSettings, label: 'ARENA AMBIENCE VOLUME', state: s.arenaAmbience },
        { key: 'coachVoice' as keyof GameSettings, label: 'COACH AI VOICEFEED', state: s.coachVoice },
        { key: 'hapticFeedback' as keyof GameSettings, label: 'HAPTIC STROKE FEEDBACK', state: s.hapticFeedback },
      ]
    },
  ];

  return (
    <div className="p-3 h-full overflow-y-auto no-scrollbar animate-slide pb-16 landscape:pb-3 max-w-3xl mx-auto pointer-events-auto">
      <div className="mb-4">
        <span className="text-[10px] font-extrabold text-[#9EB2C7] tracking-[0.2em] uppercase">CONFIGURATION</span>
        <h1 className="font-bebas text-3xl landscape:text-4xl leading-none text-[#F3F7FC] drop-shadow-md mt-0.5">SYSTEM SETTINGS</h1>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map((section) => (
          <div key={section.label} className="space-y-2">
            <div className="flex items-center gap-2 border-b border-[#1E3A57] pb-1.5">
              <section.icon size={16} style={{ color: section.color }} />
              <h2 className="font-barlow text-sm font-bold uppercase tracking-widest" style={{ color: section.color }}>{section.label}</h2>
            </div>
            <div className="grid gap-2">
              {section.items.map((setting) => (
                <button key={setting.key} onClick={() => handleToggle(setting.key)} 
                  className="bg-[#0a192f] border border-[#1E3A57] p-3 flex justify-between items-center rounded-sm hover:bg-[#112240] transition-colors cursor-pointer btn-mech w-full text-left">
                  <span className="font-rajdhani text-xs font-bold text-[#F3F7FC] uppercase tracking-wider">{setting.label}</span>
                  <div className={`w-10 h-5 rounded-full p-0.5 transition-colors shrink-0 ml-3 ${setting.state ? `bg-[${section.color}]` : 'bg-[#1E3A57]'}`}
                    style={{ backgroundColor: setting.state ? section.color : '#1E3A57' }}>
                    <div className={`w-4 h-4 rounded-full bg-[#0a192f] transition-transform ${setting.state ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsScreen;
