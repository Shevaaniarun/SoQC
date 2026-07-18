import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useSpring, useMotionValue, useTransform, useAnimationFrame } from 'framer-motion'
import { committee } from '../data'
import { useMousePosition } from '../hooks/useMousePosition'

interface Member {
  name: string
  role: string
  year?: string
  dept: string
  image: string
  interests?: string[]
  linkedin: string
  instagram?: string
}

const members = [
  ...committee.faculty,
  committee.chair,
  committee.viceChair,
  ...committee.directors,
  ...committee.deputies,
] as Member[]

function HelixCard({
  member,
  index,
  time,
  vScroll,
  onSelect,
}: {
  member: Member
  index: number
  time: any
  vScroll: any
  onSelect: (m: Member) => void
}) {
  const pointer = useMousePosition() // For subtle interactive tilt
  const ptrX = pointer.x === -999 ? window.innerWidth / 2 : pointer.x
  const ptrY = pointer.y === -999 ? window.innerHeight / 2 : pointer.y

  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  const tiltX = (cy - ptrY) * 0.04
  const tiltY = (ptrX - cx) * 0.04

  // Helix math constants
  const angleSpacing = (Math.PI * 2) / 6 // 6 items per revolution
  const cylinderRadius = window.innerWidth < 768 ? 260 : 420
  const ySpacing = 160
  const zOffset = -150
  const startYOffset = window.innerHeight * 0.6 // start cards slightly lower

  const styleTransform = useTransform(() => {
    const t = time.get()
    const s = vScroll.get()
    const scrollAngle = s * 0.003

    const angle = index * angleSpacing + t + scrollAngle
    const x = Math.sin(angle) * cylinderRadius
    const rawZ = Math.cos(angle) * cylinderRadius
    const z = rawZ + zOffset

    // Cards move UP as we scroll DOWN (so scroll moves camera down)
    // Actually, user scrolls down to move forward/upward through the helix
    const y = index * ySpacing - s + startYOffset

    // Facing the camera
    const facing = -Math.atan2(x, rawZ)

    // Scale up when in front
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
    const scale = 0.8 + Math.pow(focus, 3) * 0.35 // non-linear scale for punchiness

    return `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, ${z}px) rotateY(${facing}rad) scale(${scale})`
  })

  // Dynamic derivations based on depth/focus
  const styleOpacity = useTransform(() => {
    const angle = index * angleSpacing + time.get() + vScroll.get() * 0.003
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
    return 0.15 + Math.pow(focus, 2) * 0.85
  })

  const styleFilter = useTransform(() => {
    const angle = index * angleSpacing + time.get() + vScroll.get() * 0.003
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
    return `saturate(${0.5 + focus * 0.7}) blur(${focus < 0.6 ? 4 : 0}px)`
  })

  const styleZIndex = useTransform(() => {
    const angle = index * angleSpacing + time.get() + vScroll.get() * 0.003
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
    return Math.round(focus * 100)
  })

  const styleBoxShadow = useTransform(() => {
    const angle = index * angleSpacing + time.get() + vScroll.get() * 0.003
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
    if (focus > 0.96) return '0 0 50px rgba(167, 139, 250, 0.45), inset 0 0 20px rgba(124, 58, 237, 0.25)'
    if (focus > 0.6) return '0 0 30px rgba(167, 139, 250, 0.15)'
    return 'none'
  })

  const styleBorder = useTransform(() => {
    const angle = index * angleSpacing + time.get() + vScroll.get() * 0.003
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
    return `1px solid ${focus > 0.9 ? 'rgba(196,181,253,0.5)' : focus > 0.6 ? 'rgba(196,181,253,0.25)' : 'rgba(255,255,255,0.06)'}`
  })

  // Reveal designation cleanly only at the front
  const designationOpacity = useTransform(() => {
    const angle = index * angleSpacing + time.get() + vScroll.get() * 0.003
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
    return focus > 0.9 ? (focus - 0.9) / 0.1 : 0
  })

  return (
    <motion.button
      onClick={() => onSelect(member)}
      style={{
        position: 'absolute',
        left: '50%',
        top: 0, // Using top:0 and deriving full Y inside translate3d for correctness
        width: 280, // slightly wider for breathing room
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        transform: styleTransform,
        opacity: styleOpacity,
        filter: styleFilter,
        zIndex: styleZIndex,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        whileHover={{ scale: 1.04, y: -6 }}
        style={{
          borderRadius: 24,
          padding: '24px',
          background: 'rgba(7, 7, 26, 0.68)',
          backdropFilter: 'blur(20px)',
          border: styleBorder,
          boxShadow: styleBoxShadow,
          textAlign: 'left',
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            overflow: 'hidden',
            border: `2px solid rgba(196,181,253,0.3)`,
            flexShrink: 0,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}>
            <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700, color: '#fff' }}>{member.name}</div>
            <motion.div style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 10,
              color: '#a855f7',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: 4,
              opacity: designationOpacity, // reveals when at front
            }}>
              {member.role}
            </motion.div>
          </div>
        </div>
        <motion.div style={{
          fontFamily: 'Inter',
          fontSize: 13,
          color: 'rgba(248,248,255,0.6)',
          lineHeight: 1.6,
          opacity: designationOpacity, // fade in details too
        }}>
          {member.dept}
          {member.year ? ` · ${member.year}` : ''}
        </motion.div>
      </motion.div>
    </motion.button>
  )
}

