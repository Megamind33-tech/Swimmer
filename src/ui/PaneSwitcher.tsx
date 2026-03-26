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
 *     { id: 'overview', label: 'OVERVIEW', icon: <ShieldIcon size={14} />, content: <LeftCol /> },
 *     { id: 'lineup',   label: 'LINEUP',   icon: <FlagIcon   size={14} />, content: <RightCol /> },
 *   ]}>
 *     <OriginalTwoColumnLayout />
 *   </PaneSwitcher>
 *
 * Phase 6 improvements:
 *   - Tab bar height: 34 → 44 px (meets TOUCH.minimum)
 *   - Prev/Next arrows: 28 → 44 px wide (meets TOUCH.minimum)
 *   - Visual hierarchy: active tabs have stronger contrast and larger font
 *   - Focus-visible rings on all interactive elements
 *   - Dot indicator moved so it does not overlap the tab buttons
 *   - Reduced motion: pane slide disabled, instant switch instead
 *
 * Phase 7 improvements:
 *   - Reads reducedMotion and highContrast from A11yContext
 *   - High contrast: stronger borders and text
 *
 * Phase 8 improvements:
 *   - role="tablist" on tab strip
 *   - role="tab" + aria-selected on each TabBtn
 *   - aria-label on prev/next arrows
 *   - aria-label on the tab strip container
 */

import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useIsLandscapeMobile } from '../hooks/useIsLandscapeMobile';
import { CHROME, TOUCH } from '../ui/responsive';
import { useA11y } from '../context/AccessibilityContext';

// Re-export so callers that imported the hook from here still work
export { useIsLandscapeMobile };

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const VOLT         = 'var(--color-volt, #CCFF00)';
const PANEL_BG     = 'rgba(4,20,33,0.88)';
const PANEL_BORDER = 'rgba(56,214,255,0.14)';
const TAB_H        = CHROME.paneBar.height; // 44 px

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Pane {
  id:       string;
  /** Short ALL-CAPS label shown on the tab button */
  label:    string;
  /** Icon rendered inside the tab button (14–16 px recommended) */
  icon?:    React.ReactNode;
  content:  React.ReactNode;
}

