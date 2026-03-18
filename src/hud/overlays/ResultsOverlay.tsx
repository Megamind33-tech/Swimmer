/**
 * ResultsOverlay — premium race results screen
 *
 * Full-screen overlay that appears after a race finishes.
 * Replaces GameShell's OverlayShell + RaceResultScreen with a game-native
 * feel: animated placement crash-in, split breakdown, PB badge.
 *
 * Animation sequence (on mount):
 *   1. Backdrop fades in (200ms)
 *   2. Card springs in with finishBurst (delay 50ms)
 *   3. Medal + place crashes in (delay 120ms)
 *   4. Time + PB badge stagger up (delay 220ms)
 *   5. Splits stagger row-by-row (delay 300ms, 55ms each)
 *   6. Rewards row slides up (delay 380ms)
 *   7. Action buttons appear (delay 440ms)
 *
 * Layout (landscape):
 *   Left panel  — medal, place, time, PB badge, rewards
 *   Right panel — splits table
 *   Bottom row  — REPLAY · CONTINUE · LOBBY
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
  label: string;   // "50m", "100m"
  time:  string;   // "00:27.41"
}

export interface ResultsData {
  rank:    number;   // 1-8
  time:    string;   // "00:54.23"
  xp:      number;
  coins:   number;
  isPB:    boolean;
  splits:  SplitEntry[];
}

export interface ResultsOverlayProps {
  data:        ResultsData;
  onReplay:    () => void;
  onContinue:  () => void;
  onLobby:     () => void;
  /** If true, plays finish audio + success haptic on mount */
  playFeedback?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MEDAL: Record<number, { emoji: string; color: string; glow: string; bg: string }> = {
  1: { emoji: '🥇', color: '#FFD76A', glow: 'rgba(255,215,106,0.50)', bg: 'rgba(255,215,106,0.10)' },
  2: { emoji: '🥈', color: '#C8D6E5', glow: 'rgba(200,214,229,0.40)', bg: 'rgba(200,214,229,0.08)' },
  3: { emoji: '🥉', color: '#CD8B4A', glow: 'rgba(205,139,74,0.40)',  bg: 'rgba(205,139,74,0.08)'  },
};

