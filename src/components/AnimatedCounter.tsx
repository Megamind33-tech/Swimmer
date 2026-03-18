import React, { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'motion/react'

interface AnimatedCounterProps {
  value: number
  className?: string
}

export function AnimatedCounter({ value, className = '' }: AnimatedCounterProps) {
  const [isMounted, setIsMounted] = useState(false)
  const spring = useSpring(0, {
    mass: 1,
    stiffness: 75,
    damping: 15,
  })

  const display = useTransform(spring, (current) => Math.round(current).toLocaleString())

  useEffect(() => {
    setIsMounted(true)
    spring.set(value)
  }, [value, spring])

  if (!isMounted) {
    return <span className={className}>{value.toLocaleString()}</span>
  }

  return <motion.span className={className}>{display}</motion.span>
}
