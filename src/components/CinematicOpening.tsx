/**
 * SWIM 26 - Cinematic Opening
 * Mosty Games Presents: Professional FIFA-style cinematic introduction
 */

import React, { useState, useEffect } from 'react';
import '../styles/cinematic.css';

interface CinematicOpeningProps {
  onComplete: () => void;
}

export const CinematicOpening: React.FC<CinematicOpeningProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'logo' | 'presents' | 'cover' | 'complete'>('logo');
  const [skipEnabled, setSkipEnabled] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    if (phase === 'logo') {
      timers.push(
        setTimeout(() => setPhase('presents'), 2000)
      );
    } else if (phase === 'presents') {
      timers.push(
        setTimeout(() => setPhase('cover'), 2000)
      );
    } else if (phase === 'cover') {
      timers.push(
        setTimeout(() => setSkipEnabled(true), 1000),
        setTimeout(() => setPhase('complete'), 5000)
      );
    }

    return () => timers.forEach(t => clearTimeout(t));
  }, [phase]);

  useEffect(() => {
    if (phase === 'complete') {
      onComplete();
    }
  }, [phase, onComplete]);

  const handleSkip = () => {
    if (skipEnabled) {
      onComplete();
    }
  };

  return (
    <div className="cinematic-opening">
      {/* Mosty Games Logo */}
      {phase === 'logo' && (
        <div className="cinematic-phase logo-phase">
          <div className="logo-content">
            <h1 className="mosty-logo">MOSTY GAMES</h1>
            <div className="logo-underline"></div>
          </div>
          <p className="phase-text">A Premium Gaming Experience</p>
        </div>
      )}

      {/* Presents */}
      {phase === 'presents' && (
        <div className="cinematic-phase presents-phase">
          <div className="presents-content">
            <p className="presents-text">PRESENTS</p>
          </div>
        </div>
      )}

      {/* Cover with Mia Phiri */}
      {(phase === 'cover' || phase === 'complete') && (
        <div className="cinematic-phase cover-phase">
          <div className="cover-container">
            {/* Background swimmer image */}
            <img
              src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
              alt="Swimming"
              className="cover-background"
              style={{
                backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: '100%',
                height: '100%'
              }}
            />

            <div className="cover-overlay"></div>

            <div className="cover-text-container">
              <h2 className="game-title">SWIM 26</h2>
              <p className="game-subtitle">Championship Edition</p>
            </div>
          </div>

          {/* Skip Indicator */}
          {skipEnabled && (
            <button
              className="skip-button"
              onClick={handleSkip}
            >
              PRESS ANY KEY TO SKIP
            </button>
          )}
        </div>
      )}

      {/* Progress indicator */}
      <div className="cinematic-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: phase === 'logo' ? '25%' :
                     phase === 'presents' ? '50%' :
                     phase === 'cover' ? '100%' : '100%'
            }}
          ></div>
        </div>
      </div>

      <style>{`
        .cinematic-opening {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          font-family: 'Arial', sans-serif;
        }

        .cinematic-phase {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          animation: fadeInOut 2s ease-in-out;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }

        .logo-phase {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          flex-direction: column;
          gap: 20px;
        }

        .logo-content {
          text-align: center;
        }

        .mosty-logo {
          font-size: 4rem;
          font-weight: 900;
          color: #fff;
          margin: 0;
          letter-spacing: 4px;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }

        .logo-underline {
          height: 3px;
          width: 200px;
          background: linear-gradient(90deg, #ffd700, #ffed4e);
          margin: 20px auto 0;
          animation: expandWidth 1.5s ease-out;
        }

        @keyframes expandWidth {
          from { width: 0; }
          to { width: 200px; }
        }

        .phase-text {
          color: #aaa;
          font-size: 1rem;
          letter-spacing: 2px;
          margin: 0;
        }

        .presents-phase {
          background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
        }

        .presents-content {
          text-align: center;
        }

        .presents-text {
          font-size: 3.5rem;
          font-weight: 700;
          color: #ffd700;
          margin: 0;
          letter-spacing: 3px;
          animation: scaleIn 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .cover-phase {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
        }

        .cover-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cover-background {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.3;
        }

        .cover-overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
          z-index: 1;
        }

        .cover-text-container {
          position: relative;
          z-index: 2;
          text-align: center;
          color: #fff;
        }

        .game-title {
          font-size: 5rem;
          font-weight: 900;
          margin: 0 0 10px 0;
          letter-spacing: 8px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
          animation: slideDown 1s ease-out;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .game-subtitle {
          font-size: 1.5rem;
          font-weight: 300;
          margin: 0 0 30px 0;
          letter-spacing: 3px;
          color: #ffd700;
        }


        .skip-button {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          padding: 10px 20px;
          font-size: 0.9rem;
          cursor: pointer;
          border-radius: 5px;
          backdrop-filter: blur(10px);
          animation: blink 1.5s infinite;
          z-index: 2;
        }

        @keyframes blink {
          0%, 49%, 100% { opacity: 1; }
          50%, 99% { opacity: 0.5; }
        }

        .skip-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .cinematic-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          z-index: 10;
        }

        .progress-bar {
          width: 100%;
          height: 100%;
          background: transparent;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffd700, #ffed4e);
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default CinematicOpening;
