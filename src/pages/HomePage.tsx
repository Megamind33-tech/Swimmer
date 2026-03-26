import React from 'react'
import { motion } from 'motion/react'
import { SideMenu } from '../components/SideMenu'
import { SwimmerCard } from '../components/SwimmerCard'
import { HOME_EVENTS, ROSTER_HIGHLIGHTS, SWIMMERS, USER_DATA } from '../utils/gameData'
import { ChevronRightIcon, ShieldIcon, TimerResetIcon, MedalIcon } from 'lucide-react'

interface HomePageProps {
  onSideMenuSelect: (id: string) => void
  onPlay?: () => void
}

export function HomePage({ onSideMenuSelect, onPlay }: HomePageProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="swim26-game-page swim26-page-pattern swim26-page-pattern--hero w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0A1628]/70" />

      <SideMenu onSelect={onSideMenuSelect} />

      <div className="swim26-home-layout absolute left-28 right-4 top-16 bottom-18 grid grid-cols-[minmax(0,1fr)_16rem] gap-3 overflow-hidden">
        <div className="grid grid-rows-[minmax(0,1fr)_minmax(13rem,15rem)] gap-3 min-h-0">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg group cursor-pointer min-h-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#1B2838]" />
            <div className="absolute right-0 bottom-0 w-[42%] h-full pointer-events-none">
              <img src="https://cdn.magicpatterns.com/uploads/1GH2axoEyedt1b1AdbeYsJ/f69bd7aa-4d90-481c-9c00-a06d0997952a.png" alt="Hero Swimmer" className="w-full h-full object-contain object-bottom opacity-90" />
            </div>
            <div className="absolute inset-0 p-5 flex flex-col justify-between bg-gradient-to-t from-[#0A1628] via-[#0A1628]/50 to-transparent">
              <div className="flex gap-2 items-start flex-wrap pr-[38%]">
                <div className="px-2.5 py-1 rounded-full bg-[#C41E3A] text-white text-[10px] font-black tracking-[0.2em] animate-pulse">LIVE SEASON</div>
                <div className="px-2.5 py-1 rounded-full bg-white/10 text-white/70 text-[10px] font-bold tracking-[0.2em]">WORLD TOUR HUB</div>
              </div>
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="max-w-[60%]">
                <h2 className="text-3xl font-black text-white italic tracking-tight drop-shadow-lg mb-2">SWIM26 <span className="text-[#D4A843]">SEASON 4</span></h2>
                <p className="text-white/80 text-sm font-medium mb-4 leading-snug">Compete in live championships, improve your squad, and push your club toward the global finals.</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <motion.button data-testid="home-go-now" onClick={onPlay} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '38px', paddingInline: '18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(140deg, var(--color-volt) 0%, var(--color-primary-dim) 100%)', color: 'var(--color-carbon)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '0.08em', cursor: 'pointer', boxShadow: '0 0 18px rgba(204,255,0,0.45), 0 3px 10px rgba(0,0,0,0.55)', userSelect: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>GO NOW <ChevronRightIcon size={14} /></motion.button>
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-sm min-w-[88px]">
                    <div className="text-[9px] text-white/60 font-bold tracking-[0.2em] uppercase">Club OVR</div>
                    <div className="text-xl font-black text-[#D4A843]">{USER_DATA.clubOvr}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid grid-cols-[minmax(0,1fr)_15rem] gap-3 min-h-0">
            <div className="bg-black/40 rounded-2xl p-4 border border-white/10 backdrop-blur-md min-h-0 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-black italic text-lg">ACTIVE EVENTS</h3>
                <span className="text-[9px] text-white/50 font-bold tracking-[0.2em] uppercase">Live feed</span>
              </div>
              <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
                {HOME_EVENTS.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 flex min-w-0 flex-col justify-between overflow-hidden"
                  >
                    <div className="space-y-3 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[9px] font-black tracking-[0.2em] uppercase text-[#D4A843] truncate">{event.status}</div>
                        <div className="flex items-center gap-1.5 text-white/70 text-[11px] font-bold shrink-0"><TimerResetIcon size={12} className="text-[#D4A843]" />{event.time}</div>
                      </div>
                      <div className="text-white font-black text-base leading-tight max-w-[16rem]">{event.name}</div>
                      <div className="text-white/65 text-[12px] leading-relaxed max-w-[18rem]">{event.reward}</div>
                    </div>
                    <div className="mt-4">
                      <button className="rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white hover:bg-white/12 transition-colors whitespace-nowrap">
                        View Event
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A2E]/90 to-[#0B1120]/90 rounded-2xl border border-white/10 p-3 overflow-hidden">
              <div className="flex items-center justify-between mb-3 gap-2">
                <h3 className="text-white font-black italic text-sm">ROSTER CORE</h3>
                <MedalIcon size={14} className="text-[#D4A843] shrink-0" />
              </div>
              <div className="space-y-2">
                {ROSTER_HIGHLIGHTS.map((entry) => {
                  const swimmer = SWIMMERS.find((item) => item.id === entry.swimmerId)
                  if (!swimmer) return null
                  return (
                    <div key={entry.id} className="rounded-xl border border-white/10 bg-black/30 p-2.5 min-w-0">
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <div className="min-w-0">
                          <div className="text-white font-bold text-sm truncate">{swimmer.name}</div>
                          <div className="text-[#D4A843] text-[9px] font-bold uppercase tracking-[0.15em] mt-1 truncate">{entry.role}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-white text-base font-black">{swimmer.ovr}</div>
                          <div className="text-white/40 text-[9px] uppercase font-bold">OVR</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 mt-2 text-[9px]">
                        <div className="rounded-lg bg-white/5 px-1.5 py-1 text-white/70 truncate"><span className="block text-white/40">Age</span>{entry.age}</div>
                        <div className="rounded-lg bg-white/5 px-1.5 py-1 text-white/70 truncate"><span className="block text-white/40">Morale</span>{entry.morale}</div>
                        <div className="rounded-lg bg-white/5 px-1.5 py-1 text-white/70 truncate"><span className="block text-white/40">Wage</span>{entry.weeklyWage}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-h-0">
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.02 }} className="flex-1 min-h-0 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-3 border border-purple-500/30 relative overflow-hidden cursor-pointer">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 rounded-full blur-[40px] opacity-40" />
            <h3 className="text-white font-black italic text-lg mb-2 relative z-10">LEGEND DRAFT</h3>
            <div className="flex justify-center items-center gap-1 relative z-10 mt-2">
              <div className="-rotate-6 translate-x-2"><SwimmerCard swimmer={SWIMMERS[0]} size="sm" /></div>
              <div className="z-10 scale-105"><SwimmerCard swimmer={SWIMMERS[1]} size="sm" /></div>
              <div className="rotate-6 -translate-x-2"><SwimmerCard swimmer={SWIMMERS[2]} size="sm" /></div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 h-20">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-[#1A1A2E] to-[#0B1120] rounded-xl border border-white/10 p-3 flex items-center justify-between cursor-pointer relative overflow-hidden shadow-md min-w-0">
              <div className="absolute inset-0 bg-white/5" />
              <div className="min-w-0">
                <div className="text-white/60 font-bold text-[10px] tracking-wider mb-1">CLUB</div>
                <div className="bg-gradient-to-b from-[#D4A843] to-[#A67C00] border border-[#FDE047]/30 rounded p-1 text-center w-11">
                  <div className="text-[7px] text-black/80 font-bold">OVR</div>
                  <div className="text-black font-black leading-none">{USER_DATA.clubOvr}</div>
                </div>
              </div>
              <ShieldIcon size={24} className="text-white/20 shrink-0" />
            </motion.div>

            <motion.div onClick={onPlay} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="bg-gradient-to-br from-[#0D7C66] to-[#065A46] rounded-xl p-3 flex flex-col justify-center cursor-pointer relative overflow-hidden shadow-md min-w-0 active:brightness-125">
              <div className="absolute right-0 bottom-0 w-12 h-12 bg-white/10 rounded-full blur-xl" />
              <h3 className="text-white font-black italic text-lg relative z-10">PLAY</h3>
              <div className="text-white/80 font-bold text-[10px] relative z-10 truncate">QUICK MATCH</div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
