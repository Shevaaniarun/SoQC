import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { events, articles, projects } from '../data'

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
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
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
        {/* Orbital ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2, 0.025, 16, 100]} />
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.6} />
        </mesh>
        {/* Second ring */}
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[2.4, 0.015, 16, 100]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
        </mesh>
      </Float>
      {/* Ambient glow point lights */}
      <pointLight color="#7c3aed" intensity={3} distance={8} position={[2, 2, 2]} />
      <pointLight color="#d946ef" intensity={2} distance={6} position={[-2, -2, 1]} />
      <ambientLight intensity={0.1} />
    </group>
  )
}

function StatCard({ value, label, icon }: { value: number; label: string; icon: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4, boxShadow: '0 0 40px rgba(124,58,237,0.3)' }}
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
    </motion.div>
  )
}

function ScrollIndicator() {
  return (
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        color: 'rgba(196,181,253,0.5)',
        fontSize: 11,
        letterSpacing: '0.2em',
        fontFamily: 'JetBrains Mono',
        textTransform: 'uppercase',
      }}
    >
      <span>Scroll to explore</span>
      <div style={{
        width: 1,
        height: 40,
        background: 'linear-gradient(to bottom, rgba(196,181,253,0.5), transparent)',
      }} />
    </motion.div>
  )
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.92])
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -60])

  const [mouseXY, setMouseXY] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouseXY({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  const springX = useSpring(mouseXY.x, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseXY.y, { stiffness: 50, damping: 20 })

  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3)
  const recentArticles = articles.slice(0, 3)

  return (
    <div ref={containerRef} style={{ position: 'relative', zIndex: 1 }}>
      {/* HERO */}
      <motion.section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          opacity: heroOpacity,
          scale: heroScale,
          y: heroY,
        }}
      >
        {/* 3D Canvas */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <Stars radius={80} depth={50} count={3000} factor={3} fade speed={0.5} />
            <QuantumSphere />
          </Canvas>
        </div>

        {/* Radial glow behind sphere */}
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

        {/* Hero content */}
        <motion.div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: '0 24px',
            rotateX: springY,
            rotateY: springX,
          }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
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
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 6px #a855f7', display: 'inline-block' }} />
            Society of Quantum Computing — Est. 2023
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
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
              textShadow: 'none',
              backgroundSize: '200% 200%',
              animation: 'shimmer 4s linear infinite',
            }}
          >
            SoQC
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            style={{
              fontFamily: 'Outfit',
              fontSize: 'clamp(16px, 3vw, 22px)',
              color: 'rgba(248,248,255,0.7)',
              maxWidth: 600,
              margin: '0 auto 16px',
              fontWeight: 300,
              letterSpacing: '0.01em',
              lineHeight: 1.5,
            }}
          >
            Exploring the quantum frontier
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            style={{
              fontFamily: 'Inter',
              fontSize: 15,
              color: 'rgba(248,248,255,0.4)',
              maxWidth: 500,
              margin: '0 auto 48px',
              lineHeight: 1.7,
            }}
          >
            Where quantum mechanics meets computation. We research, build, and teach
            the technologies that will define the next era of information processing.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.div whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(124,58,237,0.6)' }} whileTap={{ scale: 0.97 }}>
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
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
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
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
        >
          <ScrollIndicator />
        </motion.div>
      </motion.section>

      {/* STATS DASHBOARD */}
      <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{ fontFamily: 'JetBrains Mono', color: '#a855f7', fontSize: 12, letterSpacing: '0.2em', marginBottom: 16, textTransform: 'uppercase' }}>
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
          }}>
            Quantum Impact
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
          marginBottom: 80,
        }}>
          <StatCard value={12} label="Events Organized" icon="◈" />
          <StatCard value={8} label="Articles Published" icon="∂" />
          <StatCard value={6} label="Active Projects" icon="⬡" />
          <StatCard value={3} label="Research Papers" icon="∞" />
        </div>

        {/* WhatsApp community banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ boxShadow: '0 0 60px rgba(37,211,102,0.2)' }}
          style={{
            background: 'linear-gradient(135deg, rgba(37,211,102,0.08), rgba(124,58,237,0.08))',
            border: '1px solid rgba(37,211,102,0.2)',
            borderRadius: 20,
            padding: '40px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
            transition: 'box-shadow 0.3s ease',
          }}
        >
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
            href="https://chat.whatsapp.com/"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(37,211,102,0.4)' }}
            whileTap={{ scale: 0.97 }}
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
          </motion.a>
        </motion.div>
      </section>

      {/* UPCOMING EVENTS PREVIEW */}
      <section style={{ padding: '60px 24px 100px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', color: '#a855f7', fontSize: 12, letterSpacing: '0.2em', marginBottom: 12, textTransform: 'uppercase' }}>
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
          {upcomingEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
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
                <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* RECENT ARTICLES PREVIEW */}
      <section style={{ padding: '60px 24px 120px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', color: '#a855f7', fontSize: 12, letterSpacing: '0.2em', marginBottom: 12, textTransform: 'uppercase' }}>
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
          {recentArticles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ x: 4, boxShadow: '0 0 30px rgba(124,58,237,0.2)' }}
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Navigation */}
      <section style={{ padding: '60px 24px 120px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2 style={{
            fontFamily: 'Outfit',
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #fff, #c4b5fd)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Explore SoQC</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { to: '/events', label: 'Events', desc: 'Workshops & seminars', icon: '◈', color: '#7c3aed' },
            { to: '/articles', label: 'Articles', desc: 'Quantum knowledge', icon: '∂', color: '#a855f7' },
            { to: '/projects', label: 'Projects', desc: 'Research & builds', icon: '⬡', color: '#c4b5fd' },
            { to: '/committee', label: 'Committee', desc: 'Meet the team', icon: '◉', color: '#d946ef' },
            { to: '/logo', label: 'Our Logo', desc: 'The story behind it', icon: '∞', color: '#8b5cf6' },
          ].map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: `0 0 40px ${item.color}33` }}
            >
              <Link to={item.to} style={{ textDecoration: 'none' }}>
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
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
