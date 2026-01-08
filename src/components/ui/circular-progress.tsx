'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'

interface CircularProgressProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  className?: string
  showValue?: boolean
  label?: string
  color?: 'gold' | 'green' | 'orange' | 'red' | 'blue'
  glowIntensity?: 'none' | 'low' | 'medium' | 'high'
}

const colorMap = {
  gold: {
    stroke: '#d4a44a',
    glow: 'rgba(212, 164, 74, 0.5)',
  },
  green: {
    stroke: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.5)',
  },
  orange: {
    stroke: '#f97316',
    glow: 'rgba(249, 115, 22, 0.5)',
  },
  red: {
    stroke: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.5)',
  },
  blue: {
    stroke: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.5)',
  },
}

const glowIntensityMap = {
  none: 0,
  low: 4,
  medium: 8,
  high: 16,
}

export function CircularProgress({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  className = '',
  showValue = true,
  label,
  color = 'gold',
  glowIntensity = 'medium',
}: CircularProgressProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [hasAnimated, setHasAnimated] = useState(false)

  const percentage = Math.min((value / max) * 100, 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  const spring = useSpring(0, {
    damping: 30,
    stiffness: 50,
  })

  const strokeDashoffset = useTransform(
    spring,
    (v) => circumference - (v / 100) * circumference
  )

  const [offset, setOffset] = useState(circumference)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      spring.set(percentage)
      setHasAnimated(true)
    }
  }, [isInView, percentage, spring, hasAnimated])

  useEffect(() => {
    const unsubscribe = strokeDashoffset.on('change', (v) => {
      setOffset(v)
    })
    return unsubscribe
  }, [strokeDashoffset])

  const colors = colorMap[color]
  const glowSize = glowIntensityMap[glowIntensity]

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        ref={ref}
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <defs>
          <filter id={`glow-${color}`}>
            <feGaussianBlur stdDeviation={glowSize / 2} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter={glowIntensity !== 'none' ? `url(#glow-${color})` : undefined}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        />
      </svg>

      {/* Center content */}
      {showValue && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="text-2xl font-bold text-white">
            {value}
            <span className="text-sm text-zinc-500">/{max}</span>
          </span>
          {label && (
            <span className="text-xs text-zinc-400 mt-1">{label}</span>
          )}
        </motion.div>
      )}
    </div>
  )
}
