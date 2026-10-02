import React, { useEffect, useRef } from 'react';

interface VortexProps {
  discCount?: number;
  particleCount?: number;
  speed?: number;
  particleColor?: string;
  discColor?: string;
  particleSize?: number;
  depth?: number;
}

export const Vortex: React.FC<VortexProps> = ({
  discCount = 50,
  particleCount = 10000,
  speed = 0.05,
  particleColor = '#FFFFFF',
  discColor = 'rgba(200, 200, 200, 0.15)',
  particleSize = 0.5,
  depth = 1.7,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    let tick = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      tick += speed * 0.1; 
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2; 

      const particlesPerDisc = Math.floor(particleCount / discCount);

      for (let i = 0; i < discCount; i++) {
        // FIX 1: Subtract tick instead of adding it. 
        // A positive tick modulo a negative result behaves weirdly in JS, 
        // so we add 1000 to keep the base number positive before the modulo.
        const progress = ((i / discCount - tick + 1000) % 1);

        const z = Math.pow(progress, depth); 
        
        const radiusX = width * 0.9 * z;
        const radiusY = height * 0.45 * z;

        // FIX 2: Adjusted thresholds to mirror the inward motion seamlessly
        let opacity = 1;
        if (z < 0.1) {
          opacity = z / 0.1; // Smoothly vanish right as it hits the dead center
        } else if (z > 0.85) {
          opacity = (1 - z) / 0.15; // Smoothly fade in as it generates at the outer edge
        }

        if (opacity <= 0) continue;

        // 1. Draw structural disc
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = discColor;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = opacity * 0.5;
        ctx.stroke();

        // 2. Draw particles
        ctx.fillStyle = particleColor;
        const rotationOffset = tick * 4 + progress * Math.PI * 2;

        for (let j = 0; j < particlesPerDisc; j++) {
          const angle = (j / particlesPerDisc) * Math.PI * 2 + rotationOffset;

          const px = centerX + Math.cos(angle) * radiusX;
          const py = centerY + Math.sin(angle) * radiusY;

          ctx.beginPath();
          ctx.globalAlpha = opacity;
          ctx.arc(px, py, particleSize * (z + 0.5), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0; 
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [discCount, particleCount, speed, particleColor, discColor, particleSize, depth]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: '#000000',
      }}
    />
  );
};

export default Vortex;