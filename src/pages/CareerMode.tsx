import React from 'react'
import { motion } from 'motion/react'
import { ACHIEVEMENTS, CAREER_TRACK, HOME_EVENTS } from '../utils/gameData'
import { ProgressBar } from '../components/ProgressBar'
import { TrophyIcon, MedalIcon, StarIcon, LockIcon, CalendarIcon } from 'lucide-react'

export function CareerMode() {
  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full h-full pt-20 pb-24 px-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-white italic mb-6 drop-shadow-md">CAREER <span className="text-yellow-400">JOURNEY</span></h1>
        <div className="grid grid-cols-[18rem_minmax(0,1fr)] gap-6">
          <div className="flex flex-col gap-6">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10 shadow-xl">
              <h3 className="text-white/60 font-bold text-sm tracking-wider mb-4">CURRENT SEASON</h3>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-black text-white">S4</span><span className="text-[#D4A843] font-bold mb-1">PRO LEAGUE</span>
              </div>
              <div className="space-y-4">
                <StatRow label="WINS" value="142" icon={<TrophyIcon size={16} className="text-[#D4A843]" />} />
                <StatRow label="MEDALS" value="86" icon={<MedalIcon size={16} className="text-slate-300" />} />
                <StatRow label="RECORDS" value="12" icon={<StarIcon size={16} className="text-[#D4A843]" />} />
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-purple-900/50 to-slate-900 rounded-2xl p-6 border border-purple-500/30 shadow-xl">
              <h3 className="text-white/60 font-bold text-sm tracking-wider mb-4">NEXT UNLOCK</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-black/50 rounded-xl flex items-center justify-center border border-white/10"><LockIcon size={24} className="text-white/40" /></div>
                <div><div className="text-white font-bold">Olympic Pool</div><div className="text-xs text-[#D4A843] mt-1">Unlocks at Level 35</div></div>
              </div>
            </motion.div>
            <div className="bg-black/40 rounded-2xl p-5 border border-white/10 backdrop-blur-md">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><CalendarIcon size={16} className="text-[#D4A843]" /> ROADMAP</h3>
              <div className="space-y-3">
                {CAREER_TRACK.map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-white font-bold text-sm">{item.event}</div>
                        <div className="text-white/50 text-[10px] uppercase tracking-[0.25em] mt-1">{item.week} • {item.stage}</div>
                      </div>
                      <div className={`text-[10px] font-black uppercase tracking-[0.25em] ${item.state === 'Current' ? 'text-[#D4A843]' : item.state === 'Completed' ? 'text-emerald-400' : 'text-white/40'}`}>{item.state}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-black/40 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><TrophyIcon className="text-[#D4A843]" /> FEATURED EVENTS</h3>
              <div className="grid grid-cols-3 gap-4">
                {HOME_EVENTS.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D4A843] mb-2">{event.status}</div>
                    <div className="text-white font-bold text-lg leading-tight">{event.name}</div>
                    <div className="text-white/60 text-xs mt-2">{event.reward}</div>
                    <div className="text-white/70 text-xs mt-4">{event.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 border border-white/10 backdrop-blur-md h-full">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><StarIcon className="text-[#D4A843]" /> MILESTONES</h3>
              <div className="space-y-4">
                {ACHIEVEMENTS.map((ach, i) => (
                  <motion.div key={ach.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`p-4 rounded-xl border ${ach.completed ? 'bg-green-900/20 border-green-500/30' : 'bg-white/5 border-white/10'} flex items-center gap-4`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ach.completed ? 'bg-green-500/20 text-green-400' : 'bg-black/50 text-white/40'}`}>
                      {ach.completed ? <TrophyIcon size={20} /> : <StarIcon size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1"><h4 className="text-white font-bold">{ach.title}</h4><span className="text-xs font-bold text-[#D4A843] bg-[#D4A843]/10 px-2 py-1 rounded">{ach.reward}</span></div>
                      <p className="text-white/60 text-xs mb-2">{ach.desc}</p>
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
    <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg border border-white/5">
      <div className="flex items-center gap-2">{icon}<span className="text-white/80 text-sm font-bold">{label}</span></div>
      <span className="text-white font-black">{value}</span>
    </div>
  )
}
