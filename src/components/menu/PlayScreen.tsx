/**
 * Play Screen — Game Mode Selection  (SWIM26 rebuild)
 *
 * Fixes:
 *  1. No Material Icons font — inline emoji icons per spec
 *  2. Responsive CSS Grid: 3-col desktop / 2-col tablet+mobile-landscape / 1-col portrait
 *  3. Full hover + active transform states via React state
 *  4. Height-locked: header fixed, grid scrollable inside remaining viewport
 */

import React, { useState } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

interface GameModeCard {
  id: string;
  name: string;
  /** Shown top-left as category label */
  category: string;
  description: string;
  /** Inline emoji — no icon font required */
  icon: string;
  /** Tier badge top-right */
  tier: 'ROOKIE' | 'COMPETITOR' | 'ELITE';
  rewards: { xp: number; coins: number };
  /** Online player count, omit for solo modes */
  playerCount?: string;
  accent: string;       // hex
  accentRgb: string;    // "R,G,B" for rgba()
  gradientFrom: string;
  gradientTo: string;
}

const TIER_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  ROOKIE:     { text: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.30)' },
  COMPETITOR: { text: '#00d4ff', bg: 'rgba(0,212,255,0.12)',   border: 'rgba(0,212,255,0.30)'  },
  ELITE:      { text: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.30)'  },
};

