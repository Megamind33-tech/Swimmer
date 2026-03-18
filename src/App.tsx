/**
 * App — root component
 *
 * Wraps the entire application in LandscapeGuard so portrait-mode devices
 * see the rotate overlay before any game content is interactive.
 *
 * GameShell sits inside the guard — it is always mounted (the Babylon canvas
 * only activates when a race starts, so there is no wasted WebGL context
 * in portrait mode either).
 */

import React from 'react';
import { GameShell } from './components/GameShell';
import { LandscapeGuard } from './ui/LandscapeGuard';

export function App() {
  return (
    <LandscapeGuard>
      <GameShell />
    </LandscapeGuard>
  );
}

export default App;
