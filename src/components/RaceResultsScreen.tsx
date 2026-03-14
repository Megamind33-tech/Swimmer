/**
 * RaceResultsScreen Component
 * Displays race results, rankings, times, and rewards
 *
 * Features:
 * - Final rankings with times
 * - Player placement highlight
 * - XP earned display
 * - Currency rewards
 * - Cosmetic drops
 * - Achievements unlocked
 * - Replay button
 * - Next race button
 * - Mobile responsive layout
 *
 * Performance: <50ms render
 */

import React, { useMemo } from 'react';
import { IRaceState } from '../types/index';

interface RaceResultsScreenProps {
  raceState: IRaceState | null;
  playerName: string;
  playerRank: number;
  playerTime: number;
  xpEarned: number;
  currencyEarned: number;
  cosmeticsDropped?: string[];
  achievementsUnlocked?: string[];
  onReplay?: () => void;
  onNextRace?: () => void;
  onBackToMenu?: () => void;
}

const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const deciseconds = Math.floor((ms % 1000) / 100);

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${deciseconds}`;
  }
  return `${seconds}.${deciseconds}`;
};

const RaceResultsScreen: React.FC<RaceResultsScreenProps> = ({
  raceState,
  playerName,
  playerRank,
  playerTime,
  xpEarned,
  currencyEarned,
  cosmeticsDropped = [],
  achievementsUnlocked = [],
  onReplay,
  onNextRace,
  onBackToMenu,
}) => {
  // Determine medal
  const getMedal = (rank: number): string => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '🏅';
    }
  };

  // Get medal color
  const getMedalColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return '#fbbf24'; // gold
      case 2:
        return '#c0c0c0'; // silver
      case 3:
        return '#cd7f32'; // bronze
      default:
        return '#9ca3af'; // gray
    }
  };

  // XP breakdown
  const xpBreakdown = useMemo(() => {
    const baseXP = 100;
    const rankBonus = Math.max(0, (3 - playerRank) * 50); // 1st=100, 2nd=50, 3rd=0
    const timeBonus = playerTime < 60000 ? 50 : 0; // Bonus for sub-1min times
    return {
      base: baseXP,
      rank: rankBonus,
      time: timeBonus,
      total: xpEarned,
    };
  }, [playerRank, playerTime, xpEarned]);

  return (
    <div className="race-results-screen">
      <style>{`
        .race-results-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: white;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-y: auto;
        }

        .results-container {
          max-width: 600px;
          margin: 0 auto;
        }

        /* Header with medal */
        .results-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .medal-display {
          font-size: 120px;
          margin-bottom: 12px;
          animation: bounce 0.6s ease-out;
        }

        @keyframes bounce {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          50% {
            transform: translateY(10px);
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .rank-title {
          font-size: 32px;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .rank-title.first {
          color: #fbbf24;
        }

        .rank-title.second {
          color: #c0c0c0;
        }

        .rank-title.third {
          color: #cd7f32;
        }

        .player-name {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .race-time {
          font-size: 32px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          color: #3b82f6;
        }

        /* Rankings Card */
        .rankings-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          backdrop-filter: blur(8px);
        }

        .rankings-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 12px;
        }

        .ranking-entry {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .ranking-entry:last-child {
          border-bottom: none;
        }

        .ranking-medal {
          font-size: 20px;
          width: 32px;
          margin-right: 12px;
        }

        .ranking-position {
          width: 32px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
        }

        .ranking-name {
          flex: 1;
          margin: 0 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ranking-name.player {
          color: #10b981;
          font-weight: 600;
        }

        .ranking-time {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          min-width: 50px;
          text-align: right;
          font-variant-numeric: tabular-nums;
        }

        /* Rewards Card */
        .rewards-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          backdrop-filter: blur(8px);
        }

        .rewards-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 16px;
        }

        .reward-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .reward-row:last-child {
          border-bottom: none;
        }

        .reward-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.7);
        }

        .reward-icon {
          font-size: 16px;
        }

        .reward-value {
          font-weight: 700;
          font-size: 14px;
        }

        .reward-xp {
          color: #fbbf24;
        }

        .reward-currency {
          color: #8b5cf6;
        }

        /* XP Breakdown */
        .xp-breakdown {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 8px;
          padding: 12px;
          margin-top: 12px;
        }

        .xp-breakdown-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 6px;
          color: rgba(255, 255, 255, 0.8);
        }

        .xp-breakdown-row:last-child {
          margin-bottom: 0;
          border-top: 1px solid rgba(251, 191, 36, 0.2);
          padding-top: 6px;
          font-weight: 700;
          color: #fbbf24;
        }

        /* Cosmetics Drops */
        .cosmetics-drop {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          backdrop-filter: blur(8px);
        }

        .cosmetics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 12px;
        }

        .cosmetic-item {
          background: rgba(59, 130, 246, 0.2);
          border: 2px solid rgba(59, 130, 246, 0.5);
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          font-size: 12px;
        }

        .cosmetic-icon {
          font-size: 32px;
          margin-bottom: 6px;
        }

        /* Achievements */
        .achievements-drop {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          backdrop-filter: blur(8px);
        }

        .achievements-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .achievement-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 6px;
          font-size: 12px;
        }

        .achievement-icon {
          font-size: 16px;
        }

        /* Buttons */
        .results-buttons {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .results-button {
          flex: 1;
          padding: 14px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .results-button.primary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }

        .results-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .results-button.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .results-button.secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.5);
        }

        /* Mobile responsive */
        @media (max-width: 480px) {
          .race-results-screen {
            padding: 12px;
          }

          .medal-display {
            font-size: 80px;
          }

          .rank-title {
            font-size: 24px;
          }

          .race-time {
            font-size: 24px;
          }

          .results-buttons {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="results-container">
        {/* Header with Medal */}
        <div className="results-header">
          <div className="medal-display">{getMedal(playerRank)}</div>
          <div className={`rank-title ${playerRank === 1 ? 'first' : playerRank === 2 ? 'second' : playerRank === 3 ? 'third' : ''}`}>
            {playerRank === 1 ? '1ST PLACE' : playerRank === 2 ? '2ND PLACE' : playerRank === 3 ? '3RD PLACE' : `${playerRank}TH PLACE`}
          </div>
          <div className="player-name">{playerName}</div>
          <div className="race-time">{formatTime(playerTime)}</div>
        </div>

        {/* Rankings */}
        {raceState && (
          <div className="rankings-card">
            <div className="rankings-title">Final Rankings</div>
            {raceState.leaderboard.map((entry, index) => (
              <div key={index} className="ranking-entry">
                <div className="ranking-medal">{getMedal(entry.rank)}</div>
                <div className="ranking-position">#{entry.rank}</div>
                <div className={`ranking-name ${entry.name === playerName ? 'player' : ''}`}>
                  {entry.name}
                </div>
                <div className="ranking-time">{formatTime(entry.time)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Rewards */}
        <div className="rewards-card">
          <div className="rewards-title">Rewards Earned</div>
          <div className="reward-row">
            <div className="reward-label">
              <span className="reward-icon">⭐</span>
              Experience Points
            </div>
            <div className={`reward-value reward-xp`}>+{xpEarned} XP</div>
          </div>
          <div className="reward-row">
            <div className="reward-label">
              <span className="reward-icon">💎</span>
              Currency
            </div>
            <div className={`reward-value reward-currency`}>+{currencyEarned}</div>
          </div>

          {/* XP Breakdown */}
          <div className="xp-breakdown">
            <div className="xp-breakdown-row">
              <span>Base XP:</span>
              <span>+{xpBreakdown.base}</span>
            </div>
            <div className="xp-breakdown-row">
              <span>Rank Bonus:</span>
              <span>+{xpBreakdown.rank}</span>
            </div>
            <div className="xp-breakdown-row">
              <span>Time Bonus:</span>
              <span>+{xpBreakdown.time}</span>
            </div>
            <div className="xp-breakdown-row">
              <span>Total:</span>
              <span>={xpBreakdown.total}</span>
            </div>
          </div>
        </div>

        {/* Cosmetics Drops */}
        {cosmeticsDropped.length > 0 && (
          <div className="cosmetics-drop">
            <div className="rewards-title">🎁 New Items Unlocked</div>
            <div className="cosmetics-grid">
              {cosmeticsDropped.map((cosmetic) => (
                <div key={cosmetic} className="cosmetic-item">
                  <div className="cosmetic-icon">👕</div>
                  <div>{cosmetic}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievementsUnlocked.length > 0 && (
          <div className="achievements-drop">
            <div className="rewards-title">🏆 Achievements Unlocked</div>
            <div className="achievements-list">
              {achievementsUnlocked.map((achievement) => (
                <div key={achievement} className="achievement-item">
                  <span className="achievement-icon">✨</span>
                  <span>{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="results-buttons">
          <button className="results-button primary" onClick={onNextRace}>
            Next Race
          </button>
          <button className="results-button secondary" onClick={onReplay}>
            Replay
          </button>
          <button className="results-button secondary" onClick={onBackToMenu}>
            Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaceResultsScreen;
