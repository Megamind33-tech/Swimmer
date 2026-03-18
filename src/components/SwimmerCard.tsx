import React from 'react'
import { motion } from 'motion/react'
import { Swimmer } from '../utils/gameData'

interface SwimmerCardProps {
  swimmer: Swimmer
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function SwimmerCard({ swimmer, size = 'md', onClick }: SwimmerCardProps) {
  const rarityColors = {
    common: 'from-slate-400 to-slate-600 border-slate-300',
    rare: 'from-blue-500 to-blue-800 border-blue-400',
    epic: 'from-purple-500 to-purple-800 border-purple-400',
    legendary: 'from-yellow-400 to-orange-600 border-yellow-300',
  }

  const sizeClasses = {
    sm: 'w-24 h-36 text-xs',
    md: 'w-36 h-52 text-sm',
    lg: 'w-48 h-72 text-base',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden cursor-pointer shadow-2xl ${sizeClasses[size]}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[swimmer.rarity]} opacity-90`} />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/20" />
      <div className={`absolute inset-0 border-2 rounded-xl ${rarityColors[swimmer.rarity].split(' ')[2]} opacity-50`} />

      <div className="relative h-full flex flex-col p-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col items-center bg-black/40 rounded-tl-lg rounded-br-lg p-1 border border-white/20 backdrop-blur-md">
            <span className="font-bold text-white leading-none" style={{ fontSize: size === 'lg' ? '2rem' : size === 'md' ? '1.5rem' : '1rem' }}>
              {swimmer.ovr}
            </span>
            <span className="text-[10px] text-white/80 uppercase font-bold tracking-wider">OVR</span>
          </div>
          <div className="text-2xl drop-shadow-md">{swimmer.country}</div>
        </div>

        <div className="flex-grow flex items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
          <div className="w-3/4 h-3/4 bg-white/10 rounded-full blur-md absolute" />
          {swimmer.image ? (
            <img
              src={swimmer.image}
              alt={swimmer.name}
              className="w-full h-full object-cover absolute inset-0 mix-blend-luminosity opacity-80"
              style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
            />
          ) : (
            <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 text-white/80 drop-shadow-lg" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          )}
        </div>

        <div className="mt-auto text-center pb-1 relative z-10">
          <div className="font-bold text-white truncate drop-shadow-md uppercase tracking-wide">{swimmer.name}</div>
          <div className="text-[10px] text-[#D4A843] font-bold uppercase tracking-widest drop-shadow">{swimmer.stroke}</div>

          {size !== 'sm' && (
            <div className="grid grid-cols-2 gap-1 mt-2 text-[9px] text-white/90 bg-black/40 p-1 rounded backdrop-blur-sm">
              <div className="flex justify-between"><span>SPD</span><span className="font-bold text-[#D4A843]">{swimmer.stats.speed}</span></div>
              <div className="flex justify-between"><span>STA</span><span className="font-bold text-[#D4A843]">{swimmer.stats.stamina}</span></div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
