/**
 * Settings Screen - Advanced configuration
 * Graphics, Audio, Controls, Camera, Language, Accessibility, Account
 */

import React, { useState } from 'react';

type SettingsTab = 'GRAPHICS' | 'AUDIO' | 'CONTROLS' | 'CAMERA' | 'ACCOUNT' | 'ACCESSIBILITY' | 'LANGUAGE';

interface SettingsScreenProps {
  onSave?: () => void;
  onLogout?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onSave, onLogout }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('GRAPHICS');
  const [settings, setSettings] = useState({
    // Graphics
    quality: 'HIGH',
    resolution: '1920x1080',
    vsync: true,
    fps: 60,
    waterQuality: 'ULTRA',

    // Audio
    masterVolume: 80,
    musicVolume: 70,
    sfxVolume: 80,
    dialogueVolume: 100,
    announcer: true,

    // Controls
    touchMode: 'TAP',
    sensitivity: 50,
    hapticFeedback: true,
    leftHanded: false,

    // Camera
    cameraMode: 'BROADCAST',
    fov: 60,
    cameraDistance: 50,

    // Language
    language: 'English',

    // Accessibility
    colorblindMode: 'OFF',
    fontSize: 'NORMAL',
    subtitles: true,
  });

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'GRAPHICS',
      label: 'Graphics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'AUDIO',
      label: 'Audio',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707a1 1 0 011.414 0l4.707 4.707H20a1 1 0 011 1v4a1 1 0 01-1 1h-1.586l-4.707 4.707a1 1 0 01-1.414 0l-4.707-4.707z" />
        </svg>
      ),
    },
    {
      id: 'CONTROLS',
      label: 'Controls',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M7 12a5 5 0 1110 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'CAMERA',
      label: 'Camera',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        </svg>
      ),
    },
    {
      id: 'LANGUAGE',
      label: 'Language',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      id: 'ACCESSIBILITY',
      label: 'Accessibility',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'ACCOUNT',
      label: 'Account',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'GRAPHICS':
        return (
          <div className="space-y-4">
            {[
              { label: 'Graphics Quality', value: settings.quality, options: ['LOW', 'MEDIUM', 'HIGH', 'ULTRA'] },
              { label: 'Resolution', value: settings.resolution, options: ['1280x720', '1600x900', '1920x1080', '2560x1440'] },
              { label: 'FPS Target', value: settings.fps.toString(), options: ['30', '60', '120', '144'] },
              { label: 'Water Quality', value: settings.waterQuality, options: ['LOW', 'MEDIUM', 'HIGH', 'ULTRA'] },
            ].map((option, idx) => (
              <div key={idx} className="glass-panel rounded-lg p-5 border border-primary/20 kinetic-border shadow-lg shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all">
                <label className="text-sm text-secondary font-bold mb-3 block uppercase">{option.label}</label>
                <select
                  value={option.value}
                  onChange={(e) => setSettings({ ...settings, [option.label.toLowerCase().replace(' ', '')]: e.target.value })}
                  className="w-full bg-surface-container/50 border border-primary/30 rounded-lg px-4 py-3 text-on-background focus:outline-none focus:border-primary/80 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-base"
                >
                  {option.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <div className="glass-panel rounded-lg p-5 border border-primary/20 kinetic-border shadow-lg shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={settings.vsync} onChange={(e) => setSettings({ ...settings, vsync: e.target.checked })} className="w-6 h-6 accent-primary rounded border-2 border-primary/50" />
                <span className="text-on-background font-bold text-lg">V-Sync</span>
              </label>
            </div>
          </div>
        );
      case 'AUDIO':
        return (
          <div className="space-y-4">
            {[
              { label: 'Master Volume', key: 'masterVolume', value: settings.masterVolume },
              { label: 'Music Volume', key: 'musicVolume', value: settings.musicVolume },
              { label: 'SFX Volume', key: 'sfxVolume', value: settings.sfxVolume },
              { label: 'Dialogue Volume', key: 'dialogueVolume', value: settings.dialogueVolume },
            ].map((volume, idx) => (
              <div key={idx} className="glass-panel rounded-lg p-5 border border-secondary/20 kinetic-border shadow-lg shadow-secondary/10 hover:shadow-lg hover:shadow-secondary/20 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-on-background font-bold text-lg">{volume.label}</label>
                  <span className="text-secondary font-bold bg-secondary/20 px-3 py-1 rounded-full text-sm">{volume.value}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume.value}
                  onChange={(e) => setSettings({ ...settings, [volume.key]: parseInt(e.target.value) })}
                  className="w-full accent-secondary h-2 rounded-full"
                />
              </div>
            ))}
            <div className="glass-panel rounded-lg p-5 border border-secondary/20 kinetic-border shadow-lg shadow-secondary/10 hover:shadow-lg hover:shadow-secondary/20 transition-all">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={settings.announcer} onChange={(e) => setSettings({ ...settings, announcer: e.target.checked })} className="w-6 h-6 accent-secondary rounded border-2 border-secondary/50" />
                <span className="text-on-background font-bold text-lg">Announcer Voice</span>
              </label>
            </div>
          </div>
        );
      case 'CONTROLS':
        return (
          <div className="space-y-4">
            <div className="glass-panel rounded-lg p-4 border border-outline/30 kinetic-border">
              <label className="text-sm text-on-surface-variant mb-2 block">Touch Mode</label>
              <select
                value={settings.touchMode}
                onChange={(e) => setSettings({ ...settings, touchMode: e.target.value })}
                className="w-full bg-surface-container border border-outline/30 rounded px-3 py-2 text-on-background focus:outline-none focus:border-primary/50"
              >
                <option value="TAP">Tap</option>
                <option value="HOLD">Hold</option>
                <option value="SWIPE">Swipe</option>
              </select>
            </div>
            <div className="glass-panel rounded-lg p-4 border border-outline/30 kinetic-border">
              <div className="flex items-center justify-between mb-2">
                <label className="text-on-background font-bold">Sensitivity</label>
                <span className="text-primary font-bold">{settings.sensitivity}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sensitivity}
                onChange={(e) => setSettings({ ...settings, sensitivity: parseInt(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>
            <div className="glass-panel rounded-lg p-4 border border-outline/30 kinetic-border">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={settings.hapticFeedback} onChange={(e) => setSettings({ ...settings, hapticFeedback: e.target.checked })} className="w-5 h-5" />
                <span className="text-on-background font-bold">Haptic Feedback</span>
              </label>
            </div>
            <div className="glass-panel rounded-lg p-4 border border-outline/30 kinetic-border">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={settings.leftHanded} onChange={(e) => setSettings({ ...settings, leftHanded: e.target.checked })} className="w-5 h-5" />
                <span className="text-on-background font-bold">Left-Handed Mode</span>
              </label>
            </div>
          </div>
        );
      case 'CAMERA':
        return (
          <div className="space-y-4">
            <div className="glass-panel rounded-lg p-4 border border-outline/30 kinetic-border">
              <label className="text-sm text-on-surface-variant mb-2 block">Camera Mode</label>
              <select
                value={settings.cameraMode}
                onChange={(e) => setSettings({ ...settings, cameraMode: e.target.value })}
                className="w-full bg-surface-container border border-outline/30 rounded px-3 py-2 text-on-background focus:outline-none focus:border-primary/50"
              >
                <option value="BROADCAST">Broadcast View</option>
                <option value="GAMEPLAY">Gameplay View</option>
                <option value="HYBRID">Hybrid View</option>
              </select>
            </div>
            <div className="glass-panel rounded-lg p-4 border border-outline/30 kinetic-border">
              <div className="flex items-center justify-between mb-2">
                <label className="text-on-background font-bold">Field of View</label>
                <span className="text-primary font-bold">{settings.fov}°</span>
              </div>
              <input
                type="range"
                min="40"
                max="120"
                value={settings.fov}
                onChange={(e) => setSettings({ ...settings, fov: parseInt(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>
            <div className="glass-panel rounded-lg p-4 border border-outline/30 kinetic-border">
              <div className="flex items-center justify-between mb-2">
                <label className="text-on-background font-bold">Camera Distance</label>
                <span className="text-primary font-bold">{settings.cameraDistance}</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={settings.cameraDistance}
                onChange={(e) => setSettings({ ...settings, cameraDistance: parseInt(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>
          </div>
        );
      case 'LANGUAGE':
        return (
          <div className="glass-panel rounded-lg p-4 border border-outline/30 kinetic-border">
            <label className="text-sm text-on-surface-variant mb-2 block">Game Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full bg-surface-container border border-outline/30 rounded px-3 py-2 text-on-background focus:outline-none focus:border-primary/50"
            >
              <option value="English">English</option>
              <option value="Japanese">日本語 (Japanese)</option>
              <option value="Spanish">Español (Spanish)</option>
              <option value="French">Français (French)</option>
              <option value="German">Deutsch (German)</option>
              <option value="Chinese">中文 (Chinese)</option>
            </select>
          </div>
        );
      case 'ACCESSIBILITY':
        return (
          <div className="space-y-4">
            <div className="glass-panel rounded-lg p-4 border border-outline/30 kinetic-border">
              <label className="text-sm text-on-surface-variant mb-2 block">Colorblind Mode</label>
              <select
                value={settings.colorblindMode}
                onChange={(e) => setSettings({ ...settings, colorblindMode: e.target.value })}
                className="w-full bg-surface-container border border-outline/30 rounded px-3 py-2 text-on-background focus:outline-none focus:border-primary/50"
              >
                <option value="OFF">Off</option>
                <option value="PROTANOPIA">Protanopia (Red-Green)</option>
                <option value="DEUTERANOPIA">Deuteranopia (Red-Green)</option>
                <option value="TRITANOPIA">Tritanopia (Blue-Yellow)</option>
              </select>
            </div>
            <div className="glass-panel rounded-lg p-4 border border-outline/30 kinetic-border">
              <label className="text-sm text-on-surface-variant mb-2 block">Font Size</label>
              <select
                value={settings.fontSize}
                onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
                className="w-full bg-surface-container border border-outline/30 rounded px-3 py-2 text-on-background focus:outline-none focus:border-primary/50"
              >
                <option value="SMALL">Small</option>
                <option value="NORMAL">Normal</option>
                <option value="LARGE">Large</option>
                <option value="XLARGE">Extra Large</option>
              </select>
            </div>
            <div className="glass-panel rounded-lg p-4 border border-outline/30 kinetic-border">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={settings.subtitles} onChange={(e) => setSettings({ ...settings, subtitles: e.target.checked })} className="w-5 h-5" />
                <span className="text-on-background font-bold">Show Subtitles</span>
              </label>
            </div>
          </div>
        );
      case 'ACCOUNT':
        return (
          <div className="space-y-4">
            <div className="glass-panel rounded-lg p-6 border border-primary/30 kinetic-border">
              <h3 className="text-lg font-black text-on-background mb-3 text-glow">Account Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Player Name:</span>
                  <span className="text-on-background font-bold">Elite Swimmer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Player ID:</span>
                  <span className="text-on-background font-mono">PL-1847325</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Account Created:</span>
                  <span className="text-on-background">March 1, 2025</span>
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full px-6 py-3 bg-gradient-to-r from-error to-error/80 hover:shadow-lg hover:shadow-error/50 text-on-background font-bold uppercase rounded-lg transition-all kinetic-border"
            >
              Logout
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-8 space-y-8 bg-surface">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-slide-in-down">
          <h1 className="text-5xl font-black text-primary mb-2 text-glow">Settings</h1>
          <p className="text-on-surface-variant text-lg">Customize your gaming experience</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 flex-wrap animate-slide-in-up">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase text-sm transition-all border ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-secondary text-on-primary shadow-lg shadow-primary/40 kinetic-border border-primary/60'
                  : 'glass-panel text-on-surface-variant border-outline/30 hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-slide-in-left">{renderTab()}</div>

        {/* Save Button */}
        <div className="flex gap-4 animate-slide-in-right">
          <button
            onClick={onSave}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-primary via-secondary to-primary hover:shadow-lg hover:shadow-primary/60 text-on-primary font-black uppercase rounded-lg transition-all kinetic-border border-primary/60 text-lg"
          >
            💾 Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
