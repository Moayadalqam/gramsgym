'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Users,
  AlertTriangle,
  Calendar,
  TrendingUp,
  UserPlus,
  CreditCard,
  Clock,
  ChevronRight,
  Dumbbell,
  ArrowUpRight,
  Activity,
  Zap,
  Target,
  BarChart3,
  Bell,
  Star,
} from 'lucide-react'
import { FloatingParticles } from '@/components/ui/floating-particles'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { GlowCard } from '@/components/ui/glow-card'
import { CircularProgress } from '@/components/ui/circular-progress'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { AnimatedProgress } from '@/components/ui/animated-progress'
import { StatCard } from '@/components/ui/stat-card'
import { SessionCard } from '@/components/ui/session-card'

// Mock data for demo
const mockStats = {
  activeMembers: 127,
  expiringThisWeek: 8,
  todaySessions: 12,
  lowSessionPackages: 5,
  monthlyRevenue: 24500,
  completionRate: 94,
}

const mockTodayBookings = [
  { id: '1', memberName: 'Ahmad Khalil', time: '9:00 AM', duration: 60, status: 'confirmed' },
  { id: '2', memberName: 'Sara Hassan', time: '10:30 AM', duration: 45, status: 'confirmed' },
  { id: '3', memberName: 'Mohammed Ali', time: '2:00 PM', duration: 60, status: 'pending' },
  { id: '4', memberName: 'Layla Noor', time: '4:30 PM', duration: 45, status: 'confirmed' },
  { id: '5', memberName: 'Omar Faisal', time: '6:00 PM', duration: 60, status: 'confirmed' },
]

const mockExpiringMemberships = [
  { id: '1', memberName: 'Yousef Ahmed', type: 'Monthly', daysLeft: 2 },
  { id: '2', memberName: 'Nadia Samir', type: 'Quarterly', daysLeft: 4 },
  { id: '3', memberName: 'Tariq Hassan', type: 'Monthly', daysLeft: 5 },
  { id: '4', memberName: 'Rania Khalid', type: 'Monthly', daysLeft: 7 },
]

const mockLowSessions = [
  { id: '1', memberName: 'Karim Mahmoud', remaining: 1, total: 8 },
  { id: '2', memberName: 'Hana Ibrahim', remaining: 2, total: 16 },
  { id: '3', memberName: 'Fadi Nassar', remaining: 3, total: 8 },
]

