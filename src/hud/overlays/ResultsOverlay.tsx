/**
 * ResultsOverlay — broadcast-style race results screen (Phase 7)
 *
 * Full-screen overlay that appears after a race finishes.
 * Reads immediately as a swimming competition result display.
 *
 * Layout:
 *   Header  — event name + heat label
 *   Left    — medal crash-in · final time · PB badge · rewards
 *   Right   — FINAL STANDINGS (all 8 lanes) + splits
 *   Bottom  — REPLAY · CONTINUE · LOBBY
 *
 * Swimming-specific additions:
 *   - Event title ("100M FREESTYLE · HEAT 2")
 *   - Full 8-lane standings with lane numbers, swimmer names, times, gaps
 *   - PB / WR / SB record designations
 *   - Player row highlighted in the standings table
 *
 * Animation sequence (on mount):
 *   1. Backdrop fades (200ms)
 *   2. Card springs in — finishBurst (delay 50ms)
 *   3. Medal + place crashes in (delay 120ms)
 *   4. Time + PB badge stagger up (delay 220ms)
 *   5. Standings rows stagger in (delay 300ms, 45ms each)
 *   6. Rewards slide up (delay 380ms)
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, ArrowRight, Home, Star, Coins } from 'lucide-react';
import {
  finishBurst,
  resultCrashIn,
  pbFlashReveal,
  staggerContainer,
  staggerChild,
  overlayFade,
} from '../../feedback/motionVariants';
import { HUD_COLOR, HUD_FONT, ordinal } from '../hudTokens';
import { playFinishImpact } from '../../feedback/audioEngine';
import { triggerSuccessHaptic } from '../../feedback/haptics';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SplitEntry {
  label: string;   // "50M", "100M"
  time:  string;   // "00:27.41"
}

export interface StandingEntry {
  position: number;    // 1–8
  lane:     number;    // 1–8
  name:     string;    // "YOU" or swimmer surname
  time:     string;    // "00:54.23"
  isPlayer: boolean;
}

export interface ResultsData {
  rank:      number;        // 1–8
  time:      string;        // "00:54.23"
  xp:        number;
  coins:     number;
  isPB:      boolean;
  splits:    SplitEntry[];
  /** e.g. "100M FREESTYLE" */
  eventName?: string;
  /** e.g. "HEAT 1" */
  heat?:      string;
  /** Full 8-lane final standings */
  standings?: StandingEntry[];
}

