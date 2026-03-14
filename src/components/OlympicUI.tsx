/**
 * SWIMMER GAME - Olympic UI System
 * Professional, minimalist UI in Olympic/Football style
 * Clean typography, elite color scheme, smooth transitions
 */

import React, { useState } from 'react';
import '../styles/olympic-ui.css';

interface OlympicUIProps {
  onMenuSelect: (menu: string) => void;
  onGameStart: (mode: 'p2p' | 'multiplayer' | 'practice') => void;
  currentVenue?: string;
  onVenueChange?: (venue: string) => void;
  onLocationSelect?: (location: string) => void;
}

interface MenuState {
  activeMenu: 'main' | 'play' | 'training' | 'multiplayer' | 'settings' | 'locations';
}

export const OlympicUI: React.FC<OlympicUIProps> = ({
  onMenuSelect,
  onGameStart,
  currentVenue,
  onVenueChange,
  onLocationSelect,
}) => {
  const [menuState, setMenuState] = useState<MenuState>({ activeMenu: 'main' });
  const [selectedMode, setSelectedMode] = useState<'p2p' | 'multiplayer' | 'practice'>('p2p');

  const handleMenuChange = (menu: MenuState['activeMenu']) => {
    setMenuState({ activeMenu: menu });
    onMenuSelect(menu);
  };

  const handleGameStart = () => {
    onGameStart(selectedMode);
  };

  const handleVenueSelect = (venue: string) => {
    if (onLocationSelect) {
      onLocationSelect(venue);
    }
    if (onVenueChange) {
      onVenueChange(venue);
    }
  };

  return (
    <div className="olympic-ui">
      {/* Main Menu */}
      {menuState.activeMenu === 'main' && (
        <MainMenu onMenuSelect={handleMenuChange} />
      )}

      {/* Play Menu - Race Selection */}
      {menuState.activeMenu === 'play' && (
        <PlayMenu
          onBack={() => handleMenuChange('main')}
          onModeSelect={setSelectedMode}
          selectedMode={selectedMode}
          onStart={handleGameStart}
        />
      )}

      {/* Training Menu */}
      {menuState.activeMenu === 'training' && (
        <TrainingMenu
          onBack={() => handleMenuChange('main')}
          onLocationSelect={handleVenueSelect}
        />
      )}

      {/* Multiplayer Menu */}
      {menuState.activeMenu === 'multiplayer' && (
        <MultiplayerMenu onBack={() => handleMenuChange('main')} />
      )}

      {/* Locations Menu */}
      {menuState.activeMenu === 'locations' && (
        <LocationsMenu
          onBack={() => handleMenuChange('main')}
          currentVenue={currentVenue}
          onVenueSelect={handleVenueSelect}
        />
      )}

      {/* Settings Menu */}
      {menuState.activeMenu === 'settings' && (
        <SettingsMenu onBack={() => handleMenuChange('main')} />
      )}
    </div>
  );
};

// Main Menu Component
interface MainMenuProps {
  onMenuSelect: (menu: 'play' | 'training' | 'multiplayer' | 'locations' | 'settings') => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onMenuSelect }) => {
  return (
    <div className="olympic-menu main-menu">
      <div className="menu-header">
        <h1 className="olympic-title">AQUATIC ELITE</h1>
        <p className="olympic-subtitle">Championship Swimming Simulator</p>
      </div>

      <nav className="main-navigation">
        <button
          className="olympic-button button-primary"
          onClick={() => onMenuSelect('play')}
        >
          <span className="button-icon">▶</span>
          <span className="button-text">RACE</span>
        </button>

        <button
          className="olympic-button button-secondary"
          onClick={() => onMenuSelect('training')}
        >
          <span className="button-icon">⚡</span>
          <span className="button-text">TRAINING</span>
        </button>

        <button
          className="olympic-button button-secondary"
          onClick={() => onMenuSelect('multiplayer')}
        >
          <span className="button-icon">👥</span>
          <span className="button-text">MULTIPLAYER</span>
        </button>

        <button
          className="olympic-button button-secondary"
          onClick={() => onMenuSelect('locations')}
        >
          <span className="button-icon">📍</span>
          <span className="button-text">LOCATIONS</span>
        </button>

        <button
          className="olympic-button button-secondary"
          onClick={() => onMenuSelect('settings')}
        >
          <span className="button-icon">⚙️</span>
          <span className="button-text">SETTINGS</span>
        </button>
      </nav>

      <div className="menu-footer">
        <p className="footer-text">© 2026 Aquatic Elite Championship</p>
      </div>
    </div>
  );
};

