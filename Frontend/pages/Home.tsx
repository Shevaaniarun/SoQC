import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { articles } from '../data/articles/articles'
import { events } from '../data/events/events'
import { useMousePosition } from '../hooks/useMousePosition'

/* ─── 3D Hero Globe ─────────────────────────────────── */
function QuantumSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <Sphere ref={meshRef} args={[1.4, 64, 64]}>
          <MeshDistortMaterial
            color="#7c3aed"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.1}
            metalness={0.8}
            emissive="#4c1d95"
            emissiveIntensity={0.3}
          />
        </Sphere>
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.0, 0.025, 16, 100]} />
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.55} />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[2.4, 0.015, 16, 100]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
        </mesh>
      </Float>
      <pointLight color="#7c3aed" intensity={3.2} distance={8} position={[2, 2, 2]} />
      <pointLight color="#d946ef" intensity={2} distance={6} position={[-2, -2, 1]} />
      <ambientLight intensity={0.1} />
    </group>
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

  const opacity = useTransform(z, [-2000, -800, 0, 500, 800], [0, 0.8, 1, 0.3, 0])
  const filter = useTransform(
    z,
    [-2000, -800, 0, 500, 800],
    ['blur(30px) saturate(0.5)', 'blur(0px) saturate(1)', 'blur(0px) saturate(1)', 'blur(20px) saturate(1.5)', 'blur(40px)']
  )
  const pointerEvents = useTransform(z, (v: number) => (v > -400 && v < 300 ? 'auto' : 'none')) as any

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
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Stat Card Component ───────────────────────────── */
function StatCard({ value, label, icon }: { value: number; label: string; icon: string }) {
  const [count, setCount] = useState(0)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = value / 60
    const timer = setInterval(() => {
      start += step
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(124,58,237,0.06)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(196,181,253,0.12)',
        borderRadius: 16,
        padding: '28px 32px',
        textAlign: 'center',
        cursor: 'default',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{
        fontFamily: 'Outfit',
        fontSize: 48,
        fontWeight: 800,
        background: 'linear-gradient(135deg, #c4b5fd, #a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1,
      }}>{count}+</div>
      <div style={{ color: 'rgba(248,248,255,0.5)', fontSize: 14, marginTop: 8, fontFamily: 'Inter', letterSpacing: '0.05em' }}>
        {label}
      </div>
    </div>
  )
}

