/**
 * useIsLandscapeMobile
 *
 * Single shared hook for mobile landscape detection — replaces four identical
 * copies previously spread across AppShell, IconTabBar, TopUtilityBar, and
 * PaneSwitcher.
 *
 * Returns true when:
 *   • viewport height ≤ 500 px, AND
 *   • orientation is landscape (width > height)
 *
 * Uses a MediaQueryList listener so it reacts instantly to orientation changes
 * without polling or resize-observer overhead.
 */

import { useState, useEffect } from 'react';

export function useIsLandscapeMobile(): boolean {
  const [v, setV] = useState(
    () => window.innerHeight <= 500 && window.innerWidth > window.innerHeight,
  );

  useEffect(() => {
    const mq = window.matchMedia(
      '(max-height: 500px) and (orientation: landscape)',
    );
    const handler = (e: MediaQueryListEvent) => setV(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return v;
}
