/**
 * Pre-Race Setup Screen — Biometric Check / Parameter Selection
 *
 * Layout spec (SWIM26 rebuild):
 *   [HEADER — 48px, flex-shrink 0]
 *   [CONTENT — flex-1, flex-row on desktop / flex-col on mobile, overflow hidden]
 *     LEFT  (flex 1.4) — param selection, internally scrollable
 *     RIGHT (flex 1)   — biometric card, not scrollable
 *   [FOOTER — 64px desktop / 128px mobile, flex-shrink 0]
 *
 * Mobile stacking: RIGHT panel moves to top as 80px horizontal strip.
 * The outer div is height:100% + overflow:hidden so nothing escapes OverlayShell.
 */

import React, { useEffect, useState } from 'react';
import { useIsLandscapeMobile } from '../../hooks/useIsLandscapeMobile';

// ─── Responsive hook (portrait-phone detection only) ─────────────────────────
// useIsLandscapeMobile (from the shared hook) handles landscape detection.
// This local helper stays only to detect portrait phone narrowness for the
// distance-grid column count — a different concern from landscape orientation.

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

// ─── Types & data ────────────────────────────────────────────────────────────

interface PreRaceSetupScreenProps {
  mode?: string;
  onConfirmRace?: () => void;
  onCancel?: () => void;
  onConfigChange?: (partial: { distance?: string; stroke?: string; venue?: string }) => void;
}

// Maps the Title-Case mode name GameShell passes to the PlayScreen accent colour
const MODE_ACCENT: Record<string, { hex: string; rgb: string }> = {
  'Quick Race':   { hex: '#00d4ff', rgb: '0,212,255'   },
  'Career Race':  { hex: '#f59e0b', rgb: '245,158,11'  },
  'Ranked Match': { hex: '#ef4444', rgb: '239,68,68'   },
  'Time Trial':   { hex: '#10b981', rgb: '16,185,129'  },
  'Relay Mode':   { hex: '#8b5cf6', rgb: '139,92,246'  },
  'Ghost Race':   { hex: '#e2e8f0', rgb: '226,232,240' },
};

