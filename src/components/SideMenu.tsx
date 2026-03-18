import React from 'react'
import { motion } from 'motion/react'
import { ZapIcon, CalendarIcon, GiftIcon, StarIcon, AwardIcon } from 'lucide-react'

interface SideMenuProps {
  onSelect: (id: string) => void
}

export function SideMenu({ onSelect }: SideMenuProps) {
  const menuItems = [
    { id: 'training', label: 'TRAINING', icon: ZapIcon, color: 'text-blue-400' },
    { id: 'events', label: 'EVENTS', icon: CalendarIcon, color: 'text-purple-400', badge: true },
    { id: 'rewards', label: 'REWARDS', icon: GiftIcon, color: 'text-green-400' },
    { id: 'pass', label: 'STAR PASS', icon: StarIcon, color: 'text-yellow-400', tag: 'NEW' },
    { id: 'bonus', label: 'BONUS', icon: AwardIcon, color: 'text-orange-400' },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="absolute left-4 top-24 bottom-24 w-20 flex flex-col gap-3 z-40">
      {menuItems.map((menu) => {
        const Icon = menu.icon
        return (
          <motion.button
            key={menu.id}
            variants={item}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(menu.id)}
            className="relative w-full aspect-square bg-gradient-to-br from-[#1B2838]/80 to-[#0A1628]/90 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg backdrop-blur-sm group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Icon size={24} className={`${menu.color} drop-shadow-md`} />
            <span className="text-[9px] font-bold text-white/80 tracking-wider">{menu.label}</span>

            {menu.badge && <div className="absolute top-1 right-1 w-2 h-2 bg-[#C41E3A] rounded-full shadow-[0_0_5px_rgba(196,30,58,0.8)] animate-pulse" />}
            {menu.tag && (
              <div className="absolute top-0 right-0 bg-[#C41E3A] text-white text-[8px] font-bold px-1 py-0.5 rounded-bl-lg rounded-tr-xl">
                {menu.tag}
              </div>
            )}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
