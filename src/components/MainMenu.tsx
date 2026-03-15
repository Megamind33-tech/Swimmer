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
import { LiveEventsScreen } from './menu/LiveEventsScreen';
import { SocialScreen } from './menu/SocialScreen';
import { ClubScreen } from './menu/ClubScreen';
import { StoreScreen } from './menu/StoreScreen';
import { RewardsInboxScreen } from './menu/RewardsInboxScreen';
import { SettingsScreen } from './menu/SettingsScreen';

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
        return <HomeScreen
          onPlayClick={onPlay}
          onCareerClick={() => setCurrentScreen('CAREER')}
        />;
      case 'PLAY':
        return <PlayScreen onModeSelect={(mode) => {
          // Start race with selected mode
          setCurrentScreen('HOME');
          onPlay();
        }} />;
      case 'CAREER':
        return <CareerScreen onEventSelect={(eventId) => {
          // Start career race
          onPlay();
        }} />;
      case 'SWIMMER':
        return <SwimmerScreen swimmerName={playerName} swimmerLevel={playerLevel} />;
      case 'CLUB':
        return <ClubScreen clubName="Aqua Dragons" />;
      case 'LIVE_EVENTS':
        return <LiveEventsScreen onEventSelect={(eventId) => {
          console.log('Selected event:', eventId);
        }} />;
      case 'SOCIAL':
        return <SocialScreen playerName={playerName} />;
      case 'STORE':
        return <StoreScreen playerPremiumCurrency={premiumCurrency} playerCoins={softCurrency} />;
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
      rightPanel={<HomeRightPanel />}
    >
      {renderScreen()}
    </GlobalMenuLayout>
  );
};

export default MainMenu;
