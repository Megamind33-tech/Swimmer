/**
 * Rewards / Inbox Screen - Claim center
 * Daily login rewards, event rewards, ranking payouts, season rewards, compensation
 */

import React, { useState } from 'react';

type InboxTab = 'CLAIMABLE' | 'INBOX' | 'HISTORY';

interface InboxMessage {
  id: string;
  from: string;
  type: 'REWARD' | 'EVENT' | 'RANK' | 'SEASON' | 'GIFT' | 'SYSTEM';
  title: string;
  description: string;
  rewards?: { xp?: number; coins?: number; premium?: number };
  date: string;
  claimed?: boolean;
}

interface RewardsInboxScreenProps {
  onClaimAll?: () => void;
}

const ClaimableRewards: InboxMessage[] = [
  {
    id: '1',
    from: 'Daily Login',
    type: 'REWARD',
    title: 'Day 7 Streak Bonus',
    description: 'Congratulations! You've logged in 7 days in a row.',
    rewards: { xp: 300, coins: 1000, premium: 50 },
    date: 'Today',
    claimed: false,
  },
  {
    id: '2',
    from: 'Sprint Cup Event',
    type: 'EVENT',
    title: 'Event Completion Reward',
    description: 'You completed the World Sprint Cup. Here are your rewards!',
    rewards: { xp: 500, coins: 3000 },
    date: 'Today',
    claimed: false,
  },
  {
    id: '3',
    from: 'Ranking System',
    type: 'RANK',
    title: 'Weekly Ranking Payout',
    description: 'You finished #1,234 in global rankings. Here is your payout.',
    rewards: { coins: 2500 },
    date: 'Today',
    claimed: false,
  },
  {
    id: '4',
    from: 'Season Rewards',
    type: 'SEASON',
    title: 'Tier 25 Unlocked',
    description: 'You've unlocked tier 25 of the season pass!',
    rewards: { xp: 250, premium: 100 },
    date: 'Yesterday',
    claimed: false,
  },
];

const InboxMessages: InboxMessage[] = [
  {
    id: 'msg-1',
    from: 'Support Team',
    type: 'SYSTEM',
    title: 'Welcome to Swim 26!',
    description: 'Thank you for joining our swimming community. We hope you enjoy the game!',
    date: '2 days ago',
    claimed: true,
  },
  {
    id: 'msg-2',
    from: 'James Wilson',
    type: 'GIFT',
    title: 'Friend Gift - Lucky Draw',
    description: 'Your friend James sent you a lucky draw ticket!',
    rewards: { xp: 100 },
    date: '3 days ago',
    claimed: true,
  },
  {
    id: 'msg-3',
    from: 'Developer',
    type: 'SYSTEM',
    title: 'Patch Notes v1.2.0',
    description: 'New features and bug fixes have been deployed.',
    date: '4 days ago',
    claimed: true,
  },
];

