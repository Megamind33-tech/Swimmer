import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { PaneSwitcher } from '../ui/PaneSwitcher'
import { useA11y } from '../context/AccessibilityContext'
import {
  BellIcon,
  GiftIcon,
  StarIcon,
  SparklesIcon,
  UsersIcon,
  GaugeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  RefreshCwIcon,
  SaveIcon,
  CheckIcon,
  Gamepad2Icon,
  MonitorIcon,
  Volume2Icon,
  EyeIcon,
  UserIcon,
  ActivityIcon,
  TimerResetIcon,
  TargetIcon,
  HeartPulseIcon,
  ChevronRightIcon,
} from 'lucide-react'
import type { ControlsPreset } from '../input/inputTypes'
import { clampPreset } from '../input/controlsSettings'
import { loadPreset, savePreset, resetPreset } from '../input/controlsSettings'
import type { PerformancePreset, PostProcessQuality } from '../performance/performancePreset'
import { loadPerformancePreset, savePerformancePreset, DEFAULT_PERFORMANCE_PRESET } from '../performance/performancePreset'
import { playerManager } from '../data/PlayerManager'
import { getSignedAthletes, recoverSignedAthlete, trainSignedAthlete, type SignedAthlete } from '../utils/clubRoster'
import { getNpcAcademySnapshot, getReadinessLabel, simulateNpcAcademy, TRAINING_PROGRAMS, type NpcAcademyAthlete, type TrainingFocus, type TrainingSessionResult } from '../utils/trainingSystem'
import type { IPlayerSwimmer } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// Design constants
// ─────────────────────────────────────────────────────────────────────────────

const AQUA  = 'var(--color-volt)';
const CYAN  = 'var(--color-primary-dim)';
const GOLD  = 'var(--color-volt)';
const PANEL = 'rgba(4,20,33,0.76)';
const PANEL_BORDER = 'var(--lobby-panel-border)';

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-components (used across Settings + Training)
// ─────────────────────────────────────────────────────────────────────────────

interface SliderRowProps {
  label:    string;
  value:    number;
  min:      number;
  max:      number;
  step:     number;
  unit?:    string;
  display?: (v: number) => string;
  onChange: (v: number) => void;
}

function SliderRow({ label, value, min, max, step, unit = '', display, onChange }: SliderRowProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '12px', color: '#A9D3E7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: AQUA, minWidth: '50px', textAlign: 'right' }}>
          {display ? display(value) : `${value}${unit}`}
        </span>
      </div>
      <div style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: '4px', borderRadius: '2px', background: 'rgba(56,214,255,0.12)' }} />
        <div style={{ position: 'absolute', left: 0, height: '4px', borderRadius: '2px', width: `${pct}%`, background: `linear-gradient(90deg, ${AQUA}, ${CYAN})`, boxShadow: `0 0 6px rgba(56,214,255,0.55)` }} />
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{ position: 'absolute', left: 0, right: 0, width: '100%', opacity: 0, height: '20px', cursor: 'pointer', margin: 0 }}
        />
        <div style={{ position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)', width: '14px', height: '14px', borderRadius: '50%', background: AQUA, boxShadow: `0 0 8px ${AQUA}`, border: '2px solid white', pointerEvents: 'none' }} />
      </div>
    </div>
  )
}

interface ToggleRowProps {
  label:    string;
  hint?:    string;
  value:    boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, hint, value, onChange }: ToggleRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(56,214,255,0.08)' }}>
      <div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
        {hint && <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: '#A9D3E7', marginTop: '2px' }}>{hint}</div>}
      </div>
      {/* Toggle button: wrapper gives 44px touch target height around the 24px visual pill */}
      <button
        onClick={() => onChange(!value)}
        aria-pressed={value}
        aria-label={label}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minWidth: '52px', minHeight: '44px',
          background: 'transparent', border: 'none', cursor: 'pointer', flexShrink: 0, padding: '0',
        }}
      >
        <div style={{ width: '44px', height: '24px', borderRadius: '12px', background: value ? `linear-gradient(90deg, ${AQUA}, ${CYAN})` : 'rgba(255,255,255,0.10)', border: value ? 'none' : '1px solid rgba(255,255,255,0.18)', position: 'relative', boxShadow: value ? `0 0 10px rgba(56,214,255,0.40)` : 'none', transition: 'background 0.2s, box-shadow 0.2s', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '3px', left: value ? 'calc(100% - 19px)' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.3)', transition: 'left 0.18s cubic-bezier(0.34,1.56,0.64,1)' }} />
        </div>
      </button>
    </div>
  )
}

interface SegmentPickerProps {
  options:  string[];
  value:    string;
  onChange: (v: string) => void;
}

function SegmentPicker({ options, value, onChange }: SegmentPickerProps) {
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          aria-pressed={value === opt}
          style={{
            flex: 1,
            height: '44px', // raised from 32 px → meets TOUCH.minimum
            borderRadius: '8px', cursor: 'pointer',
            background: value === opt ? 'rgba(56,214,255,0.20)' : 'rgba(255,255,255,0.05)',
            border: value === opt ? `1px solid rgba(56,214,255,0.50)` : '1px solid rgba(255,255,255,0.10)',
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px',
            letterSpacing: '0.10em', textTransform: 'uppercase',
            color: value === opt ? AQUA : '#A9D3E7', transition: 'all 0.15s',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.50)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
      {children}
    </div>
  )
}

function PanelBox({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'rgba(56,214,255,0.04)', border: '1px solid rgba(56,214,255,0.10)', borderRadius: '12px', padding: '14px 16px', ...style }}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings Page
// ─────────────────────────────────────────────────────────────────────────────

