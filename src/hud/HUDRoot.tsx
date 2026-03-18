/**
 * HUDRoot — Phase 4 race HUD root component
 *
 * Assembles all HUD widgets into the five ergonomic zones:
 *
 *   TOP-LEFT    swimmer state: StaminaBar · OxygenBar · RhythmMeter
 *   TOP-CENTER  telemetry:     RaceTimerPanel (timer + position + lap + heat)
 *   TOP-RIGHT   navigation:    LaneRadar · PauseButton
 *   MID-RIGHT   camera:        CameraToggleButton
 *   CENTER      transient:     ContextPromptBanner (only ephemeral zone)
 *   BOTTOM      controls:      VirtualJoystick | StaminaRing | ActionCluster
 *                              (order flips with handedness)
 *
 * Phase 4 additions:
 *   - Accepts ControlsPreset: joystickSize, buttonSize, handedness, hudScale
 *   - hudScale applied via CSS transform on bottom zone
 *   - handedness='left': joystick BL, buttons BR (default)
 *     handedness='right': buttons BL, joystick BR (right-hand layout)
 *   - Camera toggle button mid-right (always reachable)
 *   - All interactive zones use useGestureLock via useTouchControls
 */

import React, { useMemo } from 'react';
import { motion }                from 'motion/react';
import { Camera }                from 'lucide-react';
import { RaceTimerPanel }        from './widgets/RaceTimerPanel';
import { StaminaBar }            from './widgets/StaminaBar';
import { OxygenBar }             from './widgets/OxygenBar';
import { RhythmMeter }           from './widgets/RhythmMeter';
import { LaneRadar }             from './widgets/LaneRadar';
import { PauseButton }           from './widgets/PauseButton';
import { ContextPromptBanner, useContextPrompts } from './widgets/ContextPromptBanner';
import { VirtualJoystick, StaminaRing, ActionCluster } from './widgets/StrokeControls';
import { HUD_PANEL, HUD_COLOR, HUD_FONT } from './hudTokens';
import { staminaPulseAnimate }   from '../feedback/motionVariants';
import type { ControlsPreset }   from '../input/inputTypes';
import type { UseTouchControlsResult } from '../input/useTouchControls';

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
  heat:           string;

  /* Swimmer state */
  stamina:  number;             // 0-100
  oxygen:   number;             // 0-100
  rhythm:   number;             // 0-100

  /* Lane info */
  playerLane: number;           // 1-8

  /* Controls — Phase 4 */
  controls:  UseTouchControlsResult;
  preset:    ControlsPreset;

  /* Callbacks */
  onPause:  () => void;

  /* Toggle */
  visible?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Simulated AI lane positions
// ─────────────────────────────────────────────────────────────────────────────

