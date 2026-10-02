import { Suspense, lazy, useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import CustomCursor from "../components/CustomCursor";
import QuantumBackground from "../components/QuantumBackground";
import Navigation from "../components/Navigation";
import Login from "../extras/Login";
import LiquidEther from "../components/LiquidEther";
import CyberLoader from "../components/CyberLoader";
import { articles as initialArticles } from "../data/articles/articles";

/* =========================================================
   LAZY LOADED PAGES
   ========================================================= */

const Home = lazy(() => import("../pages/Home"));
const Events = lazy(() => import("../pages/Events"));
const EventDetails = lazy(() => import("../pages/EventDetails"));
const Articles = lazy(() => import("../pages/Articles"));
const ArticleDetail = lazy(() => import("../pages/ArticleDetail"));
const CreateArticle = lazy(() => import("../extras/CreateArticle"));
const Projects = lazy(() => import("../pages/Projects"));
const Committee = lazy(() => import("../pages/Committee"));
const LogoExplain = lazy(() => import("../pages/LogoExplain"));
const Continue = lazy(() => import("../extras/Continue"));

/* =========================================================
   APP
   ========================================================= */

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLTablet, setIsLTablet] = useState(false);

  /*
   * Controls the CyberLoader.
   */
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  /* =======================================================
     RESPONSIVE SCREEN SIZE
     ======================================================= */

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;

      /*
       * Mobile
       * < 768px
       */
      setIsMobile(width < 768);

      /*
       * Tablet
       * 768px - 1023px
       */
      setIsTablet(width >= 768 && width < 1024);

      /*
       * Large Tablet
       * 1024px - 1199px
       */
      setIsLTablet(width >= 1024 && width < 1200);
    };

    update();

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  /* =======================================================
     INITIAL LOADER
     ======================================================= */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowInitialLoader(false);
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /* =======================================================
     SHOW INITIAL LOADER
     ======================================================= */

  if (showInitialLoader) {
    return <CyberLoader fullScreen />;
  }

  /* =======================================================
     MAIN APPLICATION
     ======================================================= */

  return (
    <BrowserRouter>
      <AppContent
        isMobile={isMobile}
        isTablet={isTablet}
        isLTablet={isLTablet}
      />
    </BrowserRouter>
  );
}

/* =========================================================
   ANIMATED ROUTES PROPS & COMPONENT
   ========================================================= */

interface AnimatedRoutesProps {
  user: {
    name: string;
    role: "user" | "admin";
  } | null;

  onLogin: (userData: {
    name: string;
    role: "user" | "admin";
  }) => void;

  articles: any[];

  onArticleCreated: (newArticle: any) => void;

  onApproveArticle: (id: string | number) => void;

  onRejectArticle: (id: string | number) => void;

  isMobile: boolean;

  setIsHoveringInteractive: (isHovering: boolean) => void;
}

