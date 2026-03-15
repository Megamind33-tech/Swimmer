/**
 * RaceReplayScreen Component
 * Displays and controls race replay with dynamic camera and highlights
 *
 * Features:
 * - Play/pause/seek controls
 * - Speed control (0.5x to 2x)
 * - Skip to highlights button
 * - Final moments playback
 * - Underwater focus mode
 * - Progress bar with timestamps
 * - Mobile responsive
 */

import React, { useState, useEffect, useRef } from 'react';
import { ReplayController } from '../core/ReplayController';
import { IRaceReplay } from '../core/RaceRecorder';

interface RaceReplayScreenProps {
  replay: IRaceReplay;
  onReplayEnd?: () => void;
  onBackToResults?: () => void;
  broadcastCameraRef?: React.MutableRefObject<any>;
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

const RaceReplayScreen: React.FC<RaceReplayScreenProps> = ({
  replay,
  onReplayEnd,
  onBackToResults,
  broadcastCameraRef,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [replayMode, setReplayMode] = useState<'normal' | 'highlights' | 'final' | 'underwater'>('normal');
  const replayControllerRef = useRef<ReplayController | null>(null);

  // Initialize replay controller
  useEffect(() => {
    const controller = new ReplayController();
    controller.loadReplay(replay);
    replayControllerRef.current = controller;

    // Subscribe to events
    const handleFrameUpdate = (data: any) => {
      setCurrentTime(data.time);
    };

    const handleReplayEnd = () => {
      setIsPlaying(false);
      onReplayEnd?.();
    };

    const handleSpeedChange = (speed: number) => {
      setPlaySpeed(speed);
    };

    controller.on('replayFrameUpdate', handleFrameUpdate);
    controller.on('replayEnded', handleReplayEnd);
    controller.on('replaySpeedChanged', handleSpeedChange);

    return () => {
      // Cleanup
    };
  }, [replay, onReplayEnd]);

  // Update loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (replayControllerRef.current) {
        replayControllerRef.current.update(16); // ~60fps
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);

  const handlePlayPause = () => {
    if (!replayControllerRef.current) return;

    if (isPlaying) {
      replayControllerRef.current.pause();
      setIsPlaying(false);
    } else {
      replayControllerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (replayControllerRef.current) {
      replayControllerRef.current.setPlaySpeed(speed);
    }
  };

  const handleSeek = (time: number) => {
    if (replayControllerRef.current) {
      replayControllerRef.current.seekTo(time);
      setCurrentTime(time);
    }
  };

  const handleSkipToHighlight = () => {
    if (replayControllerRef.current) {
      replayControllerRef.current.skipToNextHighlight();
      setIsPlaying(true);
      replayControllerRef.current.play();
    }
  };

  const handlePlayHighlights = () => {
    if (replayControllerRef.current) {
      setReplayMode('highlights');
      replayControllerRef.current.playHighlights();
      setIsPlaying(true);
    }
  };

  const handlePlayFinalMoments = () => {
    if (replayControllerRef.current) {
      setReplayMode('final');
      replayControllerRef.current.playFinalMoments();
      setIsPlaying(true);
    }
  };

  const handleFocusUnderwater = () => {
    if (replayControllerRef.current) {
      setReplayMode('underwater');
      replayControllerRef.current.focusOnUnderwater();
      setIsPlaying(true);
    }
  };

  const progress = (currentTime / replay.duration) * 100;

  return (
    <div className="race-replay-screen">
      <style>{`
        .race-replay-screen {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100vh;
          background: transparent;
          pointer-events: none;
          z-index: 1000;
        }

        .replay-controls {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%);
          padding: 24px;
          pointer-events: auto;
        }

        .replay-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          margin-bottom: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .replay-title {
          font-size: 18px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .replay-time {
          font-size: 16px;
          color: rgba(255,255,255,0.8);
          font-variant-numeric: tabular-nums;
        }

        /* Progress bar */
        .replay-progress {
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 16px;
          cursor: pointer;
        }

        .replay-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          width: ${progress}%;
          transition: width 0.1s ease;
        }

        /* Main controls */
        .replay-main-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          align-items: center;
        }

        .replay-button {
          background: rgba(59, 130, 246, 0.9);
          color: white;
          border: none;
          border-radius: 6px;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          pointer-events: auto;
        }

        .replay-button:hover {
          background: rgba(59, 130, 246, 1);
          transform: translateY(-1px);
        }

        .replay-button.secondary {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .replay-button.secondary:hover {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.3);
        }

        .replay-button.danger {
          background: rgba(239, 68, 68, 0.9);
        }

        .replay-button.danger:hover {
          background: rgba(239, 68, 68, 1);
        }

        /* Speed controls */
        .speed-controls {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-left: auto;
        }

        .speed-label {
          color: rgba(255,255,255,0.7);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .speed-button {
          background: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          padding: 6px 10px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 40px;
        }

        .speed-button:hover {
          background: rgba(255,255,255,0.15);
        }

        .speed-button.active {
          background: rgba(59, 130, 246, 0.8);
          border-color: #3b82f6;
        }

        /* Highlight controls */
        .replay-highlights {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .replay-controls {
            padding: 16px;
          }

          .replay-header {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 12px;
          }

          .replay-title {
            font-size: 16px;
            margin-bottom: 8px;
          }

          .replay-time {
            font-size: 14px;
          }

          .replay-main-controls {
            flex-direction: column;
          }

          .replay-button {
            width: 100%;
          }

          .speed-controls {
            margin-left: 0;
            width: 100%;
            justify-content: space-between;
          }

          .replay-highlights {
            width: 100%;
          }

          .replay-button {
            flex: 1;
          }
        }
      `}</style>

      <div className="replay-controls">
        {/* Header */}
        <div className="replay-header">
          <div className="replay-title">🎬 Race Replay</div>
          <div className="replay-time">{formatTime(currentTime)} / {formatTime(replay.duration)}</div>
        </div>

        {/* Progress bar */}
        <div
          className="replay-progress"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const time = percent * replay.duration;
            handleSeek(time);
          }}
        >
          <div className="replay-progress-fill"></div>
        </div>

        {/* Main controls */}
        <div className="replay-main-controls">
          <button className="replay-button" onClick={handlePlayPause}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>

          <div className="speed-controls">
            <span className="speed-label">Speed:</span>
            {[0.5, 1, 1.5, 2].map((speed) => (
              <button
                key={speed}
                className={`speed-button ${playSpeed === speed ? 'active' : ''}`}
                onClick={() => handleSpeedChange(speed)}
              >
                {speed}x
              </button>
            ))}
          </div>

          <button className="replay-button danger" onClick={onBackToResults}>
            ✕ Close
          </button>
        </div>

        {/* Highlights and modes */}
        <div className="replay-highlights" style={{ marginTop: '12px' }}>
          <button
            className={`replay-button ${replayMode === 'highlights' ? '' : 'secondary'}`}
            onClick={handlePlayHighlights}
          >
            ⭐ Highlights
          </button>
          <button
            className={`replay-button ${replayMode === 'final' ? '' : 'secondary'}`}
            onClick={handlePlayFinalMoments}
          >
            🏁 Final Moments
          </button>
          <button
            className={`replay-button ${replayMode === 'underwater' ? '' : 'secondary'}`}
            onClick={handleFocusUnderwater}
          >
            🌊 Underwater
          </button>
          <button className="replay-button secondary" onClick={handleSkipToHighlight}>
            ⏭ Next Highlight
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaceReplayScreen;
