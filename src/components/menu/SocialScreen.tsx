/**
 * Social Screen - Community and competition
 * Friends, rivals, leaderboards, club chat, ghost races
 */

import React, { useState } from 'react';

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

export const SocialScreen: React.FC<SocialScreenProps> = ({ playerName = 'Swimmer' }) => {
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
          <div className="space-y-3">
            {Friends.map((friend) => (
              <div
                key={friend.id}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 hover:bg-slate-600/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        friend.online ? 'bg-emerald-500' : 'bg-slate-500'
                      }`}
                    ></div>
                    <div>
                      <div className="font-bold text-white">{friend.name}</div>
                      <div className="text-xs text-slate-400">{friend.lastSeen}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">Level {friend.level}</div>
                    <div className="text-xs text-cyan-400">{friend.rank}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 px-3 py-2 bg-cyan-500/30 hover:bg-cyan-500/50 rounded text-xs font-bold text-cyan-300 transition-colors">
                    Challenge
                  </button>
                  <button className="flex-1 px-3 py-2 bg-slate-600/30 hover:bg-slate-600/50 rounded text-xs font-bold text-slate-300 transition-colors">
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'RIVALS':
        return (
          <div className="space-y-3">
            {Rivals.map((rival) => (
              <div
                key={rival.id}
                className="bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-lg p-4 border border-rose-500/30 hover:from-rose-500/30 hover:to-pink-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-black text-white text-lg">{rival.name}</div>
                    <div className="text-sm text-slate-400">{rival.specialty}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">Level {rival.level}</div>
                    <div
                      className={`text-xs font-bold ${
                        rival.difficulty === 'HARD'
                          ? 'text-red-400'
                          : rival.difficulty === 'NORMAL'
                          ? 'text-yellow-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {rival.difficulty}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div>
                    <div className="text-slate-400">Races</div>
                    <div className="font-bold text-white">{rival.raceCount}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Wins</div>
                    <div className="font-bold text-emerald-400">{rival.playerWins}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Losses</div>
                    <div className="font-bold text-red-400">{rival.raceCount - rival.playerWins}</div>
                  </div>
                </div>
                <button className="w-full px-3 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:shadow-lg hover:shadow-rose-500/30 rounded text-sm font-bold text-white transition-all">
                  Challenge Rival
                </button>
              </div>
            ))}
          </div>
        );
      case 'LEADERBOARDS':
        return (
          <div className="space-y-4">
            {/* Global Leaderboard */}
            <div className="bg-slate-700/50 rounded-lg overflow-hidden border border-slate-600/30">
              <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-600/30 font-bold text-white">
                Global 100M Freestyle
              </div>
              <div className="divide-y divide-slate-600/30">
                {GlobalLeaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`px-6 py-3 flex items-center justify-between hover:bg-slate-600/50 transition-colors ${
                      entry.rank === 4 ? 'bg-cyan-500/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="font-black text-xl text-slate-400 w-8 text-center">{entry.rank}</div>
                      <div>
                        <div className="font-bold text-white">{entry.name}</div>
                        <div className="text-xs text-slate-400">Level {entry.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-400 font-mono font-bold">{entry.time}</div>
                      <div className="text-xs text-slate-400">{entry.pb}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'CHAT':
        return (
          <div className="h-96 flex flex-col bg-slate-700/50 rounded-lg border border-slate-600/30">
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="bg-slate-600/50 rounded p-3">
                <div className="text-xs text-slate-400 mb-1">James Wilson</div>
                <div className="text-white">Hey! Nice win yesterday!</div>
              </div>
              <div className="bg-cyan-500/20 rounded p-3 ml-12">
                <div className="text-xs text-slate-400 mb-1">You</div>
                <div className="text-white">Thanks! Your breaststroke is getting really fast</div>
              </div>
            </div>
            <div className="border-t border-slate-600/30 p-4">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full bg-slate-600/50 border border-slate-600/30 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        );
      case 'GHOSTS':
        return (
          <div className="space-y-3">
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <div className="text-sm text-slate-400 mb-3">Download and race against ghost data</div>
              <button className="w-full px-4 py-3 bg-cyan-500/30 hover:bg-cyan-500/50 rounded-lg text-cyan-300 font-bold transition-colors">
                Browse Ghost Library
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Social</h1>
          <p className="text-slate-400">Connect, compete, and track progress</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold uppercase text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span className="ml-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-white">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>{renderTab()}</div>
      </div>
    </div>
  );
};

export default SocialScreen;
