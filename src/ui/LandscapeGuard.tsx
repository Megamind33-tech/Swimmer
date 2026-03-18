/**
 * LandscapeGuard — Rotate-device overlay for portrait mode
 *
 * This component wraps the entire app.  When the device is in portrait
 * orientation it renders a full-screen overlay instructing the player to
 * rotate.  The underlying game content (including any Babylon.js canvas)
 * remains mounted so there is no re-initialization cost on rotate.
 *
 * Behaviour:
 *   - Portrait (<= 1.0 aspect ratio or orientation === 'portrait-primary'):
 *       shows overlay, blocks all pointer events on children
 *   - Landscape (> 1.0 aspect ratio):
 *       overlay is hidden, children receive full interaction
 *
 * The overlay is always above everything (z-index: var(--z-landscape)).
 *
 * Usage:
 *   <LandscapeGuard>
 *     <App />
 *   </LandscapeGuard>
 */

import React, { useEffect, useState } from 'react';
import { RotateDeviceIcon } from '../theme/icons';
import { colors, zIndex } from '../theme/tokens';

// ─────────────────────────────────────────────────────────────────────────────
// Hook: useIsLandscape
// ─────────────────────────────────────────────────────────────────────────────

function useIsLandscape(): boolean {
  const check = () => window.innerWidth > window.innerHeight;

  const [isLandscape, setIsLandscape] = useState<boolean>(check);

  useEffect(() => {
    const mq = window.matchMedia('(orientation: landscape)');

    const handler = () => setIsLandscape(check());

    mq.addEventListener('change', handler);
    window.addEventListener('resize', handler);

    // Re-check immediately in case initial render was wrong
    handler();

    return () => {
      mq.removeEventListener('change', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  return isLandscape;
}

// ─────────────────────────────────────────────────────────────────────────────
// LandscapeGuard
// ─────────────────────────────────────────────────────────────────────────────

interface LandscapeGuardProps {
  children: React.ReactNode;
  /**
   * If true, the guard is disabled entirely (useful for dev / Storybook).
   * Defaults to false.
   */
  disabled?: boolean;
}

export const LandscapeGuard: React.FC<LandscapeGuardProps> = ({
  children,
  disabled = false,
}) => {
  const isLandscape = useIsLandscape();
  const showOverlay = !disabled && !isLandscape;

  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* Game content — always mounted */}
      <div
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: showOverlay ? 'none' : 'auto',
          // Slight blur when overlay is active to hint the content is locked
          filter: showOverlay ? 'blur(3px) brightness(0.4)' : 'none',
          transition: 'filter 0.3s ease',
        }}
      >
        {children}
      </div>

      {/* Landscape guard overlay */}
      {showOverlay && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: zIndex.landscape,
            background: colors.overlay.darker,
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            padding: '32px',
          }}
        >
          {/* Rotating phone animation */}
          <div
            style={{
              color: colors.primary.DEFAULT,
              animation: 'rotate-hint 2s ease-in-out infinite',
            }}
          >
            <RotateDeviceIcon size={72} />
          </div>

          {/* Headline */}
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                color: colors.text.primary,
                fontSize: '22px',
                fontWeight: 900,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                lineHeight: 1.1,
                marginBottom: '8px',
              }}
            >
              Rotate to Play
            </p>
            <p
              style={{
                color: colors.text.muted,
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Swimmer-Three requires landscape mode
            </p>
          </div>

          {/* Accent bar */}
          <div
            style={{
              width: '48px',
              height: '3px',
              borderRadius: '99px',
              background: colors.primary.DEFAULT,
              boxShadow: colors.primary.glow,
            }}
          />
        </div>
      )}

      {/* Keyframe for the phone rotation animation */}
      <style>{`
        @keyframes rotate-hint {
          0%   { transform: rotate(0deg);   opacity: 1;    }
          40%  { transform: rotate(-90deg); opacity: 1;    }
          60%  { transform: rotate(-90deg); opacity: 0.85; }
          80%  { transform: rotate(0deg);   opacity: 1;    }
          100% { transform: rotate(0deg);   opacity: 1;    }
        }
      `}</style>
    </div>
  );
};

export default LandscapeGuard;
