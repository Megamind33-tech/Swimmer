/**
 * Social Screen - Community and competition
 * Friends, rivals, leaderboards, club chat, ghost races
 */

import React, { useState } from 'react';
import { getDifficultyColor, getDifficultyBadgeIcon } from '../../utils/difficultyUtils';

type SocialTab = 'FRIENDS' | 'RIVALS' | 'LEADERBOARDS' | 'CHAT' | 'GHOSTS';

interface Friend {
  id: string;
  name: string;
  level: number;
  rank: string;
  lastSeen: string;
  online: boolean;
}

interface Rival {
  id: string;
  name: string;
  level: number;
  specialty: string;
  raceCount: number;
  playerWins: number;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  level: number;
  time: string;
  pb: string;
}

interface SocialScreenProps {
  playerName?: string;
}

const Friends: Friend[] = [
  { id: '1', name: 'Alex Chen', level: 42, rank: '#234', lastSeen: 'Online', online: true },
  { id: '2', name: 'Maya Patel', level: 39, rank: '#567', lastSeen: '2h ago', online: false },
  { id: '3', name: 'James Wilson', level: 44, rank: '#123', lastSeen: '10m ago', online: true },
  { id: '4', name: 'Sofia Rossi', level: 41, rank: '#345', lastSeen: '1d ago', online: false },
  { id: '5', name: 'Marcus Johnson', level: 38, rank: '#678', lastSeen: 'Online', online: true },
];

const Rivals: Rival[] = [
  {
    id: '1',
    name: 'Kaito Yamamoto',
    level: 46,
    specialty: 'Freestyle Sprinter',
    raceCount: 12,
    playerWins: 7,
    difficulty: 'HARD',
  },
  {
    id: '2',
    name: 'Luna Santos',
    level: 43,
    specialty: 'Distance Runner',
    raceCount: 8,
    playerWins: 5,
    difficulty: 'NORMAL',
  },
  {
    id: '3',
    name: 'Alex Petrov',
    level: 40,
    specialty: 'Technician',
    raceCount: 15,
    playerWins: 9,
    difficulty: 'HARD',
  },
];

const GlobalLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Thunder Mako', level: 50, time: '00:48.23', pb: 'World Record' },
  { rank: 2, name: 'Crystal Wave', level: 49, time: '00:49.15', pb: '+1.92s' },
  { rank: 3, name: 'Kaito Y.', level: 46, time: '00:50.42', pb: '+2.19s' },
  { rank: 4, name: 'You', level: 45, time: '00:51.23', pb: 'Personal Best' },
  { rank: 5, name: 'Luna Santos', level: 43, time: '00:51.87', pb: '+0.64s' },
];

import { useIsLandscapeMobile } from '../../hooks/useIsLandscapeMobile';
import { PaneSwitcher } from '../../ui/PaneSwitcher';

