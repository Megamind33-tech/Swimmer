/**
 * Play Screen — Game Mode Selection
 * AAA sports-game broadcast aesthetic: large mode cards, neon accents,
 * aqua/cyan color system, proper glassmorphism.
 */

import React, { useState } from 'react';
import { getDifficultyColor, getDifficultyBadgeIcon } from '../../utils/difficultyUtils';

interface GameModeCard {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  rewards: { xp: number; coins: number };
  playerCount?: string;
  accentRgb: string;   // RGB values for glow/border effects
  gradientFrom: string;
  gradientTo: string;
}

interface PlayScreenProps {
  onModeSelect?: (modeId: string) => void;
}

const GameModes: GameModeCard[] = [
  {
    id: 'quick-race',
    name: 'Quick Race',
    tagline: 'Instant Match',
    description: 'Jump straight into a race. Auto-matched opponents, fast setup.',
    icon: 'play_arrow',
    difficulty: 'NORMAL',
    rewards: { xp: 100, coins: 500 },
    playerCount: '4.2K',
    accentRgb: '0,229,255',
    gradientFrom: 'rgba(0,229,255,0.12)',
    gradientTo: 'rgba(0,100,140,0.06)',
  },
  {
    id: 'career-race',
    name: 'Career Race',
    tagline: 'Legacy Mode',
    description: 'Advance through your swimming career. Contracts, sponsors, championships.',
    icon: 'emoji_events',
    difficulty: 'HARD',
    rewards: { xp: 250, coins: 2000 },
    accentRgb: '212,168,67',
    gradientFrom: 'rgba(212,168,67,0.12)',
    gradientTo: 'rgba(100,70,0,0.06)',
  },
  {
    id: 'ranked-match',
    name: 'Ranked Match',
    tagline: 'Competitive',
    description: 'Fight for global rank. Every millisecond counts. Season leaderboards.',
    icon: 'leaderboard',
    difficulty: 'HARD',
    rewards: { xp: 300, coins: 3000 },
    playerCount: '12.5K',
    accentRgb: '239,68,68',
    gradientFrom: 'rgba(239,68,68,0.12)',
    gradientTo: 'rgba(100,0,0,0.06)',
  },
  {
    id: 'time-trial',
    name: 'Time Trial',
    tagline: 'Solo Sprint',
    description: 'Race the clock. Beat your personal best and set world records.',
    icon: 'timer',
    difficulty: 'NORMAL',
    rewards: { xp: 150, coins: 1000 },
    accentRgb: '34,197,94',
    gradientFrom: 'rgba(34,197,94,0.12)',
    gradientTo: 'rgba(0,60,20,0.06)',
  },
  {
    id: 'relay-mode',
    name: 'Relay Mode',
    tagline: 'Team Race',
    description: 'Synchronise with your squad. Hand off the baton, dominate as a team.',
    icon: 'groups',
    difficulty: 'HARD',
    rewards: { xp: 400, coins: 4000 },
    playerCount: '8.3K',
    accentRgb: '168,85,247',
    gradientFrom: 'rgba(168,85,247,0.12)',
    gradientTo: 'rgba(60,0,100,0.06)',
  },
  {
    id: 'ghost-race',
    name: 'Ghost Race',
    tagline: 'Time Warp',
    description: 'Race a ghost of your past self. Track every split. Train smarter.',
    icon: 'history',
    difficulty: 'EASY',
    rewards: { xp: 50, coins: 250 },
    accentRgb: '148,163,184',
    gradientFrom: 'rgba(148,163,184,0.10)',
    gradientTo: 'rgba(30,41,59,0.06)',
  },
];

const DIFF_LABELS: Record<string, { label: string; color: string }> = {
  EASY:   { label: 'Rookie',       color: 'rgba(34,197,94,0.9)' },
  NORMAL: { label: 'Competitor',   color: 'rgba(0,229,255,0.9)' },
  HARD:   { label: 'Elite',        color: 'rgba(239,68,68,0.9)' },
};

