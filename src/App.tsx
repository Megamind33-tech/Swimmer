import React, { useEffect, useRef } from 'react';
import { ArenaManager } from './graphics/ArenaManager';
import { detectRuntimePerformanceTier } from './performance/performanceTier';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arenaRef = useRef<ArenaManager | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let disposed = false;
    const tier = detectRuntimePerformanceTier();
    const arena = new ArenaManager(canvasRef.current, tier);
    arenaRef.current = arena;

    arena.initialize()
      .then(() => arena.resize())
      .catch((err: Error) =>
        console.error('[App] ArenaManager init failed:', err),
      );

    let resizeRaf: number | null = null;
    const handleResize = () => {
      if (resizeRaf !== null) return;
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = null;
        if (!disposed) arena.resize();
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      if (resizeRaf !== null) window.cancelAnimationFrame(resizeRaf);
      arena.dispose();
      arenaRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100vw', height: '100dvh', touchAction: 'none' }}
    />
  );
}
