/**
 * StrokeControls — functional bottom-zone controls
 *
 * Layout zones (landscape ergonomics):
 *
 *  VirtualJoystick (Bottom-Left or Bottom-Right depending on handedness)
 *    Real virtual joystick using useVirtualJoystick.
 *    Knob tracks pointer with setPointerCapture; dead zone 8%.
 *    Positioned for thumb accessibility.
 *
 *  StaminaRing (Bottom-Center)
 *    Circular SVG stamina gauge + distance readout. Read-only.
 *
 *  ActionCluster (Bottom-Left or Bottom-Right)
 *    Sprint + LEFT stroke + RIGHT stroke buttons.
 *    Wired to useActionButtons (haptic + audio + flash state).
 *
 * Touch contract:
 *   - All buttons use onPointerDown (not onClick) for minimum latency
 *   - 80px+ tap targets on stroke buttons
 *   - useGestureLock prevents conflicting simultaneous gestures
 *   - Visual: scale compression + glow pulse + flash on press
 */

import React from 'react';
import { motion } from 'motion/react';
import type { UseActionButtonsResult } from '../../input/useActionButtons';
import type { VirtualJoystickResult as UseVirtualJoystickResult } from '../../input/useVirtualJoystick';
import type { UseGestureLockResult } from '../../input/useGestureLock';
import type { InputAction } from '../../input/inputTypes';
import { HUD_COLOR, HUD_FONT, staminaColor } from '../hudTokens';

// ─────────────────────────────────────────────────────────────────────────────
// VirtualJoystick (Bottom-Left)
// ─────────────────────────────────────────────────────────────────────────────

