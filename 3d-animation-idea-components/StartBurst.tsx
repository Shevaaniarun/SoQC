"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  length: number;
  speedModifier: number;
}

export default function Starburst() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    
    // Massive density with ultra-slow speeds for seamless, long filaments
    const numStars = 4000; 
    const baseSpeed = 0.25; 

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        const angle = Math.PI + Math.random() * Math.PI; // Perfect hemisphere arc upwards
        const distance = Math.random() * canvas.width;
        
        stars.push({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          z: Math.random() * canvas.width,
          length: 40 + Math.random() * 80, // Gives the rays a long, sleek, streaked body
          speedModifier: 0.7 + Math.random() * 0.6 // Smooth variations in speed
        });
      }
    };

    const animate = () => {
      // 1. Draw the absolute pitch-black space base
      ctx.fillStyle = "#050306";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height;

      // 2. Render the Smooth Continuous Starburst Lines
      for (let i = 0; i < numStars; i++) {
        const star = stars[i];

        // Move depth incredibly smoothly
        star.z -= baseSpeed * star.speedModifier;

        // Recycle seamlessly when they go past screen view
        if (star.z <= 0) {
          const angle = Math.PI + Math.random() * Math.PI;
          const distance = Math.random() * canvas.width;
          star.x = Math.cos(angle) * distance;
          star.y = Math.sin(angle) * distance;
          star.z = canvas.width;
        }

        // Current coordinate calculation
        const k = 700 / star.z;
        const sx = star.x * k + cx;
        const sy = star.y * k + cy;

        // Tail coordinate calculation (creates the long, smooth line shape instead of a droplet)
        const kTail = 700 / (star.z + star.length);
        const tx = star.x * kTail + cx;
        const ty = star.y * kTail + cy;

        // Render only if within visible screen bounds
        if (sx >= 0 && sx <= canvas.width && sy <= canvas.height) {
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(sx, sy);

          // Deep purple to lavender falloff calculation
          const alpha = Math.min(0.35, (1 - star.z / canvas.width) * 0.4);
          ctx.strokeStyle = `rgba(155, 105, 185, ${alpha})`;
          ctx.lineWidth = 0.65; // Keeps lines fine, threaded, and elegant
          ctx.stroke();
        }
      }

      // 3. Draw the Blur Shade Horizon Overlay (Matches the image's vibrant glowing base)
      const horizonGradient = ctx.createRadialGradient(
        cx, cy, 10,           // Inner circle at bottom center
        cx, cy, canvas.height * 0.65 // Large outer radius spreading upwards
      );
      
      horizonGradient.addColorStop(0, "rgba(84, 43, 96, 0.45)");  // Deep misty magenta/purple at center
      horizonGradient.addColorStop(0.3, "rgba(43, 23, 56, 0.25)"); // Mid-tone ambient purple blur
      horizonGradient.addColorStop(0.7, "rgba(15, 8, 22, 0.05)");  // Fades softly into deep space black
      horizonGradient.addColorStop(1, "rgba(5, 3, 6, 0)");         // Perfectly transparent at borders

      ctx.fillStyle = horizonGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050306]">
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
}