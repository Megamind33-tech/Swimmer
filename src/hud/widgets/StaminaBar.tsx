/**
 * StaminaBar — compact horizontal bar for the top-left state cluster
 *
 * Color thresholds:
 *   > 55%  → aqua (healthy)
 *   25-55% → warning amber
 *   < 25%  → danger red (critical, subtle pulse animation)
 *
 * Icon + bar + numeric value in one compact row (≈ 14px tall).
 */

import React from 'react';
import { HUD_COLOR, HUD_FONT, staminaColor, staminaGlow } from '../hudTokens';

interface StaminaBarProps {
  value: number;  // 0-100
}

export const StaminaBar: React.FC<StaminaBarProps> = ({ value }) => {
  const pct   = Math.min(100, Math.max(0, value));
  const color = staminaColor(pct);
  const glow  = staminaGlow(pct);
  const isCritical = pct < 25;

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
        STM
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
            transition: 'width 0.18s linear, background 0.4s ease',
            animation:  isCritical ? 'hud-critical-pulse 0.8s ease-in-out infinite' : 'none',
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
          textShadow:         isCritical ? `0 0 8px ${glow}` : 'none',
        }}
      >
        {Math.round(pct)}
      </span>
    </div>
  );
};
