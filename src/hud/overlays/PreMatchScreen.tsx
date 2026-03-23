/**
 * PreMatchScreen — 13-second broadcast-style pre-race lineup reveal
 *
 * Shown immediately after PreRaceSetupScreen confirms, before the race starts.
 *
 * Layout:
 *   Header  — event name · heat label · animated 13s countdown ring
 *   Grid    — 8 swimmer cards (lane, name, flag, nationality, OVR, strengths, weaknesses)
 *   Footer  — countdown progress bar + SKIP button
 *
 * Data: mock swimmers generated per-race (realistic names / nationalities).
 * Player is highlighted with aqua glow in lane 4 (centre lane).
 *
 * Timing:
 *   - 13 000 ms total
 *   - Swimmers stagger in (80 ms each) over ~640 ms
 *   - Countdown ring drains from full in real time
 *   - At 0 → auto-calls onStart()
 *   - SKIP button calls onStart() immediately
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ChevronLeft } from 'lucide-react';

// ─── Responsive hook ──────────────────────────────────────────────────────────

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false),
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface SwimmerEntry {
  lane:        number;
  name:        string;
  nationality: string;
  flag:        string;
  overall:     number;
  strengths:   string[];
  weaknesses:  string[];
  isPlayer:    boolean;
  accentColor: string;
}

export interface PreMatchScreenProps {
  eventName?:  string;   // e.g. "100M FREESTYLE"
  heat?:       string;   // e.g. "HEAT 1"
  onStart:     () => void;
  onBack?:     () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens (inline — no external import needed)
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  bg:           'var(--color-carbon)',
  panel:        'rgba(4,20,33,0.82)',
  border:       'rgba(56,214,255,0.14)',
  aqua:         'var(--color-volt)',
  aquaGlow:     'rgba(204,255,0,0.40)',
  gold:         '#FFD76A',
  danger:       '#FF5D73',
  success:      '#37E28D',
  textPrimary:  '#F3FBFF',
  textSecondary:'rgba(169,211,231,0.70)',
  textMuted:    'rgba(169,211,231,0.40)',
  fontImpact:   "'Bebas Neue', Impact, 'Arial Narrow', sans-serif",
  fontLabel:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
};

const TOTAL_MS = 13_000;

// ─────────────────────────────────────────────────────────────────────────────
// Swimmer roster (8 lanes — player in lane 4)
// ─────────────────────────────────────────────────────────────────────────────

const ROSTER: SwimmerEntry[] = [
  {
    lane: 1, name: 'Kaito Mori', nationality: 'Japan', flag: '🇯🇵', overall: 88,
    strengths:  ['Turn Speed', 'Rhythm'],
    weaknesses: ['Sprint Finish', 'Stamina'],
    isPlayer: false, accentColor: '#FF8C42',
  },
  {
    lane: 2, name: 'Luca Ferretti', nationality: 'Italy', flag: '🇮🇹', overall: 91,
    strengths:  ['Kick Power', 'Race IQ'],
    weaknesses: ['Reaction Start', 'Turns'],
    isPlayer: false, accentColor: '#A78BFA',
  },
  {
    lane: 3, name: 'Luna Santos', nationality: 'Brazil', flag: '🇧🇷', overall: 85,
    strengths:  ['Endurance', 'Pace Control'],
    weaknesses: ['Sprint', 'Dive'],
    isPlayer: false, accentColor: '#34D399',
  },
  {
    lane: 4, name: 'YOU', nationality: 'Your Nation', flag: '🏊', overall: 94,
    strengths:  ['Speed', 'Dive Start'],
    weaknesses: ['Back Half'],
    isPlayer: true, accentColor: C.aqua,
  },
  {
    lane: 5, name: 'Marcus Webb', nationality: 'USA', flag: '🇺🇸', overall: 93,
    strengths:  ['Power', 'Start'],
    weaknesses: ['Technique', 'Turns'],
    isPlayer: false, accentColor: '#F87171',
  },
  {
    lane: 6, name: 'Sven Larsson', nationality: 'Sweden', flag: '🇸🇪', overall: 89,
    strengths:  ['Technique', 'Consistency'],
    weaknesses: ['Kick', 'Sprint Finish'],
    isPlayer: false, accentColor: '#60A5FA',
  },
  {
    lane: 7, name: 'Fatima Al-Rashid', nationality: 'UAE', flag: '🇦🇪', overall: 82,
    strengths:  ['Mental Strength', 'Endurance'],
    weaknesses: ['Kick Power', 'Turns'],
    isPlayer: false, accentColor: '#FBBF24',
  },
  {
    lane: 8, name: 'Yuna Park', nationality: 'South Korea', flag: '🇰🇷', overall: 87,
    strengths:  ['Efficiency', 'Pacing'],
    weaknesses: ['Power', 'Dive'],
    isPlayer: false, accentColor: '#EC4899',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Countdown ring (SVG)
// ─────────────────────────────────────────────────────────────────────────────

const RING_R  = 28;
const RING_CX = 36;
const RING_CY = 36;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;

const CountdownRing: React.FC<{ remaining: number; total: number }> = ({ remaining, total }) => {
  const fraction = Math.max(0, remaining / total);
  const offset   = CIRCUMFERENCE * (1 - fraction);
  const secs     = Math.ceil(remaining / 1000);
  const urgent   = secs <= 5;

  return (
    <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
      <svg width={72} height={72} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={RING_CX} cy={RING_CY} r={RING_R}
          fill="none"
          stroke="rgba(56,214,255,0.12)"
          strokeWidth={4}
        />
        {/* Progress */}
        <circle
          cx={RING_CX} cy={RING_CY} r={RING_R}
          fill="none"
          stroke={urgent ? C.danger : C.aqua}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.25s linear, stroke 0.3s ease' }}
        />
        {urgent && (
          <circle
            cx={RING_CX} cy={RING_CY} r={RING_R}
            fill="none"
            stroke={C.danger}
            strokeWidth={2}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{
              opacity: 0.35,
              filter: `blur(3px)`,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.25s linear',
            }}
          />
        )}
      </svg>
      {/* Label */}
      <div
        style={{
          position:  'absolute',
          inset:     0,
          display:   'flex',
          alignItems:'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <span
          style={{
            fontFamily:    C.fontImpact,
            fontSize:      '22px',
            lineHeight:    1,
            color:         urgent ? C.danger : C.textPrimary,
            textShadow:    urgent ? `0 0 12px ${C.danger}` : `0 0 8px ${C.aquaGlow}`,
            transition:    'color 0.3s ease',
          }}
        >
          {secs}
        </span>
        <span
          style={{
            fontFamily:    C.fontLabel,
            fontWeight:    700,
            fontSize:      '7px',
            letterSpacing: '0.14em',
            color:         C.textMuted,
            textTransform: 'uppercase',
          }}
        >
          SEC
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Swimmer card
// ─────────────────────────────────────────────────────────────────────────────

const SwimmerCard: React.FC<{ swimmer: SwimmerEntry; index: number; isMobile?: boolean }> = ({ swimmer, index, isMobile }) => {
  const isPlayer = swimmer.isPlayer;
  const accent   = swimmer.accentColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="card-highlight"
      style={{
        position:    'relative',
        borderRadius:'14px',
        background:  isPlayer
          ? `linear-gradient(135deg, rgba(56,214,255,0.12) 0%, var(--color-bg-card) 100%)`
          : 'var(--color-bg-panel)',
        border:      isPlayer
          ? `1.5px solid rgba(56,214,255,0.50)`
          : `1px solid ${C.border}`,
        boxShadow:   isPlayer
          ? `0 0 24px rgba(56,214,255,0.20), 0 4px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)`
          : `0 2px 12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)`,
        overflow:    'hidden',
        padding:     isMobile ? '7px 8px' : '10px 12px 10px',
      }}
    >
      {/* Top accent stripe */}
      <div
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          right:      0,
          height:     '2px',
          background: `linear-gradient(90deg, ${accent} 0%, transparent 100%)`,
          opacity:    isPlayer ? 1 : 0.6,
        }}
      />

      {/* YOU badge */}
      {isPlayer && (
        <div
          style={{
            position:      'absolute',
            top:           '8px',
            right:         '8px',
            padding:       '2px 8px',
            borderRadius:  '5px',
            background:    'rgba(56,214,255,0.18)',
            border:        '1px solid rgba(56,214,255,0.45)',
            fontFamily:    C.fontImpact,
            fontSize:      '9px',
            letterSpacing: '0.14em',
            color:         C.aqua,
          }}
        >
          YOU
        </div>
      )}

      {/* Lane + Name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '5px' : '8px', marginBottom: isMobile ? '4px' : '6px' }}>
        {/* Lane bubble */}
        <div
          style={{
            width:          '28px',
            height:         '28px',
            borderRadius:   '8px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            flexShrink:     0,
            background:     `rgba(${hexToRgb(accent)},0.15)`,
            border:         `1px solid rgba(${hexToRgb(accent)},0.35)`,
          }}
        >
          <span
            style={{
              fontFamily:    C.fontImpact,
              fontSize:      '14px',
              color:         accent,
              lineHeight:    1,
            }}
          >
            {swimmer.lane}
          </span>
        </div>

        {/* Flag + name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '13px', lineHeight: 1 }}>{swimmer.flag}</span>
            <span
              style={{
                fontFamily:    C.fontImpact,
                fontSize:      '15px',
                color:         isPlayer ? C.aqua : C.textPrimary,
                letterSpacing: '0.03em',
                lineHeight:    1,
                overflow:      'hidden',
                whiteSpace:    'nowrap',
                textOverflow:  'ellipsis',
                maxWidth:      isMobile ? '80px' : '110px',
              }}
            >
              {swimmer.name}
            </span>
          </div>
          <div
            style={{
              fontFamily:    C.fontLabel,
              fontWeight:    600,
              fontSize:      '9px',
              color:         C.textMuted,
              letterSpacing: '0.06em',
              marginTop:     '1px',
            }}
          >
            {swimmer.nationality}
          </div>
        </div>

        {/* OVR badge */}
        <div
          style={{
            flexShrink:    0,
            textAlign:     'right',
          }}
        >
          <div
            style={{
              fontFamily:    C.fontImpact,
              fontSize:      '20px',
              lineHeight:    1,
              color:         isPlayer ? C.aqua : C.gold,
              textShadow:    isPlayer
                ? `0 0 10px rgba(56,214,255,0.60)`
                : `0 0 8px rgba(255,215,106,0.40)`,
            }}
          >
            {swimmer.overall}
          </div>
          <div
            style={{
              fontFamily:    C.fontLabel,
              fontWeight:    700,
              fontSize:      '7px',
              color:         C.textMuted,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            OVR
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height:     '1px',
          background: isPlayer ? 'rgba(56,214,255,0.18)' : 'rgba(56,214,255,0.07)',
          margin:     isMobile ? '0 0 3px' : '0 0 6px',
        }}
      />

      {/* Strengths */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '4px' }}>
        {swimmer.strengths.map((s) => (
          <span
            key={s}
            style={{
              padding:       '1px 6px',
              borderRadius:  '4px',
              background:    'rgba(55,226,141,0.12)',
              border:        '1px solid rgba(55,226,141,0.28)',
              fontFamily:    C.fontLabel,
              fontWeight:    700,
              fontSize:      '8px',
              color:         '#37E28D',
              letterSpacing: '0.04em',
              whiteSpace:    'nowrap',
            }}
          >
            ↑ {s}
          </span>
        ))}
      </div>

      {/* Weaknesses */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
        {swimmer.weaknesses.map((w) => (
          <span
            key={w}
            style={{
              padding:       '1px 6px',
              borderRadius:  '4px',
              background:    'rgba(255,93,115,0.10)',
              border:        '1px solid rgba(255,93,115,0.25)',
              fontFamily:    C.fontLabel,
              fontWeight:    700,
              fontSize:      '8px',
              color:         '#FF5D73',
              letterSpacing: '0.04em',
              whiteSpace:    'nowrap',
            }}
          >
            ↓ {w}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Utility: hex → "r,g,b"
// ─────────────────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PreMatchScreen
// ─────────────────────────────────────────────────────────────────────────────

export const PreMatchScreen: React.FC<PreMatchScreenProps> = ({
  eventName = 'RACE',
  heat      = 'HEAT 1',
  onStart,
  onBack,
}) => {
  const [remainingMs, setRemainingMs] = useState(TOTAL_MS);
  const [fired,       setFired]       = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef    = useRef(Date.now());

  // Portrait phones: 2-column × 4-row grid; landscape/tablet: 4-column × 2-row
  const isMobilePortrait = useMediaQuery('(max-width: 480px)');

  useEffect(() => {
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const rem     = Math.max(0, TOTAL_MS - elapsed);
      setRemainingMs(rem);
      if (rem <= 0) {
        clearInterval(intervalRef.current!);
        if (!fired) { setFired(true); onStart(); }
      }
    }, 50);
    return () => clearInterval(intervalRef.current!);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSkip = () => {
    clearInterval(intervalRef.current!);
    if (!fired) { setFired(true); onStart(); }
  };

  const progressPct = (remainingMs / TOTAL_MS) * 100;
  const secs        = Math.ceil(remainingMs / 1000);
  const urgent      = secs <= 5;

  return (
    <AnimatePresence>
      <motion.div
        key="pre-match"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position:        'fixed',
          inset:           0,
          zIndex:          120,
          display:         'flex',
          flexDirection:   'column',
          background:      'var(--color-bg-deep)',
          overflow:        'hidden',
        }}
      >
        {/* Noise + ambient underwater light */}
        <div className="screen-noise" aria-hidden />
        <div className="screen-ambient" aria-hidden />

        {/* Caustic blobs — reduce opacity slightly */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0.28 }}>
          <div className="caustic-blob caustic-blob-1" />
          <div className="caustic-blob caustic-blob-2" />
        </div>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
          style={{
            flexShrink:     0,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            padding:        '10px 16px 8px',
            borderBottom:   `1px solid ${C.border}`,
            background:     'rgba(4,20,33,0.70)',
            backdropFilter: 'blur(12px)',
            gap:            '12px',
          }}
        >
          {/* Back button */}
          {onBack && (
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={onBack}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '4px',
                padding:        '6px 10px',
                borderRadius:   '10px',
                background:     'rgba(255,255,255,0.06)',
                border:         '1px solid rgba(255,255,255,0.12)',
                cursor:         'pointer',
                color:          C.textSecondary,
                flexShrink:     0,
              }}
            >
              <ChevronLeft size={14} color="rgba(169,211,231,0.70)" />
              <span
                style={{
                  fontFamily:    C.fontLabel,
                  fontWeight:    700,
                  fontSize:      '10px',
                  letterSpacing: '0.10em',
                  color:         'rgba(169,211,231,0.70)',
                  textTransform: 'uppercase',
                }}
              >
                BACK
              </span>
            </motion.button>
          )}

          {/* Event title */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily:    C.fontLabel,
                fontWeight:    700,
                fontSize:      '9px',
                letterSpacing: '0.22em',
                color:         C.textMuted,
                textTransform: 'uppercase',
                marginBottom:  '2px',
              }}
            >
              {heat} · STARTING LINEUP
            </div>
            <div
              style={{
                fontFamily:    C.fontImpact,
                fontSize:      'clamp(16px, 4vw, 26px)',
                lineHeight:    1,
                color:         C.textPrimary,
                letterSpacing: '0.04em',
                overflow:      'hidden',
                textOverflow:  'ellipsis',
                whiteSpace:    'nowrap',
              }}
            >
              {eventName}
            </div>
          </div>

          {/* Countdown ring */}
          <CountdownRing remaining={remainingMs} total={TOTAL_MS} />
        </motion.div>

        {/* ── SWIMMER GRID ── */}
        {/*
          Portrait phones (≤480px): 2 × 4 grid — narrower cards, scrollable if needed
          Landscape / tablet / desktop: 4 × 2 grid — original broadcast layout
        */}
        <div
          className="swim26-lineup-grid"
          style={{
            gridTemplateColumns: isMobilePortrait ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gridTemplateRows:    isMobilePortrait ? 'repeat(4, minmax(0, 1fr))' : 'repeat(2, 1fr)',
            overflowY:           isMobilePortrait ? 'auto' : 'hidden',
          }}
        >
          {ROSTER.map((swimmer, i) => (
            <SwimmerCard key={swimmer.lane} swimmer={swimmer} index={i} isMobile={isMobilePortrait} />
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div
          style={{
            flexShrink:  0,
            padding:     '8px 16px 10px',
            display:     'flex',
            alignItems:  'center',
            gap:         '12px',
            borderTop:   `1px solid ${C.border}`,
            background:  'rgba(4,20,33,0.80)',
          }}
        >
          {/* Progress bar */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div
              style={{
                display:        'flex',
                justifyContent: 'space-between',
                alignItems:     'center',
              }}
            >
              <span
                style={{
                  fontFamily:    C.fontLabel,
                  fontWeight:    700,
                  fontSize:      '9px',
                  letterSpacing: '0.12em',
                  color:         C.textMuted,
                  textTransform: 'uppercase',
                }}
              >
                Race starts in
              </span>
              <span
                style={{
                  fontFamily:    C.fontImpact,
                  fontSize:      '13px',
                  color:         urgent ? C.danger : C.aqua,
                  letterSpacing: '0.06em',
                  transition:    'color 0.3s ease',
                }}
              >
                {secs}s
              </span>
            </div>
            <div
              style={{
                height:       '4px',
                borderRadius: '3px',
                background:   'rgba(255,255,255,0.08)',
                overflow:     'hidden',
              }}
            >
              <motion.div
                style={{
                  height:       '100%',
                  width:        `${progressPct}%`,
                  borderRadius: '3px',
                  background:   urgent
                    ? `linear-gradient(90deg, ${C.danger}, #FF8C99)`
                    : `linear-gradient(90deg, ${C.aqua}, #7AE8FF)`,
                  boxShadow:    urgent
                    ? `0 0 8px rgba(255,93,115,0.60)`
                    : `0 0 8px rgba(56,214,255,0.50)`,
                  transition:   'width 0.08s linear, background 0.3s ease, box-shadow 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Skip / Start button */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.04 }}
            onClick={handleSkip}
            style={{
              flexShrink:     0,
              height:         '44px',   /* minimum touch target */
              minWidth:       '44px',
              padding:        '0 16px',
              borderRadius:   '12px',
              display:        'flex',
              alignItems:     'center',
              gap:            '7px',
              cursor:         'pointer',
              background:     `linear-gradient(135deg, ${C.aqua}, #7AE8FF)`,
              border:         'none',
              boxShadow:      `0 0 18px rgba(56,214,255,0.45)`,
              whiteSpace:     'nowrap',
            }}
          >
            <Play size={14} fill="var(--color-carbon)" color="var(--color-carbon)" />
            <span
              style={{
                fontFamily:    C.fontImpact,
                fontSize:      '15px',
                color:         'var(--color-carbon)',
                letterSpacing: '0.08em',
              }}
            >
              START NOW
            </span>
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreMatchScreen;
