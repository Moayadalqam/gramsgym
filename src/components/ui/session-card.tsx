'use client'

import { motion } from 'framer-motion'
import { Clock, User, Calendar, Dumbbell } from 'lucide-react'

interface SessionCardProps {
  coachName?: string
  memberName?: string
  date: string
  time: string
  duration: number
  type?: 'upcoming' | 'today' | 'past'
  onClick?: () => void
  className?: string
  delay?: number
}

const typeStyles = {
  upcoming: {
    border: 'border-zinc-800',
    badge: 'bg-zinc-800 text-zinc-400',
    glow: false,
  },
  today: {
    border: 'border-gold-500/30',
    badge: 'bg-gold-500/10 text-gold-400',
    glow: true,
  },
  past: {
    border: 'border-zinc-800/50',
    badge: 'bg-zinc-800/50 text-zinc-500',
    glow: false,
  },
}

export function SessionCard({
  coachName,
  memberName,
  date,
  time,
  duration,
  type = 'upcoming',
  onClick,
  className = '',
  delay = 0,
}: SessionCardProps) {
  const name = coachName || memberName || 'Session'
  const styles = typeStyles[type]

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border ${styles.border} bg-zinc-900/50 p-4 cursor-pointer group ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ x: 8, backgroundColor: 'rgba(39, 39, 42, 0.8)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Glow effect for today's sessions */}
      {styles.glow && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(212, 164, 74, 0.1) 0%, transparent 50%)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="relative flex items-center justify-between">
        {/* Left side - Avatar and info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center border border-gold-500/20"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <span className="text-gold-400 font-semibold">
              {name.charAt(0)}
            </span>
          </motion.div>

          {/* Info */}
          <div>
            <p className="font-medium text-white group-hover:text-gold-400 transition-colors">
              {name}
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {duration} min
              </span>
              <span className="flex items-center gap-1">
                <Dumbbell className="w-3 h-3" />
                PT Session
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Date and time */}
        <div className="text-right">
          <motion.span
            className={`text-xs font-medium px-2 py-1 rounded-full ${styles.badge}`}
            whileHover={{ scale: 1.05 }}
          >
            {date}
          </motion.span>
          <p className="text-sm text-gold-400 mt-1 font-medium">{time}</p>
        </div>
      </div>

      {/* Hover arrow indicator */}
      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-400 opacity-0 group-hover:opacity-100"
        initial={{ x: -10 }}
        whileHover={{ x: 0 }}
      >
        →
      </motion.div>
    </motion.div>
  )
}
