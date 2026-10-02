import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { projects } from "../data/projects/projects";

/* =========================================================
   ARCHITECTURE FLOW
========================================================= */

function ArchitectureFlow({
  nodes,
  isMobile,
}: {
  nodes: string[];
  isMobile: boolean;
}) {
  return (
    <div
      style={{
        padding: isMobile ? "12px 0" : "20px 0",
        overflowX: "auto",
        overflowY: "hidden",
        width: "100%",
        maxWidth: "100%",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "thin",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          minWidth: "max-content",
          paddingBottom: 4,
        }}
      >
        {nodes.map((node, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: i * 0.1,
                duration: 0.4,
              }}
              whileHover={
                !isMobile
                  ? {
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(124,58,237,0.5)",
                    }
                  : undefined
              }
              style={{
                padding: isMobile ? "7px 11px" : "8px 16px",
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(196,181,253,0.25)",
                borderRadius: 10,
                fontFamily: "JetBrains Mono",
                fontSize: isMobile ? 9 : 11,
                color: "#c4b5fd",
                whiteSpace: "nowrap",
                cursor: "default",
                transition: "all 0.2s ease",
              }}
            >
              {node}
            </motion.div>

            {i < nodes.length - 1 && (
              <motion.div
                initial={{
                  opacity: 0,
                  scaleX: 0,
                }}
                animate={{
                  opacity: 1,
                  scaleX: 1,
                }}
                transition={{
                  delay: i * 0.1 + 0.2,
                  duration: 0.3,
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: isMobile ? "0 3px" : "0 4px",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: isMobile ? 16 : 24,
                    height: 1,
                    background:
                      "linear-gradient(90deg, rgba(124,58,237,0.6), rgba(168,85,247,0.6))",
                    position: "relative",
                  }}
                >
                  <motion.div
                    animate={{
                      x: isMobile ? [0, 16, 0] : [0, 24, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.3,
                    }}
                    style={{
                      position: "absolute",
                      top: -2,
                      left: 0,
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: "#c4b5fd",
                      boxShadow: "0 0 6px #c4b5fd",
                    }}
                  />
                </div>

                <span
                  style={{
                    color: "rgba(196,181,253,0.5)",
                    fontSize: isMobile ? 8 : 10,
                  }}
                >
                  ▶
                </span>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   PROJECT CARD
========================================================= */

function ProjectCard({
  project,
  index,
  isMobile,
}: {
  project: (typeof projects)[0];
  index: number;
  isMobile: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref, {
    once: true,
    margin: "-50px",
  });

  const typeColor =
    project.type === "Working"
      ? "#22d3ee"
      : project.type === "Research"
        ? "#a855f7"
        : "#c4b5fd";

  const statusColor =
    project.status === "Active"
      ? "#4ade80"
      : project.status === "Ongoing"
        ? "#fde047"
        : "#c4b5fd";

  const statusBackground =
    project.status === "Active"
      ? "rgba(34,197,94,0.15)"
      : project.status === "Ongoing"
        ? "rgba(234,179,8,0.15)"
        : "rgba(168,85,247,0.15)";

  const statusBorder =
    project.status === "Active"
      ? "rgba(34,197,94,0.3)"
      : project.status === "Ongoing"
        ? "rgba(234,179,8,0.3)"
        : "rgba(168,85,247,0.3)";

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: isMobile ? 30 : 60,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        delay: isMobile ? index * 0.08 : index * 0.15,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        background: "rgba(124,58,237,0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(196,181,253,0.1)",
        borderRadius: isMobile ? 18 : 24,
        overflow: "hidden",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* =====================================================
          IMAGE HEADER
      ===================================================== */}

      <div
        style={{
          position: "relative",
          height: isMobile ? 160 : 200,
          overflow: "hidden",
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent, rgba(3,3,15,0.92))",
          }}
        />

        {/* Status badges */}

        <div
          style={{
            position: "absolute",
            top: isMobile ? 10 : 16,
            left: isMobile ? 10 : 16,
            right: isMobile ? 10 : "auto",
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {/* Type */}

          <span
            style={{
              padding: isMobile ? "4px 8px" : "4px 12px",
              background: `${typeColor}22`,
              border: `1px solid ${typeColor}44`,
              borderRadius: 100,
              fontSize: isMobile ? 9 : 11,
              color: typeColor,
              fontFamily: "JetBrains Mono",
              whiteSpace: "nowrap",
            }}
          >
            {project.type}
          </span>

          {/* Status */}

          <span
            style={{
              padding: isMobile ? "4px 8px" : "4px 12px",
              background: statusBackground,
              border: `1px solid ${statusBorder}`,
              borderRadius: 100,
              fontSize: isMobile ? 9 : 11,
              color: statusColor,
              fontFamily: "JetBrains Mono",
              whiteSpace: "nowrap",
            }}
          >
            {project.status === "Active"
              ? "● "
              : project.status === "Ongoing"
                ? "◉ "
                : "✓ "}
            {project.status}
          </span>
        </div>
      </div>

      {/* =====================================================
          CARD CONTENT
      ===================================================== */}

      <div
        style={{
          padding: isMobile ? "20px 16px" : "28px 32px",
        }}
      >
        {/* Title */}

        <h3
          style={{
            fontFamily: "Outfit",
            fontSize: isMobile ? 20 : 22,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 14px",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            overflowWrap: "anywhere",
          }}
        >
          {project.title}
        </h3>

        {/* =====================================================
            TAGS
        ===================================================== */}

        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: isMobile ? 16 : 20,
          }}
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: isMobile ? "3px 8px" : "3px 10px",
                background: "rgba(124,58,237,0.15)",
                borderRadius: 100,
                fontSize: isMobile ? 9 : 11,
                color: "rgba(196,181,253,0.7)",
                fontFamily: "JetBrains Mono",
                maxWidth: "100%",
                overflowWrap: "anywhere",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* =====================================================
            PROBLEM / SOLUTION
        ===================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 10 : 16,
            marginBottom: isMobile ? 16 : 20,
          }}
        >
          {[
            ["Problem", project.problem, "#ef4444"],
            ["Solution", project.solution, "#22d3ee"],
          ].map(([label, text, color]) => (
            <div
              key={label as string}
              style={{
                padding: isMobile ? "13px" : "16px",
                background: `${color}08`,
                border: `1px solid ${color}22`,
                borderRadius: 12,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: isMobile ? 9 : 10,
                  color: color as string,
                  marginBottom: 7,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>

              <p
                style={{
                  color: "rgba(248,248,255,0.6)",
                  fontSize: isMobile ? 11 : 12,
                  fontFamily: "Inter",
                  lineHeight: 1.7,
                  margin: 0,
                  overflowWrap: "anywhere",
                }}
              >
                {(text as string).slice(0, isMobile ? 130 : 100)}
                {(text as string).length > (isMobile ? 130 : 100)
                  ? "..."
                  : ""}
              </p>
            </div>
          ))}
        </div>

        {/* =====================================================
            NOVELTY
        ===================================================== */}

        <div
          style={{
            padding: isMobile ? "13px" : "16px",
            background: "rgba(217,70,239,0.06)",
            border: "1px solid rgba(217,70,239,0.15)",
            borderRadius: 12,
            marginBottom: isMobile ? 16 : 20,
          }}
        >
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: isMobile ? 9 : 10,
              color: "#d946ef",
              marginBottom: 7,
              letterSpacing: "0.1em",
            }}
          >
            ✦ NOVELTY
          </div>

          <p
            style={{
              color: "rgba(248,248,255,0.7)",
              fontSize: isMobile ? 11 : 13,
              fontFamily: "Inter",
              lineHeight: 1.7,
              margin: 0,
              overflowWrap: "anywhere",
            }}
          >
            {project.novelty}
          </p>
        </div>

        {/* =====================================================
            ARCHITECTURE
        ===================================================== */}

        <div
          style={{
            marginBottom: isMobile ? 16 : 20,
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: isMobile ? 9 : 10,
              color: "rgba(248,248,255,0.3)",
              marginBottom: 8,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Architecture Flow
          </div>

          <ArchitectureFlow
            nodes={project.architecture}
            isMobile={isMobile}
          />
        </div>

        {/* =====================================================
            TEAM & GUIDE
        ===================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "stretch" : "flex-start",
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "wrap",
            gap: isMobile ? 14 : 12,
            marginBottom: isMobile ? 20 : 24,
          }}
        >
          {/* Team */}

          <div
            style={{
              minWidth: 0,
              flex: isMobile ? "none" : 1,
            }}
          >
            <div
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: isMobile ? 9 : 10,
                color: "rgba(248,248,255,0.3)",
                marginBottom: 6,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Team
            </div>

            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              {project.team.map((m) => (
                <span
                  key={m}
                  style={{
                    fontFamily: "Inter",
                    fontSize: isMobile ? 10 : 12,
                    color: "rgba(248,248,255,0.6)",
                    background: "rgba(255,255,255,0.05)",
                    padding: "3px 8px",
                    borderRadius: 6,
                    overflowWrap: "anywhere",
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Guide */}

          <div
            style={{
              minWidth: 0,
              maxWidth: isMobile ? "100%" : "45%",
            }}
          >
            <div
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: isMobile ? 9 : 10,
                color: "rgba(248,248,255,0.3)",
                marginBottom: 6,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Guide
            </div>

            <span
              style={{
                fontFamily: "Inter",
                fontSize: isMobile ? 11 : 12,
                color: "#c4b5fd",
                overflowWrap: "anywhere",
              }}
            >
              {project.guide}
            </span>
          </div>
        </div>

        {/* =====================================================
            GITHUB
        ===================================================== */}

        <motion.a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          whileHover={
            !isMobile
              ? {
                  scale: 1.03,
                  boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                }
              : undefined
          }
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: isMobile ? "100%" : "fit-content",
            boxSizing: "border-box",
            padding: isMobile ? "12px 16px" : "10px 20px",
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(196,181,253,0.2)",
            borderRadius: 10,
            color: "#c4b5fd",
            fontFamily: "JetBrains Mono",
            fontSize: isMobile ? 11 : 13,
            textDecoration: "none",
            transition: "all 0.2s ease",
            minHeight: 44,
          }}
        >
          <svg
            width={isMobile ? 15 : 16}
            height={isMobile ? 15 : 16}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>

          View on GitHub
        </motion.a>
      </div>
    </motion.div>
  );
}

/* =========================================================
   MAIN PROJECTS PAGE
========================================================= */

export default function Projects({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const [tab, setTab] = useState<
    "all" | "Working" | "Research"
  >("all");

  const filtered =
    tab === "all"
      ? projects
      : projects.filter((p) => p.type === tab);

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: isMobile ? 72 : 100,
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          textAlign: "center",
          padding: isMobile
            ? "40px 18px 42px"
            : "60px 24px 64px",
          maxWidth: 800,
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: "JetBrains Mono",
            color: "#a855f7",
            fontSize: isMobile ? 9 : 12,
            letterSpacing: isMobile ? "0.12em" : "0.2em",
            marginBottom: isMobile ? 12 : 16,
            textTransform: "uppercase",
            lineHeight: 1.5,
          }}
        >
          SoQC — Research & Projects
        </motion.div>

        <motion.h1
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
            duration: 0.8,
          }}
          style={{
            fontFamily: "Outfit",
            fontSize: isMobile
              ? "clamp(42px, 14vw, 58px)"
              : "clamp(40px, 7vw, 80px)",
            fontWeight: 900,
            background:
              "linear-gradient(135deg, #ffffff, #c4b5fd 40%, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            margin: 0,
            marginBottom: isMobile ? 18 : 24,
          }}
        >
          Projects &<br />
          Research
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            color: "rgba(248,248,255,0.5)",
            fontFamily: "Inter",
            fontSize: isMobile ? 12 : 16,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          From theoretical research to working quantum systems — our
          projects push the boundaries of what's possible with today's
          quantum hardware.
        </motion.p>
      </div>

      {/* =====================================================
          FILTER TABS
      ===================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: isMobile ? 6 : 8,
          marginBottom: isMobile ? 36 : 60,
          padding: isMobile ? "0 16px" : "0 24px",
          flexWrap: "wrap",
          boxSizing: "border-box",
        }}
      >
        {(["all", "Working", "Research"] as const).map((t) => (
          <motion.button
            key={t}
            onClick={() => setTab(t)}
            whileHover={
              !isMobile
                ? {
                    scale: 1.03,
                  }
                : undefined
            }
            whileTap={{
              scale: 0.97,
            }}
            style={{
              padding: isMobile
                ? "9px 15px"
                : "8px 24px",
              minHeight: 40,
              borderRadius: 100,
              border:
                tab === t
                  ? "1px solid rgba(196,181,253,0.4)"
                  : "1px solid rgba(196,181,253,0.1)",
              background:
                tab === t
                  ? "rgba(124,58,237,0.2)"
                  : "transparent",
              color:
                tab === t
                  ? "#c4b5fd"
                  : "rgba(248,248,255,0.4)",
              fontFamily: "Inter",
              fontWeight: 500,
              fontSize: isMobile ? 11 : 14,
              cursor: "pointer",
              textTransform: "capitalize",
              transition: "all 0.2s ease",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {t === "all" ? "All Projects" : t}
          </motion.button>
        ))}
      </div>

      {/* =====================================================
          PROJECT GRID
      ===================================================== */}

      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile
            ? "0 12px 70px"
            : "0 24px 120px",
          boxSizing: "border-box",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(360px, 1fr))",
              gap: isMobile ? 18 : 28,
              width: "100%",
              minWidth: 0,
            }}
          >
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                isMobile={isMobile}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