export const SocialScreen: React.FC<SocialScreenProps> = ({ playerName = 'Swimmer' }) => {
  const isLandscapeMobile = useIsLandscapeMobile();
  const [activeTab, setActiveTab] = useState<SocialTab>('FRIENDS');

  const tabs: { id: SocialTab; label: string; icon: React.ReactNode; count: number }[] = [
    {
      id: 'FRIENDS',
      label: 'Friends',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zM5 20a3 3 0 015.856-1.487M5 10a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      count: Friends.length,
    },
    {
      id: 'RIVALS',
      label: 'Rivals',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      count: Rivals.length,
    },
    {
      id: 'LEADERBOARDS',
      label: 'Rankings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      count: 0,
    },
    {
      id: 'CHAT',
      label: 'Chat',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      count: 1,
    },
    {
      id: 'GHOSTS',
      label: 'Ghosts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M7 12a5 5 0 1110 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      count: 0,
    },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'FRIENDS':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Friends.map((friend) => (
              <div
                key={friend.id}
                className="group/friend relative p-1 rounded-[40px] bg-gradient-to-br from-white/10 to-transparent hover:from-primary/40 transition-all duration-500 cursor-pointer"
              >
                <div className="relative z-10 p-8 rounded-[36px] bg-surface overflow-hidden h-full flex flex-col justify-between">
                  {/* Background Aura */}
                  <div className={`absolute -right-20 -top-20 h-40 w-40 blur-3xl opacity-5 transition-colors ${
                    friend.online ? 'bg-primary' : 'bg-white'
                  }`} />
                  
                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                         <div className={`absolute inset-0 blur-xl ${friend.online ? 'bg-primary animate-pulse' : 'bg-transparent'}`} />
                         <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center relative z-10 ${
                           friend.online ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/10'
                         }`}>
                           <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className={friend.online ? 'text-primary' : 'text-on-surface-variant opacity-60'}>👤</span>
                         </div>
                      </div>
                      <div>
                        <h4 className="font-headline text-xl font-black italic slanted uppercase text-on-surface group-hover/friend:text-glow transition-all">{friend.name}</h4>
                        <div className="flex items-center gap-2">
                           <span className={`h-1.5 w-1.5 rounded-full ${friend.online ? 'bg-primary shadow-[0_0_5px_rgba(129,236,255,1)]' : 'bg-white/20'}`} />
                           <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{friend.lastSeen}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest block opacity-60">Global Pos</span>
                       <span className="font-headline text-lg font-black italic slanted text-primary text-glow">{friend.rank}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 relative z-10">
                    <button className="h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 transition-all duration-500 font-headline font-black italic slanted uppercase text-[10px] tracking-widest text-on-surface-variant hover:text-primary">
                       Challenge
                    </button>
                    <button className="h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/40 transition-all duration-500 font-headline font-black italic slanted uppercase text-[10px] tracking-widest text-on-surface-variant hover:text-on-surface">
                       Dossier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'RIVALS':
        return (
          <div className="space-y-6">
            {Rivals.map((rival) => (
              <div
                key={rival.id}
                className="group/rival relative p-1 rounded-[48px] bg-gradient-to-br from-secondary/40 via-white/5 to-transparent hover:scale-[1.01] transition-all duration-700"
              >
                <div className="relative z-10 p-10 rounded-[44px] bg-surface overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
                   {/* Rival Aura */}
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent opacity-40 pointer-events-none" />
                   
                   <div className="flex-1 space-y-6 relative z-10 w-full">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-[24px] bg-secondary/20 border border-secondary/40 flex items-center justify-center">
                           <span style={{fontSize:'36px', lineHeight:1, display:'inline-block'}} className="text-secondary gold-glow">⚡</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] italic gold-glow">Priority Target</span>
                             <span className="h-[1px] w-8 bg-secondary/40" />
                          </div>
                          <h3 className="font-headline text-4xl font-black italic slanted uppercase text-on-surface text-glow leading-none">{rival.name}</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                         {[
                           { label: 'Tactical Class', val: rival.specialty },
                           { label: 'Biometric Level', val: `Lv. ${rival.level}` },
                           { label: 'Battle History', val: `${rival.raceCount} Races` },
                           { label: 'Win Percent', val: `${Math.round((rival.playerWins / rival.raceCount) * 100)}%` }
                         ].map((s, i) => (
                           <div key={i} className="space-y-1">
                              <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest block opacity-60">{s.label}</span>
                              <span className="font-headline text-sm font-black italic slanted uppercase text-on-surface group-hover/rival:text-glow transition-all">{s.val}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="w-full md:w-auto relative z-10">
                      <button className="w-full md:w-64 h-20 rounded-[28px] bg-secondary border border-white/20 shadow-[0_0_40px_rgba(255,215,9,0.3)] hover:shadow-[0_0_60px_rgba(255,215,9,0.5)] active:scale-95 transition-all duration-500 font-headline text-2xl font-black italic slanted uppercase text-surface flex items-center justify-center gap-4 group/btn relative overflow-hidden">
                         <div className="absolute inset-x-0 bottom-0 h-1 bg-white/40 shadow-[0_0_20px_rgba(255,255,255,1)]" />
                         Engage Rival
                         <span style={{fontSize:'30px', lineHeight:1, display:'inline-block'}} className="group-hover/btn:translate-x-2 transition-transform">⚔</span>
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'LEADERBOARDS':
        return (
          <div className="p-1 rounded-[48px] bg-gradient-to-br from-primary/20 via-white/5 to-transparent border border-white/5 overflow-hidden">
            <div className="rounded-[44px] bg-surface overflow-hidden">
              <div className="px-10 py-10 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="font-headline text-3xl font-black italic slanted uppercase text-on-surface text-glow">Global Ranking Matrix</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant mt-2">100M Technical Freestyle Circuit</p>
                </div>
                <button className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all font-headline font-black italic slanted uppercase text-[10px] tracking-widest text-on-surface-variant hover:text-primary">
                   Switch Circuit
                </button>
              </div>

              <div className="p-4 space-y-2">
                {GlobalLeaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`group/row relative p-6 rounded-[28px] border transition-all duration-500 flex items-center justify-between gap-8 ${
                      entry.rank === 4 
                        ? 'bg-primary/20 border-primary/40 shadow-[0_0_30px_rgba(129,236,255,0.15)] overflow-hidden' 
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    {entry.rank === 4 && <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/40 shadow-[0_0_10px_rgba(129,236,255,1)]" />}
                    
                    <div className="flex items-center gap-8 flex-1">
                      <div className={`font-headline text-4xl font-black italic slanted w-12 text-center ${
                         entry.rank === 1 ? 'text-secondary gold-glow' : entry.rank === 4 ? 'text-primary text-glow' : 'text-on-surface-variant opacity-40'
                      }`}>
                         {entry.rank.toString().padStart(2, '0')}
                      </div>
                      
                      <div className="flex items-center gap-4">
                         <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center ${
                           entry.rank === 4 ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/10'
                         }`}>
                            <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className={entry.rank === 4 ? 'text-primary text-glow' : 'text-on-surface-variant opacity-40'}>
                               {entry.rank === 1 ? '🏆' : '👤'}
                            </span>
                         </div>
                         <div>
                           <div className="font-headline text-xl font-black italic slanted uppercase text-on-surface group-hover/row:text-glow transition-all">
                              {entry.name}
                              {entry.rank === 4 && <span className="ml-3 text-[10px] font-black text-primary animate-pulse italic">(Current Athlete)</span>}
                           </div>
                           <div className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Level {entry.level} Elite</div>
                         </div>
                      </div>
                    </div>

                    <div className="text-right">
                       <div className="font-headline text-2xl font-black italic slanted text-primary text-glow leading-none mb-1">{entry.time}</div>
                       <div className={`text-[10px] font-black uppercase tracking-widest italic ${entry.pb === 'World Record' ? 'text-secondary gold-glow' : 'text-on-surface-variant opacity-60'}`}>
                          {entry.pb}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-8 bg-white/[0.03] text-center">
                 <button className="font-headline font-black italic slanted uppercase text-[11px] tracking-[0.4em] text-on-surface-variant hover:text-on-surface transition-colors">Scan Full Ranking Buffer</button>
              </div>
            </div>
          </div>
        );
      case 'CHAT':
        return (
          <div className="h-[600px] flex flex-col rounded-[40px] bg-surface border border-white/5 overflow-hidden">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]" />
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.4em]">Secure Channel: Global Matrix</span>
               </div>
               <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className="text-on-surface-variant opacity-40">🔐</span>
            </div>

            <div className="flex-1 p-8 overflow-y-auto space-y-6 scrollbar-hide">
              <div className="flex flex-col items-start max-w-[80%]">
                <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-2 ml-4">James Wilson</span>
                <div className="bg-white/5 border border-white/10 rounded-[24px] rounded-tl-none p-5 text-[13px] font-black uppercase text-on-surface-variant leading-relaxed">
                  Terminal analysis confirms elite performance in high-pressure heats. Awaiting rival response.
                </div>
              </div>

              <div className="flex flex-col items-end self-end max-w-[80%]">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-2 mr-4">System Identity: {playerName}</span>
                <div className="bg-primary border border-white/20 rounded-[24px] rounded-tr-none p-5 text-[13px] font-black uppercase text-surface leading-relaxed shadow-[0_0_30px_rgba(129,236,255,0.2)]">
                  Data stream synchronized. Biometric patterns aligned for World Series entry.
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 relative">
              <input
                type="text"
                placeholder="INPUT DATA STREAM..."
                className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl px-6 font-headline font-black italic slanted uppercase text-[14px] text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/40 focus:bg-primary/5 transition-all text-glow"
              />
              <button className="absolute right-12 top-11 text-primary hover:text-glow transition-all">
                 <span style={{fontSize:'30px', lineHeight:1, display:'inline-block'}}>➤</span>
              </button>
            </div>
          </div>
        );
      case 'GHOSTS':
        return (
          <div className="p-1 rounded-[48px] bg-gradient-to-br from-white/20 to-transparent border border-white/5 overflow-hidden">
             <div className="p-20 rounded-[44px] bg-surface flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-40 pointer-events-none" />
                
                <div className="h-24 w-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                   <span style={{fontSize:'60px', lineHeight:1, display:'inline-block'}} className="text-on-surface-variant opacity-40 animate-pulse">👻</span>
                </div>
                
                <h3 className="font-headline text-3xl font-black italic slanted uppercase text-on-surface text-glow mb-2">Simulated Entities</h3>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-on-surface-variant opacity-60 mb-12">Download and engage phantom biometric sequences</p>
                
                <button className="h-20 px-12 rounded-[28px] bg-primary border border-white/20 shadow-[0_0_40px_rgba(129,236,255,0.2)] hover:shadow-[0_0_60px_rgba(129,236,255,0.4)] transition-all duration-500 font-headline text-xl font-black italic slanted uppercase text-surface flex items-center justify-center gap-4 group/ghost">
                   Browse Ghost Archives
                   <span style={{fontSize:'30px', lineHeight:1, display:'inline-block'}} className="group-hover/ghost:translate-x-2 transition-transform">⬇</span>
                </button>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`hydro-page-shell flex-1 relative w-full h-full font-body ${isLandscapeMobile ? 'overflow-hidden' : 'overflow-y-auto'}`}>
      <PaneSwitcher
        panes={[
          {
            id: 'FRIENDS',
            label: 'FRIENDS',
            icon: <span>👥</span>,
            content: <div className="p-8 h-full overflow-y-auto pb-20 scrollbar-hide">{renderTab()}</div>
          },
          {
            id: 'RIVALS',
            label: 'RIVALS',
            icon: <span>⚡</span>,
            content: <div className="p-8 h-full overflow-y-auto pb-20 scrollbar-hide">{renderTab()}</div>
          },
          {
            id: 'LEADERBOARDS',
            label: 'RANKINGS',
            icon: <span>📊</span>,
            content: <div className="p-8 h-full overflow-y-auto pb-20 scrollbar-hide">{renderTab()}</div>
          },
          {
            id: 'CHAT',
            label: 'CHAT',
            icon: <span>💬</span>,
            content: <div className="p-8 h-full overflow-y-auto pb-20 scrollbar-hide text-sm">{renderTab()}</div>
          }
        ]}
        activePaneId={activeTab}
        onPaneChange={(id) => setActiveTab(id as SocialTab)}
      >
        <div className="flex flex-col flex-1">
          {/* Cinematic Header */}
          <div className="p-12 max-[900px]:p-8 bg-gradient-to-b from-primary/15 to-transparent border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between gap-8 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-12 bg-primary/40" />
              <div className="flex items-center gap-2">
                <span style={{fontSize:'14px', lineHeight:1, display:'inline-block'}} className="text-primary animate-pulse">⊕</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Global Athlete Network Active</span>
              </div>
            </div>
            
            <h1 className="font-headline text-5xl max-[900px]:text-3xl font-black italic slanted uppercase text-on-surface text-glow">
              Athlete Network
            </h1>
          </div>
          
          <div className="flex items-center gap-8 p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-3xl">
             <div className="text-center group cursor-pointer">
               <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block group-hover:text-primary transition-colors">Connections</span>
               <span className="font-headline text-2xl font-black italic slanted text-primary text-glow">{Friends.length} Active</span>
             </div>
             <div className="h-10 w-[1px] bg-white/10" />
             <div className="text-center group cursor-pointer">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block group-hover:text-secondary transition-colors">Rivalries</span>
                <span className="font-headline text-2xl font-black italic slanted text-secondary gold-glow">{Rivals.length} Tracked</span>
             </div>
          </div>
        </div>
      </div>

      <div className="hydro-page-content p-8 max-w-7xl mx-auto w-full space-y-12 pb-24">
        {/* Tab Navigation */}
        <div className="flex gap-4 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-10 py-5 rounded-[24px] font-headline font-black italic slanted uppercase text-[11px] tracking-widest transition-all duration-500 border overflow-hidden flex items-center gap-4 ${
                activeTab === tab.id
                  ? 'bg-primary/20 border-primary/40 text-primary text-glow'
                  : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20 hover:text-on-surface'
              }`}
            >
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center border transition-all ${
                activeTab === tab.id ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/10'
              }`}>
                 <span style={{fontSize:'20px', lineHeight:1, display:'inline-block'}} className="italic">{tab.id === 'FRIENDS' ? '👥' : tab.id === 'RIVALS' ? '⚡' : tab.id === 'LEADERBOARDS' ? '📊' : tab.id === 'CHAT' ? '💬' : '👻'}</span>
              </div>
              {tab.label}
              {tab.count > 0 && (
                 <span className="ml-2 px-2 py-0.5 rounded-lg bg-primary text-surface text-[10px] font-black italic animate-pulse">{tab.count}</span>
              )}
              <div className="absolute inset-x-0 bottom-0 h-[3px] bg-primary scale-x-0 transition-transform duration-500 origin-left activeTab === tab.id && 'scale-x-100'" />
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-500">{renderTab()}</div>
      </div>
        </div>
      </PaneSwitcher>
    </div>
  );
};

export default SocialScreen;