export interface ResultsOverlayProps {
  data:         ResultsData;
  onReplay:     () => void;
  onContinue:   () => void;
  onLobby:      () => void;
  /** If true, plays finish audio + success haptic on mount */
  playFeedback?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Medal config
// ─────────────────────────────────────────────────────────────────────────────

const MEDAL: Record<number, { emoji: string; color: string; glow: string; bg: string }> = {
  1: { emoji: '🥇', color: '#FFD76A', glow: 'rgba(255,215,106,0.50)', bg: 'rgba(255,215,106,0.10)' },
  2: { emoji: '🥈', color: '#C8D6E5', glow: 'rgba(200,214,229,0.40)', bg: 'rgba(200,214,229,0.08)' },
  3: { emoji: '🥉', color: '#CD8B4A', glow: 'rgba(205,139,74,0.40)',  bg: 'rgba(205,139,74,0.08)'  },
};

function getMedal(rank: number) {
  return MEDAL[rank] ?? { emoji: '🏊', color: HUD_COLOR.aqua, glow: HUD_COLOR.aquaGlow, bg: 'rgba(56,214,255,0.06)' };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const Divider: React.FC = () => (
  <div style={{ height: '1px', background: 'rgba(56,214,255,0.10)', margin: '10px 0' }} />
);

/** Single row in the standings table */
const StandingRow: React.FC<{
  entry:    StandingEntry;
  isLast:   boolean;
  playerTime: string;
}> = ({ entry, isLast, playerTime }) => {
  const isPlayer  = entry.isPlayer;
  const rankColor = entry.position === 1
    ? HUD_COLOR.gold
    : entry.position <= 3 ? HUD_COLOR.aqua
    : HUD_COLOR.textSecondary;

  // Compute gap vs player (rough, based on time string comparison)
  // For display only — we accept minor approximation
  const timeToMs = (t: string): number => {
    const [min, rest] = t.split(':');
    const [sec, cent] = (rest ?? '0.00').split('.');
    return (parseInt(min) * 60 + parseInt(sec)) * 1000 + parseInt(cent) * 10;
  };
  const gapMs  = timeToMs(entry.time) - timeToMs(playerTime);
  const gapStr = isPlayer
    ? '—'
    : gapMs > 0
      ? `+${(gapMs / 1000).toFixed(2)}s`
      : `${(gapMs / 1000).toFixed(2)}s`;

  return (
    <motion.div
      variants={staggerChild}
      style={{
        display:        'grid',
        gridTemplateColumns: '22px 16px 1fr auto auto',
        alignItems:     'center',
        gap:            '5px',
        padding:        '4px 0',
        borderBottom:   isLast ? 'none' : '1px solid rgba(56,214,255,0.06)',
        background:     isPlayer ? 'rgba(56,214,255,0.05)' : 'transparent',
        borderRadius:   isPlayer ? '4px' : '0',
        paddingLeft:    isPlayer ? '4px' : '0',
        paddingRight:   isPlayer ? '4px' : '0',
      }}
    >
      {/* Position */}
      <span
        style={{
          fontFamily:    HUD_FONT.impact,
          fontSize:      '11px',
          color:         rankColor,
          letterSpacing: '0.02em',
          textAlign:     'right',
        }}
      >
        {ordinal(entry.position).replace(/(\d+)(ST|ND|RD|TH)/, '$1')}
      </span>

      {/* Lane number */}
      <span
        style={{
          fontFamily:    HUD_FONT.label,
          fontWeight:    700,
          fontSize:      '7px',
          color:         isPlayer ? HUD_COLOR.gold : 'rgba(169,211,231,0.35)',
          textAlign:     'center',
          letterSpacing: '0',
        }}
      >
        L{entry.lane}
      </span>

      {/* Name */}
      <span
        style={{
          fontFamily:    HUD_FONT.label,
          fontWeight:    isPlayer ? 700 : 600,
          fontSize:      '10px',
          color:         isPlayer ? HUD_COLOR.aqua : HUD_COLOR.textSecondary,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          overflow:      'hidden',
          whiteSpace:    'nowrap',
          textOverflow:  'ellipsis',
        }}
      >
        {entry.name}
      </span>

      {/* Time */}
      <span
        style={{
          fontFamily:         HUD_FONT.impact,
          fontSize:           '12px',
          color:              isPlayer ? HUD_COLOR.textPrimary : HUD_COLOR.textSecondary,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing:      '0.02em',
        }}
      >
        {entry.time}
      </span>

      {/* Gap */}
      <span
        style={{
          fontFamily:    HUD_FONT.label,
          fontWeight:    600,
          fontSize:      '8px',
          color:         gapMs < 0
            ? HUD_COLOR.success
            : gapMs > 0 ? 'rgba(169,211,231,0.45)' : HUD_COLOR.textMuted,
          letterSpacing: '0.02em',
          minWidth:      '38px',
          textAlign:     'right',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {gapStr}
      </span>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ResultsOverlay
// ─────────────────────────────────────────────────────────────────────────────

export const ResultsOverlay: React.FC<ResultsOverlayProps> = ({
  data,
  onReplay,
  onContinue,
  onLobby,
  playFeedback = true,
}) => {
  const medal     = getMedal(data.rank);
  const eventName = data.eventName ?? 'RACE RESULT';
  const heat      = data.heat      ?? '';

  useEffect(() => {
    if (!playFeedback) return;
    playFinishImpact();
    if (data.rank <= 3) triggerSuccessHaptic();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      <motion.div
        variants={overlayFade}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          position:       'fixed',
          inset:          0,
          zIndex:         200,
          background:     'rgba(4,20,33,0.94)',
          backdropFilter: 'blur(12px)',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '10px',
        }}
      >
        {/* ── Event header ─────────────────────────────────────────────── */}
        <div
          style={{
            display:       'flex',
            alignItems:    'center',
            gap:           '8px',
            marginBottom:  '8px',
          }}
        >
          <span
            style={{
              fontFamily:    HUD_FONT.label,
              fontWeight:    700,
              fontSize:      '10px',
              letterSpacing: '0.18em',
              color:         HUD_COLOR.aqua,
              textTransform: 'uppercase',
              opacity:       0.85,
            }}
          >
            {eventName}
          </span>
          {heat && (
            <>
              <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(56,214,255,0.35)' }} />
              <span
                style={{
                  fontFamily:    HUD_FONT.label,
                  fontWeight:    700,
                  fontSize:      '10px',
                  letterSpacing: '0.18em',
                  color:         'rgba(169,211,231,0.45)',
                  textTransform: 'uppercase',
                }}
              >
                {heat}
              </span>
            </>
          )}
        </div>

        {/* ── Main card ───────────────────────────────────────────────── */}
        <motion.div
          variants={finishBurst}
          initial="initial"
          animate="animate"
          style={{
            width:          '100%',
            maxWidth:       '680px',
            background:     'rgba(4,20,33,0.80)',
            border:         '1px solid rgba(56,214,255,0.18)',
            borderRadius:   '20px',
            backdropFilter: 'blur(10px)',
            overflow:       'hidden',
          }}
        >
          {/* ── Two-column body ───────────────────────────────────────── */}
          <div style={{ display: 'flex', minHeight: '200px' }}>

            {/* ── LEFT PANEL — result + rewards ── */}
            <div
              style={{
                flex:          '0 0 42%',
                padding:       '18px 18px 14px',
                borderRight:   '1px solid rgba(56,214,255,0.08)',
                background:    medal.bg,
                display:       'flex',
                flexDirection: 'column',
                gap:           '4px',
              }}
            >
              {/* Medal + place */}
              <motion.div
                variants={resultCrashIn}
                initial="initial"
                animate="animate"
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <span style={{ fontSize: '34px', lineHeight: 1 }}>{medal.emoji}</span>
                <div>
                  <div
                    style={{
                      fontFamily:    HUD_FONT.impact,
                      fontSize:      '44px',
                      lineHeight:    1,
                      color:         medal.color,
                      letterSpacing: '0.02em',
                      textShadow:    `0 0 18px ${medal.glow}, 0 0 36px ${medal.glow}`,
                    }}
                  >
                    {ordinal(data.rank)}
                  </div>
                  <div
                    style={{
                      fontFamily:    HUD_FONT.label,
                      fontWeight:    700,
                      fontSize:      '8px',
                      letterSpacing: '0.18em',
                      color:         'rgba(169,211,231,0.45)',
                      textTransform: 'uppercase',
                    }}
                  >
                    PLACE
                  </div>
                </div>
              </motion.div>

              <Divider />

              {/* Final time */}
              <motion.div
                variants={staggerChild}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.22 } as never}
                style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}
              >
                <span
                  style={{
                    fontFamily:         HUD_FONT.impact,
                    fontSize:           '32px',
                    lineHeight:         1,
                    color:              HUD_COLOR.textPrimary,
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing:      '0.03em',
                  }}
                >
                  {data.time}
                </span>
                <span
                  style={{
                    fontFamily:    HUD_FONT.label,
                    fontWeight:    700,
                    fontSize:      '8px',
                    letterSpacing: '0.14em',
                    color:         HUD_COLOR.textMuted,
                    textTransform: 'uppercase',
                    paddingBottom: '4px',
                  }}
                >
                  FINAL TIME
                </span>
              </motion.div>

              {/* PB badge */}
              {data.isPB && (
                <motion.div
                  variants={pbFlashReveal}
                  initial="initial"
                  animate="animate"
                  style={{
                    display:    'inline-flex',
                    alignItems: 'center',
                    gap:        '5px',
                    alignSelf:  'flex-start',
                    padding:    '4px 10px',
                    borderRadius: '8px',
                    background:  'rgba(55,226,141,0.14)',
                    border:      '1px solid rgba(55,226,141,0.40)',
                    boxShadow:   '0 0 14px rgba(55,226,141,0.22)',
                    marginTop:   '2px',
                  }}
                >
                  <Trophy size={10} color="#37E28D" />
                  <span
                    style={{
                      fontFamily:    HUD_FONT.impact,
                      fontSize:      '12px',
                      color:         '#37E28D',
                      letterSpacing: '0.10em',
                    }}
                  >
                    NEW PB!
                  </span>
                </motion.div>
              )}

              {/* Splits (if few entries) */}
              {data.splits.length > 0 && (
                <div style={{ marginTop: '6px' }}>
                  <div
                    style={{
                      fontFamily:    HUD_FONT.label,
                      fontWeight:    700,
                      fontSize:      '7px',
                      letterSpacing: '0.14em',
                      color:         HUD_COLOR.textMuted,
                      textTransform: 'uppercase',
                      marginBottom:  '4px',
                    }}
                  >
                    SPLITS
                  </div>
                  {data.splits.map((s) => (
                    <div
                      key={s.label}
                      style={{
                        display:        'flex',
                        justifyContent: 'space-between',
                        padding:        '2px 0',
                      }}
                    >
                      <span
                        style={{
                          fontFamily:    HUD_FONT.label,
                          fontWeight:    600,
                          fontSize:      '9px',
                          color:         HUD_COLOR.textSecondary,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {s.label}
                      </span>
                      <span
                        style={{
                          fontFamily:         HUD_FONT.impact,
                          fontSize:           '12px',
                          color:              HUD_COLOR.aqua,
                          fontVariantNumeric: 'tabular-nums',
                          letterSpacing:      '0.03em',
                        }}
                      >
                        {s.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ flex: 1 }} />

              {/* Rewards */}
              <motion.div
                variants={staggerChild}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.38 } as never}
                style={{ display: 'flex', gap: '14px', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={12} color={HUD_COLOR.gold} fill={HUD_COLOR.gold} />
                  <span
                    style={{
                      fontFamily:    HUD_FONT.impact,
                      fontSize:      '16px',
                      color:         HUD_COLOR.gold,
                      letterSpacing: '0.02em',
                    }}
                  >
                    +{data.xp.toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontFamily:    HUD_FONT.label,
                      fontWeight:    700,
                      fontSize:      '8px',
                      color:         HUD_COLOR.textMuted,
                      letterSpacing: '0.10em',
                    }}
                  >
                    XP
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Coins size={12} color={HUD_COLOR.warning} />
                  <span
                    style={{
                      fontFamily:    HUD_FONT.impact,
                      fontSize:      '16px',
                      color:         HUD_COLOR.warning,
                      letterSpacing: '0.02em',
                    }}
                  >
                    +{data.coins.toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontFamily:    HUD_FONT.label,
                      fontWeight:    700,
                      fontSize:      '8px',
                      color:         HUD_COLOR.textMuted,
                      letterSpacing: '0.10em',
                    }}
                  >
                    COINS
                  </span>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT PANEL — final standings ── */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              style={{
                flex:          '0 0 58%',
                padding:       '16px 14px',
                display:       'flex',
                flexDirection: 'column',
              }}
            >
              {/* Standings header */}
              <div
                style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'center',
                  marginBottom:   '6px',
                }}
              >
                <span
                  style={{
                    fontFamily:    HUD_FONT.label,
                    fontWeight:    700,
                    fontSize:      '8px',
                    letterSpacing: '0.18em',
                    color:         'rgba(169,211,231,0.40)',
                    textTransform: 'uppercase',
                  }}
                >
                  FINAL STANDINGS
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['POS', 'LN', 'SWIMMER', 'TIME', 'GAP'].map((h) => (
                    <span
                      key={h}
                      style={{
                        fontFamily:    HUD_FONT.label,
                        fontWeight:    700,
                        fontSize:      '6px',
                        letterSpacing: '0.10em',
                        color:         'rgba(169,211,231,0.25)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Standing rows */}
              {data.standings && data.standings.length > 0 ? (
                data.standings.map((entry, i) => (
                  <StandingRow
                    key={`${entry.lane}-${entry.position}`}
                    entry={entry}
                    isLast={i === data.standings!.length - 1}
                    playerTime={data.time}
                  />
                ))
              ) : (
                /* Fallback if standings not provided */
                <motion.div
                  variants={staggerChild}
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    flex:           1,
                    color:          HUD_COLOR.textMuted,
                    fontFamily:     HUD_FONT.label,
                    fontSize:       '11px',
                  }}
                >
                  No standings data
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* ── Bottom actions ─────────────────────────────────────────── */}
          <div
            style={{
              borderTop:      '1px solid rgba(56,214,255,0.10)',
              padding:        '10px 14px',
              display:        'flex',
              gap:            '8px',
            }}
          >
            {/* REPLAY */}
            <motion.button
              onClick={onReplay}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 700, damping: 32 }}
              style={{
                flex:           '0 0 auto',
                height:         '42px',
                padding:        '0 16px',
                borderRadius:   '12px',
                display:        'flex',
                alignItems:     'center',
                gap:            '6px',
                cursor:         'pointer',
                background:     'rgba(255,255,255,0.06)',
                border:         '1px solid rgba(255,255,255,0.14)',
              }}
            >
              <RefreshCw size={12} color={HUD_COLOR.textSecondary} />
              <span
                style={{
                  fontFamily:    HUD_FONT.impact,
                  fontSize:      '13px',
                  color:         HUD_COLOR.textSecondary,
                  letterSpacing: '0.08em',
                }}
              >
                REPLAY
              </span>
            </motion.button>

            {/* CONTINUE (primary) */}
            <motion.button
              onClick={onContinue}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 700, damping: 32 }}
              style={{
                flex:           1,
                height:         '42px',
                borderRadius:   '12px',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '6px',
                cursor:         'pointer',
                background:     `linear-gradient(135deg, ${HUD_COLOR.aqua}, ${HUD_COLOR.cyanGlow})`,
                border:         'none',
                boxShadow:      `0 0 18px ${HUD_COLOR.aquaGlow}`,
              }}
            >
              <span
                style={{
                  fontFamily:    HUD_FONT.impact,
                  fontSize:      '15px',
                  color:         '#041421',
                  letterSpacing: '0.08em',
                }}
              >
                CONTINUE
              </span>
              <ArrowRight size={13} color="#041421" />
            </motion.button>

            {/* LOBBY */}
            <motion.button
              onClick={onLobby}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 700, damping: 32 }}
              style={{
                flex:           '0 0 auto',
                height:         '42px',
                padding:        '0 16px',
                borderRadius:   '12px',
                display:        'flex',
                alignItems:     'center',
                gap:            '6px',
                cursor:         'pointer',
                background:     'rgba(255,255,255,0.06)',
                border:         '1px solid rgba(255,255,255,0.14)',
              }}
            >
              <Home size={12} color={HUD_COLOR.textSecondary} />
              <span
                style={{
                  fontFamily:    HUD_FONT.impact,
                  fontSize:      '13px',
                  color:         HUD_COLOR.textSecondary,
                  letterSpacing: '0.08em',
                }}
              >
                LOBBY
              </span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
