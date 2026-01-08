'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'

interface AnimatedProgressProps {
  value: number
  max: number
  label?: string
  showPercentage?: boolean
  color?: 'gold' | 'green' | 'orange' | 'red' | 'blue' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  animated?: boolean
}

const colorMap = {
  gold: 'bg-gold-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  gradient: 'bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500',
}

const glowMap = {
  gold: 'shadow-[0_0_20px_rgba(212,164,74,0.5)]',
  green: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
  orange: 'shadow-[0_0_20px_rgba(249,115,22,0.5)]',
  red: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
  blue: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
  gradient: 'shadow-[0_0_20px_rgba(212,164,74,0.5)]',
}

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export function AnimatedProgress({
  value,
  max,
  label,
  showPercentage = true,
  color = 'gold',
  size = 'md',
  className = '',
  animated = true,
}: AnimatedProgressProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })
  const [hasAnimated, setHasAnimated] = useState(false)

  const percentage = Math.min((value / max) * 100, 100)

  const spring = useSpring(0, {
    damping: 30,
    stiffness: 50,
  })

  const width = useTransform(spring, (v) => `${v}%`)
  const [widthValue, setWidthValue] = useState('0%')

  useEffect(() => {
    if (isInView && !hasAnimated) {
      spring.set(percentage)
      setHasAnimated(true)
    }
  }, [isInView, percentage, spring, hasAnimated])

  useEffect(() => {
    const unsubscribe = width.on('change', (v) => {
      setWidthValue(v)
    })
    return unsubscribe
  }, [width])

  return (
    <div ref={ref} className={className}>
      {/* Header */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-zinc-400">{label}</span>}
          {showPercentage && (
            <motion.span
              className="text-sm font-medium text-white"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {value}/{max}
            </motion.span>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div className={`w-full ${sizeMap[size]} bg-zinc-800 rounded-full overflow-hidden`}>
        {/* Progress fill */}
        <motion.div
          className={`${sizeMap[size]} rounded-full ${colorMap[color]} ${glowMap[color]} relative overflow-hidden`}
          style={{ width: widthValue }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          {/* Shimmer effect */}
          {animated && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              }}
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: 1,
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}