export const RewardsInboxScreen: React.FC<RewardsInboxScreenProps> = ({ onClaimAll }) => {
  const [activeTab, setActiveTab] = useState<InboxTab>('CLAIMABLE');
  const [claimedItems, setClaimedItems] = useState<Set<string>>(new Set());

  const tabs: { id: InboxTab; label: string; count: number }[] = [
    { id: 'CLAIMABLE', label: 'Claimable', count: ClaimableRewards.filter((r) => !r.claimed).length },
    { id: 'INBOX', label: 'Inbox', count: InboxMessages.length },
    { id: 'HISTORY', label: 'History', count: 24 },
  ];

  const handleClaim = (itemId: string) => {
    setClaimedItems((prev) => new Set([...prev, itemId]));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'REWARD':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'EVENT':
        return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
      case 'RANK':
        return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
      case 'SEASON':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      case 'GIFT':
        return 'bg-pink-500/20 border-pink-500/30 text-pink-400';
      case 'SYSTEM':
        return 'bg-slate-600/20 border-slate-600/30 text-slate-400';
      default:
        return 'bg-slate-600/20 border-slate-600/30 text-slate-400';
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'CLAIMABLE':
        return (
          <div className="space-y-4">
            {ClaimableRewards.filter((r) => !r.claimed && !claimedItems.has(r.id)).length === 0 ? (
              <div className="bg-slate-700/50 rounded-lg p-8 text-center border border-slate-600/30">
                <div className="text-5xl mb-3">✓</div>
                <div className="text-lg font-bold text-white mb-1">All Rewards Claimed!</div>
                <p className="text-slate-400">Check back soon for more rewards</p>
              </div>
            ) : (
              <>
                {ClaimableRewards.filter((r) => !r.claimed && !claimedItems.has(r.id)).map((reward) => (
                  <div
                    key={reward.id}
                    className={`rounded-lg p-6 border ${getTypeColor(reward.type)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs font-bold uppercase opacity-75 mb-1">{reward.from}</div>
                        <h3 className="text-lg font-black text-white">{reward.title}</h3>
                      </div>
                      <span className="text-xs font-bold opacity-50">{reward.date}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">{reward.description}</p>

                    {reward.rewards && (
                      <div className="grid grid-cols-3 gap-2 mb-4 py-4 border-y border-current/20">
                        {reward.rewards.xp && (
                          <div className="text-center">
                            <div className="text-2xl font-black">{reward.rewards.xp}</div>
                            <div className="text-xs opacity-75">XP</div>
                          </div>
                        )}
                        {reward.rewards.coins && (
                          <div className="text-center">
                            <div className="text-2xl font-black">{reward.rewards.coins}</div>
                            <div className="text-xs opacity-75">Coins</div>
                          </div>
                        )}
                        {reward.rewards.premium && (
                          <div className="text-center">
                            <div className="text-2xl font-black">◆ {reward.rewards.premium}</div>
                            <div className="text-xs opacity-75">Premium</div>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => handleClaim(reward.id)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 text-white font-black rounded-lg transition-all"
                    >
                      Claim Reward
                    </button>
                  </div>
                ))}

                <button
                  onClick={onClaimAll}
                  className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/50 text-white font-black rounded-lg transition-all text-lg"
                >
                  Claim All Rewards
                </button>
              </>
            )}
          </div>
        );
      case 'INBOX':
        return (
          <div className="space-y-3">
            {InboxMessages.map((message) => (
              <div key={message.id} className={`rounded-lg p-4 border ${getTypeColor(message.type)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-xs font-bold uppercase opacity-75">{message.from}</div>
                    <h3 className="font-bold text-white">{message.title}</h3>
                  </div>
                  <span className="text-xs opacity-50">{message.date}</span>
                </div>
                <p className="text-sm opacity-90">{message.description}</p>
                {message.rewards && (
                  <div className="mt-3 flex gap-3 text-xs">
                    {message.rewards.xp && <span>+{message.rewards.xp} XP</span>}
                    {message.rewards.coins && <span>+{message.rewards.coins} Coins</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'HISTORY':
        return (
          <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
            <h3 className="text-lg font-black text-white mb-4">Claimed Rewards History</h3>
            <div className="space-y-2">
              {[
                { date: 'Mar 14', item: 'Daily Login Bonus', reward: '✓ 300 XP' },
                { date: 'Mar 13', item: 'Time Trial Victory', reward: '✓ 150 XP + 800 Coins' },
                { date: 'Mar 12', item: 'Weekly Ranking Payout', reward: '✓ 2000 Coins' },
                { date: 'Mar 11', item: 'Daily Login Bonus', reward: '✓ 300 XP' },
              ].map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-slate-600/30 last:border-0">
                  <div>
                    <div className="font-bold text-white">{entry.item}</div>
                    <div className="text-xs text-slate-400">{entry.date}</div>
                  </div>
                  <div className="text-emerald-400 font-bold">{entry.reward}</div>
                </div>
              ))}
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
          <h1 className="text-4xl font-black text-white mb-2">Rewards & Inbox</h1>
          <p className="text-slate-400">Claim your rewards and check messages</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-3 rounded-lg font-bold uppercase text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-black">
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

export default RewardsInboxScreen;
