/**
 * SplitFlash — transient split-time notification
 *
 * Appears briefly when the swimmer passes a split checkpoint (25%, 50%, 75%).
 * Shows the distance label and elapsed time at that point.
 * Auto-dismissed by the parent after 3 seconds.
 *
 * Positioned above the bottom controls zone, below center prompts.
 * Pointer-events disabled — never blocks race interaction.
 *
 * Visual identity: compact broadcast-ticker style (dark + aqua border),
 * distinct from the center event prompts (which are larger, more dramatic).
 */

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HUD_COLOR, HUD_FONT } from '../hudTokens';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SplitFlashData {
  id:    string;   // unique per flash (used as AnimatePresence key)
  label: string;   // "50M"
  time:  string;   // "00:27.41"
}

interface SplitFlashProps {
  split: SplitFlashData | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SplitFlash
// ─────────────────────────────────────────────────────────────────────────────

export const SplitFlash: React.FC<SplitFlashProps> = ({ split }) => (
  <div
    style={{
      position:      'absolute',
      bottom:        '120px',
      left:          '50%',
      transform:     'translateX(-50%)',
      pointerEvents: 'none',
      zIndex:        58,
    }}
  >
    <AnimatePresence mode="wait">
      {split && (
        <motion.div
          key={split.id}
          initial={{ opacity: 0, y: 10, scale: 0.88 }}
          animate={{ opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.18, ease: [0.0, 0.7, 0.2, 1.0] } }}
          exit={{    opacity: 0, y: -6, scale: 0.92, transition: { duration: 0.22, ease: 'easeIn' } }}
          style={{
            display:        'flex',
            alignItems:     'center',
            gap:            '10px',
            padding:        '6px 18px 7px',
            borderRadius:   '8px',
            background:     'rgba(4,20,33,0.86)',
            border:         '1px solid rgba(56,214,255,0.22)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            boxShadow:      '0 0 20px rgba(56,214,255,0.12), 0 2px 18px rgba(0,0,0,0.55)',
            whiteSpace:     'nowrap',
          }}
        >
          {/* Checkpoint label */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
            <span
              style={{
                fontFamily:    HUD_FONT.label,
                fontWeight:    700,
                fontSize:      '7px',
                letterSpacing: '0.16em',
                color:         HUD_COLOR.textMuted,
                textTransform: 'uppercase',
                lineHeight:    1,
              }}
            >
              SPLIT
            </span>
            <span
              style={{
                fontFamily:    HUD_FONT.impact,
                fontSize:      '16px',
                lineHeight:    1,
                color:         HUD_COLOR.aqua,
                letterSpacing: '0.04em',
                textShadow:    `0 0 8px ${HUD_COLOR.aquaGlow}`,
              }}
            >
              {split.label}
            </span>
          </div>

          {/* Vertical divider */}
          <div style={{ width: '1px', height: '20px', background: 'rgba(56,214,255,0.18)' }} />

          {/* Split time */}
          <span
            style={{
              fontFamily:         HUD_FONT.impact,
              fontSize:           '22px',
              lineHeight:         1,
              color:              HUD_COLOR.textPrimary,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing:      '0.03em',
            }}
          >
            {split.time}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
