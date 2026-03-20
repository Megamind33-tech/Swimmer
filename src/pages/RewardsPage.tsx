import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { GiftIcon, InboxIcon, ClockIcon, CheckCircleIcon, ChevronRightIcon } from 'lucide-react'

const AQUA = 'var(--color-volt)'
const GOLD = 'var(--color-volt)'
const PANEL = 'rgba(4,20,33,0.76)'
const PANEL_BORDER = 'rgba(56,214,255,0.13)'

type RewardTab = 'CLAIMABLE' | 'INBOX' | 'HISTORY'

interface ClaimableReward {
  id: string
  from: string
  type: 'REWARD' | 'EVENT' | 'RANK' | 'SEASON' | 'GIFT' | 'SYSTEM'
  title: string
  description: string
  rewards: { xp?: number; coins?: number; premium?: number }
  date: string
}

interface InboxMessage {
  id: string
  from: string
  type: string
  title: string
  description: string
  date: string
}

interface HistoryEntry {
  id: string
  date: string
  item: string
  amount: string
}

const CLAIMABLE_REWARDS: ClaimableReward[] = [
  {
    id: 'r1',
    from: 'Daily Login',
    type: 'REWARD',
    title: 'Day 7 Login Streak',
    description: 'You maintained a 7-day login streak. Exceptional dedication — keep it going!',
    rewards: { xp: 500, coins: 2500, premium: 10 },
    date: 'Today',
  },
  {
    id: 'r2',
    from: 'Sprint Cup Event',
    type: 'EVENT',
    title: 'Sprint Cup Finalist Reward',
    description: 'Congratulations on finishing in the Top 16 of the Spring Sprint Cup.',
    rewards: { xp: 1200, coins: 8000, premium: 25 },
    date: 'Yesterday',
  },
  {
    id: 'r3',
    from: 'Rank Promotion',
    type: 'RANK',
    title: 'Pro League Promotion Bonus',
    description: 'You climbed from Regional to Pro League this season. Rank bonus awarded.',
    rewards: { xp: 2000, coins: 15000, premium: 50 },
    date: 'Mar 17',
  },
  {
    id: 'r4',
    from: 'Season End',
    type: 'SEASON',
    title: 'Season 3 Completion Pack',
    description: 'End-of-season reward for completing all mandatory career events in S3.',
    rewards: { xp: 5000, coins: 30000, premium: 100 },
    date: 'Mar 14',
  },
]

const INBOX_MESSAGES: InboxMessage[] = [
  {
    id: 'm1',
    from: 'Swim26 HQ',
    type: 'SYSTEM',
    title: 'New Season 4 Features Available',
    description: 'Season 4 brings new pools, updated rankings, and enhanced club management tools.',
    date: 'Today',
  },
  {
    id: 'm2',
    from: 'Arena Sports',
    type: 'GIFT',
    title: 'Sponsor Gift Pack — Arena',
    description: 'Your title sponsor Arena has sent you an exclusive starter pack for S4.',
    date: 'Mar 18',
  },
  {
    id: 'm3',
    from: 'Tournament Office',
    type: 'SYSTEM',
    title: 'National Championship Invitation',
    description: 'You have qualified for the National Championship in Week 4. Accept to lock in your spot.',
    date: 'Mar 16',
  },
]

const HISTORY: HistoryEntry[] = [
  { id: 'h1', date: 'Mar 18', item: 'Daily Login Bonus',       amount: '+1,500 CR' },
  { id: 'h2', date: 'Mar 17', item: 'Race Win — 100m Free',    amount: '+4,200 CR' },
  { id: 'h3', date: 'Mar 16', item: 'Club Weekly Reward',      amount: '+3,000 CR' },
  { id: 'h4', date: 'Mar 15', item: 'Sponsor Milestone',       amount: '+8,000 CR' },
  { id: 'h5', date: 'Mar 14', item: 'Season 3 Completion',     amount: '+30,000 CR' },
  { id: 'h6', date: 'Mar 13', item: 'Training Achievement',    amount: '+2,100 CR' },
]

const TYPE_COLORS: Record<string, string> = {
  REWARD: '#EAB308',
  EVENT:  '#A78BFA',
  RANK:   '#34D399',
  SEASON: '#60A5FA',
  GIFT:   '#F472B6',
  SYSTEM: '#94A3B8',
}

