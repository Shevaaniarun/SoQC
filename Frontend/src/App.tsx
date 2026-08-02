import { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import CustomCursor from '../components/CustomCursor'
import QuantumBackground from '../components/QuantumBackground'
import Navigation from '../components/Navigation'
import SoundToggle from '../components/SoundToggle'

// 1. IMPORT YOUR INITIAL ARTICLES DATA
// (Adjust this import path if your data file is located elsewhere, e.g., '../data/articles')
import { articles as initialArticles } from '../data' 

const Home = lazy(() => import("../pages/Home"));
const Events = lazy(() => import("../pages/Events"));
const Articles = lazy(() => import("../pages/Articles"));
const ArticleDetail = lazy(() => import("../pages/ArticleDetail"));
const CreateArticle = lazy(() => import("../pages/CreateArticle"));
const Projects = lazy(() => import("../pages/Projects"));
const Committee = lazy(() => import("../pages/Committee"));
const LogoExplain = lazy(() => import("../pages/LogoExplain"));

function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        style={{
          width: 48,
          height: 48,
          border: "2px solid rgba(196,181,253,0.15)",
          borderTop: "2px solid #a855f7",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// 2. ACCEPT PROPS IN AnimatedRoutes
interface AnimatedRoutesProps {
  articles: any[]
  onArticleCreated: (newArticle: any) => void
}

function AnimatedRoutes({ articles, onArticleCreated }: AnimatedRoutesProps) {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const springY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const width = useTransform(springY, [0, 1], ["0%", "100%"]);

  return (
    <>
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 3,
          zIndex: 1100,
          background: "linear-gradient(90deg, #8b5cf6, #22d3ee)",
          transformOrigin: "left center",
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
            path="/events"
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Events />
                </Suspense>
              </PageTransition>
            }
          />
          
          {/* MAIN ARTICLES ROUTE - PASS ARTICLES STATE */}
          <Route
            path="/articles"
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Articles articlesData={articles} />
                </Suspense>
              </PageTransition>
            }
          />

          {/* CREATE ARTICLE ROUTE - PASS CREATION HANDLER */}
          <Route
            path="/articles/new"
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <CreateArticle onArticleCreated={onArticleCreated} />
                </Suspense>
              </PageTransition>
            }
          />

          {/* INDIVIDUAL ARTICLE READER ROUTE - PASS ARTICLES TO FIND BY ID */}
          <Route
            path="/articles/:id"
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <ArticleDetail articlesData={articles} />
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
  );
}

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <BrowserRouter>
      <AppContent isMobile={isMobile} />
    </BrowserRouter>
  );
}

function AppContent({ isMobile }: { isMobile: boolean }) {
  const location = useLocation();
  const isImmersive =
    location.pathname === "/" || location.pathname === "/committee";

  // 3. CREATE ARTICLES STATE IN APP CONTENT
  const [articles, setArticles] = useState(initialArticles);

  const handleAddArticle = (newArticle: any) => {
    setArticles((prevArticles) => [newArticle, ...prevArticles]);
  };

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#03030f', position: 'relative' }}>
        <QuantumBackground />
        <CustomCursor />

        {/* Noise overlay */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: 0.025,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Aurora blobs */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "60vw",
              height: "60vw",
              background:
                "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)",
              animation: "aurora 20s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20%",
              left: "-10%",
              width: "50vw",
              height: "50vw",
              background:
                "radial-gradient(ellipse, rgba(217,70,239,0.06) 0%, transparent 70%)",
              animation: "aurora 25s ease-in-out infinite reverse",
            }}
          />
        </div>

        {/* Navigation */}
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1100 }}>
          <SoundToggle />
        </div>
        <Navigation />

        {/* Main content - PASS PROPS TO ANIMATED ROUTES */}
        <main style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
          <AnimatedRoutes articles={articles} onArticleCreated={handleAddArticle} />
        </main>

        {/* Footer */}
        {!isMobile && !isImmersive && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              position: "fixed",
              right: 24,
              bottom: 24,
              zIndex: 1090,
              padding: "10px 12px",
              borderRadius: 999,
              border: "1px solid rgba(196,181,253,0.16)",
              background: "rgba(7,7,26,0.6)",
              backdropFilter: "blur(18px)",
              color: "#c4b5fd",
              fontFamily: "JetBrains Mono",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            5173
          </motion.div>
        )}

        {!isImmersive && (
          <footer
            style={{
              position: "relative",
              zIndex: 1,
              borderTop: "1px solid rgba(196,181,253,0.06)",
              padding: "40px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: "linear-gradient(135deg, #7c3aed, #d946ef)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    color: "#fff",
                    fontFamily: "JetBrains Mono",
                    boxShadow: "0 0 10px rgba(124,58,237,0.4)",
                  }}
                >
                  ψ
                </div>
                <span
                  style={{
                    fontFamily: "Outfit",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#c4b5fd",
                  }}
                >
                  SoQC
                </span>
              </div>
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 12,
                  color: "rgba(248,248,255,0.25)",
                  letterSpacing: "0.02em",
                }}
              >
                Society of Quantum Computing · {new Date().getFullYear()}
              </p>
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 11,
                  color: "rgba(248,248,255,0.2)",
                  letterSpacing: "0.1em",
                }}
              >
                |ψ⟩ = α|0⟩ + β|1⟩
              </p>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}