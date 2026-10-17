import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Environment, Float, Stars } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";

/* ==========================================================================
   QUANTUM INTRO — Society of Quantum Computing
   Cinematic boot sequence. R3F + drei + postprocessing + framer-motion.
   ========================================================================== */

const PALETTE = {
  bg0: "#03030f",
  bg1: "#07071a",
  bg2: "#0d0d2b",
  primary: "#7c3aed",
  primary2: "#a855f7",
  primary3: "#c4b5fd",
  hlPurple: "#8b5cf6",
  hlMagenta: "#d946ef",
  hlCyan: "#22d3ee",
  text: "#f8f8ff",
};

// Global normalized progress 0..1 across the whole ~11s timeline
type SceneCtx = { t: number; duration: number };

// ---------- Nebula background (shader plane) ----------
function NebulaBackground({ ctx }: { ctx: SceneCtx }) {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(PALETTE.bg0) },
      uColorB: { value: new THREE.Color(PALETTE.bg2) },
      uColorC: { value: new THREE.Color(PALETTE.primary) },
      uColorD: { value: new THREE.Color(PALETTE.hlMagenta) },
    }),
    [],
  );
  return (
    <mesh position={[0, 0, -30]} scale={[80, 50, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `}
        fragmentShader={`
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColorA, uColorB, uColorC, uColorD;
          // simplex-ish noise (cheap fbm)
          float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
          float noise(vec2 p){
            vec2 i=floor(p), f=fract(p);
            float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
            vec2 u=f*f*(3.0-2.0*f);
            return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
          }
          float fbm(vec2 p){ float v=0., a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5;} return v; }
          void main(){
            vec2 uv = vUv - 0.5;
            uv.x *= 1.6;
            float t = uTime * 0.05;
            float n = fbm(uv*2.5 + vec2(t, -t*0.7));
            float n2 = fbm(uv*4.0 - vec2(t*0.6, t));
            vec3 col = mix(uColorA, uColorB, n);
            col = mix(col, uColorC*0.6, smoothstep(0.55,0.9,n));
            col += uColorD*0.25*smoothstep(0.7,1.0,n2);
            // vignette
            float d = length(uv);
            col *= smoothstep(1.2, 0.2, d);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

// ---------- GPU particle field ----------
function ParticleField({ count = 2500, ctx }: { count?: number; ctx: SceneCtx }) {
  const ref = useRef<THREE.Points>(null!);
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 14;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
      positions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      positions[i * 3 + 2] = r * Math.cos(ph) - 2;
      seeds[i] = Math.random();
    }
    return { positions, seeds };
  }, [count]);

  const mat = useRef<THREE.ShaderMaterial>(null!);
  useFrame((_, dt) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value += dt;
      // attraction factor grows in scene 2
      const attract = THREE.MathUtils.clamp((ctx.t - 0.5) / 1.5, 0, 1);
      mat.current.uniforms.uAttract.value = attract;
    }
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uAttract: { value: 0 },
          uColor: { value: new THREE.Color(PALETTE.primary2) },
        }}
        vertexShader={`
          attribute float aSeed;
          uniform float uTime;
          uniform float uAttract;
          varying float vAlpha;
          void main(){
            vec3 p = position;
            float wobble = sin(uTime*0.6 + aSeed*20.0)*0.3;
            p += normalize(p)*wobble;
            // gently pulled toward center
            p = mix(p, p*0.2, uAttract*0.6);
            vec4 mv = modelViewMatrix * vec4(p,1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (1.0 + aSeed*2.5) * (300.0 / -mv.z);
            vAlpha = 0.35 + aSeed*0.65;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vAlpha;
          void main(){
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(uColor, a*vAlpha);
          }
        `}
      />
    </points>
  );
}

