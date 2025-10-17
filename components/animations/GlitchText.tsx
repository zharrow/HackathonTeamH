'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface GlitchTextProps {
  children: string
  className?: string
  glitchInterval?: number // en secondes
  intensity?: 'low' | 'medium' | 'high'
}

export function GlitchText({
  children,
  className = '',
  glitchInterval = 5,
  intensity = 'medium'
}: GlitchTextProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    const intensityConfig = {
      low: { skew: 40, offset: 3, duration: 0.05, repeats: 1 },
      medium: { skew: 70, offset: 5, duration: 0.1, repeats: 2 },
      high: { skew: 90, offset: 8, duration: 0.15, repeats: 3 }
    }

    const config = intensityConfig[intensity]

    const glitch = () => {
      const tl = gsap.timeline()

      // Skew + glitch colors
      tl.to(textRef.current, {
        skewX: config.skew,
        duration: config.duration,
        ease: 'power2.inOut'
      })
      .to(textRef.current, {
        skewX: -config.skew,
        duration: config.duration,
        ease: 'power2.inOut'
      }, '<')
      .to(textRef.current, {
        x: -config.offset,
        textShadow: `${config.offset}px 0 #00FFF7, -${config.offset}px 0 #FF00FF`,
        duration: config.duration / 2,
        repeat: config.repeats,
        yoyo: true,
        ease: 'none'
      }, '<')
      .to(textRef.current, {
        skewX: 0,
        x: 0,
        textShadow: 'none',
        duration: config.duration,
        ease: 'power2.out'
      })
    }

    // Premier glitch après 1s, puis répété selon l'intervalle
    const timer = setTimeout(() => {
      glitch()
      const interval = setInterval(glitch, glitchInterval * 1000)
      return () => clearInterval(interval)
    }, 1000)

    return () => clearTimeout(timer)
  }, [glitchInterval, intensity])

  return (
    <div ref={textRef} className={`inline-block ${className}`}>
      {children}
    </div>
  )
}
