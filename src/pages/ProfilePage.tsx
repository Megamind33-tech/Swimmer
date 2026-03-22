import React, { useState } from 'react'
import { motion } from 'motion/react'
import { USER_DATA, PLAYER_SPONSORS, type Sponsor } from '../utils/gameData'
import {
  UserIcon,
  TrophyIcon,
  StarIcon,
  ZapIcon,
  ActivityIcon,
  TargetIcon,
  AwardIcon,
  BadgeIcon,
} from 'lucide-react'
import { PaneSwitcher, useIsLandscapeMobile } from '../ui/PaneSwitcher'

const AQUA = 'var(--color-volt)'
const GOLD = 'var(--color-volt)'
const PANEL = 'rgba(4,20,33,0.76)'
const PANEL_BORDER = 'rgba(56,214,255,0.13)'

const PLAYER_STATS = [
  { label: 'Speed',     value: 118, icon: <ZapIcon      size={12} color={AQUA} />, color: AQUA  },
  { label: 'Stamina',   value: 115, icon: <ActivityIcon  size={12} color={GOLD} />, color: GOLD  },
  { label: 'Technique', value: 119, icon: <TargetIcon    size={12} color='#A78BFA' />, color: '#A78BFA' },
  { label: 'Turn',      value: 116, icon: <ZapIcon       size={12} color='#34D399' />, color: '#34D399' },
  { label: 'Start',     value: 112, icon: <ActivityIcon  size={12} color='#F87171' />, color: '#F87171' },
  { label: 'Endurance', value: 114, icon: <TargetIcon    size={12} color='#FB923C' />, color: '#FB923C' },
]

const PERSONAL_RECORDS = [
  { event: '50m Freestyle',    time: '21.04', date: 'Mar 2026', pool: '50m' },
  { event: '100m Butterfly',   time: '49.82', date: 'Jan 2026', pool: '50m' },
  { event: '200m IM',          time: '1:52.34', date: 'Feb 2026', pool: '50m' },
  { event: '100m Backstroke',  time: '52.16', date: 'Mar 2026', pool: '50m' },
]

const TIER_COLORS: Record<Sponsor['tier'], { bg: string; border: string; text: string }> = {
  Title:  { bg: 'rgba(212,168,67,0.10)',  border: 'rgba(212,168,67,0.35)',  text: GOLD   },
  Gold:   { bg: 'rgba(212,168,67,0.06)',  border: 'rgba(212,168,67,0.20)',  text: GOLD   },
  Silver: { bg: 'rgba(169,211,231,0.05)', border: 'rgba(169,211,231,0.18)', text: AQUA   },
}

