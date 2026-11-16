import { useRef, useEffect } from 'react';
import { GRID_TRAIL_REFERENCE, type GridSettings } from './gridSettings';

interface CloudParticle {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  vx: number;
  vy: number;
  angle: number;
  stretch: number;
  born: number;
  lifetime: number;
}

interface JellyMotion {
  x: number;
  y: number;
  heading: number;
  turn: number;
  speed: number;
  time: number;
}

// Preserve the original fallback palette when both default colors are selected.
const ORIGINAL_COLORS = [
  { r: 255, g: 255, b: 255 },
  { r: 110, g: 123, b: 240 },
  { r: 255, g: 145, b: 140 },
  { r: 130, g: 210, b: 255 },
  { r: 180, g: 140, b: 255 },
  { r: 255, g: 180, b: 120 },
];

function parseColor(hex: string) {
  const tint = Number.parseInt(hex.slice(1), 16);
  return { r: tint >> 16, g: (tint >> 8) & 255, b: tint & 255 };
}

export function CloudTrail({ settings }: { settings: GridSettings }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const jellyRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const jellyCanvas = jellyRef.current;
    if (!canvas || !jellyCanvas) return;
    const ctx = canvas.getContext('2d');
    const jellyContext = jellyCanvas.getContext('2d');
    if (!ctx || !jellyContext) return;

    const surface = canvas.parentElement;
    if (!surface || settings.strength === 0) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const particles: CloudParticle[] = [];
    const mainColor = parseColor(settings.trailColor);
    const coolingColor = settings.useMulticolor ? parseColor(settings.trailCoolingColor) : mainColor;
    const originalPalette = settings.useMulticolor
      && settings.trailColor === GRID_TRAIL_REFERENCE.trailColor
      && settings.trailCoolingColor === GRID_TRAIL_REFERENCE.trailCoolingColor;
    const palette = originalPalette ? ORIGINAL_COLORS : settings.useMulticolor ? [mainColor, coolingColor] : [mainColor];
    const spread = settings.radius / GRID_TRAIL_REFERENCE.radius;
    let lastPoint: { x: number; y: number; time: number; angle: number } | undefined;
    let jelly: JellyMotion | undefined;
    let distanceToNextPuff = 0;
    let speed = 0;
    let frame = 0;

    const clearPointer = () => {
      lastPoint = undefined;
      distanceToNextPuff = 0;
      speed = 0;
    };

    const resize = () => {
      canvas.width = surface.clientWidth;
      canvas.height = surface.clientHeight;
      const pixelRatio = window.devicePixelRatio || 1;
      jellyCanvas.width = Math.round(canvas.width * pixelRatio);
      jellyCanvas.height = Math.round(canvas.height * pixelRatio);
      jellyContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles.length = 0;
      jelly = undefined;
      clearPointer();
    };

    const drawJelly = (now: number) => {
      jellyContext.clearRect(0, 0, canvas.width, canvas.height);
      if (!jelly) return;

      const age = (now - jelly.time) / settings.fadeMs;
      if (age >= 1 || reducedMotion.matches) {
        jelly = undefined;
        return;
      }

      const alpha = (1 - Math.max(0, age)) ** settings.fadeCurve;
      const pulse = Math.sin(now / 105);
      const bellWidth = (14 + pulse * 2.8) * spread;
      const bellDepth = (16 - pulse * 2) * spread;
      const length = (40 + jelly.speed * 46) * spread;
      const color = originalPalette ? '125, 132, 220' : `${coolingColor.r}, ${coolingColor.g}, ${coolingColor.b}`;
      const head = originalPalette ? color : `${mainColor.r}, ${mainColor.g}, ${mainColor.b}`;

      jellyContext.save();
      jellyContext.translate(jelly.x, jelly.y);
      jellyContext.rotate(jelly.heading);
      jellyContext.globalAlpha = alpha;
      jellyContext.lineCap = 'round';

      const tail = jellyContext.createLinearGradient(0, 0, -length, 0);
      tail.addColorStop(0, `rgba(${color}, 0.65)`);
      tail.addColorStop(0.6, `rgba(${color}, 0.35)`);
      tail.addColorStop(1, `rgba(${color}, 0)`);
      jellyContext.strokeStyle = tail;
      jellyContext.lineWidth = 1.15;

      for (let strand = -2; strand <= 2; strand++) {
        jellyContext.beginPath();
        jellyContext.moveTo(-bellDepth * 0.22, strand * bellWidth * 0.27);
        for (let segment = 1; segment <= 22; segment++) {
          const progress = segment / 22;
          const sway = Math.sin(now / 135 - progress * 7 + strand * 0.56);
          const curl = (sway * 8 + jelly.turn * 22) * spread * progress ** 1.35;
          jellyContext.lineTo(
            -bellDepth * 0.22 - length * (1 - Math.abs(strand) * 0.09) * progress,
            strand * bellWidth * (0.27 + progress * 0.15) + curl,
          );
        }
        jellyContext.stroke();
      }

      const glow = jellyContext.createLinearGradient(-bellDepth / 2, 0, bellDepth, 0);
      glow.addColorStop(0, `rgba(${color}, 0.12)`);
      glow.addColorStop(0.55, `rgba(${head}, 0.48)`);
      glow.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
      jellyContext.beginPath();
      jellyContext.moveTo(-bellDepth * 0.20, -bellWidth);
      jellyContext.bezierCurveTo(bellDepth, -bellWidth, bellDepth, bellWidth, -bellDepth * 0.20, bellWidth);
      jellyContext.quadraticCurveTo(-bellDepth * 0.66, 0, -bellDepth * 0.20, -bellWidth);
      jellyContext.fillStyle = glow;
      jellyContext.fill();
      jellyContext.strokeStyle = `rgba(${color}, 0.55)`;
      jellyContext.stroke();
      jellyContext.restore();
    };

    const render = (now: number) => {
      frame = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (reducedMotion.matches) particles.length = 0;
      ctx.globalCompositeOperation = settings.useMulticolor ? 'screen' : 'source-over';

      for (let i = particles.length - 1; i >= 0; i--) {
        const puff = particles[i];
        const age = Math.max(0, (now - puff.born) / puff.lifetime);
        if (age >= 1) {
          particles.splice(i, 1);
          continue;
        }

        const drift = 1 - Math.exp(-2.6 * age);
        const radius = puff.radius * (0.76 + drift * 0.80);
        const alpha = puff.alpha * Math.min(1, age * 16) * (1 - age) ** settings.fadeCurve;

        ctx.save();
        ctx.translate(puff.x + puff.vx * drift, puff.y + puff.vy * drift);
        ctx.rotate(puff.angle);
        ctx.scale(puff.stretch, 1);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        gradient.addColorStop(0, `rgba(${puff.color}, ${alpha})`);
        gradient.addColorStop(0.2, `rgba(${puff.color}, ${alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(${puff.color}, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${puff.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
        ctx.restore();
      }

      drawJelly(now);
      if (particles.length || jelly) frame = requestAnimationFrame(render);
    };

    const emitPuff = (x: number, y: number, angle: number, turn: number, now: number) => {
      const { r, g, b } = palette[Math.floor(Math.random() * palette.length)];
      const lateral = ((Math.random() - 0.5) * (10 + 34 * speed) - turn * 18) * spread;
      const backward = (5 + speed * 30) * spread;

      particles.push({
        x: x - Math.sin(angle) * lateral * 0.3,
        y: y + Math.cos(angle) * lateral * 0.3,
        radius: (11 + Math.random() * 17 + speed * 14) * spread,
        color: `${r}, ${g}, ${b}`,
        alpha: 0.24 + Math.random() * 0.23,
        vx: -Math.cos(angle) * backward - Math.sin(angle) * lateral,
        vy: -Math.sin(angle) * backward + Math.cos(angle) * lateral,
        angle: angle + (Math.random() - 0.5) * 1.5,
        stretch: 0.85 + speed * 0.55 + Math.random() * 0.6,
        born: now,
        lifetime: settings.fadeMs * (0.40 + Math.random() * 0.52),
      });
    };

    const move = (event: PointerEvent) => {
      if (
        event.pointerType === 'touch' || reducedMotion.matches ||
        (event.target instanceof Element && event.target.closest('[data-ascii-settings]'))
      ) {
        clearPointer();
        return;
      }

      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (event.clientX - rect.left) * canvas.width / rect.width;
      const y = (event.clientY - rect.top) * canvas.height / rect.height;
      const now = performance.now();
      const previous = lastPoint;
      if (!previous || now - previous.time > 120) {
        clearPointer();
        lastPoint = { x, y, time: now, angle: 0 };
        return;
      }

      const dx = x - previous.x;
      const dy = y - previous.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 1) return;

      const elapsed = Math.max(4, now - previous.time);
      const nextSpeed = Math.min(1, distance / elapsed / 1.4);
      const angle = Math.atan2(dy, dx);
      const turn = Math.sin(angle - previous.angle) * speed;
      speed += (nextSpeed - speed) * (1 - Math.exp(-elapsed / 30));

      // Space clouds by distance so changing the mouse event rate does not change their density.
      let offset = Math.max(distanceToNextPuff, distance - 180);
      while (offset <= distance) {
        const progress = offset / distance;
        emitPuff(previous.x + dx * progress, previous.y + dy * progress, angle, turn, now);
        offset += 7 + Math.random() * 11 + speed * 6;
      }
      distanceToNextPuff = offset - distance;
      lastPoint = { x, y, time: now, angle };
      const heading = jelly
        ? jelly.heading + Math.atan2(Math.sin(angle - jelly.heading), Math.cos(angle - jelly.heading))
          * (1 - Math.exp(-elapsed / 38))
        : angle;
      jelly = { x, y, heading, speed, turn: (jelly?.turn ?? 0) * 0.7 + turn * 0.3, time: now };
      if (!frame) frame = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(surface);
    resize();
    surface.addEventListener('pointermove', move);
    surface.addEventListener('pointerleave', clearPointer);

    return () => {
      observer.disconnect();
      surface.removeEventListener('pointermove', move);
      surface.removeEventListener('pointerleave', clearPointer);
      cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      jellyContext.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [settings]);

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
          filter: settings.useMulticolor
            ? `blur(${20 * settings.radius / GRID_TRAIL_REFERENCE.radius}px) saturate(5) contrast(1.1) brightness(1.02)`
            : `blur(${9 * settings.radius / GRID_TRAIL_REFERENCE.radius}px) saturate(1.9)`,
          mixBlendMode: settings.useMulticolor ? 'plus-lighter' : 'normal',
          opacity: settings.strength / 100
        }}
      />
      <canvas
        aria-hidden="true"
        ref={jellyRef}
        className="pointer-events-none absolute inset-0 z-[1] size-full"
        style={{ opacity: settings.strength / 100 }}
      />
      {/* Texture Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.12]"
        style={{ filter: 'url(#grainy-noise)' }}
      />
    </>
  );
}