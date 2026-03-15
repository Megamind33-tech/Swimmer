/**
 * Swimmer Screen - Athlete management hub
 * Attributes, skills, gear, appearance, records, biography
 */

import React, { useState } from 'react';

type TabName = 'ATTRIBUTES' | 'SKILLS' | 'GEAR' | 'APPEARANCE' | 'RECORDS' | 'BIOGRAPHY';

interface SwimmerScreenProps {
  swimmerName?: string;
  swimmerLevel?: number;
}

export const SwimmerScreen: React.FC<SwimmerScreenProps> = ({
  swimmerName = 'Elite Swimmer',
  swimmerLevel = 45,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('ATTRIBUTES');

  const tabs: { id: TabName; label: string; icon: React.ReactNode }[] = [
    {
      id: 'ATTRIBUTES',
      label: 'Attributes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'SKILLS',
      label: 'Skills',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'GEAR',
      label: 'Gear',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
    {
      id: 'APPEARANCE',
      label: 'Appearance',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'RECORDS',
      label: 'Records',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      id: 'BIOGRAPHY',
      label: 'Bio',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'ATTRIBUTES':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-on-background text-glow">Core Attributes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Start Reaction', value: 18, max: 20, icon: '⚡' },
                { name: 'Underwater Power', value: 17, max: 20, icon: '💪' },
                { name: 'Turn Speed', value: 16, max: 20, icon: '🔄' },
                { name: 'Endurance', value: 17, max: 20, icon: '❤️' },
                { name: 'Finish Burst', value: 18, max: 20, icon: '🚀' },
                { name: 'Mental Composure', value: 16, max: 20, icon: '🧠' },
              ].map((attr, idx) => (
                <div key={idx} className="glass-panel rounded-lg p-4 border border-outline/30 kinetic-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{attr.icon}</span>
                      <span className="font-bold text-on-background">{attr.name}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">{attr.value}/{attr.max}</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                      style={{ width: `${(attr.value / attr.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'SKILLS':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-on-background text-glow">Skill Specialties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { skill: 'Sprint Specialist', desc: '+10% speed in 50m/100m races', unlocked: true },
                { skill: 'Distance Runner', desc: '+15% endurance in 800m+ races', unlocked: true },
                { skill: 'Technical Precision', desc: '+8% turn speed', unlocked: true },
                { skill: 'Relay Master', desc: '+12% in team events', unlocked: false },
                { skill: 'Comeback Finisher', desc: '+20% finish burst when trailing', unlocked: false },
                { skill: 'Mental Iron', desc: '+15% mental composure', unlocked: false },
              ].map((skill, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-4 border ${
                    skill.unlocked
                      ? 'glass-panel border-secondary/50 kinetic-border'
                      : 'glass-panel border-outline/30 opacity-50'
                  }`}
                >
                  <div className="font-bold text-on-background mb-1">{skill.skill}</div>
                  <div className="text-sm text-on-surface-variant">{skill.desc}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'GEAR':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-on-background text-glow">Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { type: 'Suit', equipped: 'Pro Racing Suit', rarity: 'EPIC' },
                { type: 'Cap', equipped: 'Aerodynamic Pro Cap', rarity: 'RARE' },
                { type: 'Goggles', equipped: 'Vision Pro Goggles', rarity: 'EPIC' },
                { type: 'Wedges', equipped: 'Racing Blocks', rarity: 'RARE' },
              ].map((gear, idx) => (
                <div key={idx} className="glass-panel rounded-lg p-4 border border-outline/30 kinetic-border">
                  <div className="text-sm text-on-surface-variant mb-1">{gear.type}</div>
                  <div className="font-bold text-on-background mb-2">{gear.equipped}</div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${
                      gear.rarity === 'EPIC'
                        ? 'bg-secondary/30 text-secondary'
                        : 'bg-primary/30 text-primary'
                    }`}
                  >
                    {gear.rarity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'APPEARANCE':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white">Customization</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 3D Viewer Placeholder */}
              <div className="bg-gradient-to-b from-slate-600 to-slate-700 rounded-lg h-80 flex items-center justify-center border border-slate-600/50">
                <div className="text-center">
                  <div className="text-6xl mb-2">👤</div>
                  <p className="text-slate-300">3D Character Viewer</p>
                </div>
              </div>

              {/* Customization Options */}
              <div className="space-y-4">
                {[
                  { name: 'Face Preset', value: 'Asian Male #3' },
                  { name: 'Hair Style', value: 'Short Buzz' },
                  { name: 'Body Type', value: 'Athletic' },
                  { name: 'Walkout Animation', value: 'Confident Stride' },
                  { name: 'Victory Pose', value: 'Arms Raised' },
                  { name: 'Celebration', value: 'Water Splash' },
                ].map((option, idx) => (
                  <button
                    key={idx}
                    className="w-full px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600/30 text-left transition-colors"
                  >
                    <div className="text-sm text-slate-400">{option.name}</div>
                    <div className="font-bold text-white">{option.value}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'RECORDS':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white">Personal Records</h3>
            <div className="space-y-3">
              {[
                { stroke: 'Freestyle 100M', time: '00:51.23', date: 'Mar 12, 2026', venue: 'Olympic Arena' },
                { stroke: 'Freestyle 200M', time: '01:52.45', date: 'Mar 5, 2026', venue: 'National Pool' },
                { stroke: 'Butterfly 100M', time: '00:56.12', date: 'Feb 28, 2026', venue: 'Championship Pool' },
                { stroke: 'Breaststroke 100M', time: '01:03.87', date: 'Feb 21, 2026', venue: 'Training Facility' },
                { stroke: 'Backstroke 100M', time: '00:54.56', date: 'Feb 14, 2026', venue: 'Neon District' },
              ].map((record, idx) => (
                <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-white">{record.stroke}</div>
                    <div className="text-cyan-400 font-mono font-bold text-lg">{record.time}</div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{record.date}</span>
                    <span>{record.venue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'BIOGRAPHY':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white">Athlete Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', value: 'Elite Swimmer' },
                { label: 'Age', value: '22 years old' },
                { label: 'Nationality', value: 'Japan' },
                { label: 'Hometown', value: 'Tokyo' },
                { label: 'Club', value: 'Aqua Dragons' },
                { label: 'Specialty', value: 'Freestyle' },
                { label: 'Fan Popularity', value: '1.2M Fans' },
                { label: 'Current Rank', value: '#1,234 Global' },
              ].map((bio, idx) => (
                <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                  <div className="text-sm text-slate-400 mb-1">{bio.label}</div>
                  <div className="font-bold text-white">{bio.value}</div>
                </div>
              ))}
            </div>

            {/* Biography Text */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg p-6 border border-slate-600/30">
              <h4 className="font-bold text-white mb-3">About</h4>
              <p className="text-slate-300 leading-relaxed">
                A rising champion swimmer with exceptional freestyle skills and a determination to reach the world stage. Known for consistent training regimen and mental resilience under pressure. Currently pursuing national championship qualification while building international reputation.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-8 space-y-8 bg-surface">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-slide-in-down">
          <div>
            <h1 className="text-4xl font-black text-on-background mb-1 text-glow">{swimmerName}</h1>
            <p className="text-on-surface-variant">Level {swimmerLevel}</p>
          </div>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary text-5xl font-black kinetic-border border-2 border-primary/50">
            {swimmerName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 flex-wrap animate-slide-in-up">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold uppercase text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-secondary text-on-primary shadow-lg shadow-primary/30'
                  : 'glass-panel text-on-surface-variant hover:bg-surface-container/50'
              }`}
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass-panel rounded-lg p-8 border border-outline/30 kinetic-border animate-slide-in-left">
          {renderTab()}
        </div>
      </div>
    </div>
  );
};

export default SwimmerScreen;