const MODES: GameModeCard[] = [
  {
    id: 'quick-race',
    name: 'Quick Race',
    category: 'Instant Match',
    description: 'Jump straight into a race. Auto-matched opponents, fast setup.',
    icon: '⚡',
    tier: 'COMPETITOR',
    rewards: { xp: 100, coins: 500 },
    playerCount: '4.2K',
    accent: '#00d4ff',
    accentRgb: '0,212,255',
    gradientFrom: 'rgba(0,212,255,0.13)',
    gradientTo: 'rgba(0,60,80,0.15)',
  },
  {
    id: 'career-race',
    name: 'Career Race',
    category: 'Legacy Mode',
    description: 'Advance through your swimming career. Contracts, sponsors, championships.',
    icon: '🏊',
    tier: 'ELITE',
    rewards: { xp: 250, coins: 2000 },
    accent: '#f59e0b',
    accentRgb: '245,158,11',
    gradientFrom: 'rgba(245,158,11,0.13)',
    gradientTo: 'rgba(100,60,0,0.15)',
  },
  {
    id: 'ranked-match',
    name: 'Ranked Match',
    category: 'Competitive',
    description: 'Fight for global rank. Every millisecond counts. Season leaderboards.',
    icon: '🏆',
    tier: 'ELITE',
    rewards: { xp: 300, coins: 3000 },
    playerCount: '12.5K',
    accent: '#ef4444',
    accentRgb: '239,68,68',
    gradientFrom: 'rgba(239,68,68,0.13)',
    gradientTo: 'rgba(100,0,0,0.15)',
  },
  {
    id: 'time-trial',
    name: 'Time Trial',
    category: 'Solo Sprint',
    description: 'Race the clock. Beat your personal best and set world records.',
    icon: '⏱',
    tier: 'ROOKIE',
    rewards: { xp: 150, coins: 1000 },
    accent: '#10b981',
    accentRgb: '16,185,129',
    gradientFrom: 'rgba(16,185,129,0.13)',
    gradientTo: 'rgba(0,50,30,0.15)',
  },
  {
    id: 'relay-mode',
    name: 'Relay Mode',
    category: 'Team Race',
    description: 'Synchronise with your squad. Hand off the baton, dominate as a team.',
    icon: '👥',
    tier: 'COMPETITOR',
    rewards: { xp: 400, coins: 4000 },
    playerCount: '8.3K',
    accent: '#8b5cf6',
    accentRgb: '139,92,246',
    gradientFrom: 'rgba(139,92,246,0.13)',
    gradientTo: 'rgba(60,0,100,0.15)',
  },
  {
    id: 'ghost-race',
    name: 'Ghost Race',
    category: 'Time Warp',
    description: 'Race a ghost of your past self. Track every split. Train smarter.',
    icon: '👻',
    tier: 'ROOKIE',
    rewards: { xp: 50, coins: 250 },
    accent: '#e2e8f0',
    accentRgb: '226,232,240',
    gradientFrom: 'rgba(226,232,240,0.08)',
    gradientTo: 'rgba(15,23,42,0.20)',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

interface PlayScreenProps {
  onModeSelect?: (modeId: string) => void;
}

export const PlayScreen: React.FC<PlayScreenProps> = ({ onModeSelect }) => {
  const [hoveredId,    setHoveredId]    = useState<string | null>(null);
  const [pressedId,    setPressedId]    = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const handleSelect = (modeId: string) => {
    if (activatingId) return;
    setActivatingId(modeId);
    setTimeout(() => {
      setActivatingId(null);
      onModeSelect?.(modeId);
    }, 320);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',          // height-locked to parent
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #050B14 0%, #080F1C 100%)',
        position: 'relative',
      }}
    >
      {/* Ambient blobs */}
      <div className="caustic-blob caustic-blob-1" />
      <div className="caustic-blob caustic-blob-2" />
      <div className="caustic-blob caustic-blob-3" />

      {/* ── Header (flex-shrink: 0 — never scrolls) ─────────────────────── */}
      <header
        style={{
          flexShrink: 0,
          position: 'relative',
          padding: '20px 24px 16px',
          background: 'linear-gradient(180deg, rgba(0,212,255,0.07) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.65) 40%, rgba(0,212,255,0.65) 60%, transparent)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
          {/* Left: logo + title */}
          <div>
            <div
              style={{
                fontSize: '9px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.45em',
                color: 'rgba(0,212,255,0.75)',
                marginBottom: '4px',
              }}
            >
              Arena Selection
            </div>
            <h1
              className="font-bebas"
              style={{
                fontSize: 'clamp(36px, 8vw, 60px)',
                lineHeight: 1,
                color: '#F3FBFF',
                letterSpacing: '-0.01em',
                margin: 0,
              }}
            >
              Game{' '}
              <span className="text-glow" style={{ color: '#00d4ff' }}>
                Modes
              </span>
            </h1>
          </div>

          {/* Right: live badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: '6px',
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.22)',
              marginBottom: '2px',
              flexShrink: 0,
            }}
          >
            <span
              className="animate-pulse"
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#00d4ff',
                boxShadow: '0 0 6px rgba(0,212,255,0.9)',
              }}
            />
            <span
              style={{
                fontSize: '9px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'rgba(0,212,255,0.9)',
                whiteSpace: 'nowrap',
              }}
            >
              24.7K Online
            </span>
          </div>
        </div>
      </header>

      {/* ── Scrollable grid area ─────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          /* Custom scrollbar */
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,212,255,0.25) transparent',
        }}
      >
        {/*
          Grid rules (inline style + className for media-query breakpoints):
          - Default (mobile portrait): 1 column
          - ≥640px (landscape / tablet): 2 columns
          - ≥1024px (desktop): 3 columns
          CSS auto-fit minmax handles this gracefully.
        */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '12px',
          }}
        >
          {MODES.map((mode) => {
            const isHovered    = hoveredId    === mode.id;
            const isPressed    = pressedId    === mode.id;
            const isActivating = activatingId === mode.id;
            const tier         = TIER_COLORS[mode.tier];

            // Derived transform/shadow
            let transform = 'translateY(0) scale(1)';
            if (isPressed || isActivating) transform = 'scale(0.98)';
            else if (isHovered)            transform = 'translateY(-2px)';

            const borderOpacity = isHovered || isActivating ? 0.80 : 0.28;
            const boxShadow = isHovered || isActivating
              ? `0 8px 32px rgba(${mode.accentRgb},0.30), 0 4px 16px rgba(0,0,0,0.60)`
              : '0 4px 20px rgba(0,0,0,0.50)';

            return (
              <button
                key={mode.id}
                onClick={() => handleSelect(mode.id)}
                onMouseEnter={() => setHoveredId(mode.id)}
                onMouseLeave={() => { setHoveredId(null); setPressedId(null); }}
                onMouseDown={() => setPressedId(mode.id)}
                onMouseUp={() => setPressedId(null)}
                onTouchStart={() => setPressedId(mode.id)}
                onTouchEnd={() => { setPressedId(null); }}
                disabled={!!activatingId}
                style={{
                  position: 'relative',
                  textAlign: 'left',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  minHeight: '160px',
                  background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo}), rgba(10,22,40,0.72)`,
                  border: `${isHovered || isActivating ? '2px' : '1px'} solid rgba(${mode.accentRgb},${borderOpacity})`,
                  boxShadow,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  transform,
                  transition: 'all 0.15s ease',
                  cursor: activatingId ? 'default' : 'pointer',
                  padding: 0,
                }}
              >
                {/* Speed-line overlay */}
                <div
                  className="speed-lines"
                  style={{
                    position: 'absolute', inset: 0,
                    opacity: 0.25, pointerEvents: 'none',
                  }}
                />

                {/* Hover glow sweep */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute', inset: 0,
                      background: `radial-gradient(ellipse at 20% 50%, rgba(${mode.accentRgb},0.12) 0%, transparent 65%)`,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Left accent bar (4px, full height) */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: '4px',
                    background: `linear-gradient(180deg, rgba(${mode.accentRgb},0.95) 0%, rgba(${mode.accentRgb},0.35) 100%)`,
                    borderRadius: '12px 0 0 12px',
                  }}
                />

                {/* Card body */}
                <div style={{ position: 'relative', zIndex: 1, padding: '16px 16px 12px 20px' }}>

                  {/* Top row: category label (left) + tier badge (right) */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.35em',
                        color: `rgba(${mode.accentRgb},0.65)`,
                      }}
                    >
                      {mode.category}
                    </span>

                    {/* Tier badge — pill style */}
                    <span
                      style={{
                        fontSize: '8px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        color: tier.text,
                        background: tier.bg,
                        border: `1px solid ${tier.border}`,
                        borderRadius: '999px',
                        padding: '2px 8px',
                      }}
                    >
                      {mode.tier}
                    </span>
                  </div>

                  {/* Icon + Title row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    {/* Emoji icon */}
                    <div
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: `rgba(${mode.accentRgb},0.12)`,
                        border: `1px solid rgba(${mode.accentRgb},0.28)`,
                        fontSize: '22px',
                        lineHeight: 1,
                        boxShadow: isHovered ? `0 0 14px rgba(${mode.accentRgb},0.35)` : undefined,
                        transition: 'box-shadow 0.15s ease',
                      }}
                    >
                      {mode.icon}
                    </div>

                    {/* Mode title */}
                    <h3
                      className="font-bebas"
                      style={{
                        margin: 0,
                        fontSize: 'clamp(18px, 3.5vw, 24px)',
                        lineHeight: 1,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        color: '#F3FBFF',
                        textShadow: isHovered ? `0 0 12px rgba(${mode.accentRgb},0.50)` : undefined,
                        transition: 'text-shadow 0.15s ease',
                      }}
                    >
                      {mode.name}
                    </h3>
                  </div>

                  {/* Description (max 2 lines) */}
                  <p
                    style={{
                      margin: '0 0 12px',
                      fontSize: '13px',
                      lineHeight: '1.4',
                      color: 'rgba(255,255,255,0.72)',
                      fontWeight: 500,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {mode.description}
                  </p>

                  {/* Rewards + live players footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    {/* XP + Coins */}
                    <div>
                      <div
                        style={{
                          fontSize: '7px',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          letterSpacing: '0.35em',
                          color: 'rgba(255,255,255,0.32)',
                          marginBottom: '2px',
                        }}
                      >
                        Rewards
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 900,
                          fontStyle: 'italic',
                          textTransform: 'uppercase',
                          color: '#f59e0b',
                          textShadow: '0 0 8px rgba(245,158,11,0.5)',
                        }}
                      >
                        {mode.rewards.xp} XP · {mode.rewards.coins.toLocaleString()} Coins
                      </div>
                    </div>

                    {/* Live players */}
                    {mode.playerCount && (
                      <>
                        <div
                          style={{
                            width: '1px',
                            height: '24px',
                            background: 'rgba(255,255,255,0.08)',
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontSize: '7px',
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              letterSpacing: '0.35em',
                              color: 'rgba(255,255,255,0.32)',
                              marginBottom: '2px',
                            }}
                          >
                            Live
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span
                              className="animate-pulse"
                              style={{
                                display: 'inline-block',
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: '#10b981',
                                boxShadow: '0 0 4px rgba(16,185,129,0.9)',
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 900,
                                color: 'rgba(255,255,255,0.82)',
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              {mode.playerCount}
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Chevron (right-flush) */}
                    <div
                      style={{
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        background: `rgba(${mode.accentRgb},0.10)`,
                        border: `1px solid rgba(${mode.accentRgb},0.22)`,
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'translateX(0)' : 'translateX(-4px)',
                        transition: 'opacity 0.15s ease, transform 0.15s ease',
                        color: `rgba(${mode.accentRgb},0.9)`,
                        fontSize: '16px',
                        lineHeight: 1,
                      }}
                    >
                      ›
                    </div>
                  </div>
                </div>

                {/* Activating flash overlay */}
                {isActivating && (
                  <div
                    style={{
                      position: 'absolute', inset: 0,
                      borderRadius: '12px',
                      background: `rgba(${mode.accentRgb},0.10)`,
                      animation: 'pulse 0.32s ease-out',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayScreen;
