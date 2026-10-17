import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
  useAnimationFrame,
} from "framer-motion";
import { committee, roleColors } from "../data";

interface Member {
  name: string;
  role: string;
  domain: string;
  year?: string;
  dept: string;
  image: string;
  interests?: string[];
  linkedin: string;
  instagram?: string;
}

const domainGroups = committee.directors.map((director) => ({
  domain: director.domain,
  director,
  deputies: committee.deputies.filter(
    (deputy) => deputy.domain === director.domain
  ),
}));

const members = [
  committee.chair,
  committee.viceChair,

  ...domainGroups.flatMap((group) => [
    group.director,
    ...group.deputies,
  ]),
] as Member[];

const CARD_SIZE = 300;

// Decodes text from scrambled characters into the real string.
function GlitchText({
  text,
  delay = 0,
  style,
}: {
  text: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*/\\<>";
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let raf = 0;
    let frame = 0;
    const totalFrames = 11;
    let interval: ReturnType<typeof setInterval> | undefined;

    setDisplay(
      text
        .split("")
        .map((c) =>
          c === " " ? " " : chars[Math.floor(Math.random() * chars.length)],
        )
        .join(""),
    );

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        frame++;
        const revealCount = Math.floor((frame / totalFrames) * text.length);
        setDisplay(
          text
            .split("")
            .map((c, i) => {
              if (c === " ") return " ";
              if (i < revealCount) return c;
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join(""),
        );
        if (frame >= totalFrames) {
          if (interval) clearInterval(interval);
          setDisplay(text);
        }
      }, 26);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
      cancelAnimationFrame(raf);
    };
  }, [text, delay]);

  return <span style={style}>{display}</span>;
}

// Terminal-style typewriter with a blinking cursor.
function TypewriterLabel({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setShown((s) => {
          if (s >= text.length) {
            if (interval) clearInterval(interval);
            return s;
          }
          return s + 1;
        });
      }, 20);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay]);

  return (
    <span>
      {text.slice(0, shown)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        ▍
      </motion.span>
    </span>
  );
}

// Four animated targeting-reticle corner brackets.
function HudCorners({
  size = 22,
  color = "#fff",
  thickness = 2,
  inset = -6,
}: {
  size?: number;
  color?: string;
  thickness?: number;
  inset?: number;
}) {
  const positions: {
    style: React.CSSProperties;
    rotate: number;
    key: string;
  }[] = [
    { style: { top: inset, left: inset }, rotate: 0, key: "tl" },
    { style: { top: inset, right: inset }, rotate: 90, key: "tr" },
    { style: { bottom: inset, right: inset }, rotate: 180, key: "br" },
    { style: { bottom: inset, left: inset }, rotate: 270, key: "bl" },
  ];

  return (
    <>
      {positions.map(({ style, rotate, key }) => (
        <div
          key={key}
          style={{
            position: "absolute",
            width: size,
            height: size,
            ...style,
            pointerEvents: "none",
          }}
        >
          <motion.svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            style={{ transform: `rotate(${rotate}deg)`, display: "block" }}
          >
            <motion.path
              d="M1 9 L1 1 L9 1"
              fill="none"
              stroke={color}
              strokeWidth={thickness}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </motion.svg>
        </div>
      ))}
    </>
  );
}

// A single glowing line that sweeps across its parent once on mount.
function ScanSweep({
  color = "rgba(225,225,225,0.9)",
  duration = 0.5,
  vertical = true,
}: {
  color?: string;
  duration?: number;
  vertical?: boolean;
}) {
  return (
    <motion.div
      initial={
        vertical ? { top: "-4%", opacity: 0 } : { left: "-4%", opacity: 0 }
      }
      animate={
        vertical
          ? { top: "104%", opacity: [0, 1, 1, 0] }
          : { left: "104%", opacity: [0, 1, 1, 0] }
      }
      transition={{ duration, ease: "easeInOut" }}
      style={{
        position: "absolute",
        pointerEvents: "none",
        zIndex: 6,
        ...(vertical
          ? { left: 0, right: 0, height: 2 }
          : { top: 0, bottom: 0, width: 2 }),
        background: vertical
          ? `linear-gradient(90deg, transparent, ${color}, transparent)`
          : `linear-gradient(180deg, transparent, ${color}, transparent)`,
        boxShadow: `0 0 14px ${color}`,
      }}
    />
  );
}