const mockRecentActivity = [
  { id: '1', type: 'booking', message: 'New booking from Ahmad Khalil', time: '5 min ago' },
  { id: '2', type: 'payment', message: 'Payment received from Sara Hassan', time: '1 hour ago' },
  { id: '3', type: 'renewal', message: 'Membership renewed by Mohammed Ali', time: '3 hours ago' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export default function CoachDashboardPage() {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="relative min-h-screen">
      {/* Animated background */}
      <AnimatedBackground variant="aurora" />
      <FloatingParticles count={25} color="rgba(212, 164, 74, 0.15)" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 space-y-8"
      >
        {/* Hero Section with Stats Overview */}
        <motion.div variants={itemVariants}>
          <div className="relative overflow-hidden rounded-3xl">
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gold-500/30 via-gold-400/20 to-gold-500/30 p-[1px]">
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(212, 164, 74, 0.3), transparent)',
                }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            <div className="relative rounded-3xl bg-gradient-to-br from-zinc-900/95 via-black to-zinc-900/95 p-8 md:p-10">
              {/* Decorative orbs */}
              <motion.div
                className="absolute top-10 right-10 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 7, repeat: Infinity }}
              />

              <div className="relative">
                {/* Greeting */}
                <motion.div
                  className="flex items-center gap-3 mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Star className="w-5 h-5 text-gold-400" />
                  </motion.div>
                  <span className="text-sm text-gold-400 font-medium tracking-wide uppercase">
                    Coach Dashboard
                  </span>
                </motion.div>

                <motion.h1
                  className="text-3xl md:text-4xl font-display font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {greeting}, Coach
                </motion.h1>

                <motion.p
                  className="text-zinc-400 max-w-lg mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Here&apos;s your gym at a glance. You have {mockStats.todaySessions} sessions scheduled today.
                </motion.p>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Active Members', value: mockStats.activeMembers, icon: Users, color: 'gold', suffix: '' },
                    { label: 'Today\'s Sessions', value: mockStats.todaySessions, icon: Calendar, color: 'blue', suffix: '' },
                    { label: 'Completion Rate', value: mockStats.completionRate, icon: Target, color: 'green', suffix: '%' },
                    { label: 'Expiring Soon', value: mockStats.expiringThisWeek, icon: AlertTriangle, color: 'orange', suffix: '' },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="relative p-4 rounded-2xl overflow-hidden"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                        <span className="text-xs text-zinc-500">{stat.label}</span>
                      </div>
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                        className={`text-2xl font-bold text-${stat.color}-400`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          <Link href="/coach/members/new">
            <motion.button
              className="px-5 py-2.5 rounded-xl font-semibold text-black bg-gradient-to-r from-gold-400 to-gold-500 flex items-center gap-2 shadow-lg shadow-gold-500/20"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(212, 164, 74, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </motion.button>
          </Link>
          <Link href="/coach/subscriptions">
            <motion.button
              className="px-5 py-2.5 rounded-xl font-medium text-white bg-zinc-800/80 border border-zinc-700 flex items-center gap-2 hover:bg-zinc-700/80"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CreditCard className="w-4 h-4" />
              New Subscription
            </motion.button>
          </Link>
          <Link href="/coach/bookings">
            <motion.button
              className="px-5 py-2.5 rounded-xl font-medium text-white bg-zinc-800/80 border border-zinc-700 flex items-center gap-2 hover:bg-zinc-700/80"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-4 h-4" />
              View Bookings
            </motion.button>
          </Link>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Schedule & Alerts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <motion.div variants={itemVariants}>
              <GlowCard className="p-6" glowColor="rgba(59, 130, 246, 0.2)">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="p-2.5 rounded-xl bg-blue-500/10"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    >
                      <Clock className="w-5 h-5 text-blue-400" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-white">Today&apos;s Schedule</h3>
                      <p className="text-xs text-zinc-500">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400">
                      {mockTodayBookings.length} sessions
                    </span>
                    <CircularProgress
                      value={mockTodayBookings.filter(b => b.status === 'confirmed').length}
                      max={mockTodayBookings.length}
                      size={40}
                      strokeWidth={4}
                      color="blue"
                      showValue={false}
                      glowIntensity="low"
                    />
                  </motion.div>
                </div>

                {/* Timeline View */}
                <div className="space-y-3">
                  {mockTodayBookings.map((booking, index) => (
                    <SessionCard
                      key={booking.id}
                      memberName={booking.memberName}
                      date={booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      time={booking.time}
                      duration={booking.duration}
                      type={booking.status === 'pending' ? 'upcoming' : 'today'}
                      delay={index * 0.05}
                    />
                  ))}
                </div>

                <Link href="/coach/bookings">
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

            {/* Two Column Alerts */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Expiring Memberships */}
              <motion.div variants={itemVariants}>
                <GlowCard className="p-6 h-full" glowColor="rgba(249, 115, 22, 0.2)">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="p-2 rounded-xl bg-orange-500/10"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">Expiring Soon</h3>
                        <p className="text-xs text-zinc-500">Need renewal</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-500/10 text-orange-400">
                      {mockExpiringMemberships.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {mockExpiringMemberships.slice(0, 3).map((membership, index) => (
                      <motion.div
                        key={membership.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/50 cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center">
                            <span className="text-gold-400 font-semibold text-xs">
                              {membership.memberName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{membership.memberName}</p>
                            <p className="text-xs text-zinc-500">{membership.type}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          membership.daysLeft <= 3 ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'
                        }`}>
                          {membership.daysLeft}d
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <Link href="/coach/subscriptions">
                    <motion.button
                      className="w-full mt-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.02 }}
                    >
                      Manage All
                      <ChevronRight className="w-3 h-3" />
                    </motion.button>
                  </Link>
                </GlowCard>
              </motion.div>

              {/* Low PT Sessions */}
              <motion.div variants={itemVariants}>
                <GlowCard className="p-6 h-full" glowColor="rgba(239, 68, 68, 0.2)">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="p-2 rounded-xl bg-red-500/10"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Dumbbell className="w-5 h-5 text-red-400" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">Low Sessions</h3>
                        <p className="text-xs text-zinc-500">≤3 remaining</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-500/10 text-red-400">
                      {mockLowSessions.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {mockLowSessions.map((pkg, index) => (
                      <motion.div
                        key={pkg.id}
                        className="p-3 rounded-xl bg-zinc-900/50"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center">
                              <span className="text-gold-400 font-semibold text-xs">
                                {pkg.memberName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-white">{pkg.memberName}</span>
                          </div>
                          <span className={`text-xs font-semibold ${
                            pkg.remaining <= 1 ? 'text-red-400' : 'text-orange-400'
                          }`}>
                            {pkg.remaining}/{pkg.total}
                          </span>
                        </div>
                        <AnimatedProgress
                          value={pkg.remaining}
                          max={pkg.total}
                          color={pkg.remaining <= 1 ? 'red' : 'orange'}
                          size="sm"
                          showPercentage={false}
                        />
                      </motion.div>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Activity & Performance */}
          <div className="space-y-6">
            {/* Performance Overview */}
            <motion.div variants={itemVariants}>
              <GlowCard className="p-6" glowColor="rgba(34, 197, 94, 0.2)">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="p-2.5 rounded-xl bg-green-500/10"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <BarChart3 className="w-5 h-5 text-green-400" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-white">Performance</h3>
                    <p className="text-xs text-zinc-500">This month</p>
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="flex justify-center mb-6">
                  <CircularProgress
                    value={mockStats.completionRate}
                    max={100}
                    size={140}
                    strokeWidth={10}
                    color="green"
                    glowIntensity="high"
                    label="Completion"
                  />
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-gold-500/10">
                        <TrendingUp className="w-3 h-3 text-gold-400" />
                      </div>
                      <span className="text-sm text-zinc-400">Sessions Completed</span>
                    </div>
                    <AnimatedCounter value={156} className="font-semibold text-white" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/10">
                        <Users className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-sm text-zinc-400">New Members</span>
                    </div>
                    <AnimatedCounter value={12} className="font-semibold text-white" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-500/10">
                        <Star className="w-3 h-3 text-purple-400" />
                      </div>
                      <span className="text-sm text-zinc-400">Avg. Rating</span>
                    </div>
                    <span className="font-semibold text-white">4.9 ⭐</span>
                  </div>
                </div>
              </GlowCard>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
              <GlowCard className="p-6" glowColor="rgba(168, 85, 247, 0.2)">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="p-2.5 rounded-xl bg-purple-500/10"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Activity className="w-5 h-5 text-purple-400" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-white">Recent Activity</h3>
                    <p className="text-xs text-zinc-500">Latest updates</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockRecentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div
                        className={`p-2 rounded-lg ${
                          activity.type === 'booking' ? 'bg-blue-500/10' :
                          activity.type === 'payment' ? 'bg-green-500/10' :
                          'bg-gold-500/10'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {activity.type === 'booking' && <Calendar className="w-3 h-3 text-blue-400" />}
                        {activity.type === 'payment' && <CreditCard className="w-3 h-3 text-green-400" />}
                        {activity.type === 'renewal' && <Zap className="w-3 h-3 text-gold-400" />}
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-sm text-white">{activity.message}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  className="w-full mt-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  View All Activity
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </GlowCard>
            </motion.div>

            {/* Quick Notifications */}
            <motion.div variants={itemVariants}>
              <GlowCard className="p-5" glowColor="rgba(212, 164, 74, 0.2)">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="relative p-2 rounded-xl bg-gold-500/10"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Bell className="w-5 h-5 text-gold-400" />
                      <motion.span
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        3
                      </motion.span>
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">Notifications</h4>
                      <p className="text-xs text-zinc-500">3 unread</p>
                    </div>
                  </div>
                  <motion.button
                    className="text-xs text-gold-400 hover:text-gold-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    View All →
                  </motion.button>
                </div>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
