import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { PauseIcon, PlayIcon, ArrowRight, ArrowLeft } from "lucide-react";

/*
|--------------------------------------------------------------------------
| LOGO DEVELOPMENT STEPS
|--------------------------------------------------------------------------
|
| Put the four logo images inside:
|
| public/logo/
|
| logo-step-1.png
| logo-step-2.png
| logo-step-3.png
| logo-step-4.png
|
| IMPORTANT:
| Step 1 and Step 4 should be transparent PNGs.
| The uploaded versions currently contain a checkerboard background.
|
|--------------------------------------------------------------------------
*/

const logoSteps = [
  {
    id: 1,
    title: "Dirac Notation",
    shortTitle: "The foundation",
    description:
      "The | ⟩ notation comes from Dirac's bra-ket notation — a fundamental mathematical language used to describe quantum states.",
    image: "../data/logo/soqc-logo-step-1.png",
  },
  {
    id: 2,
    title: "Quantum Spin",
    shortTitle: "The qubit",
    description:
      "The ↑ and ↓ spin states represent the two basis states of a qubit, capturing the fundamental quantum states used in quantum computing.",
    image: "../data/logo/soqc-logo-step-2.png",
  },
  {
    id: 3,
    title: "Quantum Connection",
    shortTitle: "Superposition & entanglement",
    description:
      "The dotted paths connect the quantum states, representing the interconnected and probabilistic nature of quantum systems.",
    image: "../data/logo/soqc-logo-step-3.png",
  },
  {
    id: 4,
    title: "Quantum Chip",
    shortTitle: "Computing in action",
    description:
      "The chip brings the concepts together, representing quantum mechanics being applied to physical computing hardware.",
    image: "../data/logo/soqc-logo-step-4.png",
  },
];

/*
|--------------------------------------------------------------------------
| EXISTING BACKGROUND
|--------------------------------------------------------------------------
|
| Kept from the original page.
| DO NOT REMOVE.
|
*/

function QuantumOrb() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.3;
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={60} depth={30} count={2000} factor={3} fade speed={0.3} />

      <pointLight
        color="#7c3aed"
        intensity={4}
        distance={8}
        position={[3, 3, 2]}
      />

      <pointLight
        color="#d946ef"
        intensity={2}
        distance={5}
        position={[-3, -2, 1]}
      />

      <ambientLight intensity={0.05} />
    </group>
  );
}

/*
|--------------------------------------------------------------------------
| MAIN PAGE
|--------------------------------------------------------------------------
*/

interface LogoExplainProps {
  isMobile: boolean;
}