type SettingsTab = 'CONTROLS' | 'GRAPHICS' | 'AUDIO' | 'ACCESSIBILITY' | 'ACCOUNT';

const SETTINGS_TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'CONTROLS',      label: 'Controls',      icon: <Gamepad2Icon size={14} /> },
  { id: 'GRAPHICS',      label: 'Graphics',       icon: <MonitorIcon  size={14} /> },
  { id: 'AUDIO',         label: 'Audio',          icon: <Volume2Icon  size={14} /> },
  { id: 'ACCESSIBILITY', label: 'Access',         icon: <EyeIcon      size={14} /> },
  { id: 'ACCOUNT',       label: 'Account',        icon: <UserIcon     size={14} /> },
];

interface HandednessPickerProps {
  value:    'left' | 'right';
  onChange: (v: 'left' | 'right') => void;
}

function HandednessPicker({ value, onChange }: HandednessPickerProps) {
  const opts: { id: 'left' | 'right'; label: string; desc: string }[] = [
    { id: 'right', label: 'RIGHT HAND', desc: 'Joystick left · Buttons right' },
    { id: 'left',  label: 'LEFT HAND',  desc: 'Buttons left · Joystick right' },
  ];
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {opts.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            style={{ flex: 1, padding: '10px 8px', borderRadius: '12px', cursor: 'pointer', background: active ? 'rgba(56,214,255,0.14)' : 'rgba(255,255,255,0.04)', border: active ? `1.5px solid ${AQUA}` : '1px solid rgba(255,255,255,0.10)', boxShadow: active ? `0 0 12px rgba(56,214,255,0.25)` : 'none', transition: 'all 0.15s' }}
          >
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: active ? AQUA : '#A9D3E7', letterSpacing: '0.08em' }}>{opt.label}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: active ? '#A9D3E7' : 'rgba(169,211,231,0.50)', marginTop: '3px' }}>{opt.desc}</div>
          </button>
        );
      })}
    </div>
  )
}

