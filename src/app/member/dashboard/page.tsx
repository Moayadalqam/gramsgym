'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  CreditCard,
  Calendar,
  Clock,
  Dumbbell,
  CalendarPlus,
  ChevronRight,
  Sparkles,
  Trophy,
  Target,
  Zap,
  TrendingUp,
  Activity,
  Flame,
} from 'lucide-react'
import { FloatingParticles } from '@/components/ui/floating-particles'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { GlowCard } from '@/components/ui/glow-card'
import { CircularProgress } from '@/components/ui/circular-progress'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { AnimatedProgress } from '@/components/ui/animated-progress'
import { StatCard } from '@/components/ui/stat-card'
import { SessionCard } from '@/components/ui/session-card'
import { StreakIndicator } from '@/components/ui/streak-indicator'
import { AchievementBadge } from '@/components/ui/achievement-badge'

// Mock data for demo
const mockMember = {
  name: 'Ahmad Khalil',
  membership: {
    type: 'Quarterly',
    daysLeft: 45,
    endDate: '2026-02-22',
    totalDays: 90,
  },
  ptSessions: {
    remaining: 12,
    total: 16,
  },
  streak: 7,
  totalWorkouts: 48,
  coach: {
    name: 'Ahmad Grams',
    specialty: 'Strength & Conditioning',
    avatar: 'AG',
  },
}

const mockUpcomingBookings = [
  { id: '1', coachName: 'Ahmad Grams', date: 'Today', time: '4:30 PM', duration: 60 },
  { id: '2', coachName: 'Ahmad Grams', date: 'Tomorrow', time: '10:00 AM', duration: 60 },
  { id: '3', coachName: 'Ahmad Grams', date: 'Jan 12', time: '2:00 PM', duration: 45 },
]

