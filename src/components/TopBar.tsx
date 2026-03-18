import React from 'react'
import { motion } from 'motion/react'
import { SettingsIcon, MailIcon, UsersIcon, PlusIcon } from 'lucide-react'
import { USER_DATA } from '../utils/gameData'
import { AnimatedCounter } from './AnimatedCounter'
import { ProgressBar } from './ProgressBar'

interface TopBarProps {
  onOpenFriends: () => void
  onOpenInbox: () => void
  onOpenSettings: () => void
}

export function TopBar({ onOpenFriends, onOpenInbox, onOpenSettings }: TopBarProps) {
  return (
    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0A1628]/90 to-transparent z-50 flex items-center justify-between px-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <motion.div whileHover={{ scale: 1.05 }} className="relative flex items-center bg-black/40 rounded-full pr-4 border border-white/10 backdrop-blur-md">
          <div className="w-12 h-12 bg-[#D4A843] rounded-full flex items-center justify-center border-2 border-[#D4A843]/50 shadow-md z-10">
            <span className="text-black font-black text-lg">{USER_DATA.level}</span>
          </div>
          <div className="ml-2 flex flex-col justify-center py-1">
            <span className="text-white font-bold text-sm leading-tight">{USER_DATA.username}</span>
            <div className="w-24 mt-0.5">
              <ProgressBar progress={USER_DATA.xp} max={USER_DATA.maxXp} height="h-1.5" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        <CurrencyBadge
          icon={<div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xs">C</div>}
          value={USER_DATA.currencies.coins}
          color="text-yellow-400"
        />
        <CurrencyBadge
          icon={<div className="w-5 h-5 rounded-sm rotate-45 bg-red-500 flex items-center justify-center border border-red-300 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />}
          value={USER_DATA.currencies.gems}
          color="text-red-400"
        />

        <div className="flex items-center gap-2 ml-2">
          <IconButton label="Open friends" icon={<UsersIcon size={20} />} onClick={onOpenFriends} />
          <IconButton label="Open inbox" icon={<MailIcon size={20} />} badge={2} onClick={onOpenInbox} />
          <IconButton label="Open settings" icon={<SettingsIcon size={20} />} onClick={onOpenSettings} />
        </div>
      </div>
    </div>
  )
}

function CurrencyBadge({ icon, value, color }: { icon: React.ReactNode; value: number; color: string }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center bg-black/50 rounded-full pl-1 pr-3 py-1 border border-white/10 backdrop-blur-md cursor-pointer group">
      {icon}
      <AnimatedCounter value={value} className={`ml-2 font-bold font-mono text-sm ${color} drop-shadow-[0_0_5px_currentColor]`} />
      <div className="ml-2 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors">
        <PlusIcon size={12} className="text-white" />
      </div>
    </motion.div>
  )
}

function IconButton({ icon, badge, onClick, label }: { icon: React.ReactNode; badge?: number; onClick: () => void; label: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label={label}
      className="relative w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 backdrop-blur-md transition-colors"
    >
      {icon}
      {badge && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border border-[#0A1628]">
          {badge}
        </span>
      )}
    </motion.button>
  )
}
