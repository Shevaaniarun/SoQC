import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { articles } from '../data'

const categories = ['All', 'Quantum News', 'Concept Explanations', 'Interesting Stories', 'Discussions']

function ArticleCard({ article, index, featured = false }: { article: typeof articles[0]; index: number; featured?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [hovered, setHovered] = useState(false)

  if (featured) {
    return (
      <motion.article
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.06)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${hovered ? 'rgba(196,181,253,0.25)' : 'rgba(196,181,253,0.1)'}`,
          borderRadius: 24,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          transition: 'all 0.4s ease',
          boxShadow: hovered ? '0 20px 60px rgba(124,58,237,0.2)' : 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ position: 'relative', minHeight: 360, overflow: 'hidden' }}>
          <img
            src={article.image}
            alt={article.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.6s ease',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(3,3,15,0.8))' }} />
        </div>
        <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 12px', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(196,181,253,0.2)', borderRadius: 100, fontSize: 11, color: '#c4b5fd', fontFamily: 'JetBrains Mono' }}>
              FEATURED
            </span>
            <span style={{ padding: '4px 12px', background: 'rgba(168,85,247,0.1)', borderRadius: 100, fontSize: 11, color: 'rgba(196,181,253,0.7)', fontFamily: 'JetBrains Mono' }}>
              {article.category}
            </span>
          </div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 16, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            {article.title}
          </h2>
          <p style={{ color: 'rgba(248,248,255,0.55)', fontSize: 15, fontFamily: 'Inter', lineHeight: 1.8, marginBottom: 24 }}>
            {article.excerpt}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(248,248,255,0.4)' }}>
              By {article.author} · {new Date(article.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <span style={{ color: '#c4b5fd', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{article.readTime}</span>
          </div>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.05)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${hovered ? 'rgba(196,181,253,0.2)' : 'rgba(196,181,253,0.08)'}`,
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: hovered ? '0 10px 40px rgba(124,58,237,0.15)' : 'none',
        transform: hovered ? 'translateY(-4px)' : 'none',
      }}
    >
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <img
          src={article.image}
          alt={article.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(3,3,15,0.8))' }} />
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          padding: '3px 10px',
          background: 'rgba(0,0,0,0.6)',
          borderRadius: 100,
          fontSize: 10,
          color: '#c4b5fd',
          fontFamily: 'JetBrains Mono',
          backdropFilter: 'blur(8px)',
        }}>
          {article.category}
        </div>
      </div>
      <div style={{ padding: '20px 22px' }}>
        <h3 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 10, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
          {article.title}
        </h3>
        <p style={{ color: 'rgba(248,248,255,0.45)', fontSize: 13, fontFamily: 'Inter', lineHeight: 1.7, marginBottom: 16 }}>
          {article.excerpt.slice(0, 90)}...
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'rgba(248,248,255,0.3)', fontSize: 11, fontFamily: 'Inter' }}>
            {article.author} · {new Date(article.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </span>
          <span style={{ color: '#a855f7', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{article.readTime}</span>
        </div>
      </div>
    </motion.article>
  )
}

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '60px 24px 64px', maxWidth: 700, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'JetBrains Mono', color: '#a855f7', fontSize: 12, letterSpacing: '0.2em', marginBottom: 16, textTransform: 'uppercase' }}
        >
          SoQC — Knowledge Base
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
          Quantum<br />Articles
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: 'rgba(248,248,255,0.5)', fontFamily: 'Inter', fontSize: 16, lineHeight: 1.7 }}
        >
          Explore the frontier of quantum science through our curated articles,
          explainers, discussions, and news from the quantum world.
        </motion.p>
      </div>

      {/* Category pills */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '7px 20px',
                borderRadius: 100,
                border: activeCategory === cat ? '1px solid rgba(196,181,253,0.4)' : '1px solid rgba(196,181,253,0.1)',
                background: activeCategory === cat ? 'rgba(124,58,237,0.2)' : 'transparent',
                color: activeCategory === cat ? '#c4b5fd' : 'rgba(248,248,255,0.4)',
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 120px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Featured article */}
            {activeCategory === 'All' && filtered.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <ArticleCard article={filtered[0]} index={0} featured />
              </div>
            )}

            {/* Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}>
              {(activeCategory === 'All' ? filtered.slice(1) : filtered).map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
