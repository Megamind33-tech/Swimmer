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
              <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                <label className="text-sm text-slate-300 mb-2 block">{option.label}</label>
                <select
                  value={option.value}
                  onChange={(e) => setSettings({ ...settings, [option.label.toLowerCase().replace(' ', '')]: e.target.value })}
                  className="w-full bg-slate-600/50 border border-slate-600/30 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
                >
                  {option.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={settings.vsync} onChange={(e) => setSettings({ ...settings, vsync: e.target.checked })} className="w-5 h-5" />
                <span className="text-white font-bold">V-Sync</span>
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
              <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-bold">{volume.label}</label>
                  <span className="text-cyan-400 font-bold">{volume.value}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume.value}
                  onChange={(e) => setSettings({ ...settings, [volume.key]: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            ))}
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={settings.announcer} onChange={(e) => setSettings({ ...settings, announcer: e.target.checked })} className="w-5 h-5" />
                <span className="text-white font-bold">Announcer Voice</span>
              </label>
            </div>
          </div>
        );
      case 'CONTROLS':
        return (
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <label className="text-sm text-slate-300 mb-2 block">Touch Mode</label>
              <select
                value={settings.touchMode}
                onChange={(e) => setSettings({ ...settings, touchMode: e.target.value })}
                className="w-full bg-slate-600/50 border border-slate-600/30 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="TAP">Tap</option>
                <option value="HOLD">Hold</option>
                <option value="SWIPE">Swipe</option>
              </select>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <div className="flex items-center justify-between mb-2">
                <label className="text-white font-bold">Sensitivity</label>
                <span className="text-cyan-400 font-bold">{settings.sensitivity}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sensitivity}
                onChange={(e) => setSettings({ ...settings, sensitivity: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={settings.hapticFeedback} onChange={(e) => setSettings({ ...settings, hapticFeedback: e.target.checked })} className="w-5 h-5" />
                <span className="text-white font-bold">Haptic Feedback</span>
              </label>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={settings.leftHanded} onChange={(e) => setSettings({ ...settings, leftHanded: e.target.checked })} className="w-5 h-5" />
                <span className="text-white font-bold">Left-Handed Mode</span>
              </label>
            </div>
          </div>
        );
      case 'CAMERA':
        return (
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <label className="text-sm text-slate-300 mb-2 block">Camera Mode</label>
              <select
                value={settings.cameraMode}
                onChange={(e) => setSettings({ ...settings, cameraMode: e.target.value })}
                className="w-full bg-slate-600/50 border border-slate-600/30 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="BROADCAST">Broadcast View</option>
                <option value="GAMEPLAY">Gameplay View</option>
                <option value="HYBRID">Hybrid View</option>
              </select>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <div className="flex items-center justify-between mb-2">
                <label className="text-white font-bold">Field of View</label>
                <span className="text-cyan-400 font-bold">{settings.fov}°</span>
              </div>
              <input
                type="range"
                min="40"
                max="120"
                value={settings.fov}
                onChange={(e) => setSettings({ ...settings, fov: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <div className="flex items-center justify-between mb-2">
                <label className="text-white font-bold">Camera Distance</label>
                <span className="text-cyan-400 font-bold">{settings.cameraDistance}</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={settings.cameraDistance}
                onChange={(e) => setSettings({ ...settings, cameraDistance: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        );
      case 'LANGUAGE':
        return (
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
            <label className="text-sm text-slate-300 mb-2 block">Game Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full bg-slate-600/50 border border-slate-600/30 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
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
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <label className="text-sm text-slate-300 mb-2 block">Colorblind Mode</label>
              <select
                value={settings.colorblindMode}
                onChange={(e) => setSettings({ ...settings, colorblindMode: e.target.value })}
                className="w-full bg-slate-600/50 border border-slate-600/30 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="OFF">Off</option>
                <option value="PROTANOPIA">Protanopia (Red-Green)</option>
                <option value="DEUTERANOPIA">Deuteranopia (Red-Green)</option>
                <option value="TRITANOPIA">Tritanopia (Blue-Yellow)</option>
              </select>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <label className="text-sm text-slate-300 mb-2 block">Font Size</label>
              <select
                value={settings.fontSize}
                onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
                className="w-full bg-slate-600/50 border border-slate-600/30 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="SMALL">Small</option>
                <option value="NORMAL">Normal</option>
                <option value="LARGE">Large</option>
                <option value="XLARGE">Extra Large</option>
              </select>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={settings.subtitles} onChange={(e) => setSettings({ ...settings, subtitles: e.target.checked })} className="w-5 h-5" />
                <span className="text-white font-bold">Show Subtitles</span>
              </label>
            </div>
          </div>
        );
      case 'ACCOUNT':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg p-6 border border-cyan-500/30">
              <h3 className="text-lg font-black text-white mb-3">Account Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Player Name:</span>
                  <span className="text-white font-bold">Elite Swimmer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Player ID:</span>
                  <span className="text-white font-mono">PL-1847325</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Created:</span>
                  <span className="text-white">March 1, 2025</span>
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-lg hover:shadow-red-500/50 text-white font-bold uppercase rounded-lg transition-all"
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
    <div className="w-full h-full overflow-y-auto p-8 space-y-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Settings</h1>
          <p className="text-slate-400">Customize your gaming experience</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold uppercase text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>{renderTab()}</div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={onSave}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/50 text-white font-black uppercase rounded-lg transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
