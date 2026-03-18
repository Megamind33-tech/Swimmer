import React, { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import {
  BellIcon,
  GiftIcon,
  SettingsIcon,
  SlidersHorizontalIcon,
  StarIcon,
  TrophyIcon,
  UsersIcon,
  ZapIcon,
  CalendarIcon,
  ShieldCheckIcon,
  RefreshCwIcon,
  SaveIcon,
  CheckIcon,
  Gamepad2Icon,
} from 'lucide-react'
import type { ControlsPreset } from '../input/inputTypes'
import { DEFAULT_CONTROLS_PRESET } from '../input/inputTypes'
import { loadPreset, savePreset, resetPreset, clampPreset } from '../input/controlsSettings'
import type { PerformancePreset, PostProcessQuality } from '../performance/performancePreset'
import { loadPerformancePreset, savePerformancePreset, DEFAULT_PERFORMANCE_PRESET } from '../performance/performancePreset'

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
      className="w-full h-full pt-20 pb-24 px-8"
    >
      <div className="h-full rounded-3xl border border-white/15 bg-black/45 backdrop-blur-md p-6 overflow-y-auto relative">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle at 75% 18%, ${accent} 0%, transparent 58%)` }}
        />
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white italic">{title}</h1>
          <p className="text-white/70 mt-2 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </motion.div>
  )
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-white/80 text-xs font-bold tracking-wider">{icon}{label}</div>
      <div className="text-white text-2xl font-black mt-2">{value}</div>
    </div>
  )
}

export function FriendsPage() {
  return (
    <UtilityLayout title="TEAMMATES" subtitle="Invite swimmers, assign captains, and build your social squad." accent="#6EE7FF">
      <div className="grid grid-cols-3 gap-4">
        <MetricCard icon={<UsersIcon size={14} />} label="ONLINE" value="18" />
        <MetricCard icon={<ShieldCheckIcon size={14} />} label="CLUBS" value="6" />
        <MetricCard icon={<StarIcon size={14} />} label="RIVALS" value="12" />
      </div>
    </UtilityLayout>
  )
}

export function InboxPage() {
  return (
    <UtilityLayout title="INBOX" subtitle="Match reports, gifts, league notices, and announcements." accent="#F87171">
      <div className="space-y-3">
        {['League reward ready to claim', 'Friend request from AquaNova', 'Maintenance notice: 02:00 UTC'].map((msg) => (
          <div key={msg} className="rounded-xl border border-white/15 bg-white/5 p-4 flex items-center justify-between">
            <div className="text-white/90">{msg}</div>
            <BellIcon size={16} className="text-red-300" />
          </div>
        ))}
      </div>
    </UtilityLayout>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Controls Settings Panel sub-components
// ─────────────────────────────────────────────────────────────────────────────

const AQUA  = '#38D6FF';
const CYAN  = '#7AE8FF';
const PANEL = 'rgba(4,20,33,0.76)';

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
        {/* Track */}
        <div style={{ position: 'absolute', left: 0, right: 0, height: '4px', borderRadius: '2px', background: 'rgba(56,214,255,0.12)' }} />
        {/* Fill */}
        <div style={{ position: 'absolute', left: 0, height: '4px', borderRadius: '2px', width: `${pct}%`, background: `linear-gradient(90deg, ${AQUA}, ${CYAN})`, boxShadow: `0 0 6px rgba(56,214,255,0.55)` }} />
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            position: 'absolute', left: 0, right: 0, width: '100%',
            opacity: 0, height: '20px', cursor: 'pointer', margin: 0,
          }}
        />
        {/* Thumb indicator */}
        <div style={{
          position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)',
          width: '14px', height: '14px', borderRadius: '50%',
          background: AQUA, boxShadow: `0 0 8px ${AQUA}`,
          border: '2px solid white', pointerEvents: 'none',
        }} />
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
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(56,214,255,0.08)' }}
    >
      <div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
        {hint && <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: '#A9D3E7', marginTop: '2px' }}>{hint}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: '44px', height: '24px', borderRadius: '12px',
          background: value ? `linear-gradient(90deg, ${AQUA}, ${CYAN})` : 'rgba(255,255,255,0.10)',
          border: value ? 'none' : '1px solid rgba(255,255,255,0.18)',
          position: 'relative', cursor: 'pointer', flexShrink: 0,
          boxShadow: value ? `0 0 10px rgba(56,214,255,0.40)` : 'none',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
      >
        <div style={{
          position: 'absolute', top: '3px',
          left: value ? 'calc(100% - 19px)' : '3px',
          width: '18px', height: '18px', borderRadius: '50%',
          background: 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          transition: 'left 0.18s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      </button>
    </div>
  )
}

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
            style={{
              flex: 1, padding: '10px 8px', borderRadius: '12px', cursor: 'pointer',
              background: active ? 'rgba(56,214,255,0.14)' : 'rgba(255,255,255,0.04)',
              border: active ? `1.5px solid ${AQUA}` : '1px solid rgba(255,255,255,0.10)',
              boxShadow: active ? `0 0 12px rgba(56,214,255,0.25)` : 'none',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: active ? AQUA : '#A9D3E7', letterSpacing: '0.08em' }}>
              {opt.label}
            </div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: active ? '#A9D3E7' : 'rgba(169,211,231,0.50)', marginTop: '3px' }}>
              {opt.desc}
            </div>
          </button>
        );
      })}
    </div>
  )
}

// Mini joystick preview
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
    <div style={{
      background: 'rgba(4,20,33,0.80)', border: '1px solid rgba(56,214,255,0.15)',
      borderRadius: '14px', padding: '12px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transform: `scale(${preset.hudScale})`, transformOrigin: 'top center',
      transition: 'transform 0.2s',
    }}>
      {joystickLeft ? joystick : buttons}
      {/* Center ring */}
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid rgba(56,214,255,0.20)` }} />
      {joystickLeft ? buttons : joystick}
    </div>
  );
}

