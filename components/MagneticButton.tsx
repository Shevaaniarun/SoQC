import { useRef, useState, type ReactNode } from 'react'
import { motion, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  strength?: number
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  as?: 'button' | 'div' | 'a'
  href?: string
  target?: string
  rel?: string
}

export default function MagneticButton({
  children,
  strength = 40,
  className,
  style,
  onClick,
  as = 'div',
  href,
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  const x = useSpring(0, { stiffness: 200, damping: 20 })
  const y = useSpring(0, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * (strength / 100))
    y.set((e.clientY - cy) * (strength / 100))
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleClick = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    const rx = e.clientX - rect.left
    const ry = e.clientY - rect.top
    const id = Date.now()
    setRipples(prev => [...prev, { id, x: rx, y: ry }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700)
    onClick?.()
  }

  const Tag = motion[as === 'a' ? 'a' : 'div'] as typeof motion.div

  return (
    <div ref={ref} style={{ display: 'inline-block', position: 'relative' }}>
      <Tag
        style={{ x, y, position: 'relative', overflow: 'hidden', ...style } as React.CSSProperties}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...(as === 'a' ? { href, target, rel } : {})}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {children}

        {/* Energy ripples on click */}
        {ripples.map(r => (
          <motion.span
            key={r.id}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: r.y,
              left: r.x,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(196,181,253,0.6), rgba(124,58,237,0.2), transparent)',
              transform: 'translate(-50%,-50%)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        ))}
      </Tag>
    </div>
  )
}