function getMedal(rank: number) {
  return MEDAL[rank] ?? { emoji: '', color: HUD_COLOR.aqua, glow: HUD_COLOR.aquaGlow, bg: 'rgba(56,214,255,0.06)' };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const Divider: React.FC = () => (
  <div style={{ height: '1px', background: 'rgba(56,214,255,0.10)', margin: '12px 0' }} />
);

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
  const medal = getMedal(data.rank);

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
          padding:        '12px',
        }}
      >
        {/* Header strip */}
        <div
          style={{
            fontFamily:    HUD_FONT.label,
            fontWeight:    700,
            fontSize:      '10px',
            letterSpacing: '0.24em',
            color:         'rgba(169,211,231,0.45)',
            textTransform: 'uppercase',
            marginBottom:  '10px',
          }}
        >
          RACE COMPLETE
        </div>

        {/* Main card */}
        <motion.div
          variants={finishBurst}
          initial="initial"
          animate="animate"
          style={{
            width:          '100%',
            maxWidth:       '660px',
            background:     'rgba(4,20,33,0.80)',
            border:         '1px solid rgba(56,214,255,0.18)',
            borderRadius:   '20px',
            backdropFilter: 'blur(10px)',
            overflow:       'hidden',
          }}
        >
          {/* Card body — two-column landscape layout */}
          <div style={{ display: 'flex', minHeight: '200px' }}>
            {/* ── LEFT PANEL ── */}
            <div
              style={{
                flex:           '0 0 55%',
                padding:        '20px 20px 16px',
                borderRight:    '1px solid rgba(56,214,255,0.08)',
                background:     medal.bg,
                display:        'flex',
                flexDirection:  'column',
                gap:            '4px',
              }}
            >
              {/* Medal + place */}
              <motion.div
                variants={resultCrashIn}
                initial="initial"
                animate="animate"
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <span style={{ fontSize: '36px', lineHeight: 1 }}>{medal.emoji || '🏊'}</span>
                <div>
                  <div
                    style={{
                      fontFamily:    HUD_FONT.impact,
                      fontSize:      '48px',
                      lineHeight:    1,
                      color:         medal.color,
                      letterSpacing: '0.02em',
                      textShadow:    `0 0 20px ${medal.glow}, 0 0 40px ${medal.glow}`,
                    }}
                  >
                    {ordinal(data.rank)}
                  </div>
                  <div
                    style={{
                      fontFamily:    HUD_FONT.label,
                      fontWeight:    700,
                      fontSize:      '9px',
                      letterSpacing: '0.18em',
                      color:         'rgba(169,211,231,0.50)',
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
                    fontSize:           '34px',
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
                    fontSize:      '9px',
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
                    display:       'inline-flex',
                    alignItems:    'center',
                    gap:           '5px',
                    alignSelf:     'flex-start',
                    padding:       '4px 10px',
                    borderRadius:  '8px',
                    background:    'rgba(55,226,141,0.14)',
                    border:        '1px solid rgba(55,226,141,0.40)',
                    boxShadow:     '0 0 14px rgba(55,226,141,0.22)',
                    marginTop:     '2px',
                  }}
                >
                  <Trophy size={11} color="#37E28D" />
                  <span
                    style={{
                      fontFamily:    HUD_FONT.impact,
                      fontSize:      '13px',
                      color:         '#37E28D',
                      letterSpacing: '0.10em',
                    }}
                  >
                    NEW PB!
                  </span>
                </motion.div>
              )}

              <div style={{ flex: 1 }} />

              {/* Rewards row */}
              <motion.div
                variants={staggerChild}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.38 } as never}
                style={{ display: 'flex', gap: '16px', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Star size={13} color={HUD_COLOR.gold} fill={HUD_COLOR.gold} />
                  <span
                    style={{
                      fontFamily:    HUD_FONT.impact,
                      fontSize:      '18px',
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
                      fontSize:      '9px',
                      color:         HUD_COLOR.textMuted,
                      letterSpacing: '0.10em',
                    }}
                  >
                    XP
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Coins size={13} color={HUD_COLOR.warning} />
                  <span
                    style={{
                      fontFamily:    HUD_FONT.impact,
                      fontSize:      '18px',
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
                      fontSize:      '9px',
                      color:         HUD_COLOR.textMuted,
                      letterSpacing: '0.10em',
                    }}
                  >
                    COINS
                  </span>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT PANEL — splits ── */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              style={{
                flex:          '0 0 45%',
                padding:       '20px 16px',
                display:       'flex',
                flexDirection: 'column',
                gap:           '0',
              }}
            >
              <div
                style={{
                  fontFamily:    HUD_FONT.label,
                  fontWeight:    700,
                  fontSize:      '9px',
                  letterSpacing: '0.18em',
                  color:         'rgba(169,211,231,0.40)',
                  textTransform: 'uppercase',
                  marginBottom:  '8px',
                }}
              >
                SPLITS
              </div>

              {data.splits.length === 0 ? (
                <motion.div
                  variants={staggerChild}
                  style={{
                    fontFamily: HUD_FONT.label,
                    fontSize:   '11px',
                    color:      HUD_COLOR.textMuted,
                    marginTop:  '8px',
                  }}
                >
                  No split data
                </motion.div>
              ) : (
                data.splits.map((split, i) => (
                  <motion.div
                    key={split.label}
                    variants={staggerChild}
                    style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'space-between',
                      padding:        '7px 0',
                      borderBottom:   i < data.splits.length - 1
                        ? '1px solid rgba(56,214,255,0.07)'
                        : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontFamily:    HUD_FONT.label,
                        fontWeight:    600,
                        fontSize:      '11px',
                        color:         HUD_COLOR.textSecondary,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {split.label}
                    </span>
                    <span
                      style={{
                        fontFamily:         HUD_FONT.impact,
                        fontSize:           '15px',
                        color:              HUD_COLOR.aqua,
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing:      '0.03em',
                      }}
                    >
                      {split.time}
                    </span>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>

          {/* ── BOTTOM ACTIONS ── */}
          <div
            style={{
              borderTop:      '1px solid rgba(56,214,255,0.10)',
              padding:        '12px 16px',
              display:        'flex',
              gap:            '8px',
              justifyContent: 'stretch',
            }}
          >
            {/* REPLAY */}
            <motion.button
              onClick={onReplay}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 700, damping: 32 }}
              style={{
                flex:           '0 0 auto',
                height:         '44px',
                padding:        '0 18px',
                borderRadius:   '12px',
                display:        'flex',
                alignItems:     'center',
                gap:            '6px',
                cursor:         'pointer',
                background:     'rgba(255,255,255,0.06)',
                border:         '1px solid rgba(255,255,255,0.14)',
              }}
            >
              <RefreshCw size={13} color={HUD_COLOR.textSecondary} />
              <span
                style={{
                  fontFamily:    HUD_FONT.impact,
                  fontSize:      '14px',
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
                height:         '44px',
                borderRadius:   '12px',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '6px',
                cursor:         'pointer',
                background:     `linear-gradient(135deg, ${HUD_COLOR.aqua}, ${HUD_COLOR.cyanGlow})`,
                border:         'none',
                boxShadow:      `0 0 20px ${HUD_COLOR.aquaGlow}`,
              }}
            >
              <span
                style={{
                  fontFamily:    HUD_FONT.impact,
                  fontSize:      '16px',
                  color:         '#041421',
                  letterSpacing: '0.08em',
                }}
              >
                CONTINUE
              </span>
              <ArrowRight size={14} color="#041421" />
            </motion.button>

            {/* LOBBY */}
            <motion.button
              onClick={onLobby}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 700, damping: 32 }}
              style={{
                flex:           '0 0 auto',
                height:         '44px',
                padding:        '0 18px',
                borderRadius:   '12px',
                display:        'flex',
                alignItems:     'center',
                gap:            '6px',
                cursor:         'pointer',
                background:     'rgba(255,255,255,0.06)',
                border:         '1px solid rgba(255,255,255,0.14)',
              }}
            >
              <Home size={13} color={HUD_COLOR.textSecondary} />
              <span
                style={{
                  fontFamily:    HUD_FONT.impact,
                  fontSize:      '14px',
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
