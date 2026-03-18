import React from 'react'
import { motion } from 'motion/react'
import { TrophyIcon, CalendarIcon, UsersIcon } from 'lucide-react'

export function Championships() {
  return (
    <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full h-full pt-20 pb-24 px-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-white italic mb-6 drop-shadow-md text-center">WORLD <span className="text-[#D4A843]">CHAMPIONSHIPS</span></h1>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-gradient-to-r from-[#2A1F0C] to-[#1A1308] rounded-3xl border border-[#D4A843]/30 p-8 mb-8 relative overflow-hidden shadow-lg">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#D4A843] rounded-full blur-[100px] opacity-10" />
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <div className="inline-block bg-[#C41E3A] text-white font-black text-xs px-3 py-1 rounded-full mb-4 animate-pulse shadow-sm">LIVE NOW</div>
              <h2 className="text-5xl font-black text-white italic mb-2">GLOBAL CUP '26</h2>
              <p className="text-[#E8E0D0] font-medium max-w-md mb-6">Compete against the top 100 clubs worldwide for exclusive legendary rewards.</p>
              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-white/80"><UsersIcon size={20} className="text-[#D4A843]" /><span className="font-bold">64/100 Joined</span></div>
                <div className="flex items-center gap-2 text-white/80"><CalendarIcon size={20} className="text-[#D4A843]" /><span className="font-bold">Ends in 2d 14h</span></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <TrophyIcon size={100} className="text-[#D4A843] drop-shadow-lg mb-4" />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white text-black font-black px-8 py-3 rounded-lg shadow-lg">ENTER TOURNAMENT</motion.button>
            </div>
          </div>
        </motion.div>

        <h3 className="text-white font-bold text-xl mb-4">UPCOMING EVENTS</h3>
        <div className="grid grid-cols-3 gap-6">
          <EventCard title="Sprint Series" type="Freestyle Only" req="OVR 100+" time="Starts in 5h" color="from-blue-900 to-cyan-900" />
          <EventCard title="Endurance Test" type="Medley" req="Level 20+" time="Starts Tomorrow" color="from-purple-900 to-indigo-900" />
          <EventCard title="Rookie Cup" type="All Strokes" req="Max OVR 90" time="Starts in 3d" color="from-green-900 to-emerald-900" />
        </div>
      </div>
    </motion.div>
  )
}

interface EventCardProps { title: string; type: string; req: string; time: string; color: string }
function EventCard({ title, type, req, time, color }: EventCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -5 }} className={`bg-gradient-to-br ${color} rounded-2xl p-6 border border-white/10 shadow-lg cursor-pointer relative overflow-hidden`}>
      <div className="absolute top-0 right-0 bg-black/40 text-white/80 text-[10px] font-bold px-3 py-1 rounded-bl-lg">{time}</div>
      <h4 className="text-2xl font-black text-white italic mt-2 mb-1">{title}</h4>
      <div className="text-[#D4A843] text-xs font-bold uppercase tracking-wider mb-4">{type}</div>
      <div className="bg-black/30 rounded-lg p-3 flex justify-between items-center border border-white/5"><span className="text-white/60 text-xs font-bold">REQ:</span><span className="text-white font-bold text-sm">{req}</span></div>
    </motion.div>
  )
}
