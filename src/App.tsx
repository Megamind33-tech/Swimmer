import React, { useEffect, useRef, useState } from 'react';
import { ArenaManager } from './graphics/ArenaManager';
import { detectRuntimePerformanceTier } from './performance/performanceTier';
import { GameProvider, useGameStore } from './hooks/useGameStore';
import { useGameEngine } from './hooks/useGameEngine';

import { BootScreen } from './components/ui/BootScreen';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { TopHUD } from './components/ui/TopHUD';
import { Navigation } from './components/ui/Navigation';
import { HubScreen } from './components/ui/HubScreen';
import { SquadScreen } from './components/ui/SquadScreen';
import { MarketScreen } from './components/ui/MarketScreen';
import { SettingsScreen } from './components/ui/SettingsScreen';
import { RaceHUD } from './components/ui/RaceHUD';
import { NotificationToast } from './components/ui/NotificationToast';
import { AthleteDetailOverlay } from './components/ui/AthleteDetailOverlay';
import { ProspectNegotiateOverlay } from './components/ui/ProspectNegotiateOverlay';
import { ProfileOverlay } from './components/ui/ProfileOverlay';
import { RaceResultOverlay } from './components/ui/RaceResultOverlay';

function GameApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arenaRef = useRef<ArenaManager | null>(null);
  const { state, resetRace } = useGameStore();
  const engine = useGameEngine(arenaRef);

  const [gameState, setGameState] = useState('boot'); 
  const [activeTab, setActiveTab] = useState('hub');
  const [assets, setAssets] = useState({ arenaBg: null, avatarImg: null });

  // Initialize 3D engine
  useEffect(() => {
    if (!canvasRef.current) return;
    let disposed = false;
    const tier = detectRuntimePerformanceTier();
    const arena = new ArenaManager(canvasRef.current, tier);
    arenaRef.current = arena;

    arena.initialize()
      .then(() => {
        arena.resize();
        arena.setCamera('DEFAULT');
      })
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

  // Camera reactions to game state
  useEffect(() => {
    if (!arenaRef.current) return;
    if (gameState === 'race') {
      engine.setCamera('STARTING_BLOCK');
      engine.enableBroadcast();
    } else if (gameState === 'menu') {
      engine.setCamera('DEFAULT');
      engine.disableBroadcast();
    }
  }, [gameState, engine]);

  const handleEnterRace = () => {
    setGameState('race');
  };

  const handleExitRace = () => {
    resetRace();
    setGameState('menu');
  };

  return (
    <div className="h-[100dvh] w-screen relative overflow-hidden bg-[#020b14]">
      {/* Background 3D Engine — NEVER TOUCHED */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ display: 'block', width: '100vw', height: '100dvh', touchAction: 'none' }}
      />
      
      {/* Foreground UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none text-white font-rajdhani">
        {gameState === 'boot' && (
          <div className="pointer-events-auto w-full h-full"><BootScreen onComplete={() => setGameState('load')} /></div>
        )}
        {gameState === 'load' && (
          <div className="pointer-events-auto w-full h-full"><LoadingScreen onComplete={() => setGameState('menu')} setAssets={setAssets} /></div>
        )}
        
        {gameState === 'menu' && (
          <div className="flex flex-col h-full w-full bg-[#020b14]/30 relative pointer-events-none">
            <div className="absolute inset-0 water-caustics opacity-30 z-0 pointer-events-none" />
            
            <div className="pointer-events-auto w-full">
              <TopHUD avatarImg={assets.avatarImg} />
            </div>

            <div className="pointer-events-auto">
              <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            
            {/* Main content area — landscape: offset by side nav; portrait: offset by top+bottom */}
            <main className="relative z-10 flex-1 h-full w-full overflow-hidden pt-[48px] landscape:pt-[44px] landscape:pl-[56px] pointer-events-none">
               <div className="w-full h-full">
                  {activeTab === 'hub' && <HubScreen onRace={handleEnterRace} assets={assets} setActiveTab={setActiveTab} />}
                  {activeTab === 'squad' && <SquadScreen />}
                  {activeTab === 'network' && <MarketScreen />}
                  {activeTab === 'system' && <SettingsScreen onEngineQuality={(preset) => engine.setQualityPreset(preset)} />}
               </div>
            </main>
          </div>
        )}

        {gameState === 'race' && (
          <div className="pointer-events-auto w-full h-full bg-transparent">
             <RaceHUD onBack={handleExitRace} />
          </div>
        )}

        {/* Overlays — rendered on top of everything */}
        {state.overlay === 'athlete-detail' && <AthleteDetailOverlay />}
        {state.overlay === 'prospect-negotiate' && <ProspectNegotiateOverlay />}
        {state.overlay === 'profile' && <ProfileOverlay />}
        {state.overlay === 'race-result' && <RaceResultOverlay onExit={handleExitRace} />}

        {/* Notifications */}
        <NotificationToast />
      </div>
    </div>
  );
}

// Wrap with GameProvider
export default function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}
