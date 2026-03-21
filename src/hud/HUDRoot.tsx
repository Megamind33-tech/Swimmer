/**
 * HUDRoot — Phase 7 swimming-specific race HUD root component
 *
 * Five ergonomic zones with full swimming competition identity:
 *
 *   TOP-LEFT    swimmer state:  StaminaBar · OxygenBar · RhythmMeter
 *   TOP-CENTER  telemetry:     RaceTimerPanel (broadcast-style: event · lane · timer · pos · gap · lap)
 *   TOP-RIGHT   navigation:    LaneRadar (numbered, with initials) · PauseButton
 *   MID-RIGHT   camera:        CameraToggleButton
 *   CENTER      transient:     ContextPromptBanner (turn/start/advance/PB prompts)
 *                              TurnIndicator (wall proximity — appears when within 15m)
 *   BOTTOM-CENTER transient:   SplitFlash (fires on 25/50/75% checkpoints)
 *   BOTTOM      controls:      VirtualJoystick | StaminaRing | ActionCluster
 *
 * Phase 7 additions:
 *   - stroke prop → computes eventName ("100M FREESTYLE")
 *   - gapToAheadM computed from lane data → passed to RaceTimerPanel
 *   - TurnIndicator mounted in center zone (below ContextPromptBanner)
 *   - SplitFlash mounted above controls zone
 *   - rhythm passed to useContextPrompts (enables CLEAN_TURN vs EARLY_TURN)
 *   - LaneRadar updated: lane numbers + swimmer initials
 */

