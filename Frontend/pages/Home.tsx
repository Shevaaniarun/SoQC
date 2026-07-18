import { useEffect, useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { events, articles } from '../data'
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
        z, // controls the translateZ
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

    const maxScroll = 8800 // beyond logo Z

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

  const upcomingEvents = events.filter((event) => event.status === 'upcoming').slice(0, 2)
  const recentArticles = articles.slice(0, 2)

  const scenes = [
    {
      title: 'Signals flowing through the lab',
      eyebrow: 'Live pulses',
      body: 'Upcoming workshops and events appear like floating beacons as the camera glides deeper into the experience.',
      accent: '#22d3ee',
      link: '/events',
      cta: 'See events',
      z: -1200,
    },
    {
      title: 'Knowledge drifting in the void',
      eyebrow: 'Articles',
      body: 'Thoughtful stories and concepts emerge from the distance, carried by subtle motion and depth.',
      accent: '#c084fc',
      link: '/articles',
      cta: 'Open articles',
      z: -2400,
    },
    {
      title: 'Research architectures unfolding',
      eyebrow: 'Projects',
      body: 'Each project surfaces as a luminous node in a larger quantum constellation.',
      accent: '#8b5cf6',
      link: '/projects',
      cta: 'Meet the work',
      z: -3600,
    },
    {
      title: 'The people at the core',
      eyebrow: 'Committee',
      body: 'The committee page becomes its own helix structure — a living chamber of motion and presence.',
      accent: '#d946ef',
      link: '/committee',
      cta: 'Enter the helix',
      z: -4800,
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

        {/* Dynamic camera tilt wrapper giving 3D mouse parallax to entire volume */}
        <motion.div style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          rotateX: tiltX,
          rotateY: tiltY,
        }}>

          {/* ═══════════ HERO (Z=0) ═══════════ */}
          <SceneLayer baseZ={0} vScroll={vScroll}>
            {/* 3D Canvas sphere container */}
            <div style={{ position: 'absolute', width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <Stars radius={90} depth={60} count={2800} factor={3} fade speed={0.45} />
                <QuantumSphere />
              </Canvas>
            </div>

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
              <div style={{
                fontFamily: 'JetBrains Mono',
                color: '#a855f7',
                fontSize: 12,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                marginBottom: 24,
                textShadow: '0 0 20px rgba(168,85,247,0.4)',
              }}>
                SoQC • Quantum Exploration
              </div>
              <h1 style={{
                fontFamily: 'Outfit',
                fontSize: 'clamp(44px, 7vw, 84px)',
                fontWeight: 800,
                lineHeight: 1.02,
                marginBottom: 24,
                background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 40%, #a855f7 70%, #d946ef 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Entering the quantum horizon
              </h1>
              <p style={{
                fontFamily: 'Inter',
                color: 'rgba(248,248,255,0.7)',
                fontSize: 18,
                lineHeight: 1.8,
                maxWidth: 600,
                marginBottom: 40,
              }}>
                Scroll to effortlessly fly inward. The lab expands dynamically as you travel along the Z-axis, dissolving conventional layouts into deep space.
              </p>

              <div style={{
                width: 24,
                height: 40,
                borderRadius: 12,
                border: '2px solid rgba(196,181,253,0.3)',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: 8,
              }}>
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: 3, height: 8, borderRadius: 2, background: '#c4b5fd' }}
                />
              </div>
            </div>
          </SceneLayer>

          {/* ═══════════ DYNAMIC SCENE CARDS ═══════════ */}
          {scenes.map((scene) => (
            <SceneLayer key={scene.title} baseZ={scene.z} vScroll={vScroll}>
              <div style={{
                width: 'min(920px, 90vw)',
                borderRadius: 32,
                padding: '48px 40px',
                background: 'rgba(7, 7, 30, 0.45)', // more transparent for depth effect
                backdropFilter: 'blur(34px)',
                WebkitBackdropFilter: 'blur(34px)',
                border: `1px solid ${scene.accent}30`,
                boxShadow: `0 0 100px ${scene.accent}15, inset 0 0 40px ${scene.accent}10`,
                textAlign: 'left',
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono',
                  color: scene.accent,
                  fontSize: 12,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                  textShadow: `0 0 15px ${scene.accent}40`,
                }}>
                  {scene.eyebrow}
                </div>
                <h2 style={{
                  fontFamily: 'Outfit',
                  fontSize: 'clamp(32px, 5vw, 56px)',
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 20,
                  lineHeight: 1.05,
                }}>
                  {scene.title}
                </h2>
                <p style={{
                  fontFamily: 'Inter',
                  color: 'rgba(248,248,255,0.7)',
                  fontSize: 16,
                  lineHeight: 1.8,
                  maxWidth: 620,
                  marginBottom: 32,
                }}>
                  {scene.body}
                </p>
                <Link to={scene.link} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 28px',
                  color: '#fff',
                  borderRadius: 999,
                  background: `linear-gradient(135deg, ${scene.accent}, #a855f7)`,
                  textDecoration: 'none',
                  fontFamily: 'Outfit',
                  fontWeight: 600,
                  fontSize: 15,
                  boxShadow: `0 4px 30px ${scene.accent}50`,
                }}>
                  {scene.cta} <span style={{ fontSize: 18 }}>→</span>
                </Link>
              </div>
            </SceneLayer>
          ))}

          {/* ═══════════ SIGNAL TRAILS (Z=-6000) ═══════════ */}
          <SceneLayer baseZ={-6000} vScroll={vScroll}>
            <div style={{ width: 'min(1100px, 90vw)' }}>
              <div style={{
                fontFamily: 'JetBrains Mono',
                color: '#a855f7',
                fontSize: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: 24,
                textAlign: 'center',
              }}>
                Signal trails
              </div>
              <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                <div style={{
                  borderRadius: 24,
                  padding: 32,
                  background: 'rgba(7, 7, 26, 0.55)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(196,181,253,0.15)',
                  boxShadow: '0 4px 40px rgba(0,0,0,0.3)',
                }}>
                  <h3 style={{ fontFamily: 'Outfit', fontSize: 24, color: '#fff', marginBottom: 20, fontWeight: 700 }}>Upcoming pulses</h3>
                  {upcomingEvents.map((event) => (
                    <div key={event.id} style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{event.category}</div>
                      <div style={{ fontFamily: 'Inter', color: 'rgba(248,248,255,0.75)', fontSize: 15, lineHeight: 1.5 }}>{event.title}</div>
                    </div>
                  ))}
                </div>
                <div style={{
                  borderRadius: 24,
                  padding: 32,
                  background: 'rgba(7, 7, 26, 0.55)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(196,181,253,0.15)',
                  boxShadow: '0 4px 40px rgba(0,0,0,0.3)',
                }}>
                  <h3 style={{ fontFamily: 'Outfit', fontSize: 24, color: '#fff', marginBottom: 20, fontWeight: 700 }}>Fresh knowledge</h3>
                  {recentArticles.map((article) => (
                    <div key={article.id} style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{article.category}</div>
                      <div style={{ fontFamily: 'Inter', color: 'rgba(248,248,255,0.75)', fontSize: 15, lineHeight: 1.5 }}>{article.title}</div>
                    </div>
                  ))}
                </div>
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
