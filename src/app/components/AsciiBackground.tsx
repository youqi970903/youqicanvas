import { useEffect, useRef } from 'react';

import type { AsciiSettings } from './asciiSettings';

type Point = { x: number; y: number };
type Highlight = Point & { time: number; opacity: number; lifetime: number };

function noise(x: number, y: number, seed: number) {
  const hash = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ seed;
  return (Math.imul(hash ^ (hash >>> 13), 1274126177) >>> 0) / 4294967296;
}

function smooth(value: number) {
  return value * value * (3 - 2 * value);
}

function mix(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

export function AsciiBackground({ settings }: { settings: AsciiSettings }) {
  const backgroundRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const background = backgroundRef.current;
    const trail = trailRef.current;
    const surface = trail?.parentElement?.parentElement;
    const base = background?.getContext('2d');
    const ink = trail?.getContext('2d');
    if (!background || !trail || !surface || !base || !ink) return;

    const { cellSize, fontSize, font, radius, fadeMs, fadeCurve, characterColor, trailColor, strength } = settings;
    const patternRows = settings.pattern.split('\n').map((row) => Array.from(row));
    const glyphs = Array.from(settings.trailCharacters);
    const tileSize = cellSize - 1;
    const halfTile = tileSize / 2;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highlights = new Map<number, Highlight>();
    let previous: (Point & { time: number }) | undefined;
    let previousDirection: Point | undefined;
    let speed = 0;
    let trailPhase = 0;
    let strokeSeed = 0;
    let frame = 0;
    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;

    const resize = () => {
      width = surface.clientWidth;
      height = surface.clientHeight;
      columns = Math.ceil(width / cellSize);
      rows = Math.ceil(height / cellSize);
      const ratio = window.devicePixelRatio || 1;

      for (const [canvas, context] of [[background, base], [trail, ink]] as const) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.font = `${fontSize}px ${font}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
      }

      base.fillStyle = characterColor;
      for (let row = 0; row < rows; row++) {
        const pattern = patternRows[row % patternRows.length];
        if (!pattern.length) continue;
        for (let column = 0; column < columns; column++) {
          const glyph = pattern[column % pattern.length];
          if (!glyph.trim()) continue;

          const x = (column + 0.5) * cellSize;
          const y = (row + 0.5) * cellSize;
          const variation = ((column * 73 + row * 137) % 31) / 30;
          base.globalAlpha = 0.08 + variation * 0.18;
          base.fillRect(x - halfTile, y - halfTile, tileSize, tileSize);
          base.globalAlpha = 0.65 + variation * 0.35;
          base.fillText(glyph, x, y);
        }
      }

      highlights.clear();
      leave();
    };

    const opacityAt = (highlight: Highlight, now: number) =>
      highlight.opacity * Math.max(0, 1 - Math.max(0, now - highlight.time) / highlight.lifetime) ** fadeCurve;

    const draw = (now: number) => {
      frame = 0;
      ink.clearRect(0, 0, width, height);
      if (reducedMotion.matches) highlights.clear();

      for (const [key, highlight] of highlights) {
        const opacity = opacityAt(highlight, now);
        if (opacity < 0.035) {
          highlights.delete(key);
          continue;
        }

        ink.fillStyle = trailColor;
        const alpha = opacity * strength / 100;
        ink.globalAlpha = alpha * 0.32;
        ink.fillRect(highlight.x - halfTile, highlight.y - halfTile, tileSize, tileSize);
        ink.globalAlpha = alpha;
        const glyph = glyphs[Math.round(opacity * (glyphs.length - 1))];
        ink.fillText(glyph, highlight.x, highlight.y);
      }
      if (highlights.size) frame = requestAnimationFrame(draw);
    };

    const illuminate = (point: Point, direction: Point, phase: number, turn: number, now: number) => {
      const segment = Math.floor(phase);
      const progress = smooth(phase - segment);
      const variation = (channel: number) =>
        mix(noise(segment, channel, strokeSeed), noise(segment + 1, channel, strokeSeed), progress);
      const bend = (variation(1) - 0.5) * 0.9;
      const trailWidth = 0.14 + speed * 0.25 + variation(2) * 0.34;
      const trailLength = 0.25 + speed * 0.40 + variation(3) * 0.35;
      const forwardReach = 0.18 + speed * 0.14 + variation(4) * 0.22;
      const drift = (variation(5) - 0.5) * 0.65 + turn * 0.50;
      const patchSize = Math.max(2, radius / cellSize * 0.33);
      const offsetX = variation(6) * 2;
      const offsetY = variation(7) * 2;
      const left = Math.max(0, Math.floor((point.x - radius) / cellSize));
      const top = Math.max(0, Math.floor((point.y - radius) / cellSize));
      const right = Math.min(columns - 1, Math.floor((point.x + radius) / cellSize));
      const bottom = Math.min(rows - 1, Math.floor((point.y + radius) / cellSize));

      for (let row = top; row <= bottom; row++) {
        for (let column = left; column <= right; column++) {
          const x = (column + 0.5) * cellSize;
          const y = (row + 0.5) * cellSize;
          const dx = (x - point.x) / radius;
          const dy = (y - point.y) / radius;
          const along = dx * direction.x + dy * direction.y;
          const across = dy * direction.x - dx * direction.y;
          const centerline = along * bend + along * along * drift;
          const distance = Math.hypot(
            along / (along < 0 ? trailLength : forwardReach),
            (across - centerline) / trailWidth,
          );


          // Blend neighboring patches, then use finer noise to break up their edges.
          const patchX = column / patchSize + offsetX;
          const patchY = row / patchSize + offsetY;
          const patchColumn = Math.floor(patchX);
          const patchRow = Math.floor(patchY);
          const blendX = smooth(patchX - patchColumn);
          const blendY = smooth(patchY - patchRow);
          const topPatch = mix(noise(patchColumn, patchRow, strokeSeed), noise(patchColumn + 1, patchRow, strokeSeed), blendX);
          const bottomPatch = mix(noise(patchColumn, patchRow + 1, strokeSeed), noise(patchColumn + 1, patchRow + 1, strokeSeed), blendX);
          const cluster = mix(topPatch, bottomPatch, blendY);
          const grain = noise(column, row, strokeSeed ^ 0x5bd1e995);

          // Quick sweeps scatter a few tiles past the main edge.
          const edge = 0.72 + cluster * 0.28 + speed * grain * 0.40;
          const falloff = Math.max(0, 1 - distance / edge);
          const coverage = Math.max(0, cluster - 0.25) * falloff * 3.2;
          if (grain > coverage) continue;

          const opacity = falloff * (0.42 + cluster * 0.58);
          if (opacity < 0.06) continue;

          const key = row * columns + column;
          const highlight = highlights.get(key);
          if (!highlight || opacity > opacityAt(highlight, now)) {
            const lifetime = fadeMs * Math.min(1, 0.35 + speed * 0.2 + cluster * 0.35 + grain * 0.25);
            highlights.set(key, { x, y, opacity, time: now, lifetime });
          }
        }
      }
    };

    const move = (event: PointerEvent) => {
      if (
        event.pointerType === 'touch' ||
        reducedMotion.matches ||
        !glyphs.length ||
        strength === 0 ||
        (event.target instanceof Element && event.target.closest('[data-ascii-settings]'))
      ) {
        leave();
        return;
      }
      const rect = trail.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const point = {
        x: (event.clientX - rect.left) * width / rect.width,
        y: (event.clientY - rect.top) * height / rect.height,
      };
      const now = performance.now();

      const dx = previous ? point.x - previous.x : 0;
      const dy = previous ? point.y - previous.y : 0;
      const movement = Math.hypot(dx, dy);
      if (previous && movement < 1) return;

      const direction = movement ? { x: dx / movement, y: dy / movement } : { x: 1, y: 0 };
      const elapsed = previous ? Math.max(8, now - previous.time) : 0;
      const targetSpeed = elapsed ? Math.min(1, movement / elapsed / 1.25) : 0;
      speed += (targetSpeed - speed) * (1 - Math.exp(-elapsed / 30));

      const turn = previousDirection && elapsed < 100
        ? previousDirection.x * direction.y - previousDirection.y * direction.x
        : 0;
      if (previous) {
        const phaseAdvance = movement / 54;
        const steps = Math.min(18, Math.ceil(movement / 28));
        for (let step = 1; step < steps; step++) {
          const progress = step / steps;
          illuminate(
            { x: previous.x + dx * progress, y: previous.y + dy * progress },
            direction,
            trailPhase + phaseAdvance * progress,
            turn * progress,
            now,
          );
        }
        trailPhase += phaseAdvance;
      } else {
        trailPhase = 0;
        strokeSeed = Math.floor(Math.random() * 4294967296);
      }

      illuminate(point, direction, trailPhase, turn, now);
      previous = { ...point, time: now };
      previousDirection = movement ? direction : undefined;
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const leave = () => {
      previous = undefined;
      previousDirection = undefined;
      speed = 0;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(surface);
    resize();
    surface.addEventListener('pointermove', move);
    surface.addEventListener('pointerleave', leave);

    return () => {
      observer.disconnect();
      surface.removeEventListener('pointermove', move);
      surface.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(frame);
    };
  }, [settings]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundColor: settings.backgroundColor }}>
      <canvas ref={backgroundRef} className="absolute inset-0 size-full" />
      <canvas ref={trailRef} className="absolute inset-0 size-full" />
    </div>
  );
}
