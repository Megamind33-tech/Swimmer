/**
 * SWIM 26 - Main Menu
 * AAA menu with global layout framework
 */

import React, { useState } from 'react';
import { GlobalMenuLayout, MenuScreen } from './menu/GlobalMenuLayout';
import { HomeScreen, HomeRightPanel } from './menu/HomeScreen';
import { PlayScreen } from './menu/PlayScreen';
import { PreRaceSetupScreen } from './menu/PreRaceSetupScreen';
import { RaceResultScreen } from './menu/RaceResultScreen';
import { CareerScreen } from './menu/CareerScreen';
import { SwimmerScreen } from './menu/SwimmerScreen';
import { LockerRoomScreen } from './menu/LockerRoomScreen';

interface MainMenuProps {
  onPlay: () => void;
  onSettings: () => void;
  playerLevel?: number;
  playerName?: string;
  softCurrency?: number;
  premiumCurrency?: number;
  playerAvatarUrl?: string;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onPlay,
  onSettings,
  playerLevel = 1,
  playerName = 'Swimmer',
  softCurrency = 5000,
  premiumCurrency = 250,
  playerAvatarUrl,
}) => {
  const [currentScreen, setCurrentScreen] = useState<MenuScreen>('HOME');

  const handleScreenChange = (screen: MenuScreen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen onPlayClick={onPlay} onCareerClick={() => setCurrentScreen('CAREER')} />;
      case 'PLAY':
        return <PlayScreen onModeSelect={(mode) => {
          console.log('Selected mode:', mode);
        }} />;
      case 'CAREER':
        return <CareerScreen onEventSelect={(eventId) => {
          console.log('Selected event:', eventId);
        }} />;
      case 'SWIMMER':
        return <SwimmerScreen swimmerName={playerName} swimmerLevel={playerLevel} />;
      case 'CLUB':
        return <div className="flex items-center justify-center h-full text-white text-2xl">Club Screen - Coming Soon</div>;
      case 'LIVE_EVENTS':
        return <div className="flex items-center justify-center h-full text-white text-2xl">Live Events Screen - Coming Soon</div>;
      case 'SOCIAL':
        return <div className="flex items-center justify-center h-full text-white text-2xl">Social Screen - Coming Soon</div>;
      case 'STORE':
        return <div className="flex items-center justify-center h-full text-white text-2xl">Store Screen - Coming Soon</div>;
      default:
        return <HomeScreen onPlayClick={onPlay} onCareerClick={() => setCurrentScreen('CAREER')} />;
    }
  };

  return (
    <GlobalMenuLayout
      currentScreen={currentScreen}
      onScreenChange={handleScreenChange}
      playerLevel={playerLevel}
      playerName={playerName}
      softCurrency={softCurrency}
      premiumCurrency={premiumCurrency}
      playerAvatarUrl={playerAvatarUrl}
      rightPanel={currentScreen === 'HOME' ? <HomeRightPanel /> : null}
    >
      {renderScreen()}
    </GlobalMenuLayout>
  );
};

export default MainMenu;
