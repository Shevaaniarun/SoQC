import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const trailX = useMotionValue(-100)
  const trailY = useMotionValue(-100)

  const springX = useSpring(trailX, { stiffness: 150, damping: 25 })
  const springY = useSpring(trailY, { stiffness: 150, damping: 25 })

  const isPointer = useRef(false)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      trailX.set(e.clientX)
      trailY.set(e.clientY)
    }

    const checkPointer = () => {
      const el = document.querySelectorAll(':hover')
      const last = el[el.length - 1]
      const style = last ? window.getComputedStyle(last).cursor : 'auto'
      isPointer.current = style === 'pointer'
      if (dotRef.current) {
        dotRef.current.style.transform = isPointer.current
          ? 'translate(-50%, -50%) scale(2)'
          : 'translate(-50%, -50%) scale(1)'
      }
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', checkPointer)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', checkPointer)
    }
  }, [cursorX, cursorY, trailX, trailY])

  return (
    <>
      {/* Main dot */}
      <motion.div
        ref={dotRef}
        className="cursor-dot"
        style={{
          left: cursorX,
          top: cursorY,
          width: 8,
          height: 8,
          background: '#c4b5fd',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 12px #c4b5fd, 0 0 24px rgba(196, 181, 253, 0.4)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
      />
      {/* Trailing ring */}
      
      {/* Glow aura */}
      <motion.div
        className="cursor-dot"
        style={{
          left: springX,
          top: springY,
          width: 100,
          height: 100,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
    </>
  )
}
