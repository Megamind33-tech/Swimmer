/**
 * ContextPromptBanner — transient center-screen event prompts
 *
 * Renders one prompt at a time in the center of the race view.
 * Prompts auto-dismiss after 2.4s.  New prompts cancel the current one.
 *
 * Phase 7 prompt types and visual identity:
 *   PERFECT_START  — gold  ⚡  "PERFECT START"    elapsed 2.5–4s
 *   CLEAN_TURN     — green ↩  "CLEAN TURN"       good wall hit (rhythm > 55)
 *   EARLY_TURN     — amber ⚠  "EARLY TURN"       poor timing (rhythm ≤ 55)
 *   FINAL_25M      — red   🏊  "FINAL 25M"        last 25m of race
 *   NEW_PB         — green 🏆  "NEW PERSONAL BEST"
 *   LANE_ADVANCE   — gold  ⬆  "LANE ADVANCE"     position improved
 *   PHOTO_FINISH   — red   📸  "PHOTO FINISH!"    top-2 in final metres
 *
 * Architecture:
 *   - Component receives the currently active PromptEvent | null
 *   - AnimatePresence handles enter/exit animation
 *   - Parent (HUDRoot) manages queue and timing via useContextPrompts hook
 *
 * Center-screen guarantee:
 *   - No persistent UI in this zone (only this component mounts here)
 *   - Pointer-events disabled so it never blocks the race
 */

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HUD_COLOR, HUD_FONT } from '../hudTokens';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type PromptType =
  | 'PERFECT_START'
  | 'CLEAN_TURN'
  | 'EARLY_TURN'
  | 'FINAL_25M'
  | 'NEW_PB'
  | 'LANE_ADVANCE'
  | 'PHOTO_FINISH';

export interface PromptEvent {
  id:   string;
  type: PromptType;
}

// ─────────────────────────────────────────────────────────────────────────────
// Prompt visual config
// ─────────────────────────────────────────────────────────────────────────────

interface PromptConfig {
  label:     string;
  subLabel?: string;
  icon:      string;
  color:     string;
  glow:      string;
  bg:        string;
  border:    string;
}

