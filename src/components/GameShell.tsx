/**
 * GameShell — Top-level game-flow coordinator
 *
 * Phase transitions:
 *   All navigateTo() calls trigger a 160ms dark-screen fade before switching
 *   the active phase.  Each phase container gets a key={phase} so React
 *   remounts it, which re-triggers the .screen-enter CSS animation on entry.
 *
 * Screens:
 *   menu          → AppShell (lobby/management UI)
 *   mode-select   → PlayScreen (choose race mode)
 *   pre-race      → PreRaceSetupScreen (configure the race)
 *   pre-match     → PreMatchScreen (13s lineup reveal)
 *   racing        → RaceScene (Babylon canvas + HUD)
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { AppShell } from '../app/AppShell';
import { PlayScreen } from './menu/PlayScreen';
import { PreRaceSetupScreen } from './menu/PreRaceSetupScreen';
import { PreMatchScreen } from '../hud/overlays/PreMatchScreen';
import { RaceScene, RaceConfig, RaceResult } from './RaceScene';
import { SplashScreen } from './menu/SplashScreen';
import appSkinBackground from '../designs/app_skin/venue-skin.jpg';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type GamePhase =
  | 'home'          // SplashScreen — title screen / home page
  | 'menu'          // AppShell — lobby/management UI
  | 'mode-select'   // PlayScreen — choose race mode
  | 'pre-race'      // PreRaceSetupScreen — configure the race
  | 'pre-match'     // PreMatchScreen — 13s lineup reveal before race
  | 'racing';       // RaceScene — handles pause/results internally (Phase 5)

// ─────────────────────────────────────────────────────────────────────────────
// Full-screen overlay wrapper (used for all non-menu game phases)
// ─────────────────────────────────────────────────────────────────────────────

interface OverlayShellProps {
  children: React.ReactNode;
  backgroundOpacity?: number;
  showBackground?: boolean;
}

const OverlayShell: React.FC<OverlayShellProps> = ({
  children,
  backgroundOpacity = 0.14,
  showBackground = true,
}) => (
  <div
    className="overflow-hidden"
    style={{ position: 'absolute', inset: 0, background: 'var(--color-bg-deep)' }}
  >
    {/* Noise texture — prevents flat-black "web app" look */}
    <div className="screen-noise" aria-hidden />

    {/* Underwater ambient light — single subtle radial per screen */}
    <div className="screen-ambient" aria-hidden />

    {showBackground && (
      <img
        src={appSkinBackground}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: backgroundOpacity, mixBlendMode: 'luminosity' }}
      />
    )}
    <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(5,11,20,0.78)' }} />

    {/* Content */}
    <div className="relative z-10 h-full overflow-y-auto screen-safe-area">
      {children}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// GameShell
// ─────────────────────────────────────────────────────────────────────────────

