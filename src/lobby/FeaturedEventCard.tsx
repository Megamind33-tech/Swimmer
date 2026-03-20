/**
 * FeaturedEventCard — premium glassmorphic event card for the lobby right panel
 *
 * Shows:
 *   - Event type badge (WORLD CUP, RANKED, etc.)
 *   - Event name in Bebas Neue
 *   - Live countdown timer (updates every second)
 *   - Reward summary
 *   - "JOIN NOW" CTA
 *
 * Design language: aquatic, zero SaaS aesthetics.
 * Fills 100% height of its container — parent controls sizing.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, TimerReset, Medal, MapPin } from 'lucide-react';
import { lobby } from '../theme/tokens';

// ─────────────────────────────────────────────────────────────────────────────
// Event data
// ─────────────────────────────────────────────────────────────────────────────

interface EventData {
  type:        string;
  name:        string;
  location:    string;
  endsAt:      Date;
  rewardLabel: string;
  participants: number;
  maxParticipants: number;
}

const FEATURED: EventData = {
  type:            'WORLD CUP',
  name:            'Berlin Grand Prix',
  location:        'Berlin, Germany',
  endsAt:          new Date(Date.now() + 2 * 3600_000 + 14 * 60_000 + 33_000),
  rewardLabel:     '× 500 GOLD',
  participants:    2847,
  maxParticipants: 5000,
};

// ─────────────────────────────────────────────────────────────────────────────
// Countdown hook
// ─────────────────────────────────────────────────────────────────────────────

function useCountdown(target: Date): string {
  const [display, setDisplay] = useState('');
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      const h    = Math.floor(diff / 3_600_000);
      const m    = Math.floor((diff % 3_600_000) / 60_000);
      const s    = Math.floor((diff % 60_000) / 1_000);
      setDisplay(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
      rafRef.current = window.setTimeout(tick, 1_000);
    };
    tick();
    return () => clearTimeout(rafRef.current);
  }, [target]);

  return display;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface FeaturedEventCardProps {
  onJoin?: () => void;
}

export const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({ onJoin }) => {
  const timeLeft  = useCountdown(FEATURED.endsAt);
  const fillPct   = Math.round((FEATURED.participants / FEATURED.maxParticipants) * 100);

  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      style={{
        width:           '100%',
        height:          '100%',
        borderRadius:    '14px',
        background:      'var(--lobby-bg-panel)',
        border:          `1px solid ${lobby.aquaBorder}`,
        backdropFilter:  'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        overflow:        'hidden',
        display:         'flex',
        flexDirection:   'column',
        position:        'relative',
        boxShadow:       '0 4px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Top accent stripe */}
      <div
        style={{
          height:     '3px',
          background: 'linear-gradient(90deg, var(--color-volt) 0%, var(--color-primary-dim) 55%, transparent 100%)',
          flexShrink: 0,
        }}
      />

      {/* Body */}
      <div
        style={{
          flex:          1,
          display:       'flex',
          flexDirection: 'column',
          gap:           '7px',
          padding:       '10px 12px 8px',
          minHeight:     0,
        }}
      >
        {/* Event type badge */}
        <div
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            '4px',
            padding:        '2px 8px',
            borderRadius:   '4px',
            background:     'rgba(204,255,0,0.10)',
            border:         '1px solid rgba(204,255,0,0.24)',
            color:          lobby.warning,
            fontFamily:     "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
            fontWeight:     700,
            fontSize:       '9px',
            letterSpacing:  '0.12em',
            textTransform:  'uppercase',
            alignSelf:      'flex-start',
          }}
        >
          ⭐ {FEATURED.type}
        </div>

        {/* Event name */}
        <div
          style={{
            fontFamily:    "'Bebas Neue', Impact, 'Arial Narrow', sans-serif",
            fontSize:      '24px',
            lineHeight:    1.0,
            color:         lobby.textPrimary,
            letterSpacing: '0.03em',
          }}
        >
          {FEATURED.name}
        </div>

        {/* Location */}
        <div
          style={{
            display:       'flex',
            alignItems:    'center',
            gap:           '4px',
            fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
            fontWeight:    600,
            fontSize:      '10px',
            color:         lobby.textSecondary,
            letterSpacing: '0.04em',
          }}
        >
          <MapPin size={10} />
          {FEATURED.location}
        </div>

        {/* Divider */}
        <div
          style={{
            height:     '1px',
            background: `rgba(204,255,0,0.10)`,
            flexShrink: 0,
          }}
        />

        {/* Countdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TimerReset size={11} color={lobby.textSecondary} />
          <span
            style={{
              fontFamily: "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
              fontWeight: 600,
              fontSize:   '10px',
              color:      lobby.textSecondary,
            }}
          >
            CLOSES IN
          </span>
          <span
            style={{
              fontFamily:         "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
              fontWeight:         700,
              fontSize:           '15px',
              color:              lobby.warning,
              fontVariantNumeric: 'tabular-nums',
              textShadow:         'none',
              letterSpacing:      '0.04em',
            }}
          >
            {timeLeft}
          </span>
        </div>

        {/* Reward */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Medal size={11} color={lobby.gold} />
          <span
            style={{
              fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
              fontWeight:    700,
              fontSize:      '11px',
              color:         lobby.gold,
              letterSpacing: '0.05em',
              textShadow:    'none',
            }}
          >
            {FEATURED.rewardLabel}
          </span>
        </div>

        {/* Participant fill bar */}
        <div>
          <div
            style={{
              display:        'flex',
              justifyContent: 'space-between',
              fontFamily:     "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
              fontSize:       '9px',
              fontWeight:     600,
              color:          'rgba(255,255,255,0.55)',
              marginBottom:   '4px',
              letterSpacing:  '0.04em',
            }}
          >
            <span>{FEATURED.participants.toLocaleString()} RACERS</span>
            <span>{fillPct}%</span>
          </div>
          <div
            style={{
              height:       '3px',
              borderRadius: '2px',
              background:   'rgba(255,255,255,0.08)',
              overflow:     'hidden',
            }}
          >
            <div
              style={{
                width:      `${fillPct}%`,
                height:     '100%',
                borderRadius: '2px',
                background: 'linear-gradient(90deg, var(--color-volt), var(--color-primary-dim))',
              }}
            />
          </div>
        </div>
      </div>

      {/* JOIN NOW button */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        whileHover={{ background: 'rgba(204,255,0,0.12)' }}
        onClick={onJoin}
        style={{
          margin:         '0 10px 10px',
          height:         '36px',
          borderRadius:   '8px',
          background:     'rgba(204,255,0,0.10)',
          border:         `1px solid rgba(204,255,0,0.28)`,
          color:          lobby.aqua,
          fontFamily:     "'Bebas Neue', Impact, 'Arial Narrow', sans-serif",
          fontSize:       '17px',
          letterSpacing:  '0.06em',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '3px',
          cursor:         'pointer',
          flexShrink:     0,
          transition:     'background 0.15s',
        }}
      >
        JOIN NOW <ChevronRight size={13} />
      </motion.button>
    </motion.div>
  );
};
