/**
 * LaneRadar — compact 8-lane minimap for the top-right zone
 *
 * Shows all 8 lanes as thin horizontal tracks. Each track has a dot
 * that represents the swimmer's progress along the pool (left = start, right = finish).
 *
 * Player dot: bright aqua, larger, glowing
 * AI dots:    muted white/gray, small
 *
 * The player's lane row is subtly highlighted with an aqua left-edge stripe.
 *
 * Layout: 84px × 52px compact panel
 */

import React from 'react';
import { HUD_PANEL, HUD_COLOR, HUD_FONT } from '../hudTokens';

interface LaneData {
  lane:     number;   // 1-8
  progress: number;   // 0.0 – 1.0
  isPlayer: boolean;
}

interface LaneRadarProps {
  lanes:       LaneData[];
  playerLane:  number;
}

export const LaneRadar: React.FC<LaneRadarProps> = ({ lanes, playerLane }) => {
  const sorted = [...lanes].sort((a, b) => a.lane - b.lane);

  return (
    <div
      style={{
        ...HUD_PANEL,
        width:   '84px',
        padding: '5px 7px 4px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Lane tracks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5px' }}>
        {sorted.map((lane) => {
          const isPlayer = lane.isPlayer || lane.lane === playerLane;
          const clampedProgress = Math.min(0.96, Math.max(0.02, lane.progress));

          return (
            <div
              key={lane.lane}
              style={{
                position:   'relative',
                height:     '4px',
                borderRadius: '2px',
                background: isPlayer
                  ? 'rgba(56, 214, 255, 0.10)'
                  : 'rgba(255, 255, 255, 0.04)',
                overflow: 'visible',
              }}
            >
              {/* Player lane left edge stripe */}
              {isPlayer && (
                <div
                  style={{
                    position:   'absolute',
                    left:       '-4px',
                    top:        '0',
                    width:      '2px',
                    height:     '100%',
                    background: HUD_COLOR.aqua,
                    borderRadius: '1px',
                    boxShadow:  `0 0 4px ${HUD_COLOR.aquaGlow}`,
                  }}
                />
              )}

              {/* Track inner line */}
              <div
                style={{
                  position:   'absolute',
                  inset:      '1.5px 2px',
                  borderRadius: '1px',
                  background: isPlayer
                    ? 'rgba(56, 214, 255, 0.06)'
                    : 'rgba(255, 255, 255, 0.03)',
                }}
              />

              {/* Swimmer dot */}
              <div
                style={{
                  position:    'absolute',
                  top:         '50%',
                  left:        `${clampedProgress * 100}%`,
                  transform:   'translate(-50%, -50%)',
                  width:       isPlayer ? '6px' : '4px',
                  height:      isPlayer ? '6px' : '4px',
                  borderRadius: '50%',
                  background:  isPlayer ? HUD_COLOR.aqua : 'rgba(255,255,255,0.40)',
                  boxShadow:   isPlayer ? `0 0 6px ${HUD_COLOR.aquaGlow}` : 'none',
                  transition:  'left 0.2s linear',
                  zIndex:      2,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Footer label */}
      <div
        style={{
          fontFamily:    HUD_FONT.label,
          fontWeight:    700,
          fontSize:      '7px',
          letterSpacing: '0.10em',
          color:         HUD_COLOR.textMuted,
          textTransform: 'uppercase',
          textAlign:     'center',
          marginTop:     '3px',
        }}
      >
        LANE {playerLane} · RADAR
      </div>
    </div>
  );
};
