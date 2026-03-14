/**
 * QuickRaceScreen Component
 * Complete Quick Race mode UI wrapper
 *
 * Features:
 * - Opponent selection (Easy, Normal, Hard)
 * - Distance/stroke selection
 * - Live race display with RaceHUD
 * - Results screen integration
 * - Race flow management
 *
 * Performance: <50ms per state transition
 */

import React, { useState, useCallback, useMemo } from 'react';
import { IPlayerSwimmer, IRaceSetup, IAISwimmer, SwimmingStroke, IGameManagerHook } from '../types/index';
import RaceController from '../core/RaceController';
import RaceHUD from './RaceHUD';
import RaceResultsScreen from './RaceResultsScreen';

interface QuickRaceScreenProps {
  player: IPlayerSwimmer | null;
  gameManager: IGameManagerHook;
  opponents: IAISwimmer[];
  onBackToMenu?: () => void;
}

type QuickRacePhase = 'SETUP' | 'STARTING' | 'RACING' | 'RESULTS';

const QuickRaceScreen: React.FC<QuickRaceScreenProps> = ({
  player,
  gameManager,
  opponents,
  onBackToMenu,
}) => {
  // Race state
  const [phase, setPhase] = useState<QuickRacePhase>('SETUP');
  const [raceController] = useState(() => new RaceController());
  const [selectedDifficulty, setSelectedDifficulty] = useState<'EASY' | 'NORMAL' | 'HARD'>('NORMAL');
  const [selectedDistance, setSelectedDistance] = useState<50 | 100 | 200 | 400>(50);
  const [selectedStroke, setSelectedStroke] = useState<SwimmingStroke>('FREESTYLE');
  const [raceState, setRaceState] = useState(raceController.getRaceState());
  const [countdownValue, setCountdownValue] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(false);

  // Results state
  const [playerRank, setPlayerRank] = useState(0);
  const [playerTime, setPlayerTime] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  // Get difficulty-adjusted opponents
  const selectedOpponents = useMemo(() => {
    const difficultyMap = {
      EASY: 1,
      NORMAL: 3,
      HARD: 5,
    };

    const count = difficultyMap[selectedDifficulty];
    const selected = opponents.slice(0, count);

    // Adjust opponent skill based on difficulty
    return selected.map((opponent) => ({
      ...opponent,
      skillTier: selectedDifficulty === 'EASY' ? 2 : selectedDifficulty === 'HARD' ? 8 : opponent.skillTier,
    }));
  }, [selectedDifficulty, opponents]);

  // Setup race event listeners
  const setupRaceListeners = useCallback(() => {
    raceController.on('raceStart', () => {
      setPhase('RACING');
      setIsCountingDown(true);
    });

    raceController.on('raceCountdown', (count: number) => {
      setCountdownValue(count);
    });

    raceController.on('raceBegin', () => {
      setIsCountingDown(false);
    });

    raceController.on('raceProgress', (data) => {
      setRaceState(raceController.getRaceState());
    });

    raceController.on('raceFinished', (state) => {
      // Calculate results
      const playerSwimmer = state.swimmers.find(
        (s) => s.name === (player?.name || 'Player')
      );

      if (playerSwimmer) {
        setPlayerRank(playerSwimmer.finishRank);
        setPlayerTime(playerSwimmer.finishTime);

        // Calculate XP: base 100 + rank bonus
        const baseXP = 100;
        const rankBonus = Math.max(0, (3 - playerSwimmer.finishRank) * 50);
        const totalXP = baseXP + rankBonus;
        setXpEarned(totalXP);
      }

      setPhase('RESULTS');
    });
  }, [player?.name, raceController]);

  // Start race
  const handleStartRace = useCallback(() => {
    if (!player) return;

    // Show arena with swimmers on starting blocks first, THEN start countdown
    setPhase('STARTING');

    const raceSetup: IRaceSetup = {
      mode: 'QUICK_RACE',
      distance: selectedDistance,
      stroke: selectedStroke,
      poolTheme: 'OLYMPIC',
      timeOfDay: 'AFTERNOON',
      difficulty: selectedDifficulty,
      opponents: selectedOpponents.map((opp) => ({
        ...opp,
        lane: (selectedOpponents.indexOf(opp) % 8) + 1,
      })),
    };

    // Wait for swimmers to be shown on starting blocks before countdown begins
    setTimeout(() => {
      setupRaceListeners();
      raceController.initializeRace(raceSetup);
      setRaceState(raceController.getRaceState());

      // Start race loop
      let lastTime = performance.now();
      const raceLoop = () => {
        const now = performance.now();
        const deltaTime = now - lastTime;
        lastTime = now;

        raceController.updateRace(deltaTime);
        setRaceState(raceController.getRaceState());

        if (!raceController.isRaceFinished()) {
          requestAnimationFrame(raceLoop);
        }
      };

      requestAnimationFrame(raceLoop);
    }, 2500);
  }, [player, selectedDistance, selectedStroke, selectedDifficulty, selectedOpponents, setupRaceListeners, raceController]);

  const handleReplay = useCallback(() => {
    raceController.cleanup();
    setPhase('SETUP');
    setCountdownValue(3);
    setIsCountingDown(false);
  }, [raceController]);

  const handleBackToMenu = useCallback(() => {
    raceController.cleanup();
    if (onBackToMenu) {
      onBackToMenu();
    }
  }, [raceController, onBackToMenu]);

  // Get player swimmer for HUD
  const playerSwimmer = useMemo(() => {
    if (!raceState || !player) return null;
    return raceState.swimmers.find((s) => s.name === player.name) || null;
  }, [raceState, player]);

  if (phase === 'SETUP') {
    return (
      <div className="quick-race-setup">
        <style>{`
          .quick-race-setup {
            min-height: 100vh;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: white;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .setup-container {
            max-width: 500px;
            width: 100%;
          }

          .setup-title {
            font-size: 32px;
            font-weight: 900;
            text-align: center;
            margin-bottom: 32px;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          }

          .setup-section {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            backdrop-filter: blur(8px);
          }

          .section-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 12px;
          }

          .option-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
          }

          .option-button {
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 13px;
            font-weight: 600;
            text-align: center;
          }

          .option-button:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.4);
          }

          .option-button.selected {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border-color: #1e40af;
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
          }

          .difficulty-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
          }

          .start-button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 20px;
          }

          .start-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
          }

          .back-button {
            width: 100%;
            padding: 12px;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            color: white;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 12px;
          }

          .back-button:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.5);
          }

          @media (max-width: 480px) {
            .quick-race-setup {
              padding: 12px;
            }

            .setup-title {
              font-size: 24px;
            }

            .option-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        <div className="setup-container">
          <h1 className="setup-title">⚡ Quick Race</h1>

          {/* Distance Selection */}
          <div className="setup-section">
            <div className="section-title">Distance</div>
            <div className="option-grid">
              {[50, 100, 200, 400].map((distance) => (
                <button
                  key={distance}
                  className={`option-button ${selectedDistance === distance ? 'selected' : ''}`}
                  onClick={() => setSelectedDistance(distance as 50 | 100 | 200 | 400)}
                >
                  {distance}m
                </button>
              ))}
            </div>
          </div>

          {/* Stroke Selection */}
          <div className="setup-section">
            <div className="section-title">Stroke</div>
            <div className="option-grid">
              {['FREESTYLE', 'BUTTERFLY', 'BREASTSTROKE'].map((stroke) => (
                <button
                  key={stroke}
                  className={`option-button ${selectedStroke === stroke ? 'selected' : ''}`}
                  onClick={() => setSelectedStroke(stroke as SwimmingStroke)}
                >
                  {stroke === 'FREESTYLE' ? '🏊' : stroke === 'BUTTERFLY' ? '🦋' : '🐸'} {stroke.substring(0, 4)}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="setup-section">
            <div className="section-title">Difficulty</div>
            <div className="difficulty-buttons">
              {(['EASY', 'NORMAL', 'HARD'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  className={`option-button ${selectedDifficulty === difficulty ? 'selected' : ''}`}
                  onClick={() => setSelectedDifficulty(difficulty)}
                >
                  {difficulty === 'EASY' ? '😊' : difficulty === 'NORMAL' ? '😐' : '😈'} {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Opponent Count */}
          <div className="setup-section">
            <div className="section-title">Opponents: {selectedOpponents.length}</div>
            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
              {selectedDifficulty === 'EASY'
                ? '1 opponent'
                : selectedDifficulty === 'NORMAL'
                ? '3 opponents'
                : '5 opponents'}
            </p>
          </div>

          <button className="start-button" onClick={handleStartRace}>
            Start Race
          </button>
          <button className="back-button" onClick={handleBackToMenu}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'STARTING') {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(180deg, #0a1628 0%, #0d2137 50%, #0a3d62 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Pool lanes */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '45%',
          background: 'linear-gradient(180deg, #1565c0 0%, #0d47a1 100%)',
          borderTop: '4px solid rgba(255,255,255,0.3)',
        }}>
          {/* Lane dividers */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${((i + 1) / 8) * 100}%`,
              width: '2px',
              background: 'rgba(255,255,255,0.25)',
            }} />
          ))}
        </div>

        {/* Starting blocks row */}
        <div style={{
          position: 'absolute',
          bottom: '43%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-around',
          padding: '0 3%',
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              {/* Swimmer on block */}
              <div style={{
                fontSize: '28px',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                animation: 'none',
              }}>
                🏊
              </div>
              {/* Starting block */}
              <div style={{
                width: '32px',
                height: '12px',
                background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '3px 3px 0 0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              }} />
            </div>
          ))}
        </div>

        {/* "Approaching starting blocks" label */}
        <div style={{
          position: 'absolute',
          top: '30%',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.9)',
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            marginBottom: '8px',
          }}>
            Swimmers to Starting Blocks
          </div>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '1px',
          }}>
            {selectedDistance}m {selectedStroke.charAt(0) + selectedStroke.slice(1).toLowerCase()}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'RACING') {
    return (
      <div className="quick-race-racing">
        <div style={{ width: '100%', height: '100vh' }}>
          {/* 3D race would be rendered here (Babylon.js) */}
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #87ceeb 0%, #4a90a4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
          }}>
            3D Race Rendering (Babylon.js integration in Phase 2)
          </div>
        </div>
        <RaceHUD
          raceState={raceState}
          playerSwimmer={playerSwimmer}
          totalDistance={selectedDistance}
          countdownValue={countdownValue}
          isCountingDown={isCountingDown}
        />
      </div>
    );
  }

  // Results phase
  return (
    <RaceResultsScreen
      raceState={raceState}
      playerName={player?.name || 'Player'}
      playerRank={playerRank}
      playerTime={playerTime}
      xpEarned={xpEarned}
      currencyEarned={Math.floor(playerRank <= 3 ? (4 - playerRank) * 50 : 0)}
      cosmeticsDropped={playerRank === 1 ? ['Victory Suit'] : []}
      achievementsUnlocked={playerRank === 1 ? ['First Victory'] : []}
      onReplay={handleReplay}
      onNextRace={handleReplay}
      onBackToMenu={handleBackToMenu}
    />
  );
};

export default QuickRaceScreen;
