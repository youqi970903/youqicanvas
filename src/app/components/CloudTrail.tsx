import React, { useRef, useEffect } from 'react';

interface CloudParticle {
  x: number;
  y: number;
  size: number;
  color: { r: number; g: number; b: number };
  alpha: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  type: 'blob' | 'particle';
}

const COLORS = [
  { r: 255, g: 255, b: 255 }, // Pure Bright White
  { r: 110, g: 123, b: 240 }, // Vibrant Periwinkle Blue
  { r: 255, g: 145, b: 140 }, // Vibrant Rose Peach
  { r: 130, g: 210, b: 255 }, // Vibrant Sky Blue
  { r: 180, g: 140, b: 255 }, // Vibrant Lavender
  { r: 255, g: 180, b: 120 }, // Warm Apricot
];

export function CloudTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<CloudParticle[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Only spawn if mouse is within the canvas bounds
      if (mouseX < 0 || mouseY < 0 || mouseX > rect.width || mouseY > rect.height) return;

      const dx = mouseX - lastMousePos.current.x;
      const dy = mouseY - lastMousePos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 1) { 
        // Larger blobs for a more substantial trail
        const blobCount = Math.min(Math.floor(speed / 2), 1);
        for (let i = 0; i < blobCount; i++) {
          const spawnX = lastMousePos.current.x + dx * (i / blobCount);
          const spawnY = lastMousePos.current.y + dy * (i / blobCount);
          
          const color = COLORS[Math.floor(Math.random() * COLORS.length)];
          const isWhite = color.r === 255 && color.g === 255 && color.b === 255;
          
          particles.current.push({
            x: spawnX,
            y: spawnY,
            size: (Math.random() * 2 + 12) * (1 + speed / 15),
            color: color,
            alpha: isWhite 
              ? 0.18 + Math.random() * 0.10 // Boosted white brightness
              : 0.35 + Math.random() * 0.18,
            vx: -dx * 0.04 + (Math.random() - 0.5) * 2.5,
            vy: -dy * 0.04 + (Math.random() - 0.5) * 2.5,
            life: 1,
            maxLife: 0.01 + Math.random() * 0.01,
            type: 'blob'
          });
        }

        const partCount = Math.min(Math.floor(speed / 2), 2);
        for (let i = 0; i < partCount; i++) {
          const spawnX = lastMousePos.current.x + dx * (i / partCount);
          const spawnY = lastMousePos.current.y + dy * (i / partCount);
          
          particles.current.push({
            x: spawnX,
            y: spawnY,
            size: Math.random() * 4 + 2,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            alpha: 0.2 + Math.random() * 0.1,
            vx: -dx * 0.05 + (Math.random() - 0.5) * 1,
            vy: -dy * 0.05 + (Math.random() - 0.5) * 1,
            life: 1,
            maxLife: 0.05 + Math.random() * 0.05,
            type: 'particle'
          });
        }
      }

      lastMousePos.current = { x: mouseX, y: mouseY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Using 'screen' creates that luminous "bright white" look where colors overlap
      ctx.globalCompositeOperation = 'screen';

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        
        // Ensure values are finite to prevent canvas errors
        if (!Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(p.size) || p.size <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.maxLife;
        
        if (p.type === 'blob') {
          p.size += 0.8;
        } else {
          p.size *= 0.99;
        }
        
        p.vx *= 0.98;
        p.vy *= 0.98;

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        // Double check size again before creating gradient
        const radius = Math.max(0.1, p.size);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        const { r, g, b } = p.color;
        const alpha = p.life * p.alpha;
        
        const colorStr = `${r}, ${g}, ${b}`;
        // Tighter hot-spot in the center for that "bright glow"
        gradient.addColorStop(0, `rgba(${colorStr}, ${alpha})`);
        gradient.addColorStop(0.2, `rgba(${colorStr}, ${alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(${colorStr}, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${colorStr}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Secondary mixing layer with offset color
        if (p.type === 'blob' && p.life > 0.4 && Math.random() > 0.7) {
          const mixColor = COLORS[Math.floor(Math.random() * COLORS.length)];
          ctx.fillStyle = `rgba(${mixColor.r}, ${mixColor.g}, ${mixColor.b}, ${alpha * 0.2})`;
          ctx.beginPath();
          ctx.arc(p.x + (Math.random() - 0.5) * 20, p.y + (Math.random() - 0.5) * 20, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <svg className="sr-only">
        <filter id="grainy-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.14" />
          </feComponentTransfer>
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </svg>
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-[0]"
        style={{ 
          filter: 'blur(20px) saturate(5) contrast(1.1) brightness(1.02)',
          mixBlendMode: 'plus-lighter', // Best for luminous bright whites
          opacity: 0.55
        }}
      />
      {/* Texture Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.12]"
        style={{ filter: 'url(#grainy-noise)' }}
      />
    </>
  );
}