export default function LogoExplain({ isMobile }: LogoExplainProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useScroll({
    target: containerRef,
  });

  /*
  |--------------------------------------------------------------------------
  | AUTOMATIC STEP-BY-STEP ANIMATION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveStep((current) => {
        if (current >= 4) {
          return 1;
        }

        return current + 1;
      });
    }, 4200);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentStep = logoSteps[activeStep - 1];

  /*
  |--------------------------------------------------------------------------
  | NAVIGATION
  |--------------------------------------------------------------------------
  */

  const goNext = () => {
    setIsPlaying(false);

    setActiveStep((current) => {
      if (current >= 4) return 1;
      return current + 1;
    });
  };

  const goPrevious = () => {
    setIsPlaying(false);

    setActiveStep((current) => {
      if (current <= 1) return 4;
      return current - 1;
    });
  };

  const selectStep = (step: number) => {
    setIsPlaying(false);
    setActiveStep(step);
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        paddingTop: 100,
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {/*
      |--------------------------------------------------------------------------
      | EXISTING BACKGROUND — UNTOUCHED
      |--------------------------------------------------------------------------
      */}

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <QuantumOrb />
        </Canvas>
      </div>

      {/*
      |--------------------------------------------------------------------------
      | HEADER — EXISTING STYLE
      |--------------------------------------------------------------------------
      */}

      <div
        style={{
          textAlign: "center",
          padding: "60px 24px 35px",
          maxWidth: 760,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: "JetBrains Mono",
            color: "#a855f7",
            fontSize: 12,
            letterSpacing: "0.2em",
            marginBottom: 16,
            textTransform: "uppercase",
          }}
        >
          SoQC — Identity
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          style={{
            fontFamily: "Outfit",
            fontSize: "clamp(40px, 7vw, 80px)",
            fontWeight: 900,
            background:
              "linear-gradient(135deg, #ffffff, #c4b5fd 40%, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            marginBottom: 24,
            paddingBottom: 10,
          }}
        >
          Decoding
          <br />
          Our Logo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            color: "rgba(248,248,255,0.5)",
            fontFamily: "Inter",
            fontSize: 16,
            lineHeight: 1.7,
          }}
        >
          Every element of the SoQC logo carries meaning rooted in quantum
          physics. Watch the identity come together, one element at a time.
        </motion.p>
      </div>

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "25px 24px 90px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "minmax(0, 1fr)"
              : "minmax(420px, 1fr) minmax(340px, 0.9fr)",
            gap: isMobile ? 60 : 70,
            alignItems: "center",
          }}
        >
          {/*
          |--------------------------------------------------------------------------
          | LEFT — ACTUAL LOGO
          |--------------------------------------------------------------------------
          */}

          <div
            style={{
              position: "relative",
              height: 520,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* subtle glow behind logo */}
            <motion.div
              animate={{
                opacity: [0.25, 0.45, 0.25],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: 320,
                height: 320,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)",
                filter: "blur(35px)",
                pointerEvents: "none",
              }}
            />

            {/*
            |--------------------------------------------------------------------------
            | STEP IMAGE
            |--------------------------------------------------------------------------
            |
            | We use the EXACT supplied logo artwork.
            |
            */}

            <div
              style={{
                position: "relative",
                width: "min(100%, 540px)",
                aspectRatio: "1 / 1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "content-fit",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentStep.image}
                  src={currentStep.image}
                  alt={`SoQC logo development — step ${activeStep}`}
                  initial={{
                    opacity: 0,
                    scale: 0.92,
                    filter: "blur(8px)",
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 1.04,
                    filter: "blur(5px)",
                  }}
                  transition={{
                    duration: 0.75,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    userSelect: "none",
                    pointerEvents: "none",

                    /*
                    Keep the logo visually integrated with
                    the existing dark environment.
                    */
                    filter:
                      activeStep === 1 || activeStep === 4
                        ? "drop-shadow(0 0 25px rgba(124,58,237,0.15))"
                        : "drop-shadow(0 0 25px rgba(124,58,237,0.12))",
                  }}
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            {/* stage indicator */}
            <div
              style={{
                position: "absolute",
                bottom: 5,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "JetBrains Mono",
                fontSize: 10,
                letterSpacing: "0.18em",
                color: "rgba(248,248,255,0.28)",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {String(activeStep).padStart(2, "0")} / 04
            </div>
          </div>

          {/*
          |--------------------------------------------------------------------------
          | RIGHT — STEP EXPLANATION
          |--------------------------------------------------------------------------
          */}

          <div>
            <div
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 10,
                color: "rgba(248,248,255,0.28)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              How the identity is built
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {logoSteps.map((step) => {
                const isActive = activeStep === step.id;
                const isCompleted = activeStep > step.id;

                return (
                  <motion.button
                    key={step.id}
                    onClick={() => selectStep(step.id)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      border: isActive
                        ? "1px solid rgba(196,181,253,0.28)"
                        : "1px solid rgba(196,181,253,0.08)",
                      background: isActive
                        ? "rgba(124,58,237,0.09)"
                        : "rgba(124,58,237,0.025)",
                      borderRadius: 16,
                      padding: "17px 20px",
                      cursor: "pointer",
                      color: "white",
                      transition: "all 0.3s ease",
                      boxShadow: isActive
                        ? "0 0 35px rgba(124,58,237,0.08)"
                        : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 15,
                      }}
                    >
                      {/* number */}
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "JetBrains Mono",
                          fontSize: 10,
                          border: isActive
                            ? "1px solid rgba(255,255,255,0.5)"
                            : "1px solid rgba(255,255,255,0.12)",
                          background: isActive
                            ? "rgba(255,255,255,0.1)"
                            : "transparent",
                          color: isActive
                            ? "#ffffff"
                            : isCompleted
                              ? "#a855f7"
                              : "rgba(248,248,255,0.35)",
                        }}
                      >
                        {String(step.id).padStart(2, "0")}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontFamily: "Outfit",
                            fontWeight: 700,
                            fontSize: 16,
                            color: isActive
                              ? "#ffffff"
                              : "rgba(248,248,255,0.72)",
                            marginBottom: 3,
                          }}
                        >
                          {step.title}
                        </div>

                        <div
                          style={{
                            fontFamily: "JetBrains Mono",
                            fontSize: 9,
                            color: isActive
                              ? "#a855f7"
                              : "rgba(248,248,255,0.3)",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                          }}
                        >
                          {step.shortTitle}
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: 14,
                          color: isActive ? "#c4b5fd" : "rgba(248,248,255,0.2)",
                        }}
                      >
                        {isActive ? "●" : "○"}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                            marginTop: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            marginTop: 15,
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                            marginTop: 0,
                          }}
                          transition={{ duration: 0.35 }}
                          style={{
                            overflow: "hidden",
                            paddingLeft: 49,
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "Inter",
                              color: "rgba(248,248,255,0.58)",
                              fontSize: 13,
                              lineHeight: 1.75,
                              paddingRight: 10,
                            }}
                          >
                            {step.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            {/*
            |--------------------------------------------------------------------------
            | PROGRESS
            |--------------------------------------------------------------------------
            */}

            <div
              style={{
                marginTop: 24,
                height: 2,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{
                  width: `${activeStep * 25}%`,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #7c3aed, #c4b5fd)",
                  borderRadius: 999,
                }}
              />
            </div>

            {/*
            |--------------------------------------------------------------------------
            | CONTROLS
            |--------------------------------------------------------------------------
            */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 18,
                gap: 10,
              }}
            >
              <div
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 10,
                  color: "rgba(248,248,255,0.28)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {currentStep.title}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 7,
                }}
              >
                <button onClick={goPrevious} style={controlButtonStyle}>
                  <ArrowLeft size={14} />
                </button>

                <button
                  onClick={() => setIsPlaying((v) => !v)}
                  style={{
                    ...controlButtonStyle,
                  }}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                <button onClick={goNext} style={controlButtonStyle}>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/*
        |--------------------------------------------------------------------------
        | BOTTOM — FINAL MEANING
        |--------------------------------------------------------------------------
        */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: 850,
            margin: "90px auto 0",
            paddingTop: 50,
            borderTop: "1px solid rgba(196,181,253,0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "#a855f7",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            One identity · Four ideas
          </div>

          <h2
            style={{
              fontFamily: "Outfit",
              fontSize: "clamp(30px, 5vw, 52px)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              margin: 0,
            }}
          >
            From quantum states
            <br />
            to quantum computing.
          </h2>

          <p
            style={{
              maxWidth: 620,
              margin: "20px auto 0",
              color: "rgba(248,248,255,0.42)",
              fontFamily: "Inter",
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            What begins as mathematical notation evolves through quantum states
            and their connections, finally becoming a symbol for the technology
            that brings quantum computing to life.
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {activeStep === 4 && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.4,
            }}
            animate={{
              opacity: [0, 0.12, 0],
              scale: [0.5, 2, 3],
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 1.4,
            }}
            style={{
              position: "fixed",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 250,
              height: 250,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(124,58,237,0.6), transparent)",
              pointerEvents: "none",
              zIndex: 100,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| SMALL CONTROL STYLE
|--------------------------------------------------------------------------
*/

const controlButtonStyle: React.CSSProperties = {
  height: 34,
  minWidth: 34,
  padding: "0 12px",
  borderRadius: 9,
  border: "1px solid rgba(196,181,253,0.1)",
  background: "rgba(124,58,237,0.05)",
  color: "rgba(248,248,255,0.55)",
  fontFamily: "JetBrains Mono",
  fontSize: 10,
  cursor: "pointer",
};
