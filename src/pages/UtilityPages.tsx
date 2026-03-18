import React from 'react'
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
} from 'lucide-react'

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

export function SettingsPage() {
  return (
    <UtilityLayout title="SETTINGS" subtitle="Configure controls, graphics, audio, and gameplay preferences." accent="#94A3B8">
      <div className="grid grid-cols-2 gap-4">
        <MetricCard icon={<SettingsIcon size={14} />} label="GRAPHICS" value="High" />
        <MetricCard icon={<SlidersHorizontalIcon size={14} />} label="CONTROLS" value="Touch + Tap" />
      </div>
    </UtilityLayout>
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
