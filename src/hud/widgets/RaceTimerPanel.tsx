/**
 * RaceTimerPanel — top-center HUD widget
 *
 * Displays: race timer · current position · lap info · heat label
 *
 * Layout (horizontal, single panel):
 *   [⏱ 00:48.23]  [2ND]  [LAP 2/4 · SEMI FINAL 1]
 *
 * Visual contract:
 *   - Timer: Bebas Neue 26px, tabular-nums — always readable
 *   - Position: Bebas Neue, gold for 1st, aqua for 2nd-3rd, white otherwise
 *   - Lap/heat: Rajdhani 9px, muted — secondary info
 *   - Strong dark panel (highest contrast of all HUD panels)
 *   - No decorative padding — every pixel earns its place
 */

import React from 'react';
import { motion } from 'motion/react';
import { HUD_PANEL_STRONG, HUD_COLOR, HUD_FONT, ordinal, formatRaceTime } from '../hudTokens';
import { urgencyPulseAnimate } from '../../feedback/motionVariants';

interface RaceTimerPanelProps {
  elapsedMs:    number;
  position:     number;  // 1-8
  lapNumber:    number;
  totalLaps:    number;
  heat:         string;
  /** When true, panel pulses to signal the race is nearly over */
  urgent?:      boolean;
}

function positionColor(pos: number): string {
  if (pos === 1) return HUD_COLOR.gold;
  if (pos <= 3)  return HUD_COLOR.aqua;
  return HUD_COLOR.textPrimary;
}

function positionGlow(pos: number): string {
  if (pos === 1) return `0 0 10px ${HUD_COLOR.goldGlow}`;
  if (pos <= 3)  return `0 0 10px ${HUD_COLOR.aquaGlow}`;
  return 'none';
}

export const RaceTimerPanel: React.FC<RaceTimerPanelProps> = ({
  elapsedMs,
  position,
  lapNumber,
  totalLaps,
  heat,
  urgent = false,
}) => {
  const posColor  = positionColor(position);
  const posGlow   = positionGlow(position);
  const timeStr   = formatRaceTime(elapsedMs);
  const posStr    = ordinal(position);

  return (
    <motion.div
      animate={urgent ? urgencyPulseAnimate : {}}
      style={{
        ...HUD_PANEL_STRONG,
        display:     'inline-flex',
        alignItems:  'center',
        gap:         '10px',
        padding:     '5px 14px',
        userSelect:  'none',
        WebkitUserSelect: 'none',
        // Urgency: subtle danger tint replaces panel border
        ...(urgent && { border: '1px solid rgba(255,93,115,0.35)' }),
      }}
    >
      {/* ── Race timer ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span
          style={{
            fontFamily:         HUD_FONT.impact,
            fontSize:           '26px',
            lineHeight:         1,
            color:              HUD_COLOR.textPrimary,
            letterSpacing:      '0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {timeStr}
        </span>
        <span
          style={{
            fontFamily:    HUD_FONT.label,
            fontWeight:    700,
            fontSize:      '7px',
            letterSpacing: '0.14em',
            color:         HUD_COLOR.textMuted,
            textTransform: 'uppercase',
            lineHeight:    1,
            marginTop:     '1px',
          }}
        >
          RACE TIME
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '28px', background: 'rgba(56,214,255,0.12)' }} />

      {/* ── Position badge ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span
          style={{
            fontFamily:    HUD_FONT.impact,
            fontSize:      '22px',
            lineHeight:    1,
            color:         posColor,
            letterSpacing: '0.03em',
            textShadow:    posGlow,
          }}
        >
          {posStr}
        </span>
        <span
          style={{
            fontFamily:    HUD_FONT.label,
            fontWeight:    700,
            fontSize:      '7px',
            letterSpacing: '0.14em',
            color:         HUD_COLOR.textMuted,
            textTransform: 'uppercase',
            lineHeight:    1,
            marginTop:     '1px',
          }}
        >
          POS
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '28px', background: 'rgba(56,214,255,0.12)' }} />

      {/* ── Lap + heat ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span
            style={{
              fontFamily:    HUD_FONT.impact,
              fontSize:      '16px',
              lineHeight:    1,
              color:         HUD_COLOR.aqua,
              letterSpacing: '0.02em',
            }}
          >
            {lapNumber}
          </span>
          <span
            style={{
              fontFamily:    HUD_FONT.label,
              fontWeight:    700,
              fontSize:      '9px',
              color:         HUD_COLOR.textMuted,
            }}
          >
            / {totalLaps}
          </span>
          <span
            style={{
              fontFamily:    HUD_FONT.label,
              fontWeight:    700,
              fontSize:      '8px',
              letterSpacing: '0.08em',
              color:         HUD_COLOR.textMuted,
              textTransform: 'uppercase',
              marginLeft:    '2px',
            }}
          >
            LAP
          </span>
        </div>
        <span
          style={{
            fontFamily:    HUD_FONT.label,
            fontWeight:    700,
            fontSize:      '8px',
            letterSpacing: '0.10em',
            color:         HUD_COLOR.textMuted,
            textTransform: 'uppercase',
            lineHeight:    1,
          }}
        >
          {heat}
        </span>
      </div>
    </motion.div>
  );
};
