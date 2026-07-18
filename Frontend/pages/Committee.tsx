import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { committee } from '../data'

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

export default function Committee() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [time, setTime] = useState(0)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let frame = 0

    const update = () => {
      const nextProgress = Math.min(1, window.scrollY / 7200)
      setScrollProgress(nextProgress)
      setTime((prev) => prev + 0.016)
      frame = window.requestAnimationFrame(update)
    }

    const handlePointer = (event: MouseEvent) => {
      setPointer({ x: (event.clientX / window.innerWidth - 0.5) * 8, y: (event.clientY / window.innerHeight - 0.5) * 6 })
    }

    update()
    window.addEventListener('scroll', () => {
      window.requestAnimationFrame(update)
    }, { passive: true })
    window.addEventListener('mousemove', handlePointer)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', handlePointer)
    }
  }, [])

  const members = [
    ...committee.faculty,
    committee.chair,
    committee.viceChair,
    ...committee.directors,
    ...committee.deputies,
  ] as Member[]

  const centerIndex = (members.length - 1) / 2
  const rotation = time * 0.3 + scrollProgress * 0.5

  return (
    <div style={{ minHeight: 7600, position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at center, rgba(124,58,237,0.16), transparent 55%), linear-gradient(180deg, #03030a 0%, #07071a 100%)' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', perspective: '1700px', transformStyle: 'preserve-3d' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,6,23,0.3), rgba(2,6,23,0.7))', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {Array.from({ length: 70 }).map((_, index) => {
            const size = 2 + (index % 5)
            const left = (index * 37) % 100
            const top = (index * 61) % 100
            return (
              <motion.div
                key={index}
                animate={{ x: [0, 20, 0], y: [0, -18, 0], opacity: [0.25, 0.8, 0.25] }}
                transition={{ duration: 4 + (index % 4), repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: `${top}%`,
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  background: index % 2 === 0 ? '#a855f7' : '#22d3ee',
                  boxShadow: `0 0 ${10 + size * 2}px ${index % 2 === 0 ? '#a855f7' : '#22d3ee'}`,
                }}
              />
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}
        >
          <div style={{ textAlign: 'center', maxWidth: 680, padding: '24px' }}>
            <div style={{ fontFamily: 'JetBrains Mono', color: '#a855f7', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
              SoQC • Helix Gallery
            </div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
              Moving through the people behind the quantum pulse.
            </h1>
            <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: 1.8, color: 'rgba(248,248,255,0.62)' }}>
              The committee drifts through a luminous spiral while the camera moves gently upward — so the experience feels like passing through a living molecular structure.
            </p>
          </div>
        </motion.div>

        {members.map((member, index) => {
          const angle = (index - centerIndex) * 0.9 + rotation
          const radius = 340
          const y = (index - centerIndex) * 138 - scrollProgress * 700
          const x = Math.sin(angle) * radius
          const z = Math.cos(angle) * radius
          const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2))
          const opacity = 0.42 + focus * 0.58
          const scale = 0.76 + focus * 0.28
          const facing = -Math.atan2(x, z)

          return (
            <motion.button
              key={member.name}
              whileHover={{ scale: 1.04, y: -6 }}
              onClick={() => setSelectedMember(member)}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 208,
                padding: 0,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${facing}rad) scale(${scale})`,
                transformStyle: 'preserve-3d',
                opacity,
                filter: `saturate(${0.8 + focus * 0.2}) blur(${focus < 0.42 ? 1.2 : 0}px)`,
                zIndex: Math.round(focus * 100),
                perspective: '1700px',
              }}
            >
              <div style={{
                borderRadius: 24,
                padding: '18px 18px 20px',
                background: 'rgba(7, 7, 26, 0.68)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${focus > 0.6 ? 'rgba(196,181,253,0.35)' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: focus > 0.6 ? '0 0 30px rgba(167,139,250,0.24)' : 'none',
                textAlign: 'left',
                transform: `rotateX(${pointer.y * 0.08}deg) rotateY(${pointer.x * 0.08}deg)`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 54, height: 54, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${focus > 0.6 ? '#c4b5fd' : '#7c3aed'}55`, flexShrink: 0 }}>
                    <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 700, color: '#fff' }}>{member.name}</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#a855f7', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>{member.role}</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(248,248,255,0.58)', lineHeight: 1.6 }}>
                  {member.dept}
                  {member.year ? ` · ${member.year}` : ''}
                </div>
              </div>
            </motion.button>
          )
        })}

        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(3,3,15,0.8)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            >
              <motion.div
                initial={{ scale: 0.92, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.94, y: 20, opacity: 0 }}
                onClick={(event) => event.stopPropagation()}
                style={{ width: 'min(460px, 100%)', padding: '30px 28px', borderRadius: 24, background: 'rgba(7,7,26,0.95)', border: '1px solid rgba(196,181,253,0.24)', boxShadow: '0 0 80px rgba(124,58,237,0.24)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(196,181,253,0.4)' }}>
                    <img src={selectedMember.image} alt={selectedMember.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700, color: '#fff' }}>{selectedMember.name}</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#a855f7', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>{selectedMember.role}</div>
                  </div>
                </div>
                <p style={{ fontFamily: 'Inter', color: 'rgba(248,248,255,0.68)', lineHeight: 1.8, fontSize: 14 }}>
                  {selectedMember.dept}
                  {selectedMember.year ? ` · ${selectedMember.year}` : ''}
                </p>
                {selectedMember.interests && (
                  <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selectedMember.interests.map((interest) => (
                      <span key={interest} style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid rgba(196,181,253,0.18)', color: '#c4b5fd', fontFamily: 'Inter', fontSize: 12 }}>{interest}</span>
                    ))}
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
