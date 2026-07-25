import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
  useAnimationFrame,
} from "framer-motion";
import { committee } from "../data";

interface Member {
  name: string;
  role: string;
  year?: string;
  dept: string;
  image: string;
  interests?: string[];
  linkedin: string;
  instagram?: string;
}

const members = [
  ...committee.faculty,
  committee.chair,
  committee.viceChair,
  ...committee.directors,
  ...committee.deputies,
] as Member[];

const CARD_SIZE = 300;

function HelixCard({
  member,
  index,
  totalItems,
  vScroll,
  onSelect,
}: {
  member: Member;
  index: number;
  totalItems: number;
  vScroll: any;
  onSelect: (m: Member) => void;
}) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerRevolution = 6;
  const helixTwist = 1.15;
  const angleSpacing = ((Math.PI * 2) / itemsPerRevolution) * helixTwist;
  const cylinderRadius = dimensions.width < 768 ? 155 : 265;
  const ySpacing = dimensions.width < 768 ? 82 : 92;
  const zOffset = -140;
  const startYOffset = 0;

  // Total height block occupied by one full iteration loop
  const totalLoopHeight = totalItems * ySpacing;

  // Helper mapping shared across derivations to keep spatial math perfectly synchronized
  const getLoopState = () => {
    const s = vScroll.get();

    // Calculate current un-looped Y coordinate relative to the camera center viewport point
    let relativeY = index * ySpacing - s + startYOffset;

    // Infinite Loop Math logic:
    // Shift cards vertically back up or down if they move too far off screen limits
    const halfLoop = totalLoopHeight / 2;
    relativeY = (relativeY - startYOffset + halfLoop) % totalLoopHeight;
    if (relativeY < 0) relativeY += totalLoopHeight;
    const finalY = relativeY - halfLoop + startYOffset;

    // Tie rotation to each card's vertical travel rather than rotating the
    // entire gallery as a unit. A card becomes front-facing only as it passes
    // through the center, then turns away while continuing downward.
    const angle = (finalY / ySpacing) * angleSpacing;

    return { angle, y: finalY };
  };

  const styleTransform = useTransform(() => {
    const { angle, y } = getLoopState();

    const x = Math.sin(angle) * cylinderRadius;
    const rawZ = Math.cos(angle) * cylinderRadius;
    const z = rawZ + zOffset;
    const facing = -Math.atan2(x, rawZ);
    return `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${facing}rad)`;
  });

  const styleOpacity = useTransform(() => {
    const { angle } = getLoopState();
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));
    return 0.35 + Math.pow(focus, 1.4) * 0.65;
  });

  const styleFilter = useTransform(() => {
    const { angle } = getLoopState();
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));
    return `saturate(${0.65 + focus * 0.35})`;
  });

  const styleZIndex = useTransform(() => {
    const { angle } = getLoopState();
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));
    return Math.round(focus * 200);
  });

  const styleBoxShadow = useTransform(() => {
    const { angle } = getLoopState();
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));
    if (focus > 0.94)
      return "0 0 50px rgba(167, 139, 250, 0.45), inset 0 0 20px rgba(124, 58, 237, 0.25), 0 14px 28px rgba(0,0,0,0.5)";
    if (focus > 0.6)
      return "0 0 30px rgba(167, 139, 250, 0.15), 0 10px 22px rgba(0,0,0,0.4)";
    return "0 8px 18px rgba(0,0,0,0.45), 0 1px 0 rgba(196,181,253,0.1)";
  });

  const styleBorder = useTransform(() => {
    const { angle } = getLoopState();
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));
    return `1px solid ${focus > 0.88 ? "rgba(196,181,253,0.5)" : focus > 0.6 ? "rgba(196,181,253,0.2)" : "rgba(255,255,255,0.04)"}`;
  });

  const designationOpacity = useTransform(() => 1);

  return (
    <motion.button
      onClick={() => onSelect(member)}
      style={{
        position: "absolute",
        left: "50%",
        top: "calc(50% - 72px)",
        width: CARD_SIZE,
        height: CARD_SIZE - 100,
        margin: 0,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        transform: styleTransform,
        transformOrigin: "center center",
        opacity: styleOpacity,
        filter: styleFilter,
        zIndex: styleZIndex,
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          borderRadius: 16,
          padding: 20,
          background: "rgba(7, 7, 26, 0.9)",
          backdropFilter: "blur(16px)",
          border: styleBorder,
          boxShadow: styleBoxShadow,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid rgba(196,181,253,0.35)",
            flexShrink: 0,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <img
            src={member.image}
            alt={member.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ width: "100%" }}>
          <div
            style={{
              fontFamily: "Outfit",
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            {member.name}
          </div>
          <motion.div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 10,
              color: "#a855f7",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: 6,
              opacity: designationOpacity,
            }}
          >
            {member.role}
          </motion.div>
        </div>
        <motion.div
          style={{
            fontFamily: "Inter",
            fontSize: 13,
            color: "rgba(248,248,255,0.65)",
            lineHeight: 1.4,
            opacity: designationOpacity,
          }}
        >
          {member.dept}
          {member.year ? ` · ${member.year}` : ""}
        </motion.div>
      </motion.div>
    </motion.button>
  );
}

