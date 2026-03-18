import React from 'react'
import { motion } from 'motion/react'
import { MARKET_LISTINGS } from '../utils/gameData'
import { SwimmerCard } from '../components/SwimmerCard'
import { SearchIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon } from 'lucide-react'

export function TransferMarket() {
  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="w-full h-full pt-20 pb-24 px-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-black text-white italic drop-shadow-md">TRANSFER <span className="text-[#D4A843]">MARKET</span></h1>
          <div className="flex gap-4">
            <div className="relative">
              <input type="text" placeholder="Search players..." className="bg-black/40 border border-white/20 rounded-full py-2 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4A843] w-64 transition-colors" />
              <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            </div>
            <button className="bg-[#1A1A2E] hover:bg-[#2A2A4A] text-white font-bold px-4 py-2 rounded-lg border border-white/10 transition-colors shadow-sm">FILTERS</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {MARKET_LISTINGS.map((listing, i) => (
            <motion.div key={listing.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-white/10 flex gap-4 shadow-lg hover:border-[#00FF88]/50 transition-colors group">
              <div className="shrink-0"><SwimmerCard swimmer={listing.swimmer} size="sm" /></div>
              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <div className="flex justify-between items-start"><h3 className="text-white font-bold text-lg leading-tight">{listing.swimmer.name}</h3><TrendIcon trend={listing.trend} /></div>
                  <div className="text-white/50 text-xs mt-1">Ends in: <span className="text-white font-mono">{listing.timeLeft}</span></div>
                </div>
                <div>
                  <div className="text-[#D4A843] font-black text-xl mb-2 flex items-center gap-1"><div className="w-4 h-4 rounded-full bg-[#D4A843] flex items-center justify-center text-black text-[10px]">C</div>{listing.price.toLocaleString()}</div>
                  <div className="flex gap-2">
                    <motion.button whileTap={{ scale: 0.95 }} className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-lg border border-white/20 transition-colors">BID</motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} className="flex-1 bg-[#0D7C66] hover:bg-[#0A6352] text-white text-xs font-bold py-2 rounded-lg border border-[#0D7C66] transition-colors shadow-md">BUY NOW</motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <TrendingUpIcon size={16} className="text-red-500" />
  if (trend === 'down') return <TrendingDownIcon size={16} className="text-green-500" />
  return <MinusIcon size={16} className="text-white/40" />
}
