import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";
// Theme
const THEME = {
  violet: 0x7c3aed,
  violetLight: 0xc4b5fd,
  cyan: 0x22d3ee,
  bg: "#050311",
};

interface CyberLoaderProps {
  progress?: number;

  duration?: number;

  holdAt?: number;

  completeHoldMs?: number;
  onComplete?: () => void;
  title?: string;
  fullScreen?: boolean;
  portal?: boolean;
  qubitCount?: number;
}

const BOOT_MESSAGES = [
  { at: 0, text: "INITIALIZING QUBIT ARRAY" },
  { at: 18, text: "PREPARING BASIS STATES" },
  { at: 38, text: "ENTERING SUPERPOSITION" },
  { at: 58, text: "ESTABLISHING ENTANGLEMENT" },
  { at: 76, text: "COLLAPSING WAVEFUNCTION" },
  { at: 92, text: "RENDERING INTERFACE" },
];

function TerminalLine({ text }: { text: string }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    const interval = setInterval(() => {
      setShown((s) => {
        if (s >= text.length) {
          clearInterval(interval);
          return s;
        }
        return s + 1;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [text]);

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

function HudFrame({ color }: { color: string }) {
  const corners: { style: React.CSSProperties; rotate: number; key: string }[] =
    [
      { style: { top: 18, left: 18 }, rotate: 0, key: "tl" },
      { style: { top: 18, right: 18 }, rotate: 90, key: "tr" },
      { style: { bottom: 18, right: 18 }, rotate: 180, key: "br" },
      { style: { bottom: 18, left: 18 }, rotate: 270, key: "bl" },
    ];
  return (
    <>
      {corners.map(({ style, rotate, key }) => (
        <div
          key={key}
          style={{
            position: "absolute",
            width: 28,
            height: 28,
            ...style,
            pointerEvents: "none",
          }}
        >
          <svg
            width={28}
            height={28}
            viewBox="0 0 20 20"
            style={{ transform: `rotate(${rotate}deg)`, display: "block" }}
          >
            <path
              d="M1 9 L1 1 L9 1"
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.7}
            />
          </svg>
        </div>
      ))}
    </>
  );
}

function makeGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.55)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/* ===========================================================
   Small numeric helpers for the phase timeline below.
=========================================================== */
function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}
function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}
function easeInCubic(x: number) {
  return x * x * x;
}

