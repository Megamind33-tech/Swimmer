import React from 'react'
import { motion } from 'motion/react'
import {
  HomeIcon,
  MedalIcon,
  ShieldIcon,
  SearchIcon,
  ShoppingCartIcon,
  TrophyIcon,
  PlayIcon,
} from 'lucide-react'

interface BottomNavProps {
  activeTab: string
  onChange: (tab: string) => void
  onPlay?: () => void
}

export function BottomNav({ activeTab, onChange, onPlay }: BottomNavProps) {
  // Nav tabs — the PLAY button is injected between club and scouts
  const leftTabs = [
    { id: 'home',   label: 'HOME',   icon: HomeIcon },
    { id: 'career', label: 'CAREER', icon: MedalIcon },
    { id: 'club',   label: 'CLUB',   icon: ShieldIcon },
  ]
  const rightTabs = [
    { id: 'scouts', label: 'SCOUTS', icon: SearchIcon, badge: 'NEW' },
    { id: 'market', label: 'MARKET', icon: ShoppingCartIcon },
    { id: 'champs', label: 'CHAMPS', icon: TrophyIcon },
  ]

  const renderTab = (tab: { id: string; label: string; icon: React.ElementType; badge?: string }) => {
    const isActive = activeTab === tab.id
    const Icon = tab.icon
    return (
      <motion.button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        whileTap={{ scale: 0.95 }}
        className={`relative flex min-w-0 flex-col items-center justify-center rounded-xl border px-2 py-1.5 transition-colors ${isActive ? 'border-[#D4A843]/30 bg-white/8' : 'border-transparent bg-transparent hover:bg-white/5'}`}
      >
        {isActive && (
          <motion.div
            layoutId="activeTabGlow"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#D4A843] rounded-b-full shadow-[0_0_10px_rgba(212,168,67,0.5)]"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <div className={`relative p-1.5 rounded-lg transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/55'}`}>
          <Icon size={18} className={isActive ? 'drop-shadow-[0_0_8px_rgba(212,168,67,0.8)]' : ''} />
          {tab.badge && (
            <span className="absolute -top-1 -right-2 bg-[#C41E3A] text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full border border-[#050B14] animate-pulse">
              {tab.badge}
            </span>
          )}
        </div>
        <span className={`truncate text-[9px] font-bold tracking-wider transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/45'}`}>
          {tab.label}
        </span>
      </motion.button>
    )
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#050B14] to-[#0A1628]/90 border-t border-white/10 z-50 flex items-center justify-center px-3 backdrop-blur-md">
      <div className="flex items-stretch gap-1.5 w-full max-w-4xl">
        {/* Left 3 tabs */}
        <div className="flex-1 grid grid-cols-3 gap-1.5">
          {leftTabs.map(renderTab)}
        </div>

        {/* Centre PLAY button — raised, prominent */}
        <motion.button
          onClick={onPlay}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          className="relative flex flex-col items-center justify-center w-16 -mt-3 rounded-2xl bg-gradient-to-b from-[#0D7C66] to-[#065A46] border border-[#0D7C66]/60 shadow-[0_0_18px_rgba(13,124,102,0.5)] text-white shrink-0"
          aria-label="Play"
        >
          <PlayIcon size={20} className="mb-0.5" fill="currentColor" />
          <span className="text-[8px] font-black tracking-widest uppercase">PLAY</span>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-2xl animate-ping opacity-20 bg-[#0D7C66] pointer-events-none" />
        </motion.button>

        {/* Right 3 tabs */}
        <div className="flex-1 grid grid-cols-3 gap-1.5">
          {rightTabs.map(renderTab)}
        </div>
      </div>
    </div>
  )
}
