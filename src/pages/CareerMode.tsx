import React from 'react'
import { motion } from 'motion/react'
import { ACHIEVEMENTS, CAREER_TRACK, HOME_EVENTS } from '../utils/gameData'
import { ProgressBar } from '../components/ProgressBar'
import { TrophyIcon, MedalIcon, StarIcon, LockIcon, CalendarIcon, TimerIcon } from 'lucide-react'

export function CareerMode() {
  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full h-full pt-16 pb-18 px-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-white italic mb-4 drop-shadow-md">CAREER <span className="text-yellow-400">JOURNEY</span></h1>
        <div className="grid grid-cols-[16rem_minmax(0,1fr)] gap-4 items-start">
          <div className="flex flex-col gap-4 min-w-0">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-white/10 shadow-xl">
              <h3 className="text-white/60 font-bold text-xs tracking-wider mb-3">CURRENT SEASON</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-black text-white leading-none">S4</span><span className="text-[#D4A843] font-bold text-sm mb-1">PRO LEAGUE</span>
              </div>
              <div className="space-y-3">
                <StatRow label="WINS" value="142" icon={<TrophyIcon size={14} className="text-[#D4A843]" />} />
                <StatRow label="MEDALS" value="86" icon={<MedalIcon size={14} className="text-slate-300" />} />
                <StatRow label="RECORDS" value="12" icon={<StarIcon size={14} className="text-[#D4A843]" />} />
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-purple-900/50 to-slate-900 rounded-2xl p-4 border border-purple-500/30 shadow-xl">
              <h3 className="text-white/60 font-bold text-xs tracking-wider mb-3">NEXT UNLOCK</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black/50 rounded-xl flex items-center justify-center border border-white/10 shrink-0"><LockIcon size={20} className="text-white/40" /></div>
                <div className="min-w-0"><div className="text-white font-bold text-sm truncate">Olympic Pool</div><div className="text-[11px] text-[#D4A843] mt-1">Unlocks at Level 35</div></div>
              </div>
            </motion.div>
            <div className="bg-black/40 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
              <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2"><CalendarIcon size={14} className="text-[#D4A843]" /> ROADMAP</h3>
              <div className="space-y-2">
                {CAREER_TRACK.map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-white font-bold text-xs truncate">{item.event}</div>
                        <div className="text-white/50 text-[9px] uppercase tracking-[0.2em] mt-1 truncate">{item.week} • {item.stage}</div>
                      </div>
                      <div className={`text-[9px] font-black uppercase tracking-[0.2em] shrink-0 ${item.state === 'Current' ? 'text-[#D4A843]' : item.state === 'Completed' ? 'text-emerald-400' : 'text-white/40'}`}>{item.state}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-w-0">
            <div className="bg-black/40 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
              <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2"><TrophyIcon size={16} className="text-[#D4A843]" /> FEATURED EVENTS</h3>
              <div className="grid grid-cols-2 gap-3">
                {HOME_EVENTS.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 min-w-0 overflow-hidden flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4A843] truncate">{event.status}</div>
                        <div className="flex items-center gap-1 text-white/70 text-[11px] font-bold shrink-0"><TimerIcon size={12} className="text-[#D4A843]" />{event.time}</div>
                      </div>
                      <div className="text-white font-bold text-base leading-tight max-w-[18rem]">{event.name}</div>
                      <div className="text-white/60 text-[12px] leading-relaxed max-w-[18rem]">{event.reward}</div>
                    </div>
                    <button className="mt-4 self-start rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white hover:bg-white/12 transition-colors whitespace-nowrap">
                      Enter Race
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-4 border border-white/10 backdrop-blur-md h-full">
              <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2"><StarIcon size={16} className="text-[#D4A843]" /> MILESTONES</h3>
              <div className="space-y-3">
                {ACHIEVEMENTS.map((ach, i) => (
                  <motion.div key={ach.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className={`p-3 rounded-xl border ${ach.completed ? 'bg-green-900/20 border-green-500/30' : 'bg-white/5 border-white/10'} flex items-center gap-3 min-w-0`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${ach.completed ? 'bg-green-500/20 text-green-400' : 'bg-black/50 text-white/40'}`}>
                      {ach.completed ? <TrophyIcon size={18} /> : <StarIcon size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-3 mb-1">
                        <h4 className="text-white font-bold text-sm truncate">{ach.title}</h4>
                        <span className="text-[10px] font-bold text-[#D4A843] bg-[#D4A843]/10 px-2 py-1 rounded shrink-0">{ach.reward}</span>
                      </div>
                      <p className="text-white/60 text-[11px] mb-2 leading-snug">{ach.desc}</p>
                      <ProgressBar progress={ach.progress} max={ach.max} color={ach.completed ? 'bg-[#0D7C66]' : 'bg-[#D4A843]'} showLabel />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function StatRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-black/30 p-2.5 rounded-lg border border-white/5 min-w-0">
      <div className="flex items-center gap-2 min-w-0">{icon}<span className="text-white/80 text-xs font-bold truncate">{label}</span></div>
      <span className="text-white font-black text-sm shrink-0">{value}</span>
    </div>
  )
}
