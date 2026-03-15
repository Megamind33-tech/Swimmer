/**
 * Club Screen - Dynasty builder
 * Club overview, facilities, roster, relay, staff, branding, treasury
 */

import React, { useState } from 'react';

type ClubTab = 'OVERVIEW' | 'FACILITIES' | 'ROSTER' | 'RELAY' | 'STAFF' | 'BRANDING' | 'TREASURY';

interface Facility {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  benefit: string;
  nextUpgradeCost: number;
}

interface ClubMember {
  id: string;
  name: string;
  level: number;
  specialty: string;
  joinDate: string;
  relayPosition?: number;
}

interface ClubScreenProps {
  clubName?: string;
}

const Facilities: Facility[] = [
  {
    id: 'pool',
    name: 'Olympic Pool',
    level: 3,
    maxLevel: 5,
    benefit: '+15% training efficiency',
    nextUpgradeCost: 5000,
  },
  {
    id: 'gym',
    name: 'Training Gym',
    level: 2,
    maxLevel: 5,
    benefit: '+10% strength gains',
    nextUpgradeCost: 3000,
  },
  {
    id: 'recovery',
    name: 'Recovery Lab',
    level: 1,
    maxLevel: 5,
    benefit: '+20% recovery speed',
    nextUpgradeCost: 4000,
  },
  {
    id: 'analytics',
    name: 'Analytics Center',
    level: 2,
    maxLevel: 5,
    benefit: '+15% race insights',
    nextUpgradeCost: 3500,
  },
  {
    id: 'nutrition',
    name: 'Nutrition Center',
    level: 1,
    maxLevel: 4,
    benefit: '+12% stamina',
    nextUpgradeCost: 3000,
  },
  {
    id: 'media',
    name: 'Media Room',
    level: 2,
    maxLevel: 4,
    benefit: '+10% fame gain',
    nextUpgradeCost: 2500,
  },
];

const ClubMembers: ClubMember[] = [
  {
    id: '1',
    name: 'You',
    level: 45,
    specialty: 'Freestyle',
    joinDate: 'Mar 1, 2025',
    relayPosition: 1,
  },
  {
    id: '2',
    name: 'James Chen',
    level: 42,
    specialty: 'Butterfly',
    joinDate: 'Jan 15, 2025',
    relayPosition: 2,
  },
  {
    id: '3',
    name: 'Maya Patel',
    level: 39,
    specialty: 'Breaststroke',
    joinDate: 'Feb 20, 2025',
    relayPosition: 3,
  },
  {
    id: '4',
    name: 'Alex Wilson',
    level: 41,
    specialty: 'Backstroke',
    joinDate: 'Dec 10, 2024',
    relayPosition: 4,
  },
  {
    id: '5',
    name: 'Sofia Rossi',
    level: 38,
    specialty: 'IM',
    joinDate: 'Feb 1, 2025',
  },
  {
    id: '6',
    name: 'Marcus Johnson',
    level: 36,
    specialty: 'Freestyle',
    joinDate: 'Mar 5, 2026',
  },
];

