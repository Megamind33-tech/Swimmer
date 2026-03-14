/**
 * React hook for PlayerManager integration
 * Wraps PlayerManager functionality for React components
 */

import { useEffect, useRef, useState } from 'react';
import { PlayerManager } from '../data/PlayerManager';
import { IPlayerSwimmer, SwimmerSpecialty, ISwimmerAttributes } from '../types';

export interface UsePlayerManagerReturn {
  playerManager: PlayerManager | null;
  currentPlayer: IPlayerSwimmer | null;
  isReady: boolean;
  createPlayer: (name: string, specialty: SwimmerSpecialty, attributes: ISwimmerAttributes) => IPlayerSwimmer | null;
  loadPlayer: () => IPlayerSwimmer | null;
  savePlayer: (player: IPlayerSwimmer) => void;
}

/**
 * Initialize PlayerManager and provide React interface
 */
export function usePlayerManager(): UsePlayerManagerReturn {
  const managerRef = useRef<PlayerManager | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<IPlayerSwimmer | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize PlayerManager on mount
  useEffect(() => {
    if (managerRef.current) return; // Already initialized

    const manager = new PlayerManager();
    managerRef.current = manager;

    // Try to load existing player
    const loaded = manager.loadPlayer();
    if (loaded) {
      setCurrentPlayer(loaded);
    }

    setIsReady(true);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const createPlayer = (
    name: string,
    specialty: SwimmerSpecialty,
    attributes: ISwimmerAttributes
  ): IPlayerSwimmer | null => {
    if (!managerRef.current) return null;

    const player = managerRef.current.createPlayer(name, specialty, attributes);
    setCurrentPlayer(player);
    return player;
  };

  const loadPlayer = (): IPlayerSwimmer | null => {
    if (!managerRef.current) return null;

    const player = managerRef.current.loadPlayer();
    if (player) {
      setCurrentPlayer(player);
    }
    return player;
  };

  const savePlayer = (player: IPlayerSwimmer): void => {
    if (!managerRef.current) return;

    managerRef.current.setPlayer(player);
    setCurrentPlayer(player);
  };

  return {
    playerManager: managerRef.current,
    currentPlayer,
    isReady,
    createPlayer,
    loadPlayer,
    savePlayer,
  };
}

export default usePlayerManager;
