/**
 * HUDRoot — Phase 3 race HUD root component
 *
 * Assembles all HUD widgets into the five ergonomic zones:
 *
 *   TOP-LEFT    swimmer state: StaminaBar · OxygenBar · RhythmMeter
 *   TOP-CENTER  telemetry:     RaceTimerPanel (timer + position + lap + heat)
 *   TOP-RIGHT   navigation:    LaneRadar · PauseButton
 *   CENTER      transient:     ContextPromptBanner (only zone with ephemeral content)
 *   BOTTOM-LEFT joystick:      JoystickZone (directional movement)
 *   BOTTOM-CTR  stamina ring:  StaminaRing + distance readout
 *   BOTTOM-RIGHT action:       ActionCluster (sprint + L/R stroke)
 *
 * Architecture rules:
 *   - HUDRoot is position:fixed, fills full screen, z-index: hudBase (50)
 *   - Default pointer-events: none — only interactive zones override to auto
 *   - Center screen is NEVER blocked by persistent elements
 *   - All widgets are pure presentational — HUDRoot owns all state
 *   - Modular: any widget can be toggled via `visible` flags without refactor
 *
 * Styling rules:
 *   - Translucent dark panels (rgba(4,20,33,0.74)) — no flat opaque blocks
 *   - Aqua glow on interactive/active elements
 *   - Bebas Neue for large numbers, Rajdhani for labels
 *   - Tabular-nums everywhere numerical
 *
 * Performance:
 *   - No expensive calculations inside render — caller pre-computes values
 *   - AnimatePresence only around ContextPromptBanner (rare mounts/unmounts)
 *   - CSS transitions on bar fills (not JS animations)
 */

