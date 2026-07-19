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
  totalItems,
  time,
  vScroll,
  onSelect,
}: {
  member: Member
  index: number
  totalItems: number
  time: any
  vScroll: any
  onSelect: (m: Member) => void
}) {
  const pointer = useMousePosition()
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight })
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const ptrX = pointer.x === -999 ? dimensions.width / 2 : pointer.x
  const ptrY = pointer.y === -999 ? dimensions.height / 2 : pointer.y

  const cx = dimensions.width / 2
  const cy = dimensions.height / 2
  const tiltX = (cy - ptrY) * 0.04
  const tiltY = (ptrX - cx) * 0.04

  // --- Optimized Helix Constants ---
  const itemsPerRevolution = 7
  const angleSpacing = (Math.PI * 2) / itemsPerRevolution
  const cylinderRadius = dimensions.width < 768 ? 240 : 450
  const ySpacing = 220
  const zOffset = -200
  const startYOffset = dimensions.height * 0.45

  // Total height block occupied by one full iteration loop
  const totalLoopHeight = totalItems * ySpacing

  // Helper mapping shared across derivations to keep spatial math perfectly synchronized
  const getLoopState = () => {
    const t = time.get()
    const s = vScroll.get()

    // Map raw vertical tracking space directly to the angle
    const scrollAngle = s * 0.0035

    // Calculate current un-looped Y coordinate relative to the camera center viewport point
    let relativeY = index * ySpacing - s + startYOffset

    // Infinite Loop Math logic: 
    // Shift cards vertically back up or down if they move too far off screen limits
    const halfLoop = totalLoopHeight / 2
    relativeY = ((relativeY - startYOffset + halfLoop) % totalLoopHeight) 
    if (relativeY < 0) relativeY += totalLoopHeight
    const finalY = relativeY - halfLoop + startYOffset

    // Deduce what virtual offset scale index we are currently occupying in the loop sequence
    const virtualIndex = (finalY - startYOffset + s) / ySpacing
    const angle = virtualIndex * angleSpacing + t + scrollAngle

    return { angle, y: finalY }
  }

  const styleTransform = useTransform(() => {
    const { angle, y } = getLoopState()
    
    const x = Math.sin(angle) * cylinderRadius
    const rawZ = Math.cos(angle) * cylinderRadius
    const z = rawZ + zOffset
    const facing = -Math.atan2(x, rawZ)

    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
    const scale = 0.75 + Math.pow(focus, 3) * 0.4

    return `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, ${z}px) rotateY(${facing}rad) scale(${scale})`
  })

  const styleOpacity = useTransform(() => {
    const { angle } = getLoopState()
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
    return 0.08 + Math.pow(focus, 2) * 0.92
  })

  const styleFilter = useTransform(() => {
    const { angle } = getLoopState()
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
    return `saturate(${0.4 + focus * 0.8}) blur(${focus < 0.55 ? 5 : 0}px)`
  })

  const styleZIndex = useTransform(() => {
    const { angle } = getLoopState()
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
    return Math.round(focus * 200)
  })

  const styleBoxShadow = useTransform(() => {
    const { angle } = getLoopState()
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
    if (focus > 0.94) return '0 0 50px rgba(167, 139, 250, 0.45), inset 0 0 20px rgba(124, 58, 237, 0.25)'
    if (focus > 0.6) return '0 0 30px rgba(167, 139, 250, 0.15)'
    return 'none'
  })

  const styleBorder = useTransform(() => {
    const { angle } = getLoopState()
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
    return `1px solid ${focus > 0.88 ? 'rgba(196,181,253,0.5)' : focus > 0.6 ? 'rgba(196,181,253,0.2)' : 'rgba(255,255,255,0.04)'}`
  })

  const designationOpacity = useTransform(() => {
    const { angle } = getLoopState()
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
    return focus > 0.85 ? (focus - 0.85) / 0.15 : 0
  })

  return (
    <motion.button
      onClick={() => onSelect(member)}
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: 290,
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
        whileHover={{ scale: 1.03, y: -4 }}
        style={{
          borderRadius: 24,
          padding: '24px',
          background: 'rgba(7, 7, 26, 0.72)',
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
              opacity: designationOpacity,
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
          opacity: designationOpacity,
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

  const time = useMotionValue(0)
  const vScrollTarget = useRef(0)
  
  // Increased stiffness and mass mapping for snappier, quicker scroll responses
  const vScroll = useSpring(0, { stiffness: 95, damping: 24, mass: 1.0 })

  const headerOpacity = useTransform(vScroll, [0, 450], [1, 0])

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const onWheel = (e: WheelEvent) => {
      // Increased scaling factor (1.2) for faster scrolling translation speed
      vScrollTarget.current += (e.deltaY * 1.2)
      vScroll.set(vScrollTarget.current)
    }

    let lastY = 0
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      const delta = lastY - e.touches[0].clientY
      lastY = e.touches[0].clientY
      vScrollTarget.current += (delta * 2.2)
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

  useAnimationFrame((_, delta: number) => {
    // Increased ambient drift speed slightly (from 0.00015 to 0.00025)
    time.set(time.get() + delta * 0.00025)
  })

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: 'radial-gradient(circle at center, rgba(124,58,237,0.12), transparent 60%), linear-gradient(180deg, #03030a 0%, #060611 100%)',
      zIndex: 1,
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

        {/* Cinematic Header Text */}
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
              Scroll to physically travel down into the quantum spiral. Elements will loop seamlessly as you travel infinitely through the viewports.
            </p>
          </div>
        </motion.div>

        {/* 3D Helix Layer */}
        <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
          {members.map((member, index) => (
            <HelixCard
              key={`${member.name}-${index}`}
              member={member}
              index={index}
              totalItems={members.length}
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
                cursor: 'pointer',
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