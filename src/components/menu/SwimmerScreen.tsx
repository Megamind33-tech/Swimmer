/**
 * Swimmer Screen — Athlete management hub, game UI
 * Attributes, skills, gear, appearance, records, biography
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import miaPhiriAthleteImage from '../../designs/835_mia_phiri_news.png_1/screen.png';

const AQUA        = 'var(--color-volt)';
const GOLD        = 'var(--color-volt)';
const PANEL       = 'rgba(4,20,33,0.76)';
const PANEL_BORDER = 'rgba(56,214,255,0.13)';
const PURPLE      = '#A78BFA';

type TabName = 'ATTRIBUTES' | 'SKILLS' | 'GEAR' | 'APPEARANCE' | 'RECORDS' | 'BIOGRAPHY';

interface SwimmerScreenProps {
  swimmerName?: string;
  swimmerLevel?: number;
}

const TABS: { id: TabName; label: string }[] = [
  { id: 'ATTRIBUTES', label: 'STATS'      },
  { id: 'SKILLS',     label: 'SKILLS'     },
  { id: 'GEAR',       label: 'GEAR'       },
  { id: 'APPEARANCE', label: 'LOOK'       },
  { id: 'RECORDS',    label: 'RECORDS'    },
  { id: 'BIOGRAPHY',  label: 'BIO'        },
];

export const SwimmerScreen: React.FC<SwimmerScreenProps> = ({
  swimmerName = 'Elite Swimmer',
  swimmerLevel = 45,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('ATTRIBUTES');

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: '8px', padding: '10px' }}>
      {/* ── LEFT: Athlete card ── */}
      <div style={{ width: '160px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', scrollbarWidth: 'none' }}>
        {/* Profile */}
        <div style={{ borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '16px', overflow: 'hidden', border: `2px solid rgba(56,214,255,0.25)`, boxShadow: '0 0 16px rgba(56,214,255,0.15)' }}>
              <img src={miaPhiriAthleteImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={swimmerName} />
            </div>
            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '22px', height: '22px', borderRadius: '7px', background: AQUA, border: '2px solid rgba(4,20,33,0.90)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: 'var(--color-carbon)', letterSpacing: '0.02em' }}>{swimmerLevel}</span>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1 }}>{swimmerName}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', fontWeight: 700, color: 'rgba(169,211,231,0.50)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '3px' }}>Level {swimmerLevel} Elite</div>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '10px 12px', flexShrink: 0 }}>
          <QuickStat label="World Rank"  value="#4"       color={GOLD} />
          <QuickStat label="Season"      value="S4 PRO"   color={AQUA} />
          <QuickStat label="Best Time"   value="51.23"    color="#F3FBFF" />
        </div>

        {/* XP bar */}
        <div style={{ borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '10px 12px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', fontWeight: 700, color: 'rgba(169,211,231,0.55)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>XP</span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', color: AQUA }}>4,850 / 6,000</span>
          </div>
          <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(56,214,255,0.10)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '80%', background: `linear-gradient(90deg, ${AQUA}, rgba(56,214,255,0.70))`, borderRadius: '2px', boxShadow: `0 0 6px rgba(56,214,255,0.50)` }} />
          </div>
        </div>

        {/* Tab nav */}
        <div style={{ flex: 1, borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ width: '100%', minHeight: '44px', borderRadius: '8px', cursor: 'pointer', background: active ? 'rgba(56,214,255,0.14)' : 'rgba(255,255,255,0.02)', border: active ? `1px solid rgba(56,214,255,0.38)` : '1px solid transparent', fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', letterSpacing: '0.10em', color: active ? AQUA : 'rgba(169,211,231,0.45)', textAlign: 'left', paddingInline: '10px', transition: 'all 0.14s', boxShadow: active ? '0 0 8px rgba(56,214,255,0.12)' : 'none' }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT: Tab content ── */}
      <div style={{ flex: 1, borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.16 }}
            style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '14px' }}
          >
            {renderTab(activeTab, swimmerName, swimmerLevel)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Tab renderers
// ─────────────────────────────────────────────────────────

function renderTab(tab: TabName, swimmerName: string, swimmerLevel: number): React.ReactNode {
  switch (tab) {
    case 'ATTRIBUTES': return <AttributesTab />;
    case 'SKILLS':     return <SkillsTab />;
    case 'GEAR':       return <GearTab />;
    case 'APPEARANCE': return <AppearanceTab />;
    case 'RECORDS':    return <RecordsTab />;
    case 'BIOGRAPHY':  return <BiographyTab swimmerName={swimmerName} swimmerLevel={swimmerLevel} />;
    default:           return null;
  }
}

// ─────────────────────────────────────────────────────────
// Attributes
// ─────────────────────────────────────────────────────────

function AttributesTab() {
  const attrs = [
    { name: 'Start Reaction',   value: 18, max: 20, color: AQUA  },
    { name: 'Underwater Power', value: 17, max: 20, color: GOLD  },
    { name: 'Turn Speed',       value: 16, max: 20, color: AQUA  },
    { name: 'Endurance',        value: 17, max: 20, color: AQUA  },
    { name: 'Finish Burst',     value: 18, max: 20, color: GOLD  },
    { name: 'Mental Composure', value: 16, max: 20, color: PURPLE },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <SectionHeader label="BIOMETRIC EFFICIENCY" extra="Integrity: 98.4%" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {attrs.map((a) => (
          <div key={a.name} style={{ borderRadius: '10px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.03)', padding: '10px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px', color: 'rgba(169,211,231,0.80)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{a.name}</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: a.color, letterSpacing: '0.04em', textShadow: `0 0 8px ${a.color}55` }}>{a.value}<span style={{ fontSize: '10px', color: 'rgba(169,211,231,0.35)' }}>/{a.max}</span></span>
            </div>
            <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(56,214,255,0.08)', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${(a.value / a.max) * 100}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ height: '100%', borderRadius: '2px', background: a.color, boxShadow: `0 0 5px ${a.color}66` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Skills
// ─────────────────────────────────────────────────────────

function SkillsTab() {
  const skills = [
    { name: 'Sprint Specialist', desc: '+10% speed in 50m/100m races', unlocked: true,  tier: 'MASTER'   },
    { name: 'Distance Runner',   desc: '+15% endurance in 800m+ races', unlocked: true,  tier: 'EXPERT'   },
    { name: 'Turn Precision',    desc: '+8% turn speed',               unlocked: true,  tier: 'ADVANCED' },
    { name: 'Relay Master',      desc: '+12% in team events',          unlocked: false, tier: 'LOCKED'   },
    { name: 'Comeback Finisher', desc: '+20% finish burst when trailing', unlocked: false, tier: 'LOCKED' },
    { name: 'Mental Iron',       desc: '+15% mental composure',        unlocked: false, tier: 'LOCKED'   },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <SectionHeader label="TECHNIQUE ARSENAL" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {skills.map((s) => (
          <div key={s.name} style={{ borderRadius: '10px', border: `1px solid ${s.unlocked ? 'rgba(56,214,255,0.15)' : PANEL_BORDER}`, background: s.unlocked ? 'rgba(56,214,255,0.04)' : 'rgba(0,0,0,0.20)', padding: '10px 12px', opacity: s.unlocked ? 1 : 0.45 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: '#F3FBFF', letterSpacing: '0.04em' }}>{s.name}</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', fontWeight: 700, color: s.unlocked ? AQUA : 'rgba(169,211,231,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '1px' }}>{s.tier}</div>
              </div>
              {s.unlocked
                ? <span style={{ fontSize: '12px', color: '#34D399' }}>✓</span>
                : <span style={{ fontSize: '12px', color: 'rgba(169,211,231,0.25)' }}>🔒</span>}
            </div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.55)', lineHeight: 1.4, marginBottom: '8px' }}>{s.desc}</div>
            <button style={{ width: '100%', minHeight: '44px', borderRadius: '7px', cursor: s.unlocked ? 'pointer' : 'not-allowed', background: s.unlocked ? 'rgba(56,214,255,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${s.unlocked ? 'rgba(56,214,255,0.20)' : 'rgba(255,255,255,0.05)'}`, fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', letterSpacing: '0.10em', color: s.unlocked ? AQUA : 'rgba(169,211,231,0.25)' }}>
              {s.unlocked ? 'OPTIMIZE' : 'LOCKED'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Gear
// ─────────────────────────────────────────────────────────

function GearTab() {
  const gear = [
    { type: 'Suit',    name: 'Pro Racing Suit',        rarity: 'EPIC',      stats: '+12 Aerocap',    icon: '🩱' },
    { type: 'Cap',     name: 'Aerodynamic Pro Cap',    rarity: 'RARE',      stats: '+5 Drag Reduc',  icon: '🎩' },
    { type: 'Goggles', name: 'Vision Pro Goggles',     rarity: 'EPIC',      stats: '+8 Peripheral',  icon: '🔍' },
    { type: 'Wedges',  name: 'Racing Blocks',          rarity: 'RARE',      stats: '+10 Launch',     icon: '⚙️' },
  ];
  const RARITY_COLOR: Record<string, string> = { EPIC: PURPLE, RARE: AQUA, LEGENDARY: GOLD, COMMON: 'rgba(169,211,231,0.45)' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <SectionHeader label="PROFESSIONAL ARMORY" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {gear.map((g) => (
          <div key={g.type} style={{ borderRadius: '10px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.03)', padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(56,214,255,0.08)', border: `1px solid rgba(56,214,255,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{g.icon}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', fontWeight: 700, color: 'rgba(169,211,231,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{g.type}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', fontWeight: 700, color: RARITY_COLOR[g.rarity] ?? AQUA, textTransform: 'uppercase', letterSpacing: '0.10em', marginTop: '1px' }}>{g.rarity}</div>
              </div>
            </div>
            <div style={{ borderRadius: '7px', background: 'rgba(0,0,0,0.28)', border: `1px solid ${PANEL_BORDER}`, padding: '5px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', fontWeight: 700, color: 'rgba(169,211,231,0.60)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{g.stats}</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', color: AQUA, letterSpacing: '0.10em', minHeight: '44px', minWidth: '44px', paddingInline: '8px' }}>SWAP</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Appearance
// ─────────────────────────────────────────────────────────

function AppearanceTab() {
  const options = [
    { name: 'Face Preset',        value: 'Asian Male #3',    },
    { name: 'Hair Style',         value: 'Short Buzz',       },
    { name: 'Body Type',          value: 'Athletic',         },
    { name: 'Walkout Animation',  value: 'Confident Stride', },
    { name: 'Victory Pose',       value: 'Arms Raised',      },
    { name: 'Celebration',        value: 'Water Splash',     },
  ];
  return (
    <div style={{ display: 'flex', gap: '10px', height: '100%' }}>
      {/* Preview */}
      <div style={{ width: '120px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(0,0,0,0.30)', position: 'relative' }}>
        <img src={miaPhiriAthleteImage} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} alt="Athlete preview" />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(4,20,33,0.90) 0%, transparent 100%)', padding: '8px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: AQUA, letterSpacing: '0.10em' }}>3D PREVIEW</div>
        </div>
      </div>
      {/* Options */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <SectionHeader label="ATHLETE VISUALS" />
        {options.map((opt) => (
          <button key={opt.name} style={{ width: '100%', borderRadius: '9px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.03)', padding: '7px 12px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', fontWeight: 700, color: 'rgba(169,211,231,0.55)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>{opt.name}</span>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', fontWeight: 700, color: '#F3FBFF' }}>{opt.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Records
// ─────────────────────────────────────────────────────────

function RecordsTab() {
  const records = [
    { stroke: 'Freestyle 100M',    time: '00:51.23', date: 'Mar 12, 2026', venue: 'Olympic Arena',     tier: 'WORLD',    color: GOLD },
    { stroke: 'Freestyle 200M',    time: '01:52.45', date: 'Mar 5, 2026',  venue: 'National Pool',    tier: 'NATIONAL', color: AQUA },
    { stroke: 'Butterfly 100M',    time: '00:56.12', date: 'Feb 28, 2026', venue: 'Championship Pool', tier: 'REGIONAL', color: PURPLE },
    { stroke: 'Breaststroke 100M', time: '01:03.87', date: 'Feb 21, 2026', venue: 'Training Facility', tier: 'LOCAL',    color: 'rgba(169,211,231,0.55)' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <SectionHeader label="HALL OF FAME" />
      {records.map((r) => (
        <div key={r.stroke} style={{ borderRadius: '10px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.03)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '3px', height: '40px', borderRadius: '2px', background: r.color, flexShrink: 0, boxShadow: `0 0 6px ${r.color}88` }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1 }}>{r.stroke}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.45)', marginTop: '3px' }}>{r.venue} · {r.date}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', fontWeight: 700, color: r.color, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '2px' }}>{r.tier}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: r.color, letterSpacing: '0.04em', textShadow: `0 0 8px ${r.color}55` }}>{r.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Biography
// ─────────────────────────────────────────────────────────

function BiographyTab({ swimmerName, swimmerLevel }: { swimmerName: string; swimmerLevel: number }) {
  const stats = [
    { label: 'Full Name',           value: swimmerName         },
    { label: 'Nationality',         value: 'United States'     },
    { label: 'Specialty',           value: 'Freestyle Sprint'  },
    { label: 'Club',                value: 'Aqua Dragons'      },
    { label: 'Career Phase',        value: 'Professional Elite' },
    { label: 'Physical Class',      value: 'Tier 1 Athlete'    },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <SectionHeader label="ATHLETE DOSSIER" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
        {stats.map((s) => (
          <div key={s.label} style={{ borderRadius: '9px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.03)', padding: '8px 12px' }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', fontWeight: 700, color: 'rgba(169,211,231,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '2px' }}>{s.label}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', fontWeight: 700, color: '#F3FBFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ borderRadius: '10px', border: `1px solid rgba(56,214,255,0.15)`, background: 'rgba(56,214,255,0.04)', padding: '12px 14px' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: AQUA, letterSpacing: '0.08em', marginBottom: '6px' }}>LEGACY ARC</div>
        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.65)', lineHeight: 1.55 }}>
          A rising champion with exceptional freestyle skills and the determination to reach the world stage. Known for a consistent training regimen and mental resilience under pressure. Currently pursuing national championship qualification while building an international reputation as a dominant force in high-intensity aquatic competition.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: `1px solid rgba(56,214,255,0.10)` }}>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', fontWeight: 700, color: 'rgba(169,211,231,0.45)', textTransform: 'uppercase' }}>Contract Status</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: '#34D399', letterSpacing: '0.06em' }}>SECURE · 3 SEASONS</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────────────────

function SectionHeader({ label, extra }: { label: string; extra?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', flexShrink: 0 }}>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', color: '#F3FBFF', letterSpacing: '0.06em' }}>{label}</span>
      {extra && <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', fontWeight: 700, color: AQUA, letterSpacing: '0.08em' }}>{extra}</span>}
    </div>
  );
}

function QuickStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: `1px solid rgba(56,214,255,0.08)` }}>
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', fontWeight: 700, color: 'rgba(169,211,231,0.50)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>{label}</span>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color, letterSpacing: '0.04em' }}>{value}</span>
    </div>
  );
}

export default SwimmerScreen;
