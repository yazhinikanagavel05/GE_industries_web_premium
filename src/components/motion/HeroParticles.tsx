import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './prefersReducedMotion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
}

/**
 * Lightweight canvas of drifting "steel dust" points joined by faint lines.
 * Pauses off-screen / in background tabs, adapts to size, and is skipped
 * entirely for reduced-motion visitors.
 */
export const HeroParticles: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    const LINK_DIST = 120;

    const seed = () => {
      const count = Math.max(18, Math.min(56, Math.round((w * h) / 24000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -(0.08 + Math.random() * 0.28),
        r: 0.6 + Math.random() * 1.7,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx + Math.sin(t / 2600 + p.phase) * 0.08;
        p.y += p.vy;
        if (p.y < -6) {
          p.y = h + 6;
          p.x = Math.random() * w;
        }
        if (p.x < -6) p.x = w + 6;
        if (p.x > w + 6) p.x = -6;
      }

      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = dx * dx + dy * dy;
          if (d < LINK_DIST * LINK_DIST) {
            ctx.strokeStyle = `rgba(56,160,255,${(1 - Math.sqrt(d) / LINK_DIST) * 0.16})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const twinkle = 0.45 + 0.4 * Math.sin(t / 900 + p.phase);
        ctx.fillStyle = `rgba(160,210,255,${twinkle})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    start();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} aria-hidden="true" />;
};