// ---------- Central quantum energy point (scene 2) ----------
function QuantumCore({ ctx }: { ctx: SceneCtx }) {
  const g = useRef<THREE.Group>(null!);
  const mat = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame(({ clock }) => {
    const t = ctx.t;
    // visible 0.5 -> 2.2, then fades under processor
    const vis = THREE.MathUtils.clamp((t - 0.5) / 0.4, 0, 1) * (1 - THREE.MathUtils.clamp((t - 2.0) / 0.4, 0, 1));
    const pulse = 1 + Math.sin(clock.elapsedTime * 6) * 0.15;
    if (g.current) {
      g.current.scale.setScalar(vis * pulse * 0.6);
      g.current.visible = vis > 0.01;
    }
    if (mat.current) mat.current.opacity = vis;
  });
  return (
    <group ref={g}>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial ref={mat} color={PALETTE.primary3} transparent />
      </mesh>
      {/* shockwave rings */}
      {[0, 1, 2].map((i) => (
        <Shockwave key={i} delay={i * 0.4} ctx={ctx} />
      ))}
    </group>
  );
}
function Shockwave({ delay, ctx }: { delay: number; ctx: SceneCtx }) {
  const ref = useRef<THREE.Mesh>(null!);
  const mat = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame(({ clock }) => {
    const t = ((clock.elapsedTime + delay) % 1.6) / 1.6;
    if (ref.current) {
      ref.current.scale.setScalar(0.5 + t * 6);
      ref.current.rotation.x = -Math.PI / 2;
    }
    const activeScene = ctx.t > 0.6 && ctx.t < 2.2 ? 1 : 0;
    if (mat.current) mat.current.opacity = (1 - t) * 0.4 * activeScene;
  });
  return (
    <mesh ref={ref}>
      <ringGeometry args={[0.9, 1.0, 64]} />
      <meshBasicMaterial ref={mat} color={PALETTE.hlMagenta} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

// ---------- Processor: frame drawing + body + rotation ----------
function Processor({ ctx }: { ctx: SceneCtx }) {
  const g = useRef<THREE.Group>(null!);
  const bodyMat = useRef<THREE.MeshStandardMaterial>(null!);
  const bodyMesh = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = ctx.t;
    if (!g.current) return;
    // Appear at t=2.0 (scene 3), rotate throughout, shrink at scene 12 (t>9)
    const appear = THREE.MathUtils.clamp((t - 2.0) / 0.6, 0, 1);
    const shrink = THREE.MathUtils.clamp((t - 9.2) / 0.8, 0, 1);
    const scale = THREE.MathUtils.lerp(0.01, 1.0, easeOutBack(appear)) * (1 - shrink * 0.85);
    g.current.scale.setScalar(scale);

    // Cinematic rotation: gentle Y sway across whole intro, big turn in scene 4 (t 3.2-4.4)
    const spin = THREE.MathUtils.smoothstep(t, 3.2, 4.4) * Math.PI * 0.9;
    const idleSway = Math.sin(clock.elapsedTime * 0.4) * 0.15;
    g.current.rotation.y = spin + idleSway;
    g.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.08 - 0.1;

    // Move to top on scene 12
    g.current.position.y = THREE.MathUtils.lerp(0, 2.2, shrink);
    g.current.position.z = THREE.MathUtils.lerp(0, 1.5, shrink);

    // material emissive pulses in scene 6 (t 5.5-6.5)
    if (bodyMat.current) {
      const alive = THREE.MathUtils.smoothstep(t, 5.3, 6.2);
      bodyMat.current.emissiveIntensity = 0.15 + alive * 0.6 * (0.8 + 0.2 * Math.sin(clock.elapsedTime * 8));
    }
  });

  return (
    <group ref={g}>
      {/* Metallic body — appears at scene 3 */}
      <mesh ref={bodyMesh} castShadow receiveShadow>
        <boxGeometry args={[3.2, 3.2, 0.35]} />
        <meshStandardMaterial
          ref={bodyMat}
          color={"#b8b8c8"}
          metalness={0.95}
          roughness={0.22}
          emissive={new THREE.Color(PALETTE.primary)}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Glowing edge frame (drawn effect) */}
      <EdgeFrame ctx={ctx} />
      {/* Pins */}
      <Pins ctx={ctx} />
      {/* Center |> symbol */}
      <SymbolAssembly ctx={ctx} />
      {/* Orbit + particles */}
      <QuantumOrbit ctx={ctx} />
    </group>
  );
}