export default function Committee() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  // Virtual Scroll State
  const time = useMotionValue(0)
  const vScrollTarget = useRef(0)
  const vScroll = useSpring(0, { stiffness: 60, damping: 25, mass: 1.2 })

  // Background overlay opacity based on scroll
  const headerOpacity = useTransform(vScroll, [0, 800], [1, 0])

  useEffect(() => {
    // Lock native scrolling natively and gracefully
    document.body.style.overflow = 'hidden'

    const maxScroll = members.length * 160 + 600

    const onWheel = (e: WheelEvent) => {
      // Delta mapping for natural feel. Normalize a bit depending on device.
      vScrollTarget.current += (e.deltaY * 0.8)
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
      vScrollTarget.current += (delta * 1.5)
      vScrollTarget.current = Math.max(0, Math.min(vScrollTarget.current, maxScroll))
      vScroll.set(vScrollTarget.current)
    }

    // Must use { passive: false } if calling preventDefault, but we just lock the body so we don't need it.
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      document.body.style.overflow = 'auto' // Restore strictly on unmount
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [vScroll])

  useAnimationFrame((_, delta: number) => {
    // Elegant continuous helix rotation even when not scrolling
    time.set(time.get() + delta * 0.00015)
  })

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: 'radial-gradient(circle at center, rgba(124,58,237,0.12), transparent 60%), linear-gradient(180deg, #03030a 0%, #060611 100%)',
      zIndex: 1, // Base layer for proper stacking
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        perspective: '1500px',
        transformStyle: 'preserve-3d',
      }}>
        {/* Deep background fog */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(3,3,10,0.1), rgba(3,3,10,0.85))',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Ambient volumetric light in center */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '80vh',
          height: '80vh',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 60%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        {/* Particles */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {Array.from({ length: 90 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: ['100vh', '-10vh'],
                opacity: [0, 0.6, 0],
                x: Math.sin(i) * 200,
              }}
              transition={{
                duration: 10 + (i % 15),
                repeat: Infinity,
                delay: i % 10,
                ease: 'linear',
              }}
              style={{
                position: 'absolute',
                left: `${(i * 17) % 100}%`,
                width: 2 + (i % 3),
                height: 2 + (i % 3),
                borderRadius: '50%',
                background: i % 2 === 0 ? '#a855f7' : '#22d3ee',
                boxShadow: `0 0 10px ${i % 2 === 0 ? '#a855f7' : '#22d3ee'}`,
              }}
            />
          ))}
        </div>

        {/* Cinematic Header Text that fades out as you dive */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            pointerEvents: 'none',
            opacity: headerOpacity,
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 740, padding: 24, transform: 'translateY(-20vh)' }}>
            <div style={{
              fontFamily: 'JetBrains Mono',
              color: '#a855f7',
              fontSize: 12,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}>
              SoQC • Helix Gallery
            </div>
            <h1 style={{
              fontFamily: 'Outfit',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: 16,
              lineHeight: 1.1,
            }}>
              Diving into the core.
            </h1>
            <p style={{
              fontFamily: 'Inter',
              fontSize: 17,
              lineHeight: 1.8,
              color: 'rgba(248,248,255,0.7)',
            }}>
              Scroll to physically travel down into the quantum spiral. Elements will react dynamically as they pass through the viewport focus.
            </p>
          </div>
        </motion.div>

        {/* 3D Helix Layer */}
        <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
          {members.map((member, index) => (
            <HelixCard
              key={member.name}
              member={member}
              index={index}
              time={time}
              vScroll={vScroll}
              onSelect={setSelectedMember}
            />
          ))}
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                background: 'rgba(3,3,15,0.85)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                cursor: 'pointer', // signify click outside to close
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0, rotateX: 10 }}
                animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.95, y: -20, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: 'min(480px, 100%)',
                  padding: '40px 32px',
                  borderRadius: 32,
                  background: 'rgba(7,7,26,0.95)',
                  border: '1px solid rgba(196,181,253,0.3)',
                  boxShadow: '0 0 100px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                  cursor: 'auto',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                  <div style={{
                    width: 84,
                    height: 84,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid rgba(196,181,253,0.5)',
                  }}>
                    <img src={selectedMember.image} alt={selectedMember.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                      {selectedMember.name}
                    </h2>
                    <div style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: 12,
                      color: '#a855f7',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}>{selectedMember.role}</div>
                  </div>
                </div>
                <p style={{ fontFamily: 'Inter', color: 'rgba(248,248,255,0.7)', lineHeight: 1.8, fontSize: 15, marginBottom: 20 }}>
                  {selectedMember.dept}
                  {selectedMember.year ? ` · ${selectedMember.year}` : ''}
                </p>
                {selectedMember.interests && (
                  <div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(248,248,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Research Focus</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {selectedMember.interests.map((interest) => (
                        <span key={interest} style={{
                          padding: '8px 14px',
                          borderRadius: 999,
                          border: '1px solid rgba(196,181,253,0.2)',
                          background: 'rgba(124,58,237,0.1)',
                          color: '#c4b5fd',
                          fontFamily: 'Inter',
                          fontSize: 13,
                          fontWeight: 500,
                        }}>{interest}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
