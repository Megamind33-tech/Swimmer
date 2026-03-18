/**
 * GameShell — Top-level game-flow coordinator
 *
 * Manages which "shell" is visible at any moment:
 *
 *   AppShell (menu phase)
 *     All non-race screens: home, career, club, scouts, market,
 *     champs, and all utility pages.  Babylon.js is NOT active here.
 *
 *   Game-flow phases (race pipeline)
 *     mode-select  → PlayScreen (full-screen, no BottomNav)
 *     pre-race     → PreRaceSetupScreen (full-screen)
 *     racing       → RaceScene (Babylon canvas + DOM HUD)
 *     paused       → RaceScene still mounted + PauseMenu overlay
 *     results      → RaceResultScreen (full-screen, no canvas)
 *
 * The Babylon.js canvas is only created during 'racing' and 'paused' phases.
 * Destroying and recreating the WebGL context for each race is acceptable
 * at this stage; see FUTURE_WORK.md for persistent-canvas optimisation.
 *
 * Folder role:
 *   src/app/AppShell.tsx  — menu UI logic
 *   src/components/GameShell.tsx  — race flow state machine (this file)
 *   src/components/RaceScene.tsx  — Babylon canvas + HUD
 */

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { AppShell } from '../app/AppShell';
import { PlayScreen } from './menu/PlayScreen';
import { PreRaceSetupScreen } from './menu/PreRaceSetupScreen';
import { PreMatchScreen } from '../hud/overlays/PreMatchScreen';
import { RaceScene, RaceConfig, RaceResult } from './RaceScene';
import lockerRoomBackground from '../designs/locker_room_custom/screen.png';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type GamePhase =
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
  /** Whether to show the locker-room background */
  showBackground?: boolean;
}

const OverlayShell: React.FC<OverlayShellProps> = ({
  children,
  backgroundOpacity = 0.2,
  showBackground = true,
}) => (
  <div className="w-full h-full relative overflow-hidden bg-[#050B14]">
    {showBackground && (
      <img
        src={lockerRoomBackground}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: backgroundOpacity }}
      />
    )}
    <div className="absolute inset-0 bg-[#050B14]/80 pointer-events-none" />
    <div className="relative z-10 h-full overflow-y-auto">
      {children}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// GameShell
// ─────────────────────────────────────────────────────────────────────────────

export function GameShell() {
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [selectedMode, setSelectedMode] = useState<string>('quick-race');
  const [raceConfig, setRaceConfig] = useState<RaceConfig>({
    distance: '100M',
    stroke: 'FREESTYLE',
    venue: 'olympic',
  });
  const [raceResult, setRaceResult] = useState<RaceResult | null>(null);

  // ── Transitions ─────────────────────────────────────────────────────────

  const enterModeSelect = () => setPhase('mode-select');

  const onModeSelected = (modeId: string) => {
    setSelectedMode(modeId);
    setPhase('pre-race');
  };

  const onConfirmRace = () => setPhase('pre-match');

  const onConfigChange = (partial: Partial<RaceConfig>) =>
    setRaceConfig((prev) => ({ ...prev, ...partial }));

  const onCancelPreRace = () => setPhase('mode-select');

  const onPause       = () => { /* RaceScene handles pause internally */ };
  const onExitToLobby = () => { setRaceResult(null); setPhase('menu'); };
  const onRestart     = () => { setRaceResult(null); setPhase('pre-race'); };

  const onRaceComplete = (result: RaceResult) => {
    setRaceResult(result);
    // Phase 5: ResultsOverlay is shown inside RaceScene.
    // GameShell remains in 'racing' phase so the canvas stays mounted.
    // The overlay's "Continue" / "Lobby" buttons call onExitToLobby / onRestart.
  };

  // ── Mode-select ──────────────────────────────────────────────────────────

  if (phase === 'mode-select') {
    return (
      <OverlayShell backgroundOpacity={0.3}>
        {/* Back to menu */}
        <button
          onClick={() => setPhase('menu')}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white/70 text-xs font-bold uppercase tracking-wider backdrop-blur-sm hover:bg-black/70 active:scale-95 transition-all"
        >
          <ChevronLeft size={14} />
          Lobby
        </button>
        <PlayScreen onModeSelect={onModeSelected} />
      </OverlayShell>
    );
  }

  // ── Pre-race setup ───────────────────────────────────────────────────────

  if (phase === 'pre-race') {
    const modeName = selectedMode
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
      <OverlayShell backgroundOpacity={0.2}>
        <PreRaceSetupScreen
          mode={modeName}
          onConfirmRace={onConfirmRace}
          onCancel={onCancelPreRace}
          onConfigChange={onConfigChange}
        />
      </OverlayShell>
    );
  }

  // ── Pre-match lineup reveal (13-second countdown) ────────────────────────

  if (phase === 'pre-match') {
    const eventName = `${raceConfig.distance} ${raceConfig.stroke}`;
    return (
      <PreMatchScreen
        eventName={eventName}
        heat="HEAT 1"
        onStart={() => setPhase('racing')}
        onBack={() => setPhase('pre-race')}
      />
    );
  }

  // ── Racing (pause + results handled by RaceScene internally) ─────────────

  if (phase === 'racing') {
    return (
      <RaceScene
        config={raceConfig}
        onPause={onPause}
        onRaceComplete={onRaceComplete}
        onRestart={onRestart}
        onExitToLobby={onExitToLobby}
      />
    );
  }

  // ── Default: menu (AppShell) ─────────────────────────────────────────────

  return <AppShell onPlay={enterModeSelect} />;
}
