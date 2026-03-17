import { useEffect, useMemo, useState } from 'react';

import GlobalMenuLayout, { MenuScreen } from './components/menu/GlobalMenuLayout';
import HomeScreen, { HomeRightPanel } from './components/menu/HomeScreen';
import PlayScreen from './components/menu/PlayScreen';
import CareerScreen from './components/menu/CareerScreen';
import SwimmerScreen from './components/menu/SwimmerScreen';
import ClubScreen from './components/menu/ClubScreen';
import LiveEventsScreen from './components/menu/LiveEventsScreen';
import SocialScreen from './components/menu/SocialScreen';
import StoreScreen from './components/menu/StoreScreen';
import LockerRoomScreen from './components/menu/LockerRoomScreen';
import RewardsInboxScreen from './components/menu/RewardsInboxScreen';
import PreRaceSetupScreen from './components/menu/PreRaceSetupScreen';
import SettingsScreen from './components/menu/SettingsScreen';
import RaceResultScreen from './components/menu/RaceResultScreen';
import marketplaceBackdropImage from './designs/custom_backgrounds/1dLNpgVzO02ceJe0YsHoa4tMHenXscN9M.jpg';
import eventsMainCardBackdropImage from './designs/custom_backgrounds/16GDP8cMj1ZeAFtQhML30ak33nG3RZIaL.jpg';
import careerMainCardBackdropImage from './designs/custom_backgrounds/1UtKXnTbZwj4daOsDHH1HLUgmCfvf81V9.jpg';

interface IntegrationNotice {
  id: number;
  title: string;
  detail: string;
}

