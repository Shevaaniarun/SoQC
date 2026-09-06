import { useState, useRef, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { articles as staticArticles } from '../data/articles/articles'
import { SearchIcon } from 'lucide-react'

// Dynamically extract unique categories from articles
const getUniqueCategories = () => {
  const categories = staticArticles.map(a => a.category)
  return ['All', ...new Set(categories)]
}

type SortOption = 'latest' | 'oldest'

export interface Article {
  id: string | number
  title: string
  excerpt: string
  image: string
  category: string
  author: string
  date: string
  readTime: string
  tags?: string[]
  content?: string
  status?: 'approved' | 'pending'
}

interface ArticlesProps {
  articlesData?: Article[]
  onSelectArticle?: (id: string | number) => void
  user?: { name: string; role: 'user' | 'admin' } | null
  onApproveArticle?: (id: string | number) => void
  onRejectArticle?: (id: string | number) => void
  isMobile?: boolean
}

function ArticleCard({ 
  article, 
  index, 
  featured = false,
  onClick 
}: { 
  article: Article; 
  index: number; 
  featured?: boolean;
  onClick?: () => void;
}) {
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
        onClick={onClick}
        style={{
          background: hovered ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.06)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${hovered ? 'rgba(196,181,253,0.25)' : 'rgba(196,181,253,0.1)'}`,
          borderRadius: 24,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          transition: 'all 0.4s ease',
          boxShadow: hovered ? '0 20px 60px rgba(124,58,237,0.2)' : 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ position: 'relative', minHeight: 280, overflow: 'hidden' }}>
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
        <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 12px', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(196,181,253,0.2)', borderRadius: 100, fontSize: 11, color: '#c4b5fd', fontFamily: 'JetBrains Mono' }}>
              FEATURED
            </span>
            <span style={{ padding: '4px 12px', background: 'rgba(168,85,247,0.1)', borderRadius: 100, fontSize: 11, color: 'rgba(196,181,253,0.7)', fontFamily: 'JetBrains Mono' }}>
              {article.category}
            </span>
          </div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            {article.title}
          </h2>
          <p style={{ color: 'rgba(248,248,255,0.55)', fontSize: 14, fontFamily: 'Inter', lineHeight: 1.8, marginBottom: 20 }}>
            {article.excerpt}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
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
      onClick={onClick}
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
          {article.excerpt.length > 90 ? article.excerpt.slice(0, 90) + '...' : article.excerpt}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ color: 'rgba(248,248,255,0.3)', fontSize: 11, fontFamily: 'Inter' }}>
            {article.author} · {new Date(article.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </span>
          <span style={{ color: '#a855f7', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{article.readTime}</span>
        </div>
      </div>
    </motion.article>
  )
}

export default function Articles({ 
  articlesData, 
  onSelectArticle,
  isMobile
}: ArticlesProps) {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('latest')

  const displayArticles = articlesData || staticArticles
  const categories = getUniqueCategories()

  const handleArticleClick = (id: string | number) => {
    if (onSelectArticle) {
      onSelectArticle(id)
    } else {
      navigate(`/articles/${id}`)
    }
  }

  // Filter and Sort Logic
  const filteredAndSorted = useMemo(() => {
    return displayArticles
      .filter(article => {
        const matchesCategory = activeCategory === 'All' || article.category === activeCategory
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortBy === 'latest' ? dateB - dateA : dateA - dateB
      })
  }, [displayArticles, activeCategory, searchQuery, sortBy])

  const showFeatured = activeCategory === 'All' && searchQuery.trim() === '' && filteredAndSorted.length > 0

  return (
    <div style={{ minHeight: '100vh', paddingTop: isMobile ? 80 : 100, position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: isMobile ? '20px 16px 24px' : '40px 24px 32px', maxWidth: 700, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'JetBrains Mono', color: '#a855f7', fontSize: isMobile ? 10 : 12, letterSpacing: '0.2em', marginBottom: 12, textTransform: 'uppercase' }}
        >
          SoQC — Knowledge Base
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          style={{
            fontFamily: 'Outfit',
            fontSize: isMobile ? 'clamp(32px, 10vw, 48px)' : 'clamp(40px, 7vw, 72px)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ffffff, #c4b5fd 40%, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            marginBottom: isMobile ? 12 : 20,
          }}
        >
          Quantum<br />Articles
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: 'rgba(248,248,255,0.5)', fontFamily: 'Inter', fontSize: isMobile ? 14 : 16, lineHeight: 1.7, marginBottom: isMobile ? 20 : 28 }}
        >
          Explore the frontier of quantum science through our curated articles,
          explainers, discussions, and news from the quantum world.
        </motion.p>
      </div>

      {/* Controls Container: Search & Sort */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 12px 20px' : '0 24px 24px' }}>
        <div style={{
          display: 'flex',
          gap: isMobile ? 12 : 16,
          flexWrap: 'wrap',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(124,58,237,0.03)',
          border: '1px solid rgba(196,181,253,0.1)',
          borderRadius: 16,
          padding: isMobile ? '12px 16px' : '12px 20px',
          backdropFilter: 'blur(12px)'
        }}>
          {/* Search Bar Input */}
          <div style={{ flex: '1 1 280px', width: '100%', display: 'flex', alignItems: 'center', gap: 10 }}>
            <SearchIcon style={{ width: isMobile ? 14 : 16, height: isMobile ? 14 : 16, color: 'rgba(196,181,253,0.5)' }} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontFamily: 'Inter',
                fontSize: isMobile ? 13 : 14,
              }}
            />
          </div>

          {/* Sort Selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: isMobile ? '100%' : 'auto' }}>
            <span style={{ fontSize: isMobile ? 11 : 12, color: 'rgba(248,248,255,0.4)', fontFamily: 'Inter' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(196,181,253,0.2)',
                borderRadius: 8,
                color: '#c4b5fd',
                padding: '6px 12px',
                fontSize: isMobile ? 11 : 12,
                fontFamily: 'JetBrains Mono',
                outline: 'none',
                cursor: 'pointer',
                flex: isMobile ? 1 : 'none',
              }}
            >
              <option value="latest" style={{ background: '#0a0a16', color: '#fff' }}>Latest First</option>
              <option value="oldest" style={{ background: '#0a0a16', color: '#fff' }}>Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 12px 28px' : '0 24px 40px' }}>
        <div style={{ display: 'flex', gap: isMobile ? 6 : 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: isMobile ? '5px 14px' : '7px 20px',
                borderRadius: 100,
                border: activeCategory === cat ? '1px solid rgba(196,181,253,0.4)' : '1px solid rgba(196,181,253,0.1)',
                background: activeCategory === cat ? 'rgba(124,58,237,0.2)' : 'transparent',
                color: activeCategory === cat ? '#c4b5fd' : 'rgba(248,248,255,0.4)',
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: isMobile ? 11 : 13,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 12px 80px' : '0 24px 120px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeCategory + searchQuery + sortBy} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Empty State */}
            {filteredAndSorted.length === 0 && (
              <div style={{ textAlign: 'center', padding: isMobile ? '40px 16px' : '80px 20px', color: 'rgba(248,248,255,0.4)', fontFamily: 'Inter' }}>
                <p style={{ fontSize: isMobile ? 16 : 18, marginBottom: 8 }}>No articles found</p>
                <p style={{ fontSize: isMobile ? 12 : 13 }}>Try adjusting your search or category filter.</p>
              </div>
            )}

            {/* Featured Article */}
            {showFeatured && (
              <div style={{ marginBottom: isMobile ? 28 : 40 }}>
                <ArticleCard 
                  article={filteredAndSorted[0]} 
                  index={0} 
                  featured 
                  onClick={() => handleArticleClick(filteredAndSorted[0].id)}
                />
              </div>
            )}

            {/* Grid */}
            {filteredAndSorted.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: isMobile ? 16 : 24,
              }}>
                {(showFeatured ? filteredAndSorted.slice(1) : filteredAndSorted).map((article, i) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    index={i} 
                    onClick={() => handleArticleClick(article.id)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}