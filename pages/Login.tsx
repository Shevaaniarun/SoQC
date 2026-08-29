import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface LoginProps {
  onLogin: (userData: { name: string; role: 'user' | 'admin' }) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nameToUse = username.trim() || (role === 'admin' ? 'Admin User' : 'Member Author')
    const userData = {
      name: nameToUse,
      role: role,
    }

    // Save session locally so role persists across page refreshes
    localStorage.setItem('soqc_user', JSON.stringify(userData))
    
    // Update global state in App.tsx
    onLogin(userData)

    // Route based on typical workflow
    navigate('/articles')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'Outfit, sans-serif',
        padding: '20px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'rgba(15, 15, 35, 0.85)',
          padding: '40px',
          borderRadius: '20px',
          border: '1px solid rgba(196, 181, 253, 0.2)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
          maxWidth: '360px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 6px 0', color: '#c4b5fd', fontSize: '24px', fontWeight: 800 }}>
            Sign In
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(248, 248, 255, 0.5)', fontFamily: 'Inter' }}>
            Select your portal identity to proceed
          </p>
        </div>

        {/* Display Name Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', color: '#a78bfa', fontFamily: 'Inter', fontWeight: 500 }}>
            Display Name (Optional)
          </label>
          <input
            type="text"
            placeholder={role === 'admin' ? 'e.g. Admin Alex' : 'e.g. Author Sarah'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: '10px',
              background: '#07071a',
              color: '#fff',
              border: '1px solid rgba(196, 181, 253, 0.25)',
              outline: 'none',
              fontFamily: 'Inter',
              fontSize: '14px',
            }}
          />
        </div>

        {/* Role Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', color: '#a78bfa', fontFamily: 'Inter', fontWeight: 500 }}>
            Select Account Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
            style={{
              padding: '12px',
              borderRadius: '10px',
              background: '#07071a',
              color: '#fff',
              border: '1px solid rgba(196, 181, 253, 0.25)',
              outline: 'none',
              fontFamily: 'Inter',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="user">User / Author (Requires Approval)</option>
            <option value="admin">Admin (Direct Publishing & Approval Queue)</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: '14px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            marginTop: '10px',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
            transition: 'opacity 0.2s ease',
          }}
        >
          Continue
        </button>
      </form>
    </div>
  )
}