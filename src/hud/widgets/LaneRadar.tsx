/**
 * LaneRadar — compact lane-board for the top-right zone
 *
 * Shows all 8 lanes as horizontal tracks with lane numbers and
 * swimmer position markers. Reads instantly as a swimming race minimap.
 *
 * Broadcast standard:
 *   - Hard-edged black panel (0px radius)
 *   - Player lane: Volt Yellow (#CCFF00) number + square block marker
 *   - AI lanes: grey numbers + small white square blocks
 *   - No glows. No circular dots. No colored translucent backgrounds.
 *
 * Layout: 100px × 58px
 */

import React from 'react';
import { HUD_PANEL, HUD_COLOR, HUD_FONT } from '../hudTokens';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface LaneData {
  lane:     number;   // 1–8
  progress: number;   // 0.0–1.0
  isPlayer: boolean;
}

interface LaneRadarProps {
  lanes:      LaneData[];
  playerLane: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fake AI swimmer initials — consistent per lane number
// ─────────────────────────────────────────────────────────────────────────────

const LANE_INITIALS = ['T', 'C', 'M', 'S', 'J', 'P', 'K', 'R'];

// ─────────────────────────────────────────────────────────────────────────────
// LaneRadar
// ─────────────────────────────────────────────────────────────────────────────

export const LaneRadar: React.FC<LaneRadarProps> = ({ lanes, playerLane }) => {
  const sorted = [...lanes].sort((a, b) => a.lane - b.lane);

  return (
    <div
      style={{
        ...HUD_PANEL,
        width:      '100px',
        padding:    '5px 6px 4px 5px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Lanes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {sorted.map((lane) => {
          const isPlayer        = lane.isPlayer || lane.lane === playerLane;
          const clampedProgress = Math.min(0.96, Math.max(0.02, lane.progress));
          const initial         = isPlayer ? '▶' : (LANE_INITIALS[(lane.lane - 1) % 8] ?? '·');

          return (
            <div key={lane.lane} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              {/* Lane number */}
              <span
                style={{
                  fontFamily:    HUD_FONT.label,
                  fontWeight:    700,
                  fontSize:      '7px',
                  lineHeight:    1,
                  width:         '8px',
                  textAlign:     'center',
                  flexShrink:    0,
                  color:         isPlayer ? HUD_COLOR.volt : 'rgba(255,255,255,0.25)',
                  letterSpacing: '0',
                }}
              >
                {lane.lane}
              </span>

              {/* Track row */}
              <div
                style={{
                  position:   'relative',
                  flex:       1,
                  height:     '5px',
                  borderRadius: '0px',
                  background: isPlayer
                    ? 'rgba(204,255,0,0.08)'
                    : 'rgba(255,255,255,0.05)',
                  overflow:   'visible',
                }}
              >
                {/* Player lane left accent bar */}
                {isPlayer && (
                  <div
                    style={{
                      position:   'absolute',
                      left:       '-3px',
                      top:        0,
                      width:      '2px',
                      height:     '100%',
                      background: HUD_COLOR.volt,
                    }}
                  />
                )}

                {/* Swimmer position marker — square block */}
                <div
                  style={{
                    position:     'absolute',
                    top:          '50%',
                    left:         `${clampedProgress * 100}%`,
                    transform:    'translate(-50%, -50%)',
                    width:        isPlayer ? '6px' : '3px',
                    height:       isPlayer ? '6px' : '3px',
                    borderRadius: '0px',
                    background:   isPlayer ? HUD_COLOR.volt : 'rgba(255,255,255,0.45)',
                    transition:   'left 0.2s linear',
                    zIndex:       2,
                  }}
                />
              </div>

              {/* Swimmer initial */}
              <span
                style={{
                  fontFamily:  HUD_FONT.label,
                  fontWeight:  700,
                  fontSize:    '7px',
                  lineHeight:  1,
                  width:       '7px',
                  textAlign:   'center',
                  flexShrink:  0,
                  color:       isPlayer ? HUD_COLOR.volt : 'rgba(255,255,255,0.20)',
                  letterSpacing: '0',
                }}
              >
                {initial}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer — LANES label */}
      <div
        style={{
          fontFamily:    HUD_FONT.label,
          fontWeight:    700,
          fontSize:      '6px',
          letterSpacing: '0.12em',
          color:         HUD_COLOR.textMuted,
          textTransform: 'uppercase',
          textAlign:     'center',
          marginTop:     '3px',
          opacity:       0.6,
        }}
      >
        LANES 1–8
      </div>
    </div>
  );
};

// Memoized: only re-renders when `lanes` or `playerLane` prop changes
export const LaneRadarMemo = React.memo(LaneRadar);
