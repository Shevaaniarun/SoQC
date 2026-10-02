import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { path: '/', label: 'Home', symbol: '⌂' },
  { path: '/events', label: 'Events', symbol: '◈' },
  { path: '/articles', label: 'Articles', symbol: '∂' },
  { path: '/projects', label: 'Projects', symbol: '⬡' },
  { path: '/committee', label: 'Committee', symbol: '◉' },
  { path: '/logo', label: 'Logo', symbol: '∞' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{
          position: 'fixed',
          top: 20,
          left: '25%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: 'min(900px, calc(100vw - 40px))',
        }}
      >
        <div
          style={{
            background: scrolled
              ? 'rgba(7,7,26,0.85)'
              : 'rgba(7,7,26,0.4)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(196,181,253,0.12)',
            borderRadius: 16,
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'background 0.3s ease',
            boxShadow: scrolled
              ? '0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(124,58,237,0.08)'
              : 'none',
          }}
        >
          {/* Logo */}
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <div style={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(124,58,237,0.5)',
                fontSize: 14,
                color: '#fff',
                fontFamily: 'JetBrains Mono',
              }}>ψ</div>
              <span style={{
                fontFamily: 'Outfit',
                fontWeight: 700,
                fontSize: 18,
                background: 'linear-gradient(135deg, #c4b5fd, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}>SoQC</span>
            </motion.div>
          </NavLink>

          {/* Desktop nav */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}
            className="hidden-mobile">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                style={{ textDecoration: 'none' }}
              >
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 10,
                      fontFamily: 'Inter',
                      fontSize: 13,
                      fontWeight: 500,
                      color: isActive ? '#c4b5fd' : 'rgba(248,248,255,0.6)',
                      background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                      border: isActive ? '1px solid rgba(196,181,253,0.2)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {item.label}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </div>

          {/* CTA */}
          <motion.a
            href="https://chat.whatsapp.com/"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,58,237,0.6)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: '0 0 20px rgba(124,58,237,0.3)',
            }}
            className="hidden-mobile"
          >
            Join Community
          </motion.a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'none',
              flexDirection: 'column',
              gap: 5,
            }}
            className="show-mobile"
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{
                  rotate: menuOpen && i === 0 ? 45 : menuOpen && i === 2 ? -45 : 0,
                  y: menuOpen && i === 0 ? 7 : menuOpen && i === 2 ? -7 : 0,
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
                style={{ width: 22, height: 2, background: '#c4b5fd', borderRadius: 1 }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 90,
              left: 20,
              right: 20,
              zIndex: 999,
              background: 'rgba(7,7,26,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(196,181,253,0.12)',
              borderRadius: 16,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {navItems.map(item => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    color: isActive ? '#c4b5fd' : 'rgba(248,248,255,0.7)',
                    background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                    fontFamily: 'Inter',
                    fontSize: 15,
                    fontWeight: 500,
                  }}>
                    <span style={{ marginRight: 12, opacity: 0.5 }}>{item.symbol}</span>
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
