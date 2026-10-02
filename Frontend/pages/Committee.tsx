import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
  useAnimationFrame,
} from "framer-motion";
import { committee, roleColors } from "../data/committee/committee";

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
  quote?: string;
}

const domainGroups = committee.directors.map((director) => ({
  domain: director.domain,
  director,
  deputies: committee.deputies.filter(
    (deputy) => deputy.domain === director.domain,
  ),
}));

const members = [
  committee.chair,
  committee.viceChair,
  ...domainGroups.flatMap((group) => [group.director, ...group.deputies]),
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
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const update = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const roleColor =
    roleColors[member.role as keyof typeof roleColors] ??
    roleColors["Director"];

  const isMobile = dimensions.width < 640;
  const isTablet = dimensions.width >= 640 && dimensions.width < 1024;

  const itemsPerRevolution = isMobile ? 8 : isTablet ? 8 : 6;
  const helixTwist = isMobile ? 1.0 : isTablet ? 1.0 : 1.15;
  const angleSpacing = ((Math.PI * 2) / itemsPerRevolution) * helixTwist;

  const cylinderRadius = isMobile ? 130 : isTablet ? 180 : 265;
  const ySpacing = isMobile ? 110 : isTablet ? 130 : 92;

  const baseCardWidth = isMobile ? 190 : isTablet ? 230 : CARD_SIZE;
  const baseCardHeight = isMobile ? 150 : isTablet ? 170 : CARD_SIZE - 100;
  const cardTopOffset = Math.round((baseCardHeight / (CARD_SIZE - 100)) * 72);

  const zOffset = isMobile ? -100 : -140;
  const startYOffset = 0;
  const totalLoopHeight = totalItems * ySpacing;

  const getLoopState = () => {
    const s = vScroll.get();
    let relativeY = index * ySpacing - s + startYOffset;
    const halfLoop = totalLoopHeight / 2;

    relativeY = (relativeY - startYOffset + halfLoop) % totalLoopHeight;
    if (relativeY < 0) relativeY += totalLoopHeight;

    const finalY = relativeY - halfLoop + startYOffset;
    const angle = (finalY / ySpacing) * angleSpacing;

    return { angle, y: finalY };
  };

  /* ---------------------- Position ---------------------- */
  const styleTransform = useTransform(() => {
    const { angle, y } = getLoopState();
    const xScale = isMobile ? 0.85 : isTablet ? 0.9 : 1;
    const x = Math.sin(angle) * cylinderRadius * xScale;
    const rawZ = Math.cos(angle) * cylinderRadius;
    const z = rawZ + zOffset;

    const facingScale = isMobile ? 0.75 : isTablet ? 0.85 : 1;
    const facing = -Math.atan2(x, rawZ) * facingScale;

    return `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${facing}rad)`;
  });

  /* ---------------------- Focus / Scale ---------------------- */
  const styleScale = useTransform(() => {
    const { angle, y } = getLoopState();
    const centerFocus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));

    if (isMobile) {
      const center = Math.abs(y) < ySpacing * 0.5;
      return center ? 1.08 : 0.82 + centerFocus * 0.1;
    }

    if (isTablet) {
      const center = Math.abs(y) < ySpacing * 0.5;
      return center ? 1.1 : 0.85 + centerFocus * 0.1;
    }

    return 1;
  });

  /* ---------------------- Opacity ---------------------- */
  const styleOpacity = useTransform(() => {
    const { angle, y } = getLoopState();
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));

    if (isMobile) {
      const distance = Math.abs(y);
      if (distance < ySpacing * 0.5) return 1;
      if (distance < ySpacing * 2.2) return 0.45 + focus * 0.4;
      return 0.15;
    }

    return 0.35 + Math.pow(focus, 1.4) * 0.65;
  });

  /* ---------------------- Saturation ---------------------- */
  const styleFilter = useTransform(() => {
    const { angle } = getLoopState();
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));
    return `saturate(${0.5 + focus * 0.5})`;
  });

  /* ---------------------- Z-index ---------------------- */
  const styleZIndex = useTransform(() => {
    const { angle, y } = getLoopState();
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));

    const centerBoost = Math.abs(y) < ySpacing * 0.5 ? 500 : 0;
    return Math.round(centerBoost + focus * 200);
  });

  /* ---------------------- Pointer events ---------------------- */
  const stylePointerEvents = useTransform(() => {
    const { y } = getLoopState();
    return Math.abs(y) < ySpacing * 2.5 ? "auto" : "none";
  });

  /* ---------------------- Shadow ---------------------- */
  const styleBoxShadow = useTransform(() => {
    const { angle, y } = getLoopState();
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));

    if (focus > 0.9) {
      return `0 0 ${isMobile ? 32 : 50}px ${roleColor.glow}, inset 0 0 20px ${roleColor.softGlow}, 0 14px 28px rgba(0,0,0,0.5)`;
    }

    if (focus > 0.6) {
      return `0 0 20px ${roleColor.softGlow}, 0 10px 22px rgba(0,0,0,0.4)`;
    }

    return `0 8px 18px rgba(0,0,0,0.45), 0 1px 0 rgba(196,181,253,0.1)`;
  });

  /* ---------------------- Border ---------------------- */
  const styleBorder = useTransform(() => {
    const { angle } = getLoopState();
    const focus = Math.max(0, Math.min(1, (Math.cos(angle) + 1) / 2));

    if (focus > 0.88) return `1px solid ${roleColor.light}`;
    if (focus > 0.6) return `1px solid ${roleColor.softGlow}`;
    return "1px solid rgba(255,255,255,0.06)";
  });

  return (
    <motion.button
      onClick={() => onSelect(member)}
      aria-label={`View ${member.name}`}
      style={{
        position: "absolute",
        left: "50%",
        top: `calc(50% - ${cardTopOffset}px)`,
        width: baseCardWidth,
        height: baseCardHeight,
        margin: 0,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        transform: styleTransform,
        transformOrigin: "center center",
        scale: styleScale,
        opacity: styleOpacity,
        filter: styleFilter,
        zIndex: isLocking ? 999 : styleZIndex,
        pointerEvents: stylePointerEvents,
        touchAction: "manipulation",
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
            : { scale: 1, filter: "brightness(1)" }
        }
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          borderRadius: 10,
          padding: isMobile ? 12 : isTablet ? 16 : 20,
          background: roleColor.background,
          backdropFilter: "blur(16px)",
          border: styleBorder,
          boxShadow: styleBoxShadow,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: isMobile ? 4 : 8,
        }}
      >
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
                animate={{ opacity: [0.15, 0.55, 0.15] }}
                transition={{ duration: 0.35, repeat: Infinity }}
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
            </motion.div>
          )}
        </AnimatePresence>

        <div
          style={{
            width: isMobile ? 48 : isTablet ? 64 : 72,
            height: isMobile ? 48 : isTablet ? 64 : 72,
            borderRadius: "50%",
            overflow: "hidden",
            border: `2px solid ${roleColor.light}`,
            flexShrink: 0,
            boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 18px ${roleColor.softGlow}`,
          }}
        >
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.2)",
                fontSize: isMobile ? 20 : 28,
                fontFamily: "Outfit",
              }}
            >
              {member.name.charAt(0)}
            </div>
          )}
        </div>

        <div style={{ width: "100%" }}>
          <div
            style={{
              fontFamily: "Outfit",
              fontSize: isMobile ? 13 : isTablet ? 15 : 17,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            {member.name}
          </div>

          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: isMobile ? 8 : 9,
              color: roleColor.main,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: 2,
              textShadow: `0 0 12px ${roleColor.glow}`,
            }}
          >
            {member.role}
          </div>
        </div>

        <div
          style={{
            fontFamily: "Inter",
            fontSize: isMobile ? 10 : 12,
            color: "rgba(248,248,255,0.65)",
            lineHeight: 1.3,
          }}
        >
          {member.dept}
          {member.year ? ` · ${member.year}` : ""}
        </div>
      </motion.div>
    </motion.button>
  );
}

/* Static member card for domain view */
function StaticMemberCard({
  member,
  onSelect,
  size = "md",
  viewport = "desktop",
}: {
  member: Member;
  onSelect: (m: Member) => void;
  size?: "md" | "lg";
  viewport?: "mobile" | "tablet" | "desktop";
}) {
  const roleColor =
    roleColors[member.role as keyof typeof roleColors] ??
    roleColors["Director"];

  const scale = viewport === "mobile" ? 0.76 : viewport === "tablet" ? 0.9 : 1;
  const width = Math.round((size === "lg" ? 260 : 210) * scale);
  const imgSize = Math.round((size === "lg" ? 84 : 64) * scale);
  const nameSize = Math.round((size === "lg" ? 18 : 15) * scale);
  const deptSize = Math.max(9, Math.round(11 * scale));

  return (
    <motion.button
      onClick={() => onSelect(member)}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        position: "relative",
        width,
        border: "none",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        background: "transparent",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          boxSizing: "border-box",
          borderRadius: 12,
          padding:
            size === "lg"
              ? viewport === "mobile"
                ? "18px 14px"
                : "26px 20px"
              : viewport === "mobile"
                ? "13px 12px"
                : "18px 16px",
          background: roleColor.background,
          backdropFilter: "blur(16px)",
          border: `1px solid ${roleColor.light}`,
          boxShadow: `0 0 34px ${roleColor.softGlow}, 0 14px 28px rgba(0,0,0,0.5)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: imgSize,
            height: imgSize,
            borderRadius: "50%",
            overflow: "hidden",
            border: `2px solid ${roleColor.light}`,
            flexShrink: 0,
            boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 18px ${roleColor.softGlow}`,
          }}
        >
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.2)",
                fontSize: 22,
                fontFamily: "Outfit",
              }}
            >
              {member.name.charAt(0)}
            </div>
          )}
        </div>

        <div style={{ width: "100%" }}>
          <div
            style={{
              fontFamily: "Outfit",
              fontSize: nameSize,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            {member.name}
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 9,
              color: roleColor.main,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: 4,
              textShadow: `0 0 12px ${roleColor.glow}`,
            }}
          >
            {member.role}
          </div>
        </div>

        <div
          style={{
            fontFamily: "Inter",
            fontSize: deptSize,
            color: "rgba(248,248,255,0.65)",
            lineHeight: 1.4,
          }}
        >
          {member.dept}
          {member.year ? ` · ${member.year}` : ""}
        </div>

        <HudCorners size={16} inset={-6} color={roleColor.main} />
      </div>
    </motion.button>
  );
}

/* Domain Hierarchy View (Centered Strictly for Mobile) */
function DomainHierarchyView({
  domain,
  director,
  deputies,
  onSelect,
  onClose,
  viewport,
}: {
  domain: string;
  director: Member;
  deputies: Member[];
  onSelect: (m: Member) => void;
  onClose: () => void;
  viewport: "mobile" | "tablet" | "desktop";
}) {
  const roleColor =
    roleColors[director.role as keyof typeof roleColors] ??
    roleColors["Director"];

  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";

  return (
    <motion.div
      key={domain}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: isMobile ? "center" : "flex-start",
        gap: 0,
        padding: isMobile
          ? "20px 14px"
          : isTablet
            ? "100px 20px 50px"
            : "50px 24px 60px",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      {/* Domain label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          fontFamily: "JetBrains Mono",
          fontSize: isMobile ? 9 : 11,
          letterSpacing: "0.22em",
          color: roleColor.main,
          textTransform: "uppercase",
          marginBottom: isMobile ? 12 : 20,
          textShadow: `0 0 14px ${roleColor.glow}`,
          textAlign: "center",
        }}
      >
        <TypewriterLabel text={`// ${domain}`} delay={80} />
      </motion.div>

      {/* Director */}
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.85, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 220,
          delay: 0.15,
        }}
      >
        <StaticMemberCard
          member={director}
          onSelect={onSelect}
          size="lg"
          viewport={viewport}
        />
      </motion.div>

      {deputies.length > 0 && (
        <>
          {/* Vertical connector: director -> horizontal bar */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.3, ease: "easeOut" }}
            style={{
              width: 2,
              height: isMobile ? 18 : 32,
              transformOrigin: "top",
              background: `linear-gradient(180deg, ${roleColor.glow}, rgba(196,181,253,0.15))`,
            }}
          />

          {/* Horizontal bar spanning the deputies */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.35, ease: "easeOut" }}
            style={{
              height: 2,
              width: `min(90%, ${deputies.length * (isMobile ? 130 : isTablet ? 180 : 230)}px)`,
              maxWidth: 900,
              background: "rgba(196,181,253,0.35)",
            }}
          />

          {/* Deputies row, each with its own stem */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: isMobile ? 10 : isTablet ? 22 : 28,
              justifyContent: "center",
              marginTop: 0,
              maxWidth: 1000,
              width: "100%",
            }}
          >
            {deputies.map((deputy, i) => {
              const depColor =
                roleColors[deputy.role as keyof typeof roleColors] ??
                roleColors["Director"];
              return (
                <div
                  key={deputy.name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.25 }}
                    style={{
                      width: 2,
                      height: isMobile ? 14 : 22,
                      transformOrigin: "top",
                      background: `linear-gradient(180deg, rgba(196,181,253,0.35), ${depColor.glow})`,
                    }}
                  />
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 30,
                      scale: 0.8,
                      filter: "blur(5px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    transition={{
                      delay: 0.65 + i * 0.08,
                      type: "spring",
                      damping: 18,
                      stiffness: 210,
                    }}
                  >
                    <StaticMemberCard
                      member={deputy}
                      onSelect={onSelect}
                      viewport={viewport}
                    />
                  </motion.div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Close / clear filter */}
      <motion.button
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        style={{
          marginTop: isMobile ? 18 : 36,
          border: "1px solid rgba(196,181,253,0.3)",
          background: "rgba(7,7,26,0.72)",
          backdropFilter: "blur(14px)",
          color: "#C4B5FD",
          padding: "8px 18px",
          borderRadius: 999,
          fontFamily: "JetBrains Mono",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        ✕ Clear filter
      </motion.button>
    </motion.div>
  );
}

