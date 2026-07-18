import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import CustomCursor from '../components/CustomCursor'
import QuantumBackground from '../components/QuantumBackground'
import Navigation from '../components/Navigation'

const Home = lazy(() => import('../pages/Home'))
const Events = lazy(() => import('../pages/Events'))
const Articles = lazy(() => import('../pages/Articles'))
const Projects = lazy(() => import('../pages/Projects'))
const Committee = lazy(() => import('../pages/Committee'))
const LogoExplain = lazy(() => import('../pages/LogoExplain'))

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        style={{
          width: 48,
          height: 48,
          border: '2px solid rgba(196,181,253,0.15)',
          borderTop: '2px solid #a855f7',
          borderRadius: '50%',
        }}
      />
    </div>
  )
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}><Home /></Suspense>
          </PageTransition>
        } />
        <Route path="/events" element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}><Events /></Suspense>
          </PageTransition>
        } />
        <Route path="/articles" element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}><Articles /></Suspense>
          </PageTransition>
        } />
        <Route path="/projects" element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}><Projects /></Suspense>
          </PageTransition>
        } />
        <Route path="/committee" element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}><Committee /></Suspense>
          </PageTransition>
        } />
        <Route path="/logo" element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}><LogoExplain /></Suspense>
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#03030f', position: 'relative' }}>
        {/* Persistent canvas background */}
        <QuantumBackground />

        {/* Custom cursor (desktop only) */}
        <CustomCursor />

        {/* Noise texture overlay */}
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.025,
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        {/* Aurora blobs */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '60vw',
            height: '60vw',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)',
            animation: 'aurora 20s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '50vw',
            height: '50vw',
            background: 'radial-gradient(ellipse, rgba(217,70,239,0.06) 0%, transparent 70%)',
            animation: 'aurora 25s ease-in-out infinite reverse',
          }} />
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Main content */}
        <main style={{ position: 'relative', zIndex: 1 }}>
          <AnimatedRoutes />
        </main>

        {/* Footer */}
        <footer style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid rgba(196,181,253,0.06)',
          padding: '40px 24px',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28,
                height: 28,
                background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                color: '#fff',
                fontFamily: 'JetBrains Mono',
                boxShadow: '0 0 10px rgba(124,58,237,0.4)',
              }}>ψ</div>
              <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, color: '#c4b5fd' }}>SoQC</span>
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(248,248,255,0.25)', letterSpacing: '0.02em' }}>
              Society of Quantum Computing · {new Date().getFullYear()}
            </p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'rgba(248,248,255,0.2)', letterSpacing: '0.1em' }}>
              |ψ⟩ = α|0⟩ + β|1⟩
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
