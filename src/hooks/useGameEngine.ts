import { useCallback, MutableRefObject } from 'react';
import { ArenaManager } from '../graphics/ArenaManager';
import type { CameraView } from '../types';

/**
 * useGameEngine — bridges UI actions to the Babylon.js ArenaManager.
 * All calls are safe: if arenaRef.current is null, they no-op.
 */
export function useGameEngine(arenaRef: MutableRefObject<ArenaManager | null>) {
  const setCamera = useCallback((view: CameraView) => {
    arenaRef.current?.setCamera(view);
  }, [arenaRef]);

  const setTheme = useCallback((theme: 'OLYMPIC' | 'TROPICAL' | 'NIGHT' | 'RETRO') => {
    arenaRef.current?.setTheme(theme);
  }, [arenaRef]);

  const setQualityPreset = useCallback((preset: 'high' | 'medium' | 'low') => {
    arenaRef.current?.setQualityPreset(preset);
  }, [arenaRef]);

  const enableBroadcast = useCallback(() => {
    arenaRef.current?.enableBroadcastMode();
  }, [arenaRef]);

  const disableBroadcast = useCallback(() => {
    arenaRef.current?.disableBroadcastMode();
  }, [arenaRef]);

  const updateScoreboard = useCallback((leaderboard: Array<{ rank: number; name: string; time: number }>) => {
    arenaRef.current?.updateScoreboard(leaderboard);
  }, [arenaRef]);

  return { setCamera, setTheme, setQualityPreset, enableBroadcast, disableBroadcast, updateScoreboard };
}
