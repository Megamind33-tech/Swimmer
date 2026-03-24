/**
 * App — root component
 *
 * SWIM26 is a landscape-first mobile game.
 * LandscapeGuard enforces landscape orientation on mobile:
 *   - Portrait → "Rotate your device" overlay (game paused)
 *   - Landscape → full game, all interactions enabled
 */

import React from 'react';
import { GameShell } from './components/GameShell';
import { LandscapeGuard } from './ui/LandscapeGuard';
import { A11yProvider } from './context/AccessibilityContext';
import { CareerSaveProvider } from './context/CareerSaveContext';

export function App() {
  return (
    <A11yProvider>
      <CareerSaveProvider>
        <LandscapeGuard>
          <GameShell />
        </LandscapeGuard>
      </CareerSaveProvider>
    </A11yProvider>
  );
}

export default App;