function EdgeFrame({ ctx }: { ctx: SceneCtx }) {
  // 4 thin bars grow independently in scene 3 (t 2.0 -> 3.0)
  const bars = [
    { pos: [0, 1.65, 0.2], scale: [3.4, 0.06, 0.06], axis: "x", delay: 0.0 },
    { pos: [1.65, 0, 0.2], scale: [0.06, 3.4, 0.06], axis: "y", delay: 0.15 },
    { pos: [0, -1.65, 0.2], scale: [3.4, 0.06, 0.06], axis: "x", delay: 0.3 },
    { pos: [-1.65, 0, 0.2], scale: [0.06, 3.4, 0.06], axis: "y", delay: 0.45 },
  ] as const;

  return (
    <group>
      {bars.map((b, i) => (
        <EdgeBar key={i} {...b} ctx={ctx} />
      ))}
    </group>
  );
}
function EdgeBar({
  pos,
  scale,
  axis,
  delay,
  ctx,
}: {
  pos: readonly [number, number, number];
  scale: readonly [number, number, number];
  axis: "x" | "y";
  delay: number;
  ctx: SceneCtx;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    const t = ctx.t;
    const local = THREE.MathUtils.clamp((t - (1.7 + delay)) / 0.4, 0, 1);
    const s = easeOutCubic(local);
    if (ref.current) {
      if (axis === "x") ref.current.scale.set(s, 1, 1);
      else ref.current.scale.set(1, s, 1);
    }
  });
  return (
    <mesh ref={ref} position={pos as unknown as THREE.Vector3Tuple}>
      <boxGeometry args={scale as unknown as [number, number, number]} />
      <meshStandardMaterial
        color={PALETTE.primary3}
        emissive={new THREE.Color(PALETTE.primary2)}
        emissiveIntensity={2.5}
        toneMapped={false}
      />
    </mesh>
  );
}

// Pins on 4 sides grow outward
function Pins({ ctx }: { ctx: SceneCtx }) {
  const pins = useMemo(() => {
    const arr: { pos: [number, number, number]; dir: [number, number, number]; delay: number }[] = [];
    // top row (delay 0), bottom (0.25), left (0.5), right (0.75)
    const positions = [-1.0, 0, 1.0];
    positions.forEach((p) => arr.push({ pos: [p, 1.6, 0], dir: [0, 1, 0], delay: 0.0 }));
    positions.forEach((p) => arr.push({ pos: [p, -1.6, 0], dir: [0, -1, 0], delay: 0.25 }));
    positions.forEach((p) => arr.push({ pos: [-1.6, p, 0], dir: [-1, 0, 0], delay: 0.5 }));
    positions.forEach((p) => arr.push({ pos: [1.6, p, 0], dir: [1, 0, 0], delay: 0.75 }));
    return arr;
  }, []);
  return (
    <group>
      {pins.map((p, i) => (
        <Pin key={i} {...p} ctx={ctx} />
      ))}
    </group>
  );
}
function Pin({
  pos,
  dir,
  delay,
  ctx,
}: {
  pos: [number, number, number];
  dir: [number, number, number];
  delay: number;
  ctx: SceneCtx;
}) {
  const g = useRef<THREE.Group>(null!);
  const emissive = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame(({ clock }) => {
    const t = ctx.t;
    // scene 5: t 4.5 -> 5.4
    const local = THREE.MathUtils.clamp((t - (4.5 + delay * 0.3)) / 0.35, 0, 1);
    const grow = easeOutCubic(local);
    if (g.current) {
      g.current.position.set(
        pos[0] + dir[0] * 0.35 * grow,
        pos[1] + dir[1] * 0.35 * grow,
        pos[2],
      );
      g.current.scale.set(
        dir[0] !== 0 ? grow : 1,
        dir[1] !== 0 ? grow : 1,
        1,
      );
    }
    if (emissive.current) {
      const glow = local >= 1 ? 1 : 0;
      const wave = Math.sin(clock.elapsedTime * 4) * 0.5 + 0.5;
      emissive.current.emissiveIntensity = glow * (0.6 + 0.6 * wave * (t > 5.2 ? 1 : 0));
    }
  });
  return (
    <group ref={g} position={pos}>
      <mesh>
        <boxGeometry args={[dir[0] !== 0 ? 0.5 : 0.25, dir[1] !== 0 ? 0.5 : 0.25, 0.25]} />
        <meshStandardMaterial
          ref={emissive}
          color={"#1a1a24"}
          metalness={0.85}
          roughness={0.35}
          emissive={new THREE.Color(PALETTE.primary2)}
          emissiveIntensity={0}
        />
      </mesh>
    </group>
  );
}

