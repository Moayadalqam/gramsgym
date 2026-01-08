'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { AnimatedCounter } from './animated-counter'

interface StatCardProps {
  label: string
  value: number
  suffix?: string
  prefix?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'gold' | 'green' | 'orange' | 'red' | 'blue'
  delay?: number
  className?: string
}

const colorMap = {
  gold: {
    icon: 'text-gold-400',
    bg: 'bg-gold-500/10',
    glow: 'rgba(212, 164, 74, 0.2)',
    trend: 'text-gold-400',
  },
  green: {
    icon: 'text-green-400',
    bg: 'bg-green-500/10',
    glow: 'rgba(34, 197, 94, 0.2)',
    trend: 'text-green-400',
  },
  orange: {
    icon: 'text-orange-400',
    bg: 'bg-orange-500/10',
    glow: 'rgba(249, 115, 22, 0.2)',
    trend: 'text-orange-400',
  },
  red: {
    icon: 'text-red-400',
    bg: 'bg-red-500/10',
    glow: 'rgba(239, 68, 68, 0.2)',
    trend: 'text-red-400',
  },
  blue: {
    icon: 'text-blue-400',
    bg: 'bg-blue-500/10',
    glow: 'rgba(59, 130, 246, 0.2)',
    trend: 'text-blue-400',
  },
}

export function StatCard({
  label,
  value,
  suffix = '',
  prefix = '',
  icon: Icon,
  trend,
  color = 'gold',
  delay = 0,
  className = '',
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const colors = colorMap[color]

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl p-6 ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl"
        style={{ backgroundColor: colors.glow }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Icon */}
      <motion.div
        className={`relative w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Icon className={`w-6 h-6 ${colors.icon}`} />
      </motion.div>

      {/* Value */}
      <div className="relative">
        <AnimatedCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          className="text-3xl font-bold text-white"
        />

        {/* Label */}
        <p className="text-sm text-zinc-500 mt-1">{label}</p>

        {/* Trend */}
        {trend && (
          <motion.div
            className={`flex items-center gap-1 mt-2 ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: delay + 0.3 }}
          >
            <motion.span
              animate={{ y: trend.isPositive ? [0, -2, 0] : [0, 2, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {trend.isPositive ? '↑' : '↓'}
            </motion.span>
            <span className="text-xs font-medium">
              {trend.value}% from last month
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