// Quick chromatic-aberration style flash used on materialize-in.
function ChromaticFlash({ duration = 0.35 }: { duration?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0.55 }}
      animate={{ opacity: 0 }}
      transition={{ duration, ease: "easeOut" }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 7,
        background:
          "linear-gradient(100deg, rgba(255,0,140,0.18) 0%, transparent 35%, transparent 65%, rgba(34,211,238,0.18) 100%)",
        mixBlendMode: "screen",
      }}
    />
  );
}

// function HelixCard({
//   member,
//   index,
//   totalItems,
//   vScroll,
//   onSelect,
//   isLocking,
// }: {
//   member: Member;
//   index: number;
//   totalItems: number;
//   vScroll: any;
//   onSelect: (m: Member) => void;
//   isLocking: boolean;
// }) {
//   const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

//   useEffect(() => {
//     setDimensions({ width: window.innerWidth, height: window.innerHeight });
//     const handleResize = () =>
//       setDimensions({ width: window.innerWidth, height: window.innerHeight });
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const itemsPerRevolution = 6;
//   const helixTwist = 1.15;
//   const angleSpacing = ((Math.PI * 2) / itemsPerRevolution) * helixTwist;
//   const cylinderRadius = dimensions.width < 768 ? 155 : 265;
//   const ySpacing = dimensions.width < 768 ? 82 : 92;
//   const zOffset = -140;
//   const startYOffset = 0;

//   // Total height block occupied by one full iteration loop
//   const totalLoopHeight = totalItems * ySpacing;

//   // Helper mapping shared across derivations to keep spatial math perfectly synchronized
//   const getLoopState = () => {
//     const s = vScroll.get();

//     // Calculate current un-looped Y coordinate relative to the camera center viewport point
//     let relativeY = index * ySpacing - s + startYOffset;

//     // Infinite Loop Math logic:
//     // Shift cards vertically back up or down if they move too far off screen limits
//     const halfLoop = totalLoopHeight / 2;
//     relativeY = (relativeY - startYOffset + halfLoop) % totalLoopHeight;
//     if (relativeY < 0) relativeY += totalLoopHeight;
//     const finalY = relativeY - halfLoop + startYOffset;

//     // Tie rotation to each card's vertical travel rather than rotating the
//     // entire gallery as a unit. A card becomes front-facing only as it passes
//     // through the center, then turns away while continuing downward.
//     const angle = (finalY / ySpacing) * angleSpacing;

//     return { angle, y: finalY };
//   };

//   const styleTransform = useTransform(() => {
//     const { angle, y } = getLoopState();

//     const x = Math.sin(angle) * cylinderRadius;
//     const rawZ = Math.cos(angle) * cylinderRadius;
//     const z = rawZ + zOffset;
//     const facing = -Math.atan2(x, rawZ);
//     return `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${facing}rad)`;
//   });

//   const styleOpacity = useTransform(() => {
//     const { angle } = getLoopState();
//     const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));
//     return 0.35 + Math.pow(focus, 1.4) * 0.65;
//   });

//   const styleFilter = useTransform(() => {
//     const { angle } = getLoopState();
//     const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));
//     return `saturate(${0.65 + focus * 0.35})`;
//   });

//   const styleZIndex = useTransform(() => {
//     const { angle } = getLoopState();
//     const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));
//     return Math.round(focus * 200);
//   });

//   const styleBoxShadow = useTransform(() => {
//     const { angle } = getLoopState();
//     const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));
//     if (focus > 0.94)
//       return "0 0 50px rgba(167, 139, 250, 0.45), inset 0 0 20px rgba(124, 58, 237, 0.25), 0 14px 28px rgba(0,0,0,0.5)";
//     if (focus > 0.6)
//       return "0 0 30px rgba(167, 139, 250, 0.15), 0 10px 22px rgba(0,0,0,0.4)";
//     return "0 8px 18px rgba(0,0,0,0.45), 0 1px 0 rgba(196,181,253,0.1)";
//   });

//   const styleBorder = useTransform(() => {
//     const { angle } = getLoopState();
//     const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));
//     return `1px solid ${focus > 0.88 ? "rgba(196,181,253,0.5)" : focus > 0.6 ? "rgba(196,181,253,0.2)" : "rgba(255,255,255,0.04)"}`;
//   });

