'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface ScanLineProps {
  color?: string
  duration?: number
  height?: number
  opacity?: number
}

export function ScanLine({
  color = '#00FFF7',
  duration = 4,
  height = 2,
  opacity = 0.5
}: ScanLineProps) {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!lineRef.current) return

    const tl = gsap.timeline({ repeat: -1 })

    tl.to(lineRef.current, {
      y: '100vh',
      duration: duration,
      ease: 'none'
    })
    .to(lineRef.current, {
      y: 0,
      duration: 0,
    })

    return () => {
      tl.kill()
    }
  }, [duration])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <div
        ref={lineRef}
        className="absolute left-0 right-0 will-change-transform"
        style={{
          height: `${height}px`,
          background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
          opacity: opacity,
          boxShadow: `0 0 15px ${color}`,
          top: 0,
          transform: 'translateY(-100%)'
        }}
      />
    </div>
  )
}
