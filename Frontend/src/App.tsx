import { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import CustomCursor from '../components/CustomCursor'
import QuantumBackground from '../components/QuantumBackground'
import Navigation from '../components/Navigation'
import Login from '../extras/Login'
import LiquidEther from '../components/LiquidEther';

// 1. IMPORT INITIAL ARTICLES DATA
import { articles as initialArticles } from '../data/articles/articles'

const Home = lazy(() => import('../pages/Home'))
const Events = lazy(() => import('../pages/Events'))
const EventDetails = lazy(() => import('../pages/EventDetails'))
const Articles = lazy(() => import('../pages/Articles'))
const ArticleDetail = lazy(() => import('../pages/ArticleDetail'))
const CreateArticle = lazy(() => import('../extras/CreateArticle'))
const Projects = lazy(() => import('../pages/Projects'))
const Committee = lazy(() => import('../pages/Committee'))
const LogoExplain = lazy(() => import('../pages/LogoExplain'))
const Continue = lazy(() => import('../extras/Continue')) // Checkpoint/Role selection page

function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
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

interface AnimatedRoutesProps {
  user: { name: string; role: 'user' | 'admin' } | null
  onLogin: (userData: { name: string; role: 'user' | 'admin' }) => void
  articles: any[]
  onArticleCreated: (newArticle: any) => void
  onApproveArticle: (id: string | number) => void
  onRejectArticle: (id: string | number) => void
  isMobile: boolean
}

function AnimatedRoutes({
  user,
  onLogin,
  articles,
  onArticleCreated,
  onApproveArticle,
  onRejectArticle,
  isMobile,
}: AnimatedRoutesProps) {
  const location = useLocation()
  const { scrollYProgress } = useScroll()
  const springY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const width = useTransform(springY, [0, 1], ['0%', '100%'])

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: isMobile ? 2 : 3,
          zIndex: 1100,
          background: 'linear-gradient(90deg, #8b5cf6, #22d3ee)',
          transformOrigin: 'left center',
          width,
        }}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Home />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <Login onLogin={onLogin} />
              </PageTransition>
            }
          />

          {/* CONTINUE / ROLE CHECKPOINT ROUTE - PASSED onLogin PROP */}
          <Route
            path="/continue"
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Continue onLogin={onLogin} />
                </Suspense>
              </PageTransition>
            }
          />

          {/* EVENTS ROUTES */}
          <Route
            path="/events"
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Events />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/events/:id"
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <EventDetails />
                </Suspense>
              </PageTransition>
            }
          />

          {/* MAIN ARTICLES ROUTE */}
          <Route
            path="/articles"
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Articles
                    user={user}
                    articlesData={articles}
                    onApproveArticle={onApproveArticle}
                    onRejectArticle={onRejectArticle}
                  />
                </Suspense>
              </PageTransition>
            }
          />

          {/* CREATE ARTICLE ROUTE (REDIRECTS TO /continue IF GUEST) */}
          <Route
            path="/articles/new"
            element={
              user ? (
                <PageTransition>
                  <Suspense fallback={<PageLoader />}>
                    <CreateArticle user={user} onArticleCreated={onArticleCreated} />
                  </Suspense>
                </PageTransition>
              ) : (
                <Navigate to="/continue" replace />
              )
            }
          />

          {/* INDIVIDUAL ARTICLE READER ROUTE */}
          <Route
            path="/articles/:id"
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <ArticleDetail />
                </Suspense>
              </PageTransition>
            }
          />

          <Route
            path="/projects"
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Projects />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/committee"
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Committee />
                </Suspense>
              </PageTransition>
            }
          />
          <Route
            path="/logo"
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <LogoExplain />
                </Suspense>
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <BrowserRouter>
      <AppContent isMobile={isMobile} />
    </BrowserRouter>
  )
}

