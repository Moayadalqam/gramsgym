'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  hoverScale?: number
  onClick?: () => void
}

export function GlowCard({
  children,
  className = '',
  glowColor = 'rgba(212, 164, 74, 0.3)',
  hoverScale = 1.02,
  onClick,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Spotlight effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 40%)`,
        }}
      />

      {/* Border glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 40%)`,
          mask: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          maskComposite: 'exclude',
          padding: '1px',
        }}
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
