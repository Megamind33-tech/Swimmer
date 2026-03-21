/**
 * App — root component
 *
 * All screens (lobby, mode-select, pre-race, pre-match, race) are responsive
 * and fully interactive in both portrait and landscape on all target devices.
 * LandscapeGuard is disabled: portrait is no longer blocked at the CSS or JS
 * level so menus and the race scene can adapt to any orientation.
 */

import React from 'react';
import { GameShell } from './components/GameShell';
import { LandscapeGuard } from './ui/LandscapeGuard';
import { A11yProvider } from './context/AccessibilityContext';

export function App() {
  return (
    <A11yProvider>
      <LandscapeGuard disabled>
        <GameShell />
      </LandscapeGuard>
    </A11yProvider>
  );
}

export default App;