function AppContent({ isMobile }: { isMobile: boolean }) {
  const location = useLocation()
  const isImmersive =
    location.pathname === '/' || location.pathname === '/committee'

  // MANAGE USER AUTH STATE
  const [user, setUser] = useState<{ name: string; role: 'user' | 'admin' } | null>(null)

  const handleLogin = (userData: { name: string; role: 'user' | 'admin' }) => {
    setUser(userData)
  }

  // INITIALIZE ARTICLES WITH DEFAULT 'approved' STATUS
  const [articles, setArticles] = useState(() =>
    initialArticles.map((art: any) => ({
      ...art,
      status: art.status || 'approved',
    }))
  )

  // User Action: Add draft article (Defaults to 'pending')
  const handleAddArticle = (newArticle: any) => {
    const articleWithStatus = {
      ...newArticle,
      status: 'pending',
    }
    setArticles((prevArticles) => [articleWithStatus, ...prevArticles])
  }

  // Admin Action: Approve article
  const handleApproveArticle = (id: string | number) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, status: 'approved' } : art))
    )
  }

  // Admin Action: Reject/Delete article
  const handleRejectArticle = (id: string | number) => {
    setArticles((prev) => prev.filter((art) => art.id !== id))
  }

  return (
    <>
      {/* Persistent canvas background */}
      <div style={{ minHeight: '100vh', background: '#03030f', position: 'relative' }}>

        <QuantumBackground />
        {!isMobile && <CustomCursor />}

        {/* Liquid Ether - Background effect for all pages */}
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100vh', 
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.12
        }}>
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B497CF']}
            mouseForce={isMobile ? 10 : 20}
            cursorSize={isMobile ? 50 : 100}
            isViscous
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={isMobile ? 0.8 : 0.5}
            isBounce={false}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* Noise overlay */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: 0.025,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Aurora blobs */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: isMobile ? '80vw' : '60vw',
              height: isMobile ? '80vw' : '60vw',
              background:
                'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)',
              animation: 'aurora 20s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-20%',
              left: '-10%',
              width: isMobile ? '70vw' : '50vw',
              height: isMobile ? '70vw' : '50vw',
              background:
                'radial-gradient(ellipse, rgba(217,70,239,0.06) 0%, transparent 70%)',
              animation: 'aurora 25s ease-in-out infinite reverse',
            }}
          />
        </div>

        {/* Navigation */}
        <Navigation isMobile={isMobile} />

        {/* Main content */}
        <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
          <AnimatedRoutes
            user={user}
            onLogin={handleLogin}
            articles={articles}
            onArticleCreated={handleAddArticle}
            onApproveArticle={handleApproveArticle}
            onRejectArticle={handleRejectArticle}
            isMobile={isMobile}
          />
        </main>

        {/* Footer */}
        {!isMobile && !isImmersive && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              position: 'fixed',
              right: 24,
              bottom: 24,
              zIndex: 1090,
              padding: '10px 12px',
              borderRadius: 999,
              border: '1px solid rgba(196,181,253,0.16)',
              background: 'rgba(7,7,26,0.6)',
              backdropFilter: 'blur(18px)',
              color: '#c4b5fd',
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            5173
          </motion.div>
        )}

        {!isImmersive && (
          <footer
            style={{
              position: 'relative',
              zIndex: 1,
              borderTop: '1px solid rgba(196,181,253,0.06)',
              padding: isMobile ? '24px 16px' : '40px 24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                maxWidth: 1200,
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: isMobile ? 12 : 16,
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: isMobile ? 24 : 28,
                    height: isMobile ? 24 : 28,
                    background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? 11 : 13,
                    color: '#fff',
                    fontFamily: 'JetBrains Mono',
                    boxShadow: '0 0 10px rgba(124,58,237,0.4)',
                  }}
                >
                  ψ
                </div>
                <span
                  style={{
                    fontFamily: 'Outfit',
                    fontWeight: 700,
                    fontSize: isMobile ? 14 : 16,
                    color: '#c4b5fd',
                  }}
                >
                  SoQC
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'Inter',
                  fontSize: isMobile ? 10 : 12,
                  color: 'rgba(248,248,255,0.25)',
                  letterSpacing: '0.02em',
                  textAlign: 'center',
                }}
              >
                Society of Quantum Computing · {new Date().getFullYear()}
              </p>
              <p
                style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: isMobile ? 10 : 11,
                  color: 'rgba(248,248,255,0.2)',
                  letterSpacing: '0.1em',
                }}
              >
                |ψ⟩ = α|0⟩ + β|1⟩
              </p>
            </div>
          </footer>
        )}
      </div>
    </>
  )
}