function AnimatedRoutes({
  user,
  onLogin,
  articles,
  onArticleCreated,
  onApproveArticle,
  onRejectArticle,
  isMobile,
  setIsHoveringInteractive,
}: AnimatedRoutesProps) {
  const location = useLocation();

  /* =======================================================
     SCROLL PROGRESS
     ======================================================= */

  const { scrollYProgress } = useScroll();

  const springY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
  });

  const width = useTransform(
    springY,
    [0, 1],
    ["0%", "100%"]
  );

  return (
    <>
      {/* =====================================================
          TOP SCROLL PROGRESS BAR
      ===================================================== */}

      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: isMobile ? 2 : 3,
          zIndex: 1100,
          background:
            "linear-gradient(90deg, #8b5cf6, #22d3ee)",
          transformOrigin: "left center",
          width,
        }}
      />

      {/* =====================================================
          ROUTES
      ===================================================== */}

      <AnimatePresence mode="wait">
        <Routes
          location={location}
          key={location.pathname}
        >
          {/* =================================================
              HOME
          ================================================= */}

          <Route
            path="/"
            element={
              <PageTransition>
                <Suspense fallback={null}>
                  <Home setIsHoveringInteractive={setIsHoveringInteractive} />
                </Suspense>
              </PageTransition>
            }
          />

          {/* =================================================
              LOGIN
          ================================================= */}

          <Route
            path="/login"
            element={
              <PageTransition>
                <Login onLogin={onLogin} />
              </PageTransition>
            }
          />

          {/* =================================================
              CONTINUE / ROLE CHECKPOINT
          ================================================= */}

          <Route
            path="/continue"
            element={
              <PageTransition>
                <Suspense fallback={null}>
                  <Continue onLogin={onLogin} />
                </Suspense>
              </PageTransition>
            }
          />

          {/* =================================================
              EVENTS
          ================================================= */}

          <Route
            path="/events"
            element={
              <PageTransition>
                <Suspense fallback={null}>
                  <Events />
                </Suspense>
              </PageTransition>
            }
          />

          {/* =================================================
              EVENT DETAILS
          ================================================= */}

          <Route
            path="/events/:id"
            element={
              <PageTransition>
                <Suspense fallback={null}>
                  <EventDetails />
                </Suspense>
              </PageTransition>
            }
          />

          {/* =================================================
              ARTICLES
          ================================================= */}

          <Route
            path="/articles"
            element={
              <PageTransition>
                <Suspense fallback={null}>
                  <Articles
                    user={user}
                    articlesData={articles}
                    onApproveArticle={onApproveArticle}
                    onRejectArticle={onRejectArticle}
                    isMobile={isMobile}
                  />
                </Suspense>
              </PageTransition>
            }
          />

          {/* =================================================
              CREATE ARTICLE
          ================================================= */}

          <Route
            path="/articles/new"
            element={
              user ? (
                <PageTransition>
                  <Suspense fallback={null}>
                    <CreateArticle
                      user={user}
                      onArticleCreated={onArticleCreated}
                    />
                  </Suspense>
                </PageTransition>
              ) : (
                <Navigate
                  to="/continue"
                  replace
                />
              )
            }
          />

          {/* =================================================
              ARTICLE DETAILS
          ================================================= */}

          <Route
            path="/articles/:id"
            element={
              <PageTransition>
                <Suspense fallback={null}>
                  <ArticleDetail />
                </Suspense>
              </PageTransition>
            }
          />

          {/* =================================================
              PROJECTS
          ================================================= */}

          <Route
            path="/projects"
            element={
              <PageTransition>
                <Suspense fallback={null}>
                  <Projects
                    isMobile={isMobile}
                  />
                </Suspense>
              </PageTransition>
            }
          />

          {/* =================================================
              COMMITTEE
          ================================================= */}

          <Route
            path="/committee"
            element={
              <PageTransition>
                <Suspense fallback={null}>
                  <Committee />
                </Suspense>
              </PageTransition>
            }
          />

          {/* =================================================
              LOGO
          ================================================= */}

          <Route
            path="/logo"
            element={
              <PageTransition>
                <Suspense fallback={null}>
                  <LogoExplain
                    isMobile={isMobile}
                  />
                </Suspense>
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

/* =========================================================
   PAGE TRANSITION
   ========================================================= */

function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
        filter: "blur(8px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        y: -20,
        filter: "blur(8px)",
      }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   APP CONTENT
   ========================================================= */

interface AppContentProps {
  isMobile: boolean;
  isTablet: boolean;
  isLTablet: boolean;
}

