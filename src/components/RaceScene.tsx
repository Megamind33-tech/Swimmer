/**
 * RaceScene — Babylon.js arena canvas + swimming race HUD
 *
 * Phase 5: feedback controller (beeps, haptics, overlays)
 * Phase 6: useRaceState (sim ref + throttled display state)
 * Phase 7: swimming identity — standings, splits, turn tracking,
 *           split flash, proper event naming, lane assignment
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence }               from 'motion/react';
import { ArenaManager }                  from '../graphics/ArenaManager';
import { HUDRoot, CountdownOverlay }     from '../hud/HUDRoot';
import { PauseOverlay }                  from '../hud/overlays/PauseOverlay';
import { ResultsOverlay, type ResultsData, type SplitEntry, type StandingEntry } from '../hud/overlays/ResultsOverlay';
import type { SplitFlashData }           from '../hud/widgets/SplitFlash';
import { useTouchControls }              from '../input/useTouchControls';
import { loadPreset }                    from '../input/controlsSettings';
import { destroyInputManager }           from '../input/InputManager';
import { useFeedback }                   from '../feedback/useFeedback';
import { formatRaceTime }                from '../hud/hudTokens';
import { useRaceState }                  from '../performance/useRaceState';
import { loadPerformancePreset }         from '../performance/performancePreset';
import { prewarmCriticalAssets }         from '../performance/optimizationHelpers';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface RaceConfig {
  distance: string;   // e.g. "100M"
  stroke:   string;   // e.g. "FREESTYLE"
  venue:    string;   // e.g. "olympic"
}

export interface RaceResult {
  rank:    number;
  time:    string;
  xp:      number;
  coins:   number;
  isPB?:   boolean;
  splits?: SplitEntry[];
}

interface RaceSceneProps {
  config:         RaceConfig;
  onPause:        () => void;
  onRaceComplete: (result: RaceResult) => void;
  onRestart?:     () => void;
  onExitToLobby?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getVenueTheme(venue: string): 'OLYMPIC' | 'CHAMPIONSHIP' | 'NEON' | 'SUNSET' | 'CUSTOM' {
  const map: Record<string, 'OLYMPIC' | 'CHAMPIONSHIP' | 'NEON' | 'SUNSET' | 'CUSTOM'> = {
    olympic:      'OLYMPIC',
    training:     'CUSTOM',
    championship: 'CHAMPIONSHIP',
    neon:         'NEON',
    sunset:       'SUNSET',
  };
  return map[venue] ?? 'OLYMPIC';
}

function formatFinalTime(ms: number): string {
  const totalSec = ms / 1000;
  const mins  = Math.floor(totalSec / 60);
  const secs  = Math.floor(totalSec % 60);
  const cents = Math.floor((ms % 1000) / 10);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(cents).padStart(2, '0')}`;
}

/** Check + update PB in localStorage. Returns true if this time is a new best. */
function checkAndStorePB(distanceStr: string, stroke: string, elapsedMs: number): boolean {
  const key = `swimmer_pb_${distanceStr}_${stroke}`.toUpperCase();
  try {
    const stored = localStorage.getItem(key);
    const prev   = stored ? parseInt(stored, 10) : Infinity;
    if (elapsedMs < prev) {
      localStorage.setItem(key, String(Math.round(elapsedMs)));
      return true;
    }
  } catch { /* storage unavailable */ }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Standings generator
// ─────────────────────────────────────────────────────────────────────────────

const AI_NAMES = ['TAYLOR', 'CHEN', 'MÜLLER', 'NAKAMURA', 'SMITH', 'JONES', 'COSTA', 'PARK'];

/**
 * Generates final standings for all 8 lanes.
 * Player is placed at their actual position; AI gap times are randomized.
 */
function generateFinalStandings(
  playerTimeMs:   number,
  playerPosition: number,
  playerLane:     number,
): StandingEntry[] {
  // Assign other lanes (randomized) to the 7 AI swimmers
  const otherLanes = [1, 2, 3, 4, 5, 6, 7, 8].filter(l => l !== playerLane);
  for (let i = otherLanes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [otherLanes[i], otherLanes[j]] = [otherLanes[j], otherLanes[i]];
  }

  const entries: StandingEntry[] = [];
  let aiLaneIdx = 0;

  for (let pos = 1; pos <= 8; pos++) {
    const isPlayer = pos === playerPosition;
    const lane     = isPlayer ? playerLane : otherLanes[aiLaneIdx++];

    // Time: player is exact; AI gaps scale with position difference
    let timeMs: number;
    if (isPlayer) {
      timeMs = playerTimeMs;
    } else if (pos < playerPosition) {
      // Swimmer ahead: gap grows with how far ahead they are
      const gap = (playerPosition - pos) * (420 + Math.random() * 780);
      timeMs = playerTimeMs - gap;
    } else {
      // Swimmer behind
      const gap = (pos - playerPosition) * (420 + Math.random() * 780);
      timeMs = playerTimeMs + gap;
    }

    entries.push({
      position: pos,
      lane,
      name:     isPlayer ? 'YOU' : AI_NAMES[(lane - 1) % AI_NAMES.length],
      time:     formatFinalTime(Math.max(0, timeMs)),
      isPlayer,
    });
  }

  return entries;
}

// ─────────────────────────────────────────────────────────────────────────────
// RaceScene
// ─────────────────────────────────────────────────────────────────────────────

export const RaceScene: React.FC<RaceSceneProps> = ({
  config,
  onPause,
  onRaceComplete,
  onRestart,
  onExitToLobby,
}) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const arenaRef     = useRef<ArenaManager | null>(null);
  const rafRef       = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const totalDistanceM = parseInt(config.distance.replace('M', ''), 10) || 100;
  const playerLane     = 4;  // center lane — could come from pre-race selection

  // Presets
  const preset     = loadPreset();
  const perfPreset = loadPerformancePreset();
  const feedback   = useFeedback(preset);

  // Phase 6: throttled race state
  const { sim, timerDisplay, cosmeticDisplay, commitDisplay, resetState } = useRaceState(perfPreset);

  // ── Race phase state ─────────────────────────────────────────────────────
  const [raceStarted,  setRaceStarted]  = useState(false);
  const [isPaused,     setIsPaused]     = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [resultsData,  setResultsData]  = useState<ResultsData | null>(null);
  const [countdown,    setCountdown]    = useState(3);

  // ── Split flash state ────────────────────────────────────────────────────
  const [activeSplit,    setActiveSplit]    = useState<SplitFlashData | null>(null);
  const splitFlashTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pause ref
  const pausedRef  = useRef(false);

  // Low-stamina warning — one-shot haptic at <25%
  const warnedRef  = useRef(false);

  // ── Split checkpoints ────────────────────────────────────────────────────
  interface SplitCheckpoint { pct: number; label: string; firedAt: number | null }
  const splitsRef = useRef<SplitCheckpoint[]>([
    { pct: 0.25, label: `${Math.round(totalDistanceM * 0.25)}M`, firedAt: null },
    { pct: 0.50, label: `${Math.round(totalDistanceM * 0.50)}M`, firedAt: null },
    { pct: 0.75, label: `${Math.round(totalDistanceM * 0.75)}M`, firedAt: null },
  ]);

  // ── Heat name ────────────────────────────────────────────────────────────
  // Stable per race session
  const heatRef  = useRef(`HEAT ${Math.floor(Math.random() * 3) + 1}`);
  const heat     = heatRef.current;

  // ── Touch controls ───────────────────────────────────────────────────────
  const controls = useTouchControls({
    preset,
    onPause: () => handlePause(),
  });

  // ── Stroke callbacks — mutate sim.current ─────────────────────────────
  const handleStrokeLeft = useCallback(() => {
    sim.current.stamina = Math.min(100, sim.current.stamina + 0.4);
    sim.current.oxygen  = Math.min(100, sim.current.oxygen  + 0.6);
    sim.current.rhythm  = Math.min(100, sim.current.rhythm  + 4);
  }, [sim]);

  const handleStrokeRight = useCallback(() => {
    sim.current.stamina = Math.min(100, sim.current.stamina + 0.4);
    sim.current.oxygen  = Math.min(100, sim.current.oxygen  + 0.6);
    sim.current.rhythm  = Math.min(100, sim.current.rhythm  + 4);
  }, [sim]);

  const handleSprint = useCallback(() => {
    sim.current.stamina = Math.max(0, sim.current.stamina - 6);
    sim.current.oxygen  = Math.max(0, sim.current.oxygen  - 8);
    sim.current.rhythm  = Math.min(100, sim.current.rhythm + 10);
  }, [sim]);

  // Mirror controls buffer → game state
  useEffect(() => {
    const { buffer } = controls;
    const W = 80;
    if (buffer.wasPressed('sprint',      W)) handleSprint();
    if (buffer.wasPressed('strokeLeft',  W)) handleStrokeLeft();
    if (buffer.wasPressed('strokeRight', W)) handleStrokeRight();
  });

  // ── Pause handling ───────────────────────────────────────────────────────
  const handlePause = useCallback(() => {
    if (raceFinished) return;
    setIsPaused(true);
    pausedRef.current = true;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    onPause();
  }, [raceFinished, onPause]);

  const handleResume = useCallback(() => {
    if (!raceStarted || raceFinished) return;
    startTimeRef.current = performance.now() - sim.current.elapsed;
    setIsPaused(false);
    pausedRef.current = false;
  }, [raceStarted, raceFinished, sim]);

  const handleRestart = useCallback(() => {
    setIsPaused(false);
    pausedRef.current = false;
    resetState();
    onRestart?.();
  }, [onRestart, resetState]);

  const handleExitToLobby = useCallback(() => {
    setIsPaused(false);
    pausedRef.current = false;
    onExitToLobby?.();
  }, [onExitToLobby]);

  // ── Cleanup ──────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      destroyInputManager();
      controls.gestureLock.clear();
      if (splitFlashTimer.current) clearTimeout(splitFlashTimer.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Babylon.js boot ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return;
    let disposed = false;
    const arena  = new ArenaManager(canvasRef.current);
    arenaRef.current = arena;

    arena.initialize().then(() => {
      if (disposed) return;
      arena.setTheme(getVenueTheme(config.venue));
    }).catch((err: Error) => console.error('[RaceScene] ArenaManager init failed:', err));

    const handleResize = () => arena.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      arena.dispose();
      arenaRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Countdown + prewarm ───────────────────────────────────────────────────
  useEffect(() => {
    prewarmCriticalAssets().catch(() => { /* non-critical */ });
    feedback.playCountdownBeep(false);
    const t1 = setTimeout(() => { setCountdown(2); feedback.playCountdownBeep(false); }, 1000);
    const t2 = setTimeout(() => { setCountdown(1); feedback.playCountdownBeep(false); }, 2000);
    const t3 = setTimeout(() => {
      setCountdown(0);
      feedback.playCountdownBeep(true);
      feedback.triggerMediumHaptic();
      startTimeRef.current = performance.now();
      setRaceStarted(true);
    }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Race simulation loop ──────────────────────────────────────────────────
  useEffect(() => {
    if (!raceStarted || raceFinished) return;

    const SPEED_BASE     = totalDistanceM / 55_000;
    const STAMINA_DRAIN  = 0.018;
    const OXYGEN_DRAIN   = 0.013;
    const AI_CATCH_SPEED = 0.000_02;

    const tick = () => {
      if (pausedRef.current) { rafRef.current = requestAnimationFrame(tick); return; }

      const now     = performance.now();
      const elapsed = now - startTimeRef.current;

      sim.current.elapsed = elapsed;

      // Stamina drain + low-stamina haptic
      const nextStamina = Math.max(0, sim.current.stamina - STAMINA_DRAIN);
      sim.current.stamina = nextStamina;
      if (nextStamina < 25 && !warnedRef.current) {
        warnedRef.current = true;
        feedback.triggerWarningHaptic();
      }

      sim.current.oxygen = Math.max(0, sim.current.oxygen - OXYGEN_DRAIN);
      sim.current.rhythm = Math.min(100, Math.max(0, 65 + 20 * Math.sin(elapsed / 4_500)));

      // Distance update
      const speed   = SPEED_BASE * (0.65 + 0.35 * (sim.current.stamina / 100));
      const newDist = Math.min(totalDistanceM, sim.current.distance + speed * 16);
      sim.current.distance = newDist;

      // Split checkpoints — fire flash + record time
      const progress = newDist / totalDistanceM;
      for (const split of splitsRef.current) {
        if (split.firedAt === null && progress >= split.pct) {
          split.firedAt = elapsed;

          // Trigger split flash (visible for 3s)
          if (splitFlashTimer.current) clearTimeout(splitFlashTimer.current);
          const flashData: SplitFlashData = {
            id:    `${split.label}_${Math.round(elapsed)}`,
            label: split.label,
            time:  formatRaceTime(elapsed),
          };
          setActiveSplit(flashData);
          splitFlashTimer.current = setTimeout(() => setActiveSplit(null), 3000);
        }
      }

      // AI position simulation
      if (sim.current.position > 1 && Math.random() < AI_CATCH_SPEED * elapsed) {
        sim.current.position = Math.max(1, sim.current.position - 1);
      }

      // Push to throttled React display state
      commitDisplay();

      // ── Race finish ───────────────────────────────────────────────────
      if (newDist >= totalDistanceM) {
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        setRaceFinished(true);

        const isPB = checkAndStorePB(config.distance, config.stroke, elapsed);
        const splits: SplitEntry[] = splitsRef.current
          .filter((s) => s.firedAt !== null)
          .map((s) => ({ label: s.label, time: formatRaceTime(s.firedAt!) }));

        const rank       = sim.current.position;
        const standings  = generateFinalStandings(elapsed, rank, playerLane);
        const eventName  = `${totalDistanceM}M ${config.stroke.toUpperCase()}`;

        const result: ResultsData = {
          rank,
          time:      formatFinalTime(elapsed),
          xp:        rank === 1 ? 400 : rank <= 3 ? 250 : 100,
          coins:     rank === 1 ? 3000 : rank <= 3 ? 1500 : 500,
          isPB,
          splits,
          eventName,
          heat,
          standings,
        };
        setResultsData(result);

        onRaceComplete({
          rank:   result.rank,
          time:   result.time,
          xp:     result.xp,
          coins:  result.coins,
          isPB,
          splits,
        });
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [raceStarted, raceFinished]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived values ───────────────────────────────────────────────────────
  const totalLaps = Math.max(1, totalDistanceM / 100);
  const lapNumber = Math.min(totalLaps, Math.floor((timerDisplay.distanceM / totalDistanceM) * totalLaps) + 1);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
      {/* Babylon.js canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none"
        style={{ touchAction: 'none' }}
      />

      {/* Countdown */}
      {!raceStarted && <CountdownOverlay value={countdown} />}

      {/* HUD — throttled display state (30Hz timer, 15Hz cosmetics) */}
      {raceStarted && !raceFinished && (
        <HUDRoot
          elapsedMs={timerDisplay.elapsedMs}
          position={cosmeticDisplay.position}
          distanceM={timerDisplay.distanceM}
          totalDistanceM={totalDistanceM}
          lapNumber={lapNumber}
          totalLaps={totalLaps}
          heat={heat}
          stroke={config.stroke}
          stamina={cosmeticDisplay.stamina}
          oxygen={cosmeticDisplay.oxygen}
          rhythm={cosmeticDisplay.rhythm}
          playerLane={playerLane}
          activeSplit={activeSplit}
          controls={controls}
          preset={preset}
          onPause={handlePause}
        />
      )}

      {/* Pause overlay */}
      <AnimatePresence>
        {isPaused && (
          <PauseOverlay
            key="pause"
            onResume={handleResume}
            onRestart={handleRestart}
            onExit={handleExitToLobby}
          />
        )}
      </AnimatePresence>

      {/* Results overlay */}
      <AnimatePresence>
        {raceFinished && resultsData && (
          <ResultsOverlay
            key="results"
            data={resultsData}
            onReplay={handleRestart}
            onContinue={() => onRaceComplete({
              rank:   resultsData.rank,
              time:   resultsData.time,
              xp:     resultsData.xp,
              coins:  resultsData.coins,
            })}
            onLobby={handleExitToLobby}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default RaceScene;
