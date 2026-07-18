import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

const logoParts = [
  {
    id: 'psi',
    symbol: 'ψ',
    name: 'Psi (ψ)',
    color: '#c4b5fd',
    description: 'The quantum state vector. In quantum mechanics, ψ represents the wavefunction — the mathematical description of a quantum system\'s state. It encodes all probabilities of measurement outcomes.',
    x: 0,
    y: 0,
    rotation: 0,
  },
  {
    id: 'sphere',
    symbol: '◎',
    name: 'Bloch Sphere',
    color: '#a855f7',
    description: 'The Bloch sphere is a geometric representation of the pure state space of a qubit. Every point on its surface corresponds to a unique quantum state — visualizing superposition and entanglement.',
    x: -180,
    y: -120,
    rotation: -15,
  },
  {
    id: 'orbit',
    symbol: '⊛',
    name: 'Orbital Rings',
    color: '#7c3aed',
    description: 'Representing quantum orbits and electron shells, the rings symbolize the wave-particle duality and the probabilistic nature of quantum mechanics — nothing is at a fixed point.',
    x: 180,
    y: -80,
    rotation: 20,
  },
  {
    id: 'entangle',
    symbol: '∞',
    name: 'Entanglement',
    color: '#d946ef',
    description: 'The infinity symbol captures quantum entanglement — the phenomenon where particles remain correlated regardless of distance. Einstein famously called it "spooky action at a distance."',
    x: -120,
    y: 140,
    rotation: -10,
  },
  {
    id: 'gate',
    symbol: '⊕',
    name: 'Quantum Gate',
    color: '#8b5cf6',
    description: 'The XOR-like symbol represents quantum logic gates — the building blocks of quantum circuits. Unlike classical gates, quantum gates are reversible unitary operations.',
    x: 140,
    y: 160,
    rotation: 12,
  },
]

function FloatingSymbol({ part, exploded }: { part: typeof logoParts[0]; exploded: boolean }) {
  return (
    <motion.div
      animate={exploded ? {
        x: part.x,
        y: part.y,
        rotate: part.rotation,
        opacity: 1,
      } : {
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
      }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -40,
        marginLeft: -40,
        width: 80,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 48,
        color: part.color,
        textShadow: `0 0 20px ${part.color}80, 0 0 40px ${part.color}40`,
        cursor: 'default',
        filter: `drop-shadow(0 0 12px ${part.color}60)`,
        fontFamily: 'JetBrains Mono',
      }}
    >
      {part.symbol}
    </motion.div>
  )
}

function QuantumOrb() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.3
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      <Stars radius={60} depth={30} count={2000} factor={3} fade speed={0.3} />
      <pointLight color="#7c3aed" intensity={4} distance={8} position={[3, 3, 2]} />
      <pointLight color="#d946ef" intensity={2} distance={5} position={[-3, -2, 1]} />
      <ambientLight intensity={0.05} />
    </group>
  )
}