function setupScene(container: HTMLDivElement, qubitCount: number): () => void {
  const N = Math.max(2, Math.min(4, Math.round(qubitCount)));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const gl = renderer.getContext();
  if (!gl) {
    renderer.dispose();
    throw new Error("WebGL context could not be created");
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.appendChild(renderer.domElement);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";

  const glowTexture = makeGlowTexture();
  const disposables: Array<{ dispose: () => void }> = [glowTexture];
  const track = <T extends { dispose: () => void }>(obj: T): T => {
    disposables.push(obj);
    return obj;
  };

  /* --- Central qubit: Bloch-sphere-style wireframe + core + halo --- */
  const qubit = new THREE.Group();

  const coreGeo = track(new THREE.SphereGeometry(0.2, 20, 20));
  const coreMat = track(
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    }),
  );
  const core = new THREE.Mesh(coreGeo, coreMat);
  qubit.add(core);

  const wireGeo = track(new THREE.SphereGeometry(0.7, 14, 10));
  const wireMat = track(
    new THREE.MeshBasicMaterial({
      color: THEME.violetLight,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
    }),
  );
  const blochWire = new THREE.Mesh(wireGeo, wireMat);
  qubit.add(blochWire);

  const equatorGeo = track(new THREE.TorusGeometry(0.7, 0.006, 8, 96));
  const equatorMat = track(
    new THREE.MeshBasicMaterial({
      color: THEME.cyan,
      transparent: true,
      opacity: 0.5,
    }),
  );
  const equatorRing = new THREE.Mesh(equatorGeo, equatorMat);
  equatorRing.rotation.x = Math.PI / 2;
  qubit.add(equatorRing);

  const haloMat = track(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: THEME.violet,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const halo = new THREE.Sprite(haloMat);
  halo.scale.set(2.6, 2.6, 1);
  qubit.add(halo);

  scene.add(qubit);

  /* --- Orbiting particles + their superposition "ghost" trails --- */
  const orbitRadius = 1.9;
  const tiltPool = [0.15, -0.42, 0.55, -0.08];
  const tilts = Array.from(
    { length: N },
    (_, i) => tiltPool[i % tiltPool.length],
  );
  const phases = Array.from({ length: N }, (_, i) => (i / N) * Math.PI * 2);
  const orbitSpeeds = Array.from({ length: N }, (_, i) => 0.5 + i * 0.07);
  const ghostOffsets = [-0.55, -0.2, 0.2, 0.55];

  const colorA = new THREE.Color(THEME.violet);
  const colorB = new THREE.Color(THEME.cyan);
  const highlightColor = new THREE.Color(0xffffff);

  interface Particle {
    main: THREE.Mesh;
    glow: THREE.Sprite;
    ghosts: { sprite: THREE.Sprite; offset: number }[];
    baseColor: THREE.Color;
    activeGhost: number;
    nextSwitchAt: number;
  }

  const particles: Particle[] = [];

  for (let i = 0; i < N; i++) {
    const baseColor = colorA.clone().lerp(colorB, N === 1 ? 0 : i / (N - 1));

    const mainGeo = track(new THREE.SphereGeometry(0.085, 16, 16));
    const mainMat = track(
      new THREE.MeshBasicMaterial({
        color: baseColor.clone(),
        transparent: true,
      }),
    );
    const main = new THREE.Mesh(mainGeo, mainMat);
    scene.add(main);

    const glowMat = track(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: baseColor.clone(),
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(0.42, 0.42, 1);
    main.add(glow);

    const ghosts = ghostOffsets.map((offset) => {
      const gMat = track(
        new THREE.SpriteMaterial({
          map: glowTexture,
          color: baseColor.clone(),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      const sprite = new THREE.Sprite(gMat);
      sprite.scale.set(0.26, 0.26, 1);
      scene.add(sprite);
      return { sprite, offset };
    });

    particles.push({
      main,
      glow,
      ghosts,
      baseColor,
      activeGhost: 0,
      nextSwitchAt: 0,
    });
  }

  /* --- Faint static rings showing each orbital plane --- */
  const uniqueTilts = Array.from(new Set(tilts));
  const guideRings: THREE.Mesh[] = uniqueTilts.map((tilt) => {
    const geo = track(new THREE.TorusGeometry(orbitRadius, 0.004, 6, 96));
    const mat = track(
      new THREE.MeshBasicMaterial({
        color: THEME.violetLight,
        transparent: true,
        opacity: 0.1,
      }),
    );
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = Math.PI / 2;
    ring.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), tilt);
    scene.add(ring);
    return ring;
  });

  /* --- Entanglement beam (reused, repositioned every frame) --- */
  const beamGeo = track(
    new THREE.CylinderGeometry(0.016, 0.016, 1, 8, 1, true),
  );
  const beamMat = track(
    new THREE.MeshBasicMaterial({
      color: THEME.cyan,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    }),
  );
  const beam = new THREE.Mesh(beamGeo, beamMat);
  scene.add(beam);

  /* --- Measurement flash --- */
  const flashMat = track(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const flash = new THREE.Sprite(flashMat);
  flash.scale.set(0.3, 0.3, 1);
  scene.add(flash);

  /* --- Faint distant starfield for depth (purely ambient) --- */
  const starCount = 220;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const radius = 4.4 + Math.random() * 2.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = radius * Math.cos(phi);
  }
  const starGeo = track(new THREE.BufferGeometry());
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starMat = track(
    new THREE.PointsMaterial({
      size: 0.02,
      color: THEME.violetLight,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  /* --- Resize handling --- */
  const resize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
  } else {
    window.addEventListener("resize", resize);
  }

  /* -----------------------------------------------------------
     Phase timeline (seconds), one full narrative loop:
       0.0 – 0.5  appear      qubit pulses, particles spawn outward
       0.5 – 1.0  orbit       steady orbiting, nothing special
       1.0 – 1.5  superpose   ghost trails + rapid position hops
       1.5 –2.0  entangle    two particles link with a glowing beam
      2.0 – 2.5  measure     everything rushes to the center
       2.5 – 3  flash/rest  bright pulse, brief pause, loop
  ----------------------------------------------------------- */
  const P1 = 0.5;
  const P2 = 1.0;
  const P3 = 1.5;
  const P4 = 2.0;
  const P5 = 2.5;
  const CYCLE = 3;

  const X_AXIS = new THREE.Vector3(1, 0, 0);
  const Y_AXIS = new THREE.Vector3(0, 1, 0);
  const v = new THREE.Vector3();
  const gv = new THREE.Vector3();
  const mid = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const clock = new THREE.Clock();
  let raf = 0;
  let disposed = false;

  const animate = () => {
    if (disposed) return;
    const t = clock.getElapsedTime();
    const delta = clock.getDelta();
    const cycleT = t % CYCLE;

    /* ---- qubit: idle life + a spawn pulse at the start of P1 ---- */
    let spawnPulse = 0;
    if (cycleT < P1) {
      const p = cycleT / P1;
      spawnPulse = Math.sin(p * Math.PI); // rises then settles back to 0
    }
    const idlePulse = Math.sin(t * 3) * 0.08;
    core.scale.setScalar(1 + spawnPulse * 0.6 + idlePulse);
    haloMat.opacity = 0.4 + spawnPulse * 0.4 + Math.sin(t * 2.4) * 0.1;
    blochWire.rotation.y += delta * 0.15;
    blochWire.rotation.x = Math.sin(t * 0.3) * 0.15;
    equatorRing.rotation.z += delta * 0.12;

    /* ---- per-particle orbit / superposition / entanglement ---- */
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const angle = phases[i] + t * orbitSpeeds[i];

      // Radius envelope: spawn outward, hold, then collapse to center.
      let rFactor: number;
      if (cycleT < P1) rFactor = easeOutCubic(cycleT / P1);
      else if (cycleT < P4) rFactor = 1;
      else if (cycleT < P5)
        rFactor = 1 - easeInCubic((cycleT - P4) / (P5 - P4));
      else rFactor = 0;

      // Superposition: ghost trails fade in/out, main particle hops
      // between a handful of nearby candidate angles.
      let ghostVisibility = 0;
      let jitterAngle = 0;
      if (cycleT >= P2 && cycleT < P3) {
        const supT = cycleT - P2;
        const supDur = P3 - P2;
        ghostVisibility =
          smoothstep(0, 0.25, supT) *
          (1 - smoothstep(supDur - 0.25, supDur, supT));

        if (t >= p.nextSwitchAt) {
          p.activeGhost = Math.floor(Math.random() * ghostOffsets.length);
          p.nextSwitchAt = t + 0.08 + Math.random() * 0.08;
        }
        jitterAngle = ghostOffsets[p.activeGhost] * ghostVisibility;
      } else {
        p.nextSwitchAt = 0;
      }

      const finalAngle = angle + jitterAngle;
      const finalRadius = orbitRadius * rFactor;

      v.set(
        Math.cos(finalAngle) * finalRadius,
        0,
        Math.sin(finalAngle) * finalRadius,
      );
      v.applyAxisAngle(X_AXIS, tilts[i]);
      p.main.position.copy(v);

      for (const g of p.ghosts) {
        const gAngle = angle + g.offset;
        gv.set(
          Math.cos(gAngle) * finalRadius,
          0,
          Math.sin(gAngle) * finalRadius,
        );
        gv.applyAxisAngle(X_AXIS, tilts[i]);
        g.sprite.position.copy(gv);
        const flicker = 0.65 + 0.35 * Math.sin(t * 14 + i * 3 + g.offset * 8);
        (g.sprite.material as THREE.SpriteMaterial).opacity =
          ghostVisibility * 0.5 * flicker;
      }

      // Entanglement highlight: particles 0 & 1 flash to a shared color.
      let highlightT = 0;
      if (i === 0 || i === 1) {
        if (cycleT >= P3 && cycleT < P4) {
          const eT = cycleT - P3;
          const eDur = P4 - P3;
          highlightT =
            smoothstep(0, 0.2, eT) * (1 - smoothstep(eDur - 0.2, eDur, eT));
        }
      }
      (p.main.material as THREE.MeshBasicMaterial).color
        .copy(p.baseColor)
        .lerp(highlightColor, highlightT);
      (p.glow.material as THREE.SpriteMaterial).color
        .copy(p.baseColor)
        .lerp(highlightColor, highlightT);
    }

    /* ---- entanglement beam between particle 0 and particle 1 ---- */
    let beamOpacity = 0;
    if (particles.length >= 2 && cycleT >= P3 && cycleT < P4) {
      const eT = cycleT - P3;
      const eDur = P4 - P3;
      beamOpacity =
        smoothstep(0, 0.15, eT) * (1 - smoothstep(eDur - 0.15, eDur, eT));
      beamOpacity *= 0.55 + 0.25 * Math.sin(t * 6);
    }
    if (beamOpacity > 0.001 && particles.length >= 2) {
      const a = particles[0].main.position;
      const b = particles[1].main.position;
      mid.copy(a).add(b).multiplyScalar(0.5);
      dir.copy(b).sub(a);
      const len = Math.max(0.0001, dir.length());
      beam.position.copy(mid);
      beam.scale.set(1, len, 1);
      beam.quaternion.setFromUnitVectors(Y_AXIS, dir.normalize());
    }
    beamMat.opacity = beamOpacity;

    /* ---- measurement flash, timed to when particles reach center ---- */
    let flashOpacity = 0;
    const fT = cycleT - P5;
    if (fT >= -0.05 && fT < 0.35) {
      flashOpacity =
        fT < 0.05
          ? smoothstep(-0.05, 0.05, fT)
          : Math.max(0, 1 - (fT - 0.05) / 0.3);
    }
    flashMat.opacity = flashOpacity;
    flash.scale.setScalar(0.3 + flashOpacity * 1.8);

    /* ---- ambient camera drift + starfield ---- */
    stars.rotation.y += delta * 0.015;
    camera.position.x = Math.sin(t * 0.4) * 0.2;
    camera.position.y = Math.sin(t * 0.55) * 0.14;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  };
  animate();

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    if (resizeObserver) resizeObserver.disconnect();
    else window.removeEventListener("resize", resize);
    renderer.dispose();
    for (const d of disposables) d.dispose();
    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement);
    }
  };
}