const mockAchievements = [
  { id: '1', type: 'trophy' as const, title: 'First Session', description: 'Complete your first PT session', unlocked: true, rarity: 'common' as const },
  { id: '2', type: 'zap' as const, title: 'Week Warrior', description: '7-day workout streak', unlocked: true, rarity: 'rare' as const },
  { id: '3', type: 'target' as const, title: 'Goal Crusher', description: 'Hit 10 fitness goals', unlocked: false, rarity: 'epic' as const },
  { id: '4', type: 'crown' as const, title: 'Elite Member', description: '100 total workouts', unlocked: false, rarity: 'legendary' as const },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export default function MemberDashboardPage() {
  return (
    <div className="relative min-h-screen">
      {/* Animated background */}
      <AnimatedBackground variant="mesh" />
      <FloatingParticles count={20} color="rgba(212, 164, 74, 0.2)" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 space-y-8"
      >
        {/* Hero Welcome Section */}
        <motion.div variants={itemVariants}>
          <div className="relative overflow-hidden rounded-3xl">
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-gold-500/50 via-gold-400/30 to-gold-500/50">
              <div className="absolute inset-0 rounded-3xl animate-pulse bg-gradient-to-r from-gold-500/20 via-transparent to-gold-500/20" />
            </div>

            <div className="relative rounded-3xl bg-gradient-to-br from-zinc-900/90 via-zinc-900/95 to-black p-8 md:p-10">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl" />

              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Welcome text */}
                <div className="flex-1">
                  <motion.div
                    className="flex items-center gap-2 mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5 text-gold-400" />
                    </motion.div>
                    <span className="text-sm text-gold-400 font-medium tracking-wide uppercase">
                      Welcome back
                    </span>
                  </motion.div>

                  <motion.h1
                    className="text-4xl md:text-5xl font-display font-bold mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                      {mockMember.name.split(' ')[0]}
                    </span>
                    <motion.span
                      className="inline-block ml-2"
                      animate={{ rotate: [0, 20, 0] }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >
                      💪
                    </motion.span>
                  </motion.h1>

                  <motion.p
                    className="text-zinc-400 text-lg max-w-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Ready to crush another workout? Your fitness journey continues.
                  </motion.p>
                </div>

                {/* Streak indicator */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                >
                  <StreakIndicator streak={mockMember.streak} size="lg" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Membership Status */}
          <GlowCard className="p-6" glowColor="rgba(34, 197, 94, 0.3)">
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className="p-3 rounded-xl bg-green-500/10"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <CreditCard className="w-6 h-6 text-green-400" />
              </motion.div>
              <motion.span
                className="text-xs font-medium px-3 py-1 rounded-full bg-green-500/10 text-green-400"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Active
              </motion.span>
            </div>
            <p className="text-2xl font-display font-bold capitalize text-white">
              {mockMember.membership.type}
            </p>
            <p className="text-sm text-zinc-500 mt-1">Gym Membership</p>
            <div className="mt-4">
              <AnimatedProgress
                value={mockMember.membership.daysLeft}
                max={mockMember.membership.totalDays}
                color="green"
                label="Days Remaining"
                size="sm"
              />
            </div>
          </GlowCard>

          {/* PT Sessions - Circular Progress */}
          <GlowCard className="p-6" glowColor="rgba(212, 164, 74, 0.3)">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    className="p-2 rounded-lg bg-gold-500/10"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Dumbbell className="w-5 h-5 text-gold-400" />
                  </motion.div>
                  <span className="text-sm text-zinc-400">PT Sessions</span>
                </div>
                <p className="text-sm text-zinc-500 mt-4">
                  Sessions remaining in your package
                </p>
              </div>
              <CircularProgress
                value={mockMember.ptSessions.remaining}
                max={mockMember.ptSessions.total}
                size={80}
                strokeWidth={6}
                color="gold"
                glowIntensity="high"
              />
            </div>
          </GlowCard>

          {/* Next Session */}
          <GlowCard className="p-6" glowColor="rgba(249, 115, 22, 0.3)">
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className="p-3 rounded-xl bg-orange-500/10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Calendar className="w-6 h-6 text-orange-400" />
              </motion.div>
            </div>
            {mockUpcomingBookings.length > 0 ? (
              <>
                <p className="text-2xl font-display font-bold text-white">
                  {mockUpcomingBookings[0].date}
                </p>
                <p className="text-sm text-zinc-500 mt-1">Next Session</p>
                <motion.p
                  className="text-lg text-orange-400 font-semibold mt-2"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {mockUpcomingBookings[0].time}
                </motion.p>
              </>
            ) : (
              <p className="text-zinc-500">No upcoming sessions</p>
            )}
          </GlowCard>

          {/* Quick Book CTA */}
          <Link href="/member/book" className="block">
            <motion.div
              className="relative h-full overflow-hidden rounded-2xl p-6 cursor-pointer group"
              style={{
                background: 'linear-gradient(135deg, rgba(212, 164, 74, 0.15) 0%, rgba(212, 164, 74, 0.05) 100%)',
                border: '1px solid rgba(212, 164, 74, 0.3)',
              }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: 'radial-gradient(circle at center, rgba(212, 164, 74, 0.2) 0%, transparent 70%)',
                }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative">
                <motion.div
                  className="p-3 rounded-xl bg-gold-500/20 w-fit mb-4"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <CalendarPlus className="w-6 h-6 text-gold-400" />
                </motion.div>
                <p className="text-xl font-semibold text-white">Book Session</p>
                <p className="text-sm text-zinc-400 mt-1">Schedule your next PT</p>

                <motion.div
                  className="absolute bottom-0 right-0 text-gold-400"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Coach & Sessions */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Coach Section */}
            <motion.div variants={itemVariants}>
              <GlowCard className="p-6" glowColor="rgba(212, 164, 74, 0.2)">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="p-2.5 rounded-xl bg-gold-500/10"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Trophy className="w-5 h-5 text-gold-400" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-white">My Coach</h3>
                      <p className="text-xs text-zinc-500">Your personal trainer</p>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="flex items-center gap-5 p-5 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Coach Avatar */}
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400/30 to-gold-600/20 flex items-center justify-center border border-gold-500/30">
                      <span className="text-gold-400 font-bold text-2xl">
                        {mockMember.coach.avatar}
                      </span>
                    </div>
                    {/* Online indicator */}
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Coach Info */}
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-white">{mockMember.coach.name}</h4>
                    <p className="text-sm text-gold-400">{mockMember.coach.specialty}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-zinc-500">⭐ 4.9 Rating</span>
                      <span className="text-xs text-zinc-500">💪 200+ Sessions</span>
                    </div>
                  </div>

                  {/* Message button */}
                  <motion.button
                    className="p-3 rounded-xl bg-gold-500/10 text-gold-400 hover:bg-gold-500/20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    💬
                  </motion.button>
                </motion.div>

                <Link href="/member/book">
                  <motion.button
                    className="w-full mt-5 py-3.5 rounded-xl font-semibold text-black bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 transition-all shadow-lg shadow-gold-500/20"
                    whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(212, 164, 74, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Book a Session
                  </motion.button>
                </Link>
              </GlowCard>
            </motion.div>

            {/* Upcoming Sessions */}
            <motion.div variants={itemVariants}>
              <GlowCard className="p-6" glowColor="rgba(59, 130, 246, 0.2)">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="p-2.5 rounded-xl bg-blue-500/10"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <Clock className="w-5 h-5 text-blue-400" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-white">Upcoming Sessions</h3>
                      <p className="text-xs text-zinc-500">Your scheduled PT sessions</p>
                    </div>
                  </div>
                  <motion.span
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {mockUpcomingBookings.length} booked
                  </motion.span>
                </div>

                <AnimatePresence>
                  {mockUpcomingBookings.length > 0 ? (
                    <div className="space-y-3">
                      {mockUpcomingBookings.map((booking, index) => (
                        <SessionCard
                          key={booking.id}
                          coachName={booking.coachName}
                          date={booking.date}
                          time={booking.time}
                          duration={booking.duration}
                          type={booking.date === 'Today' ? 'today' : 'upcoming'}
                          delay={index * 0.1}
                        />
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      className="text-center py-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Clock className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                      <p className="text-zinc-500 mb-4">No upcoming sessions</p>
                      <Link href="/member/book">
                        <motion.button
                          className="px-6 py-2 rounded-xl text-sm font-medium text-gold-400 bg-gold-500/10 hover:bg-gold-500/20"
                          whileHover={{ scale: 1.05 }}
                        >
                          Book Now
                        </motion.button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link href="/member/bookings">
                  <motion.button
                    className="w-full mt-5 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    View All Bookings
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </GlowCard>
            </motion.div>
          </div>

          {/* Right Column - Stats & Achievements */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div variants={itemVariants}>
              <GlowCard className="p-6" glowColor="rgba(168, 85, 247, 0.2)">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="p-2.5 rounded-xl bg-purple-500/10"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Activity className="w-5 h-5 text-purple-400" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-white">Your Stats</h3>
                    <p className="text-xs text-zinc-500">Fitness progress</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-500/10">
                        <Flame className="w-4 h-4 text-orange-400" />
                      </div>
                      <span className="text-sm text-zinc-400">Current Streak</span>
                    </div>
                    <span className="font-semibold text-orange-400">{mockMember.streak} days</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <Target className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-sm text-zinc-400">Total Workouts</span>
                    </div>
                    <AnimatedCounter value={mockMember.totalWorkouts} className="font-semibold text-green-400" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-sm text-zinc-400">This Month</span>
                    </div>
                    <span className="font-semibold text-blue-400">+12 sessions</span>
                  </div>
                </div>
              </GlowCard>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={itemVariants}>
              <GlowCard className="p-6" glowColor="rgba(212, 164, 74, 0.2)">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="p-2.5 rounded-xl bg-gold-500/10"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Trophy className="w-5 h-5 text-gold-400" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-white">Achievements</h3>
                      <p className="text-xs text-zinc-500">Your earned badges</p>
                    </div>
                  </div>
                  <span className="text-xs text-gold-400">
                    {mockAchievements.filter(a => a.unlocked).length}/{mockAchievements.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {mockAchievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      type={achievement.type}
                      title={achievement.title}
                      description={achievement.description}
                      unlocked={achievement.unlocked}
                      rarity={achievement.rarity}
                    />
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
