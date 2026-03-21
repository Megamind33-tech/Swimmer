/**
 * PaneSwitcher — landscape-mobile pane navigation
 *
 * When the viewport is too short to show a multi-column layout side-by-side
 * (landscape phone, height ≤ 500 px), this component renders a row of
 * game-style tab buttons at the top and shows one pane at a time.
 *
 * On taller viewports the component renders nothing and the caller's normal
 * multi-column JSX is displayed via `children`.
 *
 * Usage:
 *   <PaneSwitcher panes={[
 *     { id: 'overview', label: 'OVERVIEW', icon: <ShieldIcon size={12} />, content: <LeftColumn /> },
 *     { id: 'lineup',   label: 'LINEUP',   icon: <FlagIcon size={12} />,   content: <RightColumn /> },
 *   ]}>
 *     {/* normal multi-column JSX shown when NOT landscape-mobile *\/}
 *     <OriginalTwoColumnLayout />
 *   </PaneSwitcher>
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ── hook ─────────────────────────────────────────────────────────────────────

export function useIsLandscapeMobile(): boolean {
  const [v, setV] = useState(
    () => window.innerHeight <= 500 && window.innerWidth > window.innerHeight,
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-height: 500px) and (orientation: landscape)');
    const handler = (e: MediaQueryListEvent) => setV(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return v;
}

// ── types ─────────────────────────────────────────────────────────────────────

export interface Pane {
  id: string;
  /** Short ALL-CAPS label shown on the tab button */
  label: string;
  /** Small icon (16 × 16) rendered inside the tab button */
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface PaneSwitcherProps {
  panes: Pane[];
  /** Normal multi-column JSX shown when the screen is not landscape-mobile */
  children: React.ReactNode;
  /** Initial pane id (defaults to first pane) */
  defaultPane?: string;
}

// ── Tab button ────────────────────────────────────────────────────────────────

const VOLT = 'var(--color-volt, #CCFF00)';
const PANEL_BG = 'rgba(4,20,33,0.88)';
const PANEL_BORDER = 'rgba(56,214,255,0.14)';

function TabBtn({
  pane,
  isActive,
  onClick,
}: {
  pane: Pane;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        height: '100%',
        border: 'none',
        background: isActive ? 'rgba(204,255,0,0.10)' : 'transparent',
        borderBottom: isActive ? `2px solid ${VOLT}` : '2px solid transparent',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        padding: '0 4px',
        transition: 'background 0.14s, border-color 0.14s',
        position: 'relative',
      }}
      aria-pressed={isActive}
      aria-label={pane.label}
    >
      {pane.icon && (
        <span
          style={{
            color: isActive ? VOLT : 'rgba(169,211,231,0.50)',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.14s',
          }}
        >
          {pane.icon}
        </span>
      )}
      <span
        style={{
          fontFamily: "'Bebas Neue', 'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: '11px',
          letterSpacing: '0.12em',
          color: isActive ? '#F3FBFF' : 'rgba(169,211,231,0.45)',
          transition: 'color 0.14s',
          lineHeight: 1,
        }}
      >
        {pane.label}
      </span>
    </motion.button>
  );
}

// ── PaneSwitcher ──────────────────────────────────────────────────────────────

export function PaneSwitcher({ panes, children, defaultPane }: PaneSwitcherProps) {
  const isLandscape = useIsLandscapeMobile();
  const [activeId, setActiveId] = useState(defaultPane ?? panes[0]?.id ?? '');
  const [direction, setDirection] = useState<1 | -1>(1);

  const activeIdx = panes.findIndex(p => p.id === activeId);

  const goTo = useCallback(
    (id: string) => {
      const nextIdx = panes.findIndex(p => p.id === id);
      setDirection(nextIdx >= activeIdx ? 1 : -1);
      setActiveId(id);
    },
    [panes, activeIdx],
  );

  const goPrev = () => {
    if (activeIdx > 0) goTo(panes[activeIdx - 1].id);
  };
  const goNext = () => {
    if (activeIdx < panes.length - 1) goTo(panes[activeIdx + 1].id);
  };

  // Normal viewport → show caller's layout unchanged
  if (!isLandscape) return <>{children}</>;

  const active = panes[activeIdx];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Tab bar ── */}
      <div
        style={{
          height: '34px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'stretch',
          background: PANEL_BG,
          borderBottom: `1px solid ${PANEL_BORDER}`,
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          position: 'relative',
        }}
      >
        {/* Prev arrow */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={goPrev}
          disabled={activeIdx === 0}
          style={{
            width: '28px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            borderRight: `1px solid ${PANEL_BORDER}`,
            cursor: activeIdx === 0 ? 'not-allowed' : 'pointer',
            opacity: activeIdx === 0 ? 0.25 : 1,
            color: 'rgba(169,211,231,0.70)',
          }}
          aria-label="Previous section"
        >
          <ChevronLeft size={14} />
        </motion.button>

        {/* Tab buttons */}
        {panes.map(pane => (
          <TabBtn
            key={pane.id}
            pane={pane}
            isActive={pane.id === activeId}
            onClick={() => goTo(pane.id)}
          />
        ))}

        {/* Next arrow */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={goNext}
          disabled={activeIdx === panes.length - 1}
          style={{
            width: '28px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            borderLeft: `1px solid ${PANEL_BORDER}`,
            cursor: activeIdx === panes.length - 1 ? 'not-allowed' : 'pointer',
            opacity: activeIdx === panes.length - 1 ? 0.25 : 1,
            color: 'rgba(169,211,231,0.70)',
          }}
          aria-label="Next section"
        >
          <ChevronRight size={14} />
        </motion.button>

        {/* Pane counter dot row */}
        <div
          style={{
            position: 'absolute',
            bottom: '3px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '4px',
            pointerEvents: 'none',
          }}
        >
          {panes.map((p, i) => (
            <span
              key={p.id}
              style={{
                width: i === activeIdx ? '12px' : '4px',
                height: '2px',
                borderRadius: '2px',
                background: i === activeIdx ? VOLT : 'rgba(169,211,231,0.25)',
                transition: 'width 0.2s, background 0.2s',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Pane content ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeId}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {active?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
