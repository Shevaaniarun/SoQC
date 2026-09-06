import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { articles } from '../data/articles/articles'

interface ArticleDetailProps {
  onBack?: () => void
  isMobile?: boolean
}

export default function ArticleDetail({ onBack, isMobile }: ArticleDetailProps) {
  const { id: urlId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Reset scroll position to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [urlId]) // Also reset when article ID changes

  // Find the exact matching article
  const article = articles.find(a => String(a.id) === String(urlId))

  // Navigation handlers
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate('/articles')
    }
  }

  // Handle 404 / Missing Article
  if (!article) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        paddingTop: isMobile ? 100 : 140, 
        textAlign: 'center', 
        color: '#fff',
        paddingLeft: 20,
        paddingRight: 20
      }}>
        <h2 style={{ fontFamily: 'Outfit', fontSize: isMobile ? 24 : 28 }}>Article Not Found</h2>
        <p style={{ color: 'rgba(248,248,255,0.5)', marginTop: 12, fontFamily: 'Inter' }}>
          The requested article could not be found.
        </p>
        <button
          onClick={handleBack}
          style={{
            marginTop: 24,
            padding: '10px 24px',
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid rgba(196,181,253,0.3)',
            borderRadius: 100,
            color: '#c4b5fd',
            fontFamily: 'Inter',
            cursor: 'pointer',
          }}
        >
          ← Back to Articles
        </button>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      paddingTop: isMobile ? 80 : 100, 
      paddingBottom: isMobile ? 60 : 120, 
      position: 'relative', 
      zIndex: 1 
    }}>
      <div style={{ maxWidth: 840, margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px' }}>
        
        {/* Navigation & Category */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: isMobile ? 24 : 32,
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <button
            onClick={handleBack}
            style={{
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(196,181,253,0.2)',
              color: '#c4b5fd',
              borderRadius: 100,
              padding: isMobile ? '6px 14px' : '8px 18px',
              fontFamily: 'Inter',
              fontSize: isMobile ? 12 : 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            ← Back
          </button>
          
          <span style={{
            padding: '4px 14px',
            background: 'rgba(168,85,247,0.15)',
            border: '1px solid rgba(196,181,253,0.2)',
            borderRadius: 100,
            fontSize: isMobile ? 10 : 11,
            color: '#c4b5fd',
            fontFamily: 'JetBrains Mono'
          }}>
            {article.category}
          </span>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: isMobile ? 28 : 40 }}
        >
          <h1 style={{
            fontFamily: 'Outfit',
            fontSize: isMobile ? 'clamp(28px, 6vw, 40px)' : 'clamp(32px, 5vw, 52px)',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: isMobile ? 16 : 24
          }}>
            {article.title}
          </h1>

          <p style={{
            fontFamily: 'Inter',
            fontSize: isMobile ? 15 : 18,
            lineHeight: 1.6,
            color: 'rgba(248,248,255,0.7)',
            marginBottom: isMobile ? 24 : 32
          }}>
            {article.excerpt}
          </p>

          {/* Author Meta Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: isMobile ? 16 : 20,
            borderTop: '1px solid rgba(196,181,253,0.1)',
            borderBottom: '1px solid rgba(196,181,253,0.1)',
            paddingBottom: isMobile ? 16 : 20,
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: isMobile ? 36 : 44,
                height: isMobile ? 36 : 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontFamily: 'Outfit',
                fontSize: isMobile ? 14 : 18
              }}>
                {article.author ? article.author.charAt(0) : 'A'}
              </div>
              <div>
                <div style={{ color: '#fff', fontFamily: 'Inter', fontWeight: 600, fontSize: isMobile ? 13 : 14 }}>
                  {article.author}
                </div>
                <div style={{ color: 'rgba(248,248,255,0.4)', fontFamily: 'Inter', fontSize: isMobile ? 11 : 12 }}>
                  {new Date(article.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div style={{ color: '#c4b5fd', fontFamily: 'JetBrains Mono', fontSize: isMobile ? 11 : 12 }}>
              ⏱️ {article.readTime}
            </div>
          </div>
        </motion.header>

        {/* Featured Cover Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            height: isMobile ? 220 : 420,
            borderRadius: isMobile ? 16 : 24,
            overflow: 'hidden',
            marginBottom: isMobile ? 32 : 48,
            border: '1px solid rgba(196,181,253,0.15)'
          }}
        >
          <img
            src={article.image}
            alt={article.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </motion.div>

        {/* Dynamic Article Content Body */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            color: 'rgba(248,248,255,0.85)',
            fontFamily: 'Inter',
            fontSize: isMobile ? 15 : 17,
            lineHeight: 1.8,
            marginBottom: isMobile ? 40 : 60,
            whiteSpace: 'pre-line'
          }}
        >
          {article.excerpt || (
            <>
              <p style={{ marginBottom: 24 }}>{article.excerpt}</p>
              <p>Explore more about {article.title} and its implications in the quantum computing landscape.</p>
            </>
          )}
        </motion.main>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ 
              fontFamily: 'Inter', 
              fontSize: 12, 
              color: 'rgba(248,248,255,0.4)',
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Tags
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {article.tags.map((tag: string) => (
                <span
                  key={tag}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 100,
                    background: 'rgba(124,58,237,0.1)',
                    border: '1px solid rgba(196,181,253,0.1)',
                    color: 'rgba(196,181,253,0.7)',
                    fontFamily: 'JetBrains Mono',
                    fontSize: 11,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px 24px',
          background: 'rgba(124,58,237,0.05)',
          border: '1px solid rgba(196,181,253,0.1)',
          borderRadius: 16,
          marginBottom: 60
        }}>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              alert('Article link copied to clipboard!')
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(248,248,255,0.6)',
              cursor: 'pointer',
              fontFamily: 'Inter',
              fontSize: isMobile ? 13 : 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            🔗 Share Article
          </button>
        </div>
      </div>
    </div>
  )
}