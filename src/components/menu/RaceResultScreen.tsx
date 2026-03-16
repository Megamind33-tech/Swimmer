/**
 * Race Result Screen - Results and rewards
 * Podium, time/splits, medals, XP, rewards, next actions
 */

import React from 'react';

interface RaceResultScreenProps {
  playerRank?: number;
  playerTime?: string;
  playerName?: string;
  onContinue?: () => void;
  onRematch?: () => void;
  onReturnHome?: () => void;
  onWatchReplay?: () => void;
}

export const RaceResultScreen: React.FC<RaceResultScreenProps> = ({
  playerRank = 1,
  playerTime = '00:51.23',
  playerName = 'You',
  onContinue,
  onRematch,
  onReturnHome,
  onWatchReplay,
}) => {
  const isWinner = playerRank === 1;
  const isMedal = playerRank <= 3;

  const finishResults = [
    { rank: 1, name: playerName, time: playerTime, medal: '🥇' },
    { rank: 2, name: 'Kaito M.', time: '00:52.15', medal: '🥈' },
    { rank: 3, name: 'Luna S.', time: '00:53.42', medal: '🥉' },
    { rank: 4, name: 'Alex J.', time: '00:54.87', medal: '' },
  ];

  const splits = [
    { lap: '25m', time: '00:12.45' },
    { lap: '50m', time: '00:25.02' },
    { lap: '75m', time: '00:38.12' },
    { lap: '100m', time: '00:51.23' },
  ];

  return (
    <div className="flex-1 relative w-full h-full overflow-y-auto flex flex-col font-body pb-40">
      {/* Cinematic Announcement Header */}
      <div className={`p-16 max-[900px]:p-10 relative overflow-hidden flex flex-col items-center text-center ${
        isWinner ? 'bg-secondary/10 border-b border-secondary/20' : 'bg-primary/10 border-b border-white/5'
      }`}>
        {/* Animated Background Elements */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-full opacity-20 blur-[120px] rounded-full ${
          isWinner ? 'bg-secondary' : 'bg-primary'
        }`} />
        
        <div className="relative z-10 space-y-4">
           <div className="flex items-center justify-center gap-4 mb-2">
              <span className={`h-px w-16 ${isWinner ? 'bg-secondary' : 'bg-primary'}`} />
              <div className="flex items-center gap-2">
                 <span className={`material-symbols-outlined text-sm animate-pulse ${isWinner ? 'text-secondary' : 'text-primary'}`}>
                    {isWinner ? 'military_tech' : 'flag'}
                 </span>
                 <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isWinner ? 'text-secondary' : 'text-primary'}`}>
                    {isWinner ? 'Mission Success' : 'Session Terminated'}
                 </span>
              </div>
              <span className={`h-px w-16 ${isWinner ? 'bg-secondary' : 'bg-primary'}`} />
           </div>

           <h1 className={`font-headline text-7xl max-[900px]:text-4xl font-black italic slanted uppercase tracking-tighter ${
             isWinner ? 'text-secondary gold-glow' : 'text-on-surface text-glow'
           }`}>
             {isWinner ? 'Apex Victory' : 'Final Report'}
           </h1>
           
           <p className={`text-sm font-black uppercase tracking-widest opacity-80 ${isWinner ? 'text-secondary/80' : 'text-on-surface-variant'}`}>
              Rank #{playerRank} • Time: <span className="text-on-surface font-mono">{playerTime}</span>
           </p>
        </div>
      </div>

      <div className="p-10 max-w-7xl mx-auto w-full space-y-12">
        {/* Main Result Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Podium Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Visual Podium Terminal */}
            <div className="p-1 rounded-[48px] bg-gradient-to-br from-white/10 to-transparent">
              <div className="p-12 rounded-[44px] bg-surface relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(129,236,255,0.05),transparent)]" />
                
                <h2 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow mb-12 flex items-center gap-4">
                   <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                   Podium Telemetry
                </h2>

                <div className="flex items-end justify-center gap-6 h-64 max-[900px]:flex-col max-[900px]:h-auto max-[900px]:gap-4">
                  {/* 2nd Place */}
                  <div className="group flex flex-col items-center flex-1 max-[900px]:w-full transition-transform duration-500 hover:scale-105">
                     <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-white/40 transition-colors">
                        <span className="font-headline text-2xl font-black italic slanted text-on-surface-variant opacity-60">2</span>
                     </div>
                     <div className="w-full h-32 bg-white/5 rounded-t-[32px] border-t border-x border-white/10 flex flex-col items-center justify-center p-6 backdrop-blur-xl relative">
                        <div className="font-headline text-lg font-black italic slanted uppercase text-on-surface tracking-wide">Kaito M.</div>
                        <div className="font-mono text-sm text-primary/60 mt-2">00:52.15</div>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10" />
                     </div>
                  </div>

                  {/* 1st Place */}
                  <div className="group flex flex-col items-center flex-[1.2] max-[900px]:w-full -translate-y-4 max-[900px]:translate-y-0 transition-transform duration-500 hover:scale-110">
                     <div className="h-16 w-16 rounded-[24px] bg-secondary/20 border-2 border-secondary/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,215,9,0.2)]">
                        <span className="material-symbols-outlined text-3xl text-secondary gold-glow">crown</span>
                     </div>
                     <div className="w-full h-48 bg-secondary/10 rounded-t-[40px] border-t-2 border-x-2 border-secondary/30 flex flex-col items-center justify-center p-8 backdrop-blur-2xl relative shadow-[0_-20px_50px_rgba(255,215,9,0.1)]">
                        <div className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] mb-2">Alpha Operator</div>
                        <div className="font-headline text-2xl font-black italic slanted uppercase text-secondary gold-glow tracking-widest">{playerName}</div>
                        <div className="font-mono text-lg text-on-surface mt-3 text-glow">{playerTime}</div>
                        <div className="absolute inset-x-0 bottom-0 h-2 bg-secondary shadow-[0_0_20px_rgba(255,215,9,1)]" />
                     </div>
                  </div>

                  {/* 3rd Place */}
                  <div className="group flex flex-col items-center flex-1 max-[900px]:w-full transition-transform duration-500 hover:scale-105">
                     <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-white/40 transition-colors">
                        <span className="font-headline text-2xl font-black italic slanted text-on-surface-variant opacity-60">3</span>
                     </div>
                     <div className="w-full h-24 bg-white/5 rounded-t-[32px] border-t border-x border-white/10 flex flex-col items-center justify-center p-6 backdrop-blur-xl relative">
                        <div className="font-headline text-lg font-black italic slanted uppercase text-on-surface tracking-wide">Luna S.</div>
                        <div className="font-mono text-sm text-primary/60 mt-2">00:53.42</div>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10" />
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Results Table */}
            <div className="p-1 rounded-[40px] bg-white/5">
               <div className="rounded-[36px] bg-surface overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 p-8 bg-white/[0.03] border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-60">
                     <div className="col-span-2">Pos</div>
                     <div className="col-span-5">Operator</div>
                     <div className="col-span-3">Time</div>
                     <div className="col-span-2 text-right">Delta</div>
                  </div>
                  <div className="divide-y divide-white/5">
                    {finishResults.map((result, idx) => (
                      <div key={idx} className={`grid grid-cols-12 gap-4 p-8 items-center transition-colors group ${
                        result.rank === 1 ? 'bg-secondary/[0.03] hover:bg-secondary/[0.06]' : 'hover:bg-white/[0.02]'
                      }`}>
                         <div className="col-span-2">
                            <span className={`font-headline text-2xl font-black italic slanted ${
                              result.rank === 1 ? 'text-secondary gold-glow' : 'text-on-surface-variant'
                            }`}>#{result.rank}</span>
                         </div>
                         <div className="col-span-5">
                            <div className="font-headline text-xl font-black italic slanted uppercase text-on-surface group-hover:text-glow transition-all">{result.name}</div>
                            {result.rank === 1 && <div className="text-[9px] font-black text-secondary uppercase tracking-widest mt-1">Champion</div>}
                         </div>
                         <div className={`col-span-3 font-mono text-lg ${result.rank === playerRank ? 'text-primary text-glow' : 'text-on-surface-variant opacity-80'}`}>
                            {result.time}
                         </div>
                         <div className="col-span-2 text-right">
                            <span className={`font-mono text-sm ${result.rank === 1 ? 'text-on-surface-variant opacity-40' : 'text-primary/60'}`}>
                               {result.rank === 1 ? '---' : `+${(idx * 0.85 + 0.92).toFixed(2)}s`}
                            </span>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Rewards Column */}
          <div className="lg:col-span-4 space-y-10">
            {/* Rewards Matrix */}
            <div className="p-1 rounded-[48px] bg-gradient-to-br from-primary/30 via-white/5 to-transparent">
               <div className="p-10 rounded-[44px] bg-surface relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 blur-[60px]" />
                  
                  <h3 className="font-headline text-2xl font-black italic slanted uppercase text-primary text-glow mb-8">Reward Dossier</h3>
                  
                  <div className="space-y-6">
                    {[
                      { icon: 'speed', label: 'Combat XP', val: '+250', color: 'text-primary', bg: 'bg-primary/20' },
                      { icon: 'monetization_on', label: 'Credits', val: '+2.5K', color: 'text-secondary', bg: 'bg-secondary/20' },
                      { icon: 'military_tech', label: 'Reputation', val: '+120', color: 'text-success', bg: 'bg-success/20' }
                    ].map((item, i) => (
                      <div key={i} className="group/reward p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-2xl ${item.bg.replace('/20', '/10')} border border-white/5 flex items-center justify-center`}>
                               <span className={`material-symbols-outlined text-2xl ${item.color}`}>{item.icon}</span>
                            </div>
                            <div>
                               <div className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-60 mb-1">{item.label}</div>
                               <div className={`font-headline text-2xl font-black italic slanted ${item.color}`}>{item.val}</div>
                            </div>
                         </div>
                         <span className="material-symbols-outlined text-on-surface-variant opacity-20 group-hover/reward:translate-x-1 transition-transform">arrow_forward</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Split Telemetry */}
            <div className="p-1 rounded-[48px] bg-white/5">
               <div className="p-10 rounded-[44px] bg-surface">
                  <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface-variant opacity-60 mb-8 px-2">Split Analysis</h3>
                  <div className="space-y-4">
                    {splits.map((split, idx) => (
                      <div key={idx} className="flex items-center justify-between px-4">
                         <div className="flex items-center gap-4">
                            <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">{split.lap}</span>
                            <div className="h-px w-12 bg-white/5" />
                         </div>
                         <span className="font-mono text-base text-primary/80">{split.time}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Achievement Unlocked */}
            {isWinner && (
               <div className="p-8 rounded-[40px] bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/10 blur-3xl" />
                  <div className="flex items-center gap-6">
                     <div className="h-16 w-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <span className="material-symbols-outlined text-3xl text-purple-400">emoji_events</span>
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-purple-400 uppercase tracking-[0.4em] mb-1">Badge Acquired</div>
                        <div className="font-headline text-xl font-black italic slanted uppercase text-on-surface tracking-wide">Hatrick Master</div>
                     </div>
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Navigation Terminal */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-surface/80 backdrop-blur-3xl border-t border-white/5 z-50">
         <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button onClick={onWatchReplay} className="h-16 rounded-2xl border border-white/10 hover:border-white/30 font-headline font-black italic slanted uppercase text-[11px] tracking-widest text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center gap-3 active:scale-95 group">
                <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">play_circle</span>
                Watch Replay
            </button>
            <button onClick={onReturnHome} className="h-16 rounded-2xl border border-white/10 hover:border-white/30 font-headline font-black italic slanted uppercase text-[11px] tracking-widest text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center gap-3 active:scale-95 group">
                <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">home</span>
                Exit Terminal
            </button>
            <button onClick={onRematch} className="h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 font-headline font-black italic slanted uppercase text-[11px] tracking-widest text-on-surface transition-all flex items-center justify-center gap-3 active:scale-95 group">
                <span className="material-symbols-outlined text-xl group-hover:rotate-180 transition-transform duration-700">refresh</span>
                Request Rematch
            </button>
            <button onClick={onContinue} className="h-16 rounded-2xl bg-primary shadow-[0_0_30px_rgba(129,236,255,0.2)] hover:shadow-[0_0_50px_rgba(129,236,255,0.4)] font-headline font-black italic slanted uppercase text-[13px] tracking-widest text-surface transition-all flex items-center justify-center gap-3 active:scale-95 group">
                Continue Mission
                <span className="material-symbols-outlined text-2xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default RaceResultScreen;