import React, { useMemo } from 'react';
import { motion }                from 'motion/react';
import { Camera }                from 'lucide-react';
import { RaceTimerPanelMemo as RaceTimerPanel } from './widgets/RaceTimerPanel';
import { StaminaBarMemo    as StaminaBar }      from './widgets/StaminaBar';
import { OxygenBarMemo     as OxygenBar }       from './widgets/OxygenBar';
import { RhythmMeterMemo   as RhythmMeter }     from './widgets/RhythmMeter';
import { LaneRadarMemo     as LaneRadar }       from './widgets/LaneRadar';
import { PauseButtonMemo   as PauseButton }     from './widgets/PauseButton';
import { ContextPromptBanner, useContextPrompts } from './widgets/ContextPromptBanner';
import { TurnIndicatorMemo as TurnIndicator }   from './widgets/TurnIndicator';
import { SplitFlash }                           from './widgets/SplitFlash';
import type { SplitFlashData }                  from './widgets/SplitFlash';
import { VirtualJoystick, StaminaRing, ActionCluster } from './widgets/StrokeControls';
import { HUD_PANEL, HUD_COLOR, HUD_FONT }       from './hudTokens';
import { staminaPulseAnimate }                  from '../feedback/motionVariants';
import type { ControlsPreset }                  from '../input/inputTypes';
import type { UseTouchControlsResult }          from '../input/useTouchControls';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface HUDRootProps {
  /* Telemetry */
  elapsedMs:      number;
  position:       number;       // 1–8
  distanceM:      number;
  totalDistanceM: number;
  lapNumber:      number;
  totalLaps:      number;
  heat:           string;       // e.g. "HEAT 2"

  /* Swimming identity (Phase 7) */
  stroke:         string;       // "FREESTYLE", "BACKSTROKE", "BUTTERFLY", etc.

  /* Swimmer state */
  stamina:  number;             // 0–100
  oxygen:   number;             // 0–100
  rhythm:   number;             // 0–100

  /* Lane info */
  playerLane: number;           // 1–8

  /* Split flash (Phase 7) */
  activeSplit?: SplitFlashData | null;

  /* Controls — Phase 4 */
  controls:  UseTouchControlsResult;
  preset:    ControlsPreset;

  /* Callbacks */
  onPause:  () => void;

  /* Toggle */
  visible?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Stroke abbreviation map
// ─────────────────────────────────────────────────────────────────────────────

const STROKE_ABBR: Record<string, string> = {
  FREESTYLE:    'FREESTYLE',
  BACKSTROKE:   'BACK',
  BREASTSTROKE: 'BREAST',
  BUTTERFLY:    'FLY',
  MEDLEY:       'IM',
};

function getEventName(stroke: string, totalDistanceM: number): string {
  const abbr = STROKE_ABBR[stroke.toUpperCase()] ?? stroke.toUpperCase().slice(0, 4);
  return `${totalDistanceM}M ${abbr}`;
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
    const lane     = i + 1;
    const isPlayer = lane === playerLane;
    const offset   = laneOffsets[i] ?? 0;
    const wave     = Math.sin(t * 0.4 + i * 0.7) * 0.015;
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
      height:        '2px',
      background:    'rgba(255,255,255,0.06)',
      pointerEvents: 'none',
    }}
  >
    {/* Solid volt yellow fill — no gradient, no glow */}
    <div
      style={{
        height:     '100%',
        width:      `${Math.min(100, progress * 100)}%`,
        background: HUD_COLOR.volt,
        transition: 'width 0.25s linear',
      }}
    />
    {/* Hard-edged square progress marker */}
    <div
      style={{
        position:   'absolute',
        top:        '50%',
        left:       `${Math.min(98, progress * 100)}%`,
        transform:  'translate(-50%, -50%)',
        width:      '6px',
        height:     '6px',
        borderRadius: '0px',
        background: HUD_COLOR.volt,
        transition: 'left 0.25s linear',
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
      borderRadius:   '0px',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '2px',
      cursor:         'pointer',
      background:     '#0A0A0A',
      border:         '1px solid rgba(255,255,255,0.18)',
      backdropFilter: 'blur(8px)',
      pointerEvents:  'auto',
      userSelect:     'none',
      WebkitUserSelect: 'none',
    }}
  >
    <Camera size={14} color={HUD_COLOR.white} strokeWidth={2.5} />
    <span
      style={{
        fontFamily:    HUD_FONT.label,
        fontWeight:    700,
        fontSize:      '7px',
        letterSpacing: '0.10em',
        color:         HUD_COLOR.textMuted,
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
  const isGo  = value === 0;
  const label = isGo ? 'GO!' : String(value);
  const color = isGo ? HUD_COLOR.volt : HUD_COLOR.white;

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
        background:     'rgba(0,0,0,0.60)',
        backdropFilter: 'blur(2px)',
        pointerEvents:  'none',
      }}
    >
      {/* Hard-edged countdown number — viewport-scaled for small screens */}
      <div
        key={label}
        style={{
          fontFamily:    HUD_FONT.impact,
          fontSize:      isGo ? 'min(96px, 18vw)' : 'min(120px, 22vw)',
          lineHeight:    1,
          color,
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
          fontSize:      'min(14px, 2.5vw)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color:         HUD_COLOR.grey,
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

// ─────────────────────────────────────────────────────────────────────────────
// Small-screen detection hook
// ─────────────────────────────────────────────────────────────────────────────

/** Returns true when the viewport is too small for the full-size HUD. */
function useIsSmallScreen(): boolean {
  const check = () => window.innerWidth < 540 || window.innerHeight < 360;
  const [small, setSmall] = React.useState(check);

  React.useEffect(() => {
    const handler = () => setSmall(check());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return small;
}

export const HUDRoot: React.FC<HUDRootProps> = ({
  elapsedMs,
  position,
  distanceM,
  totalDistanceM,
  lapNumber,
  totalLaps,
  heat,
  stroke,
  stamina,
  oxygen,
  rhythm,
  playerLane,
  activeSplit,
  controls,
  preset,
  onPause,
  visible = true,
}) => {
  const progress        = Math.min(1, distanceM / Math.max(1, totalDistanceM));
  const urgent          = progress >= 0.82;
  const criticalStamina = stamina < 25;
  const isSmall         = useIsSmallScreen();

  const laneData = useMemo(
    () => buildLaneData(elapsedMs, distanceM, totalDistanceM, playerLane),
    [elapsedMs, distanceM, totalDistanceM, playerLane],
  );

  // Gap to swimmer directly ahead (metres)
  const gapToAheadM = useMemo(() => {
    const sorted    = [...laneData].sort((a, b) => b.progress - a.progress);
    const playerIdx = sorted.findIndex(l => l.isPlayer);
    if (playerIdx <= 0) return 0; // leading
    const ahead = sorted[playerIdx - 1].progress;
    const self  = sorted[playerIdx].progress;
    return Math.max(0, (ahead - self) * totalDistanceM);
  }, [laneData, totalDistanceM]);

  // Broadcast event name
  const eventName = useMemo(
    () => getEventName(stroke, totalDistanceM),
    [stroke, totalDistanceM],
  );

  // Context prompts — now receives `rhythm` for CLEAN_TURN vs EARLY_TURN
  const activePrompt = useContextPrompts(
    elapsedMs, position, distanceM, totalDistanceM, stamina, rhythm,
  );

  if (!visible) return null;

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
          height:     isSmall ? '44px' : '60px',
          display:    'flex',
          alignItems: 'center',
          padding:    isSmall ? '3px 4px' : '6px 8px',
          gap:        isSmall ? '4px' : '8px',
          pointerEvents: 'auto',
          transform:  isSmall ? 'scale(0.82)' : undefined,
          transformOrigin: 'top center',
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
            gap:            isSmall ? '3px' : '5px',
            padding:        isSmall ? '4px 6px' : '6px 10px',
            minWidth:       isSmall ? '90px' : '128px',
            flexShrink:     0,
            height:         isSmall ? '36px' : '48px',
            borderColor:    criticalStamina ? 'rgba(255,0,60,0.55)' : undefined,
          }}
        >
          <StaminaBar  value={stamina} />
          <OxygenBar   value={oxygen}  />
          <RhythmMeter value={rhythm}  />
        </motion.div>

        {/* TOP-CENTER: Broadcast race telemetry */}
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
            eventName={eventName}
            heat={heat}
            lane={playerLane}
            gapToAheadM={gapToAheadM}
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
      <div style={isSmall ? { position: 'absolute', top: '36px', left: 0, right: 0 } : undefined}>
        <RaceProgressBar progress={progress} />
      </div>

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
          CENTER ZONE — transient prompts + turn indicator
          Both stacked vertically; pointer-events off
          ════════════════════════════════════════════════════════════ */}
      {/* Context event prompts (existing — upper center) */}
      <ContextPromptBanner prompt={activePrompt} />

      {/* Turn wall indicator (lower center — appears when within 15m of wall) */}
      <div
        style={{
          position:      'absolute',
          top:           '42%',
          left:          '50%',
          transform:     'translateX(-50%)',
          pointerEvents: 'none',
          zIndex:        59,
        }}
      >
        <TurnIndicator distanceM={distanceM} totalDistanceM={totalDistanceM} />
      </div>

      {/* ════════════════════════════════════════════════════════════
          SPLIT FLASH — above controls zone, fires on checkpoints
          ════════════════════════════════════════════════════════════ */}
      <SplitFlash split={activeSplit ?? null} />

      {/* ════════════════════════════════════════════════════════════
          BOTTOM ZONE — controls (respects handedness + hudScale)
          ════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position:       'absolute',
          bottom:         0,
          left:           0,
          right:          0,
          height:         isSmall ? '80px' : '106px',
          display:        'flex',
          alignItems:     'flex-end',
          justifyContent: 'space-between',
          padding:        isSmall ? '0 4px 4px' : '0 8px 8px',
          pointerEvents:  'auto',
          transform:      `scale(${isSmall ? Math.min(preset.hudScale, 0.78) : preset.hudScale})`,
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
