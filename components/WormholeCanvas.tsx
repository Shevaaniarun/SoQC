import { useEffect, useRef } from 'react'

export default function WormholeCanvas({ intensity = 1 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let t = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const NUM_RINGS = 60
    const rings: { z: number; color: string }[] = Array.from({ length: NUM_RINGS }, (_, i) => ({
      z: (i / NUM_RINGS) * 1000,
      color: `hsl(${260 + i * 2}, 80%, ${40 + i * 0.5}%)`,
    }))

    const COLORS = ['#7c3aed', '#a855f7', '#c4b5fd', '#d946ef', '#8b5cf6', '#6d28d9']

    const draw = () => {
      t += 0.012 * intensity
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      const cx = W / 2
      const cy = H / 2

      ctx.clearRect(0, 0, W, H)

      // Deep bg
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H))
      bg.addColorStop(0, 'rgba(13,5,40,1)')
      bg.addColorStop(0.4, 'rgba(7,7,26,1)')
      bg.addColorStop(1, 'rgba(3,3,15,1)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      const FOV = 300

      // Update & draw tunnel rings
      rings.forEach((ring, i) => {
        ring.z -= 6 * intensity
        if (ring.z <= 0) ring.z += 1000

        const scale = FOV / (FOV + ring.z)
        const r = (W * 0.45) * scale
        const alpha = Math.max(0, 1 - ring.z / 800) * 0.8

        if (r < 1) return

        const wobble = Math.sin(t * 2 + i * 0.4) * 3
        const x = cx + wobble * scale
        const yw = cy + Math.cos(t + i * 0.3) * 2 * scale

        // Main ring
        ctx.beginPath()
        ctx.arc(x, yw, r, 0, Math.PI * 2)
        ctx.strokeStyle = COLORS[i % COLORS.length]
        ctx.globalAlpha = alpha * 0.6
        ctx.lineWidth = Math.max(0.5, 1.5 * scale)
        ctx.shadowBlur = 20 * scale
        ctx.shadowColor = COLORS[i % COLORS.length]
        ctx.stroke()
        ctx.shadowBlur = 0

        // Energy dots on ring
        if (i % 4 === 0) {
          const dotAngle = t * 2 + i * 0.8
          const dx = x + Math.cos(dotAngle) * r
          const dy = yw + Math.sin(dotAngle) * r
          ctx.beginPath()
          ctx.arc(dx, dy, Math.max(1, 3 * scale), 0, Math.PI * 2)
          ctx.fillStyle = '#c4b5fd'
          ctx.globalAlpha = alpha
          ctx.shadowBlur = 15
          ctx.shadowColor = '#c4b5fd'
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // Center vortex glow
      const vortex = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100)
      vortex.addColorStop(0, 'rgba(196,181,253,0.25)')
      vortex.addColorStop(0.3, 'rgba(124,58,237,0.1)')
      vortex.addColorStop(1, 'transparent')
      ctx.fillStyle = vortex
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(cx, cy, 100, 0, Math.PI * 2)
      ctx.fill()

      // Spiraling particles
      for (let j = 0; j < 30; j++) {
        const angle = (j / 30) * Math.PI * 2 + t * 0.5
        const depth = ((t * 200 + j * 30) % 600)
        const scale = FOV / (FOV + depth)
        const pr = (W * 0.3) * scale
        const px = cx + Math.cos(angle) * pr
        const py = cy + Math.sin(angle) * pr
        const palpha = Math.max(0, 1 - depth / 600) * 0.9

        ctx.beginPath()
        ctx.arc(px, py, Math.max(0.5, 2 * scale), 0, Math.PI * 2)
        ctx.fillStyle = COLORS[j % COLORS.length]
        ctx.globalAlpha = palpha
        ctx.shadowBlur = 8
        ctx.shadowColor = COLORS[j % COLORS.length]
        ctx.fill()
        ctx.shadowBlur = 0
      }

      ctx.globalAlpha = 1
      frameRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frameRef.current)
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
