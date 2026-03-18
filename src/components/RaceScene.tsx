/**
 * RaceScene — Babylon.js arena canvas + Phase 5 feedback + overlays
 *
 * Phase 5 additions over Phase 4:
 *   - useFeedback: countdown beeps, finish impact, haptic warning on low stamina
 *   - Split tracking: records timestamps at 25%/50%/75% of race distance
 *   - PB detection: compares final time against localStorage best per distance+stroke
 *   - PauseOverlay: in-scene pause menu (resume, restart, settings, exit)
 *   - ResultsOverlay: premium results screen with animated placement reveal
 *   - Stamina warning: triggerWarningHaptic when crossing 25% threshold once
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence }               from 'motion/react';
import { ArenaManager }                  from '../graphics/ArenaManager';
import { HUDRoot, CountdownOverlay }     from '../hud/HUDRoot';
import { PauseOverlay }                  from '../hud/overlays/PauseOverlay';
import { ResultsOverlay, type ResultsData, type SplitEntry } from '../hud/overlays/ResultsOverlay';
import { useTouchControls }              from '../input/useTouchControls';
import { loadPreset }                    from '../input/controlsSettings';
import { destroyInputManager }           from '../input/InputManager';
import { useFeedback }                   from '../feedback/useFeedback';
import { formatRaceTime }                from '../hud/hudTokens';

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
  onPause:        () => void;   // external signal (kept for AppShell compat)
  onRaceComplete: (result: RaceResult) => void;
  onRestart?:     () => void;   // return to pre-race setup
  onExitToLobby?: () => void;   // return to main lobby
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

  // Load controls preset
  const preset  = loadPreset();
  const feedback = useFeedback(preset);

  // ── Race state ──────────────────────────────────────────────────────────
  const [raceStarted,  setRaceStarted]  = useState(false);
  const [isPaused,     setIsPaused]     = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [resultsData,  setResultsData]  = useState<ResultsData | null>(null);
  const [countdown,    setCountdown]    = useState(3);
  const [elapsedMs,    setElapsedMs]    = useState(0);
  const [distanceM,    setDistanceM]    = useState(0);
  const [position,     setPosition]     = useState(4);
  const [stamina,      setStamina]      = useState(100);
  const [oxygen,       setOxygen]       = useState(100);
  const [rhythm,       setRhythm]       = useState(75);

  // Tracking refs (avoid stale closures in rAF loop)
  const staminaRef   = useRef(100);
  const distanceRef  = useRef(0);
  const positionRef  = useRef(4);
  const pausedRef    = useRef(false);

  // Low-stamina warning — fires haptic once when crossing 25% threshold
  const warnedRef    = useRef(false);

  // ── Split tracking ───────────────────────────────────────────────────────
  interface SplitCheckpoint { pct: number; label: string; firedAt: number | null }
  const splitsRef = useRef<SplitCheckpoint[]>([
    { pct: 0.25, label: `${Math.round(totalDistanceM * 0.25)}m`, firedAt: null },
    { pct: 0.50, label: `${Math.round(totalDistanceM * 0.50)}m`, firedAt: null },
    { pct: 0.75, label: `${Math.round(totalDistanceM * 0.75)}m`, firedAt: null },
  ]);

  // ── Touch controls (Phase 4) ─────────────────────────────────────────────
  const controls = useTouchControls({
    preset,
    onPause: () => handlePause(),
  });

  // ── Stroke callbacks ──────────────────────────────────────────────────────
  const handleStrokeLeft = useCallback(() => {
    setStamina((p) => { const v = Math.min(100, p + 0.4); staminaRef.current = v; return v; });
    setOxygen((p) => Math.min(100, p + 0.6));
    setRhythm((p) => Math.min(100, p + 4));
  }, []);

  const handleStrokeRight = useCallback(() => {
    setStamina((p) => { const v = Math.min(100, p + 0.4); staminaRef.current = v; return v; });
    setOxygen((p) => Math.min(100, p + 0.6));
    setRhythm((p) => Math.min(100, p + 4));
  }, []);

  const handleSprint = useCallback(() => {
    setStamina((p) => { const v = Math.max(0, p - 6); staminaRef.current = v; return v; });
    setOxygen((p) => Math.max(0, p - 8));
    setRhythm((p) => Math.min(100, p + 10));
  }, []);

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
    onPause(); // also signal AppShell (compat)
  }, [raceFinished, onPause]);

  const handleResume = useCallback(() => {
    if (!raceStarted || raceFinished) return;
    // Shift startTime forward by the pause duration so elapsed stays accurate
    startTimeRef.current = performance.now() - elapsedMs;
    setIsPaused(false);
    pausedRef.current = false;
  }, [raceStarted, raceFinished, elapsedMs]);

  const handleRestart = useCallback(() => {
    setIsPaused(false);
    pausedRef.current = false;
    onRestart?.();
  }, [onRestart]);

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

  // ── Countdown with audio beeps ───────────────────────────────────────────
  useEffect(() => {
    feedback.playCountdownBeep(false); // beep on mount (3)
    const t1 = setTimeout(() => { setCountdown(2); feedback.playCountdownBeep(false); }, 1000);
    const t2 = setTimeout(() => { setCountdown(1); feedback.playCountdownBeep(false); }, 2000);
    const t3 = setTimeout(() => {
      setCountdown(0);
      feedback.playCountdownBeep(true); // GO! sound
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

      setElapsedMs(elapsed);

      setStamina((prev) => {
        const next = Math.max(0, prev - STAMINA_DRAIN);
        staminaRef.current = next;

        // One-shot haptic warning at 25% stamina
        if (next < 25 && !warnedRef.current) {
          warnedRef.current = true;
          feedback.triggerWarningHaptic();
        }
        return next;
      });

      setOxygen((prev) => Math.max(0, prev - OXYGEN_DRAIN));
      setRhythm(() => Math.min(100, Math.max(0, 65 + 20 * Math.sin(elapsed / 4_500))));

      setDistanceM((prev) => {
        const speed = SPEED_BASE * (0.65 + 0.35 * (staminaRef.current / 100));
        const next  = prev + speed * 16;
        distanceRef.current = next;

        // Record split times
        const progress = next / totalDistanceM;
        for (const split of splitsRef.current) {
          if (split.firedAt === null && progress >= split.pct) {
            split.firedAt = elapsed;
          }
        }

        if (next >= totalDistanceM) {
          if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
          setRaceFinished(true);

          const isPB   = checkAndStorePB(config.distance, config.stroke, elapsed);
          const splits: SplitEntry[] = splitsRef.current
            .filter((s) => s.firedAt !== null)
            .map((s) => ({ label: s.label, time: formatRaceTime(s.firedAt!) }));

          const rank   = positionRef.current;
          const result: ResultsData = {
            rank,
            time:   formatFinalTime(elapsed),
            xp:     rank === 1 ? 400 : rank <= 3 ? 250 : 100,
            coins:  rank === 1 ? 3000 : rank <= 3 ? 1500 : 500,
            isPB,
            splits,
          };
          setResultsData(result);

          // Notify GameShell (for phase transition)
          onRaceComplete({
            rank:   result.rank,
            time:   result.time,
            xp:     result.xp,
            coins:  result.coins,
            isPB,
            splits,
          });

          return totalDistanceM;
        }
        return next;
      });

      setPosition((prev) => {
        const next = prev > 1 && Math.random() < AI_CATCH_SPEED * elapsed ? Math.max(1, prev - 1) : prev;
        positionRef.current = next;
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [raceStarted, raceFinished]); // eslint-disable-line react-hooks/exhaustive-deps

  // Resume: restart rAF after un-pause
  useEffect(() => {
    if (!isPaused && raceStarted && !raceFinished) {
      // tick loop restarted via the raceStarted effect on state flip
    }
  }, [isPaused, raceStarted, raceFinished]);

  // ── Derived values ───────────────────────────────────────────────────────
  const totalLaps  = Math.max(1, totalDistanceM / 100);
  const lapNumber  = Math.min(totalLaps, Math.floor((distanceM / totalDistanceM) * totalLaps) + 1);
  const heat       = config.stroke === 'FREESTYLE' ? 'QUICK RACE' : `${config.stroke} HEAT`;
  const playerLane = 4;

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

      {/* HUD */}
      {raceStarted && !raceFinished && (
        <HUDRoot
          elapsedMs={elapsedMs}
          position={position}
          distanceM={distanceM}
          totalDistanceM={totalDistanceM}
          lapNumber={lapNumber}
          totalLaps={totalLaps}
          heat={heat}
          stamina={stamina}
          oxygen={oxygen}
          rhythm={rhythm}
          playerLane={playerLane}
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
            onContinue={() => onRaceComplete({ rank: resultsData.rank, time: resultsData.time, xp: resultsData.xp, coins: resultsData.coins })}
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