const STATS = [
  { label: 'Kinetic Drive',    val: 18, max: 20, color: '#00d4ff' },
  { label: 'Fluid Efficiency', val: 17, max: 20, color: '#10b981' },
  { label: 'Power Matrix',     val: 19, max: 20, color: '#8b5cf6' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export const PreRaceSetupScreen: React.FC<PreRaceSetupScreenProps> = ({
  mode = 'Quick Race',
  onConfirmRace,
  onCancel,
  onConfigChange,
}) => {
  const [selectedDistance, setSelectedDistance] = useState('100M');
  const [selectedStroke,   setSelectedStroke]   = useState('FREESTYLE');
  const [selectedVenue,    setSelectedVenue]    = useState('olympic');
  const [isStarting,       setIsStarting]       = useState(false);

  // Landscape mobile (height ≤ 500px): compact header, hide non-essential items
  const isLandscape = useIsLandscapeMobile();
  // Portrait phone (≤480px): distance grid drops from 3 → 2 columns
  const isMobilePortrait = useMediaQuery('(max-width: 480px)');

  const distances = ['50M', '100M', '200M', '400M', '800M', '1500M'];
  const strokes   = ['FREESTYLE', 'BUTTERFLY', 'BREASTSTROKE', 'BACKSTROKE', 'IM'];
  const venues    = [
    { id: 'olympic',      name: 'Olympic Arena',     weather: 'Clear'  },
    { id: 'training',     name: 'Training Facility', weather: 'Indoor' },
    { id: 'championship', name: 'Championship Pool', weather: 'Clear'  },
    { id: 'neon',         name: 'Neon District',     weather: 'Night'  },
  ];

  const accent = MODE_ACCENT[mode] ?? MODE_ACCENT['Quick Race'];

  const handleConfirm = () => {
    if (isStarting) return;
    setIsStarting(true);
    // 850ms: scanlines animation plays for ~800ms before transitioning
    setTimeout(() => onConfirmRace?.(), 850);
  };

  // ── Shared button factory (distance / stroke) ──────────────────────────
  const paramBtn = (
    label: string,
    isSelected: boolean,
    onClick: () => void,
  ) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        height: '44px',
        borderRadius: '8px',
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 700,
        fontSize: '15px',
        letterSpacing: '2px',
        textTransform: 'uppercase' as const,
        border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.15)',
        background: isSelected
          ? accent.hex
          : 'rgba(255,255,255,0.05)',
        color: isSelected ? '#000' : 'rgba(255,255,255,0.70)',
        cursor: 'pointer',
        transition: 'all 0.12s ease',
      }}
    >
      {label}
    </button>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'var(--color-bg-deep)',
        position: 'relative',
      }}
    >
      {/* Noise grain + underwater ambient */}
      <div className="screen-noise" aria-hidden />
      <div className="screen-ambient" aria-hidden />

      {/* Scanlines launch effect — visible for 850ms while isStarting is true */}
      {isStarting && <div className="scanlines-launch" aria-hidden />}

      {/* ── HEADER — 48px ────────────────────────────────────────────────── */}
      <header
        style={{
          flexShrink: 0,
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(5,11,20,0.90)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          gap: '0',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, rgba(${accent.rgb},0.65) 40%, rgba(${accent.rgb},0.65) 60%, transparent)`,
          }}
        />

        {/* ← Back button */}
        <button
          data-testid="pre-race-abort"
          onClick={onCancel}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 14px',
            height: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.50)',
            fontSize: '10px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            whiteSpace: 'nowrap',
            transition: 'color 0.12s ease',
            borderRight: '1px solid rgba(255,255,255,0.06)',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.50)')}
        >
          <span style={{ fontSize: '14px', lineHeight: 1 }}>‹</span>
          <span className="hidden sm:inline">Back to Modes</span>
        </button>

        {/* Centre — radar label */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            overflow: 'hidden',
          }}
        >
          <span style={{ fontSize: '11px', lineHeight: 1, flexShrink: 0 }}>📡</span>
          <span
            className="hidden sm:inline"
            style={{
              fontSize: '9px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.30em',
              color: `rgba(${accent.rgb},0.80)`,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Pre-Flight Biometric Check In-Progress
          </span>
          <span
            className="sm:hidden"
            style={{
              fontSize: '9px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.20em',
              color: `rgba(${accent.rgb},0.80)`,
            }}
          >
            {mode}
          </span>
        </div>

        {/* Right — SECTOR / STABILITY tabs — hidden in landscape to save horizontal space */}
        <div
          style={{
            flexShrink: 0,
            display: isLandscape ? 'none' : 'flex',
            alignItems: 'center',
            height: '100%',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              height: '100%',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1px',
            }}
          >
            <span
              style={{
                fontSize: '7px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'rgba(255,255,255,0.38)',
              }}
            >
              Sector
            </span>
            <span
              className="font-bebas"
              style={{
                fontSize: '14px',
                lineHeight: 1,
                color: accent.hex,
                filter: `drop-shadow(0 0 4px rgba(${accent.rgb},0.7))`,
              }}
            >
              Circuit A-1
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1px',
            }}
          >
            <span
              style={{
                fontSize: '7px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'rgba(255,255,255,0.38)',
              }}
            >
              Stability
            </span>
            <span
              className="font-bebas"
              style={{
                fontSize: '14px',
                lineHeight: 1,
                color: '#f59e0b',
                filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.7))',
              }}
            >
              Nominal
            </span>
          </div>
        </div>
      </header>

      {/* ── CONTENT AREA — fills remaining height ────────────────────────── */}
      {/*
        Desktop (md+):   flex-row  — LEFT (flex 1.4) | RIGHT (flex 1)
        Mobile:          flex-col  — RIGHT (80px strip, order-first) | LEFT (flex-1 scroll)
      */}
      <div
        className="flex-1 flex flex-col sm:flex-row overflow-hidden"
      >

        {/* ── RIGHT PANEL — Biometric card ──────────────────────────────── */}
        {/*
          Mobile (< sm/640px): order-first, height 80px, horizontal strip
          sm+ (landscape phone, tablet, desktop): order-last, full-height card
        */}
        <div
          className="order-first sm:order-last sm:overflow-hidden"
          style={{ flexShrink: 0 }}
        >
          {/* ─ Mobile strip (hidden on sm+, i.e. landscape phones ≥640px wide) ─ */}
          <div
            className="flex sm:hidden items-center gap-3 px-4"
            style={{
              height: isLandscape ? '60px' : '80px',
              background: '#0d1929',
              borderBottom: '1px solid rgba(0,212,255,0.18)',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                flexShrink: 0,
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: `2px solid ${accent.hex}`,
                background: `rgba(${accent.rgb},0.12)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                lineHeight: 1,
                boxShadow: `0 0 12px rgba(${accent.rgb},0.35)`,
              }}
            >
              MP
            </div>
            {/* Name + label */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.35em',
                  color: `rgba(${accent.rgb},0.80)`,
                  marginBottom: '2px',
                }}
              >
                Elite Operator
              </div>
              <div
                className="font-bebas"
                style={{
                  fontSize: '22px',
                  lineHeight: 1,
                  color: '#F3FBFF',
                  textTransform: 'uppercase',
                }}
              >
                M. Phiri
              </div>
            </div>
            {/* Quick stat */}
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <div style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>Kinetic Drive</div>
              <div className="font-bebas" style={{ fontSize: '20px', lineHeight: 1, color: accent.hex }}>18 / 20</div>
            </div>
          </div>

          {/* ─ Side-by-side biometric card (hidden on portrait phones, visible sm+) ─ */}
          <div
            className="hidden sm:flex flex-col h-full"
            style={{
              flex: '1 0 0',
              width: '280px',
              minWidth: '240px',
              maxWidth: '340px',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0,212,255,0.25) transparent',
            }}
          >
            <div
              style={{
                margin: '16px',
                borderRadius: '12px',
                background: '#0d1929',
                border: '1px solid rgba(0,212,255,0.20)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      borderRadius: '50%',
                      background: `rgba(${accent.rgb},0.15)`,
                      filter: 'blur(8px)',
                    }}
                  />
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      border: `2px solid ${accent.hex}`,
                      background: `rgba(${accent.rgb},0.12)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 900,
                      color: accent.hex,
                      letterSpacing: '1px',
                      position: 'relative',
                      boxShadow: `0 0 16px rgba(${accent.rgb},0.40)`,
                    }}
                  >
                    MP
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.40em',
                      color: accent.hex,
                      marginBottom: '3px',
                    }}
                  >
                    Elite Operator
                  </div>
                  <div
                    className="font-bebas"
                    style={{
                      fontSize: '28px',
                      lineHeight: 1,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#F3FBFF',
                    }}
                  >
                    M. Phiri
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

              {/* Stat rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.20em',
                          color: 'rgba(255,255,255,0.45)',
                        }}
                      >
                        {stat.label}
                      </span>
                      <span
                        style={{
                          fontSize: '20px',
                          fontWeight: 700,
                          color: '#F3FBFF',
                          lineHeight: 1,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {stat.val}
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                          {' '}/ {stat.max}
                        </span>
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div
                      style={{
                        height: '4px',
                        borderRadius: '2px',
                        background: 'rgba(255,255,255,0.07)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        className="stat-bar-fill"
                        style={{
                          height: '100%',
                          width: `${(stat.val / stat.max) * 100}%`,
                          background: stat.color,
                          borderRadius: '2px',
                          boxShadow: `0 0 8px ${stat.color}`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Reward forecast */}
              <div
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.18)',
                }}
              >
                <div style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.30em', color: 'rgba(245,158,11,0.70)', marginBottom: '3px' }}>
                  Reward Forecast
                </div>
                <div
                  className="font-bebas"
                  style={{ fontSize: '18px', color: '#f59e0b', lineHeight: 1, filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.5))' }}
                >
                  800 XP + 2.5K Coins
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── LEFT PANEL — Parameter selection (scrollable) ──────────────── */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            padding: '16px',
            scrollbarWidth: 'thin',
            scrollbarColor: `rgba(${accent.rgb},0.25) transparent`,
          }}
        >
          {/* PARAMETER 01 — Engagement Range (distance) */}
          <section style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.35em',
                  color: `rgba(${accent.rgb},0.75)`,
                }}
              >
                Parameter 01
              </span>
              <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span
                className="font-bebas"
                style={{ fontSize: '18px', color: '#F3FBFF', textTransform: 'uppercase', lineHeight: 1 }}
              >
                Engagement Range
              </span>
            </div>
            <div
              className="grid gap-2 swim26-param-grid-3"
              style={{ gridTemplateColumns: `repeat(${isMobilePortrait ? 2 : 3}, 1fr)` }}
            >
              {distances.map((dist) =>
                paramBtn(dist, selectedDistance === dist, () => {
                  setSelectedDistance(dist);
                  onConfigChange?.({ distance: dist });
                }),
              )}
            </div>
          </section>

          {/* PARAMETER 02 — Kinetic Pattern (stroke) */}
          <section style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.35em',
                  color: `rgba(${accent.rgb},0.75)`,
                }}
              >
                Parameter 02
              </span>
              <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span
                className="font-bebas"
                style={{ fontSize: '18px', color: '#F3FBFF', textTransform: 'uppercase', lineHeight: 1 }}
              >
                Kinetic Pattern
              </span>
            </div>
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
            >
              {strokes.map((stroke) =>
                paramBtn(stroke, selectedStroke === stroke, () => {
                  setSelectedStroke(stroke);
                  onConfigChange?.({ stroke });
                }),
              )}
            </div>
          </section>

          {/* PARAMETER 03 — Vector Coordinates (venue) */}
          <section style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.35em',
                  color: `rgba(${accent.rgb},0.75)`,
                }}
              >
                Parameter 03
              </span>
              <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span
                className="font-bebas"
                style={{ fontSize: '18px', color: '#F3FBFF', textTransform: 'uppercase', lineHeight: 1 }}
              >
                Vector Coordinates
              </span>
            </div>
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
            >
              {venues.map((venue) => (
                <button
                  key={venue.id}
                  onClick={() => {
                    setSelectedVenue(venue.id);
                    onConfigChange?.({ venue: venue.id });
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    border: selectedVenue === venue.id
                      ? `1px solid rgba(${accent.rgb},0.55)`
                      : '1px solid rgba(255,255,255,0.10)',
                    background: selectedVenue === venue.id
                      ? `rgba(${accent.rgb},0.10)`
                      : 'rgba(255,255,255,0.03)',
                    transition: 'all 0.12s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {selectedVenue === venue.id && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0, top: 0, bottom: 0,
                        width: '3px',
                        background: accent.hex,
                        borderRadius: '8px 0 0 8px',
                      }}
                    />
                  )}
                  <div
                    style={{
                      fontSize: '8px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.25em',
                      color: selectedVenue === venue.id ? `rgba(${accent.rgb},0.75)` : 'rgba(255,255,255,0.30)',
                      marginBottom: '2px',
                    }}
                  >
                    {venue.weather}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: selectedVenue === venue.id ? '#F3FBFF' : 'rgba(255,255,255,0.60)',
                    }}
                  >
                    {venue.name}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ── FOOTER CTA BAR ────────────────────────────────────────────────── */}
      {/*
        Desktop:  height 64px, flex-row, ABORT left (flex 0.4), INITIATE right (flex 0.6)
        Mobile:   height 128px, flex-col, both full-width
      */}
      <footer
        className="flex-shrink-0 flex flex-col sm:flex-row items-stretch gap-2 px-3"
        style={{
          background: 'rgba(0,0,0,0.60)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          /* 128px on mobile (two buttons × ~56px + gap + padding), 64px on desktop */
          padding: '10px 12px',
        }}
      >
        {/* CLOSE / ABORT — outline, red on hover */}
        <button
          onClick={onCancel}
          disabled={isStarting}
          className="sm:flex-none"
          style={{
            height: '44px',
            minWidth: '120px',
            borderRadius: '8px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.18)',
            color: 'rgba(255,255,255,0.55)',
            fontSize: '11px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.12s ease',
            whiteSpace: 'nowrap',
            opacity: isStarting ? 0.4 : 1,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#ef4444';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.50)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
          }}
        >
          <span style={{ fontSize: '13px', lineHeight: 1 }}>✕</span>
          Close / Abort
        </button>

        {/* INITIATE KINETIC RUN — primary CTA */}
        <button
          data-testid="pre-race-start"
          onClick={handleConfirm}
          disabled={isStarting}
          className="flex-1"
          style={{
            height: '44px',
            borderRadius: '8px',
            background: isStarting ? `rgba(${accent.rgb},0.60)` : accent.hex,
            border: 'none',
            color: '#000',
            fontSize: '13px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.20em',
            cursor: isStarting ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.12s ease',
            whiteSpace: 'nowrap',
            boxShadow: isStarting
              ? 'none'
              : `0 0 24px rgba(${accent.rgb},0.45), 0 4px 12px rgba(0,0,0,0.40)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Laser-scan shimmer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)',
              transform: 'translateX(-100%)',
              animation: isStarting ? 'none' : undefined,
              transition: 'transform 1s ease',
            }}
            className="group-hover:translate-x-full"
          />

          {isStarting ? (
            <>
              <span>Synchronizing…</span>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid rgba(0,0,0,0.30)',
                  borderTopColor: '#000',
                  animation: 'spin 0.7s linear infinite',
                }}
              />
            </>
          ) : (
            <>
              <span>Initiate Kinetic Run</span>
              <span style={{ fontSize: '16px', lineHeight: 1 }}>🚀</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
};

export default PreRaceSetupScreen;
