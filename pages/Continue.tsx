import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface ContinueProps {
  onLogin: (userData: { name: string; role: 'user' | 'admin' }) => void
}

export default function Continue({ onLogin }: ContinueProps) {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [adminId, setAdminId] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  const handleRoleChange = (newRole: 'user' | 'admin') => {
    setRole(newRole)
    if (newRole === 'user') {
      setAdminId('')
      setAdminPassword('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Please enter your display name.')
      return
    }

    if (role === 'admin') {
      if (!adminId.trim() || !adminPassword.trim()) {
        toast.error('Please enter Admin ID and Password.')
        return
      }

      if (adminId !== 'admin' || adminPassword !== 'admin123') {
        toast.error('Invalid Admin credentials!')
        return
      }
    }

    onLogin({ name: name.trim(), role })
    navigate('/articles/new')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(7, 7, 26, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(196, 181, 253, 0.2)',
          borderRadius: 24,
          padding: '36px 28px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            background: 'transparent',
            border: 'none',
            color: '#c4b5fd',
            fontFamily: 'Inter',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: 0,
            opacity: 0.8,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
        >
          ← Back
        </button>

        <h2 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: '#fff', textAlign: 'center', marginTop: 12, marginBottom: 8 }}>
          Continue As...
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(248, 248, 255, 0.5)', textAlign: 'center', marginBottom: 28 }}>
          Choose a role to post your quantum article
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={labelStyle}>Your Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Alex Chen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Select Role</label>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value as 'user' | 'admin')}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="user" style={optionStyle}>User / Author</option>
              <option value="admin" style={optionStyle}>Admin</option>
            </select>
          </div>

          <AnimatePresence>
            {role === 'admin' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}
              >
                <div>
                  <label style={labelStyle}>Admin ID</label>
                  <input
                    type="text"
                    required={role === 'admin'}
                    placeholder="Enter Admin ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Admin Password</label>
                  <input
                    type="password"
                    required={role === 'admin'}
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            style={{
              marginTop: 10,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: '#fff',
              border: 'none',
              padding: '12px',
              borderRadius: 12,
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
            }}
          >
            Proceed to Article Editor →
          </button>
        </form>
      </motion.div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#c4b5fd',
  fontFamily: 'Inter',
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(0, 0, 0, 0.4)',
  border: '1px solid rgba(196, 181, 253, 0.2)',
  borderRadius: 10,
  color: '#fff',
  fontFamily: 'Inter',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
}

const optionStyle: React.CSSProperties = {
  background: '#0a0a16',
  color: '#fff',
}