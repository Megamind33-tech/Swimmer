/**
 * Swimmer Screen - Athlete management hub
 * Attributes, skills, gear, appearance, records, biography
 */

import React, { useState } from 'react';
import miaPhiriAthleteImage from '../../designs/835_mia_phiri_news.png_1/screen.png';

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

  const tabs: { id: TabName; label: string; icon: string }[] = [
    { id: 'ATTRIBUTES', label: 'Attributes', icon: 'monitoring' },
    { id: 'SKILLS', label: 'Skills', icon: 'bolt' },
    { id: 'GEAR', label: 'Gear', icon: 'checkroom' },
    { id: 'APPEARANCE', label: 'Appearance', icon: 'person' },
    { id: 'RECORDS', label: 'Records', icon: 'history' },
    { id: 'BIOGRAPHY', label: 'Bio', icon: 'book' },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'ATTRIBUTES':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Biometric Efficiency</h3>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <span className="material-symbols-outlined text-primary text-sm animate-pulse">analytics</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Physical Integrity: 98.4%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Start Reaction', value: 18, max: 20, icon: 'bolt', color: 'text-primary' },
                { name: 'Underwater Power', value: 17, max: 20, icon: 'fitness_center', color: 'text-secondary' },
                { name: 'Turn Speed', value: 16, max: 20, icon: 'sync', color: 'text-primary' },
                { name: 'Endurance', value: 17, max: 20, icon: 'favorite', color: 'text-primary' },
                { name: 'Finish Burst', value: 18, max: 20, icon: 'rocket_launch', color: 'text-secondary' },
                { name: 'Mental Composure', value: 16, max: 20, icon: 'psychology', color: 'text-primary' },
              ].map((attr, idx) => (
                <div key={idx} className="group/attr relative p-8 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/40 transition-all duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/attr:bg-primary/20 transition-all">
                        <span className={`material-symbols-outlined ${attr.color} text-glow`}>{attr.icon}</span>
                      </div>
                      <h4 className="font-headline text-base font-black italic slanted uppercase text-on-surface">{attr.name}</h4>
                    </div>
                    <div className="text-right">
                       <span className={`font-headline text-xl font-black italic slanted ${attr.color === 'text-secondary' ? 'text-secondary gold-glow' : 'text-primary text-glow'}`}>{attr.value}</span>
                       <span className="text-[10px] font-black text-on-surface-variant ml-1">/ {attr.max}</span>
                    </div>
                  </div>
                  
                  <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${attr.color === 'text-secondary' ? 'bg-secondary shadow-[0_0_15px_rgba(255,215,9,0.5)]' : 'bg-primary shadow-[0_0_15px_rgba(129,236,255,0.5)]'} transition-all duration-1000 ease-out`}
                      style={{ width: `${(attr.value / attr.max) * 100}%` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'SKILLS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Technique Arsenal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { skill: 'Sprint Specialist', desc: '+10% speed in 50m/100m races', unlocked: true, icon: 'speed', tier: 'Master' },
                { skill: 'Distance Runner', desc: '+15% endurance in 800m+ races', unlocked: true, icon: 'timer', tier: 'Expert' },
                { skill: 'Technical Precision', desc: '+8% turn speed', unlocked: true, icon: 'architecture', tier: 'Advanced' },
                { skill: 'Relay Master', desc: '+12% in team events', unlocked: false, icon: 'groups', tier: 'Locked' },
                { skill: 'Comeback Finisher', desc: '+20% finish burst when trailing', unlocked: false, icon: 'trending_up', tier: 'Locked' },
                { skill: 'Mental Iron', desc: '+15% mental composure', unlocked: false, icon: 'security', tier: 'Locked' },
              ].map((skill, idx) => (
                <div
                  key={idx}
                  className={`group/skill relative p-8 rounded-[40px] border transition-all duration-500 overflow-hidden ${
                    skill.unlocked
                      ? 'bg-white/5 border-white/5 hover:border-primary/40'
                      : 'bg-white/[0.02] border-white/[0.02] opacity-50 grayscale'
                  }`}
                >
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-5">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all shadow-2xl ${
                          skill.unlocked ? 'bg-primary/10 border-primary/30 group-hover/skill:bg-primary group-hover/skill:text-surface' : 'bg-white/5 border-white/5'
                        }`}>
                          <span className="material-symbols-outlined text-2xl">{skill.icon}</span>
                        </div>
                        <div>
                          <h4 className={`font-headline text-lg font-black italic slanted uppercase ${skill.unlocked ? 'text-on-surface' : 'text-on-surface-variant'}`}>{skill.skill}</h4>
                          <span className={`text-[9px] font-black uppercase tracking-widest italic ${skill.unlocked ? 'text-primary' : 'text-on-surface-variant'}`}>{skill.tier}</span>
                        </div>
                      </div>
                      {skill.unlocked ? (
                        <span className="material-symbols-outlined text-primary text-glow">verified</span>
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant text-sm">lock</span>
                      )}
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed uppercase tracking-tight mb-8">{skill.desc}</p>
                    
                    <button className={`w-full h-10 rounded-xl font-headline font-black italic slanted uppercase text-[10px] tracking-widest transition-all ${
                       skill.unlocked ? 'bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 text-primary' : 'bg-white/[0.03] border border-white/5 text-on-surface-variant cursor-not-allowed'
                    }`}>
                      {skill.unlocked ? 'Optimize Technique' : 'Protocol Locked'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'GEAR':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Professional Armory</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { type: 'Suit', equipped: 'Pro Racing Suit', rarity: 'EPIC', icon: 'apparel', stats: '+12 Aerocap' },
                { type: 'Cap', equipped: 'Aerodynamic Pro Cap', rarity: 'RARE', icon: 'sports_motorsports', stats: '+5 Drag Reduc' },
                { type: 'Goggles', equipped: 'Vision Pro Goggles', rarity: 'EPIC', icon: 'visibility', stats: '+8 Peripheral' },
                { type: 'Wedges', equipped: 'Racing Blocks', rarity: 'RARE', icon: 'splitscreen', stats: '+10 Launch' },
              ].map((gear, idx) => (
                <div key={idx} className="group/gear relative p-8 rounded-[40px] border border-white/5 bg-white/5 hover:border-primary/40 transition-all duration-500 overflow-hidden">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover/gear:bg-primary transition-all shadow-2xl">
                      <span className="material-symbols-outlined text-primary text-3xl group-hover:text-surface transition-colors">{gear.icon}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1 block">{gear.type} System</span>
                      <h4 className="font-headline text-lg font-black italic slanted uppercase text-on-surface mb-1">{gear.equipped}</h4>
                    </div>
                    <div className={`px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${
                       gear.rarity === 'EPIC' ? 'border-secondary/40 text-secondary bg-secondary/5' : 'border-primary/40 text-primary bg-primary/5'
                    }`}>
                      {gear.rarity}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase italic tracking-widest">{gear.stats}</span>
                    <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">Calibrate</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'APPEARANCE':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Athlete Visuals</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative group/viewer rounded-[48px] overflow-hidden border border-white/5 bg-gradient-to-br from-white/10 to-transparent p-1">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/viewer:opacity-100 transition-opacity duration-700" />
                <div className="h-[440px] rounded-[44px] bg-surface flex items-center justify-center relative z-10 overflow-hidden">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40" />
                   <img src={miaPhiriAthleteImage} className="w-full h-full object-cover opacity-80 group-hover/viewer:scale-105 transition-transform duration-1000" />
                   
                   <div className="absolute top-8 left-8 flex items-center gap-3 p-3 rounded-2xl bg-surface/60 backdrop-blur-xl border border-white/10">
                     <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary text-glow">3D Neural Feed Active</span>
                   </div>
                </div>
                
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 p-2 rounded-2xl bg-surface/60 backdrop-blur-xl border border-white/10 scale-90 group-hover/viewer:scale-100 transition-all">
                  {['rotate_left', 'zoom_in', 'rotate_right'].map(i => (
                    <button key={i} className="h-10 w-10 rounded-xl hover:bg-primary/20 hover:text-primary transition-all flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">{i}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 content-start">
                {[
                  { name: 'Face Preset', value: 'Asian Male #3', icon: 'face' },
                  { name: 'Hair Style', value: 'Short Buzz', icon: 'content_cut' },
                  { name: 'Body Type', value: 'Athletic', icon: 'accessibility' },
                  { name: 'Walkout Animation', value: 'Confident Stride', icon: 'directions_walk' },
                  { name: 'Victory Pose', value: 'Arms Raised', icon: 'emoji_events' },
                  { name: 'Celebration', value: 'Water Splash', icon: 'water_drop' },
                ].map((option, idx) => (
                  <button
                    key={idx}
                    className="w-full relative group/opt p-5 rounded-[24px] bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-white/10 transition-all text-left flex items-center justify-between"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/opt:bg-primary/20 group-hover/opt:border-primary/40 transition-all">
                        <span className="material-symbols-outlined text-on-surface-variant group-hover/opt:text-primary transition-colors text-xl">{option.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">{option.name}</span>
                        <span className="text-xs font-bold text-on-surface uppercase tracking-wider">{option.value}</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary opacity-0 group-hover/opt:opacity-100 transition-all translate-x-2 group-hover/opt:translate-x-0">arrow_forward</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'RECORDS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Hall of Fame</h3>
            <div className="grid gap-3">
              {[
                { stroke: 'Freestyle 100M', time: '00:51.23', date: 'Mar 12, 2026', venue: 'Olympic Arena', tier: 'WORLD' },
                { stroke: 'Freestyle 200M', time: '01:52.45', date: 'Mar 5, 2026', venue: 'National Pool', tier: 'NATIONAL' },
                { stroke: 'Butterfly 100M', time: '00:56.12', date: 'Feb 28, 2026', venue: 'Championship Pool', tier: 'REGIONAL' },
                { stroke: 'Breaststroke 100M', time: '01:03.87', date: 'Feb 21, 2026', venue: 'Training Facility', tier: 'LOCAL' },
              ].map((record, idx) => (
                <div key={idx} className="group/rec relative p-6 rounded-[32px] border border-white/5 bg-white/5 hover:border-primary/40 transition-all duration-300 flex items-center gap-8">
                  <div className="flex flex-col items-center min-w-[100px]">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${record.tier === 'WORLD' ? 'text-secondary gold-glow' : 'text-primary'}`}>{record.tier}</span>
                    <div className={`h-12 w-[2px] ${record.tier === 'WORLD' ? 'bg-secondary shadow-[0_0_10px_rgba(255,215,9,1)]' : 'bg-primary shadow-[0_0_10px_rgba(129,236,255,0.6)]'}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="h-[1px] w-4 bg-primary/40" />
                      <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">{record.venue}</span>
                    </div>
                    <h4 className="font-headline text-xl font-black italic slanted uppercase text-on-surface group-hover/rec:text-glow transition-all">{record.stroke}</h4>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">Verified {record.date}</p>
                  </div>
                  
                  <div className="text-right">
                    <span className="block text-[8px] font-black text-primary/60 uppercase tracking-widest mb-1">Elite Timing</span>
                    <span className={`font-headline text-3xl font-black italic slanted ${record.tier === 'WORLD' ? 'text-secondary gold-glow' : 'text-primary text-glow'}`}>{record.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'BIOGRAPHY':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Athlete Dossier</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: swimmerName, icon: 'badge' },
                  { label: 'Nationality', value: 'Japan', icon: 'public' },
                  { label: 'Technical Specialty', value: 'Freestyle Sprint', icon: 'grade' },
                  { label: 'Primary Affiliation', value: 'Aqua Dragons', icon: 'stadium' },
                  { label: 'Career Phase', value: 'Professional Elite', icon: 'verified' },
                  { label: 'Physical Classification', value: 'Tier 1 Athlete', icon: 'fitness_center' },
                ].map((bio, idx) => (
                  <div key={idx} className="group/bio p-6 rounded-[32px] bg-white/5 border border-white/5 hover:border-primary/20 transition-all flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover/bio:bg-primary transition-all">
                      <span className="material-symbols-outlined text-primary text-2xl group-hover:text-surface transition-colors">{bio.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">{bio.label}</span>
                      <span className="text-xs font-bold text-on-surface uppercase tracking-wider group-hover/bio:text-primary transition-colors">{bio.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 rounded-[40px] border border-primary/20 bg-primary/5 space-y-6 relative overflow-hidden group/narrative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <span className="material-symbols-outlined text-[120px] text-primary">description</span>
                </div>
                <h4 className="font-headline text-lg font-black italic slanted uppercase text-primary text-glow flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm">history_edu</span>
                  Legacy Arc
                </h4>
                <p className="text-[11px] text-on-surface-variant uppercase font-bold leading-relaxed tracking-tight relative z-10 transition-all group-hover/narrative:text-on-surface duration-500">
                  A rising champion swimmer with exceptional freestyle skills and a determination to reach the world stage. Known for consistent training regimen and mental resilience under pressure. Currently pursuing national championship qualification while building an international reputation as a dominant force in high-intensity aquatic scenarios.
                </p>
                <div className="h-[1px] w-full bg-primary/20" />
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                   <span className="text-primary">Contract Status</span>
                   <span className="text-on-surface">Secure • 3 Seasons</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 relative w-full h-full overflow-y-auto flex flex-col font-body">
      {/* Cinematic Athlete Header */}
      <div className="p-12 max-[900px]:p-8 bg-gradient-to-b from-primary/15 to-transparent border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-primary/5 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-end justify-between gap-12 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-12 bg-primary/40" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Athlete Profile Index</span>
            </div>
            
            <h1 className="font-headline text-6xl max-[900px]:text-4xl font-black italic slanted uppercase text-on-surface text-glow mb-4">
              {swimmerName}
            </h1>
            
            <div className="flex items-center gap-10 flex-wrap">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">Global Standing</span>
                <span className="font-headline text-2xl font-black italic slanted text-secondary gold-glow">#1,234</span>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">Career Phase</span>
                <span className="font-headline text-2xl font-black italic slanted text-primary text-glow">LV.{swimmerLevel} Elite</span>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">Contract Value</span>
                <span className="font-headline text-2xl font-black italic slanted text-on-surface uppercase">4.5M Coins</span>
              </div>
            </div>
          </div>

          <div className="relative group/avatar">
            <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-110 group-hover/avatar:scale-125 transition-transform duration-1000 opacity-50" />
            <div className="relative h-40 w-40 rounded-[48px] border-4 border-white/10 bg-surface overflow-hidden group-hover/avatar:border-primary/60 transition-all duration-700 shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-surface-high opacity-60 pointer-events-none z-10" />
               <img src={miaPhiriAthleteImage} className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-1000" />
            </div>
            <div className="absolute -bottom-4 -right-4 h-14 w-14 rounded-2xl bg-primary border-4 border-surface flex items-center justify-center font-headline text-2xl font-black italic slanted text-surface shadow-2xl z-20">
               {swimmerLevel}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto w-full space-y-12 pb-24">
        {/* Tab Navigation */}
        <div className="flex gap-3 flex-wrap items-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-8 py-4 rounded-[20px] font-headline font-black italic slanted uppercase text-[11px] tracking-widest transition-all duration-500 overflow-hidden border ${
                  isActive 
                    ? 'bg-primary/20 border-primary/40 text-primary text-glow shadow-[0_0_30px_rgba(129,236,255,0.25)]' 
                    : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                  {tab.label}
                </div>
                {isActive && (
                   <div className="absolute inset-x-0 bottom-0 h-1 bg-primary shadow-[0_0_15px_rgba(129,236,255,1)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
              </button>
            );
          })}
        </div>

        {/* Dynamic Content Panel */}
        <div className="min-h-[560px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
           {renderTab()}
        </div>
      </div>
    </div>
  );
};

export default SwimmerScreen;
