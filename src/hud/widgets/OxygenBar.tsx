/**
 * OxygenBar — compact horizontal bar tracking O2 / exertion level
 *
 * Always displayed in cyan/aqua tones since oxygen is a distinct resource.
 * At low oxygen the bar pulses and shifts to warning orange.
 *
 * Positioned below StaminaBar in the top-left state cluster.
 */

import React from 'react';
import { HUD_COLOR, HUD_FONT } from '../hudTokens';

interface OxygenBarProps {
  value: number;  // 0-100
}

function oxygenColor(pct: number): string {
  if (pct > 45) return HUD_COLOR.aqua;
  if (pct > 20) return HUD_COLOR.warning;
  return HUD_COLOR.danger;
}

function oxygenGlow(pct: number): string {
  if (pct > 45) return 'rgba(56, 214, 255, 0.65)';
  if (pct > 20) return 'rgba(255, 194, 71, 0.65)';
  return 'rgba(255, 93, 115, 0.65)';
}

export const OxygenBar: React.FC<OxygenBarProps> = ({ value }) => {
  const pct   = Math.min(100, Math.max(0, value));
  const color = oxygenColor(pct);
  const glow  = oxygenGlow(pct);
  const isCritical = pct < 20;

  return (
    <div
      style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '5px',
        userSelect: 'none',
      }}
    >
      {/* Label */}
      <span
        style={{
          fontFamily:    HUD_FONT.label,
          fontWeight:    700,
          fontSize:      '8px',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color:         HUD_COLOR.textMuted,
          width:         '22px',
          lineHeight:    1,
          flexShrink:    0,
        }}
      >
        O₂
      </span>

      {/* Bar track */}
      <div
        style={{
          flex:         1,
          height:       '5px',
          borderRadius: '3px',
          background:   'rgba(255,255,255,0.07)',
          overflow:     'hidden',
          minWidth:     '56px',
        }}
      >
        <div
          style={{
            width:      `${pct}%`,
            height:     '100%',
            borderRadius: '3px',
            background: color,
            boxShadow:  `0 0 6px ${glow}`,
            transition: 'width 0.2s linear, background 0.4s ease',
            animation:  isCritical ? 'hud-critical-pulse 0.7s ease-in-out infinite' : 'none',
          }}
        />
      </div>

      {/* Numeric value */}
      <span
        style={{
          fontFamily:         HUD_FONT.label,
          fontWeight:         700,
          fontSize:           '10px',
          color,
          fontVariantNumeric: 'tabular-nums',
          width:              '24px',
          textAlign:          'right',
          lineHeight:         1,
          flexShrink:         0,
        }}
      >
        {Math.round(pct)}
      </span>
    </div>
  );
};
