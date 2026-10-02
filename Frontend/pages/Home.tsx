import { useEffect, useRef, useMemo } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMousePosition } from '../hooks/useMousePosition'

/* ─── Transparent Video Canvas Renderer ────────────── */
function TransparentVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    let animId: number

    const renderFrame = () => {
      if (video.paused || video.ended) {
        animId = requestAnimationFrame(renderFrame)
        return
      }

      if (video.videoWidth && video.videoHeight) {
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = frame.data
          const len = data.length

          for (let i = 0; i < len; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]

            if (r < 38 && g < 32 && b < 48) {
              data[i + 3] = 0
            } else {
              const brightness = Math.max(r, g, b)
              if (brightness < 70) {
                data[i + 3] = Math.floor((brightness / 70) * 255)
              }
            }
          }
          ctx.putImageData(frame, 0, 0)
        }
      }
      animId = requestAnimationFrame(renderFrame)
    }

    video.play().catch(() => {})
    renderFrame()

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [src])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{ display: 'none' }}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))',
        }}
      />
    </div>
  )
}

/* ─── Reusable SVG Star Point ─── */
function Star({ cx, cy, r = 1.8 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="url(#starGlow)" />
}

/* ─── Galaxy Starfield & Layered Depth Constellations ────────────────────── */
function GalaxyStarfield({ vScroll }: { vScroll: any }) {
  const starLayers = useMemo(() => {
    const createLayer = (count: number, minZ: number, maxZ: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.8,
        z: Math.random() * (maxZ - minZ) + minZ,
        opacity: Math.random() * 0.7 + 0.3,
        color: ['#ffffff', '#f1f5f9', '#e2e8f0', '#cbd5e1'][Math.floor(Math.random() * 4)],
        duration: Math.random() * 3.5 + 2,
      }))
    }

    return {
      deep: createLayer(90, -4000, -2000),
      mid: createLayer(60, -2000, -500),
      fore: createLayer(30, -500, 500),
    }
  }, [])

  // Parallax movements through space as user scrolls
  const deepZOffset = useTransform(vScroll, (v: number) => v * 0.25)
  const midZOffset = useTransform(vScroll, (v: number) => v * 0.6)
  const foreZOffset = useTransform(vScroll, (v: number) => v * 0.95)

  // Floating motions for organic celestial drift
  const floatDriftA = {
    x: [-8, 8, -8],
    y: [-6, 6, -6],
    rotate: [-0.5, 0.5, -0.5],
    transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
  }

  const floatDriftB = {
    x: [7, -7, 7],
    y: [5, -8, 5],
    rotate: [0.4, -0.4, 0.4],
    transition: { duration: 22, repeat: Infinity, ease: 'easeInOut' },
  }

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', transformStyle: 'preserve-3d' }}>
      
      {/* Deep Space Background Ambient Glow */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          z: -2500,
          width: '140vw',
          height: '140vh',
          background: 'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.22) 0%, rgba(79, 70, 229, 0.1) 45%, rgba(4, 3, 10, 0) 75%)',
          filter: 'blur(90px)',
        }}
      />

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* ─── LAYER 1: HERO SCENE CONSTELLATIONS (Z ~ 0) ─── */}
      <motion.div style={{ position: 'absolute', inset: 0, z: midZOffset, transformStyle: 'preserve-3d' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          
          {/* Top-Left: SoQC Ket Logo Constellation */}
          <motion.g animate={floatDriftA} style={{ transformOrigin: 'center' }}>
            <g transform="translate(100, 80) scale(0.95)">
              <path
                d="M 40,30 L 40,110 M 65,55 L 85,70 L 65,85 M 20,40 L 40,30 L 65,55 M 40,110 L 85,70 M 20,40 Q 55,100 90,30"
                fill="none" stroke="rgba(255, 255, 255, 0.28)" strokeWidth="0.8" strokeDasharray="2 2"
              />
              <path d="M 20,40 L 20,20 M 16,24 L 20,20 L 24,24" fill="none" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="0.9" />
              <path d="M 90,30 L 90,50 M 86,46 L 90,50 L 94,46" fill="none" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="0.9" />
              {[[40,30], [40,110], [65,55], [85,70], [65,85], [20,40], [20,20], [90,30], [90,50]].map(([x,y], i) => (
                <Star key={`soqc-${i}`} cx={x} cy={y} />
              ))}
            </g>
          </motion.g>

          {/* Top-Right: Entangled Pair Nodes */}
          <motion.g animate={floatDriftB}>
            <g transform="translate(1120, 90) scale(0.9)">
              <line x1="20" y1="30" x2="110" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" />
              <path d="M 20,30 Q 65,0 110,30" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" strokeDasharray="2 2" />
              <Star cx={20} cy={30} r={2.2} />
              <Star cx={110} cy={30} r={2.2} />
            </g>
          </motion.g>

        </svg>
      </motion.div>

      {/* ─── LAYER 2: MID SCROLL CONSTELLATIONS (Z ~ -1200) ─── */}
      <motion.div style={{ position: 'absolute', inset: 0, z: useTransform(vScroll, (v: number) => v * 0.6 - 600), transformStyle: 'preserve-3d' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          
          {/* Mid-Left: Orion's Belt Easter Egg */}
          <motion.g animate={floatDriftB}>
            <g transform="translate(120, 480) scale(0.85)">
              <line x1="15" y1="40" x2="45" y2="30" stroke="rgba(255,255,255,0.22)" strokeWidth="0.75" />
              <line x1="45" y1="30" x2="75" y2="20" stroke="rgba(255,255,255,0.22)" strokeWidth="0.75" />
              <line x1="15" y1="40" x2="10" y2="10" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
              <line x1="75" y1="20" x2="80" y2="55" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
              <Star cx={15} cy={40} r={2} />
              <Star cx={45} cy={30} r={2.2} />
              <Star cx={75} cy={20} r={2} />
              <Star cx={10} cy={10} r={1.3} />
              <Star cx={80} cy={55} r={1.3} />
            </g>
          </motion.g>

          {/* Mid-Right Vector State Cluster */}
          <motion.g animate={floatDriftA}>
            <g transform="translate(1080, 420) scale(0.85)">
              <line x1="40" y1="10" x2="40" y2="80" stroke="rgba(255,255,255,0.22)" strokeWidth="0.75" strokeDasharray="2 2" />
              <line x1="40" y1="80" x2="75" y2="35" stroke="rgba(255,255,255,0.32)" strokeWidth="0.8" />
              <path d="M 71,38 L 75,35 L 72,42" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <Star cx={40} cy={10} r={1.8} />
              <Star cx={40} cy={80} r={1.8} />
              <Star cx={75} cy={35} r={2.2} />
            </g>
          </motion.g>

        </svg>
      </motion.div>

      {/* ─── LAYER 3: DEEP SCROLL CONSTELLATIONS (Z ~ -2400) ─── */}
      <motion.div style={{ position: 'absolute', inset: 0, z: useTransform(vScroll, (v: number) => v * 0.6 - 1200), transformStyle: 'preserve-3d' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          
          {/* Bottom-Left: Cassiopeia 'W' Shape */}
          <motion.g animate={floatDriftA}>
            <g transform="translate(140, 780) scale(0.85)">
              <path d="M 10,20 L 30,45 L 50,25 L 75,50 L 95,30" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
              {[[10,20], [30,45], [50,25], [75,50], [95,30]].map(([x,y], i) => (
                <Star key={`cass-${i}`} cx={x} cy={y} r={1.8} />
              ))}
            </g>
          </motion.g>

          {/* Bottom-Right: Quantum Node Grid */}
          <motion.g animate={floatDriftB}>
            <g transform="translate(1060, 740) scale(0.85)">
              <circle cx="40" cy="40" r="18" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
              <line x1="40" y1="22" x2="40" y2="58" stroke="rgba(255,255,255,0.22)" strokeWidth="0.75" />
              <line x1="22" y1="40" x2="58" y2="40" stroke="rgba(255,255,255,0.22)" strokeWidth="0.75" />
              <Star cx={40} cy={22} />
              <Star cx={40} cy={58} />
              <Star cx={22} cy={40} />
              <Star cx={58} cy={40} />
            </g>
          </motion.g>

        </svg>
      </motion.div>

      {/* ─── LAYER 4: OUTRO LEVEL CONSTELLATIONS (Z ~ -3600) ─── */}
      <motion.div style={{ position: 'absolute', inset: 0, z: useTransform(vScroll, (v: number) => v * 0.6 - 1800), transformStyle: 'preserve-3d' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          
          {/* Center Space: Infinity Loop Path */}
          <motion.g animate={floatDriftA}>
            <g transform="translate(620, 840) scale(0.9)">
              <path d="M 20,30 Q 40,10 60,30 T 100,30 Q 80,50 60,30 T 20,30" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.75" strokeDasharray="3 3" />
              <Star cx={20} cy={30} r={2} />
              <Star cx={60} cy={30} r={2.2} />
              <Star cx={100} cy={30} r={2} />
            </g>
          </motion.g>

        </svg>
      </motion.div>

      {/* Background Deep Star Dust */}
      <motion.div style={{ position: 'absolute', inset: 0, z: deepZOffset, transformStyle: 'preserve-3d' }}>
        {starLayers.deep.map((star) => (
          <motion.div
            key={`deep-${star.id}`}
            animate={{ opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
              transform: `translateZ(${star.z}px)`,
            }}
          />
        ))}
      </motion.div>

      {/* Mid-Ground Star Particles */}
      <motion.div style={{ position: 'absolute', inset: 0, z: midZOffset, transformStyle: 'preserve-3d' }}>
        {starLayers.mid.map((star) => (
          <motion.div
            key={`mid-${star.id}`}
            animate={{ opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size * 1.1,
              height: star.size * 1.1,
              borderRadius: '50%',
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size * 3}px ${star.color}`,
              transform: `translateZ(${star.z}px)`,
            }}
          />
        ))}
      </motion.div>

      {/* Foreground Stars */}
      <motion.div style={{ position: 'absolute', inset: 0, z: foreZOffset, transformStyle: 'preserve-3d' }}>
        {starLayers.fore.map((star) => (
          <motion.div
            key={`fore-${star.id}`}
            animate={{ opacity: [star.opacity * 0.4, star.opacity, star.opacity * 0.4] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size * 1.3,
              height: star.size * 1.3,
              borderRadius: '50%',
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size * 4}px ${star.color}`,
              transform: `translateZ(${star.z}px)`,
            }}
          />
        ))}
      </motion.div>

    </div>
  )
}

/* ─── Z-Axis Scene Layer Wrapper ────────────────────── */
function SceneLayer({
  baseZ,
  vScroll,
  children,
  offsetZ = 0,
}: {
  baseZ: number
  vScroll: any
  children: React.ReactNode
  offsetZ?: number
}) {
  const z = useTransform(vScroll, (v: number) => baseZ + v + offsetZ)
  const opacity = useTransform(z, [-1500, -500, 0, 300, 600], [0, 0.8, 1, 0.3, 0])
  const filter = useTransform(
    z,
    [-1500, -500, 0, 300, 600],
    ['blur(25px) saturate(0.5)', 'blur(0px) saturate(1)', 'blur(0px) saturate(1)', 'blur(15px) saturate(1.2)', 'blur(30px)']
  )

  const pointerEvents = useTransform(z, (currentZ: number) =>
    currentZ > -400 && currentZ < 200 ? 'auto' : 'none'
  )

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        x: '-50%',
        y: '-50%',
        z,
        opacity,
        filter,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transformStyle: 'preserve-3d',
        pointerEvents,
      }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Main Home Component ───────────────────────────── */
export default function Home() {
  const navigate = useNavigate()
  const pointer = useMousePosition()
  
  const ptrX = pointer.x === -999 ? (typeof window !== 'undefined' ? window.innerWidth / 2 : 600) : pointer.x
  const ptrY = pointer.y === -999 ? (typeof window !== 'undefined' ? window.innerHeight / 2 : 400) : pointer.y

  const tiltX = typeof window !== 'undefined' ? (window.innerHeight / 2 - ptrY) * 0.004 : 0
  const tiltY = typeof window !== 'undefined' ? (ptrX - window.innerWidth / 2) * 0.004 : 0

  const vScrollTarget = useRef(0)
  const vScroll = useSpring(0, { stiffness: 50, damping: 22, mass: 1.2 })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const maxScroll = 3600

    const onWheel = (e: WheelEvent) => {
      vScrollTarget.current += e.deltaY * 0.9
      vScrollTarget.current = Math.max(0, Math.min(vScrollTarget.current, maxScroll))
      vScroll.set(vScrollTarget.current)
    }

    let lastY = 0
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      const delta = lastY - e.touches[0].clientY
      lastY = e.touches[0].clientY
      vScrollTarget.current += delta * 2.0
      vScrollTarget.current = Math.max(0, Math.min(vScrollTarget.current, maxScroll))
      vScroll.set(vScrollTarget.current)
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [vScroll])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#04030a',
      zIndex: 1,
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}>
        <motion.div style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          rotateX: tiltX,
          rotateY: tiltY,
        }}>

          {/* ═══════════ GALAXY STARFIELD & DEPTHED CONSTELLATIONS ═══════════ */}
          <GalaxyStarfield vScroll={vScroll} />

          {/* ═══════════ 1. HERO (Z=0) ═══════════ */}
          <SceneLayer baseZ={0} vScroll={vScroll}>
            <div style={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              width: 'min(780px, 90vw)',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(196,181,253,0.2)',
                borderRadius: 100,
                marginBottom: 12,
                fontSize: 12,
                color: '#c4b5fd',
                fontFamily: 'JetBrains Mono',
                letterSpacing: '0.1em',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 6px #a855f7', display: 'inline-block' }} />
                Society of Quantum Computing — Est. 2023
              </div>

              <h1 style={{
                fontFamily: 'Outfit',
                fontSize: 'clamp(48px, 8vw, 100px)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                marginBottom: 8,
                background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 30%, #a855f7 60%, #7c3aed 80%, #d946ef 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
              }}>
                SoQC
              </h1>

              <div style={{
                position: 'relative',
                width: 'min(420px, 85vw)',
                height: 220,
                margin: '0 auto 8px',
                pointerEvents: 'none',
              }}>
                <TransparentVideo src="/schrodinger-cat.mp4" />
              </div>

              <p style={{
                fontFamily: 'Outfit',
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                color: 'rgba(248,248,255,0.7)',
                maxWidth: 600,
                margin: '0 auto 12px',
                fontWeight: 300,
                letterSpacing: '0.01em',
                lineHeight: 1.4,
              }}>
                Exploring the quantum frontier
              </p>

              <p style={{
                fontFamily: 'Inter',
                fontSize: 15,
                color: 'rgba(248,248,255,0.4)',
                maxWidth: 500,
                margin: '0 auto',
                lineHeight: 1.6,
              }}>
                Where quantum mechanics meets computation. We research, build, and teach
                the technologies that will define the next era of information processing.
              </p>
            </div>
          </SceneLayer>

          {/* ═══════════ 2. WHATSAPP BANNER (Z=-1200) ═══════════ */}
          <SceneLayer baseZ={-1200} vScroll={vScroll}>
            <div style={{ width: 'min(900px, 90vw)' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(37,211,102,0.08), rgba(124,58,237,0.08))',
                border: '1px solid rgba(37,211,102,0.2)',
                borderRadius: 20,
                padding: '40px 48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 24,
                flexWrap: 'wrap',
                backdropFilter: 'blur(10px)',
              }}>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(37,211,102,0.7)', letterSpacing: '0.15em', marginBottom: 8, textTransform: 'uppercase' }}>
                    WhatsApp Community
                  </div>
                  <h3 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                    Join 500+ Quantum Enthusiasts
                  </h3>
                  <p style={{ color: 'rgba(248,248,255,0.5)', fontSize: 14, fontFamily: 'Inter' }}>
                    Stay updated with events, discussions, resources and more.
                  </p>
                </div>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://chat.whatsapp.com/ISr5PjCc5B348ctJSBkKEj?mode=wwc"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    position: 'relative',
                    zIndex: 10,
                    padding: '14px 32px',
                    background: 'linear-gradient(135deg, #25d366, #128c7e)',
                    borderRadius: 12,
                    color: '#fff',
                    fontFamily: 'Outfit',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    pointerEvents: 'auto',
                    transform: 'translateZ(1px)',
                    display: 'inline-block',
                  }}
                >
                  Join Now →
                </motion.a>
              </div>
            </div>
          </SceneLayer>

          {/* ═══════════ 3. QUICK NAVIGATION (Z=-2400) ═══════════ */}
          <SceneLayer baseZ={-2400} vScroll={vScroll}>
            <div style={{ width: 'min(900px, 90vw)', padding: '0 12px' }}>
              <h2 style={{
                fontFamily: 'Outfit',
                fontSize: 'clamp(24px, 3.5vw, 44px)',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #fff, #c4b5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textAlign: 'center',
                marginBottom: 20,
              }}>Explore SoQC</h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
                maxWidth: 500,
                margin: '0 auto',
              }}>
                {[
                  { to: '/events', label: 'Events', desc: 'Workshops & seminars', icon: '◈', color: '#7c3aed' },
                  { to: '/articles', label: 'Articles', desc: 'Quantum knowledge', icon: '∂', color: '#a855f7' },
                  { to: '/projects', label: 'Projects', desc: 'Research & builds', icon: '⬡', color: '#c4b5fd' },
                  { to: '/committee', label: 'Committee', desc: 'Meet the team', icon: '◉', color: '#d946ef' },
                  { to: '/logo', label: 'Our Logo', desc: 'The story behind it', icon: '∞', color: '#8b5cf6' },
                ].map((item, idx) => {
                  const isLastOddItem = idx === 4
                  return (
                    <motion.div
                      key={item.to}
                      whileHover={{ scale: 1.03, translateY: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(item.to)
                      }}
                      style={{
                        gridColumn: isLastOddItem ? '1 / -1' : 'span 1',
                        maxWidth: isLastOddItem ? 230 : '100%',
                        justifySelf: isLastOddItem ? 'center' : 'stretch',
                        width: '100%',
                        background: 'rgba(124,58,237,0.08)',
                        border: '1px solid rgba(196,181,253,0.15)',
                        borderRadius: 14,
                        padding: '14px 10px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        position: 'relative',
                        zIndex: 10,
                        transform: 'translateZ(1px)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <div style={{ fontSize: 22, marginBottom: 4, color: item.color }}>{item.icon}</div>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(248,248,255,0.4)', lineHeight: 1.2 }}>{item.desc}</div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </SceneLayer>

          {/* ═══════════ 4. OUTRO LOGO (Z=-3600) ═══════════ */}
          <SceneLayer baseZ={-3600} vScroll={vScroll}>
            <div style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: 120,
                height: 120,
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(196,181,253,0.2)',
                boxShadow: '0 0 50px rgba(124,58,237,0.4)',
                padding: 16,
              }}>
                <img
                  src="/data/logo/soqc-logo-step-4.png"
                  alt="SoQC Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
              
              <h2 style={{
                fontFamily: 'Outfit',
                fontSize: 32,
                fontWeight: 800,
                color: '#fff',
                marginBottom: 12,
              }}>
                Society of Quantum Computing
              </h2>
              <div style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 14,
                color: '#a855f7',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}>
                The journey continues
              </div>
            </div>
          </SceneLayer>

        </motion.div>
      </div>
    </div>
  )
}