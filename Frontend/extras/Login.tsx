import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (userData: { name: string; role: 'user' | 'admin' }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    onLogin({ name: role === 'admin' ? 'Admin User' : 'Member', role });
    navigate('/articles/new');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'rgba(15, 15, 35, 0.8)',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid rgba(196, 181, 253, 0.2)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '320px',
        }}
      >
        <h2 style={{ margin: 0, textAlign: 'center', color: '#c4b5fd' }}>Sign In</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', color: '#a78bfa' }}>Select Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
            style={{
              padding: '10px',
              borderRadius: '8px',
              background: '#07071a',
              color: '#fff',
              border: '1px solid rgba(196, 181, 253, 0.3)',
            }}
          >
            <option value="user">User / Author</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: '12px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
            color: '#fff',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Continue
        </button>
      </form>
    </div>
  );
}