export default function Committee() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showHeader, setShowHeader] = useState(true);

  const vScrollTarget = useRef(0);

  const vScroll = useSpring(0, { stiffness: 95, damping: 24, mass: 1.0 });

  const dismissHeader = () => {
    setShowHeader((prev) => (prev ? false : prev));
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const onWheel = (e: WheelEvent) => {
      dismissHeader();
      vScrollTarget.current += e.deltaY * 1.2;
      vScroll.set(vScrollTarget.current);
    };

    let lastY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      dismissHeader();
      const delta = lastY - e.touches[0].clientY;
      lastY = e.touches[0].clientY;
      vScrollTarget.current += delta * 2.2;
      vScroll.set(vScrollTarget.current);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [vScroll]);

  // Keep the helix alive between interactions. The same scroll value drives
  // manual input and this subtle automatic descent, so incoming cards still
  // travel down into the center instead of spinning in place.
  useAnimationFrame((_, delta) => {
    vScrollTarget.current += delta * 0.026;
    vScroll.set(vScrollTarget.current);
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "transparent",
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          perspective: "1200px",
          perspectiveOrigin: "50% 48%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Soft center glow — no opaque top band */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 90% 70% at 50% 52%, rgba(124,58,237,0.1) 0%, transparent 62%), radial-gradient(ellipse 120% 40% at 50% 100%, rgba(3,3,15,0.55) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Top fade — blends nav into content, keeps starfield visible */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, transparent 0%, transparent 12%, rgba(3,3,10,0.08) 38%, rgba(3,3,10,0.35) 100%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Ambient volumetric light in center */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "48%",
            width: "70vh",
            height: "90vh",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 58%)",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />

        {/* Particles */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {Array.from({ length: 45 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: ["100vh", "-10vh"],
                opacity: [0, 0.6, 0],
                x: Math.sin(i) * 200,
              }}
              transition={{
                duration: 10 + (i % 15),
                repeat: Infinity,
                delay: i % 10,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                left: `${(i * 17) % 100}%`,
                width: 2 + (i % 3),
                height: 2 + (i % 3),
                borderRadius: "50%",
                background: i % 2 === 0 ? "#a855f7" : "#22d3ee",
                boxShadow: `0 0 10px ${i % 2 === 0 ? "#a855f7" : "#22d3ee"}`,
              }}
            />
          ))}
        </div>

        {/* Cinematic Header Text — removed on first scroll */}
        <AnimatePresence>
          {showHeader && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                zIndex: 3,
                pointerEvents: "none",
                paddingTop: "clamp(96px, 13vh, 132px)",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  maxWidth: 680,
                  padding: "0 24px",
                }}
              >
                <div
                  style={{
                    fontFamily: "JetBrains Mono",
                    color: "#a855f7",
                    fontSize: 12,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    marginBottom: 20,
                  }}
                >
                  SoQC • Helix Gallery
                </div>
                <h1
                  style={{
                    fontFamily: "Outfit",
                    fontSize: "clamp(28px, 4vw, 52px)",
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: 10,
                    lineHeight: 1.1,
                  }}
                >
                  Diving into the core.
                </h1>
                <p
                  style={{
                    fontFamily: "Inter",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "rgba(248,248,255,0.55)",
                    maxWidth: 520,
                    margin: "0 auto",
                  }}
                >
                  Scroll through the spiral. Cards loop infinitely as you
                  descend the helix.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Helix Layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
          }}
        >
          {members.map((member, index) => (
            <HelixCard
              key={`${member.name}-${index}`}
              member={member}
              index={index}
              totalItems={members.length}
              vScroll={vScroll}
              onSelect={setSelectedMember}
            />
          ))}
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                background: "rgba(3,3,15,0.85)",
                backdropFilter: "blur(20px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                cursor: "pointer",
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0, rotateX: 10 }}
                animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.95, y: -20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "min(480px, 100%)",
                  padding: "40px 32px",
                  borderRadius: 32,
                  background: "rgba(7,7,26,0.95)",
                  border: "1px solid rgba(196,181,253,0.3)",
                  boxShadow:
                    "0 0 100px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                  cursor: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      width: 84,
                      height: 84,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid rgba(196,181,253,0.5)",
                    }}
                  >
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div>
                    <h2
                      style={{
                        fontFamily: "Outfit",
                        fontSize: 26,
                        fontWeight: 700,
                        color: "#fff",
                        marginBottom: 4,
                      }}
                    >
                      {selectedMember.name}
                    </h2>
                    <div
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: 12,
                        color: "#a855f7",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      {selectedMember.role}
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: "Inter",
                    color: "rgba(248,248,255,0.7)",
                    lineHeight: 1.8,
                    fontSize: 15,
                    marginBottom: 20,
                  }}
                >
                  {selectedMember.dept}
                  {selectedMember.year ? ` · ${selectedMember.year}` : ""}
                </p>
                {selectedMember.interests && (
                  <div>
                    <div
                      style={{
                        fontFamily: "Inter",
                        fontSize: 12,
                        color: "rgba(248,248,255,0.4)",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Research Focus
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {selectedMember.interests.map((interest) => (
                        <span
                          key={interest}
                          style={{
                            padding: "8px 14px",
                            borderRadius: 999,
                            border: "1px solid rgba(196,181,253,0.2)",
                            background: "rgba(124,58,237,0.1)",
                            color: "#c4b5fd",
                            fontFamily: "Inter",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