export function GameShell() {
  const [phase,        setPhase]        = useState<GamePhase>('home');
  const [frameScale, setFrameScale] = useState(1);

  useEffect(() => {
    const W = 896;
    const H = 414;

    const scaleFrame = () => {
      const nextScale = Math.min(window.innerWidth / W, window.innerHeight / H, 1);
      setFrameScale(nextScale);
    };

    scaleFrame();
    window.addEventListener('resize', scaleFrame);
    return () => window.removeEventListener('resize', scaleFrame);
  }, []);

  const frameOuterStyle = useMemo(() => ({
    width: `${896 * frameScale}px`,
    height: `${414 * frameScale}px`,
  }), [frameScale]);

  const frameStyle = useMemo(() => ({
    transform: `scale(${frameScale})`,
  }), [frameScale]);
  const [selectedMode, setSelectedMode] = useState<string>('quick-race');
  const [raceConfig,   setRaceConfig]   = useState<RaceConfig>({
    distance: '100M',
    stroke:   'FREESTYLE',
    venue:    'olympic',
  });
  const [raceResult, setRaceResult] = useState<RaceResult | null>(null);

  // ── Phase-transition fade ────────────────────────────────────────────────
  // A 160ms dark overlay fades in before each phase switch, then out again
  // as the new screen enters with its .screen-enter animation.

  const [fading, setFading] = useState(false);

  const navigateTo = useCallback((nextPhase: GamePhase) => {
    setFading(true);
    setTimeout(() => {
      setPhase(nextPhase);
      // Let React flush the new phase, then remove the fade cover so the
      // new screen's screen-enter animation is visible.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setFading(false)),
      );
    }, 160);
  }, []);

  // ── Transitions ─────────────────────────────────────────────────────────

  const enterModeSelect  = () => navigateTo('mode-select');
  const onCancelPreRace  = () => navigateTo('mode-select');
  const onConfirmRace    = () => navigateTo('pre-match');
  const onExitToLobby    = () => { setRaceResult(null); navigateTo('home'); };
  const onRestart        = () => { setRaceResult(null); navigateTo('pre-race'); };
  const onPause          = () => { /* RaceScene handles pause internally */ };

  const onModeSelected = (modeId: string) => {
    setSelectedMode(modeId);
    navigateTo('pre-race');
  };

  const onConfigChange = (partial: Partial<RaceConfig>) =>
    setRaceConfig((prev) => ({ ...prev, ...partial }));

  const onRaceComplete = (result: RaceResult) => {
    setRaceResult(result);
    // ResultsOverlay shown inside RaceScene — stays in 'racing' phase
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const renderPhase = () => {
    if (phase === 'home') {
      return (
        <div key="home" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <SplashScreen onPlay={() => navigateTo('menu')} />
        </div>
      );
    }

    if (phase === 'mode-select') {
      return (
        <OverlayShell key="mode-select" backgroundOpacity={0.28}>
          {/* Back to menu */}
          <button
            onClick={() => navigateTo('menu')}
            className="absolute top-4 left-4 z-50 flex items-center gap-2 rounded-xl px-3 py-2 text-white/70 text-xs font-bold uppercase tracking-wider active:scale-95 transition-all"
            style={{
              background: 'rgba(8,13,26,0.80)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              minHeight: '44px',
            }}
          >
            <ChevronLeft size={14} />
            Lobby
          </button>
          <div className="screen-enter h-full">
            <PlayScreen onModeSelect={onModeSelected} />
          </div>
        </OverlayShell>
      );
    }

    if (phase === 'pre-race') {
      const modeName = selectedMode
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return (
        <OverlayShell key="pre-race" backgroundOpacity={0.18}>
          <div className="screen-enter h-full">
            <PreRaceSetupScreen
              mode={modeName}
              onConfirmRace={onConfirmRace}
              onCancel={onCancelPreRace}
              onConfigChange={onConfigChange}
            />
          </div>
        </OverlayShell>
      );
    }

    if (phase === 'pre-match') {
      return (
        <div key="pre-match" className="screen-enter" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <PreMatchScreen
            eventName={`${raceConfig.distance} ${raceConfig.stroke}`}
            heat="HEAT 1"
            onStart={() => navigateTo('racing')}
            onBack={() => navigateTo('pre-race')}
          />
        </div>
      );
    }

    if (phase === 'racing') {
      return (
        <div key="racing" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <RaceScene
            config={raceConfig}
            onPause={onPause}
            onRaceComplete={onRaceComplete}
            onRestart={onRestart}
            onExitToLobby={onExitToLobby}
          />
        </div>
      );
    }

    // Default: menu
    return (
      <div key="menu" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <AppShell onPlay={enterModeSelect} />
      </div>
    );
  };

  return (
    <div className="swim26-frame-stage">
      <div className="swim26-frame-outer" style={frameOuterStyle}>
        <div className="gf swim26-game-frame" style={frameStyle}>
          {renderPhase()}
        </div>
      </div>

      {/* Full-screen dark fade — shows between phase transitions */}
      {fading && <div className="phase-fade-cover" aria-hidden />}
    </div>
  );
}
