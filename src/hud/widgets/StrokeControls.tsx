/**
 * StrokeControls — functional bottom-zone controls
 *
 * Broadcast standard redesign:
 *   - VirtualJoystick: square container, hard white borders, flat knob
 *   - StaminaRing → StaminaWidget: rectangular panel with segmented bar
 *   - ActionCluster: mechanical flat buttons, 0px radius, volt highlight
 *
 * Touch contract unchanged:
 *   - All buttons use onPointerDown (not onClick) for minimum latency
 *   - 80px+ tap targets on stroke buttons
 *   - useGestureLock prevents conflicting simultaneous gestures
 */

import React from 'react';
import { motion } from 'motion/react';
import type { UseActionButtonsResult } from '../../input/useActionButtons';
import type { VirtualJoystickResult as UseVirtualJoystickResult } from '../../input/useVirtualJoystick';
import type { UseGestureLockResult } from '../../input/useGestureLock';
import type { InputAction } from '../../input/inputTypes';
import { HUD_COLOR, HUD_FONT, staminaColor } from '../hudTokens';

// ─────────────────────────────────────────────────────────────────────────────
// VirtualJoystick — square mechanical design
// ─────────────────────────────────────────────────────────────────────────────

export interface VirtualJoystickProps {
  joystick:    UseVirtualJoystickResult;
  gestureLock: UseGestureLockResult;
  size:        number;  // px side length of the square container
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  joystick,
  gestureLock,
  size,
}) => {
  const { handlers, knobOffset, active } = joystick;
  const ZONE_ID = 'joystick';

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

  return (
    <div
      {...wrappedHandlers}
      style={{
        width:        `${size}px`,
        height:       `${size}px`,
        borderRadius: '0px',
        background:   active ? 'rgba(10,10,10,0.85)' : 'rgba(10,10,10,0.70)',
        border:       active
          ? `2px solid rgba(255,255,255,0.55)`
          : `1px solid rgba(255,255,255,0.18)`,
        position:     'relative',
        flexShrink:   0,
        touchAction:  'none',
        cursor:       'crosshair',
        transition:   'border-color 0.08s, background 0.08s',
      }}
    >
      {/* Crosshair H */}
      <div
        style={{
          position:     'absolute',
          top:          '50%',
          left:         '12%',
          right:        '12%',
          height:       '1px',
          marginTop:    '-0.5px',
          background:   'rgba(255,255,255,0.12)',
          pointerEvents:'none',
        }}
      />
      {/* Crosshair V */}
      <div
        style={{
          position:     'absolute',
          left:         '50%',
          top:          '12%',
          bottom:       '12%',
          width:        '1px',
          marginLeft:   '-0.5px',
          background:   'rgba(255,255,255,0.12)',
          pointerEvents:'none',
        }}
      />

      {/* Corner tick marks — top-left */}
      <div style={{ position: 'absolute', top: '6px', left: '6px', width: '8px', height: '1px', background: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '6px', left: '6px', width: '1px', height: '8px', background: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
      {/* top-right */}
      <div style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '1px', background: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '6px', right: '6px', width: '1px', height: '8px', background: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
      {/* bottom-left */}
      <div style={{ position: 'absolute', bottom: '6px', left: '6px', width: '8px', height: '1px', background: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '6px', left: '6px', width: '1px', height: '8px', background: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
      {/* bottom-right */}
      <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '8px', height: '1px', background: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '1px', height: '8px', background: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />

      {/* Knob — flat square, volt yellow when active */}
      <div
        style={{
          position:     'absolute',
          top:          '50%',
          left:         '50%',
          width:        `${size * 0.30}px`,
          height:       `${size * 0.30}px`,
          marginTop:    `${-(size * 0.30) / 2}px`,
          marginLeft:   `${-(size * 0.30) / 2}px`,
          borderRadius: '0px',
          background:   active ? HUD_COLOR.volt : 'rgba(255,255,255,0.22)',
          border:       active
            ? `2px solid ${HUD_COLOR.volt}`
            : '1px solid rgba(255,255,255,0.35)',
          transform:    `translate(${knobOffset.x}px, ${knobOffset.y}px)`,
          transition:   active ? 'none' : 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
          pointerEvents:'none',
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
          color:         active ? HUD_COLOR.volt : 'rgba(255,255,255,0.28)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          transition:    'color 0.08s',
        }}
      >
        MOVE
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// StaminaRing → Broadcast Stamina Widget (rectangular, segmented)
// ─────────────────────────────────────────────────────────────────────────────

interface StaminaRingProps {
  stamina:        number;  // 0-100
  distanceM:      number;
  totalDistanceM: number;
}

const STAMINA_SEGMENTS = 10;

export const StaminaRing: React.FC<StaminaRingProps> = ({ stamina, distanceM, totalDistanceM }) => {
  const pct          = Math.min(100, Math.max(0, stamina));
  const color        = staminaColor(pct);
  const isCritical   = pct < 25;
  const activeCount  = Math.round((pct / 100) * STAMINA_SEGMENTS);

  return (
    <div
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'stretch',
        gap:            '5px',
        flexShrink:     0,
        background:     '#0A0A0A',
        border:         '1px solid rgba(255,255,255,0.18)',
        padding:        '8px 10px',
        minWidth:       '80px',
      }}
    >
      {/* Top row: label + stamina number */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily:    HUD_FONT.label,
            fontWeight:    700,
            fontSize:      '8px',
            letterSpacing: '0.12em',
            color:         HUD_COLOR.grey,
            textTransform: 'uppercase',
          }}
        >
          STM
        </span>
        <span
          style={{
            fontFamily:         HUD_FONT.impact,
            fontSize:           '22px',
            lineHeight:         1,
            color,
            fontVariantNumeric: 'tabular-nums',
            animation:          isCritical ? 'hud-critical-pulse 0.8s ease-in-out infinite' : 'none',
          }}
        >
          {Math.round(pct)}
        </span>
      </div>

      {/* Segmented stamina bar */}
      <div style={{ display: 'flex', gap: '2px' }}>
        {Array.from({ length: STAMINA_SEGMENTS }, (_, i) => (
          <div
            key={i}
            style={{
              flex:         1,
              height:       '4px',
              borderRadius: '0px',
              background:   i < activeCount ? color : 'rgba(255,255,255,0.08)',
              transition:   'background 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Distance readout */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', justifyContent: 'center' }}>
        <span
          style={{
            fontFamily:         HUD_FONT.impact,
            fontSize:           '14px',
            color:              HUD_COLOR.white,
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
            color:         HUD_COLOR.grey,
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
// Stroke Button — mechanical flat button
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
  action, label, icon, size, buttons, gestureLock, flashColor,
}) => {
  const state   = buttons.states[action];
  const flash   = state?.flash   ?? false;
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
      animate={{ scale: pressed ? 0.93 : 1 }}
      transition={{ type: 'spring', stiffness: 700, damping: 32 }}
      style={{
        width:          `${size}px`,
        height:         `${size * 0.93}px`,
        borderRadius:   '0px',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '4px',
        cursor:         'pointer',
        border:         `2px solid ${flash ? flashColor : 'rgba(255,255,255,0.18)'}`,
        background:     flash ? 'rgba(204,255,0,0.10)' : '#0A0A0A',
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
// Action Cluster — mechanical sprint + stroke buttons
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
      {/* Sprint button */}
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
        animate={{ scale: sprintPressed ? 0.94 : 1 }}
        transition={{ type: 'spring', stiffness: 700, damping: 32 }}
        style={{
          height:         '26px',
          width:          `${buttonSize * 2 + 6}px`,
          borderRadius:   '0px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '5px',
          cursor:         'pointer',
          border:         `2px solid ${sprintFlash ? HUD_COLOR.volt : 'rgba(204,255,0,0.30)'}`,
          background:     sprintFlash ? 'rgba(204,255,0,0.12)' : '#0A0A0A',
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
            color:         sprintFlash ? HUD_COLOR.volt : 'rgba(204,255,0,0.55)',
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
          flashColor={HUD_COLOR.volt}
          glowColor="rgba(204,255,0,0)"
        />
        <StrokeButton
          action="strokeRight"
          label="RIGHT"
          icon="🤲"
          size={buttonSize}
          buttons={buttons}
          gestureLock={gestureLock}
          flashColor={HUD_COLOR.volt}
          glowColor="rgba(204,255,0,0)"
        />
      </div>
    </div>
  );
};