//   const designationOpacity = useTransform(() => 1);

//   return (
//     <motion.button
//       onClick={() => onSelect(member)}
//       style={{
//         position: "absolute",
//         left: "50%",
//         top: "calc(50% - 72px)",
//         width: CARD_SIZE,
//         height: CARD_SIZE - 100,
//         margin: 0,
//         padding: 0,
//         border: "none",
//         background: "transparent",
//         cursor: "pointer",
//         transform: styleTransform,
//         transformOrigin: "center center",
//         opacity: styleOpacity,
//         filter: styleFilter,
//         zIndex: isLocking ? 999 : styleZIndex,
//       }}
//     >
//       <motion.div
//         animate={
//           isLocking
//             ? {
//                 scale: [1, 1.035, 1.02],
//                 filter: [
//                   "brightness(1)",
//                   "brightness(1.25)",
//                   "brightness(1.1)",
//                 ],
//               }
//             : { scale: 1, filter: "brightness(1)" }
//         }
//         transition={{ duration: 0.35, ease: "easeOut" }}
//         style={{
//           position: "relative",
//           width: "100%",
//           height: "100%",
//           boxSizing: "border-box",
//           borderRadius: 10,
//           padding: 20,
//           background: "rgba(7, 7, 26, 0.9)",
//           backdropFilter: "blur(16px)",
//           border: styleBorder,
//           boxShadow: styleBoxShadow,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           textAlign: "center",
//           gap: 12,
//         }}
//       >
//         {/* Target-lock overlay: fires briefly the instant a card is selected */}
//         <AnimatePresence>
//           {isLocking && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 pointerEvents: "none",
//                 zIndex: 20,
//               }}
//             >
//               <HudCorners size={20} inset={-8} color="rgb(168, 85, 247)" />
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: [0.15, 0.55, 0.15] }}
//                 transition={{ duration: 0.35, repeat: Infinity }}
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   borderRadius: 10,
//                   border: "1px solid rgba(34,211,238,0.7)",
//                 }}
//               />
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   overflow: "hidden",
//                   borderRadius: 10,
//                 }}
//               >
//                 <ScanSweep duration={0.38} color="rgba(168, 85, 247, 0.85)" />
//               </div>
//               <motion.div
//                 initial={{ opacity: 0, y: 4 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 style={{
//                   position: "absolute",
//                   bottom: -22,
//                   left: 0,
//                   right: 0,
//                   textAlign: "center",
//                   fontFamily: "JetBrains Mono",
//                   fontSize: 9,
//                   letterSpacing: "0.2em",
//                   color: "#fff",
//                   textTransform: "uppercase",
//                 }}
//               >
//                 Locating file…
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <div
//           style={{
//             width: 80,
//             height: 80,
//             borderRadius: "50%",
//             overflow: "hidden",
//             border: "2px solid rgba(196,181,253,0.35)",
//             flexShrink: 0,
//             boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
//           }}
//         >
//           <img
//             src={member.image}
//             alt={member.name}
//             style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           />
//         </div>
//         <div style={{ width: "100%" }}>
//           <div
//             style={{
//               fontFamily: "Outfit",
//               fontSize: 18,
//               fontWeight: 700,
//               color: "#fff",
//               lineHeight: 1.2,
//             }}
//           >
//             {member.name}
//           </div>
//           <motion.div
//             style={{
//               fontFamily: "JetBrains Mono",
//               fontSize: 10,
//               color: "#a855f7",
//               letterSpacing: "0.12em",
//               textTransform: "uppercase",
//               marginTop: 6,
//               opacity: designationOpacity,
//             }}
//           >
//             {member.role}
//           </motion.div>
//         </div>
//         <motion.div
//           style={{
//             fontFamily: "Inter",
//             fontSize: 13,
//             color: "rgba(248,248,255,0.65)",
//             lineHeight: 1.4,
//             opacity: designationOpacity,
//           }}
//         >
//           {member.dept}
//           {member.year ? ` · ${member.year}` : ""}
//         </motion.div>
//       </motion.div>
//     </motion.button>
//   );
// }

