import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { events, articles } from '../data'

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
        <Sphere ref={meshRef} args={[1.3, 64, 64]}>
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
          <torusGeometry args={[1.95, 0.025, 16, 100]} />
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.55} />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[2.3, 0.015, 16, 100]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
        </mesh>
      </Float>
      <pointLight color="#7c3aed" intensity={3.2} distance={8} position={[2, 2, 2]} />
      <pointLight color="#d946ef" intensity={2} distance={6} position={[-2, -2, 1]} />
      <ambientLight intensity={0.1} />
    </group>
  )
}

function SceneCard({
  title,
  eyebrow,
  body,
  accent,
  link,
  cta,
  index,
  z,
  opacity,
  scale,
  tilt,
}: {
  title: string
  eyebrow: string
  body: string
  accent: string
  link: string
  cta: string
  index: number
  z: number
  opacity: number
  scale: number
  tilt: { x: number; y: number }
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity, y: 0, scale }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 2 + index,
        transform: `translate3d(0, 0, ${z}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div style={{
        width: 'min(920px, 100%)',
        borderRadius: 32,
        padding: '40px 36px',
        background: 'rgba(7, 7, 26, 0.55)',
        backdropFilter: 'blur(26px)',
        border: `1px solid ${accent}35`,
        boxShadow: `0 0 80px ${accent}20`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at top left, ${accent}24, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'JetBrains Mono', color: accent, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14 }}>
            {eyebrow}
          </div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#fff', marginBottom: 16, lineHeight: 1.02 }}>
            {title}
          </h2>
          <p style={{ fontFamily: 'Inter', color: 'rgba(248,248,255,0.64)', fontSize: 16, lineHeight: 1.8, maxWidth: 620, marginBottom: 24 }}>
            {body}
          </p>
          <Link to={link} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 22px',
            color: '#fff',
            borderRadius: 999,
            background: `linear-gradient(135deg, ${accent}, #a855f7)`,
            textDecoration: 'none',
            fontFamily: 'Outfit',
            fontWeight: 600,
          }}>
            {cta} <span>→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [viewportHeight, setViewportHeight] = useState(900)

  useEffect(() => {
    const update = () => {
      const nextProgress = Math.min(1, window.scrollY / 7200)
      setScrollProgress(nextProgress)
      setViewportHeight(window.innerHeight)
    }

    const handleScroll = () => {
      window.requestAnimationFrame(update)
    }

    const handlePointer = (event: MouseEvent) => {
      setPointer({ x: (event.clientX / window.innerWidth - 0.5) * 10, y: (event.clientY / window.innerHeight - 0.5) * 8 })
    }

    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handlePointer)
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handlePointer)
      window.removeEventListener('resize', update)
    }
  }, [])

  const tilt = {
    x: (pointer.y / Math.max(viewportHeight, 1)) * 5,
    y: (pointer.x / Math.max(window.innerWidth, 1)) * 6,
  }

  const depthSteps = [0, -1200, -2400, -3600, -4800, -6000]
  const scenes = [
    {
      title: 'Entering the quantum horizon',
      eyebrow: 'SoQC • Immersive launch',
      body: 'A cinematic first contact with the club — elegant, luminous, and tuned for the feeling of diving into a new dimension.',
      accent: '#a855f7',
      link: '/events',
      cta: 'Explore the orbit',
    },
    {
      title: 'Signals flowing through the lab',
      eyebrow: 'Live pulses',
      body: 'Upcoming workshops and events appear like floating beacons as the camera glides deeper into the experience.',
      accent: '#22d3ee',
      link: '/events',
      cta: 'See events',
    },
    {
      title: 'Knowledge drifting in the void',
      eyebrow: 'Articles',
      body: 'Thoughtful stories and concepts emerge from the distance, carried by subtle motion and depth.',
      accent: '#c084fc',
      link: '/articles',
      cta: 'Open articles',
    },
    {
      title: 'Research architectures unfolding',
      eyebrow: 'Projects',
      body: 'Each project surfaces as a luminous node in a larger quantum constellation.',
      accent: '#8b5cf6',
      link: '/projects',
      cta: 'Meet the work',
    },
    {
      title: 'The people at the core',
      eyebrow: 'Committee',
      body: 'The committee page becomes its own helix structure — a living chamber of motion and presence.',
      accent: '#d946ef',
      link: '/committee',
      cta: 'Enter the helix',
    },
    {
      title: 'The logo dissolves into meaning',
      eyebrow: 'Identity',
      body: 'The final scene closes the journey with a soft pulse of light and the feeling of leaving the lab.',
      accent: '#f472b6',
      link: '/logo',
      cta: 'See the emblem',
    },
  ]

  const upcomingEvents = events.filter((event) => event.status === 'upcoming').slice(0, 2)
  const recentArticles = articles.slice(0, 2)

  return (
    <div style={{ minHeight: 7600, position: 'relative', overflow: 'visible', background: 'linear-gradient(180deg, #05050b 0%, #060611 100%)' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', perspective: '1800px', transformStyle: 'preserve-3d' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <Stars radius={90} depth={60} count={2800} factor={3} fade speed={0.45} />
            <QuantumSphere />
          </Canvas>
        </div>

        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(124,58,237,0.12) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,6,23,0.1) 0%, rgba(2,6,23,0.28) 100%)', pointerEvents: 'none', zIndex: 1 }} />

        {scenes.map((scene, index) => {
          const depth = depthSteps[index]
          const z = depth - scrollProgress * 7200
          const distance = Math.abs(z)
          const opacity = Math.max(0, Math.min(1, 1 - (distance - 280) / 1600))
          const scale = Math.max(0.72, 1 - distance / 7000)

          return (
            <SceneCard
              key={scene.title}
              title={scene.title}
              eyebrow={scene.eyebrow}
              body={scene.body}
              accent={scene.accent}
              link={scene.link}
              cta={scene.cta}
              index={index}
              z={z}
              opacity={opacity}
              scale={scale}
              tilt={tilt}
            />
          )
        })}
      </div>

      <section style={{ position: 'relative', zIndex: 3, padding: '56px 24px 120px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontFamily: 'JetBrains Mono', color: '#a855f7', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 18 }}>
          Signal trails
        </div>
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={{ borderRadius: 24, padding: 24, background: 'rgba(7, 7, 26, 0.6)', border: '1px solid rgba(196,181,253,0.14)' }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 22, color: '#fff', marginBottom: 12 }}>Upcoming pulses</h3>
            {upcomingEvents.map((event) => (
              <div key={event.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#22d3ee', textTransform: 'uppercase', marginBottom: 6 }}>{event.category}</div>
                <div style={{ fontFamily: 'Inter', color: 'rgba(248,248,255,0.72)' }}>{event.title}</div>
              </div>
            ))}
          </div>
          <div style={{ borderRadius: 24, padding: 24, background: 'rgba(7, 7, 26, 0.6)', border: '1px solid rgba(196,181,253,0.14)' }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 22, color: '#fff', marginBottom: 12 }}>Fresh knowledge</h3>
            {recentArticles.map((article) => (
              <div key={article.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#c084fc', textTransform: 'uppercase', marginBottom: 6 }}>{article.category}</div>
                <div style={{ fontFamily: 'Inter', color: 'rgba(248,248,255,0.72)' }}>{article.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