// Center |> symbol assembled from particles
function SymbolAssembly({ ctx }: { ctx: SceneCtx }) {
  const targets = useMemo(() => {
    // Build target positions for the "|>" glyph
    const pts: THREE.Vector3[] = [];
    // vertical line
    for (let i = 0; i < 120; i++) {
      pts.push(new THREE.Vector3(-0.35, -0.6 + (i / 119) * 1.2, 0.22));
    }
    // ">" made of two segments
    for (let i = 0; i < 90; i++) {
      const t = i / 89;
      pts.push(new THREE.Vector3(0.05 + t * 0.5, -t * 0.55, 0.22));
      pts.push(new THREE.Vector3(0.05 + t * 0.5, t * 0.55, 0.22));
    }
    return pts;
  }, []);
  const count = targets.length;
  const starts = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 3;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr.push(new THREE.Vector3(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)));
    }
    return arr;
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const ref = useRef<THREE.Points>(null!);
  const mat = useRef<THREE.PointsMaterial>(null!);

  useFrame(() => {
    const t = ctx.t;
    // vertical line assembles 6.5-7.0, ">" assembles 7.0-7.6
    const attr = ref.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (!attr) return;
    for (let i = 0; i < count; i++) {
      const isVertical = i < 120;
      const start = isVertical ? 6.4 : 6.9;
      const dur = 0.55;
      const p = THREE.MathUtils.clamp((t - start) / dur, 0, 1);
      const e = easeOutCubic(p);
      const s = starts[i];
      const g = targets[i];
      const x = THREE.MathUtils.lerp(s.x, g.x, e);
      const y = THREE.MathUtils.lerp(s.y, g.y, e);
      const z = THREE.MathUtils.lerp(s.z, g.z, e);
      attr.setXYZ(i, x, y, z);
    }
    attr.needsUpdate = true;
    // pulse after assembly
    const pulse = ctx.t > 7.7 ? Math.max(0, 1 - (ctx.t - 7.7) / 0.4) : 0;
    if (mat.current) mat.current.size = 0.06 + pulse * 0.12;
  });

  return (
    <points ref={ref} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        color={PALETTE.text}
        size={0.06}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Orbit ring + red/blue particles
function QuantumOrbit({ ctx }: { ctx: SceneCtx }) {
  const ring = useRef<THREE.Mesh>(null!);
  const ringMat = useRef<THREE.ShaderMaterial>(null!);
  const red = useRef<THREE.Mesh>(null!);
  const blue = useRef<THREE.Mesh>(null!);
  const redTrail = useRef<THREE.Mesh>(null!);
  const blueTrail = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = ctx.t;
    const drawn = THREE.MathUtils.clamp((t - 7.7) / 0.6, 0, 1);
    if (ringMat.current) ringMat.current.uniforms.uProgress.value = drawn;

    const partVis = THREE.MathUtils.clamp((t - 8.2) / 0.4, 0, 1);
    const orbit = t > 8.9 ? THREE.MathUtils.clamp((t - 8.9) * 1.5, 0, 6) : 0;
    const angle = clock.elapsedTime * orbit;

    const R = 2.1;
    const tilt = 0.35;
    if (red.current) {
      red.current.position.set(Math.cos(angle) * R, Math.sin(angle) * R * tilt, Math.sin(angle) * R * 0.5);
      red.current.scale.setScalar(partVis * 0.25);
    }
    if (blue.current) {
      blue.current.position.set(Math.cos(angle + Math.PI) * R, Math.sin(angle + Math.PI) * R * tilt, Math.sin(angle + Math.PI) * R * 0.5);
      blue.current.scale.setScalar(partVis * 0.25);
    }
  });

  return (
    <group rotation={[0.2, 0.3, 0.1]}>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.1, 0.015, 16, 200]} />
        <shaderMaterial
          ref={ringMat}
          transparent
          uniforms={{
            uProgress: { value: 0 },
            uColor: { value: new THREE.Color(PALETTE.hlCyan) },
          }}
          vertexShader={`
            varying vec2 vUv;
            void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
          `}
          fragmentShader={`
            varying vec2 vUv;
            uniform float uProgress;
            uniform vec3 uColor;
            void main(){
              float a = step(vUv.x, uProgress);
              gl_FragColor = vec4(uColor*2.0, a);
            }
          `}
        />
      </mesh>
      <mesh ref={red}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color={"#ef4444"}
          emissive={new THREE.Color("#ef4444")}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={blue}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color={"#3b82f6"}
          emissive={new THREE.Color(PALETTE.hlCyan)}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// Camera choreography