function HelixCard({
  member,
  index,
  totalItems,
  vScroll,
  onSelect,
  isLocking,
}: {
  member: Member;
  index: number;
  totalItems: number;
  vScroll: any;
  onSelect: (m: Member) => void;
  isLocking: boolean;
}) {
  const [dimensions, setDimensions] = useState({
    width: 1200,
    height: 800,
  });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () =>
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const roleColor =
    roleColors[member.role as keyof typeof roleColors] ??
    roleColors["Director"];

  /* -------------------------------------------------------
     Helix calculations
  ------------------------------------------------------- */

  const itemsPerRevolution = 6;
  const helixTwist = 1.15;

  const angleSpacing = ((Math.PI * 2) / itemsPerRevolution) * helixTwist;

  const cylinderRadius = dimensions.width < 768 ? 155 : 265;

  const ySpacing = dimensions.width < 768 ? 82 : 92;

  const zOffset = -140;
  const startYOffset = 0;

  // Total height block occupied by one full iteration loop
  const totalLoopHeight = totalItems * ySpacing;

  // Helper mapping shared across derivations
  const getLoopState = () => {
    const s = vScroll.get();

    // Calculate current un-looped Y coordinate
    let relativeY = index * ySpacing - s + startYOffset;

    // Infinite Loop Math
    const halfLoop = totalLoopHeight / 2;

    relativeY = (relativeY - startYOffset + halfLoop) % totalLoopHeight;

    if (relativeY < 0) {
      relativeY += totalLoopHeight;
    }

    const finalY = relativeY - halfLoop + startYOffset;

    // Tie rotation to vertical travel
    const angle = (finalY / ySpacing) * angleSpacing;

    return {
      angle,
      y: finalY,
    };
  };

  /* -------------------------------------------------------
     Card transform
  ------------------------------------------------------- */

  const styleTransform = useTransform(() => {
    const { angle, y } = getLoopState();

    const x = Math.sin(angle) * cylinderRadius;

    const rawZ = Math.cos(angle) * cylinderRadius;

    const z = rawZ + zOffset;

    const facing = -Math.atan2(x, rawZ);

    return `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${facing}rad)`;
  });

  /* -------------------------------------------------------
     Opacity
  ------------------------------------------------------- */

  const styleOpacity = useTransform(() => {
    const { angle } = getLoopState();

    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));

    return 0.35 + Math.pow(focus, 1.4) * 0.65;
  });

  /* -------------------------------------------------------
     Saturation
  ------------------------------------------------------- */

  const styleFilter = useTransform(() => {
    const { angle } = getLoopState();

    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));

    return `saturate(${0.65 + focus * 0.35})`;
  });

  /* -------------------------------------------------------
     Z-index
  ------------------------------------------------------- */

  const styleZIndex = useTransform(() => {
    const { angle } = getLoopState();

    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));

    return Math.round(focus * 200);
  });

  /* -------------------------------------------------------
     Role-colored shadow
  ------------------------------------------------------- */

  const styleBoxShadow = useTransform(() => {
    const { angle } = getLoopState();

    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));

    if (focus > 0.94) {
      return `
        0 0 50px ${roleColor.glow},
        inset 0 0 20px ${roleColor.softGlow},
        0 14px 28px rgba(0,0,0,0.5)
      `;
    }

    if (focus > 0.6) {
      return `
        0 0 30px ${roleColor.softGlow},
        0 10px 22px rgba(0,0,0,0.4)
      `;
    }

    return `
      0 8px 18px rgba(0,0,0,0.45),
      0 1px 0 rgba(196,181,253,0.1)
    `;
  });

  /* -------------------------------------------------------
     Role-colored border
  ------------------------------------------------------- */

  const styleBorder = useTransform(() => {
    const { angle } = getLoopState();

    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));

    if (focus > 0.88) {
      return `1px solid ${roleColor.light}`;
    }

    if (focus > 0.6) {
      return `1px solid ${roleColor.softGlow}`;
    }

    return "1px solid rgba(255,255,255,0.04)";
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
        zIndex: isLocking ? 999 : styleZIndex,
      }}
    >
      <motion.div
        animate={
          isLocking
            ? {
                scale: [1, 1.035, 1.02],
                filter: [
                  "brightness(1)",
                  "brightness(1.25)",
                  "brightness(1.1)",
                ],
              }
            : {
                scale: 1,
                filter: "brightness(1)",
              }
        }
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          borderRadius: 10,
          padding: 20,
          background: roleColor.background,
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
        {/* Target-lock overlay */}
        <AnimatePresence>
          {isLocking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 20,
              }}
            >
              <HudCorners size={20} inset={-8} color={roleColor.main} />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.15, 0.55, 0.15],
                }}
                transition={{
                  duration: 0.35,
                  repeat: Infinity,
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 10,
                  border: `1px solid ${roleColor.light}`,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  borderRadius: 10,
                }}
              >
                <ScanSweep duration={0.38} color={roleColor.glow} />
              </div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 4,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                style={{
                  position: "absolute",
                  bottom: -22,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontFamily: "JetBrains Mono",
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  color: roleColor.main,
                  textTransform: "uppercase",
                }}
              >
                Locating file…
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile image */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            overflow: "hidden",
            border: `2px solid ${roleColor.light}`,
            flexShrink: 0,
            boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 18px ${roleColor.softGlow}`,
          }}
        >
          <img
            src={member.image}
            alt={member.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Name + Role */}
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
              color: roleColor.main,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: 6,
              opacity: designationOpacity,
              textShadow: `0 0 12px ${roleColor.glow}`,
            }}
          >
            {member.role}
          </motion.div>
        </div>

        {/* Department + Year */}
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
  const [lockingMember, setLockingMember] = useState<Member | null>(null);
  const [showHeader, setShowHeader] = useState(true);

  const vScrollTarget = useRef(0);
  const lockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const vScroll = useSpring(0, { stiffness: 95, damping: 24, mass: 1.0 });

  const navigateToDomain = (domain: string) => {
  const directorIndex = members.findIndex(
    (member) =>
      member.role === "Director" &&
      member.domain === domain
  );

  if (directorIndex === -1) return;

  const ySpacing = window.innerWidth < 768 ? 82 : 87;

  vScrollTarget.current = directorIndex * ySpacing;
  vScroll.set(vScrollTarget.current);
};

  const dismissHeader = () => {
    setShowHeader((prev) => (prev ? false : prev));
  };

  // Card click no longer opens the modal instantly — it first triggers a
  // brief "target-lock" scan on the card itself, then materializes the
  // detail panel once the lock completes.
  const handleSelect = (member: Member) => {
    if (lockTimeout.current) clearTimeout(lockTimeout.current);
    setSelectedMember(null);
    setLockingMember(member);
    lockTimeout.current = setTimeout(() => {
      setLockingMember(null);
      setSelectedMember(member);
    }, 420);
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
      if (lockTimeout.current) clearTimeout(lockTimeout.current);
    };
  }, [vScroll]);

  // Keep the helix alive between interactions. The same scroll value drives
  // manual input and this subtle automatic descent, so incoming cards still
  // travel down into the center instead of spinning in place.
  useAnimationFrame((_, delta) => {
    vScrollTarget.current += delta * 0.026;
    vScroll.set(vScrollTarget.current);
  });
  const roleColor =
    roleColors[selectedMember?.role as keyof typeof roleColors] ??
    roleColors["Director"];

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

      {/* Domain Navigation */}
      <div
      style={{
        position: "absolute",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(94vw, 1100px)",
        zIndex: 40,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",

        pointerEvents: "auto",
      }}
      >
      {domainGroups.map((group) => (
        <button
          key={group.domain}
          onClick={() => navigateToDomain(group.domain)}
          style={{
            border: "1px solid rgba(196, 181, 253, 0.28)",
            background: "rgba(7, 7, 26, 0.72)",
            backdropFilter: "blur(14px)",

            color: "#C4B5FD",

            padding: "9px 15px",
            borderRadius: 999,

            fontFamily: "JetBrains Mono",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",

            cursor: "pointer",

            transition:
              "color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#22D3EE";
            e.currentTarget.style.borderColor =
              "rgba(34, 211, 238, 0.7)";
            e.currentTarget.style.background =
              "rgba(8, 51, 68, 0.55)";
            e.currentTarget.style.boxShadow =
              "0 0 20px rgba(34, 211, 238, 0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#C4B5FD";
            e.currentTarget.style.borderColor =
              "rgba(196, 181, 253, 0.28)";
            e.currentTarget.style.background =
              "rgba(7, 7, 26, 0.72)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {group.domain}
        </button>
      ))}
      </div>  
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
              onSelect={handleSelect}
              isLocking={lockingMember?.name === member.name}
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
                top: "-25%",
                backdropFilter: "blur(20px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                cursor: "pointer",
              }}
            >
              {/* Holographic grid backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.12 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)",
                  backgroundSize: "38px 38px",
                  pointerEvents: "none",
                }}
              />

              <motion.div
                initial={{
                  scale: 0.82,
                  y: 24,
                  opacity: 0,
                  filter: "blur(10px)",
                }}
                animate={{ scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0.94, y: -16, opacity: 0, filter: "blur(6px)" }}
                transition={{ type: "spring", damping: 24, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "relative",
                  width: "min(760px, 100%)",
                  minHeight: 380,
                  borderRadius: 5,
                  background: roleColor.background,
                  //border: "1px solid rgba(196,181,253,0.3)",
                  boxShadow:
                    "0 0 100px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                  cursor: "auto",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                {/* Materialization FX layer — spans the whole panel */}
                <ChromaticFlash duration={0.4} />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    borderRadius: 28,
                    pointerEvents: "none",
                    zIndex: 8,
                  }}
                >
                  <ScanSweep duration={0.6} color={roleColor.glow} />
                </div>

                {/* Left column: all details */}
                <div
                  style={{
                    flex: "1 1 56%",
                    minWidth: 0,
                    padding: "40px 36px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 14,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32 }}
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      color: "#fff",
                      textTransform: "uppercase",
                    }}
                  >
                    <TypewriterLabel text="// PROFILE DECRYPTED" delay={320} />
                  </motion.div>

                  <h2
                    style={{
                      fontFamily: "Outfit",
                      fontSize: 30,
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1.15,
                      margin: 0,
                    }}
                  >
                    <GlitchText text={selectedMember.name} delay={180} />
                  </h2>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 12,
                      color: roleColor.main,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    {selectedMember.role}
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    style={{
                      fontFamily: "Inter",
                      color: "rgba(248,248,255,0.7)",
                      lineHeight: 1.6,
                      fontSize: 15,
                      margin: "0 0 6px 0",
                    }}
                  >
                    {selectedMember.dept}
                    {selectedMember.year ? ` · ${selectedMember.year}` : ""}
                  </motion.p>

                  {selectedMember.interests && (
                    <div style={{ marginTop: 8 }}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        style={{
                          fontFamily: "Inter",
                          fontSize: 12,
                          color: "rgba(248,248,255,0.7)",
                          marginBottom: 8,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        Research Focus
                      </motion.div>
                      <div
                        style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
                      >
                        {selectedMember.interests.map((interest, i) => (
                          <motion.span
                            key={interest}
                            initial={{
                              opacity: 0,
                              scale: 0.8,
                              filter: "blur(4px)",
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              filter: "blur(0px)",
                            }}
                            transition={{
                              delay: 0.65 + i * 0.06,
                              duration: 0.3,
                            }}
                            style={{
                              padding: "4px 12px",
                              borderRadius: 2,
                              border: `1px solid ${roleColor.glow}`,
                              background: roleColor.background,
                              color: roleColor.main,
                              fontFamily: "JetBrains Mono",
                              fontSize: 13,
                              fontWeight: 400,
                            }}
                          >
                            {interest}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column: full-bleed portrait */}
                <motion.div
                  initial={{ clipPath: "inset(0 0 0 100%)" }}
                  animate={{ clipPath: "inset(0 0 0 0%)" }}
                  transition={{ duration: 0.55, delay: 0.1, ease: "easeInOut" }}
                  style={{
                    position: "relative",
                    flex: "0 0 42%",
                    minWidth: 200,
                    alignSelf: "stretch",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {/* Blend the image into the panel on its inner edge */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, rgba(7,7,26,0.85) 0%, transparent 14%, transparent 100%)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(124,58,237,0.12) 0%, transparent 40%, rgba(7,7,26,0.35) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      overflow: "hidden",
                      pointerEvents: "none",
                    }}
                  >
                    <ScanSweep duration={0.7} color="rgba(196,181,253,0.55)" />
                  </div>
                </motion.div>

                <HudCorners size={26} inset={10} color={roleColor.main} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