export default function LogoExplain() {
  const [phase, setPhase] = useState<'assembled' | 'exploded' | 'reassembled'>('assembled')
  const [activePart, setActivePart] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  useEffect(() => {
    const timer = setTimeout(() => setPhase('exploded'), 1000)
    return () => clearTimeout(timer)
  }, [])

  const activeMeta = logoParts.find(p => p.id === activePart)

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', paddingTop: 100, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
      {/* 3D canvas background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <QuantumOrb />
        </Canvas>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '60px 24px 48px', maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'JetBrains Mono', color: '#a855f7', fontSize: 12, letterSpacing: '0.2em', marginBottom: 16, textTransform: 'uppercase' }}
        >
          SoQC — Identity
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          style={{
            fontFamily: 'Outfit',
            fontSize: 'clamp(40px, 7vw, 80px)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ffffff, #c4b5fd 40%, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            marginBottom: 24,
          }}
        >
          Decoding<br />Our Logo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: 'rgba(248,248,255,0.5)', fontFamily: 'Inter', fontSize: 16, lineHeight: 1.7 }}
        >
          Every element of the SoQC logo carries meaning rooted in quantum physics.
          Watch it disassemble — then explore each component.
        </motion.p>
      </div>

      {/* Exploded logo canvas */}
      <div style={{
        position: 'relative',
        height: 500,
        maxWidth: 800,
        margin: '0 auto 80px',
        zIndex: 2,
      }}>
        {/* Central SoQC text */}
        <motion.div
          animate={{
            scale: phase === 'exploded' ? 0.7 : 1,
            opacity: phase === 'exploded' ? 0.6 : 1,
          }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'Outfit',
            fontWeight: 900,
            fontSize: 80,
            background: 'linear-gradient(135deg, #c4b5fd, #a855f7, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            letterSpacing: '-0.04em',
            zIndex: 10,
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          SoQC
        </motion.div>

        {/* Floating parts */}
        {logoParts.map(part => (
          <motion.div
            key={part.id}
            onClick={() => setActivePart(activePart === part.id ? null : part.id)}
            style={{ position: 'absolute', top: '50%', left: '50%', cursor: 'pointer' }}
            animate={phase === 'exploded' ? {
              x: part.x,
              y: part.y,
              rotate: part.rotation,
              opacity: 1,
            } : {
              x: 0,
              y: 0,
              rotate: 0,
              opacity: 0,
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: logoParts.indexOf(part) * 0.1 }}
            whileHover={{ scale: 1.3 }}
          >
            <motion.div
              animate={{
                boxShadow: activePart === part.id
                  ? `0 0 40px ${part.color}, 0 0 80px ${part.color}60`
                  : `0 0 12px ${part.color}40`,
              }}
              style={{
                width: 70,
                height: 70,
                marginTop: -35,
                marginLeft: -35,
                background: `${part.color}15`,
                border: `1px solid ${part.color}60`,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                color: part.color,
                fontFamily: 'JetBrains Mono',
                filter: `drop-shadow(0 0 8px ${part.color}60)`,
                backdropFilter: 'blur(12px)',
              }}
            >
              {part.symbol}
            </motion.div>
          </motion.div>
        ))}

        {/* Reassemble button */}
        <motion.div
          style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 16 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.button
            onClick={() => setPhase(phase === 'exploded' ? 'assembled' : 'exploded')}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '10px 28px',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontFamily: 'Outfit',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(124,58,237,0.4)',
            }}
          >
            {phase === 'exploded' ? '⊕ Assemble Logo' : '⊖ Disassemble Logo'}
          </motion.button>
        </motion.div>
      </div>

      {/* Part info panel */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 2 }}>
        <AnimatePresence>
          {activeMeta && (
            <motion.div
              key={activeMeta.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              style={{
                background: `${activeMeta.color}0a`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${activeMeta.color}30`,
                borderRadius: 20,
                padding: '32px 40px',
                marginBottom: 40,
                boxShadow: `0 0 60px ${activeMeta.color}20`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                <div style={{
                  fontSize: 48,
                  color: activeMeta.color,
                  fontFamily: 'JetBrains Mono',
                  filter: `drop-shadow(0 0 12px ${activeMeta.color}80)`,
                }}>{activeMeta.symbol}</div>
                <div>
                  <h3 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{activeMeta.name}</h3>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: activeMeta.color, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Logo Component</div>
                </div>
              </div>
              <p style={{ color: 'rgba(248,248,255,0.7)', fontFamily: 'Inter', fontSize: 16, lineHeight: 1.8 }}>{activeMeta.description}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* All parts grid */}
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(248,248,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Click a component to learn its meaning
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {logoParts.map((part, i) => (
            <motion.div
              key={part.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              onClick={() => setActivePart(activePart === part.id ? null : part.id)}
              whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${part.color}25` }}
              style={{
                background: activePart === part.id ? `${part.color}12` : 'rgba(124,58,237,0.05)',
                border: `1px solid ${activePart === part.id ? `${part.color}40` : 'rgba(196,181,253,0.08)'}`,
                borderRadius: 16,
                padding: '20px 24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
              }}
            >
              <div style={{ fontSize: 28, color: part.color, fontFamily: 'JetBrains Mono', flexShrink: 0, filter: `drop-shadow(0 0 6px ${part.color}60)` }}>
                {part.symbol}
              </div>
              <div>
                <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>{part.name}</h4>
                <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(248,248,255,0.45)', lineHeight: 1.6 }}>
                  {part.description.slice(0, 70)}...
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Energy burst on reassemble */}
      <AnimatePresence>
        {phase === 'assembled' && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0, 3, 5] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'fixed',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,58,237,0.8), transparent)',
              pointerEvents: 'none',
              zIndex: 100,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
