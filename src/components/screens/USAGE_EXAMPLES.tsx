/**
 * USAGE EXAMPLES - Screen Components
 *
 * This file demonstrates how to use each of the 4 screen components
 * in your React application.
 */

import React, { useState } from 'react';
import {
  RaceLobby,
  RaceGameplayHUD,
  SocialClubScreen,
  ChampionshipScreen,
} from './index';

/**
 * Example 1: Simple Single Screen Display
 * Use this to display a single screen at a time
 */
export function SingleScreenExample() {
  return (
    <div>
      <RaceLobby />
    </div>
  );
}

/**
 * Example 2: Tab-Based Navigation Between Screens
 * Use this to switch between different screens
 */
export function TabNavigationExample() {
  const [activeTab, setActiveTab] = useState<'lobby' | 'gameplay' | 'social' | 'championship'>('lobby');

  return (
    <div className="min-h-screen">
      {/* Tab Buttons */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-surface-container border-b border-outline-variant flex gap-4 px-4 py-2">
        <button
          onClick={() => setActiveTab('lobby')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'lobby'
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Race Lobby
        </button>
        <button
          onClick={() => setActiveTab('gameplay')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'gameplay'
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Gameplay
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'social'
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Social Club
        </button>
        <button
          onClick={() => setActiveTab('championship')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'championship'
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Championships
        </button>
      </div>

      {/* Content */}
      <div className="pt-16">
        {activeTab === 'lobby' && <RaceLobby />}
        {activeTab === 'gameplay' && <RaceGameplayHUD />}
        {activeTab === 'social' && <SocialClubScreen />}
        {activeTab === 'championship' && <ChampionshipScreen />}
      </div>
    </div>
  );
}

/**
 * Example 3: Sequential Screen Flow
 * Use this to show screens in a sequence (like a game flow)
 */
export function SequentialScreenFlowExample() {
  const [currentScreen, setCurrentScreen] = useState<'lobby' | 'gameplay' | 'results'>('lobby');

  const handleStartRace = () => {
    setCurrentScreen('gameplay');
  };

  const handleFinishRace = () => {
    setCurrentScreen('results');
  };

  const handleBackToLobby = () => {
    setCurrentScreen('lobby');
  };

  return (
    <div>
      {currentScreen === 'lobby' && (
        <div onClick={handleStartRace}>
          <RaceLobby />
        </div>
      )}
      {currentScreen === 'gameplay' && (
        <div onClick={handleFinishRace}>
          <RaceGameplayHUD />
        </div>
      )}
      {currentScreen === 'results' && (
        <div className="p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Race Complete!</h1>
          <button
            onClick={handleBackToLobby}
            className="bg-primary text-on-primary px-8 py-4 font-bold"
          >
            Back to Lobby
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Example 4: Responsive Layout with All Screens
 * Use this to show all screens in a responsive grid
 */
export function AllScreensPreviewExample() {
  return (
    <div className="bg-background text-on-surface min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">SWIM26 - All Screens</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lobby Preview */}
        <div className="border-2 border-outline rounded-lg overflow-hidden">
          <h2 className="text-2xl font-bold p-4 border-b border-outline">Race Lobby</h2>
          <div style={{ height: '600px', overflowY: 'auto' }}>
            <RaceLobby />
          </div>
        </div>

        {/* Gameplay Preview */}
        <div className="border-2 border-outline rounded-lg overflow-hidden">
          <h2 className="text-2xl font-bold p-4 border-b border-outline">Gameplay HUD</h2>
          <div style={{ height: '600px', overflowY: 'auto' }}>
            <RaceGameplayHUD />
          </div>
        </div>

        {/* Social Preview */}
        <div className="border-2 border-outline rounded-lg overflow-hidden">
          <h2 className="text-2xl font-bold p-4 border-b border-outline">Social Club</h2>
          <div style={{ height: '600px', overflowY: 'auto' }}>
            <SocialClubScreen />
          </div>
        </div>

        {/* Championship Preview */}
        <div className="border-2 border-outline rounded-lg overflow-hidden">
          <h2 className="text-2xl font-bold p-4 border-b border-outline">Championships</h2>
          <div style={{ height: '600px', overflowY: 'auto' }}>
            <ChampionshipScreen />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 5: Router-Based Navigation
 * Use this with React Router for multi-page navigation
 *
 * First install React Router:
 * npm install react-router-dom
 *
 * Then use:
 */
/*
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export function RouterExample() {
  return (
    <Router>
      <Routes>
        <Route path="/race-lobby" element={<RaceLobby />} />
        <Route path="/race-gameplay" element={<RaceGameplayHUD />} />
        <Route path="/social-club" element={<SocialClubScreen />} />
        <Route path="/championship" element={<ChampionshipScreen />} />
      </Routes>
    </Router>
  );
}
*/

/**
 * Example 6: Conditional Rendering Based on Game State
 * Use this to show different screens based on user progress
 */
interface GameState {
  currentScreen: 'mainMenu' | 'raceSelect' | 'racing' | 'socialHub' | 'championships';
  isLoggedIn: boolean;
  hasStartedRace: boolean;
}

export function ConditionalRenderingExample() {
  const [gameState] = useState<GameState>({
    currentScreen: 'raceSelect',
    isLoggedIn: true,
    hasStartedRace: false,
  });

  if (!gameState.isLoggedIn) {
    return <div className="text-center p-8">Please log in to continue</div>;
  }

  switch (gameState.currentScreen) {
    case 'raceSelect':
      return <RaceLobby />;
    case 'racing':
      return <RaceGameplayHUD />;
    case 'socialHub':
      return <SocialClubScreen />;
    case 'championships':
      return <ChampionshipScreen />;
    default:
      return <RaceLobby />;
  }
}

/**
 * Example 7: Standalone Component Usage
 * Use individual components in your own layouts
 */
export function StandaloneComponentsExample() {
  return (
    <div className="bg-background text-on-surface">
      {/* You can use any component anywhere in your app */}
      <header className="bg-surface-container p-4 border-b border-outline">
        <h1 className="text-2xl font-bold">Custom Layout</h1>
      </header>

      <main className="p-4">
        {/* Just render the component you need */}
        <ChampionshipScreen />
      </main>

      <footer className="bg-surface-container p-4 border-t border-outline mt-8">
        <p className="text-on-surface-variant">© 2026 SWIM26</p>
      </footer>
    </div>
  );
}

/**
 * Example 8: Component Composition with Custom Wrappers
 * Use this to wrap components with additional UI
 */
interface ScreenWrapperProps {
  title: string;
  children: React.ReactNode;
}

function ScreenWrapper({ title, children }: ScreenWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-surface-container border-b border-outline p-4">
        <h1 className="text-2xl font-bold text-on-surface">{title}</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}

export function ComponentCompositionExample() {
  return (
    <div>
      <ScreenWrapper title="Race Lobby">
        <RaceLobby />
      </ScreenWrapper>
    </div>
  );
}

/**
 * Example 9: Keyboard Navigation Between Screens
 * Use this to navigate with keyboard shortcuts
 */
export function KeyboardNavigationExample() {
  const [activeScreen, setActiveScreen] = useState<'lobby' | 'gameplay' | 'social' | 'championship'>('lobby');

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case '1':
          setActiveScreen('lobby');
          break;
        case '2':
          setActiveScreen('gameplay');
          break;
        case '3':
          setActiveScreen('social');
          break;
        case '4':
          setActiveScreen('championship');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div>
      {/* Keyboard hints */}
      <div className="fixed bottom-4 right-4 bg-surface-container p-4 border border-outline rounded text-sm text-on-surface-variant">
        <p>Press 1-4 to navigate:</p>
        <p>1: Lobby | 2: Gameplay | 3: Social | 4: Championship</p>
      </div>

      {activeScreen === 'lobby' && <RaceLobby />}
      {activeScreen === 'gameplay' && <RaceGameplayHUD />}
      {activeScreen === 'social' && <SocialClubScreen />}
      {activeScreen === 'championship' && <ChampionshipScreen />}
    </div>
  );
}

/**
 * Example 10: Full App Integration
 * Use this as a complete app template
 */
export function FullAppExample() {
  const [activeScreen, setActiveScreen] = useState<'lobby' | 'gameplay' | 'social' | 'championship'>('lobby');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* Drawer Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40">
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-surface-container border-r border-outline p-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)} className="text-on-surface-variant">×</button>
            </div>

            <nav className="space-y-4">
              <button
                onClick={() => {
                  setActiveScreen('lobby');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-surface-container-high rounded transition-colors"
              >
                Race Lobby
              </button>
              <button
                onClick={() => {
                  setActiveScreen('gameplay');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-surface-container-high rounded transition-colors"
              >
                Gameplay
              </button>
              <button
                onClick={() => {
                  setActiveScreen('social');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-surface-container-high rounded transition-colors"
              >
                Social Club
              </button>
              <button
                onClick={() => {
                  setActiveScreen('championship');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-surface-container-high rounded transition-colors"
              >
                Championships
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative">
        {/* Menu Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 left-4 z-30 bg-primary text-on-primary p-2 rounded-full"
        >
          ☰
        </button>

        {/* Screens */}
        {activeScreen === 'lobby' && <RaceLobby />}
        {activeScreen === 'gameplay' && <RaceGameplayHUD />}
        {activeScreen === 'social' && <SocialClubScreen />}
        {activeScreen === 'championship' && <ChampionshipScreen />}
      </div>
    </div>
  );
}

/**
 * Export all examples
 *
 * To use: import { FullAppExample } from '@/components/screens/USAGE_EXAMPLES'
 */
