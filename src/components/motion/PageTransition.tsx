import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { prefersReducedMotion } from './prefersReducedMotion';

/**
 * Soft fade whenever the route changes. Opacity only — a transform here would
 * become the containing block for position:fixed descendants mid-animation.
 */
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  if (prefersReducedMotion()) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};
