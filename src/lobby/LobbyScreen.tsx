/**
 * LobbyScreen — cinematic game lobby (Phase 2 entry experience)
 *
 * Replaces the old website-style HomePage as the default landing screen.
 *
 * Visual layers (back to front):
 *   1. Deep ocean radial gradient base (carbon → pool blue)
 *   2. Caustic light blob animation (three blobs, CSS keyframes)
 *   3. Subtle pool lane-line overlay (5 lines, 4% opacity)
 *   4. Edge vignette (radial darkening toward corners)
 *   5. Content split: LEFT (60%) hero + CTAs │ RIGHT (40%) FeaturedEventCard
 *
 * Layout contract:
 *   - Fills its parent container absolutely (parent handles top/bottom offset)
 *   - No scroll — everything must fit within the landscape viewport
 *   - Landscape mobile minimum: 375 × 667 px
 *
 * Anti-patterns:
 *   ✗ No SaaS card grids
 *   ✗ No hero marketing text
 *   ✗ No page scroll
 *   ✗ No generic web typography
 */

import React from 'react';
import { motion } from 'motion/react';
import { Play, Target, Medal } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './GameButtons';
import { FeaturedEventCard } from './FeaturedEventCard';
import { lobby } from '../theme/tokens';
import { USER_DATA } from '../utils/gameData';
import appSkinBackground from '../designs/app_skin/venue-skin.jpg';

