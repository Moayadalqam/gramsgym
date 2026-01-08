'use client'

import { motion } from 'framer-motion'
import { Trophy, Star, Zap, Crown, Medal, Target } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

type BadgeType = 'trophy' | 'star' | 'zap' | 'crown' | 'medal' | 'target'

interface AchievementBadgeProps {
  type?: BadgeType
  icon?: LucideIcon
  title: string
  description?: string
  unlocked?: boolean
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  className?: string
}

const badgeIcons: Record<BadgeType, LucideIcon> = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  crown: Crown,
  medal: Medal,
  target: Target,
}

const rarityColors = {
  common: {
    border: 'border-zinc-600',
    bg: 'from-zinc-800 to-zinc-900',
    glow: 'rgba(113, 113, 122, 0.3)',
    icon: 'text-zinc-400',
  },
  rare: {
    border: 'border-blue-500/50',
    bg: 'from-blue-900/50 to-blue-950/50',
    glow: 'rgba(59, 130, 246, 0.4)',
    icon: 'text-blue-400',
  },
  epic: {
    border: 'border-purple-500/50',
    bg: 'from-purple-900/50 to-purple-950/50',
    glow: 'rgba(168, 85, 247, 0.4)',
    icon: 'text-purple-400',
  },
  legendary: {
    border: 'border-gold-500/50',
    bg: 'from-gold-900/30 to-amber-950/30',
    glow: 'rgba(212, 164, 74, 0.5)',
    icon: 'text-gold-400',
  },
}

export function AchievementBadge({
  type = 'trophy',
  icon,
  title,
  description,
  unlocked = true,
  rarity = 'common',
  className = '',
}: AchievementBadgeProps) {
  const Icon = icon || badgeIcons[type]
  const colors = rarityColors[rarity]

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Glow effect for unlocked badges */}
      {unlocked && rarity !== 'common' && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
            filter: 'blur(15px)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Badge container */}
      <div
        className={`relative p-4 rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.bg} backdrop-blur-sm ${
          !unlocked ? 'opacity-40 grayscale' : ''
        }`}
      >
        {/* Icon */}
        <motion.div
          className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center ${
            unlocked ? 'bg-white/10' : 'bg-white/5'
          }`}
          animate={
            unlocked && rarity === 'legendary'
              ? { rotate: [0, 5, -5, 0] }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </motion.div>

        {/* Title */}
        <h4 className="text-sm font-semibold text-white text-center">
          {title}
        </h4>

        {/* Description */}
        {description && (
          <p className="text-xs text-zinc-500 text-center mt-1">
            {description}
          </p>
        )}

        {/* Locked overlay */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
            <span className="text-xs text-zinc-400">Locked</span>
          </div>
        )}

        {/* Rarity indicator */}
        {rarity !== 'common' && unlocked && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
            style={{ backgroundColor: colors.glow.replace('0.', '1') }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        )}
      </div>
    </motion.div>
  )
}
