/**
 * React hook for GameManager integration
 * Wraps GameManager functionality for React components
 */

import { useEffect, useRef, useState } from 'react';
import { GameManager } from '../core/GameManager';
import { IPlayerSwimmer, GameState, GameMode } from '../types';

export interface UseGameManagerReturn {
  gameManager: GameManager | null;
  gameState: GameState;
  currentMode: GameMode;
  player: IPlayerSwimmer | null;
  isReady: boolean;
  switchMode: (mode: GameMode) => void;
  addXp: (amount: number) => void;
  addReputation: (amount: number) => void;
  addFame: (amount: number) => void;
}

/**
 * Initialize GameManager and provide React interface
 */
export function useGameManager(
  initialPlayer?: IPlayerSwimmer
): UseGameManagerReturn {
  const managerRef = useRef<GameManager | null>(null);
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [currentMode, setCurrentMode] = useState<GameMode>('MENU');
  const [player, setPlayer] = useState<IPlayerSwimmer | null>(initialPlayer || null);
  const [isReady, setIsReady] = useState(false);

  // Initialize GameManager on mount
  useEffect(() => {
    if (managerRef.current) return; // Already initialized

    const manager = new GameManager();
    managerRef.current = manager;

    // Subscribe to state changes
    manager.on('gameStateChanged', (data) => {
      setGameState(data.newState);
    });

    manager.on('modeChanged', (data) => {
      setCurrentMode(data.newMode);
    });

    manager.on('playerDataChanged', (data) => {
      setPlayer(data.player);
    });

    // Initialize with default player if provided
    if (initialPlayer) {
      manager.init(initialPlayer, true).then(() => {
        setIsReady(true);
      });
    } else {
      setIsReady(true); // Ready even without player
    }

    return () => {
      manager.shutdown();
    };
  }, []);

  const switchMode = (mode: GameMode) => {
    if (managerRef.current) {
      managerRef.current.switchMode(mode);
    }
  };

  const addXp = (amount: number) => {
    if (managerRef.current) {
      managerRef.current.addXp(amount);
    }
  };

  const addReputation = (amount: number) => {
    if (managerRef.current) {
      managerRef.current.addReputation(amount);
    }
  };

  const addFame = (amount: number) => {
    if (managerRef.current) {
      managerRef.current.addFame(amount);
    }
  };

  return {
    gameManager: managerRef.current,
    gameState,
    currentMode,
    player,
    isReady,
    switchMode,
    addXp,
    addReputation,
    addFame,
  };
}

export default useGameManager;
