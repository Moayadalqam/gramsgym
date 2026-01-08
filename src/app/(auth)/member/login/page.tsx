'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import {
  Dumbbell,
  Loader2,
  ArrowLeft,
  Mail,
  KeyRound,
  Sparkles,
  Play,
  Zap,
  Trophy,
  Target,
} from 'lucide-react'
import { FloatingParticles } from '@/components/ui/floating-particles'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { GlowCard } from '@/components/ui/glow-card'

export default function MemberLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'password' | 'magic'>('password')
  const [isConfigured, setIsConfigured] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured())
  }, [])

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConfigured) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Database connection unavailable')
        setLoading(false)
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      // Verify user is a member
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: member } = await supabase
          .from('members')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!member) {
          await supabase.auth.signOut()
          setError('Access denied. Not a member account.')
          setLoading(false)
          return
        }
      }

      router.push('/member/dashboard')
      router.refresh()
    } catch {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConfigured) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Database connection unavailable')
        setLoading(false)
        return
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?type=member`,
        },
      })

      if (otpError) {
        setError(otpError.message)
        setLoading(false)
        return
      }

      setSuccess('Check your email for the login link!')
      setLoading(false)
    } catch {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  const handleDemoMode = () => {
    // Set demo mode cookie and redirect to dashboard
    document.cookie = 'demo_mode=member; path=/; max-age=3600'
    router.push('/member/dashboard?demo=true')
  }

  const features = [
    { icon: Trophy, label: 'Track Progress', color: 'gold' },
    { icon: Target, label: 'Set Goals', color: 'blue' },
    { icon: Zap, label: 'Book Sessions', color: 'orange' },
  ]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="mesh" />
      <FloatingParticles count={15} color="rgba(212, 164, 74, 0.15)" />

      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[150px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Card */}
        <div className="relative">
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gold-500/30 via-gold-400/10 to-gold-500/30 p-[1px]">
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(212, 164, 74, 0.4), transparent)',
              }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div className="relative rounded-3xl bg-zinc-900/90 backdrop-blur-xl p-8 md:p-10 border border-zinc-800/50">
            {/* Logo */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 mb-4 shadow-lg shadow-gold-500/30"
              >
                <Dumbbell className="w-10 h-10 text-black" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-display font-bold mb-2"
              >
                Member Portal
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-zinc-400 text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-gold-400" />
                Access your fitness journey
              </motion.p>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-6 mb-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  className="flex flex-col items-center gap-1"
                  whileHover={{ scale: 1.1, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className={`p-2 rounded-lg bg-${feature.color}-500/10`}>
                    <feature.icon className={`w-4 h-4 text-${feature.color}-400`} />
                  </div>
                  <span className="text-xs text-zinc-500">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Demo Mode Button - Always visible */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <motion.button
                onClick={handleDemoMode}
                className="w-full py-4 rounded-xl font-semibold text-black bg-gradient-to-r from-gold-400 to-gold-500 flex items-center justify-center gap-3 shadow-lg shadow-gold-500/20"
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(212, 164, 74, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-5 h-5" />
                Enter Demo Mode
              </motion.button>
              <p className="text-xs text-zinc-500 text-center mt-2">
                Explore the dashboard with sample data
              </p>
            </motion.div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-3 text-zinc-500">or sign in</span>
              </div>
            </div>

            {isConfigured ? (
              <>
                {/* Login Method Tabs */}
                <div className="flex gap-2 mb-6 p-1 rounded-xl bg-zinc-800/50">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      loginMethod === 'password'
                        ? 'bg-zinc-700 text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <KeyRound className="w-4 h-4" />
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('magic')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      loginMethod === 'magic'
                        ? 'bg-zinc-700 text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    Magic Link
                  </button>
                </div>

                {/* Forms */}
                <AnimatePresence mode="wait">
                  {loginMethod === 'password' ? (
                    <motion.form
                      key="password"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handlePasswordLogin}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all disabled:opacity-50"
                          placeholder="member@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all disabled:opacity-50"
                          placeholder="••••••••"
                        />
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                        >
                          <p className="text-sm text-red-400">{error}</p>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="w-full py-3 rounded-xl font-medium text-white bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Signing in...</span>
                          </>
                        ) : (
                          <span>Sign In</span>
                        )}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="magic"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleMagicLink}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all disabled:opacity-50"
                          placeholder="member@example.com"
                        />
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                        >
                          <p className="text-sm text-red-400">{error}</p>
                        </motion.div>
                      )}

                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                        >
                          <p className="text-sm text-green-400">{success}</p>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="w-full py-3 rounded-xl font-medium text-white bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Sending link...</span>
                          </>
                        ) : (
                          <span>Send Magic Link</span>
                        )}
                      </motion.button>

                      <p className="text-xs text-zinc-500 text-center">
                        We&apos;ll send you a login link to your email
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-zinc-500">
                  Database not configured. Use Demo Mode to explore.
                </p>
              </div>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="text-sm text-zinc-500 hover:text-gold-400 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
