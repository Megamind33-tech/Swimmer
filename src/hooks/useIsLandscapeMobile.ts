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
  const read = () => {
    const width = window.visualViewport?.width ?? window.innerWidth;
    const height = window.visualViewport?.height ?? window.innerHeight;
    return height <= 500 && width > height;
  };

  const [v, setV] = useState(
    () => read(),
  );

  useEffect(() => {
    let rafId: number | null = null;
    const schedule = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        setV(read());
      });
    };

    const mq = window.matchMedia('(orientation: landscape)');
    mq.addEventListener('change', schedule);
    window.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('scroll', schedule);

    return () => {
      mq.removeEventListener('change', schedule);
      window.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('scroll', schedule);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return v;
}
