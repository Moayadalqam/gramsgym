'use client'

import { motion } from 'framer-motion'

interface AnimatedBackgroundProps {
  variant?: 'gradient' | 'mesh' | 'aurora'
  className?: string
}

export function AnimatedBackground({
  variant = 'gradient',
  className = '',
}: AnimatedBackgroundProps) {
  if (variant === 'aurora') {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-black" />
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212, 164, 74, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212, 164, 74, 0.1) 0%, transparent 70%)',
          }}
          animate={{
            rotate: [360, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    )
  }

  if (variant === 'mesh') {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-black" />
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'rgba(212, 164, 74, 0.1)' }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'rgba(212, 164, 74, 0.08)' }}
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'rgba(212, 164, 74, 0.05)' }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    )
  }

  // Default gradient variant
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(212, 164, 74, 0.1) 0%, transparent 50%, rgba(212, 164, 74, 0.05) 100%)',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}
