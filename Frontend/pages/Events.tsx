import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { events } from '../data'

function CountdownTimer({ deadline }: { deadline: string }) {
  const [time, setTime] = useState(() => {
    const diff = new Date(deadline).getTime() - Date.now()
    return diff > 0 ? {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
    } : null
  })

  if (!time) return <span style={{ color: 'rgba(248,248,255,0.3)', fontSize: 12, fontFamily: 'JetBrains Mono' }}>Registration closed</span>

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {[['d', time.d], ['h', time.h], ['m', time.m]].map(([unit, val]) => (
        <div key={unit as string} style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 18,
            fontWeight: 700,
            color: '#c4b5fd',
            background: 'rgba(124,58,237,0.15)',
            padding: '4px 10px',
            borderRadius: 6,
            minWidth: 40,
          }}>{String(val).padStart(2, '0')}</div>
          <div style={{ fontSize: 9, color: 'rgba(248,248,255,0.3)', marginTop: 2, fontFamily: 'JetBrains Mono', letterSpacing: '0.1em' }}>
            {unit}
          </div>
        </div>
      ))}
    </div>
  )
}

function EventCard({ event, index }: { event: typeof events[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [hovered, setHovered] = useState(false)

  const upcoming = event.status === 'upcoming'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.05)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${hovered ? 'rgba(196,181,253,0.25)' : 'rgba(196,181,253,0.1)'}`,
        borderRadius: 24,
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        boxShadow: hovered ? '0 20px 60px rgba(124,58,237,0.2), 0 0 60px rgba(124,58,237,0.1)' : 'none',
        transform: hovered ? 'translateY(-6px) perspective(1000px) rotateX(1deg)' : 'translateY(0)',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <img
          src={event.image}
          alt={event.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.6s ease',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(3,3,15,0.2) 0%, rgba(3,3,15,0.85) 100%)',
        }} />

        {/* Status badge */}
        <div style={{
          position: 'absolute',
          top: 16,
          left: 16,
          padding: '5px 14px',
          background: upcoming
            ? 'linear-gradient(135deg, rgba(124,58,237,0.8), rgba(168,85,247,0.8))'
            : 'rgba(0,0,0,0.5)',
          borderRadius: 100,
          fontSize: 11,
          color: upcoming ? '#fff' : 'rgba(248,248,255,0.5)',
          fontFamily: 'JetBrains Mono',
          letterSpacing: '0.08em',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(196,181,253,0.2)',
        }}>
          {upcoming ? '● UPCOMING' : '✓ COMPLETED'}
        </div>

        {/* Category */}
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          padding: '5px 14px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: 100,
          fontSize: 11,
          color: '#c4b5fd',
          fontFamily: 'JetBrains Mono',
          backdropFilter: 'blur(10px)',
        }}>
          {event.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 28px' }}>
        <h3 style={{
          fontFamily: 'Outfit',
          fontSize: 22,
          fontWeight: 700,
          color: '#fff',
          marginBottom: 10,
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
        }}>
          {event.title}
        </h3>
        <p style={{
          color: 'rgba(248,248,255,0.5)',
          fontSize: 14,
          fontFamily: 'Inter',
          lineHeight: 1.7,
          marginBottom: 20,
        }}>
          {event.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {event.tags.map(tag => (
            <span key={tag} style={{
              padding: '3px 10px',
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(196,181,253,0.15)',
              borderRadius: 100,
              fontSize: 11,
              color: 'rgba(196,181,253,0.8)',
              fontFamily: 'JetBrains Mono',
            }}>{tag}</span>
          ))}
        </div>

        {/* Meta info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ color: 'rgba(248,248,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono' }}>
              {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span style={{ color: 'rgba(248,248,255,0.3)', fontSize: 11, fontFamily: 'Inter' }}>
              📍 {event.location}
            </span>
          </div>

          {upcoming && (event as any).registrationOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              {(event as any).registrationDeadline && (
                <CountdownTimer deadline={(event as any).registrationDeadline} />
              )}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  border: 'none',
                  borderRadius: 10,
                  color: '#fff',
                  fontFamily: 'Outfit',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(124,58,237,0.3)',
                }}
              >
                {(event as any).fee === 0 ? 'Register Free' : `Register — ₹${(event as any).fee}`}
              </motion.button>
            </div>
          )}

          {upcoming && (event as any).maxAttendees && (
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'rgba(248,248,255,0.4)', fontFamily: 'JetBrains Mono' }}>
                  Registration Progress
                </span>
                <span style={{ fontSize: 11, color: '#c4b5fd', fontFamily: 'JetBrains Mono' }}>
                  {event.attendees}/{(event as any).maxAttendees}
                </span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(event.attendees / (event as any).maxAttendees) * 100}%` } : {}}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          )}

          {!upcoming && (
            <div style={{ color: '#a855f7', fontSize: 13, fontFamily: 'Inter' }}>
              ✓ {event.attendees} attended
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Events() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all')

  const filtered = filter === 'all'
    ? events
    : events.filter(e => e.status === filter)

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '60px 24px 80px', maxWidth: 800, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: 'JetBrains Mono', color: '#a855f7', fontSize: 12, letterSpacing: '0.2em', marginBottom: 16, textTransform: 'uppercase' }}
        >
          SoQC — Events
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
          Quantum<br />Events
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ color: 'rgba(248,248,255,0.5)', fontFamily: 'Inter', fontSize: 16, lineHeight: 1.7 }}
        >
          From hands-on workshops to symposiums — we bring quantum computing to life
          through experiences that inspire, educate, and connect.
        </motion.p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 60, padding: '0 24px' }}>
        {(['all', 'upcoming', 'completed'] as const).map(f => (
          <motion.button
            key={f}
            onClick={() => setFilter(f)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '8px 24px',
              borderRadius: 100,
              border: filter === f ? '1px solid rgba(196,181,253,0.4)' : '1px solid rgba(196,181,253,0.1)',
              background: filter === f ? 'rgba(124,58,237,0.2)' : 'transparent',
              color: filter === f ? '#c4b5fd' : 'rgba(248,248,255,0.4)',
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 14,
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s ease',
            }}
          >
            {f}
          </motion.button>
        ))}
      </div>

      {/* Events grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 120px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28 }}
          >
            {filtered.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
