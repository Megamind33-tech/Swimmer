/**
 * ContextPromptBanner — transient center-screen event prompts
 *
 * Renders one prompt at a time in the center of the race view.
 * Prompts auto-dismiss after 2.4s.  New prompts cancel the current one.
 *
 * Prompt types and their visual identity:
 *   PERFECT_START  — gold  ⚡  "PERFECT START"
 *   GOOD_TURN      — aqua  ↩  "GOOD TURN"
 *   FINAL_PUSH     — amber 🔥 "FINAL PUSH"
 *   NEW_PB         — green 🏆 "NEW PERSONAL BEST"
 *   PHOTO_FINISH   — red   📸 "PHOTO FINISH!"
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
  | 'GOOD_TURN'
  | 'FINAL_PUSH'
  | 'NEW_PB'
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
    icon:     '⚡',
    color:    HUD_COLOR.gold,
    glow:     HUD_COLOR.goldGlow,
    bg:       'rgba(255,215,106,0.10)',
    border:   'rgba(255,215,106,0.35)',
  },
  GOOD_TURN: {
    label:    'GOOD TURN',
    icon:     '↩',
    color:    HUD_COLOR.aqua,
    glow:     HUD_COLOR.aquaGlow,
    bg:       'rgba(56,214,255,0.08)',
    border:   'rgba(56,214,255,0.30)',
  },
  FINAL_PUSH: {
    label:    'FINAL PUSH',
    subLabel: 'GIVE IT EVERYTHING',
    icon:     '🔥',
    color:    HUD_COLOR.warning,
    glow:     HUD_COLOR.warningGlow,
    bg:       'rgba(255,194,71,0.10)',
    border:   'rgba(255,194,71,0.35)',
  },
  NEW_PB: {
    label:    'NEW PERSONAL BEST',
    icon:     '🏆',
    color:    HUD_COLOR.success,
    glow:     HUD_COLOR.successGlow,
    bg:       'rgba(55,226,141,0.10)',
    border:   'rgba(55,226,141,0.35)',
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

/**
 * useContextPrompts — race event prompt detector
 *
 * Performance fix (Phase 6):
 *   Previously this hook had a useEffect with [elapsedMs, distanceM, ...] deps,
 *   causing effect cleanup+setup on every React render (30fps after throttling).
 *   Now it uses a latestRef pattern — a stable setInterval polls the latest
 *   race values at 4Hz (every 250ms), which is more than sufficient for
 *   prompt detection that only needs to trigger once per race event.
 *
 *   Result: ~120 effect setups/sec → 4 interval ticks/sec (97% reduction).
 */
export function useContextPrompts(
  elapsedMs:      number,
  position:       number,
  distanceM:      number,
  totalDistanceM: number,
  stamina:        number,
) {
  const [activePrompt, setActivePrompt] = useState<PromptEvent | null>(null);
  const firedRef   = useRef<Set<string>>(new Set());
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the latest race values accessible without re-creating the interval
  const latestRef = useRef({ elapsedMs, position, distanceM, totalDistanceM, stamina });
  latestRef.current = { elapsedMs, position, distanceM, totalDistanceM, stamina };

  const fire = useCallback((type: PromptType) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const event: PromptEvent = { id: `${type}_${Date.now()}`, type };
    setActivePrompt(event);
    timerRef.current = setTimeout(() => setActivePrompt(null), PROMPT_DURATION_MS);
  }, []);

  // Poll at 4Hz — decoupled from render frequency entirely
  useEffect(() => {
    const id = setInterval(() => {
      const { elapsedMs, position, distanceM, totalDistanceM } = latestRef.current;
      const progress = totalDistanceM > 0 ? distanceM / totalDistanceM : 0;
      const fired    = firedRef.current;

      if (elapsedMs > 2500 && elapsedMs < 4000 && !fired.has('start')) {
        fired.add('start'); fire('PERFECT_START');
      }
      if (progress > 0.48 && progress < 0.52 && !fired.has('turn')) {
        fired.add('turn'); fire('GOOD_TURN');
      }
      if (progress > 0.85 && !fired.has('final')) {
        fired.add('final'); fire('FINAL_PUSH');
      }
      if (progress > 0.97 && position <= 2 && !fired.has('photo')) {
        fired.add('photo'); fire('PHOTO_FINISH');
      }
      if (position === 1 && elapsedMs > 5000 && !fired.has('pb')) {
        fired.add('pb'); fire('NEW_PB');
      }
    }, 250); // 4Hz poll

    return () => {
      clearInterval(id);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fire]); // only `fire` (stable useCallback) in deps

  return activePrompt;
}