export interface VirtualJoystickProps {
  joystick:    UseVirtualJoystickResult;
  gestureLock: UseGestureLockResult;
  size:        number;  // px diameter of the joystick container
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  joystick,
  gestureLock,
  size,
}) => {
  const { handlers, knobOffset, active } = joystick;
  const ZONE_ID = 'joystick';

  // Wrap handlers with gesture lock so no other zone steals the pointer
  const wrappedHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      if (!gestureLock.tryLock(ZONE_ID, e.pointerId)) return;
      handlers.onPointerDown(e);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!gestureLock.isLocked(ZONE_ID, e.pointerId)) return;
      handlers.onPointerMove(e);
    },
    onPointerUp: (e: React.PointerEvent) => {
      gestureLock.unlock(e.pointerId);
      handlers.onPointerUp(e);
    },
    onPointerCancel: (e: React.PointerEvent) => {
      gestureLock.unlock(e.pointerId);
      handlers.onPointerCancel(e);
    },
  };

  const containerBorder = active
    ? `1.5px solid rgba(56,214,255,0.45)`
    : `1px solid rgba(56,214,255,0.12)`;
  const containerGlow   = active ? '0 0 20px rgba(56,214,255,0.18)' : 'none';

  return (
    <div
      {...wrappedHandlers}
      style={{
        width:          `${size}px`,
        height:         `${size}px`,
        borderRadius:   '50%',
        background:     active
          ? 'rgba(4,20,33,0.62)'
          : 'rgba(4,20,33,0.44)',
        border:         containerBorder,
        boxShadow:      containerGlow,
        position:       'relative',
        flexShrink:     0,
        touchAction:    'none',
        cursor:         'grab',
        transition:     'border-color 0.12s, box-shadow 0.12s, background 0.12s',
      }}
    >
      {/* Guide ring */}
      <div
        style={{
          position:     'absolute',
          inset:        '18%',
          borderRadius: '50%',
          border:       '1px solid rgba(56,214,255,0.08)',
          pointerEvents: 'none',
        }}
      />

      {/* Crosshair H */}
      <div
        style={{
          position:   'absolute',
          top:        '50%',
          left:       '18%',
          right:      '18%',
          height:     '1px',
          marginTop:  '-0.5px',
          background: 'rgba(56,214,255,0.10)',
          pointerEvents: 'none',
        }}
      />
      {/* Crosshair V */}
      <div
        style={{
          position:   'absolute',
          left:       '50%',
          top:        '18%',
          bottom:     '18%',
          width:      '1px',
          marginLeft: '-0.5px',
          background: 'rgba(56,214,255,0.10)',
          pointerEvents: 'none',
        }}
      />

      {/* Knob */}
      <div
        style={{
          position:     'absolute',
          top:          '50%',
          left:         '50%',
          width:        `${size * 0.34}px`,
          height:       `${size * 0.34}px`,
          marginTop:    `${-(size * 0.34) / 2}px`,
          marginLeft:   `${-(size * 0.34) / 2}px`,
          borderRadius: '50%',
          background:   active
            ? `radial-gradient(circle at 35% 35%, rgba(122,232,255,0.85), rgba(56,214,255,0.55))`
            : 'rgba(56,214,255,0.20)',
          border:       active
            ? '2px solid rgba(122,232,255,0.80)'
            : '1.5px solid rgba(56,214,255,0.30)',
          boxShadow:    active
            ? '0 0 14px rgba(56,214,255,0.55), 0 2px 6px rgba(0,0,0,0.5)'
            : '0 0 8px rgba(56,214,255,0.18)',
          transform:    `translate(${knobOffset.x}px, ${knobOffset.y}px)`,
          transition:   active ? 'none' : 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
          pointerEvents: 'none',
        }}
      />

      {/* MOVE label */}
      <span
        style={{
          position:      'absolute',
          bottom:        '7px',
          left:          0,
          right:         0,
          textAlign:     'center',
          fontFamily:    HUD_FONT.label,
          fontWeight:    700,
          fontSize:      '7px',
          color:         active ? 'rgba(56,214,255,0.60)' : 'rgba(169,211,231,0.28)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          transition:    'color 0.12s',
        }}
      >
        MOVE
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stamina Ring (Bottom-Center)
// ─────────────────────────────────────────────────────────────────────────────

interface StaminaRingProps {
  stamina:        number;  // 0-100
  distanceM:      number;
  totalDistanceM: number;
}

const RING_R  = 30;
const RING_C  = 2 * Math.PI * RING_R;

export const StaminaRing: React.FC<StaminaRingProps> = ({ stamina, distanceM, totalDistanceM }) => {
  const pct    = Math.min(100, Math.max(0, stamina));
  const color  = staminaColor(pct);
  const offset = RING_C * (1 - pct / 100);

  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '4px',
        flexShrink:    0,
      }}
    >
      {/* SVG ring */}
      <div style={{ position: 'relative', width: '74px', height: '74px' }}>
        <svg
          width="74" height="74"
          viewBox="0 0 74 74"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle
            cx="37" cy="37" r={RING_R}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="6"
          />
          {/* Fill */}
          <circle
            cx="37" cy="37" r={RING_R}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={RING_C}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              filter:     `drop-shadow(0 0 5px ${color})`,
              transition: 'stroke-dashoffset 0.25s linear, stroke 0.4s ease',
            }}
          />
        </svg>

        {/* Center readout */}
        <div
          style={{
            position:       'absolute',
            inset:          0,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily:         HUD_FONT.impact,
              fontSize:           '18px',
              lineHeight:         1,
              color,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing:      '0.01em',
            }}
          >
            {Math.round(pct)}
          </span>
          <span
            style={{
              fontFamily:    HUD_FONT.label,
              fontWeight:    700,
              fontSize:      '7px',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color:         HUD_COLOR.textMuted,
            }}
          >
            STM
          </span>
        </div>
      </div>

      {/* Distance */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
        <span
          style={{
            fontFamily:         HUD_FONT.impact,
            fontSize:           '14px',
            color:              HUD_COLOR.textPrimary,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing:      '0.01em',
          }}
        >
          {Math.round(distanceM)}
        </span>
        <span
          style={{
            fontFamily:    HUD_FONT.label,
            fontWeight:    600,
            fontSize:      '9px',
            color:         HUD_COLOR.textMuted,
            letterSpacing: '0.04em',
          }}
        >
          /{totalDistanceM}m
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stroke Button
// ─────────────────────────────────────────────────────────────────────────────

interface StrokeButtonProps {
  action:     InputAction;
  label:      string;
  icon:       string;
  size:       number;
  buttons:    UseActionButtonsResult;
  gestureLock:UseGestureLockResult;
  flashColor: string;
  glowColor:  string;
}

const StrokeButton: React.FC<StrokeButtonProps> = ({
  action, label, icon, size, buttons, gestureLock, flashColor, glowColor,
}) => {
  const state   = buttons.states[action];
  const flash   = state?.flash ?? false;
  const pressed = state?.pressed ?? false;

  return (
    <motion.button
      onPointerDown={(e) => {
        if (!gestureLock.tryLock(action, e.pointerId)) return;
        buttons.press(action);
      }}
      onPointerUp={(e) => {
        gestureLock.unlock(e.pointerId);
        buttons.release(action);
      }}
      onPointerCancel={(e) => {
        gestureLock.unlock(e.pointerId);
        buttons.release(action);
      }}
      animate={{
        scale:     pressed ? 0.93 : 1,
        boxShadow: flash
          ? `0 0 28px ${glowColor}, 0 0 10px ${glowColor}, inset 0 0 8px rgba(255,255,255,0.06)`
          : 'none',
      }}
      transition={{ type: 'spring', stiffness: 700, damping: 32 }}
      style={{
        width:          `${size}px`,
        height:         `${size * 0.93}px`,
        borderRadius:   '16px',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '4px',
        cursor:         'pointer',
        border:         `2px solid ${flash ? flashColor : 'rgba(255,255,255,0.12)'}`,
        background:     flash
          ? `rgba(56,214,255,0.14)`
          : 'rgba(4,20,33,0.65)',
        backdropFilter: 'blur(8px)',
        transition:     'border-color 0.08s, background 0.08s',
        touchAction:    'none',
        userSelect:     'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      <span style={{ fontSize: '22px', lineHeight: 1 }}>{icon}</span>
      <span
        style={{
          fontFamily:    HUD_FONT.label,
          fontWeight:    700,
          fontSize:      '9px',
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color:         flash ? flashColor : HUD_COLOR.textMuted,
          transition:    'color 0.08s',
        }}
      >
        {label}
      </span>
    </motion.button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Action Cluster (Bottom-Right)
// ─────────────────────────────────────────────────────────────────────────────

export interface ActionClusterProps {
  buttons:     UseActionButtonsResult;
  gestureLock: UseGestureLockResult;
  buttonSize:  number;
}

export const ActionCluster: React.FC<ActionClusterProps> = ({
  buttons,
  gestureLock,
  buttonSize,
}) => {
  const sprintState   = buttons.states['sprint'];
  const sprintPressed = sprintState?.pressed ?? false;
  const sprintFlash   = sprintState?.flash   ?? false;

  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '4px',
        flexShrink:    0,
      }}
    >
      {/* Sprint button (above stroke buttons) */}
      <motion.button
        onPointerDown={(e) => {
          if (!gestureLock.tryLock('sprint', e.pointerId)) return;
          buttons.press('sprint');
        }}
        onPointerUp={(e) => {
          gestureLock.unlock(e.pointerId);
          buttons.release('sprint');
        }}
        onPointerCancel={(e) => {
          gestureLock.unlock(e.pointerId);
          buttons.release('sprint');
        }}
        animate={{
          scale:     sprintPressed ? 0.94 : 1,
          boxShadow: sprintFlash
            ? `0 0 22px ${HUD_COLOR.warningGlow}, 0 0 8px ${HUD_COLOR.warningGlow}`
            : 'none',
        }}
        transition={{ type: 'spring', stiffness: 700, damping: 32 }}
        style={{
          height:         '26px',
          width:          `${buttonSize * 2 + 6}px`,
          borderRadius:   '8px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '5px',
          cursor:         'pointer',
          border:         `1px solid ${sprintFlash ? HUD_COLOR.warning : 'rgba(255,194,71,0.22)'}`,
          background:     sprintFlash
            ? 'rgba(255,194,71,0.18)'
            : 'rgba(255,194,71,0.06)',
          transition:     'border-color 0.08s, background 0.08s',
          touchAction:    'none',
          userSelect:     'none',
          WebkitUserSelect: 'none',
        }}
      >
        <span style={{ fontSize: '12px' }}>⚡</span>
        <span
          style={{
            fontFamily:    HUD_FONT.label,
            fontWeight:    700,
            fontSize:      '9px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color:         sprintFlash ? HUD_COLOR.warning : 'rgba(255,194,71,0.55)',
            transition:    'color 0.08s',
          }}
        >
          SPRINT
        </span>
      </motion.button>

      {/* L / R stroke buttons */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <StrokeButton
          action="strokeLeft"
          label="LEFT"
          icon="🫴"
          size={buttonSize}
          buttons={buttons}
          gestureLock={gestureLock}
          flashColor={HUD_COLOR.aqua}
          glowColor={HUD_COLOR.aquaGlow}
        />
        <StrokeButton
          action="strokeRight"
          label="RIGHT"
          icon="🤲"
          size={buttonSize}
          buttons={buttons}
          gestureLock={gestureLock}
          flashColor={HUD_COLOR.cyanGlow}
          glowColor="rgba(122,232,255,0.65)"
        />
      </div>
    </div>
  );
};