import React, { useMemo } from 'react';
import { RaceTimerPanel }      from './widgets/RaceTimerPanel';
import { StaminaBar }          from './widgets/StaminaBar';
import { OxygenBar }           from './widgets/OxygenBar';
import { RhythmMeter }         from './widgets/RhythmMeter';
import { LaneRadar }           from './widgets/LaneRadar';
import { PauseButton }         from './widgets/PauseButton';
import { ContextPromptBanner, useContextPrompts } from './widgets/ContextPromptBanner';
import { JoystickZone, StaminaRing, ActionCluster } from './widgets/StrokeControls';
import { HUD_PANEL, HUD_COLOR, HUD_FONT } from './hudTokens';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface HUDRootProps {
  /* Telemetry */
  elapsedMs:      number;
  position:       number;       // 1-8
  distanceM:      number;
  totalDistanceM: number;
  lapNumber:      number;
  totalLaps:      number;
  heat:           string;       // "QUICK RACE" | "SEMI FINAL 1" | etc.

  /* Swimmer state */
  stamina:  number;             // 0-100
  oxygen:   number;             // 0-100
  rhythm:   number;             // 0-100

  /* Lane info */
  playerLane: number;           // 1-8

  /* Callbacks */
  onPause:       () => void;
  onStrokeLeft:  () => void;
  onStrokeRight: () => void;
  onSprint?:     () => void;

  /* Toggle flags */
  visible?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Simulated AI lane positions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates pseudo-random but stable AI lane progress values
 * based on elapsed time and player progress, so AI swimmers
 * feel realistic without a separate AI engine running.
 */
function buildLaneData(
  elapsedMs:      number,
  distanceM:      number,
  totalDistanceM: number,
  playerLane:     number,
) {
  const playerProgress = Math.min(1, distanceM / Math.max(1, totalDistanceM));
  const t = elapsedMs / 1000; // seconds

  // Deterministic per-lane offsets (seeded by lane number)
  const laneOffsets = [0.02, -0.03, 0.01, -0.01, 0.04, -0.02, 0.03, -0.04];

  return Array.from({ length: 8 }, (_, i) => {
    const lane = i + 1;
    const isPlayer = lane === playerLane;
    const offset  = laneOffsets[i] ?? 0;
    const wave    = Math.sin(t * 0.4 + i * 0.7) * 0.015;

    return {
      lane,
      progress: isPlayer ? playerProgress : Math.min(0.98, Math.max(0.02, playerProgress + offset + wave)),
      isPlayer,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Race progress bar (thin strip below top zone)
// ─────────────────────────────────────────────────────────────────────────────

interface RaceProgressBarProps {
  progress: number;  // 0-1
}

const RaceProgressBar: React.FC<RaceProgressBarProps> = ({ progress }) => (
  <div
    style={{
      position:      'absolute',
      top:           '60px',
      left:          0,
      right:         0,
      height:        '3px',
      background:    'rgba(255,255,255,0.06)',
      pointerEvents: 'none',
    }}
  >
    <div
      style={{
        height:       '100%',
        width:        `${Math.min(100, progress * 100)}%`,
        background:   `linear-gradient(90deg, ${HUD_COLOR.aqua} 0%, ${HUD_COLOR.cyanGlow} 100%)`,
        boxShadow:    `0 0 8px ${HUD_COLOR.aquaGlow}`,
        borderRadius: '0 2px 2px 0',
        transition:   'width 0.25s linear',
      }}
    />
    {/* Player marker dot */}
    <div
      style={{
        position:     'absolute',
        top:          '50%',
        left:         `${Math.min(98, progress * 100)}%`,
        transform:    'translate(-50%, -50%)',
        width:        '8px',
        height:       '8px',
        borderRadius: '50%',
        background:   HUD_COLOR.aqua,
        boxShadow:    `0 0 10px ${HUD_COLOR.aquaGlow}`,
        transition:   'left 0.25s linear',
      }}
    />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Countdown overlay (shown before race starts)
// ─────────────────────────────────────────────────────────────────────────────

export interface CountdownOverlayProps {
  value: number;  // 3, 2, 1, or 0 (= GO!)
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ value }) => {
  const isGo    = value === 0;
  const label   = isGo ? 'GO!' : String(value);
  const color   = isGo ? HUD_COLOR.success : HUD_COLOR.textPrimary;
  const shadow  = isGo
    ? `0 0 30px ${HUD_COLOR.successGlow}, 0 0 60px ${HUD_COLOR.successGlow}`
    : `0 0 30px rgba(243,251,255,0.5)`;

  return (
    <div
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         110,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'rgba(4,20,33,0.55)',
        backdropFilter: 'blur(2px)',
        pointerEvents:  'none',
      }}
    >
      <div
        key={label}
        style={{
          fontFamily:    HUD_FONT.impact,
          fontSize:      isGo ? '96px' : '120px',
          lineHeight:    1,
          color,
          textShadow:    shadow,
          letterSpacing: '0.02em',
          animation:     'hud-countdown-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily:    HUD_FONT.label,
          fontWeight:    700,
          fontSize:      '14px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color:         HUD_COLOR.textSecondary,
          marginTop:     '12px',
          opacity:       isGo ? 0 : 1,
        }}
      >
        GET READY
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HUDRoot
// ─────────────────────────────────────────────────────────────────────────────

export const HUDRoot: React.FC<HUDRootProps> = ({
  elapsedMs,
  position,
  distanceM,
  totalDistanceM,
  lapNumber,
  totalLaps,
  heat,
  stamina,
  oxygen,
  rhythm,
  playerLane,
  onPause,
  onStrokeLeft,
  onStrokeRight,
  onSprint,
  visible = true,
}) => {
  const progress  = Math.min(1, distanceM / Math.max(1, totalDistanceM));
  const laneData  = useMemo(
    () => buildLaneData(elapsedMs, distanceM, totalDistanceM, playerLane),
    [elapsedMs, distanceM, totalDistanceM, playerLane],
  );
  const activePrompt = useContextPrompts(elapsedMs, position, distanceM, totalDistanceM, stamina);

  if (!visible) return null;

  return (
    <div
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        50,
        pointerEvents: 'none',
        userSelect:    'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* ════════════════════════════════════════════════════════════
          TOP ZONE — telemetry row
          ════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          right:      0,
          height:     '60px',
          display:    'flex',
          alignItems: 'center',
          padding:    '6px 8px',
          gap:        '8px',
          pointerEvents: 'auto',
        }}
      >
        {/* ── TOP-LEFT: Swimmer state cluster ── */}
        <div
          style={{
            ...HUD_PANEL,
            display:       'flex',
            flexDirection: 'column',
            justifyContent:'center',
            gap:           '5px',
            padding:       '6px 10px',
            minWidth:      '128px',
            flexShrink:    0,
            height:        '48px',
          }}
        >
          <StaminaBar value={stamina} />
          <OxygenBar  value={oxygen}  />
          <RhythmMeter value={rhythm} />
        </div>

        {/* ── TOP-CENTER: Race telemetry ── */}
        <div
          style={{
            flex:           1,
            display:        'flex',
            justifyContent: 'center',
          }}
        >
          <RaceTimerPanel
            elapsedMs={elapsedMs}
            position={position}
            lapNumber={lapNumber}
            totalLaps={totalLaps}
            heat={heat}
          />
        </div>

        {/* ── TOP-RIGHT: Lane radar + pause ── */}
        <div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '6px',
            flexShrink: 0,
          }}
        >
          <LaneRadar lanes={laneData} playerLane={playerLane} />
          <PauseButton onPause={onPause} />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          RACE PROGRESS BAR — thin strip at top: 60px
          ════════════════════════════════════════════════════════════ */}
      <RaceProgressBar progress={progress} />

      {/* ════════════════════════════════════════════════════════════
          CENTER ZONE — transient prompts only, nothing persistent
          ════════════════════════════════════════════════════════════ */}
      <ContextPromptBanner prompt={activePrompt} />

      {/* ════════════════════════════════════════════════════════════
          BOTTOM ZONE — controls
          ════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position:       'absolute',
          bottom:         0,
          left:           0,
          right:          0,
          height:         '106px',
          display:        'flex',
          alignItems:     'flex-end',
          justifyContent: 'space-between',
          padding:        '0 8px 8px',
          pointerEvents:  'auto',
        }}
      >
        {/* Bottom-left: joystick zone */}
        <JoystickZone />

        {/* Bottom-center: stamina ring + distance */}
        <StaminaRing
          stamina={stamina}
          distanceM={distanceM}
          totalDistanceM={totalDistanceM}
        />

        {/* Bottom-right: sprint + stroke buttons */}
        <ActionCluster
          onStrokeLeft={onStrokeLeft}
          onStrokeRight={onStrokeRight}
          onSprint={onSprint}
        />
      </div>

      {/* Injected keyframes (scoped to HUD, avoids polluting global CSS) */}
      <style>{`
        @keyframes hud-countdown-pop {
          0%   { transform: scale(1.4); opacity: 0.6; }
          60%  { transform: scale(0.95); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes hud-critical-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
};
