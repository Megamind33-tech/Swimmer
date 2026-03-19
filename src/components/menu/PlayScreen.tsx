/**
 * Play Screen — Game Mode Selection  (SWIM26 rebuild)
 *
 * Mobile responsiveness:
 *   - Portrait phone (≤480px): 1-column grid, cards 80px tall,
 *     condensed layout: [Icon] [Title] [Rewards] in one row
 *   - Landscape phone (≤896px landscape): 2-column grid, cards 110px,
 *     full description visible
 *   - Tablet / desktop: auto-fit 3-column grid, cards 160px, full layout
 *   - Touch devices: hover states suppressed via (hover: none) + isTouch flag
 */

import React, { useEffect, useState } from 'react';

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

// ─── Data ────────────────────────────────────────────────────────────────────

interface GameModeCard {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  tier: 'ROOKIE' | 'COMPETITOR' | 'ELITE';
  rewards: { xp: number; coins: number };
  playerCount?: string;
  accent: string;
  accentRgb: string;
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

  // Responsive breakpoints
  const isMobilePortrait  = useMediaQuery('(max-width: 480px)');
  const isMobileLandscape = useMediaQuery('(max-width: 896px) and (orientation: landscape)');
  // On touch-only devices, suppress hover lift so cards don't stick in hover state
  const isTouch = useMediaQuery('(hover: none)');

  const handleSelect = (modeId: string) => {
    if (activatingId) return;
    setActivatingId(modeId);
    setTimeout(() => {
      setActivatingId(null);
      onModeSelect?.(modeId);
    }, 320);
  };