function AppContent({
  isMobile,
  isTablet,
  isLTablet,
}: AppContentProps) {
  const location = useLocation();

  const isImmersive =
    location.pathname === "/" ||
    location.pathname === "/committee";

  /* State to check if user is hovering over interactive elements */
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  const [user, setUser] = useState<{
    name: string;
    role: "user" | "admin";
  } | null>(null);

  const handleLogin = (userData: {
    name: string;
    role: "user" | "admin";
  }) => {
    setUser(userData);
  };

  const [articles, setArticles] = useState(() =>
    initialArticles.map((art: any) => ({
      ...art,
      status: art.status || "approved",
    }))
  );

  const handleAddArticle = (newArticle: any) => {
    const articleWithStatus = {
      ...newArticle,
      status: "pending",
    };

    setArticles((prevArticles) => [
      articleWithStatus,
      ...prevArticles,
    ]);
  };

  const handleApproveArticle = (id: string | number) => {
    setArticles((prev) =>
      prev.map((art) =>
        art.id === id ? { ...art, status: "approved" } : art
      )
    );
  };

  const handleRejectArticle = (id: string | number) => {
    setArticles((prev) =>
      prev.filter((art) => art.id !== id)
    );
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          background: "#03030f",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        {/* QUANTUM BACKGROUND */}
        <QuantumBackground />

        {/* CUSTOM CURSOR */}
        {!isMobile && <CustomCursor />}

        {/* LIQUID ETHER BACKGROUND */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            zIndex: 0,
            pointerEvents: "none",
            opacity: isHoveringInteractive ? 0.02 : 0.12,
            transition: "opacity 0.3s ease",
          }}
        >
          <LiquidEther
            colors={["#5227FF", "#FF9FFC", "#B497CF"]}
            mouseForce={isHoveringInteractive ? 0 : isMobile ? 10 : 20}
            cursorSize={isHoveringInteractive ? 0 : isMobile ? 50 : 100}
            isViscous
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={isMobile ? 0.8 : 0.5}
            isBounce={false}
            autoDemo={!isHoveringInteractive}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* NOISE OVERLAY */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.025,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* AURORA BLOBS */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* Top-right */}
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: isMobile ? "80vw" : "60vw",
              height: isMobile ? "80vw" : "60vw",
              background:
                "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)",
              animation: "aurora 20s ease-in-out infinite",
            }}
          />

          {/* Bottom-left */}
          <div
            style={{
              position: "absolute",
              bottom: "-20%",
              left: "-10%",
              width: isMobile ? "70vw" : "50vw",
              height: isMobile ? "70vw" : "50vw",
              background:
                "radial-gradient(ellipse, rgba(217,70,239,0.06) 0%, transparent 70%)",
              animation: "aurora 25s ease-in-out infinite reverse",
            }}
          />
        </div>

        {/* NAVIGATION */}
        <Navigation
          isMobile={isMobile}
          isTablet={isTablet}
          isLTablet={isLTablet}
        />

        {/* MAIN CONTENT */}
        <main
          style={{
            position: "relative",
            zIndex: 10,
            minHeight: "100vh",
          }}
        >
          <AnimatedRoutes
            user={user}
            onLogin={handleLogin}
            articles={articles}
            onArticleCreated={handleAddArticle}
            onApproveArticle={handleApproveArticle}
            onRejectArticle={handleRejectArticle}
            isMobile={isMobile}
            setIsHoveringInteractive={setIsHoveringInteractive}
          />
        </main>

        {/* FOOTER */}
        {!isImmersive && (
          <footer
            style={{
              position: "relative",
              zIndex: 10,
              borderTop: "1px solid rgba(196,181,253,0.06)",
              padding: isMobile ? "24px 16px" : "40px 24px",
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
                gap: isMobile ? 12 : 16,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              {/* Logo */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: isMobile ? 40 : 48,
                    height: isMobile ? 40 : 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                    background: "rgba(124,58,237,0.1)",
                    border: "1px solid rgba(196,181,253,0.2)",
                    boxShadow: "0 0 25px rgba(124,58,237,0.25)",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/soqc-logo.png"
                    alt="SoQC Logo"
                    style={{
                      width: "80%",
                      height: "80%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>

                <span
                  style={{
                    fontFamily: "Outfit",
                    fontWeight: 700,
                    fontSize: isMobile ? 14 : 16,
                    color: "#c4b5fd",
                  }}
                >
                  SoQC
                </span>
              </div>

              {/* Copyright */}
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: isMobile ? 10 : 12,
                  color: "rgba(248,248,255,0.25)",
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                Society of Quantum Computing · {new Date().getFullYear()}
              </p>

              {/* Quantum Equation */}
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: isMobile ? 10 : 11,
                  color: "rgba(248,248,255,0.2)",
                  letterSpacing: "0.1em",
                  margin: 0,
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