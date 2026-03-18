import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BugIcon, ChevronDownIcon, CompassIcon, EyeIcon, XIcon } from 'lucide-react'

interface BrowserToolkitProps {
  activeTab: string
  utilityPage: string | null
  onOpenTab: (tab: string) => void
  onOpenUtility: (page: string) => void
  onCloseUtility: () => void
}

const mainTabs = ['home', 'career', 'club', 'scouts', 'market', 'champs']
const utilityPages = ['friends', 'inbox', 'settings', 'training', 'events', 'rewards', 'pass', 'bonus']

export function BrowserToolkit({
  activeTab,
  utilityPage,
  onOpenTab,
  onOpenUtility,
  onCloseUtility,
}: BrowserToolkitProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="absolute left-4 bottom-24 z-[70] pointer-events-auto">
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="open"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="w-80 rounded-2xl border border-cyan-400/25 bg-[#06111C]/90 backdrop-blur-xl shadow-[0_0_30px_rgba(34,211,238,0.15)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
              <div>
                <div className="text-cyan-300 text-[10px] font-black tracking-[0.35em] uppercase">Browser Toolkit</div>
                <div className="text-white font-bold text-sm mt-1">Live page inspector</div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center"
                aria-label="Collapse browser toolkit"
              >
                <ChevronDownIcon size={16} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <ToolkitStat label="Main Tab" value={activeTab.toUpperCase()} />
                <ToolkitStat label="Overlay Page" value={utilityPage ? utilityPage.toUpperCase() : 'NONE'} />
              </div>

              <div>
                <div className="text-white/60 text-[10px] font-black tracking-[0.25em] uppercase mb-2">Navigate Main Tabs</div>
                <div className="grid grid-cols-3 gap-2">
                  {mainTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => onOpenTab(tab)}
                      className={`rounded-xl px-2 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors ${activeTab === tab && !utilityPage ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-300/30' : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-white/60 text-[10px] font-black tracking-[0.25em] uppercase mb-2">Open Utility Pages</div>
                <div className="grid grid-cols-2 gap-2">
                  {utilityPages.map((page) => (
                    <button
                      key={page}
                      onClick={() => onOpenUtility(page)}
                      className={`rounded-xl px-2 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors ${utilityPage === page ? 'bg-amber-400/20 text-amber-200 border border-amber-300/30' : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onCloseUtility}
                  className="flex-1 rounded-xl px-3 py-2 bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-wide"
                >
                  Clear Overlay
                </button>
                <div className="rounded-xl px-3 py-2 bg-cyan-400/10 text-cyan-200 border border-cyan-300/20 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                  <EyeIcon size={14} /> Live
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="closed"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            onClick={() => setIsExpanded(true)}
            className="rounded-2xl border border-cyan-300/30 bg-[#06111C]/85 backdrop-blur-xl px-4 py-3 text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.12)] flex items-center gap-3"
            aria-label="Open browser toolkit"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-400/15 flex items-center justify-center">
              <BugIcon size={18} />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black tracking-[0.3em] uppercase">Toolkit</div>
              <div className="text-xs text-white/70 font-bold flex items-center gap-1 mt-1"><CompassIcon size={12} /> Inspect UI</div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

function ToolkitStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.25em]">{label}</div>
      <div className="text-white font-bold text-sm mt-1 flex items-center gap-2">
        <XIcon size={12} className="text-cyan-300" />
        {value}
      </div>
    </div>
  )
}
