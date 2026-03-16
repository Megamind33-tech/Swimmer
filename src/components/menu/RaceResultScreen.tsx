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
    <div className="w-full h-full overflow-y-auto p-4 max-[900px]:p-2 space-y-4 relative safe-zone-x">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Winner/Result Announcement */}
        <div
          className={`rounded-2xl p-4 max-[900px]:p-3 text-center border ${
            isWinner
              ? 'glass-card-elevated bg-gradient-to-br from-yellow-500/20 to-yellow-400/10 border-yellow-500/50 shadow-lg shadow-yellow-500/20'
              : 'glass-card-elevated bg-gradient-to-br from-neon-cyan/10 to-broadcast-overlay/40 border-neon-cyan/30 shadow-lg shadow-neon-cyan/10'
          }`}
        >
          {isWinner ? (
            <>
              <div className="text-4xl mb-2">🏆</div>
              <h1 className="text-2xl max-[900px]:text-xl font-din font-black text-yellow-300 mb-1 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">VICTORY!</h1>
              <p className="text-sm max-[900px]:text-xs text-yellow-100 font-barlow font-bold">You've won the race with a new personal record!</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl max-[900px]:text-xl font-din font-black text-white mb-1 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">Race Finished</h1>
              <p className="text-sm max-[900px]:text-xs text-white/80 font-barlow font-bold">You placed #{playerRank}</p>
            </>
          )}
        </div>

        {/* Race Snapshot */}
        <div className="rounded-2xl p-4 max-[900px]:p-3 border border-neon-cyan/30 glass-card-elevated hover:border-neon-cyan/60 transition-all">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-lg max-[900px]:text-sm font-din font-black uppercase text-white drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">Race Details</h2>
            <button
              onClick={onWatchReplay}
              className="px-3 py-1.5 rounded-xl bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan text-xs font-bold font-barlow uppercase transition-all border border-neon-cyan/30 active:animate-squash-stretch"
            >
              Watch Replay
            </button>
          </div>
          <div className="grid grid-cols-4 max-[900px]:grid-cols-2 gap-2">
            {finishResults.map((result) => (
              <div key={result.rank} className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl p-2 hover:border-neon-cyan/50 transition-all">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neon-cyan/30 border border-neon-cyan/40 flex items-center justify-center text-xs font-black text-neon-cyan drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">
                    {result.name.split(' ').map((n) => n[0]).join('').slice(0,2)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold font-barlow text-white truncate">#{result.rank} {result.name}</div>
                    <div className="text-[11px] text-neon-cyan font-mono drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">{result.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Result Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Podium / Result Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Podium */}
            <div className="glass-card-elevated rounded-2xl p-4 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all skew-container">
              <h2 className="text-xl max-[900px]:text-base font-din font-black text-white mb-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">Final Results</h2>

              {/* Podium Visual */}
              <div className="flex items-end justify-center gap-3 mb-4 h-40 max-[900px]:hidden">
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-2">🥈</div>
                  <div className="w-20 h-32 bg-gradient-to-t from-blue-500/40 to-blue-600/30 rounded-t-lg flex flex-col items-center justify-end p-3 border border-blue-400/40">
                    <div className="text-sm font-bold font-barlow text-white text-center">Kaito M.</div>
                    <div className="text-xs text-blue-200 font-barlow">00:52.15</div>
                  </div>
                  <div className="text-center font-black text-blue-400 mt-2 font-din">2nd</div>
                </div>

                {/* 1st Place (Winner) */}
                <div className="flex flex-col items-center">
                  <div className="text-5xl mb-2">🥇</div>
                  <div className="w-24 h-48 bg-gradient-to-t from-yellow-500/50 to-yellow-600/40 rounded-t-lg flex flex-col items-center justify-end p-3 border-2 border-yellow-400/60 shadow-lg shadow-yellow-400/30">
                    <div className="text-sm font-bold font-barlow text-white text-center">{playerName}</div>
                    <div className="text-xs text-yellow-100 font-barlow drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]">{playerTime}</div>
                  </div>
                  <div className="text-center font-black text-yellow-400 mt-2 font-din drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]">1st</div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-2">🥉</div>
                  <div className="w-20 h-24 bg-gradient-to-t from-orange-500/40 to-orange-600/30 rounded-t-lg flex flex-col items-center justify-end p-3 border border-orange-400/40">
                    <div className="text-sm font-bold font-barlow text-white text-center">Luna S.</div>
                    <div className="text-xs text-orange-200 font-barlow">00:53.42</div>
                  </div>
                  <div className="text-center font-black text-orange-400 mt-2 font-din">3rd</div>
                </div>
              </div>

              {/* Full Results Table */}
              <div className="glass-card rounded-xl overflow-hidden border border-neon-cyan/20">
                <div className="grid grid-cols-4 gap-4 p-4 bg-neon-cyan/10 font-bold text-neon-cyan text-sm uppercase font-barlow border-b border-neon-cyan/20">
                  <div>Rank</div>
                  <div>Swimmer</div>
                  <div>Time</div>
                  <div>Diff</div>
                </div>
                {finishResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-4 gap-4 p-4 border-t border-neon-cyan/10 items-center font-barlow ${
                      result.rank === 1 ? 'bg-yellow-500/10' : 'bg-neon-cyan/5'
                    }`}
                  >
                    <div>
                      <span className="text-2xl">{result.medal}</span>
                      <span className="ml-2 font-bold text-white drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">#{result.rank}</span>
                    </div>
                    <div className="font-bold text-white">{result.name}</div>
                    <div className="text-neon-cyan font-mono drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">{result.time}</div>
                    <div className="text-white/70 text-sm">
                      {result.rank === 1 ? '—' : '+' + (parseFloat(result.time) - parseFloat(playerTime)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Times */}
            <div className="glass-card-elevated rounded-2xl p-4 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all skew-container">
              <h2 className="text-xl font-din font-black text-white mb-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">Split Times</h2>
              <div className="space-y-2">
                {splits.map((split, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-neon-cyan/10 border border-neon-cyan/20 rounded-xl p-3 hover:border-neon-cyan/50 transition-all">
                    <span className="font-bold font-barlow text-white">{split.lap}</span>
                    <span className="text-neon-cyan font-mono drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">{split.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Rewards & Stats */}
          <div className="space-y-4">
            {/* Rewards Box */}
            <div className="glass-card-elevated rounded-2xl p-4 border border-green-400/30 hover:border-green-400/60 transition-all bg-gradient-to-br from-green-400/10 to-broadcast-overlay/40 skew-container">
              <h3 className="text-lg font-din font-black text-green-400 mb-4 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">Rewards</h3>
              <div className="space-y-3">
                <div className="bg-green-400/20 border border-green-400/30 rounded-xl p-3">
                  <div className="text-xs text-green-300 uppercase font-bold font-barlow drop-shadow-[0_0_4px_rgba(52,211,153,0.3)]">Experience Points</div>
                  <div className="text-2xl font-din font-black text-green-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]">+250 XP</div>
                </div>
                <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-xl p-3">
                  <div className="text-xs text-yellow-300 uppercase font-bold font-barlow drop-shadow-[0_0_4px_rgba(250,204,21,0.3)]">Coins</div>
                  <div className="text-2xl font-din font-black text-yellow-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]">+2000 Coins</div>
                </div>
                <div className="bg-blue-400/20 border border-blue-400/30 rounded-xl p-3">
                  <div className="text-xs text-blue-300 uppercase font-bold font-barlow drop-shadow-[0_0_4px_rgba(59,130,246,0.3)]">Reputation</div>
                  <div className="text-2xl font-din font-black text-blue-300 drop-shadow-[0_0_6px_rgba(59,130,246,0.4)]">+150 Rep</div>
                </div>
              </div>
            </div>

            {/* Record Status */}
            <div className="glass-card-elevated rounded-2xl p-4 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all bg-gradient-to-br from-neon-cyan/10 to-broadcast-overlay/40 skew-container">
              <h3 className="text-lg font-din font-black text-neon-cyan mb-3 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">Record</h3>
              <div className="space-y-2 text-sm font-barlow">
                <div className="flex justify-between">
                  <span className="text-white/70">Status:</span>
                  <span className="font-bold text-neon-cyan drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">Personal Best!</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Prev. Best:</span>
                  <span className="font-bold text-white">00:52.10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Improvement:</span>
                  <span className="font-bold text-green-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.3)]">-0.87s</span>
                </div>
              </div>
            </div>

            {/* Achievement Unlocked */}
            {isWinner && (
              <div className="glass-card-elevated rounded-2xl p-4 border border-purple-400/30 hover:border-purple-400/60 transition-all bg-gradient-to-br from-purple-400/10 to-broadcast-overlay/40 skew-container">
                <h3 className="text-lg font-din font-black text-purple-400 mb-3 drop-shadow-[0_0_8px_rgba(192,132,250,0.4)]">Achievement</h3>
                <div className="text-3xl mb-2">🏅</div>
                <div className="text-sm font-bold font-barlow text-white">Hatrick Master</div>
                <div className="text-xs text-white/70 mt-1 font-barlow">Win 3 races in a row</div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 max-w-5xl mx-auto">
          <button
            onClick={onWatchReplay}
            className="px-6 py-3 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/20 text-neon-cyan font-bold font-barlow uppercase transition-all active:animate-squash-stretch drop-shadow-[0_0_6px_rgba(0,255,255,0.2)]"
          >
            Watch Replay
          </button>
          <button
            onClick={onRematch}
            className="px-6 py-3 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/20 text-neon-cyan font-bold font-barlow uppercase transition-all active:animate-squash-stretch drop-shadow-[0_0_6px_rgba(0,255,255,0.2)]"
          >
            Rematch
          </button>
          <button
            onClick={onContinue}
            className="px-6 py-3 rounded-2xl bg-neon-cyan/30 border-2 border-neon-cyan/50 hover:border-neon-cyan hover:bg-neon-cyan/40 hover:shadow-lg hover:shadow-neon-cyan/60 text-neon-cyan font-bold font-barlow uppercase transition-all active:animate-squash-stretch drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]"
          >
            Next Event
          </button>
          <button
            onClick={onReturnHome}
            className="px-6 py-3 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/20 text-neon-cyan font-bold font-barlow uppercase transition-all active:animate-squash-stretch drop-shadow-[0_0_6px_rgba(0,255,255,0.2)]"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaceResultScreen;
