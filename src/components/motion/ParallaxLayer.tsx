import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { prefersReducedMotion } from './prefersReducedMotion';

interface ParallaxLayerProps {
  children?: React.ReactNode;
  className?: string;
  /** Pixels of vertical travel across the first 900px of scroll (negative = drifts up). */
  distance?: number;
}

/** Decorative layer that drifts at a different speed to the page while scrolling. */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ children, className = '', distance = 120 }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, distance]);
  return (
    <motion.div style={prefersReducedMotion() ? undefined : { y }} className={className} aria-hidden="true">
      {children}
    </motion.div>
  );
};
