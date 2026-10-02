import { useEffect, useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
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
    <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>
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

  const pointerEvents = useTransform(z, (v: number) => (v > -450 && v < 350 ? 'auto' : 'none')) as any

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
        pointerEvents,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Main Home Component ───────────────────────────── */
interface HomeProps {
  setIsHoveringInteractive?: (isHovering: boolean) => void
}

export default function Home({ setIsHoveringInteractive }: HomeProps) {
  const pointer = useMousePosition()
  const ptrX = pointer.x === -999 ? (typeof window !== 'undefined' ? window.innerWidth / 2 : 600) : pointer.x
  const ptrY = pointer.y === -999 ? (typeof window !== 'undefined' ? window.innerHeight / 2 : 400) : pointer.y

  const tiltX = typeof window !== 'undefined' ? (window.innerHeight / 2 - ptrY) * 0.018 : 0
  const tiltY = typeof window !== 'undefined' ? (ptrX - window.innerWidth / 2) * 0.018 : 0

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

  const handleHoverStart = () => {
    if (setIsHoveringInteractive) setIsHoveringInteractive(true)
  }

  const handleHoverEnd = () => {
    if (setIsHoveringInteractive) setIsHoveringInteractive(false)
  }

  const exploreItems = [
    { to: '/events', label: 'Events', desc: 'Workshops & seminars', icon: '◈', color: '#7c3aed' },
    { to: '/articles', label: 'Articles', desc: 'Quantum knowledge', icon: '∂', color: '#a855f7' },
    { to: '/projects', label: 'Projects', desc: 'Research & builds', icon: '⬡', color: '#c4b5fd' },
    { to: '/committee', label: 'Committee', desc: 'Meet the team', icon: '◉', color: '#d946ef' },
    { to: '/logo', label: 'Our Logo', desc: 'The story behind it', icon: '∞', color: '#8b5cf6' },
  ]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'transparent',
        zIndex: 5,
      }}
    >
      <style>{`
        .explore-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }

        .interactive-card {
          background: rgba(124, 58, 237, 0.08);
          border: 1px solid rgba(196, 181, 253, 0.15);
          border-radius: 16px;
          padding: 20px 14px;
          text-align: center;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
          backdrop-filter: blur(12px);
          -webkit-tap-highlight-color: transparent;
        }

        .interactive-card:hover, .interactive-card:active {
          transform: translateY(-4px) scale(1.02);
          background: rgba(124, 58, 237, 0.22);
          border-color: rgba(196, 181, 253, 0.4);
          box-shadow: 0 10px 30px -10px rgba(124, 58, 237, 0.5);
        }

        @media (max-width: 767px) {
          .explore-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .explore-grid > *:nth-child(5) {
            grid-column: 1 / -1;
            justify-self: center;
            width: 80%;
          }
        }
      `}</style>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            rotateX: tiltX,
            rotateY: tiltY,
          }}
        >
          {/* HERO LAYER */}
          <SceneLayer baseZ={0} vScroll={vScroll}>
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                textAlign: 'center',
                width: 'min(780px, 90vw)',
                padding: '16px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
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
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#a855f7',
                    boxShadow: '0 0 6px #a855f7',
                    display: 'inline-block',
                  }}
                />
                Society of Quantum Computing — Est. 2023
              </div>

              <h1
                style={{
                  fontFamily: 'Outfit',
                  fontSize: 'clamp(48px, 8vw, 100px)',
                  fontWeight: 900,
                  lineHeight: 0.9,
                  letterSpacing: '-0.04em',
                  marginBottom: 8,
                  background:
                    'linear-gradient(135deg, #ffffff 0%, #c4b5fd 30%, #a855f7 60%, #7c3aed 80%, #d946ef 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 200%',
                }}
              >
                SoQC
              </h1>

              <div
                style={{
                  position: 'relative',
                  width: 'min(420px, 85vw)',
                  height: 220,
                  margin: '0 auto 8px',
                  pointerEvents: 'none',
                }}
              >
                <TransparentVideo src="/schrodinger-cat.mp4" />
              </div>

              <p
                style={{
                  fontFamily: 'Outfit',
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  color: 'rgba(248,248,255,0.7)',
                  maxWidth: 600,
                  margin: '0 auto 12px',
                  fontWeight: 300,
                  letterSpacing: '0.01em',
                  lineHeight: 1.4,
                }}
              >
                Exploring the quantum frontier
              </p>

              <p
                style={{
                  fontFamily: 'Inter',
                  fontSize: 15,
                  color: 'rgba(248,248,255,0.4)',
                  maxWidth: 500,
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                Where quantum mechanics meets computation. We research, build, and teach
                the technologies that will define the next era of information processing.
              </p>
            </div>
          </SceneLayer>

          {/* WHATSAPP BANNER LAYER */}
          <SceneLayer baseZ={-1200} vScroll={vScroll}>
            <div style={{ width: 'min(900px, 90vw)', pointerEvents: 'auto', position: 'relative', zIndex: 100 }}>
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(37,211,102,0.08), rgba(124,58,237,0.08))',
                  border: '1px solid rgba(37,211,102,0.2)',
                  borderRadius: 20,
                  padding: '32px 36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 24,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: 11,
                      color: 'rgba(37,211,102,0.7)',
                      letterSpacing: '0.15em',
                      marginBottom: 8,
                      textTransform: 'uppercase',
                    }}
                  >
                    WhatsApp Community
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Outfit',
                      fontSize: 28,
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: 8,
                    }}
                  >
                    Join 500+ Quantum Enthusiasts
                  </h3>
                  <p
                    style={{
                      color: 'rgba(248,248,255,0.5)',
                      fontSize: 14,
                      fontFamily: 'Inter',
                    }}
                  >
                    Stay updated with events, discussions, resources and more.
                  </p>
                </div>
                <a
                  href="https://chat.whatsapp.com/ISr5PjCc5B348ctJSBkKEj?mode=wwc"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={handleHoverStart}
                  onMouseLeave={handleHoverEnd}
                  onTouchStart={handleHoverStart}
                  onTouchEnd={handleHoverEnd}
                  style={{
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
                    position: 'relative',
                    zIndex: 200,
                    display: 'inline-block',
                    boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  Join Now
                </a>
              </div>
            </div>
          </SceneLayer>

          {/* EXPLORE MENU LAYER */}
          <SceneLayer baseZ={-2400} vScroll={vScroll}>
            <div style={{ width: 'min(1000px, 92vw)', pointerEvents: 'auto', position: 'relative', zIndex: 100 }}>
              <h2
                style={{
                  fontFamily: 'Outfit',
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #fff, #c4b5fd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textAlign: 'center',
                  marginBottom: 28,
                  pointerEvents: 'none',
                }}
              >
                Explore SoQC
              </h2>

              <div className="explore-grid">
                {exploreItems.map((item) => (
                  <Link
                    to={item.to}
                    key={item.to}
                    onMouseEnter={handleHoverStart}
                    onMouseLeave={handleHoverEnd}
                    onTouchStart={handleHoverStart}
                    onTouchEnd={handleHoverEnd}
                    style={{
                      textDecoration: 'none',
                      pointerEvents: 'auto',
                      display: 'block',
                      position: 'relative',
                      zIndex: 200,
                    }}
                  >
                    <div className="interactive-card">
                      <div
                        style={{
                          fontSize: 28,
                          marginBottom: 8,
                          color: item.color,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Outfit',
                          fontWeight: 700,
                          fontSize: 16,
                          color: '#fff',
                          marginBottom: 4,
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Inter',
                          fontSize: 11,
                          color: 'rgba(248,248,255,0.45)',
                          lineHeight: 1.3,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </SceneLayer>

          {/* OUTRO LOGO LAYER */}
          <SceneLayer baseZ={-3600} vScroll={vScroll}>
            <div
              style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
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
                }}
              >
                <img
                  src="/soqc-logo.png"
                  alt="SoQC Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>

              <h2
                style={{
                  fontFamily: 'Outfit',
                  fontSize: 32,
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 12,
                }}
              >
                Society of Quantum Computing
              </h2>
              <div
                style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: 14,
                  color: '#a855f7',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                The journey continues
              </div>
            </div>
          </SceneLayer>
        </motion.div>
      </div>
    </div>
  )
}