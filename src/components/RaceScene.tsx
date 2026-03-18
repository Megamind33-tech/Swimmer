/**
 * RaceScene - Babylon.js 3D arena canvas mount
 *
 * Mounts the WebGL canvas, boots ArenaManager, runs the race render loop,
 * and layers the DOM HUD on top.  This component owns the entire screen
 * while a race is active; the menu is unmounted behind it.
 *
 * Layout contract (landscape mobile):
 *   - canvas fills 100vw × 100vh (no scroll)
 *   - HUD overlays are position:fixed, pointer-events-none except for
 *     interactive tap zones (stroke buttons, pause)
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArenaManager } from '../graphics/ArenaManager';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface RaceConfig {
  distance: string;   // e.g. "100M"
  stroke: string;     // e.g. "FREESTYLE"
  venue: string;      // e.g. "olympic"
}

export interface RaceResult {
  rank: number;
  time: string;
  xp: number;
  coins: number;
}

interface RaceSceneProps {
  config: RaceConfig;
  onPause: () => void;
  onRaceComplete: (result: RaceResult) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatTime(ms: number): string {
  const totalSec = ms / 1000;
  const mins = Math.floor(totalSec / 60);
  const secs = (totalSec % 60).toFixed(2).padStart(5, '0');
  return `${String(mins).padStart(2, '0')}:${secs}`;
}

function getVenueTheme(venue: string): 'OLYMPIC' | 'CHAMPIONSHIP' | 'NEON' | 'SUNSET' | 'CUSTOM' {
  const map: Record<string, 'OLYMPIC' | 'CHAMPIONSHIP' | 'NEON' | 'SUNSET' | 'CUSTOM'> = {
    olympic: 'OLYMPIC',
    training: 'CUSTOM',
    championship: 'CHAMPIONSHIP',
    neon: 'NEON',
    sunset: 'SUNSET',
  };
  return map[venue] ?? 'OLYMPIC';
}

// ─────────────────────────────────────────────────────────────────────────────
// Race HUD (lightweight DOM overlay on top of the canvas)
// ─────────────────────────────────────────────────────────────────────────────

interface HUDProps {
  elapsedMs: number;
  position: number;
  distanceM: number;
  totalDistanceM: number;
  stamina: number;
  onPause: () => void;
  onStrokeLeft: () => void;
  onStrokeRight: () => void;
}

const RaceHUDOverlay: React.FC<HUDProps> = ({
  elapsedMs,
  position,
  distanceM,
  totalDistanceM,
  stamina,
  onPause,
  onStrokeLeft,
  onStrokeRight,
}) => {
  const progressPct = Math.min((distanceM / totalDistanceM) * 100, 100);
  const staminaPct = Math.min(stamina, 100);
  const ordinal = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'][position] ?? `${position}th`;

  // Stroke flash feedback
  const [leftFlash, setLeftFlash] = useState(false);
  const [rightFlash, setRightFlash] = useState(false);

  const handleLeft = () => {
    setLeftFlash(true);
    setTimeout(() => setLeftFlash(false), 120);
    onStrokeLeft();
  };
  const handleRight = () => {
    setRightFlash(true);
    setTimeout(() => setRightFlash(false), 120);
    onStrokeRight();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none">

      {/* ── TOP BAR ──────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between gap-2 p-3 pointer-events-auto">

        {/* Timer + rank */}
        <div className="flex flex-col items-start bg-black/60 border border-white/15 backdrop-blur-sm rounded-xl px-3 py-2 min-w-[96px]">
          <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Time</span>
          <span className="font-mono text-xl font-black text-white leading-none">{formatTime(elapsedMs)}</span>
          <span className="text-[10px] font-black text-[#D4A843] uppercase mt-0.5">{ordinal}</span>
        </div>

        {/* Lane progress bar */}
        <div className="flex-1 flex flex-col justify-center pt-3 px-2">
          <div className="relative h-3 w-full rounded-full bg-white/10 overflow-hidden border border-white/10">
            {/* Player marker */}
            <div
              className="absolute top-0 left-0 h-full bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)] transition-all duration-200"
              style={{ width: `${progressPct}%` }}
            />
            {/* Rival markers (static for demo) */}
            <div className="absolute top-0 h-full w-1 bg-red-400 opacity-60" style={{ left: '48%' }} />
            <div className="absolute top-0 h-full w-1 bg-white/40 opacity-40" style={{ left: '38%' }} />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-[8px] text-white/40 font-bold">0m</span>
            <span className="text-[8px] text-white/40 font-bold">{totalDistanceM}m</span>
          </div>
        </div>

        {/* Pause button */}
        <button
          onClick={onPause}
          className="mt-1 w-10 h-10 rounded-xl bg-black/60 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-transform"
          aria-label="Pause"
        >
          <span className="font-black text-base leading-none">⏸</span>
        </button>
      </div>

      {/* ── BOTTOM STROKE CONTROLS ────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-3 pointer-events-auto">

        {/* Left stroke */}
        <button
          onPointerDown={handleLeft}
          className={`h-24 w-36 rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 select-none
            ${leftFlash
              ? 'bg-[#00E5FF]/30 border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.6)]'
              : 'bg-black/50 border-white/15 backdrop-blur-sm'
            }`}
          aria-label="Left stroke"
        >
          <span className="text-2xl mb-1">🫴</span>
          <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Left</span>
        </button>

        {/* Centre: stamina arc + distance readout */}
        <div className="flex flex-col items-center gap-1 pb-1">
          {/* Stamina ring */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke={staminaPct > 40 ? '#00E5FF' : staminaPct > 20 ? '#D4A843' : '#ef4444'}
                strokeWidth="7"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={2 * Math.PI * 34 * (1 - staminaPct / 100)}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 4px currentColor)', transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-mono text-sm font-black text-white leading-none">{Math.round(staminaPct)}%</span>
              <span className="text-[7px] text-white/40 uppercase font-bold">Stamina</span>
            </div>
          </div>

          {/* Distance readout */}
          <div className="text-center">
            <span className="font-mono text-base font-black text-white">{Math.round(distanceM)}</span>
            <span className="text-[9px] text-white/40 font-bold">/{totalDistanceM}m</span>
          </div>
        </div>

        {/* Right stroke */}
        <button
          onPointerDown={handleRight}
          className={`h-24 w-36 rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 select-none
            ${rightFlash
              ? 'bg-[#D4A843]/30 border-[#D4A843] shadow-[0_0_20px_rgba(212,168,67,0.6)]'
              : 'bg-black/50 border-white/15 backdrop-blur-sm'
            }`}
          aria-label="Right stroke"
        >
          <span className="text-2xl mb-1">🤲</span>
          <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Right</span>
        </button>
      </div>

      {/* ── TICKER BAR ───────────────────────────────────────────────── */}
      <div className="absolute bottom-28 left-0 right-0 h-5 bg-black/50 border-t border-white/5 overflow-hidden flex items-center pointer-events-none">
        <div className="flex whitespace-nowrap gap-16 px-4 animate-[scroll_18s_linear_infinite]">
          <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">● LANE 4: MCKENZIE (USA) 0.2s LEAD</span>
          <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">● CHAMPIONSHIP SERIES — SEMI FINAL 1</span>
          <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">● LANE 2: NEW PERSONAL BEST PACE</span>
          <span className="text-[8px] font-bold text-[#D4A843] uppercase tracking-wider">● SWIM26 SEASON 4 — LIVE</span>
        </div>
      </div>

    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// RaceScene
