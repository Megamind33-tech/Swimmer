/**
 * RaceTimerPanel — broadcast-style top-center telemetry (Phase 7)
 *
 * Two-row broadcast layout:
 *   Row 1 — Event banner:   "100M FREESTYLE · HEAT 2 · LANE 4"
 *   Row 2 — Live telemetry: timer | position | gap | lap
 *
 * Visual contract:
 *   - Event row: small-caps, muted — contextual swimming identity
 *   - Timer: Bebas Neue 26px, tabular-nums — always readable
 *   - Position: gold for 1st, aqua for 2nd–3rd, white otherwise
 *   - Gap: "+1.24s" to swimmer ahead; "LEADING" if in 1st
 *   - Lap: current / total with aqua number
 *   - Urgency (final 18%): danger border + scale pulse on panel
 */

import React from 'react';
import { motion } from 'motion/react';
import { HUD_PANEL_STRONG, HUD_COLOR, HUD_FONT, ordinal, formatRaceTime } from '../hudTokens';
import { urgencyPulseAnimate } from '../../feedback/motionVariants';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface RaceTimerPanelProps {
  elapsedMs:     number;
  position:      number;      // 1–8
  lapNumber:     number;
  totalLaps:     number;
  /** e.g. "100M FREESTYLE" */
  eventName:     string;
  /** e.g. "HEAT 2" */
  heat:          string;
  /** Player's lane number (1–8) */
  lane:          number;
  /**
   * Gap to swimmer directly ahead in metres.
   * 0 = player is leading. undefined = not yet computed.
   */
  gapToAheadM?:  number;
  /** When true, panel pulses to signal the race is nearly over */
  urgent?:       boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

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

/** Format metres gap as a time string using average swimming speed (~1.8 m/s). */
function formatGap(gapM: number | undefined, position: number): string {
  if (position === 1)    return 'LEADING';
  if (gapM === undefined) return '—';
  if (gapM <= 0)         return '—';
  // Approximate: world-class 100m free ≈ 47s → ~2.13 m/s; mid-tier ≈ 1.8 m/s
  const gapSec = gapM / 1.8;
  return `+${gapSec.toFixed(2)}s`;
}

// ─────────────────────────────────────────────────────────────────────────────
// RaceTimerPanel
// ─────────────────────────────────────────────────────────────────────────────

export const RaceTimerPanel: React.FC<RaceTimerPanelProps> = ({
  elapsedMs,
  position,
  lapNumber,
  totalLaps,
  eventName,
  heat,
  lane,
  gapToAheadM,
  urgent = false,
}) => {
  const posColor  = positionColor(position);
  const posGlow   = positionGlow(position);
  const timeStr   = formatRaceTime(elapsedMs);
  const posStr    = ordinal(position);
  const gapStr    = formatGap(gapToAheadM, position);
  const isLeading = position === 1;

  return (
    <motion.div
      animate={urgent ? urgencyPulseAnimate : {}}
      style={{
        ...HUD_PANEL_STRONG,
        display:        'inline-flex',
        flexDirection:  'column',
        alignItems:     'stretch',
        padding:        '5px 14px 6px',
        userSelect:     'none',
        WebkitUserSelect: 'none',
        minWidth:       '220px',
        ...(urgent && { border: '1px solid rgba(255,93,115,0.35)' }),
      }}
    >
      {/* ── Event banner row ────────────────────────────────────────────── */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          marginBottom:   '4px',
          paddingBottom:  '3px',
          borderBottom:   '1px solid rgba(56,214,255,0.09)',
          gap:            '8px',
        }}
      >
        {/* Event name — e.g. "100M FREESTYLE" */}
        <span
          style={{
            fontFamily:    HUD_FONT.label,
            fontWeight:    700,
            fontSize:      '8px',
            letterSpacing: '0.13em',
            color:         HUD_COLOR.aqua,
            textTransform: 'uppercase',
            lineHeight:    1,
            flexShrink:    0,
          }}
        >
          {eventName}
        </span>

        {/* Heat + Lane — right-aligned */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span
            style={{
              fontFamily:    HUD_FONT.label,
              fontWeight:    700,
              fontSize:      '7px',
              letterSpacing: '0.10em',
              color:         HUD_COLOR.textMuted,
              textTransform: 'uppercase',
              lineHeight:    1,
            }}
          >
            {heat}
          </span>
          <div style={{ width: '1px', height: '8px', background: 'rgba(56,214,255,0.15)' }} />
          <span
            style={{
              fontFamily:    HUD_FONT.label,
              fontWeight:    700,
              fontSize:      '7px',
              letterSpacing: '0.10em',
              color:         HUD_COLOR.gold,
              textTransform: 'uppercase',
              lineHeight:    1,
            }}
          >
            LANE {lane}
          </span>
        </div>
      </div>

      {/* ── Telemetry row ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

        {/* Race timer */}
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

        {/* Position badge */}
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

        {/* Gap to swimmer ahead */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '46px' }}>
          <span
            style={{
              fontFamily:    isLeading ? HUD_FONT.label : HUD_FONT.impact,
              fontWeight:    isLeading ? 700 : undefined,
              fontSize:      isLeading ? '8px' : '15px',
              lineHeight:    1,
              color:         isLeading ? HUD_COLOR.gold : HUD_COLOR.textSecondary,
              letterSpacing: isLeading ? '0.08em' : '0.02em',
              textShadow:    isLeading ? `0 0 10px ${HUD_COLOR.goldGlow}` : 'none',
              textTransform: 'uppercase',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {gapStr}
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
              marginTop:     isLeading ? '3px' : '1px',
            }}
          >
            GAP
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '28px', background: 'rgba(56,214,255,0.12)' }} />

        {/* Lap counter */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span
              style={{
                fontFamily:    HUD_FONT.impact,
                fontSize:      '18px',
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
                fontSize:      '10px',
                color:         HUD_COLOR.textMuted,
              }}
            >
              /{totalLaps}
            </span>
          </div>
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
            LAP
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Memoized: re-renders at timerHz (30fps) when elapsedMs/position changes
export const RaceTimerPanelMemo = React.memo(RaceTimerPanel);
