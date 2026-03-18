/**
 * TurnIndicator — turn wall proximity widget
 *
 * Swimming is uniquely defined by the turn at the wall.
 * This widget makes the approaching wall visible during the race.
 *
 * Appears when within TURN_ALERT_DISTANCE metres of the next wall.
 * Visual escalates from amber → danger red as distance closes.
 *
 * Turn walls occur every POOL_LENGTH_M (50m). The finish line is excluded.
 * For a 100m event: one turn at 50m.
 * For a 200m event: turns at 50m, 100m, 150m.
 */

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HUD_COLOR, HUD_FONT } from '../hudTokens';

const POOL_LENGTH_M      = 50;   // Olympic short-course/long-course pool lap
const TURN_ALERT_M       = 15;   // show indicator when this close
const TURN_URGENT_M      = 5;    // urgent pulse threshold

interface TurnIndicatorProps {
  distanceM:      number;
  totalDistanceM: number;
}

/** Returns metres to the next turn wall (excludes the finish line). */
function distanceToNextWall(distanceM: number, totalDistanceM: number): number {
  // Next wall is at the next multiple of POOL_LENGTH_M
  const nextWallAt = Math.ceil((distanceM + 0.5) / POOL_LENGTH_M) * POOL_LENGTH_M;
  // The final wall IS the finish line — skip it
  if (nextWallAt >= totalDistanceM) return Infinity;
  return Math.max(0, nextWallAt - distanceM);
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ distanceM, totalDistanceM }) => {
  const toWall  = distanceToNextWall(distanceM, totalDistanceM);
  const visible = toWall <= TURN_ALERT_M;
  const urgent  = toWall <= TURN_URGENT_M;
  const meters  = Math.round(toWall);

  const color  = urgent ? HUD_COLOR.danger   : HUD_COLOR.warning;
  const glow   = urgent ? HUD_COLOR.dangerGlow : HUD_COLOR.warningGlow;
  const bg     = urgent ? 'rgba(255,93,115,0.14)'  : 'rgba(255,194,71,0.10)';
  const border = urgent ? 'rgba(255,93,115,0.50)'  : 'rgba(255,194,71,0.35)';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="turn-indicator"
          initial={{ opacity: 0, scale: 0.78, y: 10 }}
          animate={{
            opacity:    1,
            scale:      urgent ? [1, 1.05, 1] : 1,
            y:          0,
            transition: {
              opacity: { duration: 0.18 },
              scale:   urgent
                ? { repeat: Infinity, duration: 0.44, ease: 'easeInOut' }
                : { duration: 0.18, ease: [0.0, 0.7, 0.2, 1.0] },
              y: { duration: 0.18, ease: [0.0, 0.7, 0.2, 1.0] },
            },
          }}
          exit={{ opacity: 0, scale: 0.84, y: -6, transition: { duration: 0.20 } }}
          style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        '6px 14px 7px',
            borderRadius:   '10px',
            background:     bg,
            border:         `1px solid ${border}`,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow:      `0 0 20px ${glow}, 0 2px 12px rgba(0,0,0,0.4)`,
            gap:            '1px',
            whiteSpace:     'nowrap',
          }}
        >
          {/* Distance */}
          <span
            style={{
              fontFamily:    HUD_FONT.impact,
              fontSize:      '26px',
              lineHeight:    1,
              color,
              letterSpacing: '0.02em',
              textShadow:    `0 0 14px ${glow}`,
            }}
          >
            {meters}M
          </span>

          {/* Label */}
          <span
            style={{
              fontFamily:    HUD_FONT.label,
              fontWeight:    700,
              fontSize:      '7px',
              letterSpacing: '0.18em',
              color,
              textTransform: 'uppercase',
              lineHeight:    1,
              opacity:       0.75,
            }}
          >
            TO TURN
          </span>

          {/* Dive-indicator dots — fill left-to-right as wall approaches */}
          <div style={{ display: 'flex', gap: '3px', marginTop: '3px' }}>
            {[15, 10, 5].map((threshold) => (
              <div
                key={threshold}
                style={{
                  width:        '4px',
                  height:       '4px',
                  borderRadius: '50%',
                  background:   toWall <= threshold ? color : 'rgba(255,255,255,0.15)',
                  boxShadow:    toWall <= threshold ? `0 0 5px ${glow}` : 'none',
                  transition:   'background 0.2s, box-shadow 0.2s',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const TurnIndicatorMemo = React.memo(TurnIndicator);
