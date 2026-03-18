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
    <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-[#0A1628]/90 to-transparent z-50 flex items-center justify-between px-4 gap-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 min-w-0">
        <motion.div whileHover={{ scale: 1.02 }} className="relative flex items-center bg-black/40 rounded-full pr-3 border border-white/10 backdrop-blur-md min-w-0">
          <div className="w-10 h-10 bg-[#D4A843] rounded-full flex items-center justify-center border-2 border-[#D4A843]/50 shadow-md z-10 shrink-0">
            <span className="text-black font-black text-sm">{USER_DATA.level}</span>
          </div>
          <div className="ml-2 flex min-w-0 flex-col justify-center py-1">
            <span className="text-white font-bold text-xs leading-tight truncate max-w-28">{USER_DATA.username}</span>
            <div className="w-20 mt-0.5">
              <ProgressBar progress={USER_DATA.xp} max={USER_DATA.maxXp} height="h-1.5" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <CurrencyBadge
          icon={<div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-[9px]">C</div>}
          value={USER_DATA.currencies.coins}
          color="text-yellow-400"
        />
        <CurrencyBadge
          icon={<div className="w-4 h-4 rounded-sm rotate-45 bg-red-500 flex items-center justify-center border border-red-300 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />}
          value={USER_DATA.currencies.gems}
          color="text-red-400"
        />

        <div className="flex items-center gap-1 ml-1">
          <IconButton label="Open friends" icon={<UsersIcon size={16} />} onClick={onOpenFriends} />
          <IconButton label="Open inbox" icon={<MailIcon size={16} />} badge={2} onClick={onOpenInbox} />
          <IconButton label="Open settings" icon={<SettingsIcon size={16} />} onClick={onOpenSettings} />
        </div>
      </div>
    </div>
  )
}

function CurrencyBadge({ icon, value, color }: { icon: React.ReactNode; value: number; color: string }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center bg-black/50 rounded-full pl-1 pr-2 py-1 border border-white/10 backdrop-blur-md cursor-pointer group max-w-[132px]">
      {icon}
      <AnimatedCounter value={value} className={`ml-1.5 font-bold font-mono text-xs truncate ${color} drop-shadow-[0_0_5px_currentColor]`} />
      <div className="ml-1.5 w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors shrink-0">
        <PlusIcon size={10} className="text-white" />
      </div>
    </motion.div>
  )
}

function IconButton({ icon, badge, onClick, label }: { icon: React.ReactNode; badge?: number; onClick: () => void; label: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-label={label}
      className="relative w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 backdrop-blur-md transition-colors"
    >
      {icon}
      {badge && (
        <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center border border-[#0A1628]">
          {badge}
        </span>
      )}
    </motion.button>
  )
}