const backendCapabilities = {
  rankedMatchmaking: false,
  trainingService: false,
  replayService: false,
  rewardsClaimService: false,
  purchaseCheckout: false,
  raceLaunchBridge: false,
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<MenuScreen>('HOME');
  const [integrationNotices, setIntegrationNotices] = useState<IntegrationNotice[]>([]);

  const pushNotice = (title: string, detail: string) => {
    setIntegrationNotices((prev) => [{ id: Date.now(), title, detail }, ...prev].slice(0, 4));
  };

  const navigate = (screen: MenuScreen) => setCurrentScreen(screen);

  const [isPortrait, setIsPortrait] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.innerHeight > window.innerWidth;
  });

  useEffect(() => {
    const updateOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    const orientationApi = screen.orientation as ScreenOrientation & {
      lock?: (orientation: 'landscape' | 'portrait') => Promise<void>;
    };

    if (orientationApi?.lock) {
      orientationApi.lock('landscape').catch(() => {
        // Some mobile browsers require fullscreen/user gesture.
      });
    }

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);


  useEffect(() => {
    const criticalImages = [
      marketplaceBackdropImage,
      eventsMainCardBackdropImage,
      careerMainCardBackdropImage,
    ];

    const preload = () => {
      criticalImages.forEach((src) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
      });
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback?.(preload);
      return;
    }

    const timeoutId = globalThis.setTimeout(preload, 0);
    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  const handleModeSelect = (modeId: string) => {
    if (modeId === 'quick-race') {
      setCurrentScreen('PRE_RACE');
      return;
    }

    if (modeId === 'career-race') {
      setCurrentScreen('CAREER');
      return;
    }

    if (modeId === 'ranked-match' && !backendCapabilities.rankedMatchmaking) {
      pushNotice('Ranked Matchmaking Missing', 'Backend endpoint for ranked queue is not connected yet.');
      return;
    }

    if (modeId === 'time-trial' || modeId === 'relay-mode' || modeId === 'ghost-race') {
      pushNotice('Gameplay Hook Missing', `${modeId} still needs gameplay bridge wiring from menu to race engine.`);
      return;
    }
  };

  const screenContent = useMemo(() => {
    switch (currentScreen) {
      case 'PLAY':
        return <PlayScreen onModeSelect={handleModeSelect} />;
      case 'CAREER':
        return <CareerScreen onEventSelect={() => setCurrentScreen('PRE_RACE')} />;
      case 'SWIMMER':
        return <SwimmerScreen />;
      case 'CLUB':
        return (
          <ClubScreen
            onLaunchArenaRace={() => {
              if (!backendCapabilities.raceLaunchBridge) {
                pushNotice('Race Launch Bridge Missing', '3D arena race launch is not connected yet. Wire menu-to-arena bridge.');
                return;
              }
              pushNotice('Launching Arena', 'Opening 3D swimming arena...');
            }}
          />
        );
      case 'LIVE_EVENTS':
        return <LiveEventsScreen onEventSelect={() => setCurrentScreen('PRE_RACE')} />;
      case 'SOCIAL':
        return <SocialScreen />;
      case 'STORE':
        return <StoreScreen playerPremiumCurrency={580} playerCoins={124650} />;
      case 'LOCKER_ROOM':
        return <LockerRoomScreen />;
      case 'REWARDS':
        return <RewardsInboxScreen />;
      case 'PRE_RACE':
        return (
          <PreRaceSetupScreen
            mode="Quick Race"
            onCancel={() => setCurrentScreen('PLAY')}
            onConfirmRace={() => {
              if (!backendCapabilities.raceLaunchBridge) {
                pushNotice('Race Launch Bridge Missing', 'Menu-to-gameplay scene launch function is not connected yet.');
              }
              setCurrentScreen('POST_GAME');
            }}
          />
        );
      case 'SETTINGS':
        return <SettingsScreen />;
      case 'POST_GAME':
        return (
          <RaceResultScreen
            onContinue={() => setCurrentScreen('CAREER')}
            onRematch={() => setCurrentScreen('PRE_RACE')}
            onReturnHome={() => setCurrentScreen('HOME')}
            onWatchReplay={() => {
              if (!backendCapabilities.replayService) {
                pushNotice('Replay Service Missing', 'Replay backend/storage is not connected yet.');
              }
            }}
          />
        );
      case 'HOME':
      default:
        return (
          <HomeScreen
            onPlayClick={() => setCurrentScreen('PLAY')}
            onCareerClick={() => setCurrentScreen('CAREER')}
            onSocialClick={() => setCurrentScreen('SOCIAL')}
          />
        );
    }
  }, [currentScreen]);


  if (isPortrait) {
    return (
      <div className="app-race-theme flex h-dvh w-screen items-center justify-center p-6 text-center">
        <div className="glass-panel max-w-sm rounded-lg border border-white/20 p-6">
          <div className="material-symbols-outlined mb-3 text-5xl text-primary-fixed">screen_rotation</div>
          <h1 className="text-xl font-black uppercase tracking-wide text-primary-fixed">Landscape Required</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            SWIM26 is locked to landscape mode. Rotate your device to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <GlobalMenuLayout
      currentScreen={currentScreen}
      onScreenChange={navigate}
      playerLevel={27}
      playerName="Lane Master"
      softCurrency={124650}
      premiumCurrency={580}
      onProfileClick={() => setCurrentScreen('SWIMMER')}
      onInboxClick={() => setCurrentScreen('SOCIAL')}
      onNotificationsClick={() => setCurrentScreen('LIVE_EVENTS')}
      onSettingsClick={() => setCurrentScreen('SETTINGS')}
      onQuickRaceClick={() => setCurrentScreen('PLAY')}
      onTrainingClick={() => {
        if (!backendCapabilities.trainingService) {
          pushNotice('Training Service Missing', 'Training mode API/service is not connected yet.');
        }
      }}
      onRankedClick={() => {
        if (!backendCapabilities.rankedMatchmaking) {
          pushNotice('Ranked Matchmaking Missing', 'Ranked queue backend is not connected yet.');
        }
      }}
      onLockerRoomClick={() => setCurrentScreen('LOCKER_ROOM')}
      onReplaysClick={() => {
        if (!backendCapabilities.replayService) {
          pushNotice('Replay Service Missing', 'Replay backend/storage is not connected yet.');
        }
      }}
      onRewardsClick={() => {
        if (backendCapabilities.rewardsClaimService) {
          setCurrentScreen('REWARDS');
          return;
        }
        pushNotice('Rewards Claim Missing', 'Rewards claiming backend function is not connected yet.');
        setCurrentScreen('REWARDS');
      }}
      rightPanel={
        <HomeRightPanel
          onOpenShop={() => setCurrentScreen('STORE')}
          onOpenShopItem={() => {
            setCurrentScreen('STORE');
            if (!backendCapabilities.purchaseCheckout) {
              pushNotice('Store Checkout Missing', 'Shop item purchase backend is not connected yet.');
            }
          }}
        />
      }
    >
      {screenContent}

      {integrationNotices.length > 0 && (
        <div className="fixed right-3 top-20 z-[80] w-80 max-w-[92vw] space-y-2">
          {integrationNotices.map((notice) => (
            <div key={notice.id} className="glass-panel border border-white/20 rounded-lg p-3">
              <p className="text-xs font-black uppercase tracking-wide text-primary-fixed">{notice.title}</p>
              <p className="mt-1 text-xs text-on-surface-variant">{notice.detail}</p>
            </div>
          ))}
        </div>
      )}
    </GlobalMenuLayout>
  );
}
