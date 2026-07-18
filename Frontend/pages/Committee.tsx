import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
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

function MemberCard({
  member,
  size = 'md',
  delay = 0,
  glowColor = '#7c3aed',
}: {
  member: Member
  size?: 'lg' | 'md' | 'sm'
  delay?: number
  glowColor?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [hovered, setHovered] = useState(false)
  const [selected, setSelected] = useState(false)

  const sizeMap = {
    lg: { imgSize: 100, fontSize: 18, padding: '28px 24px' },
    md: { imgSize: 80, fontSize: 16, padding: '22px 20px' },
    sm: { imgSize: 64, fontSize: 14, padding: '16px 16px' },
  }
  const s = sizeMap[size]

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setSelected(true)}
        style={{
          background: hovered ? `${glowColor}12` : 'rgba(124,58,237,0.06)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${hovered ? `${glowColor}40` : 'rgba(196,181,253,0.1)'}`,
          borderRadius: 20,
          padding: s.padding,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: hovered ? `0 0 40px ${glowColor}30, 0 10px 40px rgba(0,0,0,0.3)` : 'none',
          transform: hovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0)',
        }}
      >
        {/* Avatar */}
        <div style={{
          width: s.imgSize,
          height: s.imgSize,
          borderRadius: '50%',
          overflow: 'hidden',
          margin: '0 auto 12px',
          border: `2px solid ${glowColor}60`,
          boxShadow: hovered ? `0 0 20px ${glowColor}50` : 'none',
          transition: 'box-shadow 0.3s ease',
          background: '#1a1a2e',
        }}>
          <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ fontFamily: 'Outfit', fontSize: s.fontSize, fontWeight: 700, color: '#fff', marginBottom: 4, lineHeight: 1.2 }}>
          {member.name}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: glowColor, letterSpacing: '0.08em', marginBottom: 6, textTransform: 'uppercase' }}>
          {member.role}
        </div>
        {member.year && (
          <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(248,248,255,0.35)', marginBottom: 4 }}>
            {member.year} · {member.dept}
          </div>
        )}

        {/* Hover hint */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'rgba(196,181,253,0.5)', marginTop: 8, letterSpacing: '0.1em' }}
          >
            CLICK FOR PROFILE
          </motion.div>
        )}
      </motion.div>

      {/* Holographic profile modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(3,3,15,0.8)',
              backdropFilter: 'blur(12px)',
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.7, rotateX: 20, opacity: 0 }}
              animate={{ scale: 1, rotateX: 0, opacity: 1 }}
              exit={{ scale: 0.7, rotateX: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'rgba(7,7,26,0.95)',
                backdropFilter: 'blur(40px)',
                border: `1px solid ${glowColor}40`,
                borderRadius: 28,
                padding: '48px 40px',
                maxWidth: 440,
                width: '100%',
                textAlign: 'center',
                boxShadow: `0 0 80px ${glowColor}30, 0 40px 80px rgba(0,0,0,0.5)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Hologram effect rings */}
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 4 + i, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    inset: -20 * i,
                    border: `1px solid ${glowColor}${Math.floor(15 / i).toString(16).padStart(2, '0')}`,
                    borderRadius: '50%',
                    pointerEvents: 'none',
                  }}
                />
              ))}

              {/* Close */}
              <button
                onClick={() => setSelected(false)}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  color: 'rgba(248,248,255,0.6)',
                  cursor: 'pointer',
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >×</button>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 110,
                  height: 110,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto 20px',
                  border: `3px solid ${glowColor}`,
                  boxShadow: `0 0 30px ${glowColor}60`,
                }}>
                  <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <h3 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{member.name}</h3>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: glowColor, letterSpacing: '0.1em', marginBottom: 4, textTransform: 'uppercase' }}>{member.role}</div>
                {member.year && <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(248,248,255,0.4)', marginBottom: 24 }}>{member.year} · {member.dept}</div>}

                {member.interests && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(248,248,255,0.3)', marginBottom: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Research Interests</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {member.interests.map(i => (
                        <span key={i} style={{ padding: '4px 12px', background: `${glowColor}20`, border: `1px solid ${glowColor}30`, borderRadius: 100, fontSize: 12, color: '#c4b5fd', fontFamily: 'Inter' }}>{i}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <motion.a href={member.linkedin} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }}
                    style={{ padding: '8px 20px', background: 'rgba(10,102,194,0.2)', border: '1px solid rgba(10,102,194,0.4)', borderRadius: 10, color: '#60a5fa', fontFamily: 'Inter', fontSize: 13, textDecoration: 'none' }}>
                    LinkedIn
                  </motion.a>
                  {member.instagram && (
                    <motion.a href={member.instagram} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }}
                      style={{ padding: '8px 20px', background: 'rgba(217,70,239,0.15)', border: '1px solid rgba(217,70,239,0.3)', borderRadius: 10, color: '#e879f9', fontFamily: 'Inter', fontSize: 13, textDecoration: 'none' }}>
                      Instagram
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ConnectorLine({ vertical = false }: { vertical?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: vertical ? '8px 0' : '0 8px',
    }}>
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: 1 }}
        viewport={{ once: true }}
        style={{
          width: vertical ? 1 : 60,
          height: vertical ? 40 : 1,
          background: 'linear-gradient(to bottom, rgba(124,58,237,0.6), rgba(168,85,247,0.6))',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <motion.div
          animate={{ y: vertical ? [0, 40, 0] : 0, x: vertical ? 0 : [0, 60, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: 'absolute',
            top: vertical ? 0 : -2,
            left: vertical ? -2 : 0,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#c4b5fd',
            boxShadow: '0 0 6px #c4b5fd',
          }}
        />
      </motion.div>
    </div>
  )
}

export default function Committee() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '60px 24px 80px', maxWidth: 700, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'JetBrains Mono', color: '#a855f7', fontSize: 12, letterSpacing: '0.2em', marginBottom: 16, textTransform: 'uppercase' }}
        >
          SoQC — The People
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
          Meet the<br />Committee
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: 'rgba(248,248,255,0.5)', fontFamily: 'Inter', fontSize: 16, lineHeight: 1.7 }}
        >
          The brilliant minds driving SoQC forward — click any member to reveal their holographic profile.
        </motion.p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 120px' }}>
        {/* Faculty */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(248,248,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Faculty Advisors</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 0 }}>
          {committee.faculty.map((f, i) => (
            <MemberCard key={f.name} member={f} size="md" delay={i * 0.1} glowColor="#d946ef" />
          ))}
        </div>

        <ConnectorLine vertical />

        {/* Chair */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(248,248,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Chairperson</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
          <MemberCard member={committee.chair} size="lg" delay={0.1} glowColor="#c4b5fd" />
        </div>

        <ConnectorLine vertical />

        {/* Vice Chair */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(248,248,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Vice Chairperson</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
          <MemberCard member={committee.viceChair} size="lg" delay={0.15} glowColor="#a855f7" />
        </div>

        <ConnectorLine vertical />

        {/* Directors */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(248,248,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Directors</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 0 }}>
          {committee.directors.map((d, i) => (
            <MemberCard key={d.name} member={d} size="md" delay={i * 0.1} glowColor="#7c3aed" />
          ))}
        </div>

        <ConnectorLine vertical />

        {/* Deputies */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(248,248,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Deputy Heads</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {committee.deputies.map((d, i) => (
            <MemberCard key={d.name} member={d} size="sm" delay={i * 0.08} glowColor="#8b5cf6" />
          ))}
        </div>
      </div>
    </div>
  )
}
