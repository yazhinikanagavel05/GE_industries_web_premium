import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { hasFinePointer, prefersReducedMotion } from './prefersReducedMotion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
}

/** Gentle 3D tilt that follows the cursor. No-op on touch devices. */
export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', max = 7 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const enabled = useRef(hasFinePointer() && !prefersReducedMotion());

  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 140, damping: 16 });
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 140, damping: 16 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={enabled.current ? { rotateX, rotateY, transformPerspective: 1100 } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
};
