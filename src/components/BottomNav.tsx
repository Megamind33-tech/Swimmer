import React from 'react'
import { motion } from 'motion/react'
import {
  HomeIcon,
  TrophyIcon,
  ShieldIcon,
  SearchIcon,
  ShoppingCartIcon,
  MedalIcon,
} from 'lucide-react'

interface BottomNavProps {
  activeTab: string
  onChange: (tab: string) => void
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'HOME', icon: HomeIcon },
    { id: 'career', label: 'CAREER', icon: TrophyIcon },
    { id: 'club', label: 'CLUB', icon: ShieldIcon },
    { id: 'scouts', label: 'SCOUTS', icon: SearchIcon, badge: 'NEW' },
    { id: 'market', label: 'MARKET', icon: ShoppingCartIcon },
    { id: 'champs', label: 'CHAMPS', icon: MedalIcon },
  ]

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#050B14] to-[#0A1628]/90 border-t border-white/10 z-50 flex items-center justify-center px-4 backdrop-blur-md">
      <div className="grid grid-cols-6 gap-2 w-full max-w-4xl relative items-stretch">
        {tabs.map((tab) => {
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

              <div className={`relative p-1.5 rounded-lg transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/55 group-hover:text-white/80'}`}>
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
        })}
      </div>
    </div>
  )
}
