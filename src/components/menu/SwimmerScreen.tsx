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
            <h3 className="text-3xl font-black text-primary text-glow">Core Attributes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Start Reaction', value: 18, max: 20, icon: '⚡' },
                { name: 'Underwater Power', value: 17, max: 20, icon: '💪' },
                { name: 'Turn Speed', value: 16, max: 20, icon: '🔄' },
                { name: 'Endurance', value: 17, max: 20, icon: '❤️' },
                { name: 'Finish Burst', value: 18, max: 20, icon: '🚀' },
                { name: 'Mental Composure', value: 16, max: 20, icon: '🧠' },
              ].map((attr, idx) => (
                <div key={idx} className="glass-panel rounded-lg p-5 border border-primary/30 kinetic-border shadow-lg shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{attr.icon}</span>
                      <span className="font-bold text-on-background text-lg">{attr.name}</span>
                    </div>
                    <span className="text-sm font-bold text-primary bg-primary/20 px-3 py-1 rounded-full">{attr.value}/{attr.max}</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-3 border border-primary/20">
                    <div
                      className="bg-gradient-to-r from-primary via-secondary to-primary h-3 rounded-full shadow-lg shadow-primary/50"
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
            <h3 className="text-3xl font-black text-secondary text-glow">Skill Specialties</h3>
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
                  className={`rounded-lg p-5 border kinetic-border transition-all ${
                    skill.unlocked
                      ? 'glass-panel border-secondary/50 shadow-lg shadow-secondary/15 hover:shadow-lg hover:shadow-secondary/25'
                      : 'glass-panel border-outline/30 opacity-50 hover:opacity-60'
                  }`}
                >
                  <div className="font-bold text-on-background mb-2 text-lg">{skill.skill}</div>
                  <div className="text-sm text-on-surface-variant font-semibold">{skill.desc}</div>
                  {skill.unlocked && (
                    <div className="text-xs text-secondary mt-3 font-bold">✓ Unlocked</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'GEAR':
        return (
          <div className="space-y-6">
            <h3 className="text-3xl font-black text-primary text-glow">Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { type: 'Suit', equipped: 'Pro Racing Suit', rarity: 'EPIC' },
                { type: 'Cap', equipped: 'Aerodynamic Pro Cap', rarity: 'RARE' },
                { type: 'Goggles', equipped: 'Vision Pro Goggles', rarity: 'EPIC' },
                { type: 'Wedges', equipped: 'Racing Blocks', rarity: 'RARE' },
              ].map((gear, idx) => (
                <div key={idx} className="glass-panel rounded-lg p-5 border border-primary/30 kinetic-border shadow-lg shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all">
                  <div className="text-xs text-secondary font-bold uppercase mb-2">{gear.type}</div>
                  <div className="font-bold text-on-background mb-3 text-lg">{gear.equipped}</div>
                  <span
                    className={`text-xs px-4 py-2 rounded-full font-bold border ${
                      gear.rarity === 'EPIC'
                        ? 'bg-secondary/25 text-secondary border-secondary/40'
                        : 'bg-primary/25 text-primary border-primary/40'
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
            <h3 className="text-3xl font-black text-primary text-glow">Customization</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 3D Viewer Placeholder */}
              <div className="glass-panel rounded-lg h-80 flex items-center justify-center border border-primary/40 kinetic-border shadow-lg shadow-primary/20">
                <div className="text-center">
                  <div className="text-7xl mb-4">👤</div>
                  <p className="text-on-surface-variant text-lg font-bold">3D Character Viewer</p>
                  <p className="text-on-surface-variant text-sm mt-2">(Interactive Preview)</p>
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
                    className="w-full px-5 py-3 glass-panel hover:bg-primary/10 rounded-lg border border-primary/30 text-left transition-all kinetic-border shadow-lg shadow-primary/10 hover:shadow-lg hover:shadow-primary/20"
                  >
                    <div className="text-xs text-secondary font-bold uppercase">{option.name}</div>
                    <div className="font-bold text-on-background text-lg">{option.value}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'RECORDS':
        return (
          <div className="space-y-6">
            <h3 className="text-3xl font-black text-primary text-glow">Personal Records</h3>
            <div className="space-y-4">
              {[
                { stroke: 'Freestyle 100M', time: '00:51.23', date: 'Mar 12, 2026', venue: 'Olympic Arena' },
                { stroke: 'Freestyle 200M', time: '01:52.45', date: 'Mar 5, 2026', venue: 'National Pool' },
                { stroke: 'Butterfly 100M', time: '00:56.12', date: 'Feb 28, 2026', venue: 'Championship Pool' },
                { stroke: 'Breaststroke 100M', time: '01:03.87', date: 'Feb 21, 2026', venue: 'Training Facility' },
                { stroke: 'Backstroke 100M', time: '00:54.56', date: 'Feb 14, 2026', venue: 'Neon District' },
              ].map((record, idx) => (
                <div key={idx} className="glass-panel rounded-lg p-5 border border-primary/30 kinetic-border shadow-lg shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-on-background text-lg">{record.stroke}</div>
                    <div className="text-primary font-mono font-black text-2xl bg-primary/20 px-4 py-2 rounded-full">{record.time}</div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant border-t border-outline/20 pt-3">
                    <span className="font-bold">{record.date}</span>
                    <span className="font-bold">{record.venue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'BIOGRAPHY':
        return (
          <div className="space-y-6">
            <h3 className="text-3xl font-black text-primary text-glow">Athlete Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div key={idx} className="glass-panel rounded-lg p-4 border border-primary/30 kinetic-border shadow-lg shadow-primary/10">
                  <div className="text-xs text-secondary font-bold uppercase mb-2">{bio.label}</div>
                  <div className="font-bold text-on-background text-lg">{bio.value}</div>
                </div>
              ))}
            </div>

            {/* Biography Text */}
            <div className="glass-panel rounded-lg p-6 border border-secondary/40 kinetic-border shadow-lg shadow-secondary/10">
              <h4 className="font-black text-secondary mb-4 text-lg uppercase text-glow">About</h4>
              <p className="text-on-surface-variant leading-relaxed text-base">
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
            <h1 className="text-5xl font-black text-primary mb-2 text-glow">{swimmerName}</h1>
            <p className="text-on-surface-variant text-lg font-bold">Level <span className="text-secondary">{swimmerLevel}</span></p>
          </div>
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary text-5xl font-black kinetic-border border-3 border-primary/60 shadow-lg shadow-primary/40">
            {swimmerName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 flex-wrap animate-slide-in-up">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-full font-bold uppercase text-sm transition-all border ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-secondary text-on-primary shadow-lg shadow-primary/40 kinetic-border border-primary/60'
                  : 'glass-panel text-on-surface-variant border-outline/30 hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass-panel rounded-lg p-8 border border-primary/30 kinetic-border animate-slide-in-left shadow-lg shadow-primary/10">
          {renderTab()}
        </div>
      </div>
    </div>
  );
};

export default SwimmerScreen;
