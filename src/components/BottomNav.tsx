/**
 * BottomNav — FC26 Broadcast Standard bottom navigation
 *
 * Design rules:
 * - Volt (#CCFF00) active indicator, NO gold glows, NO neon rings
 * - PLAY button: solid volt fill, carbon text — max visual weight without neon
 * - Minimum 44px tap targets on all items
 * - Barlow Condensed for all labels
 */

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
        style={{ touchAction: 'manipulation', minHeight: '44px' }}
        className={`relative flex min-w-0 flex-col items-center justify-center border px-2 py-1.5 transition-colors ${
          isActive
            ? 'border-[rgba(200,255,0,0.22)] bg-[rgba(200,255,0,0.06)]'
            : 'border-transparent bg-transparent'
        }`}
      >
        {/* Volt active top-line indicator */}
        {isActive && (
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#CCFF00]"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <div className={`relative p-1.5 transition-colors duration-200 ${isActive ? 'text-white' : 'text-white/40'}`}>
          <Icon size={18} />
          {tab.badge && (
            <span className="absolute -top-1 -right-2 bg-[#FF003C] text-white text-[7px] font-bold px-1 py-0.5 leading-none">
              {tab.badge}
            </span>
          )}
        </div>
        <span
          style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.12em' }}
          className={`truncate text-[9px] font-bold uppercase transition-colors duration-200 ${isActive ? 'text-[#CCFF00]' : 'text-white/35'}`}
        >
          {tab.label}
        </span>
      </motion.button>
    )
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-16 border-t border-white/8 z-50 flex items-center justify-center px-2"
      style={{
        background:            '#060F1C',
        paddingBottom:         'env(safe-area-inset-bottom, 0px)',
        paddingLeft:           'env(safe-area-inset-left, 0px)',
        paddingRight:          'env(safe-area-inset-right, 0px)',
      }}
    >
      <div className="flex items-stretch gap-1 w-full max-w-4xl">
        {/* Left 3 tabs */}
        <div className="flex-1 grid grid-cols-3 gap-1">
          {leftTabs.map(renderTab)}
        </div>

        {/* Centre PLAY button — volt fill, carbon text, no glow */}
        <motion.button
          onClick={onPlay}
          whileTap={{ scale: 0.93 }}
          style={{
            touchAction:  'manipulation',
            fontFamily:   "'Barlow Condensed', sans-serif",
            fontWeight:   900,
            fontStyle:    'italic',
            fontSize:     '14px',
            letterSpacing:'0.10em',
          }}
          className="relative flex flex-col items-center justify-center w-16 -mt-3 bg-[#CCFF00] text-[#0A0A0A] shrink-0 border-2 border-[rgba(200,255,0,0.6)]"
          aria-label="Play"
        >
          <PlayIcon size={18} className="mb-0.5" fill="currentColor" />
          <span className="text-[9px] font-black tracking-[0.14em] uppercase">PLAY</span>
        </motion.button>

        {/* Right 3 tabs */}
        <div className="flex-1 grid grid-cols-3 gap-1">
          {rightTabs.map(renderTab)}
        </div>
      </div>
    </div>
  )
}
