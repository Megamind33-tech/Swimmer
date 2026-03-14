/**
 * React hook for RivalSystem integration
 * Wraps RivalSystem functionality for React components
 */

import { useEffect, useRef, useState } from 'react';
import { RivalSystem } from '../gameplay/RivalSystem';
import { IRival } from '../types';

export interface UseRivalSystemReturn {
  rivalSystem: RivalSystem | null;
  allRivals: IRival[];
  unlockedRivals: IRival[];
  isReady: boolean;
  getUnlockedRivals: (playerLevel: number) => IRival[];
  selectRival: (playerLevel: number, tier?: number) => IRival | null;
  getNemesisRival: (playerLevel: number) => IRival | null;
  recordRaceOutcome: (rivalId: string, playerWon: boolean) => void;
  getRivalryRecord: (rivalId: string) => { wins: number; losses: number; ratio: number };
}

/**
 * Initialize RivalSystem and provide React interface
 */
export function useRivalSystem(): UseRivalSystemReturn {
  const systemRef = useRef<RivalSystem | null>(null);
  const [allRivals, setAllRivals] = useState<IRival[]>([]);
  const [unlockedRivals, setUnlockedRivals] = useState<IRival[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Initialize RivalSystem on mount
  useEffect(() => {
    if (systemRef.current) return; // Already initialized

    const system = new RivalSystem();
    systemRef.current = system;

    // Load all rivals
    const rivals = system.getAllRivals();
    setAllRivals(rivals);

    setIsReady(true);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const getUnlockedRivals = (playerLevel: number): IRival[] => {
    if (!systemRef.current) return [];
    return systemRef.current.getUnlockedRivals(playerLevel);
  };

  const selectRival = (playerLevel: number, tier?: number): IRival | null => {
    if (!systemRef.current) return null;
    return systemRef.current.selectRival(playerLevel, tier);
  };

  const getNemesisRival = (playerLevel: number): IRival | null => {
    if (!systemRef.current) return null;
    return systemRef.current.getNemesisRival(playerLevel);
  };

  const recordRaceOutcome = (rivalId: string, playerWon: boolean): void => {
    if (!systemRef.current) return;
    systemRef.current.recordRaceOutcome(rivalId, playerWon);
  };

  const getRivalryRecord = (
    rivalId: string
  ): { wins: number; losses: number; ratio: number } => {
    if (!systemRef.current) return { wins: 0, losses: 0, ratio: 0 };
    return systemRef.current.getRivalryRecord(rivalId);
  };

  return {
    rivalSystem: systemRef.current,
    allRivals,
    unlockedRivals,
    isReady,
    getUnlockedRivals,
    selectRival,
    getNemesisRival,
    recordRaceOutcome,
    getRivalryRecord,
  };
}

export default useRivalSystem;
