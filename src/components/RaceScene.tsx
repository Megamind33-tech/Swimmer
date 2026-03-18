/**
 * RaceScene - Babylon.js 3D arena canvas mount
 *
 * Mounts the WebGL canvas, boots ArenaManager, runs the race render loop,
 * and layers the Phase 4 HUDRoot DOM overlay on top.
 *
 * Phase 4: wires useTouchControls master hook so all input (touch, keyboard,
 * gamepad) flows through a single surface. ControlsPreset loaded from
 * localStorage via loadPreset(). Sprint is now fired from the controls
 * hook rather than a standalone callback.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArenaManager }                from '../graphics/ArenaManager';
import { HUDRoot, CountdownOverlay }   from '../hud/HUDRoot';
import { useTouchControls }            from '../input/useTouchControls';
import { loadPreset }                  from '../input/controlsSettings';
import { destroyInputManager }         from '../input/InputManager';

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

  // Load controls preset from localStorage (Phase 4)
  const preset = loadPreset();

  // ── Race state ──────────────────────────────────────────────────────────
  const [raceStarted, setRaceStarted] = useState(false);
  const [countdown,   setCountdown]   = useState(3);
  const [elapsedMs,   setElapsedMs]   = useState(0);
  const [distanceM,   setDistanceM]   = useState(0);
  const [position,    setPosition]    = useState(4);
  const [stamina,     setStamina]     = useState(100);
  const [oxygen,      setOxygen]      = useState(100);
  const [rhythm,      setRhythm]      = useState(75);

  // ── Stroke callbacks (referenced by touch controls) ──────────────────────
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
    setStamina((prev) => Math.max(0, prev - 6));
    setOxygen((prev)  => Math.max(0, prev - 8));
    setRhythm((prev)  => Math.min(100, prev + 10));
  }, []);

  // ── Touch controls master hook (Phase 4) ─────────────────────────────────
  const controls = useTouchControls({
    preset,
    onPause,
    onJoystick: undefined,   // future: pass to ArenaManager for camera/steering
  });

  // Mirror sprint from controls buffer into game state
  useEffect(() => {
    const { buffer } = controls;
    const SPRINT_WINDOW = 80; // ms

    // Poll for sprint in the buffer on each render cycle
    // (buffer itself does not trigger re-renders)
    if (buffer.wasPressed('sprint', SPRINT_WINDOW)) {
      handleSprint();
    }
    if (buffer.wasPressed('strokeLeft', SPRINT_WINDOW)) {
      handleStrokeLeft();
    }
    if (buffer.wasPressed('strokeRight', SPRINT_WINDOW)) {
      handleStrokeRight();
    }
  }); // no deps — runs every render (intentional polling)

  // ── Cleanup InputManager on unmount ──────────────────────────────────────
  useEffect(() => {
    return () => {
      destroyInputManager();
      controls.gestureLock.clear();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      setCountdown(0);
      startTimeRef.current = performance.now();
      setRaceStarted(true);
    }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // ── Race simulation loop ─────────────────────────────────────────────────
  useEffect(() => {
    if (!raceStarted) return;

    const SPEED_BASE     = totalDistanceM / 55_000;
    const STAMINA_DRAIN  = 0.018;
    const OXYGEN_DRAIN   = 0.013;
    const AI_CATCH_SPEED = 0.000_02;

    const tick = () => {
      const now     = performance.now();
      const elapsed = now - startTimeRef.current;

      setElapsedMs(elapsed);
      setStamina((prev) => Math.max(0, prev - STAMINA_DRAIN));
      setOxygen((prev)  => Math.max(0, prev - OXYGEN_DRAIN));
      setRhythm(() => Math.min(100, Math.max(0, 65 + 20 * Math.sin(elapsed / 4_500))));

      setDistanceM((prev) => {
        const speed = SPEED_BASE * (0.65 + 0.35 * (stamina / 100));
        const next  = prev + speed * 16;

        if (next >= totalDistanceM) {
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

      setPosition((prev) => {
        if (prev > 1 && Math.random() < AI_CATCH_SPEED * elapsed) return Math.max(1, prev - 1);
        return prev;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [raceStarted]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Lap / heat derivation ────────────────────────────────────────────────
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

      {/* Countdown overlay */}
      {!raceStarted && <CountdownOverlay value={countdown} />}

      {/* Phase 4 HUD */}
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
          controls={controls}
          preset={preset}
          onPause={onPause}
        />
      )}

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
