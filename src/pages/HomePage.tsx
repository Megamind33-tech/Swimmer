import React from 'react'
import { motion } from 'motion/react'
import { SideMenu } from '../components/SideMenu'
import { SwimmerCard } from '../components/SwimmerCard'
import { HOME_EVENTS, ROSTER_HIGHLIGHTS, SWIMMERS, USER_DATA } from '../utils/gameData'
import { ChevronRightIcon, ShieldIcon, TimerIcon, TrophyIcon } from 'lucide-react'

interface HomePageProps {
  onSideMenuSelect: (id: string) => void
}

export function HomePage({ onSideMenuSelect }: HomePageProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0A1628]/70" />

      <SideMenu onSelect={onSideMenuSelect} />

      <div className="absolute left-28 right-4 top-20 bottom-24 grid grid-cols-[minmax(0,1fr)_20rem] gap-4 overflow-hidden">
        <div className="grid grid-rows-[minmax(0,1fr)_14rem] gap-4 min-h-0">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg group cursor-pointer min-h-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#1B2838]" />
            <div className="absolute right-0 bottom-0 w-1/2 h-full">
              <img src="https://cdn.magicpatterns.com/uploads/1GH2axoEyedt1b1AdbeYsJ/f69bd7aa-4d90-481c-9c00-a06d0997952a.png" alt="Hero Swimmer" className="w-full h-full object-contain object-bottom" />
            </div>
            <div className="absolute inset-0 p-8 flex flex-col justify-between bg-gradient-to-t from-[#0A1628] via-[#0A1628]/50 to-transparent">
              <div className="flex gap-3 items-start">
                <div className="px-3 py-1 rounded-full bg-[#C41E3A] text-white text-xs font-black tracking-widest animate-pulse">LIVE SEASON</div>
                <div className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-bold tracking-widest">WORLD TOUR HUB</div>
              </div>
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <h2 className="text-5xl font-black text-white italic tracking-tighter drop-shadow-lg mb-2">SWIM26 <span className="text-[#D4A843]">SEASON 4</span></h2>
                <p className="text-white/80 font-medium mb-6 max-w-md">New legendary swimmers available. Compete in the World Championships now and push your club toward the global finals.</p>
                <div className="flex items-center gap-4">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white text-black font-black px-8 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-shadow">GO NOW <ChevronRightIcon size={20} /></motion.button>
                  <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-sm">
                    <div className="text-[10px] text-white/60 font-bold tracking-[0.3em] uppercase">Club OVR</div>
                    <div className="text-2xl font-black text-[#D4A843]">{USER_DATA.clubOvr}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid grid-cols-[minmax(0,1fr)_18rem] gap-4 min-h-0">
            <div className="bg-black/40 rounded-2xl p-5 border border-white/10 backdrop-blur-md min-h-0 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-black italic text-xl">ACTIVE EVENTS</h3>
                <span className="text-[10px] text-white/50 font-bold tracking-[0.3em] uppercase">Live feed</span>
              </div>
              <div className="grid grid-cols-3 gap-3 h-[calc(100%-2rem)]">
                {HOME_EVENTS.map((event, index) => (
                  <motion.div key={event.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + index * 0.08 }} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-black tracking-[0.25em] uppercase text-[#D4A843] mb-2">{event.status}</div>
                      <div className="text-white font-black text-lg leading-tight">{event.name}</div>
                      <div className="text-white/60 text-xs mt-2">{event.reward}</div>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-xs font-bold mt-4"><TimerIcon size={14} className="text-[#D4A843]" />{event.time}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A2E]/90 to-[#0B1120]/90 rounded-2xl border border-white/10 p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-black italic text-lg">ROSTER CORE</h3>
                <TrophyIcon size={16} className="text-[#D4A843]" />
              </div>
              <div className="space-y-3">
                {ROSTER_HIGHLIGHTS.map((entry) => {
                  const swimmer = SWIMMERS.find((item) => item.id === entry.swimmerId)
                  if (!swimmer) return null
                  return (
                    <div key={entry.id} className="rounded-xl border border-white/10 bg-black/30 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-white font-bold leading-tight">{swimmer.name}</div>
                          <div className="text-[#D4A843] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{entry.role}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-lg font-black">{swimmer.ovr}</div>
                          <div className="text-white/40 text-[10px] uppercase font-bold">OVR</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3 text-[10px]">
                        <div className="rounded-lg bg-white/5 px-2 py-1 text-white/70"><span className="block text-white/40">Age</span>{entry.age}</div>
                        <div className="rounded-lg bg-white/5 px-2 py-1 text-white/70"><span className="block text-white/40">Morale</span>{entry.morale}</div>
                        <div className="rounded-lg bg-white/5 px-2 py-1 text-white/70"><span className="block text-white/40">Wage</span>{entry.weeklyWage}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-0">
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.02 }} className="flex-1 min-h-0 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-4 border border-purple-500/30 relative overflow-hidden cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-[50px] opacity-50" />
            <h3 className="text-white font-black italic text-xl mb-2 relative z-10">LEGEND DRAFT</h3>
            <div className="flex justify-center gap-[-20px] relative z-10 mt-4">
              <div className="transform -rotate-6 translate-x-4"><SwimmerCard swimmer={SWIMMERS[0]} size="sm" /></div>
              <div className="transform z-10 scale-110"><SwimmerCard swimmer={SWIMMERS[1]} size="sm" /></div>
              <div className="transform rotate-6 -translate-x-4"><SwimmerCard swimmer={SWIMMERS[2]} size="sm" /></div>
            </div>
          </motion.div>

          <div className="flex gap-4 h-24">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} whileHover={{ scale: 1.02 }} className="flex-1 bg-gradient-to-br from-[#1A1A2E] to-[#0B1120] rounded-xl border border-white/10 p-3 flex items-center justify-between cursor-pointer relative overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-white/5" />
              <div>
                <div className="text-white/60 font-bold text-xs tracking-wider mb-1">CLUB</div>
                <div className="bg-gradient-to-b from-[#D4A843] to-[#A67C00] border border-[#FDE047]/30 rounded p-1 text-center w-12">
                  <div className="text-[8px] text-black/80 font-bold">OVR</div>
                  <div className="text-black font-black leading-none">{USER_DATA.clubOvr}</div>
                </div>
              </div>
              <ShieldIcon size={32} className="text-white/20" />
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} whileHover={{ scale: 1.02 }} className="flex-1 bg-gradient-to-br from-[#0D7C66] to-[#065A46] rounded-xl p-3 flex flex-col justify-center cursor-pointer relative overflow-hidden shadow-md">
              <div className="absolute right-0 bottom-0 w-16 h-16 bg-white/10 rounded-full blur-xl" />
              <h3 className="text-white font-black italic text-xl relative z-10">PLAY</h3>
              <div className="text-white/80 font-bold text-xs relative z-10">QUICK MATCH</div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
