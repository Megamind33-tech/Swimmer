import { useEffect } from 'react';

function readViewport() {
  const vv = window.visualViewport;
  const width = Math.round(vv?.width ?? window.innerWidth);
  const height = Math.round(vv?.height ?? window.innerHeight);
  const offsetLeft = Math.max(0, Math.round(vv?.offsetLeft ?? 0));
  const offsetTop = Math.max(0, Math.round(vv?.offsetTop ?? 0));

  const layoutW = Math.round(window.innerWidth);
  const layoutH = Math.round(window.innerHeight);
  const offsetRight = Math.max(0, layoutW - width - offsetLeft);
  const offsetBottom = Math.max(0, layoutH - height - offsetTop);

  return { width, height, offsetLeft, offsetTop, offsetRight, offsetBottom };
}

/**
 * Keeps CSS viewport variables in sync with Android Chrome/WebView visual viewport churn.
 * Uses rAF-coalesced updates to avoid resize storms.
 */
export function useAndroidViewportSync(): void {
  useEffect(() => {
    let rafId: number | null = null;
    let last = '';

    const commit = () => {
      rafId = null;
      const vp = readViewport();
      const next = `${vp.width}x${vp.height}:${vp.offsetLeft},${vp.offsetTop},${vp.offsetRight},${vp.offsetBottom}`;
      if (next === last) return;
      last = next;

      const root = document.documentElement;
      root.style.setProperty('--app-vw', `${vp.width}px`);
      root.style.setProperty('--app-vh', `${vp.height}px`);
      root.style.setProperty('--vv-offset-left', `${vp.offsetLeft}px`);
      root.style.setProperty('--vv-offset-right', `${vp.offsetRight}px`);
      root.style.setProperty('--vv-offset-top', `${vp.offsetTop}px`);
      root.style.setProperty('--vv-offset-bottom', `${vp.offsetBottom}px`);
    };

    const schedule = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(commit);
    };

    schedule();
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('scroll', schedule);

    return () => {
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('scroll', schedule);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);
}

