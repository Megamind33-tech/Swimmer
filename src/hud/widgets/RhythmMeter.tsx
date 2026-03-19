/**
 * RhythmMeter — stroke cadence / rhythm quality indicator
 *
 * Shows 10 micro-segments that fill proportionally to rhythm quality (0-100).
 * Segments animate with slight height variation to suggest a waveform.
 *
 * States:
 *   > 70%  — in rhythm (aqua glow, all segments lit)
 *   40-70% — partial rhythm (warning amber)
 *   < 40%  — off-rhythm (danger red, only few segments lit)
 *
 * Used in: top-left state cluster (third row under Stamina and O2)
 */

import React from 'react';
import { HUD_COLOR, HUD_FONT } from '../hudTokens';

interface RhythmMeterProps {
  value: number;  // 0-100 rhythm quality
}

const SEGMENTS = 10;

function rhythmColor(pct: number): string {
  if (pct > 70) return HUD_COLOR.volt;    // In rhythm — volt yellow
  if (pct > 40) return HUD_COLOR.white;   // Partial — white
  return HUD_COLOR.danger;                // Off-rhythm — flat red
}

// Heights for each segment to create a waveform silhouette
const WAVE_HEIGHTS = [3, 5, 7, 6, 8, 6, 7, 5, 4, 6];

export const RhythmMeter: React.FC<RhythmMeterProps> = ({ value }) => {
  const pct         = Math.min(100, Math.max(0, value));
  const activeCount = Math.round((pct / 100) * SEGMENTS);
  const color       = rhythmColor(pct);

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
        RHY
      </span>

      {/* Segment bars */}
      <div
        style={{
          display:    'flex',
          alignItems: 'flex-end',
          gap:        '2px',
          height:     '10px',
          minWidth:   '56px',
        }}
      >
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const isActive = i < activeCount;
          const segH     = isActive ? WAVE_HEIGHTS[i] : 3;

          return (
            <div
              key={i}
              style={{
                flex:         1,
                height:       `${segH}px`,
                borderRadius: '0px',
                background:   isActive ? color : 'rgba(255,255,255,0.07)',
                transition:   'height 0.15s ease, background 0.3s ease',
              }}
            />
          );
        })}
      </div>

      {/* State label */}
      <span
        style={{
          fontFamily:    HUD_FONT.label,
          fontWeight:    700,
          fontSize:      '8px',
          color,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          lineHeight:    1,
          width:         '24px',
          textAlign:     'right',
          flexShrink:    0,
        }}
      >
        {pct > 70 ? 'GOOD' : pct > 40 ? 'OK' : 'LOW'}
      </span>
    </div>
  );
};

// Memoized: only re-renders when `value` prop changes (15Hz cosmetic update)
export const RhythmMeterMemo = React.memo(RhythmMeter);