export const PlayScreen: React.FC<PlayScreenProps> = ({ onModeSelect }) => {
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const handleSelect = (modeId: string) => {
    if (activatingId) return;
    setActivatingId(modeId);
    setTimeout(() => {
      setActivatingId(null);
      onModeSelect?.(modeId);
    }, 380);
  };

  return (
    <div
      className="hydro-page-shell flex flex-col w-full h-full overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #050B14 0%, #080F1C 100%)' }}
    >
      {/* Ambient caustic blobs */}
      <div className="caustic-blob caustic-blob-1" />
      <div className="caustic-blob caustic-blob-2" />
      <div className="caustic-blob caustic-blob-3" />

      {/* ── Cinematic Header ─────────────────────────────────────────────── */}
      <div
        className="relative flex-shrink-0 px-6 pt-7 pb-6 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(0,229,255,0.06) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.6) 40%, rgba(0,229,255,0.6) 60%, transparent)' }}
        />

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="h-px flex-1 max-w-[32px]"
            style={{ background: 'rgba(0,229,255,0.4)' }}
          />
          <span
            className="text-[9px] font-black uppercase tracking-[0.45em]"
            style={{ color: 'rgba(0,229,255,0.8)' }}
          >
            Arena Selection
          </span>
          <div
            className="h-px flex-1 max-w-[32px]"
            style={{ background: 'rgba(0,229,255,0.4)' }}
          />
        </div>

        {/* Title */}
        <h1
          className="font-bebas uppercase leading-none mb-1"
          style={{
            fontSize: 'clamp(48px, 10vw, 72px)',
            color: '#F3FBFF',
            letterSpacing: '-0.01em',
          }}
        >
          Game{' '}
          <span
            className="text-glow"
            style={{ color: '#00E5FF' }}
          >
            Modes
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-xs font-bold uppercase tracking-[0.22em]"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          Select your discipline to begin the circuit
        </p>

        {/* Live player count badge */}
        <div
          className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded"
          style={{
            background: 'rgba(0,229,255,0.08)',
            border: '1px solid rgba(0,229,255,0.20)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#00E5FF', boxShadow: '0 0 6px rgba(0,229,255,0.9)' }}
          />
          <span
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: 'rgba(0,229,255,0.9)' }}
          >
            24.7K Swimmers Online
          </span>
        </div>
      </div>

      {/* ── Mode Cards Grid ──────────────────────────────────────────────── */}
      <div className="flex-1 px-4 py-5 grid grid-cols-1 gap-4 auto-rows-max pb-8"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))' }}
      >
        {GameModes.map((mode, index) => {
          const isActivating = activatingId === mode.id;
          const diff = DIFF_LABELS[mode.difficulty];

          return (
            <button
              key={mode.id}
              onClick={() => handleSelect(mode.id)}
              disabled={!!activatingId}
              className="group relative text-left overflow-hidden transition-all duration-300"
              style={{
                minHeight: '140px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${mode.gradientFrom}, ${mode.gradientTo}), rgba(10,22,40,0.70)`,
                border: isActivating
                  ? `1px solid rgba(${mode.accentRgb},0.80)`
                  : `1px solid rgba(${mode.accentRgb},0.22)`,
                boxShadow: isActivating
                  ? `0 0 24px rgba(${mode.accentRgb},0.35), 0 4px 32px rgba(0,0,0,0.60)`
                  : '0 4px 24px rgba(0,0,0,0.50)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transform: isActivating ? 'scale(0.975)' : undefined,
              }}
            >
              {/* Speed-line texture overlay */}
              <div className="absolute inset-0 speed-lines opacity-30 pointer-events-none" />

              {/* Hover glow sweep */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at 20% 50%, rgba(${mode.accentRgb},0.10) 0%, transparent 65%)`,
                }}
              />

              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] transition-opacity duration-300"
                style={{
                  background: `linear-gradient(180deg, rgba(${mode.accentRgb},0.9) 0%, rgba(${mode.accentRgb},0.3) 100%)`,
                  opacity: isActivating ? 1 : 0.5,
                }}
              />

              {/* Card body */}
              <div className="relative flex items-center gap-4 px-5 py-4 z-10">

                {/* Icon */}
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-xl transition-all duration-300"
                  style={{
                    width: '52px',
                    height: '52px',
                    background: `rgba(${mode.accentRgb},0.12)`,
                    border: `1px solid rgba(${mode.accentRgb},0.30)`,
                    boxShadow: isActivating ? `0 0 16px rgba(${mode.accentRgb},0.40)` : undefined,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '26px',
                      color: `rgba(${mode.accentRgb},1)`,
                      filter: `drop-shadow(0 0 6px rgba(${mode.accentRgb},0.6))`,
                    }}
                  >
                    {mode.icon}
                  </span>
                </div>

                {/* Text block */}
                <div className="flex-1 min-w-0">
                  {/* Tagline + difficulty */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[8px] font-black uppercase tracking-[0.35em]"
                      style={{ color: `rgba(${mode.accentRgb},0.75)` }}
                    >
                      {mode.tagline}
                    </span>
                    <div
                      className="h-px flex-1"
                      style={{ background: `rgba(${mode.accentRgb},0.15)` }}
                    />
                    <span
                      className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{
                        color: diff.color,
                        background: `rgba(${mode.accentRgb},0.10)`,
                        border: `1px solid rgba(${mode.accentRgb},0.20)`,
                      }}
                    >
                      {diff.label}
                    </span>
                  </div>

                  {/* Mode name */}
                  <h3
                    className="font-bebas uppercase leading-none mb-1.5 group-hover:text-glow transition-all duration-300"
                    style={{
                      fontSize: 'clamp(22px, 4vw, 28px)',
                      color: '#F3FBFF',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {mode.name}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.50)', fontWeight: 600 }}
                  >
                    {mode.description}
                  </p>
                </div>

                {/* Chevron */}
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{
                    width: '32px',
                    height: '32px',
                    background: `rgba(${mode.accentRgb},0.12)`,
                    border: `1px solid rgba(${mode.accentRgb},0.25)`,
                    transform: isActivating ? 'translateX(4px)' : undefined,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '18px', color: `rgba(${mode.accentRgb},0.9)` }}
                  >
                    chevron_right
                  </span>
                </div>
              </div>

              {/* Footer stats bar */}
              <div
                className="relative flex items-center gap-6 px-5 pb-4 z-10"
              >
                {/* Rewards */}
                <div className="flex items-center gap-3">
                  <div>
                    <div
                      className="text-[7px] font-black uppercase tracking-[0.35em] mb-0.5"
                      style={{ color: 'rgba(255,255,255,0.35)' }}
                    >
                      Rewards
                    </div>
                    <div
                      className="text-[10px] font-black italic slanted uppercase"
                      style={{ color: '#D4A843', textShadow: '0 0 8px rgba(212,168,67,0.5)' }}
                    >
                      {mode.rewards.xp} XP · {mode.rewards.coins.toLocaleString()} Coins
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {mode.playerCount && (
                  <>
                    <div
                      className="h-6 w-px"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    />
                    <div>
                      <div
                        className="text-[7px] font-black uppercase tracking-[0.35em] mb-0.5"
                        style={{ color: 'rgba(255,255,255,0.35)' }}
                      >
                        Live
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-1 h-1 rounded-full animate-pulse"
                          style={{
                            background: `rgba(${mode.accentRgb},1)`,
                            boxShadow: `0 0 4px rgba(${mode.accentRgb},1)`,
                          }}
                        />
                        <span
                          className="text-[10px] font-black"
                          style={{ color: 'rgba(255,255,255,0.80)', fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {mode.playerCount}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Activating overlay flash */}
              {isActivating && (
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background: `rgba(${mode.accentRgb},0.08)`,
                    animation: 'pulse 0.38s ease-out',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlayScreen;