export function RewardsPage() {
  const [activeTab,    setActiveTab]    = useState<RewardTab>('CLAIMABLE')
  const [claimed,      setClaimed]      = useState<Set<string>>(new Set())

  const unclaimedCount = CLAIMABLE_REWARDS.filter((r) => !claimed.has(r.id)).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}
    >
      {/* ── Header row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GiftIcon size={18} color={GOLD} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#F3FBFF', letterSpacing: '0.06em' }}>REWARDS TERMINAL</span>
        </div>
        {/* Summary pills */}
        <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
          <Pill label="Unclaimed" value={String(unclaimedCount)} color={GOLD} />
          <Pill label="Total Value" value="55.5K CR" color={AQUA} />
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        {(['CLAIMABLE', 'INBOX', 'HISTORY'] as RewardTab[]).map((tab) => {
          const active = tab === activeTab
          const icons: Record<RewardTab, React.ReactNode> = {
            CLAIMABLE: <GiftIcon    size={11} />,
            INBOX:     <InboxIcon   size={11} />,
            HISTORY:   <ClockIcon   size={11} />,
          }
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                height: '32px', paddingInline: '14px', borderRadius: '8px', cursor: 'pointer',
                background: active ? 'rgba(212,168,67,0.12)' : 'rgba(56,214,255,0.04)',
                border: active ? `1px solid rgba(212,168,67,0.35)` : `1px solid ${PANEL_BORDER}`,
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: active ? GOLD : 'rgba(169,211,231,0.45)',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.18s ease',
              }}
            >
              <span style={{ color: active ? GOLD : 'rgba(169,211,231,0.40)' }}>{icons[tab]}</span>
              {tab}
              {tab === 'CLAIMABLE' && unclaimedCount > 0 && (
                <span style={{ background: '#C41E3A', color: '#fff', fontSize: '8px', fontWeight: 900, padding: '1px 5px', borderRadius: '100px', letterSpacing: '0.06em' }}>
                  {unclaimedCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'CLAIMABLE' && (
            <motion.div key="claimable" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
              {unclaimedCount > 0 && (
                <button
                  onClick={() => setClaimed(new Set(CLAIMABLE_REWARDS.map((r) => r.id)))}
                  style={{ alignSelf: 'flex-end', height: '30px', paddingInline: '14px', borderRadius: '8px', cursor: 'pointer', background: 'rgba(212,168,67,0.10)', border: `1px solid rgba(212,168,67,0.30)`, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, flexShrink: 0 }}
                >
                  Claim All
                </button>
              )}
              {CLAIMABLE_REWARDS.map((item, i) => {
                const isClaimed = claimed.has(item.id)
                const typeColor = TYPE_COLORS[item.type] ?? AQUA
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{ borderRadius: '12px', border: isClaimed ? '1px solid rgba(52,211,153,0.20)' : `1px solid ${PANEL_BORDER}`, background: isClaimed ? 'rgba(52,211,153,0.05)' : PANEL, backdropFilter: 'blur(12px)', padding: '12px 14px', flexShrink: 0 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.55)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>{item.from}</span>
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '9px', color: typeColor, background: `${typeColor}18`, border: `1px solid ${typeColor}40`, padding: '1px 6px', borderRadius: '4px', letterSpacing: '0.10em' }}>{item.type}</span>
                      </div>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.35)' }}>{item.date}</span>
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: '#F3FBFF', letterSpacing: '0.04em', marginBottom: '4px' }}>{item.title}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.60)', lineHeight: 1.5, marginBottom: '10px' }}>{item.description}</div>
                    {/* Reward breakdown */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      {item.rewards.xp     && <RewardChip label="XP"      value={`+${item.rewards.xp.toLocaleString()}`} color={AQUA} />}
                      {item.rewards.coins  && <RewardChip label="Credits"  value={`+${item.rewards.coins.toLocaleString()} CR`} color={GOLD} />}
                      {item.rewards.premium && <RewardChip label="Pulse SP" value={`+${item.rewards.premium} ◆`} color="#A78BFA" />}
                    </div>
                    {isClaimed ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircleIcon size={14} color="#34D399" />
                        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px', color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.10em' }}>Claimed</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setClaimed((prev) => new Set([...prev, item.id]))}
                        style={{ height: '30px', paddingInline: '16px', borderRadius: '8px', cursor: 'pointer', background: 'linear-gradient(90deg, rgba(212,168,67,0.22), rgba(212,168,67,0.12))', border: `1px solid rgba(212,168,67,0.35)`, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        Claim <ChevronRightIcon size={12} />
                      </button>
                    )}
                  </motion.div>
                )
              })}
              {unclaimedCount === 0 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <CheckCircleIcon size={40} color="rgba(52,211,153,0.40)" />
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: 'rgba(169,211,231,0.40)', letterSpacing: '0.08em' }}>ALL REWARDS CLAIMED</div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'INBOX' && (
            <motion.div key="inbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
              {INBOX_MESSAGES.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{ borderRadius: '12px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexShrink: 0 }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(169,211,231,0.55)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>{msg.from}</span>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.35)' }}>{msg.date}</span>
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', color: '#F3FBFF', letterSpacing: '0.04em', marginBottom: '4px' }}>{msg.title}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.55)', lineHeight: 1.4 }}>{msg.description}</div>
                  </div>
                  <ChevronRightIcon size={16} color="rgba(169,211,231,0.30)" style={{ flexShrink: 0 }} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'HISTORY' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ height: '100%', borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '14px 16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: '#F3FBFF', letterSpacing: '0.06em', marginBottom: '12px', flexShrink: 0 }}>ACTIVITY LOG</div>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {HISTORY.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: '8px', background: 'rgba(56,214,255,0.03)', border: `1px solid ${PANEL_BORDER}`, gap: '12px' }}
                  >
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.40)', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0, width: '40px' }}>{entry.date}</span>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '12px', color: '#F3FBFF', flex: 1 }}>{entry.item}</span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: GOLD, letterSpacing: '0.04em', flexShrink: 0 }}>{entry.amount}</span>
                    <CheckCircleIcon size={12} color="rgba(52,211,153,0.50)" style={{ flexShrink: 0 }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Pill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(4,20,33,0.70)', border: `1px solid ${color}30`, borderRadius: '100px', padding: '3px 10px 3px 8px' }}>
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', fontWeight: 700, color: `${color}80`, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</span>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color, letterSpacing: '0.04em' }}>{value}</span>
    </div>
  )
}

function RewardChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: `${color}0F`, border: `1px solid ${color}28`, borderRadius: '7px', padding: '4px 8px', textAlign: 'center' }}>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '8px', fontWeight: 700, color: `${color}80`, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color, letterSpacing: '0.04em' }}>{value}</div>
    </div>
  )
}
