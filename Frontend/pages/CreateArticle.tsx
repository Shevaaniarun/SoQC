import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const categories = ['Quantum News', 'Concept Explanations', 'Interesting Stories', 'Discussions']

interface CreateArticleProps {
  onArticleCreated?: (newArticle: any) => void
  onCancel?: () => void
}

export default function CreateArticle({ onArticleCreated, onCancel }: CreateArticleProps) {
  const navigate = useNavigate()

  // Form State
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate read time based on word count (~200 wpm)
  const calculateReadTime = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length
    const minutes = Math.ceil(words / 200) || 1
    return `${minutes} min read`
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate('/articles')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !author.trim()) {
      alert('Please fill out all required fields!')
      return
    }

    setIsSubmitting(true)

    const newArticle = {
      id: Date.now(),
      title,
      category,
      excerpt: excerpt || content.slice(0, 120) + '...',
      content,
      author,
      date: new Date().toISOString().split('T')[0],
      readTime: calculateReadTime(content),
      image: imageUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800'
    }

    // Simulate delay, update global state, and navigate
    setTimeout(() => {
      setIsSubmitting(false)
      if (onArticleCreated) {
        onArticleCreated(newArticle)
      }
      navigate('/articles')
    }, 600)
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 120, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Top Header & Back Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <button
            type="button"
            onClick={handleCancel}
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
            ← Cancel
          </button>
          <span style={{ fontFamily: 'JetBrains Mono', color: '#a855f7', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Publishing Portal
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(124,58,237,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(196,181,253,0.12)',
            borderRadius: 24,
            padding: '40px 36px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
          }}
        >
          <h1 style={{
            fontFamily: 'Outfit',
            fontSize: 32,
            fontWeight: 800,
            color: '#fff',
            marginBottom: 8
          }}>
            Create New Article
          </h1>
          <p style={{ color: 'rgba(248,248,255,0.5)', fontFamily: 'Inter', fontSize: 14, marginBottom: 36 }}>
            Share your research, concepts, or insights with the quantum community.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Title */}
            <div>
              <label style={labelStyle}>Article Title *</label>
              <input
                type="text"
                required
                placeholder="e.g., Quantum Entanglement in Nanowires"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Author & Category Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <div>
                <label style={labelStyle}>Author Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Alex Chen"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} style={{ background: '#0a0a16', color: '#fff' }}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image URL & Live Preview */}
            <div>
              <label style={labelStyle}>Cover Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={inputStyle}
              />
              {imageUrl && (
                <div style={{ marginTop: 12, height: 160, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(196,181,253,0.2)' }}>
                  <img src={imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            {/* Short Excerpt */}
            <div>
              <label style={labelStyle}>Short Summary / Excerpt</label>
              <textarea
                rows={2}
                placeholder="Brief 1-2 sentence overview shown on article cards..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            {/* Main Article Body */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Article Content *</label>
                <span style={{ fontSize: 11, color: '#c4b5fd', fontFamily: 'JetBrains Mono' }}>
                  {calculateReadTime(content)}
                </span>
              </div>
              <textarea
                required
                rows={12}
                placeholder="Write your article content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
              />
            </div>

            {/* Submit Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 12 }}>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(196,181,253,0.2)',
                  color: 'rgba(248,248,255,0.6)',
                  padding: '12px 28px',
                  borderRadius: 10,
                  fontFamily: 'Inter',
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Discard
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: 10,
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Article'}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  )
}

// Reusable Inline Styles
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#c4b5fd',
  fontFamily: 'Inter',
  marginBottom: 8
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(0,0,0,0.4)',
  border: '1px solid rgba(196,181,253,0.15)',
  borderRadius: 10,
  color: '#fff',
  fontFamily: 'Inter',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box'
}