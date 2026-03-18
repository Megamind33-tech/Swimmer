/**
 * StrokeControls — bottom-zone action controls
 *
 * Layout zones (landscape ergonomics):
 *
 *  BOTTOM-LEFT: JoystickZone
 *    Visual placeholder for directional input (pool steering).
 *    Currently decorative; future: full virtual joystick with touch tracking.
 *    Positioned for LEFT THUMB accessibility.
 *
 *  BOTTOM-CENTER: StaminaRing
 *    Circular SVG stamina gauge + distance readout.
 *    Read-only — placed at natural visual center.
 *
 *  BOTTOM-RIGHT: ActionCluster
 *    LEFT stroke button + RIGHT stroke button (primary swim inputs)
 *    SPRINT button above them (burst of speed, drains stamina faster)
 *    Positioned for RIGHT THUMB accessibility.
 *
 * Touch contract:
 *   - All buttons use onPointerDown (not onClick) for minimum latency
 *   - 80px minimum tap target on stroke buttons (WCAG 2.5.5 extended)
 *   - Flash animation on each press (visual + tactile feedback)
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { HUD_COLOR, HUD_FONT, staminaColor } from '../hudTokens';

// ─────────────────────────────────────────────────────────────────────────────
// Joystick Zone (Bottom-Left)
// ─────────────────────────────────────────────────────────────────────────────

export const JoystickZone: React.FC = () => (
  <div
    style={{
      width:          '130px',
      height:         '88px',
      borderRadius:   '24px',
      background:     'rgba(4,20,33,0.50)',
      border:         '1px solid rgba(56,214,255,0.10)',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      position:       'relative',
      flexShrink:     0,
    }}
  >
    {/* Crosshair H */}
    <div
      style={{
        position:   'absolute',
        width:      '48px',
        height:     '1px',
        background: 'rgba(56,214,255,0.15)',
      }}
    />
    {/* Crosshair V */}
    <div
      style={{
        position:   'absolute',
        width:      '1px',
        height:     '48px',
        background: 'rgba(56,214,255,0.15)',
      }}
    />
    {/* Thumb circle */}
    <div
      style={{
        width:        '28px',
        height:       '28px',
        borderRadius: '50%',
        background:   'rgba(56,214,255,0.12)',
        border:       '1.5px solid rgba(56,214,255,0.28)',
        boxShadow:    '0 0 10px rgba(56,214,255,0.18)',
      }}
    />
    {/* Label */}
    <span
      style={{
        position:      'absolute',
        bottom:        '6px',
        fontFamily:    HUD_FONT.label,
        fontWeight:    700,
        fontSize:      '7px',
        color:         'rgba(169,211,231,0.30)',
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
      }}
    >
      MOVE
    </span>
  </div>
);

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
// Action Cluster (Bottom-Right)
// ─────────────────────────────────────────────────────────────────────────────

interface ActionClusterProps {
  onStrokeLeft:  () => void;
  onStrokeRight: () => void;
  onSprint?:     () => void;
}

interface StrokeButtonProps {
  label:     string;
  icon:      string;
  onPress:   () => void;
  flashColor: string;
  glowColor:  string;
}

const StrokeButton: React.FC<StrokeButtonProps> = ({ label, icon, onPress, flashColor, glowColor }) => {
  const [flashing, setFlashing] = useState(false);

  const handlePress = useCallback(() => {
    setFlashing(true);
    setTimeout(() => setFlashing(false), 110);
    onPress();
  }, [onPress]);

  return (
    <motion.button
      onPointerDown={handlePress}
      whileTap={{ scale: 0.93 }}
      style={{
        width:          '82px',
        height:         '76px',
        borderRadius:   '16px',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '4px',
        cursor:         'pointer',
        border:         `2px solid ${flashing ? flashColor : 'rgba(255,255,255,0.12)'}`,
        background:     flashing
          ? `rgba(${flashColor.replace(/[^,\d]/g, '').split(',').slice(0,3).join(',')},0.18)`
          : 'rgba(4,20,33,0.65)',
        backdropFilter: 'blur(8px)',
        boxShadow:      flashing ? `0 0 24px ${glowColor}, 0 0 8px ${glowColor}` : 'none',
        transition:     'border-color 0.1s, box-shadow 0.1s, background 0.1s',
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
          color:         flashing ? flashColor : HUD_COLOR.textMuted,
        }}
      >
        {label}
      </span>
    </motion.button>
  );
};

export const ActionCluster: React.FC<ActionClusterProps> = ({
  onStrokeLeft,
  onStrokeRight,
  onSprint,
}) => {
  const [sprintActive, setSprintActive] = useState(false);

  const handleSprint = useCallback(() => {
    setSprintActive(true);
    setTimeout(() => setSprintActive(false), 600);
    onSprint?.();
  }, [onSprint]);

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
        onPointerDown={handleSprint}
        whileTap={{ scale: 0.91 }}
        style={{
          height:         '26px',
          width:          '170px',
          borderRadius:   '8px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '5px',
          cursor:         'pointer',
          border:         `1px solid ${sprintActive ? HUD_COLOR.warning : 'rgba(255,194,71,0.22)'}`,
          background:     sprintActive
            ? 'rgba(255,194,71,0.18)'
            : 'rgba(255,194,71,0.06)',
          boxShadow:      sprintActive ? `0 0 18px ${HUD_COLOR.warningGlow}` : 'none',
          transition:     'all 0.1s ease',
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
            color:         sprintActive ? HUD_COLOR.warning : 'rgba(255,194,71,0.55)',
          }}
        >
          SPRINT
        </span>
      </motion.button>

      {/* L / R stroke buttons */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <StrokeButton
          label="LEFT"
          icon="🫴"
          onPress={onStrokeLeft}
          flashColor={HUD_COLOR.aqua}
          glowColor={HUD_COLOR.aquaGlow}
        />
        <StrokeButton
          label="RIGHT"
          icon="🤲"
          onPress={onStrokeRight}
          flashColor={HUD_COLOR.cyanGlow}
          glowColor="rgba(122,232,255,0.65)"
        />
      </div>
    </div>
  );
};
