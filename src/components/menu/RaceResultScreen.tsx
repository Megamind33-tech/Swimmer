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
    <div className="w-full h-full overflow-y-auto p-4 max-[900px]:p-2 space-y-4 relative">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Winner/Result Announcement */}
        <div
          className={`rounded-lg p-4 max-[900px]:p-3 text-center border ${
            isWinner
              ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/50'
              : 'bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-slate-600/50'
          }`}
        >
          {isWinner ? (
            <>
              <div className="text-4xl mb-2">🏆</div>
              <h1 className="text-2xl max-[900px]:text-xl font-black text-yellow-300 mb-1">VICTORY!</h1>
              <p className="text-sm max-[900px]:text-xs text-yellow-100">You've won the race with a new personal record!</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl max-[900px]:text-xl font-black text-white mb-1">Race Finished</h1>
              <p className="text-sm max-[900px]:text-xs text-slate-300">You placed #{playerRank}</p>
            </>
          )}
        </div>

        {/* Race Snapshot */}
        <div className="rounded-lg p-4 max-[900px]:p-3 border border-primary/30 bg-black/35">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-lg max-[900px]:text-sm font-black uppercase text-white">Race Details</h2>
            <button
              onClick={onWatchReplay}
              className="px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-600/60 text-white text-xs font-bold uppercase transition-all"
            >
              Watch Replay
            </button>
          </div>
          <div className="grid grid-cols-4 max-[900px]:grid-cols-2 gap-2">
            {finishResults.map((result) => (
              <div key={result.rank} className="bg-slate-900/50 border border-white/10 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/30 border border-primary/40 flex items-center justify-center text-xs font-black text-white">
                    {result.name.split(' ').map((n) => n[0]).join('').slice(0,2)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">#{result.rank} {result.name}</div>
                    <div className="text-[11px] text-cyan-300 font-mono">{result.time}</div>
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
            <div className="bg-gradient-to-b from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/30">
              <h2 className="text-xl max-[900px]:text-base font-black text-white mb-4">Final Results</h2>

              {/* Podium Visual */}
              <div className="flex items-end justify-center gap-3 mb-4 h-40 max-[900px]:hidden">
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-2">🥈</div>
                  <div className="w-20 h-32 bg-gradient-to-t from-slate-600/80 to-slate-700/50 rounded-t-lg flex flex-col items-center justify-end p-3">
                    <div className="text-sm font-bold text-white text-center">Kaito M.</div>
                    <div className="text-xs text-slate-400">00:52.15</div>
                  </div>
                  <div className="text-center font-black text-slate-400 mt-2">2nd</div>
                </div>

                {/* 1st Place (Winner) */}
                <div className="flex flex-col items-center">
                  <div className="text-5xl mb-2">🥇</div>
                  <div className="w-24 h-48 bg-gradient-to-t from-yellow-600/80 to-yellow-700/50 rounded-t-lg flex flex-col items-center justify-end p-3 border-2 border-yellow-500/50">
                    <div className="text-sm font-bold text-white text-center">{playerName}</div>
                    <div className="text-xs text-yellow-200">{playerTime}</div>
                  </div>
                  <div className="text-center font-black text-yellow-400 mt-2">1st</div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-2">🥉</div>
                  <div className="w-20 h-24 bg-gradient-to-t from-orange-600/80 to-orange-700/50 rounded-t-lg flex flex-col items-center justify-end p-3">
                    <div className="text-sm font-bold text-white text-center">Luna S.</div>
                    <div className="text-xs text-slate-400">00:53.42</div>
                  </div>
                  <div className="text-center font-black text-orange-400 mt-2">3rd</div>
                </div>
              </div>

              {/* Full Results Table */}
              <div className="bg-slate-800/50 rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-4 bg-slate-700/30 font-bold text-slate-300 text-sm uppercase">
                  <div>Rank</div>
                  <div>Swimmer</div>
                  <div>Time</div>
                  <div>Diff</div>
                </div>
                {finishResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-4 gap-4 p-4 border-t border-slate-700/50 items-center ${
                      result.rank === 1 ? 'bg-yellow-500/10' : ''
                    }`}
                  >
                    <div>
                      <span className="text-2xl">{result.medal}</span>
                      <span className="ml-2 font-bold text-white">#{result.rank}</span>
                    </div>
                    <div className="font-bold text-white">{result.name}</div>
                    <div className="text-cyan-400 font-mono">{result.time}</div>
                    <div className="text-slate-400 text-sm">
                      {result.rank === 1 ? '—' : '+' + (parseFloat(result.time) - parseFloat(playerTime)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Times */}
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <h2 className="text-xl font-black text-white mb-4">Split Times</h2>
              <div className="space-y-2">
                {splits.map((split, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-600/30 rounded p-3">
                    <span className="font-bold text-white">{split.lap}</span>
                    <span className="text-cyan-400 font-mono">{split.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Rewards & Stats */}
          <div className="space-y-4">
            {/* Rewards Box */}
            <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-lg p-4 border border-emerald-500/30">
              <h3 className="text-lg font-black text-emerald-400 mb-4">Rewards</h3>
              <div className="space-y-3">
                <div className="bg-emerald-500/20 rounded p-3">
                  <div className="text-xs text-emerald-300 uppercase font-bold">Experience Points</div>
                  <div className="text-2xl font-black text-emerald-300">+250 XP</div>
                </div>
                <div className="bg-yellow-500/20 rounded p-3">
                  <div className="text-xs text-yellow-300 uppercase font-bold">Coins</div>
                  <div className="text-2xl font-black text-yellow-300">+2000 Coins</div>
                </div>
                <div className="bg-blue-500/20 rounded p-3">
                  <div className="text-xs text-blue-300 uppercase font-bold">Reputation</div>
                  <div className="text-2xl font-black text-blue-300">+150 Rep</div>
                </div>
              </div>
            </div>

            {/* Record Status */}
            <div className="bg-cyan-600/20 rounded-lg p-4 border border-cyan-500/30">
              <h3 className="text-lg font-black text-cyan-400 mb-3">Record</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Status:</span>
                  <span className="font-bold text-cyan-300">Personal Best!</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Prev. Best:</span>
                  <span className="font-bold text-white">00:52.10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Improvement:</span>
                  <span className="font-bold text-emerald-400">-0.87s</span>
                </div>
              </div>
            </div>

            {/* Achievement Unlocked */}
            {isWinner && (
              <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-lg font-black text-purple-400 mb-3">Achievement</h3>
                <div className="text-3xl mb-2">🏅</div>
                <div className="text-sm font-bold text-white">Hatrick Master</div>
                <div className="text-xs text-slate-400 mt-1">Win 3 races in a row</div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 max-w-5xl mx-auto">
          <button
            onClick={onWatchReplay}
            className="px-6 py-3 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white font-bold uppercase transition-all"
          >
            Watch Replay
          </button>
          <button
            onClick={onRematch}
            className="px-6 py-3 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white font-bold uppercase transition-all"
          >
            Rematch
          </button>
          <button
            onClick={onContinue}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/50 text-white font-bold uppercase transition-all"
          >
            Next Event
          </button>
          <button
            onClick={onReturnHome}
            className="px-6 py-3 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white font-bold uppercase transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaceResultScreen;
