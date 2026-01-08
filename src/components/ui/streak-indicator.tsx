'use client'

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

interface StreakIndicatorProps {
  streak: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { container: 'w-16 h-16', icon: 'w-6 h-6', text: 'text-lg' },
  md: { container: 'w-20 h-20', icon: 'w-8 h-8', text: 'text-xl' },
  lg: { container: 'w-24 h-24', icon: 'w-10 h-10', text: 'text-2xl' },
}

export function StreakIndicator({
  streak,
  label = 'Day Streak',
  size = 'md',
  className = '',
}: StreakIndicatorProps) {
  const sizes = sizeMap[size]

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 ${sizes.container} rounded-full`}
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main container */}
      <div
        className={`relative ${sizes.container} rounded-full flex flex-col items-center justify-center`}
        style={{
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.1) 100%)',
          border: '2px solid rgba(249, 115, 22, 0.3)',
        }}
      >
        {/* Animated flame icon */}
        <motion.div
          animate={{
            y: [0, -2, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Flame className={`${sizes.icon} text-orange-500`} />
        </motion.div>

        {/* Streak number */}
        <motion.span
          className={`${sizes.text} font-bold text-orange-400`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {streak}
        </motion.span>
      </div>

      {/* Label */}
      <motion.p
        className="text-xs text-zinc-500 text-center mt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {label}
      </motion.p>
    </motion.div>
  )
}
