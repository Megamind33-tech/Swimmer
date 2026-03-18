import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapPinIcon, SearchIcon, ClockIcon } from 'lucide-react'

export function Scouts() {
  const [isRevealing, setIsRevealing] = useState(false)

  const handleScout = () => {
    setIsRevealing(true)
    setTimeout(() => setIsRevealing(false), 3000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full pt-20 pb-24 px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0A1628] opacity-50">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 h-full flex flex-col">
        <h1 className="text-4xl font-black text-white italic mb-6 drop-shadow-md">GLOBAL <span className="text-purple-400">SCOUTING</span></h1>
        <div className="flex-1 grid grid-cols-3 gap-6">
          <div className="col-span-1 flex flex-col gap-4">
            <h3 className="text-white/80 font-bold text-sm tracking-wider">ACTIVE MISSIONS</h3>
            <ScoutCard region="Europe" type="Technique Focus" time="02:15:30" cost={50000} active />
            <ScoutCard region="Americas" type="Speed Focus" time="--:--:--" cost={75000} onStart={handleScout} />
            <ScoutCard region="Asia" type="Endurance Focus" time="--:--:--" cost={60000} locked />
          </div>

          <div className="col-span-2 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md relative overflow-hidden flex items-center justify-center">
            <AnimatePresence>
              {isRevealing ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="relative z-20"
                >
                  <div className="absolute inset-0 bg-purple-500 blur-[100px] opacity-50 rounded-full" />
                  <div className="w-64 h-96 bg-gradient-to-br from-purple-600 to-indigo-900 rounded-xl border-2 border-purple-400 p-4 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.5)]">
                    <SearchIcon size={48} className="text-white mb-4 animate-pulse" />
                    <h2 className="text-2xl font-black text-white text-center">SCOUTING...</h2>
                    <p className="text-purple-200 mt-2">Searching Americas region</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <MapPinIcon size={64} className="text-white/20 mx-auto mb-4" />
                  <h3 className="text-white/40 font-bold text-xl">SELECT A REGION TO SCOUT</h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface ScoutCardProps {
  region: string
  type: string
  time: string
  cost: number
  active?: boolean
  locked?: boolean
  onStart?: () => void
}

function ScoutCard({ region, type, time, cost, active, locked, onStart }: ScoutCardProps) {
  return (
    <motion.div
      whileHover={!locked ? { scale: 1.02 } : {}}
      className={`p-4 rounded-xl border relative overflow-hidden ${locked ? 'bg-black/60 border-white/5 opacity-50' : active ? 'bg-gradient-to-br from-purple-900/50 to-slate-900 border-purple-500/50' : 'bg-slate-800 border-white/10 cursor-pointer hover:border-white/30'}`}
    >
      {locked && <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center"><span className="text-white font-bold">LOCKED</span></div>}
      <div className="flex justify-between items-start mb-4">
        <div><h4 className="text-white font-bold">{region}</h4><p className="text-[10px] text-[#D4A843] font-bold uppercase">{type}</p></div>
        <MapPinIcon size={20} className={active ? 'text-purple-400' : 'text-white/40'} />
      </div>

      {active ? (
        <div className="bg-black/50 rounded-lg p-2 flex items-center justify-center gap-2 border border-white/5"><ClockIcon size={14} className="text-[#D4A843]" /><span className="text-white font-mono font-bold">{time}</span></div>
      ) : (
        <button onClick={onStart} className="w-full bg-white hover:bg-gray-100 text-[#0B1120] font-black py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
          START <span className="text-xs">({cost.toLocaleString()} C)</span>
        </button>
      )}
    </motion.div>
  )
}