export function SettingsPage() {
  const [preset,     setPreset]     = useState<ControlsPreset>(loadPreset);
  const [perfPreset, setPerfPreset] = useState<PerformancePreset>(loadPerformancePreset);
  const [saved,      setSaved]      = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      className="w-full h-full pt-20 pb-24 px-4"
    >
      <div style={{ height: '100%', borderRadius: '20px', border: '1px solid rgba(56,214,255,0.15)', background: PANEL, backdropFilter: 'blur(18px)', padding: '20px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Gamepad2Icon size={20} color={AQUA} />
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1 }}>CONTROLS</h1>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: '#A9D3E7', marginTop: '2px' }}>Joystick · Buttons · HUD · Feedback</p>
          </div>
        </div>

        {/* Live preview */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.50)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>PREVIEW</div>
          <ControlsPreview preset={preset} />
        </div>

        {/* Handedness */}
        <section style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.50)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>LAYOUT</div>
          <HandednessPicker value={preset.handedness} onChange={(v) => update('handedness', v)} />
        </section>

        {/* Sliders */}
        <section style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.50)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>SIZES</div>
          <SliderRow
            label="Joystick Size"
            value={preset.joystickSize}
            min={100} max={180} step={5} unit="px"
            onChange={(v) => update('joystickSize', v)}
          />
          <SliderRow
            label="Button Size"
            value={preset.buttonSize}
            min={72} max={120} step={4} unit="px"
            onChange={(v) => update('buttonSize', v)}
          />
          <SliderRow
            label="HUD Scale"
            value={preset.hudScale}
            min={0.75} max={1.5} step={0.05}
            display={(v) => `${Math.round(v * 100)}%`}
            onChange={(v) => update('hudScale', v)}
          />
          <SliderRow
            label="Camera Sensitivity"
            value={preset.cameraSensitivity}
            min={0.2} max={2.0} step={0.1}
            display={(v) => `${v.toFixed(1)}×`}
            onChange={(v) => update('cameraSensitivity', v)}
          />
        </section>

        {/* Toggles */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.50)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '4px' }}>FEEDBACK</div>
          <ToggleRow
            label="Haptic Feedback"
            hint="Vibrate on button press"
            value={preset.hapticEnabled}
            onChange={(v) => update('hapticEnabled', v)}
          />
          <ToggleRow
            label="Audio Cues"
            hint="Web Audio click sounds"
            value={preset.audioCuesEnabled}
            onChange={(v) => update('audioCuesEnabled', v)}
          />
        </section>

        {/* Performance */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.50)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '4px' }}>PERFORMANCE</div>

          {/* Post-process quality picker */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '12px', color: '#A9D3E7', marginBottom: '6px' }}>Post-Process Quality</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['off', 'low', 'medium', 'high'] as PostProcessQuality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => updatePerf('postProcessQuality', q)}
                  style={{
                    flex: 1, height: '32px', borderRadius: '8px', cursor: 'pointer',
                    background: perfPreset.postProcessQuality === q ? 'rgba(56,214,255,0.20)' : 'rgba(255,255,255,0.05)',
                    border: perfPreset.postProcessQuality === q ? '1px solid rgba(56,214,255,0.50)' : '1px solid rgba(255,255,255,0.10)',
                    fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px',
                    letterSpacing: '0.10em', textTransform: 'uppercase',
                    color: perfPreset.postProcessQuality === q ? AQUA : '#A9D3E7',
                  }}
                >
                  {q.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <ToggleRow
            label="Reduced Effects"
            hint="Disable blur & glow for better FPS"
            value={perfPreset.reducedEffects}
            onChange={(v) => updatePerf('reducedEffects', v)}
          />
          <ToggleRow
            label="Reduced Motion"
            hint="Stop caustic & pulse animations"
            value={perfPreset.reducedMotion}
            onChange={(v) => updatePerf('reducedMotion', v)}
          />
          <ToggleRow
            label="Low-End Mode"
            hint="Half resolution + 30fps Babylon target"
            value={perfPreset.lowEndMode}
            onChange={(v) => updatePerf('lowEndMode', v)}
          />

          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SliderRow
              label="Timer Update Rate"
              value={perfPreset.timerHz}
              min={10} max={60} step={5} unit="Hz"
              onChange={(v) => updatePerf('timerHz', v)}
            />
            <SliderRow
              label="Cosmetic Update Rate"
              value={perfPreset.cosmeticHz}
              min={5} max={30} step={5} unit="Hz"
              onChange={(v) => updatePerf('cosmeticHz', v)}
            />
          </div>
        </section>

        {/* Save / Reset buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1, height: '44px', borderRadius: '12px', cursor: 'pointer',
              background: saved ? 'rgba(55,226,141,0.18)' : `linear-gradient(90deg, ${AQUA}, ${CYAN})`,
              border: saved ? '1px solid rgba(55,226,141,0.50)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              boxShadow: saved ? '0 0 12px rgba(55,226,141,0.30)' : `0 0 18px rgba(56,214,255,0.35)`,
              transition: 'all 0.2s',
            }}
          >
            {saved ? <CheckIcon size={14} color="#37E28D" /> : <SaveIcon size={14} color="#041421" />}
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', letterSpacing: '0.08em', color: saved ? '#37E28D' : '#041421' }}>
              {saved ? 'SAVED!' : 'SAVE'}
            </span>
          </button>
          <button
            onClick={handleReset}
            style={{
              width: '44px', height: '44px', borderRadius: '12px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <RefreshCwIcon size={16} color="#A9D3E7" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function TrainingPage() {
  return (
    <UtilityLayout title="TRAINING CENTER" subtitle="Boost stamina, starts, turns, and speed for upcoming races." accent="#60A5FA">
      <div className="grid grid-cols-3 gap-4">
        <MetricCard icon={<ZapIcon size={14} />} label="SPEED DRILL" value="Lv. 7" />
        <MetricCard icon={<TrophyIcon size={14} />} label="TECHNIQUE" value="Lv. 6" />
        <MetricCard icon={<StarIcon size={14} />} label="ENDURANCE" value="Lv. 8" />
      </div>
    </UtilityLayout>
  )
}

export function EventsPage() {
  return (
    <UtilityLayout title="LIVE EVENTS" subtitle="Compete in rotating events and limited-time challenges." accent="#A78BFA">
      <div className="space-y-3">
        {['Relay Rush - starts in 2h', 'National Sprint - starts tomorrow', 'Legends Cup - live now'].map((event) => (
          <div key={event} className="rounded-xl border border-white/15 bg-white/5 p-4 flex items-center justify-between">
            <span className="text-white">{event}</span>
            <CalendarIcon size={16} className="text-purple-300" />
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
        <MetricCard icon={<GiftIcon size={14} />} label="DAILY" value="Ready" />
        <MetricCard icon={<TrophyIcon size={14} />} label="SEASON" value="3 Claims" />
        <MetricCard icon={<StarIcon size={14} />} label="EVENT" value="1 Claim" />
      </div>
    </UtilityLayout>
  )
}

export function StarPassPage() {
  return (
    <UtilityLayout title="STAR PASS" subtitle="Level up tiers and unlock premium season items." accent="#FBBF24">
      <div className="rounded-xl border border-yellow-300/30 bg-yellow-500/10 p-5">
        <div className="text-yellow-200 text-sm font-bold">CURRENT TIER</div>
        <div className="text-white text-4xl font-black">42</div>
      </div>
    </UtilityLayout>
  )
}

export function BonusMissionsPage() {
  return (
    <UtilityLayout title="BONUS MISSIONS" subtitle="Finish special objectives for extra bonus currency." accent="#FB923C">
      <div className="space-y-3">
        {['Win 3 races with Butterfly', 'Complete 5 training sessions', 'Buy 1 market player'].map((task) => (
          <div key={task} className="rounded-xl border border-white/15 bg-white/5 p-4 text-white/90">{task}</div>
        ))}
      </div>
    </UtilityLayout>
  )
}