export const ClubScreen: React.FC<ClubScreenProps> = ({ clubName = 'Aqua Dragons' }) => {
  const [activeTab, setActiveTab] = useState<ClubTab>('OVERVIEW');
  const [relayOrder, setRelayOrder] = useState<string[]>(['1', '2', '3', '4']);

  const tabs: { id: ClubTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'OVERVIEW',
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M9 21h6a2 2 0 002-2V9l-7-4-7 4v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'FACILITIES',
      label: 'Facilities',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'ROSTER',
      label: 'Roster',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zM5 20a3 3 0 015.856-1.487M5 10a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'RELAY',
      label: 'Relay',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'STAFF',
      label: 'Staff',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
    {
      id: 'BRANDING',
      label: 'Branding',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a6 6 0 016 6v10a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a6 6 0 00-6-6H7a2 2 0 00-2 2v4a6 6 0 006 6z" />
        </svg>
      ),
    },
    {
      id: 'TREASURY',
      label: 'Treasury',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'OVERVIEW':
        return (
          <div className="space-y-6">
            {/* Club Info */}
            <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg p-6 border border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">{clubName}</h2>
                  <div className="space-y-1 text-sm text-slate-300">
                    <div>Founded: January 15, 2024</div>
                    <div>Members: {ClubMembers.length}</div>
                    <div>Global Rank: #156</div>
                  </div>
                </div>
                <div className="text-6xl">🏊</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Wins', value: '1,247', color: 'from-emerald-500 to-teal-500' },
                { label: 'Member Level', value: '42 avg', color: 'from-blue-500 to-cyan-500' },
                { label: 'Treasury', value: '45,000', color: 'from-yellow-500 to-amber-500' },
                { label: 'Fame', value: '8,500', color: 'from-purple-500 to-pink-500' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${stat.color} opacity-20 rounded-lg p-4 border border-gray-600/30`}
                >
                  <div className="text-xs text-slate-400 mb-1">{stat.label}</div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'FACILITIES':
        return (
          <div className="space-y-4">
            {Facilities.map((facility) => (
              <div key={facility.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white">{facility.name}</h3>
                    <p className="text-sm text-slate-400">Level {facility.level}/{facility.maxLevel}</p>
                  </div>
                  <div className="text-sm text-cyan-400 font-bold">{facility.benefit}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-600/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${(facility.level / facility.maxLevel) * 100}%` }}
                    ></div>
                  </div>
                  <button className="px-4 py-2 bg-cyan-500/30 hover:bg-cyan-500/50 rounded text-sm font-bold text-cyan-300 transition-colors">
                    Upgrade ({facility.nextUpgradeCost})
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'ROSTER':
        return (
          <div className="space-y-3">
            {ClubMembers.map((member) => (
              <div
                key={member.id}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 hover:bg-slate-600/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{member.name}</div>
                    <div className="text-sm text-slate-400">
                      {member.specialty} • Joined {member.joinDate}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">Level {member.level}</div>
                    {member.relayPosition && (
                      <div className="text-xs text-cyan-400">Relay #{member.relayPosition}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'RELAY':
        return (
          <div className="space-y-4">
            <div className="bg-cyan-500/20 rounded-lg p-4 border border-cyan-500/30">
              <h3 className="font-bold text-white mb-3">Relay Order (4x100M Medley)</h3>
              <div className="space-y-2">
                {relayOrder.map((memberId, idx) => {
                  const member = ClubMembers.find((m) => m.id === memberId);
                  return (
                    <div
                      key={idx}
                      className="bg-slate-600/50 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white">Leg {idx + 1}</div>
                        <div className="text-sm text-slate-400">{member?.name || 'Not Selected'}</div>
                      </div>
                      <div className="text-sm text-cyan-400 font-bold">{member?.specialty || '-'}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 'STAFF':
        return (
          <div className="space-y-3">
            {[
              { role: 'Head Coach', name: 'Robert Smith', specialty: 'Distance Expert', salary: 2000 },
              {
                role: 'Assistant Coach',
                name: 'Lisa Chen',
                specialty: 'Stroke Specialist',
                salary: 1500,
              },
              { role: 'Physiotherapist', name: 'Marcus Brown', specialty: 'Recovery', salary: 1200 },
              { role: 'Scout', name: 'Emma Wilson', specialty: 'Talent Finder', salary: 800 },
            ].map((staff, idx) => (
              <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{staff.role}</div>
                    <div className="text-sm text-slate-400">{staff.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-yellow-400 font-bold">{staff.salary}/month</div>
                    <div className="text-xs text-slate-400">{staff.specialty}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'BRANDING':
        return (
          <div className="space-y-6">
            {/* Club Logo */}
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
              <h3 className="font-bold text-white mb-4">Club Logo</h3>
              <div className="w-32 h-32 rounded-lg bg-slate-600 flex items-center justify-center text-5xl mb-4">
                🏊
              </div>
              <button className="px-4 py-2 bg-cyan-500/30 hover:bg-cyan-500/50 rounded text-sm font-bold text-cyan-300 transition-colors">
                Change Logo
              </button>
            </div>

            {/* Colors */}
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
              <h3 className="font-bold text-white mb-4">Club Colors</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {['Primary: Cyan', 'Secondary: Blue', 'Accent: White'].map((color) => (
                  <div key={color} className="bg-slate-600/50 rounded-lg p-4 text-center">
                    <div className="text-sm font-bold text-white">{color}</div>
                  </div>
                ))}
              </div>
              <button className="px-4 py-2 bg-cyan-500/30 hover:bg-cyan-500/50 rounded text-sm font-bold text-cyan-300 transition-colors">
                Customize Colors
              </button>
            </div>
          </div>
        );
      case 'TREASURY':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 rounded-lg p-6 border border-yellow-500/30">
              <h3 className="text-xl font-black text-white mb-3">Club Treasury</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Available Balance:</span>
                  <span className="font-bold text-yellow-300">45,000 Coins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Monthly Income:</span>
                  <span className="font-bold text-emerald-300">+8,500 Coins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Monthly Expenses:</span>
                  <span className="font-bold text-red-300">-6,200 Coins</span>
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
    <div className="w-full h-full overflow-y-auto p-8 space-y-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Club HQ</h1>
          <p className="text-slate-400">Manage your swimming club and dynasty</p>
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
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>{renderTab()}</div>
      </div>
    </div>
  );
};

export default ClubScreen;
