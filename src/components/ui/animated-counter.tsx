'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  decimals?: number
}

export function AnimatedCounter({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [hasAnimated, setHasAnimated] = useState(false)

  const spring = useSpring(0, {
    damping: 30,
    stiffness: 100,
    duration: duration * 1000,
  })

  const display = useTransform(spring, (current) =>
    decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString()
  )

  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    if (isInView && !hasAnimated) {
      spring.set(value)
      setHasAnimated(true)
    }
  }, [isInView, value, spring, hasAnimated])

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => {
      setDisplayValue(v)
    })
    return unsubscribe
  }, [display])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      {displayValue}
      {suffix}
    </motion.span>
  )
}
