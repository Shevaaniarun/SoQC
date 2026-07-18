import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { projects } from '../data'

function ArchitectureFlow({ nodes }: { nodes: string[] }) {
  return (
    <div style={{ padding: '20px 0', overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, minWidth: 'max-content' }}>
        {nodes.map((node, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}
              style={{
                padding: '8px 16px',
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(196,181,253,0.25)',
                borderRadius: 10,
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
                color: '#c4b5fd',
                whiteSpace: 'nowrap',
                cursor: 'default',
                transition: 'all 0.2s ease',
              }}
            >
              {node}
            </motion.div>
            {i < nodes.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}
              >
                <div style={{
                  width: 24,
                  height: 1,
                  background: 'linear-gradient(90deg, rgba(124,58,237,0.6), rgba(168,85,247,0.6))',
                  position: 'relative',
                }}>
                  {/* Animated particle */}
                  <motion.div
                    animate={{ x: [0, 24, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                    style={{
                      position: 'absolute',
                      top: -2,
                      left: 0,
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: '#c4b5fd',
                      boxShadow: '0 0 6px #c4b5fd',
                    }}
                  />
                </div>
                <span style={{ color: 'rgba(196,181,253,0.5)', fontSize: 10 }}>▶</span>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [expanded, setExpanded] = useState(false)

  const typeColor = project.type === 'Working' ? '#22d3ee' : project.type === 'Research' ? '#a855f7' : '#c4b5fd'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'rgba(124,58,237,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(196,181,253,0.1)',
        borderRadius: 24,
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Image header */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(3,3,15,0.9))' }} />
        <div style={{
          position: 'absolute',
          top: 16,
          left: 16,
          display: 'flex',
          gap: 8,
        }}>
          <span style={{
            padding: '4px 12px',
            background: `${typeColor}22`,
            border: `1px solid ${typeColor}44`,
            borderRadius: 100,
            fontSize: 11,
            color: typeColor,
            fontFamily: 'JetBrains Mono',
          }}>{project.type}</span>
          <span style={{
            padding: '4px 12px',
            background: project.status === 'Active' ? 'rgba(34,197,94,0.15)' : project.status === 'Ongoing' ? 'rgba(234,179,8,0.15)' : 'rgba(168,85,247,0.15)',
            border: `1px solid ${project.status === 'Active' ? 'rgba(34,197,94,0.3)' : project.status === 'Ongoing' ? 'rgba(234,179,8,0.3)' : 'rgba(168,85,247,0.3)'}`,
            borderRadius: 100,
            fontSize: 11,
            color: project.status === 'Active' ? '#4ade80' : project.status === 'Ongoing' ? '#fde047' : '#c4b5fd',
            fontFamily: 'JetBrains Mono',
          }}>
            {project.status === 'Active' ? '● ' : project.status === 'Ongoing' ? '◉ ' : '✓ '}{project.status}
          </span>
        </div>
      </div>

      <div style={{ padding: '28px 32px' }}>
        <h3 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
          {project.title}
        </h3>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              padding: '3px 10px',
              background: 'rgba(124,58,237,0.15)',
              borderRadius: 100,
              fontSize: 11,
              color: 'rgba(196,181,253,0.7)',
              fontFamily: 'JetBrains Mono',
            }}>{tag}</span>
          ))}
        </div>

        {/* Problem / Solution */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {[['Problem', project.problem, '#ef4444'], ['Solution', project.solution, '#22d3ee']].map(([label, text, color]) => (
            <div key={label as string} style={{
              padding: '16px',
              background: `${color}08`,
              border: `1px solid ${color}22`,
              borderRadius: 12,
            }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: color as string, marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {label}
              </div>
              <p style={{ color: 'rgba(248,248,255,0.6)', fontSize: 12, fontFamily: 'Inter', lineHeight: 1.7 }}>
                {(text as string).slice(0, 100)}...
              </p>
            </div>
          ))}
        </div>

        {/* Novelty */}
        <div style={{
          padding: '16px',
          background: 'rgba(217,70,239,0.06)',
          border: '1px solid rgba(217,70,239,0.15)',
          borderRadius: 12,
          marginBottom: 20,
        }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#d946ef', marginBottom: 8, letterSpacing: '0.1em' }}>✦ NOVELTY</div>
          <p style={{ color: 'rgba(248,248,255,0.7)', fontSize: 13, fontFamily: 'Inter', lineHeight: 1.7 }}>{project.novelty}</p>
        </div>

        {/* Architecture */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(248,248,255,0.3)', marginBottom: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Architecture Flow
          </div>
          <ArchitectureFlow nodes={project.architecture} />
        </div>

        {/* Team & Guide */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(248,248,255,0.3)', marginBottom: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Team</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {project.team.map(m => (
                <span key={m} style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(248,248,255,0.6)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 6 }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'rgba(248,248,255,0.3)', marginBottom: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Guide</div>
            <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#c4b5fd' }}>{project.guide}</span>
          </div>
        </div>

        {/* GitHub link */}
        <motion.a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(196,181,253,0.2)',
            borderRadius: 10,
            color: '#c4b5fd',
            fontFamily: 'JetBrains Mono',
            fontSize: 13,
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          View on GitHub
        </motion.a>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [tab, setTab] = useState<'all' | 'Working' | 'Research'>('all')

  const filtered = tab === 'all' ? projects : projects.filter(p => p.type === tab)

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '60px 24px 64px', maxWidth: 800, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'JetBrains Mono', color: '#a855f7', fontSize: 12, letterSpacing: '0.2em', marginBottom: 16, textTransform: 'uppercase' }}
        >
          SoQC — Research & Projects
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
          Projects &<br />Research
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: 'rgba(248,248,255,0.5)', fontFamily: 'Inter', fontSize: 16, lineHeight: 1.7 }}
        >
          From theoretical research to working quantum systems — our projects push
          the boundaries of what's possible with today's quantum hardware.
        </motion.p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 60, padding: '0 24px' }}>
        {(['all', 'Working', 'Research'] as const).map(t => (
          <motion.button
            key={t}
            onClick={() => setTab(t)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '8px 24px',
              borderRadius: 100,
              border: tab === t ? '1px solid rgba(196,181,253,0.4)' : '1px solid rgba(196,181,253,0.1)',
              background: tab === t ? 'rgba(124,58,237,0.2)' : 'transparent',
              color: tab === t ? '#c4b5fd' : 'rgba(248,248,255,0.4)',
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 14,
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s ease',
            }}
          >
            {t === 'all' ? 'All Projects' : t}
          </motion.button>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 120px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 28 }}
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