/* Terminal Domain Menu */
function TerminalDomainMenu({
  groups,
  activeDomain,
  onSelect,
  viewport,
}: {
  groups: typeof domainGroups;
  activeDomain: string | null;
  onSelect: (domain: string) => void;
  viewport: "mobile" | "tablet" | "desktop";
}) {
  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";

  const panelWidth = isMobile ? 120 : isTablet ? 190 : 222;
  const rightOffset = isMobile ? 10 : isTablet ? 16 : 40;
  const rowFontSize = isMobile ? 8 : isTablet ? 9 : 10;
  const rowPadding = isMobile ? "6px 8px" : isTablet ? "8px 10px" : "11px 14px";
  const headerPadding = isMobile ? "6px 8px" : "10px 14px";
  const headerFontSize = isMobile ? 8 : isTablet ? 9 : 10;

  return (
    <motion.div
      initial={{ opacity: 0, x: 70, scaleY: 0.85 }}
      animate={{ opacity: 1, x: 0, scaleY: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        top: isMobile ? "auto" : "50%",
        bottom: isMobile ? 16 : "auto",
        right: rightOffset,
        transform: isMobile ? "none" : "translateY(-50%)",
        transformOrigin: "right center",
        zIndex: 40,
        width: panelWidth,
        maxHeight: "75vh",
        overflowY: "auto",
        borderRadius: 8,
        border: "1px solid rgba(196,181,253,0.16)",
        background: "rgba(9,7,20,0.75)",
        backdropFilter: "blur(18px)",
        boxShadow:
          "0 0 22px rgba(124,58,237,0.08), inset 0 0 28px rgba(124,58,237,0.04), 0 14px 30px rgba(0,0,0,0.4)",
        overflow: "hidden",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          position: "relative",
          padding: headerPadding,
          borderBottom: "1px solid rgba(196,181,253,0.14)",
          background: "rgba(124,58,237,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: headerFontSize,
            color: "#C4B5FD",
            letterSpacing: "0.16em",
            textShadow: "0 0 8px rgba(168,85,247,0.4)",
          }}
        >
          <TypewriterLabel text="DOMAIN.SYS" delay={150} />
        </span>
        <motion.div
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#C4B5FD",
            boxShadow: "0 0 6px rgba(168,85,247,0.5)",
            flexShrink: 0,
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {groups.map((group, i) => {
          const isActive = activeDomain === group.domain;
          return (
            <motion.button
              key={group.domain}
              onClick={() => onSelect(group.domain)}
              whileTap={{ scale: 0.97 }}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 6,
                width: "100%",
                boxSizing: "border-box",
                padding: rowPadding,
                border: "none",
                borderBottom:
                  i < groups.length - 1
                    ? "1px solid rgba(196,181,253,0.07)"
                    : "none",
                background: isActive ? "rgba(124,58,237,0.15)" : "transparent",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "JetBrains Mono",
                fontSize: rowFontSize,
                letterSpacing: "0.05em",
                color: isActive ? "#C4B5FD" : "rgba(196,181,253,0.55)",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="terminal-active-bar"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: "#A78BFA",
                    boxShadow: "0 0 8px rgba(168,85,247,0.5)",
                  }}
                />
              )}
              <span style={{ opacity: 0.4, flexShrink: 0 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  flex: 1,
                  textTransform: "uppercase",
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {group.domain}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function Committee() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [lockingMember, setLockingMember] = useState<Member | null>(null);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );

  const vScrollTarget = useRef(0);
  const lockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeDomainRef = useRef<string | null>(null);

  const vScroll = useSpring(0, { stiffness: 95, damping: 24, mass: 1.0 });

  useEffect(() => {
    activeDomainRef.current = activeDomain;
  }, [activeDomain]);

  useEffect(() => {
    const checkWidth = () => {
      const w = window.innerWidth;
      setViewport(w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop");
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const handleDomainSelect = (domain: string) => {
    setActiveDomain((prev) => (prev === domain ? null : domain));
  };

  const clearFilter = () => setActiveDomain(null);

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
      if (activeDomainRef.current) return;
      vScrollTarget.current += e.deltaY * 1.2;
      vScroll.set(vScrollTarget.current);
    };

    let lastY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (activeDomainRef.current) return;
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

  useAnimationFrame((_, delta) => {
    if (activeDomainRef.current) return;
    vScrollTarget.current += delta * 0.026;
    vScroll.set(vScrollTarget.current);
  });

  const roleColor =
    roleColors[selectedMember?.role as keyof typeof roleColors] ??
    roleColors["Director"];

  const activeGroup = activeDomain
    ? domainGroups.find((g) => g.domain === activeDomain) ?? null
    : null;

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
          perspective:
            viewport === "mobile"
              ? "750px"
              : viewport === "tablet"
                ? "1050px"
                : "1200px",
          perspectiveOrigin: "50% 48%",
          transformStyle: "preserve-3d",
        }}
      >
        <TerminalDomainMenu
          groups={domainGroups}
          activeDomain={activeDomain}
          onSelect={handleDomainSelect}
          viewport={viewport}
        />

        {/* Backdrop Lighting */}
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

        {/* 3D Helix (Rendered on Mobile, Tablet & Desktop) */}
        <AnimatePresence mode="wait">
          {activeGroup ? (
            <DomainHierarchyView
              key={activeGroup.domain}
              domain={activeGroup.domain}
              director={activeGroup.director}
              deputies={activeGroup.deputies}
              onSelect={handleSelect}
              onClose={clearFilter}
              viewport={viewport}
            />
          ) : (
            <motion.div
              key="helix"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                position: "absolute",
                inset: 0,
                transformStyle: "preserve-3d",
                pointerEvents: "none",
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
            </motion.div>
          )}
        </AnimatePresence>

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
                backdropFilter: "blur(20px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: viewport === "mobile" ? 12 : 24,
                cursor: "pointer",
              }}
            >
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
                  maxHeight: viewport === "mobile" ? "92vh" : undefined,
                  minHeight: viewport === "mobile" ? 300 : 380,
                  borderRadius: 12,
                  background: roleColor.background,
                  boxShadow:
                    "0 0 100px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                  cursor: "auto",
                  overflow: viewport === "mobile" ? "auto" : "hidden",
                  display: "flex",
                  flexDirection:
                    viewport === "mobile" ? "column-reverse" : "row",
                  alignItems: "stretch",
                }}
              >
                <ChromaticFlash duration={0.4} />

                {/* Left column: details */}
                <div
                  style={{
                    flex: "1 1 56%",
                    minWidth: 0,
                    padding:
                      viewport === "mobile" ? "20px 16px 24px" : "40px 36px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 12,
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
                      fontSize: viewport === "mobile" ? 22 : 30,
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1.15,
                      margin: 0,
                    }}
                  >
                    <GlitchText text={selectedMember.name} delay={180} />
                  </h2>

                  <div
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 11,
                      color: roleColor.main,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    {selectedMember.role}
                  </div>

                  <p
                    style={{
                      fontFamily: "Inter",
                      color: "rgba(248,248,255,0.7)",
                      lineHeight: 1.5,
                      fontSize: 14,
                      margin: 0,
                    }}
                  >
                    {selectedMember.dept}
                    {selectedMember.year ? ` · ${selectedMember.year}` : ""}
                  </p>

                  {selectedMember.quote && (
                    <p
                      style={{
                        fontFamily: "Inter",
                        color: "rgba(248,248,255,0.5)",
                        lineHeight: 1.4,
                        fontSize: 13,
                        margin: 0,
                        fontStyle: "italic",
                        borderLeft: `2px solid ${roleColor.glow}`,
                        paddingLeft: 10,
                      }}
                    >
                      "{selectedMember.quote}"
                    </p>
                  )}

                  {/* Social Links with Icons in Modal */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{ display: "flex", gap: 16, marginTop: 4 }}
                  >
                    {selectedMember.linkedin &&
                      selectedMember.linkedin !== "#" && (
                        <a
                          href={selectedMember.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "rgba(248,248,255,0.6)",
                            textDecoration: "none",
                            fontFamily: "JetBrains Mono",
                            fontSize: 11,
                            letterSpacing: "0.05em",
                            transition: "color 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = roleColor.main)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color =
                              "rgba(248,248,255,0.6)")
                          }
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          LinkedIn
                        </a>
                      )}
                    {selectedMember.instagram &&
                      selectedMember.instagram !== "#" && (
                        <a
                          href={selectedMember.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "rgba(248,248,255,0.6)",
                            textDecoration: "none",
                            fontFamily: "JetBrains Mono",
                            fontSize: 11,
                            letterSpacing: "0.05em",
                            transition: "color 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = roleColor.main)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color =
                              "rgba(248,248,255,0.6)")
                          }
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                          Instagram
                        </a>
                      )}
                  </motion.div>
                </div>

                {/* Right column: image */}
                <div
                  style={{
                    position: "relative",
                    flex: viewport === "mobile" ? "0 0 160px" : "0 0 42%",
                    width: viewport === "mobile" ? "100%" : undefined,
                    alignSelf: "stretch",
                    overflow: "hidden",
                  }}
                >
                  {selectedMember.image ? (
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
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "rgba(255,255,255,0.03)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(255,255,255,0.1)",
                        fontSize: 48,
                        fontFamily: "Outfit",
                      }}
                    >
                      {selectedMember.name.charAt(0)}
                    </div>
                  )}
                </div>

                <HudCorners size={22} inset={8} color={roleColor.main} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}