function CameraRig({ ctx }: { ctx: SceneCtx }) {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const t = ctx.t;
    // Slow forward push during scenes 1-2, then settle, then orbit in scene 4, pull back scene 12
    const forward = THREE.MathUtils.smoothstep(t, 0.0, 2.0);
    const orbit = THREE.MathUtils.smoothstep(t, 3.2, 4.4);
    const pullback = THREE.MathUtils.smoothstep(t, 9.2, 10.0);

    const baseZ = THREE.MathUtils.lerp(14, 7, forward);
    const orbitZ = THREE.MathUtils.lerp(baseZ, 6.5, orbit);
    const finalZ = THREE.MathUtils.lerp(orbitZ, 10, pullback);

    const orbitX = Math.sin(orbit * Math.PI) * 2.2;
    const sway = Math.sin(clock.elapsedTime * 0.25) * 0.15;

    camera.position.x = orbitX + sway;
    camera.position.y = 0.2 + Math.sin(clock.elapsedTime * 0.2) * 0.1 - pullback * 1.2;
    camera.position.z = finalZ;
    camera.lookAt(0, THREE.MathUtils.lerp(0, 1.5, pullback), 0);
  });
  return null;
}

// White flash overlay in scene 11 (t ~ 8.9 -> 9.2)
function WhiteFlash({ ctx }: { ctx: SceneCtx }) {
  const [flash, setFlash] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      const t = ctx.t;
      let f = 0;
      if (t > 8.9 && t < 9.4) {
        const p = (t - 8.9) / 0.5;
        f = Math.sin(p * Math.PI);
      }
      setFlash(f);
    }, 33);
    return () => clearInterval(id);
  }, [ctx]);
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ backgroundColor: PALETTE.text, opacity: flash * 0.9, mixBlendMode: "screen" }}
    />
  );
}