interface PaneSwitcherProps {
  panes:       Pane[];
  children:    React.ReactNode;
  /** Optional: control the active pane from the parent */
  activePaneId?: string;
  /** Optional: callback when the user switches panes */
  onPaneChange?: (id: string) => void;
  defaultPane?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TabBtn
// ─────────────────────────────────────────────────────────────────────────────

interface TabBtnProps {
  pane: Pane;
  isActive: boolean;
  onClick: () => void;
  reducedMotion: boolean;
  highContrast: boolean;
}

const TabBtn: React.FC<TabBtnProps> = ({
  pane,
  isActive,
  onClick,
  reducedMotion,
  highContrast,
}) => {
  return (
    <motion.button
      role="tab"
      aria-selected={isActive}
      aria-label={pane.label}
      whileHover={reducedMotion ? undefined : { scale: 1.02, backgroundColor: 'rgba(204,255,0,0.05)' }}
      whileTap={reducedMotion ? undefined : { scale: 0.95 }}
      onClick={onClick}
      className="swim26-pane-tab"
      style={{
        flex:           1,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '2px',
        height:         '100%',
        border:         'none',
        background:     isActive
          ? (highContrast ? 'rgba(204,255,0,0.18)' : 'rgba(204,255,0,0.08)')
          : 'transparent',
        borderBottom:   isActive
          ? `3px solid ${VOLT}`
          : `3px solid ${highContrast ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
        boxShadow:      isActive ? `0 4px 12px -2px ${VOLT}22` : 'none',
        cursor:         'pointer',
        userSelect:     'none',
        WebkitUserSelect:'none',
        padding:        '4px 6px',
        transition:     reducedMotion ? 'none' : 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
        outline:        'none',
      }}
    >
      {pane.icon && (
        <span
          aria-hidden
          style={{
            color:      isActive
              ? VOLT
              : (highContrast ? 'rgba(169,211,231,0.75)' : 'rgba(169,211,231,0.50)'),
            display:    'flex',
            alignItems: 'center',
            transition: reducedMotion ? 'none' : 'color 0.14s',
          }}
        >
          {pane.icon}
        </span>
      )}
      <span
        style={{
          fontFamily:    "'Bebas Neue', 'Rajdhani', sans-serif",
          fontWeight:    isActive ? 800 : 700,
          /* Active tabs get a slightly larger font to emphasise selection */
          fontSize:      isActive ? '13px' : '12px',
          letterSpacing: '0.12em',
          color:         isActive
            ? (highContrast ? '#FFFFFF' : '#F3FBFF')
            : (highContrast ? 'rgba(169,211,231,0.65)' : 'rgba(169,211,231,0.45)'),
          transition:    reducedMotion ? 'none' : 'color 0.14s, font-size 0.14s',
          lineHeight:    1,
        }}
      >
        {pane.label}
      </span>
    </motion.button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PaneSwitcher
// ─────────────────────────────────────────────────────────────────────────────

export function PaneSwitcher({ panes, children, activePaneId, onPaneChange, defaultPane }: PaneSwitcherProps) {
  const isLandscape  = useIsLandscapeMobile();
  const { settings: a11y } = useA11y();
  const { reducedMotion, highContrast } = a11y;

  const [internalActiveId, setInternalActiveId] = useState(defaultPane ?? panes[0]?.id ?? '');
  const activeId = activePaneId ?? internalActiveId;
  const [direction, setDirection] = useState<1 | -1>(1);

  const activeIdx = panes.findIndex(p => p.id === activeId);

  const goTo = useCallback(
    (id: string) => {
      const nextIdx = panes.findIndex(p => p.id === id);
      setDirection(nextIdx >= activeIdx ? 1 : -1);
      if (onPaneChange) {
        onPaneChange(id);
      } else {
        setInternalActiveId(id);
      }
    },
    [panes, activeIdx, onPaneChange],
  );

  const goPrev = () => { if (activeIdx > 0) goTo(panes[activeIdx - 1].id); };
  const goNext = () => { if (activeIdx < panes.length - 1) goTo(panes[activeIdx + 1].id); };

  // Normal viewport — show caller's layout unchanged
  if (!isLandscape) return <>{children}</>;

  const active = panes[activeIdx];

  return (
    <div
      style={{
        position:      'absolute',
        inset:         0,
        display:       'flex',
        flexDirection: 'column',
        overflow:      'hidden',
      }}
    >
      {/* ── Tab strip ── */}
      <div
        role="tablist"
        aria-label="Page sections"
        style={{
          height:               `${TAB_H}px`, // 44 px — meets TOUCH.minimum
          flexShrink:           0,
          display:              'flex',
          alignItems:           'stretch',
          background:           highContrast ? 'rgba(2,10,20,0.97)' : PANEL_BG,
          borderBottom:         `1px solid ${highContrast
            ? 'rgba(56,214,255,0.35)'
            : PANEL_BORDER}`,
          backdropFilter:       'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          position:             'relative',
        }}
      >
        {/* Prev arrow — 44 px wide touch target */}
        <motion.button
          whileTap={reducedMotion ? undefined : { scale: 0.88 }}
          onClick={goPrev}
          disabled={activeIdx === 0}
          aria-label="Previous section"
          className="swim26-pane-arrow"
          style={{
            width:          `${TOUCH.minimum}px`,  // 44 px (was 28 px)
            flexShrink:     0,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            background:     'transparent',
            border:         'none',
            borderRight:    `1px solid ${PANEL_BORDER}`,
            cursor:         activeIdx === 0 ? 'not-allowed' : 'pointer',
            opacity:        activeIdx === 0 ? 0.25 : 1,
            color:          highContrast
              ? 'rgba(169,211,231,0.90)'
              : 'rgba(169,211,231,0.70)',
            userSelect:     'none',
            outline:        'none',
          }}
        >
          <ChevronLeft size={16} />
        </motion.button>

        {/* Tab buttons */}
        {panes.map(pane => (
          <React.Fragment key={pane.id}>
          <TabBtn
            pane={pane}
            isActive={pane.id === activeId}
            onClick={() => goTo(pane.id)}
            reducedMotion={reducedMotion}
            highContrast={highContrast}
          />
          </React.Fragment>
        ))}

        {/* Next arrow — 44 px wide touch target */}
        <motion.button
          whileTap={reducedMotion ? undefined : { scale: 0.88 }}
          onClick={goNext}
          disabled={activeIdx === panes.length - 1}
          aria-label="Next section"
          className="swim26-pane-arrow"
          style={{
            width:          `${TOUCH.minimum}px`,  // 44 px (was 28 px)
            flexShrink:     0,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            background:     'transparent',
            border:         'none',
            borderLeft:     `1px solid ${PANEL_BORDER}`,
            cursor:         activeIdx === panes.length - 1 ? 'not-allowed' : 'pointer',
            opacity:        activeIdx === panes.length - 1 ? 0.25 : 1,
            color:          highContrast
              ? 'rgba(169,211,231,0.90)'
              : 'rgba(169,211,231,0.70)',
            userSelect:     'none',
            outline:        'none',
          }}
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>

      {/* Progress dots — below the tab strip, not overlapping it.
          Hidden in landscape-mobile where vertical space is precious;
          the active-tab underline already signals position. */}
      {!isLandscape && (
        <div
          aria-hidden
          style={{
            flexShrink:    0,
            display:       'flex',
            justifyContent:'center',
            gap:           '4px',
            padding:       '4px 0 2px',
            background:    'transparent',
          }}
        >
          {panes.map((p, i) => (
            <span
              key={p.id}
              style={{
                width:        i === activeIdx ? '12px' : '4px',
                height:       '2px',
                borderRadius: '2px',
                background:   i === activeIdx ? VOLT : 'rgba(169,211,231,0.25)',
                transition:   reducedMotion ? 'none' : 'width 0.2s, background 0.2s',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Pane content ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeId}
            custom={direction}
            initial={reducedMotion ? false : { opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -24 }}
            transition={{ duration: reducedMotion ? 0 : 0.18, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {active?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
