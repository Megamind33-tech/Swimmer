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
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#050B14] to-[#0A1628]/90 border-t border-white/10 z-50 flex items-center justify-center px-4 backdrop-blur-md">
      <div className="flex items-center justify-between w-full max-w-4xl relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          return (
            <motion.button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center justify-center w-20 h-full group"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-12 h-1 bg-[#D4A843] rounded-b-full shadow-[0_0_10px_rgba(212,168,67,0.5)]"
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}

              <div
                className={`relative p-2 rounded-xl transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}
              >
                <Icon size={24} className={isActive ? 'drop-shadow-[0_0_8px_rgba(212,168,67,0.8)]' : ''} />

                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#C41E3A] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-[#050B14] animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-bold tracking-wider mt-1 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/40'}`}
              >
                {tab.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
