import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { articles as staticArticles } from '../data'

interface ArticleDetailProps {
  articleId?: string | number
  onBack?: () => void
  onSelectArticle?: (id: string | number) => void
}

export default function ArticleDetail({ articleId: propArticleId, onBack, onSelectArticle }: ArticleDetailProps) {
  const { id: urlId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Prioritize prop articleId if passed, otherwise grab from URL params
  const targetId = propArticleId ?? urlId

  // 1. Fetch newly posted articles from localStorage
  const savedArticles = JSON.parse(localStorage.getItem('userArticles') || '[]')

  // 2. Merge user-created articles with static data
  const allArticles = [...savedArticles, ...staticArticles]

  // 3. Find the exact matching article from the combined list
  const article = allArticles.find(a => String(a.id) === String(targetId))

  const [likes, setLikes] = useState(42)
  const [hasLiked, setHasLiked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([
    { id: 1, author: 'Dr. Evelyn Carter', text: 'Excellent overview! The section on decoherence was remarkably clear.', date: '2 days ago' },
    { id: 2, author: 'Alex Rivera', text: 'Looking forward to seeing how this develops over the next few years.', date: '1 day ago' },
  ])

  // Navigation handlers
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate('/articles')
    }
  }

  const handleSelectRelated = (id: string | number) => {
    if (onSelectArticle) {
      onSelectArticle(id)
    } else {
      navigate(`/articles/${id}`)
    }
  }

  // Handle 404 / Missing Article
  if (!article) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 140, textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontFamily: 'Outfit', fontSize: 28 }}>Article Not Found</h2>
        <p style={{ color: 'rgba(248,248,255,0.5)', marginTop: 12, fontFamily: 'Inter' }}>
          The requested article ID ({String(targetId)}) could not be found.
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

  // Get up to 3 related articles from the merged list (excluding current one)
  const relatedArticles = allArticles
    .filter(a => String(a.id) !== String(article.id))
    .slice(0, 3)

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1)
      setHasLiked(false)
    } else {
      setLikes(prev => prev + 1)
      setHasLiked(true)
    }
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setComments(prev => [
      ...prev,
      { id: Date.now(), author: 'You', text: commentText, date: 'Just now' }
    ])
    setCommentText('')
  }

  // Formatting values with fallbacks for newly created articles
  const category = article.category || 'Quantum Research'
  const author = article.author || article.authorName || 'Anonymous'
  const readTime = article.readTime || '3 min read'
  const image = article.image || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200'
  const formattedDate = article.date
    ? isNaN(Date.parse(article.date))
      ? article.date
      : new Date(article.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recently Added'

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 120, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Navigation & Category */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}
        >
          <button
            onClick={handleBack}
            style={{
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(196,181,253,0.2)',
              color: '#c4b5fd',
              borderRadius: 100,
              padding: '8px 18px',
              fontFamily: 'Inter',
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            ← Back to Articles
          </button>
          
          <span style={{
            padding: '4px 14px',
            background: 'rgba(168,85,247,0.15)',
            border: '1px solid rgba(196,181,253,0.2)',
            borderRadius: 100,
            fontSize: 11,
            color: '#c4b5fd',
            fontFamily: 'JetBrains Mono'
          }}>
            {category}
          </span>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 40 }}
        >
          <h1 style={{
            fontFamily: 'Outfit',
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: 24
          }}>
            {article.title}
          </h1>

          {article.excerpt && (
            <p style={{
              fontFamily: 'Inter',
              fontSize: 18,
              lineHeight: 1.6,
              color: 'rgba(248,248,255,0.7)',
              marginBottom: 32
            }}>
              {article.excerpt}
            </p>
          )}

          {/* Author Meta Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 20,
            borderTop: '1px solid rgba(196,181,253,0.1)',
            borderBottom: '1px solid rgba(196,181,253,0.1)',
            paddingBottom: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontFamily: 'Outfit'
              }}>
                {author.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ color: '#fff', fontFamily: 'Inter', fontWeight: 600, fontSize: 14 }}>
                  {author}
                </div>
                <div style={{ color: 'rgba(248,248,255,0.4)', fontFamily: 'Inter', fontSize: 12 }}>
                  {formattedDate}
                </div>
              </div>
            </div>

            <div style={{ color: '#c4b5fd', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
              ⏱️ {readTime}
            </div>
          </div>
        </motion.header>

        {/* Featured Cover Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            height: 420,
            borderRadius: 24,
            overflow: 'hidden',
            marginBottom: 48,
            border: '1px solid rgba(196,181,253,0.15)'
          }}
        >
          <img
            src={image}
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
            fontSize: 17,
            lineHeight: 1.8,
            marginBottom: 60,
            whiteSpace: 'pre-line'
          }}
        >
          {article.content || article.excerpt || 'No content provided.'}
        </motion.main>

        {/* Interactive Action Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          background: 'rgba(124,58,237,0.05)',
          border: '1px solid rgba(196,181,253,0.1)',
          borderRadius: 16,
          marginBottom: 60
        }}>
          <button
            onClick={handleLike}
            style={{
              background: hasLiked ? 'rgba(168,85,247,0.3)' : 'transparent',
              border: '1px solid rgba(196,181,253,0.2)',
              color: hasLiked ? '#fff' : '#c4b5fd',
              padding: '8px 20px',
              borderRadius: 100,
              cursor: 'pointer',
              fontFamily: 'Inter',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease'
            }}
          >
            {hasLiked ? '❤️ Liked' : '🤍 Like'} ({likes})
          </button>

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
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            🔗 Share Article
          </button>
        </div>

        {/* Comments Section */}
        <section style={{ marginBottom: 80 }}>
          <h3 style={{ fontFamily: 'Outfit', color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
            Discussion ({comments.length})
          </h3>

          <form onSubmit={handleAddComment} style={{ marginBottom: 32 }}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Join the conversation..."
              rows={3}
              style={{
                width: '100%',
                padding: 16,
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(196,181,253,0.15)',
                borderRadius: 12,
                color: '#fff',
                fontFamily: 'Inter',
                fontSize: 14,
                outline: 'none',
                resize: 'none',
                marginBottom: 12
              }}
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 8,
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Post Comment
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {comments.map(c => (
              <div key={c.id} style={{
                padding: 16,
                background: 'rgba(124,58,237,0.03)',
                border: '1px solid rgba(196,181,253,0.08)',
                borderRadius: 12
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#c4b5fd', fontFamily: 'Inter', fontWeight: 600, fontSize: 13 }}>{c.author}</span>
                  <span style={{ color: 'rgba(248,248,255,0.3)', fontFamily: 'Inter', fontSize: 11 }}>{c.date}</span>
                </div>
                <p style={{ color: 'rgba(248,248,255,0.7)', fontFamily: 'Inter', fontSize: 14 }}>{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section style={{ borderTop: '1px solid rgba(196,181,253,0.1)', paddingTop: 40 }}>
            <h3 style={{ fontFamily: 'Outfit', color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
              Related Articles
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              {relatedArticles.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => handleSelectRelated(rel.id)}
                  style={{
                    background: 'rgba(124,58,237,0.05)',
                    border: '1px solid rgba(196,181,253,0.08)',
                    borderRadius: 16,
                    padding: 16,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <div style={{ height: 120, borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
                    <img 
                      src={rel.image || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200'} 
                      alt={rel.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <h4 style={{ fontFamily: 'Outfit', color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 8, lineHeight: 1.3 }}>
                    {rel.title}
                  </h4>
                  <span style={{ color: '#a855f7', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
                    {rel.readTime || '3 min read'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}