/* ─── Main Home Component ───────────────────────────── */
export default function Home() {
  const pointer = useMousePosition()
  const ptrX = pointer.x === -999 ? window.innerWidth / 2 : pointer.x
  const ptrY = pointer.y === -999 ? window.innerHeight / 2 : pointer.y
  const tiltX = (window.innerHeight / 2 - ptrY) * 0.02
  const tiltY = (ptrX - window.innerWidth / 2) * 0.02

  const vScrollTarget = useRef(0)
  const vScroll = useSpring(0, { stiffness: 50, damping: 22, mass: 1.2 })

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const maxScroll = 8800

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

  const upcomingEvents = events.filter((event) => event.status === 'upcoming').slice(0, 3)
  const recentArticles = articles.slice(0, 3)

  const scenes = [
    {
      type: 'stats',
      z: -1200,
    },
    {
      type: 'events',
      z: -2400,
    },
    {
      type: 'articles',
      z: -3600,
    },
    {
      type: 'whatsapp',
      z: -4800,
    },
    {
      type: 'navigation',
      z: -6000,
    },
  ]

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: 'transparent',
      zIndex: 1,
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

          {/* ═══════════ HERO (Z=0) ═══════════ */}
          <SceneLayer baseZ={0} vScroll={vScroll}>
            <div style={{ position: 'absolute', width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <Stars radius={90} depth={60} count={2800} factor={3} fade speed={0.45} />
                <QuantumSphere />
              </Canvas>
            </div>

            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              height: 600,
              background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 1,
            }} />

            <div style={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              width: 'min(780px, 90vw)',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(196,181,253,0.2)',
                borderRadius: 100,
                marginBottom: 32,
                fontSize: 12,
                color: '#c4b5fd',
                fontFamily: 'JetBrains Mono',
                letterSpacing: '0.1em',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 6px #a855f7', display: 'inline-block' }} />
                Society of Quantum Computing — Est. 2023
              </div>

              {/* Main title */}
              <h1 style={{
                fontFamily: 'Outfit',
                fontSize: 'clamp(52px, 10vw, 120px)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                marginBottom: 24,
                background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 30%, #a855f7 60%, #7c3aed 80%, #d946ef 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
              }}>
                SoQC
              </h1>

              <p style={{
                fontFamily: 'Outfit',
                fontSize: 'clamp(16px, 3vw, 22px)',
                color: 'rgba(248,248,255,0.7)',
                maxWidth: 600,
                margin: '0 auto 16px',
                fontWeight: 300,
                letterSpacing: '0.01em',
                lineHeight: 1.5,
              }}>
                Exploring the quantum frontier
              </p>

              <p style={{
                fontFamily: 'Inter',
                fontSize: 15,
                color: 'rgba(248,248,255,0.4)',
                maxWidth: 500,
                margin: '0 auto 48px',
                lineHeight: 1.7,
              }}>
                Where quantum mechanics meets computation. We research, build, and teach
                the technologies that will define the next era of information processing.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/events" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  border: 'none',
                  borderRadius: 12,
                  color: '#fff',
                  fontFamily: 'Outfit',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  boxShadow: '0 0 30px rgba(124,58,237,0.4)',
                }}>
                  Explore Events
                  <span>→</span>
                </Link>
                <Link to="/projects" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 32px',
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(196,181,253,0.2)',
                  borderRadius: 12,
                  color: '#c4b5fd',
                  fontFamily: 'Outfit',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  backdropFilter: 'blur(10px)',
                }}>
                  View Research
                </Link>
              </div>

              {/* Scroll indicator */}
              <div style={{ marginTop: 64 }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  color: 'rgba(196,181,253,0.5)',
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  fontFamily: 'JetBrains Mono',
                  textTransform: 'uppercase',
                }}>
                  <span>Scroll to explore</span>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      width: 1,
                      height: 40,
                      background: 'linear-gradient(to bottom, rgba(196,181,253,0.5), transparent)',
                    }}
                  />
                </div>
              </div>
            </div>
          </SceneLayer>

          {/* ═══════════ STATS DASHBOARD (Z=-1200) ═══════════ */}
          <SceneLayer baseZ={-1200} vScroll={vScroll}>
            <div style={{ width: 'min(1100px, 90vw)' }}>
              <div style={{
                fontFamily: 'JetBrains Mono',
                color: '#a855f7',
                fontSize: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: 16,
                textAlign: 'center',
              }}>
                By the numbers
              </div>
              <h2 style={{
                fontFamily: 'Outfit',
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #fff, #c4b5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.03em',
                textAlign: 'center',
                marginBottom: 48,
              }}>
                Quantum Impact
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 20,
                marginBottom: 48,
              }}>
                <StatCard value={12} label="Events Organized" icon="◈" />
                <StatCard value={8} label="Articles Published" icon="∂" />
                <StatCard value={6} label="Active Projects" icon="⬡" />
                <StatCard value={3} label="Research Papers" icon="∞" />
              </div>
            </div>
          </SceneLayer>

          {/* ═══════════ UPCOMING EVENTS (Z=-2400) ═══════════ */}
          <SceneLayer baseZ={-2400} vScroll={vScroll}>
            <div style={{ width: 'min(1100px, 90vw)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{
                    fontFamily: 'JetBrains Mono',
                    color: '#22d3ee',
                    fontSize: 12,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}>
                    Coming up
                  </div>
                  <h2 style={{
                    fontFamily: 'Outfit',
                    fontSize: 'clamp(32px, 4vw, 48px)',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #fff, #c4b5fd)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em',
                  }}>
                    Upcoming Events
                  </h2>
                </div>
                <Link to="/events" style={{
                  color: '#c4b5fd',
                  fontFamily: 'Inter',
                  fontSize: 14,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>View all →</Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      background: 'rgba(124,58,237,0.06)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(196,181,253,0.1)',
                      borderRadius: 20,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.3s ease',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                      <img src={event.image[0]} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent 50%, rgba(3,3,15,0.9))',
                      }} />
                      <div style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        padding: '4px 12px',
                        background: 'rgba(124,58,237,0.7)',
                        borderRadius: 100,
                        fontSize: 11,
                        color: '#fff',
                        fontFamily: 'JetBrains Mono',
                        letterSpacing: '0.05em',
                      }}>
                        {event.category}
                      </div>
                    </div>
                    <div style={{ padding: '20px 24px' }}>
                      <h3 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                        {event.title}
                      </h3>
                      <p style={{ color: 'rgba(248,248,255,0.5)', fontSize: 13, fontFamily: 'Inter', marginBottom: 16, lineHeight: 1.6 }}>
                        {event.description.slice(0, 80)}...
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#c4b5fd', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
                          {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <Link to="/events" style={{
                          padding: '6px 16px',
                          background: 'rgba(124,58,237,0.2)',
                          border: '1px solid rgba(196,181,253,0.2)',
                          borderRadius: 8,
                          color: '#c4b5fd',
                          fontSize: 12,
                          fontFamily: 'Inter',
                          textDecoration: 'none',
                        }}>
                          Register →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SceneLayer>

          {/* ═══════════ RECENT ARTICLES (Z=-3600) ═══════════ */}
          <SceneLayer baseZ={-3600} vScroll={vScroll}>
            <div style={{ width: 'min(1100px, 90vw)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{
                    fontFamily: 'JetBrains Mono',
                    color: '#c084fc',
                    fontSize: 12,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}>
                    Knowledge base
                  </div>
                  <h2 style={{
                    fontFamily: 'Outfit',
                    fontSize: 'clamp(32px, 4vw, 48px)',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #fff, #c4b5fd)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em',
                  }}>
                    Latest Articles
                  </h2>
                </div>
                <Link to="/articles" style={{ color: '#c4b5fd', fontFamily: 'Inter', fontSize: 14, textDecoration: 'none' }}>
                  View all →
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {recentArticles.map((article) => (
                  <div
                    key={article.id}
                    style={{
                      background: 'rgba(124,58,237,0.04)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(196,181,253,0.08)',
                      borderRadius: 16,
                      padding: '24px',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: 24,
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                        <span style={{ padding: '2px 10px', background: 'rgba(124,58,237,0.2)', borderRadius: 100, fontSize: 11, color: '#c4b5fd', fontFamily: 'JetBrains Mono' }}>
                          {article.category}
                        </span>
                        <span style={{ color: 'rgba(248,248,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center' }}>
                          {article.readTime}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
                        {article.title}
                      </h3>
                      <p style={{ color: 'rgba(248,248,255,0.45)', fontSize: 13, fontFamily: 'Inter', lineHeight: 1.6 }}>
                        {article.excerpt.slice(0, 100)}...
                      </p>
                    </div>
                    <img
                      src={article.image}
                      alt={article.title}
                      style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </SceneLayer>

          {/* ═══════════ WHATSAPP BANNER (Z=-4800) ═══════════ */}
          <SceneLayer baseZ={-4800} vScroll={vScroll}>
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
                <a
                  href="https://chat.whatsapp.com/ISr5PjCc5B348ctJSBkKEj?mode=wwc"
                  target="_blank"
                  rel="noreferrer"
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
                  }}
                >
                  Join Now →
                </a>
              </div>
            </div>
          </SceneLayer>

          {/* ═══════════ QUICK NAVIGATION (Z=-6000) ═══════════ */}
          <SceneLayer baseZ={-6000} vScroll={vScroll}>
            <div style={{ width: 'min(1000px, 90vw)' }}>
              <h2 style={{
                fontFamily: 'Outfit',
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #fff, #c4b5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textAlign: 'center',
                marginBottom: 40,
              }}>Explore SoQC</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                {[
                  { to: '/events', label: 'Events', desc: 'Workshops & seminars', icon: '◈', color: '#7c3aed' },
                  { to: '/articles', label: 'Articles', desc: 'Quantum knowledge', icon: '∂', color: '#a855f7' },
                  { to: '/projects', label: 'Projects', desc: 'Research & builds', icon: '⬡', color: '#c4b5fd' },
                  { to: '/committee', label: 'Committee', desc: 'Meet the team', icon: '◉', color: '#d946ef' },
                  { to: '/logo', label: 'Our Logo', desc: 'The story behind it', icon: '∞', color: '#8b5cf6' },
                ].map((item) => (
                  <Link to={item.to} key={item.to} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'rgba(124,58,237,0.06)',
                      border: '1px solid rgba(196,181,253,0.1)',
                      borderRadius: 16,
                      padding: '28px 20px',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                    }}>
                      <div style={{ fontSize: 32, marginBottom: 12, color: item.color }}>{item.icon}</div>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 6 }}>{item.label}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(248,248,255,0.4)' }}>{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </SceneLayer>

          {/* ═══════════ OUTRO LOGO (Z=-7200) ═══════════ */}
          <SceneLayer baseZ={-7200} vScroll={vScroll}>
            <div style={{ textAlign: 'center' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 140,
                  height: 140,
                  margin: '0 auto 32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #d946ef, #22d3ee)',
                  padding: 2,
                  boxShadow: '0 0 100px rgba(124,58,237,0.5)',
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'rgba(3,3,15,0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 52,
                  color: '#fff',
                  fontFamily: 'JetBrains Mono',
                }}>
                  ψ
                </div>
              </motion.div>
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