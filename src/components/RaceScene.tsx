/**
 * RaceScene - Babylon.js 3D arena canvas mount
 *
 * Mounts the WebGL canvas, boots ArenaManager, runs the race render loop,
 * and layers the Phase 3 HUDRoot DOM overlay on top.
 *
 * This component owns the entire screen while a race is active.
 *
 * Layout contract (landscape mobile):
 *   - canvas fills 100vw × 100vh (no scroll, touch-action: none)
 *   - HUDRoot is position:fixed, pointer-events-none by default
 *   - Only HUD interactive zones (stroke buttons, pause) have pointer-events: auto
 *   - Center screen is never blocked by persistent HUD elements
 *
 * Race simulation:
 *   The Babylon arena drives visuals; this component owns simplified
 *   race state (elapsed time, distance, stamina, oxygen, rhythm, position).
 *   In a full implementation these values would come from RaceEngine/GameManager.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArenaManager } from '../graphics/ArenaManager';
import { HUDRoot, CountdownOverlay } from '../hud/HUDRoot';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface RaceConfig {
  distance: string;   // e.g. "100M"
  stroke:   string;   // e.g. "FREESTYLE"
  venue:    string;   // e.g. "olympic"
}

export interface RaceResult {
  rank:   number;
  time:   string;
  xp:     number;
  coins:  number;
}

interface RaceSceneProps {
  config:         RaceConfig;
  onPause:        () => void;
  onRaceComplete: (result: RaceResult) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getVenueTheme(venue: string): 'OLYMPIC' | 'CHAMPIONSHIP' | 'NEON' | 'SUNSET' | 'CUSTOM' {
  const map: Record<string, 'OLYMPIC' | 'CHAMPIONSHIP' | 'NEON' | 'SUNSET' | 'CUSTOM'> = {
    olympic:        'OLYMPIC',
    training:       'CUSTOM',
    championship:   'CHAMPIONSHIP',
    neon:           'NEON',
    sunset:         'SUNSET',
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

// ─────────────────────────────────────────────────────────────────────────────
// RaceScene
// ─────────────────────────────────────────────────────────────────────────────

export const RaceScene: React.FC<RaceSceneProps> = ({ config, onPause, onRaceComplete }) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const arenaRef     = useRef<ArenaManager | null>(null);
  const rafRef       = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const totalDistanceM = parseInt(config.distance.replace('M', ''), 10) || 100;

  // ── Race state ──────────────────────────────────────────────────────────
  const [raceStarted, setRaceStarted] = useState(false);
  const [countdown,   setCountdown]   = useState(3);     // 3 → 2 → 1 → 0 (GO!)
  const [elapsedMs,   setElapsedMs]   = useState(0);
  const [distanceM,   setDistanceM]   = useState(0);
  const [position,    setPosition]    = useState(4);     // 1-8
  const [stamina,     setStamina]     = useState(100);
  const [oxygen,      setOxygen]      = useState(100);
  const [rhythm,      setRhythm]      = useState(75);

  // ── Babylon.js boot ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return;

    let disposed = false;
    const arena  = new ArenaManager(canvasRef.current);
    arenaRef.current = arena;

    arena.initialize().then(() => {
      if (disposed) return;
      arena.setTheme(getVenueTheme(config.venue));
    }).catch((err: Error) => {
      console.error('[RaceScene] ArenaManager init failed:', err);
    });

    const handleResize = () => arena.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      arena.dispose();
      arenaRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Animated countdown (3 → 2 → 1 → GO!) ───────────────────────────────
  useEffect(() => {
    const t1 = setTimeout(() => setCountdown(2), 1000);
    const t2 = setTimeout(() => setCountdown(1), 2000);
    const t3 = setTimeout(() => {
      setCountdown(0);   // "GO!"
      startTimeRef.current = performance.now();
      setRaceStarted(true);
    }, 3000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // ── Race simulation loop ─────────────────────────────────────────────────
  useEffect(() => {
    if (!raceStarted) return;

    const SPEED_BASE    = totalDistanceM / 55_000; // ~55 s to finish at base speed
    const STAMINA_DRAIN = 0.018;  // % per ms
    const OXYGEN_DRAIN  = 0.013;  // % per ms (recovers with strokes)
    const AI_CATCH_SPEED = 0.000_02;

    const tick = () => {
      const now     = performance.now();
      const elapsed = now - startTimeRef.current;

      setElapsedMs(elapsed);

      setStamina((prev) => Math.max(0, prev - STAMINA_DRAIN));
      setOxygen((prev)  => Math.max(0, prev - OXYGEN_DRAIN));

      // Rhythm oscillates naturally — strokes push it up (handled in callback)
      setRhythm(() => {
        const base = 65 + 20 * Math.sin(elapsed / 4_500);
        return Math.min(100, Math.max(0, base));
      });

      setDistanceM((prev) => {
        const speed = SPEED_BASE * (0.65 + 0.35 * (stamina / 100));
        const next  = prev + speed * 16; // ~16 ms per frame

        if (next >= totalDistanceM) {
          // Race complete
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
          setTimeout(() => {
            onRaceComplete({
              rank:   position,
              time:   formatFinalTime(elapsed),
              xp:     position === 1 ? 400 : position <= 3 ? 250 : 100,
              coins:  position === 1 ? 3000 : position <= 3 ? 1500 : 500,
            });
          }, 900);
          return totalDistanceM;
        }
        return next;
      });

      // AI slowly closes or falls behind
      setPosition((prev) => {
        if (prev > 1 && Math.random() < AI_CATCH_SPEED * elapsed) {
          return Math.max(1, prev - 1);
        }
        return prev;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [raceStarted]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Stroke handlers ──────────────────────────────────────────────────────
  const handleStrokeLeft = useCallback(() => {
    setStamina((prev) => Math.min(100, prev + 0.4));
    setOxygen((prev)  => Math.min(100, prev + 0.6));
    setRhythm((prev)  => Math.min(100, prev + 4));
  }, []);

  const handleStrokeRight = useCallback(() => {
    setStamina((prev) => Math.min(100, prev + 0.4));
    setOxygen((prev)  => Math.min(100, prev + 0.6));
    setRhythm((prev)  => Math.min(100, prev + 4));
  }, []);

  const handleSprint = useCallback(() => {
    // Sprint burns stamina/oxygen faster but boosts rhythm
    setStamina((prev) => Math.max(0, prev - 6));
    setOxygen((prev)  => Math.max(0, prev - 8));
    setRhythm((prev)  => Math.min(100, prev + 10));
  }, []);

  // ── Lap / heat derivation ────────────────────────────────────────────────
  //  For distances ≤ 100m: 1 lap.  For 200m: 2 laps. Etc.
  const totalLaps = Math.max(1, totalDistanceM / 100);
  const lapNumber = Math.min(totalLaps, Math.floor((distanceM / totalDistanceM) * totalLaps) + 1);
  const heat      = config.stroke === 'FREESTYLE' ? 'QUICK RACE' : `${config.stroke} HEAT`;
  const playerLane = 4; // default lane

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
      {/* Babylon.js canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none"
        style={{ touchAction: 'none' }}
      />

      {/* Countdown overlay (shows before race starts) */}
      {!raceStarted && <CountdownOverlay value={countdown} />}

      {/* Phase 3 HUD (shows once race is active) */}
      {raceStarted && (
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
          onPause={onPause}
          onStrokeLeft={handleStrokeLeft}
          onStrokeRight={handleStrokeRight}
          onSprint={handleSprint}
        />
      )}

      {/* Ticker keyframe kept for any legacy usage */}
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