const PROMPT_CONFIG: Record<PromptType, PromptConfig> = {
  PERFECT_START: {
    label:    'PERFECT START',
    subLabel: 'MAXIMUM MOMENTUM',
    icon:     '⚡',
    color:    HUD_COLOR.gold,
    glow:     HUD_COLOR.goldGlow,
    bg:       'rgba(255,215,106,0.10)',
    border:   'rgba(255,215,106,0.35)',
  },
  CLEAN_TURN: {
    label:    'CLEAN TURN',
    subLabel: 'GOOD MOMENTUM',
    icon:     '↩',
    color:    HUD_COLOR.success,
    glow:     HUD_COLOR.successGlow,
    bg:       'rgba(55,226,141,0.08)',
    border:   'rgba(55,226,141,0.30)',
  },
  EARLY_TURN: {
    label:    'EARLY TURN',
    subLabel: 'ADJUST TIMING',
    icon:     '⚠',
    color:    HUD_COLOR.warning,
    glow:     HUD_COLOR.warningGlow,
    bg:       'rgba(255,194,71,0.08)',
    border:   'rgba(255,194,71,0.30)',
  },
  FINAL_25M: {
    label:    'FINAL 25M',
    subLabel: 'EVERYTHING NOW',
    icon:     '🏊',
    color:    HUD_COLOR.danger,
    glow:     HUD_COLOR.dangerGlow,
    bg:       'rgba(255,93,115,0.12)',
    border:   'rgba(255,93,115,0.40)',
  },
  NEW_PB: {
    label:    'NEW PERSONAL BEST',
    icon:     '🏆',
    color:    HUD_COLOR.success,
    glow:     HUD_COLOR.successGlow,
    bg:       'rgba(55,226,141,0.10)',
    border:   'rgba(55,226,141,0.35)',
  },
  LANE_ADVANCE: {
    label:    'LANE ADVANCE',
    subLabel: 'MOVING UP',
    icon:     '⬆',
    color:    HUD_COLOR.gold,
    glow:     HUD_COLOR.goldGlow,
    bg:       'rgba(255,215,106,0.10)',
    border:   'rgba(255,215,106,0.35)',
  },
  PHOTO_FINISH: {
    label:    'PHOTO FINISH',
    subLabel: 'EVERYTHING COUNTS',
    icon:     '📸',
    color:    HUD_COLOR.danger,
    glow:     HUD_COLOR.dangerGlow,
    bg:       'rgba(255,93,115,0.10)',
    border:   'rgba(255,93,115,0.35)',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ContextPromptBanner
// ─────────────────────────────────────────────────────────────────────────────

interface ContextPromptBannerProps {
  prompt: PromptEvent | null;
}

export const ContextPromptBanner: React.FC<ContextPromptBannerProps> = ({ prompt }) => {
  const cfg = prompt ? PROMPT_CONFIG[prompt.type] : null;

  return (
    <div
      style={{
        position:      'absolute',
        top:           '28%',
        left:          '50%',
        transform:     'translateX(-50%)',
        pointerEvents: 'none',
        zIndex:        60,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
      }}
    >
      <AnimatePresence mode="wait">
        {prompt && cfg && (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, scale: 0.72, y: -8 }}
            animate={{ opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.22, ease: [0.0, 0.7, 0.2, 1.0] } }}
            exit={{    opacity: 0, scale: 0.88,  y: 8,  transition: { duration: 0.28, ease: 'easeIn' } }}
            style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            '4px',
              padding:        '10px 24px 10px',
              borderRadius:   '14px',
              background:     cfg.bg,
              border:         `1px solid ${cfg.border}`,
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow:      `0 0 32px ${cfg.glow}, 0 4px 24px rgba(0,0,0,0.5)`,
              whiteSpace:     'nowrap',
            }}
          >
            {/* Icon + label row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px', lineHeight: 1 }}>{cfg.icon}</span>
              <span
                style={{
                  fontFamily:    HUD_FONT.impact,
                  fontSize:      '32px',
                  lineHeight:    1,
                  letterSpacing: '0.04em',
                  color:         cfg.color,
                  textShadow:    `0 0 16px ${cfg.glow}, 0 0 32px ${cfg.glow}`,
                }}
              >
                {cfg.label}
              </span>
            </div>

            {/* Sub label (optional) */}
            {cfg.subLabel && (
              <span
                style={{
                  fontFamily:    HUD_FONT.label,
                  fontWeight:    700,
                  fontSize:      '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color:         cfg.color,
                  opacity:       0.7,
                }}
              >
                {cfg.subLabel}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// useContextPrompts — hook for managing prompt queue and timing
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react';

const PROMPT_DURATION_MS = 2400;
const POOL_LENGTH_M      = 50;   // Olympic pool lap distance

/**
 * useContextPrompts — swimming race event detector
 *
 * Performance: uses latestRef pattern + stable 4Hz setInterval.
 * Only `fire` (stable useCallback) is in the effect deps.
 *
 * Phase 7 events:
 *   PERFECT_START  — strong start window (elapsed 2.5–4s)
 *   CLEAN_TURN     — good wall hit (rhythm > 55 at each 50m wall)
 *   EARLY_TURN     — poor wall timing (rhythm ≤ 55 at each 50m wall)
 *   FINAL_25M      — within last 25m of the race
 *   NEW_PB         — in 1st place after 5s elapsed
 *   LANE_ADVANCE   — position number improved since last poll
 *   PHOTO_FINISH   — top 2, within last 3% of race
 */
export function useContextPrompts(
  elapsedMs:      number,
  position:       number,
  distanceM:      number,
  totalDistanceM: number,
  stamina:        number,
  rhythm:         number,
) {
  const [activePrompt, setActivePrompt] = useState<PromptEvent | null>(null);
  const firedRef       = useRef<Set<string>>(new Set());
  const timerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWallsRef   = useRef<number>(0);     // walls crossed so far
  const lastPositionRef = useRef<number>(position); // for lane advance detection

  // Keep the latest race values accessible without re-creating the interval
  // Lazy-initialize to avoid object allocation on every render
  const latestRef = useRef<{
    elapsedMs:      number;
    position:       number;
    distanceM:      number;
    totalDistanceM: number;
    stamina:        number;
    rhythm:         number;
  } | null>(null);

  if (!latestRef.current) {
    latestRef.current = { elapsedMs, position, distanceM, totalDistanceM, stamina, rhythm };
  } else {
    // Directly mutate the ref object to avoid repeated object allocations on every render
    latestRef.current.elapsedMs      = elapsedMs;
    latestRef.current.position       = position;
    latestRef.current.distanceM      = distanceM;
    latestRef.current.totalDistanceM = totalDistanceM;
    latestRef.current.stamina        = stamina;
    latestRef.current.rhythm         = rhythm;
  }

  const fire = useCallback((type: PromptType) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const event: PromptEvent = { id: `${type}_${Date.now()}`, type };
    setActivePrompt(event);
    timerRef.current = setTimeout(() => setActivePrompt(null), PROMPT_DURATION_MS);
  }, []);

  // Poll at 4Hz — decoupled from render frequency
  useEffect(() => {
    const id = setInterval(() => {
      if (!latestRef.current) return;
      const { elapsedMs, position, distanceM, totalDistanceM, rhythm } = latestRef.current;
      const progress = totalDistanceM > 0 ? distanceM / totalDistanceM : 0;
      const fired    = firedRef.current;

      // ── PERFECT START (2.5–4s window) ──────────────────────────────────
      if (elapsedMs > 2500 && elapsedMs < 4000 && !fired.has('start')) {
        fired.add('start');
        fire('PERFECT_START');
      }

      // ── TURN DETECTION (every POOL_LENGTH_M wall, excluding finish) ────
      // Count how many pool-length walls the swimmer has crossed.
      const wallsCrossed = Math.floor(distanceM / POOL_LENGTH_M);
      if (wallsCrossed > lastWallsRef.current) {
        // Check each new wall crossed this tick (normally just 1)
        for (let w = lastWallsRef.current + 1; w <= wallsCrossed; w++) {
          const wallDistM = w * POOL_LENGTH_M;
          // Don't fire a turn prompt for the finish line
          if (wallDistM < totalDistanceM) {
            const key = `turn_${w}`;
            if (!fired.has(key)) {
              fired.add(key);
              // Rhythm > 55 = CLEAN_TURN, otherwise EARLY_TURN
              if (rhythm > 55) {
                fire('CLEAN_TURN');
              } else {
                fire('EARLY_TURN');
              }
            }
          }
        }
        lastWallsRef.current = wallsCrossed;
      }

      // ── FINAL 25M ─────────────────────────────────────────────────────
      const final25Progress = totalDistanceM > 0
        ? Math.max(0, (totalDistanceM - 25) / totalDistanceM)
        : 0.75;
      if (progress >= final25Progress && !fired.has('final25m')) {
        fired.add('final25m');
        fire('FINAL_25M');
      }

      // ── PHOTO FINISH (top 2, final 3%) ─────────────────────────────────
      if (progress > 0.97 && position <= 2 && !fired.has('photo')) {
        fired.add('photo');
        fire('PHOTO_FINISH');
      }

      // ── NEW PB (in 1st after 5s) ────────────────────────────────────────
      if (position === 1 && elapsedMs > 5000 && !fired.has('pb')) {
        fired.add('pb');
        fire('NEW_PB');
      }

      // ── LANE ADVANCE (position improved) ───────────────────────────────
      const lastPos = lastPositionRef.current;
      if (position < lastPos && elapsedMs > 4000) {
        const key = `advance_${position}`;
        if (!fired.has(key)) {
          fired.add(key);
          fire('LANE_ADVANCE');
        }
      }
      lastPositionRef.current = position;

    }, 250); // 4Hz poll

    return () => {
      clearInterval(id);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fire]); // only `fire` (stable useCallback) in deps

  return activePrompt;
}
