/**
 * RaceHUD Component
 * In-game display showing real-time race data
 *
 * Features:
 * - Countdown timer (3, 2, 1, GO!)
 * - Elapsed time
 * - Current position and distance to finish
 * - Stamina bar (0-100)
 * - Oxygen bar (0-100)
 * - Leaderboard (top 3 swimmers)
 * - Lane assignment
 * - Mobile responsive overlay
 *
 * Performance: <30ms render, updates at 60 FPS
 */

import React, { useMemo } from 'react';
import { IRaceState, ISwimmerRaceState } from '../types/index';

interface RaceHUDProps {
  raceState: IRaceState | null;
  playerSwimmer: ISwimmerRaceState | null;
  totalDistance: number;
  countdownValue?: number;
  isCountingDown?: boolean;
}

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const deciseconds = Math.floor((ms % 1000) / 100);
  return `${seconds}.${deciseconds}`;
};

const RaceHUD: React.FC<RaceHUDProps> = ({
  raceState,
  playerSwimmer,
  totalDistance,
  countdownValue = 0,
  isCountingDown = false,
}) => {
  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (!playerSwimmer) return 0;
    return Math.min(100, (playerSwimmer.position / totalDistance) * 100);
  }, [playerSwimmer?.position, totalDistance]);

  // Get top 3 swimmers for leaderboard
  const topSwimmers = useMemo(() => {
    if (!raceState) return [];
    return [...raceState.swimmers]
      .sort((a, b) => {
        // Finished swimmers first (by finish time), then by current position
        if (a.finishTime > 0 && b.finishTime > 0) return a.finishTime - b.finishTime;
        if (a.finishTime > 0) return -1;
        if (b.finishTime > 0) return 1;
        return b.position - a.position;
      })
      .slice(0, 3);
  }, [raceState]);

  // Determine if player is leading
  const isPlayerLeading = useMemo(() => {
    if (!playerSwimmer || !raceState) return false;
    const others = raceState.swimmers.filter((s) => s.id !== playerSwimmer.id && !s.isDNF);
    return others.every((s) => playerSwimmer.position >= s.position);
  }, [playerSwimmer, raceState]);

  if (isCountingDown) {
    return (
      <div className="race-hud-countdown">
        <style>{`
          .race-hud-countdown {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.3);
            z-index: 100;
          }

          .countdown-display {
            font-size: 120px;
            font-weight: 900;
            color: white;
            text-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
            animation: pulse 0.6s cubic-bezier(0.4, 0, 0.6, 1);
          }

          @keyframes pulse {
            0% {
              transform: scale(1.2);
              opacity: 0.8;
            }
            50% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(0.8);
              opacity: 0.6;
            }
          }
        `}</style>

        <div className="countdown-display">
          {countdownValue > 0 ? countdownValue : 'GO!'}
        </div>
      </div>
    );
  }

  return (
    <div className="race-hud">
      <style>{`
        .race-hud {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 50;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .race-hud * {
          pointer-events: auto;
        }

        /* Top bar: Timer and distance */
        .race-hud-top {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
          padding: 12px 16px 24px;
          color: white;
          z-index: 51;
        }

        .hud-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .hud-timer {
          font-size: 24px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        .hud-distance {
          text-align: right;
        }

        .hud-distance-value {
          font-size: 18px;
          font-weight: 600;
          color: #4ade80;
        }

        .hud-distance-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
        }

        /* Progress bar */
        .hud-progress-container {
          width: 100%;
          height: 4px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 2px;
          overflow: hidden;
        }

        .hud-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
          border-radius: 2px;
          transition: width 0.2s ease-out;
        }

        /* Left panel: Stamina & Oxygen */
        .race-hud-left {
          position: fixed;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 51;
        }

        .stat-bar {
          width: 32px;
          height: 120px;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 12px;
          position: relative;
        }

        .stat-bar-fill {
          width: 100%;
          background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
          border-radius: 4px;
          transition: height 0.1s linear;
          position: absolute;
          bottom: 0;
        }

        .stat-bar.oxygen .stat-bar-fill {
          background: linear-gradient(180deg, #06b6d4 0%, #0891b2 100%);
        }

        .stat-label {
          font-size: 10px;
          font-weight: 600;
          color: white;
          margin-top: 4px;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Right panel: Leaderboard */
        .race-hud-right {
          position: fixed;
          right: 16px;
          top: 16px;
          background: rgba(0, 0, 0, 0.7);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 12px;
          min-width: 200px;
          z-index: 51;
          backdrop-filter: blur(4px);
        }

        .leaderboard-title {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding-bottom: 6px;
        }

        .leaderboard-entry {
          display: flex;
          align-items: center;
          font-size: 13px;
          margin-bottom: 6px;
          padding: 4px 0;
        }

        .leaderboard-entry:last-child {
          margin-bottom: 0;
        }

        .leaderboard-rank {
          width: 24px;
          font-weight: 700;
          color: #fbbf24;
          margin-right: 6px;
        }

        .leaderboard-name {
          flex: 1;
          color: white;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .leaderboard-time {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          min-width: 40px;
          text-align: right;
          font-variant-numeric: tabular-nums;
        }

        .leaderboard-name.player {
          color: #10b981;
          font-weight: 600;
        }

        .leaderboard-name.leader {
          color: #fbbf24;
          font-weight: 600;
        }

        /* Lane indicator */
        .race-hud-lane {
          position: fixed;
          bottom: 16px;
          left: 16px;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 8px 12px;
          color: white;
          font-size: 12px;
          z-index: 51;
        }

        .lane-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 11px;
        }

        .lane-number {
          font-weight: 700;
          font-size: 16px;
          color: #3b82f6;
        }

        /* Status message */
        .race-hud-status {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 8px 16px;
          color: white;
          font-size: 12px;
          z-index: 51;
          text-align: center;
        }

        .status-icon {
          margin-right: 6px;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .race-hud-top {
            padding: 8px 12px 16px;
          }

          .hud-timer {
            font-size: 20px;
          }

          .race-hud-right {
            right: 8px;
            top: 8px;
            min-width: 160px;
            padding: 10px;
            font-size: 12px;
          }

          .leaderboard-rank {
            width: 20px;
            margin-right: 4px;
          }

          .race-hud-left {
            left: 8px;
          }

          .stat-bar {
            width: 28px;
            height: 100px;
          }
        }
      `}</style>

      {/* Top Bar: Timer and Distance */}
      <div className="race-hud-top">
        <div className="hud-top-row">
          <div className="hud-timer">{formatTime(raceState?.currentTime || 0)}</div>
          <div className="hud-distance">
            <div className="hud-distance-value">
              {playerSwimmer ? Math.round(playerSwimmer.position) : 0}m
            </div>
            <div className="hud-distance-label">of {totalDistance}m</div>
          </div>
        </div>
        <div className="hud-progress-container">
          <div
            className="hud-progress-bar"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Left Panel: Stamina & Oxygen */}
      {playerSwimmer && (
        <div className="race-hud-left">
          <div className="stat-bar">
            <div
              className="stat-bar-fill"
              style={{ height: `${playerSwimmer.stamina}%` }}
            />
          </div>
          <div className="stat-label">Stamina</div>

          <div className="stat-bar oxygen">
            <div
              className="stat-bar-fill"
              style={{ height: `${playerSwimmer.oxygen}%` }}
            />
          </div>
          <div className="stat-label">Oxygen</div>
        </div>
      )}

      {/* Right Panel: Leaderboard */}
      <div className="race-hud-right">
        <div className="leaderboard-title">Leaderboard</div>
        {topSwimmers.map((swimmer, index) => (
          <div key={swimmer.id} className="leaderboard-entry">
            <div className="leaderboard-rank">#{index + 1}</div>
            <div
              className={`leaderboard-name ${
                swimmer.id === playerSwimmer?.id ? 'player' : isPlayerLeading && index === 0 ? 'leader' : ''
              }`}
            >
              {swimmer.name}
            </div>
            {swimmer.finishTime > 0 && (
              <div className="leaderboard-time">{formatTime(swimmer.finishTime)}</div>
            )}
          </div>
        ))}
      </div>

      {/* Lane Indicator */}
      {playerSwimmer && (
        <div className="race-hud-lane">
          <div className="lane-label">Lane</div>
          <div className="lane-number">{playerSwimmer.lane}</div>
        </div>
      )}

      {/* Status Message */}
      {isPlayerLeading && (
        <div className="race-hud-status">
          <span className="status-icon">🏆</span>
          You're in the lead!
        </div>
      )}
    </div>
  );
};

export default RaceHUD;