interface LobbyScreenProps {
  /** Triggers the race flow (hands off to GameShell) */
  onStartRace: () => void;
  /** Navigate to a different lobby tab */
  onNavigate:  (tab: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Lane lines overlay — evokes a swimming pool without images
// ─────────────────────────────────────────────────────────────────────────────

const LaneLines: React.FC = () => (
  <div
    aria-hidden
    style={{
      position:      'absolute',
      inset:         0,
      pointerEvents: 'none',
      opacity:       0.04,
    }}
  >
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        style={{
          position:   'absolute',
          left:       0,
          right:      0,
          top:        `${(i + 1) * (100 / 6)}%`,
          height:     '1px',
          background: 'var(--lobby-venue-lane-lines)',
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Quick stat item
// ─────────────────────────────────────────────────────────────────────────────

interface StatItemProps {
  label: string;
  value: React.ReactNode;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <span
    style={{
      fontFamily: "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
      fontWeight: 600,
      fontSize:   '11px',
      color:      lobby.textSecondary,
    }}
  >
    {label}{' '}
    <span
      style={{
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {value}
    </span>
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// LobbyScreen
// ─────────────────────────────────────────────────────────────────────────────

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ onStartRace, onNavigate }) => (
  <div
    style={{
      position: 'absolute',
      inset:    0,
      overflow: 'hidden',
    }}
  >
    {/* App skin (venue photo) */}
    <img
      src={appSkinBackground}
      alt=""
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: 0.10,
        mixBlendMode: 'overlay',
        filter: 'saturate(0.9) contrast(1.05)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.40)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
    {/* ── BACKGROUND LAYER 1: ocean radial gradient ── */}
    <div
      aria-hidden
      style={{
        position:   'absolute',
        inset:      0,
        background: 'var(--lobby-venue-ocean-radial)',
      }}
    />

    {/* ── BACKGROUND LAYER 2: caustic light blobs ── */}
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="caustic-blob caustic-blob-1" />
      <div className="caustic-blob caustic-blob-2" />
      <div className="caustic-blob caustic-blob-3" />
    </div>

    {/* ── BACKGROUND LAYER 3: pool lane lines ── */}
    <LaneLines />

    {/* ── BACKGROUND LAYER 4: edge vignette ── */}
    <div
      aria-hidden
      style={{
        position:      'absolute',
        inset:         0,
        pointerEvents: 'none',
        background:    'var(--lobby-venue-vignette-radial)',
      }}
    />

    {/* ── CONTENT: left hero + right event card ── */}
    <div
      style={{
        position:   'relative',
        height:     '100%',
        display:    'flex',
        alignItems: 'center',
        padding:    '0 20px',
        gap:        '16px',
      }}
    >
      {/* ── LEFT SECTION (60%) ── */}
      <div
        style={{
          flex:          '1 1 0',
          minWidth:      0,
          display:       'flex',
          flexDirection: 'column',
          justifyContent:'center',
          gap:           '10px',
        }}
      >
        {/* Live season badge */}
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.38, delay: 0.08 }}
        >
          <span
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '6px',
              padding:       '3px 11px',
              borderRadius:  '100px',
                background:    'rgba(204,255,0,0.09)',
                border:        '1px solid rgba(204,255,0,0.28)',
              color:         lobby.aqua,
              fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
              fontWeight:    700,
              fontSize:      '10px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            {/* Green pulse dot */}
            <span
              style={{
                display:      'inline-block',
                width:        '6px',
                height:       '6px',
                borderRadius: '50%',
                background:   lobby.success,
                boxShadow:    'none',
                animation:    'countdown-pulse 1.8s ease-in-out infinite',
              }}
            />
            LIVE · SEASON 4
          </span>
        </motion.div>

        {/* Championship title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.14 }}
        >
          {/* SWIM 26 */}
          <div
            style={{
              fontFamily:    "'Bebas Neue', Impact, 'Arial Narrow', sans-serif",
              fontSize:      'clamp(34px, 6vw, 50px)',
              lineHeight:    0.88,
              letterSpacing: '0.02em',
              color:         lobby.textPrimary,
            }}
          >
            SWIM{' '}
            <span
              style={{
                color:      lobby.aqua,
                textShadow: 'none',
              }}
            >
              26
            </span>
          </div>

          {/* Series subtitle */}
          <div
            style={{
              fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
              fontWeight:    600,
              fontSize:      '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         lobby.textSecondary,
              marginTop:     '5px',
            }}
          >
            World Championship Series
          </div>
        </motion.div>

        {/* Separator */}
        <div
          style={{
            height:     '1px',
            background: 'linear-gradient(90deg, rgba(204,255,0,0.28) 0%, transparent 65%)',
          }}
        />

        {/* CTA buttons */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.20 }}
        >
          <PrimaryButton
            icon={<Play size={14} fill="currentColor" />}
            label="START RACE"
            onClick={onStartRace}
          />
          <SecondaryButton
            icon={<Target size={14} />}
            label="TRAINING"
            onClick={() => onNavigate('training')}
          />
        </motion.div>

        {/* Quick-access strip: Career + Rankings shortcuts */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.38, delay: 0.26 }}
        >
          <button
            onClick={() => onNavigate('career')}
            style={{
              display:       'flex',
              alignItems:    'center',
              gap:           '4px',
              padding:       '3px 9px',
              borderRadius:  '6px',
              background:    'rgba(204,255,0,0.08)',
              border:        '1px solid rgba(204,255,0,0.20)',
              color:         lobby.gold,
              fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
              fontWeight:    700,
              fontSize:      '10px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor:        'pointer',
            }}
          >
            <Medal size={10} /> CAREER
          </button>
        </motion.div>

        {/* Player quick stats */}
        <motion.div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '10px',
            flexWrap:   'wrap',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.38, delay: 0.32 }}
        >
          <StatItem
            label="OVR"
            value={<span style={{ color: lobby.aqua }}>94</span>}
          />
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>·</span>
          <StatItem
            label="W/L"
            value={
              <>
                <span style={{ color: lobby.textPrimary }}>847</span>
                <span style={{ color: 'rgba(255,255,255,0.50)' }}>/231</span>
              </>
            }
          />
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>·</span>
          <StatItem
            label="RANK"
            value={
              <span
                style={{
                  color:      lobby.gold,
                  textShadow: 'none',
                }}
              >
                #{USER_DATA.level > 20 ? 4 : 12}
              </span>
            }
          />
        </motion.div>
      </div>

      {/* ── RIGHT SECTION (40%) — Featured Event Card ── */}
      <motion.div
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.38, delay: 0.22 }}
        style={{
          width:      '40%',
          flexShrink: 0,
          height:     '100%',
          paddingTop: '10px',
          paddingBottom: '10px',
        }}
      >
        <FeaturedEventCard onJoin={onStartRace} />
      </motion.div>
    </div>
  </div>
);
