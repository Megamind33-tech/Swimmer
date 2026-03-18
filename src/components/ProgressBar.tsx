import React from 'react'
import { motion } from 'motion/react'

interface ProgressBarProps {
  progress: number
  max?: number
  color?: string
  height?: string
  className?: string
  showLabel?: boolean
}

export function ProgressBar({
  progress,
  max = 100,
  color = 'bg-[#D4A843]',
  height = 'h-2',
  className = '',
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (progress / max) * 100))

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-black/40 rounded-full overflow-hidden ${height} backdrop-blur-sm border border-white/10`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${color} shadow-sm`}
        />
      </div>
      {showLabel && (
        <div className="text-[10px] text-white/70 mt-1 text-right font-mono">
          {progress}/{max}
        </div>
      )}
    </div>
  )
}