// Play Menu Component
interface PlayMenuProps {
  onBack: () => void;
  onModeSelect: (mode: 'p2p' | 'multiplayer' | 'practice') => void;
  selectedMode: 'p2p' | 'multiplayer' | 'practice';
  onStart: () => void;
}

const PlayMenu: React.FC<PlayMenuProps> = ({
  onBack,
  onModeSelect,
  selectedMode,
  onStart,
}) => {
  return (
    <div className="olympic-menu play-menu">
      <div className="menu-header">
        <button className="back-button" onClick={onBack}>← BACK</button>
        <h2 className="menu-title">SELECT RACE MODE</h2>
      </div>

      <div className="mode-selector">
        <div
          className={`mode-card ${selectedMode === 'practice' ? 'active' : ''}`}
          onClick={() => onModeSelect('practice')}
        >
          <h3>PRACTICE</h3>
          <p>Solo racing</p>
          <p className="mode-description">Compete against the clock in a single lane</p>
        </div>

        <div
          className={`mode-card ${selectedMode === 'p2p' ? 'active' : ''}`}
          onClick={() => onModeSelect('p2p')}
        >
          <h3>P2P RACE</h3>
          <p>Head to Head</p>
          <p className="mode-description">Race against a single opponent</p>
        </div>

        <div
          className={`mode-card ${selectedMode === 'multiplayer' ? 'active' : ''}`}
          onClick={() => onModeSelect('multiplayer')}
        >
          <h3>CHAMPIONSHIP</h3>
          <p>Full race</p>
          <p className="mode-description">Race in full championship with 8 swimmers</p>
        </div>
      </div>

      <div className="mode-details">
        <h3>RACE DETAILS</h3>
        <div className="details-info">
          <div className="detail-item">
            <span className="detail-label">Distance:</span>
            <span className="detail-value">200m Freestyle</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Swimmers:</span>
            <span className="detail-value">
              {selectedMode === 'practice' ? '1' : selectedMode === 'p2p' ? '2' : '8'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Difficulty:</span>
            <span className="detail-value">Elite</span>
          </div>
        </div>
      </div>

      <button className="olympic-button button-primary" onClick={onStart}>
        <span className="button-icon">▶</span>
        <span className="button-text">START RACE</span>
      </button>
    </div>
  );
};

// Training Menu Component
interface TrainingMenuProps {
  onBack: () => void;
  onLocationSelect?: (location: string) => void;
}

const TrainingMenu: React.FC<TrainingMenuProps> = ({ onBack, onLocationSelect }) => {
  const handleEnter = (location: string) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  return (
    <div className="olympic-menu training-menu">
      <div className="menu-header">
        <button className="back-button" onClick={onBack}>← BACK</button>
        <h2 className="menu-title">TRAINING FACILITIES</h2>
      </div>

      <div className="training-locations">
        <div className="training-card">
          <h3>LOCKER ROOM</h3>
          <p className="location-desc">Preparation and warm-up area</p>
          <button className="select-button" onClick={() => handleEnter('locker')}>ENTER</button>
        </div>

        <div className="training-card">
          <h3>DRY LAND TRAINING</h3>
          <p className="location-desc">Strength and conditioning</p>
          <button className="select-button" onClick={() => handleEnter('training')}>ENTER</button>
        </div>

        <div className="training-card">
          <h3>POOL WORKOUT</h3>
          <p className="location-desc">Swimming drills and exercises</p>
          <button className="select-button" onClick={() => handleEnter('pool')}>ENTER</button>
        </div>

        <div className="training-card">
          <h3>COACHING SESSION</h3>
          <p className="location-desc">Personal coaching feedback</p>
          <button className="select-button" onClick={() => handleEnter('school')}>ENTER</button>
        </div>
      </div>
    </div>
  );
};

// Multiplayer Menu Component
interface MultiplayerMenuProps {
  onBack: () => void;
}

const MultiplayerMenu: React.FC<MultiplayerMenuProps> = ({ onBack }) => {
  return (
    <div className="olympic-menu multiplayer-menu">
      <div className="menu-header">
        <button className="back-button" onClick={onBack}>← BACK</button>
        <h2 className="menu-title">MULTIPLAYER</h2>
      </div>

      <div className="multiplayer-options">
        <div className="option-card">
          <h3>JOIN ROOM</h3>
          <p>Enter an existing multiplayer session</p>
          <input type="text" placeholder="Room Code" className="input-field" />
          <button className="select-button">JOIN</button>
        </div>

        <div className="option-card">
          <h3>CREATE ROOM</h3>
          <p>Start a new multiplayer session</p>
          <button className="select-button">CREATE</button>
        </div>

        <div className="option-card">
          <h3>RANKED MATCHES</h3>
          <p>Compete in ranked championship races</p>
          <button className="select-button">FIND MATCH</button>
        </div>

        <div className="option-card">
          <h3>TOURNAMENT</h3>
          <p>Join seasonal tournaments</p>
          <button className="select-button">BROWSE</button>
        </div>
      </div>
    </div>
  );
};

// Locations Menu Component
interface LocationsMenuProps {
  onBack: () => void;
  currentVenue?: string;
  onVenueSelect: (venue: string) => void;
}

const LocationsMenu: React.FC<LocationsMenuProps> = ({
  onBack,
  currentVenue,
  onVenueSelect,
}) => {
  const venues = [
    { id: 'olympic', name: 'OLYMPIC ARENA', desc: 'World Championship venue' },
    { id: 'game7', name: 'GAME 7 FINALS', desc: 'High-energy championship' },
    { id: 'school', name: 'SCHOOL GYM', desc: 'Community pool facility' },
    { id: 'training', name: 'TRAINING CENTER', desc: 'Dry land training facility' },
    { id: 'locker', name: 'LOCKER ROOM', desc: 'Team preparation area' },
  ];

  return (
    <div className="olympic-menu locations-menu">
      <div className="menu-header">
        <button className="back-button" onClick={onBack}>← BACK</button>
        <h2 className="menu-title">VENUES & LOCATIONS</h2>
      </div>

      <div className="venues-grid">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className={`venue-card ${currentVenue === venue.id ? 'selected' : ''}`}
            onClick={() => onVenueSelect(venue.id)}
          >
            <h3>{venue.name}</h3>
            <p>{venue.desc}</p>
            {currentVenue === venue.id && <div className="selected-indicator">✓</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// Settings Menu Component
interface SettingsMenuProps {
  onBack: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onBack }) => {
  const [graphics, setGraphics] = useState<'high' | 'medium' | 'low'>('high');
  const [volume, setVolume] = useState(75);

  return (
    <div className="olympic-menu settings-menu">
      <div className="menu-header">
        <button className="back-button" onClick={onBack}>← BACK</button>
        <h2 className="menu-title">SETTINGS</h2>
      </div>

      <div className="settings-section">
        <h3>GRAPHICS</h3>
        <div className="setting-group">
          {(['high', 'medium', 'low'] as const).map((quality) => (
            <button
              key={quality}
              className={`setting-button ${graphics === quality ? 'active' : ''}`}
              onClick={() => setGraphics(quality)}
            >
              {quality.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3>AUDIO</h3>
        <div className="setting-group">
          <label>Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="slider"
          />
          <span>{volume}%</span>
        </div>
      </div>

      <div className="settings-section">
        <h3>GAMEPLAY</h3>
        <div className="setting-group">
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            Show Performance Stats
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            Enable Music
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked />
            Display Dialogue
          </label>
        </div>
      </div>
    </div>
  );
};

export default OlympicUI;