function ControlsPreview({ preset }: { preset: ControlsPreset }) {
  const joystickLeft = preset.handedness === 'right';
  const jSize = Math.round(preset.joystickSize * 0.55);
  const bSize = Math.round(preset.buttonSize  * 0.55);

  const joystick = (
    <div style={{ width: jSize, height: jSize, borderRadius: '50%', border: `1.5px solid ${AQUA}`, background: 'rgba(56,214,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ width: jSize * 0.36, height: jSize * 0.36, borderRadius: '50%', background: `rgba(56,214,255,0.55)`, boxShadow: `0 0 6px ${AQUA}` }} />
    </div>
  );

  const buttons = (
    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
      {['L', 'R'].map((l) => (
        <div key={l} style={{ width: bSize, height: bSize * 0.9, borderRadius: '8px', border: '1px solid rgba(56,214,255,0.28)', background: 'rgba(56,214,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', color: 'rgba(56,214,255,0.70)' }}>{l}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ background: 'rgba(4,20,33,0.80)', border: '1px solid rgba(56,214,255,0.15)', borderRadius: '14px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transform: `scale(${preset.hudScale})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}>
      {joystickLeft ? joystick : buttons}
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid rgba(56,214,255,0.20)` }} />
      {joystickLeft ? buttons : joystick}
    </div>
  );
}

export function SettingsPage() {
  const [activeTab,  setActiveTab]  = useState<SettingsTab>('CONTROLS');
  const [preset,     setPreset]     = useState<ControlsPreset>(loadPreset);
  const [perfPreset, setPerfPreset] = useState<PerformancePreset>(loadPerformancePreset);
  const [saved,      setSaved]      = useState(false);

  // Audio state
  const [masterVol,   setMasterVol]   = useState(80);
  const [musicVol,    setMusicVol]    = useState(70);
  const [sfxVol,      setSfxVol]      = useState(80);
  const [announcer,   setAnnouncer]   = useState(true);

  // Graphics state
  const [graphicsQ,   setGraphicsQ]   = useState('HIGH');
  const [waterQ,      setWaterQ]      = useState('HIGH');
  const [fpsTarget,   setFpsTarget]   = useState('60');
  const [vsync,       setVsync]       = useState(true);

  // Accessibility state — backed by A11yContext so changes affect the whole shell
  const { settings: a11y, update: updateA11y } = useA11y();
  const colorblind  = a11y.colorblind.toUpperCase();
  const fontSize    = a11y.fontSize.toUpperCase();
  const subtitles   = a11y.subtitles;
  const setColorblind  = (v: string) => updateA11y('colorblind', v.toLowerCase() as typeof a11y.colorblind);
  const setFontSize    = (v: string) => updateA11y('fontSize',   v.toLowerCase() as typeof a11y.fontSize);
  const setSubtitles   = (v: boolean) => updateA11y('subtitles', v);

  const update = useCallback(<K extends keyof ControlsPreset>(key: K, val: ControlsPreset[K]) => {
    setPreset((p) => clampPreset({ ...p, [key]: val }));
    setSaved(false);
  }, []);

  const updatePerf = useCallback(<K extends keyof PerformancePreset>(key: K, val: PerformancePreset[K]) => {
    setPerfPreset((p) => ({ ...p, [key]: val }));
    setSaved(false);
  }, []);

  const handleSave = () => {
    savePreset(preset);
    savePerformancePreset(perfPreset);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const fresh = resetPreset();
    setPreset(fresh);
    setPerfPreset({ ...DEFAULT_PERFORMANCE_PRESET });
    setSaved(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'CONTROLS':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <SectionLabel>Preview</SectionLabel>
              <ControlsPreview preset={preset} />
            </div>
            <div>
              <SectionLabel>Layout</SectionLabel>
              <HandednessPicker value={preset.handedness} onChange={(v) => update('handedness', v)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <SectionLabel>Sizes</SectionLabel>
              <SliderRow label="Joystick Size" value={preset.joystickSize} min={100} max={180} step={5} unit="px" onChange={(v) => update('joystickSize', v)} />
              <SliderRow label="Button Size" value={preset.buttonSize} min={72} max={120} step={4} unit="px" onChange={(v) => update('buttonSize', v)} />
              <SliderRow label="HUD Scale" value={preset.hudScale} min={0.75} max={1.5} step={0.05} display={(v) => `${Math.round(v * 100)}%`} onChange={(v) => update('hudScale', v)} />
              <SliderRow label="Camera Sensitivity" value={preset.cameraSensitivity} min={0.2} max={2.0} step={0.1} display={(v) => `${v.toFixed(1)}×`} onChange={(v) => update('cameraSensitivity', v)} />
            </div>
            <div>
              <SectionLabel>Feedback</SectionLabel>
              <ToggleRow label="Haptic Feedback" hint="Vibrate on button press" value={preset.hapticEnabled} onChange={(v) => update('hapticEnabled', v)} />
              <ToggleRow label="Audio Cues" hint="Click sounds on input" value={preset.audioCuesEnabled} onChange={(v) => update('audioCuesEnabled', v)} />
            </div>
          </div>
        );

      case 'GRAPHICS':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <SectionLabel>Quality</SectionLabel>
              <PanelBox style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '12px', color: '#A9D3E7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Graphics Quality</div>
                  <SegmentPicker options={['LOW', 'MEDIUM', 'HIGH', 'ULTRA']} value={graphicsQ} onChange={setGraphicsQ} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '12px', color: '#A9D3E7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Water Quality</div>
                  <SegmentPicker options={['LOW', 'MEDIUM', 'HIGH', 'ULTRA']} value={waterQ} onChange={setWaterQ} />
                </div>
              </PanelBox>
            </div>
            <div>
              <SectionLabel>Display</SectionLabel>
              <PanelBox style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '12px', color: '#A9D3E7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>FPS Target</div>
                  <SegmentPicker options={['30', '60', '120']} value={fpsTarget} onChange={setFpsTarget} />
                </div>
                <ToggleRow label="V-Sync" hint="Lock frame rate to display refresh" value={vsync} onChange={setVsync} />
              </PanelBox>
            </div>
            <div>
              <SectionLabel>Post Processing</SectionLabel>
              <PanelBox>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '12px', color: '#A9D3E7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Post-Process Quality</div>
                  <SegmentPicker options={['OFF', 'LOW', 'MEDIUM', 'HIGH']} value={perfPreset.postProcessQuality.toUpperCase()} onChange={(v) => updatePerf('postProcessQuality', v.toLowerCase() as PostProcessQuality)} />
                </div>
                <ToggleRow label="Reduced Effects" hint="Disable blur and glow for better FPS" value={perfPreset.reducedEffects} onChange={(v) => updatePerf('reducedEffects', v)} />
                <ToggleRow label="Low-End Mode" hint="Half resolution + 30 fps Babylon target" value={perfPreset.lowEndMode} onChange={(v) => updatePerf('lowEndMode', v)} />
              </PanelBox>
            </div>
          </div>
        );

      case 'AUDIO':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <SectionLabel>Volume</SectionLabel>
              <PanelBox style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <SliderRow label="Master Volume" value={masterVol} min={0} max={100} step={1} display={(v) => `${v}%`} onChange={setMasterVol} />
                <SliderRow label="Music Volume"  value={musicVol}  min={0} max={100} step={1} display={(v) => `${v}%`} onChange={setMusicVol} />
                <SliderRow label="SFX Volume"    value={sfxVol}    min={0} max={100} step={1} display={(v) => `${v}%`} onChange={setSfxVol} />
              </PanelBox>
            </div>
            <div>
              <SectionLabel>Voice</SectionLabel>
              <PanelBox>
                <ToggleRow label="Announcer Voice" hint="Broadcast commentary during races" value={announcer} onChange={setAnnouncer} />
              </PanelBox>
            </div>
            <div>
              <SectionLabel>Timing</SectionLabel>
              <PanelBox style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <SliderRow label="Timer Update Rate" value={perfPreset.timerHz} min={10} max={60} step={5} unit="Hz" onChange={(v) => updatePerf('timerHz', v)} />
                <SliderRow label="Cosmetic Update Rate" value={perfPreset.cosmeticHz} min={5} max={30} step={5} unit="Hz" onChange={(v) => updatePerf('cosmeticHz', v)} />
              </PanelBox>
            </div>
          </div>
        );

      case 'ACCESSIBILITY':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <SectionLabel>Vision</SectionLabel>
              <PanelBox>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '12px', color: '#A9D3E7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Colorblind Mode</div>
                  <SegmentPicker options={['OFF', 'PROTAN', 'DEUTAN', 'TRITAN']} value={colorblind} onChange={setColorblind} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '12px', color: '#A9D3E7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Font Size</div>
                  <SegmentPicker options={['SMALL', 'NORMAL', 'LARGE', 'XL']} value={fontSize} onChange={setFontSize} />
                </div>
              </PanelBox>
            </div>
            <div>
              <SectionLabel>Display</SectionLabel>
              <PanelBox>
                {/* High Contrast — now wired to A11yContext so shell immediately responds */}
                <ToggleRow label="High Contrast" hint="Strengthen borders, backgrounds, and text for readability" value={a11y.highContrast} onChange={(v) => updateA11y('highContrast', v)} />
              </PanelBox>
            </div>
            <div>
              <SectionLabel>Motion</SectionLabel>
              <PanelBox>
                {/* Reduced Motion — synced to both perfPreset and A11yContext */}
                <ToggleRow
                  label="Reduced Motion"
                  hint="Disables pulse rings, slide animations, and motion effects across the whole app"
                  value={a11y.reducedMotion}
                  onChange={(v) => {
                    updateA11y('reducedMotion', v);
                    updatePerf('reducedMotion', v);
                  }}
                />
                <ToggleRow label="Show Subtitles" hint="Announcer and coach dialogue text" value={subtitles} onChange={setSubtitles} />
              </PanelBox>
            </div>
          </div>
        );

      case 'ACCOUNT':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <SectionLabel>Player</SectionLabel>
              <PanelBox>
                {[
                  { label: 'Player Name', value: 'Megamind' },
                  { label: 'Player ID',   value: 'PL-1847325' },
                  { label: 'Season',      value: 'Season 4 — Pro League' },
                  { label: 'Club OVR',    value: '113' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(56,214,255,0.08)' }}>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '12px', color: '#A9D3E7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: '#F3FBFF', letterSpacing: '0.04em' }}>{value}</span>
                  </div>
                ))}
              </PanelBox>
            </div>
            <button
              style={{ width: '100%', height: '44px', borderRadius: '12px', cursor: 'pointer', background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.35)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', letterSpacing: '0.10em', color: '#F87171', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              SIGN OUT
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '12px' }}
    >
      <div style={{ flex: 1, borderRadius: '20px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(18px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Gamepad2Icon size={18} color={AQUA} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#F3FBFF', letterSpacing: '0.06em', lineHeight: 1 }}>SETTINGS</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Reset: expanded to 44px to meet minimum touch target */}
            <button onClick={handleReset} aria-label="Reset settings" style={{ width: '44px', height: '44px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCwIcon size={15} color="#A9D3E7" />
            </button>
            <button onClick={handleSave} aria-label={saved ? 'Settings saved' : 'Save settings'} style={{ height: '44px', paddingInline: '18px', borderRadius: '10px', cursor: 'pointer', background: saved ? 'rgba(55,226,141,0.18)' : `linear-gradient(90deg, ${AQUA}, ${CYAN})`, border: saved ? '1px solid rgba(55,226,141,0.50)' : 'none', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: saved ? '0 0 12px rgba(55,226,141,0.30)' : `0 0 14px rgba(56,214,255,0.30)`, transition: 'all 0.2s' }}>
              {saved ? <CheckIcon size={14} color="#37E28D" /> : <SaveIcon size={14} color="var(--color-carbon)" />}
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.08em', color: saved ? '#37E28D' : 'var(--color-carbon)' }}>{saved ? 'SAVED' : 'SAVE'}</span>
            </button>
          </div>
        </div>

        {/* Tab strip */}
        <div
          role="tablist"
          aria-label="Settings sections"
          style={{ display: 'flex', gap: '4px', padding: '10px 20px 0', flexShrink: 0 }}
        >
          {SETTINGS_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                aria-label={tab.label}
                onClick={() => setActiveTab(tab.id)}
                className="swim26-settings-tab"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  paddingInline: '14px',
                  height: '44px', // raised from 34 px → meets TOUCH.minimum
                  borderRadius: '8px', cursor: 'pointer',
                  background: active ? 'rgba(56,214,255,0.16)' : 'rgba(255,255,255,0.04)',
                  border: active ? `1px solid rgba(56,214,255,0.40)` : '1px solid transparent',
                  color: active ? AQUA : '#A9D3E7',
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px',
                  letterSpacing: '0.10em', textTransform: 'uppercase', transition: 'all 0.15s',
                  boxShadow: active ? `0 0 10px rgba(56,214,255,0.20)` : 'none',
                  outline: 'none',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 20px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Training Page — full game-native training center
// ─────────────────────────────────────────────────────────────────────────────

type TrainingTargetMode = 'career' | 'club';
type TrainingTarget =
  | { id: string; label: string; kind: 'career'; athlete: IPlayerSwimmer }
  | { id: string; label: string; kind: 'club'; athlete: SignedAthlete };

interface Drill {
  id: TrainingFocus;
  label: string;
  icon: React.ReactNode;
  stat: string;
  delta: string;
  color: string;
  desc: string;
  sets: number;
  reps: string;
  rest: string;
  downside: string;
}

const DRILLS: Drill[] = [
  {
    id: 'STARTS', label: 'STARTS', icon: <GaugeIcon size={16} />, stat: 'Reaction', delta: 'Speed focus',
    color: AQUA, desc: 'Fast-twitch start work sharpens launch speed, but repeated explosive loading taxes race-day pop.',
    sets: 6, reps: '×1 dive', rest: '90s', downside: 'High neural load. Expect energy and race-power drain if stacked too often.',
  },
  {
    id: 'TURNS', label: 'TURNS', icon: <ActivityIcon size={16} />, stat: 'Turn Speed', delta: 'Technique focus',
    color: '#A78BFA', desc: 'Wall timing and push-off mechanics reward technique growth without fake instant OVR jumps.',
    sets: 8, reps: '×4 turns', rest: '60s', downside: 'Too much wall volume raises fatigue and can dull sharpness for the next race.',
  },
  {
    id: 'STROKE', label: 'STROKE RATE', icon: <TimerResetIcon size={16} />, stat: 'Efficiency', delta: 'Mechanics focus',
    color: '#34D399', desc: 'Technical rhythm sessions steadily lift stroke economy, endurance carryover, and consistency.',
    sets: 4, reps: '200m', rest: '120s', downside: 'Lower risk than power blocks, but long sessions still cost concentration and energy.',
  },
  {
    id: 'ENDURANCE', label: 'ENDURANCE', icon: <HeartPulseIcon size={16} />, stat: 'VO2 Max', delta: 'Aerobic focus',
    color: '#F87171', desc: 'Longer threshold sets are the best way to grow stamina, but they carry the heaviest fatigue bill.',
    sets: 3, reps: '400m', rest: '180s', downside: 'Excellent growth path, but overuse can tank energy and short-term race power.',
  },
  {
    id: 'PACE', label: 'PACE', icon: <TargetIcon size={16} />, stat: 'Split Ctrl', delta: 'Mental focus',
    color: GOLD, desc: 'Race-modeling sessions grow pacing judgement, finishing discipline, and sustainable endurance.',
    sets: 5, reps: '100m', rest: '90s', downside: 'Moderate fatigue. Benefits flatten if the athlete is already carrying heavy training load.',
  },
  {
    id: 'POWER', label: 'POWER', icon: <GaugeIcon size={16} />, stat: 'Peak Force', delta: 'Top-end focus',
    color: '#FB923C', desc: 'Resistance work gives the fastest visible speed gains, but it is punishing when the athlete is already tired.',
    sets: 5, reps: '50m', rest: '60s', downside: 'Largest short-term power tax. Great for upside, risky when readiness is low.',
  },
  {
    id: 'RECOVERY', label: 'RECOVERY', icon: <RefreshCwIcon size={16} />, stat: 'Reset', delta: 'Absorption focus',
    color: '#60A5FA', desc: 'Easy laps, mobility, and nervous-system reset restore the ability to benefit from future hard work.',
    sets: 2, reps: 'Easy 20m', rest: 'Light', downside: 'Minimal raw stat growth, but it prevents unrealistic nonstop progression.',
  },
];

function ensureCareerAthlete(): IPlayerSwimmer {
  const loaded = playerManager.loadPlayer();
  if (loaded) return loaded;
  return playerManager.createPlayer('Rising Star', 'ALL_AROUND', {
    height: 182,
    weight: 76,
    armSpan: 184,
    strokeRate: 88,
  });
}

function getTrainingTargets(mode: TrainingTargetMode, careerPlayer: IPlayerSwimmer, clubAthletes: SignedAthlete[]): TrainingTarget[] {
  if (mode === 'club') {
    return clubAthletes.map((athlete) => ({ id: athlete.id, label: athlete.name, kind: 'club' as const, athlete }));
  }
  return [{ id: careerPlayer.id, label: careerPlayer.name, kind: 'career' as const, athlete: careerPlayer }];
}

function formatSigned(value: number, suffix = ''): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}${suffix}`;
}

function StatLine({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: '10px', background: 'rgba(56,214,255,0.04)', border: '1px solid rgba(56,214,255,0.08)' }}>
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.62)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>{label}</span>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: accent ?? '#F3FBFF', letterSpacing: '0.04em' }}>{value}</span>
    </div>
  )
}

export function TrainingPage() {
  const [selectedDrill, setSelectedDrill] = useState<Drill>(DRILLS[0]);
  const [targetMode, setTargetMode] = useState<TrainingTargetMode>('career');
  const [careerPlayer, setCareerPlayer] = useState<IPlayerSwimmer>(() => ensureCareerAthlete());
  const [clubAthletes, setClubAthletes] = useState<SignedAthlete[]>(() => getSignedAthletes());
  const [npcAthletes, setNpcAthletes] = useState<NpcAcademyAthlete[]>(() => getNpcAcademySnapshot());
  const [selectedTargetId, setSelectedTargetId] = useState<string>(() => ensureCareerAthlete().id);
  const [minutes, setMinutes] = useState<number>(TRAINING_PROGRAMS.STARTS.recommendedMinutes);
  const [lastResult, setLastResult] = useState<TrainingSessionResult<any> | null>(null);

  const drill = selectedDrill;

  const refreshAll = useCallback(() => {
    setCareerPlayer(ensureCareerAthlete());
    setClubAthletes(getSignedAthletes());
    setNpcAthletes(getNpcAcademySnapshot());
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    setMinutes(TRAINING_PROGRAMS[drill.id].recommendedMinutes);
  }, [drill]);

  const targets = useMemo(() => getTrainingTargets(targetMode, careerPlayer, clubAthletes), [targetMode, careerPlayer, clubAthletes]);

  useEffect(() => {
    if (!targets.some((target) => target.id === selectedTargetId)) {
      setSelectedTargetId(targets[0]?.id ?? careerPlayer.id);
    }
  }, [targets, selectedTargetId, careerPlayer.id]);

  const activeTarget = targets.find((target) => target.id === selectedTargetId) ?? targets[0];
  const readinessLabel = activeTarget?.athlete.development ? getReadinessLabel(activeTarget.athlete.development) : 'Unavailable';

  const handleTrain = () => {
    if (!activeTarget) return;

    if (activeTarget.kind === 'career') {
      const result = playerManager.applyTrainingBlock(drill.id, minutes);
      if (result) setLastResult(result);
    } else {
      const result = trainSignedAthlete(activeTarget.id, drill.id, minutes);
      if (result) setLastResult(result);
    }

    setNpcAthletes(simulateNpcAcademy(Math.max(2, Math.round(minutes / 25))));
    refreshAll();
  };

  const handleRecovery = () => {
    if (!activeTarget) return;
    if (activeTarget.kind === 'career') {
      playerManager.recoverPlayer(18);
    } else {
      recoverSignedAthlete(activeTarget.id, 18);
    }
    setNpcAthletes(simulateNpcAcademy(2));
    setLastResult(null);
    refreshAll();
  };

  const drillSelector = (
    <div style={{ width: '190px', flexShrink: 0, borderRadius: '16px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(18px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '12px 14px 8px', flexShrink: 0 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: '#F3FBFF', letterSpacing: '0.06em' }}>PROGRAMS</div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.50)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '2px' }}>Growth with tradeoffs</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 12px' }}>
        {DRILLS.map((d) => {
          const active = d.id === drill.id;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDrill(d)}
              style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '9px 10px', minHeight: '58px', borderRadius: '10px', cursor: 'pointer', marginBottom: '4px', background: active ? 'rgba(56,214,255,0.12)' : 'rgba(255,255,255,0.03)', border: active ? '1px solid rgba(56,214,255,0.35)' : '1px solid transparent', transition: 'all 0.14s', boxShadow: active ? '0 0 10px rgba(56,214,255,0.12)' : 'none', textAlign: 'left' }}
            >
              <span style={{ color: active ? d.color : 'rgba(169,211,231,0.40)', transition: 'color 0.14s', marginTop: '2px' }}>{d.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', color: active ? '#F3FBFF' : 'rgba(169,211,231,0.65)', letterSpacing: '0.06em' }}>{d.label}</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: active ? d.color : 'rgba(169,211,231,0.35)', marginTop: '1px' }}>{d.delta}</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.40)', marginTop: '4px', lineHeight: 1.35 }}>{d.downside}</div>
              </div>
              {active && <ChevronRightIcon size={12} color={AQUA} />}
            </button>
          )
        })}
      </div>
    </div>
  )

  const activeDrillView = (
    <div style={{ flex: 1, borderRadius: '16px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(18px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '220px', height: '220px', borderRadius: '50%', background: drill.color, opacity: 0.06, filter: 'blur(60px)', pointerEvents: 'none' }} />
      <AnimatePresence mode="wait">
        <motion.div key={`${drill.id}-${activeTarget?.id ?? 'none'}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: drill.color }}>{drill.icon}</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', color: drill.color, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Shared Training Logic</span>
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1 }}>{drill.label}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.50)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{drill.stat}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: drill.color, letterSpacing: '0.06em' }}>{TRAINING_PROGRAMS[drill.id].recommendedMinutes}m</div>
            </div>
          </div>

          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', color: 'rgba(169,211,231,0.78)', lineHeight: 1.55, marginBottom: '16px', maxWidth: '560px' }}>
            {drill.desc}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {([['Sets', `${drill.sets}`], ['Reps', drill.reps], ['Rest', drill.rest], ['Downside', drill.downside]] as const).map(([label, value]) => (
              <div key={label} style={{ padding: '7px 12px', borderRadius: '8px', background: 'rgba(56,214,255,0.06)', border: '1px solid rgba(56,214,255,0.15)', maxWidth: label === 'Downside' ? '240px' : 'none' }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</div>
                <div style={{ fontFamily: label === 'Downside' ? "'Rajdhani', sans-serif" : "'Bebas Neue', sans-serif", fontSize: label === 'Downside' ? '10px' : '17px', color: label === 'Downside' ? '#FCA5A5' : AQUA, letterSpacing: '0.04em', lineHeight: 1.35 }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {([
                { id: 'career', label: 'INDIVIDUAL CAREER', count: 1 },
                { id: 'club', label: 'CLUB CAREER', count: clubAthletes.length },
              ] as const).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setTargetMode(mode.id)}
                  style={{ height: '34px', paddingInline: '12px', borderRadius: '9px', border: targetMode === mode.id ? '1px solid rgba(56,214,255,0.35)' : '1px solid rgba(255,255,255,0.08)', background: targetMode === mode.id ? 'rgba(56,214,255,0.12)' : 'rgba(255,255,255,0.03)', color: targetMode === mode.id ? '#F3FBFF' : 'rgba(169,211,231,0.65)', fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', cursor: 'pointer' }}
                >
                  {mode.label} {mode.id === 'club' ? `(${mode.count})` : ''}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {targets.map((target) => (
                <button
                  key={target.id}
                  onClick={() => setSelectedTargetId(target.id)}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: selectedTargetId === target.id ? `1px solid ${drill.color}` : '1px solid rgba(255,255,255,0.08)', background: selectedTargetId === target.id ? `${drill.color}18` : 'rgba(255,255,255,0.03)', color: '#F3FBFF', cursor: 'pointer', textAlign: 'left', minWidth: '140px' }}
                >
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.05em' }}>{target.label}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.60)', marginTop: '2px' }}>
                    OVR {target.athlete.ovr} • {getReadinessLabel(target.athlete.development!)} • POT {target.athlete.development?.potential}
                  </div>
                </button>
              ))}
              {targetMode === 'club' && targets.length === 0 && (
                <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px dashed rgba(56,214,255,0.18)', color: 'rgba(169,211,231,0.60)', fontFamily: "'Rajdhani', sans-serif", fontSize: '10px' }}>
                  Sign swimmers in Transfer Market to target them here one by one.
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) minmax(220px, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(56,214,255,0.04)', border: '1px solid rgba(56,214,255,0.08)' }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.50)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>Session Design</div>
              <SliderRow label="Minutes" value={minutes} min={20} max={120} step={5} unit="m" onChange={setMinutes} />
              <div style={{ marginTop: '10px', fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.60)', lineHeight: 1.45 }}>
                Recommended load is {TRAINING_PROGRAMS[drill.id].recommendedMinutes} minutes. Pushing beyond that increases gains only slightly, but fatigue and power cost rise sharply.
              </div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(56,214,255,0.04)', border: '1px solid rgba(56,214,255,0.08)' }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.50)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>Target Preview</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <StatLine label="Readiness" value={readinessLabel} accent={drill.color} />
                <StatLine label="Potential" value={String(activeTarget?.athlete.development?.potential ?? '--')} accent={GOLD} />
                <StatLine label="Energy" value={String(Math.round(activeTarget?.athlete.development?.energy ?? 0))} />
                <StatLine label="Race Power" value={String(Math.round(activeTarget?.athlete.development?.racePower ?? 0))} />
                <StatLine label="Fatigue" value={String(Math.round(activeTarget?.athlete.development?.fatigue ?? 0))} accent="#F87171" />
                <StatLine label="Training Load" value={String(Math.round(activeTarget?.athlete.development?.trainingLoad ?? 0))} accent="#C4B5FD" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
            <button onClick={handleTrain} disabled={!activeTarget} style={{ flex: 1, height: '46px', borderRadius: '12px', cursor: activeTarget ? 'pointer' : 'not-allowed', background: activeTarget ? `linear-gradient(90deg, ${drill.color}, ${drill.color}BB)` : 'rgba(255,255,255,0.08)', border: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '0.10em', color: activeTarget ? 'var(--color-carbon)' : 'rgba(255,255,255,0.45)', boxShadow: activeTarget ? `0 0 20px ${drill.color}55` : 'none', transition: 'all 0.2s' }}>
              APPLY SESSION
            </button>
            <button onClick={handleRecovery} disabled={!activeTarget} style={{ width: '170px', height: '46px', borderRadius: '12px', cursor: activeTarget ? 'pointer' : 'not-allowed', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', letterSpacing: '0.10em', color: '#F3FBFF' }}>
              RECOVERY BLOCK
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )

  const statsPanel = (
    <div style={{ width: '220px', flexShrink: 0, borderRadius: '16px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(18px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '12px 14px 8px', flexShrink: 0 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: '#F3FBFF', letterSpacing: '0.06em' }}>DEVELOPMENT</div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.50)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '2px' }}>Growth, costs, and AI pressure</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 10px 14px', overflowY: 'auto' }}>
        {activeTarget && (
          <>
            <StatLine label="Current OVR" value={String(activeTarget.athlete.ovr)} accent={drill.color} />
            <StatLine label="Potential" value={String(activeTarget.athlete.development?.potential ?? '--')} accent={GOLD} />
            <StatLine label="Speed" value={String(Math.round(activeTarget.athlete.stats.speed ?? 0))} />
            <StatLine label="Stamina" value={String(Math.round(activeTarget.athlete.stats.stamina ?? 0))} />
            <StatLine label="Technique" value={String(Math.round(activeTarget.athlete.stats.technique ?? 0))} />
            {'endurance' in activeTarget.athlete.stats && <StatLine label="Endurance" value={String(Math.round(activeTarget.athlete.stats.endurance ?? 0))} />}
            {'mental' in activeTarget.athlete.stats && <StatLine label="Mental" value={String(Math.round(activeTarget.athlete.stats.mental ?? 0))} />}
          </>
        )}

        {lastResult && (
          <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(56,214,255,0.05)', border: '1px solid rgba(56,214,255,0.12)' }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(169,211,231,0.55)', textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: '8px' }}>Last Session</div>
            <div style={{ display: 'grid', gap: '6px' }}>
              <StatLine label="OVR Δ" value={formatSigned(lastResult.delta.ovr)} accent={lastResult.delta.ovr > 0 ? '#34D399' : '#F87171'} />
              <StatLine label="Energy Δ" value={formatSigned(lastResult.delta.energy)} accent={lastResult.delta.energy >= 0 ? '#34D399' : '#F87171'} />
              <StatLine label="Fatigue Δ" value={formatSigned(lastResult.delta.fatigue)} accent={lastResult.delta.fatigue <= 0 ? '#34D399' : '#F87171'} />
              <StatLine label="Power Δ" value={formatSigned(lastResult.delta.racePower)} accent={lastResult.delta.racePower >= 0 ? '#34D399' : '#F87171'} />
            </div>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {lastResult.summary.map((line, index) => (
                <div key={`${line}-${index}`} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.65)', lineHeight: 1.45 }}>{line}</div>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)' }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(212,168,67,0.60)', textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: '6px' }}>AI Development Watch</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {npcAthletes.slice(0, 3).map((npc) => (
              <div key={npc.id} style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px', color: '#F3FBFF' }}>{npc.name}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.50)', marginTop: '2px' }}>{npc.nation} • {npc.archetype}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: GOLD }}>{npc.ovr}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.50)' }}>{getReadinessLabel(npc.development!)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <PaneSwitcher
      panes={[
        {
          id: 'programs',
          label: 'PROGRAMS',
          icon: <TargetIcon size={12} />,
          content: (
            <div style={{ position: 'absolute', inset: 0, padding: '8px', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
              {DRILLS.map((d) => {
                const active = d.id === drill.id;
                return (
                  <button key={d.id} onClick={() => setSelectedDrill(d)} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px', borderRadius: '10px', cursor: 'pointer', background: active ? 'rgba(56,214,255,0.12)' : 'rgba(255,255,255,0.03)', border: active ? '1px solid rgba(56,214,255,0.35)' : '1px solid rgba(255,255,255,0.06)', textAlign: 'left' }}>
                    <span style={{ color: active ? d.color : 'rgba(169,211,231,0.40)' }}>{d.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', color: '#F3FBFF', letterSpacing: '0.06em' }}>{d.label}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.55)', marginTop: '2px', lineHeight: 1.35 }}>{d.downside}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          ),
        },
        {
          id: 'session',
          label: 'SESSION',
          content: <div style={{ position: 'absolute', inset: 0, padding: '8px', overflowY: 'auto' }}>{activeDrillView}</div>,
        },
        {
          id: 'stats',
          label: 'STATS',
          content: <div style={{ position: 'absolute', inset: 0, padding: '8px', overflowY: 'auto' }}>{statsPanel}</div>,
        },
      ]}
    >
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, display: 'flex', gap: '10px', padding: '10px' }}>
        {drillSelector}
        {activeDrillView}
        {statsPanel}
      </motion.div>
    </PaneSwitcher>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Remaining utility pages (Friends, Inbox, Events, Rewards, StarPass, Missions)
// ─────────────────────────────────────────────────────────────────────────────

interface UtilityLayoutProps {
  title: string
  subtitle: string
  accent: string
  children: React.ReactNode
}

function UtilityLayout({ title, subtitle, accent, children }: UtilityLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      style={{ position: 'absolute', inset: 0, padding: '10px' }}
    >
      <div style={{ height: '100%', borderRadius: '20px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(18px)', padding: '20px', overflowY: 'auto', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none', background: `radial-gradient(circle at 75% 18%, ${accent} 0%, transparent 58%)` }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#F3FBFF', letterSpacing: '0.06em', lineHeight: 1 }}>{title}</h1>
          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '13px', color: 'rgba(169,211,231,0.65)', marginTop: '4px', marginBottom: '18px' }}>{subtitle}</p>
          {children}
        </div>
      </div>
    </motion.div>
  )
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ padding: '14px 16px', borderRadius: '12px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(169,211,231,0.70)', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{icon}{label}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', color: '#F3FBFF', letterSpacing: '0.04em', marginTop: '8px' }}>{value}</div>
    </div>
  )
}

export function FriendsPage() {
  return (
    <UtilityLayout title="TEAMMATES" subtitle="Invite swimmers, assign captains, and build your social squad." accent="#6EE7FF">
      <div className="grid grid-cols-3 gap-4">
        <MetricCard icon={<UsersIcon size={13} />} label="ONLINE" value="18" />
        <MetricCard icon={<ShieldCheckIcon size={13} />} label="CLUBS" value="6" />
        <MetricCard icon={<StarIcon size={13} />} label="RIVALS" value="12" />
      </div>
    </UtilityLayout>
  )
}

export function InboxPage() {
  return (
    <UtilityLayout title="INBOX" subtitle="Match reports, gifts, league notices, and announcements." accent="#F87171">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {['League reward ready to claim', 'Friend request from AquaNova', 'Maintenance notice: 02:00 UTC'].map((msg) => (
          <div key={msg} style={{ padding: '12px 16px', borderRadius: '10px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '13px', color: '#F3FBFF' }}>{msg}</span>
            <BellIcon size={14} color="#F87171" />
          </div>
        ))}
      </div>
    </UtilityLayout>
  )
}

export function EventsPage() {
  return (
    <UtilityLayout title="LIVE EVENTS" subtitle="Compete in rotating events and limited-time challenges." accent="#A78BFA">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {['Relay Rush — starts in 2h', 'National Sprint — starts tomorrow', 'Legends Cup — live now'].map((event) => (
          <div key={event} style={{ padding: '12px 16px', borderRadius: '10px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '13px', color: '#F3FBFF' }}>{event}</span>
            <CalendarIcon size={14} color="#A78BFA" />
          </div>
        ))}
      </div>
    </UtilityLayout>
  )
}

export function RewardsPage() {
  return (
    <UtilityLayout title="REWARDS" subtitle="Claim milestones, daily rewards, and event prizes." accent="#34D399">
      <div className="grid grid-cols-3 gap-4">
        <MetricCard icon={<GiftIcon size={13} />}   label="DAILY"  value="Ready" />
        <MetricCard icon={<SparklesIcon size={13} />} label="SEASON" value="3 Claims" />
        <MetricCard icon={<StarIcon size={13} />}   label="EVENT"  value="1 Claim" />
      </div>
    </UtilityLayout>
  )
}

export function StarPassPage() {
  return (
    <UtilityLayout title="STAR PASS" subtitle="Level up tiers and unlock premium season items." accent="#FBBF24">
      <div style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(212,168,67,0.30)', background: 'rgba(212,168,67,0.08)' }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px', color: 'rgba(212,168,67,0.70)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Current Tier</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', color: GOLD, letterSpacing: '0.04em', lineHeight: 1 }}>42</div>
      </div>
    </UtilityLayout>
  )
}

export function BonusMissionsPage() {
  return (
    <UtilityLayout title="BONUS MISSIONS" subtitle="Finish special objectives for extra bonus currency." accent="#FB923C">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {['Win 3 races with Butterfly', 'Complete 5 training sessions', 'Buy 1 market player'].map((task) => (
          <div key={task} style={{ padding: '12px 16px', borderRadius: '10px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.04)', fontFamily: "'Rajdhani', sans-serif", fontSize: '13px', color: '#F3FBFF' }}>{task}</div>
        ))}
      </div>
    </UtilityLayout>
  )
}