// ─────────────────────────────────────────────────────────────────────────────

export const RaceScene: React.FC<RaceSceneProps> = ({ config, onPause, onRaceComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arenaRef = useRef<ArenaManager | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Race simulation state
  const [elapsedMs, setElapsedMs] = useState(0);
  const [distanceM, setDistanceM] = useState(0);
  const [stamina, setStamina] = useState(100);
  const [position, setPosition] = useState(4); // starts mid-pack
  const [raceStarted, setRaceStarted] = useState(false);

  const totalDistanceM = parseInt(config.distance.replace('M', ''), 10) || 100;

  // ── Babylon.js boot ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return;

    let disposed = false;
    const arena = new ArenaManager(canvasRef.current);
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
  }, []); // mount once

  // ── Countdown then race simulation loop ─────────────────────────────────
  useEffect(() => {
    const countdown = setTimeout(() => {
      startTimeRef.current = performance.now();
      setRaceStarted(true);
    }, 3000); // 3-second countdown before race starts

    return () => clearTimeout(countdown);
  }, []);

  useEffect(() => {
    if (!raceStarted) return;

    const SPEED_BASE = totalDistanceM / 55000; // ~55s to cover 100m at base speed
    const STAMINA_DRAIN = 0.018; // % per ms
    const AI_CATCH_SPEED = 0.00002; // rival catch factor

    const tick = () => {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;

      setElapsedMs(elapsed);

      setStamina((prev) => {
        const drained = Math.max(0, prev - STAMINA_DRAIN);
        return drained;
      });

      setDistanceM((prev) => {
        const speed = SPEED_BASE * (0.7 + 0.3 * (stamina / 100));
        const next = prev + speed * 16; // ~16ms per frame
        if (next >= totalDistanceM) {
          // Race complete
          const finalTime = formatTime(elapsed);
          const rank = position;
          cancelAnimationFrame(rafRef.current!);
          rafRef.current = null;

          // Slight delay so user sees the finish before results
          setTimeout(() => {
            onRaceComplete({
              rank,
              time: finalTime,
              xp: rank === 1 ? 400 : rank <= 3 ? 250 : 100,
              coins: rank === 1 ? 3000 : rank <= 3 ? 1500 : 500,
            });
          }, 800);
          return totalDistanceM;
        }
        return next;
      });

      // Slowly improve position as race goes on (simple AI sim)
      setPosition((prev) => {
        if (prev > 1 && Math.random() < AI_CATCH_SPEED * elapsed) {
          return Math.max(1, prev - 1);
        }
        return prev;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [raceStarted]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Stroke handlers (gamefeel — boost stamina burst) ───────────────────
  const handleStrokeLeft = useCallback(() => {
    setStamina((prev) => Math.min(100, prev + 0.5));
  }, []);

  const handleStrokeRight = useCallback(() => {
    setStamina((prev) => Math.min(100, prev + 0.5));
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
      {/* Babylon.js canvas — fills the entire viewport */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none"
        style={{ touchAction: 'none' }}
      />

      {/* 3-second countdown overlay */}
      {!raceStarted && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-8xl font-black text-white animate-pulse drop-shadow-[0_0_40px_rgba(0,229,255,0.8)]">
              3
            </div>
            <div className="text-[#D4A843] font-black uppercase tracking-widest text-lg mt-2">GET READY</div>
          </div>
        </div>
      )}

      {/* DOM HUD layered over canvas */}
      {raceStarted && (
        <RaceHUDOverlay
          elapsedMs={elapsedMs}
          position={position}
          distanceM={distanceM}
          totalDistanceM={totalDistanceM}
          stamina={stamina}
          onPause={onPause}
          onStrokeLeft={handleStrokeLeft}
          onStrokeRight={handleStrokeRight}
        />
      )}

      {/* Ticker keyframe */}
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