  // Derived grid geometry
  const gridCols = isMobilePortrait
    ? '1fr'
    : isMobileLandscape
      ? 'repeat(2, 1fr)'
      : 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))';

  const gridGap = isMobilePortrait || isMobileLandscape ? '8px' : '12px';

  const cardMinHeight = isMobilePortrait
    ? '80px'
    : isMobileLandscape
      ? '110px'
      : '160px';

  const cardPadding = isMobilePortrait
    ? '0 8px 0 12px'
    : isMobileLandscape
      ? '10px 12px 10px 16px'
      : '16px 16px 12px 20px';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #050B14 0%, #080F1C 100%)',
        position: 'relative',
      }}
    >
      {/* Ambient blobs */}
      <div className="caustic-blob caustic-blob-1" />
      <div className="caustic-blob caustic-blob-2" />
      <div className="caustic-blob caustic-blob-3" />

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header
        style={{
          flexShrink: 0,
          position: 'relative',
          padding: isMobilePortrait ? '12px 16px 10px' : '20px 24px 16px',
          background: 'linear-gradient(180deg, rgba(0,212,255,0.07) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.65) 40%, rgba(0,212,255,0.65) 60%, transparent)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div
              style={{
                fontSize: '9px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.45em',
                color: 'rgba(0,212,255,0.75)',
                marginBottom: '2px',
              }}
            >
              Arena Selection
            </div>
            <h1
              className="font-bebas"
              style={{
                fontSize: isMobilePortrait ? '32px' : 'clamp(36px, 8vw, 60px)',
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

          {/* Live badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 8px',
              borderRadius: '6px',
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.22)',
              flexShrink: 0,
              marginBottom: '2px',
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
                flexShrink: 0,
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
              {isMobilePortrait ? '24.7K' : '24.7K Online'}
            </span>
          </div>
        </div>
      </header>

      {/* ── Scrollable grid ───────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobilePortrait ? '10px' : '16px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,212,255,0.25) transparent',
        }}
      >
        <div
          className="swim26-mode-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gap: gridGap,
          }}
        >
          {MODES.map((mode) => {
            const isHovered    = !isTouch && hoveredId    === mode.id;
            const isPressed    = pressedId    === mode.id;
            const isActivating = activatingId === mode.id;
            const tier         = TIER_COLORS[mode.tier];

            let transform = 'translateY(0) scale(1)';
            if (isPressed || isActivating) transform = 'scale(0.97)';
            else if (isHovered)            transform = 'translateY(-2px)';

            const borderOpacity = isHovered || isActivating ? 0.80 : 0.28;
            const boxShadow = isHovered || isActivating
              ? `0 8px 32px rgba(${mode.accentRgb},0.30), 0 4px 16px rgba(0,0,0,0.60)`
              : '0 4px 20px rgba(0,0,0,0.50)';

            return (
              <button
                key={mode.id}
                className="swim26-mode-card"
                onClick={() => handleSelect(mode.id)}
                onMouseEnter={() => { if (!isTouch) setHoveredId(mode.id); }}
                onMouseLeave={() => { setHoveredId(null); setPressedId(null); }}
                onMouseDown={() => setPressedId(mode.id)}
                onMouseUp={() => setPressedId(null)}
                onTouchStart={() => setPressedId(mode.id)}
                onTouchEnd={() => setPressedId(null)}
                disabled={!!activatingId}
                style={{
                  position: 'relative',
                  textAlign: 'left',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  minHeight: cardMinHeight,
                  background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo}), rgba(10,22,40,0.72)`,
                  border: `${isHovered || isActivating ? '2px' : '1px'} solid rgba(${mode.accentRgb},${borderOpacity})`,
                  boxShadow,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  transform,
                  transition: 'all 0.15s ease',
                  cursor: activatingId ? 'default' : 'pointer',
                  padding: 0,
                  /* Ensure minimum 44px tap target height */
                  minWidth: '44px',
                }}
              >
                {/* Speed-line overlay */}
                <div
                  className="speed-lines"
                  style={{ position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none' }}
                />

                {/* Left accent bar */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: '4px',
                    background: `linear-gradient(180deg, rgba(${mode.accentRgb},0.95) 0%, rgba(${mode.accentRgb},0.35) 100%)`,
                    borderRadius: '12px 0 0 12px',
                  }}
                />

                {/* ── PORTRAIT COMPACT LAYOUT: [Icon] [Title] [Rewards] one row ── */}
                {isMobilePortrait ? (
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      padding: '0 12px 0 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      minHeight: '80px',
                    }}
                  >
                    {/* Icon */}
                    <span
                      style={{
                        fontSize: '22px',
                        lineHeight: 1,
                        flexShrink: 0,
                        filter: `drop-shadow(0 0 6px rgba(${mode.accentRgb},0.50))`,
                      }}
                    >
                      {mode.icon}
                    </span>

                    {/* Title */}
                    <h3
                      className="font-bebas"
                      style={{
                        margin: 0,
                        fontSize: '20px',
                        lineHeight: 1,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        color: '#F3FBFF',
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {mode.name}
                    </h3>

                    {/* Rewards — compact */}
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 900,
                          color: '#f59e0b',
                          whiteSpace: 'nowrap',
                          textShadow: '0 0 8px rgba(245,158,11,0.5)',
                        }}
                      >
                        {mode.rewards.xp} XP
                      </div>
                      <div
                        style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          color: 'rgba(255,255,255,0.40)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {mode.rewards.coins.toLocaleString()} cr
                      </div>
                    </div>

                    {/* Tier badge */}
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: '7px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: tier.text,
                        background: tier.bg,
                        border: `1px solid ${tier.border}`,
                        borderRadius: '999px',
                        padding: '2px 6px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {mode.tier}
                    </span>
                  </div>
                ) : (
                  /* ── FULL CARD LAYOUT (landscape / tablet / desktop) ── */
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      padding: cardPadding,
                    }}
                  >
                    {/* Top row: category + tier */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: isMobileLandscape ? '6px' : '10px',
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
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {mode.tier}
                      </span>
                    </div>

                    {/* Icon + Title */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: isMobileLandscape ? '4px' : '8px',
                      }}
                    >
                      <div
                        style={{
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: isMobileLandscape ? '36px' : '44px',
                          height: isMobileLandscape ? '36px' : '44px',
                          borderRadius: '10px',
                          background: `rgba(${mode.accentRgb},0.12)`,
                          border: `1px solid rgba(${mode.accentRgb},0.28)`,
                          fontSize: isMobileLandscape ? '18px' : '22px',
                          lineHeight: 1,
                        }}
                      >
                        {mode.icon}
                      </div>

                      <h3
                        className="font-bebas"
                        style={{
                          margin: 0,
                          fontSize: isMobileLandscape ? '18px' : 'clamp(18px, 3.5vw, 24px)',
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

                    {/* Description — hidden on landscape mobile to save height */}
                    {!isMobileLandscape && (
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
                    )}

                    {/* Rewards + live players */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {mode.rewards.xp} XP · {mode.rewards.coins.toLocaleString()} Coins
                        </div>
                      </div>

                      {mode.playerCount && !isMobileLandscape && (
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

                      {/* Chevron — desktop hover only */}
                      {isHovered && (
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
                            color: `rgba(${mode.accentRgb},0.9)`,
                            fontSize: '16px',
                            lineHeight: 1,
                          }}
                        >
                          ›
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Activating flash */}
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