const PROFILE_TABS = ['STATS', 'RECORDS', 'SPONSORS'] as const
type ProfileTab = typeof PROFILE_TABS[number]

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('STATS')
  const isLandscape = useIsLandscapeMobile()

  const xpPercent = Math.round((USER_DATA.xp / USER_DATA.maxXp) * 100)

  // ── Left column ────────────────────────────────────────────────────────────
  const leftColumn = (
      <div style={{ width: '200px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Avatar + Name */}
        <div style={{ borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: isLandscape ? '8px 10px' : '16px', display: 'flex', flexDirection: isLandscape ? 'row' : 'column', alignItems: 'center', gap: isLandscape ? '10px' : '12px' }}>
          {/* Avatar circle */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: isLandscape ? '40px' : '72px', height: isLandscape ? '40px' : '72px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(56,214,255,0.20) 0%, rgba(56,214,255,0.06) 100%)', border: `2px solid rgba(56,214,255,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 24px rgba(56,214,255,0.20)` }}>
              <UserIcon size={isLandscape ? 18 : 32} color={AQUA} />
            </div>
            {/* Level badge */}
            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'linear-gradient(135deg, var(--color-volt), var(--color-primary-dim))', borderRadius: '50%', width: isLandscape ? '16px' : '22px', height: isLandscape ? '16px' : '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `${isLandscape ? '1px' : '2px'} solid rgba(4,20,33,0.90)` }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isLandscape ? '9px' : '11px', color: '#fff', letterSpacing: '0.02em' }}>{USER_DATA.level}</span>
            </div>
          </div>

          <div style={{ textAlign: isLandscape ? 'left' : 'center', minWidth: 0 }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isLandscape ? '14px' : '20px', color: '#F3FBFF', letterSpacing: '0.06em', lineHeight: 1 }}>{USER_DATA.username}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(212,168,67,0.70)', textTransform: 'uppercase', letterSpacing: '0.16em', marginTop: '3px' }}>Level {USER_DATA.level} Elite</div>
            {/* XP Bar — inline in landscape to save vertical space */}
            <div style={{ marginTop: isLandscape ? '4px' : '0px', width: isLandscape ? '100%' : undefined }}>
              {!isLandscape && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(169,211,231,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>XP</span>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(169,211,231,0.55)' }}>{USER_DATA.xp.toLocaleString()} / {USER_DATA.maxXp.toLocaleString()}</span>
                </div>
              )}
              <div style={{ height: '3px', borderRadius: '3px', background: 'rgba(0,0,0,0.40)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${xpPercent}%`, background: `linear-gradient(90deg, ${AQUA}, rgba(56,214,255,0.70))`, boxShadow: `0 0 8px rgba(56,214,255,0.50)`, borderRadius: '3px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: isLandscape ? '8px 10px' : '14px 16px' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.06em', marginBottom: isLandscape ? '6px' : '10px' }}>QUICK STATS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <QuickStatRow icon={<TrophyIcon size={12} color={GOLD} />}   label="World Rank"  value="#4"       />
            <QuickStatRow icon={<StarIcon   size={12} color={AQUA} />}   label="Season"      value="S4 PRO"   />
            <QuickStatRow icon={<AwardIcon  size={12} color="#A78BFA" />} label="Best 100m"  value="49.82"    />
            <QuickStatRow icon={<BadgeIcon  size={12} color="#34D399" />} label="Club OVR"   value={String(USER_DATA.clubOvr)} />
          </div>
        </div>

        {/* Sponsor count pill */}
        <div style={{ borderRadius: '12px', border: `1px solid rgba(212,168,67,0.20)`, background: 'linear-gradient(135deg, rgba(42,31,12,0.80), rgba(26,19,8,0.80))', backdropFilter: 'blur(12px)', padding: isLandscape ? '5px 10px' : '9px 12px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(212,168,67,0.60)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: isLandscape ? '1px' : '4px' }}>Active Sponsors</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isLandscape ? '16px' : '24px', color: GOLD, lineHeight: 1, textShadow: '0 0 14px rgba(212,168,67,0.40)' }}>{PLAYER_SPONSORS.length}</div>
          {!isLandscape && <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.45)', marginTop: '3px' }}>personal deals</div>}
        </div>
      </div>

  ) // end leftColumn

  // ── Right column ───────────────────────────────────────────────────────────
  const rightColumn = (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
        {/* Tab Bar */}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {PROFILE_TABS.map((tab) => {
            const active = tab === activeTab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  minHeight: '44px', paddingInline: '16px', paddingBlock: '6px', borderRadius: '8px', cursor: 'pointer',
                  background: active ? 'rgba(56,214,255,0.12)' : 'rgba(56,214,255,0.04)',
                  border: active ? `1px solid rgba(56,214,255,0.35)` : `1px solid ${PANEL_BORDER}`,
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: active ? AQUA : 'rgba(169,211,231,0.45)',
                  transition: 'all 0.18s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {activeTab === 'STATS' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              {/* Stat bars */}
              <div style={{ borderRadius: '12px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '10px 12px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '9px', flexShrink: 0 }}>
                  <ActivityIcon size={12} color={AQUA} />
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.06em' }}>ATHLETE ATTRIBUTES</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', overflowY: 'auto', flex: 1 }}>
                  {PLAYER_STATS.map((stat) => (
                    <div key={stat.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {stat.icon}
                          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px', color: 'rgba(255,255,255,0.70)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>{stat.label}</span>
                        </div>
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '17px', color: '#F3FBFF', letterSpacing: '0.04em' }}>{stat.value}</span>
                      </div>
                      <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(0,0,0,0.40)', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.value / 125) * 100}%` }}
                          transition={{ duration: 0.7, ease: 'easeOut' }}
                          style={{ height: '100%', background: stat.color, borderRadius: '3px', boxShadow: `0 0 6px ${stat.color}80` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'RECORDS' && (
            <motion.div
              key="records"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ height: '100%', borderRadius: '12px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '10px 12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', flexShrink: 0 }}>
                <TrophyIcon size={12} color={GOLD} />
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.06em' }}>PERSONAL RECORDS</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {PERSONAL_RECORDS.map((rec, i) => (
                  <motion.div
                    key={rec.event}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{ borderRadius: '10px', border: `1px solid rgba(212,168,67,0.18)`, background: 'rgba(212,168,67,0.04)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}
                  >
                    <div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '13px', color: '#F3FBFF' }}>{rec.event}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.50)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{rec.date} · {rec.pool} pool</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: GOLD, letterSpacing: '0.04em', lineHeight: 1, textShadow: '0 0 12px rgba(212,168,67,0.40)' }}>{rec.time}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.40)', textTransform: 'uppercase', letterSpacing: '0.10em', marginTop: '2px' }}>PB</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'SPONSORS' && (
            <motion.div
              key="sponsors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden' }}
            >
              <SponsorPanel sponsors={PLAYER_SPONSORS} title="PERSONAL SPONSORS" />
            </motion.div>
          )}
        </div>
      </div>
  ) // end rightColumn

  return (
    <PaneSwitcher
      panes={[
        {
          id: 'identity',
          label: 'PROFILE',
          icon: <UserIcon size={12} />,
          content: (
            <div style={{ position: 'absolute', inset: 0, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {leftColumn.props.children}
            </div>
          ),
        },
        {
          id: 'details',
          label: 'DETAILS',
          icon: <ActivityIcon size={12} />,
          content: (
            <div style={{ position: 'absolute', inset: 0, padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden' }}>
              {/* Tab bar and content — content scrolls internally per tab */}
              {rightColumn.props.children}
            </div>
          ),
        },
      ]}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', gap: '10px', padding: '10px' }}
      >
        {leftColumn}
        {rightColumn}
      </motion.div>
    </PaneSwitcher>
  )
}

// ─── Shared sponsor panel ──────────────────────────────────────────────────────

export function SponsorPanel({ sponsors, title, compact }: { sponsors: Sponsor[]; title: string; compact?: boolean }) {
  return (
    <div style={{ borderRadius: '12px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '10px 12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', ...(compact ? { flexShrink: 0 } : { flex: 1 }) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', flexShrink: 0 }}>
        <AwardIcon size={12} color={GOLD} />
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.06em' }}>{title}</span>
        <div style={{ marginLeft: 'auto', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(169,211,231,0.40)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
          {sponsors.length} ACTIVE
        </div>
      </div>
      <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px', ...(compact ? {} : { flex: 1 }) }}>
        {sponsors.map((s, i) => {
          const colors = TIER_COLORS[s.tier]
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{ borderRadius: '9px', border: `1px solid ${colors.border}`, background: colors.bg, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: '9px' }}
            >
              {/* Logo */}
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(0,0,0,0.35)', border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px', lineHeight: 1 }}>
                {s.logo}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1px' }}>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '12px', color: '#F3FBFF' }}>{s.name}</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '8px', color: colors.text, background: `${colors.bg}`, border: `1px solid ${colors.border}`, padding: '1px 5px', borderRadius: '3px', letterSpacing: '0.10em' }}>{s.tier}</span>
                </div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.55)' }}>{s.category} · {s.bonus}</div>
              </div>
              {/* Value */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: GOLD, letterSpacing: '0.04em', lineHeight: 1 }}>{s.value}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function QuickStatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', background: 'rgba(0,0,0,0.25)', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon}
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(255,255,255,0.60)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>{label}</span>
      </div>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', color: '#F3FBFF', letterSpacing: '0.04em' }}>{value}</span>
    </div>
  )
}
