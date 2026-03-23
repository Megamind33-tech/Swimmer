import React, { useMemo, useState } from 'react';

import { LobbyScreen } from '../lobby/LobbyScreen';
import { CareerMode } from '../pages/CareerMode';
import { Championships } from '../pages/Championships';
import { Rankings } from '../pages/Rankings';
import { ClubManagement } from '../pages/ClubManagement';
import { TransferMarket } from '../pages/TransferMarket';
import { Scouts } from '../pages/Scouts';
import { TrainingPage, SettingsPage } from '../pages/UtilityPages';
import { SwimmerScreen } from '../components/menu/SwimmerScreen';
import { StoreScreen } from '../components/menu/StoreScreen';
import { ProfilePage } from '../pages/ProfilePage';
import { RewardsPage } from '../pages/RewardsPage';
import { useAthleteCareer, useClubCareer } from '../context/CareerSaveContext';

type MainTab = 'club' | 'race' | 'career' | 'market' | 'training';
type UtilityPage = 'settings' | 'profile' | 'rewards' | 'championships' | 'rankings' | 'scouts' | 'style' | 'store' | null;

type ScreenKey = MainTab | Exclude<UtilityPage, null>;
type IconName = 'home' | 'race' | 'squad' | 'market' | 'facility' | 'settings' | 'profile' | 'rewards' | 'rankings' | 'store' | 'scouts';

interface AppShellProps {
  onPlay: () => void;
}

interface NavItem {
  id: MainTab;
  label: string;
  icon: IconName;
}

interface UtilityLink {
  id: Exclude<UtilityPage, null>;
  label: string;
}

const RAIL_ITEMS: NavItem[] = [
  { id: 'club', label: 'HQ', icon: 'home' },
  { id: 'race', label: 'RACE', icon: 'race' },
  { id: 'career', label: 'SQUAD', icon: 'squad' },
  { id: 'market', label: 'MARKET', icon: 'market' },
  { id: 'training', label: 'FACILITIES', icon: 'facility' },
];

const HUD_LINKS: UtilityLink[] = [
  { id: 'championships', label: 'CHAMPS' },
  { id: 'scouts', label: 'SCOUTS' },
  { id: 'rankings', label: 'RANK' },
];

function InlineIcon({ name, size = 16, strokeWidth = 1.8 }: { name: IconName; size?: number; strokeWidth?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'home':
      return (
        <svg {...common}><path d="M2.5 7.2 8 2.8l5.5 4.4" /><path d="M4.2 6.8v6h7.6v-6" /><path d="M6.6 12.8V9.4h2.8v3.4" /></svg>
      );
    case 'race':
      return (
        <svg {...common}><path d="M2 11.7c1.9-1.5 3.8-2.2 5.7-2.2 1.9 0 3.4.7 6.3.7" /><path d="M2.4 8.7c1.3-.8 2.7-1.2 4.1-1.2 1.6 0 2.8.5 4.2.5" /><path d="M3 5.7h2.2" /><path d="M10.8 4.5 14 6" /></svg>
      );
    case 'squad':
      return (
        <svg {...common}><circle cx="5.2" cy="5.1" r="2.1" /><circle cx="11.2" cy="5.7" r="1.7" /><path d="M2.6 12.8c.4-2 1.8-3.1 4-3.1 2.2 0 3.6 1.1 4 3.1" /><path d="M9.2 12.8c.3-1.4 1.3-2.2 2.9-2.2 1.1 0 1.9.3 2.5.9" /></svg>
      );
    case 'market':
      return (
        <svg {...common}><path d="M2.6 4.5h10.8l-1.1 5.8H4z" /><path d="M5.2 4.5V3.1h5.6v1.4" /><circle cx="5.6" cy="12.8" r=".8" fill="currentColor" stroke="none" /><circle cx="10.8" cy="12.8" r=".8" fill="currentColor" stroke="none" /></svg>
      );
    case 'facility':
      return (
        <svg {...common}><path d="M3 13V3h10v10" /><path d="M5.5 13V9.8h5V13" /><path d="M5.3 5.4h1.3" /><path d="M9.4 5.4h1.3" /><path d="M5.3 7.4h1.3" /><path d="M9.4 7.4h1.3" /></svg>
      );
    case 'settings':
      return (
        <svg {...common}><circle cx="8" cy="8" r="2.2" /><path d="M8 2.2v1.4" /><path d="M8 12.4v1.4" /><path d="M13.8 8h-1.4" /><path d="M3.6 8H2.2" /><path d="m12.1 3.9-1 1" /><path d="m4.9 11.1-1 1" /><path d="m12.1 12.1-1-1" /><path d="m4.9 4.9-1-1" /></svg>
      );
    case 'profile':
      return (
        <svg {...common}><circle cx="8" cy="5.2" r="2.3" /><path d="M3.3 13c.7-2.2 2.3-3.3 4.7-3.3S12 10.8 12.7 13" /></svg>
      );
    case 'rewards':
      return (
        <svg {...common}><path d="M2.6 6h10.8v6.6H2.6z" /><path d="M8 6v6.6" /><path d="M3.8 3.4c0 1.1.8 1.9 1.9 1.9H8C8 4.2 7.2 3.4 6.1 3.4c-.8 0-1.5.4-2.3 1.2Z" /><path d="M12.2 3.4c0 1.1-.8 1.9-1.9 1.9H8c0-1.1.8-1.9 1.9-1.9.8 0 1.5.4 2.3 1.2Z" /></svg>
      );
    case 'rankings':
      return (
        <svg {...common}><path d="M3 12.8h10" /><path d="M4.4 12.8V8.6" /><path d="M8 12.8V5.8" /><path d="M11.6 12.8V3.8" /></svg>
      );
    case 'store':
      return (
        <svg {...common}><path d="M3 5.2h10l-.7 7.6H3.7z" /><path d="M5.5 5.2V4a2.5 2.5 0 0 1 5 0v1.2" /></svg>
      );
    case 'scouts':
      return (
        <svg {...common}><circle cx="7" cy="7" r="3.2" /><path d="m9.6 9.6 3 3" /><path d="M4.8 7h4.4" /><path d="M7 4.8v4.4" /></svg>
      );
    default:
      return null;
  }
}

function formatCompactNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return `${value}`;
}

export const AppShell: React.FC<AppShellProps> = ({ onPlay }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('race');
  const [utilityPage, setUtilityPage] = useState<UtilityPage>(null);
  const athleteCareer = useAthleteCareer();
  const clubCareer = useClubCareer();

  const athleteState = athleteCareer.state;
  const clubState = clubCareer.state;

  const currentScreen = (utilityPage ?? activeTab) as ScreenKey;

  const backLabel = utilityPage ? 'RETURN' : activeTab === 'race' ? 'HOME' : 'RACE HQ';

  const rightChips = useMemo(() => {
    const readiness = `${athleteState.readiness}%`;
    const budget = `$${formatCompactNumber(clubState.budget)}`;

    switch (currentScreen) {
      case 'career':
        return [
          { label: 'READY', value: readiness, accent: '#3FE098' },
        ];
      case 'club':
      case 'training':
        return [
          { label: 'BUDGET', value: budget, accent: '#FFB800' },
        ];
      case 'market':
        return [
          { label: 'TARGETS', value: `${clubState.transferTargets.length}`, accent: '#3FE098' },
        ];
      default:
        return [
          { label: 'COINS', value: formatCompactNumber(athleteState.coins), accent: '#FFB800' },
        ];
    }
  }, [athleteState.coins, athleteState.readiness, clubState.budget, clubState.transferTargets.length, currentScreen]);

  const handleBack = () => {
    if (utilityPage) {
      setUtilityPage(null);
      return;
    }

    setActiveTab('race');
  };

  const renderContent = () => {
    switch (utilityPage) {
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'rewards':
        return <RewardsPage />;
      case 'championships':
        return <Championships />;
      case 'rankings':
        return <Rankings />;
      case 'scouts':
        return <Scouts />;
      case 'style':
        return <SwimmerScreen />;
      case 'store':
        return <StoreScreen onBack={() => setUtilityPage(null)} />;
      default:
        switch (activeTab) {
          case 'club':
            return <ClubManagement />;
          case 'career':
            return <CareerMode />;
          case 'market':
            return <TransferMarket />;
          case 'training':
            return <TrainingPage />;
          case 'race':
          default:
            return <LobbyScreen onStartRace={onPlay} onNavigate={(tab) => {
              if (tab === 'career' || tab === 'club' || tab === 'market' || tab === 'training' || tab === 'race') {
                setUtilityPage(null);
                setActiveTab(tab);
                return;
              }

              if (tab === 'rewards' || tab === 'profile' || tab === 'championships' || tab === 'rankings' || tab === 'scouts' || tab === 'style' || tab === 'store' || tab === 'settings') {
                setUtilityPage(tab);
              }
            }} />;
        }
    }
  };

  return (
    <div className="swim26-shell-frame">
      <header className="hud swim26-hud-shell">
        <button className="back-btn" onClick={handleBack}>
          <span aria-hidden>‹</span>
          <span>{backLabel}</span>
        </button>

        <div className="swim26-hud-tabs" role="tablist" aria-label="HUD destinations">
          {HUD_LINKS.map((link, index) => (
            <React.Fragment key={link.id}>
              <button
                className={`tab ${currentScreen === link.id ? 'active' : ''}`}
                role="tab"
                aria-selected={currentScreen === link.id}
                onClick={() => setUtilityPage(link.id)}
              >
                {link.label}
              </button>
              {index < HUD_LINKS.length - 1 && <span className="tab-sep" aria-hidden />}
            </React.Fragment>
          ))}
        </div>

        <div className="swim26-hud-actions">
          <button
            className={`swim26-hud-utility ${currentScreen === 'rewards' ? 'is-active' : ''}`}
            onClick={() => setUtilityPage('rewards')}
            aria-label="Rewards"
            title="Rewards"
          >
            <InlineIcon name="rewards" />
          </button>
          <button
            className={`swim26-hud-utility ${currentScreen === 'profile' ? 'is-active' : ''}`}
            onClick={() => setUtilityPage('profile')}
            aria-label="Profile"
            title="Profile"
          >
            <InlineIcon name="profile" />
          </button>
          {rightChips.map((chip) => (
            <div className="hud-chip" key={chip.label}>
              <span className="hc-label">{chip.label}</span>
              <span className="hc-val" style={{ color: chip.accent }}>{chip.value}</span>
            </div>
          ))}
        </div>
      </header>

      <aside className="rail swim26-shell-rail" aria-label="Primary navigation">
        {RAIL_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`ri ${activeTab === item.id && utilityPage === null ? 'active' : ''}`}
            onClick={() => {
              setUtilityPage(null);
              setActiveTab(item.id);
            }}
            aria-label={item.label}
            title={item.label}
          >
            <InlineIcon name={item.icon} />
          </button>
        ))}

        <div className="swim26-rail-spacer" />
        <div className="swim26-rail-divider" aria-hidden />
        <button
          className={`ri ${currentScreen === 'settings' ? 'active' : ''}`}
          onClick={() => setUtilityPage('settings')}
          aria-label="Settings"
          title="Settings"
        >
          <InlineIcon name="settings" />
        </button>
      </aside>

      <main className="swim26-shell-main">
        <div className="swim26-main-atmosphere" aria-hidden>
          <div className="pool-bg" />
          <div className="swim26-shell-swimmer swim26-shell-swimmer--streamline">
            <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
              <ellipse cx="108" cy="20" rx="8" ry="9" fill="rgba(24,200,240,0.4)"/>
              <rect x="101" y="17" width="5" height="4" rx="1.5" fill="rgba(24,200,240,0.6)"/>
              <rect x="108" y="17" width="5" height="4" rx="1.5" fill="rgba(24,200,240,0.6)"/>
              <path d="M100 20 C80 20 40 18 8 20" stroke="rgba(24,200,240,0.35)" strokeWidth="5" strokeLinecap="round"/>
              <path d="M100 18 C90 15 70 13 4 16" stroke="rgba(24,200,240,0.28)" strokeWidth="3.5" strokeLinecap="round"/>
              <path d="M12 22 C8 26 4 30 2 34" stroke="rgba(24,200,240,0.22)" strokeWidth="3" strokeLinecap="round"/>
              <path d="M10 20 C6 24 3 28 1 28" stroke="rgba(24,200,240,0.18)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        <div className="swim26-main-scroll">{renderContent()}</div>
      </main>
    </div>
  );
};

export default AppShell;
