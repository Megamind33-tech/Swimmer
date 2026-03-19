/**
 * StaminaBar — segmented broadcast-style stamina indicator
 *
 * 10 hard-edged rectangular segments replace the old smooth bar.
 * No glows. No rounded corners. No colored translucent overlays.
 *
 * Color thresholds:
 *   > 55%  → Volt Yellow (#CCFF00) — healthy
 *   25-55% → White (#FFFFFF) — mid / caution
 *   < 25%  → Flat Red (#FF003C) — critical, segments pulse
 */

import React from 'react';
import { HUD_COLOR, HUD_FONT, staminaColor } from '../hudTokens';

interface StaminaBarProps {
  value: number;  // 0-100
}

const SEGMENTS = 10;

export const StaminaBar: React.FC<StaminaBarProps> = ({ value }) => {
  const pct          = Math.min(100, Math.max(0, value));
  const color        = staminaColor(pct);
  const isCritical   = pct < 25;
  const activeCount  = Math.round((pct / 100) * SEGMENTS);

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

      {/* Segmented bar track */}
      <div
        style={{
          display:  'flex',
          gap:      '2px',
          flex:     1,
          minWidth: '56px',
        }}
      >
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <div
            key={i}
            style={{
              flex:       1,
              height:     '5px',
              borderRadius: '0px',
              background: i < activeCount ? color : 'rgba(255,255,255,0.08)',
              transition: 'background 0.3s ease',
              animation:  isCritical && i < activeCount
                ? 'hud-critical-pulse 0.8s ease-in-out infinite'
                : 'none',
            }}
          />
        ))}
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

// Memoized: only re-renders when `value` prop changes (15Hz cosmetic update)
export const StaminaBarMemo = React.memo(StaminaBar);
