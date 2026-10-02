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
   =========================================================
   
   IMPORTANT:
   There is NO artificial 3500ms delay here.

   The previous version had:

   new Promise((res) => setTimeout(res, 3500))

   That caused the loader to appear every time a route
   was loaded.

   Now the pages load normally.
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

  /*
   * Controls the CyberLoader.
   *
   * This state starts TRUE every time the React application
   * is created.
   *
   * Therefore:
   *
   * Browser refresh  → loader appears
   * First visit      → loader appears
   * Route navigation → loader does NOT appear
   */
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  /* =======================================================
     RESPONSIVE SCREEN SIZE
  ======================================================= */

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
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
    /*
     * Give the CyberLoader enough time to be visible.
     *
     * Change 2500 to whatever duration you want.
     *
     * 1500 = 1.5 seconds
     * 2000 = 2 seconds
     * 2500 = 2.5 seconds
     * 3000 = 3 seconds
     */
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
      <AppContent isMobile={isMobile} />
    </BrowserRouter>
  );
}

/* =========================================================
   ANIMATED ROUTES
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
}

/* =========================================================
   ROUTES
========================================================= */

function AnimatedRoutes({
  user,
  onLogin,
  articles,
  onArticleCreated,
  onApproveArticle,
  onRejectArticle,
  isMobile,
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
                  <Home />
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

function AppContent({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const location = useLocation();

  /* =======================================================
     IMMERSIVE PAGES
  ======================================================= */

  const isImmersive =
    location.pathname === "/" ||
    location.pathname === "/committee";

  /* =======================================================
     USER AUTH STATE
  ======================================================= */

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

  /* =======================================================
     ARTICLES
  ======================================================= */

  const [articles, setArticles] = useState(() =>
    initialArticles.map((art: any) => ({
      ...art,
      status: art.status || "approved",
    }))
  );

  /* =======================================================
     ADD ARTICLE
  ======================================================= */

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

  /* =======================================================
     APPROVE ARTICLE
  ======================================================= */

  const handleApproveArticle = (
    id: string | number
  ) => {
    setArticles((prev) =>
      prev.map((art) =>
        art.id === id
          ? {
              ...art,
              status: "approved",
            }
          : art
      )
    );
  };

  /* =======================================================
     REJECT ARTICLE
  ======================================================= */

  const handleRejectArticle = (
    id: string | number
  ) => {
    setArticles((prev) =>
      prev.filter((art) => art.id !== id)
    );
  };

  /* =======================================================
     APPLICATION UI
  ======================================================= */

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
        {/* =================================================
            QUANTUM BACKGROUND
        ================================================= */}

        <QuantumBackground />

        {/* =================================================
            CUSTOM CURSOR
        ================================================= */}

        {!isMobile && <CustomCursor />}

        {/* =================================================
            LIQUID ETHER
        ================================================= */}

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0.12,
          }}
        >
          <LiquidEther
            colors={[
              "#5227FF",
              "#FF9FFC",
              "#B497CF",
            ]}
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

        {/* =================================================
            NOISE OVERLAY
        ================================================= */}

        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage:
              `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.025,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* =================================================
            AURORA BLOBS
        ================================================= */}

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
              width: isMobile
                ? "80vw"
                : "60vw",
              height: isMobile
                ? "80vw"
                : "60vw",
              background:
                "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)",
              animation:
                "aurora 20s ease-in-out infinite",
            }}
          />

          {/* Bottom-left */}

          <div
            style={{
              position: "absolute",
              bottom: "-20%",
              left: "-10%",
              width: isMobile
                ? "70vw"
                : "50vw",
              height: isMobile
                ? "70vw"
                : "50vw",
              background:
                "radial-gradient(ellipse, rgba(217,70,239,0.06) 0%, transparent 70%)",
              animation:
                "aurora 25s ease-in-out infinite reverse",
            }}
          />
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <Navigation
          isMobile={isMobile}
        />

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main
          style={{
            position: "relative",
            zIndex: 1,
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
          />
        </main>

        {/* =================================================
            DESKTOP PORT
        ================================================= */}

        {!isMobile && !isImmersive && (
          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            style={{
              position: "fixed",
              right: 24,
              bottom: 24,
              zIndex: 1090,
              padding: "10px 12px",
              borderRadius: 999,
              border:
                "1px solid rgba(196,181,253,0.16)",
              background:
                "rgba(7,7,26,0.6)",
              backdropFilter:
                "blur(18px)",
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

        {/* =================================================
            FOOTER
        ================================================= */}

        {!isImmersive && (
          <footer
            style={{
              position: "relative",
              zIndex: 1,
              borderTop:
                "1px solid rgba(196,181,253,0.06)",
              padding: isMobile
                ? "24px 16px"
                : "40px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: isMobile ? 12 : 16,
                flexDirection: isMobile
                  ? "column"
                  : "row",
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
                    width: isMobile
                      ? 24
                      : 28,
                    height: isMobile
                      ? 24
                      : 28,
                    background:
                      "linear-gradient(135deg, #7c3aed, #d946ef)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    fontSize: isMobile
                      ? 11
                      : 13,
                    color: "#fff",
                    fontFamily:
                      "JetBrains Mono",
                    boxShadow:
                      "0 0 10px rgba(124,58,237,0.4)",
                  }}
                >
                  ψ
                </div>

                <span
                  style={{
                    fontFamily: "Outfit",
                    fontWeight: 700,
                    fontSize: isMobile
                      ? 14
                      : 16,
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
                  fontSize: isMobile
                    ? 10
                    : 12,
                  color:
                    "rgba(248,248,255,0.25)",
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                Society of Quantum Computing ·{" "}
                {new Date().getFullYear()}
              </p>

              {/* Quantum Equation */}

              <p
                style={{
                  fontFamily:
                    "JetBrains Mono",
                  fontSize: isMobile
                    ? 10
                    : 11,
                  color:
                    "rgba(248,248,255,0.2)",
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
