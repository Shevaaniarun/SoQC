import { useEffect, useRef } from 'react'
import { useMousePosition } from '../hooks/useMousePosition'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  life: number
  maxLife: number
}

interface Star {
  x: number
  y: number
  size: number
  alpha: number
  twinkle: number
  twinkleSpeed: number
}

export default function QuantumBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const starsRef = useRef<Star[]>([])
  const frameRef = useRef<number>(0)
  const mouse = useMousePosition()
  const mouseRef = useRef({ x: -999, y: -999 })

  useEffect(() => {
    mouseRef.current = mouse
  }, [mouse])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    const colors = ['#7c3aed', '#a855f7', '#c4b5fd', '#d946ef', '#8b5cf6']

    const initStars = () => {
      starsRef.current = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.005 + Math.random() * 0.015,
      }))
    }

    const spawnParticle = () => {
      if (particlesRef.current.length > 120) return
      const maxLife = 200 + Math.random() * 200
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.5,
        size: Math.random() * 2 + 0.5,
        alpha: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife,
      })
    }

    const drawNebula = (t: number) => {
      const nebulaPoints = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, r: 300, color: 'rgba(124,58,237,0.06)' },
        { x: canvas.width * 0.8, y: canvas.height * 0.6, r: 350, color: 'rgba(168,85,247,0.05)' },
        { x: canvas.width * 0.5, y: canvas.height * 0.1, r: 250, color: 'rgba(217,70,239,0.04)' },
      ]
      nebulaPoints.forEach(({ x, y, r, color }, i) => {
        const dx = Math.sin(t * 0.0003 + i * 2.1) * 40
        const dy = Math.cos(t * 0.0002 + i * 1.7) * 30
        const grad = ctx.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r)
        grad.addColorStop(0, color)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const drawGrid = () => {
      const size = 60
      ctx.strokeStyle = 'rgba(124,58,237,0.06)'
      ctx.lineWidth = 0.5
      for (let x = 0; x < canvas.width; x += size) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += size) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    const drawConnections = (particles: Particle[]) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15 * particles[i].alpha * particles[j].alpha
            ctx.strokeStyle = `rgba(196,181,253,${alpha})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const drawMouseRepulsion = () => {
      const { x, y } = mouseRef.current
      if (x < 0) return
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 150)
      grad.addColorStop(0, 'rgba(196,181,253,0.03)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, 150, 0, Math.PI * 2)
      ctx.fill()
    }

    let t = 0
    const animate = () => {
      t++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Deep space background
      const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      bgGrad.addColorStop(0, '#03030f')
      bgGrad.addColorStop(0.5, '#07071a')
      bgGrad.addColorStop(1, '#0a0a1f')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawGrid()
      drawNebula(t)

      // Stars
      starsRef.current.forEach(star => {
        star.twinkle += star.twinkleSpeed
        const alpha = star.alpha * (0.6 + 0.4 * Math.sin(star.twinkle))
        ctx.fillStyle = `rgba(248,248,255,${alpha})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Particles
      if (t % 3 === 0) spawnParticle()
      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife)
      particlesRef.current.forEach(p => {
        p.life++
        const progress = p.life / p.maxLife
        p.alpha = progress < 0.1
          ? progress / 0.1
          : progress > 0.8
            ? (1 - progress) / 0.2
            : 1

        // Mouse repulsion
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        if (mx > 0) {
          const dx = p.x - mx
          const dy = p.y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            const force = (100 - dist) / 100 * 0.5
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }
        p.vx *= 0.99
        p.vy *= 0.99
        p.x += p.vx
        p.y += p.vy

        ctx.globalAlpha = p.alpha * 0.8
        ctx.fillStyle = p.color
        ctx.shadowBlur = 6
        ctx.shadowColor = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      })

      drawConnections(particlesRef.current)
      drawMouseRepulsion()

      frameRef.current = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