export default function CyberLoader({
  progress,
  duration = 3200,
  holdAt = 100,
  completeHoldMs = 500,
  onComplete,
  title = "SYSTEM.BOOT",
  fullScreen = true,
  portal = fullScreen,
  qubitCount = 3,
}: CyberLoaderProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [mounted, setMounted] = useState(true);
  const firedRef = useRef(false);

  const isControlled = typeof progress === "number";
  // Always true in a real browser tab; guards SSR frameworks from
  // touching `document` during server rendering.
  const canRenderDom = typeof document !== "undefined";

  /* -----------------------------------------------------------
     Progress driver: auto-runs 0→100 (or →holdAt) unless
     `progress` is supplied, in which case it eases toward it.
  ----------------------------------------------------------- */
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const startValue = displayProgress;

    const tick = (now: number) => {
      if (isControlled) {
        const target = Math.max(0, Math.min(100, progress as number));
        setDisplayProgress((prev) => {
          const next = prev + (target - prev) * 0.12;
          return Math.abs(target - next) < 0.15 ? target : next;
        });
        raf = requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplayProgress(startValue + (holdAt - startValue) * eased);

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, isControlled, duration, holdAt]);

  useEffect(() => {
    const completionTarget = isControlled ? 100 : holdAt;
    if (
      completionTarget >= 99.6 &&
      displayProgress >= 99.6 &&
      !firedRef.current
    ) {
      firedRef.current = true;
      const t = setTimeout(() => {
        onComplete?.();
        if (!isControlled) setMounted(false);
      }, completeHoldMs);
      return () => clearTimeout(t);
    }
  }, [displayProgress, completeHoldMs, onComplete, isControlled, holdAt]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let cleanup: (() => void) | null = null;
    try {
      cleanup = setupScene(container, qubitCount);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[CyberLoader] 3D scene skipped:", err);
    }

    return () => {
      try {
        cleanup?.();
      } catch {
        /* no-op — best-effort teardown */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roundedProgress = Math.min(
    100,
    Math.max(0, Math.round(displayProgress)),
  );

  const activeMessage =
    [...BOOT_MESSAGES].reverse().find((m) => roundedProgress >= m.at)?.text ??
    BOOT_MESSAGES[0].text;

  if (!canRenderDom) return null;

  const content = (
    <AnimatePresence>
      {mounted && (
        <motion.div
          data-cyberloader="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: fullScreen ? "fixed" : "absolute",
            inset: 0,
            zIndex: 2147483000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            background: `radial-gradient(ellipse 90% 70% at 50% 45%, rgba(124,58,237,0.16) 0%, transparent 62%), ${THEME.bg}`,
          }}
        >
          {/* Three.js canvas mount — purely decorative, safe to fail */}
          <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />

          {/* Ambient vertical scanline */}
          <motion.div
            initial={{ top: "-6%", opacity: 0 }}
            animate={{ top: "106%", opacity: [0, 0.5, 0.5, 0] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0.6,
            }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 2,
              background:
                "linear-gradient(90deg, transparent, rgba(196,181,253,0.55), transparent)",
              boxShadow: "0 0 14px rgba(168,85,247,0.5)",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />

          <HudFrame color="rgba(196,181,253,0.6)" />

          {/* Top-left terminal label */}
          <div
            style={{
              position: "absolute",
              top: 30,
              left: 34,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10,
              letterSpacing: "0.22em",
              color: "#C4B5FD",
              textTransform: "uppercase",
              textShadow: "0 0 10px rgba(168,85,247,0.5)",
              zIndex: 4,
            }}
          >
            <TerminalLine text={title} />
          </div>

          {/* Top-right status dot */}
          <div
            style={{
              position: "absolute",
              top: 34,
              right: 40,
              display: "flex",
              alignItems: "center",
              gap: 6,
              zIndex: 4,
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22D3EE",
                boxShadow: "0 0 8px rgba(34,211,238,0.6)",
              }}
            />
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 9,
                letterSpacing: "0.16em",
                color: "rgba(196,181,253,0.6)",
                textTransform: "uppercase",
              }}
            >
              online
            </span>
          </div>

          {/* Bottom console: percentage, bar, boot line */}
          <div
            style={{
              position: "absolute",
              bottom: "12%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              zIndex: 4,
              width: "min(90vw, 360px)",
            }}
          >
            <motion.div
              key={roundedProgress}
              initial={{ opacity: 0.4, filter: "blur(3px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.18 }}
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: 700,
                fontSize: 46,
                letterSpacing: "0.04em",
                lineHeight: 1,
                backgroundImage: "linear-gradient(90deg, #C4B5FD, #22D3EE)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                filter: "drop-shadow(0 0 18px rgba(124,58,237,0.35))",
              }}
            >
              {String(roundedProgress).padStart(3, "0")}%
            </motion.div>

            <div
              style={{
                position: "relative",
                width: "100%",
                height: 3,
                borderRadius: 3,
                background: "rgba(196,181,253,0.12)",
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{ width: `${roundedProgress}%` }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  inset: "0 auto 0 0",
                  height: "100%",
                  borderRadius: 3,
                  background: "linear-gradient(90deg, #7C3AED, #22D3EE)",
                  boxShadow: "0 0 12px rgba(124,58,237,0.6)",
                }}
              />
            </div>

            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10,
                letterSpacing: "0.14em",
                color: "rgba(196,181,253,0.6)",
                textTransform: "uppercase",
                minHeight: 14,
                textAlign: "center",
              }}
            >
              <TerminalLine text={`// ${activeMessage}`} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (portal) {
    return createPortal(content, document.body);
  }

  return content;
}