function buildLaneData(
  elapsedMs:      number,
  distanceM:      number,
  totalDistanceM: number,
  playerLane:     number,
) {
  const playerProgress = Math.min(1, distanceM / Math.max(1, totalDistanceM));
  const t = elapsedMs / 1000;
  const laneOffsets = [0.02, -0.03, 0.01, -0.01, 0.04, -0.02, 0.03, -0.04];

  return Array.from({ length: 8 }, (_, i) => {
    const lane    = i + 1;
    const isPlayer = lane === playerLane;
    const offset  = laneOffsets[i] ?? 0;
    const wave    = Math.sin(t * 0.4 + i * 0.7) * 0.015;
    return {
      lane,
      progress: isPlayer
        ? playerProgress
        : Math.min(0.98, Math.max(0.02, playerProgress + offset + wave)),
      isPlayer,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Race progress bar
// ─────────────────────────────────────────────────────────────────────────────

const RaceProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
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
// Camera toggle button (mid-right)
// ─────────────────────────────────────────────────────────────────────────────

interface CameraToggleButtonProps {
  label:    string;
  onToggle: () => void;
}

const CameraToggleButton: React.FC<CameraToggleButtonProps> = ({ label, onToggle }) => (
  <motion.button
    onPointerDown={onToggle}
    whileTap={{ scale: 0.88 }}
    style={{
      width:          '42px',
      height:         '42px',
      borderRadius:   '12px',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '2px',
      cursor:         'pointer',
      background:     HUD_PANEL.background as string,
      border:         HUD_PANEL.border     as string,
      backdropFilter: 'blur(10px)',
      pointerEvents:  'auto',
      userSelect:     'none',
      WebkitUserSelect: 'none',
    }}
  >
    <Camera size={14} color={HUD_COLOR.aqua} />
    <span
      style={{
        fontFamily:    HUD_FONT.label,
        fontWeight:    700,
        fontSize:      '7px',
        letterSpacing: '0.10em',
        color:         HUD_COLOR.aqua,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  </motion.button>
);

// ─────────────────────────────────────────────────────────────────────────────
// Countdown overlay
// ─────────────────────────────────────────────────────────────────────────────

export interface CountdownOverlayProps {
  value: number;  // 3, 2, 1, or 0 (= GO!)
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ value }) => {
  const isGo   = value === 0;
  const label  = isGo ? 'GO!' : String(value);
  const color  = isGo ? HUD_COLOR.success : HUD_COLOR.textPrimary;
  const shadow = isGo
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
  controls,
  preset,
  onPause,
  visible = true,
}) => {
  const progress       = Math.min(1, distanceM / Math.max(1, totalDistanceM));
  const urgent         = progress >= 0.82;           // final ~18% triggers urgency pulse
  const criticalStamina = stamina < 25;              // drives state-cluster opacity throb
  const laneData       = useMemo(
    () => buildLaneData(elapsedMs, distanceM, totalDistanceM, playerLane),
    [elapsedMs, distanceM, totalDistanceM, playerLane],
  );
  const activePrompt   = useContextPrompts(elapsedMs, position, distanceM, totalDistanceM, stamina);

  if (!visible) return null;

  // Handedness: 'right' = joystick BL, buttons BR (default ergonomics)
  //             'left'  = buttons BL, joystick BR (left-hand joystick)
  const joystickLeft = preset.handedness === 'right';

  const joystickEl = (
    <VirtualJoystick
      joystick={controls.joystick}
      gestureLock={controls.gestureLock}
      size={preset.joystickSize}
    />
  );

  const actionEl = (
    <ActionCluster
      buttons={controls.buttons}
      gestureLock={controls.gestureLock}
      buttonSize={preset.buttonSize}
    />
  );

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
        {/* TOP-LEFT: Swimmer state cluster */}
        <motion.div
          animate={criticalStamina ? staminaPulseAnimate : {}}
          style={{
            ...HUD_PANEL,
            display:        'flex',
            flexDirection:  'column',
            justifyContent: 'center',
            gap:            '5px',
            padding:        '6px 10px',
            minWidth:       '128px',
            flexShrink:     0,
            height:         '48px',
            borderColor:    criticalStamina ? 'rgba(255,93,115,0.30)' : undefined,
          }}
        >
          <StaminaBar value={stamina} />
          <OxygenBar  value={oxygen}  />
          <RhythmMeter value={rhythm} />
        </motion.div>

        {/* TOP-CENTER: Race telemetry */}
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
            urgent={urgent}
          />
        </div>

        {/* TOP-RIGHT: Lane radar + pause */}
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
          RACE PROGRESS BAR
          ════════════════════════════════════════════════════════════ */}
      <RaceProgressBar progress={progress} />

      {/* ════════════════════════════════════════════════════════════
          MID-RIGHT: Camera toggle
          ════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position:      'absolute',
          right:         '10px',
          top:           '50%',
          transform:     'translateY(-50%)',
          pointerEvents: 'auto',
        }}
      >
        <CameraToggleButton
          label={controls.camera.label}
          onToggle={controls.camera.toggle}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          CENTER ZONE — transient prompts only
          ════════════════════════════════════════════════════════════ */}
      <ContextPromptBanner prompt={activePrompt} />

      {/* ════════════════════════════════════════════════════════════
          BOTTOM ZONE — controls (respects handedness + hudScale)
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
          // hudScale applied here — scales controls without touching top HUD
          transform:      `scale(${preset.hudScale})`,
          transformOrigin:'bottom center',
        }}
      >
        {joystickLeft ? joystickEl : actionEl}

        <StaminaRing
          stamina={stamina}
          distanceM={distanceM}
          totalDistanceM={totalDistanceM}
        />

        {joystickLeft ? actionEl : joystickEl}
      </div>

      {/* Injected keyframes */}
      <style>{`
        @keyframes hud-countdown-pop {
          0%   { transform: scale(1.4); opacity: 0.6; }
          60%  { transform: scale(0.95); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes hud-critical-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
};