/* ---------- helpers ---------- */
function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}
function easeOutBack(x: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

export function QuantumIntro({
  onComplete,
  short = false,
}: {
  onComplete: () => void;
  short?: boolean;
}) {
  const DURATION = short ? 3.2 : 11.0;
  const ctx = useRef<SceneCtx>({ t: 0, duration: DURATION }).current;
  const [now, setNow] = useState(0);
  const [canSkip, setCanSkip] = useState(short);
  const startRef = useRef<number>(performance.now());
  const doneRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const t = (performance.now() - startRef.current) / 1000;
      // for short, compress the timeline to just the reveal
      ctx.t = short ? 7.5 + t * 1.2 : t;
      setNow(t);
      if (!doneRef.current && t >= DURATION) {
        doneRef.current = true;
        onComplete();
      } else {
        raf = requestAnimationFrame(loop);
      }
    };
    raf = requestAnimationFrame(loop);
    const skipTimer = setTimeout(() => setCanSkip(true), short ? 0 : 3000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(skipTimer);
    };
  }, [DURATION, onComplete, short, ctx]);

  const skip = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
  };

  // Typography scene 13 (t 9.5+)
  const showTypography = now > (short ? 1.5 : 9.5);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ background: `radial-gradient(ellipse at center, ${PALETTE.bg2}, ${PALETTE.bg0} 70%)` }}
    >
      <Canvas
        camera={{ position: [0, 0, 14], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[PALETTE.bg0]} />
        <fog attach="fog" args={[PALETTE.bg0, 10, 40]} />
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color={"#ffffff"} />
        <pointLight position={[-4, 2, 3]} intensity={4} color={PALETTE.primary} distance={20} />
        <pointLight position={[4, -2, 3]} intensity={3} color={PALETTE.hlCyan} distance={20} />
        <Suspense fallback={null}>
          <Environment preset="night" />
          <NebulaBackground ctx={ctx} />
          <Stars radius={40} depth={30} count={2000} factor={3} saturation={0} fade speed={0.4} />
          <ParticleField ctx={ctx} />
          <QuantumCore ctx={ctx} />
          <Float speed={1} rotationIntensity={0.05} floatIntensity={0.15}>
            <Processor ctx={ctx} />
          </Float>
          <CameraRig ctx={ctx} />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={1.1} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur radius={0.85} />
          <ChromaticAberration
            offset={new THREE.Vector2(0.0006, 0.0008)}
            radialModulation={false}
            modulationOffset={0}
            blendFunction={BlendFunction.NORMAL}
          />
          <Vignette eskil={false} offset={0.15} darkness={0.7} />
        </EffectComposer>
      </Canvas>

      <WhiteFlash ctx={ctx} />

      {/* Typography */}
      <AnimatePresence>
        {showTypography && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute inset-x-0 bottom-[18%] flex flex-col items-center text-center"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
          >
            <RevealText
              text="Welcome to"
              className="text-sm md:text-base tracking-[0.4em] uppercase mb-4"
              style={{ color: PALETTE.primary3 }}
              delay={0}
            />
            <RevealText
              text="Society of Quantum Computing"
              className="text-3xl md:text-6xl font-semibold leading-tight"
              style={{
                background: `linear-gradient(120deg, ${PALETTE.text} 0%, ${PALETTE.primary3} 40%, ${PALETTE.hlCyan} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: `0 0 40px ${PALETTE.primary2}55`,
                filter: `drop-shadow(0 0 30px ${PALETTE.primary}55)`,
              }}
              delay={0.4}
            />
            <RevealText
              text="Where Quantum Ideas Become Reality"
              className="mt-6 text-sm md:text-lg tracking-[0.25em] uppercase"
              style={{ color: `${PALETTE.text}b0` }}
              delay={1.6}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button */}
      <AnimatePresence>
        {canSkip && !doneRef.current && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={skip}
            className="absolute bottom-8 right-8 px-5 py-2.5 rounded-full text-xs tracking-[0.3em] uppercase border transition hover:bg-white/10"
            style={{
              color: PALETTE.text,
              borderColor: `${PALETTE.primary3}55`,
              backgroundColor: `${PALETTE.bg1}80`,
              backdropFilter: "blur(8px)",
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            Skip Intro →
          </motion.button>
        )}
      </AnimatePresence>

      {/* Progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: `${PALETTE.primary}20` }}>
        <div
          className="h-full transition-none"
          style={{
            width: `${Math.min(100, (now / DURATION) * 100)}%`,
            background: `linear-gradient(90deg, ${PALETTE.primary}, ${PALETTE.hlMagenta}, ${PALETTE.hlCyan})`,
            boxShadow: `0 0 12px ${PALETTE.primary2}`,
          }}
        />
      </div>
    </div>
  );
}

function RevealText({
  text,
  className,
  style,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <div className={className} style={style} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: delay + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "inline-block", whiteSpace: ch === " " ? "pre" : "normal" }}
        >
          {ch}
        </motion.span>
      ))}
    </div>
  );
}
