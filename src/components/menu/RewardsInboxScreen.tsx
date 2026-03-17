/**
 * Rewards / Inbox Screen - Claim center
 * Daily login rewards, event rewards, ranking payouts, season rewards, compensation
 */

import React, { useState } from 'react';
import rewardsBackdropImage from '../../designs/custom_backgrounds/16GDP8cMj1ZeAFtQhML30ak33nG3RZIaL.jpg';

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
    description: 'Congratulations! You have logged in 7 days in a row.',
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
    description: 'You have unlocked tier 25 of the season pass!',
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
          <div className="space-y-6">
            {ClaimableRewards.filter((r) => !r.claimed && !claimedItems.has(r.id)).length === 0 ? (
              <div className="relative group p-1 rounded-[48px] bg-gradient-to-br from-primary/20 to-transparent overflow-hidden">
                <div className="p-16 rounded-[44px] bg-surface flex flex-col items-center justify-center text-center">
                  <div className="h-24 w-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
                    <span className="material-symbols-outlined text-5xl text-primary animate-pulse">done_all</span>
                  </div>
                  <h3 className="font-headline text-3xl font-black italic slanted uppercase text-on-surface text-glow mb-2">Terminal Clear</h3>
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-on-surface-variant opacity-60">All biometric rewards synchronized</p>
                </div>
              </div>
            ) : (
              <>
                {ClaimableRewards.filter((r) => !r.claimed && !claimedItems.has(r.id)).map((reward) => (
                  <div
                    key={reward.id}
                    className="group/reward relative p-1 rounded-[40px] bg-gradient-to-br from-white/10 to-transparent hover:from-primary/40 transition-all duration-500 overflow-hidden"
                  >
                     <div className="relative z-10 p-8 rounded-[36px] bg-surface overflow-hidden">
                        {/* Status Background */}
                        <div className={`absolute -right-20 -top-20 h-64 w-64 blur-3xl opacity-10 ${
                          reward.type === 'SEASON' || reward.type === 'REWARD' ? 'bg-secondary' : 'bg-primary'
                        }`} />

                        <div className="flex items-start justify-between gap-8 mb-8 relative z-10">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`h-[2px] w-8 ${reward.type === 'SEASON' || reward.type === 'REWARD' ? 'bg-secondary' : 'bg-primary'}`} />
                              <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.4em]">{reward.from} / {reward.type} Dossier</span>
                            </div>
                            <h3 className="font-headline text-3xl font-black italic slanted uppercase text-on-surface text-glow">{reward.title}</h3>
                          </div>
                          <div className="text-right">
                             <div className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Timestamp</div>
                             <div className="text-[13px] font-headline font-black italic slanted text-on-surface uppercase">{reward.date}</div>
                          </div>
                        </div>

                        <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-tight leading-relaxed mb-10 max-w-2xl relative z-10">
                          {reward.description}
                        </p>

                        {reward.rewards && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 relative z-10">
                            {reward.rewards.xp && (
                              <div className="p-6 rounded-[28px] bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center group-hover/reward:bg-primary/5 transition-colors">
                                <div className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Efficiency Boost</div>
                                <div className="font-headline text-3xl font-black italic slanted text-primary text-glow">{reward.rewards.xp} XP</div>
                              </div>
                            )}
                            {reward.rewards.coins && (
                              <div className="p-6 rounded-[28px] bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center group-hover/reward:bg-secondary/5 transition-colors">
                                <div className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Operational Credits</div>
                                <div className="font-headline text-3xl font-black italic slanted text-secondary gold-glow">{reward.rewards.coins} CR</div>
                              </div>
                            )}
                            {reward.rewards.premium && (
                              <div className="p-6 rounded-[28px] bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center group-hover/reward:bg-secondary/5 transition-colors">
                                <div className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Elite Fragments</div>
                                <div className="font-headline text-3xl font-black italic slanted text-secondary gold-glow">◆ {reward.rewards.premium}</div>
                              </div>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => handleClaim(reward.id)}
                          className={`w-full h-20 rounded-[28px] transition-all duration-500 font-headline text-2xl font-black italic slanted uppercase flex items-center justify-center gap-4 relative overflow-hidden group/btn ${
                            reward.type === 'SEASON' || reward.type === 'REWARD'
                              ? 'bg-secondary text-surface shadow-[0_0_40px_rgba(255,215,9,0.2)] hover:shadow-[0_0_60px_rgba(255,215,9,0.4)]'
                              : 'bg-primary text-surface shadow-[0_0_40px_rgba(129,236,255,0.2)] hover:shadow-[0_0_60px_rgba(129,236,255,0.4)]'
                          }`}
                        >
                           <div className="absolute inset-x-0 bottom-0 h-1 bg-white/40 shadow-[0_0_20px_rgba(255,255,255,1)]" />
                           Claim Dossier
                           <span className="material-symbols-outlined text-3xl group-hover/btn:translate-x-2 transition-transform">download</span>
                        </button>
                     </div>
                  </div>
                ))}

                <button
                  onClick={onClaimAll}
                  className="w-full h-24 rounded-[32px] bg-white/5 border border-white/10 hover:border-primary/40 transition-all duration-500 font-headline text-2xl font-black italic slanted uppercase text-on-surface-variant hover:text-primary flex items-center justify-center gap-6 group/all"
                >
                  <span className="material-symbols-outlined text-4xl group-hover/all:rotate-180 transition-transform duration-700">sync</span>
                  Batch Claim Operations
                  <span className="h-[2px] w-24 bg-white/10 group-hover:bg-primary/40 transition-colors" />
                </button>
              </>
            )}
          </div>
        );
      case 'INBOX':
        return (
          <div className="space-y-4">
            {InboxMessages.map((message) => (
              <div 
                key={message.id} 
                className="group/msg relative p-6 rounded-[28px] bg-white/5 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between gap-8"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{message.from}</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">{message.date}</span>
                  </div>
                  <h3 className="font-headline text-xl font-black italic slanted uppercase text-on-surface group-hover/msg:text-glow transition-all mb-1">{message.title}</h3>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-tight opacity-80">{message.description}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/msg:bg-primary/20 group-hover/msg:border-primary/40 transition-all">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover/msg:text-primary">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        );
      case 'HISTORY':
        return (
          <div className="rounded-[40px] bg-surface border border-white/5 overflow-hidden">
            <div className="p-10 border-b border-white/5">
               <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Activity Logs</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant mt-2">Historical synchronization records</p>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {[
                  { date: 'Mar 14', item: 'Daily Login Bonus', reward: '+ 300 XP', active: true },
                  { date: 'Mar 13', item: 'Time Trial Victory', reward: '+ 150 XP + 800 CR', active: false },
                  { date: 'Mar 12', item: 'Weekly Ranking Payout', reward: '+ 2000 CR', active: false },
                  { date: 'Mar 11', item: 'Daily Login Bonus', reward: '+ 300 XP', active: false },
                ].map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group/row">
                    <div className="flex items-center gap-6">
                      <div className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest w-16">{entry.date}</div>
                      <div>
                        <div className="font-headline text-base font-black italic slanted uppercase text-on-surface group-hover/row:text-primary transition-colors">{entry.item}</div>
                        <div className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest mt-1">Status: Recorded</div>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="font-headline text-lg font-black italic slanted text-primary text-glow">{entry.reward}</span>
                       <span className="material-symbols-outlined text-emerald-400 text-sm ml-4 align-middle">verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 bg-white/[0.03] text-center">
               <button className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant hover:text-on-surface transition-colors">Load Full History Matrix</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="hydro-page-shell flex-1 relative w-full h-full overflow-y-auto flex flex-col font-body">
      <img src={rewardsBackdropImage} alt="Rewards background" className="absolute inset-0 h-full w-full object-cover pointer-events-none" />
      {/* Cinematic Header */}
      <div className="p-12 max-[900px]:p-8 bg-gradient-to-b from-primary/15 to-transparent border-b border-white/5 relative overflow-hidden z-10">
        <div className="absolute top-0 right-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between gap-8 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-12 bg-primary/40" />
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm animate-pulse">move_to_inbox</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Terminal Recognition In-Progress</span>
              </div>
            </div>
            
            <h1 className="font-headline text-5xl max-[900px]:text-3xl font-black italic slanted uppercase text-on-surface text-glow">
              Rewards Terminal
            </h1>
          </div>
          
          <div className="flex items-center gap-10 p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-3xl">
             <div className="text-center">
               <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Unclaimed</span>
               <span className="font-headline text-2xl font-black italic slanted text-primary text-glow">
                 {tabs[0].count}
               </span>
             </div>
             <div className="h-12 w-[1px] bg-white/10" />
             <div className="text-center">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Total Value</span>
                <span className="font-headline text-2xl font-black italic slanted text-secondary gold-glow">8.2k CR</span>
             </div>
          </div>
        </div>
      </div>

      <div className="hydro-page-content p-8 max-w-5xl mx-auto w-full space-y-12 pb-24 relative z-10">
        {/* Tab Navigation */}
        <div className="flex gap-4 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-10 py-5 rounded-[24px] font-headline font-black italic slanted uppercase text-[11px] tracking-widest transition-all duration-500 border overflow-hidden ${
                activeTab === tab.id
                  ? 'bg-primary/20 border-primary/40 text-primary text-glow'
                  : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20 hover:text-on-surface'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-4 px-2 py-0.5 rounded-lg bg-primary text-surface text-[10px] font-black animate-pulse">
                  {tab.count}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 h-[3px] bg-primary scale-x-0 transition-transform duration-500 origin-left activeTab === tab.id && 'scale-x-100'" />
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-500">{renderTab()}</div>
      </div>
    </div>
  );
};

export default RewardsInboxScreen;
