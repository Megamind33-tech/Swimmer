import React from 'react'
import { motion } from 'motion/react'
import { CLUB_OBJECTIVES, CLUB_UPCOMING_EVENTS, ROSTER_HIGHLIGHTS, SWIMMERS, USER_DATA } from '../utils/gameData'
import { SwimmerCard } from '../components/SwimmerCard'
import { ShieldIcon, ActivityIcon, CalendarIcon, FlagIcon } from 'lucide-react'

export function ClubManagement() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full h-full pt-16 pb-18 px-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-4 gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-black text-white italic drop-shadow-md">MY <span className="text-[#D4A843]">CLUB</span></h1>
            <p className="text-white/60 text-sm font-medium mt-1">Manage your roster, live events, and weekly club goals</p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-[#1A1A2E] to-[#0B1120] p-3 rounded-2xl border border-[#D4A843]/30 flex items-center gap-4 shadow-md shrink-0">
            <ShieldIcon size={28} className="text-[#D4A843]" />
            <div><div className="text-[#D4A843] text-xs font-bold tracking-wider">TEAM OVR</div><div className="text-3xl font-black text-white leading-none">{USER_DATA.clubOvr}</div></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_18rem] gap-4 items-start">
          <div className="flex flex-col gap-4 min-w-0">
            <div className="bg-black/40 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
              <div className="flex justify-between items-center mb-4 gap-3">
                <h3 className="text-white font-bold text-base">STARTING LINEUP</h3>
                <button className="text-[11px] font-bold text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/20 transition-colors whitespace-nowrap">AUTO BUILD</button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-3 snap-x">
                {SWIMMERS.map((swimmer, i) => (
                  <motion.div key={swimmer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="snap-center shrink-0">
                    <SwimmerCard swimmer={swimmer} size="lg" />
                  </motion.div>
                ))}
                <motion.div whileHover={{ scale: 1.02 }} className="w-36 h-52 rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-white/40 transition-all shrink-0 snap-center">
                  <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center mb-2"><span className="text-white/50 text-xl">+</span></div>
                  <span className="text-white/50 font-bold text-xs">ADD SWIMMER</span>
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 min-w-0">
              <div className="bg-black/40 rounded-2xl p-4 border border-white/10 backdrop-blur-md min-w-0">
                <div className="flex items-center gap-2 mb-3 text-white font-bold text-sm"><FlagIcon size={16} className="text-[#D4A843]" /> ROSTER PLAYERS</div>
                <div className="space-y-2">
                  {ROSTER_HIGHLIGHTS.map((entry) => {
                    const swimmer = SWIMMERS.find((item) => item.id === entry.swimmerId)
                    if (!swimmer) return null
                    return (
                      <div key={entry.id} className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between gap-3 min-w-0">
                        <div className="min-w-0">
                          <div className="text-white font-bold text-sm truncate">{swimmer.name}</div>
                          <div className="text-[#D4A843] text-[9px] font-bold uppercase tracking-[0.2em] mt-1 truncate">{entry.role}</div>
                          <div className="text-white/50 text-[11px] mt-2 truncate">Age {entry.age} • {entry.weeklyWage}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-white font-black text-xl leading-none">{swimmer.ovr}</div>
                          <div className="text-white/50 text-[9px] uppercase">{entry.morale}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-black/40 rounded-2xl p-4 border border-white/10 backdrop-blur-md min-w-0">
                <div className="flex items-center gap-2 mb-3 text-white font-bold text-sm"><CalendarIcon size={16} className="text-[#D4A843]" /> UPCOMING EVENTS</div>
                <div className="space-y-2">
                  {CLUB_UPCOMING_EVENTS.map((event) => (
                    <div key={event.id} className="rounded-xl border border-white/10 bg-gradient-to-r from-white/8 to-white/5 p-3 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[#D4A843] text-[9px] font-bold uppercase tracking-[0.2em] mb-1 truncate">{event.type}</div>
                          <div className="text-white font-bold text-sm truncate">{event.name}</div>
                          <div className="text-white/50 text-[11px] mt-2 truncate">{event.location}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-white text-xs font-black">{event.time}</div>
                          <div className="text-[#D4A843] text-[11px] font-bold mt-1 whitespace-nowrap">{event.prize}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-w-0">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-white/10">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm"><ActivityIcon size={16} className="text-[#D4A843]" /> ACTIVE TRAINING</h3>
              <div className="space-y-3">
                <TrainingSlot name="M. Phelps" type="Speed Drill" time="45m" progress={60} />
                <TrainingSlot name="K. Ledecky" type="Endurance" time="1h 20m" progress={30} />
                <button className="w-full py-2.5 rounded-xl border border-dashed border-white/20 text-white/50 font-bold text-xs hover:bg-white/5 transition-colors flex items-center justify-center gap-2"><span className="text-base leading-none">+</span> UNLOCK SLOT</button>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
              <h3 className="text-white font-bold mb-3 text-sm">WEEKLY OBJECTIVES</h3>
              <div className="space-y-2">
                {CLUB_OBJECTIVES.map((objective, index) => (
                  <div key={objective} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 flex items-start gap-3 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-[#D4A843]/15 text-[#D4A843] flex items-center justify-center text-[10px] font-black shrink-0">{index + 1}</div>
                    <div className="text-white/80 text-xs leading-snug">{objective}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TrainingSlot({ name, type, time, progress }: { name: string; type: string; time: string; progress: number }) {
  return (
    <div className="bg-black/40 p-3 rounded-xl border border-white/5 min-w-0">
      <div className="flex justify-between items-start mb-2 gap-2">
        <div className="min-w-0"><div className="text-white font-bold text-xs truncate">{name}</div><div className="text-[#D4A843] text-[9px] font-bold uppercase truncate">{type}</div></div>
        <div className="text-white/60 text-[10px] font-mono shrink-0">{time}</div>
      </div>
      <div className="w-full h-1.5 bg-black rounded-full overflow-hidden"><div className="h-full bg-[#D4A843]" style={{ width: `${progress}%` }} /></div>
    </div>
  )
}
